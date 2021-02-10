import React, { Component } from "react";
import { Doughnut } from 'react-chartjs-2';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import data from './data.json';
import './index.css'

class DashboardPIEGraph extends React.Component {
  constructor(props) {
    super(props);
    this.state ={
        allData : [],
        filterData : [],
        graphLabel: [],
        grahData: [],
        graphclicked: false,
        drildownGraphLabel : [],
        drildownGraphData: [],
        description: ""
    }
  }


  handleBack = (e) => {
    e.preventDefault();
    //debugger;
      this.setState({
          graphclicked: false,
      })
  }

  componentDidMount(){
      
    //debugger;
    const propsData = this.props.data
    if(propsData.reportResponses){
        const reportHeader = propsData.reportResponses[0].reportHeader;
        const reportData = propsData.reportResponses[0].reportData;
        const formatedData = [];
        
        for(var i=0; i<reportHeader.length ; i++){
            var singleData = {}
            var listData = []
            singleData[reportHeader[i].name] = listData;
            formatedData.push(singleData);
        }
    
        var group = reportData.reduce((r, a) => {
            // console.log("a", a);
            // console.log('r', r);
            r[a[11]] = [...r[a[11]] || [], a];
            return r;
           }, {});
        console.log("Complaint by status :: ", group);
        console.log("Status ::", reportHeader);
    
        var filteredGroupData = []
        var graphData = []
        for(var i=0; i<Object.keys(group).length ; i++){
            filteredGroupData.push(Object.values(group)[i]);
            graphData.push(Object.values(group)[i].length);
        }
    
        this.setState({
            allData : formatedData,
            filterData : filteredGroupData,
            graphLabel : Object.keys(group),
            grahData: graphData,
            prevData: propsData
        })
    }
  }

  componentDidUpdate(){
    
    //debugger;
    const propsData = this.props.data
    if(JSON.stringify(propsData) !== JSON.stringify(this.state.prevData) 
     && propsData.reportResponses === undefined ){
        const reportHeader = propsData.reportResponses[0].reportHeader;
        const reportData = propsData.reportResponses[0].reportData;
        const formatedData = [];
        
        for(var i=0; i<reportHeader.length ; i++){
            var singleData = {}
            var listData = []
            singleData[reportHeader[i].name] = listData;
            formatedData.push(singleData);
        }

        var group = reportData.reduce((r, a) => {
            // console.log("a", a);
            // console.log('r', r);
            r[a[11]] = [...r[a[11]] || [], a];
            return r;
        }, {});
        console.log("Complaint by status :: ", group);
        console.log("Status ::", reportHeader);

        var filteredGroupData = []
        var graphData = []
        for(var i=0; i<Object.keys(group).length ; i++){
            filteredGroupData.push(Object.values(group)[i]);
            graphData.push(Object.values(group)[i].length);
        }

        this.setState({
            allData : formatedData,
            filterData : filteredGroupData,
            graphLabel : Object.keys(group),
            grahData: graphData,
            prevData: propsData
        })
    }

  }

  render() {

    // Pie Graph 
    var graphDatabyStatus = {
    labels: this.state.graphLabel,
    // labels : ["Label 1", "Label 2"],
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
        data: this.state.grahData
        // data: [10, 20]
        }
    ]
    }

    var graphOptionbyStatus = {
    responsive : true,
    // aspectRatio : 3,
    maintainAspectRatio: false,
    cutoutPercentage : 0,
    // circumference : 12,
    onClick: (e, element) => {
        if (element.length > 0) {
        var ind = element[0]._index;
        // Group By Department Function 
        const drildownData = this.state.filterData[ind];
        var departmentWiseData = drildownData.reduce((r, a) => {
            // console.log("a", a);
            // console.log('r', r);
            r[a[0]] = [...r[a[0]] || [], a];
            return r;
            }, {});
        console.log("Complaint by status :: ", departmentWiseData);

        // Graph Setting
        var filteredGroupData = []
        var graphData = []
        for(var i=0; i<Object.keys(departmentWiseData).length ; i++){
            filteredGroupData.push(Object.values(departmentWiseData)[i]);
            graphData.push(Object.values(departmentWiseData)[i].length);
        }

        this.setState({
        //   description: "YOu have clicked"+ind+"...!",
        description: this.state.filterData[ind],
        graphclicked : true,
        drildownGraphLabel : Object.keys(departmentWiseData),
        drildownGraphData : graphData
        });
        // this.demoFunc(ind);            
        }
    },
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
        text: 'Description Report By Status'
    }
    // animation: {
    //   duration: 1,
    //   onComplete: function () {
    //       var chartInstance = this.chart,
    //           ctx = chartInstance.ctx;
    //           ctx.textAlign = 'center';
    //           ctx.fillStyle = "rgba(0, 0, 0, 1)";
    //           ctx.textBaseline = 'bottom';
    //           // Loop through each data in the datasets
    //           this.data.datasets.forEach(function (dataset, i) {  
    //               var meta = chartInstance.controller.getDatasetMeta(i);
    //               meta.data.forEach(function (bar, index) {
    //                   var data = dataset.data[index];
    //                   ctx.fillText(data, bar._model.x, bar._model.y - (index * 5));
    //               });
    //           });
    //       }
    // }
    }

    var graphDatabyDepartment = {
        labels: this.state.drildownGraphLabel,
        // labels : ["Label 1", "Label 2"],
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
            data: this.state.drildownGraphData
            // data: [10, 20]
            }
        ]
    }

    var graphOptionbyDepartment = {
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
            text: 'Description Report Status Sort By Department'
        }
    }
   
       
    return (
      <div>
        <div style={{display:"flex", height:"500px"}}> 
            <Card>
                <CardContent id="graphData">
                {
                this.state.graphclicked === false ? 
                <Doughnut
                data={ graphDatabyStatus }
                options={ graphOptionbyStatus } 
                />
                :
                <React.Fragment>
                    <Doughnut
                    data={ graphDatabyDepartment }
                    options={ graphOptionbyDepartment } 
                    />
                </React.Fragment>
                }
                {
                this.state.graphclicked ?
                <button onClick={this.handleBack} >
                { " << Back " } 
                </button>
                :
                null
                }
                </CardContent>
            </Card>
        </div>
      </div>
    );
  }
}

export default DashboardPIEGraph;