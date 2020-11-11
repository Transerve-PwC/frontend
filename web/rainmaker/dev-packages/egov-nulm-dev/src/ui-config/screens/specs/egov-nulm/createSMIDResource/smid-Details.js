import {
  getCommonCard,
  getCommonTitle,
  getTextField,
  getDateField,
  getSelectField,
  getCommonContainer,
  getPattern
} from "egov-ui-framework/ui-config/screens/specs/utils";
import set from "lodash/set";
import { prepareFinalObject, handleScreenConfigurationFieldChange as handleField } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getTodaysDateInYMD } from "../../utils";

export const SMIDDetails = getCommonCard({
  header: getCommonTitle(
    {
      labelName: "Application for SMID program",
      labelKey: "NULM_APPLICATION_FOR_SMID_PROGRAM"

    },
    {
      style: {
        marginBottom: 18
      }
    }
  ),
  SMIDDetailsContainer: getCommonContainer({
    caste: {
      uiFramework: "custom-containers",
      componentPath: "RadioGroupContainer",
      gridDefination: {
        xs: 6
      },
      jsonPath: "NULMSMIDRequest.caste",
      type: "array",
      props: {
        required: true,
        jsonPath: "NULMSMIDRequest.caste",
        label: { name: "Caste of Applicant", key: "NULM_SMID_CASTE_OF_APPLICANT" },
        buttons: [
          {
            label: "General",
            labelKey: "NULM_SEP_GENDER_GENERAL",
            value:"General",           
          },
          {
            labelName: "SC",
            labelKey: "NULM_SEP_SC",
            value:"SC",           
          },
          {
            label: "ST",
            labelKey: "NULM_SEP_ST",
            value:"ST",           
          },
          {
            label: "OBC",
            labelKey: "NULM_SEP_OBC",
            value:"OBC",           
          },
          {
            label: "Others",
            labelKey: "NULM_SEP_GENDER_OTHERS",
            value:"Others",           
          },
         
        ],
     //   defaultValue: "Others"
      },
      type: "array",     
    },

    isUrbanPoor: {
      uiFramework: "custom-containers",
      componentPath: "RadioGroupContainer",
      gridDefination: {
        xs: 6
      },
      jsonPath: "NULMSMIDRequest.isUrbanPoor",
      type: "array",
      props: {
        required: true,
        jsonPath: "NULMSMIDRequest.isUrbanPoor",
        label: { name: "Urban Poor", key: "NULM_SMID_URBAN_POOR" },
        buttons: [
          {
            labelName: "Yes",
            labelKey: "NULM_SMID_YES",
            value:"Yes",           
          },
          {
            label: "No",
            labelKey: "NULM_SMID_NO",
            value:"No",           
          },        
        ],      
        defaultValue: "No"
      },
      type: "array",     
    },

    bplNo: {
      ...getTextField({
        label: {
          labelName: "Ration card / Priority household number",
          labelKey: "NULM_SMID_BPL_NUMBER"
        },
        placeholder: {
          labelName: "Enter Ration card / Priority household number",
          labelKey: "NULM_SMID_BPL_NUMBER_PLACEHOLDER"
        },
        required: false,
        pattern: getPattern("alpha-numeric") || null,
        jsonPath: "NULMSMIDRequest.bplNo"
      })
    },

    isPwd: {
      uiFramework: "custom-containers",
      componentPath: "RadioGroupContainer",
      gridDefination: {
        xs: 6
      },
      jsonPath: "NULMSMIDRequest.isPwd",
      type: "array",
      props: {
        required: true,
        jsonPath: "NULMSMIDRequest.isPwd",
        label: { name: "PWD", key: "NULM_SMID_PWD" },
        buttons: [
          {
            labelName: "Yes",
            labelKey: "NULM_SMID_YES",
            value:"Yes",           
          },
          {
            label: "No",
            labelKey: "NULM_SMID_NO",
            value:"No",           
          },        
        ],      
        defaultValue: "No"
      },
      type: "array",     
    },

    name: {
      ...getTextField({
        label: {
          labelName: "Name of Applicant",
          labelKey: "NULM_SMID_NAME_OF_APPLICANT",
        },
        placeholder: {
          labelName: "Enter Name of Applicant",
          labelKey: "NULM_SMID_NAME_OF_APPLICANT_PLACEHOLDER",
        },
        required: true,
        pattern: getPattern("Name") || null,
        jsonPath: "NULMSMIDRequest.name",       
      })
    },
    fatherOrHusbandName: {
      ...getTextField({
        label: {
          labelName: "Father/Spouse Name",
          labelKey: "NULM_SMID_FATHER/SPOUSE_NAME"
        },
        placeholder: {
          labelName: "Enter Father/Spouse Name",
          labelKey: "NULM_SMID_FATHER/SPOUSE_NAME_PLACEHOLDER"
        },
        required: true,
        pattern: getPattern("Name") || null,
        jsonPath: "NULMSMIDRequest.fatherOrHusbandName"
      })
    },
    qualification: {
      ...getSelectField({
        label: {
          labelName: "Qualification",
          labelKey: "NULM_SEP_QUALIFACATION"
        },
        placeholder: {
          labelName: "Enter Qualification",
          labelKey: "NULM_SEP_QUALIFACATION_PLACEHOLDER"
        },
        required: true,
        pattern: getPattern("Address") || null,
        sourceJsonPath:
        "applyScreenMdmsData.NULM.Qualification",
        jsonPath: "NULMSMIDRequest.qualification"
      })
    },
    emailId: {
      ...getTextField({
        label: {
          labelName: "Email Id",
          labelKey: "NULM_SMID_EMAIL_ID"
        },
        placeholder: {
          labelName: "Enter Email Id",
          labelKey: "NULM_SMID_EMAIL_ID_PLACEHOLDER"
        },
        required: false,
        pattern: getPattern("Email") || null,
        jsonPath: "NULMSMIDRequest.emailId",
      })
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
        visible:true,
        required: false,
        pattern: getPattern("age") ,
        jsonPath: "NULMSMIDRequest.age"
      })
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
        jsonPath: "NULMSMIDRequest.dob",
        props: {
          inputProps: {
            max:  new Date().toISOString().slice(0, 10),
          }
        }
      })
    },

   
    mobileNo: {
      ...getTextField({
        label: {
          labelName: "Mobile Number",
          labelKey: "NULM_SMID_MOBILE_NUMBER"
        },
        placeholder: {
          labelName: "Enter Mobile Number",
          labelKey: "NULM_SMID_MOBILE_NUMBER_PLACEHOLDER"
        },
        required: true,
        pattern: getPattern("MobileNo") || null,
        jsonPath: "NULMSMIDRequest.mobileNo"
      })
    },

    phoneNo: {
      ...getTextField({
        label: {
          labelName: "Phone Number",
          labelKey: "NULM_SMID_PHONE_NUMBER_INPUT"
        },
        placeholder: {
          labelName: "Enter Phone Number",
          labelKey: "NULM_SMID_PHONE_NUMBER_INPUT_PLACEHOLDER"
        },
        required: false,
        pattern: getPattern("numeric-only") || null,
        jsonPath: "NULMSMIDRequest.phoneNo"
      })
    },
      
    motherName: {
      ...getTextField({
        label: {
          labelName: "Mother Name",
          labelKey: "NULM_SMID_MOTHER_NAME"
        },
        placeholder: {
          labelName: "Enter Mother Name",
          labelKey: "NULM_SMID_MOTHER_NAME_PLACEHOLDER"
        },
        required: true,
        pattern: getPattern("Name") || null,
        jsonPath: "NULMSMIDRequest.motherName"
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
          labelKey: "NULM_SMID_ADDRESS_PLACEHOLDER"
        },
        required: true,
        pattern: getPattern("Address") || null,
        jsonPath: "NULMSMIDRequest.address"
      })
    },
    
    gender: {
      uiFramework: "custom-containers",
      componentPath: "RadioGroupContainer",
      gridDefination: {
        xs: 6
      },
      jsonPath: "NULMSMIDRequest.gender",
      type: "array",
      props: {
        required: true,
        jsonPath: "NULMSMIDRequest.gender",
        label: { name: "Gender", key: "NULM_SMID_GENDER" },
        buttons: [
          {
            label: "Male",
            labelKey: "COMMON_GENDER_MALE",
            value:"Male",           
          },
          {
            labelName: "Female",
            labelKey: "COMMON_GENDER_FEMALE",
            value:"Female",           
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
    isMinority: {
      uiFramework: "custom-containers",
      componentPath: "RadioGroupContainer",
      gridDefination: {
        xs: 12
      },
      jsonPath: "NULMSMIDRequest.isMinority",
      type: "array",
      props: {
        required: true,
        jsonPath: "NULMSMIDRequest.isMinority",
        label: { name: "Minority", key: "NULM_SEP_MINORITY" },
        buttons: [
          {
            labelName: "Yes",
            labelKey: "NULM_SMID_YES",
            value:"Yes",           
          },
          {
            label: "No",
            labelKey: "NULM_SMID_NO",
            value:"No",           
          },        
        ],      
        defaultValue: "No"
      },
      type: "array",  
      beforeFieldChange: (action, state, dispatch) => {

        if (action.value === "No") {
          // dispatch(
          //   handleField(
          //     "create-smid",
          //     "components.div.children.formwizardFirstStep.children.SMIDDetails.children.cardContent.children.SMIDDetailsContainer.children.minority",
          //     "props",
          //     { display: "none" }
          //   )
          // );
          // set(
          //   action.screenConfig,
          //   "components.div.children.formwizardFirstStep.children.SMIDDetails.children.cardContent.children.SMIDDetailsContainer.children.minority.props",
          //   { display: "none" }
          // ); 
          // set(
          //   action.screenConfig,
          //   "components.div.children.formwizardFirstStep.children.SMIDDetails.children.cardContent.children.SMIDDetailsContainer.children.minorityUI.props.style",
          //   { display: "none" }
          // );
          dispatch(
            handleField(
              `create-smid`,
              "components.div.children.formwizardFirstStep.children.SMIDDetails.children.cardContent.children.SMIDDetailsContainer.children.minorityUI",
              "props.style",
              { display: "none" }
            )
          ); 

          dispatch(prepareFinalObject("NULMSMIDRequest.minority",null));

        }
        else{
          // dispatch(
          //   handleField(
          //     "create-smid",
          //     "components.div.children.formwizardFirstStep.children.SMIDDetails.children.cardContent.children.SMIDDetailsContainer.children.minority",
          //     "props",
          //     { display: "inline-block" }
          //   )
          // );

          // set(
          //   action.screenConfig,
          //   "components.div.children.formwizardFirstStep.children.SMIDDetails.children.cardContent.children.SMIDDetailsContainer.children.minorityUI.props.style",
          //   { display: "inline-block" }
          // ); 
          dispatch(
            handleField(
              `create-smid`,
              "components.div.children.formwizardFirstStep.children.SMIDDetails.children.cardContent.children.SMIDDetailsContainer.children.minorityUI",
              "props.style",
              { display: "inline-block" }
            )
          ); 
        }
      }   
    },
    minorityUI:getCommonContainer(
      {
    minority: {
      uiFramework: "custom-containers",
      componentPath: "RadioGroupContainer",
      gridDefination: {
        xs: 12
      },
      jsonPath: "NULMSMIDRequest.minority",
      type: "array",
      props: {
        required: false,
        disabled:true,
        jsonPath: "NULMSMIDRequest.minority",
        label: { name: "Minority Religion", key: "NULM_SEP_MINORITY_RELIGION_INPUT" },
        buttons: [
          {
            labelName: "MUSLIM",
            labelKey: "NULM_SMID_MUSLIM",
            value:"MUSLIM",           
          },
          {
            label: "SIKH",
            labelKey: "NULM_SMID_SIKH",
            value:"SIKH",           
          },
          {
            label: "CHRISTIAN",
            labelKey: "NULM_SMID_CHRISTIAN",
            value:"CHRISTIAN",           
          },
          {
            label: "JAIN",
            labelKey: "NULM_SMID_JAIN",
            value:"JAIN",           
          },
          {
            label: "BUDDHIST",
            labelKey: "NULM_SMID_BUDDHIST",
            value:"BUDDHIST",           
          },
          {
            label: "PARSIS",
            labelKey: "NULM_SMID_PARSIS",
            value:"PARSIS",           
          }
        ],
      
     //   defaultValue: "MUSLIM"
      },
           
    },
    //isFieldValid:true,
   }),
    wardNo: {
      ...getTextField({
        label: {
          labelName: "Sector/Village",
          labelKey: "NULM_SMID_WARD_NO"
        },
        placeholder: {
          labelName: "Enter Sector/Village",
          labelKey: "NULM_SMID_WARD_NO_PLACEHOLDER"
        },
        required: true,
        pattern: getPattern("Name") || null,
        jsonPath: "NULMSMIDRequest.wardNo"
      })
    },
    nameAsPerAdhar: {
      ...getTextField({
        label: {
          labelName: "Name as per Adhar",
          labelKey: "NULM_SMID_NAME_AS_PER_ADHAR"
        },
        placeholder: {
          labelName: "Enter Name as per Adhar",
          labelKey: "NULM_SMID_NAME_AS_PER_ADHAR_PLACEHOLDER"
        },
        required: true,
        pattern: getPattern("Name") || null,
        jsonPath: "NULMSMIDRequest.nameAsPerAdhar"
      })
    },
    adharNo: {
      ...getTextField({
        label: {
          labelName: "Adhar Number(mentioned last four digits only)",
          labelKey: "NULM_SEP_ADHAR_NUMBER_INPUT"
        },
        placeholder: {
          labelName: "Enter Adhar Number",
          labelKey: "NULM_SMID_ADHAR_NUMBER_PLACEHOLDER"
        },
        required:true,
        pattern: getPattern("UOMValue") || null,
        errorMessage: "NULM_SEP_ADHAR_NUMBER_INPUT_VALIDATION",
        jsonPath: "NULMSMIDRequest.adharNo"
      })
    },

    adharAcknowledgementNo: {
      ...getTextField({
        label: {
          labelName: "Adhar Acknowledgement Number",
          labelKey: "NULM_SMID_ADHAR_ACKNOWLEDGEMENT_NUMBER"
        },
        placeholder: {
          labelName: "Enter Adhar Acknowledgement Number",
          labelKey: "NULM_SMID_ADHAR_ACKNOWLEDGEMENT_NUMBER_PLACEHOLDER"
        },
        pattern: getPattern("aadharAcknowledgementNo") || null,
        visible:false,
        jsonPath: "NULMSMIDRequest.adharAcknowledgementNo"
      })
    },
    isHomeless: {
      uiFramework: "custom-containers",
      componentPath: "RadioGroupContainer",
      gridDefination: {
        xs: 6
      },
      jsonPath: "NULMSMIDRequest.isHomeless",
      type: "array",
      props: {
        required: true,
        jsonPath: "NULMSMIDRequest.isHomeless",
        label: { name: "Homeless", key: "NULM_SMID_HOMELESS_INPUT" },
        buttons: [
          {
            labelName: "Yes",
            labelKey: "NULM_SMID_YES",
            value:"Yes",           
          },
          {
            label: "No",
            labelKey: "NULM_SMID_NO",
            value:"No",           
          },
         
        ],      
        defaultValue: "No"
      },
      type: "array", 
    },
    isInsurance: {
      uiFramework: "custom-containers",
      componentPath: "RadioGroupContainer",
      gridDefination: {
        xs: 6
      },
      jsonPath: "NULMSMIDRequest.isInsurance",
      type: "array",
      props: {
        required: true,
        jsonPath: "NULMSMIDRequest.isInsurance",
        label: { name: "Insurance", key: "NULM_SMID_INSURANCE_INPUT" },
        buttons: [
          {
            labelName: "Yes",
            labelKey: "NULM_SMID_YES",
            value:"Yes",           
          },
          {
            label: "No",
            labelKey: "NULM_SMID_NO",
            value:"No",           
          },
         
        ],      
        defaultValue: "No"
      },
      type: "array",
      beforeFieldChange: (action, state, dispatch) => {
        if (action.value === "No") {
          dispatch(
            handleField(
              "create-smid",
              "components.div.children.formwizardFirstStep.children.SMIDDetails.children.cardContent.children.SMIDDetailsContainer.children.insuranceThrough",
              "props.style",
              { display: "none" }
            )
          ); 
          dispatch(prepareFinalObject("NULMSMIDRequest.insuranceThrough",null));
          // dispatch(
          //   handleField(
          //     "create-smid",
          //     "components.div.children.formwizardFirstStep.children.SMIDDetails.children.cardContent.children.SMIDDetailsContainer.children.insuranceThrough",
          //     // "props",
          //     { disabled: true }
          //   )
          // ); 
        }
        else  if (action.value === "Yes") {
          dispatch(
            handleField(
              "create-smid",
              "components.div.children.formwizardFirstStep.children.SMIDDetails.children.cardContent.children.SMIDDetailsContainer.children.insuranceThrough",
              "props.style",
              { display: "inline-block" }
            )
          ); 
          // dispatch(
          //   handleField(
          //     "create-smid",
          //     "components.div.children.formwizardFirstStep.children.SMIDDetails.children.cardContent.children.SMIDDetailsContainer.children.insuranceThrough",
          //     // "props",
          //     { disabled: false }
          //   )
          // ); 
        }
           
      }
     
    },
    insuranceThrough: {
      ...getTextField({
        label: {
          labelName: "Insurance through",
          labelKey: "NULM_SMID_INSURANCE_THROUGH"
        },
        placeholder: {
          labelName: "Enter Insurance through",
          labelKey: "NULM_SMID_INSURANCE_THROUGH_PLACEHOLDER"
        },
     //   required: true,
        pattern: getPattern("alpha-numeric") || null,
        jsonPath: "NULMSMIDRequest.insuranceThrough"
      })
    },

    isStreetVendor: {
      uiFramework: "custom-containers",
      componentPath: "RadioGroupContainer",
      gridDefination: {
        xs: 6
      },
      jsonPath: "NULMSMIDRequest.isStreetVendor",
      type: "array",
      props: {
        required: true,
        jsonPath: "NULMSMIDRequest.isStreetVendor",
        label: { name: "Street vendor", key: "NULM_SMID_STREET_VENDOR_INPUT" },
        buttons: [
          {
            labelName: "Yes",
            labelKey: "NULM_SMID_YES",
            value:"Yes",           
          },
          {
            label: "No",
            labelKey: "NULM_SMID_NO",
            value:"No",           
          },
         
        ],      
        defaultValue: "No"
      },
      type: "array",
      beforeFieldChange: (action, state, dispatch) => {



        if (action.value === "No") {
          dispatch(
            handleField(
              `create-smid`,
              "components.div.children.formwizardFirstStep.children.SMIDDetails.children.cardContent.children.SMIDDetailsContainer.children.RegistredCMC",
              "props.style",
              { display: "none" }
            )
          ); 
          dispatch(prepareFinalObject("NULMSMIDRequest.isRegistered",false));
         
        }
        else  if (action.value === "Yes") {
          dispatch(
            handleField(
              `create-smid`,
              "components.div.children.formwizardFirstStep.children.SMIDDetails.children.cardContent.children.SMIDDetailsContainer.children.RegistredCMC",
              "props.style",
              { display: "inline-block" }
            )
          ); 
         
        }
           
      }
     
    },
    RegistredCMC:getCommonContainer(
      {
        isRegistered: {
      uiFramework: "custom-containers",
      componentPath: "RadioGroupContainer",
      gridDefination: {
        xs: 6
      },
      jsonPath: "NULMSMIDRequest.isRegistered",
      type: "array",
      props: {
        required: true,
        jsonPath: "NULMSMIDRequest.isRegistered",
        label: { name: "Are you registered with Chandigarh Municipal Corporation?", key: "NULM_SMID_CMC_INPUT" },
        buttons: [
          {
            labelName: "Yes",
            labelKey: "NULM_SMID_YES",
            value:"Yes",           
          },
          {
            label: "No",
            labelKey: "NULM_SMID_NO",
            value:"No",           
          },
         
        ],      
        defaultValue: "No"
      },
      type: "array",
      beforeFieldChange: (action, state, dispatch) => {
        if (action.value === "No") {
          dispatch(
            handleField(
              "create-smid",
              "components.div.children.formwizardFirstStep.children.SMIDDetails.children.cardContent.children.SMIDDetailsContainer.children.cobNumber",
              "props.style",
              { display: "none" }
            )
          ); 
          dispatch(prepareFinalObject("NULMSMIDRequest.cobNumber",null));
          dispatch(
            handleField(
              "create-smid",
              "components.div.children.formwizardFirstStep.children.SMIDDetails.children.cardContent.children.SMIDDetailsContainer.children.cobNumber",
              "required",
              false
              
            )
          );
        }
        else  if (action.value === "Yes") {
          dispatch(
            handleField(
              "create-smid",
              "components.div.children.formwizardFirstStep.children.SMIDDetails.children.cardContent.children.SMIDDetailsContainer.children.cobNumber",
              "props.style",
              { display: "inline-block" }
            )
          ); 
          dispatch(
            handleField(
              "create-smid",
              "components.div.children.formwizardFirstStep.children.SMIDDetails.children.cardContent.children.SMIDDetailsContainer.children.cobNumber",
              "required",
              true
              
            )
          );
         
        }
           
      }
    },
    gridDefination: {
      xs: 6
    },
    }
    ),
    
    cobNumber: {
      ...getTextField({
        label: {
          labelName: "COB Number",
          labelKey: "NULM_SEP_COB_NUMBER_INPUT"
        },
        placeholder: {
          labelName: "Enter COB Number",
          labelKey: "NULM_SEP_COB_NUMBER_INPUT_PLACEHOLDER"
        },
        pattern: getPattern("Name") || null,
        errorMessage: "NULM_SEP_COB_NUMBER_INPUT_VALIDATION",
        jsonPath: "NULMSMIDRequest.cobNumber"
      })
    },
  })
});