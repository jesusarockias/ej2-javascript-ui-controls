# Changelog

## [Unreleased]

## 17.2.49 (2019-09-04)

### MultiSelect

#### Bug Fixes

- `#245849` - Issue with "Dropdown popup moves down while initial value selection on popup" has been resolved.

## 17.2.46 (2019-08-22)

### ListBox

#### New Features

- `#237694` - provided maximum selection limit option for ListBox.

## 17.2.41 (2019-08-14)

### MultiSelect

#### Bug Fixes

- `#144756`- Issue with "custom value added to the list after args.cancel is set to true in custom value section event" has been resolved.

## 17.2.40 (2019-08-06)

### MultiSelect

#### Bug Fixes

- `#242599` - Now, filtering work properly when enabling the custom value property.

### ComboBox

#### New Features

- `#F146233` - Now, you can specify type of filter using `filterType` property.

### DropDownList

#### New Features

- `#F146233` - Now, you can specify type of filter using `filterType` property.

### MultiSelect

#### New Features

- `#F146233` - Now, you can specify type of filter using `filterType` property.

## 17.2.39 (2019-07-30)

### ListBox

#### Bug Fixes

- `#240597` - Dual ListBox causes an error when filtering is activated and disable the checkbox selection settings issue is fixed.

- `#240594` - Form submit occurs while click toolbar item issue is fixed.

## 17.2.36 (2019-07-24)

### MultiSelect

#### Bug Fixes

- `#241578` - Issue with “Checkbox selection is not updated properly in the popup list items when set filtering as false” has been resolved.

### AutoComplete

#### Bug Fixes

- `#F146110` - Now, Resolved the console error thrown when first character is type using `MinLength` property.

### DropDownList

#### Bug Fixes

- `#F146110` - Now, Resolved the console error thrown when first character is type using `MinLength` property.

## 17.2.34 (2019-07-11)

### ComboBox

#### Bug Fixes

- `#233488`, `#239802` - Issue with "throws error while set the field value as null" has been resolved.

### MultiSelect

#### Bug Fixes

- `#226512` - Now, SelectAll checkbox shows when more than one items present in the filtered list.

### DropDownList

#### Bug Fixes

- `#239351` - Now, Select event triggers when selecting the value through interaction.

- `#F145367` - Issue with "filtering is not working with item template" has been resolved.

### ListBox

#### Bug Fixes

- `#240594` - Form submit occurs while click toolbar item issue is fixed.

## 17.2.28-beta (2019-06-27)

### ListBox

#### New Features

- Checkbox position support provided.
- Filter support provided.
- #234507 - Provided support for drag and dropping the single list item when more than one list item is selected by setting `false` to `dragSelected` argument in `dragStart` event.

#### Bug Fixes

- #236715 - Drag and dropping the list item is not sorted when `sortOrder` enabled issue is fixed.

#### Breaking Changes

- Event `select` is removed instead `change` event is provided.

### DropDownList

#### Bug Fixes

- #235631 - Issue with "updating default value after form reset" has been resolved.

- #239136 - Now, you can change `allowFiltering` property value dynamically.

### MultiSelect

#### Bug Fixes

- #235699 - Change event not happening after the control has lost focus issue has been fixed.

#### New Features

- `#F142089`, `#225476`, `#231094`, `#234377` - Now, you can render grouping with checkbox using enableGroupCheckBox property.

## 17.1.49 (2019-05-29)

### MultiSelect

#### New Features

- #236816 - Provided method for `focusIn` and `focusOut`.

#### Bug Fixes

- #231920 - In IE browser, script error throws when calling getItems method has been fixed.

## 17.1.48 (2019-05-21)

### ListBox

#### New Features

- Provided change event for ListBox.

## 17.1.44 (2019-05-07)

### MultiSelect

#### Bug Fixes

- #235167 - Multiselect dropdown jump down when the `showDropDownIcon` is set to true issue has been resolved.

- #209393 - Change event not fired during tab key navigation issue has been resolved.

### DropDownList

#### Bug Fixes

- #234846 - The popup collision issue has been resolved while enable the filtering.

## 17.1.43 (2019-04-30)

### ComboBox

#### Bug Fixes

- #233483 - The List not generated properly while clear the value using clear button issue has been resolved.

- #234100 - The search not working on enabling read only in the control initialization issue has been resolved.

- #233137 - The combobox is not focused when click the tab key at single time issue has been resolved.

### DropDownList

#### Bug Fixes

- #231680 - The data source is observable using Async Pipe with pre select value not updated issue has been resolved.

- #230651 - Eval function security issue has been resolved.

## 17.1.42 (2019-04-23)

### MultiSelect

#### Bug Fixes

- #232673 - Issue with prevent the first value when clear value using clear button has been fixed.

- #233432 - The group template text not updated while enable the allow filtering issue has been fixed.

## 17.1.41 (2019-04-16)

### MultiSelect

#### Bug Fixes

- #232673 - Issue with browser freeze when clear value using clear button has been fixed.

- #231997 - Issue with duplicate placeholder on multiselect issue has been fixed.

- #232218 - The popup open downward when select the items after scroll the page issue has been resolved.

- #231920 - The Custom value with pre select value not updated when set empty data source issue has been resolved.

- F143612 - Dropdown icon disappeared when set the lengthy placeholder issue has been fixed.

### DropDownList

#### Bug Fixes

- #142944 - Item template not loaded, when change the datasource dynamically issue has been resolved.

### ComboBox

#### Bug Fixes

- #225254, #227938 - Template interpolated data not updated while filtering issue has been resolved.

## 17.1.40 (2019-04-09)

### ListBox

#### Bug Fixes

- Value property passed on form submit issue fixed.

### DropDownList

#### Bug Fixes

- Issue with value selection on disabled dropdown using incremental search has been fixed.

- Clear icon shown when change the value dynamically issue has been fixed.

### MultiSelect

#### Bug Fixes

- Placeholder is not updated properly when unselect all the value issue has been resolved.

## 17.1.38 (2019-03-29)

### ListBox

The ListBox is a graphical user interface component used to display a list of items. Users can select one or more items in the list using a checkbox or by keyboard selection. It supports sorting, grouping, reordering, and drag and drop of items. The available key features are:

- **Data binding**: Binds and accesses the list of items from local or server-side data source.

- **Dual ListBox**: Allows transferring and reordering the list item between two ListBoxes.

- **Drag and Drop**: Allows drag and drop the list item with the same/multiple ListBox.

- **Grouping**: Groups the logically related items under a single or specific category.

- **Templates**: Customizes the list items.

- **Sorting**: Sorts the list items in alphabetical order (either ascending or descending).

- **Accessibility**: Provided with built-in accessibility support that helps to access all the ListBox component features using the keyboard, screen readers, or other assistive technology devices.

### MultiSelect

#### Bug Fixes

- Placeholder is not updated properly when removed the value issue has been resolved.

## 17.1.32-beta (2019-03-13)

### DropDownList

#### Bug Fixes

- Issue with change event trigger multiple times when clear value using clear button has been fixed.

### MultiSelect

#### New Features

- Provided customized filtering support for checkbox mode also.

### AutoComplete

#### Bug Fixes

- Filtered value is not maintained while using model value issue has been resolved.

### ComboBox

#### Bug Fixes

- List's selection is not removed when remove a selected value using clear button issue has been resolved.

## 16.4.55 (2019-02-27)

### DropDownList

#### Bug Fixes

- Pre-select value is not selected when its not present in the list issue fixed.

- Reset text based initial value in form reset action behavior has been changed.

### AutoComplete

#### Bug Fixes

- Reset text based initial value in form reset action behavior has been changed.

### ComboBox

#### Bug Fixes

- Reset text based initial value in form reset action behavior has been changed.

### MultiSelect

#### Bug Fixes

- List selection throws exception while using quotes within string data issue has been resolved.

- Select all operation's performance issue has been resolved.

## 16.4.54 (2019-02-19)

### DropDownList

#### Bug Fixes

- When page scroll, grouping template is hiding issue has been resolved.

- Reset the initial value in form reset action behavior has been changed.

### AutoComplete

#### Bug Fixes

- Reset the initial value in form reset action behavior has been changed.

### ComboBox

#### Bug Fixes

- Reset the initial value in form reset action behavior has been changed.

### MultiSelect

#### Bug Fixes

- Now, you can enter special characters inside MultiSelect using virtual keyboard.

- Reset the initial value in form reset action behavior has been changed.

## 16.4.53 (2019-02-13)

### DropDownList

- ItemData parameter supports `object` collection in select and change event.

- Filtering is not working when rendered control by using select element issue has been resolved.

### MultiSelect

#### Bug Fixes

- Lengthy placeholder breaks UI issue has been resolved.

- Values are not cleared in mobile devices issue has been resolved.

- Values are not selected based on selected attribute in select element rendering issue has been resolved.

## 16.4.52 (2019-02-05)

### ComboBox

#### Bug Fixes

- The model value is not updated by selecting a value using tab key with autofill combination issue has been resolved.

### MultiSelect

#### Bug Fixes

- Blur event prevents other actions issue has been resolved.

## 16.4.48 (2019-01-22)

### AutoComplete

#### Bug Fixes

- Custom value is not maintain after reload the data issue has been resolved.

### MultiSelect

#### Bug Fixes

- `en-US` locale JSON file not generated issue has been resolved.

## 16.4.47 (2019-01-16)

### MultiSelect

#### Bug Fixes

- server side validation is not working issue has been resolved.

## 16.4.46 (2019-01-08)

### MultiSelect

#### Bug Fixes

- Value is updated in reverse while using select all option in checkbox selection issue has been resolved.

### ComboBox

#### Bug Fixes

- Change event is not trigger when focus out the control using tab key issue has been resolved.

## 16.4.44 (2018-12-24)

### MultiSelect

#### Bug Fixes

- Item template with checkbox combination is not working issue has been resolved.

- Value update with checkbox selection issue in reactive form has been resolved.

## 16.3.34 (2018-11-21)

### MultiSelect

#### Bug Fixes

- Checkbox's selection is not removed when uncheck the `selectAll` checkbox issue has been resolved.

## 16.3.33 (2018-11-20)

### DropDownList

#### Bug Fixes

- DropDownList locale added in `config Json` file.

## 16.3.32 (2018-11-13)

### DropDownList

#### Bug Fixes

- Data related attributes are added to input element instead of select element has been fixed.

- Console error thrown as maximum call stack when set the empty `dataSource` that issue has been fixed.

### MultiSelect

#### Bug Fixes

- Original event argument does not get in `selectedAll` event argument that issue has been fixed.

### ComboBox

#### Bug Fixes

- ComboBox `focus` event argument issue has been resolved.

## 16.3.29 (2018-10-31)

### MultiSelect

#### Bug Fixes

- MultiSelect filtering is shown incorrect result when using remote datasource issue has been resolved.

### AutoComplete

#### Bug Fixes

- AutoComplete `minLength` property is not perform when use custom filtering event has been resolved.

## 16.3.27 (2018-10-23)

### MultiSelect

#### Bug Fixes

- ngModel is not updated when select all value using SelectAll option has been fixed.

### DropDownList

#### Bug Fixes

- null exception handled in getItems method.

## 16.3.25 (2018-10-15)

### MultiSelect

#### Bug Fixes

- Duplicate values are listed while fetching data with UrlAdaptor when `allowCustom` value is set to true, that issue has been fixed.

### DropDownList

#### Bug Fixes

- DropDownList `valueTemplate` selected value is changed now, while changing data source.

### ComboBox

#### Bug Fixes

- ComboBox `readonly` enabled clear button is shown issue has been resolved.

## 16.3.23 (2018-10-03)

### MultiSelect

#### Bug Fixes

- MultiSelect values are cleared after performing add operation in Grid, that issue has been fixed.

- Item disappears from popup list after pressing the backspace key, that issue has been fixed.

### DropDownList

#### Bug Fixes

- DropDownList `ItemTemplate` with `addItem` method template issue has been resolved.

## 16.3.17 (2018-09-12)

### DropDownList

#### Bug Fixes

- Restricted multiple request when no data returned from server issue has been resolved.

### MultiSelect

#### Bug Fixes

- Change event is now triggered for MultiSelect components, when focused out.

#### Breaking Changes

- Renamed the `selectAll` event argument `IsChecked` to `isChecked`.
- Renamed the `selectAll` event argument `e` to `event`.

## 16.2.49 (2018-08-21)

### MultiSelect

#### Bug Fixes

- View encapsulation support given for checkbox selection.
- Cleared values are not added back to MultiSelect popup issue has been resolved.
- View encapsulation support given for spinner element.

### DropDownList

#### Bug Fixes

- View encapsulation support given for spinner element.

### ComboBox

#### Bug Fixes

- View encapsulation support given for spinner element.

## 16.2.48 (2018-08-14)

### MultiSelect

#### Bug Fixes

- Improved the MultiSelect performance in IE11 browser.

### DropDownList

#### Bug Fixes

- DropDownList `cssClass` updated dynamically changes issue has been resolved.
- create input method addition argument added.

### AutoComplete

#### Bug Fixes

- create input method addition argument added.

### ComboBox

#### Bug Fixes

- create input method addition argument added.

### MultiSelect

#### Bug Fixes

- create input method addition argument added.

## 16.2.47 (2018-08-07)

### DropDownList

#### Bug Fixes

- Provided view encapsulation support.

### MultiSelect

#### Bug Fixes

- Provided view encapsulation support.

### AutoComplete

#### Bug Fixes

- Provided view encapsulation support.

### ComboBox

#### Bug Fixes

- Provided view encapsulation support.

## 16.2.46 (2018-07-30)

### DropDownList

#### Bug Fixes

- We have provided public methods spinner show and hides.

### MultiSelect

#### Bug Fixes

- Pre-selected item disappears from popup list when removed selected items in clear button issue has been resolved.
- We have provided public methods spinner show and hides.

### AutoComplete

- We have provided public methods spinner show and hides.

### ComboBox

- ComboBox filtering update data method field argument issue has been resolved.
- We have provided public methods spinner show and hides.

## 16.2.45 (2018-07-17)

### DropDownList

#### Bug Fixes

- DropDownList same value selection, value not cleared issue has been resolved.
- DropDownList `scss` variable override issue has been resolved.

### MultiSelect

#### Bug Fixes

- Multiselect clear button issue has been resolved.
- Multiselect restore value not maintained in `IE` issue has been resolved.
- Multiselect popup not open when update a data via update data.

## 16.2.43 (2018-07-03)

### MultiSelect

#### Bug Fixes

- Multiselect pre selected value not updated issue has been resolved.

## 16.2.42 (2018-06-27)

### Multiselect

#### Bug Fixes

- Provided support for selected all event.
- Value is not selected when ending with space.

## 16.2.41 (2018-06-25)

### AutoComplete

#### Bug Fixes

- Html elements are shown during filtering when highlight property is set to true.

### DropDownList

#### Bug Fixes

- Provided support for before open event.

### ComboBox

#### Bug Fixes

- Popup items is not same as initially after filtering in combobox.

### MultiSelect

#### Bug Fixes

- Data is not repopulated when selecting and removing all items from Multiselect.
- Multiselect is not focused when tab key is pressed if it already focused in the filterbar.

## 16.1.46 (2018-05-29)

### MultiSelect

#### Bug Fixes

- Changed control height for MultiSelect component in Material theme to match other dropdown components.

## 16.1.45 (2018-05-23)

### MultiSelect

#### Bug Fixes

- Allow to set the value in MultiSelect when it is re-rendered.

## 16.1.42 (2018-05-15)

### AutoComplete

#### Bug Fixes

- The getDataByValue method is not working properly in Autocomplete's issue has been fixed.

### DropDownList

#### Bug Fixes

- Value property set through the model is now maintained, even after changing the data.
- Change event is now triggered for DropDown components, when `showClearButton` is clicked.

## 16.1.40 (2018-05-08)

### ComboBox

#### Bug Fixes

- Prevented the native HTML select and change events in angular.

### DropDownList

#### Bug Fixes

- Prevented the validation message from triggering on components initial render.
- Added support for HTML autofocus attribute in DropDown components.

### MultiSelect

#### Bug Fixes

- MultiSelect component's varying selection behaviour for keyboard and mouse event, has been fixed.

## 16.1.38 (2018-05-02)

### AutoComplete

#### Bug Fixes

- The issue, Value property in Autocomplete is not properly updated in two way binding after the initial load has been fixed.
- The issue, Autocomplete displays the suggestions list even if the focus is lost for related component, has been fixed.

### MultiSelect

#### Bug Fixes

- The issue, MultiSelect component is not updating the popup correctly during the initial time, has been fixed.

## 16.1.35 (2018-04-17)

### AutoComplete

#### Bug Fixes

- The issue, Value is not updated correctly when the words in the suggestion list contains white spaces has been fixed.

### MultiSelect

#### New Features

- Float Label support has been given for MultiSelect

#### Bug Fixes

- custom value support has been given in MultiSelect when the filtering is enabled instead of 'no records found' template.

- The issue, 'Input is rendered again  on typing while resetting value from null with remote data and custom value as true.' has been fixed.

- The issue, 'Enable persistence is not working properly when all the items in the list are selected.' has been fixed.

## 16.1.34 (2018-04-10)

### AutoComplete

#### Bug Fixes

- The issue, Value is not updated correctly when diacritics words are used in AutoComplete has been fixed.

## 16.1.33 (2018-04-03)

### MultiSelect

#### Bug Fixes

- Chip width is longer than the input wrapper when the custom longer text selected, issue has been fixed.

## 16.1.30 (2018-03-20)

### MultiSelect

#### Bug Fixes

- custom value maintained while disabled `closePopupOnSelect`, this issue has been fixed.

### DropDownList

#### Bug Fixes

- Dynamic value change support for `showClearButton`.

## 16.1.29 (2018-03-13)

### MultiSelect

#### Bug Fixes

- Change event not trigger while remove chip in keyboard, this issue has been fixed.

### AutoComplete

#### Bug Fixes

- Initial value not set while using remote data in autocomplete issue has been fixed.

## 16.1.28 (2018-03-09)

### MultiSelect

#### Bug Fixes

- Text property not working properly while selected text, this issue has been fixed.

### DropDownList

#### Bug Fixes

- Filtering with Template issue has been fixed in DropDownList and ComboBox.

### ComboBox

#### Bug Fixes

- Filtering with Template issue has been fixed in DropDownList and ComboBox.

## 16.1.24 (2018-02-22)

### AutoComplete

#### Breaking Changes

- Changed the filtering event argument types to `FilteringEventArgs`.

### Common

#### Breaking Changes

- Locale key changed from `dropdownlist` to `dropdowns`.

- Changed the fields property type as `FieldSettingsModel`.

- Changed the Angular component selector, component name prefix with `ejs` e.g : `ejs-dropdownlist`.

#### New Features

- Given in-built filtering support without using `filtering` event.

- Diacritics filtering works on enabling the `ignoreAccent`.

- Provided the `zIndex` property to set custom `zIndex` value.

- High contrast theme support.

### MultiSelect

#### New Features

- CheckBox support.

- Prevent the Popup open on component click while `openOnClick` property set as false.

- Provided `chipSelect` event for chip selection action.

#### Breaking Changes

- Pascal casing change to mode property values (`Default`, `Box`, `Delimiter`, `CheckBox`).

- Changed the `maximumSelectionLength` behaviour.

#### Bug Fixes

- Value preselect not working in remote data, this issue has been fixed.

### DropDownList

#### Bug Fixes

- Console error thrown while navigating the angular routing in DropDownList change event, this issue has been fixed.

## 15.4.27-preview (2018-01-30)

### DropDownList

#### Bug Fixes

- DropDownList value property gets as an object if selected value as 0, this issue has been fixed.

## 15.4.26-preview (2018-01-23)

### AutoComplete

#### Bug Fixes

- The Change event argument `isInteraction` is returned properly when clear button is clicked.

### DropDownList

#### Bug Fixes

- Clear button is not visible, this issue has been fixed.

- Angular reactive form resetting not worked in DropDownList component, this issue has been fixed.

### MultiSelect

#### Bug Fixes

- Popup does not open while component render with empty data source, this issue has been fixed.

## 15.4.24-preview (2018-01-10)

### MultiSelect

#### Breaking Changes

- Changed the default value of `hideSelectedItems` property as true.

#### Bug Fixes

- Custom value dose not allow while component render with empty data source, this issue has been fixed.

## 15.4.23-preview (2017-12-27)

### Common

#### New Features

- Added typing file for ES5 global scripts (`dist/global/index.d.ts`).

#### Breaking Changes

- Modified the module bundle file name for ES6 bundling.

### DropDownList

#### Bug Fixes

- Space key not allowed in DropDownList filtering, this issue has been fixed.

### MultiSelect

#### Bug Fixes

- Popup repositions not worked while scroll on the fixed element, this has been fixed.

### DropDownList

#### Bug Fixes

- Popup repositions not worked while scroll on the fixed element, this has been fixed.

### ComboBox

#### Bug Fixes

- Popup repositions not worked while scroll on the fixed element, this has been fixed.

### AutoComplete

#### Bug Fixes

- Popup repositions not worked while scroll on the fixed element, this has been fixed.

## 15.4.21-preview (2017-12-08)

### MultiSelect

#### Breaking Changes

- Home and End key behaviour changes.

### AutoComplete

#### Breaking Changes

- Home and End key behaviour changes.

### ComboBox

#### Breaking Changes

- Home and End key behaviour changes.

### MultiSelect

#### Bug Fixes

- Popup left and right collision issue fixed.

- MultiSelect custom value with template issue fixed.

## 15.4.20-preview (2017-12-01)

### Common

#### New Features

- Upgraded TypeScript version to 2.6.2.

### DropDownList

#### Bug Fixes

- DropDownList component value cleared while change the value through react setState method issue fixed.

- Empty string value not selected in DropDownList issue fixed.

## 15.4.19-preview (2017-11-23)

### AutoComplete

#### Bug Fixes

- When we Change the data source the value is empty issue fixed.

### DropDownList

#### Bug Fixes

- Expected is 'Object' instead of 'object' issue fixed.

## 15.4.17-preview (2017-11-13)

### MultiSelect

MultiSelect component contains a list of predefined values from which a multiple value can be chosen. The functionality of MultiSelect resembles the SELECT form element of HTML. The available key features are

- **Data binding** - Allows to bind and access the list of items from the local or server-side data source.

- **Grouping** - Supports grouping the logically related items under single or specific category.

- **Templates** - Allows customizing the list items, selected value, header, footer, category group header, and no records content.

- **Sorting** - Supports sorting of list items in an alphabetical order (either ascending or descending).

- **Filtering** - Allow filtering the list items based on a character typed in component.

- **Custom Value** - Allows user to select a new custom value.

- **Accessibility** - Provided with built-in accessibility support which helps to access all the MultiSelect component features through  the keyboard, screen readers, or other assistive technology devices.

### ComboBox

ComboBox component allows the user to type a value or choose an option from the list of predefined options. When an arrow icon accompanied with this component is pressed, the dropdown displays a list of values, from which the user can select one. The available key features are

- **Data binding** - Allows binding and accessing the list of items from local or server-side data source.

- **Custom values** - Allows setting user-defined values that is not in the popup list.

- **Grouping** - Supports grouping of logically related items under a single or specific category.

- **Sorting** - Supports sorting of list items in an alphabetical order (either ascending or descending).

- **Filtering** - Allows filtering of list items based on a character typed in the component.

- **Templates** - Allows customizing the list items, selected value, header, footer, category group header, and no records content.

- **Accessibility** - Provided with built-in accessibility support that helps to access all the ComboBox component features through the keyboard, screen readers, or other assistive technology devices.

### AutoComplete

AutoComplete component provides the matched suggestion list when type into the input, from which the user can select one. The available key features are

- **Data binding** - Allows binding and accessing the list of items from local or server-side data source.

- **Grouping** - Supports grouping of logically related items under a single or specific category.

- **Sorting** - Supports sorting of list items in an alphabetical order (either ascending or descending).

- **Highlight search** - Supports highlighting the typed text in the suggestion list.

- **Templates** - Allows customizing the list item, header, footer, category group header, no records and action failure content.

- **Accessibility** - Provided with built-in accessibility support that helps to access all the AutoComplete component features through keyboard, on-screen readers, or other assistive technology devices.

### DropDownList

DropDownList component contains a list of predefined values from which a single value can be chosen. The functionality of DropDownList resembles the SELECT form element of HTML. When an arrow icon accompanied with this component is pressed, the dropdown displays a list of values from which you can select one. The available key features are

- **Data binding** - Allows to bind and access the list of items from the local or server-side data source.

- **Grouping** - Supports grouping the logically related items under single or specific category.

- **Sorting** - Supports sorting of list items in an alphabetical order (either ascending or descending).

- **Filtering** - Allow filtering the list items based on a character typed onto the search box.

- **Templates** - Allows customizing the list items, selected value, header, footer, category group header, and no records content.

- **Accessibility** - Provided with built-in accessibility support which helps to access all the DropDownList component features through the keyboard, screen readers, or other assistive technology devices.
