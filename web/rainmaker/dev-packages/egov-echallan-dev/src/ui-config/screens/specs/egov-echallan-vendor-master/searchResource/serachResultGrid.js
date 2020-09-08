import React from "react";
import "./index.css"
import FormControlLabel from '@material-ui/core/FormControlLabel';
import {
  sortByEpoch,
  getEpochForDate,
  getTextToLocalMappingVendorDetail,
  getTextToLocalMappingVendorErrorDetail
} from "../../utils";
import {
  getLocalization, getTenantId, getUserInfo
} from "egov-ui-kit/utils/localStorageUtils";
import store from "ui-redux/store";
import {
  handleScreenConfigurationFieldChange as handleField,
  prepareFinalObject, toggleSnackbar, toggleSpinner
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import get from "lodash/get";


export const FileUpload = {
  uiFramework: "custom-molecules-local",
  moduleName: "egov-echallan",
  componentPath: "UploadExcelFile"
};
export const SampleFileDownload = {
  uiFramework: "custom-molecules-local",
  moduleName: "egov-echallan",
  componentPath: "SampleDownload"
};


export const serachVendorResultGrid = {
  uiFramework: "custom-molecules-local",
  moduleName: "egov-echallan",
  componentPath: "CustomizeTable",
  visible: true,
  props: {
    data: [],
    columns: [
      {
        name: getTextToLocalMappingVendorDetail("covNo"),
        label: getTextToLocalMappingVendorDetail("covNo"),
        options: {
          filter: true,
        }
      },
      {
        name: getTextToLocalMappingVendorDetail("name"),
        Flabel: getTextToLocalMappingVendorDetail("name"),
        options: {
          filter: true,
        }
      },
      {
        name: getTextToLocalMappingVendorDetail("fatherSpouseName"),
        label: getTextToLocalMappingVendorDetail("fatherSpouseName"),
        options: {
          filter: true,
        }
      },
      {
        name: getTextToLocalMappingVendorDetail("address"),
        label: getTextToLocalMappingVendorDetail("address"),
        options: {
          filter: true,
        }
      },
      {
        name: getTextToLocalMappingVendorDetail("contactNumber"),
        label: getTextToLocalMappingVendorDetail("contactNumber"),
        options: {
          filter: true,
        }
      },
      {
        name: getTextToLocalMappingVendorDetail("vendorCategory"),
        label: getTextToLocalMappingVendorDetail("vendorCategory"),
        options: {
          filter: true,
        }
      },
      {
        name: getTextToLocalMappingVendorDetail("streetVendorArea"),
        label: getTextToLocalMappingVendorDetail("streetVendorArea"),
        options: {
          filter: true,
        }
      },
      {
        name: getTextToLocalMappingVendorDetail("transportMode"),
        label: getTextToLocalMappingVendorDetail("transportMode"),
        options: {
          filter: true,
        }
      },
      {
        name: getTextToLocalMappingVendorDetail("isActive"),
        label: getTextToLocalMappingVendorDetail("isActive"),
        options: {
          filter: true,
        }
      },
      // {
      //   name: getTextToLocalMappingVendorDetail("remark"),
      //   label: getTextToLocalMappingVendorDetail("remark"),
      //   options: {
      //     filter: true,

      //   }
      // },
    ],

    title: getTextToLocalMappingVendorDetail(
      "Search Results for Vendor-Detail"
    ),
    options: {
      filter: true,
      print: false,
      download: true,
      viewColumns: true,
      responsive: 'scroll',
      selectableRows: false,
      hover: true,
      fixedHeaderOptions: {
        xAxis: true,
        yAxis: true
      },
      rowsPerPageOptions: [10, 15, 20],
      downloadOptions: {
        filename: "VendorMaster.csv",
        separator: ",",
        filterOptions: {
          useDisplayedColumnsOnly: true,
          useDisplayedRowsOnly: false,
        },
      },

    },
    customSortColumn: {
      column: "Vendor Detail",
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
    },

  }
};
const onRowClick = rowData => {
  const state = store.getState();
  let toggle = get(state.screenConfiguration.screenConfig["create"],
    "components.adhocDialog.props.open", false);
  store.dispatch(prepareFinalObject('VendorMaster.vendorUuid', rowData[0]));
  store.dispatch(prepareFinalObject('VendorMaster.passNo', rowData[1]));
  store.dispatch(prepareFinalObject('VendorMaster.covNo', rowData[2]));
  store.dispatch(prepareFinalObject('VendorMaster.name', rowData[3]));
  store.dispatch(prepareFinalObject('VendorMaster.fatherSpouseName', rowData[4]));
  store.dispatch(prepareFinalObject('VendorMaster.address', rowData[5]));
  store.dispatch(prepareFinalObject('VendorMaster.contactNumber', rowData[6]));
  store.dispatch(prepareFinalObject('VendorMaster.transportMode', rowData[7]));
  store.dispatch(prepareFinalObject('VendorMaster.VendorUuid', rowData[8]));
  store.dispatch(handleField("create", "components.adhocDialog", "props.open", !toggle))
};

export const serachVendorErrorResultGrid = {
  uiFramework: "custom-molecules-local",
  moduleName: "egov-echallan",
  componentPath: "CustomizeTable",
  // uiFramework: "custom-molecules",
  // componentPath: "Table",
  visible: true,
  props: {
    data: [],
    columns: [
      {
        name: getTextToLocalMappingVendorErrorDetail("covNo"),
        label: getTextToLocalMappingVendorErrorDetail("covNo"),
      },
      {
        name: getTextToLocalMappingVendorErrorDetail("name"),
        label: getTextToLocalMappingVendorErrorDetail("name"),
      },
      {
        name: getTextToLocalMappingVendorErrorDetail("fatherSpouseName"),
        label: getTextToLocalMappingVendorErrorDetail("fatherSpouseName"),
        options: {
          filter: false,
          display: "excluded"
        }
      },
      {
        name: getTextToLocalMappingVendorErrorDetail("address"),
        label: getTextToLocalMappingVendorErrorDetail("address"),
        options: {
          filter: false,
          display: "excluded"
        }
      },
      {
        name: getTextToLocalMappingVendorErrorDetail("contactNumber"),
        label: getTextToLocalMappingVendorErrorDetail("contactNumber"),
      },
      {
        name: getTextToLocalMappingVendorErrorDetail("vendorCategory"),
        label: getTextToLocalMappingVendorErrorDetail("vendorCategory"),
      },
      {
        name: getTextToLocalMappingVendorErrorDetail("streetVendorArea"),
        label: getTextToLocalMappingVendorErrorDetail("streetVendorArea"),
      },
      {
        name: getTextToLocalMappingVendorErrorDetail("transportMode"),
        label: getTextToLocalMappingVendorErrorDetail("transportMode"),
      },
      {
        name: getTextToLocalMappingVendorErrorDetail("remark"),
        label: getTextToLocalMappingVendorErrorDetail("remark"),
      }],

    title: //getTextToLocalMappingVendorErrorDetail(
      "Error Details for Vendor Upload",
    //),
    options: {
      filter: false,
      print: false,
      download: false,
      viewColumns: false,
      responsive: 'scroll',
      resizableColumns:false,
      selectableRows: false,
      hover: true,
      // fixedHeaderOptions: {
      //   xAxis: true,
      //   yAxis: true
      // },
      rowsPerPageOptions: [10, 15, 20],
      downloadOptions: {
        filename: "ErrorDetails.csv",
        separator: ",",
        filterOptions: {
          useDisplayedColumnsOnly: true,
          useDisplayedRowsOnly: false,
        },
      },

    },
  }
};