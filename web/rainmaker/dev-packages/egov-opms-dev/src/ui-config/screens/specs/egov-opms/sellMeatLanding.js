import React from "react";
import { getCommonHeader } from "egov-ui-framework/ui-config/screens/specs/utils";
import MyApplicationIcon from "../../../../ui-atoms-local/Icons/MyApplicationIcon";
import { getRequiredDocData, clearlocalstorageAppDetails, checkForRole } from "../utils";
import get from "lodash/get";
import set from "lodash/set";
import {
  getAccessToken,
  getOPMSTenantId,
  getLocale,
  getUserInfo,
  setapplicationType
} from "egov-ui-kit/utils/localStorageUtils";

let roles = JSON.parse(getUserInfo()).roles

const header = getCommonHeader(
  {
    labelName: "OPMS",
    labelKey: "ACTION_TEST_OPMS"
  },
  {
    classes: {
      root: "common-header-cont"
    }
  }
);
let cardItems = [];
if (checkForRole(roles, 'CITIZEN')) {
  const cardlist = [
    {
      label: {
        labelKey: "Apply for NOC to sell meat",
        labelName: "Apply for NOC to sell meat"
      },
      icon: <i
        viewBox="0 -8 35 42"
        color="primary"
        class="material-icons module-page-icon" style={{ fontSize: "48px" }}>
        restaurant
      </i>,
      route: "applysellmeat"

    },
    {
      label: {
        labelKey: "My Application",
        labelName: "My Application"
      },
      icon: <MyApplicationIcon />,
      route: "sellmeatnoc-my-applications"
    },


  ];
  cardItems = cardlist;
}


const tradeLicenseSearchAndResult = {
  uiFramework: "material-ui",
  name: "sellMeatLanding",
  beforeInitScreen: (action, state, dispatch) => {
    clearlocalstorageAppDetails(state);
    setapplicationType('SELLMEATNOC');

    return action;
  },
  components: {
    div: {
      uiFramework: "custom-atoms",
      componentPath: "Div",
      children: {
        header: header,
        applyCard: {
          uiFramework: "custom-molecules",
          componentPath: "LandingPage",
          props: {
            items: cardItems,
            history: {}
          }
        }
      }
    },
    adhocDialog: {
      uiFramework: "custom-containers-local",
      moduleName: "egov-opms",
      componentPath: "DialogContainer",
      props: {
        open: false,
        maxWidth: false,
        screenKey: "sellMeatLanding"
      },
      children: {
        popup: {}
      }
    }
  }
};

export default tradeLicenseSearchAndResult;
