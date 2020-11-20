import {
  getLocaleLabels,
  getTransformedLocalStorgaeLabels,
} from "egov-ui-framework/ui-utils/commons";
import { getTenantId,getUserInfo } from "egov-ui-kit/utils/localStorageUtils"; 
export const getTextToLocalMapping = (label) => {
  const localisationLabels = getTransformedLocalStorgaeLabels();
  switch (label) {
    case "Property ID":
      return getLocaleLabels(
        "Property ID (UID)",
        "INTIGRATION_TH_PT_ID",
        localisationLabels
      );
      case "House No":
        return getLocaleLabels(
          "House No",
          "INTIGRATION_TH_PT_HOUSE",
          localisationLabels
        );
    case "Owner Name":
      return getLocaleLabels(
        "Owner Name",
        "INTIGRATION_TH_PT_OWNER_NAME",
        localisationLabels
      );
    case "Mobile No":
      return getLocaleLabels(
        "Mobile No",
        "INTIGRATION_TH_PT_MOBILE",
        localisationLabels
      );
      case "Creation Date":
      return getLocaleLabels(
        "Creation Date",
        "NULM_SEP_CREATION_DATE",
        localisationLabels
      );
      case "Code":
        return getLocaleLabels(
          "Code",
          "STORE_MATERIAL_TYPE_CODE",
          localisationLabels
        );
    case "Search Results for House":
      return getLocaleLabels(
        "Search Results for House",
        "INTIGRATION_SR_TH_PT_HOUSE",
        localisationLabels
      );
  }
};

export const searchResults = {
  uiFramework: "custom-molecules",
  componentPath: "Table",
  visible: true,
  props: {
    columns: [
      getTextToLocalMapping("Property ID"),
      getTextToLocalMapping("House No"),
      getTextToLocalMapping("Owner Name"),
      getTextToLocalMapping("Mobile No"),
      // {
      //   name: "code",
      //   options: {
      //     display: false
      //   }
      // }
    ],
    title: getTextToLocalMapping("Search Results for House"),
    options: {
      filter: false,
      download: false,
      responsive: "stacked",
      selectableRows: false,
      hover: true,
      rowsPerPageOptions: [10, 15, 20],
      onRowClick: (row, index) => {
        onRowClick(row);
      },
    },
  },
};

const onRowClick = (rowData) => {
 // const tenantId = "ch.chandigarh" // process.env.REACT_APP_NAME === "Employee" ?  getTenantId() : JSON.parse(getUserInfo()).permanentCity;
  window.location.href = `dashboardPT?propertyId=${rowData[0]}`;
};


