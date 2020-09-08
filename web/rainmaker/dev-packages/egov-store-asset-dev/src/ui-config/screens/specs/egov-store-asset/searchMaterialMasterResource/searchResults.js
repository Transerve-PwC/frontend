import {
  getLocaleLabels,
  getTransformedLocalStorgaeLabels,
} from "egov-ui-framework/ui-utils/commons";
import { getTenantId} from "egov-ui-kit/utils/localStorageUtils";
export const getTextToLocalMapping = (label) => {
  const localisationLabels = getTransformedLocalStorgaeLabels();
  switch (label) {
    case "Material Name":
      return getLocaleLabels(
        "Material Name",
        "STORE_MATERIAL_NAME",
        localisationLabels
      );

      case "Material Type Name":
        return getLocaleLabels(
          "Material Type Name",
          "STORE_COMMON_TABLE_COL_MATERIAL_TYPE_NAME",
          localisationLabels
        );
    case "Material Type Description":
      return getLocaleLabels(
        "Material Type Description",
        "STORE_COMMON_TABLE_COL_MATERIAL_DESC",
        localisationLabels
      );
      case "Parent Material Type Name":
        return getLocaleLabels(
          "Parent Material Type Name",
          "HR_COMMON_TABLE_COL_PRNT_MATERIAL_NAME",
          localisationLabels
        );
        case "Store Name":
          return getLocaleLabels(
            "Store Name",
            "STORE_COMMON_TABLE_COL_STORE_NAME",
            localisationLabels
          );
    case "Active":
      return getLocaleLabels(
        "Active",
        "STORE_COMMON_TABLE_COL_ACTIVE",
        localisationLabels
      );
    case "Search Results for Material Master":
      return getLocaleLabels(
        "Search Results for Material Master",
        "STORE_MATERIAL_MASTER_SEARCH_RESULTS_TABLE_HEADING",
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
      getTextToLocalMapping("Material Name"),
      getTextToLocalMapping("Material Type Name"),
      getTextToLocalMapping("Store Name"),     
      //getTextToLocalMapping("Active"),
      {
        name: "code",
        options: {
          display: false
        }
      },
    ],
    title: getTextToLocalMapping("Search Results for Material Master"),
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
  window.location.href = `view-material-master?code=${rowData[3]}&tenantId=${tenantId}`;
};


