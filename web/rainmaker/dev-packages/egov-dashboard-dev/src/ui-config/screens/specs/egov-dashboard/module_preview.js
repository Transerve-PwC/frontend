import { getCommonCard, getTextField, getCommonContainer, getCommonHeader } from "egov-ui-framework/ui-config/screens/specs/utils";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getFileUrlFromAPI, getQueryArg, setBusinessServiceDataToLocalStorage } from "egov-ui-framework/ui-utils/commons";
import { getTenantId, getUserInfo, setapplicationNumber, getapplicationNumber, setapplicationType, setCurrentAssignee, setHCRoles, setServiceRequestStatus, setSLADays } from "egov-ui-kit/utils/localStorageUtils";
import jp from "jsonpath";
import get from "lodash/get";
import set from "lodash/set";
// import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getData, previewWF } from "../../../../ui-utils/commons";
import { getCommonApplyFooter } from "../utils";
import { getLabel } from "egov-ui-framework/ui-config/screens/specs/utils";
import { handleScreenConfigurationFieldChange as handleField } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { toggleSpinner } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { moduleDetails } from "./reportWorkflowPreview/moduleDetails"

let role_name = JSON.parse(getUserInfo()).roles[0].code

let data = []

const getRedirectionURL = () => {
//   let response = previewWF(state, dispatch, status);
  const redirectionURL = "/egov-report/preview"
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
  // header: getCommonHeader({
  //   labelName: "",
  //   labelKey: "Module Name"
  // }),
  applicationNumber: {
    uiFramework: "custom-atoms-local",
    moduleName: "egov-report",
    componentPath: "ServiceRequestId",
  },        
});

const fetchData = async (action, state, dispatch) => {
  let response = getData(state, dispatch, status);
}

const screenConfig = {
  uiFramework: "material-ui",
  name: "module_preview",
  beforeInitScreen: (action, state, dispatch) => {

    let res = fetchData(action, state, dispatch)

    const serviceName =  get(state.screenConfiguration.preparedFinalObject, "dropDownData2.label", "");
	  if(serviceName !== ""){
      setapplicationNumber(serviceName);
    }
    else{
      setapplicationNumber(getapplicationNumber());
    }
    
    // dispatch(prepareFinalObject("WF_CHARTDATA", payloadData));
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
          jsonPath: "dropDownData2.label",
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
            moduleWiseWorkflow : {
                uiFramework: "custom-molecules-local",
                moduleName: "egov-report",
                componentPath: "WorkFlowChart",
                props: {
                data : ""
                },
                style: {
                    minWidth: "1200px",
                    height: "500px",
                    marginRight: "45px"
                },
                visible: true,
                // required: true
            },
        }),
        footer
        }
    }
  }
};

export default screenConfig;