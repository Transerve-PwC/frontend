import React, { Component } from "react";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { connect } from "react-redux";
import get from "lodash/get";
import set from "lodash/set";
import { Line } from "react-chartjs-2";
import { Doughnut } from 'react-chartjs-2';
import { Bar } from 'react-chartjs-2';

class ReportMoleculeBarPie extends React.Component {
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
    
    return (
      <div>
        Pie and Line Graph

      {
        this.state.clickgraph ? 
      <div>
        <Doughnut data={ demoBackData }
        options={ doughnutOptionsCategory } />

      <button onClick={this.handleBack} style={{border: "1px solid #FE7A51", height: "48px", margin:"16px"}} >
      Back </button>
      
      </div>
      :
      // <Line data={ lineGraphData } 
      // width={500}
      // height={200}
      // options={ lineGraphOption} />

      <Bar data={ lineGraphData } 
      width={500}
      height={200}
      options={ lineGraphOption} />
      
      }

      

      <br /><br /><br /><br /><br /><br /><br /><br />
      </div>
    );
  }
}

export default ReportMoleculeBarPie;
