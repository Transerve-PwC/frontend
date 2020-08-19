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
// import {
//   paymentFailureFooter
// } from "./acknowledgementResource/paymentFailureFooter";

const getAcknowledgementCard = (
  state,
  dispatch,
  purpose,
  status,
  tenant,
  fileNumber,
  type,
  businessService
) => {
  var header;
  if (status === "success") {
    if (purpose == "apply") {
      header = {
        labelName: "Estate Property Master Entry Submitted Successfully",
        labelKey: "EST_MASTER_ENTRY_SUCCESS_MESSAGE_MAIN"
      }
    }
    else if (purpose == "forward") {
      header = {
        labelName: "Estate Property Master Entry Forwarded Successfully",
        labelKey: "EST_MASTER_ENTRY_FORWARD_SUCCESS_MESSAGE_MAIN"
      }
    }
    else if (purpose == "sendback") {
      header = {
        labelName: "Estate Property Master Entry is Sent Back Successfully",
        labelKey: "EST_MASTER_ENTRY_SENDBACK_SUCCESS_MESSAGE_MAIN"
      }
    }
    else if (purpose == "reject") {
      header = {
        labelName: "Estate Property Master Entry Rejected",
        labelKey: "EST_MASTER_ENTRY_REJECT_SUCCESS_MESSAGE_MAIN"
      }
    }
    else if (purpose == "approve") {
      header = {
        labelName: "Estate Property Master Entry is Approved Successfully",
        labelKey: "EST_MASTER_ENTRY_APPROVE_SUCCESS_MESSAGE_MAIN"
      }
    }
    else {
      header = {}
    }

    const tailText = {
      labelName: "File Number",
      labelKey: "EST_FILE_NUMBER_LABEL"
    }

    return {
      header: getCommonHeader({
        labelName: `Estates`,
        labelKey: "EST_COMMON_ESTATES",
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
            number: fileNumber
          })
        }
      },
      applicationSuccessFooter: applicationSuccessFooter(
        state,
        dispatch,
        tenant
      )
    };
  } 
}

const getData = async (action, state, dispatch, purpose, status, tenant, fileNumber, type, businessService) => {
  const data = await getAcknowledgementCard(
    state,
    dispatch,
    purpose,
    status,
    tenant,
    fileNumber,
    type,
    businessService
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
    const tenant = getQueryArg(window.location.href, "tenantId");
    const type = getQueryArg(window.location.href, "type")
    const businessService = getQueryArg(window.location.href, "businessService")
    getData(action, state, dispatch, purpose, status, tenant, fileNumber, type, businessService)
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