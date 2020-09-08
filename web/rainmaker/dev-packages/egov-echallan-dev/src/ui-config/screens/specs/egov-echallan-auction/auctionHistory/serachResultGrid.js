import "./index.css"
import {
  sortByEpoch,
  getEpochForDate,
  getTextToLocalMappingManageChallan,
  getTextToLocalMappingAuctionDetailGrid
} from "../../utils";

export const AuctionGridHistoryDetails = {
  uiFramework: "custom-molecules-local",
  moduleName: "egov-echallan",
  componentPath: "CustomizeTable",
  visible: true,
  props: {
    data: [],
    columns: [
      {
        name: getTextToLocalMappingAuctionDetailGrid("itemName"),
        label: getTextToLocalMappingAuctionDetailGrid("itemName"),
        options: {
          filter: true,
        }
      },
      {
        name: getTextToLocalMappingAuctionDetailGrid("`purchaserName`"),
        label: getTextToLocalMappingAuctionDetailGrid("purchaserName"),
        options: {
          filter: true,
        }
      },   {
        name: getTextToLocalMappingAuctionDetailGrid("auctionDate"),
        label: getTextToLocalMappingAuctionDetailGrid("auctionDate"),
        options: {
          filter: true,
        }
      },
      {
        name: getTextToLocalMappingAuctionDetailGrid("auctionQuantity"),
        label: getTextToLocalMappingAuctionDetailGrid("covNo"),
        options: {
          filter: true,
        }
      },
      {
        name: getTextToLocalMappingAuctionDetailGrid("purchaserContactNo"),
        label: getTextToLocalMappingAuctionDetailGrid("purchaserContactNo"),
        options: {
          filter: true,
        }
      },
      {
        name: getTextToLocalMappingAuctionDetailGrid("auctionAmount"),
        label: getTextToLocalMappingAuctionDetailGrid("auctionAmount"),
        options: {
          filter: true,
        }
      },
      {
        name: getTextToLocalMappingAuctionDetailGrid("status"),
        label: getTextToLocalMappingAuctionDetailGrid("status"),
        options: {
          filter: true,
        }
      },
    ],
    options: {
      filter: false,
      print: false,
      download: false,
      viewColumns: false,
      responsive: 'scroll',
      selectableRows: false,
      disableToolbarSelect: true,
      resizableColumns: false,
      hover: true,
      customToolbar: null,
      filterType: 'dropdown',
      fixedHeaderOptions: {
        xAxis: true,
        yAxis: true
      },
      rowsPerPageOptions: [10, 15, 20],
      onRowClick: (row, index) => {
        //onRowClick(row);
      },
    },
  }
};