import get from "lodash/get";
import {
  dispatchMultipleFieldChangeAction,
  getLabel
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import { toggleSnackbar ,prepareFinalObject} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import {ValidateCard, ValidateCardQty} from '../../../../../ui-utils/storecommonsapi'
import {
  getButtonVisibility,
  getCommonApplyFooter,
  ifUserRoleExists,
  epochToYmd,
  validateFields,
  getLocalizationCodeValue
} from "../../utils";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
// import "./index.css";

const moveToReview = dispatch => {
  const IndentId = getQueryArg(window.location.href, "IndentId");
  const reviewUrl =
    process.env.REACT_APP_SELF_RUNNING === "true"
      ? `/egov-ui-framework/egov-store-asset/reviewmaterialtransferinword?step=0`
      : `/egov-store-asset/reviewmaterialtransferinword?step=0`;
  dispatch(setRoute(reviewUrl));
};

export const callBackForNext = async (state, dispatch) => {
  let activeStep = get(
    state.screenConfiguration.screenConfig["createMaterialTransferInword"],
    "components.div.children.stepper.props.activeStep",
    0
  );
  let isFormValid = true;
  if (activeStep === 0) {
    const isMaterialDetailsValid = validateFields(
      "components.div.children.formwizardFirstStep.children.MaterialTransferInwordNote.children.cardContent.children.MaterialReceiptNoteContainer.children",
      state,
      dispatch,
      "createMaterialTransferInword"
    );
    
    if (!(isMaterialDetailsValid)) {
      isFormValid = false;
    }
  }
  if (activeStep === 1) {
    let storeDetailsCardPath =
      "components.div.children.formwizardSecondStep.children.MaterialTransferInwordDetail.children.cardContent.children.MaterialTransferInwordCard.props.items";
    let storeDetailsItems = get(
      state.screenConfiguration.screenConfig.createMaterialTransferInword,
      storeDetailsCardPath,
      []
    );
    let isstoreDetailsValid = true;
    for (var j = 0; j < storeDetailsItems.length; j++) {
      if (
        (storeDetailsItems[j].isDeleted === undefined ||
          storeDetailsItems[j].isDeleted !== false) &&
        !validateFields(
          `${storeDetailsCardPath}[${j}].item${j}.children.cardContent.children.materialReceiptCardContainer.children`,
          state,
          dispatch,
          "createMaterialTransferInword"
        )
      )
        isstoreDetailsValid = false;
    }
    if (!isstoreDetailsValid) {
      isFormValid = false
    }
  }
  if (activeStep === 2) {   
    let isPuchasingInformationValid = validateFields(
      "components.div.children.formwizardThirdStep.children.otherDetails.children.cardContent.children.View1.children.cardContent.children.PuchasingInformationContainer.children",
      state,
      dispatch,
      "createMaterialTransferInword"
    );
    isPuchasingInformationValid = true;
    
    if (!isPuchasingInformationValid) {
      isFormValid = false;
    }
    if(isFormValid)
    {

    
    if(true)
    moveToReview(dispatch);
    else{
    

    }
    
  }
    else{

      const errorMessage = {
        labelName: "Please fill all fields",
        labelKey: "ERR_FILL_ALL_FIELDS"
      };
      dispatch(toggleSnackbar(true, errorMessage, "warning"));

    }
  }
  if (activeStep !== 2) {
    if (isFormValid) {
        
      const CurrentDate = new Date();

      let receiptDate = get(
        state.screenConfiguration.preparedFinalObject,
        "transferInwards[0].receiptDate",
        null
      );

    
      if(Number(receiptDate))
      receiptDate = epochToYmd(receiptDate)

      const  receiptDate_ = new Date(receiptDate)

      let IsValidDate = true
      let IsValidStartDate = true  
      if(receiptDate_>CurrentDate )
    {
      IsValidDate = false
    }
    if(IsValidDate)
    {
      let cardJsonPath =
      "components.div.children.formwizardSecondStep.children.MaterialTransferInwordDetail.children.cardContent.children.MaterialTransferInwordCard.props.items";
      let pagename = "createMaterialTransferInword";
      let jasonpath =  "transferInwards[0].receiptDetails";
      let value = "material.code";
      let value2 ="";
      let DuplicatItem = ValidateCard(state,dispatch,cardJsonPath,pagename,jasonpath,value)
      let InputQtyValue = "userReceivedQty";
      let CompareQtyValue = "quantityIssued";
      let balanceQuantity = "balanceQuantity";
    let doubleqtyCheck = false
      let InvaldQtyCard = ValidateCardQty(state,dispatch,cardJsonPath,pagename,jasonpath,value,InputQtyValue,CompareQtyValue,balanceQuantity,doubleqtyCheck)
   
      if((DuplicatItem && DuplicatItem[0])||(InvaldQtyCard &&InvaldQtyCard[0]))
      {
        let LocalizationCodeValue = getLocalizationCodeValue("STORE_MATERIAL_DUPLICATE_VALIDATION")
        let LocalizationCodeValueQty = getLocalizationCodeValue("STORE_MATERIAL_INVALID_MISC_RECEIPT_QTY_VALIDATION")
        if(!DuplicatItem[0].IsDuplicatItem && !InvaldQtyCard[0].IsInvalidQty )
  {

          // refresh card item
          var storeMappingTemp = [];
      let  storeMapping =  get(
        state.screenConfiguration.preparedFinalObject,
        `transferInwards[0].receiptDetails`,
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
        dispatch(prepareFinalObject("transferInwards[0].receiptDetails",storeMappingTemp)
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
              labelKey:   LocalizationCodeValue+' '+DuplicatItem[0].duplicates
            };
            dispatch(toggleSnackbar(true, errorMessage, "warning"));
          }
          else if (InvaldQtyCard[0].IsInvalidQty)
          {
            
            const errorMessage = {
            
              labelName: "Ordered Qty less then Indent Qty for",              
              labelKey:   LocalizationCodeValueQty+' '+InvaldQtyCard[0].duplicates
            };
            dispatch(toggleSnackbar(true, errorMessage, "warning"));
        
    
          }

        }
      }

      }
      else{
        const errorMessage = {
          labelName: "Input Date Must be less then or equal to current date",
          labelKey: "STORE_MATERIAL_MASTER_CURRENT_DATE_VALIDATION"
        };
        dispatch(toggleSnackbar(true, errorMessage, "warning"));

      }
     
    } 
    else {
      const errorMessage = {
        labelName: "Please fill all fields",
        labelKey: "ERR_FILL_ALL_FIELDS"
      };
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
    state.screenConfiguration.screenConfig["createMaterialTransferInword"],
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
  dispatchMultipleFieldChangeAction("createMaterialTransferInword", actionDefination, dispatch);
  renderSteps(activeStep, dispatch);
};

export const renderSteps = (activeStep, dispatch) => {
  switch (activeStep) {
    case 0:
      dispatchMultipleFieldChangeAction(
        "createMaterialTransferInword",
        getActionDefinationForStepper(
          "components.div.children.formwizardFirstStep"
        ),
        dispatch
      );
      break;
    case 1:
      dispatchMultipleFieldChangeAction(
        "createMaterialTransferInword",
        getActionDefinationForStepper(
          "components.div.children.formwizardSecondStep"
        ),
        dispatch
      );
      break;
    case 2:
      dispatchMultipleFieldChangeAction(
        "createMaterialTransferInword",
        getActionDefinationForStepper(
          "components.div.children.formwizardThirdStep"
        ),
        dispatch
      );
      break;
    case 3:
      dispatchMultipleFieldChangeAction(
        "createMaterialTransferInword",
        getActionDefinationForStepper(
          "components.div.children.formwizardFourthStep"
        ),
        dispatch
      );
      break;
    default:
      dispatchMultipleFieldChangeAction(
        "createMaterialTransferInword",
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
