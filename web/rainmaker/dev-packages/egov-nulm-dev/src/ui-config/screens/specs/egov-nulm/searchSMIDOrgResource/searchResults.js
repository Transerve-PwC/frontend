import {
  getLocaleLabels,
  getTransformedLocalStorgaeLabels,
} from "egov-ui-framework/ui-utils/commons";
import { getTenantId,getUserInfo } from "egov-ui-kit/utils/localStorageUtils"; 
export const getTextToLocalMapping = (label) => {
  const localisationLabels = getTransformedLocalStorgaeLabels();
  switch (label) {
    case "Application Id":
      return getLocaleLabels(
        "Application Id",
        "NULM_SEP_APPLICATION_ID",
        localisationLabels
      );
      case "SHG Name":
        return getLocaleLabels(
          "SHG Name",
          "NULM_SHG_NAME",
          localisationLabels
        );
    case "Application Status":
      return getLocaleLabels(
        "Application Status",
        "NULM_SEP_APPLICATION_STATUS",
        localisationLabels
      );
    case "Active":
      return getLocaleLabels(
        "Active",
        "STORE_COMMON_TABLE_COL_ACTIVE",
        localisationLabels
      );
      case "Creation Date":
      return getLocaleLabels(
        "Creation Date",
        "NULM_SEP_CREATION_DATE",
        localisationLabels
      );
      case "Code":
        return getLocaleLabels(
          "Code",
          "STORE_MATERIAL_TYPE_CODE",
          localisationLabels
        );
    case "Search Results for SMID Organization":
      return getLocaleLabels(
        "Search Results for SMID Organization",
        "NULM_SHG_SEARCH_RESULTS_TABLE_HEADING",
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
      getTextToLocalMapping("Application Id"),
      getTextToLocalMapping("SHG Name"),
      getTextToLocalMapping("Application Status"),
      getTextToLocalMapping("Creation Date"),
      {
        name: "code",
        options: {
          display: false
        }
      }
    ],
    title: getTextToLocalMapping("Search Results for SMID Organization"),
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
  const tenantId = process.env.REACT_APP_NAME === "Employee" ?  getTenantId() : JSON.parse(getUserInfo()).permanentCity;
  window.location.href = `view-smid-org?tenantId=${tenantId}&applicationNumber=${rowData[0]}&status=${rowData[2]}&id=${rowData[4]}`;
};


