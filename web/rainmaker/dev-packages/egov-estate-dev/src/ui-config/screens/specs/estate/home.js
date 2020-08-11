import React from "react";
import {
  getCommonHeader
} from "egov-ui-framework/ui-config/screens/specs/utils";
import FormIcon from "../../../../ui-atoms-local/Icons/FormIcon";

const header = getCommonHeader({
  labelName: "Estate",
  labelKey: "EST_ESTATE_HEADER"
}, {
  classes: {
    root: "common-header-cont"
  }
});

const cardItems = [{
  label: {
    labelKey: "EST_PROPERTY_MASTER_HEADER",
    labelName: "Property Master"
  },
  icon: < FormIcon / > ,
  route: "search"
}]


const estateHome = {
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
            items: cardItems,
            history: {},
          }
        }
      }
    }
  }
};

export default estateHome;