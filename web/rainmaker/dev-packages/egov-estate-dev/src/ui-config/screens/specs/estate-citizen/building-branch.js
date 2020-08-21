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

const tenantId = getTenantId();

const cardItems = [{
    label: {
      labelKey: "EST_APPLY_ESTATE_BRANCH",
      labelName: "Apply"
    },
    icon: < EstateIcon / > ,
    route: `building-branch-apply`
  },
  {
    label: {
      labelKey: "EST_MY_APPLICATIONS",
      labelName: "My Applications/Search Applications"
    },
    icon: < EstateIcon / > ,
    route: "building-branch-my-applications"
  },
  {
    label: {
      labelKey: "EST_PAY_DUE",
      labelName: "Pay Due"
    },
    icon: < EstateIcon / > ,
    route: "estateBranchPayDue"
  },
  {
    label: {
      labelKey: "EST_PROPERTY_SEARCH",
      labelName: "Property Search"
    },
    icon: < EstateIcon / > ,
    route: "building-branch-property-search"
  }
]


const BuildingBranchHome = {
  uiFramework: "material-ui",
  name: "building-branch",
  // beforeInitScreen: (action, state, dispatch) => {
  //   return action
  // },
  components: {
    div: {
      uiFramework: "custom-atoms",
      componentPath: "Div",
      children: {
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

export default BuildingBranchHome