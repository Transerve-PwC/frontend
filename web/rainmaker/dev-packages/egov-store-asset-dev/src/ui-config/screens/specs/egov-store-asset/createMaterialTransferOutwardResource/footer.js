import get from "lodash/get";
import {
  dispatchMultipleFieldChangeAction,
  getLabel
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import { toggleSnackbar,prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import {ValidateCard, ValidateCardUserQty} from '../../../../../ui-utils/storecommonsapi'
import {
  getCommonApplyFooter,
  ifUserRoleExists,
  epochToYmd,
  validateFields,
  getLocalizationCodeValue
} from "../../utils";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";

const moveToReview = dispatch => { 
  const reviewUrl = "/egov-store-asset/review-material-transfer-outward";
  dispatch(setRoute(reviewUrl));
};

export const callBackForNext = async (state, dispatch) => {

  let activeStep = get(
    state.screenConfiguration.screenConfig["create-material-transfer-outward"],
    "components.div.children.stepper.props.activeStep",
    0
  );
  let isFormValid = true;
  if (activeStep === 0) {
    const isMTHeaderValid = validateFields(
      "components.div.children.formwizardFirstStep.children.MTONHeader.children.cardContent.children.MTONHeaderContainer.children",
      state,
      dispatch,
      "create-material-transfer-outward"
    );
  
    if (!isMTHeaderValid) {
      isFormValid = false;
    }
  }
  if (activeStep === 2) {

  }
  if (activeStep === 1) {
    let poDetailsPath =
      "components.div.children.formwizardSecondStep.children.MTONDetails.children.cardContent.children.MTONDetailsCard.props.items";

    let poDetailsItems = get(
      state.screenConfiguration.screenConfig['create-material-transfer-outward'],
      poDetailsPath,
      []
    );
    let isPoDetailsValid = true;
    for (var j = 0; j < poDetailsItems.length; j++) {
      if (
        (poDetailsItems[j].isDeleted === undefined ||
          poDetailsItems[j].isDeleted !== false) &&
        !validateFields(
          `${poDetailsPath}[${j}].item${j}.children.cardContent.children.MTONDetailsCardContainer.children`,
          state,
          dispatch,
          "create-material-transfer-outward"
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
        if(activeStep===1)
        {
        let cardJsonPath =
          "components.div.children.formwizardSecondStep.children.MTONDetails.children.cardContent.children.MTONDetailsCard.props.items";
          let pagename = "create-material-transfer-outward";
          let jasonpath =  "materialIssues[0].materialIssueDetails";
          let value = "mrnNumber";
          let value2 ="";
          let DuplicatItem = ValidateCard(state,dispatch,cardJsonPath,pagename,jasonpath,value)
          let InputQtyValue = "userQuantityIssued";
          let CompareQtyValue = "indentQuantity";
          let balanceQuantity = "balanceQuantity";
        let doubleqtyCheck = true
          let InvaldQtyCard = ValidateCardUserQty(state,dispatch,cardJsonPath,pagename,jasonpath,value,InputQtyValue,CompareQtyValue,balanceQuantity,doubleqtyCheck)
       
          if((DuplicatItem && DuplicatItem[0])||(InvaldQtyCard &&InvaldQtyCard[0]))
          {
            let LocalizationCodeValue = getLocalizationCodeValue("STORE_MATERIAL_DUPLICATE_VALIDATION")
            let LocalizationCodeValueQty = getLocalizationCodeValue("STORE_MATERIAL_INVALID_INDENT_OT_QTY_VALIDATION")
            if((!DuplicatItem[0].IsDuplicatItem && !InvaldQtyCard[0].IsInvalidQty) &&  !InvaldQtyCard[0].IsZeroQty)
      {

              // refresh card item
              var storeMappingTemp = [];
          let  storeMapping =  get(
            state.screenConfiguration.preparedFinalObject,
            `materialIssues[0].materialIssueDetails`,
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
            dispatch(prepareFinalObject("materialIssues[0].materialIssueDetails",storeMappingTemp)
          );
            }
            if(activeStep ===1)
                  {
                   // let MaterialBalanceRate = get(state, "screenConfiguration.preparedFinalObject.mrnNumber",[]) 
                    let materialIssueDetails = get(state, "screenConfiguration.preparedFinalObject.materialIssues[0].materialIssueDetails",[]) 

                  //  let  receiptDate = materialIssueDetails.max(x=>x.receiptDate)
                  //  let  receiptDate_ = materialIssueDetails.min(x=>x.receiptDate)
                  var maxValObject = _.maxBy(materialIssueDetails, 'receiptDate');
                  var minValObject = _.minBy(materialIssueDetails, 'receiptDate');
                 
                   if(maxValObject)
                   {
                     
                     if(Number(maxValObject.receiptDate))
                     maxValObject = epochToYmd(maxValObject.receiptDate)
                     const  maxValObject_ = new Date(maxValObject)
                   //  alert(receiptDate)
                     let issueDate = get(
                       state.screenConfiguration.preparedFinalObject,
                       "materialIssues[0].issueDate",
                       null
                     );
                     if(Number(issueDate))
                     issueDate = epochToYmd(issueDate)
                   const  issueDate_ = new Date(issueDate)
                   if(issueDate_< maxValObject_)
                   {
                     let LocalizationCodeValueIssuedate = getLocalizationCodeValue("STORE_MATERIAL_ISSUE_DATE_VALIDATION")
                     const errorMessage = {
                       labelName: "Issue date should be greater than or equal to receipt date ",
                       labelKey: LocalizationCodeValueIssuedate+' '+maxValObject
                     }; 
                     dispatch(toggleSnackbar(true, errorMessage, "warning"));
                   }
                   else{
                    let indentDate = get(
                      state.screenConfiguration.preparedFinalObject,
                      "materialIssues[0].indent.indentDate",
                      null
                    );
                    dispatch(prepareFinalObject("materialIssues[0].indent.indentDate", epochToYmd(indentDate)));
                    moveToReview(dispatch)
                   }
                   }
                  }
            
            else
            changeStep(state, dispatch);
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
                // let indentNumber="";
                // indentNumber = getQueryArg(window.location.href, "indentNumber");
                // if(indentNumber){
                const errorMessage = {
                
                  labelName: "Ordered Qty less then Indent Qty for",
                  //labelKey:   `STORE_MATERIAL_DUPLICATE_VALIDATION ${DuplicatItem[0].duplicates}`
                  // labelKey:   `${LocalizationCodeValue}` `${DuplicatItem[0].duplicates}`
                  labelKey:   LocalizationCodeValueQty+' '+InvaldQtyCard[0].duplicates
                };
                dispatch(toggleSnackbar(true, errorMessage, "warning"));
             // }
              // else{
              //   changeStep(state, dispatch);
              // }
        
              }
              else if (InvaldQtyCard[0].IsZeroQty)
              {
                const LocalizationCodeValueZeroQty = getLocalizationCodeValue("STORE_MATERIAL_INVALLID_QTY_VALIDATION")
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
    state.screenConfiguration.screenConfig["create-material-transfer-outward"],
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
  dispatchMultipleFieldChangeAction("create-material-transfer-outward", actionDefination, dispatch);
  renderSteps(activeStep, dispatch);
};

export const renderSteps = (activeStep, dispatch) => {
  switch (activeStep) {
    case 0:
      dispatchMultipleFieldChangeAction(
        "create-material-transfer-outward",
        getActionDefinationForStepper(
          "components.div.children.formwizardFirstStep"
        ),
        dispatch
      );
      break;
    case 1:
      dispatchMultipleFieldChangeAction(
        "create-material-transfer-outward",
        getActionDefinationForStepper(
          "components.div.children.formwizardSecondStep"
        ),
        dispatch
      );
      break;
    case 2:
      dispatchMultipleFieldChangeAction(
        "create-material-transfer-outward",
        getActionDefinationForStepper(
          "components.div.children.formwizardThirdStep"
        ),
        dispatch
      );
      break;
    case 3:
      dispatchMultipleFieldChangeAction(
        "create-material-transfer-outward",
        getActionDefinationForStepper(
          "components.div.children.formwizardFourthStep"
        ),
        dispatch
      );
      break;
    default:
      dispatchMultipleFieldChangeAction(
        "create-material-transfer-outward",
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
