import {
  getLocaleLabels,
  getTransformedLocalStorgaeLabels,
} from "egov-ui-framework/ui-utils/commons";
import { getTenantId,getUserInfo } from "egov-ui-kit/utils/localStorageUtils"; 
export const getTextToLocalMapping = (label) => {
  const localisationLabels = getTransformedLocalStorgaeLabels();
  switch (label) {
    case "shelterRequestedForPerson":
      return getLocaleLabels(
        "shelterRequestedForPerson",
        "NULM_SUH_CITIZEN_SHELTER_PERSON_NAME",
        localisationLabels
      );
      case "reasonForStaying":
      return getLocaleLabels(
        "reasonForStaying",
        "NULM_SUH_LOG_REASON_FOR_STAY",
        localisationLabels
      );
      case "nominatedBy":
      return getLocaleLabels(
        "nominatedBy",
        "NULM_SUH_CITIZEN_SHELTER_NOMINATED_BY",
        localisationLabels
      );
      case "nameOfNominatedPerson":
      return getLocaleLabels(
        "nameOfNominatedPerson",
        "NULM_SUH_CITIZEN_SHELTER_NOMINEE_NAME",
        localisationLabels
      );
      case "contactNo":
      return getLocaleLabels(
        "contactNo",
        "NULM_SUH_CITIZEN_SHELTER_NOMINEE_CONTACT",
        localisationLabels
      );
      
        case "Search Results for SUH":
      return getLocaleLabels(
        "Search Results for SUH",
        "NULM_SUH_SEARCH_RESULTS_TABLE_HEADING",
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
      getTextToLocalMapping("shelterRequestedForPerson"),
      getTextToLocalMapping("reasonForStaying"),
      getTextToLocalMapping("nominatedBy"),
      getTextToLocalMapping("nameOfNominatedPerson"),
      getTextToLocalMapping("contactNo"),
      {
        name: "code",
        options: {
          display: false
        }
      }
    ],
    title: getTextToLocalMapping("Search Results for SUH"),
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
  const tenantId = "ch.chandigarh" // process.env.REACT_APP_NAME === "Employee" ?  getTenantId() : JSON.parse(getUserInfo()).permanentCity;
  window.location.href = `viewSuh?tenantId=${tenantId}&code=${rowData[5]}`;
};


