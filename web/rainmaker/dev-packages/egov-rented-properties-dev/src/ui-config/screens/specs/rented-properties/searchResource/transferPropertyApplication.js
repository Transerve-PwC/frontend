import {
  getCommonCard,
  getCommonTitle,
  getTextField,
  getSelectField,
  getCommonContainer,
  getCommonParagraph,
  getPattern,
  getDateField,
  getLabel
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { searchApiCall } from "./functions";


const applicationNumberField = {
  label: {
    labelName: "Application Number",
    labelKey: "RP_APPLICATION_NUMBER_LABEL"
},
placeholder: {
    labelName: "Enter Application Number",
    labelKey: "RP_APPLICATION_NUMBER_PLACEHOLDER"
},
gridDefination: {
    xs: 12,
    sm: 6
},
required: false,
jsonPath: "searchScreen.applicationNumber"
}

const transitNumberField = {
  label: {
      labelName: "Transit Site/Plot number",
      labelKey: "RP_SITE_PLOT_LABEL"
  },
  placeholder: {
      labelName: "Enter Transit Site/Plot number",
      labelKey: "RP_SITE_PLOT_PLACEHOLDER"
  },
  gridDefination: {
      xs: 12,
      sm: 6
  },
  required: false,
  jsonPath: "searchScreen.transitNumber"
}

const colonyField = {
  label: {
      labelName: "Colony",
      labelKey: "RP_COLONY_LABEL"
  },
  placeholder: {
      labelName: "Enter Colony",
      labelKey: "TL_COMMON_TABLE_COL_COLONY_PLACEHOLDER"
  },
  required: false,
  jsonPath: "searchScreen.colony",
  optionValue: "code",
  optionLabel: "label",
  sourceJsonPath: "applyScreenMdmsData.propertyTypes",
  gridDefination: {
      xs: 12,
      sm: 6
  }
}

const applicantNameField = {
  label: {
    labelName: "Applicant Name",
    labelKey: "RP_APPLICANT_NAME_LABEL"
},
placeholder: {
    labelName: "Enter Applicant Name",
    labelKey: "RP_APPLICANT_NAME_PLACEHOLDER"
},
gridDefination: {
    xs: 12,
    sm: 6
},
required: false,
jsonPath: "searchScreen.applicantName"
}

const statusField = {
  label: {
    labelName: "Status",
    labelKey: "TL_COMMON_TABLE_COL_STATUS"
  },
  placeholder: {
    labelName: "Select Status",
    labelKey: "TL_COMMON_TABLE_COL_STATUS_PLACEHOLDER"
  },
  required: false,
  jsonPath: "searchScreen.state",
  data:[],
  gridDefination: {
    xs: 12,
    sm: 6
  }
}


const phoneNumberField = {
  label: {
      labelName: "Mobile No.",
      labelKey: "RP_MOBILE_NO_LABEL"
  },
  placeholder: {
      labelName: "Enter Mobile No.",
      labelKey: "RP_MOBILE_NO_PLACEHOLDER"
  },
  gridDefination: {
      xs: 12,
      sm: 6
  },
  iconObj: {
    label: "+91 |",
    position: "start"
  },
  required: false,
  pattern: getPattern("MobileNo"),
  jsonPath: "searchScreen.phone"
}


export const transferPropertyApplication = getCommonCard({
  subHeader: getCommonTitle({
    labelName: "Search Ownership transfer application",
    labelKey: "RP_SEARCH_OWNERSHIP_TRANSFER_APPLICATION"
  }),
  subParagraph: getCommonParagraph({
    labelName: "Provide at least one parameter to search for an application",
    labelKey: "TL_HOME_SEARCH_RESULTS_DESC"
  }),
  colonyContainer: getCommonContainer({
    applicationNumber: getSelectField(applicationNumberField),
    transitNumber: getSelectField(transitNumberField)
  }),
  transitNumberContainer: getCommonContainer({
    colony: getTextField(colonyField),
    applicantName: getTextField(applicantNameField)
  }),
  phoneNumberContainer: getCommonContainer({
    status: getTextField(statusField),
    phone: getTextField(phoneNumberField)
  }),
  button: getCommonContainer({
    buttonContainer: getCommonContainer({
      firstCont: {
        uiFramework: "custom-atoms",
        componentPath: "Div",
        gridDefination: {
          xs: 12,
          sm: 4
        }
      },
      searchButton: {
        componentPath: "Button",
        gridDefination: {
          xs: 12,
          sm: 4
        },
        props: {
          variant: "contained",
          style: {
            color: "white",

            backgroundColor: "rgba(0, 0, 0, 0.6000000238418579)",
            borderRadius: "2px",
            width: "80%",
            height: "48px"
          }
        },
        children: {
          buttonLabel: getLabel({
            labelName: "Search",
            labelKey: "TL_HOME_SEARCH_RESULTS_BUTTON_SEARCH"
          })
        },
        onClickDefination: {
          action: "condition",
          callBack: searchApiCall
        }
      },
      lastCont: {
        uiFramework: "custom-atoms",
        componentPath: "Div",
        gridDefination: {
          xs: 12,
          sm: 4
        }
      }
    })
  })
});
