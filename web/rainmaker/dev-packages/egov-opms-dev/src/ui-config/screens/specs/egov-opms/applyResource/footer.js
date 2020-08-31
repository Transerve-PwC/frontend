import {
  dispatchMultipleFieldChangeAction,
  getLabel
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import get from "lodash/get";
import { getCommonApplyFooter, validateFields } from "../../utils";
import "./index.css";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import { httpRequest } from "../../../../../ui-utils";
import {
  createUpdateNocApplication,
  prepareDocumentsUploadData
} from "../../../../../ui-utils/commons";
import { localStorageGet, localStorageSet, getOPMSTenantId, getapplicationNumber } from "egov-ui-kit/utils/localStorageUtils";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";

const setReviewPageRoute = (state, dispatch, applnid) => {
  const applicationNumber = getapplicationNumber(); //get(state, "screenConfiguration.preparedFinalObject.PETNOC.applicationId");

  if (applicationNumber) {
    let tenantId = getOPMSTenantId();
    const appendUrl =
      process.env.REACT_APP_SELF_RUNNING === "true" ? "/egov-ui-framework" : "";
    const reviewUrl = `${appendUrl}/egov-opms/petnoc_summary?applicationNumber=${applicationNumber}&tenantId=${tenantId}`;
    dispatch(setRoute(reviewUrl));
  }
  else {
    let tenantId = getOPMSTenantId();
    const appendUrl =
      process.env.REACT_APP_SELF_RUNNING === "true" ? "/egov-ui-framework" : "";
    const reviewUrl = `${appendUrl}/egov-opms/petnoc_summary?applicationNumber=${applnid}&tenantId=${tenantId}`;
    dispatch(setRoute(reviewUrl));
  }
};


const moveToReview = (state, dispatch, applnid) => {


  //alert(get(state.screenConfiguration.preparedFinalObject, "documentsUploadRedux"))
  if (get(state.screenConfiguration.preparedFinalObject, "documentsUploadRedux") !== undefined) {
    const documentsFormat = Object.values(get(state.screenConfiguration.preparedFinalObject, "documentsUploadRedux")
    );

    let validateDocumentField = false;

    for (let i = 0; i < 2; i++) {
      let isDocumentRequired = get(documentsFormat[i], "isDocumentRequired");
      let isDocumentTypeRequired = get(
        documentsFormat[i], "isDocumentTypeRequired");

      let documents = get(documentsFormat[i], "documents");
      // if (isDocumentRequired) {
      if (documents && documents.length > 0) {
        if (isDocumentTypeRequired) {
          if (get(documentsFormat[i], "dropdown.value")) {
            validateDocumentField = true;
          } else {
            dispatch(
              toggleSnackbar(
                true,
                { labelName: "Please select type of Document!", labelKey: "" },
                "warning"
              )
            );
            validateDocumentField = false;
            break;
          }
        } else {
          validateDocumentField = true;
        }
      } else {
        dispatch(
          toggleSnackbar(
            true,
            { labelName: "Please uplaod mandatory documents!", labelKey: "" },
            "warning"
          )
        );
        validateDocumentField = false;
        break;
      }
      // } else {
      //   validateDocumentField = true;
      // }
    }

   // validateDocumentField = true;

    return validateDocumentField;
  }
  else {
    dispatch(
      toggleSnackbar(
        true,
        { labelName: "Please uplaod mandatory documents!", labelKey: "" },
        "warning"
      ))
  }
};

const getMdmsData = async (state, dispatch) => {
  let tenantId = get(
    state.screenConfiguration.preparedFinalObject,
    "PETNOC.tenantId"
  );
  let mdmsBody = {
    MdmsCriteria: {
      tenantId: tenantId,
      moduleDetails: [
        { moduleName: "PETNOC", masterDetails: [{ name: "Documents" }] }
      ]
    }
  };
  try {
    let payload = await httpRequest(
      "post",
      "/egov-mdms-service/v1/_search",
      "_search",
      [],
      mdmsBody
    );

    dispatch(
      prepareFinalObject(
        "applyScreenMdmsData.PETNOC.Documents",
        payload.MdmsRes.PETNOC.Documents
      )
    );
    prepareDocumentsUploadData(state, dispatch, 'apply_pet');
  } catch (e) {
    console.log(e);
  }
};

const callBackForNext = async (state, dispatch) => {

  let errorMessage = '';
  let activeStep = get(
    state.screenConfiguration.screenConfig["apply"],
    "components.div.children.stepper.props.activeStep",
    0
  );
 
  let isFormValid = false;
  let hasFieldToaster = true;
  let immunizationSector = get(
    state,
    "screenConfiguration.preparedFinalObject.PETNOC.immunizationSector"
  );
 
  if (activeStep === 0) {
   
    let PetParticularDetails = validateFields(
      "components.div.children.formwizardFirstStep.children.PetParticularDetails.children.cardContent.children.applicationDetailsConatiner.children",
      state, dispatch,'apply');

     
      let nocDetails = validateFields(
        "components.div.children.formwizardFirstStep.children.nocDetails.children.cardContent.children.nocDetailsContainer.children",
        state, dispatch,'apply');
        isFormValid=PetParticularDetails & nocDetails
  }
 
  if (activeStep === 1) {
    
   isFormValid = validateFields(
      "components.div.children.formwizardSecondStep.children.immunizationDetails.children.cardContent.children.immunizationDetailsConatiner.children.buildingDataCard.children.singleBuildingContainer.children.singleBuilding.children.cardContent.children.singleBuildingCard.children",
      state, dispatch,'apply');
    //  screenConfiguration.screenConfig.apply.components.div.children.formwizardFirstStep.children.nocDetails.children.cardContent.children
  }
  if (activeStep === 2) {
    
    isFormValid = moveToReview(state, dispatch);
  }


  if (activeStep !== 3) {

    if (isFormValid) {

      let responseStatus = "success";
      // if (activeStep === 1) {
      // }
      if (activeStep === 2) {

        prepareDocumentsUploadData(state, dispatch);
        //getMdmsData(state, dispatch);
        let statuss = localStorageGet("app_noc_status") == "REASSIGN" ? "REASSIGN" : "DRAFT";
        let response = await createUpdateNocApplication(state, dispatch, statuss);
        responseStatus = get(response, "status", "");
        let applicationId = get(response, "applicationId", "");
        if (responseStatus == "SUCCESS" || responseStatus == "success") {
          isFormValid = moveToReview(state, dispatch, applicationId);
          if (isFormValid) {
            setReviewPageRoute(state, dispatch, applicationId);
          }
          let errorMessage = {
            labelName: 'SUCCESS',
            labelKey: "" //UPLOAD_FILE_TOAST
          };
          dispatch(toggleSnackbar(true, errorMessage, "success"));

        }
        else {
          let errorMessage = {
            labelName: "Submission Falied, Try Again later!",
            labelKey: "" //UPLOAD_FILE_TOAST
          };
          dispatch(toggleSnackbar(true, errorMessage, "error"));
        }
      }

      if (isFormValid != false) {
        responseStatus === "success" && changeStep(state, dispatch);
      }
      else {
        errorMessage = {
          labelName:
            "Please fill all mandatory fields for Applicant Details, then proceed!",
          labelKey: "ERR_FILL_ALL_MANDATORY_FIELDS_APPLICANT_TOAST_PET"
        };

        dispatch(toggleSnackbar(true, errorMessage, "warning"));
      }

    } else if (hasFieldToaster) {
      errorMessage = {
        labelName: "Please fill all mandatory fields!",
        labelKey: "ERR_FILL_ALL_MANDATORY_FIELDS_PET_TOAST"
      };
      switch (activeStep) {
        case 1:
          errorMessage = {
            labelName:
              "Please check the Missing/Invalid field, then proceed!",
            labelKey: "ERR_FILL_ALL_MANDATORY_FIELDS_PET_TOAST"
          };
          break;
        case 2:
          errorMessage = {
            labelName:
              "Please fill all mandatory fields, then proceed!",
            labelKey: "ERR_FILL_ALL_MANDATORY_FIELDS_APPLICANT_PET_TOAST"
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
        minWidth: "180px",
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
        labelKey: "NOC_COMMON_BUTTON_PREV_STEP"
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
        marginRight: "45px"
      }
    },
    children: {
      nextButtonLabel: getLabel({
        labelName: "Next Step",
        labelKey: "NOC_COMMON_BUTTON_NXT_STEP"
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
        marginRight: "45px"
      }
    },
    children: {
      submitButtonLabel: getLabel({
        labelName: "Submit",
        labelKey: "NOC_COMMON_BUTTON_SUBMIT"
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



