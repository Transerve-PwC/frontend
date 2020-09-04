import { fetchData } from "./citizenSearchResource/citizenFunctions";
import { getCommonHeader, getCommonCard, getCommonTitle, getCommonParagraph, getCommonContainer, getTextField, getSelectField, getLabel } from "egov-ui-framework/ui-config/screens/specs/utils";
import { getStatusList } from "../tradelicence/searchResource/functions";
import get from "lodash/get";
import {
  prepareFinalObject,
  handleScreenConfigurationFieldChange as handleField
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getLicensePeriod } from "../utils";

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
      searchResults = searchResults.filter(item => item.status === searchScreen.status)
    }
    dispatch(prepareFinalObject("searchResults", searchResults))
}

const clearSearch = (state, dispatch) => {
  const preparedFinalObject = get(state, "screenConfiguration.preparedFinalObject");
  const {actualResults, searchScreen = {}} = preparedFinalObject
  if(!!searchScreen.applicationNumber || !!searchScreen.status) {
  dispatch(
    handleField(
      "my-applications",
      "components.div.children.searchCard.children.cardContent.children.statusApplicationNumberContainer.children.applicationNo",
      "props.value",
      ""
    )
  )
  dispatch(
    handleField(
      "my-applications",
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
    labelName: "Search Trade License Application",
    labelKey: "TL_HOME_SEARCH_RESULTS_HEADING"
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
      localePrefix: {
        moduleName: "WF",
        masterName: "NEWTL"
      },
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
          // marginBottom: "10px",
          backgroundColor: "rgba(0, 0, 0, 0.6000000238418579)",
          borderRadius: "2px",
          width: "80%",
          height: "48px",
          marginTop: "8px"
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
          height: "48px",
          marginTop: "8px"
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

const screenConfig = {
  uiFramework: "material-ui",
  name: "my-applications",
  beforeInitScreen: (action, state, dispatch) => {
    dispatch(prepareFinalObject("actualResults", []));
    dispatch(prepareFinalObject("searchResults", []));
    clearSearch(state, dispatch);
    fetchData(action, state, dispatch);
    getStatusList(state, dispatch, "my-applications", "components.div.children.searchCard.children.cardContent.children.statusApplicationNumberContainer.children.status")
    return action;
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
                label: "TL_COMMON_TABLE_COL_APP_TYPE",
                jsonPath: "applicationType"
              },
              {
                label: "TL_TRADE_TYPE_LABEL",
                jsonPath: "businessService",
                suffix: "_GROUP"
              },
              {
                label: "TL_SERVICE_TYPE_LABEL",
                jsonPath: "businessService",
                suffix: "_SHORT"
              },
              {
                label: "TL_COMMON_TABLE_COL_APP_NO",
                jsonPath: "applicationNumber"
              },
              {
                label: "TL_COMMON_TABLE_COL_OWN_NAME",
                jsonPath: "tradeLicenseDetail.owners[0].name"
              },
              {
                label: "TL_COMMON_TABLE_COL_LIC_NO",
                jsonPath: "licenseNumber"
              },
              {
                label: "TL_COMMON_TABLE_COL_STATUS",
                jsonPath: "status",
                prefix: "WF_NEWTL_"
              },
              {
                label: "TL_LICENSE_PERIOD_LABEL",
                jsonPath: "tradeLicenseDetail.additionalDetail.licensePeriod",
                callBack: getLicensePeriod
              }
            ],
            moduleName: "TL",
            homeURL: "/tradelicense-citizen/home"
          }
        }
      }
    }
  }
};

export default screenConfig;
