import {
    getBreak,
    getCommonCard,
    getCommonContainer,
    getCommonHeader,
    getLabelWithValue,
    getStepperObject,
    getLabel
  } from "egov-ui-framework/ui-config/screens/specs/utils";
  import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
  
  import {
    getFileUrlFromAPI,
    getQueryArg,
    getTransformedLocale,
    setBusinessServiceDataToLocalStorage
  } from "egov-ui-framework/ui-utils/commons";
  
  import jp from "jsonpath";
  import get from "lodash/get";
  import set from "lodash/set";
  
  import {
    committeeSummary  
  } from "./summaryResource/committeeSummary";
  import { searchDepartmentEmployeesResults_committee1,searchDepartmentEmployeesResults,searchDepartmentEmployeesResults_committee,searchDepartmentEmployeesResults1, searchInvitedEmployeesResults } from "./committeeResource/searchResults";
  
  import {
    getAccessToken,
    getTenantId,
    getLocale,
    getUserInfo,
    getapplicationNumber,
    localStorageGet
  } from "egov-ui-kit/utils/localStorageUtils";
  
 
  import { committeeSummaryfooter } from './applyResource/committeeSummaryfooter'
  import {  getCommitieeGridByIdData  } from "../egov-pr/searchResource/citizenSearchFunctions"
  
  export const callBackForDelete = async (state, dispatch) => {
    changeStep(state, dispatch, "previous");
  };
  
  
  const screenConfig = {
    uiFramework: "material-ui",
    name: "committee_summary",
    beforeInitScreen: (action, state, dispatch) => {
      
               let payload={
                "tenantId": getTenantId(),
                "RequestBody":{
                
                "committeeUuid": getQueryArg(window.location.href, "committeeUUID"),
                "committeeName": "",
                "committeeDescription": "",
                "isActive": true,
                "tenantId": getTenantId(),
                "moduleCode": localStorageGet("modulecode"),
                "committeeMember": [ ]
                }
                }
               getCommitieeGridByIdData(action, state, dispatch,payload)
            
       return action;
     },
    components: {
      div: {
        uiFramework: "custom-atoms",
        componentPath: "Div",
        props: {
          className: "common-div-css"
        },
        children: {
          headerDiv: {
            uiFramework: "custom-atoms",
            componentPath: "Container",
            children: {
              header: {
                gridDefination: {
                  xs: 12,
                  sm: 10
                },
  
  
              }
            }
          },
         
          body:  getCommonCard({         
            committeeSummary: committeeSummary,
            
          }),
         
          committeeSummaryfooter,
         
        }
      }
    }
  };
  
  export default screenConfig;
  