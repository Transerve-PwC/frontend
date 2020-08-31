import { getLabel } from "egov-ui-framework/ui-config/screens/specs/utils";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import { handleCreateUpdateIT } from "./functions";

const gotoCreateFlow = (state, dispatch) => {
  const id = getQueryArg(window.location.href, "id");
  const tenantId = getQueryArg(window.location.href, "tenantId");
  const createUrl = `/egov-store-asset/create-material-transfer-indent?id=${id}&tenantId=${tenantId}`;
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

export const poCommonFooter = () => {
  return getCommonCreateFooter({
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
        callBack: handleCreateUpdateIT
      }
    }
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
