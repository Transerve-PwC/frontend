import {
  getCommonHeader,
  getCommonContainer,
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { gotoHomeFooter } from "./acknowledgementResource/footers";
import acknowledgementCard from "./acknowledgementResource/acknowledgementUtils";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import get from "lodash/get";
import set from "lodash/set";
import { Icon } from "egov-ui-framework/ui-atoms";
import { getLabel } from "egov-ui-framework/ui-config/screens/specs/utils";
import { handleScreenConfigurationFieldChange as handleField } from "egov-ui-framework/ui-redux/screen-configuration/actions";
const screenName = getQueryArg(window.location.href, "screen").toUpperCase();
const mode = getQueryArg(window.location.href, "mode").toUpperCase();
const code = getQueryArg(window.location.href, "code");


const getLabelForStoreAsset = () => {
let labelValue = "";
  switch(screenName){
    case "SEP":
    case "SMID" :
    case "SUH":
    case "SUHLOG":
    case "SUSV":
    case "SUSVTRANSACTION":
       labelValue = {
      labelName: "SEP Program Submitted Successfully",
      labelKey: `NULM_APPLICATION_SUCCESS_${screenName}_${mode}`,
    }
    break;
case "REGORGANIZATION" :
  labelValue = {
    labelName: "Organisation Registered Successfully",
    labelKey: `NULM_APPLICATION_SUCCESS_${screenName}_${mode}`,
  }
  break;
  case "SMIDORG":
    labelValue = {
      labelName: "SMID for Organization Submitted Successfully",
      labelKey: `NULM_APPLICATION_SUCCESS_${screenName}_${mode}`,
    }
    break;
    default :  labelValue = {
      labelName: "Submitted Successfully",
      labelKey: "",
    }

  }
 return labelValue;
}

const getApplicationDisplayCode =() => {
  let labelValue = "";
  switch(screenName){
    case "SEP":
    case "SMID" :
    case "SMIDORG":
    case "SUH":
    case "SUSV":
    case "SUSVTRANSACTION":
         labelValue = {
          labelName: "Application Id",
          labelKey: `NULM_SEP_APPLICATION_ID`,
        }
        break;
    case "REGORGANIZATION" :
      labelValue = {
        labelName: "Organization Name",
        labelKey: `NULM_NGO_REG_ORGANIZATION_NAME`,
      }
      break;
    case "SUHLOG":
      labelValue = {
        labelName: "Name of shelter",
        labelKey: `NULM_SUH_OF_SHELTER`,
      }
      break;
      case "SUHLOGC":
        labelValue = {
          labelName: "Name of shelter",
          labelKey: `NULM_SUH_CITIZEN_SELTER_REQUEST`,
        }
        break;
    default :  labelValue = {
      labelName: "Application No.",
      labelKey: "NULM_SEP_APPLICATION_ID",
    }

  }
 return labelValue;
}


const getAcknowledgementCard = (state, dispatch, applicationNumber) => {
  return {
    applicationSuccessCard: {
      uiFramework: "custom-atoms",
      componentPath: "Div",
      children: {
        card: acknowledgementCard({
          icon: "done",
          backgroundColor: "#39CB74",
          header: getLabelForStoreAsset(),
          body: {
            labelName:
              "A notification regarding Application Submission has been sent to the applicant",
            labelKey: "PET_NOC_APPLICATION_SUCCESS_MESSAGE_SUB",
          },
          tailText: getApplicationDisplayCode(),
          number: applicationNumber,
        }),
      },
    },
    gotoHomeFooter,
  };
};

const screenConfig = {
  uiFramework: "material-ui",
  name: "acknowledgement",
  components: {
    div: {
      uiFramework: "custom-atoms",
      componentPath: "Div",
      props: {
        className: "common-div-css",
      },
    },
  },
  beforeInitScreen: (action, state, dispatch) => {
    let applicationNumber = code;
    const data = getAcknowledgementCard(
      state,
      dispatch,
      applicationNumber
    );
    set(action, "screenConfig.components.div.children", data);
    return action;
  },
};

export default screenConfig;
