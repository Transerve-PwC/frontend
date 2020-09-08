import {
  getLocaleLabels,
  getTransformedLocalStorgaeLabels,
} from "egov-ui-framework/ui-utils/commons";
import { getTenantId} from "egov-ui-kit/utils/localStorageUtils";
export const getTextToLocalMapping = (label) => {
  const localisationLabels = getTransformedLocalStorgaeLabels();
  switch (label) {
    case "Indent Issue No":
      return getLocaleLabels(
        "Indent Issue No",
        "STORE_MATERIAL_INDENT_NOTE_ISSUE_NOTE_NUMBER",
        localisationLabels
      );
//Raised By
case "Raised By":
      return getLocaleLabels(
        "Raised By",
        "STORE_MATERIAL_INDENT_RAISED_BY",
        localisationLabels
      );
      case "Issue Date":
        return getLocaleLabels(
          "Issue Date",
          "STORE_MATERIAL_INDENT_NOTE_ISSUE_DATE",
          localisationLabels
        );
    case "Indenting Store Name":
      return getLocaleLabels(
        "Indenting Store Name",
        "STORE_DETAILS_STORE_NAME",
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
   
    case "Search Results for Material Indent Note":
      return getLocaleLabels(
        "Search Results for Material Indent Note",
        "STORE_MATERIAL_INDENT_NOTE_SEARCH_RESULTS_TABLE_HEADING",
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
      getTextToLocalMapping("Indent Issue No"),
      getTextToLocalMapping("Issue Date"),
      getTextToLocalMapping("Indenting Store Name"),     
      //getTextToLocalMapping("Indent Purpose"),
      getTextToLocalMapping("Status"),
      {
        name: "id",
        options: {
          display: false
        }
      },
    ],
    title: getTextToLocalMapping("Search Results for Material Indent Note"),
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
//  window.location.href = `view-indent-note?issueNumber=${rowData[0]}&IndentId=${rowData[4]}&tenantId=${tenantId}&Status=${rowData[3]}`;
window.location.href = `view-indent-note?applicationNumber=${rowData[0]}&tenantId=${tenantId}&Status=${rowData[3]}`;
};


