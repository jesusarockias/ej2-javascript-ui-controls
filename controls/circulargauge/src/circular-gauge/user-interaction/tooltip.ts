import { CircularGauge } from '../circular-gauge';
import { Axis, Pointer } from '../axes/axis';
import { Tooltip } from '@syncfusion/ej2-svg-base';
import { IVisiblePointer, ITooltipRenderEventArgs } from '../model/interface';
import { GaugeLocation, getPointer, Rect, getMousePosition, Size, getElementSize } from '../utils/helper';
import { getAngleFromValue, getLabelFormat, getLocationFromAngle } from '../utils/helper';
import { TooltipSettings } from '../model/base';
import { FontModel, BorderModel } from '../model/base-model';
import { Browser, createElement, remove, isNullOrUndefined, updateBlazorTemplate, resetBlazorTemplate } from '@syncfusion/ej2-base';
import { tooltipRender } from '../model/constants';
/**
 * Tooltip Module handles the tooltip of the circular gauge
 */

export class GaugeTooltip {
    private gauge: CircularGauge;
    private tooltipEle: HTMLElement;
    private currentAxis: Axis;
    private tooltip: TooltipSettings;
    private currentPointer: Pointer;
    private borderStyle: BorderModel;
    private textStyle: FontModel;
    private svgTooltip: Tooltip;
    private tooltipId: string;
    private tooltipPosition: string;
    private arrowInverted: boolean;
    private tooltipRect: Rect;
    private clearTimeout: number;
    private pointerEle: Element;
    /**
     * Constructor for Tooltip module.
     * @private.
     */
    constructor(gauge: CircularGauge) {
        this.gauge = gauge;
        this.tooltipId = this.gauge.element.id + '_CircularGauge_Tooltip';
        this.tooltip = <TooltipSettings>gauge.tooltip;
        this.textStyle = this.tooltip.textStyle;
        this.borderStyle = this.tooltip.border;
        this.addEventListener();
    }

    /**
     * Method to render the tooltip for circular gauge.
     */
    /* tslint:disable:no-string-literal */
    /* tslint:disable:max-func-body-length */
    public renderTooltip(e: PointerEvent): void {
        let pageX: number; let pageY: number; let target: Element; let touchArg: TouchEvent;
        let location: GaugeLocation; let samePointerEle: boolean = false;
        if (e.type.indexOf('touch') !== - 1) {
            touchArg = <TouchEvent & PointerEvent>e;
            target = <Element>touchArg.target;
            pageX = touchArg.changedTouches[0].pageX;
            pageY = touchArg.changedTouches[0].pageY;
        } else {
            target = <Element>e.target;
            pageX = e.pageX;
            pageY = e.pageY;
        }
        if (target.id.indexOf('_Pointer_') >= 0) {
            if (this.pointerEle !== null) {
                samePointerEle = (this.pointerEle === target);
            }
            let svgRect: ClientRect = this.gauge.svgObject.getBoundingClientRect();
            let elementRect: ClientRect = this.gauge.element.getBoundingClientRect();
            let axisRect: ClientRect = document.getElementById(this.gauge.element.id + '_AxesCollection').getBoundingClientRect();
            let rect: Rect = new Rect(
                Math.abs(elementRect.left - svgRect.left),
                Math.abs(elementRect.top - svgRect.top),
                svgRect.width, svgRect.height
            );
            let currentPointer: IVisiblePointer = getPointer(target.id, this.gauge);
            this.currentAxis = <Axis>this.gauge.axes[currentPointer.axisIndex];
            this.currentPointer = <Pointer>(this.currentAxis.pointers)[currentPointer.pointerIndex];
            let angle: number = getAngleFromValue(
                this.currentPointer.currentValue, this.currentAxis.visibleRange.max, this.currentAxis.visibleRange.min,
                this.currentAxis.startAngle, this.currentAxis.endAngle, this.currentAxis.direction === 'ClockWise'
            ) % 360;
            let tooltipFormat: string = this.gauge.tooltip.format || this.currentAxis.labelStyle.format;
            let customLabelFormat: boolean = tooltipFormat && tooltipFormat.match('{value}') !== null;
            let format: Function = this.gauge.intl.getNumberFormat({
                format: getLabelFormat(tooltipFormat), useGrouping: this.gauge.useGroupingSeparator
            });
            if (document.getElementById(this.tooltipId)) {
                this.tooltipEle = document.getElementById(this.tooltipId);
            } else {
                this.tooltipEle = createElement('div', {
                    id: this.tooltipId,
                    className: 'EJ2-CircularGauge-Tooltip',
                    styles: 'position: absolute;pointer-events:none;'
                });
                document.getElementById(this.gauge.element.id + '_Secondary_Element').appendChild(this.tooltipEle);
            }
            let roundValue: number;
            roundValue = this.currentAxis.roundingPlaces ?
                parseFloat(this.currentPointer.currentValue.toFixed(this.currentAxis.roundingPlaces)) :
                    this.currentPointer.currentValue;
            let content: string = customLabelFormat ?
                tooltipFormat.replace(new RegExp('{value}', 'g'), format(roundValue)) :
                format(roundValue);
            location = getLocationFromAngle(
                angle, this.currentAxis.currentRadius, this.gauge.midPoint
            );
            location.x = (this.tooltip.template && ((angle >= 150 && angle <= 250) || (angle >= 330 && angle <= 360) ||
                (angle >= 0 && angle <= 45))) ? (location.x + 10) : location.x;
            let tooltipArgs: ITooltipRenderEventArgs = {
                name: tooltipRender, cancel: false, content: content, location: location, axis: this.currentAxis,
                tooltip: this.tooltip, pointer: this.currentPointer, event: e, gauge: this.gauge,
                appendInBodyTag: false
            };
            this.gauge.trigger(tooltipRender, tooltipArgs, (observedArgs: ITooltipRenderEventArgs) => {
                let template: string = tooltipArgs.tooltip.template;
                if (template !== null && template.length === 1) {
                    template = template[template[0]];
                }
                if (!this.tooltip.showAtMousePosition) {
                    if (template) {
                        let elementSize: Size = getElementSize(template, this.gauge, this.tooltipEle);
                        this.tooltipRect = Math.abs(axisRect.left - svgRect.left) > elementSize.width ?
                            this.findPosition(rect, angle, content, tooltipArgs.location) : rect;
                    } else {
                        this.findPosition(rect, angle, content, tooltipArgs.location);
                    }
                } else {
                    tooltipArgs.location = getMousePosition(pageX, pageY, this.gauge.svgObject);
                    this.tooltipRect = rect;
                }
                if (!tooltipArgs.cancel && !samePointerEle) {
                    tooltipArgs.tooltip.textStyle.color = tooltipArgs.tooltip.textStyle.color || this.gauge.themeStyle.tooltipFontColor;
                    tooltipArgs.tooltip.textStyle.fontFamily = this.gauge.themeStyle.fontFamily || tooltipArgs.tooltip.textStyle.fontFamily;
                    tooltipArgs.tooltip.textStyle.opacity =
                        this.gauge.themeStyle.tooltipTextOpacity || tooltipArgs.tooltip.textStyle.opacity;
                    this.svgTooltip = new Tooltip({
                        enable: true,
                        data: { value: tooltipArgs.content },
                        template: template,
                        enableAnimation: tooltipArgs.tooltip.enableAnimation,
                        content: [tooltipArgs.content],
                        location: tooltipArgs.location,
                        inverted: this.arrowInverted,
                        areaBounds: this.tooltipRect,
                        fill: tooltipArgs.tooltip.fill || this.gauge.themeStyle.tooltipFillColor,
                        textStyle: tooltipArgs.tooltip.textStyle,
                        availableSize: this.gauge.availableSize,
                        border: tooltipArgs.tooltip.border
                    });
                    this.svgTooltip.opacity = this.gauge.themeStyle.tooltipFillOpacity || this.svgTooltip.opacity;
                    this.svgTooltip.appendTo(this.tooltipEle);
                    if (this.gauge.tooltip.template) {
                        updateBlazorTemplate(this.gauge.element.id + 'Template', 'Template');
                    }
                    if (template && Math.abs(pageY - this.tooltipEle.getBoundingClientRect().top) <= 0) {
                        this.tooltipEle.style.top = (parseFloat(this.tooltipEle.style.top) + 20) + 'px';
                    }
                    if (tooltipArgs.appendInBodyTag) {
                        let bodyToolElement : Object = document.getElementsByClassName('EJ2-CircularGauge-Tooltip e-control e-tooltip');
                        if (!isNullOrUndefined(bodyToolElement)) {
                            this.removeTooltip();
                        }
                        document.body.appendChild(this.tooltipEle);
                        this.tooltipEle.style.zIndex = '100000000001';
                        let bounds: ClientRect = this.tooltipEle.getBoundingClientRect();
                        if (pageX + bounds['width'] <= window.innerWidth && bounds['x'] <= 0) {
                            this.tooltipEle.style.left = pageX + 20 + 'px';
                            this.tooltipEle.style.top = bounds['top'] + 20 + 'px';
                        } else {
                            this.tooltipEle.style.left = pageX - bounds['width'] + 20 + 'px';
                            this.tooltipEle.style.top = bounds['top'] + 20 + 'px';
                        }
                    }
                }
            });

        } else {
            this.removeTooltip();
            if (this.gauge.tooltip.template) {
                resetBlazorTemplate(this.gauge.element.id + 'Template', 'Template');
            }
        }
    }

    /**
     * Method to find the position of the tooltip anchor for circular gauge.
     */
    private findPosition(rect: Rect, angle: number, text: string, location: GaugeLocation): Rect {
        let addLeft: number; let addTop: number; let addHeight: number; let addWidth: number;
        switch (true) {
            case (angle >= 0 && angle < 45):
                this.arrowInverted = true;
                addLeft = (angle >= 15 && angle <= 30) ? location.y : 0;
                this.tooltipRect = new Rect(rect.x, rect.y + addTop, rect.width, rect.height);
                this.tooltipPosition = 'RightBottom';
                break;
            case (angle >= 45 && angle < 90):
                this.arrowInverted = false;
                this.tooltipRect = new Rect(rect.x, rect.y + location.y, rect.width, rect.height);
                this.tooltipPosition = 'BottomRight';
                break;
            case (angle >= 90 && angle < 135):
                this.arrowInverted = false;
                this.tooltipRect = new Rect(rect.x, rect.y + location.y, rect.width, rect.height);
                this.tooltipPosition = 'BottomLeft';
                break;
            case (angle >= 135 && angle < 180):
                this.arrowInverted = true;
                addTop = (angle >= 150 && angle <= 160) ? location.y : 0;
                this.tooltipRect = new Rect(rect.x - rect.width, rect.y + addTop, rect.width, rect.height);
                this.tooltipPosition = 'LeftBottom';
                break;
            case (angle >= 180 && angle < 225):
                this.arrowInverted = true;
                addHeight = (angle >= 200 && angle <= 225) ? Math.abs(rect.y - location.y) : rect.height;
                this.tooltipRect = new Rect(rect.x - rect.width, rect.y, rect.width, addHeight);
                this.tooltipPosition = 'LeftTop';
                break;
            case (angle >= 225 && angle < 270):
                this.arrowInverted = false;
                addWidth = (angle >= 250 && angle <= 290) ? rect.width : Math.abs(rect.x - location.x);
                this.tooltipRect = new Rect(rect.x, rect.y, addWidth, rect.height);
                this.tooltipPosition = 'TopLeft';
                break;
            case (angle >= 270 && angle < 315):
                this.arrowInverted = false;
                addLeft = (angle >= 270 && angle > 290) ? location.x : 0;
                this.tooltipRect = new Rect(rect.x + addLeft, rect.y, rect.width, rect.height);
                this.tooltipPosition = 'TopRight';
                break;
            case (angle >= 315 && angle <= 360):
                this.arrowInverted = true;
                addHeight = (angle >= 315 && angle <= 340) ? Math.abs(rect.y - location.y) : rect.height;
                this.tooltipRect = new Rect(rect.x, rect.y, rect.width, addHeight);
                this.tooltipPosition = 'RightTop';
                break;
        }
        return this.tooltipRect;
    }


    public removeTooltip(): void {
        if (document.getElementsByClassName('EJ2-CircularGauge-Tooltip').length > 0) {
            let tooltip: Element = document.getElementsByClassName('EJ2-CircularGauge-Tooltip')[0];
            if (tooltip) {
                remove(tooltip);
            }
            this.pointerEle = null;
        }
    }

    public mouseUpHandler(e: PointerEvent): void {
        this.renderTooltip(e);
        clearTimeout(this.clearTimeout);
        this.clearTimeout = setTimeout(this.removeTooltip.bind(this), 2000);
    }

    /**
     * To bind events for tooltip module
     */
    public addEventListener(): void {
        if (this.gauge.isDestroyed) {
            return;
        }
        this.gauge.on(Browser.touchMoveEvent, this.renderTooltip, this);
        this.gauge.on(Browser.touchEndEvent, this.mouseUpHandler, this);
    }

    /**
     * To unbind events for tooltip module
     */
    public removeEventListener(): void {
        if (this.gauge.isDestroyed) {
            return;
        }
        this.gauge.off(Browser.touchMoveEvent, this.renderTooltip);
        this.gauge.off(Browser.touchEndEvent, this.mouseUpHandler);
    }

    /**
     * Get module name.
     */
    protected getModuleName(): string {
        // Returns te module name
        return 'Tooltip';
    }
    /**
     * To destroy the tooltip.
     * @return {void}
     * @private
     */
    public destroy(gauge: CircularGauge): void {
        // Destroy method performed here
        this.removeEventListener();
    }
}
