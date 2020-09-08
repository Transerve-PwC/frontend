import {
  getLocaleLabels,
  getTransformedLocalStorgaeLabels,
} from "egov-ui-framework/ui-utils/commons";
import { getTenantId,getUserInfo } from "egov-ui-kit/utils/localStorageUtils"; 
export const getTextToLocalMapping = (label) => {
  const localisationLabels = getTransformedLocalStorgaeLabels();
  switch (label) {
    case "Organization Name":
      return getLocaleLabels(
        "Organization Name",
        "NULM_NGO_REG_ORGANIZATION_NAME",
        localisationLabels
      );
      case "Registration number of the organization":
        return getLocaleLabels(
          "Registration number of the organization",
          "NULM_NGO_REG_NUMBER_OF_THE_ORG",
          localisationLabels
        );
    case "Name of authorized representative":
      return getLocaleLabels(
        "Name of authorized representative",
        "NULM_NGO_REG_NAME_OF_AUTHORIZED_REPRESENTATIVE",
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
    case "Search Results for Organization":
      return getLocaleLabels(
        "Search Results for Organization",
        "NULM_ORG_SEARCH_RESULTS_TABLE_HEADING",
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
      getTextToLocalMapping("Organization Name"),
      getTextToLocalMapping("Registration number of the organization"),
      getTextToLocalMapping("Name of authorized representative"),
      getTextToLocalMapping("Active"),
      {
        name: "code",
        options: {
          display: false
        }
      }
    ],
    title: getTextToLocalMapping("Search Results for Organization"),
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
  window.location.href = `view-organization?tenantId=${tenantId}&registerNo=${rowData[1]}&code=${rowData[4]}`;
};


