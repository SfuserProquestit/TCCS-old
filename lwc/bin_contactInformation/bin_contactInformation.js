import { LightningElement, wire } from 'lwc';
import { getPicklistValues }  from 'lightning/uiObjectInfoApi';
//import Contact_Title__c from '@salesforce/schema/Case.Contact_Title__c';
import Origin_FIELD from '@salesforce/schema/Case.Origin';

export default class Bin_contactInformation extends LightningElement {

    track
    contact =
        {
            Id: 1,
            FirstName: "Mark",
            LastName: "Smith",
            Email: "msmith125@example.com",
            Mobile: "0435 455 655",
            LandLine: "",
            PreferredContactMethod: "",
            RequestForSomeoneElse: true,
            RequestedFirstName: "",
            RequesteeFirstName: "",
            RequesteeLastName: ""
        };

    @wire(getPicklistValues, {
        recordTypeId: '0120k000000IslRAAS', fieldApiName: Origin_FIELD
    })
    titlePicklistValues;
    /*get titlePicklistValues() {
        return this._titlePicklistValues;
    }
    set titlePicklistValues(value) {
        this._titlePicklistValues = value;
    }*/

    handleChange(event) {
        this.value = event.detail.value;
    }
}