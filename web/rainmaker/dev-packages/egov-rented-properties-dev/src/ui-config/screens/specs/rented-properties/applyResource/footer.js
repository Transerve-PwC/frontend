import { getCommonApplyFooter, validateFields } from "../../utils";
import { getLabel, dispatchMultipleFieldChangeAction } from "egov-ui-framework/ui-config/screens/specs/utils";
import { toggleSnackbar, prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import get from "lodash/get";
import { applyRentedProperties,applynoticegeneration,applyrecoveryNotice } from "../../../../../ui-utils/apply";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import { some } from "lodash";

export const DEFAULT_STEP = -1;
export const DETAILS_STEP = 0;
export const DOCUMENT_UPLOAD_STEP = 1;
export const SUMMARY_STEP = 2;

export const moveToSuccess = (rentedData, dispatch, type) => {
  const id = get(rentedData, "id");
  const transitNumber = get(rentedData, "transitNumber")
  const transitNumberTransitSite = get(rentedData, "property.transitNumber")
  const applicationNumberTransitSite = get(rentedData, "applicationNumber")
  const applicationNumber = get(rentedData, "ownerDetails.applicationNumber")
  const duplicateCopyApplicatioNumber =  get(rentedData, "applicationNumber")
  const tenantId = get(rentedData, "tenantId");
  const purpose = "apply";
  const purposeTransit = "TransitSiteapply";
  const status = "success";
 
  const path = type === "OWNERSHIPTRANSFERRP" ? 
  `/rented-properties/acknowledgement?purpose=${purpose}&status=${status}&applicationNumber=${applicationNumber}&tenantId=${tenantId}&type=${type}`
  :type === "DUPLICATECOPYOFALLOTMENTLETTERRP" ? 
  `/rented-properties/acknowledgement?purpose=${purpose}&status=${status}&applicationNumber=${duplicateCopyApplicatioNumber}&tenantId=${tenantId}&type=${type}` :
  type === "PERMISSIONTOMORTGAGE" ? 
  `/rented-properties/acknowledgement?purpose=${purpose}&status=${status}&applicationNumber=${duplicateCopyApplicatioNumber}&tenantId=${tenantId}&type=${type}`:
  `/rented-properties/acknowledgement?purpose=${purposeTransit}&status=${status}&transitNumber=${transitNumberTransitSite}&tenantId=${tenantId}`
  dispatch(
    setRoute(path)
  );
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
        const isPropertyDetailsValid = validateFields(
            "components.div.children.formwizardFirstStep.children.propertyDetails.children.cardContent.children.detailsContainer.children",
            state,
            dispatch
        )
        const isRentHolderValid = validateFields(
            "components.div.children.formwizardFirstStep.children.rentHolderDetails.children.cardContent.children.detailsContainer.children",
            state,
            dispatch
        )
        const isAddressValid = validateFields(
            "components.div.children.formwizardFirstStep.children.addressDetails.children.cardContent.children.detailsContainer.children",
            state,
            dispatch
        )
        const isRentValid = validateFields(
            "components.div.children.formwizardFirstStep.children.rentDetails.children.cardContent.children.detailsContainer.children",
            state,
            dispatch
        )
        const isPaymentValid = validateFields(
            "components.div.children.formwizardFirstStep.children.paymentDetails.children.cardContent.children.detailsContainer.children",
            state,
            dispatch
        )
        if(!!isPropertyDetailsValid && !!isRentHolderValid && !!isRentValid && !!isPaymentValid && !!isAddressValid
            ) {
              const res = await applyRentedProperties(state, dispatch, activeStep)
              if(!res) {
                return
              }
        } else {
            isFormValid = false;
        }
    }

    if(activeStep === DOCUMENT_UPLOAD_STEP) {
      const uploadedDocData = get(
        state.screenConfiguration.preparedFinalObject,
        "Properties[0].propertyDetails.applicationDocuments",
        []
    );

    const uploadedTempDocData = get(
        state.screenConfiguration.preparedFinalObject,
        "PropertiesTemp[0].applicationDocuments",
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
                      title: `RP_${item.documentType}`,
                      link: item.fileUrl && item.fileUrl.split(",")[0],
                      linkText: "View",
                      name: item.fileName
                  };
              });
              dispatch(
                prepareFinalObject("PropertiesTemp[0].reviewDocData", reviewDocData)
            );
    }
    }

    if(activeStep === SUMMARY_STEP) {
    isFormValid = await applyRentedProperties(state, dispatch);
    isFormValid = true;
      if (isFormValid) {
        const rentedData = get(
          state.screenConfiguration.preparedFinalObject,
          "Properties[0]"
      );
          moveToSuccess(rentedData, dispatch);
      }
    }

    if(activeStep !== SUMMARY_STEP) {
        if (isFormValid) {
          
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
                    break;
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

const callBackForNextrecoveryNoticegeneration = async(state, dispatch) => {

  let isFormValid = true;

const isOwnerDetailsValid = validateFields(
  "components.div.children.formwizardFirstStep.children.noticePropertyDetails.children.cardContent.children.detailsContainer.children",   
  state,
  dispatch,
  "notice-recovry"
)

const isRentHolderValid = validateFields(
  "components.div.children.formwizardFirstStep.children.ownerDetailsForNotice.children.cardContent.children.detailsContainer.children",   
  state,
  dispatch,
  "notice-recovry"
)

const isPaymentDetailsValid = validateFields(
  "components.div.children.formwizardFirstStep.children.paymentDetailsNotice.children.cardContent.children.detailsContainer.children",   
  state,
  dispatch,
  "notice-recovry"
)
if(isOwnerDetailsValid && isRentHolderValid && isPaymentDetailsValid) {
  const res = await applynoticegeneration(state, dispatch, "Recovery")
  if(!res) {
   return
  } 
else{
  isFormValid = false;
  } 
}


if (isFormValid) {
  const noticegendata = get(
    state.screenConfiguration.preparedFinalObject,
    "NoticeApplications[0]"
);
moveToSuccess(noticegendata, dispatch);
}

if (!isFormValid) {
  
  let errorMessage = {
    labelName:
        "Please fill all mandatory fields, then do next !",
    labelKey: "ERR_FILL_RENTED_MANDATORY_FIELDS"
};

dispatch(toggleSnackbar(true, errorMessage, "warning"));
}   
}

const callBackForNextViolationnoticegeneration = async(state, dispatch) => {

  let isFormValid = true;

const isOwnerDetailsValid = validateFields(
  "components.div.children.formwizardFirstStep.children.noticePropertyDetails.children.cardContent.children.detailsContainer.children",   
  state,
  dispatch,
  "notice-violation"
)

const isRentHolderValid = validateFields(
  "components.div.children.formwizardFirstStep.children.ownerDetailsForNotice.children.cardContent.children.detailsContainer.children",   
  state,
  dispatch,
  "notice-violation"
)
if(isOwnerDetailsValid && isRentHolderValid) {
  const res = await applynoticegeneration(state, dispatch, "Violation")
  if(!res) {
   return
  } 
else{
  isFormValid = false;
  } 
}

if (isFormValid) {
  const noticegendata = get(
    state.screenConfiguration.preparedFinalObject,
    "NoticeApplications[0]"
);
moveToSuccess(noticegendata, dispatch);
}

if (!isFormValid) {
  
  let errorMessage = {
    labelName:
        "Please fill all mandatory fields, then do next !",
    labelKey: "ERR_FILL_RENTED_MANDATORY_FIELDS"
};

dispatch(toggleSnackbar(true, errorMessage, "warning"));
}   
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
  
  export const callBackForPrevious = (state, dispatch) => {
    changeStep(state, dispatch, "apply", "previous");
  };

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

export const submitButtontransit = {
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

  export const Violationnoticegenfooter = getCommonApplyFooter({
    
    submitButton: {
      ...submitButtontransit,
      onClickDefination: {
        action: "condition",
        callBack: callBackForNextViolationnoticegeneration
      },
    }
  });

  export const recoveryNoticefooter = getCommonApplyFooter({
    
    submitButton: {
      ...submitButtontransit,
      onClickDefination: {
        action: "condition",
        callBack: callBackForNextrecoveryNoticegeneration
      },
    }
  });
