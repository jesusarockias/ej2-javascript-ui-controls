import { createElement, L10n, remove, EmitType } from '@syncfusion/ej2-base';
import { HeatMap } from '../../src/heatmap/heatmap';
import { Title } from '../../src/heatmap/model/base';
import { ILoadedEventArgs } from '../../src/heatmap/model/interface'
import { MouseEvents } from '../base/event.spec';
import { profile , inMB, getMemoryProfile } from '../../spec/common.spec';

describe('Heatmap Control', () => {
    beforeAll(() => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log("Unsupported environment, window.performance.memory is unavailable");
            this.skip(); //Skips test (in Chai)
            return;
        }
    });
    describe('Axis properties and behavior', () => {
        let heatmap: HeatMap;
        let ele: HTMLElement;
        let text: HTMLElement;
        let created: EmitType<Object>;
        let trigger: MouseEvents = new MouseEvents();
        let data: number[][]=[
            [1,2,3,4,5],
            [1,2,3,4,5],
            [1,2,3,4,5],
            [1,2,3,4,5],
            [1,2,3,4,5],
        ]
        beforeAll((): void => {
            ele = createElement('div', { id: 'container' });
            document.body.appendChild(ele);
            heatmap = new HeatMap({
                dataSource:data,
                legendSettings:{
                    visible:false
                },
                xAxis:{
                    labels:["test","test1","test2","test3","test4"]
                },
                yAxis:{
                    labels:["test","test1","test2","test3","test4"]
                },
                paletteSetting:{
                   palette: [
                        {color: "rgb(255, 153, 204)"},
                        {color: "rgb(255, 0, 0)"},
                        {color: "rgb(255, 255, 0)"}
                    ],
                }
            });
        });

        afterAll((): void => {
            heatmap.destroy();
        });
        
        it('Checking heatmap instance creation', (done: Function) => {
            created = (args: Object): void => {
                expect(heatmap != null).toBe(true);
                done();
            }
            heatmap.created = created;
            heatmap.appendTo('#container');
        });
        it('Checking x-axis title', () => {
            heatmap.xAxis.title.text = "XAxis";
            heatmap.showTooltip = false;
            heatmap.dataBind();
            text = document.getElementById('container_XAxisTitle');
            expect(text.textContent == 'XAxis').toBe(true);            
        });
        it('Checking x-axis title with text alignment', () => {
         heatmap.xAxis.title.textStyle.textAlignment ="Near";
            heatmap.refresh();
            text = document.getElementById('container_XAxisTitle');
            expect(text.textContent == 'XAxis').toBe(true);            
            expect(text.getAttribute('x') == '43' || text.getAttribute('y') == '436').toBe(true);
        });
        it('Checking x-axis title with text alignment', () => {
            heatmap.xAxis.title.textStyle.textAlignment ="Far";
            heatmap.refresh();
            text = document.getElementById('container_XAxisTitle');
            expect(text.textContent == 'XAxis').toBe(true);   
            expect(text.getAttribute('x') == '757' || text.getAttribute('x') == '759' || text.getAttribute('y') == '436' || text.getAttribute('y') == '436.25').toBe(true);
        });
        it('Checking opposed position for x-axis', () => {
            heatmap.xAxis.opposedPosition = true;
            heatmap.refresh();
            text = document.getElementById('container_XAxisLine');   
            expect((text.getAttribute('x1') == '46' || text.getAttribute('x1') == '43') && (text.getAttribute('y1') == '62' || text.getAttribute('y1') == '60')).toBe(true);
        });

        it('Checking x-axis with inversed', () => {
            heatmap.xAxis.isInversed = true;
            heatmap.refresh();
            text = document.getElementById('container_XAxis_Label0');        
            expect(text.textContent == 'test').toBe(true);  
            expect((text.getAttribute('x') == '675.9' || text.getAttribute('x') == '678.9') && (text.getAttribute('y') == '52' || text.getAttribute('y') == '50')).toBe(true);
        });

        //y-axis
        it('Checking y-axis title', () => {
            heatmap.yAxis.title.text = "YAxis";
            heatmap.dataBind();
            text = document.getElementById('container_YAxisTitle');
            expect(text.textContent == 'YAxis').toBe(true);            
        });
        it('Checking y-axis title with text alignment', () => {
            heatmap.yAxis.title.textStyle.textAlignment ="Near";
               heatmap.refresh();
               text = document.getElementById('container_YAxisTitle');
               expect(text.textContent == 'YAxis').toBe(true);           
               expect((text.getAttribute('x') == '36' || text.getAttribute('x') == '35') && text.getAttribute('y') == '420').toBe(true);
           });
           it('Checking y-axis title with text alignment', () => {
               heatmap.yAxis.title.textStyle.textAlignment ="Far";
               heatmap.refresh();
               text = document.getElementById('container_YAxisTitle');
               expect(text.textContent == 'YAxis').toBe(true);           
               expect((text.getAttribute('x') == '36' || text.getAttribute('x') == '35') && (text.getAttribute('y') == '42' || text.getAttribute('y') == '40')).toBe(true);
           });
           it('Checking opposed position for y-axis', () => {
               heatmap.yAxis.opposedPosition = true;
               heatmap.refresh();
               text = document.getElementById('container_YAxisLine');
              expect((text.getAttribute('x1') == '695' || text.getAttribute('x1') == '701') && (text.getAttribute('y1') == '62' || text.getAttribute('y1') == '60')).toBe(true);
           });

           it('Checking y-axis with inversed', () => {
            heatmap.yAxis.isInversed = true;
            heatmap.refresh();
            text = document.getElementById('container_YAxis_Label0');        
            expect(text.textContent == 'test').toBe(true);  
        });

        it('Checking x-axis with label rotation', () => {
            heatmap.xAxis.isInversed = false;
            heatmap.xAxis.labelRotation = 45;
            heatmap.refresh();
            text = document.getElementById('container_XAxis_Label0');        
            expect(text.textContent == 'test').toBe(true);
            expect((text.getAttribute('x') == '78.5' || text.getAttribute('x') == '79.1') && (text.getAttribute('y') == '53.500892639160156' || text.getAttribute('y') == '49.860291481018066')).toBe(true);
        });

        it('Checking x-axis with label rotation', () => {
            heatmap.xAxis.isInversed = false;
            heatmap.xAxis.labelRotation = 405;
            heatmap.refresh();
            text = document.getElementById('container_XAxis_Label0');        
            expect(text.textContent == 'test').toBe(true);
            expect((text.getAttribute('x') == '78.5' || text.getAttribute('x') == '79.1') && (text.getAttribute('y') == '53.500892639160156' || text.getAttribute('y') == '49.860291481018066')).toBe(true);
        });

        it('Checking x-axis with label rotation', () => {
            heatmap.xAxis.labelRotation = 270;
            heatmap.refresh();
            text = document.getElementById('container_XAxis_Label0');        
            expect(text.textContent == 'test').toBe(true);  
            expect((text.getAttribute('x') == '78.5' || text.getAttribute('x') == '79.1') && (text.getAttribute('y') == '52.75' || text.getAttribute('y') == '49.015625')).toBe(true);
        });

        it('Checking x-axis with label rotation', () => {
            heatmap.xAxis.labelRotation = 0;
            heatmap.xAxis.interval = 2;
            heatmap.refresh();
            text = document.getElementById('container_XAxis_Label1');        
            expect(text.textContent == 'test2').toBe(true);  
        });
        it('Checking x-axis with label rotation without trim', function () {
            heatmap.xAxis.labelRotation = 180;
            heatmap.xAxis.interval = 1;
            heatmap.xAxis.labelIntersectAction = "None";
            heatmap.refresh();
            text = document.getElementById('container_XAxis_Label1');
            expect(text.textContent == 'test1').toBe(true);
            expect((text.getAttribute('x') == '215.5' || text.getAttribute('x') == '217.29999999999998') && (text.getAttribute('y') == '44' || text.getAttribute('y') == '43')).toBe(true);
        });
        it('Checking x-axis with label rotation without trim in opposed position', function () {
            heatmap.xAxis.labelRotation = 45;
            heatmap.xAxis.interval = 1;
            heatmap.xAxis.opposedPosition = false;
            heatmap.refresh();
            text = document.getElementById('container_XAxis_Label1');
            expect(text.textContent == 'test1').toBe(true);
            expect((text.getAttribute('x') == '215.5' || text.getAttribute('x') == '217.29999999999998') && (text.getAttribute('y') == '398.7861557006836' || text.getAttribute('y') == '402.02900981903076')).toBe(true);
        });
        it('Checking x-axis with minimum and maximum', () => {
            heatmap.xAxis.interval = 1;
            heatmap.xAxis.minimum =1;
            heatmap.xAxis.maximum = 6;
            heatmap.xAxis.opposedPosition = true;
            heatmap.refresh();
            text = document.getElementById('container_XAxis_Label0');        
            expect(text.textContent == 'test1').toBe(true);  
            text = document.getElementById('container_XAxis_Label5');        
            expect(text.textContent == '6').toBe(true);  
        });
        it('Checking x-axis with minimum and maximum', () => {
            heatmap.xAxis.minimum =6;
            heatmap.xAxis.maximum = 1;
            heatmap.refresh();
            text = document.getElementById('container_XAxis_Label0');        
            expect(text.textContent == 'test1').toBe(true);  
            text = document.getElementById('container_XAxis_Label5');        
            expect(text.textContent == '6').toBe(true);  
        });

        it('Checking x-axis with numeric value type', () => {
            heatmap.xAxis.labels = [];
            heatmap.xAxis.valueType = "Numeric";
            heatmap.xAxis.minimum = 0;
            heatmap.xAxis.maximum = 10;
            heatmap.xAxis.interval = null;
            heatmap.refresh();
            text = document.getElementById('container_XAxis_Label0');
            expect(text.textContent == '0').toBe(true);
            text = document.getElementById('container_XAxis_Label10');
            expect(text.textContent == '10').toBe(true); 
        });

        it('Checking x-axis with numeric value type', function () {
            heatmap.xAxis.valueType = "Numeric";
            heatmap.xAxis.minimum = 10;
            heatmap.xAxis.maximum = 1;
            heatmap.xAxis.interval = 2;
            heatmap.refresh();
            text = document.getElementById('container_XAxis_Label1');
            expect(text.textContent == '3').toBe(true);
        });
        it('Checking x-axis with numeric value type', function () {
            heatmap.xAxis.valueType = "Numeric";
            heatmap.xAxis.labels = null;
            heatmap.xAxis.interval = 1;
            heatmap.xAxis.minimum = null;
            heatmap.xAxis.maximum =null;
            heatmap.xAxis.labelFormat = "{value}%";
            heatmap.refresh();
            text = document.getElementById('container_XAxis_Label0');
            expect(text.textContent == '0%').toBe(true);
        });

        //Date Time axis
        it('Checking date time axis', function () {
            heatmap.xAxis.valueType = "DateTime";
            heatmap.xAxis.labels = null;
            heatmap.xAxis.interval = 1;
            heatmap.xAxis.minimum = null;
            heatmap.xAxis.maximum =null;
            heatmap.xAxis.labelFormat = null;
            heatmap.refresh();
            text = document.getElementById('container_XAxis_Label0');
            expect(text.textContent == '0').toBe(true);
        });
        it('Checking date time axis with minimum and maximum', function () {
            heatmap.xAxis.valueType = "DateTime";
            heatmap.xAxis.labels = null;
            heatmap.xAxis.interval = null;
            heatmap.xAxis.minimum = new Date(2018,0,1);
            heatmap.xAxis.maximum =new Date(2018,0,4);
            heatmap.xAxis.labelFormat = null;
            heatmap.refresh();
            text = document.getElementById('container_XAxis_Label0');
            expect(text.textContent == '1/1/2018').toBe(true);
        });
        it('Checking date time axis with minimum', function () {
            heatmap.xAxis.valueType = "DateTime";
            heatmap.xAxis.labels = null;
            heatmap.xAxis.interval = null;
            heatmap.xAxis.minimum = new Date(2018,0,1);
            heatmap.xAxis.maximum = null;
            heatmap.xAxis.labelFormat = null;
            heatmap.refresh();
            text = document.getElementById('container_XAxis_Label4');
            expect(text.textContent == '1/5/2018').toBe(true);
        });
        it('Checking date time axis with maximum', function () {
            heatmap.xAxis.valueType = "DateTime";
            heatmap.xAxis.labels = null;
            heatmap.xAxis.interval = null;
            heatmap.xAxis.minimum = null;
            heatmap.xAxis.maximum = new Date(2018,0,6);
            heatmap.xAxis.labelFormat = null;
            heatmap.refresh();
            text = document.getElementById('container_XAxis_Label0');
            expect(text.textContent == '1/2/2018').toBe(true);
        });

        it('Checking date time axis with Years interval type', function () {
            heatmap.xAxis.valueType = "DateTime";
            heatmap.xAxis.labels = null;
            heatmap.xAxis.interval = null;
            heatmap.xAxis.intervalType = "Years",
            heatmap.xAxis.minimum = new Date(2018,0,1);
            heatmap.xAxis.maximum = new Date(2022,0,1);
            heatmap.xAxis.labelFormat = null;
            heatmap.refresh();
            text = document.getElementById('container_XAxis_Label0');
            expect(text.textContent == 'Jan 2018').toBe(true);
        });
        it('Checking date time axis with Months interval type', function () {
            heatmap.xAxis.valueType = "DateTime";
            heatmap.xAxis.labels = null;
            heatmap.xAxis.interval = null;
            heatmap.xAxis.intervalType = "Months",
            heatmap.xAxis.minimum = new Date(2018,0,1);
            heatmap.xAxis.maximum = null;
            heatmap.xAxis.labelFormat = null;
            heatmap.refresh();
            text = document.getElementById('container_XAxis_Label0');
            expect(text.textContent == 'Jan 1').toBe(true);
        });
        it('Checking date time axis with Hours interval type', function () {
            heatmap.xAxis.valueType = "DateTime";
            heatmap.xAxis.labels = null;
            heatmap.xAxis.interval = null;
            heatmap.xAxis.intervalType = "Hours",
            heatmap.xAxis.minimum = new Date(2018,0,1,10);
            heatmap.xAxis.maximum = null;
            heatmap.xAxis.labelFormat = null;
            heatmap.refresh();
            text = document.getElementById('container_XAxis_Label4');
            expect(text.textContent == 'Mon 14:00').toBe(true);
        });
        it('Checking date time axis with Minutes interval type', function () {
            heatmap.xAxis.valueType = "DateTime";
            heatmap.xAxis.labels = null;
            heatmap.xAxis.interval = null;
            heatmap.xAxis.intervalType = "Minutes",
            heatmap.xAxis.minimum = new Date(2018,0,1,10,10);
            heatmap.xAxis.maximum = null;
            heatmap.xAxis.labelFormat = null;
            heatmap.refresh();
            text = document.getElementById('container_XAxis_Label4');
            expect(text.textContent == '10:14:00').toBe(true);
        });
        //Check label intersect action 
        it('Check the Rotate45 label intersect action for x-axis', function () {
            heatmap.xAxis.valueType = "Category";
            heatmap.xAxis.labels = ["India","America","Australia","Srilanka","South Africa"];
            heatmap.xAxis.interval = null;
            heatmap.xAxis.intervalType = null,
            heatmap.xAxis.minimum = null;
            heatmap.xAxis.maximum = null;
            heatmap.xAxis.labelFormat = "";
            heatmap.xAxis.labelIntersectAction = "Rotate45";
            heatmap.height = "600px";
            heatmap.width ="300px",
            heatmap.dataSource = [
                [1,2,3,4,5],
                [6,7,8,9,10],
                [11,12,13,14,15],
                [16,17,18,19,20],
                [21,22,23,24,25],
            ],
            heatmap.refresh();
            text = document.getElementById('container_XAxis_Label0');
            expect((text.getAttribute('x') == '31.8' || text.getAttribute('x') == '32.2') && (text.getAttribute('y') == '78.1170482635498' || text.getAttribute('y') == '75.0620174407959')).toBe(true);
        });

        it('Check the Rotate45 label intersect action for x-axis', function () {
            heatmap.xAxis.labelIntersectAction = "Rotate45";
            heatmap.xAxis.isInversed = true;
            heatmap.refresh();
            text = document.getElementById('container_XAxis_Label0');
            expect((text.getAttribute('x') == '206.2' || text.getAttribute('x') == '209.8') && (text.getAttribute('y') == '78.1170482635498' || text.getAttribute('y') == '75.0620174407959')).toBe(true);
        });
        it('Checking auto increment in numeric axis', function () {
            heatmap.xAxis.labelIntersectAction = "Trim";
            heatmap.xAxis.valueType = "Numeric";
            heatmap.refresh();
            text = document.getElementById('container_XAxis_Label1');
            expect(text.textContent == "1").toBe(true);
            heatmap.xAxis.increment = 3;
            heatmap.refresh();
            text = document.getElementById('container_XAxis_Label1');
            expect(text.textContent == "3").toBe(true);
        });
        it('Checking auto increment in date time axis', function () {
            heatmap.yAxis.valueType = "DateTime";
            heatmap.yAxis.minimum = new Date(2017, 0, 1);
            heatmap.yAxis.intervalType = "Months";
            heatmap.yAxis.increment = 3;
            heatmap.refresh();
            text = document.getElementById('container_YAxis_Label1');
            expect(text.textContent == "Apr 1").toBe(true);
        });
        it('Checking yAxis with interval type-Months and showLabelOn-Years', function () {
            heatmap.dataSource = [
                [10, 8, 7, 7, 10, 14, 17, 18, 18, 17, 16, 15, 12, 10, 8, 7, 7, 10, 14, 17, 18, 18, 10, 8,7, 7, 10, 20, 15, 18,
                     20, 21, 20, 20, 10, 8, 7, 7, 10, 14, 17, 18, 18, 17, 16, 15, 12, 10, 8, 7, 7, 20, 10, 20, 15, 18, 20, 21, 20, 20,18],
                [10, 8, 7, 6, 8, 13, 15, 17, 20, 10, 8, 7, 7, 10, 14, 17, 18, 18, 17, 17, 15, 11, 9, 8, 7, 7, 12, 16, 18, 20, 19,
                     19, 20, 17, 12, 10, 8, 7, 6, 8, 13, 15, 17, 20, 17, 17, 15, 11, 9, 8, 7, 7, 12, 16, 18, 20, 19, 19, 17, 12,22],
                [12, 10, 8, 7, 7, 10, 20, 15, 18, 20, 21, 20, 17, 10, 8, 10, 8, 7, 7, 10, 14, 17, 18, 18, 7, 7, 10, 14, 17, 18, 18,
                     17, 16, 15,12, 10, 20, 8, 7, 7, 10, 20, 15, 18, 20, 21, 20, 17, 10, 8, 7, 7, 10, 14, 17, 18, 18, 17, 16, 15,24],
                [11, 9, 8, 7, 7, 12, 16, 18, 20, 19, 19, 17, 15, 15, 15,  10, 8, 7, 7, 10, 14, 17, 18, 18,15, 15, 16, 20, 22, 20, 21,
                     21, 21, 19,11, 9, 20, 8, 7, 7, 12, 16, 18, 20, 19, 19, 17, 15, 15, 15, 15, 15, 16, 20, 22, 20, 21, 21,19, 21, 19],
                [15, 15, 15, 15, 16, 20, 22, 20, 21, 10, 8, 7, 7, 10, 14, 17, 18, 18, 21, 21, 19, 18, 13, 13, 12, 12, 20, 12, 15, 18, 21,
                     22, 20, 21, 19, 15, 15, 15, 15, 16, 20, 22, 20, 21, 21, 21, 19, 18, 13, 13, 12, 12, 20, 12, 15, 18,17, 21, 22, 21, 19],
                [10, 8, 7, 6, 8, 13, 15, 17, 20, 10, 8, 7, 7, 10, 14, 17, 18, 18, 17, 17, 15, 11, 9, 8, 7, 7, 12, 16, 18, 20, 19, 19, 20,
                     17, 12, 10, 8, 7, 6, 8, 13, 15, 17, 20, 17, 17, 15, 11, 9, 8, 7, 7, 12, 16, 18, 20, 19, 19, 17, 12,22],
                [13, 13, 12, 12, 20, 12, 15, 18, 21, 22, 10, 8, 7, 7, 10, 14, 17, 18, 18, 21, 19, 11, 10, 9, 9, 10, 12, 20, 14, 16, 17, 17,
                     20, 16, 16, 13, 13, 12, 12, 20, 12, 15, 18, 21, 22, 21, 19, 11, 10, 9, 9, 10, 12, 20, 14, 16, 17,15, 17, 16, 16],
                [11, 9, 8, 7, 7, 12, 16, 18, 20, 19, 19, 17, 15, 15, 15,  10, 8, 7, 7, 10, 14, 17, 18, 18,15, 15, 16, 20, 22, 20, 21, 21,
                     21, 19,11, 9, 20, 8, 7, 7, 12, 16, 18, 20, 19, 19, 17, 15, 15, 15, 15, 15, 16, 20, 22, 20, 21, 21,19, 21, 19],
                [11, 10, 9, 9, 10, 12, 20, 14, 16, 17, 17, 16, 13, 13, 12, 10, 8, 7, 7, 10, 14, 17, 18, 18, 11, 10, 9, 9, 10, 12, 20, 14,
                     20, 16, 17, 17, 16, 13, 13, 12, 12, 20, 12, 15, 18, 21, 22, 21, 25, 14, 12, 20, 12, 15, 18, 21, 22,16, 21, 25, 14,]
            ];
            heatmap.yAxis.increment = 1;
            heatmap.yAxis.showLabelOn = "Years";
            heatmap.yAxis.labelFormat = "MMM/dd/y";
            heatmap.refresh();
            text = document.getElementById('container_YAxis_Label1');
            expect(text.textContent == "Jan/01/2018").toBe(true);
        });
        it('Checking yAxis with interval type-Days and showLabelOn-Months', function () {
            heatmap.yAxis.showLabelOn = "Months";
            heatmap.yAxis.intervalType = "Days";
            heatmap.refresh();
            text = document.getElementById('container_YAxis_Label1');
            expect(text.textContent == "Feb/01/2017").toBe(true);
        });
        it('Checking yAxis with interval type-Hours and showLabelOn-Days', function () {
            heatmap.yAxis.showLabelOn = "Days";
            heatmap.yAxis.intervalType = "Hours";
            heatmap.refresh();
            text = document.getElementById('container_YAxis_Label1');
            expect(text.textContent == "Jan/02/2017").toBe(true);
        });
        it('Checking yAxis with interval type-Minutes and showLabelOn-Hours', function () {
            heatmap.yAxis.showLabelOn = "Hours";
            heatmap.yAxis.intervalType = "Minutes";
            heatmap.yAxis.labelFormat = "hh:mm:ss";
            heatmap.refresh();
            text = document.getElementById('container_YAxis_Label1');
            expect(text.textContent == "01:00:00").toBe(true);
        });
        it('Checking auto increment in date time axis in xaxis', function () {
            heatmap.xAxis.valueType = "DateTime";
            heatmap.width = '200px';
            heatmap.xAxis.isInversed = false;
            heatmap.xAxis.labelRotation = 0;
            heatmap.xAxis.minimum = new Date(2017, 0, 1);
            heatmap.xAxis.intervalType = "Months";
            heatmap.xAxis.increment = 3;
            heatmap.refresh();
            text = document.getElementById('container_XAxis_Label2');
            expect(text.textContent == "Jul..." || text.textContent == "Ju...").toBe(true);
        });
        it('Checking axis tooltip position when it crosses the SVG rect', () => {
            heatmap.xAxis.opposedPosition = false;
            heatmap.xAxis.title.text = '';
            heatmap.yAxis.opposedPosition = false;
            heatmap.height = '400px';
            heatmap.width ='250px'
            heatmap.margin.bottom = 0;
            heatmap.margin.right = 0;
            heatmap.refresh();
            let Element: HTMLElement = document.getElementById('container_XAxis_Label8');
            let region: ClientRect = Element.getBoundingClientRect();
            trigger.mousemoveEvent(Element, 0, 0, region.left + 5, region.top + 5, false);
            let tooltip: HTMLElement = document.getElementById('container_axis_Tooltip');
            expect(tooltip.style.top === '352px' || tooltip.style.top === '355px' ).toBe(true);
        });
        it('Checking x-axis border type -brace ', function () {
            heatmap.width = '400px';
            heatmap.xAxis.border.width = 1;
            heatmap.xAxis.border.type = 'Brace';
            heatmap.refresh();
            expect(document.getElementById('containerXAxisLabelBorder') !== null).toBe(true);
        });
        it('Checking x-axis border type - WithoutTopBorder', function () {
            heatmap.xAxis.border.type = 'WithoutTopBorder';
            heatmap.renderingMode = 'Canvas';
            heatmap.xAxis.multiLevelLabels= [
                {
                    border: { color: '#b5b5b5', type: 'WithoutTopBorder'},
                    categories: [
                        { start: 0, end: 8, text: 'Testing 3', },
                    ]
                }
            ];
            heatmap.refresh();
        });
        it('Checking x-axis border type - WithoutBottomBorder', function () {
            heatmap.renderingMode = 'SVG';
            heatmap.xAxis.border.type = 'WithoutBottomBorder';
            heatmap.refresh();
            expect(document.getElementById('containerXAxisLabelBorder') !== null).toBe(true);
        });
        it('Checking x-axis border type - WithoutTopandBottomBorder', function () {
            heatmap.xAxis.border.type = 'WithoutTopandBottomBorder';
            heatmap.refresh();
            expect(document.getElementById('containerXAxisLabelBorder') !== null).toBe(true);
        });
        it('Checking y-axis border type -brace ', function () {
             heatmap.yAxis.border.type = 'Brace';
             heatmap.yAxis.border.width = 1;
             heatmap.yAxis.interval = 1;
            heatmap.refresh();
            expect(document.getElementById('containerYAxisLabelBorder') !== null).toBe(true);
        });
        it('Checking y-axis border type - WithoutTopBorder', function () {
            heatmap.yAxis.border.type = 'WithoutTopBorder';
            heatmap.refresh();
            expect(document.getElementById('containerYAxisLabelBorder') !== null).toBe(true);
        });
        it('Checking y-axis border type - WithoutBottomBorder', function () {
            heatmap.yAxis.border.type = 'WithoutBottomBorder';
            heatmap.refresh();
            expect(document.getElementById('containerYAxisLabelBorder') !== null).toBe(true);
        });
        it('Checking y-axis border type - WithoutTopandBottomBorder', function () {
            heatmap.yAxis.border.type = 'WithoutTopandBottomBorder';
            heatmap.refresh();
            expect(document.getElementById('containerYAxisLabelBorder') !== null).toBe(true);
        });
        it('Checking x-axis grouping ', function () {
            heatmap.width = '400px';
            heatmap.renderingMode = 'SVG';
            heatmap.xAxis.multiLevelLabels= [
                {
                    alignment: 'Near',
                    overflow: 'None',
                    border: { color: '#b5b5b5', type: 'WithoutBottomBorder' },
                    categories: [
                        { start: 0, end: 4, text: 'Testing 1 Testing 1 Testing 1 Testing 1'},
                        { start: 5, end: 8, text: 'Testing 2', },
                    ]
                },
                {
                    border: { color: '#b5b5b5', type: 'WithoutTopBorder'},
                    categories: [
                        { start: 0, end: 8, text: 'Testing 3', },
                    ]
                },
                {
                    alignment: 'Far',
                    border: { color: '#b5b5b5', type: 'WithoutTopandBottomBorder' },
                    categories: [
                        { start: 0, end: 4, text: 'Testing 4', },
                    ]
                },
                
            ];
            heatmap.refresh();
            text = document.getElementById('container_XAxis_MultiLevel1_Text0');
            expect(text.textContent == "Testing 3").toBe(true);
        });
        it('Checking x-axis grouping with trimmed label', function () {
            heatmap.xAxis.valueType = 'Numeric',
            heatmap.xAxis.minimum = 1,
            heatmap.xAxis.multiLevelLabels= [
                {
                    overflow: 'Trim',
                    border: { color: '#b5b5b5', type: 'WithoutBottomBorder' },
                    categories: [
                        { start: 1, end: 4, text: 'Testing 1 Testing 1 Testing 1 Testing 1', maximumTextWidth: 30},
                        { start: 5, end: 8, text: 'Testing 2', },
                    ]
                }
            ];
            heatmap.dataBind();
            text = document.getElementById('container_XAxis_MultiLevel0_Text0');
            expect(text.textContent == "Te..." || text.textContent == 'T...').toBe(true);
        });
        it('Checking x-axis grouping with inversed axis and opposed position', function () {
            heatmap.xAxis.isInversed = true;
            heatmap.xAxis.valueType = 'DateTime',
            heatmap.xAxis.minimum = new Date(2018,0,1);
            heatmap.xAxis.opposedPosition = true;
            heatmap.xAxis.border.width = 1;
            heatmap.xAxis.multiLevelLabels= [
                {
                    overflow:'Trim',
                    border: { color: '#b5b5b5' },
                    categories: [
                        { start:'1/1/2017', end: '1/5/2017',  text: 'Testing 1 Testing 1 Testing 1 Testing 1', maximumTextWidth: 30},
                        { start: 6, end: 8, text: 'Testing 2', },
                    ]
                },
                {
                    alignment:'Far',
                    border: { color: '#b5b5b5', type: 'Brace' },
                    categories: [
                        { start: 0, end: 8, text: 'Testing 3', },
                    ]
                },
                {
                    alignment:'Near',
                    border: { color: '#b5b5b5' },
                    categories: [
                        { start: 0, end: 4, text: 'Testing 4', },
                    ]
                }
            ];
            heatmap.refresh();
            text = document.getElementById('container_XAxis_MultiLevel0_Text0');
            expect(text.textContent == "Te..." || text.textContent == 'T...').toBe(true);
        });
        it('Checking y-axis grouping with opposed position', function () {
            heatmap.yAxis.opposedPosition = true;
            heatmap.yAxis.showLabelOn = 'None';
            heatmap.yAxis.multiLevelLabels= [
                {
                    alignment: 'Near',
                    border: { width: 1, type: 'WithoutTopandBottomBorder' },
                    categories: [
                        { start: 0, end: 6,  text: 'Testing 1'},
                        { start: 7, end: 11, text: 'Testing 2', },
                    ]
                },
                {
                    border: { color: '#b5b5b5', type: 'WithoutBottomBorder'},
                    categories: [
                        { start: 0, end: 11, text: 'Testing 3', },
                    ]
                },
                {
                    alignment: 'Far',
                    border: { color: '#b5b5b5', type: 'WithoutTopBorder' },
                    categories: [
                        { start: 0, end: 4, text: 'Testing 4', },
                    ]
                }
            ];
            heatmap.refresh();
            text = document.getElementById('container_YAxis_MultiLevel0_Text0');
            expect(text.textContent == "Testing 1").toBe(true);
        });
        it('Checking y-axis grouping with inversed axis', function () {
            heatmap.yAxis.isInversed = false;
            heatmap.yAxis.opposedPosition = false;
            heatmap.yAxis.intervalType = 'Minutes';
            heatmap.yAxis.multiLevelLabels= [
                {
                    overflow: 'Trim',
                    border: { color: '#b5b5b5' },
                    categories: [
                        { start: 0, end: 6, text: 'Testing 1', maximumTextWidth: 30},
                        { start: 7, end: 11, text: 'Testing 2', },
                    ]
                },
                {
                    alignment: 'Far',
                    border: { color: '#b5b5b5', type: 'Brace' },
                    categories: [
                        { start: new Date(2017, 0, 1), end: new Date(2017, 0, 11), text: 'Testing 3', },
                    ]
                },
                {
                    alignment: 'Near',
                    border: { color: '#b5b5b5' },
                    categories: [
                        { start: new Date(2017, 0, 1, 12, 0), end: new Date(2017, 0, 5, 12, 9), text: 'Testing 3', },
                    ]
                }
            ];
            heatmap.refresh();
            text = document.getElementById('container_YAxis_MultiLevel1_Text0');
            expect(text.textContent == "Testing 3").toBe(true);
        });
        it('Checking y-axis grouping with interval type hours', function () {
            heatmap.yAxis.intervalType = 'Hours';
            heatmap.refresh();
            text = document.getElementById('container_YAxis_MultiLevel1_Text0');
            expect(text.textContent == "Testing 3").toBe(true);
        });
        it('Checking y-axis grouping with interval type years', function () {
            heatmap.yAxis.intervalType = 'Years';
            heatmap.yAxis.multiLevelLabels= [
                {
                    categories: [
                        { start: new Date(2017, 3, 1), end: new Date(2018, 5, 5), text: 'Testing 3', },
                    ]
                }
            ];
            heatmap.refresh();
            text = document.getElementById('container_YAxis_MultiLevel0_Text0');
            expect(text.textContent == "Testing 3").toBe(true);
        });
    });
    it('memory leak', () => {     
        profile.sample();
        let average: any = inMB(profile.averageChange)
        //Check average change in memory samples to not be over 10MB
        expect(average).toBeLessThan(10);
        let memory: any = inMB(getMemoryProfile())
        //Check the final memory usage against the first usage, there should be little change if everything was properly deallocated
        expect(memory).toBeLessThan(profile.samples[0] + 0.25);
    })
});
