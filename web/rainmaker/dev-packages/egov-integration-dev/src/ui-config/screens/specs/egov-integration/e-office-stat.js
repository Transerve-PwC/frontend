import {
    getCommonHeader,
    getCommonCard,
    getCommonContainer, 
    getLabel,
    getPattern,
    getSelectField,
    getTextField,
    getBreak
  } from "egov-ui-framework/ui-config/screens/specs/utils";
  //import { DOEApplyApplication} from "./applydoeResources/DOEApplyApplication";
  import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
  import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
  import { validateFields, getTextToLocalMapping } from "../utils";
  import { getSearchPensioner,getPTPattern } from "../../../../ui-utils/commons";
  import { toggleSnackbar,toggleSpinner } from "egov-ui-framework/ui-redux/screen-configuration/actions";
  import store from "../../../../ui-redux/store";
  import { getstoreTenantId } from "../../../../ui-utils/storecommonsapi";
  import {
    getTenantId,getUserInfo
  } from "egov-ui-kit/utils/localStorageUtils";
  import find from "lodash/find";
  import set from "lodash/set";
  import get from "lodash/get";
  import {
    prepareFinalObject,
    handleScreenConfigurationFieldChange as handleField
  } from "egov-ui-framework/ui-redux/screen-configuration/actions";
  import {  
    sampleeofficestat
    } from "../../../../ui-utils/sampleResponses";
    import { httpRequest } from "../../../../ui-utils";
    import { getSearchResults } from "../../../../ui-utils/commons"; 


  export const getData = async (action, state, dispatch) => {
   
    await getMdmsData(state, dispatch);
    
    
  };
  const getMdmsData = async (state, dispatch) => {
    const tenantId =  getstoreTenantId();
    let mdmsBody = {
      eOfficeRequest: {
        orgid: 37,
        postdetailid:212,
       
      }
    };
    try {
      const response = await httpRequest(
        "post",
        "/integration-services/eoffice/v1/_get",
        "_get",
        [],
        mdmsBody
      );
      if(response)
      {
        let  APIData = response;
        let totalVIPReceiptsPending =0;
        let totalFilesPendingCnt =0;
        let totalFilesClosed =0;
        let totalReceiptsPending =0;
        let totalReceiptsClosed =0;
  
        if(APIData.ResponseBody)
        {
  
          if(APIData.ResponseBody.VipReceipts)//totalVIPReceiptsPending
          {
            if(APIData.ResponseBody.VipReceipts.Row !== undefined)
            {
              let data = APIData.ResponseBody.VipReceipts.Row.Column
              for (let index = 0; index < data.length; index++) {
                const element = data[index];
                if(element.name ==="Total")
                {
                  totalVIPReceiptsPending = element.content
                }                
              }             
            }
  
          }
           if(APIData.ResponseBody.ReceiptPending)//totalReceiptsPending
          {
            if(APIData.ResponseBody.ReceiptPending.Row !== undefined)
            {
              let ReceiptPending = APIData.ResponseBody.ReceiptPending.Row.Column
              for (let index = 0; index < ReceiptPending.length; index++) {
                const element = ReceiptPending[index];
                if(element.name ==="Total")
                {
                  totalReceiptsPending = element.content
                }                
              }
            }
  
          }
           if(APIData.ResponseBody.FilePending)//totalFilesPendingCnt
          {
            if(APIData.ResponseBody.FilePending.Row !== undefined)
            {
              let FilePending = APIData.ResponseBody.FilePending.Row.Column
              for (let index = 0; index < FilePending.length; index++) {
                const element = FilePending[index];
                if(element.name ==="Total")
                {
                  totalReceiptsPending = element.content
                }                
              }
            }
  
          }
           if(APIData.ResponseBody.FileClosed)//totalFilesClosed
          {
            if(APIData.ResponseBody.FileClosed.Row !== undefined)
            {
              let FileClosed = APIData.ResponseBody.FileClosed.Row.Column
              for (let index = 0; index < FileClosed.length; index++) {
                const element = FileClosed[index];
                if(element.name ==="Total")
                {
                  totalReceiptsPending = element.content
                }                
              }
            }
  
          }
           if(APIData.ResponseBody.ReceiptClosed)//totalReceiptsClosed
          {
            if(APIData.ResponseBody.ReceiptClosed.Row !== undefined)
            {
              let ReceiptClosed = APIData.ResponseBody.ReceiptClosed.Row.Column
              for (let index = 0; index < ReceiptClosed.length; index++) {
                const element = ReceiptClosed[index];
                if(element.name ==="Total")
                {
                  totalReceiptsClosed = element.content
                }                
              }
            }
  
          }
        }
  
         APIData ={
          eofficestat:{
            totalFilesClosed:totalFilesClosed,
            totalFilesPendingCnt:totalFilesPendingCnt,
            totalReceiptsClosed:totalReceiptsClosed,
            totalReceiptsPending:totalReceiptsPending,
            totalVIPReceiptsPending:totalVIPReceiptsPending,
  
          }
        }
        dispatch(prepareFinalObject("APIData",APIData));
        // dispatch(prepareFinalObject("searchScreenMdmsData",response.ResponseBody))


      }
     //dispatch(prepareFinalObject("searchScreenMdmsData", get(response, "ResponseBody.result")));
      const {result} = state.screenConfiguration.preparedFinalObject.searchScreenMdmsData;
      // result.push(
      //   {
      //     propertyTaxId:"others",
      //     isActive:true,
      //     userId:0
      //   }
      // )
      // dispatch(prepareFinalObject("searchScreenMdmsData.result",result))
      
  
      return true;
    } catch (e) {
    //  alert('1')
      console.log(e);
    }
  };
  
  const header = getCommonHeader({
    labelName: "View E-Office Stat",
    labelKey: "INTIGRATION_EOFFICE_STATE_HEADING_HOME"
  });
  const RegisterReviewResult = {
    uiFramework: "material-ui",
    name: "e-office-stat",
    beforeInitScreen: (action, state, dispatch) => {
    //  resetFields(state, dispatch);
      const tenantId = getTenantId();   
      dispatch(prepareFinalObject("searchScreen",{}));
      const propertyTaxId = getQueryArg(
        window.location.href,
        "propertyId"
      );
 
     // let  APIData =sampleeofficestat();
     
  
      getData(action, state, dispatch).then(responseAction => {    
      
      });
          return action;
    },
    components: {
      div: {
        uiFramework: "custom-atoms",
        componentPath: "Form",
        props: {
          className: "common-div-css",
          id: "review"
        },
        children: {
          headerDiv: {
            uiFramework: "custom-atoms",
            componentPath: "Container",
  
            children: {
              header: {
                gridDefination: {
                  xs: 12,
                  sm: 6
                },
                //...header
              },
              
            }
          },
   
    breakAfterSearch: getBreak(),
          PensionReviewBottom: {
            uiFramework: "custom-containers-local",        
            componentPath: "EofficestatContainer",
            moduleName: "egov-integration",
              props: {
                dataPath: "records",
                moduleName: "RTI",
                pageName:"INTIGRATION_ESTAT",
  
              }
          },
         
        }
      },
      
    }
  };
  
  export default RegisterReviewResult;
  