/**
 * Schedule day view spec 
 */
import { createElement } from '@syncfusion/ej2-base';
import {
    Schedule, ScheduleModel, NavigatingEventArgs, ActionEventArgs, CellClickEventArgs,
    Day, Week, WorkWeek, Month, Agenda, DragAndDrop, SelectEventArgs, PopupOpenEventArgs, EventClickArgs
} from '../../../src/schedule/index';
import { DateTimePicker } from '@syncfusion/ej2-calendars';
import { blockData } from '../base/datasource.spec';
import * as cls from '../../../src/schedule/base/css-constant';
import * as util from '../util.spec';
import { profile, inMB, getMemoryProfile } from '../../common.spec';

Schedule.Inject(Day, Week, WorkWeek, Month, Agenda, DragAndDrop);

describe('Schedule day view', () => {
    beforeAll(() => {
        // tslint:disable-next-line:no-any
        const isDef: (o: any) => boolean = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            // tslint:disable-next-line:no-console
            console.log('Unsupported environment, window.performance.memory is unavailable');
            this.skip(); //Skips test (in Chai)
            return;
        }
    });

    describe('Initial load', () => {
        let schObj: Schedule;
        beforeAll(() => {
            let model: ScheduleModel = { currentView: 'Day', selectedDate: new Date(2017, 9, 4) };
            schObj = util.createSchedule(model, []);
        });
        afterAll(() => {
            util.destroy(schObj);
        });
        it('view class on container', () => {
            expect(schObj.element.querySelector('.e-day-view')).toBeTruthy();
        });

        it('check active view class on Toolbar views', () => {
            expect(schObj.element.querySelector('.e-active-view').classList).toContain('e-day');
        });

        it('check work cell elements count', () => {
            expect(schObj.getWorkCellElements().length).toEqual(48);
        });

        it('check all day row element', () => {
            expect(schObj.getAllDayRow()).toBeTruthy();
        });

        it('check date header cells text', () => {
            expect(schObj.element.querySelectorAll('.e-date-header-container .e-header-cells').length).toEqual(1);
            expect(schObj.element.querySelector('.e-date-header-container .e-header-cells').innerHTML).
                toEqual('<div class="e-header-day">Wed</div><div class="e-header-date e-navigate" role="link">4</div>');
        });

        it('time cells', () => {
            expect(schObj.element.querySelectorAll('.e-time-cells-wrap .e-schedule-table tr').length).
                toEqual(schObj.element.querySelectorAll('.e-content-wrap .e-content-table tbody tr').length);
            expect(schObj.element.querySelector('.e-time-cells-wrap .e-schedule-table tr td').innerHTML).
                toEqual('<span>12:00 AM</span>');
        });

        it('work cells', () => {
            let firstWorkCell: HTMLElement = schObj.element.querySelector('.e-work-cells') as HTMLElement;
            expect(firstWorkCell.parentElement.getAttribute('role')).toEqual('row');
            expect(firstWorkCell.getAttribute('role')).toEqual('gridcell');
            expect(firstWorkCell.getAttribute('aria-selected')).toEqual('false');
            expect(firstWorkCell.getAttribute('data-date')).toEqual(new Date(2017, 9, 4).getTime().toString());
            expect(firstWorkCell.innerHTML).toEqual('');
        });

        it('navigate next date', () => {
            (schObj.element.querySelector('.e-toolbar-item.e-next') as HTMLElement).click();
            expect(schObj.element.querySelectorAll('.e-date-header-container .e-header-cells').length).toEqual(1);
            expect(schObj.element.querySelector('.e-date-header-container .e-header-cells').innerHTML)
                .toEqual('<div class="e-header-day">Thu</div><div class="e-header-date e-navigate" role="link">5</div>');
        });

        it('navigate previous date', () => {
            (schObj.element.querySelector('.e-toolbar-item.e-prev') as HTMLElement).click();
            expect(schObj.element.querySelectorAll('.e-date-header-container .e-header-cells').length).toEqual(1);
            expect(schObj.element.querySelector('.e-date-header-container .e-header-cells').innerHTML)
                .toEqual('<div class="e-header-day">Wed</div><div class="e-header-date e-navigate" role="link">4</div>');
        });

        it('work hours highlight', () => {
            expect(schObj.element.querySelectorAll('.e-work-hours').length).toEqual(18);
        });
    });

    describe('Dependent properties', () => {
        let schObj: Schedule;
        beforeEach(() => {
            schObj = undefined;
        });
        afterEach(() => {
            util.destroy(schObj);
        });

        it('width and height', (done: Function) => {
            let model: ScheduleModel = { height: '600px', width: '500px', currentView: 'Day', selectedDate: new Date(2017, 9, 4) };
            schObj = util.createSchedule(model, [], done);
            expect(document.getElementById('Schedule').style.width).toEqual('500px');
            expect(document.getElementById('Schedule').style.height).toEqual('600px');
            expect(document.getElementById('Schedule').offsetWidth).toEqual(500);
            expect(document.getElementById('Schedule').offsetHeight).toEqual(600);
        });

        it('start and end hour', () => {
            let model: ScheduleModel = { currentView: 'Day', selectedDate: new Date(2017, 9, 4), startHour: '04:00', endHour: '11:00' };
            schObj = util.createSchedule(model, []);
            expect(schObj.getWorkCellElements().length).toEqual(14);
            expect(schObj.element.querySelectorAll('.e-work-hours').length).toEqual(4);
            expect(schObj.element.querySelectorAll('.e-time-cells-wrap .e-schedule-table tr').length).
                toEqual(schObj.element.querySelectorAll('.e-content-wrap .e-content-table tbody tr').length);
            expect(schObj.element.querySelector('.e-time-cells-wrap .e-schedule-table tr td').innerHTML).
                toEqual('<span>4:00 AM</span>');
            schObj.startHour = '08:00';
            schObj.endHour = '16:00';
            schObj.dataBind();
            expect(schObj.getWorkCellElements().length).toEqual(16);
            expect(schObj.element.querySelectorAll('.e-work-hours').length).toEqual(14);
            expect(schObj.element.querySelectorAll('.e-time-cells-wrap .e-schedule-table tr').length).
                toEqual(schObj.element.querySelectorAll('.e-content-wrap .e-content-table tbody tr').length);
            expect(schObj.element.querySelector('.e-time-cells-wrap .e-schedule-table tr td').innerHTML).
                toEqual('<span>8:00 AM</span>');
            schObj.startHour = '08';
            schObj.endHour = '16';
            schObj.dataBind();
            expect(schObj.getWorkCellElements().length).toEqual(48);
            expect(schObj.element.querySelectorAll('.e-work-hours').length).toEqual(18);
        });

        it('work hours start and end', () => {
            let model: ScheduleModel = {
                currentView: 'Day', selectedDate: new Date(2017, 9, 4),
                workHours: { highlight: true, start: '10:00', end: '16:00' }
            };
            schObj = util.createSchedule(model, []);
            expect(schObj.getWorkCellElements().length).toEqual(48);
            expect(schObj.element.querySelectorAll('.e-work-hours').length).toEqual(12);

            schObj.workHours = { highlight: true, start: '08:00', end: '15:00' };
            schObj.dataBind();
            expect(schObj.getWorkCellElements().length).toEqual(48);
            expect(schObj.element.querySelectorAll('.e-work-hours').length).toEqual(14);

            schObj.workHours = { highlight: true, start: '08', end: '15' };
            schObj.dataBind();
            expect(schObj.getWorkCellElements().length).toEqual(48);
            expect(schObj.element.querySelectorAll('.e-work-hours').length).toEqual(0);

            schObj.workHours = { highlight: false };
            schObj.dataBind();
            expect(schObj.getWorkCellElements().length).toEqual(48);
            expect(schObj.element.querySelectorAll('.e-work-hours').length).toEqual(0);
        });

        it('show weekend', () => {
            let model: ScheduleModel = { currentView: 'Day', selectedDate: new Date(2017, 9, 5), showWeekend: false };
            schObj = util.createSchedule(model, []);
            expect(schObj.getWorkCellElements().length).toEqual(48);
            expect(schObj.element.querySelector('.e-date-header-container .e-header-cells').innerHTML)
                .toEqual('<div class="e-header-day">Thu</div><div class="e-header-date e-navigate" role="link">5</div>');
            (schObj.element.querySelector('.e-toolbar-item.e-next') as HTMLElement).click();
            expect(schObj.element.querySelector('.e-date-header-container .e-header-cells').innerHTML)
                .toEqual('<div class="e-header-day">Fri</div><div class="e-header-date e-navigate" role="link">6</div>');
            (schObj.element.querySelector('.e-toolbar-item.e-next') as HTMLElement).click();
            expect(schObj.element.querySelector('.e-date-header-container .e-header-cells').innerHTML)
                .toEqual('<div class="e-header-day">Mon</div><div class="e-header-date e-navigate" role="link">9</div>');
            (schObj.element.querySelector('.e-toolbar-item.e-prev') as HTMLElement).click();
            expect(schObj.element.querySelector('.e-date-header-container .e-header-cells').innerHTML)
                .toEqual('<div class="e-header-day">Fri</div><div class="e-header-date e-navigate" role="link">6</div>');

            schObj.showWeekend = true;
            schObj.dataBind();
            expect(schObj.element.querySelector('.e-date-header-container .e-header-cells').innerHTML)
                .toEqual('<div class="e-header-day">Fri</div><div class="e-header-date e-navigate" role="link">6</div>');
            (schObj.element.querySelector('.e-toolbar-item.e-next') as HTMLElement).click();
            expect(schObj.element.querySelector('.e-date-header-container .e-header-cells').innerHTML)
                .toEqual('<div class="e-header-day">Sat</div><div class="e-header-date e-navigate" role="link">7</div>');
            (schObj.element.querySelector('.e-toolbar-item.e-next') as HTMLElement).click();
            expect(schObj.element.querySelector('.e-date-header-container .e-header-cells').innerHTML)
                .toEqual('<div class="e-header-day">Sun</div><div class="e-header-date e-navigate" role="link">8</div>');
            (schObj.element.querySelector('.e-toolbar-item.e-prev') as HTMLElement).click();
            expect(schObj.element.querySelector('.e-date-header-container .e-header-cells').innerHTML)
                .toEqual('<div class="e-header-day">Sat</div><div class="e-header-date e-navigate" role="link">7</div>');
        });

        it('work days', () => {
            let model: ScheduleModel = { currentView: 'Day', selectedDate: new Date(2017, 9, 5), workDays: [0, 1, 2, 3, 4] };
            schObj = util.createSchedule(model, []);
            expect(schObj.getWorkCellElements().length).toEqual(48);
            expect(schObj.element.querySelectorAll('.e-work-hours').length).toEqual(18);
            (schObj.element.querySelector('.e-toolbar-item.e-next') as HTMLElement).click();
            expect(schObj.element.querySelectorAll('.e-work-hours').length).toEqual(0);

            schObj.workDays = [0, 1, 2, 3, 4, 5, 6];
            schObj.dataBind();
            expect(schObj.element.querySelectorAll('.e-work-hours').length).toEqual(18);
        });

        it('first day of week', () => {
            let model: ScheduleModel = { currentView: 'Day', selectedDate: new Date(2017, 9, 5), firstDayOfWeek: 2 };
            schObj = util.createSchedule(model, []);
            expect(schObj.getWorkCellElements().length).toEqual(48);
            expect(schObj.element.querySelector('.e-date-range .e-tbar-btn-text').innerHTML).toEqual('October 5, 2017');

            schObj.firstDayOfWeek = 1;
            schObj.dataBind();
            expect(schObj.element.querySelector('.e-date-range .e-tbar-btn-text').innerHTML).toEqual('October 5, 2017');
        });

        it('date format', () => {
            let model: ScheduleModel = { currentView: 'Day', selectedDate: new Date(2017, 9, 5), dateFormat: 'y MMM' };
            schObj = util.createSchedule(model, []);
            expect(schObj.element.querySelector('.e-date-range .e-tbar-btn-text').innerHTML).toEqual('2017 Oct');

            schObj.dateFormat = 'd E MMM y';
            schObj.dataBind();
            expect(schObj.element.querySelector('.e-date-range .e-tbar-btn-text').innerHTML).toEqual('5 Thu Oct 2017');
        });

        it('date header template', () => {
            let model: ScheduleModel = {
                currentView: 'Day', selectedDate: new Date(2017, 9, 5),
                dateHeaderTemplate: '<span>${getDateHeaderText(data.date)}</span>'
            };
            schObj = util.createSchedule(model, []);
            expect(schObj.element.querySelector('.e-date-header-container .e-header-cells').innerHTML).toEqual('<span>Thu, 10/5</span>');

            schObj.dateHeaderTemplate = '<span>${getShortDateTime(data.date)}</span>';
            schObj.dataBind();
            expect(schObj.element.querySelector('.e-date-header-container .e-header-cells').innerHTML).
                toEqual('<span>10/5/17, 12:00 AM</span>');
        });

        it('cell template', () => {
            let templateEle: HTMLElement = createElement('div', { innerHTML: '<span class="custom-element"></span>' });
            let model: ScheduleModel = { currentView: 'Day', selectedDate: new Date(2017, 9, 5), cellTemplate: templateEle.innerHTML };
            schObj = util.createSchedule(model, []);
            expect(schObj.element.querySelectorAll('.custom-element').length).toEqual(49);
            expect(schObj.element.querySelector('.e-date-header-container .e-all-day-cells').innerHTML).toEqual(templateEle.innerHTML);
            schObj.cellTemplate = '<span>${getShortDateTime(data.date)}</span>';
            schObj.dataBind();
            expect(schObj.element.querySelector('.e-date-header-container .e-all-day-cells').innerHTML).
                toEqual('<span>10/5/17, 12:00 AM</span>');
            expect(schObj.element.querySelectorAll('.e-work-cells')[3].innerHTML).toEqual('<span>10/5/17, 1:30 AM</span>');
        });

        it('check current date class', () => {
            let model: ScheduleModel = { currentView: 'Day' };
            schObj = util.createSchedule(model, []);
            expect(schObj.element.querySelector('.e-date-header-container .e-header-cells').classList).toContain('e-current-day');
        });

        it('work cell click', () => {
            let model: ScheduleModel = { currentView: 'Day', selectedDate: new Date(2017, 9, 5) };
            schObj = util.createSchedule(model, []);
            let firstWorkCell: HTMLElement = schObj.element.querySelector('.e-work-cells') as HTMLElement;
            expect(firstWorkCell.classList).not.toContain('e-selected-cell');
            expect(firstWorkCell.getAttribute('aria-selected')).toEqual('false');
            util.triggerMouseEvent(firstWorkCell, 'click');
            expect(firstWorkCell.classList).toContain('e-selected-cell');
            expect(firstWorkCell.getAttribute('aria-selected')).toEqual('true');
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(1);
        });

        it('header cell click day view navigation', () => {
            let navFn: jasmine.Spy = jasmine.createSpy('navEvent');
            let model: ScheduleModel = { navigating: navFn, currentView: 'Day', selectedDate: new Date(2017, 9, 5) };
            schObj = util.createSchedule(model, []);
            expect(navFn).toHaveBeenCalledTimes(0);
            expect(schObj.element.querySelector('.e-date-header-container .e-header-cells').innerHTML)
                .toEqual('<div class="e-header-day">Thu</div><div class="e-header-date e-navigate" role="link">5</div>');
            (schObj.element.querySelector('.e-date-header-container .e-header-cells') as HTMLElement).click();
            expect(schObj.element.querySelector('.e-date-header-container .e-header-cells').innerHTML)
                .toEqual('<div class="e-header-day">Thu</div><div class="e-header-date e-navigate" role="link">5</div>');
            expect(navFn).toHaveBeenCalledTimes(0);
        });

        it('read only on cell click', () => {
            let model: ScheduleModel = { currentView: 'Day', selectedDate: new Date(2017, 9, 5), readonly: true };
            schObj = util.createSchedule(model, []);
            let firstWorkCell: HTMLElement = schObj.element.querySelector('.e-work-cells') as HTMLElement;
            expect(firstWorkCell.classList).not.toContain('e-selected-cell');
            expect(firstWorkCell.getAttribute('aria-selected')).toEqual('false');
            util.triggerMouseEvent(firstWorkCell, 'click');
            expect(firstWorkCell.classList).not.toContain('e-selected-cell');
            expect(firstWorkCell.getAttribute('aria-selected')).toEqual('false');
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(0);
            schObj.readonly = false;
            schObj.dataBind();
            let firstWorkCell1: HTMLElement = schObj.element.querySelector('.e-work-cells') as HTMLElement;
            expect(firstWorkCell1.classList).not.toContain('e-selected-cell');
            expect(firstWorkCell1.getAttribute('aria-selected')).toEqual('false');
            util.triggerMouseEvent(firstWorkCell1, 'click');
            expect(firstWorkCell1.classList).toContain('e-selected-cell');
            expect(firstWorkCell1.getAttribute('aria-selected')).toEqual('true');
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(1);
        });
    });

    describe('Client side events', () => {
        let schObj: Schedule;
        beforeEach(() => {
            schObj = undefined;
        });
        afterEach(() => {
            util.destroy(schObj);
        });

        it('events call confirmation', () => {
            let createdFn: jasmine.Spy = jasmine.createSpy('createdEvent');
            let clickFn: jasmine.Spy = jasmine.createSpy('clickEvent');
            let dblClickFn: jasmine.Spy = jasmine.createSpy('dblClickEvent');
            let beginFn: jasmine.Spy = jasmine.createSpy('beginEvent');
            let endFn: jasmine.Spy = jasmine.createSpy('endEvent');
            let navFn: jasmine.Spy = jasmine.createSpy('navEvent');
            let renderFn: jasmine.Spy = jasmine.createSpy('renderEvent');
            let model: ScheduleModel = {
                created: createdFn,
                cellClick: clickFn,
                cellDoubleClick: dblClickFn,
                actionBegin: beginFn,
                actionComplete: endFn,
                navigating: navFn,
                renderCell: renderFn,
                currentView: 'Day', selectedDate: new Date(2017, 9, 5)
            };
            schObj = util.createSchedule(model, []);
            expect(createdFn).toHaveBeenCalledTimes(1);
            expect(beginFn).toHaveBeenCalledTimes(1);
            expect(endFn).toHaveBeenCalledTimes(1);
            (schObj.element.querySelectorAll('.e-work-cells')[3] as HTMLElement).click();
            expect(clickFn).toHaveBeenCalledTimes(1);
            expect(renderFn).toHaveBeenCalledTimes(100);
            (schObj.element.querySelector('.e-toolbar-item.e-next') as HTMLElement).click();
            expect(renderFn).toHaveBeenCalledTimes(200);
            expect(beginFn).toHaveBeenCalledTimes(2);
            expect(endFn).toHaveBeenCalledTimes(2);
            expect(navFn).toHaveBeenCalledTimes(1);
        });

        it('cell select', () => {
            let eventName1: string;
            let eventName2: string;
            let eventName3: string;
            let model: ScheduleModel = {
                select: (args: SelectEventArgs) => {
                    eventName1 = args.name;
                    args.showQuickPopup = true;
                },
                cellClick: (args: CellClickEventArgs) => eventName2 = args.name,
                popupOpen: (args: PopupOpenEventArgs) => eventName3 = args.name,
                currentView: 'Day', selectedDate: new Date(2017, 9, 5)
            };
            schObj = util.createSchedule(model, []);
            let workCells: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-work-cells'));
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(0);
            util.triggerMouseEvent(workCells[3], 'mousedown');
            util.triggerMouseEvent(workCells[3], 'mouseup');
            (schObj.element.querySelectorAll('.e-work-cells')[3] as HTMLElement).click();
            let focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
            expect(focuesdEle.classList).toContain('e-selected-cell');
            expect(focuesdEle.getAttribute('aria-selected')).toEqual('true');
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(1);
            expect(eventName1).toEqual('select');
            expect(eventName2).toEqual('cellClick');
            expect(eventName3).toEqual('popupOpen');
        });

        it('multi cell select', () => {
            let eventName: string;
            let model: ScheduleModel = {
                select: (args: SelectEventArgs) => {
                    eventName = args.name;
                    args.showQuickPopup = true;
                },
                currentView: 'Day', selectedDate: new Date(2017, 9, 5)
            };
            schObj = util.createSchedule(model, []);
            let workCells: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-work-cells'));
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(0);
            util.triggerMouseEvent(workCells[3], 'mousedown');
            util.triggerMouseEvent(workCells[5], 'mousemove');
            util.triggerMouseEvent(workCells[5], 'mouseup');
            let focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
            expect(focuesdEle.classList).toContain('e-selected-cell');
            expect(focuesdEle.getAttribute('aria-selected')).toEqual('true');
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(3);
            expect(eventName).toEqual('select');
        });

        it('event select', (done: Function) => {
            let eventName1: string;
            let eventName2: string;
            let model: ScheduleModel = {
                currentView: 'Day', selectedDate: new Date(2017, 9, 5),
                eventClick: (args: EventClickArgs) => eventName2 = args.name,
                select: (args: SelectEventArgs) => eventName1 = args.name,
                dataBound: () => {
                    let eventElements: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
                    util.triggerMouseEvent(eventElements[0], 'click');
                    expect(eventName1).toEqual('select');
                    expect(eventName2).toEqual('eventClick');
                    done();
                }
            };
            let eventData: Object[] = [{
                Id: 1,
                Subject: 'Server Maintenance',
                StartTime: new Date(2017, 9, 5, 10),
                EndTime: new Date(2017, 9, 5, 11)
            }];
            schObj = util.createSchedule(model, eventData);
        });

        it('cell click', () => {
            let cellStartTime: number;
            let cellEndTime: number;
            let eventName: string;
            let model: ScheduleModel = {
                currentView: 'Day', selectedDate: new Date(2017, 9, 5),
                cellClick: (args: CellClickEventArgs) => {
                    cellStartTime = args.startTime.getTime();
                    cellEndTime = args.endTime.getTime();
                    eventName = args.name;
                }
            };
            schObj = util.createSchedule(model, []);
            (schObj.element.querySelectorAll('.e-work-cells')[3] as HTMLElement).click();
            expect(cellStartTime).toEqual(new Date(2017, 9, 5, 1, 30).getTime());
            expect(cellEndTime).toEqual(new Date(2017, 9, 5, 2).getTime());
            expect(eventName).toEqual('cellClick');
        });

        it('cancel cell click', () => {
            let model: ScheduleModel = {
                currentView: 'Day', selectedDate: new Date(2017, 9, 5),
                cellClick: (args: CellClickEventArgs) => args.cancel = true
            };
            schObj = util.createSchedule(model, []);
            let workCell: HTMLElement = schObj.element.querySelectorAll('.e-work-cells')[3] as HTMLElement;
            expect(workCell.classList).not.toContain('e-selected-cell');
            expect(workCell.getAttribute('aria-selected')).toEqual('false');
            util.triggerMouseEvent(workCell, 'click');
            expect(workCell.classList).not.toContain('e-selected-cell');
            expect(workCell.getAttribute('aria-selected')).toEqual('false');
        });

        it('cell double click', () => {
            let cellStartTime: number;
            let cellEndTime: number;
            let eventName: string;
            let model: ScheduleModel = {
                currentView: 'Day', selectedDate: new Date(2017, 9, 5),
                cellDoubleClick: (args: CellClickEventArgs) => {
                    cellStartTime = args.startTime.getTime();
                    cellEndTime = args.endTime.getTime();
                    eventName = args.name;
                }
            };
            schObj = util.createSchedule(model, []);
            util.triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[3] as HTMLElement, 'click');
            util.triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[3] as HTMLElement, 'dblclick');
            expect(cellStartTime).toEqual(new Date(2017, 9, 5, 1, 30).getTime());
            expect(cellEndTime).toEqual(new Date(2017, 9, 5, 2).getTime());
            expect(eventName).toEqual('cellDoubleClick');
        });

        it('cancel cell double click', () => {
            let model: ScheduleModel = {
                currentView: 'Day', selectedDate: new Date(2017, 9, 5),
                cellDoubleClick: (args: CellClickEventArgs) => args.cancel = true
            };
            schObj = util.createSchedule(model, []);
            let workCell: HTMLElement = schObj.element.querySelectorAll('.e-work-cells')[3] as HTMLElement;
            util.triggerMouseEvent(workCell, 'click');
            util.triggerMouseEvent(workCell, 'dblclick');
        });

        it('date navigating', () => {
            let actionBeginArgs: ActionEventArgs = { cancel: false, name: 'actionBegin', requestType: 'dateNavigate' };
            let actionCompleteArgs: ActionEventArgs = { cancel: false, name: 'actionComplete', requestType: 'dateNavigate' };
            let navArgs: NavigatingEventArgs = {
                action: 'date', cancel: false, name: 'navigating',
                currentDate: new Date(2017, 9, 6), previousDate: new Date(2017, 9, 5)
            };
            let args: NavigatingEventArgs; let beginArgs: ActionEventArgs; let completeArgs: ActionEventArgs;
            let model: ScheduleModel = {
                currentView: 'Day', selectedDate: new Date(2017, 9, 5),
                navigating: (e: NavigatingEventArgs) => args = e,
                actionBegin: (e: ActionEventArgs) => beginArgs = e,
                actionComplete: (e: ActionEventArgs) => completeArgs = e
            };
            schObj = util.createSchedule(model, []);
            (schObj.element.querySelector('.e-toolbar-item.e-next') as HTMLElement).click();
            expect(args).toEqual(jasmine.objectContaining(navArgs));
            expect(beginArgs).toEqual(jasmine.objectContaining(actionBeginArgs));
            expect(completeArgs).toEqual(jasmine.objectContaining(actionCompleteArgs));
        });

        it('cancel date navigate in action begin', () => {
            let model: ScheduleModel = {
                currentView: 'Day', selectedDate: new Date(2017, 9, 5),
                actionBegin: (e: ActionEventArgs) => e.cancel = true
            };
            schObj = util.createSchedule(model, []);
            expect(schObj.element.querySelector('.e-date-header-container .e-header-cells').innerHTML)
                .toEqual('<div class="e-header-day">Thu</div><div class="e-header-date e-navigate" role="link">5</div>');
            (schObj.element.querySelector('.e-toolbar-item.e-next') as HTMLElement).click();
            expect(schObj.element.querySelector('.e-date-header-container .e-header-cells').innerHTML)
                .toEqual('<div class="e-header-day">Thu</div><div class="e-header-date e-navigate" role="link">5</div>');
        });

        it('cancel date navigating', () => {
            let model: ScheduleModel = {
                currentView: 'Day', selectedDate: new Date(2017, 9, 5),
                navigating: (e: NavigatingEventArgs) => e.cancel = true
            };
            schObj = util.createSchedule(model, []);
            expect(schObj.element.querySelector('.e-date-header-container .e-header-cells').innerHTML)
                .toEqual('<div class="e-header-day">Thu</div><div class="e-header-date e-navigate" role="link">5</div>');
            (schObj.element.querySelector('.e-toolbar-item.e-next') as HTMLElement).click();
            expect(schObj.element.querySelector('.e-date-header-container .e-header-cells').innerHTML)
                .toEqual('<div class="e-header-day">Thu</div><div class="e-header-date e-navigate" role="link">5</div>');
        });

        it('view navigating', () => {
            let actionBeginArgs: ActionEventArgs = { cancel: false, name: 'actionBegin', requestType: 'viewNavigate' };
            let actionCompleteArgs: ActionEventArgs = { cancel: false, name: 'actionComplete', requestType: 'viewNavigate' };
            let navArgs: NavigatingEventArgs = {
                action: 'view', cancel: false, name: 'navigating',
                currentView: 'Week', previousView: 'Day'
            };
            let args: NavigatingEventArgs; let beginArgs: ActionEventArgs; let completeArgs: ActionEventArgs;
            let model: ScheduleModel = {
                currentView: 'Day', selectedDate: new Date(2017, 9, 5),
                navigating: (e: NavigatingEventArgs) => args = e,
                actionBegin: (e: ActionEventArgs) => beginArgs = e,
                actionComplete: (e: ActionEventArgs) => completeArgs = e
            };
            schObj = util.createSchedule(model, []);
            (schObj.element.querySelector('.e-schedule-toolbar .e-week') as HTMLElement).click();
            expect(args).toEqual(jasmine.objectContaining(navArgs));
            expect(beginArgs).toEqual(jasmine.objectContaining(actionBeginArgs));
            expect(completeArgs).toEqual(jasmine.objectContaining(actionCompleteArgs));
        });

        it('cancel view navigate in action begin', () => {
            let model: ScheduleModel = {
                currentView: 'Day', selectedDate: new Date(2017, 9, 5),
                actionBegin: (e: ActionEventArgs) => e.cancel = true
            };
            schObj = util.createSchedule(model, []);
            expect(schObj.element.querySelector('.e-active-view').classList).toContain('e-day');
            (schObj.element.querySelector('.e-schedule-toolbar .e-week') as HTMLElement).click();
            expect(schObj.element.querySelector('.e-active-view').classList).toContain('e-day');
        });

        it('cancel view navigating', () => {
            let model: ScheduleModel = {
                currentView: 'Day', selectedDate: new Date(2017, 9, 5),
                navigating: (e: NavigatingEventArgs) => e.cancel = true
            };
            schObj = util.createSchedule(model, []);
            expect(schObj.element.querySelector('.e-active-view').classList).toContain('e-day');
            (schObj.element.querySelector('.e-schedule-toolbar .e-week') as HTMLElement).click();
            expect(schObj.element.querySelector('.e-active-view').classList).toContain('e-day');
        });
    });

    describe('Public methods', () => {
        let schObj: Schedule;
        beforeEach((): void => {
            schObj = undefined;
        });
        afterEach((): void => {
            util.destroy(schObj);
        });

        it('getCellDetails', () => {
            let model: ScheduleModel = { currentView: 'Day', selectedDate: new Date(2017, 9, 5) };
            schObj = util.createSchedule(model, []);
            let data: CellClickEventArgs = schObj.getCellDetails(schObj.element.querySelector('.e-work-cells'));
            expect(data.startTime.getTime()).toEqual(new Date(2017, 9, 5).getTime());
            expect(data.endTime.getTime()).toEqual(new Date(2017, 9, 5, 0, 30).getTime());
            expect(data.isAllDay).toEqual(false);

            data = schObj.getCellDetails(schObj.element.querySelector('.e-date-header-wrap .e-all-day-cells'));
            expect(data.startTime.getTime()).toEqual(new Date(2017, 9, 5).getTime());
            expect(data.endTime.getTime()).toEqual(new Date(2017, 9, 6).getTime());
            expect(data.isAllDay).toEqual(true);
        });

        it('setWorkHours', () => {
            let model: ScheduleModel = { workHours: { highlight: false }, currentView: 'Day', selectedDate: new Date(2017, 9, 5) };
            schObj = util.createSchedule(model, []);
            schObj.setWorkHours([new Date(2017, 9, 5)], '04:00', '08:00');
            let workHourCells: HTMLTableCellElement[] = [].slice.call(schObj.element.querySelectorAll('.e-work-hours'));
            expect(workHourCells.length).toEqual(8);
            expect((workHourCells[0].parentElement as HTMLTableRowElement).rowIndex).toEqual(10);
            expect((workHourCells[workHourCells.length - 1].parentElement as HTMLTableRowElement).rowIndex).toEqual(17);
            schObj.setWorkHours([new Date(2017, 9, 5)], '16:00', '20:00');
            expect(schObj.element.querySelectorAll('.e-work-hours').length).toEqual(16);
            schObj.setWorkHours([new Date(2017, 9, 5)], '16', '20');
            expect(schObj.element.querySelectorAll('.e-work-hours').length).toEqual(16);
        });

        it('setWorkHours while start and end hour set', () => {
            let model: ScheduleModel = {
                workHours: { highlight: false },
                startHour: '04:00', endHour: '17:00',
                currentView: 'Day', selectedDate: new Date(2017, 9, 5)
            };
            schObj = util.createSchedule(model, []);
            schObj.setWorkHours([new Date(2017, 9, 5)], '03:00', '07:00');
            expect(schObj.element.querySelectorAll('.e-work-hours').length).toEqual(6);
            schObj.setWorkHours([new Date(2017, 9, 5)], '16:00', '20:00');
            expect(schObj.element.querySelectorAll('.e-work-hours').length).toEqual(8);
        });

        it('setWorkHours while date not in range', () => {
            let model: ScheduleModel = {
                workHours: { highlight: false },
                startHour: '04:00', endHour: '17:00',
                currentView: 'Day', selectedDate: new Date(2017, 9, 5)
            };
            schObj = util.createSchedule(model, []);
            schObj.setWorkHours([new Date(2017, 9, 6)], '03:00', '07:00');
            expect(schObj.element.querySelectorAll('.e-work-hours').length).toEqual(0);
        });

        it('scrollTo', () => {
            let model: ScheduleModel = { currentView: 'Day', selectedDate: new Date(2017, 9, 5), height: 500, width: 500 };
            schObj = util.createSchedule(model, []);
            schObj.scrollTo('06:00');
            let contentArea: HTMLElement = schObj.element.querySelector('.e-content-wrap') as HTMLElement;
            expect(contentArea.scrollTop).toEqual(432);
        });

        it('scrollTo empty hour', () => {
            let model: ScheduleModel = { currentView: 'Day', selectedDate: new Date(2017, 9, 5), height: 500, width: 500 };
            schObj = util.createSchedule(model, []);
            schObj.scrollTo('');
            let contentArea: HTMLElement = schObj.element.querySelector('.e-content-wrap') as HTMLElement;
            expect(contentArea.scrollTop).toEqual(648);
        });

        it('interval count', () => {
            let model: ScheduleModel = {
                height: '550px', width: '500px', currentView: 'Day',
                views: [{ option: 'Day', interval: 3 }], selectedDate: new Date(2017, 9, 4)
            };
            schObj = util.createSchedule(model, []);
            expect(schObj.element.querySelector('.e-date-range .e-tbar-btn-text').innerHTML).toEqual('October 04 - 06, 2017');
            expect(schObj.element.querySelectorAll('.e-date-header-container .e-header-cells').length).toEqual(3);
            (schObj.element.querySelector('.e-toolbar-item.e-next') as HTMLElement).click();
            expect(schObj.element.querySelector('.e-date-header-container .e-header-cells').innerHTML)
                .toEqual('<div class="e-header-day">Sat</div><div class="e-header-date e-navigate" role="link">7</div>');
            expect(schObj.element.querySelector('.e-date-range .e-tbar-btn-text').innerHTML).toEqual('October 07 - 09, 2017');
            (schObj.element.querySelector('.e-toolbar-item.e-prev') as HTMLElement).click();
            expect(schObj.element.querySelector('.e-date-header-container .e-header-cells').innerHTML)
                .toEqual('<div class="e-header-day">Wed</div><div class="e-header-date e-navigate" role="link">4</div>');
            expect(schObj.element.querySelector('.e-date-range .e-tbar-btn-text').innerHTML).toEqual('October 04 - 06, 2017');
        });
    });

    describe('Resources with group', () => {
        let schObj: Schedule;
        beforeAll((done: Function) => {
            let model: ScheduleModel = {
                width: '100%', height: '550px', currentView: 'Day',
                selectedDate: new Date(2018, 3, 1),
                group: { resources: ['Rooms', 'Owners'] },
                resources: [{
                    field: 'RoomId', title: 'Room', name: 'Rooms', allowMultiple: false,
                    dataSource: [
                        { text: 'ROOM 1', id: 1, color: '#cb6bb2' },
                        { text: 'ROOM 2', id: 2, color: '#56ca85' }
                    ],
                    textField: 'text', idField: 'id', colorField: 'color'
                }, {
                    field: 'OwnerId', title: 'Owner', name: 'Owners', allowMultiple: true,
                    dataSource: [
                        { text: 'Nancy', id: 1, groupId: 1, color: '#ffaa00' },
                        { text: 'Steven', id: 3, groupId: 2, color: '#f8a398' },
                        { text: 'Michael', id: 5, groupId: 1, color: '#7499e1' }
                    ],
                    textField: 'text', idField: 'id', groupIDField: 'groupId', colorField: 'color'
                }]
            };
            schObj = util.createSchedule(model, [], done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });
        it('header rows count', () => {
            expect(schObj.element.querySelectorAll('.e-date-header-wrap .e-schedule-table tbody tr').length).toBe(4);
        });
        it('resource cells count', () => {
            expect(schObj.element.querySelectorAll('.e-date-header-wrap .e-resource-cells').length).toBe(5);
        });
        it('date header cells count', () => {
            expect(schObj.element.querySelectorAll('.e-date-header-wrap .e-header-cells').length).toBe(3);
        });
    });

    describe('Custom work days of Resources in group', () => {
        let schObj: Schedule;
        beforeAll((done: Function) => {
            let model: ScheduleModel = {
                width: '100%', height: '550px', currentView: 'Day',
                selectedDate: new Date(2018, 3, 1),
                group: { resources: ['Rooms', 'Owners'] },
                resources: [{
                    field: 'RoomId', title: 'Room', name: 'Rooms', allowMultiple: false,
                    dataSource: [
                        { text: 'ROOM 1', id: 1, color: '#cb6bb2' },
                        { text: 'ROOM 2', id: 2, color: '#56ca85' }
                    ],
                    textField: 'text', idField: 'id', colorField: 'color'
                }, {
                    field: 'OwnerId', title: 'Owner', name: 'Owners', allowMultiple: true,
                    dataSource: [
                        { text: 'Nancy', id: 1, groupId: 1, color: '#ffaa00', workDays: [1, 2] },
                        { text: 'Steven', id: 3, groupId: 2, color: '#f8a398' },
                        { text: 'Michael', id: 5, groupId: 1, color: '#7499e1' }
                    ],
                    textField: 'text', idField: 'id', groupIDField: 'groupId', colorField: 'color', workDaysField: 'workDays'
                }]
            };
            schObj = util.createSchedule(model, [], done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });
        it('header rows count', () => {
            expect(schObj.element.querySelectorAll('.e-date-header-wrap .e-schedule-table tbody tr').length).toBe(4);
        });
        it('resource cells count', () => {
            expect(schObj.element.querySelectorAll('.e-date-header-wrap .e-resource-cells').length).toBe(5);
        });
        it('date header cells count', () => {
            expect(schObj.element.querySelectorAll('.e-date-header-wrap .e-header-cells').length).toBe(3);
        });
    });

    describe('Resource header template of Resources in group', () => {
        let schObj: Schedule;
        beforeAll((done: Function) => {
            let model: ScheduleModel = {
                width: '100%', height: '550px', currentView: 'Day',
                selectedDate: new Date(2018, 3, 1),
                resourceHeaderTemplate: '<p>${resourceData.text}</p>',
                group: { resources: ['Rooms'] },
                resources: [{
                    field: 'RoomId', title: 'Room', name: 'Rooms', allowMultiple: false,
                    dataSource: [
                        { text: 'ROOM 1', id: 1, color: '#cb6bb2' },
                        { text: 'ROOM 2', id: 2, color: '#56ca85' }
                    ],
                    textField: 'text', idField: 'id', colorField: 'color'
                }]
            };
            schObj = util.createSchedule(model, [], done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });
        it('template text', () => {
            expect(schObj.element.querySelector('.e-date-header-wrap .e-resource-cells').innerHTML).toBe('<p>ROOM 1</p>');
        });
        it('header rows count', () => {
            expect(schObj.element.querySelectorAll('.e-date-header-wrap .e-schedule-table tbody tr').length).toBe(3);
        });
        it('resource cells count', () => {
            expect(schObj.element.querySelectorAll('.e-date-header-wrap .e-resource-cells').length).toBe(2);
        });
        it('date header cells count', () => {
            expect(schObj.element.querySelectorAll('.e-date-header-wrap .e-header-cells').length).toBe(2);
        });
    });

    describe('Resources with group by date', () => {
        let schObj: Schedule;
        beforeAll((done: Function) => {
            let model: ScheduleModel = {
                width: '100%', height: '550px', currentView: 'Day',
                selectedDate: new Date(2018, 3, 1),
                group: {
                    byDate: true,
                    resources: ['Rooms', 'Owners']
                },
                resources: [{
                    field: 'RoomId', title: 'Room', name: 'Rooms', allowMultiple: false,
                    dataSource: [
                        { text: 'ROOM 1', id: 1, color: '#cb6bb2' },
                        { text: 'ROOM 2', id: 2, color: '#56ca85' }
                    ],
                    textField: 'text', idField: 'id', colorField: 'color'
                }, {
                    field: 'OwnerId', title: 'Owner', name: 'Owners', allowMultiple: true,
                    dataSource: [
                        { text: 'Nancy', id: 1, groupId: 1, color: '#ffaa00' },
                        { text: 'Steven', id: 3, groupId: 2, color: '#f8a398' },
                        { text: 'Michael', id: 5, groupId: 1, color: '#7499e1' }
                    ],
                    textField: 'text', idField: 'id', groupIDField: 'groupId', colorField: 'color'
                }]
            };
            schObj = util.createSchedule(model, [], done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });
        it('header rows count', () => {
            expect(schObj.element.querySelectorAll('.e-date-header-wrap .e-schedule-table tbody tr').length).toBe(4);
        });
        it('resource cells count', () => {
            expect(schObj.element.querySelectorAll('.e-date-header-wrap .e-resource-cells').length).toBe(5);
        });
        it('date header cells count', () => {
            expect(schObj.element.querySelectorAll('.e-date-header-wrap .e-header-cells').length).toBe(1);
        });
    });

    describe('Default schedule block events', () => {
        let schObj: Schedule;
        beforeAll((done: Function) => {
            let schOptions: ScheduleModel = { width: '500px', height: '500px', currentView: 'Day', selectedDate: new Date(2017, 9, 30) };
            schObj = util.createSchedule(schOptions, blockData.slice(0, 14), done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });

        it('block event initial rendering testing', () => {
            expect(schObj.element.querySelectorAll('.e-block-appointment').length).toEqual(1);
            let blockEvent: HTMLElement = schObj.element.querySelector('[data-id="Appointment_1"]') as HTMLElement;
            expect(blockEvent.offsetTop).toEqual(720);
            expect(blockEvent.style.width).toEqual('100%');
            expect(blockEvent.offsetHeight).toEqual(108);
        });

        it('add event', (done: Function) => {
            let contentArea: HTMLElement = schObj.element.querySelector('.e-content-wrap') as HTMLElement;
            let timeCellsArea: HTMLElement = schObj.element.querySelector('.e-time-cells-wrap') as HTMLElement;
            util.triggerScrollEvent(contentArea, 648);
            expect(contentArea.scrollTop).toEqual(648);
            expect(timeCellsArea.scrollTop).toEqual(648);
            expect(schObj.blockData.length).toEqual(7);
            util.triggerMouseEvent(schObj.element.querySelector('.e-work-cells') as HTMLElement, 'click');
            util.triggerMouseEvent(schObj.element.querySelector('.e-work-cells') as HTMLElement, 'dblclick');
            let startObj: DateTimePicker = util.getInstance(cls.EVENT_WINDOW_START_CLASS) as DateTimePicker;
            startObj.value = new Date(2017, 9, 30, 10, 30);
            startObj.dataBind();
            let endObj: DateTimePicker = util.getInstance(cls.EVENT_WINDOW_END_CLASS) as DateTimePicker;
            endObj.value = new Date(2017, 9, 30, 11, 30);
            endObj.dataBind();
            let dialogElement: HTMLElement = document.querySelector('.' + cls.EVENT_WINDOW_DIALOG_CLASS) as HTMLElement;
            let saveButton: HTMLInputElement = <HTMLInputElement>dialogElement.querySelector('.' + cls.EVENT_WINDOW_SAVE_BUTTON_CLASS);
            saveButton.click();
            let alertDialog: HTMLElement = document.querySelector('.e-quick-dialog') as HTMLElement;
            expect(schObj.quickPopup.quickDialog.visible).toBe(true);
            expect(alertDialog.querySelector('.e-dlg-content').innerHTML)
                .toEqual('Events cannot be scheduled within the blocked time range.');
            let okButton: HTMLElement = alertDialog.querySelector('.e-quick-alertok') as HTMLElement;
            okButton.click();
            expect(schObj.quickPopup.quickDialog.visible).toBe(false);
            let startRevisedObj: DateTimePicker = util.getInstance(cls.EVENT_WINDOW_START_CLASS) as DateTimePicker;
            startRevisedObj.value = new Date(2017, 9, 30, 1, 0);
            startRevisedObj.dataBind();
            let endRevisedObj: DateTimePicker = util.getInstance(cls.EVENT_WINDOW_END_CLASS) as DateTimePicker;
            endRevisedObj.value = new Date(2017, 9, 30, 2, 0);
            endRevisedObj.dataBind();
            saveButton.click();
            util.triggerScrollEvent(contentArea, 648);
            schObj.dataBound = () => {
                expect(schObj.eventWindow.dialogObject.visible).toEqual(false);
                let addedAppointment: HTMLElement = schObj.element.querySelector('[data-id="Appointment_15"]') as HTMLElement;
                expect(addedAppointment.offsetTop).toEqual(72);
                expect(addedAppointment.style.width).toEqual('96%');
                expect(addedAppointment.offsetHeight).toEqual(72);
                done();
            };
            schObj.dataBind();
        });

        it('edit event', (done: Function) => {
            util.triggerMouseEvent(schObj.element.querySelector('.e-appointment') as HTMLElement, 'click');
            util.triggerMouseEvent(schObj.element.querySelector('.e-appointment') as HTMLElement, 'dblclick');
            let startObj: DateTimePicker = util.getInstance(cls.EVENT_WINDOW_START_CLASS) as DateTimePicker;
            startObj.value = new Date(2017, 9, 30, 10, 30);
            startObj.dataBind();
            let endObj: DateTimePicker = util.getInstance(cls.EVENT_WINDOW_END_CLASS) as DateTimePicker;
            endObj.value = new Date(2017, 9, 30, 11, 30);
            endObj.dataBind();
            let dialogElement: HTMLElement = document.querySelector('.' + cls.EVENT_WINDOW_DIALOG_CLASS) as HTMLElement;
            let saveButton: HTMLInputElement = <HTMLInputElement>dialogElement.querySelector('.' + cls.EVENT_WINDOW_SAVE_BUTTON_CLASS);
            saveButton.click();
            let alertDialog: HTMLElement = document.querySelector('.e-quick-dialog') as HTMLElement;
            expect(schObj.quickPopup.quickDialog.visible).toBe(true);
            expect(alertDialog.querySelector('.e-dlg-content').innerHTML)
                .toEqual('Events cannot be scheduled within the blocked time range.');
            let okButton: HTMLElement = alertDialog.querySelector('.e-quick-alertok') as HTMLElement;
            okButton.click();
            expect(schObj.quickPopup.quickDialog.visible).toBe(false);
            let startRevisedObj: DateTimePicker = util.getInstance(cls.EVENT_WINDOW_START_CLASS) as DateTimePicker;
            startRevisedObj.value = new Date(2017, 9, 30, 2, 0);
            startRevisedObj.dataBind();
            let endRevisedObj: DateTimePicker = util.getInstance(cls.EVENT_WINDOW_END_CLASS) as DateTimePicker;
            endRevisedObj.value = new Date(2017, 9, 30, 3, 0);
            endRevisedObj.dataBind();
            saveButton.click();
            schObj.dataBound = () => {
                expect(schObj.eventWindow.dialogObject.visible).toEqual(false);
                let editedAppointment: HTMLElement = schObj.element.querySelector('[data-id="Appointment_15"]') as HTMLElement;
                expect(editedAppointment.offsetTop).toEqual(144);
                expect(editedAppointment.style.width).toEqual('96%');
                expect(editedAppointment.offsetHeight).toEqual(72);
                done();
            };
            schObj.dataBind();
        });
    });

    describe('Multi level resource rendering in block events', () => {
        let schObj: Schedule;
        beforeAll((done: Function) => {
            let schOptions: ScheduleModel = {
                height: '500px', width: '500px', currentView: 'Day',
                selectedDate: new Date(2017, 9, 30),
                group: { resources: ['Rooms', 'Owners'] },
                resources: [{
                    field: 'RoomId', title: 'Room', name: 'Rooms', allowMultiple: false,
                    dataSource: [
                        { RoomText: 'ROOM 1', RoomId: 1, RoomGroupId: 1, RoomColor: '#cb6bb2' },
                        { RoomText: 'ROOM 2', RoomId: 2, RoomGroupId: 1, RoomColor: '#56ca85' }
                    ],
                    textField: 'RoomText', idField: 'RoomId', groupIDField: 'RoomGroupId', colorField: 'RoomColor'
                }, {
                    field: 'OwnerId', title: 'Owner', name: 'Owners', allowMultiple: true,
                    dataSource: [
                        { OwnerText: 'Nancy', OwnerId: 1, OwnerGroupId: 1, OwnerColor: '#ffaa00' },
                        { OwnerText: 'Steven', OwnerId: 2, OwnerGroupId: 2, OwnerColor: '#f8a398' },
                        { OwnerText: 'Michael', OwnerId: 3, OwnerGroupId: 1, OwnerColor: '#7499e1' }
                    ],
                    textField: 'OwnerText', idField: 'OwnerId', groupIDField: 'OwnerGroupId', colorField: 'OwnerColor'
                }]
            };
            schObj = util.createSchedule(schOptions, blockData, done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });

        it('resource add event', (done: Function) => {
            let contentArea: HTMLElement = schObj.element.querySelector('.e-content-wrap') as HTMLElement;
            let timeCellsArea: HTMLElement = schObj.element.querySelector('.e-time-cells-wrap') as HTMLElement;
            util.triggerScrollEvent(contentArea, 648);
            expect(contentArea.scrollTop).toEqual(648);
            expect(timeCellsArea.scrollTop).toEqual(648);
            expect(schObj.blockData.length).toEqual(10);
            util.triggerMouseEvent(schObj.element.querySelector('.e-work-cells') as HTMLElement, 'click');
            util.triggerMouseEvent(schObj.element.querySelector('.e-work-cells') as HTMLElement, 'dblclick');
            let startObj: DateTimePicker = util.getInstance(cls.EVENT_WINDOW_START_CLASS) as DateTimePicker;
            startObj.value = new Date(2017, 9, 30, 10, 30);
            startObj.dataBind();
            let endObj: DateTimePicker = util.getInstance(cls.EVENT_WINDOW_END_CLASS) as DateTimePicker;
            endObj.value = new Date(2017, 9, 30, 11, 30);
            endObj.dataBind();
            let dialogElement: HTMLElement = document.querySelector('.' + cls.EVENT_WINDOW_DIALOG_CLASS) as HTMLElement;
            let saveButton: HTMLInputElement = <HTMLInputElement>dialogElement.querySelector('.' + cls.EVENT_WINDOW_SAVE_BUTTON_CLASS);
            saveButton.click();
            let alertDialog: HTMLElement = document.querySelector('.e-quick-dialog') as HTMLElement;
            expect(schObj.quickPopup.quickDialog.visible).toBe(true);
            expect(alertDialog.querySelector('.e-dlg-content').innerHTML)
                .toEqual('Events cannot be scheduled within the blocked time range.');
            let okButton: HTMLElement = alertDialog.querySelector('.e-quick-alertok') as HTMLElement;
            okButton.click();
            expect(schObj.quickPopup.quickDialog.visible).toBe(false);
            let startRevisedObj: DateTimePicker = util.getInstance(cls.EVENT_WINDOW_START_CLASS) as DateTimePicker;
            startRevisedObj.value = new Date(2017, 9, 30, 1, 0);
            startRevisedObj.dataBind();
            let endRevisedObj: DateTimePicker = util.getInstance(cls.EVENT_WINDOW_END_CLASS) as DateTimePicker;
            endRevisedObj.value = new Date(2017, 9, 30, 2, 0);
            endRevisedObj.dataBind();
            saveButton.click();
            util.triggerScrollEvent(contentArea, 648);
            schObj.dataBound = () => {
                expect(schObj.eventWindow.dialogObject.visible).toEqual(false);
                let addAppointment: HTMLElement = schObj.element.querySelector('[data-id="Appointment_22"]') as HTMLElement;
                expect(addAppointment.offsetTop).toEqual(72);
                expect(addAppointment.style.width).toEqual('96%');
                expect(addAppointment.offsetHeight).toEqual(72);
                done();
            };
            schObj.dataBind();
        });

        it('resource edit event', (done: Function) => {
            util.triggerMouseEvent(schObj.element.querySelector('[data-id="Appointment_22"]') as HTMLElement, 'click');
            util.triggerMouseEvent(schObj.element.querySelector('[data-id="Appointment_22"]') as HTMLElement, 'dblclick');
            let dialogElement: HTMLElement = document.querySelector('.' + cls.EVENT_WINDOW_DIALOG_CLASS) as HTMLElement;
            let startObj: DateTimePicker = util.getInstance(cls.EVENT_WINDOW_START_CLASS) as DateTimePicker;
            startObj.value = new Date(2017, 9, 30, 10, 0);
            startObj.dataBind();
            let endObj: DateTimePicker = util.getInstance(cls.EVENT_WINDOW_END_CLASS) as DateTimePicker;
            endObj.value = new Date(2017, 9, 30, 11, 30);
            endObj.dataBind();
            let saveButton: HTMLInputElement = <HTMLInputElement>dialogElement.querySelector('.' + cls.EVENT_WINDOW_SAVE_BUTTON_CLASS);
            saveButton.click();
            let alertDialog: HTMLElement = document.querySelector('.e-quick-dialog') as HTMLElement;
            expect(schObj.quickPopup.quickDialog.visible).toBe(true);
            expect(alertDialog.querySelector('.e-dlg-content').innerHTML)
                .toEqual('Events cannot be scheduled within the blocked time range.');
            let okButton: HTMLElement = alertDialog.querySelector('.e-quick-alertok') as HTMLElement;
            okButton.click();
            expect(schObj.quickPopup.quickDialog.visible).toBe(false);
            let startRevisedObj: DateTimePicker = util.getInstance(cls.EVENT_WINDOW_START_CLASS) as DateTimePicker;
            startRevisedObj.value = new Date(2017, 9, 30, 2, 0);
            startRevisedObj.dataBind();
            let endRevisedObj: DateTimePicker = util.getInstance(cls.EVENT_WINDOW_END_CLASS) as DateTimePicker;
            endRevisedObj.value = new Date(2017, 9, 30, 3, 0);
            endRevisedObj.dataBind();
            saveButton.click();
            schObj.dataBound = () => {
                expect(schObj.eventWindow.dialogObject.visible).toEqual(false);
                let editedAppointment: HTMLElement = schObj.element.querySelector('[data-id="Appointment_22"]') as HTMLElement;
                expect(editedAppointment.offsetTop).toEqual(144);
                expect(editedAppointment.style.width).toEqual('96%');
                expect(editedAppointment.offsetHeight).toEqual(72);
                done();
            };
            schObj.dataBind();
        });
    });

    it('memory leak', () => {
        profile.sample();
        // tslint:disable:no-any
        let average: any = inMB(profile.averageChange);
        //Check average change in memory samples to not be over 10MB
        expect(average).toBeLessThan(10);
        let memory: any = inMB(getMemoryProfile());
        //Check the final memory usage against the first usage, there should be little change if everything was properly deallocated
        expect(memory).toBeLessThan(profile.samples[0] + 0.25);
        // tslint:enable:no-any
    });
});
