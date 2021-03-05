import { handleScreenConfigurationFieldChange as handleField, toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getTenantId } from "egov-ui-kit/utils/localStorageUtils";
// import { toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import get from "lodash/get";
import set from "lodash/set";
import { getWNSData } from "../../../../../ui-utils/commons";

export const SearchDashboardData = async (state, dispatch) =>{

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
    "fromDate": def_fromDate,
    "toDate": def_toDate,
    "reportSortBy": reportSortBy
  }
    debugger;
    try {
      // API call for Description Report
      const response = await getWNSData( dispatch, requestBody );

    } catch (error) {

      dispatch(toggleSnackbar(true, error.message, "error"));
      console.log(error);
    }
  }
};