import {
    getCommonHeader,
    getLabel,
    getBreak
  } from "egov-ui-framework/ui-config/screens/specs/utils";
 import { NOCApplication2} from "./searchResource/MISSummaryReportApplication";
 import {adhocPopupForSeRoadCutForward} from "./payResource/adhocPopup";
 
  import { showHideAdhocPopup, resetFields, getRequiredDocData } from "../utils";
  import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
  
  import { searchResultsReports } from "./searchResource/searchResults";
  import { setBusinessServiceDataToLocalStorage } from "egov-ui-framework/ui-utils/commons";
  import {
    getOPMSTenantId,
    localStorageGet
  } from "egov-ui-kit/utils/localStorageUtils";
  import find from "lodash/find";
  import set from "lodash/set";
  import get from "lodash/get";
  import {
    prepareFinalObject,
    handleScreenConfigurationFieldChange as handleField
  } from "egov-ui-framework/ui-redux/screen-configuration/actions";
  import { getRequiredDocuments } from "./requiredDocuments/reqDocs";
  import { getUpdatePriceBook ,getSubCategory,getCategory} from "./searchResource/citizenSearchFunctions";
  
  const hasButton = getQueryArg(window.location.href, "hasButton");
  let enableButton = true;
  enableButton = hasButton && hasButton === "false" ? false : true;
  
  const header = getCommonHeader({
    labelName: "Summery Report",
    labelKey: "NOC_SUMMERY_REPORT"
  });
  
  const NOCSearchAndResult = {
    uiFramework: "material-ui",
    name: "MISSummaryReport",
    beforeInitScreen: (action, state, dispatch) => {
        
        const pricebookid = getQueryArg(
            window.location.href,
            "pricebookid"
          );

  
    getCategory(action, state, dispatch);
    getSubCategory(action, state, dispatch);
         set(
          state,
          "screenConfiguration.preparedFinalObject.MISSummaryReport[0].ToDate",
          new Date()
        );
        set(
          state,
          "screenConfiguration.preparedFinalObject.MISSummaryReport[0].FromDate",
          new Date()
        );
    
      return action;
    },
    components: {
      div: {
        uiFramework: "custom-atoms",
        componentPath: "Form",
        props: {
          className: "common-div-css",
          id: "MISSummaryReport"
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
                ...header
              },
              newApplicationButton: {
                componentPath: "Button",
                gridDefination: {
                  xs: 12,
                  sm: 6,
                  align: "right"
                },
                visible: enableButton,
                props: {
                  variant: "contained",
                  color: "primary",
                  style: {
                    color: "white",
                    borderRadius: "2px",
                    width: "250px",
                    height: "48px"
                  }
                },
  
                children: {
                  plusIconInsideButton: {
                    uiFramework: "custom-atoms",
                    componentPath: "Icon",
                    props: {
                      iconName: "add",
                      style: {
                        fontSize: "24px"
                      }
                    }
                  },
  
                  buttonLabel: getLabel({
                    labelName: "NEW APPLICATION",
                    labelKey: "NOC_HOME_SEARCH_RESULTS_NEW_APP_BUTTON"
                  })
                },
                onClickDefination: {
                  action: "condition",
                  callBack: (state, dispatch) => {
                    showHideAdhocPopup(state, dispatch, "MISSummaryReport");
                  }
                },
                roleDefination: {
                  rolePath: "user-info.roles",
                  roles: ["NOC_CEMP", "SUPERUSER"]
                }
              }
            }
          },
          NOCApplication2,

          breakAfterSearch: getBreak(),
       //   NOCApplication2,
          
          // progressStatus,
          searchResultsReports
        }
      },
      adhocDialog: {
        uiFramework: "custom-containers-local",
        moduleName: "egov-opms",
        componentPath: "DialogContainer",
        props: {
          open: false,
          maxWidth: false,
          screenKey: "MISSummaryReport"
        },
        children: {
          popup: {}
        }
      }
    }
  };
  
  export default NOCSearchAndResult;
  