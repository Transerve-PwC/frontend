import {
    getCommonHeader,
    getLabel,
    getBreak
  } from "egov-ui-framework/ui-config/screens/specs/utils";
 import {NOCReport3} from "./searchResource/MISSummaryReportApplication";
 import {adhocPopupForSeRoadCutForward} from "./payResource/adhocPopup";
 
  import { showHideAdhocPopup, resetFields, getRequiredDocData } from "../utils";
  import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
  
  import { searchResultsReports3 } from "./searchResource/searchResults";
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
  import { getUpdatePriceBook ,getSubCategory,getSectordata} from "./searchResource/citizenSearchFunctions";
  
  const hasButton = getQueryArg(window.location.href, "hasButton");
  let enableButton = true;
  enableButton = hasButton && hasButton === "false" ? false : true;
  
  const header = getCommonHeader({
    labelName: "Revenue Collection Report Sector Wise",
    labelKey: "NOC_REVENUE_COLLECTION_REPORT_SECTOR"
  });
  
  //alert('in update rate')
  const NOCSearchAndResult = {
    uiFramework: "material-ui",
    name: "reportSectorWise",
    beforeInitScreen: (action, state, dispatch) => {
      setOPMSTenantId(getTenantId());
        const pricebookid = getQueryArg(
            window.location.href,
            "pricebookid"
          );

          
          dispatch(
            handleField(
              "reportSectorWise",
              "components.div.children.NOCReport3.children.cardContent.children.masterContainer.children.sector",
              "props.value",""
              
            )
          );
      getSectordata(action, state, dispatch);
      set(
        state,
        "screenConfiguration.preparedFinalObject.reportSectorWise[0].ToDate",
        new Date()
      );
      set(
        state,
        "screenConfiguration.preparedFinalObject.reportSectorWise[0].FromDate",
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
          id: "reportSectorWise"
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
                    //pageResetAndChange(state, dispatch);
                    showHideAdhocPopup(state, dispatch, "reportSectorWise");
                  }
                },
                roleDefination: {
                  rolePath: "user-info.roles",
                  roles: ["NOC_CEMP", "SUPERUSER"]
                }
              }
            }
          },
          NOCReport3,

          breakAfterSearch: getBreak(),
       //   NOCApplication2,
          
          // progressStatus,
          searchResultsReports3
        }
      },
      adhocDialog: {
        uiFramework: "custom-containers-local",
        moduleName: "egov-opms",
        componentPath: "DialogContainer",
        props: {
          open: false,
          maxWidth: false,
          screenKey: "reportSectorWise"
        },
        children: {
          popup: {}
        }
      }
    }
  };
  
  export default NOCSearchAndResult;
  