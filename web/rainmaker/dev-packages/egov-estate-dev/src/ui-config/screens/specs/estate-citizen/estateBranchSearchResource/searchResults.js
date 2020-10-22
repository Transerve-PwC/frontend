import React from "react";
import {
  sortByEpoch,
  getEpochForDate,
} from "../../utils";
import { getTextToLocalMapping } from "./searchFunctions";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";

const applicationType = getQueryArg(window.location.href, "type");

export const searchResults = {
  uiFramework: "custom-molecules",
  moduleName: "egov-estate",
  componentPath: "Table",
  visible: false,
  props: {
    columns: [
      getTextToLocalMapping("File Number"),
      getTextToLocalMapping("Sector Number"),
      getTextToLocalMapping("Status"), 
      getTextToLocalMapping("Last Modified On")
    ],
    options: {
      filter: false,
      download: false,
      responsive: "stacked",
      search:false,
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
  window.location.href = `estate-branch-search-preview?fileNumber=${rowData[0]}`;
};