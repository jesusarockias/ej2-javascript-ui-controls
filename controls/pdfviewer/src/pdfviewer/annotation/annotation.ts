import {
    // tslint:disable-next-line:max-line-length
    PdfViewer, PdfViewerBase, AnnotationType, IShapeAnnotation, ITextMarkupAnnotation, TextMarkupAnnotation, ShapeAnnotation,
    StampAnnotation, StickyNotesAnnotation, IPopupAnnotation, ICommentsCollection, MeasureAnnotation
} from '../index';
import { createElement, Browser, isNullOrUndefined } from '@syncfusion/ej2-base';
import { NumericTextBox, Slider, ColorPicker, ColorPickerEventArgs, ChangeEventArgs } from '@syncfusion/ej2-inputs';
import { Dialog } from '@syncfusion/ej2-popups';
import { DropDownButton, MenuEventArgs } from '@syncfusion/ej2-splitbuttons';
import { DecoratorShapes, PointModel } from '@syncfusion/ej2-drawings';
import { isLineShapes, cloneObject } from '../../diagram/drawing-util';
import { PdfAnnotationBaseModel } from '../../diagram/pdf-annotation-model';
import { NodeDrawingTool, LineTool, MoveTool, ResizeTool, ConnectTool } from '../../diagram/tools';
import { updateDistanceLabel, updateRadiusLabel } from '../../diagram/connector-util';
import { AnnotationPropertiesChangeEventArgs, ISize } from '../base';

/**
 * @hidden
 */
export interface IActionElements {
    pageIndex: number;
    index: number;
    // tslint:disable-next-line
    annotation: any;
    action: string;
    // tslint:disable-next-line
    undoElement: any;
    // tslint:disable-next-line
    redoElement: any;
    // tslint:disable-next-line
    duplicate?: any;
    modifiedProperty: string;
}

/**
 * @hidden
 */
export interface IPoint {
    x: number;
    y: number;
}

/**
 * @hidden
 */
export interface IPageAnnotations {
    pageIndex: number;
    // tslint:disable-next-line
    annotations: any[];
}

/**
 * The `Annotation` module is used to handle annotation actions of PDF viewer.
 */
export class Annotation {
    private pdfViewer: PdfViewer;
    private pdfViewerBase: PdfViewerBase;
    /**
     * @private
     */
    public textMarkupAnnotationModule: TextMarkupAnnotation;
    /**
     * @private
     */
    public shapeAnnotationModule: ShapeAnnotation;
    /**
     * @private
     */
    public measureAnnotationModule: MeasureAnnotation;
    /**
     * @private
     */
    public stampAnnotationModule: StampAnnotation;
    /**
     * @private
     */
    public stickyNotesAnnotationModule: StickyNotesAnnotation;
    private popupNote: HTMLElement;
    private popupNoteAuthor: HTMLElement;
    private popupNoteContent: HTMLElement;
    private popupElement: HTMLElement;
    private authorPopupElement: HTMLElement;
    private noteContentElement: HTMLElement;
    private modifiedDateElement: HTMLElement;
    private opacityIndicator: HTMLElement;
    private startArrowDropDown: DropDownButton;
    private endArrowDropDown: DropDownButton;
    private lineStyleDropDown: DropDownButton;
    private thicknessBox: NumericTextBox;
    private leaderLengthBox: NumericTextBox;
    private fillColorPicker: ColorPicker;
    private strokeColorPicker: ColorPicker;
    private fillDropDown: DropDownButton;
    private strokeDropDown: DropDownButton;
    private opacitySlider: Slider;
    private propertiesDialog: Dialog;
    private currentAnnotPageNumber: number;
    private clientX: number;
    private clientY: number;
    private isPopupMenuMoved: boolean;
    private selectedLineStyle: string;
    private selectedLineDashArray: string;
    private isUndoRedoAction: boolean = false;
    private isUndoAction: boolean = false;
    /**
     * @private
     */
    public isShapeCopied: boolean = false;
    /**
     * @private
     */
    public actionCollection: IActionElements[] = [];
    /**
     * @private
     */
    public redoCollection: IActionElements[] = [];
    /**
     * @private
     */
    public isPopupNoteVisible: boolean = false;
    /**
     * @private
     */
    public undoCommentsElement: IPopupAnnotation[] = [];
    /**
     * @private
     */
    public redoCommentsElement: IPopupAnnotation[] = [];

    /**
     * @private
     */
    constructor(pdfViewer: PdfViewer, viewerBase: PdfViewerBase) {
        this.pdfViewer = pdfViewer;
        this.pdfViewerBase = viewerBase;
        if (this.pdfViewer.enableTextMarkupAnnotation) {
            this.textMarkupAnnotationModule = new TextMarkupAnnotation(this.pdfViewer, this.pdfViewerBase);
        }
        if (this.pdfViewer.enableShapeAnnotation) {
            this.shapeAnnotationModule = new ShapeAnnotation(this.pdfViewer, this.pdfViewerBase);
        }
        if (this.pdfViewer.enableMeasureAnnotation) {
            this.measureAnnotationModule = new MeasureAnnotation(this.pdfViewer, this.pdfViewerBase);
        }
        this.stampAnnotationModule = new StampAnnotation(this.pdfViewer, this.pdfViewerBase);
        this.stickyNotesAnnotationModule = new StickyNotesAnnotation(this.pdfViewer, this.pdfViewerBase);
    }

    /**
     * Set annotation type to be added in next user interaction in PDF Document.
     * @param type 
     * @returns void
     */
    public setAnnotationMode(type: AnnotationType): void {
        if (type === 'None') {
            this.clearAnnotationMode();
        } else if (type === 'Highlight' || type === 'Strikethrough' || type === 'Underline') {
            if (this.textMarkupAnnotationModule) {
                this.textMarkupAnnotationModule.drawTextMarkupAnnotations(type.toString());
            }
        } else if (type === 'Line' || type === 'Arrow' || type === 'Rectangle' || type === 'Circle' || type === 'Polygon') {
            if (this.shapeAnnotationModule) {
                this.shapeAnnotationModule.setAnnotationType(type);
            }
        } else if (type === 'Distance' || type === 'Perimeter' || type === 'Area' || type === 'Radius' || type === 'Volume') {
            if (this.measureAnnotationModule) {
                this.measureAnnotationModule.setAnnotationType(type);
            }
        }
    }

    private clearAnnotationMode(): void {
        if (this.textMarkupAnnotationModule) {
            this.textMarkupAnnotationModule.isTextMarkupAnnotationMode = false;
        }
    }

    public deleteAnnotation(): void {
        if (this.textMarkupAnnotationModule) {
            this.textMarkupAnnotationModule.deleteTextMarkupAnnotation();
        }
        if (this.pdfViewer.selectedItems.annotations.length !== 0) {
            let pageNumber: number = this.pdfViewer.selectedItems.annotations[0].pageIndex;
            // tslint:disable-next-line
            let shapeType: any = this.pdfViewer.selectedItems.annotations[0].shapeAnnotationType;
            // tslint:disable-next-line
            let undoElement: any;
            if (shapeType === 'Line' || shapeType === 'LineWidthArrowHead' || shapeType === 'Polygon' || shapeType === 'Ellipse' || shapeType === 'Rectangle' || shapeType === 'Radius' || shapeType === 'Distance') {
                // tslint:disable-next-line:max-line-length
                if (isNullOrUndefined(this.pdfViewer.selectedItems.annotations[0].measureType) || this.pdfViewer.selectedItems.annotations[0].measureType === '') {
                    this.pdfViewer.annotation.stickyNotesAnnotationModule.findPosition(this.pdfViewer.selectedItems.annotations[0], 'shape');
                } else {
                    // tslint:disable-next-line:max-line-length
                    this.pdfViewer.annotation.stickyNotesAnnotationModule.findPosition(this.pdfViewer.selectedItems.annotations[0], 'measure');
                }
                undoElement = this.modifyInCollections(this.pdfViewer.selectedItems.annotations[0], 'delete');
            } else {
                undoElement = this.pdfViewer.selectedItems.annotations[0];
                this.pdfViewer.annotation.stickyNotesAnnotationModule.findPosition(undoElement, undoElement.shapeAnnotationType, 'delete');
                // tslint:disable-next-line:max-line-length
                this.pdfViewer.annotation.stampAnnotationModule.updateSessionStorage(this.pdfViewer.selectedItems.annotations[0], null, 'delete');
            }
            // tslint:disable-next-line:max-line-length
            this.pdfViewer.annotation.addAction(pageNumber, null, this.pdfViewer.selectedItems.annotations[0], 'Delete', '', undoElement, this.pdfViewer.selectedItems.annotations[0]);
            // tslint:disable-next-line
            let removeDiv: any;
            if (this.pdfViewer.selectedItems.annotations[0].annotName !== '') {
                removeDiv = document.getElementById(this.pdfViewer.selectedItems.annotations[0].annotName);
            } else {
                if (undoElement) {
                    if (undoElement.annotName !== '') {
                        removeDiv = document.getElementById(undoElement.annotName);
                    }
                }
            }
            if (removeDiv) {
                if (removeDiv.parentElement.childElementCount === 1) {
                    this.stickyNotesAnnotationModule.updateAccordionContainer(removeDiv);
                } else {
                    removeDiv.remove();
                }
            }
            let selectedAnnot: PdfAnnotationBaseModel = this.pdfViewer.selectedItems.annotations[0];
            let annotType: AnnotationType = this.getAnnotationType(selectedAnnot.shapeAnnotationType, selectedAnnot.measureType);
            let index: number = this.getAnnotationIndex(selectedAnnot.pageIndex, selectedAnnot.id);
            this.pdfViewer.remove(this.pdfViewer.selectedItems.annotations[0]);
            this.pdfViewer.renderDrawing();
            this.pdfViewer.clearSelection(pageNumber);
            this.pdfViewerBase.isDocumentEdited = true;
            // tslint:disable-next-line:max-line-length
            this.pdfViewer.fireAnnotationRemove(pageNumber, index, annotType);
            if (this.pdfViewer.textSelectionModule) {
                this.pdfViewer.textSelectionModule.enableTextSelectionMode();
            }
        }
        if (this.pdfViewer.toolbarModule) {
            if (this.pdfViewer.toolbarModule.annotationToolbarModule) {
                this.pdfViewer.toolbarModule.annotationToolbarModule.selectAnnotationDeleteItem(false);
                this.pdfViewer.toolbarModule.annotationToolbarModule.enableTextMarkupAnnotationPropertiesTools(false);
            }
        }
    }

    /**
     * @private
     */
    public getAnnotationType(type: string, measureType: string): AnnotationType {
        let annotType: AnnotationType;
        if (measureType === '' || isNullOrUndefined(measureType)) {
            switch (type) {
                case 'Line':
                    annotType = 'Line';
                    break;
                case 'LineWidthArrowHead':
                    annotType = 'Arrow';
                    break;
                case 'Rectangle':
                    annotType = 'Rectangle';
                    break;
                case 'Ellipse':
                    annotType = 'Circle';
                    break;
                case 'Polygon':
                    annotType = 'Polygon';
                    break;
            }
        } else {
            switch (measureType) {
                case 'Distance':
                    annotType = 'Distance';
                    break;
                case 'Perimeter':
                    annotType = 'Perimeter';
                    break;
                case 'Area':
                    annotType = 'Area';
                    break;
                case 'Radius':
                    annotType = 'Radius';
                    break;
                case 'Volume':
                    annotType = 'Volume';
                    break;
            }
        }
        return annotType;
    }

    /**
     * @private
     */
    public getAnnotationIndex(pageNumber: number, annotationId: string): number {
        let pageAnnotationBases: PdfAnnotationBaseModel[] = this.pdfViewer.drawing.getPageObjects(pageNumber);
        let index: number = null;
        for (let i: number = 0; i < pageAnnotationBases.length; i++) {
            if (pageAnnotationBases[i].id === annotationId) {
                index = i;
                break;
            }
        }
        return index;
    }

    /**
     * @private
     */
    public initializeCollection(): void {
        this.actionCollection = [];
        this.redoCollection = [];
        this.pdfViewerBase.customStampCollection = [];
        if (!this.popupNote) {
            this.createNote();
        }
    }

    /**
     * @private
     */
    public showCommentsPanel(): void {
        let commentPanel: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_commantPanel');
        if (commentPanel) {
            if (commentPanel.style.display === 'none') {
                commentPanel.style.display = 'block';
                let viewerContainer: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_viewerContainer');
                let pageContainer: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_pageViewContainer');
                if (viewerContainer) {
                    if (this.pdfViewer.enableRtl) {
                        viewerContainer.style.left = this.pdfViewerBase.navigationPane.getViewerContainerRight() + 'px';
                    } else {
                        viewerContainer.style.right = this.pdfViewerBase.navigationPane.getViewerContainerRight() + 'px';
                    }
                    // tslint:disable-next-line:max-line-length
                    viewerContainer.style.width = (this.pdfViewer.element.clientWidth - this.pdfViewerBase.navigationPane.getViewerContainerLeft() - this.pdfViewerBase.navigationPane.getViewerContainerRight()) + 'px';
                    pageContainer.style.width = (viewerContainer.offsetWidth - this.pdfViewerBase.navigationPane.getViewerContainerScrollbarWidth()) + 'px';
                }
                this.pdfViewerBase.updateZoomValue();
            }
        }
    }

    /**
     * @private
     */
    // tslint:disable-next-line
    public addAction(
        // tslint:disable-next-line
        pageNumber: number, index: number, annotation: any, actionString: string, property: string, node?: any, redo?: any): void {
        let action: IActionElements = {
            pageIndex: pageNumber, index: index, annotation: annotation,
            action: actionString, modifiedProperty: property, undoElement: node, redoElement: redo
        };
        this.actionCollection.push(action);
        this.updateToolbar();
    }

    /**
     * @private
     */
    public undo(): void {
        let actionObject: IActionElements = this.actionCollection.pop();
        if (actionObject) {
            // tslint:disable-next-line
            let shapeType: any = actionObject.annotation.shapeAnnotationType;
            this.isUndoRedoAction = true;
            this.isUndoAction = true;
            switch (actionObject.action) {
                case 'Text Markup Added':
                case 'Text Markup Deleted':
                    if (this.textMarkupAnnotationModule) {
                        // tslint:disable-next-line:max-line-length
                        this.textMarkupAnnotationModule.undoTextMarkupAction(actionObject.annotation, actionObject.pageIndex, actionObject.index, actionObject.action);
                    }
                    break;
                case 'Text Markup Property modified':
                    if (this.textMarkupAnnotationModule) {
                        // tslint:disable-next-line:max-line-length
                        actionObject.annotation = this.textMarkupAnnotationModule.undoRedoPropertyChange(actionObject.annotation, actionObject.pageIndex, actionObject.index, actionObject.modifiedProperty, true);
                    }
                    break;
                case 'Drag':
                case 'Resize':
                    if (isLineShapes(actionObject.annotation)) {
                        // tslint:disable-next-line:max-line-length
                        this.pdfViewer.nodePropertyChange(actionObject.annotation, { bounds: actionObject.undoElement.bounds, vertexPoints: actionObject.undoElement.vertexPoints, leaderHeight: actionObject.undoElement.leaderHeight });
                    } else {
                        this.pdfViewer.nodePropertyChange(actionObject.annotation, { bounds: actionObject.undoElement.bounds });
                    }
                    // tslint:disable-next-line:max-line-length
                    if (actionObject.annotation.measureType === 'Distance' || actionObject.annotation.measureType === 'Perimeter' || actionObject.annotation.measureType === 'Area' ||
                        actionObject.annotation.measureType === 'Radius' || actionObject.annotation.measureType === 'Volume') {
                        this.pdfViewer.nodePropertyChange(actionObject.annotation, { notes: actionObject.undoElement.notes });
                        this.updateCalibrateValues(actionObject.annotation);
                    }
                    this.pdfViewer.clearSelection(this.pdfViewerBase.activeElements.activePageID);
                    this.pdfViewer.select([actionObject.annotation.id]);
                    // tslint:disable-next-line:max-line-length
                    if (actionObject.annotation.shapeAnnotationType === 'Line' || actionObject.annotation.shapeAnnotationType === 'Rectangle' || actionObject.annotation.shapeAnnotationType === 'Ellipse' || actionObject.annotation.shapeAnnotationType === 'Polygon' || actionObject.annotation.shapeAnnotationType === 'LineWidthArrowHead' ||
                        actionObject.annotation.shapeAnnotationType === 'Radius') {
                        this.modifyInCollections(actionObject.annotation, 'bounds');
                    }
                    break;
                case 'Addition':
                    let isAnnotationUpdate: boolean = false;
                    // tslint:disable-next-line:max-line-length
                    if (shapeType === 'Line' || shapeType === 'LineWidthArrowHead' || shapeType === 'Polygon' || shapeType === 'Ellipse' || shapeType === 'Rectangle' || shapeType === 'Radius' || shapeType === 'Distance') {
                        if (actionObject.annotation.measureType === '' || isNullOrUndefined(actionObject.annotation.measureType)) {
                            this.pdfViewer.annotation.stickyNotesAnnotationModule.findPosition(actionObject.annotation, 'shape');
                        } else {
                            this.pdfViewer.annotation.stickyNotesAnnotationModule.findPosition(actionObject.annotation, 'measure');
                        }
                        isAnnotationUpdate = true;
                        actionObject.duplicate = this.modifyInCollections(actionObject.annotation, 'delete');
                    }
                    if (shapeType === 'Stamp' || shapeType === 'Image') {
                        // tslint:disable-next-line:max-line-length
                        this.pdfViewer.annotation.stickyNotesAnnotationModule.findPosition(actionObject.annotation, actionObject.annotation.shapeAnnotationType, 'delete');
                        // tslint:disable-next-line:max-line-length
                        this.stampAnnotationModule.updateSessionStorage(actionObject.annotation, null, 'delete');
                        isAnnotationUpdate = true;
                    }
                    if (!isAnnotationUpdate) {
                        // tslint:disable-next-line:max-line-length
                        this.pdfViewer.annotation.stickyNotesAnnotationModule.findPosition(actionObject.annotation, actionObject.annotation.shapeAnnotationType, 'delete');
                    }
                    this.pdfViewer.clearSelection(this.pdfViewerBase.activeElements.activePageID);
                    this.pdfViewer.remove(actionObject.annotation);
                    this.pdfViewer.renderDrawing(null, actionObject.annotation.pageIndex);
                    // tslint:disable-next-line
                    let removeDiv: any = document.getElementById(actionObject.annotation.annotName);
                    if (removeDiv) {
                        if (removeDiv.parentElement.childElementCount === 1) {
                            this.stickyNotesAnnotationModule.updateAccordionContainer(removeDiv);
                        } else {
                            removeDiv.remove();
                        }
                    }
                    break;
                case 'Delete':
                    // tslint:disable-next-line:max-line-length
                    if (shapeType === 'Line' || shapeType === 'LineWidthArrowHead' || shapeType === 'Polygon' || shapeType === 'Ellipse' || shapeType === 'Rectangle' || shapeType === 'Radius' || shapeType === 'Distance') {
                        if (actionObject.annotation.measureType === '' || isNullOrUndefined(actionObject.annotation.measureType)) {
                            shapeType = 'shape';
                            this.shapeAnnotationModule.addInCollection(actionObject.annotation.pageIndex, actionObject.undoElement);
                        } else {
                            shapeType = 'shape_measure';
                            this.measureAnnotationModule.addInCollection(actionObject.annotation.pageIndex, actionObject.undoElement);
                        }
                    }
                    if (shapeType === 'Stamp' || shapeType === 'Image') {
                        this.stampAnnotationModule.updateDeleteItems(actionObject.annotation.pageIndex, actionObject.annotation);
                    }
                    this.pdfViewer.add(actionObject.annotation);
                    this.pdfViewer.renderDrawing(null, actionObject.annotation.pageIndex);
                    // tslint:disable-next-line:max-line-length
                    this.pdfViewer.annotationModule.stickyNotesAnnotationModule.addAnnotationComments(actionObject.annotation.pageIndex, shapeType);
                    break;
                case 'stampOpacity':
                    this.pdfViewer.nodePropertyChange(actionObject.annotation, { opacity: actionObject.undoElement.opacity });
                    this.stickyNotesAnnotationModule.updateAnnotationModifiedDate(actionObject.annotation, null, true);
                    actionObject.annotation.modifiedDate = new Date().toLocaleString();
                    break;
                case 'Shape Stroke':
                    this.pdfViewer.nodePropertyChange(actionObject.annotation, { strokeColor: actionObject.undoElement.strokeColor });
                    this.modifyInCollections(actionObject.annotation, 'stroke');
                    this.pdfViewer.renderDrawing();
                    break;
                case 'Shape Fill':
                    this.pdfViewer.nodePropertyChange(actionObject.annotation, { fillColor: actionObject.undoElement.fillColor });
                    this.modifyInCollections(actionObject.annotation, 'fill');
                    this.pdfViewer.renderDrawing();
                    break;
                case 'Shape Opacity':
                    this.pdfViewer.nodePropertyChange(actionObject.annotation, { opacity: actionObject.undoElement.opacity });
                    if (actionObject.annotation.shapeAnnotationType === 'StickyNotes') {
                        this.stickyNotesAnnotationModule.updateOpacityValue(actionObject.annotation);
                        this.stickyNotesAnnotationModule.updateAnnotationModifiedDate(actionObject.annotation, null, true);
                        actionObject.annotation.modifiedDate = new Date().toLocaleString();
                    } else {
                        this.modifyInCollections(actionObject.annotation, 'opacity');
                    }
                    this.pdfViewer.renderDrawing();
                    break;
                case 'Shape Thickness':
                    this.pdfViewer.nodePropertyChange(actionObject.annotation, { thickness: actionObject.undoElement.thickness });
                    this.modifyInCollections(actionObject.annotation, 'thickness');
                    this.pdfViewer.renderDrawing();
                    break;
                case 'Line properties change':
                    this.pdfViewer.nodePropertyChange(actionObject.annotation, {
                        // tslint:disable-next-line:max-line-length
                        fillColor: actionObject.undoElement.fillColor, borderDashArray: actionObject.undoElement.borderDashArray, borderStyle: actionObject.undoElement.borderStyle,
                        // tslint:disable-next-line:max-line-length
                        strokeColor: actionObject.undoElement.strokeColor, opacity: actionObject.undoElement.opacity, thickness: actionObject.undoElement.thickness,
                        sourceDecoraterShapes: this.getArrowType(actionObject.undoElement.lineHeadStart), taregetDecoraterShapes: this.getArrowType(actionObject.undoElement.lineHeadEnd)
                    });
                    this.updateCollectionForLineProperty(actionObject.annotation);
                    this.pdfViewer.renderDrawing();
                    break;
                case 'Text Property Added':
                    // tslint:disable-next-line:max-line-length
                    actionObject.annotation = this.pdfViewer.annotationModule.stickyNotesAnnotationModule.undoAction(actionObject.annotation, actionObject.action, actionObject.undoElement);
                    this.stickyNotesAnnotationModule.updateAnnotationModifiedDate(actionObject.annotation, null, true);
                    actionObject.annotation.modifiedDate = new Date().toLocaleString();
                    break;
                case 'Comments Property Added':
                    // tslint:disable-next-line:max-line-length
                    actionObject.annotation = this.pdfViewer.annotationModule.stickyNotesAnnotationModule.undoAction(actionObject.annotation, actionObject.action, actionObject.undoElement);
                    break;
                case 'Status Property Added':
                    // tslint:disable-next-line:max-line-length
                    actionObject.annotation = this.pdfViewer.annotationModule.stickyNotesAnnotationModule.undoAction(actionObject.annotation, actionObject.action, actionObject.undoElement);
                    break;
                case 'Comments Reply Deleted':
                    // tslint:disable-next-line:max-line-length
                    actionObject.annotation = this.pdfViewer.annotationModule.stickyNotesAnnotationModule.undoAction(actionObject.annotation, actionObject.action, actionObject.undoElement);
                    break;
            }
            this.redoCollection.push(actionObject);
            this.updateToolbar();
            this.isUndoRedoAction = false;
            this.isUndoAction = false;
        }
    }

    /**
     * @private
     */
    public redo(): void {
        let actionObject: IActionElements = this.redoCollection.pop();
        if (actionObject) {
            // tslint:disable-next-line
            let shapeType: any = actionObject.annotation.shapeAnnotationType;
            this.isUndoRedoAction = true;
            switch (actionObject.action) {
                case 'Text Markup Property modified':
                    if (this.textMarkupAnnotationModule) {
                        // tslint:disable-next-line:max-line-length
                        actionObject.annotation = this.textMarkupAnnotationModule.undoRedoPropertyChange(actionObject.annotation, actionObject.pageIndex, actionObject.index, actionObject.modifiedProperty);
                    }
                    break;
                case 'Text Markup Added':
                case 'Text Markup Deleted':
                    if (this.textMarkupAnnotationModule) {
                        // tslint:disable-next-line:max-line-length
                        this.textMarkupAnnotationModule.redoTextMarkupAction(actionObject.annotation, actionObject.pageIndex, actionObject.index, actionObject.action);
                    }
                    break;
                case 'Drag':
                case 'Resize':
                    if (isLineShapes(actionObject.annotation)) {
                        this.pdfViewer.nodePropertyChange(
                            // tslint:disable-next-line:max-line-length
                            actionObject.annotation, { bounds: actionObject.redoElement.bounds, vertexPoints: actionObject.redoElement.vertexPoints, leaderHeight: actionObject.redoElement.leaderHeight });

                    } else {
                        this.pdfViewer.nodePropertyChange(actionObject.annotation, { bounds: actionObject.redoElement.bounds });
                    }
                    // tslint:disable-next-line:max-line-length
                    if (actionObject.annotation.measureType === 'Distance' || actionObject.annotation.measureType === 'Perimeter' || actionObject.annotation.measureType === 'Area' ||
                        actionObject.annotation.measureType === 'Radius' || actionObject.annotation.measureType === 'Volume') {
                        this.pdfViewer.nodePropertyChange(actionObject.annotation, { notes: actionObject.redoElement.notes });
                        this.updateCalibrateValues(actionObject.annotation);
                    }
                    this.pdfViewer.clearSelection(this.pdfViewerBase.activeElements.activePageID);
                    this.pdfViewer.select([actionObject.annotation.id]);
                    // tslint:disable-next-line:max-line-length
                    if (actionObject.annotation.shapeAnnotationType === 'Line' || actionObject.annotation.shapeAnnotationType === 'Rectangle' || actionObject.annotation.shapeAnnotationType === 'Ellipse' || actionObject.annotation.shapeAnnotationType === 'Polygon' || actionObject.annotation.shapeAnnotationType === 'LineWidthArrowHead'
                        || actionObject.annotation.shapeAnnotationType === 'Radius') {
                        this.modifyInCollections(actionObject.annotation, 'bounds');
                    }
                    break;
                case 'Addition':
                    // tslint:disable-next-line:max-line-length
                    if (shapeType === 'Line' || shapeType === 'LineWidthArrowHead' || shapeType === 'Polygon' || shapeType === 'Ellipse' || shapeType === 'Rectangle' || shapeType === 'Radius' || shapeType === 'Distance') {
                        if (actionObject.annotation.measureType === '' || isNullOrUndefined(actionObject.annotation.measureType)) {
                            shapeType = 'shape';
                            this.shapeAnnotationModule.addInCollection(actionObject.annotation.pageIndex, actionObject.duplicate);
                        } else {
                            shapeType = 'shape_measure';
                            this.measureAnnotationModule.addInCollection(actionObject.annotation.pageIndex, actionObject.duplicate);
                        }
                    }
                    if (shapeType === 'Stamp') {
                        this.stampAnnotationModule.updateDeleteItems(actionObject.annotation.pageIndex, actionObject.redoElement);
                    }
                    this.pdfViewer.add(actionObject.annotation);
                    this.pdfViewer.renderDrawing(null, actionObject.annotation.pageIndex);
                    // tslint:disable-next-line:max-line-length
                    this.pdfViewer.annotationModule.stickyNotesAnnotationModule.addAnnotationComments(actionObject.annotation.pageIndex, shapeType);
                    break;
                case 'Delete':
                    let isUpdate: boolean = false;
                    let sType: string = actionObject.annotation.shapeAnnotationType;
                    // tslint:disable-next-line:max-line-length
                    if (shapeType === 'Line' || shapeType === 'LineWidthArrowHead' || shapeType === 'Polygon' || shapeType === 'Ellipse' || shapeType === 'Rectangle' || shapeType === 'Radius' || shapeType === 'Distance') {
                        if (actionObject.annotation.measureType === '' || isNullOrUndefined(actionObject.annotation.measureType)) {
                            sType = 'shape';
                        } else {
                            sType = 'measure';
                        }
                        // tslint:disable-next-line:max-line-length
                        this.pdfViewer.annotation.stickyNotesAnnotationModule.findPosition(actionObject.annotation, sType, 'delete');
                        this.modifyInCollections(actionObject.annotation, 'delete');
                        isUpdate = true;
                    }
                    if (shapeType === 'Stamp') {
                        // tslint:disable-next-line:max-line-length
                        this.pdfViewer.annotation.stickyNotesAnnotationModule.findPosition(actionObject.annotation, sType, 'delete');
                        this.stampAnnotationModule.updateSessionStorage(actionObject.annotation, null, 'delete');
                        isUpdate = true;
                    }
                    if (!isUpdate) {
                        // tslint:disable-next-line:max-line-length
                        this.pdfViewer.annotation.stickyNotesAnnotationModule.findPosition(actionObject.annotation, sType, 'delete');
                    }
                    this.pdfViewer.clearSelection(actionObject.annotation.pageIndex);
                    this.pdfViewer.remove(actionObject.annotation);
                    this.pdfViewer.renderDrawing(null, actionObject.annotation.pageIndex);
                    // tslint:disable-next-line
                    let removeDiv: any = document.getElementById(actionObject.annotation.annotName);
                    if (removeDiv) {
                        if (removeDiv.parentElement.childElementCount === 1) {
                            this.stickyNotesAnnotationModule.updateAccordionContainer(removeDiv);
                        } else {
                            removeDiv.remove();
                        }
                    }
                    break;
                case 'stampOpacity':
                    this.pdfViewer.nodePropertyChange(actionObject.annotation, { opacity: actionObject.redoElement.opacity });
                    this.stickyNotesAnnotationModule.updateAnnotationModifiedDate(actionObject.annotation, null, true);
                    break;
                case 'Shape Stroke':
                    this.pdfViewer.nodePropertyChange(actionObject.annotation, { strokeColor: actionObject.redoElement.strokeColor });
                    this.modifyInCollections(actionObject.annotation, 'stroke');
                    this.pdfViewer.renderDrawing();
                    break;
                case 'Shape Fill':
                    this.pdfViewer.nodePropertyChange(actionObject.annotation, { fillColor: actionObject.redoElement.fillColor });
                    this.modifyInCollections(actionObject.annotation, 'fill');
                    this.pdfViewer.renderDrawing();
                    break;
                case 'Shape Opacity':
                    this.pdfViewer.nodePropertyChange(actionObject.annotation, { opacity: actionObject.redoElement.opacity });
                    if (actionObject.annotation.shapeAnnotationType === 'StickyNotes') {
                        this.stickyNotesAnnotationModule.updateOpacityValue(actionObject.annotation);
                        this.stickyNotesAnnotationModule.updateAnnotationModifiedDate(actionObject.annotation, null, true);
                    } else {
                        this.modifyInCollections(actionObject.annotation, 'opacity');
                    }
                    this.pdfViewer.renderDrawing();
                    break;
                case 'Shape Thickness':
                    this.pdfViewer.nodePropertyChange(actionObject.annotation, { thickness: actionObject.redoElement.thickness });
                    this.modifyInCollections(actionObject.annotation, 'thickness');
                    this.pdfViewer.renderDrawing();
                    break;
                case 'Line properties change':
                    this.pdfViewer.nodePropertyChange(actionObject.annotation, {
                        // tslint:disable-next-line:max-line-length
                        fillColor: actionObject.redoElement.fillColor, strokeColor: actionObject.redoElement.strokeColor, opacity: actionObject.redoElement.opacity, thickness: actionObject.redoElement.thickness,
                        sourceDecoraterShapes: this.getArrowType(actionObject.redoElement.lineHeadStart), taregetDecoraterShapes: this.getArrowType(actionObject.redoElement.lineHeadEnd),
                        borderDashArray: actionObject.redoElement.borderDashArray, borderStyle: actionObject.redoElement.borderStyle
                    });
                    this.updateCollectionForLineProperty(actionObject.annotation);
                    this.pdfViewer.renderDrawing();
                    break;
                case 'Text Property Added':
                    // tslint:disable-next-line:max-line-length
                    actionObject.annotation = this.pdfViewer.annotationModule.stickyNotesAnnotationModule.redoAction(actionObject.annotation, actionObject.action, actionObject.undoElement);
                    this.stickyNotesAnnotationModule.updateAnnotationModifiedDate(actionObject.annotation, null, true);
                    break;
                case 'Comments Property Added':
                    // tslint:disable-next-line:max-line-length
                    actionObject.annotation = this.pdfViewer.annotationModule.stickyNotesAnnotationModule.redoAction(actionObject.annotation, actionObject.action, actionObject.undoElement);
                    break;
                case 'Status Property Added':
                    // tslint:disable-next-line:max-line-length
                    actionObject.annotation = this.pdfViewer.annotationModule.stickyNotesAnnotationModule.redoAction(actionObject.annotation, actionObject.action);
                    break;
                case 'Comments Reply Deleted':
                    // tslint:disable-next-line:max-line-length
                    actionObject.annotation = this.pdfViewer.annotationModule.stickyNotesAnnotationModule.redoAction(actionObject.annotation, actionObject.action);
                    break;
            }
            if (actionObject.redoElement && actionObject.redoElement.modifiedDate !== undefined) {
                actionObject.annotation.modifiedDate = actionObject.redoElement.modifiedDate;
            }
            this.actionCollection.push(actionObject);
            this.updateToolbar();
            this.isUndoRedoAction = false;
        }
    }

    private updateCollectionForLineProperty(pdfAnnotationBase: PdfAnnotationBaseModel): void {
        this.modifyInCollections(pdfAnnotationBase, 'fill');
        this.modifyInCollections(pdfAnnotationBase, 'stroke');
        this.modifyInCollections(pdfAnnotationBase, 'opacity');
        this.modifyInCollections(pdfAnnotationBase, 'thickness');
        this.modifyInCollections(pdfAnnotationBase, 'dashArray');
        this.modifyInCollections(pdfAnnotationBase, 'startArrow');
        this.modifyInCollections(pdfAnnotationBase, 'endArrow');
    }

    private updateToolbar(): void {
        if (this.pdfViewer.toolbarModule) {
            this.pdfViewer.toolbarModule.updateUndoRedoButtons();
        }
    }

    private createNote(): void {
        // tslint:disable-next-line:max-line-length
        this.popupNote = createElement('div', { id: this.pdfViewer.element.id + '_annotation_note', className: 'e-pv-annotation-note', styles: 'display:none' });
        this.popupNoteAuthor = createElement('div', { id: this.pdfViewer.element.id + '_annotation_note_author', className: 'e-pv-annotation-note-author' });
        this.popupNote.appendChild(this.popupNoteAuthor);
        // tslint:disable-next-line:max-line-length
        this.popupNoteContent = createElement('div', { id: this.pdfViewer.element.id + '_annotation_note_content', className: 'e-pv-annotation-note-content' });
        this.popupNote.appendChild(this.popupNoteContent);
        this.pdfViewerBase.mainContainer.appendChild(this.popupNote);
    }

    /**
     * @private
     */
    // tslint:disable-next-line
    public showPopupNote(event: any, color: string, author: string, note: string, type: string): void {
        let mainContainerPosition: ClientRect = this.pdfViewerBase.mainContainer.getBoundingClientRect();
        let popupNoteClientRect: ClientRect = this.popupNote.getBoundingClientRect();
        if (author) {
            this.popupNoteAuthor.textContent = author;
        }
        this.popupNoteContent.textContent = note;
        if (type === 'Highlight') {
            this.popupNote.style.backgroundColor = 'rgb(237, 232, 177)';
        } else if (type === 'Underline') {
            this.popupNote.style.backgroundColor = 'rgb(187, 241, 191)';
        } else if (type === 'Strikethrough') {
            this.popupNote.style.backgroundColor = 'rgb(242, 188, 207)';
        }
        this.popupNote.style.display = 'block';
        let topPosition: number = (event.pageY - mainContainerPosition.top + 5);
        let leftPosition: number = (event.pageX - mainContainerPosition.left + 5);
        if (leftPosition + popupNoteClientRect.width > mainContainerPosition.width) {
            leftPosition = leftPosition - popupNoteClientRect.width;
        }
        if (topPosition + popupNoteClientRect.height > mainContainerPosition.height) {
            topPosition = topPosition - popupNoteClientRect.height;
        }
        this.popupNote.style.top = topPosition + 'px';
        this.popupNote.style.left = leftPosition + 'px';
    }

    /**
     * @private
     */
    public hidePopupNote(): void {
        this.popupNote.style.display = 'none';
    }

    private createTextMarkupPopup(): void {
        let elementId: string = this.pdfViewer.element.id;
        // tslint:disable-next-line:max-line-length
        this.popupElement = createElement('div', { id: elementId + '_popup_annotation_note', className: 'e-pv-annotation-popup-menu', styles: 'display:none' });
        let headerElement: HTMLElement = createElement('div', { id: elementId + '_popup_header', className: 'e-pv-annotation-popup-header' });
        // tslint:disable-next-line:max-line-length
        this.authorPopupElement = createElement('div', { id: elementId + '_popup_author', className: 'e-pv-annotation-popup-author' });
        headerElement.appendChild(this.authorPopupElement);
        // tslint:disable-next-line:max-line-length
        let closeBtn: HTMLElement = createElement('span', { id: elementId + '_popup_close', className: 'e-pv-annotation-popup-close e-pv-icon' });
        headerElement.appendChild(closeBtn);
        this.popupElement.appendChild(headerElement);
        // tslint:disable-next-line:max-line-length
        this.modifiedDateElement = createElement('div', { id: elementId + '_popup_modified_time', className: 'e-pv-annotation-modified-time' });
        this.popupElement.appendChild(this.modifiedDateElement);
        // tslint:disable-next-line:max-line-length
        let contentContainer: HTMLElement = createElement('div', { id: elementId + '_popup_content_container', className: 'e-pv-annotation-popup-note-container' });
        this.noteContentElement = createElement('div', { id: elementId + '_popup_content', className: 'e-pv-annotation-popup-content' });
        (this.noteContentElement as HTMLDivElement).contentEditable = 'true';
        contentContainer.appendChild(this.noteContentElement);
        this.popupElement.appendChild(contentContainer);
        this.pdfViewerBase.viewerContainer.appendChild(this.popupElement);
        closeBtn.addEventListener('click', this.saveClosePopupMenu.bind(this));
        closeBtn.addEventListener('touchend', this.saveClosePopupMenu.bind(this));
        this.popupElement.addEventListener('mousedown', this.onPopupElementMoveStart.bind(this));
        this.popupElement.addEventListener('mousemove', this.onPopupElementMove.bind(this));
        window.addEventListener('mouseup', this.onPopupElementMoveEnd.bind(this));
        this.popupElement.addEventListener('touchstart', this.onPopupElementMoveStart.bind(this));
        this.popupElement.addEventListener('touchmove', this.onPopupElementMove.bind(this));
        window.addEventListener('touchend', this.onPopupElementMoveEnd.bind(this));
        this.noteContentElement.addEventListener('mousedown', () => { this.noteContentElement.focus(); });
    }

    // tslint:disable-next-line
    private onPopupElementMoveStart(event: any): void {
        if (event.type === 'touchstart') {
            event = event.changedTouches[0];
        }
        if ((event.target.id !== (this.noteContentElement.id) || !(event.target.contains(this.noteContentElement.childNodes[0])))) {
            this.isPopupMenuMoved = true;
            let popupElementClientRect: ClientRect = this.popupElement.getBoundingClientRect();
            this.clientX = event.clientX - popupElementClientRect.left;
            // tslint:disable-next-line:max-line-length
            this.clientY = (event.clientY - popupElementClientRect.top) + (this.pdfViewerBase.pageSize[this.currentAnnotPageNumber].top * this.pdfViewerBase.getZoomFactor());
        }
    }

    // tslint:disable-next-line
    private onPopupElementMove(event: any): void {
        if (event.type === 'touchmove') {
            event = event.changedTouches[0];
        }
        // tslint:disable-next-line:max-line-length
        if (this.isPopupMenuMoved && (event.target.id !== (this.noteContentElement.id) || !(event.target.contains(this.noteContentElement.childNodes[0])))) {
            let left: number = (event.clientX - this.clientX) + parseFloat(this.popupElement.style.left);
            let top: number = ((event.clientY - this.clientY) + parseFloat(this.popupElement.style.top));
            this.clientX = event.clientX;
            this.clientY = event.clientY;
            let clientPosition: ClientRect = this.popupElement.getBoundingClientRect();
            let pageDiv: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_pageDiv_' + this.currentAnnotPageNumber);
            // tslint:disable-next-line:max-line-length
            if (left > parseFloat(pageDiv.style.left) && (left + clientPosition.width) < (parseFloat(pageDiv.style.left) + parseFloat(pageDiv.style.width))) {
                this.popupElement.style.left = (left) + 'px';
            } else {
                this.popupElement.style.left = parseFloat(this.popupElement.style.left) + 'px';
            }
            // tslint:disable-next-line:max-line-length
            if (top > parseFloat(pageDiv.style.top) && (top + clientPosition.height) < (parseFloat(pageDiv.style.top) + parseFloat(pageDiv.style.height))) {
                this.popupElement.style.top = (top) + 'px';
            } else {
                this.popupElement.style.top = parseFloat(this.popupElement.style.top) + 'px';
            }
        }
    }

    private onPopupElementMoveEnd(): void {
        this.isPopupMenuMoved = false;
    }

    private saveClosePopupMenu(): void {
        if (this.textMarkupAnnotationModule) {
            this.textMarkupAnnotationModule.saveNoteContent(this.currentAnnotPageNumber, this.noteContentElement.innerText);
        }
        this.closePopupMenu();
    }

    /**
     * @private
     */
    public closePopupMenu(): void {
        if (this.popupElement) {
            this.popupElement.parentElement.removeChild(this.popupElement);
            this.popupElement = null;
            this.isPopupNoteVisible = false;
        }
    }

    /**
     * @private
     */
    // tslint:disable-next-line
    public showAnnotationPopup(event: any): void {
        if (this.textMarkupAnnotationModule) {
            this.currentAnnotPageNumber = this.getEventPageNumber(event);
            // tslint:disable-next-line:max-line-length
            if (this.textMarkupAnnotationModule && (event.target !== (this.noteContentElement) || (event.target.contains(this.noteContentElement.childNodes[0])))) {
                this.hidePopupNote();
                if (!this.popupElement) {
                    this.createTextMarkupPopup();
                    this.popupElement.style.display = 'block';
                    this.authorPopupElement.textContent = this.textMarkupAnnotationModule.currentTextMarkupAnnotation.author;
                    // tslint:disable-next-line:max-line-length
                    this.modifiedDateElement.textContent = this.getProperDate(this.textMarkupAnnotationModule.currentTextMarkupAnnotation.modifiedDate);
                    this.noteContentElement.textContent = this.textMarkupAnnotationModule.currentTextMarkupAnnotation.note;
                    let clientPosition: ClientRect = this.popupElement.getBoundingClientRect();
                    // tslint:disable-next-line:max-line-length
                    let pageDiv: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_pageDiv_' + this.currentAnnotPageNumber);
                    let canvasPosition: ClientRect = pageDiv.getBoundingClientRect();
                    let topPosition: number = ((event.clientY) - canvasPosition.top) + parseFloat(pageDiv.style.top);
                    let leftPosition: number = (event.clientX);
                    if ((leftPosition + clientPosition.width) > (parseFloat(pageDiv.style.left) + parseFloat(pageDiv.style.width))) {
                        this.popupElement.style.left = (leftPosition - clientPosition.width) + 'px';
                    } else {
                        this.popupElement.style.left = leftPosition + 'px';
                    }
                    if ((topPosition + clientPosition.height) > (parseFloat(pageDiv.style.top) + parseFloat(pageDiv.style.height))) {
                        this.popupElement.style.top = (topPosition - clientPosition.height) + 'px';
                    } else {
                        this.popupElement.style.top = topPosition + 'px';
                    }
                    this.isPopupNoteVisible = true;
                }
            }
        }
    }

    /**
     * @private
     */
    public modifyOpacity(args: ChangeEventArgs): void {
        let currentAnnotation: PdfAnnotationBaseModel = this.pdfViewer.selectedItems.annotations[0];
        let clonedObject: PdfAnnotationBaseModel = cloneObject(currentAnnotation);
        let redoClonedObject: PdfAnnotationBaseModel = cloneObject(currentAnnotation);
        let opacityValue: number = args.value / 100;
        redoClonedObject.opacity = opacityValue;
        this.pdfViewer.nodePropertyChange(currentAnnotation, { opacity: opacityValue });
        this.triggerAnnotationPropChange(currentAnnotation, false, false, false, true);
        // tslint:disable-next-line:max-line-length
        this.pdfViewer.annotation.addAction(currentAnnotation.pageIndex, null, currentAnnotation, 'Shape Opacity', '', clonedObject, redoClonedObject);
        if (currentAnnotation.shapeAnnotationType === 'StickyNotes') {
            this.stickyNotesAnnotationModule.updateOpacityValue(currentAnnotation);
        } else {
            this.modifyInCollections(currentAnnotation, 'opacity');
        }
        this.pdfViewer.renderDrawing();
    }

    /**
     * @private
     */
    public modifyThickness(thicknessValue: number): void {
        let currentAnnotation: PdfAnnotationBaseModel = this.pdfViewer.selectedItems.annotations[0];
        let clonedObject: PdfAnnotationBaseModel = cloneObject(currentAnnotation);
        let redoClonedObject: PdfAnnotationBaseModel = cloneObject(currentAnnotation);
        redoClonedObject.thickness = thicknessValue;
        this.pdfViewer.nodePropertyChange(currentAnnotation, { thickness: thicknessValue });
        this.triggerAnnotationPropChange(currentAnnotation, false, false, true, false);
        // tslint:disable-next-line:max-line-length
        this.pdfViewer.annotation.addAction(currentAnnotation.pageIndex, null, currentAnnotation, 'Shape Thickness', '', clonedObject, redoClonedObject);
        this.modifyInCollections(currentAnnotation, 'thickness');
        this.pdfViewer.renderDrawing();
    }

    /**
     * @private
     */
    public modifyStrokeColor(color: string): void {
        let currentAnnotation: PdfAnnotationBaseModel = this.pdfViewer.selectedItems.annotations[0];
        let clonedObject: PdfAnnotationBaseModel = cloneObject(currentAnnotation);
        let redoClonedObject: PdfAnnotationBaseModel = cloneObject(currentAnnotation);
        redoClonedObject.strokeColor = color;
        this.pdfViewer.nodePropertyChange(currentAnnotation, { strokeColor: color });
        this.triggerAnnotationPropChange(currentAnnotation, false, true, false, false);
        // tslint:disable-next-line:max-line-length
        this.pdfViewer.annotation.addAction(currentAnnotation.pageIndex, null, currentAnnotation, 'Shape Stroke', '', clonedObject, redoClonedObject);
        this.modifyInCollections(currentAnnotation, 'stroke');
        this.pdfViewer.renderDrawing();
    }

    /**
     * @private
     */
    public modifyFillColor(color: string): void {
        let currentAnnotation: PdfAnnotationBaseModel = this.pdfViewer.selectedItems.annotations[0];
        let clonedObject: PdfAnnotationBaseModel = cloneObject(currentAnnotation);
        let redoClonedObject: PdfAnnotationBaseModel = cloneObject(currentAnnotation);
        redoClonedObject.fillColor = color;
        this.pdfViewer.nodePropertyChange(this.pdfViewer.selectedItems.annotations[0], { fillColor: color });
        this.triggerAnnotationPropChange(currentAnnotation, true, false, false, false);
        // tslint:disable-next-line:max-line-length
        this.pdfViewer.annotation.addAction(currentAnnotation.pageIndex, null, currentAnnotation, 'Shape Fill', '', clonedObject, redoClonedObject);
        this.modifyInCollections(currentAnnotation, 'fill');
        this.pdfViewer.renderDrawing();
    }

    // tslint:disable-next-line
    private modifyInCollections(annotationBase: PdfAnnotationBaseModel, property: string): any {
        // tslint:disable-next-line
        let returnObj: any;
        if (annotationBase.measureType === '' || isNullOrUndefined(annotationBase.measureType)) {
            returnObj = this.shapeAnnotationModule.modifyInCollection(property, annotationBase.pageIndex, annotationBase);
        } else if (annotationBase.measureType === 'Distance' || annotationBase.measureType === 'Perimeter' ||
            annotationBase.measureType === 'Radius' || annotationBase.measureType === 'Area' || annotationBase.measureType === 'Volume') {
            returnObj = this.measureAnnotationModule.modifyInCollection(property, annotationBase.pageIndex, annotationBase);
        }
        if (this.isUndoRedoAction) {
            this.stickyNotesAnnotationModule.updateAnnotationModifiedDate(annotationBase, null, true);
            if (this.isUndoAction) {
                annotationBase.modifiedDate = new Date().toLocaleString();
            }
        } else {
            if (property !== 'bounds') {
                this.stickyNotesAnnotationModule.updateAnnotationModifiedDate(annotationBase);
            }
        }
        return returnObj;
    }

    /**
     * @private
     */
    public createPropertiesWindow(): void {
        let elementID: string = this.pdfViewer.element.id;
        let dialogDiv: HTMLElement = createElement('div', { id: elementID + '_properties_window', className: 'e-pv-properties-window' });
        let appearanceTab: HTMLElement = this.createAppearanceTab();
        this.pdfViewerBase.pageContainer.appendChild(dialogDiv);
        this.propertiesDialog = new Dialog({
            showCloseIcon: true, closeOnEscape: false, isModal: true, header: this.pdfViewer.localeObj.getConstant('Line Properties'),
            target: this.pdfViewer.element, content: appearanceTab, close: () => {
                this.destroyPropertiesWindow();
            }
        });
        if (!Browser.isDevice) {
            this.propertiesDialog.buttons = [
                // tslint:disable-next-line:max-line-length
                { buttonModel: { content: this.pdfViewer.localeObj.getConstant('OK'), isPrimary: true }, click: this.onOkClicked.bind(this) },
                { buttonModel: { content: this.pdfViewer.localeObj.getConstant('Cancel') }, click: this.onCancelClicked.bind(this) }
            ];
        } else {
            this.propertiesDialog.buttons = [
                { buttonModel: { content: this.pdfViewer.localeObj.getConstant('Cancel') }, click: this.onCancelClicked.bind(this) },
                // tslint:disable-next-line:max-line-length
                { buttonModel: { content: this.pdfViewer.localeObj.getConstant('OK'), isPrimary: true }, click: this.onOkClicked.bind(this) }
            ];
        }
        if (this.pdfViewer.enableRtl) {
            this.propertiesDialog.enableRtl = true;
        }
        this.propertiesDialog.appendTo(dialogDiv);
        // tslint:disable-next-line:max-line-length
        this.startArrowDropDown.content = this.createContent(this.getArrowString(this.pdfViewer.selectedItems.annotations[0].sourceDecoraterShapes)).outerHTML;
        this.endArrowDropDown.content = this.createContent(this.getArrowString(this.pdfViewer.selectedItems.annotations[0].taregetDecoraterShapes)).outerHTML;
        this.thicknessBox.value = this.pdfViewer.selectedItems.annotations[0].wrapper.children[0].style.strokeWidth;
        this.fillColorPicker.value = this.pdfViewer.selectedItems.annotations[0].wrapper.children[0].style.fill;
        this.refreshColorPicker(this.fillColorPicker);
        this.strokeColorPicker.value = this.pdfViewer.selectedItems.annotations[0].wrapper.children[0].style.strokeColor;
        this.refreshColorPicker(this.strokeColorPicker);
        this.updateColorInIcon(this.fillDropDown.element, this.fillColorPicker.value);
        this.updateColorInIcon(this.strokeDropDown.element, this.strokeColorPicker.value);
        this.opacitySlider.value = this.pdfViewer.selectedItems.annotations[0].wrapper.children[0].style.opacity * 100;
        this.updateOpacityIndicator();
        // tslint:disable-next-line
        if (parseInt(this.pdfViewer.selectedItems.annotations[0].wrapper.children[0].style.strokeDashArray) >= 3) {
            this.lineStyleDropDown.content = this.createDropDownContent('dashed').outerHTML;
        } else if (this.pdfViewer.selectedItems.annotations[0].wrapper.children[0].style.strokeDashArray === '2') {
            this.lineStyleDropDown.content = this.createDropDownContent('dotted').outerHTML;
        } else if (this.pdfViewer.selectedItems.annotations[0].wrapper.children[0].style.strokeDashArray === '0') {
            this.lineStyleDropDown.content = this.createDropDownContent('solid').outerHTML;
        }
        this.selectedLineStyle = this.pdfViewer.selectedItems.annotations[0].borderStyle;
        this.selectedLineDashArray = this.pdfViewer.selectedItems.annotations[0].wrapper.children[0].style.strokeDashArray;
        if (this.pdfViewer.selectedItems.annotations[0].shapeAnnotationType === 'Distance') {
            this.leaderLengthBox.value = this.pdfViewer.selectedItems.annotations[0].leaderHeight;
        }
    }

    private destroyPropertiesWindow(): void {
        if (this.strokeColorPicker) {
            this.strokeColorPicker.destroy();
            this.strokeColorPicker = null;
        }
        if (this.fillColorPicker) {
            this.fillColorPicker.destroy();
            this.fillColorPicker = null;
        }
        if (this.endArrowDropDown) {
            this.endArrowDropDown.destroy();
            this.endArrowDropDown = null;
        }
        if (this.startArrowDropDown) {
            this.startArrowDropDown.destroy();
            this.startArrowDropDown = null;
        }
        if (this.opacitySlider) {
            this.opacitySlider.destroy();
            this.opacitySlider = null;
        }
        if (this.thicknessBox) {
            this.thicknessBox.destroy();
            this.thicknessBox = null;
        }
        if (this.lineStyleDropDown) {
            this.lineStyleDropDown.destroy();
            this.lineStyleDropDown = null;
        }
        if (this.leaderLengthBox) {
            this.leaderLengthBox.destroy();
            this.leaderLengthBox = null;
        }
        if (this.propertiesDialog) {
            this.propertiesDialog.destroy();
            this.propertiesDialog = null;
        }
        let dialogElement: HTMLElement = this.pdfViewerBase.getElement('_properties_window');
        if (dialogElement) {
            dialogElement.parentElement.removeChild(dialogElement);
        }
    }

    private refreshColorPicker(colorPick: ColorPicker): void {
        colorPick.setProperties({ 'value': colorPick.value }, true);
        colorPick.refresh();
    }

    private createAppearanceTab(): HTMLElement {
        let elementID: string = this.pdfViewer.element.id;
        // tslint:disable-next-line:max-line-length
        let items: { [key: string]: Object }[] = [{ text: this.pdfViewer.localeObj.getConstant('None') }, { text: this.pdfViewer.localeObj.getConstant('Open Arrow') }, { text: this.pdfViewer.localeObj.getConstant('Closed Arrow') },
        { text: this.pdfViewer.localeObj.getConstant('Round Arrow') }, { text: this.pdfViewer.localeObj.getConstant('Square Arrow') }, { text: this.pdfViewer.localeObj.getConstant('Diamond Arrow') }];
        // tslint:disable-next-line:max-line-length
        let appearanceDiv: HTMLElement = createElement('div', { id: elementID + '_properties_appearance' });
        let lineStyleContainer: HTMLElement = createElement('div', { className: 'e-pv-properties-line-style-prop' });
        appearanceDiv.appendChild(lineStyleContainer);
        // tslint:disable-next-line:max-line-length
        let lineHeadStartElement: HTMLElement = this.createInputElement(this.pdfViewer.localeObj.getConstant('Start Arrow'), lineStyleContainer, 'text', 'button', true, 'e-pv-properties-line-start', elementID + '_properties_line_start');
        // tslint:disable-next-line:max-line-length
        this.startArrowDropDown = new DropDownButton({ items: items, cssClass: 'e-pv-properties-line-start', select: this.onStartArrowHeadStyleSelect.bind(this) }, (lineHeadStartElement as HTMLButtonElement));
        let lineHeadEndElement: HTMLElement = this.createInputElement(this.pdfViewer.localeObj.getConstant('End Arrow'), lineStyleContainer, 'text', 'button', true, 'e-pv-properties-line-end', elementID + '_properties_line_end');
        // tslint:disable-next-line:max-line-length
        let borderStyleContainer: HTMLElement = createElement('div', { className: 'e-pv-properties-border-style' });
        appearanceDiv.appendChild(borderStyleContainer);
        // tslint:disable-next-line:max-line-length
        this.endArrowDropDown = new DropDownButton({ items: items, cssClass: 'e-pv-properties-line-end', select: this.onEndArrowHeadStyleSelect.bind(this) }, (lineHeadEndElement as HTMLButtonElement));
        let lineStyleElement: HTMLElement = this.createInputElement(this.pdfViewer.localeObj.getConstant('Line Style'), borderStyleContainer, 'text', 'button', true, 'e-pv-properties-line-style', elementID + '_properties_line_style');
        let dropDownTarget: HTMLElement = this.createStyleList();
        // tslint:disable-next-line:max-line-length
        this.lineStyleDropDown = new DropDownButton({ cssClass: 'e-pv-properties-line-style', target: dropDownTarget }, (lineStyleElement as HTMLButtonElement));
        // tslint:disable-next-line:max-line-length
        let thicknessElement: HTMLElement = this.createInputElement(this.pdfViewer.localeObj.getConstant('Line Thickness'), borderStyleContainer, 'text', 'input', true, 'e-pv-properties-line-thickness', elementID + '_properties_thickness');
        this.thicknessBox = new NumericTextBox({ value: 0, format: '## pt', cssClass: 'e-pv-properties-line-thickness', min: 0, max: 12 }, (thicknessElement as HTMLInputElement));
        let colorStyleContainer: HTMLElement = createElement('div', { className: 'e-pv-properties-color-style' });
        appearanceDiv.appendChild(colorStyleContainer);
        // tslint:disable-next-line:max-line-length
        let fillColorElement: HTMLElement = this.createInputElement(this.pdfViewer.localeObj.getConstant('Fill Color'), colorStyleContainer, 'color', 'button', true, 'e-pv-properties-line-fill-color', elementID + '_properties_fill_color');
        this.fillColorPicker = this.createColorPicker(elementID + '_properties_fill_color', true);
        this.fillColorPicker.change = (args: ColorPickerEventArgs) => {
            let currentColor: string = (args.currentValue.hex === '') ? '#ffffff00' : args.currentValue.hex;
            this.fillDropDown.toggle();
            this.updateColorInIcon(this.fillDropDown.element, currentColor);
        };
        // tslint:disable-next-line:max-line-length
        this.fillDropDown = this.createDropDownButton(fillColorElement, 'e-pv-properties-fill-color-icon', this.fillColorPicker.element.parentElement);
        this.fillDropDown.beforeOpen = this.onFillDropDownBeforeOpen.bind(this);
        this.fillDropDown.open = () => { this.fillColorPicker.refresh(); };
        // tslint:disable-next-line:max-line-length
        let strokeColorElement: HTMLElement = this.createInputElement(this.pdfViewer.localeObj.getConstant('Line Color'), colorStyleContainer, 'color', 'button', true, 'e-pv-properties-line-stroke-color', elementID + '_properties_stroke_color');
        this.strokeColorPicker = this.createColorPicker(elementID + '_properties_stroke_color', false);
        this.strokeColorPicker.change = (args: ColorPickerEventArgs) => {
            let currentColor: string = (args.currentValue.hex === '') ? '#ffffff00' : args.currentValue.hex;
            this.strokeDropDown.toggle();
            this.updateColorInIcon(this.strokeDropDown.element, currentColor);
        };
        // tslint:disable-next-line:max-line-length
        this.strokeDropDown = this.createDropDownButton(strokeColorElement, 'e-pv-properties-stroke-color-icon', this.strokeColorPicker.element.parentElement);
        this.strokeDropDown.beforeOpen = this.onStrokeDropDownBeforeOpen.bind(this);
        this.strokeDropDown.open = () => { this.strokeColorPicker.refresh(); };
        let opacityContainer: HTMLElement = createElement('div', { className: 'e-pv-properties-opacity-style' });
        appearanceDiv.appendChild(opacityContainer);
        // tslint:disable-next-line:max-line-length
        let opacityElement: HTMLElement = this.createInputElement(this.pdfViewer.localeObj.getConstant('Opacity'), opacityContainer, '', 'div', true, 'e-pv-properties-line-opacity', elementID + '_properties_opacity');
        this.opacitySlider = new Slider({ type: 'MinRange', max: 100, min: 0, cssClass: 'e-pv-properties-line-opacity', change: () => { this.updateOpacityIndicator(); } }, opacityElement);
        if (this.pdfViewer.selectedItems.annotations[0].shapeAnnotationType === 'Distance') {
            // tslint:disable-next-line:max-line-length
            let lineLengthElement: HTMLElement = this.createInputElement(this.pdfViewer.localeObj.getConstant('Leader Length'), opacityContainer, 'text', 'input', true, 'e-pv-properties-line-leader-length', elementID + '_properties_leader_length');
            this.leaderLengthBox = new NumericTextBox({ value: 0, format: '## pt', cssClass: 'e-pv-properties-line-leader-length', min: 0, max: 100 }, (lineLengthElement as HTMLInputElement));
        }
        return appearanceDiv;
    }

    private createContent(text: string): HTMLElement {
        let divElement: HTMLElement = createElement('div', { className: 'e-pv-properties-line-style-content' });
        divElement.textContent = text;
        return divElement;
    }

    private onStrokeDropDownBeforeOpen(): void {
        if (this.pdfViewer.selectedItems.annotations.length === 1) {
            this.strokeColorPicker.value = this.pdfViewer.selectedItems.annotations[0].wrapper.children[0].style.strokeColor;
        }
        this.strokeColorPicker.refresh();
    }

    private onFillDropDownBeforeOpen(): void {
        if (this.pdfViewer.selectedItems.annotations.length === 1) {
            this.fillColorPicker.value = this.pdfViewer.selectedItems.annotations[0].wrapper.children[0].style.strokeColor;
        }
        this.fillColorPicker.refresh();
    }

    private createStyleList(): HTMLElement {
        let ulElement: HTMLElement = createElement('ul');
        document.body.appendChild(ulElement);
        let solidLi: HTMLElement = this.createListForStyle('solid');
        solidLi.addEventListener('click', () => { this.setThickness('0', 'solid'); });
        ulElement.appendChild(solidLi);
        let dottedLi: HTMLElement = this.createListForStyle('dotted');
        dottedLi.addEventListener('click', () => { this.setThickness('2', 'dotted'); });
        ulElement.appendChild(dottedLi);
        let dashedLi: HTMLElement = this.createListForStyle('dashed');
        dashedLi.addEventListener('click', () => { this.setThickness('3', 'dashed'); });
        ulElement.appendChild(dashedLi);
        return ulElement;
    }

    private createColorPicker(idString: string, isNoColor: boolean): ColorPicker {
        let inputElement: HTMLElement = createElement('input', { id: idString + '_target' });
        document.body.appendChild(inputElement);
        let colorPicker: ColorPicker = new ColorPicker({
            inline: true, mode: 'Palette', enableOpacity: false, value: '#000000', showButtons: false, modeSwitcher: false,
            noColor: isNoColor
        });
        if (this.pdfViewer.enableRtl) {
            colorPicker.enableRtl = true;
        }
        colorPicker.appendTo(inputElement);
        return colorPicker;
    }

    private createDropDownButton(element: HTMLElement, iconClass: string, target: HTMLElement): DropDownButton {
        // tslint:disable-next-line:max-line-length
        let dropDownButton: DropDownButton = new DropDownButton({ iconCss: iconClass + ' e-pv-icon', target: target });
        if (this.pdfViewer.enableRtl) {
            dropDownButton.enableRtl = true;
        }
        dropDownButton.appendTo(element);
        return dropDownButton;
    }

    private updateColorInIcon(element: HTMLElement, color: string): void {
        (element.childNodes[0] as HTMLElement).style.borderBottomColor = color;
    }

    private setThickness(value: string, style: string): void {
        this.lineStyleDropDown.content = this.createDropDownContent(style).outerHTML;
        this.selectedLineDashArray = value;
        if (value === '0') {
            this.selectedLineStyle = 'Solid';
        } else if (value === '2' || value === '3') {
            this.selectedLineStyle = 'Dashed';
        }
    }

    private createDropDownContent(style: string): HTMLElement {
        let divElement: HTMLElement = createElement('div', { className: 'e-pv-line-styles-content-container' });
        // tslint:disable-next-line:max-line-length
        let spanElement: HTMLElement = createElement('span', { className: 'e-pv-line-styles-content', styles: 'border-bottom-style:' + style });
        divElement.appendChild(spanElement);
        return divElement;
    }

    private createListForStyle(style: string): HTMLElement {
        let liElement: HTMLElement = createElement('li', { className: 'e-menu-item' });
        let divElement: HTMLElement = createElement('div', { className: 'e-pv-line-styles-container' });
        // tslint:disable-next-line:max-line-length
        let spanElement: HTMLElement = createElement('span', { className: 'e-pv-line-styles-item', styles: 'border-bottom-style:' + style });
        divElement.appendChild(spanElement);
        liElement.appendChild(divElement);
        return liElement;
    }

    private onStartArrowHeadStyleSelect(args: MenuEventArgs): void {
        this.startArrowDropDown.content = this.createContent(args.item.text).outerHTML;
    }

    private onEndArrowHeadStyleSelect(args: MenuEventArgs): void {
        this.endArrowDropDown.content = this.createContent(args.item.text).outerHTML;
    }

    // tslint:disable-next-line:max-line-length
    private createInputElement(labelText: string, parentElement: HTMLElement, inputType: string, input: string, isLabelNeeded: boolean, className: string, idString: string): HTMLElement {
        let container: HTMLElement = createElement('div', { id: idString + '_container', className: className + '-container' });
        if (isLabelNeeded) {
            let label: HTMLElement = createElement('div', { id: idString + '_label', className: className + '-label' });
            label.textContent = labelText;
            container.appendChild(label);
        }
        if (this.pdfViewer.localeObj.getConstant('Opacity') === labelText) {
            this.opacityIndicator = createElement('span', { className: 'e-pv-properties-opacity-indicator' });
            container.appendChild(this.opacityIndicator);
        }
        let textBoxInput: HTMLElement = createElement(input, { id: idString });
        if (input === 'input') {
            (textBoxInput as HTMLInputElement).type = inputType;
        }
        container.appendChild(textBoxInput);
        parentElement.appendChild(container);
        return textBoxInput;
    }

    private updateOpacityIndicator(): void {
        this.opacityIndicator.textContent = this.opacitySlider.value + '%';
    }

    private onOkClicked(): void {
        let startArrow: DecoratorShapes = this.getArrowTypeFromDropDown(this.startArrowDropDown.content);
        let endArrow: DecoratorShapes = this.getArrowTypeFromDropDown(this.endArrowDropDown.content);
        let thickness: number = this.thicknessBox.value;
        let strokeColor: string = this.strokeColorPicker.getValue(this.strokeColorPicker.value, 'hex');
        strokeColor = (strokeColor === '') ? '#ffffff00' : strokeColor;
        let fillColor: string = this.fillColorPicker.getValue(this.fillColorPicker.value, 'hex');
        fillColor = (fillColor === '' || this.fillColorPicker.value === '#ffffff00') ? '#ffffff00' : fillColor;
        let opacity: number = (this.opacitySlider.value as number) / 100;
        let currentAnnotation: PdfAnnotationBaseModel = this.pdfViewer.selectedItems.annotations[0];
        let clonedObject: PdfAnnotationBaseModel = cloneObject(currentAnnotation);
        let redoClonedObject: PdfAnnotationBaseModel = cloneObject(currentAnnotation);
        let newNode: PdfAnnotationBaseModel = {};
        let isColorChanged: boolean = false;
        let isStrokeColorChanged: boolean = false;
        let isThicknessChanged: boolean = false;
        let isOpacityChanged: boolean = false;
        let isLineHeadStartStyleChanged: boolean = false;
        let isLineHeadEndStyleChanged: boolean = false;
        let isBorderDashArrayChanged: boolean = false;
        if (startArrow !== currentAnnotation.sourceDecoraterShapes) {
            newNode.sourceDecoraterShapes = startArrow;
            redoClonedObject.lineHeadStart = this.getArrowString(startArrow);
            isLineHeadStartStyleChanged = true;
        }
        if (endArrow !== currentAnnotation.taregetDecoraterShapes) {
            newNode.taregetDecoraterShapes = endArrow;
            redoClonedObject.lineHeadEnd = this.getArrowString(endArrow);
            isLineHeadEndStyleChanged = true;
        }
        if (thickness !== currentAnnotation.wrapper.children[0].style.strokeWidth) {
            newNode.thickness = thickness;
            redoClonedObject.thickness = thickness;
            isThicknessChanged = true;
        }
        if (strokeColor !== currentAnnotation.wrapper.children[0].style.strokeColor) {
            newNode.strokeColor = strokeColor;
            redoClonedObject.strokeColor = strokeColor;
            isStrokeColorChanged = true;
        }
        if (fillColor !== currentAnnotation.wrapper.children[0].style.fill) {
            newNode.fillColor = fillColor;
            redoClonedObject.fillColor = fillColor;
            isColorChanged = true;
        }
        if (opacity !== currentAnnotation.wrapper.children[0].style.opacity) {
            newNode.opacity = opacity;
            redoClonedObject.opacity = opacity;
            isOpacityChanged = true;
        }
        if (this.selectedLineDashArray !== currentAnnotation.wrapper.children[0].style.strokeDashArray) {
            newNode.borderDashArray = this.selectedLineDashArray;
            newNode.borderStyle = this.selectedLineStyle;
            redoClonedObject.borderDashArray = newNode.borderDashArray;
            redoClonedObject.borderStyle = newNode.borderStyle;
            isBorderDashArrayChanged = true;
        }
        // tslint:disable-next-line:max-line-length
        if (this.pdfViewer.selectedItems.annotations[0].shapeAnnotationType === 'Distance' && this.leaderLengthBox.value !== this.pdfViewer.selectedItems.annotations[0].leaderHeight) {
            newNode.leaderHeight = this.leaderLengthBox.value;
        }
        this.pdfViewer.nodePropertyChange(this.pdfViewer.selectedItems.annotations[0], newNode);
        // tslint:disable-next-line:max-line-length
        this.triggerAnnotationPropChange(this.pdfViewer.selectedItems.annotations[0], isColorChanged, isStrokeColorChanged, isThicknessChanged, isOpacityChanged, isLineHeadStartStyleChanged, isLineHeadEndStyleChanged, isBorderDashArrayChanged);
        this.modifyInCollections(this.pdfViewer.selectedItems.annotations[0], 'thickness');
        this.modifyInCollections(this.pdfViewer.selectedItems.annotations[0], 'stroke');
        this.modifyInCollections(this.pdfViewer.selectedItems.annotations[0], 'fill');
        this.modifyInCollections(this.pdfViewer.selectedItems.annotations[0], 'opacity');
        this.modifyInCollections(this.pdfViewer.selectedItems.annotations[0], 'dashArray');
        this.modifyInCollections(this.pdfViewer.selectedItems.annotations[0], 'startArrow');
        this.modifyInCollections(this.pdfViewer.selectedItems.annotations[0], 'endArrow');
        // tslint:disable-next-line:max-line-length
        if (this.pdfViewer.selectedItems.annotations[0].shapeAnnotationType === 'Distance') {
            this.modifyInCollections(this.pdfViewer.selectedItems.annotations[0], 'leaderLength');
        }
        // tslint:disable-next-line:max-line-length
        this.pdfViewer.annotation.addAction(currentAnnotation.pageIndex, null, currentAnnotation, 'Line properties change', '', clonedObject, redoClonedObject);
        this.renderAnnotations(currentAnnotation.pageIndex, null, null, null);
        this.propertiesDialog.hide();
    }

    private onCancelClicked(): void {
        this.propertiesDialog.hide();
    }

    private getArrowTypeFromDropDown(arrowType: string): DecoratorShapes {
        arrowType = arrowType.split('</div>')[0].split('">')[1];
        let arrow: DecoratorShapes = 'None';
        switch (arrowType) {
            case this.pdfViewer.localeObj.getConstant('None'):
                arrow = 'None';
                break;
            case this.pdfViewer.localeObj.getConstant('Open Arrow'):
                arrow = 'OpenArrow';
                break;
            case this.pdfViewer.localeObj.getConstant('Closed Arrow'):
                arrow = 'Arrow';
                break;
            case this.pdfViewer.localeObj.getConstant('Round Arrow'):
                arrow = 'Circle';
                break;
            case this.pdfViewer.localeObj.getConstant('Square Arrow'):
                arrow = 'Square';
                break;
            case this.pdfViewer.localeObj.getConstant('Diamond Arrow'):
                arrow = 'Diamond';
                break;
        }
        return arrow;
    }

    /**
     * @private
     */
    public getArrowString(arrow: DecoratorShapes): string {
        let arrowType: string = this.pdfViewer.localeObj.getConstant('None');
        switch (arrow) {
            case 'Arrow':
                arrowType = this.pdfViewer.localeObj.getConstant('Closed');
                break;
            case 'OpenArrow':
                arrowType = this.pdfViewer.localeObj.getConstant('Open');
                break;
            case 'Circle':
                arrowType = this.pdfViewer.localeObj.getConstant('Round');
                break;
            case 'None':
            case 'Square':
            case 'Diamond':
                arrowType = this.pdfViewer.localeObj.getConstant(arrow);
                break;
        }
        return arrowType;
    }

    /**
     * @private
     */
    public onAnnotationMouseUp(): void {
        if (this.pdfViewer.selectedItems.annotations.length !== 0) {
            if (this.pdfViewer.toolbar && this.pdfViewer.toolbar.annotationToolbarModule) {
                this.enableBasedOnType();
                this.pdfViewer.toolbar.annotationToolbarModule.selectAnnotationDeleteItem(true);
                this.pdfViewer.toolbar.annotationToolbarModule.updateAnnnotationPropertyItems();
            }
            this.pdfViewerBase.disableTextSelectionMode();
        } else {
            if (this.pdfViewer.textSelectionModule && !this.pdfViewerBase.isPanMode) {
                this.pdfViewer.textSelectionModule.enableTextSelectionMode();
            }
            if (this.pdfViewer.toolbar && this.pdfViewer.toolbar.annotationToolbarModule) {
                this.pdfViewer.toolbar.annotationToolbarModule.enableAnnotationPropertiesTools(false);
                this.pdfViewer.toolbar.annotationToolbarModule.updateAnnnotationPropertyItems();
                this.pdfViewer.toolbar.annotationToolbarModule.selectAnnotationDeleteItem(false);
            }
        }
    }

    /**
     * @private
     */
    // tslint:disable-next-line
    public onShapesMouseup(pdfAnnotationBase: PdfAnnotationBaseModel, event: any): void {
        // tslint:disable-next-line:max-line-length
        pdfAnnotationBase = isNullOrUndefined(pdfAnnotationBase) ? this.pdfViewer.selectedItems.annotations[0] : pdfAnnotationBase;
        if (pdfAnnotationBase) {
            // tslint:disable-next-line:max-line-length
            if ((this.pdfViewerBase.tool instanceof NodeDrawingTool || this.pdfViewerBase.tool instanceof LineTool) && !this.pdfViewerBase.tool.dragging) {
                // tslint:disable-next-line
                let setting: any = {
                    opacity: pdfAnnotationBase.opacity, fillColor: pdfAnnotationBase.fillColor, strokeColor: pdfAnnotationBase.strokeColor,
                    thickness: pdfAnnotationBase.thickness, author: pdfAnnotationBase.author, subject: pdfAnnotationBase.subject,
                    modifiedDate: pdfAnnotationBase.modifiedDate
                };
                let index: number = this.getAnnotationIndex(pdfAnnotationBase.pageIndex, pdfAnnotationBase.id);
                // tslint:disable-next-line
                let bounds: any = { left: pdfAnnotationBase.bounds.x, top: pdfAnnotationBase.bounds.y, width: pdfAnnotationBase.bounds.width, height: pdfAnnotationBase.bounds.height };
                if (this.pdfViewerBase.tool instanceof LineTool) {
                    setting.lineHeadStartStyle = this.getArrowString(pdfAnnotationBase.sourceDecoraterShapes);
                    setting.lineHeadEndStyle = this.getArrowString(pdfAnnotationBase.taregetDecoraterShapes);
                    setting.borderDashArray = pdfAnnotationBase.borderDashArray;
                }
                if (pdfAnnotationBase.measureType === '' || isNullOrUndefined(pdfAnnotationBase.measureType)) {
                    // tslint:disable-next-line:max-line-length
                    this.shapeAnnotationModule.renderShapeAnnotations(pdfAnnotationBase, this.pdfViewer.annotation.getEventPageNumber(event));
                } else if (pdfAnnotationBase.measureType === 'Distance' || pdfAnnotationBase.measureType === 'Perimeter' ||
                    pdfAnnotationBase.measureType === 'Radius') {
                    // tslint:disable-next-line:max-line-length
                    this.measureAnnotationModule.renderMeasureShapeAnnotations(pdfAnnotationBase, this.pdfViewer.annotation.getEventPageNumber(event));
                }
                // tslint:disable-next-line:max-line-length
                this.pdfViewer.fireAnnotationAdd(pdfAnnotationBase.pageIndex, index, this.getAnnotationType(pdfAnnotationBase.shapeAnnotationType, pdfAnnotationBase.measureType), bounds, setting);
            } else if (this.pdfViewerBase.tool instanceof MoveTool || this.pdfViewerBase.tool instanceof ResizeTool) {
                if (this.pdfViewerBase.tool instanceof ResizeTool) {
                    this.triggerAnnotationResize(pdfAnnotationBase);
                }
                if (pdfAnnotationBase.measureType === '' || isNullOrUndefined(pdfAnnotationBase.measureType)) {
                    // tslint:disable-next-line:max-line-length
                    this.pdfViewer.annotation.shapeAnnotationModule.modifyInCollection('bounds', this.pdfViewer.annotation.getEventPageNumber(event), pdfAnnotationBase);
                    // tslint:disable-next-line:max-line-length
                } else if (pdfAnnotationBase.measureType === 'Distance' || pdfAnnotationBase.measureType === 'Perimeter' || pdfAnnotationBase.measureType === 'Radius' || pdfAnnotationBase.measureType === 'Area' || pdfAnnotationBase.measureType === 'Volume') {
                    this.pdfViewer.annotation.measureAnnotationModule.modifyInCollection('bounds', this.pdfViewer.annotation.getEventPageNumber(event), pdfAnnotationBase);
                }
            } else if (this.pdfViewerBase.tool instanceof ConnectTool) {
                this.triggerAnnotationResize(pdfAnnotationBase);
                if (pdfAnnotationBase.measureType === '' || isNullOrUndefined(pdfAnnotationBase.measureType)) {
                    // tslint:disable-next-line:max-line-length
                    if ((pdfAnnotationBase.shapeAnnotationType === 'Line' || pdfAnnotationBase.shapeAnnotationType === 'LineWidthArrowHead' || pdfAnnotationBase.shapeAnnotationType === 'Polygon')) {
                        this.pdfViewer.annotation.shapeAnnotationModule.modifyInCollection('bounds', this.pdfViewer.annotation.getEventPageNumber(event), pdfAnnotationBase);
                    }
                    // tslint:disable-next-line:max-line-length
                } else if (pdfAnnotationBase.measureType === 'Distance' || pdfAnnotationBase.measureType === 'Perimeter' || pdfAnnotationBase.measureType === 'Area' || pdfAnnotationBase.measureType === 'Volume') {
                    if (pdfAnnotationBase.measureType === 'Distance') {
                        // tslint:disable-next-line:max-line-length
                        this.pdfViewer.annotation.measureAnnotationModule.modifyInCollection('leaderLength', this.pdfViewer.annotation.getEventPageNumber(event), pdfAnnotationBase);
                    }
                    // tslint:disable-next-line:max-line-length
                    this.pdfViewer.annotation.measureAnnotationModule.modifyInCollection('bounds', this.pdfViewer.annotation.getEventPageNumber(event), pdfAnnotationBase);
                }
            }
            if (this.pdfViewer.toolbarModule) {
                if (this.pdfViewer.toolbarModule.annotationToolbarModule) {
                    this.pdfViewer.toolbarModule.annotationToolbarModule.clearTextMarkupMode();
                    if (pdfAnnotationBase.measureType === '' || isNullOrUndefined(pdfAnnotationBase.measureType)) {
                        // tslint:disable-next-line:max-line-length
                        this.pdfViewer.toolbarModule.annotationToolbarModule.clearMeasureMode();
                    } else if (pdfAnnotationBase.measureType === 'Distance' || pdfAnnotationBase.measureType === 'Perimeter' || pdfAnnotationBase.measureType === 'Area' || pdfAnnotationBase.measureType === 'Volume' || pdfAnnotationBase.measureType === 'Radius') {
                        this.pdfViewer.toolbarModule.annotationToolbarModule.clearShapeMode();
                    }
                    this.pdfViewer.toolbarModule.annotationToolbarModule.enableAnnotationPropertiesTools(true);
                    this.pdfViewer.toolbarModule.annotationToolbarModule.selectAnnotationDeleteItem(true);
                    this.pdfViewer.toolbarModule.annotationToolbarModule.setCurrentColorInPicker();
                    this.pdfViewer.toolbarModule.annotationToolbarModule.isToolbarHidden = true;
                    this.pdfViewer.toolbarModule.annotationToolbarModule.showAnnotationToolbar(this.pdfViewer.toolbarModule.annotationItem);
                }
            }
        }
    }

    /**
     * @private
     */
    public updateCalibrateValues(pdfAnnotationBase: PdfAnnotationBaseModel): void {
        if (pdfAnnotationBase.measureType === 'Distance') {
            pdfAnnotationBase.notes = updateDistanceLabel(pdfAnnotationBase, pdfAnnotationBase.vertexPoints, this.measureAnnotationModule);
            this.pdfViewer.annotation.measureAnnotationModule.modifyInCollection('notes', pdfAnnotationBase.pageIndex, pdfAnnotationBase);
            this.pdfViewer.annotation.stickyNotesAnnotationModule.addTextToComments(pdfAnnotationBase.annotName, pdfAnnotationBase.notes);
            this.renderAnnotations(pdfAnnotationBase.pageIndex, null, null, null, null);
        } else if (pdfAnnotationBase.measureType === 'Radius') {
            pdfAnnotationBase.notes = updateRadiusLabel(pdfAnnotationBase, this.measureAnnotationModule);
            this.pdfViewer.annotation.measureAnnotationModule.modifyInCollection('notes', pdfAnnotationBase.pageIndex, pdfAnnotationBase);
            this.pdfViewer.annotation.stickyNotesAnnotationModule.addTextToComments(pdfAnnotationBase.annotName, pdfAnnotationBase.notes);
            this.renderAnnotations(pdfAnnotationBase.pageIndex, null, null, null, null);
        } else if (pdfAnnotationBase.measureType === 'Perimeter') {
            pdfAnnotationBase.notes = this.measureAnnotationModule.calculatePerimeter(pdfAnnotationBase);
            this.pdfViewer.annotation.measureAnnotationModule.modifyInCollection('notes', pdfAnnotationBase.pageIndex, pdfAnnotationBase);
            this.pdfViewer.annotation.stickyNotesAnnotationModule.addTextToComments(pdfAnnotationBase.annotName, pdfAnnotationBase.notes);
        } else if (pdfAnnotationBase.measureType === 'Area') {
            // tslint:disable-next-line:max-line-length
            pdfAnnotationBase.notes = this.measureAnnotationModule.calculateArea(pdfAnnotationBase.vertexPoints, pdfAnnotationBase.id, pdfAnnotationBase.pageIndex);
            this.pdfViewer.annotation.measureAnnotationModule.modifyInCollection('notes', pdfAnnotationBase.pageIndex, pdfAnnotationBase);
            this.pdfViewer.annotation.stickyNotesAnnotationModule.addTextToComments(pdfAnnotationBase.annotName, pdfAnnotationBase.notes);
        } else if (pdfAnnotationBase.measureType === 'Volume') {
            // tslint:disable-next-line:max-line-length
            pdfAnnotationBase.notes = this.measureAnnotationModule.calculateVolume(pdfAnnotationBase.vertexPoints, pdfAnnotationBase.id, pdfAnnotationBase.pageIndex);
            this.pdfViewer.annotation.measureAnnotationModule.modifyInCollection('notes', pdfAnnotationBase.pageIndex, pdfAnnotationBase);
            this.pdfViewer.annotation.stickyNotesAnnotationModule.addTextToComments(pdfAnnotationBase.annotName, pdfAnnotationBase.notes);
        }
    }

    /**
     * @private
     */
    public onAnnotationMouseDown(): void {
        if (this.pdfViewer.selectedItems.annotations.length === 1) {
            if (this.pdfViewer.toolbar && this.pdfViewer.toolbar.annotationToolbarModule) {
                this.enableBasedOnType();
                this.pdfViewer.toolbar.annotationToolbarModule.selectAnnotationDeleteItem(true);
            }
        }
    }

    private enableBasedOnType(): void {
        if (this.pdfViewer.selectedItems.annotations[0].shapeAnnotationType === 'Stamp' ||
            this.pdfViewer.selectedItems.annotations[0].shapeAnnotationType === 'Image') {
            this.pdfViewer.toolbar.annotationToolbarModule.enableStampAnnotationPropertiesTools(true);
        } else if (this.pdfViewer.selectedItems.annotations[0].shapeAnnotationType === 'StickyNotes') {
            this.pdfViewer.toolbar.annotationToolbarModule.enableStampAnnotationPropertiesTools(true);
        } else {
            this.pdfViewer.toolbar.annotationToolbarModule.enableAnnotationPropertiesTools(true);
        }
    }

    private getProperDate(date: string): string {
        let dateObject: Date = new Date(date.toString());
        if (isNaN(dateObject.getFullYear())) {
            let dateString: string = date.slice(2, 16);
            // tslint:disable-next-line:max-line-length
            dateString = dateString.slice(0, 4) + '/' + dateString.slice(4, 6) + '/' + dateString.slice(6, 8) + ' ' + dateString.slice(8, 10) + ':' + dateString.slice(10, 12) + ':' + dateString.slice(12, 14);
            dateObject = new Date(dateString);
        }
        // tslint:disable-next-line:max-line-length
        return (dateObject.getMonth() + 1) + '/' + dateObject.getDate() + '/' + dateObject.getFullYear() + ' ' + dateObject.getHours() + ':' + dateObject.getMinutes() + ':' + dateObject.getSeconds();
    }

    /**
     * @private
     */
    public getPageCollection(pageAnnotations: IPageAnnotations[], pageNumber: number): number {
        let index: number = null;
        for (let i: number = 0; i < pageAnnotations.length; i++) {
            if (pageAnnotations[i].pageIndex === pageNumber) {
                index = i;
                break;
            }
        }
        return index;
    }

    /**
     * @private
     */
    // tslint:disable-next-line
    public getAnnotationWithId(annotations: any[], id: string): any {
        // tslint:disable-next-line
        let annotation: any;
        for (let i: number = 0; i < annotations.length; i++) {
            if (id === annotations[i].id) {
                annotation = annotations[i];
            }
        }
        return annotation;
    }

    /**
     * @private
     */
    // tslint:disable-next-line
    public getEventPageNumber(event: any): number {
        let eventTarget: HTMLElement = event.target as HTMLElement;
        if (eventTarget.classList.contains('e-pv-hyperlink')) {
            eventTarget = eventTarget.parentElement;
        }
        // tslint:disable-next-line:max-line-length
        let pageString: string = eventTarget.id.split('_text_')[1] || eventTarget.id.split('_textLayer_')[1] || eventTarget.id.split('_annotationCanvas_')[1] || eventTarget.id.split('_pageDiv_')[1];
        // tslint:disable-next-line
        return parseInt(pageString);
    }

    /**
     * @private
     */
    // tslint:disable-next-line
    public getAnnotationComments(commentsAnnotations: any, parentAnnotation: any, author: string): any {
        let newArray: ICommentsCollection[] = [];
        let annotationObject: ICommentsCollection = null;
        if (commentsAnnotations) {
            if (commentsAnnotations.length > 0) {
                for (let i: number = 0; i < commentsAnnotations.length; i++) {
                    // tslint:disable-next-line
                    let annotation: any = commentsAnnotations[i];
                    annotationObject = {
                        // tslint:disable-next-line:max-line-length
                        shapeAnnotationType: 'sticky', author: annotation.Author, modifiedDate: annotation.ModifiedDate, note: annotation.Note, state: annotation.state, stateModel: annotation.stateModel,
                        comments: [], review: { state: annotation.State, stateModel: annotation.StateModel, modifiedDate: annotation.ModifiedDate, author: annotation.Author },
                        annotName: annotation.AnnotName, parentId: parentAnnotation.AnnotName, subject: 'Comments'
                    };
                    newArray[newArray.length] = annotationObject;
                }
            }
        }
        return newArray;
    }

    private getRandomNumber(): string {
        // tslint:disable-next-line
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c: any): string {
            // tslint:disable-next-line
            let random: any = Math.random() * 16 | 0, v = c == 'x' ? random : (random & 0x3 | 0x8);
            return random.toString(16);
        });
    }

    /**
     * @private
     */
    public createGUID(): string {
        // tslint:disable-next-line:max-line-length
        return this.getRandomNumber();
    }

    /**
     * @private
     */
    public clearAnnotationCanvas(pageNumber: number): void {
        let canvas: HTMLElement = this.pdfViewerBase.getElement('_annotationCanvas_' + pageNumber);
        if (canvas) {
            (canvas as HTMLCanvasElement).width = this.pdfViewerBase.pageSize[pageNumber].width * this.pdfViewerBase.getZoomFactor();
            (canvas as HTMLCanvasElement).height = this.pdfViewerBase.pageSize[pageNumber].height * this.pdfViewerBase.getZoomFactor();
        }
    }

    /**
     * @private
     */
    // tslint:disable-next-line
    public renderAnnotations(pageNumber: number, shapeAnnotation: any, measureShapeAnnotation: any, textMarkupAnnotation: any, canvas?: any, isImportAnnotations?: boolean): void {
        this.clearAnnotationCanvas(pageNumber);
        if (this.shapeAnnotationModule) {
            if (isImportAnnotations) {
                this.shapeAnnotationModule.renderShapeAnnotations(shapeAnnotation, pageNumber, true);
            } else {
                this.shapeAnnotationModule.renderShapeAnnotations(shapeAnnotation, pageNumber);
            }
        }
        if (this.measureAnnotationModule) {
            if (isImportAnnotations) {
                this.measureAnnotationModule.renderMeasureShapeAnnotations(measureShapeAnnotation, pageNumber, true);
            } else {
                this.measureAnnotationModule.renderMeasureShapeAnnotations(measureShapeAnnotation, pageNumber);
            }
        }
        if (canvas !== null && canvas !== undefined) {
            canvas = canvas;
        } else {
            canvas = this.pdfViewerBase.getElement('_annotationCanvas_' + pageNumber);
        }
        this.pdfViewer.drawing.refreshCanvasDiagramLayer(canvas as HTMLCanvasElement, pageNumber);
        if (isImportAnnotations) {
            // tslint:disable-next-line
            this.textMarkupAnnotationModule.renderTextMarkupAnnotationsInPage(textMarkupAnnotation, pageNumber, true);
        } else {
            // tslint:disable-next-line
            this.textMarkupAnnotationModule.renderTextMarkupAnnotationsInPage(textMarkupAnnotation, pageNumber);
        }
    }
    /**
     * @private
     */
    // tslint:disable-next-line
    public storeAnnotations(pageNumber: number, annotation: any, annotationId: string): number {
        // let annotationId: string = '_annotations_textMarkup';
        // if (annotation is ITextMarkupAnnotation) {
        //     annotationId = '_annotations_textMarkup';
        // } else if (annotation as IShapeAnnotation) {
        //     annotationId = '_annotations_shape';
        // } else {
        //     annotationId = '_annotations_stamp';
        // }
        // tslint:disable-next-line
        let storeObject: any = window.sessionStorage.getItem(this.pdfViewerBase.documentId + annotationId);
        let index: number = 0;
        if (!storeObject) {
            let pageAnnotation: IPageAnnotations = { pageIndex: pageNumber, annotations: [] };
            pageAnnotation.annotations.push(annotation);
            index = pageAnnotation.annotations.indexOf(annotation);
            let annotationCollection: IPageAnnotations[] = [];
            annotationCollection.push(pageAnnotation);
            let annotationStringified: string = JSON.stringify(annotationCollection);
            window.sessionStorage.setItem(this.pdfViewerBase.documentId + annotationId, annotationStringified);
        } else {
            let annotObject: IPageAnnotations[] = JSON.parse(storeObject);
            window.sessionStorage.removeItem(this.pdfViewerBase.documentId + annotationId);
            let pageIndex: number = this.pdfViewer.annotationModule.getPageCollection(annotObject, pageNumber);
            if (annotObject[pageIndex]) {
                (annotObject[pageIndex] as IPageAnnotations).annotations.push(annotation);
                index = (annotObject[pageIndex] as IPageAnnotations).annotations.indexOf(annotation);
            } else {
                let markupAnnotation: IPageAnnotations = { pageIndex: pageNumber, annotations: [] };
                markupAnnotation.annotations.push(annotation);
                index = markupAnnotation.annotations.indexOf(annotation);
                annotObject.push(markupAnnotation);
            }
            let annotationStringified: string = JSON.stringify(annotObject);
            window.sessionStorage.setItem(this.pdfViewerBase.documentId + annotationId, annotationStringified);
        }
        return index;
    }

    /**
     * @private
     */
    public getArrowType(type: string): DecoratorShapes {
        let decoratorShapes: DecoratorShapes = 'None';
        switch (type) {
            case 'ClosedArrow':
            case 'Closed':
                decoratorShapes = 'Arrow';
                break;
            case 'OpenArrow':
            case 'Open':
                decoratorShapes = 'OpenArrow';
                break;
            case 'Square':
                decoratorShapes = 'Square';
                break;
            case 'Circle':
            case 'Round':
                decoratorShapes = 'Circle';
                break;
            case 'Diamond':
                decoratorShapes = 'Diamond';
                break;
            case 'Butt':
                // decoratorShapes = 'Butt';
                break;
            case 'Slash':
                // decoratorShapes = 'Slash';
                break;
        }
        return decoratorShapes;
    }

    /**
     * @private
     */
    public getArrowTypeForCollection(arrow: DecoratorShapes): string {
        let arrowType: string;
        switch (arrow) {
            case 'Arrow':
                arrowType = 'ClosedArrow';
                break;
            case 'OpenArrow':
            case 'Square':
            case 'Circle':
            case 'Diamond':
            case 'None':
                arrowType = arrow.toString();
                break;
        }
        return arrowType;
    }

    /**
     * @private
     */
    // tslint:disable-next-line
   public getBounds(bound: any, pageIndex: number): any {
       let pageDetails: ISize = this.pdfViewerBase.pageSize[pageIndex];
       if (pageDetails.rotation === 1) {
           return { left: bound.top, top: pageDetails.width - (bound.left + bound.width), width: bound.height, height: bound.width };
       } else if (pageDetails.rotation === 2) {
           // tslint:disable-next-line:max-line-length
           return { left: pageDetails.width - bound.left - bound.width, top: pageDetails.height - bound.top - bound.height, width: bound.width, height: bound.height };
       } else if (pageDetails.rotation === 3) {
           return { left: pageDetails.height - bound.top - bound.height, top: bound.left, width: bound.height, height: bound.width };
       } else {
           return bound;
       }
   }

   /**
    * @private
    */
    // tslint:disable-next-line
    public getVertexPoints(points: any[], pageIndex: number): any {
       if (points) {
           let pageDetails: ISize = this.pdfViewerBase.pageSize[pageIndex];
           if (pageDetails.rotation === 1) {
               let points1: PointModel[] = [];
               for (let i: number = 0; i < points.length; i++) {
                   let point: PointModel = { x: points[i].y, y: pageDetails.width - points[i].x };
                   points1.push(point);
               }
               return points1;
           } else if (pageDetails.rotation === 2) {
               let points2: PointModel[] = [];
               for (let i: number = 0; i < points.length; i++) {
                   let point: PointModel = { x: pageDetails.width - points[i].x, y: pageDetails.height - points[i].y };
                   points2.push(point);
               }
               return points2;
           } else if (pageDetails.rotation === 3) {
               let points3: PointModel[] = [];
               for (let i: number = 0; i < points.length; i++) {
                   let point: PointModel = { x: pageDetails.height - points[i].y, y: points[i].x };
                   points3.push(point);
               }
               return points3;
           } else {
               return points;
           }
       }
   }

   /**
    * @private
    */
   // tslint:disable-next-line
   public getStoredAnnotations(pageIndex: number, shapeAnnotations: any[], idString: string): any[] {
      // tslint:disable-next-line
      let annotationCollection: any[];
      // tslint:disable-next-line
      let storeObject: any = window.sessionStorage.getItem(this.pdfViewerBase.documentId + idString);
      if (storeObject) {
          let annotObject: IPageAnnotations[] = JSON.parse(storeObject);
          let index: number = this.pdfViewer.annotationModule.getPageCollection(annotObject, pageIndex);
          if (annotObject[index]) {
              annotationCollection = annotObject[index].annotations;
          } else {
              annotationCollection = null;
          }
      } else {
          annotationCollection = null;
      }
      return annotationCollection;
  }

    /**
     * @private
     */
    // tslint:disable-next-line:max-line-length
    public triggerAnnotationPropChange(pdfAnnotationBase: PdfAnnotationBaseModel, isColor: boolean, isStroke: boolean, isThickness: boolean, isOpacity: boolean, isLineStart?: boolean, isLineEnd?: boolean, isDashArray?: boolean): void {
        let index: number = this.getAnnotationIndex(pdfAnnotationBase.pageIndex, pdfAnnotationBase.id);
        let type: AnnotationType = this.getAnnotationType(pdfAnnotationBase.shapeAnnotationType, pdfAnnotationBase.measureType);
        // tslint:disable-next-line:max-line-length
        let eventArgs: AnnotationPropertiesChangeEventArgs = { name: 'annotationPropertiesChange', pageIndex: pdfAnnotationBase.pageIndex, annotationId: index, annotationType: type, isColorChanged: isColor, isOpacityChanged: isOpacity, isThicknessChanged: isThickness, isStrokeColorChanged: isStroke };
        if (isLineStart) {
            eventArgs.isLineHeadStartStyleChanged = isLineStart;
        }
        if (isLineEnd) {
            eventArgs.isLineHeadEndStyleChanged = isLineEnd;
        }
        if (isDashArray) {
            eventArgs.isBorderDashArrayChanged = isDashArray;
        }
        this.pdfViewer.trigger('annotationPropertiesChange', eventArgs);
    }

    /**
     * @private
     */
    public triggerAnnotationResize(pdfAnnotationBase: PdfAnnotationBaseModel): void {
        // tslint:disable-next-line
        let setting: any = {
            opacity: pdfAnnotationBase.opacity, fillColor: pdfAnnotationBase.fillColor, strokeColor: pdfAnnotationBase.strokeColor,
            thickness: pdfAnnotationBase.thickness, author: pdfAnnotationBase.author, subject: pdfAnnotationBase.subject,
            modifiedDate: pdfAnnotationBase.modifiedDate
        };
        let index: number = this.getAnnotationIndex(pdfAnnotationBase.pageIndex, pdfAnnotationBase.id);
        // tslint:disable-next-line
        let bounds: any = { left: pdfAnnotationBase.bounds.x, top: pdfAnnotationBase.bounds.y, width: pdfAnnotationBase.bounds.width, height: pdfAnnotationBase.bounds.height };
        let type: AnnotationType = this.getAnnotationType(pdfAnnotationBase.shapeAnnotationType, pdfAnnotationBase.measureType);
        if (type === 'Line' || type === 'Arrow' || type === 'Distance' || type === 'Perimeter') {
            setting.lineHeadStartStyle = this.getArrowString(pdfAnnotationBase.sourceDecoraterShapes);
            setting.lineHeadEndStyle = this.getArrowString(pdfAnnotationBase.taregetDecoraterShapes);
            setting.borderDashArray = pdfAnnotationBase.borderDashArray;
        }
        this.pdfViewer.fireAnnotationResize(pdfAnnotationBase.pageIndex, index, type, bounds, setting);
    }

    /**
     * @private
     */
    // tslint:disable-next-line
    public selectAnnotation(annotationId: any, pageNumber: number, annotation: any ): void {
        // tslint:disable-next-line
        let annotSettings: any;
        if (annotation.shapeAnnotationType === 'textMarkup') {
            annotSettings = { type: 'TextMarkup', subType: annotation.subject, opacity: annotation.opacity, color: annotation.color };
        } else if (annotation.shapeAnnotationType === 'StickyNotes') {
            annotSettings = { type: 'StickyNotes', opacity: annotation.opacity };
        } else if (annotation.shapeAnnotationType === 'Stamp' || annotation.shapeAnnotationType === 'Image') {
            annotSettings = { type: 'Stamp', opacity: annotation.opacity };
        } else if (annotation.measureType === '') {
            if (annotation.shapeAnnotationType === 'Line') {
                // tslint:disable-next-line:max-line-length
                annotSettings = { type: 'Shape', subType: 'Line', opacity: annotation.opacity, fillColor: annotation.fillColor, strokeColor: annotation.strokeColor, thickness: annotation.thickness, borderDashArray: annotation.borderDashArray, lineHeadStartStyle: annotation.sourceDecoraterShapes, lineHeadEndStyle: annotation.taregetDecoraterShapes };
            } else if (annotation.shapeAnnotationType === 'Arrow' || annotation.shapeAnnotationType === 'LineWidthArrowHead') {
                // tslint:disable-next-line:max-line-length
                annotSettings = { type: 'Shape', subType: 'Arrow', opacity: annotation.opacity, fillColor: annotation.fillColor, strokeColor: annotation.strokeColor, thickness: annotation.thickness, borderDashArray: annotation.borderDashArray, lineHeadStartStyle: annotation.sourceDecoraterShapes, lineHeadEndStyle: annotation.taregetDecoraterShapes };
            } else if (annotation.shapeAnnotationType === 'Rectangle') {
                annotSettings = { type: 'Shape', subType: 'Rectangle', opacity: annotation.opacity, fillColor: annotation.fillColor,
                strokeColor: annotation.strokeColor, thickness: annotation.thickness };
            } else if (annotation.shapeAnnotationType === 'Circle' || annotation.shapeAnnotationType === 'Ellipse') {
                annotSettings = { type: 'Shape', subType: 'Circle', opacity: annotation.opacity, fillColor: annotation.fillColor,
                strokeColor: annotation.strokeColor, thickness: annotation.thickness };
            } else if (annotation.shapeAnnotationType === 'Polygon') {
                annotSettings = { type: 'Shape', subType: 'Polygon', opacity: annotation.opacity, fillColor: annotation.fillColor,
                strokeColor: annotation.strokeColor, thickness: annotation.thickness };
            }
        } else if (annotation.measureType !== '') {
            if (annotation.measureType === 'Distance') {
                // tslint:disable-next-line:max-line-length
                annotSettings = { type: 'Measure', subType: 'Distance', opacity: annotation.opacity, fillColor: annotation.fillColor, strokeColor: annotation.strokeColor, thickness: annotation.thickness, borderDashArray: annotation.borderDashArray, lineHeadStartStyle: annotation.sourceDecoraterShapes, lineHeadEndStyle: annotation.taregetDecoraterShapes };
            } else if (annotation.measureType === 'Perimeter') {
                // tslint:disable-next-line:max-line-length
                annotSettings = { type: 'Measure', subType: 'Perimeter', opacity: annotation.opacity, fillColor: annotation.fillColor, strokeColor: annotation.strokeColor, thickness: annotation.thickness, borderDashArray: annotation.borderDashArray, lineHeadStartStyle: annotation.sourceDecoraterShapes, lineHeadEndStyle: annotation.taregetDecoraterShapes };
            } else if (annotation.measureType === 'Area') {
                annotSettings = { type: 'Measure', subType: 'Area', opacity: annotation.opacity, fillColor: annotation.fillColor,
                strokeColor: annotation.strokeColor, thickness: annotation.thickness };
            } else if (annotation.measureType === 'Radius') {
                annotSettings = { type: 'Measure', subType: 'Radius', opacity: annotation.opacity, fillColor: annotation.fillColor,
                strokeColor: annotation.strokeColor, thickness: annotation.thickness };
            } else if (annotation.measureType === 'Volume') {
                annotSettings = { type: 'Measure', subType: 'Volume', opacity: annotation.opacity, fillColor: annotation.fillColor,
                strokeColor: annotation.strokeColor, thickness: annotation.thickness };
            }
        }
        this.pdfViewer.fireAnnotationSelect(annotationId, pageNumber, annotSettings);
    }

    // tslint:disable-next-line
    public editAnnotation(annotation: any): void {
        // tslint:disable-next-line
        let currentAnnotation: any;
        let annotationId: string;
        let annotationType: string;
        let pageNumber: number;
        if (this.pdfViewer.annotationModule.textMarkupAnnotationModule.currentTextMarkupAnnotation) {
            currentAnnotation = this.pdfViewer.annotationModule.textMarkupAnnotationModule.currentTextMarkupAnnotation;
            annotationId = currentAnnotation.annotName;
            pageNumber = this.pdfViewer.annotationModule.textMarkupAnnotationModule.selectTextMarkupCurrentPage;
        } else {
            if (this.pdfViewer.selectedItems.annotations[0]) {
                currentAnnotation = this.pdfViewer.selectedItems.annotations[0];
                annotationId = currentAnnotation.annotName;
                pageNumber = currentAnnotation.pageIndex;
            }
        }
        if (currentAnnotation) {
            // tslint:disable-next-line
            let clonedObject: any = cloneObject(currentAnnotation);
            // tslint:disable-next-line
            let redoClonedObject: any = cloneObject(currentAnnotation);
            if (annotation.type === 'TextMarkup') {
                if (currentAnnotation.opacity !== annotation.opacity) {
                    this.pdfViewer.annotationModule.textMarkupAnnotationModule.modifyOpacityProperty(null, annotation.opacity);
                }
                if (currentAnnotation.color !== annotation.color) {
                    this.pdfViewer.annotationModule.textMarkupAnnotationModule.modifyColorProperty(annotation.color);
                }
                annotationType = 'textMarkup';
            } else if (annotation.type === 'StickyNotes' || annotation.type === 'Stamp') {
                if (currentAnnotation.opacity !== annotation.opacity) {
                    redoClonedObject.opacity = annotation.opacity;
                    this.pdfViewer.nodePropertyChange(currentAnnotation, { opacity: annotation.opacity });
                    this.triggerAnnotationPropChange(currentAnnotation, false, false, false, true);
                    // tslint:disable-next-line:max-line-length
                    this.pdfViewer.annotation.addAction(currentAnnotation.pageIndex, null, currentAnnotation, 'Shape Opacity', '', clonedObject, redoClonedObject);
                }
                if (annotation.type === 'StickyNotes') {
                    annotationType = 'sticky';
                } else {
                    annotationType = 'stamp';
                }
            } else if (annotation.type === 'Shape' || annotation.type === 'Measure') {
                if (currentAnnotation.opacity !== annotation.opacity) {
                    redoClonedObject.opacity = annotation.opacity;
                    this.pdfViewer.nodePropertyChange(currentAnnotation, { opacity: annotation.opacity });
                    this.triggerAnnotationPropChange(currentAnnotation, false, false, false, true);
                    // tslint:disable-next-line:max-line-length
                    this.pdfViewer.annotation.addAction(currentAnnotation.pageIndex, null, currentAnnotation, 'Shape Opacity', '', clonedObject, redoClonedObject);
                }
                if (currentAnnotation.fillColor !== annotation.fillColor) {
                    redoClonedObject.fillColor = annotation.fillColor;
                    this.pdfViewer.nodePropertyChange(currentAnnotation, { fillColor: annotation.fillColor });
                    this.triggerAnnotationPropChange(currentAnnotation, true, false, false, false);
                    // tslint:disable-next-line:max-line-length
                    this.pdfViewer.annotation.addAction(currentAnnotation.pageIndex, null, currentAnnotation, 'Shape Fill', '', clonedObject, redoClonedObject);
                }
                if (currentAnnotation.strokeColor !== annotation.strokeColor) {
                    redoClonedObject.strokeColor = annotation.strokeColor;
                    this.pdfViewer.nodePropertyChange(currentAnnotation, { strokeColor: annotation.strokeColor });
                    this.triggerAnnotationPropChange(currentAnnotation, false, true, false, false);
                    // tslint:disable-next-line:max-line-length
                    this.pdfViewer.annotation.addAction(currentAnnotation.pageIndex, null, currentAnnotation, 'Shape Stroke', '', clonedObject, redoClonedObject);
                }
                if (currentAnnotation.thickness !== annotation.thickness) {
                    redoClonedObject.thickness = annotation.thickness;
                    this.pdfViewer.nodePropertyChange(currentAnnotation, { thickness: annotation.thickness });
                    this.triggerAnnotationPropChange(currentAnnotation, false, false, true, false);
                    // tslint:disable-next-line:max-line-length
                    this.pdfViewer.annotation.addAction(currentAnnotation.pageIndex, null, currentAnnotation, 'Shape Thickness', '', clonedObject, redoClonedObject);
                }
                // tslint:disable-next-line:max-line-length
                if (annotation.subType === 'Line' || annotation.subType === 'Arrow' || annotation.subType === 'Distance' || annotation.subType === 'Perimeter') {
                    let isSourceDecoraterShapesChanged: boolean = false;
                    let isTargetDecoraterShapesChanged: boolean = false;
                    let isBorderDashArrayChanged: boolean = false;
                    clonedObject.lineHeadStart = currentAnnotation.sourceDecoraterShapes;
                    clonedObject.lineHeadEnd = currentAnnotation.taregetDecoraterShapes;
                    redoClonedObject.lineHeadStart = annotation.lineHeadStartStyle;
                    redoClonedObject.lineHeadEnd = annotation.lineHeadEndStyle;
                    redoClonedObject.borderDashArray = annotation.borderDashArray;
                    if (currentAnnotation.taregetDecoraterShapes !== annotation.lineHeadEndStyle) {
                        isTargetDecoraterShapesChanged = true;
                    }
                    if (currentAnnotation.sourceDecoraterShapes !== annotation.lineHeadStartStyle) {
                        isSourceDecoraterShapesChanged = true;
                    }
                    if (currentAnnotation.borderDashArray !== annotation.borderDashArray) {
                        isBorderDashArrayChanged = true;
                    }
                    // tslint:disable-next-line:max-line-length
                    this.pdfViewer.nodePropertyChange(currentAnnotation, { sourceDecoraterShapes: annotation.lineHeadStartStyle, taregetDecoraterShapes: annotation.lineHeadEndStyle, borderDashArray: annotation.borderDashArray });
                    // tslint:disable-next-line:max-line-length
                    this.triggerAnnotationPropChange(currentAnnotation, false, false, false, false, isSourceDecoraterShapesChanged, isTargetDecoraterShapesChanged, isBorderDashArrayChanged);
                    // tslint:disable-next-line:max-line-length
                    this.pdfViewer.annotation.addAction(currentAnnotation.pageIndex, null, currentAnnotation, 'Line properties change', '', clonedObject, redoClonedObject);
                }
                if (annotation.type === 'Shape') {
                    annotationType = 'shape';
                } else {
                    annotationType = 'shape_measure';
                }
            }
            let date: Date = new Date();
            currentAnnotation.modifiedDate = date.toLocaleString();
            if (annotation.type !== 'TextMarkup') {
                this.pdfViewer.renderDrawing();
                this.updateCollection(annotationId, pageNumber, annotation, annotationType);
            }
        }
    }

    // tslint:disable-next-line
    private updateCollection(annotationId: any, pageNumber: number, annotation: any, annotationType: string): void {
        // tslint:disable-next-line
        let annotationCollection: any[];
        // tslint:disable-next-line
        let storeObject: any = window.sessionStorage.getItem(this.pdfViewerBase.documentId + '_annotations_' + annotationType);
        if (storeObject) {
            let annotObject: IPageAnnotations[] = JSON.parse(storeObject);
            let index: number = this.getPageCollection(annotObject, pageNumber);
            if (annotObject[index]) {
                annotationCollection = annotObject[index].annotations;
                if (annotationCollection !== null) {
                    for (let i: number = 0; i < annotationCollection.length; i++) {
                        if (annotationCollection[i].annotName === annotationId) {
                            // tslint:disable-next-line
                            let newAnnot: any = this.modifyAnnotationProperties(annotationCollection[i], annotation, annotationType);
                            annotationCollection[i] = newAnnot;
                        }
                    }
                    window.sessionStorage.removeItem(this.pdfViewerBase.documentId + '_annotations_' + annotationType);
                    if (annotObject[index]) {
                        annotObject[index].annotations = annotationCollection;
                    }
                    let annotationStringified: string = JSON.stringify(annotObject);
                    window.sessionStorage.setItem(this.pdfViewerBase.documentId + '_annotations_' + annotationType, annotationStringified);
                }
            }
        }
    }

    // tslint:disable-next-line
    private modifyAnnotationProperties(newAnnotation: any, annotation: any, annotationType: string): any {
        if (annotationType === 'textMarkup') {
            newAnnotation.opacity = annotation.opacity;
            newAnnotation.color = annotation.color;
        } else if (annotationType === 'sticky' || annotationType === 'stamp') {
            newAnnotation.opacity = annotation.opacity;
        } else if (annotationType === 'shape' || annotationType === 'shape_measure') {
            if (annotation.subType === 'Line' || annotation.subType === 'Arrow' || annotation.subType === 'Distance' ||
            annotation.subType === 'Perimeter' ) {
                newAnnotation.opacity = annotation.opacity;
                newAnnotation.fillColor = annotation.fillColor;
                newAnnotation.strokeColor = annotation.strokeColor;
                newAnnotation.thickness = annotation.thickness;
                newAnnotation.borderDashArray = annotation.borderDashArray;
                newAnnotation.lineHeadStart = annotation.lineHeadStartStyle;
                newAnnotation.lineHeadEnd = annotation.lineHeadEndStyle;
            } else {
                newAnnotation.opacity = annotation.opacity;
                newAnnotation.fillColor = annotation.fillColor;
                newAnnotation.strokeColor = annotation.strokeColor;
                newAnnotation.thickness = annotation.thickness;
            }
        }
        let date: Date = new Date();
        newAnnotation.modifiedDate = date.toLocaleString();
        return newAnnotation;
    }

    /**
     * @private
     */
    public updateAnnotationAuthor(annotationType: string, annotationSubType?: string): string {
        let annotationAuthor: string;
        if (annotationType === 'sticky') {
            annotationAuthor = this.pdfViewer.stickyNotesSettings.author;
        } else if (annotationType === 'stamp') {
            annotationAuthor = this.pdfViewer.stampSettings.author;
        } else if (annotationType === 'shape') {
            if (annotationSubType === 'Line') {
                annotationAuthor = this.pdfViewer.lineSettings.author;
            } else if (annotationSubType === 'LineWidthArrowHead' || annotationSubType === 'Arrow') {
                annotationAuthor = this.pdfViewer.arrowSettings.author;
            } else if (annotationSubType === 'Circle' || annotationSubType === 'Ellipse' || annotationSubType === 'Oval') {
                annotationAuthor = this.pdfViewer.circleSettings.author;
            } else if (annotationSubType === 'Rectangle' || annotationSubType === 'Square') {
                annotationAuthor = this.pdfViewer.rectangleSettings.author;
            } else if (annotationSubType === 'Polygon') {
                annotationAuthor = this.pdfViewer.polygonSettings.author;
            } else {
                annotationAuthor = this.pdfViewer.rectangleSettings.author;
            }
        } else if (annotationType === 'measure') {
            if (annotationSubType === 'Distance' || annotationSubType === 'Distance calculation') {
                annotationAuthor = this.pdfViewer.distanceSettings.author;
            } else if (annotationSubType === 'Perimeter' || annotationSubType === 'Perimeter calculation') {
                annotationAuthor = this.pdfViewer.perimeterSettings.author;
            } else if (annotationSubType === 'Radius' || annotationSubType === 'Radius calculation') {
                annotationAuthor = this.pdfViewer.radiusSettings.author;
            } else if (annotationSubType === 'Area' || annotationSubType === 'Area calculation') {
                annotationAuthor = this.pdfViewer.areaSettings.author;
            } else if (annotationSubType === 'Volume' || annotationSubType === 'Volume calculation') {
                annotationAuthor = this.pdfViewer.volumeSettings.author;
            } else {
                annotationAuthor = this.pdfViewer.distanceSettings.author;
            }
        } else if (annotationType === 'textMarkup') {
            if (annotationSubType === 'Highlight') {
                annotationAuthor = this.pdfViewer.highlightSettings.author;
            } else if (annotationSubType === 'Underline') {
                annotationAuthor = this.pdfViewer.underlineSettings.author;
            } else if (annotationSubType === 'Strikethrough') {
                annotationAuthor = this.pdfViewer.strikethroughSettings.author;
            } else {
                annotationAuthor = this.pdfViewer.highlightSettings.author;
            }
        } else {
            annotationAuthor = this.pdfViewer.stickyNotesSettings.author;
        }
        return annotationAuthor;
    }

    /**
     * @private
     */
    public clear(): void {
        this.shapeAnnotationModule.shapeCount = 0;
        this.measureAnnotationModule.measureShapeCount = 0;
        if (this.textMarkupAnnotationModule) {
            this.textMarkupAnnotationModule.clear();
        }
        if (this.stickyNotesAnnotationModule) {
            this.stickyNotesAnnotationModule.clear();
        }
        this.pdfViewer.refresh();
        this.undoCommentsElement = [];
        this.redoCommentsElement = [];
        // tslint:disable-next-line:max-line-length
        if (this.pdfViewer.annotation && this.pdfViewer.annotation.stampAnnotationModule) {
            this.pdfViewer.annotation.stampAnnotationModule.stampPageNumber = [];
        }
        window.sessionStorage.removeItem(this.pdfViewerBase.documentId + '_annotations_shape');
        window.sessionStorage.removeItem(this.pdfViewerBase.documentId + '_annotations_shape_measure');
        window.sessionStorage.removeItem(this.pdfViewerBase.documentId + '_annotations_stamp');
        window.sessionStorage.removeItem(this.pdfViewerBase.documentId + '_annotations_sticky');
    }

    /**
     * @private
     */
    // tslint:disable-next-line
    public cloneObject(obj: any): any {
        return JSON.parse(JSON.stringify(obj));
    }

    /**
     * @private
     */
    public destroy(): void {
        this.destroyPropertiesWindow();
        this.textMarkupAnnotationModule.clear();
    }

    /**
     * @private
     */
    public getModuleName(): string {
        return 'Annotation';
    }
}