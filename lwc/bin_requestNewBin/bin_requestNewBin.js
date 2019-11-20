/* eslint-disable no-console */
import { LightningElement, track, api, wire } from 'lwc';
import { getObjectInfo } from 'lightning/uiObjectInfoApi';
import { createRecord } from 'lightning/uiRecordApi';
import getRequestNumber from '@salesforce/apex/BIN_ServiceRequestDAO.getRequestNumber';


// LABELS
import Request_New_Bin_Page_Title from '@salesforce/label/c.Request_New_Bin_Page_Title'; 
import Request_New_Bin_Step_1 from '@salesforce/label/c.Request_New_Bin_Step_1'; 
import Request_New_Bin_Step_2 from '@salesforce/label/c.Request_New_Bin_Step_2'; 
import Request_New_Bin_Step_3 from '@salesforce/label/c.Request_New_Bin_Step_3'; 
import Request_New_Bin_Review_Title from '@salesforce/label/c.Request_New_Bin_Review_Title'; 
import Service_Request_Form_Edit_Details_Button from '@salesforce/label/c.Service_Request_Form_Edit_Details_Button'; 
import Request_New_Bin_Path_1 from '@salesforce/label/c.Request_New_Bin_Path_1'; 
import Request_New_Bin_Path_2 from '@salesforce/label/c.Request_New_Bin_Path_2'; 
import Request_New_Bin_Path_3 from '@salesforce/label/c.Request_New_Bin_Path_3'; 
import Request_New_Bin_Path_4 from '@salesforce/label/c.Request_New_Bin_Path_4'; 
import Request_Received_Title from '@salesforce/label/c.Request_Received_Title'; 
import Request_Received_Message from '@salesforce/label/c.Request_Received_Message'; 
import Request_Received_Code from '@salesforce/label/c.Request_Reference_Code'; 
import Check_Your_Email_Title from '@salesforce/label/c.Check_your_email_title'; 
import Check_Your_Email_Message from '@salesforce/label/c.Check_your_email_message'; 
import Check_Your_SMS_Title from '@salesforce/label/c.Check_you_SMS_title'; 
import Check_Your_SMS_Message from '@salesforce/label/c.Check_your_SMS_message'; 
//

import ACT_LOGOS from '@salesforce/resourceUrl/BIN_ACT_Logos';
import FORM_FACTOR from '@salesforce/client/formFactor';
import isGuestUser from '@salesforce/user/isGuest';

// Service Request Fields
import CASE_OBJECT from '@salesforce/schema/Case';
import CASE_RECORD_TYPE from '@salesforce/schema/Case.RecordTypeId';
import CASE_ORIGIN from '@salesforce/schema/Case.Origin';
import ADDRESS_ID from '@salesforce/schema/Case.CORE_Address__c';
import SERVICE_TYPE from '@salesforce/schema/Case.BIN_Service_Type__c';
import CASE_DESCRIPTION from '@salesforce/schema/Case.Description';
import WORK_ORDERS from '@salesforce/schema/Case.BIN_Work_Orders__c';
import CONTACT_TITLE from '@salesforce/schema/Case.Contact_Title__c';
import CONTACT_FIRST_NAME from '@salesforce/schema/Case.Caller_First_Name__c';
import CONTACT_LAST_NAME from '@salesforce/schema/Case.Caller_Last_Name__c';
import CONTACT_EMAIL from '@salesforce/schema/Case.Caller_Email__c';
import CONTACT_MOBILE from '@salesforce/schema/Case.Caller_Primary_Phone__c';
import CONTACT_OTHER_PHONE from '@salesforce/schema/Case.Caller_Other_Phone__c';
import CONTACT_PREFERRED_METHOD from '@salesforce/schema/Case.Preferred_Contact_Method__c';
import CASE_DELIVERY_ASAP from '@salesforce/schema/Case.BIN_Delivery_As_Soon_as_Possible__c';
import CASE_DELIVERY_DATE from '@salesforce/schema/Case.BIN_Service_Request_Delivery_Date__c';


export default class Bin_requestNewBin extends LightningElement {

    // This wire is used to retrieve the Record Type ids 
    @wire(getObjectInfo, { objectApiName: CASE_OBJECT })
    objectInfo;

    actGovLogo = ACT_LOGOS + '/ACT-gov-logo.png';
    accessCanberraLogo = ACT_LOGOS + '/AC-logo.png';

    @track addressId;
    @track landUseCode;
    @track addressEntitlements;
    @track pageStep = 1;
    @track deliveryDate;
    @track formPaths;
    @track serviceRequestNumber;
    @track checkYourTitle;
    @track checkYourMessage;
    @track createCaseError;

    // Form Labels
    labelPageTitle = Request_New_Bin_Page_Title;
    labelStep1 = Request_New_Bin_Step_1;
    labelStep2 = Request_New_Bin_Step_2;
    labelStep3 = Request_New_Bin_Step_3;
    labelReview = Request_New_Bin_Review_Title;
    labelEdit = Service_Request_Form_Edit_Details_Button;
    labelRequestReceivedTitle = Request_Received_Title;
    labelRequestReceivedMessage = Request_Received_Message;
    labelRequestReceivedCode = Request_Received_Code;

    // Private properties
    contactDetails;
    typeDevice = FORM_FACTOR;
    isDeliverAsap = true;
   

    constructor(){
        super();
        this.createStagePath();
    }

    // Handle SUBMIT REQUEST
    handleSubmitRequest(){

        const fields = {};
        const RECORD_TYPES = this.objectInfo.data.recordTypeInfos;
        const BIN_RECORD_TYPE = Object.keys(RECORD_TYPES).find(rti => RECORD_TYPES[rti].name === 'BIN');
     
        // Case Origin
        fields[CASE_ORIGIN.fieldApiName] = (isGuestUser) ? 'Access Canberra' : 'Customer Service Officer';
        // Case RecordType
        fields[CASE_RECORD_TYPE.fieldApiName] = BIN_RECORD_TYPE;
        // Address Id
        fields[ADDRESS_ID.fieldApiName] = this.addressId;
        // Service Type : TODO -> Use Constants
        fields[SERVICE_TYPE.fieldApiName] = 'New set of Bins';


        // Build Case Description (It will Sumarize the Work Orders in a "readable" way
        let caseDescription = '';
        this.addressEntitlements.forEach(function (bin) { 

            // Cannot bind the SCHEMA fieldApiName directly since the addressEntitlements is a Custom Metadata result which is yet not supported by LWC 
            caseDescription += bin.Quantity__c + ' x ' + bin.Bin_Size__c + ' ' + bin.Bin_Colour__c + ' ' + bin.Bin_Purpose__c + ' ' + bin.Bin_Type__c + ' \n ';
        })
        fields[CASE_DESCRIPTION.fieldApiName] = caseDescription;

        // Work Orders JSON
        fields[WORK_ORDERS.fieldApiName] = JSON.stringify(this.addressEntitlements);

        // Contact Details
        fields[CONTACT_TITLE.fieldApiName] = this.contactDetails.Contact_Title__c;
        fields[CONTACT_FIRST_NAME.fieldApiName] = this.contactDetails[CONTACT_FIRST_NAME.fieldApiName];
        fields[CONTACT_LAST_NAME.fieldApiName] = this.contactDetails[CONTACT_LAST_NAME.fieldApiName];
        fields[CONTACT_EMAIL.fieldApiName] = this.contactDetails[CONTACT_EMAIL.fieldApiName];
        fields[CONTACT_MOBILE.fieldApiName] = this.contactDetails[CONTACT_MOBILE.fieldApiName];
        fields[CONTACT_OTHER_PHONE.fieldApiName] = this.contactDetails[CONTACT_OTHER_PHONE.fieldApiName];
        fields[CONTACT_PREFERRED_METHOD.fieldApiName] = this.contactDetails[CONTACT_PREFERRED_METHOD.fieldApiName];
        
        // Service Request Delivery Date
        fields[CASE_DELIVERY_ASAP.fieldApiName] = this.isDeliverAsap;
        fields[CASE_DELIVERY_DATE.fieldApiName] = this.deliveryDate;

       
        console.log('fields===' + JSON.stringify(fields));

        const recordInput = { apiName: CASE_OBJECT.objectApiName, fields };

        // Create Case Record
        createRecord(recordInput)
            .then(account => {

                // Set "Request Received" layout variables
                if (this.contactDetails[CONTACT_PREFERRED_METHOD.fieldApiName] === 'Email'){
                    this.checkYourTitle = Check_Your_Email_Title;
                    this.checkYourMessage = Check_Your_Email_Message.replace("##", this.contactDetails[CONTACT_EMAIL.fieldApiName]);
                }
                else if (this.contactDetails[CONTACT_PREFERRED_METHOD.fieldApiName] === 'Mobile') {
                    this.checkYourTitle = Check_Your_SMS_Title;
                    this.checkYourMessage = Check_Your_SMS_Message.replace("##", this.contactDetails[CONTACT_MOBILE.fieldApiName]);
                }

                // Retrieve Service Request Number
                getRequestNumber({ caseId: account.id })
                    .then(result => {
                        this.serviceRequestNumber = result.BIN_Service_Request_Number__c;
                    })
                    .catch(error => {
                        console.log('error while saving record--->' + error.body.message);
                    });

                this.handleNext();
            })
            .catch(error => {
                this.createCaseError = error.body.message;
                console.log('error while saving record--->' + error.body.message)
            });

    }

    // Create the Stage Paths and Status for the Path Component
    createStagePath(){
        this.formPaths = [
            {
                name: Request_New_Bin_Path_1,
                stageNumber: 1,
                stageClass: this.checkStageClass(1)
                // ariaSelected: (1 === this.this.pageStep) ? true : false
            },
            {
                name: Request_New_Bin_Path_2,
                stageNumber: 2,
                stageClass: this.checkStageClass(2)
            },
            {
                name: Request_New_Bin_Path_3,
                stageNumber: 3,
                stageClass: this.checkStageClass(3)
            },
            {
                name: Request_New_Bin_Path_4,
                stageNumber: 4,
                stageClass: this.checkStageClass(4)
            }
        ];
    }

    // Check what is the class for the stage page given the current page step and the item step (Eg.: Completed, Active, Incomplete)
    checkStageClass(stageNumber){
        let className;
        if (stageNumber === this.pageStep){
            className = 'slds-path__item slds-is-current slds-is-active'

        }
        else if (stageNumber > this.pageStep){
            className = 'slds-path__item slds-is-incomplete'
        }
        else{
            className = 'slds-path__item slds-is-complete'

        }

        return className;
    }

    @api
    get reviewMode() {
        return (this.pageStep === 3);
    }

    // Handle Address Value Change
    handleAddressValueChange(event) {
        this.addressId = event.detail.Id;
        this.landUseCode = event.detail.Land_Use_Code__c;
    }
    
    // Handle Deleted Selected Address
    handleOnDeleteSelected() {
        this.addressId = null;
        this.landUseCode = null;
    }

    // Handle Entitlement Change
    handleEntitlementChange(event) {
        this.addressEntitlements = event.detail;
        console.log('event.detail===' + JSON.stringify(event.detail));
    }

    // Handle Save Contact Details
    handleSaveContactDetails(event){
        console.log('SavedContactDetails---' + JSON.stringify(event.detail));
        this.contactDetails = event.detail;
        this.handleNext();
    }

    // Hadle Change Delivery Date
    handleChangeDeliveryDate(event){

        this.deliveryDate = event.target.value;

        let delAsap = this.template.querySelector('.deliverAsap');
        if(this.deliveryDate){
            this.isDeliverAsap = false;
            delAsap.checked = false;
        }
        else{
            this.isDeliverAsap = true;
            delAsap.checked = true;
        }
    }

    // GET: Min Delivery Date
    get minDeliveryDate(){
        let today = new Date(),
            day = today.getDate(),
            month = today.getMonth() + 1, //January is 0
            year = today.getFullYear();
        if (day < 10) {
            day = '0' + day
        }
        if (month < 10) {
            month = '0' + month
        }
        return year + '-' + month + '-' + day;
    }

    // GET: Show Page 1
    get showPage1(){
        let className;

        if(this.pageStep === 1 || this.reviewMode)
            className = 'showContent';
        else
            className = 'hideContent';

        return className;
    }

    // GET: Show Page 2
    get showPage2(){
        let className;

        if (this.pageStep === 2 || this.reviewMode)
            className = 'showContent stepContentBox';
        else
            className = 'hideContent';

        return className;
    }

    // GET: Show Complete Step
    get showCompleteStep(){
        return (this.pageStep === 4);

    }

    // GET: Show "Next Button" for main container since Contacts Component handle its own "Next" and "Previous" buttton
    get showNextButton(){
        let showButton;

        // Validate Condition for Step 1
        if (this.pageStep === 1 && this.addressId){
            showButton = true;
        }
        else{
            showButton = false;
        }
        return showButton;
    }

    // GET: Form style if user device is Desktop
    get desktopClass(){
        let className = '';

        if (this.typeDevice === 'Large'){
            className = 'requestBodyDesktop';
        }
        
        return className;
        
    }

    get isDesktop(){
        return (this.typeDevice === 'Large');
    }

   
    // Handle Stage Click
    handleStageClick(event){

        // Do Not Allow o Change Step if the path is already completed
        if (this.pageStep !== 4){
            this.pageStep = Number(event.detail);
            this.createStagePath();
        }
    }

    // Handle Go to Page Number
    handleGotoPage(event){
        this.pageStep = Number(event.currentTarget.dataset.item);
        this.createStagePath();
    }

    // Handle on click on "Previous" Button
    handlePrevious(){
        this.pageStep --;
        this.createStagePath();
    }

    // Handle on click on "Next" Button
    handleNext(){
        this.pageStep ++;
        this.createStagePath();
    }
}