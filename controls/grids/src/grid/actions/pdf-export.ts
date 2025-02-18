import {
    IGrid, PdfExportProperties, PdfHeader, PdfFooter, PdfHeaderFooterContent,
    PdfTheme, PdfThemeStyle, PdfBorder, PdfQueryCellInfoEventArgs, ExportDetailDataBoundEventArgs
} from '../base/interface';
import { Column } from './../models/column';
import { Row } from './../models/row';
import * as events from '../base/constant';
import { PdfDocument, PdfPage, PdfGrid, PdfBorders, PdfPen, PdfFont, PdfPaddings } from '@syncfusion/ej2-pdf-export';
import { PdfGridRow, PdfStandardFont, PdfFontFamily, PdfFontStyle, PdfBitmap } from '@syncfusion/ej2-pdf-export';
import { PdfStringFormat, PdfTextAlignment, PdfColor, PdfSolidBrush } from '@syncfusion/ej2-pdf-export';
import { PdfVerticalAlignment, PdfGridCell, RectangleF, PdfPageTemplateElement } from '@syncfusion/ej2-pdf-export';
import { PointF, PdfPageNumberField, PdfCompositeField, PdfSection } from '@syncfusion/ej2-pdf-export';
import { PdfPageCountField, SizeF, PdfPageSettings, PdfPageOrientation } from '@syncfusion/ej2-pdf-export';
import { PdfTrueTypeFont } from '@syncfusion/ej2-pdf-export';
import { ExportHelper, ExportValueFormatter } from './export-helper';
import { Data } from '../actions/data';
import { ReturnType } from '../base/type';
import { SummaryModelGenerator, GroupSummaryModelGenerator, CaptionSummaryModelGenerator } from '../services/summary-model-generator';
import { AggregateColumnModel } from '../models/aggregate-model';
import { compile, getEnumValue, isNullOrUndefined, detach, isBlazor } from '@syncfusion/ej2-base';
import { CellType, PdfPageSize, PdfDashStyle, PdfPageNumberType, ExportType } from '../base/enum';
import { DataManager, Query, Group } from '@syncfusion/ej2-data';
import { getValue } from '@syncfusion/ej2-base';
import { Grid } from '../base/grid';
import { Cell } from '../models/cell';
import { getUid, getPrintGridModel } from '../base/util';

/**
 * `PDF Export` module is used to handle the exportToPDF action.
 * @hidden
 */
export class PdfExport {
    private parent: IGrid;
    private isExporting: boolean;
    private data: Data;
    private pdfDocument: PdfDocument;
    private hideColumnInclude: boolean = false;
    private currentViewData: boolean = false;
    private customDataSource: boolean = false;
    private exportValueFormatter: ExportValueFormatter;
    private gridTheme: PdfTheme;
    private isGrouping: boolean = false;
    private helper: ExportHelper;
    private isBlob: boolean;
    private blobPromise: Promise<{ blobData: Blob }>;
    private globalResolve: Function;
    private gridPool: Object;

    /**
     * Constructor for the Grid PDF Export module
     * @hidden
     */
    constructor(parent?: IGrid) {
        this.parent = parent;
        this.helper = new ExportHelper(parent);
        this.gridPool = {};
    }
    /**
     * For internal use only - Get the module name.
     */
    private getModuleName(): string {
        return 'PdfExport';
    }
    private init(parent: IGrid): void {
        this.exportValueFormatter = new ExportValueFormatter(parent.locale);
        this.pdfDocument = undefined;
        this.hideColumnInclude = false;
        this.currentViewData = false;
        this.parent = parent;
        this.isGrouping = false;
        this.isExporting = true;
        parent.id = getUid('main-grid');
        this.gridPool[parent.id] = false;
    }

    private exportWithData(parent: IGrid, pdfDoc: Object, resolve: Function, returnType: Object,
                           pdfExportProperties: PdfExportProperties, isMultipleExport: boolean): void {
        this.init(parent);
        if (!isNullOrUndefined(pdfDoc)) {
            this.pdfDocument = <PdfDocument>pdfDoc;
        } else {
            this.pdfDocument = new PdfDocument();
        }
        this.processExport(parent, returnType as ReturnType, pdfExportProperties, isMultipleExport).then(() => {
            this.isExporting = false;
            parent.trigger(events.pdfExportComplete, this.isBlob ? { promise: this.blobPromise } : {});
            this.parent.log('exporting_complete', this.getModuleName());
            resolve(this.pdfDocument);
        });
    }
    /**
     * Used to map the input data
     * @return {void}
     */
    public Map(
        parent?: IGrid, pdfExportProperties?: PdfExportProperties,
        isMultipleExport?: boolean, pdfDoc?: Object, isBlob?: boolean): Promise<Object> {
        this.data = new Data(this.parent);
        this.isBlob = isBlob;
        this.gridPool = {};
        if (parent.childGrid && !(!isNullOrUndefined(pdfExportProperties) && pdfExportProperties.hierarchyExportMode === 'None')) {
            parent.expandedRows = getPrintGridModel(parent).expandedRows;
        }
        let args: Object = {
            requestType: 'beforePdfExport', cancel: false
        };
        if (!isBlazor()) {
            let gridObject: string = 'gridObject';
            args[gridObject] = parent;
        }
        let can: string = 'cancel';
        parent.trigger(events.beforePdfExport, args);
        if (args[can] === true) {
            return new Promise((resolve: Function, reject: Function) => {
                return resolve();
            });
        }
        this.parent.log('exporting_begin', this.getModuleName());
        if (!isNullOrUndefined(pdfExportProperties) && !isNullOrUndefined(pdfExportProperties.dataSource)
        && pdfExportProperties.dataSource instanceof DataManager) {
            return new Promise((resolve: Function, reject: Function) => {
                (<DataManager>pdfExportProperties.dataSource).executeQuery(new Query()).then((returnType: Object) => {
                    this.exportWithData(parent, pdfDoc, resolve, returnType, pdfExportProperties, isMultipleExport);
                });
            });
        } else if (!isNullOrUndefined(pdfExportProperties) && pdfExportProperties.exportType === 'CurrentPage') {
            return new Promise((resolve: Function, reject: Function) => {
                this.exportWithData(parent, pdfDoc, resolve, this.parent.getCurrentViewRecords(), pdfExportProperties, isMultipleExport);
            });
        } else {
            let allPromise: Promise<Object>[] = [];
            allPromise.push(this.data.getData({}, ExportHelper.getQuery(parent, this.data)));
            allPromise.push(this.helper.getColumnData(<Grid>parent));
            return new Promise((resolve: Function, reject: Function) => {
                Promise.all(allPromise).then((e: ReturnType[]) => {
                    this.init(parent);
                    if (!isNullOrUndefined(pdfDoc)) {
                        this.pdfDocument = <PdfDocument>pdfDoc;
                    } else {
                        this.pdfDocument = new PdfDocument();
                    }
                    this.processExport(parent, e[0], pdfExportProperties, isMultipleExport).then(() => {
                        this.isExporting = false;
                        parent.trigger(events.pdfExportComplete, this.isBlob ? { promise: this.blobPromise } : {});
                        this.parent.log('exporting_complete', this.getModuleName());
                        resolve(this.pdfDocument);
                    });
                });
            });
        }
    }

    private processExport(gObj: IGrid, returnType: ReturnType,
                          pdfExportProperties: PdfExportProperties, isMultipleExport: boolean): Promise<Object> {
        let section: PdfSection = this.pdfDocument.sections.add() as PdfSection;
        let pdfGrid: PdfGrid;
        this.processSectionExportProperties(section, pdfExportProperties);
        let pdfPage: PdfPage = section.pages.add();
        return new Promise((resolve: Function, reject: Function) => {
            pdfGrid = <PdfGrid>this.processGridExport(gObj, returnType, pdfExportProperties);
            this.globalResolve = resolve;
            this.gridPool[gObj.id] = true;
            this.helper.checkAndExport(this.gridPool, this.globalResolve);
        }).then(() => {
            // draw the grid
            pdfGrid.draw(pdfPage, 0, 0);
            if (!isMultipleExport) {
                // save the PDF
                if (!this.isBlob) {
                    if (!isNullOrUndefined(pdfExportProperties) && pdfExportProperties.fileName) {
                        this.pdfDocument.save(pdfExportProperties.fileName);
                    } else {
                        this.pdfDocument.save('Export.pdf');
                    }
                } else {
                    this.blobPromise = this.pdfDocument.save();
                }
                this.pdfDocument.destroy();
                delete gObj.expandedRows;
            }
            return this.pdfDocument;
        });
    }

    private processSectionExportProperties(section: PdfSection, pdfExportProperties: PdfExportProperties): PdfSection {
        if (!isNullOrUndefined(pdfExportProperties) && (!isNullOrUndefined(pdfExportProperties.pageOrientation)
            || !isNullOrUndefined(pdfExportProperties.pageSize))) {
            let pdfPageSettings: PdfPageSettings = new PdfPageSettings();
            pdfPageSettings.orientation = (pdfExportProperties.pageOrientation === 'Landscape') ?
            PdfPageOrientation.Landscape : PdfPageOrientation.Portrait;
            pdfPageSettings.size = this.getPageSize(pdfExportProperties.pageSize);
            section.setPageSettings(pdfPageSettings);
        }
        return section;
    }

    private processGridExport(gObj: IGrid, returnType: ReturnType, pdfExportProperties: PdfExportProperties): PdfGrid {
        if (!isNullOrUndefined(pdfExportProperties)) {
            this.gridTheme = pdfExportProperties.theme;
        }
        let helper: ExportHelper = new ExportHelper(gObj);
        let dataSource: Object[] | Group = this.processExportProperties(pdfExportProperties, returnType.result);
        let columns: Column[] = gObj.columns as Column[];
        let isGrouping: boolean = false;
        if (gObj.groupSettings.columns.length) {
            isGrouping = true;
        }

        if (gObj.childGrid && !isNullOrUndefined(pdfExportProperties)) {
            gObj.hierarchyPrintMode = pdfExportProperties.hierarchyExportMode || 'Expanded';
        }

        // create a grid
        let pdfGrid: PdfGrid = new PdfGrid();

        // get header theme style
        let headerThemeStyle: IThemeStyles = this.getHeaderThemeStyle();

        let border: PdfBorders = headerThemeStyle.border;
        let headerFont: PdfFont = headerThemeStyle.font;
        let headerBrush: PdfSolidBrush = headerThemeStyle.brush;
        let returnValue: { rows: Row<Column>[], columns: Column[] } = helper.getHeaders(columns, this.hideColumnInclude);

        // Column collection with respect to the records in the grid
        let gridColumns: Column[] = returnValue.columns;

        // process grid header content
        pdfGrid = this.processGridHeaders(gObj.groupSettings.columns.length, pdfGrid, returnValue.rows,
                                          gridColumns, border, headerFont, headerBrush, gObj);

        // set alignment, width and type of the values of the column
        this.setColumnProperties(gridColumns, pdfGrid, helper, gObj);

        let captionThemeStyle: IThemeStyles = this.getSummaryCaptionThemeStyle();

        if (!isNullOrUndefined(dataSource) && dataSource.length) {
            if (isGrouping) {
                if (!isNullOrUndefined(captionThemeStyle.border)) {
                    border = captionThemeStyle.border;
                }
                this.processGroupedRecords(pdfGrid, dataSource, gridColumns, gObj, border, 0, captionThemeStyle.font, captionThemeStyle.
                                    brush, captionThemeStyle.backgroundBrush, returnType, pdfExportProperties, helper, 0);
            } else {
                this.processRecord(border, gridColumns, gObj, dataSource, pdfGrid, 0, pdfExportProperties, helper, 0);
            }
            if (!isNullOrUndefined(returnType.aggregates)) {
                let summaryModel: SummaryModelGenerator = new SummaryModelGenerator(gObj);
                let sRows: Row<AggregateColumnModel>[];
                if (this.customDataSource) {
                    sRows = summaryModel.generateRows(dataSource, <SummaryData>returnType.aggregates);
                } else if (this.currentViewData) {
                    sRows = summaryModel.generateRows(this.parent.getCurrentViewRecords(), <SummaryData>returnType.aggregates);
                } else if (isGrouping) {
                    sRows = summaryModel.generateRows((<Group>dataSource).records, <SummaryData>returnType.aggregates);
                } else {
                    sRows = summaryModel.generateRows(returnType.result, <SummaryData>returnType.aggregates);
                }
                this.processAggregates(sRows, pdfGrid, border, captionThemeStyle.font,
                                       captionThemeStyle.brush, captionThemeStyle.backgroundBrush, false);
            }
        } else {
            let row: PdfGridRow = pdfGrid.rows.addRow();
            row.style.setBorder(border);
        }

        return pdfGrid;
    }

    private getSummaryCaptionThemeStyle(): IThemeStyles {
        if (!isNullOrUndefined(this.gridTheme) && !isNullOrUndefined(this.gridTheme.caption)) {
            let fontSize: number = !isNullOrUndefined(this.gridTheme.caption.fontSize) ? this.gridTheme.caption.fontSize : 9.75;
            let fontFamily: number = !isNullOrUndefined(this.gridTheme.caption.fontName) ?
            this.getFontFamily(this.gridTheme.caption.fontName) : PdfFontFamily.Helvetica;
            let fontStyle: PdfFontStyle = this.getFontStyle(this.gridTheme.caption);
            let pdfColor: PdfColor = new PdfColor(0, 0, 0);
            if (!isNullOrUndefined(this.gridTheme.caption.fontColor)) {
                let penBrushColor: { r: number, g: number, b: number } = this.hexToRgb(this.gridTheme.caption.fontColor);
                pdfColor = new PdfColor(penBrushColor.r, penBrushColor.g, penBrushColor.b);
            }
            let borderCaption: PdfBorders = this.gridTheme.caption.border ? this.getBorderStyle(this.gridTheme.caption.border) : null;
            let font: PdfStandardFont | PdfTrueTypeFont = new PdfStandardFont(fontFamily, fontSize, fontStyle);
            if (!isNullOrUndefined(this.gridTheme.caption.font)) {
                font = this.gridTheme.caption.font;
            }
            return { font: font, brush: new PdfSolidBrush(pdfColor), backgroundBrush: new PdfSolidBrush(new PdfColor(246, 246, 246)),
                border: borderCaption};
        } else {
            //Material theme
            return { font: new PdfStandardFont(PdfFontFamily.Helvetica, 9.75), brush: new PdfSolidBrush(new PdfColor(0, 0, 0)),
                backgroundBrush: new PdfSolidBrush(new PdfColor(246, 246, 246)) };
        }
    }

    private getHeaderThemeStyle(): IThemeStyles {
        let border: PdfBorders = new PdfBorders();
        if (!isNullOrUndefined(this.gridTheme) && !isNullOrUndefined(this.gridTheme.header)) {
            let fontFamily: number = !isNullOrUndefined(this.gridTheme.header.fontName) ?
            this.getFontFamily(this.gridTheme.header.fontName) : PdfFontFamily.Helvetica;
            let fontStyle: PdfFontStyle = this.getFontStyle(this.gridTheme.header);
            let fontSize: number = !isNullOrUndefined(this.gridTheme.header.fontSize) ? this.gridTheme.header.fontSize : 10.5;
            let pdfColor: PdfColor = new PdfColor();
            if (!isNullOrUndefined(this.gridTheme.header.fontColor)) {
                let penBrushColor: { r: number, g: number, b: number } = this.hexToRgb(this.gridTheme.header.fontColor);
                pdfColor = new PdfColor(penBrushColor.r, penBrushColor.g, penBrushColor.b);
            }

            let font: PdfStandardFont | PdfTrueTypeFont = new PdfStandardFont(fontFamily, fontSize, fontStyle);
            if (!isNullOrUndefined(this.gridTheme.header.font)) {
                font = this.gridTheme.header.font;
            }
            return { border: this.getBorderStyle(this.gridTheme.header.border), font: font, brush: new PdfSolidBrush(pdfColor) };
        } else {
            //Material theme
            border.all = new PdfPen(new PdfColor(234, 234, 234));
            return { border: border, font: new PdfStandardFont(PdfFontFamily.Helvetica, 10.5),
                brush: new PdfSolidBrush(new PdfColor(102, 102, 102)) };
        }
    }
    /* tslint:disable-next-line:no-any */
    private processGroupedRecords(pdfGrid: PdfGrid, dataSource: any, gridColumns: Column[], gObj: IGrid, border: PdfBorders, level: number,
                                  font: PdfFont, brush: PdfSolidBrush, backgroundBrush: PdfSolidBrush, returnType: ReturnType,
                                  pdfExportProperties: PdfExportProperties, helper: ExportHelper, index: number): void {
        let groupIndex: number = level;
        for (let dataSourceItems of dataSource) {
            let row: PdfGridRow = pdfGrid.rows.addRow();
            let col: Column = gObj.getColumnByField(dataSourceItems.field);
            /* tslint:disable-next-line:no-any */
            let args: any = {
                value: dataSourceItems.key,
                column: col,
                style: undefined,
                isForeignKey: col.isForeignColumn(),
            };
            /* tslint:disable-next-line:max-line-length */
            let value: string = this.parent.getColumnByField(dataSourceItems.field).headerText + ': ' + (!col.enableGroupByFormat ? this.exportValueFormatter.formatCellValue(args) : dataSourceItems.key) + ' - ' + dataSourceItems.count + (dataSource.count > 1 ? ' items' : ' item');
            row.cells.getCell(groupIndex).value = value;
            row.cells.getCell(groupIndex + 1).style.stringFormat = new PdfStringFormat(PdfTextAlignment.Left);
            row.style.setBorder(border);
            row.style.setFont(font);
            row.style.setTextBrush(brush);
            row.style.setBackgroundBrush(backgroundBrush);
            let sRows: Row<AggregateColumnModel>[];
            let captionSummaryModel: CaptionSummaryModelGenerator = new CaptionSummaryModelGenerator(gObj);
            if (!isNullOrUndefined(dataSourceItems.items.records)) {
                sRows = captionSummaryModel.generateRows(dataSourceItems.items.records, dataSourceItems);
            } else {
                sRows = captionSummaryModel.generateRows(dataSourceItems.items, dataSourceItems);
            }
            if (!isNullOrUndefined(sRows) && sRows.length === 0) {
                row.cells.getCell(groupIndex + 1).columnSpan = pdfGrid.columns.count - (groupIndex + 1);
            }
            if (!isNullOrUndefined(dataSource.childLevels) && dataSource.childLevels > 0) {
                this.processAggregates(sRows, pdfGrid, border, font, brush, backgroundBrush, true, row, groupIndex);
                this.processGroupedRecords(pdfGrid, dataSourceItems.items, gridColumns, gObj, border, (groupIndex + 1), font, brush,
                                           backgroundBrush, returnType, pdfExportProperties, helper, index);
                let groupSummaryModel: GroupSummaryModelGenerator = new GroupSummaryModelGenerator(gObj);
                sRows = groupSummaryModel.generateRows(dataSourceItems.items.records, dataSourceItems);
                this.processAggregates(sRows, pdfGrid, border, font, brush, backgroundBrush, false);
            } else {
                this.processAggregates(sRows, pdfGrid, border, font, brush, backgroundBrush, true, row, groupIndex);
                index = this.processRecord(border, gridColumns, gObj, dataSourceItems.items,
                                           pdfGrid, (groupIndex + 1), pdfExportProperties, helper, index);
                let groupSummaryModel: GroupSummaryModelGenerator = new GroupSummaryModelGenerator(gObj);
                sRows = groupSummaryModel.generateRows(dataSourceItems.items, dataSourceItems);
                this.processAggregates(sRows, pdfGrid, border, font, brush, backgroundBrush, false);
            }
        }
    }
    private processGridHeaders(childLevels: number, pdfGrid: PdfGrid, rows: Row<Column>[], gridColumn: Column[],
                               border: PdfBorders, headerFont: PdfFont, headerBrush: PdfSolidBrush, grid: IGrid): PdfGrid {
        let columnCount: number = gridColumn.length + childLevels;
        // add columns
        pdfGrid.columns.add(columnCount);
        // add header
        pdfGrid.headers.add(rows.length);
        // set cell values of each rows in the header
        for (let i: number = 0; i < rows.length; i++) {
            let gridHeader: PdfGridRow = pdfGrid.headers.getHeader(i);
            gridHeader.style.setBorder(border);
            gridHeader.style.setFont(headerFont);
            gridHeader.style.setTextBrush(headerBrush);
            let colSpan: number = 0;
            let cellLength: number = rows[i].cells.length;
            for (let j: number = 0; j < cellLength; j++) {
                let cell: Cell<Column> = rows[i].cells[j];
                let pdfCell: PdfGridCell = gridHeader.cells.getCell(j + colSpan);
                switch (cell.cellType) {
                    case CellType.HeaderIndent:
                    case CellType.DetailHeader:
                        pdfCell.value = '';
                        pdfCell.width = 20;
                    break;
                    case CellType.Header:
                    case CellType.StackedHeader:
                        if (pdfCell.value !== null ) {
                            if (!isNullOrUndefined(cell.column.headerTextAlign)) {
                                pdfCell.style.stringFormat = this.getHorizontalAlignment(cell.column.headerTextAlign);
                            }
                            if (!isNullOrUndefined(cell.rowSpan)) {
                                pdfCell.rowSpan = cell.rowSpan;
                                pdfCell.style.stringFormat = this.getVerticalAlignment
                                ('Bottom', pdfCell.style.stringFormat, cell.column.textAlign);
                                for (let k: number = 1; k < rows[i].cells[j].rowSpan; k++) {
                                    pdfGrid.headers.getHeader(i + k).cells.getCell(j).value = null;
                                }
                            }
                            if (!isNullOrUndefined(cell.colSpan)) {
                                pdfCell.columnSpan = cell.colSpan;
                                colSpan += cell.colSpan - 1;
                            }
                            pdfCell.value = cell.column.headerText;
                            let args: Object = {
                                cell: pdfCell,
                                gridCell: cell,
                                style: pdfCell.style
                            };
                            this.parent.trigger(events.pdfHeaderQueryCellInfo, args);
                        } else {
                            colSpan += pdfCell.columnSpan;
                            j = j - 1;
                        }
                    break;
                }
            }
        }
        if (pdfGrid.columns.count >= 6) {
            pdfGrid.style.allowHorizontalOverflow = true;
        }
        return pdfGrid;
    }

    private processExportProperties(pdfExportProperties: PdfExportProperties, dataSource: Object[]): Object[] {
        if (!isNullOrUndefined(pdfExportProperties)) {
            if (!isNullOrUndefined(pdfExportProperties.theme)) {
                this.gridTheme = pdfExportProperties.theme;
            }
            let clientSize: SizeF = this.pdfDocument.pageSettings.size;
            if (!isNullOrUndefined(pdfExportProperties.header)) {
                /* tslint:disable-next-line:no-any */
                let header: any = pdfExportProperties.header;
                let position: PointF = new PointF(0, header.fromTop);
                let size: SizeF = new SizeF((clientSize.width - 80), (header.height * 0.75));
                let bounds: RectangleF = new RectangleF(position, size);
                this.pdfDocument.template.top = this.drawPageTemplate(new PdfPageTemplateElement(bounds), header);
            }
            if (!isNullOrUndefined(pdfExportProperties.footer)) {
                /* tslint:disable-next-line:no-any */
                let footer: any = pdfExportProperties.footer;
                let position: PointF = new PointF(0, ((clientSize.width - 80) - (footer.fromBottom * 0.75)));
                let size: SizeF = new SizeF((clientSize.width - 80), (footer.height * 0.75));
                let bounds: RectangleF = new RectangleF(position, size);
                this.pdfDocument.template.bottom = this.drawPageTemplate(new PdfPageTemplateElement(bounds), footer);
            }
            if (!isNullOrUndefined(pdfExportProperties.includeHiddenColumn) && !this.isGrouping) {
                this.hideColumnInclude = pdfExportProperties.includeHiddenColumn;
            }
            if (!isNullOrUndefined(pdfExportProperties.dataSource)) {
                if (!(pdfExportProperties.dataSource instanceof DataManager)) {
                    dataSource = pdfExportProperties.dataSource as Object[];
                }
                this.customDataSource = true;
                this.currentViewData = false;
            } else if (!isNullOrUndefined(pdfExportProperties.exportType)) {
                if (pdfExportProperties.exportType === 'CurrentPage') {
                    dataSource = this.parent.currentViewData;
                    this.currentViewData = true;
                    this.customDataSource = false;
                } else {
                    this.currentViewData = false;
                    this.customDataSource = false;
                }
            } else {
                this.currentViewData = false;
                this.customDataSource = false;
            }
        } else {
            this.currentViewData = false;
            this.customDataSource = false;
        }
        return dataSource;
    }

    private drawPageTemplate(template: PdfPageTemplateElement, element: PdfHeader | PdfFooter): PdfPageTemplateElement {
        for (let content of element.contents) {
            this.processContentValidation(content);
            switch (content.type) {
                case 'Text':
                    /* tslint:disable-next-line:max-line-length */
                    if (content.value === '' || content.value === undefined || content.value === null || typeof content.value !== 'string') {
                        throw new Error('please enter the valid input value in text content...');
                    }
                    this.drawText(template, content);
                    break;
                case 'PageNumber':
                    this.drawPageNumber(template, content);
                    break;
                case 'Image':
                    if (content.src === undefined || content.src === null || content.src === '') {
                        throw new Error('please enter the valid base64 string in image content...');
                    }
                    this.drawImage(template, content);
                    break;
                case 'Line':
                    this.drawLine(template, content);
                    break;
                default:
                    throw new Error('Please set valid content type...');
            }
        }
        return template;
    }

    private processContentValidation(content: PdfHeaderFooterContent): void {
        if (content.type === undefined || content.type === null) {
            throw new Error('please set valid content type...');
        } else {
            if (content.type === 'Line') {
                if (content.points === undefined || content.points === null) {
                    throw new Error('please enter valid points in ' + content.type + ' content...');
                } else {
                    if (content.points.x1 === undefined || content.points.x1 === null || typeof content.points.x1 !== 'number') {
                        throw new Error('please enter valid x1 co-ordinate in ' + content.type + ' points...');
                    }
                    if (content.points.y1 === undefined || content.points.y1 === null || typeof content.points.y1 !== 'number') {
                        throw new Error('please enter valid y1 co-ordinate in ' + content.type + ' points...');
                    }
                    if (content.points.x2 === undefined || content.points.x2 === null || typeof content.points.x2 !== 'number') {
                        throw new Error('please enter valid x2 co-ordinate in ' + content.type + ' points...');
                    }
                    if (content.points.y2 === undefined || content.points.y2 === null || typeof content.points.y2 !== 'number') {
                        throw new Error('please enter valid y2 co-ordinate in ' + content.type + ' points...');
                    }
                }
            } else {
                if (content.position === undefined || content.position === null) {
                    throw new Error('please enter valid position in ' + content.type + ' content...');
                } else {
                    if (content.position.x === undefined || content.position.x === null || typeof content.position.x !== 'number') {
                        throw new Error('please enter valid x co-ordinate in ' + content.type + ' position...');
                    }
                    if (content.position.y === undefined || content.position.y === null || typeof content.position.y !== 'number') {
                        throw new Error('please enter valid y co-ordinate in ' + content.type + ' position...');
                    }
                }
            }
        }
    }
    /* tslint:disable-next-line:no-any */
    private drawText(pageTemplate: PdfPageTemplateElement, content: any): void {
        let font: PdfFont = this.getFont(content);
        let brush: PdfSolidBrush = this.getBrushFromContent(content);
        let pen: PdfPen = null;
        if (!isNullOrUndefined(content.style.textPenColor)) {
            let penColor: { r: number, g: number, b: number } = this.hexToRgb(content.style.textPenColor);
            pen = new PdfPen(new PdfColor(penColor.r, penColor.g, penColor.b));
        }
        if (brush == null && pen == null) {
            brush = new PdfSolidBrush(new PdfColor(0, 0, 0));
        }
        let value: string = content.value.toString();
        let x: number = content.position.x * 0.75;
        let y: number = content.position.y * 0.75;
        let format: PdfStringFormat;
        let result: { format: PdfStringFormat, size: SizeF } = this.setContentFormat(content, format);
        if (result !== null && !isNullOrUndefined(result.format) && !isNullOrUndefined(result.size)) {
            pageTemplate.graphics.drawString(value, font, pen, brush, x, y, result.size.width, result.size.height, result.format);
        } else {
            pageTemplate.graphics.drawString(value, font, pen, brush, x, y, format);
        }
    }
    /* tslint:disable-next-line:no-any */
    private drawPageNumber(documentHeader: PdfPageTemplateElement, content: any): void {
        let font: PdfFont = this.getFont(content);
        let brush: PdfSolidBrush = null;
        if (!isNullOrUndefined(content.style.textBrushColor)) {
            /* tslint:disable-next-line:max-line-length */
            let brushColor: { r: number, g: number, b: number } = this.hexToRgb(content.style.textBrushColor);
            brush = new PdfSolidBrush(new PdfColor(brushColor.r, brushColor.g, brushColor.b));
        } else {
            brush = new PdfSolidBrush(new PdfColor(0, 0, 0));
        }
        let pageNumber: PdfPageNumberField = new PdfPageNumberField(font, brush);
        pageNumber.numberStyle = this.getPageNumberStyle(content.pageNumberType);
        let compositeField: PdfCompositeField;
        let format: string;
        if (!isNullOrUndefined(content.format)) {
            if ((content.format as string).indexOf('$total') !== -1 && (content.format as string).indexOf('$current') !== -1) {
                let pageCount: PdfPageCountField = new PdfPageCountField(font);
                if ((content.format as string).indexOf('$total') > (content.format as string).indexOf('$current')) {
                    format = (content.format as string).replace('$current', '0');
                    format = format.replace('$total', '1');
                } else {
                    format = (content.format as string).replace('$current', '1');
                    format = format.replace('$total', '0');
                }
                compositeField = new PdfCompositeField(font, brush, format, pageNumber, pageCount);
            } else if ((content.format as string).indexOf('$current') !== -1 && (content.format as string).indexOf('$total') === -1) {
                format = (content.format as string).replace('$current', '0');
                compositeField = new PdfCompositeField(font, brush, format, pageNumber);
            } else {
                let pageCount: PdfPageCountField = new PdfPageCountField(font);
                format = (content.format as string).replace('$total', '0');
                compositeField = new PdfCompositeField(font, brush, format, pageCount);
            }
        } else {
            format = '{0}';
            compositeField = new PdfCompositeField(font, brush, format, pageNumber);
        }
        let x: number = content.position.x * 0.75;
        let y: number = content.position.y * 0.75;
        let result: { format: PdfStringFormat, size: SizeF } = this.setContentFormat(content, compositeField.stringFormat);
        if (result !== null && !isNullOrUndefined(result.format) && !isNullOrUndefined(result.size)) {
            compositeField.stringFormat = result.format;
            compositeField.bounds = new RectangleF(x, y, result.size.width, result.size.height);
        }
        compositeField.draw(documentHeader.graphics, x, y);
    }
    /* tslint:disable-next-line:no-any */
    private drawImage(documentHeader: PdfPageTemplateElement, content: any): void {
        let x: number = content.position.x * 0.75;
        let y: number = content.position.y * 0.75;
        let width: number = (!isNullOrUndefined(content.size)) ? (content.size.width * 0.75) : undefined;
        let height: number = (!isNullOrUndefined(content.size)) ? (content.size.height * 0.75) : undefined;
        let image: PdfBitmap = new PdfBitmap(content.src);
        if (!isNullOrUndefined(width)) {
            documentHeader.graphics.drawImage(image, x, y, width, height);
        } else {
            documentHeader.graphics.drawImage(image, x, y);
        }
    }
    /* tslint:disable-next-line:no-any */
    private drawLine(documentHeader: PdfPageTemplateElement, content: any): void {
        let x1: number = content.points.x1 * 0.75;
        let y1: number = content.points.y1 * 0.75;
        let x2: number = content.points.x2 * 0.75;
        let y2: number = content.points.y2 * 0.75;
        let pen: PdfPen = this.getPenFromContent(content);
        if (!isNullOrUndefined(content.style) && content.style !== null) {
            if (!isNullOrUndefined(content.style.penSize) && content.style.penSize !== null && typeof content.style.penSize === 'number') {
                pen.width = content.style.penSize * 0.75;
            }
            pen.dashStyle = this.getDashStyle(content.style.dashStyle);
        }
        documentHeader.graphics.drawLine(pen, x1, y1, x2, y2);
    }
    /* tslint:disable-next-line:no-any *//* tslint:disable-next-line:max-line-length */
    private processAggregates(sRows: Row<AggregateColumnModel>[], pdfGrid: PdfGrid, border: PdfBorders, font: PdfFont,
                              brush: PdfSolidBrush, backgroundBrush: PdfSolidBrush, isCaption: boolean, captionRow?: PdfGridRow, groupIndex?: number): void {
        for (let row of sRows) {
            let startIndex: number = 0;
            let leastCaptionSummaryIndex: number = -1;
            let index: number = 0;
            let isEmpty: boolean = true;
            /* tslint:disable-next-line:no-any */
            let value: any[] = [];
            for (let i: number = 0; i < pdfGrid.columns.count; i++) {
                let cell: Cell<AggregateColumnModel> = row.cells[index];
                if (cell.cellType === CellType.DetailFooterIntent) {
                    i--; index++;
                    continue;
                }
                if (!this.hideColumnInclude) {
                    while (cell.visible === undefined) {
                        if (cell.cellType === CellType.DetailFooterIntent) {
                            continue;
                        }
                        if (!isNullOrUndefined(captionRow)) {
                            if (!isNullOrUndefined(captionRow.cells.getCell(i).value)) {
                                value.push('');
                                value.push(captionRow.cells.getCell(i).value);
                                isEmpty = false;
                                i += 1;
                            } else {
                                value.push('');
                            }
                        } else {
                            value.push('');
                        }
                        i += 1;
                        index = index + 1;
                        cell = row.cells[index];
                    }
                    while (!isNullOrUndefined(cell.visible) && !cell.visible) {
                        index = index + 1;
                        cell = row.cells[index];
                    }
                }
                if (cell.isDataCell) {
                    let templateFn: { [x: string]: Function } = {};
                    /* tslint:disable-next-line:max-line-length */
                    if (!isNullOrUndefined(cell.column.footerTemplate) || !isNullOrUndefined(cell.column.groupCaptionTemplate) || !isNullOrUndefined(cell.column.groupFooterTemplate)) {
                        /* tslint:disable-next-line:no-any */
                        let result: any = this.getTemplateFunction(templateFn, i, leastCaptionSummaryIndex, cell.column);
                        templateFn = result.templateFunction;
                        leastCaptionSummaryIndex = result.leastCaptionSummaryIndex;
                        /* tslint:disable-next-line:max-line-length */
                        let txt: NodeList = (templateFn[getEnumValue(CellType, cell.cellType)](row.data[cell.column.field ? cell.column.field : cell.column.columnName]));
                        value.push((<Text>txt[0]).textContent);
                        isEmpty = false;
                    } else {
                        /* tslint:disable-next-line:no-any */
                        let result: any = this.getSummaryWithoutTemplate(row.data[cell.column.field]);
                        if (!isNullOrUndefined(result)) {
                            value.push(result);
                        }
                    }
                } else {
                    value.push('');
                }
                if (isEmpty && value[i] !== '' && !isNullOrUndefined(value[i]) && value[i] !== null) {
                    isEmpty = false;
                }
                index += 1;
            }
            if (!isEmpty) {
                if (!isCaption) {
                    let gridRow: PdfGridRow = pdfGrid.rows.addRow();
                    gridRow.style.setBorder(border);
                    gridRow.style.setFont(font);
                    gridRow.style.setTextBrush(brush);
                    gridRow.style.setBackgroundBrush(backgroundBrush);
                    for (let i: number = 0; i < pdfGrid.columns.count; i++) {
                        gridRow.cells.getCell(i).value = value[i].toString();
                    }
                } else {
                    for (let i: number = 0; i < pdfGrid.columns.count; i++) {
                        captionRow.cells.getCell(i).value = value[i].toString();
                        if (i === (groupIndex + 1) && leastCaptionSummaryIndex !== -1) {
                            captionRow.cells.getCell(i).columnSpan = leastCaptionSummaryIndex - (groupIndex + 1);
                        } else if (i === (groupIndex + 1) && leastCaptionSummaryIndex === -1) {
                            captionRow.cells.getCell(i).columnSpan = pdfGrid.columns.count - (groupIndex + 1);
                        }
                    }
                }
            }
        }
    }
    /* tslint:disable-next-line:no-any */
    private getTemplateFunction(templateFn: any, index: number, leastCaptionSummaryIndex: number, column: any): any {
        if (!isNullOrUndefined(column.footerTemplate)) {
            templateFn[getEnumValue(CellType, CellType.Summary)] = compile(column.footerTemplate);
        } else if (!isNullOrUndefined(column.groupCaptionTemplate)) {
            if (leastCaptionSummaryIndex === -1) {
                leastCaptionSummaryIndex = index;
            }
            templateFn[getEnumValue(CellType, CellType.CaptionSummary)] = compile(column.groupCaptionTemplate);
        } else {
            templateFn[getEnumValue(CellType, CellType.GroupSummary)] = compile(column.groupFooterTemplate);
        }
        return { templateFunction: templateFn, leastCaptionSummaryIndex: leastCaptionSummaryIndex };
    }
    /* tslint:disable-next-line:no-any */
    private getSummaryWithoutTemplate(data: any): any {
        if (!isNullOrUndefined(data.Sum)) {
            return data.Sum;
        } else if (!isNullOrUndefined(data.Average)) {
            return data.Average;
        } else if (!isNullOrUndefined(data.Max)) {
            return data.Max;
        } else if (!isNullOrUndefined(data.Min)) {
            return data.Min;
        } else if (!isNullOrUndefined(data.Count)) {
            return data.Count;
        } else if (!isNullOrUndefined(data.TrueCount)) {
            return data.TrueCount;
        } else if (!isNullOrUndefined(data.FalseCount)) {
            return data.FalseCount;
        } else if (!isNullOrUndefined(data.Custom)) {
            return data.Custom;
        }
    }

    /**
     * Set alignment, width and type of the values of the column 
     */
    private setColumnProperties(gridColumns: Column[], pdfGrid: PdfGrid, helper: ExportHelper, gObj: IGrid): void {
        let startIndex: number = gObj.groupSettings.columns.length;
        for (let i: number = 0; i < startIndex; i++) {
            pdfGrid.columns.getColumn(i).width = 20;
        }
        for (let i: number = 0; i < gridColumns.length; i++) {
            if (!isNullOrUndefined(gridColumns[i].textAlign)) {
                pdfGrid.columns.getColumn(i + startIndex).format = this.getHorizontalAlignment(gridColumns[i].textAlign);
            }
            // Need to add width consideration with % value
            if (pdfGrid.style.allowHorizontalOverflow && !isNullOrUndefined(gridColumns[i].width)) {
                pdfGrid.columns.getColumn(i + startIndex).width = typeof gridColumns[i].width === 'number' ?
                gridColumns[i].width as number * 0.75 : helper.getConvertedWidth(gridColumns[i].width as string) * 0.75;
            }
        }
    }
    /**
     * set default style properties of each rows in exporting grid
     * @private
     */
    private setRecordThemeStyle(row: PdfGridRow, border: PdfBorders): PdfGridRow {
        if (!isNullOrUndefined(this.gridTheme) && !isNullOrUndefined(this.gridTheme.record)) {
            let fontFamily: number = !isNullOrUndefined(this.gridTheme.record.fontName) ?
            this.getFontFamily(this.gridTheme.record.fontName) : PdfFontFamily.Helvetica;
            let fontSize: number = !isNullOrUndefined(this.gridTheme.record.fontSize) ? this.gridTheme.record.fontSize : 9.75;
            let fontStyle: PdfFontStyle = this.getFontStyle(this.gridTheme.record);
            let font: PdfStandardFont | PdfTrueTypeFont  = new PdfStandardFont(fontFamily, fontSize, fontStyle);
            if (!isNullOrUndefined(this.gridTheme.record.font)) {
                font = this.gridTheme.record.font;
            }
            row.style.setFont(font);
            let pdfColor: PdfColor = new PdfColor();
            if (!isNullOrUndefined(this.gridTheme.record.fontColor)) {
                let penBrushColor: { r: number, g: number, b: number } = this.hexToRgb(this.gridTheme.record.fontColor);
                pdfColor = new PdfColor(penBrushColor.r, penBrushColor.g, penBrushColor.b);
            }
            row.style.setTextBrush(new PdfSolidBrush(pdfColor));
        } else {
            row.style.setTextBrush(new PdfSolidBrush(new PdfColor(0, 0, 0)));
        }
        let borderRecord: PdfBorders = this.gridTheme && this.gridTheme.record &&
        this.gridTheme.record.border ? this.getBorderStyle(this.gridTheme.record.border) : border;
        row.style.setBorder(borderRecord);
        return row;
    }
    /**
     * generate the formatted cell values
     * @private
     */
    private processRecord(border: PdfBorders, columns: Column[], gObj: IGrid, dataSource: Object[],
                          pdfGrid: PdfGrid, startIndex: number, pdfExportProperties: PdfExportProperties,
                          helper: ExportHelper, rowIndex?: number): number {
        let rows: Row<Column>[] = helper.getGridRowModel(columns, dataSource, gObj, rowIndex);
        for (const row of rows) {
            rowIndex++;
            // create a new row and set default style properties
            let gridRow: PdfGridRow = this.setRecordThemeStyle(pdfGrid.rows.addRow(), border);
            let cellLength: number = row.cells.length;
            for (let j: number = 0; j < cellLength; j++) {
                let gridCell: Cell<Column> = row.cells[j];
                if (gridCell.cellType !== CellType.Data) {
                    continue;
                }
                let column: Column = gridCell.column;
                let field: string = column.field;
                let cellValue: string = !isNullOrUndefined(field) ? (column.valueAccessor as Function)(field, row.data, column) : '';
                let value: string = !isNullOrUndefined(cellValue) ? cellValue : '';
                let foreignKeyData: Object;
                if (column.isForeignColumn && column.isForeignColumn()) {
                    foreignKeyData = helper.getFData(value, column);
                    value = getValue(column.foreignKeyValue, foreignKeyData);
                }
                let data: Object = row.data;
                let cell: PdfGridCell = gridRow.cells.getCell(j);
                let args: PdfQueryCellInfoEventArgs = {
                    data: data,
                    value: value,
                    column: column,
                    style: undefined,
                    colSpan: 1,
                    cell: cell
                };
                args.value = this.exportValueFormatter.formatCellValue(args);
                this.parent.trigger(events.pdfQueryCellInfo, args);
                cell.value = args.value;
                if (!isNullOrUndefined(args.style)) {
                    this.processCellStyle(cell, args);
                }
                if (args.colSpan > 1) {
                    if ((j + 1 + args.colSpan) > gridRow.cells.count) {
                        args.colSpan = gridRow.cells.count - (j + 1);
                    }
                    cell.columnSpan = args.colSpan;
                    for (let i: number = 1; i < cell.columnSpan; i++) {
                        let spanCell: PdfGridCell = gridRow.cells.getCell(j + i);
                        spanCell.value = '';
                    }
                    j += (args.colSpan - 1);
                }
            }
            if (row.isExpand) {
                let gridRow: PdfGridRow = this.setRecordThemeStyle(pdfGrid.rows.addRow(), border);
                let cell: PdfGridCell = gridRow.cells.getCell(startIndex);
                cell.columnSpan = gridRow.cells.count - (startIndex);
                cell.style.cellPadding = new PdfPaddings(10, 10, 10, 10);
                gObj.isPrinting = true;
                let exportType: ExportType = (!isNullOrUndefined(pdfExportProperties) && pdfExportProperties.exportType) ?
                pdfExportProperties.exportType : 'AllPages';
                let returnValue: {childGrid: IGrid, element: HTMLElement} =
                this.helper.createChildGrid(gObj, row, exportType, this.gridPool);
                let childGridObj: IGrid = returnValue.childGrid;
                let element: HTMLElement = returnValue.element;
                (<{actionFailure?: Function}>childGridObj).actionFailure =
                helper.failureHandler(this.gridPool, childGridObj, this.globalResolve);
                let args: ExportDetailDataBoundEventArgs = {childGrid: childGridObj, row, cell, exportProperties: pdfExportProperties };
                this.parent.trigger(events.exportDetailDataBound, args);
                (<Grid>childGridObj).beforeDataBound = this.childGridCell(cell, childGridObj, pdfExportProperties);
                childGridObj.appendTo(element);
            }
            this.parent.notify( events.exportRowDataBound, { type: 'pdf', rowObj: row });
        }
        return rowIndex;
    }

    private childGridCell(cell: PdfGridCell, childGridObj: IGrid, pdfExportProperties: PdfExportProperties): (value: Object) => Object {
        return (result: ReturnType): Object => {
            (<Grid>childGridObj).beforeDataBound = null;
            (<{cancel?: boolean}>result).cancel = true;
            cell.value = this.processGridExport(childGridObj, result, pdfExportProperties);
            (<Grid>childGridObj).destroy();
            detach(childGridObj.element);
            this.gridPool[childGridObj.id] = true;
            this.helper.checkAndExport(this.gridPool, this.globalResolve);
            return cell;
        };
    }

    private processCellStyle(cell: PdfGridCell, args: PdfQueryCellInfoEventArgs): void {

        if (!isNullOrUndefined(args.style.backgroundColor)) {
            let backColor: { r: number, g: number, b: number } = this.hexToRgb(args.style.backgroundColor);
            cell.style.backgroundBrush = new PdfSolidBrush(new PdfColor(backColor.r, backColor.g, backColor.b));
        }

        if (!isNullOrUndefined(args.style.textAlignment)) {
            cell.style.stringFormat = this.getHorizontalAlignment(args.style.textAlignment);
        }

        if (!isNullOrUndefined(args.style.cellPadding)) {
            cell.style.cellPadding = args.style.cellPadding;
        }

        if (!isNullOrUndefined(args.style.verticalAlignment)) {
            cell.style.stringFormat = this.getVerticalAlignment(args.style.verticalAlignment, cell.style.stringFormat);
        }

        if (!isNullOrUndefined(args.style.textBrushColor)) {
            let textBrushColor: { r: number, g: number, b: number } = this.hexToRgb(args.style.textBrushColor);
            cell.style.textBrush = new PdfSolidBrush(new PdfColor(textBrushColor.r, textBrushColor.g, textBrushColor.b));
        }

        if (!isNullOrUndefined(args.style.textPenColor)) {
            let textPenColor: { r: number, g: number, b: number } = this.hexToRgb(args.style.textPenColor);
            cell.style.textPen = new PdfPen(new PdfColor(textPenColor.r, textPenColor.g, textPenColor.b));
        }

        if (!isNullOrUndefined(args.style.fontFamily) || !isNullOrUndefined(args.style.fontSize) || !isNullOrUndefined(args.style.bold) ||
        !isNullOrUndefined(args.style.italic) || !isNullOrUndefined(args.style.underline) || !isNullOrUndefined(args.style.strikeout)) {
            cell.style.font = this.getFont(args);
        }

        if (!isNullOrUndefined(args.style.border)) {
            let border: PdfBorders = new PdfBorders();
            let borderWidth: number = args.style.border.width;
            // set border width
            let width: number = (!isNullOrUndefined(borderWidth) && typeof borderWidth === 'number') ? (borderWidth * 0.75) : (undefined);
            // set border color
            let color: PdfColor = new PdfColor(196, 196, 196);
            if (!isNullOrUndefined(args.style.border.color)) {
                let borderColor: { r: number, g: number, b: number } = this.hexToRgb(args.style.border.color);
                color = new PdfColor(borderColor.r, borderColor.g, borderColor.b);
            }
            let pen: PdfPen = new PdfPen(color, width);
            // set border dashStyle 'Solid <default>, Dash, Dot, DashDot, DashDotDot'
            if (!isNullOrUndefined(args.style.border.dashStyle)) {
                pen.dashStyle = this.getDashStyle(args.style.border.dashStyle);
            }
            border.all = pen;
            cell.style.borders = border;
        }

        if (!isNullOrUndefined(args.style.paragraphIndent)) {
            cell.style.stringFormat = new PdfStringFormat();
            cell.style.stringFormat.paragraphIndent = args.style.paragraphIndent;
        }
    }
    /**
     * set text alignment of each columns in exporting grid
     * @private
     */
    private getHorizontalAlignment(textAlign: string, format?: PdfStringFormat): PdfStringFormat {
        if (format === undefined) {
            format = new PdfStringFormat();
        }
        switch (textAlign) {
            case 'Right':
                format.alignment = PdfTextAlignment.Right;
                break;
            case 'Center':
                format.alignment = PdfTextAlignment.Center;
                break;
            case 'Justify':
                format.alignment = PdfTextAlignment.Justify;
                break;
            case 'Left':
                format.alignment = PdfTextAlignment.Left;
                break;
        }
        return format;
    }
    /**
     * set vertical alignment of each columns in exporting grid
     * @private
     */
    private getVerticalAlignment(verticalAlign: string, format?: PdfStringFormat, textAlign?: string): PdfStringFormat {
        if (format === undefined) {
            format = new PdfStringFormat();
            format = this.getHorizontalAlignment(textAlign, format);
        }
        switch (verticalAlign) {
            case 'Bottom':
                format.lineAlignment = PdfVerticalAlignment.Bottom;
                break;
            case 'Middle':
                format.lineAlignment = PdfVerticalAlignment.Middle;
                break;
            case 'Top':
                format.lineAlignment = PdfVerticalAlignment.Top;
                break;
        }
        return format;
    }

    private getFontFamily(fontFamily: string): number {
        switch (fontFamily) {
            case 'TimesRoman':
                return 2;
            case 'Courier':
                return 1;
            case 'Symbol':
                return 3;
            case 'ZapfDingbats':
                return 4;
            default:
                return 0;
        }
    }

    /* tslint:disable-next-line:no-any */
    private getFont(content: any): PdfFont {
        if (content.style.font) {
            return content.style.font;
        }
        let fontSize: number = (!isNullOrUndefined(content.style.fontSize)) ? (content.style.fontSize * 0.75) : 9.75;

        let fontFamily: number = (!isNullOrUndefined(content.style.fontFamily)) ?
        (this.getFontFamily(content.style.fontFamily)) : PdfFontFamily.TimesRoman;

        let fontStyle: PdfFontStyle = PdfFontStyle.Regular;
        if (!isNullOrUndefined(content.style.bold) && content.style.bold) {
            fontStyle |= PdfFontStyle.Bold;
        }

        if (!isNullOrUndefined(content.style.italic) && content.style.italic) {
            fontStyle |= PdfFontStyle.Italic;
        }

        if (!isNullOrUndefined(content.style.underline) && content.style.underline) {
            fontStyle |= PdfFontStyle.Underline;
        }

        if (!isNullOrUndefined(content.style.strikeout) && content.style.strikeout) {
            fontStyle |= PdfFontStyle.Strikeout;
        }

        return new PdfStandardFont(fontFamily, fontSize, fontStyle);
    }

    private getPageNumberStyle(pageNumberType: PdfPageNumberType): number {
        switch (pageNumberType) {
            case 'LowerLatin':
                return 2;
            case 'LowerRoman':
                return 3;
            case 'UpperLatin':
                return 4;
            case 'UpperRoman':
                return 5;
            default:
                return 1;
        }
    }

    private setContentFormat(content: PdfHeaderFooterContent, format: PdfStringFormat): { format: PdfStringFormat, size: SizeF } {
        if (!isNullOrUndefined(content.size)) {
            let width: number = content.size.width * 0.75;
            let height: number = content.size.height * 0.75;
            format = new PdfStringFormat(PdfTextAlignment.Left, PdfVerticalAlignment.Middle);
            if (!isNullOrUndefined(content.style.hAlign)) {
                switch (content.style.hAlign) {
                    case 'Right':
                        format.alignment = PdfTextAlignment.Right;
                        break;
                    case 'Center':
                        format.alignment = PdfTextAlignment.Center;
                        break;
                    case 'Justify':
                        format.alignment = PdfTextAlignment.Justify;
                        break;
                    default:
                        format.alignment = PdfTextAlignment.Left;
                }
            }
            if (!isNullOrUndefined(content.style.vAlign)) {
                format = this.getVerticalAlignment(content.style.vAlign, format);
            }
            return { format: format, size: new SizeF(width, height) };
        }
        return null;
    }

    private getPageSize(pageSize: PdfPageSize): SizeF {
        switch (pageSize) {
            case 'Letter':
                return new SizeF(612, 792);
            case 'Note':
                return new SizeF(540, 720);
            case 'Legal':
                return new SizeF(612, 1008);
            case 'A0':
                return new SizeF(2380, 3368);
            case 'A1':
                return new SizeF(1684, 2380);
            case 'A2':
                return new SizeF(1190, 1684);
            case 'A3':
                return new SizeF(842, 1190);
            case 'A5':
                return new SizeF(421, 595);
            case 'A6':
                return new SizeF(297, 421);
            case 'A7':
                return new SizeF(210, 297);
            case 'A8':
                return new SizeF(148, 210);
            case 'A9':
                return new SizeF(105, 148);
            // case 'A10':
            //     return new SizeF(74, 105);
            case 'B0':
                return new SizeF(2836, 4008);
            case 'B1':
                return new SizeF(2004, 2836);
            case 'B2':
                return new SizeF(1418, 2004);
            case 'B3':
                return new SizeF(1002, 1418);
            case 'B4':
                return new SizeF(709, 1002);
            case 'B5':
                return new SizeF(501, 709);
            case 'Archa':
                return new SizeF(648, 864);
            case 'Archb':
                return new SizeF(864, 1296);
            case 'Archc':
                return new SizeF(1296, 1728);
            case 'Archd':
                return new SizeF(1728, 2592);
            case 'Arche':
                return new SizeF(2592, 3456);
            case 'Flsa':
                return new SizeF(612, 936);
            case 'HalfLetter':
                return new SizeF(396, 612);
            case 'Letter11x17':
                return new SizeF(792, 1224);
            case 'Ledger':
                return new SizeF(1224, 792);
            default:
                return new SizeF(595, 842);
        }
    }
    private getDashStyle(dashStyle: PdfDashStyle): number {
        switch (dashStyle) {
            case 'Dash':
                return 1;
            case 'Dot':
                return 2;
            case 'DashDot':
                return 3;
            case 'DashDotDot':
                return 4;
            default:
                return 0;
        }
    }

    private getPenFromContent(content: PdfHeaderFooterContent): PdfPen {
        let pen: PdfPen = new PdfPen(new PdfColor(0, 0, 0));
        if (!isNullOrUndefined(content.style) && content.style !== null && !isNullOrUndefined(content.style.penColor)) {
            let penColor: { r: number, g: number, b: number } = this.hexToRgb(content.style.penColor);
            pen = new PdfPen(new PdfColor(penColor.r, penColor.g, penColor.b));
        }
        return pen;
    }

    private getBrushFromContent(content: PdfHeaderFooterContent): PdfSolidBrush {
        let brush: PdfSolidBrush = null;
        if (!isNullOrUndefined(content.style.textBrushColor)) {
            /* tslint:disable-next-line:max-line-length */
            let brushColor: { r: number, g: number, b: number } = this.hexToRgb(content.style.textBrushColor);
            brush = new PdfSolidBrush(new PdfColor(brushColor.r, brushColor.g, brushColor.b));
        }
        return brush;
    }
    private hexToRgb(hex: string): { r: number, g: number, b: number } {
        if (hex === null || hex === '' || hex.length !== 7) {
            throw new Error('please set valid hex value for color...');
        }
        hex = hex.substring(1);
        let bigint: number = parseInt(hex, 16);
        let r: number = (bigint >> 16) & 255;
        let g: number = (bigint >> 8) & 255;
        let b: number = bigint & 255;
        return { r: r, g: g, b: b };
    }

    private getFontStyle(theme: PdfThemeStyle): PdfFontStyle {
        let fontStyle: PdfFontStyle = PdfFontStyle.Regular;
        if (!isNullOrUndefined(theme) && theme.bold) {
            fontStyle |= PdfFontStyle.Bold;
        }
        if (!isNullOrUndefined(theme) && theme.italic) {
            fontStyle |= PdfFontStyle.Italic;
        }
        if (!isNullOrUndefined(theme) && theme.underline) {
            fontStyle |= PdfFontStyle.Underline;
        }
        if (!isNullOrUndefined(theme) && theme.strikeout) {
            fontStyle |= PdfFontStyle.Strikeout;
        }
        return fontStyle;
    }

    private getBorderStyle(border: PdfBorder) : PdfBorders {
        let borders: PdfBorders = new PdfBorders();
        if (!isNullOrUndefined(border)) {
            let borderWidth: number = border.width;
            // set border width
            let width: number = (!isNullOrUndefined(borderWidth) && typeof borderWidth === 'number') ? borderWidth * 0.75 : undefined;
            // set border color
            let color: PdfColor = new PdfColor(196, 196, 196);
            if (!isNullOrUndefined(border.color)) {
                let borderColor: { r: number, g: number, b: number } = this.hexToRgb(border.color);
                color = new PdfColor(borderColor.r, borderColor.g, borderColor.b);
            }
            let pen: PdfPen = new PdfPen(color, width);
            // set border dashStyle 'Solid <default>, Dash, Dot, DashDot, DashDotDot'
            if (!isNullOrUndefined(border.dashStyle)) {
                pen.dashStyle = this.getDashStyle(border.dashStyle);
            }
            borders.all = pen;
    } else {
        borders.all = new PdfPen(new PdfColor(234, 234, 234));
    }
        return borders;
}

    /**
     * To destroy the pdf export
     * @return {void}
     * @hidden
     */
    public destroy(): void {
        //destroy for exporting
    }
}
interface SummaryData {
    aggregates?: Object;
    level?: number;
}

/**
 * @hidden
 */
interface IThemeStyles {
    fontColor?: string;
    fontName?: string;
    fontSize?: number;
    bold?: boolean;
    border?: PdfBorders;
    font?: PdfStandardFont | PdfTrueTypeFont;
    brush?: PdfSolidBrush;
    backgroundBrush?: PdfSolidBrush;
}