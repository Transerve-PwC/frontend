import {
    getLabel,
  } from "egov-ui-framework/ui-config/screens/specs/utils";
  import {
    getButtonVisibility,
    getCommonApplyFooter
  } from "../../utils";
  import { setRoute } from "egov-ui-framework/ui-redux/app/actions";

  export const footerReview = (
    action,
    state,
    dispatch,
    status,
    applicationNumber,
    tenantId,
    businessService
  ) => {
    /** MenuButton data based on status */

    return getCommonApplyFooter({
      container: {
        uiFramework: "custom-atoms",
        componentPath: "Container",
        children: {
          rightdiv: {
            uiFramework: "custom-atoms",
            componentPath: "Div",
            props: {
              style: {
              float:"right",
              display:"flex"
              }
            },
            children: {
              makePayment: {
                componentPath: "Button",
                props: {
                  variant: "contained",
                  color: "primary",
                  style: {
                    minWidth: "180px",
                    height: "48px",
                    marginRight: "45px",
                    borderRadius: "inherit"
                  }
                },
                children: {
                  submitButtonLabel: getLabel({
                    labelName: "MAKE PAYMENT",
                    labelKey: "COMMON_MAKE_PAYMENT"
                  })
                },
                onClickDefination: {
                  action: "condition",
                  callBack: () => {
                    dispatch(
                      setRoute(
                       `/estate-citizen/pay?consumerCode=${applicationNumber}&tenantId=${tenantId}&businessService=${businessService}`
                      )
                    );
                  },
  
                },
                visible: process.env.REACT_APP_NAME === "Citizen"  && getButtonVisibility(status, "PENDINGPAYMENT") ? true : false
              }
            },
            gridDefination: {
              xs: 12,
              sm: 12
            }
          },     
        }
      }
    });
  };