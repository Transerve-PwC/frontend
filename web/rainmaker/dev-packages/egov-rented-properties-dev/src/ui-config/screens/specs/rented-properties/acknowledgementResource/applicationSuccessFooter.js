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

export const applicationSuccessFooter = (
  state,
  dispatch,
  applicationNumber,
  tenant
) => {
  const roleExists = ifUserRoleExists("CITIZEN");
  // const redirectionURL = roleExists ? "/tradelicense-citizen/home" : "/inbox";
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
            labelKey: "TL_COMMON_BUTTON_HOME"
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
              labelKey: "TL_APPLICATION_BUTTON_DOWN_CONF"
            })
          },
          // onClickDefination: {
          //   action: "condition",
          //   callBack: () => {
          //   const { Licenses,LicensesTemp } = state.screenConfiguration.preparedFinalObject;
          //   const documents = LicensesTemp[0].reviewDocData;
          //   set(Licenses[0],"additionalDetails.documents",documents)
          //   downloadAcknowledgementForm(Licenses, LicensesTemp[0].estimateCardData);
          //   }
          // },
          visible:true
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
              labelKey: "TL_APPLICATION_BUTTON_PRINT_CONF"
            })
          },
          // onClickDefination: {
          //   action: "condition",
          //   callBack: () => {
          //   const { Licenses,LicensesTemp } = state.screenConfiguration.preparedFinalObject;
          //   const documents = LicensesTemp[0].reviewDocData;
          //   set(Licenses[0],"additionalDetails.documents",documents)
          //   downloadAcknowledgementForm(Licenses, LicensesTemp[0].estimateCardData,'print');
          //   }
          // },
          visible:true
        }
      
    });
  }
  else{
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
          labelKey: "TL_COMMON_BUTTON_HOME"
        })
      },
      onClickDefination: {
        action: "page_change",
        path: redirectionURL
      },
    },
     
    
  });
}
};
