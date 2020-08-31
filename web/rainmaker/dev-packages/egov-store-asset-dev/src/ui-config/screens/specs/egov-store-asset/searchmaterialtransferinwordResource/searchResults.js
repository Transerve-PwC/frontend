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

      case "Receipt Date":
        return getLocaleLabels(
          "Receipt Date",
          "STORE_MATERIAL_RECEIPT_RECEIPT_DATE ",
          localisationLabels
        );
    case "Issuing Store Name":
      return getLocaleLabels(
        "Issuing Store Name",
        "STORE_MATERIAL_INDENT_NOTE_ISSUING_STORE_NAME",
        localisationLabels
      );
      case "Indenting Store":
        return getLocaleLabels(
          "Indenting Store",
          "STORE_MATERIAL_TRANSFER_INDENTING_STORE",
          localisationLabels
        );
        case "Status":
          return getLocaleLabels(
            "Status",
            "STORE_MATERIAL_INDENT_NOTE_STATUS",
            localisationLabels
          );
   
    case "Search Results for Material Indent Inword":
      return getLocaleLabels(
        "Search Results for Material Indent Inword",
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
      getTextToLocalMapping("Material Receipt Number"),
      getTextToLocalMapping("Receipt Date"),
      getTextToLocalMapping("Issuing Store Name"),     
      getTextToLocalMapping("Indenting Store"),
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
  window.location.href = `view-indent-inword?id=${rowData[5]}&tenantId=${tenantId}&mrnNumber=${rowData[0]}&Status=${rowData[4]}`;
};


