import React, { Component } from "react";
import { Doughnut, Bar, HorizontalBar, Line, Pie } from 'react-chartjs-2';
import CardContent from '@material-ui/core/CardContent';
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import ReactTable from "react-table-6";  
import "react-table-6/react-table.css" ;
import jsPDF from 'jspdf'
import 'jspdf-autotable'
// import Dashboardtable from './Dashboardtable';
// import Pagination from "./Pagination";
import './storeDashboard.css';

class DashboardStoreManagement extends React.Component {
  constructor(props) {
    super(props);
    this.state ={
        checkData: [],
        allData: [],
        dataOne: [],
        dataTwo: [],
        dataThird: [],
        graphOneLabel: [],
        graphOneData: [],
        graphTwoLabel: [],
        graphThirdLabel: [],
        graphTwoData: [],
        graphThirdData: [],
        graphClicked: -1,
        hardJSON: [],
        graphHardOneData : {},
        graphHardTwoData : {},
        rowData: [],
        columnData: [],
        // Feature Table
        toggleColumnCheck: false,
        unchangeColumnData: [],
        stackDataSet: [],
        propSortBy: [],
        stackBgColor: []
    }
  }

    // PDF function 
    pdfDownload = (e) => {

        e.preventDefault();
        var columnData = this.state.unchangeColumnData
        // var columnDataCamelize = this.state.columnData
        var rowData = this.state.rowData

        var group = columnData.reduce((r, a) => {
            r[a["show"]] = [...r[a["show"]] || [], a];
            return r;
            }, {});

        columnData = group["true"]
        var tableColumnData = []
        var tableColumnDataCamel = []
        for(var i=0; i<columnData.length; i++){
            tableColumnData.push(columnData[i]["accessor"]);
            // tableColumnDataCamel.push(columnDataCamelize[i]["accessor"])
        }

        var tableRowData = [];
        for(var i=0; i<rowData.length; i++){
            var rowItem = [];
            for(var j=0; j<tableColumnData.length; j++){
                const demo1 = rowData[i]
                var demo2 = tableColumnData[j].replace(".", ",");
                demo2 = demo2.split(",")
                if(typeof(demo2) === "object"){   
                    if(demo2.length > 1){
                        rowItem.push(rowData[i][demo2[0]][demo2[1]]);
                    }
                    else{
                        rowItem.push(rowData[i][demo2]);
                    }
                }else{
                    rowItem.push(rowData[i][demo2]);
                }
            }
            tableRowData.push(rowItem);
        }

        var tableRowDataFinal = []
        for(var i=0; i<tableRowData.length; i++){
            tableRowDataFinal.push(tableRowData[i]);
        }


        
        // PDF Code 
        const unit = "pt";
        const size = "A4"; // Use A1, A2, A3 or A4
        const orientation = "portrait"; // portrait or landscape
        const marginLeft = 40;
        const doc = new jsPDF(orientation, unit, size);

        var pageHeight = doc.internal.pageSize.height || doc.internal.pageSize.getHeight();
        var pageWidth = doc.internal.pageSize.width || doc.internal.pageSize.getWidth();

        doc.text("mChandigarh Application", pageWidth / 2, 20, 'center');

        doc.setFontSize(10);
        const pdfTitle = this.state.graphHardOneData.title ? this.state.graphHardOneData.title : "Title"
        doc.text(pdfTitle, pageWidth / 2, 40, 'center');

        doc.autoTable({ html: '#my-table' });
        doc.setFontSize(5);

        doc.autoTable({
            // head: [tableColumnDataCamel],
            head: [tableColumnData],
            theme: "striped",
            styles: {
                fontSize: 7,
            },
            body:tableRowData
        });

        doc.save(pdfTitle+".pdf");

    }

    // Column Unchange Data
    columnUnchange=(e)=>{

    const coldata = e;
    var unchangeData = [];
    for(var i=0;i<coldata.length; i++){
        if(coldata[i]["show"]){
            unchangeData.push(coldata[i])
        }   
    }
    return unchangeData

    }
    // Hide / Show Column
    showHideColumn = (e) => {
    e.preventDefault();

    var sortColumn = JSON.parse(JSON.stringify(this.state.unchangeColumnData));
    const removeIndex = parseInt(e.target.value);
    // sortColumn.splice(removeIndex, 1)
    sortColumn[removeIndex]["show"] = !(sortColumn[removeIndex]["show"]);

    var sortColumn2 = JSON.parse(JSON.stringify(this.state.unchangeColumnData));
    const removeIndex2 = parseInt(e.target.value);
    // sortColumn.splice(removeIndex, 1)
    sortColumn2[removeIndex2]["show"] = !(sortColumn2[removeIndex2]["show"])

    this.setState({
        columnData: sortColumn,
        unchangeColumnData: sortColumn2
    })
    }

    // Toggle Column 
    toggleColumn = (e) => {
    e.preventDefault();

    const data = this.state.columnData
    this.setState({
        toggleColumnCheck : !this.state.toggleColumnCheck
    })
    }

    // graphSorting Function for all type
    graphSorting = ( propSortBy, sortBy, data, checkGraph ) => {
        
        debugger;
        if(propSortBy === "indentingStore"){
            if(checkGraph === "ONE"){

                var group = data.reduce((r, a) => {
                    r[a[sortBy[0]][0][sortBy[1]][sortBy[2]]] = [...r[a[sortBy[0]][0][sortBy[1]][sortBy[2]]] || [], a];
                    return r;
                    }, {});
        
                var graphOneLabel = Object.keys(group);
                var graphOneData = []
                for(var i=0; i<Object.keys(group).length ; i++){
                    graphOneData.push(group[graphOneLabel[i]].length);
                }
        
                return [ graphOneLabel, graphOneData, group ]
            }
            if(checkGraph === "TWO"){
                debugger;
                var group = data.reduce((r, a) => {
                    r[a[sortBy[0]][0][sortBy[1]]] = [...r[a[sortBy[0]][0][sortBy[1]]] || [], a];
                    return r;
                    }, {});
        
                var graphOneLabel = Object.keys(group);
                var graphOneData = []
                for(var i=0; i<Object.keys(group).length ; i++){
                    graphOneData.push(group[graphOneLabel[i]].length);
                }
                debugger;
                return [ graphOneLabel, graphOneData, group ]
            }
            else{
                var sortNo = null;
                var group = data.reduce((r, a) => {
                    r[a[sortBy[0]][sortBy[1]][sortBy[2]][sortBy[3]]] = [...r[a[sortBy[0]][sortBy[1]][sortBy[2]][sortBy[3]]] || [], a];
                    return r;
                    }, {});
        
                var graphOneLabel = Object.keys(group);
                var graphOneData = []
                for(var i=0; i<Object.keys(group).length ; i++){
                    graphOneData.push(group[graphOneLabel[i]].length);
                }
        
                return [ graphOneLabel, graphOneData, group ]
            }

        }else if( typeof(sortBy) === "object" && propSortBy === "purchaseOrders" ){
            
            debugger;
            if(checkGraph === "ONE"){

                var group = data.reduce((r, a) => {
                    r[a[sortBy[0]][0][sortBy[1]][sortBy[2]]] = [...r[a[sortBy[0]][0][sortBy[1]][sortBy[2]]] || [], a];
                    return r;
                    }, {});
        
                var graphOneLabel = Object.keys(group);
                var graphOneData = []
                for(var i=0; i<Object.keys(group).length ; i++){
                    graphOneData.push(group[graphOneLabel[i]].length);
                }
        
                return [ graphOneLabel, graphOneData, group ]
            }
            if(checkGraph === "TWO"){
                debugger;
                var group = data.reduce((r, a) => {
                    r[a[sortBy[0]][0][sortBy[1]]] = [...r[a[sortBy[0]][0][sortBy[1]]] || [], a];
                    return r;
                    }, {});
        
                var graphOneLabel = Object.keys(group);
                var graphOneData = []
                for(var i=0; i<Object.keys(group).length ; i++){
                    graphOneData.push(group[graphOneLabel[i]].length);
                }
                debugger;
                return [ graphOneLabel, graphOneData, group ]
            }
            else{
                var sortNo = null;
                var group = data.reduce((r, a) => {
                    r[a[sortBy[0]][sortBy[1]][sortBy[2]]] = [...r[a[sortBy[0]][sortBy[1]][sortBy[2]]] || [], a];
                    return r;
                    }, {});

                var graphOneLabel = Object.keys(group);
                var graphOneData = []
                for(var i=0; i<Object.keys(group).length ; i++){
                    graphOneData.push(group[graphOneLabel[i]].length);
                }

                return [ graphOneLabel, graphOneData, group ]
            }
        }else if( typeof(sortBy) === "object" && propSortBy === "MaterialReceipt" ){
            
            if(checkGraph === "ONE"){

                var group = data.reduce((r, a) => {
                    r[a[sortBy[0]][0][sortBy[1]][sortBy[2]]] = [...r[a[sortBy[0]][0][sortBy[1]][sortBy[2]]] || [], a];
                    return r;
                    }, {});
        
                var graphOneLabel = Object.keys(group);
                var graphOneData = []
                for(var i=0; i<Object.keys(group).length ; i++){
                    graphOneData.push(group[graphOneLabel[i]].length);
                }
        
                return [ graphOneLabel, graphOneData, group ]
            }
            if(checkGraph === "TWO"){
                debugger;
                var group = data.reduce((r, a) => {
                    r[a[sortBy[0]][0][sortBy[1]]] = [...r[a[sortBy[0]][0][sortBy[1]]] || [], a];
                    return r;
                    }, {});
        
                var graphOneLabel = Object.keys(group);
                var graphOneData = []
                for(var i=0; i<Object.keys(group).length ; i++){
                    graphOneData.push(group[graphOneLabel[i]].length);
                }
                debugger;
                return [ graphOneLabel, graphOneData, group ]
            }
            else{
                var sortNo = null;
                var group = data.reduce((r, a) => {
                    r[a[sortBy[0]][sortBy[1]][sortBy[2]]] = [...r[a[sortBy[0]][sortBy[1]][sortBy[2]]] || [], a];
                    return r;
                    }, {});
        
                var graphOneLabel = Object.keys(group);
                var graphOneData = []
                for(var i=0; i<Object.keys(group).length ; i++){
                    graphOneData.push(group[graphOneLabel[i]].length);
                }
        
                return [ graphOneLabel, graphOneData, group ]
            }

        }
        else
        {
            var sortNo = null;
            var group = data.reduce((r, a) => {
                r[a[sortBy]] = [...r[a[sortBy]] || [], a];
                return r;
                }, {});
    
            var graphOneLabel = Object.keys(group);
            var graphOneData = []
            for(var i=0; i<Object.keys(group).length ; i++){
                graphOneData.push(group[graphOneLabel[i]].length);
            }
    
            return [ graphOneLabel, graphOneData, group ]
        }
    
    }

    // CamelCase Column Name 
    camelize = (str) =>  {
    // var res = str.substr(0, 1);
    var res = String(str).substr(0, 1);
    str = str.replaceAll("_", " ")
    return str.replace(res, function(res)
    {
    return res.toUpperCase();
    });
    }

    // Stacked Graph config
    stackDataconfig = ( sortBy, graphOneData2 ) => {
        
        debugger;
        var stackDataSet = [];
        var cnt = 0;
        var stackBgColor = [];
        var color =  ["#0000FF", "#FF0000", "#00FF00", "#FFFF00"];
        if(sortBy === "indentingStore"){
            
            var stackGraphData = []
            for(var i=0; i<graphOneData2[0].length; i++){
                var group = graphOneData2[2][graphOneData2[0][i]].reduce((r, a) => {
                r[a["materialIssueStatus"]] = [...r[a["materialIssueStatus"]] || [], a];
                return r;
                }, {});
                stackGraphData.push(group)
            }

            // Final sorting for stack data
            var stackDataSet = []
            // for(var i=0; i<stackGraphData.length; i++){
            //     var datset = []
            //     for(var j=0; j<4; j++){
            //         var dtSET = stackGraphData[i][Object.keys(stackGraphData[i])[j]] ? 
            //         stackGraphData[i][Object.keys(stackGraphData[i])[j]].length : 0;
            //         datset.push(dtSET);
            //     }
            //     stackDataSet.push(datset)
            // }


            for(var j=0; j<4; j++){
                var datset = []
                for(var i=0; i<stackGraphData.length; i++){
                    var dtSET = stackGraphData[i][Object.keys(stackGraphData[i])[j]] ?
                    stackGraphData[i][Object.keys(stackGraphData[i])[j]].length : 0;
                    datset.push(dtSET);
                }
                stackDataSet.push(datset)
            }

        }
        if(sortBy === "purchaseOrders"){
            
            var stackGraphData = []
            for(var i=0; i<graphOneData2[0].length; i++){
                var group = graphOneData2[2][graphOneData2[0][i]].reduce((r, a) => {
                r[a["status"]] = [...r[a["status"]] || [], a];
                return r;
                }, {});
                stackGraphData.push(group)
            }

            // Final sorting for stack data
            var stackDataSet = []
            // for(var i=0; i<stackGraphData.length; i++){
            //     var datset = []
            //     for(var j=0; j<4; j++){
            //         var dtSET = stackGraphData[i][Object.keys(stackGraphData[i])[j]] ? 
            //         stackGraphData[i][Object.keys(stackGraphData[i])[j]].length : 0;
            //         datset.push(dtSET);
            //     }
            //     stackDataSet.push(datset)
            // }


            for(var j=0; j<4; j++){
                var datset = []
                for(var i=0; i<stackGraphData.length; i++){
                    var dtSET = stackGraphData[i][Object.keys(stackGraphData[i])[j]] ?
                    stackGraphData[i][Object.keys(stackGraphData[i])[j]].length : 0;
                    datset.push(dtSET);
                }
                stackDataSet.push(datset)
            }
        }if(sortBy === "MaterialReceipt"){
            
            var stackGraphData = []
            for(var i=0; i<graphOneData2[0].length; i++){
                var group = graphOneData2[2][graphOneData2[0][i]].reduce((r, a) => {
                r[a["mrnStatus"]] = [...r[a["mrnStatus"]] || [], a];
                return r;
                }, {});
                stackGraphData.push(group)
            }

            // Final sorting for stack data
            var stackDataSet = []
            // for(var i=0; i<stackGraphData.length; i++){
            //     var datset = []
            //     for(var j=0; j<4; j++){
            //         var dtSET = stackGraphData[i][Object.keys(stackGraphData[i])[j]] ? 
            //         stackGraphData[i][Object.keys(stackGraphData[i])[j]].length : 0;
            //         datset.push(dtSET);
            //     }
            //     stackDataSet.push(datset)
            // }


            for(var j=0; j<4; j++){
                var datset = []
                for(var i=0; i<stackGraphData.length; i++){
                    var dtSET = stackGraphData[i][Object.keys(stackGraphData[i])[j]] ?
                    stackGraphData[i][Object.keys(stackGraphData[i])[j]].length : 0;
                    datset.push(dtSET);
                }
                stackDataSet.push(datset)
            }
            
        }
        
        for(var i=0; i<stackDataSet.length; i++){
            var colList = [];
            for(var j=0; j<stackDataSet[i].length; j++){
                colList.push(color[cnt]);
            }
            cnt = cnt + 1;
            stackBgColor.push(colList);
        }
        this.setState({
            stackBgColor: stackBgColor
        })
        return stackDataSet;
    }

    componentDidMount(){
        debugger; 
        const propData = this.props.data
        if(propData.length > 0){
            debugger;
            const propSortBy = propData[1].reportSortBy.value;
            // const propSortBy = "materialIssueStatus";
    
            // const propSortBy = "purchaseOrders";
            // const propSortBy = "MaterialReceipt";
    
            var fromDT = propData[1].fromDate;
            var toDT = propData[1].toDate;
            // var toDT = "1614162633574";
    
            var data = []
        if(propSortBy === "indentingStore" || propSortBy === "materialIssueStatus" ){
            data = propData[0];
        }else if(propSortBy === "purchaseOrders"){
            data = propData[0];
            var sortPurchaseData = []
            for(var i=0; i<data.length; i++){
                if(data[i].purchaseOrderDate >= parseInt(fromDT) && data[i].purchaseOrderDate <= parseInt(toDT)){
                    sortPurchaseData.push(data[i]);
                }
            }
            data = sortPurchaseData;
        }else if( propSortBy === "MaterialReceipt" ){
            data = propData[0];
            var sortPurchaseData = []
            for(var i=0; i<data.length; i++){
                if(data[i].receiptDate >= parseInt(fromDT) && data[i].receiptDate <= parseInt(toDT)){
                    sortPurchaseData.push(data[i]);
                }
            }
            data = sortPurchaseData;
        }

        const hardJSON = propSortBy === "indentingStore" ? [{ 
            "sortBy": ["indent","indentStore", "department", "name"],
            "msgX": "Department",
            "msgY": "No of Application",
            "title": "Indent Issue Store Management Dashboard"
            },
            { 
            "sortBy": ["materialIssueDetails","material","name"],
            "msgX": "Material",
            "msgY": "No of Application",
            "title": "Indent Departmentwise Store Material Dashboard"
            },
            { 
            "sortBy": ["materialIssueDetails","value"],
            "msgX": "No of Orders",
            "msgY": "Order value",
            "title": "Indent MaterialWise Store Order Dashboard"
            }
            ]: propSortBy === "purchaseOrders" ? [
                    { 
                    "sortBy": ["store", "department", "code"],
                    "msgX": "Department",
                    "msgY": "No of Application",
                    "title": "Purchase Order Store Management Dashboard"
                    },
                    { 
                    "sortBy":  ["purchaseOrderDetails","material","name"],
                    "msgX": "Material",
                    "msgY": "No of Application",
                    "title": "Departmentwise Purchase Order Material Report"
                    },
                    { 
                    "sortBy":  ["purchaseOrderDetails","orderQuantity"],
                    "msgX": "Order",
                    "msgY": "No of Application",
                    "title": "Materialwise Purchase Order Report"
                    }
                    ]
                : propSortBy === "MaterialReceipt" ? [
                    { 
                    "sortBy": ["receivingStore", "department", "code"],
                    "msgX": "Department",
                    "msgY": "No of Application",
                    "title": "Material Receipt Store Management Dashboard"
                    },
                    { 
                    "sortBy":  ["receiptDetails","material","name"],
                    "msgX": "Material",
                    "msgY": "No of Application",
                    "title": "Departmentwise Material Reciept Material Report"
                    },
                    { 
                    "sortBy":  ["receiptDetails","unitRate"],
                    "msgX": "Order",
                    "msgY": "No of Application",
                    "title": "Materialwise Material Reciept Order Report"
                    }
                    ]
                    : []

        // Graph One Sorting Function 
        var graphOneData2 = this.graphSorting( propSortBy, hardJSON[0].sortBy, data, "" );
        
        const stackdata = this.stackDataconfig( propSortBy, graphOneData2 )
        
        // Column Data
        const tableData = data[0] ? Object.keys(data[0]) : [];
        var columnData = []
        
        if(propSortBy === "purchaseOrders"){
            for(var i=0; i<tableData.length; i++){
                var itemHeader = {}
                itemHeader["Header"] = this.camelize(tableData[i]);
                itemHeader["accessor"] = tableData[i];
                itemHeader["show"]= (i === 1 || i === 3 || i === 5 || i === 16 || i === 21 ) ? true : false ;
                columnData.push(itemHeader);
            }  
        }else if(propSortBy === "indentingStore" || propSortBy === "materialIssueStatus" ){
            for(var i=0; i<tableData.length; i++){
                var itemHeader = {}
                itemHeader["Header"] = this.camelize(tableData[i]);
                itemHeader["accessor"] = tableData[i];
                itemHeader["show"]= (i === 2 || i === 5 || i === 13 || i === 14 || i === 8 ) ? true : false ;
                columnData.push(itemHeader);
            }
        }else if(propSortBy === "MaterialReceipt" ){
            for(var i=0; i<tableData.length; i++){
                var itemHeader = {}
                itemHeader["Header"] = this.camelize(tableData[i]);
                itemHeader["accessor"] = tableData[i];
                itemHeader["show"]= (i === 2 || i === 9 || i === 20 || i === 21 || i === 23 ) ? true : false ;
                columnData.push(itemHeader);
            }
        }

        // Column Unchange Data 
        const unchangeColumnData = this.columnUnchange(columnData)

        this.setState({
            graphOneLabel: graphOneData2[0],
            graphOneData: graphOneData2[1],
            graphClicked: 0,
            dataOne: graphOneData2[2],
            columnData: columnData,
            unchangeColumnData: unchangeColumnData,
            rowData: data,
            hardJSON: hardJSON,
            stackDataSet : stackdata,
            propSortBy: propSortBy,
            checkData: this.props.data
        });
        }
    }

    componentDidUpdate(){
        debugger;

        const propData = this.props.data
        if(JSON.stringify(this.state.checkData) !== JSON.stringify(propData)){
            debugger;
            const propSortBy = propData[1].reportSortBy.value;
            // const propSortBy = "materialIssueStatus";
    
            // const propSortBy = "purchaseOrders";
            // const propSortBy = "MaterialReceipt";
    
            var fromDT = propData[1].fromDate;
            var toDT = propData[1].toDate;
            // var toDT = "1614162633574";
    
            var data = []
        if(propSortBy === "indentingStore" || propSortBy === "materialIssueStatus" ){
            data = propData[0];
        }else if(propSortBy === "purchaseOrders"){
            data = propData[0];
            var sortPurchaseData = []
            for(var i=0; i<data.length; i++){
                if(data[i].purchaseOrderDate >= parseInt(fromDT) && data[i].purchaseOrderDate <= parseInt(toDT)){
                    sortPurchaseData.push(data[i]);
                }
            }
            data = sortPurchaseData;
        }else if( propSortBy === "MaterialReceipt" ){
            data = propData[0];
            var sortPurchaseData = []
            for(var i=0; i<data.length; i++){
                if(data[i].receiptDate >= parseInt(fromDT) && data[i].receiptDate <= parseInt(toDT)){
                    sortPurchaseData.push(data[i]);
                }
            }
            data = sortPurchaseData;
        }

        const hardJSON = propSortBy === "indentingStore" ? [{ 
            "sortBy": ["indent","indentStore", "department", "name"],
            "msgX": "Department",
            "msgY": "No of Application",
            "title": "Indent Issue Store Management Dashboard"
            },
            { 
            "sortBy": ["materialIssueDetails","material","name"],
            "msgX": "Material",
            "msgY": "No of Application",
            "title": "Indent Departmentwise Store Material Dashboard"
            },
            { 
            "sortBy": ["materialIssueDetails","value"],
            "msgX": "No of Orders",
            "msgY": "Order value",
            "title": "Indent MaterialWise Store Order Dashboard"
            }
            ]: propSortBy === "purchaseOrders" ? [
                    { 
                    "sortBy": ["store", "department", "code"],
                    "msgX": "Department",
                    "msgY": "No of Application",
                    "title": "Purchase Order Store Management Dashboard"
                    },
                    { 
                    "sortBy":  ["purchaseOrderDetails","material","name"],
                    "msgX": "Material",
                    "msgY": "No of Application",
                    "title": "Departmentwise Purchase Order Material Report"
                    },
                    { 
                    "sortBy":  ["purchaseOrderDetails","orderQuantity"],
                    "msgX": "Order",
                    "msgY": "No of Application",
                    "title": "Materialwise Purchase Order Report"
                    }
                    ]
                : propSortBy === "MaterialReceipt" ? [
                    { 
                    "sortBy": ["receivingStore", "department", "code"],
                    "msgX": "Department",
                    "msgY": "No of Application",
                    "title": "Material Receipt Store Management Dashboard"
                    },
                    { 
                    "sortBy":  ["receiptDetails","material","name"],
                    "msgX": "Material",
                    "msgY": "No of Application",
                    "title": "Departmentwise Material Reciept Material Report"
                    },
                    { 
                    "sortBy":  ["receiptDetails","unitRate"],
                    "msgX": "Order",
                    "msgY": "No of Application",
                    "title": "Materialwise Material Reciept Order Report"
                    }
                    ]
                    : []

        // Graph One Sorting Function 
        var graphOneData2 = this.graphSorting( propSortBy, hardJSON[0].sortBy, data, "" );
        
        const stackdata = this.stackDataconfig( propSortBy, graphOneData2 )
        
        // Column Data
        const tableData = data[0] ? Object.keys(data[0]) : [];
        var columnData = []
        
        if(propSortBy === "purchaseOrders"){
            for(var i=0; i<tableData.length; i++){
                var itemHeader = {}
                itemHeader["Header"] = this.camelize(tableData[i]);
                itemHeader["accessor"] = tableData[i];
                itemHeader["show"]= (i === 1 || i === 3 || i === 5 || i === 16 || i === 21 ) ? true : false ;
                columnData.push(itemHeader);
            }  
        }else if(propSortBy === "indentingStore" || propSortBy === "materialIssueStatus" ){
            for(var i=0; i<tableData.length; i++){
                var itemHeader = {}
                itemHeader["Header"] = this.camelize(tableData[i]);
                itemHeader["accessor"] = tableData[i];
                itemHeader["show"]= (i === 2 || i === 5 || i === 13 || i === 14 || i === 8 ) ? true : false ;
                columnData.push(itemHeader);
            }
        }else if(propSortBy === "MaterialReceipt" ){
            for(var i=0; i<tableData.length; i++){
                var itemHeader = {}
                itemHeader["Header"] = this.camelize(tableData[i]);
                itemHeader["accessor"] = tableData[i];
                itemHeader["show"]= (i === 2 || i === 9 || i === 20 || i === 21 || i === 23 ) ? true : false ;
                columnData.push(itemHeader);
            }
        }

        // Column Unchange Data 
        const unchangeColumnData = this.columnUnchange(columnData)

        this.setState({
            graphOneLabel: graphOneData2[0],
            graphOneData: graphOneData2[1],
            graphClicked: 0,
            dataOne: graphOneData2[2],
            columnData: columnData,
            unchangeColumnData: unchangeColumnData,
            rowData: data,
            hardJSON: hardJSON,
            stackDataSet : stackdata,
            propSortBy: propSortBy,
            checkData: this.props.data
        })
        }
    }

    render() {
    
    // Stacked/ Mixed Graph
    var stackGraphData = {
        labels: this.state.graphOneLabel,
        // labels: ["Label1", "Label2"],
        datasets: [
            {
            label:  "Label1",
            fill: false,
            lineTension: 0.1,
            hoverBorderWidth : 12,
            backgroundColor : this.state.stackBgColor[0],
            borderColor: "rgba(75,192,192,0.4)",
            borderCapStyle: "butt",
            barPercentage: 2,
            borderWidth: 5,
            barThickness: 25,
            maxBarThickness: 25,
            minBarLength: 2,
            data: this.state.stackDataSet[0]
            // data:[10,20,30, 40]
            },
            {
            label:  "Label2",
            fill: false,
            lineTension: 0.1,
            hoverBorderWidth : 12,
            // backgroundColor : this.state.colorRandom,
            backgroundColor :this.state.stackBgColor[1],
            borderColor: "rgba(75,192,192,0.4)",
            borderCapStyle: "butt",
            barPercentage: 2,
            borderWidth: 5,
            barThickness: 25,
            maxBarThickness: 25,
            minBarLength: 2,
            data: this.state.stackDataSet[1]
            // data:[10,20,30]
            },
            {
            label:  "Label3",
            fill: false,
            lineTension: 0.1,
            hoverBorderWidth : 12,
            // backgroundColor : this.state.colorRandom,
            backgroundColor : this.state.stackBgColor[2],
            borderColor: "rgba(75,192,192,0.4)",
            borderCapStyle: "butt",
            barPercentage: 2,
            borderWidth: 5,
            barThickness: 25,
            maxBarThickness: 25,
            minBarLength: 2,
            data: this.state.stackDataSet[2]
            // data:[10,20,30]
            },
            {
            label:  "Label4",
            fill: false,
            lineTension: 0.1,
            hoverBorderWidth : 12,
            // backgroundColor : this.state.colorRandom,
            backgroundColor : this.state.stackBgColor[3],
            borderColor: "rgba(75,192,192,0.4)",
            borderCapStyle: "butt",
            barPercentage: 2,
            borderWidth: 5,
            barThickness: 25,
            maxBarThickness: 25,
            minBarLength: 2,
            data: this.state.stackDataSet[3]
            // data:[10,20,30]
            }
        ]
    }

    var stackGraphOption = {
        responsive : true,
        // aspectRatio : 3,
        maintainAspectRatio: false,
        cutoutPercentage : 0,
        datasets : [
            {
            // backgroundColor : "rgba(0, 0, 0, 0.1)",
            weight: 0
            }
        ], 
        legend: {
            display: false,
            position: 'bottom',
            labels: {
            fontFamily: "Comic Sans MS",
            boxWidth: 20,
            boxHeight: 2
            }
        },
        tooltips: {
            enabled: true
        },
        title: {
            display: true,
            text: this.state.hardJSON[0] ? this.state.hardJSON[0].title : ""
        },
        scales: {
            xAxes: [{
                stacked: true,
                gridLines: {
                    display:true
                },
                scaleLabel: {
                    display: true,
                    labelString: this.state.hardJSON[0] ? this.state.hardJSON[0].msgX : ""
                    }, 
            }],
            yAxes: [{
                stacked: true,
                gridLines: {
                    display:true
                },
                ticks: {
                    // suggestedMin: 0,
                    // suggestedMax: 100,
                    beginAtZero: true,
                    stepSize: 1
                },
                scaleLabel: {
                    display: true,
                    labelString: this.state.hardJSON[0] ? this.state.hardJSON[0].msgY : ""
                    }, 
            }]
        },
        plugins: {
            datalabels: {
                display: false
            //     color: 'white',
            //     backgroundColor: 'grey',
            //     labels: {
            //         title: {
            //             font: {
            //                 weight: 'bold'
            //             }
            //         }
            //     }}
            }
        },
        onClick: (e, element) => {
            if (element.length > 0) {
                
                
                var ind = element[0]._index;   
                const selectedVal = this.state.graphOneLabel[ind];
                // var graphSorting = this.graphSorting( this.state.graphHardTwoData.sortBy, this.state.dataOne[selectedVal] );
                const hardval = this.state.hardJSON[1]
                var graphSorting = this.graphSorting( this.state.propSortBy, hardval.sortBy, this.state.dataOne[selectedVal], "ONE" );
                // alert(ind)
                this.setState({
                    graphTwoLabel: graphSorting[0],
                    graphTwoData: graphSorting[1],
                    dataTwo: graphSorting[2],
                    graphClicked: 1,
                    rowData: this.state.dataOne[selectedVal]
                })
                
            }
        },
    }    

    // First Double Bar Graph Graph
    var PIEgraphOneSortedData = {
        labels: this.state.graphOneLabel,
        // labels: ["Label1", "Label2"],
        datasets: [
            {
            label:  "Label",
            fill: false,
            lineTension: 0.1,
            hoverBorderWidth : 12,
            // backgroundColor : this.state.colorRandom,
            backgroundColor : ["#F77C15", "#385BC8", "", "#FFC300", "#348AE4", "#FF5733", "#9DC4E1", "#3A3B7F", "", "", "", "", "", ""],
            borderColor: "rgba(75,192,192,0.4)",
            borderCapStyle: "butt",
            barPercentage: 2,
            borderWidth: 5,
            barThickness: 25,
            maxBarThickness: 10,
            minBarLength: 2,
            data: this.state.graphOneData
            // data:[10,20,30]
            }
        ]
    }

    var PIEgraphOneOption = {
        responsive : true,
        // aspectRatio : 3,
        maintainAspectRatio: false,
        cutoutPercentage : 0,
        datasets : [
            {
            backgroundColor : "rgba(0, 0, 0, 0.1)",
            weight: 0
            }
        ], 
        legend: {
            display: false,
            position: 'bottom',
            labels: {
            fontFamily: "Comic Sans MS",
            boxWidth: 20,
            boxHeight: 2
            }
        },
        tooltips: {
            enabled: true
        },
        title: {
            display: true,
            text: this.state.hardJSON[0] ? this.state.hardJSON[0].title : ""
        },
        scales: {
            xAxes: [{
                gridLines: {
                    display:true
                },
                scaleLabel: {
                    display: true,
                    labelString: this.state.hardJSON[0] ? this.state.hardJSON[0].msgX : ""
                    }, 
            }],
            yAxes: [{
                gridLines: {
                    display:true
                },
                ticks: {
                    // suggestedMin: 0,
                    // suggestedMax: 100,
                    beginAtZero: true,
                    stepSize: 1
                },
                scaleLabel: {
                    display: true,
                    labelString: this.state.hardJSON[0] ? this.state.hardJSON[0].msgY : ""
                    }, 
            }]
        },
        plugins: {
            datalabels: {
                display: false
            //     color: 'white',
            //     backgroundColor: 'grey',
            //     labels: {
            //         title: {
            //             font: {
            //                 weight: 'bold'
            //             }
            //         }
            //     }}
            }
        },
        onClick: (e, element) => {
            if (element.length > 0) {
                
                
                // var ind = element[0]._index;   
                // const selectedVal = this.state.graphOneLabel[ind];
                // // var graphSorting = this.graphSorting( this.state.graphHardTwoData.sortBy, this.state.dataOne[selectedVal] );
                // const hardval = this.state.hardJSON[1]
                // var graphSorting = this.graphSorting( this.state.propSortBy, hardval.sortBy, this.state.dataOne[selectedVal], "" );
                
                // this.setState({
                //     graphTwoLabel: graphSorting[0],
                //     graphTwoData: graphSorting[1],
                //     dataTwo: graphSorting[2],
                //     graphClicked: 1,
                //     rowData: this.state.dataOne[selectedVal]
                // })
                
            }
        },
    }
    

    // Second Horizontal Graph
    var graphTwoSortedData = {
        labels: this.state.graphTwoLabel,
        datasets: [
            {
            // label: this.state.drildownGraphLabel,
            fill: false,
            lineTension: 5,
            hoverBorderWidth : 12,
            // backgroundColor : this.state.colorRandom,
            backgroundColor : ["#F77C15", "#385BC8", "", "#FFC300", "#348AE4", "#FF5733", "#9DC4E1", "#3A3B7F", "", "", "", "", "", ""],
            borderColor: "rgba(75,192,192,0.4)",
            borderCapStyle: "butt",
            barPercentage: 2,
            barThickness: 25,
            maxBarThickness: 25,
            minBarLength: 2,
            data: this.state.graphTwoData
            }
        ]
    }

    var graphTwoOption = {
        responsive : true,
        // aspectRatio : 3,
        maintainAspectRatio: false,
        cutoutPercentage : 0,
        datasets : [
            {
            backgroundColor : "rgba(0, 0, 0, 0.1)",
            weight: 0
            }
        ], 
        legend: {
            display: false,
            position: 'bottom',
            labels: {
            fontFamily: "Comic Sans MS",
            boxWidth: 20,
            boxHeight: 2
            }
        },
        tooltips: {
            enabled: true
        },
        title: {
            display: true,
            text: this.state.hardJSON[1] ? this.state.hardJSON[1].title : ""
        },
        onClick: (e, element) => {
            if (element.length > 0) {
                
                debugger;
                var ind = element[0]._index;   
                const selectedVal = this.state.graphTwoLabel[ind];
                // var graphSorting = this.graphSorting( this.state.graphHardTwoData.sortBy, this.state.dataOne[selectedVal] );
                const hardval = this.state.hardJSON[2]
                var graphSorting = this.graphSorting( this.state.propSortBy, hardval.sortBy, this.state.dataTwo[selectedVal], "TWO" );
                
                this.setState({
                    graphThirdLabel: graphSorting[0],
                    graphThirdData: graphSorting[1],
                    dataThird: graphSorting[2],
                    graphClicked: 2,
                    rowData: this.state.dataTwo[selectedVal]
                })
            }
        },
        scales: {
            xAxes: [{
                gridLines: {
                    display:true
                },
                ticks: {
                    suggestedMin: 0,
                    // suggestedMax: 100,
                    beginAtZero: true,
                    stepSize: 1
                },
                scaleLabel: {
                    display: true,
                    labelString: this.state.hardJSON[1] ? this.state.hardJSON[1].msgX : ""
                    }, 
            }],
            yAxes: [{
                gridLines: {
                    display: true
                },
                ticks: {
                    suggestedMin: 0,
                    beginAtZero: true,
                    stepSize: 1
                },
                scaleLabel: {
                    display: true,
                    labelString: this.state.hardJSON[1] ? this.state.hardJSON[1].msgY : ""
                    }, 
            }]
        },
        plugins: {
            datalabels: {
                display: false
            //     color: 'white',
            //     backgroundColor: 'grey',
            //     labels: {
            //         title: {
            //             font: {
            //                 weight: 'bold'
            //             }
            //         }
            //     }}
            }
            }
    }

    // Third Horizontal Graph
    var graphThirdSortedData = {
        labels: this.state.graphThirdData,
        datasets: [
            {
            // label: this.state.drildownGraphLabel,
            fill: false,
            lineTension: 5,
            hoverBorderWidth : 12,
            // backgroundColor : this.state.colorRandom,
            backgroundColor : ["#F77C15", "#385BC8", "", "#FFC300", "#348AE4", "#FF5733", "#9DC4E1", "#3A3B7F", "", "", "", "", "", ""],
            borderColor: "rgba(75,192,192,0.4)",
            borderCapStyle: "butt",
            barPercentage: 2,
            barThickness: 25,
            maxBarThickness: 25,
            minBarLength: 2,
            data: this.state.graphThirdLabel
            }
        ]
    }

    var graphThirdOption = {
        responsive : true,
        // aspectRatio : 3,
        maintainAspectRatio: false,
        cutoutPercentage : 0,
        datasets : [
            {
            backgroundColor : "rgba(0, 0, 0, 0.1)",
            weight: 0
            }
        ], 
        legend: {
            display: false,
            position: 'bottom',
            labels: {
            fontFamily: "Comic Sans MS",
            boxWidth: 20,
            boxHeight: 2
            }
        },
        tooltips: {
            enabled: true
        },
        title: {
            display: true,
            text: this.state.hardJSON[2] ? this.state.hardJSON[2].title : ""
        },
        onClick: (e, element) => {
            if (element.length > 0) {
                var ind = element[0]._index;
                debugger;
                const selectedVal = this.state.graphThirdLabel[ind];
                
                this.setState({
                    graphClicked: 2,
                    rowData: this.state.dataThird[selectedVal]
                })
            }
        },
        scales: {
            xAxes: [{
                gridLines: {
                    display:true
                },
                ticks: {
                    suggestedMin: 0,
                    // suggestedMax: 100,
                    beginAtZero: true,
                    stepSize: 1
                },
                scaleLabel: {
                    display: true,
                    labelString: this.state.hardJSON[2] ? this.state.hardJSON[2].msgX : ""
                    }, 
            }],
            yAxes: [{
                gridLines: {
                    display: true
                },
                ticks: {
                    suggestedMin: 0,
                    beginAtZero: true,
                    stepSize: 1
                },
                scaleLabel: {
                    display: true,
                    labelString: this.state.hardJSON[2] ? this.state.hardJSON[2].msgY : ""
                    }, 
            }]
        },
        plugins: {
            datalabels: {
                display: false
            //     color: 'white',
            //     backgroundColor: 'grey',
            //     labels: {
            //         title: {
            //             font: {
            //                 weight: 'bold'
            //             }
            //         }
            //     }}
            }
            }
    }


        
    return (
        <div >
            {
                this.state.graphClicked >= 0 ? 
                <CardContent style={{height:"500px", width:"100%"}}>
                    <React.Fragment>
                        <Bar
                        data={ stackGraphData }
                        options={ stackGraphOption } 
                        />
                    </React.Fragment>
                </CardContent>
                :null
            }
            <div className="graphDashboard">
            {
                this.state.graphClicked > 0 ?
                <CardContent  className="halfGraph">
                    <React.Fragment>
                        <Bar
                        data={ graphTwoSortedData } 
                        options={ graphTwoOption } 
                        />
                    </React.Fragment>
                </CardContent> 
                :null
            }

            {
                this.state.graphClicked > 1 ?
                <CardContent className="halfGraph">
                    <React.Fragment>
                        <Bar
                        data={ graphThirdSortedData } 
                        options={ graphThirdOption } 
                        />
                    </React.Fragment>
                </CardContent> 
                :null
            }
            </div>

        {/* Table Feature  */}
        <div className= {this.state.graphClicked >= 0 ? "tableContainer" : ""}>
        {
            this.state.unchangeColumnData.length > 0  ? 
            <div className="tableFeature">
                <div className="columnToggle-Text"> Download As: </div>
                <button className="columnToggleBtn" onClick={this.pdfDownload}> PDF </button>

                <button className="columnToggleBtn" onClick={this.toggleColumn}> Column Visibility </button>
            </div>
            :null
        }
        {
            this.state.toggleColumnCheck ?
            <div className="columnVisibilityCard">
            <dl>
                {
                    this.state.unchangeColumnData.map((data, index)=>{
                        return(
                            <ul className={ this.state.unchangeColumnData[index]["show"] ? "" : "toggleBtnClicked" }><button value={index} className={ this.state.unchangeColumnData[index]["show"] ? "toggleBtn" : "toggleBtnClicked" } onClick={ this.showHideColumn }> { this.state.unchangeColumnData[index]["Header"] } </button></ul> 
                        )
                    })
                }
            </dl>
            </div> 
            : null
        }

        {
            this.state.graphClicked >= 0 ?
            <ReactTable id="customReactTable"
            // PaginationComponent={Pagination}
            data={ this.state.rowData }  
            columns={ this.state.columnData }  
            defaultPageSize = {this.state.rowData.length > 10 ? 10 : this.state.rowData.length}
            pageSize={this.state.rowData.length > 10 ? 10 : this.state.rowData.length}  
            pageSizeOptions = {[20,40,60]}  
            /> 
            :null
        }
        </div>
        </div>
    );
    }
}

export default DashboardStoreManagement;