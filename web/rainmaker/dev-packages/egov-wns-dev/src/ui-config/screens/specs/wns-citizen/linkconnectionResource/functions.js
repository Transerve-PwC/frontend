import get from "lodash/get";
import find from "lodash/find";
import {
  handleScreenConfigurationFieldChange as handleField,
  toggleSnackbar,
  prepareFinalObject
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { fetchBill, findAndReplace, getSearchResults,getSearchResultsForSewerage } from "../../../../../ui-utils/commons";
import { getTextToLocalMapping } from "./searchResults";
import { validateFields,convertDateToEpoch } from "../../utils";
import { getTenantId,getUserInfo } from "egov-ui-kit/utils/localStorageUtils";
import set from "lodash/set";
export const searchApiCall = async (state, dispatch) => {
  let { localisationLabels } = state.app || {};
  showHideTable(false, dispatch);
  const tenantId =  process.env.REACT_APP_NAME === "Employee" ?  getTenantId() : JSON.parse(getUserInfo()).permanentCity;

  let queryObject = [];
  let searchScreenObject = get(
    state.screenConfiguration.preparedFinalObject,
    "searchConnection",
    {}
  );
  const isSearchFormValid = validateFields(
    "components.div.children.searchForm.children.cardContent.children.searchFormContainer.children",
    state,
    dispatch,
    "link-connection"
  );
  

  if (!isSearchFormValid) {
    dispatch(
      toggleSnackbar(
        true,
        {
          labelName: "Please fill valid fields to start search",
          labelKey: "ERR_WS_FILL_ATLEAST_ONE_FIELD",
        },
        "warning"
      )
    );
  }
  // else if(true)
  // {

  // }
  else {
    let tenantId = process.env.REACT_APP_NAME === "Employee" ?  getTenantId() : JSON.parse(getUserInfo()).permanentCity;
    let queryObject = [
      {
        key: "tenantId",
        value: tenantId
      }      
    ];
    for (var key in searchScreenObject) {      
      if (
        searchScreenObject.hasOwnProperty(key) &&
        searchScreenObject[key].trim() !== ""
      ) {
        queryObject.push({ key: key, value: searchScreenObject[key] });
      }
      
    }
    try {
      let getSearchResult = getSearchResults(queryObject)
      let getSearchResultForSewerage = getSearchResultsForSewerage(queryObject, dispatch)
      let finalArray = [];
      let searchWaterConnectionResults, searcSewerageConnectionResults;

   try { searchWaterConnectionResults = await getSearchResult } catch (error) { finalArray = []; console.log(error) }
   try { searcSewerageConnectionResults = await getSearchResultForSewerage } catch (error) { finalArray = []; console.log(error) }
   const waterConnections = searchWaterConnectionResults ? searchWaterConnectionResults.WaterConnection.map(e => { e.service = 'WATER'; return e }) : []
   const sewerageConnections = searcSewerageConnectionResults ? searcSewerageConnectionResults.SewerageConnections.map(e => { e.service = 'SEWERAGE'; return e }) : [];
   let combinedSearchResults = searchWaterConnectionResults || searcSewerageConnectionResults ? sewerageConnections.concat(waterConnections) : []
  
   for (let i = 0; i < combinedSearchResults.length; i++) {
    let element = combinedSearchResults[i];
    finalArray.push({
      due: 'NA',
      dueDate: 'NA',
      service: element.service,
      connectionNo: element.connectionNo,
      name: (element.property) ? element.property.owners[0].name : '',
      status: element.status,
      address: handleAddress(element),
      connectionType: element.connectionType,
      tenantId: element.tenantId
    })
    // if (element.connectionNo !== "NA" && element.connectionNo !== null) {
    //   let queryObjectForWaterFetchBill;
    //   if (element.service === "WATER") {
    //     queryObjectForWaterFetchBill = [{ key: "tenantId", value: getTenantIdCommon() }, { key: "consumerCode", value: element.connectionNo }, { key: "businessService", value: "WS" }];
    //   } else {
    //     queryObjectForWaterFetchBill = [{ key: "tenantId", value: getTenantIdCommon() }, { key: "consumerCode", value: element.connectionNo }, { key: "businessService", value: "SW" }];
    //   }

    //   if (element.service === "WATER" &&
    //     payloadbillingPeriod &&
    //     payloadbillingPeriod.MdmsRes['ws-services-masters'] &&
    //     payloadbillingPeriod.MdmsRes['ws-services-masters'].billingPeriod !== undefined &&
    //     payloadbillingPeriod.MdmsRes['ws-services-masters'].billingPeriod !== null) {
    //     payloadbillingPeriod.MdmsRes['ws-services-masters'].billingPeriod.forEach(obj => {
    //       if (obj.connectionType === 'Metered') {
    //         waterMeteredDemandExipryDate = obj.demandExpiryDate;
    //       } else if (obj.connectionType === 'Non Metered') {
    //         waterNonMeteredDemandExipryDate = obj.demandExpiryDate;
    //       }
    //     });
    //   }
    //   if (element.service === "SEWERAGE" &&
    //     payloadbillingPeriod &&
    //     payloadbillingPeriod.MdmsRes['sw-services-calculation'] &&
    //     payloadbillingPeriod.MdmsRes['sw-services-calculation'].billingPeriod !== undefined &&
    //     payloadbillingPeriod.MdmsRes['sw-services-calculation'].billingPeriod !== null) {
    //     payloadbillingPeriod.MdmsRes['sw-services-calculation'].billingPeriod.forEach(obj => {
    //       if (obj.connectionType === 'Non Metered') {
    //         sewerageNonMeteredDemandExpiryDate = obj.demandExpiryDate;
    //       }
    //     });
    //   }

    //   let billResults = await fetchBill(queryObjectForWaterFetchBill, dispatch)
    //   billResults ? billResults.Bill.map(bill => {
    //     let updatedDueDate = 0;
    //     if (element.service === "WATER") {
    //       updatedDueDate = (element.connectionType === 'Metered' ?
    //         (bill.billDetails[0].toPeriod + waterMeteredDemandExipryDate) :
    //         (bill.billDetails[0].toPeriod + waterNonMeteredDemandExipryDate));
    //     } else if (element.service === "SEWERAGE") {
    //       updatedDueDate = bill.billDetails[0].toPeriod + sewerageNonMeteredDemandExpiryDate;
    //     }
    //     finalArray.push({
    //       due: bill.totalAmount,
    //       dueDate: updatedDueDate,
    //       service: element.service,
    //       connectionNo: element.connectionNo,
    //       name: (element.property) ? element.property.owners[0].name : '',
    //       status: element.status,
    //       address: handleAddress(element),
    //       connectionType: element.connectionType,
    //       tenantId: element.tenantId
    //     })
    //   }) : finalArray.push({
    //     due: 'NA',
    //     dueDate: 'NA',
    //     service: element.service,
    //     connectionNo: element.connectionNo,
    //     name: (element.property) ? element.property.owners[0].name : '',
    //     status: element.status,
    //     address: handleAddress(element),
    //     connectionType: element.connectionType,
    //     tenantId: element.tenantId
    //   })
    // }

  }
   showConnectionResults(finalArray, dispatch)
  } catch (err) { console.log(err) }
  }
};
const handleAddress = (element) => {
  let city = (
    element.property &&
    element.property !== "NA" &&
    element.property.address !== undefined &&
    element.property.address.city !== undefined &&
    element.property.address.city !== null
  ) ? element.property.address.city : "";
  let localityName = (
    element.property &&
    element.property !== "NA" &&
    element.property.address.locality !== undefined &&
    element.property.address.locality !== null &&
    element.property.address.locality.name !== null
  ) ? element.property.address.locality.name : "";

  return (city === "" && localityName === "") ? "NA" : `${localityName}, ${city}`;
}
const showHideConnectionTable = (booleanHideOrShow, dispatch) => {
  dispatch(handleField("link-connection", "components.div.children.searchResults", "visible", booleanHideOrShow));
};
const showConnectionResults = (connections, dispatch) => {
  let data = connections.map(item => ({
    [getTextToLocalMapping("service")]: item.service,
    [getTextToLocalMapping("Consumer No")]: item.connectionNo,
    [getTextToLocalMapping("Owner Name")]: item.name,
    [getTextToLocalMapping("Status")]: item.status,
    // [getTextToLocalMapping("Due")]: item.due,
     [getTextToLocalMapping("Address")]: item.address,
    // [getTextToLocalMapping("Due Date")]: (item.dueDate !== undefined && item.dueDate !== "NA") ? convertEpochToDate(item.dueDate) : item.dueDate,
    [getTextToLocalMapping("tenantId")]: item.tenantId,
    [getTextToLocalMapping("connectionType")]: item.connectionType
  }));
  dispatch(handleField("link-connection", "components.div.children.searchResults", "props.data", data));
  dispatch(handleField("link-connection", "components.div.children.searchResults", "props.rows",
    connections.length
  ));
  showHideConnectionTable(true, dispatch);
}
const showHideTable = (booleanHideOrShow, dispatch) => {
  dispatch(
    handleField(
      "link-connection",
      "components.div.children.searchResults",
      "visible",
      booleanHideOrShow
    )
  );
};
