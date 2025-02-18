import { Component, addClass, createElement, EventHandler, isNullOrUndefined, Ajax, ModuleDeclaration, extend} from '@syncfusion/ej2-base';import { removeClass, EmitType, Complex, Collection, KeyboardEventArgs, isBlazor, getElement } from '@syncfusion/ej2-base';import {Event, Property, NotifyPropertyChanges, INotifyPropertyChanged, setValue, KeyboardEvents, L10n } from '@syncfusion/ej2-base';import { Column, ColumnModel } from '../models/column';import { GridModel, ColumnQueryModeType, HeaderCellInfoEventArgs, EditSettingsModel as GridEditModel } from '@syncfusion/ej2-grids';import {RowDragEventArgs, RowDropEventArgs, RowDropSettingsModel, RowDropSettings } from '@syncfusion/ej2-grids';import { ActionEventArgs } from'@syncfusion/ej2-grids';import { DetailDataBoundEventArgs, Row}  from '@syncfusion/ej2-grids';import { SearchEventArgs, AddEventArgs, EditEventArgs, DeleteEventArgs}  from '@syncfusion/ej2-grids';import { SaveEventArgs, CellSaveArgs, BatchAddArgs, BatchCancelArgs,  BeginEditArgs, CellEditArgs}  from '@syncfusion/ej2-grids';import { FilterSettings } from '../models/filter-settings';import { TextWrapSettings } from '../models/textwrap-settings';import { TextWrapSettingsModel } from '../models/textwrap-settings-model';import {Filter} from '../actions/filter';import {Aggregate} from '../actions/summary';import { Reorder } from '../actions/reorder';import { Resize } from '../actions/resize';import { Selection as TreeGridSelection } from '../actions/selection';import { ColumnMenu } from '../actions/column-menu';import { DetailRow } from '../actions/detail-row';import { Print } from '../actions/print';import * as events from '../base/constant';import { FilterSettingsModel } from '../models/filter-settings-model';import { SearchSettings} from '../models/search-settings';import { SearchSettingsModel } from '../models/search-settings-model';import {RowInfo, RowDataBoundEventArgs, PageEventArgs, FilterEventArgs, FailureEventArgs, SortEventArgs } from '@syncfusion/ej2-grids';import { RowSelectingEventArgs, RowSelectEventArgs, RowDeselectEventArgs, IIndex, ISelectedCell } from '@syncfusion/ej2-grids';import {ColumnModel as GridColumnModel, Column as GridColumn, CellSelectEventArgs, CellDeselectEventArgs } from '@syncfusion/ej2-grids';import { SelectionSettings } from '../models/selection-settings';import { SelectionSettingsModel } from '../models/selection-settings-model';import {getActualProperties, SortDirection, getObject, ColumnDragEventArgs } from '@syncfusion/ej2-grids';import { PrintMode, Data, IGrid, ContextMenuItemModel } from '@syncfusion/ej2-grids';import { ColumnMenuItem, ColumnMenuItemModel, CheckBoxChangeEventArgs } from '@syncfusion/ej2-grids';import { ExcelExportCompleteArgs, ExcelHeaderQueryCellInfoEventArgs, ExcelQueryCellInfoEventArgs } from '@syncfusion/ej2-grids';import { PdfExportCompleteArgs, PdfHeaderQueryCellInfoEventArgs, PdfQueryCellInfoEventArgs } from '@syncfusion/ej2-grids';import { ExcelExportProperties, PdfExportProperties, CellSelectingEventArgs, PrintEventArgs } from '@syncfusion/ej2-grids';import { ColumnMenuOpenEventArgs } from '@syncfusion/ej2-grids';import {BeforeDataBoundArgs} from '@syncfusion/ej2-grids';import { DataManager, ReturnOption, RemoteSaveAdaptor, Query, JsonAdaptor, Deferred } from '@syncfusion/ej2-data';import { createSpinner, hideSpinner, showSpinner } from '@syncfusion/ej2-popups';import { isRemoteData, isOffline, extendArray } from '../utils';import { Grid, QueryCellInfoEventArgs } from '@syncfusion/ej2-grids';import { Render } from '../renderer/render';import { DataManipulation } from './data';import { RowDD } from '../actions/rowdragdrop';import { Sort } from '../actions/sort';import { ITreeData, RowExpandedEventArgs, RowExpandingEventArgs, RowCollapsedEventArgs, RowCollapsingEventArgs } from './interface';import { CellSaveEventArgs } from './interface';import { iterateArrayOrObject, GridLine } from '@syncfusion/ej2-grids';import { DataSourceChangedEventArgs, DataStateChangeEventArgs, RecordDoubleClickEventArgs, ResizeArgs } from '@syncfusion/ej2-grids';import { ToolbarItems, ToolbarItem, ContextMenuItem, ContextMenuItems, RowPosition } from '../enum';import { ItemModel, ClickEventArgs, BeforeOpenCloseMenuEventArgs, MenuEventArgs } from '@syncfusion/ej2-navigations';import { PageSettings } from '../models/page-settings';import { PageSettingsModel } from '../models/page-settings-model';import { AggregateRow } from '../models/summary';import { AggregateRowModel } from '../models/summary-model';import { ExcelExport } from '../actions/excel-export';import { PdfExport } from '../actions/pdf-export';import { Toolbar } from '../actions/toolbar';import { Page } from '../actions/page';import { ContextMenu } from '../actions/context-menu';import { EditSettings } from '../models/edit-settings';import { EditSettingsModel } from '../models/edit-settings-model';import { Edit} from '../actions/edit';import { SortSettings } from '../models/sort-settings';import { SortSettingsModel } from '../models/sort-settings-model';
import {ComponentModel} from '@syncfusion/ej2-base';

/**
 * Interface for a class TreeGrid
 */
export interface TreeGridModel extends ComponentModel{

    /**
   * Defines the schema of dataSource. 
   * If the `columns` declaration is empty or undefined then the `columns` are automatically generated from data source.     
   * @default []
   */
    columns?: ColumnModel[] | string[] | Column[];

    /**
   * Specifies the mapping property path for sub tasks in data source
   * @default null
   */
    childMapping?: string;

    /**
   * Specifies whether record is parent or not for the remote data binding
   * @default null
   */
    hasChildMapping?: string;

    /**
   * Specifies the index of the column that needs to have the expander button.
   * @default 0
   */
    treeColumnIndex?: number;

    /**
   * Specifies the name of the field in the dataSource, which contains the id of that row.
   * @default null
   */
    idMapping?: string;

    /**
   * Specifies the name of the field in the dataSource, which contains the parent’s id
   * @default null
   */
    parentIdMapping?: string;

    /**
   * Specifies whether to load all the rows in collapsed state when the TreeGrid is rendered for the first time.
   * @default false
   */
    enableCollapseAll?: boolean;

    /**
   * Specifies the mapping property path for the expand status of a record in data source.
   * @default null
   */
    expandStateMapping?: string;

    /**
   * Specifies the mapping property path for the expand status of a record in data source
   * @default false
   */
    allowRowDragAndDrop?: boolean;

    /**
   * It is used to render TreeGrid table rows.
   * @default []
   * @isGenericType true
   * @isDataSource true
   */
    dataSource?: Object | DataManager;

    /**
   * Defines the external [`Query`](../../data/query/) 
   * that will be executed along with data processing.    
   * @default null    
   */
    query?: Query;

    /**
  * @hidden
  */
    cloneQuery?: Query;

    /**
  * Defines the print modes. The available print modes are   
  * * `AllPages`: Prints all pages of the TreeGrid. 
  * * `CurrentPage`: Prints the current page of the TreeGrid.
  * @default Syncfusion.EJ2.Grids.PrintMode.AllPages
  * @isEnumeration true
  * @aspType Syncfusion.EJ2.Grids.PrintMode
  * @blazorType Syncfusion.EJ2.Blazor.Grids.PrintMode
  */
    printMode?: PrintMode;

    /**
   * If `allowPaging` is set to true, pager renders.
   * @default false
   */
    allowPaging?: boolean;

    /**
   * If `loadChildOnDemand` is enabled, parent records are render in expanded state.
   * @default false
   */
    loadChildOnDemand?: boolean;

    /**
 * If `allowTextWrap` set to true,  
 * then text content will wrap to the next line when its text content exceeds the width of the Column Cells. 
 * @default false     
 */
    allowTextWrap?: boolean;

    /**
  * Configures the text wrap in the TreeGrid.  
  * @default {wrapMode:"Both"}     
  */
    textWrapSettings?: TextWrapSettingsModel;

    /**
  * If `allowReordering` is set to true, TreeGrid columns can be reordered. 
  * Reordering can be done by drag and drop of a particular column from one index to another index.  
  * > If TreeGrid is rendered with stacked headers, reordering is allowed only at the same level as the column headers.
  * @default false    
  */
    allowReordering?: boolean;

    /**
 * If `allowResizing` is set to true, TreeGrid columns can be resized.      
 * @default false    
 */
    allowResizing?: boolean;

    /**
 * If `autoCheckHierarchy` is set to true, hierarchy checkbox selection has been enabled in TreeGrid.      
 * @default false    
 */
    autoCheckHierarchy?: boolean;

    /**
   * Configures the pager in the TreeGrid.  
   * @default {currentPage: 1, pageSize: 12, pageCount: 8, enableQueryString: false, pageSizes: false, template: null}     
   */
    pageSettings?: PageSettingsModel;

    /**
 * Configures the row drop settings of the TreeGrid.
 */
    rowDropSettings?: RowDropSettingsModel;

    /**
 * @hidden
 * It used to render pager template
 * @default null
 */
    pagerTemplate?: string;

    /**
   * If `showColumnMenu` set to true, then it will enable the column menu options in each columns.
   * 
   * > Check the [`Column menu`](./columns.html#column-menu) for its configuration.
   * @default false    
   */
    showColumnMenu?: boolean;

    /**
   * If `allowSorting` is set to true, it allows sorting of treegrid records when column header is clicked.
   * @default false
   */
    allowSorting?: boolean;

    /**
   * If `allowMultiSorting` set to true, then it will allow the user to sort multiple column in the treegrid.
   * > `allowSorting` should be true.
   * @default true
   */
    allowMultiSorting?: boolean;

    /**
   * Configures the sort settings of the TreeGrid.
   * @default {columns:[]}
   */
    sortSettings?: SortSettingsModel;

    /**
   * Configures the TreeGrid aggregate rows.
   * > Check the [`Aggregates`](./aggregates.html) for its configuration.
   * @default []
   */
    aggregates?: AggregateRowModel[];

    /**
     * Configures the edit settings. 
     * @default { allowAdding: false, allowEditing: false, allowDeleting: false, mode:'Normal',
     * allowEditOnDblClick: true, showConfirmDialog: true, showDeleteConfirmDialog: false }    
     */
    editSettings?: EditSettingsModel;

    /**
   * If `allowFiltering` is set to true, pager renders.
   * @default false
   */
    allowFiltering?: boolean;

    /**
   * The detail template allows you to show or hide additional information about a particular row.
   *
   * > It accepts either the [template string](../../common/template-engine/) or the HTML element ID.
   *
   */
    detailTemplate?: string;

    /**
   * Configures the filter settings of the TreeGrid.
   * @default {columns: [], type: 'FilterBar', mode: 'Immediate', showFilterBarStatus: true, immediateModeDelay: 1500 , operators: {}}
   */
    filterSettings?: FilterSettingsModel;

    /**
   * Configures the search settings of the TreeGrid.
   * @default {search: [] , operators: {}}
   */
    searchSettings?: SearchSettingsModel;

    /**
     * `toolbar` defines the ToolBar items of the TreeGrid. 
     * It contains built-in and custom toolbar items. 
     * If a string value is assigned to the `toolbar` option, it is considered as the template for the whole TreeGrid ToolBar. 
     * If an array value is assigned, it is considered as the list of built-in and custom toolbar items in the TreeGrid's Toolbar. 
     * <br><br>     
     * The available built-in ToolBar items are:
     * * Search: Searches records by the given key.
     * * ExpandAll: Expands all the rows in TreeGrid
     * * CollapseAll: Collapses all the rows in TreeGrid
     * * ExcelExport - Export the TreeGrid to Excel(excelExport() method manually to make export.)
     * * PdfExport - Export the TreeGrid to PDF(pdfExport() method manually to make export.)
     * * CsvExport - Export the TreeGrid to CSV(csvExport() method manually to make export.)<br><br>
     * The following code example implements the custom toolbar items.
     * @default null
     */
    toolbar?: (ToolbarItems | string| ItemModel | ToolbarItem)[];

    /**
     * @hidden
     * It used to render toolbar template
     * @default null
     */
    toolbarTemplate?: string;

    /**
   * Defines the mode of TreeGrid lines. The available modes are, 
   * * `Both`: Displays both horizontal and vertical TreeGrid lines. 
   * * `None`: No TreeGrid lines are displayed.
   * * `Horizontal`: Displays the horizontal TreeGrid lines only. 
   * * `Vertical`: Displays the vertical TreeGrid lines only.
   * * `Default`: Displays TreeGrid lines based on the theme.
   * @default Syncfusion.EJ2.Grids.GridLine.Default
   * @isEnumeration true
   * @aspType Syncfusion.EJ2.Grids.GridLine
   * @blazorType Syncfusion.EJ2.Blazor.Grids.GridLine
   */
    gridLines?: GridLine;

    /**
     * `contextMenuItems` defines both built-in and custom context menu items.
     * <br><br> 
     * The available built-in items are,  
     * * `AutoFitAll` - Auto fit the size of all columns.  
     * * `AutoFit` - Auto fit the current column.
     * * `Edit` - Edit the current record.
     * * `Delete` - Delete the current record.
     * * `Save` - Save the edited record.
     * * `Cancel` - Cancel the edited state.
     * * `PdfExport` - Export the grid as Pdf format.
     * * `ExcelExport` - Export the grid as Excel format.
     * * `CsvExport` - Export the grid as CSV format.
     * * `SortAscending` - Sort the current column in ascending order.
     * * `SortDescending` - Sort the current column in descending order.
     * * `FirstPage` - Go to the first page.
     * * `PrevPage` - Go to the previous page.
     * * `LastPage` - Go to the last page.
     * * `NextPage` - Go to the next page.
     * 
     * @default null
     */
    contextMenuItems?: ContextMenuItem[] | ContextMenuItemModel[];

    /**
     * `columnMenuItems` defines both built-in and custom column menu items.
     * <br><br> 
     * The available built-in items are,
     * * `AutoFitAll` - Auto fit the size of all columns. 
     * * `AutoFit` - Auto fit the current column.
     * * `SortAscending` - Sort the current column in ascending order.
     * * `SortDescending` - Sort the current column in descending order.
     * * `Filter` - Filter options will show based on filterSettings property like filterbar, menu filter.
     * @default null
     */
    columnMenuItems?: ColumnMenuItem[] | ColumnMenuItemModel[];

    /**
     * The row template that renders customized rows from the given template. 
     * By default, TreeGrid renders a table row for every data source item.
     * > * It accepts either [template string](../../common/template-engine.html) or HTML element ID.   
     * > * The row template must be a table row.  
     * 
     * > Check the [`Row Template`](../../treegrid/row) customization.
     */
    rowTemplate?: string;

    /**
   * Defines the height of TreeGrid rows.
   * @default null
   */
    rowHeight?: number;

    /**
   * If `enableAltRow` is set to true, the TreeGrid will render with `e-altrow` CSS class to the alternative tr elements.    
   * > Check the [`AltRow`](./row.html#styling-alternate-rows) to customize the styles of alternative rows.
   * @default true 
   */
    enableAltRow?: boolean;

    /**
   * Enables or disables the key board interaction of TreeGrid.          
   * @hidden 
   * @default true     
   */
    allowKeyboard?: boolean;

    /**
   * If `enableHover` is set to true, the row hover is enabled in the TreeGrid.
   * @default false 
   */
    enableHover?: boolean;

    /**
   * Defines the scrollable height of the TreeGrid content.    
   * @default 'auto'    
   */
    height?: string | number;

    /**
   * Defines the TreeGrid width.    
   * @default 'auto'    
   */
    width?: string | number;

    /**
   * If `enableVirtualization` set to true, then the TreeGrid will render only the rows visible within the view-port
   * and load subsequent rows on vertical scrolling. This helps to load large dataset in TreeGrid.
   * @default false
   */
    enableVirtualization?: boolean;

    /**
     * `columnQueryMode`provides options to retrieves data from the data source.Their types are 
     * * `All`: It retrieves whole data source.
     * * `Schema`: retrieves data for all the defined columns in TreeGrid from the data source. 
     * * `ExcludeHidden`: retrieves data only for visible columns of TreeGrid from the data Source. 
     * @default All
     */
    columnQueryMode?: ColumnQueryModeType;

    /**
   * Triggers when the component is created.
   * @event
   * @blazorproperty 'Created'
   */
    created?: EmitType<Object>;

    /**
   * This event allows customization of TreeGrid properties before rendering.
   * @event
   * @blazorproperty 'OnLoad'
   */
    load?: EmitType<Object>;

    /**
   * Triggers while expanding the TreeGrid record
   * @event
   * @blazorproperty 'Expanding'
   */
    expanding?: EmitType<RowExpandingEventArgs>;

    /**
   * Triggers after expand the record
   * @event
   * @blazorproperty 'Expanded'
   */
    expanded?: EmitType<RowExpandedEventArgs>;

    /**
   * Triggers while collapsing the TreeGrid record
   * @event
   * @blazorproperty 'Collapsing'
   */
    collapsing?: EmitType<RowExpandingEventArgs>;

    /**
   * Triggers after collapse the TreeGrid record
   * @event
   * @blazorproperty 'Collapsed'
   */
    collapsed?: EmitType<RowExpandingEventArgs>;

    /**
   * Triggers when cell is saved.
   * @event
   * @blazorproperty 'OnCellSave'
   * @blazorType Syncfusion.EJ2.Blazor.Grids.CellSaveArgs<TValue>
   */
    cellSave?: EmitType<CellSaveArgs>;

    /**
   * Triggers when TreeGrid actions such as sorting, filtering, paging etc., starts.
   * @event
   * @blazorproperty 'OnActionBegin'
   * @blazorType Syncfusion.EJ2.Blazor.Grids.ActionEventArgs<TValue>
   */
    actionBegin?: EmitType<PageEventArgs | FilterEventArgs | SortEventArgs | SearchEventArgs | AddEventArgs | SaveEventArgs | EditEventArgs | DeleteEventArgs>;

    /**
   * Triggers when TreeGrid actions such as sorting, filtering, paging etc. are completed.
   * @event
   * @blazorproperty 'OnActionComplete'
   * @blazorType Syncfusion.EJ2.Blazor.Grids.ActionEventArgs<TValue>
   */

    actionComplete?: EmitType<PageEventArgs | FilterEventArgs | SortEventArgs| SearchEventArgs | AddEventArgs | SaveEventArgs | EditEventArgs | DeleteEventArgs | CellSaveEventArgs>;

    /**
   * Triggers before the record is to be edit.
   * @event
   * @blazorproperty 'OnBeginEdit'
   * @blazorType Syncfusion.EJ2.Blazor.Grids.BeginEditArgs<TValue>
   */
    beginEdit?: EmitType<BeginEditArgs>;

    /**
   * Triggers when the cell is being edited.
   * @event
   * @blazorproperty 'OnCellEdit'
   * @blazorType Syncfusion.EJ2.Blazor.Grids.CellEditArgs<TValue>
   */
    cellEdit?: EmitType<CellEditArgs>;

    /**
   * Triggers when any TreeGrid action failed to achieve the desired results.
   * @event
   * @blazorproperty 'OnActionFailure'
   * @blazorType Syncfusion.EJ2.Blazor.Grids.FailureEventArgs
   */
    actionFailure?: EmitType<FailureEventArgs>;

    /**
   * Triggers when data source is populated in the TreeGrid.
   * @event
   * @blazorproperty 'DataBound'
   */
    dataBound?: EmitType<Object>;

    /**
   * Triggers when the TreeGrid data is added, deleted and updated.
   * Invoke the done method from the argument to start render after edit operation.
   * @event
   * @deprecated
   * @blazorProperty 'dataSourceUpdated'
   * @blazorType Syncfusion.EJ2.Blazor.Grids.DataSourceChangedEventArgs
   */
    dataSourceChanged?: EmitType<DataSourceChangedEventArgs>;

    /**
   * Triggers when the TreeGrid actions such as Sorting, Paging etc., are done.
   * In this event,the current view data and total record count should be assigned to the `dataSource` based on the action performed.
   * @event
   * @deprecated
   * @blazorType Syncfusion.EJ2.Blazor.Grids.DataStateChangeEventArgs
   */
    dataStateChange?: EmitType<DataStateChangeEventArgs>;

    /**
   * Triggers when record is double clicked.
   * @event
   * @blazorproperty 'OnRecordDoubleClick'
   * @blazorType Syncfusion.EJ2.Blazor.Grids.RecordDoubleClickEventArgs<TValue>
   */
    recordDoubleClick?: EmitType<RecordDoubleClickEventArgs>;

    /**
   * Triggered every time a request is made to access row information, element, or data.
   * This will be triggered before the row element is appended to the TreeGrid element.
   * @event
   * @blazorproperty 'RowDataBound'
   * @blazorType Syncfusion.EJ2.Blazor.Grids.RowDataBoundEventArgs<TValue>
   */
    rowDataBound?: EmitType<RowDataBoundEventArgs>;

    /**
   * Triggers after detail row expands.
   * > This event triggers at initial expand.  
   * @event
   * @blazorproperty 'DetailDataBound'
   * @blazorType Syncfusion.EJ2.Blazor.Grids.DetailDataBoundEventArgs<TValue>
   */
    detailDataBound?: EmitType<DetailDataBoundEventArgs>;

    /**
   * Triggered every time a request is made to access cell information, element, or data.
   * This will be triggered before the cell element is appended to the TreeGrid element.
   * @event
   * @blazorproperty 'QueryCellInfo'
   * @blazorType Syncfusion.EJ2.Blazor.Grids.QueryCellInfoEventArgs<TValue>
   */
    queryCellInfo?: EmitType<QueryCellInfoEventArgs>;

    /**
   * If `allowSelection` is set to true, it allows selection of (highlight row) TreeGrid records by clicking it.  
   * @default true
   */
    allowSelection?: boolean;

    /**
     * Triggers before row selection occurs.
     * @event
     * @blazorproperty 'RowSelecting'
     * @blazorType Syncfusion.EJ2.Blazor.Grids.RowSelectingEventArgs<TValue>
     */
    rowSelecting?: EmitType<RowSelectingEventArgs>;

    /**
     * Triggers after a row is selected.
     * @event
     * @blazorproperty 'RowSelected'
     * @blazorType Syncfusion.EJ2.Blazor.Grids.RowSelectEventArgs<TValue>
     */
    rowSelected?: EmitType<RowSelectEventArgs>;

    /**
     * Triggers before deselecting the selected row.
     * @event
     * @deprecated
     * @blazorType Syncfusion.EJ2.Blazor.Grids.RowDeselectEventArgs<TValue>
     */
    rowDeselecting?: EmitType<RowDeselectEventArgs>;

    /**
     * Triggers when a selected row is deselected.
     * @event
     * @blazorproperty 'RowDeselected'
     * @blazorType Syncfusion.EJ2.Blazor.Grids.RowDeselectEventArgs<TValue>
     */
    rowDeselected?: EmitType<RowDeselectEventArgs>;

    /**
     * Triggered for stacked header.
     * @event
     * @blazorproperty 'HeaderCellInfo'
     * @blazorType Syncfusion.EJ2.Blazor.Grids.HeaderCellInfoEventArgs 
     */
    headerCellInfo?: EmitType<HeaderCellInfoEventArgs>;

    /**
       * Triggers before any cell selection occurs.
       * @event
       * @blazorproperty 'CellSelecting'
       * @blazorType Syncfusion.EJ2.Blazor.Grids.CellSelectingEventArgs<TValue>
       */
    cellSelecting?: EmitType<CellSelectingEventArgs>;

    /**
     * Triggers before column menu opens.
     * @event
     * @deprecated
     * @blazorType Syncfusion.EJ2.Blazor.Grids.ColumnMenuOpenEventArgs
     */
    columnMenuOpen?: EmitType<ColumnMenuOpenEventArgs>;

    /**
     * Triggers when click on column menu.
     * @event
     * @blazorproperty 'ColumnMenuItemClicked'
     * @blazorType Syncfusion.EJ2.Blazor.Navigations.MenuEventArgs
     */
    columnMenuClick?: EmitType<MenuEventArgs>;

    /**
     * Triggers after a cell is selected.
     * @event 
     * @blazorproperty 'CellSelected'
     * @blazorType Syncfusion.EJ2.Blazor.Grids.CellSelectEventArgs<TValue>
     */
    cellSelected?: EmitType<CellSelectEventArgs>;

    /**
     * Triggers before the selected cell is deselecting.
     * @event 
     * @deprecated
     * @blazorType Syncfusion.EJ2.Blazor.Grids.CellDeselectEventArgs
     */
    cellDeselecting?: EmitType<CellDeselectEventArgs>;

    /**
   * Triggers when a particular selected cell is deselected.
   * @event 
   * @deprecated
   * @blazorType Syncfusion.EJ2.Blazor.Grids.CellDeselectEventArgs
   */
    cellDeselected?: EmitType<CellDeselectEventArgs>;

    /**
   * Triggers when column resize starts.
   * @event
   * @deprecated
   */
    resizeStart?: EmitType<ResizeArgs>;

    /**
   * Triggers on column resizing.
   * @event
   * @deprecated
   */
    resizing?: EmitType<ResizeArgs>;

    /**
   * Triggers when column resize ends.
   * @event
   * @deprecated
   */
    resizeStop?: EmitType<ResizeArgs>;

    /**
   * Triggers when column header element drag (move) starts. 
   * @event  
   * @deprecated
   * @blazorType Syncfusion.EJ2.Blazor.Grids.ColumnDragEventArgs
   */
    columnDragStart?: EmitType<ColumnDragEventArgs>;

    /**
   * Triggers when column header element is dragged (moved) continuously. 
   * @event  
   * @deprecated
   * @blazorType Syncfusion.EJ2.Blazor.Grids.ColumnDragEventArgs
   */
    columnDrag?: EmitType<ColumnDragEventArgs>;

    /**
  * Triggers when a column header element is dropped on the target column. 
  * @event  
  * @deprecated
  * @blazorType Syncfusion.EJ2.Blazor.Grids.ColumnDragEventArgs
  */
    columnDrop?: EmitType<ColumnDragEventArgs>;

    /**
   * Triggers when the check box state change in checkbox column.
   * @event
   * @deprecated
   */
    checkboxChange?: EmitType<CheckBoxChangeEventArgs>;

    /**
  * Triggers after print action is completed.  
  * @event 
  * @deprecated
  * @blazorType Syncfusion.EJ2.Blazor.Grids.PrintEventArgs
  */
    printComplete?: EmitType<PrintEventArgs>;

    /**
  * Triggers before the print action starts.  
  * @event 
  * @deprecated
  * @blazorType Syncfusion.EJ2.Blazor.Grids.PrintEventArgs
  */
    beforePrint?: EmitType<PrintEventArgs>;

    /**
   * Triggers when toolbar item is clicked.
   * @event
   * @blazorproperty 'OnToolbarClick'
   * @blazorType Syncfusion.EJ2.Blazor.Navigations.ClickEventArgs
   */
    toolbarClick?: EmitType<ClickEventArgs>;

    /**
   * Triggers when a particular selected cell is deselected.
   * @event 
   * @blazorproperty 'OnDataBound'
   * @blazorType Syncfusion.EJ2.Blazor.Grids.BeforeDataBoundArgs<TValue>
   */
    beforeDataBound?: EmitType<BeforeDataBoundArgs>;

    /**
   * Triggers before context menu opens.
   * @event
   * @deprecated
   * @blazorType Syncfusion.EJ2.Blazor.Navigations.BeforeOpenCloseMenuEventArgs
   */
    contextMenuOpen?: EmitType<BeforeOpenCloseMenuEventArgs>;

    /**
   * Triggers when click on context menu.
   * @event
   * @blazorproperty 'ContextMenuItemClicked'
   * @blazorType Syncfusion.EJ2.Blazor.Navigations.MenuEventArgs
   */
    contextMenuClick?: EmitType<MenuEventArgs>;

    /**
   * Triggers when row elements are dragged (moved) continuously.
   * @event
   * @deprecated
   */
    rowDrag?: EmitType<RowDragEventArgs>;

    /**
   * Triggers when row element’s drag(move) starts.
   * @event
   * @deprecated
   */
    rowDragStart?: EmitType<RowDragEventArgs>;

    /**
   * Triggers when row element’s before drag(move).
   * @event
   * @deprecated
   */
    rowDragStartHelper?: EmitType<RowDragEventArgs>;

    /**
   * Triggers when row elements are dropped on the target row.
   * @event
   * @deprecated
   */
    rowDrop?: EmitType<RowDragEventArgs>;

    /**
   * The `selectedRowIndex` allows you to select a row at initial rendering. 
   * You can also get the currently selected row index.
   * @default -1
   */
    selectedRowIndex?: number;

    /**
   * Configures the selection settings.
   * @default {mode: 'Row', cellSelectionMode: 'Flow', type: 'Single'}
   */
    selectionSettings?: SelectionSettingsModel;

    /**
   * If `allowExcelExport` set to true, then it will allow the user to export treegrid to Excel file.
   * 
   * > Check the [`ExcelExport`](./excel-exporting.html) to configure exporting document.
   * @default false    
   */
    allowExcelExport?: boolean;

    /**
   * If `allowPdfExport` set to true, then it will allow the user to export treegrid to Pdf file.
   * 
   * > Check the [`Pdfexport`](./pdf-exporting.html) to configure the exporting document.
   * @default false    
   */
    allowPdfExport?: boolean;

    /**
     * Triggers before exporting each cell to PDF document. 
     * You can also customize the PDF cells.
     * @event 
     * @deprecated
     * @blazorType Syncfusion.EJ2.Blazor.Grids.PdfQueryCellInfoEventArgs
     */
    pdfQueryCellInfo?: EmitType<PdfQueryCellInfoEventArgs>;

    /**
 * Triggers before exporting each header cell to PDF document. 
 * You can also customize the PDF cells.
 * @event 
 * @deprecated
 * @blazorType Syncfusion.EJ2.Blazor.Grids.PdfHeaderQueryCellInfoEventArgs
 */
    pdfHeaderQueryCellInfo?: EmitType<PdfHeaderQueryCellInfoEventArgs>;

    /**
 * Triggers before exporting each cell to Excel file.
 * You can also customize the Excel cells.
 * @event
 * @deprecated
 * @blazorType Syncfusion.EJ2.Blazor.Grids.ExcelQueryCellInfoEventArgs
 */
    excelQueryCellInfo?: EmitType<ExcelQueryCellInfoEventArgs>;

    /**
 * Triggers before exporting each header cell to Excel file.
 * You can also customize the Excel cells.
 * @event
 * @deprecated
 * @blazorType Syncfusion.EJ2.Blazor.Grids.ExcelHeaderQueryCellInfoEventArgs
 */
    excelHeaderQueryCellInfo?: EmitType<ExcelHeaderQueryCellInfoEventArgs>;

    /**
 * Triggers before TreeGrid data is exported to Excel file.
 * @event
 * @blazorproperty 'OnExcelExport'
 */
    beforeExcelExport?: EmitType<Object>;

    /**
 * Triggers after TreeGrid data is exported to Excel file.
 * @event
 * @deprecated
 * @blazorType Syncfusion.EJ2.Blazor.Grids.ExcelExportCompleteArgs
 */
    excelExportComplete?: EmitType<ExcelExportCompleteArgs>;

    /**
 * Triggers before TreeGrid data is exported to PDF document.
 * @event
 * @blazorproperty 'OnPdfExport'
 */
    beforePdfExport?: EmitType<Object>;

    /**
 * Triggers after TreeGrid data is exported to PDF document.
 * @event
 * @deprecated
 * @blazorType Syncfusion.EJ2.Blazor.Grids.PdfExportCompleteArgs
 */
    pdfExportComplete?: EmitType<PdfExportCompleteArgs>;

}