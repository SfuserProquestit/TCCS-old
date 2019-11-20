/* eslint-disable no-console */
import { LightningElement, api, track } from 'lwc';

import CONTACT_TITLE from '@salesforce/schema/Case.Contact_Title__c';
import CONTACT_FIRST_NAME from '@salesforce/schema/Case.Caller_First_Name__c';
import CONTACT_LAST_NAME from '@salesforce/schema/Case.Caller_Last_Name__c';
import CONTACT_EMAIL from '@salesforce/schema/Case.Caller_Email__c';
import CONTACT_PRIMARY_PHONE from '@salesforce/schema/Case.Caller_Primary_Phone__c';
import CONTACT_OTHER_PHONE from '@salesforce/schema/Case.Caller_Other_Phone__c';
import CONTACT_PREFERRED_CONTACT_METHOD from '@salesforce/schema/Case.Preferred_Contact_Method__c';



export default class Bin_serviceRequestContactDetail extends LightningElement {
    @api recordId;
    @api objectApiName;
    @api reviewMode;

    fields = [  CONTACT_TITLE,
                CONTACT_FIRST_NAME,
                CONTACT_LAST_NAME,
                CONTACT_EMAIL,
                CONTACT_PRIMARY_PHONE,
                CONTACT_OTHER_PHONE,
                CONTACT_PREFERRED_CONTACT_METHOD
            ];

    @track showEmailRequiredMsg = 'hideFieldRequired';
    @track showOtherPhoneRequiredMsg = 'hideFieldRequired';
    @track showMobileRequiredMsg = 'hideFieldRequired';

    @track showEmailRequiredClass = '';
    @track showOtherPhoneRequiredClass = '';
    @track showMobileRequiredClass = '';
    
    handleFieldChange(e) {
        this.contactRecord[e.currentTarget.fieldName] = e.target.value;
    }

    checkPreferredContactMethod(formFields){

        this.isValid = true;

        this.showEmailRequiredMsg = 'hideFieldRequired';
        this.showOtherPhoneRequiredMsg = 'hideFieldRequired';
        this.showMobileRequiredMsg = 'hideFieldRequired';

        this.showEmailRequiredClass = '';
        this.showMobileRequiredClass = '';
        this.showOtherPhoneRequiredClass = '';

        if (formFields.Preferred_Contact_Method__c === 'Mobile' && 
            formFields.Caller_Primary_Phone__c === null){

            this.isValid = false;
            this.showMobileRequiredMsg = 'fieldRequired slds-text-color_destructive'
            this.showMobileRequiredClass = 'slds-has-error'

        }

        else if (formFields.Preferred_Contact_Method__c === 'Email' && 
                    formFields.Caller_Email__c === null){
                        
            this.isValid = false;
            this.showEmailRequiredMsg = 'fieldRequired slds-text-color_destructive'
            this.showEmailRequiredClass = 'slds-has-error'
        }

        else if (formFields.Preferred_Contact_Method__c === 'Other Phone' && 
                    formFields.Caller_Other_Phone__c === null){

            this.isValid = false;
            this.showOtherPhoneRequiredMsg = 'fieldRequired slds-text-color_destructive'
            this.showOtherPhoneRequiredClass = 'slds-has-error'
        }
      
        return this.isValid;
    }

    handleSubmit(event){
        event.preventDefault();

        let formFields = event.detail.fields;

        let isSuccess = this.checkPreferredContactMethod(formFields);
           
        console.log('isSuccess====' + isSuccess);
        if(isSuccess){
            this.dispatchEvent(
                new CustomEvent("savecontactdetails", {
                    detail: formFields,
                })
            );
        }

        return isSuccess;
        
    }

    clickPreviousButton(){
        this.dispatchEvent(
            new CustomEvent("clickpreviousbutton", {
                detail: null,
            })
        );
    }


}