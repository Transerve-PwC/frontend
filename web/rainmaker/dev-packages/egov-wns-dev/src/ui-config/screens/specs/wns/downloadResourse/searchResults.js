import {
  getLocaleLabels,
  getTransformedLocalStorgaeLabels,
} from "egov-ui-framework/ui-utils/commons";
import { getTenantId } from "egov-ui-kit/utils/localStorageUtils"; 
export const getTextToLocalMapping = (label) => {
  const localisationLabels = getTransformedLocalStorgaeLabels();
  switch (label) {
    case "Col 1":
      return getLocaleLabels(
        "Col 1",
        "WS_COL1",
        localisationLabels
      );
    case "Col 2":
      return getLocaleLabels(
        "Col 3",
        "WS_COL2",
        localisationLabels
      );
    case "Store Name":
      return getLocaleLabels(
        "Store Name",
        "STORE_DETAILS_STORE_NAME",
        localisationLabels
      );
      case "PO Rate Type":
        return getLocaleLabels(
          "PO Rate Type",
          "STORE_PURCHASE_ORDER_RATETYPE",
          localisationLabels
        );
        case "Supplier":
      return getLocaleLabels(
        "Supplier",
        "STORE_SUPPLIER_MASTER_SUPPLIER_NAME",
        localisationLabels
      );
    case "Search Results for Bill Download":
      return getLocaleLabels(
        "Search Results for Bill Download",
        "WS_BILL_DOWNLOAD_RESULTS_TABLE_HEADING",
        localisationLabels
      );
      case "Download":
          return getLocaleLabels(
            "Download",
            "WS_DOWNLOAD",
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
      getTextToLocalMapping("Col 1"),
      getTextToLocalMapping("Col 2"),
      getTextToLocalMapping("Download"),
      // getTextToLocalMapping("PO Rate Type"),
      // getTextToLocalMapping("Supplier"),
      // getTextToLocalMapping("Status"),
    ],
    title: getTextToLocalMapping("Search Results for Bill Download"),
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
//  window.location.href = `view-purchase-order?tenantId=${getTenantId()}&poNumber=${rowData[0]}&Status=${rowData[5]}`;
window.location.href = `view-purchase-order?applicationNumber=${rowData[0]}&tenantId=${getTenantId()}&Status=${rowData[5]}`;
};


