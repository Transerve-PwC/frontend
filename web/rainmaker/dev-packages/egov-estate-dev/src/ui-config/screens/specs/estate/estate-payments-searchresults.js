import React from "react";
import { getTextToLocalMapping } from "../estate-citizen/citizenSearchResource/searchFunctions";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import { getSearchResults } from "./searchResource/estatePaymentApplication"
import { toggleSnackbar, prepareFinalObject, toggleSpinner } from "egov-ui-framework/ui-redux/screen-configuration/actions";

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
      onRowClick: (row, index, state, dispatch) => {
        onRowClick(row, state, dispatch);
      }
    //   onRowClick: (row, index) => {
    //     onRowClick(row);
    //   }
    }
  }
};

const onRowClick = (rowData, state, dispatch) => {
        const type = getQueryArg(window.location.href, "type")
        window.location.href = process.env.REACT_APP_NAME === "Citizen" ? `estate-branch-apply?propertyId=${rowData[4]}` : `estate-payment?fileNo=${rowData[1]}`
        // window.location.href = `apply?propertyId=${rowData[4]}&applicationType=${type}`;
        // let searchScreenObject = get(state.screenConfiguration.preparedFinalObject,"searchScreenFileNo", {})
        // for (var key in searchScreenObject) {
        //         queryObject.push({
        //           key: key,
        //           value: searchScreenObject[key].trim()
        //         });
        //   }
        //   const response = getSearchResults(queryObject);
        //   dispatch(prepareFinalObject("PropertiesData", response.Properties));
      
    
};

// const onRowClick = rowData => {
//     const type = getQueryArg(window.location.href, "type")
//     window.location.href = process.env.REACT_APP_NAME === "Citizen" ? `estate-branch-apply?propertyId=${rowData[4]}` : `estate-payment?propertyId=${rowData[4]}`
//     // window.location.href = `apply?propertyId=${rowData[4]}&applicationType=${type}`;
// };