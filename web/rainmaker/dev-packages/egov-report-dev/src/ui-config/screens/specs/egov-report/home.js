
import { getCommonHeader } from "egov-ui-framework/ui-config/screens/specs/utils";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getUserInfo, setapplicationType } from "egov-ui-kit/utils/localStorageUtils";
import get from "lodash/get";
import set from "lodash/set";
import React from "react";
import { previewWF } from "../../../../ui-utils/commons";
import { clearlocalstorageAppDetails, getRequiredDocData } from "../utils";
import { handleScreenConfigurationFieldChange as handleField } from "egov-ui-framework/ui-redux/screen-configuration/actions";


let role_name = JSON.parse(getUserInfo()).roles[0].code
const header = getCommonHeader(
  {
    labelName: "Horticulture",
    labelKey: "Report Module"
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
        labelName: "WrokFlow",
        labelKey: "WorkFlow_Preview"
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
    // setapplicationType('HORTICULTURE');

    // const data = {
    //   "graphData" : [
    //       {
    //           "month" : "Jan",
    //           "raisedComplaints" : 10,
    //           "categoryComplaints" : [10,20,30]
    //       },
    //       {
    //           "month" : "Feb",
    //           "raisedComplaints" : 20,
    //           "categoryComplaints" : [10,20,30]
    //       },
    //       {
    //           "month" : "Mar",
    //           "raisedComplaints" : 30,
    //           "categoryComplaints" : [10,20,30]
    //       },
    //       {
    //         "month" : "April",
    //         "raisedComplaints" : 50,
    //         "categoryComplaints" : [80,20,35]
    //     },
    //       ],
    //   "category" : ["PR", "HC", "TL"]
    // }
    // dispatch(prepareFinalObject("graphData", data));
     
    let response = previewWF(state, dispatch, status);
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