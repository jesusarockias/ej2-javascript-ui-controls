/**
 * Helper functions for maps control
 */
import { createElement, isNullOrUndefined, remove, compile as templateComplier, merge } from '@syncfusion/ej2-base';
import { AnimationOptions, Animation } from '@syncfusion/ej2-base';
import { SvgRenderer } from '@syncfusion/ej2-svg-base';
import { Maps, FontModel, BorderModel, LayerSettings, ProjectionType } from '../../index';
import { animationComplete, IAnimationCompleteEventArgs, Alignment, LayerSettingsModel } from '../index';
import { MarkerType, IShapeSelectedEventArgs, ITouches, IShapes, SelectionSettingsModel, HighlightSettingsModel,
    MarkerClusterSettingsModel, IMarkerRenderingEventArgs, MarkerSettings, markerClusterRendering,
IMarkerClusterRenderingEventArgs} from '../index';
import { CenterPositionModel } from '../model/base-model';
import { map } from '../../../spec/maps/data/mappoint.spec';

/**
 * Maps internal use of `Size` type
 */
export class Size {
    /**
     * height value for size
     */
    public height: number;
    /**
     * width value for size
     */
    public width: number;

    constructor(width: number, height: number) {
        this.width = width;
        this.height = height;
    }
}
/**
 * To find number from string
 * @private
 */
export function stringToNumber(value: string, containerSize: number): number {
    if (value !== null && value !== undefined) {
        return value.indexOf('%') !== -1 ? (containerSize / 100) * parseInt(value, 10) : parseInt(value, 10);
    }
    return null;
}
/**
 * Method to calculate the width and height of the maps
 */
export function calculateSize(maps: Maps): void {
    let containerWidth: number = maps.element.clientWidth;
    let containerHeight: number = maps.element.clientHeight;
    maps.availableSize = new Size(
        stringToNumber(maps.width, containerWidth) || containerWidth || 600,
        stringToNumber(maps.height, containerHeight) || containerHeight || (maps.isDevice ?
            Math.min(window.innerWidth, window.innerHeight) : 450)
    );
}
/**
 * Method to create svg for maps.
 */
export function createSvg(maps: Maps): void {
    maps.renderer = new SvgRenderer(maps.element.id);
    calculateSize(maps);
    maps.svgObject = maps.renderer.createSvg({
        id: maps.element.id + '_svg',
        width: maps.availableSize.width,
        height: maps.availableSize.height
    });
}
export function getMousePosition(pageX: number, pageY: number, element: Element): MapLocation {
    let elementRect: ClientRect = element.getBoundingClientRect();
    let pageXOffset: number = element.ownerDocument.defaultView.pageXOffset;
    let pageYOffset: number = element.ownerDocument.defaultView.pageYOffset;
    let clientTop: number = element.ownerDocument.documentElement.clientTop;
    let clientLeft: number = element.ownerDocument.documentElement.clientLeft;
    let positionX: number = elementRect.left + pageXOffset - clientLeft;
    let positionY: number = elementRect.top + pageYOffset - clientTop;
    return new MapLocation((pageX - positionX), (pageY - positionY));
}
/**
 * Method to convert degrees to radians
 */

export function degreesToRadians(deg: number): number {
    return deg * (Math.PI / 180);
}

/**
 * Convert radians to degrees method
 */
export function radiansToDegrees(radian: number): number {
    return radian * (180 / Math.PI);
}


/**
 * Method for converting from latitude and longitude values to points
 */

export function convertGeoToPoint(latitude: number, longitude: number, factor: number, layer: LayerSettings, mapModel: Maps): Point {
    let mapSize: Size = new Size(mapModel.mapAreaRect.width, mapModel.mapAreaRect.height);
    let x: number; let y: number; let value: Point;
    let lat: number; let lng: number; let temp: number;
    let longitudeMinMax: MinMax = mapModel.baseMapBounds.longitude;
    let latitudeMinMax: MinMax = mapModel.baseMapBounds.latitude;
    let latRadian: number = degreesToRadians(latitude);
    let lngRadian: number = degreesToRadians(longitude);
    let type: ProjectionType = mapModel.projectionType;
    let size: number = (mapModel.isTileMap) ? Math.pow(2, 1) * 256 : (isNullOrUndefined(factor)) ? Math.min(mapSize.width, mapSize.height) :
        (Math.min(mapSize.width, mapSize.height) * factor);
    if (layer.geometryType === 'Normal') {
        x = isNullOrUndefined(factor) ? longitude : Math.abs((longitude - longitudeMinMax.min) * factor);
        y = isNullOrUndefined(factor) ? latitude : Math.abs((latitudeMinMax.max - latitude) * factor);
    } else if (layer.geometryType === 'Geographic') {
        switch (type) {
            case 'Mercator':
                let pixelOrigin: Point = new Point(size / 2, size / 2);
                x = pixelOrigin.x + longitude * (size / 360);
                let sinY: number = calculateBound(Math.sin(degreesToRadians(latitude)), -0.9999, 0.9999);
                y = pixelOrigin.y + 0.5 * (Math.log((1 + sinY) / (1 - sinY))) * (-(size / (2 * Math.PI)));
                break;
            case 'Winkel3':
                value = aitoff(lngRadian, latRadian);
                lng = (value.x + lngRadian / (Math.PI / 2)) / 2;
                lat = (value.y + latRadian) / 2;
                break;
            case 'Miller':
                lng = lngRadian;
                lat = (1.25 * Math.log(Math.tan((Math.PI / 4) + (.4 * latRadian))));
                break;
            case 'Eckert3':
                temp = Math.sqrt(Math.PI * (4 + Math.PI));
                lng = 2 / temp * lngRadian * (1 + Math.sqrt(1 - 4 * latRadian * latRadian / (Math.PI * Math.PI)));
                lat = 4 / temp * latRadian;
                break;
            case 'AitOff':
                value = aitoff(lngRadian, latRadian);
                lng = value.x;
                lat = value.y;
                break;
            case 'Eckert5':
                lng = lngRadian * (1 + Math.cos(latRadian)) / Math.sqrt(2 + Math.PI);
                lat = 2 * latRadian / Math.sqrt(2 + Math.PI);
                break;
            case 'Equirectangular':
                lng = lngRadian;
                lat = latRadian;
                break;
            case 'Eckert6':
                let epsilon: number = 1e-6;
                temp = (1 + (Math.PI / 2)) * Math.sin(latRadian);
                let delta: number = Infinity;
                for (let i: number = 0; i < 10 && Math.abs(delta) > epsilon; i++) {
                    delta = (latRadian + (Math.sin(latRadian)) - temp) / (1 + Math.cos(latRadian));
                    latRadian = latRadian - delta;
                }
                temp = Math.sqrt(2 + Math.PI);
                lng = lngRadian * (1 + Math.cos(latRadian)) / temp;
                lat = 2 * latRadian / temp;
                break;
        }
        x = (type === 'Mercator') ? x : roundTo(xToCoordinate(mapModel, radiansToDegrees(lng)), 3);
        y = (type === 'Mercator') ? y : (-(roundTo(yToCoordinate(mapModel, radiansToDegrees(lat)), 3)));
    }
    return new Point(x, y);
}
/**
 * Converting tile latitude and longitude to point
 */
export function convertTileLatLongToPoint(
    center: MapLocation, zoomLevel: number, tileTranslatePoint: MapLocation, isMapCoordinates: boolean): MapLocation {
    let size: number = Math.pow(2, zoomLevel) * 256;
    let x: number = (center.x + 180) / 360;
    let sinLatitude: number = Math.sin(center.y * Math.PI / 180);
    let y: number = 0.5 - Math.log((1 + sinLatitude) / (1 - sinLatitude)) / (4 * Math.PI);
    let pixelX: number = center.x;
    let pixelY: number = center.y;
    if (isMapCoordinates) {
        pixelX = (x * size + 0.5) + tileTranslatePoint.x;
        pixelY = (y * size + 0.5) + tileTranslatePoint.y;
    }
    return { x: pixelX, y: pixelY };
}
/**
 * Method for calculate x point
 */

export function xToCoordinate(mapObject: Maps, val: number): number {
    let longitudeMinMax: MinMax = mapObject.baseMapBounds.longitude;
    let totalSize: number = isNullOrUndefined(mapObject.baseSize) ? mapObject.mapAreaRect.width : mapObject.mapAreaRect.width +
        (Math.abs(mapObject.baseSize.width - mapObject.mapAreaRect.width) / 2);
    return Math.round(totalSize * (val - longitudeMinMax.min) / (longitudeMinMax.max - longitudeMinMax.min) * 100) / 100;
}

/**
 * Method for calculate y point
 */

export function yToCoordinate(mapObject: Maps, val: number): number {
    let latitudeMinMax: MinMax = mapObject.baseMapBounds.latitude;
    return Math.round(mapObject.mapAreaRect.height * (val - latitudeMinMax.min) / (latitudeMinMax.max - latitudeMinMax.min) * 100) / 100;
}

/**
 * Method for calculate aitoff projection
 */

export function aitoff(x: number, y: number): Point {
    let cosy: number = Math.cos(y);
    let sincia: number = sinci(acos(cosy * Math.cos(x /= 2)));
    return new Point(2 * cosy * Math.sin(x) * sincia, Math.sin(y) * sincia);
}


/**
 * Method to round the number
 */

export function roundTo(a: number, b: number): number {
    let c: number = Math.pow(10, b);
    return (Math.round(a * c) / c);
}

export function sinci(x: number): number {
    return x / Math.sin(x);
}

export function acos(a: number): number {
    return Math.acos(a);
}

/**
 * Method to calculate bound
 */
export function calculateBound(value: number, min: number, max: number): number {
    if (!isNullOrUndefined(min)) {
        value = Math.max(value, min);
    }
    if (!(isNullOrUndefined(max))) {
        value = Math.min(value, max);
    }
    return value;
}

/**
 * Map internal class for point
 */

export class Point {
    /**
     * Point x value
     */
    public x: number;
    /**
     * Point Y value
     */
    public y: number;
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
}

/**
 * Map internal class for min and max
 * 
 */

export class MinMax {
    public min: number;
    public max: number;
    constructor(min: number, max: number) {
        this.min = min;
        this.max = max;
    }
}

/**
 * Map internal class locations
 */

export class GeoLocation {
    public latitude: MinMax;
    public longitude: MinMax;
    constructor(latitude: MinMax, longitude: MinMax) {
        this.latitude = new MinMax(latitude.min, latitude.max);
        this.longitude = new MinMax(longitude.min, longitude.max);
    }
}

/**
 * Function to measure the height and width of the text.
 * @param  {string} text
 * @param  {FontModel} font
 * @param  {string} id
 * @returns no
 * @private
 */
export function measureText(text: string, font: FontModel): Size {
    let measureObject: HTMLElement = document.getElementById('mapsmeasuretext');

    if (measureObject === null) {
        measureObject = createElement('text', { id: 'mapsmeasuretext' });
        document.body.appendChild(measureObject);
    }

    measureObject.innerHTML = text;
    measureObject.style.position = 'absolute';
    measureObject.style.fontSize = font.size;
    measureObject.style.fontWeight = font.fontWeight;
    measureObject.style.fontStyle = font.fontStyle;
    measureObject.style.fontFamily = font.fontFamily;
    measureObject.style.visibility = 'hidden';
    measureObject.style.top = '-100';
    measureObject.style.left = '0';
    measureObject.style.whiteSpace = 'nowrap';
    // For bootstrap line height issue
    measureObject.style.lineHeight = 'normal';
    return new Size(measureObject.clientWidth, measureObject.clientHeight);
}

/**
 * Internal use of text options
 * @private
 */
export class TextOption {
    public anchor: string;
    public id: string;
    public transform: string = '';
    public x: number;
    public y: number;
    public text: string | string[];
    public baseLine: string = 'auto';

    constructor(id?: string, x?: number, y?: number, anchor?: string, text?: string | string[], transform: string = '', baseLine?: string) {
        this.id = id;
        this.text = text;
        this.transform = transform;
        this.anchor = anchor;
        this.x = x;
        this.y = y;
        this.baseLine = baseLine;
    }
}
/**
 * Internal use of path options
 * @private
 */
export class PathOption {
    public id: string;
    public opacity: number;
    public fill: string;
    public stroke: string;
    public ['stroke-width']: number;
    public ['stroke-dasharray']: string;
    public d: string;
    constructor(
        id: string, fill: string, width: number, color: string, opacity?: number,
        dashArray?: string, d?: string
    ) {
        this.id = id;
        this.opacity = opacity;
        this.fill = fill;
        this.stroke = color;
        this['stroke-width'] = width;
        this['stroke-dasharray'] = dashArray;
        this.d = d;
    }
}
/** @private */
export class ColorValue {
    public r: number;
    public g: number;
    public b: number;
    constructor(r?: number, g?: number, b?: number) {
        this.r = r;
        this.g = g;
        this.b = b;
    }
}
/**
 * Internal use of rectangle options
 * @private
 */
export class RectOption extends PathOption {

    public x: number;
    public y: number;
    public height: number;
    public width: number;
    public rx: number;
    public ry: number;
    public transform: string;
    public ['stroke-dasharray']: string;
    constructor(
        id: string, fill: string, border: BorderModel, opacity: number,
        rect: Rect, rx?: number, ry?: number, transform?: string, dashArray?: string
    ) {
        super(id, fill, border.width, border.color, opacity, dashArray);
        this.y = rect.y;
        this.x = rect.x;
        this.height = rect.height;
        this.width = rect.width;
        this.rx = rx ? rx : 0;
        this.ry = ry ? ry : 0;
        this.transform = transform ? transform : '';
        this['stroke-dasharray'] = dashArray;
    }
}
/**
 * Internal use of circle options
 * @private
 */
export class CircleOption extends PathOption {
    public cy: number;
    public cx: number;
    public r: number;
    public ['stroke-dasharray']: string;
    constructor(id: string, fill: string, border: BorderModel, opacity: number, cx: number, cy: number, r: number, dashArray: string) {
        super(id, fill, border.width, border.color, opacity);
        this.cy = cy;
        this.cx = cx;
        this.r = r;
        this['stroke-dasharray'] = dashArray;
    }
}

/**
 * Internal use of polygon options
 * @private
 */
export class PolygonOption extends PathOption {
    public points: string;
    constructor(id: string, points: string, fill: string, width: number, color: string, opacity: number = 1, dashArray: string = '') {
        super(id, fill, width, color, opacity, dashArray);
        this.points = points;
    }
}
/**
 * Internal use of polyline options
 * @private
 */
export class PolylineOption extends PolygonOption {
    constructor(id: string, points: string, fill: string, width: number, color: string, opacity: number = 1, dashArray: string = '') {
        super(id, points, fill, width, color, opacity, dashArray);
    }
}
/**
 * Internal use of line options
 * @private
 */
export class LineOption extends PathOption {
    public x1: number;
    public y1: number;
    public x2: number;
    public y2: number;
    constructor(id: string, line: Line, fill: string, width: number, color: string, opacity: number = 1, dashArray: string = '') {
        super(id, fill, width, color, opacity, dashArray);
        this.x1 = line.x1;
        this.y1 = line.y1;
        this.x2 = line.x2;
        this.y2 = line.y2;
    }
}
/**
 * Internal use of line
 * @property
 */
export class Line {
    public x1: number;
    public y1: number;
    public x2: number;
    public y2: number;
    constructor(x1: number, y1: number, x2: number, y2: number) {
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
    }
}
/**
 * Internal use of map location type
 */
export class MapLocation {
    /**
     * To specify x value
     */
    public x: number;
    /**
     * To specify y value
     */
    public y: number;
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
}
/**
 * Internal use of type rect
 * @private
 */
export class Rect {

    public x: number;
    public y: number;
    public height: number;
    public width: number;

    constructor(x: number, y: number, width: number, height: number) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
}
/**
 * Internal use of pattern unit types enum.
 * @private
 */
export type patternUnits = 'userSpaceOnUse' | 'objectBoundingBox';
/**
 * Internal use for pattern creation.
 * @property
 */
export class PatternOptions {
    public id: string;
    public patternUnits: patternUnits;
    public patternContentUnits: patternUnits;
    public patternTransform: string;
    public x: number;
    public y: number;
    public width: number;
    public height: number;
    public href: string;
    constructor(
        id: string, x: number, y: number, width: number, height: number, patternUnits: patternUnits = 'userSpaceOnUse',
        patternContentUnits: patternUnits = 'userSpaceOnUse', patternTransform: string = '', href: string = '') {
        this.id = id;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.patternUnits = patternUnits;
        this.patternContentUnits = patternContentUnits;
        this.patternTransform = patternTransform;
        this.href = href;
    }
}
/**
 * Internal rendering of text
 * @private
 */
export function renderTextElement(
    option: TextOption, style: FontModel, color: string, parent: HTMLElement | Element, isMinus: boolean = false
): Element {
    let renderOptions: Object = {
        'id': option.id,
        'x': option.x,
        'y': option.y,
        'fill': color,
        'font-size': style.size,
        'font-style': style.fontStyle,
        'font-family': style.fontFamily,
        'font-weight': style.fontWeight,
        'text-anchor': option.anchor,
        'transform': option.transform,
        'opacity': style.opacity,
        'dominant-baseline': option.baseLine
    };
    let text: string = typeof option.text === 'string' ? option.text : isMinus ? option.text[option.text.length - 1] : option.text[0];
    let tspanElement: Element;
    let renderer: SvgRenderer = new SvgRenderer('');
    let height: number;
    let htmlObject: HTMLElement = <HTMLElement>renderer.createText(renderOptions, text);
    htmlObject.style['user-select'] = 'none';
    htmlObject.style['-moz-user-select'] = 'none';
    htmlObject.style['-webkit-touch-callout'] = 'none';
    htmlObject.style['-webkit-user-select'] = 'none';
    htmlObject.style['-khtml-user-select'] = 'none';
    htmlObject.style['-ms-user-select'] = 'none';
    htmlObject.style['-o-user-select'] = 'none';
    if (typeof option.text !== 'string' && option.text.length > 1) {
        for (let i: number = 1, len: number = option.text.length; i < len; i++) {
            height = (measureText(option.text[i], style).height);
            tspanElement = renderer.createTSpan(
                {
                    'x': option.x, 'id': option.id,
                    'y': (option.y) + ((isMinus) ? -(i * height) : (i * height))
                },
                isMinus ? option.text[option.text.length - (i + 1)] : option.text[i]
            );
            htmlObject.appendChild(tspanElement);
        }
    }
    parent.appendChild(htmlObject);
    return htmlObject;
}

/**
 * @private
 */
export function convertElement(element: HTMLCollection, markerId: string, data: Object, index: number, mapObj: Maps): HTMLElement {
    let childElement: HTMLElement = createElement('div', {
        id: markerId,
        styles: 'position: absolute;pointer-events: auto;'
    });
    while (element.length > 0) {
        childElement.appendChild(element[0]);
    }
    let templateHtml: string = childElement.innerHTML;
    let properties: Object[] = Object.keys(data);
    for (let i: number = 0; i < properties.length; i++) {
        if ((<String>properties[i]).toLowerCase() !== 'latitude' && (<String>properties[i]).toLowerCase() !== 'longitude') {
            templateHtml = templateHtml.replace(new RegExp('{{:' + <String>properties[i] + '}}', 'g'), data[properties[i].toString()]);
        }
    }
    childElement.innerHTML = templateHtml;
    return childElement;
}
export function convertElementFromLabel(element: Element, labelId: string, data: object, index: number, mapObj: Maps): HTMLElement {
    let labelEle: Element = isNullOrUndefined(element.childElementCount) ? element[0] : element;
    let templateHtml: string = labelEle.outerHTML;
    let properties: Object[] = Object.keys(data);
    for (let i: number = 0; i < properties.length; i++) {
        templateHtml = templateHtml.replace(new RegExp('{{:' + <String>properties[i] + '}}', 'g'), data[properties[i].toString()]);
    }
    return createElement('div', {
        id: labelId,
        innerHTML: templateHtml,
        styles: 'position: absolute'
    });
}
/* tslint:disable:no-string-literal */
//tslint:disable
export function drawSymbols(shape: MarkerType, imageUrl: string, location: Point, markerID: string, shapeCustom: Object, markerCollection: Element, maps: Maps): Element {
    let markerEle: Element; let x: number; let y: number;
    let size: Size = <Size>shapeCustom['size'];
    let borderColor: string = shapeCustom['borderColor'];
    let borderWidth: number = parseFloat(shapeCustom['borderWidth']);
    let fill: string = shapeCustom['fill'];
    let dashArray: string = shapeCustom['dashArray'];
    let border: Object = { color: borderColor, width: borderWidth };
    let opacity: number = shapeCustom['opacity'];
    let circleOptions: CircleOption; let pathOptions: PathOption; let rectOptions: RectOption;
    pathOptions = new PathOption(markerID, fill, borderWidth, borderColor, opacity, dashArray, '');
    if (shape === 'Circle') {
        let radius: number = (size.width + size.height) / 4;
        circleOptions = new CircleOption(markerID, fill, border, opacity, location.x, location.y, radius, dashArray);
        markerEle = maps.renderer.drawCircle(circleOptions) as SVGCircleElement;
    } else if (shape === 'Rectangle') {
        x = location.x - (size.width / 2);
        y = location.y - (size.height / 2);
        rectOptions = new RectOption(
            markerID, fill, border, opacity, new Rect(x, y, size.width, size.height), null, null, '', dashArray
        );
        markerEle = maps.renderer.drawRectangle(rectOptions) as SVGRectElement;
    } else if (shape === 'Image') {
        x = location.x - (size.width / 2);
        y = location.y - (size.height / 2); 
        merge(pathOptions, { 'href': imageUrl, 'height': size.height, 'width': size.width, x: x, y: y });
        markerEle = maps.renderer.drawImage(pathOptions) as SVGImageElement;
    } else {
        markerEle = calculateShapes(maps, shape, pathOptions, size, location, markerCollection);
    }
    return markerEle;
}
//tslint:disable
export function clusterTemplate(currentLayer: LayerSettings, markerTemplate: HTMLElement | Element, maps:Maps, layerIndex: number, markerCollection:Element): HTMLElement | Element {
    let bounds: DOMRect[] = []
    let colloideBounds: DOMRect[] = []
    let tempX: number = 0;
    let tempY: number = 0;
    let data: object;
    let style: FontModel = currentLayer.markerClusterSettings.labelStyle;
    let options: TextOption;
    let textElement: Element;
    let postionY: number = (15 / 4);
    let m: number = 0;
    for (let n: number = 0; n < markerTemplate.childElementCount; n++) {
        let tempElement: Element = markerTemplate.childNodes[n] as Element;
        bounds.push(tempElement.getBoundingClientRect() as DOMRect);
    }
    for (let o:number = 0; o < bounds.length; o++) {
        if(!isNullOrUndefined(bounds[o])) {
            for(let p: number = o+1; p < bounds.length; p++) {
                if(!isNullOrUndefined(bounds[p])) {
                    if ( bounds[o].left > bounds[p].right || bounds[o].right < bounds[p].left
                        || bounds[o].top > bounds[p].bottom || bounds[o].bottom < bounds[p].top){
                    }
                     else {
                        colloideBounds.push(bounds[p])
                    }
            }
        }
            tempX = bounds[o].x
            tempY = bounds[o].y
            for (let q: number = 0; q < colloideBounds.length; q++) {
                for (let k: number =0; k< bounds.length; k++) {
                    if (!isNullOrUndefined(bounds[k])) {
                        if(colloideBounds[q]['x'] === bounds[k]['x']) {
                            delete bounds[k]
                            for(let r: number = 0;r < markerTemplate.childElementCount; r++) {
                                let tempElement: Element = markerTemplate.childNodes[r] as Element;
                                if (colloideBounds[q]['x'] === tempElement.getBoundingClientRect()['x']) {
                                    markerTemplate.childNodes[r]['style']['visibility'] ="hidden"
                                    markerTemplate.childNodes[o]['style']['visibility'] ="hidden"
                                }
                            }
                        }
                    }
                }
            }
        
        if (colloideBounds.length > 0) {
            let padding: number = 10;
            let container: ClientRect = maps.element.getBoundingClientRect();
            tempX = Math.abs(container['x'] - tempX) + padding;
            tempY = Math.abs(container['y'] - tempY) + padding;
            let translate: Object = (maps.isTileMap) ? new Object() : getTranslate(maps, currentLayer, false);
            let transPoint: Point = (maps.isTileMap) ? {x:0, y:0} :(maps.translatePoint.x !== 0) ?
            maps.translatePoint : translate['location'];
            let dataIndex: number = parseInt( markerTemplate.childNodes[o]['id'].split('_dataIndex_')[1].split('_')[0], 10);
            let markerIndex: number = parseInt(markerTemplate.childNodes[o]['id'].split('_MarkerIndex_')[1].split('_')[0], 10);
            let clusters: MarkerClusterSettingsModel = currentLayer.markerClusterSettings;
            let shapeCustom: Object = {
                size: new Size(clusters.width, clusters.height),
                fill: clusters.fill, borderColor: clusters.border.color,
                borderWidth: clusters.border.width, opacity: clusters.opacity,
                dashArray: clusters.dashArray
            };            
            let eventArg: IMarkerClusterRenderingEventArgs = {
                cancel: false, name: markerClusterRendering, fill: clusters.fill, height: clusters.height,
                width: clusters.width, imageUrl: clusters.imageUrl, shape: clusters.shape,
                data: data, maps: maps, cluster: clusters, border: clusters.border
            }
            if (maps.isBlazor) {
                const {data, maps, cluster, ...blazorEventArgs}: IMarkerClusterRenderingEventArgs = eventArg;
                eventArg = blazorEventArgs;
            }
            shapeCustom['fill'] = eventArg.fill;
            shapeCustom['size']['width'] = eventArg.width
            shapeCustom['size']['height'] = eventArg.height
            shapeCustom['imageUrl'] = eventArg.imageUrl
            shapeCustom['shape'] = eventArg.shape;
            shapeCustom['borderColor']  = eventArg.border.color;
            shapeCustom['borderWidth']  = eventArg.border.width;
            maps.trigger('markerClusterRendering', eventArg, (clusterargs: IMarkerClusterRenderingEventArgs) => {
                tempX = (maps.isTileMap) ? tempX :(markerTemplate.id.indexOf('_Markers_Group') > -1) ? tempX : ((tempX + transPoint.x) * maps.mapScaleValue)
                tempY = (maps.isTileMap) ? tempY : (markerTemplate.id.indexOf('_Markers_Group') > -1) ? tempY: ((tempY + transPoint.y) * maps.mapScaleValue)
                let clusterID: string = maps.element.id + '_LayerIndex_'+ layerIndex + '_MarkerIndex_'+ markerIndex + '_dataIndex_'+ dataIndex + '_cluster_' + (m++);
                let labelID: string = maps.element.id + '_LayerIndex_'+ layerIndex + '_MarkerIndex_'+ markerIndex + '_dataIndex_'+ dataIndex + '_cluster_' + (m) +'_datalabel_'+ m;
                let ele: Element = drawSymbols(eventArg.shape, eventArg.imageUrl, { x: 0, y: 0 }, clusterID, shapeCustom, markerCollection, maps);
                ele.setAttribute('transform', 'translate( ' + tempX + ' ' + tempY + ' )');
                options = new TextOption(labelID, (0), postionY, 'middle',(colloideBounds.length + 1).toString() , '', '');
                textElement = renderTextElement(options, style, style.color, markerCollection)
                textElement.setAttribute('transform', 'translate( ' + tempX + ' ' + tempY + ' )');
                markerCollection.appendChild(ele);
                markerCollection.appendChild(textElement);
            });
        }
    }
    colloideBounds =[];
}
return markerTemplate as HTMLElement | Element
}
export function marker(eventArgs: IMarkerRenderingEventArgs, markerSettings: MarkerSettings, markerData: object[], dataIndex: number,
    location: Point, transPoint: Point, markerID : string, offset: Point, scale: number, maps: Maps,
    markerCollection: Element ): Element{
    let shapeCustom: Object = {
        size: new Size(eventArgs.width, eventArgs.height),
        fill: eventArgs.fill, borderColor: eventArgs.border.color,
        borderWidth: eventArgs.border.width, opacity: markerSettings.opacity,
        dashArray: markerSettings.dashArray
    };
    let ele: Element = drawSymbols(eventArgs.shape, eventArgs.imageUrl, { x: 0, y: 0 }, markerID, shapeCustom, markerCollection, maps );
    let x: number = (maps.isTileMap ? location.x : (location.x + transPoint.x) * scale) + offset.x;
    let y: number = (maps.isTileMap ? location.y : (location.y + transPoint.y) * scale) + offset.y;
    ele.setAttribute('transform', 'translate( ' + x + ' ' + y + ' )');
    markerCollection.appendChild(ele); 
    let element: string = (markerData.length - 1) === dataIndex ? 'marker' : null;
    let markerPoint: Point = new Point(x, y);
    if (markerSettings.animationDuration > 0) {
        elementAnimate(
            ele, markerSettings.animationDelay, markerSettings.animationDuration, markerPoint, maps, element
        );
    }
    return markerCollection
}
export function markerTemplate(eventArgs: IMarkerRenderingEventArgs, templateFn: Function, markerID: string, data:object,
    markerIndex: number, markerTemplate: HTMLElement, location: Point, scale: number, offset: Point, maps: Maps): HTMLElement{
    templateFn = getTemplateFunction(eventArgs.template);
    if (templateFn && templateFn(maps).length) {
        let templateElement: HTMLCollection = templateFn(maps);
        let markerElement: HTMLElement = <HTMLElement>convertElement(
            templateElement, markerID, data, markerIndex, maps
        );
        for (let i: number = 0; i < markerElement.children.length; i++) {
            (<HTMLElement>markerElement.children[i]).style.pointerEvents = 'none';
        }
        markerElement.style.left = ((maps.isTileMap ? location.x :
            ((Math.abs(maps.baseMapRectBounds['min']['x'] - location.x)) * scale)) + offset.x) + 'px';
        markerElement.style.top = ((maps.isTileMap ? location.y :
            ((Math.abs(maps.baseMapRectBounds['min']['y'] - location.y)) * scale)) + offset.y) + 'px';
        markerTemplate.appendChild(markerElement);
    }
    return markerTemplate
}
/**
 * Internal use of append shape element
 * @private
 */
export function appendShape(shape: Element, element: Element): Element {
    if (element) { element.appendChild(shape); }
    return shape;
}
/**
 * Internal rendering of Circle
 * @private
 */
export function drawCircle(maps: Maps, options: CircleOption, element?: Element): Element {
    return appendShape(maps.renderer.drawCircle(options), element);
}
/**
 * Internal rendering of Rectangle
 * @private
 */
export function drawRectangle(maps: Maps, options: RectOption, element?: Element): Element {
    return appendShape(maps.renderer.drawRectangle(options), element);
}
/**
 * Internal rendering of Path
 * @private
 */
export function drawPath(maps: Maps, options: PathOption, element?: Element): Element {
    return appendShape(maps.renderer.drawPath(options), element);
}
/**
 * Internal rendering of Polygon
 * @private
 */
export function drawPolygon(maps: Maps, options: PolygonOption, element?: Element): Element {
    return appendShape(maps.renderer.drawPolygon(options), element);
}
/**
 * Internal rendering of Polyline
 * @private
 */
export function drawPolyline(maps: Maps, options: PolylineOption, element?: Element): Element {
    return appendShape(maps.renderer.drawPolyline(options), element);
}
/**
 * Internal rendering of Line
 * @private
 */
export function drawLine(maps: Maps, options: LineOption, element?: Element): Element {
    return appendShape(maps.renderer.drawLine(options), element);
}

/**
 * @private
 * Calculate marker shapes
 */

export function calculateShapes(
    maps: Maps, shape: MarkerType, options: PathOption, size: Size, location: MapLocation, markerEle: Element
): Element {
    let tempGroup: Element;
    switch (shape) {
        case 'Balloon':
            tempGroup = drawBalloon(maps, options, size, location, markerEle);
            break;
        case 'Cross':
            options.d = 'M ' + location.x + ' ' + (location.y - size.height / 2) + ' L ' + location.x + ' ' + (location.y + size.height
                / 2) + ' M ' + (location.x - size.width / 2) + ' ' + location.y + ' L ' + (location.x + size.width / 2) + ' ' + location.y;
            break;
        case 'Diamond':
            options.d = 'M ' + location.x + ' ' + (location.y - size.height / 2) + ' L ' + (location.x + size.width / 2) + ' '
                + location.y + ' L ' + location.x + ' ' + (location.y + size.height / 2) + ' L ' + (location.x - size.width / 2)
                + ' ' + location.y + ' Z';
            break;
        case 'Star':
            options.d = 'M ' + (location.x + size.width / 3) + ' ' + (location.y - size.height / 2) + ' L ' + (location.x - size.width / 2)
                + ' ' + (location.y + size.height / 6) + ' L ' + (location.x + size.width / 2) + ' ' + (location.y + size.height / 6)
                + ' L ' + (location.x - size.width / 3) + ' ' + (location.y - size.height / 2) + ' L ' + location.x + ' ' +
                (location.y + size.height / 2) + ' L ' + (location.x + size.width / 3) + ' ' + (location.y - size.height / 2) + ' Z';
            break;
        case 'Triangle':
            options.d = 'M ' + location.x + ' ' + (location.y - size.height / 2) + ' L ' + (location.x + size.width / 2) + ' ' +
                (location.y + size.height / 2) + ' L ' + (location.x - size.width / 2) + ' ' + (location.y + size.height / 2) + ' Z';
            break;
        case 'HorizontalLine':
            options.d = ' M ' + (location.x - size.width / 2) + ' ' + location.y + ' L ' + (location.x + size.width / 2) + ' '
                + location.y;
            break;
        case 'VerticalLine':
            options.d = 'M ' + location.x + ' ' + (location.y - size.height / 2) + ' L ' + location.x + ' ' +
                (location.y + size.height / 2);
            break;
    }
    return shape === 'Balloon' ? tempGroup : maps.renderer.drawPath(options);
}


/**
 * Internal rendering of Diamond
 * @private
 */
export function drawDiamond(maps: Maps, options: PathOption, size: Size, location: MapLocation, element?: Element): Element {
    options.d = 'M ' + location.x + ' ' + (location.y - size.height / 2) + ' L ' + (location.x + size.width / 2) + ' ' + location.y +
        ' L ' + location.x + ' ' + (location.y + size.height / 2) + ' L ' + (location.x - size.width / 2) + ' ' + location.y + ' Z';
    return appendShape(maps.renderer.drawPath(options), element);
}
/**
 * Internal rendering of Triangle
 * @private
 */
export function drawTriangle(maps: Maps, options: PathOption, size: Size, location: MapLocation, element?: Element): Element {
    options.d = 'M ' + location.x + ' ' + (location.y - size.height / 2) + ' L ' + (location.x + size.width / 2) + ' ' +
        (location.y + size.height / 2) + ' L ' + (location.x - size.width / 2) + ' ' + (location.y + size.height / 2) + ' Z';
    return appendShape(maps.renderer.drawPath(options), element);
}
/**
 * Internal rendering of Cross
 * @private
 */
export function drawCross(maps: Maps, options: PathOption, size: Size, location: MapLocation, element?: Element): Element {
    options.d = 'M ' + location.x + ' ' + (location.y - size.height / 2) + ' L ' + location.x + ' ' + (location.y + size.height / 2) +
        ' M ' + (location.x - size.width / 2) + ' ' + location.y + ' L ' + (location.x + size.width / 2) + ' ' + location.y;
    return appendShape(maps.renderer.drawPath(options), element);
}
/**
 * Internal rendering of HorizontalLine
 * @private
 */
export function drawHorizontalLine(maps: Maps, options: PathOption, size: Size, location: MapLocation, element?: Element): Element {
    options.d = ' M ' + (location.x - size.width / 2) + ' ' + location.y + ' L ' + (location.x + size.width / 2) + ' ' + location.y;
    return appendShape(maps.renderer.drawPath(options), element);
}
/**
 * Internal rendering of VerticalLine
 * @private
 */
export function drawVerticalLine(maps: Maps, options: PathOption, size: Size, location: MapLocation, element?: Element): Element {
    options.d = 'M ' + location.x + ' ' + (location.y - size.height / 2) + ' L ' + location.x + ' ' + (location.y + size.height / 2);
    return appendShape(maps.renderer.drawPath(options), element);
}
/**
 * Internal rendering of Star
 * @private
 */
export function drawStar(maps: Maps, options: PathOption, size: Size, location: MapLocation, element?: Element): Element {
    options.d = 'M ' + (location.x + size.width / 3) + ' ' + (location.y - size.height / 2) + ' L ' + (location.x - size.width / 2)
        + ' ' + (location.y + size.height / 6) + ' L ' + (location.x + size.width / 2) + ' ' + (location.y + size.height / 6) + ' L '
        + (location.x - size.width / 3) + ' ' + (location.y - size.height / 2) + ' L ' + location.x + ' ' + (location.y + size.height / 2)
        + ' L ' + (location.x + size.width / 3) + ' ' + (location.y - size.height / 2) + ' Z';
    return appendShape(maps.renderer.drawPath(options), element);
}
/**
 * Internal rendering of Balloon
 * @private
 */
export function drawBalloon(maps: Maps, options: PathOption, size: Size, location: MapLocation, element?: Element): Element {
    let width: number = size.width;
    let height: number = size.height;
    let padding: number = 5;
    location.x -= width / 2;
    location.y -= height;
    options.d = 'M15,0C8.8,0,3.8,5,3.8,11.2C3.8,17.5,9.4,24.4,15,30c5.6-5.6,11.2-12.5,11.2-18.8C26.2,5,21.2,0,15,0z M15,16' +
        'c-2.8,0-5-2.2-5-5s2.2-5,5-5s5,2.2,5,5S17.8,16,15,16z';
    let balloon: Element = maps.renderer.drawPath(options);
    let x: number = size.width / 22.5;
    let y: number = size.height / 30;
    balloon.setAttribute('transform', 'translate(' + location.x + ', ' + location.y + ') scale(' + x + ', ' + y + ')');
    let g: Element = maps.renderer.createGroup({ id: options.id });
    appendShape(balloon, g);
    return appendShape(g, element);
}
/**
 * Internal rendering of Pattern
 * @private
 */
export function drawPattern(maps: Maps, options: PatternOptions, elements: Element[], element?: Element): Element {
    let pattern: Element = maps.renderer.createPattern(options, 'pattern');
    for (let ele of elements) {
        appendShape(ele, pattern);
    }
    return appendShape(pattern, element);
}
/**
 * Method to get specific field and vaues from data.
 * @private
 */
// tslint:disable:no-any
export function getFieldData(dataSource: object[], fields: string[]): object[] {
    let newData: object[] = [];
    let data: { [key: string]: any };
    for (let temp of dataSource) {
        data = {};
        for (let field of fields) {
            if ((<any>temp)[field]) {
                data[field] = (<any>temp)[field];
            }
        }
        newData.push(data);
    }
    return newData;
}
/**
 * To find the index of dataSource from shape properties
 */
// tslint:disable:no-string-literal
export function checkShapeDataFields(dataSource: object[], properties: object, dataPath: string, propertyPath: string | string[]): number {
    if (!(isNullOrUndefined(properties))) {
        for (let i: number = 0; i < dataSource.length; i++) {
            let shapePath: string = checkPropertyPath(dataSource[i][dataPath], propertyPath, properties);
            if (dataSource[i][dataPath] === properties[shapePath]) {
                return i;
            }
        }
    }
    return null;
}
export function checkPropertyPath(shapeData: string, shapePropertyPath: string | string[], shape: object): string {
    if (!isNullOrUndefined(shapeData) && !isNullOrUndefined(shape)) {
        if (!isNullOrUndefined(shapePropertyPath)) {
            let length: number;
            let properties: string[] = (Object.prototype.toString.call(shapePropertyPath) === '[object Array]' ?
            shapePropertyPath : [shapePropertyPath]) as string[];
            for (let i: number = 0; i < properties.length; i++) {
                if (shapeData === shape[properties[i]]) {
                    return properties[i];
                }
            }
        }
    }
    return null;
}
export function filter(points: MapLocation[], start: number, end: number): MapLocation[] {
    let pointObject: MapLocation[] = [];
    for (let i: number = 0; i < points.length; i++) {
        let point: MapLocation = points[i];
        if (start <= point.y && end >= point.y) {
            pointObject.push(point);
        }
    }
    return pointObject;
}
export function getRatioOfBubble(min: number, max: number, value: number, minValue: number, maxValue: number): number {
    let percent: number = (100 / (maxValue - minValue)) * (value - minValue);
    let bubbleRadius: number = (((max - min) / 100) * percent) + min;
    if (maxValue === minValue) {
        bubbleRadius = (((max - min) / 100)) + min;
    }
    return bubbleRadius;
}
/**
 * To find the midpoint of the polygon from points
 */
export function findMidPointOfPolygon(points: MapLocation[], type : string): object {
    if (!points.length) {
        return null;
    }
    let min: number = 0;
    let max: number = points.length;
    let startX: number;
    let startY: number;
    let startX1: number;
    let startY1: number;
    let sum: number = 0;
    let xSum: number = 0;
    let ySum: number = 0;

    for (let i: number = min; i <= max - 1; i++) {
        startX = points[i].x;
        startY = type === 'Mercator' ? points[i].y : -(points[i].y);
        if (i === max - 1) {
            startX1 = points[0].x;
            startY1 = type === 'Mercator' ? points[0].y : -(points[0].y);
        } else {
            startX1 = points[i + 1].x;
            startY1 = type === 'Mercator' ? points[i + 1].y : -(points[i + 1].y);
        }
        sum = sum + Math.abs(((startX * startY1)) - (startX1 * startY));
        xSum = xSum + Math.abs(((startX + startX1) * (((startX * startY1) - (startX1 * startY)))));
        ySum = ySum + Math.abs(((startY + startY1) * (((startX * startY1) - (startX1 * startY)))));
    }
    sum = 0.5 * sum;
    xSum = (1 / (4 * sum)) * xSum;
    ySum = (1 / (4 * sum)) * ySum;

    /* Code for finding nearest points in polygon related to midPoint*/
    let rightMinPoint: MapLocation = { x: 0, y: 0 };
    let rightMaxPoint: MapLocation = { x: 0, y: 0 };
    let leftMinPoint: MapLocation = { x: 0, y: 0 };
    let leftMaxPoint: MapLocation = { x: 0, y: 0 };
    let bottomMinPoint: MapLocation = { x: 0, y: 0 };
    let bottomMaxPoint: MapLocation = { x: 0, y: 0 };
    let topMinPoint: MapLocation = { x: 0, y: 0 };
    let topMaxPoint: MapLocation = { x: 0, y: 0 };
    let height: number = 0;
    for (let i: number = min; i <= max - 1; i++) {
        let point: MapLocation = points[i];
        point.y = type === 'Mercator' ? point.y : -(point.y);
        if (point.y > ySum) {
            if (point.x < xSum && xSum - point.x < xSum - bottomMinPoint.x) {
                bottomMinPoint = { x: point.x, y: point.y };
            } else if (point.x > xSum && (bottomMaxPoint.x === 0 || point.x - xSum < bottomMaxPoint.x - xSum)) {
                bottomMaxPoint = { x: point.x, y: point.y };
            }
        } else {
            if (point.x < xSum && xSum - point.x < xSum - topMinPoint.x) {
                topMinPoint = { x: point.x, y: point.y };
            } else if (point.x > xSum && (topMaxPoint.x === 0 || point.x - xSum < topMaxPoint.x - xSum)) {
                topMaxPoint = { x: point.x, y: point.y };
            }
        }
        height = (bottomMaxPoint.y - topMaxPoint.y) + ((bottomMaxPoint.y - topMaxPoint.y) / 4);
        if (point.x > xSum) {
            if (point.y < ySum && ySum - point.y < ySum - rightMinPoint.y) {
                rightMinPoint = { x: point.x, y: point.y };
            } else if (point.y > ySum && (rightMaxPoint.y === 0 || point.y - ySum < rightMaxPoint.y - ySum)) {
                rightMaxPoint = { x: point.x, y: point.y };
            }
        } else {
            if (point.y < ySum && ySum - point.y < ySum - leftMinPoint.y) {
                leftMinPoint = { x: point.x, y: point.y };
            } else if (point.y > ySum && (leftMaxPoint.y === 0 || point.y - ySum < leftMaxPoint.y - ySum)) {
                leftMaxPoint = { x: point.x, y: point.y };
            }
        }
    }

    return {
        x: xSum, y: ySum, rightMin: rightMinPoint, rightMax: rightMaxPoint,
        leftMin: leftMinPoint, leftMax: leftMaxPoint, points: points, topMax: topMaxPoint, topMin: topMinPoint,
        bottomMax: bottomMaxPoint, bottomMin: bottomMinPoint, height: height
    };
}
/**
 * @private
 * Check custom path
 */
/* tslint:disable:no-string-literal */
export function isCustomPath(layerData: Object[]): boolean {
    let customPath: boolean = false;
    if (Object.prototype.toString.call(layerData) === '[object Array]') {
        layerData.forEach((layer: LayerSettings, index: number) => {
            if (!isNullOrUndefined(layer['geometry']) && layer['geometry']['type'] === 'Path') {
                customPath = true;
            }
        });
    }
    return customPath;
}

/**
 * @private
 * Trim the title text
 */
export function textTrim(maxWidth: number, text: string, font: FontModel): string {
    let label: string = text;
    let size: number = measureText(text, font).width;
    if (size > maxWidth) {
        let textLength: number = text.length;
        for (let i: number = textLength - 1; i >= 0; --i) {
            label = text.substring(0, i) + '...';
            size = measureText(label, font).width;
            if (size <= maxWidth || label.length < 4) {
                if (label.length < 4) {
                    label = ' ';
                }
                return label;
            }
        }
    }
    return label;
}

/**
 * Method to calculate x position of title
 */

export function findPosition(location: Rect, alignment: Alignment, textSize: Size, type: string): Point {
    let x: number; let y: number;
    switch (alignment) {
        case 'Near':
            x = location.x;
            break;
        case 'Center':
            x = (type === 'title') ? (location.width / 2 - textSize.width / 2) :
                ((location.x + (location.width / 2)) - textSize.width / 2);
            break;
        case 'Far':
            x = (type === 'title') ? (location.width - location.y - textSize.width) :
                ((location.x + location.width) - textSize.width);
            break;
    }
    y = (type === 'title') ? location.y + (textSize.height / 2) : ((location.y + location.height / 2) + textSize.height / 2);
    return new Point(x, y);
}
/**
 * To remove element by id
 */
export function removeElement(id: string): void {
    let element: Element = document.getElementById(id);
    return element ? remove(element) : null;
}

/**
 * @private 
 */
export function getTranslate(mapObject: Maps, layer: LayerSettings, animate?: boolean): Object {
    if (isNullOrUndefined(mapObject.mapScaleValue)) {
        mapObject.mapScaleValue = mapObject.zoomSettings.zoomFactor;
    }
    let zoomFactor: number = animate ? 1 : mapObject.mapScaleValue;
    let min: Object = mapObject.baseMapRectBounds['min'] as Object;
    let max: Object = mapObject.baseMapRectBounds['max'] as Object;
    let size: Rect = mapObject.mapAreaRect;
    let availSize: Size = mapObject.availableSize;
    let x: number; let y: number;
    let mapWidth: number = Math.abs(max['x'] - min['x']);
    let mapHeight: number = Math.abs(min['y'] - max['y']);
    let factor: number = animate ? 1 : mapObject.zoomSettings.zoomFactor;
    let scaleFactor: number;
    let center: CenterPositionModel = mapObject.centerPosition;
    if (!isNullOrUndefined(center.longitude) && !isNullOrUndefined(center.latitude)) {
        let leftPosition: number = ((mapWidth + Math.abs(mapObject.mapAreaRect.width - mapWidth)) / 2) / factor;
        let topPosition: number = ((mapHeight + Math.abs(mapObject.mapAreaRect.height - mapHeight)) / 2) / factor;
        let point: Point = convertGeoToPoint(
            center.latitude, center.longitude, mapObject.mapLayerPanel.calculateFactor(layer), layer, mapObject);
        if (isNullOrUndefined(mapObject.previousProjection) || mapObject.previousProjection !== mapObject.projectionType) {
            x = -point.x + leftPosition;
            y = -point.y + topPosition;
            scaleFactor = zoomFactor;
        } else {
            scaleFactor = mapObject.scale;
            x = mapObject.zoomTranslatePoint.x;
            y = mapObject.zoomTranslatePoint.y;
        }
    } else {
        if (isNullOrUndefined(mapObject.previousProjection) || mapObject.previousProjection !== mapObject.projectionType) {
            scaleFactor = parseFloat(Math.min(size.width / mapWidth, size.height / mapHeight).toFixed(2));
            mapWidth *= scaleFactor;
            mapHeight *= scaleFactor;
            x = size.x + ((-(min['x'])) + ((size.width / 2) - (mapWidth / 2)));
            y = size.y + ((-(min['y'])) + ((size.height / 2) - (mapHeight / 2)));
        } else {
            scaleFactor = mapObject.scale;
            x = mapObject.zoomTranslatePoint.x;
            y = mapObject.zoomTranslatePoint.y;
        }
    }
    return { scale: scaleFactor, location: new Point(x, y) };
}

/**
 * @private
 */
export function getZoomTranslate(mapObject: Maps, layer: LayerSettings, animate?: boolean): Object {
    if (isNullOrUndefined(mapObject.mapScaleValue)) {
        mapObject.mapScaleValue = mapObject.zoomSettings.zoomFactor;
    }
    let zoomFactor: number = animate ? 1 : mapObject.mapScaleValue;
    let size: Rect = mapObject.mapAreaRect; let x: number; let y: number;
    let min: Object = mapObject.baseMapRectBounds['min'] as Object;
    let max: Object = mapObject.baseMapRectBounds['max'] as Object;
    let factor: number = animate ? 1 : mapObject.mapScaleValue; let scaleFactor: number;
    let mapWidth: number = Math.abs(max['x'] - min['x']); let mapHeight: number = Math.abs(min['y'] - max['y']);
    let center: CenterPositionModel = mapObject.centerPosition;
    if (!isNullOrUndefined(center.longitude) && !isNullOrUndefined(center.latitude)) {
        let topPosition: number = ((mapHeight + Math.abs(mapObject.mapAreaRect.height - mapHeight)) / 2) / factor;
        let leftPosition: number = ((mapWidth + Math.abs(mapObject.mapAreaRect.width - mapWidth)) / 2) / factor;
        let point: Point = convertGeoToPoint(
            center.latitude, center.longitude, mapObject.mapLayerPanel.calculateFactor(layer), layer, mapObject);
        if (!isNullOrUndefined(mapObject.zoomTranslatePoint) || !isNullOrUndefined(mapObject.previousProjection)) {
            if (mapObject.previousProjection !== mapObject.projectionType) {
                x = -point.x + leftPosition;
                y = -point.y + topPosition;
            } else {
                x = mapObject.zoomTranslatePoint.x;
                y = mapObject.zoomTranslatePoint.y;
            }
        } else {
            x = -point.x + leftPosition;
            y = -point.y + topPosition;
        }
        scaleFactor = zoomFactor !== 0 ? zoomFactor : 1;
    } else {
        let zoomFact: number = mapObject.zoomSettings.zoomFactor === 0 ? 1 : mapObject.zoomSettings.zoomFactor;
        let maxZoomFact: number = 10; zoomFact = zoomFact > maxZoomFact ? maxZoomFact : zoomFact;
        scaleFactor = zoomFact;
        let mapScale: number = mapObject.mapScaleValue === 0 ? 1 : mapObject.mapScaleValue > maxZoomFact
            ? maxZoomFact : mapObject.mapScaleValue;
        let leftPosition: number = (size.x + ((-(min['x'])) + ((size.width / 2) - (mapWidth / 2))));
        let topPosition: number = (size.y + ((-(min['y'])) + ((size.height / 2) - (mapHeight / 2))));
        if (!isNullOrUndefined(mapObject.zoomTranslatePoint) || !isNullOrUndefined(mapObject.previousProjection)) {
            if (mapObject.previousProjection !== mapObject.projectionType) {
                let previousPositions: Object[] = [];
                let previousPoints: object = { x: leftPosition, y: topPosition };
                previousPositions.push(previousPoints);
                for (let i: number = 1; i < maxZoomFact; i++) {
                    let translatePointX: number = previousPositions[i - 1]['x'] - (((size.width / (i)) - (size.width / (i + 1))) / 2);
                    let translatePointY: number = previousPositions[i - 1]['y'] - (((size.height / (i)) - (size.height / (i + 1))) / 2);
                    previousPoints = { x: translatePointX, y: translatePointY };
                    previousPositions.push(previousPoints);
                }
                leftPosition = previousPositions[zoomFact - 1]['x'];
                topPosition = previousPositions[zoomFact - 1]['y'];
            } else {
                leftPosition = mapObject.zoomTranslatePoint.x;
                topPosition = mapObject.zoomTranslatePoint.y;
                if (zoomFact !== mapScale) {
                    scaleFactor = mapScale;
                }
            }
        }
        x = leftPosition;
        y = topPosition;
    }
    return { scale: scaleFactor, location: new Point(x, y) };
}

/**
 * To get the html element by specified id
 */
export function getElementByID(id: string): Element {
    return document.getElementById(id);
}
/**
 * To apply internalization 
 */
export function Internalize(maps: Maps, value: number): string {
    maps.formatFunction =
        maps.intl.getNumberFormat({ format: maps.format, useGrouping: maps.useGroupingSeparator });
    return maps.formatFunction(value);
}

/**
 * Function     to compile the template function for maps.
 * @returns Function
 * @private
 */
export function getTemplateFunction(template: string): Function {
    let templateFn: Function = null;
    let e: Object;
    try {
        if (document.querySelectorAll(template).length) {
            templateFn = templateComplier(document.querySelector(template).innerHTML.trim());
        }
    } catch (e) {
        templateFn = templateComplier(template);
    }
    return templateFn;
}
/**
 * Function to get element from id.
 * @returns Element
 * @private
 */
export function getElement(id: string): Element {
    return document.getElementById(id);
}

/**
 * Function to get shape data using target id 
 */
export function getShapeData(targetId: string, map: Maps): { shapeData: object, data: object } {
    let layerIndex: number = parseInt(targetId.split('_LayerIndex_')[1].split('_')[0], 10);
    let shapeIndex: number = parseInt(targetId.split('_shapeIndex_')[1].split('_')[0], 10);
    let layer: LayerSettings = map.layers[layerIndex] as LayerSettings;
    let shapeData: Object = layer.layerData[shapeIndex]['property'];
    let data: object;
    if (layer.dataSource) {
        data = layer.dataSource[checkShapeDataFields(<Object[]>layer.dataSource, shapeData, layer.shapeDataPath, layer.shapePropertyPath)];
    }
    return { shapeData: shapeData, data: data };
}
/**
 * Function to trigger shapeSelected event
 * @private
 */
export function triggerShapeEvent(
    targetId: string, selection: SelectionSettingsModel | HighlightSettingsModel, maps: Maps, eventName: string
): IShapeSelectedEventArgs {
    let shape: { shapeData: object, data: object } = getShapeData(targetId, maps);
    let eventArgs: IShapeSelectedEventArgs = {
        cancel: false,
        name: eventName,
        fill: selection.fill,
        opacity: selection.opacity,
        border: selection.border,
        shapeData: shape.shapeData,
        data: shape.data,
        target: targetId
    };
    if (maps.isBlazor) {
        const {shapeData, data, ...blazorEventArgs} : IShapeSelectedEventArgs = eventArgs;
        eventArgs = blazorEventArgs;
    }
    maps.trigger(eventName, eventArgs);
    return eventArgs;
}
/**
 * Function to get elements using class name
 */
export function getElementsByClassName(className: string): HTMLCollectionOf<Element> {
    return document.getElementsByClassName(className);
}
/**
 * Function to get elements using querySelectorAll
 */
// export function querySelectorAll(args: string, element: Element): NodeListOf<Element> {
//     return element.querySelectorAll('.' + args);
// }
/**
 * Function to get elements using querySelector
 */
export function querySelector(args: string, elementSelector: string): Element {
    let targetEle: Element = null;
    if (document.getElementById(elementSelector)) {
        targetEle = document.getElementById(elementSelector).querySelector('#' + args);
    }
    return targetEle;
}
/**
 * Function to get the element for selection and highlight using public method
 */
export function getTargetElement(layerIndex: number, name: string, enable: boolean, map: Maps): Element {
    let shapeIndex: number;
    let targetId: string;
    let targetEle: Element;
    let shapeData: Object[] = <Object[]>map.layers[layerIndex].shapeData['features'];
    for (let i: number = 0; i < shapeData.length; i++) {
        if (shapeData[i]['properties'].name === name) {
            targetId = map.element.id + '_' + 'LayerIndex_' + layerIndex + '_shapeIndex_' + i + '_dataIndex_undefined';
            break;
        }
    }
    targetEle = getElement(targetId);
    return targetEle;
}
/**
 * Function to create style element for highlight and selection
 */
export function createStyle(id: string, className: string, eventArgs: IShapeSelectedEventArgs): Element {
    return createElement('style', {
        id: id, innerHTML: '.' + className + '{fill:'
            + eventArgs.fill + ';' + 'opacity:' + eventArgs.opacity.toString() + ';' +
            'stroke-width:' + eventArgs.border.width.toString() + ';' +
            'stroke:' + eventArgs.border.color + ';' + '}'
    });
}
/**
 * Function to customize the style for highlight and selection
 */
export function customizeStyle(id: string, className: string, eventArgs: IShapeSelectedEventArgs): void {
    let styleEle: Element = getElement(id);
    styleEle.innerHTML = '.' + className + '{fill:'
        + eventArgs.fill + ';' + 'opacity:' + eventArgs.opacity.toString() + ';' +
        'stroke-width:' + eventArgs.border.width.toString() + ';' +
        'stroke:' + eventArgs.border.color + '}';
}
/**
 * Function to remove class from element
 */
export function removeClass(element: Element): void {
    element.removeAttribute('class');
}
/**
 * Animation Effect Calculation End
 * @private
 */

export function elementAnimate(
    element: Element, delay: number, duration: number, point: MapLocation, maps: Maps,
    ele?: string, radius: number = 0
): void {
    let centerX: number = point.x;
    let centerY: number = point.y;
    let height: number = 0;
    let transform: string = element.getAttribute('transform') || '';
    new Animation({}).animate(<HTMLElement>element, {
        duration: duration,
        delay: delay,
        progress: (args: AnimationOptions): void => {
            if (args.timeStamp > args.delay) {
                height = ((args.timeStamp - args.delay) / args.duration);
                element.setAttribute('transform', 'translate( ' + (centerX - (radius * height)) + ' ' + (centerY - (radius * height)) +
                    ' ) scale(' + height + ')');
            }
        },
        end: (model: AnimationOptions) => {

            element.setAttribute('transform', transform);
            if (!ele) {
                return;
            }
            let event: IAnimationCompleteEventArgs = {
                cancel: false, name: animationComplete, element: ele, maps: maps.isBlazor ? null : maps
            };
            maps.trigger(animationComplete, event);
        }
    });
}
export function timeout(id: string): void {
    removeElement(id);
}
export function showTooltip(
    text: string, size: string, x: number, y: number, areaWidth: number, areaHeight: number, id: string, element: Element,
    isTouch?: boolean
): void {
    let tooltip: HTMLElement = document.getElementById(id);
    let width: number = measureText(text, {
        fontFamily: 'Segoe UI', size: '8px',
        fontStyle: 'Normal', fontWeight: 'Regular'
    }).width;
    let str: string[] = text.split(' ');
    let demo: number = str[0].length;
    for (let i: number = 1; i < str.length; i++) {
        if (demo < str[i].length) {
            demo = str[i].length;
        }
    }
    if (!tooltip) {
        tooltip = createElement('div', {
            id: id,
            styles: 'background-color: rgb(255, 255, 255) !important; color:black !important; ' +
                'position:absolute;border:1px solid rgb(0, 0, 0); padding-left:5px;' +
                'font-size:12px; font-family: "Segoe UI"; text-align:center'
        });
    }
    if (x < (areaWidth - width)) {
        x = x;
    } else if (x > (areaWidth - width) && x < areaWidth - (demo * 8)) {
        width = (areaWidth - x);
    } else if (x >= areaWidth - demo * 8) {
        if (x > width) {
            x = x - width;
        } else {
            width = x;
            x = 0;
        }
    }
    let size1: string[] = size.split('px');
    wordWrap(tooltip, text, x, y, size1, width, areaWidth, element);
    let height: number = tooltip.clientHeight;
    if ((height + parseInt(size1[0], 10) * 2) > areaHeight) {
        width = x;
        x = 0;
    }
    wordWrap(tooltip, text, x, y, size1, width, areaWidth, element);
    if (isTouch) {
        setTimeout(timeout, 5000, id);
    }
}

export function wordWrap(
    tooltip: HTMLElement, text: string, x: number, y: number, size1: string[], width: number,
    areaWidth: number, element: Element
): void {
    tooltip.innerHTML = text;
    tooltip.style.top = (parseInt(size1[0], 10) * 2).toString() + 'px';
    tooltip.style.left = (x).toString() + 'px';
    tooltip.style.width = width.toString() + 'px';
    tooltip.style.maxWidth = (areaWidth).toString() + 'px';
    tooltip.style.wordWrap = 'break-word';
    element.appendChild(tooltip);
}
// /**
//  * 
//  * @param touchList 
//  * @param e 
//  * @param touches 
//  */
// export function addTouchPointer(touchList: ITouches[], e: PointerEvent, touches: TouchList): ITouches[] {
//     if (touches) {
//         touchList = [];
//         for (let i: number = 0, length: number = touches.length; i < length; i++) {
//             touchList.push({ pageX: touches[i].clientX, pageY: touches[i].clientY, pointerId: null });
//         }
//     } else {
//         touchList = touchList ? touchList : [];
//         if (touchList.length === 0) {
//             touchList.push({ pageX: e.clientX, pageY: e.clientY, pointerId: e.pointerId });
//         } else {
//             for (let i: number = 0, length: number = touchList.length; i < length; i++) {
//                 if (touchList[i].pointerId === e.pointerId) {
//                     touchList[i] = { pageX: e.clientX, pageY: e.clientY, pointerId: e.pointerId };
//                 } else {
//                     touchList.push({ pageX: e.clientX, pageY: e.clientY, pointerId: e.pointerId });
//                 }
//             }
//         }
//     }
//     return touchList;
// }

/** @private */
export function createTooltip(id: string, text: string, top: number, left: number, fontSize: string): void {
    let tooltip: HTMLElement = getElement(id) as HTMLElement;
    let style: string = 'top:' + top.toString() + 'px;' +
        'left:' + left.toString() + 'px;' +
        'color: #000000; ' +
        'background:' + '#FFFFFF' + ';' +
        'position:absolute;border:1px solid #707070;font-size:' + fontSize + ';border-radius:2px;';
    if (!tooltip) {
        tooltip = createElement('div', {
            id: id, innerHTML: '&nbsp;' + text + '&nbsp;', styles: style
        });
        document.body.appendChild(tooltip);
    } else {
        tooltip.setAttribute('innerHTML', '&nbsp;' + text + '&nbsp;');
        tooltip.setAttribute('styles', style);
    }
}

/** @private */
export function drawSymbol(location: Point, shape: string, size: Size, url: string, options: PathOption): Element {
    let functionName: string = 'Path';
    let renderer: SvgRenderer = new SvgRenderer('');
    let temp: IShapes = renderLegendShape(location, size, shape, options, url);
    let htmlObject: Element = renderer['draw' + temp.functionName](temp.renderOption);
    return htmlObject;
}


/** @private */
export function renderLegendShape(location: MapLocation, size: Size, shape: string, options: PathOption, url: string): IShapes {
    let renderPath: string;
    let functionName: string = 'Path';
    let shapeWidth: number = size.width;
    let shapeHeight: number = size.height;
    let shapeX: number = location.x;
    let shapeY: number = location.y;
    let x: number = location.x + (-shapeWidth / 2);
    let y: number = location.y + (-shapeHeight / 2);
    switch (shape) {
        case 'Circle':
        case 'Bubble':
            functionName = 'Ellipse';
            merge(options, { 'rx': shapeWidth / 2, 'ry': shapeHeight / 2, 'cx': shapeX, 'cy': shapeY });
            break;
        case 'VerticalLine':
            renderPath = 'M' + ' ' + shapeX + ' ' + (shapeY + (shapeHeight / 2)) + ' ' + 'L' + ' ' + shapeX + ' '
                + (shapeY + (-shapeHeight / 2));
            merge(options, { 'd': renderPath });
            break;
        case 'Diamond':
            renderPath = 'M' + ' ' + x + ' ' + shapeY + ' ' +
                'L' + ' ' + shapeX + ' ' + (shapeY + (-shapeHeight / 2)) + ' ' +
                'L' + ' ' + (shapeX + (shapeWidth / 2)) + ' ' + shapeY + ' ' +
                'L' + ' ' + shapeX + ' ' + (shapeY + (shapeHeight / 2)) + ' ' +
                'L' + ' ' + x + ' ' + shapeY + ' z';
            merge(options, { 'd': renderPath });
            break;
        case 'Rectangle':
            renderPath = 'M' + ' ' + x + ' ' + (shapeY + (-shapeHeight / 2)) + ' ' +
                'L' + ' ' + (shapeX + (shapeWidth / 2)) + ' ' + (shapeY + (-shapeHeight / 2)) + ' ' +
                'L' + ' ' + (shapeX + (shapeWidth / 2)) + ' ' + (shapeY + (shapeHeight / 2)) + ' ' +
                'L' + ' ' + x + ' ' + (shapeY + (shapeHeight / 2)) + ' ' +
                'L' + ' ' + x + ' ' + (shapeY + (-shapeHeight / 2)) + ' z';
            merge(options, { 'd': renderPath });
            break;
        case 'Triangle':
            renderPath = 'M' + ' ' + x + ' ' + (shapeY + (shapeHeight / 2)) + ' ' +
                'L' + ' ' + shapeX + ' ' + (shapeY + (-shapeHeight / 2)) + ' ' +
                'L' + ' ' + (shapeX + (shapeWidth / 2)) + ' ' + (shapeY + (shapeHeight / 2)) + ' ' +
                'L' + ' ' + x + ' ' + (shapeY + (shapeHeight / 2)) + ' z';
            merge(options, { 'd': renderPath });
            break;
        case 'InvertedTriangle':
            renderPath = 'M' + ' ' + (shapeX + (shapeWidth / 2)) + ' ' + (shapeY - (shapeHeight / 2)) + ' ' +
                'L' + ' ' + shapeX + ' ' + (shapeY + (shapeHeight / 2)) + ' ' +
                'L' + ' ' + (shapeX - (shapeWidth / 2)) + ' ' + (shapeY - (shapeHeight / 2)) + ' ' +
                'L' + ' ' + (shapeX + (shapeWidth / 2)) + ' ' + (shapeY - (shapeHeight / 2)) + ' z';
            merge(options, { 'd': renderPath });
            break;
        case 'Pentagon':
            let eq: number = 72;
            let xValue: number;
            let yValue: number;
            for (let i: number = 0; i <= 5; i++) {
                xValue = (shapeWidth / 2) * Math.cos((Math.PI / 180) * (i * eq));
                yValue = (shapeWidth / 2) * Math.sin((Math.PI / 180) * (i * eq));
                if (i === 0) {
                    renderPath = 'M' + ' ' + (shapeX + xValue) + ' ' + (shapeY + yValue) + ' ';
                } else {
                    renderPath = renderPath.concat('L' + ' ' + (shapeX + xValue) + ' ' + (shapeY + yValue) + ' ');
                }
            }
            renderPath = renderPath.concat('Z');
            merge(options, { 'd': renderPath });
            break;
        case 'Star':
            renderPath = 'M ' + (location.x + size.width / 3) + ' ' + (location.y - size.height / 2) + ' L ' + (location.x - size.width / 2)
                + ' ' + (location.y + size.height / 6) + ' L ' + (location.x + size.width / 2) + ' ' + (location.y + size.height / 6)
                + ' L ' + (location.x - size.width / 3) + ' ' + (location.y - size.height / 2) + ' L ' + location.x + ' ' +
                (location.y + size.height / 2) + ' L ' + (location.x + size.width / 3) + ' ' + (location.y - size.height / 2) + ' Z';
            merge(options, { 'd': renderPath });
            break;
        case 'Cross':
            renderPath = 'M' + ' ' + x + ' ' + shapeY + ' ' + 'L' + ' ' + (shapeX + (shapeWidth / 2)) + ' ' + shapeY + ' ' +
                'M' + ' ' + shapeX + ' ' + (shapeY + (shapeHeight / 2)) + ' ' + 'L' + ' ' + shapeX + ' ' +
                (shapeY + (-shapeHeight / 2));
            merge(options, { 'd': renderPath });
            break;
        case 'Image':
            functionName = 'Image';
            merge(options, { 'href': url, 'height': shapeHeight, 'width': shapeWidth, x: x, y: y });
            break;
    }
    return { renderOption: options, functionName: functionName };
}
/**
 * Animation Effect Calculation End
 * @private
 */

// export function markerTemplateAnimate(element: Element, delay: number, duration: number, point: MapLocation): void {
//     let delta: number = 0;
//     let top: string = (element as HTMLElement).style.top;
//     let y: number = parseInt(top, 10);
//     new Animation({}).animate(<HTMLElement>element, {
//         duration: duration,
//         delay: delay,
//         progress: (args: AnimationOptions): void => {
//             if (args.timeStamp > args.delay) {
//                 delta = ((args.timeStamp - args.delay) / args.duration);
//                 (element as HTMLElement).style.top = y - 100 + (delta * 100) + 'px';
//             }
//         },
//         end: (model: AnimationOptions) => {
//             (element as HTMLElement).style.top = top;
//         }
//     });
// }

/** @private */
export function getElementOffset(childElement: HTMLElement, parentElement: HTMLElement): Size {
    let width: number; let height: number;
    parentElement.appendChild(childElement);
    width = childElement.offsetWidth;
    height = childElement.offsetHeight;
    parentElement.removeChild(childElement);
    return new Size(width, height);
}

/** @private */
export function changeBorderWidth(element: Element, index: number, scale: number, maps: Maps): void {
    let childNode: HTMLElement;
    for (let l: number = 0; l < element.childElementCount; l++) {
        childNode = element.childNodes[l] as HTMLElement;
        if (childNode.id.indexOf('_NavigationGroup') > -1) {
            changeNavaigationLineWidth(childNode, index, scale, maps);
        } else {
            let currentStroke: number = ((<LayerSettingsModel>maps.layersCollection[index]).shapeSettings.border.width);
            childNode.setAttribute('stroke-width', (currentStroke / scale).toString());
        }
    }
}

/** @private */
export function changeNavaigationLineWidth(element: Element, index: number, scale: number, maps: Maps): void {
    let node: HTMLElement;
    for (let m: number = 0; m < element.childElementCount; m++) {
        node = element.childNodes[m] as HTMLElement;
        if (node.tagName === 'path') {
            let currentStroke: number = ((<LayerSettingsModel>maps.layersCollection[index])
                .navigationLineSettings[parseFloat(node.id.split('_NavigationIndex_')[1].split('_')[0])].width);
            node.setAttribute('stroke-width', (currentStroke / scale).toString());
        }
    }
}

// /** Pinch zoom helper methods */

/** @private */
export function targetTouches(event: PointerEvent | TouchEvent): ITouches[] {
    let targetTouches: ITouches[] = [];
    let touches: TouchList = (<TouchEvent & PointerEvent>event).touches;
    for (let i: number = 0; i < touches.length; i++) {
        targetTouches.push({ pageX: touches[i].pageX, pageY: touches[i].pageY });
    }
    return targetTouches;
}

/** @private */
export function calculateScale(startTouches: ITouches[], endTouches: ITouches[]): number {
    let startDistance: number = getDistance(startTouches[0], startTouches[1]);
    let endDistance: number = getDistance(endTouches[0], endTouches[1]);
    return (endDistance / startDistance);
}

/** @private */
export function getDistance(a: ITouches, b: ITouches): number {
    let x: number = a.pageX - b.pageX;
    let y: number = a.pageY - b.pageY;
    return Math.sqrt(x * x + y * y);
}

/** @private */
export function getTouches(touches: ITouches[], maps: Maps): Object[] {
    let rect: ClientRect = maps.element.getBoundingClientRect();
    let posTop: number = rect.top + document.defaultView.pageXOffset;
    let posLeft: number = rect.left + document.defaultView.pageYOffset;
    return Array.prototype.slice.call(touches).map((touch: ITouches) => {
        return {
            x: touch.pageX - posLeft,
            y: touch.pageY - posTop,
        };
    });
}

/** @private */
export function getTouchCenter(touches: Object[]): Point {
    return {
        x: touches.map((e: Object) => { return e['x']; }).reduce(sum) / touches.length,
        y: touches.map((e: Object) => { return e['y']; }).reduce(sum) / touches.length
    };
}

/** @private */
export function sum(a: number, b: number): number {
    return a + b;
}

/**
 * Animation Effect Calculation End
 * @private
 */

export function zoomAnimate(
    element: Element, delay: number, duration: number, point: MapLocation, scale: number, size: Size,
    maps: Maps
): void {
    let delta: number = 0;
    let previousLocation: MapLocation = maps.previousPoint;
    let preScale: number = maps.previousScale;
    let diffScale: number = scale - preScale;
    let currentLocation: MapLocation = new MapLocation(0, 0);
    let currentScale: number = 1;
    if (scale === preScale) {
        element.setAttribute('transform', 'scale( ' + (scale) + ' ) translate( ' + point.x + ' ' + point.y + ' )');
        return;
    }
    let slope: Function = (previousLocation: MapLocation, point: MapLocation): number => {
        if (previousLocation.x === point.x) {
            return null;
        }
        return (point.y - previousLocation.y) / (point.x - previousLocation.x);
    };
    let intercept: Function = (point: MapLocation, slopeValue: number): number => {
        if (slopeValue === null) {
            return point.x;
        }
        return point.y - slopeValue * point.x;
    };
    let slopeFactor: number = slope(previousLocation, point);
    let slopeIntersection: number = intercept(previousLocation, slopeFactor);
    let horizontalDifference: number = point.x - previousLocation.x;
    let verticalDifference: number = point.y - previousLocation.y;
    animate(
        <HTMLElement>element, delay, duration,
        (args: AnimationOptions): void => {
            if (args.timeStamp > args.delay) {
                delta = ((args.timeStamp - args.delay) / args.duration);
                currentScale = preScale + (delta * diffScale);
                currentLocation.x = previousLocation.x + (delta * horizontalDifference) / (currentScale / scale);
                if (slopeFactor == null) {
                    currentLocation.y = previousLocation.y + (delta * verticalDifference);
                } else {
                    currentLocation.y = ((slopeFactor * currentLocation.x) + slopeIntersection);
                }
                args.element.setAttribute('transform', 'scale( ' + currentScale + ' ) ' +
                    'translate( ' + currentLocation.x + ' ' + currentLocation.y + ' )');
                maps.translatePoint = currentLocation;
                maps.scale = currentScale;
                maps.zoomModule.processTemplate(point.x, point.y, currentScale, maps);
            }
        },
        () => {
            maps.translatePoint = point;
            maps.scale = scale;
            element.setAttribute('transform', 'scale( ' + (scale) + ' ) translate( ' + point.x + ' ' + point.y + ' )');
            maps.zoomModule.processTemplate(point.x, point.y, scale, maps);
        }
    );
}
/**
 * To process custom animation
 */
export function animate(element: Element, delay: number, duration: number, process: Function, end: Function): void {
    let start: number = null;
    let clearAnimation: number;
    let startAnimation: FrameRequestCallback = (timestamp: number) => {
        if (!start) { start = timestamp; }
        let progress: number = timestamp - start;
        if (progress < duration) {
            process.call(this, { element: element, delay: 0, timeStamp: progress, duration: duration });
            window.requestAnimationFrame(startAnimation);
        } else {
            window.cancelAnimationFrame(clearAnimation);
            end.call(this, { element: element });
        }
    };
    clearAnimation = window.requestAnimationFrame(startAnimation);
}
/**
 * To get shape data file using Ajax.
 */
export class MapAjax {
    /**
     * MapAjax data options
     */
    public dataOptions: string | Object;
    /**
     * MapAjax type value
     */
    public type: string;
    /**
     * MapAjax async value
     */
    public async: boolean;
    /**
     * MapAjax contentType value
     */
    public contentType: string;
    /**
     * MapAjax sendData value
     */
    public sendData: string | Object;
    constructor(options: string | Object, type?: string, async?: boolean, contentType?: string, sendData?: string | Object) {
        this.dataOptions = options;
        this.type = type || 'GET';
        this.async = async || true;
        this.contentType = contentType;
        this.sendData = sendData;
    }
}

/**
 * Animation Translate
 * @private
 */
export function smoothTranslate(element: Element, delay: number, duration: number, point: MapLocation): void {
    let delta: number = 0;
    let transform: string[] = element.getAttribute('transform').split(' ');
    if (transform.length === 2) { transform[2] = transform[1].split(')')[0]; transform[1] = transform[0].split('(')[1]; }
    let previousLocation: MapLocation = new MapLocation(parseInt(transform[1], 10), parseInt(transform[2], 10));
    let diffx: number = point.x - previousLocation.x;
    let diffy: number = point.y - previousLocation.y;
    let currentLocation: MapLocation = new MapLocation(0, 0);
    animate(
        <HTMLElement>element, delay, duration, (args: AnimationOptions): void => {
            if (args.timeStamp > args.delay) {
                delta = ((args.timeStamp - args.delay) / args.duration);
                currentLocation.x = previousLocation.x + (delta * diffx);
                currentLocation.y = previousLocation.y + (delta * diffy);
                args.element.setAttribute('transform', 'translate( ' + currentLocation.x + ' ' + currentLocation.y + ' )');
            }
        },
        () => {
            element.setAttribute('transform', 'translate( ' + point.x + ' ' + point.y + ' )');
        }
    );
}


