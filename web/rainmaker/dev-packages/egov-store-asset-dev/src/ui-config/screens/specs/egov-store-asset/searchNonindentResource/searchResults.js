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
        "STORE_MATERIAL_INDENT_NOTE_ISSUE_NOTE_NUMBER",
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
        "STORE_MATERIAL_INDENT_STORE_NAME",
        localisationLabels
      );
      case "Issue Purpose":
        return getLocaleLabels(
          "Issue Purpose",
          "STORE_MATERIAL_INDENT_NOTE_ISSUE_PURPOSE",
          localisationLabels
        );
        case "Issue Status":
          return getLocaleLabels(
            "Issue Status",
            "STORE_MATERIAL_INDENT_NOTE_STATUS",
            localisationLabels
          );
   
    case "Search Results for Material Non Indent":
      return getLocaleLabels(
        "Search Results for Material Non Indent",
        "STORE_MATERIAL_NON_INDENT_SEARCH_RESULTS_TABLE_HEADING",
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
      //getTextToLocalMapping("Indenting Store Name"),     
      getTextToLocalMapping("Issue Purpose"),
      getTextToLocalMapping("Issue Status"),
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
//  window.location.href = `view-non-indent-issue-note?issueNoteNumber=${rowData[0]}&tenantId=${tenantId}&Status=${rowData[3]}`;
window.location.href = `view-non-indent-issue-note?applicationNumber=${rowData[0]}&tenantId=${tenantId}&Status=${rowData[3]}`;
};


