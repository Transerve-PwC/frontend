
import { getCommonHeader } from "egov-ui-framework/ui-config/screens/specs/utils";
import { getUserInfo, setapplicationType } from "egov-ui-kit/utils/localStorageUtils";
import React from "react";
import { clearlocalstorageAppDetails, getRequiredDocData } from "../utils";


let role_name = JSON.parse(getUserInfo()).roles[0].code
const header = getCommonHeader(
  {
    labelName: "Report Module",
    labelKey: "WF_REPORT_MODULE_HEADER"
  },
  {
    classes: {
      root: "common-header-cont"
    }
  }
);
let cardItems = [];
// if (role_name === 'CITIZEN' || role_name === "EE") {
  
  const cardlist = [
    {
      label: {
        labelName: "WrokFlow Previewm",
        labelKey: "WORKFLOW_PREVIEW_TITLE"
      },
      
      icon: <i
          viewBox="0 -8 35 42"
          color="primary"
          font-size="40px"
          class="material-icons module-page-icon" style={{ fontSize: "40px" }}>
          wysiwyg
      </i>,
      route: "review"

    }
  ];
  cardItems = cardlist;
// }


const horticultureSearchAndResult = {
  uiFramework: "material-ui",
  name: "home",
  beforeInitScreen: (action, state, dispatch) => {
    clearlocalstorageAppDetails(state);
    return action;
  },
  components: {
    div: {
      uiFramework: "custom-atoms",
      componentPath: "Div",
      children: {
        header: header,
        applyCard: {
          uiFramework: "custom-molecules",
          componentPath: "LandingPage",
          props: {
            items: cardItems,
            history: {}
          }
        },
      }
    },
  
  }
};

export default horticultureSearchAndResult;