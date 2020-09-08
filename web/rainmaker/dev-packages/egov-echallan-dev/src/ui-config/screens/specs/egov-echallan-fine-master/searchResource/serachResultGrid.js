import React from "react";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import TextField from "@material-ui/core/TextField";
import { Link } from "react-router-dom";
import "./index.css";
import {
  sortByEpoch,
  getEpochForDate,
  getTextToLocalMappingFineMaster,
  checkForRole,
  convertDateTimeToEpoch,
  convertEpochToDate,
  showHideAdhocPopupTrue
} from "../../utils";
import {
  getLocalization,
  getTenantId,
  getUserInfo
} from "egov-ui-kit/utils/localStorageUtils";
import {
  handleScreenConfigurationFieldChange as handleField,
  prepareFinalObject,
  toggleSnackbar,
  toggleSpinner
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import get from "lodash/get";
import store from "ui-redux/store";
import { Button } from "@material-ui/core";
let roles = JSON.parse(getUserInfo()).roles;

export const serachResultGrid = {
  uiFramework: "custom-molecules-local",
  moduleName: "egov-echallan",
  componentPath: "CustomizeTable",
  visible: true,
  props: {
    data: [], //JSON.parse(localStorage.getItem('FineMasterGrid')),
    columns: [
      {
        name: getTextToLocalMappingFineMaster("fineUuid"),
        label: getTextToLocalMappingFineMaster("fineUuid"),
        options: {
          filter: false,
          display: "excluded",
          download: false,
          print: false,
          // customBodyRender: (value, tableMeta, updateValue) => (   <FormControlLabel
          //  value={value}     control={<TextField value={value} />}     onChange={event
          // => updateValue(event.target.value)}   /> )
        }
      },
      {
        name: getTextToLocalMappingFineMaster("encroachmentType"),
        label: getTextToLocalMappingFineMaster("encroachmentType"),
        options: {
          filter: true
          // customBodyRender: (value, tableMeta, updateValue) => (   <FormControlLabel
          //  value={value}     control={<TextField value={value} />}     onChange={event
          // => updateValue(event.target.value)}   /> )
        }
      },
      {
        name: getTextToLocalMappingFineMaster("numberOfViolation"),
        label: getTextToLocalMappingFineMaster("numberOfViolation"),
        options: {
          filter: true,
          textAlign: "right",
          // customBodyRender: (value, tableMeta, updateValue) => (   <FormControlLabel
          //  value={value}     control={<TextField value={value} />}     onChange={event
          // => updateValue(event.target.value)}   /> )
        }
      },
      {
        name: getTextToLocalMappingFineMaster("penaltyAmount"),
        label: getTextToLocalMappingFineMaster("penaltyAmount"),
        options: {
          filter: true
        }
      },
      {
        name: getTextToLocalMappingFineMaster("storageCharges"),
        label: getTextToLocalMappingFineMaster("storageCharges"),
        options: {
          filter: true
        }
      },
      {
        name: getTextToLocalMappingFineMaster("effectiveStartDate"),
        label: getTextToLocalMappingFineMaster("effectiveStartDate"),
        options: {
          filter: true
        }
      },
      {
        name: getTextToLocalMappingFineMaster("effectiveEndDate"),
        label: getTextToLocalMappingFineMaster("effectiveEndDate"),
        options: {
          filter: true
        }
      },
      {
        name: getTextToLocalMappingFineMaster("approvalStatus"),
        label: getTextToLocalMappingFineMaster("approvalStatus"),
        options: {
          filter: true
        }
      },
      {
        name: getTextToLocalMappingFineMaster("encroachmentType"),
        label: getTextToLocalMappingFineMaster("encroachmentType"),
        options: {
          filter: false,
          display: "excluded"
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
                  onRowClick: (row, index) => {
                    onRowClick(row);
                    // if (localStorage.getItem('fineDeletedCalled') === 'false') {
                    //   onRowClick(row, false);
                    // }
                  }
                  //onRowClick(tableMeta.rowData, false)
                }} style={{ paddingTop: "0px", paddingBottom: "16px" }} >
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
      // {
      //   name: "Delete",
      //   options: {
      //     display: true,
      //     filter: false,
      //     download: false,
      //     print: false,
      //     customBodyRender: (value, tableMeta, updateValue) => {
      //       return (
      //         <React.Fragment>
      //           <button onClick={() => {
      //             let deleteconfirmstatus = window.confirm('Are you sure you want to delete the Record?')
      //             if (deleteconfirmstatus) {
      //               onRowClick(tableMeta.rowData, true);
      //             }
      //           }
      //           }>
      //             <span>
      //               <i class="material-icons">delete</i>
      //               Delete
      //             </span>
      //           </button>
      //         </React.Fragment>
      //       );
      //     },

      //   }
      // },

    ],
    title: getTextToLocalMappingFineMaster(
      "EC_COMMON_TABLE_HEADER_FINE_MASTER"
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
      filterType: "dropdown",
      fixedHeaderOptions: {
        xAxis: true,
        yAxis: true
      },
      rowsPerPageOptions: [10, 15, 20],
      onRowClick: (row, index) => {
        onRowClick(row);
        // if (localStorage.getItem('fineDeletedCalled') === 'false') {
        //   onRowClick(row, false);
        // }
      },
      // onCellClick: (cellData, cellMeta) => {
      //   
      //   if (cellMeta.colIndex === 5) {
      //     localStorage.setItem('fineDeletedCalled', true);
      //   } else {
      //     localStorage.setItem('fineDeletedCalled', false);
      //   }
      //   console.log(cellData, cellMeta);
      // },
      downloadOptions: {
        filename: "FineMaster.csv",
        separator: ",",
        filterOptions: {
          useDisplayedColumnsOnly: true,
          useDisplayedRowsOnly: false,
        },
      },
    },
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
        return {
          data: finalData,
          currentOrder: !order ? "asc" : "desc"
        };
      }
    }
  }
};

const onRowClick = rowData => {
  let userInfo = JSON.parse(getUserInfo());
  if (checkForRole(roles, 'challanHOD')) {
    isVisibility(true)
  } else if (checkForRole(roles, 'challanEAO')) {
    isVisibility(false)
  }

  let isEditAllowed = false;
  if (rowData[7] === "PENDING" && checkForRole(roles, 'challanHOD')) {
    isEditAllowed = true;
    showHideAdhocPopupTrue(store.getState(), store.dispatch, "search");
  } else if ((rowData[7] === "APPROVED" || rowData[7] === "REJECTED") && checkForRole(roles, 'challanEAO')) {
    isEditAllowed = true;
    showHideAdhocPopupTrue(store.getState(), store.dispatch, "search")
  } else if (rowData[7] === "PENDING" && checkForRole(roles, 'challanEAO')) {
  store.dispatch(
      handleField("search", "components.adhocDialog", "props.open", false)
    );
  }

  // else if (rowData[5] === "REJECTED" && roles[0].code === 'challanEAO') {
  //   isEditAllowed = true;
  // }
  const state = store.getState();
  if (isEditAllowed) {
    let toggle = get(
      state.screenConfiguration.screenConfig["create"],
      "components.adhocDialog.props.open",
      false
    )

    store.dispatch(prepareFinalObject("FineMaster", {}));
    store.dispatch(prepareFinalObject("FineMaster.fineUuid", rowData[0]));
    store.dispatch(prepareFinalObject("FineMaster.encroachmentTypeName", rowData[1]));
    store.dispatch(prepareFinalObject("FineMaster.encroachmentType", rowData[8]));
    store.dispatch(prepareFinalObject("FineMaster.numberOfViolation", rowData[2]));
    store.dispatch(prepareFinalObject("FineMaster.penaltyAmount", rowData[3]));
    store.dispatch(prepareFinalObject("FineMaster.storageCharges", rowData[4]));
    store.dispatch(prepareFinalObject("FineMaster.effectiveStartDate", new Date(getEpochForDate(rowData[5]))));
    store.dispatch(prepareFinalObject("FineMaster.effectiveEndDate", new Date(getEpochForDate(rowData[6]))));

    disabledFieldsAddEdit(state, true);

    let updatedEncroachmentType = [];
    updatedEncroachmentType.push({ code: rowData[1], name: rowData[1] });
    store.dispatch(prepareFinalObject("applyScreenMdmsData.egec.EncroachmentType-new", updatedEncroachmentType));

    let updatedNumberOfViolation = [];
    updatedNumberOfViolation.push({ code: rowData[2], name: rowData[2] });

    store.dispatch(prepareFinalObject("FineMaster.penaltyAmount", rowData[3]));

    store.dispatch(
      handleField("create", "components.adhocDialog", "props.open", !toggle)
    );
  }
  else {
    get(
      state.screenConfiguration.screenConfig["create"],
      "components.adhocDialog.props.open",
      false
    );
    store.dispatch(
      toggleSnackbar(
        true,
        {
          labelName: "Record needs to be approved first, before editing it!",
          labelKey: "EC_FINE_MASTER_RECORDS_NEED_TO_APPROVE_FIRST_TOASTER"
        },
        "warning"
      )
    );
  }
};

export const disabledFieldsAddEdit = (state, isDisabledVisible) => {

  store.dispatch(
    handleField(
      "search",
      "components.adhocDialog.children.popup.children.addFineMasterCard.children.addFineMasterContainer.children.addFineMasterTypeofEncroachment",
      "props.disabled",
      checkForRole(roles, 'challanHOD') ? isDisabledVisible === false ? false : true : false
    )
  );

  store.dispatch(
    handleField(
      "search",
      "components.adhocDialog.children.popup.children.addFineMasterCard.children.addFineMasterContainer.children.addFineMasterControl",
      "props.disabled",
      checkForRole(roles, 'challanHOD') ? isDisabledVisible === false ? false : true : false
    )
  );

  store.dispatch(
    handleField(
      "search",
      "components.adhocDialog.children.popup.children.addFineMasterCard.children.addFineMasterContainer.children.addFineMasterFineAmountControl",
      "props.disabled",
      checkForRole(roles, 'challanHOD') ? isDisabledVisible === false ? false : true : false

    )
  );

  store.dispatch(
    handleField(
      "search",
      "components.adhocDialog.children.popup.children.addFineMasterCard.children.addFineMasterContainer.children.addFineMasterStorageControl",
      "props.disabled",
      checkForRole(roles, 'challanHOD') ? isDisabledVisible === false ? false : true :
        get(state, 'screenConfiguration.preparedFinalObject.FineMaster.encroachmentType', '') === 'Seizure of Vehicles' ? false : true
    )
  );
  store.dispatch(
    handleField(
      "search",
      "components.adhocDialog.children.popup.children.addFineMasterCard.children.addFineMasterContainer.children.addFineMasterStartDate",
      "props.disabled",
      checkForRole(roles, 'challanHOD') ? isDisabledVisible === false ? false : true : false

    )
  );
  store.dispatch(
    handleField(
      "search",
      "components.adhocDialog.children.popup.children.addFineMasterCard.children.addFineMasterContainer.children.addFineMasterEndDate",
      "props.disabled",
      checkForRole(roles, 'challanHOD') ? isDisabledVisible === false ? false : true : false

    )
  );
  // //visiblity of readonly fields
  store.dispatch(
    handleField(
      "search",
      "components.adhocDialog.children.popup.children.addFineMasterCard.children.addFineMasterContainer.children.addFineMasterTypeofEncroachmentEditControl",
      "visible",
      isDisabledVisible
    )
  );
  store.dispatch(
    handleField(
      "search",
      "components.adhocDialog.children.popup.children.addFineMasterCard.children.addFineMasterContainer.children.addFineMasterEditControl",
      "visible",
      isDisabledVisible
    )
  );

  store.dispatch(
    handleField(
      "search",
      "components.adhocDialog.children.popup.children.addFineMasterCard.children.addFineMasterContainer.children.addFineMasterTypeofEncroachment",
      "visible",
      !isDisabledVisible
    )
  );

  store.dispatch(
    handleField(
      "search",
      "components.adhocDialog.children.popup.children.addFineMasterCard.children.addFineMasterContainer.children.addFineMasterControl",
      "visible",
      !isDisabledVisible
    )
  );
};


const isVisibility = (isVisible) => {

  let userInfo = JSON.parse(getUserInfo());

  if (isVisible) {
    store.dispatch(
      handleField(
        "search",
        "components.adhocDialog.children.popup.children.header.children.div1.children.div1",
        "props.visible",
        isVisible
      )
    )

    store.dispatch(
      handleField(
        "search",
        "components.adhocDialog.children.popup.children.header.children.div1.children.div",
        "visible",
        false
      )
    )
  } else {

    store.dispatch(
      handleField(
        "search",
        "components.adhocDialog.children.popup.children.header.children.div1.children.div",
        "props.visible",
        true
      )
    );
    store.dispatch(
      handleField(
        "search",
        "components.adhocDialog.children.popup.children.header.children.div1.children.div1",
        "visible",
        isVisible
      )
    )
  }
};
