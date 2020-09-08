import get from "lodash/get";
import {
  dispatchMultipleFieldChangeAction,
  getLabel
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import { toggleSnackbar,prepareFinalObject,handleScreenConfigurationFieldChange as handleField } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import {
  getCommonApplyFooter,
  ifUserRoleExists,
  validateFields,
  getLocalizationCodeValue
} from "../../utils";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import {ValidateCard, ValidateCardUserQty} from '../../../../../ui-utils/storecommonsapi'
const moveToReview = dispatch => {
  let indentNumber="",reviewUrl="";
  indentNumber = getQueryArg(window.location.href, "indentNumber");
  if(indentNumber)
    reviewUrl = `/egov-store-asset/review-purchase-order?indentNumber=${indentNumber}`;
  else
  reviewUrl = "/egov-store-asset/review-purchase-order";
  dispatch(setRoute(reviewUrl));
};

export const callBackForNext = async (state, dispatch) => {

  const {purchaseOrders}  = state.screenConfiguration.preparedFinalObject;
  let activeStep = get(
    state.screenConfiguration.screenConfig["create-purchase-order"],
    "components.div.children.stepper.props.activeStep",
    0
  );
  let isFormValid = true;
  if (activeStep === 0) {
    const ispurchaseOrderHeaderValid = validateFields(
      "components.div.children.formwizardFirstStep.children.purchaseOrderHeader.children.cardContent.children.purchaseOrderHeaderContainer.children",
      state,
      dispatch,
      "create-purchase-order"
    );
      const {advancePercentage} = purchaseOrders[0];

      if(advancePercentage && ( 0 > parseInt(advancePercentage,10) || parseInt(advancePercentage,10) > 100 )){
        const errorMessage = {
          labelName: "Percentage should be between 0 and 100",
          labelKey: "STORE_ERR_PERCENTAGE_IS_VALID"
        };
        dispatch(toggleSnackbar(true, errorMessage, "warning"));
        return;
      }


    if (!ispurchaseOrderHeaderValid) {
      isFormValid = false;
    }
  }
  if (activeStep === 1) {

    const isRCValid = validateFields(
      "components.div.children.formwizardSecondStep.children.contractDetails.children.cardContent.children.contractDetailsContainer.children",
      state,
      dispatch,
      "create-purchase-order"
    );
   
    if (!isRCValid) {
      isFormValid = false;
    }
  }
  if (activeStep === 2) {
    let poDetailsPath =
      "components.div.children.formwizardThirdStep.children.purchaseOrderDetails.children.cardContent.children.purchaseOrderDetailsCard.props.items";

    let poDetailsItems = get(
      state.screenConfiguration.screenConfig['create-purchase-order'],
      poDetailsPath,
      []
    );
    let isPoDetailsValid = true;
    for (var j = 0; j < poDetailsItems.length; j++) {
      if (
        (poDetailsItems[j].isDeleted === undefined ||
          poDetailsItems[j].isDeleted !== false) &&
        !validateFields(
          `${poDetailsPath}[${j}].item${j}.children.cardContent.children.poDetailsCardContainer.children`,
          state,
          dispatch,
          "create-purchase-order"
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
                  //validate duplicate card
  let cardJsonPath =
  "components.div.children.formwizardThirdStep.children.purchaseOrderDetails.children.cardContent.children.purchaseOrderDetailsCard.props.items";
  let pagename = `create-purchase-order`;
  let jasonpath =  "purchaseOrders[0].purchaseOrderDetails";
  let value = "material.code";
  let InputQtyValue = "orderQuantity";
  let CompareQtyValue = "indentQuantity";
  let DuplicatItem = ValidateCard(state,dispatch,cardJsonPath,pagename,jasonpath,value)
  let balanceQuantity = "balanceQuantity";
  let doubleqtyCheck = false
  let InvaldQtyCard = ValidateCardUserQty(state,dispatch,cardJsonPath,pagename,jasonpath,value,InputQtyValue,CompareQtyValue,balanceQuantity,doubleqtyCheck)
  if((DuplicatItem && DuplicatItem[0])||(InvaldQtyCard &&InvaldQtyCard[0]))
  {
    let LocalizationCodeValue = getLocalizationCodeValue("STORE_MATERIAL_DUPLICATE_VALIDATION")
    let LocalizationCodeValueQty = getLocalizationCodeValue("STORE_MATERIAL_INVALID_PO_QTY_VALIDATION")
    if(!DuplicatItem[0].IsDuplicatItem && !InvaldQtyCard[0].IsInvalidQty )
      {

        // refresh card item
        var storeMappingTemp = [];
    let  storeMapping =  get(
      state.screenConfiguration.preparedFinalObject,
      `purchaseOrders[0].purchaseOrderDetails`,
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
      dispatch(prepareFinalObject("purchaseOrders[0].purchaseOrderDetails",storeMappingTemp)
    );
      }
      moveToReview(dispatch);
    }
    else{
      if(DuplicatItem[0].IsDuplicatItem)
      {
        const errorMessage = {              
          labelName: "Duplicate Material Added",
          //labelKey:   `STORE_MATERIAL_DUPLICATE_VALIDATION ${DuplicatItem[0].duplicates}`
          // labelKey:   `${LocalizationCodeValue}` `${DuplicatItem[0].duplicates}`
          labelKey:   LocalizationCodeValue+' '+DuplicatItem[0].duplicates
        };
        dispatch(toggleSnackbar(true, errorMessage, "warning"));
      }
      else if (InvaldQtyCard[0].IsInvalidQty)
      {
        let indentNumber="";
        indentNumber = getQueryArg(window.location.href, "indentNumber");
        if(indentNumber){
        const errorMessage = {
        
          labelName: "Ordered Qty less then Indent Qty for",
          //labelKey:   `STORE_MATERIAL_DUPLICATE_VALIDATION ${DuplicatItem[0].duplicates}`
          // labelKey:   `${LocalizationCodeValue}` `${DuplicatItem[0].duplicates}`
          labelKey:   LocalizationCodeValueQty+' '+InvaldQtyCard[0].duplicates
        };
        dispatch(toggleSnackbar(true, errorMessage, "warning"));
      }
      else{
        moveToReview(dispatch);
      }

      }
      
      
    }
  }
  else{
      moveToReview(dispatch);
  }
      }
      else{
        //get po rate type if GEM them Price list info fill by user
        // for REM
        const {purchaseOrders}  = state.screenConfiguration.preparedFinalObject;
        const {rateType} = purchaseOrders[0];
        if(rateType.toLocaleUpperCase() === 'GEM')
        {
              
              dispatch(
              handleField(`create-purchase-order`,
              "components.div.children.formwizardSecondStep.children.contractDetails.children.cardContent.children.contractDetailsContainer.children.rateContractNumber",
              "props.disabled",false));
              
              dispatch(
              handleField(`create-purchase-order`,
              "components.div.children.formwizardSecondStep.children.contractDetails.children.cardContent.children.contractDetailsContainer.children.rateContractDate",
              "props.disabled",false));
              dispatch(
                handleField(`create-purchase-order`,
                "components.div.children.formwizardSecondStep.children.contractDetails.children.cardContent.children.contractDetailsContainer.children.agreementNumber",
                "props.disabled",false));
                
                dispatch(
                handleField(`create-purchase-order`,
                "components.div.children.formwizardSecondStep.children.contractDetails.children.cardContent.children.contractDetailsContainer.children.agreementDate",
                "props.disabled",false));
              dispatch(
                handleField(`create-purchase-order`,
                "components.div.children.formwizardSecondStep.children.contractDetails.children.cardContent.children.contractDetailsContainer.children.agreementStartDate",
                "props.disabled",false));
              dispatch(
                handleField(`create-purchase-order`,
                "components.div.children.formwizardSecondStep.children.contractDetails.children.cardContent.children.contractDetailsContainer.children.agreementEndDate",
                "props.disabled",false));
        }
        else{
              dispatch(
              handleField(`create-purchase-order`,
              "components.div.children.formwizardSecondStep.children.contractDetails.children.cardContent.children.contractDetailsContainer.children.rateContractNumber",
              "props.disabled",true));
              dispatch(
              handleField(`create-purchase-order`,
              "components.div.children.formwizardSecondStep.children.contractDetails.children.cardContent.children.contractDetailsContainer.children.rateContractDate",
              "props.disabled",true));
              dispatch(
                handleField(`create-purchase-order`,
                "components.div.children.formwizardSecondStep.children.contractDetails.children.cardContent.children.contractDetailsContainer.children.agreementNumber",
                "props.disabled",true));
                
                dispatch(
                handleField(`create-purchase-order`,
                "components.div.children.formwizardSecondStep.children.contractDetails.children.cardContent.children.contractDetailsContainer.children.agreementDate",
                "props.disabled",true));
              dispatch(
                handleField(`create-purchase-order`,
                "components.div.children.formwizardSecondStep.children.contractDetails.children.cardContent.children.contractDetailsContainer.children.agreementStartDate",
                "props.disabled",true));
              dispatch(
                handleField(`create-purchase-order`,
                "components.div.children.formwizardSecondStep.children.contractDetails.children.cardContent.children.contractDetailsContainer.children.agreementEndDate",
                "props.disabled",true));

        }
        
        changeStep(state, dispatch);
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
    state.screenConfiguration.screenConfig["create-purchase-order"],
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
  dispatchMultipleFieldChangeAction("create-purchase-order", actionDefination, dispatch);
  renderSteps(activeStep, dispatch);
};

export const renderSteps = (activeStep, dispatch) => {
  switch (activeStep) {
    case 0:
      dispatchMultipleFieldChangeAction(
        "create-purchase-order",
        getActionDefinationForStepper(
          "components.div.children.formwizardFirstStep"
        ),
        dispatch
      );
      break;
    case 1:
      dispatchMultipleFieldChangeAction(
        "create-purchase-order",
        getActionDefinationForStepper(
          "components.div.children.formwizardSecondStep"
        ),
        dispatch
      );
      break;
    case 2:
      dispatchMultipleFieldChangeAction(
        "create-purchase-order",
        getActionDefinationForStepper(
          "components.div.children.formwizardThirdStep"
        ),
        dispatch
      );
      break;
    case 3:
      dispatchMultipleFieldChangeAction(
        "create-purchase-order",
        getActionDefinationForStepper(
          "components.div.children.formwizardFourthStep"
        ),
        dispatch
      );
      break;
    default:
      dispatchMultipleFieldChangeAction(
        "create-purchase-order",
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
