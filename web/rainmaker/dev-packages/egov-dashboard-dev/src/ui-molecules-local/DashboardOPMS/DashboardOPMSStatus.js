import React, { Component } from "react";
import { Doughnut, Bar, HorizontalBar, Line, Pie } from 'react-chartjs-2';
import CardContent from '@material-ui/core/CardContent';
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import ReactTable from "react-table-6";  
import "react-table-6/react-table.css" ;
import jsPDF from 'jspdf'
import 'jspdf-autotable';
import './OPMSIndex.css'

class DashboardOPMSStatus extends React.Component {
  constructor(props) {
    super(props);
    this.state ={
        checkdata : [],
        data : [],
        sortBy: "",
        propSoryBy : "",
        graphClicked : -1,
        tableHeader: [],
        tableRow: [],
        toggleColumnCheck: false,
        firstGraphData : [],
        firstGraphLabel : [],
        firstData: [],
        secondGraphLabel: [],
        secondGraphData: [],
        secondData : [],
    }
  }

    // PDF function 
    pdfDownload = (e) => {

        debugger;
        e.preventDefault();
        var columnData = this.state.tableHeader
        // var columnDataCamelize = this.state.columnData
        var rowData = this.state.tableRow
    
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
        const pdfTitle =  "OPMS Title"
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
        var sortColumn = JSON.parse(JSON.stringify(this.state.tableHeader));
        const removeIndex = parseInt(e.target.value);
        // sortColumn.splice(removeIndex, 1)
        sortColumn[removeIndex]["show"] = !(sortColumn[removeIndex]["show"]);

        var sortColumn2 = JSON.parse(JSON.stringify(this.state.tableHeader));
        const removeIndex2 = parseInt(e.target.value);
        // sortColumn.splice(removeIndex, 1)
        sortColumn2[removeIndex2]["show"] = !(sortColumn2[removeIndex2]["show"])

        this.setState({
            columnData: sortColumn,
            unchangeColumnData: sortColumn2,
            tableHeader: sortColumn
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

    graphSorting = ( sortBy, data, checkGraph ) => {

        if(checkGraph === "STATUS"){
            debugger;
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

            return [ graphOneLabel, graphOneData, group ];
        }else{
            debugger;
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
    
            return [ graphOneLabel, graphOneData, group ];
        }
    }

    componentDidMount(){
        debugger;
        var data = this.props.data;
        var sortBy = this.props.sortBy;

        var graphLabel = Object.keys(data);
        var graphData = [];
        for(var i=0; i<graphLabel.length; i++){
            graphData.push(data[graphLabel[i]].length)
        }

        var col = [];
        var item = {};
        item["Header"] = "Application Type";
        item["accessor"] = "applicationType";
        item["show"] = true;
        col.push(item)
        
        var item = {};
        item["Header"] = "No of Request";
        item["accessor"] = "noofRequest";
        item["show"] = true;
        col.push(item)

        debugger;
        var row = [];        
        for(var i=0; i<graphLabel.length; i++){
            var item = {};
            item[col[0].accessor] = graphLabel[i];
            item[col[1].accessor] = graphData[i];  
            row.push(item)
        }

        this.setState({
            data : data,
            sortBy: sortBy,
            firstGraphData : graphData,
            firstGraphLabel : graphLabel,
            firstData : data,
            tableHeader: col,
            tableRow: row
        })  
    }

    componentDidUpdate(){
        debugger;
        // const propSoryBy = "Status";
        // const propSoryBy = "Collection Report";
        if(JSON.stringify(this.props.data) !== JSON.stringify(this.state.data)){
            var data = this.props.data;
            var sortBy = this.props.sortBy;

            var graphLabel = Object.keys(data);
        var graphData = [];
        for(var i=0; i<graphLabel.length; i++){
            graphData.push(data[graphLabel[i]].length)
        }

        var col = [];
        var item = {};
        item["Header"] = "Application Type";
        item["accessor"] = "applicationType";
        item["show"] = true;
        col.push(item)
        
        var item = {};
        item["Header"] = "No of Request";
        item["accessor"] = "noofRequest";
        item["show"] = true;
        col.push(item)

        debugger;
        var row = [];        
        for(var i=0; i<graphLabel.length; i++){
            var item = {};
            item[col[0].accessor] = graphLabel[i];
            item[col[1].accessor] = graphData[i];  
            row.push(item)
        }

        this.setState({
            data : data,
            sortBy: sortBy,
            firstGraphData : graphData,
            firstGraphLabel : graphLabel,
            firstData : data,
            tableHeader: col,
            tableRow: row
        }) 
        }
    }
    
    render() {
        // First Bar Graph Graph
        var graphOneData = {
            labels: this.state.firstGraphLabel,
            // labels: ["Label1", "Label2"],
            datasets: [
                {
                // label: "Apani Mandi",
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
                data: this.state.firstGraphData
                // data:[10,20]
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
                text: "Application Type Report"
            },
            scales: {
                xAxes: [{
                    gridLines: {
                        display:true
                    },
                    scaleLabel: {
                        display: true,
                        labelString: "Application Type"
                        }, 
                }],
                yAxes: [{
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
                        labelString: "No of Application"
                        }, 
                }]
            },
            plugins: {
                datalabels: {
                    display: false,
                    color: 'white',
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
                    debugger;
                    var selectedVal = this.state.firstGraphLabel[ind];
                    var data = this.state.firstData[selectedVal];
                    var graphSortedData = this.graphSorting("applicationStatus", data, "STATUS")
                
                    // Table 
                    debugger;
                    var col = [];
                    var item = {};
                    item["Header"] = "Application Status";
                    item["accessor"] = "applicationStatus";
                    item["show"] = true;
                    col.push(item)
                    
                    var item = {};
                    item["Header"] = "No of Request";
                    item["accessor"] = "noofRequest";
                    item["show"] = true;
                    col.push(item)

                    debugger;
                    var row = [];        
                    for(var i=0; i<graphSortedData[0].length; i++){
                        var item = {};
                        item[col[0].accessor] = graphSortedData[0][i];
                        item[col[1].accessor] = graphSortedData[1][i];  
                        row.push(item)
                    }

                    this.setState({
                        secondGraphLabel: graphSortedData[0],
                        secondGraphData: graphSortedData[1],
                        secondData : data,
                        graphClicked: 1,
                        tableHeader: col,
                        tableRow: row
                    })
                }
            },
        }

        // Second Graph
        var graphTwoData = {
            labels: this.state.secondGraphLabel,
            // labels: ["Label1", "Label2"],
            datasets: [
                {
                // label: "Apani Mandi",
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
                data: this.state.secondGraphData
                // data:[10,20]
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
                text: "Application Typewise Status Report"
            },
            scales: {
                xAxes: [{
                    gridLines: {
                        display:true
                    },
                    scaleLabel: {
                        display: true,
                        labelString: "Application Status"
                        }, 
                }],
                yAxes: [{
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
                        labelString: "No of Application"
                        }, 
                }]
            },
            plugins: {
                datalabels: {
                    display: false,
                    color: 'white',
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
                    debugger;
                }
            },
        }
        
    return (
        <div>
            <div className="graphDashboard">
                <CardContent className="halfGraph">
                    <React.Fragment>
                        <Bar
                        data={ graphOneData }
                        options={ graphOneOption } 
                        />
                    </React.Fragment>
                </CardContent>

                <CardContent className="halfGraph">
                    <React.Fragment>
                        <Bar
                        data={ graphTwoData }
                        options={ graphTwoOption } 
                        />
                    </React.Fragment>
                </CardContent>
            </div>

            {/* Table Feature  */}
            <div className="tableContainer">
            {
                // this.state.graphClicked >= 0 ?
                <div className="tableFeature">
                    <div className="columnToggle-Text"> Download As: </div>
                    <button className="columnToggleBtn" onClick={this.pdfDownload}> PDF </button>

                    <button className="columnToggleBtn" onClick={this.toggleColumn}> Column Visibility </button>
                </div>
                // :null
            }
            {
            this.state.toggleColumnCheck ?
            <div className="columnVisibilityCard">
                <dl>
                    {
                        this.state.tableHeader.map((data, index)=>{
                            return(
                                <ul className={ this.state.tableHeader[index]["show"] ? "" : "toggleBtnClicked" }><button value={index} className={ this.state.tableHeader[index]["show"] ? "toggleBtn" : "toggleBtnClicked" } onClick={ this.showHideColumn }> { this.state.tableHeader[index]["Header"] } </button></ul> 
                            )
                        })
                    }
                </dl>
                </div> 
            : null
            }

            {
                // this.state.graphClicked >= 0 ?
                <ReactTable id="customReactTable"
                // PaginationComponent={Pagination}
                data={ this.state.tableRow }  
                columns={ this.state.tableHeader }  
                defaultPageSize = {5}
                pageSize={ 5 }  
                pageSizeOptions = {[20,40,60]}  
                /> 
                // :null
            }
            </div>
        </div>
    );
    }
}

export default DashboardOPMSStatus;