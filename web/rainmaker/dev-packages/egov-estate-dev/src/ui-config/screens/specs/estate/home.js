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

const citizenCardItems = [
  {
    label: {
      labelKey: "EST_ESTATE_BRANCH_HEADER",
      labelName: "Estate Branch"
    },
    icon: < FormIcon / > ,
    route: `/estate-citizen/estate-branch`
  },
  {
    label: {
      labelKey: "EST_BUILDING_BRANCH_HEADER",
      labelName: "Building Branch"
    },
    icon: < FormIcon / > ,
    route: `/estate-citizen/building-branch`
  },
  {
    label: {
      labelKey: "EST_MANIMAJRA_HEADER",
      labelName: "Manimajra"
    },
    icon: < FormIcon / > ,
    route: `/estate-citizen/manimajra`
  }
]


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
            items: process.env.REACT_APP_NAME === "Citizen" ? citizenCardItems : cardItems,
            history: {},
          }
        }
      }
    }
  }
};

export default estateHome;