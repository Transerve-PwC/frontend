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
import { getTenantId } from "egov-ui-kit/utils/localStorageUtils";
import { getSearchResults } from "../../../../../ui-utils/commons";
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
      // const {advancePercentage} = purchaseOrders[0];
      
      // if(advancePercentage && ( 0 > parseInt(advancePercentage,10) || parseInt(advancePercentage,10) > 100 )){
      //   const errorMessage = {
      //     labelName: "Percentage should be between 0 and 100",
      //     labelKey: "STORE_ERR_PERCENTAGE_IS_VALID"
      //   };
      //   dispatch(toggleSnackbar(true, errorMessage, "warning"));
      //   return;
      // }
    //set price list
    const {purchaseOrders}  = state.screenConfiguration.preparedFinalObject;
    const {rateType} = purchaseOrders[0];
    const {supplier} = purchaseOrders[0];
    const fields = get(
      state.screenConfiguration.screenConfig[`create-purchase-order`],
      "components.div.children.formwizardFirstStep.children.purchaseOrderHeader.children.cardContent.children.purchaseOrderHeaderContainer.children",
      {}
    );
    let priceList = [{rateContractNumber:"",rateContractDate:"",agreementNumber:"",agreementDate:"",agreementStartDate:"",agreementEndDate:""}];
    if(rateType)
    {
     if(rateType.toLocaleUpperCase() !== 'GEM')
     { 
      const queryObject = [{ key: "tenantId", value: getTenantId()},{ key: "suppliers", value: supplier.code}]; 
    getSearchResults(queryObject, dispatch,"priceList")
    .then(response =>{
      if(response){
       
        
       if(rateType)
       {
        if(rateType.toLocaleUpperCase() === 'GEM')
        {
          priceList =null;          
          // priceList[0].rateContractNumber  =  "";
          // priceList[0].rateContractDate   = new Date().toISOString().slice(0, 10);
          // priceList[0].agreementNumber   =   "";
          // priceList[0].agreementDate   =   new Date().toISOString().slice(0, 10);
          // priceList[0].agreementStartDate   = new Date().toISOString().slice(0, 10);
          // priceList[0].agreementEndDate   =  new Date().toISOString().slice(0, 10);
          const {purchaseOrders}  = state.screenConfiguration.preparedFinalObject;
          const {supplier} = purchaseOrders[0];
          dispatch(prepareFinalObject("purchaseOrders[0].supplier.name", supplier.code));

        }
        else{
          if(response.priceLists[0])
          {
          priceList[0].rateContractNumber  =  response.priceLists[0].rateContractNumber === null?'':response.priceLists[0].rateContractNumber;
          priceList[0].rateContractDate   = new Date(response.priceLists[0].rateContractDate).toISOString().substr(0,10);
          priceList[0].agreementNumber   =   response.priceLists[0].agreementNumber === null?'':response.priceLists[0].agreementNumber;
          priceList[0].agreementDate   =   new Date(response.priceLists[0].agreementDate).toISOString().substr(0,10);
          priceList[0].agreementStartDate   = new Date(response.priceLists[0].agreementStartDate).toISOString().substr(0,10);
          priceList[0].agreementEndDate   =  new Date(response.priceLists[0].agreementEndDate).toISOString().substr(0,10);
          }
        }
      }
       
        dispatch(prepareFinalObject("searchMaster.priceList", response.priceLists));  
        dispatch(prepareFinalObject("purchaseOrders[0].priceList", priceList));    
           
       }
      });
    }
    else
    {
      priceList =null;          
      // priceList[0].rateContractNumber  =  "";
      // priceList[0].rateContractDate   = new Date().toISOString().slice(0, 10);
      // priceList[0].agreementNumber   =   "";
      // priceList[0].agreementDate   =   new Date().toISOString().slice(0, 10);
      // priceList[0].agreementStartDate   = new Date().toISOString().slice(0, 10);
      // priceList[0].agreementEndDate   =  new Date().toISOString().slice(0, 10);
      const {purchaseOrders}  = state.screenConfiguration.preparedFinalObject;
      const {supplier} = purchaseOrders[0];
      dispatch(prepareFinalObject("purchaseOrders[0].supplier.name", supplier.code));
     // dispatch(prepareFinalObject("searchMaster.priceList", response.priceLists));  
        dispatch(prepareFinalObject("purchaseOrders[0].priceList", priceList)); 
        const {externalPoNumber} = purchaseOrders[0];

        if(fields.supplierGem!==undefined )
        {
          if(fields.supplierGem.isFieldValid ===true)
          {          
            if(!externalPoNumber){
            const errorMessage = {
            labelName: "Enter valid external PO number",
            labelKey: "STORE_VALIDATION_EXTERNAL_PO_NUMBER"
          };
          dispatch(toggleSnackbar(true, errorMessage, "warning"));
          return;
        }
    }
      }

    }
  }
    //
    
    if (!ispurchaseOrderHeaderValid) {
        if(rateType !== undefined)
        {
      if(rateType.toLocaleUpperCase() !== 'GEM')
      {
      const tenantId = getQueryArg(window.location.href, "tenantId");
      const poNumber = getQueryArg(window.location.href, "poNumber");
      const step = getQueryArg(window.location.href, "step");
      
      if(tenantId && poNumber)
      {
        isFormValid = true;
      }
      else if(step)
      isFormValid = true;
      else 
      {
        
        if(fields.purchaseType!==undefined 
          &&fields.storeName!==undefined 
          &&fields.purchaseOrderDate!==undefined 
          &&fields.rateType!==undefined       
          &&fields.deliveryTerms!==undefined       
          &&fields.supplier!==undefined 
          &&fields.expectedDeliveryDate!==undefined 
          
         ) 
          {
            if(fields.purchaseType.isFieldValid ===false 
              ||fields.storeName.isFieldValid ===false 
              ||fields.purchaseOrderDate.isFieldValid ===false 
              ||fields.rateType.isFieldValid ===false           
              ||fields.deliveryTerms.isFieldValid ===false           
              ||fields.supplier.isFieldValid ===false 
              ||fields.expectedDeliveryDate.isFieldValid ===false                
              )
              {
                isFormValid = false;
              }
              else
              {
               
                isFormValid = true;
              }
          }
     
      }

      }
      else
      {
        //  dispatch(
        //   handleField(
        //     `create-purchase-order`,
        //     "components.div.children.formwizardFirstStep.children.purchaseOrderHeader.children.cardContent.children.purchaseOrderHeaderContainer.children.supplierGem",
        //     "props.value",
        //     ''
        //   )
        // );
        // dispatch(
        //   handleField(
        //     `create-purchase-order`,
        //     "components.div.children.formwizardFirstStep.children.purchaseOrderHeader.children.cardContent.children.purchaseOrderHeaderContainer.children.externalPoNumber",
        //     "props.value",
        //     ''
        //   )
        // );
        // isFormValid = false;
        if(fields.purchaseType!==undefined 
          &&fields.storeName!==undefined 
          &&fields.purchaseOrderDate!==undefined 
          &&fields.rateType!==undefined       
          &&fields.deliveryTerms!==undefined       
          &&fields.supplierGem!==undefined 
          &&fields.expectedDeliveryDate!==undefined 
          
         ) 
          {
            if(fields.purchaseType.isFieldValid ===false 
              ||fields.storeName.isFieldValid ===false 
              ||fields.purchaseOrderDate.isFieldValid ===false 
              ||fields.rateType.isFieldValid ===false           
              ||fields.deliveryTerms.isFieldValid ===false           
              ||fields.supplierGem.isFieldValid ===false 
              ||fields.expectedDeliveryDate.isFieldValid ===false                
              )
              {
                isFormValid = false;
              }
              else
              {
               
                isFormValid = true;
              }
          }
      }
      
    }
    else
    isFormValid = false
     
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
    if((!DuplicatItem[0].IsDuplicatItem && !InvaldQtyCard[0].IsInvalidQty) &&  !InvaldQtyCard[0].IsZeroQty)
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
        let totalIndentQty =  get(state.screenConfiguration.preparedFinalObject,`materialIssues[0].totalIndentQty`,0)
        let totalQty =  get(state.screenConfiguration.preparedFinalObject,`materialIssues[0].totalQty`,0)
        if(totalQty>totalIndentQty)
        {
          const errorMessage = {
          
            labelName: "Total issued quantity can not be greater than Indent quantity",
            labelKey:   "STORE_TOTAL_QUANTITY_ISSUED_VALIDATION"
          };
          dispatch(toggleSnackbar(true, errorMessage, "warning"));
        }
        else
        moveToReview(dispatch)
     // moveToReview(dispatch);
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
      else if (InvaldQtyCard[0].IsZeroQty)
      {
        let indentNumber="";
        const LocalizationCodeValueZeroQty = getLocalizationCodeValue("STORE_MATERIAL_INVALLID_QTY_VALIDATION")
        indentNumber = getQueryArg(window.location.href, "indentNumber");
        const {purchaseOrders}  = state.screenConfiguration.preparedFinalObject;
        const {purchaseType} = purchaseOrders[0];
        if(indentNumber ||  purchaseType ==='Non Indent'){
        const errorMessage = {
        
          labelName: "Quantity can not be Zero for",
          //labelKey:   `STORE_MATERIAL_DUPLICATE_VALIDATION ${DuplicatItem[0].duplicates}`
          // labelKey:   `${LocalizationCodeValue}` `${DuplicatItem[0].duplicates}`
          labelKey:   LocalizationCodeValueZeroQty+' '+InvaldQtyCard[0].duplicates
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
  const {purchaseOrders}  = state.screenConfiguration.preparedFinalObject;
  const {rateType} = purchaseOrders[0];
  if (defaultActiveStep === -1) {
    activeStep = mode === "next" ? activeStep + 1 : activeStep - 1;
    if(rateType.toLocaleUpperCase() === 'GEM' && mode ==='previous')
    {
      activeStep = activeStep-1;
    }
  } else {
    activeStep = defaultActiveStep;
  }
 
      if(rateType.toLocaleUpperCase() === 'GEM' && mode ==='next')
      {
        activeStep = activeStep +1;
      }
      else if(rateType.toLocaleUpperCase() === 'GEM' && mode ==='previous')
      {
        activeStep = activeStep;
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
  renderSteps(activeStep, dispatch,state);
};

export const renderSteps = (activeStep, dispatch,state) => {
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
      const {purchaseOrders}  = state.screenConfiguration.preparedFinalObject;
      const {rateType} = purchaseOrders[0];
      if(rateType.toLocaleUpperCase() !== 'GEM')
      {
        dispatchMultipleFieldChangeAction(
          "create-purchase-order",
          getActionDefinationForStepper(
            "components.div.children.formwizardSecondStep"
          ),
          dispatch
        );

      }
      else
      {
        dispatchMultipleFieldChangeAction(
          "create-purchase-order",
          getActionDefinationForStepper(
            "components.div.children.formwizardThirdStep"
          ),
          dispatch
        );

      }
     
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
