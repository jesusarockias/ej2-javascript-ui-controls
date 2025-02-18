import { ChildProperty, Collection, Complex, Component, Event, EventHandler, Internationalization, KeyboardEvents, L10n, NotifyPropertyChanges, Property, addClass, classList, closest, compile, createElement, extend, getElement, getEnumValue, getValue, isBlazor, isNullOrUndefined, merge, removeClass, setValue } from '@syncfusion/ej2-base';
import { Aggregate, CellType, ColumnMenu, CommandColumn, ContextMenu, DetailRow, Edit, ExcelExport, Filter, Grid, InterSectionObserver, Page, PdfExport, Predicate, Print, RenderType, Reorder, Resize, RowDD, RowDropSettings, Scroll, Sort, Toolbar, VirtualContentRenderer, VirtualRowModelGenerator, VirtualScroll, appendChildren, calculateAggregate, getActualProperties, getObject, getUid, iterateArrayOrObject, parentsUntil } from '@syncfusion/ej2-grids';
import { createCheckBox } from '@syncfusion/ej2-buttons';
import { CacheAdaptor, DataManager, DataUtil, Deferred, JsonAdaptor, ODataAdaptor, Predicate as Predicate$1, Query, RemoteSaveAdaptor, UrlAdaptor, WebApiAdaptor, WebMethodAdaptor } from '@syncfusion/ej2-data';
import { createSpinner, hideSpinner, showSpinner } from '@syncfusion/ej2-popups';

/**
 * Represents TreeGrid `Column` model class.
 */
class Column {
    constructor(options) {
        /**
         * If `allowEditing` set to false, then it disables editing of a particular column.
         * By default all columns are editable.
         * @default true
         */
        this.allowEditing = true;
        /**
         * Defines the `IEditCell` object to customize default edit cell.
         * @default {}
         */
        this.edit = {};
        /**
         * If `allowReordering` set to false, then it disables reorder of a particular column.
         * By default all columns can be reorder.
         * @default true
         */
        this.allowReordering = true;
        /**
         * If `showColumnMenu` set to false, then it disable the column menu of a particular column.
         * By default column menu will show for all columns
         * @default true
         */
        this.showColumnMenu = true;
        /**
         * If `allowFiltering` set to false, then it disables filtering option and filter bar element of a particular column.
         * By default all columns are filterable.
         * @default true
         */
        this.allowFiltering = true;
        /**
         * If `allowSorting` set to false, then it disables sorting option of a particular column.
         * By default all columns are sortable.
         * @default true
         */
        this.allowSorting = true;
        /**
         * If `allowResizing` is set to false, it disables resize option of a particular column.
         * By default all the columns can be resized.
         * @default true
         */
        this.allowResizing = true;
        /**
         *  It is used to customize the default filter options for a specific columns.
         * * type -  Specifies the filter type as menu.
         * * ui - to render custom component for specific column it has following functions.
         * * ui.create – It is used for creating custom components.
         * * ui.read -  It is used for read the value from the component.
         * * ui.write - It is used to apply component model as dynamically.
         *
         *  @default null
         */
        this.filter = {};
        merge(this, options);
    }
}

var __decorate$1 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/**
 * Configures the filtering behavior of the TreeGrid.
 */
class FilterSettings extends ChildProperty {
}
__decorate$1([
    Collection([], Predicate)
], FilterSettings.prototype, "columns", void 0);
__decorate$1([
    Property('FilterBar')
], FilterSettings.prototype, "type", void 0);
__decorate$1([
    Property()
], FilterSettings.prototype, "mode", void 0);
__decorate$1([
    Property(true)
], FilterSettings.prototype, "showFilterBarStatus", void 0);
__decorate$1([
    Property(1500)
], FilterSettings.prototype, "immediateModeDelay", void 0);
__decorate$1([
    Property()
], FilterSettings.prototype, "operators", void 0);
__decorate$1([
    Property(false)
], FilterSettings.prototype, "ignoreAccent", void 0);
__decorate$1([
    Property('Parent')
], FilterSettings.prototype, "hierarchyMode", void 0);

var __decorate$2 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/**
 * Configures the textwrap behavior of the TreeGrid.
 */
class TextWrapSettings extends ChildProperty {
}
__decorate$2([
    Property('Both')
], TextWrapSettings.prototype, "wrapMode", void 0);

/**
 *  @hidden
 */
const load = 'load';
/** @hidden */
const rowDataBound = 'rowDataBound';
/** @hidden */
const dataBound = 'dataBound';
/** @hidden */
const queryCellInfo = 'queryCellInfo';
/** @hidden */
const beforeDataBound = 'beforeDataBound';
/** @hidden */
const actionBegin = 'actionBegin';
/** @hidden */
const actionComplete = 'actionComplete';
/** @hidden */
const rowSelecting = 'rowSelecting';
/** @hidden */
const rowSelected = 'rowSelected';
/** @hidden */
const checkboxChange = 'checkboxChange';
/** @hidden */
const rowDeselected = 'rowDeselected';
/** @hidden */
const toolbarClick = 'toolbarClick';
/** @hidden */
const beforeExcelExport = 'beforeExcelExport';
/** @hidden */
const beforePdfExport = 'beforePdfExport';
/** @hidden */
const resizeStop = 'resizeStop';
/** @hidden */
const expanded = 'expanded';
/** @hidden */
const expanding = 'expanding';
/** @hidden */
const collapsed = 'collapsed';
/** @hidden */
const collapsing = 'collapsing';
/** @hidden */
const remoteExpand = 'remoteExpand';
/** @hidden */
const localPagedExpandCollapse = 'localPagedExpandCollapse';
/** @hidden */
const pagingActions = 'pagingActions';
/** @hidden */
const printGridInit = 'printGrid-Init';
/** @hidden */
const contextMenuOpen = 'contextMenuOpen';
/** @hidden */
const contextMenuClick = 'contextMenuClick';
/** @hidden */
const savePreviousRowPosition = 'savePreviousRowPosition';
/** @hidden */
const crudAction = 'crudAction';
/** @hidden */
const beginEdit = 'beginEdit';
/** @hidden */
const beginAdd = 'beginAdd';
/** @hidden */
const recordDoubleClick = 'recordDoubleClick';
/** @hidden */
const cellSave = 'cellSave';
/** @hidden */
const cellSaved = 'cellSaved';
/** @hidden */
const cellEdit = 'cellEdit';
/** @hidden */
const batchDelete = 'batchDelete';
/** @hidden */
const batchCancel = 'batchCancel';
/** @hidden */
const batchAdd = 'batchAdd';
/** @hidden */
const beforeBatchAdd = 'beforeBatchAdd';
/** @hidden */
const beforeBatchSave = 'beforeBatchSave';
/** @hidden */
const batchSave = 'batchSave';
/** @hidden */
const keyPressed = 'key-pressed';
/** @hidden */
const updateData = 'update-data';
/** @hidden */
const doubleTap = 'double-tap';
/** @hidden */
const virtualColumnIndex = 'virtualColumnIndex';
/** @hidden */
const virtualActionArgs = 'virtual-action-args';
/** @hidden */
const dataListener = 'data-listener';
/** @hidden */
const indexModifier = 'index-modifier';
/** @hidden */
const beforeStartEdit = 'edit-form';
/** @hidden */
const beforeBatchCancel = 'before-batch-cancel';
/** @hidden */
const batchEditFormRendered = 'batcheditform-rendered';
/** @hidden */
const detailDataBound = 'detailDataBound';
/** @hidden */
const rowDrag = 'rowDrag';
/** @hidden */
const rowDragStartHelper = 'rowDragStartHelper';
/** @hidden */
const rowDrop = 'rowDrop';
/** @hidden */
const rowDragStart = 'rowDragStart';
/** @hidden */
const rowsAdd = 'rows-add';
/** @hidden */
const rowsRemove = 'rows-remove';
/** @hidden */
const rowdraging = 'row-draging';
/** @hidden */
const rowDropped = 'row-dropped';

function isRemoteData(parent) {
    if (parent.dataSource instanceof DataManager) {
        let adaptor = parent.dataSource.adaptor;
        return (adaptor instanceof ODataAdaptor ||
            (adaptor instanceof WebApiAdaptor) || (adaptor instanceof WebMethodAdaptor) ||
            (adaptor instanceof CacheAdaptor) || adaptor instanceof UrlAdaptor);
    }
    return false;
}
/**
 * @hidden
 */
function findParentRecords(records) {
    let datas;
    datas = [];
    let recordsLength = Object.keys(records).length;
    for (let i = 0, len = recordsLength; i < len; i++) {
        let hasChild = getObject('hasChildRecords', records[i]);
        if (hasChild) {
            datas.push(records[i]);
        }
    }
    return datas;
}
/**
 * @hidden
 */
function getExpandStatus(parent, record, parents) {
    let parentRecord = isNullOrUndefined(record.parentItem) ? null :
        getParentData(parent, record.parentItem.uniqueID);
    let childParent;
    if (parentRecord != null) {
        if (parent.initialRender && !isNullOrUndefined(parentRecord[parent.expandStateMapping])
            && !parentRecord[parent.expandStateMapping]) {
            parentRecord.expanded = false;
            return false;
        }
        else if (parentRecord.expanded === false) {
            return false;
        }
        else if (parentRecord.parentItem) {
            childParent = getParentData(parent, parentRecord.parentItem.uniqueID);
            if (childParent && parent.initialRender && !isNullOrUndefined(childParent[parent.expandStateMapping])
                && !childParent[parent.expandStateMapping]) {
                childParent.expanded = false;
                return false;
            }
            if (childParent && childParent.expanded === false) {
                return false;
            }
            else if (childParent) {
                return getExpandStatus(parent, childParent, parents);
            }
            return true;
        }
        else {
            return true;
        }
    }
    else {
        return true;
    }
}
/**
 * @hidden
 */
function findChildrenRecords(records) {
    let datas = [];
    if (isNullOrUndefined(records) || !records.hasChildRecords) {
        return [];
    }
    if (!isNullOrUndefined(records.childRecords)) {
        let childRecords = records.childRecords;
        for (let i = 0, len = Object.keys(childRecords).length; i < len; i++) {
            datas.push(childRecords[i]);
            if (childRecords[i].hasChildRecords) {
                datas = [...datas, ...findChildrenRecords(childRecords[i])];
            }
        }
    }
    return datas;
}
function isOffline(parent) {
    if (isRemoteData(parent)) {
        let dm = parent.dataSource;
        return !isNullOrUndefined(dm.ready);
    }
    return true;
}
function extendArray(array) {
    let objArr = [];
    let obj;
    let keys;
    for (let i = 0; i < array.length; i++) {
        keys = Object.keys(array[i]);
        obj = {};
        for (let j = 0; j < keys.length; j++) {
            obj[keys[j]] = array[i][keys[j]];
        }
        objArr.push(obj);
    }
    return objArr;
}
function getPlainData(value) {
    delete value.hasChildRecords;
    delete value.childRecords;
    delete value.index;
    delete value.parentItem;
    delete value.level;
    return value;
}
function getParentData(parent, value, requireFilter) {
    if (requireFilter) {
        let idFilter = 'uniqueIDFilterCollection';
        return parent[idFilter][value];
    }
    else {
        let id = 'uniqueIDCollection';
        return parent[id][value];
    }
}

/**
 * TreeGrid Selection module
 * @hidden
 */
class Selection {
    /**
     * Constructor for Selection module
     */
    constructor(parent) {
        this.parent = parent;
        this.selectedItems = [];
        this.selectedIndexes = [];
        this.addEventListener();
    }
    /**
     * For internal use only - Get the module name.
     * @private
     */
    getModuleName() {
        return 'selection';
    }
    addEventListener() {
        this.parent.on('dataBoundArg', this.headerCheckbox, this);
        this.parent.on('columnCheckbox', this.columnCheckbox, this);
        this.parent.on('updateGridActions', this.updateGridActions, this);
        this.parent.on('checkboxSelection', this.checkboxSelection, this);
    }
    removeEventListener() {
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.off('dataBoundArg', this.headerCheckbox);
        this.parent.off('columnCheckbox', this.columnCheckbox);
        this.parent.off('checkboxSelection', this.checkboxSelection);
        this.parent.off('updateGridActions', this.updateGridActions);
    }
    /**
     * To destroy the Selection
     * @return {void}
     * @hidden
     */
    destroy() {
        this.removeEventListener();
    }
    checkboxSelection(args) {
        let target = getObject('target', args);
        let checkWrap = parentsUntil(target, 'e-checkbox-wrapper');
        let checkBox;
        if (checkWrap && checkWrap.querySelectorAll('.e-treecheckselect').length > 0) {
            checkBox = checkWrap.querySelector('input[type="checkbox"]');
            let rowIndex;
            rowIndex = [];
            rowIndex.push(target.closest('tr').rowIndex);
            this.selectCheckboxes(rowIndex);
            this.triggerChkChangeEvent(checkBox, checkBox.nextElementSibling.classList.contains('e-check'), target.closest('tr'));
        }
        else if (checkWrap && checkWrap.querySelectorAll('.e-treeselectall').length > 0 && this.parent.autoCheckHierarchy) {
            let checkBoxvalue = !checkWrap.querySelector('.e-frame').classList.contains('e-check')
                && !checkWrap.querySelector('.e-frame').classList.contains('e-stop');
            this.headerSelection(checkBoxvalue);
            checkBox = checkWrap.querySelector('input[type="checkbox"]');
            this.triggerChkChangeEvent(checkBox, checkBoxvalue, target.closest('tr'));
        }
    }
    triggerChkChangeEvent(checkBox, checkState, rowElement) {
        let data = this.parent.getCurrentViewRecords()[rowElement.rowIndex];
        let args = { checked: checkState, target: checkBox, rowElement: rowElement,
            rowData: checkBox.classList.contains('e-treeselectall')
                ? this.parent.getCheckedRecords() : data };
        this.parent.trigger(checkboxChange, args);
    }
    getCheckboxcolumnIndex() {
        let mappingUid;
        let columnIndex;
        let columns = (this.parent.columns);
        for (let col = 0; col < columns.length; col++) {
            if (columns[col].showCheckbox) {
                mappingUid = this.parent.columns[col].uid;
            }
        }
        let headerCelllength = this.parent.getHeaderTable().querySelectorAll('.e-headercelldiv').length;
        for (let j = 0; j < headerCelllength; j++) {
            let headercell = this.parent.getHeaderTable().querySelectorAll('.e-headercelldiv')[j];
            if (headercell.getAttribute('e-mappinguid') === mappingUid) {
                columnIndex = j;
            }
        }
        return columnIndex;
    }
    headerCheckbox() {
        this.columnIndex = this.getCheckboxcolumnIndex();
        if (this.columnIndex > -1 && this.parent.getHeaderTable().querySelectorAll('.e-treeselectall').length === 0) {
            let headerElement = this.parent.getHeaderTable().querySelectorAll('.e-headercelldiv')[this.columnIndex];
            let checkWrap;
            let value = false;
            let rowChkBox = this.parent.createElement('input', { className: 'e-treeselectall', attrs: { 'type': 'checkbox' } });
            checkWrap = createCheckBox(this.parent.createElement, false, { checked: value, label: ' ' });
            checkWrap.classList.add('e-hierarchycheckbox');
            checkWrap.querySelector('.e-frame').style.width = '18px';
            checkWrap.insertBefore(rowChkBox.cloneNode(), checkWrap.firstChild);
            if (!isNullOrUndefined(headerElement)) {
                headerElement.insertBefore(checkWrap, headerElement.firstChild);
            }
            this.headerSelection();
        }
    }
    renderColumnCheckbox(args) {
        let checkWrap;
        let rowChkBox = this.parent.createElement('input', { className: 'e-treecheckselect', attrs: { 'type': 'checkbox' } });
        let data = args.data;
        args.cell.classList.add('e-treegridcheckbox');
        args.cell.setAttribute('aria-label', 'checkbox');
        let value = (isNullOrUndefined(data.checkboxState) || data.checkboxState === 'uncheck') ? false : true;
        checkWrap = createCheckBox(this.parent.createElement, false, { checked: value, label: ' ' });
        checkWrap.classList.add('e-hierarchycheckbox');
        checkWrap.querySelector('.e-frame').style.width = '18px';
        if (data.checkboxState === 'indeterminate') {
            let checkbox = checkWrap.querySelectorAll('.e-frame')[0];
            removeClass([checkbox], ['e-check', 'e-stop', 'e-uncheck']);
            checkWrap.querySelector('.e-frame').classList.add('e-stop');
        }
        checkWrap.insertBefore(rowChkBox.cloneNode(), checkWrap.firstChild);
        return checkWrap;
    }
    columnCheckbox(container) {
        let checkWrap = this.renderColumnCheckbox(container);
        let containerELe = container.cell.querySelector('.e-treecolumn-container');
        if (!isNullOrUndefined(containerELe)) {
            containerELe.insertBefore(checkWrap, containerELe.querySelectorAll('.e-treecell')[0]);
        }
        else {
            let spanEle = checkWrap.querySelector('.e-label');
            let data = container.cell.innerHTML;
            container.cell.innerHTML = '';
            spanEle.innerHTML = data;
            container.cell.appendChild(checkWrap);
        }
    }
    selectCheckboxes(rowIndexes) {
        for (let i = 0; i < rowIndexes.length; i++) {
            let record = this.parent.getCurrentViewRecords()[rowIndexes[i]];
            let checkboxState = (record.checkboxState === 'uncheck') ? 'check' : 'uncheck';
            record.checkboxState = checkboxState;
            let keys = Object.keys(record);
            let data = getParentData(this.parent, record.uniqueID);
            for (let j = 0; j < keys.length; j++) {
                if (data.hasOwnProperty(keys[j])) {
                    data[keys[j]] = record[keys[j]];
                }
            }
            this.traverSelection(record, checkboxState, false);
            if (this.parent.autoCheckHierarchy) {
                this.headerSelection();
            }
        }
    }
    traverSelection(record, checkboxState, ischildItem) {
        let length = 0;
        this.updateSelectedItems(record, checkboxState);
        if (!ischildItem && record.parentItem && this.parent.autoCheckHierarchy) {
            this.updateParentSelection(record.parentItem);
        }
        if (record.childRecords && this.parent.autoCheckHierarchy) {
            let childRecords = record.childRecords;
            if (!isNullOrUndefined(this.parent.filterModule) &&
                this.parent.filterModule.filteredResult.length > 0 && this.parent.autoCheckHierarchy) {
                childRecords = this.getFilteredChildRecords(childRecords);
            }
            length = childRecords.length;
            for (let count = 0; count < length; count++) {
                if (childRecords[count].hasChildRecords) {
                    this.traverSelection(childRecords[count], checkboxState, true);
                }
                else {
                    this.updateSelectedItems(childRecords[count], checkboxState);
                }
            }
        }
    }
    getFilteredChildRecords(childRecords) {
        let filteredChildRecords = childRecords.filter((e) => {
            return this.parent.filterModule.filteredResult.indexOf(e) > -1;
        });
        return filteredChildRecords;
    }
    updateParentSelection(parentRecord) {
        let length = 0;
        let childRecords = [];
        let record = getParentData(this.parent, parentRecord.uniqueID);
        if (record && record.childRecords) {
            childRecords = record.childRecords;
        }
        if (!isNullOrUndefined(this.parent.filterModule) &&
            this.parent.filterModule.filteredResult.length > 0 && this.parent.autoCheckHierarchy) {
            childRecords = this.getFilteredChildRecords(childRecords);
        }
        length = childRecords && childRecords.length;
        let indeter = 0;
        let checkChildRecords = 0;
        if (!isNullOrUndefined(record)) {
            for (let i = 0; i < childRecords.length; i++) {
                if (childRecords[i].checkboxState === 'indeterminate') {
                    indeter++;
                }
                else if (childRecords[i].checkboxState === 'check') {
                    checkChildRecords++;
                }
            }
            if (indeter > 0 || (checkChildRecords > 0 && checkChildRecords !== length)) {
                record.checkboxState = 'indeterminate';
            }
            else if (checkChildRecords === 0 && indeter === 0) {
                record.checkboxState = 'uncheck';
            }
            else {
                record.checkboxState = 'check';
            }
            this.updateSelectedItems(record, record.checkboxState);
            if (record.parentItem) {
                this.updateParentSelection(record.parentItem);
            }
        }
    }
    headerSelection(checkAll) {
        let index = -1;
        let length = 0;
        let data = (!isNullOrUndefined(this.parent.filterModule) &&
            this.parent.filterModule.filteredResult.length > 0) ? this.parent.filterModule.filteredResult :
            this.parent.flatData;
        if (!isNullOrUndefined(checkAll)) {
            for (let i = 0; i < data.length; i++) {
                if (checkAll) {
                    if (data[i].checkboxState === 'check') {
                        continue;
                    }
                    data[i].checkboxState = 'check';
                    this.updateSelectedItems(data[i], data[i].checkboxState);
                }
                else {
                    index = this.selectedItems.indexOf(data[i]);
                    if (index > -1) {
                        data[i].checkboxState = 'uncheck';
                        this.updateSelectedItems(data[i], data[i].checkboxState);
                        if (this.parent.autoCheckHierarchy) {
                            this.updateParentSelection(data[i]);
                        }
                    }
                }
            }
        }
        length = this.selectedItems.length;
        let checkbox = this.parent.getHeaderTable().querySelectorAll('.e-frame')[0];
        if (length > 0 && data.length > 0) {
            if (length !== data.length) {
                removeClass([checkbox], ['e-check']);
                checkbox.classList.add('e-stop');
            }
            else {
                removeClass([checkbox], ['e-stop']);
                checkbox.classList.add('e-check');
            }
        }
        else {
            removeClass([checkbox], ['e-check', 'e-stop']);
        }
    }
    updateSelectedItems(currentRecord, checkState, filter) {
        let record = this.parent.getCurrentViewRecords().filter((e) => {
            return e.uniqueID === currentRecord.uniqueID;
        });
        let recordIndex = this.parent.getCurrentViewRecords().indexOf(record[0]);
        let checkbox;
        if (recordIndex > -1) {
            let tr = this.parent.getRows()[recordIndex];
            checkbox = tr.querySelectorAll('.e-frame')[0];
            if (!isNullOrUndefined(checkbox)) {
                removeClass([checkbox], ['e-check', 'e-stop', 'e-uncheck']);
            }
        }
        currentRecord.checkboxState = checkState;
        if (checkState === 'check' && isNullOrUndefined(currentRecord.isSummaryRow)) {
            if (recordIndex !== -1 && this.selectedIndexes.indexOf(recordIndex) === -1) {
                this.selectedIndexes.push(recordIndex);
            }
            if (this.selectedItems.indexOf(currentRecord) === -1 && (recordIndex !== -1 &&
                (!isNullOrUndefined(this.parent.filterModule) && this.parent.filterModule.filteredResult.length > 0))) {
                this.selectedItems.push(currentRecord);
            }
            if (this.selectedItems.indexOf(currentRecord) === -1 && (!isNullOrUndefined(this.parent.filterModule) &&
                this.parent.filterModule.filteredResult.length === 0)) {
                this.selectedItems.push(currentRecord);
            }
            if (this.selectedItems.indexOf(currentRecord) === -1 && isNullOrUndefined(this.parent.filterModule)) {
                this.selectedItems.push(currentRecord);
            }
        }
        else if ((checkState === 'uncheck' || checkState === 'indeterminate') && isNullOrUndefined(currentRecord.isSummaryRow)) {
            let index = this.selectedItems.indexOf(currentRecord);
            if (index !== -1) {
                this.selectedItems.splice(index, 1);
            }
            if (this.selectedIndexes.indexOf(recordIndex) !== -1) {
                let checkedIndex = this.selectedIndexes.indexOf(recordIndex);
                this.selectedIndexes.splice(checkedIndex, 1);
            }
        }
        let checkBoxclass = checkState === 'indeterminate' ? 'e-stop' : 'e-' + checkState;
        if (recordIndex > -1) {
            if (!isNullOrUndefined(checkbox)) {
                checkbox.classList.add(checkBoxclass);
            }
        }
    }
    updateGridActions(args) {
        let requestType = args.requestType;
        let childData;
        let childLength;
        if (this.parent.autoCheckHierarchy) {
            if ((requestType === 'sorting' || requestType === 'paging')) {
                childData = this.parent.getCurrentViewRecords();
                childLength = childData.length;
                this.selectedIndexes = [];
                for (let i = 0; i < childLength; i++) {
                    this.updateSelectedItems(childData[i], childData[i].checkboxState, true);
                }
            }
            else if (requestType === 'delete' || args.action === 'add') {
                let updatedData = [];
                if (requestType === 'delete') {
                    updatedData = args.data;
                }
                else {
                    updatedData.push(args.data);
                }
                for (let i = 0; i < updatedData.length; i++) {
                    if (requestType === 'delete') {
                        let index = this.parent.flatData.indexOf(updatedData[i]);
                        let checkedIndex = this.selectedIndexes.indexOf(index);
                        this.selectedIndexes.splice(checkedIndex, 1);
                        this.updateSelectedItems(updatedData[i], 'uncheck');
                    }
                    if (!isNullOrUndefined(updatedData[i].parentItem)) {
                        this.updateParentSelection(updatedData[i].parentItem);
                    }
                }
            }
            else if (args.requestType === 'add' && this.parent.autoCheckHierarchy) {
                args.data.checkboxState = 'uncheck';
            }
            else if (requestType === 'filtering' || requestType === 'searching') {
                this.selectedItems = [];
                this.selectedIndexes = [];
                childData = (this.parent.filterModule.filteredResult.length > 0) ? this.parent.getCurrentViewRecords() :
                    this.parent.flatData;
                childData.forEach((record) => {
                    if (record.hasChildRecords) {
                        this.updateParentSelection(record);
                    }
                    else {
                        this.updateSelectedItems(record, record.checkboxState);
                    }
                });
                this.headerSelection();
            }
        }
    }
    getCheckedrecords() {
        return this.selectedItems;
    }
    getCheckedRowIndexes() {
        return this.selectedIndexes;
    }
}

/**
 * TreeGrid ColumnMenu module
 * @hidden
 */
class ColumnMenu$1 {
    /**
     * Constructor for render module
     */
    constructor(parent) {
        Grid.Inject(ColumnMenu);
        this.parent = parent;
    }
    getColumnMenu() {
        return this.parent.grid.columnMenuModule.getColumnMenu();
    }
    destroy() {
        //this.parent.grid.columnMenuModule.destroy();
    }
    /**
     * For internal use only - Get the module name.
     * @private
     */
    getModuleName() {
        return 'columnMenu';
    }
}

/**
 * TreeGrid Print module
 * @hidden
 */
class Print$1 {
    /**
     * Constructor for Print module
     */
    constructor(parent) {
        this.parent = parent;
        Grid.Inject(Print);
        this.addEventListener();
    }
    /**
     * For internal use only - Get the module name.
     * @private
     */
    getModuleName() {
        return 'print';
    }
    /**
     * @hidden
     */
    addEventListener() {
        this.parent.grid.on(printGridInit, this.printTreeGrid, this);
    }
    removeEventListener() {
        this.parent.grid.off(printGridInit, this.printTreeGrid);
    }
    printTreeGrid(printGrid) {
        let grid = getObject('printgrid', printGrid);
        let gridElement = getObject('element', printGrid);
        grid.addEventListener(queryCellInfo, this.parent.grid.queryCellInfo);
        grid.addEventListener(rowDataBound, this.parent.grid.rowDataBound);
        grid.addEventListener(beforeDataBound, this.parent.grid.beforeDataBound);
        addClass([gridElement], 'e-treegrid');
    }
    print() {
        this.parent.grid.print();
    }
    /**
     * To destroy the Print
     * @return {void}
     * @hidden
     */
    destroy() {
        this.removeEventListener();
    }
}

var __decorate$3 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/**
 * Configures the filtering behavior of the TreeGrid.
 */
class SearchSettings extends ChildProperty {
}
__decorate$3([
    Property()
], SearchSettings.prototype, "fields", void 0);
__decorate$3([
    Property(false)
], SearchSettings.prototype, "ignoreCase", void 0);
__decorate$3([
    Property('contains')
], SearchSettings.prototype, "operator", void 0);
__decorate$3([
    Property()
], SearchSettings.prototype, "key", void 0);
__decorate$3([
    Property()
], SearchSettings.prototype, "hierarchyMode", void 0);

var __decorate$4 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/**
 * Configures the selection behavior of the TreeGrid.
 */
class SelectionSettings extends ChildProperty {
}
__decorate$4([
    Property('Row')
], SelectionSettings.prototype, "mode", void 0);
__decorate$4([
    Property('Flow')
], SelectionSettings.prototype, "cellSelectionMode", void 0);
__decorate$4([
    Property('Single')
], SelectionSettings.prototype, "type", void 0);
__decorate$4([
    Property(false)
], SelectionSettings.prototype, "persistSelection", void 0);
__decorate$4([
    Property('Default')
], SelectionSettings.prototype, "checkboxMode", void 0);
__decorate$4([
    Property(false)
], SelectionSettings.prototype, "checkboxOnly", void 0);

/**
 * TreeGrid render module
 * @hidden
 */
class Render {
    /**
     * Constructor for render module
     */
    constructor(parent) {
        this.parent = parent;
        this.templateResult = null;
        this.parent.grid.on('template-result', this.columnTemplateResult, this);
    }
    /**
     * Updated row elements for TreeGrid
     */
    RowModifier(args) {
        if (!args.data) {
            return;
        }
        let data = args.data;
        let parentData = data.parentItem;
        let index;
        if (!isNullOrUndefined(data.parentItem) &&
            (!(this.parent.allowPaging && !(this.parent.pageSettings.pageSizeMode === 'Root')) ||
                (isRemoteData(this.parent) && !isOffline(this.parent)))) {
            index = data.parentItem.index;
            let collapsed$$1 = (this.parent.initialRender && (!(isNullOrUndefined(parentData[this.parent.expandStateMapping]) ||
                parentData[this.parent.expandStateMapping]) || this.parent.enableCollapseAll)) ||
                !getExpandStatus(this.parent, args.data, this.parent.grid.getCurrentViewRecords());
            if (collapsed$$1) {
                args.row.style.display = 'none';
            }
        }
        else {
            index = +args.row.getAttribute('aria-rowindex');
        }
        if (isRemoteData(this.parent) && !isOffline(this.parent)) {
            let proxy = this.parent;
            let parentrec = this.parent.getCurrentViewRecords().filter((rec) => {
                return getValue(proxy.idMapping, rec) === getValue(proxy.parentIdMapping, data);
            });
            if (parentrec.length > 0) {
                let display = parentrec[0].expanded ? 'table-row' : 'none';
                args.row.setAttribute('style', 'display: ' + display + ';');
            }
        }
        addClass([args.row], 'e-gridrowindex' + index + 'level' + args.data.level);
        let summaryRow = getObject('isSummaryRow', args.data);
        if (summaryRow) {
            addClass([args.row], 'e-summaryrow');
        }
        if (args.row.querySelector('.e-treegridexpand')) {
            args.row.setAttribute('aria-expanded', 'true');
        }
        else if (args.row.querySelector('.e-treegridcollapse')) {
            args.row.setAttribute('aria-expanded', 'false');
        }
        if (this.parent.enableCollapseAll && this.parent.initialRender) {
            if (!isNullOrUndefined(data.parentItem)) {
                args.row.style.display = 'none';
            }
        }
        this.parent.trigger(rowDataBound, args);
    }
    /**
     * cell renderer for tree column index cell
     */
    cellRender(args) {
        if (!args.data) {
            return;
        }
        let grid = this.parent.grid;
        let data = args.data;
        let ispadfilter = isNullOrUndefined(data.filterLevel);
        let pad = ispadfilter ? data.level : data.filterLevel;
        let totalIconsWidth = 0;
        let cellElement;
        let column = this.parent.getColumnByField(args.column.field);
        let summaryRow = data.isSummaryRow;
        if (grid.getColumnIndexByUid(args.column.uid) === this.parent.treeColumnIndex) {
            let container = createElement('div', {
                className: 'e-treecolumn-container'
            });
            let emptyExpandIcon = createElement('span', {
                className: 'e-icons e-none',
                styles: 'width: 10px; display: inline-block'
            });
            for (let n = 0; n < pad; n++) {
                totalIconsWidth += 10;
                container.appendChild(emptyExpandIcon.cloneNode());
            }
            let iconRequired = !isNullOrUndefined(data.hasFilteredChildRecords)
                ? data.hasFilteredChildRecords : data.hasChildRecords;
            if (iconRequired && !isNullOrUndefined(data.childRecords)) {
                iconRequired = !(data.childRecords.length === 0);
            }
            if (iconRequired) {
                addClass([args.cell], 'e-treerowcell');
                let expandIcon = createElement('span', {
                    className: 'e-icons'
                });
                let expand;
                if (this.parent.initialRender) {
                    expand = data.expanded &&
                        (isNullOrUndefined(data[this.parent.expandStateMapping]) || data[this.parent.expandStateMapping]) &&
                        !this.parent.enableCollapseAll;
                }
                else {
                    expand = !(!data.expanded || !getExpandStatus(this.parent, data, this.parent.grid.getCurrentViewRecords()));
                }
                let collapsed$$1 = true;
                if (!isNullOrUndefined(data.parentItem) && (!isNullOrUndefined(data[this.parent.expandStateMapping])
                    && data[this.parent.expandStateMapping])
                    && !(this.parent.allowPaging && !(this.parent.pageSettings.pageSizeMode === 'Root'))) {
                    collapsed$$1 = !getExpandStatus(this.parent, args.data, this.parent.grid.getCurrentViewRecords());
                }
                addClass([expandIcon], (expand && collapsed$$1) ? 'e-treegridexpand' : 'e-treegridcollapse');
                totalIconsWidth += 18;
                container.appendChild(expandIcon);
                emptyExpandIcon.style.width = '7px';
                totalIconsWidth += 7;
                container.appendChild(emptyExpandIcon.cloneNode());
            }
            else if (pad || !pad && !data.level) {
                // icons width
                totalIconsWidth += 20;
                container.appendChild(emptyExpandIcon.cloneNode());
                container.appendChild(emptyExpandIcon.cloneNode());
            }
            //should add below code when paging funcitonality implemented
            // if (data.hasChildRecords) {
            //     addClass([expandIcon], data.expanded ? 'e-treegridexpand' : 'e-treegridcollapse');
            // }
            cellElement = createElement('span', {
                className: 'e-treecell'
            });
            if (this.parent.allowTextWrap) {
                cellElement.style.width = 'Calc(100% - ' + totalIconsWidth + 'px)';
            }
            this.updateTreeCell(args, cellElement, container);
            container.appendChild(cellElement);
            args.cell.appendChild(container);
        }
        if (!isNullOrUndefined(column) && column.showCheckbox) {
            this.parent.notify('columnCheckbox', args);
            if (this.parent.allowTextWrap) {
                let checkboxElement = args.cell.querySelectorAll('.e-frame')[0];
                let width = parseInt(checkboxElement.style.width, 16);
                totalIconsWidth += width;
                cellElement.style.width = 'Calc(100% - ' + totalIconsWidth + 'px)';
            }
        }
        if (summaryRow) {
            addClass([args.cell], 'e-summarycell');
            let summaryData = getObject(args.column.field, args.data);
            args.cell.querySelector('.e-treecell') != null ?
                args.cell.querySelector('.e-treecell').innerHTML = summaryData : args.cell.innerHTML = summaryData;
        }
        if (isNullOrUndefined(this.parent.rowTemplate)) {
            this.parent.trigger(queryCellInfo, args);
        }
    }
    updateTreeCell(args, cellElement, container) {
        let textContent = args.cell.querySelector('.e-treecell') != null ?
            args.cell.querySelector('.e-treecell').innerHTML : args.cell.innerHTML;
        if (typeof (args.column.template) === 'object' && this.templateResult) {
            appendChildren(cellElement, this.templateResult);
            this.templateResult = null;
            args.cell.innerHTML = '';
        }
        else if (args.cell.classList.contains('e-templatecell')) {
            let len = args.cell.children.length;
            for (let i = 0; i < len; len = args.cell.children.length) {
                cellElement.appendChild(args.cell.children[i]);
            }
        }
        else {
            cellElement.innerHTML = textContent;
            args.cell.innerHTML = '';
        }
    }
    columnTemplateResult(args) {
        this.templateResult = args.template;
    }
    destroy() {
        this.parent.grid.off('template-result', this.columnTemplateResult);
    }
}

/**
 * Internal dataoperations for TreeGrid
 * @hidden
 */
class Sort$1 {
    constructor(grid) {
        Grid.Inject(Sort);
        this.parent = grid;
        this.taskIds = [];
        this.flatSortedData = [];
        this.storedIndex = -1;
        this.isSelfReference = !isNullOrUndefined(this.parent.parentIdMapping);
        this.addEventListener();
    }
    /**
     * For internal use only - Get the module name.
     * @private
     */
    getModuleName() {
        return 'sort';
    }
    /**
     * @hidden
     */
    addEventListener() {
        this.parent.on('updateModel', this.updateModel, this);
        this.parent.on('createSort', this.createdSortedRecords, this);
    }
    /**
     * @hidden
     */
    removeEventListener() {
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.off('updateModel', this.updateModel);
        this.parent.off('createSort', this.createdSortedRecords);
    }
    createdSortedRecords(sortParams) {
        let data = sortParams.modifiedData;
        let srtQry = sortParams.srtQry;
        this.iterateSort(data, srtQry);
        this.storedIndex = -1;
        sortParams.modifiedData = this.flatSortedData;
        this.flatSortedData = [];
    }
    iterateSort(data, srtQry) {
        for (let d = 0; d < data.length; d++) {
            if (this.parent.grid.filterSettings.columns.length > 0 || this.parent.grid.searchSettings.key !== '') {
                if (!isNullOrUndefined(getParentData(this.parent, data[d].uniqueID, true))) {
                    this.storedIndex++;
                    this.flatSortedData[this.storedIndex] = data[d];
                }
            }
            else {
                this.storedIndex++;
                this.flatSortedData[this.storedIndex] = data[d];
            }
            if (data[d].hasChildRecords) {
                let childSort = (new DataManager(data[d].childRecords).executeLocal(srtQry));
                this.iterateSort(childSort, srtQry);
            }
        }
    }
    /**
     * Sorts a column with the given options.
     * @param {string} columnName - Defines the column name to be sorted.
     * @param {SortDirection} direction - Defines the direction of sorting field.
     * @param {boolean} isMultiSort - Specifies whether the previous sorted columns are to be maintained.
     * @return {void}
     */
    sortColumn(columnName, direction, isMultiSort) {
        this.parent.grid.sortColumn(columnName, direction, isMultiSort);
    }
    removeSortColumn(field) {
        this.parent.grid.removeSortColumn(field);
    }
    /**
     * The function used to update sortSettings of TreeGrid.
     * @return {void}
     * @hidden
     */
    updateModel() {
        this.parent.setProperties({ sortSettings: getActualProperties(this.parent.grid.sortSettings) }, true);
    }
    /**
     * Clears all the sorted columns of the TreeGrid.
     * @return {void}
     */
    clearSorting() {
        this.parent.grid.clearSorting();
        this.updateModel();
    }
    /**
     * Destroys the Sorting of TreeGrid.
     * @method destroy
     * @return {void}
     */
    destroy() {
        this.removeEventListener();
    }
}

/**
 * Internal dataoperations for tree grid
 * @hidden
 */
class DataManipulation {
    constructor(grid) {
        this.parent = grid;
        this.parentItems = [];
        this.taskIds = [];
        this.hierarchyData = [];
        this.storedIndex = -1;
        this.sortedData = [];
        this.isSortAction = false;
        this.addEventListener();
        this.dataResults = {};
        this.isSelfReference = !isNullOrUndefined(this.parent.parentIdMapping);
    }
    /**
     * @hidden
     */
    addEventListener() {
        this.parent.on('updateRemoteLevel', this.updateParentRemoteData, this);
        this.parent.grid.on('sorting-begin', this.beginSorting, this);
        this.parent.on('updateAction', this.updateData, this);
        this.parent.on(remoteExpand, this.collectExpandingRecs, this);
        this.parent.on('dataProcessor', this.dataProcessor, this);
    }
    /**
     * @hidden
     */
    removeEventListener() {
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.off(remoteExpand, this.collectExpandingRecs);
        this.parent.off('updateRemoteLevel', this.updateParentRemoteData);
        this.parent.off('updateAction', this.updateData);
        this.parent.off('dataProcessor', this.dataProcessor);
        this.parent.grid.off('sorting-begin', this.beginSorting);
    }
    /**
     * To destroy the dataModule
     * @return {void}
     * @hidden
     */
    destroy() {
        this.removeEventListener();
    }
    /** @hidden */
    isRemote() {
        if (!(this.parent.dataSource instanceof DataManager)) {
            return false;
        }
        return true;
        // let gridData:  DataManager = <DataManager>this.parent.dataSource;
        // return gridData.dataSource.offline !== true && gridData.dataSource.url !== undefined;
    }
    /**
     * Function to manipulate datasource
     * @hidden
     */
    convertToFlatData(data) {
        this.parent.flatData = (Object.keys(data).length === 0 && !(this.parent.dataSource instanceof DataManager) ?
            this.parent.dataSource : []);
        this.parent.parentData = [];
        let adaptorName = 'adaptorName';
        if ((isRemoteData(this.parent) && !isOffline(this.parent)) && data instanceof DataManager && !(data instanceof Array)) {
            let dm = this.parent.dataSource;
            if (this.parent.parentIdMapping) {
                this.parent.query = isNullOrUndefined(this.parent.query) ?
                    new Query() : this.parent.query;
                if (this.parent.parentIdMapping) {
                    if (this.parent.initialRender) {
                        this.parent.query.where(this.parent.parentIdMapping, 'equal', null);
                        this.parent.query.addParams('IdMapping', this.parent.idMapping);
                    }
                }
                if (!this.parent.hasChildMapping && !(this.parent.dataSource[adaptorName] === 'BlazorAdaptor')) {
                    let qry = this.parent.query.clone();
                    qry.queries = [];
                    qry = qry.select([this.parent.parentIdMapping]);
                    qry.isCountRequired = true;
                    dm.executeQuery(qry).then((e) => {
                        this.parentItems = DataUtil.distinct(e.result, this.parent.parentIdMapping, false);
                        let req = getObject('dataSource.requests', this.parent).filter((e) => {
                            return e.httpRequest.statusText !== 'OK';
                        }).length;
                        if (req === 0) {
                            setValue('grid.contentModule.isLoaded', true, this.parent);
                            if (!isNullOrUndefined(this.zerothLevelData)) {
                                setValue('cancel', false, this.zerothLevelData);
                                getValue('grid.renderModule', this.parent).dataManagerSuccess(this.zerothLevelData);
                                this.zerothLevelData = null;
                            }
                            this.parent.grid.hideSpinner();
                        }
                    });
                }
            }
        }
        else if (data instanceof Array) {
            this.hierarchyData = [];
            this.taskIds = [];
            for (let i = 0; i < Object.keys(data).length; i++) {
                let tempData = data[i];
                this.hierarchyData.push(extend({}, tempData));
                if (!isNullOrUndefined(tempData[this.parent.idMapping])) {
                    this.taskIds.push(tempData[this.parent.idMapping]);
                }
            }
            if (this.isSelfReference) {
                let selfData = [];
                let mappingData = new DataManager(this.hierarchyData).executeLocal(new Query()
                    .group(this.parent.parentIdMapping));
                for (let i = 0; i < mappingData.length; i++) {
                    let groupData = mappingData[i];
                    let index = this.taskIds.indexOf(groupData.key);
                    if (!isNullOrUndefined(groupData.key)) {
                        if (index > -1) {
                            let childData = (groupData.items);
                            this.hierarchyData[index][this.parent.childMapping] = childData;
                            continue;
                        }
                    }
                    selfData.push.apply(selfData, groupData.items);
                }
                this.hierarchyData = this.selfReferenceUpdate(selfData);
            }
            if (!Object.keys(this.hierarchyData).length) {
                this.parent.flatData = (!(this.parent.dataSource instanceof DataManager) ? this.parent.dataSource : []);
            }
            else {
                this.createRecords(this.hierarchyData);
            }
            this.storedIndex = -1;
        }
        // else if (data instanceof DataManager && this.parent.isLocalData) {
        //   this.convertToFlatData(data.dataSource.json);
        // }
        //this.crudActions();
    }
    // private crudActions(): void {
    //   if (this.parent.dataSource instanceof DataManager && (this.parent.dataSource.adaptor instanceof RemoteSaveAdaptor)) {
    //     let oldUpdate: Function = this.parent.dataSource.adaptor.update;
    //     this.parent.dataSource.adaptor.update =
    //         function (dm: DataManager, keyField: string, value: Object, tableName?: string, query?: Query, original?: Object): Object {
    //                value = getPlainData(value);
    //                return oldUpdate.apply(this, [dm, keyField, value, tableName, query, original]);
    //              }
    //   }
    // }
    selfReferenceUpdate(selfData) {
        let result = [];
        while (this.hierarchyData.length > 0 && selfData.length > 0) {
            let index = selfData.indexOf(this.hierarchyData[0]);
            if (index === -1) {
                this.hierarchyData.shift();
            }
            else {
                result.push(this.hierarchyData.shift());
                selfData.splice(index, 1);
            }
        }
        return result;
    }
    /**
     * Function to update the zeroth level parent records in remote binding
     * @hidden
     */
    updateParentRemoteData(args) {
        let records = args.result;
        let adaptorName = 'adaptorName';
        if (!this.parent.hasChildMapping && !this.parentItems.length &&
            (!(this.parent.dataSource[adaptorName] === 'BlazorAdaptor') && !this.parent.loadChildOnDemand)) {
            this.zerothLevelData = args;
            setValue('cancel', true, args);
        }
        else {
            if (!(this.parent.dataSource[adaptorName] === 'BlazorAdaptor') && !this.parent.loadChildOnDemand) {
                for (let rec = 0; rec < records.length; rec++) {
                    if ((records[rec][this.parent.hasChildMapping] || this.parentItems.indexOf(records[rec][this.parent.idMapping]) !== -1)
                        && (isNullOrUndefined(records[rec].index))) {
                        records[rec].level = 0;
                        records[rec].index = Math.ceil(Math.random() * 1000);
                        records[rec].hasChildRecords = true;
                    }
                }
            }
            else {
                this.convertToFlatData(records);
            }
        }
        args.result = this.parent.dataSource[adaptorName] === 'BlazorAdaptor' || this.parent.loadChildOnDemand ? this.parent.flatData : records;
        this.parent.notify('updateResults', args);
    }
    /**
     * Function to manipulate datasource
     * @hidden
     */
    collectExpandingRecs(rowDetails) {
        let gridRows = this.parent.getRows();
        let adaptorName = 'adaptorName';
        let args = { row: rowDetails.parentRow, data: rowDetails.record };
        if (rowDetails.rows.length > 0) {
            rowDetails.record.expanded = true;
            for (let i = 0; i < rowDetails.rows.length; i++) {
                rowDetails.rows[i].style.display = 'table-row';
                if ((isBlazor() && this.parent.dataSource[adaptorName] === 'BlazorAdaptor') || !this.parent.loadChildOnDemand) {
                    let targetEle = rowDetails.rows[i].getElementsByClassName('e-treegridcollapse')[0];
                    if (!isNullOrUndefined(targetEle)) {
                        addClass([targetEle], 'e-treegridexpand');
                        removeClass([targetEle], 'e-treegridcollapse');
                    }
                    let childRecord = this.parent.grid.getRowObjectFromUID(rowDetails.rows[i].getAttribute('data-Uid')).data;
                    let childRows = gridRows.filter((r) => r.classList.contains('e-gridrowindex' + childRecord.index + 'level' + (childRecord.level + 1)));
                    if (childRows.length) {
                        this.collectExpandingRecs({ record: childRecord, rows: childRows, parentRow: rowDetails.parentRow });
                    }
                }
                let expandingTd = rowDetails.rows[i].querySelector('.e-detailrowcollapse');
                if (!isNullOrUndefined(expandingTd)) {
                    this.parent.grid.detailRowModule.expand(expandingTd);
                }
            }
        }
        else {
            let dm = this.parent.dataSource;
            let qry = this.parent.grid.getDataModule().generateQuery();
            let clonequries = qry.queries.filter((e) => e.fn !== 'onPage' && e.fn !== 'onWhere');
            qry.queries = clonequries;
            qry.isCountRequired = true;
            qry.where(this.parent.parentIdMapping, 'equal', rowDetails.record[this.parent.idMapping]);
            showSpinner(this.parent.element);
            dm.executeQuery(qry).then((e) => {
                let datas = this.parent.grid.currentViewData;
                let inx = datas.indexOf(rowDetails.record);
                let haveChild = getObject('actual.nextLevel', e);
                let result = e.result;
                rowDetails.record.childRecords = result;
                for (let r = 0; r < result.length; r++) {
                    result[r].level = rowDetails.record.level + 1;
                    result[r].index = Math.ceil(Math.random() * 1000);
                    result[r].parentItem = rowDetails.record;
                    delete result[r].parentItem.childRecords;
                    if ((result[r][this.parent.hasChildMapping] || this.parentItems.indexOf(result[r][this.parent.idMapping]) !== -1)
                        && !(haveChild && !haveChild[r])) {
                        result[r].hasChildRecords = true;
                        result[r].expanded = false;
                        result[r].uniqueID = getUid(this.parent.element.id + '_data_');
                        setValue('uniqueIDCollection.' + result[r].uniqueID, result[r], this.parent);
                    }
                    datas.splice(inx + r + 1, 0, result[r]);
                }
                setValue('result', datas, e);
                setValue('action', 'beforecontentrender', e);
                this.parent.trigger(actionComplete, e);
                hideSpinner(this.parent.element);
                e.count = this.parent.grid.pageSettings.totalRecordsCount;
                getValue('grid.renderModule', this.parent).dataManagerSuccess(e);
                this.parent.trigger(expanded, args);
            });
        }
    }
    beginSorting() {
        this.isSortAction = true;
    }
    createRecords(data, parentRecords) {
        let treeGridData = [];
        for (let i = 0, len = Object.keys(data).length; i < len; i++) {
            let currentData = extend({}, data[i]);
            currentData.taskData = data[i];
            let level = 0;
            this.storedIndex++;
            currentData.index = this.storedIndex;
            if (!isNullOrUndefined(currentData[this.parent.childMapping])) {
                currentData.hasChildRecords = true;
                if (this.parent.enableCollapseAll) {
                    currentData.expanded = false;
                }
                else {
                    currentData.expanded = !isNullOrUndefined(currentData[this.parent.expandStateMapping])
                        ? currentData[this.parent.expandStateMapping] : true;
                }
            }
            currentData.index = currentData.hasChildRecords ? this.storedIndex : this.storedIndex;
            if (this.isSelfReference && isNullOrUndefined(currentData[this.parent.parentIdMapping])) {
                this.parent.parentData.push(currentData);
            }
            currentData.uniqueID = getUid(this.parent.element.id + '_data_');
            setValue('uniqueIDCollection.' + currentData.uniqueID, currentData, this.parent);
            if (!isNullOrUndefined(parentRecords)) {
                let parentData = extend({}, parentRecords);
                delete parentData.childRecords;
                delete parentData[this.parent.childMapping];
                if (this.isSelfReference) {
                    delete parentData.taskData[this.parent.childMapping];
                }
                currentData.parentItem = parentData;
                currentData.parentUniqueID = parentData.uniqueID;
                level = parentRecords.level + 1;
            }
            currentData.level = level;
            currentData.checkboxState = 'uncheck';
            if (isNullOrUndefined(currentData[this.parent.parentIdMapping]) || currentData.parentItem) {
                this.parent.flatData.push(currentData);
            }
            if (!this.isSelfReference && currentData.level === 0) {
                this.parent.parentData.push(currentData);
            }
            if (!isNullOrUndefined(currentData[this.parent.childMapping] && currentData[this.parent.childMapping].length)) {
                let record = this.createRecords(currentData[this.parent.childMapping], currentData);
                currentData.childRecords = record;
            }
            treeGridData.push(currentData);
        }
        return treeGridData;
    }
    /**
     * Function to perform filtering/sorting action for local data
     * @hidden
     */
    dataProcessor(args) {
        let isExport = getObject('isExport', args);
        let expresults = getObject('expresults', args);
        let exportType = getObject('exportType', args);
        let isPrinting = getObject('isPrinting', args);
        let dataObj;
        let actionArgs = getObject('actionArgs', args);
        let requestType = getObject('requestType', args);
        let actionData = getObject('data', args);
        let action = getObject('action', args);
        if ((!isNullOrUndefined(actionArgs) && Object.keys(actionArgs).length) || requestType === 'save') {
            requestType = requestType ? requestType : actionArgs.requestType.toString();
            actionData = actionData ? actionData : getObject('data', actionArgs);
            action = action ? action : getObject('action', actionArgs);
            if (action === 'add') {
                this.parent.grid.currentViewData = args.result;
            }
            if (this.parent.isLocalData) {
                if ((requestType === 'delete' || requestType === 'save')) {
                    this.parent.notify(crudAction, { value: actionData, action: action || requestType });
                }
            }
        }
        if (isExport && !isNullOrUndefined(expresults)) {
            dataObj = expresults;
        }
        else {
            dataObj = this.parent.grid.dataSource;
        }
        let results = dataObj instanceof DataManager ? dataObj.dataSource.json : dataObj;
        let count = results.length;
        if ((this.parent.grid.allowFiltering && this.parent.grid.filterSettings.columns.length) ||
            (this.parent.grid.searchSettings.key.length > 0)) {
            let qry = new Query();
            let gridQuery = getObject('query', args);
            if (isNullOrUndefined(gridQuery)) {
                gridQuery = new Query();
                gridQuery = getValue('grid.renderModule.data', this.parent).filterQuery(gridQuery);
                gridQuery = getValue('grid.renderModule.data', this.parent).searchQuery(gridQuery);
            }
            let fltrQuery = gridQuery.queries.filter((q) => q.fn === 'onWhere');
            let srchQuery = gridQuery.queries.filter((q) => q.fn === 'onSearch');
            qry.queries = fltrQuery.concat(srchQuery);
            let filteredData = new DataManager(results).executeLocal(qry);
            this.parent.notify('updateFilterRecs', { data: filteredData });
            results = this.dataResults.result;
            this.dataResults.result = null;
            //this.parent.filterModule.updatedFilteredRecord(filteredData);
            if (this.parent.grid.aggregates.length > 0) {
                let query = getObject('query', args);
                if (isNullOrUndefined(gridQuery)) {
                    gridQuery = getValue('grid.renderModule.data', this.parent).aggregateQuery(new Query());
                }
                if (!isNullOrUndefined(query)) {
                    let summaryQuery = query.queries.filter((q) => q.fn === 'onAggregates');
                    results = this.parent.summaryModule.calculateSummaryValue(summaryQuery, results, true);
                }
            }
        }
        if (this.parent.grid.aggregates.length && this.parent.grid.sortSettings.columns.length === 0
            && this.parent.grid.filterSettings.columns.length === 0 && !this.parent.grid.searchSettings.key.length) {
            let gridQuery = getObject('query', args);
            if (isNullOrUndefined(gridQuery)) {
                gridQuery = getValue('grid.renderModule.data', this.parent).aggregateQuery(new Query());
            }
            let summaryQuery = gridQuery.queries.filter((q) => q.fn === 'onAggregates');
            results = this.parent.summaryModule.calculateSummaryValue(summaryQuery, this.parent.flatData, true);
        }
        if (this.parent.grid.sortSettings.columns.length > 0 || this.isSortAction) {
            this.isSortAction = false;
            let parentData;
            parentData = this.parent.parentData;
            let query = getObject('query', args);
            this.parent.sortModule = new Sort$1(this.parent);
            let srtQry = new Query();
            for (let srt = this.parent.grid.sortSettings.columns.length - 1; srt >= 0; srt--) {
                let col = this.parent.getColumnByField(this.parent.grid.sortSettings.columns[srt].field);
                let compFun = col.sortComparer && !this.isRemote() ?
                    col.sortComparer.bind(col) :
                    this.parent.grid.sortSettings.columns[srt].direction;
                srtQry.sortBy(this.parent.grid.sortSettings.columns[srt].field, compFun);
            }
            let modifiedData = new DataManager(parentData).executeLocal(srtQry);
            let sortArgs = { modifiedData: modifiedData, filteredData: results, srtQry: srtQry };
            this.parent.notify('createSort', sortArgs);
            results = sortArgs.modifiedData;
            this.dataResults.result = null;
            this.sortedData = results;
            this.parent.notify('updateModel', {});
            if (this.parent.grid.aggregates.length > 0 && !isNullOrUndefined(query)) {
                let isSort = false;
                let query = getObject('query', args);
                let summaryQuery = query.queries.filter((q) => q.fn === 'onAggregates');
                results = this.parent.summaryModule.calculateSummaryValue(summaryQuery, this.sortedData, isSort);
            }
        }
        count = results.length;
        let temp = this.paging(results, count, isExport, isPrinting, exportType, args);
        results = temp.result;
        count = temp.count;
        args.result = results;
        args.count = count;
        this.parent.notify('updateResults', args);
    }
    paging(results, count, isExport, isPrinting, exportType, args) {
        if (this.parent.allowPaging && (!isExport || exportType === 'CurrentPage')
            && (!isPrinting || this.parent.printMode === 'CurrentPage')) {
            this.parent.notify(pagingActions, { result: results, count: count });
            results = this.dataResults.result;
            count = this.dataResults.count;
        }
        else if (this.parent.enableVirtualization && (!isExport || exportType === 'CurrentPage')) {
            this.parent.notify(pagingActions, { result: results, count: count, actionArgs: getValue('actionArgs', args) });
            results = this.dataResults.result;
            count = this.dataResults.count;
        }
        let value = { result: results, count: count };
        return value;
    }
    /**
     * update for datasource
     */
    updateData(dataResult) {
        this.dataResults = dataResult;
    }
}

function editAction(details, control, isSelfReference, addRowIndex, selectedIndex, columnName, addRowRecord) {
    let value = details.value;
    let action = details.action;
    let i;
    let j;
    let key = control.grid.getPrimaryKeyFieldNames()[0];
    let treeData = control.dataSource instanceof DataManager ?
        control.dataSource.dataSource.json : control.dataSource;
    let modifiedData = [];
    let originalData = value;
    let isSkip = false;
    let currentViewRecords = control.grid.getCurrentViewRecords();
    if (action === 'add') {
        let addAct = addAction(details, treeData, control, isSelfReference, addRowIndex, selectedIndex, addRowRecord);
        value = addAct.value;
        isSkip = addAct.isSkip;
    }
    if (value instanceof Array) {
        modifiedData = extendArray(value);
    }
    else {
        modifiedData.push(extend({}, value));
    }
    if (!isSkip && (action !== 'add' ||
        (control.editSettings.newRowPosition !== 'Top' && control.editSettings.newRowPosition !== 'Bottom'))) {
        for (let k = 0; k < modifiedData.length; k++) {
            let keys = Object.keys(modifiedData[k].taskData);
            i = treeData.length;
            while (i-- && i >= 0) {
                if (treeData[i][key] === modifiedData[k][key]) {
                    if (action === 'delete') {
                        let currentData = treeData[i];
                        treeData.splice(i, 1);
                        if (isSelfReference) {
                            if (!isNullOrUndefined(currentData[control.parentIdMapping])) {
                                let parentData = control.flatData.filter((e) => e[control.idMapping] === currentData[control.parentIdMapping])[0];
                                let childRecords = parentData ? parentData[control.childMapping] : [];
                                for (let p = childRecords.length - 1; p >= 0; p--) {
                                    if (childRecords[p][control.idMapping] === currentData[control.idMapping]) {
                                        childRecords.splice(p, 1);
                                        if (!childRecords.length) {
                                            parentData.hasChildRecords = false;
                                            updateParentRow(key, parentData, action, control, isSelfReference);
                                        }
                                        break;
                                    }
                                }
                            }
                            break;
                        }
                    }
                    else {
                        if (action === 'edit') {
                            for (j = 0; j < keys.length; j++) {
                                if (treeData[i].hasOwnProperty(keys[j]) && (control.editSettings.mode !== 'Cell'
                                    || keys[j] === columnName)) {
                                    let editedData = getParentData(control, modifiedData[k].uniqueID);
                                    editedData.taskData[keys[j]] = treeData[i][keys[j]] = modifiedData[k][keys[j]];
                                }
                            }
                        }
                        else if (action === 'add') {
                            let index;
                            if (control.editSettings.newRowPosition === 'Child') {
                                if (isSelfReference) {
                                    originalData.taskData[control.parentIdMapping] = treeData[i][control.idMapping];
                                    treeData.splice(i + 1, 0, originalData.taskData);
                                }
                                else {
                                    if (!treeData[i].hasOwnProperty(control.childMapping)) {
                                        treeData[i][control.childMapping] = [];
                                    }
                                    treeData[i][control.childMapping].push(originalData.taskData);
                                    updateParentRow(key, treeData[i], action, control, isSelfReference, originalData);
                                }
                            }
                            else if (control.editSettings.newRowPosition === 'Below') {
                                treeData.splice(i + 1, 0, originalData.taskData);
                                updateParentRow(key, treeData[i], action, control, isSelfReference, originalData);
                            }
                            else if (!addRowIndex) {
                                index = 0;
                                treeData.splice(index, 0, originalData.taskData);
                            }
                            else if (control.editSettings.newRowPosition === 'Above') {
                                treeData.splice(i, 0, originalData.taskData);
                                updateParentRow(key, treeData[i], action, control, isSelfReference, originalData);
                            }
                        }
                        break;
                    }
                }
                else if (!isNullOrUndefined(treeData[i][control.childMapping])) {
                    if (removeChildRecords(treeData[i][control.childMapping], modifiedData[k], action, key, control, isSelfReference, originalData, columnName)) {
                        updateParentRow(key, treeData[i], action, control, isSelfReference);
                    }
                }
            }
        }
    }
}
function addAction(details, treeData, control, isSelfReference, addRowIndex, selectedIndex, addRowRecord) {
    let value;
    let isSkip = false;
    let currentViewRecords = control.grid.getCurrentViewRecords();
    value = extend({}, details.value);
    value = getPlainData(value);
    switch (control.editSettings.newRowPosition) {
        case 'Top':
            treeData.unshift(value);
            isSkip = true;
            break;
        case 'Bottom':
            treeData.push(value);
            isSkip = true;
            break;
        case 'Above':
            if (!isNullOrUndefined(addRowRecord)) {
                value = addRowRecord;
            }
            else {
                value = currentViewRecords[addRowIndex + 1];
            }
            break;
        case 'Below':
        case 'Child':
            if (!isNullOrUndefined(addRowRecord)) {
                value = addRowRecord;
            }
            else {
                value = currentViewRecords[addRowIndex];
            }
            if (selectedIndex === -1) {
                treeData.unshift(value);
                isSkip = true;
            }
    }
    return { value: value, isSkip: isSkip };
}
function removeChildRecords(childRecords, modifiedData, action, key, control, isSelfReference, originalData, columnName) {
    let isChildAll = false;
    let j = childRecords.length;
    while (j-- && j >= 0) {
        if (childRecords[j][key] === modifiedData[key] ||
            (isSelfReference && childRecords[j][control.parentIdMapping] === modifiedData[control.idMapping])) {
            if (action === 'edit') {
                let keys = Object.keys(modifiedData);
                let editedData = getParentData(control, modifiedData.uniqueID);
                for (let i = 0; i < keys.length; i++) {
                    if (childRecords[j].hasOwnProperty(keys[i]) && (control.editSettings.mode !== 'Cell' || keys[i] === columnName)) {
                        editedData[keys[i]] = editedData.taskData[keys[i]] = childRecords[j][keys[i]] = modifiedData[keys[i]];
                    }
                }
                break;
            }
            else if (action === 'add') {
                if (control.editSettings.newRowPosition === 'Child') {
                    if (isSelfReference) {
                        originalData[control.parentIdMapping] = childRecords[j][control.idMapping];
                        childRecords.splice(j + 1, 0, originalData);
                        updateParentRow(key, childRecords[j], action, control, isSelfReference, originalData);
                    }
                    else {
                        if (!childRecords[j].hasOwnProperty(control.childMapping)) {
                            childRecords[j][control.childMapping] = [];
                        }
                        childRecords[j][control.childMapping].push(originalData.taskData);
                        updateParentRow(key, childRecords[j], action, control, isSelfReference, originalData);
                    }
                }
                else if (control.editSettings.newRowPosition === 'Above') {
                    childRecords.splice(j, 0, originalData.taskData);
                    updateParentRow(key, childRecords[j], action, control, isSelfReference, originalData);
                }
                else if (control.editSettings.newRowPosition === 'Below') {
                    childRecords.splice(j + 1, 0, originalData.taskData);
                    updateParentRow(key, childRecords[j], action, control, isSelfReference, originalData);
                }
            }
            else {
                let parentItem = childRecords[j].parentItem;
                childRecords.splice(j, 1);
                if (!childRecords.length) {
                    isChildAll = true;
                }
            }
        }
        else if (!isNullOrUndefined(childRecords[j][control.childMapping])) {
            if (removeChildRecords(childRecords[j][control.childMapping], modifiedData, action, key, control, isSelfReference, originalData, columnName)) {
                updateParentRow(key, childRecords[j], action, control, isSelfReference);
            }
        }
    }
    return isChildAll;
}
function updateParentRow(key, record, action, control, isSelfReference, child) {
    if ((control.editSettings.newRowPosition === 'Above' || control.editSettings.newRowPosition === 'Below')
        && action === 'add' && !isNullOrUndefined(child.parentItem)) {
        let parentData = getParentData(control, child.parentItem.uniqueID);
        parentData.childRecords.push(child);
    }
    else {
        let currentRecords = control.grid.getCurrentViewRecords();
        let index;
        currentRecords.map((e, i) => { if (e[key] === record[key]) {
            index = i;
            return;
        } });
        record = currentRecords[index];
        record.hasChildRecords = false;
        if (action === 'add') {
            record.expanded = true;
            record.hasChildRecords = true;
            if (control.sortSettings.columns.length && isNullOrUndefined(child)) {
                child = currentRecords.filter((e) => {
                    if (e.parentUniqueID === record.uniqueID) {
                        return e;
                    }
                    else {
                        return null;
                    }
                });
            }
            let childRecords = child ? child instanceof Array ? child[0] : child : currentRecords[index + 1];
            if (!record.hasOwnProperty('childRecords')) {
                record.childRecords = [];
            }
            else {
                if (!isNullOrUndefined(child)) {
                    record.childRecords.push(child);
                }
            }
            if (record.childRecords.indexOf(childRecords) === -1) {
                record.childRecords.unshift(childRecords);
            }
            if (isSelfReference) {
                if (!record.hasOwnProperty(control.childMapping)) {
                    record[control.childMapping] = [];
                }
                if (record[control.childMapping].indexOf(childRecords) === -1) {
                    record[control.childMapping].unshift(childRecords);
                }
            }
        }
        let primaryKeys = control.grid.getPrimaryKeyFieldNames()[0];
        let data = control.grid.dataSource instanceof DataManager ?
            control.grid.dataSource.dataSource.json : control.grid.dataSource;
        for (let i = 0; i < data.length; i++) {
            if (data[i][primaryKeys] === record[primaryKeys]) {
                data[i] = record;
                break;
            }
        }
        control.grid.setRowData(key, record);
        let row = control.getRowByIndex(index);
        control.renderModule.cellRender({
            data: record, cell: row.cells[control.treeColumnIndex],
            column: control.grid.getColumns()[control.treeColumnIndex]
        });
    }
}

/**
 * TreeGrid RowDragAndDrop module
 * @hidden
 */
class RowDD$1 {
    /**
     *
     * Constructor for render module
     */
    constructor(parent) {
        /** @hidden */
        this.canDrop = true;
        /** @hidden */
        this.isDraggedWithChild = false;
        /** @hidden */
        this.isaddtoBottom = false;
        Grid.Inject(RowDD);
        this.parent = parent;
        this.addEventListener();
    }
    getChildrecordsByParentID(id) {
        let treeGridDataSource;
        if (this.parent.dataSource instanceof DataManager) {
            if (this.parent.dataSource.dataSource.offline && this.parent.dataSource.dataSource.json) {
                treeGridDataSource = this.parent.dataSource.dataSource.json;
            }
        }
        else {
            treeGridDataSource = this.parent.grid.dataSource;
        }
        let record = treeGridDataSource.filter((e) => {
            return e.uniqueID === id;
        });
        return record;
    }
    /**
     * @hidden
     */
    addEventListener() {
        this.parent.on(rowdraging, this.Rowdraging, this);
        this.parent.on(rowDropped, this.rowDropped, this);
        this.parent.on(rowsAdd, this.rowsAdded, this);
        this.parent.on(rowsRemove, this.rowsRemoved, this);
    }
    /**
     * Reorder the rows based on given indexes and position
     */
    reorderRows(fromIndexes, toIndex, position) {
        if (fromIndexes[0] !== toIndex && position === 'above' || 'below' || 'child') {
            if (position === 'above') {
                this.dropPosition = 'topSegment';
            }
            if (position === 'below') {
                this.dropPosition = 'bottomSegment';
            }
            if (position === 'child') {
                this.dropPosition = 'middleSegment';
            }
            let data = [];
            for (let i = 0; i < fromIndexes.length; i++) {
                data[i] = this.parent.getCurrentViewRecords()[fromIndexes[i]];
            }
            let isByMethod = true;
            let args = {
                data: data,
                dropIndex: toIndex
            };
            this.dropRows(args, isByMethod);
            //this.refreshGridDataSource();
            this.parent.refresh();
        }
        else {
            return;
        }
    }
    rowsAdded(e) {
        let draggedRecord;
        let dragRecords = e.records;
        for (let i = e.records.length - 1; i > -1; i--) {
            draggedRecord = dragRecords[i];
            if (draggedRecord.parentUniqueID) {
                let record = dragRecords.filter((data) => {
                    return data.uniqueID === draggedRecord.parentUniqueID;
                });
                if (record.length) {
                    let index = record[0].childRecords.indexOf(draggedRecord);
                    let parentRecord = record[0];
                    if (index !== -1) {
                        parentRecord.childRecords.splice(index, 1);
                        if (!parentRecord.childRecords.length) {
                            parentRecord.hasChildRecords = false;
                            parentRecord.hasFilteredChildRecords = false;
                        }
                        this.isDraggedWithChild = true;
                    }
                }
            }
        }
        if (!this.parent.dataSource.length) {
            let tObj = this.parent;
            let draggedRecord;
            let dragRecords = e.records;
            let dragLength = e.records.length;
            for (let i = dragLength - 1; i > -1; i--) {
                draggedRecord = dragRecords[i];
                let recordIndex1 = 0;
                if (!draggedRecord.taskData.hasOwnProperty(tObj.childMapping)) {
                    draggedRecord.taskData[tObj.childMapping] = [];
                }
                tObj.dataSource.splice(recordIndex1, 0, draggedRecord.taskData);
                tObj.setProperties({ dataSource: tObj.dataSource }, false);
            }
        }
        else {
            for (let i = 0; i < dragRecords.length; i++) {
                setValue('uniqueIDCollection.' + dragRecords[i].uniqueID, dragRecords[i], this.parent);
            }
            let args = { data: e.records, dropIndex: e.toIndex };
            if (this.parent.dataSource instanceof DataManager) {
                this.treeGridData = this.parent.dataSource.dataSource.json;
            }
            else {
                this.treeGridData = this.parent.grid.dataSource;
            }
            this.dropRows(args);
        }
    }
    rowsRemoved(e) {
        for (let i = 0; i < e.records.length; i++) {
            this.draggedRecord = e.records[i];
            if (this.draggedRecord.hasChildRecords || this.draggedRecord.parentItem &&
                this.parent.grid.dataSource.
                    indexOf(this.getChildrecordsByParentID(this.draggedRecord.parentUniqueID)[0]) !== -1 ||
                this.draggedRecord.level === 0) {
                this.deleteDragRow();
            }
        }
    }
    refreshGridDataSource() {
        let draggedRecord = this.draggedRecord;
        let droppedRecord = this.droppedRecord;
        let proxy = this.parent;
        let tempDataSource;
        let idx;
        if (proxy.dataSource instanceof DataManager) {
            if (proxy.dataSource.dataSource.offline && proxy.dataSource.dataSource.json) {
                tempDataSource = proxy.dataSource.dataSource.json;
            }
        }
        else {
            tempDataSource = proxy.dataSource;
        }
        if (tempDataSource && (!isNullOrUndefined(droppedRecord) && !droppedRecord.parentItem)) {
            for (let i = 0; i < Object.keys(tempDataSource).length; i++) {
                if (tempDataSource[i][this.parent.childMapping] === droppedRecord.taskData[this.parent.childMapping]) {
                    idx = i;
                }
            }
            if (this.dropPosition === 'topSegment') {
                if (!this.parent.idMapping) {
                    tempDataSource.splice(idx, 0, draggedRecord.taskData);
                }
            }
            else if (this.dropPosition === 'bottomSegment') {
                if (!this.parent.idMapping) {
                    tempDataSource.splice(idx + 1, 0, draggedRecord.taskData);
                }
            }
        }
        else if (!this.parent.parentIdMapping && (!isNullOrUndefined(droppedRecord) && droppedRecord.parentItem)) {
            if (this.dropPosition === 'topSegment' || this.dropPosition === 'bottomSegment') {
                let record = this.getChildrecordsByParentID(droppedRecord.parentUniqueID)[0];
                let childRecords = record.childRecords;
                for (let i = 0; i < childRecords.length; i++) {
                    droppedRecord.parentItem.taskData[this.parent.childMapping][i] = childRecords[i].taskData;
                }
            }
        }
        if (this.parent.parentIdMapping) {
            if (draggedRecord.parentItem) {
                if (this.dropPosition === 'topSegment' || this.dropPosition === 'bottomSegment') {
                    draggedRecord[this.parent.parentIdMapping] = droppedRecord[this.parent.parentIdMapping];
                    draggedRecord.taskData[this.parent.parentIdMapping] = droppedRecord[this.parent.parentIdMapping];
                }
                else {
                    draggedRecord[this.parent.parentIdMapping] = droppedRecord[this.parent.idMapping];
                    draggedRecord.taskData[this.parent.parentIdMapping] = droppedRecord[this.parent.idMapping];
                }
            }
            else {
                draggedRecord.taskData[this.parent.parentIdMapping] = null;
                draggedRecord[this.parent.parentIdMapping] = null;
            }
        }
    }
    removeFirstrowBorder(element, isRemove) {
        let canremove = this.dropPosition === 'bottomSegment';
        if (this.parent.element.getElementsByClassName('e-firstrow-border').length > 0 && element &&
            (element.rowIndex !== 0 || canremove)) {
            this.parent.element.getElementsByClassName('e-firstrow-border')[0].remove();
        }
    }
    removeLastrowBorder(element, isRemove) {
        let isEmptyRow = element && (element.classList.contains('e-emptyrow') || element.classList.contains('e-columnheader'));
        let islastRowIndex = element && !isEmptyRow &&
            this.parent.getRowByIndex(this.parent.getRows().length - 1).getAttribute('data-uid') !==
                element.getAttribute('data-uid');
        let canremove = islastRowIndex || this.dropPosition === 'topSegment';
        if (this.parent.element.getElementsByClassName('e-lastrow-border').length > 0 && element && (islastRowIndex || canremove)) {
            this.parent.element.getElementsByClassName('e-lastrow-border')[0].remove();
        }
    }
    updateIcon(row, index, args) {
        let rowEle = args.target ? closest(args.target, 'tr') : null;
        this.dropPosition = undefined;
        this.removeFirstrowBorder(rowEle);
        this.removeLastrowBorder(rowEle);
        for (let i = 0; i < args.rows.length; i++) {
            if (!isNullOrUndefined(rowEle) && rowEle.getAttribute('data-uid') === args.rows[i].getAttribute('data-uid')
                || !parentsUntil(args.target, 'e-gridcontent')) {
                this.dropPosition = 'Invalid';
                this.addErrorElem();
            }
        }
        // To get the corresponding drop position related to mouse position 
        let tObj = this.parent;
        let rowHeight = row[0].offsetHeight;
        let rowTop = 0;
        let roundOff = 0;
        let toolHeight = tObj.toolbar && tObj.toolbar.length ?
            document.getElementById(tObj.element.id + '_gridcontrol_toolbarItems').offsetHeight : 0;
        // tObj.lastRow = tObj.getRowByIndex(tObj.getCurrentViewRecords().length - 1);
        let positionOffSet = this.getOffset(tObj.element);
        // let contentHeight1: number = (tObj.element.offsetHeight  - (tObj.getContent() as HTMLElement).offsetHeight) + positionOffSet.top;
        let contentHeight = tObj.getHeaderContent().offsetHeight + positionOffSet.top + toolHeight;
        let scrollTop = tObj.getContent().scrollTop;
        // let scrollTop = (tObj.grid.scrollModule as any).content.scrollTop;
        if (tObj.allowTextWrap) {
            rowTop = row[0].offsetHeight;
        }
        else if (scrollTop !== 0) {
            roundOff = rowHeight - scrollTop % rowHeight;
            rowTop = (index * rowHeight) + contentHeight + roundOff;
        }
        else {
            rowTop = (index * rowHeight) + contentHeight + roundOff;
        }
        let rowBottom = rowTop + row[0].offsetHeight;
        let difference = rowBottom - rowTop;
        let divide = difference / 3;
        let topRowSegment = rowTop + divide;
        let middleRowSegment = topRowSegment + divide;
        let bottomRowSegment = middleRowSegment + divide;
        let posx = positionOffSet.left;
        let mouseEvent = getObject('originalEvent.event', args);
        let posy = mouseEvent.pageY;
        let isTopSegment = posy <= topRowSegment;
        let isMiddleRowSegment = (posy > topRowSegment && posy <= middleRowSegment);
        let isBottomRowSegment = (posy > middleRowSegment && posy <= bottomRowSegment);
        if (isTopSegment || isMiddleRowSegment || isBottomRowSegment) {
            if (isTopSegment && this.dropPosition !== 'Invalid') {
                this.removeChildBorder();
                this.dropPosition = 'topSegment';
                this.removetopOrBottomBorder();
                this.addFirstrowBorder(rowEle);
                this.removeErrorElem();
                this.removeLastrowBorder(rowEle);
                this.topOrBottomBorder(args.target);
            }
            if (isMiddleRowSegment && this.dropPosition !== 'Invalid') {
                this.removetopOrBottomBorder();
                let element;
                let rowElement = [];
                element = closest(args.target, 'tr');
                rowElement = [].slice.call(element.querySelectorAll('.e-rowcell,.e-rowdragdrop,.e-detailrowcollapse'));
                if (rowElement.length > 0) {
                    this.addRemoveClasses(rowElement, true, 'e-childborder');
                }
                this.addLastRowborder(rowEle);
                this.addFirstrowBorder(rowEle);
                this.dropPosition = 'middleSegment';
            }
            if (isBottomRowSegment && this.dropPosition !== 'Invalid') {
                this.removeErrorElem();
                this.removetopOrBottomBorder();
                this.removeChildBorder();
                this.dropPosition = 'bottomSegment';
                this.addLastRowborder(rowEle);
                this.removeFirstrowBorder(rowEle);
                this.topOrBottomBorder(args.target);
            }
        }
        return this.dropPosition;
    }
    removeChildBorder() {
        let borderElem = [];
        borderElem = [].slice.call(this.parent.element.querySelectorAll('.e-childborder'));
        if (borderElem.length > 0) {
            this.addRemoveClasses(borderElem, false, 'e-childborder');
        }
    }
    addFirstrowBorder(targetRow) {
        let node = this.parent.element;
        let tObj = this.parent;
        if (targetRow && targetRow.rowIndex === 0 && !targetRow.classList.contains('e-emptyrow')) {
            let div = this.parent.createElement('div', { className: 'e-firstrow-border' });
            let gridheaderEle = this.parent.getHeaderContent();
            let toolbarHeight = 0;
            if (tObj.toolbar) {
                toolbarHeight = tObj.toolbarModule.getToolbar().offsetHeight;
            }
            let multiplegrid = !isNullOrUndefined(this.parent.rowDropSettings.targetID);
            if (multiplegrid) {
                div.style.top = this.parent.grid.element.getElementsByClassName('e-gridheader')[0].offsetHeight
                    + toolbarHeight + 'px';
            }
            div.style.width = multiplegrid ? node.offsetWidth + 'px' :
                node.offsetWidth - this.getScrollWidth() + 'px';
            if (!gridheaderEle.querySelectorAll('.e-firstrow-border').length) {
                gridheaderEle.appendChild(div);
            }
        }
    }
    addLastRowborder(trElement) {
        let isEmptyRow = trElement && (trElement.classList.contains('e-emptyrow') ||
            trElement.classList.contains('e-columnheader'));
        if (trElement && !isEmptyRow && this.parent.getRowByIndex(this.parent.getRows().length - 1).getAttribute('data-uid') ===
            trElement.getAttribute('data-uid')) {
            let bottomborder = this.parent.createElement('div', { className: 'e-lastrow-border' });
            let gridcontentEle = this.parent.getContent();
            bottomborder.style.width = this.parent.element.offsetWidth - this.getScrollWidth() + 'px';
            if (!gridcontentEle.querySelectorAll('.e-lastrow-border').length) {
                gridcontentEle.classList.add('e-treegrid-relative');
                gridcontentEle.appendChild(bottomborder);
                bottomborder.style.bottom = this.getScrollWidth() + 'px';
            }
        }
    }
    getScrollWidth() {
        let scrollElem = this.parent.getContent().firstElementChild;
        return scrollElem.scrollWidth > scrollElem.offsetWidth ? Scroll.getScrollBarWidth() : 0;
    }
    addErrorElem() {
        let dragelem = document.getElementsByClassName('e-cloneproperties')[0];
        let errorelem = dragelem.querySelectorAll('.e-errorelem').length;
        if (!errorelem && !this.parent.rowDropSettings.targetID) {
            let ele = document.createElement('div');
            classList(ele, ['e-errorcontainer'], []);
            classList(ele, ['e-icons', 'e-errorelem'], []);
            let errorVal = dragelem.querySelector('.errorValue');
            let content = dragelem.querySelector('.e-rowcell').innerHTML;
            if (errorVal) {
                content = errorVal.innerHTML;
                errorVal.parentNode.removeChild(errorVal);
            }
            dragelem.querySelector('.e-rowcell').innerHTML = '';
            let spanContent = document.createElement('span');
            spanContent.className = 'errorValue';
            spanContent.style.paddingLeft = '16px';
            spanContent.innerHTML = content;
            dragelem.querySelector('.e-rowcell').appendChild(ele);
            dragelem.querySelector('.e-rowcell').appendChild(spanContent);
        }
    }
    removeErrorElem() {
        let errorelem = document.querySelector('.e-errorelem');
        if (errorelem) {
            errorelem.remove();
        }
    }
    topOrBottomBorder(target) {
        let element;
        let multiplegrid = !isNullOrUndefined(this.parent.rowDropSettings.targetID);
        let rowElement = [];
        element = closest(target, 'tr');
        rowElement = element ? [].slice.call(element.querySelectorAll('.e-rowcell,.e-rowdragdrop,.e-detailrowcollapse')) : [];
        if (rowElement.length) {
            if (this.dropPosition === 'topSegment') {
                this.addRemoveClasses(rowElement, true, 'e-droptop');
                if (this.parent.element.getElementsByClassName('e-lastrow-dragborder').length > 0) {
                    this.parent.element.getElementsByClassName('e-lastrow-dragborder')[0].remove();
                }
            }
            if (this.dropPosition === 'bottomSegment') {
                this.addRemoveClasses(rowElement, true, 'e-dropbottom');
            }
        }
    }
    removetopOrBottomBorder() {
        let border = [];
        border = [].slice.call(this.parent.element.querySelectorAll('.e-dropbottom, .e-droptop'));
        if (border.length) {
            this.addRemoveClasses(border, false, 'e-dropbottom');
            this.addRemoveClasses(border, false, 'e-droptop');
        }
    }
    addRemoveClasses(cells, add, className) {
        for (let i = 0, len = cells.length; i < len; i++) {
            if (add) {
                cells[i].classList.add(className);
            }
            else {
                cells[i].classList.remove(className);
            }
        }
    }
    getOffset(element) {
        let box = element.getBoundingClientRect();
        let body = document.body;
        let docElem = document.documentElement;
        let scrollTop = window.pageYOffset || docElem.scrollTop || body.scrollTop;
        let scrollLeft = window.pageXOffset || docElem.scrollLeft || body.scrollLeft;
        let clientTop = docElem.clientTop || body.clientTop || 0;
        let clientLeft = docElem.clientLeft || body.clientLeft || 0;
        let top = box.top + scrollTop - clientTop;
        let left = box.left + scrollLeft - clientLeft;
        return { top: Math.round(top), left: Math.round(left) };
    }
    Rowdraging(args) {
        let tObj = this.parent;
        let cloneElement = this.parent.element.querySelector('.e-cloneproperties');
        cloneElement.style.cursor = '';
        let rowEle = args.target ? closest(args.target, 'tr') : null;
        let rowIdx = rowEle ? rowEle.rowIndex : -1;
        let dragRecords = [];
        let droppedRecord = tObj.getCurrentViewRecords()[rowIdx];
        this.removeErrorElem();
        this.canDrop = true;
        if (!args.data[0]) {
            dragRecords.push(args.data);
        }
        else {
            dragRecords = args.data;
        }
        if (rowIdx !== -1) {
            this.ensuredropPosition(dragRecords, droppedRecord);
        }
        else {
            this.canDrop = false;
            this.addErrorElem();
        }
        if (!tObj.rowDropSettings.targetID && this.canDrop) {
            tObj.rowDragAndDropModule.updateIcon(args.rows, rowIdx, args);
        }
        if (tObj.rowDropSettings.targetID) {
            let dropElement = parentsUntil(args.target, 'e-treegrid');
            if (dropElement && dropElement.id === this.parent.rowDropSettings.targetID) {
                let srcControl = dropElement.ej2_instances[0];
                srcControl.rowDragAndDropModule.updateIcon(args.rows, rowIdx, args);
            }
        }
        if (args.target && closest(args.target, '#' + tObj.rowDropSettings.targetID)) {
            let dropElement = parentsUntil(args.target, 'e-treegrid');
            if (!dropElement) {
                cloneElement.style.cursor = 'default';
            }
        }
    }
    rowDropped(args) {
        let tObj = this.parent;
        if (!tObj.rowDropSettings.targetID) {
            if (parentsUntil(args.target, 'e-content')) {
                setValue('dropPosition', this.dropPosition, args);
                tObj.trigger(rowDrop, args);
                if (!args.cancel) {
                    this.dropRows(args);
                    tObj.refresh();
                    if (!isNullOrUndefined(tObj.getHeaderContent().querySelector('.e-firstrow-border'))) {
                        tObj.getHeaderContent().querySelector('.e-firstrow-border').remove();
                    }
                }
            }
        }
        else {
            if (args.target && closest(args.target, '#' + tObj.rowDropSettings.targetID) || parentsUntil(args.target, 'e-treegrid') &&
                parentsUntil(args.target, 'e-treegrid').id === tObj.rowDropSettings.targetID) {
                setValue('dropPosition', this.dropPosition, args);
                tObj.trigger(rowDrop, args);
                if (!args.cancel && tObj.rowDropSettings.targetID) {
                    this.dragDropGrid(args);
                }
            }
        }
        this.removetopOrBottomBorder();
        this.removeChildBorder();
        if (!isNullOrUndefined(this.parent.element.getElementsByClassName('e-firstrow-border')[0])) {
            this.parent.element.getElementsByClassName('e-firstrow-border')[0].remove();
        }
    }
    dragDropGrid(args) {
        let tObj = this.parent;
        let targetRow = closest(args.target, 'tr');
        let targetIndex = isNaN(this.getTargetIdx(targetRow)) ? 0 : this.getTargetIdx(targetRow);
        let dropElement = parentsUntil(args.target, 'e-treegrid');
        if (dropElement && dropElement.id === this.parent.rowDropSettings.targetID) {
            let srcControl = dropElement.ej2_instances[0];
            let records = tObj.getSelectedRecords();
            let indexes = [];
            for (let i = 0; i < records.length; i++) {
                indexes[i] = records[i].index;
            }
            tObj.notify(rowsRemove, { indexes: indexes, records: records });
            srcControl.notify(rowsAdd, { toIndex: targetIndex, records: records });
            tObj.refresh();
            srcControl.refresh();
            if (srcControl.grid.dataSource.length > 1) {
                srcControl.refresh();
                if (!isNullOrUndefined(srcControl.getHeaderContent().querySelector('.e-firstrow-border'))) {
                    srcControl.getHeaderContent().querySelector('.e-firstrow-border').remove();
                }
                if (!isNullOrUndefined(srcControl.getContent().querySelector('.e-lastrow-border'))) {
                    srcControl.getContent().querySelector('.e-lastrow-border').remove();
                }
            }
        }
    }
    getTargetIdx(targetRow) {
        return targetRow ? parseInt(targetRow.getAttribute('aria-rowindex'), 10) : 0;
    }
    getParentData(record) {
        let parentItem = record.parentItem;
        if (this.dropPosition === 'bottomSegment') {
            let selectedRecord = this.parent.getSelectedRecords()[0];
            this.droppedRecord = getParentData(this.parent, selectedRecord.parentItem.uniqueID);
        }
        if (this.dropPosition === 'middleSegment') {
            let level = this.parent.getSelectedRecords()[0].level;
            if (level === parentItem.level) {
                this.droppedRecord = getParentData(this.parent, parentItem.uniqueID);
            }
            else {
                this.getParentData(parentItem);
            }
        }
    }
    dropRows(args, isByMethod) {
        if (this.dropPosition !== 'Invalid') {
            let tObj = this.parent;
            let draggedRecord;
            let droppedRecord;
            if (isNullOrUndefined(args.dropIndex)) {
                let rowIndex = tObj.getSelectedRowIndexes()[0] - 1;
                let record = tObj.getCurrentViewRecords()[rowIndex];
                this.getParentData(record);
            }
            else {
                this.droppedRecord = tObj.getCurrentViewRecords()[args.dropIndex];
            }
            let dragRecords = [];
            droppedRecord = this.droppedRecord;
            if (!args.data[0]) {
                dragRecords.push(args.data);
            }
            else {
                dragRecords = args.data;
            }
            let count = 0;
            let multiplegrid = this.parent.rowDropSettings.targetID;
            this.isMultipleGrid = multiplegrid;
            let addToBottom = false;
            if (!multiplegrid) {
                this.ensuredropPosition(dragRecords, droppedRecord);
            }
            else {
                this.isaddtoBottom = addToBottom = multiplegrid && this.isDraggedWithChild;
            }
            let dragLength = dragRecords.length;
            for (let i = 0; i < dragLength; i++) {
                draggedRecord = dragRecords[i];
                this.draggedRecord = draggedRecord;
                let recordIndex = args.dropIndex;
                let isSelfReference = !isNullOrUndefined(tObj.parentIdMapping);
                if (this.dropPosition !== 'Invalid') {
                    if (!tObj.rowDropSettings.targetID || isByMethod) {
                        this.deleteDragRow();
                    }
                    let recordIndex1 = this.treeGridData.indexOf(droppedRecord);
                    this.dropAtTop(recordIndex1, isSelfReference, i);
                    if (this.dropPosition === 'bottomSegment') {
                        if (!droppedRecord.hasChildRecords) {
                            if (this.parent.parentIdMapping) {
                                this.parent.dataSource.splice(recordIndex1 + 1, 0, this.draggedRecord.taskData);
                            }
                            this.treeGridData.splice(recordIndex1 + 1, 0, this.draggedRecord);
                        }
                        else {
                            count = this.getChildCount(droppedRecord, 0);
                            if (this.parent.parentIdMapping) {
                                this.parent.dataSource.splice(recordIndex1 + count + 1, 0, this.draggedRecord.taskData);
                            }
                            this.treeGridData.splice(recordIndex1 + count + 1, 0, this.draggedRecord);
                        }
                        draggedRecord.parentItem = this.treeGridData[recordIndex1].parentItem;
                        draggedRecord.parentUniqueID = tObj.grid.dataSource[recordIndex1].parentUniqueID;
                        draggedRecord.level = this.treeGridData[recordIndex1].level;
                        if (draggedRecord.hasChildRecords) {
                            let level = 1;
                            this.updateChildRecordLevel(draggedRecord, level);
                            this.updateChildRecord(draggedRecord, recordIndex1 + count + 1);
                        }
                        if (droppedRecord.parentItem) {
                            let rec = this.getChildrecordsByParentID(droppedRecord.parentUniqueID);
                            let childRecords = rec[0].childRecords;
                            let droppedRecordIndex = childRecords.indexOf(droppedRecord) + 1;
                            childRecords.splice(droppedRecordIndex, 0, draggedRecord);
                        }
                    }
                    this.dropMiddle(recordIndex, recordIndex1, args, isByMethod, isSelfReference, i);
                }
                if (isNullOrUndefined(draggedRecord.parentItem)) {
                    let parentRecords = tObj.parentData;
                    let newParentIndex = parentRecords.indexOf(this.droppedRecord);
                    if (this.dropPosition === 'bottomSegment') {
                        parentRecords.splice(newParentIndex + 1, 0, draggedRecord);
                    }
                    else if (this.dropPosition === 'topSegment') {
                        parentRecords.splice(newParentIndex, 0, draggedRecord);
                    }
                }
                tObj.rowDragAndDropModule.refreshGridDataSource();
            }
        }
    }
    dropMiddle(recordIndex, recordIndex1, args, isSelfReference, isByMethod, i) {
        let tObj = this.parent;
        let childRecords = findChildrenRecords(this.droppedRecord);
        let childRecordsLength = (isNullOrUndefined(childRecords) ||
            childRecords.length === 0) ? recordIndex1 + 1 :
            childRecords.length + recordIndex1 + 1;
        if (this.dropPosition === 'middleSegment') {
            if (tObj.parentIdMapping) {
                this.parent.dataSource.splice(childRecordsLength, 0, this.draggedRecord.taskData);
                this.treeGridData.splice(childRecordsLength, 0, this.draggedRecord);
            }
            else {
                this.treeGridData.splice(childRecordsLength, 0, this.draggedRecord);
            }
            this.recordLevel();
            if (this.draggedRecord.hasChildRecords) {
                this.updateChildRecord(this.draggedRecord, childRecordsLength, this.droppedRecord.expanded);
            }
        }
    }
    dropAtTop(recordIndex1, isSelfReference, i) {
        let tObj = this.parent;
        if (this.dropPosition === 'topSegment') {
            if (tObj.parentIdMapping) {
                this.parent.dataSource.splice(recordIndex1, 0, this.draggedRecord.taskData);
                this.treeGridData.splice(recordIndex1, 0, this.draggedRecord);
            }
            this.draggedRecord.parentItem = this.treeGridData[recordIndex1].parentItem;
            this.draggedRecord.parentUniqueID = this.treeGridData[recordIndex1].parentUniqueID;
            this.draggedRecord.level = this.treeGridData[recordIndex1].level;
            this.treeGridData.splice(recordIndex1, 0, this.draggedRecord);
            if (this.draggedRecord.hasChildRecords) {
                let level = 1;
                this.updateChildRecord(this.draggedRecord, recordIndex1);
                this.updateChildRecordLevel(this.draggedRecord, level);
            }
            if (this.droppedRecord.parentItem) {
                let rec = this.getChildrecordsByParentID(this.droppedRecord.parentUniqueID);
                let childRecords = rec[0].childRecords;
                let droppedRecordIndex = childRecords.indexOf(this.droppedRecord);
                childRecords.splice(droppedRecordIndex, 0, this.draggedRecord);
            }
        }
    }
    recordLevel() {
        let tObj = this.parent;
        let draggedRecord = this.draggedRecord;
        let droppedRecord = this.droppedRecord;
        let childItem = tObj.childMapping;
        if (!droppedRecord.hasChildRecords) {
            droppedRecord.hasChildRecords = true;
            droppedRecord.hasFilteredChildRecords = true;
            if (isNullOrUndefined(droppedRecord.childRecords)) {
                droppedRecord.childRecords = [];
                if (!tObj.parentIdMapping && isNullOrUndefined(droppedRecord.taskData[childItem])) {
                    droppedRecord.taskData[childItem] = [];
                }
            }
        }
        if (this.dropPosition === 'middleSegment') {
            let parentItem = extend({}, droppedRecord);
            delete parentItem.childRecords;
            draggedRecord.parentItem = parentItem;
            draggedRecord.parentUniqueID = droppedRecord.uniqueID;
            droppedRecord.childRecords.splice(droppedRecord.childRecords.length, 0, draggedRecord);
            if (!isNullOrUndefined(draggedRecord) && !tObj.parentIdMapping && !isNullOrUndefined(droppedRecord.taskData[childItem])) {
                droppedRecord.taskData[tObj.childMapping].splice(droppedRecord.childRecords.length, 0, draggedRecord.taskData);
            }
            if (!draggedRecord.hasChildRecords) {
                draggedRecord.level = droppedRecord.level + 1;
            }
            else {
                let level = 1;
                draggedRecord.level = droppedRecord.level + 1;
                this.updateChildRecordLevel(draggedRecord, level);
            }
            droppedRecord.expanded = true;
            // if (tObj.isLocalData) {
            //     tObj.parentData.push(droppedRecord);
            // }
        }
    }
    deleteDragRow() {
        if (this.parent.dataSource instanceof DataManager) {
            this.treeGridData = this.parent.dataSource.dataSource.json;
        }
        else {
            this.treeGridData = this.parent.grid.dataSource;
        }
        let deletedRow;
        deletedRow = getParentData(this.parent, this.draggedRecord.uniqueID);
        this.removeRecords(deletedRow);
    }
    updateChildRecord(record, count, expanded$$1) {
        let currentRecord;
        let tObj = this.parent;
        let length = 0;
        if (!record.hasChildRecords) {
            return 0;
        }
        length = record.childRecords.length;
        for (let i = 0; i < length; i++) {
            currentRecord = record.childRecords[i];
            count++;
            tObj.flatData.splice(count, 0, currentRecord);
            if (tObj.parentIdMapping) {
                tObj.dataSource.splice(count, 0, currentRecord.taskData);
            }
            if (currentRecord.hasChildRecords) {
                count = this.updateChildRecord(currentRecord, count);
            }
        }
        return count;
    }
    updateChildRecordLevel(record, level) {
        let length = 0;
        let currentRecord;
        level++;
        if (!record.hasChildRecords) {
            return 0;
        }
        length = record.childRecords.length;
        for (let i = 0; i < length; i++) {
            currentRecord = record.childRecords[i];
            let parentData;
            if (record.parentItem) {
                parentData = getParentData(this.parent, record.parentItem.uniqueID);
            }
            currentRecord.level = record.parentItem ? parentData.level + level : record.level + 1;
            if (currentRecord.hasChildRecords) {
                level--;
                level = this.updateChildRecordLevel(currentRecord, level);
            }
        }
        return level;
    }
    removeRecords(record) {
        let tObj = this.parent;
        let dataSource = tObj.dataSource;
        let deletedRow = record;
        let isSelfReference = !isNullOrUndefined(tObj.parentIdMapping);
        let flatParentData = this.getChildrecordsByParentID(deletedRow.parentUniqueID)[0];
        if (deletedRow) {
            if (deletedRow.parentItem) {
                let childRecords = flatParentData ? flatParentData.childRecords : [];
                let childIndex = 0;
                if (childRecords && childRecords.length > 0) {
                    childIndex = childRecords.indexOf(deletedRow);
                    flatParentData.childRecords.splice(childIndex, 1);
                    if (!this.parent.parentIdMapping) {
                        editAction({ value: deletedRow, action: 'delete' }, this.parent, isSelfReference, deletedRow.index, deletedRow.index);
                    }
                }
            }
            if (tObj.parentIdMapping) {
                if (deletedRow.hasChildRecords && deletedRow.childRecords.length > 0) {
                    this.removeChildItem(deletedRow);
                }
                let idx;
                let treeGridData = dataSource;
                for (let i = 0; i < treeGridData.length; i++) {
                    if (treeGridData[i][this.parent.idMapping] === deletedRow.taskData[this.parent.idMapping]) {
                        idx = i;
                    }
                }
                if (idx !== -1) {
                    dataSource.splice(idx, 1);
                    this.treeGridData.splice(idx, 1);
                }
            }
            let recordIndex = this.treeGridData.indexOf(deletedRow);
            if (!tObj.parentIdMapping) {
                let parentIndex = this.parent.parentData.indexOf(deletedRow);
                if (parentIndex !== -1) {
                    tObj.parentData.splice(parentIndex, 1);
                    dataSource.splice(parentIndex, 1);
                }
            }
            if (recordIndex === -1 && !tObj.parentIdMapping) {
                let primaryKeyField = tObj.getPrimaryKeyFieldNames()[0];
                for (let j = 0; j < this.treeGridData.length; j++) {
                    if (this.treeGridData[j][primaryKeyField] === deletedRow[primaryKeyField]) {
                        recordIndex = j;
                    }
                }
            }
            if (!tObj.parentIdMapping) {
                let deletedRecordCount = this.getChildCount(deletedRow, 0);
                this.treeGridData.splice(recordIndex, deletedRecordCount + 1);
            }
            if (deletedRow.parentItem && flatParentData && flatParentData.childRecords && !flatParentData.childRecords.length) {
                flatParentData.expanded = false;
                flatParentData.hasChildRecords = false;
                flatParentData.hasFilteredChildRecords = false;
            }
        }
    }
    removeChildItem(record) {
        let tObj = this.parent;
        let currentRecord;
        let idx;
        for (let i = 0; i < record.childRecords.length; i++) {
            currentRecord = record.childRecords[i];
            let treeGridData = tObj.dataSource;
            for (let i = 0; i < treeGridData.length; i++) {
                if (treeGridData[i][this.parent.idMapping] === currentRecord.taskData[this.parent.idMapping]) {
                    idx = i;
                }
            }
            if (idx !== -1) {
                tObj.dataSource.splice(idx, 1);
                this.treeGridData.splice(idx, 1);
            }
            if (currentRecord.hasChildRecords) {
                this.removeChildItem(currentRecord);
            }
        }
    }
    getChildCount(record, count) {
        let currentRecord;
        if (!record.hasChildRecords) {
            return 0;
        }
        for (let i = 0; i < record.childRecords.length; i++) {
            currentRecord = record.childRecords[i];
            count++;
            if (currentRecord.hasChildRecords) {
                count = this.getChildCount(currentRecord, count);
            }
        }
        return count;
    }
    ensuredropPosition(draggedRecords, currentRecord) {
        let tObj = this.parent;
        let rowDragMoudule = this;
        draggedRecords.filter((e) => {
            if (e.hasChildRecords) {
                let valid = e.childRecords.indexOf(currentRecord);
                if (valid === -1) {
                    rowDragMoudule.ensuredropPosition(e.childRecords, currentRecord);
                }
                else {
                    rowDragMoudule.dropPosition = 'Invalid';
                    rowDragMoudule.addErrorElem();
                    rowDragMoudule.canDrop = false;
                    return;
                }
            }
        });
    }
    destroy() {
        this.removeEventListener();
    }
    /**
     * @hidden
     */
    removeEventListener() {
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.off(rowdraging, this.Rowdraging);
        this.parent.off(rowDropped, this.rowDropped);
        this.parent.off(rowsAdd, this.rowsAdded);
        this.parent.off(rowsRemove, this.rowsRemoved);
    }
    /**
     * hidden
     */
    /**
     * For internal use only - Get the module name.
     * @private
     */
    getModuleName() {
        return 'rowDragandDrop';
    }
}

/**
 * Defines Predefined toolbar items.
 * @hidden
 */
var ToolbarItem;
(function (ToolbarItem) {
    ToolbarItem[ToolbarItem["Add"] = 0] = "Add";
    ToolbarItem[ToolbarItem["Edit"] = 1] = "Edit";
    ToolbarItem[ToolbarItem["Update"] = 2] = "Update";
    ToolbarItem[ToolbarItem["Delete"] = 3] = "Delete";
    ToolbarItem[ToolbarItem["Cancel"] = 4] = "Cancel";
    ToolbarItem[ToolbarItem["Search"] = 5] = "Search";
    ToolbarItem[ToolbarItem["ExpandAll"] = 6] = "ExpandAll";
    ToolbarItem[ToolbarItem["CollapseAll"] = 7] = "CollapseAll";
    ToolbarItem[ToolbarItem["ExcelExport"] = 8] = "ExcelExport";
    ToolbarItem[ToolbarItem["PdfExport"] = 9] = "PdfExport";
    ToolbarItem[ToolbarItem["CsvExport"] = 10] = "CsvExport";
    ToolbarItem[ToolbarItem["Print"] = 11] = "Print";
    ToolbarItem[ToolbarItem["RowIndent"] = 12] = "RowIndent";
    ToolbarItem[ToolbarItem["RowOutdent"] = 13] = "RowOutdent";
})(ToolbarItem || (ToolbarItem = {}));
/**
 * Defines predefined contextmenu items.
 * @hidden
 */
var ContextMenuItems;
(function (ContextMenuItems) {
    ContextMenuItems[ContextMenuItems["AutoFit"] = 0] = "AutoFit";
    ContextMenuItems[ContextMenuItems["AutoFitAll"] = 1] = "AutoFitAll";
    ContextMenuItems[ContextMenuItems["SortAscending"] = 2] = "SortAscending";
    ContextMenuItems[ContextMenuItems["SortDescending"] = 3] = "SortDescending";
    ContextMenuItems[ContextMenuItems["Edit"] = 4] = "Edit";
    ContextMenuItems[ContextMenuItems["Delete"] = 5] = "Delete";
    ContextMenuItems[ContextMenuItems["Save"] = 6] = "Save";
    ContextMenuItems[ContextMenuItems["Cancel"] = 7] = "Cancel";
    ContextMenuItems[ContextMenuItems["PdfExport"] = 8] = "PdfExport";
    ContextMenuItems[ContextMenuItems["ExcelExport"] = 9] = "ExcelExport";
    ContextMenuItems[ContextMenuItems["CsvExport"] = 10] = "CsvExport";
    ContextMenuItems[ContextMenuItems["FirstPage"] = 11] = "FirstPage";
    ContextMenuItems[ContextMenuItems["PrevPage"] = 12] = "PrevPage";
    ContextMenuItems[ContextMenuItems["LastPage"] = 13] = "LastPage";
    ContextMenuItems[ContextMenuItems["NextPage"] = 14] = "NextPage";
    ContextMenuItems[ContextMenuItems["AddRow"] = 15] = "AddRow";
})(ContextMenuItems || (ContextMenuItems = {}));

var __decorate$5 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/**
 * Configures the paging behavior of the TreeGrid.
 */
class PageSettings extends ChildProperty {
}
__decorate$5([
    Property(12)
], PageSettings.prototype, "pageSize", void 0);
__decorate$5([
    Property(8)
], PageSettings.prototype, "pageCount", void 0);
__decorate$5([
    Property(1)
], PageSettings.prototype, "currentPage", void 0);
__decorate$5([
    Property()
], PageSettings.prototype, "totalRecordsCount", void 0);
__decorate$5([
    Property(false)
], PageSettings.prototype, "enableQueryString", void 0);
__decorate$5([
    Property(false)
], PageSettings.prototype, "pageSizes", void 0);
__decorate$5([
    Property(null)
], PageSettings.prototype, "template", void 0);
__decorate$5([
    Property('All')
], PageSettings.prototype, "pageSizeMode", void 0);

var __decorate$6 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/**
 * Configures the TreeGrid's aggregate column.
 */
class AggregateColumn extends ChildProperty {
    constructor() {
        super(...arguments);
        this.intl = new Internationalization();
        this.templateFn = {};
    }
    /**
     * @hidden
     */
    setFormatter(cultureName) {
        if (this.format && (this.format.skeleton || this.format.format)) {
            this.formatFn = this.getFormatFunction(this.format);
        }
    }
    /**
     * @hidden
     */
    getFormatFunction(format) {
        if (format.type) {
            return this.intl.getDateFormat(format);
        }
        else {
            return this.intl.getNumberFormat(format);
        }
    }
    /**
     * @hidden
     */
    getFormatter() {
        return this.formatFn;
    }
    /**
     * @hidden
     */
    setTemplate(helper = {}) {
        if (this.footerTemplate !== undefined) {
            this.templateFn[getEnumValue(CellType, CellType.Summary)] = { fn: compile(this.footerTemplate, helper),
                property: 'footerTemplate' };
        }
    }
    /**
     * @hidden
     */
    getTemplate(type) {
        return this.templateFn[getEnumValue(CellType, type)];
    }
    /**
     * @hidden
     */
    setPropertiesSilent(prop) {
        this.setProperties(prop, true);
    }
}
__decorate$6([
    Property()
], AggregateColumn.prototype, "type", void 0);
__decorate$6([
    Property()
], AggregateColumn.prototype, "footerTemplate", void 0);
__decorate$6([
    Property()
], AggregateColumn.prototype, "field", void 0);
__decorate$6([
    Property()
], AggregateColumn.prototype, "format", void 0);
__decorate$6([
    Property()
], AggregateColumn.prototype, "columnName", void 0);
__decorate$6([
    Property()
], AggregateColumn.prototype, "customAggregate", void 0);
class AggregateRow extends ChildProperty {
}
__decorate$6([
    Collection([], AggregateColumn)
], AggregateRow.prototype, "columns", void 0);
__decorate$6([
    Property(true)
], AggregateRow.prototype, "showChildSummary", void 0);

var __decorate$7 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/**
 * Configures the edit behavior of the TreeGrid.
 */
class EditSettings extends ChildProperty {
}
__decorate$7([
    Property(false)
], EditSettings.prototype, "allowAdding", void 0);
__decorate$7([
    Property(false)
], EditSettings.prototype, "allowEditing", void 0);
__decorate$7([
    Property(false)
], EditSettings.prototype, "allowDeleting", void 0);
__decorate$7([
    Property('Cell')
], EditSettings.prototype, "mode", void 0);
__decorate$7([
    Property('Top')
], EditSettings.prototype, "newRowPosition", void 0);
__decorate$7([
    Property(true)
], EditSettings.prototype, "allowEditOnDblClick", void 0);
__decorate$7([
    Property(true)
], EditSettings.prototype, "showConfirmDialog", void 0);
__decorate$7([
    Property(false)
], EditSettings.prototype, "showDeleteConfirmDialog", void 0);
__decorate$7([
    Property('')
], EditSettings.prototype, "template", void 0);

var __decorate$8 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/**
 * Represents the field name and direction of sort column.
 */
class SortDescriptor extends ChildProperty {
}
__decorate$8([
    Property()
], SortDescriptor.prototype, "field", void 0);
__decorate$8([
    Property()
], SortDescriptor.prototype, "direction", void 0);
/**
 * Configures the sorting behavior of TreeGrid.
 */
class SortSettings extends ChildProperty {
}
__decorate$8([
    Collection([], SortDescriptor)
], SortSettings.prototype, "columns", void 0);
__decorate$8([
    Property(true)
], SortSettings.prototype, "allowUnsort", void 0);

var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var TreeGrid_1;
/**
 * Represents the TreeGrid component.
 * ```html
 * <div id='treegrid'></div>
 * <script>
 *  var treegridObj = new TreeGrid({ allowPaging: true });
 *  treegridObj.appendTo('#treegrid');
 * </script>
 * ```
 */
let TreeGrid = TreeGrid_1 = class TreeGrid extends Component {
    constructor(options, element) {
        super(options, element);
        this.dataResults = {};
        this.uniqueIDCollection = {};
        this.uniqueIDFilterCollection = {};
        TreeGrid_1.Inject(Selection);
        this.grid = new Grid();
    }
    /**
     * Export TreeGrid data to Excel file(.xlsx).
     * @param  {ExcelExportProperties} excelExportProperties - Defines the export properties of the TreeGrid.
     * @param  {boolean} isMultipleExport - Define to enable multiple export.
     * @param  {workbook} workbook - Defines the Workbook if multiple export is enabled.
     * @param  {boolean} isBlob - If 'isBlob' set to true, then it will be returned as blob data.
     * @return {Promise<any>}
     */
    excelExport(excelExportProperties, isMultipleExport, 
    /* tslint:disable-next-line:no-any */
    workbook, isBlob) {
        return this.excelExportModule.Map(excelExportProperties, isMultipleExport, workbook, isBlob, false);
    }
    /**
     * Export TreeGrid data to CSV file.
     * @param  {ExcelExportProperties} excelExportProperties - Defines the export properties of the TreeGrid.
     * @param  {boolean} isMultipleExport - Define to enable multiple export.
     * @param  {workbook} workbook - Defines the Workbook if multiple export is enabled.
     * @param  {boolean} isBlob - If 'isBlob' set to true, then it will be returned as blob data.
     * @return {Promise<any>}
     *
     */
    csvExport(excelExportProperties, 
    /* tslint:disable-next-line:no-any */
    isMultipleExport, workbook, isBlob) {
        return this.excelExportModule.Map(excelExportProperties, isMultipleExport, workbook, isBlob, true);
    }
    /**
     * Export TreeGrid data to PDF document.
     * @param  {pdfExportProperties} PdfExportProperties - Defines the export properties of the Grid.
     * @param  {isMultipleExport} isMultipleExport - Define to enable multiple export.
     * @param  {pdfDoc} pdfDoc - Defined the Pdf Document if multiple export is enabled.
     * @param  {boolean} isBlob - If 'isBlob' set to true, then it will be returned as blob data.
     * @return {Promise<any>}
     *
     */
    pdfExport(pdfExportProperties, 
    /* tslint:disable-next-line:no-any */
    isMultipleExport, pdfDoc, isBlob) {
        return this.pdfExportModule.Map(pdfExportProperties, isMultipleExport, pdfDoc, isBlob);
    }
    /**
     * For internal use only - Get the module name.
     * @private
     */
    getModuleName() {
        return 'treegrid';
    }
    /**
     * For internal use only - Initialize the event handler;
     * @private
     */
    preRender() {
        this.TreeGridLocale();
        this.initProperties();
        this.defaultLocale = {
            Above: 'Above',
            Below: 'Below',
            AddRow: 'Add Row',
            ExpandAll: 'Expand All',
            CollapseAll: 'Collapse All',
            RowIndent: 'Indent',
            RowOutdent: 'Outdent'
        };
        if (this.isSelfReference && isNullOrUndefined(this.childMapping)) {
            this.childMapping = 'Children';
        }
    }
    /**
     * Sorts a column with the given options.
     * @param {string} columnName - Defines the column name to be sorted.
     * @param {SortDirection} direction - Defines the direction of sorting field.
     * @param {boolean} isMultiSort - Specifies whether the previous sorted columns are to be maintained.
     * @return {void}
     */
    sortByColumn(columnName, direction, isMultiSort) {
        this.sortModule.sortColumn(columnName, direction, isMultiSort);
    }
    /**
     * Clears all the sorted columns of the TreeGrid.
     * @return {void}
     */
    clearSorting() {
        if (this.sortModule) {
            this.sortModule.clearSorting();
        }
    }
    /**
     * Remove sorted column by field name.
     * @param {string} field - Defines the column field name to remove sort.
     * @return {void}
     * @hidden
     */
    removeSortColumn(field) {
        this.sortModule.removeSortColumn(field);
    }
    /**
     * Searches TreeGrid records using the given key.
     * You can customize the default search option by using the
     * [`searchSettings`](./api-searchSettings.html).
     * @param  {string} searchString - Defines the key.
     * @return {void}
     */
    search(searchString) {
        this.grid.search(searchString);
    }
    /**
     * Changes the column width to automatically fit its content to ensure that the width shows the content without wrapping/hiding.
     * > * This method ignores the hidden columns.
     * > * Uses the `autoFitColumns` method in the `dataBound` event to resize at initial rendering.
     * @param  {string |string[]} fieldNames - Defines the column names.
     * @return {void}
     *
     *
     *
     */
    autoFitColumns(fieldNames) {
        this.resizeModule.autoFitColumns(fieldNames);
        this.updateColumnModel();
    }
    /**
     * Changes the TreeGrid column positions by field names.
     * @param  {string} fromFName - Defines the origin field name.
     * @param  {string} toFName - Defines the destination field name.
     * @return {void}
     */
    reorderColumns(fromFName, toFName) {
        this.grid.reorderColumns(fromFName, toFName);
    }
    TreeGridLocale() {
        /* tslint:disable-next-line:no-any */
        let locale = L10n.locale;
        let localeObject;
        localeObject = {};
        setValue(this.locale, {}, localeObject);
        let gridLocale;
        gridLocale = {};
        gridLocale = getObject(this.locale, locale);
        let treeGridLocale;
        treeGridLocale = {};
        treeGridLocale = getObject(this.getModuleName(), gridLocale);
        setValue('grid', treeGridLocale, getObject(this.locale, localeObject));
        L10n.load(localeObject);
    }
    /**
     * By default, prints all the pages of the TreeGrid and hides the pager.
     * > You can customize print options using the
     * [`printMode`](./api-treegrid.html#printmode-string).
     * @return {void}
     */
    print() {
        this.printModule.print();
    }
    treeGridkeyActionHandler(e) {
        if (this.allowKeyboard) {
            switch (e.action) {
                case 'ctrlDownArrow':
                    this.expandAll();
                    break;
                case 'ctrlUpArrow':
                    this.collapseAll();
                    break;
                case 'ctrlShiftUpArrow':
                    let collapsetarget = e.target;
                    let collapsecolumn = collapsetarget.closest('.e-rowcell');
                    let collapserow = collapsecolumn.closest('tr');
                    this.expandCollapseRequest(collapserow.querySelector('.e-treegridexpand'));
                    break;
                case 'ctrlShiftDownArrow':
                    let expandtarget = e.target;
                    let expandcolumn = expandtarget.closest('.e-rowcell');
                    let expandrow = expandcolumn.closest('tr');
                    this.expandCollapseRequest(expandrow.querySelector('.e-treegridcollapse'));
                    break;
                case 'downArrow':
                    let target = e.target.parentElement;
                    let summaryElement = this.findnextRowElement(target);
                    if (summaryElement !== null) {
                        let rowIndex = summaryElement.rowIndex;
                        this.selectRow(rowIndex);
                        let cellIndex = e.target.cellIndex;
                        let row = summaryElement.children[cellIndex];
                        addClass([row], 'e-focused');
                        addClass([row], 'e-focus');
                    }
                    else {
                        this.clearSelection();
                    }
                    break;
                case 'upArrow':
                    let targetRow = e.target.parentElement;
                    let summaryRowElement = this.findPreviousRowElement(targetRow);
                    if (summaryRowElement !== null) {
                        let rIndex = summaryRowElement.rowIndex;
                        this.selectRow(rIndex);
                        let cIndex = e.target.cellIndex;
                        let rows = summaryRowElement.children[cIndex];
                        addClass([rows], 'e-focused');
                        addClass([rows], 'e-focus');
                    }
                    else {
                        this.clearSelection();
                    }
            }
        }
    }
    // Get Proper Row Element from the summary 
    findnextRowElement(summaryRowElement) {
        let rowElement = summaryRowElement.nextSibling;
        if (rowElement !== null && (rowElement.className.indexOf('e-summaryrow') !== -1 ||
            rowElement.style.display === 'none')) {
            rowElement = this.findnextRowElement(rowElement);
        }
        return rowElement;
    }
    // Get Proper Row Element from the summary 
    findPreviousRowElement(summaryRowElement) {
        let rowElement = summaryRowElement.previousSibling;
        if (rowElement !== null && (rowElement.className.indexOf('e-summaryrow') !== -1 ||
            rowElement.style.display === 'none')) {
            rowElement = this.findPreviousRowElement(rowElement);
        }
        return rowElement;
    }
    initProperties() {
        this.defaultLocale = {};
        this.flatData = [];
        this.parentData = [];
        this.columnModel = [];
        this.isExpandAll = false;
        this.keyConfigs = {
            ctrlDownArrow: 'ctrl+downarrow',
            ctrlUpArrow: 'ctrl+uparrow',
            ctrlShiftUpArrow: 'ctrl+shift+uparrow',
            ctrlShiftDownArrow: 'ctrl+shift+downarrow',
            downArrow: 'downArrow',
            upArrow: 'upArrow'
        };
        this.isLocalData = (!(this.dataSource instanceof DataManager) || this.dataSource.dataSource.offline
            || (!isNullOrUndefined(this.dataSource.ready)) || this.dataSource.adaptor instanceof RemoteSaveAdaptor);
        this.isSelfReference = !isNullOrUndefined(this.parentIdMapping);
    }
    /**
     * Binding events to the element while component creation.
     * @hidden
     */
    wireEvents() {
        EventHandler.add(this.element, 'click', this.mouseClickHandler, this);
        EventHandler.add(this.element, 'touchend', this.mouseClickHandler, this);
        this.keyboardModule = new KeyboardEvents(this.element, {
            keyAction: this.treeGridkeyActionHandler.bind(this),
            keyConfigs: this.keyConfigs,
            eventName: 'keydown'
        });
        if (this.allowKeyboard) {
            this.element.tabIndex = this.element.tabIndex === -1 ? 0 : this.element.tabIndex;
        }
    }
    /**
     * To provide the array of modules needed for component rendering
     * @return {ModuleDeclaration[]}
     * @hidden
     */
    requiredModules() {
        let modules = [];
        if (this.isDestroyed) {
            return modules;
        }
        modules.push({
            member: 'filter', args: [this, this.filterSettings]
        });
        if (!isNullOrUndefined(this.toolbar)) {
            modules.push({
                member: 'toolbar',
                args: [this]
            });
        }
        if (this.contextMenuItems) {
            modules.push({
                member: 'contextMenu',
                args: [this]
            });
        }
        if (this.allowPaging) {
            modules.push({
                member: 'pager',
                args: [this, this.pageSettings]
            });
        }
        if (this.allowReordering) {
            modules.push({
                member: 'reorder',
                args: [this]
            });
        }
        if (this.allowSorting) {
            modules.push({
                member: 'sort',
                args: [this]
            });
        }
        if (this.aggregates.length > 0) {
            modules.push({
                member: 'summary',
                args: [this]
            });
        }
        modules.push({
            member: 'resize', args: [this]
        });
        if (this.allowExcelExport) {
            modules.push({
                member: 'ExcelExport',
                args: [this]
            });
        }
        if (this.detailTemplate) {
            modules.push({
                member: 'detailRow',
                args: [this]
            });
        }
        if (this.allowPdfExport) {
            modules.push({
                member: 'PdfExport',
                args: [this]
            });
        }
        if (this.showColumnMenu) {
            modules.push({
                member: 'columnMenu',
                args: [this]
            });
        }
        if (this.allowRowDragAndDrop) {
            modules.push({
                member: 'RowDD',
                args: [this]
            });
        }
        if (this.editSettings.allowAdding || this.editSettings.allowDeleting || this.editSettings.allowEditing) {
            modules.push({
                member: 'edit',
                args: [this]
            });
        }
        if (this.isCommandColumn(this.columns)) {
            modules.push({
                member: 'commandColumn',
                args: [this]
            });
        }
        if (this.allowSelection) {
            modules.push({
                member: 'selection',
                args: [this]
            });
        }
        if (this.enableVirtualization) {
            modules.push({
                member: 'virtualScroll',
                args: [this]
            });
        }
        return modules;
    }
    isCommandColumn(columns) {
        return columns.some((col) => {
            if (col.columns) {
                return this.isCommandColumn(col.columns);
            }
            return !!(col.commands || col.commandsTemplate);
        });
    }
    /**
     * Unbinding events from the element while component destroy.
     * @hidden
     */
    unwireEvents() {
        EventHandler.remove(this.element, 'click', this.mouseClickHandler);
    }
    /**
     * For internal use only - To Initialize the component rendering.
     * @private
     */
    render() {
        createSpinner({ target: this.element }, this.createElement);
        this.renderModule = new Render(this);
        this.dataModule = new DataManipulation(this);
        this.printModule = new Print$1(this);
        this.columnMenuModule = new ColumnMenu$1(this);
        /**
         * @hidden
         */
        this.rowDragAndDropModule = new RowDD$1(this);
        this.trigger(load);
        this.autoGenerateColumns();
        this.initialRender = true;
        this.convertTreeData(this.dataSource);
        this.loadGrid();
        if (this.element.classList.contains('e-treegrid') && this.rowDropSettings.targetID) {
            this.grid.rowDropSettings.targetID += '_gridcontrol';
        }
        this.addListener();
        let gridContainer = createElement('div', { id: this.element.id + '_gridcontrol' });
        addClass([this.element], 'e-treegrid');
        if (!isNullOrUndefined(this.height) && typeof (this.height) === 'string' && this.height.indexOf('%') !== -1) {
            this.element.style.height = this.height;
        }
        if (!isNullOrUndefined(this.width) && typeof (this.width) === 'string' && this.width.indexOf('%') !== -1) {
            this.element.style.width = this.width;
        }
        this.element.appendChild(gridContainer);
        this.grid.appendTo(gridContainer);
        this.wireEvents();
        this.renderComplete();
    }
    convertTreeData(data) {
        if (data instanceof Array && data.length > 0 && data[0].hasOwnProperty('level')) {
            this.flatData = data;
            this.flatData.filter((e) => {
                setValue('uniqueIDCollection.' + e.uniqueID, e, this);
                if (e.level === 0) {
                    this.parentData.push(e);
                }
            });
        }
        else {
            this.dataModule.convertToFlatData(data);
        }
    }
    // private getGridData(): Object {
    //   if (isRemoteData(this)) {
    //     return this.dataSource;
    //   } else if (this.isLocalData && this.dataSource instanceof DataManager) {
    //     this.dataSource.dataSource.json = this.flatData;
    //     return this.dataSource;
    //   }
    //   return this.flatData;
    // }
    bindGridProperties() {
        this.bindedDataSource();
        this.grid.enableRtl = this.enableRtl;
        this.grid.allowKeyboard = this.allowKeyboard;
        this.grid.enablePersistence = this.enablePersistence;
        this.grid.columns = this.getGridColumns(this.columns);
        this.grid.allowExcelExport = this.allowExcelExport;
        this.grid.allowPdfExport = this.allowPdfExport;
        this.grid.query = this.query;
        this.grid.columnQueryMode = this.columnQueryMode;
        this.grid.allowPaging = this.allowPaging;
        this.grid.pageSettings = getActualProperties(this.pageSettings);
        this.grid.pagerTemplate = this.pagerTemplate;
        this.grid.showColumnMenu = this.showColumnMenu;
        this.grid.allowSorting = this.allowSorting;
        this.grid.allowFiltering = this.allowFiltering;
        this.grid.enableVirtualization = this.enableVirtualization;
        this.grid.width = this.width;
        this.grid.height = this.height;
        this.grid.enableAltRow = this.enableAltRow;
        this.grid.allowReordering = this.allowReordering;
        this.grid.allowTextWrap = this.allowTextWrap;
        this.grid.allowResizing = this.allowResizing;
        this.grid.enableHover = this.enableHover;
        this.grid.allowRowDragAndDrop = this.allowRowDragAndDrop;
        this.grid.rowDropSettings = getActualProperties(this.rowDropSettings);
        this.grid.rowHeight = this.rowHeight;
        this.grid.gridLines = this.gridLines;
        this.grid.allowSelection = this.allowSelection;
        this.grid.toolbar = getActualProperties(this.getGridToolbar());
        this.grid.toolbarTemplate = this.toolbarTemplate;
        this.grid.filterSettings = getActualProperties(this.filterSettings);
        this.grid.selectionSettings = getActualProperties(this.selectionSettings);
        this.grid.sortSettings = getActualProperties(this.sortSettings);
        this.grid.searchSettings = getActualProperties(this.searchSettings);
        this.grid.aggregates = getActualProperties(this.aggregates);
        this.grid.textWrapSettings = getActualProperties(this.textWrapSettings);
        this.grid.printMode = getActualProperties(this.printMode);
        this.grid.locale = getActualProperties(this.locale);
        this.grid.selectedRowIndex = this.selectedRowIndex;
        this.grid.contextMenuItems = getActualProperties(this.getContextMenu());
        this.grid.columnMenuItems = getActualProperties(this.columnMenuItems);
        this.grid.editSettings = this.getGridEditSettings();
        this.grid.rowTemplate = getActualProperties(this.rowTemplate);
        this.grid.detailTemplate = getActualProperties(this.detailTemplate);
        let templateInstance = 'templateDotnetInstance';
        this.grid[templateInstance] = this[templateInstance];
        let isJsComponent = 'isJsComponent';
        this.grid[isJsComponent] = true;
    }
    triggerEvents(args) {
        this.trigger(getObject('name', args), args);
    }
    bindGridEvents() {
        let treeGrid = this;
        this.grid.rowSelecting = this.triggerEvents.bind(this);
        this.grid.rowSelected = (args) => {
            this.selectedRowIndex = this.grid.selectedRowIndex;
            treeGrid.notify(rowSelected, args);
            this.trigger(rowSelected, args);
        };
        this.grid.rowDeselected = (args) => {
            this.selectedRowIndex = this.grid.selectedRowIndex;
            if (isBlazor()) {
                let data = 'data';
                let rowIndex = 'rowIndex';
                let row = 'row';
                args[data] = args[data][args[data].length - 1];
                args[rowIndex] = args[rowIndex][args[rowIndex].length - 1];
                args[row] = args[row][args[row].length - 1];
            }
            this.trigger(rowDeselected, args);
        };
        this.grid.resizeStop = (args) => {
            this.updateColumnModel();
            this.trigger(resizeStop, args);
        };
        this.grid.excelQueryCellInfo = (args) => {
            this.notify('excelCellInfo', args);
            args = this.dataResults;
        };
        this.grid.pdfQueryCellInfo = (args) => {
            this.notify('pdfCellInfo', args);
            args = this.dataResults;
        };
        this.grid.checkBoxChange = (args) => {
            this.trigger(checkboxChange, args);
        };
        this.grid.pdfExportComplete = this.triggerEvents.bind(this);
        this.grid.excelExportComplete = this.triggerEvents.bind(this);
        this.grid.excelHeaderQueryCellInfo = this.triggerEvents.bind(this);
        this.grid.pdfHeaderQueryCellInfo = this.triggerEvents.bind(this);
        this.grid.dataSourceChanged = this.triggerEvents.bind(this);
        this.grid.dataStateChange = this.triggerEvents.bind(this);
        this.grid.recordDoubleClick = this.triggerEvents.bind(this);
        this.grid.rowDeselecting = this.triggerEvents.bind(this);
        this.grid.cellDeselected = this.triggerEvents.bind(this);
        this.grid.cellDeselecting = this.triggerEvents.bind(this);
        this.grid.columnMenuOpen = this.triggerEvents.bind(this);
        this.grid.columnMenuClick = this.triggerEvents.bind(this);
        this.grid.cellSelected = this.triggerEvents.bind(this);
        this.grid.headerCellInfo = this.triggerEvents.bind(this);
        this.grid.resizeStart = this.triggerEvents.bind(this);
        this.grid.resizing = this.triggerEvents.bind(this);
        this.grid.columnDrag = this.triggerEvents.bind(this);
        this.grid.columnDragStart = this.triggerEvents.bind(this);
        this.grid.columnDrop = this.triggerEvents.bind(this);
        this.grid.beforePrint = this.triggerEvents.bind(this);
        this.grid.printComplete = this.triggerEvents.bind(this);
        this.grid.cellEdit = this.triggerEvents.bind(this);
        this.grid.actionFailure = this.triggerEvents.bind(this);
        this.grid.dataBound = (args) => {
            this.updateRowTemplate(args);
            this.updateColumnModel();
            this.updateAltRow(this.getRows());
            this.notify('dataBoundArg', args);
            this.trigger(dataBound, args);
            if (isRemoteData(this) && !isOffline(this) && !this.hasChildMapping) {
                let req = getObject('dataSource.requests', this).filter((e) => {
                    return e.httpRequest.statusText !== 'OK';
                }).length;
                setValue('grid.contentModule.isLoaded', !(req > 0), this);
            }
            this.initialRender = false;
        };
        this.grid.beforeDataBound = function (args) {
            let dataSource = 'dataSource';
            let requestType = getObject('action', args);
            if (isRemoteData(treeGrid) && !isOffline(treeGrid) && requestType !== 'edit') {
                treeGrid.notify('updateRemoteLevel', args);
                args = (treeGrid.dataResults);
            }
            else if (treeGrid.flatData.length === 0 && isOffline(treeGrid) && treeGrid.dataSource instanceof DataManager) {
                let dm = treeGrid.dataSource;
                treeGrid.dataModule.convertToFlatData(dm.dataSource.json);
                args.result = treeGrid.grid.dataSource[dataSource].json = treeGrid.flatData;
            }
            if (!isRemoteData(treeGrid)) {
                if (this.isPrinting) {
                    setValue('isPrinting', true, args);
                }
                treeGrid.notify('dataProcessor', args);
                //args = this.dataModule.dataProcessor(args);
            }
            extend(args, treeGrid.dataResults);
            // this.notify(events.beforeDataBound, args);
            if (!this.isPrinting) {
                let callBackPromise = new Deferred();
                treeGrid.trigger(beforeDataBound, args, (beforeDataBoundArgs) => {
                    callBackPromise.resolve(beforeDataBoundArgs);
                });
                return callBackPromise;
            }
        };
        this.extendedGridEvents();
        this.extendedGridEditEvents();
        this.bindCallBackEvents();
    }
    bindCallBackEvents() {
        this.grid.toolbarClick = (args) => {
            let callBackPromise = new Deferred();
            this.trigger(toolbarClick, args, (toolbarargs) => {
                if (!toolbarargs.cancel) {
                    this.notify(toolbarClick, args);
                }
                callBackPromise.resolve(toolbarargs);
            });
            return callBackPromise;
        };
        this.grid.cellSelecting = (args) => {
            let callBackPromise = new Deferred();
            this.trigger(getObject('name', args), args, (cellselectingArgs) => {
                callBackPromise.resolve(cellselectingArgs);
            });
            return callBackPromise;
        };
        this.grid.beginEdit = (args) => {
            let callBackPromise = new Deferred();
            this.trigger(beginEdit, args, (begineditArgs) => {
                callBackPromise.resolve(begineditArgs);
            });
            return callBackPromise;
        };
    }
    extendedGridEditEvents() {
        this.grid.cellSave = (args) => {
            if (this.grid.isContextMenuOpen()) {
                let contextitems;
                contextitems = this.grid.contextMenuModule.contextMenu.element.getElementsByClassName('e-selected')[0];
                if ((isNullOrUndefined(contextitems) || contextitems.id !== this.element.id + '_gridcontrol_cmenu_Save')) {
                    args.cancel = true;
                }
            }
            let callBackPromise = new Deferred();
            this.trigger(cellSave, args, (cellsaveArgs) => {
                if (isBlazor()) {
                    cellsaveArgs.cell = getElement(cellsaveArgs.cell);
                }
                if (!cellsaveArgs.cancel) {
                    this.notify(cellSave, cellsaveArgs);
                }
                callBackPromise.resolve(cellsaveArgs);
            });
            return callBackPromise;
        };
        // this.grid.cellSaved = (args: CellSaveArgs): void => {
        //   this.trigger(events.cellSaved, args);
        //   this.notify(events.cellSaved, args);
        // };
        this.grid.cellEdit = (args) => {
            let prom = 'promise';
            let promise = new Deferred();
            args[prom] = promise;
            this.notify(cellEdit, args);
            return promise;
        };
        // this.grid.batchAdd = (args: BatchAddArgs): void => {
        //   this.trigger(events.batchAdd, args);
        //   this.notify(events.batchAdd, args);
        // }
        // this.grid.beforeBatchSave = (args: BeforeBatchSaveArgs): void => {
        //   this.trigger(events.beforeBatchSave, args);
        //   this.notify(events.beforeBatchSave, args);
        // }
        // this.grid.beforeBatchAdd = (args: BeforeBatchAddArgs): void => {
        //   this.trigger(events.beforeBatchAdd, args);
        //   this.notify(events.beforeBatchAdd, args);
        // }
        // this.grid.batchDelete = (args: BatchDeleteArgs): void => {
        //   this.trigger(events.batchDelete, args);
        //   this.notify(events.batchDelete, args);
        // }
        this.grid.batchCancel = (args) => {
            if (this.editSettings.mode !== 'Cell') {
                this.trigger(batchCancel, args);
            }
            this.notify(batchCancel, args);
        };
    }
    updateRowTemplate(args) {
        if (isBlazor()) {
            setTimeout(() => {
                this.treeColumnRowTemplate(args);
            }, 1000);
        }
        else {
            this.treeColumnRowTemplate(args);
        }
    }
    bindedDataSource() {
        let dataSource = 'dataSource';
        let isDataAvailable = 'isDataAvailable';
        let adaptor = 'adaptor';
        let ready = 'ready';
        let adaptorName = 'adaptorName';
        let dotnetInstance = 'dotnetInstance';
        let key = 'key';
        this.grid.dataSource = !(this.dataSource instanceof DataManager) ?
            this.flatData : new DataManager(this.dataSource.dataSource, this.dataSource.defaultQuery, this.dataSource.adaptor);
        if (isBlazor() && this.dataSource instanceof DataManager) {
            this.grid.dataSource[adaptorName] = this.dataSource[adaptorName];
            this.grid.dataSource[dotnetInstance] = this.dataSource[dotnetInstance];
            this.grid.dataSource[key] = this.dataSource[key];
        }
        if (this.dataSource instanceof DataManager && (this.dataSource.dataSource.offline || this.dataSource.ready)) {
            this.grid.dataSource[dataSource].json = extendArray(this.dataSource[dataSource].json);
            this.grid.dataSource[ready] = this.dataSource.ready;
            let dm = this.grid.dataSource;
            if (!isNullOrUndefined(this.grid.dataSource[ready])) {
                this.grid.dataSource[ready].then((e) => {
                    dm[dataSource].offline = true;
                    dm[isDataAvailable] = true;
                    dm[dataSource].json = e.result;
                    dm[adaptor] = new JsonAdaptor();
                });
            }
        }
    }
    extendedGridEvents() {
        let treeGrid = this;
        this.grid.recordDoubleClick = (args) => {
            this.trigger(recordDoubleClick, args);
            this.notify(recordDoubleClick, args);
        };
        this.grid.detailDataBound = (args) => {
            this.notify('detaildataBound', args);
            this.trigger(detailDataBound, args);
        };
        this.grid.actionBegin = (args) => {
            let requestType = getObject('requestType', args);
            if (requestType === 'reorder') {
                this.notify('getColumnIndex', {});
            }
            if (!isRemoteData(this) && !isNullOrUndefined(this.filterModule)
                && (this.grid.filterSettings.columns.length === 0 || this.grid.searchSettings.key.length === 0)) {
                this.notify('clearFilters', { flatData: this.grid.dataSource });
                this.grid.dataSource = this.dataResults.result;
            }
            let callBackPromise = new Deferred();
            if (isBlazor() && args.requestType === 'delete') {
                let data = 'data';
                args[data] = args[data][0];
            }
            this.trigger(actionBegin, args, (actionArgs) => {
                if (!actionArgs.cancel) {
                    this.notify(beginEdit, actionArgs);
                }
                if (isBlazor() && actionArgs.requestType === 'delete') {
                    let data = 'data';
                    actionArgs[data] = this.getSelectedRecords();
                }
                if (isBlazor() && actionArgs.requestType === 'beginEdit') {
                    actionArgs.row = getElement(actionArgs.row);
                }
                callBackPromise.resolve(actionArgs);
            });
            return callBackPromise;
        };
        this.grid.actionComplete = (args) => {
            this.notify('actioncomplete', args);
            this.updateColumnModel();
            this.updateTreeGridModel();
            if (args.requestType === 'reorder') {
                this.notify('setColumnIndex', {});
            }
            if (args.requestType === 'add' && (this.editSettings.newRowPosition !== 'Top' && this.editSettings.newRowPosition !== 'Bottom')) {
                this.notify(beginAdd, args);
            }
            if (args.requestType === 'batchsave') {
                this.notify(batchSave, args);
            }
            this.notify('updateGridActions', args);
            this.trigger(actionComplete, args);
        };
        this.grid.rowDataBound = function (args) {
            if (isNullOrUndefined(this.isPrinting)) {
                setValue('isPrinting', false, args);
            }
            else {
                setValue('isPrinting', this.isPrinting, args);
            }
            treeGrid.renderModule.RowModifier(args);
        };
        this.grid.queryCellInfo = function (args) {
            if (isNullOrUndefined(this.isPrinting)) {
                setValue('isPrinting', false, args);
            }
            else {
                setValue('isPrinting', this.isPrinting, args);
            }
            treeGrid.renderModule.cellRender(args);
        };
        this.grid.contextMenuClick = (args) => {
            this.notify(contextMenuClick, args);
            this.trigger(contextMenuClick, args);
        };
        this.grid.contextMenuOpen = (args) => {
            this.notify(contextMenuOpen, args);
            this.trigger(contextMenuOpen, args);
        };
        this.grid.queryCellInfo = (args) => {
            this.renderModule.cellRender(args);
        };
        this.grid.rowDragStartHelper = (args) => {
            treeGrid.trigger(rowDragStartHelper, args);
        };
        this.grid.rowDragStart = (args) => {
            treeGrid.trigger(rowDragStart, args);
        };
        this.grid.rowDrag = (args) => {
            treeGrid.notify(rowdraging, args);
            treeGrid.trigger(rowDrag, args);
        };
        this.grid.rowDrop = (args) => {
            treeGrid.notify(rowDropped, args);
            args.cancel = true;
        };
    }
    /**
     * Renders TreeGrid component
     * @private
     */
    loadGrid() {
        this.bindGridProperties();
        this.bindGridEvents();
        setValue('registeredTemplate', this.registeredTemplate, this.grid);
        let ref = 'viewContainerRef';
        setValue('viewContainerRef', this[ref], this.grid);
    }
    /**
     * AutoGenerate TreeGrid columns from first record
     * @hidden
     */
    autoGenerateColumns() {
        if (!this.columns.length && (!this.dataModule.isRemote() && Object.keys(this.dataSource).length)) {
            let record;
            // if (this.dataSource instanceof DataManager) {
            //   record = (<DataManager>this.dataSource).dataSource.json[0];
            // } else {
            record = this.dataSource[0];
            // }
            let keys = Object.keys(record);
            for (let i = 0; i < keys.length; i++) {
                if ([this.childMapping, this.parentIdMapping].indexOf(keys[i]) === -1) {
                    this.columns.push(keys[i]);
                }
            }
        }
    }
    getGridEditSettings() {
        let edit = {};
        let guid = 'guid';
        edit.allowAdding = this.editSettings.allowAdding;
        edit.allowEditing = this.editSettings.allowEditing;
        edit.allowDeleting = this.editSettings.allowDeleting;
        edit.newRowPosition = this.editSettings.newRowPosition === 'Bottom' ? 'Bottom' : 'Top';
        edit.allowEditOnDblClick = this.editSettings.allowEditOnDblClick;
        edit.showConfirmDialog = this.editSettings.showConfirmDialog;
        edit.template = this.editSettings.template;
        edit.showDeleteConfirmDialog = this.editSettings.showDeleteConfirmDialog;
        edit[guid] = this.editSettings[guid];
        switch (this.editSettings.mode) {
            case 'Dialog':
                edit.mode = this.editSettings.mode;
                break;
            case 'Row':
                edit.mode = 'Normal';
                break;
            case 'Cell':
                edit.mode = 'Normal';
                edit.showConfirmDialog = false;
                break;
        }
        return edit;
    }
    /**
     * Defines grid toolbar from treegrid toolbar model
     * @hidden
     */
    getContextMenu() {
        if (this.contextMenuItems) {
            let items = [];
            for (let i = 0; i < this.contextMenuItems.length; i++) {
                switch (this.contextMenuItems[i]) {
                    case 'AddRow':
                    case ContextMenuItems.AddRow:
                        items.push({ text: 'AddRow', target: '.e-content', id: this.element.id + '_gridcontrol_cmenu_AddRow',
                            items: [{ text: 'Above', id: 'Above' }, { text: 'Below', id: 'Below' }] });
                        break;
                    default:
                        items.push(this.contextMenuItems[i]);
                }
            }
            return items;
        }
        else {
            return null;
        }
    }
    /**
     * Defines grid toolbar from treegrid toolbar model
     * @hidden
     */
    getGridToolbar() {
        if (this.toolbar) {
            this.l10n = new L10n('treegrid', this.defaultLocale, this.locale);
            let items = [];
            for (let i = 0; i < this.toolbar.length; i++) {
                switch (this.toolbar[i]) {
                    case 'Search':
                    case ToolbarItem.Search:
                        items.push('Search');
                        break;
                    case 'Print':
                    case ToolbarItem.Print:
                        items.push('Print');
                        break;
                    case 'ExpandAll':
                    case ToolbarItem.ExpandAll:
                        let tooltipText = this.l10n.getConstant('ExpandAll');
                        items.push({ text: tooltipText, tooltipText: tooltipText,
                            prefixIcon: 'e-expand', id: this.element.id + '_gridcontrol_expandall' });
                        break;
                    case 'CollapseAll':
                    case ToolbarItem.CollapseAll:
                        let tooltip = this.l10n.getConstant('CollapseAll');
                        items.push({ text: tooltip,
                            tooltipText: tooltip, prefixIcon: 'e-collapse', id: this.element.id + '_gridcontrol_collapseall'
                        });
                        break;
                    case 'Indent':
                    case ToolbarItem.RowIndent:
                        let tooltipindent = this.l10n.getConstant('RowIndent');
                        items.push({
                            text: tooltipindent, tooltipText: tooltipindent,
                            prefixIcon: 'e-indent', id: this.element.id + '_gridcontrol_indent'
                        });
                        break;
                    case 'Outdent':
                    case ToolbarItem.RowOutdent:
                        let tooltipoutdent = this.l10n.getConstant('RowOutdent');
                        items.push({
                            text: tooltipoutdent, tooltipText: tooltipoutdent,
                            prefixIcon: 'e-outdent', id: this.element.id + '_gridcontrol_outdent'
                        });
                        break;
                    default:
                        items.push(this.toolbar[i]);
                }
            }
            return items;
        }
        else {
            return null;
        }
    }
    /**
     * Convert TreeGrid ColumnModel to Grid Column
     * @hidden
     */
    getGridColumns(columns) {
        let column = columns;
        this.columnModel = [];
        let treeGridColumn;
        let gridColumn;
        let gridColumnCollection = [];
        for (let i = 0; i < column.length; i++) {
            gridColumn = {};
            treeGridColumn = {};
            if (typeof this.columns[i] === 'string') {
                gridColumn.field = treeGridColumn.field = this.columns[i];
            }
            else {
                for (let prop of Object.keys(column[i])) {
                    gridColumn[prop] = treeGridColumn[prop] = column[i][prop];
                }
            }
            if (column[i].columns) {
                this.getGridColumns(columns[i].columns);
            }
            else {
                this.columnModel.push(new Column(treeGridColumn));
            }
            gridColumnCollection.push(gridColumn);
        }
        return gridColumnCollection;
    }
    /**
     * Called internally if any of the property value changed.
     * @hidden
     */
    /* tslint:disable-next-line:max-line-length */
    // tslint:disable-next-line:max-func-body-length
    onPropertyChanged(newProp, oldProp) {
        let properties = Object.keys(newProp);
        let requireRefresh = false;
        for (let prop of properties) {
            switch (prop) {
                case 'columns':
                    this.grid.columns = this.getGridColumns(this.columns);
                    break;
                case 'treeColumnIndex':
                    this.grid.refreshColumns();
                    break;
                case 'allowPaging':
                    this.grid.allowPaging = this.allowPaging;
                    break;
                case 'pageSettings':
                    this.grid.pageSettings = getActualProperties(this.pageSettings);
                    requireRefresh = true;
                    break;
                case 'enableVirtualization':
                    this.grid.enableVirtualization = this.enableVirtualization;
                    break;
                case 'toolbar':
                    this.grid.toolbar = this.getGridToolbar();
                    break;
                case 'allowSelection':
                    this.grid.allowSelection = this.allowSelection;
                    break;
                case 'selectionSettings':
                    this.grid.selectionSettings = getActualProperties(this.selectionSettings);
                    break;
                case 'allowSorting':
                    this.grid.allowSorting = this.allowSorting;
                    break;
                case 'allowMultiSorting':
                    this.grid.allowMultiSorting = this.allowMultiSorting;
                    break;
                case 'sortSettings':
                    this.grid.sortSettings = getActualProperties(this.sortSettings);
                    break;
                case 'searchSettings':
                    this.grid.searchSettings = getActualProperties(this.searchSettings);
                    break;
                case 'allowFiltering':
                    this.grid.allowFiltering = this.allowFiltering;
                    break;
                case 'filterSettings':
                    this.grid.filterSettings = getActualProperties(this.filterSettings);
                    break;
                case 'showColumnMenu':
                    this.grid.showColumnMenu = this.showColumnMenu;
                    break;
                case 'allowRowDragAndDrop':
                    this.grid.allowRowDragAndDrop = this.allowRowDragAndDrop;
                    break;
                case 'aggregates':
                    this.grid.aggregates = getActualProperties(this.aggregates);
                    break;
                case 'dataSource':
                    this.isLocalData = (!(this.dataSource instanceof DataManager) || (!isNullOrUndefined(this.dataSource.ready))
                        || this.dataSource.adaptor instanceof RemoteSaveAdaptor);
                    this.convertTreeData(this.dataSource);
                    if (this.isLocalData) {
                        this.grid.dataSource = this.flatData;
                    }
                    else {
                        this.bindedDataSource();
                    }
                    break;
                case 'query':
                    this.grid.query = this.query;
                    break;
                case 'enableCollapseAll':
                    if (newProp[prop]) {
                        this.collapseAll();
                    }
                    else {
                        this.expandAll();
                    }
                    break;
                case 'expandStateMapping':
                    this.refresh();
                    break;
                case 'gridLines':
                    this.grid.gridLines = this.gridLines;
                    break;
                case 'rowTemplate':
                    this.grid.rowTemplate = getActualProperties(this.rowTemplate);
                    break;
                case 'rowHeight':
                    this.grid.rowHeight = this.rowHeight;
                    break;
                case 'height':
                    if (!isNullOrUndefined(this.height) && typeof (this.height) === 'string' && this.height.indexOf('%') !== -1) {
                        this.element.style.height = this.height;
                    }
                    this.grid.height = this.height;
                    break;
                case 'width':
                    if (!isNullOrUndefined(this.width) && typeof (this.width) === 'string' && this.width.indexOf('%') !== -1) {
                        this.element.style.width = this.width;
                    }
                    this.grid.width = this.width;
                    break;
                case 'locale':
                    this.grid.locale = this.locale;
                    break;
                case 'selectedRowIndex':
                    this.grid.selectedRowIndex = this.selectedRowIndex;
                    break;
                case 'enableAltRow':
                    this.grid.enableAltRow = this.enableAltRow;
                    break;
                case 'enableHover':
                    this.grid.enableHover = this.enableHover;
                    break;
                case 'allowExcelExport':
                    this.grid.allowExcelExport = this.allowExcelExport;
                    break;
                case 'allowPdfExport':
                    this.grid.allowPdfExport = this.allowPdfExport;
                    break;
                case 'enableRtl':
                    this.grid.enableRtl = this.enableRtl;
                    break;
                case 'allowReordering':
                    this.grid.allowReordering = this.allowReordering;
                    break;
                case 'allowResizing':
                    this.grid.allowResizing = this.allowResizing;
                    break;
                case 'textWrapSettings':
                    this.grid.textWrapSettings = getActualProperties(this.textWrapSettings);
                    break;
                case 'allowTextWrap':
                    this.grid.allowTextWrap = getActualProperties(this.allowTextWrap);
                    this.refresh();
                    break;
                case 'contextMenuItems':
                    this.grid.contextMenuItems = this.getContextMenu();
                    break;
                case 'detailTemplate':
                    this.grid.detailTemplate = getActualProperties(this.detailTemplate);
                    break;
                case 'columnMenuItems':
                    this.grid.columnMenuItems = getActualProperties(this.columnMenuItems);
                    break;
                case 'editSettings':
                    if (this.grid.isEdit && this.grid.editSettings.mode === 'Normal' && newProp[prop].mode &&
                        (newProp[prop].mode === 'Cell' || newProp[prop].mode === 'Row')) {
                        this.grid.closeEdit();
                    }
                    this.grid.editSettings = this.getGridEditSettings();
                    break;
            }
            if (requireRefresh) {
                this.refresh();
            }
        }
    }
    /**
     * Destroys the component (detaches/removes all event handlers, attributes, classes, and empties the component element).
     * @method destroy
     * @return {void}
     */
    destroy() {
        this.removeListener();
        this.unwireEvents();
        super.destroy();
        this.grid.destroy();
        this.dataModule.destroy();
        let modules = ['dataModule', 'sortModule', 'renderModule', 'filterModule', 'printModule',
            'excelExportModule', 'pdfExportModule', 'toolbarModule', 'summaryModule', 'reorderModule', 'resizeModule',
            'pagerModule', 'keyboardModule', 'columnMenuModule', 'contextMenuModule', 'editModule', 'virtualScrollModule',
            'selectionModule', 'detailRow', 'rowDragAndDropModule'];
        for (let i = 0; i < modules.length; i++) {
            if (this[modules[i]]) {
                this[modules[i]] = null;
            }
        }
        this.element.innerHTML = '';
        this.grid = null;
    }
    /**
     * Update the TreeGrid model
     * @method dataBind
     * @return {void}
     * @private
     */
    dataBind() {
        super.dataBind();
        this.grid.dataBind();
    }
    /**
     * Get the properties to be maintained in the persisted state.
     * @return {string}
     * @hidden
     */
    getPersistData() {
        let keyEntity = ['pageSettings', 'sortSettings',
            'filterSettings', 'columns', 'searchSettings', 'selectedRowIndex'];
        let ignoreOnPersist = {
            pageSettings: ['template', 'pageSizes', 'pageSizeMode', 'enableQueryString', 'totalRecordsCount', 'pageCount'],
            filterSettings: ['type', 'mode', 'showFilterBarStatus', 'immediateModeDelay', 'ignoreAccent', 'hierarchyMode'],
            searchSettings: ['fields', 'operator', 'ignoreCase'],
            sortSettings: [], columns: [], selectedRowIndex: []
        };
        let ignoreOnColumn = ['filter', 'edit', 'filterBarTemplate', 'headerTemplate', 'template',
            'commandTemplate', 'commands', 'dataSource'];
        keyEntity.forEach((value) => {
            let currentObject = this[value];
            for (let val of ignoreOnPersist[value]) {
                delete currentObject[val];
            }
        });
        this.ignoreInArrays(ignoreOnColumn, this.columns);
        return this.addOnPersist(keyEntity);
    }
    ignoreInArrays(ignoreOnColumn, columns) {
        columns.forEach((column) => {
            if (column.columns) {
                this.ignoreInColumn(ignoreOnColumn, column);
                this.ignoreInArrays(ignoreOnColumn, column.columns);
            }
            else {
                this.ignoreInColumn(ignoreOnColumn, column);
            }
        });
    }
    ignoreInColumn(ignoreOnColumn, column) {
        ignoreOnColumn.forEach((val) => {
            delete column[val];
            column.filter = {};
        });
    }
    mouseClickHandler(e) {
        if (!isNullOrUndefined(e.touches)) {
            return;
        }
        let target = e.target;
        if (target.classList.contains('e-treegridexpand') ||
            target.classList.contains('e-treegridcollapse')) {
            this.expandCollapseRequest(target);
        }
        this.notify('checkboxSelection', { target: target });
    }
    /**
     * Returns TreeGrid rows
     * @return {HTMLTableRowElement[]}
     */
    getRows() {
        return this.grid.getRows();
    }
    /**
     * Gets the pager of the TreeGrid.
     * @return {Element}
     */
    getPager() {
        return this.grid.getPager(); //get element from pager
    }
    /**
     * Adds a new record to the TreeGrid. Without passing parameters, it adds empty rows.
     * > `editSettings.allowEditing` should be true.
     * @param {Object} data - Defines the new add record data.
     * @param {number} index - Defines the row index to be added.
     * @param {RowPosition} position - Defines the new row position to be added.
     */
    addRecord(data, index, position) {
        this.editModule.addRecord(data, index, position);
    }
    /**
     * Cancels edited state.
     */
    closeEdit() {
        this.grid.editModule.closeEdit();
    }
    /**
     * Delete a record with Given options. If fieldName and data is not given then TreeGrid will delete the selected record.
     * > `editSettings.allowDeleting` should be true.
     * @param {string} fieldName - Defines the primary key field, 'Name of the column'.
     * @param {Object} data - Defines the JSON data of the record to be deleted.
     */
    deleteRecord(fieldName, data) {
        this.grid.editModule.deleteRecord(fieldName, data);
    }
    /**
     * To edit any particular row by TR element.
     * @param {HTMLTableRowElement} tr - Defines the table row to be edited.
     */
    startEdit() {
        this.grid.editModule.startEdit();
    }
    /**
     * To edit any particular cell using row index and cell index.
     * @param {number} rowIndex - Defines row index to edit a particular cell.
     * @param {string} field - Defines the field name of the column to perform cell edit.
     */
    editCell(rowIndex, field) {
        this.editModule.editCell(rowIndex, field);
    }
    /**
     * If TreeGrid is in editable state, you can save a record by invoking endEdit.
     */
    endEdit() {
        this.grid.editModule.endEdit();
    }
    /**
     * Delete any visible row by TR element.
     * @param {HTMLTableRowElement} tr - Defines the table row element.
     */
    deleteRow(tr) {
        this.grid.editModule.deleteRow(tr);
    }
    /**
     * Get the names of the primary key columns of the TreeGrid.
     * @return {string[]}
     */
    getPrimaryKeyFieldNames() {
        return this.grid.getPrimaryKeyFieldNames();
    }
    /**
     * Updates particular cell value based on the given primary key value.
     * > Primary key column must be specified using `columns.isPrimaryKey` property.
     * @param {string| number} key - Specifies the PrimaryKey value of dataSource.
     * @param {string } field - Specifies the field name which you want to update.
     * @param {string | number | boolean | Date} value - To update new value for the particular cell.
     */
    setCellValue(key, field, value) {
        this.grid.setCellValue(key, field, value);
    }
    /**
     * Updates and refresh the particular row values based on the given primary key value.
     * > Primary key column must be specified using `columns.isPrimaryKey` property.
     *  @param {string| number} key - Specifies the PrimaryKey value of dataSource.
     *  @param {Object} rowData - To update new data for the particular row.
     */
    setRowData(key, rowData) {
        this.grid.setRowData(key, rowData);
    }
    /**
     * Navigates to the specified target page.
     * @param  {number} pageNo - Defines the page number to navigate.
     * @return {void}
     */
    goToPage(pageNo) {
        this.grid.pagerModule.goToPage(pageNo);
    }
    /**
     * Defines the text of external message.
     * @param  {string} message - Defines the message to update.
     * @return {void}
     */
    updateExternalMessage(message) {
        if (this.pagerModule) {
            this.grid.pagerModule.updateExternalMessage(message);
        }
    }
    /**
     * Gets a cell by row and column index.
     * @param  {number} rowIndex - Specifies the row index.
     * @param  {number} columnIndex - Specifies the column index.
     * @return {Element}
     */
    getCellFromIndex(rowIndex, columnIndex) {
        return this.grid.getCellFromIndex(rowIndex, columnIndex);
    }
    /**
     * Gets a Column by column name.
     * @param  {string} field - Specifies the column name.
     * @return {Column}
     */
    getColumnByField(field) {
        return iterateArrayOrObject(this.columnModel, (item, index) => {
            if (item.field === field) {
                return item;
            }
            return undefined;
        })[0];
    }
    /**
     * Gets a column by UID.
     * @param  {string} uid - Specifies the column UID.
     * @return {Column}
     */
    getColumnByUid(uid) {
        return iterateArrayOrObject(this.columnModel, (item, index) => {
            if (item.uid === uid) {
                return item;
            }
            return undefined;
        })[0];
    }
    /**
     * Gets the collection of column fields.
     * @return {string[]}
     */
    getColumnFieldNames() {
        return this.grid.getColumnFieldNames();
    }
    /**
     * Gets the footer div of the TreeGrid.
     * @return {Element}
     */
    getFooterContent() {
        return this.grid.getFooterContent();
    }
    /**
     * Gets the footer table element of the TreeGrid.
     * @return {Element}
     */
    getFooterContentTable() {
        return this.grid.getFooterContentTable();
    }
    /**
     * Shows a column by its column name.
     * @param  {string|string[]} keys - Defines a single or collection of column names.
     * @param  {string} showBy - Defines the column key either as field name or header text.
     * @return {void}
     */
    showColumns(keys, showBy) {
        return this.grid.showColumns(keys, showBy);
    }
    /**
     * Hides a column by column name.
     * @param  {string|string[]} keys - Defines a single or collection of column names.
     * @param  {string} hideBy - Defines the column key either as field name or header text.
     * @return {void}
     */
    hideColumns(keys, hideBy) {
        return this.grid.hideColumns(keys, hideBy);
    }
    /**
     * Gets a column header by column name.
     * @param  {string} field - Specifies the column name.
     * @return {Element}
     */
    getColumnHeaderByField(field) {
        return this.grid.getColumnHeaderByField(field);
    }
    /**
     * Gets a column header by column index.
     * @param  {number} index - Specifies the column index.
     * @return {Element}
     */
    getColumnHeaderByIndex(index) {
        return this.grid.getColumnHeaderByIndex(index);
    }
    /**
     * Gets a column header by UID.
     * @param  {string} field - Specifies the column uid.
     * @return {Element}
     */
    getColumnHeaderByUid(uid) {
        return this.grid.getColumnHeaderByUid(uid);
    }
    /**
     * Gets a column index by column name.
     * @param  {string} field - Specifies the column name.
     * @return {number}
     */
    getColumnIndexByField(field) {
        return this.grid.getColumnIndexByField(field);
    }
    /**
     * Gets a column index by UID.
     * @param  {string} uid - Specifies the column UID.
     * @return {number}
     */
    getColumnIndexByUid(uid) {
        return this.grid.getColumnIndexByUid(uid);
    }
    /**
     * Gets the columns from the TreeGrid.
     * @return {Column[]}
     */
    getColumns(isRefresh) {
        this.updateColumnModel(this.grid.getColumns(isRefresh));
        return this.columnModel;
    }
    updateColumnModel(column) {
        let gridColumns = isNullOrUndefined(column) ? this.grid.getColumns() : column;
        let gridColumn;
        this.columnModel = [];
        for (let i = 0; i < gridColumns.length; i++) {
            gridColumn = {};
            for (let prop of Object.keys(gridColumns[i])) {
                gridColumn[prop] = gridColumns[i][prop];
            }
            this.columnModel.push(new Column(gridColumn));
        }
        let merge$$1 = 'deepMerge';
        this[merge$$1] = ['columns']; // Workaround for blazor updateModel 
        this.setProperties({ columns: this.columnModel }, true);
        this[merge$$1] = undefined; // Workaround for blazor updateModel
        return this.columnModel;
    }
    /**
     * Gets the content div of the TreeGrid.
     * @return {Element}
     */
    getContent() {
        return this.grid.getContent();
    }
    updateTreeGridModel() {
        this.setProperties({ filterSettings: getObject('properties', this.grid.filterSettings) }, true);
        this.setProperties({ pageSettings: getObject('properties', this.grid.pageSettings) }, true);
        this.setProperties({ searchSettings: getObject('properties', this.grid.searchSettings) }, true);
        this.setProperties({ sortSettings: getObject('properties', this.grid.sortSettings) }, true);
    }
    /**
     * Gets the content table of the TreeGrid.
     * @return {Element}
     */
    getContentTable() {
        return this.grid.getContentTable();
    }
    /**
     * Gets all the TreeGrid's data rows.
     * @return {Element[]}
     */
    getDataRows() {
        let dRows = [];
        let rows = this.grid.getDataRows();
        for (let i = 0, len = rows.length; i < len; i++) {
            if (!rows[i].classList.contains('e-summaryrow')) {
                dRows.push(rows[i]);
            }
        }
        return dRows;
    }
    /**
     * Get current visible data of TreeGrid.
     * @return {Object[]}
     * @isGenericType true
     */
    getCurrentViewRecords() {
        return this.grid.currentViewData;
    }
    /**
     * Gets the header div of the TreeGrid.
     * @return {Element}
     */
    getHeaderContent() {
        return this.grid.getHeaderContent();
    }
    /**
     * Gets the header table element of the TreeGrid.
     * @return {Element}
     */
    getHeaderTable() {
        return this.grid.getHeaderTable();
    }
    /**
     * Gets a row by index.
     * @param  {number} index - Specifies the row index.
     * @return {Element}
     */
    getRowByIndex(index) {
        return this.grid.getRowByIndex(index);
    }
    /**
     * Get a row information based on cell
     * @param {Element}
     * @return RowInfo
     */
    getRowInfo(target) {
        return this.grid.getRowInfo(target);
    }
    /**
     * Gets UID by column name.
     * @param  {string} field - Specifies the column name.
     * @return {string}
     */
    getUidByColumnField(field) {
        return this.grid.getUidByColumnField(field);
    }
    /**
     * Gets the visible columns from the TreeGrid.
     * @return {Column[]}
     */
    getVisibleColumns() {
        let cols = [];
        for (let col of this.columnModel) {
            if (col.visible) {
                cols.push(col);
            }
        }
        return cols;
    }
    /**
     * By default, TreeGrid shows the spinner for all its actions. You can use this method to show spinner at your needed time.
     */
    showSpinner() {
        showSpinner(this.element);
    }
    /**
     * Manually shown spinner needs to hide by `hideSpinnner`.
     */
    hideSpinner() {
        hideSpinner(this.element);
    }
    /**
     * Refreshes the TreeGrid header and content.
     */
    refresh() {
        this.grid.refresh();
    }
    /**
     * Get the records of checked rows.
     * @return {Object[]}
     * @isGenericType true
     */
    getCheckedRecords() {
        return this.selectionModule.getCheckedrecords();
    }
    /**
     * Get the indexes of checked rows.
     * @return {number[]}
     */
    getCheckedRowIndexes() {
        return this.selectionModule.getCheckedRowIndexes();
    }
    /**
     * Checked the checkboxes using rowIndexes.
     */
    selectCheckboxes(indexes) {
        this.selectionModule.selectCheckboxes(indexes);
    }
    /**
     * Refreshes the TreeGrid column changes.
     */
    refreshColumns() {
        this.grid.columns = this.getGridColumns(this.columns);
        this.grid.refreshColumns();
    }
    /**
     * Refreshes the TreeGrid header.
     */
    refreshHeader() {
        this.grid.refreshHeader();
    }
    /**
     * Expands or collapse child records
     * @return {string}
     * @hidden
     */
    expandCollapseRequest(target) {
        if (this.rowTemplate) {
            let rowInfo = target.closest('.e-treerowcell').parentElement;
            let record = this.getCurrentViewRecords()[rowInfo.rowIndex];
            if (target.classList.contains('e-treegridexpand')) {
                this.collapseRow(rowInfo, record);
            }
            else {
                this.expandRow(rowInfo, record);
            }
        }
        else {
            let rowInfo = this.grid.getRowInfo(target);
            let record = rowInfo.rowData;
            if (target.classList.contains('e-treegridexpand')) {
                this.collapseRow(rowInfo.row, record);
            }
            else {
                this.expandRow(rowInfo.row, record);
            }
        }
    }
    /**
     * Expands child rows
     * @return {void}
     */
    expandRow(row, record) {
        record = this.getCollapseExpandRecords(row, record);
        let args = { data: record, row: row, cancel: false };
        this.trigger(expanding, args, (expandingArgs) => {
            if (!expandingArgs.cancel) {
                this.expandCollapse('expand', row, record);
                if (!(isRemoteData(this) && !isOffline(this))) {
                    let collapseArgs = { data: record, row: row };
                    this.trigger(expanded, collapseArgs);
                }
            }
        });
    }
    getCollapseExpandRecords(row, record) {
        if (this.allowPaging && this.pageSettings.pageSizeMode === 'All' && this.isExpandAll && isNullOrUndefined(record) &&
            !isRemoteData(this)) {
            record = this.flatData.filter((e) => {
                return e.hasChildRecords;
            });
        }
        else if (isNullOrUndefined(record)) {
            record = this.grid.getCurrentViewRecords()[row.rowIndex];
        }
        return record;
    }
    /**
     * Collapses child rows
     * @return {void}
     */
    collapseRow(row, record) {
        record = this.getCollapseExpandRecords(row, record);
        let args = { data: record, row: row, cancel: false };
        this.trigger(collapsing, args, (collapsingArgs) => {
            if (!collapsingArgs.cancel) {
                this.expandCollapse('collapse', row, record);
                let collapseArgs = { data: record, row: row };
                this.trigger(collapsed, collapseArgs);
            }
        });
    }
    /**
     * Expands the records at specific hierarchical level
     * @return {void}
     */
    expandAtLevel(level) {
        if (((this.allowPaging && this.pageSettings.pageSizeMode === 'All') || this.enableVirtualization) && !isRemoteData(this)) {
            let rec = this.grid.dataSource.filter((e) => {
                if (e.hasChildRecords && e.level === level) {
                    e.expanded = true;
                }
                return e.hasChildRecords && e.level === level;
            });
            this.expandRow(null, rec);
        }
        else {
            let rec = this.getRecordDetails(level);
            let row = getObject('rows', rec);
            let record = getObject('records', rec);
            for (let i = 0; i < record.length; i++) {
                this.expandRow(row[i], record[i]);
            }
        }
    }
    getRecordDetails(level) {
        let rows = this.getRows().filter((e) => {
            return (e.className.indexOf('level' + level) !== -1
                && (e.querySelector('.e-treegridcollapse') || e.querySelector('.e-treegridexpand')));
        });
        let records = this.getCurrentViewRecords().filter((e) => { return e.level === level && e.hasChildRecords; });
        let obj = { records: records, rows: rows };
        return obj;
    }
    /**
     * Collapses the records at specific hierarchical level
     * @return {void}
     */
    collapseAtLevel(level) {
        if (((this.allowPaging && this.pageSettings.pageSizeMode === 'All') || this.enableVirtualization) && !isRemoteData(this)) {
            let record = this.grid.dataSource.filter((e) => {
                if (e.hasChildRecords && e.level === level) {
                    e.expanded = false;
                }
                return e.hasChildRecords && e.level === level;
            });
            this.collapseRow(null, record);
        }
        else {
            let rec = this.getRecordDetails(level);
            let rows = getObject('rows', rec);
            let records = getObject('records', rec);
            for (let i = 0; i < records.length; i++) {
                this.collapseRow(rows[i], records[i]);
            }
        }
    }
    /**
     * Expands All the rows
     * @return {void}
     */
    expandAll() {
        this.expandCollapseAll('expand');
    }
    /**
     * Collapses All the rows
     * @return {void}
     */
    collapseAll() {
        this.expandCollapseAll('collapse');
    }
    expandCollapseAll(action) {
        let rows = this.getRows().filter((e) => {
            return e.querySelector('.e-treegrid' + (action === 'expand' ? 'collapse' : 'expand'));
        });
        this.isExpandAll = true;
        if (((this.allowPaging && this.pageSettings.pageSizeMode === 'All') || this.enableVirtualization) && !isRemoteData(this)) {
            this.flatData.filter((e) => {
                if (e.hasChildRecords) {
                    e.expanded = action === 'collapse' ? false : true;
                }
            });
            if (rows.length) {
                action === 'collapse' ? this.collapseRow(rows[0]) : this.expandRow(rows[0]);
            }
        }
        else {
            for (let i = 0; i < rows.length; i++) {
                action === 'collapse' ? this.collapseRow(rows[i]) : this.expandRow(rows[i]);
            }
        }
        this.isExpandAll = false;
    }
    expandCollapse(action, row, record, isChild) {
        let gridRows = this.getRows();
        if (this.rowTemplate) {
            let rows = this.getContentTable().rows;
            gridRows = [].slice.call(rows);
        }
        let rowIndex;
        if (isNullOrUndefined(row)) {
            rowIndex = this.getCurrentViewRecords().indexOf(record);
            row = gridRows[rowIndex];
        }
        else {
            rowIndex = +row.getAttribute('aria-rowindex');
        }
        if (!isNullOrUndefined(row)) {
            row.setAttribute('aria-expanded', action === 'expand' ? 'true' : 'false');
        }
        if (((this.allowPaging && this.pageSettings.pageSizeMode === 'All') || this.enableVirtualization) && !isRemoteData(this)) {
            this.notify(localPagedExpandCollapse, { action: action, row: row, record: record });
        }
        else {
            let displayAction;
            if (action === 'expand') {
                displayAction = 'table-row';
                if (!isChild) {
                    record.expanded = true;
                }
                let targetEle = row.getElementsByClassName('e-treegridcollapse')[0];
                if (isNullOrUndefined(targetEle)) {
                    return;
                }
                addClass([targetEle], 'e-treegridexpand');
                removeClass([targetEle], 'e-treegridcollapse');
            }
            else {
                displayAction = 'none';
                if (!isChild) {
                    record.expanded = false;
                }
                let targetEle = row.getElementsByClassName('e-treegridexpand')[0];
                if (isNullOrUndefined(targetEle)) {
                    return;
                }
                addClass([targetEle], 'e-treegridcollapse');
                removeClass([targetEle], 'e-treegridexpand');
            }
            let args = { data: record, row: row };
            if (isRemoteData(this) && !isOffline(this)) {
                let rows = gridRows.filter((r) => r.classList.contains('e-gridrowindex' + record.index + 'level' + (record.level + 1)));
                let detailrows = gridRows.filter((r) => r.classList.contains('e-griddetailrowindex' + record.index + 'level' + (record.level + 1)));
                if (action === 'expand') {
                    this.notify(remoteExpand, { record: record, rows: rows, parentRow: row });
                    let args = { row: row, data: record };
                    if (rows.length > 0) {
                        this.trigger(expanded, args);
                    }
                }
                else {
                    this.collapseRemoteChild(rows);
                    this.trigger(collapsed, args);
                }
            }
            else {
                let childRecords = this.getCurrentViewRecords().filter((e) => {
                    return e.parentUniqueID === record.uniqueID;
                });
                let index = childRecords[0].parentItem.index;
                let rows = gridRows.filter((r) => r.classList.contains('e-gridrowindex' + record.index + 'level' + (record.level + 1)));
                let detailrows = gridRows.filter((detailRowes) => detailRowes.classList.contains('e-griddetailrowindex' + record.index + 'level' + (record.level + 1)));
                for (let i = 0; i < rows.length; i++) {
                    rows[i].style.display = displayAction;
                    this.notify('childRowExpand', { row: rows[i] });
                    if (!isNullOrUndefined(childRecords[i].childRecords) && (action !== 'expand' ||
                        isNullOrUndefined(childRecords[i].expanded) || childRecords[i].expanded)) {
                        this.expandCollapse(action, rows[i], childRecords[i], true);
                    }
                }
                this.notify('rowExpandCollapse', { detailrows: detailrows, action: displayAction });
            }
            this.updateAltRow(gridRows);
        }
    }
    updateAltRow(rows) {
        if (this.enableAltRow && !this.rowTemplate) {
            let visibleRowCount = 0;
            for (let i = 0; rows && i < rows.length; i++) {
                let gridRow = rows[i];
                if (gridRow.style.display !== 'none') {
                    if (gridRow.classList.contains('e-altrow')) {
                        removeClass([gridRow], 'e-altrow');
                    }
                    if (visibleRowCount % 2 !== 0 && !gridRow.classList.contains('e-summaryrow') && !gridRow.classList.contains('e-detailrow')) {
                        addClass([gridRow], 'e-altrow');
                    }
                    if (!gridRow.classList.contains('e-summaryrow') && !gridRow.classList.contains('e-detailrow')) {
                        visibleRowCount++;
                    }
                }
            }
        }
    }
    treeColumnRowTemplate(args) {
        if (this.rowTemplate) {
            let rows = this.getContentTable().rows;
            rows = [].slice.call(rows);
            for (let i = 0; i < rows.length; i++) {
                let rcell = this.grid.getContentTable().rows[i].cells[this.treeColumnIndex];
                let row = rows[i];
                let rowData = this.grid.getRowsObject()[i].data;
                let arg = { data: rowData, row: row, cell: rcell, column: this.getColumns()[this.treeColumnIndex] };
                this.renderModule.cellRender(arg);
            }
        }
    }
    collapseRemoteChild(rows) {
        let rData;
        for (let i = 0; i < rows.length; i++) {
            if (this.rowTemplate) {
                rData = this.grid.getCurrentViewRecords()[rows[i].rowIndex];
            }
            else {
                rData = this.grid.getRowObjectFromUID(rows[i].getAttribute('data-Uid')).data;
            }
            rData.expanded = false;
            rows[i].style.display = 'none';
            let collapsingTd = rows[i].querySelector('.e-detailrowexpand');
            if (!isNullOrUndefined(collapsingTd)) {
                this.grid.detailRowModule.collapse(collapsingTd);
            }
            if (rows[i].querySelector('.e-treecolumn-container .e-treegridexpand')) {
                let expandElement = rows[i].querySelector('.e-treecolumn-container .e-treegridexpand');
                removeClass([expandElement], 'e-treegridexpand');
                addClass([expandElement], 'e-treegridcollapse');
                let cRow = [];
                let eRows = this.getRows();
                for (let i = 0; i < eRows.length; i++) {
                    if (eRows[i].classList.contains('e-gridrowindex' + rData.index + 'level' + (rData.level + 1))) {
                        cRow.push(eRows[i]);
                    }
                }
                this.collapseRemoteChild(cRow);
            }
        }
    }
    /**
     * @hidden
     */
    addListener() {
        this.on('updateResults', this.updateResultModel, this);
    }
    updateResultModel(returnResult) {
        this.dataResults = returnResult;
    }
    /**
     * @hidden
     */
    removeListener() {
        if (this.isDestroyed) {
            return;
        }
        this.off('updateResults', this.updateResultModel);
    }
    /**
     * Filters TreeGrid row by column name with the given options.
     * @param  {string} fieldName - Defines the field name of the column.
     * @param  {string} filterOperator - Defines the operator to filter records.
     * @param  {string | number | Date | boolean} filterValue - Defines the value used to filter records.
     * @param  {string} predicate - Defines the relationship between one filter query and another by using AND or OR predicate.
     * @param  {boolean} matchCase - If match case is set to true, TreeGrid filters the records with exact match. if false, it filters case
     * insensitive records (uppercase and lowercase letters treated the same).
     * @param  {boolean} ignoreAccent - If ignoreAccent set to true,
     * then filter ignores the diacritic characters or accents while filtering.
     * @param  {string} actualFilterValue - Defines the actual filter value for the filter column.
     * @param  {string} actualOperator - Defines the actual filter operator for the filter column.
     * @return {void}
     */
    filterByColumn(fieldName, filterOperator, filterValue, predicate, matchCase, ignoreAccent, actualFilterValue, actualOperator) {
        this.grid.filterByColumn(fieldName, filterOperator, filterValue, predicate, matchCase, ignoreAccent, actualFilterValue, actualOperator);
    }
    /**
     * Clears all the filtered rows of the TreeGrid.
     * @return {void}
     */
    clearFiltering() {
        this.grid.clearFiltering();
    }
    /**
     * Removes filtered column by field name.
     * @param  {string} field - Defines column field name to remove filter.
     * @param  {boolean} isClearFilterBar -  Specifies whether the filter bar value needs to be cleared.
     * @return {void}
     * @hidden
     */
    removeFilteredColsByField(field, isClearFilterBar) {
        this.grid.removeFilteredColsByField(field, isClearFilterBar);
    }
    /**
     * Selects a row by given index.
     * @param  {number} index - Defines the row index.
     * @param  {boolean} isToggle - If set to true, then it toggles the selection.
     * @return {void}
     */
    selectRow(index, isToggle) {
        this.grid.selectRow(index, isToggle);
    }
    /**
     * Selects a collection of rows by indexes.
     * @param  {number[]} rowIndexes - Specifies the row indexes.
     * @return {void}
     */
    selectRows(rowIndexes) {
        this.grid.selectRows(rowIndexes);
    }
    /**
     * Deselects the current selected rows and cells.
     * @return {void}
     */
    clearSelection() {
        this.grid.clearSelection();
    }
    /**
     * Selects a cell by the given index.
     * @param  {IIndex} cellIndex - Defines the row and column indexes.
     * @param  {boolean} isToggle - If set to true, then it toggles the selection.
     * @return {void}
     */
    selectCell(cellIndex, isToggle) {
        this.grid.selectCell(cellIndex, isToggle);
    }
    /**
     * Gets the collection of selected rows.
     * @return {Element[]}
     */
    getSelectedRows() {
        return this.grid.getSelectedRows();
    }
    /**
     * Gets the collection of selected row indexes.
     * @return {number[]}
     */
    getSelectedRowIndexes() {
        return this.grid.getSelectedRowIndexes();
    }
    /**
     * Gets the collection of selected row and cell indexes.
     * @return {number[]}
     */
    getSelectedRowCellIndexes() {
        return this.grid.getSelectedRowCellIndexes();
    }
    /**
     * Gets the collection of selected records.
     * @isGenericType true
     * @return {Object[]}
     */
    getSelectedRecords() {
        return this.grid.getSelectedRecords();
    }
    /**
     * Gets the data module.
     * @return {Data}
     */
    getDataModule() {
        return { baseModule: this.grid.getDataModule(), treeModule: this.dataModule };
    }
    /**
     * Reorder the rows based on given indexes and position
     */
    reorderRows(fromIndexes, toIndex, position) {
        this.rowDragAndDropModule.reorderRows(fromIndexes, toIndex, position);
    }
};
__decorate([
    Property([])
], TreeGrid.prototype, "columns", void 0);
__decorate([
    Property(null)
], TreeGrid.prototype, "childMapping", void 0);
__decorate([
    Property(null)
], TreeGrid.prototype, "hasChildMapping", void 0);
__decorate([
    Property(0)
], TreeGrid.prototype, "treeColumnIndex", void 0);
__decorate([
    Property(null)
], TreeGrid.prototype, "idMapping", void 0);
__decorate([
    Property(null)
], TreeGrid.prototype, "parentIdMapping", void 0);
__decorate([
    Property(false)
], TreeGrid.prototype, "enableCollapseAll", void 0);
__decorate([
    Property(null)
], TreeGrid.prototype, "expandStateMapping", void 0);
__decorate([
    Property(false)
], TreeGrid.prototype, "allowRowDragAndDrop", void 0);
__decorate([
    Property([])
], TreeGrid.prototype, "dataSource", void 0);
__decorate([
    Property()
], TreeGrid.prototype, "query", void 0);
__decorate([
    Property()
], TreeGrid.prototype, "cloneQuery", void 0);
__decorate([
    Property('AllPages')
], TreeGrid.prototype, "printMode", void 0);
__decorate([
    Property(false)
], TreeGrid.prototype, "allowPaging", void 0);
__decorate([
    Property(false)
], TreeGrid.prototype, "loadChildOnDemand", void 0);
__decorate([
    Property(false)
], TreeGrid.prototype, "allowTextWrap", void 0);
__decorate([
    Complex({}, TextWrapSettings)
], TreeGrid.prototype, "textWrapSettings", void 0);
__decorate([
    Property(false)
], TreeGrid.prototype, "allowReordering", void 0);
__decorate([
    Property(false)
], TreeGrid.prototype, "allowResizing", void 0);
__decorate([
    Property(false)
], TreeGrid.prototype, "autoCheckHierarchy", void 0);
__decorate([
    Complex({}, PageSettings)
], TreeGrid.prototype, "pageSettings", void 0);
__decorate([
    Complex({}, RowDropSettings)
], TreeGrid.prototype, "rowDropSettings", void 0);
__decorate([
    Property()
], TreeGrid.prototype, "pagerTemplate", void 0);
__decorate([
    Property(false)
], TreeGrid.prototype, "showColumnMenu", void 0);
__decorate([
    Property(false)
], TreeGrid.prototype, "allowSorting", void 0);
__decorate([
    Property(true)
], TreeGrid.prototype, "allowMultiSorting", void 0);
__decorate([
    Complex({}, SortSettings)
], TreeGrid.prototype, "sortSettings", void 0);
__decorate([
    Collection([], AggregateRow)
], TreeGrid.prototype, "aggregates", void 0);
__decorate([
    Complex({}, EditSettings)
], TreeGrid.prototype, "editSettings", void 0);
__decorate([
    Property(false)
], TreeGrid.prototype, "allowFiltering", void 0);
__decorate([
    Property()
], TreeGrid.prototype, "detailTemplate", void 0);
__decorate([
    Complex({}, FilterSettings)
], TreeGrid.prototype, "filterSettings", void 0);
__decorate([
    Complex({}, SearchSettings)
], TreeGrid.prototype, "searchSettings", void 0);
__decorate([
    Property()
], TreeGrid.prototype, "toolbar", void 0);
__decorate([
    Property()
], TreeGrid.prototype, "toolbarTemplate", void 0);
__decorate([
    Property('Default')
], TreeGrid.prototype, "gridLines", void 0);
__decorate([
    Property()
], TreeGrid.prototype, "contextMenuItems", void 0);
__decorate([
    Property()
], TreeGrid.prototype, "columnMenuItems", void 0);
__decorate([
    Property()
], TreeGrid.prototype, "rowTemplate", void 0);
__decorate([
    Property(null)
], TreeGrid.prototype, "rowHeight", void 0);
__decorate([
    Property(true)
], TreeGrid.prototype, "enableAltRow", void 0);
__decorate([
    Property(true)
], TreeGrid.prototype, "allowKeyboard", void 0);
__decorate([
    Property(false)
], TreeGrid.prototype, "enableHover", void 0);
__decorate([
    Property('auto')
], TreeGrid.prototype, "height", void 0);
__decorate([
    Property('auto')
], TreeGrid.prototype, "width", void 0);
__decorate([
    Property(false)
], TreeGrid.prototype, "enableVirtualization", void 0);
__decorate([
    Property('All')
], TreeGrid.prototype, "columnQueryMode", void 0);
__decorate([
    Event()
], TreeGrid.prototype, "created", void 0);
__decorate([
    Event()
], TreeGrid.prototype, "load", void 0);
__decorate([
    Event()
], TreeGrid.prototype, "expanding", void 0);
__decorate([
    Event()
], TreeGrid.prototype, "expanded", void 0);
__decorate([
    Event()
], TreeGrid.prototype, "collapsing", void 0);
__decorate([
    Event()
], TreeGrid.prototype, "collapsed", void 0);
__decorate([
    Event()
], TreeGrid.prototype, "cellSave", void 0);
__decorate([
    Event()
], TreeGrid.prototype, "actionBegin", void 0);
__decorate([
    Event()
], TreeGrid.prototype, "actionComplete", void 0);
__decorate([
    Event()
], TreeGrid.prototype, "beginEdit", void 0);
__decorate([
    Event()
], TreeGrid.prototype, "cellEdit", void 0);
__decorate([
    Event()
], TreeGrid.prototype, "actionFailure", void 0);
__decorate([
    Event()
], TreeGrid.prototype, "dataBound", void 0);
__decorate([
    Event()
], TreeGrid.prototype, "dataSourceChanged", void 0);
__decorate([
    Event()
], TreeGrid.prototype, "dataStateChange", void 0);
__decorate([
    Event()
], TreeGrid.prototype, "recordDoubleClick", void 0);
__decorate([
    Event()
], TreeGrid.prototype, "rowDataBound", void 0);
__decorate([
    Event()
], TreeGrid.prototype, "detailDataBound", void 0);
__decorate([
    Event()
], TreeGrid.prototype, "queryCellInfo", void 0);
__decorate([
    Property(true)
], TreeGrid.prototype, "allowSelection", void 0);
__decorate([
    Event()
], TreeGrid.prototype, "rowSelecting", void 0);
__decorate([
    Event()
], TreeGrid.prototype, "rowSelected", void 0);
__decorate([
    Event()
], TreeGrid.prototype, "rowDeselecting", void 0);
__decorate([
    Event()
], TreeGrid.prototype, "rowDeselected", void 0);
__decorate([
    Event()
], TreeGrid.prototype, "headerCellInfo", void 0);
__decorate([
    Event()
], TreeGrid.prototype, "cellSelecting", void 0);
__decorate([
    Event()
], TreeGrid.prototype, "columnMenuOpen", void 0);
__decorate([
    Event()
], TreeGrid.prototype, "columnMenuClick", void 0);
__decorate([
    Event()
], TreeGrid.prototype, "cellSelected", void 0);
__decorate([
    Event()
], TreeGrid.prototype, "cellDeselecting", void 0);
__decorate([
    Event()
], TreeGrid.prototype, "cellDeselected", void 0);
__decorate([
    Event()
], TreeGrid.prototype, "resizeStart", void 0);
__decorate([
    Event()
], TreeGrid.prototype, "resizing", void 0);
__decorate([
    Event()
], TreeGrid.prototype, "resizeStop", void 0);
__decorate([
    Event()
], TreeGrid.prototype, "columnDragStart", void 0);
__decorate([
    Event()
], TreeGrid.prototype, "columnDrag", void 0);
__decorate([
    Event()
], TreeGrid.prototype, "columnDrop", void 0);
__decorate([
    Event()
], TreeGrid.prototype, "checkboxChange", void 0);
__decorate([
    Event()
], TreeGrid.prototype, "printComplete", void 0);
__decorate([
    Event()
], TreeGrid.prototype, "beforePrint", void 0);
__decorate([
    Event()
], TreeGrid.prototype, "toolbarClick", void 0);
__decorate([
    Event()
], TreeGrid.prototype, "beforeDataBound", void 0);
__decorate([
    Event()
], TreeGrid.prototype, "contextMenuOpen", void 0);
__decorate([
    Event()
], TreeGrid.prototype, "contextMenuClick", void 0);
__decorate([
    Event()
], TreeGrid.prototype, "rowDrag", void 0);
__decorate([
    Event()
], TreeGrid.prototype, "rowDragStart", void 0);
__decorate([
    Event()
], TreeGrid.prototype, "rowDragStartHelper", void 0);
__decorate([
    Event()
], TreeGrid.prototype, "rowDrop", void 0);
__decorate([
    Property(-1)
], TreeGrid.prototype, "selectedRowIndex", void 0);
__decorate([
    Complex({}, SelectionSettings)
], TreeGrid.prototype, "selectionSettings", void 0);
__decorate([
    Property(false)
], TreeGrid.prototype, "allowExcelExport", void 0);
__decorate([
    Property(false)
], TreeGrid.prototype, "allowPdfExport", void 0);
__decorate([
    Event()
], TreeGrid.prototype, "pdfQueryCellInfo", void 0);
__decorate([
    Event()
], TreeGrid.prototype, "pdfHeaderQueryCellInfo", void 0);
__decorate([
    Event()
], TreeGrid.prototype, "excelQueryCellInfo", void 0);
__decorate([
    Event()
], TreeGrid.prototype, "excelHeaderQueryCellInfo", void 0);
__decorate([
    Event()
], TreeGrid.prototype, "beforeExcelExport", void 0);
__decorate([
    Event()
], TreeGrid.prototype, "excelExportComplete", void 0);
__decorate([
    Event()
], TreeGrid.prototype, "beforePdfExport", void 0);
__decorate([
    Event()
], TreeGrid.prototype, "pdfExportComplete", void 0);
TreeGrid = TreeGrid_1 = __decorate([
    NotifyPropertyChanges
], TreeGrid);

/**
 * TreeGrid Reorder module
 * @hidden
 */
class Reorder$1 {
    /**
     * Constructor for Reorder module
     */
    constructor(parent, treeColumn) {
        Grid.Inject(Reorder);
        this.parent = parent;
        this.addEventListener();
    }
    /**
     * For internal use only - Get the module name.
     * @private
     */
    getModuleName() {
        return 'reorder';
    }
    /**
     * @hidden
     */
    addEventListener() {
        this.parent.on('getColumnIndex', this.getTreeColumn, this);
    }
    removeEventListener() {
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.off('getColumnIndex', this.getTreeColumn);
    }
    /**
     * To destroy the Reorder
     * @return {void}
     * @hidden
     */
    destroy() {
        this.removeEventListener();
    }
    getTreeColumn() {
        let treeColumn = this.parent.columns[this.parent.treeColumnIndex];
        let treeIndex;
        let updatedCols = this.parent.getColumns();
        for (let f = 0; f < updatedCols.length; f++) {
            let treeColumnfield = getObject('field', treeColumn);
            let parentColumnfield = getObject('field', updatedCols[f]);
            if (treeColumnfield === parentColumnfield) {
                treeIndex = f;
                break;
            }
        }
        this.parent.setProperties({ treeColumnIndex: treeIndex }, true);
    }
}

/**
 * TreeGrid Resize module
 * @hidden
 */
class Resize$1 {
    /**
     * Constructor for Resize module
     */
    constructor(parent) {
        Grid.Inject(Resize);
        this.parent = parent;
    }
    /**
     * Resize by field names.
     * @param  {string|string[]} fName - Defines the field name.
     * @return {void}
     */
    autoFitColumns(fName) {
        this.parent.grid.autoFitColumns(fName);
    }
    /**
     * For internal use only - Get the module name.
     * @private
     */
    getModuleName() {
        return 'resize';
    }
    /**
     * Destroys the Resize.
     * @method destroy
     * @return {void}
     */
    destroy() {
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.grid.resizeModule.destroy();
    }
}

/**
 * Base export
 */

/**
 * Models export
 */

/**
 * RowModelGenerator is used to generate grid data rows.
 * @hidden
 */
class TreeVirtualRowModelGenerator extends VirtualRowModelGenerator {
    constructor(parent) {
        super(parent);
        this.addEventListener();
    }
    addEventListener() {
        this.parent.on(dataListener, this.getDatas, this);
    }
    getDatas(args) {
        this.visualData = args.data;
    }
    generateRows(data, notifyArgs) {
        let rows = super.generateRows(data, notifyArgs);
        for (let r = 0; r < rows.length; r++) {
            rows[r].index = (this.visualData).indexOf(rows[r].data);
        }
        return rows;
    }
    checkAndResetCache(action) {
        let clear = ['paging', 'refresh', 'sorting', 'filtering', 'searching', 'virtualscroll', 'reorder',
            'save', 'delete'].some((value) => action === value);
        if (clear) {
            this.cache = {};
            this.data = {};
            this.groups = {};
        }
        return clear;
    }
}

/**
 * Renderer export
 */

/**
 * TreeGrid Filter module will handle filtering action
 * @hidden
 */
class Filter$1 {
    /**
     * Constructor for Filter module
     */
    constructor(parent) {
        Grid.Inject(Filter);
        this.parent = parent;
        this.isHierarchyFilter = false;
        this.filteredResult = [];
        this.flatFilteredData = [];
        this.filteredParentRecs = [];
        this.addEventListener();
    }
    /**
     * For internal use only - Get the module name.
     * @private
     */
    getModuleName() {
        return 'filter';
    }
    /**
     * To destroy the Filter module
     * @return {void}
     * @hidden
     */
    destroy() {
        this.removeEventListener();
    }
    /**
     * @hidden
     */
    addEventListener() {
        this.parent.on('updateFilterRecs', this.updatedFilteredRecord, this);
        this.parent.on('clearFilters', this.clearFilterLevel, this);
    }
    /**
     * @hidden
     */
    removeEventListener() {
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.off('updateFilterRecs', this.updatedFilteredRecord);
        this.parent.off('clearFilters', this.clearFilterLevel);
    }
    /**
     * Function to update filtered records
     *  @hidden
     */
    updatedFilteredRecord(dataDetails) {
        setValue('uniqueIDFilterCollection', {}, this.parent);
        this.flatFilteredData = dataDetails.data;
        this.filteredParentRecs = [];
        this.filteredResult = [];
        this.isHierarchyFilter = false;
        for (let f = 0; f < this.flatFilteredData.length; f++) {
            let rec = this.flatFilteredData[f];
            this.addParentRecord(rec);
            let hierarchyMode = this.parent.grid.searchSettings.key === '' ? this.parent.filterSettings.hierarchyMode
                : this.parent.searchSettings.hierarchyMode;
            if (((hierarchyMode === 'Child' || hierarchyMode === 'None') &&
                (this.parent.grid.filterSettings.columns.length !== 0 || this.parent.grid.searchSettings.key !== ''))) {
                this.isHierarchyFilter = true;
            }
            let ischild = getObject('childRecords', rec);
            if (!isNullOrUndefined(ischild) && ischild.length) {
                setValue('hasFilteredChildRecords', this.checkChildExsist(rec), rec);
            }
            let parent = getObject('parentItem', rec);
            if (!isNullOrUndefined(parent)) {
                let parRecord = getParentData(this.parent, rec.parentItem.uniqueID, true);
                //let parRecord: Object = this.flatFilteredData.filter((e: ITreeData) => {
                //          return e.uniqueID === rec.parentItem.uniqueID; })[0];
                setValue('hasFilteredChildRecords', true, parRecord);
            }
        }
        if (this.flatFilteredData.length > 0 && this.isHierarchyFilter) {
            this.updateFilterLevel();
        }
        this.parent.notify('updateAction', { result: this.filteredResult });
    }
    addParentRecord(record) {
        let parent = getParentData(this.parent, record.parentUniqueID);
        //let parent: Object = this.parent.flatData.filter((e: ITreeData) => {return e.uniqueID === record.parentUniqueID; })[0];
        let hierarchyMode = this.parent.grid.searchSettings.key === '' ? this.parent.filterSettings.hierarchyMode
            : this.parent.searchSettings.hierarchyMode;
        if (hierarchyMode === 'None' && (this.parent.grid.filterSettings.columns.length !== 0
            || this.parent.grid.searchSettings.key !== '')) {
            if (isNullOrUndefined(parent)) {
                if (this.flatFilteredData.indexOf(record) !== -1) {
                    if (this.filteredResult.indexOf(record) === -1) {
                        this.filteredResult.push(record);
                        setValue('uniqueIDFilterCollection.' + record.uniqueID, record, this.parent);
                        record.hasFilteredChildRecords = true;
                    }
                    return;
                }
            }
            else {
                this.addParentRecord(parent);
                if (this.flatFilteredData.indexOf(parent) !== -1 || this.filteredResult.indexOf(parent) !== -1) {
                    if (this.filteredResult.indexOf(record) === -1) {
                        this.filteredResult.push(record);
                        setValue('uniqueIDFilterCollection.' + record.uniqueID, record, this.parent);
                    }
                }
                else {
                    if (this.filteredResult.indexOf(record) === -1 && this.flatFilteredData.indexOf(record) !== -1) {
                        this.filteredResult.push(record);
                        setValue('uniqueIDFilterCollection.' + record.uniqueID, record, this.parent);
                    }
                }
            }
        }
        else {
            if (!isNullOrUndefined(parent)) {
                let hierarchyMode = this.parent.grid.searchSettings.key === '' ?
                    this.parent.filterSettings.hierarchyMode : this.parent.searchSettings.hierarchyMode;
                if (hierarchyMode === 'Child' && (this.parent.grid.filterSettings.columns.length !== 0
                    || this.parent.grid.searchSettings.key !== '')) {
                    if (this.flatFilteredData.indexOf(parent) !== -1) {
                        this.addParentRecord(parent);
                    }
                }
                else {
                    this.addParentRecord(parent);
                }
            }
            if (this.filteredResult.indexOf(record) === -1) {
                this.filteredResult.push(record);
                setValue('uniqueIDFilterCollection.' + record.uniqueID, record, this.parent);
            }
        }
    }
    checkChildExsist(records) {
        let childRec = getObject('childRecords', records);
        let isExist = false;
        for (let count = 0; count < childRec.length; count++) {
            let ischild = childRec[count].childRecords;
            let hierarchyMode = this.parent.grid.searchSettings.key === '' ?
                this.parent.filterSettings.hierarchyMode : this.parent.searchSettings.hierarchyMode;
            if (((hierarchyMode === 'Child' || hierarchyMode === 'Both') && (this.parent.grid.filterSettings.columns.length !== 0
                || this.parent.grid.searchSettings.key !== ''))) {
                let uniqueIDValue = getValue('uniqueIDFilterCollection', this.parent);
                if (!uniqueIDValue.hasOwnProperty(childRec[count].uniqueID)) {
                    this.filteredResult.push(childRec[count]);
                    setValue('uniqueIDFilterCollection.' + childRec[count].uniqueID, childRec[count], this.parent);
                    isExist = true;
                }
            }
            if ((hierarchyMode === 'None')
                && (this.parent.grid.filterSettings.columns.length !== 0 || this.parent.grid.searchSettings.key !== '')) {
                if (this.flatFilteredData.indexOf(childRec[count]) !== -1) {
                    isExist = true;
                    break;
                }
            }
            if (!isNullOrUndefined(ischild) && ischild.length) {
                isExist = this.checkChildExsist(childRec[count]);
            }
        }
        return isExist;
    }
    updateFilterLevel() {
        let record = this.filteredResult;
        let len = this.filteredResult.length;
        for (let c = 0; c < len; c++) {
            let parent = getParentData(this.parent, record[c].parentUniqueID);
            let isPrst = record.indexOf(parent) !== -1;
            if (isPrst) {
                let parent = getParentData(this.parent, record[c].parentUniqueID, true);
                record[c].filterLevel = parent.filterLevel + 1;
            }
            else {
                record[c].filterLevel = 0;
                this.filteredParentRecs.push(record[c]);
            }
        }
    }
    clearFilterLevel(data) {
        let count = 0;
        let flatData = data.flatData;
        let len = flatData.length;
        let currentRecord;
        for (count; count < len; count++) {
            currentRecord = flatData[count];
            let fLevel = currentRecord.filterLevel;
            if (fLevel || fLevel === 0 || !isNullOrUndefined(currentRecord.hasFilteredChildRecords)) {
                currentRecord.hasFilteredChildRecords = null;
                currentRecord.filterLevel = null;
            }
        }
        this.filteredResult = [];
        this.parent.notify('updateResults', { result: flatData, count: flatData.length });
    }
}

/**
 * TreeGrid Excel Export module
 * @hidden
 */
class ExcelExport$1 {
    /**
     * Constructor for Excel Export module
     */
    constructor(parent) {
        Grid.Inject(ExcelExport);
        this.parent = parent;
        this.dataResults = {};
        this.addEventListener();
    }
    /**
     * For internal use only - Get the module name.
     * @private
     */
    getModuleName() {
        return 'ExcelExport';
    }
    /**
     * @hidden
     */
    addEventListener() {
        this.parent.on('updateResults', this.updateExcelResultModel, this);
        this.parent.on('excelCellInfo', this.excelQueryCellInfo, this);
    }
    /**
     * To destroy the Excel Export
     * @return {void}
     * @hidden
     */
    destroy() {
        this.removeEventListener();
    }
    /**
     * @hidden
     */
    removeEventListener() {
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.off('updateResults', this.updateExcelResultModel);
        this.parent.off('excelCellInfo', this.excelQueryCellInfo);
    }
    updateExcelResultModel(returnResult) {
        this.dataResults = returnResult;
    }
    Map(excelExportProperties, 
    /* tslint:disable-next-line:no-any */
    isMultipleExport, workbook, isBlob, isCsv) {
        let dataSource = this.parent.dataSource;
        let property = Object();
        setValue('isCsv', isCsv, property);
        setValue('cancel', false, property);
        return new Promise((resolve, reject) => {
            let dm = this.isLocal() ? new DataManager(dataSource) : this.parent.dataSource;
            let query = new Query();
            if (!this.isLocal()) {
                query = this.generateQuery(query);
                setValue('query', query, property);
            }
            this.parent.trigger(beforeExcelExport, extend(property, excelExportProperties));
            if (getObject('cancel', property)) {
                return null;
            }
            dm.executeQuery(query).then((e) => {
                let customData = null;
                if (!isNullOrUndefined(excelExportProperties) && !isNullOrUndefined(excelExportProperties.dataSource)) {
                    customData = excelExportProperties.dataSource;
                }
                excelExportProperties = this.manipulateExportProperties(excelExportProperties, dataSource, e);
                return this.parent.grid.excelExportModule.Map(this.parent.grid, excelExportProperties, isMultipleExport, workbook, isCsv, isBlob).then((book) => {
                    if (customData != null) {
                        excelExportProperties.dataSource = customData;
                    }
                    else {
                        delete excelExportProperties.dataSource;
                    }
                    resolve(book);
                });
            });
        });
    }
    generateQuery(query, property) {
        if (!isNullOrUndefined(property) && property.exportType === 'CurrentPage'
            && this.parent.allowPaging) {
            property.exportType = 'AllPages';
            query.addParams('ExportType', 'CurrentPage');
            query.where(this.parent.parentIdMapping, 'equal', null);
            query = getObject('grid.renderModule.data.pageQuery', this.parent)(query);
        }
        return query;
    }
    manipulateExportProperties(property, dtSrc, queryResult) {
        //count not required for this query
        let args = Object();
        setValue('query', this.parent.grid.getDataModule().generateQuery(true), args);
        setValue('isExport', true, args);
        if (!isNullOrUndefined(property) && !isNullOrUndefined(property.exportType)) {
            setValue('exportType', property.exportType, args);
        }
        if (!this.isLocal() || !isNullOrUndefined(this.parent.parentIdMapping)) {
            this.parent.parentData = [];
            this.parent.dataModule.convertToFlatData(getObject('result', queryResult));
            setValue('expresults', this.parent.flatData, args);
        }
        this.parent.notify('dataProcessor', args);
        //args = this.parent.dataModule.dataProcessor(args);
        args = this.dataResults;
        dtSrc = isNullOrUndefined(args.result) ? this.parent.flatData.slice(0) : args.result;
        if (!this.isLocal()) {
            this.parent.flatData = [];
        }
        if (property && property.dataSource) {
            this.parent.dataModule.convertToFlatData(property.dataSource);
            dtSrc = this.parent.flatData;
        }
        property = isNullOrUndefined(property) ? Object() : property;
        property.dataSource = new DataManager({ json: dtSrc });
        return property;
    }
    /**
     * TreeGrid Excel Export cell modifier
     * @hidden
     */
    excelQueryCellInfo(args) {
        if (this.parent.grid.getColumnIndexByUid(args.column.uid) === this.parent.treeColumnIndex) {
            let style = {};
            let data = args.data;
            let ispadfilter = isNullOrUndefined(data.filterLevel);
            let pad = ispadfilter ? data.level : data.filterLevel;
            style.indent = pad;
            args.style = style;
        }
        this.parent.notify('updateResults', args);
        this.parent.trigger('excelQueryCellInfo', args);
    }
    isLocal() {
        return !isRemoteData(this.parent) && isOffline(this.parent);
    }
}

/**
 * TreeGrid PDF Export module
 * @hidden
 */
class PdfExport$1 {
    /**
     * Constructor for PDF export module
     */
    constructor(parent) {
        Grid.Inject(PdfExport);
        this.parent = parent;
        this.dataResults = {};
        this.addEventListener();
    }
    /**
     * For internal use only - Get the module name.
     * @private
     */
    getModuleName() {
        return 'PdfExport';
    }
    /**
     * @hidden
     */
    addEventListener() {
        this.parent.on('pdfCellInfo', this.pdfQueryCellInfo, this);
        this.parent.on('updateResults', this.updatePdfResultModel, this);
    }
    /**
     * @hidden
     */
    removeEventListener() {
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.off('pdfCellInfo', this.pdfQueryCellInfo);
        this.parent.off('updateResults', this.updatePdfResultModel);
    }
    /**
     * To destroy the PDF Export
     * @return {void}
     * @hidden
     */
    destroy() {
        this.removeEventListener();
    }
    updatePdfResultModel(returnResult) {
        this.dataResults = returnResult;
    }
    Map(pdfExportProperties, 
    /* tslint:disable-next-line:no-any */
    isMultipleExport, pdfDoc, isBlob) {
        let dtSrc = this.parent.dataSource;
        let prop = Object();
        let isLocal = !isRemoteData(this.parent) && isOffline(this.parent);
        setValue('cancel', false, prop);
        return new Promise((resolve, reject) => {
            let dm = isLocal ? new DataManager(dtSrc) : this.parent.dataSource;
            let query = new Query();
            if (!isLocal) {
                query = this.generateQuery(query);
                setValue('query', query, prop);
            }
            this.parent.trigger(beforePdfExport, extend(prop, pdfExportProperties));
            if (getObject('cancel', prop)) {
                return null;
            }
            dm.executeQuery(query).then((e) => {
                let customsData = null;
                if (!isNullOrUndefined(pdfExportProperties) && !isNullOrUndefined(pdfExportProperties.dataSource)) {
                    customsData = pdfExportProperties.dataSource;
                }
                pdfExportProperties = this.manipulatePdfProperties(pdfExportProperties, dtSrc, e);
                return this.parent.grid.pdfExportModule.Map(this.parent.grid, pdfExportProperties, isMultipleExport, pdfDoc, isBlob).then((document) => {
                    if (customsData != null) {
                        pdfExportProperties.dataSource = customsData;
                    }
                    else {
                        delete pdfExportProperties.dataSource;
                    }
                    resolve(document);
                });
            });
        });
    }
    generateQuery(query, prop) {
        if (!isNullOrUndefined(prop) && prop.exportType === 'CurrentPage'
            && this.parent.allowPaging) {
            prop.exportType = 'AllPages';
            query.addParams('ExportType', 'CurrentPage');
            query.where(this.parent.parentIdMapping, 'equal', null);
            query = getObject('grid.renderModule.data.pageQuery', this.parent)(query);
        }
        return query;
    }
    manipulatePdfProperties(prop, dtSrc, queryResult) {
        let args = {};
        //count not required for this query  
        let isLocal = !isRemoteData(this.parent) && isOffline(this.parent);
        setValue('query', this.parent.grid.getDataModule().generateQuery(true), args);
        setValue('isExport', true, args);
        if (!isNullOrUndefined(prop) && !isNullOrUndefined(prop.exportType)) {
            setValue('exportType', prop.exportType, args);
        }
        if (!isLocal || !isNullOrUndefined(this.parent.parentIdMapping)) {
            this.parent.parentData = [];
            this.parent.dataModule.convertToFlatData(getValue('result', queryResult));
            setValue('expresults', this.parent.flatData, args);
        }
        this.parent.notify('dataProcessor', args);
        //args = this.parent.dataModule.dataProcessor(args);
        args = this.dataResults;
        dtSrc = isNullOrUndefined(args.result) ? this.parent.flatData.slice(0) : args.result;
        if (!isLocal) {
            this.parent.flatData = [];
        }
        if (prop && prop.dataSource) {
            this.parent.dataModule.convertToFlatData(prop.dataSource);
            dtSrc = this.parent.flatData;
        }
        prop = isNullOrUndefined(prop) ? {} : prop;
        prop.dataSource = new DataManager({ json: dtSrc });
        return prop;
    }
    /**
     * TreeGrid PDF Export cell modifier
     * @hidden
     */
    pdfQueryCellInfo(args) {
        if (this.parent.grid.getColumnIndexByUid(args.column.uid) === this.parent.treeColumnIndex) {
            let style = {};
            let data = getObject('data', args);
            let ispadfilter = isNullOrUndefined(data.filterLevel);
            let pad = ispadfilter ? data.level : data.filterLevel;
            style.paragraphIndent = pad * 3;
            args.style = style;
        }
        this.parent.notify('updateResults', args);
        this.parent.trigger('pdfQueryCellInfo', args);
    }
}

/**
 * The `Page` module is used to render pager and handle paging action.
 * @hidden
 */
class Page$1 {
    constructor(parent) {
        Grid.Inject(Page);
        this.parent = parent;
        this.addEventListener();
    }
    /**
     * @hidden
     */
    addEventListener() {
        this.parent.on(localPagedExpandCollapse, this.collapseExpandPagedchilds, this);
        this.parent.on(pagingActions, this.pageAction, this);
    }
    /**
     * @hidden
     */
    removeEventListener() {
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.off(localPagedExpandCollapse, this.collapseExpandPagedchilds);
        this.parent.off(pagingActions, this.pageAction);
    }
    /**
     * For internal use only - Get the module name.
     * @private
     */
    getModuleName() {
        return 'pager';
    }
    /**
     * Refreshes the page count, pager information, and external message.
     * @return {void}
     */
    refresh() {
        this.parent.grid.pagerModule.refresh();
    }
    /**
     * To destroy the pager
     * @return {void}
     * @hidden
     */
    destroy() {
        this.removeEventListener();
    }
    /**
     * Navigates to the target page according to the given number.
     * @param  {number} pageNo - Defines the page number to navigate.
     * @return {void}
     */
    goToPage(pageNo) {
        this.parent.grid.pagerModule.goToPage(pageNo);
    }
    /**
     * Defines the text of the external message.
     * @param  {string} message - Defines the message to update.
     * @return {void}
     */
    updateExternalMessage(message) {
        this.parent.grid.pagerModule.updateExternalMessage(message);
    }
    /**
     * @hidden
     */
    collapseExpandPagedchilds(rowDetails) {
        rowDetails.record.expanded = rowDetails.action === 'collapse' ? false : true;
        if (isBlazor()) {
            this.parent.flatData.filter((e) => {
                return e.uniqueID === rowDetails.record.uniqueID;
            })[0].expanded = rowDetails.action === 'collapse' ? false : true;
        }
        let ret = {
            result: this.parent.flatData,
            row: rowDetails.row,
            action: rowDetails.action,
            record: rowDetails.record,
            count: this.parent.flatData.length
        };
        getValue('grid.renderModule', this.parent).dataManagerSuccess(ret);
    }
    pageRoot(pagedResults, temp, result) {
        let newResults = isNullOrUndefined(result) ? [] : result;
        for (let t = 0; t < temp.length; t++) {
            newResults.push(temp[t]);
            let res = [];
            if (temp[t].hasChildRecords) {
                res = pagedResults.filter((e) => {
                    return temp[t].uniqueID === e.parentUniqueID;
                });
                newResults = this.pageRoot(pagedResults, res, newResults);
            }
        }
        return newResults;
    }
    pageAction(pageingDetails) {
        let dm = new DataManager(pageingDetails.result);
        if (this.parent.pageSettings.pageSizeMode === 'Root') {
            let temp = [];
            let propname = (this.parent.grid.filterSettings.columns.length > 0) &&
                (this.parent.filterSettings.hierarchyMode === 'Child' || this.parent.filterSettings.hierarchyMode === 'None') ?
                'filterLevel' : 'level';
            let query = new Query().where(propname, 'equal', 0);
            temp = dm.executeLocal(query);
            pageingDetails.count = temp.length;
            let size = this.parent.grid.pageSettings.pageSize;
            let current = this.parent.grid.pageSettings.currentPage;
            let skip = size * (current - 1);
            query = query.skip(skip).take(size);
            temp = dm.executeLocal(query);
            let newResults = this.pageRoot(pageingDetails.result, temp);
            pageingDetails.result = newResults;
        }
        else {
            let dm = new DataManager(pageingDetails.result);
            let expanded$$1 = new Predicate$1('expanded', 'notequal', null).or('expanded', 'notequal', undefined);
            let parents = dm.executeLocal(new Query().where(expanded$$1));
            let visualData = parents.filter((e) => {
                return getExpandStatus(this.parent, e, parents);
            });
            pageingDetails.count = visualData.length;
            let query = new Query();
            let size = this.parent.grid.pageSettings.pageSize;
            let current = this.parent.grid.pageSettings.currentPage;
            if (visualData.length < (current * size)) {
                current = (Math.floor(visualData.length / size)) + ((visualData.length % size) ? 1 : 0);
                current = current ? current : 1;
                this.parent.grid.setProperties({ pageSettings: { currentPage: current } }, true);
            }
            let skip = size * (current - 1);
            query = query.skip(skip).take(size);
            dm.dataSource.json = visualData;
            pageingDetails.result = dm.executeLocal(query);
        }
        this.parent.notify('updateAction', pageingDetails);
    }
}

/**
 * Toolbar Module for TreeGrid
 * @hidden
 */
class Toolbar$1 {
    constructor(parent) {
        Grid.Inject(Toolbar);
        this.parent = parent;
        this.addEventListener();
    }
    /**
     * For internal use only - Get the module name.
     * @private
     */
    getModuleName() {
        return 'toolbar';
    }
    /**
     * @hidden
     */
    addEventListener() {
        this.parent.on(rowSelected, this.refreshToolbar, this);
        this.parent.on(toolbarClick, this.toolbarClickHandler, this);
    }
    /**
     * @hidden
     */
    removeEventListener() {
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.off(rowSelected, this.refreshToolbar);
        this.parent.off(toolbarClick, this.toolbarClickHandler);
    }
    refreshToolbar(args) {
        let tObj = this.parent;
        if (args.rowIndex === 0 || tObj.getSelectedRecords().length > 1) {
            this.enableItems([tObj.element.id + '_gridcontrol_indent', tObj.element.id + '_gridcontrol_outdent'], false);
        }
        else {
            if (tObj.getCurrentViewRecords()[args.rowIndex].level >
                tObj.getCurrentViewRecords()[args.rowIndex - 1].level) {
                this.enableItems([tObj.element.id + '_gridcontrol_indent'], false);
            }
            else {
                this.enableItems([tObj.element.id + '_gridcontrol_indent'], true);
            }
            if (tObj.getCurrentViewRecords()[args.rowIndex].level ===
                tObj.getCurrentViewRecords()[args.rowIndex - 1].level) {
                this.enableItems([tObj.element.id + '_gridcontrol_indent'], true);
            }
            if (tObj.getCurrentViewRecords()[args.rowIndex].level === 0) {
                this.enableItems([tObj.element.id + '_gridcontrol_outdent'], false);
            }
            if (tObj.getCurrentViewRecords()[args.rowIndex].level !== 0) {
                this.enableItems([tObj.element.id + '_gridcontrol_outdent'], true);
            }
        }
        if (args.rowIndex === 0 && !isNullOrUndefined(args.data.parentItem)) {
            this.enableItems([tObj.element.id + '_gridcontrol_outdent'], true);
        }
    }
    toolbarClickHandler(args) {
        let tObj = this.parent;
        if (this.parent.editSettings.mode === 'Cell' && this.parent.grid.editSettings.mode === 'Batch' &&
            args.item.id === this.parent.grid.element.id + '_update') {
            args.cancel = true;
            this.parent.grid.editModule.saveCell();
        }
        if (args.item.id === this.parent.grid.element.id + '_expandall') {
            this.parent.expandAll();
        }
        if (args.item.id === this.parent.grid.element.id + '_collapseall') {
            this.parent.collapseAll();
        }
        if (args.item.id === tObj.grid.element.id + '_indent' && tObj.getSelectedRecords().length) {
            let record = tObj.getCurrentViewRecords()[tObj.getSelectedRowIndexes()[0] - 1];
            let dropIndex;
            if (record.level > tObj.getSelectedRecords()[0].level) {
                for (let i = 0; i < tObj.getCurrentViewRecords().length; i++) {
                    if (tObj.getCurrentViewRecords()[i].taskData === record.parentItem.taskData) {
                        dropIndex = i;
                    }
                }
            }
            else {
                dropIndex = tObj.getSelectedRowIndexes()[0] - 1;
            }
            tObj.reorderRows([tObj.getSelectedRowIndexes()[0]], dropIndex, 'child');
        }
        if (args.item.id === tObj.grid.element.id + '_outdent' && tObj.getSelectedRecords().length) {
            let index = tObj.getSelectedRowIndexes()[0];
            let dropIndex;
            let parentItem = tObj.getSelectedRecords()[0].parentItem;
            for (let i = 0; i < tObj.getCurrentViewRecords().length; i++) {
                if (tObj.getCurrentViewRecords()[i].taskData === parentItem.taskData) {
                    dropIndex = i;
                }
            }
            tObj.reorderRows([index], dropIndex, 'below');
        }
    }
    /**
     * Gets the toolbar of the TreeGrid.
     * @return {Element}
     * @hidden
     */
    getToolbar() {
        return this.parent.grid.toolbarModule.getToolbar();
    }
    /**
     * Enables or disables ToolBar items.
     * @param {string[]} items - Defines the collection of itemID of ToolBar items.
     * @param {boolean} isEnable - Defines the items to be enabled or disabled.
     * @return {void}
     * @hidden
     */
    enableItems(items, isEnable) {
        this.parent.grid.toolbarModule.enableItems(items, isEnable);
    }
    /**
     * Destroys the ToolBar.
     * @method destroy
     * @return {void}
     */
    destroy() {
        this.removeEventListener();
    }
}

/**
 * TreeGrid Aggregate module
 * @hidden
 */
class Aggregate$1 {
    /**
     * Constructor for Aggregate module
     */
    constructor(parent) {
        Grid.Inject(Aggregate);
        this.parent = parent;
        this.flatChildRecords = [];
        this.summaryQuery = [];
    }
    /**
     * For internal use only - Get the module name.
     * @private
     */
    getModuleName() {
        return 'summary';
    }
    removeEventListener() {
        if (this.parent.isDestroyed) {
            return;
        }
    }
    /**
     * Function to calculate summary values
     *  @hidden
     */
    calculateSummaryValue(summaryQuery, filteredData, isSort) {
        this.summaryQuery = summaryQuery;
        let parentRecord;
        let parentDataLength = Object.keys(filteredData).length;
        let parentData;
        parentData = [];
        for (let p = 0, len = parentDataLength; p < len; p++) {
            let summaryRow = getObject('isSummaryRow', filteredData[p]);
            if (!summaryRow) {
                parentData.push(filteredData[p]);
            }
        }
        let parentRecords = findParentRecords(parentData);
        let flatRecords;
        flatRecords = parentData.slice();
        let columnLength = Object.keys(this.parent.columns).length;
        let summaryLength = Object.keys(this.parent.aggregates).length;
        let dataLength = Object.keys(parentRecords).length;
        let childRecordsLength;
        for (let i = 0, len = dataLength; i < len; i++) {
            parentRecord = parentRecords[i];
            childRecordsLength = this.getChildRecordsLength(parentRecord, flatRecords);
            for (let summaryRowIndex = 1, len = summaryLength; summaryRowIndex <= len; summaryRowIndex++) {
                let item;
                item = {};
                for (let columnIndex = 0, len = columnLength; columnIndex < len; columnIndex++) {
                    let field = isNullOrUndefined(getObject('field', this.parent.columns[columnIndex])) ?
                        this.parent.columns[columnIndex] : getObject('field', this.parent.columns[columnIndex]);
                    item[field] = null;
                }
                if (this.parent.aggregates[summaryRowIndex - 1].showChildSummary) {
                    item = this.createSummaryItem(item, this.parent.aggregates[summaryRowIndex - 1]);
                    let idx;
                    flatRecords.map((e, i) => { if (e.uniqueID === parentRecord.uniqueID) {
                        idx = i;
                        return;
                    } });
                    let currentIndex = idx + childRecordsLength + summaryRowIndex;
                    let summaryParent = extend({}, parentRecord);
                    delete summaryParent.childRecords;
                    delete summaryParent[this.parent.childMapping];
                    setValue('parentItem', summaryParent, item);
                    let level = getObject('level', summaryParent);
                    setValue('level', level + 1, item);
                    let index = getObject('index', summaryParent);
                    setValue('isSummaryRow', true, item);
                    setValue('parentUniqueID', summaryParent.uniqueID, item);
                    if (isSort) {
                        let childRecords = getObject('childRecords', parentRecord);
                        childRecords.push(item);
                    }
                    flatRecords.splice(currentIndex, 0, item);
                }
                else {
                    continue;
                }
            }
            this.flatChildRecords = [];
        }
        return flatRecords;
    }
    getChildRecordsLength(parentData, flatData) {
        let recordLength = Object.keys(flatData).length;
        let record;
        for (let i = 0, len = recordLength; i < len; i++) {
            record = flatData[i];
            let parent = isNullOrUndefined(record.parentItem) ? null :
                flatData.filter((e) => { return e.uniqueID === record.parentItem.uniqueID; })[0];
            if (parentData === parent) {
                this.flatChildRecords.push(record);
                let hasChild = getObject('hasChildRecords', record);
                if (hasChild) {
                    this.getChildRecordsLength(record, flatData);
                }
                else {
                    continue;
                }
            }
        }
        return this.flatChildRecords.length;
    }
    createSummaryItem(itemData, summary) {
        let summaryColumnLength = Object.keys(summary.columns).length;
        for (let i = 0, len = summaryColumnLength; i < len; i++) {
            let displayColumn = isNullOrUndefined(summary.columns[i].columnName) ? summary.columns[i].field :
                summary.columns[i].columnName;
            let keys = Object.keys(itemData);
            for (let key of keys) {
                if (key === displayColumn) {
                    itemData[key] = this.getSummaryValues(summary.columns[i], this.flatChildRecords);
                }
                else {
                    continue;
                }
            }
        }
        return itemData;
    }
    getSummaryValues(summaryColumn, summaryData) {
        let qry = new Query();
        let single;
        single = {};
        let helper = {};
        let type = !isNullOrUndefined(summaryColumn.field) ?
            this.parent.getColumnByField(summaryColumn.field).type : undefined;
        summaryColumn.setPropertiesSilent({ format: this.getFormatFromType(summaryColumn.format, type) });
        summaryColumn.setFormatter(this.parent.grid.locale);
        let formatFn = summaryColumn.getFormatter() || (() => (a) => a)();
        summaryColumn.setTemplate(helper);
        let tempObj = summaryColumn.getTemplate(2);
        qry.queries = this.summaryQuery;
        qry.requiresCount();
        let sumData = new DataManager(summaryData).executeLocal(qry);
        let types = summaryColumn.type;
        let summaryKey;
        types = [summaryColumn.type];
        types.forEach((type) => {
            summaryKey = type;
            let key = summaryColumn.field + ' - ' + type.toLowerCase();
            let val = type !== 'Custom' ? getObject('aggregates', sumData) :
                calculateAggregate(type, sumData, summaryColumn, this.parent);
            let disp = summaryColumn.columnName;
            let value = type !== 'Custom' ? val[key] : val;
            single[disp] = single[disp] || {};
            single[disp][key] = value;
            single[disp][type] = !isNullOrUndefined(val) ? formatFn(value) : ' ';
        });
        helper.format = summaryColumn.getFormatter();
        let cellElement = createElement('td', {
            className: 'e-summary'
        });
        appendChildren(cellElement, tempObj.fn(single[summaryColumn.columnName], this.parent, tempObj.property));
        let value = single[summaryColumn.columnName][summaryKey];
        let summaryValue;
        if (cellElement.innerHTML.indexOf(value) === -1) {
            summaryValue = cellElement.innerHTML + value;
            return summaryValue;
        }
        else {
            return cellElement.innerHTML;
        }
    }
    getFormatFromType(summaryformat, type) {
        if (isNullOrUndefined(type) || typeof summaryformat !== 'string') {
            return summaryformat;
        }
        let obj;
        switch (type) {
            case 'number':
                obj = { format: summaryformat };
                break;
            case 'datetime':
                obj = { type: 'dateTime', skeleton: summaryformat };
                break;
            case 'date':
                obj = { type: type, skeleton: summaryformat };
                break;
        }
        return obj;
    }
    /**
     * To destroy the Aggregate module
     * @return {void}
     * @hidden
     */
    destroy() {
        this.removeEventListener();
    }
}

/**
 * ContextMenu Module for TreeGrid
 * @hidden
 */
class ContextMenu$1 {
    constructor(parent) {
        Grid.Inject(TreeGridMenu);
        this.parent = parent;
        this.addEventListener();
    }
    /**
     * @hidden
     */
    addEventListener() {
        this.parent.on('contextMenuOpen', this.contextMenuOpen, this);
        this.parent.on('contextMenuClick', this.contextMenuClick, this);
    }
    /**
     * @hidden
     */
    removeEventListener() {
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.off('contextMenuOpen', this.contextMenuOpen);
        this.parent.off('contextMenuClick', this.contextMenuClick);
    }
    contextMenuOpen(args) {
        this.parent.grid.notify('collectTreeGrid', { tree: this.parent });
        let addRow = args.element.querySelector('#' + this.parent.element.id + '_gridcontrol_cmenu_AddRow');
        let editRecord = args.element.querySelector('#' + this.parent.element.id + '_gridcontrol_cmenu_Edit');
        if (addRow) {
            if (this.parent.grid.editSettings.allowAdding === false) {
                addRow.style.display = 'none';
            }
            else {
                addRow.style.display = 'block';
            }
        }
        if (this.parent.editSettings.mode === 'Cell' && !(isNullOrUndefined(editRecord)) && !(editRecord.classList.contains('e-menu-hide'))) {
            editRecord.style.display = 'none';
        }
    }
    contextMenuClick(args) {
        if (args.item.id === 'Above' || args.item.id === 'Below') {
            this.parent.notify('savePreviousRowPosition', args);
            this.parent.setProperties({ editSettings: { newRowPosition: args.item.id } }, true);
            this.parent.addRecord();
        }
    }
    /**
     * For internal use only - Get the module name.
     * @private
     */
    getModuleName() {
        return 'contextMenu';
    }
    /**
     * Destroys the ContextMenu.
     * @method destroy
     * @return {void}
     */
    destroy() {
        this.removeEventListener();
    }
    /**
     * Gets the context menu element from the TreeGrid.
     * @return {Element}
     */
    getContextMenu() {
        return this.parent.grid.contextMenuModule.getContextMenu();
    }
}
class TreeGridMenu extends ContextMenu {
    addEventListener() {
        getValue('parent', this).on('collectTreeGrid', this.collectTreeGrid, this);
        super.addEventListener();
    }
    collectTreeGrid(args) {
        this.treegrid = args.tree;
    }
    contextMenuItemClick(args) {
        let item = getValue('getKeyFromId', this).apply(this, [args.item.id]);
        let isPrevent = false;
        switch (item) {
            case 'PdfExport':
                this.treegrid.pdfExport();
                isPrevent = true;
                break;
            case 'ExcelExport':
                this.treegrid.excelExport();
                isPrevent = true;
                break;
            case 'CsvExport':
                this.treegrid.csvExport();
                isPrevent = true;
                break;
            case 'Save':
                if (this.treegrid.editSettings.mode === 'Cell' && this.treegrid.grid.editSettings.mode === 'Batch') {
                    isPrevent = true;
                    this.treegrid.grid.editModule.saveCell();
                }
        }
        if (!isPrevent) {
            super.contextMenuItemClick(args);
        }
        else {
            args.column = getValue('targetColumn', this);
            args.rowInfo = getValue('targetRowdata', this);
            getValue('parent', this).trigger('contextMenuClick', args);
        }
    }
}

/**
 * TreeGrid Edit Module
 * The `Edit` module is used to handle editing actions.
 */
class Edit$1 {
    /**
     * Constructor for Edit module
     */
    constructor(parent) {
        Grid.Inject(Edit);
        this.parent = parent;
        this.isSelfReference = !isNullOrUndefined(parent.parentIdMapping);
        // this.batchDeleted = {};
        // this.batchRecords = [];
        // this.isAdd = false;
        this.previousNewRowPosition = null;
        this.internalProperties = {};
        this.addEventListener();
    }
    /**
     * For internal use only - Get the module name.
     * @private
     */
    getModuleName() {
        return 'edit';
    }
    /**
     * @hidden
     */
    addEventListener() {
        this.parent.on(crudAction, this.crudAction, this);
        this.parent.on(beginEdit, this.beginEdit, this);
        this.parent.on(beginAdd, this.beginAdd, this);
        this.parent.on(recordDoubleClick, this.recordDoubleClick, this);
        this.parent.on(cellSave, this.cellSave, this);
        this.parent.on(batchCancel, this.batchCancel, this);
        this.parent.grid.on(keyPressed, this.keyPressed, this);
        this.parent.grid.on('content-ready', this.contentready, this);
        this.parent.on(cellEdit, this.cellEdit, this);
        this.parent.grid.on(doubleTap, this.recordDoubleClick, this);
        this.parent.on('savePreviousRowPosition', this.savePreviousRowPosition, this);
        // this.parent.on(events.beforeDataBound, this.beforeDataBound, this);
        // this.parent.on(events.cellSaved, this.cellSaved, this);
        // this.parent.on(events.batchDelete, this.batchDelete, this);
        // this.parent.on(events.batchAdd, this.batchAdd, this);
        // this.parent.on(events.beforeBatchAdd, this.beforeBatchAdd, this);
        // this.parent.on(events.beforeBatchSave, this.beforeBatchSave, this);
        // this.parent.on(events.batchSave, this.batchSave, this);
        this.parent.grid.on(beforeStartEdit, this.beforeStartEdit, this);
        this.parent.grid.on(beforeBatchCancel, this.beforeBatchCancel, this);
        //this.parent.grid.on(events.batchEditFormRendered, this.batchEditFormRendered, this);
    }
    beforeStartEdit(args) {
        this.parent.trigger(actionBegin, args);
    }
    beforeBatchCancel(args) {
        this.parent.trigger(actionComplete, args);
    }
    /*private batchEditFormRendered(args: Object):void {
      this.parent.trigger(events.actionComplete, args);
    }*/
    /**
     * @hidden
     */
    removeEventListener() {
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.off(crudAction, this.crudAction);
        this.parent.off(beginEdit, this.beginEdit);
        this.parent.off(beginAdd, this.beginAdd);
        this.parent.off(recordDoubleClick, this.recordDoubleClick);
        this.parent.off(cellSave, this.cellSave);
        this.parent.off(batchCancel, this.batchCancel);
        this.parent.grid.off(keyPressed, this.keyPressed);
        this.parent.grid.off('content-ready', this.contentready);
        this.parent.off(cellEdit, this.cellEdit);
        this.parent.grid.off(doubleTap, this.recordDoubleClick);
        this.parent.off('savePreviousRowPosition', this.savePreviousRowPosition);
        this.parent.grid.off(beforeStartEdit, this.beforeStartEdit);
        this.parent.grid.off(beforeBatchCancel, this.beforeBatchCancel);
        //this.parent.grid.off(events.batchEditFormRendered, this.batchEditFormRendered);
    }
    /**
     * To destroy the editModule
     * @return {void}
     * @hidden
     */
    destroy() {
        this.removeEventListener();
    }
    /**
     * @hidden
     */
    applyFormValidation(cols) {
        this.parent.grid.editModule.applyFormValidation(cols);
    }
    recordDoubleClick(args) {
        let target = args.target;
        this.doubleClickTarget = target;
        if (isNullOrUndefined(target.closest('td.e-rowcell'))) {
            return;
        }
        let column = this.parent.grid.getColumnByIndex(+target.closest('td.e-rowcell').getAttribute('aria-colindex'));
        if (this.parent.editSettings.mode === 'Cell' && !this.isOnBatch && column && !column.isPrimaryKey &&
            column.allowEditing && !(target.classList.contains('e-treegridexpand') ||
            target.classList.contains('e-treegridcollapse')) && this.parent.editSettings.allowEditOnDblClick) {
            this.isOnBatch = true;
            this.parent.grid.setProperties({ selectedRowIndex: args.rowIndex }, true);
            this.updateGridEditMode('Batch');
        }
    }
    updateGridEditMode(mode) {
        this.parent.grid.setProperties({ editSettings: { mode: mode } }, true);
        let updateMethod = getObject('updateEditObj', this.parent.grid.editModule);
        updateMethod.apply(this.parent.grid.editModule);
        this.parent.grid.isEdit = false;
    }
    keyPressed(args) {
        if (this.isOnBatch) {
            this.keyPress = args.action;
        }
        if (args.action === 'f2') {
            this.recordDoubleClick(args);
        }
    }
    deleteUniqueID(value) {
        let idFilter = 'uniqueIDFilterCollection';
        delete this.parent[idFilter][value];
        let id = 'uniqueIDCollection';
        delete this.parent[id][value];
    }
    cellEdit(args) {
        let promise = 'promise';
        let prom = args[promise];
        delete args[promise];
        if (this.keyPress !== 'enter') {
            this.parent.trigger(cellEdit, args, (celleditArgs) => {
                if (!celleditArgs.cancel && this.parent.editSettings.mode === 'Cell') {
                    this.enableToolbarItems('edit');
                }
                if (!isNullOrUndefined(prom)) {
                    prom.resolve(celleditArgs);
                }
            });
        }
        if (this.doubleClickTarget && (this.doubleClickTarget.classList.contains('e-treegridexpand') ||
            this.doubleClickTarget.classList.contains('e-treegridcollapse'))) {
            args.cancel = true;
            this.doubleClickTarget = null;
            return;
        }
        if (this.parent.editSettings.mode === 'Cell') {
            if (this.keyPress === 'tab' || this.keyPress === 'shiftTab') {
                this.keyPress = null;
            }
            else if (this.keyPress === 'enter') {
                args.cancel = true;
                this.keyPress = null;
            }
        }
        // if (this.isAdd && this.parent.editSettings.mode === 'Batch' && !args.cell.parentElement.classList.contains('e-insertedrow')) {
        //   this.isAdd = false;
        // }
    }
    enableToolbarItems(request) {
        if (!isNullOrUndefined(this.parent.grid.toolbarModule)) {
            let toolbarID = this.parent.element.id + '_gridcontrol_';
            this.parent.grid.toolbarModule.enableItems([toolbarID + 'add', toolbarID + 'edit', toolbarID + 'delete'], request === 'save');
            this.parent.grid.toolbarModule.enableItems([toolbarID + 'update', toolbarID + 'cancel'], request === 'edit');
        }
    }
    batchCancel(e) {
        if (this.parent.editSettings.mode === 'Cell') {
            let cellDetails = getValue('editModule.cellDetails', this.parent.grid.editModule);
            let selectRowIndex = cellDetails.rowIndex;
            this.parent.renderModule.cellRender({
                data: cellDetails.rowData,
                cell: this.parent.getRows()[selectRowIndex].cells[this.parent.treeColumnIndex],
                column: this.parent.grid.getColumns()[this.parent.treeColumnIndex]
            });
            this.updateGridEditMode('Normal');
            this.isOnBatch = false;
        }
        // this.batchRecords = [];
        // let keys: string[] = Object.keys(this.batchDeleted);
        // let primaryLey: string = this.parent.grid.getPrimaryKeyFieldNames()[0];
        // let currentViewRecords: ITreeData[] = this.parent.grid.getCurrentViewRecords();
        // for (let i: number = 0; i < keys.length; i++) {
        //   let index: number;
        //   currentViewRecords.map((e: ITreeData, j: number) => {
        //     if (this.batchDeleted.hasOwnProperty(keys[i]) && e[primaryLey] === this.batchDeleted[keys[i]][primaryLey]) {
        //       index = j; return;
        //     }
        //   });
        //   this.parent.renderModule.cellRender({
        //     data: currentViewRecords[index],
        //     cell: (<HTMLTableRowElement>this.parent.getRowByIndex(index)).cells[this.parent.treeColumnIndex],
        //     column: this.parent.grid.getColumns()[this.parent.treeColumnIndex]
        //   });
        // }
    }
    cellSave(args) {
        if (this.parent.editSettings.mode === 'Cell' && this.parent.element.querySelector('form')) {
            args.cancel = true;
            setValue('isEdit', false, this.parent.grid);
            args.rowData[args.columnName] = args.value;
            let row = args.cell.parentNode;
            let rowIndex;
            let primaryKeys = this.parent.getPrimaryKeyFieldNames();
            if (isNullOrUndefined(row)) {
                this.parent.grid.getCurrentViewRecords().filter((e, i) => {
                    if (e[primaryKeys[0]] === args.rowData[primaryKeys[0]]) {
                        rowIndex = i;
                        return;
                    }
                });
            }
            else {
                rowIndex = this.parent.getDataRows().indexOf(row);
            }
            let arg = {};
            extend(arg, args);
            arg.cancel = false;
            arg.type = 'save';
            row = this.parent.grid.getRows()[row.rowIndex];
            this.parent.trigger(actionBegin, arg);
            if (!arg.cancel) {
                this.updateCell(args, rowIndex);
                if (this.parent.grid.aggregateModule) {
                    this.parent.grid.aggregateModule.refresh(args.rowData);
                }
                this.parent.grid.editModule.formObj.destroy();
                if (this.keyPress !== 'tab' && this.keyPress !== 'shiftTab') {
                    this.updateGridEditMode('Normal');
                    this.isOnBatch = false;
                }
                this.enableToolbarItems('save');
                removeClass([row], ['e-editedrow', 'e-batchrow']);
                removeClass(row.querySelectorAll('.e-rowcell'), ['e-editedbatchcell', 'e-updatedtd']);
                editAction({ value: args.rowData, action: 'edit' }, this.parent, this.isSelfReference, this.addRowIndex, this.selectedIndex, args.columnName);
                let saveArgs = {
                    type: 'save', column: this.parent.getColumnByField(args.columnName), data: args.rowData,
                    previousData: args.previousValue, row: row, target: args.cell
                };
                this.parent.trigger(actionComplete, saveArgs);
            }
            else {
                this.parent.grid.isEdit = true;
            }
        }
    }
    updateCell(args, rowIndex) {
        this.parent.grid.editModule.updateRow(rowIndex, args.rowData);
        this.parent.grid.getRowsObject()[rowIndex].data = args.rowData;
    }
    crudAction(details, columnName) {
        editAction(details, this.parent, this.isSelfReference, this.addRowIndex, this.selectedIndex, columnName, this.addRowRecord);
        this.parent.parentData = [];
        let data = this.parent.grid.dataSource instanceof DataManager ?
            this.parent.grid.dataSource.dataSource.json : this.parent.grid.dataSource;
        for (let i = 0; i < data.length; i++) {
            data[i].index = i;
            let key = this.parent.grid.getPrimaryKeyFieldNames()[0];
            if (details.value[key] === data[i][key]) {
                if (details.action === 'add') {
                    data[i].level = this.internalProperties.level;
                    data[i].parentItem = this.internalProperties.parentItem;
                }
            }
            setValue('uniqueIDCollection.' + data[i].uniqueID + '.index', i, this.parent);
            if (!data[i].level) {
                this.parent.parentData.push(data[i]);
            }
        }
        if (details.action === 'add' && this.previousNewRowPosition != null) {
            this.parent.setProperties({ editSettings: { newRowPosition: this.previousNewRowPosition } }, true);
            this.previousNewRowPosition = null;
        }
    }
    updateIndex(data, rows, records) {
        for (let j = 0; j < this.parent.getDataRows().length; j++) {
            let data1 = records[j];
            let index = getValue('uniqueIDCollection.' + data1.uniqueID + '.index', this.parent);
            data1.index = index;
            if (!isNullOrUndefined(data1.parentItem)) {
                let parentIndex = getValue('uniqueIDCollection.' + data1.parentItem.uniqueID + '.index', this.parent);
                data1.parentItem.index = parentIndex;
            }
        }
        let count = -1;
        for (let k = 0; k < this.parent.getRows().length; k++) {
            if (!rows[k].classList.contains('e-detailrow')) {
                count++;
            }
            let data2 = records[count];
            let index = data2.index;
            let level = data2.level;
            let row = rows[k];
            if (!isNullOrUndefined(data2.parentItem)) {
                index = getValue('uniqueIDCollection.' + data2.parentItem.uniqueID + '.index', this.parent);
            }
            for (let l = 0; l < row.classList.length; l++) {
                let value = row.classList[l];
                let remove = /e-gridrowindex/i;
                let removed = /e-griddetailrowindex/i;
                let result = value.match(remove);
                let results = value.match(removed);
                if (result != null) {
                    removeClass([row], value);
                }
                if (results != null) {
                    removeClass([row], value);
                }
            }
            if (!rows[k].classList.contains('e-detailrow')) {
                addClass([row], 'e-gridrowindex' + index + 'level' + level);
            }
            else {
                addClass([row], 'e-griddetailrowindex' + index + 'level' + level);
            }
        }
    }
    beginAdd(args) {
        let position;
        let index = this.addRowIndex;
        let records = this.parent.grid.getCurrentViewRecords();
        let rows = this.parent.grid.getDataRows();
        if (this.parent.editSettings.mode !== 'Dialog') {
            if (this.parent.editSettings.newRowPosition === 'Child' && !(records[index].expanded) &&
                records[index][this.parent.childMapping] && records[index][this.parent.childMapping].length) {
                this.parent.expandRow(rows[index + 1], records[index]);
            }
            if (this.parent.editSettings.newRowPosition === 'Above') {
                position = 'before';
            }
            else if ((this.parent.editSettings.newRowPosition === 'Below' || this.parent.editSettings.newRowPosition === 'Child')
                && this.selectedIndex > -1) {
                position = 'after';
                // let records: Object[] = this.batchRecords.length ? this.batchRecords : this.parent.grid.getCurrentViewRecords();
                index += findChildrenRecords(records[index]).length;
            }
            if (this.selectedIndex > -1 && (index || (this.parent.editSettings.newRowPosition === 'Child'
                || this.parent.editSettings.newRowPosition === 'Below'))) {
                if (index >= rows.length) {
                    index = rows.length - 2;
                }
                let focussedElement = document.activeElement;
                rows[index + 1][position](rows[0]);
                if (this.parent.editSettings.mode === 'Row' || this.parent.editSettings.mode === 'Cell') {
                    let errors = this.parent.grid.getContentTable().querySelectorAll('.e-griderror');
                    for (let i = 0; i < errors.length; i++) {
                        errors[i].remove();
                    }
                    setValue('errorRules', [], this.parent.grid.editModule.formObj);
                }
                focussedElement.focus();
            }
        }
    }
    // private beforeDataBound(args: BeforeDataBoundArgs): void {
    //   if (this.parent.grid.isEdit && this.parent.dataSource instanceof DataManager &&
    //         this.parent.dataSource.adaptor instanceof RemoteSaveAdaptor) {
    //     let action: string = getValue('action', args);
    //     let data: Object = getValue('data', args);
    //     if (action === 'edit' && !isNullOrUndefined(this.editedData)) {
    //       data = extend(this.editedData, data);
    //       this.editedData = null;
    //     }
    //     if (!isNullOrUndefined(this.addedData)) {
    //       let addedData: Object = args.result[args.result.length - 1];
    //       addedData = extend(this.addedData, addedData);
    //       this.addedData = null;
    //       args.result.splice(this.addedIndex, 0, addedData);
    //       args.result.splice(args.result.length, 1);
    //     }
    //   }
    // }
    beginEdit(args) {
        if (args.requestType === 'refresh' && this.isOnBatch) {
            args.cancel = true;
            return;
        }
        if (this.parent.editSettings.mode === 'Cell' && args.requestType === 'beginEdit') {
            args.cancel = true;
            return;
        }
        if (this.doubleClickTarget && (this.doubleClickTarget.classList.contains('e-treegridexpand') ||
            this.doubleClickTarget.classList.contains('e-treegridcollapse') || this.doubleClickTarget.classList.contains('e-frame'))) {
            args.cancel = true;
            this.doubleClickTarget = null;
            return;
        }
        if (args.requestType === 'delete') {
            let data = args.data;
            for (let i = 0; i < data.length; i++) {
                this.deleteUniqueID(data[i].uniqueID);
                let childs = findChildrenRecords(data[i]);
                for (let c = 0; c < childs.length; c++) {
                    this.deleteUniqueID(childs[c].uniqueID);
                }
                args.data = [...data, ...childs];
            }
        }
        if (args.requestType === 'add') {
            this.selectedIndex = this.parent.grid.selectedRowIndex;
            this.addRowIndex = this.parent.grid.selectedRowIndex > -1 ? this.parent.grid.selectedRowIndex : 0;
            this.addRowRecord = this.parent.getSelectedRecords()[0];
        }
        args = this.beginAddEdit(args);
        // if (args.requestType === 'save' &&
        //    ((this.parent.dataSource instanceof DataManager && this.parent.dataSource.adaptor instanceof RemoteSaveAdaptor))) {
        //      if (args.action === 'edit') {
        //           this.editedData = args.data;
        //      } else if (args.action === 'add') {
        //           this.addedData = value;
        //      }
        // }
    }
    savePreviousRowPosition(args) {
        if (this.previousNewRowPosition === null) {
            this.previousNewRowPosition = this.parent.editSettings.newRowPosition;
        }
    }
    beginAddEdit(args) {
        let value = args.data;
        if (args.action === 'add') {
            let key = this.parent.grid.getPrimaryKeyFieldNames()[0];
            let position = null;
            value.taskData = isNullOrUndefined(value.taskData) ? extend({}, args.data) : value.taskData;
            // let currentData: ITreeData[] = this.batchRecords.length ? this.batchRecords :
            //            <ITreeData[]>this.parent.grid.getCurrentViewRecords();
            let currentData = this.parent.grid.getCurrentViewRecords();
            let index = this.addRowIndex;
            value.uniqueID = getUid(this.parent.element.id + '_data_');
            setValue('uniqueIDCollection.' + value.uniqueID, value, this.parent);
            let level;
            let dataIndex;
            let idMapping;
            let parentUniqueID;
            let parentItem;
            let parentIdMapping;
            if (currentData.length) {
                level = currentData[this.addRowIndex].level;
                dataIndex = currentData[this.addRowIndex].index;
                idMapping = currentData[this.addRowIndex][this.parent.idMapping];
                parentIdMapping = currentData[this.addRowIndex][this.parent.parentIdMapping];
                if (currentData[this.addRowIndex].parentItem) {
                    parentUniqueID = currentData[this.addRowIndex].parentItem.uniqueID;
                }
                parentItem = currentData[this.addRowIndex].parentItem;
            }
            if (this.parent.editSettings.newRowPosition !== 'Top' && currentData.length) {
                if (this.parent.editSettings.newRowPosition === 'Above') {
                    position = 'before';
                    index = currentData[this.addRowIndex].index;
                }
                else if (this.parent.editSettings.newRowPosition === 'Below') {
                    position = 'after';
                    let childRecordCount = findChildrenRecords(currentData[this.addRowIndex]).length;
                    let currentDataIndex = currentData[this.addRowIndex].index;
                    index = (childRecordCount > 0) ? (currentDataIndex + childRecordCount) : (currentDataIndex);
                }
                else if (this.parent.editSettings.newRowPosition === 'Child') {
                    position = 'after';
                    if (this.selectedIndex > -1) {
                        value.parentItem = extend({}, currentData[this.addRowIndex]);
                        value.parentUniqueID = value.parentItem.uniqueID;
                        delete value.parentItem.childRecords;
                        delete value.parentItem[this.parent.childMapping];
                    }
                    let childRecordCount1 = findChildrenRecords(currentData[this.addRowIndex]).length;
                    let currentDataIndex1 = currentData[this.addRowIndex].index;
                    index = (childRecordCount1 > 0) ? (currentDataIndex1 + childRecordCount1) : (currentDataIndex1);
                    value.level = level + 1;
                    if (this.isSelfReference) {
                        value.taskData[this.parent.parentIdMapping] = value[this.parent.parentIdMapping] = idMapping;
                        if (!isNullOrUndefined(value.parentItem)) {
                            updateParentRow(key, value.parentItem, 'add', this.parent, this.isSelfReference, value);
                        }
                    }
                }
                if (this.parent.editSettings.newRowPosition === 'Above' || this.parent.editSettings.newRowPosition === 'Below') {
                    if (this.selectedIndex > -1 && level) {
                        value.parentUniqueID = parentUniqueID;
                        value.parentItem = extend({}, parentItem);
                        delete value.parentItem.childRecords;
                        delete value.parentItem[this.parent.childMapping];
                    }
                    value.level = level;
                    if (this.isSelfReference) {
                        value.taskData[this.parent.parentIdMapping] = value[this.parent.parentIdMapping] = parentIdMapping;
                        if (!isNullOrUndefined(value.parentItem)) {
                            updateParentRow(key, value.parentItem, 'add', this.parent, this.isSelfReference, value);
                        }
                    }
                }
                if (position != null && this.selectedIndex > -1) {
                    args.index = position === 'before' ? index : index + 1;
                }
                if (this.parent.editSettings.newRowPosition === 'Bottom') {
                    let dataSource = (this.parent.grid.dataSource instanceof DataManager ?
                        this.parent.grid.dataSource.dataSource.json : this.parent.grid.dataSource);
                    args.index = dataSource.length;
                }
            }
            if (isNullOrUndefined(value.level)) {
                value.level = level;
            }
            // this.addedIndex = args.index;
            value.hasChildRecords = false;
            value.childRecords = [];
            value.index = 0;
        }
        if (args.action === 'add') {
            this.internalProperties = { level: value.level, parentItem: value.parentItem };
        }
        if (args.requestType === 'delete') {
            let deletedValues = args.data;
            for (let i = 0; i < deletedValues.length; i++) {
                if (deletedValues[i].parentItem) {
                    let parentItem = getParentData(this.parent, deletedValues[i].parentItem.uniqueID);
                    if (!isNullOrUndefined(parentItem) && parentItem.hasChildRecords) {
                        let childIndex = parentItem.childRecords.indexOf(deletedValues[i]);
                        parentItem.childRecords.splice(childIndex, 1);
                    }
                }
            }
        }
        return args;
    }
    /**
     * If the data,index and position given, Adds the record to treegrid rows otherwise it will create edit form.
     * @return {void}
     */
    addRecord(data, index, position) {
        this.previousNewRowPosition = this.parent.editSettings.newRowPosition;
        if (data) {
            if (index > -1) {
                this.selectedIndex = index;
                this.addRowIndex = index;
            }
            else {
                this.selectedIndex = this.parent.selectedRowIndex;
                this.addRowIndex = this.parent.selectedRowIndex;
            }
            if (position) {
                this.parent.setProperties({ editSettings: { newRowPosition: position } }, true);
            }
            this.parent.grid.editModule.addRecord(data, index);
        }
        else {
            this.parent.grid.editModule.addRecord(data, index);
        }
    }
    /**
     * Checks the status of validation at the time of editing. If validation is passed, it returns true.
     * @return {boolean}
     */
    editFormValidate() {
        return this.parent.grid.editModule.editFormValidate();
    }
    /**
     * @hidden
     */
    destroyForm() {
        this.parent.grid.editModule.destroyForm();
    }
    contentready(e) {
        if (!isNullOrUndefined(e.args.requestType)
            && (e.args.requestType.toString() === 'delete' || e.args.requestType.toString() === 'save')) {
            this.updateIndex(this.parent.grid.dataSource, this.parent.getRows(), this.parent.getCurrentViewRecords());
        }
    }
    /**
     * If the row index and field is given, edits the particular cell in a row.
     * @return {void}
     */
    editCell(rowIndex, field) {
        if (this.parent.editSettings.mode === 'Cell') {
            this.isOnBatch = true;
            this.updateGridEditMode('Batch');
            this.parent.grid.editModule.editCell(rowIndex, field);
        }
    }
}

/**
 * Command Column Module for TreeGrid
 * @hidden
 */
class CommandColumn$1 {
    constructor(parent) {
        Grid.Inject(CommandColumn);
        this.parent = parent;
    }
    /**
     * For internal use only - Get the module name.
     * @private
     */
    getModuleName() {
        return 'commandColumn';
    }
    /**
     * Destroys the ContextMenu.
     * @method destroy
     * @return {void}
     */
    destroy() {
        //this.removeEventListener();
    }
}

/**
 * TreeGrid Detail Row module
 * @hidden
 */
class DetailRow$1 {
    constructor(parent) {
        Grid.Inject(DetailRow);
        this.parent = parent;
        this.addEventListener();
    }
    /**
     * @hidden
     */
    /**
     * For internal use only - Get the module name.
     * @private
     */
    getModuleName() {
        return 'detailRow';
    }
    addEventListener() {
        this.parent.on('dataBoundArg', this.dataBoundArg, this);
        this.parent.on('detaildataBound', this.detaildataBound, this);
        this.parent.on('childRowExpand', this.childRowExpand, this);
        this.parent.on('rowExpandCollapse', this.rowExpandCollapse, this);
        this.parent.on('actioncomplete', this.actioncomplete, this);
    }
    /**
     * @hidden
     */
    removeEventListener() {
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.off('dataBoundArg', this.dataBoundArg);
        this.parent.off('detaildataBound', this.detaildataBound);
        this.parent.off('childRowExpand', this.childRowExpand);
        this.parent.off('rowExpandCollapse', this.rowExpandCollapse);
        this.parent.off('actioncomplete', this.actioncomplete);
    }
    dataBoundArg() {
        let detailele = this.parent.getRows().filter((e) => {
            return !e.classList.contains('e-detailrow');
        });
        for (let i = 0; i < detailele.length; i++) {
            let elements = detailele[i].getElementsByClassName('e-detailrowcollapse');
            let detailData = this.parent.grid.getRowObjectFromUID(detailele[i].getAttribute('data-Uid'));
            let parentItem = getObject('parentItem', this.parent.grid.getCurrentViewRecords()[i]);
            if (isNullOrUndefined(parentItem) || !isNullOrUndefined(parentItem) &&
                getExpandStatus(this.parent, detailData.data, this.parent.grid.getCurrentViewRecords())) {
                this.parent.grid.detailRowModule.expand(elements[0]);
            }
        }
    }
    childRowExpand(args) {
        let detailRowElement = args.row.getElementsByClassName('e-detailrowcollapse');
        if (!isNullOrUndefined(detailRowElement[0])) {
            this.parent.grid.detailRowModule.expand(detailRowElement[0]);
        }
    }
    rowExpandCollapse(args) {
        for (let i = 0; i < args.detailrows.length; i++) {
            args.detailrows[i].style.display = args.action;
        }
    }
    detaildataBound(args) {
        let data = args.data;
        let gridClas = [].slice.call(args.detailElement.parentElement.previousSibling.classList).filter((gridclass) => (gridclass !== 'e-row' && gridclass !== 'e-altrow'));
        let newNo = gridClas[0].length;
        let slicedclas = gridClas.toString().slice(6, newNo);
        let detailClass = 'e-griddetail' + slicedclas;
        addClass([args.detailElement.parentElement], detailClass);
    }
    ;
    actioncomplete(args) {
        if (args.requestType === 'beginEdit' || args.requestType === 'add') {
            let spann = (args.row.querySelectorAll('.e-editcell')[0].getAttribute('colSpan'));
            let colum = parseInt(spann, 10) - 1;
            let updtdcolum = colum.toString();
            args.row.querySelectorAll('.e-editcell')[0].setAttribute('colSpan', updtdcolum);
        }
        let focusElement = this.parent.grid.contentModule.getRows();
        for (let i = 0; i < focusElement.length; i++) {
            focusElement[i].cells[0].visible = false;
        }
        let focusModule = getObject('focusModule', this.parent.grid);
        let matrix = 'refreshMatrix';
        focusModule[matrix](true)({ rows: this.parent.grid.contentModule.getRows() });
    }
    /**
     * Destroys the DetailModule.
     * @method destroy
     * @return {void}
     */
    destroy() {
        this.removeEventListener();
    }
}

/**
 * Content renderer for TreeGrid
 */
class VirtualTreeContentRenderer extends VirtualContentRenderer {
    constructor(parent, locator) {
        super(parent, locator);
        this.isExpandCollapse = false;
        this.translateY = 0;
        this.maxiPage = 0;
        this.startIndex = -1;
        this.endIndex = -1;
        this.addEventListener();
    }
    getModelGenerator() {
        return new TreeVirtualRowModelGenerator(this.parent);
    }
    getRowByIndex(index) {
        return this.parent.getDataRows().filter((e) => parseInt(e.getAttribute('aria-rowindex'), 0) === index)[0];
    }
    addEventListener() {
        this.parent.on(virtualActionArgs, this.virtualOtherAction, this);
        this.parent.on(indexModifier, this.indexModifier, this);
    }
    virtualOtherAction(args) {
        if (args.setTop) {
            this.translateY = 0;
            this.startIndex = 0;
            this.endIndex = this.parent.pageSettings.pageSize - 1;
        }
        else if (args.isExpandCollapse) {
            this.isExpandCollapse = true;
        }
    }
    indexModifier(args) {
        args.startIndex = this.startIndex;
        args.endIndex = this.endIndex;
    }
    eventListener(action) {
        this.parent[action]('data-ready', this.onDataReady, this);
        //this.parent[action]('refresh-virtual-block', this.refreshContentRows, this);
        let fn = () => {
            this.observers.observes((scrollArgs) => this.scrollListeners(scrollArgs));
            this.parent.off('content-ready', fn);
        };
        this.parent.on('content-ready', fn, this);
    }
    onDataReady(e) {
        super.onDataReady(e);
        if (!isNullOrUndefined(e.count)) {
            this.totalRecords = e.count;
            getValue('virtualEle', this).setVirtualHeight(this.parent.getRowHeight() * e.count, '100%');
             // this.parent.pageSettings.pageSize - Math.ceil(this.parent.pageSettings.pageSize / 1.5);
        }
    }
    renderTable() {
        super.renderTable();
        getValue('observer', this).options.debounceEvent = false;
        this.observers = new TreeInterSectionObserver(getValue('observer', this).element, getValue('observer', this).options);
        this.contents = this.getPanel().firstChild;
    }
    scrollListeners(scrollArgs) {
        let info = scrollArgs.sentinel;
        let outBuffer = 10; //this.parent.pageSettings.pageSize - Math.ceil(this.parent.pageSettings.pageSize / 1.5);
        let content = this.parent.getContent().querySelector('.e-content');
        let scrollHeight = outBuffer * this.parent.getRowHeight();
        let upScroll = (scrollArgs.offset.top - this.translateY) < 0;
        let downScroll = (scrollArgs.offset.top - this.translateY) > scrollHeight;
        if (upScroll) {
            let vHeight = +(this.parent.height.toString().indexOf('%') < 0 ? this.parent.height :
                this.parent.element.getBoundingClientRect().height);
            let index = (~~(content.scrollTop / this.parent.getRowHeight())
                + Math.ceil(vHeight / this.parent.getRowHeight()))
                - this.parent.getRows().length;
            index = (index > 0) ? index : 0;
            this.startIndex = index;
            this.endIndex = index + this.parent.getRows().length;
            if (this.endIndex > this.totalRecords) {
                let lastInx = this.totalRecords - 1;
                let remains = this.endIndex % lastInx;
                this.endIndex = lastInx;
                this.startIndex = this.startIndex - remains;
            }
            //var firsttdinx = parseInt(this.parent.getContent().querySelector('.e-content td').getAttribute('index'), 0);
            let rowPt = Math.ceil(scrollArgs.offset.top / this.parent.getRowHeight());
            rowPt = rowPt % this.parent.pageSettings.pageSize;
            let firsttdinx = 0;
            if (!isNullOrUndefined(this.parent.getRows()[rowPt])) {
                let attr = this.parent.getContent().querySelectorAll('.e-content tr')[rowPt]
                    .querySelector('td').getAttribute('index');
                firsttdinx = +attr; // this.parent.getContent().querySelector('.e-content tr').getAttribute('aria-rowindex');
            }
            if (firsttdinx === 0) {
                this.translateY = scrollArgs.offset.top;
            }
            else {
                let height = this.parent.getRowHeight();
                this.translateY = (scrollArgs.offset.top - (outBuffer * height) > 0) ?
                    scrollArgs.offset.top - (outBuffer * height) + 10 : 0;
            }
        }
        else if (downScroll) {
            let nextSetResIndex = ~~(content.scrollTop / this.parent.getRowHeight());
            let lastIndex = nextSetResIndex + this.parent.getRows().length;
            if (lastIndex > this.totalRecords) {
                lastIndex = nextSetResIndex +
                    (this.totalRecords - nextSetResIndex);
            }
            this.startIndex = lastIndex - this.parent.getRows().length;
            this.endIndex = lastIndex;
            this.translateY = scrollArgs.offset.top;
        }
        if ((downScroll && (scrollArgs.offset.top < (this.parent.getRowHeight() * this.totalRecords)))
            || (upScroll)) {
            let viewInfo = getValue('getInfoFromView', this).apply(this, [scrollArgs.direction, info, scrollArgs.offset]);
            this.parent.notify(viewInfo.event, { requestType: 'virtualscroll', focusElement: scrollArgs.focusElement });
        }
    }
    appendContent(target, newChild, e) {
        let info = e.virtualInfo.sentinelInfo && e.virtualInfo.sentinelInfo.axis === 'Y' && getValue('currentInfo', this).page &&
            getValue('currentInfo', this).page !== e.virtualInfo.page ? getValue('currentInfo', this) : e.virtualInfo;
        let cBlock = (info.columnIndexes[0]) - 1;
        let cOffset = this.getColumnOffset(cBlock);
        //this.virtualEle.setWrapperWidth(width, ( Browser.isIE || Browser.info.name === 'edge') as boolean);
        target = this.parent.createElement('tbody');
        target.appendChild(newChild);
        let replace = 'replaceWith';
        this.getTable().querySelector('tbody')[replace](target);
        if (!this.isExpandCollapse) {
            getValue('virtualEle', this).adjustTable(cOffset, this.translateY);
        }
        else {
            this.isExpandCollapse = false;
        }
        setValue('prevInfo', info, this);
    }
}
class TreeInterSectionObserver extends InterSectionObserver {
    constructor() {
        super(...arguments);
        this.isWheeling = false;
        this.newPos = 0;
        this.lastPos = 0;
        this.timer = 0;
    }
    observes(callback) {
        setValue('containerRect', getValue('options', this).container.getBoundingClientRect(), this);
        EventHandler.add(getValue('options', this).container, 'scroll', this.virtualScrollHandlers(callback), this);
    }
    clear() {
        this.lastPos = null;
    }
    virtualScrollHandlers(callback) {
        let prevTop = 0;
        let prevLeft = 0;
        return (e) => {
            let scrollTop = e.target.scrollTop;
            let scrollLeft = e.target.scrollLeft;
            let direction = prevTop < scrollTop ? 'down' : 'up';
            direction = prevLeft === scrollLeft ? direction : prevLeft < scrollLeft ? 'right' : 'left';
            prevTop = scrollTop;
            prevLeft = scrollLeft;
            let current = getValue('sentinelInfo', this)[direction];
            let delta = 0;
            this.newPos = scrollTop;
            if (this.lastPos != null) { // && newPos < maxScroll 
                delta = this.newPos - this.lastPos;
            }
            this.lastPos = this.newPos;
            if (this.timer) {
                clearTimeout(this.timer);
            }
            this.timer = setTimeout(this.clear, 0);
            /*if (this.options.axes.indexOf(current.axis) === -1) {
                return;
            }*/
            /*if(delta > 45 || delta < -45){
              this.isWheeling = true;
            }*/
            if ((delta > 100 || delta < -100) && (e && e.preventDefault)) {
                e.returnValue = false;
                e.preventDefault();
            }
            callback({ direction: direction, isWheel: this.isWheeling,
                sentinel: current, offset: { top: scrollTop, left: scrollLeft },
                focusElement: document.activeElement });
        };
    }
}

/**
 * TreeGrid Virtual Scroll module will handle Virtualization
 * @hidden
 */
class VirtualScroll$1 {
    /**
     * Constructor for VirtualScroll module
     */
    constructor(parent) {
        this.prevstartIndex = -1;
        this.prevendIndex = -1;
        this.parent = parent;
        Grid.Inject(TreeVirtual);
        this.addEventListener();
    }
    returnVisualData(args) {
        args.data = this.visualData;
    }
    /**
     * For internal use only - Get the module name.
     * @private
     */
    getModuleName() {
        return 'virtualScroll';
    }
    /**
     * @hidden
     */
    addEventListener() {
        this.parent.on(localPagedExpandCollapse, this.collapseExpandVirtualchilds, this);
        this.parent.on(pagingActions, this.virtualPageAction, this);
    }
    /**
     * @hidden
     */
    removeEventListener() {
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.off(localPagedExpandCollapse, this.collapseExpandVirtualchilds);
        this.parent.off(pagingActions, this.virtualPageAction);
    }
    collapseExpandVirtualchilds(row) {
        this.parent.grid.notify(virtualActionArgs, { isExpandCollapse: true });
        this.expandCollapseRec = row.record;
        row.record.expanded = row.action === 'collapse' ? false : true;
        let ret = {
            result: this.parent.flatData,
            row: row.row,
            action: row.action,
            record: row.record,
            count: this.parent.flatData.length
        };
        getValue('grid.renderModule', this.parent).dataManagerSuccess(ret, { requestType: 'refresh' });
    }
    virtualPageAction(pageingDetails) {
        let dm = new DataManager(pageingDetails.result);
        let expanded$$1 = new Predicate$1('expanded', 'notequal', null).or('expanded', 'notequal', undefined);
        let parents = dm.executeLocal(new Query().where(expanded$$1));
        let visualData = parents.filter((e) => {
            return getExpandStatus(this.parent, e, parents);
        });
        this.visualData = visualData;
        this.parent.grid.notify(dataListener, { data: visualData });
        let counts = { startIndex: -1, endIndex: -1 };
        this.parent.grid.notify(indexModifier, counts);
        let startIndex = counts.startIndex;
        let endIndex = counts.endIndex;
        pageingDetails.count = visualData.length;
        if (startIndex === -1 && endIndex === -1) {
            let query = new Query();
            let size = this.parent.grid.pageSettings.pageSize;
            let current = this.parent.grid.pageSettings.currentPage;
            let skip = size * (current - 1);
            query = query.skip(skip).take(size);
            dm.dataSource.json = visualData;
            pageingDetails.result = dm.executeLocal(query);
        }
        else {
            let requestType = pageingDetails.actionArgs.requestType;
            if (requestType === 'filtering') {
                startIndex = 0;
                endIndex = this.parent.grid.pageSettings.pageSize - 1;
                this.parent.grid.notify(virtualActionArgs, { setTop: true });
            }
            //if ((this.prevendIndex !== -1 && this.prevstartIndex !== -1) && 
            //this.prevendIndex === endIndex && this.prevstartIndex === startIndex) {
            if (!isNullOrUndefined(this.expandCollapseRec)) {
                let resourceCount = this.parent.getRows();
                let sIndex = visualData.indexOf(this.expandCollapseRec);
                let tempdata = visualData.slice(sIndex, sIndex + resourceCount.length);
                if (tempdata.length < resourceCount.length) {
                    sIndex = visualData.length - resourceCount.length;
                    sIndex = sIndex > 0 ? sIndex : 0;
                    startIndex = sIndex;
                    endIndex = visualData.length;
                }
                this.expandCollapseRec = null;
            }
            //}
            pageingDetails.result = visualData.slice(startIndex, endIndex);
            this.prevstartIndex = startIndex;
            this.prevendIndex = endIndex;
        }
        this.parent.notify('updateAction', pageingDetails);
    }
    /**
     * To destroy the virtualScroll module
     * @return {void}
     * @hidden
     */
    destroy() {
        this.removeEventListener();
    }
}
class TreeVirtual extends VirtualScroll {
    constructor(parent, locator) {
        super(parent, locator);
        getValue('parent', this).off('initial-load', getValue('instantiateRenderer', this), this);
        getValue('parent', this).on('initial-load', this.instantiateRenderers, this);
    }
    instantiateRenderers() {
        getValue('parent', this).log(['limitation', 'virtual_height'], 'virtualization');
        let renderer = getValue('locator', this).getService('rendererFactory');
        getValue('addRenderer', renderer)
            .apply(renderer, [RenderType.Content, new VirtualTreeContentRenderer(getValue('parent', this), getValue('locator', this))]);
        //renderer.addRenderer(RenderType.Content, new VirtualTreeContentRenderer(getValue('parent', this), getValue('locator', this)));
        this.ensurePageSize();
    }
    ensurePageSize() {
        let parentGrid = getValue('parent', this);
        let rowHeight = parentGrid.getRowHeight();
        let vHeight = parentGrid.height.toString().indexOf('%') < 0 ? parentGrid.height :
            parentGrid.element.getBoundingClientRect().height;
        let blockSize = ~~(vHeight / rowHeight);
        let height = blockSize * 2;
        let size = parentGrid.pageSettings.pageSize;
        parentGrid.setProperties({ pageSettings: { pageSize: size < height ? height : size } }, true);
    }
}

/**
 * actions export
 */

/**
 * TreeGrid component exported items
 */

/**
 * Export TreeGrid component
 */

export { TreeGrid, load, rowDataBound, dataBound, queryCellInfo, beforeDataBound, actionBegin, actionComplete, rowSelecting, rowSelected, checkboxChange, rowDeselected, toolbarClick, beforeExcelExport, beforePdfExport, resizeStop, expanded, expanding, collapsed, collapsing, remoteExpand, localPagedExpandCollapse, pagingActions, printGridInit, contextMenuOpen, contextMenuClick, savePreviousRowPosition, crudAction, beginEdit, beginAdd, recordDoubleClick, cellSave, cellSaved, cellEdit, batchDelete, batchCancel, batchAdd, beforeBatchAdd, beforeBatchSave, batchSave, keyPressed, updateData, doubleTap, virtualColumnIndex, virtualActionArgs, dataListener, indexModifier, beforeStartEdit, beforeBatchCancel, batchEditFormRendered, detailDataBound, rowDrag, rowDragStartHelper, rowDrop, rowDragStart, rowsAdd, rowsRemove, rowdraging, rowDropped, DataManipulation, Reorder$1 as Reorder, Resize$1 as Resize, RowDD$1 as RowDD, Column, EditSettings, FilterSettings, PageSettings, SearchSettings, SelectionSettings, AggregateColumn, AggregateRow, SortDescriptor, SortSettings, Render, TreeVirtualRowModelGenerator, isRemoteData, findParentRecords, getExpandStatus, findChildrenRecords, isOffline, extendArray, getPlainData, getParentData, ToolbarItem, ContextMenuItems, Filter$1 as Filter, ExcelExport$1 as ExcelExport, PdfExport$1 as PdfExport, Page$1 as Page, Toolbar$1 as Toolbar, Aggregate$1 as Aggregate, Sort$1 as Sort, ColumnMenu$1 as ColumnMenu, ContextMenu$1 as ContextMenu, Edit$1 as Edit, CommandColumn$1 as CommandColumn, Selection, DetailRow$1 as DetailRow, VirtualScroll$1 as VirtualScroll, TreeVirtual };
//# sourceMappingURL=ej2-treegrid.es2015.js.map
