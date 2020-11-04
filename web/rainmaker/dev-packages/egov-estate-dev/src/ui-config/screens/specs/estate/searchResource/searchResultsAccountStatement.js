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
export const AMOUNT = getTextToLocalMapping("ES_COMMON_TABLE_COL_AMOUNT") + " (₹)"
export const PAYMENTTYPE = getTextToLocalMapping("ES_COMMON_TABLE_COL_PAYMENTTYPE") + " (₹)"
export const RENTTYPE = getTextToLocalMapping("ES_COMMON_TABLE_COL_RENTTYPE") + " (₹)"
export const PRINCIPALDUE = getTextToLocalMapping("ES_COMMON_TABLE_COL_PRINCIPALDUE") + " (₹)"
export const GSTDUE = getTextToLocalMapping("ES_COMMON_TABLE_COL_GSTDUE")
export const INTERESTDUE = getTextToLocalMapping("ES_COMMON_TABLE_COL_INTERESTDUE")
export const GSTPENALTYDUE = getTextToLocalMapping("ES_COMMON_TABLE_COL_GSTPENALTYDUE")
export const TOTALDUE = getTextToLocalMapping("ES_COMMON_TABLE_COL_TOTALDUE") + " (₹)"
export const ACCOUNTBALANCE = getTextToLocalMapping("ES_COMMON_TABLE_COL_ACCOUNTBALANCE") + " (₹)"
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
    style:{
      textAlign: "right"
    },
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
  ...searchResultsAccountStatement.props.style,
    columns: [
      DATE,
      {
        name: AMOUNT,
        options: {
          customBodyRender: value => (
            <span style={{ display: 'flex', justifyContent: 'right', flexDirection: 'row-reverse',marginBottom:'none'}}>
          {value}
        </span> 
          )
        }
      },
      PAYMENTTYPE,
      RENTTYPE,
      {
        name: PRINCIPALDUE,
        options: {
          customBodyRender: value => (
            <span style={{ display: 'flex', justifyContent: 'right',float: 'right', flexDirection: 'row-reverse',marginBottom:'none'}}>
          {value}
        </span> 
          )
        }
      },
      {
        name: GSTDUE,
        options: {
          customBodyRender: value => (
            <span style={{ display: 'flex', justifyContent: 'right',float: 'right', flexDirection: 'row-reverse',marginBottom:'none'}}>
          {value}
        </span> 
          )
        }
      },
      {
        name: INTERESTDUE,
        options: {
          customBodyRender: value => (
            <span style={{ display: 'flex', justifyContent: 'right',float: 'right', flexDirection: 'row-reverse',marginBottom:'none'}}>
          {value}
        </span> 
          )
        }
      },
      {
        name: GSTPENALTYDUE,
        options: {
          customBodyRender: value => (
            <span style={{ display: 'flex', justifyContent: 'right', float: 'right', flexDirection: 'row-reverse',marginBottom:'none'}}>
          {value}
        </span> 
          )
        }
      },
      {
        name: TOTALDUE,
        options: {
          customBodyRender: value => (
            <span style={{ display: 'flex', justifyContent: 'right', float: 'right', flexDirection: 'row-reverse',marginBottom:'none'}}>
          {value}
        </span> 
          )
        }
      },
      {
        name: ACCOUNTBALANCE,
        options: {
          customBodyRender: value => (
            <span style={{ display: 'flex', justifyContent: 'right', float: 'right', flexDirection: 'row-reverse',marginBottom:'none'}}>
          {value}
        </span> 
          )
        }
      },
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