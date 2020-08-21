import React from "react";
import {
  getCommonHeader
} from "egov-ui-framework/ui-config/screens/specs/utils";
import FormIcon from "../../../../ui-atoms-local/Icons/FormIcon";
import { EstateIcon } from "../../../../ui-atoms-local";


const estateHeader = getCommonHeader({
  labelName: "Estate",
  labelKey: "EST_ESTATE_HEADER"
}, {
  classes: {
    root: "common-header-cont"
  }
});

const buildingBranchHeader = getCommonHeader({
  labelName: "Building Branch",
  labelKey: "EST_BUILDING_BRANCH_HEADER"
}, {
  classes: {
    root: "common-header-cont"
  }
});

const manimajraHeader = getCommonHeader({
  labelName: "Manimajra",
  labelKey: "EST_MANIMAJRA_HEADER"
}, {
  classes: {
    root: "common-header-cont"
  }
});

const cardItems = [
  {
    label: {
      labelKey: "EST_PROPERTY_MASTER_HEADER",
      labelName: "Property Master"
    },
    icon: < FormIcon / > ,
    route: "search"
  },
  {
    label: {
      labelKey: "EST_PROPERTY_MASTER_SEARCH_APPLICATION_HEADER",
      labelName: "Search Applications"
    },
    icon: < FormIcon / > ,
    route: "search"
  },
  {
    label: {
      labelKey: "EST_PROPERTY_MASTER_ALLOTMENT_CANCELLATION_HEADER",
      labelName: "Allotment/Cancellation"
    },
    icon: < FormIcon / > ,
    route: "search"
  },
  {
    label: {
      labelKey: "EST_PROPERTY_MASTER_REFUND_HEADER",
      labelName: "Refund"
    },
    icon: < FormIcon / > ,
    route: "search"
  },
  {
    label: {
      labelKey: "EST_PROPERTY_MASTER_ISSUING_NOTICE_HEADER",
      labelName: "Issuing Notice"
    },
    icon: < FormIcon / > ,
    route: "search"
  }
]

const buildingCardItems = [
  {
    label: {
      labelKey: "EST_PROPERTY_MASTER_HEADER",
      labelName: "Property Master"
    },
    icon: < FormIcon / > ,
    route: "search"
  },
  {
    label: {
      labelKey: "EST_PROPERTY_MASTER_SEARCH_APPLICATION_HEADER",
      labelName: "Search Applications"
    },
    icon: < FormIcon / > ,
    route: "search"
  },
  {
    label: {
      labelKey: "EST_PROPERTY_MASTER_ALLOTMENT_CANCELLATION_HEADER",
      labelName: "Allotment/Cancellation"
    },
    icon: < FormIcon / > ,
    route: "search"
  },
  {
    label: {
      labelKey: "EST_PROPERTY_MASTER_REFUND_HEADER",
      labelName: "Refund"
    },
    icon: < FormIcon / > ,
    route: "search"
  },
  {
    label: {
      labelKey: "EST_PROPERTY_MASTER_ISSUING_NOTICE_HEADER",
      labelName: "Issuing Notice"
    },
    icon: < FormIcon / > ,
    route: "search"
  }
]

const ManimajraCardItems = [
  {
    label: {
      labelKey: "EST_PROPERTY_MASTER_HEADER",
      labelName: "Property Master"
    },
    icon: < FormIcon / > ,
    route: "search"
  },
  {
    label: {
      labelKey: "EST_PROPERTY_MASTER_SEARCH_APPLICATION_HEADER",
      labelName: "Search Applications"
    },
    icon: < FormIcon / > ,
    route: "search"
  },
  {
    label: {
      labelKey: "EST_PROPERTY_MASTER_ALLOTMENT_CANCELLATION_HEADER",
      labelName: "Allotment/Cancellation"
    },
    icon: < FormIcon / > ,
    route: "search"
  },
  {
    label: {
      labelKey: "EST_PROPERTY_MASTER_REFUND_HEADER",
      labelName: "Refund"
    },
    icon: < FormIcon / > ,
    route: "search"
  },
  {
    label: {
      labelKey: "EST_PROPERTY_MASTER_ISSUING_NOTICE_HEADER",
      labelName: "Issuing Notice"
    },
    icon: < FormIcon / > ,
    route: "search"
  }
]

{/* const citizenCardItems = [
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
] */}

const CitizenEstaeCardItems = [{
    label: {
      labelKey: "EST_APPLY_ESTATE_BRANCH",
      labelName: "Apply"
    },
    icon: < EstateIcon / > ,
    route: `estate-branch-apply`
  },
  {
    label: {
      labelKey: "EST_MY_APPLICATIONS",
      labelName: "My Applications/Search Applications"
    },
    icon: < EstateIcon / > ,
    route: "estate-branch-my-applications"
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
    route: "estate-branch-property-search"
  }]

  const CitizenCard =  {estateHeader,
        estateCard: {
          moduleName: "egov-estate",
          uiFramework: "custom-molecules-local",
          componentPath: "LandingPage",
          props: {
            items: process.env.REACT_APP_NAME === "Citizen" ? CitizenEstaeCardItems : cardItems,
            history: {},
          }
        },
        buildingBranchHeader,
        buildingCard: {
          moduleName: "egov-estate",
          uiFramework: "custom-molecules-local",
          componentPath: "LandingPage",
          props: {
            items: process.env.REACT_APP_NAME === "Citizen" ? buildingCardItems : cardItems,
            history: {},
          }
        },
        manimajraHeader,
        manimajraCard: {
          moduleName: "egov-estate",
          uiFramework: "custom-molecules-local",
          componentPath: "LandingPage",
          props: {
            items: process.env.REACT_APP_NAME === "Citizen" ? ManimajraCardItems : cardItems,
            history: {},
          }
        }
      }

      const employeeCard = {
         estateHeader,
         estateCard: {
           moduleName: "egov-estate",
           uiFramework: "custom-molecules-local",
           componentPath: "LandingPage",
           props: {
             items: process.env.REACT_APP_NAME === "Citizen" ? CitizenEstaeCardItems : cardItems,
             history: {},
           }
         },
      }


const estateHome = {
  uiFramework: "material-ui",
  name: "home",
  components: {
    div: {
      uiFramework: "custom-atoms",
      componentPath: "Div",
      children: process.env.REACT_APP_NAME === "Citizen" ? CitizenCard : employeeCard
    }
  }
};

export default estateHome;