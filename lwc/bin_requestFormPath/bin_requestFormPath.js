/* eslint-disable no-console */
import { LightningElement, api} from 'lwc';

export default class Bin_requestFormPath extends LightningElement {
    @api paths;
    @api currentStage;

    handleStageClick(event){
        event.preventDefault();
        let changeToStage = event.currentTarget.dataset.item;
        console.log('changeToStage===' + changeToStage);
        console.log('this.currentStage===' + this.currentStage);
        
        if (this.currentStage > changeToStage){
            this.dispatchEvent(
                new CustomEvent("stageclick", {
                    detail: changeToStage
                })
            );
        }
    }
}