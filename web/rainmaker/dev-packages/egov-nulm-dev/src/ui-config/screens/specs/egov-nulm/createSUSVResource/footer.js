import get from "lodash/get";
import {
  dispatchMultipleFieldChangeAction,
  getLabel
} from "egov-ui-framework/ui-config/screens/specs/utils";
import {
    prepareDocumentsUploadData
} from "../../../../../ui-utils/commons";
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
// import "./index.css";

  const moveToReview = dispatch => {
    const reviewUrl =`/egov-nulm/review-susv`;
    dispatch(setRoute(reviewUrl));
  };

export const callBackForNext = async (state, dispatch) => {
  let activeStep = get(
    state.screenConfiguration.screenConfig["create-susv"],
    "components.div.children.stepper.props.activeStep",
    0
  );
  const {NulmSusvRequest} = state.screenConfiguration.preparedFinalObject;
  let isFormValid = true;
  let documentsPreview =[];
  let applicationDocument =[];
  let documentAttachemnt = "";
  if (activeStep === 0) {
    const isSUSVDetailsValid = validateFields(
      "components.div.children.formwizardFirstStep.children.SUSVDetails.children.cardContent.children.SUSVDetailsContainer.children",
      state,
      dispatch,
      "create-susv"
    );
    
      if(NulmSusvRequest && ( !NulmSusvRequest.hasOwnProperty("gender") || !NulmSusvRequest.hasOwnProperty("category"))){
        isFormValid = false;
      }

      if (!isSUSVDetailsValid) {
        isFormValid = false;
      }
      if(isSUSVDetailsValid)
      {
      if(NulmSusvRequest ){
        if(!NulmSusvRequest.dob && !NulmSusvRequest.age ){
          const errorMessage = {
            labelName: "Please select the Minority",
            labelKey: "ERR_NULM_DOB_AGE_VALIDATION"
          };
          dispatch(toggleSnackbar(true, errorMessage, "warning"));
          return;
        }
      }      
    }
     // show validation mewssage and clear age value from json
     if(NulmSusvRequest && NulmSusvRequest.dob && NulmSusvRequest.age ){
      if(NulmSusvRequest.dob && NulmSusvRequest.age ){
        const errorMessage = {
          labelName: "Please select the Minority",
          labelKey: "ERR_NULM_DOB_AGE_VALIDATION"
        };
        dispatch(toggleSnackbar(true, errorMessage, "warning"));
        // dispatch(
        //   handleField(
        //     `create-susv`,
        //     "components.div.children.formwizardFirstStep.children.SUSVDetails.children.cardContent.children.SUSVDetailsContainer.children.age",
        //     "props.value",
        //     ''
        //   )
        // );
        // dispatch(prepareFinalObject(`NulmSusvRequest.age`, null ));
        return;
      }
    }
    //
  }

  if (activeStep === 1) {
    let nomineeDetailsPath =
      "components.div.children.formwizardSecondStep.children.NomineeDetails.children.cardContent.children.NomineeDetailsCard.props.items";

    let nomineeItems = get(
      state.screenConfiguration.screenConfig['create-susv'],
      nomineeDetailsPath,
      []
    );
    let isNomineeValid = true;
    for (var j = 0; j < nomineeItems.length; j++) {
      if (
        (nomineeItems[j].isDeleted === undefined ||
          nomineeItems[j].isDeleted !== false) &&
        !validateFields(
          `${nomineeDetailsPath}[${j}].item${j}.children.cardContent.children.NomineeDetailsCardContainer.children`,
          state,
          dispatch,
          "create-susv"
        )
      )
      isNomineeValid = false;
    }
    let cardJsonPath =
    "components.div.children.formwizardSecondStep.children.NomineeDetails.children.cardContent.children.NomineeDetailsCard.props.items";
    let pagename = "create-susv";
    let jasonpath =  "NulmSusvRequest.susvApplicationFamilyDetails[0]";
    let value = "name";
   // let DuplicatItem = ValidateCard(state,dispatch,cardJsonPath,pagename,jasonpath,value);

    // if(DuplicatItem && DuplicatItem[0].IsDuplicatItem){
    //   const errorMessage = {
    //     labelName: "Duplicate Material Added",
    //     labelKey:   `STORE_MATERIAL_DUPLICATE_VALIDATION  ${DuplicatItem[0].duplicates} `
    //   };
    //   dispatch(toggleSnackbar(true, errorMessage, "warning"));
    //   return;
    // }

    if (!isNomineeValid) {
      isFormValid = false;
    }
  }

  if (activeStep === 2) {
    const localisationLabels = getTransformedLocalStorgaeLabels();
    const documents = get(state.screenConfiguration.preparedFinalObject, "documentsContract");
    const uploadedDocs = get(state.screenConfiguration.preparedFinalObject, "documentsUploadRedux");
    const isDocRequired =  documents.map(doc => {
            return  doc.cards && doc.cards[0].required;
        })

      let docArray = new Array(isDocRequired.length)
        
      uploadedDocs &&  Object.entries(uploadedDocs).forEach(ele => {         
        docArray[ele[0]] = ele[1];
        if(ele[1] &&  ele[1].documents && ele[1].documents.length>0){
          let obj = {
            title: documents[ele[0]].title,
            linkText: "VIEW", 
            link:    getFileUrl(ele[1].documents[0].fileUrl),   
            name:   (  decodeURIComponent(
                        getFileUrl(ele[1].documents[0].fileUrl)
                          .split("?")[0]
                          .split("/")
                          .pop().slice(13)
                      )) ||
                    `Document - ${index + 1}`     
          }
          let reqObj = {
            documentType :  getLocaleLabels(documents[ele[0]].code,documents[ele[0]].code,localisationLabels),  
            filestoreId:   ele[1].documents[0].fileStoreId,
          }
          applicationDocument.push(reqObj);
          documentAttachemnt = [ele[1].documents[0].fileStoreId];
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
    }
if(activeStep === 3){
  const isUndertakingValid = validateFields(
    "components.div.children.formwizardFourthStep.children.UnderTaking.children.cardContent.children.UnderTakingContainer.children",
    state,
    dispatch,
    "create-susv"
  );

  if(NulmSusvRequest && ( !NulmSusvRequest.hasOwnProperty("isUndertaking") || NulmSusvRequest.isUndertaking ===false )){
    const errorMessage = {
      labelName: "Please Tick the undertaking",
      labelKey: "NULM_SUSV_TICK_UNDERTAKING"
    };
    dispatch(toggleSnackbar(true, errorMessage, "warning"));
    return;
  }

  if (!isUndertakingValid) {
    isFormValid = false;
  }

}
    if(activeStep == 2 && !isFormValid){
      dispatch(
        toggleSnackbar(
          true,
          { labelName: "Please upload mandatory documents!", labelKey: "" },
          "warning"
        ))
    }
    else if(activeStep == 2 && isFormValid){
      dispatch(
        prepareFinalObject("NulmSusvRequest.applicationDocument", applicationDocument)
      );
      dispatch(
        prepareFinalObject("documentsPreview", documentsPreview)
      );
      changeStep(state, dispatch);
    }
  else if(activeStep != 2 && !isFormValid){
    const errorMessage = {
      labelName: "Please fill all fields",
      labelKey: "ERR_FILL_ALL_FIELDS"
    };
    dispatch(toggleSnackbar(true, errorMessage, "warning"));
  }
else if(activeStep == 3 && isFormValid){
 
  moveToReview(dispatch);
}
  else{
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
    state.screenConfiguration.screenConfig["create-susv"],
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
  dispatchMultipleFieldChangeAction("create-susv", actionDefination, dispatch);
  renderSteps(activeStep, dispatch);
};

export const renderSteps = (activeStep, dispatch) => {
  switch (activeStep) {
    case 0:
      dispatchMultipleFieldChangeAction(
        "create-susv",
        getActionDefinationForStepper(
          "components.div.children.formwizardFirstStep"
        ),
        dispatch
      );
      break;
    case 1:
      dispatchMultipleFieldChangeAction(
        "create-susv",
        getActionDefinationForStepper(
          "components.div.children.formwizardSecondStep"
        ),
        dispatch
      );
      break;
    case 2:
      dispatchMultipleFieldChangeAction(
        "create-susv",
        getActionDefinationForStepper(
          "components.div.children.formwizardThirdStep"
        ),
        dispatch
      );
      break;
      case 3:
        dispatchMultipleFieldChangeAction(
          "create-susv",
          getActionDefinationForStepper(
            "components.div.children.formwizardFourthStep"
          ),
          dispatch
        );
        break;
    default:
      dispatchMultipleFieldChangeAction(
        "create-susv",
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
