import { isNullOrUndefined, Internationalization, append, createElement, isBlazor } from '@syncfusion/ej2-base';
import { updateBlazorTemplate, resetBlazorTemplate } from '@syncfusion/ej2-base';
import { Tooltip, TooltipEventArgs } from '@syncfusion/ej2-popups';
import { Schedule } from '../base/schedule';
import { TdData, ResourceDetails, EventFieldsMapping } from '../base/interface';
import * as cls from '../base/css-constant';
import * as util from '../base/util';

/**
 * Tooltip for Schedule
 */
export class EventTooltip {
    private parent: Schedule;
    private tooltipObj: Tooltip;
    constructor(parent: Schedule) {
        this.parent = parent;
        this.tooltipObj = new Tooltip({
            content: 'No title',
            position: 'BottomRight',
            offsetY: 10,
            mouseTrail: this.parent.isAdaptive ? false : true,
            showTipPointer: false,
            cssClass: this.parent.cssClass + ' ' + cls.EVENT_TOOLTIP_ROOT_CLASS,
            target: this.getTargets(),
            beforeRender: this.onBeforeRender.bind(this),
            enableRtl: this.parent.enableRtl
        });
        if (isBlazor()) {
            this.tooltipObj.beforeOpen = this.onBeforeOpen.bind(this);
            this.tooltipObj.beforeClose = this.onBeforeClose.bind(this);
            this.tooltipObj.animation = { close: { effect: 'None' } };
        }
        this.tooltipObj.appendTo(this.parent.element);
        this.tooltipObj.isStringTemplate = true;
    }

    private getTargets(): string {
        let targets: string[] = [];
        if (this.parent.activeViewOptions.group.headerTooltipTemplate) {
            targets.push('.' + cls.RESOURCE_CELLS_CLASS);
        }
        if (this.parent.eventSettings.enableTooltip) {
            targets.push('.' + cls.APPOINTMENT_CLASS);
        }
        return targets.join(',');
    }

    private onBeforeOpen(): void {
        if (this.parent.group.headerTooltipTemplate) {
            let templateId: string = this.parent.element.id + '_headerTooltipTemplate';
            updateBlazorTemplate(templateId, 'HeaderTooltipTemplate', this.parent.group);
        }
        if (this.parent.eventSettings.tooltipTemplate) {
            let templateId: string = this.parent.element.id + '_tooltipTemplate';
            updateBlazorTemplate(templateId, 'TooltipTemplate', this.parent.eventSettings);
        }
    }

    private onBeforeClose(): void {
        if (this.parent.group.headerTooltipTemplate) {
            let templateId: string = this.parent.element.id + '_headerTooltipTemplate';
            resetBlazorTemplate(templateId, 'HeaderTooltipTemplate');
        }
        if (this.parent.eventSettings.tooltipTemplate) {
            let templateId: string = this.parent.element.id + '_tooltipTemplate';
            resetBlazorTemplate(templateId, 'TooltipTemplate');
        }
    }

    private onBeforeRender(args: TooltipEventArgs): void {
        if (!isNullOrUndefined(args.target.getAttribute('data-tooltip-id'))) {
            return;
        }
        if (args.target.classList.contains(cls.RESOURCE_CELLS_CLASS) && this.parent.activeViewOptions.group.resources.length > 0) {
            let resCollection: TdData;
            if (this.parent.activeView.isTimelineView()) {
                let index: number = parseInt(args.target.getAttribute('data-group-index') as string, 0);
                resCollection = this.parent.resourceBase.lastResourceLevel[index];
            } else {
                let rowIndex: number = (args.target.parentNode as HTMLTableRowElement).sectionRowIndex;
                let cellIndex: number = (args.target as HTMLTableCellElement).cellIndex;
                resCollection = this.parent.activeView.getColumnLevels()[rowIndex][cellIndex];
            }
            let data: ResourceDetails = {
                resource: resCollection.resource,
                resourceData: resCollection.resourceData
            };
            let contentContainer: HTMLElement = createElement('div');
            let templateId: string = this.parent.element.id + '_headerTooltipTemplate';
            let tooltipTemplate: NodeList =
                this.parent.getHeaderTooltipTemplate()(data, this.parent, 'headerTooltipTemplate', templateId, false);
            append(tooltipTemplate, contentContainer);
            this.setContent(contentContainer);
            return;
        }
        let record: { [key: string]: Object } =
            <{ [key: string]: Object }>this.parent.eventBase.getEventByGuid(args.target.getAttribute('data-guid'));
        if (!isNullOrUndefined(this.parent.eventSettings.tooltipTemplate)) {
            let contentContainer: HTMLElement = createElement('div');
            let templateId: string = this.parent.element.id + '_tooltipTemplate';
            let tooltipTemplate: NodeList =
                this.parent.getEventTooltipTemplate()(record, this.parent, 'tooltipTemplate', templateId, false);
            append(tooltipTemplate, contentContainer);
            this.setContent(contentContainer);
        } else {
            let globalize: Internationalization = this.parent.globalize; let fields: EventFieldsMapping = this.parent.eventFields;
            let eventStart: Date = new Date('' + record[fields.startTime]) as Date;
            let eventEnd: Date = new Date('' + record[fields.endTime]) as Date;
            eventEnd = (eventEnd.getHours() === 0 && eventEnd.getMinutes() === 0) ? new Date(eventEnd.setMilliseconds(-1000)) : eventEnd;
            let startDate: Date = util.resetTime(new Date('' + eventStart));
            let endDate: Date = util.resetTime(new Date('' + eventEnd));
            let tooltipSubject: string = (record[fields.subject] || this.parent.eventSettings.fields.subject.default) as string;
            let tooltipLocation: string = !isNullOrUndefined(record[fields.location]) ? <string>record[fields.location] : '';
            let startMonthDate: string = globalize.formatDate(eventStart, {
                type: 'date', skeleton: 'MMMd', calendar: this.parent.getCalendarMode()
            });
            let startMonthYearDate: string = globalize.formatDate(eventStart, {
                type: 'date', skeleton: 'medium', calendar: this.parent.getCalendarMode()
            });
            let endMonthYearDate: string = globalize.formatDate(eventEnd, {
                type: 'date', skeleton: 'medium', calendar: this.parent.getCalendarMode()
            });
            let startTime: string = globalize.formatDate(eventStart, {
                type: 'time', skeleton: 'short', calendar: this.parent.getCalendarMode()
            });
            let endTime: string = globalize.formatDate(eventEnd, {
                type: 'time', skeleton: 'short', calendar: this.parent.getCalendarMode()
            });
            let tooltipDetails: string;
            if (startDate.getTime() === endDate.getTime()) {
                tooltipDetails = globalize.formatDate(eventStart, {
                    type: 'date', skeleton: 'long', calendar: this.parent.getCalendarMode()
                });
            } else {
                tooltipDetails = (startDate.getFullYear() === endDate.getFullYear()) ? (startMonthDate + ' - ' + endMonthYearDate) :
                    (startMonthYearDate + ' - ' + endMonthYearDate);
            }
            let tooltipTime: string = (record[fields.isAllDay]) ? this.parent.localeObj.getConstant('allDay') :
                (startTime + ' - ' + endTime);
            let content: string = '<div><div class="e-subject">' + tooltipSubject + '</div>' +
                '<div class="e-location">' + tooltipLocation + '</div>' +
                '<div class="e-details">' + tooltipDetails + '</div>' +
                '<div class="e-all-day">' + tooltipTime + '</div></div>';
            this.setContent(content);
        }
    }

    private setContent(content: string | HTMLElement): void {
        this.tooltipObj.setProperties({ content: content }, true);
    }

    public close(): void {
        this.tooltipObj.close();
    }
    /**
     * To destroy the event tooltip. 
     * @return {void}
     * @private
     */
    public destroy(): void {
        this.tooltipObj.destroy();
        this.tooltipObj = null;
    }
}
