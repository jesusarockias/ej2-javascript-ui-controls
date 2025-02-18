# Changelog

## [Unreleased]

## 17.2.49 (2019-09-04)

### Grid

#### Bug Fixes

- `#244574` - Grid scroller jumps on browser delay while using `virtualization` has been fixed.
- `#245739` - Filter dialog does not close properly when render grid inside the dialog has been fixed.
- `#244047` - Focus module destroyed completely from the content ready.
- `#223749`, `#241000` Provided the support to use `selectRow` method in `virtualized` Grid.
- `#244927` - `CurrrentPage` was not refreshed after changing the dropdown with its highest value.
- Select multi rows with checkbox wrong while set frozen column in grid component has been fixed.

## 17.2.47 (2019-08-27)

### Grid

#### Bug Fixes

- `#244231` - On key pressing of column chooser Search bar, empty Grid renders if all columns are unchecked, issue has been fixed.
- `#146166` - CheckBox column disappears after hiding other columns through `columnChooser` issue has been fixed.
- `#146777` - While locking the column dynamically, the Locked column is not moving to the first column position issue has been fixed.
- `#245747` - Validation message position is wrong for rows added in the bottom issue has been fixed.
- `#242519`,`#244186` - Misalignment issue in Frozen Column while editing Grid with edit template.
- `#243593` - Script error thrown when perform row drag and drop with expand child.
- `#242503` - On Saving the cell Footer Content `scrollLeft` is set to zero issue has been fixed.
- `#146553` - Command column was not working when dynamically added in `columnModel` is resolved.

## 17.2.41 (2019-08-14)

### Grid

#### Bug Fixes

- `#244183` - Provided the `cacheAdaptor` support in Grid.
- `#240141` - Resize not working properly when enabling row drag and drop feature has been fixed.
- `#243754` - Removed the `filterItemTemplate` from Grid persist data.
- `#244375` - Checkbox state was not refreshed while calling `openColumnChooser` has been fixed.
- `#234468` - Script error while refreshing the Grid with `foreignKeyColumn` in persistence enabled has been fixed.

## 17.2.40 (2019-08-06)

### Grid

#### Bug Fixes

- `#242503` - Add form gets misplaced in an empty grid with `frozenColumns`.
- `#242201` - Script error thrown while navigating to other page and come back to grid with filter settings.
- `#237984` - Need to show warning message if provided dataSource in incorrect format.
- `#242484` - Default value is not set for the stacked columns.

## 17.2.39 (2019-07-30)

### Grid

#### Bug Fixes

- `#240377` - Changing page size dynamically in batch edit mode will now prompt confirmation dialog before discarding the changes.
- `#240117` - Support to access column object in grid column template has been provided. Use `column` inside the template to access the respective column properties.
- `#242654` - Dynamically changing `ShowInColumnChooser` property now updated in the `columnMenu` too.

#### New Features

- Default filter operator support has been provided. Use `column.filter.operator` with any of the filter operators to set default operator for filtering.

## 17.2.36 (2019-07-24)

### Grid

#### Bug Fixes

- `#241299` - Misalignment is resolved when hiding a column in a `allowDragAndDrop` enabled Grid.
- `#237505` - Grouping expand and collapse rows are now working properly when `virtualization` enabled with `aggregates`.
- `#241020` - Grid initial filtering is now working fine while filtering the `foreignKey` enabled column.
- `#241150`,`#242157` - Script error while clicking inside the Grid edit form with hidden column has been fixed.
- `#238244` - Script error has been fixed in `IE` browser while continuously create and destroy the grid.
- `#240283` - Support to dynamically set true/false to the `allowDragAndDrop` has been provided.
- `#222746` - Last block of records are now working properly in grouping with `virtualization` feature.

#### New Features

- `#235428` - Support has been provided to enable or disable match case in `filterSettings`. Use `filterSettings.enableCaseSensitivity` to enable or disable match case.
- Provided `autoFit` property in column level to do initial auto-fitting operation.
- Provided `keyPressed` event support.

## 17.2.35 (2019-07-17)

### Grid

#### Bug Fixes

- `#238402` - Sort comparer is now working properly for `RemoteSaveAdaptor`;
- `#235736`, `#237229` - Provided responsive height support for `columnChooser` of `columnMenu`.
- `#234395` - Provided currency code while exporting to excel end `csv` documents.
- `#232623` - Comparer object is now properly working in custom `sortComparer` function while performing in descending order.
- `#240045` - `recordDoubleClick` event is now prevented while clicking on `groupcaption` row.
- `#239272` - `autoFitColumns` for column resizing is now calculated based on aggregates cell content too.
- `#241310` - Text wrap is now applying for movable headers too while refreshing the grid.
- `#234709` - Sorting order is now maintained in the column after undo operation of the grouped column.
- `#236350` - Script error has been resolved while destroying the grid with pager template.

## 17.2.34 (2019-07-11)

### Grid

#### Bug Fixes

- `#237403` -  Footer template shows proper result when using both group footer and footer template in exported excel document.
- `#232272` - `RemoteSaveAdaptor` batch changes are now refreshed properly in grid when `ContractResolver` set to `DefaultContractResolver`.
- `#236337, #234622` - Child grid data is now successfully loads with query property in the `url` adaptor.
- `#236011` - Selection `api` example is now working properly in the sample browser.
- `#233069` - Intelligence is now showing properly for `editSettings.template` property of the grid.
- `#239971` - Script error has been fixed in command column while adding a new row.
- `#233758` - Underscore in the field name is considered as Complex data while saving the changes in Dialog template editing has been fixed.

#### Breaking Changes

- Now in dialog and inline template editing, the element name for complex fields should be given with triple underscore instead of single underscore.  This change has been made as underscore is valid identifier in DB field names.

## 17.2.28-beta (2019-06-27)

### Grid

#### Bug Fixes

- #238512 - Script error during show or hide column operations in `hierarchyGrid` has been resolved.
- #145013 - Support has been provided for custom command button click event.
- #239027 - `Multiselection` is now handled for `Mac` `OS`.
- #236920 - `field` property is applied to `headerText` in `MVC` platform When header text is set as blank has been resolved.
- #234538 - Performing filter operation in the `dropdownlist` is updating Grid column's `dataSource` has been resolved.
- #238762 - `beforePaste` event support has been provided.
- #239158 - Selection border is not removed while clearing the selection using `clearSelection` method has been fixed.
- #238396 - Custom filter is now working properly with `0` value.
- #237140 - `ForeignKey` column filtering is now working in remote date with same `foreignKeyfield` and `foreignkeyvalue`.
- #232623 - Support has been provided to send row object as one of the parameter for `sortComparer` function.
- #145110 - Column chooser is now working properly when column is not shown in the column chooser list.
- #234709 - Sorting is maintained in the column after `ungrouping` the column has been resolved.
- #236657 - `getSelectedRowCellIndexes` method has been fixed to return appropriate values.
- #236295 - An `object` type is set as `defaultValue` property for `aspType`.
- #237984 - Warning log support has been provided for indicating incorrect `dataSource` in `asyncpipe`.
- #144746 - Server post request has been prevented in `pdfExport` while exporting the `currentViewData`.
- #223604 - Script error while scrolling when `activeElement` is in null state has been fixed.
- #235834 - `isVisibile` property is now set while generating focus matrix.

#### Breaking Changes

- Show or hide operation in grid is no more asynchronous. Previously show/hide grid columns has refreshed the grid content and `dataBound` event will be triggered. This behaviour has been now made synchronous to improve toggle visibility performance.
- `minWidth` property value is now applied to the columns when column width is not provided. This ensures that the cell content can occupy as much as available space and should not shrink below the given `minWidth` value.

## 17.1.51 (2019-06-11)

### Grid

#### Bug Fixes

- #235294 - Pager of the grid is refreshed properly during grid persistence.
- #232623 - Complex field structure for primary key columns when using deep watch has been resolved.
- #233441 - Misalignment has been fixed when applying `auto-fit` for stacked header columns.
- #234514 - Context menu is properly rendering when using both default and custom items in header.
- #235841 - `Colspan` is set properly while having empty records in hierarchy grid.
- #236745 - `aria-label` attribute is updated when changing value in batch mode.
- #144884 - Selected `rowIndexes` during `selectAll` checkbox operation has been resolved.
- #143410 - Exporting pdf document with UTC date value in string format has been fixed.
- #235826 - Filter icon overlaps the `headerText` when using menu filter dynamically has been fixed.
- #235017 - Problem with visible property, when `HideAtMedia` is enabled for the column has been resolved.
- #235264 - Script error when click on the column menu filter option in phone mode has been fixed.
- #236759 - `ContextMenu` maintains the previous selected row has been resolved.
- #237815 - Grid updated value is persisted when data has not been returned from server.
- #237239 - Template column is rendered properly with persistence during page refresh.

## 17.1.50 (2019-06-04)

### Grid

#### Bug Fixes

- #236235 - To get the visible element in custom function while using custom validation has been resolved.
- #235593 - To send the `tr` element in `rowDataBound` event instead of document fragment has been fixed.
- #144448 - Maximum call stack issue while invoking `clearFiltering` method in `dataBound` event has been fixed.
- #144431 - Grid export when null is provided for any complex field has been resolved.
- #235415 - `actionFailure` event during successful server side `CRUD` actions has been resolved.
- #234931 - Performance of checking checkbox columns during show/hide operation has been optimized.
- #235081 - Column value as null in `contextMenuClick` event `args` while the target is column cell has been fixed.
- #232225 - Server side Sorting in complex type(with nullable value) data column has been fixed.
- #143671 - Grid filter with null date values has been resolved.
- #225078 - Excel filter check list search criteria has been considered for grid filtering.

## 17.1.48 (2019-05-21)

### Grid

#### Bug Fixes

- #228547 - White space during normal editing is fixed while enabling the row drag and drop functionality.
- #232660 - Script error while exporting the grouped Grid with `enableGroupByFormat` has been resolved.

#### New Features

- #144253 - Provided tag helper support for data manager control.
- #225561 - Provided support to filter records when `ForeignKey` columns and Grid columns have same field names.

## 17.1.47 (2019-05-14)

### Grid

#### Bug Fixes

- #226746 - Provide support to set format for aggregate values while exporting is resolved.
- #234554 - Provide template support for stacked header is resolved.
- #234230 - Batch edit misbehaves when `allowDragAndDrop` enabled is resolved.
- #229226 - `Hyperlink` is not working when setting `clipMode` property in `iOS` is resolved.

## 17.1.44 (2019-05-07)

### Grid

#### Bug Fixes

- #234045 - Custom date format does not applied properly when excel exporting is fixed.
- #231005 - Added Select All option for column chooser.
- #232848 - `enablePersistence` with virtual scrolling displays blank page after refresh is resolved.

## 17.1.43 (2019-04-30)

### Grid

#### Bug Fixes

- #233158- Duplicate virtual element rendered while refreshing the grid is resolved.
- #230859- `actionComplete` event argument `requestType` shown as `paging` while delete operation is resolved.
- #233673- Script error occurs while using column `virtualization` with `enablePersistance` property is resolved.
- #233281- Misalignment between frozen and movable content when using EJ compatibility CSS is resolved.
- #233413- Alignment issue in grid stacked header when we enable frozen feature is resolved.
- #143681- `clearFiltering` method will send multiple posts in excel filter is resolved.
- #234189- Script error while using hidden columns method is resolved.

## 17.1.42 (2019-04-23)

### Grid

#### Bug Fixes

- #233507- Need to modify `api` description for `startedit` method is resolved.
- #229454- A large text content gets collapsed while using `rowHeight` in grid is resolved.
- #232985- Need to send edit operation `args` in `beforeDataBound` event is resolved.
- #231808- Problem in hiding scrollbar place holder when having frozen is resolved.
- #232924- Horizontal scrollbar gets hidden in `IE` and `EDGE` browsers is resolved.

## 17.1.41 (2019-04-16)

### Grid

#### Bug Fixes

- `args.cancel` support for grid `rowDeselecting` event with checkbox selection is provided.
- `rowDeselected` event is misbehaved when performing the grid action with `persistSelection` property is resolved.
- Unable to provide custom format for aggregate columns using tag helpers is resolved.
- When the field for column is ""(not defined) then the column displays as "[object][object]" is resolved.
- Searching is not working when dynamically changing the toolbar tooltip text is resolved.
- Checkbox options in filter dialog misaligns in touch mode is resolved.

## 17.1.40 (2019-04-09)

### Grid

#### Bug Fixes

- Column template is removed after calling `getPersistData` method is resolved.
- Script error is resolved when using `setRowData` method in `cellSave` event.
- Grid content background in `material-dark` theme is resolved.
- Group caption is displaying `[object][object]` instead of 0 with `foreignkey` column is resolved.
- Missing of records after sorting in virtual scrolling grid is resolved.
- Script error when opening column menu in column virtualised grid is resolved.
- Grid menu filter does not filter the null date values properly is resolved.
- Validation message is hidden when editing the last row of the current page is resolved.
- Validation message is misplaced while using horizontal scrollbar in grid is resolved.
- `actionComplete` event is not invoked after delete all records is resolved.
- `GetRowIndexes` method returns incorrect index when invoked after filtering records in virtualisation grid.
- A support to get row index from row data is provided.
- Unable to delete record using command delete button when `showConfirmDialog` set to `false` is resolved.

## 17.1.38 (2019-03-29)

### Grid

#### Bug Fixes

- Excluded template from `pageSettings` while get persist data in Grid.
- Edit cells are focused when enabling `multiselect` dropdown with checkbox mode.
- Grid `validationRules` works fine while using min and max value for `NumericTextBox`.
- Script error is resolved when opening `contextmenu` in stacked header.
- In `FilterBar` mode, the specified format is applied to date column value while performing initial filtering.
- Grid exports current view columns alone when column `virtualization` is enabled.
- Filtering is working properly after Search toolbar action.
- Additional parameters should be send in `params` property is achieved.
- `StringLength` attribute converts the HTML value as `lowercase` instead of `camelCase` issue is resolved.
- Grid Locale is not applied for edit Form components is resolved.
- Complex data fields are updated in `OdataV4` adaptor.
- Provided support for defining custom `url` in Normal editing for `Odata` adaptor.
- Script error is resolved while opening the menu filter in empty grid.
- Underscore with field is consider as complex data while save the changes in dialog template editing is resolved.
- Script error is resolved in excel Filter for date columns when data source for date column is in string.
- Programmatic update and delete operations are working properly with batch mode.
- Checkbox is aligned properly when a row with check box column with `textAlign` property is edited.
- Row misalignment occurs when having checkbox column as frozen is resolved.
- Searching misbehaves in a `URLAdaptor` bind in Grid while having Checkbox column is resolved.
- Column menu icon is misaligned when changing default `rowHeight` of the grid is resolved.
- UI issue with Excel Filter Dialog in Bootstrap theme is resolved.
- Search query in `WebAPI` request is not proper when have a CheckBox column in Grid is resolved.
- Row height is applied in Grid with null values in first column.
- Provided Internal events support for cancelling the batch editing and after the form render.
- Row deselection is not working properly while using `persistSelection` property is resolved.
- Using checkbox property in `IEditCell` type throws compilation error is resolved.
- Grid Excel filter sub menu misalignment in IE11 browser is resolved.
- Pager is not refreshed with `currentPage` value in `pageSettings` while initial rendering is resolved.
- Grid shows incorrect result while getting selected records with `selectAll` in `rowSelected` event is resolved.
- `Childgrid` with empty record is not showing No records to display while excel exporting is resolved.

#### New Features

- Provided `virtualization` support while expand or collapse the grouped records when `virtualization` is enabled.
- Provided support to edit next row cell while pressing the tab key in Batch edit mode.
- Provided support to add new row in bottom while pressing the tab key in last cell of last row in current page.
- Provided support to trigger `actionComplete` event after calling `expandAll` and `collapseAll` methods.
- Provided support to implement 'Angular deep watch pipe'.
- Add and Delete operation changes are updated in the grid UI when `virtualization` is used.
- Provided internal event to change the edit form elements for tree grid team.
- Provided Error handler support in Grid Component.

## 17.1.1-beta (2019-01-29)

### Grid

#### New Features

- Provided support for toggle selection on row and cells.
- Provided reorder position support for the target field index.
- Provided support to restrict the searching in column level
- Provided set model support for `selectedRowIndex` property.
- Provided add `params` support to customize the controls which are used in Menu filter.

### Grid

#### Bug Fixes

- Updating `Vue` component data throws script error with `stacked header` is resolved.
- `rowHeight` is not working when group grid columns is resolved.
- Pager dropdown does not render in `Production` is fixed.
- Provided support to exclude the `grid` properties from persist in the grid initialize.
- `Validation rules` not working in Grid stacked columns is fixed.
- `Advanced popup` is misaligned in `excel-filter` when scroll down on the page.
- `RowSelected` event is triggered when sub context menu get open is fixed.
- `Query` property not working for dynamic property change is fixed.
- `Touch-scrolling` frozen content moves page scrollbar is resolved.
- Script error throws in `row-template` when scroll up/down is fixed.
- Unable to filter the date column with `excel-filter` using `DataOperations` class is fixed.
- `IE` cannot handle the viewport height when `scroll(virtual scrolling)` is resolved.
- Grouped column is not included in dialog editing when `showGroupedColumn` is false is fixed.
- `Initial Grouping` not maintained when setting the `locale` property dynamically is fixed.
- Script error when `editTemplate` is used in batch mode is fixed.

#### New Features

- `row Drag and Drop` support within a single grid is provided.
- Support for `true type` font in PDF library is added.
- `Hierarchy Grid` printing support is added.
- Support For `Excel,CSV and Pdf export` with Hierarchy Grid is provided.
- Support for `row-spanning` in Grid is added.
- Adding a new row at the bottom of the grid support is added.
- support for `paste option` to Grid from `Excelsheet/Grid` is provided.
- `Excel-Like Auto Filling` support is added.

## 16.4.40-beta (2018-12-10)

### Grid

#### Bug Fixes

- Getter function from super class are not available inside the `template-context` is fixed.
- Filter icon goes a little above the `headerText` with `wrapMode` as `Header` is resolved.
- `rowDeselecting` event not triggered after double clicking a particular row and select different row is resolved.
- `Column-Menu` items are not disabled when disabled the grid properties at column level is fixed.
- Provided theme support for grid header in `excel-export`.
- Provided whole dataset for the `custom-aggregate` function when use `disablePageWiseAggregate` with no grouping.
- Provided theme support for grid content in `pdf-export`.
- Script error when `editTemplate` is used in `batch mode` is fixed.

#### Breaking Changes

Interface changed for `PdfExportProperties`
| Property | Old | New |
| -------- | --- | --- |
| **theme.header** | borders.color | border.color |
| | borders.lineStyle | border.dashStyle |
| **theme.record** | borders.color | border.color |
| | borders.lineStyle| border.dashStyle |
| **theme.caption** | borders.color | border.color |
| | borders.lineStyle | border.dashStyle |

## 16.3.33 (2018-11-20)

### Grid

#### Bug Fixes

- Using html in `footerTemplate` of aggregation is hidden in `excel-export` and `pdf-export` is fixed.
- `columnMenu` is not properly render when disable the grid properties at column level is resolved.
- With Virtual scrolling, args.data returns as undefined in `rowSelected` event is fixed.
- `Virtualization` translate value calculated incorrectly when set `height` 100% is fixed.

## 16.3.32 (2018-11-13)

### Grid

#### Bug Fixes

- Refreshing a template in column Grid after edit and update displays no records in IE is fixed.
- Unable to use `captionTemplate` in angular grid is resolved.

## 16.3.31 (2018-11-07)

### Grid

#### Bug Fixes

- `aggregateModule` is made public from grid class.
- `Tooltip` throw script error when hover grid cell faster with `EllipsisWithTooltip` is fixed.
- `excelexport` failed when complex property has null as value is resolved.
- Script error throws while deleting the records after adding new records in `batch-editing` mode is resolved.

#### New Features

- Provided dialog settings to customize dialog-editing.

#### Breaking Changes

- For dialog editing, the dialog overlay will be displayed to entire document, Previously the overlay will be displayed only on the grid element.

## 16.3.30 (2018-11-01)

### Grid

#### Bug Fixes

- `extend` like method to keep getters in the data is added.
- `Tab-key` press and update the data in `command-column` causes multiple posts at server side is resolved.
- Added `target` to the arguments of the `rowDeselecting` event of Grid.
- Cell edit template read function does not called when column type as `boolean` is resolved.
- Script error thrown in production mode when using `hideColumns` method to hide a column.

## 16.3.27 (2018-10-23)

### Grid

#### Bug Fixes

- Grid `Filter` column field is undefined while using stacked headers is fixed.
- Angular Grid is failed in production mode when `sideEffects` is set as false is fixed.
- `Checkbox` select all is not selecting all records when batch added record is fixed.
- `rowHeight` is not set properly when grouping column enabled is resolved.
- When performing excel filter search with enter key the operators are always `contains` is resolved.
- script error throws in `rowSelected` and `cellSelected` event after moving from one page to another page is fixed.

## 16.3.25 (2018-10-15)

### Grid

#### Bug Fixes

- Angular Grid printing is not working properly when using ng-template is fixed.
- dialog template is not working properly when grid contains column template is fixed.
- `ODataV4` - Need to skip expand and select queries when apply `groupby` is used is added.
- parse error when valid `json` values are passed into `DataUtil.parse.parseJSON`.
- field value is undefined while adding the record in batch editing when we enable checkbox selection is resolved.
- Need to provide whole dataset for the custom aggregate function when use `disablePageWiseAggregates` with no grouping is added.
- `rowSelected` event arguments are not proper when selecting new records in batch mode is fixed.
- Custom aggregate function parameters are incorrect when perform grouping with `disablePageWiseAggregates` is resolved.
- `setCellValue` is not working for template column is fixed.
- Provided separate title support for command column button.

## 16.3.24 (2018-10-09)

### Grid

#### Bug Fixes

- Excel Exporting with aggregates throws error is fixed.
- Field value is undefined while adding record in batch editing when enabling checkbox selection is fixed.
- Column chooser is overridden by search textbox due to padding top property issue is fixed.
- Rendering dropdown component in grid editing returns only the first record in the dropdown list is fixed.
- Parent grid column chooser is not opening after expanding child grid in hierarchical is resolved.
- Grid Excel export not supporting the custom date format instead of skeleton format is resolved.
- Provided support for range selection delete with Batch mode.
- Separators are not hidden in context menu is resolved.
- Using angular services to replace display values in checkbox filter is resolved.

## 16.3.23 (2018-10-03)

### Grid

#### Bug Fixes

- Prevented the grid refresh action when change the `showDropArea` visibility.
- Changed the default values while add the empty data.
- Context menu separators are not hidden properly when open in header.
- Script error is thrown while auto fit the hierarchy grid with empty data is fixed.
- Batch changes not passed when the column is edited with spaces.
- Misalignment occurred while doing show or hide grid column with enable frozen columns is fixed.
- Support for column chooser can search with user given operators.

## 16.3.22 (2018-09-25)

### Grid

#### Bug Fixes

- Provided `batchsave` as request type for `actionComplete` event of bulk save.
- Provided optional parameter support for `autoFitColumns` API.
- Cancel icon is not clearing the searched text when externally opening column chooser fixed.
- Now row height is set in batch edit mode to avoid shrinking when not data is added.
- Foreign key column checkbox filter shows blank values resolved.
- Date value is sent to server side as empty sting instead of null value while adding the record fixed.
- Script error thrown when perform editing with command column and detail template.
- Need to retrieve the batch changes from the grid when the column is edited with spaces.
- Changing page size dropdown value destroys another grid page size dropdown resolved.
- Deleted record row objects maintains resolved.
- Resolved issue with dynamic data source change when foreign key is used.
- Added cancel event argument for search `actionBegin` event.
- `ODataV4` - Excel filter now uses `groupby` to get distinct data.
- Autofit columns for empty detail Grid issue is fixed.

## 16.3.21 (2018-09-22)

### Grid

#### Bug Fixes

- Initial multi-sorting icon is added incorrectly fixed.
- Validation for complex property is not added properly resolved.

#### New Features

- Dialog edit template support added.
- Reactive aggregate update support added.
- Date time type column filter support added.
- Windows explorer like check-box selection added.
- Expand and collapse enabled in excel exported document for grouped grid.
- Support to prevent the overriding of autofit columns by Resizing added.
- Show All option added for page size drop-down.

## 16.3.17 (2018-09-12)

### Grid

#### Bug Fixes

- Initial multi-sorting icon is added incorrectly fixed.
- Validation for complex property is not added properly resolved.

#### New Features

- Dialog edit template support added.
- Reactive aggregate update support added.
- Date time type column filter support added.
- Windows explorer like check-box selection added.
- Expand and collapse enabled in excel exported document for grouped grid.
- Support to prevent the overriding of autofit columns by Resizing added.
- Show All option added for page size drop-down.

## 16.2.50 (2018-09-04)

### Grid

#### Bug Fixes

- Script error thrown with dynamic column and datasource inside the service subscription.
- Cell selection misbehaves when having both checkbox and template columns in Grid issue is fixed.
- Initial sorting and grid sorting is fixed when `isFrozen` property set for column.
- Maximum call stack occurred when traverse through grouped hierarchy grid issue resolved.

#### Breaking Changes

- For remote data, while using the checkbox/excel filter, the search operator is changed to `equal` for `number` and `date` type columns.
  Previously `startswith` operator was used.

## 16.2.49 (2018-08-21)

### Grid

#### Bug Fixes

- Cursor element height set as 0 when using hidden property issue resolved.
- Updating `foreignKey` with URL Adaptor not working issue resolved.
- `actionComplete` event is raised for batch save operation.

## 16.2.48 (2018-08-14)

### Grid

#### Bug Fixes

- `ODataV4` - `$search` is not used when using foreign key column resolved.
- Primary key column is now included in select query when using `columnQueryMode` as `ExcludeHidden`.
- Edit form is now rendered with tab key while grid is rendered inside dialog.
- Selection is now maintained while expand or collapse child grid.
- Footer aggregate is not aligned properly when apply column fit resolved.

## 16.2.47 (2018-08-07)

### Grid

#### Bug Fixes

- Batch editing tab key press prevention when grid placed inside dialog fixed.
- Unable to use `headerText` in group caption template is resolved.
- Query table name is not used by grid `CRUD` operations fixed.
- Arguments return properly in `beforeExcelExport` and `beforePdfExport` event.
- Cancel support for `rowDrop` event is provided.

## 16.2.46 (2018-07-30)

### Grid

#### Bug Fixes

- Selected rows event arguments are wrong with grouping and `enableVirtualization` is resolved.
- Multiple rows selecting while scrolling with grouping and `enableVirtualization` is resolved.
- Provided locale string for pager All option.

## 16.2.45 (2018-07-17)

### Grid

#### Bug Fixes

- Edit parameter is not properly applied for foreign key column is resolved.
- Batch edit for Template column is fixed.
- ng-compiler for filter `itemTemplate` property is fixed.
- Operators are not maintained while filtering multiple columns with filter bar issue resolved.
- Display of raw HTML when dragging column header to group area is resolved.
- Grid displays fine when enable/disable `enableVirtualization` dynamically.

## 16.2.44 (2018-07-10)

### Grid

#### Bug Fixes

- Dynamic aggregate columns enabled is not working issue resolved.
- Custom aggregate is not applied in MVC

## 16.2.43 (2018-07-03)

### Grid

#### Bug Fixes

- Passed row data to checkbox filter item template.
- The locale is not properly applied for aggregates is resolved.
- Export cell object is missing on exporting query cell info event argument is resolved.
- `setCellValue` not updated the value when we use frozen columns is resolved.
- Support to provide show all record option in pager dropdown.
- Format is not applying for group caption while using `Urladaptor`.

## 16.2.42 (2018-06-27)

### Grid

#### Bug Fixes

- Batch confirmation dialog is not shown when we use Excel/Checkbox filter in Grid is resolved.
- Excel text filter icon does not update with localization is resolved.
- Provide `cellSaved` event support for getting the edited data while using batch Editing.
- column size in IE when grouping is not changing like in chrome is resolved.
- Bottom rows do not get selected with Virtualization and Grouping is resolved.
- Script error thrown while refreshing grid in edit state is resolved.
- Complex data with custom excel filter throws script error is resolved.
- Invalid filtered data in `datetime` column issue resolved.
- Empty Grid showed while editing request failed issue resolved.
- Prevented the script errors while destroying grid.
- Script error while rendering the grid inside a dialog issue resolved.
- Complex data with first row null value issue resolved.
- Success and fail handler triggering issue resolved.
- Additional parameter not available in menu filter issue resolved.

## 16.2.41 (2018-06-25)

### Grid

#### Bug Fixes

- Group footer template shows incorrect value while using `disablePageWiseAggregate` issue fixed.
- Unable to sort when set dynamic sort settings in descending order resolved.
- Footer aggregate row is not aligned properly when using child grid resolved.
- In batch editing, script error occurs when focusing on grid after clicking add and cancel button fixed.
- Filter icon misalignment with text wrap enabled resolved.
- Selection retained after unchecking the check all checkbox with remote data source fixed.
- `actionComplete` event is not triggered for batch cancel resolved.
- Frozen content got hidden while adding new row with auto height is resolved.
- Unable to use auto complete inside filter bar template resolved.
- Aggregates row get misaligned while horizontal scrolling if vertical scrollbar presents resolved.
- Excel filter dialog is not updated when properties updated through `setProperties` issue resolved.
- Indent column disappeared when resizing the hierarchy column in Grid issue fixed.

## 16.1.44 (2018-05-18)

### Grid

#### Bug Fixes

- edited data is not remove when we click the cancel button with frozen column feature enable.

## 16.1.43 (2018-05-18)

### Grid

#### Bug Fixes

- Complex data editing is not shown valid selector when we use frozen feature.

## 16.1.42 (2018-05-15)

### Grid

#### Bug Fixes

- Excel Filter dialog not updated while initial rendering and through `setproperties`.
- Localization not applied in Exporting Grid.
- Complex data binding not working properly with editing add action.

## 16.1.41 (2018-05-09)

### Grid

#### Bug Fixes

- `dataStateChange` event is now trigged when `pageSize` is changed.
- Provided support for optimizing frozen content height with auto wrap.

## 16.1.40 (2018-05-08)

### Grid

#### Bug Fixes

- `dataStateChange` event is now trigged when `pageSize` is changed.
- Group and caption aggregate is now working with `async` pipe.
- Now grid refreshed when group and caption aggregates is emptied.
- In Remote data, the `getSelectedRecords` method returns proper count with `persistSelection` enabled.
- Script error thrown when set `dataSource` and `columns` is provided at the same time fixed.

## 16.1.39 (2018-05-05)

### Grid

#### Bug Fixes

- Memory leak issue resolved.

## 16.1.38 (2018-05-03)

### Grid

#### Bug Fixes

- Duplicate values updating in batch changes for complex property is resolved.
- Creating multiple elements while hovering for tooltip issue is resolved.
- Lint issue occurs in custom toolbar with latest typescript version is resolved.
- Undoing delete operation only restores frozen content in batch edit fixed.

## 16.1.37 (2018-04-24)

### Grid

#### Bug Fixes

- Script error thrown while deleting all records with aggregates and `Urladaptor` is resolved.
- `FilterBar` message is not updated while setting filter settings in `setProperties` method is resolved.
- Excel Filter dialog not updated while programmatically filter the column is resolved.
- With virtual scrolling grid refreshes constantly issue is resolved.

## 16.1.35 (2018-04-17)

### Grid

#### Bug Fixes

- Maximum call stack issue while filtering date column with `disablePageWiseAggregates` is resolved.
- Provided locale support for custom filter labels and column chooser.
- Between operator provides incorrect result in Excel filter issue fixed.
- Content rendering delayed while using virtual scrolling with grouping when scrolling horizontally is resolved.

#### Breaking Changes

- The Locale properties such as `OK`, `Filter`, `Clear` are removed instead use `OKButton`, `FilterButton`, `ClearButton`.

## 16.1.34 (2018-04-10)

### Grid

#### Bug Fixes

- Pager Dropdown values is not updated while dynamically changing the Page size issue is resolved.
- Provide locale column format support for excel-export.
- Setting filter Properties through `setProperties` method is resolved.
- Changing frozen columns from null throws script error is resolved.
- Excel exporting group caption shows field name instead of header text issue is resolved.
- String values not accepted for methods from window in custom filter menu template is resolved.

## 16.1.33 (2018-04-04)

### Grid

#### Bug Fixes

- Updating column object for dynamically bounded columns.

## 16.1.32 (2018-03-29)

### Grid

#### Bug Fixes

- Grid refreshes before insert operation completed resolved.
- Grid refresh prevented when column showing or hiding dynamically through `hideAtMedia`.
- Initial multi sorted column icons is ordered correctly.
- Removed filter bar border when using compatibility theme.
- Provide complex data editing support.
- Grouping with search always shown the spinner when data source has no value is resolved.
- Filtering the column while field has underscore value is resolved.
- Aggregate returns the null value when grouped has no aggregate field is resolved.
- Header text shown along with header template is resolved.

## 16.1.30 (2018-03-20)

### Grid

#### Bug Fixes

- Column properties is not persisted after reordering columns resolved.
- `args.cancel`  has included in `rowSelecting` event while select the rows through method and user interaction.

## 16.1.29 (2018-03-13)

### Grid

#### Bug Fixes

- `args.cancel`  has included in `rowSelecting` event.
- Dynamically changing filter settings does not update `Filterbar` value and filter status message is resolved.
- Batch edit should close on clicking outside grid and on pressing enter or tab key is resolved.
- `updateRow` method is provided for Normal editing and Dialog editing.
- Duplicate columns added in group drop area issue resolved.

## 16.1.28 (2018-03-09)

### Grid

#### Bug Fixes

- Minimum height for edit dialog is provided.
- Identity column is not disabled when adding resolved.
- Script error thrown when destroy the Grid with custom toolbar template issue resolved.
- Batch editing save action shows empty grid issue resolved.
- `currentViewData` is not changed in remote data editing issue resolved.

## 16.1.24 (2018-02-22)

### Grid

#### New Features

- New Excel like column filtering option is added.
- Added Look-up table or foreign key data binding to grid column.
- Row height adjustment feature added.

#### Bug Fixes

- Angular and React `enablePersistence` issue resolved.

#### Breaking Changes

- All grid enum property values are changed from camel casing to pascal casing. Please refer the below link for complete API changes from `v15.4.23` to `v16.1.24`.
[Migration](http://ej2.syncfusion.com/documentation/grid/migration.html).

## 15.4.30-preview (2018-02-14)

### Grid

#### Bug Fixes

- Exporting is working fine with template column.
- Aggregate with frozen columns scroller is working fine

## 15.4.29-preview (2018-02-07)

### Grid

#### Bug Fixes

- Renamed event `dataSourceChange` to `dataSourceChanged`.

## 15.4.28-preview (2018-01-30)

### Grid

#### Bug Fixes

- Child Grid editing dialog closes when clicking on edit element.
- Printing window is blocking by browser and column hiding.
- `getSelectedRecords` method returns selected records properly with checkbox persist selection fixed.
- Aggregate with frozen columns scroller is working fine.

## 15.4.27-preview (2018-01-30)

### Grid

#### Bug Fixes

- Disable edit, delete button when Grid is empty.
- `ShowConfirmDialog` is not showing in Command Column.
- Grid Validation message is not shown in EJ2 compatibility theme.
- Checkbox selection fixes with virtual scrolling.
- Provide support to add row with rowindex in AddRecord method.

## 15.4.26-preview (2018-01-23)

### Grid

#### Bug Fixes

- Validation error message partially hidden when grid has single record in add and update action.
- Two way binding for headers on grid not working.
- Child grid collapses after save operation fixed.
- Checkbox column binding with data source is not working fixed.
- Misalignment occurs in frozen columns without height property fixed.

## 15.4.25-preview (2018-01-09)

### Grid

#### New Features

- `isBlob` argument added in export methods to get blob data export complete events.

#### Bug Fixes

- Check Select all not working when refreshing the Grid header in run time.
- Column chooser throws script error in IE 11 while destroying the component.
- Column checkbox filtering shows no records while grid have menu filtering.

## 15.4.24-preview (2018-01-10)

### Grid

#### Bug Fixes

- Filter menu clear action throws script error with column menu.
- Add row misaligns with header when grid has hidden columns.
- Support for `rowSelected` event for template column.
- Date filtering request pass as string when reloading.
- Script error on add record by hidden column.
- Row deselect event not fires in check box selection.
- Sorting and grouping failed on complex data.
- Last and next page options are enabled when data source is empty.
- Default cursor not displayed after invoke grid refresh method.

## 15.4.23-preview (2017-12-27)

### Common

#### New Features

- Added typing file for ES5 global scripts (`dist/global/index.d.ts`).

#### Breaking Changes

- Modified the module bundle file name for ES6 bundling.

### Grid

#### Bug Fixes

- Header content is not scrolling while adding a record in empty Grid.
- `displayAsCheckbox` not working for numeric values.
- Filtered value not persisting in filter menu with date picker.
- Reordering with filter menu throws script error.
- Exporting Grouped Grid with Header not working.

## 15.4.22-preview (2017-12-14)

### Grid

#### New Features

- `recordDoubleClick` event added.

#### Bug Fixes

- Script error when pdf exporting with null values.

#### Breaking Changes

- Now `ColumnChooser` module must be injected to use column chooser feature.

#### Bug Fixes

- Grid height 100% is not working fixed.

## 15.4.21-preview (2017-12-08)

### Grid

#### Bug Fixes

- Script error when exporting with Custom aggregate fixed.
- State persistence in angular is not working fixed.
- Exporting with stacked header is not working fixed.
- Alignment issue with checkbox column fixed.
- Cancelling edit with edit Template fixed.
- Stacked header alignment issue fixed.
- Disabling Edit confirm dialog is not working issue fixed.
- Script error throws when save the record after edit in IE11 fixed.
- Editing not working after batch save in action begin event fixed.
- Deleting unsaved record throws Script error fixed.

## 15.4.20-preview (2017-12-01)

### Grid

#### Bug Fixes

- Column format is not applied when type is specified fixed
- Value search in checkbox filter is not worked for complex binding fixed
- Editing is not worked with stacked header fixed
- Numeric Edit column didn't get modified value when Enter key press fixed
- Null shows as date value in date type column fixed
- Edit Confirm Dialog is not working properly in batch edit mode fixed

## 15.4.19-preview (2017-11-23)

### Grid

#### Bug Fixes

- Script error resolved when exporting Grid data.
- Provided filter `menu` support for `template` columns.
- Localization is not found for `numeric` and `date` filter menu issue fixed.

## 15.4.18-preview (2017-11-16)

### Grid

#### Bug Fixes

- `enum` support for toolbar items provided.
- Edit state not changed when changing `dataSource` issue fixed.
- Duplicate service injection in React fixed.

## 15.4.17-preview (2017-11-13)

### Grid

Grid component is used to display and manipulate tabular data with configuration options to control the way the data is presented and manipulated.

- **Data sources** - Bind the Grid component with an array of JavaScript objects or DataManager.
- **Sorting and grouping** - Supports n levels of sorting and grouping.
- **Selection** - Provides the option to select the grid rows single or multiple.
- **Filtering** - Offers filter bar or menu , or checkbox at each column to filter data.
- **Editing** -  Provides the options to dynamically insert, delete and update records.
- **Virtualization** - Provides the options to load large amount of data without performance degradation.
- **Aggregates** - Provides built in types are sum , average, min, max, count.
- **Paging** - Provides the option to easily switch between pages using the pager bar.
- **Reordering** - Allows you to drag any column and drop it at any position in the Grid’s column header row, allowing columns to be repositioned.
- **Resize** - Allow you to resize the grid column width dynamically.
- **Frozen Rows And Columns** - Provides the options to freeze certain rows or columns to scroll remaining movable content.
- **Clipboard** - Provides an option to copy selected rows or cells data into clipboard.
- **Column Spanning** - Provides an option to allows to span the multiple adjacent cells.
- **Stacked Header** - It can be stacked or grouped in order to show multiple level of column headers.
- **Hierarchy Grid** - It is used to display table data in hierarchical structure which can show or hide by clicking on expand or collapse button.
- **Print and Exporting** - Provides the option to print and exporting grid records.
- **RTL** - Provides a full-fledged right-to-left mode which aligns content in the Grid component from right to left.
- **Localization** - Provides inherent support to localize the UI.
