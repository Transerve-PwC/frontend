import React from "react";
import { Link } from "react-router-dom";
import get from "lodash/get";
import {
  getBreak,
  getCommonCard,
  getCommonContainer,
  getCommonGrayCard,
  getCommonSubHeader,
  getCommonTitle,
  getSelectField,
  getTextField,
  getDateField,
  getPattern,
  getLabel
} from "egov-ui-framework/ui-config/screens/specs/utils";
import {
  sortByEpoch,
  getEpochForDate,
  getTextToLocalMapping
} from "../../utils";
import {
  getLocalization,
  getTenantId,
  localStorageGet,
  localStorageSet,
  lSRemoveItemlocal,
  lSRemoveItem
} from "egov-ui-kit/utils/localStorageUtils";
import "./index.css";
import {
  getLocaleLabels,
  getTransformedLocalStorgaeLabels
} from "egov-ui-framework/ui-utils/commons";

const getLocalTextFromCode = localCode => {
  return JSON.parse(getLocalization("localization_en_IN")).find(
    item => item.code === localCode
  );
};
import { showinvitelist, deleteguestbyid,InviteDeleteConfirm } from "../searchResource/citizenSearchFunctions"
import { handleScreenConfigurationFieldChange as handleField } from "egov-ui-framework/ui-redux/screen-configuration/actions";




import store from "ui-redux/store";


const onRowDelete = async (rowData, allrowdata) => {

  //console.log("Deleteeeeeeeeeeeeeeeeeee");
  //console.log(rowData)
  //console.log(allrowdata)
  InviteDeleteConfirm(rowData)
  // deleteguestbyid(rowData)
}

// const load_invite_summary(row)= async (rowData, allrowdata) => {


const load_invite_summary = rowData => {
  const reviewUrl = `event_summary?eventId=${rowData[0]}&eventuuId=${rowData[7]}&status=${rowData[5]}&tenantId=` + getTenantId();
  window.location.href = reviewUrl;
}

const onAllEmployeeselect = async (rowData, allrowdata, state, dispatch, action) => {



  if (rowData.length == localStorageGet("gridobjlength") && allrowdata.length == localStorageGet("gridobjlength")) {
    let selectedrows = [];
    let selectedrows1 = [];

    let tempdata = localStorageGet("gridobj");
    // console.log(tempdata);
    // let tempdata1 = tempdata.split('},{').join('}|');
    let tempdata1 = tempdata.split('},{').join('}|{');
    let tempdata2 = tempdata1.split('|')

    tempdata2.map((item, index) => {
      //console.log("------");
      console.log((item));
      let temp = JSON.parse(item)
      let obj = []
      obj[0] = temp.assignments ? temp.assignments[0].DeptName : "-"
      obj[1] = temp.user ? temp.user.name : "-"
      obj[2] = temp.user ? temp.user.mobileNumber : "-"
      obj[3] = temp.user ? temp.user.emailId : "-"
      obj[4] = temp.user ? temp.user.uuid : "-"
      obj[5] = index
      //obj['Department Id']=commiteeMember.departmentUuid
      //obj['Employee ID']=commiteeMember.userUuid
      //obj['DepartmentName']=temp.assignments ? temp.assignments[0].department : "-"
      selectedrows.push(obj)

    })
    localStorageSet("InvitelistAll", JSON.stringify(selectedrows));
  }
  else {
    if (rowData.length == 0) {
      localStorageSet("Invitelist", []);
    }
    localStorageSet("InvitelistAll", []);

  }
}
const onPressselectAll = async (type, rowData, allrowdata, currentRowsSelected, allRowsSelected) => {
  
  //alert('in onrow')
  console.log("allRowsSelected**********************")
  console.log(allRowsSelected)
  let selectedrows = [];
  let selectedrows1 = [];

  let tempdata = localStorageGet("gridobj");
  console.log('Presssssssstempdata');
  console.log(tempdata);
  if (allRowsSelected.length == localStorageGet("gridobjlength")) {
    let avlData = localStorageGet("ResendInvitelistAll")
    if (avlData) {
      localStorageSet("ResendInvitelistAll", "");
      localStorageSet("ResendInvitelist", "");

    }
    else {
      // let tempdata1 = tempdata.split('},{').join('}|');
      let tempdata1 = tempdata.split('},{').join('}|{');
      let tempdata2 = tempdata1.split('|')
      getTextToLocalMapping("Guest Type"),
        getTextToLocalMapping("Guest Name"),
        getTextToLocalMapping("Guest Mobile Number"),
        getTextToLocalMapping("Email ID"),
      {
        name: getTextToLocalMapping("Guest UUID"),
        options: {
          display: false,

        }
      },


        tempdata2.map((item, index) => {
          //console.log("------");
          console.log((item));
          let temp = JSON.parse(item)
          let obj = []
          obj[0] = temp.eventGuestType ? temp.eventGuestType : "-"
          obj[1] = temp.guestName ? temp.guestName : "-"
          obj[2] = temp.guestMobile ? temp.guestMobile : "-"
          obj[3] = temp.guestEmail ? temp.guestEmail : "-"
          obj[4] = temp.eventGuestUuid ? temp.eventGuestUuid : "-"
          obj[5] = index


          selectedrows.push(obj)

        })
      localStorageSet("ResendInvitelistAll", JSON.stringify(selectedrows));


    }

  } else {

    localStorageSet("ResendInvitelistAll", "");
    //localStorageSet("ResendInvitelist", "");	

    if (allRowsSelected.length == 0) {
      localStorageSet("ResendInvitelist", "");
    }
  }
}
const onEmployeeselect = async (type, rowData, allrowdata, index) => {

  if (allrowdata == "resend") {
    if (type == "cell") {
      //console.log(type);
      //console.log("Current" + rowData);
      //console.log("All "+allrowdata);
    }
    else {

      let selectedrows = [];
      let localinvdata = localStorageGet("ResendInvitelist");
      if (localinvdata === null || localinvdata === "undefined" || localinvdata === "[]") {

        let tempAll = JSON.parse(localStorageGet("ResendInvitelistAll"));

        let checked = false;
        if (tempAll != null) {
          tempAll.map((item, index) => {
            if (item[4] === rowData[4]) {
              checked = true;
              tempAll.splice(index, 1)
              localStorageSet("ResendInvitelist", JSON.stringify(tempAll));
              localStorageSet("ResendInvitelistAll", "");
              let selIndex1 = []
              let selIndex = JSON.parse(localStorageGet("ResendInvitelist"));
              selIndex.map((item, index) => {

                selIndex1.push(item[5])

              })
              console.log('selectedRows1')

              console.log(selIndex1)

              console.log('selectedRows1')
              store.dispatch(
                handleField(
                  "event_summary",
                  "components.div.children.resendbody.children.cardContent.children.guestlist",
                  "props.options.rowsSelected",
                  selIndex1
                )
              );
            }
          })
        }
        if (checked === false) {


          let temp = rowData
          temp.push(index.rowIndex)
          selectedrows.push(temp)

          localStorageSet("ResendInvitelist", JSON.stringify(selectedrows));
          let selIndex1 = []
          let selIndex = JSON.parse(localStorageGet("ResendInvitelist"));
          selIndex.map((item, index) => {

            selIndex1.push(item[5])

          })
          console.log('selectedRows1')

          console.log(selIndex1)

          console.log('selectedRows1')
          store.dispatch(
            handleField(
              "event_summary",
              "components.div.children.resendbody.children.cardContent.children.guestlist",
              "props.options.rowsSelected",
              selIndex1
            )
          );
        }

      }
      else {
        let temp = JSON.parse(localStorageGet("ResendInvitelist"));

        let temp2 = rowData
        temp2.push(index.rowIndex)
        selectedrows.push(temp)

        let checked = false;
        temp.map((item, index) => {
          if (item[4] === rowData[4]) {
            checked = true;
            temp.splice(index, 1)
            localStorageSet("ResendInvitelist", JSON.stringify(temp));
            localStorageSet("ResendInvitelistAll", "");
            let selIndex1 = []
            let selIndex = JSON.parse(localStorageGet("ResendInvitelist"));
            selIndex.map((item, index) => {

              selIndex1.push(item[5])

            })
            console.log('selectedRows1')

            console.log(selIndex1)

            console.log('selectedRows1')
            store.dispatch(
              handleField(
                "event_summary",
                "components.div.children.resendbody.children.cardContent.children.guestlist",
                "props.options.rowsSelected",
                selIndex1
              )
            );
          }
        })
        if (checked === false) {
          // selectedrows = temp;
          // selectedrows.push(rowData)

          temp.push(temp2)

          selectedrows = (temp)

          localStorageSet("ResendInvitelist", JSON.stringify(selectedrows));
          let selIndex1 = []
          let selIndex = JSON.parse(localStorageGet("ResendInvitelist"));
          selIndex.map((item, index) => {

            selIndex1.push(item[5])

          })
          console.log('selectedRows1')

          console.log(selIndex1)

          console.log('selectedRows1')
          store.dispatch(
            handleField(
              "event_summary",
              "components.div.children.resendbody.children.cardContent.children.guestlist",
              "props.options.rowsSelected",
              selIndex1
            )
          );
        }
      }
    }
  }
  else {
    if (type == "cell") {

    }
    else {

      // alert('aaaaaaa')
      console.log(type);
      console.log(rowData);
      ;
      let selectedrows = [];
      let localinvdata = localStorageGet("Invitelist");
      if (localinvdata === null || localinvdata === "undefined") {

        let tempAll = JSON.parse(localStorageGet("InvitelistAll"));

        let checked = false;

        if (tempAll !== null) {

          tempAll.map((item, index) => {
            if (item[4] === rowData[4]) {
              checked = true;
              tempAll.splice(index, 1)
              localStorageSet("Invitelist", JSON.stringify(tempAll));
              let selIndex1 = []
              let selIndex = JSON.parse(localStorageGet("Invitelist"));
              selIndex.map((item, index) => {

                selIndex1.push(item[5])

              })
              console.log('selectedRows1')

              console.log(selIndex1)

              console.log('selectedRows1')
              store.dispatch(
                handleField(
                  "createInvite",
                  "components.adhocDialoginternal.children.grid.children.cardContent.children.invireselgrid",
                  "props.options.rowsSelected",
                  selIndex1
                )
              );
            }
          })

        }
        if (checked === false) {

          let temp = rowData
          temp.push(index.rowIndex)
          selectedrows.push(temp)

          localStorageSet("Invitelist", JSON.stringify(selectedrows));
          let selIndex1 = []
          let selIndex = JSON.parse(localStorageGet("Invitelist"));
          selIndex.map((item, index) => {

            selIndex1.push(item[5])

          })
          console.log('selectedRows1')

          console.log(selIndex1)

          console.log('selectedRows1')
          store.dispatch(
            handleField(
              "createInvite",
              "components.adhocDialoginternal.children.grid.children.cardContent.children.invireselgrid",
              "props.options.rowsSelected",
              selIndex1
            )
          );
        }
      }
      else {
        let temp = JSON.parse(localStorageGet("Invitelist"));

        let temp2 = rowData
        temp2.push(index.rowIndex)
        let checked = false;
        temp.map((item, index) => {
          if (item[4] === rowData[4]) {
            checked = true;
            temp.splice(index, 1)
            localStorageSet("Invitelist", JSON.stringify(temp));
            let selIndex1 = []
            let selIndex = JSON.parse(localStorageGet("Invitelist"));
            selIndex.map((item, index) => {

              selIndex1.push(item[5])

            })
            console.log('selectedRows1')

            console.log(selIndex1)

            console.log('selectedRows1')
            store.dispatch(
              handleField(
                "createInvite",
                "components.adhocDialoginternal.children.grid.children.cardContent.children.invireselgrid",
                "props.options.rowsSelected",
                selIndex1
              )
            );
          }
        })
        if (checked === false) {
          temp.push(temp2)

          selectedrows = (temp)

          //	selectedrows = temp;
          //	selectedrows.push(rowData)
          localStorageSet("Invitelist", JSON.stringify(selectedrows));
          let selIndex1 = []
          let selIndex = JSON.parse(localStorageGet("Invitelist"));
          selIndex.map((item, index) => {

            selIndex1.push(item[5])

          })


          store.dispatch(
            handleField(
              "createInvite",
              "components.adhocDialoginternal.children.grid.children.cardContent.children.invireselgrid",
              "props.options.rowsSelected",
              selIndex1
            )
          );
        }
      }
    }
  }
};

export const searchDepartmentEmployeesResults = getCommonCard({
  invireselgrid: {
    uiFramework: "custom-molecules",

    componentPath: "Table",
    visible: true,
    props: {
      data: [],
      columns: [
        getTextToLocalMapping("Department"),
        getTextToLocalMapping("Employee Name"),
        getTextToLocalMapping("Mobile No"),
        getTextToLocalMapping("Email ID"),
        {
          name: getTextToLocalMapping("Employee ID"),
          options: {
            display: false,
            filter: false,
            display: "excluded",
          }
        },

      ],
      //  title: getTextToLocalMapping("Search Results for PUBLIC-RELATIONS Applications"),
      options: {
        filter: false,
        download: false,
        responsive: "stacked",
        // responsive:"scroll",
        selectableRows: true,
        filterType: 'checkbox',
        hover: true,
       
        customToolbarSelect: () => {},
        selectableRowsHeader: true,
       
        selectableRowsOnClick: false,
        rowsPerPageOptions: [5, 10, 15, 20],
        onRowsSelect: (currentRowsSelected, allRowsSelected, state, dispatch, action) => {
          onAllEmployeeselect(currentRowsSelected, allRowsSelected, state, dispatch, action)
        
        },
        onRowClick: (row, index) => {
          onEmployeeselect('rowdata', row, '', index)
        },
        
        selectedRows: {
          text: "row(s) selected",
          delete: "Delete",
          deleteAria: "Delete Selected Rows",
        }

       
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
  },
  Invite: {
    componentPath: "Button",
    props: {
      variant: "contained",
      color: "primary",
      style: {
        // minWidth: "200px",
        height: "48px",
        marginRight: "45px",
        marginTop: "20px",
        minWidth:"140px"

      }
    },
    children: {
      nextButtonLabel: getLabel({
        labelName: "Invite Employees",
        labelKey: "PR_INVITE_EMPLOYEES_BUTTON"
      }),
      nextButtonIcon: {
        uiFramework: "custom-atoms",
        componentPath: "Icon",
        props: {
          iconName: "keyboard_arrow_right"
        }
      }
    },
    onClickDefination: {
      action: "condition",
      callBack: (action, state, dispatch) => { showinvitelist(action, state, dispatch) }
    }
  },
  cancel: {
    componentPath: "Button",
    props: {
      variant: "contained",
      //color: "primary",
      style: {
        backgroundColor: "unset",
        color: "rgb(254, 122, 81)",
        border: "1px solid rgb(254, 122, 81)",
        borderRadius: "2px",
        height: "48px",
        marginRight: "45px",
        marginTop: "20px",
        minWidth:"140px"

      }
    },
    children: {
      nextButtonLabel: getLabel({
        labelName: "Cancel",
        labelKey: "PR_BUTTON_CANCEL"
      }),
      nextButtonIcon: {
        uiFramework: "custom-atoms",
        componentPath: "Icon",
        props: {
          iconName: "keyboard_arrow_right"
        }
      }
    },
    onClickDefination: {


      action: "condition",
      callBack: (action, state, dispatch) => { window.location.reload(); }
    }
  }
});

export const searchInvitedEmployeesResults = {
  uiFramework: "custom-molecules",
  componentPath: "Table",
  visible: true,
  props: {
    data: [],
    columns: [
      getTextToLocalMapping("Guest Type"),
      getTextToLocalMapping("Guest Name"),
      getTextToLocalMapping("Guest Email"),
      getTextToLocalMapping("Guest Mobile Number"),
      {
        name: getTextToLocalMapping("Status"),
        options: {
          display: false,
          filter: false,
          display: "excluded",
        }
      },
      //getTextToLocalMapping("Guest Action"),
      {
        name: getTextToLocalMapping("Guest Action"),
        options: {
          display: true,
          customBodyRender: value => (
            <i class="material-icons">clear</i>
          )
        }
      },
      //getTextToLocalMapping("Guest ID"),
      {
        name: getTextToLocalMapping("Guest ID"),
        options: {
          display: false,
          filter: false,
          display: "excluded",
          // customBodyRender: value => (
          // <span>
          // {value.eventDetailUuid}
          // </span>
          // )
        }
      }

    ],
    //  title: getTextToLocalMapping("Search Results for PUBLIC-RELATIONS Applications"),
    options: {
      filter: false,
      download: false,
      responsive: "stacked",
      selectableRows: false,
      hover: true,
     

      disableToolbarSelect: false,
      selectableRows: false,
      rowsPerPageOptions: [5, 10, 15, 20],

      // }
      onRowClick: (rowsDeleted, data) => {
        onRowDelete(rowsDeleted, data);
      }
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




// List of events to invite guests
export const eventlistforinvitation = {
  uiFramework: "custom-molecules",

  componentPath: "Table",
  visible: true,
  props: {
    data: [],
    columns: [
      getTextToLocalMapping("Event Id"),
      getTextToLocalMapping("Event Title"),
      {
        name: getTextToLocalMapping("Organizer Department"),
        // options: {
        //   display: true,
        //   customBodyRender: (value, tableMeta, updateValue) => (
        //   <div>{value[0]} <br/><br/> {value[1]}</div>

        // )
        // }
      },
      getTextToLocalMapping("Organizer Employee"),
      getTextToLocalMapping("Date & Time"),
      getTextToLocalMapping("Schedule Status"),
      getTextToLocalMapping("Event Status"),

      {
        name: getTextToLocalMapping("Event UUID"),
        options: {
          display: false,
          filter: false,
          display: "excluded",

        }
      },
    ],
    options: {
      filter: false,
      download: false,
      responsive: "stacked",
      selectableRows: false,
      hover: true,

      rowsPerPageOptions: [10, 15, 20],
      onRowClick: (row, index) => {
        load_invite_summary(row);
      }
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


export const ResendInvitedEmployeesResults = {
  uiFramework: "custom-molecules",

  componentPath: "Table",
  visible: true,
  props: {
    data: [],
    columns: [
      getTextToLocalMapping("Guest Type"),
      getTextToLocalMapping("Guest Name"),
      getTextToLocalMapping("Guest Mobile Number"),
      getTextToLocalMapping("Email ID"),
      {
        name: getTextToLocalMapping("Guest UUID"),
        options: {
          display: false,
          filter: false,
          display: "excluded",
        }
      },

    ],

    options: {
      filter: false,
      download: false,
      responsive: "stacked",
      selectableRows: true,
      filterType: 'checkbox',
      	
      hover: true,
      selectableRowsHeader: false,
      rowsPerPageOptions: [5, 10, 15, 20],
      onRowsSelect: (currentRowsSelected, allRowsSelected) => {
        onPressselectAll('cell', '', 'resend', currentRowsSelected, allRowsSelected)
      },
      customToolbarSelect: () => {},
      onRowClick: (row, index) => {
        onEmployeeselect('rowdata', row, 'resend', index)
      },
      selectedRows: {
        text: "row(s) selected",
        delete: "Delete",
        deleteAria: "Delete Selected Rows",
      }

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