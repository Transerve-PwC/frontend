import React, { Component } from "react";
import { Doughnut, Polar } from 'react-chartjs-2';
import { Line } from 'react-chartjs-2';
import { Bar } from 'react-chartjs-2';
import { Scatter } from 'react-chartjs-2';
// import { Polar } from 'react-chartjs-2';

class ReportMolecule extends React.Component {
  constructor(props) {
    super(props);
    this.state ={
        reportData: [],
        reportHeader: [],
        label: [],
        labelData: [],
        colorRandom : [],
        stateUpdated: false
    }
  }

  componentDidMount(){
    debugger    
    const propsresData = this.props.data
    const resData = propsresData

    if(resData.reportResponses.length>0){
    var label = [];
    var labelData = [];
    var coloR = [];
    var ict_unit = [];
    var efficiency = [];
    const reHeader = resData.reportResponses[0].reportHeader
    const rpData = resData.reportResponses[0].reportData

    for(var i=0; i<reHeader.length ; i++){
        label.push(reHeader[i].name);
        labelData.push(0)
    }

    for(var j=0; j<rpData.length; j++){
        console.log("No :: " + j + " "  +rpData[j]);
        for(var i=0; i<reHeader.length ; i++){
            console.log("0000000000 "+rpData[j][i]);
            labelData[i] = labelData[i] + rpData[j][i];
        }
    }

    for(var i=0 ; i< reHeader.length; i++){
        if(typeof(labelData[i]) === 'string'){
            labelData[i] = 0
        }
    }

    // Random Color 
    var dynamicColors = function() {
        var r = Math.floor(Math.random() * 255);
        var g = Math.floor(Math.random() * 255);
        var b = Math.floor(Math.random() * 255);
        return "rgb(" + r + "," + g + "," + b + ")";
     };

     for (var i in labelData) {
        ict_unit.push("ICT Unit " + labelData[i].ict_unit);
        efficiency.push(labelData[i].efficiency);
        coloR.push(dynamicColors());
     }

    this.setState({
        reportData: resData.reportResponses[0].reportData,
        reportHeader: resData.reportResponses[0].reportHeader,
        label: label,
        labelData: labelData,
        colorRandom: coloR
    });
    
  }

  }

  componentDidUpdate(){
    debugger
    const propsresData = this.props.data
    const resData = propsresData

    if(resData.reportResponses.length>0){
    var label = [];
    var labelData = [];
    var coloR = [];
    var ict_unit = [];
    var efficiency = [];
    const reHeader = resData.reportResponses[0].reportHeader
    const rpData = resData.reportResponses[0].reportData

    for(var i=0; i<reHeader.length ; i++){
        label.push(reHeader[i].name);
        labelData.push(0)
    }

    for(var j=0; j<rpData.length; j++){
        console.log("No :: " + j + " "  +rpData[j]);
        for(var i=0; i<reHeader.length ; i++){
            console.log("0000000000 "+rpData[j][i]);
            labelData[i] = labelData[i] + rpData[j][i];
        }
    }

    for(var i=0 ; i< reHeader.length; i++){
        if(typeof(labelData[i]) === 'string'){
            labelData[i] = 0
        }
    }

    // Random Color 
    var dynamicColors = function() {
        var r = Math.floor(Math.random() * 255);
        var g = Math.floor(Math.random() * 255);
        var b = Math.floor(Math.random() * 255);
        return "rgb(" + r + "," + g + "," + b + ")";
     };

     for (var i in labelData) {
        ict_unit.push("ICT Unit " + labelData[i].ict_unit);
        efficiency.push(labelData[i].efficiency);
        coloR.push(dynamicColors());
     }
    }

     
     if(resData.reportResponses.length > 0){
      // if(this.state.stateUpdated !== resData.reportResponses[0].reportData.length ){
        if(JSON.stringify(resData) !== JSON.stringify(this.state.stateUpdated) ){
        this.setState({
          reportData: resData.reportResponses[0].reportData,
          reportHeader: resData.reportResponses[0].reportHeader,
          label: label,
          labelData: labelData,
          colorRandom: coloR,
          stateUpdated : resData
        });
      }
     }

  }

  render() {

    debugger

    const { formKey } = this.props;
    console.log(this.state.reportHeader)    
    console.log(this.state.reportData)
    console.log(this.state.label)
    console.log(this.state.labelData)

    // Pie Graph 
    var demoBackData = {
      labels: this.state.label,
      datasets: [
        {
          label: "Module Raised Complaints",
          fill: false,
          hoverBorderWidth : 12,
          backgroundColor : this.state.colorRandom,
          borderColor: "rgba(75,192,192,0.4)",
          borderCapStyle: "butt",
          data: this.state.labelData
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
          Radar 
        <Doughnut data={ demoBackData } height="500px" width="1200px"
        options={ doughnutOptionsCategory } />
      <br /><br /><br /><br /><br /><br /><br /><br />
      </div>
    );
  }
}

export default ReportMolecule;