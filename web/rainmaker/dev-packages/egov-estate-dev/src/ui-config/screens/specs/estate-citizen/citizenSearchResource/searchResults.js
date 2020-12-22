import React from "react";
import {
  sortByEpoch,
  getEpochForDate,
} from "../../utils";
import { getTextToLocalMapping } from "./searchFunctions";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import { getTenantId } from "egov-ui-kit/utils/localStorageUtils";
import store from "../../../../../ui-redux/store";
import { toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";

const tenantId = getTenantId();
export const searchResults = {
  uiFramework: "custom-molecules",
  componentPath: "Table",
  visible: false,
  props: {
    columns: [
      getTextToLocalMapping("Action"),
      getTextToLocalMapping("File No"),
      getTextToLocalMapping("Site Number"), 
      getTextToLocalMapping("Owner Name"),
      {
        name: "propertyId",
        options: {
          display: false,
          viewColumns: false
        }
      },
      {
        name: "dueAmount",
        options: {
          display: false,
          viewColumns: false
        }
      },
      {
        name: "dispatch",
        options: {
          display: false,
          viewColumns: false
        }
      }
    ],
    options: {
      filter: false,
      download: false,
      responsive: "stacked",
      selectableRows: false,
      hover: true,
      rowsPerPageOptions: [10, 15, 20],
      onRowClick: (row) => {
        onRowClick(row);
      }
    }
  }
};

const onRowClick = rowData => {
  const type = getQueryArg(window.location.href, "type");
  const branchType = getQueryArg(window.location.href, "branchType");
  if (branchType == "BUILDING_BRANCH") {
    window.location.href = `_apply?propertyId=${rowData[4]}&applicationType=${type}&fileNumber=${rowData[1]}`;
    return;
  }
  
  if(type === "payment") {
    if(branchType == 'MANI_MAJRA'){
      window.location.href = process.env.REACT_APP_NAME === "Citizen" ? process.env.NODE_ENV === "production" ? `/citizen/estate/manimajra-payment?propertyId=${rowData[4]}&fileNumber=${rowData[1]}` : `/estate/manimajra-payment?propertyId=${rowData[4]}&fileNumber=${rowData[1]}` : `estate-payment?propertyId=${rowData[4]}&fileNumber=${rowData[1]}`
    }else{
      window.location.href = process.env.REACT_APP_NAME === "Citizen" ? process.env.NODE_ENV === "production" ? `/citizen/estate/estate-payment?propertyId=${rowData[4]}&fileNumber=${rowData[1]}` : `/estate/estate-payment?propertyId=${rowData[4]}&fileNumber=${rowData[1]}` : `estate-payment?propertyId=${rowData[4]}&fileNumber=${rowData[1]}`
    }
  }
  else if (type == "penalty") {
    window.location.href = `estate-penalty?fileNumber=${rowData[1]}`
  }
  else if (type == "refund") {
    window.location.href = `refund?fileNumber=${rowData[1]}&tenantId=${tenantId}`
  }
  else if(type == "account-statement"){
    window.location.href = `estate-search-account-statement?fileNumber=${rowData[1]}`
  }
  else if(type =="security-fee"){
    window.location.href = `estate-security-fee?fileNumber=${rowData[1]}`
  }
  else if(type == "extension-fee"){
    window.location.href = `addExtensionFee?fileNumber=${rowData[1]}`
  }
  else if(type == "adhoc-demand"){
    window.location.href = `adhocDemand?fileNumber=${rowData[1]}`
  }
  else {
    if(rowData[5] > 0) {
      rowData[6](toggleSnackbar(true, {labelName: "ES_ERR_DUE_AMOUNT", labelKey: "ES_ERR_DUE_AMOUNT"}, "warning"))
    } else {
      if (process.env.REACT_APP_NAME === "Citizen") {
        window.location.href = `application-types?propertyId=${rowData[4]}&fileNumber=${rowData[1]}&branchType=${branchType}`;
      }
      else {
        window.location.href = `_apply?propertyId=${rowData[4]}&applicationType=${type}&fileNumber=${rowData[1]}`;
      }
    }
  }
};