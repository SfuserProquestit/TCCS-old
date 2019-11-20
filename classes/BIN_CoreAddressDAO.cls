/**
* @author Pryscilla Nascimento – ProQuest It
* @date 11/11/2019
*
* @group Address
* @group-content ../../ApexDocContent/BinUtils.htm
*
* @description Util Methods for Address (Core_Address__c) Related Information
**/
public with sharing class BIN_CoreAddressDAO {

    /**
    * @description Returns a list of Core_Address__c using SOSL
    * @param searchKey the search term 
    * @return the list of core addressses in the system that matches the search term
    */
    @AuraEnabled(cacheable = true)
    public static Core_Address__c[] getAddresses(String searchKey){

        if(String.isEmpty(searchKey))
            return new Core_Address__c[]{};

        searchKey = String.escapeSingleQuotes(searchKey);

        String query =  ' FIND \''+searchKey+'*\' IN ALL FIELDS ' + 
                        ' RETURNING Core_Address__c (' +
                        '   Id, ' +
                        '   Street_Address__c, ' +
                        '   Suburb_Name__c, ' +
                        '   PostCode__c, ' +
                        '   Land_Use_Code__c ' +
                        ' ORDER BY Suburb_Name__c, Street_Name__c, Unit_Number__c, Street_Number__c )';

        system.debug('query----' + query);

        List<List<SObject>> addressResult = search.query(query);

        return (Core_Address__c[]) addressResult[0];
    }

    /**
    * @description Returns the New Bins Set entitlements for an address land use code
    * @param landUseCode the land use code 
    * @return the list of New Bins Set entitlements (quantity, bin colour and size) given the land use code and Is_New_Set_Bin__c = true
    */
    @AuraEnabled(cacheable = true)
    public static list<BIN_Address_Asset_Entitlement__mdt> getNewBinSetEntitlements(String landUseCode){

        return [SELECT  Bin_Colour__c, 
                        Bin_Size__c, 
                        Quantity__c,
                        Bin_Type__c, 
                        Bin_Purpose__c 
                FROM    BIN_Address_Asset_Entitlement__mdt 
                WHERE   Land_Use_Code__c = :landUseCode AND
                        Is_New_Set_Bin__c = true
                ORDER BY Bin_Colour__c];
    }

}