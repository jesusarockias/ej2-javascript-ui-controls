import { isNullOrUndefined, NumberFormatOptions, DateFormatOptions, extend } from '@syncfusion/ej2-base';
import { Query, DataManager, Predicate, Deferred, UrlAdaptor } from '@syncfusion/ej2-data';
import { IDataProcessor, IGrid, DataStateChangeEventArgs, DataSourceChangedEventArgs, PendingState } from '../base/interface';
import { ReturnType } from '../base/type';
import { SearchSettingsModel, PredicateModel, SortDescriptorModel } from '../base/grid-model';
import { setFormatter, getDatePredicate, isGroupAdaptive, getColumnByForeignKeyValue, refreshFilteredColsUid } from '../base/util';
import { AggregateRowModel, AggregateColumnModel } from '../models/models';
import * as events from '../base/constant';
import { ValueFormatter } from '../services/value-formatter';
import { ServiceLocator } from '../services/service-locator';
import { Column, ColumnModel } from '../models/column';
import { CheckBoxFilter } from '../actions/checkbox-filter';
import { SortDirection } from '../base/enum';

/**
 * Grid data module is used to generate query and data source.
 * @hidden
 */
export class Data implements IDataProcessor {
    //Internal variables   
    public dataManager: DataManager;

    //Module declarations    
    protected parent: IGrid;
    protected serviceLocator: ServiceLocator;
    protected dataState: PendingState = { isPending: false, resolver: null, group: [] };

    /**
     * Constructor for data module.
     * @hidden
     */
    constructor(parent?: IGrid, serviceLocator?: ServiceLocator) {
        this.parent = parent;
        this.serviceLocator = serviceLocator;
        this.initDataManager();
        if (this.parent.isDestroyed || this.getModuleName() === 'foreignKey') { return; }
        this.parent.on(events.rowsAdded, this.addRows, this);
        this.parent.on(events.rowPositionChanged, this.reorderRows, this);
        this.parent.on(events.rowsRemoved, this.removeRows, this);
        this.parent.on(events.dataSourceModified, this.initDataManager, this);
        this.parent.on(events.destroy, this.destroy, this);
        this.parent.on(events.updateData, this.crudActions, this);
        this.parent.on(events.addDeleteAction, this.getData, this);
        this.parent.on(events.autoCol, this.refreshFilteredCols, this);
    }

    private reorderRows(e: { fromIndex: number, toIndex: number }): void {
        this.dataManager.dataSource.json.splice(e.toIndex, 0, this.dataManager.dataSource.json.splice(e.fromIndex, 1)[0]);
    }

    protected getModuleName(): string {
        return 'data';
    }

    /**
     * The function used to initialize dataManager and external query
     * @return {void}
     */
    private initDataManager(): void {
        let gObj: IGrid = this.parent;
        this.dataManager = gObj.dataSource instanceof DataManager ? <DataManager>gObj.dataSource :
            (isNullOrUndefined(gObj.dataSource) ? new DataManager() : new DataManager(gObj.dataSource));
        gObj.setProperties({ query: gObj.query instanceof Query ? gObj.query : new Query()}, true);
    }

    /**
     * The function is used to generate updated Query from Grid model.
     * @return {Query}
     * @hidden
     */
    public generateQuery(skipPage?: boolean): Query {
        let gObj: IGrid = this.parent;
        let query: Query = gObj.getQuery().clone();
        if (this.parent.columnQueryMode === 'ExcludeHidden') {
            query.select((<Column[]>this.parent.getColumns()).filter(
                (column: Column) => !(column.isPrimaryKey !== true && column.visible === false || column.field === undefined)
            ).map((column: Column) => column.field));
        } else if (this.parent.columnQueryMode === 'Schema') {
            let selectQueryFields: string[] = [];
            let columns: string[] | Column[] | ColumnModel[] =  this.parent.columns;
            for (let i: number = 0; i < columns.length; i++) {
                selectQueryFields.push((columns[i] as Column).field);
            }
            query.select(selectQueryFields);
        }

        this.filterQuery(query);

        this.searchQuery(query);

        this.aggregateQuery(query);

        this.sortQuery(query);

        if (isGroupAdaptive(this.parent)) {
            this.virtualGroupPageQuery(query);
        } else {
            this.pageQuery(query, skipPage);
        }

        this.groupQuery(query);

        return query;
    }

    protected aggregateQuery(query: Query, isForeign?: boolean): Query {
        this.parent.aggregates.forEach((row: AggregateRowModel) => {
            row.columns.forEach((column: AggregateColumnModel) => {
                let types: string[] = column.type instanceof Array ? column.type : [column.type];
                types.forEach((type: string) => query.aggregate(type.toLowerCase(), column.field));
            });
        });
        return query;
    }

    protected virtualGroupPageQuery(query: Query): Query {
        let gObj: IGrid = this.parent;
        let fName: string = 'fn';
        if (query.queries.length) {
            for (let i: number = 0; i < query.queries.length; i++) {
                if (query.queries[i][fName] === 'onPage') {
                    query.queries.splice(i, 1);
                }
            }
        }
        return query;
    }

    protected pageQuery(query: Query, skipPage?: boolean): Query {
        let gObj: IGrid = this.parent;
        let fName: string = 'fn';
        if ((gObj.allowPaging || gObj.enableVirtualization) && skipPage !== true) {
            gObj.pageSettings.currentPage = Math.max(1, gObj.pageSettings.currentPage);
            if (gObj.pageSettings.pageCount <= 0) {
                gObj.pageSettings.pageCount = 8;
            }
            if (gObj.pageSettings.pageSize <= 0) {
                gObj.pageSettings.pageSize = 12;
            }
            if (query.queries.length) {
                for (let i: number = 0; i < query.queries.length; i++) {
                    if (query.queries[i][fName] === 'onPage') {
                        query.queries.splice(i, 1);
                    }
                }
            }
            query.page(gObj.pageSettings.currentPage, gObj.pageSettings.pageSize);
        }
        return query;
    }

    protected groupQuery(query: Query): Query {
        let gObj: IGrid = this.parent;
        if (gObj.allowGrouping && gObj.groupSettings.columns.length) {
            let columns: string[] = gObj.groupSettings.columns;
            for (let i: number = 0, len: number = columns.length; i < len; i++) {
                let column: Column = this.getColumnByField(columns[i]);
                if (!column) {
                    this.parent.log('initial_action', {moduleName: 'group', columnName: columns[i]});
                }
                let isGrpFmt: boolean = column.enableGroupByFormat;
                let format: string | NumberFormatOptions | DateFormatOptions = column.format;
                if (isGrpFmt) {
                    query.group(columns[i], this.formatGroupColumn.bind(this), format);
                } else {
                    query.group(columns[i], null);
                }
            }
        }
        return query;
    }

    protected sortQuery(query: Query): Query {
        let gObj: IGrid = this.parent;
        if ((gObj.allowSorting || gObj.allowGrouping) && gObj.sortSettings.columns.length) {
            let columns: SortDescriptorModel[] = gObj.sortSettings.columns;
            let sortGrp: SortDescriptorModel[] = [];
            for (let i: number = columns.length - 1; i > -1; i--) {
                let col: Column = this.getColumnByField(columns[i].field);
                if (col) {
                    col.setSortDirection(columns[i].direction);
                } else {
                    this.parent.log('initial_action', {moduleName: 'sort', columnName: columns[i].field});
                    return query;
                }
                let fn: Function | string = columns[i].direction;
                if (col.sortComparer) {
                    this.parent.log('grid_sort_comparer');
                    fn = !this.isRemote() ? (col.sortComparer as Function).bind(col) : columns[i].direction;
                }
                if (gObj.groupSettings.columns.indexOf(columns[i].field) === -1) {
                    query.sortBy(col.field, fn);
                } else {
                    sortGrp.push({ direction: <SortDirection>fn, field: col.field });
                }
            }
            for (let i: number = 0, len: number = sortGrp.length; i < len; i++) {
                query.sortBy(sortGrp[i].field, sortGrp[i].direction);
            }
        }
        return query;
    }

    protected searchQuery(query: Query): Query {
        let sSettings: SearchSettingsModel = this.parent.searchSettings;
        let fields: string[] = sSettings.fields.length ? sSettings.fields : this.getSearchColumnFieldNames();
        let predicateList: Predicate[] = [];
        let needForeignKeySearch: boolean = false;
        if (this.parent.searchSettings.key.length) {
            needForeignKeySearch = this.parent.getForeignKeyColumns().some((col: Column) => fields.indexOf(col.field) > -1);
            if (needForeignKeySearch && !((<{getModulename?: Function}>this.dataManager.adaptor).getModulename &&
            (<{getModulename?: Function}>this.dataManager.adaptor).getModulename() === 'ODataV4Adaptor')) {
                fields.forEach((columnName: string) => {
                    let column: Column = this.getColumnByField(columnName);
                    if (column.isForeignColumn()) {
                        predicateList = this.fGeneratePredicate(column, predicateList);
                    } else {
                        predicateList.push(new Predicate(
                            column.field, sSettings.operator, sSettings.key, sSettings.ignoreCase, sSettings.ignoreAccent
                        ));
                    }
                });
                query.where(Predicate.or(predicateList));
            } else {
                query.search(sSettings.key, fields, sSettings.operator, sSettings.ignoreCase, sSettings.ignoreAccent);
            }
        }
        return query;
    }

    protected filterQuery(query: Query, column?: PredicateModel[], skipFoerign?: boolean): Query {
        let gObj: IGrid = this.parent;
        let predicateList: Predicate[] = [];
        let fPredicate: { predicate?: Predicate } = {};
        let actualFilter: PredicateModel[] = [];
        let foreignColumn: Column[] = this.parent.getForeignKeyColumns();
        if (gObj.allowFiltering && gObj.filterSettings.columns.length) {
            let columns: PredicateModel[] = column ? column : gObj.filterSettings.columns;
            let colType: Object = {};
            for (let col of gObj.getColumns() as Column[]) {
                colType[col.field] = col.filter.type ? col.filter.type : gObj.filterSettings.type;
            }
            let checkBoxCols: PredicateModel[] = [];
            let defaultFltrCols: PredicateModel[] = [];
            for (let col of columns) {
                if (colType[col.field] === 'CheckBox' || colType[col.field] === 'Excel') {
                    checkBoxCols.push(col);
                } else {
                    defaultFltrCols.push(col);
                }
            }
            if (checkBoxCols.length) {
                let excelPredicate: Predicate = CheckBoxFilter.getPredicate(checkBoxCols);
                for (let prop of Object.keys(excelPredicate)) {
                    let col: Column;
                    if (this.parent.getColumnByField(prop).isForeignColumn()) {
                        col = getColumnByForeignKeyValue(prop, foreignColumn);
                    }
                    if (!col) {
                        this.parent.log('initial_action', {moduleName: 'filter', columnName: prop});
                    }
                    if (col && !skipFoerign) {
                        predicateList = this.fGeneratePredicate(col, predicateList);
                        actualFilter.push(col);
                    } else {
                        predicateList.push(<Predicate>excelPredicate[prop]);
                    }
                }
            }
            if (defaultFltrCols.length) {
                for (let col of defaultFltrCols) {
                    col.uid = col.uid || this.parent.grabColumnByFieldFromAllCols(col.field).uid;
                    let column: Column = this.parent.grabColumnByUidFromAllCols(col.uid);
                    if (!column) {
                        this.parent.log('initial_action', {moduleName: 'filter', columnName: col.field});
                    }
                    let sType: string = column.type;
                    if (column.isForeignColumn() && getColumnByForeignKeyValue(col.field, foreignColumn) && !skipFoerign) {
                        actualFilter.push(col);
                        predicateList = this.fGeneratePredicate(column, predicateList);
                    } else {
                        if (sType !== 'date' && sType !== 'datetime') {
                            predicateList.push(new Predicate(
                                col.field, col.operator, col.value, !col.matchCase, this.parent.filterSettings.ignoreAccent
                            ));
                        } else {
                            predicateList.push(getDatePredicate(col, sType));
                        }
                    }
                }
            }
            if (predicateList.length) {
                query.where(Predicate.and(predicateList));
            } else {
                this.parent.notify(events.showEmptyGrid, {});
            }
        }
        return query;
    }
    private fGeneratePredicate(col: Column, predicateList: Predicate[]): Predicate[] {
        let fPredicate: { predicate?: Predicate } = {};
        if (col) {
            this.parent.notify(events.generateQuery, { predicate: fPredicate, column: col });
            if (fPredicate.predicate.predicates.length) {
                predicateList.push(fPredicate.predicate);
            }
        }
        return predicateList;
    }

    /** 
     * The function is used to get dataManager promise by executing given Query. 
     * @param  {Query} query - Defines the query which will execute along with data processing. 
     * @return {Promise<Object>} 
     * @hidden
     */
    public getData(
        args: {
            requestType?: string, foreignKeyData?: string[], data?: Object, index?: number
        } =
            { requestType: '' },
        query?: Query): Promise<Object> {
        let key: string = this.getKey(args.foreignKeyData &&
            Object.keys(args.foreignKeyData).length ?
            args.foreignKeyData : this.parent.getPrimaryKeyFieldNames());
        this.parent.log('datasource_syntax_mismatch', { dataState: this.parent as IGrid });
        if (this.parent.dataSource && 'result' in this.parent.dataSource) {
            let def: Deferred = this.eventPromise(args, query, key);
            return def.promise;
        } else {
            let crud: Promise<Object>;
            switch (args.requestType) {
                case 'delete':
                    query = query ? query : this.generateQuery();
                    let len: number = Object.keys(args.data).length;
                    if (len === 1) {
                        crud = this.dataManager.remove(key, args.data[0], query.fromTable, query) as Promise<Object>;
                    } else {
                        let changes: { addedRecords: Object[], deletedRecords: Object[], changedRecords: Object[] } = {
                            addedRecords: [],
                            deletedRecords: [],
                            changedRecords: []
                        };
                        changes.deletedRecords = <Object[]>args.data;
                        crud = this.dataManager.saveChanges(changes, key, query.fromTable, query.requiresCount()) as Promise<Object>;
                    }
                    break;
                case 'save':
                    query = query ? query : this.generateQuery();
                    args.index = isNullOrUndefined(args.index) ? 0 : args.index;
                    crud = this.dataManager.insert(args.data, query.fromTable, query, args.index) as Promise<Object>;
                    break;
            }
            if (crud && !Array.isArray(crud) && !crud.hasOwnProperty('deletedRecords')) {
                return crud.then((result: ReturnType) => {
                    return this.insert(query, args);
                });
            } else {
                return this.insert(query, args);
            }
        }
    }

    private insert(query: Query, args: Object): Promise<Object> {
        if ((<{requestType?: string}>args).requestType === 'save') {
            this.parent.notify(events.recordAdded, args);
        }
        return this.executeQuery(query);
    }

    private executeQuery(query: Query): Promise<Object> {
        if (this.dataManager.ready) {
            let deferred: Deferred = new Deferred();
            let ready: Promise<Object> = this.dataManager.ready;
            ready.then((e: ReturnType) => {
                (<Promise<Object>>this.dataManager.executeQuery(query)).then((result: ReturnType) => {
                    deferred.resolve(result);
                });
            }).catch((e: ReturnType) => {
                deferred.reject(e);
            });
            return deferred.promise;
        } else {
            return this.dataManager.executeQuery(query);
        }
    }
    private formatGroupColumn(value: number | Date, field: string): string | object {
        let gObj: IGrid = this.parent;
        let serviceLocator: ServiceLocator = this.serviceLocator;
        let column: Column = this.getColumnByField(field);
        let date: Date = value as Date;
        if (!column.type) {
            column.type = date.getDay ? (date.getHours() > 0 || date.getMinutes() > 0 ||
                date.getSeconds() > 0 || date.getMilliseconds() > 0 ? 'datetime' : 'date') : typeof (value);
        }
        if (isNullOrUndefined(column.getFormatter())) {
            setFormatter(serviceLocator, column);
        }
        let formatVal: string | object = ValueFormatter.prototype.toView(value, column.getFormatter());
        return formatVal;
    }
    private crudActions(args: {
        requestType?: string, foreignKeyData?: string[], data?: Object, previousData?: Object
    }): void {
        let query: Query = this.generateQuery();
        let promise: Promise<Object> = null;
        let pr: string = 'promise';
        let key: string = this.getKey(args.foreignKeyData &&
            Object.keys(args.foreignKeyData).length ? args.foreignKeyData :
            this.parent.getPrimaryKeyFieldNames());
        if (this.parent.dataSource && 'result' in this.parent.dataSource) {
            this.eventPromise(args, query, key);
        }
        switch (args.requestType) {
            case 'save':
                promise = this.dataManager.update(key, args.data, query.fromTable, query, args.previousData) as Promise<Object>;
                break;
        }
        args[pr] = promise ? promise : args[pr];
        this.parent.notify(events.crudAction, args);
    }


    /** @hidden */
    public saveChanges(changes: Object, key: string, original: Object, query: Query = this.generateQuery()): Promise<Object> {
        query.requiresCount();
        if ('result' in this.parent.dataSource) {
            let state: DataStateChangeEventArgs;
            state = this.getStateEventArgument(query);
            let deff: Deferred = new Deferred();
            let args: DataSourceChangedEventArgs = {
                requestType: 'batchsave', changes: changes, key: key, query: query,
                endEdit: deff.resolve
            };
            this.setState({ isPending: true, resolver: deff.resolve });
            this.parent.trigger(events.dataSourceChanged, args);
            return deff.promise;
        } else {
            let promise: Promise<Object> =
                this.dataManager.saveChanges(changes, key, query.fromTable, query, original) as Promise<Object>;
            return promise;
        }
    }

    private getKey(keys: string[]): string {
        if (keys && keys.length) {
            return keys[0];
        }
        return undefined;
    }

    /** @hidden */
    public isRemote(): boolean {
        return this.dataManager.dataSource.offline !== true && this.dataManager.dataSource.url !== undefined &&
        this.dataManager.dataSource.url !== '';
    }

    private addRows(e: { toIndex: number, records: Object[] }): void {
        for (let i: number = e.records.length; i > 0; i--) {
            this.dataManager.dataSource.json.splice(e.toIndex, 0, e.records[i - 1]);
        }
    }

    private removeRows(e: { indexes: number[], records: Object[] }): void {
        let json: Object[] = this.dataManager.dataSource.json;
        this.dataManager.dataSource.json = json.filter((value: Object, index: number) => e.records.indexOf(value) === -1);
    }

    private getColumnByField(field: string): Column {
        let col: Column;
        return ((<{ columnModel?: Column[] }>this.parent).columnModel).some((column: Column) => {
            col = column;
            return column.field === field;
        }) && col;
    }

    protected destroy(): void {
        if (this.parent.isDestroyed) { return; }
        this.parent.off(events.rowsAdded, this.addRows);
        this.parent.off(events.rowsRemoved, this.removeRows);
        this.parent.off(events.dataSourceModified, this.initDataManager);
        this.parent.off(events.destroy, this.destroy);
        this.parent.off(events.updateData, this.crudActions);
        this.parent.off(events.addDeleteAction, this.getData);
        this.parent.off(events.autoCol, this.refreshFilteredCols);
    }
    public getState(): PendingState {
        return this.dataState;
    }

    public setState(state: PendingState): Object {
        return this.dataState = state;
    }

    public getStateEventArgument(query: Query): PendingState {
        let adaptr: UrlAdaptor = new UrlAdaptor();
        let dm: DataManager = new DataManager({ url: '', adaptor: new UrlAdaptor });
        let state: { data?: string, pvtData?: Object[] } = adaptr.processQuery(dm, query);
        let data: Object = JSON.parse(state.data);
        return extend(data, state.pvtData);
    }

    private eventPromise(args: { requestType?: string, foreignKeyData?: string[], data?: Object }, query?: Query, key?: string): Deferred {

        let state: DataStateChangeEventArgs;
        let dataArgs: DataSourceChangedEventArgs = args;
        state = this.getStateEventArgument(query);
        let def: Deferred = new Deferred();
        let deff: Deferred = new Deferred();
        if (args.requestType !== undefined && this.dataState.isDataChanged !== false) {
            state.action = <{}>args;
            if (args.requestType === 'save' || args.requestType === 'delete') {
                let editArgs: DataSourceChangedEventArgs = args;
                editArgs.key = key;
                let promise: string = 'promise';
                editArgs[promise] = deff.promise;
                editArgs.state = state;
                this.setState({ isPending: true, resolver: deff.resolve });
                dataArgs.endEdit = deff.resolve;
                dataArgs.cancelEdit = deff.reject;
                this.parent.trigger(events.dataSourceChanged, editArgs);
                deff.promise.then((e: ReturnType) => {
                    this.setState({ isPending: true, resolver: def.resolve, group: state.group, aggregates: state.aggregates });
                    this.parent.trigger(events.dataStateChange, state);
                })
                .catch(() => void 0);
            } else {
                this.setState({ isPending: true, resolver: def.resolve, group: state.group, aggregates: state.aggregates });
                this.parent.trigger(events.dataStateChange, state);
            }
        } else {
            this.setState({});
            def.resolve(this.parent.dataSource);
        }
        return def;
    }

     /**
      * Gets the columns where searching needs to be performed from the Grid.
      * @return {string[]}
      */
     private getSearchColumnFieldNames(): string[] {
        let colFieldNames: string[] = [];
        let columns: Column[] = this.parent.getColumns();
        for (let col of columns) {
            if (col.allowSearching && !isNullOrUndefined(col.field)) {
                colFieldNames.push(col.field);
            }
        }
        return colFieldNames;
    }

    private refreshFilteredCols(): void {
        if (this.parent.allowFiltering && this.parent.filterSettings.columns.length) {
            refreshFilteredColsUid(this.parent, this.parent.filterSettings.columns);
        }
    }
}