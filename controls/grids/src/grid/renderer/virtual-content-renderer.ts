import { remove, createElement, closest, formatUnit, Browser } from '@syncfusion/ej2-base';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { DataManager } from '@syncfusion/ej2-data';
import { IGrid, IRenderer, NotifyArgs, VirtualInfo, IModelGenerator, InterSection } from '../base/interface';
import { Column } from '../models/column';
import { Row } from '../models/row';
import { dataReady, modelChanged, refreshVirtualBlock, contentReady } from '../base/constant';
import * as events from '../base/constant';
import { SentinelType, Offsets } from '../base/type';
import { RenderType } from '../base/enum';
import { ContentRender } from './content-renderer';
import { HeaderRender } from './header-renderer';
import { ServiceLocator } from '../services/service-locator';
import { InterSectionObserver } from '../services/intersection-observer';
import { RendererFactory } from '../services/renderer-factory';
import { VirtualRowModelGenerator } from '../services/virtual-row-model-generator';
import { isGroupAdaptive } from '../base/util';
import { setStyleAttribute } from '@syncfusion/ej2-base';
/**
 * VirtualContentRenderer
 * @hidden
 */
export class VirtualContentRenderer extends ContentRender implements IRenderer {
    private count: number;
    private maxPage: number;
    private maxBlock: number;
    private prevHeight: number = 0;
    private observer: InterSectionObserver;
    private prevInfo: VirtualInfo;
    private currentInfo: VirtualInfo = {};
    private vgenerator: VirtualRowModelGenerator;
    private header: VirtualHeaderRenderer;
    private locator: ServiceLocator;
    private preventEvent: boolean = false;
    private actions: string[] = ['filtering', 'searching', 'grouping', 'ungrouping'];
    private content: HTMLElement;
    private offsets: { [x: number]: number } = {};
    private tmpOffsets: { [x: number]: number } = {};
    private virtualEle: VirtualElementHandler = new VirtualElementHandler();
    private offsetKeys: string[] = [];
    private isFocused: boolean = false;
    private isSelection: boolean = false;
    private selectedRowIndex: number;

    constructor(parent: IGrid, locator?: ServiceLocator) {
        super(parent, locator);
        this.locator = locator;
        this.eventListener('on');
        this.parent.on(events.columnVisibilityChanged, this.setVisible, this);
        this.vgenerator = <VirtualRowModelGenerator>this.generator;
    }

    public renderTable(): void {
        this.header = <VirtualHeaderRenderer>this.locator.getService<RendererFactory>('rendererFactory').getRenderer(RenderType.Header);
        super.renderTable();
        this.virtualEle.table = <HTMLElement>this.getTable();
        this.virtualEle.content = this.content = <HTMLElement>this.getPanel().firstChild;
        this.virtualEle.renderWrapper(<number>this.parent.height);
        this.virtualEle.renderPlaceHolder();
        this.virtualEle.wrapper.style.position = 'absolute';
        let debounceEvent: boolean = (this.parent.dataSource instanceof DataManager && !this.parent.dataSource.dataSource.offline);
        let opt: InterSection = {
            container: this.content, pageHeight: this.getBlockHeight() * 2, debounceEvent: debounceEvent,
            axes: this.parent.enableColumnVirtualization ? ['X', 'Y'] : ['Y']
        };
        this.observer = new InterSectionObserver(this.virtualEle.wrapper, opt);
    }

    public renderEmpty(tbody: HTMLElement): void {
        this.getTable().appendChild(tbody);
        this.virtualEle.adjustTable(0, 0);
    }

    private scrollListener(scrollArgs: ScrollArg): void {
        if (this.parent.enablePersistence) {
            this.parent.scrollPosition = scrollArgs.offset;
        }
        if (this.preventEvent || this.parent.isDestroyed) { this.preventEvent = false; return; }
        if (isNullOrUndefined(document.activeElement)) {
            this.isFocused = false;
        } else {
            this.isFocused = this.content === closest(document.activeElement, '.e-content') || this.content === document.activeElement;
        }
        let info: SentinelType = scrollArgs.sentinel;
        let viewInfo: VirtualInfo = this.currentInfo = this.getInfoFromView(scrollArgs.direction, info, scrollArgs.offset);
        if (isGroupAdaptive(this.parent)) {
            if ((info.axis === 'Y' && this.prevInfo.blockIndexes.toString() === viewInfo.blockIndexes.toString())
                && scrollArgs.direction === 'up' && viewInfo.blockIndexes[viewInfo.blockIndexes.length - 1] !== 2) {
                return;
            } else {
                viewInfo.event = 'refresh-virtual-block';
                if (!isNullOrUndefined(viewInfo.offsets)) {
                    viewInfo.offsets.top = this.content.scrollTop;
                }
                this.parent.notify(
                    viewInfo.event,
                    { requestType: 'virtualscroll', virtualInfo: viewInfo, focusElement: scrollArgs.focusElement });
                return;
            }
        }
        if (this.prevInfo && ((info.axis === 'Y' && this.prevInfo.blockIndexes.toString() === viewInfo.blockIndexes.toString())
            || (info.axis === 'X' && this.prevInfo.columnIndexes.toString() === viewInfo.columnIndexes.toString()))) {
            if (Browser.isIE) {
                this.parent.hideSpinner();
            }
            return;
        }
        this.parent.setColumnIndexesInView(this.parent.enableColumnVirtualization ? viewInfo.columnIndexes : []);
        this.parent.pageSettings.currentPage = viewInfo.loadNext && !viewInfo.loadSelf ? viewInfo.nextInfo.page : viewInfo.page;
        this.parent.notify(viewInfo.event, { requestType: 'virtualscroll', virtualInfo: viewInfo, focusElement: scrollArgs.focusElement });
    }

    private block(blk: number): boolean {
        return this.vgenerator.isBlockAvailable(blk);
    }

    private getInfoFromView(direction: string, info: SentinelType, e: Offsets): VirtualInfo {
        let tempBlocks: number[] = [];
        let infoType: VirtualInfo = { direction: direction, sentinelInfo: info, offsets: e };
        let vHeight: string | number = this.parent.height.toString().indexOf('%') < 0 ? this.content.getBoundingClientRect().height :
            this.parent.element.getBoundingClientRect().height;
        infoType.page = this.getPageFromTop(e.top + vHeight, infoType);
        infoType.blockIndexes = tempBlocks = this.vgenerator.getBlockIndexes(infoType.page);
        infoType.loadSelf = !this.vgenerator.isBlockAvailable(tempBlocks[infoType.block]);
        let blocks: number[] = this.ensureBlocks(infoType);
        infoType.blockIndexes = blocks;
        infoType.loadNext = !blocks.filter((val: number) => tempBlocks.indexOf(val) === -1)
            .every(this.block.bind(this));
        infoType.event = (infoType.loadNext || infoType.loadSelf) ? modelChanged : refreshVirtualBlock;
        infoType.nextInfo = infoType.loadNext ? { page: Math.max(1, infoType.page + (direction === 'down' ? 1 : -1)) } : {};
        infoType.columnIndexes = info.axis === 'X' ? this.vgenerator.getColumnIndexes() : this.parent.getColumnIndexesInView();
        if (this.parent.enableColumnVirtualization && info.axis === 'X') {
            infoType.event = refreshVirtualBlock;
        }
        return infoType;
    }

    public ensureBlocks(info: VirtualInfo): number[] {
        let index: number = info.blockIndexes[info.block]; let mIdx: number;
        let old: number = index; let max: Function = Math.max;
        let indexes: number[] = info.direction === 'down' ? [max(index, 1), ++index, ++index] : [max(index - 1, 1), index, index + 1];
        indexes = indexes.filter((val: number, ind: number) => indexes.indexOf(val) === ind);
        if (this.prevInfo.blockIndexes.toString() === indexes.toString()) {
            return indexes;
        }

        if (info.loadSelf || (info.direction === 'down' && this.isEndBlock(old))) {
            indexes = this.vgenerator.getBlockIndexes(info.page);
        }

        indexes.some((val: number, ind: number) => {
            let result: boolean = val === (isGroupAdaptive(this.parent) ? this.getGroupedTotalBlocks() : this.getTotalBlocks());
            if (result) { mIdx = ind; }
            return result;
        });

        if (mIdx !== undefined) {
            indexes = indexes.slice(0, mIdx + 1);
            if (info.block === 0 && indexes.length === 1 && this.vgenerator.isBlockAvailable(indexes[0] - 1)) {
                indexes = [indexes[0] - 1, indexes[0]];
            }
        }

        return indexes;
    }

    public appendContent(target: HTMLElement, newChild: DocumentFragment, e: NotifyArgs): void {
        // currentInfo value will be used if there are multiple dom updates happened due to mousewheel
        let info: VirtualInfo = e.virtualInfo.sentinelInfo && e.virtualInfo.sentinelInfo.axis === 'Y' && this.currentInfo.page &&
            this.currentInfo.page !== e.virtualInfo.page ? this.currentInfo : e.virtualInfo;
        this.prevInfo = this.prevInfo || e.virtualInfo;
        let cBlock: number = (info.columnIndexes[0]) - 1; let cOffset: number = this.getColumnOffset(cBlock);
        let width: string; let blocks: number[] = info.blockIndexes;
        if (this.parent.groupSettings.columns.length) {
            this.refreshOffsets();
        }
        if (this.parent.height === '100%') {
            this.parent.element.style.height = '100%';
        }
        let vHeight: string | number = this.parent.height.toString().indexOf('%') < 0 ? this.content.getBoundingClientRect().height :
            this.parent.element.getBoundingClientRect().height;
        let translate: number = this.getTranslateY(this.content.scrollTop, <number>vHeight, info);
        this.virtualEle.adjustTable(cOffset, translate);

        if (this.parent.enableColumnVirtualization) {
            this.header.virtualEle.adjustTable(cOffset, 0);
        }

        if (this.parent.enableColumnVirtualization) {
            let cIndex: number[] = info.columnIndexes;
            width = this.getColumnOffset(cIndex[cIndex.length - 1]) - this.getColumnOffset(cIndex[0] - 1) + '';
            this.header.virtualEle.setWrapperWidth(width);
        }
        this.virtualEle.setWrapperWidth(width, <boolean>Browser.isIE || Browser.info.name === 'edge');
        if (!isNullOrUndefined(target.parentNode)) {
            remove(target);
        }
        let tbody: HTMLElement = this.parent.element.querySelector('.e-content').querySelector('tbody');
        if (tbody) {
            remove(tbody);
            target = null;
        }
        target = this.parent.createElement('tbody');
        target.appendChild(newChild);
        this.getTable().appendChild(target);

        if (this.parent.groupSettings.columns.length) {
            if (!isGroupAdaptive(this.parent) && info.direction === 'up') {
                let blk: number = this.offsets[this.getTotalBlocks()] - this.prevHeight;
                this.preventEvent = true; let sTop: number = this.content.scrollTop;
                this.content.scrollTop = sTop + blk;
            }
            this.setVirtualHeight();
            this.observer.setPageHeight(this.getOffset(blocks[blocks.length - 1]) - this.getOffset(blocks[0] - 1));
        }
        this.prevInfo = info;
        if (this.isFocused) {
            this.content.focus();
        }
    }

    protected onDataReady(e?: NotifyArgs): void {
        if (!isNullOrUndefined(e.count)) {
            this.count = e.count;
            this.maxPage = Math.ceil(e.count / this.parent.pageSettings.pageSize);
        }
        this.vgenerator.checkAndResetCache(e.requestType);
        if (['refresh', 'filtering', 'searching', 'grouping', 'ungrouping', 'reorder', undefined]
            .some((value: string) => { return e.requestType === value; })) {
            this.refreshOffsets();
        }
        this.setVirtualHeight();
        this.resetScrollPosition(e.requestType);
    }

    private setVirtualHeight(): void {
        let width: string = this.parent.enableColumnVirtualization ?
            this.getColumnOffset(this.parent.columns.length + this.parent.groupSettings.columns.length - 1) + 'px' : '100%';
        this.virtualEle.setVirtualHeight(
            this.offsets[isGroupAdaptive(this.parent) ? this.getGroupedTotalBlocks() : this.getTotalBlocks()],
            width);
        if (this.parent.enableColumnVirtualization) {
            this.header.virtualEle.setVirtualHeight(1, width);
        }
    }

    private getPageFromTop(sTop: number, info: VirtualInfo): number {
        let total: number = (isGroupAdaptive(this.parent)) ? this.getGroupedTotalBlocks() : this.getTotalBlocks();
        let page: number = 0; let extra: number = this.offsets[total] - this.prevHeight;
        this.offsetKeys.some((offset: string) => {
            let iOffset: number = Number(offset);
            let border: boolean = sTop <= this.offsets[offset] || (iOffset === total && sTop > this.offsets[offset]);
            if (border) {
                info.block = iOffset % 2 === 0 ? 1 : 0;
                page = Math.max(1, Math.min(this.vgenerator.getPage(iOffset), this.maxPage));
            }
            return border;
        });
        return page;
    }

    private getTranslateY(sTop: number, cHeight: number, info?: VirtualInfo, isOnenter?: boolean): number {
        if (info === undefined) {
            info = { page: this.getPageFromTop(sTop + cHeight, {}) };
            info.blockIndexes = this.vgenerator.getBlockIndexes(info.page);
        }
        let block: number = (info.blockIndexes[0] || 1) - 1;
        let translate: number = this.getOffset(block);
        let endTranslate: number = this.getOffset(info.blockIndexes[info.blockIndexes.length - 1]);
        if (isOnenter) {
            info = this.prevInfo;
        }
        let result: number = translate > sTop ?
            this.getOffset(block - 1) : endTranslate < (sTop + cHeight) ? this.getOffset(block + 1) : translate;
        let blockHeight: number = this.offsets[info.blockIndexes[info.blockIndexes.length - 1]] -
            this.tmpOffsets[info.blockIndexes[0]];
        if (result + blockHeight > this.offsets[isGroupAdaptive(this.parent) ? this.getGroupedTotalBlocks() : this.getTotalBlocks()]) {
            result -= (result + blockHeight) - this.offsets[this.getTotalBlocks()];
        }
        return result;
    }

    public getOffset(block: number): number {
        return Math.min(this.offsets[block] | 0, this.offsets[this.maxBlock] | 0);
    }

    private onEntered(): Function {
        return (element: HTMLElement, current: SentinelType, direction: string, e: Offsets, isWheel: boolean, check: boolean) => {
            if (Browser.isIE && !isWheel && check && !this.preventEvent) {
                this.parent.showSpinner();
            }
            let xAxis: boolean = current.axis === 'X'; let top: number = this.prevInfo.offsets ? this.prevInfo.offsets.top : null;
            let height: number = this.content.getBoundingClientRect().height;
            let x: number = this.getColumnOffset(xAxis ? this.vgenerator.getColumnIndexes()[0] - 1 : this.prevInfo.columnIndexes[0] - 1);
            let y: number = this.getTranslateY(e.top, height, xAxis && top === e.top ? this.prevInfo : undefined, true);
            this.virtualEle.adjustTable(x, Math.min(y, this.offsets[this.maxBlock]));
            if (this.parent.enableColumnVirtualization) {
                this.header.virtualEle.adjustTable(x, 0);
            }
        };
    }

    private dataBound(): void {
        if (this.isSelection) {
            this.isSelection = false;
            this.parent.selectRow(this.selectedRowIndex);
        }
    }

    public eventListener(action: string): void {
        this.parent[action](dataReady, this.onDataReady, this);
        this.parent.addEventListener(events.dataBound, this.dataBound.bind(this));
        this.parent[action](refreshVirtualBlock, this.refreshContentRows, this);
        this.parent[action](events.selectVirtualRow, this.selectVirtualRow, this);
        this.actions.forEach((event: string) => this.parent[action](`${event}-begin`, this.onActionBegin, this));
        let fn: Function = () => {
            this.observer.observe((scrollArgs: ScrollArg) => this.scrollListener(scrollArgs), this.onEntered());
            let gObj: IGrid = this.parent;
            if (gObj.enablePersistence && gObj.scrollPosition) {
                this.content.scrollTop = gObj.scrollPosition.top;
                let scrollValues: ScrollArg = { direction: 'down', sentinel: this.observer.sentinelInfo.down,
                    offset: gObj.scrollPosition, focusElement: gObj.element };
                this.scrollListener(scrollValues);
                if (gObj.enableColumnVirtualization) {
                    this.content.scrollLeft = gObj.scrollPosition.left;
                }
            }
            this.parent.off(contentReady, fn);
        };
        this.parent.on(contentReady, fn, this);
    }

    public getBlockSize(): number {
        return this.parent.pageSettings.pageSize >> 1;
    }

    public getBlockHeight(): number {
        return this.getBlockSize() * this.parent.getRowHeight();
    }

    public isEndBlock(index: number): boolean {
        let totalBlocks: number = this.getTotalBlocks();
        return index >= totalBlocks || index === totalBlocks - 1;
    }

    public getGroupedTotalBlocks(): number {
        let rows: Object[] = this.parent.vcRows;
        return Math.floor((rows.length / this.getBlockSize()) < 1 ? 1 : rows.length / this.getBlockSize());
    }

    public getTotalBlocks(): number {
        return Math.ceil(this.count / this.getBlockSize());
    }

    public getColumnOffset(block: number): number {
        return this.vgenerator.cOffsets[block] | 0;
    }

    public getModelGenerator(): IModelGenerator<Column> {
        return new VirtualRowModelGenerator(this.parent);
    }

    private resetScrollPosition(action: string): void {
        if (this.actions.some((value: string) => value === action)) {
            this.preventEvent = this.content.scrollTop !== 0;
            this.content.scrollTop = 0;
        }
    }

    private onActionBegin(e: NotifyArgs): void {
        //Update property silently..
        this.parent.setProperties({ pageSettings: { currentPage: 1 } }, true);
    }

    public getRows(): Row<Column>[] {
        return this.vgenerator.getRows();
    }

    public getRowByIndex(index: number): Element {
        if (isGroupAdaptive(this.parent)) {
            return this.parent.getDataRows()[index];
        }
        let prev: number[] = this.prevInfo.blockIndexes;
        let startIdx: number = (prev[0] - 1) * this.getBlockSize();
        return this.parent.getDataRows()[index - startIdx];
    }

    public getVirtualRowIndex(index: number): number {
        let prev: number[] = this.prevInfo.blockIndexes;
        let startIdx: number = (prev[0] - 1) * this.getBlockSize();
        return startIdx + index;
    }

    private refreshOffsets(): void {
        let gObj: IGrid = this.parent;
        let row: number = 0; let bSize: number = this.getBlockSize();
        let total: number = isGroupAdaptive(this.parent) ? this.getGroupedTotalBlocks() : this.getTotalBlocks();
        this.prevHeight = this.offsets[total]; this.maxBlock = total % 2 === 0 ? total - 2 : total - 1; this.offsets = {};
        //Row offset update
        Array.apply(null, Array(total)).map(() => ++row)
            .forEach((block: number) => {
                let tmp: number = (this.vgenerator.cache[block] || []).length;
                let rem: number = !isGroupAdaptive(this.parent) ? this.count % bSize : (gObj.vcRows.length % bSize);
                let size: number = !isGroupAdaptive(this.parent) && block in this.vgenerator.cache ?
                    tmp * this.parent.getRowHeight() : rem && block === total ? rem * this.parent.getRowHeight() : this.getBlockHeight();
                // let size: number = this.parent.groupSettings.columns.length && block in this.vgenerator.cache ?
                // tmp * getRowHeight() : this.getBlockHeight();
                this.offsets[block] = (this.offsets[block - 1] | 0) + size;
                this.tmpOffsets[block] = this.offsets[block - 1] | 0;
            });
        this.offsetKeys = Object.keys(this.offsets);
        if (isGroupAdaptive(this.parent)) {
            this.parent.vGroupOffsets = this.offsets;
        }
        //Column offset update
        if (this.parent.enableColumnVirtualization) {
            this.vgenerator.refreshColOffsets();
        }
    }

    public refreshVirtualElement(): void {
        this.vgenerator.refreshColOffsets();
        this.setVirtualHeight();
    }

    public setVisible(columns?: Column[]): void {
        let gObj: IGrid = this.parent;
        let rows: Row<Column>[] = [];
        rows = <Row<Column>[]>this.getRows();
        let testRow: Row<Column>;
        rows.some((r: Row<Column>) => { if (r.isDataRow) { testRow = r; } return r.isDataRow; });

        let needFullRefresh: boolean = true;
        if (!gObj.groupSettings.columns.length && testRow) {
            needFullRefresh = false;
        }
        let tr: Object = gObj.getDataRows();
        for (let c: number = 0, clen: number = columns.length; c < clen; c++) {
            let column: Column = columns[c];
            let idx: number = gObj.getNormalizedColumnIndex(column.uid);
            let displayVal: string = column.visible === true ? '' : 'none';

            if (idx !== -1 && testRow && idx < testRow.cells.length) {
                setStyleAttribute(<HTMLElement>this.getColGroup().childNodes[idx], { 'display': displayVal });
            }
            if (!needFullRefresh) {
                let width: number;
                if (column.visible) {
                    width = this.virtualEle.wrapper.offsetWidth + parseInt(column.width.toString(), 10);
                } else {
                    width = this.virtualEle.wrapper.offsetWidth - parseInt(column.width.toString(), 10);
                }
                if (width > gObj.width) {
                    this.setDisplayNone(tr, idx, displayVal, rows);
                    this.virtualEle.setWrapperWidth(width + '');
                    this.vgenerator.refreshColOffsets();
                    this.refreshVirtualElement();
                } else {
                    this.refreshContentRows({ requestType: 'refresh' });
                }
            }
            if (!this.parent.invokedFromMedia && column.hideAtMedia) {
                this.parent.updateMediaColumns(column);
            }
            this.parent.invokedFromMedia = false;
        }
        if (needFullRefresh) {
            this.refreshContentRows({ requestType: 'refresh' });
        } else {
            this.parent.notify(events.partialRefresh, { rows: rows, args: { isFrozen: false, rows: rows } });
        }
    }

    private selectVirtualRow(args: { selectedIndex: number }): void {
        this.isSelection = true;
        this.selectedRowIndex = args.selectedIndex;
        let page: number = Math.ceil((args.selectedIndex + 1) / this.parent.pageSettings.pageSize);
        let blockIndexes: number[] = this.vgenerator.getBlockIndexes(page);
        let scrollTop: number = this.offsets[blockIndexes[0] - 1];
        (this.parent.getContent() as HTMLElement).firstElementChild.scrollTop = scrollTop;
    }
}
/**
 * @hidden
 */
export class VirtualHeaderRenderer extends HeaderRender implements IRenderer {
    public virtualEle: VirtualElementHandler = new VirtualElementHandler();
    private gen: VirtualRowModelGenerator;

    constructor(parent: IGrid, locator: ServiceLocator) {
        super(parent, locator);
        this.gen = new VirtualRowModelGenerator(this.parent);
        this.parent.on(events.columnVisibilityChanged, this.setVisible, this);
        this.parent.on(refreshVirtualBlock, (e?: NotifyArgs) => e.virtualInfo.sentinelInfo.axis === 'X' ? this.refreshUI() : null, this);
    }

    public renderTable(): void {
        this.gen.refreshColOffsets();
        this.parent.setColumnIndexesInView(this.gen.getColumnIndexes(<HTMLElement>this.getPanel().firstChild));
        super.renderTable();
        this.virtualEle.table = <HTMLElement>this.getTable();
        this.virtualEle.content = <HTMLElement>this.getPanel().firstChild;
        this.virtualEle.content.style.position = 'relative';
        this.virtualEle.renderWrapper();
        this.virtualEle.renderPlaceHolder('absolute');
    }

    public appendContent(table: Element): void {
        this.virtualEle.wrapper.appendChild(table);
    }

    public refreshUI(): void {
        this.gen.refreshColOffsets();
        this.parent.setColumnIndexesInView(this.gen.getColumnIndexes(<HTMLElement>this.getPanel().firstChild));
        super.refreshUI();
    }

    public setVisible(columns?: Column[]): void {
        let gObj: IGrid = this.parent;
        let displayVal: string;
        let idx: number;

        for (let c: number = 0, clen: number = columns.length; c < clen; c++) {
            let column: Column = columns[c];
            idx = gObj.getNormalizedColumnIndex(column.uid);
            displayVal = column.visible ? '' : 'none';

            setStyleAttribute(<HTMLElement>this.getColGroup().children[idx], { 'display': displayVal });
            if (gObj.enableColumnVirtualization && !gObj.groupSettings.columns.length) {
                let tablewidth: number;
                if (column.visible) {
                    tablewidth = this.virtualEle.wrapper.offsetWidth + parseInt(column.width.toString(), 10);
                } else {
                    tablewidth = this.virtualEle.wrapper.offsetWidth - parseInt(column.width.toString(), 10);
                }
                if (tablewidth > gObj.width) {
                    this.setDisplayNone(column, displayVal);
                    this.virtualEle.setWrapperWidth(tablewidth + '');
                    this.gen.refreshColOffsets();
                } else {
                    this.refreshUI();
                }
            } else {
                this.refreshUI();
            }
        }
    }

    private setDisplayNone(col: Column, displayVal: string): void {
        for (let ele of [].slice.apply(this.getTable().querySelectorAll('th.e-headercell'))) {
            if (ele.querySelector('[e-mappinguid]') &&
                ele.querySelector('[e-mappinguid]').getAttribute('e-mappinguid') === col.uid) {
                setStyleAttribute(<HTMLElement>ele, { 'display': displayVal });
                break;
            }
        }
    }
}
/**
 * @hidden
 */
export class VirtualElementHandler {
    public wrapper: HTMLElement;
    public placeholder: HTMLElement;
    public content: HTMLElement;
    public table: HTMLElement;

    public renderWrapper(height?: number): void {
        this.wrapper = createElement('div', { className: 'e-virtualtable', styles: `min-height:${formatUnit(height)}` });
        this.wrapper.appendChild(this.table);
        this.content.appendChild(this.wrapper);
    }

    public renderPlaceHolder(position: string = 'relative'): void {
        this.placeholder = createElement('div', { className: 'e-virtualtrack', styles: `position:${position}` });
        this.content.appendChild(this.placeholder);
    }

    public adjustTable(xValue: number, yValue: number): void {
        this.wrapper.style.transform = `translate(${xValue}px, ${yValue}px)`;
    }

    public setWrapperWidth(width: string, full?: boolean): void {
        this.wrapper.style.width = width ? `${width}px` : full ? '100%' : '';
    }

    public setVirtualHeight(height?: number, width?: string): void {
        this.placeholder.style.height = `${height}px`;
        this.placeholder.style.width = width;
    }
}

type ScrollArg = { direction: string, sentinel: SentinelType, offset: Offsets, focusElement: HTMLElement };