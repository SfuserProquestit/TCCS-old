import { LightningElement, track } from 'lwc';

export default class Bin_addressContainer extends LightningElement {
    @track addressId;
    @track landUseCode;

    handleAddressValueChange(event){
        this.addressId = event.detail;
    }
    
    handleLandUseCodeChange(event){
        this.landUseCode = event.detail;
    }
}