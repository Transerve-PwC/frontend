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
import { handleScreenConfigurationFieldChange as handleField, prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { searchApiCall, searchTransferProperties,searchDuplicateCopy, searchMortgage, searchAccountStatement ,downloadAccountStatementPdf} from "./functions";
import { getAccountStatementProperty } from "../../../../../ui-utils/apply";
import{colonyFieldDup} from "../../rented-properties/applyResource/propertyDetails"
const colonyField = {
  label: {
      labelName: "Colony",
      labelKey: "RP_COLONY_LABEL"
  },
  placeholder: {
      labelName: "Enter Colony",
      labelKey: "RP_COMMON_TABLE_COL_COLONY_PLACEHOLDER"
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
  jsonPath: "searchScreen.phone",
  errorMessage: "RP_ERR_PHONE_NUMBER_FIELD",
  afterFieldChange: (action, state, dispatch) => {
      if (action.value.length > 10) {
          dispatch(
              handleField(
                "apply",
                action.componentJsonpath,
                "errorMessage",
                "RP_ERR_PHONE_NUMBER_FIELD_MAXLENGTH"
              )
          )
          dispatch(
              handleField(
                "apply",
                action.componentJsonpath,
                "props.errorMessage",
                "RP_ERR_PHONE_NUMBER_FIELD_MAXLENGTH"
              )
          )
      }
      else {
          dispatch(
              handleField(
                "apply",
                action.componentJsonpath,
                "errorMessage",
                "RP_ERR_PHONE_NUMBER_FIELD"
              )
          )
          dispatch(
              handleField(
                "apply",
                action.componentJsonpath,
                "props.errorMessage",
                "RP_ERR_PHONE_NUMBER_FIELD"
              )
          )
      }
    }
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
    labelKey: "RP_COMMON_TABLE_COL_STATUS"
  },
  placeholder: {
    labelName: "Select Status",
    labelKey: "RP_COMMON_TABLE_COL_STATUS_PLACEHOLDER"
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
    labelKey: "RP_COMMON_TABLE_COL_STATUS_PLACEHOLDER"
  },
  jsonPath: "searchScreen.status"
}

const areaField = {
  label: {
    labelName: "Area",
    labelKey: "RP_AREA_PROPERTY_LABEL_IN_UNITS",
  },
  // placeholder: {
  //   labelName: "Enter Area",
  //   labelKey: "RP_AREA_PLACEHOLDER"
  // },
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
  // placeholder: {
  //     labelName: "Enter Pincode",
  //     labelKey: "RP_PINCODE_PLACEHOLDER"
  // },
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
  // placeholder: {
  //     labelName: "Enter Owner Name.",
  //     labelKey: "RP_OWNER_NAME_PLACEHOLDER"
  // },
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
  // firstCont: {
  //   uiFramework: "custom-atoms",
  //   componentPath: "Div",
  //   gridDefination: {
  //     xs: 12,
  //     sm: 4
  //   }
  // },
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
        labelKey: "RP_HOME_SEARCH_RESULTS_BUTTON_RESET"
      })
    },
    // onClickDefination: {
    //   action: "condition",
    //   callBack: resetFields
    // }
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
      // style: {
      //   color: "white",

      //   backgroundColor: "rgba(0, 0, 0, 0.6000000238418579)",
      //   borderRadius: "2px",
      //   width: "80%",
      //   height: "48px"
      // }
    },
    children: {
      buttonLabel: getLabel({
        labelName: "Search",
        labelKey: "RP_HOME_SEARCH_RESULTS_BUTTON_SEARCH"
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
        height: "48px",
        margin: "0px 0px 20px 0px"      
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

const downloadPdfButton = {
  firstCont: {
    uiFramework: "custom-atoms",
    componentPath: "Div",
    gridDefination: {
      xs: 12,
      sm: 4
    }
  },
  pdfButton: {
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
        height: "48px",
      }
    },
    children: {
      buttonLabel: getLabel({
        labelName: "Download",
        labelKey: "RP_COMMON_DOWNLOAD_PDF"
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
      },
        resetButton:{...buttonItem.resetButton,
          onClickDefination: {
            action: "condition",
            callBack: resetFields
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
      },resetButton:{...buttonItem.resetButton,
        onClickDefination: {
          action: "condition",
          callBack: resetOwnershipFields
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

const accountStatementTransitNumber = {
  ...transitNumberField,
  required: true,
  errorMessage: "RP_SITE_PLOT_SEARCH_PLACEHOLDER",
  iconObj: {
    iconName: "search",
    position: "end",
    color: "#FE7A51",
    onClickDefination: {
      action: "condition",
      callBack: (state, dispatch) => {
        getAccountStatementProperty(state, dispatch);
      }
    }
  },
  title: {
    value:
      "If you have already assessed your property, then please search your property by your transit Number",
    key: "If you have already assessed your property, then please search your property by your transit Number"
  },
  infoIcon: "info_circle",
  beforeFieldChange: (action, state, dispatch) => {
    dispatch(
        prepareFinalObject(
          "searchScreen.colony",
          ""
        )
      )
    dispatch(
        prepareFinalObject(
          "searchScreen.pincode",
          ""
        )
      )
        dispatch(
          prepareFinalObject(
            "searchScreen.ownername",
            ""
          )    
      )
      dispatch(
        prepareFinalObject(
          "searchScreen.area",
          ""
        )
      )
  }
}

export const accountStatementFilterForm = getCommonCard({
  subParagraph: getCommonParagraph({
    labelName: "Please provide transit site/plot number and click on search icon",
    labelKey: "RP_PLEASE_TRANSIT_NUMBER_TO_SEARCH_APPLICATION_LABEL"
  }),
  applicationNoContainer: getCommonContainer({
    transitNumber: getTextField(accountStatementTransitNumber),
    colony:getSelectField({...colonyFieldDup,jsonPath:"searchScreen.colony"})
  }),
  statusContainer: getCommonContainer({
    pincode:getTextField(pincodeField),
    ownername:getTextField(ownernameField),
    areaField:getTextField(areaField)
  }),
 
  dateContainer:getCommonContainer({
      from:getDateField({...fromDateField}),
      to:getDateField({...toDateField})
  }),
  button: getCommonContainer({
    buttonContainer: getCommonContainer(
      {...filterButtonItem, filterButton: {...filterButtonItem.filterButton, 
        onClickDefination: {
          action: "condition",
          callBack: searchAccountStatement
        }
      }, lastCont: {
        uiFramework: "custom-atoms",
        componentPath: "Div",
        gridDefination: {
          xs: 12,
          sm: 4
        }
      }
    }),
    pdf: getCommonContainer(
      {...downloadPdfButton, pdfButton: {...downloadPdfButton.pdfButton, 
        onClickDefination: {
          action: "condition",
          callBack: downloadAccountStatementPdf
        },
        visible:false
      }, lastCont: {
        uiFramework: "custom-atoms",
        componentPath: "Div",
        gridDefination: {
          xs: 12,
          sm: 4,
          mt:2
        }
      }
    })
  })
})

export const ownerShipTransferApplication = getCommonCard(
  commonSearchForm
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
        },
        resetButton:{...buttonItem.resetButton,
          onClickDefination: {
            action: "condition",
            callBack: resetDuplicateFields
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
        },resetButton:{...buttonItem.resetButton,
          onClickDefination: {
            action: "condition",
            callBack: resetMortageFields
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



function resetFields(state, dispatch) {
  dispatch(
    handleField(
      "search",
      "components.div.children.rentedPropertyApplication.children.cardContent.children.colonyContainer.children.colony",
      "props.value",
      ""
    )
  )
  dispatch(
    handleField(
      "search",
      "components.div.children.rentedPropertyApplication.children.cardContent.children.colonyContainer.children.status",
      "props.value",
      ""
    )
  )
  dispatch(
    handleField(
      "search",
      "components.div.children.rentedPropertyApplication.children.cardContent.children.transitNumberContainer.children.phone",
      "props.value",
      ""
    )
  )

  dispatch(
    handleField(
      "search",
      "components.div.children.rentedPropertyApplication.children.cardContent.children.transitNumberContainer.children.transitNumber",
      "props.value",
      ""
    )
  )
}

function resetMortageFields(state, dispatch) {
  dispatch(
    handleField(
      "search-mortgage",
      "components.div.children.searchMortgageApplication.children.cardContent.children.applicationNoContainer.children.applicationNo",
      "props.value",
      ""
    )
  )
  dispatch(
    handleField(
      "search-mortgage",
      "components.div.children.searchMortgageApplication.children.cardContent.children.applicationNoContainer.children.transitNumber",
      "props.value",
      ""
    )
  )
  dispatch(
    handleField(
      "search-mortgage",
      "components.div.children.searchMortgageApplication.children.cardContent.children.statusContainer.children.mobileNo",
      "props.value",
      ""
    )
  )

  dispatch(
    handleField(
      "search-mortgage",
      "components.div.children.searchMortgageApplication.children.cardContent.children.statusContainer.children.status",
      "props.value",
      ""
    )
  )
}


function resetDuplicateFields(state, dispatch) {
  dispatch(
    handleField(
      "search-duplicate-copy",
      "components.div.children.searchDuplicateCopyApplication.children.cardContent.children.applicationNoContainer.children.applicationNo",
      "props.value",
      ""
    )
  )
  dispatch(
    handleField(
      "search-duplicate-copy",
      "components.div.children.searchDuplicateCopyApplication.children.cardContent.children.applicationNoContainer.children.transitNumber",
      "props.value",
      ""
    )
  )
  dispatch(
    handleField(
      "search-duplicate-copy",
      "components.div.children.searchDuplicateCopyApplication.children.cardContent.children.statusContainer.children.mobileNo",
      "props.value",
      ""
    )
  )

  dispatch(
    handleField(
      "search-duplicate-copy",
      "components.div.children.searchDuplicateCopyApplication.children.cardContent.children.statusContainer.children.status",
      "props.value",
      ""
    )
  )
}


function resetOwnershipFields(state, dispatch) {
  dispatch(
    handleField(
      "search-transfer-properties",
      "components.div.children.ownerShipTransferApplication.children.cardContent.children.applicationNoContainer.children.applicationNo",
      "props.value",
      ""
    )
  )
  dispatch(
    handleField(
      "search-transfer-properties",
      "components.div.children.ownerShipTransferApplication.children.cardContent.children.applicationNoContainer.children.transitNumber",
      "props.value",
      ""
    )
  )
  dispatch(
    handleField(
      "search-transfer-properties",
      "components.div.children.ownerShipTransferApplication.children.cardContent.children.statusContainer.children.mobileNo",
      "props.value",
      ""
    )
  )

  dispatch(
    handleField(
      "search-transfer-properties",
      "components.div.children.ownerShipTransferApplication.children.cardContent.children.statusContainer.children.status",
      "props.value",
      ""
    )
  )
}