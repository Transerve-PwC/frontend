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
import { toggleSnackbar,prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import {
  getButtonVisibility,
  getCommonApplyFooter,
  ifUserRoleExists,
  validateFields,
  epochToYmd,
  getLocalizationCodeValue
} from "../../utils";
import {ValidateCard} from '../../../../../ui-utils/storecommonsapi'
// import "./index.css";

const moveToReview = dispatch => {
  const reviewUrl =
    process.env.REACT_APP_SELF_RUNNING === "true"
      ? `/egov-ui-framework/egov-store-asset/reviewindent`
      : `/egov-store-asset/reviewindent`;
  dispatch(setRoute(reviewUrl));
};

export const callBackForNext = async (state, dispatch) => {
  let activeStep = get(
    state.screenConfiguration.screenConfig["creatindent"],
    "components.div.children.stepper.props.activeStep",
    0
  );
  let isFormValid = true;
  if (activeStep === 0) {
    const isSupplierDetailsValid = validateFields(
      "components.div.children.formwizardFirstStep.children.MaterialIndentDetails.children.cardContent.children.IndentDetailsContainer.children",
      state,
      dispatch,
      "creatindent"
    );
    
    if (!(isSupplierDetailsValid)) {
      isFormValid = false;
    }
   // prepareDocumentsUploadData(state, dispatch,"pricelist");
  }
  if (activeStep === 1) {
    let MaterialDetailsCardPath =
      "components.div.children.formwizardSecondStep.children.MaterialIndentMapDetails.children.cardContent.children.MaterialIndentDetailsCard.props.items";
    let MasterDetailsItems = get(
      state.screenConfiguration.screenConfig.creatindent,
      MaterialDetailsCardPath,
      []
    );
    let isMasterDetailsValid = true;
    for (var j = 0; j < MasterDetailsItems.length; j++) {
      if (
        (MasterDetailsItems[j].isDeleted === undefined ||
          MasterDetailsItems[j].isDeleted !== false) &&
        !validateFields(
          `${MaterialDetailsCardPath}[${j}].item${j}.children.cardContent.children.storeDetailsCardContainer.children`,
          state,
          dispatch,
          "creatindent"
        )
      )
      isMasterDetailsValid = false;
    }
    if (!isMasterDetailsValid) {
      isFormValid = false
    }
    if(isFormValid)
    {
          //validate duplicate card
  let cardJsonPath =
  "components.div.children.formwizardSecondStep.children.MaterialIndentMapDetails.children.cardContent.children.MaterialIndentDetailsCard.props.items";
  let pagename = "creatindent";
  let jasonpath =  "indents[0].indentDetails";
  let value = "material.code";
  let DuplicatItem = ValidateCard(state,dispatch,cardJsonPath,pagename,jasonpath,value)
  if(DuplicatItem && DuplicatItem[0])
  {
    const LocalizationCodeValue = getLocalizationCodeValue("STORE_MATERIAL_DUPLICATE_VALIDATION")
    if(!DuplicatItem[0].IsDuplicatItem)
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
            moveToReview(dispatch);
          }
          else{
            const errorMessage = {
              labelName: "Duplicate Material Added",
              //labelKey:   `STORE_MATERIAL_DUPLICATE_VALIDATION ${DuplicatItem[0].duplicates}`
              labelKey:   LocalizationCodeValue+' '+DuplicatItem[0].duplicates
            };
            dispatch(toggleSnackbar(true, errorMessage, "warning"));
          }
  }
  else{
      moveToReview(dispatch);
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
  if (activeStep !== 1) {
    if (isFormValid) {
          // get date and validate  
    let indentDateValid = true
    let expectedDeliveryDateValid = true   
    const CurrentDate = new Date();
    let indentDate = get(
      state.screenConfiguration.preparedFinalObject,
      "indents[0].indentDate",
      null
    );
    let expectedDeliveryDate = get(
      state.screenConfiguration.preparedFinalObject,
      "indents[0].expectedDeliveryDate",
      null
    );
    
    if(Number(indentDate))
    indentDate = epochToYmd(indentDate)
    
    if(Number(expectedDeliveryDate))
    expectedDeliveryDate = epochToYmd(expectedDeliveryDate)
    
    const  indentDate_ = new Date(indentDate)
    const  expectedDeliveryDate_ = new Date(expectedDeliveryDate)  
    if(indentDate_>=CurrentDate)
    {
      indentDateValid = false
    }
    if(expectedDeliveryDate_<CurrentDate)
    {
      expectedDeliveryDateValid = false
    }
    if(!expectedDeliveryDateValid)
    {
      const errorMessage = {
        labelName: "Expected Delivery Date Must be greater then current date ",
        labelKey: "STORE_MATERIAL_INDENT_DELIVERY_DATE_VALIDATION"
      };
      dispatch(toggleSnackbar(true, errorMessage, "warning"));
    }
    else if (!indentDateValid)
    {
      const errorMessage = {
        labelName: "Indent Date Must be less then or equal current date",
        labelKey: "STORE_MATERIAL_INDENT_INDENT_DATE_VALIDATION"
      };
      dispatch(toggleSnackbar(true, errorMessage, "warning"));
    }
   else{  
    changeStep(state, dispatch);
      
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
    state.screenConfiguration.screenConfig["creatindent"],
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
  dispatchMultipleFieldChangeAction("creatindent", actionDefination, dispatch);
  renderSteps(activeStep, dispatch);
};

export const renderSteps = (activeStep, dispatch) => {
  switch (activeStep) {
    case 0:
      dispatchMultipleFieldChangeAction(
        "creatindent",
        getActionDefinationForStepper(
          "components.div.children.formwizardFirstStep"
        ),
        dispatch
      );
      break;
    case 1:
      dispatchMultipleFieldChangeAction(
        "creatindent",
        getActionDefinationForStepper(
          "components.div.children.formwizardSecondStep"
        ),
        dispatch
      );
      break;
    case 2:
      dispatchMultipleFieldChangeAction(
        "creatindent",
        getActionDefinationForStepper(
          "components.div.children.formwizardThirdStep"
        ),
        dispatch
      );
      break;
   
    default:
      dispatchMultipleFieldChangeAction(
        "creatindent",
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
