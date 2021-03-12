import React from "react";
import { sortByEpoch, getEpochForDate } from "../../utils";
import './index.css'
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
          case "ActionType":
            return getLocaleLabels(
              "ActionType",
              "Action Type",
              localisationLabels
            );
            case"billGenerationId":
            return getLocaleLabels(
              "billGenerationId",
              "billGenerationId",
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

export const searchApplicationResults = {
  uiFramework: "custom-molecules",
  componentPath: "Table",
  visible: false,
  props: {
    columns: [
      {
        name: getTextToLocalMapping("Consumer No"),
        options: {
          filter: false,
          customBodyRender: (value, data) => {
            if (data.rowData[0] !== "NA" && data.rowData[0] !== null) {
              return (
                <div className="linkStyle" onClick={() => getConnectionDetails(data)}>
                  <a>{value}</a>
                </div>
              )
            } else {
              return (
                <p>{value}</p>
              )
            }
          }
        }
      },
      {
        name: getTextToLocalMapping("Application No"),
        options: {
          filter: false,
          customBodyRender: (value, data) => {
            if (data.rowData[1] !== "NA" && data.rowData[1] !== null) {
              return (
                <div className="linkStyle" onClick={() => getApplicationDetails(data)}>
                  <a>{value}</a>
                </div>
              )
            } else {
              return (
                <p>{value}</p>
              )
            }
          }
        }
      },
      {
        name: getTextToLocalMapping("Application Type"),
        options: {
          filter: false,
          customBodyRender: value => (
            <span style={{ color: '#000000' }}>
              {value}
            </span>
          )
        }
      },
      getTextToLocalMapping("Owner Name"),
      getTextToLocalMapping("Application Status"),
      getTextToLocalMapping("Address"),
      {
        name: getTextToLocalMapping("Action"),
        options: {
          filter: false,
          customBodyRender: (value, data) => {
           // if (data.rowData[4] > 0 && data.rowData[4] !== 0) {
              if ((data.rowData[4] > 0 && data.rowData[4] !== 0) &&(data.rowData[3] !== undefined? data.rowData[3].toUpperCase() !== "INITIATED":'')) {
              return (
                <div className="linkStyle" onClick={() => getViewBillDetails(data)} style={{ color: '#fe7a51', textTransform: 'uppercase' }}>
                  <LabelContainer
                    labelKey="WS_COMMON_COLLECT_LABEL"
                    style={{
                      color: "#fe7a51",
                      fontSize: 14,
                    }}
                  />
                </div>
              )
            } else if (data.rowData[4] === 0) {
              return (
                <div style={{ textTransform: 'uppercase',color: "#008000", }}>
                  Paid
                </div>
              )
            }
            else {
              return ("NA")
            }
          }
        }
      },
      {
        name:   getTextToLocalMapping("tenantId"),
        options: {
          display: false
        }
      },
      {
        name:  getTextToLocalMapping("service"), 
        options: {
          display: false
        }
      },
      {
        name:   getTextToLocalMapping("connectionType"),
        options: {
          display: false
        }
      },
      {
        name:   getTextToLocalMapping("ActionType"),
        options: {
          display: false
        }
      },
      {
        name: getTextToLocalMapping("billGenerationId"),
        options: {
          display: false
        }
      }
    ],
    title: getTextToLocalMapping("Search Results for Water & Sewerage Application"),
    options: {
      filter: false,
      download: false,
      responsive: "stacked",
      selectableRows: false,
      hover: true,
      rowsPerPageOptions: [10, 15, 20]
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
  }
};

const getApplicationDetails = data => {
  const activityType = data.rowData[9]
  if(activityType){
    switch(activityType.toUpperCase()){
      case "NEW_WS_CONNECTION":  window.localStorage.setItem("wns_workflow","REGULARWSCONNECTION"); break;
      case "APPLY_FOR_TEMPORARY_CONNECTION":  window.localStorage.setItem("wns_workflow","TEMPORARY_WSCONNECTION"); break;
      case "APPLY_FOR_TEMPORARY_TEMPORARY_CONNECTION":  window.localStorage.setItem("wns_workflow","WS_TEMP_TEMP"); break;
      case "APPLY_FOR_TEMPORARY_REGULAR_CONNECTION":  window.localStorage.setItem("wns_workflow","WS_TEMP_REGULAR"); break;
      case "PERMANENT_DISCONNECTION":  window.localStorage.setItem("wns_workflow","WS_DISCONNECTION"); break;        
      case "TEMPORARY_DISCONNECTION":  window.localStorage.setItem("wns_workflow","WS_TEMP_DISCONNECTION"); break;
      case "UPDATE_CONNECTION_HOLDER_INFO":  window.localStorage.setItem("wns_workflow","WS_RENAME"); break;
      case "CONNECTION_CONVERSION":  window.localStorage.setItem("wns_workflow","WS_CONVERSION"); break;
      case "REACTIVATE_CONNECTION":  window.localStorage.setItem("wns_workflow","WS_REACTIVATE"); break;
      case "NEW_TUBEWELL_CONNECTION":  window.localStorage.setItem("wns_workflow","WS_TUBEWELL"); break;
      //case "CONNECTION_CONVERSION":  window.localStorage.setItem("wns_workflow","WS_TUBEWELL"); break;
    }
}

  window.location.href = `search-preview?applicationNumber=${data.rowData[1]}&tenantId=${data.rowData[7]}&history=true&service=${data.rowData[8]}`
}

const getConnectionDetails = data => {
  window.location.href = `connection-details?connectionNumber=${data.rowData[0]}&tenantId=${data.rowData[7]}&service=${data.rowData[8]}&connectionType=${data.rowData[9]}`
}
const getViewBillDetails = data => {
  window.location.href = `viewBill?connectionNumber=${data.rowData[1]}&tenantId=${data.rowData[7]}&service=${data.rowData[8]}&connectionType=${data.rowData[9]}&id=${data.rowData[11]}`
}