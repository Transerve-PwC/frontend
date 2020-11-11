import {
  getCommonCard,
  getCommonTitle,
  getTextField,
  getDateField,
  getSelectField,
  getCommonContainer,
  getPattern
} from "egov-ui-framework/ui-config/screens/specs/utils";


export const SUHLogDetails = getCommonCard({
  header: getCommonTitle(
    {
      labelName: "Log Details",
      labelKey: "NULM_SUH_LOG_DETAILS"
    },
    {
      style: {
        marginBottom: 18
      }
    }
  ),
  SUHLogDetailsContainer: getCommonContainer({
    nameOfShelter : {
      ... getSelectField({
        label: {
          labelName: "Name of shelter",
          labelKey: "NULM_SUH_OF_SHELTER",
        },
        props: {
          className: "applicant-details-error",
          optionLabel: "name",
          optionValue: "code",
          // data: [
          //   {
          //     code: "RO",
          //     name: "RO"
          //   },
          //   {
          //     code: "CO",
          //     name: "CO"
          //   },
          //   {
          //     code: "Others",
          //     name: "Others"
          //   },
          // ]
        },
        placeholder: {
          labelName: "Select Name of shelter",
          labelKey: "NULM_SUH_NAME_OF_SHELTER_SELECT",
        },
        jsonPath: "NulmSuhLogRequest.nameOfShelter",
        sourceJsonPath: "createScreenMdmsData.shelterName",
        required: true,
      }),
    },
    date: {
      ...getDateField({
        label: {
          labelName: "Date",
          labelKey: "NULM_SUH_LOG_DATE"
        },
        placeholder: {
          labelName: "Date",
          labelKey: "NULM_SUH_LOG_DATE"
        },
        required: true,
        pattern: getPattern("Date") || null,
        jsonPath: "NulmSuhLogRequest.date",
        props: {
          inputProps: {
            max:  new Date().toISOString().slice(0, 10),
          }
        }
      })
    },
    name: {
      ...getTextField({
        label: {
          labelName: "Name",
          labelKey: "NULM_SUH_LOG_NAME"
        },
        placeholder: {
          labelName: "Enter Name",
          labelKey: "NULM_SUH_LOG_NAME_PLACEHOLDER"
        },
        required: true,
        pattern: getPattern("Name") || null,
        jsonPath: "NulmSuhLogRequest.name",       
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
        jsonPath: "NulmSuhLogRequest.qualification"
      })
    },
    gender: {
      uiFramework: "custom-containers",
      componentPath: "RadioGroupContainer",
      gridDefination: {
        xs: 6
      },
      jsonPath: "NulmSuhLogRequest.gender",
      type: "array",
      props: {
        required: true,
        jsonPath: "NulmSuhLogRequest.gender",
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
        jsonPath: "NulmSuhLogRequest.address"
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
        jsonPath: "NulmSuhLogRequest.age"
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
        required: false,
        pattern: getPattern("Date") || null,
        jsonPath: "NulmSuhLogRequest.dob",
        props: {
          inputProps: {
            max:  new Date().toISOString().slice(0, 10),
          }
        }
      })
    },
  
    aadhaarNo: {
      ...getTextField({
        label: {
          labelName: "Adhar Number",
          labelKey: "NULM_SMID_ADHAR_NUMBER"
        },
        placeholder: {
          labelName: "Enter Adhar Number",
          labelKey: "NULM_SMID_ADHAR_NUMBER_PLACEHOLDER"
        },
        required: true,
        pattern: getPattern("aadhar") || null,
        jsonPath: "NulmSuhLogRequest.aadhaarNo"
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
        jsonPath: "NulmSuhLogRequest.reasonForStaying"
      })
    },


  })
});