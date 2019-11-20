@isTest
private class BIN_ServiceRequestDAOTest {

    @testSetup static void setup() {
        // List<sObject> coreAddresssess = Test.loadData(CORE_Address__c.sObjectType, 'bin_Core_Address_TestData');

        Database.insert(new Case());
      
    }

    @isTest 
    private static void testGetRequestNumber(){

        //Test Positive Scenario
        Case serviceRequest = [ SELECT ID 
                                FROM Case limit 1];

        Case result = BIN_ServiceRequestDAO.getRequestNumber(serviceRequest.Id);
        System.AssertNotEquals( result.BIN_Service_Request_Number__c , null );



        //Test Negative Scenario (null Id)
        result = BIN_ServiceRequestDAO.getRequestNumber(null);
        System.AssertEquals( result.BIN_Service_Request_Number__c , null );
    }

  

}