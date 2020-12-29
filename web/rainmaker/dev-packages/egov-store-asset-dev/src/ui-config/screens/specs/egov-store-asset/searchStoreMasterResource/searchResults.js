import {
  getLocaleLabels,
  getTransformedLocalStorgaeLabels,
} from "egov-ui-framework/ui-utils/commons";
import { getTenantId } from "egov-ui-kit/utils/localStorageUtils"; 
export const getTextToLocalMapping = (label) => {
  const localisationLabels = getTransformedLocalStorgaeLabels();
  switch (label) {
    case "Store Name":
      return getLocaleLabels(
        "Store Name",
        "STORE_COMMON_TABLE_COL_STORE_NAME",
        localisationLabels
      );
    case "Department":
      return getLocaleLabels(
        "Department",
        "STORE_COMMON_TABLE_COL_DEPARTMENT",
        localisationLabels
      );
    case "Active":
      return getLocaleLabels(
        "Active",
        "STORE_COMMON_TABLE_COL_ACTIVE",
        localisationLabels
      );
    case "Central Store":
      return getLocaleLabels(
        "Central Store",
        "STORE_COMMON_TABLE_COL_CENTRAL_STORE",
        localisationLabels
      );
    case "Search Results for Store Master":
      return getLocaleLabels(
        "Search Results for Store Master",
        "STORE_MASTER_SEARCH_RESULTS_TABLE_HEADING",
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
      getTextToLocalMapping("Store Name"),
      getTextToLocalMapping("Department"),
      //getTextToLocalMapping("Central Store"),
      getTextToLocalMapping("Active"),
    ],
    title: getTextToLocalMapping("Search Results for Store Master"),
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
  window.location.href = `view-store?tenantId=${getTenantId()}&name=${rowData[0]}`;
};

