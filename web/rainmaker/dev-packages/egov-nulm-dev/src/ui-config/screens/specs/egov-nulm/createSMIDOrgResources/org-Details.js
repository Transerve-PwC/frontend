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

export const SMIDOrgDetails = getCommonCard({
  header: getCommonTitle(
    {
      labelName: "SMID Details",
      labelKey: "NULM_APPLICATION_FOR_SMID_DETAILS"
    },
    {
      style: {
        marginBottom: 18
      }
    }
  ),
  SMIDOrgDetailsContainer: getCommonContainer({
    name: {
      ...getTextField({
        label: {
          labelName: "SHG Name",
          labelKey: "NULM_SHG_NAME"
        },
        placeholder: {
          labelName: "Enter SHG Name",
          labelKey: "NULM_SHG_NAME_PLACEHOLDER"
        },
        required: true,
        pattern: getPattern("Name") || null,
        jsonPath: "NulmShgRequest.name",       
      })
    },

    type: {
      ...getTextField({
        label: {
          labelName: "SHG Type",
          labelKey: "NULM_SHG_TYPE"
        },
        placeholder: {
          labelName: "Enter SHG Type",
          labelKey: "NULM_SHG_TYPE_PLACEHOLDER"
        },
        required: true,
        pattern: getPattern("Name") || null,
        jsonPath: "NulmShgRequest.type",       
      })
    },
    formendThrough : {
    ... getSelectField({
      label: {
        labelName: "SHG formatted through",
        labelKey: "NULM_SHG_FORMATTED_THROUGH",
      },
      props: {
        className: "applicant-details-error",
        optionLabel: "name",
        optionValue: "code",
        data: [
          {
            code: "RO",
            name: "RO"
          },
          {
            code: "CO",
            name: "CO"
          },
          {
            code: "Others",
            name: "Others"
          },
        ]
      },
      placeholder: {
        labelName: "Select SHG formatted through",
        labelKey: "NULM_SHG_FORMATTED_THROUGH_SELECT",
      },
      jsonPath: "NulmShgRequest.formendThrough",
     // sourceJsonPath: "createScreenMdmsData.store-asset.Department",
      required: true,
    }),
  },
  address: {
    ...getTextField({
      label: {
        labelName: "SHG Address",
        labelKey: "NULM_SHG_ADDRESS"
      },
      placeholder: {
        labelName: "Enter SHG Address",
        labelKey: "NULM_SHG_ADDRESS_PLACEHOLDER"
      },
      required: true,
      pattern: getPattern("Address") || null,
      jsonPath: "NulmShgRequest.address"
    })
  },
  dateOfFormation: {
    ...getDateField({
      label: {
        labelName: "SHG date of formation",
        labelKey: "NULM_SHG_DATE_OF_FORMATION"
      },
      placeholder: {
        labelName: "Enter SHG date of formation",
        labelKey: "NULM_SHG_DATE_OF_FORMATION_PLACEHOLDER"
      },
      required: true,
      pattern: getPattern("Date") || null,
      jsonPath: "NulmShgRequest.dateOfFormation",
      props: {
        inputProps: {
     //     max: getTodaysDateInYMD()
        }
      }
    })
  },
  contactNo: {
      ...getTextField({
        label: {
          labelName: "Contact Number",
          labelKey: "NULM_SHG_CONTACT_NO"
        },
        placeholder: {
          labelName: "Enter Contact Number",
          labelKey: "NULM_SHG_CONTACT_NO_PLACEHOLDER"
        },
        required: true,
        pattern: getPattern("MobileNo") || null,
        jsonPath: "NulmShgRequest.contactNo"
      })
    },
    accountNo: {
      ...getTextField({
        label: {
          labelName: "SHG Account number",
          labelKey: "NULM_SHG_ACCOUNT_NUMBER"
        },
        placeholder: {
          labelName: "Enter SHG Account number",
          labelKey: "NULM_SHG_ACCOUNT_NUMBER_PLACEHOLDER"
        },
        required: true,
        pattern: getPattern("Address") || null,
        jsonPath: "NulmShgRequest.accountNo"
      })
    },

    dateOfOpeningAccount: {
      ...getDateField({
        label: {
          labelName: "Date of opening account",
          labelKey: "NULM_SHG_DATE_OF_OPENING_ACCOUNT"
        },
        placeholder: {
          labelName: "Enter Date of opening account",
          labelKey: "NULM_SHG_DATE_OF_OPENING_ACCOUNT_PLACEHOLDER"
        },
        required: true,
        pattern: getPattern("Date") || null,
        jsonPath: "NulmShgRequest.dateOfOpeningAccount",
        props: {
          inputProps: {
          //  max: getTodaysDateInYMD()
          }
        }
      })
    },
    bankName: {
      ...getTextField({
        label: {
          labelName:"SHG Bank Name",
          labelKey: "NULM_SHG_BANK_NAME"
        },
        placeholder: {
          labelName: "SHG Bank Name",
          labelKey: "NULM_SHG_BANK_NAME_PLACEHOLDER"
        },
        required: true,
        pattern: getPattern("Name") || null,
        jsonPath: "NulmShgRequest.bankName"
      })
    },
    branchName: {
      ...getTextField({
        label: {
          labelName:"SHG Branch Name",
          labelKey: "NULM_SHG_BRANCH_NAME"
        },
        placeholder: {
          labelName: "SHG Branch Name",
          labelKey: "NULM_SHG_BRANCH_NAME_PLACEHOLDER"
        },
        required: true,
        pattern: getPattern("Address") || null,
        jsonPath: "NulmShgRequest.branchName"
      })
    },
    mainAcitivity: {
      ...getTextField({
        label: {
          labelName:"SHG Main Activity",
          labelKey: "NULM_SHG_MAIN_ACTIVITY"
        },
        placeholder: {
          labelName: "SHG Main Activity",
          labelKey: "NULM_SHG_MAIN_ACTIVITY_PLACEHOLDER"
        },
        required: true,
        pattern: getPattern("Address") || null,
        jsonPath: "NulmShgRequest.mainAcitivity"
      })
    },
    groupNominatedBy: {
      ... getSelectField({
        label: {
          labelName: "Groups Nominated By",
          labelKey: "NULM_SHG_GROUPS_NOMINATED_BY",
        },
        props: {
          className: "applicant-details-error",
          optionLabel: "name",
          optionValue: "code",
          data: [
            {
              code: "Resource agency",
              name: "Resource agency"
            },
            {
              code: "Govt. Institution",
              name: "Govt. Institution"
            },
            {
              code: "ALF",
              name: "ALF"
            },
            {
              code: "CLF",
              name: "CLF"
            },
            {
              code: "Municipal Councilor",
              name: "Municipal Councilor"
            },
            {
              code: "Others",
              name: "Others"
            },
            {
              code: "Details for Others",
              name: "Details for Others"
            },
          ]
        },
        placeholder: {
          labelName: "Select Groups Nominated By",
          labelKey: "NULM_SHG_GROUPS_NOMINATED_BY_PLACEHOLDER",
        },
        jsonPath: "NulmShgRequest.groupNominatedBy",
       // sourceJsonPath: "createScreenMdmsData.store-asset.Department",
        required: true,
      }),
    },
  })
});