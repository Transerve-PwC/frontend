import {
    getCommonCard,
    getTextField,
    getSelectField,
    getCommonContainer,
    getCommonParagraph,
    getLabel
  } from "egov-ui-framework/ui-config/screens/specs/utils";
  import { searchApiCall, searchApplicationApiCall} from "./functions";

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
      labelKey: "ES_PLEASE_PROVIDE_ONE_PARAMETER_TO_SEARCH_PROPERTY_LABEL"
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