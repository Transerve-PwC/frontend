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
import { estateApplication } from './searchResource/estateApplication';
import {searchApiCall} from './searchResource/functions';
import {searchResults} from './searchResource/searchResults';

import {
  getUserInfo
} from "egov-ui-kit/utils/localStorageUtils";

const userInfo = JSON.parse(getUserInfo());
const {
  roles = []
} = userInfo
const findItem = roles.find(item => item.code === "CTL_CLERK");
const header = getCommonHeader({
  labelName: "Search Estate Master",
  labelKey: "EST_SEARCH_ESTSTE_MASTER_HEADER"
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

const estateSearchAndResult = {
  uiFramework: "material-ui",
  name: "search",
  beforeInitScreen: (action, state, dispatch) => {
    const queryObject = [{
        key: "tenantId",
        value: getTenantId()
      },
      {
        key: "businessServices",
        value: "MasterEsatate"
      }
    ]
    dispatch(prepareFinalObject("searchScreen", {}))
      searchApiCall(state, dispatch, true)
      getStatusList(action, state, dispatch, queryObject, "search", "components.div.children.estateApplication.children.cardContent.children.colonyContainer.children.status", "MasterEsatate")
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
            searchButton: {
              componentPath: "Button",
              // visible: !!findItem,
              gridDefination: {
                xs: 12,
                sm: 4,
                align: "right"
              },
              props: {
                variant: "contained",
                style: {
                  color: "white",
                  backgroundColor: "#fe7a51",
                  borderColor: "#fe7a51",
                  borderRadius: "2px",
                  width: "50%",
                  height: "48px",
                }
              },
              children: {
                buttonLabel: getLabel({
                  labelName: "MASTER ADD",
                  labelKey: "EST_ESTATE_HOME_ADD_BUTTON"
                })
              },
              onClickDefination: {
                action: "condition",
                callBack: (state, dispatch) => {
                  dispatch(setRoute(`/estate/apply?tenantId=${getTenantId()}`));
                }
              }
            }
          }
        },
          estateApplication,
        breakAfterSearch: getBreak(),
          searchResults
      }
    }
  }
};

export default estateSearchAndResult;