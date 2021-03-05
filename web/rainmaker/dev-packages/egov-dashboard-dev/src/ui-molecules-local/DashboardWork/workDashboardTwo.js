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
// import Work_data from './WorkMgmt_data.json';
// import Work_data from './work_data2.json';
import './WorkDashboard.css'

class WorkDashboardTwo extends React.Component {
  constructor(props) {
    super(props);
    this.state ={
        graphOneLabel: [],
        graphOneData: [],
        dataOne: [],
        graphTwoLabel: [],
        graphTwoData: [],
        dataTwo: [],
        graphThirdLabel: [],
        graphThirdData: [],
        dataThird: [],
        graphFourthLabel: [],
        graphFourthData: [],
        dataFourth: [],
        hardJSON: [],
        graphClicked: -1,
        propSortBy: "",
        columnData: [],
        rowData: []
    }
  }


    // PDF function 
    pdfDownload = () => {

    debugger;

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
        // e.preventDefault();
        debugger;
        const data = this.state.columnData
        this.setState({
            toggleColumnCheck : !this.state.toggleColumnCheck
        })
    }
    
    graphSorting = ( propSortBy, sortBy, data, checkGraph ) => {

        debugger;
        if( checkGraph === "dashboard 1" ){
            
            debugger;
            var sortNo = null;
            var group = data.reduce((r, a) => {
                r[a[sortBy]] = [...r[a[sortBy]] || [], a];
                return r;
                }, {});
        
            var graphLabel = Object.keys(group);
            var graphData = []
            for(var i=0; i<Object.keys(group).length ; i++){
                graphData.push(group[graphLabel[i]].length);
            }
        
            return [ graphLabel, graphData, group ]

        }
        if( checkGraph === "dashboard 3" ){
            
            debugger;
            var month = {0: "JAN",1: "FEB",2: "MAR",3: "APR",4: "MAY",5: "JUN",6: "JUL",7: "AUG",8: "SEP",9: "OCT",10: "NOV",11: "DEC",}
            var monthwiseData = {};
            for(var i=0; i<data.length; i++){
                var keyMonth = month[new Date(data[i].lastmodifieddate).getMonth()] +" "+ new Date(data[i].lastmodifieddate).getFullYear();
                var prevData = monthwiseData[keyMonth] ? monthwiseData[keyMonth] : [];
                var newData = data[i];
                prevData.push(newData)
                monthwiseData[keyMonth] = prevData;
            }
            debugger;
            // var sortNo = null;
            // var group = data.reduce((r, a) => {
            //     r[a[sortBy]] = [...r[a[sortBy]] || [], a];
            //     return r;
            //     }, {});
            var graphLabel = Object.keys(monthwiseData);
            var graphData = []
            for(var i=0; i<Object.keys(monthwiseData).length ; i++){
                graphData.push(monthwiseData[graphLabel[i]].length);
            }
            var group = monthwiseData;
            return [ graphLabel, graphData, group ]

        }
        if( checkGraph === "dashboard 4" ){
            
            debugger;
            var sortNo = null;
            var group = data.reduce((r, a) => {
                r[a[sortBy]] = [...r[a[sortBy]] || [], a];
                return r;
                }, {});
        
            var graphLabel = Object.keys(group);
            var graphData = []
            for(var i=0; i<Object.keys(group).length ; i++){
                for(var j=0; j<group[graphLabel[i]].length; j++){
                    var amt = group[graphLabel[i]][j].estimate_amount
                } 
                graphData.push(amt);
            }
        
            return [ graphLabel, graphData, group ]

        }
        else{

            debugger;
            var sortNo = null;
            var group = data.reduce((r, a) => {
                r[a[sortBy]] = [...r[a[sortBy]] || [], a];
                return r;
                }, {});
        
            var graphLabel = Object.keys(group);
            var graphData = []
            for(var i=0; i<Object.keys(group).length ; i++){
                graphData.push(group[graphLabel[i]].length);
            }
        
            return [ graphLabel, graphData, group ]
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
        const check = this.props.data;
        const data = this.props.data.estimate_details;
        const propSortBy = "status";

        const hardJSON = propSortBy === "status" ? [{ 
        "sortBy": "status",
        "msgX": "Department",
        "msgY": "No of Application",
        "title": "Indent Issue Store Management Dashboard"
        },
        { 
        "sortBy": "executing_division",
        "msgX": "Material",
        "msgY": "No of Application",
        "title": "Indent Departmentwise Store Material Dashboard"
        },
        { 
        "sortBy": "",
        "msgX": "No of Orders",
        "msgY": "Order value",
        "title": "Indent MaterialWise Store Order Dashboard"
        }
        ]: [];
        
        // Graph One Sorting Function 
        var graphSort = this.graphSorting( propSortBy, hardJSON[0].sortBy, data, "dashboard 1" );
        
        const tableData = data[0] ? Object.keys(data[0]) : [];
        var columnData = []
        for(var i=0; i<tableData.length; i++){
            var itemHeader = {}
            itemHeader["Header"] = this.camelize(tableData[i]);
            itemHeader["accessor"] = tableData[i];
            itemHeader["show"]= ( i === 3 || i === 4 || i === 5 ) ? true : false ;
            columnData.push(itemHeader);
        }

        this.setState({
            graphOneLabel: graphSort[0],
            graphOneData: graphSort[1],
            graphClicked: 0,
            dataOne: graphSort[2],
            hardJSON: hardJSON,
            propSortBy: propSortBy,
            check: this.props.data,
            columnData: columnData,
            rowData: data
        })

    }

    componentDidUpdate(){
        debugger;

        const check = this.props.data;
        if(JSON.stringify(check) !== JSON.stringify(this.state.check)){
            const data = this.props.data.work_agreement_details;
            const propSortBy = "status";
    
            const hardJSON = propSortBy === "status" ? [{ 
            "sortBy": "status",
            "msgX": "Department",
            "msgY": "No of Application",
            "title": "Indent Issue Store Management Dashboard"
            },
            { 
            "sortBy": "executing_department",
            "msgX": "Material",
            "msgY": "No of Application",
            "title": "Indent Departmentwise Store Material Dashboard"
            }
            ]: [];
            
            // Graph One Sorting Function 
            var graphSort = this.graphSorting( propSortBy, hardJSON[0].sortBy, data, "dashboard 1" );
            
            const tableData = data[0] ? Object.keys(data[0]) : [];
            var columnData = []
            for(var i=0; i<tableData.length; i++){
                var itemHeader = {}
                itemHeader["Header"] = this.camelize(tableData[i]);
                itemHeader["accessor"] = tableData[i];
                itemHeader["show"]= ( i === 3 || i === 4 || i === 5 ) ? true : false ;
                columnData.push(itemHeader);
            }

            this.setState({
                graphOneLabel: graphSort[0],
                graphOneData: graphSort[1],
                graphClicked: 0,
                dataOne: graphSort[2],
                hardJSON: hardJSON,
                propSortBy: propSortBy,
                columnData: columnData,
                rowData: data
            })
        }
    }

    render() {
        
        var graphOneData = {
            labels: this.state.graphOneLabel,
            // labels: ["Status 1", "Status 2", "Status 3"],
            datasets: [
                {
                label: "Estimate Approval Stage",
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
    
        var graphOneOption = {
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
                text: "Approval Status of Estimates"
            },
            scales: {
                // xAxes: [{
                //     gridLines: {
                //         display:true
                //     },
                //     scaleLabel: {
                //         display: true,
                //         labelString:" MsgX"
                //         }, 
                // }],
                // yAxes: [{
                //     gridLines: {
                //         display:true
                //     },
                //     ticks: {
                //         // suggestedMin: 0,
                //         // suggestedMax: 100,
                //         stepSize: 1
                //     },
                //     scaleLabel: {
                //         display: true,
                //         labelString: "MsgY"
                //         }, 
                // }]
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

                    const hardval = this.state.hardJSON[1]
                    var graphSort = this.graphSorting( this.state.propSortBy, hardval.sortBy, this.state.dataOne[selectedVal], "dashboard 2" );

                    this.setState({
                        graphTwoLabel: graphSort[0],
                        graphTwoData: graphSort[1],
                        dataTwo: graphSort[2],
                        graphClicked: 1,
                    })
                }
            },
        }

        var graphTwoData = {
            labels: this.state.graphTwoLabel,
            // labels: ["Executing Division 1", "Executing Division 2"],
            datasets: [
                {
                label: "Status1",
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
                data: this.state.graphTwoData
                // data:[10,20,30]
                },
                {
                // label: "Status2",
                // fill: false,
                // lineTension: 0.1,
                // hoverBorderWidth : 12,
                // // backgroundColor : this.state.colorRandom,
                // backgroundColor : ["#348AE4", "#FF5733", "#9DC4E1", "#3A3B7F", "", "", "", "", "", ""],
                // borderColor: "rgba(75,192,192,0.4)",
                // borderCapStyle: "butt",
                // barPercentage: 2,
                // borderWidth: 5,
                // barThickness: 25,
                // maxBarThickness: 10,
                // minBarLength: 2,
                // data:[10,20,30]
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
                text: "Approval Status of Estimates Department Wise"
            },
            scales: {
                xAxes: [{
                    // stacked: true,
                    gridLines: {
                        display:true
                    },
                    scaleLabel: {
                        display: true,
                        labelString:" Department"
                        }, 
                }],
                yAxes: [{
                    // stacked: true,
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
                        labelString: "No of Projects"
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
                    const selectedVal = this.state.graphTwoLabel[ind];

                    const hardval = this.state.hardJSON[1]
                    var graphSort = this.graphSorting( this.state.propSortBy, "estimate_amount", this.state.dataTwo[selectedVal], "dashboard 3" );

                    this.setState({
                        graphThirdLabel: graphSort[0],
                        graphThirdData: graphSort[1],
                        dataThird: graphSort[2],
                        graphClicked: 2,
                    })
                }
            },
        }

        var graphThirdData = {
            labels: this.state.graphThirdLabel,
            // labels: ["Executing Division 1", "Executing Division 2"],
            datasets: [
                {
                label: "Status1",
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
                data: this.state.graphThirdData
                // data:[10,20,30]
                },
                {
                // label: "Status2",
                // fill: false,
                // lineTension: 0.1,
                // hoverBorderWidth : 12,
                // // backgroundColor : this.state.colorRandom,
                // backgroundColor : ["#348AE4", "#FF5733", "#9DC4E1", "#3A3B7F", "", "", "", "", "", ""],
                // borderColor: "rgba(75,192,192,0.4)",
                // borderCapStyle: "butt",
                // barPercentage: 2,
                // borderWidth: 5,
                // barThickness: 25,
                // maxBarThickness: 10,
                // minBarLength: 2,
                // data:[10,20,30]
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
                text: "Approval Status of Estimates Department Wise (Monthly)"
            },
            scales: {
                xAxes: [{
                    // stacked: true,
                    gridLines: {
                        display:true
                    },
                    scaleLabel: {
                        display: true,
                        labelString:" Month"
                        }, 
                }],
                yAxes: [{
                    // stacked: true,
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
                        labelString: "No of Project"
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

                    const hardval = this.state.hardJSON[1]
                    var graphSort = this.graphSorting( this.state.propSortBy, "sector_number", this.state.dataThird[selectedVal], "dashboard 4" );

                    this.setState({
                        graphFourthLabel: graphSort[0],
                        graphFourthData: graphSort[1],
                        dataFourth: graphSort[2],
                        graphClicked: 3,
                    })
                }
            },
        }

        var graphFourthData = {
            labels: this.state.graphFourthLabel,
            // labels: ["Executing Division 1", "Executing Division 2"],
            datasets: [
                {
                label: "Status1",
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
                data: this.state.graphFourthData
                // data:[10,20,30]
                },
                {
                // label: "Status2",
                // fill: false,
                // lineTension: 0.1,
                // hoverBorderWidth : 12,
                // // backgroundColor : this.state.colorRandom,
                // backgroundColor : ["#348AE4", "#FF5733", "#9DC4E1", "#3A3B7F", "", "", "", "", "", ""],
                // borderColor: "rgba(75,192,192,0.4)",
                // borderCapStyle: "butt",
                // barPercentage: 2,
                // borderWidth: 5,
                // barThickness: 25,
                // maxBarThickness: 10,
                // minBarLength: 2,
                // data:[10,20,30]
                }
            ]
        }
    
        var graphFourthOption = {
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
                text: "Estimate Report Sector wise Estimate Amount"
            },
            scales: {
                xAxes: [{
                    stacked: true,
                    gridLines: {
                        display:true
                    },
                    scaleLabel: {
                        display: true,
                        labelString:" Sector"
                        }, 
                }],
                yAxes: [{
                    stacked: true,
                    gridLines: {
                        display:true
                    },
                    ticks: {
                        suggestedMin: 0,
                        // suggestedMax: 100,
                        // stepSize: 1
                    },
                    scaleLabel: {
                        display: true,
                        labelString: "Rupees in Lakh"
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
                }
            },
        }

        return (
            <div>
            {/* <h2> Work Management Dashboard Graph (Estimate Data) </h2>  */}
            
            <div className="graphDashboard">
            
            <CardContent className="halfGraph">
                <React.Fragment>
                    <Pie
                    data={ graphOneData }
                    options={ graphOneOption } 
                    />
                </React.Fragment>
            </CardContent>

            {
                this.state.graphClicked > 0 ? 
                    <CardContent className="halfGraph">
                        <React.Fragment>
                            <Bar
                            data={ graphTwoData }
                            options={ graphTwoOption } 
                            />
                        </React.Fragment>
                    </CardContent>
                :null
            }
            
    
            </div>

            <div className="graphDashboard">
            
    
            {
                this.state.graphClicked > 1 ? 
                <CardContent className="halfGraph">
                    <React.Fragment>
                        <Bar
                        data={ graphThirdData }
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
                        <Bar
                        data={ graphFourthData }
                        options={ graphFourthOption } 
                        />
                    </React.Fragment>
                </CardContent>
                :null
            }
            
            </div>
    
            {/* Table Feature  */}
            <div className="tableContainer">
            {/* {
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
            } */}
    
            {
                // this.state.graphClicked >= 0 ?
                <ReactTable id="customReactTable"
                // PaginationComponent={Pagination}
                data={ this.state.rowData }  
                columns={ this.state.columnData }  
                defaultPageSize = {this.state.rowData.length > 10 ? 10 : this.state.rowData.length}
                pageSize={this.state.rowData.length > 10 ? 10 : this.state.rowData.length}  
                pageSizeOptions = {[20,40,60]}  
                /> 
                // :null
            }
            </div>
            </div>
        );
    }
}

export default WorkDashboardTwo;