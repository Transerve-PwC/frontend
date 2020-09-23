import get from "lodash/get";
import {
  dispatchMultipleFieldChangeAction,
  getLabel
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import { toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import {
  getCommonApplyFooter,
  ifUserRoleExists,
  validateFields,
  getLocalizationCodeValue
} from "../../utils";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import {ValidateCard,ValidateCardUserQty} from '../../../../../ui-utils/storecommonsapi'
const moveToReview = dispatch => { 
  const reviewUrl = "/egov-store-asset/review-material-transfer-indent";
  dispatch(setRoute(reviewUrl));
};

export const callBackForNext = async (state, dispatch) => {

  let activeStep = get(
    state.screenConfiguration.screenConfig["create-material-transfer-indent"],
    "components.div.children.stepper.props.activeStep",
    0
  );
  let isFormValid = true;
  if (activeStep === 0) {
    const isMTHeaderValid = validateFields(
      "components.div.children.formwizardFirstStep.children.MTIHeader.children.cardContent.children.MTIHeaderContainer.children",
      state,
      dispatch,
      "create-material-transfer-indent"
    );
  
    if (!isMTHeaderValid) {
      isFormValid = false;
    }
  }
  if (activeStep === 2) {

  }
  if (activeStep === 1) {
    let poDetailsPath =
      "components.div.children.formwizardSecondStep.children.MTIDetails.children.cardContent.children.MTIDetailsCard.props.items";

    let poDetailsItems = get(
      state.screenConfiguration.screenConfig['create-material-transfer-indent'],
      poDetailsPath,
      []
    );
    let isPoDetailsValid = true;
    for (var j = 0; j < poDetailsItems.length; j++) {
      if (
        (poDetailsItems[j].isDeleted === undefined ||
          poDetailsItems[j].isDeleted !== false) &&
        !validateFields(
          `${poDetailsPath}[${j}].item${j}.children.cardContent.children.mtiDetailsCardContainer.children`,
          state,
          dispatch,
          "create-material-transfer-indent"
        )
      )
      isPoDetailsValid = false;
    }
  

    if (!isPoDetailsValid) {
      isFormValid = false;
    }
  }

    if (isFormValid) {
      if(activeStep === 2){

        moveToReview(dispatch);
      }
      else{
        // store validation
        let issueStore = get(state.screenConfiguration.preparedFinalObject,`indents[0].issueStore.code`,'')
        let indentStore = get(state.screenConfiguration.preparedFinalObject,`indents[0].indentStore.code`,'')
        if(indentStore !== issueStore)
        {
          
          if(activeStep===1)
          {
          let cardJsonPath =
          "components.div.children.formwizardSecondStep.children.MTIDetails.children.cardContent.children.MTIDetailsCard.props.items";
          let pagename = "create-material-transfer-indent";
          let jasonpath =  "indents[0].indentDetails";
          let value = "material.code";
          let DuplicatItem = ValidateCard(state,dispatch,cardJsonPath,pagename,jasonpath,value)
          let InputQtyValue = "indentQuantity";
          let CompareQtyValue = "indentQuantity";
          let balanceQuantity = "balanceQty";
          let doubleqtyCheck = false
          let InvaldQtyCard = ValidateCardUserQty(state,dispatch,cardJsonPath,pagename,jasonpath,value,InputQtyValue,CompareQtyValue,balanceQuantity,doubleqtyCheck)
         
       
          if(DuplicatItem && DuplicatItem[0])
          {
            const LocalizationCodeValue = getLocalizationCodeValue("STORE_MATERIAL_DUPLICATE_VALIDATION")
            const LocalizationCodeValueZeroQty = getLocalizationCodeValue("STORE_MATERIAL_INVALLID_QTY_VALIDATION")
            if(!DuplicatItem[0].IsDuplicatItem && !InvaldQtyCard[0].IsZeroQty)
                    {

              // refresh card item
              var storeMappingTemp = [];
          let  storeMapping =  get(
            state.screenConfiguration.preparedFinalObject,
            `indents[0].indentDetails`,
            []
          );
          for(var i = 0; i < storeMapping.length; i++){
              if(storeMappingTemp.indexOf(storeMapping[i]) == -1){
                storeMappingTemp.push(storeMapping[i]);
              }
          }
          storeMappingTemp = storeMappingTemp.filter((item) => item.isDeleted === undefined || item.isDeleted !== false);
          if(storeMappingTemp.length>0)
          {
            dispatch(prepareFinalObject("indents[0].indentDetails",storeMappingTemp)
          );
            }
            if(activeStep ===1)
            moveToReview(dispatch)
            else
            changeStep(state, dispatch);
            }
            else{
              if(DuplicatItem[0].IsDuplicatItem)
              {
                const errorMessage = {
                  labelName: "Duplicate Material Added",
                  //labelKey:   `STORE_MATERIAL_DUPLICATE_VALIDATION ${DuplicatItem[0].duplicates}`
                  labelKey:   LocalizationCodeValue+' '+DuplicatItem[0].duplicates
                };
                dispatch(toggleSnackbar(true, errorMessage, "warning"));
              }
              else if (InvaldQtyCard[0].IsZeroQty)
              {
                const errorMessage = {                
                  labelName: "Quantity can not be Zero for",
                  labelKey:   LocalizationCodeValueZeroQty+' '+InvaldQtyCard[0].duplicates
                };
                dispatch(toggleSnackbar(true, errorMessage, "warning"));
              }
              
            }
          }
        }
        else
            changeStep(state, dispatch);
          
        }
        
        else{
          const errorMessage = {
            labelName: "Intenting Store and Issuing Store can not be same ",
            labelKey: "STORE_MATERIAL_INDENT_NOTE_STORE_SELECTION_VALIDATION"
          }; 
          dispatch(toggleSnackbar(true, errorMessage, "warning"));
        }
      }
     
    } else {
      const errorMessage = {
        labelName: "Please fill all fields",
        labelKey: "ERR_FILL_ALL_FIELDS"
      };
      dispatch(toggleSnackbar(true, errorMessage, "warning"));
    
  }
};

export const changeStep = (
  state,
  dispatch,
  mode = "next",
  defaultActiveStep = -1
) => {
  let activeStep = get(
    state.screenConfiguration.screenConfig["create-material-transfer-indent"],
    "components.div.children.stepper.props.activeStep",
    0
  );
  if (defaultActiveStep === -1) {
    activeStep = mode === "next" ? activeStep + 1 : activeStep - 1;
  } else {
    activeStep = defaultActiveStep;
  }

  const isPreviousButtonVisible = activeStep > 0 ? true : false;
  const isNextButtonVisible = activeStep < 2 ? true : false;
  const isPayButtonVisible = activeStep === 2 ? true : false;
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
  dispatchMultipleFieldChangeAction("create-material-transfer-indent", actionDefination, dispatch);
  renderSteps(activeStep, dispatch);
};

export const renderSteps = (activeStep, dispatch) => {
  switch (activeStep) {
    case 0:
      dispatchMultipleFieldChangeAction(
        "create-material-transfer-indent",
        getActionDefinationForStepper(
          "components.div.children.formwizardFirstStep"
        ),
        dispatch
      );
      break;
    case 1:
      dispatchMultipleFieldChangeAction(
        "create-material-transfer-indent",
        getActionDefinationForStepper(
          "components.div.children.formwizardSecondStep"
        ),
        dispatch
      );
      break;
    case 2:
      dispatchMultipleFieldChangeAction(
        "create-material-transfer-indent",
        getActionDefinationForStepper(
          "components.div.children.formwizardThirdStep"
        ),
        dispatch
      );
      break;
    case 3:
      dispatchMultipleFieldChangeAction(
        "create-material-transfer-indent",
        getActionDefinationForStepper(
          "components.div.children.formwizardFourthStep"
        ),
        dispatch
      );
      break;
    default:
      dispatchMultipleFieldChangeAction(
        "create-material-transfer-indent",
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
    {
      path: "components.div.children.formwizardFourthStep",
      property: "visible",
      value: false
    },
    {
      path: "components.div.children.formwizardFifthStep",
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
