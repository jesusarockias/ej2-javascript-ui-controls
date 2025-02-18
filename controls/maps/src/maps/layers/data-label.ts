//tslint:disable
import { Maps } from '../../index';
import {
    findMidPointOfPolygon, Rect, filter, getTemplateFunction,
    getTranslate, RectOption, convertElementFromLabel, checkPropertyPath,
    Point, TextOption, renderTextElement, MapLocation, textTrim, Size, measureText, Internalize
} from '../utils/helper';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { FontModel, DataLabelSettingsModel, ILabelRenderingEventArgs, LayerSettings } from '../index';
import { dataLabelRendering } from '../model/constants';

/**
 * DataLabel Module used to render the maps datalabel
 */
export class DataLabel {
    private maps: Maps;
    private dataLabelObject: Element;
    /**
     * Datalabel collections
     * @private
     */
    public dataLabelCollections: Object[];
    private value: object = { rightWidth: 0, leftWidth: 0, heightTop: 0, heightBottom: 0 };
    constructor(maps: Maps) {
        this.maps = maps;
        this.dataLabelCollections = [];
    }
    //tslint:disable:max-func-body-length
    private getDataLabel(dataSource: object[], labelPath: string, shapeName: string, shapeDataPath: string): object {
        let text: object;
        for (let i: number = 0; i < dataSource.length; i++) {
            let data: object = dataSource[i];
            if ((data[shapeDataPath]) === shapeName) {
                text = data;
                break;
            }
        }
        return text;
    }
    /**
     * To render label for maps
     * @param layer 
     * @param layerIndex 
     * @param shape 
     * @param layerData 
     * @param group 
     * @param labelTemplateElement 
     * @param index 
     */
    public renderLabel(
        layer: LayerSettings, layerIndex: number, shape: object,
        layerData: object[], group: Element, labelTemplateElement: HTMLElement, index: number, intersect: object[]
    ): void {
        let dataLabel: DataLabelSettingsModel = layer.dataLabelSettings;
        let style: FontModel = layer.dataLabelSettings.textStyle;
        let markerEle: Element;
        let templateFn: Function;
        let options: TextOption;
        let dataLabelSettings: DataLabelSettingsModel = layer.dataLabelSettings;
        let labelpath: string = layer.dataLabelSettings.labelPath;
        let shapePoint: [MapLocation[]] = [[]];
        let midIndex: number = 0;
        let pointsLength: number = 0;
        let shapeData: object = shape;
        let element: Element;
        let data: object;
        let text: string = '';
        let datasrcObj: object;
        let currentLength: number = 0; let oldIndex : number;
        let location: object; let sublayerIndexLabel : Boolean = false;
        let shapeProperties: object = shape['properties'];
        let labelId: string = this.maps.element.id + '_LayerIndex_' + layerIndex + '_shapeIndex_' + index + '_LabelIndex_' + index;
        let textLocation: Point = new Point(0, 0);
        /* tslint:disable:no-string-literal */
        let shapes: object = layerData[index]; let locationX: object; let locationY: object;
        style.fontFamily = this.maps.themeStyle.labelFontFamily;
        shape = shapes['property'];
        let properties: string[] = (Object.prototype.toString.call(layer.shapePropertyPath) === '[object Array]' ?
            layer.shapePropertyPath : [layer.shapePropertyPath]) as string[];
        let propertyPath: string;
        let animate: boolean = layer.animationDuration !== 0 || isNullOrUndefined(this.maps.zoomModule);
        let translate: Object = (this.maps.isTileMap) ? new Object() : getTranslate(this.maps, layer, animate);
        let scale: number = (this.maps.isTileMap) ? this.maps.scale : translate['scale'];
        let transPoint: Point = (this.maps.isTileMap) ? this.maps.translatePoint : translate['location'] as Point;
        let zoomTransPoint : Point = this.maps.zoomTranslatePoint; let shapeWidth: number;
        let scaleZoomValue : number = !isNullOrUndefined(this.maps.scale)  ? Math.floor(this.maps.scale) : 1;
        let zoomLabelsPosition : Boolean = this.maps.zoomSettings.enable ? !isNullOrUndefined(this.maps.zoomShapeCollection) &&
        this.maps.zoomShapeCollection.length > 0 : this.maps.zoomSettings.enable;
        for (let j: number = 0; j < properties.length; j++) {
            if (shapeProperties[properties[j]]) {
                propertyPath = properties[j];
                break;
            }
        }
        datasrcObj = this.getDataLabel(
            layer.dataSource as object[], labelpath, shapeData['properties'][propertyPath], layer.shapeDataPath);
        if (!isNullOrUndefined(shapes['property']) && ((shapeProperties[labelpath]) || datasrcObj)) {
            shapePoint = [[]];
            if (!layerData[index]['_isMultiPolygon']) {
                shapePoint.push(this.getPoint(layerData[index] as object[], []));
                currentLength = shapePoint[shapePoint.length - 1].length;
                if (pointsLength < currentLength) {
                    pointsLength = currentLength;
                    midIndex = shapePoint.length - 1;
                }
            } else {
                let layer: Object[] = <Object[]>layerData[index];
                for (let j: number = 0; j < layer.length; j++) {
                    shapePoint.push(this.getPoint(layer[j] as Object[], []));
                    currentLength = shapePoint[shapePoint.length - 1].length;
                    if (pointsLength < currentLength) {
                        pointsLength = currentLength;
                        midIndex = shapePoint.length - 1;
                    }
                }
            }
        }
        text = (!isNullOrUndefined(datasrcObj)) ? datasrcObj[labelpath].toString() : shapeData['properties'][labelpath]
        let dataLabelText : string = text;
        let projectionType : string = this.maps.projectionType;
        location = findMidPointOfPolygon(shapePoint[midIndex], projectionType);
        let firstLevelMapLocation : object = location;
        if (!isNullOrUndefined(text) && !isNullOrUndefined(location)) {
            if(zoomLabelsPosition && scaleZoomValue > 1) {
                if(layerIndex > 0){
                    for(let k : number =0;k<this.maps.zoomLabelPositions.length;k++){
                        if(this.maps.zoomLabelPositions[k]['dataLabelText'] === text) {
                            oldIndex = index;
                            index = k;
                            sublayerIndexLabel = true;
                            break;
                        }
                    }
                }
                locationX = location['x'];
                locationY = location['y'];
                location['x'] = ((location['x'] + zoomTransPoint['x']) * scale);
                location['y'] = ((location['y'] + zoomTransPoint['y']) * scale);
            }
            location['y'] = (this.maps.projectionType === 'Mercator') ? location['y'] : (-location['y']);
            data = location;
            if (!isNullOrUndefined(this.maps.format) && !isNaN(parseFloat(text))) {
                if (this.maps.useGroupingSeparator) {
                    text = Internalize(this.maps, parseFloat(text));
                    if (!isNullOrUndefined(datasrcObj)) {
                        datasrcObj[labelpath] = text;
                    }
                }
            }
            let eventargs: ILabelRenderingEventArgs = {
                name: dataLabelRendering, maps: this.maps, cancel: false, border: dataLabel.border, datalabel: dataLabel,
                fill: dataLabel.fill, template: dataLabel.template, text: text
            };
            if (this.maps.isBlazor) {
                const {maps, ...blazorEventArgs } : ILabelRenderingEventArgs = eventargs;
                eventargs = blazorEventArgs;
            }
            this.maps.trigger('dataLabelRendering', eventargs, (labelArgs: ILabelRenderingEventArgs) => {
                let border: Object = { color: 'yellow' };
                let position: MapLocation[] = [];
                let width: number = zoomLabelsPosition && scaleZoomValue > 1
                ?  this.maps.zoomShapeCollection[index]['width'] :
                location['rightMax']['x'] - location['leftMax']['x'];
                if(!isNullOrUndefined(this.maps.dataLabelShape)){
                    shapeWidth = firstLevelMapLocation['rightMax']['x'] - firstLevelMapLocation['leftMax']['x'];
                    this.maps.dataLabelShape.push(shapeWidth);
                }
                if(eventargs.text !== text && !eventargs.cancel){
                    text = eventargs.text;
                }
                let textSize: Size = measureText(text, style);
                let trimmedLable: string = textTrim(width, text, style);
                let elementSize: Size = measureText(trimmedLable, style);
                let startY: number = location['y'] - textSize['height'] / 4;
                let endY: number = location['y'] + textSize['height'] / 4;
                let start: number = location['y'] - textSize['height'] / 4;
                let end: number = location['y'] + textSize['height'] / 4;
                position = filter(shapePoint[midIndex], startY, endY);
                if (position.length > 5 && (shapeData['geometry']['type'] !== 'MultiPolygon') &&
                    (shapeData['type'] !== 'MultiPolygon')) {
                    let location1: object = findMidPointOfPolygon(position, projectionType);
                    if(zoomLabelsPosition && scaleZoomValue > 1) {
                            location1['x'] = ((this.maps.zoomLabelPositions[index]['location']['x'] + zoomTransPoint['x']) * scale);
                            location1['y'] = ((this.maps.zoomLabelPositions[index]['location']['y'] + zoomTransPoint['y']) * scale);
                    }
                    locationX = location1['x'];
                    location['x'] = location1['x'];
                    width = zoomLabelsPosition && scaleZoomValue > 1 ?
                    this.maps.zoomShapeCollection[index]['width'] :
                    location1['rightMax']['x'] - location1['leftMax']['x'];
                }
                let xpositionEnds: number = location['x'] + textSize['width'] / 2;
                let xpositionStart: number = location['x'] - textSize['width'] / 2;
                trimmedLable = textTrim(width, text, style);
                elementSize = measureText(trimmedLable, style);
                this.value[index] = { rightWidth: xpositionEnds, leftWidth: xpositionStart, heightTop: start, heightBottom: end };
                let labelElement: HTMLElement;
                if (eventargs.template !== '') {
                    let blazor: string = 'Blazor';
                    templateFn = getTemplateFunction(eventargs.template);
                    let templateElement: Element = templateFn ? templateFn(!window[blazor] ? this.maps : {}, null, null, this.maps.element.id) : document.createElement('div');
                    templateElement.innerHTML =  !templateFn ? eventargs.template : ''; 
                    labelElement = <HTMLElement>convertElementFromLabel(
                        templateElement, labelId, !isNullOrUndefined(datasrcObj) ? datasrcObj : shapeData['properties'], index, this.maps);
                    labelElement.style.left = ((Math.abs(this.maps.baseMapRectBounds['min']['x'] - location['x'])) * scale) + 'px';
                    labelElement.style.top = ((Math.abs(this.maps.baseMapRectBounds['min']['y'] - location['y'])) * scale) + 'px';
                    labelTemplateElement.appendChild(labelElement);
                } else {
                    if (dataLabelSettings.smartLabelMode === 'Trim') {
                        options = new TextOption(labelId, textLocation.x, textLocation.y, 'middle', trimmedLable, '', '');
                    }
                    if (dataLabelSettings.smartLabelMode === 'None') {
                        options = new TextOption(labelId, (textLocation.x), textLocation.y, 'middle', text, '', '');
                    }
                    if (dataLabelSettings.smartLabelMode === 'Hide') {
                        text = (width >= textSize['width']) ? text : '';
                        options = new TextOption(labelId, (textLocation.x), (textLocation.y), 'middle', text, '', '');
                    }
                    text = options['text'] as string;
                    if (dataLabelSettings.intersectionAction === 'Hide') {
                        for (let i: number = 0; i < intersect.length; i++) {
                            if (!isNullOrUndefined(intersect[i])) {
                                if (this.value[index]['leftWidth'] > intersect[i]['rightWidth']
                                    || this.value[index]['rightWidth'] < intersect[i]['leftWidth']
                                    || this.value[index]['heightTop'] > intersect[i]['heightBottom']
                                    || this.value[index]['heightBottom'] < intersect[i]['heightTop']) {
                                    text = text;
                                } else {
                                    text = '';
                                    break;
                                }
                            }
                        }
                        intersect.push(this.value[index]);
                        options = new TextOption(labelId, textLocation.x, textLocation.y, 'middle', text, '', '');
                    }
                    let difference: number;
                    if (dataLabelSettings.intersectionAction === 'Trim') {
                        for (let j: number = 0; j < intersect.length; j++) {
                            if (!isNullOrUndefined(intersect[j])) {
                                if (intersect[j]['rightWidth'] < this.value[index]['leftWidth']
                                    || intersect[j]['leftWidth'] > this.value[index]['rightWidth']
                                    || intersect[j]['heightBottom'] < this.value[index]['heightTop']
                                    || intersect[j]['heightTop'] > this.value[index]['heightBottom']) {
                                    trimmedLable = text;
                                    difference = 0;
                                } else {
                                    if (this.value[index]['leftWidth'] > intersect[j]['leftWidth']) {
                                        width = intersect[j]['rightWidth'] - this.value[index]['leftWidth'];
                                        difference = width - (this.value[index]['rightWidth'] - this.value[index]['leftWidth']);
                                        trimmedLable = textTrim(difference, text, style);
                                        break;
                                    }
                                    if (this.value[index]['leftWidth'] < intersect[j]['leftWidth']) {
                                        width = this.value[index]['rightWidth'] - intersect[j]['leftWidth'];
                                        difference = Math.abs(width - (this.value[index]['rightWidth'] - this.value[index]['leftWidth']));
                                        trimmedLable = textTrim(difference, text, style);
                                        break;
                                    }
                                }
                            }
                        }
                        intersect.push(this.value[index]);
                        options = new TextOption(labelId, textLocation.x, (textLocation.y), 'middle', trimmedLable, '', '');
                    }
                    if (dataLabelSettings.intersectionAction === 'None') {
                        options = new TextOption(labelId, (textLocation.x), (textLocation.y), 'middle', text, '', '');
                    }
                    if (trimmedLable.length > 1) {
                        let border: object = eventargs.border;
                        if (border['width'] > 1) {
                            let fill: string = eventargs.fill;
                            let opacity: number = dataLabelSettings.opacity;
                            let rx: number = dataLabelSettings.rx;
                            let ry: number = dataLabelSettings.ry;
                            let x : number ; let y : number; let padding : number = 5;
                            if (zoomLabelsPosition && scaleZoomValue > 1) {
                                x = ((location['x'] ) ) - textSize['width'] / 2;
                                y = ((location['y'] ) ) - textSize['height'] / 2 - padding;
                            } else {
                                x = ((location['x'] + transPoint['x']) * scale) - textSize['width'] / 2;
                                y = ((location['y'] + transPoint['y'] )* scale)- textSize['height'] / 2;
                            } 
                            let rectOptions: RectOption = new RectOption(
                                this.maps.element.id + '_LayerIndex_' + layerIndex + '_shapeIndex_' + index + '_rectIndex_' + index,
                                fill, border, opacity, new Rect(x, y, textSize['width'], textSize['height']), rx, ry
                            );
                            let rect: Element = this.maps.renderer.drawRectangle(rectOptions) as SVGRectElement;
                            group.appendChild(rect);
                        }
                    }
                    element = renderTextElement(options, style, style.color || this.maps.themeStyle.dataLabelFontColor, group);
                    if(zoomLabelsPosition && scaleZoomValue > 1){
                      element.setAttribute('transform', 'translate( ' + ((location['x'] ) ) + ' '
                      + (((location['y'] ) )  ) + ' )');
                            location['x'] = locationX;
                            location['y'] = locationY;
                    } else {
                        element.setAttribute('transform', 'translate( ' + ((location['x'] + transPoint.x) * scale) + ' '
                        + (((location['y'] + transPoint.y) * scale) + (elementSize.height / 4)) + ' )');
                        location['y'] = location['y'] +  (elementSize.height / 4);
                    }
                    group.appendChild(element);
                }
                this.dataLabelCollections.push({
                    location: { x: location['x'], y: location['y'] },
                    element: isNullOrUndefined(labelElement) ? element : labelElement,
                    layerIndex: layerIndex,
                    shapeIndex: sublayerIndexLabel ? oldIndex : index,
                    labelIndex: sublayerIndexLabel ? oldIndex : index,
                    dataLabelText: dataLabelText
                });
                if (labelTemplateElement.childElementCount > 0 && !this.maps.element.contains(labelTemplateElement)) {
                    document.getElementById(this.maps.element.id + '_Secondary_Element').appendChild(labelTemplateElement);
                }
            });
        }
    }
    private getPoint(shapes: object[], points: MapLocation[]): MapLocation[] {
        shapes.map((current: object, index: number) => {
            points.push(new Point(current['point']['x'], current['point']['y']));
        });
        return points;
    }
    /**
     * Get module name.
     */
    protected getModuleName(): string {
        return 'DataLabel';
    }

    /**
     * To destroy the layers. 
     * @return {void}
     * @private
     */
    public destroy(maps: Maps): void {
        /**
         * Destroy method performed here
         */
    }
}
