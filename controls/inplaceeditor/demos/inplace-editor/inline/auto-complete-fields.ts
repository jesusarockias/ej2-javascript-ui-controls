/**
 * AutoComplete Fields Sample
 */
import { InPlaceEditor } from '../../../src/inplace-editor/base/inplace-editor';
import { AutoComplete } from './../../../src/inplace-editor/modules/auto-complete';

InPlaceEditor.Inject(AutoComplete);

let serviceUrl: string = 'https://ej2services.syncfusion.com/development/web-services/api/Editor/UpdateData';

let sportsData: { [key: string]: Object }[] = [
    { Id: 'game1', Game: 'Badminton' },
    { Id: 'game2', Game: 'Basketball' },
    { Id: 'game3', Game: 'Cricket' },
    { Id: 'game4', Game: 'Football' },
    { Id: 'game5', Game: 'Golf' },
    { Id: 'game6', Game: 'Gymnastics' },
    { Id: 'game7', Game: 'Tennis' }
];

let editObj: InPlaceEditor = new InPlaceEditor({
    mode: 'Inline',
    type: 'AutoComplete',
    value: 'game1',
    primaryKey: '1',
    url: serviceUrl,
    name: 'Game',
    adaptor: 'UrlAdaptor',
    popupSettings: {
        title: 'Edit'
    },
    validationRules: {
        Game: { required: true }
    },
    model: {
        dataSource: sportsData,
        fields: { text: 'Game', value: 'Id' },
        placeholder: 'Select a game'
    }
});
editObj.appendTo('#element');

document.getElementById('renderMode').addEventListener('change', (e: any) => {
    switch (e.target.value) {
        case "1":
            document.body.classList.remove('e-bigger');
            break;
        case "2":
            document.body.classList.add('e-bigger');
            break;
    }
});

document.getElementById('themes').addEventListener('change', (e: any) => {
    let container: HTMLElement = <HTMLElement>document.querySelector('.sample-container');
    container.style.background = ((e.target.value.indexOf('dark') > 0 || e.target.value.indexOf('contrast') > 0) ? 'black' : 'initial');
    document.getElementsByTagName('link')[0].href = '../theme-files/' + e.target.value + '.css';
});

document.getElementById('mode').addEventListener('change', (e: any) => {
    editObj.mode = e.target.value;
    editObj.dataBind();
});

document.getElementById('editOn').addEventListener('change', (e: any) => {
    editObj.editableOn = e.target.value;
    editObj.dataBind();
});

document.getElementById('blurAction').addEventListener('change', (e: any) => {
    editObj.actionOnBlur = e.target.value;
    editObj.dataBind();
});

document.getElementById('rtl').addEventListener('change', (e: any) => {
    editObj.enableRtl = e.target.checked;
    editObj.dataBind();
});

document.getElementById('persist').addEventListener('change', (e: any) => {
    editObj.enablePersistence = e.target.checked;
    editObj.dataBind();
});

document.getElementById('disabled').addEventListener('change', (e: any) => {
    editObj.disabled = e.target.checked;
    editObj.dataBind();
});

document.getElementById('showButtons').addEventListener('change', (e: any) => {
    editObj.showButtons = e.target.checked;
    editObj.dataBind();
});

document.getElementById('openEditor').addEventListener('change', (e: any) => {
    editObj.enableEditMode = e.target.checked;
    editObj.dataBind();
});

document.getElementById('enterSubmit').addEventListener('change', (e: any) => {
    editObj.submitOnEnter = e.target.checked;
    editObj.dataBind();
});