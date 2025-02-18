/// <reference path='../drop-down-base/drop-down-base-model.d.ts'/>
import { EventHandler, Property, Event, compile, EmitType, KeyboardEvents, append } from '@syncfusion/ej2-base';
import { attributes, isNullOrUndefined, getUniqueID, formatUnit, isUndefined, getValue } from '@syncfusion/ej2-base';
import { Animation, AnimationModel, Browser, KeyboardEventArgs, NotifyPropertyChanges } from '@syncfusion/ej2-base';
import { addClass, removeClass, setStyleAttribute, closest, prepend, detach, classList, isBlazor } from '@syncfusion/ej2-base';
import { Popup, isCollide, createSpinner, showSpinner, hideSpinner } from '@syncfusion/ej2-popups';
import { IInput, Input, InputObject, FloatLabelType } from '@syncfusion/ej2-inputs';
import { incrementalSearch } from '../common/incremental-search';
import { DropDownBase, dropDownBaseClasses, SelectEventArgs, FilteringEventArgs, PopupEventArgs } from '../drop-down-base/drop-down-base';
import { FocusEventArgs, ResultData, BeforeOpenEventArgs } from '../drop-down-base/drop-down-base';
import { FieldSettingsModel } from '../drop-down-base/drop-down-base-model';
import { DropDownListModel } from '../drop-down-list';
/* tslint:disable */
import { DataManager, Query, Predicate } from '@syncfusion/ej2-data';
import { SortOrder } from '@syncfusion/ej2-lists';
/* tslint:enable */
export interface ChangeEventArgs extends SelectEventArgs {
    /**
     * Returns the selected value
     * @isGenericType true
     */
    value: number | string | boolean;
    /**
     * Returns the previous selected list item
     */
    previousItem: HTMLLIElement;
    /**
     * Returns the previous selected item as JSON Object from the data source.
     * @blazorType object
     */
    previousItemData: FieldSettingsModel;
    /**
     * Returns the root element of the component.
     */
    element: HTMLElement;
}
// don't use space in classnames 
export const dropDownListClasses: DropDownListClassList = {
    root: 'e-dropdownlist',
    hover: dropDownBaseClasses.hover,
    selected: dropDownBaseClasses.selected,
    rtl: dropDownBaseClasses.rtl,
    li: dropDownBaseClasses.li,
    disable: dropDownBaseClasses.disabled,
    base: dropDownBaseClasses.root,
    focus: dropDownBaseClasses.focus,
    input: 'e-input-group',
    inputFocus: 'e-input-focus',
    icon: 'e-input-group-icon e-ddl-icon',
    iconAnimation: 'e-icon-anim',
    value: 'e-input-value',
    device: 'e-ddl-device',
    backIcon: 'e-input-group-icon e-back-icon e-icons',
    filterBarClearIcon: 'e-input-group-icon e-clear-icon e-icons',
    filterInput: 'e-input-filter',
    filterParent: 'e-filter-parent',
    mobileFilter: 'e-ddl-device-filter',
    footer: 'e-ddl-footer',
    header: 'e-ddl-header',
    clearIcon: 'e-clear-icon',
    clearIconHide: 'e-clear-icon-hide',
    popupFullScreen: 'e-popup-full-page',
    disableIcon: 'e-ddl-disable-icon',
    hiddenElement: 'e-ddl-hidden'
};


let inputObject: InputObject = {
    container: null,
    buttons: []
};

/**
 * The DropDownList component contains a list of predefined values from which you can
 * choose a single value.
 * ```html
 * <input type="text" tabindex="1" id="list"> </input>
 * ```
 * ```typescript
 *   let dropDownListObj:DropDownList = new DropDownList();
 *   dropDownListObj.appendTo("#list");
 * ```
 */

@NotifyPropertyChanges
export class DropDownList extends DropDownBase implements IInput {
    protected inputWrapper: InputObject;
    protected inputElement: HTMLInputElement;
    private valueTempElement: HTMLSpanElement;
    private listObject: HTMLElement;
    private header: HTMLElement;
    private footer: HTMLElement;
    protected selectedLI: HTMLElement;
    protected previousSelectedLI: HTMLElement;
    protected previousItemData: { [key: string]: Object } | string | number | boolean;
    private listHeight: string;
    protected hiddenElement: HTMLSelectElement;
    protected isPopupOpen: boolean;
    private isDocumentClick: boolean;
    protected isInteracted: boolean;
    private isFilterFocus: boolean;
    protected beforePopupOpen: boolean;
    protected initial: boolean;
    private initRemoteRender: boolean;
    private searchBoxHeight: number;
    private popupObj: Popup;
    private backIconElement: Element;
    private clearIconElement: Element;
    private containerStyle: ClientRect;
    protected previousValue: string | number | boolean = null;
    protected activeIndex: number;
    protected filterInput: HTMLInputElement;
    private searchKeyModule: KeyboardEvents;
    private tabIndex: string;
    private isNotSearchList: boolean;
    protected isTyped: boolean;
    protected isSelected: boolean;
    protected preventFocus: boolean;
    protected preventAutoFill: boolean;
    protected queryString: string;
    protected isValidKey: boolean;
    protected typedString: string;
    protected isEscapeKey: boolean;
    private isPreventBlur: boolean;
    protected isTabKey: boolean;
    private actionCompleteData: ActionCompleteData;
    protected prevSelectPoints: { [key: string]: number };
    protected isSelectCustom: boolean;
    protected isDropDownClick: boolean;
    protected preventAltUp: boolean;
    private searchKeyEvent: KeyboardEventArgs;
    private filterInputObj: InputObject;
    protected spinnerElement: HTMLElement;
    protected keyConfigure: { [key: string]: string };
    protected isCustomFilter: boolean;
    private isSecondClick: boolean;

    /**
     * Sets CSS classes to the root element of the component that allows customization of appearance.
     * @default null
     */
    @Property(null)
    public cssClass: string;
    /**
     * Specifies the width of the component. By default, the component width sets based on the width of 
     * its parent container. You can also set the width in pixel values.
     * @default '100%'
     * @aspType string
     * @blazorType string
     */
    @Property('100%')
    public width: string | number;
    /**
     * Specifies the height of the popup list.  
     * > For more details about the popup configuration refer to 
     * [`Popup Configuration`](../../drop-down-list/getting-started#configure-the-popup-list) documentation.
     * @default '300px'
     * @aspType string
     * @blazorType string
     */
    @Property('300px')
    public popupHeight: string | number;
    /**
     * Specifies the width of the popup list. By default, the popup width sets based on the width of 
     * the component.
     * > For more details about the popup configuration refer to 
     * [`Popup Configuration`](../../drop-down-list/getting-started#configure-the-popup-list) documentation.
     * @default '100%'
     * @aspType string
     * @blazorType string
     */
    @Property('100%')
    public popupWidth: string | number;
    /**
     * Specifies a short hint that describes the expected value of the DropDownList component.
     * @default null
     */
    @Property(null)
    public placeholder: string;
    /**
     * Accepts the value to be displayed as a watermark text on the filter bar. 
     * @default null
     */
    @Property(null)
    public filterBarPlaceholder: string;
    /**
     * Allows additional HTML attributes such as title, name, etc., and
     * accepts n number of attributes in a key-value pair format.
     * 
     * {% codeBlock src="dropdownlist/html-attributes-api/index.ts" %}{% endcodeBlock %}
     * 
     * {% codeBlock src="dropdownlist/html-attributes-api/index.html" %}{% endcodeBlock %}
     *
     * @default {}
     */
    @Property({})
    public htmlAttributes: { [key: string]: string; };
    /**
     * Accepts the external `Query`
     * that execute along with data processing.
     * 
     * {% codeBlock src="dropdownlist/query-api/index.ts" %}{% endcodeBlock %}
     * 
     * {% codeBlock src="dropdownlist/query-api/index.html" %}{% endcodeBlock %}
     * 
     * @default null
     */
    @Property(null)
    public query: Query;
    /**
     * Accepts the template design and assigns it to the selected list item in the input element of the component.
     * For more details about the available template options refer to 
     * [`Template`](../../drop-down-list/templates) documentation.
     * 
     * We have built-in `template engine`
     * which provides options to compile template string into a executable function.
     * For EX: We have expression evolution as like ES6 expression string literals.
     * @default null
     */
    @Property(null)
    public valueTemplate: string;
    /**
     * Accepts the template design and assigns it to the header container of the popup list.
     * > For more details about the available template options refer to [`Template`](../../drop-down-list/templates) documentation.
     * @default null
     */
    @Property(null)
    public headerTemplate: string;
    /**
     * Accepts the template design and assigns it to the footer container of the popup list.
     * > For more details about the available template options refer to [`Template`](../../drop-down-list/templates) documentation.
     * @default null
     */
    @Property(null)
    public footerTemplate: string;
    /**
     * When allowFiltering is set to true, show the filter bar (search box) of the component.
     * The filter action retrieves matched items through the `filtering` event based on
     * the characters typed in the search TextBox.
     * 
     * If no match is found, the value of the `noRecordsTemplate` property will be displayed.
     * > For more details about the filtering refer to [`Filtering`](../../drop-down-list/filtering) documentation.
     * 
     * {% codeBlock src="dropdownlist/allow-filtering-api/index.ts" %}{% endcodeBlock %}
     * 
     * {% codeBlock src="dropdownlist/allow-filtering-api/index.html" %}{% endcodeBlock %}
     * @default false
     */
    @Property(false)
    public allowFiltering: boolean;
    /**
     * When set to true, the user interactions on the component are disabled.
     * @default false
     */
    @Property(false)
    public readonly: boolean;
    /**
     * Gets or sets the display text of the selected item in the component.
     * @default null
     */
    @Property(null)
    public text: string;
    /**
     * Gets or sets the value of the selected item in the component.
     * @default null
     * @isGenericType true
     */
    @Property(null)
    public value: number | string | boolean;
    /**
     * Gets or sets the index of the selected item in the component.
     * 
     * {% codeBlock src="dropdownlist/index-api/index.ts" %}{% endcodeBlock %}
     * 
     * {% codeBlock src="dropdownlist/index-api/index.html" %}{% endcodeBlock %}
     * 
     * @default null
     * @blazorType int
     * @isBlazorNullableType true
     */
    @Property(null)
    public index: number;
    /**
     * Specifies whether to display the floating label above the input element.
     * Possible values are:
     * * Never: The label will never float in the input when the placeholder is available.
     * * Always: The floating label will always float above the input.
     * * Auto: The floating label will float above the input after focusing or entering a value in the input.
     * 
     * {% codeBlock src="dropdownlist/float-label-type-api/index.ts" %}{% endcodeBlock %}
     * 
     * {% codeBlock src="dropdownlist/float-label-type-api/index.html" %}{% endcodeBlock %}
     * 
     * @default Syncfusion.EJ2.Inputs.FloatLabelType.Never
     * @aspType Syncfusion.EJ2.Inputs.FloatLabelType
     * @isEnumeration true
     * @blazorType Syncfusion.EJ2.Inputs.FloatLabelType
     */
    @Property('Never')
    public floatLabelType: FloatLabelType;
    /**
     * Specifies whether to show or hide the clear button. 
     * When the clear button is clicked, `value`, `text`, and `index` properties are reset to null.
     * @default false
     */
    @Property(false)
    public showClearButton: boolean;
    /**
     * Triggers on typing a character in the filter bar when the 
     * [`allowFiltering`](./#allowfiltering) 
     * is enabled.
     * > For more details about the filtering refer to [`Filtering`](../../drop-down-list/filtering) documentation.
     * 
     * @event
     * @blazorProperty 'Filtering'
     */
    @Event()
    public filtering: EmitType<FilteringEventArgs>;

    /**
     * Triggers when an item in a popup is selected or when the model value is changed by user.
     * Use change event to 
     * [`Configure the Cascading DropDownList`](../../drop-down-list/how-to/cascading)
     * @event
     * @blazorProperty 'ValueChange'
     */
    @Event()
    public change: EmitType<ChangeEventArgs>;
    /**
     * Triggers when the popup before opens.
     * @event
     * @blazorProperty 'OnOpen'
     * @blazorType BeforeOpenEventArgs
     */
    @Event()
    public beforeOpen: EmitType<Object>;
    /**
     * Triggers when the popup opens.
     * @event
     * @blazorProperty 'Opened'
     */
    @Event()
    public open: EmitType<PopupEventArgs>;
    /**
     * Triggers when the popup is closed.
     * @event
     * @blazorProperty 'OnClose'
     */
    @Event()
    public close: EmitType<PopupEventArgs>;
    /**
     * Triggers when focus moves out from the component.
     * @event
     */
    @Event()
    public blur: EmitType<Object>;
    /**
     * Triggers when the component is focused.
     * @event
     */
    @Event()
    public focus: EmitType<Object>;

    /**
     * * Constructor for creating the DropDownList component.
     */
    constructor(options?: DropDownListModel, element?: string | HTMLElement) {
        super(options, element);
    };

    /**
     * Initialize the event handler.
     * @private
     */
    protected preRender(): void {
        this.element.style.opacity = '0';
        this.initializeData();
        super.preRender();
        this.activeIndex = this.index;
        this.queryString = '';
    }

    private initializeData(): void {
        this.isPopupOpen = false;
        this.isDocumentClick = false;
        this.isInteracted = false;
        this.isFilterFocus = false;
        this.beforePopupOpen = false;
        this.initial = true;
        this.initRemoteRender = false;
        this.isNotSearchList = false;
        this.isTyped = false;
        this.isSelected = false;
        this.preventFocus = false;
        this.preventAutoFill = false;
        this.isValidKey = false;
        this.typedString = '';
        this.isEscapeKey = false;
        this.isPreventBlur = false;
        this.isTabKey = false;
        this.actionCompleteData = { isUpdated: false };
        this.prevSelectPoints = {};
        this.isSelectCustom = false;
        this.isDropDownClick = false;
        this.preventAltUp = false;
        this.isCustomFilter = false;
        this.isSecondClick = false;
        this.keyConfigure = {
            tab: 'tab',
            enter: '13',
            escape: '27',
            end: '35',
            home: '36',
            down: '40',
            up: '38',
            pageUp: '33',
            pageDown: '34',
            open: 'alt+40',
            close: 'shift+tab',
            hide: 'alt+38',
            space: '32'
        };
    }

    protected setZIndex(): void {
        if (this.popupObj) {
            this.popupObj.setProperties({ 'zIndex': this.zIndex });
        }
    }

    protected renderList(isEmptyData?: boolean): void {
        super.render(isEmptyData);
        this.wireListEvents();
    }

    private floatLabelChange(): void {
        if (this.getModuleName() === 'dropdownlist' && this.floatLabelType === 'Auto') {
            let floatElement: HTMLElement = <HTMLElement>this.inputWrapper.container.querySelector('.e-float-text');
            if (this.inputElement.value !== '' || this.isInteracted) {
                classList(floatElement, ['e-label-top'], ['e-label-bottom']);
            } else {
                classList(floatElement, ['e-label-bottom'], ['e-label-top']);
            }
        }
    }

    protected resetHandler(e: MouseEvent): void {
        e.preventDefault();
        this.clear(e);
    }

    protected resetFocusElement(): void {
        this.removeHover();
        this.removeSelection();
        this.removeFocus();
        this.list.scrollTop = 0;
        if (this.getModuleName() !== 'autocomplete') {
            let li: Element = this.ulElement.querySelector('.' + dropDownListClasses.li);
            if (li) { li.classList.add(dropDownListClasses.focus); }
        }
    }

    protected clear(e?: MouseEvent | KeyboardEventArgs, properties?: DropDownListModel): void {
        if (isNullOrUndefined(properties) || (!isNullOrUndefined(properties) &&
            (isNullOrUndefined(properties.dataSource) ||
                (!(properties.dataSource instanceof DataManager) && properties.dataSource.length === 0)))) {
            this.isActive = true;
            this.resetSelection(properties);
        }
        let dataItem: { [key: string]: string } = this.getItemData();
        if (this.previousValue === dataItem.value) { return; }
        this.onChangeEvent(e);
    }

    private resetSelection(properties?: DropDownListModel): void {
        if (this.list) {
            if ((!isNullOrUndefined(properties) &&
                (isNullOrUndefined(properties.dataSource) ||
                    (!(properties.dataSource instanceof DataManager) && properties.dataSource.length === 0)))) {
                this.selectedLI = null;
                this.actionCompleteData.isUpdated = false;
                this.actionCompleteData.ulElement = null;
                this.actionCompleteData.list = null;
                this.resetList(properties.dataSource);
            } else {
                if (this.allowFiltering && this.getModuleName() !== 'autocomplete'
                    && !isNullOrUndefined(this.actionCompleteData.ulElement) && !isNullOrUndefined(this.actionCompleteData.list)) {
                    this.onActionComplete(this.actionCompleteData.ulElement.cloneNode(true) as HTMLElement, this.actionCompleteData.list);
                }
                this.resetFocusElement();
            }
        }
        this.hiddenElement.innerHTML = '';
        this.inputElement.value = '';
        this.value = null;
        this.itemData = null;
        this.text = null;
        this.index = null;
        this.activeIndex = null;
        this.item = null;
        this.queryString = '';
        if (this.valueTempElement) {
            detach(this.valueTempElement);
            this.inputElement.style.display = 'block';
            this.valueTempElement = null;
        }
        this.setSelection(null, null);
        this.isSelectCustom = false;
        this.updateIconState();
        this.cloneElements();
    }

    private setHTMLAttributes(): void {
        if (Object.keys(this.htmlAttributes).length) {
            for (let htmlAttr of Object.keys(this.htmlAttributes)) {
                if (htmlAttr === 'class') {
                    this.inputWrapper.container.classList.add(this.htmlAttributes[htmlAttr]);
                } else if (htmlAttr === 'disabled' && this.htmlAttributes[htmlAttr] === 'disabled') {
                    this.enabled = false;
                    this.setEnable();
                } else if (htmlAttr === 'readonly' && !isNullOrUndefined(this.htmlAttributes[htmlAttr])) {
                    this.readonly = true;
                    this.dataBind();
                } else if (htmlAttr === 'style') {
                    this.inputWrapper.container.setAttribute('style', this.htmlAttributes[htmlAttr]);
                } else {
                    let defaultAttr: string[] = ['title', 'id', 'placeholder', 'aria-placeholder',
                    'role', 'autocorrect', 'autocomplete', 'autocapitalize', 'spellcheck', 'minlength', 'maxlength'];
                    let validateAttr: string[] = ['name', 'required'];
                    if (htmlAttr.indexOf('data') === 0 || validateAttr.indexOf(htmlAttr) > -1) {
                        this.hiddenElement.setAttribute(htmlAttr, this.htmlAttributes[htmlAttr]);
                    } else if (defaultAttr.indexOf(htmlAttr) > -1) {
                        htmlAttr === 'placeholder' ? Input.setPlaceholder(this.htmlAttributes[htmlAttr], this.inputElement) :
                            this.inputElement.setAttribute(htmlAttr, this.htmlAttributes[htmlAttr]);
                    } else {
                        this.inputWrapper.container.setAttribute(htmlAttr, this.htmlAttributes[htmlAttr]);
                    }
                }
            }
        }
        if (this.getModuleName() === 'autocomplete' || this.getModuleName() === 'combobox') {
            this.inputWrapper.container.removeAttribute('tabindex');
        }
    }

    protected getAriaAttributes(): { [key: string]: string } {
        return {
            'aria-disabled': 'false',
            'aria-owns': this.element.id + '_options',
            'role': 'listbox',
            'aria-haspopup': 'true',
            'aria-expanded': 'false',
            'aria-activedescendant': 'null',
            'aria-labelledby': this.hiddenElement.id
        };
    }

    protected setEnableRtl(): void {
        Input.setEnableRtl(this.enableRtl, [this.inputElement.parentElement]);
        if (this.popupObj) {
            this.popupObj.enableRtl = this.enableRtl;
            this.popupObj.dataBind();
        }
    }

    private setEnable(): void {
        Input.setEnabled(this.enabled, this.inputElement);
        if (this.enabled) {
            removeClass([this.inputWrapper.container], dropDownListClasses.disable);
            this.inputElement.setAttribute('aria-disabled', 'false');
            this.targetElement().setAttribute('tabindex', this.tabIndex);
        } else {
            this.hidePopup();
            addClass([this.inputWrapper.container], dropDownListClasses.disable);
            this.inputElement.setAttribute('aria-disabled', 'true');
            this.targetElement().tabIndex = -1;
        }
    }
    /**
     * Get the properties to be maintained in the persisted state.
     */
    protected getPersistData(): string {
        return this.addOnPersist(['value']);
    };

    protected getLocaleName(): string {
        return 'drop-down-list';
    };

    private preventTabIndex(element: HTMLElement): void {
        if (this.getModuleName() === 'dropdownlist') {
            element.tabIndex = -1;
        }
    }

    protected targetElement(): HTMLElement | HTMLInputElement {
        return this.inputWrapper.container;
    }

    protected getNgDirective(): string {
        return 'EJS-DROPDOWNLIST';
    }

    protected getElementByText(text: string): Element {
        return this.getElementByValue(this.getValueByText(text));
    }

    protected getElementByValue(value: string | number | boolean): Element {
        let item: Element;
        let listItems: Element[] = this.getItems();
        for (let liItem of listItems) {
            if (this.getFormattedValue(liItem.getAttribute('data-value')) === value) {
                item = liItem;
                break;
            }
        }
        return item;
    };

    private initValue(): void {
        this.renderList();
        if (this.dataSource instanceof DataManager) {
            this.initRemoteRender = true;
        } else {
            this.updateValues();
        }
    }

    protected updateValues(): void {
        if (!isNullOrUndefined(this.value)) {
            this.setSelection(this.getElementByValue(this.value), null);
        } else if (this.text && isNullOrUndefined(this.value)) {
            let element: Element = this.getElementByText(this.text);
            if (isNullOrUndefined(element)) {
                this.setProperties({ text: null });
                return;
            } else {
                this.setSelection(element, null);
            }
        } else {
            this.setSelection(this.liCollections[this.activeIndex], null);
        }
        this.setHiddenValue();
        Input.setValue(this.text, this.inputElement, this.floatLabelType, this.showClearButton);
    }

    protected onBlur(e: MouseEvent): void {
        if (!this.enabled) {
            return;
        }
        let target: HTMLElement = <HTMLElement>e.relatedTarget;
        let currentTarget: HTMLElement = <HTMLElement>e.target;
        let isPreventBlur: boolean = this.isPreventBlur;
        this.isPreventBlur = false;
        //IE 11 - issue
        if (isPreventBlur && !this.isDocumentClick && this.isPopupOpen && (!isNullOrUndefined(currentTarget) ||
            !this.isFilterLayout() && isNullOrUndefined(target))) {
            if (this.getModuleName() === 'dropdownlist' && this.allowFiltering && this.isPopupOpen) {
                this.filterInput.focus();
            } else {
                this.targetElement().focus();
            }
            return;
        }
        if (this.isDocumentClick || (!isNullOrUndefined(this.popupObj)
            && document.body.contains(this.popupObj.element) &&
            this.popupObj.element.classList.contains(dropDownListClasses.mobileFilter))) {
            if (!this.beforePopupOpen) {
                this.isDocumentClick = false;
            }
            return;
        }
        if (((this.getModuleName() === 'dropdownlist' && !this.isFilterFocus && target !== this.inputElement)
            && (document.activeElement !== target || (document.activeElement === target &&
                currentTarget.classList.contains(dropDownListClasses.inputFocus)))) ||
            (isNullOrUndefined(target) && this.getModuleName() === 'dropdownlist' && this.allowFiltering &&
                currentTarget !== this.inputWrapper.container) || this.getModuleName() !== 'dropdownlist' &&
            !this.inputWrapper.container.contains(target) || this.isTabKey) {
            this.isDocumentClick = this.isPopupOpen ? true : false;
            this.focusOutAction();
            this.isTabKey = false;
        }
        if (this.isRequested && !this.isPopupOpen && !this.isPreventBlur) {
            this.isActive = false;
            this.beforePopupOpen = false;
        }
    }

    protected focusOutAction(): void {
        this.isInteracted = false;
        this.focusOut();
        this.onFocusOut();
    }

    protected onFocusOut(): void {
        if (!this.enabled) {
            return;
        }
        if (this.isSelected) {
            this.isSelectCustom = false;
            this.onChangeEvent(null);
        }
        this.floatLabelChange();
        this.dispatchEvent(this.hiddenElement as HTMLElement, 'change');
        if (this.getModuleName() === 'dropdownlist' && this.element.tagName !== 'INPUT') {
            this.dispatchEvent(this.inputElement as HTMLElement, 'blur');
        }
        if (this.inputWrapper.clearButton) {
            addClass([this.inputWrapper.clearButton], dropDownListClasses.clearIconHide);
        }
        this.trigger('blur');
    }

    protected onFocus(e?: FocusEvent | MouseEvent | KeyboardEvent | TouchEvent): void {
        if (!this.isInteracted) {
            this.isInteracted = true;
            let args: FocusEventArgs = { isInteracted: e ? true : false, event: e };
            this.trigger('focus', args);
        }
        this.updateIconState();
    }

    private resetValueHandler(e: Event): void {
        let formElement: HTMLFormElement = closest(this.inputElement, 'form') as HTMLFormElement;
        if (formElement && e.target === formElement) {
            let val: string = (this.element.tagName === this.getNgDirective()) ? null : this.inputElement.getAttribute('value');
            this.text = val;
        }
    }

    protected wireEvent(): void {
        EventHandler.add(this.inputWrapper.container, 'mousedown', this.dropDownClick, this);
        EventHandler.add(this.inputWrapper.container, 'focus', this.focusIn, this);
        EventHandler.add(this.inputWrapper.container, 'keypress', this.onSearch, this);
        this.bindCommonEvent();
    }

    protected bindCommonEvent(): void {
        EventHandler.add(this.targetElement(), 'blur', this.onBlur, this);
        let formElement: HTMLFormElement = closest(this.inputElement, 'form') as HTMLFormElement;
        if (formElement) {
            EventHandler.add(formElement, 'reset', this.resetValueHandler, this);
        }
        if (!Browser.isDevice) {
            this.keyboardModule = new KeyboardEvents(
                this.targetElement(), {
                    keyAction: this.keyActionHandler.bind(this), keyConfigs: this.keyConfigure, eventName: 'keydown'
                });
        }
        this.bindClearEvent();
    }

    private bindClearEvent(): void {
        if (this.showClearButton) {
            EventHandler.add(this.inputWrapper.clearButton, 'mousedown', this.resetHandler, this);
        }
    }

    protected unBindCommonEvent(): void {
        EventHandler.remove(this.targetElement(), 'blur', this.onBlur);
        let formElement: HTMLFormElement = closest(this.inputElement, 'form') as HTMLFormElement;
        if (formElement) {
            EventHandler.remove(formElement, 'reset', this.resetValueHandler);
        }
        if (!Browser.isDevice) {
            this.keyboardModule.destroy();
        }
        if (this.showClearButton) {
            EventHandler.remove(this.inputWrapper.clearButton, 'mousedown', this.resetHandler);
        }
    }

    protected updateIconState(): void {
        if (this.showClearButton) {
            if (this.inputElement.value !== '' && !this.readonly) {
                removeClass([this.inputWrapper.clearButton], dropDownListClasses.clearIconHide);
            } else {
                addClass([this.inputWrapper.clearButton], dropDownListClasses.clearIconHide);
            }
        }
    }
    /**
     * Event binding for list
     */
    private wireListEvents(): void {
        EventHandler.add(this.list, 'click', this.onMouseClick, this);
        EventHandler.add(this.list, 'mouseover', this.onMouseOver, this);
        EventHandler.add(this.list, 'mouseout', this.onMouseLeave, this);
    };

    private onSearch(e: KeyboardEventArgs): void {
        if (e.charCode !== 32 && e.charCode !== 13) {
            if (this.list === undefined) {
                this.renderList();
            }
            this.searchKeyEvent = e;
            if (!this.isRequested && !isNullOrUndefined(this.list.querySelector('li')) && this.enabled) {
                this.incrementalSearch(e);
            }
        }
    }

    protected onMouseClick(e: MouseEvent): void {
        let target: Element = <Element>e.target;
        let classList: DOMTokenList = target.classList;
        let li: HTMLElement = <HTMLElement>closest(target, '.' + dropDownBaseClasses.li);
        if (!this.isValidLI(li)) {
            return;
        }
        this.setSelection(li, e);
        if (Browser.isDevice && this.isFilterLayout()) {
            history.back();
        } else {
            let delay: number = 100;
            this.closePopup(delay);
        }
    }

    private onMouseOver(e: MouseEvent): void {
        let currentLi: HTMLElement = <HTMLElement>closest(<Element>e.target, '.' + dropDownBaseClasses.li);
        this.setHover(currentLi);
    };

    private setHover(li: HTMLElement): void {
        if (this.enabled && this.isValidLI(li) && !li.classList.contains(dropDownBaseClasses.hover)) {
            this.removeHover();
            addClass([li], dropDownBaseClasses.hover);
        }
    };

    private onMouseLeave(e: MouseEvent): void {
        this.removeHover();
    };

    private removeHover(): void {
        let hoveredItem: Element[] = <NodeListOf<Element> & Element[]>this.list.querySelectorAll('.' + dropDownBaseClasses.hover);
        if (hoveredItem && hoveredItem.length) {
            removeClass(hoveredItem, dropDownBaseClasses.hover);
        }
    };

    protected isValidLI(li: Element | HTMLElement): boolean {
        return (li && li.hasAttribute('role') && li.getAttribute('role') === 'option');
    };

    protected incrementalSearch(e: KeyboardEventArgs): void {
        if (this.liCollections.length > 0) {
            let li: Element = incrementalSearch(e.charCode, this.liCollections, this.activeIndex, true);
            if (!isNullOrUndefined(li)) {
                this.setSelection(li, e);
                this.setScrollPosition();
            }
        }
    };
    /**
     * Hides the spinner loader.
     * @returns void.
     */
    public hideSpinner(): void {
        if (!isNullOrUndefined(this.spinnerElement)) {
            hideSpinner(this.spinnerElement);
            removeClass([this.spinnerElement], dropDownListClasses.disableIcon);
            this.spinnerElement.innerHTML = '';
            this.spinnerElement = null;
        }
    }
    /**
     * Shows the spinner loader.
     * @returns void.
     */
    public showSpinner(): void {
        if (isNullOrUndefined(this.spinnerElement)) {
            this.spinnerElement = Browser.isDevice && !isNullOrUndefined(this.filterInputObj) && this.filterInputObj.buttons[1] ||
                !isNullOrUndefined(this.filterInputObj) && this.filterInputObj.buttons[0] || this.inputWrapper.buttons[0];
            addClass([this.spinnerElement], dropDownListClasses.disableIcon);
            createSpinner(
                {
                    target: this.spinnerElement,
                    width: Browser.isDevice ? '16px' : '14px'
                },
                this.createElement);
            showSpinner(this.spinnerElement);
        }
    }
    protected keyActionHandler(e: KeyboardEventArgs): void {
        if (!this.enabled) {
            return;
        }
        let preventAction: boolean = e.action === 'pageUp' || e.action === 'pageDown';
        let preventHomeEnd: boolean = this.getModuleName() !== 'dropdownlist' && (e.action === 'home' || e.action === 'end');
        this.isEscapeKey = e.action === 'escape';
        this.isTabKey = !this.isPopupOpen && e.action === 'tab';
        let isNavigation: boolean = (e.action === 'down' || e.action === 'up' || e.action === 'pageUp' || e.action === 'pageDown'
            || e.action === 'home' || e.action === 'end');
        if ((this.isEditTextBox() || preventAction || preventHomeEnd) && !this.isPopupOpen) {
            return;
        }
        if (!this.readonly) {
            let isTabAction: boolean = e.action === 'tab' || e.action === 'close';
            if (this.list === undefined && !this.isRequested && !isTabAction && e.action !== 'escape') {
                this.searchKeyEvent = e;
                this.renderList();
            }
            if (isNullOrUndefined(this.list) || (!isNullOrUndefined(this.liCollections) &&
                isNavigation && this.liCollections.length === 0) || this.isRequested) {
                return;
            }
            if (isTabAction && this.isPopupOpen || e.action === 'escape') { e.preventDefault(); }
            this.isSelected = e.action === 'escape' ? false : this.isSelected;
            this.isTyped = (isNavigation || e.action === 'escape') ? false : this.isTyped;
            switch (e.action) {
                case 'down':
                case 'up':
                    let focusEle: Element = this.list.querySelector('.' + dropDownListClasses.focus);
                    if (this.isSelectFocusItem(focusEle)) {
                        this.setSelection(focusEle, e);
                    } else {
                        let nextItem: Element;
                        let index: number = e.action === 'down' ? this.activeIndex + 1 : this.activeIndex - 1;
                        let startIndex: number = 0;
                        if (this.getModuleName() === 'autocomplete') {
                            startIndex = e.action === 'down' && isNullOrUndefined(this.activeIndex) ? 0 : this.liCollections.length - 1;
                            index = index < 0 ? this.liCollections.length - 1 : index === this.liCollections.length ? 0 : index;
                        }
                        nextItem = isNullOrUndefined(this.activeIndex) ? this.liCollections[startIndex] : this.liCollections[index];
                        this.setSelection(nextItem, e);
                    }
                    e.preventDefault();
                    break;
                case 'pageUp':
                    this.pageUpSelection(this.activeIndex - this.getPageCount(), e);
                    e.preventDefault();
                    break;
                case 'pageDown':
                    this.pageDownSelection(this.activeIndex + this.getPageCount(), e);
                    e.preventDefault();
                    break;
                case 'home':
                    if (this.getModuleName() === 'dropdownlist') {
                        e.preventDefault();
                        if (this.activeIndex === 0) { return; }
                        this.setSelection(this.liCollections[0], e);
                    }
                    break;
                case 'end':
                    if (this.getModuleName() === 'dropdownlist') {
                        e.preventDefault();
                        let lastLi: number = this.getItems().length - 1;
                        if (this.activeIndex === lastLi) { return; }
                        this.setSelection(this.liCollections[lastLi], e);
                    }
                    break;
                case 'space':
                    if (this.getModuleName() === 'dropdownlist') {
                        if (!this.beforePopupOpen) {
                            this.showPopup();
                        }
                    }
                    break;
                case 'open':
                    this.showPopup();
                    break;
                case 'hide':
                    this.preventAltUp = this.isPopupOpen;
                    this.hidePopup();
                    this.focusDropDown(e);
                    break;
                case 'enter':
                    this.selectCurrentItem(e);
                    break;
                case 'escape':
                case 'tab':
                case 'close':
                    if (this.isPopupOpen) {
                        this.hidePopup();
                        this.focusDropDown(e);
                    }
                    break;
            }
        }
    }

    protected selectCurrentItem(e: KeyboardEventArgs): void {
        if (this.isPopupOpen) {
            let li: Element = this.list.querySelector('.' + dropDownListClasses.focus);
            if (li) {
                this.setSelection(li, e);
                this.isTyped = false;
            }
            if (this.isSelected) {
                this.isSelectCustom = false;
                this.onChangeEvent(e);
            }
            this.hidePopup();
            this.focusDropDown(e);
        } else {
            this.showPopup();
        }
    }

    protected isSelectFocusItem(element: Element): boolean {
        return !isNullOrUndefined(element);
    }

    private getPageCount(): number {
        let liHeight: string = this.list.classList.contains(dropDownBaseClasses.noData) ? null :
            getComputedStyle(this.getItems()[0], null).getPropertyValue('height');
        return Math.round(this.list.getBoundingClientRect().height / parseInt(liHeight, 10));
    }

    private pageUpSelection(steps: number, event: KeyboardEventArgs): void {
        let previousItem: Element = steps >= 0 ? this.liCollections[steps + 1] : this.liCollections[0];
        this.setSelection(previousItem, event);
    };

    private pageDownSelection(steps: number, event: KeyboardEventArgs): void {
        let list: Element[] = this.getItems();
        let previousItem: Element = steps <= list.length ? this.liCollections[steps - 1] : this.liCollections[list.length - 1];
        this.setSelection(previousItem, event);
    };

    protected unWireEvent(): void {
        EventHandler.remove(this.inputWrapper.container, 'mousedown', this.dropDownClick);
        EventHandler.remove(this.inputWrapper.container, 'keypress', this.onSearch);
        EventHandler.remove(this.inputWrapper.container, 'focus', this.focusIn);
        this.unBindCommonEvent();
    }
    /**
     * Event un binding for list items.
     */
    private unWireListEvents(): void {
        EventHandler.remove(this.list, 'click', this.onMouseClick);
        EventHandler.remove(this.list, 'mouseover', this.onMouseOver);
        EventHandler.remove(this.list, 'mouseout', this.onMouseLeave);
    };

    protected onDocumentClick(e: MouseEvent): void {
        let target: HTMLElement = <HTMLElement>e.target;
        if (!(!isNullOrUndefined(this.popupObj) && closest(target, '#' + this.popupObj.element.id)) &&
            !this.inputWrapper.container.contains(e.target as Node)) {
            if (this.inputWrapper.container.classList.contains(dropDownListClasses.inputFocus) || this.isPopupOpen) {
                this.isDocumentClick = true;
                let isActive: boolean = this.isRequested;
                this.isInteracted = false;
                this.hidePopup();
                if (!isActive) {
                    this.onFocusOut();
                    this.inputWrapper.container.classList.remove(dropDownListClasses.inputFocus);
                }
            }
        } else if (target !== this.inputElement && !(this.allowFiltering && target === this.filterInput)
            && !(this.getModuleName() === 'combobox' &&
                !this.allowFiltering && Browser.isDevice && target === this.inputWrapper.buttons[0])) {
            this.isPreventBlur = (Browser.isIE || Browser.info.name === 'edge') && (document.activeElement === this.targetElement() ||
                document.activeElement === this.filterInput);
            e.preventDefault();
        }
    }

    private activeStateChange(): void {
        if (this.isDocumentClick) {
            this.hidePopup();
            this.onFocusOut();
            this.inputWrapper.container.classList.remove(dropDownListClasses.inputFocus);
        }
    }

    private focusDropDown(e?: MouseEvent | KeyboardEventArgs | TouchEvent): void {
        if (!this.initial && this.isFilterLayout()) {
            this.focusIn(e);
        }
    }

    protected dropDownClick(e: MouseEvent): void {
        if (e.which === 3 || e.button === 2) { return; }
        if (this.targetElement().classList.contains(dropDownListClasses.disable) || this.inputWrapper.clearButton === e.target) { return; }
        let target: HTMLElement = <HTMLElement>e.target;
        if (target !== this.inputElement && !(this.allowFiltering && target === this.filterInput) && this.getModuleName() !== 'combobox') {
            e.preventDefault();
        }
        if (!this.readonly) {
            if (this.isPopupOpen) {
                this.hidePopup();
                if (this.isFilterLayout()) { this.focusDropDown(e); }
            } else {
                this.focusIn(e);
                this.floatLabelChange();
                this.queryString = this.inputElement.value.trim() === '' ? null : this.inputElement.value;
                this.isDropDownClick = true;
                this.showPopup();
            }
            let proxy: this = this;
            let duration: number = (isBlazor()) ? 1000 : 100;
            if (!this.isSecondClick) {
                setTimeout(() => { proxy.cloneElements(); proxy.isSecondClick = true; }, duration);
            }
        } else {
            this.focusIn(e);
        }
    }
    protected cloneElements(): void {
        if (this.list) {
            let ulElement: HTMLElement = this.list.querySelector('ul');
            if (ulElement) {
                ulElement = ulElement.cloneNode ? (ulElement.cloneNode(true) as HTMLElement) : ulElement;
                this.actionCompleteData.ulElement = ulElement;
            }
        }
    }
    protected updateSelectedItem(
        li: Element,
        e: MouseEvent | KeyboardEvent | TouchEvent,
        preventSelect?: boolean,
        isSelection?: boolean): void {
        this.removeSelection();
        li.classList.add(dropDownBaseClasses.selected);
        this.removeHover();
        let value: string | number | boolean = this.getFormattedValue(li.getAttribute('data-value'));
        let selectedData: string | number | boolean | {
            [key: string]: Object;
        } = this.getDataByValue(value);
        if (!this.initial && !preventSelect && !isNullOrUndefined(e)) {
            let items: FieldSettingsModel = this.detachChanges(selectedData);
            this.isSelected = true;
            let eventArgs: SelectEventArgs = {
                e: e,
                item: li as HTMLLIElement,
                itemData: items,
                isInteracted: e ? true : false,
                cancel: false
            };
            this.trigger('select', eventArgs, (eventArgs: SelectEventArgs) => {
                if (eventArgs.cancel) {
                    li.classList.remove(dropDownBaseClasses.selected);
                } else {
                    this.selectEventCallback(li, e, preventSelect, selectedData, value);
                    if (isSelection) { this.setSelectOptions(li, e); }
                }
            });
        } else {
            this.selectEventCallback(li, e, preventSelect, selectedData, value);
            if (isSelection) { this.setSelectOptions(li, e); }
        }
    }

    private selectEventCallback(
        li: Element,
        e: MouseEvent | KeyboardEvent | TouchEvent,
        preventSelect?: boolean,
        selectedData?: string | number | boolean | { [key: string]: Object },
        value?: string | number | boolean): void {
        this.previousItemData = (!isNullOrUndefined(this.itemData)) ? this.itemData : null;
        this.item = li as HTMLLIElement;
        this.itemData = selectedData;
        let focusedItem: Element = this.list.querySelector('.' + dropDownBaseClasses.focus);
        if (focusedItem) { removeClass([focusedItem], dropDownBaseClasses.focus); }
        li.setAttribute('aria-selected', 'true');
        this.activeIndex = this.getIndexByValue(value);
    }

    protected activeItem(li: Element): void {
        if (this.isValidLI(li) && !li.classList.contains(dropDownBaseClasses.selected)) {
            this.removeSelection();
            li.classList.add(dropDownBaseClasses.selected);
            this.removeHover();
            li.setAttribute('aria-selected', 'true');
        }
    }

    protected setValue(e?: KeyboardEventArgs): boolean {
        let dataItem: { [key: string]: string } = this.getItemData();
        if (dataItem.value === null) {
            Input.setValue(null, this.inputElement, this.floatLabelType, this.showClearButton);
        } else {
            Input.setValue(dataItem.text, this.inputElement, this.floatLabelType, this.showClearButton);
        }
        if (this.valueTemplate && this.itemData !== null) {
            this.DropDownBaseresetBlazorTemplates(false, false, false, false, true);
            this.setValueTemplate();
        } else if (this.inputElement.previousSibling === this.valueTempElement) {
            detach(this.valueTempElement);
            this.inputElement.style.display = 'block';
        }
        if (this.previousValue === dataItem.value) {
            this.isSelected = false;
            return true;
        } else {
            this.isSelected = !this.initial ? true : false;
            this.isSelectCustom = false;
            if (this.getModuleName() === 'dropdownlist') {
                this.updateIconState();
            }
            return false;
        }
    }

    protected setSelection(li: Element, e: MouseEvent | KeyboardEventArgs | TouchEvent): void {
        if (this.isValidLI(li) && !li.classList.contains(dropDownBaseClasses.selected)) {
            this.updateSelectedItem(li, e, false, true);
        } else {
            this.setSelectOptions(li, e);
        }
    }
    private setSelectOptions(li: Element, e?: MouseEvent | KeyboardEventArgs | KeyboardEvent | TouchEvent): void {
        if (this.list) {
            this.removeHover();
        }
        this.previousSelectedLI = (!isNullOrUndefined(this.selectedLI)) ? this.selectedLI : null;
        this.selectedLI = li as HTMLElement;
        if (this.setValue(e as KeyboardEventArgs)) {
            return;
        }
        if (this.isPopupOpen) {
            attributes(this.targetElement(), { 'aria-activedescendant': this.selectedLI ? this.selectedLI.id : null });
            if (this.isFilterLayout()) {
                attributes(this.filterInput, { 'aria-activedescendant': this.selectedLI ? this.selectedLI.id : null });
            }
        }
        if ((!this.isPopupOpen && !isNullOrUndefined(li)) || (this.isPopupOpen && !isNullOrUndefined(e) &&
            (e.type !== 'keydown' || e.type === 'keydown' && (e as KeyboardEventArgs).action === 'enter'))) {
            this.isSelectCustom = false;
            this.onChangeEvent(e);
        }
        if (this.isPopupOpen && !isNullOrUndefined(this.selectedLI) && this.itemData !== null && (!e || e.type !== 'click')) {
            this.setScrollPosition(e as KeyboardEventArgs);
        }
    }

    private setValueTemplate(): void {
        let compiledString: Function;
        if (!this.valueTempElement) {
            this.valueTempElement = this.createElement('span', { className: dropDownListClasses.value });
            this.inputElement.parentElement.insertBefore(this.valueTempElement, this.inputElement);
            this.inputElement.style.display = 'none';
        }
        this.valueTempElement.innerHTML = '';
        let templateData: FieldSettingsModel = (isBlazor()) ? JSON.parse(JSON.stringify(this.itemData)) : this.itemData;
        compiledString = compile(this.valueTemplate);
        for (let item of compiledString(templateData, null, null, this.valueTemplateId, this.isStringTemplate)) {
            this.valueTempElement.appendChild(item);
        }
        this.DropDownBaseupdateBlazorTemplates(false, false, false, false, true, true, true);
    }

    protected removeSelection(): void {
        let selectedItems: Element[] = <NodeListOf<Element> & Element[]>this.list.querySelectorAll('.' + dropDownBaseClasses.selected);
        if (selectedItems.length) {
            removeClass(selectedItems, dropDownBaseClasses.selected);
            selectedItems[0].removeAttribute('aria-selected');
        }
    };

    protected getItemData(): { [key: string]: string } {
        let fields: FieldSettingsModel = this.fields;
        let dataItem: { [key: string]: string | Object } | string | boolean | number = null;
        dataItem = this.itemData;
        let dataValue: string;
        let dataText: string;
        if (!isNullOrUndefined(dataItem)) {
            dataValue = getValue(fields.value, dataItem);
            dataText = getValue(fields.text, dataItem);
        }
        let value: string = <string>(!isNullOrUndefined(dataItem) &&
            !isUndefined(dataValue) ? dataValue : dataItem);
        let text: string = <string>(!isNullOrUndefined(dataItem) &&
            !isUndefined(dataValue) ? dataText : dataItem);
        return { value: value, text: text };
    }
    /**
     * To trigger the change event for list.
     */
    protected onChangeEvent(eve: MouseEvent | KeyboardEvent | TouchEvent): void {
        let dataItem: { [key: string]: string } = this.getItemData();
        let index: number = this.isSelectCustom ? null : this.activeIndex;
        this.setProperties({ 'index': index, 'text': dataItem.text, 'value': dataItem.value }, true);
        this.detachChangeEvent(eve);
    };

    private detachChanges(value: string | number | boolean | {
        [key: string]: Object;
    }): FieldSettingsModel {
        let items: FieldSettingsModel;
        if (typeof value === 'string' ||
            typeof value === 'boolean' ||
            typeof value === 'number') {
            items = Object.defineProperties({}, {
                value: {
                    value: value,
                    enumerable: true
                },
                text: {
                    value: value,
                    enumerable: true
                }
            });
        } else {
            items = value;
        }
        return items;
    }

    protected detachChangeEvent(eve: MouseEvent | KeyboardEvent | TouchEvent): void {
        this.isSelected = false;
        this.previousValue = this.value;
        this.activeIndex = this.index;
        this.typedString = !isNullOrUndefined(this.text) ? this.text : '';
        if (!this.initial) {
            let items: FieldSettingsModel = this.detachChanges(this.itemData);
            let preItems: FieldSettingsModel;
            if (typeof this.previousItemData === 'string' ||
                typeof this.previousItemData === 'boolean' ||
                typeof this.previousItemData === 'number') {
                preItems = Object.defineProperties({}, {
                    value: {
                        value: this.previousItemData,
                        enumerable: true
                    },
                    text: {
                        value: this.previousItemData,
                        enumerable: true
                    }
                });
            } else {
                preItems = this.previousItemData;
            }
            this.setHiddenValue();
            let eventArgs: ChangeEventArgs = {
                e: eve,
                item: this.item,
                itemData: items,
                previousItem: this.previousSelectedLI as HTMLLIElement,
                previousItemData: preItems,
                isInteracted: eve ? true : false,
                value: this.value,
                element: this.element
            };
            this.trigger('change', eventArgs);
        }
    }

    protected setHiddenValue(): void {
        if (!isNullOrUndefined(this.value)) {
            this.hiddenElement.innerHTML = '<option selected>' + this.text + '</option>';
            let selectedElement: HTMLElement = this.hiddenElement.querySelector('option');
            selectedElement.setAttribute('value', this.value.toString());
        } else {
            this.hiddenElement.innerHTML = '';
        }
    }
    /**
     * Filter bar implementation
     */
    protected onFilterUp(e: KeyboardEventArgs): void {
        if (this.isValidKey || e.keyCode === 40 || e.keyCode === 38) {
            this.isValidKey = false;
            switch (e.keyCode) {
                case 38:  //up arrow 
                case 40:  //down arrow 
                    if (this.getModuleName() === 'autocomplete' && !this.isPopupOpen && !this.preventAltUp && !this.isRequested) {
                        this.preventAutoFill = true;
                        this.searchLists(e);
                    } else {
                        this.preventAutoFill = false;
                    }
                    this.preventAltUp = false;
                    e.preventDefault();
                    break;
                case 46:  //delete
                case 8:   //backspace
                    this.typedString = this.filterInput.value;
                    if (!this.isPopupOpen && this.typedString !== '' || this.isPopupOpen && this.queryString.length > 0) {
                        this.preventAutoFill = true;
                        this.searchLists(e);
                    } else if (this.typedString === '') {
                        this.resetFocusElement();
                        this.activeIndex = null;
                        if (this.getModuleName() === 'autocomplete') {
                            this.hidePopup();
                        }
                    }
                    e.preventDefault();
                    break;
                default:
                    this.typedString = this.filterInput.value;
                    this.preventAutoFill = false;
                    this.searchLists(e);
                    break;
            }
        } else {
            this.isValidKey = false;
        }
    }

    protected onFilterDown(e: KeyboardEventArgs): void {
        switch (e.keyCode) {
            case 13:  //enter
                break;
            case 40: //down arrow
            case 38: //up arrow 
                this.queryString = this.filterInput.value;
                e.preventDefault();
                break;
            case 9: //tab 
                if (this.isPopupOpen) {
                    e.preventDefault();
                }
                break;
            default:
                this.prevSelectPoints = this.getSelectionPoints();
                this.queryString = this.filterInput.value;
                break;
        }
    }

    protected removeFillSelection(): void {
        if (this.isInteracted) {
            let selection: { [key: string]: number } = this.getSelectionPoints();
            this.inputElement.setSelectionRange(selection.end, selection.end);
        }
    }
    protected getQuery(query: Query): Query {
        let filterQuery: Query;
        if (!this.isCustomFilter && this.allowFiltering) {
            filterQuery = query ? query.clone() : this.query ? this.query.clone() : new Query();
            let filterType: string = this.typedString === '' ? 'contains' : this.filterType;
            let dataType: string = <string>this.typeOfData(this.dataSource as { [key: string]: Object; }[]).typeof;
            if (!(this.dataSource instanceof DataManager) && dataType === 'string' || dataType === 'number') {
                filterQuery.where('', filterType, this.typedString, this.ignoreCase, this.ignoreAccent);
            } else {
                let fields: string = (this.fields.text) ? this.fields.text : '';
                filterQuery.where(fields, filterType, this.typedString, this.ignoreCase, this.ignoreAccent);
            }
        } else {
            filterQuery = query ? query : this.query ? this.query : new Query();
        }
        return filterQuery;
    }

    protected getSelectionPoints(): { [key: string]: number } {
        let input: HTMLInputElement = <HTMLInputElement>this.inputElement;
        return { start: Math.abs(input.selectionStart), end: Math.abs(input.selectionEnd) };
    }

    protected searchLists(e: KeyboardEventArgs): void {
        this.isTyped = true;
        this.activeIndex = null;
        if (this.filterInput.parentElement.querySelector('.' + dropDownListClasses.clearIcon)) {
            let clearElement: HTMLElement = <HTMLElement>this.filterInput.parentElement.querySelector('.' + dropDownListClasses.clearIcon);
            clearElement.style.visibility = this.filterInput.value === '' ? 'hidden' : 'visible';
        }
        this.isDataFetched = false;
        if (this.isFiltering()) {
            let eventArgs: FilteringEventArgs = {
                preventDefaultAction: false,
                text: this.filterInput.value,
                updateData: (
                    dataSource: { [key: string]: Object }[] | DataManager | string[] | number[], query?: Query,
                    fields?: FieldSettingsModel) => {
                    if (eventArgs.cancel) { return; }
                    this.isCustomFilter = true;
                    this.filteringAction(dataSource, query, fields);
                },
                baseEventArgs: e,
                cancel: false
            };
            this.trigger('filtering', eventArgs, (eventArgs: FilteringEventArgs) => {
                if (!eventArgs.cancel && !this.isCustomFilter && !eventArgs.preventDefaultAction) {
                    this.filteringAction(this.dataSource, null, this.fields);
                }
            });
        }
    }
    private filteringAction(
        dataSource: { [key: string]: Object }[] | DataManager | string[] | number[] | boolean[],
        query?: Query, fields?: FieldSettingsModel): void {
        if (!isNullOrUndefined(this.filterInput)) {
            this.beforePopupOpen = true;
            if (this.filterInput.value.trim() === '' && !this.itemTemplate) {
                this.actionCompleteData.isUpdated = false;
                this.isTyped = false;
                if (!isNullOrUndefined(this.actionCompleteData.ulElement) && !isNullOrUndefined(this.actionCompleteData.list)) {
                    this.onActionComplete(this.actionCompleteData.ulElement, this.actionCompleteData.list);
                }
                this.isTyped = true;
                if (!isNullOrUndefined(this.itemData) && this.getModuleName() === 'dropdownlist') {
                    this.focusIndexItem();
                    this.setScrollPosition();
                }
                this.isNotSearchList = true;
            } else {
                this.isNotSearchList = false;
                if ((this.element.tagName === 'SELECT' && (<HTMLSelectElement>this.element).options.length > 0)
                    || (this.element.tagName === 'UL' && (<HTMLUListElement>this.element).childNodes.length > 0)) {
                    let data: boolean = dataSource instanceof Array ? (dataSource.length > 0)
                : !isNullOrUndefined(dataSource);
                    if (!data && this.listData.length > 0) {
                        dataSource = this.listData;
                    }
                }
                query = (this.filterInput.value.trim() === '') ? null : query;
                this.resetList(dataSource, fields, query);
            }
        }

    }
    protected setSearchBox(popupElement: HTMLElement): InputObject {
        if (this.isFiltering()) {
            let parentElement: HTMLElement = this.createElement('span', {
                className: dropDownListClasses.filterParent
            });
            this.filterInput = <HTMLInputElement>this.createElement('input', {
                attrs: { type: 'text' },
                className: dropDownListClasses.filterInput
            });
            this.element.parentNode.insertBefore(this.filterInput, this.element);
            let backIcon: boolean = false;
            if (Browser.isDevice) {
                backIcon = true;
            }
            this.filterInputObj = Input.createInput(
                {
                    element: this.filterInput,
                    buttons: backIcon ?
                        [dropDownListClasses.backIcon, dropDownListClasses.filterBarClearIcon] : [dropDownListClasses.filterBarClearIcon],
                    properties: { placeholder: this.filterBarPlaceholder }
                },
                this.createElement
            );
            append([this.filterInputObj.container], parentElement);
            prepend([parentElement], popupElement);
            attributes(this.filterInput, {
                'aria-disabled': 'false',
                'aria-owns': this.element.id + '_options',
                'role': 'listbox',
                'aria-activedescendant': this.selectedLI ? this.selectedLI.id : null,
                'autocomplete': 'off',
                'autocorrect': 'off',
                'autocapitalize': 'off',
                'spellcheck': 'false'
            });
            this.clearIconElement = this.filterInput.parentElement.querySelector('.' + dropDownListClasses.clearIcon);
            if (!Browser.isDevice && this.clearIconElement) {
                EventHandler.add(this.clearIconElement, 'click', this.clearText, this);
                (this.clearIconElement as HTMLElement).style.visibility = 'hidden';
            }
            if (!Browser.isDevice) {
                this.searchKeyModule = new KeyboardEvents(this.filterInput, {
                    keyAction: this.keyActionHandler.bind(this),
                    keyConfigs: this.keyConfigure,
                    eventName: 'keydown'
                });
            }
            EventHandler.add(this.filterInput, 'input', this.onInput, this);
            EventHandler.add(this.filterInput, 'keyup', this.onFilterUp, this);
            EventHandler.add(this.filterInput, 'keydown', this.onFilterDown, this);
            EventHandler.add(this.filterInput, 'blur', this.onBlur, this);
            return this.filterInputObj;
        } else {
            return inputObject;
        }
    };

    protected onInput(): void {
        this.isValidKey = true;
    }

    protected onActionFailure(e: Object): void {
        super.onActionFailure(e);
        if (this.beforePopupOpen) {
            this.renderPopup();
        }
    }

    protected onActionComplete(ulElement: HTMLElement, list: { [key: string]: Object }[], e?: Object, isUpdated?: boolean): void {
        if (this.isNotSearchList) {
            this.isNotSearchList = false;
            return;
        }
        if (this.isActive) {
            let selectedItem: HTMLElement = this.selectedLI ? <HTMLElement>this.selectedLI.cloneNode(true) : null;
            super.onActionComplete(ulElement, list, e);
            if (this.isRequested && !isNullOrUndefined(this.searchKeyEvent) && this.searchKeyEvent.type === 'keydown') {
                this.isRequested = false;
                this.keyActionHandler(this.searchKeyEvent);
                this.searchKeyEvent = null;
            }
            if (this.isRequested && !isNullOrUndefined(this.searchKeyEvent)) {
                this.incrementalSearch(this.searchKeyEvent);
                this.searchKeyEvent = null;
            }
            this.list.scrollTop = 0;
            if (!isNullOrUndefined(ulElement)) {
                attributes(ulElement, { 'id': this.element.id + '_options', 'role': 'listbox', 'aria-hidden': 'false' });
            }
            if (this.initRemoteRender) {
                this.initial = true;
                this.activeIndex = this.index;
                this.updateValues();
                this.initRemoteRender = false;
                this.initial = false;
                if (this.value && this.dataSource instanceof DataManager) {
                    let checkField: string = isNullOrUndefined(this.fields.value) ? this.fields.text : this.fields.value;
                    let checkVal: boolean = list.some((x: {[key: string]: boolean | string | number}) => x[checkField] === this.value);
                    if (!checkVal) {
                        this.dataSource.executeQuery(this.getQuery(this.query).where(new Predicate(checkField, 'equal', this.value)))
                        .then((e: Object) => {
                            if ((e as ResultData).result.length > 0) {
                                this.addItem((e as ResultData).result, list.length);
                                this.updateValues();
                            }
                        });
                    }
                }
            }
            if (this.getModuleName() !== 'autocomplete' && this.isFiltering() && !this.isTyped) {
                if (!this.actionCompleteData.isUpdated || ((!this.isCustomFilter
                    && !this.isFilterFocus)
                    && ((this.dataSource instanceof DataManager)
                        || (!isNullOrUndefined(this.dataSource) && !isNullOrUndefined(this.dataSource.length) &&
                            this.dataSource.length !== 0)))) {
                    this.actionCompleteData = { ulElement: ulElement.cloneNode(true) as HTMLElement, list: list, isUpdated: true };
                }
                this.addNewItem(list, selectedItem);
                if (!isNullOrUndefined(this.itemData)) {
                    this.focusIndexItem();
                }
            }
            if (this.beforePopupOpen) {
                this.renderPopup();
            }
        }
    }

    private addNewItem(listData: { [key: string]: Object }[], newElement: HTMLElement): void {
        if (!isNullOrUndefined(this.itemData) && !isNullOrUndefined(newElement)) {
            let value: string | number = this.getItemData().value;
            let isExist: boolean = listData.some((data: { [key: string]: Object }) => {
                return (((typeof data === 'string' || typeof data === 'number') && data === value) ||
                    (getValue(this.fields.value, data) === value));
            });
            if (!isExist) {
                this.addItem(this.itemData);
            }
        }
    }

    protected updateActionCompleteData(li: HTMLElement, item: { [key: string]: Object }): void {
        if (this.getModuleName() !== 'autocomplete' && this.actionCompleteData.ulElement) {
            this.actionCompleteData.ulElement.appendChild(li.cloneNode(true));
            if (this.isFiltering() && this.actionCompleteData.list.indexOf(item) > 0) {
                this.actionCompleteData.list.push(item);
            }
        }
    }

    private focusIndexItem(): void {
        let value: string | number = this.getItemData().value;
        this.activeIndex = this.getIndexByValue(value);
        let element: HTMLElement = this.findListElement(this.list, 'li', 'data-value', value);
        this.selectedLI = element;
        this.activeItem(element);
        this.removeFocus();
    }

    protected updateSelection(): void {
        let selectedItem: Element = this.list.querySelector('.' + dropDownBaseClasses.selected);
        if (selectedItem) {
            this.setProperties({ 'index': this.getIndexByValue(selectedItem.getAttribute('data-value')) });
            this.activeIndex = this.index;
        } else {
            this.removeFocus();
            this.list.querySelector('.' + dropDownBaseClasses.li).classList.add(dropDownListClasses.focus);
        }
    }

    protected removeFocus(): void {
        let highlightedItem: Element[] = <NodeListOf<Element> & Element[]>this.list.querySelectorAll('.' + dropDownListClasses.focus);
        if (highlightedItem && highlightedItem.length) {
            removeClass(highlightedItem, dropDownListClasses.focus);
        }
    };

    protected renderPopup(): void {
        if (this.popupObj && document.body.contains(this.popupObj.element)) {
            this.refreshPopup();
            return;
        }
        let args: BeforeOpenEventArgs = { cancel: false };
        this.trigger('beforeOpen', args, (args: BeforeOpenEventArgs) => {
            if (!args.cancel) {
                let popupEle: HTMLElement = this.createElement('div', {
                    id: this.element.id + '_popup', className: 'e-ddl e-popup ' + (this.cssClass != null ? this.cssClass : '')
                });
                let searchBox: InputObject = this.setSearchBox(popupEle);
                this.listHeight = formatUnit(this.popupHeight);
                if (this.headerTemplate) {
                    this.setHeaderTemplate(popupEle);
                }
                append([this.list], popupEle);
                if (this.footerTemplate) {
                    this.setFooterTemplate(popupEle);
                }
                document.body.appendChild(popupEle);
                popupEle.style.visibility = 'hidden';
                if (this.popupHeight !== 'auto') {
                    this.searchBoxHeight = 0;
                    if (!isNullOrUndefined(searchBox.container)) {
                        this.searchBoxHeight = (searchBox.container.parentElement).getBoundingClientRect().height;
                        this.listHeight = (parseInt(this.listHeight, 10) - (this.searchBoxHeight)).toString() + 'px';
                    }
                    if (this.headerTemplate) {
                        let height: number = Math.round(this.header.getBoundingClientRect().height);
                        this.listHeight = (parseInt(this.listHeight, 10) - (height + this.searchBoxHeight)).toString() + 'px';
                    }
                    if (this.footerTemplate) {
                        let height: number = Math.round(this.footer.getBoundingClientRect().height);
                        this.listHeight = (parseInt(this.listHeight, 10) - (height + this.searchBoxHeight)).toString() + 'px';
                    }
                    this.list.style.maxHeight = (parseInt(this.listHeight, 10) - 2).toString() + 'px'; // due to box-sizing property
                    popupEle.style.maxHeight = formatUnit(this.popupHeight);
                } else {
                    popupEle.style.height = 'auto';
                }
                let offsetValue: number = 0;
                let left: number;
                if (!isNullOrUndefined(this.selectedLI) && (!isNullOrUndefined(this.activeIndex) && this.activeIndex >= 0)) {
                    this.setScrollPosition();
                } else {
                    this.list.scrollTop = 0;
                }
                if (Browser.isDevice && (!this.allowFiltering && (this.getModuleName() === 'dropdownlist' ||
                    (this.isDropDownClick && this.getModuleName() === 'combobox')))) {
                    offsetValue = this.getOffsetValue(popupEle);
                    let firstItem: HTMLElement = this.isEmptyList() ? this.list : this.liCollections[0];
                    left = -(parseInt(getComputedStyle(firstItem).textIndent, 10) -
                        parseInt(getComputedStyle(this.inputElement).paddingLeft, 10) +
                        parseInt(getComputedStyle(this.inputElement.parentElement).borderLeftWidth, 10));
                }
                this.getFocusElement();
                this.createPopup(popupEle, offsetValue, left);
                this.checkCollision(popupEle);
                if (Browser.isDevice) {
                    this.popupObj.element.classList.add(dropDownListClasses.device);
                    if (this.getModuleName() === 'dropdownlist' || (this.getModuleName() === 'combobox'
                        && !this.allowFiltering && this.isDropDownClick)) {
                        this.popupObj.collision = { X: 'fit', Y: 'fit' };
                    }
                    if (this.isFilterLayout()) {
                        this.popupObj.element.classList.add(dropDownListClasses.mobileFilter);
                        this.popupObj.position = { X: 0, Y: 0 };
                        this.popupObj.dataBind();
                        attributes(this.popupObj.element, { style: 'left:0px;right:0px;top:0px;bottom:0px;' });
                        addClass([document.body, this.popupObj.element], dropDownListClasses.popupFullScreen);
                        this.setSearchBoxPosition();
                        this.backIconElement = searchBox.container.querySelector('.e-back-icon');
                        this.clearIconElement = searchBox.container.querySelector('.' + dropDownListClasses.clearIcon);
                        EventHandler.add(this.backIconElement, 'click', this.clickOnBackIcon, this);
                        EventHandler.add(this.clearIconElement, 'click', this.clearText, this);
                    }
                }
                popupEle.style.visibility = 'visible';
                addClass([popupEle], 'e-popup-close');
                let scrollParentElements: HTMLElement[] = this.popupObj.getScrollableParent(this.inputWrapper.container);
                for (let element of scrollParentElements) { EventHandler.add(element, 'scroll', this.scrollHandler, this); }
                if (Browser.isDevice && this.isFilterLayout()) {
                    EventHandler.add(this.list, 'scroll', this.listScroll, this);
                }
                attributes(this.targetElement(), { 'aria-expanded': 'true' });
                let inputParent: HTMLElement = this.isFiltering() ? this.filterInput.parentElement : this.inputWrapper.container;
                addClass([inputParent], [dropDownListClasses.inputFocus]);
                let animModel: AnimationModel = { name: 'FadeIn', duration: 100 };
                this.beforePopupOpen = true;
                let eventArgs: PopupEventArgs = { popup: this.popupObj, cancel: false, animation: animModel };
                this.trigger('open', eventArgs, (eventArgs: PopupEventArgs) => {
                    if (!eventArgs.cancel) {
                        addClass([this.inputWrapper.container], [dropDownListClasses.iconAnimation]);
                        this.popupObj.show(new Animation(eventArgs.animation), (this.zIndex === 1000) ? this.element : null);
                    }
                });
            }
        });
    }
    private checkCollision(popupEle: HTMLElement): void {
        if (!Browser.isDevice || (Browser.isDevice && !(this.getModuleName() === 'dropdownlist' || this.isDropDownClick))) {
            let collision: string[] = isCollide(popupEle);
            if (collision.length > 0) {
                popupEle.style.marginTop = -parseInt(getComputedStyle(popupEle).marginTop, 10) + 'px';
            }
        }
    }
    private getOffsetValue(popupEle: HTMLElement): number {
        let popupStyles: CSSStyleDeclaration = getComputedStyle(popupEle);
        let borderTop: number = parseInt(popupStyles.borderTop, 10);
        let borderBottom: number = parseInt(popupStyles.borderBottom, 10);
        return this.setPopupPosition(borderTop + borderBottom);
    }
    private createPopup(element: HTMLElement, offsetValue: number, left: number): void {
        this.popupObj = new Popup(element, {
            width: this.setWidth(), targetType: 'relative',
            relateTo: this.inputWrapper.container, collision: { X: 'flip', Y: 'flip' }, offsetY: offsetValue,
            enableRtl: this.enableRtl, offsetX: left, position: { X: 'left', Y: 'bottom' },
            zIndex: this.zIndex,
            close: () => {
                if (!this.isDocumentClick) {
                    this.focusDropDown();
                }
                let isResetItem: boolean = (this.getModuleName() === 'autocomplete') ? true : false;
                this.DropDownBaseresetBlazorTemplates(isResetItem, isResetItem, true, true, false, true, true);
                this.isNotSearchList = false;
                this.isDocumentClick = false;
                this.destroyPopup();
                let formElement: HTMLFormElement = closest(this.inputElement, 'form') as HTMLFormElement;
                if (this.isFiltering() && formElement && this.actionCompleteData.list && this.actionCompleteData.list[0]) {
                    this.isActive = true;
                    this.onActionComplete(this.actionCompleteData.ulElement, this.actionCompleteData.list, null, true);
                }
            },
            open: () => {
                EventHandler.add(document, 'mousedown', this.onDocumentClick, this);
                this.isPopupOpen = true;
                if (this.isFilterLayout()) {
                    removeClass([this.inputWrapper.container], [dropDownListClasses.inputFocus]);
                    this.isFilterFocus = true;
                    this.filterInput.focus();
                    if (this.inputWrapper.clearButton) {
                        addClass([this.inputWrapper.clearButton], dropDownListClasses.clearIconHide);
                    }
                }
                this.activeStateChange();
            }
        });
    }

    private isEmptyList(): boolean {
        return !isNullOrUndefined(this.liCollections) && this.liCollections.length === 0;
    }

    protected getFocusElement(): void {
        // combo-box used this method
    }

    private isFilterLayout(): boolean {
        return this.getModuleName() === 'dropdownlist' && this.allowFiltering;
    }

    private scrollHandler(): void {
        if (Browser.isDevice && ((this.getModuleName() === 'dropdownlist' &&
            !this.isFilterLayout()) || (this.getModuleName() === 'combobox' && !this.allowFiltering && this.isDropDownClick))) {
            this.hidePopup();
        }
    }

    private setSearchBoxPosition(): void {
        let searchBoxHeight: number = this.filterInput.parentElement.getBoundingClientRect().height;
        this.popupObj.element.style.maxHeight = '100%';
        this.popupObj.element.style.width = '100%';
        this.list.style.maxHeight = (window.innerHeight - searchBoxHeight) + 'px';
        this.list.style.height = (window.innerHeight - searchBoxHeight) + 'px';
        let clearElement: Element = this.filterInput.parentElement.querySelector('.' + dropDownListClasses.clearIcon);
        detach(this.filterInput);
        clearElement.parentElement.insertBefore(this.filterInput, clearElement);
    }

    private setPopupPosition(border?: number): number {
        let offsetValue: number;
        let popupOffset: number = border;
        let selectedLI: HTMLElement = <HTMLElement>this.list.querySelector('.' + dropDownListClasses.focus) || this.selectedLI;
        let firstItem: HTMLElement = this.isEmptyList() ? this.list : this.liCollections[0];
        let lastItem: HTMLElement = this.isEmptyList() ? this.list : this.liCollections[this.getItems().length - 1];
        let liHeight: number = firstItem.getBoundingClientRect().height;
        let listHeight: number = this.list.offsetHeight / 2;
        let height: number = isNullOrUndefined(selectedLI) ? firstItem.offsetTop : selectedLI.offsetTop;
        let lastItemOffsetValue: number = lastItem.offsetTop;
        if (lastItemOffsetValue - listHeight < height && !isNullOrUndefined(this.liCollections) &&
            this.liCollections.length > 0 && !isNullOrUndefined(selectedLI)) {
            let count: number = this.list.offsetHeight / liHeight;
            let paddingBottom: number = parseInt(getComputedStyle(this.list).paddingBottom, 10);
            offsetValue = (count - (this.liCollections.length - this.activeIndex)) * liHeight - popupOffset + paddingBottom;
            this.list.scrollTop = selectedLI.offsetTop;
        } else if (height > listHeight) {
            offsetValue = listHeight - liHeight / 2;
            this.list.scrollTop = height - listHeight + liHeight / 2;
        } else {
            offsetValue = height;
        }
        let inputHeight: number = this.inputWrapper.container.offsetHeight;
        offsetValue = offsetValue + liHeight + popupOffset - ((liHeight - inputHeight) / 2);
        return -offsetValue;
    }

    private setWidth(): string {
        let width: string = formatUnit(this.popupWidth);
        if (width.indexOf('%') > -1) {
            let inputWidth: number = this.inputWrapper.container.offsetWidth * parseFloat(width) / 100;
            width = inputWidth.toString() + 'px';
        }
        if (Browser.isDevice && (!this.allowFiltering && (this.getModuleName() === 'dropdownlist' ||
            (this.isDropDownClick && this.getModuleName() === 'combobox')))) {
            let firstItem: HTMLElement = this.isEmptyList() ? this.list : this.liCollections[0];
            width = (parseInt(width, 10) + (parseInt(getComputedStyle(firstItem).textIndent, 10) -
                parseInt(getComputedStyle(this.inputElement).paddingLeft, 10) +
                parseInt(getComputedStyle(this.inputElement.parentElement).borderLeftWidth, 10)) * 2) + 'px';
        }
        return width;
    }

    private scrollBottom(isInitial?: boolean): void {
        if (!isNullOrUndefined(this.selectedLI)) {
            let currentOffset: number = this.list.offsetHeight;
            let nextBottom: number = this.selectedLI.offsetTop + this.selectedLI.offsetHeight - this.list.scrollTop;
            let nextOffset: number = this.list.scrollTop + nextBottom - currentOffset;
            nextOffset = isInitial ? nextOffset + parseInt(getComputedStyle(this.list).paddingTop, 10) * 2 : nextOffset;
            let boxRange: number = this.selectedLI.offsetTop + this.selectedLI.offsetHeight - this.list.scrollTop;
            boxRange = this.fields.groupBy && !isNullOrUndefined(this.fixedHeaderElement) ?
                boxRange - this.fixedHeaderElement.offsetHeight : boxRange;
            if (this.activeIndex === 0) {
                this.list.scrollTop = 0;
            } else if (nextBottom > currentOffset || !(boxRange > 0 && this.list.offsetHeight > boxRange)) {
                this.list.scrollTop = nextOffset;
            }
        }
    }

    private scrollTop(): void {
        if (!isNullOrUndefined(this.selectedLI)) {
            let nextOffset: number = this.selectedLI.offsetTop - this.list.scrollTop;
            let nextBottom: number = this.selectedLI.offsetTop + this.selectedLI.offsetHeight - this.list.scrollTop;
            nextOffset = this.fields.groupBy && !isNullOrUndefined(this.fixedHeaderElement) ?
                nextOffset - this.fixedHeaderElement.offsetHeight : nextOffset;
            let boxRange: number = (this.selectedLI.offsetTop + this.selectedLI.offsetHeight - this.list.scrollTop);
            if (this.activeIndex === 0) {
                this.list.scrollTop = 0;
            } else if (nextOffset < 0) {
                this.list.scrollTop = this.list.scrollTop + nextOffset;
            } else if (!(boxRange > 0 && this.list.offsetHeight > boxRange)) {
                this.list.scrollTop = this.selectedLI.offsetTop - (this.fields.groupBy && !isNullOrUndefined(this.fixedHeaderElement) ?
                    this.fixedHeaderElement.offsetHeight : 0);
            }
        }
    }
    protected isEditTextBox(): boolean {
        return false;
    }

    protected isFiltering(): boolean {
        return this.allowFiltering;
    }

    protected isPopupButton(): boolean {
        return true;
    }

    protected setScrollPosition(e?: KeyboardEventArgs): void {
        if (!isNullOrUndefined(e)) {
            switch (e.action) {
                case 'pageDown':
                case 'down':
                case 'end':
                    this.scrollBottom();
                    break;
                default:
                    this.scrollTop();
                    break;
            }
        } else {
            this.scrollBottom(true);
        }
    }

    private clearText(): void {
        this.filterInput.value = '';
        this.searchLists(null);
    }

    private listScroll(): void {
        this.filterInput.blur();
    }

    private closePopup(delay?: number): void {
        this.isTyped = false;
        if (!(this.popupObj && document.body.contains(this.popupObj.element) && this.beforePopupOpen)) {
            return;
        }
        EventHandler.remove(document, 'mousedown', this.onDocumentClick);
        this.isActive = false;
        this.filterInputObj = null;
        this.isDropDownClick = false;
        this.preventAutoFill = false;
        let scrollableParentElements: HTMLElement[] = this.popupObj.getScrollableParent(this.inputWrapper.container);
        for (let element of scrollableParentElements) {
            EventHandler.remove(element, 'scroll', this.scrollHandler);
        }
        if (Browser.isDevice && this.isFilterLayout()) {
            removeClass([document.body, this.popupObj.element], dropDownListClasses.popupFullScreen);
            EventHandler.remove(this.list, 'scroll', this.listScroll);
        }
        if (this.isFilterLayout()) {
            if (!Browser.isDevice) {
                this.searchKeyModule.destroy();
                if (this.clearIconElement) { EventHandler.remove(this.clearIconElement, 'click', this.clearText); }
            }
            if (this.backIconElement) {
                EventHandler.remove(this.backIconElement, 'click', this.clickOnBackIcon);
                EventHandler.remove(this.clearIconElement, 'click', this.clearText);
            }
            EventHandler.remove(this.filterInput, 'input', this.onInput);
            EventHandler.remove(this.filterInput, 'keyup', this.onFilterUp);
            EventHandler.remove(this.filterInput, 'keydown', this.onFilterDown);
            EventHandler.remove(this.filterInput, 'blur', this.onBlur);
            this.filterInput = null;
        }
        attributes(this.targetElement(), { 'aria-expanded': 'false', 'aria-activedescendant': null });
        this.inputWrapper.container.classList.remove(dropDownListClasses.iconAnimation);
        if (this.isFiltering()) {
            this.actionCompleteData.isUpdated = false;
        }
        this.beforePopupOpen = false;
        let animModel: AnimationModel = {
            name: 'FadeOut',
            duration: 100,
            delay: delay ? delay : 0
        };
        let eventArgs: PopupEventArgs = { popup: this.popupObj, cancel: false, animation: animModel };
        this.trigger('close', eventArgs, (eventArgs: PopupEventArgs) => {
            if (!eventArgs.cancel) {
                if (this.getModuleName() === 'autocomplete') {
                    this.rippleFun();
                }
                if (this.isPopupOpen) {
                    this.popupObj.hide(new Animation(eventArgs.animation));
                } else {
                    this.destroyPopup();
                }
            }
        });
    }

    private destroyPopup(): void {
        this.isPopupOpen = false;
        this.isFilterFocus = false;
        this.popupObj.destroy();
        detach(this.popupObj.element);
    }

    private clickOnBackIcon(): void {
        this.hidePopup();
        this.focusIn();
    }
    /**
     * To Initialize the control rendering
     * @private
     */
    public render(): void {
        if (this.element.tagName === 'INPUT') {
            this.inputElement = this.element as HTMLInputElement;
            if (isNullOrUndefined(this.inputElement.getAttribute('role'))) {
                this.inputElement.setAttribute('role', 'textbox');
            }
            if (isNullOrUndefined(this.inputElement.getAttribute('type'))) {
                this.inputElement.setAttribute('type', 'text');
            }
        } else {
            this.inputElement = this.createElement('input', { attrs: { role: 'textbox', type: 'text' }}) as HTMLInputElement;
            if (this.element.tagName !== this.getNgDirective()) {
                this.element.style.display = 'none';
            }
            this.element.parentElement.insertBefore(this.inputElement, this.element);
            this.preventTabIndex(this.inputElement);
        }
        this.inputWrapper = Input.createInput(
            {
                element: <HTMLInputElement>this.inputElement,
                buttons: this.isPopupButton() ? [dropDownListClasses.icon] : null,
                floatLabelType: this.floatLabelType,
                properties: {
                    readonly: this.getModuleName() === 'dropdownlist' ? true : this.readonly,
                    placeholder: this.placeholder,
                    cssClass: this.cssClass,
                    enabled: this.enabled,
                    enableRtl: this.enableRtl,
                    showClearButton: this.showClearButton
                },
            },
            this.createElement
        );
        if (this.element.tagName === this.getNgDirective()) {
            this.element.appendChild(this.inputWrapper.container);
        } else {
            this.inputElement.parentElement.insertBefore(this.element, this.inputElement);
        }
        this.hiddenElement = this.createElement('select', {
            attrs: { 'aria-hidden': 'true', 'tabindex': '-1', 'class': dropDownListClasses.hiddenElement }
        }) as HTMLSelectElement;
        prepend([this.hiddenElement], this.inputWrapper.container);
        this.validationAttribute(this.element, this.hiddenElement);
        this.setFields();
        this.inputWrapper.container.style.width = formatUnit(this.width);
        this.inputWrapper.container.classList.add('e-ddl');
        this.wireEvent();
        this.tabIndex = this.element.hasAttribute('tabindex') ? this.element.getAttribute('tabindex') : '0';
        this.element.removeAttribute('tabindex');
        let id: string = this.element.getAttribute('id') ? this.element.getAttribute('id') : getUniqueID('ej2_dropdownlist');
        this.element.id = id;
        this.hiddenElement.id = id + '_hidden';
        this.targetElement().setAttribute('tabindex', this.tabIndex);
        attributes(this.targetElement(), this.getAriaAttributes());
        this.updateDataAttribute(this.htmlAttributes);
        this.setHTMLAttributes();
        if (this.value !== null || this.activeIndex !== null || this.text !== null) {
            this.initValue();
        } else if (this.element.tagName === 'SELECT' && (<HTMLSelectElement>this.element).options[0]) {
            let selectElement: HTMLSelectElement = <HTMLSelectElement>this.element;
            this.value = selectElement.options[selectElement.selectedIndex].value;
            this.text = isNullOrUndefined(this.value) ? null : selectElement.options[selectElement.selectedIndex].textContent;
            this.initValue();
        }
        this.preventTabIndex(this.element);
        if (!this.enabled) {
            this.targetElement().tabIndex = -1;
        }
        this.initial = false;
        this.element.style.opacity = '';
        this.inputElement.onselect = (e: UIEvent) => { e.stopImmediatePropagation(); };
        this.inputElement.onchange = (e: UIEvent) => { e.stopImmediatePropagation(); };
        if (this.element.hasAttribute('autofocus')) {
            this.focusIn();
        }
        if (!isNullOrUndefined(this.text)) {
            this.inputElement.setAttribute('value', this.text);
        }
        this.renderComplete();
    };

    private setFooterTemplate(popupEle: HTMLElement): void {
        let compiledString: Function;
        if (this.footer) {
            this.footer.innerHTML = '';
        } else {
            this.footer = this.createElement('div');
            addClass([this.footer], dropDownListClasses.footer);
        }
        compiledString = compile(this.footerTemplate);
        for (let item of compiledString({}, null, null, this.footerTemplateId, this.isStringTemplate)) {
            this.footer.appendChild(item);
        }
        this.DropDownBaseupdateBlazorTemplates(false, false, false, false, false, false, true);
        append([this.footer], popupEle);
    }

    private setHeaderTemplate(popupEle: HTMLElement): void {
        let compiledString: Function;
        if (this.header) {
            this.header.innerHTML = '';
        } else {
            this.header = this.createElement('div');
            addClass([this.header], dropDownListClasses.header);
        }
        compiledString = compile(this.headerTemplate);
        for (let item of compiledString({}, null, null, this.headerTemplateId, this.isStringTemplate)) {
            this.header.appendChild(item);
        }
        this.DropDownBaseupdateBlazorTemplates(false, false, false, false, false, true, false);
        let contentEle: Element = popupEle.querySelector('div.e-content');
        popupEle.insertBefore(this.header, contentEle);
    }

    protected setOldText(text: string): void {
        this.text = text;
    }

    protected setOldValue(value: string | number | boolean): void {
        this.value = value;
    }

    protected refreshPopup(): void {
        if (!isNullOrUndefined(this.popupObj) && document.body.contains(this.popupObj.element) &&
            ((this.allowFiltering && !(Browser.isDevice && this.isFilterLayout())) || this.getModuleName() === 'autocomplete')) {
            removeClass([this.popupObj.element], 'e-popup-close');
            this.popupObj.refreshPosition(this.inputWrapper.container);
        }
    }
    private checkDatasource(newProp?: DropDownListModel): void {
        if (newProp.dataSource && !isNullOrUndefined(Object.keys(newProp.dataSource)) && this.itemTemplate && this.allowFiltering) {
            this.list = null;
            this.actionCompleteData = { ulElement: null, list: null, isUpdated: false };
        }
    }
    protected updateDataSource(props?: DropDownListModel): void {
        if (this.inputElement.value !== '' || (!isNullOrUndefined(props) && (isNullOrUndefined(props.dataSource)
        || (!(props.dataSource instanceof DataManager) && props.dataSource.length === 0)))) {
             this.clear(null, props);
            }
        if (!(!isNullOrUndefined(props) && (isNullOrUndefined(props.dataSource)
            || (!(props.dataSource instanceof DataManager) && props.dataSource.length === 0)))) {
            this.resetList(this.dataSource);
        }
        if (!this.isCustomFilter && !this.isFilterFocus && document.activeElement !== this.filterInput) {
            this.checkCustomValue();
        }
    }
    protected checkCustomValue(): void {
        this.itemData = this.getDataByValue(this.value);
        let dataItem: { [key: string]: string } = this.getItemData();
        this.setProperties({ 'value': dataItem.value, 'text': dataItem.text });
    }
    private updateInputFields(): void {
        if (this.getModuleName() === 'dropdownlist') {
            Input.setValue(this.text, this.inputElement, this.floatLabelType, this.showClearButton);
        }
    }
    /**
     * Dynamically change the value of properties.
     * @private
     */
    public onPropertyChanged(newProp: DropDownListModel, oldProp: DropDownListModel): void {
        if (this.getModuleName() === 'dropdownlist') {
            this.checkDatasource(newProp);
            this.setUpdateInitial(['fields', 'query', 'dataSource'], newProp as { [key: string]: string; });
        }
        for (let prop of Object.keys(newProp)) {
            switch (prop) {
                case 'query':
                case 'dataSource':
                    break;
                case 'htmlAttributes': this.setHTMLAttributes();
                    break;
                case 'width': setStyleAttribute(this.inputWrapper.container, { 'width': formatUnit(newProp.width) }); break;
                case 'placeholder': Input.setPlaceholder(newProp.placeholder, this.inputElement as HTMLInputElement); break;
                case 'filterBarPlaceholder':
                    if (this.filterInput) { Input.setPlaceholder(newProp.filterBarPlaceholder, this.filterInput as HTMLInputElement); }
                    break;
                case 'readonly':
                    if (this.getModuleName() !== 'dropdownlist') {
                        Input.setReadonly(newProp.readonly, this.inputElement as HTMLInputElement); }
                    break;
                case 'cssClass': this.setCssClass(newProp, oldProp); break;
                case 'enableRtl': this.setEnableRtl(); break;
                case 'enabled': this.setEnable(); break;
                case 'text': if (newProp.text === null) { this.clear(); break; }
                    if (!this.list) {
                        if (this.dataSource instanceof DataManager) { this.initRemoteRender = true; }
                        this.renderList();
                    }
                    if (!this.initRemoteRender) {
                        let li: Element = this.getElementByText(newProp.text);
                        if (!this.checkValidLi(li)) {
                            if (this.liCollections && this.liCollections.length === 100 &&
                                this.getModuleName() === 'autocomplete' && this.listData.length > 100) {
                                this.setSelectionData(newProp.text, oldProp.text, 'text');
                            } else { this.setOldText(oldProp.text); }
                        }
                        this.updateInputFields();
                    }
                    break;
                case 'value': if (newProp.value === null) { this.clear(); break; }
                    this.notify('beforeValueChange', { newProp: newProp }); // gird component value type change
                    if (!this.list) {
                        if (this.dataSource instanceof DataManager) { this.initRemoteRender = true; }
                        this.renderList();
                    }
                    if (!this.initRemoteRender) {
                        let item: Element = this.getElementByValue(newProp.value);
                        if (!this.checkValidLi(item)) {
                            if (this.liCollections && this.liCollections.length === 100 &&
                                this.getModuleName() === 'autocomplete' && this.listData.length > 100) {
                                this.setSelectionData(newProp.value, oldProp.value, 'value');
                            } else { this.setOldValue(oldProp.value); }
                        }
                        this.updateInputFields();
                    }
                    break;
                case 'index': if (newProp.index === null) { this.clear(); break; }
                    if (!this.list) {
                        if (this.dataSource instanceof DataManager) { this.initRemoteRender = true; }
                        this.renderList();
                    }
                    if (!this.initRemoteRender) {
                        let element: Element = this.liCollections[newProp.index] as Element;
                        if (!this.checkValidLi(element)) {
                            if (this.liCollections && this.liCollections.length === 100 &&
                                this.getModuleName() === 'autocomplete' && this.listData.length > 100) {
                                this.setSelectionData(newProp.index, oldProp.index, 'index');
                            } else { this.index = oldProp.index; }
                        }
                        this.updateInputFields();
                    }
                    break;
                case 'footerTemplate': if (this.popupObj) { this.setFooterTemplate(this.popupObj.element); } break;
                case 'headerTemplate': if (this.popupObj) { this.setHeaderTemplate(this.popupObj.element); } break;
                case 'valueTemplate':
                    if (!isNullOrUndefined(this.itemData) && this.valueTemplate != null) { this.setValueTemplate(); } break;
                case 'allowFiltering':
                    if (this.allowFiltering) {
                        this.actionCompleteData = { ulElement: this.ulElement,
                        list: this.listData as { [key: string]: Object }[], isUpdated: true }; }
                    break;
                case 'floatLabelType':
                    Input.removeFloating(this.inputWrapper);
                    Input.addFloating(this.inputElement, newProp.floatLabelType, this.placeholder, this.createElement);
                    break;
                case 'showClearButton':
                    Input.setClearButton(newProp.showClearButton, this.inputElement, this.inputWrapper, null, this.createElement);
                    this.bindClearEvent();
                    break;
                default:
                    let ddlProps: { [key: string]: Object };
                    ddlProps = this.getPropObject(prop, <{ [key: string]: string; }>newProp, <{ [key: string]: string; }>oldProp);
                    super.onPropertyChanged(ddlProps.newProperty, ddlProps.oldProperty);
                    break;
            }
        }
    }

    private checkValidLi(element: Element): boolean {
        if (this.isValidLI(element)) {
            this.setSelection(element, null);
            return true;
        }
        return false;
    }

    private setSelectionData(
        newProp: number | string | boolean,
        oldProp: number | string | boolean,
        prop: string,
    ): void {
        let li: Element;
        this.updateListValues = (): void => {
            if (prop === 'text') {
                li = this.getElementByText(newProp as string);
                if (!this.checkValidLi(li)) {
                    this.setOldText(oldProp as string);
                }
            } else if (prop === 'value') {
                li = this.getElementByValue(newProp);
                if (!this.checkValidLi(li)) {
                    this.setOldValue(oldProp);
                }
            } else if (prop === 'index') {
                li = this.liCollections[newProp as number] as Element;
                if (!this.checkValidLi(li)) {
                    this.index = oldProp as number;
                }
            }
        };
    }

    private setCssClass(newProp: DropDownListModel, oldProp: DropDownListModel): void {
        this.inputWrapper.container.classList.remove(oldProp.cssClass);
        Input.setCssClass(newProp.cssClass, [this.inputWrapper.container]);
        if (this.popupObj) {
            this.popupObj.element.classList.remove(oldProp.cssClass);
            this.popupObj.element.classList.add(newProp.cssClass);
        }
    }
    /**
     * Return the module name.
     * @private
     */
    public getModuleName(): string {
        return 'dropdownlist';
    }
    /**
     * Opens the popup that displays the list of items.
     * @returns void.
     */
    public showPopup(): void {
        if (!this.enabled) {
            return;
        }
        if (this.beforePopupOpen) {
            this.refreshPopup();
            return;
        }
        this.beforePopupOpen = true;
        if (this.isFiltering() && !this.isActive && this.actionCompleteData.list && this.actionCompleteData.list[0]) {
            this.isActive = true;
            this.onActionComplete(this.actionCompleteData.ulElement, this.actionCompleteData.list, null, true);
        } else if (isNullOrUndefined(this.list) || !isUndefined(this.list) && this.list.classList.contains(dropDownBaseClasses.noData)) {
            this.renderList();
        }
        if (Browser.isDevice && this.isFilterLayout()) {
            let proxy: this = this;
            window.onpopstate = () => {
                proxy.hidePopup();
            };
            history.pushState({}, '');
        }

        if (!isNullOrUndefined(this.list.children[0]) || this.list.classList.contains(dropDownBaseClasses.noData)) {
            this.renderPopup();
        }
        attributes(this.targetElement(), { 'aria-activedescendant': this.selectedLI ? this.selectedLI.id : null });
    }
    /**
     * Hides the popup if it is in an open state.
     * @returns void.
     */
    public hidePopup(): void {
        let isHeader: boolean = (this.headerTemplate) ? true : false;
        let isFooter: boolean = (this.headerTemplate) ? true : false;
        this.DropDownBaseresetBlazorTemplates(false, false, false, false, false, isHeader, isFooter);
        if (this.isEscapeKey && this.getModuleName() === 'dropdownlist') {
            Input.setValue(this.text, this.inputElement, this.floatLabelType, this.showClearButton);
            this.isEscapeKey = false;
            if (!isNullOrUndefined(this.index)) {
                this.selectedLI = this.liCollections[this.index];
                this.updateSelectedItem(this.selectedLI, null, true);
                if (this.valueTemplate && this.itemData !== null) {
                    this.setValueTemplate();
                }
            } else {
                this.resetSelection();
            }
        }
        this.closePopup();
        let dataItem: { [key: string]: string } = this.getItemData();
        if (this.inputElement.value.trim() === '' && !this.isInteracted && (this.isSelectCustom ||
            !isNullOrUndefined(this.selectedLI) && this.inputElement.value !== dataItem.text)) {
            this.isSelectCustom = false;
            this.clear();
        }
    }
    /**
     * Sets the focus on the component for interaction.
     * @returns void.
     */
    public focusIn(e?: FocusEvent | MouseEvent | KeyboardEvent | TouchEvent): void {
        if (!this.enabled) {
            return;
        }
        if (this.targetElement().classList.contains(dropDownListClasses.disable)) { return; }
        let isFocused: boolean = false;
        if (this.preventFocus && Browser.isDevice) {
            this.inputWrapper.container.tabIndex = 1;
            this.inputWrapper.container.focus();
            this.preventFocus = false;
            isFocused = true;
        }
        if (!isFocused) {
            this.targetElement().focus();
        }
        addClass([this.inputWrapper.container], [dropDownListClasses.inputFocus]);
        this.onFocus(e);
    }
    /**
     * Moves the focus from the component if the component is already focused. 
     * @returns void.
     */
    public focusOut(): void {
        if (!this.enabled) {
            return;
        }
        this.isTyped = true;
        this.hidePopup();
        this.targetElement().blur();
        removeClass([this.inputWrapper.container], [dropDownListClasses.inputFocus]);
    }
    /**
     * Removes the component from the DOM and detaches all its related event handlers. Also it removes the attributes and classes.
     * @method destroy
     * @return {void}.
     */
    public destroy(): void {
        this.isActive = false;
        this.hidePopup();
        this.unWireEvent();
        if (this.list) { this.unWireListEvents(); }
        if (this.element && !this.element.classList.contains('e-' + this.getModuleName())) {
            return;
        }
        let attrArray: string[] = ['readonly', 'aria-disabled', 'aria-placeholder',
            'placeholder', 'aria-owns', 'aria-labelledby', 'aria-haspopup', 'aria-expanded',
            'aria-activedescendant', 'autocomplete', 'aria-readonly', 'autocorrect',
            'autocapitalize', 'spellcheck', 'aria-autocomplete'];
        attrArray.forEach((value: string): void => {
            this.inputElement.removeAttribute(value);
        });
        this.inputElement.setAttribute('tabindex', this.tabIndex);
        this.inputElement.classList.remove('e-input');
        Input.setValue('', this.inputElement, this.floatLabelType, this.showClearButton);
        this.element.style.display = 'block';
        if (this.inputWrapper.container.parentElement.tagName === this.getNgDirective()) {
            detach(this.inputWrapper.container);
        } else {
            this.inputWrapper.container.parentElement.insertBefore(this.element, this.inputWrapper.container);
            detach(this.inputWrapper.container);
        }
        super.destroy();
    };
    /**
     * Gets all the list items bound on this component.
     * @returns Element[].
     */
    public getItems(): Element[] {
        if (!this.list) {
            if (this.dataSource instanceof DataManager) { this.initRemoteRender = true; }
            this.renderList();
        }
        return this.ulElement ? super.getItems() : [];
    }
}
export interface DropDownListClassList {
    root: string;
    hover: string;
    selected: string;
    rtl: string;
    base: string;
    disable: string;
    input: string;
    inputFocus: string;
    li: string;
    icon: string;
    iconAnimation: string;
    value: string;
    focus: string;
    device: string;
    backIcon: string;
    filterBarClearIcon: string;
    filterInput: string;
    filterParent: string;
    mobileFilter: string;
    footer: string;
    header: string;
    clearIcon: string;
    clearIconHide: string;
    popupFullScreen: string;
    disableIcon: string;
    hiddenElement: string;
}
interface ActionCompleteData {
    ulElement?: HTMLElement;
    list?: { [key: string]: Object }[];
    isUpdated: boolean;
}
