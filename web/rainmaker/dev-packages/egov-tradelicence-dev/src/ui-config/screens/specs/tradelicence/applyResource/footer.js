import {
  getLabel,
  dispatchMultipleFieldChangeAction
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { applyTradeLicense,getNextFinancialYearForRenewal, download, organizeLicenseData, getSearchResults } from "../../../../../ui-utils/commons";
import {
  getButtonVisibility,
  getCommonApplyFooter,
  setMultiOwnerForApply,
  setValidToFromVisibilityForApply,
  getDocList,
  setOwnerShipDropDownFieldChange,
  createEstimateData,
  validateFields,
  ifUserRoleExists,
  downloadAcknowledgementForm,
  downloadCertificateForm,
  prepareDocumentTypeObj,
  getCurrentFinancialYear
} from "../../utils";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import { getQueryArg, getFileUrlFromAPI, getFileUrl } from "egov-ui-framework/ui-utils/commons";
import { httpRequest } from "egov-ui-framework/ui-utils/api";
import {
  toggleSnackbar,
  prepareFinalObject
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import "./index.css";
import generateReceipt from "../../utils/receiptPdf";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import get from "lodash/get";
import set from "lodash/set";
import some from "lodash/some";
import { documentList } from "./documentList";
import { getUserInfo } from "egov-ui-kit/utils/localStorageUtils";
import { handleScreenConfigurationFieldChange as handleField } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { LICENSE_DHOBI_GHAT, RENEWAL_RENT_DEED_SHOP, RC_PEDAL_RICKSHAW_LOADING_REHRI, DL_PEDAL_RICKSHAW_LOADING_REHRI } from "../../../../../ui-constants"
import { getReviewDetails } from "./review-trade";

const userInfo = JSON.parse(getUserInfo());

const DEFAULT_STEP = -1;
const TRADE_DETAILS_STEP = 0;
const DOCUMENT_UPLOAD_STEP = 1;
const SUMMARY_STEP = 2;

const tradeLicenseType = getQueryArg(window.location.href, "tlType");

const moveToSuccess = (LicenseData, dispatch) => {
  const applicationNo = get(LicenseData, "applicationNumber");
  const tenantId = get(LicenseData, "tenantId");
  const financialYear = get(LicenseData, "financialYear");
  const purpose = "apply";
  const status = "success";
  dispatch(
    setRoute(
      `/tradelicence/acknowledgement?purpose=${purpose}&status=${status}&applicationNumber=${applicationNo}&FY=${financialYear}&tenantId=${tenantId}`
    )
  );
};

const editRenewalMoveToSuccess = (LicenseData, dispatch) => {
  const applicationNo = get(LicenseData, "applicationNumber");
  const tenantId = get(LicenseData, "tenantId");
  const financialYear = get(LicenseData, "financialYear");
  const licenseNumber = get(LicenseData, "licenseNumber");
  const purpose = "EDITRENEWAL";
  const status = "success";
  dispatch(
    setRoute(
      `/tradelicence/acknowledgement?purpose=${purpose}&status=${status}&applicationNumber=${applicationNo}&licenseNumber=${licenseNumber}&FY=${financialYear}&tenantId=${tenantId}`
    )
  );
};


export const generatePdfFromDiv = (action, applicationNumber) => {
  let target = document.querySelector("#custom-atoms-div");
  html2canvas(target, {
      onclone: function (clonedDoc) {
          // clonedDoc.getElementById("custom-atoms-footer")[
          //   "data-html2canvas-ignore"
          // ] = "true";
          clonedDoc.getElementById("custom-atoms-footer").style.display = "none";
      }
  }).then(canvas => {
      var data = canvas.toDataURL("image/jpeg", 1);
      var imgWidth = 200;
      var pageHeight = 295;
      var imgHeight = (canvas.height * imgWidth) / canvas.width;
      var heightLeft = imgHeight;
      var doc = new jsPDF("p", "mm");
      var position = 0;

      doc.addImage(data, "PNG", 5, 5 + position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
          position = heightLeft - imgHeight;
          doc.addPage();
          doc.addImage(data, "PNG", 5, 5 + position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
      }
      if (action === "download") {
          doc.save(`preview-${applicationNumber}.pdf`);
      } else if (action === "print") {
          doc.autoPrint();
          window.open(doc.output("bloburl"), "_blank");
      }
  });
};

const setDocumentTypes = (state, code) => {
  const tradeType = get(state.screenConfiguration.preparedFinalObject, "applyScreenMdmsData.TradeLicense.MdmsTradeType");
  let applicationType = get(
    state.screenConfiguration.screenConfig["apply"],
    "components.div.children.formwizardFirstStep.children.tradeDetails.children.cardContent.children.detailsContainer.children.applicationType.props.value",
    "New"
  );
  const documentTypes = tradeType.find(item => item.code === code)
  .applicationDocument.find(item => item.applicationType === applicationType)
  .documentList;
  return documentTypes;
}

export const callBackForNext = async (state, dispatch) => {
  let activeStep = get(
      state.screenConfiguration.screenConfig["apply"],
      "components.div.children.stepper.props.activeStep",
      0
  );
  // console.log(activeStep);
  let isFormValid = true;
  let hasFieldToaster = true;
  let ageFieldError = false;
  if (activeStep === TRADE_DETAILS_STEP) {
      const data = get(state.screenConfiguration, "preparedFinalObject");
      // setOwnerShipDropDownFieldChange(state, dispatch, data);

      // Set prepopulated mobile number field after screen init
      let mobileNumber = get(
        state.screenConfiguration.screenConfig["apply"],
        "components.div.children.formwizardFirstStep.children.ownerDetails.children.cardContent.children.detailsContainer.children.mobileNumber.props.value",
        userInfo.userName
      );
      const licenseType = get(
        state.screenConfiguration.preparedFinalObject,
        "Licenses[0].businessService",
        ""
      )
      dispatch(
        handleField(
            "apply",
            "components.div.children.formwizardFirstStep.children.ownerDetails.children.cardContent.children.detailsContainer.children.mobileNumber",
            "props.value",
            mobileNumber
        )
      );

      if (userInfo.emailId) {
        // Set prepopulated email id field after screen init
        let emailId = get(
          state.screenConfiguration.screenConfig["apply"],
          "components.div.children.formwizardFirstStep.children.ownerDetails.children.cardContent.children.detailsContainer.children.emailAddress.props.value",
          userInfo.emailId
        );
        dispatch(
          handleField(
              "apply",
              "components.div.children.formwizardFirstStep.children.ownerDetails.children.cardContent.children.detailsContainer.children.emailAddress",
              "props.value",
              emailId
          )
        );
      }

      const isTradeDetailsValid = validateFields(
          "components.div.children.formwizardFirstStep.children.tradeDetails.children.cardContent.children.detailsContainer.children",
          state,
          dispatch
      );
      const isOwnerDetailsValid = validateFields(
        "components.div.children.formwizardFirstStep.children.ownerDetails.children.cardContent.children.detailsContainer.children",
          state,
          dispatch
      )
      if (!!isTradeDetailsValid && !!isOwnerDetailsValid) {
          const age = get(state.screenConfiguration.preparedFinalObject, "Licenses[0].tradeLicenseDetail.owners[0].age")
          if(age < 18) {
            isFormValid = false;
            ageFieldError = true
          } 
           else {
            let isRenewable;
            const applicationType = get(state.screenConfiguration.preparedFinalObject, "Licenses[0].applicationType");
            if(applicationType === "Renew") {
            const oldLicenseNumber = get(state.screenConfiguration.preparedFinalObject, "Licenses[0].oldLicenseNumber")
            const appliationNumber = get(state.screenConfiguration.preparedFinalObject, "Licenses[0].applicationNumber")
            const tenantId = getQueryArg(window.location.href, "tenantId");
            const queryObj = [
              {
                key: "tenantId",
                value: tenantId
              },
              {
                key:"oldLicenseNumber",
                value: oldLicenseNumber
              }
            ]

          const applicationsData = await getSearchResults(queryObj);
          isRenewable = !!applicationsData && !!applicationsData.Licenses && applicationsData.Licenses.filter(item => (item.status !== "REJECTED" && item.status !== "APPROVED") && (!!appliationNumber ? appliationNumber !==item.applicationNumber : true));
          isRenewable = !isRenewable.length
          } else {
            isRenewable = true
          }
          if(isRenewable) {
            await getDocList(state, dispatch, licenseType);
            getReviewDetails(state, dispatch, "apply", "components.div.children.formwizardFourthStep.children.tradeReviewDetails.children.cardContent.children.reviewTradeDetails.children.cardContent.children.viewOne", "components.div.children.formwizardFourthStep.children.tradeReviewDetails.children.cardContent.children.reviewOwnerDetails.children.cardContent.children.viewOne", true)
            const response = await applyTradeLicense(state, dispatch, activeStep);
            if(!!response) {
              isFormValid = true;
              dispatch(
                handleField(
                  "apply",
                  "components.div.children.formwizardFirstStep.children.tradeDetails.children.cardContent.children.detailsContainer.children.licenseType.props",
                  "disabled",
                  true
                )
              );
              dispatch(
                handleField(
                  "apply",
                  "components.div.children.formwizardFirstStep.children.tradeDetails.children.cardContent.children.detailsContainer.children.serviceType.props",
                  "disabled",
                  true
                )
              );
            } else {
              return
              // isFormValid = false;
            }
          } else {
            dispatch(
              toggleSnackbar(
                true,
                { labelName: "An Application with same old licence number is already in progress.", labelKey: "TL_APPLICATION_ALREADY_IN_PROGRESS" },
                "error"
              )
            );
            return;
          }
          }
      }
      else {
        isFormValid = false;
      }
  }
  if (activeStep === DOCUMENT_UPLOAD_STEP) {
      const LicenseData = get(
          state.screenConfiguration.preparedFinalObject,
          "Licenses[0]",
          {}
      );
      const uploadedDocData = get(
          state.screenConfiguration.preparedFinalObject,
          "Licenses[0].tradeLicenseDetail.applicationDocuments",
          []
      );

      const uploadedTempDocData = get(
          state.screenConfiguration.preparedFinalObject,
          "LicensesTemp[0].applicationDocuments",
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

      if (isFormValid) {
          if (getQueryArg(window.location.href, "action") === "edit") {
              //EDIT FLOW
              const businessId = getQueryArg(
                  window.location.href,
                  "applicationNumber"
              );
              const tenantId = getQueryArg(window.location.href, "tenantId");
              dispatch(
                  setRoute(
                      `/tradelicence/search-preview?applicationNumber=${businessId}&tenantId=${tenantId}&edited=true`
                  )
              );
              const updateMessage = {
                  labelName: "Rates will be updated on submission",
                  labelKey: "TL_COMMON_EDIT_UPDATE_MESSAGE"
              };
              dispatch(toggleSnackbar(true, updateMessage, "info"));
          }
          const reviewDocData =
              uploadedDocData &&
              uploadedDocData.map(item => {
                  return {
                      title: `TL_${item.documentType}`,
                      link: item.fileUrl && item.fileUrl.split(",")[0],
                      linkText: "Download",
                      name: item.fileName
                  };
              });
          createEstimateData(
              LicenseData,
              "LicensesTemp[0].estimateCardData",
              dispatch
          ); //get bill and populate estimate card
          dispatch(
              prepareFinalObject("LicensesTemp[0].reviewDocData", reviewDocData)
          );
      }
  }
  if (activeStep === SUMMARY_STEP) {
      const LicenseData = get(
          state.screenConfiguration.preparedFinalObject,
          "Licenses[0]"
      );
      isFormValid = await applyTradeLicense(state, dispatch);
      if (isFormValid) {
          moveToSuccess(LicenseData, dispatch);
      }
  }
  if (activeStep !== SUMMARY_STEP) {
      if (isFormValid) {
          changeStep(state, dispatch);
      } else if (hasFieldToaster) {
          let errorMessage = {
              labelName:
                  "Please fill all mandatory fields and upload the documents !",
              labelKey: "ERR_FILL_MANDATORY_FIELDS_UPLOAD_DOCS"
          };
          if(!!ageFieldError) {
            errorMessage = {
              labelName:
                  "Age should not be less than 18",
              labelKey: "ERR_AGE_FIELD"
          };
          } else {
            switch (activeStep) {
                case TRADE_DETAILS_STEP:
                    errorMessage = {
                        labelName:
                            "Please fill all mandatory fields for Trade Details, then do next !",
                        labelKey: "ERR_FILL_TRADE_MANDATORY_FIELDS"
                    };
                    break;
                case DOCUMENT_UPLOAD_STEP:
                    errorMessage = {
                        labelName: "Please upload all the required documents !",
                        labelKey: "ERR_UPLOAD_REQUIRED_DOCUMENTS"
                    };
                    break;
            }
          }
          dispatch(toggleSnackbar(true, errorMessage, "warning"));
      }
  }
};

export const changeStep = (
  state,
  dispatch,
  mode = "next",
  defaultActiveStep = -1
) => {
  let activeStep = get(
      state.screenConfiguration.screenConfig["apply"],
      "components.div.children.stepper.props.activeStep",
      0
  );
  if (defaultActiveStep === DEFAULT_STEP) {
      if (activeStep === SUMMARY_STEP && mode === "next") {
          const isDocsUploaded = get(
              state.screenConfiguration.preparedFinalObject,
              "LicensesTemp[0].reviewDocData",
              null
          );
          activeStep = isDocsUploaded ? SUMMARY_STEP : DOCUMENT_UPLOAD_STEP;
      } else {
          activeStep = mode === "next" ? activeStep + 1 : activeStep - 1;
      }
  } else {
      activeStep = defaultActiveStep;
  }

  const isPreviousButtonVisible = activeStep > TRADE_DETAILS_STEP ? true : false;
  const isNextButtonVisible = activeStep < SUMMARY_STEP ? true : false;
  const isPayButtonVisible = activeStep === SUMMARY_STEP ? true : false;
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
  dispatchMultipleFieldChangeAction("apply", actionDefination, dispatch);
  renderSteps(activeStep, dispatch);
};

export const renderSteps = (activeStep, dispatch) => {
  switch (activeStep) {
      case TRADE_DETAILS_STEP:
          dispatchMultipleFieldChangeAction(
              "apply",
              getActionDefinationForStepper(
                  "components.div.children.formwizardFirstStep"
              ),
              dispatch
          );
          break;
      // case 1:
      //   dispatchMultipleFieldChangeAction(
      //     "apply",
      //     getActionDefinationForStepper(
      //       "components.div.children.formwizardSecondStep"
      //     ),
      //     dispatch
      //   );
      //   break;
      case DOCUMENT_UPLOAD_STEP:
          dispatchMultipleFieldChangeAction(
              "apply",
              getActionDefinationForStepper(
                  "components.div.children.formwizardThirdStep"
              ),
              dispatch
          );
          break;
      default:
          dispatchMultipleFieldChangeAction(
              "apply",
              getActionDefinationForStepper(
                  "components.div.children.formwizardFourthStep"
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
      // {
      //   path: "components.div.children.formwizardSecondStep",
      //   property: "visible",
      //   value: false
      // },
      {
          path: "components.div.children.formwizardThirdStep",
          property: "visible",
          value: false
      },
      {
          path: "components.div.children.formwizardFourthStep",
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
  changeStep(state, dispatch, "previous");
};

export const footer = getCommonApplyFooter({
  previousButton: {
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
    onClickDefination: {
      action: "condition",
      callBack: callBackForNext
    },
    visible: false
  }
});

export const renewTradelicence  = async (financialYear,state,dispatch) => {
  const licences = get(
    state.screenConfiguration.preparedFinalObject,
    `Licenses`
  );
  const tenantId= get(licences[0] , "tenantId");

    const queryObj = [
      {
        key: "tenantId",
        value: tenantId
      },
      {
        key:"oldLicenseNumber",
        value: licences[0].licenseNumber
      }
    ]

  const applicationsData = await getSearchResults(queryObj);
  const isRenewable = !!applicationsData && !!applicationsData.Licenses && applicationsData.Licenses.filter(item => item.status !== "REJECTED" && item.status !== "APPROVED");

 if(!isRenewable.length) {
  const nextFinancialYear = await getNextFinancialYearForRenewal(financialYear);
  let applicationDocuments = licences[0].tradeLicenseDetail.applicationDocuments
  const payload = {
    applicationType: "Renew",
    financialYear: nextFinancialYear,
    licenseType: licences[0].licenseType,
    action:"INITIATE",
    workflowCode: licences[0].workflowCode,
    tradeLicenseDetail: {
      structureType: licences[0].tradeLicenseDetail.structureType,
      subOwnerShipCategory: licences[0].tradeLicenseDetail.subOwnerShipCategory,
      tradeUnits: licences[0].tradeLicenseDetail.tradeUnits,
      applicationDocuments: null,
      address: licences[0].tradeLicenseDetail.address,
      additionalDetail: {...licences[0].tradeLicenseDetail.additionalDetail, oldLicenseValidTo: licences[0].validTo},
      owners: licences[0].tradeLicenseDetail.owners
    },
    tenantId,
    businessService: licences[0].businessService,
    oldLicenseNumber: licences[0].licenseNumber
  }

  const response = await httpRequest(
    "post",
    "/tl-services/v1/_create",
    "",
    [],
    { Licenses: [payload] }
  );
  let {Licenses} = response
  Licenses = organizeLicenseData(Licenses)
   let fileStoreIds =
    applicationDocuments &&
    applicationDocuments.map(item => item.fileStoreId).join(",");
  const fileUrlPayload =
    fileStoreIds && (await getFileUrlFromAPI(fileStoreIds));
    const updatedDocuments = applicationDocuments.map((item, index) => {
      return {
        fileName:
            (fileUrlPayload &&
              fileUrlPayload[item.fileStoreId] &&
              decodeURIComponent(
                getFileUrl(fileUrlPayload[item.fileStoreId])
                  .split("?")[0]
                  .split("/")
                  .pop()
                  .slice(13)
              )) ||
            `Document - ${index + 1}`,
          fileStoreId: item.fileStoreId,
          fileUrl: Object.values(fileUrlPayload)[index],
          documentType: item.documentType,
          tenantId: item.tenantId,
      }
    })
   const _licenses = [{...Licenses[0], action: "REINITIATE", tradeLicenseDetail: {...Licenses[0].tradeLicenseDetail, applicationDocuments: updatedDocuments}}]
  const updateResponse = await httpRequest("post", "/tl-services/v1/_update", "", [], {
    Licenses: _licenses
  })
  dispatch(prepareFinalObject("Licenses", updateResponse.Licenses));
  createEstimateData(
    updateResponse.Licenses[0],
    "LicensesTemp[0].estimateCardData",
    dispatch
);
const route = `/tradelicense-citizen/apply?applicationNumber=${updateResponse.Licenses[0].applicationNumber}&tenantId=${tenantId}`
  dispatch(setRoute(route));
  dispatch(
    handleField(
        "apply",
        "components.div.children.stepper",
        "props.activeStep",
        2
    )
);
dispatch(
  handleField(
      "apply",
      "components.div.children.formwizardFirstStep",
      "visible",
      false
  )
);
dispatch(
  handleField(
      "apply",
      "components.div.children.formwizardThirdStep",
      "visible",
      false
  )
);
dispatch(
  handleField(
      "apply",
      "components.div.children.formwizardFourthStep",
      "visible",
      true
  )
);
dispatch(
  handleField(
    "apply",
    "components.div.children.formwizardFirstStep.children.tradeDetails.children.cardContent.children.detailsContainer.children.oldLicenseNumber.props",
    "disabled",
    true
  )
);
dispatch(
  handleField(
    "apply",
    "components.div.children.formwizardFirstStep.children.tradeDetails.children.cardContent.children.detailsContainer.children.oldLicenseValidTo.props",
    "disabled",
    true
  )
);

dispatch(
  handleField(
    "apply",
    "components.div.children.footer.children.nextButton",
    "visible",
    false
  )
);

dispatch(
  handleField(
    "apply",
    "components.div.children.footer.children.payButton",
    "visible",
    true
  )
);
  } else {
    dispatch(
      toggleSnackbar(
        true,
        { labelName: "An Application is already in progress.", labelKey: "TL_APPLICATION_ALREADY_IN_PROGRESS" },
        "error"
      )
    );
  }
};

export const footerReview = (
  action,
  state,
  dispatch,
  status,
  applicationNumber,
  tenantId,
  financialYear,
  tlType
) => {
  /** MenuButton data based on status */
  let licenseNumber= get(state.screenConfiguration.preparedFinalObject.Licenses[0], "licenseNumber")
  const responseLength = get(
    state.screenConfiguration.preparedFinalObject,
    `licenseCount`,
    1
  );

  return getCommonApplyFooter({
    container: {
      uiFramework: "custom-atoms",
      componentPath: "Container",
      children: {
        rightdiv: {
          uiFramework: "custom-atoms",
          componentPath: "Div",
          props: {
           
            style: {
            float:"right",
            display:"flex"
            }
          },
          children: {
           
            resubmitButton: {
              componentPath: "Button",
              props: {
                variant: "contained",
                color: "primary",
                style: {
                  minWidth: "180px",
                  height: "48px",
                  marginRight: "45px"
                }
              },
              children: {
                nextButtonLabel: getLabel({
                  labelName: "RESUBMIT",
                  labelKey: "TL_RESUBMIT"
                })
              },
              onClickDefination: {
                action: "condition",
                callBack: openPopup
              },
              visible:getButtonVisibility(status, "RESUBMIT"),
              roleDefination: {
                rolePath: "user-info.roles",
                roles: ["TL_CEMP", "CITIZEN"]
              }
            },
            completeSubmission: {
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
                nextButtonLabel: getLabel({
                  labelName: "Complete Submission",
                  labelKey: "TL_COMMON_BUTTON_CITIZEN_COMPLETE_SUBMISSION"
                })
              },
              onClickDefination: {
                action: "condition",
                callBack: () => {
                  // dispatch(
                  //   setRoute(
                  //    `/tradelicense-citizen/apply?applicationNumber=${applicationNumber}&tenantId=${tenantId}&tlType=${tlType}`
                  //   )
                  // );
                  window.location.href = `${process.env.NODE_ENV === "production" ? "/citizen" : ""}/tradelicense-citizen/apply?applicationNumber=${applicationNumber}&tenantId=${tenantId}&tlType=${tlType}`
                },
              },
              visible:getButtonVisibility(status, "SUBMISSION"),
            },  
            editButton: {
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
                  labelName: "Edit for Renewal",
                  labelKey: "TL_RENEWAL_BUTTON_EDIT"
                })
              },
              onClickDefination: {
                action: "condition",
                callBack: () => {
                  /* dispatch(
                     setRoute(
                     // `/tradelicence/acknowledgement?purpose=${purpose}&status=${status}&applicationNumber=${applicationNo}&FY=${financialYear}&tenantId=${tenantId}`
                     `/tradelicense-citizen/apply?applicationNumber=${applicationNumber}&licenseNumber=${licenseNumber}&tenantId=${tenantId}&action=EDITRENEWAL`
                    ) 
                  ); */
                  window.location.href = `${process.env.NODE_ENV === "production" ? "/citizen" : ""}/tradelicense-citizen/apply?applicationNumber=${applicationNumber}&licenseNumber=${licenseNumber}&tenantId=${tenantId}&action=EDITRENEWAL&tlType=${tlType}`
                },

              },
              visible: false
              // visible:(getButtonVisibility(status, "APPROVED")||getButtonVisibility(status, "EXPIRED"))&&(responseLength === 1 ),
            },
            submitButton: {
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
                  labelName: "Submit for Renewal",
                  labelKey: "TL_TYPE_RENEWAL"
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
                callBack: () => {
                  renewTradelicence(financialYear, state,dispatch);
                },

              },
              visible:(getButtonVisibility(status, "APPROVED")||getButtonVisibility(status, "EXPIRED"))&&(responseLength === 1 ),
            },    
            makePayment: {
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
                  labelName: "MAKE PAYMENT",
                  labelKey: "COMMON_MAKE_PAYMENT"
                })
              },
              onClickDefination: {
                action: "condition",
                callBack: () => {
                  dispatch(
                    setRoute(
                     `/tradelicense-citizen/pay?consumerCode=${applicationNumber}&tenantId=${tenantId}`
                    )
                  );
                },

              },
              visible: process.env.REACT_APP_NAME === "Citizen" && getButtonVisibility(status, "PENDINGPAYMENT") ? true : false
            }
          },
          gridDefination: {
            xs: 12,
            sm: 12
          }
        },     
      }
    }
  });
};

export const footerReviewTop = (
  action,
  state,
  dispatch,
  status,
  applicationNumber,
  tenantId,
  financialYear
) => {
  /** MenuButton data based on status */
  let downloadMenu = [];
  let printMenu = [];
  let licenseNumber= get(state.screenConfiguration.preparedFinalObject.Licenses[0], "licenseNumber")
  const responseLength = get(
    state.screenConfiguration.preparedFinalObject,
    `licenseCount`,
    1
  );
  function data() {
  let data1 = get(
    state.screenConfiguration.preparedFinalObject,
    "applicationDataForReceipt",
    {}
  );
  let data2 = get(
    state.screenConfiguration.preparedFinalObject,
    "receiptDataForReceipt",
    {}
  );
  let data3 = get(
    state.screenConfiguration.preparedFinalObject,
    "mdmsDataForReceipt",
    {}
  );
  let data4 = get(
    state.screenConfiguration.preparedFinalObject,
    "userDataForReceipt",
    {}
  );
  return {...data1, ...data2, ...data3, ...data4}
  }
  // let renewalMenu=[];
  let tlCertificateDownloadObject = {
    label: { labelName: "TL Certificate", labelKey: "TL_CERTIFICATE" },
    link: () => {
      const { Licenses, LicensesTemp } = state.screenConfiguration.preparedFinalObject;
      const documents = LicensesTemp[0].reviewDocData;
      set(Licenses[0],"additionalDetails.documents",documents)
      downloadCertificateForm(Licenses, data());
    },
    leftIcon: "book"
  };
  let tlCertificatePrintObject = {
    label: { labelName: "TL Certificate", labelKey: "TL_CERTIFICATE" },
    link: () => {
      const { Licenses, LicensesTemp } = state.screenConfiguration.preparedFinalObject;
      const documents = LicensesTemp[0].reviewDocData;
      set(Licenses[0],"additionalDetails.documents",documents)
      downloadCertificateForm(Licenses, data(), 'print');
    },
    leftIcon: "book"
  };
  let receiptDownloadObject = {
    label: { labelName: "Receipt", labelKey: "TL_RECEIPT" },
    link: () => {

      const Licenses = get(state.screenConfiguration.preparedFinalObject, "Licenses", []);
      const receiptQueryString = [
        { key: "consumerCodes", value: get(state.screenConfiguration.preparedFinalObject.Licenses[0], "applicationNumber") },
        { key: "tenantId", value: get(state.screenConfiguration.preparedFinalObject.Licenses[0], "tenantId") }
      ]
      download(receiptQueryString, Licenses, data(), userInfo.name);
      // generateReceipt(state, dispatch, "receipt_download");
    },
    leftIcon: "receipt"
  };
  let receiptPrintObject = {
    label: { labelName: "Receipt", labelKey: "TL_RECEIPT" },
    link: () => {
      const receiptQueryString =  [
        { key: "consumerCodes", value: get(state.screenConfiguration.preparedFinalObject.Licenses[0], "applicationNumber") },
        { key: "tenantId", value: get(state.screenConfiguration.preparedFinalObject.Licenses[0], "tenantId") }
      ]
      const { Licenses } = state.screenConfiguration.preparedFinalObject;
      download(receiptQueryString,Licenses, data(), userInfo.name, "print");
     // generateReceipt(state, dispatch, "receipt_print");
    },
    leftIcon: "receipt"
  };
  let applicationDownloadObject = {
    label: { labelName: "Application", labelKey: "TL_APPLICATION" },
    link: () => {
      const { Licenses ,LicensesTemp} = state.screenConfiguration.preparedFinalObject;
      const documents = LicensesTemp[0].reviewDocData;
      set(Licenses[0],"additionalDetails.documents",documents)
      downloadAcknowledgementForm(Licenses, LicensesTemp[0].estimateCardData);
    },
    leftIcon: "assignment"
  };
  let applicationPrintObject = {
    label: { labelName: "Application", labelKey: "TL_APPLICATION" },
    link: () => {
      const { Licenses,LicensesTemp } = state.screenConfiguration.preparedFinalObject;
      const documents = LicensesTemp[0].reviewDocData;
      set(Licenses[0],"additionalDetails.documents",documents)
      downloadAcknowledgementForm(Licenses, LicensesTemp[0].estimateCardData,'print');
    },
    leftIcon: "assignment"
  };
  
  switch (status) {
    case "APPROVED":
      downloadMenu = [
        tlCertificateDownloadObject,
        receiptDownloadObject,
        applicationDownloadObject
      ];
      printMenu = [
        tlCertificatePrintObject,
        receiptPrintObject,
        applicationPrintObject
      ];
      break;
    case "PENDINGCLARIFICATION":
    case "MODIFIED":
    case "APPLIED":
    case "CITIZENACTIONREQUIRED":
    case "PENDINGPAYMENT":
    case "PENDINGL1VERIFICATION":
    case "PENDINGL2VERIFICATION":
    case "PENDINGL3VERIFICATION":
    case "CANCELLED":
    case "REJECTED":
      downloadMenu = [applicationDownloadObject];
      printMenu = [applicationPrintObject];
      break;
    case "PENDINGAPPROVAL":
      // downloadMenu = [receiptDownloadObject, applicationDownloadObject];
      // printMenu = [receiptPrintObject, applicationPrintObject];
      downloadMenu = [applicationDownloadObject];
      printMenu = [applicationPrintObject];
      break;
    default:
      break;
  }
  /** END */

  return {
    rightdiv: {
      uiFramework: "custom-atoms",
      componentPath: "Div",
      props: {
        style: { textAlign: "right", display: "flex" }
      },
      children: {
        downloadMenu: {
          uiFramework: "custom-atoms-local",
          moduleName: "egov-tradelicence",
          componentPath: "MenuButton",
          props: {
            data: {
              label: {labelName : "DOWNLOAD" , labelKey :"TL_DOWNLOAD"},
               leftIcon: "cloud_download",
              rightIcon: "arrow_drop_down",
              props: { variant: "outlined", style: { height: "60px", color : "#FE7A51" }, className: "tl-download-button" },
              menu: downloadMenu
            }
          }
        },
        printMenu: {
          uiFramework: "custom-atoms-local",
          moduleName: "egov-tradelicence",
          componentPath: "MenuButton",
          props: {
            data: {
              label: {labelName : "PRINT" , labelKey :"TL_PRINT"},
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

export const openPopup = (state, dispatch) => {
  dispatch(
    prepareFinalObject("ResubmitAction", true)
  );
}

export const downloadPrintContainer = (
  action,
  state,
  dispatch,
  status,
  applicationNumber,
  tenantId
) => {
  /** MenuButton data based on status */
  let downloadMenu = [];
  let printMenu = [];
  const data = function() {
    let data1 = get(
      state.screenConfiguration.preparedFinalObject,
      "applicationDataForReceipt",
      {}
    );
    let data2 = get(
      state.screenConfiguration.preparedFinalObject,
      "receiptDataForReceipt",
      {}
    );
    let data3 = get(
      state.screenConfiguration.preparedFinalObject,
      "mdmsDataForReceipt",
      {}
    );
    let data4 = get(
      state.screenConfiguration.preparedFinalObject,
      "userDataForReceipt",
      {}
    );
    return {...data1, ...data2, ...data3, ...data4}
  }
  let tlCertificateDownloadObject = {
    label: { labelName: "TL Certificate", labelKey: "TL_CERTIFICATE" },
    link: () => {
      const { Licenses, LicensesTemp } = state.screenConfiguration.preparedFinalObject;
      const documents = LicensesTemp[0].reviewDocData;
      set(Licenses[0],"additionalDetails.documents",documents)
      downloadCertificateForm(Licenses, data());
    },
    leftIcon: "book"
  };
  let tlCertificatePrintObject = {
    label: { labelName: "TL Certificate", labelKey: "TL_CERTIFICATE" },
    link: () => {
      const { Licenses, LicensesTemp } = state.screenConfiguration.preparedFinalObject;
      const documents = LicensesTemp[0].reviewDocData;
      set(Licenses[0],"additionalDetails.documents",documents)
      downloadCertificateForm(Licenses, data(), 'print');
    },
    leftIcon: "book"
  };
  let receiptDownloadObject = {
    label: { labelName: "Receipt", labelKey: "TL_RECEIPT" },
    link: () => {
      const receiptQueryString = [
        { key: "consumerCodes", value: get(state.screenConfiguration.preparedFinalObject.Licenses[0], "applicationNumber") },
        { key: "tenantId", value: get(state.screenConfiguration.preparedFinalObject.Licenses[0], "tenantId") }
      ]
      const { Licenses } = state.screenConfiguration.preparedFinalObject;
      download(receiptQueryString, Licenses, data(), userInfo.name);
    },
    leftIcon: "receipt"
  };
  let receiptPrintObject = {
    label: { labelName: "Receipt", labelKey: "TL_RECEIPT" },
    link: () => {
      const receiptQueryString =  [
        { key: "consumerCodes", value: get(state.screenConfiguration.preparedFinalObject.Licenses[0], "applicationNumber") },
        { key: "tenantId", value: get(state.screenConfiguration.preparedFinalObject.Licenses[0], "tenantId") }
      ]
      const { Licenses } = state.screenConfiguration.preparedFinalObject;
      download(receiptQueryString, Licenses, data(), userInfo.name, "print");
    },
    leftIcon: "receipt"
  };
  let applicationDownloadObject = {
    label: { labelName: "Application", labelKey: "TL_APPLICATION" },
    link: () => {
      const { Licenses,LicensesTemp } = state.screenConfiguration.preparedFinalObject;
      const documents = LicensesTemp[0].reviewDocData;
      set(Licenses[0],"additionalDetails.documents",documents)
      downloadAcknowledgementForm(Licenses, LicensesTemp[0].estimateCardData);
    },
    leftIcon: "assignment"
  };
  let applicationPrintObject = {
    label: { labelName: "Application", labelKey: "TL_APPLICATION" },
    link: () => {
      const { Licenses,LicensesTemp } = state.screenConfiguration.preparedFinalObject;
      const documents = LicensesTemp[0].reviewDocData;
      set(Licenses[0],"additionalDetails.documents",documents)
      downloadAcknowledgementForm(Licenses, LicensesTemp[0].estimateCardData,'print');
    },
    leftIcon: "assignment"
  };
  switch (status) {
    case "APPROVED":
      downloadMenu = [
        tlCertificateDownloadObject,
        receiptDownloadObject,
        applicationDownloadObject
      ];
      printMenu = [
        tlCertificatePrintObject,
        receiptPrintObject,
        applicationPrintObject
      ];
      break;
    case "APPLIED":
    case "CITIZENACTIONREQUIRED":
    case "PENDINGPAYMENT":
    case "PENDINGL1VERIFICATION":
    case "PENDINGL2VERIFICATION":
    case "PENDINGL3VERIFICATION":
    case "CANCELLED":
    case "REJECTED":
      downloadMenu = [applicationDownloadObject];
      printMenu = [applicationPrintObject];
      break;
    case "PENDINGAPPROVAL":
      // downloadMenu = [receiptDownloadObject, applicationDownloadObject];
      // printMenu = [receiptPrintObject, applicationPrintObject];
      downloadMenu = [applicationDownloadObject];
      printMenu = [applicationPrintObject];
      break;
    default:
      break;
  }
  /** END */

  return {
    rightdiv: {
      uiFramework: "custom-atoms",
      componentPath: "Div",
      props: {
        style: { textAlign: "right", display: "flex" }
      },
      children: {
        downloadMenu: {
          uiFramework: "custom-atoms-local",
          moduleName: "egov-tradelicence",
          componentPath: "MenuButton",
          props: {
            data: {
              label: {labelName : "DOWNLOAD" , labelKey :"TL_DOWNLOAD"},
               leftIcon: "cloud_download",
              rightIcon: "arrow_drop_down",
              props: { variant: "outlined", style: { height: "60px", color : "#FE7A51" }, className: "tl-download-button" },
              menu: downloadMenu
            }
          }
        },
        printMenu: {
          uiFramework: "custom-atoms-local",
          moduleName: "egov-tradelicence",
          componentPath: "MenuButton",
          props: {
            data: {
              label: {labelName : "PRINT" , labelKey :"TL_PRINT"},
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