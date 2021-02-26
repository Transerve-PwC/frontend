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
import EChallandata from './EChallan_data.json';
import './index.css'

class DashboardEchallan extends React.Component {
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
        graphTwoData: [],
        graphThirdLabel: [],
        graphThirdData: [],
        graphClicked: -1,
        hardJSON: [],
        graphHardOneData : {},
        graphHardTwoData : {},
        graphHardThirdData : {},
        graphHardFourthData : {},
        graphHardFifthData : {},
        graphHardSixthData: {},
        rowData: [],
        columnData: [],
        // Double Graph data
        graphFourthLabel: [],
        graphFourthData: [],
        dataFourth: [],
        graphFifthLabel: [],
        graphFifthData: [],
        dataFifth: [],
        graphSixthData: [],
        graphSixthLabel: [],
        dataSixth: [],
        // Feature Table
        toggleColumnCheck: false,
        unchangeColumnData: []
    }
  }

    // PDF function 
    pdfDownload = (e) => {

    debugger;
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


    debugger;
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
    const pdfTitle = this.state.graphHardOneData ? this.state.graphHardOneData.title : "Title"
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
        // e.preventDefault();
        debugger;
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
        debugger;
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
        debugger;
        const data = this.state.columnData
        this.setState({
            toggleColumnCheck : !this.state.toggleColumnCheck
        })
    }
    
    graphSorting = ( sortBy, data, checkGraph ) => {

    
    debugger;
    // passing sortBy, data
    if(typeof(sortBy) === "object" && checkGraph === this.state.graphHardThirdData.sortBy[2]){
        var sortNo = null;

        const sortpaymentStatus = [sortBy[0],sortBy[1], checkGraph] 
        var group = data.reduce((r, a) => {
            r[new Date(a[sortBy[0]][sortBy[1]]).getMonth()] = [...r[new Date(a[sortBy[0]][sortBy[1]]).getMonth()] || [], a];
            return r;
            }, {});
        
        var graphOneLabel = Object.keys(group);

        var graphOneData = []
        var PAID = []
        var PENDING = []
        for(var i=0; i<Object.keys(group).length ; i++){
            // Data in two parts
            const monthwiseData = group[graphOneLabel[i]]
            var group2 = monthwiseData.reduce((r, a) => {
                r[a[sortBy[0]][checkGraph]] = [...r[a[sortBy[0]][checkGraph]] || [], a];
                return r;
                }, {});
            const dataPAID = group2[sortBy[3]] ? group2[sortBy[3]].length : 0
            const dataPENDING = group2[sortBy[4]] ? group2[sortBy[4]].length : 0
            PAID.push(dataPAID);
            PENDING.push(dataPENDING)
            // graphOneData.push(group[graphOneLabel[i]].length);
            
        }
        graphOneData.push(PAID, PENDING);
    
        var monthData = {}
        var mL = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];    
        var graphOneLabel = Object.keys(group);
        for(var i=0; i<graphOneLabel.length; i++)
        {
            monthData[graphOneLabel[i]] = mL[graphOneLabel[i]]
        }

        graphOneLabel = Object.values(monthData);
        

        return [ graphOneLabel, graphOneData, group ]

    }else if(typeof(sortBy) === "object" && checkGraph === this.state.graphHardFourthData.sortBy[2]){
        
        
        // Graph for PAyment Online or Offline
        const nullJSON = sortBy[3]
        var sortedGroup ={}
        var group = data.reduce((r, a) => {
            r[a[sortBy[0]][sortBy[1]]] = [...r[a[sortBy[0]][sortBy[1]]] || [], a];
            return r;
            }, {});
        for(var i=0; i<Object.keys(group).length; i++){
            if(Object.keys(group)[i] !== Object.keys(nullJSON)[0]){
                sortedGroup[Object.keys(group)[i]] = group[Object.keys(group)[i]]
            }
        }
        // group = sortedGroup
        var graphOneLabel = Object.keys(group);
        var graphOneData = [];

        for(var i=0; i<Object.keys(group).length ; i++){
            
            graphOneData.push(group[graphOneLabel[i]].length);
        }

        for(var i=0; i<Object.keys(group).length ; i++){
            if(graphOneLabel[i] === Object.keys(nullJSON)[0]){
                graphOneLabel[i] = Object.values(nullJSON)[0]
            }
        }
        // var rowData = []
        // var dataList = [group["OFFLINE"]]
        // rowData.push(dataList);

        return [ graphOneLabel, graphOneData, group ]

    }else{
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

    componentDidMount(){
        

    debugger;
    const propsData = this.props.data;
    const propSortBy = propsData[1] ? propsData[1].value : [];
    // Graph Hard JSON Create :: 
    var hardJSON = propSortBy === "status" ? [
        {
        "sortBy": "status",
        "msgX": "Status",
        "msgY": "No of Challan",
        "title": "Statuswise Challan Report"
        }, 
        {
        "sortBy": "encroachmentType",
        "msgX": "No of Challan",
        "msgY": "Encroachment Type",
        "title": "Encroachment Type wise Challan Status Report"
        },
        { 
        "sortBy": ["paymentDetails","lastModifiedTime","paymentStatus","PAID","PENDING"],
        "msgX": "Months",
        "msgY": "No of Challan",
        "title": "Challan Monthly Payment Status"
        },
        { 
        "sortBy": ["paymentDetails","paymentMode","PAIDPaymentMode",{"null":"PENDING"}],
        "msgX": "",
        "msgY": "",
        "title": "Payment Collection By Source"
        },
        { 
        "sortBy": "siName",
        "msgX": "Challan By SI",
        "msgY": "No of Challan",
        "title": "Challan Generation SI Wise"
        },
        { 
        "sortBy": "sector",
        "msgX": "Areawise Challan",
        "msgY": "No of Challan",
        "title": "Challan Generation Area Wise"
        }
    ]
    : propSortBy === "encroachmentType" ? [
        {
        "sortBy": "encroachmentType",
        "msgX": "Encroachment Type",
        "msgY": "No of Challan",
        "title": "Encroachment Typewise Challan Report"
        }, 
        { 
        "sortBy": "siName",
        "msgX": "No of Challan",
        "msgY": "Challan By SI",
        "title": "Challan Generation SI Wise"
        },
        { 
        "sortBy": ["paymentDetails","lastModifiedTime","paymentStatus","PAID","PENDING"],
        "msgX": "Months",
        "msgY": "No of Challan",
        "title": "Challan Monthly Payment Status"
        },
        { 
        "sortBy": ["paymentDetails","paymentMode","PAIDPaymentMode",{"null":"PENDING"}],
        "msgX": "",
        "msgY": "",
        "title": "Payment Collection By Source"
        },
        { 
        "sortBy": "sector",
        "msgX": "Areawise Challan",
        "msgY": "No of Challan",
        "title": "Challan Generation Area Wise"
        },
        {
        "sortBy": "status",
        "msgX": "Status",
        "msgY": "No of Challan",
        "title": "Encroachment Typewise Challan Status Report"
        }
    ] : propSortBy === "siName" ? [
        { 
        "sortBy": "siName",
        "msgX": "Challan By SI",
        "msgY": "No of Challan",
        "title": "Challan Generation SI Wise"
        },
        { 
        "sortBy": "sector",
        "msgX": "No of Challan",
        "msgY": "Areawise Challan",
        "title": "Challan Generation Area Wise"
        },
        { 
        "sortBy": ["paymentDetails","lastModifiedTime","paymentStatus","PAID","PENDING"],
        "msgX": "Months",
        "msgY": "No of Challan",
        "title": "Challan Monthly Payment Status"
        },
        { 
        "sortBy": ["paymentDetails","paymentMode","PAIDPaymentMode",{"null":"PENDING"}],
        "msgX": "",
        "msgY": "",
        "title": "Payment Collection By Source"
        },
        {
        "sortBy": "status",
        "msgX": "Status",
        "msgY": "No of Challan",
        "title": "Areawise Challan Status Report"
        },
        {
        "sortBy": "encroachmentType",
        "msgX": "Encroachment Type",
        "msgY": "No of Challan",
        "title": "Areawise Challan Encroachment Type Report"
        }
    ] : propSortBy === "sector" ? [
        { 
        "sortBy": "sector",
        "msgX": "Areawise Challan",
        "msgY": "No of Challan",
        "title": "Challan Generation Area Wise"
        },
        {
        "sortBy": "status",
        "msgX": "No of Challan",
        "msgY": "Status",
        "title": "Statuswise Challan Area Report"
        },
        { 
        "sortBy": ["paymentDetails","lastModifiedTime","paymentStatus","PAID","PENDING"],
        "msgX": "Months",
        "msgY": "No of Challan",
        "title": "Challan Monthly Payment Status"
        },
        { 
        "sortBy": ["paymentDetails","paymentMode","PAIDPaymentMode",{"null":"PENDING"}],
        "msgX": "",
        "msgY": "",
        "title": "Payment Collection By Source"
        },
        {
        "sortBy": "encroachmentType",
        "msgX": "Encroachment Type",
        "msgY": "No of Challan",
        "title": "Encroachment Type wise Challan Area Report"
        },
        { 
        "sortBy": "siName",
        "msgX": "No of Challan",
        "msgY": "Challan By SI",
        "title": "Challan Generation SI Wise"
        }
    ] : []

    this.setState({
        hardJSON: hardJSON,
        graphHardOneData : hardJSON[0],
        graphHardTwoData : hardJSON[1],
        graphHardThirdData : hardJSON[2],
        graphHardFourthData : hardJSON[3],
        graphHardFifthData : hardJSON[4],
        graphHardSixthData : hardJSON[5],

    })
    if(JSON.stringify(propsData) !== JSON.stringify(this.state.checkData)){
    // const propSortBy = "status";
    // const propSortBy = "encroachmentType";
    // const propSortBy = "siName";
    // const propSortBy = "sector";
    const data = propsData[0] ? propsData[0].ResponseBody : [];
    

    // Graph One Sorting Function 
    var graphOneData = this.graphSorting( propSortBy, data );
    debugger;
    // Table Data Header 
    const tableData = data[0] ? Object.keys(data[0]) : [];
    var columnData = []
    for(var i=0; i<tableData.length; i++){
        var itemHeader = {}
        itemHeader["Header"] = this.camelize(tableData[i]);
        itemHeader["accessor"] = tableData[i];
        itemHeader["show"]= (i === 4 || i === 5 || i === 8 || i === 9 || i === 23 || i === 24 || i === 24 ) ? true : false
        columnData.push(itemHeader);

    }

    // Parsing 2nd level for column
    var itemHeader = {}
    itemHeader["Header"] = "Payment Mode";
    itemHeader["accessor"] = "paymentDetails.paymentMode";
    itemHeader["show"] = true
    columnData.push(itemHeader);

    var itemHeader = {}
    itemHeader["Header"] = "Payment Status";
    itemHeader["accessor"] = "paymentDetails.paymentStatus";
    itemHeader["show"] = true
    columnData.push(itemHeader);

    // Column Unchange Data 
    const unchangeColumnData = this.columnUnchange(columnData)

    debugger;
    this.setState({
        checkData: propsData,
        allData: data,
        graphOneLabel: graphOneData[0],
        graphOneData: graphOneData[1],
        graphClicked: 0,
        dataOne: graphOneData[2],
        columnData: columnData,
        rowData: data,
        unchangeColumnData: unchangeColumnData
    })
    }
    }

    componentDidUpdate(){
        debugger;
        const propsData = this.props.data;
        if(JSON.stringify(propsData) !== JSON.stringify(this.state.checkData)){
        // const propSortBy = "status";
        // const propSortBy = "encroachmentType";
        // const propSortBy = "siName";
        // const propSortBy = "sector";
        
        const propSortBy = propsData[1] ? propsData[1].value : [];
        const data = propsData[0] ? propsData[0].ResponseBody : [];

        // Graph One Sorting Function 
        var graphOneData = this.graphSorting( propSortBy, data );

        // Graph Hard JSON Create :: 
        var hardJSON = propSortBy === "status" ? [
            {
            "sortBy": "status",
            "msgX": "Status",
            "msgY": "No of Challan",
            "title": "Statuswise Challan Report"
            }, 
            {
            "sortBy": "encroachmentType",
            "msgX": "No of Challan",
            "msgY": "Encroachment Type",
            "title": "Encroachment Type wise Challan Status Report"
            },
            { 
            "sortBy": ["paymentDetails","lastModifiedTime","paymentStatus","PAID","PENDING"],
            "msgX": "Months",
            "msgY": "No of Challan",
            "title": "Challan Monthly Payment Status"
            },
            { 
            "sortBy": ["paymentDetails","paymentMode","PAIDPaymentMode",{"null":"PENDING"}],
            "msgX": "",
            "msgY": "",
            "title": "Payment Collection By Source"
            },
            { 
            "sortBy": "siName",
            "msgX": "Challan By SI",
            "msgY": "No of Challan",
            "title": "Challan Generation SI Wise"
            },
            { 
            "sortBy": "sector",
            "msgX": "Areawise Challan",
            "msgY": "No of Challan",
            "title": "Challan Generation Area Wise"
            }
        ]
        : propSortBy === "encroachmentType" ? [
            {
            "sortBy": "encroachmentType",
            "msgX": "Encroachment Type",
            "msgY": "No of Challan",
            "title": "Encroachment Typewise Challan Report"
            }, 
            { 
            "sortBy": "siName",
            "msgX": "No of Challan",
            "msgY": "Challan By SI",
            "title": "Challan Generation SI Wise"
            },
            { 
            "sortBy": ["paymentDetails","lastModifiedTime","paymentStatus","PAID","PENDING"],
            "msgX": "Months",
            "msgY": "No of Challan",
            "title": "Challan Monthly Payment Status"
            },
            { 
            "sortBy": ["paymentDetails","paymentMode","PAIDPaymentMode",{"null":"PENDING"}],
            "msgX": "",
            "msgY": "",
            "title": "Payment Collection By Source"
            },
            { 
            "sortBy": "sector",
            "msgX": "Areawise Challan",
            "msgY": "No of Challan",
            "title": "Challan Generation Area Wise"
            },
            {
            "sortBy": "status",
            "msgX": "Status",
            "msgY": "No of Challan",
            "title": "Encroachment Typewise Challan Status Report"
            }
        ] : propSortBy === "siName" ? [
            { 
            "sortBy": "siName",
            "msgX": "Challan By SI",
            "msgY": "No of Challan",
            "title": "Challan Generation SI Wise"
            },
            { 
            "sortBy": "sector",
            "msgX": "No of Challan",
            "msgY": "Areawise Challan",
            "title": "Challan Generation Area Wise"
            },
            { 
            "sortBy": ["paymentDetails","lastModifiedTime","paymentStatus","PAID","PENDING"],
            "msgX": "Months",
            "msgY": "No of Challan",
            "title": "Challan Monthly Payment Status"
            },
            { 
            "sortBy": ["paymentDetails","paymentMode","PAIDPaymentMode",{"null":"PENDING"}],
            "msgX": "",
            "msgY": "",
            "title": "Payment Collection By Source"
            },
            {
            "sortBy": "status",
            "msgX": "Status",
            "msgY": "No of Challan",
            "title": "Areawise Challan Status Report"
            },
            {
            "sortBy": "encroachmentType",
            "msgX": "Encroachment Type",
            "msgY": "No of Challan",
            "title": "Areawise Challan Encroachment Type Report"
            }
        ] : propSortBy === "sector" ? [
            { 
            "sortBy": "sector",
            "msgX": "Areawise Challan",
            "msgY": "No of Challan",
            "title": "Challan Generation Area Wise"
            },
            {
            "sortBy": "status",
            "msgX": "No of Challan",
            "msgY": "Status",
            "title": "Statuswise Challan Area Report"
            },
            { 
            "sortBy": ["paymentDetails","lastModifiedTime","paymentStatus","PAID","PENDING"],
            "msgX": "Months",
            "msgY": "No of Challan",
            "title": "Challan Monthly Payment Status"
            },
            { 
            "sortBy": ["paymentDetails","paymentMode","PAIDPaymentMode",{"null":"PENDING"}],
            "msgX": "",
            "msgY": "",
            "title": "Payment Collection By Source"
            },
            {
            "sortBy": "encroachmentType",
            "msgX": "Encroachment Type",
            "msgY": "No of Challan",
            "title": "Encroachment Type wise Challan Area Report"
            },
            { 
            "sortBy": "siName",
            "msgX": "No of Challan",
            "msgY": "Challan By SI",
            "title": "Challan Generation SI Wise"
            }
        ] : []

        debugger;
        // Table Data Header 
        const tableData = data[0] ? Object.keys(data[0]) : [];
        var columnData = []
        for(var i=0; i<tableData.length; i++){
            var itemHeader = {}
            itemHeader["Header"] = this.camelize(tableData[i]);
            itemHeader["accessor"] = tableData[i];
            itemHeader["show"]= (i === 4 || i === 5 || i === 8 || i === 9 || i === 23 || i === 24 || i === 24 ) ? true : false
            columnData.push(itemHeader);

        }

        // Parsing 2nd level for column
        var itemHeader = {}
        itemHeader["Header"] = "Payment Mode";
        itemHeader["accessor"] = "paymentDetails.paymentMode";
        itemHeader["show"] = true
        columnData.push(itemHeader);

        var itemHeader = {}
        itemHeader["Header"] = "Payment Status";
        itemHeader["accessor"] = "paymentDetails.paymentStatus";
        itemHeader["show"] = true
        columnData.push(itemHeader);

        // Column Unchange Data 
        const unchangeColumnData = this.columnUnchange(columnData)

        debugger;
        this.setState({
            checkData: propsData,
            allData: data,
            graphOneLabel: graphOneData[0],
            graphOneData: graphOneData[1],
            hardJSON: hardJSON,
            graphHardOneData : hardJSON[0],
            graphHardTwoData : hardJSON[1],
            graphHardThirdData : hardJSON[2],
            graphHardFourthData : hardJSON[3],
            graphHardFifthData : hardJSON[4],
            graphHardSixthData : hardJSON[5],
            graphClicked: 0,
            dataOne: graphOneData[2],
            columnData: columnData,
            rowData: data,
            unchangeColumnData: unchangeColumnData
        })
        }
    }

    render() {
    

    // First Bar Graph
    var PIEgraphOneSortedData = {
    labels: this.state.graphOneLabel,
    // labels: ["Label 1", "Label 2"],
    datasets: [
        {
        // label:  this.state.graphLabel,
        fill: false,
        lineTension: 0.1,
        hoverBorderWidth : 12,
        // backgroundColor : this.state.colorRandom,
        backgroundColor : ["#F77C15", "#385BC8", "", "#FFC300", "#348AE4", "#FF5733", "#9DC4E1", "#3A3B7F", "", "", "", "", "", ""],
        borderColor: "rgba(75,192,192,0.4)",
        borderCapStyle: "butt",
        barPercentage: 2,
        barThickness: 25,
        maxBarThickness: 25,
        minBarLength: 2,
        data: this.state.graphOneData
        // data: [10, 20]
        }
    ]
    }

    var PIEgraphOneOption = {
    responsive : true,
    // aspectRatio : 3,
    maintainAspectRatio: false,
    cutoutPercentage : 0,
    // circumference : 12,
    onClick: (e, element) => {
        if (element.length > 0) {
            var ind = element[0]._index;
            
            const selectedVal = this.state.graphOneLabel[ind];
            // var graphSorting = this.graphSorting( this.state.graphHardTwoData.sortBy, this.state.dataOne[selectedVal] );
            var graphSorting = this.graphSorting( this.state.graphHardTwoData.sortBy, this.state.dataOne[selectedVal] );
            
            this.setState({
                graphTwoLabel: graphSorting[0],
                graphTwoData: graphSorting[1],
                dataTwo: graphSorting[2],
                graphClicked: 1,
                rowData: this.state.dataOne[selectedVal]
            })
            // // alert(ind)
        }
    },
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
        text: this.state.graphHardOneData ? this.state.graphHardOneData.title : "",
    },
    scales: {
        xAxes: [{
            gridLines: {
                display:true
            },
            scaleLabel: {
                display: true,
                labelString: this.state.graphHardOneData ? this.state.graphHardOneData.msgX : "",
                },
        }],
        yAxes: [{
            gridLines: {
                display:true
            },
            scaleLabel: {
                display: true,
                labelString: this.state.graphHardOneData ? this.state.graphHardOneData.msgY : "",
                },  
            ticks: {
            stepSize: 1
            },
        }],
    },
    plugins: {
        datalabels: {
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
            text: this.state.graphHardTwoData ? this.state.graphHardTwoData.title : ""
        },
        onClick: (e, element) => {
            if (element.length > 0) {
                var ind = element[0]._index;
                debugger;
                const selectedVal = this.state.graphTwoLabel[ind];
                const sortingHard = this.state.graphHardThirdData.sortBy
                var graphSorting = this.graphSorting( sortingHard, this.state.dataTwo[selectedVal], sortingHard[2] );
                
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
                    stepSize: 1
                },
                scaleLabel: {
                    display: true,
                    labelString: this.state.graphHardTwoData ? this.state.graphHardTwoData.msgX : ""
                    }, 
            }],
            yAxes: [{
                gridLines: {
                    display: true
                },
                ticks: {
                    suggestedMin: 0,
                    stepSize: 1
                },
                scaleLabel: {
                    display: true,
                    labelString: this.state.graphHardTwoData ? this.state.graphHardTwoData.msgY : ""
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

    // Third Double Bar Graph Graph
    var graphThirdSortedData = {
        labels: this.state.graphThirdLabel,
        datasets: [
            {
            label: "PAID",
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
            data: this.state.graphThirdData[0]
            },
            {
                label: "PENDING",
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
                data: this.state.graphThirdData[1]
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
            text: this.state.graphHardThirdData ? this.state.graphHardThirdData.title : ""
        },
        scales: {
            xAxes: [{
                gridLines: {
                    display:true
                },
                scaleLabel: {
                    display: true,
                    labelString: this.state.graphHardThirdData ?this.state.graphHardThirdData.msgX : ""
                    }, 
            }],
            yAxes: [{
                gridLines: {
                    display:true
                },
                ticks: {
                    // suggestedMin: 0,
                    // suggestedMax: 100,
                    stepSize: 1
                },
                scaleLabel: {
                    display: true,
                    labelString: this.state.graphHardThirdData ? this.state.graphHardThirdData.msgY : ""
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
                
                debugger;
                var ind = element[0]._index;   
                const selectedVal = this.state.graphThirdLabel[ind];
                var monthNo = {
                    'January': 0, 'February': 1, 'March': 2, 'April': 3, 'May': 4, 'June': 5,
                     'July': 6, 'August': 7, 'September': 8, 'October': 9, 'November': 10, 'December':11
                }
                const sortingHard = this.state.graphHardFourthData.sortBy;
                var graphSorting = this.graphSorting( sortingHard, this.state.dataThird[monthNo[selectedVal]], sortingHard[2]);
                debugger;


                this.setState({
                    // graphThirdLabel: graphSorting[0],
                    // graphThirdData: graphSorting[1],
                    // dataThird: graphSorting[2],
                    graphClicked: 3,
                    rowData: this.state.dataThird[monthNo[selectedVal]],
                    // // Double Graph Data Fix
                    graphFourthData: graphSorting[1],
                    graphFourthLabel: graphSorting[0],
                    dataFourth: graphSorting[2],
                })       
            }
        },
    }

    // Fourth Pie Graph BLOCK OR UNBLOCK Change to Online offline pending
    var graphFourthSortedData = {
    labels: this.state.graphFourthLabel,
    datasets: [
        {
        // label:  this.state.graphLabel,
        fill: false,
        lineTension: 0.1,
        hoverBorderWidth : 12,
        // backgroundColor : this.state.colorRandom,
        backgroundColor : ["#F77C15", "#385BC8", "", "#FFC300", "#348AE4", "#FF5733", "#9DC4E1", "#3A3B7F", "", "", "", "", "", ""],
        borderColor: "rgba(75,192,192,0.4)",
        borderCapStyle: "butt",
        barPercentage: 2,
        barThickness: 25,
        maxBarThickness: 25,
        minBarLength: 2,
        data: this.state.graphFourthData
        }
    ]
    }
    
    var graphFourthOption = {
    responsive : true,
    // aspectRatio : 3,
    maintainAspectRatio: false,
    cutoutPercentage : 0,
    // circumference : 12,
    onClick: (e, element) => {
        if (element.length > 0) {
            var ind = element[0]._index;

            debugger;
            const selectedVal = this.state.graphFourthLabel[ind] === Object.values(this.state.graphHardFourthData.sortBy[3])[0] ? Object.keys(this.state.graphHardFourthData.sortBy[3])[0] : this.state.graphFourthLabel[ind];
            
            var graphSorting = this.graphSorting( this.state.graphHardFifthData.sortBy, this.state.dataFourth[selectedVal] );
            
            this.setState({
                graphClicked: 4,
                rowData: this.state.dataFourth[selectedVal],
                graphFifthData: graphSorting[1],
                graphFifthLabel: graphSorting[0],
                dataFifth: graphSorting[2],
            })
        }
    },
    datasets : [
        {
        backgroundColor : "rgba(0, 0, 0, 0.1)",
        weight: 0
        }
    ], 
    legend: {
        display: true,
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
        // text: this.state.graphHardOneData.title,
    },
    // scales: {
    //     xAxes: [{
    //         gridLines: {
    //             display:true
    //         },
    //         scaleLabel: {
    //             display: true,
    //             labelString: this.state.graphHardOneData.msgX,
    //             },
    //     }],
    //     yAxes: [{
    //         gridLines: {
    //             display:true
    //         },
    //         scaleLabel: {
    //             display: true,
    //             labelString: this.state.graphHardOneData.msgY,
    //             },  
    //         ticks: {
    //         stepSize: 1
    //         },
    //     }],
    // },
    plugins: {
        datalabels: {
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

    // Fifth Bar Graph
    var graphFifthSortedData = {
    labels: this.state.graphFifthLabel,
    datasets: [
        {
        // label:  this.state.graphLabel,
        fill: false,
        lineTension: 0.1,
        hoverBorderWidth : 12,
        // backgroundColor : this.state.colorRandom,
        backgroundColor : ["#F77C15", "#385BC8", "", "#FFC300", "#348AE4", "#FF5733", "#9DC4E1", "#3A3B7F", "", "", "", "", "", ""],
        borderColor: "rgba(75,192,192,0.4)",
        borderCapStyle: "butt",
        barPercentage: 2,
        barThickness: 25,
        maxBarThickness: 25,
        minBarLength: 2,
        data: this.state.graphFifthData
        }
    ]
    }
    
    var graphFifthOption = {
    responsive : true,
    // aspectRatio : 3,
    maintainAspectRatio: false,
    cutoutPercentage : 0,
    // circumference : 12,
    onClick: (e, element) => {
        if (element.length > 0) {
            var ind = element[0]._index;

            debugger;
            const selectedVal = this.state.graphFifthLabel[ind];
            var graphSorting = this.graphSorting( this.state.graphHardSixthData.sortBy, this.state.dataFifth[selectedVal] );
            
            this.setState({
                graphClicked: 5,
                rowData: this.state.dataFifth[selectedVal],
                graphSixthData: graphSorting[1],
                graphSixthLabel: graphSorting[0],
                dataSixth: graphSorting[2],
            })
        }
    },
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
        text: this.state.graphHardFifthData ? this.state.graphHardFifthData.title : "",
    },
    scales: {
        xAxes: [{
            gridLines: {
                display:true
            },
            scaleLabel: {
                display: true,
                labelString: this.state.graphHardFifthData ? this.state.graphHardFifthData.msgX : "",
                },
        }],
        yAxes: [{
            gridLines: {
                display:true
            },
            scaleLabel: {
                display: true,
                labelString: this.state.graphHardFifthData ? this.state.graphHardFifthData.msgY : "",
                },  
            ticks: {
            stepSize: 1
            },
        }],
    },
    plugins: {
        datalabels: {
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

    // Sixth Bar Graph
    var graphSixthSortedData = {
    labels: this.state.graphSixthLabel,
    datasets: [
        {
        // label:  this.state.graphLabel,
        fill: false,
        lineTension: 0.1,
        hoverBorderWidth : 12,
        // backgroundColor : this.state.colorRandom,
        backgroundColor : ["#F77C15", "#385BC8", "", "#FFC300", "#348AE4", "#FF5733", "#9DC4E1", "#3A3B7F", "", "", "", "", "", ""],
        borderColor: "rgba(75,192,192,0.4)",
        borderCapStyle: "butt",
        barPercentage: 2,
        barThickness: 25,
        maxBarThickness: 25,
        minBarLength: 2,
        data: this.state.graphSixthData
        }
    ]
    }
        
    var graphSixthOption = {
    responsive : true,
    // aspectRatio : 3,
    maintainAspectRatio: false,
    cutoutPercentage : 0,
    // circumference : 12,
    onClick: (e, element) => {
        if (element.length > 0) {
            var ind = element[0]._index;

            debugger;
            const selectedVal = this.state.graphSixthLabel[ind];
            // var graphSorting = this.graphSorting( "siName", this.state.dataSixth[selectedVal] );
            
            this.setState({
                rowData: this.state.dataSixth[selectedVal]
            })
        }
    },
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
        text: this.state.graphHardSixthData ? this.state.graphHardSixthData.title : "",
    },
    scales: {
        xAxes: [{
            gridLines: {
                display:true
            },
            scaleLabel: {
                display: true,
                labelString: this.state.graphHardSixthData ? this.state.graphHardSixthData.msgX : "",
                },
        }],
        yAxes: [{
            gridLines: {
                display:true
            },
            scaleLabel: {
                display: true,
                labelString: this.state.graphHardSixthData ? this.state.graphHardSixthData.msgY : "'",
                },  
            ticks: {
            stepSize: 1
            },
        }],
    },
    plugins: {
        datalabels: {
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
        <div>
        <div className="graphDashboard">
        

        {this.state.graphClicked >= 0 ? 
        <CardContent className="halfGraph">
            <React.Fragment>
                <Bar
                data={ PIEgraphOneSortedData }
                options={ PIEgraphOneOption } 
                />
            </React.Fragment>
        </CardContent> 
        : null}

        {
            this.state.graphClicked > 0 ?
            <CardContent className="halfGraph">
                <React.Fragment>
                    <HorizontalBar
                    data={ graphTwoSortedData } 
                    options={ graphTwoOption } 
                    />
                </React.Fragment>
            </CardContent> 
            :null
        }

        </div>

        {/* -------------------------- Dashboard layer 2 -------------------------------------------------------- */}

        {
            this.state.graphClicked > 1 ?
            <div className="graphDashboard">
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

            {
                this.state.graphClicked > 2 ?
                <CardContent className="halfGraph">
                    <React.Fragment>
                        <Pie
                        data={ graphFourthSortedData }
                        options={ graphFourthOption } 
                        />
                    </React.Fragment>
                </CardContent>
                :null
                
            }
            </div>
            : null
        }
        
        {/* -------------------------- Dashboard layer 3 -------------------------------------------------------- */}

        {
            this.state.graphClicked > 3 ?
            <div className="graphDashboard">
            {
                this.state.graphClicked > 3 ?
                <CardContent className="halfGraph">
                    <React.Fragment>
                        <Bar
                        data={ graphFifthSortedData }
                        options={ graphFifthOption } 
                        />
                    </React.Fragment>
                </CardContent>
                :null
            }
    
            {
                this.state.graphClicked > 4 ?
                <CardContent className="halfGraph">
                    <React.Fragment>
                        <Bar
                        data={ graphSixthSortedData }
                        options={ graphSixthOption } 
                        />
                    </React.Fragment>
                </CardContent> 
                :null
            }
            
            </div>
            :null
        }

        {/* Table Feature  */}
        {this.state.graphClicked >= 0 ?
        <div className="tableContainer">
        <div className="tableFeature">
            <div className="columnToggle-Text"> Download As: </div>
            <button className="columnToggleBtn" onClick={this.pdfDownload}> PDF </button>

            <button className="columnToggleBtn" onClick={this.toggleColumn}> Column Visibility </button>
        </div>
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
            <ReactTable
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
        :null}
        </div>
        
    );
    }
}

export default DashboardEchallan;