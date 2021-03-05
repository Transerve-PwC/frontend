import React, { Component } from "react";
import { Doughnut, Bar, HorizontalBar, Line, Pie } from 'react-chartjs-2';
import CardContent from '@material-ui/core/CardContent';
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import ReactTable from "react-table-6";  
import "react-table-6/react-table.css" ;
import jsPDF from 'jspdf'
import 'jspdf-autotable';

import WorkDashboardOne from './workDashboardOne';
import WorkDashboardTwo from './workDashboardTwo';
import workAgreementData from './workAgreement_data.json';
import estimateDetailsData from './estimateDetails_data.json';
import './WorkDashboard.css'

class WorkDashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state ={
        propSortBy: ""
    }
  }


  componentDidMount(){
    debugger;
    const propSortBy = "dashboardType1";
    // const propSortBy = "dashboardType2";
    this.setState({
        propSortBy: propSortBy
    })        
}

componentDidUpdate(){
    debugger;
    const propSortBy = this.props.data.value;
    // const propSortBy = "dashboardType2";
    if(JSON.stringify(this.state.propSortBy) !== JSON.stringify(propSortBy)){
        this.setState({
            propSortBy: propSortBy
        }) 
    }       
}

    render() {

        return (
            <div>
            {/* <h2> Work Management Dashboard </h2>  */}
            {
                this.state.propSortBy === "dashboardType1" ?
                <WorkDashboardTwo data={estimateDetailsData} />                
                : this.state.propSortBy === "dashboardType2" ?
                <WorkDashboardOne data={workAgreementData} />
                : null
            }
            </div>
        );
    }
}

export default WorkDashboard;