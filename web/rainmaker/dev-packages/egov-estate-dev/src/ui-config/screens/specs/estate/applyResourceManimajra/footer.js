import {
  getCommonApplyFooter,
  validateFields
} from "../../utils";
import {
  getLabel,
  dispatchMultipleFieldChangeAction,
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
  getReviewOwner,
} from "../applyResourceBuildingBranch/reviewDetails";
import {
  getReviewDocuments
} from "../applyResourceBuildingBranch/reviewDocuments";
import { getReviewPurchaser, getReviewCourtCase } from "../applyResource/reviewProperty"
import { WF_ALLOTMENT_OF_SITE } from "../../../../../ui-constants";
import { downloadAcknowledgementForm,downloadLetter,downloadEmailNotice,downloadNotice,downloadAmountLetter,downloadHousingBoardLetter} from "../../utils";
import { getFileUrl, getFileUrlFromAPI } from "egov-ui-framework/ui-utils/commons";


export const DEFAULT_STEP = -1;
export const PROPERTY_DETAILS_STEP = 0;
export const OWNER_DETAILS_STEP = 1;
export const OWNER_DOCUMENT_UPLOAD_STEP = 2;
export const PURCHASER_DETAILS_STEP = 3;
export const PURCHASER_DOCUMENTS_STEP = 4;
export const PAYMENT_DETAILS_STEP = 5;
export const COURT_CASE_DETAILS_STEP = 6;
export const SUMMARY_STEP = 7;

export const moveToSuccess = (data, dispatch, type) => {
  const id = get(data, "id");
  const tenantId = get(data, "tenantId");
  const fileNumber = get(data, "fileNumber");
  const applicationNumber = get(data, "applicationNumber")
  const purpose = "apply";
  const status = "success";
  let path = "";
  switch(type) {
    case WF_ALLOTMENT_OF_SITE : 
      path = `/estate/acknowledgement?purpose=${purpose}&status=${status}&fileNumber=${fileNumber}&tenantId=${tenantId}&type=${type}`;
      break;
    default : {
      const {branchType, moduleType, applicationType} = data;
      type = `${branchType}_${moduleType}_${applicationType}`;
      path = `/estate/acknowledgement?purpose=${purpose}&status=${status}&applicationNumber=${applicationNumber}&tenantId=${tenantId}&type=${type}`
    }
  }
  dispatch(
    setRoute(path)
  );
};

const callBackForNext = async (state, dispatch) => {
  let activeStep = get(
    state.screenConfiguration.screenConfig["apply-manimajra"],
    "components.div.children.manimajraStepper.props.activeStep",
    0
  );
  let isFormValid = true;
  let hasFieldToaster = true;

  if (activeStep === PROPERTY_DETAILS_STEP) {
    const isPropertyInfoValid = validateFields(
      "components.div.children.formwizardFirstStep.children.propertyInfoDetails.children.cardContent.children.detailsContainer.children",
      state,
      dispatch,
      "apply-manimajra"
    )

    const isAdditionalValid = validateFields(
      "components.div.children.formwizardFirstStep.children.additionalDetails.children.cardContent.children.detailsContainer.children",
      state,
      dispatch,
      "apply-manimajra"
    )

    if (isPropertyInfoValid && isAdditionalValid) {
      const res = await applyEstates(state, dispatch, activeStep, "apply-manimajra");
      if (!res) {
        return
      }
    } else {
      isFormValid = false;
    }
  }

  if (activeStep === OWNER_DETAILS_STEP) {
    let propertyOwners = get(
      state.screenConfiguration.preparedFinalObject,
      "Properties[0].propertyDetails.owners",
      []
    );

    let propertyOwnersItems = get(
      state.screenConfiguration.screenConfig,
      `apply-manimajra.components.div.children.formwizardSecondStep.children.ownerDetails.children.cardContent.children.detailsContainer.children.multipleApplicantContainer.children.multipleApplicantInfo.props.items`
    );

    let isOwnerDetailsValid = true;

    if (propertyOwnersItems && propertyOwnersItems.length > 0) {
      for (var i = 0; i < propertyOwnersItems.length; i++) {
        if (typeof propertyOwnersItems[i].isDeleted !== "undefined") {
          continue;
        }
        isOwnerDetailsValid = validateFields(
          `components.div.children.formwizardSecondStep.children.ownerDetails.children.cardContent.children.detailsContainer.children.multipleApplicantContainer.children.multipleApplicantInfo.props.items[${i}].item${i}.children.cardContent.children.ownerCard.children`,
          state,
          dispatch,
          "apply-manimajra"
        )

        var ownerName = propertyOwners ? propertyOwners[i] ? propertyOwners[i].ownerDetails.ownerName : "" : "";

        if (i > 0) {
          var documentDetailsString = JSON.stringify(get(
            state.screenConfiguration.screenConfig,
            `apply-manimajra.components.div.children.formwizardThirdStep.children.ownerDocumentDetails_0`, {}
          ))
          var newDocumentDetailsString = documentDetailsString.replace(/_0/g, `_${i}`);
          newDocumentDetailsString = newDocumentDetailsString.replace(/owners\[0\]/g, `owners[${i}]`)
          var documentDetailsObj = JSON.parse(newDocumentDetailsString);
          set(
            state.screenConfiguration.screenConfig,
            `apply-manimajra.components.div.children.formwizardThirdStep.children.ownerDocumentDetails_${i}`,
            documentDetailsObj
          )
  
          setDocumentData("", state, dispatch, i, "formwizardThirdStep")
        }
        set(
          state.screenConfiguration.screenConfig,
          `apply-manimajra.components.div.children.formwizardThirdStep.children.ownerDocumentDetails_${i}.children.cardContent.children.header.children.key.props.labelKey`,
          `Documents - ${ownerName}`
        )

        const reviewOwnerDetails = getReviewOwner(true, i, 1, "apply-manimajra");
        set(
          reviewOwnerDetails,
          "children.cardContent.children.headerDiv.children.header.children.key.props.labelKey",
          `Owner Details - ${ownerName}`
        )
        set(
          state.screenConfiguration.screenConfig,
          `apply-manimajra.components.div.children.formwizardEighthStep.children.reviewDetails.children.cardContent.children.reviewOwnerDetails_${i}`,
          reviewOwnerDetails
        )
      }
    }

    if (isOwnerDetailsValid) {
      const res = await applyEstates(state, dispatch, activeStep, "apply-manimajra");
      if (!res) {
        return
      }
    } else {
      isFormValid = false;
    }
  }

  if (activeStep === OWNER_DOCUMENT_UPLOAD_STEP) {
    const propertyOwners = get(
      state.screenConfiguration.preparedFinalObject,
      "Properties[0].propertyDetails.owners"
    );

    const propertyOwnersTemp = get(
      state.screenConfiguration.preparedFinalObject,
      "PropertiesTemp[0].propertyDetails.owners"
    );

    for (var i = 0; i < propertyOwnersTemp.length; i++) {
      let uploadedDocData = get(
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
        uploadedDocData = uploadedDocData.filter(item => !!item);
        const fileStoreIds = uploadedDocData && uploadedDocData.map(item => item && item.fileStoreId).filter(item => !!item).join(",");
        const fileUrlPayload = fileStoreIds && (await getFileUrlFromAPI(fileStoreIds));
        
        const reviewDocData =
          uploadedDocData &&
          uploadedDocData.map((item, index) => {
            return {
              title: `ES_${item.documentType}`,
              link: item.fileUrl ? item.fileUrl.toString().split(",")[0] : !!fileUrlPayload && Object.values(fileUrlPayload)[index],
              linkText: "View",
              name: item.fileName || (fileUrlPayload &&
                fileUrlPayload[item.fileStoreId] &&
                decodeURIComponent(
                  getFileUrl(fileUrlPayload[item.fileStoreId])
                    .split("?")[0]
                    .split("/")
                    .pop()
                    .slice(13)
                ))
            };
          }).filter(item => !!item && !!item.link && !!item.name);
        dispatch(
          prepareFinalObject(`PropertiesTemp[0].propertyDetails.owners[${i}].ownerDetails.reviewDocData`, reviewDocData)
        );

        const reviewDocuments = getReviewDocuments(true, "apply-manimajra", `PropertiesTemp[0].propertyDetails.owners[${i}].ownerDetails.reviewDocData`, 2);
        set(
          reviewDocuments,
          "children.cardContent.children.headerDiv.children.header.children.key.props.labelKey",
          `Documents - ${propertyOwners ? propertyOwners[i] ? propertyOwners[i].ownerDetails.ownerName : "" : ""}`
        )
        set(
          state.screenConfiguration.screenConfig,
          `apply-manimajra.components.div.children.formwizardEighthStep.children.reviewDetails.children.cardContent.children.reviewDocuments_${i}`,
          reviewDocuments
        )

        const res = await applyEstates(state, dispatch, activeStep, "apply-manimajra");
        if(!res) {
          return
        }
      }
    }
  }

  if (activeStep === PURCHASER_DETAILS_STEP) {
    const propertyPurchasers = get(
      state.screenConfiguration.preparedFinalObject,
      "Properties[0].propertyDetails.purchaser"
    )

    let propertyPurchaserItems = get(
      state,
      "screenConfiguration.screenConfig.apply-manimajra.components.div.children.formwizardFourthStep.children.purchaserDetails.children.cardContent.children.detailsContainer.children.multipleApplicantContainer.children.multipleApplicantInfo.props.items"
    );

    if (propertyPurchaserItems && propertyPurchaserItems.length > 0) {
      for (var i = 0; i < propertyPurchaserItems.length; i++) {
        if (typeof propertyPurchaserItems[i].isDeleted !== "undefined") {
          continue;
        }
        var isPurchaserDetailsValid = validateFields(
          `components.div.children.formwizardFourthStep.children.purchaserDetails.children.cardContent.children.detailsContainer.children.multipleApplicantContainer.children.multipleApplicantInfo.props.items[${i}].item${i}.children.cardContent.children.purchaserCard.children`,
          state,
          dispatch,
          "apply-manimajra"
        )

        const purchaserName = propertyPurchasers ? propertyPurchasers[i] ? propertyPurchasers[i].ownerDetails.ownerName : "" : "";

        if (i > 0) {
          var documentDetailsString = JSON.stringify(get(
            state.screenConfiguration.screenConfig,
            `apply-manimajra.components.div.children.formwizardFifthStep.children.previousOwnerDocuments_0`, {}
          ))
          var newDocumentDetailsString = documentDetailsString.replace(/_0/g, `_${i}`);
          newDocumentDetailsString = newDocumentDetailsString.replace(/purchaser\[0\]/g, `purchaser[${i}]`)
          var documentDetailsObj = JSON.parse(newDocumentDetailsString);
          set(
            state.screenConfiguration.screenConfig,
            `apply-manimajra.components.div.children.formwizardFifthStep.children.previousOwnerDocuments_${i}`,
            documentDetailsObj
          )
  
          setPrevOwnerDocs("", state, dispatch, i)
        }

        set(
          state.screenConfiguration.screenConfig,
          `apply-manimajra.components.div.children.formwizardFifthStep.children.previousOwnerDocuments_${i}.children.cardContent.children.header.children.key.props.labelKey`,
          `Documents - ${purchaserName}`
        )
        const reviewPurchaserDetails = getReviewPurchaser(true, i, 3, "apply-manimajra");
        set(
          reviewPurchaserDetails,
          "children.cardContent.children.headerDiv.children.header.children.key.props.labelKey",
          `Previous Owner - ${purchaserName}`
        )
        set(
          state.screenConfiguration.screenConfig,
          `apply-manimajra.components.div.children.formwizardEighthStep.children.reviewDetails.children.cardContent.children.reviewPurchaserDetails_${i}`,
          reviewPurchaserDetails
        )
      }
    }

    if (isPurchaserDetailsValid) {
      const res = await applyEstates(state, dispatch, activeStep, "apply-manimajra");
      if (!res) {
        return
      }
    } else {
      isFormValid = false;
    }
  }

  if (activeStep === PURCHASER_DOCUMENTS_STEP) {
    const propertyPrevOwners = get(
      state.screenConfiguration.preparedFinalObject,
      "Properties[0].propertyDetails.purchaser"
    );

    const propertyPrevOwnersTemp = get(
      state.screenConfiguration.preparedFinalObject,
      "PropertiesTemp[0].propertyDetails.purchaser"
    );

    for (var i = 0; i < propertyPrevOwnersTemp.length; i++) {
      let uploadedDocData = get(
        state.screenConfiguration.preparedFinalObject,
        `Properties[0].propertyDetails.purchaser[${i}].ownerDetails.ownerDocuments`,
        []
      );

      const uploadedTempDocData = get(
        state.screenConfiguration.preparedFinalObject,
        `PropertiesTemp[0].propertyDetails.purchaser[${i}].ownerDetails.ownerDocuments`,
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
        uploadedDocData = uploadedDocData.filter(item => !!item);
        const fileStoreIds = uploadedDocData && uploadedDocData.map(item => item && item.fileStoreId).filter(item => !!item).join(",");
        const fileUrlPayload = fileStoreIds && (await getFileUrlFromAPI(fileStoreIds));
        const reviewDocData =
          uploadedDocData &&
          uploadedDocData.map((item, index) => {
            return {
              title: `ES_${item.documentType}`,
              link: item.fileUrl ? item.fileUrl.toString().split(",")[0] : !!fileUrlPayload && Object.values(fileUrlPayload)[index],
              linkText: "View",
              name: item.fileName || (fileUrlPayload &&
                fileUrlPayload[item.fileStoreId] &&
                decodeURIComponent(
                  getFileUrl(fileUrlPayload[item.fileStoreId])
                    .split("?")[0]
                    .split("/")
                    .pop()
                    .slice(13)
                ))
            };
          }).filter(item => !!item && !!item.link && !!item.name);
        dispatch(
          prepareFinalObject(`PropertiesTemp[0].propertyDetails.purchaser[${i}].ownerDetails.reviewDocDataPrevOwner`, reviewDocData)
        );

        const reviewDocuments = getReviewDocuments(true, "apply-manimajra", `PropertiesTemp[0].propertyDetails.purchaser[${i}].ownerDetails.reviewDocDataPrevOwner`, 4);
        set(
          reviewDocuments,
          "children.cardContent.children.headerDiv.children.header.children.key.props.labelKey",
          `Documents - ${propertyPrevOwners ? propertyPrevOwners[i] ? propertyPrevOwners[i].ownerDetails.ownerName : "" : ""}`
        )
        set(
          state.screenConfiguration.screenConfig,
          `apply-manimajra.components.div.children.formwizardEighthStep.children.reviewDetails.children.cardContent.children.reviewDocumentsPrevOwner_${i}`,
          reviewDocuments
        )

        const res = await applyEstates(state, dispatch, activeStep, "apply-manimajra");
        if(!res) {
          return
        }
      }
    }
  }

  if (activeStep === COURT_CASE_DETAILS_STEP) {
    const courtCases = get(
      state.screenConfiguration.preparedFinalObject,
      "Properties[0].propertyDetails.courtCases"
    )
    let courtCaseItems = get(
      state,
      "screenConfiguration.screenConfig.apply-manimajra.components.div.children.formwizardSeventhStep.children.courtCaseDetails.children.cardContent.children.detailsContainer.children.multipleApplicantContainer.children.multipleApplicantInfo.props.items"
    );

    if (courtCaseItems && courtCaseItems.length > 0) {
      for (var i = 0; i < courtCaseItems.length; i++) {
        if (typeof courtCaseItems[i].isDeleted !== "undefined") {
          continue;
        }
        var isCourtCaseDetailsValid = validateFields(
          `components.div.children.formwizardSeventhStep.children.courtCaseDetails.children.cardContent.children.detailsContainer.children.multipleApplicantContainer.children.multipleApplicantInfo.props.items[${i}].item${i}.children.cardContent.children.courtCaseCard.children`,
          state,
          dispatch
        )

        const reviewCourtCaseDetails = getReviewCourtCase(true, i, 6, "apply-manimajra");
        set(
          state.screenConfiguration.screenConfig,
          `apply-manimajra.components.div.children.formwizardEighthStep.children.reviewDetails.children.cardContent.children.reviewCourtCaseDetails_${i}`,
          reviewCourtCaseDetails
        )
      }
    }

    if (isCourtCaseDetailsValid) {
      const res = await applyEstates(state, dispatch, activeStep, "apply-manimajra");
      if (!res) {
        return
      }
    } else {
      isFormValid = false;
    }
  }

  if (activeStep === PAYMENT_DETAILS_STEP) {
    
  }

  if (activeStep === SUMMARY_STEP) {
    isFormValid = await applyEstates(state, dispatch, activeStep, "apply-manimajra");
    if (isFormValid) {
      const estatesData = get(
        state.screenConfiguration.preparedFinalObject,
        "Properties[0]"
      );
      moveToSuccess(estatesData, dispatch, WF_ALLOTMENT_OF_SITE);
    }
  }

  if (activeStep !== SUMMARY_STEP) {
    if (isFormValid) {
      changeStep(state, dispatch, "apply-manimajra");
    } else if (hasFieldToaster) {
      let errorMessage = {
        labelName: "Please fill all mandatory fields and upload the documents !",
        labelKey: "ES_ERR_FILL_MANDATORY_FIELDS_UPLOAD_DOCS"
      };
      switch (activeStep) {
        case PROPERTY_DETAILS_STEP:
        case OWNER_DETAILS_STEP:
        case PURCHASER_DETAILS_STEP:
        case COURT_CASE_DETAILS_STEP:
        case PAYMENT_DETAILS_STEP:
          errorMessage = {
            labelName: "Please fill all mandatory fields, then do next !",
            labelKey: "ES_ERR_FILL_MANDATORY_FIELDS"
          };
          break;
        case DOCUMENT_UPLOAD_STEP:
        case PURCHASER_DOCUMENTS_STEP:
          errorMessage = {
            labelName: "Please upload all the required documents !",
            labelKey: "ES_ERR_UPLOAD_REQUIRED_DOCUMENTS"
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
    "components.div.children.manimajraStepper.props.activeStep",
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
    path: "components.div.children.manimajraStepper.props",
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
    case OWNER_DOCUMENT_UPLOAD_STEP:
      dispatchMultipleFieldChangeAction(
        screenName,
        getActionDefinationForStepper(
          "components.div.children.formwizardThirdStep"
        ),
        dispatch
      );
      break;
    case PURCHASER_DETAILS_STEP:
      dispatchMultipleFieldChangeAction(
        screenName,
        getActionDefinationForStepper(
          "components.div.children.formwizardFourthStep"
        ),
        dispatch
      );
      break;
    case PURCHASER_DOCUMENTS_STEP:
      dispatchMultipleFieldChangeAction(
        screenName,
        getActionDefinationForStepper(
          "components.div.children.formwizardFifthStep"
        ),
        dispatch
      );
      break;
    case PAYMENT_DETAILS_STEP:
    dispatchMultipleFieldChangeAction(
      screenName,
      getActionDefinationForStepper(
        "components.div.children.formwizardSixthStep"
      ),
      dispatch
    );
    break;
    case COURT_CASE_DETAILS_STEP:
      dispatchMultipleFieldChangeAction(
        screenName,
        getActionDefinationForStepper(
          "components.div.children.formwizardSeventhStep"
        ),
        dispatch
      );
      break;
    default:
      dispatchMultipleFieldChangeAction(
        screenName,
        getActionDefinationForStepper(
          "components.div.children.formwizardEighthStep"
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
  },
  {
    path: "components.div.children.formwizardEighthStep",
    property: "visible",
    value: false
  }];
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
  changeStep(state, dispatch, "apply-manimajra", "previous");
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
