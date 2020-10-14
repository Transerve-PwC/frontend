import {
  getCommonHeader
} from "egov-ui-framework/ui-config/screens/specs/utils";
import {
  getSearchApplicationsResults
} from "../../../../ui-utils/commons";
import {
  prepareFinalObject
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import {
  getCommonCard,
  getCommonTitle,
  getCommonParagraph,
  getCommonContainer,
  getTextField,
  getSelectField,
  getLabel
} from "egov-ui-framework/ui-config/screens/specs/utils";
import {
  getStatusList
} from "../estate/searchResource/functions";
import {
  localStorageGet,
  getTenantId
} from "egov-ui-kit/utils/localStorageUtils";
import get from "lodash/get";
import {
  handleScreenConfigurationFieldChange as handleField
} from "egov-ui-framework/ui-redux/screen-configuration/actions";

const header = getCommonHeader({
  labelName: "My Applications",
  labelKey: "ES_MY_APPLICATIONS_HEADER"
}, {
  classes: {
    root: "common-header-cont"
  }
});

const searchApplications = (state, dispatch) => {
  const preparedFinalObject = get(state, "screenConfiguration.preparedFinalObject");
  const {
    actualResults,
    searchScreen = {}
  } = preparedFinalObject
  let searchResults = actualResults
  if (!!searchScreen.applicationNumber) {
    searchResults = searchResults.filter(item => item.applicationNumber === (searchScreen.applicationNumber).trim())
  }
  if (!!searchScreen.status) {
    searchResults = searchResults.filter(item => item.state === (searchScreen.status).trim())
  }
  dispatch(prepareFinalObject("searchResults", searchResults))
}

const clearSearch = (state, dispatch) => {
  const preparedFinalObject = get(state, "screenConfiguration.preparedFinalObject");
  const {
    actualResults,
    searchScreen = {}
  } = preparedFinalObject
  if (!!searchScreen.applicationNumber || !!searchScreen.status) {
    dispatch(
      handleField(
        "estate-branch-my-applications",
        "components.div.children.searchCard.children.cardContent.children.statusApplicationNumberContainer.children.applicationNo",
        "props.value",
        ""
      )
    )
    dispatch(
      handleField(
        "estate-branch-my-applications",
        "components.div.children.searchCard.children.cardContent.children.statusApplicationNumberContainer.children.status",
        "props.value",
        ""
      )
    )
    dispatch(prepareFinalObject("searchScreen", {}))
    dispatch(prepareFinalObject("searchResults", actualResults))
  }
}

const searchCard = getCommonCard({
  subHeader: getCommonTitle({
    labelName: "Search Application",
    labelKey: "ES_SEARCH_APPLICATION"
  }),
  subParagraph: getCommonParagraph({
    labelName: "Provide at least one parameter to search for an application",
    labelKey: "ES_PLEASE_PROVIDE_ONE_PARAMETER_TO_SEARCH_APPLICATIONS"
  }),
  statusApplicationNumberContainer: getCommonContainer({
    applicationNo: getTextField({
      label: {
        labelName: "Application No.",
        labelKey: "ES_APPLICATION_NUMBER_LABEL"
      },
      placeholder: {
        labelName: "Enter Application No.",
        labelKey: "ES_APPLICATION_NUMBER_PLACEHOLDER"
      },
      gridDefination: {
        xs: 12,
        sm: 3
      },
      required: false,
      pattern: /^[a-zA-Z0-9-]*$/i,
      errorMessage: "ES_ERR_INVALID_APPLICATION_NO",
      jsonPath: "searchScreen.applicationNumber"
    }),
    status: getSelectField({
      label: {
        labelName: "Application status",
        labelKey: "ES_APPLICATION_STATUS_LABEL"
      },
      placeholder: {
        labelName: "Select Application Status",
        labelKey: "ES_APPLICATION_STATUS_PLACEHOLDER"
      },
      required: false,
      jsonPath: "searchScreen.status",
      data: [],
      gridDefination: {
        xs: 12,
        sm: 3
      }
    }),
    searchButton: {
      componentPath: "Button",
      gridDefination: {
        xs: 12,
        sm: 3
      },
      props: {
        variant: "contained",
        style: {
          color: "white",
          marginBottom: "10px",
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
      },
      onClickDefination: {
        action: "condition",
        callBack: (state, dispatch) => {
          searchApplications(state, dispatch)
        }
      }
    },
    clearButton: {
      componentPath: "Button",
      gridDefination: {
        xs: 12,
        sm: 3
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
          labelKey: "ES_SEARCH_CLEAR"
        })
      },
      onClickDefination: {
        action: "condition",
        callBack: (state, dispatch) => {
          clearSearch(state, dispatch)
        }
      }
    }
  })
}, {
  style: {
    marginLeft: 8,
    marginRight: 8
  }
})




const getData = async (action, state, dispatch) => {
  const response = await getSearchApplicationsResults();
  console.log(response)
  if (!!response && !!response.Applications && !!response.Applications.length) {
    dispatch(prepareFinalObject("actualResults", response.Applications));
    dispatch(prepareFinalObject("searchResults", response.Applications));
  }
}


const screenConfig = {
  uiFramework: "material-ui",
  name: "estate-branch-my-applications",
  beforeInitScreen: (action, state, dispatch) => {
    const queryObject = [{
        key: "tenantId",
        value: getTenantId()
      },
      {
        key: "businessServices",
        value: "SaleGift"
      }
    ]
    dispatch(prepareFinalObject("actualResults", []));
    dispatch(prepareFinalObject("searchResults", []));
    clearSearch(state, dispatch);
    getData(action, state, dispatch)
    // getStatusList(state, dispatch, queryObject, "estate-branch-my-applications", "components.div.children.searchCard.children.cardContent.children.statusApplicationNumberContainer.children.status", "SaleGift")
    return action
  },
  components: {
    div: {
      uiFramework: "custom-atoms",
      componentPath: "Div",
      children: {
        header: header,
        searchCard,
        applicationsCard: {
          uiFramework: "custom-molecules",
          componentPath: "SingleApplication",
          visible: true,
          props: {
            contents: [{
                label: "ES_APPLICATION_NUMBER_LABEL",
                jsonPath: "applicationNumber"
              },
              {
                label: "ES_FILE_NUMBER_LABEL",
                jsonPath: "property.fileNumber"
              },
              {
                label: "ES_APPLICATION_STATUS_LABEL",
                jsonPath: "state"
              }
            ],
            moduleName: "EST",
            homeURL: "/estate-citizen/estate-branch-apply"
          }
        }
      }
    }
  }
};

export default screenConfig;