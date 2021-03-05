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
import StoreIndentIssueNote_data from './StoreMgmt_data.json';
import './StoreIndent.css'

class DashboardStoreIndent extends React.Component {
  constructor(props) {
    super(props);
    this.state ={
        checkData: [],
        allData: [],
        dataOne: [],
        dataTwo: [],
        graphOneLabel: [],
        graphOneData: [],
        graphTwoLabel: [],
        graphTwoData: [],
        graphClicked: -1,
        hardJSON: [],
        graphHardOneData : {},
        graphHardTwoData : {},
        rowData: [],
        columnData: [],
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
        if(typeof(sortBy) === "object"){
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

    hardJSONConfig = (propSortBy) => {
        debugger;
        const hardJSON = propSortBy === "indentingStore" ? [{ 
            "sortBy": ["indent","indentStore", "name"],
            "msgX": "Stores",
            "msgY": "No of Application",
            "title": "Store Management Dashboard"
            },
            { 
            "sortBy": "materialIssueStatus",
            "msgX": "Status",
            "msgY": "No of Application",
            "title": "Indent Storewise Store Status Dashboard"
            }] : propSortBy === "materialIssueStatus" ? [
                { 
                "sortBy": "materialIssueStatus",
                "msgX": "Status",
                "msgY": "No of Application",
                "title": "Storewise Application Status Store Dashboard"
                },
                { 
                "sortBy": ["indent","indentStore", "name"],
                "msgX": "Indent Storewise Application Satatus Report",
                "msgY": "No of Application",
                "title": "StatusWise Indent Store Dashboard"
                }
                ] : []
        return hardJSON;
    }

    componentDidMount(){
        debugger; 
        const propData = this.props.data
        if(propData.length > 0){
        const propSortBy = propData[1].value;
        const data = propData[0].materialIssues;

        const hardJSON = this.hardJSONConfig(propSortBy);

        // Graph One Sorting Function 
        var graphOneData2 = this.graphSorting( hardJSON[0].sortBy, data );

        
        // Column Data
        const tableData = data[0] ? Object.keys(data[0]) : [];
        var columnData = []
        for(var i=0; i<tableData.length; i++){
            var itemHeader = {}
            itemHeader["Header"] = this.camelize(tableData[i]);
            itemHeader["accessor"] = tableData[i];
            itemHeader["show"]= (i === 2 || i === 8 ) ? true : false ;
            columnData.push(itemHeader);
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
            checkData: this.props.data
        })
        }
    }

    componentDidUpdate(){
        debugger;

        const propData = this.props.data
        if(JSON.stringify(this.state.checkData) !== JSON.stringify(propData)){
        const propSortBy = propData[1].value;
        const data = propData[0].materialIssues;

        const hardJSON = this.hardJSONConfig(propSortBy);

        // Graph One Sorting Function 
        var graphOneData2 = this.graphSorting( hardJSON[0].sortBy, data );

        
        // Column Data
        const tableData = data[0] ? Object.keys(data[0]) : [];
        var columnData = []
        for(var i=0; i<tableData.length; i++){
            var itemHeader = {}
            itemHeader["Header"] = this.camelize(tableData[i]);
            itemHeader["accessor"] = tableData[i];
            itemHeader["show"]= (i === 2 || i === 8 ) ? true : false ;
            columnData.push(itemHeader);
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
            checkData: this.props.data
        })
        }
    }

    render() {
    

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
                
                debugger;
                var ind = element[0]._index;   
                const selectedVal = this.state.graphOneLabel[ind];
                // var graphSorting = this.graphSorting( this.state.graphHardTwoData.sortBy, this.state.dataOne[selectedVal] );
                const hardval = this.state.hardJSON[1]
                var graphSorting = this.graphSorting( hardval.sortBy, this.state.dataOne[selectedVal] );
                
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
                var ind = element[0]._index;
                debugger;
                const selectedVal = this.state.graphTwoLabel[ind];
                
                this.setState({
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


        
    return (
        <div>
        
        <div className="graphDashboard">
        
        {
            this.state.graphClicked >= 0 ?
            <CardContent className="halfGraph">
                <React.Fragment>
                    <Bar
                    data={ PIEgraphOneSortedData }
                    options={ PIEgraphOneOption } 
                    />
                </React.Fragment>
            </CardContent>
            :null
        }
        
        {
            this.state.graphClicked > 0 ?
            <CardContent className="halfGraph">
                <React.Fragment>
                    <Bar
                    data={ graphTwoSortedData } 
                    options={ graphTwoOption } 
                    />
                </React.Fragment>
            </CardContent> 
            :null
        }

        </div>

        {/* Table Feature  */}
        <div className="tableContainer">
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

export default DashboardStoreIndent;