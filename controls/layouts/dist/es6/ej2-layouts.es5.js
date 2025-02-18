import { Browser, ChildProperty, Collection, Component, Draggable, Event, EventHandler, NotifyPropertyChanges, Property, addClass, append, closest, compile, detach, formatUnit, isBlazor, isNullOrUndefined, isUndefined, removeClass, select, selectAll, setStyleAttribute, updateBlazorTemplate } from '@syncfusion/ej2-base';

var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var ROOT = 'e-splitter';
var HORIZONTAL_PANE = 'e-splitter-horizontal';
var VERTICAL_PANE = 'e-splitter-vertical';
var PANE = 'e-pane';
var SPLIT_H_PANE = 'e-pane-horizontal';
var SPLIT_V_PANE = 'e-pane-vertical';
var SPLIT_BAR = 'e-split-bar';
var SPLIT_H_BAR = 'e-split-bar-horizontal';
var SPLIT_V_BAR = 'e-split-bar-vertical';
var STATIC_PANE = 'e-static-pane';
var SCROLL_PANE = 'e-scrollable';
var RESIZE_BAR = 'e-resize-handler';
var RESIZABLE_BAR = 'e-resizable-split-bar';
var SPLIT_BAR_HOVER = 'e-split-bar-hover';
var SPLIT_BAR_ACTIVE = 'e-split-bar-active';
var HIDE_HANDLER = 'e-hide-handler';
var SPLIT_TOUCH = 'e-splitter-touch';
var DISABLED = 'e-disabled';
var RTL = 'e-rtl';
var E_ICONS = 'e-icons';
var COLLAPSIBLE = 'e-collapsible';
var NAVIGATE_ARROW = 'e-navigate-arrow';
var ARROW_RIGHT = 'e-arrow-right';
var ARROW_LEFT = 'e-arrow-left';
var ARROW_UP = 'e-arrow-up';
var ARROW_DOWN = 'e-arrow-down';
var HIDE_ICON = 'e-icon-hidden';
var EXPAND_PANE = 'e-expanded';
var COLLAPSE_PANE = 'e-collapsed';
var PANE_HIDDEN = 'e-pane-hidden';
var RESIZABLE_PANE = 'e-resizable';
var LAST_BAR = 'e-last-bar';
/**
 * Interface to configure pane properties such as its content, size, min, max, resizable, collapsed and collapsible.
 */
var PaneProperties = /** @__PURE__ @class */ (function (_super) {
    __extends(PaneProperties, _super);
    function PaneProperties() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        Property()
    ], PaneProperties.prototype, "size", void 0);
    __decorate([
        Property(false)
    ], PaneProperties.prototype, "collapsible", void 0);
    __decorate([
        Property(false)
    ], PaneProperties.prototype, "collapsed", void 0);
    __decorate([
        Property(true)
    ], PaneProperties.prototype, "resizable", void 0);
    __decorate([
        Property(null)
    ], PaneProperties.prototype, "min", void 0);
    __decorate([
        Property(null)
    ], PaneProperties.prototype, "max", void 0);
    __decorate([
        Property()
    ], PaneProperties.prototype, "content", void 0);
    return PaneProperties;
}(ChildProperty));
/**
 * Splitter is a layout user interface (UI) control that has resizable and collapsible split panes.
 * The container can be split into multiple panes, which are oriented horizontally or vertically.
 * The separator (divider) splits the panes and resizes and expands/collapses the panes.
 * The splitter is placed inside the split pane to make a nested layout user interface.
 *
 * ```html
 * <div id="splitter">
 *  <div> Left Pane </div>
 *  <div> Center Pane </div>
 *  <div> Right Pane </div>
 * </div>
 * ```
 * ```typescript
 * <script>
 *   var splitterObj = new Splitter({ width: '300px', height: '200px'});
 *   splitterObj.appendTo('#splitter');
 * </script>
 * ```
 */
var Splitter = /** @__PURE__ @class */ (function (_super) {
    __extends(Splitter, _super);
    /**
     * Initializes a new instance of the Splitter class.
     * @param options  - Specifies Splitter model properties as options.
     * @param element  - Specifies the element that is rendered as an Splitter.
     */
    function Splitter(options, element) {
        var _this = _super.call(this, options, element) || this;
        _this.allPanes = [];
        _this.paneOrder = [];
        _this.separatorOrder = [];
        _this.allBars = [];
        _this.previousCoordinates = {};
        _this.currentCoordinates = {};
        _this.updatePrePaneInPercentage = false;
        _this.updateNextPaneInPercentage = false;
        _this.panesDimensions = [];
        _this.border = 0;
        _this.validDataAttributes = ['data-size', 'data-min', 'data-max', 'data-collapsible', 'data-resizable', 'data-content', 'data-collapsed'];
        _this.validElementAttributes = ['data-orientation', 'data-width', 'data-height'];
        _this.iconsDelay = 300;
        return _this;
    }
    /**
     * Gets called when the model property changes.The data that describes the old and new values of the property that changed.
     * @param  {SplitterModel} newProp
     * @param  {SplitterModel} oldProp
     * @returns void
     * @private
     */
    Splitter.prototype.onPropertyChanged = function (newProp, oldProp) {
        if (!this.element.classList.contains(ROOT)) {
            return;
        }
        for (var _i = 0, _a = Object.keys(newProp); _i < _a.length; _i++) {
            var prop = _a[_i];
            switch (prop) {
                case 'height':
                    this.setSplitterSize(this.element, newProp.height, 'height');
                    break;
                case 'width':
                    this.setSplitterSize(this.element, newProp.width, 'width');
                    break;
                case 'cssClass':
                    this.setCssClass(newProp.cssClass);
                    break;
                case 'enabled':
                    this.isEnabled(this.enabled);
                    break;
                case 'separatorSize':
                    this.setSeparatorSize(newProp.separatorSize);
                    break;
                case 'orientation':
                    this.changeOrientation(newProp.orientation);
                    break;
                case 'paneSettings':
                    if (!(newProp.paneSettings instanceof Array && oldProp.paneSettings instanceof Array)) {
                        var paneCounts = Object.keys(newProp.paneSettings);
                        for (var i = 0; i < paneCounts.length; i++) {
                            var index = parseInt(Object.keys(newProp.paneSettings)[i], 10);
                            var changedPropsCount = Object.keys(newProp.paneSettings[index]).length;
                            for (var j = 0; j < changedPropsCount; j++) {
                                var property = Object.keys(newProp.paneSettings[index])[j];
                                switch (property) {
                                    case 'content':
                                        var newValue = Object(newProp.paneSettings[index])[property];
                                        if (!isNullOrUndefined(newValue)) {
                                            this.allPanes[index].innerHTML = '';
                                            this.setTemplate(newValue, this.allPanes[index]);
                                        }
                                        break;
                                    case 'resizable':
                                        var newVal = Object(newProp.paneSettings[index])[property];
                                        this.resizableModel(index, newVal);
                                        break;
                                    case 'collapsible':
                                        this.collapsibleModelUpdate(index);
                                        break;
                                    case 'collapsed':
                                        newProp.paneSettings[index].collapsed ? this.isCollapsed() : this.collapsedOnchange(index);
                                        break;
                                    case 'size':
                                        var newValSize = Object(newProp.paneSettings[index])[property];
                                        if (newValSize !== '' && !isNullOrUndefined(newValSize)) {
                                            this.allPanes[index].style.flexBasis = newValSize;
                                            this.allPanes[index].classList.add(STATIC_PANE);
                                        }
                                        break;
                                }
                            }
                        }
                    }
                    else {
                        this.destroyPaneSettings();
                        this.allBars = [];
                        this.allPanes = [];
                        this.createSplitPane(this.element);
                        this.addSeparator(this.element);
                        this.getPanesDimensions();
                        this.setRTL(this.enableRtl);
                        this.isCollapsed();
                    }
                    break;
                case 'enableRtl':
                    this.setRTL(newProp.enableRtl);
                    break;
            }
        }
    };
    Splitter.prototype.preRender = function () {
        this.wrapper = this.element.cloneNode(true);
        this.wrapperParent = this.element.parentElement;
        removeClass([this.wrapper], ['e-control', 'e-lib', ROOT]);
        var orientation = this.orientation === 'Horizontal' ? HORIZONTAL_PANE : VERTICAL_PANE;
        addClass([this.element], orientation);
        if (Browser.isDevice) {
            addClass([this.element], SPLIT_TOUCH);
        }
    };
    Splitter.prototype.getPersistData = function () {
        return this.addOnPersist([]);
    };
    /**
     * Returns the current module name.
     * @returns string
     * @private
     */
    Splitter.prototype.getModuleName = function () {
        return 'splitter';
    };
    /**
     * To Initialize the control rendering
     * @private
     */
    Splitter.prototype.render = function () {
        this.checkDataAttributes();
        this.setCssClass(this.cssClass);
        this.isEnabled(this.enabled);
        this.setDimension(this.getHeight(this.element), this.getWidth(this.element));
        this.createSplitPane(this.element);
        this.addSeparator(this.element);
        this.getPanesDimensions();
        this.setPaneSettings();
        this.setRTL(this.enableRtl);
        this.isCollapsed();
        EventHandler.add(document, 'touchstart click', this.onDocumentClick, this);
        this.renderComplete();
    };
    Splitter.prototype.onDocumentClick = function (e) {
        if (!e.target.classList.contains(SPLIT_BAR) && !isNullOrUndefined(this.currentSeparator)) {
            this.currentSeparator.classList.remove(SPLIT_BAR_HOVER);
            this.currentSeparator.classList.remove(SPLIT_BAR_ACTIVE);
        }
    };
    Splitter.prototype.checkDataAttributes = function () {
        var api;
        var value;
        // Element values
        for (var dataIndex = 0; dataIndex < this.validElementAttributes.length; dataIndex++) {
            value = this.element.getAttribute(this.validElementAttributes[dataIndex]);
            if (!isNullOrUndefined(value)) {
                api = this.removeDataPrefix(this.validElementAttributes[dataIndex]);
                // tslint:disable-next-line
                this[api] = value;
            }
        }
        // Pane values
        for (var paneIndex = 0; paneIndex < this.element.children.length; paneIndex++) {
            for (var dataAttr = 0; dataAttr < this.validDataAttributes.length; dataAttr++) {
                value = this.element.children[paneIndex].getAttribute(this.validDataAttributes[dataAttr]);
                if (!isNullOrUndefined(value)) {
                    api = this.removeDataPrefix(this.validDataAttributes[dataAttr]);
                    value = (api === 'collapsible' || api === 'resizable') ? (value === 'true') : value;
                    if (isNullOrUndefined(this.paneSettings[paneIndex])) {
                        this.paneSettings[paneIndex] = {
                            size: '',
                            min: null,
                            max: null,
                            content: '',
                            resizable: true,
                            collapsible: false,
                            collapsed: false
                        };
                    }
                    // tslint:disable-next-line
                    var paneAPI = this.paneSettings[paneIndex][api];
                    if (api === 'resizable' || api === 'collapsible' || api === 'collapsed') {
                        // tslint:disable-next-line
                        this.paneSettings[paneIndex][api] = value;
                    }
                    if (isNullOrUndefined(paneAPI) || paneAPI === '') {
                        // tslint:disable-next-line
                        this.paneSettings[paneIndex][api] = value;
                    }
                }
            }
        }
    };
    Splitter.prototype.destroyPaneSettings = function () {
        [].slice.call(this.element.children).forEach(function (el) { detach(el); });
    };
    Splitter.prototype.setPaneSettings = function () {
        var childCount = this.allPanes.length;
        var paneCollection = [];
        var paneValue = {
            size: '',
            min: null,
            max: null,
            content: '',
            resizable: true,
            collapsed: false,
            collapsible: false
        };
        for (var i = 0; i < childCount; i++) {
            if (isNullOrUndefined(this.paneSettings[i])) {
                paneCollection[i] = paneValue;
            }
            else {
                paneCollection[i] = this.paneSettings[i];
            }
        }
        this.setProperties({ 'paneSettings': paneCollection }, true);
    };
    Splitter.prototype.checkArrow = function (paneIndex, targetArrow) {
        return (this.allBars[paneIndex].querySelector('.' + NAVIGATE_ARROW + '.' + targetArrow));
    };
    Splitter.prototype.removeDataPrefix = function (attribute) {
        return attribute.slice(attribute.lastIndexOf('-') + 1);
    };
    Splitter.prototype.setRTL = function (rtl) {
        rtl ? addClass([this.element], RTL) : removeClass([this.element], RTL);
    };
    Splitter.prototype.setSplitterSize = function (element, size, property) {
        var style = property === 'width' ? { 'width': formatUnit(size) } : { 'height': formatUnit(size) };
        setStyleAttribute(element, style);
    };
    Splitter.prototype.getPanesDimensions = function () {
        for (var index = 0; index < this.allPanes.length; index++) {
            this.orientation === 'Horizontal' ? this.panesDimensions.push(this.allPanes[index].getBoundingClientRect().width) :
                this.panesDimensions.push(this.allPanes[index].getBoundingClientRect().height);
        }
    };
    Splitter.prototype.setCssClass = function (className) {
        if (className) {
            addClass([this.element], className.split(className.indexOf(',') > -1 ? ',' : ' '));
        }
    };
    Splitter.prototype.hideResizer = function (target) {
        addClass([select('.' + RESIZE_BAR, target)], HIDE_HANDLER);
    };
    Splitter.prototype.showResizer = function (target) {
        if (!isNullOrUndefined(this.previousPane) && this.previousPane.classList.contains(RESIZABLE_PANE) &&
            !isNullOrUndefined(this.nextPane) && this.nextPane.classList.contains(RESIZABLE_PANE)) {
            removeClass([select('.' + RESIZE_BAR, target)], HIDE_HANDLER);
        }
    };
    Splitter.prototype.resizableModel = function (index, newVal) {
        var paneIndex;
        var i = index;
        paneIndex = (index === (this.allBars.length)) ? (index - 1) : index;
        EventHandler.remove(this.allBars[paneIndex], 'mousedown', this.onMouseDown);
        if (newVal) {
            EventHandler.add(this.allBars[paneIndex], 'mousedown', this.onMouseDown, this);
            if (this.isResizable()) {
                this.showResizer(this.allBars[paneIndex]);
                removeClass([select('.' + RESIZE_BAR, this.allBars[paneIndex])], HIDE_HANDLER);
                this.allBars[paneIndex].classList.add(RESIZABLE_BAR);
                (index === (this.allBars.length)) ? this.allPanes[index].classList.add(RESIZABLE_PANE) :
                    this.allPanes[paneIndex].classList.add(RESIZABLE_PANE);
                this.updateResizablePanes(i);
            }
        }
        else {
            this.updateResizablePanes(i);
            this.hideResizer(this.allBars[paneIndex]);
            this.allBars[paneIndex].classList.remove(RESIZABLE_BAR);
            (index === (this.allBars.length)) ? this.allPanes[index].classList.remove(RESIZABLE_PANE) :
                this.allPanes[paneIndex].classList.remove(RESIZABLE_PANE);
        }
    };
    Splitter.prototype.collapsibleModelUpdate = function (index) {
        var arrow2;
        var arrow1;
        var paneIndex;
        paneIndex = index === (this.allBars.length) ? (index - 1) : index;
        arrow2 = (this.orientation === 'Horizontal') ? this.checkArrow(paneIndex, ARROW_LEFT) : this.checkArrow(paneIndex, ARROW_UP);
        arrow1 = (this.orientation === 'Horizontal') ? this.checkArrow(paneIndex, ARROW_RIGHT) : this.checkArrow(paneIndex, ARROW_DOWN);
        this.paneCollapsible(this.allPanes[index], index);
        this.updateCollapseIcons(paneIndex, arrow1, arrow2);
    };
    Splitter.prototype.collapseArrow = function (barIndex, arrow) {
        return selectAll('.' + arrow, this.allBars[barIndex])[0];
    };
    Splitter.prototype.updateIsCollapsed = function (index, collapseArrow, lastBarArrow) {
        if (!isNullOrUndefined(index)) {
            var targetEle = void 0;
            var lastBarIndex = (index === this.allBars.length);
            var barIndex = lastBarIndex ? index - 1 : index;
            targetEle = (lastBarIndex) ? this.collapseArrow(barIndex, lastBarArrow) : this.collapseArrow(barIndex, collapseArrow);
            targetEle.click();
        }
    };
    Splitter.prototype.isCollapsed = function (index) {
        if (!isNullOrUndefined(index)) {
            this.updateIsCollapsed(index, this.targetArrows().collapseArrow, this.targetArrows().lastBarArrow);
        }
        else {
            for (var m = 0; m < this.allPanes.length; m++) {
                if (!isNullOrUndefined(this.paneSettings[m]) && this.paneSettings[m].collapsed) {
                    this.updateIsCollapsed(m, this.targetArrows().collapseArrow, this.targetArrows().lastBarArrow);
                }
            }
        }
    };
    Splitter.prototype.targetArrows = function () {
        this.splitterProperty();
        return { collapseArrow: (this.orientation === 'Horizontal') ? ARROW_LEFT : ARROW_UP,
            lastBarArrow: (this.orientation === 'Vertical') ? ARROW_DOWN : ARROW_RIGHT
        };
    };
    Splitter.prototype.collapsedOnchange = function (index) {
        if (!isNullOrUndefined(this.paneSettings[index]) && !isNullOrUndefined(this.paneSettings[index].collapsed)
            && !this.paneSettings[index].collapsed) {
            this.updateIsCollapsed(index, this.targetArrows().lastBarArrow, this.targetArrows().collapseArrow);
        }
    };
    Splitter.prototype.isEnabled = function (enabled) {
        enabled ? removeClass([this.element], DISABLED) : addClass([this.element], DISABLED);
    };
    Splitter.prototype.setSeparatorSize = function (size) {
        var sizeValue = isNullOrUndefined(size) ? 'auto' : size + 'px';
        var seaprator = this.orientation === 'Horizontal' ? SPLIT_H_BAR : SPLIT_V_BAR;
        for (var index = 0; index < this.allBars.length; index++) {
            var splitBar = selectAll('.' + seaprator, this.element)[index];
            var resizeBar = selectAll('.' + RESIZE_BAR, splitBar)[0];
            if (this.orientation === 'Horizontal') {
                splitBar.style.width = sizeValue;
                if (!isNullOrUndefined(resizeBar)) {
                    resizeBar.style.width = sizeValue;
                }
            }
            else {
                splitBar.style.height = sizeValue;
                if (!isNullOrUndefined(resizeBar)) {
                    resizeBar.style.height = sizeValue;
                }
            }
        }
    };
    Splitter.prototype.changeOrientation = function (orientation) {
        var isVertical = orientation === 'Vertical';
        this.element.classList.remove(isVertical ? HORIZONTAL_PANE : VERTICAL_PANE);
        this.element.classList.add(isVertical ? VERTICAL_PANE : HORIZONTAL_PANE);
        for (var index = 0; index < this.allPanes.length; index++) {
            this.allPanes[index].classList.remove(isVertical ? SPLIT_H_PANE : SPLIT_V_PANE);
            this.allPanes[index].classList.add(isVertical ? SPLIT_V_PANE : SPLIT_H_PANE);
        }
        for (var index = 0; index < this.allBars.length; index++) {
            detach(this.allBars[index]);
        }
        this.allBars = [];
        this.addSeparator(this.element);
    };
    Splitter.prototype.checkSplitPane = function (currentBar, elementIndex) {
        var paneEle = this.collectPanes(currentBar.parentElement.children)[elementIndex];
        return paneEle;
    };
    Splitter.prototype.collectPanes = function (childNodes) {
        var elements = [];
        for (var i = 0; i < childNodes.length; i++) {
            if (childNodes[i].classList.contains('e-pane')) {
                elements.push(childNodes[i]);
            }
        }
        return elements;
    };
    Splitter.prototype.getPrevPane = function (currentBar, order) {
        return this.checkSplitPane(currentBar, ((order - 1) / (2)));
    };
    Splitter.prototype.getNextPane = function (currentBar, order) {
        return this.checkSplitPane(currentBar, (((order - 1) / 2) + 1));
    };
    Splitter.prototype.addResizeHandler = function (currentBar) {
        var resizeHanlder = this.createElement('div');
        addClass([resizeHanlder], [RESIZE_BAR, E_ICONS]);
        var sizeValue = isNullOrUndefined(this.separatorSize) ? '1px' : this.separatorSize + 'px';
        this.orientation === 'Horizontal' ? (resizeHanlder.style.width = sizeValue) : resizeHanlder.style.height = sizeValue;
        currentBar.appendChild(resizeHanlder);
    };
    Splitter.prototype.getHeight = function (target) {
        var height = this.height;
        height = target.style.height !== '' && this.height === '100%' ? target.style.height : this.height;
        return height;
    };
    Splitter.prototype.getWidth = function (target) {
        var width = this.width;
        width = target.style.width !== '' && this.width === '100%' ? target.style.width : this.width;
        return width;
    };
    Splitter.prototype.setDimension = function (height, width) {
        setStyleAttribute(this.element, { 'height': height, 'width': width });
    };
    Splitter.prototype.updateCollapseIcons = function (index, arrow1, arrow2) {
        if (!isNullOrUndefined(this.paneSettings[index])) {
            if (!isNullOrUndefined(this.paneSettings[index].collapsible)) {
                this.paneSettings[index].collapsible ? removeClass([arrow2], [HIDE_ICON]) : addClass([arrow2], [HIDE_ICON]);
                if (!isNullOrUndefined(this.paneSettings[index + 1])) {
                    this.paneSettings[index + 1].collapsible ? removeClass([arrow1], [HIDE_ICON]) : addClass([arrow1], [HIDE_ICON]);
                }
                if (!isNullOrUndefined(this.paneSettings[index + 1])) {
                    if ((this.paneSettings[index + 1].collapsible)) {
                        this.paneSettings[index + 1].collapsible ? removeClass([arrow1], [HIDE_ICON]) : addClass([arrow1], [HIDE_ICON]);
                    }
                }
            }
        }
    };
    Splitter.prototype.createSeparator = function (i) {
        var separator = this.createElement('div');
        this.allBars.push(separator);
        var arrow1 = this.createElement('button');
        var arrow2 = this.createElement('button');
        var size;
        size = isNullOrUndefined(this.separatorSize) ? '1px' : this.separatorSize + 'px';
        if (this.orientation === 'Horizontal') {
            this.leftArrow = ARROW_LEFT;
            this.rightArrow = ARROW_RIGHT;
            addClass([arrow2], [NAVIGATE_ARROW, ARROW_LEFT, HIDE_ICON]);
            addClass([arrow1], [NAVIGATE_ARROW, ARROW_RIGHT, HIDE_ICON]);
            addClass([separator], [SPLIT_BAR, SPLIT_H_BAR]);
            separator.style.width = size;
        }
        else {
            addClass([arrow1], [NAVIGATE_ARROW, ARROW_DOWN, HIDE_ICON]);
            addClass([arrow2], [NAVIGATE_ARROW, ARROW_UP, HIDE_ICON]);
            addClass([separator], [SPLIT_BAR, SPLIT_V_BAR]);
            this.leftArrow = ARROW_UP;
            this.rightArrow = ARROW_DOWN;
            separator.style.height = size;
        }
        this.addMouseActions(separator);
        separator.appendChild(arrow2);
        this.addResizeHandler(separator);
        separator.appendChild(arrow1);
        this.updateCollapseIcons(i, arrow1, arrow2);
        return separator;
    };
    Splitter.prototype.updateResizablePanes = function (index) {
        this.getPaneDetails();
        this.isResizable() ? this.allPanes[index].classList.add(RESIZABLE_PANE) : this.allPanes[index].classList.remove(RESIZABLE_PANE);
    };
    Splitter.prototype.addSeparator = function (target) {
        var childCount = this.allPanes.length;
        var clonedEle = target.children;
        var separator;
        for (var i = 0; i < childCount; i++) {
            if (i < childCount - 1) {
                separator = this.createSeparator(i);
                setStyleAttribute(separator, { 'order': (i * 2) + 1 });
                this.separatorOrder.push((i * 2) + 1);
                clonedEle[i].parentNode.appendChild(separator);
                this.currentSeparator = separator;
                separator.setAttribute('role', 'separator');
                separator.setAttribute('aria-orientation', this.orientation.toLowerCase());
                this.wireClickEvents();
                if (this.isResizable()) {
                    EventHandler.add(separator, 'mousedown', this.onMouseDown, this);
                    var eventName = (Browser.info.name === 'msie') ? 'pointerdown' : 'touchstart';
                    EventHandler.add(separator, eventName, this.onMouseDown, this);
                    separator.classList.add(RESIZABLE_BAR);
                    this.updateResizablePanes(i);
                }
                else {
                    addClass([select('.' + RESIZE_BAR, separator)], HIDE_HANDLER);
                }
            }
            else {
                this.updateResizablePanes(i);
                addClass([separator], LAST_BAR);
            }
        }
    };
    Splitter.prototype.isResizable = function () {
        var resizable = false;
        if ((!isNullOrUndefined(this.paneSettings[this.getPreviousPaneIndex()]) &&
            this.paneSettings[this.getPreviousPaneIndex()].resizable &&
            !isNullOrUndefined(this.paneSettings[this.getNextPaneIndex()]) &&
            this.paneSettings[this.getNextPaneIndex()].resizable) ||
            isNullOrUndefined(this.paneSettings[this.getNextPaneIndex()])) {
            resizable = true;
        }
        return resizable;
    };
    Splitter.prototype.addMouseActions = function (separator) {
        var _this = this;
        var sTout;
        var hoverTimeOut;
        separator.addEventListener('mouseenter', function () {
            /* istanbul ignore next */
            sTout = setTimeout(function () { addClass([separator], [SPLIT_BAR_HOVER]); }, _this.iconsDelay);
        });
        separator.addEventListener('mouseleave', function () {
            clearTimeout(sTout);
            removeClass([separator], [SPLIT_BAR_HOVER]);
        });
        separator.addEventListener('mouseout', function () {
            clearTimeout(hoverTimeOut);
        });
        separator.addEventListener('mouseover', function () {
            /* istanbul ignore next */
            hoverTimeOut = setTimeout(function () { addClass([separator], [SPLIT_BAR_HOVER]); }, _this.iconsDelay);
        });
    };
    Splitter.prototype.getEventType = function (e) {
        return (e.indexOf('mouse') > -1) ? 'mouse' : 'touch';
    };
    Splitter.prototype.updateCurrentSeparator = function (target) {
        this.currentSeparator = this.isSeparator(target) ? target.parentElement : target;
    };
    Splitter.prototype.isSeparator = function (target) {
        return ((target.classList.contains(RESIZE_BAR) || target.classList.contains(SPLIT_BAR)) ? false : true);
    };
    Splitter.prototype.isMouseEvent = function (e) {
        var isMouse = false;
        if (this.getEventType(e.type) === 'mouse' || (!isNullOrUndefined(e.pointerType) &&
            this.getEventType(e.pointerType) === 'mouse')) {
            isMouse = true;
        }
        return isMouse;
    };
    Splitter.prototype.updateCursorPosition = function (e, type) {
        if (this.isMouseEvent(e)) {
            this.changeCoordinates({ x: e.pageX, y: e.pageY }, type);
        }
        else {
            var eventType = Browser.info.name !== 'msie' ? e.touches[0] : e;
            this.changeCoordinates({ x: eventType.pageX, y: eventType.pageY }, type);
        }
    };
    Splitter.prototype.changeCoordinates = function (coordinates, type) {
        if (type === 'previous') {
            this.previousCoordinates = coordinates;
        }
        else {
            this.currentCoordinates = coordinates;
        }
    };
    Splitter.prototype.reportWindowSize = function () {
        var paneCount = this.allPanes.length;
        for (var i = 0; i < paneCount; i++) {
            if (isNullOrUndefined(this.paneSettings[i].size)) {
                this.allPanes[i].classList.remove(STATIC_PANE);
            }
            if (paneCount - 1 === i) {
                var staticPaneCount = this.element.querySelectorAll('.' + STATIC_PANE).length;
                if (staticPaneCount === paneCount) {
                    removeClass([this.allPanes[i]], STATIC_PANE);
                }
            }
        }
    };
    Splitter.prototype.wireResizeEvents = function () {
        EventHandler.add(document, 'mousemove', this.onMouseMove, this);
        window.addEventListener('resize', this.reportWindowSize.bind(this));
        EventHandler.add(document, 'mouseup', this.onMouseUp, this);
        var touchMoveEvent = (Browser.info.name === 'msie') ? 'pointermove' : 'touchmove';
        var touchEndEvent = (Browser.info.name === 'msie') ? 'pointerup' : 'touchend';
        EventHandler.add(document, touchMoveEvent, this.onMouseMove, this);
        EventHandler.add(document, touchEndEvent, this.onMouseUp, this);
    };
    Splitter.prototype.unwireResizeEvents = function () {
        window.removeEventListener('resize', this.reportWindowSize.bind(this));
        var touchMoveEvent = (Browser.info.name === 'msie') ? 'pointermove' : 'touchmove';
        var touchEndEvent = (Browser.info.name === 'msie') ? 'pointerup' : 'touchend';
        EventHandler.remove(document, 'mousemove', this.onMouseMove);
        EventHandler.remove(document, 'mouseup', this.onMouseUp);
        EventHandler.remove(document, touchMoveEvent, this.onMouseMove);
        EventHandler.remove(document, touchEndEvent, this.onMouseUp);
    };
    Splitter.prototype.wireClickEvents = function () {
        EventHandler.add(this.currentSeparator, 'touchstart click', this.clickHandler, this);
    };
    Splitter.prototype.clickHandler = function (e) {
        if (!e.target.classList.contains(NAVIGATE_ARROW)) {
            var hoverBars = selectAll('.' + ROOT + ' > .' + SPLIT_BAR + '.' + SPLIT_BAR_HOVER);
            if (hoverBars.length > 0) {
                removeClass(hoverBars, SPLIT_BAR_HOVER);
            }
            e.target.classList.add(SPLIT_BAR_HOVER);
        }
        var icon = e.target;
        if (icon.classList.contains(ARROW_LEFT) || icon.classList.contains(ARROW_UP)) {
            this.collapseAction(e);
        }
        if (icon.classList.contains(ARROW_RIGHT) || icon.classList.contains(ARROW_DOWN)) {
            this.expandAction(e);
        }
    };
    Splitter.prototype.expandAction = function (e) {
        var _this = this;
        this.splitterDetails(e);
        var collapseClass = [COLLAPSE_PANE, PANE_HIDDEN];
        var eventArgs = this.beforeAction(e);
        this.trigger('beforeExpand', eventArgs, function (beforeExpandArgs) {
            if (!beforeExpandArgs.cancel) {
                _this.nextPane.style.flexGrow = '0';
                if (_this.previousPane.classList.contains('e-collapsed') && _this.previousPane.style.flexGrow === '0') {
                    _this.previousPane.style.flexGrow = '0';
                }
                else {
                    _this.previousPane.style.flexGrow = '1';
                }
                if (!_this.previousPane.classList.contains(COLLAPSE_PANE)) {
                    removeClass([_this.nextPane], EXPAND_PANE);
                    removeClass([_this.previousPane], collapseClass);
                    addClass([_this.previousPane], EXPAND_PANE);
                    addClass([_this.nextPane], collapseClass);
                }
                else {
                    (_this.currentBarIndex !== 0) ?
                        _this.previousPane.previousElementSibling.style.flexGrow = '' : _this.nextPane.style.flexGrow = '';
                    removeClass([_this.previousPane], collapseClass);
                    removeClass([_this.nextPane], EXPAND_PANE);
                }
                _this.updateIconsOnExpand(e);
                _this.previousPane.setAttribute('aria-expanded', 'true');
                _this.nextPane.setAttribute('aria-expanded', 'false');
                var expandEventArgs = _this.afterAction(e);
                _this.trigger('expanded', expandEventArgs);
            }
        });
    };
    Splitter.prototype.hideTargetBarIcon = function (targetBar, targetArrow) {
        addClass([select('.' + targetArrow, targetBar)], HIDE_ICON);
    };
    Splitter.prototype.showTargetBarIcon = function (targetBar, targetArrow) {
        removeClass([select('.' + targetArrow, targetBar)], HIDE_ICON);
    };
    Splitter.prototype.updateIconsOnCollapse = function (e) {
        this.splitterProperty();
        if (this.splitInstance.prevPaneCollapsed && this.splitInstance.nextPaneExpanded) {
            addClass([e.target], HIDE_ICON);
            this.showCurrentBarIcon();
            this.resizableModel(this.currentBarIndex, false);
            if (!isNullOrUndefined(this.prevBar)) {
                this.resizableModel(this.currentBarIndex - 1, false);
                this.hideTargetBarIcon(this.prevBar, this.arrow);
                // first pane collapsible false
                this.showTargetBarIcon(this.prevBar, this.leftArrow);
            }
        }
        else if (!this.splitInstance.prevPaneCollapsed && !this.splitInstance.nextPaneExpanded) {
            this.resizableModel(this.currentBarIndex, true);
            if (!this.splitInstance.nextPaneNextEle.classList.contains('e-collapsed')) {
                this.resizableModel(this.currentBarIndex + 1, true);
            }
            this.showCurrentBarIcon();
            if (!this.paneSettings[this.currentBarIndex].collapsible) {
                addClass([e.target], HIDE_ICON);
            }
            if (!isNullOrUndefined(this.nextBar)) {
                this.showTargetBarIcon(this.nextBar, this.leftArrow);
                if (!this.paneSettings[this.currentBarIndex].collapsible && this.paneSettings[this.currentBarIndex + 1].collapsible) {
                    this.hideTargetBarIcon(this.nextBar, this.arrow);
                }
                else if (!this.paneSettings[this.splitInstance.nextPaneIndex + 1].collapsible &&
                    this.paneSettings[this.currentBarIndex]) {
                    this.hideTargetBarIcon(this.nextBar, this.arrow);
                }
            }
        }
    };
    Splitter.prototype.collapseAction = function (e) {
        var _this = this;
        this.splitterDetails(e);
        var collapseClass = [COLLAPSE_PANE, PANE_HIDDEN];
        this.previousPane.style.flexGrow = '0';
        this.nextPane.style.flexGrow = '1';
        var eventArgs = this.beforeAction(e);
        this.trigger('beforeCollapse', eventArgs, function (beforeCollapseArgs) {
            if (!beforeCollapseArgs.cancel) {
                if (_this.nextPane.classList.contains(COLLAPSE_PANE)) {
                    removeClass([_this.previousPane], EXPAND_PANE);
                    removeClass([_this.nextPane], collapseClass);
                }
                else {
                    removeClass([_this.previousPane], EXPAND_PANE);
                    removeClass([_this.nextPane], collapseClass);
                    addClass([_this.nextPane], EXPAND_PANE);
                    addClass([_this.previousPane], collapseClass);
                }
                _this.updateIconsOnCollapse(e);
                _this.previousPane.setAttribute('aria-expanded', 'false');
                _this.nextPane.setAttribute('aria-expanded', 'true');
                var collapseEventArgs = _this.afterAction(e);
                _this.trigger('collapsed', collapseEventArgs);
            }
        });
    };
    Splitter.prototype.beforeAction = function (e) {
        var eventArgs = isBlazor() ? {
            element: this.element,
            event: e,
            index: [this.prevPaneIndex, this.nextPaneIndex],
            separator: this.currentSeparator,
            cancel: false
        } : {
            element: this.element,
            event: e,
            pane: [this.previousPane, this.nextPane],
            index: [this.prevPaneIndex, this.nextPaneIndex],
            separator: this.currentSeparator,
            cancel: false
        };
        return eventArgs;
    };
    Splitter.prototype.splitterProperty = function () {
        this.splitInstance = {
            currentBarIndex: this.currentBarIndex,
            nextPaneCollapsible: this.nextPane.classList.contains(COLLAPSIBLE),
            prevPaneCollapsible: this.previousPane.classList.contains(COLLAPSIBLE),
            prevPaneExpanded: this.previousPane.classList.contains(EXPAND_PANE),
            nextPaneExpanded: this.nextPane.classList.contains(EXPAND_PANE),
            nextPaneCollapsed: this.nextPane.classList.contains(COLLAPSE_PANE),
            prevPaneCollapsed: this.previousPane.classList.contains(COLLAPSE_PANE),
            nextPaneIndex: this.getNextPaneIndex(),
            prevPaneIndex: this.getPreviousPaneIndex(),
            nextPaneNextEle: this.nextPane.nextElementSibling,
            prevPanePreEle: this.previousPane.previousElementSibling,
        };
    };
    Splitter.prototype.showCurrentBarIcon = function () {
        removeClass([select('.' + this.arrow, this.currentSeparator)], HIDE_ICON);
    };
    Splitter.prototype.updateIconsOnExpand = function (e) {
        this.splitterProperty();
        addClass([e.target], HIDE_ICON);
        if (!this.splitInstance.prevPaneExpanded && !this.splitInstance.nextPaneCollapsed) {
            this.showCurrentBarIcon();
            removeClass([e.target], HIDE_ICON);
            this.resizableModel(this.currentBarIndex, true);
            if (!isNullOrUndefined(this.prevBar) && !this.splitInstance.prevPanePreEle.classList.contains(COLLAPSE_PANE)) {
                this.resizableModel(this.currentBarIndex - 1, true);
                this.showTargetBarIcon(this.prevBar, this.rightArrow);
                if (!this.paneSettings[this.currentBarIndex - 1].collapsible) {
                    this.hideTargetBarIcon(this.prevBar, this.arrow);
                    if (this.paneSettings[this.currentBarIndex].collapsible &&
                        !this.paneSettings[this.currentBarIndex + 1].collapsible) {
                        this.hideTargetBarIcon(this.currentSeparator, this.rightArrow);
                    }
                }
                else if (this.paneSettings[this.currentBarIndex].collapsible &&
                    !this.paneSettings[this.currentBarIndex + 1].collapsible) {
                    this.hideTargetBarIcon(this.currentSeparator, this.rightArrow);
                }
            }
            else {
                if (this.paneSettings[this.currentBarIndex].collapsible && !this.paneSettings[this.currentBarIndex + 1].collapsible) {
                    this.hideTargetBarIcon(this.currentSeparator, this.rightArrow);
                }
                else {
                    this.showTargetBarIcon(this.prevBar, this.rightArrow);
                }
            }
        }
        else if (this.splitInstance.prevPaneExpanded && this.splitInstance.nextPaneCollapsed) {
            this.resizableModel(this.currentBarIndex, false);
            this.resizableModel(this.currentBarIndex + 1, false);
            this.showCurrentBarIcon();
            if (!isNullOrUndefined(this.nextBar)) {
                this.hideTargetBarIcon(this.nextBar, this.arrow);
                // only when middle pane collapsible to true
                this.showTargetBarIcon(this.nextBar, this.rightArrow);
            }
        }
    };
    Splitter.prototype.afterAction = function (e) {
        var eventArgs = isBlazor() ? {
            element: this.element,
            event: e,
            index: [this.prevPaneIndex, this.nextPaneIndex],
            separator: this.currentSeparator
        } : {
            element: this.element,
            event: e,
            pane: [this.previousPane, this.nextPane],
            index: [this.prevPaneIndex, this.nextPaneIndex],
            separator: this.currentSeparator
        };
        return eventArgs;
    };
    Splitter.prototype.currentIndex = function (e) {
        this.currentBarIndex = this.getSeparatorIndex(e.target.parentElement);
    };
    Splitter.prototype.getSeparatorIndex = function (target) {
        var array = [].slice.call(this.allBars);
        return array.indexOf(target);
    };
    Splitter.prototype.getPrevBar = function (currentBar) {
        var prevbar = this.allBars[(currentBar - 1)];
        return prevbar;
    };
    Splitter.prototype.getNextBar = function (currentBar) {
        var prevbar = this.allBars[(currentBar + 1)];
        return prevbar;
    };
    Splitter.prototype.updateBars = function (index) {
        this.prevBar = this.getPrevBar(index);
        this.nextBar = this.getNextBar(index);
    };
    Splitter.prototype.splitterDetails = function (e) {
        if (this.orientation === 'Horizontal') {
            this.arrow = e.target.classList.contains(ARROW_LEFT) ? ARROW_RIGHT : ARROW_LEFT;
        }
        else {
            this.arrow = e.target.classList.contains(ARROW_UP) ? ARROW_DOWN : ARROW_UP;
        }
        this.updateCurrentSeparator(e.target);
        this.currentIndex(e);
        this.updateBars(this.currentBarIndex);
        this.getPaneDetails();
    };
    Splitter.prototype.onMouseDown = function (e) {
        var _this = this;
        e.preventDefault();
        var target = e.target;
        if (target.classList.contains(NAVIGATE_ARROW)) {
            return;
        }
        this.updateCurrentSeparator(target);
        addClass([this.currentSeparator], SPLIT_BAR_ACTIVE);
        this.updateCursorPosition(e, 'previous');
        this.getPaneDetails();
        var eventArgs = isBlazor() ? {
            element: this.element,
            event: e,
            index: [this.getPreviousPaneIndex(), this.getNextPaneIndex()],
            separator: this.currentSeparator,
            cancel: false
        } : {
            element: this.element,
            event: e,
            pane: [this.previousPane, this.nextPane],
            index: [this.getPreviousPaneIndex(), this.getNextPaneIndex()],
            separator: this.currentSeparator,
            cancel: false
        };
        this.trigger('resizeStart', eventArgs, function (resizeStartArgs) {
            if (!resizeStartArgs.cancel) {
                _this.wireResizeEvents();
                if (_this.previousPane.style.flexBasis.indexOf('%') > 0 || _this.nextPane.style.flexBasis.indexOf('%') > 0) {
                    var previousFlexBasis = _this.updatePaneFlexBasis(_this.previousPane);
                    var nextFlexBasis = _this.updatePaneFlexBasis(_this.nextPane);
                    _this.totalPercent = previousFlexBasis + nextFlexBasis;
                    _this.totalWidth = _this.convertPercentageToPixel(_this.totalPercent + '%');
                }
                else {
                    _this.totalWidth = (_this.orientation === 'Horizontal') ? _this.previousPane.offsetWidth + _this.nextPane.offsetWidth :
                        _this.previousPane.offsetHeight + _this.nextPane.offsetHeight;
                }
            }
        });
    };
    Splitter.prototype.updatePaneFlexBasis = function (pane) {
        var previous;
        if (pane.style.flexBasis.indexOf('%') > 0) {
            previous = this.removePercentageUnit(pane.style.flexBasis);
        }
        else {
            if (pane.style.flexBasis !== '') {
                previous = this.convertPixelToPercentage(this.convertPixelToNumber(pane.style.flexBasis));
            }
            else {
                var offset = (this.orientation === 'Horizontal') ? (pane.offsetWidth + this.currentSeparator.offsetWidth) :
                    (pane.offsetHeight + this.currentSeparator.offsetHeight);
                previous = this.convertPixelToPercentage(offset);
            }
        }
        return previous;
    };
    Splitter.prototype.removePercentageUnit = function (value) {
        return parseFloat(value.slice(0, value.indexOf('%')));
    };
    Splitter.prototype.convertPercentageToPixel = function (value, targetElement) {
        var percentage = value.toString();
        var convertedValue;
        if (percentage.indexOf('%') > -1) {
            convertedValue = parseFloat(percentage.slice(0, percentage.indexOf('%')));
            var offsetValue = void 0;
            if (!isNullOrUndefined(targetElement)) {
                offsetValue = this.panesDimensions[this.allPanes.indexOf(targetElement)];
            }
            else {
                offsetValue = (this.orientation === 'Horizontal') ? this.element.offsetWidth : this.element.offsetHeight;
            }
            convertedValue = Math.ceil(offsetValue * (convertedValue / 100));
        }
        else {
            convertedValue = parseInt(percentage, 10);
        }
        return convertedValue;
    };
    Splitter.prototype.convertPixelToPercentage = function (value) {
        var offsetValue = (this.orientation === 'Horizontal') ? this.element.offsetWidth : this.element.offsetHeight;
        return (value / offsetValue) * 100;
    };
    Splitter.prototype.convertPixelToNumber = function (value) {
        if (value.indexOf('p') > -1) {
            return parseFloat(value.slice(0, value.indexOf('p')));
        }
        else {
            return parseFloat(value);
        }
    };
    Splitter.prototype.calcDragPosition = function (rectValue, offsetValue) {
        var separatorPosition;
        var separator;
        separatorPosition = this.orientation === 'Horizontal' ? (this.currentCoordinates.x - rectValue) :
            (this.currentCoordinates.y - rectValue);
        separator = separatorPosition / offsetValue;
        separator = (separator > 1) ? 1 : (separator < 0) ? 0 : separator;
        return separator * offsetValue;
    };
    Splitter.prototype.getSeparatorPosition = function (e) {
        this.updateCursorPosition(e, 'current');
        var rectBound = (this.orientation === 'Horizontal') ? this.element.getBoundingClientRect().left :
            this.element.getBoundingClientRect().top;
        var offSet = (this.orientation === 'Horizontal') ? this.element.offsetWidth : this.element.offsetHeight;
        return this.calcDragPosition(rectBound, offSet);
    };
    Splitter.prototype.getMinMax = function (paneIndex, target, selection) {
        var defaultVal = selection === 'min' ? 0 : null;
        // tslint:disable-next-line
        var paneValue = null;
        if (selection === 'min') {
            if (!isNullOrUndefined(this.paneSettings[paneIndex]) &&
                !isNullOrUndefined(this.paneSettings[paneIndex].min)) {
                paneValue = this.paneSettings[paneIndex].min;
            }
        }
        else {
            if (!isNullOrUndefined(this.paneSettings[paneIndex]) &&
                !isNullOrUndefined(this.paneSettings[paneIndex].max)) {
                paneValue = this.paneSettings[paneIndex].max;
            }
        }
        if (this.paneSettings.length > 0 && !isNullOrUndefined(this.paneSettings[paneIndex]) &&
            !isNullOrUndefined(paneValue)) {
            if (paneValue.indexOf('%') > 0) {
                paneValue = this.convertPercentageToPixel(paneValue).toString();
            }
            return this.convertPixelToNumber(paneValue);
        }
        else {
            return defaultVal;
        }
    };
    Splitter.prototype.getPreviousPaneIndex = function () {
        var prePaneIndex = ((parseInt(this.currentSeparator.style.order, 10) - 1) / 2);
        return prePaneIndex;
    };
    Splitter.prototype.getNextPaneIndex = function () {
        var nextPaneIndex = (parseInt(this.currentSeparator.style.order, 10) - 1) / (2);
        return nextPaneIndex + 1;
    };
    Splitter.prototype.getPaneDetails = function () {
        this.order = parseInt(this.currentSeparator.style.order, 10);
        var prevPane = this.getPrevPane(this.currentSeparator, this.order);
        var nextPane = this.getNextPane(this.currentSeparator, this.order);
        if (prevPane && nextPane) {
            this.previousPane = prevPane;
            this.nextPane = nextPane;
            this.prevPaneIndex = this.getPreviousPaneIndex();
            this.nextPaneIndex = this.getNextPaneIndex();
        }
        else {
            return;
        }
    };
    Splitter.prototype.getPaneHeight = function (pane) {
        return ((this.orientation === 'Horizontal') ? pane.offsetWidth.toString() :
            pane.offsetHeight.toString());
    };
    Splitter.prototype.isValidSize = function (paneIndex) {
        var isValid = false;
        if (!isNullOrUndefined(this.paneSettings[paneIndex]) &&
            !isNullOrUndefined(this.paneSettings[paneIndex].size) &&
            this.paneSettings[paneIndex].size.indexOf('%') > -1) {
            isValid = true;
        }
        return isValid;
    };
    Splitter.prototype.getPaneDimensions = function () {
        this.previousPaneHeightWidth = (this.previousPane.style.flexBasis === '') ? this.getPaneHeight(this.previousPane) :
            this.previousPane.style.flexBasis;
        this.nextPaneHeightWidth = (this.nextPane.style.flexBasis === '') ? this.getPaneHeight(this.nextPane) :
            this.nextPane.style.flexBasis;
        if (this.isValidSize(this.prevPaneIndex)) {
            this.previousPaneHeightWidth = this.convertPercentageToPixel(this.previousPaneHeightWidth).toString();
            this.updatePrePaneInPercentage = true;
        }
        if (this.isValidSize(this.nextPaneIndex)) {
            this.nextPaneHeightWidth = this.convertPercentageToPixel(this.nextPaneHeightWidth).toString();
            this.updateNextPaneInPercentage = true;
        }
        this.prePaneDimenson = this.convertPixelToNumber(this.previousPaneHeightWidth.toString());
        this.nextPaneDimension = this.convertPixelToNumber(this.nextPaneHeightWidth.toString());
    };
    Splitter.prototype.checkCoordinates = function (pageX, pageY) {
        var coordinatesChanged = true;
        if ((pageX === this.previousCoordinates.x || pageY === this.previousCoordinates.y)) {
            coordinatesChanged = false;
        }
        return coordinatesChanged;
    };
    Splitter.prototype.isCursorMoved = function (e) {
        var cursorMoved = true;
        if (this.getEventType(e.type) === 'mouse' || (!isNullOrUndefined(e.pointerType)) &&
            this.getEventType(e.pointerType) === 'mouse') {
            cursorMoved = this.checkCoordinates(e.pageX, e.pageY);
        }
        else {
            cursorMoved = (Browser.info.name !== 'msie') ?
                this.checkCoordinates(e.touches[0].pageX, e.touches[0].pageY) :
                this.checkCoordinates(e.pageX, e.pageY);
        }
        return cursorMoved;
    };
    Splitter.prototype.getBorder = function () {
        this.border = 0;
        var border = this.orientation === 'Horizontal' ? ((this.element.offsetWidth - this.element.clientWidth) / 2) :
            (this.element.offsetHeight - this.element.clientHeight) / 2;
        this.border = Browser.info.name !== 'chrome' ? this.border : border;
    };
    Splitter.prototype.onMouseMove = function (e) {
        if (!this.isCursorMoved(e)) {
            return;
        }
        this.getPaneDetails();
        this.getPaneDimensions();
        var eventArgs = isBlazor() ? {
            element: this.element,
            event: e,
            index: [this.prevPaneIndex, this.nextPaneIndex],
            paneSize: [this.prePaneDimenson, this.nextPaneDimension],
            separator: this.currentSeparator
        } : {
            element: this.element,
            event: e,
            pane: [this.previousPane, this.nextPane],
            index: [this.prevPaneIndex, this.nextPaneIndex],
            paneSize: [this.prePaneDimenson, this.nextPaneDimension],
            separator: this.currentSeparator
        };
        this.trigger('resizing', eventArgs);
        var left = this.validateDraggedPosition(this.getSeparatorPosition(e), this.prePaneDimenson, this.nextPaneDimension);
        var separatorNewPosition;
        this.getBorder();
        if (this.orientation === 'Horizontal') {
            separatorNewPosition = (this.element.getBoundingClientRect().left + left) -
                this.currentSeparator.getBoundingClientRect().left + this.border;
        }
        else {
            separatorNewPosition = (this.element.getBoundingClientRect().top + left) -
                this.currentSeparator.getBoundingClientRect().top + this.border;
        }
        this.nextPaneHeightWidth =
            (typeof (this.nextPaneHeightWidth) === 'string' && this.nextPaneHeightWidth.indexOf('p') > -1) ?
                this.convertPixelToNumber(this.nextPaneHeightWidth) : parseInt(this.nextPaneHeightWidth, 10);
        this.prevPaneCurrentWidth = separatorNewPosition + this.convertPixelToNumber(this.previousPaneHeightWidth);
        this.nextPaneCurrentWidth = this.nextPaneHeightWidth - separatorNewPosition;
        this.validateMinMaxValues();
        if (this.nextPaneCurrentWidth < 0) {
            this.nextPaneCurrentWidth = 0;
        }
        /* istanbul ignore next */
        if (this.prevPaneCurrentWidth < 0) {
            this.prevPaneCurrentWidth = 0;
        }
        if ((this.nextPaneCurrentWidth + this.prevPaneCurrentWidth) > this.totalWidth) {
            if (this.nextPaneCurrentWidth < this.prevPaneCurrentWidth) {
                this.prevPaneCurrentWidth = this.prevPaneCurrentWidth - ((this.nextPaneCurrentWidth + this.prevPaneCurrentWidth)
                    - this.totalWidth);
            }
            else {
                this.nextPaneCurrentWidth = this.nextPaneCurrentWidth - ((this.nextPaneCurrentWidth + this.prevPaneCurrentWidth)
                    - this.totalWidth);
            }
        }
        /* istanbul ignore next */
        if ((this.nextPaneCurrentWidth + this.prevPaneCurrentWidth) < this.totalWidth) {
            var difference = this.totalWidth - ((this.nextPaneCurrentWidth + this.prevPaneCurrentWidth));
            this.nextPaneCurrentWidth = this.nextPaneCurrentWidth + difference;
        }
        this.calculateCurrentDimensions();
        this.addStaticPaneClass();
        this.previousPane.style.flexBasis = this.prevPaneCurrentWidth;
        this.nextPane.style.flexBasis = this.nextPaneCurrentWidth;
    };
    Splitter.prototype.validateMinRange = function (paneIndex, paneCurrentWidth, pane) {
        var paneMinRange = null;
        var paneMinDimensions;
        var difference = 0;
        var validatedVal;
        if (!isNullOrUndefined(this.paneSettings[paneIndex]) && !isNullOrUndefined(this.paneSettings[paneIndex].min)) {
            paneMinRange = this.paneSettings[paneIndex].min.toString();
        }
        if (!isNullOrUndefined(paneMinRange)) {
            if (paneMinRange.indexOf('%') > 0) {
                paneMinRange = this.convertPercentageToPixel(paneMinRange).toString();
            }
            paneMinDimensions = this.convertPixelToNumber(paneMinRange);
            if (paneCurrentWidth < paneMinDimensions) {
                difference = (paneCurrentWidth - paneMinDimensions) <= 0 ? 0 :
                    (paneCurrentWidth - paneMinDimensions);
                this.totalWidth = this.totalWidth - difference;
                this.totalPercent = this.convertPixelToPercentage(this.totalWidth);
                validatedVal = paneMinDimensions;
            }
        }
        return isNullOrUndefined(validatedVal) ? paneCurrentWidth : validatedVal;
    };
    Splitter.prototype.validateMaxRange = function (paneIndex, paneCurrentWidth, pane) {
        var paneMaxRange = null;
        var paneMaxDimensions;
        var validatedVal;
        if (!isNullOrUndefined(this.paneSettings[paneIndex]) && !isNullOrUndefined(this.paneSettings[paneIndex].max)) {
            paneMaxRange = this.paneSettings[paneIndex].max.toString();
        }
        if (!isNullOrUndefined(paneMaxRange)) {
            if (paneMaxRange.indexOf('%') > 0) {
                paneMaxRange = this.convertPercentageToPixel(paneMaxRange).toString();
            }
            paneMaxDimensions = this.convertPixelToNumber(paneMaxRange);
            if (paneCurrentWidth > paneMaxDimensions) {
                this.totalWidth = this.totalWidth - (paneCurrentWidth - paneMaxDimensions);
                this.totalPercent = this.convertPixelToPercentage(this.totalWidth);
                validatedVal = paneMaxDimensions;
            }
        }
        return isNullOrUndefined(validatedVal) ? paneCurrentWidth : validatedVal;
    };
    Splitter.prototype.validateMinMaxValues = function () {
        //validate previous pane minimum range
        this.prevPaneCurrentWidth = this.validateMinRange(this.prevPaneIndex, this.prevPaneCurrentWidth, this.previousPane);
        // Validate next pane minimum range
        this.nextPaneCurrentWidth = this.validateMinRange(this.nextPaneIndex, this.nextPaneCurrentWidth, this.nextPane);
        // validate previous pane maximum range
        this.prevPaneCurrentWidth = this.validateMaxRange(this.prevPaneIndex, this.prevPaneCurrentWidth, this.previousPane);
        // validate next pane maximum range
        this.nextPaneCurrentWidth = this.validateMaxRange(this.nextPaneIndex, this.nextPaneCurrentWidth, this.nextPane);
    };
    Splitter.prototype.equatePaneWidths = function () {
        var difference;
        if ((this.prevPaneCurrentWidth + this.nextPaneCurrentWidth) > this.totalPercent) {
            difference = (this.prevPaneCurrentWidth + this.nextPaneCurrentWidth) - this.totalPercent;
            this.prevPaneCurrentWidth = this.prevPaneCurrentWidth - (difference / 2) + '%';
            this.nextPaneCurrentWidth = this.nextPaneCurrentWidth - (difference / 2) + '%';
        }
        if ((this.prevPaneCurrentWidth + this.nextPaneCurrentWidth) < this.totalPercent) {
            difference = this.totalPercent - (this.prevPaneCurrentWidth + this.nextPaneCurrentWidth);
            this.prevPaneCurrentWidth = this.prevPaneCurrentWidth + (difference / 2) + '%';
            this.nextPaneCurrentWidth = this.nextPaneCurrentWidth + (difference / 2) + '%';
        }
    };
    Splitter.prototype.calculateCurrentDimensions = function () {
        if (this.updatePrePaneInPercentage || this.updateNextPaneInPercentage) {
            this.prevPaneCurrentWidth = Math.round(Number(Math.round(this.convertPixelToPercentage(this.prevPaneCurrentWidth)
                * 10) / 10));
            this.nextPaneCurrentWidth = Math.round(Number(Math.round(this.convertPixelToPercentage(this.nextPaneCurrentWidth)
                * 10) / 10));
            if (this.prevPaneCurrentWidth === 0) {
                this.nextPaneCurrentWidth = this.totalPercent;
            }
            if (this.nextPaneCurrentWidth === 0) {
                this.prevPaneCurrentWidth = this.totalPercent;
            }
            if (this.prevPaneCurrentWidth + this.nextPaneCurrentWidth !== this.totalPercent) {
                this.equatePaneWidths();
            }
            else {
                this.prevPaneCurrentWidth = this.prevPaneCurrentWidth + '%';
                this.nextPaneCurrentWidth = this.nextPaneCurrentWidth + '%';
            }
            this.prevPaneCurrentWidth = (this.updatePrePaneInPercentage) ? this.prevPaneCurrentWidth :
                this.convertPercentageToPixel(this.prevPaneCurrentWidth) + 'px';
            this.nextPaneCurrentWidth = (this.updateNextPaneInPercentage) ? this.nextPaneCurrentWidth :
                this.convertPercentageToPixel(this.nextPaneCurrentWidth) + 'px';
            this.updatePrePaneInPercentage = false;
            this.updateNextPaneInPercentage = false;
        }
        else {
            this.prevPaneCurrentWidth = this.prevPaneCurrentWidth + 'px';
            this.nextPaneCurrentWidth = this.nextPaneCurrentWidth + 'px';
        }
    };
    Splitter.prototype.addStaticPaneClass = function () {
        if (!this.previousPane.classList.contains(STATIC_PANE)) {
            this.previousPane.classList.add(STATIC_PANE);
        }
        if (!this.nextPane.classList.contains(STATIC_PANE)) {
            this.nextPane.classList.add(STATIC_PANE);
        }
    };
    Splitter.prototype.validateDraggedPosition = function (draggedPos, prevPaneHeightWidth, nextPaneHeightWidth) {
        var separatorTopLeft = (this.orientation === 'Horizontal') ? this.currentSeparator.offsetLeft :
            this.currentSeparator.offsetTop;
        var prePaneRange = separatorTopLeft - prevPaneHeightWidth;
        var nextPaneRange = nextPaneHeightWidth + separatorTopLeft;
        var pane1MinSize = this.getMinMax(this.prevPaneIndex, this.previousPane, 'min');
        var pane2MinSize = this.getMinMax(this.nextPaneIndex, this.nextPane, 'min');
        var pane1MaxSize = this.getMinMax(this.prevPaneIndex, this.previousPane, 'max');
        var pane2MaxSize = this.getMinMax(this.nextPaneIndex, this.nextPane, 'max');
        var validatedSize = draggedPos;
        if (draggedPos > nextPaneRange - pane2MinSize) {
            validatedSize = nextPaneRange - pane2MinSize;
        }
        else if (draggedPos < prePaneRange + pane1MinSize) {
            validatedSize = prePaneRange + pane1MinSize;
        }
        if (!isNullOrUndefined(pane1MaxSize)) {
            if (draggedPos > prePaneRange + pane1MaxSize) {
                validatedSize = prePaneRange + pane1MaxSize;
            }
        }
        else if (!isNullOrUndefined(pane2MaxSize)) {
            if (draggedPos < nextPaneRange - pane2MaxSize) {
                validatedSize = nextPaneRange - pane2MaxSize;
            }
        }
        return validatedSize;
    };
    Splitter.prototype.onMouseUp = function (e) {
        removeClass([this.currentSeparator], SPLIT_BAR_ACTIVE);
        this.unwireResizeEvents();
        var eventArgs = isBlazor() ? {
            event: e,
            element: this.element,
            index: [this.prevPaneIndex, this.nextPaneIndex],
            separator: this.currentSeparator,
            paneSize: [this.prePaneDimenson, this.nextPaneDimension]
        } : {
            event: e,
            element: this.element,
            pane: [this.previousPane, this.nextPane],
            index: [this.prevPaneIndex, this.nextPaneIndex],
            separator: this.currentSeparator,
            paneSize: [this.prePaneDimenson, this.nextPaneDimension]
        };
        this.trigger('resizeStop', eventArgs);
    };
    Splitter.prototype.panesDimension = function (index, child) {
        var childCount = child.length;
        var size;
        parseInt(this.getHeight(this.element), 10);
        if (!isNullOrUndefined(this.paneSettings[index])) {
            if (!isNullOrUndefined(this.paneSettings[index].size)) {
                size = this.paneSettings[index].size;
                if (index < childCount) {
                    setStyleAttribute(child[index], { 'flex-basis': size, 'order': index * 2 });
                    if (index < childCount - 1 && this.paneSettings[index].size !== '') {
                        addClass([child[index]], STATIC_PANE);
                    }
                    else if (!this.sizeFlag) {
                        child[index].style.flexBasis = null;
                    }
                    if ((index === childCount - 1) && this.sizeFlag && this.paneSettings[index].size !== '') {
                        addClass([child[index]], STATIC_PANE);
                    }
                }
            }
            else {
                this.sizeFlag = true;
                setStyleAttribute(child[index], { 'order': index * 2 });
            }
        }
        else {
            setStyleAttribute(child[index], { 'order': index * 2 });
        }
        this.paneOrder.push(index * 2);
    };
    Splitter.prototype.setTemplate = function (template, toElement) {
        toElement.innerHTML = '';
        this.templateCompile(toElement, template);
    };
    // tslint:disable-next-line
    Splitter.prototype.templateCompile = function (ele, cnt) {
        var blazorContain = Object.keys(window);
        var tempEle = this.createElement('div');
        this.compileElement(tempEle, cnt, 'content');
        if (tempEle.childNodes.length !== 0) {
            [].slice.call(tempEle.childNodes).forEach(function (childEle) {
                ele.appendChild(childEle);
            });
            if (blazorContain.indexOf('ejsInterop') !== -1 && !this.isStringTemplate && cnt.indexOf('<div>Blazor') === 0) {
                updateBlazorTemplate(this.element.id + 'content' + this.allPanes.length.toString(), 'ContentTemplate', this.paneSettings[this.allPanes.length - 1]);
            }
        }
    };
    Splitter.prototype.compileElement = function (ele, val, prop) {
        var blazorContain = Object.keys(window);
        if (typeof (val) === 'string') {
            val = (val).trim();
        }
        var templateFn;
        if (!isNullOrUndefined(val.outerHTML)) {
            templateFn = compile(val.outerHTML);
        }
        else {
            templateFn = compile(val);
        }
        var templateFUN;
        if (!isNullOrUndefined(templateFn)) {
            if (blazorContain.indexOf('ejsInterop') !== -1 && !this.isStringTemplate && val.indexOf('<div>Blazor') === 0) {
                templateFUN = templateFn({}, this, prop, this.element.id + 'content' + this.allPanes.length.toString(), this.isStringTemplate);
            }
            else {
                templateFUN = templateFn({}, this, prop, this.element.id + 'content' + this.allPanes.length.toString(), true);
            }
        }
        if (!isNullOrUndefined(templateFn) && templateFUN.length > 0) {
            [].slice.call(templateFUN).forEach(function (el) {
                ele.appendChild(el);
            });
        }
    };
    Splitter.prototype.paneCollapsible = function (pane, index) {
        this.paneSettings[index].collapsible ? addClass([pane], COLLAPSIBLE) : removeClass([pane], COLLAPSIBLE);
    };
    Splitter.prototype.createSplitPane = function (target) {
        var childCount = target.children.length;
        for (var i = 0; i < this.paneSettings.length; i++) {
            if (childCount < this.paneSettings.length) {
                var childElement = this.createElement('div');
                this.element.appendChild(childElement);
                childCount = childCount + 1;
            }
        }
        childCount = target.children.length;
        var child = [].slice.call(target.children);
        this.sizeFlag = false;
        if (childCount > 1) {
            for (var i = 0; i < childCount; i++) {
                // To accept only div and span element as pane
                if (child[i].nodeName === 'DIV' || child[i].nodeName === 'SPAN') {
                    this.allPanes.push(child[i]);
                    if (this.orientation === 'Horizontal') {
                        addClass([child[i]], [PANE, SPLIT_H_PANE, SCROLL_PANE]);
                        this.panesDimension(i, child);
                    }
                    else {
                        addClass([child[i]], [PANE, SPLIT_V_PANE, SCROLL_PANE]);
                        this.panesDimension(i, child);
                    }
                    if (!isNullOrUndefined(this.paneSettings[i]) && !isNullOrUndefined(this.paneSettings[i].content)) {
                        this.setTemplate(this.paneSettings[i].content, child[i]);
                    }
                    if (!isNullOrUndefined(this.paneSettings[i])) {
                        this.paneCollapsible(child[i], i);
                    }
                }
            }
        }
    };
    
    /**
     * expands corresponding pane based on the index is passed.
     * @param { number } index - Specifies the index value of the corresponding pane to be expanded at initial rendering of splitter.
     * @returns void
     */
    Splitter.prototype.expand = function (index) {
        this.collapsedOnchange(index);
    };
    /**
     * collapses corresponding pane based on the index is passed.
     * @param { number } index - Specifies the index value of the corresponding pane to be collapsed at initial rendering of splitter.
     * @returns void
     */
    Splitter.prototype.collapse = function (index) {
        this.isCollapsed(index);
    };
    /**
     * Removes the control from the DOM and also removes all its related events.
     * @returns void
     */
    Splitter.prototype.destroy = function () {
        if (!this.isDestroyed) {
            _super.prototype.destroy.call(this);
            EventHandler.remove(document, 'touchstart click', this.onDocumentClick);
            detach(this.element);
            this.element = this.wrapper;
            this.wrapperParent.appendChild(this.wrapper);
        }
    };
    Splitter.prototype.addPaneClass = function (pane) {
        this.orientation === 'Horizontal' ? addClass([pane], [PANE, SPLIT_H_PANE, SCROLL_PANE]) :
            addClass([pane], [PANE, SPLIT_V_PANE, SCROLL_PANE]);
        return pane;
    };
    Splitter.prototype.removePaneOrders = function (paneClass) {
        var panes = document.querySelectorAll('.' + paneClass);
        for (var i = 0; i < panes.length; i++) {
            panes[i].style.removeProperty('order');
        }
    };
    Splitter.prototype.setPaneOrder = function () {
        for (var i = 0; i < this.allPanes.length; i++) {
            this.panesDimension(i, this.allPanes);
        }
    };
    Splitter.prototype.removeSeparator = function () {
        for (var i = 0; i < this.allBars.length; i++) {
            detach(this.allBars[i]);
        }
        this.allBars = [];
    };
    Splitter.prototype.updatePanes = function () {
        this.setPaneOrder();
        this.removeSeparator();
        this.addSeparator(this.element);
    };
    /**
     * Allows you to add a pane dynamically to the specified index position by passing the pane properties.
     * @param { PanePropertiesModel } paneProperties - Specifies the pane’s properties that apply to new pane.
     * @param { number } index - Specifies the index where the pane will be inserted.
     * @returns void
     */
    Splitter.prototype.addPane = function (paneProperties, index) {
        var newPane = this.createElement('div');
        newPane = this.addPaneClass(newPane);
        index = (index > this.allPanes.length + 1) ? this.allPanes.length : index;
        var paneDetails = {
            size: isNullOrUndefined(paneProperties.size) ? '' : paneProperties.size,
            min: isNullOrUndefined(paneProperties.min) ? null : paneProperties.min,
            max: isNullOrUndefined(paneProperties.max) ? null : paneProperties.max,
            content: isNullOrUndefined(paneProperties.content) ? '' : paneProperties.content,
            resizable: isNullOrUndefined(paneProperties.resizable) ? true : paneProperties.resizable,
            collapsible: isNullOrUndefined(paneProperties.collapsible) ? false : paneProperties.collapsible,
            collapsed: isNullOrUndefined(paneProperties.collapsed) ? false : paneProperties.collapsed
        };
        this.paneSettings.splice(index, 0, paneDetails);
        if (this.orientation === 'Horizontal') {
            this.element.insertBefore(newPane, this.element.querySelectorAll('.' + SPLIT_H_PANE)[index]);
            this.removePaneOrders(SPLIT_H_PANE);
        }
        else {
            this.element.insertBefore(newPane, this.element.querySelectorAll('.' + SPLIT_V_PANE)[index]);
            this.removePaneOrders(SPLIT_V_PANE);
        }
        this.allPanes.splice(index, 0, newPane);
        this.updatePanes();
        this.setTemplate(this.paneSettings[index].content, newPane);
        this.allPanes[this.allPanes.length - 1].classList.remove(STATIC_PANE);
    };
    /**
     * Allows you to remove the specified pane dynamically by passing its index value.
     * @param { number } index - Specifies the index value to remove the corresponding pane.
     * @returns void
     */
    Splitter.prototype.removePane = function (index) {
        index = (index > this.allPanes.length + 1) ? this.allPanes.length : index;
        var elementClass = (this.orientation === 'Horizontal') ? SPLIT_H_PANE : SPLIT_V_PANE;
        if (isNullOrUndefined(this.element.querySelectorAll('.' + elementClass)[index])) {
            return;
        }
        detach(this.element.querySelectorAll('.' + elementClass)[index]);
        this.allPanes.splice(index, 1);
        this.removePaneOrders(elementClass);
        this.updatePanes();
        this.allPanes[this.allPanes.length - 1].classList.remove(STATIC_PANE);
    };
    __decorate([
        Property('100%')
    ], Splitter.prototype, "height", void 0);
    __decorate([
        Property('100%')
    ], Splitter.prototype, "width", void 0);
    __decorate([
        Collection([], PaneProperties)
    ], Splitter.prototype, "paneSettings", void 0);
    __decorate([
        Property('Horizontal')
    ], Splitter.prototype, "orientation", void 0);
    __decorate([
        Property('')
    ], Splitter.prototype, "cssClass", void 0);
    __decorate([
        Property(true)
    ], Splitter.prototype, "enabled", void 0);
    __decorate([
        Property(null)
    ], Splitter.prototype, "separatorSize", void 0);
    __decorate([
        Event()
    ], Splitter.prototype, "created", void 0);
    __decorate([
        Event()
    ], Splitter.prototype, "resizeStart", void 0);
    __decorate([
        Event()
    ], Splitter.prototype, "resizing", void 0);
    __decorate([
        Event()
    ], Splitter.prototype, "resizeStop", void 0);
    __decorate([
        Event()
    ], Splitter.prototype, "beforeCollapse", void 0);
    __decorate([
        Event()
    ], Splitter.prototype, "beforeExpand", void 0);
    __decorate([
        Event()
    ], Splitter.prototype, "collapsed", void 0);
    __decorate([
        Event()
    ], Splitter.prototype, "expanded", void 0);
    Splitter = __decorate([
        NotifyPropertyChanges
    ], Splitter);
    return Splitter;
}(Component));

/**
 * splitter modules
 */

var __extends$1 = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate$1 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
// constant class definitions
var preventSelect = 'e-prevent';
var dragging = 'e-dragging';
var draggable = 'e-draggable';
var resize = 'e-resize';
var responsive = 'e-responsive';
var east = 'e-east';
var west = 'e-west';
var north = 'e-north';
var south = 'e-south';
var single = 'e-single';
var double = 'e-double';
var northEast = 'e-north-east';
var southEast = 'e-south-east';
var northWest = 'e-north-west';
var southWest = 'e-south-west';
var panel = 'e-panel';
var panelContent = 'e-panel-content';
var panelContainer = 'e-panel-container';
var disable = 'e-disabled';
var header = 'e-panel-header';
var panelTransition = 'e-panel-transition';
/**
 * Defines the panel of the DashboardLayout component.
 */
var Panel = /** @__PURE__ @class */ (function (_super) {
    __extends$1(Panel, _super);
    function Panel() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate$1([
        Property('')
    ], Panel.prototype, "id", void 0);
    __decorate$1([
        Property('')
    ], Panel.prototype, "cssClass", void 0);
    __decorate$1([
        Property('')
    ], Panel.prototype, "header", void 0);
    __decorate$1([
        Property('')
    ], Panel.prototype, "content", void 0);
    __decorate$1([
        Property(true)
    ], Panel.prototype, "enabled", void 0);
    __decorate$1([
        Property(0)
    ], Panel.prototype, "row", void 0);
    __decorate$1([
        Property(0)
    ], Panel.prototype, "col", void 0);
    __decorate$1([
        Property(1)
    ], Panel.prototype, "sizeX", void 0);
    __decorate$1([
        Property(1)
    ], Panel.prototype, "sizeY", void 0);
    __decorate$1([
        Property(1)
    ], Panel.prototype, "minSizeY", void 0);
    __decorate$1([
        Property(1)
    ], Panel.prototype, "minSizeX", void 0);
    __decorate$1([
        Property(null)
    ], Panel.prototype, "maxSizeY", void 0);
    __decorate$1([
        Property(null)
    ], Panel.prototype, "maxSizeX", void 0);
    __decorate$1([
        Property(1000)
    ], Panel.prototype, "zIndex", void 0);
    return Panel;
}(ChildProperty));
/**
 * The DashboardLayout is a grid structured layout control, that helps to create a dashboard with panels.
 * Panels hold the UI components or data to be visualized with flexible options like resize, reorder, drag-n-drop, remove and add,
 * that allows users to easily place the panels at a desired position within the grid layout.
 * ```html
 * <div id="default-layout">
 * ```
 * ```typescript
 * <script>
 *   let dashBoardObject : DashboardLayout = new DashboardLayout();
 *   dashBoardObject.appendTo('#default-layout');
 * </script>
 * ```
 */
var DashboardLayout = /** @__PURE__ @class */ (function (_super) {
    __extends$1(DashboardLayout, _super);
    function DashboardLayout(options, element) {
        var _this = _super.call(this, options, element) || this;
        _this.rows = 1;
        _this.panelID = 0;
        _this.movePanelCalled = false;
        _this.resizeCalled = false;
        _this.mOffX = 0;
        _this.mOffY = 0;
        _this.maxTop = 9999;
        _this.maxRows = 100;
        _this.mouseX = 0;
        _this.mouseY = 0;
        _this.minTop = 0;
        _this.minLeft = 0;
        return _this;
    }
    /**
     * Initialize the event handler
     * @private
     */
    DashboardLayout.prototype.preRender = function () {
        this.panelCollection = [];
        this.sortedArray = [];
        this.gridPanelCollection = [];
        this.overlapElement = [];
        this.overlapElementClone = [];
        this.overlapSubElementClone = [];
        this.collisionChecker = {};
        this.dragCollection = [];
        this.elementRef = { top: '', left: '', height: '', width: '' };
        this.dimensions = [];
        this.allItems = [];
        this.oldRowCol = {};
        this.isDynamicallyUpdated = false;
        this.availableClasses = [];
        this.setOldRowCol();
        this.calculateCellSize();
    };
    DashboardLayout.prototype.setOldRowCol = function () {
        for (var i = 0; i < this.panels.length; i++) {
            if (!this.panels[i].id) {
                this.panelPropertyChange(this.panels[i], { id: 'layout_' + this.panelID.toString() });
                this.panelID = this.panelID + 1;
            }
            this.oldRowCol[this.panels[i].id] = { row: this.panels[i].row, col: this.panels[i].col };
        }
    };
    DashboardLayout.prototype.createPanelElement = function (cssClass, idValue) {
        var ele = this.createElement('div');
        if (cssClass) {
            addClass([ele], [cssClass]);
        }
        if (idValue) {
            ele.setAttribute('id', idValue);
        }
        return ele;
    };
    /**
     * To Initialize the control rendering.
     * @returns void
     * @private
     */
    DashboardLayout.prototype.render = function () {
        this.initialize();
        this.isRenderComplete = true;
        if (this.showGridLines && !this.checkMediaQuery()) {
            this.initGridLines();
        }
        this.updateDragArea();
        this.renderComplete();
    };
    DashboardLayout.prototype.initGridLines = function () {
        this.table = document.createElement('table');
        var tbody = document.createElement('tbody');
        this.table.classList.add('e-dashboard-gridline-table');
        for (var i = 0; i < this.maxRow(); i++) {
            var tr = document.createElement('tr');
            for (var j = 0; j < this.columns; j++) {
                var td = document.createElement('td');
                td.classList.add('e-dashboard-gridline');
                this.setAttributes({ value: { row: i.toString(), col: j.toString(), sizeX: '1', sizeY: '1' } }, td);
                td.setAttribute('id', '' + j);
                this.setPanelPosition(td, i, j);
                this.setHeightAndWidth(td, { row: i, col: j, sizeX: 1, sizeY: 1 });
                tr.appendChild(td);
            }
            tbody.appendChild(tr);
        }
        this.table.appendChild(tbody);
        this.element.appendChild(this.table);
    };
    DashboardLayout.prototype.initialize = function () {
        this.updateRowHeight();
        if (this.element.childElementCount > 0) {
            var panelElements = [];
            this.setProperties({ panels: [] }, true);
            for (var i = 0; i < this.element.querySelectorAll('.e-panel').length; i++) {
                panelElements.push((this.element.querySelectorAll('.e-panel')[i]));
            }
            for (var i = 0; i < panelElements.length; i++) {
                var panelElement = panelElements[i];
                if (this.enableRtl) {
                    addClass([panelElement], 'e-rtl');
                }
                this.getInlinePanels(panelElement);
                this.maxCol();
                this.maxRow();
            }
            for (var i = 0; i < this.panels.length; i++) {
                var panelElement = this.element.querySelector('#' + this.panels[i].id);
                this.setMinMaxValues(this.panels[i]);
                if (this.maxColumnValue < this.panels[i].col || this.maxColumnValue < (this.panels[i].col + this.panels[i].sizeX)) {
                    var colValue = this.maxColumnValue - this.panels[i].sizeX;
                    this.panelPropertyChange(this.panels[i], { col: colValue < 0 ? 0 : colValue });
                }
                this.setXYAttributes(panelElement, this.panels[i]);
                var panel_1 = this.renderPanels(panelElement, this.panels[i], this.panels[i].id, false);
                this.panelCollection.push(panel_1);
                this.setHeightAndWidth(panelElement, this.panels[i]);
                this.tempObject = this;
                if (this.mediaQuery && !window.matchMedia('(' + this.mediaQuery + ')').matches) {
                    this.setPanelPosition(panelElement, this.panels[i].row, this.panels[i].col);
                    this.mainElement = panelElement;
                    this.updatePanelLayout(panelElement, this.panels[i]);
                    this.mainElement = null;
                }
                this.setClasses([panelElement]);
            }
            if (this.checkMediaQuery()) {
                this.checkMediaQuerySizing();
            }
        }
        else {
            this.renderDashBoardCells(this.panels);
        }
        if (this.allowDragging && (this.mediaQuery ? !window.matchMedia('(' + this.mediaQuery + ')').matches : true)) {
            this.enableDraggingContent(this.panelCollection);
        }
        this.sortedPanel();
        this.bindEvents();
        this.updatePanels();
        this.updateCloneArrayObject();
        this.checkColumnValue = this.maxColumnValue;
        if (!(this.checkMediaQuery())) {
            this.panelResponsiveUpdate();
        }
        this.setEnableRtl();
    };
    DashboardLayout.prototype.checkMediaQuery = function () {
        return (this.mediaQuery && window.matchMedia('(' + this.mediaQuery + ')').matches);
    };
    DashboardLayout.prototype.calculateCellSize = function () {
        this.cellSize = [];
        if ((this.checkMediaQuery())) {
            this.cellSize[1] = this.element.parentElement
                && Math.floor((this.element.parentElement.offsetWidth)) / this.cellAspectRatio;
        }
        else {
            this.cellSize[0] = this.element.parentElement &&
                Math.floor((this.element.parentElement.offsetWidth));
            this.cellSize[0] = this.element.parentElement
                && Math.floor((this.element.parentElement.offsetWidth - ((this.maxCol() - 1) * this.cellSpacing[0]))
                    / (this.maxCol()));
            this.cellSize[1] = this.cellSize[0] / this.cellAspectRatio;
        }
    };
    DashboardLayout.prototype.maxRow = function (recheck) {
        var maxRow = 1;
        if (this.rows > 1 && isNullOrUndefined(recheck)) {
            maxRow = this.rows;
            return maxRow;
        }
        for (var i = 0; i < this.panels.length; i++) {
            if (this.panels[i].sizeY + this.panels[i].row > maxRow) {
                maxRow = this.panels[i].sizeY + this.panels[i].row;
            }
        }
        if (this.panels.length === 0) {
            maxRow = this.columns;
        }
        return maxRow;
    };
    DashboardLayout.prototype.maxCol = function () {
        var maxCol = 1;
        maxCol = this.columns;
        this.maxColumnValue = maxCol;
        return maxCol;
    };
    DashboardLayout.prototype.updateOldRowColumn = function () {
        for (var i = 0; i < this.panels.length; i++) {
            var id = this.panels[i].id;
            if (document.getElementById(id)) {
                var row = parseInt(document.getElementById(id).getAttribute('data-row'), 10);
                var col = parseInt(document.getElementById(id).getAttribute('data-col'), 10);
                this.oldRowCol[this.panels[i].id] = { row: row, col: col };
            }
            else {
                continue;
            }
        }
    };
    DashboardLayout.prototype.createSubElement = function (cssClass, idValue, className) {
        var element = this.createElement('div');
        if (className) {
            addClass([element], [className]);
        }
        if (cssClass) {
            addClass([element], [cssClass]);
        }
        if (idValue) {
            element.setAttribute('id', idValue);
        }
        return element;
    };
    DashboardLayout.prototype.templateParser = function (template) {
        if (template) {
            try {
                if (document.querySelectorAll(template).length) {
                    return compile(document.querySelector(template).innerHTML.trim());
                }
            }
            catch (error) {
                return compile(template);
            }
        }
        return undefined;
    };
    DashboardLayout.prototype.renderTemplate = function (content, appendElement, type, isStringTemplate) {
        var templateFn = this.templateParser(content);
        var templateElements = [];
        for (var _i = 0, _a = templateFn({}, null, null, type, isStringTemplate); _i < _a.length; _i++) {
            var item = _a[_i];
            templateElements.push(item);
        }
        append([].slice.call(templateElements), appendElement);
    };
    DashboardLayout.prototype.renderPanels = function (cellElement, panelModel, panelId, isStringTemplate) {
        addClass([cellElement], [panel, panelTransition]);
        this.panelContent = cellElement.querySelector('.e-panel-container') ?
            cellElement.querySelector('.e-panel-container') :
            this.createSubElement(panelModel.cssClass, cellElement.id + '_content', panelContainer);
        cellElement.appendChild(this.panelContent);
        if (!panelModel.enabled) {
            this.disablePanel(cellElement);
        }
        if (panelModel.header) {
            var headerTemplateElement = cellElement.querySelector('.e-panel-header') ?
                cellElement.querySelector('.e-panel-header') : this.createSubElement('', cellElement.id + 'template', '');
            addClass([headerTemplateElement], [header]);
            if (!cellElement.querySelector('.e-panel-header')) {
                var id = this.element.id + 'HeaderTemplate' + panelId;
                this.renderTemplate(panelModel.header, headerTemplateElement, id, isStringTemplate);
                this.panelContent.appendChild(headerTemplateElement);
                updateBlazorTemplate(id, 'HeaderTemplate', panelModel);
            }
        }
        if (panelModel.content) {
            this.panelBody = cellElement.querySelector('.e-panel-content') ? cellElement.querySelector('.e-panel-content') :
                this.createSubElement(panelModel.cssClass, cellElement.id + '_body', panelContent);
            var headerHeight = this.panelContent.querySelector('.e-panel-header') ?
                window.getComputedStyle(this.panelContent.querySelector('.e-panel-header')).height : '0px';
            var contentHeightValue = 'calc( 100% - ' + headerHeight + ')';
            setStyleAttribute(this.panelBody, { height: contentHeightValue });
            if (!cellElement.querySelector('.e-panel-content')) {
                var id = this.element.id + 'ContentTemplate' + panelId;
                this.renderTemplate(panelModel.content, this.panelBody, id, isStringTemplate);
                this.panelContent.appendChild(this.panelBody);
                updateBlazorTemplate(id, 'ContentTemplate', panelModel);
            }
        }
        return cellElement;
    };
    DashboardLayout.prototype.disablePanel = function (panelElement) {
        addClass([panelElement], [disable]);
    };
    DashboardLayout.prototype.getInlinePanels = function (panelElement) {
        var model = {
            sizeX: panelElement.hasAttribute('data-sizex') ? parseInt(panelElement.getAttribute('data-sizex'), 10) : 1,
            sizeY: panelElement.hasAttribute('data-sizey') ? parseInt(panelElement.getAttribute('data-sizey'), 10) : 1,
            minSizeX: panelElement.hasAttribute('data-minsizex') ? parseInt(panelElement.getAttribute('data-minsizex'), 10) : 1,
            minSizeY: panelElement.hasAttribute('data-minsizey') ? parseInt(panelElement.getAttribute('data-minsizey'), 10) : 1,
            maxSizeX: panelElement.hasAttribute('data-maxsizex') ? parseInt(panelElement.getAttribute('data-maxsizex'), 10) : null,
            maxSizeY: panelElement.hasAttribute('data-maxsizey') ? parseInt(panelElement.getAttribute('data-maxsizey'), 10) : null,
            row: panelElement.hasAttribute('data-row') ? parseInt(panelElement.getAttribute('data-row'), 10) : 0,
            col: panelElement.hasAttribute('data-col') ? parseInt(panelElement.getAttribute('data-col'), 10) : 0,
            id: panelElement.getAttribute('id'),
            zIndex: panelElement.hasAttribute('data-zindex') ? parseInt(panelElement.getAttribute('data-zIndex'), 10) : 1000,
            header: panelElement.querySelector('.e-panel-header') && '.e-panel-header',
            content: panelElement.querySelector('.e-panel-content') && '.e-panel-content',
        };
        if (!model.id) {
            model.id = 'layout_' + this.panelID.toString();
            panelElement.setAttribute('id', model.id);
            this.panelID = this.panelID + 1;
        }
        if (isUndefined(model.enabled)) {
            model.enabled = true;
        }
        panelElement.style.zIndex = '' + model.zIndex;
        // tslint:disable-next-line
        var panelProp = new Panel(this, 'panels', model);
        this.panels.push(panelProp);
    };
    DashboardLayout.prototype.resizeEvents = function () {
        if (this.allowResizing) {
            for (var i = 0; i < this.element.querySelectorAll('.e-panel .e-panel-container .e-resize').length; i++) {
                var eventName = (Browser.info.name === 'msie') ? 'mousedown pointerdown' : 'mousedown';
                EventHandler.add(document.querySelectorAll('.e-resize')[i], eventName, this.downResizeHandler, this);
                if (Browser.info.name !== 'mise') {
                    EventHandler.add(document.querySelectorAll('.e-resize')[i], 'touchstart', this.touchDownResizeHandler, this);
                }
            }
        }
    };
    DashboardLayout.prototype.bindEvents = function () {
        window.addEventListener('resize', this.refresh.bind(this));
        this.resizeEvents();
    };
    DashboardLayout.prototype.downResizeHandler = function (e) {
        this.downHandler(e);
        this.lastMouseX = e.pageX;
        this.lastMouseY = e.pageY;
        var moveEventName = (Browser.info.name === 'msie') ? 'mousemove pointermove' : 'mousemove';
        var upEventName = (Browser.info.name === 'msie') ? 'mouseup pointerup' : 'mouseup';
        EventHandler.add(document, moveEventName, this.moveResizeHandler, this);
        if (!this.isMouseUpBound) {
            EventHandler.add(document, upEventName, this.upResizeHandler, this);
            this.isMouseUpBound = true;
        }
    };
    
    DashboardLayout.prototype.downHandler = function (e) {
        this.resizeCalled = false;
        var el = closest((e.currentTarget), '.e-panel');
        var args = { event: e, element: el };
        this.trigger('resizeStart', args);
        this.downTarget = e.currentTarget;
        this.shadowEle = document.createElement('div');
        this.shadowEle.classList.add('e-holder');
        addClass([this.element], [preventSelect]);
        this.element.appendChild(this.shadowEle);
        this.elementX = parseInt(el.style.left, 10);
        this.elementY = parseInt(el.style.top, 10);
        this.elementWidth = el.offsetWidth;
        this.elementHeight = el.offsetHeight;
        this.originalWidth = this.getCellInstance(el.id).sizeX;
        this.originalHeight = this.getCellInstance(el.id).sizeY;
        this.previousRow = this.getCellInstance(el.id).row;
    };
    DashboardLayout.prototype.touchDownResizeHandler = function (e) {
        this.downHandler(e);
        this.lastMouseX = e.changedTouches[0].pageX;
        this.lastMouseY = e.changedTouches[0].pageY;
        EventHandler.add(document, 'touchmove', this.touchMoveResizeHandler, this);
        if (!this.isMouseUpBound) {
            EventHandler.add(document, 'touchend', this.upResizeHandler, this);
            this.isMouseUpBound = true;
        }
    };
    DashboardLayout.prototype.getCellSize = function () {
        return [parseInt((this.cellSize[0]), 10), parseInt(this.cellSize[1], 10)];
    };
    DashboardLayout.prototype.updateMaxTopLeft = function (e) {
        this.moveTarget = this.downTarget;
        var el = closest((this.moveTarget), '.e-panel');
        var args = { event: e, element: el };
        this.trigger('resize', args);
    };
    DashboardLayout.prototype.updateResizeElement = function (el) {
        this.maxLeft = this.element.offsetWidth - 1;
        this.maxTop = this.cellSize[1] * this.maxRows - 1;
        removeClass([el], 'e-panel-transition');
        addClass([el], [dragging]);
        var handleArray = [east, west, north, south, southEast, northEast, northWest, southWest];
        for (var i = 0; i < this.moveTarget.classList.length; i++) {
            if (handleArray.indexOf(this.moveTarget.classList[i]) !== -1) {
                this.handleClass = (this.moveTarget.classList[i]);
            }
        }
    };
    DashboardLayout.prototype.moveResizeHandler = function (e) {
        this.updateMaxTopLeft(e);
        var el = closest((this.moveTarget), '.e-panel');
        if (this.lastMouseX === e.pageX || this.lastMouseY === e.pageY) {
            return;
        }
        this.updateResizeElement(el);
        var panelModel = this.getCellInstance(el.getAttribute('id'));
        this.mouseX = e.pageX;
        this.mouseY = e.pageY;
        var diffY = this.mouseY - this.lastMouseY + this.mOffY;
        var diffX = this.mouseX - this.lastMouseX + this.mOffX;
        this.mOffX = this.mOffY = 0;
        this.lastMouseY = this.mouseY;
        this.lastMouseX = this.mouseX;
        this.resizingPanel(el, panelModel, diffX, diffY);
    };
    DashboardLayout.prototype.touchMoveResizeHandler = function (e) {
        this.updateMaxTopLeft(e);
        var el = closest((this.moveTarget), '.e-panel');
        if (this.lastMouseX === e.changedTouches[0].pageX || this.lastMouseY === e.changedTouches[0].pageY) {
            return;
        }
        this.updateResizeElement(el);
        var panelModel = this.getCellInstance(el.getAttribute('id'));
        this.mouseX = e.changedTouches[0].pageX;
        this.mouseY = e.changedTouches[0].pageY;
        var diffX = this.mouseX - this.lastMouseX + this.mOffX;
        var diffY = this.mouseY - this.lastMouseY + this.mOffY;
        this.mOffX = this.mOffY = 0;
        this.lastMouseX = this.mouseX;
        this.lastMouseY = this.mouseY;
        this.resizingPanel(el, panelModel, diffX, diffY);
    };
    /* istanbul ignore next */
    DashboardLayout.prototype.resizingPanel = function (el, panelModel, currentX, currentY) {
        var oldSizeX = this.getCellInstance(el.id).sizeX;
        var oldSizeY = this.getCellInstance(el.id).sizeY;
        var dY = currentY;
        var dX = currentX;
        if (this.handleClass.indexOf('north') >= 0) {
            if (this.elementHeight - dY < this.getMinHeight(panelModel)) {
                currentY = this.elementHeight - this.getMinHeight(panelModel);
                this.mOffY = dY - currentY;
            }
            else if (panelModel.maxSizeY && this.elementHeight - dY > this.getMaxHeight(panelModel)) {
                currentY = this.elementHeight - this.getMaxHeight(panelModel);
                this.mOffY = dY - currentY;
            }
            else if (this.elementY + dY < this.minTop) {
                currentY = this.minTop - this.elementY;
                this.mOffY = dY - currentY;
            }
            this.elementY += currentY;
            this.elementHeight -= currentY;
        }
        if (this.handleClass.indexOf('south') >= 0) {
            if (this.elementHeight + dY < this.getMinHeight(panelModel)) {
                currentY = this.getMinHeight(panelModel) - this.elementHeight;
                this.mOffY = dY - currentY;
            }
            else if (panelModel.maxSizeY && this.elementHeight + dY > this.getMaxHeight(panelModel)) {
                currentY = this.getMaxHeight(panelModel) - this.elementHeight;
                this.mOffY = dY - currentY;
            }
            else if (this.elementY + this.elementHeight + dY > this.maxTop) {
                currentY = this.maxTop - this.elementY - this.elementHeight;
                this.mOffY = dY - currentY;
            }
            this.elementHeight += currentY;
        }
        if (this.handleClass.indexOf('west') >= 0) {
            if (this.elementWidth - dX < this.getMinWidth(panelModel)) {
                currentX = this.elementWidth - this.getMinWidth(panelModel);
                this.mOffX = dX - currentX;
            }
            else if (panelModel.maxSizeX && this.elementWidth - dX > this.getMaxWidth(panelModel)) {
                currentX = this.elementWidth - this.getMaxWidth(panelModel);
                this.mOffX = dX - currentX;
            }
            else if (this.elementX + dX < this.minLeft) {
                currentX = this.minLeft - this.elementX;
                this.mOffX = dX - currentX;
            }
            this.elementX += currentX;
            this.elementWidth -= currentX;
        }
        if (this.handleClass.indexOf('east') >= 0) {
            if (this.elementWidth + dX < this.getMinWidth(panelModel)) {
                currentX = this.getMinWidth(panelModel) - this.elementWidth;
                this.mOffX = dX - currentX;
            }
            else if (panelModel.maxSizeX && this.elementWidth + dX > this.getMaxWidth(panelModel)) {
                currentX = this.getMaxWidth(panelModel) - this.elementWidth;
                this.mOffX = dX - currentX;
            }
            else if (this.elementX + this.elementWidth + dX > this.maxLeft) {
                currentX = this.maxLeft - this.elementX - this.elementWidth;
                this.mOffX = dX - currentX;
            }
            this.elementWidth += currentX;
        }
        el.style.top = this.elementY + 'px';
        el.style.left = this.elementX + 'px';
        el.style.width = this.elementWidth + 'px';
        el.style.height = this.elementHeight + 'px';
        var item = this.getResizeRowColumn(panelModel, this.moveTarget);
        if (item.col + item.sizeX > this.columns) {
            this.panelPropertyChange(item, { sizeX: item.sizeX - 1 });
        }
        this.shadowEle.style.top = ((item.row * this.getCellSize()[1] + (item.row * this.cellSpacing[1]))) + 'px';
        this.shadowEle.style.left = ((item.col * this.getCellSize()[0]) + ((item.col) * this.cellSpacing[0])) + 'px';
        this.shadowEle.style.height = ((item.sizeY * (this.getCellSize()[1] + (this.cellSpacing[1])))) + 'px';
        this.shadowEle.style.width = ((item.sizeX * (this.getCellSize()[0] + (this.cellSpacing[0])))) + 'px';
        if (oldSizeX !== item.sizeX || oldSizeY !== item.sizeY) {
            oldSizeX = item.sizeX;
            oldSizeY = item.sizeY;
            var model = this.getCellInstance(el.id);
            var value = {
                attributes: {
                    row: model.row.toString(),
                    col: model.col.toString(),
                    sizeX: model.sizeX.toString(),
                    sizeY: model.sizeY.toString()
                }
            };
            this.setAttributes(value, el);
            this.mainElement = el;
            this.updatePanelLayout(el, this.getCellInstance(el.id));
            this.updateOldRowColumn();
            this.sortedPanel();
        }
    };
    DashboardLayout.prototype.upResizeHandler = function (e) {
        if (isNullOrUndefined(this.downTarget)) {
            return;
        }
        this.upTarget = this.downTarget;
        var el = closest((this.upTarget), '.e-panel');
        var args = { event: e, element: el };
        this.trigger('resizeStop', args);
        if (el) {
            addClass([el], 'e-panel-transition');
            var moveEventName = (Browser.info.name === 'msie') ? 'mousemove pointermove' : 'mousemove';
            var upEventName = (Browser.info.name === 'msie') ? 'mouseup pointerup' : 'mouseup';
            EventHandler.remove(document, moveEventName, this.moveResizeHandler);
            EventHandler.remove(document, upEventName, this.upResizeHandler);
            if (Browser.info.name !== 'mise') {
                EventHandler.remove(document, 'touchmove', this.touchMoveResizeHandler);
                EventHandler.remove(document, 'touchend', this.upResizeHandler);
            }
            this.isMouseUpBound = false;
            if (this.shadowEle) {
                detach(this.shadowEle);
            }
            this.shadowEle = null;
            var panelModel = this.getCellInstance(el.getAttribute('id'));
            this.setPanelPosition(el, panelModel.row, panelModel.col);
            this.setHeightAndWidth(el, panelModel);
        }
        this.resizeCalled = false;
        this.lastMouseX = this.lastMouseY = undefined;
        this.mOffX = this.mOffY = 0;
        this.mainElement = null;
        if (this.allowFloating) {
            this.moveItemsUpwards();
        }
        this.updatePanels();
        this.updateCloneArrayObject();
    };
    DashboardLayout.prototype.getResizeRowColumn = function (item, e) {
        var isChanged = false;
        var col = item.col;
        if (['e-west', 'e-south-west'].indexOf(this.handleClass) !== -1) {
            col = this.pixelsToColumns(this.elementX, false);
        }
        var row = item.row;
        if (['e-north'].indexOf(this.handleClass) !== -1) {
            row = this.pixelsToRows(this.elementY, false);
            if (this.previousRow !== row) {
                this.previousRow = row;
                isChanged = true;
            }
        }
        var sizeX = item.sizeX;
        if (['e-north', 'e-south'].indexOf(this.handleClass) === -1) {
            sizeX = this.pixelsToColumns(this.elementWidth - (sizeX) * this.cellSpacing[1], true);
        }
        var sizeY = item.sizeY;
        if (['e-east', 'e-west'].indexOf(this.handleClass) === -1) {
            if (this.handleClass === 'e-north' ? isChanged : true) {
                sizeY = this.pixelsToRows(this.elementHeight - (sizeY) * this.cellSpacing[0], true);
            }
        }
        if (item.col + item.sizeX > this.columns) {
            item.sizeX = item.sizeX - 1;
        }
        var canOccupy = row > -1 && col > -1 && sizeX + col <= this.maxCol() && sizeY + row <= this.maxRow();
        if (canOccupy && (this.collisions(row, col, sizeX, sizeY, this.getPanelBase(item.id)).length === 0)
            || this.allowPushing !== false) {
            this.panelPropertyChange(item, { row: row, col: col, sizeX: sizeX, sizeY: sizeY });
        }
        return item;
    };
    DashboardLayout.prototype.pixelsToColumns = function (pixels, isCeil) {
        var curColWidth = this.cellSize[0];
        if (isCeil) {
            return Math.ceil(pixels / curColWidth);
        }
        else {
            return Math.floor(pixels / curColWidth);
        }
    };
    DashboardLayout.prototype.pixelsToRows = function (pixels, isCeil) {
        if (isCeil) {
            return Math.round(pixels / this.cellSize[1]);
        }
        else {
            return Math.round(pixels / (this.cellSize[1] + this.cellSpacing[0]));
        }
    };
    DashboardLayout.prototype.getMinWidth = function (item) {
        return (item.minSizeX) * this.getCellSize()[0];
    };
    
    DashboardLayout.prototype.getMaxWidth = function (item) {
        return (item.maxSizeX) * this.getCellSize()[0];
    };
    
    DashboardLayout.prototype.getMinHeight = function (item) {
        return (item.minSizeY) * this.getCellSize()[1];
    };
    
    DashboardLayout.prototype.getMaxHeight = function (item) {
        return (item.maxSizeY) * this.getCellSize()[1];
    };
    
    DashboardLayout.prototype.sortedPanel = function () {
        this.sortedArray = [];
        for (var i = 0, l = this.panelCollection.length; i < l; ++i) {
            this.sortItem(this.panelCollection[i]);
        }
    };
    DashboardLayout.prototype.moveItemsUpwards = function () {
        if (this.allowFloating === false) {
            return;
        }
        for (var rowIndex = 0, l = this.sortedArray.length; rowIndex < l; ++rowIndex) {
            var columns = this.sortedArray[rowIndex];
            if (!columns) {
                continue;
            }
            for (var colIndex = 0, len = columns.length; colIndex < len; ++colIndex) {
                var item = columns[colIndex];
                if (item) {
                    this.moveItemUpwards(item);
                }
            }
        }
        this.updateGridLines();
    };
    
    DashboardLayout.prototype.moveItemUpwards = function (item) {
        if (this.allowFloating === false || item === this.mainElement) {
            return;
        }
        var colIndex = this.getCellInstance(item.id).col;
        var sizeY = parseInt(item.getAttribute('data-sizeY'), 10);
        var sizeX = parseInt(item.getAttribute('data-sizeX'), 10);
        var availableRow = null;
        var availableColumn = null;
        var rowIndex = parseInt(item.getAttribute('data-row'), 10) - 1;
        while (rowIndex > -1) {
            var items = this.collisions(rowIndex, colIndex, sizeX, sizeY, item);
            if (items.length !== 0) {
                break;
            }
            availableRow = rowIndex;
            availableColumn = colIndex;
            --rowIndex;
        }
        if (availableRow !== null) {
            this.sortItem(item, availableRow, availableColumn);
        }
    };
    DashboardLayout.prototype.sortItem = function (item, rowValue, columnValue, ignoreItems) {
        this.overlapElement = [];
        var column = parseInt(item.getAttribute('data-col'), 10);
        var row = parseInt(item.getAttribute('data-row'), 10);
        if (!this.sortedArray[row]) {
            this.sortedArray[row] = [];
        }
        this.sortedArray[row][column] = item;
        if (item !== undefined && rowValue !== undefined && columnValue !== undefined) {
            if (this.oldRowCol[item.id] !== undefined && this.oldRowCol[item.id].row !== null &&
                typeof this.oldRowCol[item.id].col !== 'undefined') {
                {
                    var oldRow = this.sortedArray[this.oldRowCol[item.id].row];
                    if (this.oldRowCol[item.id] && oldRow[this.oldRowCol[item.id].col] === item) {
                        delete oldRow[this.oldRowCol[item.id].col];
                        this.updateOldRowColumn();
                        this.sortedPanel();
                    }
                }
            }
            this.oldRowCol[item.id].row = rowValue;
            this.oldRowCol[item.id].row = columnValue;
            if (!this.sortedArray[row]) {
                this.sortedArray[row] = [];
            }
            this.sortedArray[row][column] = item;
            if (this.allItems.indexOf(item) === -1) {
                this.allItems.push(item);
            }
            this.panelPropertyChange(this.getCellInstance(item.id), { row: rowValue, col: columnValue });
            var panelModel = this.getCellInstance(item.id);
            this.setAttributes({ value: { col: panelModel.col.toString(), row: panelModel.row.toString() } }, item);
            this.updateLayout(item, this.getCellInstance(item.id));
        }
    };
    DashboardLayout.prototype.updateLayout = function (element, panelModel) {
        this.setPanelPosition(element, panelModel.row, panelModel.col);
        this.setHeightAndWidth(element, panelModel);
        this.updateRowHeight();
        this.sortedPanel();
    };
    
    DashboardLayout.prototype.refresh = function () {
        this.updateDragArea();
        if (this.checkMediaQuery()) {
            this.checkMediaQuerySizing();
        }
        else {
            if (this.element.classList.contains(responsive)) {
                removeClass([this.element], [responsive]);
                for (var i = 0; i < this.element.querySelectorAll('.e-panel').length; i++) {
                    var ele = this.element.querySelectorAll('.e-panel')[i];
                    var cellInstance = this.getCellInstance(ele.id);
                    var row = parseInt(ele.getAttribute('data-row'), 10);
                    var col = parseInt(ele.getAttribute('data-col'), 10);
                    this.panelPropertyChange(cellInstance, { row: row, col: col });
                    this.setHeightAndWidth(ele, this.getCellInstance(ele.id));
                    this.setPanelPosition(ele, row, col);
                    this.updateRowHeight();
                }
            }
            this.panelResponsiveUpdate();
            this.updateGridLines();
        }
        this.removeResizeClasses(this.panelCollection);
        this.setClasses(this.panelCollection);
        this.resizeEvents();
        this.checkDragging(this.dragCollection);
    };
    DashboardLayout.prototype.updateGridLines = function () {
        if (this.element.querySelector('.e-dashboard-gridline-table')) {
            if (this.table) {
                detach(this.table);
            }
            this.initGridLines();
        }
    };
    DashboardLayout.prototype.checkDragging = function (dragCollection) {
        if (this.checkMediaQuery() || !this.allowDragging) {
            for (var i = 0; i < dragCollection.length; i++) {
                dragCollection[i].destroy();
            }
        }
        else {
            for (var i = 0; i < dragCollection.length; i++) {
                dragCollection[i].destroy();
            }
            this.enableDraggingContent(this.panelCollection);
        }
    };
    DashboardLayout.prototype.sortPanels = function () {
        var model = [];
        var _loop_1 = function (row) {
            var _loop_2 = function (col) {
                this_1.panels.filter(function (panel) {
                    if (panel.row === row && panel.col === col) {
                        model.push(panel);
                    }
                });
            };
            for (var col = 0; col < this_1.columns; col++) {
                _loop_2(col);
            }
        };
        var this_1 = this;
        for (var row = 0; row <= this.rows; row++) {
            _loop_1(row);
        }
        return model;
    };
    DashboardLayout.prototype.checkMediaQuerySizing = function () {
        addClass([this.element], [responsive]);
        var updatedPanel = this.sortPanels();
        this.updatedRows = updatedPanel.length;
        for (var i = 0; i < updatedPanel.length; i++) {
            var panelElement = document.getElementById(updatedPanel[i].id);
            if (panelElement) {
                setStyleAttribute(panelElement, { 'width': '100%' });
                panelElement.style.height = ' ' + (this.element.parentElement
                    && this.element.parentElement.offsetWidth / this.cellAspectRatio) + 'px';
                this.cellSize[1] = this.element.parentElement
                    && (this.element.parentElement.offsetWidth / this.cellAspectRatio);
                this.panelPropertyChange(updatedPanel[i], { row: i, col: 0 });
                this.setPanelPosition(panelElement, updatedPanel[i].row, updatedPanel[i].col);
                this.setClasses(this.panelCollection);
                this.checkDragging(this.dragCollection);
                this.removeResizeClasses(this.panelCollection);
            }
        }
        this.updateRowHeight();
    };
    DashboardLayout.prototype.panelResponsiveUpdate = function () {
        this.element.classList.add('e-responsive');
        this.calculateCellSize();
        for (var i = 0; i < this.element.querySelectorAll('.e-panel').length; i++) {
            var ele = this.element.querySelectorAll('.e-panel')[i];
            var panelModel = this.getCellInstance(ele.id);
            this.setHeightAndWidth(ele, panelModel);
        }
        for (var i = 0; i < this.panels.length; i++) {
            this.setPanelPosition(document.getElementById(this.panels[i].id), this.panels[i].row, this.panels[i].col);
        }
        this.updateRowHeight();
    };
    DashboardLayout.prototype.updateRowHeight = function () {
        this.getRowColumn();
        this.setHeightWidth();
    };
    DashboardLayout.prototype.setHeightWidth = function () {
        var heightValue;
        var widthValue;
        if (this.checkMediaQuery()) {
            heightValue = ((this.maxRow()) *
                (this.element.parentElement && Math.floor((this.element.parentElement.offsetWidth)) / this.cellAspectRatio) +
                (this.maxRow() - 1) * this.cellSpacing[1]) + 'px';
        }
        else {
            heightValue = ((this.maxRow()) *
                (this.cellSize[0] / this.cellAspectRatio) + (this.maxRow() - 1) * this.cellSpacing[1]) + 'px';
        }
        setStyleAttribute(this.element, { 'height': heightValue });
        widthValue = window.getComputedStyle(this.element).width;
        setStyleAttribute(this.element, { 'width': widthValue });
    };
    DashboardLayout.prototype.setHeightAndWidth = function (panelElement, panelModel) {
        setStyleAttribute(panelElement, { 'height': formatUnit(this.setXYDimensions(panelModel)[0]) });
        setStyleAttribute(panelElement, { 'width': formatUnit(this.setXYDimensions(panelModel)[1]) });
    };
    DashboardLayout.prototype.renderCell = function (panel, isStringTemplate) {
        this.dimensions = this.setXYDimensions(panel);
        if (isUndefined(panel.enabled)) {
            panel.enabled = true;
        }
        var cellElement = this.createPanelElement(panel.cssClass, panel.id);
        cellElement.style.zIndex = '' + panel.zIndex;
        this.element.appendChild(cellElement);
        var dashBoardCell = this.renderPanels(cellElement, panel, panel.id, isStringTemplate);
        this.panelCollection.push(dashBoardCell);
        this.setXYAttributes(cellElement, panel);
        this.setHeightAndWidth(cellElement, panel);
        return cellElement;
    };
    DashboardLayout.prototype.setPanelPosition = function (cellElement, row, col) {
        if (!cellElement) {
            return;
        }
        var heightValue = this.getCellSize()[1];
        var widthValue = this.getCellSize()[0];
        var left = col === 0 ? 0 : (((col) * (parseInt(widthValue.toString(), 10) + this.cellSpacing[0])));
        var top = row === 0 ? 0 : (((row) * (parseInt(heightValue.toString(), 10) + this.cellSpacing[1])));
        setStyleAttribute(cellElement, { 'left': left + 'px', 'top': top + 'px' });
    };
    DashboardLayout.prototype.getRowColumn = function () {
        this.rows = null;
        if (this.element.querySelectorAll('.e-panel').length > 0 && !this.updatedRows) {
            var panelElements = this.element.querySelectorAll('.e-panel');
            for (var i = 0; i < panelElements.length; i++) {
                var panelElement = panelElements[i];
                var rowValue = parseInt(panelElement.getAttribute('data-row'), 10);
                var xValue = parseInt(panelElement.getAttribute('data-sizeY'), 10);
                this.rows = Math.max(this.rows, (rowValue + xValue));
            }
        }
        else {
            if (this.updatedRows) {
                this.rows = this.updatedRows;
                this.updatedRows = null;
            }
            for (var i = 0; i < this.panels.length; i++) {
                this.rows = Math.max(this.rows, this.panels[i].row);
            }
        }
    };
    DashboardLayout.prototype.setMinMaxValues = function (panel) {
        if (!panel.sizeX || panel.sizeX < panel.minSizeX) {
            this.panelPropertyChange(panel, { sizeX: panel.minSizeX });
        }
        else if ((panel.maxSizeX && panel.sizeX > panel.maxSizeX)) {
            this.panelPropertyChange(panel, { sizeX: panel.maxSizeX });
        }
        else if (panel.sizeX > this.columns) {
            this.panelPropertyChange(panel, { sizeX: this.columns });
        }
        else {
            this.panelPropertyChange(panel, { sizeX: panel.sizeX });
        }
        if (!panel.sizeY || panel.sizeY < panel.minSizeY) {
            this.panelPropertyChange(panel, { sizeY: panel.minSizeY });
        }
        else if (panel.maxSizeY && panel.sizeY > panel.maxSizeY) {
            this.panelPropertyChange(panel, { sizeY: panel.maxSizeY });
        }
        else {
            this.panelPropertyChange(panel, { sizeY: panel.sizeY });
        }
    };
    DashboardLayout.prototype.checkMinMaxValues = function (panel) {
        if (panel.col + panel.sizeX > this.columns) {
            this.panelPropertyChange(panel, { sizeX: panel.sizeX + (this.columns - (panel.col + panel.sizeX)) });
        }
    };
    DashboardLayout.prototype.panelPropertyChange = function (panel, value) {
        // tslint:disable-next-line
        panel.setProperties(value, true);
    };
    DashboardLayout.prototype.renderDashBoardCells = function (cells) {
        if (this.element.querySelectorAll('.e-panel').length > 0 || this.panels.length > 0) {
            for (var j = 0; j < cells.length; j++) {
                this.gridPanelCollection.push(cells[j]);
                this.setMinMaxValues(cells[j]);
                if (this.maxColumnValue < cells[j].col || this.maxColumnValue < (cells[j].col + cells[j].sizeX)) {
                    this.panelPropertyChange(cells[j], { col: this.maxColumnValue - cells[j].sizeX });
                }
                var cell = this.renderCell(cells[j], false);
                if (this.enableRtl) {
                    addClass([cell], 'e-rtl');
                }
                this.element.appendChild(cell);
                if (this.checkMediaQuery() && j === cells.length - 1) {
                    this.checkMediaQuerySizing();
                }
                else {
                    this.setPanelPosition(cell, cells[j].row, cells[j].col);
                    this.mainElement = cell;
                    this.updatePanelLayout(cell, cells[j]);
                    this.mainElement = null;
                }
            }
        }
        this.setClasses(this.panelCollection);
    };
    DashboardLayout.prototype.collisions = function (row, col, sizeX, sizeY, ignore) {
        var items = [];
        if (!sizeX || !sizeY) {
            sizeX = sizeY = 1;
        }
        if (ignore && !(ignore instanceof Array)) {
            ignore = [ignore];
        }
        var item;
        for (var h = 0; h < sizeY; ++h) {
            for (var w = 0; w < sizeX; ++w) {
                item = this.getPanel(row + h, col + w, ignore);
                if (item && (!ignore || ignore.indexOf(document.getElementById(item.id)) === -1) &&
                    items.indexOf(document.getElementById(item.id)) === -1) {
                    items.push(document.getElementById(item.id));
                }
            }
        }
        return items;
    };
    
    DashboardLayout.prototype.rightWardsSpaceChecking = function (rowElements, col, ele) {
        var _this = this;
        var columns = [];
        var spacedColumns = [];
        rowElements.forEach(function (element) {
            var columnValue = parseInt(element.getAttribute('data-col'), 10);
            var sizeXValue = parseInt(element.getAttribute('data-sizeX'), 10);
            if (col < _this.columns && columnValue >= col) {
                if (sizeXValue > 1) {
                    for (var i = columnValue; i < columnValue + sizeXValue; i++) {
                        columns.push(i);
                    }
                }
                else {
                    columns.push(columnValue);
                }
            }
        });
        if (columns.length > 0) {
            for (var i = col + 1; i <= this.columns - 1; i++) {
                if (columns.indexOf(i) === -1 && i !== col) {
                    if (spacedColumns.indexOf(i) === -1) {
                        spacedColumns.push(i);
                    }
                }
            }
        }
        var occupiedValues = this.getOccupiedColumns(ele, 'right');
        occupiedValues.forEach(function (colValue) {
            if (colValue > col && spacedColumns.indexOf(colValue) !== -1) {
                spacedColumns.splice(spacedColumns.indexOf(colValue), 1);
            }
        });
        var eleOccupiedValues = this.getOccupiedColumns(this.checkingElement, 'left');
        eleOccupiedValues.forEach(function (col) {
            if (col > parseInt(ele.getAttribute('data-col'), 10) && occupiedValues.indexOf(col) === -1 &&
                spacedColumns.indexOf(col) === -1) {
                spacedColumns.push(col);
            }
        });
        spacedColumns = spacedColumns.sort(function (next, previous) { return next - previous; });
        return spacedColumns;
    };
    DashboardLayout.prototype.getOccupiedColumns = function (element, type) {
        var occupiedItems = [];
        var sizeX = parseInt(element.getAttribute('data-sizeX'), 10);
        var col = parseInt(element.getAttribute('data-col'), 10);
        for (var i = col; (i < col + sizeX && i <= this.columns); i++) {
            occupiedItems.push(i);
        }
        return occupiedItems;
    };
    DashboardLayout.prototype.leftWardsSpaceChecking = function (rowElements, col, ele) {
        var _this = this;
        var spacedColumns = [];
        var columns = [];
        rowElements.forEach(function (element) {
            var colValue = parseInt(element.getAttribute('data-col'), 10);
            var xValue = parseInt(element.getAttribute('data-sizeX'), 10);
            if (col <= _this.columns && colValue <= col) {
                if (xValue > 1) {
                    for (var i = colValue; i < colValue + xValue; i++) {
                        columns.push(i);
                    }
                }
                else {
                    columns.push(colValue);
                }
            }
        });
        if (columns.length > 0) {
            for (var i = 0; i <= col; i++) {
                if (columns.indexOf(i) === -1 && i !== col) {
                    if (spacedColumns.indexOf(i) === -1) {
                        spacedColumns.push(i);
                    }
                }
            }
        }
        var occupiedValues = this.getOccupiedColumns(ele, 'left');
        occupiedValues.forEach(function (colValue) {
            if (colValue < col && spacedColumns.indexOf(colValue) !== -1) {
                spacedColumns.splice(spacedColumns.indexOf(colValue), 1);
            }
        });
        var eleOccupiedValues = this.getOccupiedColumns(this.checkingElement, 'left');
        eleOccupiedValues.forEach(function (col) {
            if (col < parseInt(ele.getAttribute('data-col'), 10) && occupiedValues.indexOf(col) === -1 &&
                spacedColumns.indexOf(col) === -1) {
                spacedColumns.push(col);
            }
        });
        spacedColumns = spacedColumns.sort(function (next, prev) { return next - prev; });
        spacedColumns = spacedColumns.reverse();
        return spacedColumns;
    };
    DashboardLayout.prototype.adjustmentAvailable = function (row, col, sizeY, sizeX, ele) {
        this.leftAdjustable = undefined;
        this.rightAdjustable = undefined;
        var isAdjustable = false;
        var leftSpacing;
        var rightSpacing;
        var rowElement = [];
        this.topAdjustable = undefined;
        var eleSizeX = parseInt(ele.getAttribute('data-sizeX'), 10);
        var eleCol = parseInt(ele.getAttribute('data-col'), 10);
        rowElement = this.getRowElements(this.collisions(row, 0, this.columns, sizeY, []));
        if (rowElement.indexOf(ele) === -1) {
            rowElement.push(ele);
        }
        leftSpacing = this.leftWardsSpaceChecking(rowElement, col, ele);
        if (leftSpacing.length > 0) {
            this.leftAdjustable = this.isLeftAdjustable(leftSpacing, ele, row, col, sizeX, sizeY);
            if (this.spacedColumnValue !== eleCol - this.getCellInstance(this.checkingElement.id).sizeX) {
                this.leftAdjustable = false;
            }
            if (this.leftAdjustable) {
                this.rightAdjustable = false;
            }
            else {
                this.leftAdjustable = false;
                rightSpacing = this.rightWardsSpaceChecking(rowElement, col, ele);
                this.rightAdjustable = rightSpacing.length > 0 ? this.isRightAdjustable(rightSpacing, ele, row, col, sizeX, sizeY) : false;
                if (this.spacedColumnValue !== eleSizeX + eleCol) {
                    this.rightAdjustable = false;
                }
                if (!this.rightAdjustable) {
                    this.rightAdjustable = false;
                }
            }
        }
        else {
            rightSpacing = this.rightWardsSpaceChecking(rowElement, col, ele);
            this.rightAdjustable = rightSpacing.length > 0 ? this.isRightAdjustable(rightSpacing, ele, row, col, sizeX, sizeY) : false;
            if (this.spacedColumnValue !== eleSizeX + eleCol) {
                this.rightAdjustable = false;
            }
            if (this.rightAdjustable) {
                this.leftAdjustable = false;
            }
        }
        if (!this.rightAdjustable && !this.leftAdjustable && row > 0) {
            var endRow = this.getCellInstance(ele.id).row;
            var topCheck = false;
            if (this.startRow !== endRow) {
                topCheck = true;
            }
            for (var rowValue = row; rowValue >= 0; rowValue--) {
                var element = (this.getCellInstance(ele.id).sizeY > 1 && topCheck) ? this.checkingElement : ele;
                if ((rowValue !== endRow) && (sizeY > 1 ? rowValue === endRow - sizeY - 1 : rowValue === endRow - sizeY) &&
                    this.collisions(rowValue, col, sizeX, sizeY, element).length === 0) {
                    topCheck = false;
                    this.topAdjustable = true;
                    this.spacedRowValue = isNullOrUndefined(this.spacedRowValue) ? rowValue : this.spacedRowValue;
                    this.spacedColumnValue = col;
                }
            }
        }
        if (this.rightAdjustable || this.leftAdjustable || this.topAdjustable) {
            isAdjustable = true;
            if (isNullOrUndefined(this.spacedRowValue)) {
                this.spacedRowValue = row;
            }
        }
        return isAdjustable;
    };
    DashboardLayout.prototype.isXSpacingAvailable = function (spacing, sizeX) {
        var isSpaceAvailable = false;
        var subSpacingColumns = [];
        for (var i = 0; i < spacing.length; i++) {
            if (spacing[i + 1] - spacing[i] === 1 || spacing[i + 1] - spacing[i] === -1) {
                subSpacingColumns.push(spacing[i]);
                if (sizeX === 2) {
                    subSpacingColumns.push(spacing[i + 1]);
                }
                if (i === spacing.length - 2) {
                    subSpacingColumns.push(spacing[i + 1]);
                    if (subSpacingColumns.length > sizeX) {
                        subSpacingColumns.splice(-1);
                    }
                }
                if (subSpacingColumns.length === sizeX) {
                    isSpaceAvailable = true;
                    this.spacedColumnValue = subSpacingColumns.sort(function (next, previous) { return next - previous; })[0];
                    if (this.spacedColumnValue < 0) {
                        this.spacedColumnValue = 1;
                    }
                    return isSpaceAvailable;
                }
            }
            else {
                subSpacingColumns = [];
                continue;
            }
        }
        return isSpaceAvailable;
    };
    DashboardLayout.prototype.getRowElements = function (base) {
        var rowElements = [];
        for (var i = 0; i < base.length; i++) {
            rowElements.push(base[i]);
        }
        return rowElements;
    };
    DashboardLayout.prototype.isLeftAdjustable = function (spaces, ele, row, col, sizeX, sizeY) {
        var isLeftAdjudtable;
        if (sizeX === 1 && sizeY === 1 && spaces.length > 0) {
            this.spacedColumnValue = spaces[0];
            isLeftAdjudtable = true;
        }
        else if (sizeX > 1 && sizeY === 1) {
            isLeftAdjudtable = this.isXSpacingAvailable(spaces, sizeX);
        }
        else if (sizeY > 1) {
            if (sizeX === 1) {
                var xAdjust = void 0;
                if (spaces.length >= 1) {
                    xAdjust = true;
                }
                if (xAdjust) {
                    for (var i = 0; i < spaces.length; i++) {
                        var collisionValue = this.collisions(row, spaces[i], sizeX, sizeY, this.checkingElement);
                        if (collisionValue.length === 0) {
                            this.spacedColumnValue = spaces[i];
                            isLeftAdjudtable = true;
                            return isLeftAdjudtable;
                        }
                        else {
                            isLeftAdjudtable = false;
                        }
                    }
                }
            }
            else {
                isLeftAdjudtable = this.replacable(spaces, sizeX, row, sizeY, ele);
            }
        }
        return isLeftAdjudtable;
    };
    DashboardLayout.prototype.isRightAdjustable = function (spacing, ele, row, col, sizeX, sizeY) {
        var isRightAdjudtable;
        if (sizeX === 1 && sizeY === 1 && spacing.length > 0) {
            this.spacedColumnValue = spacing[0];
            isRightAdjudtable = true;
        }
        else if (sizeX > 1 && sizeY === 1) {
            isRightAdjudtable = this.isXSpacingAvailable(spacing, sizeX);
        }
        else if (sizeY > 1) {
            if (sizeX === 1) {
                var xAdjust = void 0;
                if (spacing.length >= 1) {
                    xAdjust = true;
                }
                if (xAdjust) {
                    for (var i = 0; i < spacing.length; i++) {
                        var collisionValue = this.collisions(row, spacing[i], sizeX, sizeY, this.checkingElement);
                        for (var collision = 0; collision < collisionValue.length; collision++) {
                            if (parseInt(ele.getAttribute('data-col'), 10) !== spacing[i]) {
                                collisionValue.splice(collisionValue.indexOf(collisionValue[collision]), 1);
                            }
                        }
                        if (collisionValue.length === 0) {
                            isRightAdjudtable = true;
                            this.spacedColumnValue = spacing[i];
                            return isRightAdjudtable;
                        }
                        else {
                            isRightAdjudtable = false;
                        }
                    }
                }
            }
            else {
                isRightAdjudtable = this.replacable(spacing, sizeX, row, sizeY, ele);
            }
        }
        return isRightAdjudtable;
    };
    DashboardLayout.prototype.replacable = function (spacing, sizeX, row, sizeY, ele) {
        var isRightAdjudtable;
        var updatedCollision = [];
        for (var j = 0; j < spacing.length; j++) {
            var xAdjust = this.isXSpacingAvailable(spacing, sizeX);
            if (xAdjust) {
                var exclusions = [];
                exclusions.push(this.checkingElement);
                exclusions.push(ele);
                if (updatedCollision.length === 0) {
                    isRightAdjudtable = true;
                    this.spacedColumnValue = this.spacedColumnValue;
                    return isRightAdjudtable;
                }
                else {
                    isRightAdjudtable = false;
                }
            }
        }
        return isRightAdjudtable;
    };
    DashboardLayout.prototype.sortCollisionItems = function (collisionItems) {
        var updatedCollision = [];
        var rowElements;
        var _loop_3 = function (row) {
            rowElements = [];
            collisionItems.forEach(function (element) {
                if (element && element.getAttribute('data-row') === row.toString()) {
                    rowElements.push(element);
                }
            });
            var _loop_4 = function (column) {
                rowElements.forEach(function (item) {
                    if (item && item.getAttribute('data-col') === column.toString()) {
                        updatedCollision.push(item);
                    }
                });
            };
            for (var column = this_2.columns - 1; column >= 0; column--) {
                _loop_4(column);
            }
        };
        var this_2 = this;
        for (var row = this.rows - 1; row >= 0; row--) {
            _loop_3(row);
        }
        return updatedCollision;
    };
    DashboardLayout.prototype.updatedModels = function (collisionItems, panelModel, ele) {
        var _this = this;
        if (!this.mainElement) {
            this.sortedPanel();
        }
        collisionItems.forEach(function (element) {
            _this.checkingElement = element;
            var model = _this.getCellInstance(element.id);
            var adjust = !_this.adjustmentAvailable(model.row, model.col, model.sizeY, model.sizeX, ele);
            if (model.sizeX > 1 && adjust) {
                for (var rowValue = model.row; rowValue < panelModel.row + panelModel.sizeY; rowValue++) {
                    var collisions = _this.collisions(rowValue, model.col, model.sizeX, model.sizeY, element);
                    collisions.forEach(function (item) {
                        if (collisionItems.indexOf(item) >= 0) {
                            collisionItems.splice(collisionItems.indexOf(item), 1);
                        }
                    });
                }
            }
        });
        return collisionItems;
    };
    DashboardLayout.prototype.resetLayout = function (model, element) {
        var collisions = this.collisions(model.row, model.col, model.sizeX, model.sizeY, this.mainElement);
        if (!this.mainElement || this.addPanelCalled || this.resizeCalled || this.movePanelCalled) {
            return collisions;
        }
        if (this.mainElement && this.oldRowCol !== this.cloneObject) {
            for (var i = 0; i < this.panels.length; i++) {
                var element_1 = document.getElementById(this.panels[i].id);
                if (element_1 === this.mainElement) {
                    continue;
                }
                var rowValue = this.cloneObject[element_1.id].row;
                var colValue = this.cloneObject[element_1.id].col;
                this.setPanelPosition(element_1, rowValue, colValue);
                this.panelPropertyChange(this.getCellInstance(element_1.id), { row: rowValue, col: colValue });
                this.setAttributes({ value: { col: colValue.toString(), row: rowValue.toString() } }, element_1);
                this.updateOldRowColumn();
            }
        }
        this.sortedArray = this.cloneArray;
        collisions = this.collisions(model.row, model.col, model.sizeX, model.sizeY, this.mainElement);
        this.sortedPanel();
        this.updateOldRowColumn();
        if (this.checkCollision && this.checkCollision.length > 0 && collisions.indexOf(this.checkCollision[0]) === -1 &&
            this.cloneObject[this.checkCollision[0].id].row === model.row) {
            collisions.push(this.checkCollision[0]);
        }
        return collisions;
    };
    DashboardLayout.prototype.swapAvailability = function (collisions, element) {
        var available = true;
        var eleModel = this.getCellInstance(element.id);
        for (var count = 0; count < collisions.length; count++) {
            var collideModel = this.getCellInstance(collisions[count].id);
            for (var i = 1; i < eleModel.sizeY; i++) {
                var excludeEle = [];
                excludeEle.push(element);
                excludeEle.push(collisions[count]);
                var collision = void 0;
                collision = this.collisions(eleModel.row + i, collideModel.col, collideModel.sizeX, collideModel.sizeY, excludeEle);
                if (collision.length > 0) {
                    available = false;
                    return false;
                }
                else {
                    continue;
                }
            }
        }
        return available;
    };
    DashboardLayout.prototype.checkForSwapping = function (collisions, element, panelModel) {
        if (!this.mainElement || collisions.length === 0) {
            return false;
        }
        var direction;
        var eleSwapRow = parseInt(collisions[0].getAttribute('data-row'), 10);
        if (this.startRow < eleSwapRow) {
            direction = 1;
        }
        else if (this.startRow > eleSwapRow) {
            direction = 0;
        }
        if (!this.swapAvailability(collisions, element)) {
            return false;
        }
        var isSwappable = false;
        for (var count1 = 0; count1 < collisions.length; count1++) {
            if (collisions.length >= 1 && this.cloneObject[this.mainElement.id].row === this.oldRowCol[this.mainElement.id].row) {
                return false;
            }
        }
        var updatedRow = direction === 0 ?
            this.getCellInstance(this.mainElement.id).row + this.getCellInstance(this.mainElement.id).sizeY
            : this.startRow;
        for (var count = 0; count < collisions.length; count++) {
            var collideInstance = this.getCellInstance(collisions[count].id);
            var elementinstance = this.getCellInstance(element.id);
            var ignore = [];
            if (collideInstance.sizeY === 1) {
                ignore.push(collisions[count]);
            }
            else if (collideInstance.sizeY > 1) {
                if (direction === 1 && elementinstance.row === (this.cloneObject[collideInstance.id].row + collideInstance.sizeY - 1)) {
                    ignore.push(collisions[count]);
                }
                else if (direction === 0 && elementinstance.row === (this.cloneObject[collideInstance.id].row)) {
                    ignore.push(collisions[count]);
                }
                else {
                    return false;
                }
            }
            if (collideInstance.sizeY <= elementinstance.sizeY) {
                ignore.push(collisions[count]);
            }
            var swapCollision = void 0;
            swapCollision = this.collisions(updatedRow, collideInstance.col, collideInstance.sizeX, collideInstance.sizeY, ignore);
            if (swapCollision.length > 0) {
                isSwappable = false;
                return isSwappable;
            }
            else {
                if (count === collisions.length - 1) {
                    isSwappable = true;
                }
                continue;
            }
        }
        return isSwappable;
    };
    DashboardLayout.prototype.swapItems = function (collisions, element, panelModel) {
        var _this = this;
        var direction;
        var swappedElements = [];
        swappedElements.push(element);
        var eleSwapRow = parseInt(collisions[0].getAttribute('data-row'), 10);
        if (this.startRow < eleSwapRow) {
            direction = 1;
        }
        else if (this.startRow > eleSwapRow) {
            direction = 0;
        }
        var collisionItemsRow = direction === 0 ? eleSwapRow + panelModel.sizeY : this.startRow;
        this.panelPropertyChange(panelModel, { row: direction === 0 ? eleSwapRow : collisionItemsRow + 1 });
        for (var count = 0; count < collisions.length; count++) {
            swappedElements.push(collisions[count]);
            this.setPanelPosition(collisions[count], collisionItemsRow, (this.getCellInstance(collisions[count].id)).col);
            this.panelPropertyChange(this.getCellInstance(collisions[count].id), { row: collisionItemsRow });
            collisions[count].setAttribute('data-row', collisionItemsRow.toString());
        }
        element.setAttribute('data-row', panelModel.row.toString());
        this.setPanelPosition(this.shadowEle, panelModel.row, panelModel.col);
        for (var i = 0; i < this.panels.length; i++) {
            this.oldRowCol[this.panels[i].id] = { row: this.panels[i].row, col: this.panels[i].col };
        }
        this.startRow = panelModel.row;
        this.updateOldRowColumn();
        swappedElements.forEach(function (item) {
            _this.cloneObject[item.id] = _this.oldRowCol[item.id];
            var itemModel = _this.getCellInstance(item.id);
            for (var i = 0; i < _this.sortedArray.length; i++) {
                if (!_this.sortedArray[i]) {
                    continue;
                }
                for (var j = 0; j < _this.sortedArray[i].length; j++) {
                    if (_this.sortedArray[i][j] === item) {
                        _this.sortedArray[i][j] = undefined;
                    }
                }
            }
            if (!_this.sortedArray[itemModel.row]) {
                _this.sortedArray[itemModel.row] = [];
            }
            _this.sortedArray[itemModel.row][itemModel.col] = item;
            _this.cloneArray = _this.sortedArray;
        });
    };
    DashboardLayout.prototype.updatePanelLayout = function (element, panelModel) {
        this.collisionChecker = {};
        var initialModel = [];
        var checkForAdjustment;
        var collisionModels = [];
        var swappingAvailable;
        if (this.mainElement && this.isRenderComplete) {
            initialModel = this.resetLayout(panelModel, element);
        }
        else {
            initialModel = this.collisions(panelModel.row, panelModel.col, panelModel.sizeX, panelModel.sizeY, element);
        }
        if (initialModel.length > 0) {
            initialModel = this.sortCollisionItems(initialModel);
            initialModel = this.updatedModels(initialModel, panelModel, element);
            swappingAvailable = !isNullOrUndefined(this.startRow) ? this.checkForSwapping(initialModel, element, panelModel) : false;
            if (swappingAvailable) {
                this.swapItems(initialModel, element, panelModel);
            }
            else {
                for (var i = 0; i < initialModel.length; i++) {
                    var model = this.getCellInstance(initialModel[i].id);
                    this.checkingElement = initialModel[i];
                    this.spacedRowValue = null;
                    this.spacedColumnValue = null;
                    checkForAdjustment = this.adjustmentAvailable(model.row, model.col, model.sizeY, model.sizeX, element);
                    if (checkForAdjustment && !isNullOrUndefined(this.spacedColumnValue)) {
                        this.setPanelPosition(initialModel[i], this.spacedRowValue, this.spacedColumnValue);
                        this.oldRowCol[(initialModel[i].id)] = { row: this.spacedRowValue, col: this.spacedColumnValue };
                        var value = {
                            attributes: {
                                row: this.spacedRowValue.toString(),
                                col: this.spacedColumnValue.toString(),
                            }
                        };
                        this.setAttributes(value, initialModel[i]);
                        this.panelPropertyChange(model, { col: this.spacedColumnValue, row: this.spacedRowValue });
                        this.spacedRowValue = null;
                        if (i < initialModel.length) {
                            continue;
                        }
                    }
                    else {
                        collisionModels.push(initialModel[i]);
                    }
                }
            }
        }
        if (collisionModels.length > 0) {
            var proxy_1 = this;
            collisionModels.forEach(function (item1) {
                if (proxy_1.overlapElement.indexOf(item1) === -1) {
                    proxy_1.overlapElement.push(item1);
                }
            });
            if (this.overlapElement && this.overlapElement.indexOf(element) !== -1) {
                this.overlapElement.splice(this.overlapElement.indexOf(element), 1);
            }
            if (collisionModels.length > 0) {
                this.updateRowColumn(panelModel.row, this.overlapElement, element);
                this.checkForCompletePushing();
            }
        }
        if (!this.isSubValue) {
            this.sortedPanel();
        }
        this.updateRowHeight();
        this.updateGridLines();
    };
    DashboardLayout.prototype.checkForCompletePushing = function () {
        for (var i = 0; i < this.panels.length; i++) {
            if (this.collisionChecker[this.panels[i].id] && this.collisionChecker[this.panels[i].id] !== null) {
                this.overlapElement = [this.collisionChecker[this.panels[i].id].ele];
                var key = this.panels[i].id;
                this.updateRowColumn(this.collisionChecker[key].row, this.overlapElement, this.collisionChecker[key].srcEle);
            }
        }
    };
    DashboardLayout.prototype.updateCollisionChecked = function (item) {
        for (var count = 0; count < Object.keys(this.collisionChecker).length; count++) {
            this.collisionChecker[item.id] = null;
        }
    };
    DashboardLayout.prototype.updateRowColumn = function (row, ele, srcEle) {
        if (!srcEle) {
            return;
        }
        var eleSizeY = parseInt(srcEle.getAttribute('data-sizeY'), 10);
        var eleRow = parseInt(srcEle.getAttribute('data-row'), 10);
        this.overlapElementClone = this.overlapElement && !this.shouldRestrict ? this.overlapElement : this.overlapElement;
        for (var i = 0; i < this.overlapElementClone.length; i++) {
            if (this.overlapElementClone.length === 0) {
                return;
            }
            for (var i_1 = 0; i_1 < this.overlapElementClone.length; i_1++) {
                this.collisionChecker[this.overlapElementClone[i_1].id] = {
                    ele: this.overlapElementClone[i_1],
                    row: row,
                    srcEle: srcEle
                };
            }
            var updatedRow = eleRow + eleSizeY;
            var collisionY = parseInt(this.overlapElementClone[i].getAttribute('data-sizeY'), 10);
            var collisionCol = parseInt(this.overlapElementClone[i].getAttribute('data-col'), 10);
            var collisionX = parseInt(this.overlapElementClone[i].getAttribute('data-sizeX'), 10);
            var colValue = void 0;
            var collisionModels = void 0;
            if (this.overlapSubElementClone.indexOf(srcEle) === -1) {
                this.overlapSubElementClone.push(srcEle);
            }
            if (this.overlapSubElementClone.indexOf(this.overlapElementClone[i]) === -1) {
                this.overlapSubElementClone.push(this.overlapElementClone[i]);
            }
            if (collisionY > 1 || collisionX > 1) {
                var overlapElementModel = this.getCellInstance(this.overlapElementClone[i].id);
                colValue = overlapElementModel.col;
                var ele_1 = document.getElementById(overlapElementModel.id);
                for (var k = overlapElementModel.row; k < eleRow + eleSizeY; k++) {
                    this.isSubValue = true;
                    this.panelPropertyChange(overlapElementModel, { row: overlapElementModel.row + 1 });
                    ele_1.setAttribute('data-row', overlapElementModel.row.toString());
                    this.setPanelPosition(ele_1, overlapElementModel.row, colValue);
                    this.updateCollisionChecked(ele_1);
                    this.oldRowCol[(ele_1.id)] = { row: overlapElementModel.row, col: colValue };
                    var panelModel = this.getCellInstance(ele_1.id);
                    this.panelPropertyChange(panelModel, { col: colValue, row: overlapElementModel.row });
                    var eleRow_1 = parseInt(ele_1.getAttribute('data-row'), 10);
                    var eleCol = parseInt(ele_1.getAttribute('data-col'), 10);
                    var sizeX = parseInt(ele_1.getAttribute('data-sizeX'), 10);
                    var sizeY = parseInt(ele_1.getAttribute('data-sizeY'), 10);
                    var excludeElements = [];
                    excludeElements.push(ele_1);
                    excludeElements.push(srcEle);
                    collisionModels = this.collisions(eleRow_1, eleCol, sizeX, sizeY, excludeElements);
                    if (this.mainElement && collisionModels.indexOf(this.mainElement) !== -1) {
                        collisionModels.splice(collisionModels.indexOf(this.mainElement), 1);
                    }
                    this.collisionPanel(collisionModels, eleCol, eleRow_1, ele_1);
                }
                this.isSubValue = false;
            }
            else {
                if (this.addPanelCalled) {
                    this.addPanelCalled = false;
                }
                this.overlapElementClone[i].setAttribute('data-row', updatedRow.toString());
                var excludeEle = [];
                excludeEle.push(this.overlapElementClone[i]);
                excludeEle.push(srcEle);
                collisionModels = this.collisions(updatedRow, collisionCol, collisionX, collisionY, excludeEle);
                if (this.mainElement && collisionModels.indexOf(this.mainElement) !== -1) {
                    collisionModels.splice(collisionModels.indexOf(this.mainElement), 1);
                }
                colValue = parseInt(this.overlapElementClone[i].getAttribute('data-col'), 10);
                this.setPanelPosition(this.overlapElementClone[i], updatedRow, colValue);
                this.updateCollisionChecked(this.overlapElementClone[i]);
                this.oldRowCol[(this.overlapElementClone[i].id)] = { row: updatedRow, col: colValue };
                var panelModel = this.getCellInstance(this.overlapElementClone[i].id);
                this.panelPropertyChange(panelModel, { col: colValue, row: updatedRow });
                this.collisionPanel(collisionModels, colValue, updatedRow, this.overlapElementClone[i]);
            }
        }
    };
    DashboardLayout.prototype.collisionPanel = function (collisionModels, colValue, updatedRow, clone) {
        var panelModel = this.getCellInstance(clone.id);
        this.panelPropertyChange(panelModel, { row: updatedRow, col: colValue });
        if (collisionModels.length > 0) {
            var proxy_2 = this;
            this.overlapElement = [];
            this.shouldRestrict = true;
            collisionModels.forEach(function (item1) {
                proxy_2.overlapElement.push(item1);
            });
            var overlapElementRow1 = parseInt(clone.getAttribute('data-row'), 10);
            for (var m = 0; m < this.overlapElement.length; m++) {
                this.updateRowColumn(overlapElementRow1, this.overlapElement, clone);
            }
            this.shouldRestrict = false;
        }
        else {
            if (!this.addPanelCalled) {
                this.sortedPanel();
            }
            if (this.overlapSubElementClone.length > 0) {
                var _loop_5 = function (p) {
                    var rowVal = parseInt(this_3.overlapSubElementClone[p].getAttribute('data-row'), 10);
                    var colValue_1 = parseInt(this_3.overlapSubElementClone[p].getAttribute('data-col'), 10);
                    var sizeX = parseInt(this_3.overlapSubElementClone[p].getAttribute('data-sizeX'), 10);
                    var sizeY = parseInt(this_3.overlapSubElementClone[p].getAttribute('data-sizeY'), 10);
                    var collisionModels1 = void 0;
                    collisionModels1 = this_3.collisions(rowVal, colValue_1, sizeX, sizeY, this_3.overlapSubElementClone);
                    if (this_3.mainElement && collisionModels1.indexOf(this_3.mainElement) !== -1) {
                        collisionModels1.splice(collisionModels1.indexOf(this_3.mainElement), 1);
                    }
                    var proxy = this_3;
                    collisionModels1.forEach(function (item1) {
                        proxy.overlapElement.push(item1);
                    });
                    if (collisionModels1.length > 0) {
                        this_3.updateRowColumn(rowVal, this_3.overlapElement, this_3.overlapSubElementClone[p]);
                    }
                };
                var this_3 = this;
                for (var p = 0; p < this.overlapSubElementClone.length; p++) {
                    _loop_5(p);
                }
            }
            this.overlapSubElementClone = [];
        }
    };
    DashboardLayout.prototype.removeResizeClasses = function (panelElements) {
        for (var i = 0; i < panelElements.length; i++) {
            var element = panelElements[i];
            var resizerElements = element.querySelectorAll('.e-resize');
            for (var i_2 = 0; i_2 < resizerElements.length; i_2++) {
                detach(resizerElements[i_2]);
            }
        }
    };
    DashboardLayout.prototype.setClasses = function (panelCollection) {
        for (var i = 0; i < panelCollection.length; i++) {
            var element = panelCollection[i];
            var containerEle = panelCollection[i].querySelector('.e-panel-container');
            if (this.allowDragging) {
                if (this.draggableHandle && element.querySelectorAll(this.draggableHandle)[0]) {
                    addClass([element.querySelectorAll(this.draggableHandle)[0]], [draggable]);
                }
            }
            if (this.allowResizing &&
                this.mediaQuery ? !(this.checkMediaQuery()) : false) {
                this.setResizingClass(element, containerEle);
            }
        }
    };
    DashboardLayout.prototype.setResizingClass = function (ele, container) {
        this.availableClasses = this.resizableHandles;
        for (var j = 0; j < this.availableClasses.length; j++) {
            var spanEle = this.createElement('span');
            var addClassValue = void 0;
            container.appendChild(spanEle);
            if (this.availableClasses[j] === 'e-east' || this.availableClasses[j] === 'e-west' ||
                this.availableClasses[j] === 'e-north' || this.availableClasses[j] === 'e-south') {
                addClassValue = single;
            }
            else {
                addClassValue = double;
            }
            addClass([spanEle], [addClassValue, this.availableClasses[j], resize]);
        }
    };
    DashboardLayout.prototype.setXYAttributes = function (element, panelModel) {
        var value = {
            value: {
                sizeX: panelModel.sizeX.toString(),
                sizeY: panelModel.sizeY.toString(),
                minSizeX: panelModel.minSizeX.toString(),
                minSizeY: panelModel.minSizeY.toString(),
                maxSizeX: !isNullOrUndefined(panelModel.maxSizeX) ? panelModel.maxSizeX.toString() : undefined,
                maxSizeY: !isNullOrUndefined(panelModel.maxSizeY) ? panelModel.maxSizeY.toString() : undefined,
                row: panelModel.row.toString(),
                col: panelModel.col.toString(),
            }
        };
        this.setAttributes(value, element);
    };
    DashboardLayout.prototype.setXYDimensions = function (panelModel) {
        var cellHeight = this.getCellSize()[1];
        var cellWidth = this.getCellSize()[0];
        var widthValue;
        var heigthValue;
        if (panelModel && typeof (cellWidth) === 'number' && typeof (panelModel.sizeX) === 'number' && panelModel.sizeX > 1) {
            widthValue = (panelModel.sizeX * cellWidth) + (panelModel.sizeX - 1) * this.cellSpacing[0];
        }
        else {
            widthValue = cellWidth;
        }
        if (panelModel && typeof (cellHeight) === 'number' && panelModel.sizeY > 1 && typeof (panelModel.sizeY) === 'number') {
            heigthValue = (panelModel.sizeY * cellHeight) + (panelModel.sizeY - 1) * this.cellSpacing[1];
        }
        else {
            heigthValue = formatUnit(cellHeight);
        }
        return [heigthValue, widthValue];
    };
    DashboardLayout.prototype.getRowColumnDragValues = function (args) {
        var value = [];
        var elementTop = parseInt(args.element.style.top, 10);
        var elementLeft = parseInt(args.element.style.left, 10);
        var row = Math.round(elementTop / (this.getCellSize()[1] + this.cellSpacing[1]));
        var col = Math.round(elementLeft / (this.getCellSize()[0] + +this.cellSpacing[0]));
        value = [row, col];
        return value;
    };
    DashboardLayout.prototype.enableDraggingContent = function (collections) {
        var _this = this;
        for (var i = 0; i < collections.length; i++) {
            var cellElement = collections[i];
            {
                this.dragobj = new Draggable(cellElement, {
                    preventDefault: false,
                    clone: false,
                    dragArea: this.element,
                    handle: this.draggableHandle ? this.draggableHandle : '.e-panel',
                    abort: '.e-resize',
                    dragStart: this.onDraggingStart.bind(this),
                    dragStop: function (args) {
                        var model = _this.getCellInstance(_this.mainElement.id);
                        if (_this.allowPushing &&
                            _this.collisions(model.row, model.col, model.sizeX, model.sizeY, _this.mainElement).length > 0) {
                            _this.setHolderPosition(args);
                            _this.setPanelPosition(_this.mainElement, model.row, model.col);
                            _this.updatePanelLayout(_this.mainElement, model);
                        }
                        else {
                            _this.setPanelPosition(_this.mainElement, model.row, model.col);
                        }
                        var changedPanels = [];
                        _this.mainElement = null;
                        var item = _this.getPanelBase(args);
                        if (_this.shadowEle) {
                            detach(_this.shadowEle);
                        }
                        removeClass([_this.element], [preventSelect]);
                        removeClass([args.element], [dragging]);
                        _this.shadowEle = null;
                        args.element.classList.remove('e-dragging');
                        var row = _this.getRowColumnDragValues(args)[0];
                        var col = _this.getRowColumnDragValues(args)[1];
                        var panelModel = _this.getCellInstance(args.element.id);
                        if (_this.allowPushing &&
                            _this.collisions(row, col, panelModel.sizeX, panelModel.sizeY, document.getElementById(item.id)).length === 0) {
                            _this.panelPropertyChange(_this.getCellInstance(args.element.id), { row: row, col: col });
                            _this.oldRowCol[args.element.id].row = row;
                            _this.oldRowCol[args.element.id].col = col;
                            _this.setAttributes({ value: { col: col.toString(), row: row.toString() } }, args.element);
                            _this.sortedPanel();
                        }
                        else {
                            _this.panelPropertyChange(_this.getCellInstance(args.element.id), {
                                row: _this.oldRowCol[args.element.id].row,
                                col: _this.oldRowCol[args.element.id].col
                            });
                            args.element.setAttribute('data-col', _this.getCellInstance(args.element.id).col.toString());
                            args.element.setAttribute('data-row', _this.getCellInstance(args.element.id).row.toString());
                            _this.sortedPanel();
                        }
                        var panelInstance = _this.getCellInstance(args.element.id);
                        _this.setPanelPosition(args.element, panelInstance.row, panelInstance.col);
                        _this.updatePanels();
                        _this.updateCloneArrayObject();
                        for (var i_3 = 0; i_3 < _this.panels.length; i_3++) {
                            if (_this.panels[i_3].row !== _this.panelsInitialModel[i_3].row ||
                                _this.panels[i_3].col !== _this.panelsInitialModel[i_3].col) {
                                changedPanels.push(_this.panels[i_3]);
                            }
                        }
                        if (changedPanels.length > 0) {
                            var changedArgs = { changedPanels: changedPanels };
                            _this.trigger('change', changedArgs);
                        }
                        _this.dragStopEventArgs = { event: args.event, element: args.element };
                        _this.trigger('dragStop', args);
                        _this.resizeEvents();
                        _this.rows = _this.maxRow(true);
                        _this.setHeightWidth();
                        _this.updateDragArea();
                    },
                    drag: function (args) {
                        _this.draggedEventArgs = {
                            event: args.event,
                            element: args.element,
                            target: closest((args.target), '.e-panel')
                        };
                        _this.trigger('drag', _this.draggedEventArgs);
                        _this.onDragStart(args);
                    }
                });
                if (this.dragCollection.indexOf(this.dragobj) === -1) {
                    this.dragCollection.push(this.dragobj);
                }
            }
        }
    };
    
    DashboardLayout.prototype.updatePanels = function () {
        this.moveItemsUpwards();
        this.updateOldRowColumn();
        this.sortedPanel();
    };
    DashboardLayout.prototype.updateDragArea = function () {
        this.dragCollection.forEach(function (dragobj) {
            // tslint:disable-next-line
            dragobj.setDragArea();
        });
    };
    DashboardLayout.prototype.updateRowsHeight = function (row, sizeY, addRows) {
        if (row + sizeY >= this.rows) {
            this.rows = this.rows + addRows;
            this.setHeightWidth();
        }
    };
    DashboardLayout.prototype.onDraggingStart = function (args) {
        this.dragStartArgs = { event: args.event, element: args.element, cancel: false };
        this.trigger('dragStart', this.dragStartArgs);
        this.panelsInitialModel = this.cloneModels(this.panels);
        this.mainElement = args.element;
        this.cloneObject = JSON.parse(JSON.stringify(this.cloneObject));
        var eleRowValue = this.startRow = parseInt(args.element.getAttribute('data-row'), 10);
        this.startCol = parseInt(args.element.getAttribute('data-col'), 10);
        var eleSizeY = parseInt(args.element.getAttribute('data-sizeY'), 10);
        this.updateRowsHeight(eleRowValue, eleSizeY, eleSizeY);
        this.updateDragArea();
        this.shadowEle = document.createElement('div');
        this.shadowEle.classList.add('e-holder');
        this.shadowEle.classList.add('e-holder-transition');
        setStyleAttribute(this.shadowEle, { 'position': 'absolute' });
        addClass([this.element], [preventSelect]);
        addClass([args.element], [dragging]);
        this.element.appendChild(this.shadowEle);
        this.shadowEle = document.querySelector('.e-holder');
        this.shadowEle.style.height = (this.getCellInstance(args.element.id).sizeY * this.cellSize[1]) + 'px';
        this.shadowEle.style.width = (this.getCellInstance(args.element.id).sizeX * this.cellSize[0]) + 'px';
        var panelInstance = this.getCellInstance(args.element.id);
        this.setPanelPosition(this.shadowEle, panelInstance.row, panelInstance.col);
    };
    
    // tslint:disable-next-line
    DashboardLayout.prototype.cloneModels = function (source, target) {
        if (target === undefined) {
            target = [];
        }
        for (var i = 0; i < source.length; i++) {
            // tslint:disable-next-line
            if (!target[i]) {
                target[i] = {};
            }
            // tslint:disable-next-line
            for (var k in source[i]) {
                target[i][k] = source[i][k];
            }
        }
        return target;
    };
    
    DashboardLayout.prototype.onDragStart = function (args) {
        var endCol;
        var endRow;
        var dragCol;
        var col = dragCol = this.getRowColumnDragValues(args)[1];
        var row = this.getRowColumnDragValues(args)[0];
        if (col < 0 || row < 0) {
            return;
        }
        this.panelPropertyChange(this.getCellInstance(args.element.id), { row: row, col: col });
        var panelModel = this.getCellInstance(args.element.id);
        this.updateRowsHeight(panelModel.row, panelModel.sizeY, 1);
        this.updateDragArea();
        if (this.allowPushing) {
            this.setAttributes({ value: { col: col.toString(), row: row.toString() } }, args.element);
            this.panelPropertyChange(this.getCellInstance(args.element.id), { row: row, col: col });
            endCol = this.oldRowCol[(args.element.id)].col;
            endRow = this.oldRowCol[(args.element.id)].row;
            this.oldRowCol[(args.element.id)] = { row: row, col: col };
            this.updateOldRowColumn();
            if (this.startCol !== endCol || this.startRow !== endRow) {
                this.setHolderPosition(args);
                if (this.startCol !== endCol) {
                    this.startRow = endRow;
                }
                if (this.startRow !== endRow) {
                    this.startCol = endCol;
                }
                if (this.allowPushing) {
                    this.mainElement = args.element;
                    var model = panelModel;
                    this.checkCollision = this.collisions(model.row, model.col, model.sizeX, model.sizeY, args.element);
                    if (panelModel.col >= this.checkColumnValue) {
                        this.checkCollision = [];
                    }
                    this.updatePanelLayout(args.element, panelModel);
                    this.moveItemsUpwards();
                }
            }
        }
        if (this.allowPushing !== false) {
            this.panelPropertyChange(this.getCellInstance(args.element.id), { row: row, col: col });
        }
        if (this.oldRowCol[args.element.id].row !== row || this.oldRowCol[args.element.id].col !== col) {
            this.panelPropertyChange(this.getCellInstance(args.element.id), { row: row, col: col });
            this.setAttributes({ value: { col: col.toString(), row: row.toString() } }, args.element);
        }
        if (this.startCol !== dragCol) {
            this.startCol = endCol;
            this.moveItemsUpwards();
        }
        if (!this.allowPushing) {
            this.setHolderPosition(args);
        }
        this.removeResizeClasses(this.panelCollection);
        this.setClasses(this.panelCollection);
        if (this.allowPushing === false) {
            return;
        }
    };
    DashboardLayout.prototype.getPanelBase = function (args) {
        var item;
        for (var i = 0; i < this.panelCollection.length; i++) {
            if (this.panelCollection[i].id === ((args.element
                && args.element.id) || args)) {
                item = this.panelCollection[i];
            }
        }
        return item;
    };
    DashboardLayout.prototype.getPanel = function (row, column, excludeItems) {
        if (excludeItems && !(excludeItems instanceof Array)) {
            excludeItems = [excludeItems];
        }
        var sizeY = 1;
        while (row > -1) {
            var sizeX = 1;
            var col = column;
            while (col > -1) {
                var items = this.sortedArray[row];
                if (items) {
                    var item = items[col];
                    if (item && (!excludeItems ||
                        excludeItems.indexOf(item) === -1) && parseInt(item.getAttribute('data-sizeX'), 10) >= sizeX
                        && parseInt(item.getAttribute('data-sizeY'), 10) >= sizeY) {
                        return item;
                    }
                }
                ++sizeX;
                --col;
            }
            --row;
            ++sizeY;
        }
        return null;
    };
    
    DashboardLayout.prototype.setHolderPosition = function (args) {
        var cellSizeOne;
        var cellSizeZero;
        var sizeY = parseInt(args.element.getAttribute('data-sizeY'), 10);
        var col = parseInt(args.element.getAttribute('data-col'), 10);
        var row = parseInt(args.element.getAttribute('data-row'), 10);
        var sizeX = parseInt(args.element.getAttribute('data-sizeX'), 10);
        var widthValue = this.getCellSize()[0];
        var heightValue = this.getCellSize()[1];
        var top = row === 0 ? 0 : (((row) * (parseInt(heightValue.toString(), 10) + this.cellSpacing[1])));
        var left = col === 0 ? 0 : (((col) * (parseInt(widthValue.toString(), 10) + this.cellSpacing[0])));
        cellSizeOne = this.getCellSize()[1];
        cellSizeZero = this.getCellSize()[0];
        this.elementRef.top = this.shadowEle.style.top = top + 'px';
        this.elementRef.left = this.shadowEle.style.left = left + 'px';
        this.elementRef.height = this.shadowEle.style.height = ((sizeY * cellSizeOne) + ((sizeY - 1) * this.cellSpacing[1])) + 'px';
        this.elementRef.width = this.shadowEle.style.width = ((sizeX * cellSizeZero) + ((sizeX - 1) * this.cellSpacing[0])) + 'px';
    };
    
    DashboardLayout.prototype.getCellInstance = function (idValue) {
        var currentCellInstance;
        for (var i = 0; i < this.panels.length; i++) {
            if (this.panels[i].id === idValue) {
                currentCellInstance = this.panels[i];
            }
        }
        return currentCellInstance;
    };
    /**
     * Allows to add a panel to the Dashboardlayout.
     * @param {panel: [`PanelModel`](./panelModel)} panel -  Defines the panel element.
     * @returns void
     */
    DashboardLayout.prototype.addPanel = function (panel) {
        this.maxCol();
        if (!panel.minSizeX) {
            panel.minSizeX = 1;
        }
        if (!panel.minSizeY) {
            panel.minSizeY = 1;
        }
        if (!panel.id) {
            panel.id = 'layout_' + this.panelID.toString();
            this.panelID = this.panelID + 1;
        }
        // tslint:disable-next-line
        var panelProp = new Panel(this, 'panels', panel);
        this.panels.push(panelProp);
        this.setMinMaxValues(panelProp);
        if (this.maxColumnValue < panelProp.col || this.maxColumnValue < (panelProp.col + panelProp.sizeX)) {
            this.panelPropertyChange(panelProp, { col: this.maxColumnValue - panelProp.sizeX });
        }
        var cell = this.renderCell(panelProp, true);
        this.oldRowCol[panelProp.id] = { row: panelProp.row, col: panelProp.col };
        this.cloneObject[panelProp.id] = { row: panelProp.row, col: panelProp.col };
        this.updateOldRowColumn();
        this.element.insertAdjacentElement('afterbegin', cell);
        var container = cell.querySelector('.e-panel-container');
        if (this.checkMediaQuery()) {
            this.checkMediaQuerySizing();
            this.removeResizeClasses(this.panelCollection);
        }
        else {
            this.addPanelCalled = true;
            this.mainElement = cell;
            if (!this.checkCollision) {
                this.checkCollision = [];
            }
            this.setPanelPosition(cell, panelProp.row, panelProp.col);
            this.updatePanelLayout(cell, panelProp);
            this.addPanelCalled = false;
        }
        if (this.allowResizing &&
            this.mediaQuery ? !(this.checkMediaQuery()) : false) {
            this.setResizingClass(cell, container);
        }
        if (this.allowDragging &&
            this.mediaQuery ? !(this.checkMediaQuery()) : false) {
            this.enableDraggingContent([document.getElementById(panelProp.id)]);
        }
        if (this.allowFloating) {
            this.moveItemsUpwards();
        }
        this.updateOldRowColumn();
        this.sortedPanel();
        this.updateCloneArrayObject();
        if (this.allowResizing) {
            for (var i = 0; i < cell.querySelectorAll('.e-resize').length; i++) {
                var eventName = (Browser.info.name === 'msie') ? 'mousedown pointerdown' : 'mousedown';
                EventHandler.add(cell.querySelectorAll('.e-resize')[i], eventName, this.downResizeHandler, this);
                if (Browser.info.name !== 'mise') {
                    EventHandler.add(cell.querySelectorAll('.e-resize')[i], 'touchstart', this.touchDownResizeHandler, this);
                }
            }
        }
    };
    /**
     * Allows to update a panel in the DashboardLayout.
     * @param {panel: [`panelModel`](./panelModel)} panel - Defines the panel element.
     * @returns void
     */
    DashboardLayout.prototype.updatePanel = function (panel) {
        if (!panel.id) {
            return;
        }
        var panelInstance = this.getCellInstance(panel.id);
        if (!panelInstance) {
            return;
        }
        this.maxCol();
        panel.col = (panel.col < 1) ? 0 : ((panel.col > this.columns)) ? this.columns - 1 : panel.col;
        if (isNullOrUndefined(panel.col)) {
            panel.col = panelInstance.col;
        }
        this.panelPropertyChange(panelInstance, panel);
        this.setMinMaxValues(panelInstance);
        var cell = document.getElementById(panel.id);
        this.mainElement = cell;
        this.panelContent = cell.querySelector('.e-panel-container') ?
            cell.querySelector('.e-panel-container') :
            this.createSubElement(panelInstance.cssClass, cell.id + '_content', panelContainer);
        cell.appendChild(this.panelContent);
        if (panelInstance.header) {
            var headerTemplateElement = cell.querySelector('.e-panel-header') ?
                cell.querySelector('.e-panel-header') : this.createSubElement('', cell.id + 'template', '');
            addClass([headerTemplateElement], [header]);
            headerTemplateElement.innerHTML = '';
            var id = this.element.id + 'HeaderTemplate' + panelInstance.id;
            this.renderTemplate(panelInstance.header, headerTemplateElement, id, true);
            this.panelContent.appendChild(headerTemplateElement);
        }
        else {
            if (cell.querySelector('.e-panel-header')) {
                detach(cell.querySelector('.e-panel-header'));
            }
        }
        if (panelInstance.content) {
            this.panelBody = cell.querySelector('.e-panel-content') ? cell.querySelector('.e-panel-content') :
                this.createSubElement(panelInstance.cssClass, cell.id + '_body', panelContent);
            this.panelBody.innerHTML = '';
            var headerHeight = this.panelContent.querySelector('.e-panel-header') ?
                window.getComputedStyle(this.panelContent.querySelector('.e-panel-header')).height : '0px';
            var contentHeightValue = 'calc( 100% - ' + headerHeight + ')';
            setStyleAttribute(this.panelBody, { height: contentHeightValue });
            var id = this.element.id + 'ContentTemplate' + panelInstance.id;
            this.renderTemplate(panelInstance.content, this.panelBody, id, true);
            this.panelContent.appendChild(this.panelBody);
        }
        else {
            if (cell.querySelector('.e-panel-content')) {
                detach(cell.querySelector('.e-panel-content'));
            }
        }
        this.setXYAttributes(cell, panelInstance);
        this.setHeightAndWidth(cell, panelInstance);
        this.setPanelPosition(cell, panelInstance.row, panelInstance.col);
        this.updatePanelLayout(cell, panelInstance);
        this.mainElement = null;
        this.updatePanels();
        this.updateCloneArrayObject();
    };
    DashboardLayout.prototype.updateCloneArrayObject = function () {
        this.cloneArray = this.sortedArray;
        this.cloneObject = JSON.parse(JSON.stringify(this.oldRowCol));
    };
    /**
     * Returns the panels object of the DashboardLayout.
     * @returns [`PanelModel[]`](./panelModel)
     */
    DashboardLayout.prototype.serialize = function () {
        var cloneModel = this.cloneModels(this.panels);
        var customObject = [];
        for (var i = 0; i < cloneModel.length; i++) {
            customObject.push({
                id: cloneModel[i].id, row: cloneModel[i].row, col: cloneModel[i].col, sizeX: cloneModel[i].sizeX,
                sizeY: cloneModel[i].sizeY, minSizeX: cloneModel[i].minSizeX, minSizeY: cloneModel[i].minSizeY,
                maxSizeX: cloneModel[i].maxSizeX, maxSizeY: cloneModel[i].maxSizeY
            });
        }
        return (customObject);
    };
    /**
     * Removes all the panels from the DashboardLayout.
     */
    DashboardLayout.prototype.removeAll = function () {
        for (var i = 0; i < this.panelCollection.length; i++) {
            detach(this.panelCollection[i]);
        }
        this.element.innerHTML = '';
        this.rows = 0;
        this.gridPanelCollection = [];
        this.setHeightWidth();
        this.sortedPanel();
        this.sortedArray = [];
        this.overlapElementClone = [];
        this.overlapElement = [];
        this.overlapSubElementClone = [];
        this.panelCollection = [];
        this.oldRowCol = {};
        this.cloneObject = {};
        this.panels = [];
        this.updatePanels();
        this.updateCloneArrayObject();
    };
    /**
     * Removes the panel from the DashboardLayout.
     * @param {id: string} id -  Defines the panel ID.
     * @returns void
     */
    DashboardLayout.prototype.removePanel = function (id) {
        var _this = this;
        for (var i = 0; i < this.panelCollection.length; i++) {
            if (this.panelCollection[i].id === id) {
                detach(this.panelCollection[i]);
                this.panelCollection.splice(i, 1);
            }
            if (this.panels[i].id === id) {
                this.panels.splice(i, 1);
                this.updateOldRowColumn();
                this.sortedPanel();
            }
        }
        this.updatePanels();
        this.gridPanelCollection.forEach(function (item) {
            if (item.id === id) {
                _this.gridPanelCollection.splice(_this.gridPanelCollection.indexOf(item), 1);
            }
        });
        this.updateCloneArrayObject();
    };
    /**
     * Moves the panel in the DashboardLayout.
     * @param {id: string} id - Defines the panel ID.
     * @param {row: number} row - Defines the row of dashboard layout.
     * @param {col: number} col - Defines the column of dashboard layout.
     * @returns void
     */
    DashboardLayout.prototype.movePanel = function (id, row, col) {
        this.movePanelCalled = true;
        var panelInstance = this.getCellInstance(id);
        if (col < 1) {
            col = 0;
        }
        else if (col > this.columns) {
            col = this.columns - 1;
        }
        this.panelPropertyChange(panelInstance, { row: row, col: col });
        var ele = document.getElementById(id);
        this.mainElement = ele;
        this.setAttributes({ value: { col: col.toString(), row: row.toString() } }, ele);
        this.setPanelPosition(ele, row, col);
        this.updatePanelLayout(ele, panelInstance);
        this.updateRowHeight();
        this.updatePanels();
        this.updateCloneArrayObject();
        this.movePanelCalled = false;
    };
    DashboardLayout.prototype.setAttributes = function (value, ele) {
        for (var i = 0; i < Object.keys(value).length; i++) {
            if (Object.keys(value)) {
                if (value[Object.keys(value)[i]].col) {
                    ele.setAttribute('data-col', value[Object.keys(value)[i]].col.toString());
                }
                if (value[Object.keys(value)[i]].row) {
                    ele.setAttribute('data-row', value[Object.keys(value)[i]].row.toString());
                }
                if (value[Object.keys(value)[i]].sizeX) {
                    ele.setAttribute('data-sizeX', value[Object.keys(value)[i]].sizeX.toString());
                }
                if (value[Object.keys(value)[i]].sizeY) {
                    ele.setAttribute('data-sizeY', value[Object.keys(value)[i]].sizeY.toString());
                }
                if (value[Object.keys(value)[i]].minSizeX) {
                    ele.setAttribute('data-minSizeX', value[Object.keys(value)[i]].minSizeX.toString());
                }
                if (value[Object.keys(value)[i]].minSizeY) {
                    ele.setAttribute('data-minSizeY', value[Object.keys(value)[i]].minSizeY.toString());
                }
                if (value[Object.keys(value)[i]].maxSizeX) {
                    ele.setAttribute('data-maxSizeY', value[Object.keys(value)[i]].maxSizeX.toString());
                }
                if (value[Object.keys(value)[i]].maxSizeY) {
                    ele.setAttribute('data-maxSizeY', value[Object.keys(value)[i]].maxSizeY.toString());
                }
            }
        }
    };
    /**
     * Resize the panel in the DashboardLayout.
     * @param {id: string} id - Defines the panel ID.
     * @param {sizeX: number} sizeX - Defines the sizeX of dashboard layout.
     * @param {sizeY: number} sizeY - Defines the sizeY of dashboard layout.
     */
    DashboardLayout.prototype.resizePanel = function (id, sizeX, sizeY) {
        var panelInstance = this.getCellInstance(id);
        this.resizeCalled = true;
        this.panelPropertyChange(panelInstance, { sizeX: sizeX, sizeY: sizeY });
        this.setMinMaxValues(panelInstance);
        this.checkMinMaxValues(panelInstance);
        var ele = document.getElementById(id);
        this.mainElement = ele;
        this.setAttributes({ value: { sizeX: panelInstance.sizeX.toString(), sizeY: panelInstance.sizeY.toString() } }, ele);
        this.setHeightAndWidth(ele, panelInstance);
        this.updatePanelLayout(ele, panelInstance);
        this.updatePanels();
        this.updateRowHeight();
        this.resizeCalled = false;
    };
    /**
     * Destroys the DashboardLayout component
     * @returns void
     */
    DashboardLayout.prototype.destroy = function () {
        removeClass([this.element], ['e-dashboardlayout', 'e-lib', 'e-responsive', 'e-control']);
        this.element.removeAttribute('style');
        for (var i = 0; i < this.dragCollection.length; i++) {
            this.dragCollection[i].destroy();
        }
        this.element.innerHTML = '';
        _super.prototype.destroy.call(this);
    };
    DashboardLayout.prototype.setEnableRtl = function () {
        this.enableRtl ? addClass([this.element], 'e-rtl') : removeClass([this.element], 'e-rtl');
    };
    DashboardLayout.prototype.getDragInstance = function (id) {
        var draggableInstance;
        var ele = document.getElementById(id);
        for (var i = 0; i < this.dragCollection.length; i++) {
            draggableInstance = this.dragCollection[i].element === ele ? this.dragCollection[i] : null;
            if (draggableInstance) {
                return draggableInstance;
            }
        }
        return draggableInstance;
    };
    /**
     * Called internally if any of the property value changed.
     * returns void
     * @private
     */
    DashboardLayout.prototype.updateCellSizeAndSpacing = function () {
        this.panelResponsiveUpdate();
        this.setHeightWidth();
        this.getRowColumn();
        for (var i = 0; i < this.element.querySelectorAll('.e-panel').length; i++) {
            var ele = this.element.querySelectorAll('.e-panel')[i];
            var panelModel = this.getCellInstance(ele.id);
            this.setHeightAndWidth(ele, panelModel);
            this.setPanelPosition(ele, panelModel.row, panelModel.col);
        }
    };
    DashboardLayout.prototype.updatePanelsDynamically = function (panels) {
        this.removeAll();
        this.setProperties({ panels: panels }, true);
        this.setOldRowCol();
        this.initialize();
        if (this.showGridLines) {
            this.initGridLines();
        }
    };
    DashboardLayout.prototype.checkForIDValues = function (panels) {
        var _this = this;
        if (!isNullOrUndefined(panels)) {
            this.panelID = 0;
            panels.forEach(function (panel) {
                if (!panel.id) {
                    _this.panelPropertyChange(panel, { id: 'layout_' + _this.panelID.toString() });
                    _this.panelID = _this.panelID + 1;
                }
            });
        }
    };
    /**
     * Called internally if any of the property value changed.
     * returns void
     * @private
     */
    DashboardLayout.prototype.onPropertyChanged = function (newProp, oldProp) {
        var _this = this;
        if (newProp.panels) {
            this.checkForIDValues(newProp.panels);
        }
        for (var _i = 0, _a = Object.keys(newProp); _i < _a.length; _i++) {
            var prop = _a[_i];
            switch (prop) {
                case 'enableRtl':
                    this.setProperties({ enableRtl: newProp.enableRtl }, true);
                    this.setEnableRtl();
                    break;
                case 'mediaQuery':
                    this.setProperties({ mediaQuery: newProp.mediaQuery }, true);
                    if (this.checkMediaQuery()) {
                        this.checkMediaQuerySizing();
                    }
                    break;
                case 'allowDragging':
                    this.setProperties({ allowDragging: newProp.allowDragging }, true);
                    this.checkDragging(this.dragCollection);
                    break;
                case 'allowResizing':
                    this.setProperties({ allowResizing: newProp.allowResizing }, true);
                    if (this.allowResizing) {
                        this.setClasses(this.panelCollection);
                        this.resizeEvents();
                    }
                    else {
                        for (var i = 0; i < document.querySelectorAll('.e-resize').length; i++) {
                            var eventName = (Browser.info.name === 'msie') ? 'mousedown pointerdown' : 'mousedown';
                            var element = document.querySelectorAll('.e-resize')[i];
                            EventHandler.remove(element, eventName, this.downResizeHandler);
                            if (Browser.info.name !== 'mise') {
                                EventHandler.remove(element, 'touchstart', this.touchDownResizeHandler);
                            }
                        }
                        this.removeResizeClasses(this.panelCollection);
                    }
                    break;
                case 'cellSpacing':
                    this.setProperties({ cellSpacing: newProp.cellSpacing }, true);
                    this.updateCellSizeAndSpacing();
                    this.updateGridLines();
                    break;
                case 'draggableHandle':
                    this.setProperties({ draggableHandle: newProp.draggableHandle }, true);
                    for (var i = 0; i < this.element.querySelectorAll('.e-panel').length; i++) {
                        var ele = this.element.querySelectorAll('.e-panel')[i];
                        var draggableInstance = this.getDragInstance(ele.id);
                        draggableInstance.handle = this.draggableHandle;
                    }
                    break;
                case 'allowFloating':
                    this.setProperties({ allowFloating: newProp.allowFloating }, true);
                    this.moveItemsUpwards();
                    break;
                case 'showGridLines':
                    if (this.showGridLines) {
                        this.setProperties({ showGridLines: newProp.showGridLines }, true);
                        this.initGridLines();
                    }
                    else {
                        if (this.table) {
                            detach(this.table);
                        }
                    }
                    break;
                case 'allowPushing':
                    this.setProperties({ allowPushing: newProp.allowPushing }, true);
                    break;
                case 'panels':
                    if (!this.isDynamicallyUpdated) {
                        this.isRenderComplete = false;
                        this.updatePanelsDynamically(newProp.panels);
                        this.isRenderComplete = true;
                        this.isDynamicallyUpdated = true;
                    }
                    else {
                        this.isDynamicallyUpdated = false;
                    }
                    break;
                case 'columns':
                    this.isRenderComplete = false;
                    if (newProp.panels && !this.isDynamicallyUpdated) {
                        this.updatePanelsDynamically(newProp.panels);
                        this.isDynamicallyUpdated = true;
                    }
                    else {
                        this.isDynamicallyUpdated = false;
                    }
                    this.setProperties({ columns: newProp.columns }, true);
                    this.panelCollection = [];
                    this.maxColumnValue = this.columns;
                    this.calculateCellSize();
                    this.panels.forEach(function (panel) {
                        _this.setMinMaxValues(panel);
                        if (_this.maxColumnValue < panel.col || _this.maxColumnValue < (panel.col + panel.sizeX)) {
                            var colValue = _this.maxColumnValue - panel.sizeX;
                            _this.panelPropertyChange(panel, { col: colValue < 0 ? 0 : colValue });
                            _this.setXYAttributes(document.getElementById(panel.id), panel);
                        }
                        _this.setHeightAndWidth(document.getElementById(panel.id), panel);
                        _this.panelCollection.push(document.getElementById(panel.id));
                        _this.setPanelPosition(document.getElementById(panel.id), panel.row, panel.col);
                        _this.mainElement = document.getElementById(panel.id);
                        _this.updatePanelLayout(document.getElementById(panel.id), panel);
                        _this.mainElement = null;
                    });
                    this.updatePanels();
                    this.updateCloneArrayObject();
                    this.isRenderComplete = true;
                    this.updateGridLines();
                    break;
            }
        }
    };
    /**
     * Gets the properties to be maintained upon browser refresh.
     * @returns string
     */
    DashboardLayout.prototype.getPersistData = function () {
        var keyEntity = ['panels'];
        return this.addOnPersist(keyEntity);
    };
    /**
     * Returns the current module name.
     * @returns string
     * @private
     */
    DashboardLayout.prototype.getModuleName = function () {
        return 'DashboardLayout';
    };
    __decorate$1([
        Property(true)
    ], DashboardLayout.prototype, "allowDragging", void 0);
    __decorate$1([
        Property(false)
    ], DashboardLayout.prototype, "allowResizing", void 0);
    __decorate$1([
        Property(true)
    ], DashboardLayout.prototype, "allowPushing", void 0);
    __decorate$1([
        Property(true)
    ], DashboardLayout.prototype, "allowFloating", void 0);
    __decorate$1([
        Property(1)
    ], DashboardLayout.prototype, "cellAspectRatio", void 0);
    __decorate$1([
        Property([5, 5])
    ], DashboardLayout.prototype, "cellSpacing", void 0);
    __decorate$1([
        Property(1)
    ], DashboardLayout.prototype, "columns", void 0);
    __decorate$1([
        Property(false)
    ], DashboardLayout.prototype, "showGridLines", void 0);
    __decorate$1([
        Property(null)
    ], DashboardLayout.prototype, "draggableHandle", void 0);
    __decorate$1([
        Property('en-US')
    ], DashboardLayout.prototype, "locale", void 0);
    __decorate$1([
        Property('max-width: 600px')
    ], DashboardLayout.prototype, "mediaQuery", void 0);
    __decorate$1([
        Collection([], Panel)
    ], DashboardLayout.prototype, "panels", void 0);
    __decorate$1([
        Property(['e-south-east'])
    ], DashboardLayout.prototype, "resizableHandles", void 0);
    __decorate$1([
        Event()
    ], DashboardLayout.prototype, "change", void 0);
    __decorate$1([
        Event()
    ], DashboardLayout.prototype, "dragStart", void 0);
    __decorate$1([
        Event()
    ], DashboardLayout.prototype, "drag", void 0);
    __decorate$1([
        Event()
    ], DashboardLayout.prototype, "dragStop", void 0);
    __decorate$1([
        Event()
    ], DashboardLayout.prototype, "resizeStart", void 0);
    __decorate$1([
        Event()
    ], DashboardLayout.prototype, "resize", void 0);
    __decorate$1([
        Event()
    ], DashboardLayout.prototype, "resizeStop", void 0);
    __decorate$1([
        Event()
    ], DashboardLayout.prototype, "created", void 0);
    __decorate$1([
        Event()
    ], DashboardLayout.prototype, "destroyed", void 0);
    DashboardLayout = __decorate$1([
        NotifyPropertyChanges
    ], DashboardLayout);
    return DashboardLayout;
}(Component));

/**
 * dashboardlayout modules
 */

/**
 *     Layout all modules
 */

export { PaneProperties, Splitter, Panel, DashboardLayout };
//# sourceMappingURL=ej2-layouts.es5.js.map
