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
// import LicensesRenewal_data from './LicensesRenewal_data.json';
import './EaawasIndex.css'

class DashboardEaawas extends React.Component {
  constructor(props) {
    super(props);
    this.state={
      checkData:[],
      respData: [],
      graphLabel: [],
      graphData: [],
      rowData: [],
      columnData: []
    }
  }

  pdfDownload = (e) => {

    
    debugger;
    e.preventDefault();
    var tableColumnData =[];
    var rowData = [] ;

    for(var i=0; i<this.state.columnData.length; i++){
        tableColumnData.push(this.state.columnData[i]["accessor"]);
        // tableColumnDataCamel.push(columnDataCamelize[i]["accessor"])
    }

    for(var i=0; i<this.state.rowData.length; i++){
        var tableRowData =[];
        tableRowData.push(this.state.rowData[i]["col1"])
        tableRowData.push(this.state.rowData[i]["col2"])
        rowData.push(tableRowData)
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
    const pdfTitle = "Title";
    doc.text(pdfTitle, pageWidth / 2, 40, 'center');

    doc.autoTable({ html: '#my-table' });
    doc.setFontSize(5);

    doc.autoTable({
        // head: [tableColumnDataCamel],
        // head: [tableColumnData],
        theme: "striped",
        styles: {
            fontSize: 7,
        },
        body: rowData
    });

    doc.save(pdfTitle+".pdf");

  }

  componentDidMount(){
    debugger;
    var data = this.props.data
    data = data.ResponseBody;
    if(data){
        const graphLabel = ["Total Accomodation", "Alloted Accomodation", "Vacant Accomodation", "Total Bid Submitted", "Total Online Allotment"]
    var graphData = [];
    var graphDataSorted =[];
    graphData.push(data.vacantAccommodation);
    graphData.push(data.totalAccommodation);
    graphData.push(data.totalOnlineAllotment);
    graphData.push(data.AllottedAccommodations);
    graphData.push(data.totalBidSubmitted);
    for(var i=0; i<graphData.length; i++){
        if(typeof(graphData[i]) === "number"){
            graphDataSorted.push(graphData[i])
        }else{
            var dt = parseInt(graphData[i].replaceAll(",", ""))
            graphDataSorted.push(dt)
        }
    }


    var tabledData=[]
    for(var i=0; i<graphData.length; i++){
        var row = {}
        row["col1"] = graphLabel[i]
        row["col2"] = graphData[i]
        tabledData.push(row)
    }
    var col = [{
        Header: '',
        accessor: 'col1'
    },
    {
        Header: '',
        accessor: 'col2'
    }]

    this.setState({
        respData : data,
        graphLabel: graphLabel,
        graphData: graphDataSorted,
        rowData: tabledData,
        columnData: col,
        checkData: this.props.data
    })
    }
  }

  componentDidUpdate(){
    debugger;
    var data = this.props.data
    if(JSON.stringify(this.state.checkData) !== JSON.stringify(data)){
      data = data.ResponseBody;
      const graphLabel = ["Total Accomodation", "Alloted Accomodation", "Vacant Accomodation", "Total Bid Submitted", "Total Online Allotment"]
      var graphData = [];
      var graphDataSorted =[];
      graphData.push(data.vacantAccommodation);
      graphData.push(data.totalAccommodation);
      graphData.push(data.totalOnlineAllotment);
      graphData.push(data.AllottedAccommodations);
      graphData.push(data.totalBidSubmitted);
      for(var i=0; i<graphData.length; i++){
        if(typeof(graphData[i]) === "number"){
            graphDataSorted.push(graphData[i])
        }else{
            var dt = parseInt(graphData[i].replaceAll(",", ""))
            graphDataSorted.push(dt)
        }
      }


      var tabledData=[]
      for(var i=0; i<graphData.length; i++){
        var row = {}
        row["col1"] = graphLabel[i]
        row["col2"] = graphData[i]
        tabledData.push(row)
      }
      var col = [{
        Header: '',
        accessor: 'col1'
      },
      {
        Header: '',
        accessor: 'col2'
      }]
      
      this.setState({
          respData : data,
          graphLabel: graphLabel,
          graphData: graphDataSorted,
          rowData: tabledData,
          columnData: col,
          checkData: this.props.data
      })
    }
  }

  render() {

    var graphData = {
        labels: this.state.graphLabel,
        // labels: ["l1", "l2"],
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
            data: this.state.graphData
            // data: [10,20]
            }
        ]
    }

    var graphOption = {
    responsive : true,
    // aspectRatio : 3,
    maintainAspectRatio: false,
    cutoutPercentage : 0,
    // circumference : 12,
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
        text: "this.state.graphHardFifthData.title",
    },
    scales: {
        xAxes: [{
            gridLines: {
                display:true
            }
        }],
        yAxes: [{
            gridLines: {
                display:true
            },
            ticks: {
            stepSize: 1,
            beginAtZero: true
            },
        }],
    },
    plugins: {
        datalabels: {
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
        }
    }
  
          
      return (
        <div>
            <div className="dashboardContainer">
                <CardContent className="halfGraph">
                <React.Fragment>
                    <Bar
                    data={ graphData }
                    options={ graphOption } 
                    />
                </React.Fragment>
                </CardContent>
                <div className="tableContainer">
{
<div className="tableFeature">
<div className="columnToggle-Text"> Download As: </div>
<button className="columnToggleBtn" onClick={this.pdfDownload}> PDF </button>
</div>
}
                    <div className="tableHeader"> Eaawas Stat </div>
                    <ReactTable id="customReactTable"
                    // PaginationComponent={Pagination}
                    data={ this.state.rowData }  
                    columns={ this.state.columnData }  
                    defaultPageSize = {5}
                    showPaginationBottom={false}
                    // pageSize={this.state.rowData.length > 10 ? 10 : this.state.rowData.length}  
                    // pageSizeOptions = {[20,40,60]}  
                    /> 
                </div>
            </div>

        </div>
    );
  }
}

export default DashboardEaawas;