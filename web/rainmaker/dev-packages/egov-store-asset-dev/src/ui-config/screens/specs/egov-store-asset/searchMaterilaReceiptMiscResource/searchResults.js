import {
  getLocaleLabels,
  getTransformedLocalStorgaeLabels,
} from "egov-ui-framework/ui-utils/commons";
import { getTenantId} from "egov-ui-kit/utils/localStorageUtils";
export const getTextToLocalMapping = (label) => {
  const localisationLabels = getTransformedLocalStorgaeLabels();
  switch (label) {
    case "Material Receipt Number":
      return getLocaleLabels(
        "Material Receipt Number",
        "STORE_MATERIAL_COMMON_MRN_NUMBER",
        localisationLabels
      );

      case "Store Name":
        return getLocaleLabels(
          "Store Name",
          "STORE_DETAILS_STORE_NAME",
          localisationLabels
        );
    case "Receipt Type":
      return getLocaleLabels(
        "Receipt Type",
        "STORE_MATERIAL_RECEIPT_RECEIPT_TYPE",
        localisationLabels
      );
      case "Status":
        return getLocaleLabels(
          "Status",
          "STORE_MATERIAL_INDENT_NOTE_STATUS",
          localisationLabels
        );
       
   
    case "Search Results for Non-Indent Material Issue Note":
      return getLocaleLabels(
        "Search Results for Non-Indent Material Issue Note",
        "STORE_MATERIAL_MISC_SEARCH_RESULTS_TABLE_HEADING",
        localisationLabels
      );
  }
};

export const searchResults = {
  uiFramework: "custom-molecules",
  componentPath: "Table",
  visible: false,
  props: {
    columns: [
      getTextToLocalMapping("Material Receipt Number"),
      getTextToLocalMapping("Store Name"),
      getTextToLocalMapping("Receipt Type"),     
     // getTextToLocalMapping("Indent Purpose"),
      getTextToLocalMapping("Status"),
      {
        name: "id",
        options: {
          display: false
        }
      },
    ],
    title: getTextToLocalMapping("Search Results for Material Indent"),
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
  let tenantId = getTenantId();
  window.location.href = `view-material-receipt-note-misc?id=${rowData[4]}&tenantId=${tenantId}&Status=${rowData[3]}&mrnNumber=${rowData[0]}`;
};


