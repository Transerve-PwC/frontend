import React from "react";
import {
  sortByEpoch,
  getEpochForDate,
} from "../../utils";
import { getTextToLocalMapping } from "./searchFunctions";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";

export const searchResultsAccountStatement = {
  uiFramework: "custom-molecules",
  moduleName: "egov-estate",
  componentPath: "Table",
  visible: true,
  props: {
    columns: [
        getTextToLocalMapping("Month"),
        getTextToLocalMapping("Rent Due"),
        getTextToLocalMapping("Receipt No."),
        getTextToLocalMapping("Date"),
        getTextToLocalMapping("Penalty/Interest"),
        getTextToLocalMapping("ST/GST rate"),
        getTextToLocalMapping("Paid"),
        getTextToLocalMapping("Date of Receipt"),
        getTextToLocalMapping("No. of days"),
        getTextToLocalMapping("Int. on delayed payment of GST"),
      {
        name: "propertyId",
        options: {
          display: true,
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

// const onRowClick = rowData => {
//   const type = getQueryArg(window.location.href, "type")
//   window.location.href = process.env.REACT_APP_NAME === "Citizen" ? `estate-branch-apply?propertyId=${rowData[4]}` : `apply?propertyId=${rowData[4]}&applicationType=${type}`
//   // window.location.href = `apply?propertyId=${rowData[4]}&applicationType=${type}`;
// };