// import {
//   getLocaleLabels,
//   getTransformedLocalStorgaeLabels,
// } from "egov-ui-framework/ui-utils/commons";
//import {getTextToLocalMapping} from "./searchApplicationResults"
import React from "react";
import { sortByEpoch, getEpochForDate } from "../../utils";
//import './index.css'
import { getTenantId,getUserInfo } from "egov-ui-kit/utils/localStorageUtils"; 
import LabelContainer from "egov-ui-framework/ui-containers/LabelContainer";
import {
  getLocaleLabels,
  getTransformedLocalStorgaeLabels,
} from "egov-ui-framework/ui-utils/commons";
const localisationLabels = getTransformedLocalStorgaeLabels();
export const getTextToLocalMapping = (label) => {
  switch (label) {
    case "Consumer No":
      return getLocaleLabels(
        "Consumer No",
        "WS_COMMON_TABLE_COL_CONSUMER_NO_LABEL",
        localisationLabels
      );
    case "Application No":
      return getLocaleLabels(
        "Application No",
        "WS_COMMON_TABLE_COL_APP_NO_LABEL",
        localisationLabels
      );
    case "Application Type":
      return getLocaleLabels(
        "Application Type",
        "WS_COMMON_TABLE_COL_APP_TYPE_LABEL",
        localisationLabels
      );
    case "Owner Name":
      return getLocaleLabels(
        "Owner Name",
        "WS_COMMON_TABLE_COL_OWN_NAME_LABEL",
        localisationLabels
      );
    case "Application Status":
      return getLocaleLabels(
        "Application Status",
        "WS_COMMON_TABLE_COL_APPLICATION_STATUS_LABEL",
        localisationLabels
      );
    case "Address":
      return getLocaleLabels(
        "Address",
        "WS_COMMON_TABLE_COL_ADDRESS",
        localisationLabels
      );
    case "tenantId":
      return getLocaleLabels(
        "tenantId",
        "WS_COMMON_TABLE_COL_TENANTID_LABEL",
        localisationLabels
      );
    case "service":
      return getLocaleLabels(
        "service",
        "WS_COMMON_TABLE_COL_SERVICE_LABEL",
        localisationLabels
      );
    case "connectionType":
      return getLocaleLabels(
        "connectionType",
        "WS_COMMON_TABLE_COL_CONNECTIONTYPE_LABEL",
        localisationLabels
      );
      case "Status":
        return getLocaleLabels(
          "Status",
          "WS_COMMON_TABLE_COL_STATUS_LABEL",
          localisationLabels
        );
      case "Due":
        return getLocaleLabels(
          "Due",
          "WS_COMMON_TABLE_COL_DUE_LABEL",
          localisationLabels
        );
        case "Due Date":
          return getLocaleLabels(
            "Due Date",
            "WS_COMMON_TABLE_COL_DUE_DATE_LABEL",
            localisationLabels
          );
        case "Action":
          return getLocaleLabels(
            "Action",
            "WS_COMMON_TABLE_COL_ACTION_LABEL",
            localisationLabels
          );
    case "Search Results for Water & Sewerage Application":
      return getLocaleLabels(
        "Search Results for Water & Sewerage Application",
        "WS_HOME_SEARCH_APPLICATION_RESULTS_TABLE_HEADING",
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
      {
        name: getTextToLocalMapping("service"),
        options: {
          filter: false,
          customBodyRender: value => (
            <span style={{ color: '#000000' }}>
              {value}
            </span>
          )
        }
      },
      {
        name:getTextToLocalMapping("Consumer No"),
        labelKey: "WS_COMMON_TABLE_COL_CONSUMER_NO_LABEL",
        options: {
          filter: false,
          customBodyRender: (value, index) => (
            <div className="linkStyle" onClick={() => getConnectionDetails(index)}>
              <a>{value}</a>
            </div>
          )
        }
      },
      getTextToLocalMapping("Owner Name"),
      getTextToLocalMapping("Status"),     
      getTextToLocalMapping("Address"),
      
      {
        name:  getTextToLocalMapping("tenantId"),
        options: {
          display: false
        }
      },
      {
        name: getTextToLocalMapping("connectionType"),
        options: {
          display: false
        }
      }
    ],
    title: getTextToLocalMapping("Search Results for House"),
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
 // const tenantId = "ch.chandigarh" // process.env.REACT_APP_NAME === "Employee" ?  getTenantId() : JSON.parse(getUserInfo()).permanentCity;
  //window.location.href = `dashboardPT?propertyId=${rowData[0]}`;
};


