import { getCommonHeader } from "egov-ui-framework/ui-config/screens/specs/utils";
import { getUserInfo, setapplicationType } from "egov-ui-kit/utils/localStorageUtils";
import get from "lodash/get";
import set from "lodash/set";
import React from "react";
import { clearlocalstorageAppDetails, getRequiredDocData } from "../utils";
let role_name = JSON.parse(getUserInfo()).roles[0].code
const header = getCommonHeader(
  {
    labelName: "Horticulture",
    labelKey: "ACTION_TEST_HC"
  },
  {
    classes: {
      root: "common-header-cont"
    }
  }
);
let cardItems = [];
if (role_name === 'CITIZEN' || role_name === "EE") {
  
  const cardlist = [
    {
      label: {
        labelName: "Service Request",
        labelKey: "HC_SERVICE_REQUEST_HEADER"
      },
      
      icon: <i
        viewBox="0 -8 35 42"
        color="primary"
        font-size="40px"
        class="material-icons module-page-icon" style={{ fontSize: "42px", height: "unset", width: "unset" }}>
        nature
    </i>,
      route: "servicerequest"

    },
    {
      label: {
        labelName: "My Service Request",
        labelKey: "HC_MY_SERVICE_REQUEST_HEADER"
      },
      
      icon: <i
        viewBox="0 -8 35 42"
        color="primary"
        font-size="40px"
        class="material-icons module-page-icon" style={{ fontSize: "42px", height: "unset", width: "unset" }}>
        library_books
    </i>,
      route: "myServiceRequests"
    },


  ];
  cardItems = cardlist;
}


const horticultureSearchAndResult = {
  uiFramework: "material-ui",
  name: "serviceRequestLanding",
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
        // listCard: {
        //   uiFramework: "custom-molecules-local",
        //   moduleName: "egov-hc",
        //   componentPath: "HowItWorks"
        // }
      }
    },
  
  }
};

export default horticultureSearchAndResult;
