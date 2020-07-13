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
import { searchApiCall, searchTransferProperties } from "./functions";

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

const allotmentNumberField = {
  label: {
    labelName: "Allotment Number",
    labelKey: "RP_ALLOTMENT_NUMBER_LABEL"
},
placeholder: {
    labelName: "Enter Allotment Number",
    labelKey: "RP_ALLOTMENT_NUMBER_PLACEHOLDER"
},
gridDefination: {
    xs: 12,
    sm: 6
},
required: false,
jsonPath: "searchScreen.allotmentNumber"
}

const applicationNoField = {
  label: {
    labelName: "Application Number",
    labelKey: "RP_APPLICATION_NUMBER",
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

const propertyIdField = {
  label: {
    labelName: "Property Id",
    labelKey: "RP_PROPERTY_ID",
  },
  placeholder: {
    labelName: "Enter Property Id",
    labelKey: "RP_PROPERTY_ID_PLACEHOLDER"
  },
  gridDefination: {
    xs: 12,
    sm: 6
},
required: false,
jsonPath: "searchScreen.propertyId"
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

const applicantMobileNumberField = {
  ...phoneNumberField,
  label: {
    labelName: "Applicant Mobile No.",
    labelKey: "RP_APPLICANT_MOBILE_NO_LABEL"
},
placeholder: {
    labelName: "Enter Applicant Mobile No.",
    labelKey: "RP_APPLICANT_MOBILE_NO_PLACEHOLDER"
},
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

const ownershipStatusField = {
  ...statusField,
  label: {
    labelName: "Application Status",
    labelKey: "RP_COMMON_TABLE_COL_APPLICATION_STATUS"
  },
  placeholder: {
    labelName: "Select Status",
    labelKey: "TL_COMMON_TABLE_COL_STATUS_PLACEHOLDER"
  },
  jsonPath: "searchScreen.status"
}


const buttonItem = {
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
    }
  }
}

export const rentedPropertyApplication = getCommonCard({
  // subHeader: getCommonTitle({
  //   labelName: "Search Property Master",
  //   labelKey: "RP_SEARCH_PROPERTY_MASTER_HEADER"
  // }),
  subParagraph: getCommonParagraph({
    labelName: "Please provide atleast one parameter to search Property",
    labelKey: "RP_PLEASE_PROVIDE_ONE_PARAMETER_TO_SEARCH_PROPERTY_LABEL"
  }),
  colonyContainer: getCommonContainer({
    colony: getSelectField(colonyField),
    status: getSelectField(statusField)
  }),
  transitNumberContainer: getCommonContainer({
    transitNumber: getTextField(transitNumberField),
    phone: getTextField(phoneNumberField)
  }),
  button: getCommonContainer({
    buttonContainer: getCommonContainer(
      {...buttonItem, searchButton: {...buttonItem.searchButton, 
        onClickDefination: {
          action: "condition",
          callBack: searchApiCall
        }
      }, lastCont: {
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


export const ownerShipTransferApplication = getCommonCard({
  // subHeader: getCommonTitle({
  //   labelName: "Search Ownership Transfer Property",
  //   labelKey: "RP_SEARCH_OWNERSHIP_TRANSFER_HEADER"
  // }),
  subParagraph: getCommonParagraph({
    labelName: "Please provide atleast one parameter to search Application",
    labelKey: "RP_PLEASE_PROVIDE_ONE_PARAMETER_TO_SEARCH_APPLICATION_LABEL"
  }),
  applicationNoContainer: getCommonContainer({
    applicationNo: getTextField(applicationNoField),
    transitNumber: getTextField(transitNumberField),
  }),
  statusContainer: getCommonContainer({
    mobileNo: getTextField(applicantMobileNumberField),
    status: getSelectField(ownershipStatusField)
  }),
  button: getCommonContainer({
    buttonContainer: getCommonContainer(
      {...buttonItem, searchButton: {...buttonItem.searchButton, 
        onClickDefination: {
          action: "condition",
          callBack: searchTransferProperties
        }
      }, lastCont: {
        uiFramework: "custom-atoms",
        componentPath: "Div",
        gridDefination: {
          xs: 12,
          sm: 4
        }
      }
    })
  })
})