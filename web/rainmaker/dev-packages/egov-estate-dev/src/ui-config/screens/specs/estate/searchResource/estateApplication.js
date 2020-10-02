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
  import { searchApiCall, searchTransferProperties,searchDuplicateCopy, searchMortgage,searchApplicationApiCall} from "./functions";
  
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

  const sectorNumberField = {
    label: {
        labelName: "Sector Number",
        labelKey: "ESTATE_SECTOR_NUMBER_LABEL"
    },
    placeholder: {
        labelName: "Enter Sector Number",
        labelKey: "ESTATE_SECTOR_NUMBER_PLACEHOLDER"
    },
    gridDefination: {
        xs: 12,
        sm: 6
    },
    required: false,
    jsonPath: "searchScreen.SECTORNumber"
  }

  const applicationNumberField = {
    label: {
        labelName: "Application Number",
        labelKey: "ES_APPLICATION_NUMBER_LABEL"
    },
    placeholder: {
        labelName: "Enter Application Number",
        labelKey: "ES_APPLICATION_NUMBER_PLACEHOLDER"
    },
    gridDefination: {
        xs: 12,
        sm: 6
    },
    required: false,
    jsonPath: "searchScreen.applicationNumber"
  }

  const FileNameField = {
    label: {
        labelName: "File Name",
        labelKey: "ES_FILE_NAME_LABEL"
    },
    placeholder: {
        labelName: "Enter File Name",
        labelKey: "ES_FILE_NAME_PLACEHOLDER"
    },
    gridDefination: {
        xs: 12,
        sm: 6
    },
    required: false,
    jsonPath: "searchScreen.fileNumber"
  }

  const FileNumberField = {
    label: {
        labelName: "File Number",
        labelKey: "ES_FILE_NUMBER_LABEL"
    },
    placeholder: {
        labelName: "Enter File Name",
        labelKey: "ES_FILE_NUMBER_PLACEHOLDER"
    },
    gridDefination: {
        xs: 12,
        sm: 6
    },
    required: false,
    jsonPath: "searchScreen.fileNumber"
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
      labelName: "Application Status",
      labelKey: "ES_APPLICATION_STATUS_LABEL"
    },
    placeholder: {
      labelName: "Select Applicaton Status",
      labelKey: "ES_APPLICATION_STATUS_PLACEHOLDER"
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
          labelKey: "ES_HOME_SEARCH_RESULTS_BUTTON_SEARCH"
        })
      }
    }
  }
  
  export const estateApplication = getCommonCard({
    subParagraph: getCommonParagraph({
      labelName: "Please provide atleast one parameter to search Property",
      labelKey: "RP_PLEASE_PROVIDE_ONE_PARAMETER_TO_SEARCH_PROPERTY_LABEL"
    }),
    colonyContainer: getCommonContainer({
      fileNumber: getTextField(FileNameField),
      status: getSelectField(statusField)
    }),
    transitNumberContainer: getCommonContainer({
        sectorNumber: getTextField(sectorNumberField),
      // phone: getTextField(phoneNumberField)
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

  export const estateApplicationSearch = getCommonCard({
    subParagraph: getCommonParagraph({
      labelName: "Please provide atleast one parameter to search Applications",
      labelKey: "ES_PLEASE_PROVIDE_ONE_PARAMETER_TO_SEARCH_APPLICATIONS"
    }),
    colonyContainer: getCommonContainer({
      fileNumber: getTextField(FileNumberField),
      status: getSelectField(statusField)
    }),
    transitNumberContainer: getCommonContainer({
        sectorNumber: getTextField(applicationNumberField),
    }),
    button: getCommonContainer({
      buttonContainer: getCommonContainer(
        {...buttonItem, searchButton: {...buttonItem.searchButton, 
          onClickDefination: {
            action: "condition",
            callBack: searchApplicationApiCall
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