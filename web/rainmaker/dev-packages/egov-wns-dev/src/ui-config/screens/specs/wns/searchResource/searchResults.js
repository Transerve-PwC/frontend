import React from "react";
import { sortByEpoch, getEpochForDate } from "../../utils";
import './index.css'
import {getTextToLocalMapping} from "./searchApplicationResults"
import LabelContainer from "egov-ui-framework/ui-containers/LabelContainer";
import {
  getLocaleLabels,
  getTransformedLocalStorgaeLabels,
} from "egov-ui-framework/ui-utils/commons";
const localisationLabels = getTransformedLocalStorgaeLabels();

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
      getTextToLocalMapping("Due"),
      getTextToLocalMapping("Address"),
      getTextToLocalMapping("Due Date"),

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
    title: getLocaleLabels("Search Results for Water & Sewerage Connections", "WS_HOME_SEARCH_RESULTS_TABLE_HEADING", localisationLabels),
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

const getConnectionDetails = data => {
  window.location.href = `connection-details?connectionNumber=${data.rowData[1]}&tenantId=${data.rowData[8]}&service=${data.rowData[0]}&connectionType=${data.rowData[9]}`
}

const getViewBillDetails = data => {
  window.location.href = `viewBill?connectionNumber=${data.rowData[1]}&tenantId=${data.rowData[8]}&service=${data.rowData[0]}&connectionType=${data.rowData[9]}`
}