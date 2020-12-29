import React, { Component } from "react";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { connect } from "react-redux";
import get from "lodash/get";
import set from "lodash/set";
import { Line } from "react-chartjs-2";
import { Doughnut } from 'react-chartjs-2';
import { Radar } from 'react-chartjs-2';
import { Polar } from 'react-chartjs-2';
import { Scatter } from 'react-chartjs-2';

class ReportMoleculeRadar extends React.Component {
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
      lineGraphRaisedComplaints : []
      
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
    // var lineGraphLable = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"]
    // var lineGraphData =  [35,50,40, 25, 20]
    // var lineGraphLegandLabel = "Raised Complaints"
    // this.setState({
    //   lineGraphData : {
    //     labels: lineGraphLable,
    //     datasets: [
    //       {
    //         label: lineGraphLegandLabel,
    //         align : "right",
    //         fill: false,
    //         lineTension: 0.1,
    //         backgroundColor: "rgba(75,192,192,0.4)",
    //         borderColor: "rgba(75,192,192,1)",
    //         borderCapStyle: "butt",
    //         borderDash: [],
    //         borderDashOffset: 0.0,
    //         borderJoinStyle: "miter",
    //         pointBorderColor: "rgba(75,192,192,1)",
    //         pointBackgroundColor: "#fff",
    //         pointBorderWidth: 1,
    //         pointHoverRadius: 5,
    //         pointHoverBackgroundColor: "rgba(75,192,192,1)",
    //         pointHoverBorderColor: "rgba(220,220,220,1)",
    //         pointHoverBorderWidth: 2,
    //         pointRadius: 5,
    //         pointHitRadius: 10,
    //         data:lineGraphData
    //       }
    //     ]
    //   },
    //   lineGraphOption : {
    //         onClick: (e, element) => {
                
    //           if (element.length > 0) {
    //             var ind = element[0]._index;
    //             // alert("JSON :: "+e+ind);
    //             this.setState({
    //                 demo : true
    //             })
    //             this.demoFunc(ind);
                
    //           }
    //         },
    //         scales: {
    //           xAxes: [
    //             {
    //               gridLines: {
    //                 display: false
    //               }
    //             }
    //           ],
    //           yAxes: [
    //             {
    //               // stacked: true,
    //               gridLines: {
    //                 display: true
    //               },
    //             }
    //           ]
    //         },
    //         legend: {
    //           display: true,
    //           label : {
    //             padding : 12,
    //           align : "right"
    //           }
    //         },
    //         tooltips: {
    //           enabled: false
    //         }
    //   }
    // })
  }

  render() {
    const { formKey } = this.props;

    var lineGraphLable = this.state.clickgraph ? this.state.category : this.state.linegraphMonth
    var lineGraphDataSetData = this.state.clickgraph ?  this.state.sortData : this.state.lineGraphRaisedComplaints
    var lineGraphLegandLabel = "Raised Complaints"
    
    // Multiline Graph DAta 
    var multilineGraphData = {
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
        },
        {
          label: "Label 2",
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
          data:[80,56,59,84,72,10]
        }
      ]
  }
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
        }
    }

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

    // Radar Graph
    const radarData = {
      labels: lineGraphLable,
      datasets: [
        {
          label: "My First dataset",
          backgroundColor: "rgba(220,220,220,0.2)",
          pointBackgroundColor: "rgba(220,220,220,1)",
          data: this.state.sortData
        }, 
      //   {
      //     label: 'Hidden dataset',
      //     hidden: true,
      //     data: [15,25,35,45,55,65,75]
      //   }, 
      //   {
      //     label: "My Second dataset",
      //     backgroundColor: "rgba(151,187,205,0.2)",
      //     pointBackgroundColor: "rgba(151,187,205,1)",
      //     hoverPointBackgroundColor: "#fff",
      //     pointHighlightStroke: "rgba(151,187,205,1)",
      //     data: [10,20,30,40,50,60,70]
      //   }
      ]
    }
  const radarOptions = {
  onClick: (e, element) => {
      if (element.length > 0) {
      var ind = element[0]._index;
      alert("JSON :: "+e+ind);
      // this.setState({
      // demo : true
      // })
      // this.demoFunc(ind);

      }
  },
  legend: {
      position: 'top'
  },
  title: {
      display: true,
      text: 'Chart.js Radar Chart'
  },
  scale: {
      reverse: false,
      gridLines: {
      color: [
          'black',
          'red',
          'orange',
          'yellow',
          'green',
          'blue',
          'indigo',
          'violet'
      ]
      },
      ticks: {
      beginAtZero: true
      }
  }
  }

    // Scatter Graph
    const scatterData = {
    datasets: [{
        label: 'Scatter Dataset',
        backgroundColor : ["#0074D9", "#FF4136", "#2ECC40"],
        data: [{
            x: -10,
            y: 0
        }, {
            x: 0,
            y: 10
        }, {
            x: 10,
            y: 5
        }]
    }]
    }
    const scatterOptions = {
    scales: {
        xAxes: [{
            type: 'linear',
            position: 'bottom'
        }]
    }
    }
    
    return (
      <div>
        Graph Radar

        {
        this.state.clickgraph ? 
      <div>
      <Radar data={ radarData } 
      options={ radarOptions} />

      <Scatter data={ scatterData } 
      options={ scatterOptions} />

      <Polar data={ lineGraphData } 
      options={ scatterOptions} />

      <button onClick={this.handleBack} style={{border: "1px solid #FE7A51", height: "48px", margin:"16px"}} >
      Back </button>
      
      </div>
      :
      <div>
      <Line data={ lineGraphData } 
      width={500}
      height={200}
      options={ lineGraphOption} />


      {/* Multiline */}
      <Line data={ multilineGraphData } 
      width={500}
      height={200}
      options={ lineGraphOption} />
        </div>
      
      }
      

      <br /><br /><br /><br /><br /><br /><br /><br />
      </div>
    );
  }
}

export default ReportMoleculeRadar;
