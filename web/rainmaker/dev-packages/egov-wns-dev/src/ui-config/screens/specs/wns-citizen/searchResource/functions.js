import get from "lodash/get";
import { handleScreenConfigurationFieldChange as handleField, prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getSearchResults, fetchBill, getSearchResultsForSewerage,getBillingEstimation } from "../../../../../ui-utils/commons";
import { convertEpochToDate } from "../../utils/index";
import { toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { validateFields } from "../../utils";
import { httpRequest } from "../../../../../ui-utils";
import { getTextToLocalMapping } from "./searchResults";
export const searchApiCall = async (state, dispatch) => {
  showHideTable(false, dispatch);
  let queryObject = [
    { key: "offset", value: "0" }
  ];
  let searchScreenObject = get(
    state.screenConfiguration.preparedFinalObject,
    "searchScreen",
    {}
  );
  const isSearchBoxFirstRowValid = validateFields(
    "components.div.children.citizenApplication.children.cardContent.children.cityPropertyAndMobNumContainer.children",
    state,
    dispatch,
    "search"
  );

  const isSearchBoxSecondRowValid = validateFields(
    "components.div.children.citizenApplication.children.cardContent.children.cityPropertyAndMobNumContainer.children",
    state,
    dispatch,
    "search"
  );
  if (!(isSearchBoxFirstRowValid && isSearchBoxSecondRowValid)) {
    dispatch(toggleSnackbar(true, { labelKey: "ERR_WS_FILL_MANDATORY_FIELDS" }, "warning"));
  } else if (
    Object.keys(searchScreenObject).length == 0 ||
    Object.values(searchScreenObject).every(x => x === "")
  ) {
    dispatch(toggleSnackbar(true, { labelKey: "ERR_WS_FILL_MANDATORY_FIELDS" }, "warning"));
  } else if (
    (searchScreenObject["propertyId"] === undefined || searchScreenObject["propertyId"] === "") &&
    (searchScreenObject["mobileNumber"] === undefined || searchScreenObject["mobileNumber"] === "") &&
    (searchScreenObject["connectionNumber"] === undefined || searchScreenObject["connectionNumber"] === "") &&
    (searchScreenObject["oldConnectionNumber"] === undefined || searchScreenObject["oldConnectionNumber"] === "")
  ) {
    dispatch(toggleSnackbar(true, { labelKey: "ERR_WS_FILL_VALID_FIELDS" }, "warning"));
  } else {
    for (var key in searchScreenObject) {
      if (
        searchScreenObject.hasOwnProperty(key) &&
        searchScreenObject[key].trim() !== ""
      ) {
        queryObject.push({ key: key, value: searchScreenObject[key].trim() });
      }
    }
    let tenantId = get(state, "screenConfiguration.preparedFinalObject.searchScreen.tenantId");
    let waterMeteredDemandExipryDate = 0;
    let waterNonMeteredDemandExipryDate = 0;
    let sewerageNonMeteredDemandExpiryDate = 0;
    let payloadbillingPeriod
    try {
      try {
        // Get the MDMS data for billingPeriod
        let mdmsBody = {
          MdmsCriteria: {
            tenantId: tenantId,
            moduleDetails: [
              { moduleName: "ws-services-masters", masterDetails: [{ name: "billingPeriod" }] },
              { moduleName: "sw-services-calculation", masterDetails: [{ name: "billingPeriod" }] }
            ]
          }
        }
        //Read metered & non-metered demand expiry date and assign value.
        payloadbillingPeriod = await httpRequest("post", "/egov-mdms-service/v1/_search", "_search", [], mdmsBody);

      } catch (err) { console.log(err) }
      let getSearchResult = getSearchResults(queryObject)
     // let getSearchResultForSewerage = getSearchResultsForSewerage(queryObject, dispatch)
      let finalArray = [];
      let searchWaterConnectionResults, searcSewerageConnectionResults;
      try { searchWaterConnectionResults = await getSearchResult } catch (error) { finalArray = []; console.log(error) }
     try { searcSewerageConnectionResults = await getSearchResultForSewerage } catch (error) { finalArray = []; console.log(error) }
      const waterConnections = searchWaterConnectionResults ? searchWaterConnectionResults.WaterConnection.map(e => { e.service = 'WATER'; return e }) : []
     const sewerageConnections = searcSewerageConnectionResults ? searcSewerageConnectionResults.SewerageConnections.map(e => { e.service = 'SEWERAGE'; return e }) : [];
      let combinedSearchResults = searchWaterConnectionResults || searcSewerageConnectionResults ? sewerageConnections.concat(waterConnections) : []
      for (let i = 0; i < combinedSearchResults.length; i++) {
        let element = combinedSearchResults[i];
        if (element.property && element.property !== "NA" && element.connectionNo !== null && element.connectionNo !== 'NA') {
          let requestBody=
          {billGeneration:
          {            
            consumerCode:element.connectionNo,
            tenantId:tenantId,
            paymentMode:'cash',
            isGenerateDemand:false,            
          }
        }


          // if (element.service === "WATER") {
          //   queryObjectForWaterFetchBill = [{ key: "tenantId", value: tenantId }, { key: "consumerCode", value: element.connectionNo }, { key: "paymentMode", value: "cash" }, { key: "isGenerateDemand", value: false }];
          // } else {
          //   queryObjectForWaterFetchBill = [{ key: "tenantId", value: tenantId }, { key: "consumerCode", value: element.connectionNo }, { key: "businessService", value: "SW" }];
          // }

          if (element.service === "WATER" && payloadbillingPeriod.MdmsRes['ws-services-masters'] && payloadbillingPeriod.MdmsRes['ws-services-masters'].billingPeriod !== undefined && payloadbillingPeriod.MdmsRes['ws-services-masters'].billingPeriod !== null) {
            payloadbillingPeriod.MdmsRes['ws-services-masters'].billingPeriod.forEach(obj => {
              if (obj.connectionType === 'Metered') {
                waterMeteredDemandExipryDate = obj.demandExpiryDate;
              } else if (obj.connectionType === 'Non Metered') {
                waterNonMeteredDemandExipryDate = obj.demandExpiryDate;
              }
            });
          }
          if (element.service === "SEWERAGE" && payloadbillingPeriod.MdmsRes['sw-services-calculation'] && payloadbillingPeriod.MdmsRes['sw-services-calculation'].billingPeriod !== undefined && payloadbillingPeriod.MdmsRes['sw-services-calculation'].billingPeriod !== null) {
            payloadbillingPeriod.MdmsRes['sw-services-calculation'].billingPeriod.forEach(obj => {
              if (obj.connectionType === 'Non Metered') {
                sewerageNonMeteredDemandExpiryDate = obj.demandExpiryDate;
              }
            });
          }

          let billResults = await getBillingEstimation(requestBody, dispatch)
          
          billResults ? billResults.billGeneration.map(bill => {
            let updatedDueDate = bill.dueDateCash;
            // if (element.service === "WATER") {
            //   updatedDueDate = (element.connectionType === 'Metered' ?
            //     (bill.billDetails[0].toPeriod + waterMeteredDemandExipryDate) :
            //     (bill.billDetails[0].toPeriod + waterNonMeteredDemandExipryDate));
            // } else if (element.service === "SEWERAGE") {
            //   updatedDueDate = bill.billDetails[0].toPeriod + sewerageNonMeteredDemandExpiryDate;
            // }
            let obj = {
              service: "WATER",
              connectionNo: element.connectionNo, 
              billGenerationId:bill.billGenerationId,
              name: (element.property && element.property !== "NA" && element.property.owners) ? element.property.owners[0].name : '',
              status: element.status,
              due: bill.totalNetAmount ===null?'':bill.totalNetAmount,
              address: (element.connectionHolders && element.connectionHolders !== null && element.connectionHolders[0].correspondenceAddress) ? element.connectionHolders[0].correspondenceAddress : '',
              dueDate: updatedDueDate,
              apnstatus: bill.status, 
              tenantId: element.tenantId,              
              connectionType: element.connectionType
            }
            finalArray.push(obj)
          }) : finalArray.push({
            service: element.service,
            connectionNo: element.connectionNo,
            billGenerationId:0,
            name: (element.property && element.property !== "NA" && element.property.owners) ? element.property.owners[0].name : '',// from connection holder.
            status: element.status,
            due: 'NA',
            address: (element.connectionHolders && element.connectionHolders !== null && element.connectionHolders[0].correspondenceAddress) ? element.connectionHolders[0].correspondenceAddress : '',
            dueDate: 'NA',  
            apnstatus:'NA',          
            tenantId: element.tenantId,
            connectionType: element.connectionType
          })
        }
      }
      showResults(finalArray, dispatch, tenantId)
    } catch (err) { console.log(err) }
  }
}
const showHideTable = (booleanHideOrShow, dispatch) => {
  dispatch(
    handleField(
      "search",
      "components.div.children.searchResults",
      "visible",
      booleanHideOrShow
    )
  );
};

const showResults = (connections, dispatch, tenantId) => {
  let data = connections.map(item => ({
    [getTextToLocalMapping("service")]: item.service,
    [getTextToLocalMapping("Consumer No")]: item.connectionNo,
    [getTextToLocalMapping("Owner Name")]: item.name,
    [getTextToLocalMapping("Status")]: item.status,
    [getTextToLocalMapping("Due")]: item.due,
    [getTextToLocalMapping("Address")]: item.address,
    [getTextToLocalMapping("Due Date")]: (item.dueDate !== undefined && item.dueDate !== "NA") ? convertEpochToDate(item.dueDate) : item.dueDate,
    [getTextToLocalMapping("tenantId")]: item.tenantId,
    [getTextToLocalMapping("Application Status")]: item.apnstatus,
    [getTextToLocalMapping("connectionType")]: item.connectionType,
    [getTextToLocalMapping("connectionType")]: item.billGenerationId
  }))

  dispatch(handleField("search", "components.div.children.searchResults", "props.data", data));
  dispatch(handleField("search", "components.div.children.searchResults", "props.rows", connections.length));
  dispatch(
    handleField(
      "search",
      "components.div.children.searchResults",
      "props.title",
      `${getTextToLocalMapping("Search Results for Water & Sewerage Connections")} (${
      connections.length
      })`
    )
  );
  showHideTable(true, dispatch);
}
