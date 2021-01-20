import { getCommonCard, getTextField, getCommonContainer, getCommonHeader } from "egov-ui-framework/ui-config/screens/specs/utils";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getFileUrlFromAPI, getQueryArg, setBusinessServiceDataToLocalStorage } from "egov-ui-framework/ui-utils/commons";
import { getTenantId, getUserInfo, setapplicationNumber, setModule, setapplicationType, setCurrentAssignee, setHCRoles, setServiceRequestStatus, setSLADays } from "egov-ui-kit/utils/localStorageUtils";
import jp from "jsonpath";
import get from "lodash/get";
import set from "lodash/set";
import "../../../../customstyle.css";
// import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { previewWF } from "../../../../ui-utils/commons";
import { getCommonApplyFooter } from "../utils";
import { getLabel } from "egov-ui-framework/ui-config/screens/specs/utils";
import { handleScreenConfigurationFieldChange as handleField } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { toggleSpinner } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import "./index.css"

let role_name = JSON.parse(getUserInfo()).roles[0].code

let data = []


const callBackForNext = async (state, dispatch, status) => {

   
  let response = previewWF(state, dispatch, status);
};

const getRedirectionURL = () => {
  /* Mseva 2.0 changes */
  const redirectionURL = "/egov-dashboard/dashboardReportFilter"
  // const redirectionURL = "/egov-report/preview"
  return redirectionURL;
};

export const footer = getCommonApplyFooter({
    nextButton: {
      componentPath: "Button",
      props: {
        variant: "outlined",
        color: "primary",
        style: {
          minWidth: "200px",
          height: "48px",
          marginRight: "45px"
        }
      },
      children: {
        nextButtonLabel: getLabel({
          labelName: "BUTTON",
          labelKey: "HOME"
        }),
  
        
      },
      // onClickDefination: {
      //   action: "page_change",
      //   path: `${getRedirectionURL()}`
      // },
      visible: true
    }  
  });

const titlebar = getCommonContainer({
  header: getCommonHeader({
    labelName: "",
    labelKey: "Dashboard :: PGR"
  })        
});

const screenConfig = {
  uiFramework: "material-ui",
  name: "pgrDashboardReport",
  beforeInitScreen: (action, state, dispatch) => {

    setModule("PGR")
    var data =  [
      {
          "name" : "Report 1",
          "code" : "Report 1"
      },
      {
          "name" : "Report 2",
          "code" : "Report 2"
      }
      ]
    dispatch(prepareFinalObject("dropDownData", data));
    // let response = previewWF(state, dispatch, status);

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
                sm: 12
              },
              ...titlebar
            }
          } 
        },
        body : getCommonCard({
          typeofrequest: {
            uiFramework: "custom-containers-local",
            moduleName: "egov-dashboard",
            componentPath: "AutosuggestContainer",
            jsonPath: "dropDownData2",
                  required: true,
                  gridDefination: {
                          xs: 12,
                          sm: 12,
                          md: 12,
                          lg:12
                        },
          props: {
          style: {
          width: "100%",
          cursor: "pointer"
          },
         
          className: "citizen-city-picker",
          label: { labelName: "", labelKey: "Reports" },
          placeholder: {
            labelName: "",
            labelKey: "Select Reports"
          },
          sourceJsonPath: "dropDownData",
          jsonPath: "dropDownData2",
          maxLength:5,
          labelsFromLocalisation: false,
          suggestions: [],
          fullwidth: true,
          required: true,
          inputLabelProps: {
            shrink: true
          },
          isMulti: false,
          labelName: "name",
          valueName: "name"
          },
          
        },
        searchBTN: {
          componentPath: "Button",
          props: {
            variant: "outlined",
            color: "primary",
            style: {
              minWidth: "200px",
              height: "48px",
              marginRight: "45px"
            }
          },
          children: {
            nextButtonLabel: getLabel({
              labelName: "BUTTON",
              labelKey: "SEARCH"
            }),
      
            
          },
          onClickDefination: {
            action: "page_change",
            path: `${getRedirectionURL()}`
          },
          visible: true
        },

        }),
        footer
        }
    }
  }
};

export default screenConfig;
