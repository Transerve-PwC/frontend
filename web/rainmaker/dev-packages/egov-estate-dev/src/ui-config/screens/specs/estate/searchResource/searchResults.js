import React from "react";
import {
  sortByEpoch,
  getEpochForDate,
  getTextToLocalMapping
} from "../../utils";
import { getTenantId } from "egov-ui-kit/utils/localStorageUtils";
import { getLocaleLabels, getQueryArg } from "egov-ui-framework/ui-utils/commons";
import store from "../../../../../ui-redux/store";


const tenantId = getTenantId();

export const LAST_MODIFIED_ON = getLocaleLabels("LAST MODIFIED ON", "ES_LAST_MODIFIED_ON_LABEL")


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
  window.location.href = `preview?applicationNumber=${rowData[1]}&tenantId=${tenantId}`
}

const onRowClick = rowData => {
  console.log(rowData);
  let type = getQueryArg(window.location.href, "type");

  if (type == "refund" && rowData[2].toUpperCase() == "ES_PM_APPROVED") {
    return window.location.href = `refund?filenumber=${rowData[0]}&tenantId=${tenantId}`
  }

  if (rowData[2].toUpperCase() === "ES_PM_DRAFTED") {
    if (rowData[4] == "PROPERTY_MASTER")
      window.location.href = `apply?filenumber=${rowData[0]}&tenantId=${tenantId}`;
    else
      window.location.href = `allotment?filenumber=${rowData[0]}&tenantId=${tenantId}`;
  }
  else {
    window.location.href = `search-preview?filenumber=${rowData[0]}&tenantId=${tenantId}`;
  }
};





