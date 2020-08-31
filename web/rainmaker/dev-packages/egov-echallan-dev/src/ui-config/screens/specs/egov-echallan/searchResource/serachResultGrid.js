import React from "react"
import "./index.css"
import {
  sortByEpoch,
  getEpochForDate,
  getTextToLocalMappingManageChallan,

} from "../../utils";

export const serachResultGrid = {
  uiFramework: "custom-molecules-local",
  moduleName: "egov-echallan",
  componentPath: "CustomizeTable",
  id:"tableSIManageChallan",
  visible: true,
  props: {
    data: [],
    columns: [
      {
        name: getTextToLocalMappingManageChallan("challanId"),
        label: getTextToLocalMappingManageChallan("challanId"),
        options: {
          filter: true,
        }
      },
      {
        name: getTextToLocalMappingManageChallan("encroachmentType"),
        label: getTextToLocalMappingManageChallan("encroachmentType"),
        options: {
          filter: true,
        }
      }, {
        name: getTextToLocalMappingManageChallan("violationDate"),
        label: getTextToLocalMappingManageChallan("violationDate"),
        options: {
          filter: true,
        }
      }, {
        name: getTextToLocalMappingManageChallan("violatorName"),
        label: getTextToLocalMappingManageChallan("violatorName"),
        options: {
          filter: true,
        }
      }, {
        name: getTextToLocalMappingManageChallan("sector"),
        label: getTextToLocalMappingManageChallan("sector"),
        options: {
          filter: true,
          display: false,
        }
      }, {
        name: getTextToLocalMappingManageChallan("contactNumber"),
        label: getTextToLocalMappingManageChallan("contactNumber"),
        options: {
          filter: true,
        }
      }, {
        name: getTextToLocalMappingManageChallan("siName"),
        label: getTextToLocalMappingManageChallan("siName"),
        options: {
          filter: true,
          display: false,
        }
      }, {
        name: getTextToLocalMappingManageChallan("status"),
        label: getTextToLocalMappingManageChallan("status"),
        options: {
          filter: true,
        }
      },
      {
        name: getTextToLocalMappingManageChallan("tenantId"),
        label: getTextToLocalMappingManageChallan("tenantId"),
        options: {
          filter: false,
          display: "excluded",
          download: false,
        }
      },
      {
        name: getTextToLocalMappingManageChallan("challanUuid"),
        label: getTextToLocalMappingManageChallan("challanUuid"),
        options: {
          filter: false,
          display: "excluded",
          download: false,
        }
      }, {
        name: getTextToLocalMappingManageChallan("gridpaymentstatus"),
        label: getTextToLocalMappingManageChallan("gridpaymentstatus"),
        options: {
          filter: true,
        }
      }

    ],
    title: getTextToLocalMappingManageChallan(
      "Search Results for Manage-Challan"
    ),

    options: {
      filter: true,
      viewColumns: true,
      print: true,
      download: true,
      responsive: 'scroll',
      selectableRows: false,
      disableToolbarSelect: true,
      resizableColumns: false,
      hover: true,
      filterType: 'dropdown',
      fixedHeaderOptions: {
        xAxis: false,
        yAxis: true
      },
      downloadOptions: {
        filename: "challan.csv",
        separator: ",",
        filterOptions: {
          useDisplayedColumnsOnly: true,
          useDisplayedRowsOnly: false,
        },
      },
      rowsPerPageOptions: [10, 15, 20],
      onRowClick: (row, index) => {
        onRowClick(row);
      },
      onTableChange: (action, tableState) => {
        
        console.log(action, tableState);
      
        switch (action) {
          case 'changePage':
            //this.changePage(tableState.page);
            break;
        }
      }
    },

    customSortColumn: {
      column: "Challan No",
      sortingFn: (data, i, challanNo) => {
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

const onRowClick = rowData => {

  switch (rowData[5]) {
    case "INITIATED":
      window.location.href = `apply?applicationNumber=${rowData[0]}&tenantId=${
        rowData[5]
        }`;
      break;
    default:
      window.location.href = `search-preview?applicationNumber=${
        rowData[0]
        }&tenantId=${rowData[8]}`; //&Key=${rowData[9]}`;
      break;
  }
};
