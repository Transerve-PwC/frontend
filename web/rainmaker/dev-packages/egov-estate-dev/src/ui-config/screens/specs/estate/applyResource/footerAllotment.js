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
  setDocumentData,
  setCompanyDocs
} from '../allotment'
import {
  getReviewOwner,
  getReviewPurchaser,
  getReviewPayment,
  getReviewCourtCase,
  getReviewAllotmentMultipleSectionDetails
} from "./reviewProperty";
import {
  getReviewDocuments
} from "./reviewDocuments";

export const DEFAULT_STEP = -1;
export const PROPERTY_DETAILS_STEP = 0;
export const AUCTION_DETAILS_STEP = 1;
export const ENTITY_OWNER_DETAILS_STEP = 2;
export const ENTITY_OWNER_DOCUMENT_UPLOAD_STEP = 3;
export const COURT_CASE_DETAILS_STEP = 4;
export const PAYMENT_DETAILS_STEP = 5;
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
    state.screenConfiguration.screenConfig["allotment"],
    "components.div.children.stepperAllotment.props.activeStep",
    0
  );
  let isFormValid = true;
  let hasFieldToaster = true;

  if (activeStep === PROPERTY_DETAILS_STEP) {
    const isPropertyInfoValid = validateFields(
      "components.div.children.formwizardFirstStepAllotment.children.propertyInfoDetails.children.cardContent.children.detailsContainer.children",
      state,
      dispatch,
      "allotment"
    )
    
    const isAdditionalValid = validateFields(
      "components.div.children.formwizardFirstStepAllotment.children.additionalDetails.children.cardContent.children.detailsContainer.children",
      state,
      dispatch,
      "allotment"
    )

    if (isPropertyInfoValid && isAdditionalValid) {
      const res = await applyEstates(state, dispatch, activeStep, "allotment");
      if (!res) {
        return
      }
    } else {
      isFormValid = false;
    }
  }

  if (activeStep == AUCTION_DETAILS_STEP) {
    const isAuctionValid = validateFields(
      "components.div.children.formwizardSecondStepAllotment.children.AllotmentAuctionDetails.children.cardContent.children.detailsContainer.children",
      state,
      dispatch,
      "allotment"
    )
    
    if (isAuctionValid) {
      const res = await applyEstates(state, dispatch, activeStep, "allotment");
      if (!res) {
        return
      }
    } else {
      isFormValid = false;
    }
  }

  if (activeStep === ENTITY_OWNER_DETAILS_STEP) {
    var propertyOwners = get(
      state.screenConfiguration.preparedFinalObject,
      "Properties[0].propertyDetails.owners"
    );

    let propertyOwnersItems = get(
      state.screenConfiguration.screenConfig,
      "allotment.components.div.children.formwizardThirdStepAllotment.children.ownerDetails.children.cardContent.children.detailsContainer.children.multipleApplicantContainer.children.multipleApplicantInfo.props.items"
    );

    if (propertyOwnersItems && propertyOwnersItems.length > 0) {
      for (var i = 0; i < propertyOwnersItems.length; i++) {
        if (typeof propertyOwnersItems[i].isDeleted !== "undefined") {
          continue;
        }
        var isOwnerDetailsValid = validateFields(
          `components.div.children.formwizardThirdStepAllotment.children.ownerDetails.children.cardContent.children.detailsContainer.children.multipleApplicantContainer.children.multipleApplicantInfo.props.items[${i}].item${i}.children.cardContent.children.ownerCard.children`,
          state,
          dispatch,
          "allotment"
        )

        var ownerName = propertyOwners ? propertyOwners[i] ? propertyOwners[i].ownerDetails.ownerName : "" : "";
        
        if (i > 0) {
          var documentDetailsString = JSON.stringify(get(
            state.screenConfiguration.screenConfig,
            `allotment.components.div.children.formwizardFourthStepAllotment.children.ownerDocumentDetails_0`, {}
          ))
          var newDocumentDetailsString = documentDetailsString.replace(/_0/g, `_${i}`);
          newDocumentDetailsString = newDocumentDetailsString.replace(/owners\[0\]/g, `owners[${i}]`)
          var documentDetailsObj = JSON.parse(newDocumentDetailsString);
          set(
            state.screenConfiguration.screenConfig,
            `allotment.components.div.children.formwizardFourthStepAllotment.children.ownerDocumentDetails_${i}`,
            documentDetailsObj
          )

          setDocumentData("", state, dispatch, i)
        }

        set(
          state.screenConfiguration.screenConfig,
          `allotment.components.div.children.formwizardFourthStepAllotment.children.ownerDocumentDetails_${i}.children.cardContent.children.header.children.key.props.labelKey`,
          `Douments - ${ownerName}`
        )

        const reviewOwnerDetails = getReviewOwner(true, i);
        set(
          reviewOwnerDetails,
          "children.cardContent.children.headerDiv.children.header.children.key.props.labelKey",
          `Owner Details - ${ownerName}`
        )
        set(
          state.screenConfiguration.screenConfig,
          `allotment.components.div.children.formwizardSeventhStepAllotment.children.reviewAllotmentDetails.children.cardContent.children.reviewOwnerDetails_${i}`,
          reviewOwnerDetails
        )
      }
    }

    if (isOwnerDetailsValid) {
      const res = await applyEstates(state, dispatch, activeStep, "allotment");
      if (!res) {
        return
      }
    } else {
      isFormValid = false;
    }
  }

  if (activeStep === ENTITY_OWNER_DOCUMENT_UPLOAD_STEP) {
    let propertyOwners = get(
      state.screenConfiguration.preparedFinalObject,
      "Properties[0].propertyDetails.owners"
    );

    let propertyOwnersTemp = get(
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
              title: `ES_${item.documentType}`,
              link: item.fileUrl && item.fileUrl.split(",")[0],
              linkText: "View",
              name: item.fileName
            };
          });
        dispatch(
          prepareFinalObject(`PropertiesTemp[0].propertyDetails.owners[${i}].ownerDetails.reviewDocData`, reviewDocData)
        );

        const reviewDocuments = getReviewDocuments(true, "allotment", `PropertiesTemp[0].propertyDetails.owners[${i}].ownerDetails.reviewDocData`);
        set(
          reviewDocuments,
          "children.cardContent.children.headerDiv.children.header.children.key.props.labelKey",
          `Documents - ${propertyOwners ? propertyOwners[i] ? propertyOwners[i].ownerDetails.ownerName : "" : ""}`
        )
        set(
          state.screenConfiguration.screenConfig,
          `allotment.components.div.children.formwizardSeventhStepAllotment.children.reviewAllotmentDetails.children.cardContent.children.reviewDocuments_${i}`,
          reviewDocuments
        )
      }
    }
  }

  if (activeStep === COURT_CASE_DETAILS_STEP) {
    const courtCases = get(
      state.screenConfiguration.preparedFinalObject,
      "Properties[0].propertyDetails.courtCases"
    )
    let courtCaseItems = get(
      state.screenConfiguration.screenConfig,
      "allotment.components.div.children.formwizardFifthStepAllotment.children.courtCaseDetails.children.cardContent.children.detailsContainer.children.multipleApplicantContainer.children.multipleApplicantInfo.props.items"
    );

    if (courtCaseItems && courtCaseItems.length > 0) {
      for (var i = 0; i < courtCaseItems.length; i++) {
        if (typeof courtCaseItems[i].isDeleted !== "undefined") {
          continue;
        }
        var isCourtCaseDetailsValid = validateFields(
          `components.div.children.formwizardFifthStepAllotment.children.courtCaseDetails.children.cardContent.children.detailsContainer.children.multipleApplicantContainer.children.multipleApplicantInfo.props.items[${i}].item${i}.children.cardContent.children.courtCaseCard.children`,
          state,
          dispatch
        )

        const reviewCourtCaseDetails = getReviewCourtCase(true, i);
        set(
          state.screenConfiguration.screenConfig,
          `allotment.components.div.children.formwizardSeventhStepAllotment.children.reviewAllotmentDetails.children.cardContent.children.reviewCourtCaseDetails_${i}`,
          reviewCourtCaseDetails
        )
      }
    }

    if (isCourtCaseDetailsValid) {
      const res = await applyEstates(state, dispatch, activeStep, "allotment");
      if (!res) {
        return
      }
    } else {
      isFormValid = false;
    }
  }

  if (activeStep === PAYMENT_DETAILS_STEP) {
    const isPremiumAmountValid = validateFields(
      "components.div.children.formwizardSixthStepAllotment.children.premiumAmountDetails.children.cardContent.children.detailsContainer.children",
      state,
      dispatch,
      "allotment"
    )
    const isGroundRentValid = validateFields(
      "components.div.children.formwizardSixthStepAllotment.children.groundRentDetails.children.cardContent.children.detailsContainer.children",
      state,
      dispatch,
      "allotment"
    )
    const isLicenseFeeValid = validateFields(
      "components.div.children.formwizardSixthStepAllotment.children.licenseFeeDetails.children.cardContent.children.detailsContainer.children",
      state,
      dispatch,
      "allotment"
    )
    const isSecurityDetailsValid = validateFields(
      "components.div.children.formwizardSixthStepAllotment.children.securityDetails.children.cardContent.children.detailsContainer.children",
      state,
      dispatch,
      "allotment"
    )
    const isDemandValid = validateFields(
      "components.div.children.formwizardSixthStepAllotment.children.demandSelect.children.cardContent.children.detailsContainer.children",
      state,
      dispatch,
      "allotment"
    )

    let installmentItems = get(
      state.screenConfiguration.screenConfig,
      "allotment.components.div.children.formwizardSixthStepAllotment.children.premiumAmountDetails.children.cardContent.children.installmentContainer.children.cardContent.children.detailsContainer.children.multipleInstallmentContainer.children.multipleInstallmentInfo.props.items"
    );

    if (installmentItems && installmentItems.length > 0) {
      for (var i = 0; i < installmentItems.length; i++) {
        if (typeof installmentItems[i].isDeleted !== "undefined") {
          continue;
        }
        var isInstallmentDetailsValid = validateFields(
          `allotment.components.div.children.formwizardSixthStepAllotment.children.premiumAmountDetails.children.cardContent.children.installmentContainer.children.cardContent.children.detailsContainer.children.multipleInstallmentContainer.children.multipleInstallmentInfo.props.items[${i}].item${i}.children.cardContent.children.installmentCard.children`,
          state,
          dispatch
        )

        getReviewAllotmentMultipleSectionDetails(state, dispatch, "allotment", `components.div.children.formwizardSeventhStepAllotment.children.reviewAllotmentDetails.children.cardContent.children.reviewPremiumAmount.children.cardContent.children.viewInstallments`, "premiumAmount", installmentItems.length);
      }
    }

    let rentItems = get(
      state.screenConfiguration.screenConfig,
      "allotment.components.div.children.formwizardSixthStepAllotment.children.groundRentDetails.children.cardContent.children.rentContainer.children.cardContent.children.detailsContainer.children.multipleRentContainer.children.multipleRentInfo.props.items"
    );

    if (rentItems && rentItems.length > 0) {
      for (var i = 0; i < rentItems.length; i++) {
        if (typeof rentItems[i].isDeleted !== "undefined") {
          continue;
        }
        var isRentDetailsValid = validateFields(
          `allotment.components.div.children.formwizardSixthStepAllotment.children.groundRentDetails.children.cardContent.children.rentContainer.children.cardContent.children.detailsContainer.children.multipleRentContainer.children.multipleRentInfo.props.items[${i}].item${i}.children.cardContent.children.rentCard.children`,
          state,
          dispatch
        )

        getReviewAllotmentMultipleSectionDetails(state, dispatch, "allotment", `components.div.children.formwizardSeventhStepAllotment.children.reviewAllotmentDetails.children.cardContent.children.reviewGroundRent.children.cardContent.children.viewRents`, "groundRent", rentItems.length);
      }
    }

    let licenseFeeItems = get(
      state.screenConfiguration.screenConfig,
      "allotment.components.div.children.formwizardSixthStepAllotment.children.licenseFeeDetails.children.cardContent.children.licenseFeeForYearContainer.children.cardContent.children.detailsContainer.children.multipleLicenseContainer.children.multipleLicenseInfo.props.items"
    );

    if (licenseFeeItems && licenseFeeItems.length > 0) {
      for (var i = 0; i < licenseFeeItems.length; i++) {
        if (typeof licenseFeeItems[i].isDeleted !== "undefined") {
          continue;
        }
        var isLicenseFeeDetailsForYearValid = validateFields(
          `allotment.components.div.children.formwizardSixthStepAllotment.children.licenseFeeDetails.children.cardContent.children.licenseFeeForYearContainer.children.cardContent.children.detailsContainer.children.multipleLicenseContainer.children.multipleLicenseInfo.props.items[${i}].item${i}.children.cardContent.children.licenseCard.children`,
          state,
          dispatch
        )

        getReviewAllotmentMultipleSectionDetails(state, dispatch, "allotment", `components.div.children.formwizardSeventhStepAllotment.children.reviewAllotmentDetails.children.cardContent.children.reviewLicenseFee.children.cardContent.children.viewLicenses`, "licenseFee", licenseFeeItems.length)
      }
    }

    let selectedDemand = get(
      state.screenConfiguration.screenConfig,
      "allotment.components.div.children.formwizardSixthStepAllotment.children.demandSelect.children.cardContent.children.detailsContainer.children.demand.props.value"
    )

    if (selectedDemand == "GROUNDRENT") {
      if (isPremiumAmountValid && isGroundRentValid && isSecurityDetailsValid && isInstallmentDetailsValid && isRentDetailsValid && isDemandValid) {
        const res = await applyEstates(state, dispatch, activeStep, "allotment");
        if (!res) {
          return
        }
      } else {
        isFormValid = false;
      }
    }
    else {
      if (isPremiumAmountValid && isLicenseFeeValid && isSecurityDetailsValid && isInstallmentDetailsValid && isLicenseFeeDetailsForYearValid && isDemandValid) {
        const res = await applyEstates(state, dispatch, activeStep, "allotment");
        if (!res) {
          return
        }
      } else {
        isFormValid = false;
      }
    }
    
    
  }

  if (activeStep === SUMMARY_STEP) {
    isFormValid = await applyEstates(state, dispatch, "", "allotment");
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
      changeStep(state, dispatch, "allotment");
    } else if (hasFieldToaster) {
      let errorMessage = {
        labelName: "Please fill all mandatory fields and upload the documents !",
        labelKey: "ERR_FILL_MANDATORY_FIELDS_UPLOAD_DOCS"
      };
      switch (activeStep) {
        case PROPERTY_DETAILS_STEP:
        case AUCTION_DETAILS_STEP:
        case OWNER_DETAILS_STEP:
        case COURT_CASE_DETAILS_STEP:
        case PAYMENT_DETAILS_STEP:
          errorMessage = {
            labelName: "Please fill all mandatory fields, then do next !",
            labelKey: "ERR_FILL_ESTATE_MANDATORY_FIELDS"
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
    "components.div.children.stepperAllotment.props.activeStep",
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
      path: "components.div.children.stepperAllotment.props",
      property: "activeStep",
      value: activeStep
    },
    {
      path: "components.div.children.footerAllotment.children.previousButton",
      property: "visible",
      value: isPreviousButtonVisible
    },
    {
      path: "components.div.children.footerAllotment.children.nextButton",
      property: "visible",
      value: isNextButtonVisible
    },
    {
      path: "components.div.children.footerAllotment.children.submitButton",
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
          "components.div.children.formwizardFirstStepAllotment"
        ),
        dispatch
      );
      break;
    case AUCTION_DETAILS_STEP:
      dispatchMultipleFieldChangeAction(
        screenName,
        getActionDefinationForStepper(
          "components.div.children.formwizardSecondStepAllotment"
        ),
        dispatch
      );
      break;
    case ENTITY_OWNER_DETAILS_STEP:
      dispatchMultipleFieldChangeAction(
        screenName,
        getActionDefinationForStepper(
          "components.div.children.formwizardThirdStepAllotment"
        ),
        dispatch
      );
      break;
    case ENTITY_OWNER_DOCUMENT_UPLOAD_STEP:
      dispatchMultipleFieldChangeAction(
        screenName,
        getActionDefinationForStepper(
          "components.div.children.formwizardFourthStepAllotment"
        ),
        dispatch
      );
      break;
    case COURT_CASE_DETAILS_STEP:
      dispatchMultipleFieldChangeAction(
        screenName,
        getActionDefinationForStepper(
          "components.div.children.formwizardFifthStepAllotment"
        ),
        dispatch
      );
      break;
    case PAYMENT_DETAILS_STEP:
    dispatchMultipleFieldChangeAction(
      screenName,
      getActionDefinationForStepper(
        "components.div.children.formwizardSixthStepAllotment"
      ),
      dispatch
    );
    break;
    default:
      dispatchMultipleFieldChangeAction(
        screenName,
        getActionDefinationForStepper(
          "components.div.children.formwizardSeventhStepAllotment"
        ),
        dispatch
      );
  }
};

export const getActionDefinationForStepper = path => {
  const actionDefination = [{
      path: "components.div.children.formwizardFirstStepAllotment",
      property: "visible",
      value: true
    },
    {
      path: "components.div.children.formwizardSecondStepAllotment",
      property: "visible",
      value: false
    },
    {
      path: "components.div.children.formwizardThirdStepAllotment",
      property: "visible",
      value: false
    },
    {
      path: "components.div.children.formwizardFourthStepAllotment",
      property: "visible",
      value: false
    },
    {
      path: "components.div.children.formwizardFifthStepAllotment",
      property: "visible",
      value: false
    },
    {
      path: "components.div.children.formwizardSixthStepAllotment",
      property: "visible",
      value: false
    },
    {
      path: "components.div.children.formwizardSeventhStepAllotment",
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
  changeStep(state, dispatch, "allotment", "previous");
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

export const footerAllotment = getCommonApplyFooter({
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