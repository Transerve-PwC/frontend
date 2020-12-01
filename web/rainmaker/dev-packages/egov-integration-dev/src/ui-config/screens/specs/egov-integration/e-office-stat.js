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
   
    //await getMdmsData(state, dispatch);
    
    
  };
  const getMdmsData = async (state, dispatch) => {
    const tenantId =  getstoreTenantId();
    let mdmsBody = {
      userInfo: {
        id: 323,
       
      }
    };
    try {
      const response = await httpRequest(
        "post",
        "/integration-services/pt-mapping/v1/_get",
        "_get",
        [],
        mdmsBody
      );
      if(response)
      {
        dispatch(prepareFinalObject("searchScreenMdmsData",response.ResponseBody))
      }
     //dispatch(prepareFinalObject("searchScreenMdmsData", get(response, "ResponseBody.result")));
      const {result} = state.screenConfiguration.preparedFinalObject.searchScreenMdmsData;
      result.push(
        {
          propertyTaxId:"others",
          isActive:true,
          userId:0
        }
      )
      dispatch(prepareFinalObject("searchScreenMdmsData.result",result))
      // if(result)
      // {
      //   result.push(
      //     {
      //       propertyTaxId:"others",
      //       isActive:true,
      //       userId:0
      //     }
      //   )
      //   dispatch(prepareFinalObject("searchScreenMdmsData.result",result))
      // }
      // else{
      //   result.push(
      //     {
      //       propertyTaxId:"others",
      //       isActive:true,
      //       userId:0
      //     }
      //   )
      //   dispatch(prepareFinalObject("searchScreenMdmsData.result",result))

      // }
  
      return true;
    } catch (e) {
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
      getData(action, state, dispatch).then(responseAction => {    
      
      }); 
      let  APIData =sampleeofficestat();
      dispatch(prepareFinalObject("APIData",APIData));
  
     
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
  