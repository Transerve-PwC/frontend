import {
    getCommonCard,
    getTextField,
    getSelectField,
    getCommonContainer,
    getCommonParagraph,
    getLabel
  } from "egov-ui-framework/ui-config/screens/specs/utils";
  import { searchApiCall, searchApplicationApiCall} from "./functions";
  import { handleScreenConfigurationFieldChange as handleField, prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { get } from "lodash";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";

const branchType = getQueryArg(window.location.href, "branchType");

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
    jsonPath: "searchScreen.sectorNumber"
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
    optionValue: "code",
    optionLabel: "label",
    gridDefination: {
      xs: 12,
      sm: 6
    }
  }

  export const applicationTypeField = {
    label: {
      labelName: "Application Type",
      labelKey: "ES_APPLICATION_TYPE_LABEL"
    },
    placeholder: {
      labelName: "Select Application Type",
      labelKey: "ES_APPLICATION_TYPE_PLACEHOLDER"
    },
    required: false,
    jsonPath: "searchScreen.applicationType",
    data: [],
    optionValue: "code",
    optionLabel: "label",
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
        {...buttonItem, 
          firstCont: {
            uiFramework: "custom-atoms",
            componentPath: "Div",
            gridDefination: {
              xs: 12,
              sm: 2
            }
          },searchButton: {...buttonItem.searchButton, 
          onClickDefination: {
            action: "condition",
            callBack: (state, dispatch) => searchApiCall(state, dispatch, false, "", "", true, branchType)
          }
        },
        resetButton: {
          componentPath: "Button",
          gridDefination: {
            xs: 12,
            sm: 4
          },
          props: {
            variant: "outlined",
            style: {
              color: "#fe7a51",
              borderColor: "#fe7a51",
              backgroundColor: "white",
              borderRadius: "2px",
              width: "80%",
              height: "48px"
            }
          },
          children: {
            buttonLabel: getLabel({
              labelName: "Clear",
              labelKey: "ES_SEARCH_RESET"
            })
          },
          onClickDefination: {
            action: "condition",
            callBack: (state, dispatch) => {
              clearPropertySearch(state, dispatch)
            }
          }
        }, lastCont: {
          uiFramework: "custom-atoms",
          componentPath: "Div",
          gridDefination: {
            xs: 12,
            sm: 2
          }
        }
      })
    })
  });

  const clearSearch = (state, dispatch) => {
    const preparedFinalObject = get(state, "screenConfiguration.preparedFinalObject");
    const {searchScreen = {}} = preparedFinalObject
    if(!!searchScreen.fileNumber || !!searchScreen.state || !!searchScreen.applicationNumber) {
    dispatch(
      handleField(
        "search-application",
        "components.div.children.estateApplicationSearch.children.cardContent.children.fileStatusContainer.children.fileNumber",
        "props.value",
        ""
      )
    )
    dispatch(
      handleField(
        "search-application",
        "components.div.children.estateApplicationSearch.children.cardContent.children.fileStatusContainer.children.status",
        "props.value",
        ""
      )
    )
    dispatch(
      handleField(
        "search",
        "components.div.children.estateApplicationSearch.children.cardContent.children.applicationNumberContainer.children.applicationNumber",
        "props.value",
        ""
      )
    )
    dispatch(prepareFinalObject("searchScreen", {}))
    searchApplicationApiCall(state, dispatch, true)
    }
  }

  const clearPropertySearch = (state, dispatch) => {
    const preparedFinalObject = get(state, "screenConfiguration.preparedFinalObject");
    const {searchScreen = {}} = preparedFinalObject
    if(!!searchScreen.fileNumber || !!searchScreen.state || !!searchScreen.SECTORNumber) {
    dispatch(
      handleField(
        "search",
        "components.div.children.estateApplication.children.cardContent.children.colonyContainer.children.fileNumber",
        "props.value",
        ""
      )
    )
    dispatch(
      handleField(
        "search",
        "components.div.children.estateApplication.children.cardContent.children.colonyContainer.children.status",
        "props.value",
        ""
      )
    )
    dispatch(
      handleField(
        "search",
        "components.div.children.estateApplication.children.cardContent.children.transitNumberContainer.children.sectorNumber",
        "props.value",
        ""
      )
    )
    dispatch(prepareFinalObject("searchScreen", {}))
    searchApplicationApiCall(state, dispatch, true)
    }
  }

  export const estateApplicationSearch = getCommonCard({
    subParagraph: getCommonParagraph({
      labelName: "Please provide atleast one parameter to search Applications",
      labelKey: "ES_PLEASE_PROVIDE_ONE_PARAMETER_TO_SEARCH_APPLICATIONS"
    }),
    fileStatusContainer: getCommonContainer({
      fileNumber: getTextField(FileNumberField),
      status: getSelectField(statusField)
    }),
    applicationNumberContainer: getCommonContainer({
        applicationNumber: getTextField(applicationNumberField),
        applicationType: getSelectField(applicationTypeField)
    }),
    button: getCommonContainer({
      buttonContainer: getCommonContainer(
        {firstCont: {
          uiFramework: "custom-atoms",
          componentPath: "Div",
          gridDefination: {
            xs: 12,
            sm: 2
          }
        }, searchButton: {...buttonItem.searchButton, 
          onClickDefination: {
            action: "condition",
            callBack: (state, dispatch) => searchApplicationApiCall(state, dispatch, false, "", "", true, branchType)
          }
        }, resetButton: {
          componentPath: "Button",
          gridDefination: {
            xs: 12,
            sm: 4
          },
          props: {
            variant: "outlined",
            style: {
              color: "#fe7a51",
              borderColor: "#fe7a51",
              backgroundColor: "white",
              borderRadius: "2px",
              width: "80%",
              height: "48px"
            }
          },
          children: {
            buttonLabel: getLabel({
              labelName: "Clear",
              labelKey: "ES_SEARCH_RESET"
            })
          },
          onClickDefination: {
            action: "condition",
            callBack: (state, dispatch) => {
              clearSearch(state, dispatch)
            }
          }
        }, lastCont: {
          uiFramework: "custom-atoms",
          componentPath: "Div",
          gridDefination: {
            xs: 12,
            sm: 2
          }
        }
      })
    })
  });