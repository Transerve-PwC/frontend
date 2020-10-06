import React from "react";
import {
  sortByEpoch,
  getEpochForDate,
} from "../../utils";
import { getTextToLocalMapping } from "./searchFunctions";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";

export const searchResults = {
  uiFramework: "custom-molecules",
  moduleName: "egov-estate",
  componentPath: "Table",
  visible: false,
  props: {
    columns: [
      getTextToLocalMapping("Action"),
      getTextToLocalMapping("File No"),
      getTextToLocalMapping("Site Number"), 
      getTextToLocalMapping("Owner Name"),
      {
        name: "propertyId",
        options: {
          display: false,
          viewColumns: false
        }
      }
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
  const type = getQueryArg(window.location.href, "type")
  window.location.href = process.env.REACT_APP_NAME === "Citizen" ? `estate-branch-apply?propertyId=${rowData[4]}` : `_apply?propertyId=${rowData[4]}&applicationType=${type}`
  // window.location.href = `apply?propertyId=${rowData[4]}&applicationType=${type}`;
};