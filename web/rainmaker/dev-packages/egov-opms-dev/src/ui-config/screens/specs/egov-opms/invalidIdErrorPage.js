import { getCommonHeader } from "egov-ui-framework/ui-config/screens/specs/utils";
import {
  getUserInfo
} from "egov-ui-kit/utils/localStorageUtils";
import set from "lodash/set";
import acknowledgementCard from "./invalidRequestRedirection/acknowledgementUtils";
import { applicationSuccessFooter } from "./invalidRequestRedirection/footers";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";


let roles = JSON.parse(getUserInfo()).roles
const header = getCommonHeader(
  {
    labelName: "OPMS",
    labelKey: "ACTION_TEST_OPMS"
  },
  {
    style: {
      padding: "20px",
    }
  },
  {
    classes: {
      root: "common-header-cont"
    }
  }
);


const getAcknowledgementCard = (
  state,
  dispatch,
  applicationNumber,
  tenant
) => {
  return {

    serviceRequestSuccessCard: {
      uiFramework: "custom-atoms",
      componentPath: "Div",
      props: {

      },
      children: {
        card: acknowledgementCard({
          icon: "close",
          backgroundColor: "#E54D42",
          header: {
            labelName: "Invalid Application Id",
            labelKey: "PM_SERVICE_REQUEST_INVALID_ID_MESSAGE_MAIN"
          },

          // tailText: {
          //   labelName: "Service Request ID",
          //   labelKey: "HC_SERVICE_REQUEST_ID"
          // },
          number: applicationNumber,
        })
      }
    },

    applicationSuccessFooter: applicationSuccessFooter(
      state,
      dispatch,
      applicationNumber,
      tenant
    )
  };

};

const PermissionManagementSearchAndResult = {
  uiFramework: "material-ui",
  name: "invalidIdErrorPage",
  beforeInitScreen: (action, state, dispatch) => {

    const applicationNumber = getQueryArg(window.location.href, "applicationNumber");

    const tenant = getQueryArg(window.location.href, "tenantId");
    const data = getAcknowledgementCard(
      state,
      dispatch,
      applicationNumber,
      tenant
    );
    set(action, "screenConfig.components.div.children", data);
    return action;
  },
  components: {
    div: {
      uiFramework: "custom-atoms",
      componentPath: "Div",
      children: {
        header: header

      }
    }
  }
};

export default PermissionManagementSearchAndResult;
