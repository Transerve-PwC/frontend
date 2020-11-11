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
  import { getCommonApplyFooter, validateFields ,convertDateToEpoch} from "../utils";
  import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
  import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
  import { getTenantId } from "egov-ui-kit/utils/localStorageUtils";
  import { getSearchResults } from "../../../../ui-utils/commons";
  import get from "lodash/get";
  import set from "lodash/set";
  import { httpRequest } from "../../../../ui-utils/api";
  import { fetchLocalizationLabel } from "egov-ui-kit/redux/app/actions";
  import { getLocale } from "egov-ui-kit/utils/localStorageUtils";
  import commonConfig from '../../../../config/common';
  import store from "egov-ui-framework/ui-redux/store";
  let isEditMode = getQueryArg(window.location.href, "edited");
  const storeName = getQueryArg(window.location.href, "name");
  const tenantId = getQueryArg(window.location.href, "tenantId");
  const callBackForUpdate = async (state, dispatch) => {
    console.log("update");
    let isFormValid = true;
  
    isFormValid = validateFields(
      "components.div.children.formwizardFirstStep.children.formDetail.children.cardContent.children.addSUH.children",
      state,
      dispatch,
      "register-organization"
    );
  
    if (!isFormValid) {
      const errorMessage = {
        labelName: "Please fill all fields",
        labelKey: "ERR_FILL_ALL_FIELDS",
      };
      dispatch(toggleSnackbar(true, errorMessage, "warning"));
    } else {
      //trigger api for update store
      const { screenConfiguration } = state;
      const { stores } = screenConfiguration.preparedFinalObject;
      const tenantId = getTenantId();
      stores[0].tenantId = tenantId;
     
      stores[0].officeLocation.tenantId = tenantId;
  
      const queryObject = [
        {
          key: "tenantId",
          value: tenantId
        }
      ];
  
      const requestBody = { stores };
  
      try {
        const response = await httpRequest(
          "post",
          "nulm-services/v1/suh/citizen/_update",
          "",
          queryObject,
          requestBody
        );
        if (response) {
          dispatch(setRoute(`/egov-store-asset/acknowledgement?screen=SUHLOGC&mode=update&code=${response.stores[0].name}`));
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
  };
  //Submit Button
  const callBackForSubmit = async (state, dispatch) => {
    
    let isFormValid = true;
  
    isFormValid = validateFields(
      "components.div.children.formwizardFirstStep.children.formDetail.children.cardContent.children.addSUH.children",
      state,
      dispatch,
      "createSuh"
    );
    const {NulmSuhCitizenNGORequest} = state.screenConfiguration.preparedFinalObject;
    if(NulmSuhCitizenNGORequest && ( !NulmSuhCitizenNGORequest.hasOwnProperty("gender"))){
      isFormValid = false;
    }
  
    if (!isFormValid) {
      const errorMessage = {
        labelName: "Please fill all fields",
        labelKey: "ERR_FILL_ALL_FIELDS",
      };
      dispatch(toggleSnackbar(true, errorMessage, "warning"));
    } else {
        

        if(NulmSuhCitizenNGORequest && NulmSuhCitizenNGORequest.nominatedBy && NulmSuhCitizenNGORequest.nominatedBy==="Others"){
                if(!(NulmSuhCitizenNGORequest.nameOfNominatedPerson && NulmSuhCitizenNGORequest.contactNo)){
                    const errorMessage = {
                        labelName: "Please fill Nominee Details",
                        labelKey: "NILM_SUH_CITIZEN_FILL_NOMINEE",
                      };
                      dispatch(toggleSnackbar(true, errorMessage, "warning"));
                      return;
                }
                
        }
        else if(NulmSuhCitizenNGORequest){
          if(!NulmSuhCitizenNGORequest.dob && !NulmSuhCitizenNGORequest.age ){
            const errorMessage = {
              labelName: "Please select the Minority",
              labelKey: "ERR_NULM_DOB_AGE_VALIDATION"
            };
            dispatch(toggleSnackbar(true, errorMessage, "warning"));
            return;
          }

        }        
        else{
            NulmSuhCitizenNGORequest.nominatedBy ="Self";
        }

            // show validation mewssage and clear age value from json
    if(NulmSuhCitizenNGORequest && NulmSuhCitizenNGORequest.dob && NulmSuhCitizenNGORequest.age ){
      if(NulmSuhCitizenNGORequest.dob && NulmSuhCitizenNGORequest.age ){
        const errorMessage = {
          labelName: "Please select the Minority",
          labelKey: "ERR_NULM_DOB_AGE_VALIDATION"
        };
        dispatch(toggleSnackbar(true, errorMessage, "warning"));
        // dispatch(
        //   handleField(
        //     `createSuh`,
        //     "components.div.children.formwizardFirstStep.children.formDetail.children.cardContent.children.addSUH.children.age",
        //     "props.value",
        //     ''
        //   )
        // );
        //dispatch(prepareFinalObject(`NulmSuhCitizenNGORequest.age`, null ));
        return;
      }
    }
    //

      //trigger api for create store
      const { screenConfiguration } = state;
     // const { NulmSuhCitizenNGORequest } = screenConfiguration.preparedFinalObject;
      const tenantId = getTenantId();
      NulmSuhCitizenNGORequest.tenantId = tenantId;
      const radioButtonValue = ["isDisabled",];
    
      radioButtonValue.forEach(value => {
        if(NulmSuhCitizenNGORequest[value] && NulmSuhCitizenNGORequest[value]==="Yes" ){
          set( NulmSuhCitizenNGORequest, value, true );
        }else{
          set( NulmSuhCitizenNGORequest, value, false );
        }
      })
      // const datefieldvalue =["dob"]
      // datefieldvalue.forEach(value => {
      //   set( NulmSuhCitizenNGORequest, value, convertDateToEpoch(NulmSuhCitizenNGORequest[value]) );
      // })
      const queryObject = [];
      const requestBody = { NulmSuhCitizenNGORequest };
      console.log("requestbody", requestBody);
      try {
        const response = await httpRequest(
          "post",
          "/nulm-services/v1/suh/citizen/_create",
          "",
          queryObject,
          requestBody
        );
        if (response) {
          dispatch(setRoute(`/egov-nulm/acknowledgement?screen=SUHLOGC&mode=create&code=${response.ResponseBody.shelterRequestedForPerson}`));
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
  };
  
  // Reset Button
  const callBackForReset = async (state, dispatch) => {
   
    const textFields = [
      "organizationName",
      "address",
      "emailId",
      "nomineeName",
      "mobileNo",
      "registrationNo",
    ];
  
    for (let i = 0; i < textFields.length; i++) {
      if (
        state.screenConfiguration.screenConfig['register-organization'].components.div.children
          .formwizardFirstStep.children.formDetail.children.cardContent.children
          .addSUH.children[textFields[i]].props.value
      ) {
        dispatch(
          handleField(
            "register-organization",
            `components.div.children.formwizardFirstStep.children.formDetail.children.cardContent.children.addSUH.children.${textFields[i]}`,
            "props.value",
            ""
          )
        );
      }
    }
  
    dispatch(prepareFinalObject("NulmSuhCitizenNGORequest", {}));
  };
  
  export const buttonController = () => {
    if (isEditMode)
      return {
        updateButton: {
          componentPath: "Button",
          props: {
            variant: "contained",
            color: "primary",
            style: {
              // minWidth: "200px",
              height: "48px",
              marginRight: "16px",
            },
          },
          children: {
            updateButtonLabel: getLabel({
              labelName: "update",
              labelKey: "STORE_DETAILS_UPDATE_BUTTON",
            }),
          },
          onClickDefination: {
            action: "condition",
            callBack: callBackForUpdate,
          },
          visible: true,
        },
      };
    else
      return {
        resetButton: {
          componentPath: "Button",
          props: {
            variant: "outlined",
            color: "primary",
            style: {
              // minWidth: "200px",
              height: "48px",
              marginRight: "16px",
            },
          },
          children: {
            resetButtonLabel: getLabel({
              labelName: "Reset",
              labelKey: "STORE_DETAILS_RESET_BUTTON",
            }),
          },
          onClickDefination: {
            action: "condition",
            callBack: callBackForReset,
          },
          visible: false,
        },
        submitButton: {
          componentPath: "Button",
          props: {
            variant: "contained",
            color: "primary",
            style: {
              // minWidth: "200px",
              height: "48px",
              marginRight: "45px",
            },
          },
          children: {
            submitButtonLabel: getLabel({
              labelName: "Submit",
              labelKey: "NULM_SUH_SUBMIT_BUTTON",
            }),
          },
          onClickDefination: {
            action: "condition",
            callBack: callBackForSubmit,
          },
        },
      };
  };
  
  export const header = getCommonContainer({
    header: getCommonHeader({
      labelName: `Request for selter`,
      labelKey: "NULM_SUH_CITIZEN_SELTER_REQUEST",
    }),
  });
  export const formwizardFirstStep = {
    uiFramework: "custom-atoms",
    componentPath: "Form",
    props: {
      id: "apply_form1",
    },
    children: {
      formDetail: getCommonCard({
        header: getCommonTitle(
          {
            labelName: "Citizen details",
            labelKey: "NILM_SUH_CITIZEN_DETAILS",
          },
          {
            style: {
              marginBottom: 18,
            },
          }
        ),
        break: getBreak(),
  
        addSUH: getCommonContainer({
            personName: {
                ...getTextField({
                  label: {
                    labelName: "Shelter Requested for the Person",
                    labelKey: "NULM_SUH_CITIZEN_SHELTER_PERSON_NAME"
                  },
                  placeholder: {
                    labelName: "Enter Shelter Requested for the Person",
                    labelKey: "NULM_SUH_CITIZEN_SHELTER_PERSON_NAME_PLACEHOLDER"
                  },
                  required: true,
                  pattern: getPattern("Name") || null,
                  jsonPath: "NulmSuhCitizenNGORequest.shelterRequestedForPerson"
                }),
                beforeFieldChange: (action, state, dispatch) => {
                  let nomineeNamePath = action.componentJsonpath.replace(
                    ".personName",
                    ".nomineeName"
                  );
                  if (action.value) {   
                    const {NulmSuhCitizenNGORequest} = state.screenConfiguration.preparedFinalObject;
                    if(NulmSuhCitizenNGORequest && ( NulmSuhCitizenNGORequest.shelterRequestedForPerson && NulmSuhCitizenNGORequest.shelterRequestedForPerson ==='Self'))
                    {
                      dispatch( handleField("createSuh", nomineeNamePath, "props.value",action.value));                   
                    }      
                     
                 }
                }
              },
              gender: {
                uiFramework: "custom-containers",
                componentPath: "RadioGroupContainer",
                gridDefination: {
                  xs: 6
                },
                jsonPath: "NulmSuhCitizenNGORequest.gender",
                type: "array",
                props: {
                  required: true,
                  jsonPath: "NulmSuhCitizenNGORequest.gender",
                  label: { name: "Gender", key: "NULM_SEP_GENDER" },
                  buttons: [
                    {
                      labelName: "Female",
                      labelKey: "COMMON_GENDER_MALE",
                      value:"Female",           
                    },
                    {
                      label: "Male",
                      labelKey: "COMMON_GENDER_FEMALE",
                      value:"Male",           
                    },
                    {
                      label: "Transgender",
                      labelKey: "NULM_SEP_GENDER_TRANSGENDER",
                      value:"Transgender",           
                    },
                    {
                      label: "Others",
                      labelKey: "NULM_SEP_GENDER_OTHERS",
                      value:"Others",           
                    },
                    
                  ],      
                 // defaultValue: "Male"
                },
                type: "array",
               
              },
          
              age: {
                ...getTextField({
                  label: {
                    labelName: "age",
                    labelKey: "NULM_SEP_AGE"
                  },
                  placeholder: {
                    labelName: "Enter age",
                    labelKey: "NULM_SEP_AGE_PLACEHOLDER"
                  },
                  required: false,
                  pattern: getPattern("age") || null,
                  jsonPath: "NulmSuhCitizenNGORequest.age"
                }),
                beforeFieldChange: (action, state, dispatch) => {
                  if(action.value)
                  dispatch(prepareFinalObject(`NulmSuhCitizenNGORequest.age`,Number(action.value)));

                }
              },  
              dob: {
                ...getDateField({
                  label: {
                    labelName: "Date Of Birth",
                    labelKey: "NULM_SMID_DOB"
                  },
                  placeholder: {
                    labelName: "Enter Date Of Birth",
                    labelKey: "NULM_SMID_DOB_PLACEHOLDER"
                  },
                  required: false,
                  pattern: getPattern("Date") || null,
                  jsonPath: "NulmSuhCitizenNGORequest.dob",
                  props: {
                    inputProps: {
                      max:  new Date().toISOString().slice(0, 10),
                    }
                  }
                })
              },        
              address: {
                ...getTextField({
                  label: {
                    labelName: "Addrss",
                    labelKey: "NULM_SMID_ADDRESS"
                  },
                  placeholder: {
                    labelName: "Enter Addrss",
                    labelKey: "NULM_SEP_ADDRESS_PLACEHOLDER"
                  },
                  required: true,
                  pattern: getPattern("Address") || null,
                  jsonPath: "NulmSuhCitizenNGORequest.address"
                })
              },
              reasonForStaying: {
                ...getTextField({
                  label: {
                    labelName: "Reason for staying",
                    labelKey: "NULM_SUH_LOG_REASON_FOR_STAY"
                  },
                  placeholder: {
                    labelName: "Enter Reason for staying",
                    labelKey: "NULM_SUH_LOG_REASON_FOR_STAY_PLACEHOLDER"
                  },
                  required: true,
                  pattern: getPattern("Address") || null,
                  jsonPath: "NulmSuhCitizenNGORequest.reasonForStaying"
                })
              },
              isHandicapped: {
                uiFramework: "custom-containers",
                componentPath: "RadioGroupContainer",
                gridDefination: {
                  xs: 6
                },
                jsonPath: "NulmSuhCitizenNGORequest.isDisabled",
                type: "array",
                props: {
                  required: true,
                  jsonPath: "NulmSuhCitizenNGORequest.isDisabled",
                  label: { name: "Urban Poor", key: "NULM_SEP_HANDICAPPED" },
                  buttons: [
                    {
                      labelName: "Yes",
                      labelKey: "NULM_SEP_YES",
                      value:"Yes",           
                    },
                    {
                      label: "No",
                      labelKey: "NULM_SEP_NO",
                      value:"No",           
                    },        
                  ],      
                  defaultValue: "No"
                },
                type: "array",   
              },
              nominatedBy: {
                uiFramework: "custom-containers",
                componentPath: "RadioGroupContainer",
                gridDefination: {
                  xs: 6
                },
                jsonPath: "NulmSuhCitizenNGORequest.nominatedBy",
                type: "array",
                props: {
                  required: true,
                  jsonPath: "NulmSuhCitizenNGORequest.nominatedBy",
                  label: { name: "Nominated by", key: "NULM_SUH_CITIZEN_SHELTER_NOMINATED_BY" },
                  buttons: [
                    {
                      labelName: "Self",
                      labelKey: "NULM_SUH_CITIZEN_SELF",
                      value:"Self",           
                    },
                    {
                      label: "Others",
                      labelKey: "NULM_SUH_CITIZEN_OTHERS",
                      value:"Others",           
                    },        
                  ],      
                  defaultValue: "Self"
                },
                type: "array",   
                beforeFieldChange: (action, state, dispatch) => {
                  let nomineeNamePath = action.componentJsonpath.replace(
                    ".nominatedBy",
                    ".nomineeName"
                  );
                  if (action.value === "Self") {
                    const {NulmSuhCitizenNGORequest} = state.screenConfiguration.preparedFinalObject;
                    if(NulmSuhCitizenNGORequest.shelterRequestedForPerson !== undefined)
                    {

                    
                    if(NulmSuhCitizenNGORequest && NulmSuhCitizenNGORequest.shelterRequestedForPerson)
                    {
                     dispatch( handleField("createSuh", nomineeNamePath, "props.value",NulmSuhCitizenNGORequest.shelterRequestedForPerson));
                    }
                  }
                 }
                 if (action.value === "Others") {
                   
dispatch( handleField("createSuh", nomineeNamePath, "props.value",""));
                 }
                }
              },
              nomineeName: {
                ...getTextField({
                  label: {
                    labelName: "Name of the nominated person",
                    labelKey: "NULM_SUH_CITIZEN_SHELTER_NOMINEE_NAME"
                  },
                  placeholder: {
                    labelName: "Enter Name of the nominated person",
                    labelKey: "NULM_SUH_CITIZEN_SHELTER_NOMINEE_NAME_PLACEHOLDER"
                  },
                //  required: true,
                  props: {
                    disabled: false
                },
                  pattern: getPattern("Name") || null,
                  jsonPath: "NulmSuhCitizenNGORequest.nameOfNominatedPerson"
                })
              },          
              nomineeNumber: {
                ...getTextField({
                  label: {
                    labelName: "Contact Number of the nominated person",
                    labelKey: "NULM_SUH_CITIZEN_SHELTER_NOMINEE_CONTACT"
                  },
                  placeholder: {
                    labelName: "Enter Contact Number of the nominated person",
                    labelKey: "NULM_SUH_CITIZEN_SHELTER_NOMINEE_CONTACT_PLACEHOLDER"
                  },
                //  required: true,
                  props: {
                    disabled: false
                },
                  pattern: getPattern("MobileNo") || null,
                  jsonPath: "NulmSuhCitizenNGORequest.contactNo"
                })
              },
        }),
      }),
    },
  };
  
  export const footer = getCommonApplyFooter({
    ...buttonController(),
  });

  
  const screenConfig = {
    uiFramework: "material-ui",
    name: "createSuh",
    beforeInitScreen: (action, state, dispatch) => {

       const {NulmSuhCitizenNGORequest} = state.screenConfiguration.preparedFinalObject;
       if(NulmSuhCitizenNGORequest!== undefined)
       { 
        dispatch(prepareFinalObject("NulmSuhCitizenNGORequest",null));      
       if(NulmSuhCitizenNGORequest.shelterRequestedForPerson !== undefined)
       {
       if(!NulmSuhCitizenNGORequest &&  !NulmSuhCitizenNGORequest.shelterRequestedForPerson)
       {
        dispatch(prepareFinalObject("NulmSuhCitizenNGORequest.nominatedBy", 'Self'));
       }
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
          footer,
        },
      },
    },
  };
  
  export default screenConfig;
  