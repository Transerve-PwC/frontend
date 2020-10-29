import get from "lodash/get";
import set from "lodash/set";
import memoize from "lodash/memoize";
import { handleScreenConfigurationFieldChange as handleField } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getSearchResults, getCount } from "../../../../..//ui-utils/commons";
import {
  convertEpochToDate,
  convertDateToEpoch,
  getTextToLocalMapping as _getTextToLocalMapping
} from "../../utils/index";
import { toggleSnackbar, prepareFinalObject, toggleSpinner } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { validateFields } from "../../utils";
import { getTenantId } from "egov-ui-kit/utils/localStorageUtils";
import { setBusinessServiceDataToLocalStorage, getLocaleLabels } from "egov-ui-framework/ui-utils/commons";
import commonConfig from "config/common.js";
import { httpRequest } from "../../../../../ui-utils"
import moment from "moment";
import {
  localStorageGet,
} from "egov-ui-kit/utils/localStorageUtils";
import React from 'react';
import { getAccountStatementProperty } from "./estateApplicationAccountStatementGen";

export const getTextToLocalMapping = memoize((label) => _getTextToLocalMapping(label));

export const searchApiCallAccountStatement = async (state, dispatch, onInit, offset, limit = 100, hideTable = true) => {
  dispatch(toggleSpinner());
  !!hideTable && showHideTable(false, dispatch);
  // showHideTable(false, dispatch);
  let searchScreenObject = get(
    state.screenConfiguration.preparedFinalObject,
    "searchScreen",
    {}
  );
  
// Date, fileNumber/SiteNumber, sector  needs to be there, other optional 

// var isDateValid = validateFields(
// "components.div.children.estateApplicationAccountStatementGen.children.cardContent.children.searchBoxContainer.children.dateContainer",
// state,
// dispatch,
// "estate-search-account-statement"
// );
// var isCategoryValid = validateFields(
//   "components.div.children.estateApplicationAccountStatementGen.children.cardContent.children.searchBoxContainer.children.categoryContainer",
//   state,
//   dispatch,
//   "estate-search-account-statement"
//   );
var isfileNumberValid = validateFields(
  "components.div.children.estateApplicationAccountStatementGen.children.cardContent.children.searchBoxContainer.children.fileNumberContainer",
  state,
  dispatch,
  "estate-search-account-statement"
  );
  // var isSiteNumberValid = validateFields(
  //   "components.div.children.estateApplicationAccountStatementGen.children.cardContent.children.searchBoxContainer.children.siteContainer",
  //   state,
  //   dispatch,
  //   "estate-search-account-statement"
  //   );

    if(!!isfileNumberValid) {
      let Criteria = {
        fromdate: !!searchScreenObject.fromDate ? convertDateToEpoch(searchScreenObject.fromDate) : "",
        todate: !!searchScreenObject.toDate ? convertDateToEpoch(searchScreenObject.toDate) : ""
      }
      const propertyId = !!searchScreenObject.propertyId ? searchScreenObject.propertyId : await getAccountStatementProperty(state, dispatch)
        if(!!propertyId) {
          Criteria = {...Criteria, propertyid: propertyId}
          const response = await httpRequest(
            "post",
            '/est-services/property-master/_accountstatement',
            "",
            [],
            {Criteria}
          )
  
          try {
            dispatch(
              prepareFinalObject(
                "EstateAccountStatement",
                response.EstateAccountStatement
              )
            );
            let data = response.EstateAccountStatement.map(item => ({
              [getTextToLocalMapping("Date")]: moment(new Date(item.date)).format("DD-MMM-YYYY") || "-",
              [getTextToLocalMapping("Amount")]: formatAmount(item.amount.toFixed(2)) || "-",
              [getTextToLocalMapping("Type(Payment)")]:  changeTypePayment(item.type) || "-",
              [getTextToLocalMapping("Type(Rent)")]: changePTypeRent(item.type) || "-",
              [getTextToLocalMapping("Principal Due")]: formatAmount(item.remainingPrincipal.toFixed(2)) || "-",
              [getTextToLocalMapping("GST Due")]:  formatAmount(item.remainingGST.toFixed(2)) || "-",
              [getTextToLocalMapping("Interest Due")]: formatAmount(item.remainingRentPenalty.toFixed(2)) || "-",
              [getTextToLocalMapping("GST Penalty Due")]: formatAmount(item.remainingGSTPenalty.toFixed(2)) || "-",
              [getTextToLocalMapping("Total Due")]: formatAmount(item.dueAmount.toFixed(2)) || "-",
              [getTextToLocalMapping("Account Balance")]: formatAmount(item.remainingBalance.toFixed(2)) || "-",
              [getTextToLocalMapping("Receipt No.")]: item.receiptNo || "-",
              
            }));
            let lastElement = data.pop();
            lastElement.Date = "Balance as on "+lastElement.Date
            lastElement["Type(Payment)"] = "-"
            lastElement["Type(Rent)"]= "-"
            data.push(lastElement)
            dispatch(
              handleField(
                "estate-search-account-statement",
                "components.div.children.searchResultsAccountStatement",
                "visible",
                true
              )
            );
            dispatch(
              handleField(
                "estate-search-account-statement",
                "components.div.children.downloadButton",
                "visible",
                true
              )
            );
            dispatch(
              handleField(
                "estate-search-account-statement",
                "components.div.children.searchResultsAccountStatement",
                "props.data",
                data
              )
            );
      //     dispatch(
      //     handleField(
      //       "estate-search-account-statement",
      //       "components.div.children.downloadButton",
      //       "visible",
      //       true
      //   ),
      // );
          } catch (error) {
            console.log(error)
            dispatch(toggleSnackbar(true, error.message, "error"));
          }
      }
    }

  
      !!hideTable && showHideTable(true, dispatch);
  //     // showHideTable(true, dispatch);
      dispatch(toggleSpinner());
};

export const formatAmount = (x) => {
  
  return x.toString().split('.')[0].length > 3 ? x.toString().substring(0,x.toString().split('.')[0].length-3).replace(/\B(?=(\d{2})+(?!\d))/g, ",") + "," + x.toString().substring(x.toString().split('.')[0].length-3): x.toString();
  
}

const showHideTable = (booleanHideOrShow, dispatch) => {
  dispatch(
    handleField(
      "estate-search-account-statement",
      "components.div.children.searchResultsAccountStatement",
      "visible",
      booleanHideOrShow
    )
  );
};
export const changePTypeRent =(type)=>{
  if(type === 'D'){
    return "Rent"
  }else
  {
    return "-"
}
}

export const changeTypePayment = (type) => {
  if(type === 'C'){
    return "Payment"
    }else
    {
      return "-"
}
}