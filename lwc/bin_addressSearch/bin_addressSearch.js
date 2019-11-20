/* eslint-disable no-console */
import { LightningElement, track, wire, api} from 'lwc';
import findAddressess from '@salesforce/apex/BIN_CoreAddressDAO.getAddresses';
// import getAddress from '@salesforce/apex/BIN_CoreAddressDAO.getAddresse';

const DELAY = 300;
const minSearchChar = 5;

export default class Bin_AddressSearch extends LightningElement {
    // @api addressId; // Address Id
    @api reviewMode; // Flag to set Review Mode
    @track selectedAddress; // Selected Address
    @track addressess = []; // Addresses result from the search
    @track searchKey = ''; // Search key used to retrieve the addresses
    @track error; // Error Message from the @wire(findAddressess)
    @track showSpinner = false; // Show Spinner Loading
    inputSearchText = ''; // Aux variable to help display the error message, since 'searchKey' is only updated if input is > than 5char we use this variable to control the 'up to date' text


    // Find Address Search
    @wire(findAddressess, { searchKey: '$searchKey' })
    loadAddresssess({ error, data }) {
        if(data) {
            this.addressess = data;
            this.error = undefined;
        } else if (error) {
            this.error = error.body.message;
            this.addressess = [];
        }

        this.showSpinner = false;
    }

    // Show Address Result
    get displayResult(){
        return (this.addressess.length > 0);
    }

    // Show Result Not Found Message
    get displayResultNotFound() {
        return (this.inputSearchText.length >= minSearchChar && this.addressess.length === 0);
    }


    // Handle for Address Search Input OnChange 
    handleAddressKeyChange(event) {
        
        // Debouncing this method: do not update the reactive property as
		// long as this function is being called within a DELAY in ms.
		// This is to avoid a very large number of Apex method calls.
        window.clearTimeout(this.delayTimeout);
        
        this.inputSearchText = event.target.value;
        this.showSpinner = true;

        // eslint-disable-next-line @lwc/lwc/no-async-operation
        this.delayTimeout = setTimeout(() => {
            if (this.inputSearchText.length >= minSearchChar){
                this.searchKey = this.inputSearchText;
            }
            else {
                if (this.inputSearchText.length === 0){
                    this.addressess = [];   
                }
                this.showSpinner = false;
            }
            
        }, DELAY);
    }

    // Handle for selecting an address on the search result
    handleSelectAddress(event){

        this.selectedAddress = this.addressess.find(address => address.Id === event.currentTarget.dataset.item);
        
        // Address Value Change Dispatch Event
        this.dispatchEvent(
            new CustomEvent("addressvaluechange", {
                detail: this.selectedAddress,
            })
        );

        // // Land Use Code Dispatch Event
        // if (isChangeLandUseCode){
        //     this.dispatchEvent(
        //         new CustomEvent("landusecodechange", {
        //             detail: this.selectedAddress.Land_Use_Code__c,
        //         })
        //     );
        // }
    }

    // Handle for deselect an address
    handleDeleteAddress(){
        this.selectedAddress = null;
        // Address Value Change Dispatch Event
        this.dispatchEvent(
            new CustomEvent("handledeleteaddress", {
                detail: null,
            })
        );
    }
    
}