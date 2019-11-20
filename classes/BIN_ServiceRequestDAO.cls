/**
* @author Pryscilla Nascimento – ProQuest It
* @date 18/11/2019
*
* @group ServiceRequest
* @group-content ../../ApexDocContent/ServiceRequest.htm
*
* @description Util Methods for Work Orders Related Information
**/
public with sharing class BIN_ServiceRequestDAO {

    /**
    * @description Returns the service request number of a service request
    * @param caseId the service request id (Case)
    * @return the the service request number of a given service request id
    */
    @AuraEnabled(cacheable = true)
    public static Case getRequestNumber(String caseId){

        try{

            return [SELECT BIN_Service_Request_Number__c
                    FROM Case 
                    WHERE Id = :caseId limit 1];
        }
        catch(Exception e){
            system.debug('error while loading case contacts --->' + e.getMessage());
            return new Case();
        }
    }
}