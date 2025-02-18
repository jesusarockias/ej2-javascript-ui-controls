import { PdfViewer } from '../index';

/**
 * @hidden
 */
export class AjaxHandler {

    /**
     * Specifies the URL to which request to be sent.
     * @default null	
     */
    public url: string;
    /**
     * Specifies the URL to which request to be sent.
     * @default 'POST'
     */
    public type: string = 'POST';
    /**
     * Specifies the responseType to which request response.
     * @default null
     */
    public responseType: XMLHttpRequestResponseType;
    /**		 
     * A boolean value indicating whether the request should be sent asynchronous or not.
     * @default true
     * @private
     */
    public mode: boolean = true;
    /**		 
     * Specifies the ContentType to which request to be sent
     * @default null
     * @private
     */
    public contentType: string = 'application/json;charset=UTF-8';

    private httpRequest: XMLHttpRequest;
    private pdfViewer: PdfViewer;

    /**
     * Constructor for Ajax class
     * @param  {PdfViewer} pdfviewer
     * @returns defaultType
     * @private
     */
    constructor(pdfviewer: PdfViewer) {
        this.pdfViewer = pdfviewer;
    }

    /**
     * Send the request to server
     * @param  {object} jsonObj - To send to service
     * @private
     */
    public send(jsonObj: object): void {
        this.httpRequest = new XMLHttpRequest();
        if (!this.mode) {
            setTimeout(() => { this.sendRequest(jsonObj); });
        } else {
            this.sendRequest(jsonObj);
        }
        this.httpRequest.onreadystatechange = () => { this.stateChange(this); };
        this.httpRequest.onerror = () => { this.error(this); };
    }

    private sendRequest(jsonObj: object): void {
        this.httpRequest.open(this.type, this.url, this.mode);
        this.httpRequest.setRequestHeader('Content-Type', this.contentType);
        this.setCustomAjaxHeaders();
        if (this.responseType !== null) {
            this.httpRequest.responseType = this.responseType;
        }
        this.httpRequest.send(JSON.stringify(jsonObj)); // jshint ignore:line
    }

    private stateChange(proxy: AjaxHandler): void {
        if (proxy.httpRequest.readyState === 4 && proxy.httpRequest.status === 200) {
            // tslint:disable-next-line
            let data: any;
            if (this.responseType !== null) {
                data = proxy.httpRequest.response;
            } else {
                data = proxy.httpRequest.responseText;
            }
            // tslint:disable-next-line
            let result: any = {
                name: 'onSuccess',
                data: data,
                readyState: proxy.httpRequest.readyState,
                status: proxy.httpRequest.status
            };
            proxy.successHandler(result);
        } else if (proxy.httpRequest.readyState === 4 && proxy.httpRequest.status === 400) { // jshint ignore:line)
            // tslint:disable-next-line
            let result: any = {
                name: 'onFailure',
                status: proxy.httpRequest.status,
                statusText: proxy.httpRequest.statusText
            };
            proxy.failureHandler(result);
        }
    }

    private error(proxy: AjaxHandler): void {
        // tslint:disable-next-line
        let result: any = {
            name: 'onError',
            status: this.httpRequest.status,
            statusText: this.httpRequest.statusText
        };
        proxy.errorHandler(result);
    }

    /**
     * Specifies callback function to be triggered after XmlHttpRequest is succeeded. 
     * The callback will contain server response as the parameter.
     * @event
     * @private
     */
    public onSuccess: Function;
    /**
     * Specifies callback function to be triggered after XmlHttpRequest is got failed. 
     * The callback will contain server response as the parameter.
     * @event
     * @private
     */
    public onFailure: Function;
    /**
     * Specifies callback function to be triggered after XmlHttpRequest is got error. 
     * The callback will contain server response as the parameter.
     * @event
     * @private
     */
    public onError: Function;

    // tslint:disable-next-line
    private successHandler(response: any) {
        if (this.onSuccess) {
            this.onSuccess(response);
        }
        return response;
    }

    // tslint:disable-next-line
    private failureHandler(response: any) {
        if (this.onFailure) {
            this.onFailure(response);
        }
        return response;
    }

    // tslint:disable-next-line
    private errorHandler(response: any) {
        if (this.onError) {
            this.onError(response);
        }
        return response;
    }

    private setCustomAjaxHeaders(): void {
        for (let i: number = 0; i < this.pdfViewer.ajaxRequestSettings.ajaxHeaders.length; i++) {
            // tslint:disable-next-line:max-line-length
            this.httpRequest.setRequestHeader(this.pdfViewer.ajaxRequestSettings.ajaxHeaders[i].headerName, this.pdfViewer.ajaxRequestSettings.ajaxHeaders[i].headerValue);
        }
    }
}