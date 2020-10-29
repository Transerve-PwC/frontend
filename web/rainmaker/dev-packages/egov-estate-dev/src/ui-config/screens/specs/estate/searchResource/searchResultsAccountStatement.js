import React from "react";
import {
  sortByEpoch,
  getEpochForDate,
} from "../../utils";
// import { getTextToLocalMapping } from "./searchFunctions";
import {
  getTextToLocalMapping
} from "../../utils/index";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";

export const DATE = getTextToLocalMapping("ES_COMMON_TABLE_COL_DATE")
export const AMOUNT = getTextToLocalMapping("ES_COMMON_TABLE_COL_PENALTY_INTEREST")
export const PAYMENTTYPE = getTextToLocalMapping("ES_COMMON_TABLE_COL_ST_GST_RATE")
export const RENTTYPE = getTextToLocalMapping("ES_COMMON_TABLE_COL_PAID") + " (₹)"
export const PRINCIPALDUE = getTextToLocalMapping("ES_COMMON_TABLE_COL_DATE_OF_RECEIPT")
export const GSTDUE = getTextToLocalMapping("ES_COMMON_TABLE_COL_NO_OF_DAYS")
export const INTERESTDUE = getTextToLocalMapping("ES_COMMON_TABLE_COL_INT_ON_DELAYED_PAYMENT_GST")
export const GSTPENALTYDUE = getTextToLocalMapping("ES_COMMON_TABLE_RECEIPT_NO")
export const TOTALDUE = getTextToLocalMapping("ES_COMMON_TABLE_COL_INT_ON_DELAYED_PAYMENT_GST")
export const ACCOUNTBALANCE = getTextToLocalMapping("ES_COMMON_TABLE_RECEIPT_NO")
export const RECEIPT_NO = getTextToLocalMapping("ES_COMMON_TABLE_RECEIPT_NO")

export const searchResultsAccountStatement = {
  uiFramework: "custom-molecules",
  moduleName: "egov-estate",
  componentPath: "Table",
  visible: false,
  props: {
    columns: [
        getTextToLocalMapping("Date"),
        getTextToLocalMapping("Amount"),
        getTextToLocalMapping("Type(Payment)"),
        getTextToLocalMapping("Type(Rent)"),
        getTextToLocalMapping("Principal Due"),
        getTextToLocalMapping("GST Due"),
        getTextToLocalMapping("Interest Due"),
        getTextToLocalMapping("GST Penalty Due"),
        getTextToLocalMapping("Total Due"),
        getTextToLocalMapping("Account Balance"),
        getTextToLocalMapping("Receipt No."),
      {
        name: "propertyId",
        options: {
          display: false,
          viewColumns: true
        }
      }
    ],
    options: {
      filter: false,
      download: false,
      responsive: "stacked",
      selectableRows: false,
      hover: true,
      rowsPerPageOptions: [10, 15, 20]
    //   onRowClick: (row, index) => {
    //     onRowClick(row);
    //   }
    }
  }
};

export const accountStatementResults = {
  ...searchResultsAccountStatement,
  visible: false,
  props: {...searchResultsAccountStatement.props, 
    columns: [
      DATE,
      AMOUNT,
      PAYMENTTYPE,
      RENTTYPE,
      PRINCIPALDUE,
      GSTDUE,
      INTERESTDUE,
      GSTPENALTYDUE,
      TOTALDUE,
      ACCOUNTBALANCE,
      RECEIPT_NO
    ],
    options: {...searchResultsAccountStatement.props.options,
      onRowClick: () => {},
      pagination: false,
      filter: false,
      download: true,
      print: true,
      search:false,
      viewColumns:false,
      responsive: "stacked",
      selectableRows: false,
    }
  }
}