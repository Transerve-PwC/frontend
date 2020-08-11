import React from "react";
import {
  sortByEpoch,
  getEpochForDate,
  getTextToLocalMapping
} from "../../utils";
import { searchApiCall } from "./functions";
import { localStorageGet,getTenantId } from "egov-ui-kit/utils/localStorageUtils";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import { getUserInfo } from "egov-ui-kit/utils/localStorageUtils";
import { getLocaleLabels } from "egov-ui-framework/ui-utils/commons";

const userInfo = JSON.parse(getUserInfo());

export const APPLICATION_NO = getLocaleLabels("APPLICATION NUMBER", "RP_COMMON_TABLE_COL_APPLICAITON_NUMBER")
export const PROPERTY_ID = getLocaleLabels("PROPERTY ID", "RP_COMMON_TABLE_COL_PROPERTY_ID")
export const OWNER_NAME = getLocaleLabels("APPLICANT NAME", "RP_COMMON_TABLE_COL_APPLICANT_NAME")
export const STATUS = getLocaleLabels("APPLICATION STATUS", "RP_COMMON_TABLE_COL_APPLICATION_STATUS")
export const LAST_MODIFIED_ON = getLocaleLabels("LAST MODIFIED ON", "RP_COMMON_TABLE_COL_LAST_MODIFIED_ON")
export const MONTHASSESSMENT = getLocaleLabels("MONTH ASSESSMENT", "RP_COMMON_TABLE_COL_MONTHASSESSMENT")
export const AMOUNTREALIZATION = getLocaleLabels("AMOUNT REALIZATION","RP_COMMON_TABLE_COL_AMOUNTREALIZATION")
export const AMOUNTBALANCE = getLocaleLabels("AMOUNT BALANCE","RP_COMMON_TABLE_COL_AMOUNTBALANCE")
export const AMOUNT = getLocaleLabels("AMOUNT","RP_COMMON_TABLE_COL_AS_AMOUNT")
export const TOTAL_DAYS = getLocaleLabels("TOTAL DAYS","RP_COMMON_TABLE_COL_TOTAL_DAYS")
export const INTEREST = getLocaleLabels("INTEREST","RP_COMMON_TABLE_COL_INTEREST")
export const DAYS = getLocaleLabels("DAYS","RP_COMMON_TABLE_COL_DAYS")
export const INTEREST_CALCULATION = getLocaleLabels("INTEREST CALCULATION","RP_COMMON_TABLE_COL_INTEREST_CALCULATION")
export const RECEIPT_NO = getLocaleLabels("RECEIPT NO","RP_COMMON_TABLE_COL_RECEIPT_NO")
export const DATE = getLocaleLabels("DATE","RP_COMMON_TABLE_COL_DATE")

export const searchResults = {
  uiFramework: "custom-molecules",
  componentPath: "Table",
  visible: true,
  props: {
    columns: [
      getTextToLocalMapping("Transit No"),
      getTextToLocalMapping("Colony"),
      getTextToLocalMapping("Owner"),
      getTextToLocalMapping("Status"),
      LAST_MODIFIED_ON
    ],
    options: {
      filter: false,
      download: false,
      responsive: "stacked",
      selectableRows: false,
      hover: true,
      rowsPerPageOptions: [10, 15, 20],
      onRowClick: (row, index) => {
        onRowClick(row);
      }
    },
    customSortColumn: {
      column: "Application Date",
      sortingFn: (data, i, sortDateOrder) => {
        const epochDates = data.reduce((acc, curr) => {
          acc.push([...curr, getEpochForDate(curr[4], "dayend")]);
          return acc;
        }, []);
        const order = sortDateOrder === "asc" ? true : false;
        const finalData = sortByEpoch(epochDates, !order).map(item => {
          item.pop();
          return item;
        });
        return { data: finalData, currentOrder: !order ? "asc" : "desc" };
      }
    }
  }
};

const onRowClick = rowData => {
  const {roles = []} = userInfo
  const findItem = roles.find(item => item.code === "CTL_CLERK");
  if(rowData[3].toUpperCase() === "PM_DRAFTED" && !!findItem) {
    window.location.href = `apply?tenantId=${getTenantId()}&transitNumber=${rowData[0]}`
  } else {
    window.location.href = `search-preview?transitNumber=${rowData[0]}&tenantId=${getTenantId()}`;
  }
};

const onTransferPropertyRowClick = rowData => {
  window.location.href = `ownership-search-preview?applicationNumber=${rowData[0]}&tenantId=${getTenantId()}`
}

const onDuplicateCopyRowClick = rowData => {
  window.location.href = `search-duplicate-copy-preview?applicationNumber=${rowData[0]}&tenantId=${getTenantId()}`
}

const onMortgageRowClick = rowData => {
  window.location.href = `mortgage-search-preview?applicationNumber=${rowData[0]}&tenantId=${getTenantId()}`
}

export const transferSearchResults = {
  ...searchResults,
  props: {...searchResults.props, 
    columns: [
      APPLICATION_NO,
      getTextToLocalMapping("Transit No"),
      // PROPERTY_ID,
      OWNER_NAME,
      STATUS,
      LAST_MODIFIED_ON
    ],
    options: {...searchResults.props.options,
      onRowClick: (row, index) => {
        onTransferPropertyRowClick(row);
      }
    }
  }
}

export const accountStatementResults = {
  ...searchResults,
  props: {...searchResults.props, 
    columns: [
      MONTHASSESSMENT,
      AMOUNTREALIZATION,
      AMOUNTBALANCE,
      AMOUNT,
      TOTAL_DAYS,
      INTEREST,
      DAYS,
      INTEREST_CALCULATION,
      RECEIPT_NO,
      DATE
    ],
    options: {...searchResults.props.options,
      download:true,
      filter: true,
      onRowClick: (row, index) => {
        onTransferPropertyRowClick(row);
      }
    }
  }
}

export const duplicateCopySearchResult = {
  ...searchResults,
  props: {...searchResults.props, 
    columns: [
      APPLICATION_NO,
      getTextToLocalMapping("Transit No"),
      // PROPERTY_ID,
      OWNER_NAME,
      STATUS,
      LAST_MODIFIED_ON
    ],
    options: {...searchResults.props.options,
      onRowClick: (row, index) => {
        onDuplicateCopyRowClick(row);
      }
    }
  }
}

export const mortgageSearchResults = {
  ...duplicateCopySearchResult,
  props: {...duplicateCopySearchResult.props, 
    options: {...searchResults.props.options,
      onRowClick: (row, index) => {
        onMortgageRowClick(row);
      }
    }
  }
}