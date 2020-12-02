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
import { WF_ALLOTMENT_OF_SITE } from "../../../../../ui-constants";
import { getFileUrl, getFileUrlFromAPI } from "egov-ui-framework/ui-utils/commons";

export const DEFAULT_STEP = -1;
export const PROPERTY_DETAILS_STEP = 0;
export const AUCTION_DETAILS_STEP = 1;
export const ENTITY_OWNER_DETAILS_STEP = 2;
export const ENTITY_OWNER_DOCUMENT_UPLOAD_STEP = 3;
export const COURT_CASE_DETAILS_STEP = 4;
export const PAYMENT_DETAILS_STEP = 5;
export const SUMMARY_STEP = 6;

const screenKey = "allotment"

export const moveToSuccess = (estatesData, dispatch, type) => {
  const id = get(estatesData, "id");
  const tenantId = get(estatesData, "tenantId");
  const fileNumber = get(estatesData, "fileNumber");
  const purpose = screenKey;
  const status = "success";

  const path = `/estate/acknowledgement?purpose=${purpose}&status=${status}&fileNumber=${fileNumber}&tenantId=${tenantId}&type=${type}`
  dispatch(
    setRoute(path)
  );
};

const callBackForNext = async (state, dispatch) => {
  let activeStep = get(
    state.screenConfiguration.screenConfig[screenKey],
    "components.div.children.stepperAllotment.props.activeStep",
    0
  );
  let isFormValid = true;
  let hasFieldToaster = true;
  let rentYearMismatch = false;
  let licenseFeeYearMismatch = false;
  let isStartAndEndYearValid = true;
  let propertyType = get(
    state.screenConfiguration.preparedFinalObject,
    "Properties[0].propertyDetails.propertyType",
    ""
  )

  if (activeStep === PROPERTY_DETAILS_STEP) {
    const isPropertyInfoValid = validateFields(
      "components.div.children.formwizardFirstStepAllotment.children.propertyInfoDetails.children.cardContent.children.detailsContainer.children",
      state,
      dispatch,
      screenKey
    )
    
    const isAdditionalValid = validateFields(
      "components.div.children.formwizardFirstStepAllotment.children.additionalDetails.children.cardContent.children.detailsContainer.children",
      state,
      dispatch,
      screenKey
    )

    let propertyRegisteredTo = get(
      state.screenConfiguration.preparedFinalObject,
      "Properties[0].propertyDetails.propertyRegisteredTo",
      ""
    )

    dispatch(
      handleField(
        screenKey,
        "components.div.children.formwizardSeventhStepAllotment.children.reviewAllotmentDetails.children.cardContent.children.reviewPropertyInfo.children.cardContent.children.viewFour.children.entityType",
        "visible",
        propertyRegisteredTo == "ENTITY"
      )
    )

    dispatch(
      handleField(
        screenKey,
        `components.div.children.formwizardSixthStepAllotment`,
        "props.style",
        (propertyType == "PROPERTY_TYPE.LEASEHOLD") ? {pointerEvents: "auto", opacity: "1"} : {pointerEvents: "none", opacity: "0.5"}
      )
    )
    dispatch(
      handleField(
        screenKey,
        `components.div.children.formwizardSixthStepAllotment`,
        "props.style",
        (propertyType == "PROPERTY_TYPE.LEASEHOLD") ? {pointerEvents: "auto", opacity: "1"} : {pointerEvents: "none", opacity: "0.5"}
      )
    )

    dispatch(
      handleField(
        screenKey,
        `components.div.children.formwizardSeventhStepAllotment.children.reviewAllotmentDetails.children.cardContent.children.reviewPremiumAmount`,
        "visible",
        !!(propertyType == "PROPERTY_TYPE.LEASEHOLD")
      )
    )
    dispatch(
      handleField(
        screenKey,
        `components.div.children.formwizardSeventhStepAllotment.children.reviewAllotmentDetails.children.cardContent.children.reviewSecurity`,
        "visible",
        !!(propertyType == "PROPERTY_TYPE.LEASEHOLD")
      )
    )
    dispatch(
      handleField(
        screenKey,
        `components.div.children.formwizardSeventhStepAllotment.children.reviewAllotmentDetails.children.cardContent.children.reviewInterestDetails`,
        "visible",
        !!(propertyType == "PROPERTY_TYPE.LEASEHOLD")
      )
    )
    dispatch(
      handleField(
        screenKey,
        `components.div.children.formwizardSeventhStepAllotment.children.reviewAllotmentDetails.children.cardContent.children.reviewAdvanceRent`,
        "visible",
        !!(propertyType == "PROPERTY_TYPE.LEASEHOLD")
      )
    )

    if (isPropertyInfoValid && isAdditionalValid) {
      const res = await applyEstates(state, dispatch, activeStep, screenKey);
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
      screenKey
    )
    
    if (isAuctionValid) {
      const res = await applyEstates(state, dispatch, activeStep, screenKey);
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
          "components.div.children.formwizardThirdStepAllotment.children.companyDetails.children.cardContent.children.detailsContainer.children",
          state,
          dispatch,
          screenKey
        );

        isOwnerOrPartnerDetailsValid = setOwnersOrPartners(state, dispatch, "ownerDetails");

        if (isOwnerOrPartnerDetailsValid && isCompanyDetailsValid) {
          const res = await applyEstates(state, dispatch, activeStep, screenKey);
          if (!res) {
            return
          }
        } else {
          isFormValid = false;
        }
        break;
      case "ET.PARTNERSHIP_FIRM":
        var isFirmDetailsValid = validateFields(
          "components.div.children.formwizardThirdStepAllotment.children.firmDetails.children.cardContent.children.detailsContainer.children",
          state,
          dispatch,
          screenKey
        )

        isOwnerOrPartnerDetailsValid = setOwnersOrPartners(state, dispatch, "partnerDetails");

        if (isFirmDetailsValid && isOwnerOrPartnerDetailsValid) {
          const res = await applyEstates(state, dispatch, activeStep, screenKey);
          if (!res) {
            return
          }
        } else {
          isFormValid = false;
        }
        break;
      case "ET.PROPRIETORSHIP":
        var isFirmDetailsValid = validateFields(
          "components.div.children.formwizardThirdStepAllotment.children.firmDetails.children.cardContent.children.detailsContainer.children",
          state,
          dispatch,
          screenKey
        )
        var isProprietorshipDetailsValid = validateFields(
          "components.div.children.formwizardThirdStepAllotment.children.proprietorshipDetails.children.cardContent.children.detailsContainer.children",
          state,
          dispatch,
          screenKey
        )
        if (isFirmDetailsValid && isProprietorshipDetailsValid) {
          const res = await applyEstates(state, dispatch, activeStep, screenKey);
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
          const res = await applyEstates(state, dispatch, activeStep, screenKey);
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
    let propertyOwners = get(
      state.screenConfiguration.preparedFinalObject,
      "Properties[0].propertyDetails.owners"
    );

    let propertyOwnersTemp = get(
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

        const reviewDocuments = getReviewDocuments(true, screenKey, `PropertiesTemp[0].propertyDetails.owners[${i}].ownerDetails.reviewDocData`);
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

        const reviewCourtCaseDetails = getReviewCourtCase(true, i, 4, screenKey);
        set(
          state.screenConfiguration.screenConfig,
          `allotment.components.div.children.formwizardSeventhStepAllotment.children.reviewAllotmentDetails.children.cardContent.children.reviewCourtCaseDetails_${i}`,
          reviewCourtCaseDetails
        )
      }
    }

    if (isCourtCaseDetailsValid) {
      const res = await applyEstates(state, dispatch, activeStep, screenKey);
      if (!res) {
        return
      }
    } else {
      isFormValid = false;
    }
  }

  if (activeStep === PAYMENT_DETAILS_STEP) {
    if (propertyType == "PROPERTY_TYPE.LEASEHOLD") {
      const isPremiumAmountValid = validateFields(
        "components.div.children.formwizardSixthStepAllotment.children.premiumAmountDetails.children.cardContent.children.detailsContainer.children",
        state,
        dispatch,
        screenKey
      )
      const isGroundRentValid = validateFields(
        "components.div.children.formwizardSixthStepAllotment.children.groundRentDetails.children.cardContent.children.detailsContainer.children",
        state,
        dispatch,
        screenKey
      )
      const isLicenseFeeValid = validateFields(
        "components.div.children.formwizardSixthStepAllotment.children.licenseFeeDetails.children.cardContent.children.detailsContainer.children",
        state,
        dispatch,
        screenKey
      )
      const isSecurityDetailsValid = validateFields(
        "components.div.children.formwizardSixthStepAllotment.children.securityDetails.children.cardContent.children.detailsContainer.children",
        state,
        dispatch,
        screenKey
      )
      const isDemandValid = validateFields(
        "components.div.children.formwizardSixthStepAllotment.children.demandSelect.children.cardContent.children.detailsContainer.children",
        state,
        dispatch,
        screenKey
      )
      const isInterestDetailsValid = validateFields(
        "components.div.children.formwizardEighthStep.children.interestDetails.children.cardContent.children.detailsContainer.children",
        state,
        dispatch,
        screenKey
      )
      let installmentItems = get(
        state.screenConfiguration.screenConfig,
        "allotment.components.div.children.formwizardSixthStepAllotment.children.premiumAmountDetails.children.cardContent.children.installmentContainer.children.cardContent.children.detailsContainer.children.multipleInstallmentContainer.children.multipleInstallmentInfo.props.items"
      );
      const noOfMonths = get(
        state.screenConfiguration.preparedFinalObject, 
        "Properties[0].propertyDetails.paymentConfig.noOfMonths"
      )

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

          getReviewAllotmentMultipleSectionDetails(state, dispatch, screenKey, `components.div.children.formwizardSeventhStepAllotment.children.reviewAllotmentDetails.children.cardContent.children.reviewPremiumAmount.children.cardContent.children.viewInstallments`, "premiumAmount", installmentItems.length);
        }
      }

    const isGroundRent = get(state.screenConfiguration.preparedFinalObject, "Properties[0].propertyDetails.paymentConfig.isGroundRent")
    const _componentJsonPath = !!isGroundRent ? 
    "allotment.components.div.children.formwizardSixthStepAllotment.children.groundRentDetails.children.cardContent.children.rentContainer.children.cardContent.children.detailsContainer.children.multipleRentContainer.children.multipleRentInfo.props.items"
    : "allotment.components.div.children.formwizardSixthStepAllotment.children.licenseFeeDetails.children.cardContent.children.licenseFeeForYearContainer.children.cardContent.children.detailsContainer.children.multipleLicenseContainer.children.multipleLicenseInfo.props.items"
    const _components = get(
      state.screenConfiguration.screenConfig,
      _componentJsonPath
    );
    let rentItems = get(
      state.screenConfiguration.preparedFinalObject,
      `Properties[0].propertyDetails.paymentConfig.paymentConfigItems`,
      []
    )
    const reviewJsonPath = !!isGroundRent ? "components.div.children.formwizardSeventhStepAllotment.children.reviewAllotmentDetails.children.cardContent.children.reviewGroundRent.children.cardContent.children.viewRents" : "components.div.children.formwizardSeventhStepAllotment.children.reviewAllotmentDetails.children.cardContent.children.reviewLicenseFee.children.cardContent.children.viewLicenses";

    let securityAmount = rentItems[0].groundRentAmount * noOfMonths;

    dispatch(prepareFinalObject("Properties[0].propertyDetails.paymentConfig.securityAmount", securityAmount))

      const _cardName = !!isGroundRent ? "groundRent" : "licenseFee"

      if (_components && _components.length > 0) {
        for (var i = 0; i < _components.length; i++) {
          if (!_components[i].isDeleted) {
          var isRentDetailsValid = validateFields(
            `${_componentJsonPath}[${i}].item${i}.children.cardContent.children.rentCard.children`,
            state,
            dispatch
          )
          }
        }

        const filterRentArr = rentItems.filter(item => !item.isDeleted)
        rentItems = filterRentArr.map((item, index) => ({...item, groundRentStartMonth: !!index ? Number(filterRentArr[index-1].groundRentEndMonth) + 1 : 0, groundRentEndMonth: item.groundRentEndMonth, groundRentAmount: item.groundRentAmount}))

      const rentValidation = rentItems.filter(item => !item.groundRentAmount || !item.groundRentEndMonth)
      isRentDetailsValid = rentValidation.length === 0
      isStartAndEndYearValid = rentItems.every(item => item.groundRentEndMonth > item.groundRentStartMonth)
      if(!!isRentDetailsValid) {
        dispatch(prepareFinalObject("Properties[0].propertyDetails.paymentConfig.paymentConfigItems", rentItems))
        getReviewAllotmentMultipleSectionDetails(state, dispatch, screenKey, reviewJsonPath, _cardName, rentItems.length);
      }
    }
    const hasValidation = !!isGroundRent ? isPremiumAmountValid && isInstallmentDetailsValid && isGroundRentValid && isSecurityDetailsValid && isRentDetailsValid && isDemandValid && isInterestDetailsValid && isStartAndEndYearValid : isPremiumAmountValid && isInstallmentDetailsValid && isLicenseFeeValid && isSecurityDetailsValid && isRentDetailsValid && isDemandValid && isInterestDetailsValid && isStartAndEndYearValid
      if (hasValidation) {
        const res = await applyEstates(state, dispatch, activeStep, screenKey);
        if (!res) {
          return
        }
      } else {
        isFormValid = false;
      }
    }
  }

  if (activeStep === SUMMARY_STEP) {
    isFormValid = await applyEstates(state, dispatch, "", screenKey);
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
      changeStep(state, dispatch, screenKey);
    } 
    else if(!isStartAndEndYearValid) {
      let errorMessage = {
        labelName: "End Month should be greater than Start Month",
        labelKey: "ES_ERR_END_MONTH_START_MONTH"
      }
      dispatch(toggleSnackbar(true, errorMessage, "warning"));
    }
    else if (hasFieldToaster) {
      let errorMessage = {
        labelName: "Please fill all mandatory fields and upload the documents !",
        labelKey: "ES_ERR_FILL_MANDATORY_FIELDS_UPLOAD_DOCS"
      };
      switch (activeStep) {
        case PROPERTY_DETAILS_STEP:
        case AUCTION_DETAILS_STEP:
        case ENTITY_OWNER_DETAILS_STEP:
        case COURT_CASE_DETAILS_STEP:
        case PAYMENT_DETAILS_STEP:
          if (!!rentYearMismatch) {
            errorMessage = {
              labelName: "Start year for the succeeding rent entry should match the preceeding end year",
              labelKey: "ES_ERR_RENT_YEAR_MISMATCH"
            };
          }
          else if (!!licenseFeeYearMismatch) {
            errorMessage = {
              labelName: "Start year for the succeeding license fee entry should match the preceeding end year",
              labelKey: "ES_ERR_LICENSE_FEE_YEAR_MISMATCH"
            };
          }
          else {
            errorMessage = {
              labelName: "Please fill all mandatory fields, then do next !",
              labelKey: "ES_ERR_FILL_ESTATE_MANDATORY_FIELDS"
            };
          }
          break;
        case ENTITY_OWNER_DOCUMENT_UPLOAD_STEP:
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
    `allotment.components.div.children.formwizardThirdStepAllotment.children.${container}.children.cardContent.children.detailsContainer.children.multipleApplicantContainer.children.multipleApplicantInfo.props.items`
  );

  let isOwnerOrPartnerDetailsValid = true;

  if (propertyOwnersItems && propertyOwnersItems.length > 0) {
    for (var i = 0; i < propertyOwnersItems.length; i++) {
      if (typeof propertyOwnersItems[i].isDeleted !== "undefined") {
        continue;
      }
      isOwnerOrPartnerDetailsValid = validateFields(
        `components.div.children.formwizardThirdStepAllotment.children.${container}.children.cardContent.children.detailsContainer.children.multipleApplicantContainer.children.multipleApplicantInfo.props.items[${i}].item${i}.children.cardContent.children.ownerCard.children`,
        state,
        dispatch,
        screenKey
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
        `allotment.components.div.children.formwizardSeventhStepAllotment.children.reviewAllotmentDetails.children.cardContent.children.reviewOwnerDetails_${i}`,
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
  changeStep(state, dispatch, screenKey, "previous");
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