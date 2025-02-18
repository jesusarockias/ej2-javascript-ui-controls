import { createElement } from '@syncfusion/ej2-base';
import { Diagram } from '../../../src/diagram/diagram';
import { DiagramElement } from '../../../src/diagram/core/elements/diagram-element';
import { ConnectorModel } from '../../../src/diagram/objects/connector-model';
import { Segments } from '../../../src/diagram/enum/enum';
import  {profile , inMB, getMemoryProfile} from '../../../spec/common.spec';
/**
 * Connector Annotations
 */
describe('Diagram Control', () => {

    describe('Straight segment annotation with offset 0', () => {
        let diagram: Diagram;
        let ele: HTMLElement;

        beforeAll((): void => {
            const isDef = (o: any) => o !== undefined && o !== null;
                if (!isDef(window.performance)) {
                    console.log("Unsupported environment, window.performance.memory is unavailable");
                    this.skip(); //Skips test (in Chai)
                    return;
                }
            ele = createElement('div', { id: 'diagramk1' });
            document.body.appendChild(ele);
            let connector1: ConnectorModel = {
                id: 'connector1',
                type: 'Straight',
                sourcePoint: { x: 100, y: 100 },
                targetPoint: { x: 200, y: 100 },
                annotations: [{ 'content': 'label', 'offset': 0, 'alignment': 'Center' }]
            };

            let connector2: ConnectorModel = {
                id: 'connector2',
                type: 'Straight',
                sourcePoint: { x: 300, y: 100 },
                targetPoint: { x: 400, y: 100 },
                annotations: [{ 'content': 'label', 'offset': 0, 'alignment': 'Before' }]
            };


            let connector3: ConnectorModel = {
                id: 'connector3',
                type: 'Straight',
                sourcePoint: { x: 500, y: 100 },
                targetPoint: { x: 600, y: 100 },
                annotations: [{ 'content': 'label', 'offset': 0, 'alignment': 'After' }]
            };

            diagram = new Diagram({ mode: 'Canvas', width: 1000, height: 1000, connectors: [connector1, connector2, connector3] });
            diagram.appendTo('#diagramk1');
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });


        it('Checking alignment, offset 1, for reverse straight connector in SVG rendering Mode', (done: Function) => {
            diagram.connectors[0].annotations[0].offset = 1;
            diagram.connectors[1].annotations[0].offset = 1;
            diagram.connectors[2].annotations[0].offset = 1;
            diagram.dataBind();
            if (diagram.connectors.length) {
                let element1: DiagramElement = diagram.connectors[0].wrapper.children[3];
                let element2: DiagramElement = diagram.connectors[1].wrapper.children[3];
                let element3: DiagramElement = diagram.connectors[2].wrapper.children[3];
                expect(Math.ceil(element1.offsetX) === 188 && Math.ceil(element1.offsetY) === 100 &&
                    Math.ceil(element2.offsetX) === 388 && Math.ceil(element2.offsetY)===93 &&
                    Math.ceil(element3.offsetX) === 588 && Math.ceil(element3.offsetY )=== 108).toBe(true);
            }
            done();
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
});