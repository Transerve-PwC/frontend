import {
    getCommonHeader,
    getLabel,
    getBreak
  } from "egov-ui-framework/ui-config/screens/specs/utils";
 import {NOCReport2} from "./searchResource/MISSummaryReportApplication";
 import {adhocPopupForSeRoadCutForward} from "./payResource/adhocPopup";
 
  import { showHideAdhocPopup, resetFields, getRequiredDocData } from "../utils";
  import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
  
  import { searchResultsReports4 } from "./searchResource/searchResults";
  import { setBusinessServiceDataToLocalStorage } from "egov-ui-framework/ui-utils/commons";
  import {
    getOPMSTenantId,
    setOPMSTenantId,
    localStorageGet,
    getTenantId
  } from "egov-ui-kit/utils/localStorageUtils";  
  import find from "lodash/find";
  import set from "lodash/set";
  import get from "lodash/get";
  import {
    prepareFinalObject,
    handleScreenConfigurationFieldChange as handleField
  } from "egov-ui-framework/ui-redux/screen-configuration/actions";
  import { getRequiredDocuments } from "./requiredDocuments/reqDocs";
  import { getUpdatePriceBook,getrepotforproccessingTime,getSectordata} from "./searchResource/citizenSearchFunctions";
  
  const hasButton = getQueryArg(window.location.href, "hasButton");
  let enableButton = true;
  enableButton = hasButton && hasButton === "false" ? false : true;
  
  const header = getCommonHeader({
    labelName: "Application Proccessing Time Report",
    labelKey: "NOC_REVENUE_PROCCESSING_TIME_WISE"
  });
  
  
  //alert('in update rate')
  const NOCSearchAndResult = {
    uiFramework: "material-ui",
    name: "reportForProcessingTime",
    beforeInitScreen: (action, state, dispatch) => {
      setOPMSTenantId(getTenantId());
        const pricebookid = getQueryArg(
            window.location.href,
            "pricebookid"
          );

  
    getrepotforproccessingTime(action, state, dispatch);
    
      return action;
    },
    components: {
      div: {
        uiFramework: "custom-atoms",
        componentPath: "Form",
        props: {
          className: "common-div-css",
          id: "reportForProcessingTime"
        },
        children: {
          header: {
            gridDefination: {
              xs: 12,
              sm: 6
            },
            ...header
          },
        
          searchResultsReports4
        }
      },
      adhocDialog: {
        uiFramework: "custom-containers-local",
        moduleName: "egov-opms",
        componentPath: "DialogContainer",
        props: {
          open: false,
          maxWidth: false,
          screenKey: "reportForProcessingTime"
        },
        children: {
          popup: {}
        }
      }
    }
  };
  
  export default NOCSearchAndResult;
  