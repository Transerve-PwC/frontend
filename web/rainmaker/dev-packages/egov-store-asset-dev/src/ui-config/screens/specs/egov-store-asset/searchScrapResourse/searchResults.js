import {
  getLocaleLabels,
  getTransformedLocalStorgaeLabels,
} from "egov-ui-framework/ui-utils/commons";
import { getTenantId } from "egov-ui-kit/utils/localStorageUtils"; 
export const getTextToLocalMapping = (label) => {
  const localisationLabels = getTransformedLocalStorgaeLabels();
  switch (label) {
    case "Scrap Number":
      return getLocaleLabels(
        "Scrap Number",
        "STORE_SCRAP_NUMBER",
        localisationLabels
      );
    case "Scrap Date":
      return getLocaleLabels(
        "Scrap Date",
        "STORE_SCRAP_DATE",
        localisationLabels
      );
    case "Store Name":
      return getLocaleLabels(
        "Store Name",
        "STORE_DETAILS_STORE_NAME",
        localisationLabels
      );
      case "Scrap Status":
        return getLocaleLabels(
          "Scrap Status",
          "STORE_SCRAP_STATUS",
          localisationLabels
        );
     
    case "Search Results for Scrap Material":
      return getLocaleLabels(
        "Search Results for Scrap Material",
        "STORE_SCRAP_SEARCH_RESULTS_TABLE_HEADING",
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
      getTextToLocalMapping("Scrap Number"),
      getTextToLocalMapping("Scrap Date"),
      getTextToLocalMapping("Store Name"),
      getTextToLocalMapping("Scrap Status"),
    ],
    title: getTextToLocalMapping("Search Results for Scrap Material"),
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
  window.location.href = `view-scrap-material?tenantId=${getTenantId()}&scrapNumber=${rowData[0]}`;
};


