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
  import { getTenantId,getUserInfo } from "egov-ui-kit/utils/localStorageUtils";
  import { getSearchResults } from "../../../../ui-utils/commons";
  import get from "lodash/get";
  import { httpRequest } from "../../../../ui-utils/api";
  import { fetchLocalizationLabel } from "egov-ui-kit/redux/app/actions";
  import { getLocale } from "egov-ui-kit/utils/localStorageUtils";
  import commonConfig from '../../../../config/common';
  import store from "egov-ui-framework/ui-redux/store";

  let isEditMode = getQueryArg(window.location.href, "edited");
  let property_id =  getQueryArg(window.location.href, "propertyId"); 

  const handleOtpGenerator  = async(state, dispatch)=>{
    
    const {propertyVerify} = state.screenConfiguration.preparedFinalObject;
    let isFormValid = true;
    const isPropertyValid= validateFields(
        "components.div.children.formwizardFirstStep.children.otpGeneratorDetail.children.cardContent.children.otpGeneratorContainer.children",
        state,
        dispatch,
        "verify-propertyDetails"
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

      //if call is sucess route to otp verify page and from response capture token-id
      const queryObject = [
        {
          key: "tenantId",
          value: propertyVerify.tenantId
        }
      ];
      const     Property =  {
                        propertyUID:propertyVerify.propertyId,
                        isVerify:false,
                        propertyMobileNum:propertyVerify.mobileNumber,      
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
            dispatch( prepareFinalObject( "propertyVerify.propertyTokenId",  response.Properties[0].propertyTokenId ));
            dispatch(setRoute('/pt-common-screens/otp-verification?redirectUrl=/wns/apply'));
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

const handleOtpVerifyAndPropertyRegistration = async(state, dispatch)=>{
    console.log("Generate OTP")
}

  export const header = getCommonContainer({
    header: getCommonHeader({
      labelName: `Property Verification`,
      labelKey: "PT_COMMON_PROPERTY_VERIFICATION_HEADER",
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
                      className: "applicant-details-error",
                      disabled : property_id ? true : false,
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
                  mobileNumber: getTextField({
                    label: {
                      labelName: "Mobile No.",
                      labelKey: "PT_COMMON_APPLICANT_MOBILE_NO_LABEL",
                    },
                    props: {
                      className: "applicant-details-error",
                      style: {
                        display: process.env.REACT_APP_NAME == "Citizen" ? "inline-none" :"none"
                      },
                    },
                    
                    placeholder: {
                      labelName: "Enter Mobile No.",
                      labelKey: "PT_COMMON_APPLICANT_MOBILE_NO_PLACEHOLDER",
                    },
                    required: true,
                      errorMessage:"ERR_DEFAULT_INPUT_FIELD_MSG",
                    pattern: getPattern("MobileNo"),

                    jsonPath: "propertyVerify.mobileNumber",
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
                    labelName: "Get OTP",
                    labelKey: "PT_COMMON_VERIFY_PROPERTY_OTP_BUTTON"
                  }),        
                },
                onClickDefination: {
                  action: "condition",
                  callBack: handleOtpGenerator
                },
                visible: true
              },
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
                    pattern: getPattern("Amount"),
                   
          
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
    name: "verify-propertyDetails",
    beforeInitScreen: (action, state, dispatch) => {
        if(process.env.REACT_APP_NAME == "Citizen"){
            let userName = JSON.parse(getUserInfo()).userName;
            let tenant =  JSON.parse(getUserInfo()).permanentCity;
            let mobileNumber = JSON.parse(getUserInfo()).mobileNumber
           // dispatch( prepareFinalObject( "propertyVerify.mobileNumber",  "9933590035" ));
          dispatch( prepareFinalObject( "propertyVerify.mobileNumber",  mobileNumber ));
            dispatch( prepareFinalObject( "propertyVerify.tenantId", tenant ));

            if(property_id){
              dispatch( prepareFinalObject( "propertyVerify.propertyId", property_id ));
            }
          }
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
        //  formwizardSecondStep 
        },
      },
    },
  };
  
  export default screenConfig;
  