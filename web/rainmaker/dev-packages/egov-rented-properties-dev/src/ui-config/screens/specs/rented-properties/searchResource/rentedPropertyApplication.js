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
import { getTodaysDateInYMD } from "../../utils";

import { searchApiCall, searchTransferProperties,searchDuplicateCopy, searchMortgage} from "./functions";

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
  required:true,
  iconObj: {
    iconName: "search",
    position: "end",
    color: "#FE7A51",
    onClickDefination: {
      action: "condition",
      callBack: (state, dispatch) => {
        // getDuplicateDetailsFromProperty(state, dispatch);
      }
    }
  },
  title: {
    value:
      "If you have already assessed your property, then please search your property by your transit Number",
    key: "If you have already assessed your property, then please search your property by your transit Number"
  },
  infoIcon: "info_circle",
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

const duplicateCopyPhoneNumberField = {
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
  jsonPath: "searchScreen.applicantMobNo"
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

const duplicateCopyApplicantMobileNumberField = {
  ...duplicateCopyPhoneNumberField,
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

const areaField = {
  label: {
    labelName: "Area",
    labelKey: "RP_AREA",
  },
  placeholder: {
    labelName: "Enter Area",
    labelKey: "RP_AREA_PLACEHOLDER"
  },
  gridDefination: {
    xs: 12,
    sm: 6
 },
  props:{
    disabled:true
  },
  required: false,
  jsonPath: "searchScreen.area"
}
const pincodeField = {
  label: {
      labelName: "Pincode",
      labelKey: "RP_PINCODE_LABEL"
  },
  placeholder: {
      labelName: "Enter Pincode",
      labelKey: "RP_PINCODE_PLACEHOLDER"
  },
  gridDefination: {
      xs: 12,
      sm: 6
  },
  required: false,
  props:{
    disabled:true
  },
  jsonPath: "searchScreen.pincode"
}

const ownernameField = {
  label: {
      labelName: "Owner Name",
      labelKey: "RP_OWNER_NAME_LABEL"
  },
  placeholder: {
      labelName: "Enter Owner Name.",
      labelKey: "RP_OWNER_NAME_PLACEHOLDER"
  },
  gridDefination: {
      xs: 12,
      sm: 6
  },
  props:{
    disabled:true
  },
  required: false,
  jsonPath: "searchScreen.ownername"
}

const fromDateField = {
  label: {
    labelName: "From",
    labelKey: "RP_FROM_DATE_LABEL"
},
placeholder: {
    labelName: "Enter Date",
    labelKey: "RP_FROM_DATE_PLACEHOLDER"
},
  pattern: getPattern("Date"),
  jsonPath: "searchScreen.fromDate",
  props: {
      inputProps: {
          max: getTodaysDateInYMD()
      }
  }
}
const toDateField = {
  label: {
      labelName: "To",
      labelKey: "RP_TO_DATE_LABEL"
  },
  placeholder: {
      labelName: "Enter Date",
      labelKey: "RP_TO_DATE_PLACEHOLDER"
  },
  pattern: getPattern("Date"),
  jsonPath: "searchScreen.toDate",
  props: {
      inputProps: {
          max: getTodaysDateInYMD()
      }
  }
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

const filterButtonItem = {
  firstCont: {
    uiFramework: "custom-atoms",
    componentPath: "Div",
    gridDefination: {
      xs: 12,
      sm: 4
    }
  },
  filterButton: {
    componentPath: "Button",
    gridDefination: {
      xs: 12,
      sm: 4
    },
    props: {
      variant: "contained",
      style: {
        color: "white",
        backgroundColor: "#fe7a51",
        borderRadius: "2px",
        width: "80%",
        height: "48px"
      }
    },
    children: {
      buttonLabel: getLabel({
        labelName: "Generate Account Statement",
        labelKey: "RP_HOME_SEARCH_RESULTS_BUTTON_FILTER"
      })
    }
  }
}

export const rentedPropertyApplication = getCommonCard({
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

const commonSearchForm = {
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
}

const duplicateCopySearchForm = {
  subParagraph: getCommonParagraph({
    labelName: "Please provide atleast one parameter to search Application",
    labelKey: "RP_PLEASE_PROVIDE_ONE_PARAMETER_TO_SEARCH_APPLICATION_LABEL"
  }),
  applicationNoContainer: getCommonContainer({
    applicationNo: getTextField(applicationNoField),
    transitNumber: getTextField(transitNumberField),
  }),
  statusContainer: getCommonContainer({
    mobileNo: getTextField(duplicateCopyApplicantMobileNumberField),
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
}

const accountStatementSearchForm = {
  subParagraph: getCommonParagraph({
    labelName: "Please Provide Transit Number",
    labelKey: "RP_PLEASE_TRANSIT_NUMBER_TO_SEARCH_APPLICATION_LABEL"
  }),
  applicationNoContainer: getCommonContainer({
    transitNumber: getTextField(transitNumberField),
    area:getTextField(areaField)
  }),
  statusContainer: getCommonContainer({
    pincode:getTextField(pincodeField),
    ownername:getTextField(ownernameField)
    
  }),
}

const accountStatementFilterForm = {
  subParagraph: getCommonParagraph({
    labelName: "Select start date and end date to generate account statement",
    labelKey: "RP_FILTER_CONTAINER_HEADER_LABEL"
  }),
  dateContainer:getCommonContainer({
      from:getDateField(fromDateField),
      to:getDateField(toDateField)
  }),
  button: getCommonContainer({
    buttonContainer: getCommonContainer(
      {...filterButtonItem, filterButton: {...filterButtonItem.filterButton, 
        onClickDefination: {
          action: "condition",
          // callBack: searchTransferProperties
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
}

export const ownerShipTransferApplication = getCommonCard(
  commonSearchForm
)


export const accountStatementGenerationApplications = getCommonCard(
  accountStatementSearchForm
)

export const accountStatementFilter = getCommonCard(
  {...accountStatementFilterForm,
    button: getCommonContainer({
      buttonContainer: getCommonContainer(
        {...filterButtonItem, filterButton: {...filterButtonItem.filterButton, 
          onClickDefination: {
            action: "condition",
            callBack: searchDuplicateCopy
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
  }
)

export const searchDuplicateCopyApplication = getCommonCard(
  {...duplicateCopySearchForm,
    button: getCommonContainer({
      buttonContainer: getCommonContainer(
        {...buttonItem, searchButton: {...buttonItem.searchButton, 
          onClickDefination: {
            action: "condition",
            callBack: searchDuplicateCopy
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
  }
)

export const searchMortgageApplication = getCommonCard(
  {...commonSearchForm,
    button: getCommonContainer({
      buttonContainer: getCommonContainer(
        {...buttonItem, searchButton: {...buttonItem.searchButton, 
          onClickDefination: {
            action: "condition",
            callBack: searchMortgage
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
  }
)