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

export const SMIDDetails = getCommonCard({
  header: getCommonTitle(
    {
      labelName: "Member Details",
      labelKey: "NULM_SHG_MEMBER_DETAILS"

    },
    {
      style: {
        marginBottom: 18
      }
    }
  ),
  SMIDDetailsContainer: getCommonContainer({
    positionLevel: {
      ... getSelectField({
        label: {
          labelName: "Position",
          labelKey: "NULM_SHG_MEMBER_POSITION",
        },
        props: {
          className: "applicant-details-error",
          optionLabel: "name",
          optionValue: "code",
          data: [
            {
              code: "President",
              name: "President"
            },
            {
              code: "General Secretary",
              name: "General Secretary"
            },
            {
              code: "Cashier",
              name: "Cashier"
            },
            {
              code: "Member",
              name: "Member"
            },
          ]
        },
        placeholder: {
          labelName: "Select Position",
          labelKey: "NULM_SHG_MEMBER_POSITION_SELECT",
        },
        jsonPath: "NulmShgMemberRequest.positionLevel",
       // sourceJsonPath: "createScreenMdmsData.store-asset.Department",
        required: true,
      }),
    },
    caste: {
      uiFramework: "custom-containers",
      componentPath: "RadioGroupContainer",
      gridDefination: {
        xs: 6
      },
      jsonPath: "NulmShgMemberRequest.caste",
      type: "array",
      props: {
        required: true,
        jsonPath: "NulmShgMemberRequest.caste",
        label: { name: "Caste of Applicant", key: "NULM_SMID_CASTE_OF_APPLICANT" },
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
      jsonPath: "NulmShgMemberRequest.isUrbanPoor",
      type: "array",
      props: {
        required: true,
        jsonPath: "NulmShgMemberRequest.isUrbanPoor",
        label: { name: "Urban Poor", key: "NULM_SMID_URBAN_POOR" },
        buttons: [
          {
            labelName: "YES",
            labelKey: "NULM_SMID_YES",
            value:"YES",           
          },
          {
            label: "NO",
            labelKey: "NULM_SMID_NO",
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
          labelName: "BPL NULM_SMID_BPL_NUMBER",
          labelKey: "NULM_SMID_BPL_NUMBER"
        },
        placeholder: {
          labelName: "Enter NULM_SMID_BPL_NUMBER",
          labelKey: "NULM_SMID_BPL_NUMBER_PLACEHOLDER"
        },
        required: false,
        pattern: getPattern("alpha-numeric") || null,
        jsonPath: "NulmShgMemberRequest.bplNo"
      })
    },

    isPwd: {
      uiFramework: "custom-containers",
      componentPath: "RadioGroupContainer",
      gridDefination: {
        xs: 6
      },
      jsonPath: "NulmShgMemberRequest.isPwd",
      type: "array",
      props: {
        required: true,
        jsonPath: "NulmShgMemberRequest.isPwd",
        label: { name: "PWD", key: "NULM_SMID_PWD" },
        buttons: [
          {
            labelName: "YES",
            labelKey: "NULM_SMID_YES",
            value:"YES",           
          },
          {
            label: "NO",
            labelKey: "NULM_SMID_NO",
            value:"NO",           
          },        
        ],      
        defaultValue: "NO"
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
        jsonPath: "NulmShgMemberRequest.name",       
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
        jsonPath: "NulmShgMemberRequest.fatherOrHusbandName"
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
        pattern: getPattern("alpha-numeric-with-space") || null,
        jsonPath: "NulmShgMemberRequest.qualification"
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
        required: true,
        pattern: getPattern("Date") || null,
        jsonPath: "NulmShgMemberRequest.dob",
        props: {
          inputProps: {
            max: getTodaysDateInYMD()
          }
        }
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
        required: true,
        pattern: getPattern("Email") || null,
        jsonPath: "NulmShgMemberRequest.emailId",
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
        jsonPath: "NulmShgMemberRequest.mobileNo"
      })
    },

    phoneNo: {
      ...getTextField({
        label: {
          labelName: "Phone Number",
          labelKey: "NULM_SMID_PHONE_NUMBER"
        },
        placeholder: {
          labelName: "Enter Phone Number",
          labelKey: "NULM_SMID_PHONE_NUMBER_PLACEHOLDER"
        },
        required: true,
        pattern: getPattern("MobileNo") || null,
        jsonPath: "NulmShgMemberRequest.phoneNo"
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
        jsonPath: "NulmShgMemberRequest.motherName"
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
        jsonPath: "NulmShgMemberRequest.address"
      })
    },
    
    gender: {
      uiFramework: "custom-containers",
      componentPath: "RadioGroupContainer",
      gridDefination: {
        xs: 6
      },
      jsonPath: "NulmShgMemberRequest.gender",
      type: "array",
      props: {
        required: true,
        jsonPath: "NulmShgMemberRequest.gender",
        label: { name: "Gender", key: "NULM_SMID_GENDER" },
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
            labelKey: "NULM_SMID_GENDER_OTHERS",
            value:"OTHERS",           
          }
        ],      
       // defaultValue: "MALE"
      },
      type: "array",
     
    },
    isMinority: {
      uiFramework: "custom-containers",
      componentPath: "RadioGroupContainer",
      gridDefination: {
        xs: 6
      },
      jsonPath: "NulmShgMemberRequest.isMinority",
      type: "array",
      props: {
        required: true,
        jsonPath: "NulmShgMemberRequest.isMinority",
        label: { name: "Minority", key: "NULM_SEP_MINORITY" },
        buttons: [
          {
            labelName: "YES",
            labelKey: "NULM_SMID_YES",
            value:"YES",           
          },
          {
            label: "NO",
            labelKey: "NULM_SMID_NO",
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
      jsonPath: "NulmShgMemberRequest.minority",
      type: "array",
      props: {
        required: false,
        jsonPath: "NulmShgMemberRequest.minority",
        label: { name: "Minority Religion", key: "NULM_SMID_MINORITY_RELIGION" },
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
      type: "array",     
    },
    wardNo: {
      ...getTextField({
        label: {
          labelName: "Ward No",
          labelKey: "NULM_SMID_WARD_NO"
        },
        placeholder: {
          labelName: "Enter Ward No",
          labelKey: "NULM_SMID_WARD_NO_PLACEHOLDER"
        },
        required: true,
        pattern: getPattern("Name") || null,
        jsonPath: "NulmShgMemberRequest.wardNo"
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
        jsonPath: "NulmShgMemberRequest.nameAsPerAdhar"
      })
    },
    adharNo: {
      ...getTextField({
        label: {
          labelName: "Adhar Number",
          labelKey: "NULM_SMID_ADHAR_NUMBER"
        },
        placeholder: {
          labelName: "Enter Adhar Number",
          labelKey: "NULM_SMID_ADHAR_NUMBER_PLACEHOLDER"
        },
        pattern: getPattern("aadhar") || null,
        jsonPath: "NulmShgMemberRequest.adharNo"
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
        jsonPath: "NulmShgMemberRequest.adharAcknowledgementNo"
      })
    },
      
    isInsurance: {
      uiFramework: "custom-containers",
      componentPath: "RadioGroupContainer",
      gridDefination: {
        xs: 6
      },
      jsonPath: "NulmShgMemberRequest.isInsurance",
      type: "array",
      props: {
        required: true,
        jsonPath: "NulmShgMemberRequest.isInsurance",
        label: { name: "Insurance", key: "NULM_SMID_INSURANCE" },
        buttons: [
          {
            labelName: "YES",
            labelKey: "NULM_SMID_YES",
            value:"YES",           
          },
          {
            label: "NO",
            labelKey: "NULM_SMID_NO",
            value:"NO",           
          },
         
        ],      
        defaultValue: "NO"
      },
      type: "array",
     
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
        jsonPath: "NulmShgMemberRequest.insuranceThrough"
      })
    },

    isStreetVendor: {
      uiFramework: "custom-containers",
      componentPath: "RadioGroupContainer",
      gridDefination: {
        xs: 6
      },
      jsonPath: "NulmShgMemberRequest.isStreetVendor",
      type: "array",
      props: {
        required: true,
        jsonPath: "NulmShgMemberRequest.isStreetVendor",
        label: { name: "Street vendor", key: "NULM_SMID_STREET_VENDOR" },
        buttons: [
          {
            labelName: "YES",
            labelKey: "NULM_SMID_YES",
            value:"YES",           
          },
          {
            label: "NO",
            labelKey: "NULM_SMID_NO",
            value:"NO",           
          },
         
        ],      
        defaultValue: "NO"
      },
      type: "array",
     
    },
    isHomeless: {
      uiFramework: "custom-containers",
      componentPath: "RadioGroupContainer",
      gridDefination: {
        xs: 6
      },
      jsonPath: "NulmShgMemberRequest.isHomeless",
      type: "array",
      props: {
        required: true,
        jsonPath: "NulmShgMemberRequest.isHomeless",
        label: { name: "Homeless", key: "NULM_SMID_HOMELESS" },
        buttons: [
          {
            labelName: "YES",
            labelKey: "NULM_SMID_YES",
            value:"YES",           
          },
          {
            label: "NO",
            labelKey: "NULM_SMID_NO",
            value:"NO",           
          },
         
        ],      
        defaultValue: "NO"
      },
      type: "array", 
    },
  })
});