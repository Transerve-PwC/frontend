import { getLabel, getStepperObject, dispatchMultipleFieldChangeAction } from "egov-ui-framework/ui-config/screens/specs/utils"
import { getCommonApplyFooter } from "../utils";
import { get } from "lodash";

export const DEFAULT_STEP = -1;
export const DETAILS_STEP = 0;
export const DOCUMENT_UPLOAD_STEP = 1;
export const SUMMARY_STEP = 2;

export const stepsData = [
    { labelName: "Details", labelKey: "EST_DETAILS_HEADER" },
    { labelName: "Documents", labelKey: "EST_COMMON_DOCS" },
    { labelName: "Summary", labelKey: "EST_COMMON_SUMMARY" }
  ];

export const stepper = getStepperObject(
    { props: { activeStep: 0 } },
    stepsData
  );

export const previousButton = {
    componentPath: "Button",
        props: {
          variant: "outlined",
          color: "primary",
          style: {
            minWidth: "180px",
            height: "48px",
            marginRight: "16px",
            borderRadius: "inherit"
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
            labelKey: "TL_COMMON_BUTTON_PREV_STEP"
          })
        },
        visible: false
  }
  
  export const nextButton = {
    componentPath: "Button",
    props: {
      variant: "contained",
      color: "primary",
      style: {
        minWidth: "180px",
        height: "48px",
        marginRight: "45px",
        borderRadius: "inherit"
      }
    },
    children: {
      nextButtonLabel: getLabel({
        labelName: "Next Step",
        labelKey: "TL_COMMON_BUTTON_NXT_STEP"
      }),
      nextButtonIcon: {
        uiFramework: "custom-atoms",
        componentPath: "Icon",
        props: {
          iconName: "keyboard_arrow_right"
        }
      }
    },
  }
  
  export const submitButton = {
    componentPath: "Button",
        props: {
          variant: "contained",
          color: "primary",
          style: {
            minWidth: "180px",
            height: "48px",
            marginRight: "45px",
            borderRadius: "inherit"
          }
        },
        children: {
          submitButtonLabel: getLabel({
            labelName: "Submit",
            labelKey: "TL_COMMON_BUTTON_SUBMIT"
          }),
          submitButtonIcon: {
            uiFramework: "custom-atoms",
            componentPath: "Icon",
            props: {
              iconName: "keyboard_arrow_right"
            }
          }
        },
        visible: false,
  }

  export const changeStep = (
    state,
    dispatch,
    screenName,
    mode = "next",
    defaultActiveStep = -1
  ) => {
    let activeStep = get(
        state.screenConfiguration.screenConfig[screenName],
        "components.div.children.stepper.props.activeStep",
        0
    );
    if (defaultActiveStep === DEFAULT_STEP) {
        if (activeStep === SUMMARY_STEP && mode === "next") {
            activeStep = SUMMARY_STEP
            // const isDocsUploaded = get(
            //     state.screenConfiguration.preparedFinalObject,
            //     "LicensesTemp[0].reviewDocData",
            //     null
            // );
            // activeStep = isDocsUploaded ? SUMMARY_STEP : DOCUMENT_UPLOAD_STEP;
        } else {
            activeStep = mode === "next" ? activeStep + 1 : activeStep - 1;
        }
    } else {
        activeStep = defaultActiveStep;
    }
  
    const isPreviousButtonVisible = activeStep > DETAILS_STEP ? true : false;
    const isNextButtonVisible = activeStep < SUMMARY_STEP ? true : false;
    const isSubmitButtonVisible = activeStep === SUMMARY_STEP ? true : false;
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
            path: "components.div.children.footer.children.submitButton",
            property: "visible",
            value: isSubmitButtonVisible
        }
    ];
    dispatchMultipleFieldChangeAction(screenName, actionDefination, dispatch);
    renderSteps(activeStep, dispatch, screenName);
  };
  
  export const renderSteps = (activeStep, dispatch, screenName) => {
    switch (activeStep) {
        case DETAILS_STEP:
            dispatchMultipleFieldChangeAction(
                screenName,
                getActionDefinationForStepper(
                    "components.div.children.formwizardFirstStep"
                ),
                dispatch
            );
            break;
        case DOCUMENT_UPLOAD_STEP:
            dispatchMultipleFieldChangeAction(
                screenName,
                getActionDefinationForStepper(
                    "components.div.children.formwizardSecondStep"
                ),
                dispatch
            );
            break;
        default:
            dispatchMultipleFieldChangeAction(
                screenName,
                getActionDefinationForStepper(
                    "components.div.children.formwizardThirdStep"
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
        }
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


  const callBackForPrevious = (state, dispatch) => {
    changeStep(state, dispatch, "apply", "previous");
  };

  const callBackForNext = async(state, dispatch) => {
    let activeStep = get(
        state.screenConfiguration.screenConfig["apply"],
        "components.div.children.stepper.props.activeStep",
        0
    );
    if(activeStep !== SUMMARY_STEP) {
        changeStep(state, dispatch, "apply");
    }
  }

  export const footer = getCommonApplyFooter({
    previousButton: {
      ...previousButton,
      onClickDefination: {
        action: "condition",
        callBack: callBackForPrevious
      },
    },
    nextButton: {
      ...nextButton,
      onClickDefination: {
        action: "condition",
        callBack: callBackForNext
      }
    },
    submitButton: {
      ...submitButton,
      onClickDefination: {
        action: "condition",
        callBack: callBackForNext
      },
    }
  });