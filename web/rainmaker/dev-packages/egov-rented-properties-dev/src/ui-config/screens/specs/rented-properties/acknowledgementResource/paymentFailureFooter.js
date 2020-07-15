import { getLabel } from "egov-ui-framework/ui-config/screens/specs/utils";
import { ifUserRoleExists } from "../../utils";

const getCommonApplyFooter = children => {
  return {
    uiFramework: "custom-atoms",
    componentPath: "Div",
    props: {
      className: "apply-wizard-footer"
    },
    children
  };
};

export const paymentFailureFooter = (applicationNumber, tenant) => {
  const roleExists = ifUserRoleExists("CITIZEN");
  const redirectionURL = roleExists ? "/rented-properties-citizen" : "/rented-properties";

  return getCommonApplyFooter({
    gotoHome: {
      componentPath: "Button",
      props: {
        variant: "contained",
        color: "primary",
        style: {
          minWidth: "200px",
          height: "48px",
          marginRight: "16px"
        }
      },
      children: {
        downloadReceiptButtonLabel: getLabel({
          labelName: "RETRY",
          labelKey: "TL_RETRY"
        })
      },
      onClickDefination: {
        action: "page_change",
        path: `${redirectionURL}/pay?consumerCode=${applicationNumber}&tenantId=${tenant}`
      }
    }
  });
};
