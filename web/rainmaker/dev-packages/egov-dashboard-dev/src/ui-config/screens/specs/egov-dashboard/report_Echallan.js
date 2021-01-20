import { getCommonHeader } from "egov-ui-framework/ui-config/screens/specs/utils";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getUserInfo, setapplicationType } from "egov-ui-kit/utils/localStorageUtils";
import get from "lodash/get";
import set from "lodash/set";
import React from "react";
import { clearlocalstorageAppDetails, getRequiredDocData } from "../utils";
import { handleScreenConfigurationFieldChange as handleField } from "egov-ui-framework/ui-redux/screen-configuration/actions";


const header = getCommonHeader(
    {
      labelName: "Horticulture",
      labelKey: "Report Module Echallan"
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
          labelName: "Report",
          labelKey: "Report Line Pie "
        },
        
        icon: <i
          viewBox="0 -8 35 42"
          color="primary"
          font-size="40px"
          class="material-icons module-page-icon" style={{ fontSize: "42px" }}>
          nature
      </i>,
        route: "report"
  
      },
      {
        label: {
          labelName: "Report",
          labelKey: "Report Line Bar "
        },
        
        icon: <i
          viewBox="0 -8 35 42"
          color="primary"
          font-size="40px"
          class="material-icons module-page-icon" style={{ fontSize: "42px" }}>
          nature
      </i>,
        route: "report_Line_Bar"
  
      },
      {
        label: {
          labelName: "Report",
          labelKey: "Report Bar Pie "
        },
        
        icon: <i
          viewBox="0 -8 35 42"
          color="primary"
          font-size="40px"
          class="material-icons module-page-icon" style={{ fontSize: "42px" }}>
          nature
      </i>,
        route: "report_Bar_Pie"
  
      },
      {
        label: {
          labelName: "Report",
          labelKey: "Report_Radar"
        },
        
        icon: <i
          viewBox="0 -8 35 42"
          color="primary"
          font-size="40px"
          class="material-icons module-page-icon" style={{ fontSize: "42px" }}>
          nature
      </i>,
        route: "report_Radar"
  
      }
    ];
    cardItems = cardlist;
  // }
  

const reportEchallan = {
    uiFramework: "material-ui",
    name: "report_Echallan",
    beforeInitScreen: (action, state, dispatch) => {
      
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

  export default reportEchallan;