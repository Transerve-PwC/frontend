import React, { Component } from "react";
import { connect } from "react-redux";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { Doughnut, Polar } from 'react-chartjs-2';
import { Line } from 'react-chartjs-2';
import { Bar } from 'react-chartjs-2';
import { Scatter } from 'react-chartjs-2';
import Grid from "@material-ui/core/Grid";
import { Card } from "@material-ui/core";
// import { Polar } from 'react-chartjs-2';
import CardContent from '@material-ui/core/CardContent';
import './index.css'

class DoughnutChart extends React.Component {
  constructor(props) {
    super(props);
    this.state ={
        reportData: [],
        reportHeader: [],
        label: [],
        labelData: [],
        colorRandom : [],
        graphclicked: false,
        description: ""
    }
  }

  handleBack = (e) => {
    e.preventDefault();
    this.setState({
      graphclicked : false
    })
  }

  componentDidMount(){
    debugger
    // const resData = {"tenantId":"ch.chandigarh","requestInfo":{"apiId":"emp","ver":"1.0","ts":"Mon Dec 28 07:02:27 GMT 2020","resMsgId":"uief87324","msgId":"20170310130900","status":"200"},"reportResponses":[{"viewPath":null,"selectiveDownload":false,"reportHeader":[{"localisationRequired":false,"name":"department","label":"reports.rainmaker-pgr.department","type":"string","defaultValue":null,"isMandatory":false,"isLocalisationRequired":false,"localisationPrefix":"","showColumn":true,"total":false,"rowTotal":null,"columnTotal":null,"initialValue":null,"minValue":null,"maxValue":null},{"localisationRequired":false,"name":"category","label":"reports.rainmaker-pgr.category","type":"string","defaultValue":null,"isMandatory":false,"isLocalisationRequired":false,"localisationPrefix":"","showColumn":true,"total":false,"rowTotal":null,"columnTotal":null,"initialValue":null,"minValue":null,"maxValue":null},{"localisationRequired":false,"name":"complainttype","label":"reports.rainmaker-pgr.complainttype","type":"string","defaultValue":null,"isMandatory":false,"isLocalisationRequired":false,"localisationPrefix":"","showColumn":true,"total":false,"rowTotal":null,"columnTotal":null,"initialValue":null,"minValue":null,"maxValue":null},{"localisationRequired":false,"name":"open","label":"reports.rainmaker-pgr.status.open","type":"string","defaultValue":null,"isMandatory":false,"isLocalisationRequired":false,"localisationPrefix":"","showColumn":true,"total":true,"rowTotal":null,"columnTotal":null,"initialValue":null,"minValue":null,"maxValue":null},{"localisationRequired":false,"name":"assigned","label":"reports.rainmaker-pgr.status.assigned","type":"string","defaultValue":null,"isMandatory":false,"isLocalisationRequired":false,"localisationPrefix":"","showColumn":true,"total":true,"rowTotal":null,"columnTotal":null,"initialValue":null,"minValue":null,"maxValue":null},{"localisationRequired":false,"name":"closed","label":"reports.rainmaker-pgr.status.closed","type":"string","defaultValue":null,"isMandatory":false,"isLocalisationRequired":false,"localisationPrefix":"","showColumn":true,"total":true,"rowTotal":null,"columnTotal":null,"initialValue":null,"minValue":null,"maxValue":null},{"localisationRequired":false,"name":"reassignrequested","label":"reports.rainmaker-pgr.status.reassignrequested","type":"string","defaultValue":null,"isMandatory":false,"isLocalisationRequired":false,"localisationPrefix":"","showColumn":true,"total":true,"rowTotal":null,"columnTotal":null,"initialValue":null,"minValue":null,"maxValue":null},{"localisationRequired":false,"name":"rejected","label":"reports.rainmaker-pgr.status.rejected","type":"string","defaultValue":null,"isMandatory":false,"isLocalisationRequired":false,"localisationPrefix":"","showColumn":true,"total":true,"rowTotal":null,"columnTotal":null,"initialValue":null,"minValue":null,"maxValue":null},{"localisationRequired":false,"name":"autoescalated","label":"reports.rainmaker-pgr.autoescalated","type":"string","defaultValue":null,"isMandatory":false,"isLocalisationRequired":false,"localisationPrefix":"","showColumn":true,"total":true,"rowTotal":null,"columnTotal":null,"initialValue":null,"minValue":null,"maxValue":null},{"localisationRequired":false,"name":"reopened","label":"reports.rainmaker-pgr.status.reopened","type":"string","defaultValue":null,"isMandatory":false,"isLocalisationRequired":false,"localisationPrefix":"","showColumn":true,"total":true,"rowTotal":null,"columnTotal":null,"initialValue":null,"minValue":null,"maxValue":null},{"localisationRequired":false,"name":"total","label":"reports.rainmaker-pgr.total","type":"string","defaultValue":null,"isMandatory":false,"isLocalisationRequired":false,"localisationPrefix":"","showColumn":true,"total":true,"rowTotal":null,"columnTotal":null,"initialValue":null,"minValue":null,"maxValue":null}],"ttl":null,"reportData":[[null,"Accounts Branch","DEP016_Accounts Branch_01",89,8,1,1,8,0,1,108],[null,"Accounts Branch","DEP016_Accounts Branch_02",1,1,0,0,0,0,0,2],[null,"Advertisement","DEP017_Advertisement_01",0,1,0,0,0,0,0,1],["Birth And Death","Birth Certificate","DEP07_Birth Certificate_01",0,0,1,0,1,5,0,7],["Birth And Death","Birth Certificate","DEP07_Birth Certificate_03",0,0,0,0,1,0,0,1],[null,"Booking Branch","DEP017_Booking Branch_01",0,0,0,0,0,0,1,1],[null,"Computer Cell","DEP012_Computer Cell_01",1,0,1,0,0,0,0,2],["Birth And Death","Death Certificate","DEP07_Birth Certificate_04",0,0,2,0,1,1,0,4],["Birth And Death","Death Certificate","DEP07_Birth Certificate_05",0,0,0,0,1,1,0,2],["Building And Roads","Disposal Of Malwa","DEP02_Disposal Of Malwa_01",0,0,20,0,4,22,1,47],["Enforcement","Encroachment","DEP05_Encroachment_01",0,1,0,0,0,0,0,1],["Horticulture","Horticulture","DEP03_Horticulture_03",0,1,1,0,1,0,0,3],["Horticulture","Horticulture","DEP03_Horticulture_07",0,1,0,0,0,0,0,1],["Horticulture","Horticulture","DEP03_Horticulture_11",0,0,0,0,0,3,0,3],["Horticulture","Horticulture","DEP03_Horticulture_15",0,0,0,0,0,1,0,1],["Tax Branch","House Tax","DEP13_House Tax_01",1,0,0,0,0,0,0,1],["Health And Sanitation","MOH","DEP06_MOH_01",0,1,0,0,0,0,0,1],["Health And Sanitation","MOH","DEP06_MOH_12",0,0,0,0,0,1,0,1],["Water Supply And Sewerage","Metering","DEP01_Metering_01",0,0,4,0,2,0,0,6],["Water Supply And Sewerage","Metering","DEP01_Metering_02",1,0,0,0,0,0,0,1],["Water Supply And Sewerage","Metering","DEP01_Metering_03",0,0,1,0,0,0,0,1],["Others","Others","DEP26_Others_01",2,0,0,0,0,0,0,2],["Parking Branch","Parking Branch","DEP19_Parking Branch_08",0,1,0,0,0,0,0,1],["Pension Branch","Pension Branch","DEP22_Pension Branch_01",1,1,0,0,0,0,0,2],["Building And Roads","Road Berm","DEP02_Road Berm_01",0,1,0,0,0,0,0,1],["Building And Roads","Roads","DEP02_Roads_01",0,0,26,0,1,35,1,63],["Building And Roads","Roads","DEP02_Roads_02",0,0,4,0,0,4,0,8],["Building And Roads","Roads","DEP02_Roads_03",0,0,3,0,0,5,0,8],["Building And Roads","Roads","DEP02_Roads_04",0,0,0,0,0,5,0,5],["Health And Sanitation","Sanitation","DEP06_Sanitation_01",0,0,0,0,0,2,0,2],["Water Supply And Sewerage","Sewerage","DEP01_Sewerage_01",0,0,3,0,0,9,0,12],["Water Supply And Sewerage","Sewerage","DEP01_Sewerage_04",0,0,0,0,0,1,0,1],["Water Supply And Sewerage","Sewerage","DEP01_Sewerage_07",0,0,1,0,0,0,0,1],["Water Supply And Sewerage","Stormwater","DEP01_Stormwater_01",0,0,3,0,0,0,0,3],["Health And Sanitation","Stray Dogs","DEP06_Stray Dogs_01",1,0,0,0,0,0,0,1],["Electrical","Street Light","DEP04_Street Light_01",0,0,0,0,0,1,0,1],["Electrical","Street Light","DEP04_Street Light_02",0,0,0,0,0,1,0,1],["Electrical","Street Light","DEP04_Street Light_03",0,0,0,0,0,1,0,1],["Electrical","Street Light","DEP04_Street Light_08",0,0,0,0,0,1,0,1],["Swarna Jayanti Shahari Rozgar Yojana(NULM)","Swarna Jayanti Shahari Rozgar Yojana(NULM)","DEP15_Swarna Jayanti Shahari Rozgar Yojana_01",0,0,1,0,0,0,0,1],["Swarna Jayanti Shahari Rozgar Yojana(NULM)","Swarna Jayanti Shahari Rozgar Yojana(NULM)","DEP15_Swarna Jayanti Shahari Rozgar Yojana_04",0,0,0,0,1,0,0,1],["Water Supply And Sewerage","Water Supply","DEP01_Water Supply_01",0,0,10,0,2,8,0,20],["Water Supply And Sewerage","Water Supply","DEP01_Water Supply_02",0,0,1,0,0,1,0,2],["Water Supply And Sewerage","Water Supply","DEP01_Water Supply_03",0,0,1,0,0,0,0,1],["Water Supply And Sewerage","Water Supply","DEP01_Water Supply_07",0,0,10,0,4,1,0,15],["Water Supply And Sewerage","Water Supply","DEP01_Water Supply_11",0,0,1,0,0,0,0,1],["Water Supply And Sewerage","Water Supply","DEP01_Water Supply_15",0,0,1,0,0,1,0,2],[null,null,"DEP016_Accounts Branch_01",1,0,0,0,0,0,0,1],["Water Supply And Sewerage",null,"DEP01_Sewerage_01",0,0,1,0,0,0,0,1],["Water Supply And Sewerage",null,"DEP01_Stormwater_01",0,0,0,0,0,1,0,1],["Water Supply And Sewerage",null,"DEP01_Tertiary Water_01",0,0,0,0,0,1,0,1],["Water Supply And Sewerage",null,"DEP01_Water Supply_01",0,0,0,0,0,2,0,2],["Water Supply And Sewerage",null,"DEP01_Water Supply_03",0,0,1,0,0,1,0,2],["Water Supply And Sewerage",null,"DEP01_Water Supply_04",0,0,0,0,0,1,0,1],["Water Supply And Sewerage",null,"DEP01_public Community Toilet_01",1,0,0,0,0,0,0,1],["Water Supply And Sewerage",null,"DEP01_public Community Toilet_03",1,0,0,0,0,0,0,1],["Horticulture",null,"DEP03_Horticulture_02",1,0,0,0,0,0,0,1]]}]}
    const resData = this.props.graphData

    var label = [];
    var labelData = [];
    var coloR = [];
    var ict_unit = [];
    var efficiency = [];
    const reHeader = resData.reportHeader
    const rpData = resData.reportData

    for(var i=0; i<reHeader.length ; i++){
        label.push(reHeader[i].name);
        labelData.push(0)
    }

    for(var j=0; j<rpData.length; j++){
        // console.log("No :: " + j + " "  +rpData[j]);
        for(var i=0; i<reHeader.length ; i++){
            // console.log("0000000000 "+rpData[j][i]);
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

     var sortedLabel=[]
      var sortedLabelData = []
 
      for(var i=0; i<label.length; i++){
       if(labelData[i] !== 0)
       {
         sortedLabel.push(label[i]);
         sortedLabelData.push(labelData[i]);
       }
      }

      this.setState({
          reportData: resData.reportData,
          reportHeader: resData.reportHeader,
          // label: label,
          // labelData: labelData,
          label: sortedLabel,
          labelData: sortedLabelData,
          colorRandom: coloR,
          GRAPHDATA : resData
      });

  }

  componentDidUpdate(){
    //debugger;
    const resData = this.props.graphData
    if(JSON.stringify(this.state.GRAPHDATA) !== JSON.stringify(this.props.graphData)){
      var label = [];
      var labelData = [];
      var coloR = [];
      var ict_unit = [];
      var efficiency = [];
      const reHeader = resData.reportHeader
      const rpData = resData.reportData

      for(var i=0; i<reHeader.length ; i++){
          label.push(reHeader[i].name);
          labelData.push(0)
      }

      for(var j=0; j<rpData.length; j++){
          // console.log("No :: " + j + " "  +rpData[j]);
          for(var i=0; i<reHeader.length ; i++){
              // console.log("0000000000 "+rpData[j][i]);
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

      var sortedLabel=[]
      var sortedLabelData = []
 
      for(var i=0; i<label.length; i++){
       if(labelData[i] !== 0)
       {
         sortedLabel.push(label[i]);
         sortedLabelData.push(labelData[i]);
       }
      }

      this.setState({
          reportData: resData.reportData,
          reportHeader: resData.reportHeader,
          // label: label,
          // labelData: labelData,
          label: sortedLabel,
          labelData: sortedLabelData,
          colorRandom: coloR,
          GRAPHDATA : resData
      });
    }
  }

  render() {
    const { formKey } = this.props;
    // console.log(this.state.reportHeader)    
    // console.log(this.state.reportData)
    // console.log(this.state.label)
    // console.log(this.state.labelData)

    // Pie Graph 
    var demoBackData = {
      labels: this.state.label,
      datasets: [
        {
          label: "Module Raised Complaints",
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
          data: this.state.labelData
        }
      ]
    }
    var doughnutOptionsCategory = {
      responsive : true,
      // aspectRatio : 3,
      maintainAspectRatio: false,
      cutoutPercentage : 0,
      // circumference : 12,
      onClick: (e, element) => {
        if (element.length > 0) {
          var ind = element[0]._index;
          // alert("JSON :: "+e+ind);
          this.setState({
            description: "YOu have clicked"+this.state.label[ind]+"...!",
            graphclicked : true
          });
          // this.demoFunc(ind);
          
        }
      },
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
      },
    //   animation: {
    //     duration: 1,
    //     onComplete: function () {
    //         var chartInstance = this.chart,
    //             ctx = chartInstance.ctx;
    //             ctx.textAlign = 'center';
    //             ctx.fillStyle = "rgba(0, 0, 0, 1)";
    //             ctx.textBaseline = 'bottom';
    //             // Loop through each data in the datasets
    //             this.data.datasets.forEach(function (dataset, i) {  
    //                 var meta = chartInstance.controller.getDatasetMeta(i);
    //                 meta.data.forEach(function (bar, index) {
    //                     var data = dataset.data[index];
    //                     ctx.fillText(data, bar._model.x, bar._model.y - 5);
    //                 });
    //             });
    //         }
    //     }
    }

    const listData = [1,2,3] 
       
    return (
      // <CardContent id="MuiCardContent-root-demo">
      //     <Doughnut
      //     data={ demoBackData }
      //     options={ doughnutOptionsCategory } />
      // </CardContent>
      <React.Fragment>
      <CardContent id="MuiCardContent-root-demo">
      {this.state.graphclicked === false ? 
      <Doughnut
      data={ demoBackData }
      options={ doughnutOptionsCategory } 
      />:
      <React.Fragment>
        <div>
          Description......
          {
          this.state.description
          }
        </div>
        <button onClick={this.handleBack} style={{ border: "none", background: "none", marginTop: "20px" }} >
          {"<< Back"} 
        </button>
      </React.Fragment>
      }
      
      
      </CardContent>
      </React.Fragment>
    );
  }
}

export default DoughnutChart;