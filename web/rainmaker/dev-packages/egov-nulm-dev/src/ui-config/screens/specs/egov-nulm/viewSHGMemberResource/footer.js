import { getLabel } from "egov-ui-framework/ui-config/screens/specs/utils";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import {  handleSubmitSMID,handleRejectSMID,handlesaveSMID,handleApproveSMID,handleDelete } from "./functions";

const gotoCreateFlow = (state, dispatch) => {
  const createUrl = `/egov-nulm/create-shg-member`;
  dispatch(setRoute(createUrl));
};

const getCommonCreateFooter = children => {
  return {
    uiFramework: "custom-atoms",
    componentPath: "Div",
    props: {
      className: "apply-wizard-footer"
    },
    children
  };
};
export const buttonController = () => {
  if (process.env.REACT_APP_NAME === "Employee1")
    return {
      rejectButton: {
        componentPath: "Button",
        props: {
          variant: "outlined",
          color: "primary",
          style: {
             minWidth: "200px",
            height: "48px",
            marginRight: "16px",
          },
        },
        children: {
          resetButtonLabel: getLabel({
            labelName: "Reject",
            labelKey: "NULM_COMMON_REJECT_BUTTON",
          }),
        },
        onClickDefination: {
          action: "condition",
          callBack: handleRejectSMID,
        },
        visible: true,
      },
      approvedButton: {
        componentPath: "Button",
        props: {
          variant: "contained",
          color: "primary",
          style: {
            // minWidth: "200px",
            height: "48px",
            marginRight: "16px",
          },
        },
        children: {
          updateButtonLabel: getLabel({
            labelName: "Approved",
            labelKey: "NULM_COMMON_APPROVED_BUTTON",
          }),
        },
        onClickDefination: {
          action: "condition",
          callBack: handleApproveSMID,
        },
        visible: true,
      },
    };
  else
    return {
      saveButton: {
        componentPath: "Button",
        props: {
          variant: "outlined",
          color: "primary",
          style: {
             minWidth: "200px",
            height: "48px",
            marginRight: "16px",
          },
        },
        children: {
          resetButtonLabel: getLabel({
            labelName: "Delete",
            labelKey: "NULM_COMMON_DELETE_BUTTON",
          }),
        },
        onClickDefination: {
          action: "condition",
          callBack: handleDelete,
        },
        visible: process.env.REACT_APP_NAME === "Employee" ? false : true,
      },
      submitButton: {
        componentPath: "Button",
        props: {
          variant: "contained",
          color: "primary",
          style: {
            minWidth: "200px",
            height: "48px",
            marginRight: "45px"
          }
        },
        children: {
          submitButtonLabel: getLabel({
            labelName: "SUBMIT",
            labelKey: "HR_SUBMIT_LABEL"
          })
        },
        onClickDefination: {
          action: "condition",
          callBack: handleSubmitSMID
        }
      }
    };
};
export const poCommonFooter = () => {
  return getCommonCreateFooter({
    ...buttonController(),
  });
};

export const poViewFooter = () => {
  return getCommonCreateFooter({
    editDetails: {
      componentPath: "Button",
      props: {
        variant: "contained",
        color: "primary",
        style: {
          minWidth: "200px",
          height: "48px",
          marginRight: "45px"
        }
      },
      children: {
        editDetailsButtonLabel: getLabel({
          labelName: "EDIT DETAILS",
          labelKey: "HR_EDIT_DETAILS_LABEL"
        }),
        editDetailsButtonIcon: {
          uiFramework: "custom-atoms",
          componentPath: "Icon",
          props: {
            iconName: "keyboard_arrow_right"
          }
        }
      },
      onClickDefination: {
        action: "condition",
        callBack: gotoCreateFlow
      }
    }
  });
};
