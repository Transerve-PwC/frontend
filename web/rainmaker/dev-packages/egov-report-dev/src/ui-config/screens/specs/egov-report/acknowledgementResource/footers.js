import { getLabel } from "egov-ui-framework/ui-config/screens/specs/utils";
import { ifUserRoleExists } from "../../utils";
import "./index.css";

export const getRedirectionURL = () => {
  const redirectionURL = ifUserRoleExists("CITIZEN")
    ? "/egov-hc/home"
    : "/inbox";
  return redirectionURL;
};

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


export const gotoHomeFooter = getCommonApplyFooter({
  gotoHome: {
    componentPath: "Button",
    props: {
      variant: "outlined",
      color: "primary",
      style: {
       
        height: "48px",
        marginRight: "16px"
      }
    },
    children: {
      
      goToHomeButtonLabel: getLabel({
        labelName: "GO TO HOME",
        labelKey: "NOC_COMMON_BUTTON_HOME"
      })
    },
    
    onClickDefination: {
      action: "page_change",
      path: `${getRedirectionURL()}`
    }
  }
});


export const applicationSuccessFooter = (
  state,
  dispatch,
  applicationNumber,
  tenant
) => {
  return getCommonApplyFooter({
    gotoHome: {
      componentPath: "Button",
      props: {
        className: "apply-wizard-footer1",
        variant: "outlined",
        color: "primary",
        style: {
          minWidth: "180px",
          height: "48px",
        }
      },
      children: {
        
        goToHomeButtonLabel: getLabel({
          labelName: "GO TO HOME",
          labelKey: "HC_COMMON_BUTTON_HOME"
        })
      },
      
      onClickDefination: {
        action: "page_change",
        path: `${getRedirectionURL()}`
      },
     
    },
 
  });
};

