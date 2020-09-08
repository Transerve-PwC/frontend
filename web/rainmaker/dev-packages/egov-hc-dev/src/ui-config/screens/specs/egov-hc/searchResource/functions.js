import { handleScreenConfigurationFieldChange as handleField, toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getTenantId } from "egov-ui-kit/utils/localStorageUtils";
import get from "lodash/get";
import { getSearchResultsEmployeeRequestFilter } from "../../../../../ui-utils/commons";
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

export const searchApiCallForEmployeeFilter = async (state, dispatch) =>{
  var flag_for_api_call = true

  showHideTable(false, dispatch);
  let queryObject = [
    {
      key: "tenantId",
      value: getTenantId()
    },
    { key: "offset", value: "0" }
  ];
  let serviceRequestsObject = get(
    state.screenConfiguration.preparedFinalObject,
    "serviceRequests",
    {}
  );
  
  const isSearchBoxFirstRowValid = validateFields(
    // components.div.children.ServiceRequestFilterFormForEmployee.children.cardContent.children.StatusLocalityAndFromToDateContainer.children.ServiceRequestStatus
    "components.div.children.ServiceRequestFilterFormForEmployee.children.cardContent.children.serviceRequestidContactNoAndRequestTypeContainer.children",
    state,
    dispatch,
    "search"
  );

  const isSearchBoxSecondRowValid = validateFields(
    "components.div.children.ServiceRequestFilterFormForEmployee.children.cardContent.children.StatusLocalityAndFromToDateContainer.children",
    state,
    dispatch,
    "search"
  );
  var dateFromObject = new Date(serviceRequestsObject["fromDate"]);
  var dateToObject = new Date(serviceRequestsObject["toDate"]);
  var fromDateNumeric = dateFromObject.getTime() 
  var toDateNumeric = dateToObject.getTime()
  
  
  if (!(isSearchBoxFirstRowValid && isSearchBoxSecondRowValid)) {
    flag_for_api_call = false
    dispatch(
      toggleSnackbar(
        true,
        {
          labelName: "Please fill valid fields to start search",
          labelKey: "ERR_FILL_VALID_FIELDS"
        },
        "warning"
      )
    );
  } 
  else if (
    
    Object.keys(serviceRequestsObject).length == 0 ||
    Object.values(serviceRequestsObject).every(x => x === "")
  ) {
    flag_for_api_call = false
    dispatch(
      toggleSnackbar(
        true,
        {
          labelName: "Please fill at least one field to start search",
          labelKey: "ERR_FILL_ONE_FIELDS"
        },
        "warning"
      )
    );
  } 
  else if (
    (parseInt(fromDateNumeric) > parseInt(toDateNumeric)) 
  ) {
    flag_for_api_call = false
    dispatch(
      toggleSnackbar(
        true,
        { labelName: "To date Should be Less than from Date", labelKey: "ERR_FROM_DATE_SHOULD_BE_LESS_THAN_TO_DATE" },
        "warning"
      )
    );
  } 
  else if (
    (serviceRequestsObject["fromDate"] === undefined ||
    serviceRequestsObject["fromDate"].length === 0) &&
    serviceRequestsObject["toDate"] !== undefined &&
    serviceRequestsObject["toDate"].length !== 0
  ) {
    flag_for_api_call = false
    dispatch(
      toggleSnackbar(
        true,
        { labelName: "Please fill From Date", labelKey: "ERR_FILL_FROM_DATE" },
        "warning"
      )
    );
  } 
 

  

  else if (
    (serviceRequestsObject["toDate"] === undefined ||
    serviceRequestsObject["toDate"].length === 0) &&
    serviceRequestsObject["fromDate"] !== undefined &&
    serviceRequestsObject["fromDate"].length !== 0
  ) {
    flag_for_api_call = false
    dispatch(
      toggleSnackbar(
        true,
        { labelName: "Please fill To Date", labelKey: "ERR_FILL_TO_DATE" },
        "warning"
      )
    );
  }
  
  else {
    if(flag_for_api_call = true){
          
    let fromDate= get(state.screenConfiguration.preparedFinalObject,"serviceRequests.fromDate")
    let toDate= get(state.screenConfiguration.preparedFinalObject,"serviceRequests.toDate")
    let servicerequestid = get(state.screenConfiguration.preparedFinalObject, "serviceRequests.servicerequestid")
    let servicetype = get(state.screenConfiguration.preparedFinalObject, "serviceRequests.servicetype.label")
    let servicestatus = get(state.screenConfiguration.preparedFinalObject, "serviceRequests.servicestatus.label")
    let mohalla = get(state.screenConfiguration.preparedFinalObject, "serviceRequests.mohalla.label")
    let contactNumber = get(state.screenConfiguration.preparedFinalObject, "serviceRequests.contactNumber")
    var dateFromObject = new Date(fromDate);
    var dateToObject = new Date(toDate);
    let fromDateNumeric = dateFromObject.getTime() 
    let toDateNumeric = dateToObject.getTime()
    var oneDayDifference = 60 * 60 * 24 * 1000
    toDateNumeric = toDateNumeric+oneDayDifference
    // if (fromDateNumeric === toDateNumeric){
    //   toDateNumeric = toDateNumeric + oneDayDifference
    // }
      var data = 
        {"fromDate":fromDateNumeric,
        "toDate": toDateNumeric,
        "service_request_id":servicerequestid,
        "serviceType":servicetype,
        "serviceRequestStatus":servicestatus,
        "houseNoAndStreetName":mohalla,
        "ownerContactNumber":contactNumber}
    
    // debugger
    const response = await getSearchResultsEmployeeRequestFilter(data);

    // dispatch(
    //   handleField(
    //     "employeeServiceRequestsFilter",
    //     "components.div.children.searchResultsServiceRequest",
    //     "visible",
    //     true
    //   )
    // );

    try {
      if (response.services.length >0 ){
      let data_response = response.services.map(item => ({
        [getTextToLocalMapping("Service Request Id")]:
          item.service_request_id || "-",
        [getTextToLocalMapping("Service Request Date")]: item.createdtime || "-",
        [getTextToLocalMapping("Type Of Service Request")]: item.service_type || "-",
        [getTextToLocalMapping("Name Of Owner")]:item.owner_name || "-",
        [getTextToLocalMapping("Service Request Status")]: item.service_request_status || "-",       
      }));
    
    // console.log("data",data)
    // dispatch(
    //   handleField(
    //     "employeeServiceRequestsFilter",
    //     "screenConfiguration.screenConfig.employeeServiceRequestsFilter.components.div.children.ServiceRequestFilterFormForEmployee.children.cardContent.children.StatusLocalityAndFromToDateContainer.children.ServiceRequestStatus",
    //     "props.value",
    //     servicestatus
    //   )
    // );
      dispatch(
        handleField(
          "employeeServiceRequestsFilter",
          "components.div.children.searchResultsServiceRequest",
          "props.data",
          data_response
        )
      );

      dispatch(
        handleField(
          "employeeServiceRequestsFilter",
          "components.div.children.searchResultsServiceRequest",
          "visible",
          true
        )
      );
        }
        else {
          var data_empty= []
          dispatch(
            handleField(
              "employeeServiceRequestsFilter",
              "components.div.children.searchResultsServiceRequest",
              "props.data",
              data_empty
            )
          );

          dispatch(
            handleField(
              "employeeServiceRequestsFilter",
              "components.div.children.searchResultsServiceRequest",
              "visible",
              true
            )
          );

        //   dispatch(
        //     toggleSnackbar(
        //       true,
        //       { labelName: "No Records Found", labelKey: "ERR_NO_RECORDS_FOUND" },
        //       "warning"
        //     )
        //   );
        }

      showHideTable(true, dispatch);
    } catch (error) {

      dispatch(toggleSnackbar(true, error.message, "error"));
      console.log(error);
    }
  }}};


