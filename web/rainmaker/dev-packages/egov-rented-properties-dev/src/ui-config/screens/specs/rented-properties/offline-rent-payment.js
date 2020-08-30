import {
  getCommonHeader
} from "egov-ui-framework/ui-config/screens/specs/utils";
import {
  formwizardOfflineRentPayment
} from './applyResource/applyConfig';
import {
  prepareFinalObject
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import {
  handleScreenConfigurationFieldChange as handleField
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import {
  offlinePaymentfooter
} from './payResource/footer';

const header = getCommonHeader({
  labelName: "Offline Rent Payment",
  labelKey: "RP_OFFLINE_RENT_PAYMENT_HEADER"
});

const offlineRentPayment = {
  uiFramework: "material-ui",
  name: "offline-rent-payment",
  beforeInitScreen: (action, state, dispatch) => {
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
                sm: 10
              },
              ...header
            }
          }
        },
        formwizardFirstStep: formwizardOfflineRentPayment,
        footer: offlinePaymentfooter
      }
    }
  }
}

export default offlineRentPayment;