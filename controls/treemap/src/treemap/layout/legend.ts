import { TreeMap } from '../treemap';
import { LegendSettingsModel, ColorMappingModel, LevelSettingsModel } from '../model/base-model';
import { LeafItemSettingsModel, FontModel, BorderModel } from '../model/base-model';
import {
    findChildren, Location, Rect, Size, measureText,
    TextOption, PathOption, RectOption, drawSymbol, orderByArea
} from '../utils/helper';
import { Browser, isNullOrUndefined, EventHandler, extend } from '@syncfusion/ej2-base';
import { SvgRenderer, GradientColor, LinearGradient } from '@syncfusion/ej2-svg-base';
import { renderTextElement, textTrim } from '../utils/helper';
import { ILegendItemRenderingEventArgs, ILegendRenderingEventArgs } from '../model/interface';
import { LegendMode, LegendPosition, LegendOrientation, LabelPlacement, LabelIntersectAction } from '../utils/enum';
import { legendItemRendering, legendRendering } from '../model/constants';

/**
 * Legend module class
 */
export class TreeMapLegend {
    private treemap: TreeMap;
    /** collection of rendering legends */
    public legendRenderingCollections: Object[];
    /** collection of legends */
    public legendCollections: Object[];
    public outOfRangeLegend: Object;
    private legendHeight: number;
    private legendWidth: number;
    private totalPages: Object[];
    private page: number = 0;
    private translate: Location;
    public legendBorderRect: Rect = new Rect(0, 0, 0, 0);
    private currentPage: number = 0;
    public heightIncrement: number = 0;
    public widthIncrement: number = 0;
    private textMaxWidth: number = 0;
    /** group of legend */
    public legendGroup: Element;
    private legendNames: string[];
    private defsElement: Element;
    private gradientCount: number;
    private legendLinearGradient: Element;
    private legendInteractiveGradient: Element[] = [];
    private clearTimeout: number;
    private legendItemRect: Rect = new Rect(0, 0, 0, 0);
    constructor(treemap: TreeMap) {
        this.treemap = treemap;
        this.addEventListener();
    }

    /**
     * method for legend
     */
    public renderLegend(): void {
        this.legendRenderingCollections = [];
        this.legendCollections = [];
        this.legendNames = [];
        this.totalPages = [];
        this.gradientCount = 1;
        this.widthIncrement = 0;
        this.heightIncrement = 0;
        this.defsElement = this.treemap.renderer.createDefs();
        this.treemap.svgObject.appendChild(this.defsElement);
        let eventArgs: ILegendRenderingEventArgs;
        eventArgs = {
            cancel: false, name: legendRendering, treemap: this.treemap, _changePosition: this.treemap.legendSettings.position,
            position: this.treemap.legendSettings.position
        };
        if (this.treemap.isBlazor) {
            const {treemap, ...blazorEventArgs} : ILegendRenderingEventArgs = eventArgs;
            eventArgs = blazorEventArgs;
        }
        this.treemap.trigger(legendRendering, eventArgs, (observedArgs : ILegendRenderingEventArgs) => {
            if (!observedArgs.cancel && observedArgs._changePosition !== this.treemap.legendSettings.position) {
                this.treemap.legendSettings.position = observedArgs._changePosition;
            }
            this.calculateLegendBounds();
            if (this.legendCollections.length > 0) {
                this.drawLegend();
            }
        });

    }
    /* tslint:disable:no-string-literal */
    /* tslint:disable-next-line:max-func-body-length */
    public calculateLegendBounds(): void {
        let treemap: TreeMap = this.treemap;
        let legend: LegendSettingsModel = treemap.legendSettings;
        this.findColorMappingLegendItems(treemap.levelsOfData[0]);
        if ((this.treemap.palette.length > 0 || !isNullOrUndefined(this.treemap.colorValuePath))
            && this.legendCollections.length === 0) {
            this.findPaletteLegendItems(this.treemap.levelsOfData[0], 'Parent');
        }
        if (this.legendCollections.length > 0) {
            let defaultSize: number = 25; let textPadding: number = 10; let position: LegendPosition = legend.position;
            let legendTitle: string = legend.title.text; let titleTextStyle: FontModel = legend.titleStyle;
            let legendMode: LegendMode = legend.mode; let shapeX: number = 0; let shapeY: number = 0;
            let textX: number = 0; let textY: number = 0; let shapeHeight: number = legend.shapeHeight;
            let shapeWidth: number = legend.shapeWidth; let shapeLocation: Location[] = []; let textLocation: Rect[] = [];
            let orientation: LegendOrientation = (legend.orientation === 'None') ? ((position === 'Top' || position === 'Bottom'
                || (position === 'Auto' && treemap.availableSize.width <= treemap.availableSize.height))
                ? 'Horizontal' : 'Vertical') : legend.orientation;
            let leftPadding: number = 10; let topPadding: number = 10; let spacing: number = 10;
            let legendWidth: number = (legend.width.length > 1) ? (legend.width.indexOf('%') > -1) ? (treemap.availableSize.width / 100)
                * parseFloat(legend.width) : parseFloat(legend.width) : null;
            let legendHeight: number = (legend.height.length > 1) ? (legend.height.indexOf('%') > -1) ?
                (treemap.availableSize.height / 100) * parseFloat(legend.height) : parseFloat(legend.height) : null;
            titleTextStyle.fontFamily = treemap.themeStyle.fontFamily || titleTextStyle.fontFamily;
            titleTextStyle.size = treemap.themeStyle.legendFontSize || titleTextStyle.size;
            let legendTitleSize: Size = measureText(legendTitle, titleTextStyle);
            let startX: number = 0; let startY: number = 0; let shapePadding: number = legend.shapePadding;
            let rectWidth: number; let rectHeight: number; let itemTextStyle: FontModel = legend.textStyle;
            let legendLength: number = this.legendCollections.length;
            legend.textStyle.size = treemap.themeStyle.legendFontSize || legend.textStyle.size;
            legend.textStyle.fontFamily = treemap.themeStyle.fontFamily || legend.textStyle.fontFamily;
            if (legendMode === 'Default') {
                legendWidth = (isNullOrUndefined(legendWidth)) ? treemap.areaRect.width : legendWidth;
                legendHeight = (isNullOrUndefined(legendHeight)) ? treemap.areaRect.height : legendHeight;
                let j: number = 0;
                for (let i: number = 0; i < this.legendCollections.length; i++) {
                    let legendItem: Object = this.legendCollections[i];
                    if (isNullOrUndefined(this.totalPages[this.page])) {
                        this.totalPages[this.page] = { Page: (this.page + 1), Collection: [] };
                    }
                    let legendTextSize: Size = measureText(legendItem['legendName'], legend.textStyle);
                    this.textMaxWidth = Math.max(this.textMaxWidth, legendTextSize.width);
                    if (i === 0) {
                        startX = shapeX = (leftPadding + (shapeWidth / 2));
                        startY = shapeY = topPadding + legendTitleSize.height + (shapeHeight > legendTextSize.height ? shapeHeight / 2
                            : (legendTextSize.height / 4));
                    } else {
                        let maxSize: number = (legendTextSize.height > shapeHeight) ? legendTextSize.height : shapeHeight;
                        if (orientation === 'Horizontal') {
                            let prvePositionX: number = (textLocation[j - 1].x + textLocation[j - 1].width) + textPadding + shapeWidth;
                            if ((prvePositionX + shapePadding + legendTextSize.width) > legendWidth) {
                                let nextPositionY: number = (textLocation[j - 1].y > (shapeLocation[j - 1].y + (shapeHeight / 2)) ?
                                    textLocation[j - 1].y : (shapeLocation[j - 1].y + (shapeHeight / 2))) + topPadding;
                                if ((nextPositionY + maxSize) > legendHeight) {
                                    this.getPageChanged();
                                    j = 0;
                                    shapeLocation = [];
                                    textLocation = [];
                                    shapeX = startX;
                                    shapeY = startY;
                                } else {
                                    shapeX = (shapeLocation[0].x);
                                    shapeY = (nextPositionY + (maxSize / 2));
                                }
                            } else {
                                shapeX = (prvePositionX - (shapeWidth / 2));
                                shapeY = (shapeLocation[j - 1]).y;
                            }
                        } else {
                            let prevPositionY: number = textLocation[j - 1].y > shapeLocation[j - 1].y + (shapeHeight / 2) ?
                                textLocation[j - 1].y : shapeLocation[j - 1].y + (shapeHeight / 2);
                            if ((prevPositionY + topPadding + maxSize) > legendHeight) {
                                let nextPositionX: number = (textLocation[j - 1].x + this.textMaxWidth + textPadding);
                                if ((nextPositionX + shapePadding + legendTextSize.width) > legendWidth) {
                                    shapeX = startX;
                                    shapeY = startY;
                                    textLocation = [];
                                    shapeLocation = [];
                                    this.getPageChanged();
                                    j = 0;
                                } else {
                                    shapeX = nextPositionX + (shapeWidth / 2);
                                    shapeY = (shapeLocation[0].y);
                                }
                            } else {
                                shapeX = shapeLocation[j - 1].x;
                                shapeY = prevPositionY + topPadding + (shapeHeight / 2);
                            }
                        }
                    }
                    textX = shapeX + (shapeWidth / 2) + shapePadding;
                    textY = shapeY + (legendTextSize.height / 4);
                    shapeLocation.push({ x: shapeX, y: shapeY });
                    textLocation.push({ x: textX, y: textY, width: legendTextSize.width, height: (legendTextSize.height / 2) });
                    (<Object[]>this.totalPages[this.page]['Collection']).push({
                        DisplayText: legendItem['legendName'], element: legendItem['gradientElement'],
                        Shape: { x: shapeX, y: shapeY },
                        Text: { x: textX, y: textY },
                        Fill: legendItem['legendFill'],
                        Data: legendItem['legendData'],
                        Rect: {
                            x: shapeLocation[j].x - (shapeWidth / 2),
                            y: (shapeLocation[j].y - (shapeHeight / 2)) < (textY - legendTextSize.height) ?
                                (shapeLocation[j].y - (shapeHeight / 2)) : (textY - legendTextSize.height),
                            width: Math.abs((shapeLocation[j].x - (shapeWidth / 2)) - (textX + legendTextSize.width)),
                            height: ((shapeHeight > legendTextSize.height) ? shapeHeight : legendTextSize.height)
                        }
                    });
                    j++;
                }
                let collection: Object[] = (<Object[]>this.totalPages[0]['Collection']);
                collection.forEach((legendObj: Object, index: number) => {
                    let legendRect: Rect = new Rect(
                        legendObj['Rect']['x'], legendObj['Rect']['y'],
                        legendObj['Rect']['width'], legendObj['Rect']['height']
                    );
                    if (index === 0) {
                        startX = legendRect.x;
                        startY = legendRect.y;
                    }
                    this.widthIncrement = Math.max(this.widthIncrement, Math.abs(startX - (legendRect.x + legendRect.width)));
                    this.heightIncrement = Math.max(this.heightIncrement, Math.abs(startY - (legendRect.y + legendRect.height)));
                });
                legendWidth = ((this.widthIncrement < legendWidth) ? this.widthIncrement : legendWidth);
                legendHeight = ((this.heightIncrement < legendHeight) ? this.heightIncrement : legendHeight);
                this.legendItemRect = {
                    x: collection[0]['Rect']['x'], y: collection[0]['Rect']['y'],
                    width: legendWidth, height: legendHeight
                };
            } else {
                let itemTextStyle: FontModel = legend.textStyle;
                let rectWidth: number; let rectHeight: number;
                let legendLength: number = this.legendCollections.length;
                rectWidth = (orientation === 'Horizontal') ? (isNullOrUndefined(legendWidth)) ? (treemap.areaRect.width / legendLength) :
                    (legendWidth / legendLength) : (isNullOrUndefined(legendWidth)) ? defaultSize : legendWidth;
                rectHeight = (orientation === 'Horizontal') ? (isNullOrUndefined(legendHeight)) ? defaultSize : legendHeight :
                    (isNullOrUndefined(legendHeight)) ? (treemap.areaRect.height / legendLength) : (legendHeight / legendLength);
                startX = 0; startY = legendTitleSize.height + spacing;
                let textPadding: number = 10; let placement: LabelPlacement = legend.labelPosition;
                let itemStartX: number = 0; let itemStartY: number = 0;
                let labelAction: LabelIntersectAction = legend.labelDisplayMode;
                let maxTextHeight: number = 0; let maxTextWidth: number = 0;
                for (let i: number = 0; i < this.legendCollections.length; i++) {
                    startX = (orientation === 'Horizontal') ? (startX + rectWidth) : startX;
                    startY = (orientation === 'Horizontal') ? startY : (startY + rectHeight);
                    let legendText: string = this.legendCollections[i]['legendName'];
                    let itemTextSize: Size = new Size(0, 0);
                    if (labelAction === 'None') {
                        itemTextSize = measureText(legendText, itemTextStyle);
                    } else if (labelAction === 'Trim') {
                        legendText = textTrim((orientation === 'Horizontal' ? rectWidth : rectHeight), legendText, itemTextStyle);
                        itemTextSize = measureText(legendText, itemTextStyle);
                    } else {
                        legendText = '';
                    }
                    maxTextHeight = Math.max(maxTextHeight, itemTextSize.height);
                    maxTextWidth = Math.max(maxTextWidth, itemTextSize.width);
                    if (itemTextSize.width > 0 && itemTextSize.height > 0) {
                        if (orientation === 'Horizontal') {
                            textX = startX + (rectWidth / 2);
                            textY = (placement === 'After') ? (startY + rectHeight + (itemTextSize.height / 2)) + textPadding :
                                (startY - textPadding);
                        } else {
                            textX = (placement === 'After') ? startX - (itemTextSize.width / 2) - textPadding
                                : (startX + rectWidth + itemTextSize.width / 2) + textPadding;
                            textY = startY + (rectHeight / 2) + (itemTextSize.height / 4);
                        }
                    }
                    if (i === 0) {
                        itemStartX = (orientation === 'Horizontal') ? startX : (placement === 'After') ?
                            textX - (itemTextSize.width / 2) : startX;
                        itemStartY = (orientation === 'Horizontal') ? (placement === 'After') ? startY :
                            textY - (itemTextSize.height / 2) : startY;
                    }
                    if (i === legendLength - 1) {
                        legendWidth = (orientation === 'Horizontal') ? Math.abs((startX + rectWidth) - itemStartX) :
                            (rectWidth + maxTextWidth + textPadding);
                        legendHeight = (orientation === 'Horizontal') ? (rectHeight + (maxTextHeight / 2) + textPadding) :
                            Math.abs((startY + rectHeight) - itemStartY);
                    }
                    this.legendRenderingCollections.push({
                        fill: this.legendCollections[i]['legendFill'], x: startX, y: startY,
                        width: rectWidth, height: rectHeight, element: this.legendCollections[i]['gradientElement'],
                        text: legendText, textX: textX, textY: textY,
                        textWidth: itemTextSize.width, textHeight: itemTextSize.height,
                        data: this.legendCollections[i]['legendData']
                    });
                }
                this.legendItemRect = { x: itemStartX, y: itemStartY, width: legendWidth, height: legendHeight };
            }
        }
    }

    private getPageChanged(): void {
        this.page++;
        if (isNullOrUndefined(this.totalPages[this.page])) {
            this.totalPages[this.page] = { Page: (this.page + 1), Collection: [] };
        }
    }

    private findColorMappingLegendItems(data: Object): void {
        let child: Object[] = findChildren(data)['values'];
        if (child && child.length > 0) {
            this.calculateLegendItems(child);
            if (this.treemap.levels.length > 0) {
                for (let i: number = 0; i < child.length; i++) {
                    this.findColorMappingLegendItems(child[i]);
                }
            }
        }
    }

    private findPaletteLegendItems(data: Object, type: string): void {
        let child: Object[]; let legendFillColor: string;
        if (!isNullOrUndefined(this.treemap.drilledItems)) {
            if (this.treemap.drilledItems.length === 0 && !isNullOrUndefined(this.treemap.initialDrillDown.groupName)
                && isNullOrUndefined(this.treemap.drilledLegendItems)) {
                let items: Object[] = findChildren(data)['values'];
                for (let k: number = 0; k < items.length; k++) {
                    if (items[k]['Name'] === this.treemap.initialDrillDown.groupName) {
                        items[k]['isDrilled'] = !items[k]['isDrilled'];
                        data = items[k];
                        this.treemap.currentLevel = this.treemap.initialDrillDown.groupIndex;
                        legendFillColor = this.treemap.palette.length > 0 ? this.treemap.palette[k % this.treemap.palette.length] :
                            items[k]['data'][this.treemap.colorValuePath];
                        break;
                    }
                }
            }
        }
        if (this.treemap.enableDrillDown && !isNullOrUndefined(this.treemap.drilledLegendItems)) {
            let childElement: Object = this.treemap.drilledLegendItems;
            legendFillColor = childElement['data']['options']['fill'];
            if (childElement['data']['isDrilled']) {
                child = findChildren(childElement['data'])['values'];
            } else {
                let parentElement: Object = childElement['data']['parent'];
                child = findChildren(parentElement)['values'];
            }
        } else {
            child = findChildren(data)['values'];
        }
        let isDuplicate: boolean;
        let legendName: string;
        if (child && child.length > 0) {
            for (let i: number = 0; i < child.length; i++) {
                if (isNullOrUndefined(child[i]['data'][this.treemap.legendSettings.showLegendPath]) ||
                    child[i]['data'][this.treemap.legendSettings.showLegendPath]) {
                    legendName = child[i]['data'][this.treemap.legendSettings.valuePath] ?
                        child[i]['data'][this.treemap.legendSettings.valuePath] : child[i]['name'];
                    isDuplicate = this.treemap.legendSettings.removeDuplicateLegend ?
                        this.removeDuplicates(this.legendCollections, legendName) : false;
                    if (!isDuplicate) {
                        this.legendCollections.push({
                            legendName: legendName,
                            legendFill: this.treemap.palette.length > 0 ? !isNullOrUndefined(this.treemap.currentLevel)
                                ? legendFillColor : this.treemap.palette[i % this.treemap.palette.length] :
                                child[i]['data'][this.treemap.colorValuePath],
                            legendData: [],
                            itemArea: child[i]['weight']
                        });
                    }
                }
            }
            this.legendCollections.sort(orderByArea);
            if (this.treemap.palette.length > 0) {
                for (let j: number = 0; j < this.legendCollections.length; j++) {
                    this.legendCollections[j]['legendFill'] = !isNullOrUndefined(this.treemap.currentLevel)
                        ? legendFillColor : this.treemap.palette[j % this.treemap.palette.length];
                }
            }
        }
    }

    /* tslint:disable-next-line:max-func-body-length */
    private calculateLegendItems(data: Object[]): void {
        let isAddData: Object; let fill: string; let rangeValue: number;
        let currentData: Object; let legendText: string; let itemValue: number;
        let isLeafItem: boolean; let colorMapProcess: boolean = false;
        let colorMapping: ColorMappingModel[]; let groupIndex: number;
        let leaf: LeafItemSettingsModel = this.treemap.leafItemSettings;
        let levels: LevelSettingsModel[] = this.treemap.levels; let equalValue: string;
        let position: LegendPosition = this.treemap.legendSettings.position;
        let gradientElement: Element; let x2: string; let y2: string; let actualValue: string;
        let isDuplicate: boolean; let isEqualColor: boolean; let isRange: boolean; let isDesaturation: boolean = false;
        let legendIndex: number = 0; let outfill: string; let labelLegend: string; let otherIndex: number;
        this.outOfRangeLegend = null;
        for (let i: number = 0; i < data.length; i++) {
            fill = ''; isEqualColor = false; isRange = false; isDesaturation = false;
            currentData = data[i]['data'];
            groupIndex = data[i]['groupIndex'];
            isLeafItem = (this.treemap.levels.length === 0 || groupIndex === this.treemap.levels.length);
            colorMapping = isLeafItem ? leaf.colorMapping : levels[groupIndex].colorMapping;
            for (let colorMap of colorMapping) {
                gradientElement = null;
                rangeValue = Number(currentData[this.treemap.rangeColorValuePath]);
                equalValue = currentData[this.treemap.equalColorValuePath];
                colorMap.value = !isNullOrUndefined(colorMap.value) ? colorMap.value.toString() : colorMap.value;
                if (!isNullOrUndefined(colorMap.from) && !isNullOrUndefined(colorMap.to) &&
                    rangeValue >= colorMap.from && rangeValue <= colorMap.to && colorMap.showLegend) {
                    colorMapProcess = true; isRange = true;
                    actualValue = colorMap.from + ' - ' + colorMap.to;
                    legendText = !isNullOrUndefined(colorMap.label) ? colorMap.label : colorMap.from + ' - ' + colorMap.to;
                    fill = isNullOrUndefined(colorMap.color) ? fill : <string>colorMap.color;
                    isAddData = this.isAddNewLegendData(actualValue);
                } else if (!isNullOrUndefined(colorMap.value) && equalValue === colorMap.value && colorMap.showLegend) {
                    colorMapProcess = true; isEqualColor = true;
                    actualValue = colorMap.value.toString();
                    legendText = !isNullOrUndefined(colorMap.label) ? colorMap.label : colorMap.value.toString();
                    fill = isNullOrUndefined(colorMap.color) ? fill :
                        Object.prototype.toString.call(colorMap.color) === '[object Array]' ? colorMap.color[0] : <string>colorMap.color;
                    isAddData = this.isAddNewLegendData(actualValue);
                }
                if (colorMapProcess && isNullOrUndefined(colorMap.value) && colorMap.maxOpacity && colorMap.minOpacity
                    && this.treemap.legendSettings.mode === 'Interactive') {
                    let colors: GradientColor[] = []; let gradient: LinearGradient; isDesaturation = true;
                    if (Object.prototype.toString.call(colorMap.color) === '[object Array]') {
                        for (let q: number = 0; q < colorMap.color.length; q++) {
                            let offsetColor: number = 100 / (colorMap.color.length - 1);
                            let offsetValue: string = q * offsetColor + '%';
                            let stop1Color: GradientColor = { colorStop: offsetValue.toString(), color: colorMap.color[q] };
                            colors.push(stop1Color);
                        }
                    } else {
                        let stop1Color: GradientColor = { colorStop: '0%', color: fill };
                        let stop2Color: GradientColor = { colorStop: '100%', color: fill };
                        colors.push(stop1Color);
                        colors.push(stop2Color);
                    }
                    x2 = position === 'Top' || position === 'Bottom' ? '100%' : '0%';
                    y2 = position === 'Top' || position === 'Bottom' ? '0%' : '100%';
                    gradient = {
                        id: 'groupIndex_' + groupIndex + '_colorIndex_' + this.gradientCount, x1: '0%', y1: '0%', x2: x2, y2: y2
                    };
                    gradientElement = this.treemap.renderer.drawGradient('linearGradient', gradient, colors).childNodes[0] as Element;
                    if (Object.prototype.toString.call(colorMap.color) !== '[object Array]') {
                        (gradientElement.childNodes[0] as Element).setAttribute('stop-opacity', colorMap.minOpacity.toString());
                        (gradientElement.childNodes[1] as Element).setAttribute('stop-opacity', colorMap.maxOpacity.toString());
                    }
                    this.defsElement.appendChild(gradientElement);
                    this.gradientCount++;
                }
                isDuplicate = this.treemap.legendSettings.removeDuplicateLegend ?
                    this.removeDuplicates(this.legendCollections, legendText) : false;
                if (isAddData && isAddData['process'] && colorMapProcess && !isDuplicate) {
                    colorMapProcess = false;
                    fill = ((Object.prototype.toString.call(colorMap.color) === '[object Array]')) && isNullOrUndefined(gradientElement)
                        && isNullOrUndefined(colorMap.value) ? this.legendGradientColor(colorMap, legendIndex) : fill;
                    this.legendCollections.push({
                        actualValue: actualValue,
                        legendName: legendText, legendFill: fill, legendData: [],
                        gradientElement: !isNullOrUndefined(gradientElement) ? gradientElement : isNullOrUndefined(colorMap.value)
                            ? this.legendLinearGradient : null, name: data[i]['name'],
                        opacity: this.treemap.legendSettings.opacity, borderColor: this.treemap.legendSettings.border.color,
                        borderWidth: this.treemap.legendSettings.border.width
                    });
                    (<Object[]>this.legendCollections[this.legendCollections.length - 1]['legendData']).push(data[i]);
                    legendIndex++;
                } else if (colorMapProcess && !isDuplicate) {
                    colorMapProcess = false;
                    (<Object[]>this.legendCollections[isAddData['value']]['legendData']).push(data[i]);
                }
                if (!isRange && !isDesaturation && !isEqualColor) {
                    if (isNullOrUndefined(colorMap.from) && isNullOrUndefined(colorMap.to)
                        && isNullOrUndefined(colorMap.minOpacity) &&
                        isNullOrUndefined(colorMap.maxOpacity) && isNullOrUndefined(colorMap.value) &&
                        !isNullOrUndefined(colorMap.color)) {
                        outfill = ((Object.prototype.toString.call(colorMap.color) === '[object Array]'))
                            ? colorMap.color[0] : <string>colorMap.color;
                        labelLegend = !isNullOrUndefined(colorMap.label) ? colorMap.label : 'Others';
                        if (isNullOrUndefined(this.outOfRangeLegend)) {
                            this.legendCollections.push({
                                actualValue: labelLegend, legendData: [],
                                legendName: labelLegend, legendFill: outfill
                            });
                            otherIndex = this.legendCollections.length;
                            this.outOfRangeLegend = this.legendCollections[otherIndex - 1];
                            legendIndex++;

                        }
                        (<Object[]>this.legendCollections[otherIndex - 1]['legendData']).push(data[i]);
                    }
                }
            }
        }
    }

    private removeDuplicates(legendCollection: Object[], text: string): boolean {
        let isDuplicate: boolean = false;
        for (let i: number = 0; i < legendCollection.length; i++) {
            if (legendCollection[i]['legendName'] === text) {
                isDuplicate = true;
                break;
            } else {
                continue;
            }
        }
        return isDuplicate;
    }


    private isAddNewLegendData(legendText: string): Object {
        let newDataProcess: boolean; let itemValue: number;
        if (this.legendCollections.length === 0) {
            newDataProcess = true;
        } else {
            for (let j: number = 0; j < this.legendCollections.length; j++) {
                if (legendText === this.legendCollections[j]['actualValue']) {
                    newDataProcess = false;
                    itemValue = j;
                    break;
                } else if (j === this.legendCollections.length - 1) {
                    newDataProcess = true;
                }
            }
        }
        return { process: newDataProcess, value: itemValue };
    }
    /* tslint:disable-next-line:max-func-body-length */
    /**
     * To draw the legend
     */
    public drawLegend(): void {
        let treemap: TreeMap = this.treemap;
        let legend: LegendSettingsModel = <LegendSettingsModel>treemap.legendSettings;
        let render: SvgRenderer = treemap.renderer; let fill: string;
        let textOptions: TextOption; let gradientElement: Element;
        let textFont: FontModel = legend.textStyle;
        this.legendGroup = render.createGroup({ id: treemap.element.id + '_Legend_Group' });
        this.renderLegendBorder();
        this.renderLegendTitle();
        if (legend.mode === 'Default') {
            this.drawLegendItem(this.currentPage);
        } else {
            for (let i: number = 0; i < this.legendRenderingCollections.length; i++) {
                let itemId: string = treemap.element.id + '_Legend_Index_' + i;
                let textId: string = treemap.element.id + '_Legend_Index_' + i + '_Text';
                let item: Object = this.legendRenderingCollections[i];
                gradientElement = item['element'];
                fill = gradientElement ? 'url(#' + gradientElement.id + ')' : item['fill'];
                let bounds: Rect = new Rect(item['x'], item['y'], item['width'], item['height']);
                let textLocation: Location = new Location(item['textX'], item['textY']);
                let rectOptions: RectOption = new RectOption(itemId, fill, legend.shapeBorder, legend.opacity, bounds);
                if (this.treemap.enableRtl) {
                    if (treemap.legendSettings.position === 'Left' || treemap.legendSettings.position === 'Right'
                        || (treemap.legendSettings.position === 'Auto'
                            && this.treemap.availableSize.width >= this.treemap.availableSize.height)) {
                        rectOptions.y = (this.translate.y + this.legendBorderRect.y + this.legendBorderRect.height)
                            - (this.translate.y + rectOptions.height) - Math.abs(this.legendBorderRect.y - rectOptions.y);
                        textLocation.y = (this.translate.y + this.legendBorderRect.y + this.legendBorderRect.height)
                            - (this.translate.y) + (item['textHeight'] / 2)
                            - Math.abs(this.legendBorderRect.y - textLocation.y);
                    } else {
                        rectOptions.x = (this.translate.x + this.legendBorderRect.x + this.legendBorderRect.width)
                            - (this.translate.x + rectOptions.width)
                            - Math.abs(this.legendBorderRect.x - rectOptions.x);
                        textLocation.x = (this.translate.x + this.legendBorderRect.x + this.legendBorderRect.width)
                            - this.translate.x - Math.abs(this.legendBorderRect.x - textLocation.x);
                    }
                }
                textOptions = new TextOption(textId, textLocation.x, textLocation.y, 'middle', item['text'], '', '');
                renderTextElement(textOptions, textFont, textFont.color || this.treemap.themeStyle.legendTextColor, this.legendGroup);
                this.legendGroup.appendChild(render.drawRectangle(rectOptions));
            }
        }
    }

    private defaultLegendRtlLocation(collection: Object, spacing: number, treemap: TreeMap, legend: LegendSettingsModel): Object {
        let shapeLocation: Location = collection['Shape'];
        let textLocation: Location = collection['Text'];
        let legendText: string = collection['DisplayText'];
        let textSize: Size = measureText(legendText, legend.textStyle);
        shapeLocation.x = (this.translate.x + this.legendBorderRect.x + this.legendBorderRect.width)
            - (this.translate.x + spacing) - Math.abs(this.legendBorderRect.x - shapeLocation.x);
        textLocation.x = (this.translate.x + this.legendBorderRect.x + this.legendBorderRect.width)
            - (this.translate.x + textSize.width + spacing) - Math.abs(this.legendBorderRect.x - textLocation.x);
        if (treemap.legendSettings.position === 'Left' || treemap.legendSettings.position === 'Right'
            || (treemap.legendSettings.position === 'Auto'
                && this.treemap.availableSize.width >= this.treemap.availableSize.height)) {
            shapeLocation.y = (this.translate.y + this.legendBorderRect.y + this.legendBorderRect.height)
                - this.translate.y - Math.abs(Math.abs(this.legendBorderRect.y) - shapeLocation.y) - (legend.shapeHeight / 2);
            textLocation.y = (this.translate.y + this.legendBorderRect.y + this.legendBorderRect.height)
                - this.translate.y - Math.abs(Math.abs(this.legendBorderRect.y) - textLocation.y);
        }
        return { shapeLocation: shapeLocation, textLocation: textLocation };
    }

    /* tslint:disable-next-line:max-func-body-length */
    private drawLegendItem(page: number): void {
        let treemap: TreeMap = this.treemap; let spacing: number = 10;
        let legend: LegendSettingsModel = <LegendSettingsModel>treemap.legendSettings;
        let shapeSize: Size = new Size(legend.shapeWidth, legend.shapeHeight);
        let textOptions: TextOption; let legendRtlLocation: Object;
        let renderOptions: PathOption | RectOption; let render: SvgRenderer = treemap.renderer;
        let shapeBorder: BorderModel = legend.shapeBorder; let eventArgs: ILegendItemRenderingEventArgs;
        if (page >= 0 && page < this.totalPages.length) {
            if (document.getElementById(this.legendGroup.id)) {
                document.getElementById(this.legendGroup.id).remove();
            }
            let isLineShape: boolean = (legend.shape === 'HorizontalLine' || legend.shape === 'VerticalLine' || legend.shape === 'Cross');
            let strokeColor: string = isLineShape ? isNullOrUndefined(legend.fill) ? '#000000' : legend.fill : shapeBorder.color;
            let strokeWidth: number = isLineShape ? (shapeBorder.width === 0) ? 1 : shapeBorder.width : shapeBorder.width;
            for (let i: number = 0; i < (<Object[]>this.totalPages[page]['Collection']).length; i++) {
                let collection: Object = <Object[]>this.totalPages[page]['Collection'][i];
                let legendElement: Element = render.createGroup({ id: treemap.element.id + '_Legend_Index_' + i });
                let legendText: string = collection['DisplayText'];
                let shapeId: string = treemap.element.id + '_Legend_Shape_Index_' + i;
                let textId: string = treemap.element.id + '_Legend_Text_Index_' + i;
                let shapeLocation: Location = collection['Shape'];
                let textLocation: Location = collection['Text'];
                if (treemap.enableRtl) {
                    legendRtlLocation = this.defaultLegendRtlLocation(collection, spacing, treemap, legend);
                    shapeLocation = legendRtlLocation['shapeLocation'];
                    textLocation = legendRtlLocation['textLocation'];
                }
                eventArgs = {
                    cancel: false, name: legendItemRendering, treemap: treemap, fill: collection['Fill'],
                    shape: legend.shape, imageUrl: legend.imageUrl
                };
                if (this.treemap.isBlazor) {
                    const {treemap, ...blazorEventArgs} : ILegendItemRenderingEventArgs = eventArgs;
                    eventArgs = blazorEventArgs;
                }
                this.treemap.trigger(legendItemRendering, eventArgs, (observedArgs : ILegendItemRenderingEventArgs) => {
                    let renderOptions: PathOption = new PathOption(
                        shapeId, observedArgs.fill, strokeWidth, isLineShape ? collection['Fill'] : strokeColor, legend.opacity, ''
                    );
                    legendElement.appendChild(
                        drawSymbol(shapeLocation, observedArgs.shape, shapeSize, observedArgs.imageUrl, renderOptions, legendText)
                    );
                    textOptions = new TextOption(textId, textLocation.x, textLocation.y, 'start', legendText, '', '');
                    renderTextElement(
                        textOptions, legend.textStyle, legend.textStyle.color || this.treemap.themeStyle.legendTextColor, legendElement
                    );
                    this.legendGroup.appendChild(legendElement);
                });
            }
            let pagingGroup: Element; let width: number = spacing; let height: number = (spacing / 2);
            if (this.page !== 0) {
                let pagingText: string = (page + 1) + '/' + this.totalPages.length;
                let pagingFont: FontModel = legend.textStyle; let pagingTextSize: Size = measureText(pagingText, pagingFont);
                let leftPageX: number = (this.legendItemRect.x + this.legendItemRect.width) - pagingTextSize.width -
                    (width * 2) - spacing;
                let rightPageX: number = (this.legendItemRect.x + this.legendItemRect.width);
                let locY: number = (this.legendItemRect.y + this.legendItemRect.height) + (height / 2) + spacing;
                let pageTextX: number = rightPageX - width - (pagingTextSize.width / 2) - (spacing / 2);
                pagingGroup = render.createGroup({ id: treemap.element.id + '_Legend_Paging_Group' });
                let leftPageElement: Element = render.createGroup({ id: treemap.element.id + '_Legend_Left_Paging_Group' });
                let rightPageElement: Element = render.createGroup({ id: treemap.element.id + '_Legend_Right_Paging_Group' });
                let rightPath: string = ' M ' + rightPageX + ' ' + locY + ' L ' + (rightPageX - width) + ' ' + (locY - height) +
                    ' L ' + (rightPageX - width) + ' ' + (locY + height) + ' z ';
                let leftPath: string = ' M ' + leftPageX + ' ' + locY + ' L ' + (leftPageX + width) + ' ' + (locY - height) +
                    ' L ' + (leftPageX + width) + ' ' + (locY + height) + ' z ';
                let leftPageOptions: PathOption = new PathOption(
                    treemap.element.id + '_Left_Page', '#a6a6a6', 0, '#a6a6a6', 1, '', leftPath
                );
                leftPageElement.appendChild(render.drawPath(leftPageOptions));
                let leftRectPageOptions: RectOption = new RectOption(
                    treemap.element.id + '_Left_Page_Rect', 'transparent', {}, 1,
                    new Rect(leftPageX - (width / 2), (locY - (height * 2)), width * 2, spacing * 2), ''
                );
                leftPageElement.appendChild(render.drawRectangle(leftRectPageOptions));
                this.wireEvents(leftPageElement);
                let rightPageOptions: PathOption = new PathOption(
                    treemap.element.id + '_Right_Page', '#a6a6a6', 0, '#a6a6a6', 1, '', rightPath
                );
                rightPageElement.appendChild(render.drawPath(rightPageOptions));
                let rightRectPageOptions: RectOption = new RectOption(
                    treemap.element.id + '_Right_Page_Rect', 'transparent', {}, 1,
                    new Rect((rightPageX - width), (locY - height), width, spacing), ''
                );
                rightPageElement.appendChild(render.drawRectangle(rightRectPageOptions));
                this.wireEvents(rightPageElement);
                pagingGroup.appendChild(leftPageElement);
                pagingGroup.appendChild(rightPageElement);
                let pageTextOptions: Object = {
                    'id': treemap.element.id + '_Paging_Text',
                    'x': pageTextX,
                    'y': locY + (pagingTextSize.height / 4),
                    'fill': '#a6a6a6',
                    'font-size': '14px',
                    'font-style': pagingFont.fontStyle,
                    'font-family': pagingFont.fontFamily,
                    'font-weight': pagingFont.fontWeight,
                    'text-anchor': 'middle',
                    'transform': '',
                    'opacity': 1,
                    'dominant-baseline': ''
                };
                pagingGroup.appendChild(render.createText(pageTextOptions, pagingText));
                this.legendGroup.appendChild(pagingGroup);
            }
        }
    }
    private renderLegendBorder(): void {
        let treemap: TreeMap = this.treemap;
        let legend: LegendSettingsModel = <LegendSettingsModel>treemap.legendSettings;
        let legendTitle: string = legend.title.text;
        let spacing: number = 10;
        let textStyle: FontModel = legend.titleStyle;
        let textOptions: TextOption;
        let title: string = textTrim((this.legendItemRect.width + (spacing * 2)), legendTitle, textStyle);
        let textSize: Size = measureText(title, textStyle);
        this.legendBorderRect = new Rect(
            (this.legendItemRect.x - spacing),
            (this.legendItemRect.y - spacing - textSize.height),
            (this.legendItemRect.width) + (spacing * 2),
            (this.legendItemRect.height) + (spacing * 2) + textSize.height +
            (legend.mode === 'Interactive' ? 0 : (this.page !== 0) ? spacing : 0)
        );
        let renderOptions: RectOption = new RectOption(
            treemap.element.id + '_Legend_Border', legend.background, legend.border, 1, this.legendBorderRect, ''
        );
        let legendBorder: Element = treemap.renderer.drawRectangle(renderOptions);
        (legendBorder as HTMLElement).style.pointerEvents = 'none';
        this.legendGroup.appendChild(legendBorder);
        this.getLegendAlignment(treemap, this.legendBorderRect.width, this.legendBorderRect.height, legend);
        this.legendGroup.setAttribute('transform', 'translate( ' + (this.translate.x + (-(this.legendBorderRect.x))) + ' ' +
            (this.translate.y + (-(this.legendBorderRect.y))) + ' )');
        treemap.svgObject.appendChild(this.legendGroup);
    }

    private renderLegendTitle(): void {
        let treemap: TreeMap = this.treemap;
        let legend: LegendSettingsModel = <LegendSettingsModel>treemap.legendSettings;
        let textStyle: FontModel = legend.titleStyle; let legendTitle: string = legend.title.text;
        let textOptions: TextOption; let spacing: number = 10;
        let trimTitle: string = textTrim((this.legendItemRect.width + (spacing * 2)), legendTitle, textStyle);
        let textSize: Size = measureText(trimTitle, textStyle);
        if (legendTitle) {
            textOptions = new TextOption(
                treemap.element.id + '_LegendTitle',
                (this.legendItemRect.x) + (this.legendItemRect.width / 2),
                this.legendItemRect.y - (textSize.height / 2) - (spacing / 2),
                'middle', trimTitle, '');
            renderTextElement(textOptions, textStyle, textStyle.color || this.treemap.themeStyle.legendTitleColor, this.legendGroup);
        }
    }
    /**
     * To rendered the interactive pointer
     */
    public renderInteractivePointer(e: PointerEvent | TouchEvent): void {
        let treemap: TreeMap = this.treemap; let target: Element = <Element>e.target;
        let interactiveId: string = treemap.element.id + '_Interactive_Legend';
        target = !(e.type.indexOf('touch') > -1) ? target :
            document.elementFromPoint((<TouchEvent>e).changedTouches[0].clientX, (<TouchEvent>e).changedTouches[0].clientY);
        let targetItem: Object; let legend: LegendSettingsModel = <LegendSettingsModel>treemap.legendSettings;
        if (target.id.indexOf('_Item_Index') > -1 && legend.visible && this.legendRenderingCollections.length > 0) {
            let currentData: Object; let legendRect: ClientRect;
            let rect: Rect; let data: Object[]; let fill: string; let stroke: string; let strokeWidth: number; let legendElement: Element;
            targetItem = treemap.layout.renderItems[parseFloat(target.id.split('_')[6])];
            let svgRect: ClientRect = treemap.svgObject.getBoundingClientRect();
            for (let i: number = 0; i < this.legendCollections.length; i++) {
                currentData = this.legendCollections[i];
                legendElement = document.getElementById(treemap.element.id + '_Legend_Index_' + i);
                legendRect = <ClientRect>legendElement.getBoundingClientRect();
                let rect: Rect = new Rect(
                    Math.abs(legendRect.left - svgRect.left), Math.abs(legendRect.top - svgRect.top),
                    legendRect.width, legendRect.height
                );
                fill = legendElement.getAttribute('fill');
                stroke = legend.shapeBorder.color;
                strokeWidth = legend.shapeBorder.width;
                if (!isNullOrUndefined(currentData['legendData'])) {
                    data = <Object[]>currentData['legendData'];
                    for (let j: number = 0; j < data.length; j++) {
                        if (data[j]['levelOrderName'] === targetItem['levelOrderName']) {
                            this.drawInteractivePointer(legend, fill, stroke, interactiveId, strokeWidth, rect);
                            break;
                        }
                    }
                }
            }
        } else {
            this.removeInteractivePointer();
        }
    }

    private drawInteractivePointer(
        legend: LegendSettingsModel, fill: string, stroke: string, id: string, strokeWidth: number, rect: Rect
    ): void {
        let path: string; let pathOptions: PathOption;
        let locX: number; let locY: number;
        let height: number = 10; let width: number = 10;
        let direction: LegendOrientation = (legend.orientation === 'None') ? (legend.position === 'Top' || legend.position === 'Bottom')
            ? 'Horizontal' : 'Vertical' : legend.orientation;
        if (direction === 'Horizontal') {
            if (!legend.invertedPointer) {
                locX = rect.x + (rect.width / 2);
                locY = rect.y;
                path = ' M ' + locX + ' ' + locY + ' L ' + (locX - width) + ' ' + (locY - height) +
                    ' L ' + (locX + width) + ' ' + (locY - height) + ' Z ';
            } else {
                locX = rect.x + (rect.width / 2);
                locY = rect.y + (rect.height);
                path = ' M ' + locX + ' ' + locY + ' L ' + (locX - width) + ' ' + (locY + height) +
                    ' L ' + (locX + width) + ' ' + (locY + height) + ' Z ';
            }
        } else {
            if (!legend.invertedPointer) {
                locX = rect.x + (rect.width);
                locY = rect.y + (rect.height / 2);
                path = ' M ' + locX + ' ' + locY + ' L ' + (locX + width) + ' ' + (locY - height) +
                    ' L ' + (locX + width) + ' ' + (locY + height) + ' z ';
            } else {
                locX = rect.x;
                locY = rect.y + (rect.height / 2);
                path = ' M ' + locX + ' ' + locY + ' L ' + (locX - width) + ' ' + (locY - height) +
                    ' L ' + (locX - width) + ' ' + (locY + height) + ' z ';
            }
        }
        pathOptions = new PathOption(id, fill, strokeWidth, stroke, 1, '', path);
        this.treemap.svgObject.appendChild(this.treemap.renderer.drawPath(pathOptions) as SVGPathElement);
    }


    private getLegendAlignment(treemap: TreeMap, width: number, height: number, legend: LegendSettingsModel): void {
        let x: number; let y: number;
        let spacing: number = 10; let totalRect: Rect;
        totalRect = extend({}, treemap.areaRect, totalRect, true) as Rect;
        let areaX: number = totalRect.x;
        let areaY: number = totalRect.y;
        let areaHeight: number = totalRect.height;
        let areaWidth: number = totalRect.width;
        let totalWidth: number = treemap.availableSize.width;
        let totalHeight: number = treemap.availableSize.height;
        let position: string = legend.position === 'Auto' ? (totalWidth > totalHeight) ? 'Right' : 'Bottom' : legend.position;
        if (legend.position === 'Float') {
            this.translate = legend.location;
        } else {
            switch (position) {
                case 'Top':
                case 'Bottom':
                    totalRect.height = (areaHeight - height);
                    x = (totalWidth / 2) - (width / 2);
                    y = (position === 'Top') ? areaY : (areaY + totalRect.height) + spacing;
                    totalRect.y = (position === 'Top') ? areaY + height + spacing : areaY;
                    break;
                case 'Left':
                case 'Right':
                    totalRect.width = (areaWidth - width);
                    x = (position === 'Left') ? areaX : areaX + totalRect.width;
                    y = (totalHeight / 2) - (height / 2);
                    totalRect.x = (position === 'Left') ? areaX + width : areaX;
                    break;
            }
            switch (legend.alignment) {
                case 'Near':
                    if (position === 'Top' || position === 'Bottom') {
                        x = totalRect.x;
                    } else {
                        y = totalRect.y;
                    }
                    break;
                case 'Far':
                    if (position === 'Top' || position === 'Bottom') {
                        x = totalWidth - width;
                    } else {
                        y = totalHeight - height;
                    }
                    break;
            }
            this.treemap.totalRect = totalRect;
            this.translate = new Location(x, y);
        }
    }
    public mouseUpHandler(e: PointerEvent): void {
        this.renderInteractivePointer(e);
        clearTimeout(this.clearTimeout);
        this.clearTimeout = setTimeout(this.removeInteractivePointer.bind(this), 3000);
    }
    /**
     * To remove the interactive pointer
     */
    public removeInteractivePointer(): void {
        if (document.getElementById(this.treemap.element.id + '_Interactive_Legend')) {
            document.getElementById(this.treemap.element.id + '_Interactive_Legend').remove();
        }
    }
    /**
     * To change the next page
     */
    public changeNextPage(e: PointerEvent): void {
        this.currentPage = ((<Element>e.target).id.indexOf('_Left_Page_') > -1) ? (this.currentPage - 1) :
            (this.currentPage + 1);
        this.drawLegend();
    }
    /**
     * Wire events for event handler
     */
    public wireEvents(element: Element): void {
        EventHandler.add(element, Browser.touchStartEvent, this.changeNextPage, this);
    }
    /**
     * To add the event listener
     */
    public addEventListener(): void {
        if (this.treemap.isDestroyed) {
            return;
        }
        this.treemap.on(Browser.touchMoveEvent, this.renderInteractivePointer, this);
        this.treemap.on(Browser.touchEndEvent, this.mouseUpHandler, this);
    }
    /**
     * To remove the event listener
     */
    public removeEventListener(): void {
        if (this.treemap.isDestroyed) {
            return;
        }
        this.treemap.off(Browser.touchMoveEvent, this.renderInteractivePointer);
        this.treemap.off(Browser.touchEndEvent, this.mouseUpHandler);
    }

    /**
     * Get module name.
     */
    protected getModuleName(): string {
        return 'treeMapLegend';
    }

    /**
     * To destroy the legend. 
     * @return {void}
     * @private
     */
    public destroy(treemap: TreeMap): void {
        /**
         * Destroy method performed here
         */
        this.removeEventListener();
    }
    /**
     * Get the gradient color for interactive legend.
     */
    public legendGradientColor(colorMap: ColorMappingModel, legendIndex: number): string {
        let legendFillColor: string;
        let xmlns: string = 'http://www.w3.org/2000/svg';
        if (!isNullOrUndefined(colorMap.color) && Object.prototype.toString.call(colorMap.color) === '[object Array]') {
            let defElement: Element = this.treemap.renderer.createDefs();
            let linerGradientEle: Element = document.createElementNS(xmlns, 'linearGradient');
            let opacity: number = 1; let position: LegendPosition = this.treemap.legendSettings.position;
            let x2: string; let y2: string;
            x2 = position === 'Top' || position === 'Bottom' ? '100' : '0';
            y2 = position === 'Top' || position === 'Bottom' ? '0' : '100';
            linerGradientEle.setAttribute('id', 'linear_' + legendIndex);
            linerGradientEle.setAttribute('x1', 0 + '%');
            linerGradientEle.setAttribute('y1', 0 + '%');
            linerGradientEle.setAttribute('x2', x2 + '%');
            linerGradientEle.setAttribute('y2', y2 + '%');
            for (let b: number = 0; b < colorMap.color.length; b++) {
                let offsetColor: number = 100 / (colorMap.color.length - 1);
                let stopEle: Element = document.createElementNS(xmlns, 'stop');
                stopEle.setAttribute('offset', b * offsetColor + '%');
                stopEle.setAttribute('stop-color', colorMap.color[b]);
                stopEle.setAttribute('stop-opacity', opacity.toString());
                linerGradientEle.appendChild(stopEle);
            }
            defElement.appendChild(linerGradientEle);
            this.legendLinearGradient = linerGradientEle;
            let color: string = 'url(' + '#linear_' + legendIndex + ')';
            this.defsElement.appendChild(linerGradientEle);
            legendFillColor = color;
        }

        return legendFillColor;
    }
}