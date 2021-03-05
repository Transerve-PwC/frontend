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
// import Water_data from './WNS_data.json';
import BillData from './BillData.json';
import './Water.css'

class WNSDashboardTwo extends React.Component {
  constructor(props) {
    super(props);
    this.state ={
        dataOne: [],
        graphOneData: [],
        graphOneLabel : [],
        graphOneLabelSHOW: [],
        dataTwo: [],
        graphTwoData: [],
        graphTwoLabel : [],
        graphTwoLabelSHOW: [],
        dataThird : [],
        graphThirdData: [],
        graphThirdLabel : [],
        dataFourth : [],
        graphFourthData: [],
        graphFourthLabel : [],
        graphClicked: -1,
        dataJSONListMain: [],
        dataJSONListBillData: [],

        columnData: [],
        rowData: [],
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
    
    graphSorting = ( sortBy, data, checkGraph, ind ) => {
        debugger;
        if(checkGraph === "dashboard 1"){
            debugger;
            var group = data.reduce((r, a) => {
            r[a[sortBy[0]][sortBy[1]]] = [...r[a[sortBy[0]][sortBy[1]]] || [], a];
            return r;
            }, {});

            var graphLabel = Object.keys(group);
            var graphData = []
            for(var i=0; i<Object.keys(group).length ; i++){
                graphData.push(group[graphLabel[i]].length);
            }

            return [ graphLabel, graphData, group ];
        }else if(checkGraph === "dashboard 2"){
            debugger;
            var group = data.reduce((r, a) => {
            r[a[sortBy[0]][sortBy[1]]] = [...r[a[sortBy[0]][sortBy[1]]] || [], a];
            return r;
            }, {});

            var graphLabel = Object.keys(group);
            var graphData = []
            for(var i=0; i<Object.keys(group).length ; i++){
                graphData.push(group[graphLabel[i]].length);
            }

            return [ graphLabel, graphData, group ];

        }else if(checkGraph === "dashboard 3"){
            debugger;
            var group = data.reduce((r, a) => {
            r[a["subdiv"]] = [...r[a["subdiv"]] || [], a];
            return r;
            }, {});

            var graphLabel = Object.keys(group);
            var divData = Object.values(group);
            var graphData = []
            var dt = new Date().getFullYear();
            var alldiv = ["8","9","14","15","20"];
            var prev = [[],[],[],[],[]];
            var newConn = [[],[],[],[],[]];

            if(group[alldiv[0]]){
               for(var i=0; i<group[alldiv[0]].length; i++){
                    var demo = group[alldiv[0]][i];
                    // graphData.push(demo);
                    var check = new Date(demo.waterApplication.auditDetails.lastModifiedTime).getFullYear();
                    if(check < dt){
                        prev[0].push(demo);  
                    }else{
                        newConn[0].push(demo);
                    }
               } 
            }
            if(group[alldiv[1]]){
                for(var i=0; i<group[alldiv[1]].length; i++){
                     var demo = group[alldiv[1]][i];
                     // graphData.push(demo);
                     var check = new Date(demo.waterApplication.auditDetails.lastModifiedTime).getFullYear();
                     if(check < dt){
                         prev[1].push(demo);  
                     }else{
                         newConn[1].push(demo);
                     }
                } 
             }
             if(group[alldiv[2]]){
                for(var i=0; i<group[alldiv[2]].length; i++){
                     var demo = group[alldiv[2]][i];
                     // graphData.push(demo);
                     var check = new Date(demo.waterApplication.auditDetails.lastModifiedTime).getFullYear();
                     if(check < dt){
                         prev[2].push(demo);  
                     }else{
                         newConn[2].push(demo);
                     }
                } 
             }
             if(group[alldiv[3]]){
                for(var i=0; i<group[alldiv[3]].length; i++){
                     var demo = group[alldiv[3]][i];
                     // graphData.push(demo);
                     var check = new Date(demo.waterApplication.auditDetails.lastModifiedTime).getFullYear();
                     if(check < dt){
                         prev[3].push(demo);  
                     }else{
                         newConn[3].push(demo);
                     }
                } 
             }
             if(group[alldiv[4]]){
                for(var i=0; i<group[alldiv[4]].length; i++){
                     var demo = group[alldiv[4]][i];
                     // graphData.push(demo);
                     var check = new Date(demo.waterApplication.auditDetails.lastModifiedTime).getFullYear();
                     if(check < dt){
                         prev[4].push(demo);  
                     }else{
                         newConn[4].push(demo);
                     }
                } 
             }

            var prevCNT = [];
            var newConnCNT = [];

            for(var i=0; i<5; i++){
                prevCNT.push(prev[i].length);
                newConnCNT.push(newConn[i].length);
            }
            graphData.push(prevCNT);
            graphData.push(newConnCNT);

            return [ graphLabel, graphData, group ];
        }else if(checkGraph === "dashboard 4"){
            
            debugger;
            // graphLabel, graphData, group
            var subdiv = [[], [], [], [], [], []];

            if(data){
                for(var i=0; i<data.length; i++){
                    if(new Date(data[i].waterApplication.auditDetails.lastModifiedTime).getMonth() < 2){
                        subdiv[0].push(data[i]);
                    }
                    if(new Date(data[i].waterApplication.auditDetails.lastModifiedTime).getMonth() < 4 &&
                    new Date(data[i].waterApplication.auditDetails.lastModifiedTime).getMonth() > 1 ){
                        subdiv[1].push(data[i]);
                    }
                    if(new Date(data[i].waterApplication.auditDetails.lastModifiedTime).getMonth() < 6 &&
                    new Date(data[i].waterApplication.auditDetails.lastModifiedTime).getMonth() > 3 ){
                        subdiv[2].push(data[i]);
                    }
                    if(new Date(data[i].waterApplication.auditDetails.lastModifiedTime).getMonth() < 8 &&
                    new Date(data[i].waterApplication.auditDetails.lastModifiedTime).getMonth() > 5 ){
                        subdiv[3].push(data[i]);
                    }
                    if(new Date(data[i].waterApplication.auditDetails.lastModifiedTime).getMonth() < 10 &&
                    new Date(data[i].waterApplication.auditDetails.lastModifiedTime).getMonth() > 7 ){
                        subdiv[4].push(data[i]);
                    }
                    if(new Date(data[i].waterApplication.auditDetails.lastModifiedTime).getMonth() < 12 &&
                    new Date(data[i].waterApplication.auditDetails.lastModifiedTime).getMonth() > 9 ){
                        subdiv[5].push(data[i]);
                    }
                }
    
                var subdivCNT = [];
                for(var i=0; i<6; i++){
                    subdivCNT.push(subdiv[i].length);
                }
                graphData = subdivCNT;
                group = data;
            }else{
                group=[];
                graphData = [];    
            }
            graphLabel = ["Cycle 1", "Cycle 2", "Cycle 3", "Cycle 4", "Cycle 5", "Cycle 6"];
            return [ graphLabel, graphData, group ];
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
        const propSortBy = "dashboardType1";
        // const propSortBy = "status";
        const dt = this.props.data;
        const data = dt.WaterConnection;
        const valueData = [];

        const demoBillData = BillData.billData;

        for(var i=0; i<data.length; i++){
            for(var j=0; j<data[i].waterApplicationList.length; j++){
                // if( data[i].waterApplicationList[j].applicationStatus === "CONNECTION_ACTIVATED"){
                //     valueData.push(data[i]);
                // }
                // if( data[i].waterApplicationList[j].applicationStatus === "CONNECTION_UPDATED"){
                //     valueData.push(data[i]);
                // }
                // if( data[i].waterApplicationList[j].applicationStatus === "CONNECTION_TARIFF_CHANGED"){
                //     valueData.push(data[i]);
                // }
                valueData.push(data[i]);
            }
        }

        var MonthMap = { 0: "Jan", 1: "Feb", 2: "Mar", 3: "Apr", 4: "May", 5: "Jun", 6: "Jul", 7: "Aug", 8: "Sep", 9: "Oct", 10: "Nov", 11: "Dec"}
        var fromDT = 1604188800000;
        var toDT = 1614717798986;

        var dataJSON = {};
        var dataJSONListMain = {};
        var dataJSONListBillData = {};

        for(var i=0; i<valueData.length; i++){
            const demodt = valueData[i].waterApplication.auditDetails.lastModifiedTime;
            const dtMonth = new Date(demodt).getMonth();
            const dtYear = new Date(demodt).getFullYear();
            const strDate = MonthMap[dtMonth]+" "+dtYear;
            const val = valueData[i].contractValue === null ? 0 : valueData[i].contractValue ;
            var preval = dataJSON[strDate] ? parseInt(dataJSON[strDate]) : 0;
            dataJSON[strDate] = parseInt(val) + preval ;
            dataJSONListMain[strDate] = parseInt(val) + preval ;
        }

        for(var i=0; i<demoBillData.length; i++){
            const demodt = demoBillData[i].lastModifiedTime;
            const dtMonth = new Date(demodt).getMonth();
            const dtYear = new Date(demodt).getFullYear();
            const strDate = MonthMap[dtMonth]+" "+dtYear;
            const val = demoBillData[i].totalAmountPaid ;
            var preval = dataJSON[strDate] ? parseInt(dataJSON[strDate]) : 0;
            dataJSON[strDate] = parseInt(val) + preval ;

            var preval = dataJSONListBillData[strDate] ? parseInt(dataJSONListBillData[strDate]) : 0;
            dataJSONListBillData[strDate] = parseInt(val) + preval ;
        }


        const tableData = data[0] ? Object.keys(data[0]) : [];
        var columnData = []
        for(var i=0; i<tableData.length; i++){
            var itemHeader = {}
            itemHeader["Header"] = this.camelize(tableData[i]);
            itemHeader["accessor"] = tableData[i];
            itemHeader["show"]= (i === 1 || i === 3 || i === 4 || i === 5 ) ? true : false ;
            columnData.push(itemHeader);
        }

        this.setState({
            // dataOne: graphSort[2],
            graphOneData: Object.values(dataJSON),
            graphOneLabel : Object.keys(dataJSON),
            dataJSONListMain: dataJSONListMain,
            dataJSONListBillData: dataJSONListBillData,
            // graphOneLabelSHOW: graphOneLabelSHOW,
            // propSortBy: propSortBy,
            // graphClicked: 0,
            columnData: columnData,
            rowData: data,
        })
    }

    render() {  
    
    var graphOneSortedData = {
        labels: this.state.graphOneLabel,
        // labels: ["Label1", "Label2", "Label3"],
        datasets: [
            {
            // label: "",
            fill: false,
            lineTension: 0.1,
            hoverBorderWidth : 12,
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
            text: "Collection Report WNS Application(Monthly Total)"
        },
        scales: {
            xAxes: [{
                gridLines: {
                    display:false
                },
                scaleLabel: {
                    display: false,
                    labelString:"Month"
                    }, 
            }],
            yAxes: [{
                gridLines: {
                    display:false
                },
                ticks: {
                    suggestedMin: 0,
                    // suggestedMax: 100,
                    // stepSize: 1
                },
                scaleLabel: {
                    display: false,
                    labelString: "Rupees (Laks)"
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
                var selectedVal = this.state.graphOneLabel[ind];
                
                // const graphSort = this.graphSorting(["waterApplication","applicationStatus"], this.state.dataOne[selectedVal], "dashboard 2");
                // debugger;

                // var graphTwoLabelSHOW = [];
                // for(var i=0; i<graphSort[0].length; i++){
                //     var labl = graphSort[0][i].replaceAll("_", " ");
                //     graphTwoLabelSHOW.push(labl);
                // }
                var graphData = [];
                graphData.push([this.state.dataJSONListMain[selectedVal]]);
                graphData.push([this.state.dataJSONListBillData[selectedVal]]);

                this.setState({
                    // dataTwo : graphSort[2],
                    graphTwoData: graphData,
                    graphTwoLabel : [selectedVal],
                    // graphTwoLabelSHOW: graphTwoLabelSHOW,
                    // graphClicked: 1
                })
            }
        },
    }

    var graphTwoSortedData = {
        labels: this.state.graphTwoLabel,
        // labels: ["Label1", "Label2", "Label3"],
        datasets: [
            {
            label: "Monthly",
            fill: false,
            lineTension: 0.1,
            hoverBorderWidth : 12,
            backgroundColor : ["#F77C15", "#385BC8", "", "#FFC300", "#348AE4", "#FF5733", "#9DC4E1", "#3A3B7F", "", "", "", "", "", ""],
            borderColor: "rgba(75,192,192,0.4)",
            borderCapStyle: "butt",
            barPercentage: 2,
            borderWidth: 5,
            barThickness: 25,
            maxBarThickness: 10,
            minBarLength: 2,
            data: this.state.graphTwoData[0]
            // data:[10,20,30]
            },
            {
            label: "New",
            fill: false,
            lineTension: 0.1,
            hoverBorderWidth : 12,
            backgroundColor : ["#F77C15", "#385BC8", "", "#FFC300", "#348AE4", "#FF5733", "#9DC4E1", "#3A3B7F", "", "", "", "", "", ""],
            borderColor: "rgba(75,192,192,0.4)",
            borderCapStyle: "butt",
            barPercentage: 2,
            borderWidth: 5,
            barThickness: 25,
            maxBarThickness: 10,
            minBarLength: 2,
            data: this.state.graphTwoData[1]
            // data:[10,20,30]
            }
        ]
    }

    var graphTwoOption = {
        responsive : true,
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
            text: "Collection Report WNS Application (Monthly and New) "
        },
        scales: {
            xAxes: [{
                gridLines: {
                    display:false
                },
                scaleLabel: {
                    display: false,
                    labelString:"Month"
                    }, 
            }],
            yAxes: [{
                gridLines: {
                    display:false
                },
                ticks: {
                    suggestedMin: 0,
                    // suggestedMax: 100,
                    // stepSize: 1
                },
                scaleLabel: {
                    display: false,
                    labelString: "Rupees (Laks)"
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
                
                // const graphSort = this.graphSorting(["waterApplication","applicationStatus"], this.state.dataOne[selectedVal], "dashboard 2");
                // debugger;

                // var graphTwoLabelSHOW = [];
                // for(var i=0; i<graphSort[0].length; i++){
                //     var labl = graphSort[0][i].replaceAll("_", " ");
                //     graphTwoLabelSHOW.push(labl);
                // }

                // this.setState({
                //     dataTwo : graphSort[2],
                //     graphTwoData: graphSort[1],
                //     graphTwoLabel : graphSort[0],
                //     graphTwoLabelSHOW: graphTwoLabelSHOW,
                //     graphClicked: 1
                // })
            }
        },
    }

    return (
        <div>
        {/* <h2> WNS Dashboard 2 Graph </h2>  */}
        
        <div className="graphDashboard">
        

        <CardContent style={{width: "700px", height : "450px"}}>
            <React.Fragment>
                <Bar
                data={ graphOneSortedData }
                options={ graphOneOption } 
                />
            </React.Fragment>
        </CardContent>

        <CardContent style={{height : "450px"}}>
            <React.Fragment>
                <Bar
                data={ graphTwoSortedData }
                options={ graphTwoOption } 
                />
            </React.Fragment>
        </CardContent>

        </div>

        {/* Table Feature  */}
        <div className="tableContainer">
        {
            // this.state.unchangeColumnData.length > 0  ? 
            // <div className="tableFeature">
            //     <div className="columnToggle-Text"> Download As: </div>
            //     <button className="columnToggleBtn" onClick={this.pdfDownload}> PDF </button>

            //     <button className="columnToggleBtn" onClick={this.toggleColumn}> Column Visibility </button>
            // </div>
            // :null
        }
        {
        //    this.state.toggleColumnCheck ?
        //    <div className="columnVisibilityCard">
        //     <dl>
        //         {
        //             this.state.unchangeColumnData.map((data, index)=>{
        //                 return(
        //                     <ul className={ this.state.unchangeColumnData[index]["show"] ? "" : "toggleBtnClicked" }><button value={index} className={ this.state.unchangeColumnData[index]["show"] ? "toggleBtn" : "toggleBtnClicked" } onClick={ this.showHideColumn }> { this.state.unchangeColumnData[index]["Header"] } </button></ul> 
        //                 )
        //             })
        //         }
        //     </dl>
        //     </div> 
        //    : null
        }

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

export default WNSDashboardTwo;