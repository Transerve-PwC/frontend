import { handleScreenConfigurationFieldChange as handleField, toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getTenantId } from "egov-ui-kit/utils/localStorageUtils";
import get from "lodash/get";
import { getDashboardResult , returnNameFromCodeMdmsorViceVersa} from "../../../../../ui-utils/commons";
import { getTextToLocalMapping, validateFields } from "../../utils";



const showHideTable = (booleanHideOrShow, dispatch) => {
// alert("inside showhidetable", booleanHideOrShow)
dispatch(
  handleField(
    "search",
    "components.div.children.searchResults",
    "visible",
    booleanHideOrShow
  )
);
};




export const searchAPICall = async (state, dispatch) =>{
  debugger
  var flag_for_api_call = true

  showHideTable(false, dispatch);
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

    const response = await getDashboardResult( dispatch, payload );

  } catch (error) {

    dispatch(toggleSnackbar(true, error.message, "error"));
    console.log(error);
  }
};


