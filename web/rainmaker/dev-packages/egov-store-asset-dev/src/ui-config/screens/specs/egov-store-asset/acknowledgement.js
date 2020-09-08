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
const getHeader = (applicationNumber) => {
  return getCommonContainer({
    header: getCommonHeader({
      labelName: `Store Master Created Successfully`,
      labelKey: "",
    }),
    applicationNumber: {
      uiFramework: "custom-atoms-local",
      moduleName: "egov-store-asset",
      componentPath: "ApplicationNoContainer",
      props: {
        number: applicationNumber,
      },
      visible: true,
    },
  });
};

const getLabelForStoreAsset = () => {
let labelValue = "";
  switch(screenName){
    case "STOREMASTER": labelValue = {
      labelName: "Store Master Submitted Successfully",
      labelKey: `STORE_APPLICATION_SUCCESS_${screenName}_${mode}`,
    }
    break;
    case "MATERIALTYPE": labelValue = {
      labelName: "Store Master Submitted Successfully",
      labelKey: `STORE_APPLICATION_SUCCESS_${screenName}_${mode}`,
    }
    break;
    case "SUPPLIERMASTER": labelValue = {
      labelName: "Store Master Submitted Successfully",
      labelKey: `STORE_APPLICATION_SUCCESS_${screenName}_${mode}`,
    }
    break;
    case "PRICELIST": labelValue = {
      labelName: "Price List Submitted Successfully",
      labelKey: `STORE_APPLICATION_SUCCESS_${screenName}_${mode}`,
    }
    break;
    case "MATERIALMASTER": labelValue = {
      labelName: "Material Master Submitted Successfully",
      labelKey: `STORE_APPLICATION_SUCCESS_${screenName}_${mode}`,
    }
    break;
    case "OPENINGBALANCE": labelValue = {
      labelName: "Opening Balance Submitted Successfully",
      labelKey: `STORE_APPLICATION_SUCCESS_${screenName}_${mode}`,
    }
    break;
    case "MATERIALINDENT": labelValue = {
      labelName: "Material Indent Submitted Successfully",
      labelKey: `STORE_APPLICATION_SUCCESS_${screenName}_${mode}`,
    }
    break;
    case "MATERIALINDENTNOTE": labelValue = {
      labelName: "Material Indent Note Submitted Successfully",
      labelKey: `STORE_APPLICATION_SUCCESS_${screenName}_${mode}`,
    }
    break;
    case "INDENTTFR": labelValue = {
      labelName: "Material Indent Tranfer Submitted Successfully",
      labelKey: `STORE_APPLICATION_SUCCESS_${screenName}_${mode}`,
    }
    break;
    case "INDENTINWORD": labelValue = {
      labelName: "Material Indent Inword Submitted Successfully",
      labelKey: `STORE_APPLICATION_SUCCESS_${screenName}_${mode}`,
    }
    break;
    case "INDENTOUTWORD": labelValue = {
      labelName: "Material Indent Outword Submitted Successfully",
      labelKey: `STORE_APPLICATION_SUCCESS_${screenName}_${mode}`,
    }
    break;
    case "PURCHASEORDER": labelValue = {
      labelName: "Material Master Submitted Successfully",
      labelKey: `STORE_APPLICATION_SUCCESS_${screenName}_${mode}`,
    }
    break;
    case "MATERIALRECEIPT": labelValue = {
      labelName: "Material Receipt Created Successfully",
      labelKey: `STORE_APPLICATION_SUCCESS_${screenName}_${mode}`,
    }
    break;
    case "MATERIALRECEIPTMISC": labelValue = {
      labelName: "Miscellaneous Material Receipt Created Successfully",
      labelKey: `STORE_APPLICATION_SUCCESS_${screenName}_${mode}`,
    }
    break;
    case "SCRAP": labelValue = {
      labelName: "Material Master Submitted Successfully",
      labelKey: `STORE_APPLICATION_SUCCESS_${screenName}_${mode}`,
    }
    break;
    case "DISPOSAL": labelValue = {
      labelName: "Material Master Submitted Successfully",
      labelKey: `STORE_APPLICATION_SUCCESS_${screenName}_${mode}`,
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
    case "STOREMASTER": labelValue = {
      labelName: "Store Name",
      labelKey: `STORE_DETAILS_STORE_NAME`,
    }
    break;
    case "MATERIALTYPE": labelValue = {
      labelName: "Material Type name",
      labelKey: "STORE_MATERIAL_TYPE_NAME", 
    }
    break;
    case "SUPPLIERMASTER": labelValue = {
      labelName: "Supplier Name",
      labelKey: "STORE_SUPPLIER_MASTER_SUPPLIER_NAME",
    }
    break;
    case "PRICELIST": labelValue = {
      // labelName: "Price List",
      // labelKey: `STORE_SUPPLIER_MASTER_SUPPLIER_NAME`,
      labelName: "",
      labelKey: ``,
    }
    break;
    case "MATERIALMASTER": labelValue = {
      // labelName: "Material Master",
      // labelKey: `STORE_COMMON_MATERIAL_MASTER`,
      labelName: "",
      labelKey: ``,
    }
    break;
    case "OPENINGBALANCE": labelValue = {
      labelName: "mrnNumber",
      labelKey: `STORE_MATERIAL_COMMON_MRN_NUMBER`,
    }
    break;
    case "MATERIALINDENT": labelValue = {
      labelName: "Indent Number",
      labelKey: `STORE_INDENT_NUMBER`,
    }
    break;
    case "MATERIALINDENTNOTE": labelValue = {
      labelName: "Issue Number",
      labelKey: `STORE_MATERIAL_INDENT_NOTE_ISSUE_NOTE_NUMBER`,
    }
    break;
    case "INDENTTFR": labelValue = {
      labelName: "Issue Number",
      labelKey: `STORE_MATERIAL_INDENT_NOTE_ISSUE_NOTE_NUMBER`,
    }
    break;
    case "INDENTOUTWORD": labelValue = {
      labelName: "Issue Number",
      labelKey: `STORE_MATERIAL_INDENT_NOTE_ISSUE_NOTE_NUMBER`,
    }
    break;
    case "INDENTINWORD": labelValue = {
      labelName: "Material Receipt Number",
      labelKey: `STORE_MATERIAL_COMMON_MRN_NUMBER`,
    }
    break;
    case "MATERIALRECEIPT": labelValue = {
      labelName: "mrnNumber",
      labelKey: `STORE_MATERIAL_COMMON_MRN_NUMBER`,
    }
    break;
       case "PURCHASEORDER": labelValue = {
      labelName: "Purchase Order Number",
      labelKey: `STORE_PURCHASE_ORDER_NUMBER`,
    }
    break;
    case "SCRAP": labelValue = {
      labelName: "Scrap Number",
      labelKey: `STORE_SCRAP_NUMBER`,
    }
    break;
    case "DISPOSAL": labelValue = {
      labelName: "Disposal Number",
      labelKey: `STORE_DISPOSAL_NUMBER`,
    }
    break;
    
    
    default :  labelValue = {
      labelName: "Application No.",
      labelKey: "NOC_HOME_SEARCH_RESULTS_APP_NO_LABEL",
    }

  }
 return labelValue;
}


const getAcknowledgementCard = (state, dispatch, applicationNumber) => {
  return {
  //  header: getHeader(applicationNumber),
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
