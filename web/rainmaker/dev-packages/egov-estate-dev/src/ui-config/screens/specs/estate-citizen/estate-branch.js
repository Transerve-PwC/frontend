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
      labelKey: "ES_APPLY_ESTATE_BRANCH",
      labelName: "Apply"
    },
    icon: < EstateIcon / > ,
    route: `property-search?branchType=ESTATE_BRANCH`
  },
  {
    label: {
      labelKey: "ES_MY_APPLICATIONS",
      labelName: "My Applications/Search Applications"
    },
    icon: < EstateIcon / > ,
    route: "my-applications?branchType=EstateBranch"
  },
  {
    label: {
      labelKey: "ES_PAY_DUE",
      labelName: "Pay Due"
    },
    icon: < EstateIcon / > ,
    route: "property-search?type=payment"
  },
  {
    label: {
      labelKey: "ES_PROPERTY_SEARCH",
      labelName: "Property Search"
    },
    icon: < EstateIcon / > ,
    route: "estate-branch-property-search"
  }
]


const estateBranchHome = {
  uiFramework: "material-ui",
  name: "estate-branch",
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

export default estateBranchHome