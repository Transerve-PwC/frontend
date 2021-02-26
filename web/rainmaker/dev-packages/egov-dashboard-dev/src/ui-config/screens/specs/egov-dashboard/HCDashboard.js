
import { getBreak, getCommonHeader } from "egov-ui-framework/ui-config/screens/specs/utils";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getUserInfo, setapplicationType } from "egov-ui-kit/utils/localStorageUtils";
import { getDashboardDropdownData } from "../../../../ui-utils/commons";
import { HCDashboardFilterForm, HCDashboardResults } from "./HCDashboard/HCDashboard";
import { PGRDashboardResults } from "./searchResource/dashboardTypeSearchResults";
import { allDashboardSearchAPICall, SearchDashboardData } from "./searchResource/functions";
import './index.css';

let role_name = JSON.parse(getUserInfo()).roles[0].code

const header = getCommonHeader(
  {
    labelName: "HC Dashboard",
    labelKey: "Hc_dashboard_1"
  },
  {
    classes: {
      root: "common-header-cont"
    },
    style: {
      padding : "8px"
    },
  }
);

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
//   let data = getDashboardDropdownData(state, dispatch, status)
  var data =  [
  {
    "name" : "Service Request By Status",
    "code" : "service_request_status"
  },
  {
  "name" : "Service Request By Type",
  "code" : "service_type"
  },
  {
  "name" : "Service Request By Locality",
  "code" : "locality"
  },
  ]
  var selectedDefaultData = {value: "service_request_status", label: "Service Request By Status"};

  // Date default
  var fromDate = new Date();
  var formatDt = defaultDate(fromDate);

  dispatch(prepareFinalObject("HCdahsboardHome.dropDownData", data));
  dispatch(prepareFinalObject("HCdahsboardHome.dropDownData2", selectedDefaultData));
  dispatch(prepareFinalObject("HCdahsboardHome.defaultFromDate", formatDt));
  dispatch(prepareFinalObject("HCdahsboardHome.defaulttoDate", formatDt));
}

const HCDashboard = {
  uiFramework: "material-ui",
  name: "HCDashboard",
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
              ...header
            },
            
          }
        },
        HCDashboardFilterForm,
        breakAfterSearch: getBreak(),
        HCDashboardResults,
      }
    },
  }
};

export default HCDashboard;