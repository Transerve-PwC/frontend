import {
  getLocaleLabels,
  getTransformedLocalStorgaeLabels,
} from "egov-ui-framework/ui-utils/commons";
import { getTenantId} from "egov-ui-kit/utils/localStorageUtils";
export const getTextToLocalMapping = (label) => {
  const localisationLabels = getTransformedLocalStorgaeLabels();
  switch (label) {
    case "Indent No.":
      return getLocaleLabels(
        "Indent No.",
        "STORE_MATERIAL_INDENT_NUMBER",
        localisationLabels
      );

      case "Indent Date":
        return getLocaleLabels(
          "Indent Date",
          "STORE_MATERIAL_INDENT_INDENT_DATE",
          localisationLabels
        );
    case "Indenting Store Name":
      return getLocaleLabels(
        "Indenting Store Name",
        "STORE_MATERIAL_INDENT_STORE_NAME",
        localisationLabels
      );
      case "Indent Purpose":
        return getLocaleLabels(
          "Indent Purpose",
          "STORE_MATERIAL_INDENT_INDENT_PURPOSE",
          localisationLabels
        );
        case "Indent Status":
          return getLocaleLabels(
            "Indent Status",
            "STORE_MATERIAL_INDENT_INDENT_STATUS",
            localisationLabels
          );
   
    case "Search Results for Material Indent":
      return getLocaleLabels(
        "Search Results for Material Indent",
        "STORE_MATERIAL_INDENT_SEARCH_RESULTS_TABLE_HEADING",
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
      getTextToLocalMapping("Indent No."),
      getTextToLocalMapping("Indent Date"),
      getTextToLocalMapping("Indenting Store Name"),     
      getTextToLocalMapping("Indent Purpose"),
      getTextToLocalMapping("Indent Status"),
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
  window.location.href = `view-indent?id=${rowData[5]}&tenantId=${tenantId}&indentNumber=${rowData[0]}&Status=${rowData[4]}`;
};


