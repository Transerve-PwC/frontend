import React from "react";
import {
  sortByEpoch,
  getEpochForDate,
} from "../../utils";
import { getTextToLocalMapping } from "./functions";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";

export const searchResults = {
  uiFramework: "custom-molecules",
  moduleName: "egov-estate",
  componentPath: "Table",
  visible: false,
  props: {
    columns: [
      getTextToLocalMapping("Application No"),
      getTextToLocalMapping("File No"),
      getTextToLocalMapping("Status"), 
      getTextToLocalMapping("Last Modified On"),
      {
        name: "Application Type",
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
    }
  }
};

const onRowClick = rowData => {
  window.location.href = `search-preview?fileNumber=${rowData[1]}&applicationType=${rowData[4]}`;
};