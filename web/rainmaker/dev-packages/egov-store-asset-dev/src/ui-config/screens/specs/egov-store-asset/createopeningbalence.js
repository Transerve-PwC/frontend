import {
    getBreak,
    getCommonHeader,
    getLabel,
  } from "egov-ui-framework/ui-config/screens/specs/utils";
  import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
  import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
  import set from "lodash/set";
  import { httpRequest,getsto } from "../../../../ui-utils";
  import { getstoreTenantId,getMaterialMasterSearchResults,getStoresSearchResults,getOpeningBalanceSearchResults } from "../../../../ui-utils/storecommonsapi";
  import { OpeningBalanceDetails } from "./createopeningbalenceResource/OpeningBalance-Details";
  import { footer } from "./createopeningbalenceResource/footer";
  import { getTenantId , getOPMSTenantId} from "egov-ui-kit/utils/localStorageUtils";
  import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
  
  const hasButton = getQueryArg(window.location.href, "hasButton");
  let enableButton = true;
  //enableButton = hasButton && hasButton === "false" ? false : true;
  
  const header = getCommonHeader({
    labelName: "Material Master",
    labelKey: "STORE_COMMON_MATERIAL_MASTER",
  });
  
  const createMaterialMasterHandle = async (state, dispatch) => {
    dispatch(setRoute(`/egov-store-asset/create-material-master`));
  };
  
  const getMDMSData = async (action, state, dispatch) => {
    const tenantId = getstoreTenantId();
    let mdmsBody = {
      MdmsCriteria: {
        tenantId: tenantId,
        moduleDetails: [
          {
            moduleName: "store-asset",
            masterDetails: [
              { name: "Material" },
            ],
          },
          {
            moduleName: "egf-master",
            masterDetails: [{ name: "FinancialYear" }]
          },
        ],
      },
    };
    try {
      const payload = await httpRequest(
        "post",
        "/egov-mdms-service/v1/_search",
        "_search",
        [],
        mdmsBody
      );
      dispatch(prepareFinalObject("searchScreenMdmsData", payload.MdmsRes));
    } catch (e) {
      console.log(e);
    }
  };
  const getstoreData = async (action, state, dispatch) => {
    const tenantId = getTenantId();
    let queryObject = [
      {
        key: "tenantId",
        value: tenantId
      }];
    try {
      let response = await getMaterialMasterSearchResults(queryObject, dispatch);      
      dispatch(prepareFinalObject("material", response));

       let response1 = await getStoresSearchResults(queryObject, dispatch);      
      dispatch(prepareFinalObject("store", response1));
    } catch (e) {
      console.log(e);
    }
  };
  const getOpeningBalanceData = async (action, state, dispatch,mrnNumber) => {
    const tenantId = getTenantId();
    let queryObject = [
      {
        key: "mrnNumber",
        value: mrnNumber
      }];
      queryObject.push({
        key: "tenantId",
        value: tenantId
      });
    try {
      let response = await getOpeningBalanceSearchResults(queryObject, dispatch);        
     let  materialReceipt = response.materialReceipt
    // materialReceipt = materialReceipt.filter(x=>x.mrnNumber === mrnNumber)
     response = response.materialReceipt.filter(x => x.mrnNumber === mrnNumber)
     if(response && response[0])
  {
  for (let index = 0; index < response[0].receiptDetails.length; index++) {
    const element = response[0].receiptDetails[index];
   
       set(response[0], `receiptDetails[${index}].lotNo`, element.receiptDetailsAddnInfo[0].lotNo);
       set(response[0], `receiptDetails[${index}].expiryDate`, element.receiptDetailsAddnInfo[0].expiryDate);
       set(response[0], `receiptDetails[${index}].receivedDate`, element.receiptDetailsAddnInfo[0].receivedDate);
       set(response[0], `receiptDetails[${index}].userAcceptedQty`, element.receiptDetailsAddnInfo[0].userQuantity);       
       set(response[0], `receiptDetails[${index}].oldReceiptNumber`, element.receiptDetailsAddnInfo[0].oldReceiptNumber);
      
       
  }
  dispatch(prepareFinalObject("materialReceipt", response));
}
     // dispatch(prepareFinalObject("materialReceipt", materialReceipt));
       
    } catch (e) {
      console.log(e);
    }
  };
  
  const getData = async (action, state, dispatch) => {
    await getMDMSData(action, state, dispatch);
    await getstoreData(action,state, dispatch);
    const applicationNumber = getQueryArg(
      window.location.href,
      "applicationNumber"
    );
    if(applicationNumber)
    {
      await getOpeningBalanceData(action,state, dispatch,applicationNumber);
    }
    else{
      //dispatch(prepareFinalObject("materialReceipt[0]", null));
      dispatch(prepareFinalObject("materialReceipt", null));
    }
  };
  
  const materialMasterSearchAndResult = {
    uiFramework: "material-ui",
    name: "createopeningbalence",
    beforeInitScreen: (action, state, dispatch) => {
      getData(action, state, dispatch);
      return action;
    },
    components: {
      div: {
        uiFramework: "custom-atoms",
        componentPath: "Form",
        props: {
          className: "common-div-css",
          id: "search",
        },
        children: {
          headerDiv: {
            uiFramework: "custom-atoms",
            componentPath: "Container",
  
            
          },
          OpeningBalanceDetails,         
          breakAfterSearch: getBreak(),
          footer:footer(),
        },
      },
    },
  };
  
  export default materialMasterSearchAndResult;
  