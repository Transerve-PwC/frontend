import get from "lodash/get";
import {
  dispatchMultipleFieldChangeAction,
  getLabel
} from "egov-ui-framework/ui-config/screens/specs/utils";
import {
    prepareDocumentsUploadData
} from "../../../../../ui-utils/storecommonsapi";
import { convertDateToEpoch } from "egov-ui-framework/ui-config/screens/specs/utils";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import { toggleSnackbar,prepareFinalObject, handleScreenConfigurationFieldChange as handleField } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getFileUrl } from "egov-ui-framework/ui-utils/commons";
import {
  getButtonVisibility,
  getCommonApplyFooter,
  ifUserRoleExists,
  validateFields,
  epochToYmd
} from "../../utils";
import {
  getLocaleLabels,
  getTransformedLocalStorgaeLabels,
} from "egov-ui-framework/ui-utils/commons";
import {NULM_SEP_CREATED,
  FORWARD_TO_TASK_FORCE_COMMITTEE,
  APPROVED_BY_TASK_FORCE_COMMITTEE,
  REJECTED_BY_TASK_FORCE_COMMITTEE,
  SENT_TO_BANK_FOR_PROCESSING,
SANCTION_BY_BANK} from '../../../../../ui-utils/commons'
// import "./index.css";

  const moveToReview = dispatch => {
    const reviewUrl =`/egov-nulm/review-sep`;
    dispatch(setRoute(reviewUrl));
  };



export const callBackForNext = async (state, dispatch) => {
  let activeStep = get(
    state.screenConfiguration.screenConfig["create-sep"],
    "components.div.children.stepper.props.activeStep",
    0
  );
  const {NULMSEPRequest} = state.screenConfiguration.preparedFinalObject;
  let isFormValid = true;
  let documentsPreview =[];
  let applicationDocument =[];
  if (activeStep === 0) {
    const isSepDetailsValid = validateFields(
      "components.div.children.formwizardFirstStep.children.SepDetails.children.cardContent.children.SepDetailsContainer.children",
      state,
      dispatch,
      "create-sep"
    );
    if (isSepDetailsValid) {
    if(NULMSEPRequest ){
      if(!NULMSEPRequest.dob && !NULMSEPRequest.age ){
        const errorMessage = {
          labelName: "Please select the Minority",
          labelKey: "ERR_NULM_DOB_AGE_VALIDATION"
        };
        dispatch(toggleSnackbar(true, errorMessage, "warning"));
        return;
      }
    }
  }
    
if(NULMSEPRequest && NULMSEPRequest.isMinority){
  if(NULMSEPRequest.isMinority =="Yes" && !NULMSEPRequest.minority ){
    const errorMessage = {
      labelName: "Please select the Minority",
      labelKey: "ERR_NULM_MINORTY"
    };
    dispatch(toggleSnackbar(true, errorMessage, "warning"));
    return;
  }
}

if(NULMSEPRequest && NULMSEPRequest.isUrbanPoor){
  if(NULMSEPRequest.isUrbanPoor =="Yes" && !NULMSEPRequest.bplNo ){
    const errorMessage = {
      labelName: "Please fill BPL Number",
      labelKey: "ERR_NULM_FILL_BPL_NUMBER"
    };
    dispatch(toggleSnackbar(true, errorMessage, "warning"));
    return;
  }
}
if(NULMSEPRequest && NULMSEPRequest.isHandicapped){
  if(NULMSEPRequest.isHandicapped =="Yes" && (NULMSEPRequest.isDisabilityCertificateAvailable === undefined) ){
    const errorMessage = {
      labelName: "Please chose disability certificate available option",
      labelKey: "ERR_NULM_FILL_DISABILITY_CERTIFICATE"
    };
    dispatch(toggleSnackbar(true, errorMessage, "warning"));
    return;
  }
}

if(NULMSEPRequest && ( !NULMSEPRequest.hasOwnProperty("gender") || !NULMSEPRequest.hasOwnProperty("category"))){
  isFormValid = false;
}

    if (!isSepDetailsValid) {     
      isFormValid = false;
    }
    const status = window.localStorage.getItem("SEP_Status");

    if(status === FORWARD_TO_TASK_FORCE_COMMITTEE || status === APPROVED_BY_TASK_FORCE_COMMITTEE|| status===REJECTED_BY_TASK_FORCE_COMMITTEE || status===SENT_TO_BANK_FOR_PROCESSING) {
      const isValid = validateFields(
                          "components.div.children.formwizardFirstStep.children.TFCDetails.children.cardContent.children.TFCDetailsContainer.children",
                          state,
                          dispatch,
                          "create-sep"
                        );

      if(!isValid){

        const errorMessage = {
          labelName: "Please fill all fields",
          labelKey: "ERR_FILL_ALL_FIELDS"
        };
        dispatch(toggleSnackbar(true, errorMessage, "warning"));
        return;
      }
    }
    if(status === APPROVED_BY_TASK_FORCE_COMMITTEE || status===REJECTED_BY_TASK_FORCE_COMMITTEE || status===SENT_TO_BANK_FOR_PROCESSING) {
      const isValid = validateFields(
        "components.div.children.formwizardFirstStep.children.bankDetailToProcess.children.cardContent.children.bankDetailToProcessContainer.children",
                          state,
                          dispatch,
                          "create-sep"
                        );

      if(!isValid){

        const errorMessage = {
          labelName: "Please fill all fields",
          labelKey: "ERR_FILL_ALL_FIELDS"
        };
        dispatch(toggleSnackbar(true, errorMessage, "warning"));
        return;
      }
    }

    if(status===SENT_TO_BANK_FOR_PROCESSING){
      const isValid = validateFields(
        "components.div.children.formwizardFirstStep.children.SanctionDetails.children.cardContent.children.SanctionDetailsContainer.children",
                          state,
                          dispatch,
                          "create-sep"
                        );

      if(!isValid){

        const errorMessage = {
          labelName: "Please fill all fields",
          labelKey: "ERR_FILL_ALL_FIELDS"
        };
        dispatch(toggleSnackbar(true, errorMessage, "warning"));
        return;
      }
    }

  }
  if (activeStep === 1) {
    const localisationLabels = getTransformedLocalStorgaeLabels();
    const documents = get(state.screenConfiguration.preparedFinalObject, "documentsContract");
    const uploadedDocs = get(state.screenConfiguration.preparedFinalObject, "documentsUploadRedux");
    const isDocRequired =  documents.map(doc => {
            return  doc.cards && doc.cards[0].required;
        })
        // Disability Certificate Available validation
      //   const isDocRequiredDisability =  documents.map(doc => {
      //     return  doc.cards && !doc.cards[0].required && doc.cards[0].code ==='NULM_BPL_YELLOW_RATION_CARD' ;
      // })

      let docArray = new Array(isDocRequired.length)
        
      uploadedDocs &&  Object.entries(uploadedDocs).forEach(ele => {         
        docArray[ele[0]] = ele[1];
        if(ele[1] &&  ele[1].documents && ele[1].documents.length>0 && ele[0] != -1){
          let obj = {
            title: documents[ele[0]].title,
            linkText: "VIEW", 
            link:  getFileUrl(ele[1].documents[0].fileUrl),  
            name:   ele[1].documents[0].fileName,    
          }
          let reqObj = {
            documentType :  getLocaleLabels(documents[ele[0]].code,documents[ele[0]].code,localisationLabels),  
            filestoreId:   ele[1].documents[0].fileStoreId,
          }
          applicationDocument.push(reqObj);
          documentsPreview.push(obj)
        }
    
    })

        for(let i = 0 ; i < isDocRequired.length ; i++){
          if(isDocRequired[i]){
                  if( docArray[i] && docArray[i].documents){
                    isFormValid = true;
                  }     
                  else{
                    isFormValid = false;
                    break;
                  } 
          }
        }
        //
        // console.log(isDocRequiredDisability)
        // console.log(isDocRequired)
        // for(let i = 0 ; i < isDocRequiredDisability.length ; i++){
          
        // }
    }

    if(activeStep == 1 && !isFormValid){
      dispatch(
        toggleSnackbar(
          true,
          { labelName: "Please upload mandatory documents!", labelKey: "" },
          "warning"
        ))
    }
  else if(activeStep != 1 && !isFormValid){
    const errorMessage = {
      labelName: "Please fill all fields",
      labelKey: "ERR_FILL_ALL_FIELDS"
    };
    dispatch(toggleSnackbar(true, errorMessage, "warning"));
  }
else if(activeStep == 1 && isFormValid){

  dispatch(
    prepareFinalObject("NULMSEPRequest.applicationDocument", applicationDocument)
  );
  dispatch(
    prepareFinalObject("documentsPreview", documentsPreview)
  );
  moveToReview(dispatch);
}
  else{
    if(activeStep ===0)
    {
      let loanamount = 200000
      const loanAmountInput = get(state.screenConfiguration.preparedFinalObject, "NULMSEPRequest.loanAmount");
      if(loanAmountInput>loanamount)
      {
        const errorMessage = {
          labelName: "Amount of Loan should not be more than 2Lacs",
          labelKey: "NULM_SEP_AMOUNT_OF_LOAN_REQUIRED_VALIDATION"
        };
        dispatch(toggleSnackbar(true, errorMessage, "warning"));
      }
      else
      {
        // setting documents for conditional doc mandatory
    prepareDocumentsUploadData(state, dispatch, 'SEPApplication');

    // show validation mewssage and clear age value from json
    if(NULMSEPRequest && NULMSEPRequest.dob && NULMSEPRequest.age ){
      if(NULMSEPRequest.dob && NULMSEPRequest.age ){
        const errorMessage = {
          labelName: "Please select the Minority",
          labelKey: "ERR_NULM_DOB_AGE_VALIDATION"
        };
        dispatch(toggleSnackbar(true, errorMessage, "warning"));
        // dispatch(
        //   handleField(
        //     `create-sep`,
        //     "components.div.children.formwizardFirstStep.children.SepDetails.children.cardContent.children.SepDetailsContainer.children.age",
        //     "props.value",
        //     ''
        //   )
        // );
        // dispatch(prepareFinalObject(`NULMSEPRequest.age`, null ));
        return;
      }
    }
      changeStep(state, dispatch);
      }
    }
    else
    changeStep(state, dispatch);
  }
};

export const changeStep = (
  state,
  dispatch,
  mode = "next",
  defaultActiveStep = -1
) => {
  let activeStep = get(
    state.screenConfiguration.screenConfig["create-sep"],
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
  dispatchMultipleFieldChangeAction("create-sep", actionDefination, dispatch);
  renderSteps(activeStep, dispatch);
};

export const renderSteps = (activeStep, dispatch) => {
  switch (activeStep) {
    case 0:
      dispatchMultipleFieldChangeAction(
        "create-sep",
        getActionDefinationForStepper(
          "components.div.children.formwizardFirstStep"
        ),
        dispatch
      );
      break;
    case 1:
      dispatchMultipleFieldChangeAction(
        "create-sep",
        getActionDefinationForStepper(
          "components.div.children.formwizardSecondStep"
        ),
        dispatch
      );
      break;
    case 2:
      dispatchMultipleFieldChangeAction(
        "create-sep",
        getActionDefinationForStepper(
          "components.div.children.formwizardThirdStep"
        ),
        dispatch
      );
      break;
   
    default:
      dispatchMultipleFieldChangeAction(
        "create-sep",
        getActionDefinationForStepper(
          "components.div.children.formwizardFifthStep"
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
  const {NULMSEPRequest} = state.screenConfiguration.preparedFinalObject;
  if(NULMSEPRequest && NULMSEPRequest.dob && NULMSEPRequest.age ){
    if(NULMSEPRequest.dob && NULMSEPRequest.age ){
      dispatch(
        handleField(
          `create-sep`,
          "components.div.children.formwizardFirstStep.children.SepDetails.children.cardContent.children.SepDetailsContainer.children.age",
          "props.value",
          ''
        )
      );
      dispatch(prepareFinalObject(`NULMSEPRequest.age`, null ));
    }
  }
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
        labelKey: "STORE_COMMON_BUTTON_PREV_STEP"
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
        labelKey: "STORE_COMMON_BUTTON_NXT_STEP"
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
        labelKey: "STORE_COMMON_BUTTON_SUBMIT"
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
