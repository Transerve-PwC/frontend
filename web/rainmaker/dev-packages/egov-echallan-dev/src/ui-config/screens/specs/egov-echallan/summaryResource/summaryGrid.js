import React from "react";
import "./index.css"
import {
  sortByEpoch,
  getEpochForDate,
  getTextToLocalMappingChallanSummary,
  getTextToLocalSeizedItemDetailHeader
} from "../../utils";
import FormControlLabel from '@material-ui/core/FormControlLabel';
import TextField from '@material-ui/core/TextField';
import get from "lodash/get";
import set from "lodash/set";
import store from "ui-redux/store";
import { toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";

export const searchResultsSummary = {
  uiFramework: "custom-molecules-local",
  moduleName: "egov-echallan",
  componentPath: "CustomizeTable",
  visible: true,
  props: {
    data: [],
    columns: [
      getTextToLocalMappingChallanSummary("itemName"),
      getTextToLocalMappingChallanSummary("quantity"),
      getTextToLocalMappingChallanSummary("remark"),
    ],
    title: getTextToLocalMappingChallanSummary("Seized_Item_List"),
    options: {
      filter: false,
      download: false,
      viewColumns: false,
      responsive: 'scroll',
      selectableRows: false,
      hover: true,
      print: false,
      rowsPerPageOptions: [10, 15, 20],
      onRowClick: (row, index) => {
        //onRowClick(row);
      }
    },

  }
};

export const searchVehicleResultsSummary = {

  uiFramework: "custom-molecules-local",
  moduleName: "egov-echallan",
  componentPath: "CustomizeTable",
  visible: false,
  props: {
    data: [],
    columns: [
      getTextToLocalMappingChallanSummary("itemName"),
      getTextToLocalMappingChallanSummary("vehicleType"),
      getTextToLocalMappingChallanSummary("vehicleNumber"),
      getTextToLocalMappingChallanSummary("quantity"),
      getTextToLocalMappingChallanSummary("remark"),
    ],
    title: getTextToLocalMappingChallanSummary("Seized_Item_List"),
    options: {
      filter: false,
      download: false,
      viewColumns: false,
      responsive: 'scroll',
      selectableRows: false,
      hover: true,
      print: false,
      rowsPerPageOptions: [10, 15, 20],
      onRowClick: (row, index) => {
        //onRowClick(row);
      }
    },

  }
};
//});


export const serachResultGridSM = {
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
        name: getTextToLocalSeizedItemDetailHeader("quantity"),
        label: getTextToLocalSeizedItemDetailHeader("quantity"),
        options: {
          filter: true,
          // customBodyRender: (value, tableMeta, updateValue) => (
          //   <FormControlLabel
          //     value={value}
          //     control={<TextField value={value} />}
          //     onChange={event => updateValue(event.target.value)}
          //   />
          // )
        }
      }, {
        name: getTextToLocalSeizedItemDetailHeader("siRemark"),
        label: getTextToLocalSeizedItemDetailHeader("siRemark"),
        options: {
          filter: true,
          // customBodyRender: (value, tableMeta, updateValue) => (
          //   <FormControlLabel
          //     value={value}
          //     control={<TextField value={value} />}
          //     onChange={event => updateValue(event.target.value)}
          //   />
          // )
        }
      }, {
        name: getTextToLocalSeizedItemDetailHeader("actualQtyRecd"),
        label: getTextToLocalSeizedItemDetailHeader("actualQtyRecd"),
        options: {
          filter: true,
          customBodyRender: (value, tableMeta, updateValue) => {

            return (
              <FormControlLabel
              style={{ fontSize: "medium", paddingLeft: "15px" }}
                control={<TextField value={value || ''} type='number' />}
                onChange={event => {
                  let state = store.getState();
                  if (parseInt(event.target.value) > parseInt(tableMeta.rowData[1])) {

                    let intactQtyGreaterMessage = getTextToLocalSeizedItemDetailHeader("intactQtyGreater");
                    store.dispatch(toggleSnackbar(true,
                      {
                        labelName: intactQtyGreaterMessage,
                        labelKey: ""
                      }, "warning"))
                    //window.alert(`Intact qty recd. cannot be greater then seized qty`);
                    updateValue(0);
                    set(state, `screenConfiguration.screenConfig["search-preview"].components.div.children.body.children.cardContent.children.searchResultsSummarySM.props.data[${tableMeta.rowIndex}][${tableMeta.columnIndex}]`, 0);
                  } else {
                    let DamageQty = parseInt(tableMeta.rowData[4]) === "" ? 0 : parseInt(tableMeta.rowData[4])
                    let sum = parseInt(event.target.value) + DamageQty
                    if (sum > parseInt(tableMeta.rowData[1])) {
                      let sumQtyGreaterMessage = getTextToLocalSeizedItemDetailHeader("sumQtyGreater");
                      store.dispatch(toggleSnackbar(true,
                        {
                          labelName: sumQtyGreaterMessage,
                          labelKey: ""
                        }, "warning"))
                      //window.alert(` Sum of Damage and Intact Qty cannot be greater then Seized Qty `);
                      updateValue(0);
                      set(state, `screenConfiguration.screenConfig["search-preview"].components.div.children.body.children.cardContent.children.searchResultsSummarySM.props.data[${tableMeta.rowIndex}][${tableMeta.columnIndex}]`, 0);
                    } else {
                      updateValue(event.target.value);

                      set(state, `screenConfiguration.screenConfig["search-preview"].components.div.children.body.children.cardContent.children.searchResultsSummarySM.props.data[${tableMeta.rowIndex}][${tableMeta.columnIndex}]`, event.target.value);
                    }
                  }
                }}
              />
            )
          }
        }
      }, {
        name: getTextToLocalSeizedItemDetailHeader("damageLostQty"),
        label: getTextToLocalSeizedItemDetailHeader("damageLostQty"),
        options: {
          filter: true,
          customBodyRender: (value, tableMeta, updateValue) => (
            <FormControlLabel
              style={{ fontSize: "medium", paddingLeft: "15px" }}
              labelPlacement='end'
              control={<TextField value={value || ''} type='number' />}
              onChange={event => {
                let state = store.getState();
                let sum = (event.target.value === "" ? 0 : parseInt(event.target.value)) + parseInt(tableMeta.rowData[3])
                // if (parseInt(event.target.value) > parseInt(tableMeta.rowData[3])) {
                //   window.alert(`Defect/Damage Qty cannot be greater then Actual Qty`);
                //   set(state, `screenConfiguration.screenConfig["search-preview"].components.div.children.body.children.cardContent.children.searchResultsSummary.props.data[${tableMeta.rowIndex}][${tableMeta.columnIndex}]`, 0);
                //   updateValue(0);
                // } else {

                if (sum > parseInt(tableMeta.rowData[1])) {
                  let sumQtyGreaterMessage = getTextToLocalSeizedItemDetailHeader("sumQtyGreater");
                  store.dispatch(toggleSnackbar(true,
                    {
                      labelName: sumQtyGreaterMessage,
                      labelKey: ""
                    }, "warning"))
                  //window.alert(` Sum of Damage and Intact Qty cannot be greater then Seized Qty `);
                  updateValue(0);
                  set(state, `screenConfiguration.screenConfig["search-preview"].components.div.children.body.children.cardContent.children.searchResultsSummarySM.props.data[${tableMeta.rowIndex}][${tableMeta.columnIndex}]`, 0);
                } else if (parseInt(event.target.value) > parseInt(tableMeta.rowData[1])) {
                  let damageQtyGreaterMessage = getTextToLocalSeizedItemDetailHeader("damageQtyGreater");
                  store.dispatch(toggleSnackbar(true,
                    {
                      labelName: damageQtyGreaterMessage,
                      labelKey: ""
                    }, "warning"))
                  //window.alert(`Defect/Damage Qty cannot be greater then Seized Qty`);
                  set(state, `screenConfiguration.screenConfig["search-preview"].components.div.children.body.children.cardContent.children.searchResultsSummarySM.props.data[${tableMeta.rowIndex}][${tableMeta.columnIndex}]`, 0);
                  updateValue(0);
                }
                else if (sum < parseInt(tableMeta.rowData[1])) {
                  updateValue(event.target.value);
                  set(state, `screenConfiguration.screenConfig["search-preview"].components.div.children.body.children.cardContent.children.searchResultsSummarySM.props.data[${tableMeta.rowIndex}][${tableMeta.columnIndex}]`, 0);
                }
                else if (sum == parseInt(tableMeta.rowData[1])) {
                  updateValue(event.target.value);
                  set(state, `screenConfiguration.screenConfig["search-preview"].components.div.children.body.children.cardContent.children.searchResultsSummarySM.props.data[${tableMeta.rowIndex}][${tableMeta.columnIndex}]`, event.target.value);

                }
                //}

              }}
            />
          )
        }
      }, {
        name: getTextToLocalSeizedItemDetailHeader("smRemark"),
        label: getTextToLocalSeizedItemDetailHeader("smRemark"),
        options: {
          filter: true,
          customBodyRender: (value, tableMeta, updateValue) => (
            <FormControlLabel
            style={{ fontSize: "medium", paddingLeft: "15px" }}
              control={<TextField value={value || ''} type='string' inputProps={{ maxLength: 256 }} />}
              onChange={event => {
                let state = store.getState();
                updateValue(event.target.value)
                set(state, `screenConfiguration.screenConfig["search-preview"].components.div.children.body.children.cardContent.children.searchResultsSummarySM.props.data[${tableMeta.rowIndex}][${tableMeta.columnIndex}]`, event.target.value);
              }}
            />
          )
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
    title: getTextToLocalMappingChallanSummary("Seized_Item_List"),

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
        }&tenantId=${rowData[8]}`;
      break;
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
        name: getTextToLocalSeizedItemDetailHeader("quantity"),
        label: getTextToLocalSeizedItemDetailHeader("quantity"),
        options: {
          filter: true,
          // customBodyRender: (value, tableMeta, updateValue) => (
          //   <FormControlLabel
          //     value={value}
          //     control={<TextField value={value} />}
          //     onChange={event => updateValue(event.target.value)}
          //   />
          // )
        }
      }, {
        name: getTextToLocalSeizedItemDetailHeader("siRemark"),
        label: getTextToLocalSeizedItemDetailHeader("siRemark"),
        options: {
          filter: true,
          // customBodyRender: (value, tableMeta, updateValue) => (
          //   <FormControlLabel
          //     value={value}
          //     control={<TextField value={value} />}
          //     onChange={event => updateValue(event.target.value)}
          //   />
          // )
        }
      }, {
        name: getTextToLocalSeizedItemDetailHeader("actualQtyRecd"),
        label: getTextToLocalSeizedItemDetailHeader("actualQtyRecd"),
        options: {
          filter: true,

        }
      }, {
        name: getTextToLocalSeizedItemDetailHeader("damageLostQty"),
        label: getTextToLocalSeizedItemDetailHeader("damageLostQty"),
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
          download: false,
          display: 'excluded',
        }
      },
      {
        name: getTextToLocalSeizedItemDetailHeader("isAuctioned"),
        label: getTextToLocalSeizedItemDetailHeader("isAuctioned"),
        options: {
          visible: true,
          filter: true,
          download: false,
          display: 'excluded',
        }
      },
      {
        name: getTextToLocalSeizedItemDetailHeader("isReturned"),
        label: getTextToLocalSeizedItemDetailHeader("isReturned"),
        options: {
          visible: true,
          filter: true,
          download: false,
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
          download: false,
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
          download: false,
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
    title:
      "Seized Item Details"
    ,

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
      filterType: 'dropdown',
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