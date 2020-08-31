import React from "react";
import { sortByEpoch, getEpochForDate } from "../../utils";
import { Link } from "react-router-dom"
import LabelContainer from "egov-ui-framework/ui-containers/LabelContainer";
import "./index.css";
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
    case "Search Results for Water & Sewerage Connections":
      return getLocaleLabels(
        "Search Results for Water & Sewerage Connections",
        "WS_HOME_SEARCH_RESULTS_TABLE_HEADING",
        localisationLabels
      );
  }
};




export const searchResults = {
  uiFramework: "custom-molecules",
  moduleName: "egov-wns",
  componentPath: "Table",
  visible: false,
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
      getTextToLocalMapping("Consumer No"),
      getTextToLocalMapping("Owner Name"),
      getTextToLocalMapping("Status"),
      getTextToLocalMapping("Due"),
      getTextToLocalMapping("Address"),
      getTextToLocalMapping("Due Date"),
      {
        name: getTextToLocalMapping("Action"),
        options: {
          filter: false,
          customBodyRender: (value, data) => {
            if (data.rowData[4] > 0 && data.rowData[4] !== 0) {
              return (
                // <Link
                //   to={`/wns/viewBill?connectionNumber=${data.rowData[1]}&tenantId=${data.rowData[8]}&service=${data.rowData[0]}`}
                //   style={{ color: '#fe7a51', textTransform: 'uppercase' }}>
                //   Pay now
                // </Link>
                <div className="linkStyle" onClick={() => getViewBillDetails(data)} style={{ color: '#fe7a51', textTransform: 'uppercase' }}>
                  <LabelContainer
                    labelKey="CS_COMMON_PAY"
                    style={{
                      color: "#fe7a51",
                      fontSize: 14,
                    }}
                  />
                </div>
              )
            } else if (data.rowData[5] === 0) {
              return (
                <div style={{ color: '#008000', textTransform: 'uppercase', fontWeight: 400 }}>
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
        name: getTextToLocalMapping("tenantId"),
        labelKey: "WS_COMMON_TABLE_COL_TENANTID_LABEL",
        options: {
          display: false
        }
      },
      {
        name: getTextToLocalMapping("connectionType"),
        labelKey: "WS_COMMON_TABLE_COL_CONNECTIONTYPE_LABEL",
        options: {
          display: false
        }
      }
    ],
    title: getTextToLocalMapping("Search Results for Water & Sewerage Connections"),
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


const getViewBillDetails = data => {
  window.location.href = `/citizen/wns/viewBill?connectionNumber=${data.rowData[1]}&tenantId=${data.rowData[8]}&service=${data.rowData[0]}&connectionType=${data.rowData[9]}`
}
