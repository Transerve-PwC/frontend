import { getCommonHeader } from "egov-ui-framework/ui-config/screens/specs/utils";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import set from "lodash/set";
import acknowledgementCard from "./acknowledgementResource/acknowledgementUtils";
import { gotoHomeFooter } from "./acknowledgementResource/gotoHomeFooter";
import "./index.css";





const getAcknowledgementCard = (
  state,
  dispatch,
  purpose,
  status,
  applicationNumber,
  secondNumber,
  financialYear,
  tenant
) => {
  const financialYearText = financialYear ? financialYear : "";
  
  if (purpose === "verifyAndForward" && status === "success") {
    return {
      header: getCommonHeader({
        labelName: `Service Request`,
        labelKey: "HC_SERVICE_REQUEST_HEADER",
        // dynamicArray: [financialYearText]
      }),
      applicationSuccessCard: {
        uiFramework: "custom-atoms",
        componentPath: "Div",
        children: {
          card: acknowledgementCard({
            icon: "done",
            backgroundColor: "#39CB74",
            header: {
              labelName: "Service Request Forwarded Successfully",
              labelKey: "HC_VERIFY_FORWARD_SUCCESS_MESSAGE_MAIN"
            },
            tailText: {
              labelName: "Service Request ID",
              labelKey: "HC_HOME_SEARCH_RESULTS_APP_NO_LABEL"
            },
            number: applicationNumber
          })
        }
      },
      gotoHomeFooter
    }
  }
  else if (purpose === "application" && status === "rejected") {
    return {
      header: getCommonHeader({
        labelName: `Service Request`,
        labelKey: "HC_SERVICE_REQUEST_HEADER",
        // dynamicArray: [financialYearText]
      }),
      applicationSuccessCard: {
        uiFramework: "custom-atoms",
        componentPath: "Div",
        children: {
          card: acknowledgementCard({
            icon: "close",
            backgroundColor: "#E54D42",
            header: {
              labelName: "Service Request Rejected Successfully",
              labelKey: "HC_REJECT_SUCCESS_MESSAGE_MAIN"
            },
            tailText: {
              labelName: "Service Request ID",
              labelKey: "HC_HOME_SEARCH_RESULTS_APP_NO_LABEL"
            },
            number: applicationNumber
          })
        }
      },
      gotoHomeFooter
    }
  }
  else if (purpose === "verifyAndForwardToSDO" && status === "success") {
    return {
      header: getCommonHeader({
        labelName: `Service Request`,
        labelKey: "HC_SERVICE_REQUEST_HEADER",
        // dynamicArray: [financialYearText]
      }),
      applicationSuccessCard: {
        uiFramework: "custom-atoms",
        componentPath: "Div",
        children: {
          card: acknowledgementCard({
            icon: "done",
            backgroundColor: "#39CB74",
            header: {
              labelName: "Service Request Forwarded To SDO Successfully",
              labelKey: "HC_VERIFY_FORWARD_TO_SDO_SUCCESS_MESSAGE_MAIN"
            },
            tailText: {
              labelName: "Service Request ID",
              labelKey: "HC_HOME_SEARCH_RESULTS_APP_NO_LABEL"
            },
            number: applicationNumber
          })
        }
      },
      gotoHomeFooter
    }
  }
  else if (purpose === "inspect" && status === "success") {
    return {
      header: getCommonHeader({
        labelName: `Service Request`,
        labelKey: "HC_SERVICE_REQUEST_HEADER",
        // dynamicArray: [financialYearText]
      }),
      applicationSuccessCard: {
        uiFramework: "custom-atoms",
        componentPath: "Div",
        children: {
          card: acknowledgementCard({
            icon: "done",
            backgroundColor: "#39CB74",
            header: {
              labelName: "Service Request Inspected Successfully",
              labelKey: "HC_INSPECT_SUCCESS_MESSAGE_MAIN"
            },
            tailText: {
              labelName: "Service Request ID",
              labelKey: "HC_HOME_SEARCH_RESULTS_APP_NO_LABEL"
            },
            number: applicationNumber
          })
        }
      },
      gotoHomeFooter
    }
  }
  else if (purpose === "approve" && status === "success") {
    return {
      header: getCommonHeader({
        labelName: `Service Request`,
        labelKey: "HC_SERVICE_REQUEST_HEADER",
        // dynamicArray: [financialYearText]
      }),
      applicationSuccessCard: {
        uiFramework: "custom-atoms",
        componentPath: "Div",
        children: {
          card: acknowledgementCard({
            icon: "done",
            backgroundColor: "#39CB74",
            header: {
              labelName: "Service Request Approved Successfully",
              labelKey: "HC_APPROVED_SUCCESS_MESSAGE_MAIN"
            },
            tailText: {
              labelName: "Service Request ID",
              labelKey: "HC_HOME_SEARCH_RESULTS_APP_NO_LABEL"
            },
            number: applicationNumber
          })
        }
      },
      gotoHomeFooter
    }
  }
  else if (purpose === "requestForClarification" && status === "success") {
    return {
      header: getCommonHeader({
        labelName: `Service Request`,
        labelKey: "HC_SERVICE_REQUEST_HEADER",
        // dynamicArray: [financialYearText]
      }),
      applicationSuccessCard: {
        uiFramework: "custom-atoms",
        componentPath: "Div",
        children: {
          card: acknowledgementCard({
            icon: "done",
            backgroundColor: "#39CB74",
            header: {
              labelName: "Service Request Sent For Clarification Successfully",
              labelKey: "HC_REQUEST_FOR_CLARIFICATION_SUCCESS_MESSAGE_MAIN"
            },
            tailText: {
              labelName: "Service Request ID",
              labelKey: "HC_HOME_SEARCH_RESULTS_APP_NO_LABEL"
            },
            number: applicationNumber
          })
        }
      },
      gotoHomeFooter
    }
  }
  else if (purpose === "forwardForInspection" && status === "success") {
    return {
      header: getCommonHeader({
        labelName: `Service Request`,
        labelKey: "HC_SERVICE_REQUEST_HEADER",
        // dynamicArray: [financialYearText]
      }),
      applicationSuccessCard: {
        uiFramework: "custom-atoms",
        componentPath: "Div",
        children: {
          card: acknowledgementCard({
            icon: "done",
            backgroundColor: "#39CB74",
            header: {
              labelName: "Service Request Sent For Inspection Successfully",
              labelKey: "HC_REQUEST_SENT_FOR_INSPECTION_SUCCESS_MESSAGE_MAIN"
            },
            tailText: {
              labelName: "Service Request ID",
              labelKey: "HC_HOME_SEARCH_RESULTS_APP_NO_LABEL"
            },
            number: applicationNumber
          })
        }
      },
      gotoHomeFooter
    }
  }
  else if (purpose === "complete" && status === "success") {
    return {
      header: getCommonHeader({
        labelName: `Service Request`,
        labelKey: "HC_SERVICE_REQUEST_HEADER",
        // dynamicArray: [financialYearText]
      }),
      applicationSuccessCard: {
        uiFramework: "custom-atoms",
        componentPath: "Div",
        children: {
          card: acknowledgementCard({
            icon: "done",
            backgroundColor: "#39CB74",
            header: {
              labelName: "Service Request Completed Successfully",
              labelKey: "HC_COMPLETE_SUCCESS_MESSAGE_MAIN"
            },
            tailText: {
              labelName: "Service Request ID",
              labelKey: "HC_HOME_SEARCH_RESULTS_APP_NO_LABEL"
            },
            number: applicationNumber
          })
        }
      },
      gotoHomeFooter
    }
  }

};

const screenConfig = {
  uiFramework: "material-ui",
  name: "acknowledgement",
  components: {
    div: {
      uiFramework: "custom-atoms",
      componentPath: "Div",
      props: {
        className: "common-div-css"
      }
    }
  },
  beforeInitScreen: (action, state, dispatch) => {
    const purpose = getQueryArg(window.location.href, "purpose");
    const status = getQueryArg(window.location.href, "status");
    const financialYear = getQueryArg(window.location.href, "FY");
    const applicationNumber = getQueryArg(
      window.location.href,
      "applicationNumber"
    );
    const secondNumber = getQueryArg(window.location.href, "secondNumber");
    const tenant = getQueryArg(window.location.href, "tenantId");
    const data = getAcknowledgementCard(
      state,
      dispatch,
      purpose,
      status,
      applicationNumber,
      secondNumber,
      financialYear,
      tenant
    );
    set(action, "screenConfig.components.div.children", data);
    return action;
  }
};

export default screenConfig;