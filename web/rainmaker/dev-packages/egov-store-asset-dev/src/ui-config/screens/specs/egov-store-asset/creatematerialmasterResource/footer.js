import get from "lodash/get";
import {
  dispatchMultipleFieldChangeAction,
  getLabel
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import { toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import {
  getButtonVisibility,
  getCommonApplyFooter,
  ifUserRoleExists,
  validateFields,
  getLocalizationCodeValue
} from "../../utils";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { set } from "lodash";
// import "./index.css";

const moveToReview = dispatch => {
  const reviewUrl =
    process.env.REACT_APP_SELF_RUNNING === "true"
      ? `/egov-ui-framework/egov-store-asset/reviewmaterialmaster`
      : `/egov-store-asset/reviewmaterialmaster`;
  dispatch(setRoute(reviewUrl));
};

export const callBackForNext = async (state, dispatch) => {
  let activeStep = get(
    state.screenConfiguration.screenConfig["creatematerialmaster"],
    "components.div.children.stepper.props.activeStep",
    0
  );
  let isFormValid = true;
  if (activeStep === 0) {
    const isMaterialDetailsValid = validateFields(
      "components.div.children.formwizardFirstStep.children.MaterialMasterDetails.children.cardContent.children.MaterialDetailsContainer.children",
      state,
      dispatch,
      "creatematerialmaster"
    );
    
    if (!(isMaterialDetailsValid)) {
      isFormValid = false;
    }
  }
  if (activeStep === 1) {
    let storeDetailsCardPath =
      "components.div.children.formwizardSecondStep.children.storeDetails.children.cardContent.children.storeDetailsCard.props.items";
    let storeDetailsItems = get(
      state.screenConfiguration.screenConfig.creatematerialmaster,
      storeDetailsCardPath,
      []
    );
    let isstoreDetailsValid = true;
    for (var j = 0; j < storeDetailsItems.length; j++) {
      if (
        (storeDetailsItems[j].isDeleted === undefined ||
          storeDetailsItems[j].isDeleted !== false) &&
        !validateFields(
          `${storeDetailsCardPath}[${j}].item${j}.children.cardContent.children.storeDetailsCardContainer.children`,
          state,
          dispatch,
          "creatematerialmaster"
        )
      )
        isstoreDetailsValid = false;
    }
    if (!isstoreDetailsValid) {
      isFormValid = false
    }
  }
  if (activeStep === 2) {   
    const isPuchasingInformationValid = validateFields(
      "components.div.children.formwizardThirdStep.children.otherDetails.children.cardContent.children.View1.children.cardContent.children.PuchasingInformationContainer.children",
      state,
      dispatch,
      "creatematerialmaster"
    );
    const isStockingInformationValid = validateFields(
      "components.div.children.formwizardThirdStep.children.otherDetails.children.cardContent.children.View2.children.cardContent.children.StockingInformationContainer.children",
      state,
      dispatch,
      "creatematerialmaster"
    );
    const isSpecificationValid = validateFields(
      "components.div.children.formwizardThirdStep.children.otherDetails.children.cardContent.children.View3.children.cardContent.children.SpecificationContainer.children",
      state,
      dispatch,
      "creatematerialmaster"
    );
    
    if (!isPuchasingInformationValid || !isStockingInformationValid || !isSpecificationValid) {
      isFormValid = false;
    }
    if(isFormValid)
    {

    // get max and min Qty and validate  
    if(get(state.screenConfiguration.preparedFinalObject, "materials[0].maxQuantity") &&  get(state.screenConfiguration.preparedFinalObject, "materials[0].minQuantity"))
    {  
    let MaxQty =0
    let MinQty = 0
    MaxQty = Number( get(state.screenConfiguration.preparedFinalObject, "materials[0].maxQuantity"))
    MinQty = Number( get(state.screenConfiguration.preparedFinalObject, "materials[0].minQuantity"))
    if(MaxQty && MinQty &&  MinQty <=MaxQty)
    {
    }
 
    else{
     // pop earnning Message
     const errorMessage = {
      labelName: "Maximun Qty is greater then Minimum Qty",
      labelKey: "STORE_MATERIAL_MASTER_MAX_MIN_QTY_VALIDATION_MESSAGE"
    };
    dispatch(toggleSnackbar(true, errorMessage, "warning"));
    return;
    }
  }
      let IsDuplicatItem = false
      if(!IsDuplicatItem)
      {
        let  materials =  get(
          state.screenConfiguration.preparedFinalObject,
          `materials[0]`,
          []
        ); 
        let  storeMapping =  get(
          state.screenConfiguration.preparedFinalObject,
          `materials[0].storeMapping`,
          []
        ); 
        let id = get(
          state.screenConfiguration.preparedFinalObject,
          `materials[0].id`,
          0
        ); 
        if(id)
        {       
          for (let index = 0; index < storeMapping.length; index++) {
            const element = storeMapping[index];
            if(element.isDeleted === false)
            {
              //set Active false
             // set(materials[0], `storeMapping[${index}].active`, false);
              dispatch(
                prepareFinalObject(
                  `materials[0].storeMapping[${index}].active`,
                  false,
                )
              );
            }
            
          }
         // storeMapping = storeMapping.filter((item) => item.isDeleted === undefined || item.isDeleted !== false);
        }
        else{
       
          storeMapping = storeMapping.filter((item) => item.isDeleted === undefined || item.isDeleted !== false);

        }
        
       moveToReview(dispatch);
      }   
      else
      {
        const LocalizationCodeValue = getLocalizationCodeValue("STORE_MATERIAL_DUPLICATE_STORE_VALIDATION")
        const errorMessage = {
          labelName: "Duplicate Store Added",
          //labelKey:   `STORE_MATERIAL_DUPLICATE_STORE_VALIDATION ${DuplicatItem[0].duplicates}`
          labelKey:   LocalizationCodeValue+' '+DuplicatItem[0].duplicates
        };
        dispatch(toggleSnackbar(true, errorMessage, "warning"));

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
      let IsDuplicatItem = false
       // check duplicat Item 
       let cardJsonPath =
       "components.div.children.formwizardSecondStep.children.storeDetails.children.cardContent.children.storeDetailsCard.props.items";
     let CardItem = get(
       state.screenConfiguration.screenConfig.creatematerialmaster,
       cardJsonPath,
       []
     );

    // CardItem = CardItem.filter((item) => item.isDeleted === undefined || item.isDeleted !== false);
    // console.log(CardItem)
    let matcode =[];
     for (let index = 0; index < CardItem.length; index++) {
       
       if(CardItem[index].isDeleted === undefined ||
        CardItem[index].isDeleted !== false)
        {
          let code = get(state.screenConfiguration.preparedFinalObject,`materials[0].storeMapping[${index}].store.code`,'')        
          matcode.push(code)
        }
        else{
          let code_ = get(state.screenConfiguration.preparedFinalObject,`materials[0].storeMapping[${index}].store.code`,'')        
        }      
     } 
        var uniq = matcode
      .map((name) => {
        return {
          count: 1,
          name: name
        }
      })
      .reduce((a, b) => {
        a[b.name] = (a[b.name] || 0) + b.count
        return a
      }, {})    

      var duplicates = Object.keys(uniq).filter((a) => uniq[a] > 1)
      var unoque = Object.keys(uniq).filter((a) => uniq[a] === 1)
      if(duplicates.length>0)
      {
      duplicates= duplicates.map(itm => {
          return `${itm}`;
        })
        .join() || "-"
        IsDuplicatItem = true;
        
      }     
      if(!IsDuplicatItem)
      {
        // remove duplicate item form card
        // //CardItem = CardItem.filter(x=x.)
        // CardItem = CardItem.filter((item) => item.isDeleted === undefined || item.isDeleted !== false);
        var storeMappingTemp = [];
        let  storeMapping =  get(
          state.screenConfiguration.preparedFinalObject,
          `materials[0].storeMapping`,
          []
        );
        for(var i = 0; i < storeMapping.length; i++){
            if(storeMappingTemp.indexOf(storeMapping[i]) == -1){
              storeMappingTemp.push(storeMapping[i]);
            }
        }
        //materials[0].storeMapping
        let id = get(
          state.screenConfiguration.preparedFinalObject,
          `materials[0].id`,
          0
        ); 
        if(id)
        {
          
          let  materials =  get(
            state.screenConfiguration.preparedFinalObject,
            `materials[0]`,
            []
          ); 
          for (let index = 0; index < storeMappingTemp.length; index++) {
            const element = storeMappingTemp[index];
            if(element.isDeleted === false)
            {
              //set Active false
             // set(materials[0], `storeMapping[${index}].active`, false);
              dispatch(
                prepareFinalObject(
                  `materials[0].storeMapping[${index}].active`,
                  false,
                )
              );
            }
            
          }
         // storeMapping = storeMapping.filter((item) => item.isDeleted === undefined || item.isDeleted !== false);
        }
        else{
         
          storeMappingTemp = storeMappingTemp.filter((item) => item.isDeleted === undefined || item.isDeleted !== false);

        }
        

        if(storeMappingTemp.length>0)
        {
           dispatch(
          prepareFinalObject(
            "materials[0].storeMapping",
            storeMappingTemp,
          )
        );
          }
      changeStep(state, dispatch);
      }
      else{

       const LocalizationCodeValue = getLocalizationCodeValue("STORE_MATERIAL_DUPLICATE_STORE_VALIDATION")
        const errorMessage = {
          labelName: "Duplicate Material Added",
          //labelKey:   `STORE_MATERIAL_DUPLICATE_STORE_VALIDATION ${DuplicatItem[0].duplicates}`
          labelKey:   LocalizationCodeValue+' '+duplicates
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
    state.screenConfiguration.screenConfig["creatematerialmaster"],
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
  dispatchMultipleFieldChangeAction("creatematerialmaster", actionDefination, dispatch);
  renderSteps(activeStep, dispatch);
};

export const renderSteps = (activeStep, dispatch) => {
  switch (activeStep) {
    case 0:
      dispatchMultipleFieldChangeAction(
        "creatematerialmaster",
        getActionDefinationForStepper(
          "components.div.children.formwizardFirstStep"
        ),
        dispatch
      );
      break;
    case 1:
      dispatchMultipleFieldChangeAction(
        "creatematerialmaster",
        getActionDefinationForStepper(
          "components.div.children.formwizardSecondStep"
        ),
        dispatch
      );
      break;
    case 2:
      dispatchMultipleFieldChangeAction(
        "creatematerialmaster",
        getActionDefinationForStepper(
          "components.div.children.formwizardThirdStep"
        ),
        dispatch
      );
      break;
    case 3:
      dispatchMultipleFieldChangeAction(
        "creatematerialmaster",
        getActionDefinationForStepper(
          "components.div.children.formwizardFourthStep"
        ),
        dispatch
      );
      break;
    default:
      dispatchMultipleFieldChangeAction(
        "creatematerialmaster",
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
