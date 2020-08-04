import React from "react";
import {
  sortByEpoch,
  getEpochForDate,
} from "../../utils";
import { getTextToLocalMapping } from "./functions";

export const searchResults = {
  uiFramework: "custom-molecules",
  // moduleName: "egov-tradelicence",
  componentPath: "Table",
  visible: true,
  props: {
    columns: [
      getTextToLocalMapping("Application No"),
      getTextToLocalMapping("License No"),
      getTextToLocalMapping("License Type"), 
      getTextToLocalMapping("Service Type"),
      getTextToLocalMapping("Owner Name"),
      getTextToLocalMapping("Application Date"),
      getTextToLocalMapping("Financial Year"),
      {
        name: getTextToLocalMapping("Application Type"),
        options: {
          filter: false,
          customBodyRender: value => (
            <span>
              {getTextToLocalMapping(value)}
            </span>
          )
        }
      },
      {
        name: getTextToLocalMapping("Status"),
        options: {
          filter: false,
          customBodyRender: value => (
            <span
              style={
                value === "APPROVED" ? { color: "green" } : { color: "red" }
              }
            >
              {getTextToLocalMapping(value)}
            </span>
          )
        }
      },
      {
        name: "tenantId",
        options: {
          display: false,
          viewColumns: false
        }
      },
      {
        name:"status1",
        options: {
          display: false,
          viewColumns: false
        }
      },

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
  window.location.href = `search-preview?applicationNumber=${
    rowData[0]
  }&tenantId=${rowData[9]}`;
};
