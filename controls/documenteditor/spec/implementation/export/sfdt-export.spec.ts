import { DocumentEditor } from '../../../src/document-editor/document-editor';
import { PageLayoutViewer, LayoutViewer } from '../../../src/document-editor/implementation/viewer/viewer';;
import { createElement } from '@syncfusion/ej2-base';
import { TestHelper } from '../../test-helper.spec';
import { Editor } from '../../../src/document-editor/implementation/editor/editor';
import { Selection } from '../../../src/document-editor/implementation/selection/selection';
import { SfdtExport } from '../../../src/document-editor/implementation/writer/sfdt-export';
import { LineWidget, ParagraphWidget } from '../../../src/document-editor/implementation/viewer/page';
import { WordExport } from '../../../src/document-editor/implementation/writer/word-export';

let charParaBidi: any = { "sections": [{ "blocks": [{ "characterFormat": { "bidi": true }, "paragraphFormat": { "styleName": "Normal" }, "inlines": [{ "text": "???", "characterFormat": { "bidi": true } }] }, { "paragraphFormat": { "styleName": "Normal" }, "inlines": [{ "text": "Second column", "characterFormat": { "bdo": "RTL" } }, { "name": "_GoBack", "bookmarkType": 0 }, { "name": "_GoBack", "bookmarkType": 1 }, { "text": " ", "characterFormat": { "bdo": "RTL" } }, { "text": "?", "characterFormat": { "bdo": "RTL" } }] }, { "paragraphFormat": { "styleName": "Normal", "bidi": true }, "inlines": [{ "text": "Third column " }] }, { "paragraphFormat": { "styleName": "Normal" }, "inlines": [{ "text": "Second Page" }] }, { "paragraphFormat": { "styleName": "Normal" }, "inlines": [] }, { "paragraphFormat": { "styleName": "Normal", "bidi": true }, "inlines": [{ "text": "ssASasAS" }] }], "headersFooters": {}, "sectionFormat": { "headerDistance": 36.0, "footerDistance": 36.0, "pageWidth": 612.0, "pageHeight": 792.0, "leftMargin": 72.0, "rightMargin": 72.0, "topMargin": 72.0, "bottomMargin": 72.0, "differentFirstPage": false, "differentOddAndEvenPages": false, "bidi": true } }], "characterFormat": { "fontSize": 11.0, "fontFamily": "Calibri" }, "paragraphFormat": { "afterSpacing": 8.0, "lineSpacing": 1.0791666507720947, "lineSpacingType": "Multiple" }, "background": { "color": "#FFFFFFFF" }, "styles": [{ "type": "Paragraph", "name": "Normal", "next": "Normal" }, { "type": "Character", "name": "Default Paragraph Font" }, { "type": "Character", "name": "Line Number", "basedOn": "Default Paragraph Font" }, { "type": "Paragraph", "name": "Header", "basedOn": "Normal", "link": "Header Char", "paragraphFormat": { "afterSpacing": 0.0, "lineSpacing": 1.0, "lineSpacingType": "Multiple", "tabs": [{ "tabJustification": "Center", "position": 234.0, "tabLeader": "None", "deletePosition": 0.0 }, { "tabJustification": "Right", "position": 468.0, "tabLeader": "None", "deletePosition": 0.0 }] } }, { "type": "Character", "name": "Header Char", "basedOn": "Default Paragraph Font" }, { "type": "Paragraph", "name": "Footer", "basedOn": "Normal", "link": "Footer Char", "paragraphFormat": { "afterSpacing": 0.0, "lineSpacing": 1.0, "lineSpacingType": "Multiple", "tabs": [{ "tabJustification": "Center", "position": 234.0, "tabLeader": "None", "deletePosition": 0.0 }, { "tabJustification": "Right", "position": 468.0, "tabLeader": "None", "deletePosition": 0.0 }] } }, { "type": "Character", "name": "Footer Char", "basedOn": "Default Paragraph Font" }] };
let tableBidi: any = { "sections": [{ "blocks": [{ "rows": [{ "rowFormat": { "allowBreakAcrossPages": true, "isHeader": false, "height": 0.0, "heightType": "AtLeast", "borders": { "left": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "right": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "top": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "bottom": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "vertical": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "horizontal": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalDown": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalUp": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false } } }, "cells": [{ "blocks": [{ "characterFormat": { "bidi": true }, "paragraphFormat": { "styleName": "Normal", "bidi": true }, "inlines": [{ "text": "sample" }] }], "cellFormat": { "columnSpan": 1, "rowSpan": 1, "preferredWidth": 233.75, "preferredWidthType": "Point", "verticalAlignment": "Top", "isSamePaddingAsTable": true, "borders": { "left": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "right": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "top": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "bottom": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "vertical": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "horizontal": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalDown": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalUp": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false } } } }, { "blocks": [{ "characterFormat": { "bidi": true }, "paragraphFormat": { "styleName": "Normal", "bidi": true }, "inlines": [] }], "cellFormat": { "columnSpan": 1, "rowSpan": 1, "preferredWidth": 233.75, "preferredWidthType": "Point", "verticalAlignment": "Top", "isSamePaddingAsTable": true, "borders": { "left": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "right": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "top": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "bottom": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "vertical": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "horizontal": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalDown": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalUp": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false } } } }] }, { "rowFormat": { "allowBreakAcrossPages": true, "isHeader": false, "height": 0.0, "heightType": "AtLeast", "borders": { "left": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "right": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "top": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "bottom": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "vertical": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "horizontal": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalDown": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalUp": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false } } }, "cells": [{ "blocks": [{ "characterFormat": { "bidi": true }, "paragraphFormat": { "styleName": "Normal", "bidi": true }, "inlines": [] }], "cellFormat": { "columnSpan": 1, "rowSpan": 1, "preferredWidth": 233.75, "preferredWidthType": "Point", "verticalAlignment": "Top", "isSamePaddingAsTable": true, "borders": { "left": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "right": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "top": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "bottom": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "vertical": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "horizontal": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalDown": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalUp": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false } } } }, { "blocks": [{ "characterFormat": { "bidi": true }, "paragraphFormat": { "styleName": "Normal", "bidi": true }, "inlines": [] }], "cellFormat": { "columnSpan": 1, "rowSpan": 1, "preferredWidth": 233.75, "preferredWidthType": "Point", "verticalAlignment": "Top", "isSamePaddingAsTable": true, "borders": { "left": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "right": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "top": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "bottom": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "vertical": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "horizontal": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalDown": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalUp": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false } } } }] }], "title": null, "description": null, "tableFormat": { "allowAutoFit": true, "leftIndent": 0.0, "tableAlignment": "Left", "preferredWidthType": "Auto", "borders": { "left": { "lineStyle": "Single", "lineWidth": 0.5, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "right": { "lineStyle": "Single", "lineWidth": 0.5, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "top": { "lineStyle": "Single", "lineWidth": 0.5, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "bottom": { "lineStyle": "Single", "lineWidth": 0.5, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "vertical": { "lineStyle": "Single", "lineWidth": 0.5, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "horizontal": { "lineStyle": "Single", "lineWidth": 0.5, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalDown": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalUp": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false } }, "bidi": true } }, { "paragraphFormat": { "styleName": "Normal", "bidi": true }, "inlines": [] }, { "paragraphFormat": { "styleName": "Normal", "bidi": true }, "inlines": [{ "text": "hgfgfghfgfghfhgfgh" }, { "name": "_GoBack", "bookmarkType": 0 }, { "name": "_GoBack", "bookmarkType": 1 }] }], "headersFooters": {}, "sectionFormat": { "headerDistance": 36.0, "footerDistance": 36.0, "pageWidth": 612.0, "pageHeight": 792.0, "leftMargin": 72.0, "rightMargin": 72.0, "topMargin": 72.0, "bottomMargin": 72.0, "differentFirstPage": false, "differentOddAndEvenPages": false, "bidi": false } }], "characterFormat": { "fontSize": 11.0, "fontFamily": "Calibri" }, "paragraphFormat": { "afterSpacing": 8.0, "lineSpacing": 1.0791666507720947, "lineSpacingType": "Multiple" }, "background": { "color": "#FFFFFFFF" }, "styles": [{ "type": "Paragraph", "name": "Normal", "next": "Normal" }, { "type": "Character", "name": "Default Paragraph Font" }] };


describe('Sfdt export for section,character and paragraph format Bidi validation', () => {
    let editor: DocumentEditor;
    let viewer: LayoutViewer;
    let exportData: any;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(SfdtExport);
        editor = new DocumentEditor({ enableSfdtExport: true });
        (editor.viewer as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.viewer as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.viewer.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.viewer.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        viewer = editor.viewer as PageLayoutViewer;
        editor.open(JSON.stringify(charParaBidi));
        exportData = JSON.parse(editor.sfdtExportModule.serialize());
    });
    afterAll((done): void => {
        viewer.destroy();
        viewer = undefined;
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('Section format in export bidi validation', () => {
        expect(exportData.sections[0].sectionFormat.bidi).toBe(true);
    });
    it('Character format in export bidi validation', () => {
        expect(exportData.sections[0].blocks[0].characterFormat.bidi).toBe(true);
        expect(exportData.sections[0].blocks[0].paragraphFormat.bidi).toBeUndefined();
    });
    it('Paragraph format in export bidi validation', () => {
        expect(exportData.sections[0].blocks[2].paragraphFormat.bidi).toBe(true);
    });

    it('Character format in export bdo validation', () => {
        expect(exportData.sections[0].blocks[1].inlines[0].characterFormat.bdo).toBe('RTL');
    });
});

describe('Sfdt export for Table format Bidi validation', () => {
    let editor: DocumentEditor;
    let viewer: LayoutViewer;
    let exportData: any;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(SfdtExport);
        editor = new DocumentEditor({ enableSfdtExport: true });
        (editor.viewer as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.viewer as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.viewer.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.viewer.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        viewer = editor.viewer as PageLayoutViewer;
        editor.open(JSON.stringify(tableBidi));
        exportData = JSON.parse(editor.sfdtExportModule.serialize());
    });
    afterAll((done): void => {
        viewer.destroy();
        viewer = undefined;
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('Section format in export bidi validation', () => {
        expect(exportData.sections[0].sectionFormat.bidi).toBe(false);
    });
    it('Table format in export bidi validation', () => {
        expect(exportData.sections[0].blocks[0].tableFormat.bidi).toBe(true);
    });
});


let rtlFormat: any = { "sections": [{ "blocks": [{ "characterFormat": { "bold": true, "boldBidi": true }, "paragraphFormat": { "styleName": "Normal" }, "inlines": [{ "text": "Sample", "characterFormat": { "bold": true, "boldBidi": true } }] }, { "characterFormat": { "bold": true, "fontSize": 22.0, "fontFamily": "Segoe UI", "boldBidi": true, "fontSizeBidi": 22.0, "fontFamilyBidi": "Segoe UI" }, "paragraphFormat": { "styleName": "Normal" }, "inlines": [{ "text": "سشةحمث", "characterFormat": { "bold": true, "fontSize": 22.0, "fontFamily": "Segoe UI", "bidi": true, "boldBidi": true, "fontSizeBidi": 22.0, "fontFamilyBidi": "Segoe UI" } }] }, { "characterFormat": { "italic": true, "fontSize": 22.0, "bidi": true, "italicBidi": true, "fontSizeBidi": 22.0 }, "paragraphFormat": { "styleName": "Normal" }, "inlines": [{ "name": "_GoBack", "bookmarkType": 0 }, { "text": "דשצפךק", "characterFormat": { "italic": true, "fontSize": 22.0, "bidi": true, "italicBidi": true, "fontSizeBidi": 22.0 } }, { "name": "_GoBack", "bookmarkType": 1 }] }], "headersFooters": {}, "sectionFormat": { "headerDistance": 36.0, "footerDistance": 36.0, "pageWidth": 612.0, "pageHeight": 792.0, "leftMargin": 72.0, "rightMargin": 72.0, "topMargin": 72.0, "bottomMargin": 72.0, "differentFirstPage": false, "differentOddAndEvenPages": false, "bidi": false } }], "characterFormat": { "fontSize": 11.0, "fontFamily": "Calibri", "fontSizeBidi": 11.0, "fontFamilyBidi": "Calibri" }, "paragraphFormat": { "afterSpacing": 8.0, "lineSpacing": 1.0791666507720947, "lineSpacingType": "Multiple" }, "background": { "color": "#FFFFFFFF" }, "styles": [{ "type": "Paragraph", "name": "Normal", "next": "Normal" }, { "type": "Character", "name": "Default Paragraph Font" }] };

describe('Sfdt export for Table format Bidi validation', () => {
    let editor: DocumentEditor;
    let viewer: LayoutViewer;
    let exportData: any;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(SfdtExport, WordExport);
        editor = new DocumentEditor({ enableSfdtExport: true, enableWordExport: true });
        (editor.viewer as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.viewer as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.viewer.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.viewer.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        viewer = editor.viewer as PageLayoutViewer;
        editor.open(JSON.stringify(rtlFormat));
        exportData = JSON.parse(editor.sfdtExportModule.serialize());
    });
    afterAll((done): void => {
        viewer.destroy();
        viewer = undefined;
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('Rtl export font family bidi validation', () => {
        let line: LineWidget = (editor.viewer.pages[0].bodyWidgets[0].childWidgets[1] as ParagraphWidget).childWidgets[0] as LineWidget;
        expect(line.children[0].characterFormat.fontSizeBidi).toBe(22);
        expect(line.children[0].characterFormat.fontFamilyBidi).toBe("Segoe UI");
    });
    it('Word export of RTL format ', () => {
        expect(() => { editor.save('Smaple', 'Docx') }).not.toThrowError();
    });
});


let tab: any = {
    "sections": [
        {
            "blocks": [
                {
                    "inlines": [
                        {
                            "text": "\t"
                        }
                    ]
                }
            ]
        }
    ],
    "defaultTabWidth": 56.0
};
describe('Default tab width export validation', () => {
    let editor: DocumentEditor;
    let viewer: LayoutViewer;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(SfdtExport, WordExport);
        editor = new DocumentEditor({ enableSfdtExport: true, enableWordExport: true });
        (editor.viewer as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.viewer as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.viewer.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.viewer.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        viewer = editor.viewer as PageLayoutViewer;
    });
    afterAll((done): void => {
        viewer.destroy();
        viewer = undefined;
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('opened document- check default tab width', () => {
        editor.open(JSON.stringify(tab));
        let document: any = viewer.owner.sfdtExportModule.write();
        expect(document.defaultTabWidth).toBe(56);
    });
    it('open blank default tab width export validation', () => {
        editor.openBlank();
        let document: any = viewer.owner.sfdtExportModule.write();
        expect(document.defaultTabWidth).toBe(36);
    });
});
let chart: any = { "sections": [{ "sectionFormat": { "pageWidth": 612, "pageHeight": 792, "leftMargin": 72, "rightMargin": 72, "topMargin": 72, "bottomMargin": 72, "differentFirstPage": false, "differentOddAndEvenPages": false, "headerDistance": 36, "footerDistance": 36, "bidi": false }, "blocks": [{ "paragraphFormat": { "styleName": "Normal", "listFormat": {} }, "characterFormat": {}, "inlines": [{ "characterFormat": {}, "chartLegend": { "position": "Bottom", "chartTitleArea": { "fontName": "+mn-lt", "fontSize": 9, "layout": { "layoutX": 0, "layoutY": 0 }, "dataFormat": { "fill": { "foreColor": "000000", "rgb": "#000000" }, "line": { "color": "808080", "rgb": "#808080" } } } }, "chartTitleArea": { "fontName": "+mn-lt", "fontSize": 14, "layout": { "layoutX": 0, "layoutY": 0 }, "dataFormat": { "fill": { "foreColor": "000000", "rgb": "#000000" }, "line": { "color": "000000", "rgb": "#000000" } } }, "chartArea": { "foreColor": "#FFFFFFFF" }, "plotArea": { "foreColor": "#000000FF" }, "chartCategory": [{ "chartData": [{ "yValue": 4.3 }, { "yValue": 2.4 }, { "yValue": 2 }], "categoryXName": "Category 1" }, { "chartData": [{ "yValue": 2.5 }, { "yValue": 4.4 }, { "yValue": 2 }], "categoryXName": "Category 2" }, { "chartData": [{ "yValue": 3.5 }, { "yValue": 1.8 }, { "yValue": 3 }], "categoryXName": "Category 3" }, { "chartData": [{ "yValue": 4.5 }, { "yValue": 2.8 }, { "yValue": 5 }], "categoryXName": "Category 4" }], "chartSeries": [{ "dataPoints": [{ "fill": { "foreColor": "4472c4", "rgb": "#4472c4" }, "line": { "color": "000000", "rgb": "#000000" } }], "seriesName": "Series 1", "dataLabel": { "position": "Outside", "fontName": "+mn-lt", "fontColor": "404040", "fontSize": 9, "isLegendKey": false, "isBubbleSize": false, "isCategoryName": false, "isSeriesName": false, "isValue": true, "isPercentage": false, "isLeaderLines": false }, "errorBar": { "type": "StandardError", "direction": "Both", "endStyle": "Cap", "errorValue": 10 }, "trendLines": [{ "name": "Linear (Series 1)", "type": "Linear", "forward": 0, "backward": 0, "intercept": 2, "isDisplayEquation": true, "isDisplayRSquared": true }] }, { "dataPoints": [{ "fill": { "foreColor": "ed7d31", "rgb": "#ed7d31" }, "line": { "color": "000000", "rgb": "#000000" } }], "seriesName": "Series 2", "dataLabel": { "position": "Outside", "fontName": "+mn-lt", "fontColor": "404040", "fontSize": 9, "isLegendKey": false, "isBubbleSize": false, "isCategoryName": false, "isSeriesName": false, "isValue": true, "isPercentage": false, "isLeaderLines": false }, "errorBar": { "type": "StandardError", "direction": "Both", "endStyle": "Cap", "errorValue": 10 } }, { "dataPoints": [{ "fill": { "foreColor": "a5a5a5", "rgb": "#a5a5a5" }, "line": { "color": "000000", "rgb": "#000000" } }], "seriesName": "Series 3", "dataLabel": { "position": "Outside", "fontName": "+mn-lt", "fontColor": "404040", "fontSize": 9, "isLegendKey": false, "isBubbleSize": false, "isCategoryName": false, "isSeriesName": false, "isValue": true, "isPercentage": false, "isLeaderLines": false }, "errorBar": { "type": "StandardError", "direction": "Both", "endStyle": "Cap", "errorValue": 10 } }], "chartPrimaryCategoryAxis": { "chartTitle": null, "chartTitleArea": { "layout": {}, "dataFormat": { "fill": {}, "line": {} } }, "categoryType": "Automatic", "fontSize": 9, "fontName": "+mn-lt", "numberFormat": "General", "maximumValue": 0, "minimumValue": 0, "majorUnit": 0, "hasMajorGridLines": false, "hasMinorGridLines": false, "majorTickMark": "TickMark_None", "minorTickMark": "TickMark_None", "tickLabelPosition": "TickLabelPosition_NextToAxis" }, "chartPrimaryValueAxis": { "chartTitle": null, "chartTitleArea": { "layout": {}, "dataFormat": { "fill": {}, "line": {} } }, "fontSize": 9, "fontName": "+mn-lt", "maximumValue": 6, "minimumValue": 0, "majorUnit": 1, "hasMajorGridLines": true, "hasMinorGridLines": false, "majorTickMark": "TickMark_None", "minorTickMark": "TickMark_None", "tickLabelPosition": "TickLabelPosition_NextToAxis" }, "chartTitle": "ClusterBar", "chartType": "Bar_Clustered", "gapWidth": 182, "overlap": 0, "height": 252, "width": 432 }, { "characterFormat": {}, "bookmarkType": 0, "name": "_GoBack" }, { "characterFormat": {}, "bookmarkType": 1, "name": "_GoBack" }] }], "headersFooters": {} }], "characterFormat": { "bold": false, "italic": false, "fontSize": 11, "fontFamily": "Calibri", "underline": "None", "strikethrough": "None", "baselineAlignment": "Normal", "highlightColor": "NoColor", "fontColor": "#000000", "fontSizeBidi": 11, "fontFamilyBidi": "Calibri" }, "paragraphFormat": { "leftIndent": 0, "rightIndent": 0, "firstLineIndent": 0, "textAlignment": "Left", "beforeSpacing": 0, "afterSpacing": 8, "lineSpacing": 1.0791666507720947, "lineSpacingType": "Multiple", "listFormat": {}, "bidi": false }, "defaultTabWidth": 36, "styles": [{ "name": "Normal", "type": "Paragraph", "paragraphFormat": { "listFormat": {} }, "characterFormat": {}, "next": "Normal" }, { "name": "Default Paragraph Font", "type": "Character", "characterFormat": {} }, { "name": "Balloon Text", "type": "Paragraph", "paragraphFormat": { "afterSpacing": 0, "lineSpacing": 1, "lineSpacingType": "Multiple", "listFormat": {} }, "characterFormat": { "fontSize": 9, "fontFamily": "Segoe UI", "fontSizeBidi": 9, "fontFamilyBidi": "Segoe UI" }, "basedOn": "Normal", "link": "Balloon Text Char" }, { "name": "Balloon Text Char", "type": "Character", "characterFormat": { "fontSize": 9, "fontFamily": "Segoe UI", "fontSizeBidi": 9, "fontFamilyBidi": "Segoe UI" }, "basedOn": "Default Paragraph Font" }, { "name": "Heading 1", "type": "Paragraph", "paragraphFormat": { "leftIndent": 0, "rightIndent": 0, "firstLineIndent": 0, "textAlignment": "Left", "beforeSpacing": 12, "afterSpacing": 0, "lineSpacing": 1.0791666507720947, "lineSpacingType": "Multiple", "outlineLevel": "Level1", "listFormat": {} }, "characterFormat": { "fontSize": 16, "fontFamily": "Calibri Light", "fontColor": "#2F5496" }, "basedOn": "Normal", "link": "Heading 1 Char", "next": "Normal" }, { "name": "Heading 1 Char", "type": "Character", "characterFormat": { "fontSize": 16, "fontFamily": "Calibri Light", "fontColor": "#2F5496" }, "basedOn": "Default Paragraph Font" }, { "name": "Heading 2", "type": "Paragraph", "paragraphFormat": { "leftIndent": 0, "rightIndent": 0, "firstLineIndent": 0, "textAlignment": "Left", "beforeSpacing": 2, "afterSpacing": 0, "lineSpacing": 1.0791666507720947, "lineSpacingType": "Multiple", "outlineLevel": "Level2", "listFormat": {} }, "characterFormat": { "fontSize": 13, "fontFamily": "Calibri Light", "fontColor": "#2F5496" }, "basedOn": "Normal", "link": "Heading 2 Char", "next": "Normal" }, { "name": "Heading 2 Char", "type": "Character", "characterFormat": { "fontSize": 13, "fontFamily": "Calibri Light", "fontColor": "#2F5496" }, "basedOn": "Default Paragraph Font" }, { "name": "Heading 3", "type": "Paragraph", "paragraphFormat": { "leftIndent": 0, "rightIndent": 0, "firstLineIndent": 0, "textAlignment": "Left", "beforeSpacing": 2, "afterSpacing": 0, "lineSpacing": 1.0791666507720947, "lineSpacingType": "Multiple", "outlineLevel": "Level3", "listFormat": {} }, "characterFormat": { "fontSize": 12, "fontFamily": "Calibri Light", "fontColor": "#1F3763" }, "basedOn": "Normal", "link": "Heading 3 Char", "next": "Normal" }, { "name": "Heading 3 Char", "type": "Character", "characterFormat": { "fontSize": 12, "fontFamily": "Calibri Light", "fontColor": "#1F3763" }, "basedOn": "Default Paragraph Font" }, { "name": "Heading 4", "type": "Paragraph", "paragraphFormat": { "leftIndent": 0, "rightIndent": 0, "firstLineIndent": 0, "textAlignment": "Left", "beforeSpacing": 2, "afterSpacing": 0, "lineSpacing": 1.0791666507720947, "lineSpacingType": "Multiple", "outlineLevel": "Level4", "listFormat": {} }, "characterFormat": { "italic": true, "fontFamily": "Calibri Light", "fontColor": "#2F5496" }, "basedOn": "Normal", "link": "Heading 4 Char", "next": "Normal" }, { "name": "Heading 4 Char", "type": "Character", "characterFormat": { "italic": true, "fontFamily": "Calibri Light", "fontColor": "#2F5496" }, "basedOn": "Default Paragraph Font" }, { "name": "Heading 5", "type": "Paragraph", "paragraphFormat": { "leftIndent": 0, "rightIndent": 0, "firstLineIndent": 0, "textAlignment": "Left", "beforeSpacing": 2, "afterSpacing": 0, "lineSpacing": 1.0791666507720947, "lineSpacingType": "Multiple", "outlineLevel": "Level5", "listFormat": {} }, "characterFormat": { "fontFamily": "Calibri Light", "fontColor": "#2F5496" }, "basedOn": "Normal", "link": "Heading 5 Char", "next": "Normal" }, { "name": "Heading 5 Char", "type": "Character", "characterFormat": { "fontFamily": "Calibri Light", "fontColor": "#2F5496" }, "basedOn": "Default Paragraph Font" }, { "name": "Heading 6", "type": "Paragraph", "paragraphFormat": { "leftIndent": 0, "rightIndent": 0, "firstLineIndent": 0, "textAlignment": "Left", "beforeSpacing": 2, "afterSpacing": 0, "lineSpacing": 1.0791666507720947, "lineSpacingType": "Multiple", "outlineLevel": "Level6", "listFormat": {} }, "characterFormat": { "fontFamily": "Calibri Light", "fontColor": "#1F3763" }, "basedOn": "Normal", "link": "Heading 6 Char", "next": "Normal" }, { "name": "Heading 6 Char", "type": "Character", "characterFormat": { "fontFamily": "Calibri Light", "fontColor": "#1F3763" }, "basedOn": "Default Paragraph Font" }], "lists": [], "abstractLists": [] };
let lineChart: any = { "sections": [{ "sectionFormat": { "pageWidth": 612, "pageHeight": 792, "leftMargin": 72, "rightMargin": 72, "topMargin": 72, "bottomMargin": 72, "differentFirstPage": false, "differentOddAndEvenPages": false, "headerDistance": 36, "footerDistance": 36, "bidi": false }, "blocks": [{ "paragraphFormat": { "styleName": "Normal", "listFormat": {} }, "characterFormat": {}, "inlines": [{ "characterFormat": {}, "chartLegend": { "position": "Bottom", "chartTitleArea": { "fontName": "+mn-lt", "fontSize": 9, "layout": { "layoutX": 0, "layoutY": 0 }, "dataFormat": { "fill": { "foreColor": "000000", "rgb": "#000000" }, "line": { "color": "808080", "rgb": "#808080" } } } }, "chartTitleArea": { "fontName": "+mn-lt", "fontSize": 14, "layout": { "layoutX": 0, "layoutY": 0 }, "dataFormat": { "fill": { "foreColor": "000000", "rgb": "#000000" }, "line": { "color": "000000", "rgb": "#000000" } } }, "chartArea": { "foreColor": "#FFFFFFFF" }, "plotArea": { "foreColor": "#000000FF" }, "chartCategory": [{ "chartData": [{ "yValue": 4.3 }, { "yValue": 2.4 }, { "yValue": 2 }], "categoryXName": "Category 1" }, { "chartData": [{ "yValue": 2.5 }, { "yValue": 4.4 }, { "yValue": 2 }], "categoryXName": "Category 2" }, { "chartData": [{ "yValue": 3.5 }, { "yValue": 1.8 }, { "yValue": 3 }], "categoryXName": "Category 3" }, { "chartData": [{ "yValue": 4.5 }, { "yValue": 2.8 }, { "yValue": 5 }], "categoryXName": "Category 4" }], "chartSeries": [{ "dataPoints": [{ "fill": { "foreColor": "000000", "rgb": "#000000" }, "line": { "color": "4472c4", "rgb": "#4472c4" } }], "seriesName": "Series 1", "seriesFormat": { "markerStyle": "Circle", "markerSize": 5, "markerColor": "ff4472c4" } }, { "dataPoints": [{ "fill": { "foreColor": "000000", "rgb": "#000000" }, "line": { "color": "ed7d31", "rgb": "#ed7d31" } }], "seriesName": "Series 2", "seriesFormat": { "markerStyle": "Circle", "markerSize": 5, "markerColor": "ffed7d31" } }, { "dataPoints": [{ "fill": { "foreColor": "000000", "rgb": "#000000" }, "line": { "color": "a5a5a5", "rgb": "#a5a5a5" } }], "seriesName": "Series 3", "seriesFormat": { "markerStyle": "Circle", "markerSize": 5, "markerColor": "ffa5a5a5" } }], "chartPrimaryCategoryAxis": { "chartTitle": null, "chartTitleArea": { "layout": {}, "dataFormat": { "fill": {}, "line": {} } }, "categoryType": "Automatic", "fontSize": 9, "fontName": "+mn-lt", "numberFormat": "General", "maximumValue": 0, "minimumValue": 0, "majorUnit": 0, "hasMajorGridLines": false, "hasMinorGridLines": false, "majorTickMark": "TickMark_None", "minorTickMark": "TickMark_None", "tickLabelPosition": "TickLabelPosition_NextToAxis" }, "chartPrimaryValueAxis": { "chartTitle": null, "chartTitleArea": { "layout": {}, "dataFormat": { "fill": {}, "line": {} } }, "fontSize": 9, "fontName": "+mn-lt", "maximumValue": 6, "minimumValue": 0, "majorUnit": 1, "hasMajorGridLines": true, "hasMinorGridLines": false, "majorTickMark": "TickMark_None", "minorTickMark": "TickMark_None", "tickLabelPosition": "TickLabelPosition_NextToAxis" }, "chartTitle": "Chart Title", "chartType": "Line_Markers", "gapWidth": 0, "overlap": 0, "height": 252, "width": 432 }, { "characterFormat": {}, "bookmarkType": 0, "name": "_GoBack" }, { "characterFormat": {}, "bookmarkType": 1, "name": "_GoBack" }] }], "headersFooters": {} }], "characterFormat": { "bold": false, "italic": false, "fontSize": 11, "fontFamily": "Calibri", "underline": "None", "strikethrough": "None", "baselineAlignment": "Normal", "highlightColor": "NoColor", "fontColor": "#000000", "fontSizeBidi": 11, "fontFamilyBidi": "Calibri" }, "paragraphFormat": { "leftIndent": 0, "rightIndent": 0, "firstLineIndent": 0, "textAlignment": "Left", "beforeSpacing": 0, "afterSpacing": 8, "lineSpacing": 1.0791666507720947, "lineSpacingType": "Multiple", "listFormat": {}, "bidi": false }, "defaultTabWidth": 36, "enforcement": false, "hashValue": "", "saltValue": "", "formatting": false, "protectionType": "ReadOnly", "styles": [{ "name": "Normal", "type": "Paragraph", "paragraphFormat": { "listFormat": {} }, "characterFormat": {}, "next": "Normal" }, { "name": "Default Paragraph Font", "type": "Character", "characterFormat": {} }, { "name": "Balloon Text", "type": "Paragraph", "paragraphFormat": { "afterSpacing": 0, "lineSpacing": 1, "lineSpacingType": "Multiple", "listFormat": {} }, "characterFormat": { "fontSize": 9, "fontFamily": "Segoe UI", "fontSizeBidi": 9, "fontFamilyBidi": "Segoe UI" }, "basedOn": "Normal", "link": "Balloon Text Char" }, { "name": "Balloon Text Char", "type": "Character", "characterFormat": { "fontSize": 9, "fontFamily": "Segoe UI", "fontSizeBidi": 9, "fontFamilyBidi": "Segoe UI" }, "basedOn": "Default Paragraph Font" }, { "name": "Heading 1", "type": "Paragraph", "paragraphFormat": { "leftIndent": 0, "rightIndent": 0, "firstLineIndent": 0, "textAlignment": "Left", "beforeSpacing": 12, "afterSpacing": 0, "lineSpacing": 1.0791666507720947, "lineSpacingType": "Multiple", "outlineLevel": "Level1", "listFormat": {} }, "characterFormat": { "fontSize": 16, "fontFamily": "Calibri Light", "fontColor": "#2F5496" }, "basedOn": "Normal", "link": "Heading 1 Char", "next": "Normal" }, { "name": "Heading 1 Char", "type": "Character", "characterFormat": { "fontSize": 16, "fontFamily": "Calibri Light", "fontColor": "#2F5496" }, "basedOn": "Default Paragraph Font" }, { "name": "Heading 2", "type": "Paragraph", "paragraphFormat": { "leftIndent": 0, "rightIndent": 0, "firstLineIndent": 0, "textAlignment": "Left", "beforeSpacing": 2, "afterSpacing": 0, "lineSpacing": 1.0791666507720947, "lineSpacingType": "Multiple", "outlineLevel": "Level2", "listFormat": {} }, "characterFormat": { "fontSize": 13, "fontFamily": "Calibri Light", "fontColor": "#2F5496" }, "basedOn": "Normal", "link": "Heading 2 Char", "next": "Normal" }, { "name": "Heading 2 Char", "type": "Character", "characterFormat": { "fontSize": 13, "fontFamily": "Calibri Light", "fontColor": "#2F5496" }, "basedOn": "Default Paragraph Font" }, { "name": "Heading 3", "type": "Paragraph", "paragraphFormat": { "leftIndent": 0, "rightIndent": 0, "firstLineIndent": 0, "textAlignment": "Left", "beforeSpacing": 2, "afterSpacing": 0, "lineSpacing": 1.0791666507720947, "lineSpacingType": "Multiple", "outlineLevel": "Level3", "listFormat": {} }, "characterFormat": { "fontSize": 12, "fontFamily": "Calibri Light", "fontColor": "#1F3763" }, "basedOn": "Normal", "link": "Heading 3 Char", "next": "Normal" }, { "name": "Heading 3 Char", "type": "Character", "characterFormat": { "fontSize": 12, "fontFamily": "Calibri Light", "fontColor": "#1F3763" }, "basedOn": "Default Paragraph Font" }, { "name": "Heading 4", "type": "Paragraph", "paragraphFormat": { "leftIndent": 0, "rightIndent": 0, "firstLineIndent": 0, "textAlignment": "Left", "beforeSpacing": 2, "afterSpacing": 0, "lineSpacing": 1.0791666507720947, "lineSpacingType": "Multiple", "outlineLevel": "Level4", "listFormat": {} }, "characterFormat": { "italic": true, "fontFamily": "Calibri Light", "fontColor": "#2F5496" }, "basedOn": "Normal", "link": "Heading 4 Char", "next": "Normal" }, { "name": "Heading 4 Char", "type": "Character", "characterFormat": { "italic": true, "fontFamily": "Calibri Light", "fontColor": "#2F5496" }, "basedOn": "Default Paragraph Font" }, { "name": "Heading 5", "type": "Paragraph", "paragraphFormat": { "leftIndent": 0, "rightIndent": 0, "firstLineIndent": 0, "textAlignment": "Left", "beforeSpacing": 2, "afterSpacing": 0, "lineSpacing": 1.0791666507720947, "lineSpacingType": "Multiple", "outlineLevel": "Level5", "listFormat": {} }, "characterFormat": { "fontFamily": "Calibri Light", "fontColor": "#2F5496" }, "basedOn": "Normal", "link": "Heading 5 Char", "next": "Normal" }, { "name": "Heading 5 Char", "type": "Character", "characterFormat": { "fontFamily": "Calibri Light", "fontColor": "#2F5496" }, "basedOn": "Default Paragraph Font" }, { "name": "Heading 6", "type": "Paragraph", "paragraphFormat": { "leftIndent": 0, "rightIndent": 0, "firstLineIndent": 0, "textAlignment": "Left", "beforeSpacing": 2, "afterSpacing": 0, "lineSpacing": 1.0791666507720947, "lineSpacingType": "Multiple", "outlineLevel": "Level6", "listFormat": {} }, "characterFormat": { "fontFamily": "Calibri Light", "fontColor": "#1F3763" }, "basedOn": "Normal", "link": "Heading 6 Char", "next": "Normal" }, { "name": "Heading 6 Char", "type": "Character", "characterFormat": { "fontFamily": "Calibri Light", "fontColor": "#1F3763" }, "basedOn": "Default Paragraph Font" }], "lists": [], "abstractLists": [] };
describe('Chart export validation', () => {
    let editor: DocumentEditor;
    let viewer: LayoutViewer;
    let exportData: any;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(SfdtExport, WordExport);
        editor = new DocumentEditor({ enableSfdtExport: true, enableWordExport: true });
        (editor.viewer as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.viewer as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.viewer.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.viewer.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        viewer = editor.viewer as PageLayoutViewer;
    });
    afterAll((done): void => {
        viewer.destroy();
        viewer = undefined;
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('opened document- check chart title', () => {
        editor.open(JSON.stringify(chart));
        exportData = JSON.parse(editor.sfdtExportModule.serialize());
    });
    it('opened document- check line marker', () => {
        editor.open(JSON.stringify(lineChart));
        exportData = JSON.parse(editor.sfdtExportModule.serialize());
    });
});


let breakHypen: any = {
    "sections": [
        {
            "blocks": [
                {
                    "paragraphFormat": {
                        "rightIndent": 0.34999999403953552,
                        "textAlignment": "Justify",
                        "styleName": "List Paragraph"
                    },
                    "inlines": [
                        {
                            "name": "_GoBack",
                            "bookmarkType": 0
                        },
                        {
                            "name": "_GoBack",
                            "bookmarkType": 1
                        },
                        {
                            "text": "non"
                        },
                        {
                            "text": "\u001e"
                        },
                        {
                            "text": "refundable "
                        }
                    ]
                },
                {
                    "paragraphFormat": {
                        "leftIndent": 72.0,
                        "beforeSpacing": 12.0,
                        "afterSpacing": 4.0,
                        "lineSpacing": 0.85833334922790527,
                        "lineSpacingType": "Multiple",
                        "textAlignment": "Justify",
                        "styleName": "List Paragraph",
                        "contextualSpacing": false
                    },
                    "inlines": []
                }
            ],
            "headersFooters": {},
            "sectionFormat": {
                "headerDistance": 36.0,
                "footerDistance": 13.699999809265137,
                "pageWidth": 612.0,
                "pageHeight": 1008.0,
                "leftMargin": 36.0,
                "rightMargin": 36.0,
                "topMargin": 43.200000762939453,
                "bottomMargin": 43.200000762939453,
                "differentFirstPage": false,
                "differentOddAndEvenPages": false,
                "bidi": false
            }
        }
    ],
    "characterFormat": {
        "fontFamily": "Times New Roman",
        "fontFamilyBidi": "Times New Roman"
    },
    "background": {
        "color": "#FFFFFFFF"
    },
    "defaultTabWidth": 36.0,
    "formatting": false,
    "protectionType": "NoProtection",
    "enforcement": false
};

describe('No break hyphen character validation', () => {
    let editor: DocumentEditor;
    let viewer: LayoutViewer;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(SfdtExport, WordExport);
        editor = new DocumentEditor({ enableSfdtExport: true, enableWordExport: true });
        (editor.viewer as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.viewer as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.viewer.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.viewer.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        viewer = editor.viewer as PageLayoutViewer;
    });
    afterAll((done): void => {
        viewer.destroy();
        viewer = undefined;
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('opened document- check default tab width', () => {
        editor.open(JSON.stringify(breakHypen));
        let document: any = viewer.owner.sfdtExportModule.write();
        expect(document.sections[0].blocks[0].inlines[3].text).toBe('-');
    });
});

let listJson: any = {
    "sections": [
        {
            "sectionFormat": {
                "pageWidth": 595.2999877929688,
                "pageHeight": 841.9000244140625,
                "leftMargin": 72,
                "rightMargin": 72,
                "topMargin": 72,
                "bottomMargin": 72,
                "differentFirstPage": false,
                "differentOddAndEvenPages": false,
                "headerDistance": 35.400001525878906,
                "footerDistance": 35.400001525878906,
                "bidi": false
            },
            "blocks": [
                {
                    "paragraphFormat": {
                        "leftIndent": 50.20000076293945,
                        "textAlignment": "Left",
                        "afterSpacing": 6,
                        "styleName": "Body",
                        "listFormat": {
                            "listId": 7,
                            "listLevelNumber": 0
                        }
                    },
                    "characterFormat": {
                        "underline": "Single"
                    },
                    "inlines": [
                        {
                            "characterFormat": {
                                "underline": "Single"
                            },
                            "text": " "
                        }
                    ]
                }
            ],
            "headersFooters": {
            }
        }
    ],
    "characterFormat": {
        "bold": false,
        "italic": false,
        "fontSize": 11,
        "fontFamily": "Calibri",
        "underline": "None",
        "strikethrough": "None",
        "baselineAlignment": "Normal",
        "highlightColor": "NoColor",
        "fontColor": "#000000",
        "fontSizeBidi": 11,
        "fontFamilyBidi": "Arial"
    },
    "paragraphFormat": {
        "leftIndent": 0,
        "rightIndent": 0,
        "firstLineIndent": 0,
        "textAlignment": "Left",
        "beforeSpacing": 0,
        "afterSpacing": 8,
        "lineSpacing": 1.0791666507720947,
        "lineSpacingType": "Multiple",
        "listFormat": {
        },
        "bidi": false
    },
    "defaultTabWidth": 36,
    "enforcement": false,
    "hashValue": "",
    "saltValue": "",
    "formatting": false,
    "protectionType": "NoProtection",
    "styles": [
        {
            "name": "Normal",
            "type": "Paragraph",
            "paragraphFormat": {
                "afterSpacing": 0,
                "lineSpacing": 1.100000023841858,
                "lineSpacingType": "Multiple",
                "listFormat": {
                },
                "contextualSpacing": true
            },
            "characterFormat": {
                "fontSize": 10,
                "fontFamily": "Calibri Light",
                "fontSizeBidi": 10
            },
            "next": "Normal"
        },
        {
            "name": "Heading 1",
            "type": "Paragraph",
            "paragraphFormat": {
                "afterSpacing": 6,
                "lineSpacing": 1.5,
                "lineSpacingType": "Multiple",
                "outlineLevel": "Level1",
                "listFormat": {
                    "listId": 1
                },
                "contextualSpacing": false
            },
            "characterFormat": {
                "bold": true,
                "fontSize": 16,
                "fontFamily": "Calibri Light",
                "fontColor": "#EB5015FF"
            },
            "basedOn": "Normal",
            "link": "Heading 1 Char",
            "next": "Heading 2"
        },
        {
            "name": "Heading 1 Char",
            "type": "Character",
            "characterFormat": {
                "bold": true,
                "fontSize": 16,
                "fontFamily": "Calibri Light",
                "fontColor": "#EB5015FF",
                "fontSizeBidi": 10
            },
            "basedOn": "Default Paragraph Font"
        },
        {
            "name": "Default Paragraph Font",
            "type": "Character",
            "characterFormat": {
            }
        },
        {
            "name": "Heading 2",
            "type": "Paragraph",
            "paragraphFormat": {
                "beforeSpacing": 16,
                "afterSpacing": 6,
                "lineSpacing": 1.5,
                "lineSpacingType": "Multiple",
                "outlineLevel": "Level2",
                "listFormat": {
                    "listId": 1,
                    "listLevelNumber": 1
                },
                "contextualSpacing": false
            },
            "characterFormat": {
                "fontSize": 13,
                "fontFamily": "Calibri Light",
                "fontColor": "#EB5015FF",
                "boldBidi": true,
                "fontSizeBidi": 14,
                "fontFamilyBidi": "Times New Roman"
            },
            "basedOn": "Normal",
            "link": "Heading 2 Char",
            "next": "Body"
        },
        {
            "name": "Heading 2 Char",
            "type": "Character",
            "characterFormat": {
                "fontSize": 13,
                "fontFamily": "Calibri Light",
                "fontColor": "#EB5015FF",
                "boldBidi": true,
                "fontSizeBidi": 14,
                "fontFamilyBidi": "Times New Roman"
            },
            "basedOn": "Default Paragraph Font"
        },
        {
            "name": "Body",
            "type": "Paragraph",
            "paragraphFormat": {
                "textAlignment": "Justify",
                "afterSpacing": 0,
                "lineSpacing": 1.100000023841858,
                "lineSpacingType": "Multiple",
                "listFormat": {
                }
            },
            "characterFormat": {
                "fontSize": 10,
                "fontFamily": "Calibri Light",
                "fontColor": "#404040FF",
                "fontSizeBidi": 10
            },
            "link": "Body Char",
            "next": "Normal"
        },
        {
            "name": "Body Char",
            "type": "Character",
            "characterFormat": {
                "fontSize": 10,
                "fontFamily": "Calibri Light",
                "fontColor": "#404040FF",
                "fontSizeBidi": 10
            },
            "basedOn": "Default Paragraph Font"
        },
        {
            "name": "Heading 3",
            "type": "Paragraph",
            "paragraphFormat": {
                "beforeSpacing": 14,
                "afterSpacing": 6,
                "lineSpacing": 1.5,
                "lineSpacingType": "Multiple",
                "outlineLevel": "Level3",
                "listFormat": {
                    "listId": 1,
                    "listLevelNumber": 2
                }
            },
            "characterFormat": {
                "fontSize": 12,
                "fontFamily": "Calibri Light",
                "fontColor": "#EB5015FF",
                "boldBidi": true,
                "fontSizeBidi": 12,
                "fontFamilyBidi": "Times New Roman"
            },
            "basedOn": "Normal",
            "link": "Heading 3 Char",
            "next": "Body"
        },
        {
            "name": "Heading 3 Char",
            "type": "Character",
            "characterFormat": {
                "fontSize": 12,
                "fontFamily": "Calibri Light",
                "fontColor": "#EB5015FF",
                "boldBidi": true,
                "fontSizeBidi": 12,
                "fontFamilyBidi": "Times New Roman"
            },
            "basedOn": "Default Paragraph Font"
        },
        {
            "name": "Heading 4",
            "type": "Paragraph",
            "paragraphFormat": {
                "outlineLevel": "Level4",
                "listFormat": {
                }
            },
            "characterFormat": {
                "fontSize": 11,
                "fontColor": "#EB501FFF",
                "italicBidi": true
            },
            "basedOn": "Heading 3",
            "link": "Heading 4 Char",
            "next": "Normal"
        },
        {
            "name": "Heading 4 Char",
            "type": "Character",
            "characterFormat": {
                "fontFamily": "Calibri Light",
                "fontColor": "#EB501FFF",
                "boldBidi": true,
                "italicBidi": true,
                "fontSizeBidi": 12,
                "fontFamilyBidi": "Times New Roman"
            },
            "basedOn": "Default Paragraph Font"
        },
        {
            "name": "Heading 5",
            "type": "Paragraph",
            "paragraphFormat": {
                "beforeSpacing": 12,
                "afterSpacing": 6,
                "lineSpacing": 1.5,
                "lineSpacingType": "Multiple",
                "outlineLevel": "Level5",
                "listFormat": {
                    "listId": 1,
                    "listLevelNumber": 4
                }
            },
            "characterFormat": {
                "fontFamily": "Calibri Light",
                "fontColor": "#ED7D31FF",
                "fontFamilyBidi": "Times New Roman"
            },
            "basedOn": "Normal",
            "link": "Heading 5 Char",
            "next": "Normal"
        },
        {
            "name": "Heading 5 Char",
            "type": "Character",
            "characterFormat": {
                "fontSize": 10,
                "fontFamily": "Calibri Light",
                "fontColor": "#ED7D31FF",
                "fontSizeBidi": 10,
                "fontFamilyBidi": "Times New Roman"
            },
            "basedOn": "Default Paragraph Font"
        },
        {
            "name": "Heading 6",
            "type": "Paragraph",
            "paragraphFormat": {
                "beforeSpacing": 2,
                "outlineLevel": "Level6",
                "listFormat": {
                    "listId": 1,
                    "listLevelNumber": 5
                }
            },
            "characterFormat": {
                "fontFamily": "Calibri Light",
                "fontColor": "#1F3763FF",
                "fontFamilyBidi": "Times New Roman"
            },
            "basedOn": "Normal",
            "link": "Heading 6 Char",
            "next": "Normal"
        },
        {
            "name": "Heading 6 Char",
            "type": "Character",
            "characterFormat": {
                "fontSize": 10,
                "fontFamily": "Calibri Light",
                "fontColor": "#1F3763FF",
                "fontSizeBidi": 10,
                "fontFamilyBidi": "Times New Roman"
            },
            "basedOn": "Default Paragraph Font"
        },
        {
            "name": "Heading 7",
            "type": "Paragraph",
            "paragraphFormat": {
                "beforeSpacing": 2,
                "outlineLevel": "Level7",
                "listFormat": {
                    "listId": 1,
                    "listLevelNumber": 6
                }
            },
            "characterFormat": {
                "italic": true,
                "fontFamily": "Calibri Light",
                "fontColor": "#1F3763FF",
                "italicBidi": true,
                "fontFamilyBidi": "Times New Roman"
            },
            "basedOn": "Normal",
            "link": "Heading 7 Char",
            "next": "Normal"
        },
        {
            "name": "Heading 7 Char",
            "type": "Character",
            "characterFormat": {
                "italic": true,
                "fontSize": 10,
                "fontFamily": "Calibri Light",
                "fontColor": "#1F3763FF",
                "italicBidi": true,
                "fontSizeBidi": 10,
                "fontFamilyBidi": "Times New Roman"
            },
            "basedOn": "Default Paragraph Font"
        },
        {
            "name": "Heading 8",
            "type": "Paragraph",
            "paragraphFormat": {
                "beforeSpacing": 2,
                "outlineLevel": "Level8",
                "listFormat": {
                    "listId": 1,
                    "listLevelNumber": 7
                }
            },
            "characterFormat": {
                "fontSize": 10.5,
                "fontFamily": "Calibri Light",
                "fontColor": "#272727FF",
                "fontSizeBidi": 10.5,
                "fontFamilyBidi": "Times New Roman"
            },
            "basedOn": "Normal",
            "link": "Heading 8 Char",
            "next": "Normal"
        },
        {
            "name": "Heading 8 Char",
            "type": "Character",
            "characterFormat": {
                "fontSize": 10.5,
                "fontFamily": "Calibri Light",
                "fontColor": "#272727FF",
                "fontSizeBidi": 10.5,
                "fontFamilyBidi": "Times New Roman"
            },
            "basedOn": "Default Paragraph Font"
        },
        {
            "name": "Heading 9",
            "type": "Paragraph",
            "paragraphFormat": {
                "beforeSpacing": 2,
                "outlineLevel": "Level9",
                "listFormat": {
                    "listId": 1,
                    "listLevelNumber": 8
                }
            },
            "characterFormat": {
                "italic": true,
                "fontSize": 10.5,
                "fontFamily": "Calibri Light",
                "fontColor": "#272727FF",
                "italicBidi": true,
                "fontSizeBidi": 10.5,
                "fontFamilyBidi": "Times New Roman"
            },
            "basedOn": "Normal",
            "link": "Heading 9 Char",
            "next": "Normal"
        },
        {
            "name": "Heading 9 Char",
            "type": "Character",
            "characterFormat": {
                "italic": true,
                "fontSize": 10.5,
                "fontFamily": "Calibri Light",
                "fontColor": "#272727FF",
                "italicBidi": true,
                "fontSizeBidi": 10.5,
                "fontFamilyBidi": "Times New Roman"
            },
            "basedOn": "Default Paragraph Font"
        }
    ],
    "lists": [
        {
            "abstractListId": 1,
            "listId": 1
        },
        {
            "abstractListId": 5,
            "listId": 7
        }
    ],
    "abstractLists": [
        {
            "abstractListId": 1,
            "levels": [
                {
                    "characterFormat": {
                    },
                    "paragraphFormat": {
                        "leftIndent": 21.600000381469727,
                        "firstLineIndent": -21.600000381469727,
                        "listFormat": {
                        }
                    },
                    "followCharacter": "Tab",
                    "listLevelPattern": "Arabic",
                    "numberFormat": "%1",
                    "restartLevel": 0,
                    "startAt": 1
                },
                {
                    "characterFormat": {
                    },
                    "paragraphFormat": {
                        "leftIndent": 28.799999237060547,
                        "firstLineIndent": -28.799999237060547,
                        "listFormat": {
                        }
                    },
                    "followCharacter": "Tab",
                    "listLevelPattern": "Arabic",
                    "numberFormat": "%1.%2",
                    "restartLevel": 1,
                    "startAt": 1
                },
                {
                    "characterFormat": {
                    },
                    "paragraphFormat": {
                        "leftIndent": 36,
                        "firstLineIndent": -36,
                        "listFormat": {
                        }
                    },
                    "followCharacter": "Tab",
                    "listLevelPattern": "Arabic",
                    "numberFormat": "%1.%2.%3",
                    "restartLevel": 2,
                    "startAt": 1
                },
                {
                    "characterFormat": {
                    },
                    "paragraphFormat": {
                        "leftIndent": 43.20000076293945,
                        "firstLineIndent": -43.20000076293945,
                        "listFormat": {
                        }
                    },
                    "followCharacter": "Tab",
                    "listLevelPattern": "Arabic",
                    "numberFormat": "%1.%2.%3.%4",
                    "restartLevel": 3,
                    "startAt": 1
                },
                {
                    "characterFormat": {
                    },
                    "paragraphFormat": {
                        "leftIndent": 50.400001525878906,
                        "firstLineIndent": -50.400001525878906,
                        "listFormat": {
                        }
                    },
                    "followCharacter": "Tab",
                    "listLevelPattern": "Arabic",
                    "numberFormat": "%1.%2.%3.%4.%5",
                    "restartLevel": 4,
                    "startAt": 1
                },
                {
                    "characterFormat": {
                    },
                    "paragraphFormat": {
                        "leftIndent": 57.599998474121094,
                        "firstLineIndent": -57.599998474121094,
                        "listFormat": {
                        }
                    },
                    "followCharacter": "Tab",
                    "listLevelPattern": "Arabic",
                    "numberFormat": "%1.%2.%3.%4.%5.%6",
                    "restartLevel": 5,
                    "startAt": 1
                },
                {
                    "characterFormat": {
                    },
                    "paragraphFormat": {
                        "leftIndent": 64.80000305175781,
                        "firstLineIndent": -64.80000305175781,
                        "listFormat": {
                        }
                    },
                    "followCharacter": "Tab",
                    "listLevelPattern": "Arabic",
                    "numberFormat": "%1.%2.%3.%4.%5.%6.%7",
                    "restartLevel": 6,
                    "startAt": 1
                },
                {
                    "characterFormat": {
                    },
                    "paragraphFormat": {
                        "leftIndent": 72,
                        "firstLineIndent": -72,
                        "listFormat": {
                        }
                    },
                    "followCharacter": "Tab",
                    "listLevelPattern": "Arabic",
                    "numberFormat": "%1.%2.%3.%4.%5.%6.%7.%8",
                    "restartLevel": 7,
                    "startAt": 1
                },
                {
                    "characterFormat": {
                    },
                    "paragraphFormat": {
                        "leftIndent": 79.19999694824219,
                        "firstLineIndent": -79.19999694824219,
                        "listFormat": {
                        }
                    },
                    "followCharacter": "Tab",
                    "listLevelPattern": "Arabic",
                    "numberFormat": "%1.%2.%3.%4.%5.%6.%7.%8.%9",
                    "restartLevel": 8,
                    "startAt": 1
                }
            ]
        },
        {
            "abstractListId": 5,
            "levels": [
                {
                    "characterFormat": {
                        "bold": false
                    },
                    "paragraphFormat": {
                        "leftIndent": 32.20000076293945,
                        "firstLineIndent": -18,
                        "listFormat": {
                        }
                    },
                    "followCharacter": "Tab",
                    "listLevelPattern": "LowLetter",
                    "numberFormat": "%1.",
                    "restartLevel": 0,
                    "startAt": 1
                },
                {
                    "characterFormat": {
                        "fontFamily": "Symbol"
                    },
                    "paragraphFormat": {
                        "leftIndent": 72,
                        "firstLineIndent": -18,
                        "listFormat": {
                        }
                    },
                    "followCharacter": "Tab",
                    "listLevelPattern": "Bullet",
                    "numberFormat": "",
                    "restartLevel": 0,
                    "startAt": 0
                },
                {
                    "characterFormat": {
                    },
                    "paragraphFormat": {
                        "leftIndent": 108,
                        "firstLineIndent": -9,
                        "listFormat": {
                        }
                    },
                    "followCharacter": "Tab",
                    "listLevelPattern": "LowRoman",
                    "numberFormat": "%3.",
                    "restartLevel": 2,
                    "startAt": 1
                },
                {
                    "characterFormat": {
                    },
                    "paragraphFormat": {
                        "leftIndent": 144,
                        "firstLineIndent": -18,
                        "listFormat": {
                        }
                    },
                    "followCharacter": "Tab",
                    "listLevelPattern": "Arabic",
                    "numberFormat": "%4.",
                    "restartLevel": 3,
                    "startAt": 1
                },
                {
                    "characterFormat": {
                    },
                    "paragraphFormat": {
                        "leftIndent": 180,
                        "firstLineIndent": -18,
                        "listFormat": {
                        }
                    },
                    "followCharacter": "Tab",
                    "listLevelPattern": "LowLetter",
                    "numberFormat": "%5.",
                    "restartLevel": 4,
                    "startAt": 1
                },
                {
                    "characterFormat": {
                    },
                    "paragraphFormat": {
                        "leftIndent": 216,
                        "firstLineIndent": -9,
                        "listFormat": {
                        }
                    },
                    "followCharacter": "Tab",
                    "listLevelPattern": "LowRoman",
                    "numberFormat": "%6.",
                    "restartLevel": 5,
                    "startAt": 1
                },
                {
                    "characterFormat": {
                    },
                    "paragraphFormat": {
                        "leftIndent": 252,
                        "firstLineIndent": -18,
                        "listFormat": {
                        }
                    },
                    "followCharacter": "Tab",
                    "listLevelPattern": "Arabic",
                    "numberFormat": "%7.",
                    "restartLevel": 6,
                    "startAt": 1
                },
                {
                    "characterFormat": {
                    },
                    "paragraphFormat": {
                        "leftIndent": 288,
                        "firstLineIndent": -18,
                        "listFormat": {
                        }
                    },
                    "followCharacter": "Tab",
                    "listLevelPattern": "LowLetter",
                    "numberFormat": "%8.",
                    "restartLevel": 7,
                    "startAt": 1
                },
                {
                    "characterFormat": {
                    },
                    "paragraphFormat": {
                        "leftIndent": 324,
                        "firstLineIndent": -9,
                        "listFormat": {
                        }
                    },
                    "followCharacter": "Tab",
                    "listLevelPattern": "LowRoman",
                    "numberFormat": "%9.",
                    "restartLevel": 8,
                    "startAt": 1
                }
            ]
        }
    ]
};
describe('Sfdt export for validating abstract list collection', () => {
    let editor: DocumentEditor;
    let viewer: LayoutViewer;
    let exportData: any;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(SfdtExport);
        editor = new DocumentEditor({ enableSfdtExport: true });
        (editor.viewer as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.viewer as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.viewer.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.viewer.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        viewer = editor.viewer as PageLayoutViewer;
        editor.open(JSON.stringify(listJson));
        exportData = JSON.parse(editor.sfdtExportModule.serialize());
    });
    afterAll((done): void => {
        viewer.destroy();
        viewer = undefined;
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('Abstract list collection validation', () => {
        expect(exportData.abstractLists.length).toBe(2);
    });
});
