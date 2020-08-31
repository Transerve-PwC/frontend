import React from "react";
import FormControlLabel from '@material-ui/core/FormControlLabel';
import TextField from '@material-ui/core/TextField';
import { Link } from "react-router-dom";
import "./index.css"
import {
  sortByEpoch, getEpochForDate, getTextToLocalMappingItemMaster, checkForRole, getTextToLocalSeizedItemDetailHeader, showHideDeleteConfirmation, showHideAdhocPopupTrue
} from "../../utils";
import {
  getLocalization, getTenantId, getUserInfo
} from "egov-ui-kit/utils/localStorageUtils";
import { getCommonHeader, getLabel, getBreak } from "egov-ui-framework/ui-config/screens/specs/utils";
import {
  handleScreenConfigurationFieldChange as handleField,
  prepareFinalObject, toggleSnackbar, toggleSpinner
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import Switch from '@material-ui/core/Switch';
import get from "lodash/get";
import set from "lodash/set";
import store from "ui-redux/store";

import { Button } from "@material-ui/core";
import { createUpdateItemMaster } from "../../../../../ui-utils/commons";

export const serachResultGrid = {
  uiFramework: "custom-molecules-local",
  moduleName: "egov-echallan",
  componentPath: "CustomizeTable",
  id: "tableitemMaster",
  visible: true,
  props: {
    data: [], //JSON.parse(localStorage.getItem('ItemMasterGrid')),
    id: "tableitemMaster",
    columns: [
      {
        name: getTextToLocalMappingItemMaster("itemUuid"),
        label: getTextToLocalMappingItemMaster("itemUuid"),
        options: {
          filter: false,
          display: 'excluded',
          download: false,
          print: false,
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
        name: getTextToLocalMappingItemMaster("itemName"),
        label: getTextToLocalMappingItemMaster("itemName"),
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
        name: getTextToLocalMappingItemMaster("description"),
        label: getTextToLocalMappingItemMaster("description"),
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
        name: getTextToLocalMappingItemMaster("approvalStatus"),
        label: getTextToLocalMappingItemMaster("approvalStatus"),
        options: {
          filter: false,
          display: 'excluded',
          download: false,
          print: false,
        }
      },
      {
        name: "Edit",
        options: {
          display: true,
          filter: false,
          download: false,
          print: false,
          customBodyRender: (value, tableMeta, updateValue) => {
            return (
              <React.Fragment>
                <Button onClick={() => {
                  // onItemMasterRowClick(tableMeta.rowData, false);
                  showHideAdhocPopupTrue(store.getState(), store.dispatch, "search")
                  //onRowClick(tableMeta.rowData, false)
                }} style={{ paddingTop: "0px", paddingBottom: "16px" }}>
                  <span>
                    <i class="material-icons">edit</i>
                    {/* Edit */}
                  </span>
                </Button>
              </React.Fragment>
            );
          },

        }
      },
      {
        name: "Delete",
        options: {
          display: true,
          filter: false,
          download: false,
          print: false,
          customBodyRender: (value, tableMeta, updateValue) => {
            return (
              <React.Fragment>
                <Button onClick={() => {
                  const state = store.getState();
                  showHideDeleteConfirmation(state, store.dispatch, "search");
                  store.dispatch(prepareFinalObject('tableMetarowData', tableMeta.rowData))
                  // let deleteconfirmstatus = window.confirm('Are you sure you want to delete the Record?')
                  // if (deleteconfirmstatus) {
                  //   onItemMasterRowClick(tableMeta.rowData, true);
                  // }
                }}
                  style={{ backgroundColor: "unset", boxShadow: "unset", border: "unset", paddingTop: "0px", paddingBottom: "16px" }}>
                  <span>
                    <i class="material-icons">delete</i>
                    {/* Delete */}
                  </span>
                </Button>
              </React.Fragment>
            );
          },

        }
      },


    ],
    title: getTextToLocalMappingItemMaster('EC_COMMON_TABLE_HEADER_ITEM_MASTER'),
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
      filterType: "dropdown",
      fixedHeaderOptions: {
        xAxis: true,
        yAxis: true
      },
      downloadOptions: {
        filename: "ItemMaster.csv",
        separator: ",",
        filterOptions: {
          useDisplayedColumnsOnly: true,
          useDisplayedRowsOnly: false,
        },
      },
      rowsPerPageOptions: [10, 15, 20],
      onRowClick: (row, index) => {
        if (localStorage.getItem('deletedcalled') === 'false') {
          onItemMasterRowClick(row, false);
        }
      },

      onCellClick: (cellData, cellMeta) => {

        if (cellMeta.colIndex === 5) {
          localStorage.setItem('deletedcalled', true);
        } else {
          localStorage.setItem('deletedcalled', false);
        }
        console.log(cellData, cellMeta);
      },
    },
    // customToolbar: () => {
    //   return (
    //     <React.Fragment>
    //     <Tooltip title={"custom icon"}>
    //       <IconButton className={classes.iconButton} onClick={handleClick()}>
    //         <AddIcon className={classes.deleteIcon} />
    //       </IconButton>
    //     </Tooltip>
    //   </React.Fragment>
    //   );
    // },

    customSortColumn: {
      column: "Item Name",
      sortingFn: (data, i, itemName) => {
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

const handleClick = () => {
  console.log("clicked on icon!");
}

export const onItemMasterRowClick = (rowData, isDeleteCalled) => {

  let userInfo = JSON.parse(getUserInfo());
  const roles = get(userInfo, "roles");
  let isEditAllowed = false;
  if (rowData[3] === "PENDING" && checkForRole(roles, 'challanHOD')) {
    isEditAllowed = true;
  } else if (rowData[3] === "APPROVED" && checkForRole(roles, 'challanEAO')) {
    isEditAllowed = true;
  }

  if (isEditAllowed) {
    const state = store.getState();

    store.dispatch(prepareFinalObject('ItemMaster.itemUuid', rowData[0].split('~')[0]));
    store.dispatch(prepareFinalObject('ItemMaster.itemName', rowData[0].split('~')[1]));
    store.dispatch(prepareFinalObject('ItemMaster.description', rowData[0].split('~')[2]));
    //dispatch(prepareFinalObject('ItemMaster.approvalStatus', rowData[2]));

    if (!isDeleteCalled) {
      disabledFieldsonRole(state);
    } else {
      DeleteRowData('Delete', state, store.dispatch);
      showHideDeleteConfirmation(state, store.dispatch, "search");
    }
  } else {
    let warningMessage = getTextToLocalSeizedItemDetailHeader("pendingAlert");
    store.dispatch(toggleSnackbar(true,
      {
        labelName: warningMessage,
        labelKey: ""
      }, "warning"));
  }

};

const disabledFieldsonRole = (state) => {
  let userInfo = JSON.parse(getUserInfo());
  const roles = get(userInfo, "roles");

  store.dispatch(
    handleField(
      "search",
      "components.adhocDialog.children.popup.children.addItemMasterCard.children.addItemMasterContainer.children.addItemMasterControl",
      "props.disabled", checkForRole(roles, 'challanHOD') ? true : false));
  store.dispatch(
    handleField(
      "search",
      "components.adhocDialog.children.popup.children.addItemMasterCard.children.addItemMasterContainer.children.addItemMasterDescriptionControl",
      "props.disabled", checkForRole(roles, 'challanHOD') ? true : false));
  store.dispatch(
    handleField(
      "search",
      "components.adhocDialog.children.popup.children.addItemMasterCard.children.addItemMasterContainer.children.addItemMasterIdControl",
      "props.disabled", checkForRole(roles, 'challanHOD') ? true : false));

  let toggle = get(state.screenConfiguration.screenConfig["create"],
    "components.adhocDialog.props.open", false);
  store.dispatch(handleField("create", "components.adhocDialog", "props.open", !toggle))

}

const DeleteRowData = async (action, state, dispatch) => {

  let response = await createUpdateItemMaster(state, dispatch, "APPROVED", false);
  let responseStatus = get(response, "status", "");
  if (responseStatus == "SUCCESS" || responseStatus == "success") {

    setTimeout(() => store.dispatch(
      toggleSnackbar(
        true,
        {
          labelName: "Item deleted successfully!",
          labelKey: "EC_ITEAM_MASTER_DELETED_SUCCESSFULLY"
        },
        "warning"
      )), 3000);
    setTimeout(() => window.location.reload(), 4000);
    localStorage.setItem('DeleteCalled', 'false');
  } else {
    store.dispatch(
      toggleSnackbar(
        true,
        {
          labelName: "Submission falied, try again later!",
          labelKey: "EC_ITEM_MASTER_SUBMISSION_FAILED"
        },
        "warning"
      ));
  }
}