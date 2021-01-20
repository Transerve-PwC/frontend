import { dispatchMultipleFieldChangeAction, getLabel } from "egov-ui-framework/ui-config/screens/specs/utils";
import { toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getTenantId, getUserInfo } from "egov-ui-kit/utils/localStorageUtils";
import get from "lodash/get";
import { createServiceRequest } from "../../../../../ui-utils/commons";
import { getCommonApplyFooter } from "../../utils";
import "./index.css";
  
  
  let role_name = JSON.parse(getUserInfo()).roles[0].code


  const callBackForNext = async (state, dispatch) => {
    
    
    
    let mediaobject = get(state, "form.newapplication.files.media", []);
  
  let media = []
  
  let addressDetail = []
  let services = []
    
  
  mediaobject.map((item, index) => {
    
    media.push(item.fileStoreId)
  
  });
  
  
  
   
    let serviceRequest = get(state,
      "screenConfiguration.preparedFinalObject.SERVICEREQUEST"
    );
    
  
    
    serviceRequest['city']= getTenantId(),
    serviceRequest['tenantId']= getTenantId(),
    serviceRequest['media'] = media,
    serviceRequest['latitude'] = '33.2222',
    serviceRequest['longitude'] = '24.33333',
    serviceRequest['device_id'] = '3333-111',
    serviceRequest['source'] = 'web'
    
  
  
    services.push(serviceRequest)
  
    console.log(services)
  
  
    
      let activeStep = 1;
      let isFormValid = 1;
      if (isFormValid) {
        let responseStatus = "success";
        if (activeStep === 1) {
          
            
          
          let status = 'INITIATED'
          let response = await createServiceRequest(state, dispatch, status);
          responseStatus = get(response, "status", "");
          let applicationId = get(response, "applicationId", "");
  
          if (responseStatus == "SUCCESS" || responseStatus == "success") {
            
           alert("your form submitted successfully")
            
            
            
          } else {
            
            
            let errorMessage = {
              labelName: "Submission Falied, Try Again later!",
              labelKey: "" 
            };
            dispatch(toggleSnackbar(true, errorMessage, "error"));
          }
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
      state.screenConfiguration.screenConfig["applysellmeat"],
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
    dispatchMultipleFieldChangeAction("applysellmeat", actionDefination, dispatch);
    renderSteps(activeStep, dispatch);
  };
  
  export const renderSteps = (activeStep, dispatch) => {
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
      
      
        
          
    
  };
  

  export const callBackForPrevious = (state, dispatch) => {
    changeStep(state, dispatch, "previous");
  };
  
  export const serviceDetailsFooter = getCommonApplyFooter({
    previousButton: {
      componentPath: "Button",
      props: {
        variant: "outlined",
        color: "primary",
        style: {
          
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
          
          height: "48px",
          marginRight: "45px"
        }
      },
      children: {
        nextButtonLabel: getLabel({
          labelName: "HC_SUBMIT",
          labelKey: "HC_SUBMIT_LABEL"
        }),
        nextButtonIcon: {
          uiFramework: "custom-atoms",
          componentPath: "Icon",
          props: {
            
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
  
  export const validatestepform = (activeStep, isFormValid, hasFieldToaster) => {
    let allAreFilled = true;
    if (activeStep == 1) {
      document.getElementById("apply_form" + activeStep).querySelectorAll("[required]").forEach(function (i) {
        
        
        if (!i.value) {
          i.focus();
          allAreFilled = false;
          i.parentNode.classList.add("MuiInput-error-853");
          i.parentNode.parentNode.classList.add("MuiFormLabel-error-844");
        }
        if (i.getAttribute("aria-invalid") === 'true' && allAreFilled) {
          i.parentNode.classList.add("MuiInput-error-853");
          i.parentNode.parentNode.classList.add("MuiFormLabel-error-844");
          allAreFilled = false;
          isFormValid = false;
          hasFieldToaster = true;
        }
      })
  
  
      document.getElementById("apply_form" + activeStep).querySelectorAll("input[type='hidden']").forEach(function (i) {
        
        
        if (i.value == i.placeholder) {
          
          i.focus();
          allAreFilled = false;
          i.parentNode.classList.add("MuiInput-error-853");
          i.parentNode.parentNode.parentNode.classList.add("MuiFormLabel-error-844");
          allAreFilled = false;
          isFormValid = false;
          hasFieldToaster = true;
        }
  
      })
    } 
    if (allAreFilled == false) {
      
      isFormValid = false;
      hasFieldToaster = true;
    }
    else {
      isFormValid = true;
      hasFieldToaster = false;
    }
    return [isFormValid, hasFieldToaster]
  };