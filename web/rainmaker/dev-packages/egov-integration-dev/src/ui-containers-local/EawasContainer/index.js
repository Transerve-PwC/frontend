import React, { Component } from "react";
import CardContent from '@material-ui/core/CardContent';
import { connect } from "react-redux";
import get from "lodash/get";
import set from "lodash/set";
import Label from "egov-ui-kit/utils/translationNode";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { Pie } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import Chart from 'chart.js';
import "./index.scss";

class EawasContainer extends Component {

  state = {
    open: false,
    action: ""
  };

 
    componentDidMount = async () => {
      const { prepareFinalObject, toggleSnackbar } = this.props;
      
    };
    render() {
        const {  ProcessInstances,
          state,
          APIData, 
          pageName,        
          moduleName } = this.props;
       // let x =  parseInt(('1,234'.replace(',','')))
        let data=[];
        data.push(parseInt((get(APIData.ResponseBody, `AllottedAccommodations`, 0).replace(',',''))))
        data.push(parseInt((get(APIData.ResponseBody, `totalAccommodation`, 0).replace(',',''))))       
       // data.push(get(APIData.ResponseBody, `totalAccommodation`, 0))
        data.push(get(APIData.ResponseBody, `totalBidSubmitted`, 0))
        data.push(get(APIData.ResponseBody, `totalOnlineAllotment`, 0))
        data.push(get(APIData.ResponseBody, `vacantAccommodation`, 0))

          var PIEgraphOneSortedData = {
            labels: ["Total Accommodation","Total Bid Submitted","Total Online Allotment","Vacant Accommodation","Allotted Accommodations"],
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
                data:data,
               // data:[10,20,30,40,50]
                }
            ]
            }
                
            var PIEgraphOneOption = {
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
                display: true,
                position: 'right',
                labels: {
                fontFamily: "Comic Sans MS",
                boxWidth: 20,
                boxHeight: 2
                }
            },
            tooltips: {
                enabled: true
            },
            // title: {
            //     display: true,
            //     text: this.state.graphHardOneData.title,
            // },
           
            plugins: {
                datalabels: {
               
                }
                }
            }
  // Second Horizontal Graph
//   var graphTwoSortedData = {
//     labels: ["totalAccommodation","totalBidSubmitted","totalOnlineAllotment","vacantAccommodation","AllottedAccommodations"],
//     datasets: [
//         {
//         // label: this.state.drildownGraphLabel,
//         fill: false,
//         lineTension: 5,
//         hoverBorderWidth : 12,
//         // backgroundColor : this.state.colorRandom,
//         backgroundColor : ["#F77C15", "#385BC8", "", "#FFC300", "#348AE4", "#FF5733", "#9DC4E1", "#3A3B7F", "", "", "", "", "", ""],
//         borderColor: "rgba(75,192,192,0.4)",
//         borderCapStyle: "butt",
//         barPercentage: 2,
//         barThickness: 25,
//         maxBarThickness: 25,
//         minBarLength: 2,
//        // data: this.state.graphTwoData
//        data:[
//          10,20,30,40,50
//        ]
//         }
//     ]
// }

// var graphTwoOption = {
//     responsive : true,
//     // aspectRatio : 3,
//     maintainAspectRatio: false,
//     cutoutPercentage : 0,
//     datasets : [
//         {
//         backgroundColor : "rgba(0, 0, 0, 0.1)",
//         weight: 0
//         }
//     ], 
//     legend: {
//         display: false,
//         position: 'bottom',
//         labels: {
//         fontFamily: "Comic Sans MS",
//         boxWidth: 20,
//         boxHeight: 2
//         }
//     },
//     tooltips: {
//         enabled: true
//     },
//     // title: {
//     //     display: true,
//     //     text: this.state.graphHardTwoData.title
//     // },

//     scales: {
//         xAxes: [{
//             gridLines: {
//                 display:true
//             },
//             ticks: {
//                 suggestedMin: 0,
//                 // suggestedMax: 100,
//                 stepSize: 1
//             },
//             scaleLabel: {
//                 display: true,
//                // labelString: this.state.graphHardTwoData.msgX
//               }, 
//         }],
//         yAxes: [{
//             gridLines: {
//                 display: true
//             },
//             ticks: {
//                 suggestedMin: 0,
//                 stepSize: 1
//             },
//             scaleLabel: {
//                 display: true,
//                 //labelString: this.state.graphHardTwoData.msgY
//               }, 
//         }]
//     },
//     plugins: {
//         datalabels: {
//             display: false
       
//         }
//         }
// }
          if(pageName ==="INTIGRATION_EAWAS")
          {
            return  ( <div>
              {
                 APIData&&(
                 
                  <div>
 {
               
               <div style={{display:"flex", height:"310px"}}>
                 
              <table  id="reportTable"
                 style={{
                   width: "50%",
                   marginBottom:"20px"
                 }}
                 className="table table-striped table-bordered">
                  
                 <thead>
                 <tr className="report-table-header">
                 <th   style={{ verticalAlign:"middle", textAlign: "center"}} colSpan="2">
                  <Label
                    className="report-header-row-label"
                    labelStyle={{ wordWrap: "unset", wordBreak: "unset", fontWeight: "bold", }}
                    label="INTIGRATION_EOFFICE_STATE_HEADING"
                  />
                  </th>
                 
                 </tr>
                 {/* <tr className="report-table-header">
                 <th   style={{ verticalAlign:"middle", textAlign: "center"}} colSpan="1">

                  </th>
                  <th   style={{ verticalAlign:"middle", textAlign: "center"}} colSpan="1">
                  <Label
                    className="report-header-row-label"
                    labelStyle={{ wordWrap: "unset", wordBreak: "unset", fontWeight: "bold", }}
                    label="INTIGRATION_EOFFICE_COUNT_HEADING"
                  />
                  </th>
                 
                 </tr> */}
                 
                 </thead>
                 {
                    APIData&&(
                      <tbody>
                         {
                            <tr>
                          <th><Label
                    className="report-header-row-label"
                    labelStyle={{ wordWrap: "unset", wordBreak: "unset", fontWeight: "bold", }}
                    label="INTIGRATION_TOTAL_ACCOMMODATION_CNT"
                  /></th>                            
                            <th>{get(APIData.ResponseBody, `totalAccommodation`, "-") || "-"}</th>                                            
                            
                           
                          </tr>
                         }
                         {
                           <tr>
                             <th><Label
                    className="report-header-row-label"
                    labelStyle={{ wordWrap: "unset", wordBreak: "unset", fontWeight: "bold", }}
                    label="INTIGRATION_TOTAL_ALLOTED_ACC0MM0DATION_CNT"
                  /></th>                            
                            <th>{get(APIData.ResponseBody, `AllottedAccommodations`, "-") || "-"}</th> 
                           </tr>
                         }
                          {
                           <tr>
                             <th><Label
                    className="report-header-row-label"
                    labelStyle={{ wordWrap: "unset", wordBreak: "unset", fontWeight: "bold", }}
                    label="INTIGRATION_TOTAL_VACANT_ACC0MMODATION_CNT"
                  /></th>                            
                            <th>{get(APIData.ResponseBody, `vacantAccommodation`, "-") || "-"}</th> 
                           </tr>
                         }
                          {
                           <tr>
                             <th><Label
                    className="report-header-row-label"
                    labelStyle={{ wordWrap: "unset", wordBreak: "unset", fontWeight: "bold", }}
                    label="INTIGRATION_TOTAL_BID_SUBMITTED_CNT"
                  /></th>                            
                            <th>{get(APIData.ResponseBody, `totalBidSubmitted`, "-") || "-"}</th> 
                           </tr>
                         }
                          {
                           <tr>
                             <th><Label
                    className="report-header-row-label"
                    labelStyle={{ wordWrap: "unset", wordBreak: "unset", fontWeight: "bold", }}
                    label="INTIGRATION_TOTAL_ONLINE_ALLOTMENT_CNT"
                  /></th>                            
                            <th>{get(APIData.ResponseBody, `totalOnlineAllotment`, "-") || "-"}</th> 
                           </tr>
                         }
    
                    </tbody>
                    )                
                  }
                 </table>
                
                 {
                   // graph code
                  //  <div style={{display:"flex", }}>
            <CardContent style={{width:"50%", }}>
                   <React.Fragment>
                   <Pie
                   data={ PIEgraphOneSortedData } 
                   options={ PIEgraphOneOption } 
                   />
               </React.Fragment>
               </CardContent>
              //  </div>
                 }
                  </div>
               
            }
                  </div>
                 
               
                 )
              }         
            
               
               </div>);

          }
         

      }
  }
  const mapStateToProps = state => {
    const { auth, app } = state;
    const { menu } = app;
    const { userInfo } = auth;
    const name = auth && userInfo.name;
    let APIData = get(
      state,
      "screenConfiguration.preparedFinalObject.APIData",
      []
    );
    return { name, menu,state,APIData };
  };


  const mapDispacthToProps = dispatch => {
    return {
      prepareFinalObject: (path, value) =>
        dispatch(prepareFinalObject(path, value)),
      toggleSnackbar: (open, message, variant) =>
        dispatch(toggleSnackbar(open, message, variant)),dispatch
    };
  };
  export default connect(
    mapStateToProps,
    mapDispacthToProps
    
  )(EawasContainer);