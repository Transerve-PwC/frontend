
import { getBreak, getCommonHeader } from "egov-ui-framework/ui-config/screens/specs/utils";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getUserInfo, setapplicationType } from "egov-ui-kit/utils/localStorageUtils";
import { getDashboardDropdownData } from "../../../../ui-utils/commons";
import { FilterFormDashboard } from "./searchResource/FilterFormaforEmployee";
import { PGRDashboardResults } from "./searchResource/dashboardTypeSearchResults";
import { allDashboardSearchAPICall, SearchDashboardData } from "../egov-dashboard/searchResource/functions";

let role_name = JSON.parse(getUserInfo()).roles[0].code

const header = getCommonHeader(
  {
    labelName: "PGR Dashboard",
    labelKey: "Pgr_dashboard_1"
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
    "name" : "Complaint By Status",
    "code" : "status"
  },
  {
  "name" : "Complaint By Source",
  "code" : "source"
  },
  {
  "name" : "Complaint By Department",
  "code" : "department"
  },
  ]
  var selectedDefaultData = {value: "status", label: "Complaint By Status"};

  // Date default
  var fromDate = new Date();
  var formatDt = defaultDate(fromDate);

  dispatch(prepareFinalObject("dahsboardHome.dropDownData", data));
  dispatch(prepareFinalObject("dahsboardHome.dropDownData2", selectedDefaultData));
  dispatch(prepareFinalObject("dahsboardHome.defaultFromDate", formatDt));
  dispatch(prepareFinalObject("dahsboardHome.defaulttoDate", formatDt));
}

const PGRDashboard = {
  uiFramework: "material-ui",
  name: "PGRDashboard",
  beforeInitScreen: (action, state, dispatch) => {
    
    debugger
    getDropDownData(action, state, dispatch);
    // SearchDashboardData(state, dispatch);
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
        // FilterFormforEmployee,
        FilterFormDashboard,
        breakAfterSearch: getBreak(),
        PGRDashboardResults,
      }
    },
  }
};

export default PGRDashboard;