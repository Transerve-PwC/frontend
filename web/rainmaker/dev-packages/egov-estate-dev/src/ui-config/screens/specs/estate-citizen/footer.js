import { getLabel, getStepperObject, dispatchMultipleFieldChangeAction } from "egov-ui-framework/ui-config/screens/specs/utils"
import { getCommonApplyFooter, validateFields } from "../utils";
import { get, some } from "lodash";
import { applyforApplication } from "../../../../ui-utils/apply";
import { prepareFinalObject, toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { moveToSuccess } from "../estate/applyResource/footer";

export const DEFAULT_STEP = -1;
export const DETAILS_STEP = 0;
export const DOCUMENT_UPLOAD_STEP = 1;
export const SUMMARY_STEP = 2;

export const stepsData = [
    { labelName: "Details", labelKey: "ES_DETAILS_HEADER" },
    { labelName: "Documents", labelKey: "ES_COMMON_DOCS" },
    { labelName: "Summary", labelKey: "ES_COMMON_SUMMARY" }
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
            labelKey: "ES_COMMON_BUTTON_PREV_STEP"
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
        labelKey: "ES_COMMON_BUTTON_NXT_STEP"
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
            labelKey: "ES_COMMON_BUTTON_SUBMIT"
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


  const callBackForPrevious = async (state, dispatch) => {
    changeStep(state, dispatch, "apply", "previous");
  };

  const callBackForNext = async(state, dispatch) => {
    let activeStep = get(
        state.screenConfiguration.screenConfig["apply"],
        "components.div.children.stepper.props.activeStep",
        0
    );
    let isFormValid = true;
    let hasFieldToaster = true;
    if(activeStep === DETAILS_STEP) {

      let cardItems = get(state.screenConfiguration.screenConfig["apply"], "components.div.children.formwizardFirstStep.children", {}) || {}
      cardItems = Object.keys(cardItems);

      cardItems.forEach((cardItem) => {
        const isValid = validateFields(`components.div.children.formwizardFirstStep.children.${cardItem}.children.cardContent.children.details_container.children`, state,
        dispatch, "apply");
        isFormValid = isFormValid && isValid
      })
    if(!!isFormValid) {
      const res =  await applyforApplication(state, dispatch, activeStep)
        if(!res) {
          return
        }
    }
    }
    if(activeStep === DOCUMENT_UPLOAD_STEP) {
      const uploadedDocData = get(
        state.screenConfiguration.preparedFinalObject,
        "Applications[0].applicationDocuments",
        []
    );

    const uploadedTempDocData = get(
        state.screenConfiguration.preparedFinalObject,
        "temp[0].documents",
        []
    );

    for (var y = 0; y < uploadedTempDocData.length; y++) {
      if (
          uploadedTempDocData[y].required &&
          !some(uploadedDocData, { documentType: uploadedTempDocData[y].name })
      ) {
          isFormValid = false;
      }
    }
    if(isFormValid) {
      const reviewDocData =
              uploadedDocData &&
              uploadedDocData.map(item => {
                  return {
                      title: `ES_${item.documentType}`,
                      link: item.fileUrl && item.fileUrl.toString().split(",")[0],
                      linkText: "Download",
                      name: item.fileName
                  };
              }).filter(item => !!item.link && !!item.name);
              dispatch(
                prepareFinalObject("temp[0].reviewDocData", reviewDocData)
            );
    }
    }
    if(activeStep === SUMMARY_STEP) {
      isFormValid = await applyforApplication(state, dispatch);
        if (isFormValid) {
          const data = get(
            state.screenConfiguration.preparedFinalObject,
            "Applications[0]"
        );
            moveToSuccess(data, dispatch);
        }
      }
    if(activeStep !== SUMMARY_STEP) {
      if(!!isFormValid) {
        changeStep(state, dispatch, "apply");
      } else if (hasFieldToaster) {
        let errorMessage = {
          labelName:
              "Please fill all mandatory fields and upload the documents !",
          labelKey: "ERR_FILL_MANDATORY_FIELDS_UPLOAD_DOCS"
        };
        switch (activeStep) {
          case DETAILS_STEP: 
                  errorMessage = {
                    labelName:
                        "Please fill all mandatory fields, then do next !",
                    labelKey: "ERR_FILL_RENTED_MANDATORY_FIELDS"
                  };
              break
          case DOCUMENT_UPLOAD_STEP:
                  errorMessage = {
                      labelName: "Please upload all the required documents !",
                      labelKey: "ERR_UPLOAD_REQUIRED_DOCUMENTS"
                  };
              break;
        }
        dispatch(toggleSnackbar(true, errorMessage, "warning"));
      }
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