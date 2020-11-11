import {
  getCommonCard,
  getCommonTitle,
  getTextField,
  getDateField,
  getSelectField,
  getCommonContainer,
  getPattern
} from "egov-ui-framework/ui-config/screens/specs/utils";


export const SUSVDetails = getCommonCard({
  header: getCommonTitle(
    {
      labelName: "SUSV Details",
      labelKey: "NULM_SUSV_DETAILS"

    },
    {
      style: {
        marginBottom: 18
      }
    }
  ),
  SUSVDetailsContainer: getCommonContainer({
    nameOfApplicant: {
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
        jsonPath: "NulmSusvRequest.nameOfApplicant",       
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
        jsonPath: "NulmSusvRequest.fatherOrHusbandName"
      })
    },
    motherName: {
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
        jsonPath: "NulmSusvRequest.motherName"
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
        
        pattern: getPattern("numeric-only") || null,
        jsonPath: "NulmSusvRequest.mobileNo"
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
        required: false,
        pattern: getPattern("age") || null,
        jsonPath: "NulmSusvRequest.age"
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
        jsonPath: "NulmSusvRequest.dob",
        props: {
          inputProps: {
            max:  new Date().toISOString().slice(0, 10),
          }
        }
      })
    },
    gender: {
      uiFramework: "custom-containers",
      componentPath: "RadioGroupContainer",
      gridDefination: {
        xs: 6
      },
      jsonPath: "NulmSusvRequest.gender",
      type: "array",
      props: {
        required: true,
        jsonPath: "NulmSusvRequest.gender",
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
    category: {
      uiFramework: "custom-containers",
      componentPath: "RadioGroupContainer",
      gridDefination: {
        xs: 6
      },
      jsonPath: "NulmSusvRequest.category",
      type: "array",
      props: {
        required: true,
        jsonPath: "NulmSusvRequest.category",
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
         
          
        ],
     //   defaultValue: "Others"
      },
      type: "array",     
    },

    presentAddress: {
      ...getTextField({
        label: {
          labelName: "Present Address of Street Vendor",
          labelKey: "NULM_SUSV_PRESENT_ADDRESS"
        },
        placeholder: {
          labelName: "Enter Present Address of Street Vendor",
          labelKey: "NULM_SUSV_PRESENT_ADDRESS_PLACEHOLDER"
        },
        required: true,
        pattern: getPattern("Address") || null,
        jsonPath: "NulmSusvRequest.presentAddress"
      })
    },
    permanentAddress: {
      ...getTextField({
        label: {
          labelName: "Permanent Address of Street Vendor",
          labelKey: "NULM_SUSV_PERMANENT_ADDRESS"
        },
        placeholder: {
          labelName: "Enter Permanent Address of Street Vendor",
          labelKey: "NULM_SUSV_PERMANENT_ADDRESS_PLACEHOLDER"
        },
        required: true,
        pattern: getPattern("Address") || null,
        jsonPath: "NulmSusvRequest.permanentAddress"
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
        jsonPath: "NulmSusvRequest.qualification"
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
        jsonPath: "NulmSusvRequest.adharNo"
      })
    },
    isDisability: {
      uiFramework: "custom-containers",
      componentPath: "RadioGroupContainer",
      gridDefination: {
        xs: 6
      },
      jsonPath: "NulmSusvRequest.isDisability",
      type: "array",
      props: {
        jsonPath: "NulmSusvRequest.isDisability",
        label: { name: "Disable", key: "NULM_SUSV_DISABLE" },
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
    bloodGroup: {
      ...getTextField({
        label: {
          labelName: "Blood Group",
          labelKey: "NULM_SUSV_BLOOD_GROUP"
        },
        placeholder: {
          labelName: "Enter Blood Group",
          labelKey: "NULM_SUSV_BLOOD_GROUP_PLACEHOLDER"
        },
       // pattern: getPattern("Email") || null,
        jsonPath: "NulmSusvRequest.bloodGroup",
      })
    },
    categoryOfVending: {
      uiFramework: "custom-containers",
      componentPath: "RadioGroupContainer",
      gridDefination: {
        xs: 12
      },
      jsonPath: "NulmSusvRequest.categoryOfVending",
      type: "array",
      props: {
        jsonPath: "NulmSusvRequest.categoryOfVending",
        label: { name: "Proposed Category of Vending", key: "NULM_SUSV_CATEGORY_VENDING" },
        buttons: [
          {
            labelName: "Mobile Vending",
            labelKey: "NULM_SUSV_CATEGORY_MOBILE_VENDING",
            value:"Mobile Vending",           
          },
          {
            label: "Stationary Vending",
            labelKey: "NULM_SUSV_CATEGORY_STATIONARY_VENDING",
            value:"Stationary Vending",           
          },
          {
            label: "Other",
            labelKey: "NULM_SUSV_CATEGORY_OTHER_VENDING",
            value:"Other",           
          }      
        ],    
     //   defaultValue: "MUSLIM"
      },
      type: "array",     
    },
  
    proposedLocationOfVending: {
      ...getTextField({
        label: {
          labelName: "Proposed Zone/ward/Location",
          labelKey: "NULM_SUSV_PROPOSED_LOCATION"
        },
        placeholder: {
          labelName: "Enter Proposed Zone/ward/Location",
          labelKey: "NULM_SUSV_PROPOSED_LOCATION_PLACEHOLDER"
        },
        required: true,
        pattern: getPattern("Address") || null,
        jsonPath: "NulmSusvRequest.proposedLocationOfVending"
      })
    },
    proposedTimeOfVending: {
      ...getTextField({
        label: {
          labelName: "Proposed time of Vending",
          labelKey: "NULM_SUSV_PROPOSED_TIME"
        },
        placeholder: {
          labelName: "Enter Proposed time of Vending",
          labelKey: "NULM_SUSV_PROPOSED_TIME_PLACEHOLDER"
        },
        required: true,
        pattern: getPattern("Address") || null,
        jsonPath: "NulmSusvRequest.proposedTimeOfVending"
      })
    },
    govermentScheme: getSelectField({
      label: { labelName: "Government Scheme(Applicable if Beneficiary/Poor)", labelKey: "NULM_SUSV_GOVT_SCHEME" },
      placeholder: {
        labelName: "Select Scheme",
        labelKey: "NULM_SUSV_GOVT_SCHEME_PLACEHOLDER",
      },
      jsonPath: "NulmSusvRequest.govermentScheme",
     //sourceJsonPath: "createScreenMdmsData.NULM.govermentScheme",
      props: {
        optionValue: "code",
        optionLabel: "name",
        data: [
          {
            code: "Food Security Act",
            name: "Food Security Act"
          },
          {
            code: "National Urban Livelihood Mission",
            name: "National Urban Livelihood Mission"
          },
          {
            code: "PM-15 Point Programme for Minorities",
            name: "PM-15 Point Programme for Minorities"
          },
          {
            code: "Other",
            name: "Other"
          },
        ],
      },
    }),
    nameOfNominee: {
      ...getTextField({
        label: {
          labelName: "Name of Nominee of street Vendor",
          labelKey: "NULM_SUSV_NAME_OF_NOMINEE"
        },
        placeholder: {
          labelName: "Enter Name of Nominee of street Vendorr",
          labelKey: "NULM_SUSV_NAME_OF_NOMINEE_PLACEHOLDER"
        },
        required: true,
        pattern: getPattern("Name") || null,
        jsonPath: "NulmSusvRequest.nameOfNominee"
      })
    },
   

  })
});