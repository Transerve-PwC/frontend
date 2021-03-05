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
import './Water.css'
import WNSDashboardOne from './WNSDashboardOne';
import Water_data from './WNS_data.json';
import WNSDashboardTwo from './WNSDashboardTwo';

class WNSDashboard extends React.Component {
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
        {/* <h2> WNS Dashboard Route </h2>  */}
        {
            this.state.propSortBy === "dashboardType1" ?
            <WNSDashboardOne data = {Water_data} />
            : this.state.propSortBy === "dashboardType2" ?
            <WNSDashboardTwo data = {Water_data} />
            : null
        }
        </div>
    );
    }
}

export default WNSDashboard;