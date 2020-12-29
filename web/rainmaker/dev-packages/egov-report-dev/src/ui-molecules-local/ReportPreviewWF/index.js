import React, { Component } from "react";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { connect } from "react-redux";
import get from "lodash/get";
import set from "lodash/set";
import "./index.css"

class ReportPreviewWF extends React.Component {
  constructor(props) {
    super(props);
    this.state ={
      DATAJSON : [],
      STATEJSON : {},
      update : true,
    }
  }

  componentDidMount(){
    debugger
    const data = this.props.data

    var DATAJSON = data.demo ? data.demo.BusinessServices[0].states : []
        var dataAction = []
        var dataWOAction = []
        var updatedData = []
        for(var i=0; i< DATAJSON.length ; i++){
            if(DATAJSON[i].actions === ""){
                dataAction[0]=DATAJSON[i]
                updatedData.push(DATAJSON[i])
            }
            if(DATAJSON[i].actions !== null){
                dataAction.push(DATAJSON[i])
                updatedData.push(DATAJSON[i])
            }else{
                dataWOAction.push(DATAJSON[i])
            }
        }

        DATAJSON = [];
        for(var i=0; i< dataWOAction.length; i++){
            updatedData.push(dataWOAction[i])
        }

        DATAJSON = updatedData
        var stateidJSON = {}
        for(var i=0; i< DATAJSON.length; i++){
            console.log("SD")
            const uuid = DATAJSON[i].uuid;
            const applicationState = DATAJSON[i].state
            stateidJSON[uuid] = applicationState
            console.log(stateidJSON)
        }

        this.setState({
            DATAJSON : DATAJSON,
            STATEJSON : stateidJSON
        })
  }

  // componentDidUpdate(){
  //   debugger
  //   const data = this.props.data

  //   var DATAJSON = data.demo ? data.demo.BusinessServices[0].states : []
  //       var dataAction = []
  //       var dataWOAction = []
  //       var updatedData = []
  //       for(var i=0; i< DATAJSON.length ; i++){
  //           if(DATAJSON[i].actions === ""){
  //               dataAction[0]=DATAJSON[i]
  //               updatedData.push(DATAJSON[i])
  //           }
  //           if(DATAJSON[i].actions !== null){
  //               dataAction.push(DATAJSON[i])
  //               updatedData.push(DATAJSON[i])
  //           }else{
  //               dataWOAction.push(DATAJSON[i])
  //           }
  //       }

  //       DATAJSON = [];
  //       for(var i=0; i< dataWOAction.length; i++){
  //           updatedData.push(dataWOAction[i])
  //       }

  //       DATAJSON = updatedData
  //       var stateidJSON = {}
  //       for(var i=0; i< DATAJSON.length; i++){
  //           console.log("SD")
  //           const uuid = DATAJSON[i].uuid;
  //           const applicationState = DATAJSON[i].state
  //           stateidJSON[uuid] = applicationState
  //           console.log(stateidJSON)
  //       }

  //       if(this.state.update){
  //         this.setState({
  //           DATAJSON : DATAJSON,
  //           STATEJSON : stateidJSON,
  //           update : false
  //       })
  //       }
  // }
  render() {
    
    return (
      <div>
        {
            this.state.DATAJSON.map((applicationState, index) => (
                <table class="bodyTable">
                {index === 0 ? 
                <tr>
                <td> <b> {"Application State            "} </b> </td>
                <td> <b> {"Application Status           "} </b></td>
                <td> <b> {"Action                        "} </b> </td>
                <td>  <b>{"Actor                        "} </b> </td>
                <td> <b> {"Next State                        "} </b> </td>
                </tr>
                :
                null}
                {/* <li> Level {applicationState.state} </li> */}
                {
                    applicationState.actions === null ?
                    <tr>
                    {/* <dd>{ index }</dd>  */}
                    <td> { applicationState.state } </td>
                    <td> { applicationState.applicationStatus } </td>
                    <td> --- </td>
                    <td> --- </td>
                    <td> --- </td>
                    </tr>
                    :
                    null  
                }
                    {/* { JSON.stringify(applicationState.actions) } */}
                    {
                        (applicationState.actions || []).map((action, i) => (
                        applicationState.actions.length > 1 ? 
                        i === 0 ?
                        <tr>
                        {/* <dd>{ index }</dd>  */}
                        <td rowspan={applicationState.actions.length }> { applicationState.state } </td>
                        <td  rowspan={applicationState.actions.length }> { applicationState.applicationStatus } </td>
                        <td> { action.action } </td>
                        <td> { action.roles[0] } </td>
                        <td> { action.nextState ? this.state.STATEJSON[action.nextState] : "Deshpande"   } </td>
                        </tr> :
                        <tr>
                        {/* <dd>{ index }</dd>  */}
                        <td> { action.action } </td>
                        <td> { action.roles[0] } </td>
                        <td> { action.nextState ? this.state.STATEJSON[action.nextState] : "Deshpande"   } </td>
                        </tr> 
                        :
                        <tr>
                        {/* <dd>{ index }</dd>  */}
                        <td> { applicationState.state } </td>
                        <td> { applicationState.applicationStatus } </td>
                        <td> { action.action } </td>
                        <td> { action.roles[0] } </td>
                        <td> { action.nextState ? this.state.STATEJSON[action.nextState] : "Deshpande"   } </td>
                        </tr>
                        ))
                    }
                </table>
                
            ))
        }
      <hr/>
      <br /><br /><br /><br /><br />
      </div>
  );
  }
}

export default ReportPreviewWF;
