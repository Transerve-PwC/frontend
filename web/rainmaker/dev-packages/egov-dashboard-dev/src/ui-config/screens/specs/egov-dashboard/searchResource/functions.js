import { handleScreenConfigurationFieldChange as handleField, toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getTenantId } from "egov-ui-kit/utils/localStorageUtils";
// import { toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import get from "lodash/get";
import set from "lodash/set";
import { getAllDashboardResult, getDescriptionReport, getDescriptionReportDashboard } from "../../../../../ui-utils/commons";

export const searchAPICall = async (state, dispatch) =>{
  // debugger
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
  
  var dateFromObject = new Date(dashboardFilterDAta["defaultFromDate"]);
  var dateToObject = new Date(dashboardFilterDAta["defaulttoDate"]);
  var fromDateNumeric = dateFromObject.getTime() 
  var toDateNumeric = dateToObject.getTime()
  var moduleName = get(state.screenConfiguration.preparedFinalObject,"dahsboardHome.dropDownData2",{});
  var reportName = get(state.screenConfiguration.preparedFinalObject,"dahsboardHome.reportdefaultDropDownData",{});

  var data = {"fromDate":fromDateNumeric,
  "toDate": toDateNumeric,
  "moduleName": moduleName,
  "reportName": reportName 
  }

  const payload = {
    "tenantId": getTenantId(),
    "moduleName": moduleName.value, // module name 
    "reportName": reportName.value, // report name 
    "searchParams": [
      {
        "name": "fromDate",
        "input": fromDateNumeric
      },
      {
        "name": "toDate",
        "input": toDateNumeric
      }
    ]
  }

  // debugger
  try {

    const response = await getAllDashboardResult( dispatch, payload );

  } catch (error) {

    dispatch(toggleSnackbar(true, error.message, "error"));
    console.log(error);
  }
};

// Dashboard 2 Reset Fields
export const resetFields = (state, dispatch) => {

  // Clear Dropdown
  dispatch(
    handleField(
      "dashboardSource",
      "components.div.children.FilterFormforEmployee.children.cardContent.children.FilterConstraintsContainer.children.moduleDashboardDropdown",
      "props.value",
      ""
    )
  );

  dispatch(
    handleField(
      "dashboardSource",
      "components.div.children.FilterFormforEmployee.children.cardContent.children.FilterConstraintsContainer.children.reportDashboardDropdown",
      "props.value",
      ""
    )
  );

  // Clear Date Field
  dispatch(
    handleField(
      "dashboardSource",
      "components.div.children.FilterFormforEmployee.children.cardContent.children.FilterConstraintsContainer.children.fromDate",
      "props.value",
      ""
    )
  );

  dispatch(
    handleField(
      "dashboardSource",
      "components.div.children.FilterFormforEmployee.children.cardContent.children.FilterConstraintsContainer.children.toDate",
      "props.value",
      ""
    )
  );

  set(state, "screenConfiguration.preparedFinalObject.dahsboardHome.dropDownData2", {});
  set(state, "screenConfiguration.preparedFinalObject.dahsboardHome.reportdefaultDropDownData", {});
  set(state, "screenConfiguration.preparedFinalObject.dahsboardHome.defaultFromDate", {});
  set(state, "screenConfiguration.preparedFinalObject.dahsboardHome.defaulttoDate", {});
};

// Dashboard 1 Reset Fields
export const dashboard1ResetFields = (state, dispatch) => {

  // Clear Dropdown
  dispatch(
    handleField(
      "dashboardType",
      "components.div.children.FilterFormforEmployee.children.cardContent.children.FilterConstraintsContainer.children.moduleDashboardDropdown",
      "props.value",
      ""
    )
  );

  dispatch(
    handleField(
      "dashboardType",
      "components.div.children.FilterFormforEmployee.children.cardContent.children.FilterConstraintsContainer.children.reportDashboardDropdown",
      "props.value",
      ""
    )
  );

  // Clear Date Field
  dispatch(
    handleField(
      "dashboardType",
      "components.div.children.FilterFormforEmployee.children.cardContent.children.FilterConstraintsContainer.children.fromDate",
      "props.value",
      ""
    )
  );

  dispatch(
    handleField(
      "dashboardType",
      "components.div.children.FilterFormforEmployee.children.cardContent.children.FilterConstraintsContainer.children.toDate",
      "props.value",
      ""
    )
  );

  set(state, "screenConfiguration.preparedFinalObject.dahsboardHome.dropDownData2", {});
  set(state, "screenConfiguration.preparedFinalObject.dahsboardHome.reportdefaultDropDownData", {});
  set(state, "screenConfiguration.preparedFinalObject.dahsboardHome.defaultFromDate", {});
  set(state, "screenConfiguration.preparedFinalObject.dahsboardHome.defaulttoDate", {});
};

// Dashboard 1 Reset Fields
export const pgrDashboard1ResetFields = (state, dispatch) => {

  // Clear Dropdown
  dispatch(
    handleField(
      "PGRDashboard",
      "components.div.children.FilterFormDashboard.children.cardContent.children.FilterConstraintsContainer.children.moduleDashboardDropdown",
      "props.value",
      ""
    )
  );

  // Clear Date Field
  // From Date
  dispatch(
    handleField(
      "PGRDashboard",
      "components.div.children.FilterFormDashboard.children.cardContent.children.FilterConstraintsContainer.children.fromDate",
      "props.value",
      ""
    )
  );

  dispatch(
    handleField(
      "PGRDashboard",
      "components.div.children.FilterFormDashboard.children.cardContent.children.FilterConstraintsContainer.children.fromDate",
      "props.value",
      ""
    )
  );

  // dispatch(
  //   handleField(
  //     "PGRDashboard",
  //     "components.div.children.FilterFormDashboard.children.cardContent.children.FilterConstraintsContainer.children.fromDate",
  //     "props.inputProps.min",
  //     ""
  //   )
  // );

  //To Date
  dispatch(
    handleField(
      "PGRDashboard",
      "components.div.children.FilterFormDashboard.children.cardContent.children.FilterConstraintsContainer.children.toDate",
      "props.value",
      ""
    )
  );

  dispatch(
    handleField(
      "PGRDashboard",
      "components.div.children.FilterFormDashboard.children.cardContent.children.FilterConstraintsContainer.children.toDate",
      "props.value",
      ""
    )
  );

  // dispatch(
  //   handleField(
  //     "PGRDashboard",
  //     "components.div.children.FilterFormDashboard.children.cardContent.children.FilterConstraintsContainer.children.toDate",
  //     "props.inputProps.min",
  //     ""
  //   )
  // );

  set(state, "screenConfiguration.preparedFinalObject.dahsboardHome.dropDownData2", {});
  // set(state, "screenConfiguration.preparedFinalObject.dahsboardHome.reportdefaultDropDownData", {});
  set(state, "screenConfiguration.preparedFinalObject.dahsboardHome.defaultFromDate", {});
  set(state, "screenConfiguration.preparedFinalObject.dahsboardHome.defaulttoDate", {});
};

export const allDashboardSearchAPICall = async (state, dispatch) =>{
  debugger
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
  
  var dateFromObject = new Date(dashboardFilterDAta["defaultFromDate"]);
  var dateToObject = new Date(dashboardFilterDAta["defaulttoDate"]);
  var fromDateNumeric = dateFromObject.getTime() 
  var toDateNumeric = dateToObject.getTime()
  var moduleName = get(state.screenConfiguration.preparedFinalObject,"dahsboardHome.dropDownData2",{});
  var reportName = get(state.screenConfiguration.preparedFinalObject,"dahsboardHome.reportdefaultDropDownData",{});

  var data = {"fromDate":fromDateNumeric,
  "toDate": toDateNumeric,
  "moduleName": moduleName,
  "reportName": reportName 
  }

  const payload = {
    "tenantId": getTenantId(),
    "moduleName": moduleName.value, // module name 
    "reportName": reportName.value, // report name 
    "searchParams": [
      {
        "name": "fromDate",
        "input": fromDateNumeric
      },
      {
        "name": "toDate",
        "input": toDateNumeric
      }
    ]
  }

  // debugger
  try {

    const response = await getAllDashboardResult( dispatch, payload );

  } catch (error) {

    dispatch(toggleSnackbar(true, error.message, "error"));
    console.log(error);
  }
};

// Search Dashboard Data
export const SearchDashboardData = async (state, dispatch) =>{
  // debugger
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
  
  var dateFromObject = new Date(dashboardFilterDAta["defaultFromDate"]);
  var dateToObject = new Date(dashboardFilterDAta["defaulttoDate"]);
  var fromDateNumeric = dateFromObject.getTime() 
  var toDateNumeric = dateToObject.getTime()
  var moduleName = get(state.screenConfiguration.preparedFinalObject,"dahsboardHome.dropDownData2",{});
  var reportName = get(state.screenConfiguration.preparedFinalObject,"dahsboardHome.reportdefaultDropDownData",{});

  var data = {"fromDate":fromDateNumeric,
  "toDate": toDateNumeric,
  "moduleName": moduleName,
  "reportName": reportName 
  }

  const payload = {
    "tenantId": getTenantId(),
    "moduleName": moduleName.value, // module name 
    "reportName": reportName.value, // report name 
    "searchParams": [
      {
        "name": "fromDate",
        "input": fromDateNumeric
      },
      {
        "name": "toDate",
        "input": toDateNumeric
      }
    ]
  }

  // debugger
  try {
    // API call for Description Report
    const response = await getDescriptionReport( dispatch, payload );

  } catch (error) {

    dispatch(toggleSnackbar(true, error.message, "error"));
    console.log(error);
  }
};

export const SearchPGRDashboardData = async (state, dispatch) =>{
  
  debugger
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

  var data = {"fromDate":fromDateNumeric,
  "toDate": toDateNumeric,
  "reportSortBy": reportSortBy
  }

  const payload = {
    "tenantId": getTenantId(),
    "reportSortBy": reportSortBy,
    // "moduleName": moduleName.value, // module name 
    // "reportName": reportName.value, // report name 
    "searchParams": [
      {
        "name": "fromDate",
        "input": fromDateNumeric
      },
      {
        "name": "toDate",
        "input": toDateNumeric
      }
    ]
  }

    // debugger
    try {
      // API call for Description Report
      const response = await getDescriptionReportDashboard( dispatch, payload );

    } catch (error) {

      dispatch(toggleSnackbar(true, error.message, "error"));
      console.log(error);
    }
  }
};

