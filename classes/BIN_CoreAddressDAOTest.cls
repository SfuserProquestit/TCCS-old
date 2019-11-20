@isTest
private class BIN_CoreAddressDAOTest {


    @isTest 
    private static void testGetAddresses(){


        List<sObject> coreAddresssess = Test.loadData(CORE_Address__c.sObjectType, 'bin_Core_Address_TestData');

        Core_Address__c fixedResult = [ SELECT Id 
                                        FROM Core_Address__c 
                                        limit 1];

        Id [] fixedSearchResults= new Id[1];
        fixedSearchResults[0] = fixedResult.Id;
        Test.setFixedSearchResults(fixedSearchResults);

        //Testing positive result
        list<Core_Address__c> searchAddress = BIN_CoreAddressDAO.getAddresses('UNIT 18/22 MAX');
        system.debug('testGetAddresses result for positive--->' + searchAddress);
        System.AssertEquals( searchAddress.size() , 1 );

        //Testing negative result 
            
        // NULL KeyString
        searchAddress = BIN_CoreAddressDAO.getAddresses(null);
        system.debug('testGetAddresses result for NULL KeyString--->' + searchAddress);
        System.AssertEquals( searchAddress.size() , 0 );
    }

    @isTest 
    private static void testGetNewBinSetEntitlements(){

        list<BIN_Address_Asset_Entitlement__mdt> customMetadata = [ SELECT  Land_Use_Code__c 
                                                                    FROM    BIN_Address_Asset_Entitlement__mdt 
                                                                    WHERE   Land_Use_Code__c != null];

        //Testing positive result
        list<BIN_Address_Asset_Entitlement__mdt> searchEntitlements = BIN_CoreAddressDAO.getNewBinSetEntitlements(customMetadata[0].Land_Use_Code__c);
        System.AssertNotEquals( searchEntitlements.size() , 0 );
       
    }


}