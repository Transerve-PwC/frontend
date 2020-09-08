import {
  getLocaleLabels,
  getTransformedLocalStorgaeLabels,
} from "egov-ui-framework/ui-utils/commons";
import { getTenantId} from "egov-ui-kit/utils/localStorageUtils";
export const getTextToLocalMapping = (label) => {
  const localisationLabels = getTransformedLocalStorgaeLabels();
  switch (label) {
    case "Issue No.":
      return getLocaleLabels(
        "Issue No.",
        "STORE_COMMON_MRN_ISSUE_NUMBER",
        localisationLabels
      );

      case "Issue Date":
        return getLocaleLabels(
          "Issue Date",
          "STORE_MATERIAL_INDENT_NOTE_ISSUE_DATE",
          localisationLabels
        );
    case "From Store Name":
      return getLocaleLabels(
        "From Store Name",
        "STORE_DETAILS_STORE_NAME_FROM",
        localisationLabels
      );
      case "To Store Name":
        return getLocaleLabels(
          "To Store Name",
          "STORE_DETAILS_STORE_NAME_TO",
          localisationLabels
        );
        case "Status":
          return getLocaleLabels(
            "Status",
            "STORE_MATERIAL_INDENT_NOTE_STATUS",
            localisationLabels
          );
   
    case "Search Results for Material Indent Outword":
      return getLocaleLabels(
        "Search Results for Material Indent Outword",
        "STORE_MATERIAL_INDENT_OUTWORD_SEARCH_RESULTS_TABLE_HEADING",
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
      getTextToLocalMapping("Issue No."),
      getTextToLocalMapping("Issue Date"),
      getTextToLocalMapping("From Store Name"),     
      getTextToLocalMapping("To Store Name"),
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
//  window.location.href = `view-indent-outword?id=${rowData[5]}&tenantId=${tenantId}&issueNumber=${rowData[0]}&Status=${rowData[4]}`;
window.location.href = `view-indent-outword?applicationNumber=${rowData[0]}&tenantId=${tenantId}&Status=${rowData[4]}`;
};


