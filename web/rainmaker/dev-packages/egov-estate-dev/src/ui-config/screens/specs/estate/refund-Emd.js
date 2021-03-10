import React from "react";
import {
  getCommonHeader
} from "egov-ui-framework/ui-config/screens/specs/utils";
import FormIcon from "../../../../ui-atoms-local/Icons/FormIcon";
import { getUserInfo } from "egov-ui-kit/utils/localStorageUtils";

const userInfo = JSON.parse(getUserInfo());
const {roles = []} = userInfo
const refundEmdAccess = roles.find(item => item.code === "ES_EB_CHEIF_ACCOUNTS_OFFICER" || item.code === "ES_EB_LOCAL_AUDIT_OFFICER" || item.code === "ES_ADDITIONAL_COMMISSIONER");
const refund=roles.find(item=>item.code==="ES_EB_SECTION_OFFICER")
let citizenCardItems = []

const header = getCommonHeader({
  labelName: "Estate",
  labelKey: "ES_ESTATE_HEADER"
}, {
  classes: {
    root: "common-header-cont"
  }
});

const cardItems =  !!refund ? [
  {
    label: {
      labelKey: "ES_ISSUANCE_OF_REFUND",
      labelName: "Issuance of Refund"
    },
    icon: < FormIcon / > ,
    route: `/estate/property-search?type=refund`
  },
  {
    label: {
      labelKey: "ES_SEARCH_PROPERTIES",
      labelName: "Search Property"
    },
    icon: < FormIcon / > ,
    route: `/estate/refund-search-applications?branchType=ESTATE_BRANCH`
  }
] : !!refundEmdAccess?[
  {
    label: {
      labelKey: "ES_SEARCH_PROPERTIES",
      labelName: "Search Property"
    },
    icon: < FormIcon / > ,
    route: `/estate/refund-search-applications?branchType=ESTATE_BRANCH`
  }
]:[]

const refundEmd = {
  uiFramework: "material-ui",
  name: "refund-Emd",
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

export default refundEmd;