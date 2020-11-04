import React from "react";
import { Link } from "react-router-dom";
import get from "lodash/get";
import "./index.css"
import store from "ui-redux/store";
import {
  sortByEpoch,
  getEpochForDate,
  getTextToLocalMappingArticleGrid,
  setSeizedItemGridData
} from "../../utils"
import {
  getLocalization,  getTenantId,  getUserInfo} from "egov-ui-kit/utils/localStorageUtils";
import {
  getLocaleLabels,  getTransformedLocalStorgaeLabels} from "egov-ui-framework/ui-utils/commons";

import { LabelContainer } from "egov-ui-framework/ui-containers";
import {
  handleScreenConfigurationFieldChange as handleField,
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";

const getLocalTextFromCode = localCode => {
  return JSON.parse(getLocalization("localization_en_IN")).find(
    item => item.code === localCode
  );
};

const handleSync=(data,value)=>{
  let gridData=get(store.getState(), 'screenConfiguration.preparedFinalObject.articleSeizedGridDetails', [])
  gridData = gridData.filter(function (value, index) { return index != data.rowIndex; })
  store.dispatch(prepareFinalObject('articleSeizedGridDetails', gridData));
  store.dispatch(
    handleField(
      "apply",
      "components.div.children.formwizardSecondStep.children.ArticleGridDetails",
      "props.data",
      gridData
    )
  );

  console.log(data);
}
export const ArticleGridDetails = {
  uiFramework: "custom-molecules-local",
  moduleName: "egov-echallan",
  componentPath: "Table",
  visible: true,
  props: {
    data : [],
  //  style: { 'white-space': 'unset' } ,
    columns: [
      getTextToLocalMappingArticleGrid("ItemName"),
      getTextToLocalMappingArticleGrid("Other"),
      getTextToLocalMappingArticleGrid("SeizedQty"),
      getTextToLocalMappingArticleGrid("VehicleNumber"),
      getTextToLocalMappingArticleGrid("Remark"),      
      {
        name:  "Action",
        options: {
          filter: false,
          customBodyRender: (value,data,index) =>{
            const currentTime = new Date().getTime();
            let styleSelect = {}
                styleSelect.color = "red" 
                styleSelect.cursor= "pointer";
          return(
            <LabelContainer style={styleSelect} onClick={() => { handleSync(data,value)}}
              labelKey={"Delete"}
              labelName={"Delete"}
            />             
          )
        }
        }
      }
    ],
    // columns: [
    //   {
    //     name: getTextToLocalMappingArticleGrid("ItemName"),
    //     label: getTextToLocalMappingArticleGrid("ItemName"),
    //     options: {
    //       filter: true,
    //       // customBodyRender: (value, tableMeta, updateValue) => (
    //       //   <FormControlLabel
    //       //     value={value}
    //       //     control={<TextField value={value} />}
    //       //     onChange={event => updateValue(event.target.value)}
    //       //   />
    //       // )
    //     }
    //   },
    //   {
    //     name: getTextToLocalMappingArticleGrid("Other"),
    //     label: getTextToLocalMappingArticleGrid("Other"),
    //     options: {
    //       filter: true,
    //       // customBodyRender: (value, tableMeta, updateValue) => (
    //       //   <FormControlLabel
    //       //     value={value}
    //       //     control={<TextField value={value} />}
    //       //     onChange={event => updateValue(event.target.value)}
    //       //   />
    //       // )
    //     }
    //   },
    //   {
    //     name: getTextToLocalMappingArticleGrid("SeizedQty"),
    //     label: getTextToLocalMappingArticleGrid("SeizedQty"),
    //     options: {
    //       filter: true,
    //       // customBodyRender: (value, tableMeta, updateValue) => (
    //       //   <FormControlLabel
    //       //     value={value}
    //       //     control={<TextField value={value} />}
    //       //     onChange={event => updateValue(event.target.value)}
    //       //   />
    //       // )
    //     }
    //   },
    //   {
    //     name: getTextToLocalMappingArticleGrid("VehicleNumber"),
    //     label: getTextToLocalMappingArticleGrid("VehicleNumber"),
    //     options: {
    //       filter: true,
    //       // customBodyRender: (value, tableMeta, updateValue) => (
    //       //   <FormControlLabel
    //       //     value={value}
    //       //     control={<TextField value={value} />}
    //       //     onChange={event => updateValue(event.target.value)}
    //       //   />
    //       // )
    //     }
    //   },
    //   {
    //   name: getTextToLocalMappingArticleGrid("Remark"),
    //   label: getTextToLocalMappingArticleGrid("Remark"),
    //   },
    // ],


    options: {
      filter: false,
      print: false,
      download: false,
      // responsive: "scrollMaxHeight",
      viewColumns: false,
      responsive: 'scroll',
      // responsive: "stack"
      selectableRows: false,
      disableToolbarSelect: true,
      columnMinWidth:80,
      //resizableColumns: false,
      // resizable:false,
      suppressSizeToFit: true,
      // resizableRows:true,
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



