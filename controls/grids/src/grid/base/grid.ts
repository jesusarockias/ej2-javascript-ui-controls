import { Component, ModuleDeclaration, ChildProperty, Browser, closest, extend } from '@syncfusion/ej2-base';
import { isNullOrUndefined, setValue, getValue, isBlazor, blazorTemplates } from '@syncfusion/ej2-base';
import { addClass, removeClass, append, remove, updateBlazorTemplate, classList, setStyleAttribute } from '@syncfusion/ej2-base';
import { Property, Collection, Complex, Event, NotifyPropertyChanges, INotifyPropertyChanged, L10n } from '@syncfusion/ej2-base';
import { EventHandler, KeyboardEvents, KeyboardEventArgs as KeyArg, EmitType } from '@syncfusion/ej2-base';
import { Query, DataManager, DataUtil } from '@syncfusion/ej2-data';
import { ItemModel, ClickEventArgs } from '@syncfusion/ej2-navigations';
import { createSpinner, hideSpinner, showSpinner, Tooltip } from '@syncfusion/ej2-popups';
import { GridModel } from './grid-model';
import { iterateArrayOrObject, prepareColumns, parentsUntil, wrap, templateCompiler, isGroupAdaptive, refreshForeignData } from './util';
import { getRowHeight, setColumnIndex } from './util';
import * as events from '../base/constant';
import { ReturnType } from '../base/type';
import { IDialogUI, ScrollPositionType } from './interface';
import { IRenderer, IValueFormatter, IFilterOperator, IIndex, RowDataBoundEventArgs, QueryCellInfoEventArgs } from './interface';
import { CellDeselectEventArgs, CellSelectEventArgs, CellSelectingEventArgs, ParentDetails, ContextMenuItemModel } from './interface';
import { PdfQueryCellInfoEventArgs, ExcelQueryCellInfoEventArgs, ExcelExportProperties, PdfExportProperties } from './interface';
import { PdfHeaderQueryCellInfoEventArgs, ExcelHeaderQueryCellInfoEventArgs, ExportDetailDataBoundEventArgs } from './interface';
import { ColumnMenuOpenEventArgs, BatchCancelArgs, RecordDoubleClickEventArgs, DataResult, PendingState } from './interface';
import { HeaderCellInfoEventArgs, KeyboardEventArgs} from './interface';
import { FailureEventArgs, FilterEventArgs, ColumnDragEventArgs, GroupEventArgs, PrintEventArgs, ICustomOptr } from './interface';
import { RowDeselectEventArgs, RowSelectEventArgs, RowSelectingEventArgs, PageEventArgs, RowDragEventArgs } from './interface';
import { BeforeBatchAddArgs, BeforeBatchDeleteArgs, BeforeBatchSaveArgs, ResizeArgs, ColumnMenuItemModel, NotifyArgs } from './interface';
import { BatchAddArgs, BatchDeleteArgs, BeginEditArgs, CellEditArgs, CellSaveArgs, BeforeDataBoundArgs, RowInfo } from './interface';
import { DetailDataBoundEventArgs, ColumnChooserEventArgs, AddEventArgs, SaveEventArgs, EditEventArgs, DeleteEventArgs } from './interface';
import { ExcelExportCompleteArgs, PdfExportCompleteArgs, DataStateChangeEventArgs, DataSourceChangedEventArgs } from './interface';
import { SearchEventArgs, SortEventArgs, ISelectedCell, EJ2Intance, BeforeCopyEventArgs} from './interface';
import {BeforePasteEventArgs, CheckBoxChangeEventArgs, CommandClickEventArgs } from './interface';
import { Render } from '../renderer/render';
import { Column, ColumnModel, ActionEventArgs } from '../models/column';
import { Action, SelectionType, GridLine, RenderType, SortDirection, SelectionMode, PrintMode, FilterType, FilterBarMode } from './enum';
import { CheckboxSelectionType, HierarchyGridPrintMode, NewRowPosition } from './enum';
import { WrapMode, ToolbarItems, ContextMenuItem, ColumnMenuItem, ToolbarItem, CellSelectionMode, EditMode } from './enum';
import { ColumnQueryModeType } from './enum';
import { Data } from '../actions/data';
import { Cell } from '../models/cell';
import { RowRenderer } from '../renderer/row-renderer';
import { CellRenderer } from '../renderer/cell-renderer';
import { CellRendererFactory } from '../services/cell-render-factory';
import { ServiceLocator } from '../services/service-locator';
import { ValueFormatter } from '../services/value-formatter';
import { RendererFactory } from '../services/renderer-factory';
import { ColumnWidthService } from '../services/width-controller';
import { AriaService } from '../services/aria-service';
import { FocusStrategy } from '../services/focus-strategy';
import { SortSettingsModel, SelectionSettingsModel, FilterSettingsModel, SearchSettingsModel, EditSettingsModel } from './grid-model';
import { SortDescriptorModel, PredicateModel, RowDropSettingsModel, GroupSettingsModel, TextWrapSettingsModel } from './grid-model';
import { PageSettingsModel, AggregateRowModel } from '../models/models';
import { PageSettings } from '../models/page-settings';
import { Sort } from '../actions/sort';
import { Page } from '../actions/page';
import { Selection } from '../actions/selection';
import { Filter } from '../actions/filter';
import { Search } from '../actions/search';
import { Resize } from '../actions/resize';
import { Reorder } from '../actions/reorder';
import { RowDD } from '../actions/row-reorder';
import { ShowHide } from '../actions/show-hide';
import { Scroll } from '../actions/scroll';
import { Group } from '../actions/group';
import { Print } from '../actions/print';
import { DetailRow } from '../actions/detail-row';
import { Toolbar } from '../actions/toolbar';
import { AggregateRow } from '../models/aggregate';
import { Edit } from '../actions/edit';
import { Row } from '../models/row';
import { ColumnChooser } from '../actions/column-chooser';
import { ExcelExport } from '../actions/excel-export';
import { PdfExport } from '../actions/pdf-export';
import { Clipboard } from '../actions/clipboard';
import { CommandColumn } from '../actions/command-column';
import { ContextMenu } from '../actions/context-menu';
import { BeforeOpenCloseMenuEventArgs, MenuEventArgs } from '@syncfusion/ej2-navigations';
import { ColumnMenu } from '../actions/column-menu';
import { CheckState } from './enum';
import { Aggregate } from '../actions/aggregate';
import { ILogger } from '../actions/logger';

/** 
 * Represents the field name and direction of sort column. 
 */
export class SortDescriptor extends ChildProperty<SortDescriptor> {
    /** 
     * Defines the field name of sort column. 
     * @default ''
     */
    @Property()
    public field: string;

    /** 
     * Defines the direction of sort column. 
     * @default ''
     * @blazorDefaultValue null
     */
    @Property()
    public direction: SortDirection;

    /** 
     * @hidden
     * Defines the sorted column whether or from grouping operation. 
     * @default false
     */
    @Property(false)
    public isFromGroup: boolean;

}

/** 
 * Configures the sorting behavior of Grid. 
 */
export class SortSettings extends ChildProperty<SortSettings> {
    /** 
     * Specifies the columns to sort at initial rendering of Grid.
     * Also user can get current sorted columns. 
     * @default []
     */
    @Collection<SortDescriptorModel>([], SortDescriptor)
    public columns: SortDescriptorModel[];

    /**
     * If `allowUnsort` set to false the user can not get the grid in unsorted state by clicking the sorted column header.
     * @default true
     */
    @Property(true)
    public allowUnsort: boolean;
}

/**  
 * Represents the predicate for the filter column.  
 */
export class Predicate extends ChildProperty<Predicate> {

    /**  
     * Defines the field name of the filter column.  
     * @default ''
     */
    @Property()
    public field: string;

    /**   
     * Defines the operator to filter records. The available operators and its supported data types are:
     * <table> 
     * <tr> 
     * <td colspan=1 rowspan=1> 
     * Operator<br/></td><td colspan=1 rowspan=1> 
     * Description<br/></td><td colspan=1 rowspan=1> 
     * Supported Types<br/></td></tr> 
     * <tr> 
     * <td colspan=1 rowspan=1> 
     * startswith<br/></td><td colspan=1 rowspan=1> 
     * Checks whether the value begins with the specified value.<br/></td><td colspan=1 rowspan=1> 
     * String<br/></td></tr> 
     * <tr> 
     * <td colspan=1 rowspan=1> 
     * endswith<br/></td><td colspan=1 rowspan=1> 
     * Checks whether the value ends with the specified value.<br/><br/></td><td colspan=1 rowspan=1> 
     * <br/>String<br/></td></tr> 
     * <tr> 
     * <td colspan=1 rowspan=1> 
     * contains<br/></td><td colspan=1 rowspan=1> 
     * Checks whether the value contains the specified value.<br/><br/></td><td colspan=1 rowspan=1> 
     * <br/>String<br/></td></tr> 
     * <tr> 
     * <td colspan=1 rowspan=1> 
     * equal<br/></td><td colspan=1 rowspan=1> 
     * Checks whether the value is equal to the specified value.<br/><br/></td><td colspan=1 rowspan=1> 
     * <br/>String | Number | Boolean | Date<br/></td></tr> 
     * <tr> 
     * <td colspan=1 rowspan=1> 
     * notequal<br/></td><td colspan=1 rowspan=1> 
     * Checks for values that are not equal to the specified value.<br/><br/></td><td colspan=1 rowspan=1> 
     * <br/>String | Number | Boolean | Date<br/></td></tr> 
     * <tr> 
     * <td colspan=1 rowspan=1> 
     * greaterthan<br/></td><td colspan=1 rowspan=1> 
     * Checks whether the value is greater than the specified value.<br/><br/></td><td colspan=1 rowspan=1> 
     * Number | Date<br/></td></tr> 
     * <tr> 
     * <td colspan=1 rowspan=1> 
     * greaterthanorequal<br/></td><td colspan=1 rowspan=1> 
     * Checks whether the value is greater than or equal to the specified value.<br/><br/></td><td colspan=1 rowspan=1> 
     * <br/>Number | Date<br/></td></tr> 
     * <tr> 
     * <td colspan=1 rowspan=1> 
     * lessthan<br/></td><td colspan=1 rowspan=1> 
     * Checks whether the value is less than the specified value.<br/><br/></td><td colspan=1 rowspan=1> 
     * <br/>Number | Date<br/></td></tr> 
     * <tr> 
     * <td colspan=1 rowspan=1> 
     * lessthanorequal<br/></td><td colspan=1 rowspan=1> 
     * Checks whether the value is less than or equal to the specified value.<br/><br/></td><td colspan=1 rowspan=1> 
     * <br/>Number | Date<br/></td></tr> 
     * </table> 
     * @default null
     * @blazorType Syncfusion.EJ2.Blazor.Operator
     * @blazorDefaultValue Syncfusion.EJ2.Blazor.Operator.None
     */
    @Property()
    public operator: string;

    /**  
     * Defines the value used to filter records. 
     * @default ''
     */
    @Property()
    public value: string | number | Date | boolean;

    /**  
     * If match case set to true, then filter records with exact match or else  
     * filter records with case insensitive(uppercase and lowercase letters treated as same).  
     * @default null
     */
    @Property()
    public matchCase: boolean;

    /**
     * If ignoreAccent is set to true, then filter ignores the diacritic characters or accents while filtering.
     * @default false
     */
    @Property()
    public ignoreAccent: boolean;

    /**   
     * Defines the relationship between one filter query and another by using AND or OR predicate.   
     * @default null
     */
    @Property()
    public predicate: string;

    /**  
     * @hidden 
     * Defines the actual filter value for the filter column.  
     */
    @Property({})
    public actualFilterValue: Object;

    /**  
     * @hidden 
     * Defines the actual filter operator for the filter column.  
     */
    @Property({})
    public actualOperator: Object;

    /**
     * @hidden 
     * Defines the type of the filter column.  
     */
    @Property()
    public type: string;

    /**  
     * @hidden 
     * Defines the predicate of filter column.  
     */
    @Property()
    public ejpredicate: Object;

    /**  
     * @hidden 
     * Defines the UID of filter column.  
     */
    @Property()
    public uid: string;

    /**  
     * @hidden 
     * Defines the foreignKey availability in filtered columns.
     */
    @Property()
    public isForeignKey: boolean;

}

/**  
 * Configures the filtering behavior of the Grid.  
 */
export class FilterSettings extends ChildProperty<FilterSettings> {
    /**  
     * Specifies the columns to be filtered at initial rendering of the Grid. You can also get the columns that were currently filtered.
     * @default []
     */
    @Collection<PredicateModel[]>([], Predicate)
    public columns: PredicateModel[];

    /**   
     * Defines options for filtering type. The available options are 
     * * `Menu` - Specifies the filter type as menu. 
     * * `CheckBox` - Specifies the filter type as checkbox.      
     * * `FilterBar` - Specifies the filter type as filterbar.  
     * * `Excel` - Specifies the filter type as checkbox.      
     * @default FilterBar 
     */
    @Property('FilterBar')
    public type: FilterType;

    /**  
     * Defines the filter bar modes. The available options are,
     * * `OnEnter`: Initiates filter operation after Enter key is pressed. 
     * * `Immediate`: Initiates filter operation after a certain time interval. By default, time interval is 1500 ms. 
     * @default OnEnter
     */
    @Property()
    public mode: FilterBarMode;

    /**  
     * Shows or hides the filtered status message on the pager.  
     * @default true
     */
    @Property(true)
    public showFilterBarStatus: boolean;

    /**  
     * Defines the time delay (in milliseconds) in filtering records when the `Immediate` mode of filter bar is set. 
     * @default 1500 
     */
    @Property(1500)
    public immediateModeDelay: number;

    /** 
     * The `operators` is used to override the default operators in filter menu. This should be defined by type wise
     * (string, number, date and boolean). Based on the column type, this customize operator list will render in filter menu.
     * 
     * > Check the [`Filter Menu Operator`](../../grid/how-to/#customizing-filter-menu-operators-list/) customization.
     * @default null
     */
    @Property()
    public operators: ICustomOptr;

    /**
     * If ignoreAccent set to true, then filter ignores the diacritic characters or accents while filtering.
     * 
     * > Check the [`Diacritics`](../../grid/filtering/#diacritics/) filtering.
     * @default false
     */
    @Property(false)
    public ignoreAccent: boolean;

    /**
     * If `enableCaseSensitivity` is set to true then searches grid records with exact match based on the filter
     * operator. It will have no effect on number, boolean and Date fields. 
     * 
     * @default false
     */
    @Property(false)
    public enableCaseSensitivity: boolean;
}


/** 
 * Configures the selection behavior of the Grid. 
 */
export class SelectionSettings extends ChildProperty<SelectionSettings> {
    /**  
     * Grid supports row, cell, and both (row and cell) selection mode. 
     * @default Row
     */
    @Property('Row')
    public mode: SelectionMode;

    /** 
     * The cell selection modes are flow and box. It requires the selection 
     * [`mode`](grid/#mode-selectionmode/) to be either cell or both.
     * * `Flow`: Selects the range of cells between start index and end index that also includes the other cells of the selected rows.
     * * `Box`: Selects the range of cells within the start and end column indexes that includes in between cells of rows within the range.
     * * `BoxWithBorder`: Selects the range of cells as like Box mode with borders.
     * @default Flow
     */
    @Property('Flow')
    public cellSelectionMode: CellSelectionMode;

    /**  
     * Defines options for selection type. They are 
     * * `Single`: Allows selection of only a row or a cell. 
     * * `Multiple`: Allows selection of multiple rows or cells. 
     * @default Single 
     */
    @Property('Single')
    public type: SelectionType;

    /**
     * If 'checkboxOnly' set to true, then the Grid selection is allowed only through checkbox.
     * 
     * > To enable checkboxOnly selection, should specify the column type as`checkbox`.
     * @default false 
     */
    @Property(false)
    public checkboxOnly: boolean;

    /**
     * If 'persistSelection' set to true, then the Grid selection is persisted on all operations.
     * For persisting selection in the Grid, any one of the column should be enabled as a primary key.
     * @default false 
     */
    @Property(false)
    public persistSelection: boolean;

    /**
     * Defines options for checkbox selection Mode. They are 
     * * `Default`: This is the default value of the checkboxMode. In this mode, user can select multiple rows by clicking rows one by one.
     * * `ResetOnRowClick`: In ResetOnRowClick mode, on clicking a row it will reset previously selected row and also multiple
     *  rows can be selected by using CTRL or SHIFT key.
     * @default Default
     */
    @Property('Default')
    public checkboxMode: CheckboxSelectionType;

    /**
     * If 'enableSimpleMultiRowSelection' set to true, then the user can able to perform multiple row selection with single clicks.
     * @default false
     */
    @Property(false)
    public enableSimpleMultiRowSelection: boolean;

    /**
     * If 'enableToggle' set to true, then the user can able to perform toggle for the selected row.
     * @default true
     */
    @Property(true)
    public enableToggle: boolean;
}

/**    
 * Configures the search behavior of the Grid.    
 */
export class SearchSettings extends ChildProperty<SearchSettings> {
    /**     
     * Specifies the collection of fields included in search operation. By default, bounded columns of the Grid are included.  
     * @default []
     */
    @Property([])
    public fields: string[];

    /**    
     * Specifies the key value to search Grid records at initial rendering. 
     * You can also get the current search key.
     * @default ''
     */
    @Property('')
    public key: string;

    /**   
     * Defines the operator to search records. The available operators are:
     * <table> 
     * <tr> 
     * <td colspan=1 rowspan=1> 
     * Operator<br/></td><td colspan=1 rowspan=1> 
     * Description<br/></td></tr> 
     * <tr> 
     * <td colspan=1 rowspan=1> 
     * startswith<br/></td><td colspan=1 rowspan=1> 
     * Checks whether the string begins with the specified string.<br/></td></tr> 
     * <tr> 
     * <td colspan=1 rowspan=1> 
     * endswith<br/></td><td colspan=1 rowspan=1> 
     * Checks whether the string ends with the specified string.<br/></td></tr> 
     * <tr> 
     * <td colspan=1 rowspan=1> 
     * contains<br/></td><td colspan=1 rowspan=1> 
     * Checks whether the string contains the specified string. <br/></td></tr> 
     * <tr> 
     * <td colspan=1 rowspan=1> 
     * equal<br/></td><td colspan=1 rowspan=1> 
     * Checks whether the string is equal to the specified string.<br/></td></tr> 
     * <tr> 
     * <td colspan=1 rowspan=1> 
     * notequal<br/></td><td colspan=1 rowspan=1> 
     * Checks for strings not equal to the specified string. <br/></td></tr> 
     * </table> 
     * @default 'contains'
     * @blazorType Syncfusion.EJ2.Blazor.Operator
     * @blazorDefaultValue Syncfusion.EJ2.Blazor.Operator.Contains
     */
    @Property('contains')
    public operator: string;

    /**  
     * If `ignoreCase` is set to false, searches records that match exactly, else  
     * searches records that are case insensitive(uppercase and lowercase letters treated the same).  
     * @default true 
     */
    @Property(true)
    public ignoreCase: boolean;

    /**
     * If ignoreAccent set to true, then filter ignores the diacritic characters or accents while filtering.
     * 
     * > Check the [`Diacritics`](../../grid/filtering/#diacritics/) filtering.
     * @default false
     */
    @Property(false)
    public ignoreAccent: boolean;

}

/**   
 * Configures the row drop settings of the Grid.   
 */
export class RowDropSettings extends ChildProperty<RowDropSettings> {
    /**   
     * Defines the ID of droppable component on which row drop should occur.   
     * @default null
     */
    @Property()
    public targetID: string;

}

/**   
 * Configures the text wrap settings of the Grid.   
 */
export class TextWrapSettings extends ChildProperty<TextWrapSettings> {
    /**   
     * Defines the `wrapMode` of the Grid. The available modes are: 
     * * `Both`: Wraps both the header and content. 
     * * `Content`: Wraps the header alone.
     * * `Header`: Wraps the content alone. 
     * @default Both
     */
    @Property('Both')
    public wrapMode: WrapMode;

}

/**   
 * Configures the group behavior of the Grid.    
 */
export class GroupSettings extends ChildProperty<GroupSettings> {
    /**   
     * If `showDropArea` is set to true, the group drop area element will be visible at the top of the Grid.     
     * @default true 
     */
    @Property(true)
    public showDropArea: boolean;

    /**   
     * If `showToggleButton` set to true, then the toggle button will be showed in the column headers which can be used to group
     * or ungroup columns by clicking them.
     * @default false   
     */
    @Property(false)
    public showToggleButton: boolean;

    /**   
     * If `showGroupedColumn` is set to false, it hides the grouped column after grouping.  
     * @default false  
     */
    @Property(false)
    public showGroupedColumn: boolean;

    /**   
     * If `showUngroupButton` set to false, then ungroup button is hidden in dropped element.  
     * It can be used to ungroup the grouped column when click on ungroup button. 
     * @default true 
     */
    @Property(true)
    public showUngroupButton: boolean;

    /**
     * If `disablePageWiseAggregates` set to true, then the group aggregate value will
     * be calculated from the whole data instead of paged data and two requests will be made for each page
     * when Grid bound with remote service.
     * @default false
     */
    @Property(false)
    public disablePageWiseAggregates: boolean;

    /**   
     * Specifies the column names to group at initial rendering of the Grid.  
     * You can also get the currently grouped columns.   
     * @default []  
     */
    @Property([])
    public columns: string[];

    /**    
     * The Caption Template allows user to display the string or HTML element in group caption.
     * > It accepts either the
     * [template string](http://ej2.syncfusion.com/documentation/common/template-engine/) or the HTML element ID.
     * @default ''
     */
    @Property()
    public captionTemplate: string;


}


/**   
 * Configures the edit behavior of the Grid.    
 */
export class EditSettings extends ChildProperty<EditSettings> {
    /**   
     * If `allowAdding` is set to true, new records can be added to the Grid.  
     * @default false 
     */
    @Property(false)
    public allowAdding: boolean;

    /**   
     * If `allowEditing` is set to true, values can be updated in the existing record.  
     * @default false 
     */
    @Property(false)
    public allowEditing: boolean;

    /**   
     * If `allowDeleting` is set to true, existing record can be deleted from the Grid.    
     * @default false 
     */
    @Property(false)
    public allowDeleting: boolean;

    /**   
     * Defines the mode to edit. The available editing modes are:
     * * Normal
     * * Dialog
     * * Batch
     * @default Normal 
     */
    @Property('Normal')
    public mode: EditMode;

    /**   
     * If `allowEditOnDblClick` is set to false, Grid will not allow editing of a record on double click. 
     * @default true 
     */
    @Property(true)
    public allowEditOnDblClick: boolean;

    /**   
     * if `showConfirmDialog` is set to false, confirm dialog does not show when batch changes are saved or discarded.
     * @default true 
     */
    @Property(true)
    public showConfirmDialog: boolean;

    /**   
     * If `showDeleteConfirmDialog` is set to true, confirm dialog will show delete action. You can also cancel delete command.
     * @default false 
     */
    @Property(false)
    public showDeleteConfirmDialog: boolean;

    /**
     * Defines the custom edit elements for the dialog template.
     * @default ''
     * @aspType string
     */
    @Property('')
    public template: string | Object;

    /**   
     * Defines the position of adding a new row. The available position are:
     * * Top
     * * Bottom
     * @default Top 
     */
    @Property('Top')
    public newRowPosition: NewRowPosition;

    /**   
     * Defines the dialog params to edit.
     * @default {}
     */
    @Property({})
    public dialog: IDialogUI;

    /**
     * If allowNextRowEdit is set to true, editing is done to next row. By default allowNextRowEdit is set to false.
     * @default false
     */
    @Property(false)
    public allowNextRowEdit: boolean;
}

/**
 * Represents the Grid component. 
 * ```html
 * <div id="grid"></div>
 * <script>
 *  var gridObj = new Grid({ allowPaging: true });
 *  gridObj.appendTo("#grid");
 * </script>
 * ```
 */
@NotifyPropertyChanges
export class Grid extends Component<HTMLElement> implements INotifyPropertyChanged {
    // Internal variables  
    private gridPager: Element;
    private isInitial: boolean;
    public isPreventScrollEvent: boolean = false;
    private columnModel: Column[];
    private rowTemplateFn: Function;
    private editTemplateFn: Function;
    private detailTemplateFn: Function;
    private sortedColumns: string[];
    private footerElement: Element;
    private inViewIndexes: number[] = [];
    private mediaCol: Column[];
    private getShowHideService: ShowHide;
    private mediaColumn: Column[];
    private media: {[key: string]: MediaQueryList} = {};
    /** @hidden */
    public invokedFromMedia: boolean;
    private dataBoundFunction: Function;
    private freezeRefresh: Function = Component.prototype.refresh;
    /** @hidden */
    public recordsCount: number;
    /** @hidden */
    public isVirtualAdaptive: boolean = false;
    /** @hidden */
    public vRows: Row<Column>[] = [];
    /** @hidden */
    public vcRows: Row<Column>[] = [];
    /** @hidden */
    public vGroupOffsets: { [x: number]: number } = {};
    /** @hidden */
    public isInitialLoad: boolean;
    /**
     * @hidden
     */
    public mergeCells: { [key: string]: number };
    /**
     * @hidden
     */
    public checkAllRows: CheckState;
    /**
     * @hidden
     */
    public isCheckBoxSelection: boolean;
    /**
     * @hidden
     */
    public isPersistSelection: boolean;
    /**
     * Gets the currently visible records of the Grid.
     */
    public currentViewData: Object[] = [];
    /** @hidden */
    public parentDetails: ParentDetails;
    /** @hidden */
    public currentAction: Action;
    /** @hidden */
    public isEdit: boolean;
    /** @hidden */
    public commonQuery: Query;
    /** @hidden */
    public scrollPosition: ScrollPositionType;
    /** @hidden */
    public isLastCellPrimaryKey: boolean;
    /** @hidden */
    public filterOperators: IFilterOperator;
    /** @hidden */
    public localeObj: L10n;
    public isSelectedRowIndexUpdating: boolean;
    private defaultLocale: Object;
    private keyConfigs: { [key: string]: string };
    private keyPress: boolean;
    private toolTipObj: Tooltip;
    private prevElement: HTMLElement;
    private stackedColumn: Column;
    /** @hidden */
    public lockcolPositionCount: number = 0;
    /** @hidden */
    public prevPageMoving: boolean = false;
    /** @hidden */
    public pageTemplateChange: boolean = false;

    //Module Declarations
    /**
     * @hidden
     */
    public renderModule: Render;
    /**
     * @hidden
     */
    public headerModule: IRenderer;
    /**
     * @hidden
     */
    public contentModule: IRenderer;
    /**
     * @hidden
     */
    public valueFormatterService: IValueFormatter;
    /**
     * @hidden
     */
    public serviceLocator: ServiceLocator;
    /**
     * @hidden
     */
    public ariaService: AriaService;
    /**
     * The `keyboardModule` is used to manipulate keyboard interactions in the Grid.
     */
    public keyboardModule: KeyboardEvents;
    /**
     * @hidden
     */
    public widthService: ColumnWidthService;

    /**
     * The `rowDragAndDropModule` is used to manipulate row reordering in the Grid.
     */
    public rowDragAndDropModule: RowDD;
    /**
     * The `pagerModule` is used to manipulate paging in the Grid.
     */
    public pagerModule: Page;
    /**
     * The `sortModule` is used to manipulate sorting in the Grid.
     */
    public sortModule: Sort;
    /**
     * The `filterModule` is used to manipulate filtering in the Grid.
     */
    public filterModule: Filter;
    /**
     * The `selectionModule` is used to manipulate selection behavior in the Grid.
     */
    public selectionModule: Selection;
    /**
     * The `showHider` is used to manipulate column's show/hide operation in the Grid.
     */
    public showHider: ShowHide;
    /**
     * The `searchModule` is used to manipulate searching in the Grid.
     */
    public searchModule: Search;
    /**
     * The `scrollModule` is used to manipulate scrolling in the Grid.
     */
    public scrollModule: Scroll;
    /**
     * The `reorderModule` is used to manipulate reordering in the Grid.
     */
    public reorderModule: Reorder;
    /**
     * `resizeModule` is used to manipulate resizing in the Grid.
     * @hidden
     */
    public resizeModule: Resize;
    /**
     * The `groupModule` is used to manipulate grouping behavior in the Grid.
     */
    public groupModule: Group;
    /**
     * The `printModule` is used to handle the printing feature of the Grid.
     */
    public printModule: Print;
    /**
     * The `excelExportModule` is used to handle Excel exporting feature in the Grid.
     */
    public excelExportModule: ExcelExport;
    /**
     * The `pdfExportModule` is used to handle PDF exporting feature in the Grid.
     */
    public pdfExportModule: PdfExport;

    /**
     * `detailRowModule` is used to handle detail rows rendering in the Grid.
     * @hidden
     */
    public detailRowModule: DetailRow;

    /**
     * The `toolbarModule` is used to manipulate ToolBar items and its action in the Grid.
     */
    public toolbarModule: Toolbar;

    /**
     * The `contextMenuModule` is used to handle context menu items and its action in the Grid.
     */
    public contextMenuModule: ContextMenu;

    /**
     * The `columnMenuModule` is used to manipulate column menu items and its action in the Grid.
     */
    public columnMenuModule: ColumnMenu;

    /**
     * The `editModule` is used to handle Grid content manipulation.
     */
    public editModule: Edit;

    /**
     * `clipboardModule` is used to handle Grid copy action.
     */
    public clipboardModule: Clipboard;

    /**
     * `columnchooserModule` is used to dynamically show or hide the Grid columns.
     * @hidden
     */
    public columnChooserModule: ColumnChooser;

    /**
     * The `aggregateModule` is used to manipulate aggregate functionality in the Grid.
     * @hidden
     */
    public aggregateModule: Aggregate;

    private commandColumnModule: CommandColumn;
    private loggerModule: ILogger;
    // enable/disable logger for MVC & Core
    private enableLogger: boolean = true;
    private focusModule: FocusStrategy;

    protected needsID: boolean = true;

    //Grid Options

    /**     
     * Defines the schema of dataSource. 
     * If the `columns` declaration is empty or undefined then the `columns` are automatically generated from data source.     
     * @default []   
     */
    @Property([])
    public columns: Column[] | string[] | ColumnModel[];

    /**     
     * If `enableAltRow` is set to true, the grid will render with `e-altrow` CSS class to the alternative tr elements.    
     * > Check the [`AltRow`](../../grid/row/#styling-alternate-rows/) to customize the styles of alternative rows.
     * @default true 
     */
    @Property(true)
    public enableAltRow: boolean;

    /**     
     * If `enableHover` is set to true, the row hover is enabled in the Grid.
     * @default true     
     */
    @Property(true)
    public enableHover: boolean;

    /**     
     * If `enableAutoFill` is set to true, then the auto fill icon will displayed on cell selection for copy cells.
     * It requires the selection `mode` to be Cell and `cellSelectionMode` to be `Box`.
     * @default false 
     */
    @Property(false)
    public enableAutoFill: boolean;

    /**
     * Enables or disables the key board interaction of Grid.          
     * @hidden 
     * @default true     
     */
    @Property(true)
    public allowKeyboard: boolean;

    /**   
     * If `allowTextWrap` set to true,  
     * then text content will wrap to the next line when its text content exceeds the width of the Column Cells. 
     * @default false     
     */
    @Property(false)
    public allowTextWrap: boolean;

    /**     
     * Configures the text wrap in the Grid.  
     * @default {wrapMode:"Both"}     
     */
    @Complex<TextWrapSettingsModel>({}, TextWrapSettings)
    public textWrapSettings: TextWrapSettingsModel;

    /**    
     * If `allowPaging` is set to true, the pager renders at the footer of the Grid. It is used to handle page navigation in the Grid.
     * 
     * > Check the [`Paging`](../../grid/paging/) to configure the grid pager.
     * @default false     
     */
    @Property(false)
    public allowPaging: boolean;

    /**     
     * Configures the pager in the Grid.  
     * @default {currentPage: 1, pageSize: 12, pageCount: 8, enableQueryString: false, pageSizes: false, template: null}     
     */
    @Complex<PageSettingsModel>({}, PageSettings)
    public pageSettings: PageSettingsModel;

    /**    
     * If `enableVirtualization` set to true, then the Grid will render only the rows visible within the view-port
     * and load subsequent rows on vertical scrolling. This helps to load large dataset in Grid.
     * @default false
     */
    @Property(false)
    public enableVirtualization: boolean;

    /**    
     * If `enableColumnVirtualization` set to true, then the Grid will render only the columns visible within the view-port
     * and load subsequent columns on horizontal scrolling. This helps to load large dataset of columns in Grid.
     * @default false
     */
    @Property(false)
    public enableColumnVirtualization: boolean;


    /**    
     * Configures the search behavior in the Grid. 
     * @default { ignoreCase: true, fields: [], operator: 'contains', key: '' }    
     */
    @Complex<SearchSettingsModel>({}, SearchSettings)
    public searchSettings: SearchSettingsModel;

    /**    
     * If `allowSorting` is set to true, it allows sorting of grid records when column header is clicked.  
     * 
     * > Check the [`Sorting`](../../grid/sorting/) to customize its default behavior.
     * @default false    
     */
    @Property(false)
    public allowSorting: boolean;

    /**
     * If `allowMultiSorting` set to true, then it will allow the user to sort multiple column in the grid.
     * > `allowSorting` should be true.
     * @default false
     */
    @Property(true)
    public allowMultiSorting: boolean;

    /**
     * If `allowExcelExport` set to true, then it will allow the user to export grid to Excel file.
     * 
     * > Check the [`ExcelExport`](../../grid/excel-exporting/) to configure exporting document.
     * @default false    
     */
    @Property(false)
    public allowExcelExport: boolean;
    /**    
     * If `allowPdfExport` set to true, then it will allow the user to export grid to Pdf file.
     * 
     * > Check the [`Pdfexport`](../../grid/pdf-export/) to configure the exporting document.
     * @default false    
     */
    @Property(false)
    public allowPdfExport: boolean;
    /**    
     * Configures the sort settings.  
     * @default {columns:[]}    
     */
    @Complex<SortSettingsModel>({}, SortSettings)
    public sortSettings: SortSettingsModel;

    /**    
     * If `allowSelection` is set to true, it allows selection of (highlight row) Grid records by clicking it.  
     * @default true        
     */
    @Property(true)
    public allowSelection: boolean;

    /**    
     * The `selectedRowIndex` allows you to select a row at initial rendering. 
     * You can also get the currently selected row index.
     * @default -1        
     */
    @Property(-1)
    public selectedRowIndex: number;

    /**    
     * Configures the selection settings.  
     * @default {mode: 'Row', cellSelectionMode: 'Flow', type: 'Single'}    
     */
    @Complex<SelectionSettingsModel>({}, SelectionSettings)
    public selectionSettings: SelectionSettingsModel;

    /**    
     * If `allowFiltering` set to true the filter bar will be displayed. 
     * If set to false the filter bar will not be displayed. 
     * Filter bar allows the user to filter grid records with required criteria.   
     * 
     * > Check the [`Filtering`](../../grid/filtering/) to customize its default behavior.     
     * @default false    
     */
    @Property(false)
    public allowFiltering: boolean;

    /**    
     * If `allowReordering` is set to true, Grid columns can be reordered. 
     * Reordering can be done by drag and drop of a particular column from one index to another index.  
     * > If Grid is rendered with stacked headers, reordering is allowed only at the same level as the column headers.
     * @default false    
     */
    @Property(false)
    public allowReordering: boolean;

    /**    
     * If `allowResizing` is set to true, Grid columns can be resized.      
     * @default false    
     */
    @Property(false)
    public allowResizing: boolean;

    /**    
     * If `allowRowDragAndDrop` is set to true, you can drag and drop grid rows at another grid.    
     * @default false    
     */
    @Property(false)
    public allowRowDragAndDrop: boolean;

    /**   
     * Configures the row drop settings.  
     * @default {targetID: ''}   
     */
    @Complex<RowDropSettingsModel>({}, RowDropSettings)
    public rowDropSettings: RowDropSettingsModel;

    /**    
     * Configures the filter settings of the Grid.  
     * @default {columns: [], type: 'FilterBar', mode: 'Immediate', showFilterBarStatus: true, immediateModeDelay: 1500 , operators: {}}    
     */
    @Complex<FilterSettingsModel>({}, FilterSettings)
    public filterSettings: FilterSettingsModel;

    /**    
     * If `allowGrouping` set to true, then it will allow the user to dynamically group or ungroup columns.  
     * Grouping can be done by drag and drop columns from column header to group drop area. 
     * 
     * > Check the [`Grouping`](../../grid/grouping/) to customize its default behavior.
     * @default false    
     */
    @Property(false)
    public allowGrouping: boolean;

    /**    
     * If `showColumnMenu` set to true, then it will enable the column menu options in each columns.
     * 
     * > Check the [`Column menu`](../../grid/columns/#column-menu/) for its configuration.
     * @default false    
     */
    @Property(false)
    public showColumnMenu: boolean;

    /**    
     * Configures the group settings. 
     * @default {showDropArea: true, showToggleButton: false, showGroupedColumn: false, showUngroupButton: true, columns: []}    
     */
    @Complex<GroupSettingsModel>({}, GroupSettings)
    public groupSettings: GroupSettingsModel;

    /**    
     * Configures the edit settings. 
     * @default { allowAdding: false, allowEditing: false, allowDeleting: false, mode:'Normal',
     * allowEditOnDblClick: true, showConfirmDialog: true, showDeleteConfirmDialog: false }    
     */
    @Complex<EditSettingsModel>({}, EditSettings)
    public editSettings: EditSettingsModel;

    /**
     * Configures the Grid aggregate rows.
     * > Check the [`Aggregates`](../../grid/aggregates/) for its configuration.
     * @default []
     */
    @Collection<AggregateRowModel>([], AggregateRow)
    public aggregates: AggregateRowModel[];

    /**    
     * If `showColumnChooser` is set to true, it allows you to dynamically show or hide columns.  
     * 
     * > Check the [`ColumnChooser`](../../grid/columns/#column-chooser/) for its configuration.
     * @default false    
     */
    @Property(false)
    public showColumnChooser: boolean;

    /**    
     * Defines the scrollable height of the grid content.    
     * @default 'auto'    
     */
    @Property('auto')
    public height: string | number;

    /**    
     * Defines the Grid width.    
     * @default 'auto'    
     */
    @Property('auto')
    public width: string | number;

    /**   
     * Defines the mode of grid lines. The available modes are, 
     * * `Both`: Displays both horizontal and vertical grid lines. 
     * * `None`: No grid lines are displayed.
     * * `Horizontal`: Displays the horizontal grid lines only. 
     * * `Vertical`: Displays the vertical grid lines only.
     * * `Default`: Displays grid lines based on the theme.
     * @default Default
     */
    @Property('Default')
    public gridLines: GridLine;

    /**    
     * The row template that renders customized rows from the given template. 
     * By default, Grid renders a table row for every data source item.
     * > * It accepts either [template string](../../common/template-engine/) or HTML element ID.   
     * > * The row template must be a table row.  
     * 
     * > Check the [`Row Template`](grid/row/) customization.
     */
    @Property()
    public rowTemplate: string;

    /**    
     * The detail template allows you to show or hide additional information about a particular row.
     *  
     * > It accepts either the [template string](../../common/template-engine/) or the HTML element ID.
     * 
     * {% codeBlock src="grid/detail-template-api/index.ts" %}{% endcodeBlock %}
     */
    @Property()
    public detailTemplate: string;

    /**    
     * Defines Grid options to render child Grid. 
     * It requires the [`queryString`](grid/#querystring-string) for parent 
     * and child relationship. 
     * 
     * > Check the [`Child Grid`](../../grid/hierarchy-grid/) for its configuration.
     * @blazorType GridModel<object>
     */
    @Property()
    public childGrid: GridModel;

    /**    
     * Defines the relationship between parent and child datasource. It acts as the foreign key for parent datasource.       
     */
    @Property()
    public queryString: string;

    /**   
     * Defines the print modes. The available print modes are   
     * * `AllPages`: Prints all pages of the Grid. 
     * * `CurrentPage`: Prints the current page of the Grid.
     * @default AllPages
     */
    @Property('AllPages')
    public printMode: PrintMode;

    /** 
     * Defines the hierarchy grid print modes. The available modes are
     * * `Expanded` - Prints the master grid with expanded child grids. 
     * * `All` - Prints the master grid with all the child grids.
     * * `None` - Prints the master grid alone.
     * @default Expanded
     */
    @Property('Expanded')
    public hierarchyPrintMode: HierarchyGridPrintMode;

    /**    
     * It is used to render grid table rows. 
     * If the `dataSource` is an array of JavaScript objects, 
     * then Grid will create instance of [`DataManager`](https://ej2.syncfusion.com/documentation/data/api-dataManager.html) 
     * from this `dataSource`. 
     * If the `dataSource` is an existing [`DataManager`](https://ej2.syncfusion.com/documentation/data/api-dataManager.html),
     *  the Grid will not initialize a new one. 
     * 
     * > Check the available [`Adaptors`](../../data/adaptors/) to customize the data operation.
     * @default []    
     * @isGenericType true
     */
    @Property([])
    public dataSource: Object | DataManager | DataResult;

    /**
     * Defines the height of Grid rows.
     * @default null
     */
    @Property(null)
    public rowHeight: number;

    /**    
     * Defines the external [`Query`](https://ej2.syncfusion.com/documentation/data/api-query.html) 
     * that will be executed along with data processing.    
     * @default null    
     */
    @Property()
    public query: Query;

    /**
     * Defines the currencyCode format of the Grid columns
     * @private
     */
    @Property('USD')
    private currencyCode: string;

    /**    
     * `toolbar` defines the ToolBar items of the Grid. 
     * It contains built-in and custom toolbar items. 
     * If a string value is assigned to the `toolbar` option, it is considered as the template for the whole Grid ToolBar. 
     * If an array value is assigned, it is considered as the list of built-in and custom toolbar items in the Grid's Toolbar. 
     * <br><br>     
     * The available built-in ToolBar items are:
     * * Add: Adds a new record.
     * * Edit: Edits the selected record.
     * * Update: Updates the edited record.
     * * Delete: Deletes the selected record.
     * * Cancel: Cancels the edit state.
     * * Search: Searches records by the given key.
     * * Print: Prints the Grid.
     * * ExcelExport - Export the Grid to Excel(excelExport() method manually to make export.)
     * * PdfExport - Export the Grid to PDF(pdfExport() method manually to make export.)
     * * CsvExport - Export the Grid to CSV(csvExport() method manually to make export.)<br><br>
     * The following code example implements the custom toolbar items.
     * 
     *  > Check the [`Toolbar`](../../grid/tool-bar/#custom-toolbar-items/) to customize its default items.
     * 
     * {% codeBlock src="grid/toolbar-api/index.ts" %}{% endcodeBlock %}
     * @default null
     */
    @Property()
    public toolbar: (ToolbarItems | string | ItemModel | ToolbarItem)[];

    /**    
     * `contextMenuItems` defines both built-in and custom context menu items.
     * <br><br> 
     * The available built-in items are,  
     * * `AutoFitAll` - Auto fit the size of all columns. 
     * * `AutoFit` - Auto fit the current column.
     * * `Group` - Group by current column. 
     * * `Ungroup` - Ungroup by current column.
     * * `Edit` - Edit the current record.
     * * `Delete` - Delete the current record.
     * * `Save` - Save the edited record.
     * * `Cancel` - Cancel the edited state.
     * * `Copy` - Copy the selected records.
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
    @Property()
    public contextMenuItems: ContextMenuItem[] | ContextMenuItemModel[];

    /**    
     * `columnMenuItems` defines both built-in and custom column menu items.
     * <br><br> 
     * The available built-in items are,
     * * `AutoFitAll` - Auto fit the size of all columns. 
     * * `AutoFit` - Auto fit the current column.
     * * `Group` - Group by current column. 
     * * `Ungroup` - Ungroup by current column.
     * * `SortAscending` - Sort the current column in ascending order.
     * * `SortDescending` - Sort the current column in descending order.
     * * `Filter` - Filter options will show based on filterSettings property like checkbox filter, excel filter, menu filter.
     * @default null
     */
    @Property()
    public columnMenuItems: ColumnMenuItem[] | ColumnMenuItemModel[];

    /**
     * It used to render toolbar template
     * @default null
     */
    @Property()
    public toolbarTemplate: string;

    /**
     * It used to render pager template
     * @default null
     */
    @Property()
    public pagerTemplate: string;

    /**
     * Gets or sets the number of frozen rows.
     * @default 0
     */
    @Property(0)
    public frozenRows: number;

    /**
     * Gets or sets the number of frozen columns.
     * @default 0
     */
    @Property(0)
    public frozenColumns: number;

    /**
     * `columnQueryMode`provides options to retrive data from the datasource.Their types are 
     * * `All`: It Retrives whole datasource.
     * * `Schema`: Retrives data for all the defined columns in grid from the datasource. 
     * * `ExcludeHidden`: Retrives data only for visible columns of grid from the dataSource. 
     * @default All
     */
    @Property('All')
    public columnQueryMode: ColumnQueryModeType;

    /** 
     * Triggers when the component is created.
     * @event 
     * @blazorProperty 'Created'
     */
    @Event()
    public created: EmitType<Object>;

    /** 
     * Triggers when the component is destroyed. 
     * @event 
     * @blazorProperty 'Destroyed'
     */
    @Event()
    public destroyed: EmitType<Object>;

    /** 
     * This event allows customization of Grid properties before rendering.
     * @event 
     * @blazorProperty 'OnLoad'
     */
    @Event()
    public load: EmitType<Object>;
    /** 
     * Triggered every time a request is made to access row information, element, or data. 
     * This will be triggered before the row element is appended to the Grid element.
     * @event 
     * @blazorProperty 'RowDataBound'
     */
    @Event()
    public rowDataBound: EmitType<RowDataBoundEventArgs>;

    /** 
     * Triggered every time a request is made to access cell information, element, or data.
     * This will be triggered before the cell element is appended to the Grid element.
     * @event
     * @blazorProperty 'QueryCellInfo'
     */
    @Event()
    public queryCellInfo: EmitType<QueryCellInfoEventArgs>;

    /** 
     * Triggered for stacked header.
     * @event 
     * @blazorProperty 'HeaderCellInfo'
     */
    @Event()
    public headerCellInfo: EmitType<HeaderCellInfoEventArgs>;

    /* tslint:disable */
    /** 
     * Triggers when Grid actions such as sorting, filtering, paging, grouping etc., starts. 
     * @event
     * @blazorProperty 'OnActionBegin'
     */
    @Event()
    public actionBegin: EmitType<PageEventArgs | GroupEventArgs | FilterEventArgs | SearchEventArgs | SortEventArgs | AddEventArgs | SaveEventArgs | EditEventArgs | DeleteEventArgs | ActionEventArgs>;

    /** 
     * Triggers when Grid actions such as sorting, filtering, paging, grouping etc. are completed. 
     * @event 
     * @blazorProperty 'OnActionComplete'
     */
    @Event()
    public actionComplete: EmitType<PageEventArgs | GroupEventArgs | FilterEventArgs | SearchEventArgs | SortEventArgs | AddEventArgs | SaveEventArgs | EditEventArgs | DeleteEventArgs | ActionEventArgs>;
    /* tslint:enable */

    /** 
     * Triggers when any Grid action failed to achieve the desired results. 
     * @event 
     * @blazorProperty 'OnActionFailure'
     */
    @Event()
    public actionFailure: EmitType<FailureEventArgs>;

    /** 
     * Triggers when data source is populated in the Grid.
     * @event 
     * @blazorProperty 'DataBound'
     */
    @Event()
    public dataBound: EmitType<Object>;

    /** 
     * Triggers when record is double clicked.
     * @event 
     * @blazorProperty 'OnRecordDoubleClick'
     */
    @Event()
    public recordDoubleClick: EmitType<RecordDoubleClickEventArgs>;

    /** 
     * Triggers before row selection occurs.
     * @event 
     * @blazorProperty 'RowSelecting'
     */
    @Event()
    public rowSelecting: EmitType<RowSelectingEventArgs>;

    /** 
     * Triggers after a row is selected.
     * @event 
     * @blazorProperty 'RowSelected'
     */
    @Event()
    public rowSelected: EmitType<RowSelectEventArgs>;

    /** 
     * Triggers before deselecting the selected row.
     * @event 
     * @deprecated  
     */
    @Event()
    public rowDeselecting: EmitType<RowDeselectEventArgs>;

    /** 
     * Triggers when a selected row is deselected.
     * @event 
     * @blazorProperty 'RowDeselected'
     */
    @Event()
    public rowDeselected: EmitType<RowDeselectEventArgs>;

    /** 
     * Triggers before any cell selection occurs.
     * @event 
     * @blazorProperty 'CellSelecting'
     */
    @Event()
    public cellSelecting: EmitType<CellSelectingEventArgs>;

    /** 
     * Triggers after a cell is selected.
     * @event 
     * @blazorProperty 'CellSelected'
     */
    @Event()
    public cellSelected: EmitType<CellSelectEventArgs>;

    /** 
     * Triggers before the selected cell is deselecting.
     * @event 
     * @deprecated  
     */
    @Event()
    public cellDeselecting: EmitType<CellDeselectEventArgs>;

    /** 
     * Triggers when a particular selected cell is deselected.
     * @event 
     * @deprecated  
     */
    @Event()
    public cellDeselected: EmitType<CellDeselectEventArgs>;

    /**  
     * Triggers when column header element drag (move) starts. 
     * @event
     * @deprecated  
     */
    @Event()
    public columnDragStart: EmitType<ColumnDragEventArgs>;

    /**  
     * Triggers when column header element is dragged (moved) continuously. 
     * @event
     * @deprecated
     */
    @Event()
    public columnDrag: EmitType<ColumnDragEventArgs>;

    /**  
     * Triggers when a column header element is dropped on the target column. 
     * @event
     * @deprecated
     */
    @Event()
    public columnDrop: EmitType<ColumnDragEventArgs>;

    /** 
     * Triggers after print action is completed.  
     * @event 
     * @deprecated  
     */
    @Event()
    public printComplete: EmitType<PrintEventArgs>;

    /** 
     * Triggers before the print action starts.  
     * @event
     * @deprecated
     */
    @Event()
    public beforePrint: EmitType<PrintEventArgs>;

    /** 
     * Triggers before exporting each cell to PDF document. You can also customize the PDF cells.
     * @event
     * @deprecated 
     */
    @Event()
    public pdfQueryCellInfo: EmitType<PdfQueryCellInfoEventArgs>;

    /** 
     * Triggers before exporting each header cell to PDF document. You can also customize the PDF cells.
     * @event
     * @deprecated 
     */
    @Event()
    public pdfHeaderQueryCellInfo: EmitType<PdfHeaderQueryCellInfoEventArgs>;

    /** 
     * Triggers before exporting each detail Grid to PDF document.
     * @event
     * @deprecated 
     */
    @Event()
    public exportDetailDataBound: EmitType<ExportDetailDataBoundEventArgs>;

    /** 
     * Triggers before exporting each cell to Excel file.
     * You can also customize the Excel cells.
     * @event
     * @deprecated
     */
    @Event()
    public excelQueryCellInfo: EmitType<ExcelQueryCellInfoEventArgs>;

    /** 
     * Triggers before exporting each header cell to Excel file.
     * You can also customize the Excel cells.
     * @event
     * @deprecated
     */
    @Event()
    public excelHeaderQueryCellInfo: EmitType<ExcelHeaderQueryCellInfoEventArgs>;

    /**
     * Triggers before Grid data is exported to Excel file.
     * @event
     * @deprecated
     */
    @Event()
    public beforeExcelExport: EmitType<Object>;

    /**
     * Triggers after Grid data is exported to Excel file.
     * @event
     * @deprecated
     */
    @Event()
    public excelExportComplete: EmitType<ExcelExportCompleteArgs>;

    /**
     * Triggers before Grid data is exported to PDF document.
     * @event
     * @blazorProperty 'OnPdfExport'
     */
    @Event()
    public beforePdfExport: EmitType<Object>;

    /**
     * Triggers after Grid data is exported to PDF document.
     * @event
     * @deprecated
     */
    @Event()
    public pdfExportComplete: EmitType<PdfExportCompleteArgs>;

    /**
     * Triggers when row element's before drag(move).
     * @event
     * @deprecated
     */
    @Event()
    public rowDragStartHelper: EmitType<RowDragEventArgs>;

    /** 
     * Triggers after detail row expands.
     * > This event triggers at initial expand.  
     * @event 
     * @blazorProperty 'DetailDataBound'
     */
    @Event()
    public detailDataBound: EmitType<DetailDataBoundEventArgs>;

    /**  
     * Triggers when row element's drag(move) starts. 
     * @event
     * @deprecated  
     */
    @Event()
    public rowDragStart: EmitType<RowDragEventArgs>;

    /**  
     * Triggers when row elements are dragged (moved) continuously. 
     * @event
     * @deprecated  
     */
    @Event()
    public rowDrag: EmitType<RowDragEventArgs>;

    /**  
     * Triggers when row elements are dropped on the target row. 
     * @event
     * @deprecated 
     */
    @Event()
    public rowDrop: EmitType<RowDragEventArgs>;

    /**      
     * Triggers when toolbar item is clicked.
     * @event
     * @blazorProperty 'OnToolbarClick'
     * @blazorType Syncfusion.EJ2.Blazor.Navigations.ClickEventArgs
     */
    @Event()
    public toolbarClick: EmitType<ClickEventArgs>;

    /** 
     * Triggers before the columnChooser open.
     * @event
     * @deprecated
     */
    @Event()
    public beforeOpenColumnChooser: EmitType<ColumnChooserEventArgs>;

    /** 
     * Triggers when records are added in batch mode.   
     * @event
     * @deprecated
     */
    @Event()
    public batchAdd: EmitType<BatchAddArgs>;

    /** 
     * Triggers when records are deleted in batch mode.
     * @event
     * @deprecated
     */
    @Event()
    public batchDelete: EmitType<BatchDeleteArgs>;

    /** 
     * Triggers when cancel the batch edit changes batch mode.
     * @event
     * @deprecated
     */
    @Event()
    public batchCancel: EmitType<BatchCancelArgs>;

    /** 
     * Triggers before records are added in batch mode.
     * @event
     * @blazorProperty 'OnBatchAdd'
     */
    @Event()
    public beforeBatchAdd: EmitType<BeforeBatchAddArgs>;

    /** 
     * Triggers before records are deleted in batch mode.
     * @event
     * @blazorProperty 'OnBatchDelete'
     */
    @Event()
    public beforeBatchDelete: EmitType<BeforeBatchDeleteArgs>;

    /** 
     * Triggers before records are saved in batch mode.
     * @event
     * @blazorProperty 'OnBatchSave'
     */
    @Event()
    public beforeBatchSave: EmitType<BeforeBatchSaveArgs>;

    /** 
     * Triggers before the record is to be edit.
     * @event
     * @blazorProperty 'OnBeginEdit'
     */
    @Event()
    public beginEdit: EmitType<BeginEditArgs>;

    /** 
     * Triggers when command button is clicked.
     * @event
     * @blazorProperty 'CommandClicked'
     */
    @Event()
    public commandClick: EmitType<CommandClickEventArgs>;

    /** 
     * Triggers when the cell is being edited.
     * @event
     * @blazorProperty 'OnCellEdit'
     */
    @Event()
    public cellEdit: EmitType<CellEditArgs>;

    /** 
     * Triggers when cell is saved.
     * @event
     * @blazorProperty 'OnCellSave'
     */
    @Event()
    public cellSave: EmitType<CellSaveArgs>;

    /** 
     * Triggers when cell is saved.
     * @event
     * @blazorProperty 'CellSaved'
     */
    @Event()
    public cellSaved: EmitType<CellSaveArgs>;

    /** 
     * Triggers when column resize starts.
     * @event
     * @deprecated
     */
    @Event()
    public resizeStart: EmitType<ResizeArgs>;

    /** 
     * Triggers on column resizing.
     * @event
     * @deprecated
     */
    @Event()
    public resizing: EmitType<ResizeArgs>;

    /** 
     * Triggers when column resize ends.
     * @event
     * @deprecated
     */
    @Event()
    public resizeStop: EmitType<ResizeArgs>;

    /** 
     * Triggers when any keyboard keys are pressed inside the grid.
     * @event
     * @deprecated
     */
    @Event()
    public keyPressed: EmitType<KeyboardEventArgs>;

    /** 
     * Triggers before data is bound to Grid.
     * @event
     * @blazorProperty 'OnDataBound'
     */
    @Event()
    public beforeDataBound: EmitType<BeforeDataBoundArgs>;

    /** 
     * Triggers before context menu opens.
     * @event
     * @deprecated
     */
    @Event()
    public contextMenuOpen: EmitType<BeforeOpenCloseMenuEventArgs>;

    /** 
     * Triggers when click on context menu.
     * @event
     * @blazorProperty 'ContextMenuItemClicked'
     * @blazorType Syncfusion.EJ2.Blazor.Navigations.MenuEventArgs
     */
    @Event()
    public contextMenuClick: EmitType<MenuEventArgs>;

    /** 
     * Triggers before column menu opens.
     * @event
     * @deprecated  
     */
    @Event()
    public columnMenuOpen: EmitType<ColumnMenuOpenEventArgs>;

    /** 
     * Triggers when click on column menu.
     * @event
     * @blazorProperty 'ColumnMenuItemClicked'
     * @blazorType Syncfusion.EJ2.Blazor.Navigations.MenuEventArgs
     */
    @Event()
    public columnMenuClick: EmitType<MenuEventArgs>;

    /** 
     * Triggers when the check box state change in checkbox column.
     * @event
     * @deprecated
     */
    @Event()
    public checkBoxChange: EmitType<CheckBoxChangeEventArgs>;

    /** 
     * Triggers before Grid copy action.
     * @event
     * @deprecated
     */
    @Event()
    public beforeCopy: EmitType<BeforeCopyEventArgs>;

    /** 
     * Triggers before Grid paste action.
     * @event
     * @deprecated 
     */
    @Event()
    public beforePaste: EmitType<BeforePasteEventArgs>;

    /** 
     * Triggers when the grid actions such as Sorting, Paging, Grouping etc., are done.
     * In this event,the current view data and total record count should be assigned to the `dataSource` based on the action performed.
     * @event
     * @deprecated  
     */
    @Event()
    public dataStateChange: EmitType<DataStateChangeEventArgs>;

    /**
     * Triggers when the grid data is added, deleted and updated.
     * Invoke the done method from the argument to start render after edit operation.
     * @event
     * @deprecated 
     */
    @Event()
    public dataSourceChanged: EmitType<DataSourceChangedEventArgs>;

    /**
     * Constructor for creating the component
     * @hidden
     */
    constructor(options?: GridModel, element?: string | HTMLElement) {
        super(options, <HTMLElement | string>element);
        Grid.Inject(Selection);
        setValue('mergePersistData', this.mergePersistGridData, this);
    }

    /**
     * Get the properties to be maintained in the persisted state.
     * @return {string}
     * @hidden
     */
    public getPersistData(): string {
        let keyEntity: string[] = ['pageSettings', 'sortSettings',
            'filterSettings', 'groupSettings', 'columns', 'searchSettings', 'selectedRowIndex', 'scrollPosition'];
        let ignoreOnPersist: { [x: string]: string[] } = {
            pageSettings: ['template', 'pageSizes', 'enableQueryString', 'totalRecordsCount', 'pageCount'],
            filterSettings: ['type', 'mode', 'showFilterBarStatus', 'immediateModeDelay', 'ignoreAccent'],
            groupSettings: ['showDropArea', 'showToggleButton', 'showGroupedColumn', 'showUngroupButton',
                'disablePageWiseAggregates', 'hideCaptionCount'],
            searchSettings: ['fields', 'operator', 'ignoreCase'],
            sortSettings: [], columns: [], selectedRowIndex: [], scrollPosition: []
        };
        let ignoreOnColumn: string[] = ['filter', 'edit', 'filterBarTemplate', 'headerTemplate', 'template',
            'commandTemplate', 'commands', 'dataSource', 'headerText'];
        keyEntity.forEach((value: string) => {
            let currentObject: Object = this[value];
            for (let val of ignoreOnPersist[value]) {
                delete currentObject[val];
            }
        });
        this.pageSettings.template = undefined;
        this.pageTemplateChange = !isNullOrUndefined(this.pagerTemplate);
        return this.addOnPersist(keyEntity);
    }

    /**
     * To provide the array of modules needed for component rendering
     * @return {ModuleDeclaration[]}
     * @hidden
     */
    public requiredModules(): ModuleDeclaration[] {
        let modules: ModuleDeclaration[] = [];
        if (this.isDestroyed) { return modules; }
        if (this.allowFiltering) {
            modules.push({
                member: 'filter',
                args: [this, this.filterSettings, this.serviceLocator]
            });
        }
        if (this.allowExcelExport) {
            modules.push({
                member: 'ExcelExport',
                args: [this, this.serviceLocator]
            });
        }
        if (this.allowPdfExport) {
            modules.push({
                member: 'PdfExport',
                args: [this]
            });
        }
        if (this.allowSorting) {
            modules.push({
                member: 'sort',
                args: [this, this.sortSettings, this.sortedColumns, this.serviceLocator]
            });
        }
        if (this.allowPaging) {
            modules.push({
                member: 'pager',
                args: [this, this.pageSettings]
            });
        }
        if (this.allowSelection) {
            modules.push({
                member: 'selection',
                args: [this, this.selectionSettings, this.serviceLocator]
            });
        }
        modules.push({
            member: 'resize',
            args: [this]
        });

        if (this.allowReordering) {
            modules.push({
                member: 'reorder',
                args: [this]
            });
        }
        if (this.allowRowDragAndDrop) {
            modules.push({
                member: 'rowDragAndDrop',
                args: [this]
            });
        }
        if (this.allowGrouping) {
            modules.push({
                member: 'group',
                args: [this, this.groupSettings, this.sortedColumns, this.serviceLocator]
            });
        }
        if (this.aggregates.length) {
            modules.push({ member: 'aggregate', args: [this, this.serviceLocator] });
        }
        if (this.isDetail()) {
            modules.push({
                member: 'detailRow',
                args: [this, this.serviceLocator]
            });
        }
        if (this.toolbar || this.toolbarTemplate) {
            modules.push({
                member: 'toolbar',
                args: [this, this.serviceLocator]
            });
        }
        if (this.enableVirtualization || this.enableColumnVirtualization) {
            modules.push({
                member: 'virtualscroll',
                args: [this, this.serviceLocator]
            });
        }
        if (this.getFrozenColumns() || this.frozenRows) {
            modules.push({ member: 'freeze', args: [this, this.serviceLocator] });
        }
        if (this.isCommandColumn(<Column[]>this.columns)) {
            modules.push({
                member: 'commandColumn',
                args: [this, this.serviceLocator]
            });
        }
        if (this.editSettings.allowAdding || this.editSettings.allowDeleting || this.editSettings.allowEditing) {
            modules.push({
                member: 'edit',
                args: [this, this.serviceLocator]
            });
        }
        this.extendRequiredModules(modules);
        return modules;
    }

    public extendRequiredModules(modules: ModuleDeclaration[]): void {

        if (this.contextMenuItems) {
            modules.push({
                member: 'contextMenu',
                args: [this, this.serviceLocator]
            });
        }

        if (this.showColumnMenu) {
            modules.push({
                member: 'columnMenu',
                args: [this, this.serviceLocator]
            });
        }

        if (this.showColumnChooser) {
            modules.push({
                member: 'columnChooser',
                args: [this, this.serviceLocator]
            });
        }
        if (this.isForeignKeyEnabled(this.columns as Column[])) {
            modules.push({ member: 'foreignKey', args: [this, this.serviceLocator] });
        }
        if (this.enableLogger) {
            modules.push({ member: 'logger', args: [this] });
        }
    }

    /**
     * For internal use only - Initialize the event handler;
     * @private
     */
    protected preRender(): void {
        this.serviceLocator = new ServiceLocator;
        this.initProperties();
        this.initializeServices();
    }

    private initProperties(): void {
        /* tslint:disable */
        this.isInitial = true;
        this.sortedColumns = [];
        this.inViewIndexes = [];
        this.mediaCol = [];
        this.isInitialLoad = false;
        this.mergeCells = {};
        this.isEdit = false;
        this.checkAllRows = 'None';
        this.isCheckBoxSelection = false;
        this.isPersistSelection = false;
        this.freezeRefresh = Component.prototype.refresh;
        this.filterOperators = {
            contains: 'contains', endsWith: 'endswith', equal: 'equal', greaterThan: 'greaterthan', greaterThanOrEqual: 'greaterthanorequal',
            lessThan: 'lessthan', lessThanOrEqual: 'lessthanorequal', notEqual: 'notequal', startsWith: 'startswith'
        };
        this.defaultLocale = {
            EmptyRecord: 'No records to display',
            True: 'true',
            False: 'false',
            InvalidFilterMessage: 'Invalid Filter Data',
            GroupDropArea: 'Drag a column header here to group its column',
            UnGroup: 'Click here to ungroup',
            GroupDisable: 'Grouping is disabled for this column',
            FilterbarTitle: '\'s filter bar cell',
            EmptyDataSourceError:
                'DataSource must not be empty at initial load since columns are generated from dataSource in AutoGenerate Column Grid',
            // Toolbar Items
            Add: 'Add',
            Edit: 'Edit',
            Cancel: 'Cancel',
            Update: 'Update',
            Delete: 'Delete',
            Print: 'Print',
            Pdfexport: 'PDF Export',
            Excelexport: 'Excel Export',
            Wordexport: 'Word Export',
            Csvexport: 'CSV Export',
            Search: 'Search',
            Columnchooser: 'Columns',
            Save: 'Save',
            Item: 'item',
            Items: 'items',
            EditOperationAlert: 'No records selected for edit operation',
            DeleteOperationAlert: 'No records selected for delete operation',
            SaveButton: 'Save',
            OKButton: 'OK',
            CancelButton: 'Cancel',
            EditFormTitle: 'Details of ',
            AddFormTitle: 'Add New Record',
            BatchSaveConfirm: 'Are you sure you want to save changes?',
            BatchSaveLostChanges: 'Unsaved changes will be lost. Are you sure you want to continue?',
            ConfirmDelete: 'Are you sure you want to Delete Record?',
            CancelEdit: 'Are you sure you want to Cancel the changes?',
            ChooseColumns: 'Choose Column',
            SearchColumns: 'search columns',
            Matchs: 'No Matches Found',
            FilterButton: 'Filter',
            ClearButton: 'Clear',
            StartsWith: 'Starts With',
            EndsWith: 'Ends With',
            Contains: 'Contains',
            Equal: 'Equal',
            NotEqual: 'Not Equal',
            LessThan: 'Less Than',
            LessThanOrEqual: 'Less Than Or Equal',
            GreaterThan: 'Greater Than',
            GreaterThanOrEqual: 'Greater Than Or Equal',
            ChooseDate: 'Choose a Date',
            EnterValue: 'Enter the value',
            Copy: 'Copy',
            Group: 'Group by this column',
            Ungroup: 'Ungroup by this column',
            autoFitAll: 'Autofit all columns',
            autoFit: 'Autofit this column',
            Export: 'Export',
            FirstPage: 'First Page',
            LastPage: 'Last Page',
            PreviousPage: 'Previous Page',
            NextPage: 'Next Page',
            SortAscending: 'Sort Ascending',
            SortDescending: 'Sort Descending',
            EditRecord: 'Edit Record',
            DeleteRecord: 'Delete Record',
            FilterMenu: 'Filter',
            SelectAll: 'Select All',
            Blanks: 'Blanks',
            FilterTrue: 'True',
            FilterFalse: 'False',
            NoResult: 'No Matches Found',
            ClearFilter: 'Clear Filter',
            NumberFilter: 'Number Filters',
            TextFilter: 'Text Filters',
            DateFilter: 'Date Filters',
            DateTimeFilter: 'DateTime Filters',
            MatchCase: 'Match Case',
            Between: 'Between',
            CustomFilter: 'Custom Filter',
            CustomFilterPlaceHolder: 'Enter the value',
            CustomFilterDatePlaceHolder: 'Choose a date',
            AND: 'AND',
            OR: 'OR',
            ShowRowsWhere: 'Show rows where:'
        };
        this.keyConfigs = {
            downArrow: 'downarrow',
            upArrow: 'uparrow',
            rightArrow: 'rightarrow',
            leftArrow: 'leftarrow',
            shiftDown: 'shift+downarrow',
            shiftUp: 'shift+uparrow',
            shiftRight: 'shift+rightarrow',
            shiftLeft: 'shift+leftarrow',
            home: 'home',
            end: 'end',
            escape: 'escape',
            ctrlHome: 'ctrl+home',
            ctrlEnd: 'ctrl+end',
            pageUp: 'pageup',
            pageDown: 'pagedown',
            ctrlAltPageUp: 'ctrl+alt+pageup',
            ctrlAltPageDown: 'ctrl+alt+pagedown',
            altPageUp: 'alt+pageup',
            altPageDown: 'alt+pagedown',
            altDownArrow: 'alt+downarrow',
            altUpArrow: 'alt+uparrow',
            ctrlDownArrow: 'ctrl+downarrow',
            ctrlUpArrow: 'ctrl+uparrow',
            ctrlPlusA: 'ctrl+A',
            ctrlPlusP: 'ctrl+P',
            insert: 'insert',
            delete: 'delete',
            f2: 'f2',
            enter: 'enter',
            ctrlEnter: 'ctrl+enter',
            shiftEnter: 'shift+enter',
            tab: 'tab',
            shiftTab: 'shift+tab',
            space: 'space',
            ctrlPlusC: 'ctrl+C',
            ctrlShiftPlusH: 'ctrl+shift+H'
        };
        /* tslint:enable */
    }

    /**
     * For internal use only - To Initialize the component rendering.
     * @private
     */
    protected render(): void {
        this.log(['module_missing', 'promise_enabled', 'locale_missing', 'check_datasource_columns']);
        this.ariaService.setOptions(this.element, { role: 'grid' });
        if (isBlazor()) {
            this.renderComplete();
        }
        createSpinner({ target: this.element }, this.createElement);
        this.renderModule = new Render(this, this.serviceLocator);
        this.searchModule = new Search(this);
        this.scrollModule = new Scroll(this);
        this.notify(events.initialLoad, {});
        if (this.getDataModule().dataManager.dataSource.offline === true || this.getDataModule().dataManager.dataSource.url === undefined) {
            this.isVirtualAdaptive = true;
        }
        this.trigger(events.load);
        prepareColumns(this.columns as Column[], this.enableColumnVirtualization);
        this.getMediaColumns();
        setColumnIndex(this.columns as Column[]);
        this.checkLockColumns(this.columns as Column[]);
        this.getColumns();
        this.processModel();
        this.gridRender();
        this.wireEvents();
        this.addListener();
        this.updateDefaultCursor();
        this.updateStackedFilter();
        this.showSpinner();
        this.notify(events.initialEnd, {});
    }

    /**
     * By default, grid shows the spinner for all its actions. You can use this method to show spinner at your needed time.
     */
    public showSpinner(): void {
        showSpinner(this.element);
    }
    /**
     * Manually showed spinner needs to hide by `hideSpinnner`.
     */
    public hideSpinner(): void {
        hideSpinner(this.element);
    }

    private updateStackedFilter(): void {
        if (this.allowFiltering && this.filterSettings.type === 'FilterBar' &&
            this.getHeaderContent().querySelectorAll('.e-stackedheadercell').length) {
            this.getHeaderContent().classList.add('e-stackedfilter');
        } else {
            this.getHeaderContent().classList.remove('e-stackedfilter');
        }
    }

    private getMediaColumns(): void {
        if (!this.enableColumnVirtualization) {
            let gcol: Column[] = this.getColumns();
            this.getShowHideService = this.serviceLocator.getService<ShowHide>('showHideService');
            if (!isNullOrUndefined(gcol)) {
                for (let index: number = 0; index < gcol.length; index++) {
                    if (!isNullOrUndefined(gcol[index].hideAtMedia) && (isNullOrUndefined(gcol[index].visible) || gcol[index].visible)) {
                        this.pushMediaColumn(gcol[index], index);
                    }
                }
            }
        }
    }

    private pushMediaColumn(col: Column, index: number): void {
        this.mediaCol.push(col);
        this.media[col.uid] = window.matchMedia(col.hideAtMedia);
        this.mediaQueryUpdate(index, this.media[col.uid]);
        this.media[col.uid].addListener(this.mediaQueryUpdate.bind(this, index));
    }

    /**
     * @hidden
     */
    public updateMediaColumns(col: Column): void {
        if (!this.enableColumnVirtualization) {
            let index: number = this.getColumnIndexByUid(col.uid);
            for (let i: number = 0; i < this.mediaCol.length; i++) {
                if (col.uid === this.mediaCol[i].uid) {
                    this.mediaCol.splice(i , 1);
                    return;
                }
            }
            this.pushMediaColumn(col, index);
        }
    }

    /**
     * @hidden
     */
    public mediaQueryUpdate(columnIndex: number, e?: MediaQueryList): void {
        let col: Column = this.getColumns()[columnIndex];
        if (this.mediaCol.some((mediaColumn: Column) => mediaColumn.uid === col.uid)) {
            col.visible = e.matches;
            if (this.isInitialLoad) {
                this.invokedFromMedia = true;
                if (col.visible) {
                    this.showHider.show(col.headerText, 'headerText');
                } else {
                    this.showHider.hide(col.headerText, 'headerText');
                }
            }
        }
    }
    private refreshMediaCol(): void {
        this.isInitialLoad = true;
        if (this.aggregates.length && this.element.scrollHeight > this.height) {
            let footerContent: Element = this.element.querySelector('.e-gridfooter');
            addClass([footerContent], ['e-footerpadding']);
        }
        let checkboxColumn: Column[] = this.getColumns().filter((col: Column) => col.type === 'checkbox');
        if (checkboxColumn.length && this.selectionSettings.checkboxMode === 'ResetOnRowClick') {
            this.isCheckBoxSelection = false;
            this.refreshHeader();
        }
    }

    /**
     * For internal use only - Initialize the event handler
     * @private
     */
    protected eventInitializer(): void {
        //eventInitializer
    }

    /**
     * Destroys the component (detaches/removes all event handlers, attributes, classes, and empties the component element).
     * @method destroy
     * @return {void}
     */
    public destroy(): void {
        let gridElement: Element = this.element;
        if (!gridElement) { return; }
        let hasGridChild: Boolean = gridElement.querySelector('.e-gridheader') &&
            gridElement.querySelector('.e-gridcontent') ? true : false;
        if (hasGridChild) { this.unwireEvents(); }
        this.removeListener();
        this.notify(events.destroy, {});
        this.destroyDependentModules();
        if (hasGridChild) { super.destroy(); }
        this.toolTipObj.destroy();
        let modules: string[] = ['renderModule', 'headerModule', 'contentModule', 'valueFormatterService',
            'serviceLocator', 'ariaService', 'keyboardModule', 'widthService', 'searchModule', 'showHider',
            'scrollModule', 'printModule', 'clipboardModule', 'focusModule'];
        for (let i: number = 0; i < modules.length; i++) {
            if (this[modules[i]]) {
                this[modules[i]] = null;
            }
        }
        this.element.innerHTML = '';
        classList(this.element, [], ['e-rtl', 'e-gridhover', 'e-responsive', 'e-default', 'e-device', 'e-grid-min-height']);
    }

    private destroyDependentModules(): void {
        let gridElement: Element = this.element;
        if (!gridElement || (!gridElement.querySelector('.e-gridheader') && !gridElement.querySelector('.e-gridcontent'))) { return; }
        this.scrollModule.destroy();
        this.keyboardModule.destroy();
        this.focusModule.destroy();
    }

    /**
     * For internal use only - Get the module name.
     * @private
     */
    protected getModuleName(): string {
        return 'grid';
    }

    private enableBoxSelection(): void {
        if (this.enableAutoFill) {
            this.selectionSettings.cellSelectionMode = 'BoxWithBorder';
        }
    }

    /**
     * Called internally if any of the property value changed.
     * @hidden
     */

    /* tslint:disable-next-line:max-line-length */
    // tslint:disable-next-line:max-func-body-length
    public onPropertyChanged(newProp: GridModel, oldProp: GridModel): void {
        let requireRefresh: boolean = false;
        let requireGridRefresh: boolean = false;
        let freezeRefresh: boolean = false;
        let checkCursor: boolean; let args: Object = { requestType: 'refresh' };
        if (this.isDestroyed) { return; }
        this.log('module_missing');
        let properties: string[] = Object.keys(newProp);
        if (properties.indexOf('columns') > -1) {
            this.updateColumnObject(); requireGridRefresh = true;
        }
        for (let prop of properties) {
            switch (prop) {
                case 'allowPaging':
                    this.notify(events.uiUpdate, { module: 'pager', enable: this.allowPaging });
                    requireRefresh = true; break;
                case 'pageSettings':
                    if (this.pageTemplateChange) {
                        this.pageTemplateChange = false;
                        break;
                    }
                    this.notify(events.inBoundModelChanged, { module: 'pager', properties: newProp.pageSettings });
                    if (isNullOrUndefined(newProp.pageSettings.currentPage) && isNullOrUndefined(newProp.pageSettings.pageSize)
                        && isNullOrUndefined(newProp.pageSettings.totalRecordsCount)
                        || !isNullOrUndefined(oldProp.pageSettings) &&
                        ((newProp.pageSettings.currentPage !== oldProp.pageSettings.currentPage)
                            && !this.enableColumnVirtualization && !this.enableVirtualization
                            && this.pageSettings.totalRecordsCount <= this.pageSettings.pageSize)) { requireRefresh = true; }
                    break;
                case 'allowSorting':
                    this.notify(events.uiUpdate, { module: 'sort', enable: this.allowSorting });
                    requireRefresh = true;
                    checkCursor = true; break;
                case 'allowFiltering':
                    this.updateStackedFilter();
                    this.notify(events.uiUpdate, { module: 'filter', enable: this.allowFiltering });
                    requireRefresh = true;
                    if (this.filterSettings.type !== 'FilterBar') {
                        this.refreshHeader();
                    } break;
                case 'height':
                case 'width':
                    this.notify(events.uiUpdate, { module: 'scroll', properties: { width: newProp.width, height: newProp.height } });
                    break;
                case 'allowReordering':
                    this.headerModule.refreshUI();
                    checkCursor = true;
                    break;
                case 'allowRowDragAndDrop':
                    this.notify(events.uiUpdate, { module: 'rowDragAndDrop', enable: this.allowRowDragAndDrop });
                    break;
                case 'allowSelection':
                    this.notify(events.uiUpdate, { module: 'selection', enable: this.allowSelection });
                    break;
                case 'enableAutoFill':
                    if (this.selectionModule) {
                        this.enableBoxSelection();
                        this.selectionModule.updateAutoFillPosition();
                    }
                    break;
                case 'rowTemplate':
                    this.rowTemplateFn = templateCompiler(this.rowTemplate);
                    requireRefresh = true; break;
                case 'detailTemplate':
                    this.detailTemplateFn = templateCompiler(this.detailTemplate);
                    requireRefresh = true; break;
                case 'allowGrouping':
                    this.notify(events.uiUpdate, { module: 'group', enable: this.allowGrouping });
                    this.headerModule.refreshUI();
                    requireRefresh = true;
                    checkCursor = true; break;
                case 'childGrid':
                    requireRefresh = true; break;
                case 'toolbar':
                    this.notify(events.uiUpdate, { module: 'toolbar' }); break;
                case 'groupSettings':
                    this.notify(events.inBoundModelChanged, {
                        module: 'group', properties: newProp.groupSettings,
                        oldProperties: oldProp.groupSettings
                    }); break;
                case 'aggregates':
                    if (!this.aggregates.length && this.allowGrouping && this.groupSettings.columns.length) {
                        requireRefresh = true;
                    }
                    this.notify(events.uiUpdate, { module: 'aggregate', properties: newProp }); break;
                case 'frozenColumns':
                case 'frozenRows':
                case 'enableVirtualization':
                case 'currencyCode':
                case 'locale':
                    this.log('frozen_rows_columns');
                    freezeRefresh = true;
                    requireGridRefresh = true;
                    break;
                case 'query':
                    requireRefresh = true; break;
                default:
                    this.extendedPropertyChange(prop, newProp, requireGridRefresh);
            }
        }
        if (checkCursor) { this.updateDefaultCursor(); }
        if (requireGridRefresh) {
            if (freezeRefresh || this.frozenColumns || this.frozenRows) {
                this.freezeRefresh();
            } else {
                this.refresh();
            }
        } else if (requireRefresh) {
            this.notify(events.modelChanged, args);
            requireRefresh = false;
            this.maintainSelection(newProp.selectedRowIndex);
        }
    }

    /* tslint:disable */
    private extendedPropertyChange(prop: string, newProp: GridModel, requireGridRefresh: boolean): void {
        switch (prop) {
            case 'enableRtl':
                this.updateRTL();
                if (this.allowPaging) {
                    (<EJ2Intance>this.element.querySelector('.e-gridpager')).ej2_instances[0].enableRtl = newProp.enableRtl;
                    (<EJ2Intance>this.element.querySelector('.e-gridpager')).ej2_instances[0].dataBind();
                }
                if (this.height !== 'auto') {
                    this.scrollModule.removePadding(!newProp.enableRtl);
                    this.scrollModule.setPadding();
                }
                if (this.toolbar && this.toolbarModule) {
                    (<EJ2Intance>this.toolbarModule.getToolbar()).ej2_instances[0].enableRtl = newProp.enableRtl;
                    (<EJ2Intance>this.toolbarModule.getToolbar()).ej2_instances[0].dataBind();
                }
                if (this.contextMenuItems && this.contextMenuModule) {
                    (<EJ2Intance>this.contextMenuModule.getContextMenu()).ej2_instances[0].enableRtl = newProp.enableRtl;
                    (<EJ2Intance>this.contextMenuModule.getContextMenu()).ej2_instances[0].dataBind();
                }
                if (this.showColumnMenu && this.columnMenuModule) {
                    (<EJ2Intance>this.columnMenuModule.getColumnMenu()).ej2_instances[0].enableRtl = newProp.enableRtl;
                    (<EJ2Intance>this.columnMenuModule.getColumnMenu()).ej2_instances[0].dataBind();
                }
                this.notify(events.rtlUpdated, {}); break;
            case 'enableAltRow':
                this.renderModule.refresh(); break;
            case 'allowResizing':
                this.headerModule.refreshUI();
                this.updateResizeLines(); break;
            case 'rowHeight':
                if (this.rowHeight) {
                    addClass([this.element], 'e-grid-min-height');
                } else {
                    removeClass([this.element], 'e-grid-min-height');
                }
                this.renderModule.refresh();
                this.headerModule.refreshUI(); break;
            case 'gridLines':
                this.updateGridLines(); break;
            case 'showColumnMenu':
                this.headerModule.refreshUI();
                this.notify(events.uiUpdate, { module: 'columnMenu', enable: true }); break;
            case 'columnMenuItems':
                this.notify(events.uiUpdate, { module: 'columnMenu', enable: this.columnMenuItems }); break;
            case 'contextMenuItems':
                this.notify(events.uiUpdate, { module: 'contextMenu', enable: this.contextMenuItems }); break;
            case 'showColumnChooser':
                this.notify(events.uiUpdate, { module: 'columnChooser', enable: this.showColumnChooser }); break;
            case 'filterSettings':
                this.updateStackedFilter();
                this.notify(events.inBoundModelChanged, { module: 'filter', properties: newProp.filterSettings }); break;
            case 'searchSettings':
                this.notify(events.inBoundModelChanged, { module: 'search', properties: newProp.searchSettings }); break;
            case 'sortSettings':
                this.notify(events.inBoundModelChanged, { module: 'sort' }); break;
            case 'selectionSettings':
                this.notify(events.inBoundModelChanged, { module: 'selection', properties: newProp.selectionSettings }); break;
            case 'editSettings':
                this.notify(events.inBoundModelChanged, { module: 'edit', properties: newProp.editSettings }); break;
            case 'allowTextWrap':
            case 'textWrapSettings':
                if (this.allowTextWrap) {
                    this.applyTextWrap();
                } else {
                    this.removeTextWrap();
                }
                this.notify(events.freezeRender, { case: 'textwrap', isModeChg: (prop === 'textWrapSettings') });
                break;
            case 'dataSource':
                let pending: PendingState = this.getDataModule().getState();
                if (Object.getPrototypeOf(newProp).deepWatch) {
                    let pKeyField: string = this.getPrimaryKeyFieldNames()[0];
                    for (let i: number = 0, props: string[] = Object.keys(newProp.dataSource); i < props.length; i++) {
                        this.setRowData(getValue(pKeyField, this.dataSource[props[i]]), this.dataSource[props[i]]);
                    }
                } else if (pending.isPending) {
                    let gResult: Object = !isNullOrUndefined(this.dataSource) ? (<DataResult>this.dataSource).result : [];
                    (pending.group || []).forEach((name: string) => {
                        gResult = DataUtil.group(<Object[]>gResult, name, pending.aggregates || []);
                    });
                    this.dataSource = {
                        result: gResult, count: (<DataResult>this.dataSource).count,
                        aggregates: (<DataResult>this.dataSource).aggregates
                    };
                    this.getDataModule().setState({});
                    pending.resolver(this.dataSource);
                } else {
                    this.getDataModule().setState({ isDataChanged: false });
                    this.notify(events.dataSourceModified, {});
                    if (!requireGridRefresh) {
                        this.renderModule.refresh();
                    }
                } break;
            case 'enableHover':
                let action: Function = newProp.enableHover ? addClass : removeClass;
                (<Function>action)([this.element], 'e-gridhover');
                break;
            case 'selectedRowIndex':
                if (!this.isSelectedRowIndexUpdating) {
                    this.selectRow(newProp.selectedRowIndex);
                }
                this.isSelectedRowIndexUpdating = false; break;
   
        }
    }

    private maintainSelection(index: number): void {
        if (index !== -1) {
            let fn: Function = () => {
                this.selectRow(index);
                this.off(events.contentReady, fn);
            };
            this.on(events.contentReady, fn, this);
        }
    }

    /**
     * @private
     */
    public setProperties(prop: Object, muteOnChange?: boolean): void {
        super.setProperties(prop, muteOnChange);
        let filterSettings: string = 'filterSettings';
        if (prop[filterSettings] && this.filterModule && muteOnChange) {
            this.filterModule.refreshFilter();
        }
    }

    /**
     * @hidden   
     */
    public updateDefaultCursor(): void {
        let headerRows: Element[] = [].slice.call(this.element.querySelectorAll('.e-columnheader'));
        for (let row of headerRows) {
            if (this.allowSorting || (this.allowGrouping && this.groupSettings.showDropArea) || this.allowReordering) {
                row.classList.remove('e-defaultcursor');
            } else {
                row.classList.add('e-defaultcursor');
            }
        }
    }

    private updateColumnModel(columns: Column[]): void {
        for (let i: number = 0, len: number = columns.length; i < len; i++) {
            if (columns[i].columns) {
                this.updateColumnModel(columns[i].columns as Column[]);
            } else {
                this.columnModel.push(columns[i] as Column);
            }
        }
        this.updateFrozenColumns();
        this.updateLockableColumns();
    }

    private updateFrozenColumns(): void {
        let cols: Column[] = this.columnModel;
        let count: number = 0;
        for (let i: number = 0, len: number = cols.length; i < len; i++) {
            if (cols[i].isFrozen) {
                cols.splice(this.frozenColumns + count, 0, cols.splice(i, 1)[0]);
                count++;
            }
        }
    }

    private updateLockableColumns(): void {
        let cols: Column[] = this.columnModel;
        let frozenCount: number = 0;
        let movableCount: number = 0;
        let frozenColumns: number = this.getFrozenColumns();
        for (let i: number = 0; i < cols.length; i++) {
            if (cols[i].lockColumn) {
                if (i < frozenColumns) {
                    cols.splice(frozenCount, 0, cols.splice(i, 1)[0]);
                    frozenCount++;
                } else {
                    cols.splice(frozenColumns + movableCount, 0, cols.splice(i, 1)[0]);
                    movableCount++;
                }
            }
        }
    }

    private checkLockColumns(cols: Column[]): void {
        for (let i: number = 0; i < cols.length; i++) {
            if (cols[i].columns) {
                this.checkLockColumns(cols[i].columns as Column[]);
            } else if (cols[i].lockColumn) {
                this.lockcolPositionCount++;
            }
        }
    }

    /**
     * Gets the columns from the Grid.
     * @return {Column[]} 
     */
    public getColumns(isRefresh?: boolean): Column[] {
        let inview: number[] = this.inViewIndexes.map((v: number) => v - this.groupSettings.columns.length).filter((v: number) => v > -1);
        let vLen: number = inview.length;
        if (!this.enableColumnVirtualization || isNullOrUndefined(this.columnModel) || this.columnModel.length === 0 || isRefresh) {
            this.columnModel = [];
            this.updateColumnModel(this.columns as Column[]);
        }
        let columns: Column[] = vLen === 0 ? this.columnModel :
            this.columnModel.slice(inview[0], inview[vLen - 1] + 1);
        return columns;

    }

    /**
     * @private
     */
    public getStackedHeaderColumnByHeaderText(stackedHeader: string, col: Column[]): Column {
        for (let i: number = 0; i < col.length; i++) {
            let individualColumn: Column = col[i];
            if (individualColumn.field === stackedHeader || individualColumn.headerText === stackedHeader) {
                this.stackedColumn = individualColumn;
                break;
            } else if (individualColumn.columns) {
                this.getStackedHeaderColumnByHeaderText(stackedHeader, <Column[]>individualColumn.columns);
            }
        }
        return this.stackedColumn;
    }

    /**
     * @private
     */
    public getColumnIndexesInView(): number[] {
        return this.inViewIndexes;
    }

    /**
     * @private
     */
    public getQuery(): Query {
        return this.query;
    }

    /**
     * @private
     */
    public getLocaleConstants(): Object {
        return this.defaultLocale;
    }


    /**
     * @private
     */
    public setColumnIndexesInView(indexes: number[]): void {
        this.inViewIndexes = indexes;
    }

    /**
     * Gets the visible columns from the Grid.
     * @return {Column[]} 
     */
    public getVisibleColumns(): Column[] {
        let cols: Column[] = [];
        for (let col of this.columnModel) {
            if (col.visible) {
                cols.push(col);
            }
        }
        return cols;
    }

    /**
     * Gets the header div of the Grid. 
     * @return {Element} 
     */
    public getHeaderContent(): Element {
        return this.headerModule.getPanel();
    }

    /**
     * Sets the header div of the Grid to replace the old header.
     * @param  {Element} element - Specifies the Grid header.
     * @return {void}
     */
    public setGridHeaderContent(element: Element): void {
        this.headerModule.setPanel(element);
    }

    /**
     * Gets the content table of the Grid.
     * @return {Element} 
     */
    public getContentTable(): Element {
        return this.contentModule.getTable();
    }

    /**
     * Sets the content table of the Grid to replace the old content table.
     * @param  {Element} element - Specifies the Grid content table.
     * @return {void}
     */
    public setGridContentTable(element: Element): void {
        this.contentModule.setTable(element);
    }

    /**
     * Gets the content div of the Grid.
     * @return {Element} 
     */
    public getContent(): Element {
        return this.contentModule.getPanel();
    }

    /**
     * Sets the content div of the Grid to replace the old Grid content.
     * @param  {Element} element - Specifies the Grid content.
     * @return {void}
     */
    public setGridContent(element: Element): void {
        this.contentModule.setPanel(element);
    }

    /**
     * Gets the header table element of the Grid.
     * @return {Element} 
     */
    public getHeaderTable(): Element {
        return this.headerModule.getTable();
    }

    /**
     * Sets the header table of the Grid to replace the old one.
     * @param  {Element} element - Specifies the Grid header table.
     * @return {void}
     */
    public setGridHeaderTable(element: Element): void {
        this.headerModule.setTable(element);
    }

    /**
     * Gets the footer div of the Grid.
     * @return {Element} 
     */
    public getFooterContent(): Element {
        if (isNullOrUndefined(this.footerElement)) {
            this.footerElement = this.element.getElementsByClassName('e-gridfooter')[0];
        }

        return this.footerElement;
    }

    /**
     * Gets the footer table element of the Grid.
     * @return {Element} 
     */
    public getFooterContentTable(): Element {
        if (isNullOrUndefined(this.footerElement)) {
            this.footerElement = this.element.getElementsByClassName('e-gridfooter')[0];
        }

        return <Element>this.footerElement.firstChild.firstChild;
    }


    /**
     * Gets the pager of the Grid.
     * @return {Element} 
     */
    public getPager(): Element {
        return this.gridPager; //get element from pager
    }

    /**
     * Sets the pager of the Grid to replace the old pager.
     * @param  {Element} element - Specifies the Grid pager.
     * @return {void}
     */
    public setGridPager(element: Element): void {
        this.gridPager = element;
    }

    /**
     * Gets a row by index.
     * @param  {number} index - Specifies the row index.
     * @return {Element} 
     */
    public getRowByIndex(index: number): Element {
        return this.contentModule.getRowByIndex(index);
    }

    /**
     * Gets a movable tables row by index.
     * @param  {number} index - Specifies the row index.
     * @return {Element} 
     */
    public getMovableRowByIndex(index: number): Element {
        return this.contentModule.getMovableRowByIndex(index);
    }

    /**
     * Gets all the data rows of the Grid.
     * @return {Element[]} 
     */
    public getRows(): Element[] {
        return this.contentModule.getRowElements();
    }

    /**
     * Get a row information based on cell
     * @param {Element}
     * @return RowInfo
     */
    public getRowInfo(target: Element | EventTarget): RowInfo {
        let ele: Element = target as Element;
        let args: Object = { target: target };
        if (!isNullOrUndefined(target) && isNullOrUndefined(parentsUntil(ele, 'e-detailrowcollapse')
            && isNullOrUndefined(parentsUntil(ele, 'e-recordplusexpand'))) && !this.isEdit) {
            let cell: Element = closest(ele, '.e-rowcell');
            if (!cell) {
                return args;
            }
            let cellIndex: number = parseInt(cell.getAttribute('aria-colindex'), 10);
            if (!isNullOrUndefined(cell) && !isNaN(cellIndex)) {
                let row: Element = closest(cell, '.e-row');
                let rowIndex: number = parseInt(row.getAttribute('aria-rowindex'), 10);
                let frzCols: number = this.getFrozenColumns();
                let isMovable: boolean = frzCols ? cellIndex >= frzCols : false;
                let rows: Row<{}>[] = <Row<{}>[]>(isMovable ?
                    this.contentModule.getMovableRows() : this.contentModule.getRows());
                let rowsObject: Object = rows.filter((r: Row<{}>) => r.uid === row.getAttribute('data-uid'));
                let rowData: Object = {};
                let column: Column;
                if (Object.keys(rowsObject).length) {
                    rowData = rowsObject[0].data;
                    column = rowsObject[0].cells[isMovable ? cellIndex - frzCols : cellIndex].column as Column;
                }
                args = { cell: cell, cellIndex: cellIndex, row: row, rowIndex: rowIndex, rowData: rowData, column: column, target: target };
            }
        }
        return args;
    }

    /**
     * Gets the Grid's movable content rows from frozen grid.
     * @return {Element[]} 
     */
    public getMovableRows(): Element[] {
        return this.contentModule.getMovableRowElements();
    }

    /**
     * Gets all the Grid's data rows.
     * @return {Element[]} 
     */
    public getDataRows(): Element[] {
        let rows: HTMLElement[] = [].slice.call(this.getContentTable().querySelector('tbody').children);
        if (this.frozenRows) {
            let freezeRows: HTMLElement[] = [].slice.call(this.getHeaderTable().querySelector('tbody').children);
            rows = this.addMovableRows(freezeRows, rows);
        }
        let dataRows: Element[] = this.generateDataRows(rows);
        return dataRows;
    }

    /**
     * @hidden   
     */
    public addMovableRows(fRows: HTMLElement[], mrows: HTMLElement[]): HTMLElement[] {
        for (let i: number = 0, len: number = mrows.length; i < len; i++) {
            fRows.push(mrows[i]);
        }
        return fRows;
    }

    private generateDataRows(rows: HTMLElement[]): Element[] {
        let dRows: Element[] = [];
        for (let i: number = 0, len: number = rows.length; i < len; i++) {
            if (rows[i].classList.contains('e-row') && !rows[i].classList.contains('e-hiddenrow')) {
                dRows.push(rows[i] as Element);
            }
        }
        return dRows;
    }

    /**
     * Gets all the Grid's movable table data rows.
     * @return {Element[]} 
     */
    public getMovableDataRows(): Element[] {
        let rows: HTMLElement[] =
            [].slice.call(this.getContent().querySelector('.e-movablecontent').querySelector('tbody').children);
        if (this.frozenRows) {
            let freezeRows: HTMLElement[] =
                [].slice.call(this.getHeaderContent().querySelector('.e-movableheader').querySelector('tbody').children);
            rows = this.addMovableRows(freezeRows, rows);
        }
        let dataRows: Element[] = this.generateDataRows(rows);
        return dataRows;
    }

    /**
     * Updates particular cell value based on the given primary key value.
     * > Primary key column must be specified using `columns.isPrimaryKey` property.
     * @param {string| number} key - Specifies the PrimaryKey value of dataSource.
     * @param {string } field - Specifies the field name which you want to update.
     * @param {string | number | boolean | Date} value - To update new value for the particular cell.  
     */
    public setCellValue(key: string | number, field: string, value: string | number | boolean | Date): void {
        let cells: string = 'cells';
        let rowData: string = 'data';
        let rowIdx: string = 'index';
        let rowuID: string = 'uid';
        let fieldIdx: number;
        let col: Column;
        let tr: Element;
        let mTr: Element;
        let pkName: string = this.getPrimaryKeyFieldNames()[0];
        let cell: CellRenderer = new CellRenderer(this, this.serviceLocator);
        let selectedRow: Object = {};
        let movableSelectedRow: Object = {};
        let rowObjects: Object = this.contentModule.getRows();
        let movableRowObjects: Object = this.contentModule.getMovableRows();
        fieldIdx = this.getColumnIndexByField(field);
        if (this.groupSettings.columns.length > 0 || this.childGrid || this.detailTemplate) {
            fieldIdx = fieldIdx + 1;
        }
        col = this.getColumnByField(field);
        selectedRow = (<Row<{}>[]>rowObjects).filter((r: Row<{}>) =>
            getValue(pkName, r.data) === key)[0];
        movableSelectedRow = (<Row<{}>[]>movableRowObjects).filter((r: Row<{}>) =>
            getValue(pkName, r.data) === key)[0];
        tr = !isNullOrUndefined(selectedRow) ? this.element.querySelector('[data-uid=' + selectedRow[rowuID] + ']') : null;
        mTr = !isNullOrUndefined(movableSelectedRow) ? this.element.querySelector('[data-uid=' + movableSelectedRow[rowuID] + ']') : null;
        if (!isNullOrUndefined(tr)) {
            setValue(field, value, selectedRow[rowData]);
            let td: Element = !isNullOrUndefined(tr.childNodes[fieldIdx] as Element) ?
                tr.childNodes[fieldIdx] as Element : mTr.childNodes[fieldIdx - this.frozenColumns] as Element;
            if (!isNullOrUndefined(td)) {
                let sRow: Cell<Column> = selectedRow[cells][fieldIdx];
                let mRow: Cell<Column>;
                if (this.frozenColumns) {
                    mRow = movableSelectedRow[cells][fieldIdx - this.frozenColumns];
                }
                cell.refreshTD(td, !isNullOrUndefined(sRow) ? sRow : mRow, selectedRow[rowData], { index: selectedRow[rowIdx] });
                if (this.aggregates.length > 0) {
                    this.notify(events.refreshFooterRenderer, {});
                    if (this.groupSettings.columns.length > 0) {
                        this.notify(events.groupAggregates, {});
                    }
                }
                /* tslint:disable:no-string-literal */
                if (!isNullOrUndefined(movableSelectedRow) && !isNullOrUndefined(movableSelectedRow['changes'])) {
                    movableSelectedRow['changes'][field] = value;
                }
                /* tslint:disable:no-string-literal */
                this.trigger(events.queryCellInfo, {
                    cell: td, column: col, data: selectedRow[rowData]
                });
            }
        } else {
            return;
        }
    }

    /**
     * Updates and refresh the particular row values based on the given primary key value.
     * > Primary key column must be specified using `columns.isPrimaryKey` property.
     *  @param {string| number} key - Specifies the PrimaryKey value of dataSource.
     *  @param {Object} rowData - To update new data for the particular row.
     */
    public setRowData(key: string | number, rowData?: Object): void {
        let rwdata: string = 'data';
        let rowuID: string = 'uid';
        let rowObjects: Object = this.contentModule.getRows();
        let selectedRow: Row<Column>;
        let pkName: string = this.getPrimaryKeyFieldNames()[0];
        let rowRenderer: RowRenderer<Column> = new RowRenderer<Column>(this.serviceLocator, null, this);
        if (this.groupSettings.columns.length > 0 && this.aggregates.length > 0) {
            rowObjects = (<Row<{}>[]>rowObjects).filter((row: Row<{}>) => row.isDataRow);
        }
        selectedRow = (<Row<{}>[]>rowObjects).filter((r: Row<{}>) =>
            getValue(pkName, r.data) === key)[0] as Row<Column>;
        if (!isNullOrUndefined(selectedRow) && this.element.querySelectorAll('[data-uid=' + selectedRow[rowuID] + ']').length) {
            selectedRow.changes = rowData;
            refreshForeignData(selectedRow, this.getForeignKeyColumns(), selectedRow.changes);
            rowRenderer.refresh(selectedRow, this.getColumns() as Column[], true);
            if (this.aggregates.length > 0) {
                this.notify(events.refreshFooterRenderer, {});
                if (this.groupSettings.columns.length > 0) {
                    this.notify(events.groupAggregates, {});
                }
            }
        } else {
            return;
        }
    }


    /**
     * Gets a cell by row and column index.
     * @param  {number} rowIndex - Specifies the row index.
     * @param  {number} columnIndex - Specifies the column index.
     * @return {Element} 
     */
    public getCellFromIndex(rowIndex: number, columnIndex: number): Element {
        return this.getDataRows()[rowIndex] && this.getDataRows()[rowIndex].querySelectorAll('.e-rowcell')[columnIndex];
    }

    /**
     * Gets a movable table cell by row and column index.
     * @param  {number} rowIndex - Specifies the row index.
     * @param  {number} columnIndex - Specifies the column index.
     * @return {Element} 
     */
    public getMovableCellFromIndex(rowIndex: number, columnIndex: number): Element {
        return this.getMovableDataRows()[rowIndex] &&
            this.getMovableDataRows()[rowIndex].querySelectorAll('.e-rowcell')[columnIndex - this.getFrozenColumns()];
    }

    /**
     * Gets a column header by column index.
     * @param  {number} index - Specifies the column index.
     * @return {Element} 
     */
    public getColumnHeaderByIndex(index: number): Element {
        return this.getHeaderTable().querySelectorAll('.e-headercell')[index];
    }

    /**
     * @hidden   
     */
    public getRowObjectFromUID(uid: string): Row<Column> {
        let rows: Row<Column>[] = this.contentModule.getRows() as Row<Column>[];
        let row: Row<Column> = this.rowObject(rows, uid);
        if (this.getFrozenColumns()) {
            if (!row) {
                row = this.rowObject(this.contentModule.getMovableRows() as Row<Column>[], uid);
                return row;
            }
        }
        return row;
    }

    private rowObject(rows: Row<Column>[], uid: string): Row<Column> {
        for (let row of rows) {
            if (row.uid === uid) {
                return row;
            }
        }
        return null;
    }

    /**
     * @hidden   
     */
    public getRowsObject(): Row<Column>[] {
        return this.contentModule.getRows() as Row<Column>[];
    }

    /**
     * @hidden   
     */
    public getMovableRowsObject(): Row<Column>[] {
        return this.contentModule.getMovableRows() as Row<Column>[];
    }

    /**
     * Gets a column header by column name.
     * @param  {string} field - Specifies the column name.
     * @return {Element} 
     */
    public getColumnHeaderByField(field: string): Element {
        return this.getColumnHeaderByUid(this.getColumnByField(field).uid);
    }

    /**
     * Gets a column header by UID.
     * @param  {string} field - Specifies the column uid.
     * @return {Element} 
     */
    public getColumnHeaderByUid(uid: string): Element {
        return this.getHeaderContent().querySelector('[e-mappinguid=' + uid + ']').parentElement;
    }

    /**
     * @hidden
     */

    public getColumnByIndex(index: number): Column {
        let column: Column;
        this.getColumns().some((col: Column, i: number) => {
            column = col;
            return i === index;
        });
        return column;
    }

    /**
     * Gets a Column by column name.
     * @param  {string} field - Specifies the column name.
     * @return {Column}
     */
    public getColumnByField(field: string): Column {
        return iterateArrayOrObject<Column, Column>(<Column[]>this.getColumns(), (item: Column, index: number) => {
            if (item.field === field) {
                return item;
            }
            return undefined;
        })[0];
    }

    /**
     * Gets a column index by column name.
     * @param  {string} field - Specifies the column name.
     * @return {number}
     */
    public getColumnIndexByField(field: string): number {
        let cols: Column[] = this.getColumns();
        for (let i: number = 0; i < cols.length; i++) {
            if (cols[i].field === field) {
                return i;
            }
        }
        return -1;
    }

    /**
     * Gets a column by UID.
     * @param  {string} uid - Specifies the column UID.
     * @return {Column}
     */
    public getColumnByUid(uid: string): Column {
        return iterateArrayOrObject<Column, Column>(
            [...<Column[]>this.getColumns(), ...this.getStackedColumns(this.columns as Column[])],
            (item: Column, index: number) => {
                if (item.uid === uid) {
                    return item;
                }
                return undefined;
            })[0];
    }

    /**
     * @hidden   
     */
    public getStackedColumns(columns: Column[], stackedColumn: Column[] = []): Column[] {
        for (const column of columns) {
            if (column.columns) {
                stackedColumn.push(column);
                this.getStackedColumns(column.columns as Column[], stackedColumn);
            }
        }
        return stackedColumn;
    }

    /**
     * Gets a column index by UID.
     * @param  {string} uid - Specifies the column UID.
     * @return {number}
     */
    public getColumnIndexByUid(uid: string): number {
        let index: number = iterateArrayOrObject<number, Column>
            (<Column[]>this.getColumns(), (item: Column, index: number) => {
                if (item.uid === uid) {
                    return index;
                }
                return undefined;
            })[0];

        return !isNullOrUndefined(index) ? index : -1;
    }

    /**
     * Gets UID by column name.
     * @param  {string} field - Specifies the column name.
     * @return {string}
     */
    public getUidByColumnField(field: string): string {
        return iterateArrayOrObject<string, Column>(<Column[]>this.getColumns(), (item: Column, index: number) => {
            if (item.field === field) {
                return item.uid;
            }
            return undefined;
        })[0];
    }

    /**
     * Gets TH index by column uid value.
     * @private
     * @param  {string} uid - Specifies the column uid.
     * @return {number}
     */
    public getNormalizedColumnIndex(uid: string): number {
        let index: number = this.getColumnIndexByUid(uid);

        if (this.allowGrouping) {
            index += this.groupSettings.columns.length;
        }

        if (this.isDetail()) {
            index++;
        }
        if (this.allowRowDragAndDrop && this.allowResizing){
            index++;
        }
        /**
         * TODO: index normalization based on the stacked header, grouping and detailTemplate 
         * and frozen should be handled here 
         */
        return index;
    }

    /**
     * Gets the collection of column fields.     
     * @return {string[]}
     */
    public getColumnFieldNames(): string[] {
        let columnNames: string[] = [];
        let column: Column;
        for (let i: number = 0, len: number = this.getColumns().length; i < len; i++) {
            column = this.getColumns()[i] as Column;
            if (column.visible) {
                columnNames.push(column.field);
            }
        }
        return columnNames;
    }

    /**
     * Gets a compiled row template.
     * @return {Function}
     * @private
     */
    public getRowTemplate(): Function {
        return this.rowTemplateFn;
    }

    /**
     * Gets a compiled detail row template.
     * @private
     * @return {Function}
     */
    public getDetailTemplate(): Function {
        return this.detailTemplateFn;
    }

    /**
     * Gets a compiled detail row template.
     * @private
     * @return {Function}
     */
    public getEditTemplate(): Function {
        return this.editTemplateFn;
    }

    /**
     * Get the names of the primary key columns of the Grid. 
     * @return {string[]}
     */
    public getPrimaryKeyFieldNames(): string[] {
        let keys: string[] = [];
        for (let k: number = 0; k < this.columnModel.length; k++) {
            if ((this.columnModel[k] as Column).isPrimaryKey) {
                keys.push((this.columnModel[k] as Column).field);
            }
        }
        return keys;
    }

    /**
     * Refreshes the Grid header and content.
     */
    public refresh(): void {
        this.headerModule.refreshUI();
        this.updateStackedFilter();
        this.renderModule.refresh();
    }

    /**
     * Refreshes the Grid header.
     */
    public refreshHeader(): void {
        this.headerModule.refreshUI();
    }

    /**
     * Gets the collection of selected rows.
     * @return {Element[]}
     */
    public getSelectedRows(): Element[] {
        return this.selectionModule ? this.selectionModule.selectedRecords : [];
    }

    /**
     * Gets the collection of selected row indexes.
     * @return {number[]}
     */
    public getSelectedRowIndexes(): number[] {
        return this.selectionModule ? this.selectionModule.selectedRowIndexes : [];
    }

    /**
     * Gets the collection of selected row and cell indexes.
     * @return {number[]}
     */
    public getSelectedRowCellIndexes(): ISelectedCell[] {
        return this.selectionModule ? this.selectionModule.selectedRowCellIndexes : [];
    }

    /**
     * Gets the collection of selected records. 
     * @return {Object[]}
     * @isGenericType true
     */
    public getSelectedRecords(): Object[] {
        return this.selectionModule ? this.selectionModule.getSelectedRecords() : [];
    }

    /**
     * Gets the data module. 
     * @return {Data}
     */
    public getDataModule(): Data {
        return this.renderModule.data;
    }

    /** 
     * Shows a column by its column name. 
     * @param  {string|string[]} keys - Defines a single or collection of column names. 
     * @param  {string} showBy - Defines the column key either as field name or header text. 
     * @return {void} 
     */
    public showColumns(keys: string | string[], showBy?: string): void {
        showBy = showBy ? showBy : 'headerText';
        this.showHider.show(keys, showBy);
    }

    /** 
     * Hides a column by column name. 
     * @param  {string|string[]} keys - Defines a single or collection of column names. 
     * @param  {string} hideBy - Defines the column key either as field name or header text. 
     * @return {void} 
     */
    public hideColumns(keys: string | string[], hideBy?: string): void {
        hideBy = hideBy ? hideBy : 'headerText';
        this.showHider.hide(keys, hideBy);
    }

    /** 
     * @hidden
     */
    public getFrozenColumns(): number {
        return this.frozenColumns + this.getFrozenCount(this.columns as Column[], 0);
    }

    /** 
     * @hidden
     */
    public getVisibleFrozenColumns(): number {
        return this.getVisibleFrozenColumnsCount() + this.getVisibleFrozenCount(this.columns as Column[], 0);
    }

    private getVisibleFrozenColumnsCount(): number {
        let visibleFrozenColumns: number = 0;
        let col: Column[] = this.columns as Column[];
        for (let i: number = 0; i < this.frozenColumns; i++) {
            if (col[i].visible) {
                visibleFrozenColumns++;
            }
        }
        return visibleFrozenColumns;
    }

    private getVisibleFrozenCount(cols: Column[], cnt: number): number {
        for (let i: number = 0, len: number = cols.length; i < len; i++) {
            if (cols[i].columns) {
                cnt = this.getVisibleFrozenCount(cols[i].columns as Column[], cnt);
            } else {
                if (cols[i].isFrozen && cols[i].visible) {
                    cnt++;
                }
            }
        }
        return cnt;
    }

    private getFrozenCount(cols: Column[], cnt: number): number {
        for (let i: number = 0, len: number = cols.length; i < len; i++) {
            if (cols[i].columns) {
                cnt = this.getFrozenCount(cols[i].columns as Column[], cnt);
            } else {
                if (cols[i].isFrozen) {
                    cnt++;
                }
            }
        }
        return cnt;
    }

    /** 
     * Navigates to the specified target page. 
     * @param  {number} pageNo - Defines the page number to navigate. 
     * @return {void} 
     */
    public goToPage(pageNo: number): void {
        if (this.pagerModule) {
            this.pagerModule.goToPage(pageNo);
        }
    }

    /** 
     * Defines the text of external message.
     * @param  {string} message - Defines the message to update. 
     * @return {void} 
     */
    public updateExternalMessage(message: string): void {
        if (this.pagerModule) {
            this.pagerModule.updateExternalMessage(message);
        }
    }

    /** 
     * Sorts a column with the given options. 
     * @param {string} columnName - Defines the column name to be sorted.  
     * @param {SortDirection} direction - Defines the direction of sorting field.  
     * @param {boolean} isMultiSort - Specifies whether the previous sorted columns are to be maintained. 
     * @return {void} 
     */
    public sortColumn(columnName: string, direction: SortDirection, isMultiSort?: boolean): void {
        if (this.sortModule) {
            this.sortModule.sortColumn(columnName, direction, isMultiSort);
        }
    }

    /**  
     * Clears all the sorted columns of the Grid.  
     * @return {void} 
     */
    public clearSorting(): void {
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
    public removeSortColumn(field: string): void {
        if (this.sortModule) {
            this.sortModule.removeSortColumn(field);
        }
    }

    /** 
     * Filters grid row by column name with the given options. 
     * @param  {string} fieldName - Defines the field name of the column.
     * @param  {string} filterOperator - Defines the operator to filter records.
     * @param  {string | number | Date | boolean} filterValue - Defines the value used to filter records.
     * @param  {string} predicate - Defines the relationship between one filter query and another by using AND or OR predicate.   
     * @param  {boolean} matchCase - If match case is set to true, the grid filters the records with exact match. if false, it filters case 
     * insensitive records (uppercase and lowercase letters treated the same).  
     * @param  {boolean} ignoreAccent - If ignoreAccent set to true, 
     * then filter ignores the diacritic characters or accents while filtering.
     * @param  {string} actualFilterValue - Defines the actual filter value for the filter column. 
     * @param  {string} actualOperator - Defines the actual filter operator for the filter column. 
     * @return {void} 
     */
    public filterByColumn(
        fieldName: string, filterOperator: string, filterValue: string | number | Date | boolean, predicate?: string, matchCase?: boolean,
        ignoreAccent?: boolean, actualFilterValue?: string, actualOperator?: string): void {
        if (this.filterModule) {
            this.filterModule.filterByColumn(
                fieldName, filterOperator, filterValue, predicate, matchCase, ignoreAccent,
                actualFilterValue, actualOperator
            );
        }
    }

    /** 
     * Clears all the filtered rows of the Grid.
     * @return {void} 
     */
    public clearFiltering(): void {
        if (this.filterModule) {
            this.filterModule.clearFiltering();
        }
    }

    /** 
     * Removes filtered column by field name. 
     * @param  {string} field - Defines column field name to remove filter. 
     * @param  {boolean} isClearFilterBar -  Specifies whether the filter bar value needs to be cleared.     
     * @return {void} 
     * @hidden
     */
    public removeFilteredColsByField(field: string, isClearFilterBar?: boolean): void {
        if (this.filterModule) {
            this.filterModule.removeFilteredColsByField(field, isClearFilterBar);
        }
    }

    /** 
     * Selects a row by given index. 
     * @param  {number} index - Defines the row index. 
     * @param  {boolean} isToggle - If set to true, then it toggles the selection.
     * @return {void} 
     */
    public selectRow(index: number, isToggle?: boolean): void {
        if (this.selectionModule) {
            this.selectionModule.selectRow(index, isToggle);
        }
    }

    /** 
     * Selects a collection of rows by indexes. 
     * @param  {number[]} rowIndexes - Specifies the row indexes.
     * @return {void} 
     */
    public selectRows(rowIndexes: number[]): void {
        if (this.selectionModule) {
            this.selectionModule.selectRows(rowIndexes);
        }
    }

    /** 
     * Deselects the current selected rows and cells.
     * @return {void} 
     */
    public clearSelection(): void {
        if (this.selectionModule) {
            this.selectionModule.clearSelection();
        }
    }

    /**
     * Selects a cell by the given index.
     * @param  {IIndex} cellIndex - Defines the row and column indexes. 
     * @param  {boolean} isToggle - If set to true, then it toggles the selection.
     * @return {void}
     */
    public selectCell(cellIndex: IIndex, isToggle?: boolean): void {
        if (this.selectionModule) {
            this.selectionModule.selectCell(cellIndex, isToggle);
        }
    }

    /**
     * Selects a range of cells from start and end indexes. 
     * @param  {IIndex} startIndex - Specifies the row and column's start index.
     * @param  {IIndex} endIndex - Specifies the row and column's end index.
     * @return {void}
     */
    public selectCellsByRange(startIndex: IIndex, endIndex?: IIndex): void {
        this.selectionModule.selectCellsByRange(startIndex, endIndex);
    }

    /** 
     * Searches Grid records using the given key.
     * You can customize the default search option by using the
     * [`searchSettings`](./#searchsettings/).
     * @param  {string} searchString - Defines the key.
     * @return {void} 
     */
    public search(searchString: string): void {
        if (this.searchModule) {
            this.searchModule.search(searchString);
        }
    }

    /**
     * By default, prints all the pages of the Grid and hides the pager.
     * > You can customize print options using the 
     * [`printMode`](./#printmode). 
     * @return {void}
     */
    public print(): void {
        if (this.printModule) {
            this.printModule.print();
        }
    }

    /**
     * Delete a record with Given options. If fieldname and data is not given then grid will delete the selected record.
     * > `editSettings.allowDeleting` should be true.
     * @param {string} fieldname - Defines the primary key field, 'Name of the column'.
     * @param {Object} data - Defines the JSON data of the record to be deleted.
     */
    public deleteRecord(fieldname?: string, data?: Object): void {
        if (this.editModule) {
            this.editModule.deleteRecord(fieldname, data);
        }
    }

    /**
     * Starts edit the selected row. At least one row must be selected before invoking this method.
     * `editSettings.allowEditing` should be true.
     * @return {void}
     */
    public startEdit(): void {
        if (this.editModule) {
            this.editModule.startEdit();
        }
    }

    /**
     * If Grid is in editable state, you can save a record by invoking endEdit.
     */
    public endEdit(): void {
        if (this.editModule) {
            this.editModule.endEdit();
        }
    }

    /**
     * Cancels edited state.
     */
    public closeEdit(): void {
        if (this.editModule) {
            this.editModule.closeEdit();
        }
    }

    /**
     * Adds a new record to the Grid. Without passing parameters, it adds empty rows.
     * > `editSettings.allowEditing` should be true.
     * @param {Object} data - Defines the new add record data.
     * @param {number} index - Defines the row index to be added
     */
    public addRecord(data?: Object, index?: number): void {
        if (this.editModule) {
            this.editModule.addRecord(data, index);
        }
    }

    /**
     * Delete any visible row by TR element.
     * @param {HTMLTableRowElement} tr - Defines the table row element.
     */
    public deleteRow(tr: HTMLTableRowElement): void {
        if (this.editModule) {
            this.editModule.deleteRow(tr);
        }
    }

    /**
     * Changes a particular cell into edited state based on the row index and field name provided in the `batch` mode.
     * @param {number} index - Defines row index to edit a particular cell.
     * @param {string} field - Defines the field name of the column to perform batch edit.
     */
    public editCell(index: number, field: string): void {
        if (this.editModule) {
            this.editModule.editCell(index, field);
        }
    }

    /**
     * Saves the cell that is currently edited. It does not save the value to the DataSource.
     */
    public saveCell(): void {
        if (this.editModule) {
            this.editModule.saveCell();
        }
    }

    /**
     * To update the specified cell by given value without changing into edited state. 
     * @param {number} rowIndex Defines the row index.
     * @param {string} field Defines the column field.
     * @param {string | number | boolean | Date} value - Defines the value to be changed.
     */
    public updateCell(rowIndex: number, field: string, value: string | number | boolean | Date): void {
        if (this.editModule) {
            this.editModule.updateCell(rowIndex, field, value);
        }
    }

    /**
     * To update the specified row by given values without changing into edited state.
     * @param {number} index Defines the row index.
     * @param {Object} data Defines the data object to be updated.
     */
    public updateRow(index: number, data: Object): void {
        if (this.editModule) {
            this.editModule.updateRow(index, data);
        }
    }

    /**
     * Gets the added, edited,and deleted data before bulk save to the DataSource in batch mode.
     * @return {Object}
     */
    public getBatchChanges(): Object {
        if (this.editModule) {
            return this.editModule.getBatchChanges();
        }
        return {};
    }

    /**
     * Enables or disables ToolBar items.
     * @param {string[]} items - Defines the collection of itemID of ToolBar items.
     * @param {boolean} isEnable - Defines the items to be enabled or disabled.
     * @return {void}
     */
    public enableToolbarItems(items: string[], isEnable: boolean): void {
        if (this.toolbarModule) {
            this.toolbarModule.enableItems(items, isEnable);
        }
    }

    /**
     * Copy the selected rows or cells data into clipboard.
     * @param {boolean} withHeader - Specifies whether the column header text needs to be copied along with rows or cells.
     */
    public copy(withHeader?: boolean): void {
        if (this.clipboardModule) {
            this.clipboardModule.copy(withHeader);
        }
    }

    /**    
     * @hidden
     */
    public recalcIndentWidth(): void {
        if (!this.getHeaderTable().querySelector('.e-emptycell')) {
            return;
        }
        if ((!this.groupSettings.columns.length && !this.isDetail() && !this.isRowDragable()) ||
            this.getHeaderTable().querySelector('.e-emptycell').getAttribute('indentRefreshed') ||
            !this.getContentTable()) {
            return;
        }
        let indentWidth: number = (this.getHeaderTable().querySelector('.e-emptycell').parentElement as HTMLElement).offsetWidth;
        let headerCol: HTMLElement[] = [].slice.call(this.getHeaderTable().querySelector('colgroup').childNodes);
        let contentCol: HTMLElement[] = [].slice.call(this.getContentTable().querySelector('colgroup').childNodes);
        let perPixel: number = indentWidth / 30;
        let i: number = 0;
        if (perPixel >= 1) {
            indentWidth = (30 / perPixel);
        }
        if (this.enableColumnVirtualization) { indentWidth = 30; }
        while (i < this.groupSettings.columns.length) {
            headerCol[i].style.width = indentWidth + 'px';
            contentCol[i].style.width = indentWidth + 'px';
            this.notify(events.columnWidthChanged, { index: i, width: indentWidth });
            i++;
        }
        if (this.isDetail()) {
            headerCol[i].style.width = indentWidth + 'px';
            contentCol[i].style.width = indentWidth + 'px';
            this.notify(events.columnWidthChanged, { index: i, width: indentWidth });
            i++;
        }
        if (this.isRowDragable()) {
            headerCol[i].style.width = indentWidth + 'px';
            contentCol[i].style.width = indentWidth + 'px';
            this.notify(events.columnWidthChanged, { index: i, width: indentWidth });
        }
        this.getHeaderTable().querySelector('.e-emptycell').setAttribute('indentRefreshed', 'true');
    }

    /**    
     * @hidden
     */
    public isRowDragable(): boolean {
        return this.allowRowDragAndDrop && !this.rowDropSettings.targetID;
    }


    /** 
     * Changes the Grid column positions by field names. 
     * @param  {string} fromFName - Defines the origin field name. 
     * @param  {string} toFName - Defines the destination field name. 
     * @return {void} 
     */
    public reorderColumns(fromFName: string | string[], toFName: string): void {
        if (this.reorderModule) {
            this.reorderModule.reorderColumns(fromFName, toFName);
        }
    }

    /** 
     * Changes the Grid column positions by field index. If you invoke reorderColumnByIndex multiple times, 
     * then you won't get the same results every time. 
     * @param  {number} fromIndex - Defines the origin field index. 
     * @param  {number} toIndex - Defines the destination field index. 
     * @return {void} 
     */
    public reorderColumnByIndex(fromIndex: number, toIndex: number): void {
        if (this.reorderModule) {
            this.reorderModule.reorderColumnByIndex(fromIndex, toIndex);
        }
    }

    /** 
     * Changes the Grid column positions by field index. If you invoke reorderColumnByTargetIndex multiple times, 
     * then you will get the same results every time. 
     * @param  {string} fieldName - Defines the field name. 
     * @param  {number} toIndex - Defines the destination field index. 
     * @return {void} 
     */
    public reorderColumnByTargetIndex(fieldName: string | string[], toIndex: number): void {
        if (this.reorderModule) {
            this.reorderModule.reorderColumnByTargetIndex(fieldName, toIndex);
        }
    }

    /** 
     * Changes the Grid Row position with given indexes.
     * @param  {number} fromIndexes - Defines the origin Indexes. 
     * @param  {number} toIndex - Defines the destination Index. 
     * @return {void} 
     */
    public reorderRows(fromIndexes: number[], toIndex: number): void {
        if (this.rowDragAndDropModule) {
            this.rowDragAndDropModule.reorderRows(fromIndexes, toIndex);
        }
    }

    /** 
     * @hidden
     */
    public refreshDataSource(e: ReturnType, args: NotifyArgs): void {
        this.notify('refreshdataSource', e);
    }

    /** 
     * @hidden
     */
    public disableRowDD(enable: boolean): void {
        let headerTable: Element = this.getHeaderTable();
        let contentTable: Element = this.getContentTable();
        let headerRows: NodeListOf<Element> = headerTable.querySelectorAll('th.e-rowdragheader, th.e-mastercell');
        let rows: Element[] = this.getRows();
        let disValue: string = enable ? 'none' : '';
        setStyleAttribute(<HTMLElement>headerTable.querySelector('colgroup').childNodes[0], { 'display': disValue });
        setStyleAttribute(<HTMLElement>contentTable.querySelector('colgroup').childNodes[0], { 'display': disValue });
        for (let i: number = 0; i < this.getRows().length; i++) {
            let ele: Element = rows[i].firstElementChild;
            enable ? addClass([ele], 'e-hide') : removeClass([ele], ['e-hide']);
        }
        for (let j: number = 0; j < headerTable.querySelectorAll('th.e-rowdragheader, th.e-mastercell').length; j++) {
            let ele: Element = headerRows[j];
            enable ? addClass([ele], 'e-hide') : removeClass([ele], ['e-hide']);
        }
    }

    /** 
     * Changes the column width to automatically fit its content to ensure that the width shows the content without wrapping/hiding.
     * > * This method ignores the hidden columns.
     * > * Uses the `autoFitColumns` method in the `dataBound` event to resize at initial rendering.
     * @param  {string |string[]} fieldNames - Defines the column names. 
     * @return {void} 
     * 
     * 
     * ```typescript
     * <div id="Grid"></div> 
     * <script>
     * let gridObj: Grid = new Grid({
     *     dataSource: employeeData,
     *     columns: [
     *         { field: 'OrderID', headerText: 'Order ID', width:100 },
     *         { field: 'EmployeeID', headerText: 'Employee ID' }],
     *     dataBound: () => gridObj.autoFitColumns('EmployeeID')
     * });
     * gridObj.appendTo('#Grid');
     * </script>
     * ``` 
     *  
     */
    public autoFitColumns(fieldNames?: string | string[]): void {
        if (this.resizeModule) {
            this.resizeModule.autoFitColumns(fieldNames);
        }
    }

    /** 
     * @hidden
     */
    public createColumnchooser(x: number, y: number, target: Element): void {
        if (this.columnChooserModule) {
            this.columnChooserModule.renderColumnChooser(x, y, target);
        }
    }

    private initializeServices(): void {
        this.serviceLocator.register('widthService', this.widthService = new ColumnWidthService(this));
        this.serviceLocator.register('cellRendererFactory', new CellRendererFactory);
        this.serviceLocator.register('rendererFactory', new RendererFactory);
        this.serviceLocator.register('localization', this.localeObj = new L10n(this.getModuleName(), this.defaultLocale, this.locale));
        this.serviceLocator.register('valueFormatter', this.valueFormatterService = new ValueFormatter(this.locale));
        this.serviceLocator.register('showHideService', this.showHider = new ShowHide(this));
        this.serviceLocator.register('ariaService', this.ariaService = new AriaService());
        this.serviceLocator.register('focus', this.focusModule = new FocusStrategy(this));
    }

    private processModel(): void {
        let gCols: string[] = this.groupSettings.columns;
        let sCols: SortDescriptorModel[] = this.sortSettings.columns;
        let flag: boolean;
        let j: number;
        if (this.allowGrouping) {
            for (let i: number = 0, len: number = gCols.length; i < len; i++) {
                j = 0;
                for (let sLen: number = sCols.length; j < sLen; j++) {
                    if (sCols[j].field === gCols[i]) {
                        flag = true;
                        break;
                    }
                }
                if (!flag) {
                    sCols.push({ field: gCols[i], direction: 'Ascending' });
                } else {
                    if (this.allowSorting) {
                        this.sortedColumns.push(sCols[j].field);
                    } else {
                        sCols[j].direction = 'Ascending';
                    }
                }
                if (!this.groupSettings.showGroupedColumn) {
                    let column: Column = this.enableColumnVirtualization ?
                        (<Column[]>this.columns).filter((c: Column) => c.field === gCols[i])[0] : this.getColumnByField(gCols[i]);
                    if (column) {
                        column.visible = false;
                    } else {
                        this.log('initial_action', { moduleName: 'group', columnName: gCols[i] });
                    }
                }
            }
        }
        if (!gCols.length) {
            sCols.forEach((col: SortDescriptorModel) => {
                this.sortedColumns.push(col.field);
            });
        }
        this.rowTemplateFn = templateCompiler(this.rowTemplate);
        this.detailTemplateFn = templateCompiler(this.detailTemplate);
        this.editTemplateFn = templateCompiler(this.editSettings.template as string);
        if (!isNullOrUndefined(this.parentDetails)) {
            let value: string = isNullOrUndefined(this.parentDetails.parentKeyFieldValue) ? 'undefined' :
                this.parentDetails.parentKeyFieldValue;
            this.query.where(this.queryString, 'equal', value, true);
        }
        this.initForeignColumn();
    }

    private initForeignColumn(): void {
        if (this.isForeignKeyEnabled(this.getColumns())) {
            this.notify(events.initForeignKeyColumn, this.getForeignKeyColumns());
        }
    }

    private gridRender(): void {
        this.updateRTL();
        if (this.enableHover) {
            this.element.classList.add('e-gridhover');
        }
        if (Browser.isDevice) {
            this.element.classList.add('e-device');
        }
        if (this.rowHeight) {
            this.element.classList.add('e-grid-min-height');
        }
        classList(this.element, ['e-responsive', 'e-default'], []);
        let rendererFactory: RendererFactory = this.serviceLocator.getService<RendererFactory>('rendererFactory');
        this.headerModule = rendererFactory.getRenderer(RenderType.Header);
        this.contentModule = rendererFactory.getRenderer(RenderType.Content);
        this.printModule = new Print(this, this.scrollModule);
        this.clipboardModule = new Clipboard(this);
        this.renderModule.render();
        this.eventInitializer();
        this.createGridPopUpElement();
        this.widthService.setWidthToColumns();
        this.updateGridLines();
        this.applyTextWrap();
        this.createTooltip(); //for clip mode ellipsis
        this.enableBoxSelection();
    }

    public dataReady(): void {
        this.scrollModule.setWidth();
        this.scrollModule.setHeight();
        if (this.height !== 'auto') {
            this.scrollModule.setPadding();
        }
    }

    private updateRTL(): void {
        if (this.enableRtl) {
            this.element.classList.add('e-rtl');
        } else {
            this.element.classList.remove('e-rtl');
        }
    }

    private createGridPopUpElement(): void {
        let popup: Element = this.createElement('div', { className: 'e-gridpopup', styles: 'display:none;' });
        let content: Element = this.createElement('div', { className: 'e-content', attrs: { tabIndex: '-1' } });
        append([content, this.createElement('div', { className: 'e-uptail e-tail' })], popup);
        content.appendChild(this.createElement('span'));
        append([content, this.createElement('div', { className: 'e-downtail e-tail' })], popup);
        this.element.appendChild(popup);
    }

    private updateGridLines(): void {
        classList(this.element, [], ['e-verticallines', 'e-horizontallines', 'e-hidelines', 'e-bothlines']);
        switch (this.gridLines) {
            case 'Horizontal':
                this.element.classList.add('e-horizontallines');
                break;
            case 'Vertical':
                this.element.classList.add('e-verticallines');
                break;
            case 'None':
                this.element.classList.add('e-hidelines');
                break;
            case 'Both':
                this.element.classList.add('e-bothlines');
                break;
        }
        this.updateResizeLines();
    }

    private updateResizeLines(): void {
        if (this.allowResizing &&
            !(this.gridLines === 'Vertical' || this.gridLines === 'Both')) {
            this.element.classList.add('e-resize-lines');
        } else {
            this.element.classList.remove('e-resize-lines');
        }
    }

    /**
     * The function is used to apply text wrap
     * @return {void}
     * @hidden
     */
    public applyTextWrap(): void {
        if (this.allowTextWrap) {
            let headerRows: Element[] = [].slice.call(this.element.querySelectorAll('.e-columnheader'));
            switch (this.textWrapSettings.wrapMode) {
                case 'Header':
                    wrap(this.element, false);
                    wrap(this.getContent(), false);
                    wrap(headerRows, true);
                    break;
                case 'Content':
                    wrap(this.getContent(), true);
                    wrap(this.element, false);
                    wrap(headerRows, false);
                    break;
                default:
                    wrap(this.element, true);
                    wrap(this.getContent(), false);
                    wrap(headerRows, false);
            }
        }
    }

    /**
     * The function is used to remove text wrap
     * @return {void}
     * @hidden
     */
    public removeTextWrap(): void {
        wrap(this.element, false);
        let headerRows: Element[] = [].slice.call(this.element.querySelectorAll('.e-columnheader'));
        wrap(headerRows, false);
        wrap(this.getContent(), false);
    }

    /**
     * The function is used to add Tooltip to the grid cell that has ellipsiswithtooltip clip mode.
     * @return {void}
     * @hidden
     */
    public createTooltip(): void {
        this.toolTipObj = new Tooltip({ opensOn: 'custom', content: '' }, this.element);
    }

    private getTooltipStatus(element: HTMLElement): boolean {
        let width: number;
        let headerTable: Element = this.getHeaderTable();
        let contentTable: Element = this.getContentTable();
        let headerDivTag: string = 'e-gridheader';
        let contentDivTag: string = 'e-gridcontent';
        let htable: HTMLDivElement = this.createTable(headerTable, headerDivTag, 'header');
        let ctable: HTMLDivElement = this.createTable(headerTable, headerDivTag, 'content');
        let td: HTMLElement = element;
        let table: HTMLDivElement = headerTable.contains(element) ? htable : ctable;
        let ele: string = headerTable.contains(element) ? 'th' : 'tr';
        table.querySelector(ele).className = element.className;
        table.querySelector(ele).innerHTML = element.innerHTML;
        width = table.querySelector(ele).getBoundingClientRect().width;
        document.body.removeChild(htable);
        document.body.removeChild(ctable);
        if (width > element.getBoundingClientRect().width) {
            return true;
        }
        return false;
    }

    private mouseMoveHandler(e: MouseEvent): void {
        if (this.isEllipsisTooltip()) {
            let element: HTMLElement = parentsUntil((e.target as Element), 'e-ellipsistooltip') as HTMLElement;
            if (this.prevElement !== element || e.type === 'mouseout') {
            this.toolTipObj.close();
            }
            let tagName: string = (e.target as Element).tagName;
            let elemNames: string[] = ['A', 'BUTTON', 'INPUT'];
            if (element && e.type !== 'mouseout' && !(Browser.isDevice && elemNames.indexOf(tagName) !== -1)) {
                if (element.getAttribute('aria-describedby')) {
                    return;
                }
                if (this.getTooltipStatus(element)) {
                    if (element.getElementsByClassName('e-headertext').length) {
                        this.toolTipObj.content = (element.getElementsByClassName('e-headertext')[0] as HTMLElement).innerText;
                    } else {
                        this.toolTipObj.content = element.innerText;
                    }
                    this.prevElement = element;
                    this.toolTipObj.open(element);
                }
            }
        }
    }

    private isEllipsisTooltip(): boolean {
        let cols: Column[] = this.getColumns();
        for (let i: number = 0; i < cols.length; i++) {
            if (cols[i].clipMode === 'EllipsisWithTooltip') {
                return true;
            }
        }
        return false;
    }

    private scrollHandler(): void {
        if (this.isEllipsisTooltip()) {
            this.toolTipObj.close();
        }
    }
    /**
     * To create table for ellipsiswithtooltip 
     * @hidden
     */
    protected createTable(table: Element, tag: string, type: string): HTMLDivElement {
        let myTableDiv: HTMLDivElement = this.createElement('div') as HTMLDivElement;
        myTableDiv.className = this.element.className;
        myTableDiv.style.cssText = 'display: inline-block;visibility:hidden;position:absolute';
        let mySubDiv: HTMLDivElement = this.createElement('div') as HTMLDivElement;
        mySubDiv.className = tag;
        let myTable: HTMLTableElement = this.createElement('table') as HTMLTableElement;
        myTable.className = table.className;
        myTable.style.cssText = 'table-layout: auto;width: auto';
        let ele: string = (type === 'header') ? 'th' : 'td';
        let myTr: HTMLTableRowElement = this.createElement('tr') as HTMLTableRowElement;
        let mytd: HTMLElement = this.createElement(ele) as HTMLElement;
        myTr.appendChild(mytd);
        myTable.appendChild(myTr);
        mySubDiv.appendChild(myTable);
        myTableDiv.appendChild(mySubDiv);
        document.body.appendChild(myTableDiv);
        return myTableDiv;
    }

    private onKeyPressed(e: KeyArg): void {
        if (e.action === 'tab' || e.action === 'shiftTab') {
            this.toolTipObj.close();
        }
    }

    /**
     * Binding events to the element while component creation.
     * @hidden
     */
    public wireEvents(): void {
        EventHandler.add(this.element, 'click', this.mouseClickHandler, this);
        EventHandler.add(this.element, 'touchend', this.mouseClickHandler, this);
        EventHandler.add(this.element, 'focusout', this.focusOutHandler, this);
        EventHandler.add(this.element, 'dblclick', this.dblClickHandler, this);
        EventHandler.add(this.element, 'keydown', this.keyPressHandler, this);
        if (this.allowKeyboard) {
            this.element.tabIndex = this.element.tabIndex === -1 ? 0 : this.element.tabIndex;
        }
        this.keyboardModule = new KeyboardEvents(
            this.element,
            {
                keyAction: this.keyActionHandler.bind(this),
                keyConfigs: this.keyConfigs,
                eventName: 'keydown'
            });
        EventHandler.add(this.getContent().firstElementChild, 'scroll', this.scrollHandler, this);
        EventHandler.add(this.element, 'mousemove', this.mouseMoveHandler, this);
        EventHandler.add(this.element, 'mouseout', this.mouseMoveHandler, this);
    }

    /**
     * Unbinding events from the element while component destroy.
     * @hidden
     */
    public unwireEvents(): void {
        EventHandler.remove(this.element, 'click', this.mouseClickHandler);
        EventHandler.remove(this.element, 'touchend', this.mouseClickHandler);
        EventHandler.remove(this.element, 'focusout', this.focusOutHandler);
        EventHandler.remove(this.getContent().firstElementChild, 'scroll', this.scrollHandler);
        EventHandler.remove(this.element, 'mousemove', this.mouseMoveHandler);
        EventHandler.remove(this.element, 'mouseout', this.mouseMoveHandler);
        EventHandler.remove(this.element,'keydown',this.keyPressHandler);
    }
    /**
     * @hidden
     */
    public addListener(): void {
        if (this.isDestroyed) { return; }
        this.on(events.dataReady, this.dataReady, this);
        this.on(events.contentReady, this.recalcIndentWidth, this);
        this.on(events.headerRefreshed, this.recalcIndentWidth, this);
        this.dataBoundFunction = this.refreshMediaCol.bind(this);
        this.addEventListener(events.dataBound, this.dataBoundFunction);
        this.on(events.keyPressed, this.onKeyPressed, this);
        this.on(events.contentReady, this.blazorTemplate, this);
    }
    /**
     * @hidden
     */
    public removeListener(): void {
        if (this.isDestroyed) { return; }
        this.off(events.dataReady, this.dataReady);
        this.off(events.contentReady, this.recalcIndentWidth);
        this.off(events.headerRefreshed, this.recalcIndentWidth);
        this.removeEventListener(events.dataBound, this.dataBoundFunction);
        this.off(events.keyPressed, this.onKeyPressed);
    }


    private blazorTemplate(): void {
        if (isBlazor()) {
            for (let i: number = 0; i < this.columnModel.length; i++) {

                if (this.columnModel[i].template) {
                    updateBlazorTemplate(this.element.id + this.columnModel[i].uid, 'Template', this.columnModel[i], false);
                }
                if (this.columnModel[i].headerTemplate) {
                    updateBlazorTemplate(this.element.id + this.columnModel[i].uid + 'headerTemplate', 'HeaderTemplate', this.columnModel[i], false);
                }
                if (this.filterSettings.type == 'FilterBar' && this.columnModel[i].filterTemplate) {
                    let fieldName: string = this.columnModel[i].field;
                    let tempID: string = this.element.id + this.columnModel[i].uid + 'filterTemplate';
                    let filteredColumns: PredicateModel[] = this.filterSettings.columns;
                    for (let k: number = 0; k < filteredColumns.length; k++) {
                        if (fieldName == filteredColumns[k].field) {
                            blazorTemplates[tempID][0][fieldName] = filteredColumns[k].value;
                        }
                    }
                    updateBlazorTemplate(this.element.id + this.columnModel[i].uid + 'filterTemplate', 'FilterTemplate', this.columnModel[i], false);
                }
                if (this.filterSettings.type != 'FilterBar' && this.columnModel[i].filterTemplate) {
                    updateBlazorTemplate(this.element.id + this.columnModel[i].uid + 'filterTemplate', 'FilterTemplate', this.columnModel[i]);
                }

            }
            if (this.groupSettings.captionTemplate) {
                updateBlazorTemplate(this.element.id + 'captionTemplate', 'CaptionTemplate', this.groupSettings);
            }
            let guid: string = 'guid';
            for (let k: number = 0; k < this.aggregates.length; k++) {

                for (let j: number = 0; j < this.aggregates[k].columns.length; j++) {
                    if (this.aggregates[k].columns[j].footerTemplate) {
                        updateBlazorTemplate(this.element.id + this.aggregates[k].columns[j][guid] + 'footerTemplate', 'FooterTemplate', this.aggregates[k].columns[j]);
                    }
                    if (this.aggregates[k].columns[j].groupFooterTemplate) {
                        updateBlazorTemplate(this.element.id + this.aggregates[k].columns[j][guid] + 'groupFooterTemplate', 'GroupFooterTemplate', this.aggregates[k].columns[j]);
                    }
                    if (this.aggregates[k].columns[j].groupCaptionTemplate) {
                        updateBlazorTemplate(this.element.id + this.aggregates[k].columns[j][guid] + 'groupCaptionTemplate', 'GroupCaptionTemplate', this.aggregates[k].columns[j]);
                    }
                }
            }
        }
    }
    /** 
     * Get current visible data of grid.
     * @return {Object[]}
     * @hidden
     * @isGenericType true
     */
    public getCurrentViewRecords(): Object[] {
        if (isGroupAdaptive(this)) {
            return isNullOrUndefined((this.currentViewData as Object[] & { records: Object[] }).records) ?
                this.currentViewData : (this.currentViewData as Object[] & { records: Object[] }).records;
        }
        return (this.allowGrouping && this.groupSettings.columns.length && this.currentViewData.length) ?
            (this.currentViewData as Object[] & { records: Object[] }).records : this.currentViewData;
    }

    private mouseClickHandler(e: MouseEvent & TouchEvent): void {
        if (this.isChildGrid(e) || (parentsUntil(e.target as Element, 'e-gridpopup') && e.touches) ||
            this.element.querySelectorAll('.e-cloneproperties').length || this.checkEdit(e)) {
            return;
        }
        if (((!this.allowRowDragAndDrop && (parentsUntil(e.target as Element, 'e-gridcontent') ||
            (e.target as Element).tagName === 'TD')) || (!(this.allowGrouping || this.allowReordering) &&
                parentsUntil(e.target as Element, 'e-gridheader'))) && e.touches) {
            return;
        }
        if (parentsUntil(e.target as Element, 'e-gridheader') && this.allowRowDragAndDrop) {
            e.preventDefault();
        }
        this.notify(events.click, e);
    }

    private checkEdit(e: MouseEvent): boolean {
        let tr: Element = parentsUntil(e.target as Element, 'e-row');
        let isEdit: boolean = this.editSettings.mode !== 'Batch' &&
            this.isEdit && tr && (tr.classList.contains('e-editedrow') || tr.classList.contains('e-addedrow'));
        return !parentsUntil(e.target as Element, 'e-unboundcelldiv') && (isEdit || (parentsUntil(e.target as Element, 'e-rowcell') &&
            parentsUntil(e.target as Element, 'e-rowcell').classList.contains('e-editedbatchcell')));
    }

    private dblClickHandler(e: MouseEvent): void {
        let grid: Element = parentsUntil(e.target as Element, 'e-grid');
        if (isNullOrUndefined(grid) || grid.id !== this.element.id || closest(<Node>e.target, '.e-unboundcelldiv')) {
            return;
        }
        let dataRow: boolean = false;
        let tr: Element = closest(<Node>e.target, 'tr');
        if (tr && tr.getAttribute('data-uid')) {
            let rowObj: Row<Column> = this.getRowObjectFromUID(tr.getAttribute('data-uid'))
            dataRow = rowObj ? rowObj.isDataRow : false;
        }
        let args: RecordDoubleClickEventArgs = this.getRowInfo(e.target as Element) as RecordDoubleClickEventArgs;
        args.target = e.target as Element;
        if (dataRow) {
            this.trigger(events.recordDoubleClick, args);
        }
        this.notify(events.dblclick, e);
    }

    private focusOutHandler(e: MouseEvent): void {
        if (this.isChildGrid(e)) {
            return;
        }
        if (!parentsUntil(e.target as Element, 'e-grid')) {
            (this.element.querySelector('.e-gridpopup') as HTMLElement).style.display = 'None';
        }
        let filterClear: Element = this.element.querySelector('.e-cancel:not(.e-hide)');
        if (filterClear) {
            filterClear.classList.add('e-hide');
        }
        let relatedTarget: HTMLElement = e.relatedTarget as HTMLElement;
        let ariaOwns: string = relatedTarget ? relatedTarget.getAttribute('aria-owns') : null;
        if ((!relatedTarget || (!parentsUntil(relatedTarget, 'e-grid') &&
            (!isNullOrUndefined(ariaOwns) &&
                (ariaOwns)) !== (e.target as Element).getAttribute('aria-owns')))
            && !this.keyPress && this.isEdit && !Browser.isDevice) {
            if (this.editSettings.mode === 'Batch') {
                this.editModule.saveCell();
                this.notify(events.editNextValCell, {});
            }
            if (this.editSettings.mode === 'Normal') {
                this.editModule.editFormValidate();
            }
        }
        this.keyPress = false;
    }

    private isChildGrid(e: MouseEvent | KeyboardEvent | TouchEvent): boolean {
        let gridElement: Element = parentsUntil((e.target as HTMLElement), 'e-grid');
        if (gridElement && gridElement.id !== this.element.id) {
            return true;
        }
        return false;
    }

    private mergePersistGridData(): void {
        let data: string = window.localStorage.getItem(this.getModuleName() + this.element.id);
        if (!(isNullOrUndefined(data) || (data === ''))) {
            let dataObj: Grid = JSON.parse(data);
            if (this.enableVirtualization) {
                dataObj.pageSettings.currentPage = 1;
            }
            let keys: string[] = Object.keys(dataObj);
            this.isProtectedOnChange = true;
            for (let key of keys) {
                if ((typeof this[key] === 'object') && !isNullOrUndefined(this[key])) {
                    if (Array.isArray(this[key]) && key === 'columns') {
                        setColumnIndex(<Column[]>this[key]);
                        this.mergeColumns(<Column[]>dataObj[key], <Column[]>this[key]);
                        this[key] = dataObj[key];
                    } else {
                        extend(this[key], dataObj[key]);
                    }
                } else {
                    this[key] = dataObj[key];
                }
            }
            this.isProtectedOnChange = false;
        }
    }

    private mergeColumns(storedColumn: Column[], columns: Column[]): void {
        (<Column[]>storedColumn).forEach((col: Column, index: number, arr: Column[]) => {
            let localCol = columns.filter((tCol: Column) => tCol.index === col.index)[0];
                if (!isNullOrUndefined(localCol)) {
                    if (localCol.columns && localCol.columns.length) {
                        this.mergeColumns(<Column[]>col.columns, <Column[]>localCol.columns);
                        arr[index] = <Column>extend(localCol, col, true);
                    } else {
                        arr[index] = <Column>extend(localCol, col, true);
                    }
                }   
        });
    }

    /** 
     * @hidden
     */
    public isDetail(): boolean {
        return !isNullOrUndefined(this.detailTemplate) || !isNullOrUndefined(this.childGrid);
    }

    private isCommandColumn(columns: Column[]): boolean {
        return columns.some((col: Column) => {
            if (col.columns) {
                return this.isCommandColumn(col.columns as Column[]);
            }
            return !!(col.commands || col.commandsTemplate);
        });
    }

    private isForeignKeyEnabled(columns: Column[]): boolean {
        return columns.some((col: Column) => {
            if (col.columns) {
                return this.isForeignKeyEnabled(col.columns as Column[]);
            }
            return !!(col.dataSource && col.foreignKeyValue);
        });
    }

    private keyPressHandler(e: KeyboardEventArgs): void {
        let presskey: KeyboardEventArgs = <KeyboardEventArgs>extend(e, { cancel: false, });
        this.trigger("keyPressed", presskey);
        if (presskey.cancel === true) {
            e.stopImmediatePropagation();
        }
    }
     
    private keyActionHandler(e: KeyArg): void {
        this.keyPress = e.action !== 'space';
        if (this.isChildGrid(e) ||
            (this.isEdit && e.action !== 'escape' && e.action !== 'enter' && e.action !== 'shiftEnter'
                && e.action !== 'tab' && e.action !== 'shiftTab')) {
            return;
        }
        if (this.allowKeyboard) {
            if (e.action === 'ctrlPlusP') {
                e.preventDefault();
                this.print();
            }
            this.notify(events.keyPressed, e);
        }
    }
    /**
     * @hidden
     */
    public setInjectedModules(modules: Function[]): void {
        this.injectedModules = modules;
    }

    private updateColumnObject(): void {
        prepareColumns(this.columns, this.enableColumnVirtualization);
        setColumnIndex(this.columns as Column[]);
        this.initForeignColumn();
        this.notify(events.autoCol, {});
    }
    /**
     * Gets the foreign columns from Grid.
     * @return {Column[]}
     */
    public getForeignKeyColumns(): Column[] {
        return this.getColumns().filter((col: Column) => {
            return col.isForeignColumn();
        });
    }

    /**
     * @hidden
     */
    public getRowHeight(): number {
        return this.rowHeight ? this.rowHeight : getRowHeight(this.element);
    }

    /**
     * Refreshes the Grid column changes.
     */
    public refreshColumns(): void {
        this.isPreventScrollEvent = true;
        this.updateColumnObject();
        this.checkLockColumns(this.getColumns());
        this.refresh();
    }
    /**
     * Export Grid data to Excel file(.xlsx).
     * @param  {ExcelExportProperties} excelExportProperties - Defines the export properties of the Grid.
     * @param  {boolean} isMultipleExport - Define to enable multiple export.
     * @param  {workbook} workbook - Defines the Workbook if multiple export is enabled.
     * @param  {boolean} isBlob - If 'isBlob' set to true, then it will be returned as blob data.
     * @return {Promise<any>} 
     */
    public excelExport(
        excelExportProperties?: ExcelExportProperties, isMultipleExport?: boolean,
        /* tslint:disable-next-line:no-any */
        workbook?: any, isBlob?: boolean): Promise<any> {
        return this.excelExportModule ?
            this.excelExportModule.Map(this, excelExportProperties, isMultipleExport, workbook, false, isBlob) : null;
    }

    /**
     * Export Grid data to CSV file.
     * @param  {ExcelExportProperties} excelExportProperties - Defines the export properties of the Grid.
     * @param  {boolean} isMultipleExport - Define to enable multiple export.
     * @param  {workbook} workbook - Defines the Workbook if multiple export is enabled.
     * @param  {boolean} isBlob - If 'isBlob' set to true, then it will be returned as blob data.
     * @return {Promise<any>} 
     * 
     */
    public csvExport(
        excelExportProperties?: ExcelExportProperties,
        /* tslint:disable-next-line:no-any */
        isMultipleExport?: boolean, workbook?: any, isBlob?: boolean): Promise<any> {
        return this.excelExportModule ?
            this.excelExportModule.Map(this, excelExportProperties, isMultipleExport, workbook, true, isBlob) : null;
    }
    /**
     * Export Grid data to PDF document.
     * @param  {pdfExportProperties} PdfExportProperties - Defines the export properties of the Grid.
     * @param  {isMultipleExport} isMultipleExport - Define to enable multiple export.
     * @param  {pdfDoc} pdfDoc - Defined the Pdf Document if multiple export is enabled.
     * @param  {boolean} isBlob - If 'isBlob' set to true, then it will be returned as blob data.
     * @return {Promise<any>} 
     * 
     */
    public pdfExport(
        pdfExportProperties?: PdfExportProperties,
        /* tslint:disable-next-line:no-any */
        isMultipleExport?: boolean, pdfDoc?: Object, isBlob?: boolean): Promise<Object> {
        return this.pdfExportModule ? this.pdfExportModule.Map(this, pdfExportProperties, isMultipleExport, pdfDoc, isBlob) : null;
    }

    /** 
     * Groups a column by column name. 
     * @param  {string} columnName - Defines the column name to group.  
     * @return {void} 
     */
    public groupColumn(columnName: string): void {
        if (this.groupModule) {
            this.groupModule.groupColumn(columnName);
        }
    }
    /** 
     * Expands all the grouped rows of the Grid.          
     * @return {void} 
     */
    public groupExpandAll(): void {
        if (this.groupModule) {
            this.groupModule.expandAll();
        }
    }
    /** 
    * Collapses all the grouped rows of the Grid.         
    * @return {void} 
    */
    public groupCollapseAll(): void {
        if (this.groupModule) {
            this.groupModule.collapseAll();
        }
    }

    /**  
     * Expands or collapses grouped rows by target element. 
     * @param  {Element} target - Defines the target element of the grouped row.      
     * @return {void}  
     */
    // public expandCollapseRows(target: Element): void {
    //     if (this.groupModule) {
    //         this.groupModule.expandCollapseRows(target);
    //     }
    // }

    /**  
     * Clears all the grouped columns of the Grid.  
     * @return {void} 
     */
    public clearGrouping(): void {
        if (this.groupModule) {
            this.groupModule.clearGrouping();
        }
    }
    /** 
     * Ungroups a column by column name. 
     * @param  {string} columnName - Defines the column name to ungroup.  
     * @return {void} 
     */
    public ungroupColumn(columnName: string): void {
        if (this.groupModule) {
            this.groupModule.ungroupColumn(columnName);
        }
    }

    /** 
     * Column chooser can be displayed on screen by given position(X and Y axis). 
     * @param  {number} X - Defines the X axis.
     * @param  {number} Y - Defines the Y axis. 
     * @return {void}
     */
    public openColumnChooser(x?: number, y?: number): void {
        if (this.columnChooserModule) {
            this.columnChooserModule.openColumnChooser(x, y);
        }
    }

    /** 
     * Collapses a detail row with the given target.     
     * @param  {Element} target - Defines the expanded element to collapse.
     * @return {void} 
     */
    // public detailCollapse(target: number | Element): void {
    //     if (this.detailRowModule) {
    //         this.detailRowModule.collapse(target);
    //     }
    // }

    /** 
     * Collapses all the detail rows of the Grid.         
     * @return {void} 
     */
    public detailCollapseAll(): void {
        if (this.detailRowModule) {
            this.detailRowModule.collapseAll();
        }
    }

    /** 
     * Expands a detail row with the given target.  
     * @param  {Element} target - Defines the collapsed element to expand.
     * @return {void} 
     */
    // public detailExpand(target: number | Element): void {
    //     if (this.detailRowModule) {
    //         this.detailRowModule.expand(target);
    //     }
    // }

    /** 
    * Expands all the detail rows of the Grid.          
    * @return {void} 
    */
    public detailExpandAll(): void {
        if (this.detailRowModule) {
            this.detailRowModule.expandAll();
        }
    }

    /** 
     * Deselects the currently selected cells.
     * @return {void} 
     */
    public clearCellSelection(): void {
        if (this.selectionModule) {
            this.selectionModule.clearCellSelection();
        }
    }

    /** 
     * Deselects the currently selected rows.
     * @return {void} 
     */
    public clearRowSelection(): void {
        if (this.selectionModule) {
            this.selectionModule.clearRowSelection();
        }
    }

    /**
     * Selects a collection of cells by row and column indexes. 
     * @param  {ISelectedCell[]} rowCellIndexes - Specifies the row and column indexes.
     * @return {void}
     */
    public selectCells(rowCellIndexes: ISelectedCell[]): void {
        if (this.selectionModule) {
            this.selectionModule.selectCells(rowCellIndexes);
        }
    }

    /** 
     * Selects a range of rows from start and end row indexes. 
     * @param  {number} startIndex - Specifies the start row index. 
     * @param  {number} endIndex - Specifies the end row index. 
     * @return {void} 
     */
    public selectRowsByRange(startIndex: number, endIndex?: number): void {
        if (this.selectionModule) {
            this.selectionModule.selectRowsByRange(startIndex, endIndex);
        }
    }

    /** 
     * @hidden
     */
    public isContextMenuOpen(): boolean {
        return this.contextMenuModule && this.contextMenuModule.isOpen;
    }

    /** 
     * @hidden
     */
    public ensureModuleInjected(module: Function): boolean {
        return this.getInjectedModules().indexOf(module) >= 0;
    }

    /**
     * Destroys the given template reference.
     * @param {string[]} propertyNames - Defines the collection of template name.
     */
    //tslint:disable-next-line:no-any
    public destroyTemplate(propertyNames?: string[], index?: any): void {
        this.clearTemplate(propertyNames, index);
    }

    /**
     * @hidden
     * @private
     */
    public log(type: string | string[], args?: Object): void {
        this.loggerModule ? this.loggerModule.log(type, args) : (() => 0)();
    }

    /**
     * @hidden
     */
    public applyBiggerTheme(element:Element) :void{
        if(this.element.classList.contains('e-bigger')) {      
          element.classList.add('e-bigger');
        }
    }

    /** 
     * @hidden
     */
    public getPreviousRowData(): Object {
        let previousRowData: Object = this.getRowsObject()[this.getRows().length - 1].data;
        return previousRowData;
    }

    /** 
     * Hides the scrollbar placeholder of Grid content when grid content is not overflown.  
     * @return {void} 
     */
    public hideScroll(): void {
        let content: HTMLElement = this.getContent().querySelector('.e-content');
        let cTable: HTMLElement = content.querySelector('.e-movablecontent') ? content.querySelector('.e-movablecontent') : content;
        let fTable: HTMLElement = content.querySelector('.e-frozencontent') ? content.querySelector('.e-frozencontent') : content;
        if (cTable.scrollHeight <= cTable.clientHeight && fTable.scrollHeight <= fTable.clientHeight) {
            this.scrollModule.removePadding();
            cTable.style.overflowY = 'auto';
        }
        if (this.frozenColumns && cTable.scrollWidth <= cTable.clientWidth) {
            cTable.style.overflowX = 'auto';
            cTable.style.overflowY = 'auto';
            this.notify(events.frozenHeight, 0);
        }
    }

    /** 
     * Get row index by primary key or row data.
     * @param  {string} value - Defines the primary key value.
     * @param  {Object} value - Defines the row data.
     */
    public getRowIndexByPrimaryKey(value: string | Object): number {
        let pkName: string = this.getPrimaryKeyFieldNames()[0];
        value = typeof value === 'object' ? value[pkName] : value;
        for (let i: number = 0; i < this.getRowsObject().length; i++) {
            if (this.getRowsObject()[i].data[pkName] === value) {
                return this.getRowsObject()[i].index;
            }
        }
        return -1;
    };
     /** 
     * @hidden
     */
    // Need to have all columns while filtering with ColumnVirtualization.
    public grabColumnByFieldFromAllCols(field: string): Column {
        let column : Column;
        this.columnModel = [];
        this.updateColumnModel(this.columns as Column[]);
        this.columnModel.forEach((gCol: Column) => {
            if (field === gCol.field) {
                column = gCol;
            }
        });
        return column;
    }
     /** 
     * @hidden
     */
     // Need to have all columns while filtering with ColumnVirtualization.
    public grabColumnByUidFromAllCols(uid: string): Column {
        let column : Column;
        this.columnModel = [];
        this.updateColumnModel(this.columns as Column[]);
        this.columnModel.forEach((gCol: Column) => {
            if (uid === gCol.uid) {
                column = gCol;
            }
        });
        return column;
    }
}
