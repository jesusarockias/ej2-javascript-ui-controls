import { BaseEventArgs } from '@syncfusion/ej2-base';
import { ItemModel } from '@syncfusion/ej2-navigations';
import { PopupType, ExcelFormat } from './type';
import { ResourcesModel, ViewsModel } from '../models/models';

/**
 * Interface
 */
export interface ActionEventArgs extends BaseEventArgs {
    /** Returns the request type of the current action. */
    requestType: string;
    /**
     * Defines the type of the event.
     * @blazorType UIMouseEventArgs
     */
    event?: Event;
    /** Defines the cancel option for the action taking place. */
    cancel: boolean;
    /** Returns the appropriate data based on the action. */
    data?: Object;
    /** Returns the clicked resource row index. */
    groupIndex?: number;
    /** 
     * Returns the appropriate added data based on the action.
     * @isGenericType true
     */
    addedRecords?: Object[];
    /** 
     * Returns the appropriate changed data based on the action.
     * @isGenericType true
     */
    changedRecords?: Object[];
    /** 
     * Returns the appropriate deleted data based on the action.
     * @isGenericType true
     */
    deletedRecords?: Object[];
}

export interface ToolbarActionArgs extends BaseEventArgs {
    /** Returns the request type of the current action. */
    requestType: string;
    /** Returns the toolbar items present in the Schedule header bar. */
    items: ItemModel[];
}

export interface CellClickEventArgs extends BaseEventArgs {
    /** Returns the start time of the cell. */
    startTime: Date;
    /** Returns the end time of the cell. */
    endTime: Date;
    /** Returns true or false, based on whether the clicked cell is all-day or not. */
    isAllDay: boolean;
    /** Returns the single or collection of HTML element(s).
     * @blazorType DOM
     */
    element?: HTMLElement | HTMLElement[];
    /** Defines the cancel option. */
    cancel?: boolean;
    /**
     * Defines the type of the event.
     * @blazorType UIMouseEventArgs
     */
    event?: Event;
    /** Returns the group index of the cell. */
    groupIndex?: number;
}

export interface SelectEventArgs extends BaseEventArgs {
    /** Returns the request type of the current action. */
    requestType: string;
    /** 
     * Defines the type of the event.
     * @blazorType UIMouseEventArgs
     */
    event?: Event;
    /** Returns the single or collection of HTML element(s). */
    element: HTMLElement | HTMLElement[];
    /** Determines whether to open the quick popup on multiple cell selection. */
    showQuickPopup?: boolean;
    /** Determines whether to select multiple row. */
    allowMultipleRow?: boolean;
    /**
     * Return the appropriate cell or event data based on the action.
     * @isGenericType true
     */
    data?: { [key: string]: Object } | { [key: string]: Object }[];
    /** Returns the clicked resource row index. */
    groupIndex?: number;
}

export interface EventClickArgs extends BaseEventArgs {
    /**
     * Returns the date of the event.
     * @deprecated
     */
    date?: Date;
    /**
     * Returns a single or collection of selected or clicked events.
     * @isGenericType true
     */
    event: { [key: string]: Object } | { [key: string]: Object }[];
    /** Returns the single or collection of HTML element(s). */
    element: HTMLElement | HTMLElement[];
    /** Defines the cancel option. */
    cancel?: boolean;
}

export interface EventRenderedArgs extends BaseEventArgs {
    /**
     * Returns the event data.
     * @isGenericType true
     */
    data: { [key: string]: Object };
    /** Returns the event element which is currently being rendered on the UI. */
    element: HTMLElement;
    /** Defines the cancel option. */
    cancel: boolean;
    /** Returns the type of the event element which is currently being rendered on the Scheduler. */
    type?: string;
}

export interface PopupOpenEventArgs extends BaseEventArgs {
    /** Returns the type of the popup which is currently being opted to open. */
    type: PopupType;
    /**
     * Returns the cell or event data.
     * @isGenericType true
     */
    data?: Object;
    /** Returns the target element on which the popup is getting opened. */
    target?: Element;
    /** Returns the popup wrapper element. */
    element: Element;
    /** Defines the cancel option. */
    cancel: boolean;
    /** Allows to specify the time duration to be used on editor window,
     *  based on which the start and end time fields will display the time values. By default, it
     *  will be processed based on the `interval` value within the `timeScale` property. 
     */
    duration?: number;
}

export interface NavigatingEventArgs extends BaseEventArgs {
    /** Returns the action type either as `date` or `view` due to which the navigation takes place. */
    action: string;
    /** Defines the cancel option. */
    cancel: boolean;
    /** Returns the date value before date navigation takes place. */
    previousDate?: Date;
    /** Returns the current date value after navigation takes place. */
    currentDate?: Date;
    /** Returns the view name before the view navigation takes place. */
    previousView?: string;
    /** Returns the active view name after the view navigation takes place. */
    currentView?: string;
}

export interface RenderCellEventArgs extends BaseEventArgs {
    /** Returns the type of the elements which is currently being rendered on the UI. */
    elementType: string;
    /** Returns the actual HTML element on which the required custom styling can be applied. */
    element: Element;
    /** Returns the date value of the cell that is currently rendering on UI. */
    date?: Date;
    /** Returns the group index of the cell. */
    groupIndex?: number;
}

export interface ResizeEventArgs extends BaseEventArgs {
    /** Returns the resize element. */
    element: HTMLElement;
    /**
     * Returns the resize event data.
     * @isGenericType true
     */
    data: { [key: string]: Object };
    /**
     * Returns the mouse event.
     * @blazorType UIMouseEventArgs
     */
    event: MouseEvent;
    /** Defines the cancel option. */
    cancel?: boolean;
    /** Returns the start time of the clone element. */
    startTime?: Date;
    /** Returns the end time of the clone element. */
    endTime?: Date;
    /** Returns the group index of the clone element. */
    groupIndex?: number;
    /** Allows to define the interval in minutes for resizing the appointments. */
    interval?: number;
    /** Allows to define the scroll related actions while resizing to the edges of scheduler. */
    scroll?: ScrollOptions;
}

export interface DragEventArgs extends BaseEventArgs {
    /** Returns the drag element. */
    element: HTMLElement;
    /**
     * Returns the dragged event data.
     * @isGenericType true
     */
    data: { [key: string]: Object };
     /**
      * Returns the mouse event.
      * @blazorType UIMouseEventArgs
      */
    event: MouseEvent;
    /** Defines the cancel option. */
    cancel?: boolean;
    /** Returns the start time of the clone element. */
    startTime?: Date;
    /** Returns the end time of the clone element. */
    endTime?: Date;
    /** Returns the group index of the clone element. */
    groupIndex?: number;
    /** Defines the selectors to cancel the drop on selector target. */
    excludeSelectors?: string;
    /** Allows to define the interval in minutes for dragging the appointments. */
    interval?: number;
    /** Allows to define the scroll related actions while dragging to the edges of scheduler. */
    scroll?: ScrollOptions;
    /** Defines the date range navigation action while dragging. */
    navigation?: NavigateOptions;
}

/** An interface that holds options to control the navigation, while performing drag action on appointments. */
export interface NavigateOptions {
    /** Allows to enable or disable the auto navigation while performing drag action on appointments. */
    enable: boolean;
    /** Allows to define the time delay value while navigating. */
    timeDelay: number;
}

/** An interface that holds options to control the scrolling action while performing drag and resizing action on appointments. */
export interface ScrollOptions {
    /** Allows to enable or disable the auto scrolling while performing drag and resizing action on appointments. */
    enable: boolean;
    /** Allows to define the scroll step value. */
    scrollBy: number;
    /** Allows to define the time delay value while scrolling. */
    timeDelay: number;
}

/** @hidden */
export interface TdData {
    date?: Date;
    renderDates?: Date[];
    groupOrder?: string[];
    groupIndex?: number;
    className?: string[];
    colSpan?: number;
    rowSpan?: number;
    type: string;
    resourceLevelIndex?: number;
    resource?: ResourcesModel;
    resourceData?: { [key: string]: Object };
    startHour?: Date;
    endHour?: Date;
    workDays?: number[];
    cssClass?: string;
    template?: NodeList | Element[];
}

/** @hidden */
export interface TimeSlotData extends TdData {
    first: boolean;
    middle: boolean;
    last: boolean;
}

/** @hidden */
export interface KeyEventArgs {
    element: HTMLTableElement;
    rowIndex: number;
    columnIndex: number;
    maxIndex: number;
}

/** @hidden */
export interface CellTemplateArgs {
    date: Date;
    type: string;
    groupIndex?: number;
}

export interface ResourceDetails {
    /** Returns the resource model data such as the field mapping options used within it. */
    resource: ResourcesModel;
    /**
     * Returns the child resource data.
     * @isGenericType true
     */
    resourceData: { [key: string]: Object };
    /** Returns the respective resource fields data. */
    groupData?: { [key: string]: Object };
}

/** @hidden */
export interface CrudArgs extends ActionEventArgs {
    promise?: Promise<Object>;
    editParms?: SaveChanges;
}

/** @hidden */
export interface IRenderer {
    element: HTMLElement;
    renderDates: Date[];
    viewClass: string;
    isInverseTableSelect: boolean;
    isCurrentDate(date: Date): boolean;
    startDate(): Date;
    endDate(): Date;
    scrollToHour?(hour: string): void;
    highlightCurrentTime?(): void;
    getStartHour(): Date;
    getEndHour(): Date;
    getLabelText(view: string): string;
    getDateRangeText(): string;
    getEndDateFromStartDate(date: Date): Date;
    addEventListener(): void;
    removeEventListener(): void;
    getRenderDates(workDays?: number[]): Date[];
    getContentRows(): Element[];
    getEventRows(trCount: number): Element[];
    getDateSlots(renderDates: Date[], workDays: number[]): TdData[];
    getNextPreviousDate(type: string): Date;
    renderLayout(type: string): void;
    renderResourceMobileLayout(): void;
    setPanel(panel: HTMLElement): void;
    getPanel(): HTMLElement;
    generateColumnLevels(): TdData[][];
    getColumnLevels(): TdData[][];
    createTableLayout(className?: string): Element;
    setResourceHeaderContent(tdElement: Element, tdData: TdData, className: string): void;
    destroy(): void;
    isTimelineView(): boolean;
    setColWidth(content: HTMLElement): void;
    resetColWidth(): void;
}

/** @hidden */
export interface EJ2Instance extends HTMLElement {
    ej2_instances: Object[];
}

/** @hidden */
export interface ScrollCss {
    padding?: string;
    border?: string;
}

/** @hidden */
export interface NotifyEventArgs {
    module?: string;
    cssProperties?: ScrollCss;
    processedData?: Object[];
    isPreventScrollUpdate?: boolean;
    scrollPosition?: { [key: string]: Object };
}

/** @hidden */
export interface LayoutData {
    element: HTMLElement;
    selectedDate: Date;
}

/** @hidden */
export interface PopupEventArgs {
    classList?: string[];
    data?: string[] | { [key: string]: Object }[];
    fields?: EventFieldsMapping;
    id?: string;
    l10n?: { [key: string]: Object };
}

/** @hidden */
export interface EventFieldsMapping {
    id?: string;
    isBlock?: string;
    subject?: string;
    startTime?: string;
    endTime?: string;
    startTimezone?: string;
    endTimezone?: string;
    location?: string;
    description?: string;
    isAllDay?: string;
    recurrenceID?: string;
    recurrenceRule?: string;
    recurrenceException?: string;
    isReadonly?: string;
    followingID?: string;
}

/** @hidden */
export interface ElementData {
    index: number;
    left: string;
    width: string;
    day: number;
    dayIndex: number;
    record: { [key: string]: Object };
    resource: number;
}

/** @hidden */
export interface SaveChanges {
    addedRecords: Object[];
    changedRecords: Object[];
    deletedRecords: Object[];
}

/** @hidden */
export interface UIStateArgs {
    expand?: boolean;
    isInitial?: boolean;
    left?: number;
    top?: number;
    isGroupAdaptive?: boolean;
    isIgnoreOccurrence?: boolean;
    groupIndex?: number;
    action?: boolean;
    isBlock?: boolean;
    viewIndex?: number;
}

/** @hidden */
export interface TreeViewArgs {
    resourceChild?: TreeViewArgs[];
    resourceId?: string;
    resourceName?: string;
}

/** @hidden */
export interface ResizeEdges {
    left: boolean;
    right: boolean;
    top: boolean;
    bottom: boolean;
}

/** @hidden */
export interface ActionBaseArgs {
    X?: number;
    Y?: number;
    pageX?: number;
    pageY?: number;
    target?: EventTarget;
    scrollInterval?: number;
    start?: Date;
    end?: Date;
    isAllDay?: boolean;
    action?: string;
    navigationInterval?: number;
    index?: number;
    height?: number;
    width?: number;
    interval?: number;
    cellWidth?: number;
    cellHeight?: number;
    groupIndex?: number;
    actionIndex?: number;
    slotInterval?: number;
    clone?: HTMLElement;
    element?: HTMLElement;
    cloneElement?: HTMLElement[];
    originalElement?: HTMLElement[];
    event?: { [key: string]: Object };
    excludeSelectors?: string;
    scroll?: ScrollOptions;
    navigation?: NavigateOptions;
}

/** @hidden */
export interface StateArgs {
    isRefresh: boolean;
    isResource: boolean;
    isView: boolean;
    isDate: boolean;
    isLayout: boolean;
    isDataManager: boolean;
}

export interface ExportOptions {
    /** The fileName denotes the name to be given for the exported file. */
    fileName?: string;
    /** The exportType allows you to set the format of an Excel file to be exported either as .xlsx or .csv. */
    exportType?: ExcelFormat;
    /** The custom or specific field collection of event dataSource to be exported can be provided through fields option. */
    fields?: string[];
    /** The custom data collection can be exported by passing them through the customData option. */
    customData?: { [key: string]: Object }[];
    /** There also exists option to export each individual instances of the recurring events to an Excel file, 
     * by setting true or false to the `includeOccurrences` option, denoting either to include or exclude 
     * the occurrences as separate instances on an exported Excel file. 
     */
    includeOccurrences?: boolean;
}

export interface PredicateData {
    field: string;
    operator: Function;
    value: string;
}

export interface ViewsData extends ViewsModel {
    dateHeaderTemplateName?: string;
    cellTemplateName?: string;
    resourceHeaderTemplateName?: string;
    eventTemplateName?: string;
}

export interface DataBoundEventArgs extends BaseEventArgs {
    /**
     * Returns the result data.
     * @isGenericType true
     */
    result: Object[];
    count?: number;
    aggregates?: Object;
}

export interface DataBindingEventArgs extends BaseEventArgs {
    /**
     * Returns the result data.
     * @isGenericType true
     */
    result: Object[];
    count?: number;
    aggregates?: Object;
}
