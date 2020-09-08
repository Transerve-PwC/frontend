import { handleScreenConfigurationFieldChange as handleField, toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getTenantId, getapplicationType } from "egov-ui-kit/utils/localStorageUtils";
import get from "lodash/get";
import { getSearchResultsEmployeeRequestFilter, getGridDataAdvertisement1, getGridDataForSearchFilter } from "../../../../../ui-utils/commons";
import { getTextToLocalMapping, validateFields } from "../../utils";
import { showHideTableADV, showHideTableRoadCut, getTextAdvertisement, getTextForRoadCuttNoc, showHideTableSellmeat, showHideTable, getTextForSellMeatNoc, getTextForPetNoc } from '../searchResource/citizenSearchFunctions'
import { getPageName } from "./EmployeeSearchForm";



export const searchApiCallForEmployeeFilter = async (state, dispatch) => {
  var flag_for_api_call = true
  let queryObject = [
    {
      key: "tenantId",
      value: getTenantId()
    }
  ];
  let serviceRequestsObject = get(
    state.screenConfiguration.preparedFinalObject,
    "OPMS.searchFilter",
    {}
  );


  const isSearchBoxSecondRowValid = validateFields(
    "components.div.children.SearchFormForEmployee.children.cardContent.children.StatusLocalityAndFromToDateContainer.children",
    state,
    dispatch,
    getPageName()
  );
  var dateFromObject = new Date(serviceRequestsObject["fromDate"]);
  var dateToObject = new Date(serviceRequestsObject["toDate"]);
  var fromDateNumeric = dateFromObject.getTime()
  var toDateNumeric = dateToObject.getTime()


  if (!isSearchBoxSecondRowValid) {
    flag_for_api_call = false
    dispatch(
      toggleSnackbar(
        true,
        {
          labelName: "Please fill valid fields to start search",
          labelKey: "PM_SEARCH_ERR_FILL_VALID_FIELDS"
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
          labelKey: "PM_SEARCH_ONE_FIELDS"
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
    if (flag_for_api_call = true) {

      let fromDate = get(state.screenConfiguration.preparedFinalObject, "OPMS.searchFilter.fromDate")
      let toDate = get(state.screenConfiguration.preparedFinalObject, "OPMS.searchFilter.toDate")
      let servicerequestid = get(state.screenConfiguration.preparedFinalObject, "OPMS.searchFilter.applicationId")
      let servicestatus = get(state.screenConfiguration.preparedFinalObject, "OPMS.searchFilter.applicationStatus")
      var dateFromObject = new Date(fromDate);
      var dateToObject = new Date(toDate);
      let fromDateNumeric = dateFromObject.getTime()
      let toDateNumeric = dateToObject.getTime()
      var oneDayDifference = 60 * 60 * 24 * 1000
      toDateNumeric = toDateNumeric + oneDayDifference
      // if (fromDateNumeric === toDateNumeric){
      //   toDateNumeric = toDateNumeric + oneDayDifference
      // }
      var data =
      {
        "fromDate": fromDateNumeric,
        "toDate": toDateNumeric,
        "applicationId": servicerequestid != "" ? servicerequestid : null,
        "applicationStatus": servicestatus ? servicestatus.value : null,
      }


      const response = await getGridDataForSearchFilter(data);


      try {
        if (response && response.nocApplicationDetail && response.nocApplicationDetail.length > 0) {
          setGridData(response, dispatch)
        }
        else {
          var data_empty = []
          dispatch(
            handleField(
              "employeeServiceRequestsFilter",
              "components.div.children.searchResultsServiceRequest",
              "props.data",
              data_empty
            )
          );

          dispatch(
            toggleSnackbar(
              true,
              { labelName: "No Records Found", labelKey: "PM_SEARCH_ERR_NO_RECORDS_FOUND" },
              "warning"
            )
          );
        }

      } catch (error) {

        dispatch(toggleSnackbar(true, error.message, "error"));
        console.log(error);
      }
    }
  }
};

const setGridData = (response, dispatch) => {
  switch (getapplicationType()) {
    case "ADVERTISEMENTNOC":
      let data = response.nocApplicationDetail.map(item => ({
        [getTextToLocalMapping("Application No")]:
          item.applicationId || "-",
        [getTextToLocalMapping("Application Status")]: getTextAdvertisement(item.applicationStatus, "0") || "-",
        [getTextToLocalMapping("Applicant Name")]:
          item.applicantName || "-",
      }));

      dispatch(
        handleField(
          getPageName(),
          "components.div.children.searchResultsAdvertisement",
          "props.data",
          data
        )
      );

      showHideTableADV(true, dispatch);
      break;
    case "ROADCUTNOC":
      let roadcutdata = response.nocApplicationDetail.map(item => ({
        // alert(item)
        [getTextToLocalMapping("Application No")]:
          item.applicationId || "-",
        [getTextToLocalMapping("Application Status")]: getTextForRoadCuttNoc(item.applicationStatus) || "-",
        [getTextToLocalMapping("Applicant Name")]:
          item.applicantName || "-",


      }));
      dispatch(
        handleField(
          "roadcut-search",
          "components.div.children.searchResultsRoadcut",
          "props.data",
          roadcutdata
        )
      );

      showHideTableRoadCut(true, dispatch);
      break;
    case "SELLMEATNOC":
      let sellmeatdata = response.nocApplicationDetail.map(item => ({
        [getTextToLocalMapping("Application No")]:
          item.applicationId || "-",
        [getTextToLocalMapping("Application Status")]: getTextForSellMeatNoc(item.applicationStatus) || "-",
        [getTextToLocalMapping("Applicant Name")]:
          item.applicantName || "-",
      }));

      dispatch(
        handleField(
          "sellmeat-search",
          "components.div.children.searchResultsSellmeat",
          "props.data",
          sellmeatdata
        )
      );
      showHideTableSellmeat(true, dispatch);
      break;
    case "PETNOC":
      let petnocdata = response.nocApplicationDetail.map(item => ({
        [getTextToLocalMapping("Application No")]:
          item.applicationId || "-",
        [getTextToLocalMapping("Application Status")]: getTextForPetNoc(item.applicationStatus) || "-",
        [getTextToLocalMapping("Applicant Name")]:
          item.applicantName || "-",
      }));

      dispatch(
        handleField(
          "search",
          "components.div.children.searchResults",
          "props.data",
          petnocdata
        )
      );
      showHideTable(true, dispatch);
      break;

  }
}

