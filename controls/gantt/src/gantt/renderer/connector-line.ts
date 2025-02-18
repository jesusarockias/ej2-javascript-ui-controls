import { createElement, isNullOrUndefined } from '@syncfusion/ej2-base';
import { Gantt } from '../base/gantt';
import * as cls from '../base/css-constants';
import { IGanttData, ITaskData, IConnectorLineObject, IPredecessor } from '../base/interface';
import { isScheduledTask } from '../base/utils';

/**
 * To render the connector line in Gantt
 */
export class ConnectorLine {
    private parent: Gantt;
    public dependencyViewContainer: HTMLElement;
    private lineColor: string;
    private lineStroke: number;
    public tooltipTable: HTMLElement;
    constructor(ganttObj?: Gantt) {
        this.parent = ganttObj;
        this.dependencyViewContainer =
            createElement('div', { className: cls.dependencyViewContainer });
        this.initPublicProp();
    }

    /**
     * To get connector line gap.
     * @return {number}
     * @private
     */
    private getconnectorLineGap(data: IConnectorLineObject): number {
        let width: number = 0;
        width = (data.milestoneChild ?
            ((this.parent.chartRowsModule.milestoneMarginTop / 2) + (this.parent.chartRowsModule.milestoneHeight / 2)) :
            ((this.parent.chartRowsModule.taskBarMarginTop / 2) + (this.parent.chartRowsModule.taskBarHeight / 2)));
        return width;
    }

    /**
     * To initialize the public property.
     * @return {void}
     * @private
     */
    public initPublicProp(): void {
        this.lineColor = this.parent.connectorLineBackground;
        this.lineStroke = (this.parent.connectorLineWidth) > 4 ? 4 : this.parent.connectorLineWidth;
        this.createConnectorLineTooltipTable();
    }

    private getTaskbarMidpoint(isMilestone: boolean): number {
        return Math.floor(isMilestone ?
            (this.parent.chartRowsModule.milestoneMarginTop + (this.parent.chartRowsModule.milestoneHeight / 2)) :
            (this.parent.chartRowsModule.taskBarMarginTop + (this.parent.chartRowsModule.taskBarHeight / 2))) + 1;
    }

    /**
     * To connector line object collection.
     * @return {void}
     * @private
     */
    public createConnectorLineObject(parentGanttData: IGanttData, childGanttData: IGanttData, predecessor: IPredecessor):
        IConnectorLineObject {
        let connectorObj: IConnectorLineObject = {} as IConnectorLineObject;
        let updatedRecords: IGanttData[] = this.parent.getExpandedRecords(this.parent.currentViewData);
        let parentIndex: number = updatedRecords.indexOf(parentGanttData);
        let childIndex: number = updatedRecords.indexOf(childGanttData);
        let parentGanttRecord: ITaskData = parentGanttData.ganttProperties;
        let childGanttRecord: ITaskData = childGanttData.ganttProperties;
        let count: number = 0;
        let index: number = 0;

        if (parentIndex === -1 || childIndex === -1) {
            return null;
        } else {
            connectorObj.parentLeft = parentGanttRecord.isMilestone ?
                parentGanttRecord.left - (this.parent.chartRowsModule.milestoneHeight / 2) : parentGanttRecord.left;
            connectorObj.childLeft = childGanttRecord.isMilestone ?
                childGanttRecord.left - (this.parent.chartRowsModule.milestoneHeight / 2) : childGanttRecord.left;
            connectorObj.parentWidth = parentGanttRecord.width === 0 || parentGanttRecord.isMilestone ?
                (Math.floor(this.parent.chartRowsModule.milestoneHeight)) : parentGanttRecord.width;
            connectorObj.childWidth = childGanttRecord.width === 0 || childGanttRecord.isMilestone ?
                (Math.floor(this.parent.chartRowsModule.milestoneHeight)) : childGanttRecord.width;
            connectorObj.parentIndex = parentIndex;
            connectorObj.childIndex = childIndex;
            connectorObj.rowHeight = this.parent.rowHeight;
            connectorObj.type = predecessor.type;
            connectorObj.connectorLineId = 'parent' + parentGanttRecord.taskId + 'child' + childGanttRecord.taskId;
            connectorObj.milestoneParent = parentGanttRecord.isMilestone ? true : false;
            connectorObj.milestoneChild = childGanttRecord.isMilestone ? true : false;
            if (isNullOrUndefined(isScheduledTask(parentGanttRecord)) || isNullOrUndefined(isScheduledTask(childGanttRecord))) {
                return null;
            } else {
                return connectorObj;
            }
        }
    }

    /**
     * To render connector line.
     * @return {void}
     * @private
     */
    public renderConnectorLines(connectorLinesCollection: IConnectorLineObject[]): void {
        let connectorLineContainer: NodeList;
        let connectorLine: string = '';
        for (let index: number = 0; index < connectorLinesCollection.length; index++) {
            connectorLine = connectorLine + this.getConnectorLineTemplate(connectorLinesCollection[index]);
        }
        this.dependencyViewContainer.innerHTML = connectorLine;
        this.parent.ganttChartModule.scrollElement.appendChild(this.dependencyViewContainer);
    }

    /**
     * To get parent position.
     * @return {void}
     * @private
     */
    /* tslint:disable-next-line:max-func-body-length */
    private getParentPosition(data: IConnectorLineObject): string {
        if (data.parentIndex < data.childIndex) {
            if (data.type === 'FF') {
                if ((data.childLeft + data.childWidth) >= (data.parentLeft + data.parentWidth)) {
                    return 'FFType2';
                } else {
                    return 'FFType1';
                }
            } else if ((data.parentLeft < data.childLeft) && (data.childLeft > (data.parentLeft + data.parentWidth + 25))) {
                if (data.type === 'FS') {
                    return 'FSType1';
                }
                if (data.type === 'SF') {
                    return 'SFType1';
                } else if (data.type === 'SS') {
                    return 'SSType2';
                } else if (data.type === 'FF') {
                    return 'FFType2';
                }
            } else if ((data.parentLeft < data.childLeft && (data.childLeft < (data.parentLeft + data.parentWidth)))
                || (data.parentLeft === data.childLeft || data.parentLeft > data.childLeft)) {
                if (data.parentLeft > (data.childLeft + data.childWidth + 25)) {
                    if (data.type === 'SF') {
                        return 'SFType2';
                    }
                }
                if (data.parentLeft > data.childLeft) {
                    if (data.type === 'SS') {
                        return 'SSType1';
                    }
                    if (data.type === 'SF') {
                        return 'SFType1';
                    }
                    if (data.type === 'FF') {
                        return 'FFType1';
                    }
                } else if ((data.childLeft + data.childWidth) > (data.parentLeft + data.parentWidth)) {
                    if (data.type === 'FF') {
                        return 'FFType2';
                    }
                }
                if (data.type === 'FS') {
                    return 'FSType2';
                } else if (data.type === 'SS') {
                    return 'SSType2';
                } else if (data.type === 'FF') {
                    return 'FFType1';
                } else if (data.type === 'SF') {
                    return 'SFType1';
                }
            } else if ((data.parentLeft) < data.childLeft) {

                if (data.type === 'FS') {
                    return 'FSType2';
                } else if (data.type === 'FF') {
                    return 'FFType2';
                } else if (data.type === 'SS') {
                    return 'SSType2';
                } else if (data.type === 'SF') {
                    return 'SFType1';
                }
            }
        } else if (data.parentIndex > data.childIndex) {
            if ((data.parentLeft < data.childLeft) && (data.childLeft > (data.parentLeft + data.parentWidth))) {
                if (data.type === 'FS') {
                    if (30 >= (data.childLeft - (data.milestoneParent ?
                        (data.parentLeft + data.parentWidth + 4) : (data.parentLeft + data.parentWidth)))) {
                        return 'FSType3';
                    } else {
                        return 'FSType4';
                    }
                }
                if (data.parentLeft < data.childLeft || ((data.childLeft + data.childWidth) > (data.parentLeft + data.parentWidth))) {
                    if (data.type === 'SS') {
                        return 'SSType4';
                    }
                    if (data.type === 'FF') {
                        return 'FFType4';
                    }
                    if (data.type === 'SF') {
                        return 'SFType4';
                    }
                } else if ((data.childLeft + data.childWidth) > (data.parentLeft + data.parentWidth)) {
                    if (data.type === 'FF') {
                        return 'FFType4';
                    }
                }
            } else if ((data.parentLeft < data.childLeft && (data.childLeft < (data.parentLeft + data.parentWidth)))
                || (data.parentLeft === data.childLeft || data.parentLeft > data.childLeft)) {
                if ((data.childLeft + data.childWidth) <= (data.parentLeft + data.parentWidth)) {
                    if (data.type === 'FF') {
                        return 'FFType3';
                    }
                    if (data.type === 'SF') {
                        if ((data.childLeft + data.childWidth + 25) < (data.parentLeft)) {
                            return 'SFType3';
                        } else {
                            return 'SFType4';
                        }
                    }
                    if (data.type === 'SS') {
                        if (data.childLeft <= data.parentLeft) {
                            return 'SSType3';
                        } else {
                            return 'SSType4';
                        }
                    }
                } else if ((data.childLeft + data.childWidth) > (data.parentLeft + data.parentWidth)) {
                    if (data.type === 'FF') {
                        return 'FFType4';
                    }
                    if (data.type === 'SF') {
                        return 'SFType4';
                    }
                    if (data.type === 'SS') {
                        if (data.childLeft <= data.parentLeft) {
                            return 'SSType3';
                        } else {
                            return 'SSType4';
                        }
                    }
                }
                if (data.type === 'FS') {
                    return 'FSType3';
                }
            } else if (data.parentLeft < data.childLeft) {
                if (data.type === 'FS') {
                    return 'FSType3';
                }
                if (data.type === 'SS') {
                    return 'SSType4';
                }
                if (data.type === 'FF') {
                    return 'FFType4';
                }
                if (data.type === 'SF') {
                    return 'SFType4';
                }
            }
        }
        return null;
    }

    /**
     * To get line height.
     * @return {void}
     * @private
     */
    private getHeightValue(data: IConnectorLineObject): number {
        return (data.parentIndex * data.rowHeight) > (data.childIndex * data.rowHeight) ?
            ((data.parentIndex * data.rowHeight) - (data.childIndex * data.rowHeight)) :
            ((data.childIndex * data.rowHeight) - (data.parentIndex * data.rowHeight));
    }

    /**
     * To get sstype2 inner element width.
     * @return {void}
     * @private
     */
    private getInnerElementWidthSSType2(data: IConnectorLineObject): number {
        if (data.parentLeft === data.childLeft) {
            return 10;
        }
        return (data.childLeft - data.parentLeft);
    }

    /**
     * To get sstype2 inner element left.
     * @return {void}
     * @private
     */
    private getInnerElementLeftSSType2(data: IConnectorLineObject): number {
        if (data.parentLeft === data.childLeft) {
            return (data.parentLeft - 20);
        }
        return (data.parentLeft - 10);
    }

    /**
     * To get sstype2 inner child element width.
     * @return {void}
     * @private
     */
    private getInnerChildWidthSSType2(data: IConnectorLineObject): number {
        if ((data.parentLeft + data.parentWidth) < data.childLeft) {
            return 10;
        }
        if (data.parentLeft === data.childLeft) {
            return 20;
        }
        if ((data.parentLeft + data.parentWidth) >= data.childLeft) {
            return 10;
        }
        return (data.childLeft - data.parentLeft);
    }

    private getBorderStyles(cssType: string, unit: number): string {
        let borderWidth: string = 'border-' + cssType + '-width:' + unit + 'px;';
        let borderStyle: string = 'border-' + cssType + '-style:solid;';
        let borderColor: string = !isNullOrUndefined(this.lineColor) ? 'border-' + cssType + '-color:' + this.lineColor + ';' : '';
        return (borderWidth + borderStyle + borderColor);
    }

    /**
     * To get connector line template.
     * @return {void}
     * @private
     */
    /* tslint:disable-next-line:max-func-body-length */
    public getConnectorLineTemplate(data: IConnectorLineObject): string {

        let setInnerChildWidthSSType2: number = this.getInnerChildWidthSSType2(data);
        let setInnerElementWidthSSType2: number = this.getInnerElementWidthSSType2(data);
        let setInnerElementLeftSSType2: number = this.getInnerElementLeftSSType2(data);
        let heightValue: number = this.getHeightValue(data);
        let isMilestoneParent: boolean = data.milestoneParent ? true : false;
        let isMilestone: boolean = data.milestoneChild ? true : false;
        let connectorContainer: string = '';
        if (this.getParentPosition(data)) {
            connectorContainer = '<div id="ConnectorLine' + data.connectorLineId + '" style="background-color=black">';
            let div: string = '<div class="' + cls.connectorLineContainer +
                '" tabindex="-1" aria-label="' + this.generateAriaLabel(data) + '" style="';
            let eLine: string = '<div class="' + cls.connectorLine + '" style="' +
                (!isNullOrUndefined(this.lineColor) ? 'outline-color:' + this.lineColor + ';' : '');
            let rightArrow: string = '<div class="' + cls.connectorLineRightArrow + '" style="' +
                (!isNullOrUndefined(this.lineColor) ? 'outline-color:' + this.lineColor + ';' : '');
            let leftArrow: string = '<div class="' + cls.connectorLineLeftArrow + '" style="' +
                (!isNullOrUndefined(this.lineColor) ? 'outline-color:' + this.lineColor + ';' : '');
            let duplicateStingOne: string = leftArrow + (isMilestone ? 'left:0px;' : '') +
                this.getBorderStyles('right', 10) +
                'top:' + (-5 - this.lineStroke + (this.lineStroke - 1)) + 'px;border-bottom-width:' + (5 + this.lineStroke) + 'px;' +
                'border-top-width:' + (5 + this.lineStroke) + 'px;width:0;height:0;position:relative;"></div>';
            let duplicateStingTwo: string = this.getBorderStyles('left', 10) +
                'top:' + (-6) + 'px;border-bottom-width:' + (5 + this.lineStroke) + 'px;' +
                'border-top-width:' + (5 + this.lineStroke) + 'px;width:0;height:0;position:relative;"></div>';
            let duplicateStingThree: string = this.getBorderStyles('top', this.lineStroke) + 'position:relative;"></div>' + eLine +
                'top:' + (- (13 + ((this.lineStroke - 1) * 2))) + 'px;width:0px;' + this.getBorderStyles('left', this.lineStroke) +
                this.getBorderStyles('top', (heightValue - (this.lineStroke - 1))) + 'position:relative;"></div>';
            let duplicateStingFour: string = leftArrow + 'left:' +
                (isMilestone ? (((data.childLeft + data.childWidth) - (data.parentLeft)) + 10) :
                    (((data.childLeft + data.childWidth) - (data.parentLeft)) + 10)) + 'px;' +
                this.getBorderStyles('right', 10);
            let duplicateStingFive: string = 'top:' + (-(6 + (5 + this.lineStroke) + (this.lineStroke / 2))) + 'px;' +
                this.getBorderStyles('top', this.lineStroke) + 'position:relative;"></div>';

            if (this.getParentPosition(data) === 'FSType1') {
                div = div + 'left:' + (data.parentLeft + data.parentWidth) + 'px;top:' +
                    ((data.parentIndex * data.rowHeight) + this.getTaskbarMidpoint(isMilestone) - (this.lineStroke - 1)) + 'px;' +
                    'width:1px;height:' + heightValue + 'px;position:absolute" data-connectortype="FSType1">';

                div = div + eLine;
                div = div + 'left:' + (isMilestoneParent ? -1 : 0) + 'px;width:' + (isMilestoneParent ?
                    ((((data.childLeft - (data.parentLeft + data.parentWidth + 10)) + this.lineStroke) - 10) + 1) :
                    (((data.childLeft - (data.parentLeft + data.parentWidth + 10)) + this.lineStroke) - 10)) + 'px;' +
                    this.getBorderStyles('top', this.lineStroke) + 'position:relative;"></div>';

                div = div + eLine;
                div = div + 'left:' + (((data.childLeft - (data.parentLeft + data.parentWidth + 10))) - 10) + 'px;' +
                    'width:0px;' + this.getBorderStyles('right', this.lineStroke) +
                    this.getBorderStyles('top', (heightValue - this.lineStroke)) + 'position:relative;"></div>';

                div = div + eLine;
                div = div + 'left:' + (((data.childLeft - (data.parentLeft + data.parentWidth + 10))) - 10) + 'px;width:10px;' +
                    this.getBorderStyles('top', this.lineStroke) + 'position:relative;"></div>';

                div = div + rightArrow;
                div = div + 'left:' + (data.childLeft - (data.parentLeft + data.parentWidth + 10)) + 'px;' +
                    this.getBorderStyles('left', 10) + 'top:' + (-6 - this.lineStroke) + 'px;border-bottom-width:' + (5 + this.lineStroke) +
                    'px;border-top-width:' + (5 + this.lineStroke) + 'px;width:0;height:0;position:relative;"></div></div>';
            }


            if (this.getParentPosition(data) === 'FSType2') {
                div = div + 'left:' + data.parentLeft + 'px;top:' + ((data.parentIndex * data.rowHeight) +
                    this.getTaskbarMidpoint(isMilestone) - (this.lineStroke - 1)) + 'px;' +
                    'width:1px;height:' + heightValue + 'px;position:absolute" data-connectortype="FSType2">';

                div = div + eLine;
                div = div + 'left:' + (isMilestoneParent ? data.parentWidth - 1 : data.parentWidth) + 'px;width:' +
                    (isMilestoneParent ? 11 : 10) + 'px;' +
                    this.getBorderStyles('top', this.lineStroke) + 'position:relative;"></div>';

                div = div + eLine;
                div = div + 'left:' + (data.parentWidth + 10 - this.lineStroke) + 'px;' +
                    this.getBorderStyles('left', this.lineStroke) + 'width:0px;' +
                    this.getBorderStyles(
                        'top', (heightValue - this.getconnectorLineGap(data) - this.lineStroke)) + 'position:relative;"></div>';

                div = div + eLine;
                div = div + 'left:' + (data.parentWidth - (((data.parentLeft + data.parentWidth) - data.childLeft) + 20)) + 'px;' +
                    'width:' + (((data.parentLeft + data.parentWidth) - data.childLeft) + 30) + 'px;' +
                    this.getBorderStyles('top', this.lineStroke) + 'position:relative;"></div>';

                div = div + eLine;
                div = div + 'left:' + (data.parentWidth - (((data.parentLeft +
                    data.parentWidth) - data.childLeft) + 20)) + 'px;width:0px;' +
                    this.getBorderStyles('top', (this.getconnectorLineGap(data) - this.lineStroke)) +
                    this.getBorderStyles('left', this.lineStroke) + 'position:relative;"></div>';

                div = div + eLine;
                div = div + 'left:' + (data.parentWidth - (((data.parentLeft +
                    data.parentWidth) - data.childLeft) + 20)) + 'px;width:10px;' +
                    this.getBorderStyles('top', this.lineStroke) + 'position:relative;"></div>';

                div = div + rightArrow;
                div = div + 'left:' + (data.parentWidth - (((data.parentLeft + data.parentWidth) - data.childLeft) + 10)) + 'px;' +
                    this.getBorderStyles('left', 10) + 'border-bottom-width:' + (5 + this.lineStroke) + 'px;' +
                    'border-top-width:' + (5 + this.lineStroke) + 'px;top:' + (-6 - this.lineStroke) +
                    'px;width:0;height:0;position:relative;"></div></div>';
            }

            if (this.getParentPosition(data) === 'FSType3') {
                div = div + 'left:' + (data.childLeft - 20) + 'px;top:' +
                    ((data.childIndex * data.rowHeight) + this.getTaskbarMidpoint(isMilestoneParent) - (this.lineStroke - 1)) + 'px;' +
                    'width:1px;height:' + heightValue + 'px;position:absolute" data-connectortype="FSType3">';

                div = div + rightArrow;
                div = div + 'left:10px;' + this.getBorderStyles('left', 10) +
                    'border-bottom-width:' + (5 + this.lineStroke) + 'px;border-top-width:' + (5 + this.lineStroke) + 'px;' +
                    'top:' + (-6) + 'px;width:0;height:0;position:relative;"></div>';

                div = div + eLine;
                div = div + 'width:10px;' + this.getBorderStyles('top', this.lineStroke) +
                    'position:relative;top:' + (-(6 + (5 + this.lineStroke) + Math.round(this.lineStroke / 2))) + 'px;"></div>';

                div = div + eLine;
                div = div + 'width:' + this.lineStroke + 'px;' + this.getBorderStyles(
                    'top', (heightValue - this.getconnectorLineGap(data) - this.lineStroke + 1)) +
                    'position:relative;top:' + (- (13 + ((this.lineStroke - 1) * 2))) + 'px;"></div>';

                div = div + eLine;
                div = div + 'width:' + (((data.parentLeft + data.parentWidth) - data.childLeft) + 30) + 'px;' +
                    this.getBorderStyles('top', this.lineStroke) + 'position:relative;top:' +
                    (- (13 + ((this.lineStroke - 1) * 2))) + 'px;"></div>';

                div = div + eLine;
                div = div + 'left:' + (((data.parentLeft + data.parentWidth) - data.childLeft) + (30 - this.lineStroke)) +
                    'px;width:0px;' + 'height:' + (this.getconnectorLineGap(data) - this.lineStroke) + 'px;' +
                    this.getBorderStyles('left', this.lineStroke) + 'position:relative;' +
                    'top:' + (- (13 + ((this.lineStroke - 1) * 2))) + 'px;"></div>';

                div = div + eLine;
                div = div + (isMilestoneParent ? 'left:' + (((data.parentLeft +
                    data.parentWidth) - data.childLeft) + (18 - this.lineStroke)) + 'px;width:' + (12 + this.lineStroke) + 'px;' : 'left:' +
                    (((data.parentLeft + data.parentWidth) - data.childLeft) + 20) + 'px;width:10px;') +
                    this.getBorderStyles('top', this.lineStroke) + 'position:relative;top:' +
                    (- (13 + ((this.lineStroke - 1) * 2))) + 'px;"></div></div>';
            }

            if (this.getParentPosition(data) === 'FSType4') {
                div = div + 'left:' + (data.parentLeft + data.parentWidth) + 'px;top:' +
                    ((data.childIndex * data.rowHeight) + this.getTaskbarMidpoint(isMilestone) - (this.lineStroke - 1)) + 'px;' +
                    'width:1px;height:' + heightValue + 'px;position:absolute" data-connectortype="FSType4">';

                div = div + rightArrow;
                div = div + 'left:' + (data.childLeft - (data.parentLeft + data.parentWidth + 10)) + 'px;' +
                    this.getBorderStyles('left', 10) + 'top:' + (-6) + 'px;' +
                    'border-bottom-width:' + (5 + this.lineStroke) + 'px;border-top-width:' +
                    (5 + this.lineStroke) + 'px;width:0;height:0;position:relative;"></div>';

                div = div + eLine;
                div = div + 'left:' + (data.childLeft - (data.parentLeft + data.parentWidth) - 20) +
                    'px;top:' + (-(6 + (5 + this.lineStroke) + Math.round(this.lineStroke / 2))) + 'px;width:10px;' +
                    this.getBorderStyles('top', this.lineStroke) +
                    'position:relative;"></div>';

                div = div + eLine;
                div = div + 'top:' + (- (13 + ((this.lineStroke - 1) * 2))) + 'px;left:' +
                    (data.childLeft - (data.parentLeft + data.parentWidth) - 20) + 'px;width:0px;' +
                    this.getBorderStyles('left', this.lineStroke) +
                    this.getBorderStyles('top', (heightValue - this.lineStroke + 1)) + 'position:relative;"></div>';

                div = div + eLine;
                div = div + (isMilestoneParent ? 'left:-1px;' : '') + 'top:' +
                    (- (13 + ((this.lineStroke - 1) * 2))) + 'px;width:' +
                    (isMilestoneParent ? ((data.childLeft - (data.parentLeft + data.parentWidth + 20) + 1) + this.lineStroke) :
                        ((data.childLeft - (data.parentLeft + data.parentWidth + 20)) + this.lineStroke)) + 'px;' +
                    this.getBorderStyles('top', this.lineStroke) + 'position:relative;"></div></div>';
            }

            if (this.getParentPosition(data) === 'SSType4') {
                div = div + 'left:' + (data.parentLeft - 10) + 'px;top:' +
                    ((data.childIndex * data.rowHeight) + this.getTaskbarMidpoint(isMilestone) - (this.lineStroke - 1)) + 'px;' +
                    'width:1px;height:' + heightValue + 'px;position:absolute" data-connectortype="SSType4">';

                div = div + rightArrow;
                div = div + 'left:' + (data.childLeft - data.parentLeft) + 'px;' + duplicateStingTwo;

                div = div + eLine;
                div = div + 'top:' + (-(6 + (5 + this.lineStroke) + (this.lineStroke / 2))) + 'px;width:' +
                    (data.childLeft - data.parentLeft) + 'px;' + duplicateStingThree;

                div = div + eLine;
                div = div + 'top:' + (- (13 + ((this.lineStroke - 1) * 2))) + 'px;width:10px;' +
                    this.getBorderStyles('top', this.lineStroke) + 'position:relative;"></div></div>';
            }

            if (this.getParentPosition(data) === 'SSType3') {
                div = div + 'left:' + (data.childLeft - 20) + 'px;top:' +
                    ((data.childIndex * data.rowHeight) + this.getTaskbarMidpoint(isMilestone) - (this.lineStroke - 1)) + 'px;' +
                    'width:1px;height:' + heightValue + 'px;position:absolute" data-connectortype="SSType3">';

                div = div + rightArrow;
                div = div + 'left:10px;' + duplicateStingTwo;

                div = div + eLine;
                div = div + 'top:' + (-(6 + (5 + this.lineStroke) + (this.lineStroke / 2))) + 'px;width:10px;' + duplicateStingThree;

                div = div + eLine;
                div = div + 'top:' + (- (13 + ((this.lineStroke - 1) * 2))) + 'px;width:' +
                    (data.parentLeft - data.childLeft + 21) + 'px;' +
                    this.getBorderStyles('top', this.lineStroke) + 'position:relative;"></div></div>';
            }

            if (this.getParentPosition(data) === 'SSType2') {
                div = div + 'left:' + setInnerElementLeftSSType2 + 'px;top:' +
                    ((data.parentIndex * data.rowHeight) + this.getTaskbarMidpoint(isMilestoneParent) - (this.lineStroke - 1)) + 'px;' +
                    'width:1px;height:' + heightValue + 'px;position:absolute" data-connectortype="SSType2">';

                div = div + eLine;
                div = div + 'width:' + (setInnerChildWidthSSType2 + 1) + 'px;' +
                    this.getBorderStyles('top', this.lineStroke) + 'position:relative;"></div>';

                div = div + eLine;
                div = div + 'width:0px;' + this.getBorderStyles('left', this.lineStroke) +
                    this.getBorderStyles('top', (heightValue - this.lineStroke)) + 'position:relative;"></div>';

                div = div + eLine;
                div = div + 'width:' + setInnerElementWidthSSType2 + 'px;' +
                    this.getBorderStyles('top', this.lineStroke) + 'position:relative;"></div>';

                div = div + rightArrow;
                div = div + 'left:' + setInnerElementWidthSSType2 + 'px;' +
                    this.getBorderStyles('left', 10) + 'top:' + (-6 - this.lineStroke) + 'px;' +
                    'border-bottom-width:' + (5 + this.lineStroke) + 'px;border-top-width:' +
                    (5 + this.lineStroke) + 'px;width:0;' +
                    'height:0;position:relative;"></div></div>';
            }

            if (this.getParentPosition(data) === 'SSType1') {
                div = div + 'left:' + (data.childLeft - 20) + 'px;top:' + ((data.parentIndex * data.rowHeight) +
                    this.getTaskbarMidpoint(isMilestoneParent) - (this.lineStroke - 1)) + 'px;' +
                    'width:1px;height:' + heightValue + 'px;position:absolute" data-connectortype="SSType1">';

                div = div + eLine;
                div = div + 'width:' + (data.parentLeft - data.childLeft + 21) + 'px;' +
                    this.getBorderStyles('top', this.lineStroke) + 'position:relative;"></div>';

                div = div + eLine;
                div = div + 'width:0px;' + this.getBorderStyles('left', this.lineStroke) +
                    this.getBorderStyles('top', (heightValue - this.lineStroke)) + 'position:relative;"></div>';

                div = div + eLine;
                div = div + 'width:10px;' + this.getBorderStyles('top', this.lineStroke) + 'position:relative;"></div>';

                div = div + rightArrow;
                div = div + 'left:10px;' + this.getBorderStyles('left', 10) +
                    'top:' + (-6 - this.lineStroke) + 'px;border-bottom-width:' + (5 + this.lineStroke) + 'px;' +
                    'border-top-width:' + (5 + this.lineStroke) + 'px;width:0;height:0;position:relative;"></div></div>';
            }

            if (this.getParentPosition(data) === 'FFType1') {
                div = div + 'left:' + (data.childLeft + data.childWidth) + 'px;top:' +
                    ((data.parentIndex * data.rowHeight) + this.getTaskbarMidpoint(isMilestoneParent) - (this.lineStroke - 1)) + 'px;' +
                    'width:1px;height:' + heightValue + 'px;position:absolute" data-connectortype="FFType1">';

                div = div + eLine;
                div = div + 'left:' + (isMilestoneParent ? (((data.parentLeft + data.parentWidth) -
                    (data.childLeft + data.childWidth)) - 1) : (((data.parentLeft + data.parentWidth) -
                        (data.childLeft + data.childWidth)))) + 'px;' +
                    'width:' + (isMilestoneParent ? (21 + this.lineStroke) : (20 + this.lineStroke)) + 'px;' +
                    this.getBorderStyles('top', this.lineStroke) + 'position:relative;"></div>';

                div = div + eLine;
                div = div + 'left:' + (isMilestoneParent ? (((data.parentLeft + data.parentWidth) -
                    (data.childLeft + data.childWidth)) + 20) : (((data.parentLeft + data.parentWidth) -
                        (data.childLeft + data.childWidth)) + 20)) + 'px;width:0px;' + this.getBorderStyles('left', this.lineStroke) +
                    this.getBorderStyles('top', (heightValue - this.lineStroke)) + 'position:relative;"></div>';

                div = div + eLine;
                div = div + 'left:' + (isMilestone ? 4 : 10) + 'px;width:' + (isMilestone ?
                    (((data.parentLeft + data.parentWidth) - (data.childLeft + data.childWidth)) + (16 + this.lineStroke)) :
                    (((data.parentLeft + data.parentWidth) - (data.childLeft + data.childWidth)) + (10 + this.lineStroke))) + 'px;' +
                    this.getBorderStyles('top', this.lineStroke) + 'position:relative;"></div>';

                div = div + leftArrow;
                div = div + (isMilestone ? 'left:0px;' : '') + this.getBorderStyles('right', 10) +
                    'top:' + (-6 - this.lineStroke) + 'px;border-bottom-width:' + (5 + this.lineStroke) + 'px;' +
                    'border-top-width:' + (5 + this.lineStroke) + 'px;width:0;height:0;position:relative;"></div></div>';
            }

            if (this.getParentPosition(data) === 'FFType2') {
                div = div + 'left:' + (data.parentLeft + data.parentWidth) + 'px;top:' +
                    ((data.parentIndex * data.rowHeight) + this.getTaskbarMidpoint(isMilestoneParent) - (this.lineStroke - 1)) + 'px;' +
                    'width:1px;height:' + heightValue + 'px;position:absolute" data-connectortype="FFType2">';

                div = div + eLine;
                div = div + (isMilestoneParent ? 'left:-1px;' : '') + 'width:' +
                    (isMilestoneParent ? (((data.childLeft + data.childWidth) - (data.parentLeft + data.parentWidth)) +
                        (21 + this.lineStroke)) : (((data.childLeft + data.childWidth) -
                            (data.parentLeft + data.parentWidth)) + (20 + this.lineStroke))) + 'px;' +
                    this.getBorderStyles('top', this.lineStroke) + 'position:relative;"></div>';

                div = div + eLine;
                div = div + 'left:' + (((data.childLeft + data.childWidth) - (data.parentLeft + data.parentWidth)) + 20) +
                    'px;width:0px;' + this.getBorderStyles('left', this.lineStroke) +
                    this.getBorderStyles('top', (heightValue - this.lineStroke)) +
                    'position:relative;"></div>';

                div = div + eLine;
                div = div + 'left:' + (isMilestone ? (((data.childLeft + data.childWidth) - (data.parentLeft + data.parentWidth)) + 4) :
                    (((data.childLeft + data.childWidth) - (data.parentLeft + data.parentWidth)) + 10)) + 'px;' +
                    'width:' + (isMilestone ? (16 + this.lineStroke) : (10 + this.lineStroke)) + 'px;' +
                    this.getBorderStyles('top', this.lineStroke) + 'position:relative;"></div>';

                div = div + leftArrow;
                div = div + 'left:' + (isMilestone ? (((data.childLeft + data.childWidth) - (data.parentLeft + data.parentWidth))) :
                    (((data.childLeft + data.childWidth) - (data.parentLeft + data.parentWidth)))) + 'px;' +
                    this.getBorderStyles('right', 10) + 'top:' + (-6 - this.lineStroke) + 'px;' +
                    'border-bottom-width:' + (5 + this.lineStroke) + 'px;border-top-width:' + (5 + this.lineStroke) +
                    'px;width:0;height:0;position:relative;"></div></div>';
            }

            if (this.getParentPosition(data) === 'FFType3') {
                div = div + 'left:' + (data.childLeft + data.childWidth) + 'px;top:' +
                    ((data.childIndex * data.rowHeight) + this.getTaskbarMidpoint(isMilestone) - (this.lineStroke - 1)) + 'px;' +
                    'width:1px;height:' + heightValue + 'px;position:absolute" data-connectortype="FFType3">';

                div = div + duplicateStingOne;

                div = div + eLine;
                div = div + (isMilestone ? ('left:4px;width:' +
                    (((data.parentLeft + data.parentWidth) - (data.childLeft + data.childWidth)) + 16)) :
                    ('left:10px;width:' + (((data.parentLeft + data.parentWidth) -
                        (data.childLeft + data.childWidth)) + 10))) + 'px;top:' + (-(6 + (5 + this.lineStroke) +
                            (this.lineStroke / 2))) + 'px;' + this.getBorderStyles('top', this.lineStroke) + 'position:relative;"></div>';

                div = div + eLine;
                div = div + 'left:' + (((data.parentLeft + data.parentWidth) - (data.childLeft + data.childWidth)) + 20) +
                    'px;top:' + (- (13 + ((this.lineStroke - 1) * 2))) + 'px;' +
                    'width:0px;' + this.getBorderStyles('left', this.lineStroke) +
                    this.getBorderStyles('top', (heightValue - this.lineStroke + 1)) + 'position:relative;"></div>';

                div = div + eLine;
                div = div + (isMilestoneParent ? ('left:' + (((data.parentLeft + data.parentWidth) -
                    (data.childLeft + data.childWidth)) - 1) + 'px;width:21') : ('left:' + (((data.parentLeft + data.parentWidth) -
                        (data.childLeft + data.childWidth))) + 'px;width:20')) +
                    'px;top:' + (- (13 + ((this.lineStroke - 1) * 2))) + 'px;' +
                    this.getBorderStyles('top', this.lineStroke) + 'position:relative;"></div></div>';
            }

            if (this.getParentPosition(data) === 'FFType4') {
                div = div + 'left:' + (data.parentLeft + data.parentWidth) + 'px;top:' +
                    ((data.childIndex * data.rowHeight) + this.getTaskbarMidpoint(isMilestone) - (this.lineStroke - 1)) + 'px;' +
                    'width:1px;height:' + heightValue + 'px;position:absolute" data-connectortype="FFType4">';

                div = div + leftArrow;
                div = div + (isMilestone ? ('left:' + ((data.childLeft + data.childWidth) -
                    (data.parentLeft + data.parentWidth))) :
                    ('left:' + (((data.childLeft + data.childWidth) - (data.parentLeft + data.parentWidth))))) + 'px;' +
                    this.getBorderStyles('right', 10) + 'top:' + (-5 - this.lineStroke + (this.lineStroke - 1)) + 'px;' +
                    'border-bottom-width:' + (5 + this.lineStroke) +
                    'px;border-top-width:' + (5 + this.lineStroke) + 'px;width:0;height:0;' +
                    'position:relative;"></div>';

                div = div + eLine;
                div = div + (isMilestone ? ('left:' + (((data.childLeft + data.childWidth) -
                    (data.parentLeft + data.parentWidth)) + 4) +
                    'px;width:' + (16 + this.lineStroke)) : ('left:' + (((data.childLeft + data.childWidth) -
                        (data.parentLeft + data.parentWidth)) + 10) + 'px;width:' + (10 + this.lineStroke))) +
                    'px;' + duplicateStingFive;

                div = div + eLine;
                div = div + 'left:' + (((data.childLeft + data.childWidth) -
                    (data.parentLeft + data.parentWidth)) + 20) + 'px;top:' + (- (13 + ((this.lineStroke - 1) * 2))) +
                    'px;width:0px;' + this.getBorderStyles('left', this.lineStroke) +
                    this.getBorderStyles('top', (heightValue - this.lineStroke + 1)) + 'position:relative;"></div>';

                div = div + eLine;
                div = div + (isMilestoneParent ? ('left:-1px;width:' + (((data.childLeft + data.childWidth) -
                    (data.parentLeft + data.parentWidth)) + (21 + this.lineStroke))) : ('width:' + (((data.childLeft + data.childWidth) -
                        (data.parentLeft + data.parentWidth)) + (20 + this.lineStroke)))) + 'px;top:' +
                    (- (13 + ((this.lineStroke - 1) * 2))) + 'px;' +
                    this.getBorderStyles('top', this.lineStroke) + 'position:relative;"></div></div>';
            }

            if (this.getParentPosition(data) === 'SFType4') {
                div = div + 'left:' + (data.parentLeft - 10) + 'px;top:' +
                    ((data.childIndex * data.rowHeight) + this.getTaskbarMidpoint(isMilestone) - (this.lineStroke - 1)) + 'px;width:1px;' +
                    'height:' + heightValue + 'px;position:absolute" data-connectortype="SFType4">';

                div = div + duplicateStingFour + 'top:' + (-5 - this.lineStroke + (this.lineStroke - 1)) + 'px;' +
                    'border-bottom-width:' + (5 + this.lineStroke) +
                    'px;border-top-width:' + (5 + this.lineStroke) + 'px;width:0;height:0;' +
                    'position:relative;"></div>';

                div = div + eLine;
                div = div + 'left:' + (isMilestone ? ((((data.childLeft + data.childWidth) - (data.parentLeft)) + (14 + this.lineStroke)) +
                    'px;width:16') : ((((data.childLeft + data.childWidth) - (data.parentLeft)) + 20) + 'px;width:' +
                        (10 + this.lineStroke))) + 'px;' + duplicateStingFive;

                div = div + eLine;
                div = div + 'left:' + (((data.childLeft + data.childWidth) - (data.parentLeft)) + 30) + 'px;top:' +
                    (- (13 + ((this.lineStroke - 1) * 2))) + 'px;width:0px;' + this.getBorderStyles('left', this.lineStroke) +
                    this.getBorderStyles(
                        'top', (heightValue - this.getconnectorLineGap(data) - (this.lineStroke - 1))) + 'position:relative;"></div>';

                div = div + eLine;
                div = div + 'top:' + (- (13 + ((this.lineStroke - 1) * 2))) + 'px;width:' +
                    (((data.childLeft + data.childWidth) - (data.parentLeft)) + (30 + this.lineStroke)) + 'px;' +
                    this.getBorderStyles('top', this.lineStroke) + 'position:relative;"></div>';

                div = div + eLine;
                div = div + 'top:' + (- (13 + ((this.lineStroke - 1) * 2))) + 'px;width:0px;' +
                    this.getBorderStyles('left', this.lineStroke) +
                    this.getBorderStyles('top', (this.getconnectorLineGap(data) - this.lineStroke)) + 'position:relative;"></div>';

                div = div + eLine;
                div = div + 'top:' + (- (13 + ((this.lineStroke - 1) * 2))) + 'px;width:11px;' +
                    this.getBorderStyles('top', this.lineStroke) + 'position:relative;"></div></div>';
            }

            if (this.getParentPosition(data) === 'SFType3') {
                div = div + 'left:' + (data.childLeft + data.childWidth) + 'px;top:' +
                    ((data.childIndex * data.rowHeight) + this.getTaskbarMidpoint(isMilestone) - (this.lineStroke - 1)) + 'px;' +
                    'width:1px;height:' + heightValue + 'px;position:absolute" data-connectortype="SFType3">';

                div = div + duplicateStingOne;

                div = div + eLine;
                div = div + (isMilestone ? 'left:4px;width:' + (16 + this.lineStroke) : 'left:10px;width:' +
                    (10 + this.lineStroke)) + 'px;top:' + (-(13 + ((this.lineStroke - 1) * 2) - 1)) + 'px;' +
                    this.getBorderStyles('top', this.lineStroke) + 'position:relative;"></div>';

                div = div + eLine;
                div = div + 'left:20px;top:' + (-(13 + ((this.lineStroke - 1) * 2))) + 'px;width:0px;' +
                    this.getBorderStyles('left', this.lineStroke) +
                    this.getBorderStyles('top', (heightValue - (this.lineStroke - 1))) + 'position:relative;"></div>';

                div = div + eLine;
                div = div + 'left:20px;top:' + (-(13 + ((this.lineStroke - 1) * 2))) + 'px;width:' +
                    ((data.parentLeft - (data.childLeft + data.childWidth + 20)) + this.lineStroke) + 'px;' +
                    this.getBorderStyles('top', this.lineStroke) + 'position:relative;"></div></div>';
            }

            if (this.getParentPosition(data) === 'SFType1') {
                div = div + 'left:' + (data.parentLeft - 10) + 'px;top:' +
                    ((data.parentIndex * data.rowHeight) + this.getTaskbarMidpoint(isMilestone) - (this.lineStroke - 1)) + 'px;' +
                    'width:1px;height:' + heightValue + 'px;position:absolute" data-connectortype="SFType1">';

                div = div + eLine;
                div = div + 'width:11px;' + this.getBorderStyles('top', this.lineStroke) + 'position:relative;"></div>';

                div = div + eLine;
                div = div + 'width:0px;' + this.getBorderStyles('left', this.lineStroke) +
                    this.getBorderStyles(
                        'top', (heightValue - this.getconnectorLineGap(data) - this.lineStroke)) + 'position:relative;"></div>';

                div = div + eLine;
                div = div + 'width:' + (((data.childLeft + data.childWidth) - (data.parentLeft)) + (30 + this.lineStroke)) + 'px;' +
                    this.getBorderStyles('top', this.lineStroke) + 'position:relative;"></div>';

                div = div + eLine;
                div = div + 'left:' + (((data.childLeft + data.childWidth) - (data.parentLeft)) + 30) +
                    'px;width:0px;' + this.getBorderStyles('left', this.lineStroke) +
                    this.getBorderStyles('top', (this.getconnectorLineGap(data) - this.lineStroke)) + 'position:relative;"></div>';

                div = div + eLine;
                div = div + (isMilestone ? ('left:' + (((data.childLeft + data.childWidth) -
                    (data.parentLeft)) + 15) + 'px;width:' + (15 + this.lineStroke)) : ('left:' +
                        (((data.childLeft + data.childWidth) - (data.parentLeft)) + 20) + 'px;width:' + (10 + this.lineStroke))) + 'px;' +
                    this.getBorderStyles('top', this.lineStroke) + 'position:relative;"></div>';

                div = div + duplicateStingFour + 'top:' + (-6 - this.lineStroke) + 'px;' +
                    'border-bottom-width:' + (5 + this.lineStroke) + 'px;border-top-width:' +
                    (5 + this.lineStroke) + 'px;position:relative;"></div></div>';
            }

            if (this.getParentPosition(data) === 'SFType2') {
                div = div + 'left:' + (data.childLeft + data.childWidth) + 'px;top:' +
                    ((data.parentIndex * data.rowHeight) + this.getTaskbarMidpoint(isMilestoneParent) - (this.lineStroke - 1)) + 'px;' +
                    'width:1px;height:' + heightValue + 'px;position:absolute" data-connectortype="SFType2">';

                div = div + eLine;
                div = div + 'left:' + (((data.parentLeft) - (data.childLeft + data.childWidth)) - 10) +
                    'px;width:11px;' + this.getBorderStyles('top', this.lineStroke) + 'position:relative;"></div>';

                div = div + eLine;
                div = div + 'left:' + (((data.parentLeft) - (data.childLeft + data.childWidth)) - 10) +
                    'px;width:0px;' + this.getBorderStyles('left', this.lineStroke) +
                    this.getBorderStyles('top', (heightValue - this.lineStroke)) + 'position:relative;"></div>';

                div = div + eLine;
                div = div + (isMilestone ? ('left:4px;width:' + (((data.parentLeft) - (data.childLeft + data.childWidth))
                    - (14 - this.lineStroke))) : ('left:10px;width:' + (((data.parentLeft) -
                        (data.childLeft + data.childWidth)) - (20 - this.lineStroke)))) +
                    'px;' + this.getBorderStyles('top', this.lineStroke) + 'position:relative;"></div>';

                div = div + leftArrow;
                div = div + 'left:0px;' + this.getBorderStyles('right', 10) +
                    'top:' + (-6 - this.lineStroke) + 'px;border-bottom-width:' + (5 + this.lineStroke) +
                    'px;border-top-width:' + (5 + this.lineStroke) + 'px;width:0;height:0;position:relative;"></div></div>';
            }

            connectorContainer += div;
            connectorContainer += '</div>';
        }
        return connectorContainer;
    }
    /**
     * @private
     */
    public createConnectorLineTooltipTable(): void {
        this.tooltipTable = createElement(
            'table', { className: '.e-tooltiptable', styles: 'margin-top:0px', attrs: { 'cellspacing': '2px', 'cellpadding': '2px' } });
        let tooltipBody: HTMLElement = createElement('tbody');
        tooltipBody.innerHTML = '';
        this.tooltipTable.appendChild(tooltipBody);
    }
    /**
     * @param fromTaskName 
     * @param fromPredecessorText 
     * @param toTaskName 
     * @param toPredecessorText 
     * @private
     */
    public getConnectorLineTooltipInnerTd(
        fromTaskName: string, fromPredecessorText: string, toTaskName?: string, toPredecessorText?: string): string {
        let innerTd: string = '<tr  id="fromPredecessor"><td >' + this.parent.localeObj.getConstant('from') + '</td><td> ';
        innerTd = innerTd + fromTaskName + ' </td><td> ' + this.parent.localeObj.getConstant(fromPredecessorText) + ' </td> </tr>';
        innerTd = innerTd + '<tr id="toPredecessor"><td>' + this.parent.localeObj.getConstant('to') + '</td><td> ' + toTaskName;
        innerTd = innerTd + ' </td><td> ' + this.parent.localeObj.getConstant(toPredecessorText) + ' </td></tr></tbody><table>';
        return innerTd;
    }
    /**
     * Generate aria-label for connectorline
     */
    private generateAriaLabel(data: IConnectorLineObject): string {
        let type: string = data.type;
        let updatedRecords: IGanttData[] = this.parent.getExpandedRecords(this.parent.currentViewData);
        let fromName: string = updatedRecords[data.parentIndex].ganttProperties.taskName;
        let toName: string = updatedRecords[data.childIndex].ganttProperties.taskName;
        let start: string = this.parent.localeObj.getConstant('start');
        let finish: string = this.parent.localeObj.getConstant('finish');
        let value: string = '';
        if (type === 'FS') {
            value = fromName + ' ' + finish + ' to ' + toName + ' ' + start;
        } else if (type === 'FF') {
            value = fromName + ' ' + finish + ' to ' + toName + ' ' + finish;
        } else if (type === 'SS') {
            value = fromName + ' ' + start + ' to ' + toName + ' ' + start;
        } else {
            value = fromName + ' ' + start + ' to ' + toName + ' ' + finish;
        }
        return value;
    }
}