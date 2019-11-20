import { LightningElement, api, wire, track } from 'lwc';
import findEntitlements from '@salesforce/apex/BIN_CoreAddressDAO.getNewBinSetEntitlements';

import Request_New_Bin_Entitlements_Title from '@salesforce/label/c.Request_New_Bin_Entitlements_Title';

export default class Bin_AddressEntitlement extends LightningElement {
   
    @api entitlements = [];
    @track error;

    labelEntitlementsList = Request_New_Bin_Entitlements_Title;

    // Wire: Retrieve the list of Entitlements (custom metadata) given a land use code
    @wire(findEntitlements, { landUseCode: '$landUseCode' })
    loadEntitlements({ error, data }) {
        if (data) {
            this.entitlements = data;
            this.error = undefined;
        } else if (error) {
            this.error = error.body.message;
            this.entitlements = [];
        }

        // Dispache "entitlementchanged" event
        this.dispatchEvent(
            new CustomEvent("entitlementchanged", {
                detail: this.entitlements,
            })
        );
    }

    // Used this field as API with get and set as a trick to not show the "error message" before the wire is loaded
    @api landUseCode;
    get landUseCode() {
        return this._landUseCode;
    }
    set landUseCode(value) {
        this._landUseCode = value;
        // this.showSpinner = true;
    }

    // GET: Show Entitlement flag
    get showEntitlements(){
        return (this.entitlements.length > 0);
    }

    // GET: Result not found flag
    get resultNotFound(){
        return (this.landUseCode && 
                this.landUseCode.length > 0 && 
                this.entitlements.length === 0)
    }

}