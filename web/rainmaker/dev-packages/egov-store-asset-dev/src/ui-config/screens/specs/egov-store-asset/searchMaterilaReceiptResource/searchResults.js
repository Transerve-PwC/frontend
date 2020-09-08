import {
  getLocaleLabels,
  getTransformedLocalStorgaeLabels,
} from "egov-ui-framework/ui-utils/commons";
import { getTenantId} from "egov-ui-kit/utils/localStorageUtils";
export const getTextToLocalMapping = (label) => {
  const localisationLabels = getTransformedLocalStorgaeLabels();
  switch (label) {
    case "mrnNumber":
      return getLocaleLabels(
        "mrnNumber",
        "STORE_MATERIAL_COMMON_MRN_NUMBER",
        localisationLabels
      );

      case "receipt Date":
        return getLocaleLabels(
          "receipt Date",
          "STORE_MATERIAL_RECEIPT_RECEIPT_DATE ",
          localisationLabels
        );
    case "receiving Store Name":
      return getLocaleLabels(
        "receiving Store Name",
        "STORE_MATERIAL_RECEVING_STORE_NAME",
        localisationLabels
      );
      case "Indent Purpose":
        return getLocaleLabels(
          "Indent Purpose",
          "STORE_MATERIAL_INDENT_INDENT_PURPOSE",
          localisationLabels
        );
        case "Status":
          return getLocaleLabels(
            "Status",
            "STORE_MATERIAL_INDENT_NOTE_STATUS",
            localisationLabels
          );
   
    case "Search Results for Material Receipt":
      return getLocaleLabels(
        "Search Results for Material Receipt",
        "STORE_MATERIAL_RECEIPT_SEARCH_RESULTS_TABLE_HEADING",
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
      getTextToLocalMapping("mrnNumber"),
      getTextToLocalMapping("receipt Date"),
      getTextToLocalMapping("receiving Store Name"),     
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
  //window.location.href = `view-material-receipt-note?id=${rowData[4]}&tenantId=${tenantId}&Status=${rowData[3]}&mrnNumber=${rowData[0]}`;
  window.location.href = `view-material-receipt-note?applicationNumber=${rowData[0]}&tenantId=${tenantId}&Status=${rowData[3]}`;
};


