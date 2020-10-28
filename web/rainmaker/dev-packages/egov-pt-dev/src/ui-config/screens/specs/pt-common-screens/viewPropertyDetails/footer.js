import { getLabel } from "egov-ui-framework/ui-config/screens/specs/utils";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import { handleSubmit,handleReject,handlesave,handleApprove } from "./functions";

const gotoCreateFlow = (state, dispatch) => {
  const createUrl = `/egov-nulm/log-maintenance`;
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
          callBack: handlesave,
        },
        visible: false,
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
          callBack: handleSubmit
        }
      }
    };
};

export const poCommonFooter = () => {
  return getCommonCreateFooter({
    ...buttonController(),
  });
};

const getRoleBaseViewButton = () => {

 return {
  deleteButton: {
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
        labelName: "Submit",
        labelKey: "PT_COMMON_BUTTON_SUBMIT",
      }),
    },
    onClickDefination: {
      action: "condition",
      callBack: handleSubmit,
    },
    visible: true,
  }
}
}

export const poViewFooter = () => {
  return getCommonCreateFooter({
    ...getRoleBaseViewButton(),
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
      },
      visible: false,
    }
  });
};
