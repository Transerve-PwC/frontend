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
  const type = getQueryArg(window.location.href, "type");
  const branchType = getQueryArg(window.location.href, "branchType");
  if (branchType == "BUILDING_BRANCH") {
    window.location.href = `_apply?propertyId=${rowData[4]}&applicationType=${type}&fileNumber=${rowData[1]}`;
    return;
  }
  
  if(type === "payment") {
    window.location.href = process.env.REACT_APP_NAME === "Citizen" ? `/estate/estate-payment?propertyId=${rowData[4]}` : `estate-payment?propertyId=${rowData[4]}`
  }
  else if (type == "penalty") {
    window.location.href = `estate-penalty?fileNumber=${rowData[1]}`
  }
  else if (type == "refund") {
    window.location.href = `refund?fileNumber=${rowData[1]}`
  }
  else if(type == "account-statement"){
    window.location.href = `estate-search-account-statement?fileNumber=${rowData[1]}`
  }
  else {
    window.location.href = process.env.REACT_APP_NAME === "Citizen" ? `estate-branch-apply?propertyId=${rowData[4]}&fileNumber=${rowData[1]}` : `_apply?propertyId=${rowData[4]}&applicationType=${type}&fileNumber=${rowData[1]}`
  }
};