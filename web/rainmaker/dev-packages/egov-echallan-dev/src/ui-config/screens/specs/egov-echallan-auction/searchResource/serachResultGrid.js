import "./index.css"
import {
  sortByEpoch,
  getEpochForDate,
  getTextToLocalMappingManageChallan,
  getTextToLocalMappingAuctionDetailGrid
} from "../../utils";

export const serachResultGrid = {
  uiFramework: "custom-molecules-local",
  moduleName: "egov-echallan",
  componentPath: "CustomizeTable",
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
        }
      }, {
        name: getTextToLocalMappingManageChallan("status"),
        label: getTextToLocalMappingManageChallan("status"),
        options: {
          filter: true,
        }
      }, {
        name: getTextToLocalMappingManageChallan("tenantId"),
        label: getTextToLocalMappingManageChallan("tenantId"),
        options: {
          filter: false,
          download:false,
          display:"excluded",
        }
      },{
        name: getTextToLocalMappingManageChallan("challanUuid"),
        label: getTextToLocalMappingManageChallan("challanUuid"),
        options: {
          filter: false,
          download:false,
          display:"excluded",
        }
      },{
        name: getTextToLocalMappingManageChallan("auctionUuid"),
        label: getTextToLocalMappingManageChallan("auctionUuid"),
        options: {
          filter: false,
          download:false,
          display:"excluded",
          // customBodyRender: (value, tableMeta, updateValue) => (
          //   <FormControlLabel
          //     value={value}
          //     control={<TextField value={value} />}
          //     onChange={event => updateValue(event.target.value)}
          //   />
          // )
        }
      }
    ],
    title: getTextToLocalMappingManageChallan(
      "Search Results for Manage-Challan"
    ),

    options: {
      filter: true,
      print: true,
      download: true,
      // responsive: "scrollMaxHeight",
      viewColumns: true,
      responsive: 'scroll',
      selectableRows: false,
      disableToolbarSelect: true,
      resizableColumns: false,
      hover: true,
      filterType: 'dropdown',
      fixedHeaderOptions: {
        xAxis: true,
        yAxis: true
      },
      downloadOptions: {
        filename: "auctionMaster.csv",
        separator: ",",
        filterOptions: {
          useDisplayedColumnsOnly: true,
          useDisplayedRowsOnly: false,
        },
      },
      rowsPerPageOptions: [10, 15, 20],
      onRowClick: (row, index) => {
        onRowClick(row);
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
  console.log("rowData[10]",rowData[9],rowData[10])
  switch (rowData[7]) {
    case "PENDING FOR AUCTION":
      window.location.href = `search-preview?challanNumber=${rowData[9]}&tenantId=${
        rowData[8]
        }`;
      break;
    default:
      window.location.href = `search-preview?applicationNumber=${
        rowData[10]
        }&tenantId=${rowData[8]}`;
      break;
  }
};

