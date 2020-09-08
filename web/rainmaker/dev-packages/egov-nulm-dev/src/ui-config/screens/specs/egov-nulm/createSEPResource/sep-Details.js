import {
  getCommonCard,
  getCommonTitle,
  getTextField,
  getDateField,
  getSelectField,
  getCommonContainer,
  getPattern
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { getTodaysDateInYMD } from "../../utils";

export const SepDetails = getCommonCard({
  header: getCommonTitle(
    {
      labelName: "Application for SEP program",
      labelKey: "NULM_APPLICATION_FOR_SEP_PROGRAM"
    },
    {
      style: {
        marginBottom: 18
      }
    }
  ),
  SepDetailsContainer: getCommonContainer({
   
    applicantname: {
      ...getTextField({
        label: {
          labelName: "Name of Applicant",
          labelKey: "NULM_SEP_NAME_OF_APPLICANT"
        },
        placeholder: {
          labelName: "Enter Name of Applicant",
          labelKey: "NULM_SEP_NAME_OF_APPLICANT_PLACEHOLDER"
        },
        required: true,
        pattern: getPattern("Name") || null,
        jsonPath: "NULMSEPRequest.name",       
      })
    },

    gender: {
      uiFramework: "custom-containers",
      componentPath: "RadioGroupContainer",
      gridDefination: {
        xs: 6
      },
      jsonPath: "NULMSEPRequest.gender",
      type: "array",
      props: {
        required: true,
        jsonPath: "NULMSEPRequest.gender",
        label: { name: "Gender", key: "NULM_SEP_GENDER" },
        buttons: [
          {
            labelName: "FEMALE",
            labelKey: "COMMON_GENDER_MALE",
            value:"FEMALE",           
          },
          {
            label: "MALE",
            labelKey: "COMMON_GENDER_FEMALE",
            value:"MALE",           
          },
          {
            label: "OTHERS",
            labelKey: "NULM_SEP_GENDER_OTHERS",
            value:"OTHERS",           
          }
        ],      
       // defaultValue: "MALE"
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
        required: true,
        pattern: getPattern("age") || null,
        jsonPath: "NULMSEPRequest.age"
      })
    },
    
    dateofbirth: {
      ...getDateField({
        label: {
          labelName: "Date Of Birth",
          labelKey: "NULM_SEP_DOB"
        },
        placeholder: {
          labelName: "Enter Date Of Birth",
          labelKey: "NULM_SEP_DOB_PLACEHOLDER"
        },
        required: true,
        pattern: getPattern("Date") || null,
        jsonPath: "NULMSEPRequest.dob",
        props: {
          inputProps: {
            max:  new Date().toISOString().slice(0, 10),
          }
        }
      })
    },
    adharNo: {
      ...getTextField({
        label: {
          labelName: "Adhar Number",
          labelKey: "NULM_SEP_ADHAR_NUMBER"
        },
        placeholder: {
          labelName: "Enter Adhar Number",
          labelKey: "NULM_SEP_ADHAR_NUMBER_PLACEHOLDER"
        },
        required: true,
        pattern: getPattern("aadhar") || null,
        jsonPath: "NULMSEPRequest.adharNo"
      })
    },
    
    mothername: {
      ...getTextField({
        label: {
          labelName: "Mother Name",
          labelKey: "NULM_SEP_MOTHER_NAME"
        },
        placeholder: {
          labelName: "Enter Mother Name",
          labelKey: "NULM_SEP_MOTHER_NAME_PLACEHOLDER"
        },
        required: true,
        pattern: getPattern("Name") || null,
        jsonPath: "NULMSEPRequest.motherName"
      })
    },
  
    fatherhusbandname: {
      ...getTextField({
        label: {
          labelName: "Father/Husband Name",
          labelKey: "NULM_SEP_FATHER/HUSBAND_NAME"
        },
        placeholder: {
          labelName: "Enter Father/Husband Name",
          labelKey: "NULM_SEP_FATHER/HUSBAND_NAME_PLACEHOLDER"
        },
        required: true,
        pattern: getPattern("Name") || null,
        jsonPath: "NULMSEPRequest.fatherOrHusbandName"
      })
    },

    occupation: {
      ...getTextField({
        label: {
          labelName: "Occupation",
          labelKey: "NULM_SEP_OCCUPATION"
        },
        placeholder: {
          labelName: "Enter Occupation",
          labelKey: "NULM_SEP_OCCUPATION_PLACEHOLDER"
        },
        required: true,
        pattern: getPattern("Address") || null,
        jsonPath: "NULMSEPRequest.occupation"
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
        jsonPath: "NULMSEPRequest.address"
      })
    },

    contactnumber: {
      ...getTextField({
        label: {
          labelName: "Contact Number",
          labelKey: "NULM_SEP_CONTACT_NUMBER"
        },
        placeholder: {
          labelName: "Enter Contact Number",
          labelKey: "NULM_SEP_CONTACT_NUMBER_PLACEHOLDER"
        },
        required: true,
        pattern: getPattern("numeric-only") || null,
        jsonPath: "NULMSEPRequest.contact"
      })
    },

    sincehowlonginchandigarh: {
      ...getTextField({
        label: {
          labelName: "Since how long in Chandigarh",
          labelKey: "NULM_SEP_SINCE_HOW_LONG_IN_CHANDIGARH"
        },
        placeholder: {
          labelName: "Enter Since how long in Chandigarh",
          labelKey: "NULM_SEP_SINCE_HOW_LONG_IN_CHANDIGARH_PLACEHOLDER"
        },
        required: true,
        pattern: getPattern("numeric-only") || null,
        jsonPath: "NULMSEPRequest.sinceHowLongInChandigarh"
      })
    },

    qualification: {
      ...getTextField({
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
        jsonPath: "NULMSEPRequest.qualification"
      })
    },

    category: {
      uiFramework: "custom-containers",
      componentPath: "RadioGroupContainer",
      gridDefination: {
        xs: 6
      },
      jsonPath: "NULMSEPRequest.category",
      type: "array",
      props: {
        required: true,
        jsonPath: "NULMSEPRequest.category",
        label: { name: "Category", key: "NULM_SEP_CATEGORY" },
        buttons: [
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
            label: "OTHERS",
            labelKey: "NULM_SEP_GENDER_OTHERS",
            value:"OTHERS",           
          }
        ],
     //   defaultValue: "OTHERS"
      },
      type: "array",     
    },


    isUrbanPoor: {
      uiFramework: "custom-containers",
      componentPath: "RadioGroupContainer",
      gridDefination: {
        xs: 6
      },
      jsonPath: "NULMSEPRequest.isUrbanPoor",
      type: "array",
      props: {
        required: true,
        jsonPath: "NULMSEPRequest.isUrbanPoor",
        label: { name: "Urban Poor", key: "NULM_SEP_URBAN_ROOR" },
        buttons: [
          {
            labelName: "YES",
            labelKey: "NULM_SEP_YES",
            value:"YES",           
          },
          {
            label: "NO",
            labelKey: "NULM_SEP_NO",
            value:"NO",           
          },        
        ],      
        defaultValue: "NO"
      },
      type: "array",     
    },

    bplNo: {
      ...getTextField({
        label: {
          labelName: "BPL NULM_SEP_BPL_NUMBER",
          labelKey: "NULM_SMID_BPL_NUMBER"
        },
        placeholder: {
          labelName: "Enter NULM_SEP_BPL_NUMBER",
          labelKey: "NULM_SMID_BPL_NUMBER_PLACEHOLDER"
        },
        required: false,
        pattern: getPattern("alpha-numeric") || null,
        jsonPath: "NULMSEPRequest.bplNo"
      })
    },

    isMinority: {
      uiFramework: "custom-containers",
      componentPath: "RadioGroupContainer",
      gridDefination: {
        xs: 6
      },
      jsonPath: "NULMSEPRequest.isMinority",
      type: "array",
      props: {
        required: true,
        jsonPath: "NULMSEPRequest.isMinority",
        label: { name: "Minority", key: "NULM_SEP_MINORITY" },
        buttons: [
          {
            labelName: "YES",
            labelKey: "NULM_SEP_YES",
            value:"YES",           
          },
          {
            label: "NO",
            labelKey: "NULM_SEP_NO",
            value:"NO",           
          },        
        ],      
        defaultValue: "NO"
      },
      type: "array",     
    },

    minority: {
      uiFramework: "custom-containers",
      componentPath: "RadioGroupContainer",
      gridDefination: {
        xs: 12
      },
      jsonPath: "NULMSEPRequest.minority",
      type: "array",
      props: {
        required: false,
        jsonPath: "NULMSEPRequest.minority",
        label: { name: "Minority Religion", key: "NULM_SEP_MINORITY_RELIGION" },
        buttons: [
          {
            labelName: "MUSLIM",
            labelKey: "NULM_SEP_MUSLIM",
            value:"MUSLIM",           
          },
          {
            label: "SIKH",
            labelKey: "NULM_SEP_SIKH",
            value:"SIKH",           
          },
          {
            label: "CHRISTIAN",
            labelKey: "NULM_SEP_CHRISTIAN",
            value:"CHRISTIAN",           
          },
          {
            label: "JAIN",
            labelKey: "NULM_SEP_JAIN",
            value:"JAIN",           
          },
          {
            label: "BUDDHIST",
            labelKey: "NULM_SEP_BUDDHIST",
            value:"BUDDHIST",           
          },
          {
            label: "PARSIS",
            labelKey: "NULM_SEP_PARSIS",
            value:"PARSIS",           
          }
        ],
      
      //  defaultValue: "MUSLIM"
      },
      type: "array",     
    },

    isHandicapped: {
      uiFramework: "custom-containers",
      componentPath: "RadioGroupContainer",
      gridDefination: {
        xs: 6
      },
      jsonPath: "NULMSEPRequest.isHandicapped",
      type: "array",
      props: {
        required: true,
        jsonPath: "NULMSEPRequest.isHandicapped",
        label: { name: "Urban Poor", key: "NULM_SEP_HANDICAPPED" },
        buttons: [
          {
            labelName: "YES",
            labelKey: "NULM_SEP_YES",
            value:"YES",           
          },
          {
            label: "NO",
            labelKey: "NULM_SEP_NO",
            value:"NO",           
          },        
        ],      
        defaultValue: "NO"
      },
      type: "array",    
    },

    typeofbusiness: {
      ...getTextField({
        label: {
          labelName: "Type of Business/Industry/Service/activity proposed to be started ",
          labelKey: "NULM_SEP_TYPE_OF_BUSINESS/INDUSTRY/SERVICE/ACTIVITY_PROPOSED_TO_BE_STARTED "
        },
        placeholder: {
          labelName: "Enter Type of Business/Industry/Service/activity proposed to be started",
          labelKey: "NULM_SEP_TYPE_OF_BUSINESS/INDUSTRY/SERVICE/ACTIVITY_PROPOSED_TO_BE_STARTED_PLACEHOLDER"
        },
        required: true,
        pattern: getPattern("alpha-numeric-with-space") || null,
        jsonPath: "NULMSEPRequest.typeOfBusinessToBeStarted"
      })
    },

    previousExperience: {
      ...getTextField({
        label: {
          labelName: "Previous experience in the line if any",
          labelKey: "NULM_SEP_PREVIOUS_EXPERIENCE_IN_THE_LINE_IF_ANY_PLACEHOLDER"
        },
        placeholder: {
          labelName: "Enter Previous experience in the line if any",
          labelKey: "NULM_SEP_PREVIOUS_EXPERIENCE_IN_THE_LINE_IF_ANY_PLACEHOLDER"
        },
        required: true,
        pattern: getPattern("numeric-only") || null,
        jsonPath: "NULMSEPRequest.previousExperience"
      })
    },

    placeOfWork: {
      ...getTextField({
        label: {
          labelName: "Place of work whether the activity is proposed to be started",
          labelKey: "NULM_SEP_PLACE_OF_WORK_WHETHER_THE_ACTIVITY_IS_PROPOSED_TO_BE_STARTED"
        },
        placeholder: {
          labelName: "Enter Place of work whether the activity is proposed to be started",
          labelKey: "NULM_SEP_PLACE_OF_WORK_WHETHER_THE_ACTIVITY_IS_PROPOSED_TO_BE_STARTED_PLACEHOLDER"
        },
        required: true,
        pattern: getPattern("alpha-numeric-with-space") || null,
        jsonPath: "NULMSEPRequest.placeOfWork"
      })
    },

    bankDetails: {
      ...getTextField({
        label: {
          labelName: "Details of account of beneficiary-bank Name/Branch/A/C name (Only in Chandigarh)",
          labelKey: "NULM_SEP_OF_ACCOUNT_OF_BENEFICIARY_BANK_A_C_NAME_ONLY_IN_CHANDIGARH)"
        },
        // placeholder: {
        //   labelName: "Enter Details of account of beneficiary-bank Name/Branch/A/C name (Only in Chandigarh)",
        //   labelKey: "NULM_SEP_OF_ACCOUNT_OF_BENEFICIARY_BANK_A_C_NAME_ONLY_IN_CHANDIGARH)"
        // },
        required: true,
        pattern: getPattern("alpha-numeric-with-space") || null,
        jsonPath: "NULMSEPRequest.bankDetails"
      })
    },


    noOfFamilyMembers: {
      ...getTextField({
        label: {
          labelName: "No. of family members",
          labelKey: "NULM_SEP_NO_OF_FAMILY_MEMBERS"
        },
        placeholder: {
          labelName: "Enter No. of family members",
          labelKey: "NULM_SEP_NO_OF_FAMILY_MEMBERS_PLACEHOLDER"
        },
        required: true,
        pattern: getPattern("numeric-only") || null,
        jsonPath: "NULMSEPRequest.noOfFamilyMembers"
      })
    },

    projectCost: {
      ...getTextField({
        label: {
          labelName: "Project Cost",
          labelKey: "NULM_SEP_PROJECT_COST"
        },
        placeholder: {
          labelName: "Enter Project Cost",
          labelKey: "NULM_SEP_PROJECT_COST_PLACEHOLDER"
        },
        required: false,
        pattern: getPattern("Amount") || null,
        jsonPath: "NULMSEPRequest.projectCost"
      })
    },

    loanAmount: {
      ...getTextField({
        label: {
          labelName: "Amount of Loan required",
          labelKey: "NULM_SEP_AMOUNT_OF_LOAN_REQUIRED"
        },
        placeholder: {
          labelName: "Enter Amount of Loan required",
          labelKey: "NULM_SEP_AMOUNT_OF_LOAN_REQUIRED_PLACEHOLDER"
        },
        required: true,
        pattern: getPattern("Amount") || null,
        jsonPath: "NULMSEPRequest.loanAmount"
      })
    },


    recommendedAmount: {
      ...getTextField({
        label: {
          labelName: "Amount Recommended by Task Force Committee",
          labelKey: "NULM_SEP_AMOUNT_RECOMMENDED_BY_TASK_FORCE_COMMITTEE"
        },
        placeholder: {
          labelName: "Enter Amount Recommended by Task Force Committee",
          labelKey: "NULM_SEP_AMOUNT_RECOMMENDED_BY_TASK_FORCE_COMMITTEE_PLACEHOLDER"
        },
        required: true,
        pattern: getPattern("Amount") || null,
        jsonPath: "NULMSEPRequest.recommendedAmount"
      })
    },

    isLoanFromBankinginstitute: {
      uiFramework: "custom-containers",
      componentPath: "RadioGroupContainer",
      gridDefination: {
        xs: 6
      },
      jsonPath: "NULMSEPRequest.isLoanFromBankinginstitute",
      type: "array",
      props: {
        required: true,  
        jsonPath: "NULMSEPRequest.isLoanFromBankinginstitute",
        label: { name: "Whether taken loan from any banking/financial institute", 
        key: "NULM_SEP_WHETHER_TAKEN_LOAN_FROM_ANY_BANKING/FINANCIAL_INSTITUTE" },
        buttons: [
          {
            labelName: "YES",
            labelKey: "NULM_SEP_YES",
            value:"YES",           
          },
          {
            label: "NO",
            labelKey: "NULM_SEP_NO",
            value:"NO",           
          },        
        ],      
        defaultValue: "NO"
      },
      type: "array",     
    },

    isRepaymentMade: {
      uiFramework: "custom-containers",
      componentPath: "RadioGroupContainer",
      gridDefination: {
        xs: 6
      },
      jsonPath: "NULMSEPRequest.isRepaymentMade",
      type: "array",
      props: {
        required: true,
        jsonPath: "NULMSEPRequest.isRepaymentMade",
        label: { name: "If Yes , whether all repayment made ?", 
        key: "NULM_SEP_IF_YES_WHEATHER_ALL_REPAYMENT_MADE?" },
        buttons: [
          {
            labelName: "YES",
            labelKey: "NULM_SEP_YES",
            value:"YES",           
          },
          {
            label: "NO",
            labelKey: "NULM_SEP_NO",
            value:"NO",          
          },       
        ],    
        defaultValue: "NO"
      },
      type: "array",     
    },

    recommendedBy: {
      uiFramework: "custom-containers",
      componentPath: "RadioGroupContainer",
      gridDefination: {
        xs: 6
      },
      jsonPath: "NULMSEPRequest.recommendedBy",
      type: "array",
      props: {
        required: false,
        jsonPath: "NULMSEPRequest.recommendedBy",
        label: { name: "Recommended by", 
        key: "NULM_SEP_RECOMMENDED_BY" },
        buttons: [
          {
            labelName: "SHG",
            labelKey: "NULM_SEP_SHG",
            value:"SHG",           
          },
          {
            label: "ALF",
            labelKey: "NULM_SEP_ALF",
            value:"ALF",           
          },
          {
            label: "BANK",
            labelKey: "NULM_SEP_Bank",
            value:"BANK",           
          },
          {
            label: "SELF",
            labelKey: "NULM_SEP_SELF",
            value:"SELF",       
          },
        
        ],
      
       // defaultValue: "SHG"
      },
      type: "array",
     
    },
    representativeName: {
      ...getTextField({
        label: {
          labelName: "Particulars of representative Name",
          labelKey: "NULM_SEP_PARTICULARS_OF_REPRESENTATIVE_NAME"
        },
        placeholder: {
          labelName: "Enter Particulars of representative Name",
          labelKey: "NULM_SEP_PARTICULARS_OF_REPRESENTATIVE_NAME_PLACEHOLDER"
        },
        pattern: getPattern("Name") || null,
        jsonPath: "NULMSEPRequest.representativeName"
      })
    },

    representativeAddress: {
      ...getTextField({
        label: {
          labelName: "Particulars of representative Address",
          labelKey: "NULM_SEP_PARTICULARS_OF_REPRESENTATIVE_ADDRESS"
        },
        placeholder: {
          labelName: "Enter Particulars of representative Address",
          labelKey: "NULM_SEP_PARTICULARS_OF_REPRESENTATIVE_ADDRESS_PLACEHOLDER"
        },
        pattern: getPattern("Address") || null,
        jsonPath: "NULMSEPRequest.representativeAddress"
      })
    },
  })
});