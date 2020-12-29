import { getBreak, getCommonHeader } from "egov-ui-framework/ui-config/screens/specs/utils";
import { handleScreenConfigurationFieldChange as handleField, toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import { getTenantId, setHCRoles } from "egov-ui-kit/utils/localStorageUtils";
import { httpRequest } from "../../../../ui-utils";
import { ServiceRequestFilterFormForEmployee } from "./searchResource/EmployeeServiceRequestsSearchForm";
import { searchResultsServiceRequest } from "./searchResource/searchResults";
import { resetFieldsForEmployeeFilter } from "./searchResource/citizenSearchFunctions";
import get from "lodash/get";
import "./index.css";
  
  const hasButton = getQueryArg(window.location.href, "hasButton");
  let enableButton = true;
  enableButton = hasButton && hasButton === "false" ? false : true;
  
  const header = getCommonHeader(
    {
    labelName: "Service Requests",
    labelKey: "HC_SERVICE_REQUEST_HEADER"
  },

  );
  


  const getMdmsData = async (dispatch) => {
  
    let tenantId = getTenantId().split(".")[0];
    let mdmsBody = {
      MdmsCriteria: {
        tenantId: tenantId,
        moduleDetails: [
          {
            moduleName: "tenant",
            masterDetails: [
              {
                name: "tenants"
              }
            ]
          },
          {
            moduleName: "eg-horticulture",
            masterDetails: [
              {
                name: "ServiceType"
              },
              {
                name: "ServiceStatus"
              },
              {
                name: "roles"
              }
            ]
          },
          
          {
            moduleName: "RAINMAKER-PGR",
            masterDetails: [
              {
                name: "Sector"
              }
            ]
          },
        ]
      }
    };
    try{
      let payload = null;
      payload = await httpRequest(
        "post",
        "/egov-mdms-service/v1/_search",
        "_search",  
        [],
        mdmsBody
      );
      dispatch(prepareFinalObject("applyScreenMdmsData", payload.MdmsRes));

      //setting horticulture roles into mdms
      var roleList = []
      roleList = payload &&
      payload.MdmsRes["eg-horticulture"].roles
      setHCRoles(JSON.stringify(roleList))}
      catch(e){
        console.log(e);
      }
    };

  
  const EmployeeServiceRequestsFilter = {
    uiFramework: "material-ui",
    name: "employeeServiceRequestsFilter",
    beforeInitScreen: (action, state, dispatch) => {
      
      resetFieldsForEmployeeFilter(state, dispatch);
      dispatch(prepareFinalObject("serviceRequests", {}));

      getMdmsData(dispatch).then(response => {  
      }) 

      dispatch(
        handleField(
          "employeeServiceRequestsFilter",
          "components.div.children.searchResultsServiceRequest",
          "visible",
          false
        )
      );
      
      return action;
    },
    components: {
      div: {
        uiFramework: "custom-atoms",
        componentPath: "Form",
        props: {
          className: "common-div-css",
          id: "employeeServiceRequestsFilter"
        },
        children: {
          headerDiv: {
            uiFramework: "custom-atoms",
            componentPath: "Container",
  
            children: {
              header: {
                // gridDefination: {
                //   xs: 12,
                //   sm: 6
                // },
                ...header
              },
              
            }
          },
          ServiceRequestFilterFormForEmployee,
          breakAfterSearch: getBreak(),
          searchResultsServiceRequest
        }
      },
        }
  };
  
  export default EmployeeServiceRequestsFilter;
  
