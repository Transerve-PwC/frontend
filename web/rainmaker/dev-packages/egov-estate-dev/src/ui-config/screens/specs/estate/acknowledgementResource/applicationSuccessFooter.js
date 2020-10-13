import {
  getLabel
} from "egov-ui-framework/ui-config/screens/specs/utils";
import {
  ifUserRoleExists,downloadAcknowledgementForm,downloadSummary
} from "../../utils";
import set from "lodash/set";

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

export const applicationSuccessFooter = (
  state,
  dispatch,
  applicationNumber,
  tenant
) => {
  const roleExists = ifUserRoleExists("CITIZEN");
  const redirectionURL = roleExists ? "/" : "/inbox";
  if(roleExists){
    return getCommonApplyFooter({
      gotoHome: {
        componentPath: "Button",
        props: {
          variant: "outlined",
          color: "primary",
          style: {
            minWidth: "180px",
            height: "48px",
            marginRight: "16px"
          }
        },
        children: {
          downloadReceiptButtonLabel: getLabel({
            labelName: "GO TO HOME",
            labelKey: "ES_COMMON_BUTTON_HOME"
          })
        },
        onClickDefination: {
          action: "page_change",
          path: redirectionURL
        },
       
      },
      downloadFormButton: {
        componentPath: "Button",
        props: {
          variant: "outlined",
          color: "primary",
          style: {
            minWidth: "180px",
            height: "48px",
            marginRight: "16px"
          }
        },
        children: {
          downloadFormButtonLabel: getLabel({
            labelName: "DOWNLOAD CONFIRMATION FORM",
            labelKey: "ES_APPLICATION_BUTTON_DOWN_CONF"
          })
        },
        onClickDefination: {
          action: "condition",
          callBack: () => {
            const { Applications,temp } = state.screenConfiguration.preparedFinalObject;
            const { applicationType} = Applications[0];
            const documents = temp[0].reviewDocData;
            set(Applications[0],"additionalDetails.documents",documents)
            downloadAcknowledgementForm(Applications,applicationType); 
          }
        },
        visible: true
      },
      printFormButton: {
        componentPath: "Button",
        props: {
          variant: "outlined",
          color: "primary",
          style: {
            minWidth: "180px",
            height: "48px",
            marginRight: "16px"
          }
        },
        children: {
          printFormButtonLabel: getLabel({
            labelName: "PRINT CONFIRMATION FORM",
            labelKey: "ES_APPLICATION_BUTTON_PRINT_CONF"
          })
        },
        onClickDefination: {
          action: "condition",
          callBack: () => {
            const { Applications,temp } = state.screenConfiguration.preparedFinalObject;
            const { applicationType} = Applications[0];
            const documents = temp[0].reviewDocData;
            set(Applications[0],"additionalDetails.documents",documents)
            downloadAcknowledgementForm(Applications,applicationType,'print'); 
          }
        },
        visible: true
      }
    });
  }else{
    return getCommonApplyFooter({
      gotoHome: {
        componentPath: "Button",
        props: {
          variant: "outlined",
          color: "primary",
          style: {
            minWidth: "180px",
            height: "48px",
            marginRight: "16px"
          }
        },
        children: {
          downloadReceiptButtonLabel: getLabel({
            labelName: "GO TO HOME",
            labelKey: "ES_COMMON_BUTTON_HOME"
          })
        },
        onClickDefination: {
          action: "page_change",
          path: redirectionURL
        },
       
      },
      downloadFormButton: {
        componentPath: "Button",
        props: {
          variant: "outlined",
          color: "primary",
          style: {
            minWidth: "180px",
            height: "48px",
            marginRight: "16px"
          }
        },
        children: {
          downloadFormButtonLabel: getLabel({
            labelName: "DOWNLOAD CONFIRMATION FORM",
            labelKey: "ES_APPLICATION_BUTTON_DOWN_CONF"
          })
        },
        onClickDefination: {
          action: "condition",
          callBack: () => {
            const { Properties,PropertiesTemp } = state.screenConfiguration.preparedFinalObject;
            downloadSummary(Properties, PropertiesTemp); 
          }
        },
        visible: true
      },
      printFormButton: {
        componentPath: "Button",
        props: {
          variant: "outlined",
          color: "primary",
          style: {
            minWidth: "180px",
            height: "48px",
            marginRight: "16px"
          }
        },
        children: {
          printFormButtonLabel: getLabel({
            labelName: "PRINT CONFIRMATION FORM",
            labelKey: "ES_APPLICATION_BUTTON_PRINT_CONF"
          })
        },
        onClickDefination: {
          action: "condition",
          callBack: () => {
            const { Properties,PropertiesTemp } = state.screenConfiguration.preparedFinalObject;
            downloadSummary(Properties, PropertiesTemp,'print');
          }
        },
        visible: true
      }
    });
  }
 
};