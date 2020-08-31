import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import set from "lodash/set";
import acknowledgementCard from "./acknowledgementResource/acknowledgementUtils";
import { applicationSuccessFooter } from "./acknowledgementResource/footers";
import { toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";


const getAcknowledgementCard = (
  state,
  dispatch,
  serviceRequestId,
  tenant
) => {

  dispatch(
    toggleSnackbar(
      false,
      { labelName: "Please wait while your request being is generated", labelKey: "HC_SERVICE_REQUEST_BEING_GENERATED" },
      "warning"
    )
  );
    return {
 
      serviceRequestSuccessCard: {
        uiFramework: "custom-atoms",
        componentPath: "Div",
        props: {

        },
        children: {
          card: acknowledgementCard({
            icon: "done",
            backgroundColor: "#39CB74",
            header: {
              labelName: "Service Request Updated Successfully",
              labelKey: "HC_SERVICE_REQUEST_UPDATE_MESSAGE"
            },
            // body: {
            //   labelName:"Service Request Updated Successfully",
            //   labelKey: "HC_SERVICE_REQUEST_UPDATE_MESSAGE"
            // },
            tailText: {
              labelName: "Service Request ID",
              labelKey: "HC_SERVICE_REQUEST_ID"
            },
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