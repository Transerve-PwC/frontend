import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import set from "lodash/set";
import acknowledgementCard from "./acknowledgementResource/acknowledgementUtils";
import { applicationSuccessFooter } from "./acknowledgementResource/footers";
import { toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import "./index.css";


const getAcknowledgementCard = (
  state,
  dispatch,
  serviceRequestId,
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
              labelName: "Authorisation Invalid",
              labelKey: "HC_SERVICE_REQUEST_AUTHORIZATION_MESSAGE_MAIN"
            },
            body: {
              labelName:"Invalid User for this service request",
              labelKey: "HC_SERVICE_REQUEST_AUTHORIZATION_MESSAGE"
            },
            // tailText: {
            //   labelName: "Service Request ID",
            //   labelKey: "HC_SERVICE_REQUEST_ID"
            // },
            number: serviceRequestId,
          })
        }
      },
 
    applicationSuccessFooter: applicationSuccessFooter(
      state,
      dispatch,
      serviceRequestId,
      tenant
    )
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
        className: "common-div-css"
      }
    }
  },
  beforeInitScreen: (action, state, dispatch) => {
    
    const serviceRequestId = getQueryArg(window.location.href, "serviceRequestId");
    
    const tenant = "ch";
    const data = getAcknowledgementCard(
      state,
      dispatch,
      serviceRequestId,
      tenant
    );
    set(action, "screenConfig.components.div.children", data);
    return action;
  }
};

export default screenConfig;