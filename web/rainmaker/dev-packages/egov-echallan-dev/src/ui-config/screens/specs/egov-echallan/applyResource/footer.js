import {
  dispatchMultipleFieldChangeAction,
  getLabel
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { toggleSnackbar, handleScreenConfigurationFieldChange as handleField, prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import get from "lodash/get";
import { getCommonApplyFooter, validateFields } from "../../utils";
import "./index.css";
import {
  getTenantId, getUserInfo, getapplicationType, getapplicationMode, setapplicationMode, setapplicationNumber
} from "egov-ui-kit/utils/localStorageUtils";

import {
  createUpdateGenerateChallanApplication,
  createCitizenBasedonMobileNumber,
  prepareDocumentsUploadData
} from "../../../../../ui-utils/commons";
import { toggleSpinner } from "egov-ui-framework/ui-redux/screen-configuration/actions";

const setReviewPageRoute = (state, dispatch) => {

  let tenantId = getTenantId();

  const applicationNumber = get(
    state,
    "screenConfiguration.preparedFinalObject.eChallan.challanId"
  );
  const appendUrl =
    process.env.REACT_APP_SELF_RUNNING === "true" ? "/egov-ui-framework" : "";
  const reviewUrl = `${appendUrl}/egov-echallan/summary?applicationNumber=${applicationNumber}&tenantId=${tenantId}`;
  dispatch(setRoute(reviewUrl));
};

// const moveToReview = (state, dispatch) => {

//   const documentsFormat = Object.values(
//     get(state.screenConfiguration.preparedFinalObject, "documentsUploadRedux")
//   );

//   let validateDocumentField = false;

//   for (let i = 0; i < documentsFormat.length; i++) {
//     let isDocumentRequired = get(documentsFormat[i], "isDocumentRequired");
//     let isDocumentTypeRequired = get(documentsFormat[i], "isDocumentTypeRequired");

//     let documents = get(documentsFormat[i], "documents");
//     if (isDocumentRequired) {
//       if (documents && documents.length > 0) {
//         if (isDocumentTypeRequired) {
//           if (get(documentsFormat[i], "dropdown.value")) {
//             validateDocumentField = true;
//           } else {
//             dispatch(
//               toggleSnackbar(
//                 true,
//                 { labelName: "Please select type of Document!", labelKey: "" },
//                 "warning"
//               )
//             );
//             validateDocumentField = false;
//             break;
//           }
//         } else {
//           validateDocumentField = true;
//         }
//       } else {
//         dispatch(
//           toggleSnackbar(
//             true,
//             { labelName: "Please uplaod mandatory documents!", labelKey: "" },
//             "warning"
//           )
//         );
//         validateDocumentField = false;
//         break;
//       }
//     } else {
//       validateDocumentField = true;
//     }
//   }
//   return validateDocumentField;
// };

const callBackForNext = async (state, dispatch) => {

  let activeStep = get(
    state.screenConfiguration.screenConfig["apply"],
    "components.div.children.stepper.props.activeStep",
    0
  );
  let isFormValid = true;
  let hasFieldToaster = false;


  switch (activeStep) {
    case 0:

      //let licenseNo = get(state, 'screenConfiguration.preparedFinalObject.eChallan.licenseNoCov', '');

      let isviolationsDetailsContainer = validateFields(
        "components.div.children.formwizardFirstStep.children.violationsDetails.children.cardContent.children.violationsDetailsContainer.children",
        state,
        dispatch
      );
      //isviolationsDetailsContainer = licenseNo === '' ?  false : isviolationsDetailsContainer;

      //components.div.children.formwizardFirstStep.children.violatorDetails.children.cardContent.children.violatorDetailsConatiner.children.NameofViolator
      let isapplicantnamevalid = validateFields(
        "components.div.children.formwizardFirstStep.children.violatorDetails.children.cardContent.children.violatorDetailsConatiner.children",
        state,
        dispatch
      );
      isFormValid = isviolationsDetailsContainer;
      if (isFormValid) {
        isFormValid = isapplicantnamevalid;
      }

      hasFieldToaster = isFormValid === true ? false : true;
      break;
    case 1:
      let ArticleGridDataAvailable = get(state, 'screenConfiguration.preparedFinalObject.articleSeizedGridDetails', []);

      if (ArticleGridDataAvailable.length > 0) {
        isFormValid = true;
      } else if (ArticleGridDataAvailable.length === 0) {
        isFormValid = false;

        dispatch(
          toggleSnackbar(
            true,
            {
              labelName: "Atleast one item is required to proceed !",
              labelKey: "EC_ARTICLE_DETAIL_REQUIRED_TOASTER"
            },
            "warning"
          ));
      }
      //isFormValid = isapplicantname;
      hasFieldToaster = isFormValid === true ? false : true;
      break;
    case 2:
      isFormValid = true; //moveToReview(state, dispatch);
      let isviolatorImage = false;
      let isviolatorIdProofImage = false;

      let violatorImage = get(state, "form.apply_Violator_Image.files.echallanViolaterImage", []);
      let violatorIdProofImage = get(state, "form.apply_Violator_ID_PROOF.files.echallanViolaterIDProofImage", []);
      let violationsImage = get(state, "form.apply_Violations_Image.files.echallanViolationImage", []);
      // if (violatorImage.length > 0) {
      //   isviolatorImage = true;
      // }
      // else {
      //   isviolatorImage = false;
      // }
      // if (violatorIdProofImage.length > 0) {
      //   isviolatorIdProofImage = true;
      // } else {
      //   isviolatorIdProofImage = false;
      // }
      // if (isviolatorImage === false || isviolatorIdProofImage === false) {
      //   isFormValid = false;
      // } else {
      //   isFormValid = true;
      // }

      hasFieldToaster = isFormValid === true ? false : true;
      break;

    default:
      break;
  }

  if (activeStep !== 3) {
    if (isFormValid) {
      let responseStatus = "success";
      if (activeStep === 2) {
        try {

          prepareDocumentsUploadData(state, dispatch, 'apply');
          let statuss = "CHALLAN ISSUED";

          let userResponse = await createCitizenBasedonMobileNumber(state, dispatch);
          console.log("resu : " + userResponse);

          let response = await createUpdateGenerateChallanApplication(state, dispatch, statuss);
          responseStatus = get(response, "status", "");
          let applicationId = get(response, "challanId", "");
          if (responseStatus == 'SUCCESS' || responseStatus == 'success') {
            //isFormValid = moveToReview(state, dispatch, applicationId);
            //if (isFormValid) {
            setReviewPageRoute(state, dispatch, applicationId);
            //}
          }
          else {
            console.log(`Error Response : ` + response.message.message);
            let errorMessage = {
              labelName: response.message.message, // "Submission Falied, Try Again later!",
              labelKey: "" //UPLOAD_FILE_TOAST
            };
            dispatch(toggleSnackbar(true, errorMessage, "error"));
          }
        } catch (error) {
          console.log(error);
        }
      }

      responseStatus === "success" && changeStep(state, dispatch);
    } else if (hasFieldToaster) {
      let errorMessage = {
        labelName: "Please fill all mandatory fields and upload the documents!",
        labelKey: "EC_ERR_FILL_ALL_MANDATORY_FIELDS_APPLICANT_DOCUMENT_TOAST"
      };
      switch (activeStep) {
        case 0:
          errorMessage = {
            labelName:
              "Please check the Missing/Invalid field for Violation Details, then proceed!",
            labelKey: "EC_ERR_FILL_ALL_MANDATORY_FIELDS_APPLICANT_VIOLATION_TOAST"
          };
          break;
        case 1:
          errorMessage = {
            labelName:
              "Please fill all mandatory fields for Seized Details, then proceed!",
            labelKey: "EC_ERR_FILL_ALL_MANDATORY_FIELDS_ITEM_SEIZED_TOAST"
          };
          break;
        case 2:
          errorMessage = {
            labelName: "Upload At least One Image..!",
            labelKey: "EC_ERR_UPLOAD_IMAGE_NOT_FOUND"
          };
          break;
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
  //alert("Inside step change1")
  let activeStep = get(
    state.screenConfiguration.screenConfig["apply"],
    "components.div.children.stepper.props.activeStep",
    0
  );
  if (defaultActiveStep === -1) {
    activeStep = mode === "next" ? activeStep + 1 : activeStep - 1;
  } else {
    activeStep = defaultActiveStep;
  }

  const isPreviousButtonVisible = activeStep > 0 ? true : false;
  const isNextButtonVisible = activeStep < 4 ? true : false;
  const isPayButtonVisible = activeStep === 4 ? true : false;
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
    case 0:
      dispatchMultipleFieldChangeAction(
        "apply",
        getActionDefinationForStepper(
          "components.div.children.formwizardFirstStep"
        ),
        dispatch
      );
      break;
    case 1:
      dispatchMultipleFieldChangeAction(
        "apply",
        getActionDefinationForStepper(
          "components.div.children.formwizardSecondStep"
        ),
        dispatch
      );
      break;
    case 2:
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
        minWidth: "200px",
        height: "48px",
        marginRight: "16px"
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
        labelKey: "EC_COMMON_BUTTON_PREV_STEP"
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
        minWidth: "200px",
        height: "48px",
        marginRight: "45px"
      }
    },
    children: {
      nextButtonLabel: getLabel({
        labelName: "Next Step",
        labelKey: "EC_COMMON_BUTTON_NXT_STEP"
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
        minWidth: "200px",
        height: "48px",
        marginRight: "45px"
      }
    },
    children: {
      submitButtonLabel: getLabel({
        labelName: "Submit",
        labelKey: "EC_COMMON_BUTTON_SUBMIT"
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
