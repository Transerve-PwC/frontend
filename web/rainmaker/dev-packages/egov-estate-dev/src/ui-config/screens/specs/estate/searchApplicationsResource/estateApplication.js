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
import {
  searchApiCall
} from "./functions";

const applicationNumberField = {
  label: {
    labelName: "Application Number",
    labelKey: "EST_APPLICATION_NUMBER_LABEL"
  },
  placeholder: {
    labelName: "Enter Application Number",
    labelKey: "EST_APPLICATION_NUMBER_PLACEHOLDER"
  },
  gridDefination: {
    xs: 12,
    sm: 6
  },
  jsonPath: "searchApplicationsScreen.applicationNumber"
}

const fileNumberField = {
  label: {
    labelName: "File Number",
    labelKey: "EST_FILE_NUMBER_LABEL"
  },
  placeholder: {
    labelName: "Enter File Number",
    labelKey: "EST_FILE_NUMBER_PLACEHOLDER"
  },
  gridDefination: {
    xs: 12,
    sm: 6
  },
  jsonPath: "searchApplicationsScreen.fileNumber"
}

const applicantMobileField = {
  label: {
    labelName: "Applicant Mobile No.",
    labelKey: "EST_APPLICANT_MOBILE_NUMBER_LABEL"
  },
  placeholder: {
    labelName: "Enter Applicant Mobile No.",
    labelKey: "EST_APPLICANT_MOBILE_NUMBER_PLACEHOLDER"
  },
  pattern: getPattern("MobileNo"),
  jsonPath: "searchApplicationsScreen.mobileNumber",
}

const applicationStatusField = {
  label: {
    labelName: "Application Status",
    labelKey: "EST_APPLICATION_STATUS"
  },
  placeholder: {
    labelName: "Select Status",
    labelKey: "EST_APPLICATION_STATUS_PLACEHOLDER"
  },
  required: false,
  jsonPath: "searchApplicationsScreen.applicationStatus",
  data:[],
  gridDefination: {
    xs: 12,
    sm: 6
  }
}

const branchField = {
  label: {
    labelName: "Branch",
    labelKey: "EST_BRANCH_LABEL"
  },
  placeholder: {
    labelName: "Select Branch",
    labelKey: "EST_BRANCH_PLACEHOLDER"
  },
  props: {
    disabled: true
  },
  required: false,
  jsonPath: "searchApplicationsScreen.branch",
  sourceJsonPath: "seachScreenMdmsData.EstatePropertyService.branch",
  gridDefination: {
    xs: 12,
    sm: 6
  }
}

const applicationTypeField = {
  label: {
    labelName: "Application Type",
    labelKey: "EST_APPLICATION_TYPE_LABEL"
  },
  placeholder: {
    labelName: "Select Application Type",
    labelKey: "EST_APPLICATION_TYPE_PLACEHOLDER"
  },
  required: false,
  jsonPath: "searchApplicationsScreen.applicationType",
  sourceJsonPath: "seachScreenMdmsData.EstatePropertyService.applicationType",
  gridDefination: {
    xs: 12,
    sm: 6
  }
}

export const estateApplication = getCommonCard({
  subParagraph: getCommonParagraph({
    labelName: "Please provide atleast one parameter to search application",
    labelKey: "EST_PLEASE_PROVIDE_ONE_PARAMETER_TO_SEARCH_APPLICATION_LABEL"
  }),
  searchBoxContainer: getCommonContainer({
    applicationNumber: getTextField(applicationNumberField),
    fileNumber: getTextField(fileNumberField),
    applicantMobile: getTextField(applicantMobileField),
    applicationStatus: getSelectField(applicationStatusField),
    branch: getSelectField(branchField),
    applicationType: getSelectField(applicationTypeField)
  }),
  button: getCommonContainer({
    buttonContainer: getCommonContainer({
      resetButton: {
        componentPath: "Button",
        gridDefination: {
          xs: 6,
          sm: 6
        },
        props: {
          variant: "outlined",
          style: {
            color: "rgba(0, 0, 0, 0.6000000238418579)",
            borderColor: "rgba(0, 0, 0, 0.6000000238418579)",
            width: "70%",
            height: "48px",
            margin: "8px",
            float: "right"
          }
        },
        children: {
          buttonLabel: getLabel({
            labelName: "Reset",
            labelKey: "EST_HOME_SEARCH_RESULTS_BUTTON_RESET"
          })
        },
        onClickDefination: {
          action: "condition",
          callBack: resetFields
        }
      },
      searchButton: {
        componentPath: "Button",
        gridDefination: {
          xs: 6,
          sm: 6
        },
        props: {
          variant: "contained",
          style: {
            color: "white",
            margin: "8px",
            backgroundColor: "rgba(0, 0, 0, 0.6000000238418579)",
            borderRadius: "2px",
            width: "70%",
            height: "48px"
          }
        },
        children: {
          buttonLabel: getLabel({
            labelName: "Search",
            labelKey: "EST_HOME_SEARCH_RESULTS_BUTTON_SEARCH"
          })
        },
        onClickDefination: {
          action: "condition",
          callBack: searchApiCall
        }
      }
    })
  })
})

function resetFields(state, dispatch) {
}