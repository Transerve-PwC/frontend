import {
  getCommonCard
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import { prepareFinalObject, handleScreenConfigurationFieldChange as handleField, toggleSpinner } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getSearchResults } from "../../../../ui-utils/commons";
import { getCourtCaseDetails } from "./preview-resource/courtCase-details";
import { onTabChange, headerrow, tabs, tabsAllotment } from './search-preview';
import {
  MANIMAJRA_BRANCH_TABS as tabsMM
} from "../../../../ui-constants";
import get from "lodash/get";

const paymentsContainer = {
  uiFramework: "custom-atoms",
componentPath: "Div",
props: {
  id: "docs"
},
children: {
}
}

const getData = async (action, state, dispatch, fileNumber) => {
  dispatch(prepareFinalObject("workflow.ProcessInstances", []))
  if (fileNumber) {
    let queryObject = [
      { key: "fileNumber", value: fileNumber },
      { key: "relations", value: "court" }
    ];
    let payload = await getSearchResults(queryObject);
    if (!!payload) {
      let properties = payload.Properties;
      dispatch(prepareFinalObject("Properties", properties));

      return {
        div: {
          uiFramework: "custom-atoms",
          componentPath: "Div",
          props: {
            className: "common-div-css search-preview"
          },
          children: {
            headerDiv: {
              uiFramework: "custom-atoms",
              componentPath: "Container",
              children: {
                header1: {
                  gridDefination: {
                    xs: 12,
                    sm: 8
                  },
                  ...headerrow
                },
              }
            },
            tabSection: {
              uiFramework: "custom-containers-local",
              moduleName: "egov-estate",
              componentPath: "CustomTabContainer",
              props: {
                tabs: tabsMM,
                activeIndex: 5,
                onTabChange
              },
              type: "array",
            },
            paymentsContainer
          }
        }
      }
    }
  }
}

const updateAllFields = (action, state, dispatch) => {
}

const commonPaymentDetails = {
  uiFramework: "material-ui",
  name: "payment-details",
  hasBeforeInitAsync: true,
  beforeInitScreen: async (action, state, dispatch) => {
    const fileNumber = getQueryArg(window.location.href, "fileNumber");
    dispatch(toggleSpinner())
    const components = await getData(action, state, dispatch, fileNumber)
    dispatch(toggleSpinner())
    setTimeout(() => updateAllFields(action, state, dispatch), 100)
    return {
      "type": "INIT_SCREEN",
      "screenKey": "payment-details",
      "screenConfig": {
        "uiFramework": "material-ui",
        "name": "payment-details",
        components
      }
    }
  }
}

export default commonPaymentDetails;