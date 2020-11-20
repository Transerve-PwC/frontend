import React from "react";
import { LabelContainer } from "egov-ui-framework/ui-containers";
import { getQueryArg, getStatusKey } from "egov-ui-framework/ui-utils/commons";
import { getEpochForDate, sortByEpoch } from "../../utils";
import {
  getLocaleLabels,
  getTransformedLocalStorgaeLabels,
} from "egov-ui-framework/ui-utils/commons";
const localisationLabels = getTransformedLocalStorgaeLabels();

const url = getQueryArg(
  window.location.href,
  "redirectUrl"
);

export const getTextToLocalMapping = (label) => {
  switch (label) {
    case "Unique Property ID":
      return getLocaleLabels(
        "Unique Property ID",
        "PT_COMMON_TABLE_COL_PT_ID",
        localisationLabels
      );

    case "Owner Name":
      return getLocaleLabels(
        "Owner Name",
        "PT_COMMON_TABLE_COL_OWNER_NAME",
        localisationLabels
      );

    case "Address":
      return getLocaleLabels(
        "Address",
        "PT_COMMON_COL_ADDRESS",
        localisationLabels
      );

    case "tenantId":
      return getLocaleLabels(
        "tenantId",
        "PT_COMMON_TABLE_COL_TENANTID_LABEL",
        localisationLabels
      );
    case "service":
      return getLocaleLabels(
        "service",
        "WS_COMMON_TABLE_COL_SERVICE_LABEL",
        localisationLabels
      );
        case "Action":
          return getLocaleLabels(
            "Action",
            "PT_COMMON_TABLE_COL_ACTION_LABEL",
            localisationLabels
          );

    case "Search Results for Properties":
      return getLocaleLabels(
        "Search Results for Properties",
        "PT_HOME_PROPERTY_RESULTS_TABLE_HEADING",
        localisationLabels
      );
  }
};

export const searchPropertyTable = {
  uiFramework: "custom-molecules",
  moduleName:"egov-pt",
  componentPath: "Table",
  visible: false,
  props: {
    columns: [
      {
       name:  getTextToLocalMapping("Unique Property ID"), 
       options: {
        filter: false,
        customBodyRender: (value) =>{
        return(
           <span style={{ color: "black",cursor: "auto" }}>
            {value}
          </span>
        )
      }
      }
    },
    getTextToLocalMapping("Owner Name"),
    getTextToLocalMapping("Address"),
      {
        name:   getTextToLocalMapping("Action"),
        options: {
          filter: false,
          customBodyRender: (value,data) =>{
            let styleSelect = {}
                styleSelect.color = "red"
                styleSelect.cursor= (data.rowData[3] !== "INACTIVE")?"pointer":"initial";
          return(
            <LabelContainer style={styleSelect} onClick={() => { getSelect(data)}}
              labelKey={getStatusKey(value).labelKey}
              labelName={getStatusKey(value).labelName}
            />             
          )
        }
        }
      },

      {
        name:  getTextToLocalMapping("tenantId"),
        options: {
          display: false
        }
      },
      {
        name:  "Sync",
        options: {
          filter: false,
          display: false,
          customBodyRender: (value,data) =>{
            const currentTime = new Date().getTime();
            let styleSelect = {}
                styleSelect.color = currentTime-value > 86400 ? "red" : "green"
                styleSelect.cursor= "pointer";
          return(
            <LabelContainer style={styleSelect} onClick={() => { handleSync(data)}}
              labelKey={"SYNC"}
              labelName={"SYNC"}
            />             
          )
        }
        }
      },
    ],    
    
    title: getTextToLocalMapping("Search Results for Properties"),
    rows:"",
    options: {
      filter: false,
      download: false,
      responsive: "stacked",
      selectableRows: false,
      hover: true,
      rowsPerPageOptions: [10, 15, 20]
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

const getSelect=data=>{
  if(data.rowData[3] === 'INACTIVE'){
    return false;
  }

  if(process.env.REACT_APP_NAME == "Citizen"){
    window.location.href=`/citizen${url}?redirectUrl=/wns/apply&propertyId=${data.rowData[0]}&tenantId=${data.rowData[4]}`
  }else{
    window.location.href=`/employee${url}?redirectUrl=/wns/apply&propertyId=${data.rowData[0]}&tenantId=${data.rowData[4]}`
  }
}

const handleSync=data=>{
  if(data.rowData[3] === 'INACTIVE'){
    return false;
  }
  const url = "/pt-common-screens/verify-propertyDetails";

  if(process.env.REACT_APP_NAME == "Citizen"){
    window.location.href=`/citizen${url}?propertyId=${data.rowData[0]}&tenantId=${data.rowData[4]}`
  }else{
    window.location.href=`/employee${url}?propertyId=${data.rowData[0]}&tenantId=${data.rowData[4]}`
  }
}