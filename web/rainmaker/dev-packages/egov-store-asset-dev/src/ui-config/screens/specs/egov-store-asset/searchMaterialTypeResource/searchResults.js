import {
  getLocaleLabels,
  getTransformedLocalStorgaeLabels,
} from "egov-ui-framework/ui-utils/commons";
import { getTenantId } from "egov-ui-kit/utils/localStorageUtils"; 
export const getTextToLocalMapping = (label) => {
  const localisationLabels = getTransformedLocalStorgaeLabels();
  switch (label) {
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
    case "Active":
      return getLocaleLabels(
        "Active",
        "STORE_COMMON_TABLE_COL_ACTIVE",
        localisationLabels
      );
      case "Code":
        return getLocaleLabels(
          "Code",
          "STORE_MATERIAL_TYPE_CODE",
          localisationLabels
        );
    case "Search Results for Material Type":
      return getLocaleLabels(
        "Search Results for Material Type",
        "STORE_MATERIAL_SEARCH_RESULTS_TABLE_HEADING",
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
      getTextToLocalMapping("Material Type Name"),
      getTextToLocalMapping("Material Type Description"),
      getTextToLocalMapping("Active"),
      {
        name: "code",
        options: {
          display: false
        }
      }
    ],
    title: getTextToLocalMapping("Search Results for Material Type"),
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
  window.location.href = `view-material-type?tenantId=${getTenantId()}&code=${rowData[3]}`;
};


