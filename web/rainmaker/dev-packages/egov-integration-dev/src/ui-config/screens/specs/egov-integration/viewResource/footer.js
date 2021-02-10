import { getLabel } from "egov-ui-framework/ui-config/screens/specs/utils";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import { showHideAdhocPopup } from "../../utils";
import { handleCreateUpdateEmployee,updateEmployees } from "./functions";
import {
  handleScreenConfigurationFieldChange as handleField,
  toggleSnackbar,
  toggleSpinner,
  prepareFinalObject
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import get from "lodash/get";
import { getTenantId,getUserInfo } from "egov-ui-kit/utils/localStorageUtils";
const gotoCreateFlow = async (state, dispatch) => {
  // const employeeCode = getQueryArg(window.location.href, "employeeID");
  let employeeCode = get(
    state.screenConfiguration.preparedFinalObject,
    "Employees.Employees[0].hrmsCode",
    ''
  );
  if(employeeCode)
  {
    let employeeObject = get(
      state.screenConfiguration.preparedFinalObject,
      "Employees.Employees[0]",
      []
    );
    let queryObject = [
      {
        key: "tenantId",
        value: getTenantId()
      }
    ];

    let requestBody = {
      Employees: [
        {
          uuid:employeeObject.uuid,
          hrmsCode:employeeCode,
        }
        

      ],
      Fields: [        
        "hrmsCode"
    ]
      
    }
    try {
      let response = await updateEmployees(
        queryObject,
        requestBody,
        dispatch
      );
      let employeeId = response && get(response, "Employees[0].code");
      dispatch(
        handleField(
          "empDetails",
          "components.div.children.EmpUpdateInfoText",
          "props.style",
          { display: "none" }
        )
      );
      dispatch(
        handleField(
          "empDetails",
          "components.div.children.empCode",
          "visible",
          false
        )
      );
     
    } catch (error) {
     // furnishEmployeeData(state, dispatch);
     dispatch(
      handleField(
        "empDetails",
        "components.div.children.empCode",
        "visible",
        true
      )
    );
    }

  }
  else{
    dispatch(
      toggleSnackbar(
        true,
        {
          labelName: "Please fill HRMS code",
          labelKey: "INTIGRATION_HRMS_EMPLOYEE_CODE_VALIDATION",
        },
        "warning"
      )
    );
    // dispatch(
    //   handleField(
    //     "empDetails",
    //     "components.div.children.EmpUpdateInfoText",
    //     "props.style",
    //     { display: "inline-block" }
    //   )
    // );
    // dispatch(
    //   handleField(
    //     "empDetails",
    //     "components.div.children.empCode",
    //     "visible",
    //     false
    //   )
    // );
    // dispatch(
    //   handleField(
    //     "empDetails",
    //     "components.div.children.footer.children.editDetails",
    //     "visible",
    //     false
    //   )
    // );
  }
  // const tenantId = getQueryArg(window.location.href, "tenantId");
  // const createUrl =
  //   process.env.REACT_APP_SELF_RUNNING === "true"
  //     ? `/egov-ui-framework/hrms/create?employeeCode=${employeeCode}&tenantId=${tenantId}`
  //     : `/hrms/create?employeeCode=${employeeCode}&tenantId=${tenantId}`;
  // dispatch(setRoute(createUrl));
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

export const hrCommonFooter = () => {
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
        callBack: handleCreateUpdateEmployee
      }
    }
  });
};

export const hrViewFooter = () => {
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
          labelKey: "INTIGRATION_EDIT_DETAILS_LABEL"
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
      visible: true
    }
  });
};
