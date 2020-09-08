import React from "react";
import { Link } from "react-router-dom";
import "./index.css"
import {
  sortByEpoch,
  getEpochForDate,
  getTextToLocalMappingAuctionGrid,
  setSeizedItemGridData,
  checkForRole
} from "../../utils"
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
import store from "ui-redux/store";

export const AuctionGridDetails = {
  uiFramework: "custom-molecules-local",
  moduleName: "egov-echallan",
  componentPath: "Table",
  visible: true,
  // uiFramework: "custom-molecules-local",
  // moduleName: "egov-echallan",
  // componentPath: "CustomizeTable",
  // visible: true,
  props: {
    data: [],
    columns: [
      getTextToLocalMappingAuctionGrid("itemName"),
      getTextToLocalMappingAuctionGrid("seizedQty"),
      getTextToLocalMappingAuctionGrid("auctionDate"),
      getTextToLocalMappingAuctionGrid("contactNumber"),
      getTextToLocalMappingAuctionGrid("purchaseName"),
      getTextToLocalMappingAuctionGrid("purchaseQuantity"),
      getTextToLocalMappingAuctionGrid("amount"),
    ],
    options: {
      filter: true,
      print: false,
      download: false,
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
      rowsPerPageOptions: [10, 15, 20],
      onRowClick: (row, index) => {
        //onRowClick(row);
      },
      // onCellClick: (cellData, cellMeta) => {
      //   
      //   alert(cellData)
      //   console.log(cellData, cellMeta);
      // },
      // customToolbarSelect: (selectedRows, displayData, setSelectedRows) => {
      //   
      //   onselect(selectedRows, displayData, setSelectedRows)
      // }
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

const onRowClick = rowData => {
  const state = store.getState();
  let toggle = get(state.screenConfiguration.screenConfig["apply"],
    "components.div.children.AuctionDetails.props.open", false);
  // if (isEditAllowed) 
  // let toggle = get(
  //   state.screenConfiguration.screenConfig["create"],
  //   "components.div.children.AuctionGridDetails.props.open",
  //   false
  // );


  store.dispatch(prepareFinalObject("auctionDetails.itemName", rowData[0]));
  store.dispatch(prepareFinalObject("auctionDetails.seizedQty", rowData[1]));
  store.dispatch(prepareFinalObject("auctionDetails.auctionDate", rowData[2]));
  store.dispatch(prepareFinalObject("auctionDetails.contactNumber", rowData[3]));
  store.dispatch(prepareFinalObject("auctionDetails.purchaseName", rowData[4]));
  store.dispatch(prepareFinalObject("auctionDetails.purchaseQuantity", rowData[5]));
  store.dispatch(prepareFinalObject("auctionDetails.amount", rowData[6]));

  // store.dispatch(handleField("apply", "components.div.children.AuctionDetails", "props.value",rowData));
  //  store.dispatch(handleField("apply", "components.div.children.AuctionDetails.children.cardContent.children.articleDetailsConatiner.children.articleContainer.children.auctionCard.children.AuctionDetails", "props.value",rowData[0] ));
  //  store.dispatch(handleField("apply", "components.div.children.AuctionDetails.children.cardContent.children.articleDetailsConatiner.children.articleContainer.children.auctionCard.children.Quantity", "props.value",rowData[1] ));
  //  store.dispatch(handleField("apply", "components.div.children.AuctionDetails.children.cardContent.children.articleDetailsConatiner.children.articleContainer.children.auctionCard.children.auctionDate", "props.value",rowData[2] ));
  //  store.dispatch(handleField("apply", "components.div.children.AuctionDetails.children.cardContent.children.articleDetailsConatiner.children.articleContainer.children.auctionCard.children.purchaserContact", "props.value",rowData[3] ));
  //  store.dispatch(handleField("apply", "components.div.children.AuctionDetails.children.cardContent.children.articleDetailsConatiner.children.articleContainer.children.auctionCard.children.purchaserName", "props.value",rowData[4] ));
  //  store.dispatch(handleField("apply", "components.div.children.AuctionDetails.children.cardContent.children.articleDetailsConatiner.children.articleContainer.children.auctionCard.children.purchaserQuantity", "props.value",rowData[5] ));
  //  store.dispatch(handleField("apply", "components.div.children.AuctionDetails.children.cardContent.children.articleDetailsConatiner.children.articleContainer.children.auctionCard.children.amount", "props.value",rowData[6] ));
  disabledFieldsonRole();
}
const disabledFieldsonRole = () => {
  let userInfo = JSON.parse(getUserInfo());
  const roles = get(userInfo, "roles");
  store.dispatch(
    handleField(
      "apply",
      "components.div.children.AuctionDetails.children.cardContent.children.articleDetailsConatiner.children.articleContainer.children.auctionCard.children.AuctionDetails",
      "props.disabled", checkForRole(roles, 'challanSTORE') ? true : false));
  store.dispatch(
    handleField(
      "apply",
      "components.div.children.AuctionDetails.children.cardContent.children.articleDetailsConatiner.children.articleContainer.children.auctionCard.children.Quantity",
      "props.disabled", checkForRole(roles, 'challanSTORE') ? true : false));

  store.dispatch(
    handleField(
      "apply",
      "components.div.children.AuctionDetails.children.cardContent.children.articleDetailsConatiner.children.articleContainer.children.auctionCard.children.auctionDate",
      "props.disabled", checkForRole(roles, 'challanSTORE') ? true : false));
  store.dispatch(
    handleField(
      "apply",
      "components.div.children.AuctionDetails.children.cardContent.children.articleDetailsConatiner.children.articleContainer.children.auctionCard.children.purchaserContact",
      "props.disabled", checkForRole(roles, 'challanSTORE') ? true : false));
  store.dispatch(
    handleField(
      "apply",
      "components.div.children.AuctionDetails.children.cardContent.children.articleDetailsConatiner.children.articleContainer.children.auctionCard.children.purchaserName",
      "props.disabled", checkForRole(roles, 'challanSTORE') ? true : false));
  store.dispatch(
    handleField(
      "apply",
      "components.div.children.AuctionDetails.children.cardContent.children.articleDetailsConatiner.children.articleContainer.children.auctionCard.children.purchaserQuantity",
      "props.disabled", checkForRole(roles, 'challanSTORE') ? true : false));

  store.dispatch(
    handleField(
      "apply",
      "components.div.children.AuctionDetails.children.cardContent.children.articleDetailsConatiner.children.articleContainer.children.auctionCard.children.amount",
      "props.disabled", checkForRole(roles, 'challanSTORE') ? true : false));

}