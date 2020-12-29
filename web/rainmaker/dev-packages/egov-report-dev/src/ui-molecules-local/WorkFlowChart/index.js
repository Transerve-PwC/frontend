import React, { Component } from "react";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { connect } from "react-redux";
import "./index.css"

class WorkFlowChart extends React.Component {
  constructor(props) {
    super(props);
    this.state ={
        DATA : [],
        update : true     
    }
  }

  componentDidUpdate(){
    debugger

    const FilterData = this.props.data

    if(FilterData !== "" & this.state.update){
      this.setState({
        DATA : FilterData,
        update : false
      })
    }

    
  }

  componentDidMount(){
    debugger
    const data = {
      "modulewiseWF" : [
      {
      "moduleName" : "OPMS",
      "wfName" : "PETNOC",
      "wfCode" : "PETNOC",
      "wfDesc" : "PETNOC Descripton"
      },
      {
      "moduleName" : "OPMS",
      "wfName" : "SELLMEATNOC",
      "wfCode" : "SELLMEATNOC",
      "wfDesc" : "SELLMEATNOC Descripton"
      },
      {
      "moduleName" : "OPMS",
      "wfName" : "ADVERTISEMENTNOC",
      "wfCode" : "ADVERTISEMENTNOC",
      "wfDesc" : "ADVERTISEMENTNOC Descripton"
      },
      {
      "moduleName" : "OPMS",
      "wfName" : "ROADCUTNOC",
      "wfCode" : "ROADCUTNOC",
      "wfDesc" : "ROADCUTNOC Descripton"
      },
      {
      "moduleName" : "RP",
      "wfName" : "OwnershipTransferRP",
      "wfCode" : "OwnershipTransferRP",
      "wfDesc" : "OwnershipTransfer Descripton"
      },
      {
      "moduleName" : "RP",
      "wfName" : "OwnershipTransferRP",
      "wfCode" : "OwnershipTransferRP",
      "wfDesc" : "OwnershipTransferRP Descripton"
      }
      ]
    }

    const FilterData = this.props.data
    
    this.setState({
        DATA : FilterData
    })
  }

  render() {
    debugger

    return(
      <div>

        <table>
        <tr>
          <td> Workflow </td>
          <td> Description </td>
        </tr>
        {
             (this.state.DATA || []).map((wf, index) => (
                <tr>
                <td> <a href={"preview?wfName="+wf.wfCode}> { wf.wfName } </a> </td>
                <td> { wf.wfDesc } </td>
                </tr>
             ))
        }
        </table>

      </div>
    );
  }
}

export default WorkFlowChart;
