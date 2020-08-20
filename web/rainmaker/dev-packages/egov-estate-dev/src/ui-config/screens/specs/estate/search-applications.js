import {
  getCommonHeader,
  getLabel,
  getBreak,
  getCommonContainer
} from "egov-ui-framework/ui-config/screens/specs/utils";
import {
  setRoute
} from "egov-ui-framework/ui-redux/app/actions";
import {
  getQueryArg,
  setBusinessServiceDataToLocalStorage
} from "egov-ui-framework/ui-utils/commons";
import {
  prepareFinalObject,
  handleScreenConfigurationFieldChange as handleField,
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import {
  localStorageGet,
  getTenantId
} from "egov-ui-kit/utils/localStorageUtils";
import {
  httpRequest
} from "../../../../ui-utils";
import find from "lodash/find";
import get from "lodash/get";
import {
  estateApplication
} from './searchApplicationsResource/estateApplication';
import {
  searchApiCall
} from './searchApplicationsResource/functions';
import {
  searchResults
} from './searchApplicationsResource/searchResults';
import {
  getUserInfo
} from "egov-ui-kit/utils/localStorageUtils";

const header = getCommonHeader({
  labelName: "Search Applications",
  labelKey: "EST_SEARCH_APPLICATIONS_HEADER"
});

export const getStatusList = async (action, state, dispatch, queryObject, screenkey, path, businessService) => {
  await setBusinessServiceDataToLocalStorage(queryObject, dispatch);
  const businessServices = JSON.parse(localStorageGet("businessServiceData"));
  if (!!businessServices) {
    const status = businessServices[0].states.filter(item => !!businessService ? !!item.state : !!item.state && (item.state !== "OT_DRAFTED" && item.state !== "DC_DRAFTED" && item.state !== "MG_DRAFTED")).map(({
      state
    }) => ({
      code: state
    }))
    dispatch(
      handleField(
        screenkey,
        path,
        "props.data",
        status
      )
    );
  }
}

const searchApplications = {
  uiFramework: "material-ui",
  name: "search-applications",
  beforeInitScreen: (action, state, dispatch) => {
    const queryObject = [{
        key: "tenantId",
        value: getTenantId()
      },
      {
        key: "businessServices",
        value: "PropertyMaster"
      }
    ]
    dispatch(prepareFinalObject("searchApplicationsScreen", {}))
    searchApiCall(state, dispatch, true)
    // getStatusList(action, state, dispatch, queryObject, "search-applications", "components.div.children.estateApplication.children.cardContent.children.colonyContainer.children.status", "PropertyMaster")
    return action
  },
  components: {
    div: {
      uiFramework: "custom-atoms",
      componentPath: "Form",
      props: {
        className: "common-div-css",
        id: "search"
      },
      children: {
        headerDiv: {
          uiFramework: "custom-atoms",
          componentPath: "Container",
          children: {
            header: {
              gridDefination: {
                xs: 12,
                sm: 8
              },
              ...header
            },
          }
        },
        estateApplication,
        breakAfterSearch: getBreak(),
        searchResults
      }
    }
  }
};

export default searchApplications;