import React from "react";
import {
  getCommonHeader
} from "egov-ui-framework/ui-config/screens/specs/utils";
import FormIcon from "../../../../ui-atoms-local/Icons/FormIcon";
import "../utils/index.css";
import {
  getTenantId
} from "egov-ui-kit/utils/localStorageUtils";
import { EstateIcon } from "../../../../ui-atoms-local";

const header = getCommonHeader({
  labelName: "Manimajra",
  labelKey: "ES_MANIMAJRA_HEADER"
}, {
  classes: {
    root: "common-header-cont"
  }
});

const cardItems = [{
    label: {
      labelKey: "ES_APPLY_ESTATE_BRANCH",
      labelName: "Apply"
    },
    icon: < EstateIcon / > ,
    route: `property-search?branchType=MANI_MAJRA`
  },
  {
    label: {
      labelKey: "ES_MY_APPLICATIONS",
      labelName: "My Applications/Search Applications"
    },
    icon: < EstateIcon / > ,
    route: "my-applications?branchType=ManiMajra"
  }
]


const manimajraHome = {
  uiFramework: "material-ui",
  name: "manimajra",
  // beforeInitScreen: (action, state, dispatch) => {
  //   return action
  // },
  components: {
    div: {
      uiFramework: "custom-atoms",
      componentPath: "Div",
      children: {
        header,
        applyCard: {
          moduleName: "egov-estate",
          uiFramework: "custom-molecules-local",
          componentPath: "LandingPage",
          props: {
            items: cardItems,
            history: {},
            style: {
              width: "100%"
            }
          }
        }
      }
    }
  }
}

export default manimajraHome