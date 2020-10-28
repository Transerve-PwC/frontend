import {
    getCommonCard,
    getCommonContainer,
    getCommonTitle,
    getPattern,
    getSelectField,
    getTextField,
    getCommonHeader,
    getBreak,
    getCheckBoxwithLabel,
    getDateField,
    getLabel,
    getLabelWithValue,
  } from "egov-ui-framework/ui-config/screens/specs/utils";
  import {
    handleScreenConfigurationFieldChange as handleField,
    prepareFinalObject,
    toggleSnackbar,
  } from "egov-ui-framework/ui-redux/screen-configuration/actions";
  import { getCommonApplyFooter, validateFields } from "../utils";
  import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
  import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
  import { getTenantId } from "egov-ui-kit/utils/localStorageUtils";
  import { getSearchResults } from "../../../../ui-utils/commons";
  import get from "lodash/get";
  import { httpRequest } from "../../../../ui-utils/api";
  import { fetchLocalizationLabel } from "egov-ui-kit/redux/app/actions";
  import { getLocale } from "egov-ui-kit/utils/localStorageUtils";
  import commonConfig from '../../../../config/common';
  import store from "egov-ui-framework/ui-redux/store";

  let isEditMode = getQueryArg(window.location.href, "edited");
  const storeName = getQueryArg(window.location.href, "name");
  const tenantId = getQueryArg(window.location.href, "tenantId");

  const handleOtpGenerator  = async(state, dispatch)=>{
    
    const {propertyVerify} = state.screenConfiguration.preparedFinalObject;
    let isFormValid = true;
    const isPropertyValid= validateFields(
        "components.div.children.formwizardFirstStep.children.otpGeneratorDetail.children.cardContent.children.otpGeneratorContainer.children",
        state,
        dispatch,
        "otp-verification"
      );

      if(!(propertyVerify && propertyVerify.propertyId)){
        isFormValid = false;
        dispatch(
          toggleSnackbar(
            true, {
            labelKey: "PT_FIELD_FILL_REQUIRED_FIELDS",
            labelName: "Please fill Required details"
          },
            "warning"
          )
        );
        return;
      }

     
   }

const handleOtpVerifyAndPropertyRegistration = async(state, dispatch)=>{
    const {propertyVerify} = state.screenConfiguration.preparedFinalObject;
    let isFormValid = true;
    const isPropertyValid= validateFields(
        "components.div.children.formwizardSecondStep.children.otpVerifyDetail.children.cardContent.children.otpVerifyContainer.children" ,
        state,
        dispatch,
        "otp-verification"
      );
      if(!(propertyVerify && propertyVerify.propertyId)){
        isFormValid = false;
        dispatch(
          toggleSnackbar(
            true, {
            labelKey: "PT_FIELD_FILL_REQUIRED_FIELDS",
            labelName: "Please fill Required details"
          },
            "warning"
          )
        );
        return;
      }

      if(!(propertyVerify && propertyVerify.otpNumber)){
        isFormValid = false;
        dispatch(
          toggleSnackbar(
            true, {
            labelKey: "PT_FIELD_FILL_REQUIRED_FIELDS",
            labelName: "Please fill Required details"
          },
            "warning"
          )
        );
        return;
    }
    if(propertyVerify && propertyVerify.otpNumber && (propertyVerify.otpNumber.length!== 4)){
      isFormValid = false;
      dispatch(
        toggleSnackbar(
          true, {
          labelKey: "OTP should only be of 4 digit",
          labelName: "OTP should only be of 4 digit"
        },
          "warning"
        )
      );
      return;
  }
     // pass the property details to view property else show error and halt
     const queryObject = [
      {
        key: "tenantId",
        value: propertyVerify.tenantId
      }
    ];
    const     Property =  {
                      propertyOtp:propertyVerify.otpNumber,
                      propertyUID:propertyVerify.propertyId,
                      isVerify:true,
                      propertyMobileNum:propertyVerify.mobileNumber,
                      propertyTokenId:propertyVerify.propertyTokenId,
                     }
    const requestBody = { Property };
    try {
      const response = await httpRequest(
        "post",
        "/property-services/property/_propertydetails",
        "",
        queryObject,
        requestBody
      );
      if (response && response.Properties) {
        if(response.Properties[0].propertyApiStatus =="S"){
         dispatch( prepareFinalObject( "Properties[0]",  response.Properties[0] ));
          dispatch(setRoute('/pt-common-screens/view-property-detail?redirectUrl=/wns/apply'));
        }
        else{
          dispatch(
            toggleSnackbar(
              true,
              { labelName: response.Properties[0].propertyMessage, labelCode: response.Properties[0].propertyMessage },
              "error"
            )
          );
        }
      
      }


    } catch (error) {
      dispatch(
        toggleSnackbar(
          true,
          { labelName: error.message, labelCode: error.message },
          "error"
        )
      );
    }
   
}

  export const header = getCommonContainer({
    header: getCommonHeader({
      labelName: `OTP Verification`,
      labelKey: "PT_COMMON_PROPERTY_VERIFICATION_OTP_HEADER",
    }),
  });
  export const formwizardFirstStep = {
    uiFramework: "custom-atoms",
    componentPath: "Form",
    props: {
      id: "apply_form1",
    },
    children: {
        otpGeneratorDetail: getCommonCard({
        header: getCommonTitle(
          {
            labelName: "Generate OTP",
            labelKey: "PT_COMMON_PROPERTY_GENERATE_OTP",
          },
          {
            style: {
              marginBottom: 18,
            },
          }
        ),
        break: getBreak(),
        otpGeneratorContainer : getCommonContainer({    
                propertyId: getTextField({
                    label: {
                      labelName: "Property ID",
                      labelKey: "PT_COMMON_VERIFY_PROPERTY_ID",
                    },
                    props: {
                     disabled :true,
                      className: "applicant-details-error",
                    },
                    placeholder: {
                      labelName: "Enter Property ID",
                      labelKey: "PT_COMMON_VERIFY_PROPERTY_ID_PLACEHOLDER",
                    },
                    required: true,
                      errorMessage:"PT_COMMON_VERIFY_PROPERTY_ID_REQUIRED",
                    pattern: getPattern("Name"),

                    jsonPath: "propertyVerify.propertyId",
                  }),
              Break:getBreak(),
            })
          })
    },
  };

  export const formwizardSecondStep = {
    uiFramework: "custom-atoms",
    componentPath: "Form",
    props: {
      id: "apply_form1",
    },
    children: {
        otpVerifyDetail: getCommonCard({
        header: getCommonTitle(
          {
            labelName: "Verify OTP",
            labelKey: "PT_COMMON_VERIFY_PROPERTY_OTP_VERIFY_HEADER",
          },
          {
            style: {
              marginBottom: 18,
            },
          }
        ),
        break: getBreak(),
        otpVerifyContainer : getCommonContainer({
         
                otpNumber: getTextField({
                    label: {
                      labelName: "OTP",
                      labelKey: "PT_COMMON_VERIFY_PROPERTY_ENTER_OTP",
                    },
                    props: {
                      className: "applicant-details-error",
                    },
                    placeholder: {
                      labelName: "Enter OTP",
                      labelKey: "PT_COMMON_VERIFY_PROPERTY_ENTER_OTP_PLACEHOLDER",
                    },
                    required: true,
                      errorMessage:"PT_COMMON_VERIFY_OTP_REQUIRED",
                    pattern: /^[0-9]{4}$/i,
                   
          
                    jsonPath: "propertyVerify.otpNumber",
                  }),
              Break:getBreak(),
              ViewButton: {
                componentPath: "Button",       
                props: {
                  variant: "contained",
                  color: "primary",
                  style: {
                    //minWidth: "200px",
                    height: "48px",
                    marginRight: "10px",
            
                  }
                },
                children: {      
                  submitButtonLabel: getLabel({
                    labelName: "Submit",
                    labelKey: "PT_COMMON_VERIFY_PROPERTY_SUBMIT_LABEL"
                  }),        
                },
                onClickDefination: {
                  action: "condition",
                  callBack: handleOtpVerifyAndPropertyRegistration
                },
                visible: true
              },
            })
          })
    },
  };
  



  const screenConfig = {
    uiFramework: "material-ui",
    name: "otp-verification",
    beforeInitScreen: (action, state, dispatch) => {
        dispatch(
            handleField(
              "otp-verification",
              "components.div.children.formwizardSecondStep.children.otpVerifyDetail.children.cardContent.children.otpVerifyContainer.children.otpNumber",
              "props.value",
              ""
            )
          );
      return action;
    },
    components: {
      div: {
        uiFramework: "custom-atoms",
        componentPath: "Div",
        props: {
          className: "common-div-css",
        },
        children: {
          headerDiv: {
            uiFramework: "custom-atoms",
            componentPath: "Container",
            children: {
              header: {
                gridDefination: {
                  xs: 12,
                  sm: 10,
                },
                ...header,
              },
            },
          },
          formwizardFirstStep,    
          formwizardSecondStep 
        },
      },
    },
  };
  
  export default screenConfig;
  