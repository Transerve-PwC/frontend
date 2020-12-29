import React, { Component } from "react";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { connect } from "react-redux";
import get from "lodash/get";
import set from "lodash/set";
import { Line } from "react-chartjs-2";
import { Doughnut } from 'react-chartjs-2';
import { Bar } from 'react-chartjs-2';

class ReportMoleculeBarGroup extends React.Component {
  constructor(props) {
    super(props);
    this.state ={
      demo : 213,
      lineGraphData : "",
      lineGraphOption : "",
      sortedData : [],
      sortData : [],
      clickgraph : false,
      category : [],
      linegraphMonth : [],
      lineGraphRaisedComplaints : [],
      BackDatagroups : {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
        datasets: [
          {
            label: "Expense",
              fill: false,
              lineTension: 0.1,
              // backgroundColor: "rgba(#2e2eb8)",
              backgroundColor: "#2e2eb8",
            borderColor: "rgba(75,192,192,1)",
            borderCapStyle: "butt",
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: "miter",
            pointBorderColor: "rgba(75,192,192,1)",
            pointBackgroundColor: "#fff",
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: "rgba(75,192,192,1)",
            pointHoverBorderColor: "rgba(220,220,220,1)",
            pointHoverBorderWidth: 2,
            pointRadius: 5,
            pointHitRadius: 10,
            // barPercentage: 2,
            // barThickness: 25,
            // maxBarThickness: 25,
            // minBarLength: 2,
            data: [1,2,3,4,5]
          },
          {
            label: "Income",
            fill: false,
            lineTension: 0.1,
            backgroundColor: "#ff6600",
              borderColor: "rgba(75,192,192,1)",
              borderCapStyle: "butt",
              borderDash: [],
              borderDashOffset: 0.0,
              borderJoinStyle: "miter",
              pointBorderColor: "rgba(75,192,192,1)",
              pointBackgroundColor: "#fff",
              pointBorderWidth: 1,
              pointHoverRadius: 5,
              pointHoverBackgroundColor: "rgba(75,192,192,1)",
              pointHoverBorderColor: "rgba(220,220,220,1)",
              pointHoverBorderWidth: 2,
              pointRadius: 5,
              pointHitRadius: 10,
              // barPercentage: 2,
              // barThickness: 25,
              // maxBarThickness: 25,
              // minBarLength: 2,
              data: [140,55,40, 25, 20]
          }
        ]
      },
      lineGraphOptionGroups : {
        onClick: (e, element) => {
          debugger
          if (element.length > 0) {
            var ind = element[0]._index;
            // alert("JSON :: "+e+ind);
            this.setState({
                demo : true
            })
            this.demoFunc(ind);
            
          }
        },
        scales: {
          xAxes: [
            {
              gridLines: {
              display: false
              },
              barPercentage: 0.8,
              categoryPercentage: 0.5,
            }
          ],
          yAxes: [
            {
              // stacked: true,
              gridLines: {
                display: true
              },
            }
          ]
        },
        legend: {
          display: true
        },
        tooltips: {
          enabled: false
        }
      }
      
    }
  }

  demoFunc = (data) =>{
    debugger
    this.setState({
        sortData : this.state.sortedData[data],
        clickgraph : true
    })
  }

  handleBack = () => {
    this.setState({
      clickgraph : false
    })
  }

  componentDidMount(){
    debugger
    const graphDataJSON = JSON.parse(this.props.data);
    var sortedDataFromJSON = []
    var lineGraphMonth = []
    var lineGraphComplaints = []
    for( var i=0; i< graphDataJSON.graphData.length; i++ ){
      sortedDataFromJSON.push(graphDataJSON.graphData[i]["raisedComplaints"]);
      lineGraphMonth.push(graphDataJSON.graphData[i]["month"]);
      lineGraphComplaints.push(graphDataJSON.graphData[i]["categoryComplaints"]);
    }

    this.setState({
      category : graphDataJSON.category,
      sortedData : lineGraphComplaints,
      linegraphMonth : lineGraphMonth,
      lineGraphRaisedComplaints : sortedDataFromJSON
    })
  }

  render() {
    const { formKey } = this.props;

    var lineGraphLable = this.state.clickgraph ? this.state.category : this.state.linegraphMonth
    var lineGraphDataSetData = this.state.clickgraph ?  this.state.sortData : this.state.lineGraphRaisedComplaints
    var lineGraphLegandLabel = "Raised Complaints"
    var lineGraphData = {
        labels: lineGraphLable,
        datasets: [
          {
            label: lineGraphLegandLabel,
            align : "right",
            fill: false,
            lineTension: 0.1,
            backgroundColor: "rgba(75,192,192,0.4)",
            borderColor: "rgba(75,192,192,1)",
            borderCapStyle: "butt",
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: "miter",
            pointBorderColor: "rgba(75,192,192,1)",
            pointBackgroundColor: "#fff",
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: "rgba(75,192,192,1)",
            pointHoverBorderColor: "rgba(220,220,220,1)",
            pointHoverBorderWidth: 2,
            pointRadius: 5,
            pointHitRadius: 10,
            data:lineGraphDataSetData
          }
        ]
    }
    var lineGraphDataGroups = {
      labels: lineGraphLable,
      datasets: [
        {
          label: "Raised Complaints",
          fill: false,
          lineTension: 0.1,
          backgroundColor: "rgba(75,100,192,0.4)",
          borderColor: "rgba(75,192,192,1)",
          borderCapStyle: "butt",
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: "miter",
          pointBorderColor: "rgba(75,192,192,1)",
          pointBackgroundColor: "#fff",
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: "rgba(75,192,192,1)",
          pointHoverBorderColor: "rgba(220,220,220,1)",
          pointHoverBorderWidth: 2,
          pointRadius: 5,
          pointHitRadius: 10,
          barPercentage: 2,
          barThickness: 25,
          maxBarThickness: 25,
          minBarLength: 2,
          data: [35,50,40, 25, 20]
        },
        {
            label: "Raised Complaints",
            fill: false,
            lineTension: 0.1,
            backgroundColor: "rgba(75,250,192,0.4)",
            borderColor: "rgba(75,192,192,1)",
            borderCapStyle: "butt",
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: "miter",
            pointBorderColor: "rgba(75,192,192,1)",
            pointBackgroundColor: "#fff",
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: "rgba(75,192,192,1)",
            pointHoverBorderColor: "rgba(220,220,220,1)",
            pointHoverBorderWidth: 2,
            pointRadius: 5,
            pointHitRadius: 10,
            barPercentage: 2,
            barThickness: 25,
            maxBarThickness: 25,
            minBarLength: 2,
            data: [140,155,140, 25, 120]
          }
      ]
    }
  
  var lineGraphOption = {
    onClick: (e, element) => {
        
      if (element.length > 0) {
        var ind = element[0]._index;
        // alert("JSON :: "+e+ind);
        this.setState({
            demo : true
        })
        this.demoFunc(ind);
        
      }
    },
    scales: {
      xAxes: [
        {
          gridLines: {
            display: false
          }
        }
      ],
      yAxes: [
        {
          // stacked: true,
          gridLines: {
            display: true
          },
        }
      ]
    },
    legend: {
      display: true,
      label : {
        padding : 12,
      align : "right"
      }
    },
    tooltips: {
      enabled: false
    },
    animation: {
      duration: 1,
      onComplete: function () {
          var chartInstance = this.chart,
              ctx = chartInstance.ctx;
              ctx.textAlign = 'center';
              ctx.fillStyle = "rgba(0, 0, 0, 1)";
              ctx.textBaseline = 'bottom';
              // Loop through each data in the datasets
              this.data.datasets.forEach(function (dataset, i) {  
                  var meta = chartInstance.controller.getDatasetMeta(i);
                  meta.data.forEach(function (bar, index) {
                      var data = dataset.data[index];
                      ctx.fillText(data, bar._model.x, bar._model.y - 5);
                  });
              });
          }
      }
}
  // var 

    // Pie Graph 
    var demoBackData = {
      labels: lineGraphLable,
      datasets: [
        {
          label: "Module Raised Complaints",
          fill: false,
          hoverBorderWidth : 12,
          backgroundColor : ["#0074D9", "#FF4136", "#2ECC40"],
          borderColor: "rgba(75,192,192,0.4)",
          borderCapStyle: "butt",
          data: this.state.sortData
        }
      ]
    }
    var doughnutOptionsCategory = {
      maintainAspectRatio: true,
      cutoutPercentage : 0,
      // circumference : 12,
      datasets : [
        {
          backgroundColor : "rgba(0, 0, 0, 0.1)",
          weight: 1
        }
      ], 
      legend: {
        display: true
      },
      tooltips: {
        enabled: true
      }
    }
    
    return (
      <div>

      <Bar data={ this.state.BackDatagroups } 
        // width={500}
        // height={200}
        options={ this.state.lineGraphOptionGroups } />

      

      <br /><br /><br /><br /><br /><br /><br /><br />
      </div>
    );
  }
}

export default ReportMoleculeBarGroup;
