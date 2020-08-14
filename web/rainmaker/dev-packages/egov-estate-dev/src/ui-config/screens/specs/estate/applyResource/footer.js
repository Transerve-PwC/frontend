import {
  getCommonApplyFooter,
  validateFields
} from "../../utils";
import {
  getLabel,
  dispatchMultipleFieldChangeAction,
  getPattern
} from "egov-ui-framework/ui-config/screens/specs/utils";
import {
  toggleSnackbar,
  prepareFinalObject,
  handleScreenConfigurationFieldChange as handleField
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import get from "lodash/get";
import {
  applyEstates
} from "../../../../../ui-utils/apply";
import {
  setRoute
} from "egov-ui-framework/ui-redux/app/actions";
import {
  some,
  set
} from "lodash";
import "./index.css";
import {
  groundRentDetails,
  serviceTaxDetails,
  paymentMadeBy
} from './paymentDetails';
import {
  setDocumentData
} from '../apply'
import {
  getReviewOwner,
  getReviewPurchaser,
  getReviewPayment,
  getReviewCourtCase
} from "./reviewProperty";
import {
  getReviewDocuments
} from "./reviewDocuments";

export const DEFAULT_STEP = -1;
export const PROPERTY_DETAILS_STEP = 0;
export const OWNER_DETAILS_STEP = 1;
export const PURCHASER_DETAILS_STEP = 2;
export const COURT_CASE_DETAILS_STEP = 3;
export const PAYMENT_DETAILS_STEP = 4;
export const DOCUMENT_UPLOAD_STEP = 5;
export const SUMMARY_STEP = 6;

export const moveToSuccess = (estatesData, dispatch, type) => {
  const id = get(estatesData, "id");
  const tenantId = get(estatesData, "tenantId");
  const fileNumber = get(estatesData, "fileNumber");
  const purpose = "apply";
  const status = "success";

  const path = `/estate/acknowledgement?purpose=${purpose}&status=${status}&fileNumber=${fileNumber}&tenantId=${tenantId}`
  dispatch(
    setRoute(path)
  );
};

const callBackForNext = async (state, dispatch) => {
  let activeStep = get(
    state.screenConfiguration.screenConfig["apply"],
    "components.div.children.stepper.props.activeStep",
    0
  );
  let isFormValid = true;
  let hasFieldToaster = true;

  if (activeStep === PROPERTY_DETAILS_STEP) {
    const isPropertyInfoValid = validateFields(
      "components.div.children.formwizardFirstStep.children.propertyInfoDetails.children.cardContent.children.detailsContainer.children",
      state,
      dispatch,
      "apply"
    )
    const isAuctionValid = validateFields(
      "components.div.children.formwizardFirstStep.children.auctionDetails.children.cardContent.children.detailsContainer.children",
      state,
      dispatch,
      "apply"
    )
    const isAdditionalValid = validateFields(
      "components.div.children.formwizardFirstStep.children.additionalDetails.children.cardContent.children.detailsContainer.children",
      state,
      dispatch,
      "apply"
    )

    if (isPropertyInfoValid && isAuctionValid && isAdditionalValid) {
      const res = await applyEstates(state, dispatch, activeStep);
      if (!res) {
        return
      }
    } else {
      isFormValid = false;
    }
  }

  if (activeStep === OWNER_DETAILS_STEP) {
    var propertyOwners = get(
      state.screenConfiguration.preparedFinalObject,
      "Properties[0].propertyDetails.owners"
    );

    let propertyOwnersItems = get(
      state,
      "screenConfiguration.screenConfig.apply.components.div.children.formwizardSecondStep.children.ownerDetails.children.cardContent.children.detailsContainer.children.multipleApplicantContainer.children.multipleApplicantInfo.props.items"
    );

    if (propertyOwnersItems && propertyOwnersItems.length > 0) {
      for (var i = 0; i < propertyOwnersItems.length; i++) {
        if (typeof propertyOwnersItems[i].isDeleted !== "undefined") {
          continue;
        }
        var isOwnerDetailsValid = validateFields(
          `components.div.children.formwizardSecondStep.children.ownerDetails.children.cardContent.children.detailsContainer.children.multipleApplicantContainer.children.multipleApplicantInfo.props.items[${i}].item${i}.children.cardContent.children.ownerCard.children`,
          state,
          dispatch,
          "apply"
        )

        var ownerName = propertyOwners ? propertyOwners[i] ? propertyOwners[i].ownerDetails.ownerName : "" : "";
        
        if (i > 0) {
          var documentDetailsString = JSON.stringify(get(
            state.screenConfiguration.screenConfig,
            `apply.components.div.children.formwizardSixthStep.children.ownerDocumentDetails_0`, {}
          ))
          var newDocumentDetailsString = documentDetailsString.replace(/_0/g, `_${i}`);
          newDocumentDetailsString = newDocumentDetailsString.replace(/owners\[0\]/g, `owners[${i}]`)
          var documentDetailsObj = JSON.parse(newDocumentDetailsString);
          set(
            state.screenConfiguration.screenConfig,
            `apply.components.div.children.formwizardSixthStep.children.ownerDocumentDetails_${i}`,
            documentDetailsObj
          )

          setDocumentData("", state, dispatch, i)

          var groundRentString = JSON.stringify(get(
            state.screenConfiguration.screenConfig,
            `apply.components.div.children.formwizardFifthStep.children.groundRentDetails_0`, {}
          ))
          var newGroundRentString = groundRentString.replace(/_0/g, `_${i}`);
          newGroundRentString = newGroundRentString.replace(/owners\[0\]/g, `owners[${i}]`)
          var groundRentObj = JSON.parse(newGroundRentString);
          set(
            state.screenConfiguration.screenConfig,
            `apply.components.div.children.formwizardFifthStep.children.groundRentDetails_${i}`,
            groundRentObj
          )

          set(
            state.screenConfiguration.screenConfig,
            `apply.components.div.children.formwizardFifthStep.children.groundRentDetails_${i}.children.cardContent.children.detailsContainer.children.dateOfDeposit.pattern`,
            getPattern("Date")
          )
          set(
            state.screenConfiguration.screenConfig,
            `apply.components.div.children.formwizardFifthStep.children.groundRentDetails_${i}.children.cardContent.children.detailsContainer.children.dueDateOfPayment.pattern`,
            getPattern("Date")
          )
          set(
            state.screenConfiguration.screenConfig,
            `apply.components.div.children.formwizardFifthStep.children.groundRentDetails_${i}.children.cardContent.children.detailsContainer.children.receiptDate.pattern`,
            getPattern("Date")
          )

          var serviceTaxString = JSON.stringify(get(
            state.screenConfiguration.screenConfig,
            `apply.components.div.children.formwizardFifthStep.children.serviceTaxDetails_0`, {}
          ))
          var newServiceTaxString = serviceTaxString.replace(/_0/g, `_${i}`);
          newServiceTaxString = newServiceTaxString.replace(/owners\[0\]/g, `owners[${i}]`)
          var serviceTaxObj = JSON.parse(newServiceTaxString);
          set(
            state.screenConfiguration.screenConfig,
            `apply.components.div.children.formwizardFifthStep.children.serviceTaxDetails_${i}`,
            serviceTaxObj
          )

          set(
            state.screenConfiguration.screenConfig,
            `apply.components.div.children.formwizardFifthStep.children.serviceTaxDetails_${i}.children.cardContent.children.detailsContainer.children.dateOfDeposit.pattern`,
            getPattern("Date")
          )
          set(
            state.screenConfiguration.screenConfig,
            `apply.components.div.children.formwizardFifthStep.children.serviceTaxDetails_${i}.children.cardContent.children.detailsContainer.children.receiptDate.pattern`,
            getPattern("Date")
          )

          var paymentMadeByString = JSON.stringify(get(
            state.screenConfiguration.screenConfig,
            `apply.components.div.children.formwizardFifthStep.children.paymentMadeBy_0`, {}
          ))
          var newPaymentMadeByString = paymentMadeByString.replace(/_0/g, `_${i}`)
          newPaymentMadeByString = newPaymentMadeByString.replace(/owners\[0\]/g, `owners[${i}]`)
          var paymentMadeByObj = JSON.parse(newPaymentMadeByString);
          set(
            state.screenConfiguration.screenConfig,
            `apply.components.div.children.formwizardFifthStep.children.paymentMadeBy_${i}`,
            paymentMadeByObj
          )
        }

        dispatch(
          handleField(
            "apply",
            `components.div.children.formwizardFifthStep.children.paymentMadeBy_${i}.children.cardContent.children.detailsContainer.children.paymentMadeBy`,
            "props.value",
            ownerName
          )
        );

        set(
          state.screenConfiguration.screenConfig,
          `apply.components.div.children.formwizardFifthStep.children.ownerDocumentDetails_${i}.children.cardContent.children.header.children.key.props.labelKey`,
          `Douments - ${ownerName}`
        )

        set(
          state.screenConfiguration.screenConfig,
          `apply.components.div.children.formwizardFifthStep.children.groundRentDetails_${i}.children.cardContent.children.header.children.key.props.labelKey`,
          `Ground Rent Details - ${ownerName}`
        )
        set(
          state.screenConfiguration.screenConfig,
          `apply.components.div.children.formwizardFifthStep.children.serviceTaxDetails_${i}.children.cardContent.children.header.children.key.props.labelKey`,
          `Service Tax Details - ${ownerName}`
        )

        const reviewOwnerDetails = getReviewOwner(true, i);
        set(
          reviewOwnerDetails,
          "children.cardContent.children.headerDiv.children.header.children.key.props.labelKey",
          `Owner Details - ${ownerName}`
        )
        set(
          state.screenConfiguration.screenConfig,
          `apply.components.div.children.formwizardSeventhStep.children.reviewDetails.children.cardContent.children.reviewOwnerDetails_${i}`,
          reviewOwnerDetails
        )

        const reviewPaymentDetails = getReviewPayment(true, i);
        set(
          reviewPaymentDetails,
          "children.cardContent.children.headerDiv.children.header.children.key.props.labelKey",
          `Payment Details - ${ownerName}`
        )
        set(
          state.screenConfiguration.screenConfig,
          `apply.components.div.children.formwizardSeventhStep.children.reviewDetails.children.cardContent.children.reviewPaymentDetails_${i}`,
          reviewPaymentDetails
        )
      }
    }

    if (isOwnerDetailsValid) {
      const res = await applyEstates(state, dispatch, activeStep);
      if (!res) {
        return
      }
    } else {
      isFormValid = false;
    }
  }

  if (activeStep === PURCHASER_DETAILS_STEP) {
    const propertyPurchasers = get(
      state.screenConfiguration.preparedFinalObject,
      "Properties[0].propertyDetails.purchaseDetails"
    )

    let propertyPurchaserItems = get(
      state,
      "screenConfiguration.screenConfig.apply.components.div.children.formwizardThirdStep.children.purchaserDetails.children.cardContent.children.detailsContainer.children.multipleApplicantContainer.children.multipleApplicantInfo.props.items"
    );

    if (propertyPurchaserItems && propertyPurchaserItems.length > 0) {
      for (var i = 0; i < propertyPurchaserItems.length; i++) {
        if (typeof propertyPurchaserItems[i].isDeleted !== "undefined") {
          continue;
        }
        var isPurchaserDetailsValid = validateFields(
          `components.div.children.formwizardThirdStep.children.purchaserDetails.children.cardContent.children.detailsContainer.children.multipleApplicantContainer.children.multipleApplicantInfo.props.items[${i}].item${i}.children.cardContent.children.purchaserCard.children`,
          state,
          dispatch,
          "apply"
        )

        const purchaserName = propertyPurchasers ? propertyPurchasers[i] ? propertyPurchasers[i].newOwnerName : "" : "";
        const reviewPurchaserDetails = getReviewPurchaser(true, i);
        set(
          reviewPurchaserDetails,
          "children.cardContent.children.headerDiv.children.header.children.key.props.labelKey",
          `Purchaser - ${purchaserName}`
        )
        set(
          state.screenConfiguration.screenConfig,
          `apply.components.div.children.formwizardSeventhStep.children.reviewDetails.children.cardContent.children.reviewPurchaserDetails_${i}`,
          reviewPurchaserDetails
        )
      }
    }
    if (isPurchaserDetailsValid) {
      const res = await applyEstates(state, dispatch, activeStep);
      if (!res) {
        return
      }
    } else {
      isFormValid = false;
    }
  }
  if (activeStep === COURT_CASE_DETAILS_STEP) {
    const courtCases = get(
      state.screenConfiguration.preparedFinalObject,
      "Properties[0].propertyDetails.courtCases"
    )
    let courtCaseItems = get(
      state,
      "screenConfiguration.screenConfig.apply.components.div.children.formwizardFourthStep.children.courtCaseDetails.children.cardContent.children.detailsContainer.children.multipleApplicantContainer.children.multipleApplicantInfo.props.items"
    );

    if (courtCaseItems && courtCaseItems.length > 0) {
      for (var i = 0; i < courtCaseItems.length; i++) {
        if (typeof courtCaseItems[i].isDeleted !== "undefined") {
          continue;
        }
        var isCourtCaseDetailsValid = validateFields(
          `components.div.children.formwizardFourthStep.children.courtCaseDetails.children.cardContent.children.detailsContainer.children.multipleApplicantContainer.children.multipleApplicantInfo.props.items[${i}].item${i}.children.cardContent.children.courtCaseCard.children`,
          state,
          dispatch
        )

        const reviewCourtCaseDetails = getReviewCourtCase(true, i);
        set(
          state.screenConfiguration.screenConfig,
          `apply.components.div.children.formwizardSeventhStep.children.reviewDetails.children.cardContent.children.reviewCourtCaseDetails_${i}`,
          reviewCourtCaseDetails
        )
      }
    }

    if (isCourtCaseDetailsValid) {
      const res = await applyEstates(state, dispatch, activeStep);
      if (!res) {
        return
      }
    } else {
      isFormValid = false;
    }
  }

  if (activeStep === PAYMENT_DETAILS_STEP) {
    let propertyOwnersItems = get(
      state,
      "screenConfiguration.screenConfig.apply.components.div.children.formwizardSecondStep.children.ownerDetails.children.cardContent.children.detailsContainer.children.multipleApplicantContainer.children.multipleApplicantInfo.props.items"
    );

    for (var i = 0; i < propertyOwnersItems.length; i++) {
      if (typeof propertyOwnersItems[i].isDeleted !== "undefined") {
        continue;
      }
      var isGroundRentDetailsValid = validateFields(
        `components.div.children.formwizardFifthStep.children.groundRentDetails_${i}.children.cardContent.children.detailsContainer.children`,
        state,
        dispatch,
        "apply"
      )

      var isServiceTaxDetailsValid = validateFields(
        `components.div.children.formwizardFifthStep.children.serviceTaxDetails_${i}.children.cardContent.children.detailsContainer.children`,
        state,
        dispatch,
        "apply"
      )
    }

    if (isGroundRentDetailsValid && isServiceTaxDetailsValid) {
      const res = await applyEstates(state, dispatch, activeStep);
      if (!res) {
        return
      }
    } else {
      isFormValid = false;
    }
  }

  if (activeStep === DOCUMENT_UPLOAD_STEP) {
    const propertyOwners = get(
      state.screenConfiguration.preparedFinalObject,
      "Properties[0].propertyDetails.owners"
    );

    const propertyOwnersTemp = get(
      state.screenConfiguration.preparedFinalObject,
      "PropertiesTemp[0].propertyDetails.owners"
    );

    for (var i = 0; i < propertyOwnersTemp.length; i++) {
      const uploadedDocData = get(
        state.screenConfiguration.preparedFinalObject,
        `Properties[0].propertyDetails.owners[${i}].ownerDetails.ownerDocuments`,
        []
      );

      const uploadedTempDocData = get(
        state.screenConfiguration.preparedFinalObject,
        `PropertiesTemp[0].propertyDetails.owners[${i}].ownerDetails.ownerDocuments`,
        []
      );

      for (var y = 0; y < uploadedTempDocData.length; y++) {
        if (
          uploadedTempDocData[y].required &&
          !some(uploadedDocData, {
            documentType: uploadedTempDocData[y].name
          })
        ) {
          isFormValid = false;
        }
      }
      if (isFormValid) {
        const reviewDocData =
          uploadedDocData &&
          uploadedDocData.map(item => {
            return {
              title: `EST_${item.documentType}`,
              link: item.fileUrl && item.fileUrl.split(",")[0],
              linkText: "View",
              name: item.fileName
            };
          });
        dispatch(
          prepareFinalObject(`PropertiesTemp[0].propertyDetails.owners[${i}].ownerDetails.reviewDocData`, reviewDocData)
        );

        const reviewDocuments = getReviewDocuments(true, "apply", `PropertiesTemp[0].propertyDetails.owners[${i}].ownerDetails.reviewDocData`);
        set(
          reviewDocuments,
          "children.cardContent.children.headerDiv.children.header.children.key.props.labelKey",
          `Documents - ${propertyOwners ? propertyOwners[i] ? propertyOwners[i].ownerDetails.ownerName : "" : ""}`
        )
        set(
          state.screenConfiguration.screenConfig,
          `apply.components.div.children.formwizardSeventhStep.children.reviewDetails.children.cardContent.children.reviewDocuments_${i}`,
          reviewDocuments
        )
      }
    }
  }

  if (activeStep === SUMMARY_STEP) {
    isFormValid = await applyEstates(state, dispatch);
    if (isFormValid) {
      const estatesData = get(
        state.screenConfiguration.preparedFinalObject,
        "Properties[0]"
      );
      moveToSuccess(estatesData, dispatch);
    }
  }

  if (activeStep !== SUMMARY_STEP) {
    if (isFormValid) {
      changeStep(state, dispatch, "apply");
    } else if (hasFieldToaster) {
      let errorMessage = {
        labelName: "Please fill all mandatory fields and upload the documents !",
        labelKey: "ERR_FILL_MANDATORY_FIELDS_UPLOAD_DOCS"
      };
      switch (activeStep) {
        case PROPERTY_DETAILS_STEP:
        case OWNER_DETAILS_STEP:
        case PURCHASER_DETAILS_STEP:
        case COURT_CASE_DETAILS_STEP:
        case PAYMENT_DETAILS_STEP:
          errorMessage = {
            labelName: "Please fill all mandatory fields, then do next !",
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
    } else {
      activeStep = mode === "next" ? activeStep + 1 : activeStep - 1;
    }
  } else {
    activeStep = defaultActiveStep;
  }

  const isPreviousButtonVisible = activeStep > PROPERTY_DETAILS_STEP ? true : false;
  const isNextButtonVisible = activeStep < SUMMARY_STEP ? true : false;
  const isSubmitButtonVisible = activeStep === SUMMARY_STEP ? true : false;
  const actionDefination = [{
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
    case PROPERTY_DETAILS_STEP:
      dispatchMultipleFieldChangeAction(
        screenName,
        getActionDefinationForStepper(
          "components.div.children.formwizardFirstStep"
        ),
        dispatch
      );
      break;
    case OWNER_DETAILS_STEP:
      dispatchMultipleFieldChangeAction(
        screenName,
        getActionDefinationForStepper(
          "components.div.children.formwizardSecondStep"
        ),
        dispatch
      );
      break;
    case PURCHASER_DETAILS_STEP:
      dispatchMultipleFieldChangeAction(
        screenName,
        getActionDefinationForStepper(
          "components.div.children.formwizardThirdStep"
        ),
        dispatch
      );
      break;
    case COURT_CASE_DETAILS_STEP:
      dispatchMultipleFieldChangeAction(
        screenName,
        getActionDefinationForStepper(
          "components.div.children.formwizardFourthStep"
        ),
        dispatch
      );
      break;
    case PAYMENT_DETAILS_STEP:
      dispatchMultipleFieldChangeAction(
        screenName,
        getActionDefinationForStepper(
          "components.div.children.formwizardFifthStep"
        ),
        dispatch
      );
      break;
    case DOCUMENT_UPLOAD_STEP:
      dispatchMultipleFieldChangeAction(
        screenName,
        getActionDefinationForStepper(
          "components.div.children.formwizardSixthStep"
        ),
        dispatch
      );
      break;
    default:
      dispatchMultipleFieldChangeAction(
        screenName,
        getActionDefinationForStepper(
          "components.div.children.formwizardSeventhStep"
        ),
        dispatch
      );
  }
};

export const getActionDefinationForStepper = path => {
  const actionDefination = [{
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
    {
      path: "components.div.children.formwizardFourthStep",
      property: "visible",
      value: false
    },
    {
      path: "components.div.children.formwizardFifthStep",
      property: "visible",
      value: false
    },
    {
      path: "components.div.children.formwizardSixthStep",
      property: "visible",
      value: false
    },
    {
      path: "components.div.children.formwizardSeventhStep",
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