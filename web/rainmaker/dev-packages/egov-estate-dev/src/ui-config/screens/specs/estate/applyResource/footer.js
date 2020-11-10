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
  applyEstates, applyforApplication
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
  setPrevOwnerDocs
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
import { WF_ALLOTMENT_OF_SITE } from "../../../../../ui-constants";
import { download } from "../../../../../ui-utils/commons";
import { downloadAcknowledgementForm,downloadLetter,downloadEmailNotice,downloadNotice,downloadAmountLetter,downloadHousingBoardLetter} from "../../utils";


export const DEFAULT_STEP = -1;
export const PROPERTY_DETAILS_STEP = 0;
export const AUCTION_DETAILS_STEP = 1;
export const ENTITY_OWNER_DETAILS_STEP = 2;
export const ENTITY_OWNER_DOCUMENT_UPLOAD_STEP = 3;
export const PURCHASER_DETAILS_STEP = 4;
export const PURCHASER_DOCUMENTS_STEP = 5;
export const COURT_CASE_DETAILS_STEP = 6;
export const RENT_INFO_DETAILS_STEP = 7;
export const PAYMENT_DETAILS_STEP = 8;
export const SUMMARY_STEP = 9;

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

    const isAdditionalValid = validateFields(
      "components.div.children.formwizardFirstStep.children.additionalDetails.children.cardContent.children.detailsContainer.children",
      state,
      dispatch,
      "apply"
    )

    let propertyRegisteredTo = get(
      state.screenConfiguration.preparedFinalObject,
      "Properties[0].propertyDetails.propertyRegisteredTo",
      ""
    )

    dispatch(
      handleField(
        "apply",
        "components.div.children.formwizardTenththStep.children.reviewDetails.children.cardContent.children.reviewPropertyInfo.children.cardContent.children.viewFour.children.entityType",
        "visible",
        propertyRegisteredTo == "ENTITY"
      )
    )

    if (isPropertyInfoValid && isAdditionalValid) {
      const res = await applyEstates(state, dispatch, activeStep);
      if (!res) {
        return
      }
    } else {
      isFormValid = false;
    }
  }

  if (activeStep === AUCTION_DETAILS_STEP) {
    const isAuctionValid = validateFields(
      "components.div.children.formwizardSecondStep.children.AllotmentAuctionDetails.children.cardContent.children.detailsContainer.children.cardContent.children.auctionCard.children",
      state,
      dispatch,
      "apply"
    )

    if (isAuctionValid) {
      const res = await applyEstates(state, dispatch, activeStep);
      if (!res) {
        return
      }
    } else {
      isFormValid = false;
    }
  }

  if (activeStep === ENTITY_OWNER_DETAILS_STEP) {
    let entityType = get(
      state.screenConfiguration.preparedFinalObject,
      "Properties[0].propertyDetails.entityType",
      ""
    )

    if (!!entityType) {
      if (entityType == "ET.PARTNERSHIP_FIRM") {
        dispatch(
          prepareFinalObject(
            `Properties[0].propertyDetails.owners[${i}].ownershipType`,
            "PARTNER"
          )
        )
      }
      else {
        dispatch(
          prepareFinalObject(
            `Properties[0].propertyDetails.owners[${i}].ownershipType`,
            "OWNER"
          )
        )
      }
    }

    let isOwnerOrPartnerDetailsValid = true;

    switch(entityType) {
      case "ET.PUBLIC_LIMITED_COMPANY":
      case "ET.PRIVATE_LIMITED_COMPANY":
        var isCompanyDetailsValid = validateFields(
          "components.div.children.formwizardThirdStep.children.companyDetails.children.cardContent.children.detailsContainer.children",
          state,
          dispatch,
          "apply"
        );

        isOwnerOrPartnerDetailsValid = setOwnersOrPartners(state, dispatch, "ownerDetails");
        if (isOwnerOrPartnerDetailsValid && isCompanyDetailsValid) {
          const res = await applyEstates(state, dispatch, activeStep, "apply");
          if (!res) {
            return
          }
        } else {
          isFormValid = false;
        }
        break;
      case "ET.PARTNERSHIP_FIRM":
        var isFirmDetailsValid = validateFields(
          "components.div.children.formwizardThirdStep.children.firmDetails.children.cardContent.children.detailsContainer.children",
          state,
          dispatch,
          "apply"
        )

        isOwnerOrPartnerDetailsValid = setOwnersOrPartners(state, dispatch, "partnerDetails");
        if (isFirmDetailsValid && isOwnerOrPartnerDetailsValid) {
          const res = await applyEstates(state, dispatch, activeStep, "apply");
          if (!res) {
            return
          }
        } else {
          isFormValid = false;
        }
        break;
      case "ET.PROPRIETORSHIP":
        var isFirmDetailsValid = validateFields(
          "components.div.children.formwizardThirdStep.children.firmDetails.children.cardContent.children.detailsContainer.children",
          state,
          dispatch,
          "apply"
        )
        var isProprietorshipDetailsValid = validateFields(
          "components.div.children.formwizardThirdStep.children.proprietorshipDetails.children.cardContent.children.detailsContainer.children",
          state,
          dispatch,
          "apply"
        )
        if (isFirmDetailsValid && isProprietorshipDetailsValid) {
          const res = await applyEstates(state, dispatch, activeStep, "apply");
          if (!res) {
            return
          }
        } else {
          isFormValid = false;
        }
        break;
      default:
        isOwnerOrPartnerDetailsValid = setOwnersOrPartners(state, dispatch, "ownerDetails");
        if (isOwnerOrPartnerDetailsValid) {
          const res = await applyEstates(state, dispatch, activeStep, "apply");
          if (!res) {
            return
          }
        } else {
          isFormValid = false;
        }
        break;
    }
  }

  if (activeStep === ENTITY_OWNER_DOCUMENT_UPLOAD_STEP) {
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
              title: `ES_${item.documentType}`,
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
          `apply.components.div.children.formwizardTenthStep.children.reviewDetails.children.cardContent.children.reviewDocuments_${i}`,
          reviewDocuments
        )
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
      "screenConfiguration.screenConfig.apply.components.div.children.formwizardFifthStep.children.purchaserDetails.children.cardContent.children.detailsContainer.children.multipleApplicantContainer.children.multipleApplicantInfo.props.items"
    );

    if (propertyPurchaserItems && propertyPurchaserItems.length > 0) {
      for (var i = 0; i < propertyPurchaserItems.length; i++) {
        if (typeof propertyPurchaserItems[i].isDeleted !== "undefined") {
          continue;
        }
        var isPurchaserDetailsValid = validateFields(
          `components.div.children.formwizardFifthStep.children.purchaserDetails.children.cardContent.children.detailsContainer.children.multipleApplicantContainer.children.multipleApplicantInfo.props.items[${i}].item${i}.children.cardContent.children.purchaserCard.children`,
          state,
          dispatch,
          "apply"
        )

        const purchaserName = propertyPurchasers ? propertyPurchasers[i] ? propertyPurchasers[i].ownerDetails.ownerName : "" : "";

        if (i > 0) {
          var documentDetailsString = JSON.stringify(get(
            state.screenConfiguration.screenConfig,
            `apply.components.div.children.formwizardSixthStep.children.previousOwnerDocuments_0`, {}
          ))
          var newDocumentDetailsString = documentDetailsString.replace(/_0/g, `_${i}`);
          newDocumentDetailsString = newDocumentDetailsString.replace(/purchaser\[0\]/g, `purchaser[${i}]`)
          var documentDetailsObj = JSON.parse(newDocumentDetailsString);
          set(
            state.screenConfiguration.screenConfig,
            `apply.components.div.children.formwizardSixthStep.children.previousOwnerDocuments_${i}`,
            documentDetailsObj
          )
  
          setPrevOwnerDocs("", state, dispatch, i)
        }

        set(
          state.screenConfiguration.screenConfig,
          `apply.components.div.children.formwizardSixthStep.children.previousOwnerDocuments_${i}.children.cardContent.children.header.children.key.props.labelKey`,
          `Documents - ${purchaserName}`
        )
        const reviewPurchaserDetails = getReviewPurchaser(true, i);
        set(
          reviewPurchaserDetails,
          "children.cardContent.children.headerDiv.children.header.children.key.props.labelKey",
          `Previous Owner - ${purchaserName}`
        )
        set(
          state.screenConfiguration.screenConfig,
          `apply.components.div.children.formwizardTenthStep.children.reviewDetails.children.cardContent.children.reviewPurchaserDetails_${i}`,
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
      const uploadedDocData = get(
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
          prepareFinalObject(`PropertiesTemp[0].propertyDetails.purchaser[${i}].ownerDetails.reviewDocDataPrevOwner`, reviewDocData)
        );

        const reviewDocuments = getReviewDocuments(true, "apply", `PropertiesTemp[0].propertyDetails.purchaser[${i}].ownerDetails.reviewDocDataPrevOwner`, 5);
        set(
          reviewDocuments,
          "children.cardContent.children.headerDiv.children.header.children.key.props.labelKey",
          `Documents - ${propertyPrevOwners ? propertyPrevOwners[i] ? propertyPrevOwners[i].ownerDetails.ownerName : "" : ""}`
        )
        set(
          state.screenConfiguration.screenConfig,
          `apply.components.div.children.formwizardTenthStep.children.reviewDetails.children.cardContent.children.reviewDocumentsPrevOwner_${i}`,
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
      state,
      "screenConfiguration.screenConfig.apply.components.div.children.formwizardSeventhStep.children.courtCaseDetails.children.cardContent.children.detailsContainer.children.multipleApplicantContainer.children.multipleApplicantInfo.props.items"
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

        const reviewCourtCaseDetails = getReviewCourtCase(true, i);
        set(
          state.screenConfiguration.screenConfig,
          `apply.components.div.children.formwizardTenthStep.children.reviewDetails.children.cardContent.children.reviewCourtCaseDetails_${i}`,
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

  if (activeStep === RENT_INFO_DETAILS_STEP) {

  }

  if (activeStep === PAYMENT_DETAILS_STEP) {
    var isGroundRentDetailsValid = validateFields(
      `components.div.children.formwizardNinthStep.children.groundRentDetails.children.cardContent.children.detailsContainer.children`,
      state,
      dispatch,
      "apply"
    )

    var isServiceTaxDetailsValid = validateFields(
      `components.div.children.formwizardNinthStep.children.serviceTaxDetails.children.cardContent.children.detailsContainer.children`,
      state,
      dispatch,
      "apply"
    )

    if (isGroundRentDetailsValid && isServiceTaxDetailsValid) {
      const res = await applyEstates(state, dispatch, activeStep);
      if (!res) {
        return
      }
    } else {
      isFormValid = false;
    }
  }

  if (activeStep === SUMMARY_STEP) {
    isFormValid = await applyEstates(state, dispatch, activeStep);
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
      changeStep(state, dispatch, "apply");
    } else if (hasFieldToaster) {
      let errorMessage = {
        labelName: "Please fill all mandatory fields and upload the documents !",
        labelKey: "ES_ERR_FILL_MANDATORY_FIELDS_UPLOAD_DOCS"
      };
      switch (activeStep) {
        case PROPERTY_DETAILS_STEP:
        case AUCTION_DETAILS_STEP:
        case ENTITY_OWNER_DETAILS_STEP:
        case PURCHASER_DETAILS_STEP:
        case COURT_CASE_DETAILS_STEP:
        case RENT_INFO_DETAILS_STEP:
        case PAYMENT_DETAILS_STEP:
          errorMessage = {
            labelName: "Please fill all mandatory fields, then do next !",
            labelKey: "ES_ERR_FILL_MANDATORY_FIELDS"
          };
          break;
        case DOCUMENT_UPLOAD_STEP:
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

const setOwnersOrPartners = (state, dispatch, container) => {
  let propertyOwners = get(
    state.screenConfiguration.preparedFinalObject,
    "Properties[0].propertyDetails.owners"
  );

  let propertyOwnersItems = get(
    state.screenConfiguration.screenConfig,
    `apply.components.div.children.formwizardThirdStep.children.${container}.children.cardContent.children.detailsContainer.children.multipleApplicantContainer.children.multipleApplicantInfo.props.items`
  );

  let isOwnerOrPartnerDetailsValid = true;

  if (propertyOwnersItems && propertyOwnersItems.length > 0) {
    for (var i = 0; i < propertyOwnersItems.length; i++) {
      if (typeof propertyOwnersItems[i].isDeleted !== "undefined") {
        continue;
      }
      isOwnerOrPartnerDetailsValid = validateFields(
        `components.div.children.formwizardThirdStep.children.${container}.children.cardContent.children.detailsContainer.children.multipleApplicantContainer.children.multipleApplicantInfo.props.items[${i}].item${i}.children.cardContent.children.ownerCard.children`,
        state,
        dispatch,
        "apply"
      )

      var ownerName = propertyOwners ? propertyOwners[i] ? propertyOwners[i].ownerDetails.ownerName : "" : "";
      
      if (i > 0) {
        var documentDetailsString = JSON.stringify(get(
          state.screenConfiguration.screenConfig,
          `apply.components.div.children.formwizardFourthStep.children.ownerDocumentDetails_0`, {}
        ))
        var newDocumentDetailsString = documentDetailsString.replace(/_0/g, `_${i}`);
        newDocumentDetailsString = newDocumentDetailsString.replace(/owners\[0\]/g, `owners[${i}]`)
        var documentDetailsObj = JSON.parse(newDocumentDetailsString);
        set(
          state.screenConfiguration.screenConfig,
          `apply.components.div.children.formwizardFourthStep.children.ownerDocumentDetails_${i}`,
          documentDetailsObj
        )

        setDocumentData("", state, dispatch, i)
      }

      set(
        state.screenConfiguration.screenConfig,
        `apply.components.div.children.formwizardFourthStep.children.ownerDocumentDetails_${i}.children.cardContent.children.header.children.key.props.labelKey`,
        `Documents - ${ownerName}`
      )

      const reviewOwnerDetails = getReviewOwner(true, i);
      set(
        reviewOwnerDetails,
        "children.cardContent.children.headerDiv.children.header.children.key.props.labelKey",
        `Owner Details - ${ownerName}`
      )
      set(
        state.screenConfiguration.screenConfig,
        `apply.components.div.children.formwizardTenthStep.children.reviewDetails.children.cardContent.children.reviewOwnerDetails_${i}`,
        reviewOwnerDetails
      )
    }
  }

  return isOwnerOrPartnerDetailsValid;
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
    case AUCTION_DETAILS_STEP:
      dispatchMultipleFieldChangeAction(
        screenName,
        getActionDefinationForStepper(
          "components.div.children.formwizardSecondStep"
        ),
        dispatch
      );
      break;
    case ENTITY_OWNER_DETAILS_STEP:
      dispatchMultipleFieldChangeAction(
        screenName,
        getActionDefinationForStepper(
          "components.div.children.formwizardThirdStep"
        ),
        dispatch
      );
      break;
    case ENTITY_OWNER_DOCUMENT_UPLOAD_STEP:
      dispatchMultipleFieldChangeAction(
        screenName,
        getActionDefinationForStepper(
          "components.div.children.formwizardFourthStep"
        ),
        dispatch
      );
      break;
    case PURCHASER_DETAILS_STEP:
      dispatchMultipleFieldChangeAction(
        screenName,
        getActionDefinationForStepper(
          "components.div.children.formwizardFifthStep"
        ),
        dispatch
      );
      break;
    case PURCHASER_DOCUMENTS_STEP:
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
    case RENT_INFO_DETAILS_STEP:
      dispatchMultipleFieldChangeAction(
        screenName,
        getActionDefinationForStepper(
          "components.div.children.formwizardEighthStep"
        ),
        dispatch
      );
      break;
    case PAYMENT_DETAILS_STEP:
      dispatchMultipleFieldChangeAction(
        screenName,
        getActionDefinationForStepper(
          "components.div.children.formwizardNinthStep"
        ),
        dispatch
      );
      break;
    default:
      dispatchMultipleFieldChangeAction(
        screenName,
        getActionDefinationForStepper(
          "components.div.children.formwizardTenthStep"
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
  },
  {
    path: "components.div.children.formwizardNinthStep",
    property: "visible",
    value: false
  },
  {
    path: "components.div.children.formwizardTenthStep",
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

export const downloadPrintContainer = (
  action,
  state,
  dispatch,
  applicationState,
  applicationType
) => {
 
  /** MenuButton data based on status */
  let downloadMenu = [];
  let printMenu = [];  
 

  let applicationDownloadObject = {
    label: { labelName: "Application", labelKey: "ES_APPLICATION" },
    link: () => {
      const { Applications,temp } = state.screenConfiguration.preparedFinalObject;
      const documents = temp[0].reviewDocData;
      set(Applications[0],"additionalDetails.documents",documents)
      const feeEstimate = temp[0].estimateCardData;
      downloadAcknowledgementForm(Applications,applicationType,feeEstimate,applicationState);
    },
    leftIcon: "assignment"
  };

  let LetterDownloadObject = {
    label: { labelName: "Letter", labelKey: applicationType === 'NDC' ? "ES_NDC_GENERAL_REASON":  applicationType === "PatnershipDeed" ? "ES_LETTER_PRIVATE_LIMITED" : "ES_LETTER" },
    link: () => {
      const { Applications,temp } = state.screenConfiguration.preparedFinalObject;
      const documents = temp[0].reviewDocData;
      set(Applications[0],"additionalDetails.documents",documents)
      downloadLetter(Applications,applicationType);
    },
    leftIcon: "assignment"
  }

  let LetterPrintObject = {
    label: { labelName: "Letter", labelKey: applicationType === 'NDC' ? "ES_NDC_GENERAL_REASON": "ES_LETTER" },
    link: () => {
      const { Applications,temp } = state.screenConfiguration.preparedFinalObject;
      const documents = temp[0].reviewDocData;
      set(Applications[0],"additionalDetails.documents",documents)
      downloadLetter(Applications,applicationType,'print');
    },
    leftIcon: "assignment"
  }

  let NDCWHODownloadObject = {
    label: { labelName: "Letter", labelKey: "ES_NDC_AWHO_LETTER" },
    link: () => {
      const { Applications,temp } = state.screenConfiguration.preparedFinalObject;
      const documents = temp[0].reviewDocData;
      set(Applications[0],"additionalDetails.documents",documents)
      downloadNotice(Applications,applicationType);
    },
    leftIcon: "assignment"
  }

  let NDCWHOPrintObject = {
    label: { labelName: "Letter", labelKey: applicationType === 'NDC' ? "ES_NDC_AWHO_LETTER": "ES_LETTER" },
    link: () => {
      const { Applications,temp } = state.screenConfiguration.preparedFinalObject;
      const documents = temp[0].reviewDocData;
      set(Applications[0],"additionalDetails.documents",documents)
      downloadNotice(Applications,applicationType,'print');
    },
    leftIcon: "assignment"
  }

  let applicationPrintObject = {
    label: { labelName: "Application", labelKey: "ES_APPLICATION" },
    link: () => {
      const { Applications,temp } = state.screenConfiguration.preparedFinalObject;
      const documents = temp[0].reviewDocData;
      set(Applications[0],"additionalDetails.documents",documents)
      const feeEstimate = temp[0].estimateCardData;
      downloadAcknowledgementForm(Applications,applicationType,feeEstimate,applicationState);    },
    leftIcon: "assignment"
  };

  let NoticePrintObject = {
    label: { labelName: "Notice", labelKey: applicationType === 'IssuanceOfNotice' ? "ES_VIOLATION_NOTICE": "ES_NOTICE" },
    link: () => {
      const { Applications,temp } = state.screenConfiguration.preparedFinalObject;
      const documents = temp[0].reviewDocData;
      set(Applications[0],"additionalDetails.documents",documents)
      downloadNotice(Applications,applicationType,'','print');
    },
    leftIcon: "assignment"
  }

  let NoticeDownloadObject = {
    label: { labelName: "Notice", labelKey: applicationType === 'IssuanceOfNotice' ? "ES_VIOLATION_NOTICE": "ES_NOTICE" },
    link: () => {
      const { Applications,temp } = state.screenConfiguration.preparedFinalObject;
      const documents = temp[0].reviewDocData;
      set(Applications[0],"additionalDetails.documents",documents)
      downloadNotice(Applications,applicationType,'');
    },
    leftIcon: "assignment"
  };

  let IssuanceViolationOrderPrintObject = {
    label: { labelName: "Violation Order", labelKey: "ES_VIOLATION_ORDER" },
    link: () => {
      const { Applications,temp } = state.screenConfiguration.preparedFinalObject;
      const documents = temp[0].reviewDocData;
      set(Applications[0],"additionalDetails.documents",documents)
      downloadNotice(Applications,applicationType,'order','print');
    },
    leftIcon: "assignment"
  }

  let IssuanceViolationOrderDownloadObject = {
    label: { labelName: "Violation Order", labelKey: "ES_VIOLATION_ORDER" },
    link: () => {
      const { Applications,temp } = state.screenConfiguration.preparedFinalObject;
      const documents = temp[0].reviewDocData;
      set(Applications[0],"additionalDetails.documents",documents)
      downloadNotice(Applications,applicationType,'order');
    },
    leftIcon: "assignment"
  };

  let cancellationOrderPrintObject = {
    label: { labelName: "Cancellation Order", labelKey: "ES_CANCELLATION_SEALING_ORDER" },
    link: () => {
      const { Applications,temp } = state.screenConfiguration.preparedFinalObject;
      const documents = temp[0].reviewDocData;
      set(Applications[0],"additionalDetails.documents",documents)
      downloadNotice(Applications,applicationType,'cancellation order','print');
    },
    leftIcon: "assignment"
  }

  let cancellationOrderDownloadObject = {
    label: { labelName: "Cancellation Order", labelKey: "ES_CANCELLATION_SEALING_ORDER" },
    link: () => {
      const { Applications,temp } = state.screenConfiguration.preparedFinalObject;
      const documents = temp[0].reviewDocData;
      set(Applications[0],"additionalDetails.documents",documents)
      downloadNotice(Applications,applicationType,'cancellation order');
    },
    leftIcon: "assignment"
  };

  let nonPaymentNoticePrintObject = {
    label: { labelName: "Non Payment Notice", labelKey: "ES_NON_PAYMENT_NOTICE" },
    link: () => {
      const { Applications,temp } = state.screenConfiguration.preparedFinalObject;
      const documents = temp[0].reviewDocData;
      set(Applications[0],"additionalDetails.documents",documents)
      downloadNotice(Applications,applicationType,'non payment notice','print');
    },
    leftIcon: "assignment"
  }

  let nonPaymentNoticeDownloadObject = {
    label: { labelName: "Non Payment Notice", labelKey: "ES_NON_PAYMENT_NOTICE" },
    link: () => {
      const { Applications,temp } = state.screenConfiguration.preparedFinalObject;
      const documents = temp[0].reviewDocData;
      set(Applications[0],"additionalDetails.documents",documents)
      downloadNotice(Applications,applicationType,'non payment notice');
    },
    leftIcon: "assignment"
  };

  let nonPaymentOrderPrintObject = {
    label: { labelName: "Non Payment Order", labelKey: "ES_NON_PAYMENT_ORDER" },
    link: () => {
      const { Applications,temp } = state.screenConfiguration.preparedFinalObject;
      const documents = temp[0].reviewDocData;
      set(Applications[0],"additionalDetails.documents",documents)
      downloadNotice(Applications,applicationType,'non payment order','print');
    },
    leftIcon: "assignment"
  }

  let nonPaymentOrderDownloadObject = {
    label: { labelName: "Non Payment Order", labelKey: "ES_NON_PAYMENT_ORDER" },
    link: () => {
      const { Applications,temp } = state.screenConfiguration.preparedFinalObject;
      const documents = temp[0].reviewDocData;
      set(Applications[0],"additionalDetails.documents",documents)
      downloadNotice(Applications,applicationType,'non payment order');
    },
    leftIcon: "assignment"
  };

  let occupationCertificatePrintObject = {
    label: { labelName: "Occupation Certificate Notice", labelKey: "ES_OCCUPATION_CERTIFICATE_NOTICE" },
    link: () => {
      const { Applications,temp } = state.screenConfiguration.preparedFinalObject;
      const documents = temp[0].reviewDocData;
      set(Applications[0],"additionalDetails.documents",documents)
      downloadNotice(Applications,applicationType,'occupation certificate','print');
    },
    leftIcon: "assignment"
  }

  let occupationCertificateDownloadObject = {
    label: { labelName: "Occupation Certificate Notice", labelKey: "ES_OCCUPATION_CERTIFICATE_NOTICE" },
    link: () => {
      const { Applications,temp } = state.screenConfiguration.preparedFinalObject;
      const documents = temp[0].reviewDocData;
      set(Applications[0],"additionalDetails.documents",documents)
      downloadNotice(Applications,applicationType,'occupation certificate');
    },
    leftIcon: "assignment"
  };

  let AmountLetterAfterConversionDownloadObject = {
    label: { labelName: "Conversion Letter", labelKey: "ES_CONVERSION_LETTER" },
    link: () => {
      const { Applications,temp } = state.screenConfiguration.preparedFinalObject;
      const documents = temp[0].reviewDocData;
      set(Applications[0],"additionalDetails.documents",documents)
      downloadAmountLetter(Applications,applicationType);
    },
    leftIcon: "assignment"
  }

  let AmountLetterAfterConversionPrintObject = {
    label: { labelName: "Conversion Letter", labelKey: "ES_CONVERSION_LETTER" },
    link: () => {
      const { Applications,temp } = state.screenConfiguration.preparedFinalObject;
      const documents = temp[0].reviewDocData;
      set(Applications[0],"additionalDetails.documents",documents)
      downloadAmountLetter(Applications,applicationType,'print');
    },
    leftIcon: "assignment"
  }

  let HousingBoardNotificationDownloadObject = {
    label: { labelName: "Housing Board Notification", labelKey: "ES_HOUSING_BOARD_NOTIFICATION"},
    link: () => {
      const { Applications,temp } = state.screenConfiguration.preparedFinalObject;
      const documents = temp[0].reviewDocData;
      set(Applications[0],"additionalDetails.documents",documents)
      downloadHousingBoardLetter(Applications,applicationType);
    },
    leftIcon: "assignment"
  }

  let HousingBoardNotificationPrintObject = {
    label: { labelName: "Housing Board Notification", labelKey: "ES_HOUSING_BOARD_NOTIFICATION"},
    link: () => {
      const { Applications,temp } = state.screenConfiguration.preparedFinalObject;
      const documents = temp[0].reviewDocData;
      set(Applications[0],"additionalDetails.documents",documents)
      downloadHousingBoardLetter(Applications,applicationType,'print');
    },
    leftIcon: "assignment"
  }

  let EmailDownloadObject = {
    label: { labelName: "Email Notice", labelKey: "ES_EMAIL_NOTICE"},
    link: () => {
      const { Applications,temp } = state.screenConfiguration.preparedFinalObject;
      const documents = temp[0].reviewDocData;
      set(Applications[0],"additionalDetails.documents",documents)
      downloadEmailNotice(Applications,applicationType);
    },
    leftIcon: "assignment"
  }

  let EmailPrintObject = {
    label: { labelName: "Email Notice", labelKey: "ES_EMAIL_NOTICE"},
    link: () => {
      const { Applications,temp } = state.screenConfiguration.preparedFinalObject;
      const documents = temp[0].reviewDocData;
      set(Applications[0],"additionalDetails.documents",documents)
      downloadEmailNotice(Applications,applicationType,'print');
    },
    leftIcon: "assignment"
  }

  switch (applicationType && applicationState) {
    case `${applicationType}` && 'ES_PENDING_DS_VERIFICATION':
    case `${applicationType}` && 'ES_PENDING_DA_VERIFICATION': 
    case `${applicationType}` && 'ES_PENDING_SRA_VERIFICATION':
    case `${applicationType}` && 'ES_PENDING_SO_VERIFICATION': 
    case `${applicationType}` && 'ES_PENDING_AC_APPROVAL':
    case `${applicationType}` && 'ES_PENDING_DA_FEE': 
    case `${applicationType}` && 'ES_PENDING_PAYMENT':
    case `${applicationType}` && 'ES_PENDING_CLARIFICATION':     
    case `${applicationType}` && 'ES_REJECTED': 
    case `${applicationType}` && 'ES_PENDING_SO_TEMPLATE_CREATION':
    case `${applicationType}` && 'ES_PENDING_CITIZEN_TEMPLATE_SUBMISSION':
    case `${applicationType}` && 'ES_PENDING_DS_TEMPLATE_VERIFICATION': 
    case `${applicationType}` && 'ES_PENDING_DA_TEMPLATE_VERIFICATION':
    case `${applicationType}` && 'ES_PENDING_SRA_TEMPLATE_VERIFICATION':
    case `${applicationType}` && 'ES_PENDING_SO_TEMPLATE_VERIFICATION':
      //   downloadMenu = [
      //     applicationDownloadObject
      //   ]
      //   printMenu = [
      //       applicationPrintObject
      //  ] 
      downloadMenu = [
        applicationDownloadObject,
        NoticeDownloadObject,
        IssuanceViolationOrderDownloadObject,
        cancellationOrderDownloadObject,
        nonPaymentNoticeDownloadObject,
        nonPaymentOrderDownloadObject,
        occupationCertificateDownloadObject
      ]
    
      printMenu = [
        applicationPrintObject,
        NoticePrintObject,
        IssuanceViolationOrderPrintObject,
        cancellationOrderPrintObject,
        nonPaymentNoticePrintObject,
        nonPaymentOrderPrintObject,
        occupationCertificatePrintObject
      ]
        break;    
    case `${applicationType}` && 'ES_PENDING_DA_PREPARE_LETTER':
    case `${applicationType}` && 'ES_PENDING_SO_APPROVAL': 
    case `${applicationType}` && 'ES_PENDING_PAYMENT': 
          switch(applicationType) {
            case 'ChangeInTrade':
            case 'DuplicateCopy':  
                downloadMenu = [
                  applicationDownloadObject
                ]
                printMenu = [
                  applicationPrintObject
                ]
              break;
            default:
                downloadMenu = [
                  applicationDownloadObject,LetterDownloadObject
                ]
                printMenu = [
                  applicationPrintObject,LetterPrintObject
                ]
          } 
        break;
    case `${applicationType}` && 'ES_PENDING_DA_NOTICE_CREATION':    
    case `${applicationType}` && 'ES_PENDING_CITIZEN_NOTICE_DOCUMENTS':
    case `${applicationType}` && 'ES_PENDING_DS_NOTICE_VERIFICATION': 
    case `${applicationType}` && 'ES_PENDING_DA_NOTICE_VERIFICATION':
    case `${applicationType}` && 'ES_PENDING_SRA_NOTICE_VERIFICATION': 
    case `${applicationType}` && 'ES_PENDING_SO_NOTICE_VERIFICATION':
    case `${applicationType}` && 'ES_PENDING_AC_NOTICE_APPROVAL': 
    case `${applicationType}` && 'ES_PENDING_DA_HEARING_APPROVAL':
    case `${applicationType}` && 'ES_PENDING_AC_HEARING_APPROVAL': 
    case `${applicationType}` && 'PENDING_DA_PENALTY':
    case `${applicationType}` && 'PENDING_SRA_PENALTY_VERIFICATION':
    case `${applicationType}` && 'PENDING_SO_PENALTY_VERIFICATION':
    case `${applicationType}` && 'PENDING_AC_PENALTY_APPROVAL':
    case `${applicationType}` && 'PENDING_DA_PENALTY_APPROVAL':      
          switch(applicationType){
            case 'LeaseholdToFreehold':
                downloadMenu = [
                  applicationDownloadObject,LetterDownloadObject,
                  NoticeDownloadObject
                ]
              
                printMenu = [
                  applicationPrintObject,LetterPrintObject,
                  NoticePrintObject
                ]
                break;
            case 'IssuanceOfNotice':
                downloadMenu = [
                  applicationDownloadObject,
                  NoticeDownloadObject,
                  IssuanceViolationOrderDownloadObject
                ]
              
                printMenu = [
                  applicationPrintObject,
                  NoticePrintObject,
                  IssuanceViolationOrderPrintObject
                ]
          }
          break;
    case `${applicationType}` && 'ES_APPROVED':  
      switch(applicationType) {
            case 'SaleDeed':
                downloadMenu = [
                  applicationDownloadObject,LetterDownloadObject
                ]
              
                printMenu = [
                  applicationPrintObject,LetterPrintObject
                ]
            break;
            case 'LeaseDeed':
                downloadMenu = [
                  applicationDownloadObject,LetterDownloadObject
                ]
              
                printMenu = [
                  applicationPrintObject,LetterPrintObject,
                
                ]
              break;
            case 'ScfToSco':
                downloadMenu = [
                  applicationDownloadObject,LetterDownloadObject
                ]
              
                printMenu = [
                  applicationPrintObject,LetterPrintObject
                ]
              break;
            case 'LeaseholdToFreehold':
                downloadMenu = [
                  applicationDownloadObject,LetterDownloadObject,
                  AmountLetterAfterConversionDownloadObject,
                  HousingBoardNotificationDownloadObject,
                  NoticeDownloadObject
                ]
              
                printMenu = [
                  applicationPrintObject,LetterPrintObject,
                  AmountLetterAfterConversionPrintObject,
                  HousingBoardNotificationPrintObject,NoticePrintObject
                ]
                
              break;
            case 'ChangeInTrade':
                downloadMenu = [
                  applicationDownloadObject
                ]
              
                printMenu = [
                  applicationPrintObject
                ]
              break;
            case 'UnRegisteredWill':
                downloadMenu = [
                  applicationDownloadObject,LetterDownloadObject,NoticeDownloadObject,EmailDownloadObject
                ]
              
                printMenu = [
                  applicationPrintObject,LetterPrintObject,NoticePrintObject,EmailPrintObject
                ]
              break;
            case 'NOC':
                downloadMenu = [
                  applicationDownloadObject,LetterDownloadObject
                ]
              
                printMenu = [
                  applicationPrintObject,LetterPrintObject
                ]
            break;
            case 'RegisteredWill':
                downloadMenu = [
                  applicationDownloadObject,LetterDownloadObject,NoticeDownloadObject,EmailDownloadObject
                ]
              
                printMenu = [
                  applicationPrintObject,LetterPrintObject,NoticePrintObject,EmailPrintObject
                ]
            break;
            case 'NDC':
                downloadMenu = [
                  applicationDownloadObject,LetterDownloadObject,NDCWHODownloadObject
                ]
              
                printMenu = [
                  applicationPrintObject,LetterPrintObject,NDCWHOPrintObject
                ]
            break;
            case 'PatnershipDeed':
                downloadMenu = [
                  applicationDownloadObject,LetterDownloadObject
                ]
              
                printMenu = [
                  applicationPrintObject,LetterPrintObject
                ]
            break;
            case 'DuplicateCopy':
                downloadMenu = [
                  applicationDownloadObject
                ]
              
                printMenu = [
                  applicationPrintObject
                ]
            break;
            case 'Mortgage':
                downloadMenu = [
                  applicationDownloadObject,LetterDownloadObject
                ]
              
                printMenu = [
                  applicationPrintObject,LetterPrintObject
                ]
            break;
            case 'FamilySettlement':
                downloadMenu = [
                  applicationDownloadObject,LetterDownloadObject
                ]
              
                printMenu = [
                  applicationPrintObject,LetterPrintObject
                ]
            break;
            case 'IntestateDeath':
                downloadMenu = [
                  applicationDownloadObject,LetterDownloadObject,NoticeDownloadObject,EmailDownloadObject
                ]
              
                printMenu = [
                  applicationPrintObject,LetterPrintObject,NoticePrintObject,EmailPrintObject
                ]
            break;
          } 
        break;   
        
  
  }

  return {
    rightdiv: {
      uiFramework: "custom-atoms",
      componentPath: "Div",
      props: {
        style: { textAlign: "right", display: "flex" },
      },
      children: {
        downloadMenu: {
          uiFramework: "custom-atoms-local",
          moduleName: "egov-estate",
          componentPath: "MenuButton",
          props: {
            data: {
              label: {labelName : "DOWNLOAD" , labelKey :"ES_DOWNLOAD"},
               leftIcon: "cloud_download",
              rightIcon: "arrow_drop_down",
              props: { variant: "outlined", style: { height: "60px", color : "#FE7A51",marginRight: "10px" }, className: "tl-download-button" },
              menu: downloadMenu
            }
          }
        },
        printMenu: {
          uiFramework: "custom-atoms-local",
          moduleName: "egov-estate",
          componentPath: "MenuButton",
          props: {
            data: {
              label: {labelName : "PRINT" , labelKey :"ES_PRINT"},
              leftIcon: "print",
              rightIcon: "arrow_drop_down",
              props: { variant: "outlined", style: { height: "60px", color : "#FE7A51" }, className: "tl-print-button" },
              menu: printMenu
            }
          }
        }

      },
      // gridDefination: {
      //   xs: 12,
      //   sm: 6
      // }
    }
  }
};
