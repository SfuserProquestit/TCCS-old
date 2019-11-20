/**
* @author Pryscilla Nascimento – ProQuest It
* @date 11/11/2019
*
* @group WorkOrder
* @group-content ../../ApexDocContent/WorkOrder.htm
*
* @description Util Methods for Work Orders Related Information
**/
public with sharing class BIN_WorkOrderDAO {
    public BIN_WorkOrderDAO() {

    }

    /**
    * @description Returns a list of WorkOrder
    * @param serviceRequestId the service request (Case) Id
    * @return the list of work orders given a Service Request (Case)
    */
    // @AuraEnabled(cacheable = true)
    // public static list<WorkOrder> getServiceRequestWorkOrders(Id serviceRequestId){
        
    //     // return [SELECT 
    //     //         FROM WorkOrder
    //     //         WHERE CaseId = :serviceRequestId];
    // }
}