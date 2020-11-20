import React from "react";
import {
  getCommonHeader
} from "egov-ui-framework/ui-config/screens/specs/utils";
import FormIcon from "../../../../ui-atoms-local/Icons/FormIcon";

let citizenCardItems = []

const header = getCommonHeader({
  labelName: "Estate",
  labelKey: "ES_ESTATE_HEADER"
}, {
  classes: {
    root: "common-header-cont"
  }
});

const cardItems = [
  {
    label: {
      labelKey: "ES_PROPERTY_MASTER_PENALTY_HEADER",
      labelName: "Estate Branch"
    },
    icon: < FormIcon / > ,
    route: `/estate/property-search?type=penalty`
  },
  {
    label: {
      labelKey: "ES_SECURITY_FEE_HEADER",
      labelName: "Security Fee"
    },
    icon: < FormIcon / > ,
    route: `/estate/property-search?type=security-fee`
  },
  {
    label: {
      labelKey: "ES_EXTENSION_FEE_HEADER",
      labelName: "Extension Fee"
    },
    icon: < FormIcon / > ,
    route: `/estate/property-search?type=extension-fee`
  }
]

const penaltyFee = {
  uiFramework: "material-ui",
  name: "home",
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
            items: process.env.REACT_APP_NAME === "Employee" ? cardItems : citizenCardItems,
            jsonPath: null,
            history: {},
            isArray: false
          }
        }
      }
    }
  }
};

export default penaltyFee;