import {
  getLocaleLabels,
  getTransformedLocalStorgaeLabels,
} from "egov-ui-framework/ui-utils/commons";
import { getTenantId } from "egov-ui-kit/utils/localStorageUtils"; 
export const getTextToLocalMapping = (label) => {
  const localisationLabels = getTransformedLocalStorgaeLabels();
  switch (label) {
    case "Purchase Order Number":
      return getLocaleLabels(
        "Purchase Order Number",
        "STORE_PURCHASE_ORDER_NUMBER",
        localisationLabels
      );
    case "PO Date":
      return getLocaleLabels(
        "PO Date",
        "STORE_PURCHASE_ORDER_DATE",
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
    case "Search Results for Purchase Order":
      return getLocaleLabels(
        "Search Results for Purchase Order",
        "STORE_PURCHASE_ORDR_SEARCH_RESULTS_TABLE_HEADING",
        localisationLabels
      );
      case "Status":
          return getLocaleLabels(
            "Status",
            "STORE_MATERIAL_INDENT_NOTE_STATUS",
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
      getTextToLocalMapping("Purchase Order Number"),
      getTextToLocalMapping("PO Date"),
      getTextToLocalMapping("Store Name"),
      getTextToLocalMapping("PO Rate Type"),
      getTextToLocalMapping("Supplier"),
      getTextToLocalMapping("Status"),
    ],
    title: getTextToLocalMapping("Search Results for Purchase Order"),
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
//  window.location.href = `view-purchase-order?tenantId=${getTenantId()}&poNumber=${rowData[0]}&Status=${rowData[5]}`;
window.location.href = `view-purchase-order?applicationNumber=${rowData[0]}&tenantId=${getTenantId()}&Status=${rowData[5]}`;
};


