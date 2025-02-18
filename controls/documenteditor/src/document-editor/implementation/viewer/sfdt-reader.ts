import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { WList } from '../list/list';
import { WListLevel } from '../list/list-level';
import { WAbstractList } from '../list/abstract-list';
import { WLevelOverride } from '../list/level-override';
import { WCharacterFormat, WListFormat, WParagraphFormat, WCellFormat, WTableFormat, WSectionFormat, WRowFormat } from '../format/index';
import { WBorder, WBorders, WShading, WCharacterStyle, WParagraphStyle, WStyles, WStyle, WTabStop } from '../format/index';
import { LayoutViewer } from './viewer';
import {
    Widget, LineWidget, ParagraphWidget, ImageElementBox, BodyWidget, TextElementBox, TableCellWidget,
    TableRowWidget, TableWidget, FieldElementBox, BlockWidget, HeaderFooterWidget, HeaderFooters,
    BookmarkElementBox, FieldTextElementBox, TabElementBox, EditRangeStartElementBox, EditRangeEndElementBox,
    ChartElementBox, ChartCategoryAxis, ChartLegend, ChartLayout, ChartTitleArea, ChartDataFormat,
    ChartDataTable, ChartArea, ChartCategory, ChartData, ChartSeries, ChartDataLabels, ChartTrendLines, ChartSeriesFormat
} from './page';
import { HelperMethods } from '../editor/editor-helper';
import { Dictionary } from '../../base/dictionary';
import { ChartComponent } from '@syncfusion/ej2-office-chart';
/** 
 * @private
 */
export class SfdtReader {
    /* tslint:disable:no-any */
    private viewer: LayoutViewer = undefined;
    private fieldSeparator: FieldElementBox;
    private isPageBreakInsideTable: boolean = false;
    private editableRanges: Dictionary<string, EditRangeStartElementBox>;

    private get isPasting(): boolean {
        return this.viewer && this.viewer.owner.isPastingContent;
    }
    constructor(viewer: LayoutViewer) {
        this.viewer = viewer;
        this.editableRanges = new Dictionary<string, EditRangeStartElementBox>();
    }
    /**
     * @private
     * @param json 
     */
    public convertJsonToDocument(json: string): BodyWidget[] {
        let sections: BodyWidget[] = [];
        let jsonObject: any = JSON.parse(json);
        let characterFormat: any = isNullOrUndefined(jsonObject.characterFormat) ?
            this.viewer.owner.characterFormat : jsonObject.characterFormat;
        this.parseCharacterFormat(characterFormat, this.viewer.characterFormat);
        let paragraphFormat: any = isNullOrUndefined(jsonObject.paragraphFormat) ?
            this.viewer.owner.paragraphFormat : jsonObject.paragraphFormat;
        this.parseParagraphFormat(paragraphFormat, this.viewer.paragraphFormat);
        this.parseDocumentProtection(jsonObject);
        if (!isNullOrUndefined(jsonObject.defaultTabWidth)) {
            this.viewer.defaultTabWidth = jsonObject.defaultTabWidth;
        }
        if (!isNullOrUndefined(jsonObject.background)) {
            this.viewer.backgroundColor = this.getColor(jsonObject.background.color);
        }
        if (!isNullOrUndefined(jsonObject.abstractLists)) {
            this.parseAbstractList(jsonObject, this.viewer.abstractLists);
        }
        if (!isNullOrUndefined(jsonObject.lists)) {
            this.parseList(jsonObject, this.viewer.lists);
        }
        if (!isNullOrUndefined(jsonObject.styles)) {
            this.parseStyles(jsonObject, this.viewer.styles);
        }
        if (!isNullOrUndefined(jsonObject.sections)) {
            this.parseSections(jsonObject.sections, sections);
        }
        return sections;
    }
    private parseDocumentProtection(data: any): void {
        if (!isNullOrUndefined(data.formatting)) {
            this.viewer.restrictFormatting = data.formatting;
        }
        if (!isNullOrUndefined(data.enforcement)) {
            this.viewer.isDocumentProtected = data.enforcement;
        }
        if (!isNullOrUndefined(data.protectionType)) {
            this.viewer.protectionType = data.protectionType;
        }
        if (!isNullOrUndefined(data.hashValue)) {
            this.viewer.hashValue = data.hashValue;
        }
        if (!isNullOrUndefined(data.saltValue)) {
            this.viewer.saltValue = data.saltValue;
        }
    }
    private parseStyles(data: any, styles: WStyles): void {
        for (let i: number = 0; i < data.styles.length; i++) {
            if (isNullOrUndefined(this.viewer.styles.findByName(data.styles[i].name))) {
                this.parseStyle(data, data.styles[i], styles);
            }
        }
    }
    public parseStyle(data: any, style: any, styles: WStyles): void {
        let wStyle: any;
        if (!isNullOrUndefined(style.type)) {
            if (style.type === 'Paragraph') {
                wStyle = new WParagraphStyle();
                wStyle.type = 'Paragraph';
            }
            if (style.type === 'Character') {
                wStyle = new WCharacterStyle();
                wStyle.type = 'Character';
            }
            if (!isNullOrUndefined(style.name)) {
                wStyle.name = style.name;
            }
            styles.push(wStyle);
            if (!isNullOrUndefined(style.basedOn)) {
                let basedOn: Object = styles.findByName(style.basedOn);
                if (!isNullOrUndefined(basedOn)) {
                    if ((basedOn as WStyle).type === wStyle.type) {
                        wStyle.basedOn = basedOn;
                    }
                } else {
                    let basedStyle: any = this.getStyle(style.basedOn, data);
                    let styleString: any;
                    if (!isNullOrUndefined(basedStyle) && basedStyle.type === wStyle.type) {
                        styleString = basedStyle;
                    } else {
                        if (wStyle.type === 'Paragraph') {
                            styleString = JSON.parse('{"type":"Paragraph","name":"Normal","next":"Normal"}');
                        } else {
                            styleString = JSON.parse('{"type": "Character","name": "Default Paragraph Font"}');
                        }
                    }
                    this.parseStyle(data, styleString, styles);
                    wStyle.basedOn = styles.findByName(styleString.name);
                }
            }
            if (!isNullOrUndefined(style.link)) {
                let link: Object = styles.findByName(style.link);
                let linkStyle: any = this.getStyle(style.link, data);
                let styleString: any;
                if (isNullOrUndefined(link)) {
                    if (isNullOrUndefined(linkStyle)) {
                        //Construct the CharacterStyle string
                        let charaStyle: any = {};
                        charaStyle.characterFormat = style.characterFormat;
                        charaStyle.name = style.name + ' Char';
                        charaStyle.type = 'Character';
                        //TODO: Implement basedOn
                        charaStyle.basedOn = style.basedOn === 'Normal' ? 'Default Paragraph Font' : (style.basedOn + ' Char');
                        styleString = charaStyle;
                    } else {
                        styleString = linkStyle;
                    }
                    this.parseStyle(data, styleString, styles);
                    wStyle.link = isNullOrUndefined(styles.findByName(styleString.name)) ? style.link : styles.findByName(styleString.name);
                } else {
                    wStyle.link = link;
                }

            }
            if (!isNullOrUndefined(style.characterFormat)) {
                this.parseCharacterFormat(style.characterFormat, wStyle.characterFormat);
            }
            if (!isNullOrUndefined(style.paragraphFormat)) {
                this.parseParagraphFormat(style.paragraphFormat, wStyle.paragraphFormat);
            }
            if (!isNullOrUndefined(style.next)) {
                if (style.next === style.name) {
                    wStyle.next = wStyle;
                } else {
                    let next: Object = styles.findByName(style.next);
                    if (!isNullOrUndefined(next) && (next as WStyle).type === wStyle.type) {
                        wStyle.next = next;
                    } else {
                        let nextStyleString: any = this.getStyle(style.next, data);
                        if (!isNullOrUndefined(nextStyleString)) {
                            this.parseStyle(data, nextStyleString, styles);
                            wStyle.next = styles.findByName(nextStyleString.name);
                        } else {
                            wStyle.next = wStyle;
                        }
                    }
                }
            }
        }
    }
    private getStyle(name: string, data: any): any {
        for (let i: number = 0; i < data.styles.length; i++) {
            if (data.styles[i].name === name) {
                return data.styles[i];
            }
        }
        return undefined;
    }
    private parseAbstractList(data: any, abstractLists: WAbstractList[]): void {
        for (let i: number = 0; i < data.abstractLists.length; i++) {
            let abstractList: WAbstractList = new WAbstractList();
            let abstract: any = data.abstractLists[i];
            abstractLists.push(abstractList);
            if (!isNullOrUndefined(abstract)) {
                if (!isNullOrUndefined(abstract.abstractListId)) {
                    abstractList.abstractListId = abstract.abstractListId;
                }
                if (!isNullOrUndefined(abstract.levels)) {
                    for (let j: number = 0; j < abstract.levels.length; j++) {
                        let level: any = abstract.levels[j];
                        if (!isNullOrUndefined(level)) {
                            let listLevel: WListLevel = this.parseListLevel(level, abstractList);
                            abstractList.levels.push(listLevel);
                        }
                    }
                }
            }
        }
    }
    private parseListLevel(data: any, owner: any): WListLevel {
        let listLevel: WListLevel = new WListLevel(owner);
        if (data.listLevelPattern === 'Bullet') {
            listLevel.listLevelPattern = 'Bullet';
            listLevel.numberFormat = !isNullOrUndefined(data.numberFormat) ? data.numberFormat : '';
        } else {
            listLevel.listLevelPattern = data.listLevelPattern;
            listLevel.startAt = data.startAt;
            listLevel.numberFormat = !isNullOrUndefined(data.numberFormat) ? data.numberFormat : '';
            if (data.restartLevel >= 0) {
                listLevel.restartLevel = data.restartLevel;
            } else {
                listLevel.restartLevel = data.levelNumber;
            }
        }
        listLevel.followCharacter = data.followCharacter;
        this.parseCharacterFormat(data.characterFormat, listLevel.characterFormat);
        this.parseParagraphFormat(data.paragraphFormat, listLevel.paragraphFormat);
        return listLevel;
    }
    private parseList(data: any, listCollection: WList[]): void {
        for (let i: number = 0; i < data.lists.length; i++) {
            let list: WList = new WList();
            let lists: any = data.lists[i];
            if (!isNullOrUndefined(lists.abstractListId)) {
                list.abstractListId = lists.abstractListId;
                list.abstractList = this.viewer.getAbstractListById(lists.abstractListId);
            }
            listCollection.push(list);
            if (!isNullOrUndefined(lists.listId)) {
                list.listId = lists.listId;
            }
            if (lists.hasOwnProperty('levelOverrides')) {
                this.parseLevelOverride(lists.levelOverrides, list);
            }
        }
    }
    private parseLevelOverride(data: any, list: WList): void {
        if (isNullOrUndefined(data)) {
            return;
        }
        for (let i: number = 0; i < data.length; i++) {
            let levelOverrides: WLevelOverride = new WLevelOverride();
            let levelOverride: any = data[i];
            levelOverrides.startAt = levelOverride.startAt;
            levelOverrides.levelNumber = levelOverride.levelNumber;
            if (!isNullOrUndefined(levelOverride.overrideListLevel)) {
                levelOverrides.overrideListLevel = this.parseListLevel(levelOverride.overrideListLevel, levelOverrides);
            }
            list.levelOverrides.push(levelOverrides);
        }
    }
    private parseSections(data: any, sections: BodyWidget[]): void {
        for (let i: number = 0; i < data.length; i++) {
            let section: BodyWidget = new BodyWidget();
            section.sectionFormat = new WSectionFormat(section);
            section.index = i;
            let item: any = data[i];
            if (!isNullOrUndefined(item.sectionFormat)) {
                this.parseSectionFormat(item.sectionFormat, section.sectionFormat);
            }
            if (isNullOrUndefined(item.headersFooters)) {
                item.headersFooters = {};
            }
            this.viewer.headersFooters.push(this.parseHeaderFooter(item.headersFooters, this.viewer.headersFooters));
            this.parseTextBody(item.blocks, section, i + 1 < data.length);
            for (let i: number = 0; i < section.childWidgets.length; i++) {
                (section.childWidgets[i] as BlockWidget).containerWidget = section;
            }
            sections.push(section);
        }
    }
    /**
     * @private
     */
    public parseHeaderFooter(data: any, headersFooters: any): HeaderFooters {
        let hfs: HeaderFooters = {};
        if (!isNullOrUndefined(data.header)) {
            let oddHeader: HeaderFooterWidget = new HeaderFooterWidget('OddHeader');
            hfs[0] = oddHeader;
            this.parseTextBody(data.header.blocks, oddHeader);
        }
        if (!isNullOrUndefined(data.footer)) {
            let oddFooter: HeaderFooterWidget = new HeaderFooterWidget('OddFooter');
            hfs[1] = oddFooter;
            this.parseTextBody(data.footer.blocks, oddFooter);
        }
        if (!isNullOrUndefined(data.evenHeader)) {
            let evenHeader: HeaderFooterWidget = new HeaderFooterWidget('EvenHeader');
            hfs[2] = evenHeader;
            this.parseTextBody(data.evenHeader.blocks, evenHeader);
        }
        if (!isNullOrUndefined(data.evenFooter)) {
            let evenFooter: HeaderFooterWidget = new HeaderFooterWidget('EvenFooter');
            hfs[3] = evenFooter;
            this.parseTextBody(data.evenFooter.blocks, evenFooter);
        }
        if (!isNullOrUndefined(data.firstPageHeader)) {
            let firstPageHeader: HeaderFooterWidget = new HeaderFooterWidget('FirstPageHeader');
            hfs[4] = firstPageHeader;
            this.parseTextBody(data.firstPageHeader.blocks, firstPageHeader);
        }
        if (!isNullOrUndefined(data.firstPageFooter)) {
            let firstPageFooter: HeaderFooterWidget = new HeaderFooterWidget('FirstPageFooter');
            hfs[5] = firstPageFooter;
            this.parseTextBody(data.firstPageFooter.blocks, firstPageFooter);
        }
        return hfs;
    }
    private parseTextBody(data: any, section: Widget, isSectionBreak?: boolean): void {
        this.parseBody(data, section.childWidgets as BlockWidget[], section, isSectionBreak);
    }
    public parseBody(data: any, blocks: BlockWidget[], container?: Widget, isSectionBreak?: boolean): void {
        if (!isNullOrUndefined(data)) {
            for (let i: number = 0; i < data.length; i++) {
                let block: any = data[i];
                let hasValidElmts: boolean = false;
                if (block.hasOwnProperty('inlines')) {
                    let writeInlineFormat: boolean = false;
                    //writeInlineFormat = this.isPasting && i === data.length - 1;
                    let paragraph: ParagraphWidget = new ParagraphWidget();
                    paragraph.characterFormat = new WCharacterFormat(paragraph);
                    paragraph.paragraphFormat = new WParagraphFormat(paragraph);
                    if (block.inlines.length > 0) {
                        hasValidElmts = this.parseParagraph(block.inlines, paragraph, writeInlineFormat);
                    }
                    if (!(isSectionBreak && block === data[data.length - 1] && !hasValidElmts)) {
                        this.parseCharacterFormat(block.characterFormat, paragraph.characterFormat);
                        this.parseParagraphFormat(block.paragraphFormat, paragraph.paragraphFormat);
                        let styleObj: Object;
                        if (!isNullOrUndefined(block.paragraphFormat) && !isNullOrUndefined(block.paragraphFormat.styleName)) {
                            styleObj = this.viewer.styles.findByName(block.paragraphFormat.styleName, 'Paragraph');
                            if (!isNullOrUndefined(styleObj)) {
                                paragraph.paragraphFormat.ApplyStyle(styleObj as WStyle);
                            }
                        }
                        blocks.push(paragraph);
                    } else if (isSectionBreak && data.length === 1) {
                        blocks.push(paragraph);
                    }
                    paragraph.index = i;
                    paragraph.containerWidget = container;
                } else if (block.hasOwnProperty('rows')) {
                    this.parseTable(block, blocks, i, container);
                }
            }
        }
    }
    private parseTable(block: any, blocks: BlockWidget[], index: number, section: Widget): void {
        let table: TableWidget = new TableWidget();
        table.index = index;
        table.tableFormat = new WTableFormat(table);
        if (!isNullOrUndefined(block.tableFormat)) {
            this.parseTableFormat(block.tableFormat, table.tableFormat);
        }
        table.title = block.title;
        table.description = block.description;
        for (let i: number = 0; i < block.rows.length; i++) {
            let row: TableRowWidget = new TableRowWidget();
            row.rowFormat = new WRowFormat(row);
            let tableRow: any = block.rows[i];
            if (tableRow.hasOwnProperty('rowFormat')) {
                this.parseRowFormat(tableRow.rowFormat, row.rowFormat);
                this.parseRowGridValues(tableRow, row.rowFormat);
                this.parseRowGridValues(tableRow.rowFormat, row.rowFormat);
                row.index = i;
                for (let j: number = 0; j < block.rows[i].cells.length; j++) {
                    let cell: TableCellWidget = new TableCellWidget();
                    cell.cellFormat = new WCellFormat(cell);
                    row.childWidgets.push(cell);
                    cell.containerWidget = row;
                    cell.index = j;
                    cell.rowIndex = i;
                    cell.columnIndex = j;
                    if (block.rows[i].cells[j].hasOwnProperty('cellFormat')) {
                        this.parseCellFormat(block.rows[i].cells[j].cellFormat, cell.cellFormat);
                    }
                    this.isPageBreakInsideTable = true;
                    this.parseTextBody(block.rows[i].cells[j].blocks, cell, false);
                    this.isPageBreakInsideTable = false;
                }
            }
            table.childWidgets.push(row);
            row.containerWidget = table;
        }
        table.containerWidget = section;
        blocks.push(table);
        table.isGridUpdated = false;
    }
    private parseRowGridValues(data: any, rowFormat: WRowFormat): void {
        if (!isNullOrUndefined(data.gridBefore)) {
            rowFormat.gridBefore = data.gridBefore;
        }
        if (!isNullOrUndefined(data.gridBeforeWidth)) {
            rowFormat.gridBeforeWidth = data.gridBeforeWidth;
        }
        if (!isNullOrUndefined(data.gridBeforeWidthType)) {
            rowFormat.gridBeforeWidthType = data.gridBeforeWidthType;
        }
        if (!isNullOrUndefined(data.gridAfter)) {
            rowFormat.gridAfter = data.gridAfter;
        }
        if (!isNullOrUndefined(data.gridAfterWidth)) {
            rowFormat.gridAfterWidth = data.gridAfterWidth;
        }
        if (!isNullOrUndefined(data.gridAfterWidthType)) {
            rowFormat.gridAfterWidthType = data.gridAfterWidthType;
        }
    }

    // tslint:disable:max-func-body-length
    private parseParagraph(data: any, paragraph: ParagraphWidget, writeInlineFormat?: boolean): boolean {
        let lineWidget: LineWidget = new LineWidget(paragraph);
        let hasValidElmts: boolean = false;
        for (let i: number = 0; i < data.length; i++) {
            let inline: any = data[i];
            if (inline.hasOwnProperty('text')) {
                let textElement: FieldTextElementBox | TextElementBox | TabElementBox = undefined;
                if (this.viewer.isPageField) {
                    textElement = new FieldTextElementBox();
                    (textElement as FieldTextElementBox).fieldBegin = this.viewer.fieldStacks[this.viewer.fieldStacks.length - 1];
                } else if (inline.text === '\t') {
                    textElement = new TabElementBox();

                } else if (inline.text === '\f' && this.isPageBreakInsideTable) {
                    continue;
                } else {
                    textElement = new TextElementBox();
                }
                textElement.characterFormat = new WCharacterFormat(textElement);
                this.parseCharacterFormat(inline.characterFormat, textElement.characterFormat, writeInlineFormat);
                /*�tslint:disable-next-line:max-line-length */
                if (!isNullOrUndefined(inline.characterFormat) && !isNullOrUndefined(inline.characterFormat.styleName)) {
                    let charStyle: Object = this.viewer.styles.findByName(inline.characterFormat.styleName, 'Character');
                    textElement.characterFormat.ApplyStyle(charStyle as WStyle);
                }
                textElement.text = inline.text;
                textElement.line = lineWidget;
                lineWidget.children.push(textElement);
                hasValidElmts = true;
            } else if (inline.hasOwnProperty('chartType')) {
                // chartPreservation
                let chartElement: ChartElementBox = new ChartElementBox();
                chartElement.title = inline.chartTitle;
                chartElement.type = inline.chartType;
                chartElement.chartGapWidth = inline.gapWidth;
                chartElement.chartOverlap = inline.overlap;
                this.parseChartTitleArea(inline.chartTitleArea, chartElement.chartTitleArea);
                this.parseChartArea(inline.chartArea, chartElement.chartArea);
                this.parseChartArea(inline.plotArea, chartElement.chartPlotArea);
                this.parseChartLegend(inline.chartLegend, chartElement.chartLegend);
                this.parseChartData(inline, chartElement);
                this.parseChartCategoryAxis(inline.chartPrimaryCategoryAxis, chartElement.chartPrimaryCategoryAxis);
                this.parseChartCategoryAxis(inline.chartPrimaryValueAxis, chartElement.chartPrimaryValueAxis);
                if (inline.chartDataTable != null) {
                    this.parseChartDataTable(inline.chartDataTable, chartElement.chartDataTable);
                }
                chartElement.line = lineWidget;
                lineWidget.children.push(chartElement);
                chartElement.height = HelperMethods.convertPointToPixel(inline.height);
                chartElement.width = HelperMethods.convertPointToPixel(inline.width);

                let officeChart: ChartComponent = new ChartComponent();
                officeChart.chartRender(inline);
                chartElement.officeChart = officeChart;
                officeChart.chart.appendTo(chartElement.targetElement);
                hasValidElmts = true;
            } else if (inline.hasOwnProperty('imageString')) {
                let image: ImageElementBox = new ImageElementBox(data[i].isInlineImage);
                image.isMetaFile = data[i].isMetaFile;
                image.characterFormat = new WCharacterFormat(image);
                image.line = lineWidget;
                lineWidget.children.push(image);
                let imageString: string = HelperMethods.formatClippedString(inline.imageString).formatClippedString;
                let isValidImage: boolean = this.validateImageUrl(imageString);
                if (!isValidImage) {
                    // tslint:disable-next-line:max-line-length
                    image.imageString = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAgVBMVEX///8AAADgAADY2Njl5eVcXFxjY2NZWVl/f3+wsLCmpqb4+PiioqKpqam7u7vV1dX2uLj2wsLhFRXzpKT3vb30sbHhCwv74+P40dH+9vbkIyO2trbBwcHLy8tsbGycnJz529v4zMzrbGzlLS3qZmblNzfrdXXoRkbvi4vvgYHlHh7CZsBOAAADpUlEQVR4nO3da1faQBSF4ekAUQlUEFs14AXxVv7/D6yaQiZx5mSEYXF2ut+PNKzyyK5diYDmR9czx34AB49C/CjE759w3jvvWr15Tdgz3atXE54f++EcIArxoxA/CvGjED8K8aMQPwrxoxA/CvGLEeZ9jPJdhfk4GyCUjb3ECGE/Q6m/q3DwfudjP0ERZYN9hKdn2hvd3+0jHJz5/kBVuTk96bbQUEjhYR9ckiikUH8UUqg/CinUH4UU6o9CCvVHIYX6o5BC/VFIof4opFB/FFKoPwop1B+FFOqPQgrjyxfjVC38Lxk9tnAxGqZqdKtSOE4GHA5/fuNJpDCtcNHbv4VqYYqPLjgfUViPQgrjozA2CptRSGF8/59w+Wrt+rr1btNna1cPzg0wwuXavncxabnX7PfHYYXzlYARvlobQZyUR9mXm+1NMEK7SSLONgcVV9vb8IQXv4J3KSeKKlxXxNCzONkeYp8AV3p9UT1+P3FWHVAsq5thhGZSEb1DrSZq7dS5HUdoLiuBZ6jORG3tCwAkNJfCUJ2Jrqe1P0ESCkMNTdSACYNDDU7UoAkDQw1P1MAJvUMVJmrwhJ6hShM1gMIvQxUnahCFjaHKEzWQQneoxR95ogZTWBuqPFEDKnSHKk/UoArdoYoTNbDC5lBDEzW4QjMpYiZqgIXG/S76JhwHK5zVVipcnkIVuv/RW/HyFKhwYhuFr6NiCmdNoDBUSGFjovJQEYXuRN9ahwoorJ8uSZenPsMTNk+X2q6jwgm/ntHL11HhhL4zenmoYEL/Gb04VCxh6KKTNFQoYfiikzBUJKF00Sk8VCChfF00OFQcYdt10dBQYYRT5xn0n9G7Q0X8GfCzNNEyZ6iPgD/HlydaVg11DfhajJaJlm2HugIUrlomWrYZKuJKHz6vHhbSM/hROdRnxNe1meuXYvW0DB6+aflYrB7dlzDiCM3N1dVN6GDhMCDhjlHYjEIK46MwNgqbUUhhfJ/vA07wO8N1vw94ONo/3e/lTpVOYfc/UyG//ZmqW52fi/FuTNW3/lZ+eguF+qOQQv1RSKH+KKRQfxRSqD8KKdQfhRTqj0IK9UchhfqjkEL9UUih/iikUH8UUqg/CmXh6Hsv3jlK+wnvD/vgkrSHMMuyu1P9ZdmuwnycDQYn+svG3n9KEUKT9zHyf6+IEWJHIX4U4kchfhTiRyF+FOJHIX4U4kchfnVhijeZa6sunCf4ZdPamteEHY5C/CjEr/vCv0ec0g+AtS1QAAAAAElFTkSuQmCC';
                } else {
                    image.imageString = inline.imageString;
                }
                image.width = HelperMethods.convertPointToPixel(inline.width);
                image.height = HelperMethods.convertPointToPixel(inline.height);
                this.parseCharacterFormat(inline.characterFormat, image.characterFormat);
                hasValidElmts = true;
            } else if (inline.hasOwnProperty('hasFieldEnd') || (inline.hasOwnProperty('fieldType') && inline.fieldType === 0)) {
                let fieldBegin: FieldElementBox = new FieldElementBox(0);
                fieldBegin.fieldCodeType = inline.fieldCodeType;
                fieldBegin.hasFieldEnd = inline.hasFieldEnd;
                this.viewer.fieldStacks.push(fieldBegin);
                fieldBegin.line = lineWidget;
                this.viewer.fields.push(fieldBegin);
                lineWidget.children.push(fieldBegin);
            } else if (inline.hasOwnProperty('fieldType')) {
                let field: FieldElementBox = undefined;
                if (inline.fieldType === 2) {
                    field = new FieldElementBox(2);
                    this.fieldSeparator = field;
                    if (this.viewer.fieldStacks.length > 0) {
                        field.fieldBegin = this.viewer.fieldStacks[this.viewer.fieldStacks.length - 1];
                        field.fieldBegin.fieldSeparator = field;
                        //finds the whether the field is page filed or not
                        let lineWidgetCount: number = lineWidget.children.length;
                        if (lineWidgetCount >= 2 && (lineWidget.children[lineWidgetCount - 2] instanceof FieldElementBox)
                            && (lineWidget.children[lineWidgetCount - 2] as FieldElementBox).hasFieldEnd
                            && (lineWidget.children[lineWidgetCount - 1] instanceof TextElementBox)) {
                            let fieldElementText: string = (lineWidget.children[lineWidgetCount - 1] as TextElementBox).text;
                            if (fieldElementText.match('PAGE')) {
                                this.viewer.isPageField = true;
                            }
                        }
                    }
                } else if (inline.fieldType === 1) {
                    field = new FieldElementBox(1);
                    //For Field End Updated begin and separator.                                      
                    if (this.viewer.fieldStacks.length > 0) {
                        field.fieldBegin = this.viewer.fieldStacks[this.viewer.fieldStacks.length - 1];
                        field.fieldBegin.fieldEnd = field;
                    }
                    if (!isNullOrUndefined(field.fieldBegin) && field.fieldBegin.fieldSeparator) {
                        field.fieldSeparator = field.fieldBegin.fieldSeparator;
                        field.fieldBegin.fieldSeparator.fieldEnd = field;
                        hasValidElmts = true;
                    }
                    //After setting all the property clear the field values
                    this.viewer.fieldStacks.splice(this.viewer.fieldStacks.length - 1, 1);
                    this.fieldSeparator = undefined;
                    this.viewer.isPageField = false;
                    this.viewer.fieldCollection.push(field.fieldBegin);
                }
                field.line = lineWidget;
                lineWidget.children.push(field);
            } else if (inline.hasOwnProperty('bookmarkType')) {
                let bookmark: BookmarkElementBox = undefined;
                bookmark = new BookmarkElementBox(inline.bookmarkType);
                bookmark.name = inline.name;
                lineWidget.children.push(bookmark);
                bookmark.line = lineWidget;
                if (inline.bookmarkType === 0) {
                    this.viewer.bookmarks.add(bookmark.name, bookmark);
                } else if (inline.bookmarkType === 1) {
                    if (this.viewer.bookmarks.containsKey(bookmark.name)) {
                        let bookmarkStart: BookmarkElementBox = this.viewer.bookmarks.get(bookmark.name);
                        bookmarkStart.reference = bookmark;
                        bookmark.reference = bookmarkStart;
                    }
                }
                if (bookmark.name.indexOf('_') !== 0) {
                    hasValidElmts = true;
                }
            } else if (inline.hasOwnProperty('editRangeId')) {
                if (inline.hasOwnProperty('editableRangeStart')) {
                    let permEnd: EditRangeEndElementBox = new EditRangeEndElementBox();
                    if (this.editableRanges.containsKey(inline.editRangeId)) {
                        let start: EditRangeStartElementBox = this.editableRanges.get(inline.editRangeId);
                        permEnd.editRangeStart = start;
                        start.editRangeEnd = permEnd;
                        this.editableRanges.remove(inline.editRangeId);
                    }
                    lineWidget.children.push(permEnd);
                    permEnd.line = lineWidget;
                } else {
                    let permStart: EditRangeStartElementBox = this.parseEditableRangeStart(inline);
                    lineWidget.children.push(permStart);
                    permStart.line = lineWidget;
                    if (!this.editableRanges.containsKey(inline.editRangeId)) {
                        this.editableRanges.add(inline.editRangeId, permStart);
                    }
                }
                hasValidElmts = true;
            }
        }
        paragraph.childWidgets.push(lineWidget);
        return hasValidElmts;
    }
    private parseEditableRangeStart(data: any): EditRangeStartElementBox {
        let permStart: EditRangeStartElementBox = new EditRangeStartElementBox();
        if (!isNullOrUndefined(data.columnFirst)) {
            permStart.columnFirst = data.columnFirst;
        }
        if (!isNullOrUndefined(data.columnLast)) {
            permStart.columnLast = data.columnLast;
        }
        if (!isNullOrUndefined(data.user)) {
            permStart.user = data.user;
            if (this.viewer.userCollection.indexOf(permStart.user) === -1) {
                this.viewer.userCollection.push(permStart.user);
            }
            this.addEditRangeCollection(permStart.user, permStart);
        }
        if (!isNullOrUndefined(data.group)) {
            permStart.group = data.group;
            permStart.group = permStart.group === 'everyone' ? 'Everyone' : permStart.group;
            if (this.viewer.userCollection.indexOf(permStart.group) === -1) {
                this.viewer.userCollection.push(permStart.group);
            }
            this.addEditRangeCollection(permStart.group, permStart);
        }
        return permStart;
    }
    private addEditRangeCollection(name: string, permStart: EditRangeStartElementBox): void {
        if (this.viewer.editRanges.containsKey(name)) {
            let editStartCollection: EditRangeStartElementBox[] = this.viewer.editRanges.get(name);
            editStartCollection.push(permStart);
        } else {
            let newEditStartCollection: EditRangeStartElementBox[] = [];
            newEditStartCollection.push(permStart);
            this.viewer.editRanges.add(name, newEditStartCollection);
        }
    }
    private parseChartTitleArea(titleArea: any, chartTitleArea: ChartTitleArea): void {
        chartTitleArea.chartfontName = titleArea.fontName;
        chartTitleArea.chartFontSize = titleArea.fontSize;
        this.parseChartDataFormat(titleArea.dataFormat, chartTitleArea.dataFormat);
        this.parseChartLayout(titleArea.layout, chartTitleArea.layout);

    }
    private parseChartDataFormat(format: any, dataFormat: ChartDataFormat): void {
        dataFormat.fill.color = format.fill.foreColor;
        dataFormat.fill.rgb = format.fill.rgb;
        dataFormat.line.color = format.line.color;
        dataFormat.line.rgb = format.line.rgb;
    }
    private parseChartLayout(layout: any, chartLayout: ChartLayout): void {
        chartLayout.chartLayoutLeft = layout.layoutX;
        chartLayout.chartLayoutTop = layout.layoutY;
    }
    private parseChartLegend(legend: any, chartLegend: ChartLegend): void {
        chartLegend.chartLegendPostion = legend.position;
        this.parseChartTitleArea(legend.chartTitleArea, chartLegend.chartTitleArea);
    }
    private parseChartCategoryAxis(categoryAxis: any, primaryAxis: ChartCategoryAxis): void {
        primaryAxis.categoryAxisType = categoryAxis.categoryType;
        primaryAxis.categoryNumberFormat = categoryAxis.numberFormat;
        primaryAxis.interval = categoryAxis.majorUnit;
        primaryAxis.axisFontSize = categoryAxis.fontSize;
        primaryAxis.axisFontName = categoryAxis.fontName;
        primaryAxis.max = categoryAxis.maximumValue;
        primaryAxis.min = categoryAxis.minimumValue;
        primaryAxis.majorGridLines = categoryAxis.hasMajorGridLines;
        primaryAxis.minorGridLines = categoryAxis.hasMinorGridLines;
        primaryAxis.majorTick = categoryAxis.majorTickMark;
        primaryAxis.minorTick = categoryAxis.minorTickMark;
        primaryAxis.tickPosition = categoryAxis.tickLabelPosition;
        primaryAxis.categoryAxisTitle = categoryAxis.chartTitle;
        if (categoryAxis.chartTitle != null) {
            this.parseChartTitleArea(categoryAxis.chartTitleArea, primaryAxis.chartTitleArea);
        }
    }
    private parseChartDataTable(dataTable: any, chartDataTable: ChartDataTable): void {
        chartDataTable.showSeriesKeys = dataTable.showSeriesKeys;
        chartDataTable.hasHorzBorder = dataTable.hasHorzBorder;
        chartDataTable.hasVertBorder = dataTable.hasVertBorder;
        chartDataTable.hasBorders = dataTable.hasBorders;
    }
    private parseChartArea(area: any, chartArea: ChartArea): void {
        chartArea.chartForeColor = area.foreColor;
    }
    private parseChartData(inline: any, chart: ChartElementBox): void {
        for (let i: number = 0; i < inline.chartCategory.length; i++) {
            let chartCategory: ChartCategory = new ChartCategory();
            let xData: any = inline.chartCategory[i];
            if (xData.hasOwnProperty('categoryXName')) {
                chartCategory.xName = xData.categoryXName;
            }
            for (let j: number = 0; j < xData.chartData.length; j++) {
                let chartData: ChartData = new ChartData();
                let yData: any = xData.chartData[j];
                chartData.yAxisValue = yData.yValue;
                if (inline.chartType === 'Bubble') {
                    chartData.bubbleSize = yData.size;
                }
                chartCategory.chartData.push(chartData);
            }
            chart.chartCategory.push(chartCategory);
        }
        this.parseChartSeries(inline, chart);
    }
    private parseChartSeries(inline: any, chart: ChartElementBox): void {
        let chartType: string = inline.chartType;
        let isPieType: boolean = (chartType === 'Pie' || chartType === 'Doughnut');
        for (let i: number = 0; i < inline.chartSeries.length; i++) {
            let chartSeries: ChartSeries = new ChartSeries();
            let xData: any = inline.chartSeries[i];
            if (xData.hasOwnProperty('seriesName')) {
                chartSeries.seriesName = xData.seriesName;
                if (isPieType) {
                    if (xData.hasOwnProperty('firstSliceAngle')) {
                        chartSeries.firstSliceAngle = xData.firstSliceAngle;
                    }
                    if (chartType === 'Doughnut') {
                        chartSeries.doughnutHoleSize = xData.holeSize;
                    }
                }
                if (xData.hasOwnProperty('dataLabel')) {
                    this.parseChartDataLabels(xData.dataLabel, chartSeries);
                }
                if (xData.hasOwnProperty('seriesFormat')) {
                    let seriesFormat: ChartSeriesFormat = new ChartSeriesFormat();
                    let format: any = xData.seriesFormat;
                    seriesFormat.markerStyle = format.markerStyle;
                    seriesFormat.markerColor = format.markerColor;
                    seriesFormat.numberValue = format.markerSize;
                    chartSeries.seriesFormat = seriesFormat;
                }
                if (xData.hasOwnProperty('errorBar')) {
                    let errorBar: any = chartSeries.errorBar;
                    errorBar.errorType = xData.errorBar.type;
                    errorBar.errorDirection = xData.errorBar.direction;
                    errorBar.errorEndStyle = xData.errorBar.endStyle;
                    errorBar.numberValue = xData.errorBar.numberValue;
                }
                if (xData.hasOwnProperty('trendLines')) {
                    this.parseChartTrendLines(xData.trendLines, chartSeries);
                }
                this.parseChartSeriesDataPoints(xData.dataPoints, chartSeries);
            }
            chart.chartSeries.push(chartSeries);
        }
    }
    private parseChartDataLabels(dataLabels: any, series: ChartSeries): void {
        let dataLabel: ChartDataLabels = new ChartDataLabels();
        dataLabel.labelPosition = dataLabels.position;
        dataLabel.fontName = dataLabels.fontName;
        dataLabel.fontColor = dataLabels.fontColor;
        dataLabel.fontSize = dataLabels.fontSize;
        dataLabel.isLegendKey = dataLabels.isLegendKey;
        dataLabel.isBubbleSize = dataLabels.isBubbleSize;
        dataLabel.isCategoryName = dataLabels.isCategoryName;
        dataLabel.isSeriesName = dataLabels.isSeriesName;
        dataLabel.isValue = dataLabels.isValue;
        dataLabel.isPercentage = dataLabels.isPercentage;
        dataLabel.isLeaderLines = dataLabels.isLeaderLines;
        series.dataLabels = dataLabel;
    }
    private parseChartSeriesDataPoints(dataPoints: any, series: ChartSeries): void {
        for (let i: number = 0; i < dataPoints.length; i++) {
            let chartFormat: ChartDataFormat = new ChartDataFormat();
            this.parseChartDataFormat(dataPoints[i], chartFormat);
            series.chartDataFormat.push(chartFormat);
        }
    }
    private parseChartTrendLines(trendLines: any, series: ChartSeries): void {
        for (let i: number = 0; i < trendLines.length; i++) {
            let data: any = trendLines[i];
            let trendLine: ChartTrendLines = new ChartTrendLines();
            trendLine.trendLineName = data.name;
            trendLine.trendLineType = data.type;
            trendLine.forwardValue = data.forward;
            trendLine.backwardValue = data.backward;
            trendLine.interceptValue = data.intercept;
            trendLine.isDisplayEquation = data.isDisplayEquation;
            trendLine.isDisplayRSquared = data.isDisplayRSquared;
            series.trendLines.push(trendLine);
        }
    }
    private parseTableFormat(sourceFormat: any, tableFormat: WTableFormat): void {
        this.parseBorders(sourceFormat.borders, tableFormat.borders);
        if (!isNullOrUndefined(sourceFormat.allowAutoFit)) {
            tableFormat.allowAutoFit = sourceFormat.allowAutoFit;
        }
        if (!isNullOrUndefined(sourceFormat.cellSpacing)) {
            tableFormat.cellSpacing = sourceFormat.cellSpacing;
        }
        if (!isNullOrUndefined(sourceFormat.leftMargin)) {
            tableFormat.leftMargin = sourceFormat.leftMargin;
        }
        if (!isNullOrUndefined(sourceFormat.topMargin)) {
            tableFormat.topMargin = sourceFormat.topMargin;
        }
        if (!isNullOrUndefined(sourceFormat.rightMargin)) {
            tableFormat.rightMargin = sourceFormat.rightMargin;
        }
        if (!isNullOrUndefined(sourceFormat.bottomMargin)) {
            tableFormat.bottomMargin = sourceFormat.bottomMargin;
        }
        if (!isNullOrUndefined(sourceFormat.leftIndent)) {
            tableFormat.leftIndent = sourceFormat.leftIndent;
        }
        this.parseShading(sourceFormat.shading, tableFormat.shading);
        if (!isNullOrUndefined(sourceFormat.tableAlignment)) {
            tableFormat.tableAlignment = sourceFormat.tableAlignment;
        }
        if (!isNullOrUndefined(sourceFormat.preferredWidth)) {
            tableFormat.preferredWidth = sourceFormat.preferredWidth;
        }
        if (!isNullOrUndefined(sourceFormat.preferredWidthType)) {
            tableFormat.preferredWidthType = sourceFormat.preferredWidthType;
        }
        if (!isNullOrUndefined(sourceFormat.bidi)) {
            tableFormat.bidi = sourceFormat.bidi;
        }
    }
    private parseCellFormat(sourceFormat: any, cellFormat: WCellFormat): void {
        if (!isNullOrUndefined(sourceFormat)) {
            this.parseBorders(sourceFormat.borders, cellFormat.borders);
            if (!sourceFormat.isSamePaddingAsTable) {
                //    cellFormat.ClearMargins();
                //else
                this.parseCellMargin(sourceFormat, cellFormat);
            }
            if (!isNullOrUndefined(sourceFormat.cellWidth)) {
                cellFormat.cellWidth = sourceFormat.cellWidth;
            }
            if (!isNullOrUndefined(sourceFormat.columnSpan)) {
                cellFormat.columnSpan = sourceFormat.columnSpan;
            }
            if (!isNullOrUndefined(sourceFormat.rowSpan)) {
                cellFormat.rowSpan = sourceFormat.rowSpan;
            }
            this.parseShading(sourceFormat.shading, cellFormat.shading);
            if (!isNullOrUndefined(sourceFormat.verticalAlignment)) {
                cellFormat.verticalAlignment = sourceFormat.verticalAlignment;
            }
            if (!isNullOrUndefined(sourceFormat.preferredWidthType)) {
                cellFormat.preferredWidthType = sourceFormat.preferredWidthType;
            }
            if (!isNullOrUndefined(sourceFormat.preferredWidth)) {
                cellFormat.preferredWidth = sourceFormat.preferredWidth;
            }
        }
    }
    private parseCellMargin(sourceFormat: any, cellFormat: WCellFormat): void {
        if (!isNullOrUndefined(sourceFormat.leftMargin)) {
            cellFormat.leftMargin = sourceFormat.leftMargin;
        }
        if (!isNullOrUndefined(sourceFormat.rightMargin)) {
            cellFormat.rightMargin = sourceFormat.rightMargin;
        }
        if (!isNullOrUndefined(sourceFormat.topMargin)) {
            cellFormat.topMargin = sourceFormat.topMargin;
        }
        if (!isNullOrUndefined(sourceFormat.bottomMargin)) {
            cellFormat.bottomMargin = sourceFormat.bottomMargin;
        }
    }
    private parseRowFormat(sourceFormat: any, rowFormat: WRowFormat): void {
        if (!isNullOrUndefined(sourceFormat)) {
            if (!isNullOrUndefined(sourceFormat.allowBreakAcrossPages)) {
                rowFormat.allowBreakAcrossPages = sourceFormat.allowBreakAcrossPages;
            }
            if (!isNullOrUndefined(sourceFormat.isHeader)) {
                rowFormat.isHeader = sourceFormat.isHeader;
            }
            if (!isNullOrUndefined(sourceFormat.heightType)) {
                rowFormat.heightType = sourceFormat.heightType;
            }
            if (!isNullOrUndefined(sourceFormat.height)) {
                rowFormat.height = sourceFormat.height;
            }
            if (!isNullOrUndefined(sourceFormat.leftMargin)) {
                rowFormat.leftMargin = sourceFormat.leftMargin;
            }
            if (!isNullOrUndefined(sourceFormat.topMargin)) {
                rowFormat.topMargin = sourceFormat.topMargin;
            }
            if (!isNullOrUndefined(sourceFormat.rightMargin)) {
                rowFormat.rightMargin = sourceFormat.rightMargin;
            }
            if (!isNullOrUndefined(sourceFormat.bottomMargin)) {
                rowFormat.bottomMargin = sourceFormat.bottomMargin;
            }
            if (!isNullOrUndefined(sourceFormat.leftIndent)) {
                rowFormat.leftIndent = sourceFormat.leftIndent;
            }
            this.parseBorders(sourceFormat.borders, rowFormat.borders);
        }
    }
    private parseBorders(sourceBorders: any, destBorder: WBorders): void {
        if (!isNullOrUndefined(sourceBorders)) {
            this.parseBorder(sourceBorders.left, destBorder.left);
            this.parseBorder(sourceBorders.right, destBorder.right);
            this.parseBorder(sourceBorders.top, destBorder.top);
            this.parseBorder(sourceBorders.bottom, destBorder.bottom);
            this.parseBorder(sourceBorders.vertical, destBorder.vertical);
            this.parseBorder(sourceBorders.horizontal, destBorder.horizontal);
            this.parseBorder(sourceBorders.diagonalDown, destBorder.diagonalDown);
            this.parseBorder(sourceBorders.diagonalUp, destBorder.diagonalUp);
        }
    }
    private parseBorder(sourceBorder: any, destBorder: WBorder): void {
        if (!isNullOrUndefined(sourceBorder)) {
            if (!isNullOrUndefined(sourceBorder.color)) {
                destBorder.color = this.getColor(sourceBorder.color);
            }
            if (!isNullOrUndefined(sourceBorder.lineStyle)) {
                destBorder.lineStyle = sourceBorder.lineStyle;
            }
            if (!isNullOrUndefined(sourceBorder.lineWidth)) {
                destBorder.lineWidth = sourceBorder.lineWidth;
            }
            if (!isNullOrUndefined(sourceBorder.hasNoneStyle)) {
                destBorder.hasNoneStyle = sourceBorder.hasNoneStyle;
            }
        }
    }
    private parseShading(sourceShading: any, destShading: WShading): void {
        if (!isNullOrUndefined(sourceShading)) {
            if (!isNullOrUndefined(sourceShading.backgroundColor)) {
                destShading.backgroundColor = this.getColor(sourceShading.backgroundColor);
            }
            if (!isNullOrUndefined(sourceShading.foregroundColor)) {
                destShading.foregroundColor = this.getColor(sourceShading.foregroundColor);
            }
            if (!isNullOrUndefined(sourceShading.texture) || !isNullOrUndefined(sourceShading.textureStyle)) {
                destShading.textureStyle = !isNullOrUndefined(sourceShading.texture) ? sourceShading.texture : sourceShading.textureStyle;
            }
        }
    }
    /**
     * @private
     */
    public parseCharacterFormat(sourceFormat: any, characterFormat: WCharacterFormat, writeInlineFormat?: boolean): void {
        if (!isNullOrUndefined(sourceFormat)) {
            if (writeInlineFormat && sourceFormat.hasOwnProperty('inlineFormat')) {
                this.parseCharacterFormat(sourceFormat.inlineFormat, characterFormat);
                return;
            }
            if (!isNullOrUndefined(sourceFormat.baselineAlignment)) {
                characterFormat.baselineAlignment = sourceFormat.baselineAlignment;
            }
            if (!isNullOrUndefined(sourceFormat.underline)) {
                characterFormat.underline = sourceFormat.underline;
            }
            if (!isNullOrUndefined(sourceFormat.strikethrough)) {
                characterFormat.strikethrough = sourceFormat.strikethrough;
            }
            if (!isNullOrUndefined(sourceFormat.fontSize)) {
                characterFormat.fontSize = sourceFormat.fontSize;
            }
            if (!isNullOrUndefined(sourceFormat.fontFamily)) {
                if (sourceFormat.fontFamily.indexOf('"') !== -1) {
                    sourceFormat.fontFamily = sourceFormat.fontFamily.replace('"', '');
                }
                characterFormat.fontFamily = sourceFormat.fontFamily;
            }
            if (!isNullOrUndefined(sourceFormat.bold)) {
                characterFormat.bold = sourceFormat.bold;
            }
            if (!isNullOrUndefined(sourceFormat.italic)) {
                characterFormat.italic = sourceFormat.italic;
            }
            if (!isNullOrUndefined(sourceFormat.highlightColor)) {
                characterFormat.highlightColor = sourceFormat.highlightColor;
            }
            if (!isNullOrUndefined(sourceFormat.fontColor)) {
                characterFormat.fontColor = this.getColor(sourceFormat.fontColor);
            }
            if (!isNullOrUndefined(sourceFormat.bidi)) {
                characterFormat.bidi = sourceFormat.bidi;
            }
            if (!isNullOrUndefined(sourceFormat.bdo)) {
                characterFormat.bdo = sourceFormat.bdo;
            }
            if (!isNullOrUndefined(sourceFormat.fontSizeBidi)) {
                characterFormat.fontSizeBidi = sourceFormat.fontSizeBidi;
            }
            if (!isNullOrUndefined(sourceFormat.fontFamilyBidi)) {
                characterFormat.fontFamilyBidi = sourceFormat.fontFamilyBidi;
            }
            if (!isNullOrUndefined(sourceFormat.boldBidi)) {
                characterFormat.boldBidi = sourceFormat.boldBidi;
            }
            if (!isNullOrUndefined(sourceFormat.italicBidi)) {
                characterFormat.italicBidi = sourceFormat.italicBidi;
            }
        }
    }
    private getColor(color: string): string {
        let convertColor: string = color;
        return convertColor || '#ffffff';
    }
    /**
     * @private
     */
    public parseParagraphFormat(sourceFormat: any, paragraphFormat: WParagraphFormat): void {
        if (!isNullOrUndefined(sourceFormat)) {
            if (!isNullOrUndefined(sourceFormat.bidi)) {
                paragraphFormat.bidi = sourceFormat.bidi;
            }
            if (!isNullOrUndefined(sourceFormat.leftIndent)) {
                paragraphFormat.leftIndent = sourceFormat.leftIndent;
            }
            if (!isNullOrUndefined(sourceFormat.rightIndent)) {
                paragraphFormat.rightIndent = sourceFormat.rightIndent;
            }
            if (!isNullOrUndefined(sourceFormat.firstLineIndent)) {
                paragraphFormat.firstLineIndent = sourceFormat.firstLineIndent;
            }
            if (!isNullOrUndefined(sourceFormat.afterSpacing)) {
                paragraphFormat.afterSpacing = sourceFormat.afterSpacing;
            }
            if (!isNullOrUndefined(sourceFormat.beforeSpacing)) {
                paragraphFormat.beforeSpacing = sourceFormat.beforeSpacing;
            }
            if (!isNullOrUndefined(sourceFormat.lineSpacing)) {
                paragraphFormat.lineSpacing = sourceFormat.lineSpacing;
            }
            if (!isNullOrUndefined(sourceFormat.lineSpacingType)) {
                paragraphFormat.lineSpacingType = sourceFormat.lineSpacingType;
            }
            if (!isNullOrUndefined(sourceFormat.textAlignment)) {
                paragraphFormat.textAlignment = sourceFormat.textAlignment;
            }
            if (!isNullOrUndefined(sourceFormat.outlineLevel)) {
                paragraphFormat.outlineLevel = sourceFormat.outlineLevel;
            }
            if (!isNullOrUndefined(sourceFormat.contextualSpacing)) {
                paragraphFormat.contextualSpacing = sourceFormat.contextualSpacing;
            }
            paragraphFormat.listFormat = new WListFormat();
            if (sourceFormat.hasOwnProperty('listFormat')) {
                this.parseListFormat(sourceFormat, paragraphFormat.listFormat);
            }
            if (sourceFormat.hasOwnProperty('tabs')) {
                this.parseTabStop(sourceFormat.tabs, paragraphFormat.tabs);
            }
        }
    }
    private parseListFormat(block: any, listFormat: WListFormat): void {
        if (!isNullOrUndefined(block.listFormat)) {
            if (!isNullOrUndefined(block.listFormat.listId)) {
                listFormat.listId = block.listFormat.listId;
                listFormat.list = this.viewer.getListById(block.listFormat.listId);
            }
            if (!isNullOrUndefined(block.listFormat.listLevelNumber)) {
                listFormat.listLevelNumber = block.listFormat.listLevelNumber;
            }
        }
    }
    private parseSectionFormat(data: any, sectionFormat: WSectionFormat): void {
        if (!isNullOrUndefined(data.pageWidth)) {
            sectionFormat.pageWidth = data.pageWidth;
        }
        if (!isNullOrUndefined(data.pageHeight)) {
            sectionFormat.pageHeight = data.pageHeight;
        }
        if (!isNullOrUndefined(data.leftMargin)) {
            sectionFormat.leftMargin = data.leftMargin;
        }
        if (!isNullOrUndefined(data.topMargin)) {
            sectionFormat.topMargin = data.topMargin;
        }
        if (!isNullOrUndefined(data.rightMargin)) {
            sectionFormat.rightMargin = data.rightMargin;
        }
        if (!isNullOrUndefined(data.bottomMargin)) {
            sectionFormat.bottomMargin = data.bottomMargin;
        }
        if (!isNullOrUndefined(data.headerDistance)) {
            sectionFormat.headerDistance = data.headerDistance;
        }
        if (!isNullOrUndefined(data.footerDistance)) {
            sectionFormat.footerDistance = data.footerDistance;
        }
        if (!isNullOrUndefined(data.differentFirstPage)) {
            sectionFormat.differentFirstPage = data.differentFirstPage;
        }
        if (!isNullOrUndefined(data.differentOddAndEvenPages)) {
            sectionFormat.differentOddAndEvenPages = data.differentOddAndEvenPages;
        }
        if (!isNullOrUndefined(data.bidi)) {
            sectionFormat.bidi = data.bidi;
        }
    }

    private parseTabStop(wTabs: any, tabs: WTabStop[]): void {
        for (let i: number = 0; i < wTabs.length; i++) {
            let tabStop: WTabStop = new WTabStop();
            tabStop.position = wTabs[i].position;
            tabStop.tabLeader = wTabs[i].tabLeader;
            tabStop.deletePosition = wTabs[i].deletePosition;
            tabStop.tabJustification = wTabs[i].tabJustification;
            tabs.push(tabStop);
        }
    }

    private validateImageUrl(imagestr: string): boolean {
        let keyStr: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
        imagestr = imagestr.replace(/[^A-Za-z0-9\+\/\=]/g, '');

        let totalLength: number = imagestr.length * 3 / 4;
        if (imagestr.charAt(imagestr.length - 1) === keyStr.charAt(64)) {
            totalLength--;
        }
        if (imagestr.charAt(imagestr.length - 2) === keyStr.charAt(64)) {
            totalLength--;
        }
        if (totalLength % 1 !== 0) {
            // totalLength is not an integer, the length does not match a valid
            // base64 content. That can happen if:
            // - the imagestr is not a base64 content
            // - the imagestr is *almost* a base64 content, with a extra chars at the
            // beginning or at the end
            // - the imagestr uses a base64 variant (base64url for example)
            return false;
        }
        return true;
    }
}