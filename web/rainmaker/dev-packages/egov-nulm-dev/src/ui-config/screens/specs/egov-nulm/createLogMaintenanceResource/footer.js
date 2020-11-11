import get from "lodash/get";
import {
  dispatchMultipleFieldChangeAction,
  getLabel
} from "egov-ui-framework/ui-config/screens/specs/utils";
import {
    prepareDocumentsUploadData
} from "../../../../../ui-utils/commons";
import { convertDateToEpoch } from "egov-ui-framework/ui-config/screens/specs/utils";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import { toggleSnackbar,prepareFinalObject,handleScreenConfigurationFieldChange as handleField } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getFileUrl } from "egov-ui-framework/ui-utils/commons";
import {
  getButtonVisibility,
  getCommonApplyFooter,
  ifUserRoleExists,
  validateFields,
  epochToYmd
} from "../../utils";
import {
  getLocaleLabels,
  getTransformedLocalStorgaeLabels,
} from "egov-ui-framework/ui-utils/commons";
// import "./index.css";

  const moveToReview = dispatch => {
    const reviewUrl =`/egov-nulm/review-log-maintenance`;
    dispatch(setRoute(reviewUrl));
  };



export const callBackForNext = async (state, dispatch) => {
  let activeStep = get(
    state.screenConfiguration.screenConfig["log-maintenance"],
    "components.div.children.stepper.props.activeStep",
    0
  );
  const {NulmSuhLogRequest} = state.screenConfiguration.preparedFinalObject;
  let isFormValid = true;

  if (activeStep === 0) {
    const isSUHLogDetailsValid = validateFields(
      "components.div.children.formwizardFirstStep.children.SUHLogDetails.children.cardContent.children.SUHLogDetailsContainer.children",
      state,
      dispatch,
      "log-maintenance"
    );
    
    if (!isSUHLogDetailsValid) {
      isFormValid = false;
    }
    if(NulmSuhLogRequest && ( !NulmSuhLogRequest.hasOwnProperty("gender") )){
      isFormValid = false;
    }
    if(isSUHLogDetailsValid)
    {
    if(NulmSuhLogRequest ){
      if(!NulmSuhLogRequest.dob && !NulmSuhLogRequest.age ){
        const errorMessage = {
          labelName: "Please select the Minority",
          labelKey: "ERR_NULM_DOB_AGE_VALIDATION"
        };
        dispatch(toggleSnackbar(true, errorMessage, "warning"));
        return;
      }
    }      
  }
   // show validation mewssage and clear age value from json
   if(NulmSuhLogRequest && NulmSuhLogRequest.dob && NulmSuhLogRequest.age ){
    if(NulmSuhLogRequest.dob && NulmSuhLogRequest.age ){
      const errorMessage = {
        labelName: "Please select the Minority",
        labelKey: "ERR_NULM_DOB_AGE_VALIDATION"
      };
      dispatch(toggleSnackbar(true, errorMessage, "warning"));
      // dispatch(
      //   handleField(
      //     `create-susv`,
      //     "components.div.children.formwizardFirstStep.children.SUHLogDetails.children.cardContent.children.SUHLogDetailsContainer.children.age",
      //     "props.value",
      //     ''
      //   )
      // );
     // dispatch(prepareFinalObject(`NulmSuhLogRequest.age`, null ));
      return;
    }
  }
  //
  }
 
 if( !isFormValid){
    const errorMessage = {
      labelName: "Please fill all fields",
      labelKey: "ERR_FILL_ALL_FIELDS"
    };
    dispatch(toggleSnackbar(true, errorMessage, "warning"));
  }
else if(activeStep == 0 && isFormValid){

  moveToReview(dispatch);
}
  else{
    changeStep(state, dispatch);
  }
};

export const changeStep = (
  state,
  dispatch,
  mode = "next",
  defaultActiveStep = -1
) => {
  let activeStep = get(
    state.screenConfiguration.screenConfig["log-maintenance"],
    "components.div.children.stepper.props.activeStep",
    0
  );
  if (defaultActiveStep === -1) {
    activeStep = mode === "next" ? activeStep + 1 : activeStep - 1;
  } else {
    activeStep = defaultActiveStep;
  }

  const isPreviousButtonVisible = activeStep > 0 ? true : false;
  const isNextButtonVisible = activeStep < 4 ? true : false;
  const isPayButtonVisible = activeStep === 4 ? true : false;
  const actionDefination = [
    {
      path: "components.div.children.stepper.props",
      property: "activeStep",
      value: activeStep
    },
    {
      path: "components.div.children.footer.children.previousButton",
      property: "visible",
      value: isPreviousButtonVisible
    },
    {
      path: "components.div.children.footer.children.nextButton",
      property: "visible",
      value: isNextButtonVisible
    },
    {
      path: "components.div.children.footer.children.payButton",
      property: "visible",
      value: isPayButtonVisible
    }
  ];
  dispatchMultipleFieldChangeAction("log-maintenance", actionDefination, dispatch);
  renderSteps(activeStep, dispatch);
};

export const renderSteps = (activeStep, dispatch) => {
  switch (activeStep) {
    case 0:
      dispatchMultipleFieldChangeAction(
        "log-maintenance",
        getActionDefinationForStepper(
          "components.div.children.formwizardFirstStep"
        ),
        dispatch
      );
      break;
    case 1:
      dispatchMultipleFieldChangeAction(
        "log-maintenance",
        getActionDefinationForStepper(
          "components.div.children.formwizardSecondStep"
        ),
        dispatch
      );
      break;
    case 2:
      dispatchMultipleFieldChangeAction(
        "log-maintenance",
        getActionDefinationForStepper(
          "components.div.children.formwizardThirdStep"
        ),
        dispatch
      );
      break;
   
    default:
      dispatchMultipleFieldChangeAction(
        "log-maintenance",
        getActionDefinationForStepper(
          "components.div.children.formwizardFifthStep"
        ),
        dispatch
      );
  }
};

export const getActionDefinationForStepper = path => {
  const actionDefination = [
    {
      path: "components.div.children.formwizardFirstStep",
      property: "visible",
      value: true
    },
    {
      path: "components.div.children.formwizardSecondStep",
      property: "visible",
      value: false
    },
    {
      path: "components.div.children.formwizardThirdStep",
      property: "visible",
      value: false
    },
   
  ];
  for (var i = 0; i < actionDefination.length; i++) {
    actionDefination[i] = {
      ...actionDefination[i],
      value: false
    };
    if (path === actionDefination[i].path) {
      actionDefination[i] = {
        ...actionDefination[i],
        value: true
      };
    }
  }
  return actionDefination;
};

export const callBackForPrevious = (state, dispatch) => {
  changeStep(state, dispatch, "previous");
};

export const footer = getCommonApplyFooter({
  previousButton: {
    componentPath: "Button",
    props: {
      variant: "outlined",
      color: "primary",
      style: {
        minWidth: "200px",
        height: "48px",
        marginRight: "16px"
      }
    },
    children: {
      previousButtonIcon: {
        uiFramework: "custom-atoms",
        componentPath: "Icon",
        props: {
          iconName: "keyboard_arrow_left"
        }
      },
      previousButtonLabel: getLabel({
        labelName: "Previous Step",
        labelKey: "STORE_COMMON_BUTTON_PREV_STEP"
      })
    },
    onClickDefination: {
      action: "condition",
      callBack: callBackForPrevious
    },
    visible: false
  },
  nextButton: {
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
      nextButtonLabel: getLabel({
        labelName: "Next Step",
        labelKey: "STORE_COMMON_BUTTON_NXT_STEP"
      }),
      nextButtonIcon: {
        uiFramework: "custom-atoms",
        componentPath: "Icon",
        props: {
          iconName: "keyboard_arrow_right"
        }
      }
    },
    onClickDefination: {
      action: "condition",
      callBack: callBackForNext
    }
  },
  payButton: {
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
        labelName: "Submit",
        labelKey: "STORE_COMMON_BUTTON_SUBMIT"
      }),
      submitButtonIcon: {
        uiFramework: "custom-atoms",
        componentPath: "Icon",
        props: {
          iconName: "keyboard_arrow_right"
        }
      }
    },
    onClickDefination: {
      action: "condition",
      callBack: callBackForNext
    },
    visible: false
  }
});
