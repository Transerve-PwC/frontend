import React from "react";
import {
  sortByEpoch,
  getEpochForDate,
  getTextToLocalMapping
} from "../../utils";
import { getTenantId, getUserInfo } from "egov-ui-kit/utils/localStorageUtils";
import { getLocaleLabels, getQueryArg } from "egov-ui-framework/ui-utils/commons";
import store from "../../../../../ui-redux/store";
import {
  ESTATE_APPROVED_STATE,
  ESTATE_DRAFTED_STATE
} from "../../../../../ui-constants"

const tenantId = getTenantId();
const userInfo = JSON.parse(getUserInfo());
const {
    roles = []
} = userInfo
const findItem = roles.find(item => item.code === "ES_EB_SECTION_OFFICER");

export const LAST_MODIFIED_ON = getLocaleLabels("LAST MODIFIED ON", "ES_LAST_MODIFIED_ON_LABEL")
export const APPLICATION_TYPE = getLocaleLabels("Application Type", "ES_APPLICATION_TYPE_LABEL")
export const DATE = getLocaleLabels("ES_COMMON_TABLE_COL_DATE")
export const AMOUNT = getLocaleLabels("ES_COMMON_TABLE_COL_AMOUNT") + " (₹)"
export const TYPE = getLocaleLabels("ES_COMMON_TABLE_COL_TYPE")
export const PENALTY_STATUS = getLocaleLabels("ES_COMMON_TABLE_COL_PENALTY_STATUS")
export const STATUS = getLocaleLabels("ES_COMMON_TABLE_COL_STATUS")
export const OFFLINE_PAYMENT_DATE = getLocaleLabels("ES_COMMON_OFFLINE_PAYMENT_DATE")
export const TRANSACTION_ID = getLocaleLabels("ES_COMMON_TRANSACTION_ID")


export const searchResults = {
  uiFramework: "custom-molecules",
  componentPath: "Table",
  visible: true,
  props: {
    columns: [
      getTextToLocalMapping("File Number"),
      getTextToLocalMapping("Sector Number"),
      getTextToLocalMapping("Status"),
      LAST_MODIFIED_ON,
      {name: "propertyMasterOrAllotmentOfSite", options: {
        display: false,
        viewColumns: false
      }}
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

export const searchApplicationResults = {
  uiFramework: "custom-molecules",
  componentPath: "Table",
  visible: true,
  props: {
    columns: [
      getTextToLocalMapping("File Number"),
      getTextToLocalMapping("Application Number"),
      getTextToLocalMapping("Application Status"),
      APPLICATION_TYPE,
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
        onApplicationRowClick(row);
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

const onApplicationRowClick = rowData => {
  let applicationState = rowData[2];
  let branchType = getQueryArg(window.location.href, "branchType");
  if (applicationState == "-") {
    window.location.href = `_apply?applicationNumber=${rowData[1]}&tenantId=${tenantId}`
  }
  else {
    window.location.href = `preview?applicationNumber=${rowData[1]}&tenantId=${tenantId}&branchType=${branchType}`
  }
}

const onRowClick = rowData => {
  let type = getQueryArg(window.location.href, "type");
  let branchType = getQueryArg(window.location.href, "branchType");

  if (branchType == "BUILDING_BRANCH") {
    if (rowData[2].toUpperCase() === ESTATE_DRAFTED_STATE) {
      return window.location.href = `apply-building-branch?fileNumber=${rowData[0]}&tenantId=${tenantId}`;
    }
    return window.location.href = `search-preview-building-branch?fileNumber=${rowData[0]}&tenantId=${tenantId}`;
  }

  if (branchType == "MANI_MAJRA") {
    if (rowData[2].toUpperCase() === ESTATE_DRAFTED_STATE) {
      return window.location.href = `apply-manimajra?fileNumber=${rowData[0]}&tenantId=${tenantId}`;
    }
    return window.location.href = `search-preview-manimajra?fileNumber=${rowData[0]}&tenantId=${tenantId}`;
  }

  if (type == "refund" && rowData[2].toUpperCase() == ESTATE_APPROVED_STATE && !!findItem) {
    return window.location.href = `refund?fileNumber=${rowData[0]}&tenantId=${tenantId}`
  }

  if (rowData[2].toUpperCase() === ESTATE_DRAFTED_STATE) {
    if (rowData[4] == "PROPERTY_MASTER") {
      return window.location.href = `apply?fileNumber=${rowData[0]}&tenantId=${tenantId}`;
    }
    return window.location.href = `allotment?fileNumber=${rowData[0]}&tenantId=${tenantId}`;
  }

  window.location.href = `search-preview?fileNumber=${rowData[0]}&tenantId=${tenantId}`;
};

export const securityDetailsTable = {
  ...searchResults,
  visible: true,
  props: {...searchResults.props, 
    columns: [
      OFFLINE_PAYMENT_DATE,
      AMOUNT,
      TRANSACTION_ID
      
    ],
    options: {...searchResults.props.options,
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


export const penaltyDetailsTable = {
  ...searchResults,
  visible: true,
  props: {...searchResults.props, 
    columns: [
      DATE,
      TYPE,
      AMOUNT,
      PENALTY_STATUS,
      OFFLINE_PAYMENT_DATE
    ],
    options: {...searchResults.props.options,
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

export const extensionFeeDetailsTable = {
  ...searchResults,
  visible: true,
  props: {...searchResults.props, 
    columns: [
      DATE,
      AMOUNT,
      STATUS,
      OFFLINE_PAYMENT_DATE
    ],
    options: {...searchResults.props.options,
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







