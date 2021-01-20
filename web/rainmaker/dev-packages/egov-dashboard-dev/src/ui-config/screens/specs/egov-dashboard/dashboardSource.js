
import { getBreak, getCommonHeader } from "egov-ui-framework/ui-config/screens/specs/utils";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getUserInfo, setapplicationType } from "egov-ui-kit/utils/localStorageUtils";
import get from "lodash/get";
import set from "lodash/set";
import React from "react";
import { getDashboardDropdownData } from "../../../../ui-utils/commons";
import { clearlocalstorageAppDetails, getRequiredDocData } from "../utils";
import { dashboardSourceFilterForm } from "./searchResource/dashboardSourceFilterForm";
import { dashboardSourceSearchResults } from "./searchResource/dashboardSourceSearchResults";
import { handleScreenConfigurationFieldChange as handleField } from "egov-ui-framework/ui-redux/screen-configuration/actions";


let role_name = JSON.parse(getUserInfo()).roles[0].code

const header = getCommonHeader(
  {
    labelName: "",
    labelKey: "Complaint Source"
  },
  {
    classes: {
      root: "common-header-cont"
    }
  }
);
// let cardItems = [];
// // if (role_name === 'CITIZEN' || role_name === "EE") {
  
//   const cardlist = [
//     {
//       label: {
//         labelName: "",
//         labelKey: "PGR"
//       },
      
//       icon: <i
//           viewBox="0 -8 35 42"
//           color="primary"
//           font-size="40px"
//           class="material-icons module-page-icon" style={{ fontSize: "40px" }}>
//           wysiwyg
//       </i>,
//       route: "pgrDashboardReport"

//     },
//     {
//       label: {
//         labelName: "",
//         labelKey: "E-Challan"
//       },
      
//       icon: <i
//           viewBox="0 -8 35 42"
//           color="primary"
//           font-size="40px"
//           class="material-icons module-page-icon" style={{ fontSize: "40px" }}>
//           wysiwyg
//       </i>,
//       route: "pgrDashboardReport"

//     }
//   ];
//   cardItems = cardlist;
// // }


// const horticultureSearchAndResult = {
//   uiFramework: "material-ui",
//   name: "home",
//   beforeInitScreen: (action, state, dispatch) => {
//     clearlocalstorageAppDetails(state);     
//     let response = previewWF(state, dispatch, status);
//     return action;
//   },
//   components: {
//     div: {
//       uiFramework: "custom-atoms",
//       componentPath: "Div",
//       children: {
//         header: header,
//         applyCard: {
//           uiFramework: "custom-molecules",
//           componentPath: "LandingPage",
//           props: {
//             items: cardItems,
//             history: {}
//           }
//         },
//       }
//     },
  
//   }
// };

const defaultDate = (date) => {
  var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

  if (month.length < 2) 
      month = '0' + month;
  if (day.length < 2) 
      day = '0' + day;

  return [year, month, day].join('-');
}

const getDropDownData = async (action, state, dispatch) => {

  debugger
  let data = getDashboardDropdownData(state, dispatch, status)

  // Date default
  var fromDate = new Date()
  var formatDt = defaultDate(fromDate)
  dispatch(prepareFinalObject("dahsboardHome.defaultFromDate", formatDt));
  dispatch(prepareFinalObject("dahsboardHome.defaulttoDate", formatDt));
}

const DashboardSource = {
  uiFramework: "material-ui",
  name: "dashboardSource",
  beforeInitScreen: (action, state, dispatch) => {
    
    debugger
    getDropDownData(action, state, dispatch);
    
    return action;
  },
  components: {
    div: {
      uiFramework: "custom-atoms",
      componentPath: "Form",
      props: {
        className: "common-div-css",
        id: "dashboardReportFilter"
      },
      children: {
        headerDiv: {
          uiFramework: "custom-atoms",
          componentPath: "Container",

          children: {
            header: {
              // gridDefination: {
              //   xs: 12,
              //   sm: 6
              // },
              ...header
            },
            
          }
        },
        dashboardSourceFilterForm,
        breakAfterSearch: getBreak(),
        dashboardSourceSearchResults
      }
    },
      }
};

export default DashboardSource;