import React from "react";
import "./index.css"
import {
  sortByEpoch,
  getEpochForDate,
  getTextToLocalMappingChallanSummary,
  getTextToLocalSeizedItemDetailHeader,
  getTextToLocalMappingAuctionGrid
} from "../../utils";

export const searchResultsSummary = {
  uiFramework: "custom-molecules-local",
  moduleName: "egov-echallan",
  componentPath: "CustomizeTable",
  visible: true,
  props: {
    data: [],
    columns: [
      {
        name: getTextToLocalMappingAuctionGrid("itemName"),
        label: getTextToLocalMappingAuctionGrid("itemName"),
        options: {
          filter: false,         
        }
      },
      {
        name: getTextToLocalMappingAuctionGrid("seizedQty"),
        label: getTextToLocalMappingAuctionGrid("seizedQty"),
        options: {
          filter: false,         
        }
      }, 
      {
        name: getTextToLocalSeizedItemDetailHeader("actualQtyRecd"),
        label: getTextToLocalSeizedItemDetailHeader("actualQtyRecd"),
        options: {
          filter: false,
        }
      }, 
      {
        name: getTextToLocalMappingAuctionGrid("auctionDate"),
        label: getTextToLocalMappingAuctionGrid("auctionDate"),
        options: {
          filter: false,
        
        }
      },
      {
        name: getTextToLocalMappingAuctionGrid("purchaseName"),
        label:getTextToLocalMappingAuctionGrid("purchaseName"),
        options: {
          filter: false,
        
        }
      },
      {
        name: getTextToLocalMappingAuctionGrid("contactNumber"),
        label:getTextToLocalMappingAuctionGrid("contactNumber"),
        options: {
          filter: false,
        
        }
      }, 
      {
        name: getTextToLocalMappingAuctionGrid("purchaseQuantity"),
        label: getTextToLocalMappingAuctionGrid("purchaseQuantity"),
        options: {
          filter: false,
        
        }
      },
      {
        name: getTextToLocalMappingAuctionGrid("amount"),
        label:getTextToLocalMappingAuctionGrid("amount"),
        options: {
          filter: false,
        
        }
      } 
    ],
    title: getTextToLocalSeizedItemDetailHeader(
      "AUCTIONED_SEIZED_ITEM_DETAILS"
    ),

    options: {
      filter: false,
      print: false,
      download: false,
      // responsive: "scrollMaxHeight",
      viewColumns: false,
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
      rowsPerPageOptions: [10, 15, 20],
      
      onCellClick: (cellData, cellMeta) => {
    
        console.log(cellData, cellMeta);
      },
      customToolbarSelect: (selectedRows, displayData, setSelectedRows) => {
        
        onselect(selectedRows, displayData, setSelectedRows)

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

export const searchResultsSummaryHOD = {
  uiFramework: "custom-molecules-local",
  moduleName: "egov-echallan",
  componentPath: "CustomizeTable",
  visible: true,
  props: {
    data: [],
    columns: [
      {
        name: getTextToLocalSeizedItemDetailHeader("itemName"),
        label: getTextToLocalSeizedItemDetailHeader("itemName"),
        options: {
          filter: true,
          //setCellProps: () => ({style: {color:'black'}})
        }
      },
      {
        name: getTextToLocalSeizedItemDetailHeader("quantity"),
        label: getTextToLocalSeizedItemDetailHeader("quantity"),
        options: {
          filter: true,
       
        }
      }, {
        name: getTextToLocalSeizedItemDetailHeader("siRemark"),
        label: getTextToLocalSeizedItemDetailHeader("siRemark"),
        options: {
          filter: true,
          //setCellProps: () => ({style: {'word-wrap': 'break-word'}}) 
        }
      }, {
        name: getTextToLocalSeizedItemDetailHeader("storeQtyRecd"),
        label: getTextToLocalSeizedItemDetailHeader("storeQtyRecd"),
        options: {
          filter: true,
       
        }
      }, {
        name: getTextToLocalSeizedItemDetailHeader("availableQty"),
        label: getTextToLocalSeizedItemDetailHeader("availableQty"),
        options: {
          filter: true,
        
        }
      }, {
        name: getTextToLocalSeizedItemDetailHeader("smRemark"),
        label: getTextToLocalSeizedItemDetailHeader("smRemark"),
        options: {
          filter: true,
  
        }
      },
      {
        name: getTextToLocalSeizedItemDetailHeader("isVerified"),
        label: getTextToLocalSeizedItemDetailHeader("isVerified"),
        options: {
          visible: true,
          filter: true,
          display: 'excluded',
        }
      },
      {
        name: getTextToLocalSeizedItemDetailHeader("isAuctioned"),
        label: getTextToLocalSeizedItemDetailHeader("isAuctioned"),
        options: {
          visible: true,
          filter: true,
          display: 'excluded',
        }
      },
      {
        name: getTextToLocalSeizedItemDetailHeader("isReturned"),
        label: getTextToLocalSeizedItemDetailHeader("isReturned"),
        options: {
          visible: true,
          filter: true,
          display: 'excluded',
        }
      },
      {
        name: getTextToLocalSeizedItemDetailHeader("violationItemUuid"),
        label: getTextToLocalSeizedItemDetailHeader("violationItemUuid"),
        options: {
          visible: false,
          filter: true,
          display: 'excluded',
          // customBodyRender: (value, tableMeta, updateValue) => (
          //   <FormControlLabel
          //     value={value}
          //     control={<TextField value={value} />}
          //     onChange={event => updateValue(event.target.value)}
          //   />
          // )
        }
      },
      {
        name: getTextToLocalSeizedItemDetailHeader("violationUuid"),
        label: getTextToLocalSeizedItemDetailHeader("violationUuid"),
        options: {
          display: 'excluded',
          filter: true,
          // customBodyRender: (value, tableMeta, updateValue) => (
          //   <FormControlLabel
          //     value={value}
          //     control={<TextField value={value} />}
          //     onChange={event => updateValue(event.target.value)}
          //   />
          // )
        }
      },
    ],
    title: getTextToLocalSeizedItemDetailHeader(
      "SEIZED_ITEM_DETAILS"
    ),

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
      filterType: 'custom',
      fixedHeaderOptions: {
        xAxis: false,
        yAxis: true
      },
      rowsPerPageOptions: [10, 15, 20],
      //onRowClick: (row, index) => {
      // onRowClick(row);
      //},
      onCellClick: (cellData, cellMeta) => {
        
        // alert(cellData)
        // if (cellData.props !== undefined) {
        //   let state = store.getState();
        //   cellData.props.onRowClick
        //   let SeizedItemDetailList = get(
        //     state,
        //     "screenConfiguration.preparedFinalObject.eChallanSMSeizedList",
        //     {}
        //   );
        //   
        // }
        console.log(cellData, cellMeta);
      },
      customToolbarSelect: (selectedRows, displayData, setSelectedRows) => {
        
        onselect(selectedRows, displayData, setSelectedRows)

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