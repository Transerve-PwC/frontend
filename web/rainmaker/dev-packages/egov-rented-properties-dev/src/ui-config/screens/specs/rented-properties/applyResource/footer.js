import { getCommonApplyFooter, validateFields,downloadAcknowledgementForm ,download} from "../../utils";
import { getLabel, dispatchMultipleFieldChangeAction } from "egov-ui-framework/ui-config/screens/specs/utils";
import { toggleSnackbar, prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import get from "lodash/get";
import set from "lodash/set";
import { applyRentedProperties,applynoticegeneration,applyrecoveryNotice } from "../../../../../ui-utils/apply";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import { some } from "lodash";
import { RP_MASTER_ENTRY, RECOVERY_NOTICE, VIOLATION_NOTICE, OWNERSHIPTRANSFERRP, DUPLICATECOPYOFALLOTMENTLETTERRP, PERMISSIONTOMORTGAGE, TRANSITSITEIMAGES, NOTICE_GENERATION } from "../../../../../ui-constants";
import { getUserInfo } from "egov-ui-kit/utils/localStorageUtils";

const userInfo = JSON.parse(getUserInfo());
export const DEFAULT_STEP = -1;
export const DETAILS_STEP = 0;
export const DOCUMENT_UPLOAD_STEP = 1;
export const SUMMARY_STEP = 2;

export const moveToSuccess = (rentedData, dispatch, type) => {
  const status = "success";
  let purpose = "apply";
  let applicationNumber = ""
  let path = ""
  const tenantId = get(rentedData, "tenantId");

  switch(type) {
    case OWNERSHIPTRANSFERRP: {
      applicationNumber = get(rentedData, "ownerDetails.applicationNumber")
      path = `/rented-properties/acknowledgement?purpose=${purpose}&status=${status}&applicationNumber=${applicationNumber}&tenantId=${tenantId}&type=${type}`
      break
    }
    case DUPLICATECOPYOFALLOTMENTLETTERRP:
    case PERMISSIONTOMORTGAGE:  
    {
      applicationNumber = get(rentedData, "applicationNumber")
      path = `/rented-properties/acknowledgement?purpose=${purpose}&status=${status}&applicationNumber=${applicationNumber}&tenantId=${tenantId}&type=${type}`
      break
    }
    case RP_MASTER_ENTRY: {
      applicationNumber = get(rentedData, "transitNumber")
      path = `/rented-properties/acknowledgement?purpose=${purpose}&status=${status}&transitNumber=${applicationNumber}&tenantId=${tenantId}&type=${type}`
      break
    }
    case TRANSITSITEIMAGES: {
      applicationNumber = get(rentedData, "property.transitNumber")
      path = `/rented-properties/acknowledgement?purpose=${purpose}&status=${status}&transitNumber=${applicationNumber}&tenantId=${tenantId}&type=${type}`
      break
    }
    case VIOLATION_NOTICE:
    case RECOVERY_NOTICE: {
      applicationNumber = get(rentedData, "notices[0].memoNumber")
      path = `/rented-properties/acknowledgement?purpose=${purpose}&status=${status}&applicationNumber=${applicationNumber}&tenantId=${tenantId}&type=${NOTICE_GENERATION}`
      break
    }
  }
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
                      linkText: "Download",
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
          moveToSuccess(rentedData, dispatch, RP_MASTER_ENTRY);
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
}
else{
  isFormValid = false;
  } 


if (isFormValid) {
  const noticegendata = get(
    state.screenConfiguration.preparedFinalObject,
    "Properties[0]"
);
moveToSuccess(noticegendata, dispatch, RECOVERY_NOTICE);
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
}
else{
  isFormValid = false;
  } 

if (isFormValid) {
  const noticegendata = get(
    state.screenConfiguration.preparedFinalObject,
    "Properties[0]"
);
moveToSuccess(noticegendata, dispatch, VIOLATION_NOTICE);
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
    debugger
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
          labelName: "submit",
          labelKey: "RP_TRANSITE_SITE_BUTTON_SUBMIT"
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

export const payment = {
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
          labelName: "Make Payment",
          labelKey: "RP_COMMON_MAKE_PAYMENT_BUTTON"
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

  export const downloadPrintContainer = (
    action,
    state,
    dispatch,
    status,
    applicationNumber,
    tenantId,
    pdfkey,
    applicationType,
    payloadName
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
    let applicationDownloadObjectForOT = {
      label: { labelName: "Application", labelKey: "TL_APPLICATION" },
      link: () => {
        const { Owners,OwnersTemp } = state.screenConfiguration.preparedFinalObject;
        const documents = OwnersTemp[0].reviewDocData;
        set(Owners[0],"additionalDetails.documents",documents)
        downloadAcknowledgementForm(Owners, OwnersTemp[0].estimateCardData,status,pdfkey,applicationType);
      },
      leftIcon: "assignment"
    };

    let applicationDownloadObjectForMG = {
      label: { labelName: "Application", labelKey: "TL_APPLICATION" },
      link: () => {
        const { MortgageApplications,MortgageApplicationsTemp } = state.screenConfiguration.preparedFinalObject;
        const documents = MortgageApplicationsTemp[0].reviewDocData;
        set(MortgageApplications[0],"additionalDetails.documents",documents)
        downloadAcknowledgementForm(MortgageApplications, MortgageApplicationsTemp[0].estimateCardData,status,pdfkey,applicationType);
      },
      leftIcon: "assignment"
    };

    let applicationDownloadObjectForDC = {
      label: { labelName: "Application", labelKey: "TL_APPLICATION" },
      link: () => {
        const { DuplicateCopyApplications,DuplicateTemp } = state.screenConfiguration.preparedFinalObject;
        const documents = DuplicateTemp[0].reviewDocData;
        set(DuplicateCopyApplications[0],"additionalDetails.documents",documents)
        downloadAcknowledgementForm(DuplicateCopyApplications, DuplicateTemp[0].estimateCardData,status,pdfkey,applicationType,payloadName);
      },
      leftIcon: "assignment"
    };
    let applicationPrintObject = {
      label: { labelName: "Application", labelKey: "TL_APPLICATION" },
      link: () => {
        const { Owners,OwnersTemp } = state.screenConfiguration.preparedFinalObject;
        const documents = OwnersTemp[0].reviewDocData;
        set(Owners[0],"additionalDetails.documents",documents)
        downloadAcknowledgementForm(Owners, OwnersTemp[0].estimateCardData, "print");
      },
      leftIcon: "assignment"
    };

    let receiptDownloadObject = {
      label: { labelName: "Receipt", labelKey: "TL_RECEIPT" },
      link: () => {

        const Owners = get(state.screenConfiguration.preparedFinalObject, "Owners", []);
        const receiptQueryString = [
          { key: "consumerCodes", value: get(state.screenConfiguration.preparedFinalObject.Owners[0].ownerDetails, "applicationNumber") },
          { key: "tenantId", value: get(state.screenConfiguration.preparedFinalObject.Owners[0], "tenantId") }
        ]
        download(receiptQueryString, Owners, data(), userInfo.name);
        // generateReceipt(state, dispatch, "receipt_download");
      },
      leftIcon: "receipt"
    };

    let receiptDownloadObjectForDC = {
      label: { labelName: "Receipt", labelKey: "TL_RECEIPT" },
      link: () => {

        const Owners = get(state.screenConfiguration.preparedFinalObject, "DuplicateCopyApplications", []);
        console.log(Owners)
        const receiptQueryString = [
          { key: "consumerCodes", value: get(state.screenConfiguration.preparedFinalObject.DuplicateCopyApplications[0], "applicationNumber") },
          { key: "tenantId", value: get(state.screenConfiguration.preparedFinalObject.DuplicateCopyApplications[0], "tenantId") }
        ]
        download(receiptQueryString, Owners, data(), userInfo.name);
        // generateReceipt(state, dispatch, "receipt_download");
      },
      leftIcon: "receipt"
    };
    switch (status) {
      case "OT_APPROVED":
        downloadMenu = [
          receiptDownloadObject,
          applicationDownloadObjectForOT
        ];
        printMenu = [
          applicationPrintObject
        ];
        break;
      case "DC_APPROVED":
          downloadMenu = [
            receiptDownloadObjectForDC,
            applicationDownloadObjectForDC
          ];
          printMenu = [
            applicationPrintObject
          ];
        break;
      case 'MG_APPROVED':
      case "MG_PENDINGCLVERIFICATION":
      case "MG_PENDINGJAVERIFICATION":
      case "MG_PENDINGSAVERIFICATION":
      case "MG_PENDINGCLARIFICATION":
      case "MG_PENDINGSIVERIFICATION":
      case "MG_PENDINGCAAPPROVAL":
      case "MG_PENDINGAPRO":
      case "MG_REJECTED":
      case "MG_PENDINGGRANTDETAIL":  
    
          downloadMenu = [
            applicationDownloadObjectForMG,
          ];
        
        break;    
      case "DC_PENDINGCLVERIFICATION":
      case "DC_PENDINGJAVERIFICATION":
      case "DC_PENDINGSAVERIFICATION":
      case "DC_PENDINGCLARIFICATION":
      case "DC_PENDINGSIVERIFICATION":
      case "DC_PENDINGCAAPPROVAL":
      case "DC_PENDINGAPRO":
      case "DC_REJECTED":

          downloadMenu = [
            applicationDownloadObjectForDC
          ];
          
      break; 
          case "OT_PENDINGCLVERIFICATION":
          case "OT_PENDINGJAVERIFICATION":
          case "OT_PENDINGSAVERIFICATION":
          case "OT_PENDINGCLARIFICATION":
          case "OT_PENDINGSIVERIFICATION":
          case "OT_PENDINGCAAPPROVAL":
          case "OT_PENDINGAPRO":
          case "OT_REJECTED":
              downloadMenu = [
                applicationDownloadObjectForOT
              ];
             
      break; 
    default:
      break;    
          
    }
  
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

  
