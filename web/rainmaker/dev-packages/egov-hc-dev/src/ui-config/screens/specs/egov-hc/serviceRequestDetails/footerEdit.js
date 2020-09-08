import { getLabel } from "egov-ui-framework/ui-config/screens/specs/utils";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import { toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getapplicationNumber, getTenantId, getUserInfo } from "egov-ui-kit/utils/localStorageUtils";
import get from "lodash/get";
import { EditServiceRequest, furnishServiceRequestDetailResponseForEdit, commonConfig } from "../../../../../ui-utils/commons";
import { getCommonApplyFooter } from "../../utils";
import "./index.css";
import {  handleScreenConfigurationFieldChange as handleField} from "egov-ui-framework/ui-redux/screen-configuration/actions";  
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
  
export const getRedirectionURL = () => {
  const redirectionURL = `/egov-hc/search-preview?applicationNumber=${getapplicationNumber()}&tenantId=${getTenantId()}`;
  return redirectionURL;
  };

  const callBackForNext = async (state, dispatch) => {
   
  let servicerequestmedia = get(state, "form.newapplication.files.media", []);
  
  let activeStep = 1;
  let isFormValid = false;
  let hasFieldToaster = false;
  let services = [];

  
  let serviceRequest = get(state,
    "screenConfiguration.preparedFinalObject.SERVICEREQUEST"
  );

  
  let media =[]
  let uploadImage = get(state, "form.newapplication.files.media", []);
  uploadImage.map((item, index) => {
    media.push(item.fileStoreId)
  });

  

  let typeOfService = get(state, "screenConfiguration.preparedFinalObject.SERVICEREQUEST.serviceType", "");

  let validatestepformflag;
  let validationPaused;


  if (typeOfService== ""){
    typeOfService = get(state, "screenConfiguration.screenConfig.servicerequest.components.div.children.formwizardFirstStep.children.servicerequestdetails.children.cardContent.children.servicerequestdetailsContainer.children.typeofrequest.props.value.label")
  } 
   

  
  if(!typeOfService){
    dispatch(
      toggleSnackbar(
        true,
        { labelName: "ERROR", labelKey: "HC_SERVICE_TYPE_ERROR" },
        "warning"
      )
    );
  }
  else if(typeOfService)
  {
    validatestepformflag = validatestepform(state, dispatch, serviceRequest);
    isFormValid = validatestepformflag[0];
    hasFieldToaster = validatestepformflag[1];
    validationPaused = validatestepformflag[2];
    services.push(serviceRequest)

  }

  // Field validation 
  if(isFormValid === true && validationPaused==false)
  {
    let treeCount = get(state, "screenConfiguration.preparedFinalObject.SERVICEREQUEST.treeCount");
    let description = get(state, "screenConfiguration.preparedFinalObject.SERVICEREQUEST.description");
    let houseNoAndStreetName = get(state, "screenConfiguration.preparedFinalObject.SERVICEREQUEST.houseNoAndStreetName");
    let landmark = get(state, "screenConfiguration.preparedFinalObject.SERVICEREQUEST.landmark");
    let ownerName = get(state, "screenConfiguration.preparedFinalObject.SERVICEREQUEST.ownerName");
    let contactNumber = get(state, "screenConfiguration.preparedFinalObject.SERVICEREQUEST.contactNumber");
    let email = get(state, "screenConfiguration.preparedFinalObject.SERVICEREQUEST.email");
    let locality = get(state, "screenConfiguration.preparedFinalObject.SERVICEREQUEST.mohalla");
    let serviceType = get(state, "screenConfiguration.preparedFinalObject.SERVICEREQUEST.serviceType");
   
    let validationErrorMsg = ""
    let flagValidField = true;

    if (locality == undefined){
      
    }
    

    if(! /^(0?[1-9]|[1-9][0-9])$/.test(treeCount))
    {
      validationErrorMsg = { labelName: "ERROR", labelKey: "HC_TREE_COUNT_ERROR" };
      flagValidField = false;
    }
    else if(parseInt(treeCount)===0)
    {
      validationErrorMsg = { labelName: "ERROR", labelKey: "HC_TREE_COUNT_ERROR" };
      flagValidField = false;
    }
    else if(! /^[a-zA-Z0-9#$%&?@/!~^*()_+`=|{}<>.[\\\],''"":;\s,'-]{1,256}$/.test(description))
    {
      validationErrorMsg = { labelName: "ERROR", labelKey: "HC_FIELD_DESCRIPTION_ERROR" };
      flagValidField = false;
    }
    else if(! /^[a-zA-Z0-9#$%&@/.,''"":;\s,'-]{1,256}$/.test(houseNoAndStreetName))
    {
      validationErrorMsg = { labelName: "ERROR", labelKey: "HC_FIELD_HOUSE_NO_ERROR" };
      flagValidField = false;
    }
    else if(! /^[a-zA-Z0-9#$%&@/.,''"":;\s,'-]{0,256}$/.test(landmark) )
    {
      validationErrorMsg = { labelName: "ERROR", labelKey: "HC_FIELD_LANDMARK_ERROR" };
      flagValidField = false;
    }
    else if(! /^[a-zA-Z\s\\/\-]{1,256}$/.test(ownerName))
    {
      validationErrorMsg = { labelName: "ERROR", labelKey: "HC_FIELD_OWNER_NAME_ERROR" };
      flagValidField = false;
    }
    else if(! /^[0-9]{10}$/.test(contactNumber))
    {
      validationErrorMsg = { labelName: "ERROR", labelKey: "HC_CONTACT_NUMBER_ERROR" };
      flagValidField = false;
    }
    else if(! /^(?=^.{1,256}$)((([^<>()\[\]\\.,;:\s$*@'"]+(\.[^<>()\[\]\\.,;:\s@'"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,})))$/.test(email))
    {
      validationErrorMsg = { labelName: "ERROR", labelKey: "HC_FIELD_EMAIL_ERROR" };
      flagValidField = false;
    }
  
    if(flagValidField === false)
    {
      dispatch(
        toggleSnackbar(
          true,
          validationErrorMsg,
          "warning"
        )
       );
      
    }
    var workflowProcessInstanceArray = []
      workflowProcessInstanceArray = get(state,"screenConfiguration.preparedFinalObject.workflow.ProcessInstances")
      var processInstanceCurrentState = workflowProcessInstanceArray[workflowProcessInstanceArray.length - 1].state.state

      if (isFormValid && flagValidField) {
      
        if (typeOfService != undefined && locality != undefined )
    {if (activeStep === 1) { 
          let status = 'INITIATED'
          var tenantIdCommonConfig
          if (getTenantId() != commonConfig.tenantId){
              tenantIdCommonConfig = JSON.parse(getUserInfo()).permanentCity
          }
          else{
            tenantIdCommonConfig = getTenantId()
          }
          serviceRequest['city']= tenantIdCommonConfig,
          serviceRequest['media'] = media,
          serviceRequest['currentState'] = processInstanceCurrentState,
          serviceRequest['isEditState'] = 1
          try
          { serviceRequest['mohalla'] = serviceRequest.mohalla["label"]
         }
         catch (e){
           serviceRequest['mohalla'] = serviceRequest.mohalla
         }
         try
           {
             serviceRequest['serviceType'] = serviceRequest.serviceType["label"]
            }
   
           catch(e){
             serviceRequest['serviceType'] = serviceRequest.serviceType
         }
          dispatch(
            handleField(
              "apply",
              "components.div.children.footerEdit.children",
              "nextButton.visible",
              false
            )
          );
          

        dispatch(
          toggleSnackbar(
            true,
            { labelName: "Please Wait While Your request is being Edited", labelKey: "HC_SERVICE_REQUEST_BEING_EDITED" },
            "warning"
          )
        );  
          let response = await EditServiceRequest(state, dispatch, status);
          // debugger;
          
          let responseStatus = get(response, "status", "");
            
          let serviceRequestId = getapplicationNumber();
          // get(state, "")
          var serviceRequestStatePayload = []
          serviceRequestStatePayload = get(state, "screenConfiguration.preparedFinalObject.SERVICEREQUEST");
          var RefurbishresponseOnFailedEdit = furnishServiceRequestDetailResponseForEdit(serviceRequestStatePayload);
          if (responseStatus == "successful" || responseStatus == "SUCCESSFUL") {

          dispatch(
            toggleSnackbar(
              false,
              { labelName: "Please wait while your request being is generated", labelKey: "HC_SERVICE_REQUEST_BEING_GENERATED" },
              "warning"
            )
          );
              
                dispatch(setRoute(`/egov-hc/acknowledgementServiceRequestUpdate?serviceRequestId=${serviceRequestId}&isEditState=${1}`));
            
          } else {
            // dispatch(prepareFinalObject("SERVICEREQUEST", ""));
            dispatch(prepareFinalObject("SERVICEREQUEST", RefurbishresponseOnFailedEdit));
            dispatch(
              handleField(
                "apply",
                "components.div.children.footerEdit.children",
                "nextButton.visible",
                true
              )
            );
            let errorMessage = {
              labelName: "Submission Failed, Try Again later!",
              labelKey: "ERR_SERVICE_REQUEST_FAILED_MSG" 
            };
            dispatch(toggleSnackbar(true, errorMessage, "error"));
          }
        }
      }
        else{
          if(typeOfService ==undefined)
          {dispatch(
            toggleSnackbar(
              true,
              { labelName: "ERROR", labelKey: "HC_SERVICE_TYPE_ERROR" },
              "warning"
            )
          );}
          if(locality ==undefined)
          {dispatch(
            toggleSnackbar(
              true,
              { labelName: "ERROR", labelKey: "HC_LOCALITY_ERROR" },
              "warning"
            )
          );}
        }
        
      } 
      else if (hasFieldToaster) {
        let errorMessage = {
          labelName: "Please fill all mandatory fields !",
          labelKey: "ERR_DEFAULT_INPUT_FIELD_MSG"
        };
        switch (activeStep) {
          case 1:
            errorMessage = {
              labelName:
                "Please check the Missing/Invalid field for Property Details, then proceed!",
              // labelKey: "ERR_FILL_ALL_MANDATORY_FIELDS_PROPERTY_TOAST"
              labelKey:"ERR_FILL_ALL_MANDATORY_FIELDS_APPLICANT_TOAST"
            };
            break;
          case 2:
            errorMessage = {
              labelName:
                "Please fill all mandatory fields for Applicant Details, then proceed!",
              labelKey: "ERR_FILL_ALL_MANDATORY_FIELDS_APPLICANT_TOAST"
            };
            break;
        }
        dispatch(toggleSnackbar(true, errorMessage, "warning"));
      }
    }
    };
 


  
  export const footerEdit = getCommonApplyFooter({


    cancelButton: {
      componentPath: "Button",
      props: {
      variant: "outlined",
      style: {
      color: "#FE7A51",
     
      border: "#FE7A51 solid 1px",
      borderRadius: "2px",
      minWidth: "200px",
      height: "48px",
      marginRight: "45px"
      }
      },
      children: {
      nextButtonLabel: getLabel({
      labelName: "Cancel",
      labelKey: "HC_EDIT_CANCEL_BUTTON_LABEL"
      }),
     
      },
      onClickDefination: {
      action: "page_change",
      path: `${getRedirectionURL()}`
      },
      visible:true
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
          labelName: "HC_SUBMIT",
          labelKey: "HC_SUBMIT_LABEL"
        }),
        // nextButtonIcon: {
        //   uiFramework: "custom-atoms",
        //   componentPath: "Icon",
        //   props: {
        //     // iconName: "keyboard_arrow_right"
        //   }
        // }
      },
      onClickDefination: {
        action: "condition",
        callBack: callBackForNext,
        
      },
      visible:true
    },
   
  });
  
  
  export const validatestepform = (state, dispatch, isFormValid, hasFieldToaster) => {
    if(window.NodeList && !NodeList.prototype.forEach) {
      NodeList.prototype.forEach = Array.prototype.forEach;
      }
    let allAreFilled = true;
    let error= false;
    let flagValidFields= false;
    let validationPause =false;
  
    let typeOfService = get(state, "screenConfiguration.preparedFinalObject.SERVICEREQUEST.serviceType", "");
    if (typeOfService== ""){
      typeOfService = get(state, "screenConfiguration.screenConfig.servicerequest.components.div.children.formwizardFirstStep.children.servicerequestdetails.children.cardContent.children.servicerequestdetailsContainer.children.typeofrequest.props.value.label")
    } 
    let noOfTrees = get(state, "screenConfiguration.preparedFinalObject.SERVICEREQUEST.treeCount", "");  
    let description = get(state, "screenConfiguration.preparedFinalObject.SERVICEREQUEST.description", "");
    let locality = get(state, "screenConfiguration.preparedFinalObject.SERVICEREQUEST.mohalla", "");
    if (locality== ""){
      locality = get(state, "screenConfiguration.screenConfig.servicerequest.components.div.children.formwizardFirstStep.children.servicerequestdetails.children.cardContent.children.servicerequestdetailsContainer.children.locality.props.value.label")
    }
    let address = get(state, "screenConfiguration.preparedFinalObject.SERVICEREQUEST.address", "");
    
  
    if(typeOfService && noOfTrees && description)
    {
      validationPause = true;
      if(!address)
      {
        dispatch(
          toggleSnackbar(
            true,
            { labelName: "ERROR", labelKey: "HC_ADDRESS_ERROR" },
            "warning"
          )
        );
      }else if(!locality)
      {         
        dispatch(
          toggleSnackbar(
            true,
            { labelName: "ERROR", labelKey: "HC_LOCALITY_ERROR" },
            "warning"
          )
        );
      }else{validationPause = false;}
  
    }
  
    if(validationPause === false)
    {
      var cnt = 0;
     
      document.getElementById("apply_form2").querySelectorAll("[required]").forEach(function (i) {
      cnt = cnt + 1;
        if (!i.value && i.value != undefined) {
          if(error==false)
          {
          error=true;
          var errorMsg1 = { labelName: "ERROR", labelKey: "HC_ERROR_1"+cnt.toString() };
          // alert(i + " " + errorMsg1 )
          dispatch(
            toggleSnackbar(
              true,
              errorMsg1,
              "warning"
            )
           );
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
      }
      })
      
      document.getElementById("apply_form2").querySelectorAll("input[type='hidden']").forEach(function (i) {
        
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
    
        if(!error)
        {
    
      let error_owner = false;
      var cnt2 = 0;
      document.getElementById("apply_form3").querySelectorAll("[required]").forEach(function (i) {
        cnt2 = cnt2 + 1 ;
        if (!i.value) {
          if(error_owner==false)
          {
          error_owner=true;
          
          var errorMsg2 = { labelName: "ERROR", labelKey: "HC_ERROR_2"+cnt2.toString() };
          // alert(i + " " + errorMsg2 )
          dispatch(
            toggleSnackbar(
              true,
              errorMsg2,
              "warning"
            )
           );
          i.focus();
          i.parentNode.classList.add("MuiInput-error-853");
          i.parentNode.parentNode.classList.add("MuiFormLabel-error-844");
          allAreFilled = false;
          isFormValid = false;
          hasFieldToaster = true;
          }
          if (i.getAttribute("aria-invalid") === 'true' && allAreFilled) {
            i.parentNode.classList.add("MuiInput-error-853");
            i.parentNode.parentNode.classList.add("MuiFormLabel-error-844");
            allAreFilled = false;
            isFormValid = false;
            hasFieldToaster = true;
          }
        }
      })
    
      
    
      document.getElementById("apply_form3").querySelectorAll("input[type='hidden']").forEach(function (i) {
        
        if (i.value == i.placeholder) {
          i.focus();
          i.parentNode.classList.add("MuiInput-error-853");
          i.parentNode.parentNode.parentNode.classList.add("MuiFormLabel-error-844");
          allAreFilled = false;
          isFormValid = false;
          hasFieldToaster = true;
        }
      })
        }
    }
    
    if (allAreFilled == false) {
      isFormValid = false;
      hasFieldToaster = true;
      flagValidFields = false;
    }
    else {
      isFormValid = true;
      hasFieldToaster = false;
      flagValidFields = true;
    }
  
  
    return [isFormValid, hasFieldToaster, validationPause]
  };