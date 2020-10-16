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
import {getStatusList, searchApiCall} from './searchResource/functions';
import {searchResults} from './searchResource/searchResults';

import {
  getUserInfo
} from "egov-ui-kit/utils/localStorageUtils";
import { WF_ALLOTMENT_OF_SITE } from "../../../../ui-constants";

const userInfo = JSON.parse(getUserInfo());
const {
  roles = []
} = userInfo
console.log(roles);
const findItem = roles.find(item => item.code === "ES_EB_SECTION_OFFICER");
const header = getCommonHeader({
  labelName: "Search Property Master",
  labelKey: "ES_SEARCH_PROPERTY_MASTER_HEADER"
});

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
        value: WF_ALLOTMENT_OF_SITE
      }
    ]
    dispatch(prepareFinalObject("searchScreen", {}))
      searchApiCall(state, dispatch, true)
      getStatusList( state, dispatch, queryObject, "search", "components.div.children.estateApplication.children.cardContent.children.colonyContainer.children.status", WF_ALLOTMENT_OF_SITE)
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
            addButton: {
              componentPath: "Button",
              visible: !!findItem,
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
                  labelName: "Add Property Master",
                  labelKey: "ES_ESTATE_HOME_ADD_BUTTON"
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