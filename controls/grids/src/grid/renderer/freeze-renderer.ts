import { remove, addClass } from '@syncfusion/ej2-base';
import { IGrid, IRenderer, IModelGenerator, NotifyArgs } from '../base/interface';
import { Column } from '../models/column';
import { HeaderRender } from './header-renderer';
import { ContentRender } from './content-renderer';
import { ServiceLocator } from '../services/service-locator';
import { FreezeRowModelGenerator } from '../services/freeze-row-model-generator';
import * as events from '../base/constant';
import { renderMovable, getScrollBarWidth, wrap } from '../base/util';

/**
 * Freeze module is used to render grid content with frozen rows and columns
 * @hidden
 */
export class FreezeContentRender extends ContentRender implements IRenderer {
    private frozenContent: Element;
    private movableContent: Element;

    constructor(parent?: IGrid, locator?: ServiceLocator) {
        super(parent, locator);
    }

    public renderPanel(): void {
        super.renderPanel();
        let fDiv: Element = this.parent.createElement('div', { className: 'e-frozencontent' });
        let mDiv: Element = this.parent.createElement('div', { className: 'e-movablecontent' });
        this.getPanel().firstChild.appendChild(fDiv);
        this.getPanel().firstChild.appendChild(mDiv);
        this.setFrozenContent(fDiv);
        this.setMovableContent(mDiv);
    }

    public renderEmpty(tbody: HTMLElement): void {
        super.renderEmpty(tbody);
        this.getMovableContent().querySelector('tbody').innerHTML = '<tr><td></td></tr>';
        this.getFrozenContent().querySelector('.e-emptyrow').querySelector('td').colSpan = this.parent.getFrozenColumns();
        (this.getFrozenContent() as HTMLElement).style.borderRightWidth = '0px';
        if (this.parent.frozenRows) {
            this.parent.getHeaderContent().querySelector('.e-frozenheader').querySelector('tbody').innerHTML = '';
            this.parent.getHeaderContent().querySelector('.e-movableheader').querySelector('tbody').innerHTML = '';
        }
    }

    private setFrozenContent(ele: Element): void {
        this.frozenContent = ele;
    }

    private setMovableContent(ele: Element): void {
        this.movableContent = ele;
    }

    public getFrozenContent(): Element {
        return this.frozenContent;
    }

    public getMovableContent(): Element {
        return this.movableContent;
    }

    public getModelGenerator(): IModelGenerator<Column> {
        return new FreezeRowModelGenerator(this.parent);
    }

    public renderTable(): void {
        super.renderTable();
        this.getFrozenContent().appendChild(this.getTable());
        let mTbl: Element = this.getTable().cloneNode(true) as Element;
        this.getMovableContent().appendChild(mTbl);
        remove(this.getMovableContent().querySelector('colgroup'));
        let colGroup: Element
            = ((this.parent.getHeaderContent().querySelector('.e-movableheader').querySelector('colgroup')).cloneNode(true)) as Element;
        mTbl.insertBefore(colGroup, mTbl.querySelector('tbody'));
    }
}

export class FreezeRender extends HeaderRender implements IRenderer {
    private frozenHeader: Element;
    private movableHeader: Element;

    constructor(parent?: IGrid, locator?: ServiceLocator) {
        super(parent, locator);
        this.addEventListener();
    }

    public addEventListener(): void {
        this.parent.on(events.freezeRender, this.refreshFreeze, this);
        this.parent.on(events.frozenHeight, this.setFrozenHeight, this);
        this.parent.on(events.uiUpdate, this.enableAfterRender, this);
    }

    public removeEventListener(): void {
        if (this.parent.isDestroyed) { return; }
        this.parent.off(events.frozenHeight, this.setFrozenHeight);
        this.parent.off(events.uiUpdate, this.enableAfterRender);
    }

    public renderTable(): void {
        super.renderTable();
        this.rfshMovable();
        this.updateColgroup();
        this.initializeHeaderDrag();
        this.initializeHeaderDrop();
        this.parent.notify(events.headerRefreshed, { rows: this.rows, args: { isFrozen: false } });
    }

    public renderPanel(): void {
        super.renderPanel();
        let fDiv: Element = this.parent.createElement('div', { className: 'e-frozenheader' });
        let mDiv: Element = this.parent.createElement('div', { className: 'e-movableheader' });
        this.getPanel().firstChild.appendChild(fDiv);
        this.getPanel().firstChild.appendChild(mDiv);
        this.setFrozenHeader(fDiv);
        this.setMovableHeader(mDiv);
    }

    public refreshUI(): void {
        let tbody: Element = this.getMovableHeader().querySelector('tbody');
        remove(this.getMovableHeader().querySelector('table'));
        super.refreshUI();
        this.rfshMovable();
        this.getMovableHeader().querySelector('tbody').innerHTML = tbody.innerHTML;
        this.updateColgroup();
        this.widthService.setWidthToTable();
        if (this.parent.allowTextWrap && this.parent.textWrapSettings.wrapMode === 'Header') {
            wrap([].slice.call(this.movableHeader.querySelectorAll('tr.e-columnheader')), true);
        }
        this.parent.updateDefaultCursor();
        renderMovable(this.parent.getContentTable().querySelector('colgroup'), this.parent.getFrozenColumns());
        this.initializeHeaderDrag();
        this.parent.notify(events.headerRefreshed, { rows: this.rows, args: { isFrozen: false } });
    }

    private rfshMovable(): void {
        this.getFrozenHeader().appendChild(this.getTable());
        this.getMovableHeader().appendChild(this.createTable());
        this.refreshStackedHdrHgt();
        this.addMovableFirstCls();
    }

    private addMovableFirstCls(): void {
        if (this.parent.getVisibleFrozenColumns()) {
            let movablefirstcell: NodeListOf<Element> =
                this.parent.element.querySelector('.e-movableheader').querySelector('thead').querySelectorAll('.e-columnheader');
            let len: number =
                this.parent.element.querySelector('.e-movableheader').querySelector('thead').querySelectorAll('.e-columnheader').length;
            for (let i: number = 0; i < len; i++) {
                let cells: string = 'cells';
                let element: Element = movablefirstcell[i][cells][0];
                if (element) {
                    addClass([element], ['e-movablefirst']);
                    if (movablefirstcell[i][cells][0].rowSpan > 1) {
                        i = i + (movablefirstcell[i][cells][0].rowSpan - 1);
                    }
                }
            }
        }
    }

    private refreshFreeze(obj: { case: string, isModeChg?: boolean }): void {
        if (obj.case === 'filter') {
            let filterRow: Element = this.getTable().querySelector('.e-filterbar');
            if (this.parent.allowFiltering && filterRow && this.getMovableHeader().querySelector('thead')) {
                this.getMovableHeader().querySelector('thead')
                    .appendChild(renderMovable(filterRow, this.parent.getFrozenColumns()));
            }
        } else if (obj.case === 'textwrap' || obj.case === 'refreshHeight') {
            let fRows: NodeListOf<HTMLElement>;
            let mRows: NodeListOf<HTMLElement>;
            let fHdr: Element = this.getFrozenHeader();
            let mHdr: Element = this.getMovableHeader();
            let cont: Element = this.parent.getContent();
            let wrapMode: string = this.parent.textWrapSettings.wrapMode;
            let hdrClassList: DOMTokenList = (this.parent.getHeaderContent().firstChild as Element).classList;
            if (obj.case === 'textwrap') {
                if (wrapMode !== 'Header' || obj.isModeChg) {
                    fRows = cont.querySelector('.e-frozencontent').querySelectorAll('tr') as NodeListOf<HTMLElement>;
                    mRows = cont.querySelector('.e-movablecontent').querySelectorAll('tr') as NodeListOf<HTMLElement>;
                    this.setWrapHeight(fRows, mRows, obj.isModeChg, true);
                }
                if (wrapMode === 'Content' && this.parent.allowTextWrap) {
                    hdrClassList.add('e-wrap');
                } else {
                    hdrClassList.remove('e-wrap');
                }
                if (wrapMode === 'Both' || obj.isModeChg) {
                    fRows = fHdr.querySelectorAll('tr') as NodeListOf<HTMLElement>;
                    mRows = mHdr.querySelectorAll('tr') as NodeListOf<HTMLElement>;
                } else {
                    fRows = fHdr.querySelector(wrapMode === 'Content' ?
                        'tbody' : 'thead').querySelectorAll('tr') as NodeListOf<HTMLElement>;
                    mRows = mHdr.querySelector(wrapMode === 'Content' ?
                        'tbody' : 'thead').querySelectorAll('tr') as NodeListOf<HTMLElement>;
                }
                if (!this.parent.getHeaderContent().querySelectorAll('.e-stackedheadercell').length) {
                    this.setWrapHeight(fRows, mRows, obj.isModeChg, false, this.colDepth > 1);
                }
                this.refreshStackedHdrHgt();
            } else if (obj.case === 'refreshHeight') {
            this.setWrapHeight(cont.querySelector('.e-frozencontent').querySelectorAll('tr'),
                               cont.querySelector('.e-movablecontent').querySelectorAll('tr'), obj.isModeChg);
            this.setWrapHeight(fHdr.querySelectorAll('tr'), mHdr.querySelectorAll('tr'), obj.isModeChg);
            }
        }
    }
    private enableAfterRender(e: NotifyArgs): void {
        if (e.module === 'scroll') {
            this.setFrozenHeight();
        }
    }

    private updateResizeHandler(): void {
        [].slice.call(this.parent.getHeaderContent().querySelectorAll('.e-rhandler')).forEach((ele: HTMLElement) => {
            ele.style.height = ele.parentElement.offsetHeight + 'px';
        });
    }

    private setWrapHeight(
        fRows: NodeListOf<HTMLElement>, mRows: NodeListOf<HTMLElement>, isModeChg: boolean,
        isContReset?: boolean, isStackedHdr?: boolean): void {
        let fRowHgt: number;
        let mRowHgt: number;
        let isWrap: boolean = this.parent.allowTextWrap;
        let wrapMode: string = this.parent.textWrapSettings.wrapMode;
        let tHead: Element = this.parent.getHeaderContent().querySelector('thead');
        let tBody: Element = this.parent.getHeaderContent().querySelector('tbody');
        let height: number[] = [];
        let width: number[] = [];
        for (let i: number = 0, len: number = fRows.length; i < len; i++) { //separate loop for performance issue 
            if (!fRows[i].classList.contains('e-columnheader')) {
                height[i] = fRows[i].offsetHeight; //https://pagebuildersandwich.com/increased-plugins-performance-200/
                width[i] = mRows[i].offsetHeight;
            }
        }
        for (let i: number = 0, len: number = fRows.length; i < len; i++) {
            if (isModeChg && ((wrapMode === 'Header' && isContReset) || ((wrapMode === 'Content' && tHead.contains(fRows[i]))
                || (wrapMode === 'Header' && tBody.contains(fRows[i])))) || isStackedHdr) {
                fRows[i].style.height = null;
                mRows[i].style.height = null;
            }
            fRowHgt = height[i];
            mRowHgt = width[i];
            if (fRows[i].childElementCount && ((isWrap && fRowHgt < mRowHgt) || (!isWrap && fRowHgt < mRowHgt) ||
                (this.parent.allowResizing && this.parent.resizeModule && !this.parent.resizeModule.isFrozenColResized))) {
                fRows[i].style.height = mRowHgt + 'px';
            }
            if (mRows[i].childElementCount && ((isWrap && fRowHgt > mRowHgt) || (!isWrap && fRowHgt > mRowHgt) ||
                (this.parent.allowResizing && this.parent.resizeModule && this.parent.resizeModule.isFrozenColResized))) {
                mRows[i].style.height = fRowHgt + 'px';
            }
        }
        if (isWrap) {
            this.setFrozenHeight();
        }
    }

    private setFrozenHeight(height: number = getScrollBarWidth()): void {
        let movableContentHeight: number = this.parent.element.querySelector('.e-movablecontent').getBoundingClientRect().height;
        let movableContent: HTMLElement = this.parent.element.querySelector('.e-movablecontent') as HTMLElement;
        let frozenContent: HTMLElement = this.parent.element.querySelector('.e-frozencontent') as HTMLElement;
        if (movableContent.scrollWidth - movableContent.clientWidth) {
            frozenContent.style.height = movableContentHeight -
                height + 'px';
            frozenContent.style.borderBottom = '';
        } else {
            frozenContent.style.height = movableContentHeight + 'px';
            if ((frozenContent.scrollHeight <= frozenContent.clientHeight) ||
                (movableContent.scrollHeight <= movableContent.clientHeight)) {
                this.parent.scrollModule.removePadding();
            }
            frozenContent.style.borderBottom = '0px';
        }
    }

    private refreshStackedHdrHgt(): void {
        let fRowSpan: { min: number, max: number };
        let mRowSpan: { min: number, max: number };
        let fTr: NodeListOf<Element> = this.getFrozenHeader().querySelectorAll('.e-columnheader');
        let mTr: NodeListOf<Element> = this.getMovableHeader().querySelectorAll('.e-columnheader');
        for (let i: number = 0, len: number = fTr.length; i < len; i++) {
            fRowSpan = this.getRowSpan(fTr[i]);
            mRowSpan = this.getRowSpan(mTr[i]);
            if (fRowSpan.min > 1) {
                this.updateStackedHdrRowHgt(i, fRowSpan.max, fTr[i], mTr);
            } else if (mRowSpan.min > 1) {
                this.updateStackedHdrRowHgt(i, mRowSpan.max, mTr[i], fTr);
            }
        }
        if (this.parent.allowResizing) {
            this.updateResizeHandler();
        }
    }

    private getRowSpan(row: Element): { min: number, max: number } {
        let rSpan: number;
        let minRowSpan: number;
        let maxRowSpan: number;
        for (let i: number = 0, len: number = row.childElementCount; i < len; i++) {
            if (i === 0) {
                minRowSpan = (row.children[0] as HTMLTableDataCellElement).rowSpan;
            }
            rSpan = (row.children[i] as HTMLTableDataCellElement).rowSpan;
            minRowSpan = Math.min(rSpan, minRowSpan);
            maxRowSpan = Math.max(rSpan, minRowSpan);
        }
        return { min: minRowSpan, max: maxRowSpan };
    }

    private updateStackedHdrRowHgt(idx: number, maxRowSpan: number, row: Element, rows: NodeListOf<Element>): void {
        let height: number = 0;
        for (let i: number = 0; i < maxRowSpan; i++) {
            height += (rows[idx + i] as HTMLElement).style.height ?
                parseInt((rows[idx + i] as HTMLElement).style.height, 10) : (rows[idx + i] as HTMLElement).offsetHeight;
        }
        (row as HTMLElement).style.height = height + 'px';
    }

    private setFrozenHeader(ele: Element): void {
        this.frozenHeader = ele;
    }

    private setMovableHeader(ele: Element): void {
        this.movableHeader = ele;
    }

    public getFrozenHeader(): Element {
        return this.frozenHeader;
    }

    public getMovableHeader(): Element {
        return this.movableHeader;
    }

    private updateColgroup(): void {
        let mTable: Element = this.getMovableHeader().querySelector('table');
        remove(this.getMovableHeader().querySelector('colgroup'));
        mTable.insertBefore(
            renderMovable(this.getFrozenHeader().querySelector('colgroup'), this.parent.getFrozenColumns()),
            mTable.querySelector('thead'));
    }
}