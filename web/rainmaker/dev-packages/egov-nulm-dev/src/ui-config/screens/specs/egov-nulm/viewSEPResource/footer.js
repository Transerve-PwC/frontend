import { getLabel } from "egov-ui-framework/ui-config/screens/specs/utils";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import { handleSubmitSEP,handleRejectSEP,handlesaveSEP,handleApproveSEP,handleForwardToTFCSEP } from "./functions";
import {NULM_SEP_CREATED,
  FORWARD_TO_TASK_FORCE_COMMITTEE,
  APPROVED_BY_TASK_FORCE_COMMITTEE,
  REJECTED_BY_TASK_FORCE_COMMITTEE,
  SENT_TO_BANK_FOR_PROCESSING,
SANCTION_BY_BANK} from '../../../../../ui-utils/commons'
const gotoCreateFlow = (state, dispatch) => {
  const createUrl = `/egov-nulm/create-sep`;
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
  const status = window.localStorage.getItem("SEP_Status");
  if (process.env.REACT_APP_NAME === "Employee")
    return {
      forwardToTFC: {
        componentPath: "Button",
        props: {
          variant: "contained",
          color: "primary",
          style: {
             minWidth: "200px",
            height: "48px",
            marginRight: "16px",
          },
        },
        children: {
          resetButtonLabel: getLabel({
            labelName: "Forward to Task force Committee",
            labelKey: "NULM_COMMON_FORWARD_TO_TFC_BUTTON",
          }),
        },
        onClickDefination: {
          action: "condition",
          callBack: handleForwardToTFCSEP,
        },
        visible:status ===NULM_SEP_CREATED ? true :false,
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
            labelName: "SUBMIT",
            labelKey: "HR_SUBMIT_LABEL",
          }),
        },
        onClickDefination: {
          action: "condition",
          callBack: handleSubmitSEP,
        },
        visible: status !==NULM_SEP_CREATED ? true :false,
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
            labelName: "Save",
            labelKey: "NULM_COMMON_SAVE_BUTTON",
          }),
        },
        onClickDefination: {
          action: "condition",
          callBack: handlesaveSEP,
        },
        visible: true,
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
          callBack: handleSubmitSEP
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
