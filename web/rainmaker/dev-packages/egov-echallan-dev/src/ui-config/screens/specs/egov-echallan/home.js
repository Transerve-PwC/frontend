import React from "react";
import { getCommonHeader, getCommonContainer, getLabel } from "egov-ui-framework/ui-config/screens/specs/utils";
import get from "lodash/get";
import set from "lodash/set";
import {
  getUserInfo, localStorageSet, localStorageGet, getTenantId, setapplicationType
} from "egov-ui-kit/utils/localStorageUtils";
import {
  prepareFinalObject,
  handleScreenConfigurationFieldChange as handleField,
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { headerChallan } from "./challanManage/headerChallan/manageChallanHeader";
import { getDashboardChallanCount } from "../../../../ui-utils/commons";
import { handleFieldChange } from "egov-ui-kit/redux/form/actions";
import { checkForRole, getMdmsEncroachmentSectorData } from "../utils";

const header = getCommonHeader(
  {
    labelName: "eChallan",
    labelKey: "EC_MANAGE_CHALLAN"
  },
  {
    style: {
      padding: "20px",
    }
  },
  {
    classes: {
      root: "common-header-cont"
    }
  }
);

const ECHALLAN = {
  label: {
    labelName: "E - Challan",
    labelKey: "EC_CHALLAN_CARD"
  },
  icon: <i
    viewBox="0 -8 35 42"
    color="primary"
    font-size="40px"
    class="material-icons module-page-icon" style={{ fontSize: "40px" }}>
    wysiwyg
</i>,
  route: "echallan-landing",
  id: "eChallan",
  roleDefination: {
    rolePath: "user-info.roles",
    roles: ["challanSI", "challanSM", "challanHOD", "challanEAO"],
  },
}

const ECHALLANAUCTION = {
  label: {
    labelName: "Auction",
    labelKey: "EC_AUCTION_CARD"
  },
  icon: <i
    viewBox="0 -8 35 42"
    color="primary"
    font-size="40px"
    class="material-icons module-page-icon" style={{ fontSize: "40px" }}>
    gavel
</i>,
  route: "../egov-echallan-auction/home",
  id: "eAuction",
  roleDefination: {
    rolePath: "user-info.roles",
    roles: ["challanSM", "challanHOD", "challanEAO"],
  },
}

const ECFINEMASTER = {
  label: {
    labelName: "FINE MASTEr",
    labelKey: "EC_FINE_MASTER"
  },
  icon: <i
    viewBox="0 -8 35 42"
    color="primary"
    font-size="40px"
    class="material-icons module-page-icon" style={{ fontSize: "40px" }}>
    grading
</i>,
  route: "../egov-echallan-fine-master/search",
  id: "fine-Master",
  roleDefination: {
    rolePath: "user-info.roles",
    roles: ["challanHOD"],
  },
}


let allCardList = [
  { "code": "ECHALLAN", "value": ECHALLAN },
  { "code": "ECHALLANAUCTION", "value": ECHALLANAUCTION },
  { "code": "ECFINEMASTER", "value": ECFINEMASTER }]


const setcardList = (state, dispatch) => {
  let mdmsCardList = get(state, "screenConfiguration.preparedFinalObject.applyScreenMdmsData.egec.cardList",
    []
  );
  let moduleCardList = []
  let roles = JSON.parse(getUserInfo()).roles;
  mdmsCardList.map((item, index) => {
    roles.some(r => {
      if (item.roles.includes(r.code)) {
        if (moduleCardList.length > 0) {
          if (!moduleCardList.find((x) => x.code == item.code)) {
            if (allCardList[index] !== undefined) {
              moduleCardList.push(allCardList[index])
            }
          }
        } else {
          if (allCardList[index] !== undefined) {
            moduleCardList.push(allCardList[index])
          }
        }
      }
    })
  });

  const cards = moduleCardList.map((item, index) => {
    return item.value
  });

  dispatch(
    handleField(
      "home",
      "components.div.children.applyCard",
      "props.items",
      cards
    )
  );
}


const eChallanPermissionManagement = {
  uiFramework: "material-ui",
  name: "home",
  beforeInitScreen: (action, state, dispatch) => {
    setapplicationType("egov-echallan");
    getMdmsEncroachmentSectorData(action, state, dispatch).then(response => {
      setcardList(state, dispatch);
    });
    return action;
  },
  components: {
    div: {
      uiFramework: "custom-atoms",
      componentPath: "Div",
      children: {
        header: header,
        headerChallan: headerChallan,
        applyCard: {
          uiFramework: "custom-molecules", //"custom-molecules-local",
          moduleName: "egov-echallan",
          componentPath: "LandingPage",
          props: {
            items: [],
            history: {},
            module: "egov-echallan"
          }
        },
        // listCard: {
        //   uiFramework: "custom-molecules-local",
        //   moduleName: "egov-echallan",
        //   componentPath: "HowItWorks"
        // }
      }
    },
    adhocDialog: {
      uiFramework: "custom-containers-local",
      moduleName: "egov-echallan",
      componentPath: "DialogContainer",
      props: {
        open: false,
        maxWidth: false,
        screenKey: "home"
      },
      children: {
        popup: {}
      }
    }
  }
};

export default eChallanPermissionManagement;
