import { getCommonHeader } from "egov-ui-framework/ui-config/screens/specs/utils";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getMortgageSearchResults } from "../../../../ui-utils/commons";
import { getCommonCard, getCommonTitle, getCommonParagraph, getCommonContainer, getTextField, getSelectField, getLabel } from "egov-ui-framework/ui-config/screens/specs/utils";
import { getStatusList } from "../rented-properties/search";
import { localStorageGet,getTenantId } from "egov-ui-kit/utils/localStorageUtils";
import get from "lodash/get";
import {
  handleScreenConfigurationFieldChange as handleField
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
const header = getCommonHeader(
  {
    labelName: "My Applications",
    labelKey: "TL_MY_APPLICATIONS_HEADER"
  },
  {
    classes: {
      root: "common-header-cont"
    }
  }
);

const searchApplications = (state, dispatch) => {
  const preparedFinalObject = get(state, "screenConfiguration.preparedFinalObject");
  const {actualResults, searchScreen = {}} = preparedFinalObject
  let searchResults = actualResults
    if(!!searchScreen.applicationNumber) {
       searchResults = searchResults.filter(item => item.applicationNumber === searchScreen.applicationNumber)
    } 
    if(!!searchScreen.status) {
      searchResults = searchResults.filter(item => item.state === searchScreen.status)
    }
    dispatch(prepareFinalObject("searchResults", searchResults))
}

const clearSearch = (state, dispatch) => {
  const preparedFinalObject = get(state, "screenConfiguration.preparedFinalObject");
  const {actualResults, searchScreen = {}} = preparedFinalObject
  if(!!searchScreen.applicationNumber || !!searchScreen.status) {
  dispatch(
    handleField(
      "mortage-my-applications",
      "components.div.children.searchCard.children.cardContent.children.statusApplicationNumberContainer.children.applicationNo",
      "props.value",
      ""
    )
  )
  dispatch(
    handleField(
      "mortage-my-applications",
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
    labelName: "Search Mortage Application",
    labelKey: "RP_MORTAGE_SEARCH_RESULTS_HEADING"
  }),
  subParagraph: getCommonParagraph({
    labelName: "Provide at least one parameter to search for an application",
    labelKey: "TL_HOME_SEARCH_RESULTS_DESC"
  }),
  statusApplicationNumberContainer: getCommonContainer({
    applicationNo: getTextField({
      label: {
        labelName: "Application No.",
        labelKey: "TL_HOME_SEARCH_RESULTS_APP_NO_LABEL"
      },
      placeholder: {
        labelName: "Enter Application No.",
        labelKey: "TL_HOME_SEARCH_RESULTS_APP_NO_PLACEHOLDER"
      },
      gridDefination: {
        xs: 12,
        sm: 3
      },
      required: false,
      pattern: /^[a-zA-Z0-9-]*$/i,
      errorMessage: "ERR_INVALID_APPLICATION_NO",
      jsonPath: "searchScreen.applicationNumber"
    }),
    status: getSelectField({
      label: {
        labelName: "Application status",
        labelKey: "TL_HOME_SEARCH_RESULTS_APP_STATUS_LABEL"
      },
      placeholder: {
        labelName: "Select Application Status",
        labelKey: "TL_HOME_SEARCH_RESULTS_APP_STATUS_PLACEHOLDER"
      },
      required: false,
      jsonPath: "searchScreen.status",
      data:[
      ],
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
          labelKey: "TL_HOME_SEARCH_RESULTS_BUTTON_SEARCH"
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
          labelKey: "CS_INBOX_CLEAR"
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
  style:{marginLeft: 8, marginRight: 8}
})





const getData = async (action, state, dispatch) => {
  const response = await getMortgageSearchResults();
  if(!!response && !!response.MortgageApplications && !!response.MortgageApplications.length) {
    dispatch(prepareFinalObject("actualResults", response.MortgageApplications));
    dispatch(prepareFinalObject("searchResults", response.MortgageApplications));
  }
}

const screenConfig = {
  uiFramework: "material-ui",
  name: "mortage-my-applications",
  beforeInitScreen: (action, state, dispatch) => {
    const queryObject = [{ key: "tenantId", value: getTenantId() }, 
    { key: "businessServices", value: "PermissionToMortgage" }]
    clearSearch(state, dispatch);
    dispatch(prepareFinalObject("actualResults", []));
    dispatch(prepareFinalObject("searchResults", []));
    getData(action, state, dispatch)
    getStatusList(action,state, dispatch,queryObject,"mortage-my-applications", "components.div.children.searchCard.children.cardContent.children.statusApplicationNumberContainer.children.status"
    )
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
            contents: [
              {
                label: "RP_COMMON_TABLE_COL_APPLICAITON_NUMBER",
                jsonPath: "applicationNumber"
              },
              // {
              //   label: "RP_PROPERTY_ID_LABEL",
              //   jsonPath: "property.id"
              // },
              // {
              //   label: "RP_ALLOTMENT_NUMBER",
              //   jsonPath: "allotmentNumber",
              // },
              {
                label: "RP_COMMON_TABLE_COL_OWNER_NAME",
                jsonPath: "applicant[0].name"
              },
              {
                label: "RP_COMMON_TABLE_COL_STATUS",
                jsonPath: "state"
              }
            ],
            moduleName: "MORTGAGERP",
            applicationType:'MG',
            homeURL: "/rented-properties-citizen/mortage-apply"
          }
        }
      }
    }
  }
};

export default screenConfig;
