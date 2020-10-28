import React from "react";
import {
  getCommonHeader
} from "egov-ui-framework/ui-config/screens/specs/utils";
import FormIcon from "../../../../ui-atoms-local/Icons/FormIcon";
import {
  getTenantId,
  getUserInfo
} from "egov-ui-kit/utils/localStorageUtils";

// const userInfo = JSON.parse(getUserInfo());
// const {
//   roles = []
// } = userInfo

let cardItems = []

const header = getCommonHeader({
  labelName: "Estate",
  labelKey: "ES_ESTATE_HEADER"
}, {
  classes: {
    root: "common-header-cont"
  }
});

// const _cardItems = [
//   {
//     label: {
//       labelKey: "ES_PROPERTY_MASTER_HEADER",
//       labelName: "Property Master"
//     },
//     icon: < FormIcon / > ,
//     route: "search"
//   },
//   {
//     label: {
//       labelKey: "ES_PROPERTY_MASTER_SEARCH_APPLICATION_HEADER",
//       labelName: "Search Applications"
//     },
//     icon: < FormIcon / > ,
//     route: "search-application"
//   },
//   {
//     label: {
//       labelKey: "ES_PROPERTY_MASTER_REFUND_HEADER",
//       labelName: "Refund"
//     },
//     icon: < FormIcon / > ,
//     route: "search?type=refund"
//   },
//   {
//     label: {
//       labelKey: "ES_PROPERTY_MASTER_ISSUING_NOTICE_HEADER",
//       labelName: "Issuing Notice"
//     },
//     icon: < FormIcon / > ,
//     route: "/estate/property-search?type=EstateBranch_InternalServices_IssuanceOfNotice"
//   },
//   {
//     label: {
//       labelKey: "ES_ACCOUNT_STATEMENT_GENERATION_HEADER",
//       labelName: "Account Statement Generation"
//     },
//     icon: < FormIcon / > ,
//     route: "/estate/estate-search-account-statement"
//   },
//   {
//     label: {
//       labelKey: "ES_RENT_PAYMENT_HEADER",
//       labelName: "Rent Payment"
//     },
//     icon: < FormIcon / > ,
//     route: "/estate/property-search?type=payment"
//   }
// ]

{/* if (!!findItem) {
  let allotmentCardItem = {
      label: {
        labelKey: "ES_PROPERTY_MASTER_ALLOTMENT_HEADER",
        labelName: "Allotment"
      },
      icon: < FormIcon / > ,
      route: `allotment?tenantId=${getTenantId()}`
    };
  cardItems.splice(2, 0, allotmentCardItem);
} */}

const citizenCardItems = [
  {
    label: {
      labelKey: "ES_ESTATE_BRANCH_HEADER",
      labelName: "Estate Branch"
    },
    icon: < FormIcon / > ,
    route: `/estate-citizen/estate-branch`
  },
  {
    label: {
      labelKey: "ES_BUILDING_BRANCH_HEADER",
      labelName: "Building Branch"
    },
    icon: < FormIcon / > ,
    route: `/estate-citizen/building-branch`
  },
  {
    label: {
      labelKey: "ES_MANIMAJRA_HEADER",
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
            jsonPath: process.env.REACT_APP_NAME === "Employee" ? "app.menu" : null,
            history: {},
            isArray: process.env.REACT_APP_NAME === "Employee"
          }
        }
      }
    }
  }
};

export default estateHome;