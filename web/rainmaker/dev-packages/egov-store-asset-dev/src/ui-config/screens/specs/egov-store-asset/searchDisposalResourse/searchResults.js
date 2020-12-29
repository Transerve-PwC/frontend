import {
  getLocaleLabels,
  getTransformedLocalStorgaeLabels,
} from "egov-ui-framework/ui-utils/commons";
import { getTenantId } from "egov-ui-kit/utils/localStorageUtils"; 
export const getTextToLocalMapping = (label) => {
  const localisationLabels = getTransformedLocalStorgaeLabels();
  switch (label) {
    case "Disposal Number":
      return getLocaleLabels(
        "Disposal Number",
        "STORE_DISPOSAL_NUMBER",
        localisationLabels
      );
    case "Disposal Date":
      return getLocaleLabels(
        "Disposal Date",
        "STORE_DISPOSAL_SCRAP_DATE",
        localisationLabels
      );
    case "Store Name":
      return getLocaleLabels(
        "Store Name",
        "STORE_DETAILS_STORE_NAME",
        localisationLabels
      );
      case "Disposal Status":
        return getLocaleLabels(
          "Disposal Status",
          "STORE_DISPOSAL_STATUS",
          localisationLabels
        );
     
    case "Search Results for Disposal Material":
      return getLocaleLabels(
        "Search Results for Disposal Material",
        "STORE_DISPOSAL_SEARCH_RESULTS_TABLE_HEADING",
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
      getTextToLocalMapping("Disposal Number"),
      getTextToLocalMapping("Disposal Date"),
      getTextToLocalMapping("Store Name"),
      getTextToLocalMapping("Disposal Status"),
    ],
    title: getTextToLocalMapping("Search Results for Disposal Material"),
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
    customSortColumn: {
      column: "Application Date",
      sortingFn: (data, i, sortDateOrder) => {
        const epochDates = data.reduce((acc, curr) => {
          acc.push([...curr, getEpochForDate(curr[4], "dayend")]);
          return acc;
        }, []);
        const order = sortDateOrder === "asc" ? true : false;
        const finalData = sortByEpoch(epochDates, !order).map(item => {
          item.pop();
          return item;
        });
        return { data: finalData, currentOrder: !order ? "asc" : "desc" };
      }
    }
  },
};

const onRowClick = (rowData) => {
  window.location.href = `view-dispose-scrap-material?tenantId=${getTenantId()}&disposalNumber=${rowData[0]}`;
};


