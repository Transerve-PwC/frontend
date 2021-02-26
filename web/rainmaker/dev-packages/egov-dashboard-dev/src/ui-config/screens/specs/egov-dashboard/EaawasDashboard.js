
import { getBreak, getCommonHeader } from "egov-ui-framework/ui-config/screens/specs/utils";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getUserInfo, setapplicationType } from "egov-ui-kit/utils/localStorageUtils";
import { getDashboardDropdownData } from "../../../../ui-utils/commons";
import { handleScreenConfigurationFieldChange as handleField, toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getTenantId } from "egov-ui-kit/utils/localStorageUtils";
// import { toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import get from "lodash/get";

// import { HCDashboardFilterForm, HCDashboardResults } from "./HCDashboard/HCDashboard";
// import { FilterForm, DashboardResults } from "./TradeLicenseDashboard/TradeLicenseDashboard";
// import { getTradeLicenseData, getTradeEaawasData } from "../../../../../ui-utils/commons";
import { getEaawasData } from '../../../../ui-utils/commons'
import './index.css';

let role_name = JSON.parse(getUserInfo()).roles[0].code

const header = getCommonHeader(
  {
    labelName: "Eaawas Dashboard",
    labelKey: "Eaawas_dashboard_1"
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



const SearchDashboardData = async (state, dispatch) =>{

    //debugger;
    var flag_for_api_call = true
    let queryObject = [
      {
        key: "tenantId",
        value: getTenantId()
      },
      { key: "offset", value: "0" }
    ];
    let dashboardFilterDAta = get(
      state.screenConfiguration.preparedFinalObject,
      "dahsboardHome",
      {}
    );
    
    var def_fromDate = dashboardFilterDAta["defaultFromDate"];
    var def_toDate = dashboardFilterDAta["defaulttoDate"];
    var dateFromObject = new Date(dashboardFilterDAta["defaultFromDate"]);
    var dateToObject = new Date(dashboardFilterDAta["defaulttoDate"]);
    var fromDateNumeric = dateFromObject.getTime()  ? dateFromObject.getTime() : null;
    var toDateNumeric = dateToObject.getTime() ? dateToObject.getTime() : null;
    var reportSortBy = get(state.screenConfiguration.preparedFinalObject,"dahsboardHome.dropDownData2",{});
    // var reportName = get(state.screenConfiguration.preparedFinalObject,"dahsboardHome.reportdefaultDropDownData",{});
  
    // Validation For api call
    if(fromDateNumeric === null || toDateNumeric === null || reportSortBy.value === undefined ){
      dispatch(
        toggleSnackbar(
          true,
          { labelName: "ERROR", labelKey: "DASHBOARD_FILTER_FORM_ERROR_MSG" },
          "warning"
        )
      );
    }
    else{ 
  
    var data = {
      "tenantId" : getTenantId(),
      "fromDate":fromDateNumeric,
      "toDate": toDateNumeric,
      "reportSortBy": reportSortBy
      
    }
    let requestBody = {
      "tenantId": getTenantId(),
      "fromDate": fromDateNumeric,
      "toDate": toDateNumeric,
      "reportSortBy": reportSortBy
    }
      debugger;
      try {
        // API call for Description Report
        const response = await getEaawasData( dispatch, requestBody );
  
      } catch (error) {
  
        dispatch(toggleSnackbar(true, error.message, "error"));
        console.log(error);
      }
    }
  };

const getDropDownData = async (action, state, dispatch) => {

  debugger
//   let data = getDashboardDropdownData(state, dispatch, status)
  var data =  [
    {
    "name" : "Application Type",
    "code" : "applicationType"
    },
    {
      "name" : "Application Status",
      "code" : "status"
    }
  ]
  var selectedDefaultData = {value: "applicationType", label: "Application Type"};

  // Date default
  var fromDate = new Date();
  var formatDt = defaultDate(fromDate);

  dispatch(prepareFinalObject("dahsboardHome.dropDownData", data));
  dispatch(prepareFinalObject("dahsboardHome.dropDownData2", selectedDefaultData));
  dispatch(prepareFinalObject("dahsboardHome.defaultFromDate", formatDt));
  dispatch(prepareFinalObject("dahsboardHome.defaulttoDate", formatDt));
}

const DashboardResults = {
    uiFramework: "custom-molecules-local",
    moduleName: "egov-dashboard",
    componentPath: "DashboardEaawas",
    props: {
    // className: "dashboard-graph",
    formKey: `newapplication`,
    data : []
    },
    style: {
    },
    visible: true,
  }


const EaawasDashboard = {
  uiFramework: "material-ui",
  name: "EaawasDashboard",
  beforeInitScreen: (action, state, dispatch) => {
    
    debugger
    getDropDownData(action, state, dispatch);

    SearchDashboardData(state, dispatch);

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
        // FilterForm,
        breakAfterSearch: getBreak(),
        DashboardResults
      }
    },
  }
};

export default EaawasDashboard;