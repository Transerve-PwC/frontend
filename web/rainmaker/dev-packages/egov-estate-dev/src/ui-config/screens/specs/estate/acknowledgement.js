import {
  getCommonHeader,
} from "egov-ui-framework/ui-config/screens/specs/utils";
import {
  getQueryArg
} from "egov-ui-framework/ui-utils/commons";
import {
  handleScreenConfigurationFieldChange as handleField
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import acknowledgementCard from "./acknowledgementResource/acknowledgementUtils";
import {
  applicationSuccessFooter
} from "./acknowledgementResource/applicationSuccessFooter";
import { WF_PROPERTY_MASTER } from "../../../../ui-constants";
import { paymentFailureFooter } from "./acknowledgementResource/paymentFailureFooter";

const getAcknowledgementCard = (
  state,
  dispatch,
  {
  purpose,
  status,
  tenant,
  fileNumber,
  type,
  businessService,
  applicationNumber
}
) => {
  var header;
  if (status === "success") {
    if(type === WF_PROPERTY_MASTER) {
    if (purpose == "apply") {
      header = {
        labelName: "Estate Property Master Entry Submitted Successfully",
        labelKey: "ES_MASTER_ENTRY_SUCCESS_MESSAGE_MAIN"
      }
    }
    else if (purpose == "forward") {
      header = {
        labelName: "Estate Property Master Entry Forwarded Successfully",
        labelKey: "ES_MASTER_ENTRY_FORWARD_SUCCESS_MESSAGE_MAIN"
      }
    }
    else if (purpose == "sendback") {
      header = {
        labelName: "Estate Property Master Entry is Sent Back Successfully",
        labelKey: "ES_MASTER_ENTRY_SENDBACK_SUCCESS_MESSAGE_MAIN"
      }
    }
    else if (purpose == "reject") {
      header = {
        labelName: "Estate Property Master Entry Rejected",
        labelKey: "ES_MASTER_ENTRY_REJECT_SUCCESS_MESSAGE_MAIN"
      }
    }
    else if (purpose == "approve") {
      header = {
        labelName: "Estate Property Master Entry is Approved Successfully",
        labelKey: "ES_MASTER_ENTRY_APPROVE_SUCCESS_MESSAGE_MAIN"
      }
    }
    else {
      header = {}
    }
  } else {
    if (purpose == "apply") {
      header = {
        labelName: "Ownership transfer application Submitted Successfully",
        labelKey: "ES_OWNERSHIP_TRANSFER_SUCCESS_MESSAGE_MAIN"
      }
    }
    else if (purpose == "forward") {
      header = {
        labelName: "Ownership transfer application Forwarded Successfully",
        labelKey: "ES_OWNERSHIP_TRANSFER_FORWARD_SUCCESS_MESSAGE_MAIN"
      }
    }
    else if (purpose == "sendback") {
      header = {
        labelName: "Ownership transfer application is Sent Back Successfully",
        labelKey: "ES_OWNERSHIP_TRANSFER_SENDBACK_SUCCESS_MESSAGE_MAIN"
      }
    }
    else if (purpose == "reject") {
      header = {
        labelName: "Ownership transfer application Rejected",
        labelKey: "ES_OWNERSHIP_TRANSFER_REJECT_SUCCESS_MESSAGE_MAIN"
      }
    }
    else if (purpose == "approve") {
      header = {
        labelName: "Ownership transfer application Approved Successfully",
        labelKey: "ES_OWNERSHIP_TRANSFER_APPROVE_SUCCESS_MESSAGE_MAIN"
      }
    } else if(purpose === "pay") {
      header = {
        labelName: "Payment is collected successfully",
        labelKey: "RP_PAYMENT_SUCCESS_MESSAGE_HEAD"
      }
    }
    else {
      header = {}
    }
  }

    const tailText = !!applicationNumber ? 
    {
      labelName: "Application Number",
      labelKey: "ES_APPLICATION_NUMBER_LABEL"
    }
    : {
      labelName: "File Number",
      labelKey: "ES_FILE_NUMBER_LABEL"
    }

    return {
      header: getCommonHeader({
        labelName: `Estates`,
        labelKey: "ES_COMMON_ESTATES",
      }),
      applicationSuccessCard: {
        uiFramework: "custom-atoms",
        componentPath: "Div",
        children: {
          card: acknowledgementCard({
            icon: purpose === "reject" ? "close" : "done",
            backgroundColor: purpose === "reject" ? "#E54D42" : "#39CB74",
            header,
            tailText: tailText,
            number: applicationNumber || fileNumber
          })
        }
      },
      applicationSuccessFooter: applicationSuccessFooter(
        state,
        dispatch,
        tenant
      )
    };
  } else if(status === "failure" && purpose === "pay") {
    return {
      header: getCommonHeader({
        labelName: `Rented Properties`,
        labelKey: "RP_COMMON_RENTED_PROPERTIES",
      }),
      applicationSuccessCard: {
        uiFramework: "custom-atoms",
        componentPath: "Div",
        children: {
          card: acknowledgementCard({
            icon: "close",
            backgroundColor: "#E54D42",
            header: {
              labelName: "Payment is Failed!",
              labelKey: "ES_PAYMENT_FAILED_MESSAGE_HEAD"
            },
            body: {
              labelName:
                "A notification regarding Application Submission has been sent to trade owner at registered Mobile No.",
              labelKey: "ES_APPLICATION_SUCCESS_MESSAGE_SUB"
            },
            tailText: {
              labelName: "Application Number",
              labelKey: "ES_APPLICATION_NUMBER_LABEL"
            },
            number: applicationNumber
          })
        }
      },
      paymentFailureFooter: paymentFailureFooter(applicationNumber, tenant, businessService)
    }
  }
}

const getData = async (action, state, dispatch, {purpose, status, tenant, fileNumber, applicationNumber, type, businessService}) => {
  const data = await getAcknowledgementCard(
    state,
    dispatch,
    { 
    purpose,
    status,
    tenant,
    fileNumber,
    type,
    businessService,
    applicationNumber
    }
  );
  dispatch(
    handleField(
      "acknowledgement",
      "components.div",
      "children",
      data
    )
  );
}

const screenConfig = {
  uiFramework: "material-ui",
  name: "acknowledgement",
  beforeInitScreen: (action, state, dispatch) => {
    const purpose = getQueryArg(window.location.href, "purpose");
    const status = getQueryArg(window.location.href, "status");
    const fileNumber = getQueryArg(
      window.location.href,
      "fileNumber"
    );
    const applicationNumber = getQueryArg(window.location.href, "applicationNumber")
    const tenant = getQueryArg(window.location.href, "tenantId");
    const type = getQueryArg(window.location.href, "type")
    const businessService = getQueryArg(window.location.href, "businessService")
    getData(action, state, dispatch, {purpose, status, tenant, fileNumber, applicationNumber, type, businessService})
    return action;
  },
  components: {
    div: {
      uiFramework: "custom-atoms",
      componentPath: "Div",
      props: {
        className: "common-div-css"
      }
    }
  }
};

export default screenConfig;