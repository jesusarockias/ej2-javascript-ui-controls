import { extend, addClass, removeClass, setValue, isBlazor } from '@syncfusion/ej2-base';
import { remove, classList, updateBlazorTemplate, blazorTemplates, resetBlazorTemplate } from '@syncfusion/ej2-base';
import { FormValidator } from '@syncfusion/ej2-inputs';
import { isNullOrUndefined, KeyboardEventArgs } from '@syncfusion/ej2-base';
import { IGrid, BeforeBatchAddArgs, BeforeBatchDeleteArgs, BeforeBatchSaveArgs } from '../base/interface';
import { BatchAddArgs, CellEditArgs, CellSaveArgs, CellFocusArgs, BatchCancelArgs } from '../base/interface';
import { CellType } from '../base/enum';
import { parentsUntil, inArray, refreshForeignData, getObject } from '../base/util';
import * as events from '../base/constant';
import { EditRender } from '../renderer/edit-renderer';
import { RowRenderer } from '../renderer/row-renderer';
import { CellRenderer } from '../renderer/cell-renderer';
import { Row } from '../models/row';
import { Cell } from '../models/cell';
import { ServiceLocator } from '../services/service-locator';
import { IModelGenerator } from '../base/interface';
import { RowModelGenerator } from '../services/row-model-generator';
import { Column } from '../models/column';
import { FocusStrategy } from '../services/focus-strategy';
import { DataUtil } from '@syncfusion/ej2-data';

/**
 * `BatchEdit` module is used to handle batch editing actions.
 * @hidden
 */
export class BatchEdit {
    private parent: IGrid;
    private serviceLocator: ServiceLocator;
    private form: Element;
    public formObj: FormValidator;
    private renderer: EditRender;
    private focus: FocusStrategy;
    private dataBoundFunction: Function;
    private removeSelectedData : Object[];
    private cellDetails: {
        rowData?: Object, field?: string, value?: string,
        isForeignKey?: boolean, column?: Column, rowIndex?: number, cellIndex?: number,
        foreignKeyData?: Object
    } = {};
    private isColored: boolean;
    private isAdded: boolean;

    constructor(parent?: IGrid, serviceLocator?: ServiceLocator, renderer?: EditRender) {
        this.parent = parent;
        this.serviceLocator = serviceLocator;
        this.renderer = renderer;
        this.focus = serviceLocator.getService<FocusStrategy>('focus');
        this.addEventListener();
    }

    /**
     * @hidden
     */
    public addEventListener(): void {
        if (this.parent.isDestroyed) { return; }
        this.parent.on(events.click, this.clickHandler, this);
        this.parent.on(events.dblclick, this.dblClickHandler, this);
        this.parent.on(events.beforeCellFocused, this.onBeforeCellFocused, this);
        this.parent.on(events.cellFocused, this.onCellFocused, this);
        this.dataBoundFunction = this.dataBound.bind(this);
        this.parent.addEventListener(events.dataBound, this.dataBoundFunction);
        this.parent.on(events.doubleTap, this.dblClickHandler, this);
        this.parent.on(events.keyPressed, this.keyDownHandler, this);
        this.parent.on(events.editNextValCell, this.editNextValCell, this);
    }

    /**
     * @hidden
     */
    public removeEventListener(): void {
        if (this.parent.isDestroyed) { return; }
        this.parent.off(events.click, this.clickHandler);
        this.parent.off(events.dblclick, this.dblClickHandler);
        this.parent.off(events.beforeCellFocused, this.onBeforeCellFocused);
        this.parent.off(events.cellFocused, this.onCellFocused);
        this.parent.removeEventListener(events.dataBound, this.dataBoundFunction);
        this.parent.off(events.doubleTap, this.dblClickHandler);
        this.parent.off(events.keyPressed, this.keyDownHandler);
        this.parent.off(events.editNextValCell, this.editNextValCell);
    }

    private dataBound(): void {
        this.parent.notify(events.toolbarRefresh, {});
    }

    /**
     * @hidden
     */
    public destroy(): void {
        this.removeEventListener();
    }

    protected clickHandler(e: MouseEvent): void {
        if (!parentsUntil(e.target as Element, this.parent.element.id + '_add', true)) {
            if (this.parent.isEdit) {
                this.saveCell();
                this.editNextValCell();
            }
            if (parentsUntil(e.target as HTMLElement, 'e-rowcell') && !this.parent.isEdit) {
                this.setCellIdx(e.target as HTMLTableCellElement);
            }
        }
    }

    protected dblClickHandler(e: MouseEvent): void {
        let target: Element = parentsUntil(e.target as Element, 'e-rowcell');
        let tr: Element = parentsUntil(e.target as Element, 'e-row');
        if (target && tr && !isNaN(parseInt(target.getAttribute('aria-colindex'), 10))
            && !target.parentElement.classList.contains('e-editedrow')) {
            this.editCell(
                parseInt(tr.getAttribute('aria-rowindex'), 10),
                (this.parent.getColumns()[parseInt(target.getAttribute('aria-colindex'), 10)] as Column).field,
                this.isAddRow(parseInt(tr.getAttribute('aria-rowindex'), 10))
            );
        }
    }

    private onBeforeCellFocused(e: CellFocusArgs): void {
        if (this.parent.isEdit && this.validateFormObj() &&
            (e.byClick || (['tab', 'shiftTab', 'enter', 'shiftEnter'].indexOf(e.keyArgs.action) > -1))) {
            e.cancel = true;
            if (e.byClick) {
                e.clickArgs.preventDefault();
            } else {
                e.keyArgs.preventDefault();
            }
        }
    }

    private onCellFocused(e: CellFocusArgs): void {
        let frzCols: number = this.parent.getFrozenColumns();
        let mCont: Element = this.parent.getContent().querySelector('.e-movablecontent');
        let mHdr: Element = this.parent.getHeaderContent().querySelector('.e-movableheader');
        let clear: boolean = (!e.container.isContent || !e.container.isDataCell) && !(this.parent.frozenRows && e.container.isHeader);
        if (!e.byKey || clear) {
            if (this.parent.isEdit && clear) {
                this.saveCell();
            }
            return;
        }
        let [rowIndex, cellIndex]: number[] = e.container.indexes;
        if (frzCols && (mCont.contains(e.element) || (this.parent.frozenRows && mHdr.contains(e.element)))) {
            cellIndex += frzCols;
        }
        if (this.parent.frozenRows && e.container.isContent) {
            rowIndex += this.parent.frozenRows;
        }
        let isEdit: boolean = this.parent.isEdit;
        if (!this.parent.element.querySelectorAll('.e-popup-open').length) {
            isEdit = isEdit && !this.validateFormObj();
            switch (e.keyArgs.action) {
                case 'tab':
                case 'shiftTab':
                    if (isEdit || this.parent.isLastCellPrimaryKey) {
                        this.editCellFromIndex(rowIndex, cellIndex);
                    }
                    break;
                case 'enter':
                case 'shiftEnter':
                    e.keyArgs.preventDefault();
                    if (isEdit) {
                        this.editCell(rowIndex, this.cellDetails.column.field);
                    }
                    break;
                case 'f2':
                    this.editCellFromIndex(rowIndex, cellIndex);
                    this.focus.focus();
                    break;
            }
        }
    }

    private isAddRow(index: number): boolean {
        return this.parent.getDataRows()[index].classList.contains('e-insertedrow');
    }

    private editCellFromIndex(rowIdx: number, cellIdx: number): void {
        this.cellDetails.rowIndex = rowIdx;
        this.cellDetails.cellIndex = cellIdx;
        this.editCell(rowIdx, (this.parent.getColumns() as Column[])[cellIdx].field, this.isAddRow(rowIdx));
    }

    // tslint:disable-next-line:max-func-body-length
    public closeEdit(): void {
        let gObj: IGrid = this.parent;
        let rows: Row<Column>[] = this.parent.getRowsObject();
        let argument: BeforeBatchSaveArgs = { cancel: false, batchChanges: this.getBatchChanges()};
        gObj.notify(events.beforeBatchCancel, argument);
        if (argument.cancel) {
            return;
        }
        if (gObj.frozenColumns && rows.length < this.parent.currentViewData.length * 2) {
            rows.push.apply(rows, this.parent.getMovableRowsObject());
        }
        let cols: Column[] = this.parent.getColumns();
        if (isBlazor()) {
            for (let i: number = 0; i < cols.length; i++) {
                let col: Column = cols[i];
                if (col.template) {
                    updateBlazorTemplate(this.parent.element.id + col.uid, 'Template', col, false);
                }
            }
        }
        let rowRenderer: RowRenderer<Column> = new RowRenderer<Column>(this.serviceLocator, null, this.parent);
        let tr: HTMLElement;
        let mTr: HTMLElement;
        let movObj: Row<Column>;
        if (gObj.isEdit) {
            this.saveCell(true);
        }
        this.isAdded = false;
        gObj.clearSelection();
        for (let i: number = 0; i < rows.length; i++) {
            if (rows[i].isDirty) {
                if (gObj.frozenColumns) {
                    movObj = gObj.getMovableRowsObject()[rows[i].index];
                    movObj.isDirty = true;
                }
                tr = gObj.getContentTable().querySelector('[data-uid=' + rows[i].uid + ']') as HTMLElement;
                if (gObj.frozenRows && !tr) {
                    tr = gObj.getHeaderContent().querySelector('[data-uid=' + rows[i].uid + ']') as HTMLElement;
                }
                if (gObj.frozenColumns) {
                    if (gObj.frozenRows) {
                        mTr = gObj.getHeaderContent().querySelector('.e-movableheader')
                            .querySelector('[data-uid=' + rows[i].uid + ']') as HTMLElement;
                        if (!mTr) {
                            mTr = gObj.getContent().querySelector('.e-movablecontent')
                                 .querySelector('[data-uid=' + rows[i].uid + ']') as HTMLElement;
                        }
                    } else {
                         mTr = gObj.getContent().querySelector('.e-movablecontent')
                            .querySelector('[data-uid=' + rows[i].uid + ']') as HTMLElement;
                    }
                }
                if (tr || mTr) {
                    if (tr && tr.classList.contains('e-insertedrow') || mTr && mTr.classList.contains('e-insertedrow')) {
                        if (tr) {
                            remove(tr);
                        }
                        if (mTr && (gObj.frozenColumns || gObj.frozenRows)) {
                            remove(mTr);
                        }
                        this.removeRowObjectFromUID(rows[i].uid);
                        i--;
                    } else {
                        refreshForeignData(rows[i], this.parent.getForeignKeyColumns(), rows[i].data);
                        delete rows[i].changes;
                        delete rows[i].edit;
                        rows[i].isDirty = false;
                        let ftr: HTMLElement = mTr ? mTr : tr;
                        classList(ftr, [], ['e-hiddenrow', 'e-updatedtd']);
                        rowRenderer.refresh(rows[i], gObj.getColumns() as Column[], false);
                        if (this.parent.aggregates.length > 0) {
                            let type: string = 'type';
                            let editType: Object[] = [];
                            editType[type] = 'cancel';
                            this.parent.notify(events.refreshFooterRenderer, editType);
                            if (this.parent.groupSettings.columns.length > 0) {
                                this.parent.notify(events.groupAggregates, editType);
                            }
                        }
                    }
                }
            }
        }
        if (!gObj.getContentTable().querySelector('tr.e-row')) {
            gObj.renderModule.renderEmptyRow();
        }
        let args: BatchCancelArgs = {
            requestType: 'batchCancel', rows: this.parent.getRowsObject()
        };
        gObj.notify(events.batchCancel, {
            rows: this.parent.getRowsObject().length ? this.parent.getRowsObject() :
                [new Row<Column>({ isDataRow: true, cells: [new Cell<Column>({ isDataCell: true, visible: true })] })]
        });
        gObj.selectRow(this.cellDetails.rowIndex);
        this.refreshRowIdx();
        gObj.notify(events.toolbarRefresh, {});
        this.parent.notify(events.tooltipDestroy, {});
        args = { requestType: 'batchCancel', rows: this.parent.getRowsObject() };
        gObj.trigger(events.batchCancel, args);
        if (gObj.frozenColumns) {
            rows.splice(this.parent.getMovableRowsObject().length, rows.length);
        }
    }

    public deleteRecord(fieldname?: string, data?: Object): void {
        this.saveCell();
        if (this.validateFormObj()) {
            this.saveCell(true);
        }
        this.isAdded = false;
        this.bulkDelete(fieldname, data);
        if (this.parent.aggregates.length > 0) {
            this.parent.notify(events.refreshFooterRenderer, {});
            if (this.parent.groupSettings.columns.length > 0) {
                this.parent.notify(events.groupAggregates, {});
            }
        }
    }

    public addRecord(data?: Object): void {
        this.bulkAddRow(data);
    }

    public endEdit(data?: Object): void {
        if (this.parent.isEdit && this.validateFormObj()) {
            return;
        }
        this.batchSave();
    }

    private validateFormObj(): boolean {
        return this.parent.editModule.formObj && !this.parent.editModule.formObj.validate();
    }

    public batchSave(): void {
        let gObj: IGrid = this.parent;
        let deletedRecords: string = 'deletedRecords';
        if (gObj.isCheckBoxSelection) {
            let checkAllBox: Element = gObj.element.querySelector('.e-checkselectall').parentElement;
            if (checkAllBox.classList.contains('e-checkbox-disabled') &&
                gObj.pageSettings.totalRecordsCount > gObj.currentViewData.length) {
                removeClass([checkAllBox], ['e-checkbox-disabled']);
            }
        }
        let cols: Column[] = this.parent.getColumns();
        if (isBlazor()) {
            for (let i: number = 0; i < cols.length; i++) {
                let col: Column = cols[i];
                if (col.template) {
                    blazorTemplates[this.parent.element.id + col.uid] = [];
                    resetBlazorTemplate(this.parent.element.id + col.uid, 'Template');
                }
            }
        }
        this.saveCell();
        if (gObj.isEdit || this.editNextValCell() || gObj.isEdit) {
            return;
        }
        let changes: Object = this.getBatchChanges();
        if (this.parent.selectionSettings.type === 'Multiple' && changes[deletedRecords].length) {
            changes[deletedRecords] = changes[deletedRecords].concat(this.removeSelectedData);
            this.removeSelectedData = [];
        }
        let original: Object = {
            changedRecords: this.parent.getRowsObject()
                .filter((row: Row<Column>) => row.isDirty && ['add', 'delete'].indexOf(row.edit) === -1)
                .map((row: Row<Column>) => row.data)
        };
        let args: BeforeBatchSaveArgs = { batchChanges: changes, cancel: false };
        gObj.trigger(events.beforeBatchSave, args, (beforeBatchSaveArgs: BeforeBatchSaveArgs) => {
            if (beforeBatchSaveArgs.cancel) {
                return;
            }
            gObj.showSpinner();
            gObj.notify(events.bulkSave, { changes: changes, original: original });
        });
    }

    public getBatchChanges(): Object {
        let changes: { addedRecords: Object[], deletedRecords: Object[], changedRecords: Object[] } = {
            addedRecords: [],
            deletedRecords: [],
            changedRecords: []
        };
        let rows: Row<Column>[] = this.parent.getRowsObject() as Row<Column>[];
        let mRows: Row<Column>[] = this.parent.getMovableRowsObject() as Row<Column>[];
        let frzCols: number = this.parent.getFrozenColumns();
        for (let row of rows) {
            if (frzCols) {
                this.mergeBatchChanges(row, mRows[row.index], frzCols);
            }
            if (row.isDirty) {
                switch (row.edit) {
                    case 'add':
                        changes.addedRecords.push(row.changes);
                        break;
                    case 'delete':
                        changes.deletedRecords.push(row.data);
                        break;
                    default:
                        changes.changedRecords.push(row.changes);
                }
            }
        }
        return changes;
    }

    private mergeBatchChanges(row: Row<Column>, mRow: Row<Column>, frzCols: number): void {
        if (row.isDirty) {
            if (mRow.isDirty) {
                let i: number = 0;
                Object.keys(row.changes).forEach((key: string) => {
                    if (i >= frzCols) {
                        row.changes[key] = mRow.changes[key];
                    }
                    i++;
                });

            }
        } else if (mRow.isDirty) {
            row.changes = mRow.changes;
            row.isDirty = mRow.isDirty;
        }
    }

    /**
     * @hidden   
     */
    public removeRowObjectFromUID(uid: string): void {
        let rows: Row<Column>[] = this.parent.getRowsObject() as Row<Column>[];
        let i: number = 0;
        for (let len: number = rows.length; i < len; i++) {
            if (rows[i].uid === uid) {
                break;
            }
        }
        rows.splice(i, 1);
    }

    /**
     * @hidden   
     */
    public addRowObject(row: Row<Column>): void {
        let isTop: Boolean = this.parent.editSettings.newRowPosition === 'Top';
        isTop ? this.parent.getRowsObject().unshift(row) :
            this.parent.getRowsObject().push(row);
        let mRow: Row<Column>[] = this.parent.getMovableRowsObject() as Row<Column>[];
        if (this.parent.getFrozenColumns() && !mRow.length) {
            isTop ? mRow.unshift(row) : mRow.push(row);
        }
    }


    private bulkDelete(fieldname?: string, data?: Object): void {
        this.removeSelectedData = [];
        let gObj: IGrid = this.parent;
        if (data) {
            gObj.selectRow(this.getIndexFromData(data));
        }
        let index: number = gObj.selectedRowIndex;
        let selectedRows: Element[] = gObj.getSelectedRows();
        let args: BeforeBatchDeleteArgs = {
            primaryKey: this.parent.getPrimaryKeyFieldNames(),
            rowIndex: index,
            rowData: data ? data : gObj.getSelectedRecords()[0],
            cancel: false
        };
        if (!isBlazor() || this.parent.isJsComponent) {
            args.row = data ? gObj.getRows()[index] : selectedRows[0];
            if (!args.row) {
                return;
            }
        }
        gObj.trigger(events.beforeBatchDelete, args, (beforeBatchDeleteArgs: BeforeBatchDeleteArgs) => {
            if (beforeBatchDeleteArgs.cancel) {
                return;
            }
            beforeBatchDeleteArgs.row = beforeBatchDeleteArgs.row ?
                                            beforeBatchDeleteArgs.row : data ? gObj.getRows()[index] : selectedRows[0];
            if (this.parent.frozenColumns || selectedRows.length === 1) {
                let uid: string = beforeBatchDeleteArgs.row.getAttribute('data-uid');
                if (beforeBatchDeleteArgs.row.classList.contains('e-insertedrow')) {
                    this.removeRowObjectFromUID(uid);
                    remove(beforeBatchDeleteArgs.row);
                } else {
                    let rowObj: Row<Column> = gObj.getRowObjectFromUID(uid);
                    rowObj.isDirty = true;
                    rowObj.edit = 'delete';
                    classList(beforeBatchDeleteArgs.row as HTMLTableRowElement, ['e-hiddenrow', 'e-updatedtd'], []);
                    if (gObj.getFrozenColumns()) {
                        classList(data ? gObj.getMovableRows()[index] : selectedRows[1], ['e-hiddenrow', 'e-updatedtd'], []);
                        if (gObj.frozenRows && index < gObj.frozenRows && gObj.getMovableDataRows().length >= gObj.frozenRows) {
                            gObj.getHeaderContent().querySelector('.e-movableheader').querySelector('tbody')
                                .appendChild(gObj.getMovableRowByIndex(gObj.frozenRows - 1));
                            gObj.getHeaderContent().querySelector('.e-frozenheader').querySelector('tbody')
                                .appendChild(gObj.getRowByIndex(gObj.frozenRows - 1));
                        }
                    } else if (gObj.frozenRows && index < gObj.frozenRows && gObj.getDataRows().length >= gObj.frozenRows) {
                        gObj.getHeaderContent().querySelector('tbody').appendChild(gObj.getRowByIndex(gObj.frozenRows - 1));
                    }
                }
                delete beforeBatchDeleteArgs.row;
            } else {
                for (let i: number = 0; i < selectedRows.length; i++) {
                    let uniqueid: string = selectedRows[i].getAttribute('data-uid');
                    if (selectedRows[i].classList.contains('e-insertedrow')) {
                        this.removeRowObjectFromUID(uniqueid);
                        remove(selectedRows[i]);
                    } else {
                        classList(selectedRows[i] as HTMLTableRowElement, ['e-hiddenrow', 'e-updatedtd'], []);
                        let selectedRow: Row<Column> = gObj.getRowObjectFromUID(uniqueid);
                        selectedRow.isDirty = true;
                        selectedRow.edit = 'delete';
                        delete selectedRows[i];
                    }
                }
            }
            this.refreshRowIdx();
            this.removeSelectedData =  gObj.getSelectedRecords();
            gObj.clearSelection();
            gObj.selectRow(index);
            gObj.trigger(events.batchDelete, beforeBatchDeleteArgs);
            gObj.notify(events.batchDelete, { rows: this.parent.getRowsObject() });
            gObj.notify(events.toolbarRefresh, {});
        });
    }

    private refreshRowIdx(): void {
        let rows: Element[] = [];
        let mRows: Element[] = [];
        let nonMovableRows: Element[] = [];
        let frzCols: number = this.parent.getFrozenColumns();
        if (this.parent.frozenRows) {
            rows = [].slice.call(this.parent.getHeaderTable().querySelector('tbody').children);
            if (frzCols) {
                mRows = [].slice.call(this.parent.getHeaderContent().querySelector('.e-movableheader').querySelector('tbody').children);
                for (let i: number = 0; i < mRows.length; i++) {
                    nonMovableRows[i] = this.parent.createElement('tr', { className: 'emptynonmv' });
                }
            }
        }
        if (frzCols) {
            mRows = mRows.concat([].slice.call(this.parent.getContentTable().querySelector('tbody').children));
            nonMovableRows = nonMovableRows.concat([].slice.call(
                this.parent.element.querySelector('.e-movablecontent').querySelector('tbody').children));
        }
        rows = rows.concat([].slice.call(this.parent.getContentTable().querySelector('tbody').children));
        for (let i: number = 0, j: number = 0, len: number = rows.length; i < len; i++) {
            if (rows[i].classList.contains('e-row') && !rows[i].classList.contains('e-hiddenrow')) {
                rows[i].setAttribute('aria-rowindex', j.toString());
                if (frzCols) {
                    mRows[i].setAttribute('aria-rowindex', j.toString());
                    if (nonMovableRows[i].classList.contains('e-row')) {
                        nonMovableRows[i].setAttribute('aria-rowindex', j.toString());
                    }
                }
                j++;
            } else {
                rows[i].removeAttribute('aria-rowindex');
                if (frzCols) {
                    mRows[i].removeAttribute('aria-rowindex');
                }
            }
        }
    }

    private getIndexFromData(data: Object): number {
        return inArray(data, this.parent.getCurrentViewRecords());
    }

    private bulkAddRow(data?: Object): void {
        let gObj: IGrid = this.parent;
        if (!gObj.editSettings.allowAdding) {
            return;
        }
        if (gObj.isEdit) {
            this.saveCell();
            this.parent.notify(events.editNextValCell, {});
        }
        if (gObj.isEdit) {
            return;
        }
        let defaultData: Object = data ? data : this.getDefaultData();
        let args: BeforeBatchAddArgs = {
            defaultData: defaultData,
            primaryKey: gObj.getPrimaryKeyFieldNames(),
            cancel: false
        };
        gObj.trigger(events.beforeBatchAdd, args, (beforeBatchAddArgs: BeforeBatchAddArgs) => {
            if (beforeBatchAddArgs.cancel) {
                return;
            }
            this.isAdded = true;
            gObj.clearSelection();
            let mTr: Element;
            let mTbody: Element;
            let row: RowRenderer<Column> = new RowRenderer<Column>(this.serviceLocator, null, this.parent);
            let model: IModelGenerator<Column> = new RowModelGenerator(this.parent);
            let modelData: Row<Column>[] = model.generateRows([beforeBatchAddArgs.defaultData]);
            let tr: HTMLTableRowElement = row.render(modelData[0], gObj.getColumns()) as HTMLTableRowElement;
            let col: Column;
            let index: number;
            for (let i: number = 0; i < this.parent.groupSettings.columns.length; i++) {
                tr.insertBefore(this.parent.createElement('td', { className: 'e-indentcell' }), tr.firstChild);
                modelData[0].cells.unshift(new Cell<Column>({ cellType: CellType.Indent }));
            }
            let tbody: Element = gObj.getContentTable().querySelector('tbody');
            tr.classList.add('e-insertedrow');
            if (tbody.querySelector('.e-emptyrow')) {
                tbody.querySelector('.e-emptyrow').remove();
            }
            if (gObj.getFrozenColumns()) {
                mTr = this.renderMovable(tr);
                if (gObj.frozenRows && gObj.editSettings.newRowPosition === 'Top') {
                    mTbody = gObj.getHeaderContent().querySelector('.e-movableheader').querySelector('tbody');
                } else {
                    mTbody = gObj.getContent().querySelector('.e-movablecontent').querySelector('tbody');
                }
                this.parent.editSettings.newRowPosition === 'Top' ? mTbody.insertBefore(mTr, mTbody.firstChild) : mTbody.appendChild(mTr);
                addClass(mTr.querySelectorAll('.e-rowcell'), ['e-updatedtd']);
                if (this.parent.height === 'auto') {
                    this.parent.notify(events.frozenHeight, {});
                }
            }
            if (gObj.frozenRows && gObj.editSettings.newRowPosition === 'Top') {
                tbody = gObj.getHeaderContent().querySelector('tbody');
            } else {
                tbody = gObj.getContent().querySelector('tbody');
            }
            this.parent.editSettings.newRowPosition === 'Top' ? tbody.insertBefore(tr, tbody.firstChild) : tbody.appendChild(tr);
            addClass(tr.querySelectorAll('.e-rowcell'), ['e-updatedtd']);
            modelData[0].isDirty = true;
            modelData[0].changes = extend({}, {}, modelData[0].data, true);
            modelData[0].edit = 'add';
            this.addRowObject(modelData[0]);
            this.refreshRowIdx();
            this.focus.forgetPrevious();
            gObj.notify(events.batchAdd, { rows: this.parent.getRowsObject(), args: { isFrozen: this.parent.getFrozenColumns() } });
            let changes: Object = this.getBatchChanges();
            let addedRecords: string = 'addedRecords';
            this.parent.editSettings.newRowPosition === 'Top' ? gObj.selectRow(0) :
                gObj.selectRow(this.parent.getCurrentViewRecords().length + changes[addedRecords].length - 1);
            if (!data) {
                index = this.findNextEditableCell(0, true);
                col = (gObj.getColumns()[index] as Column);
                this.parent.editSettings.newRowPosition === 'Top' ? this.editCell(0, col.field, true) :
                    this.editCell(this.parent.getCurrentViewRecords().length + changes[addedRecords].length - 1, col.field, true);
            }
            if (this.parent.aggregates.length > 0 && data) {
                this.parent.notify(events.refreshFooterRenderer, {});
            }
            let args1: BatchAddArgs = {
                defaultData: beforeBatchAddArgs.defaultData, row: tr,
                columnObject: col, columnIndex: index, primaryKey: beforeBatchAddArgs.primaryKey, cell: tr.cells[index]
            };
            gObj.trigger(events.batchAdd, args1);
            if (isBlazor()) {
                this.parent.notify(events.toolbarRefresh, {});
                this.parent.notify('start-add', {});
            }
        });
    }

    private renderMovable(ele: Element): Element {
        let mEle: Element = ele.cloneNode(true) as Element;
        for (let i: number = 0; i < this.parent.frozenColumns; i++) {
            mEle.removeChild(mEle.children[0]);
        }
        for (let i: number = this.parent.frozenColumns, len: number = ele.childElementCount; i < len; i++) {
            ele.removeChild(ele.children[ele.childElementCount - 1]);
        }
        return mEle;
    }

    private findNextEditableCell(columnIndex: number, isAdd: boolean, isValOnly?: boolean): number {
        let cols: Column[] = this.parent.getColumns() as Column[];
        let endIndex: number = cols.length;
        let validation: boolean;
        for (let i: number = columnIndex; i < endIndex; i++) {
            validation = isValOnly ? isNullOrUndefined(cols[i].validationRules) : false;
            if (!isAdd && this.checkNPCell(cols[i])) {
                return i;
            } else if (isAdd && !cols[i].template && cols[i].visible && cols[i].allowEditing &&
                !(cols[i].isIdentity && cols[i].isPrimaryKey) && !validation) {
                return i;
            }
        }
        return -1;
    }

    private checkNPCell(col: Column): boolean {
        return !col.template && col.visible && !col.isPrimaryKey && !col.isIdentity && col.allowEditing;
    }

    private getDefaultData(): Object {
        let gObj: IGrid = this.parent;
        let data: Object = {};
        let dValues: Object = { 'number': 0, 'string': null, 'boolean': false, 'date': null, 'datetime': null };
        for (let col of ((<{ columnModel?: Column[] }>gObj).columnModel)) {
            if (col.field) {
                setValue(col.field, col.defaultValue ? col.defaultValue : dValues[col.type], data);
            }
        }
        return data;
    }

    private setCellIdx(target: HTMLTableCellElement): void {
        let gLen: number = 0;
        if (this.parent.allowGrouping) {
            gLen = this.parent.groupSettings.columns.length;
        }
        this.cellDetails.cellIndex = target.cellIndex - gLen;
        this.cellDetails.rowIndex = parseInt(target.getAttribute('index'), 10);
    }

    public editCell(index: number, field: string, isAdd?: boolean): void {
        let gObj: IGrid = this.parent;
        let col: Column = gObj.getColumnByField(field);
        let keys: string[] = gObj.getPrimaryKeyFieldNames();
        if (isBlazor() && col.template && !isAdd) {
            resetBlazorTemplate(this.parent.element.id + col.uid, 'Template', index);
        }
        if (gObj.editSettings.allowEditing && col.allowEditing) {
            if (gObj.isEdit && !(this.cellDetails.column.field === field
                && (this.cellDetails.rowIndex === index && this.parent.getDataRows().length - 1 !== index))) {
                this.saveCell();
                if (this.cellDetails.rowIndex === index && this.cellDetails.column.field === field) {
                    return;
                }
            }
            if (gObj.isEdit) {
                return;
            }
            let row: Element;
            let rowData: Object;
            let mRowData: Row<Column>;
            let colIdx: number = gObj.getColumnIndexByField(field);
            let frzCols: number = gObj.getFrozenColumns();
            if (frzCols && colIdx >= frzCols) {
                row = gObj.getMovableDataRows()[index];
                mRowData = this.parent.getRowObjectFromUID(this.parent.getMovableDataRows()[index].getAttribute('data-uid'));
                rowData = mRowData.changes ? extend({}, {}, mRowData.changes, true) : extend({}, {}, this.getDataByIndex(index), true);
            } else {
                row = gObj.getDataRows()[index];
                rowData = extend({}, {}, this.getDataByIndex(index), true);
            }
            if ((keys[0] === col.field && !row.classList.contains('e-insertedrow')) || col.columns ||
                (col.isPrimaryKey && col.isIdentity)) {
                this.parent.isLastCellPrimaryKey = true;
                return;
            }
            this.parent.isLastCellPrimaryKey = false;
            let rowObj: Row<Column> = gObj.getRowObjectFromUID(row.getAttribute('data-uid'));
            let cells: Element[] = [].slice.apply((row as HTMLTableRowElement).cells);
            let args: CellEditArgs = {
                columnName: col.field, columnObject: col, isForeignKey: !isNullOrUndefined(col.foreignKeyValue),
                primaryKey: keys, rowData: rowData,
                validationRules: extend({}, col.validationRules ? col.validationRules : {}),
                value: getObject(col.field, rowData),
                type: !isAdd ? 'edit' : 'add', cancel: false,
                foreignKeyData: rowObj && rowObj.foreignKeyData
            };
            if (!isBlazor() || this.parent.isJsComponent) {
                args.cell = cells[this.getColIndex(cells, this.getCellIdx(col.uid))];
                args.row = row;
                if (!args.cell) { return; }
            }
            gObj.trigger(events.cellEdit, args, (cellEditArgs: CellEditArgs) => {
                if (cellEditArgs.cancel) {
                    return;
                }
                cellEditArgs.cell = cellEditArgs.cell ? cellEditArgs.cell : cells[this.getColIndex(cells, this.getCellIdx(col.uid))];
                cellEditArgs.row = cellEditArgs.row ? cellEditArgs.row : row;
                this.cellDetails = {
                    rowData: rowData, column: col, value: cellEditArgs.value, isForeignKey: cellEditArgs.isForeignKey, rowIndex: index,
                    cellIndex: parseInt((cellEditArgs.cell as HTMLTableCellElement).getAttribute('aria-colindex'), 10),
                    foreignKeyData: cellEditArgs.foreignKeyData
                };
                if (cellEditArgs.cell.classList.contains('e-updatedtd')) {
                    this.isColored = true;
                    cellEditArgs.cell.classList.remove('e-updatedtd');
                }
                gObj.isEdit = true;
                gObj.clearSelection();
                if (!gObj.isCheckBoxSelection || !gObj.isPersistSelection) {
                    gObj.selectRow(this.cellDetails.rowIndex, true);
                }
                this.renderer.update(cellEditArgs);
                this.parent.notify(events.batchEditFormRendered, cellEditArgs);
                this.form = gObj.element.querySelector('#' + gObj.element.id + 'EditForm');
                gObj.editModule.applyFormValidation([col]);
                (this.parent.element.querySelector('.e-gridpopup') as HTMLElement).style.display = 'none';
            });
        }
    }

    public updateCell(rowIndex: number, field: string, value: string | number | boolean | Date): void {
        let col: Column = this.parent.getColumnByField(field);
        let index: number = this.parent.getColumnIndexByField(field);
        if (col && !col.isPrimaryKey) {
            let td: Element = (this.parent.getDataRows()[rowIndex] as HTMLTableRowElement).querySelectorAll('.e-rowcell')[
                index];
            if (this.parent.getFrozenColumns()) {
                let cells: HTMLElement = [].slice.call(
                    (this.parent.getDataRows()[rowIndex] as HTMLTableRowElement).querySelectorAll('.e-rowcell')).concat([].slice.call((
                        this.parent.getMovableDataRows()[rowIndex] as HTMLTableRowElement).querySelectorAll('.e-rowcell')));
                td = cells[index];
            }
            let rowObj: Row<Column> = this.parent.getRowObjectFromUID(td.parentElement.getAttribute('data-uid'));
            this.refreshTD(td, col, rowObj, value);
            this.parent.trigger(events.queryCellInfo, {
                cell: td, column: col, data: rowObj.changes
            });
        }
    }

    private setChanges(rowObj: Row<Column>, field: string, value: string | number | boolean | Date): void {
        if (!rowObj.changes) {
            rowObj.changes = extend({}, {}, rowObj.data, true);
        }
        if (!isNullOrUndefined(field)) {
            DataUtil.setValue(field, value, rowObj.changes);
        }
        if (rowObj.data[field] !== value) {
            rowObj.isDirty = true;
        }
    }

    public updateRow(index: number, data: Object): void {
        let keys: string[] = Object.keys(data);
        for (let col of keys) {
            this.updateCell(index, col, data[col]);
        }
    }

    private getCellIdx(uid: string): number {
        let cIdx: number = this.parent.getColumnIndexByUid(uid) + this.parent.groupSettings.columns.length;
        if (!isNullOrUndefined(this.parent.detailTemplate) || !isNullOrUndefined(this.parent.childGrid)) {
            cIdx++;
        }
        if (this.parent.isRowDragable()) { cIdx++; }
        return cIdx;
    }

    private refreshTD(td: Element, column: Column, rowObj: Row<Column>, value: string | number | boolean | Date): void {
        let cell: CellRenderer = new CellRenderer(this.parent, this.serviceLocator);
        let rowcell: Cell<Column>[];
        this.setChanges(rowObj, column.field, value);
        let frzCols: number = this.parent.getFrozenColumns();
        refreshForeignData(rowObj, this.parent.getForeignKeyColumns(), rowObj.changes);
        if (frzCols && this.getCellIdx(column.uid) >= frzCols && this.parent.getColumns().length === rowObj.cells.length) {
            rowcell = rowObj.cells.slice(frzCols, rowObj.cells.length);
        } else {
            rowcell = rowObj.cells;
        }
        cell.refreshTD(
            td, rowcell[this.getCellIdx(column.uid) - (this.getCellIdx(column.uid) >= frzCols ? frzCols : 0)] as Cell<Column>,
            rowObj.changes, { 'index': this.getCellIdx(column.uid) });
        td.classList.add('e-updatedtd');
        this.parent.notify(events.toolbarRefresh, {});
    }

    private getColIndex(cells: Element[], index: number): number {
        let cIdx: number = 0;
        if (this.parent.allowGrouping && this.parent.groupSettings.columns) {
            cIdx = this.parent.groupSettings.columns.length;
        }
        if (!isNullOrUndefined(this.parent.detailTemplate) || !isNullOrUndefined(this.parent.childGrid)) {
            cIdx++;
        }
        if (this.parent.isRowDragable()) { cIdx++; }
        for (let m: number = 0; m < cells.length; m++) {
            let colIndex: number = parseInt(cells[m].getAttribute('aria-colindex'), 10);
            if (colIndex === index - cIdx) {
                return m;
            }
        }
        return -1;
    }

    private editNextValCell(): void {
        let gObj: IGrid = this.parent;
        if (this.isAdded && !gObj.isEdit) {
            for (let i: number = this.cellDetails.cellIndex; i < gObj.getColumns().length; i++) {
                if (gObj.isEdit) {
                    return;
                }
                let index: number = this.findNextEditableCell(this.cellDetails.cellIndex + 1, true, true);
                let col: Column = (gObj.getColumns()[index] as Column);
                if (col) {
                    this.editCell(0, col.field, true);
                    this.saveCell();
                }
            }
            if (!gObj.isEdit) {
                this.isAdded = false;
            }
        }
    }

    public saveCell(isForceSave?: boolean): void {
        let gObj: IGrid = this.parent;
        if (!isForceSave && (!gObj.isEdit || this.validateFormObj())) {
            return;
        }
        let tr: Element = parentsUntil(this.form, 'e-row');
        let column: Column = this.cellDetails.column;
        let obj: Object = {};
        obj[column.field] = this.cellDetails.rowData[column.field];
        let editedData: Object = gObj.editModule.getCurrentEditedData(this.form, obj);
        let cloneEditedData: Object = extend({}, editedData);
        editedData = extend({}, editedData, this.cellDetails.rowData);
        let value: string = getObject(column.field, cloneEditedData);
        if (!isNullOrUndefined(column.field)) {
            setValue(column.field, value, editedData);
        }
        let args: CellSaveArgs = {
            columnName: column.field,
            value: getObject(column.field, editedData),
            rowData: this.cellDetails.rowData,
            previousValue: this.cellDetails.value,
            columnObject: column,
            isForeignKey: this.cellDetails.isForeignKey, cancel: false
        };
        if (!isBlazor() || this.parent.isJsComponent) {
            args.cell = this.form.parentElement;
        }
        if (!isForceSave) {
            gObj.trigger(events.cellSave, args, this.successCallBack(args, tr, column));
            gObj.notify(events.batchForm, {formObj: this.form});
        } else {
            this.successCallBack(args, tr, column)(args);
        }
    }

    private successCallBack(cellSaveArgs: CellSaveArgs, tr: Element, column: Column): Function {
        return (cellSaveArgs: CellSaveArgs) => {
            let gObj: IGrid = this.parent;
            cellSaveArgs.cell = cellSaveArgs.cell ? cellSaveArgs.cell : this.form.parentElement;
            if (cellSaveArgs.cancel) {
                return;
            }
            gObj.editModule.destroyForm();
            gObj.isEdit = false;
            gObj.editModule.destroyWidgets([column]);
            if (isBlazor() && column.template && !cellSaveArgs.cell.parentElement.classList.contains('e-insertedrow')) {
                updateBlazorTemplate(gObj.element.id + column.uid, 'Template', column, false);
            }
            this.parent.notify(events.tooltipDestroy, {});
            this.refreshTD(cellSaveArgs.cell, column, gObj.getRowObjectFromUID(tr.getAttribute('data-uid')), cellSaveArgs.value);
            removeClass([tr], ['e-editedrow', 'e-batchrow']);
            removeClass([cellSaveArgs.cell], ['e-editedbatchcell', 'e-boolcell']);
            if (!isNullOrUndefined(cellSaveArgs.value) && cellSaveArgs.value.toString() ===
                (!isNullOrUndefined(this.cellDetails.value) ? this.cellDetails.value : '').toString() && !this.isColored
                || (isNullOrUndefined(cellSaveArgs.value) && isNullOrUndefined(this.cellDetails.value) &&
                    !cellSaveArgs.cell.parentElement.classList.contains('e-insertedrow'))) {
                cellSaveArgs.cell.classList.remove('e-updatedtd');
            }
            gObj.trigger(events.cellSaved, cellSaveArgs);
            gObj.notify(events.toolbarRefresh, {});
            this.isColored = false;
            if (this.parent.aggregates.length > 0) {
                this.parent.notify(events.refreshFooterRenderer, {});
                if (this.parent.groupSettings.columns.length > 0 && !this.isAddRow(this.cellDetails.rowIndex)) {
                    this.parent.notify(events.groupAggregates, {});
                }
            }
        };
    }

    protected getDataByIndex(index: number): Object {
        let row: Row<Column> = this.parent.getRowObjectFromUID(this.parent.getDataRows()[index].getAttribute('data-uid'));
        return row.changes ? row.changes : row.data;
    }

    private keyDownHandler(e: KeyboardEventArgs): void {
        if ((e.action === 'tab' || e.action === 'shiftTab') && this.parent.isEdit) {
            let gObj: IGrid = this.parent;
            let rowcell: Element = parentsUntil(e.target as Element, 'e-rowcell');
            if (rowcell) {
                let cell: Element = rowcell.querySelector('.e-field');
                if (cell) {
                    let visibleColumns: Column[] = this.parent.getVisibleColumns();
                    let columnIndex: number = e.action === 'tab' ? visibleColumns.length - 1 : 0;
                    if (visibleColumns[columnIndex].field === cell.getAttribute('id').slice(this.parent.element.id.length)) {
                        if (this.cellDetails.rowIndex !== gObj.getRows().length - 1) {
                            this.saveCell();
                        } else {
                            if (gObj.editSettings.newRowPosition === 'Top') {
                                gObj.editSettings.newRowPosition = 'Bottom';
                                this.addRecord();
                                gObj.editSettings.newRowPosition = 'Top';
                            } else {
                                this.addRecord();
                            }
                        }
                    }
                }
            }
        }
    }

    /**
     * @hidden   
     */
    public addCancelWhilePaging(): void {
        if (this.validateFormObj()) {
            this.parent.notify(events.destroyForm, {});
            this.parent.isEdit = false;
            this.isColored = false;
        }
    }
}