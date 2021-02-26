import React, { Component } from "react";
import Collapsible from 'react-collapsible';
import jsPDF from 'jspdf'
import 'jspdf-autotable'
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { connect } from "react-redux";
import get from "lodash/get";
import set from "lodash/set";
import { Line } from "react-chartjs-2";
import { Doughnut } from 'react-chartjs-2';
// import WorkFlowTableImage from './WorkFlowTableImage';
import "./index.css"

class ReportPreview extends React.Component {
  constructor(props) {
    super(props);
    this.state ={
      DATAJSON : [],
      STATEJSON : {},
      update : true,
      CheckData: {},
      description: []
    }
  }

    // PDF function 
    pdfDownload = (e) => {
    //debugger;
    e.preventDefault();
    const DATAJSON = this.state.DATAJSON;
    const columnData = ["Application State", "Application Status", "Action", "Actor", "Next"]

    // Logic for to create next state key value JSONnextState
    var allStateJSON = {}
    for(var i=0; i<DATAJSON.length; i++){
        allStateJSON[DATAJSON[i].uuid] = DATAJSON[i].state
    }
    //debugger;
    // Logic to combine data into one JSON
    var state = []
    var row = []
    var rowItem = {}

    for(var i=0; i<DATAJSON.length; i++){
        var customAction = DATAJSON[i].actions ? DATAJSON[i].actions : [1] 
        var item = {}
        for(var j=0; j<customAction.length; j++){
            state.push(customAction.length)
            const actionItem = customAction[j].action ? customAction[j].action : "---"
            const actorItem = customAction[j].roles ? customAction[j].roles[0] : "---"
            const nextStateItem = customAction[j].nextState ? allStateJSON[customAction[j].nextState] : "---"
            
            item[customAction[j].action] = [ actionItem, actorItem, nextStateItem]
        }
        rowItem[i] = item   
    }

    var subRow = {}
    var tableRowDatabeforeSort = []
    for(var i=0; i<DATAJSON.length; i++){
        subRow[[DATAJSON[i].state, DATAJSON[i].applicationStatus]] = Object.values(rowItem[i]);
        var row;
        var rowData = Object.values(rowItem[i])
        for(var j=0; j<Object.values(rowItem[i]).length; j++){
            row =[DATAJSON[i].state, DATAJSON[i].applicationStatus, rowData[j][0], rowData[j][1], rowData[j][2]] 
            tableRowDatabeforeSort.push(row)                
        }
    }

    var tableRowData = []
    var rejectedRow = []
    for(var i=0; i<tableRowDatabeforeSort.length; i++){
        if(tableRowDatabeforeSort[i][4] === "---"){
            rejectedRow.push(tableRowDatabeforeSort[i]);
        }else{
            tableRowData.push(tableRowDatabeforeSort[i]);
        }
    }
    tableRowData = [...tableRowData, ...rejectedRow]

    //debugger;
    // PDF Code 
    const unit = "pt";
    const size = "A4"; // Use A1, A2, A3 or A4
    const orientation = "portrait"; // portrait or landscape
    const marginLeft = 40;
    const doc = new jsPDF(orientation, unit, size);

    var pageHeight = doc.internal.pageSize.height || doc.internal.pageSize.getHeight();
    var pageWidth = doc.internal.pageSize.width || doc.internal.pageSize.getWidth();

    doc.text("mChandigarh Application", pageWidth / 2, 20, 'center');

    doc.setFontSize(10);
    doc.text("WorkflowPreview", pageWidth / 2, 40, 'center');

    doc.autoTable({ html: '#my-table' });
    doc.setFontSize(5);

    doc.autoTable({
        head: [columnData],
        theme: "striped",
        styles: {
            fontSize: 7,
        },
        body:tableRowData
    });

    doc.save("WorkflowPreview.pdf");
    }

    componentDidMount(){
        //debugger;
        // const data = this.props.data
        // var DATAJSON = data.demo ? data.demo.BusinessServices[0].states : []
        // const data = {
        //     "ResponseInfo": {
        //         "apiId": "Rainmaker",
        //         "ver": ".01",
        //         "ts": null,
        //         "resMsgId": "uief87324",
        //         "msgId": "20170310130900|en_IN",
        //         "status": "successful"
        //     },
        //     "BusinessServices": [
        //         {
        //             "tenantId": "ch.chandigarh",
        //             "uuid": "ede451ea-76fc-4b57-b2df-9a5bdd186260",
        //             "businessService": "ROADCUTNOC",
        //             "business": "ROADCUTNOC",
        //             "businessServiceSla": 0,
        //             "states": [
        //                 {
        //                     "auditDetails": {
        //                         "createdBy": "6b813820-6ff3-466a-84a1-c4eb065fc16c",
        //                         "lastModifiedBy": "6b813820-6ff3-466a-84a1-c4eb065fc16c",
        //                         "createdTime": 1596805556173,
        //                         "lastModifiedTime": 1596805556173
        //                     },
        //                     "uuid": "926dcfef-faf4-45d7-b810-fdef55a93066",
        //                     "tenantId": "ch.chandigarh",
        //                     "businessServiceId": "ede451ea-76fc-4b57-b2df-9a5bdd186260",
        //                     "sla": 0,
        //                     "state": "",
        //                     "applicationStatus": "INITIATED",
        //                     "docUploadRequired": false,
        //                     "isStartState": true,
        //                     "isTerminateState": false,
        //                     "isStateUpdatable": true,
        //                     "actions": [
        //                         {
        //                             "auditDetails": {
        //                                 "createdBy": "6b813820-6ff3-466a-84a1-c4eb065fc16c",
        //                                 "lastModifiedBy": "6b813820-6ff3-466a-84a1-c4eb065fc16c",
        //                                 "createdTime": 1596805556173,
        //                                 "lastModifiedTime": 1596805556173
        //                             },
        //                             "uuid": "2efccfcb-571e-41f5-9ebf-c7024532fa72",
        //                             "tenantId": "ch.chandigarh",
        //                             "currentState": "926dcfef-faf4-45d7-b810-fdef55a93066",
        //                             "action": "INITIATED",
        //                             "nextState": "bad4cd39-ce47-4a19-bba4-c89014969330",
        //                             "roles": [
        //                                 "CITIZEN"
        //                             ]
        //                         }
        //                     ]
        //                 },
        //                 {
        //                     "auditDetails": {
        //                         "createdBy": "6b813820-6ff3-466a-84a1-c4eb065fc16c",
        //                         "lastModifiedBy": "6b813820-6ff3-466a-84a1-c4eb065fc16c",
        //                         "createdTime": 1596805556173,
        //                         "lastModifiedTime": 1596805556173
        //                     },
        //                     "uuid": "bad4cd39-ce47-4a19-bba4-c89014969330",
        //                     "tenantId": "ch.chandigarh",
        //                     "businessServiceId": "ede451ea-76fc-4b57-b2df-9a5bdd186260",
        //                     "sla": 0,
        //                     "state": "INITIATED",
        //                     "applicationStatus": "INITIATED",
        //                     "docUploadRequired": false,
        //                     "isStartState": false,
        //                     "isTerminateState": false,
        //                     "isStateUpdatable": true,
        //                     "actions": [
        //                         {
        //                             "auditDetails": {
        //                                 "createdBy": "6b813820-6ff3-466a-84a1-c4eb065fc16c",
        //                                 "lastModifiedBy": "6b813820-6ff3-466a-84a1-c4eb065fc16c",
        //                                 "createdTime": 1596805556173,
        //                                 "lastModifiedTime": 1596805556173
        //                             },
        //                             "uuid": "208fa0f6-90f7-4583-829e-a786fdd449e0",
        //                             "tenantId": "ch.chandigarh",
        //                             "currentState": "bad4cd39-ce47-4a19-bba4-c89014969330",
        //                             "action": "REASSIGN",
        //                             "nextState": "8be80c0b-86c3-4363-9bbc-18c71bab38e9",
        //                             "roles": [
        //                                 "JE"
        //                             ]
        //                         },
        //                         {
        //                             "auditDetails": {
        //                                 "createdBy": "6b813820-6ff3-466a-84a1-c4eb065fc16c",
        //                                 "lastModifiedBy": "6b813820-6ff3-466a-84a1-c4eb065fc16c",
        //                                 "createdTime": 1596805556173,
        //                                 "lastModifiedTime": 1596805556173
        //                             },
        //                             "uuid": "d5f1a68d-db5e-4970-b50a-15e46d29cc51",
        //                             "tenantId": "ch.chandigarh",
        //                             "currentState": "bad4cd39-ce47-4a19-bba4-c89014969330",
        //                             "action": "REVIEWSDO",
        //                             "nextState": "2f96eb75-b77a-4522-a841-44e7a8fc84de",
        //                             "roles": [
        //                                 "JE"
        //                             ]
        //                         }
        //                     ]
        //                 },
        //                 {
        //                     "auditDetails": {
        //                         "createdBy": "6b813820-6ff3-466a-84a1-c4eb065fc16c",
        //                         "lastModifiedBy": "6b813820-6ff3-466a-84a1-c4eb065fc16c",
        //                         "createdTime": 1596805556173,
        //                         "lastModifiedTime": 1596805556173
        //                     },
        //                     "uuid": "2f96eb75-b77a-4522-a841-44e7a8fc84de",
        //                     "tenantId": "ch.chandigarh",
        //                     "businessServiceId": "ede451ea-76fc-4b57-b2df-9a5bdd186260",
        //                     "sla": 0,
        //                     "state": "REVIEWSDO",
        //                     "applicationStatus": "REVIEWSDO",
        //                     "docUploadRequired": false,
        //                     "isStartState": false,
        //                     "isTerminateState": false,
        //                     "isStateUpdatable": true,
        //                     "actions": [
        //                         {
        //                             "auditDetails": {
        //                                 "createdBy": "6b813820-6ff3-466a-84a1-c4eb065fc16c",
        //                                 "lastModifiedBy": "6b813820-6ff3-466a-84a1-c4eb065fc16c",
        //                                 "createdTime": 1596805556173,
        //                                 "lastModifiedTime": 1596805556173
        //                             },
        //                             "uuid": "fb1cc4a6-fe95-41c2-9175-b5d39a28c04c",
        //                             "tenantId": "ch.chandigarh",
        //                             "currentState": "2f96eb75-b77a-4522-a841-44e7a8fc84de",
        //                             "action": "REVIEWOFEE",
        //                             "nextState": "40336452-8b47-4f1e-b215-8d036a907628",
        //                             "roles": [
        //                                 "SDO"
        //                             ]
        //                         },
        //                         {
        //                             "auditDetails": {
        //                                 "createdBy": "6b813820-6ff3-466a-84a1-c4eb065fc16c",
        //                                 "lastModifiedBy": "6b813820-6ff3-466a-84a1-c4eb065fc16c",
        //                                 "createdTime": 1596805556173,
        //                                 "lastModifiedTime": 1596805556173
        //                             },
        //                             "uuid": "cd3bbea0-c7be-49b1-8bf4-f5b5f7579d86",
        //                             "tenantId": "ch.chandigarh",
        //                             "currentState": "2f96eb75-b77a-4522-a841-44e7a8fc84de",
        //                             "action": "REASSIGNTOJE",
        //                             "nextState": "2cb7b6a0-15c7-4bf5-9dda-4b79596392bb",
        //                             "roles": [
        //                                 "SDO"
        //                             ]
        //                         }
        //                     ]
        //                 },
        //                 {
        //                     "auditDetails": {
        //                         "createdBy": "6b813820-6ff3-466a-84a1-c4eb065fc16c",
        //                         "lastModifiedBy": "6b813820-6ff3-466a-84a1-c4eb065fc16c",
        //                         "createdTime": 1596805556173,
        //                         "lastModifiedTime": 1596805556173
        //                     },
        //                     "uuid": "f6a36def-fa60-453f-822b-bb4cac3041f3",
        //                     "tenantId": "ch.chandigarh",
        //                     "businessServiceId": "ede451ea-76fc-4b57-b2df-9a5bdd186260",
        //                     "sla": 0,
        //                     "state": "REASSIGNTOSDO",
        //                     "applicationStatus": "REASSIGNTOSDO",
        //                     "docUploadRequired": false,
        //                     "isStartState": false,
        //                     "isTerminateState": false,
        //                     "isStateUpdatable": true,
        //                     "actions": [
        //                         {
        //                             "auditDetails": {
        //                                 "createdBy": "6b813820-6ff3-466a-84a1-c4eb065fc16c",
        //                                 "lastModifiedBy": "6b813820-6ff3-466a-84a1-c4eb065fc16c",
        //                                 "createdTime": 1596805556173,
        //                                 "lastModifiedTime": 1596805556173
        //                             },
        //                             "uuid": "627221d0-29c0-4f87-90dc-250aedcdf50a",
        //                             "tenantId": "ch.chandigarh",
        //                             "currentState": "f6a36def-fa60-453f-822b-bb4cac3041f3",
        //                             "action": "REVIEWOFEE",
        //                             "nextState": "40336452-8b47-4f1e-b215-8d036a907628",
        //                             "roles": [
        //                                 "SDO"
        //                             ]
        //                         },
        //                         {
        //                             "auditDetails": {
        //                                 "createdBy": "6b813820-6ff3-466a-84a1-c4eb065fc16c",
        //                                 "lastModifiedBy": "6b813820-6ff3-466a-84a1-c4eb065fc16c",
        //                                 "createdTime": 1596805556173,
        //                                 "lastModifiedTime": 1596805556173
        //                             },
        //                             "uuid": "a1fd434d-54bc-4ae2-bfe4-e20ec97fc7f2",
        //                             "tenantId": "ch.chandigarh",
        //                             "currentState": "f6a36def-fa60-453f-822b-bb4cac3041f3",
        //                             "action": "REASSIGNTOJE",
        //                             "nextState": "2cb7b6a0-15c7-4bf5-9dda-4b79596392bb",
        //                             "roles": [
        //                                 "SDO"
        //                             ]
        //                         }
        //                     ]
        //                 },
        //                 {
        //                     "auditDetails": {
        //                         "createdBy": "6b813820-6ff3-466a-84a1-c4eb065fc16c",
        //                         "lastModifiedBy": "6b813820-6ff3-466a-84a1-c4eb065fc16c",
        //                         "createdTime": 1596805556173,
        //                         "lastModifiedTime": 1596805556173
        //                     },
        //                     "uuid": "40336452-8b47-4f1e-b215-8d036a907628",
        //                     "tenantId": "ch.chandigarh",
        //                     "businessServiceId": "ede451ea-76fc-4b57-b2df-9a5bdd186260",
        //                     "sla": 0,
        //                     "state": "REVIEWOFEE",
        //                     "applicationStatus": "REVIEWOFEE",
        //                     "docUploadRequired": false,
        //                     "isStartState": false,
        //                     "isTerminateState": false,
        //                     "isStateUpdatable": true,
        //                     "actions": [
        //                         {
        //                             "auditDetails": {
        //                                 "createdBy": "6b813820-6ff3-466a-84a1-c4eb065fc16c",
        //                                 "lastModifiedBy": "6b813820-6ff3-466a-84a1-c4eb065fc16c",
        //                                 "createdTime": 1596805556173,
        //                                 "lastModifiedTime": 1596805556173
        //                             },
        //                             "uuid": "211b9f4d-c9b2-4ec9-9b21-e543efc0bf33",
        //                             "tenantId": "ch.chandigarh",
        //                             "currentState": "40336452-8b47-4f1e-b215-8d036a907628",
        //                             "action": "VERIFYDOEE",
        //                             "nextState": "f46fdae6-f25a-49c8-b81b-4592dac05810",
        //                             "roles": [
        //                                 "EE"
        //                             ]
        //                         },
        //                         {
        //                             "auditDetails": {
        //                                 "createdBy": "6b813820-6ff3-466a-84a1-c4eb065fc16c",
        //                                 "lastModifiedBy": "6b813820-6ff3-466a-84a1-c4eb065fc16c",
        //                                 "createdTime": 1596805556173,
        //                                 "lastModifiedTime": 1596805556173
        //                             },
        //                             "uuid": "33c047d6-c96c-42b0-acb0-f5051c866910",
        //                             "tenantId": "ch.chandigarh",
        //                             "currentState": "40336452-8b47-4f1e-b215-8d036a907628",
        //                             "action": "REASSIGNTOSDO",
        //                             "nextState": "f6a36def-fa60-453f-822b-bb4cac3041f3",
        //                             "roles": [
        //                                 "EE"
        //                             ]
        //                         }
        //                     ]
        //                 },
        //                 {
        //                     "auditDetails": {
        //                         "createdBy": "6b813820-6ff3-466a-84a1-c4eb065fc16c",
        //                         "lastModifiedBy": "6b813820-6ff3-466a-84a1-c4eb065fc16c",
        //                         "createdTime": 1596805556173,
        //                         "lastModifiedTime": 1596805556173
        //                     },
        //                     "uuid": "f46fdae6-f25a-49c8-b81b-4592dac05810",
        //                     "tenantId": "ch.chandigarh",
        //                     "businessServiceId": "ede451ea-76fc-4b57-b2df-9a5bdd186260",
        //                     "sla": 0,
        //                     "state": "VERIFYDOEE",
        //                     "applicationStatus": "VERIFYDOEE",
        //                     "docUploadRequired": false,
        //                     "isStartState": false,
        //                     "isTerminateState": false,
        //                     "isStateUpdatable": false,
        //                     "actions": [
        //                         {
        //                             "auditDetails": {
        //                                 "createdBy": "6b813820-6ff3-466a-84a1-c4eb065fc16c",
        //                                 "lastModifiedBy": "6b813820-6ff3-466a-84a1-c4eb065fc16c",
        //                                 "createdTime": 1596805556173,
        //                                 "lastModifiedTime": 1596805556173
        //                             },
        //                             "uuid": "53a55075-2432-4464-907d-c2c49dfcc555",
        //                             "tenantId": "ch.chandigarh",
        //                             "currentState": "f46fdae6-f25a-49c8-b81b-4592dac05810",
        //                             "action": "REVIEWAPPROVEEE",
        //                             "nextState": "8cde349c-d87c-498b-a95a-61057adcd1d2",
        //                             "roles": [
        //                                 "DOEE"
        //                             ]
        //                         }
        //                     ]
        //                 },
        //                 {
        //                     "auditDetails": {
        //                         "createdBy": "6b813820-6ff3-466a-84a1-c4eb065fc16c",
        //                         "lastModifiedBy": "6b813820-6ff3-466a-84a1-c4eb065fc16c",
        //                         "createdTime": 1596805556173,
        //                         "lastModifiedTime": 1596805556173
        //                     },
        //                     "uuid": "33886d3b-ec42-42be-95eb-855b38115e45",
        //                     "tenantId": "ch.chandigarh",
        //                     "businessServiceId": "ede451ea-76fc-4b57-b2df-9a5bdd186260",
        //                     "sla": 0,
        //                     "state": "REASSIGNDOEE",
        //                     "applicationStatus": "REASSIGNDOEE",
        //                     "docUploadRequired": false,
        //                     "isStartState": false,
        //                     "isTerminateState": false,
        //                     "isStateUpdatable": false,
        //                     "actions": [
        //                         {
        //                             "auditDetails": {
        //                                 "createdBy": "6b813820-6ff3-466a-84a1-c4eb065fc16c",
        //                                 "lastModifiedBy": "6b813820-6ff3-466a-84a1-c4eb065fc16c",
        //                                 "createdTime": 1596805556173,
        //                                 "lastModifiedTime": 1596805556173
        //                             },
        //                             "uuid": "f624a2cd-4e64-4a58-bb11-e28ea7e091a5",
        //                             "tenantId": "ch.chandigarh",
        //                             "currentState": "33886d3b-ec42-42be-95eb-855b38115e45",
        //                             "action": "REVIEWAPPROVEEE",
        //                             "nextState": "8cde349c-d87c-498b-a95a-61057adcd1d2",
        //                             "roles": [
        //                                 "DOEE"
        //                             ]
        //                         }
        //                     ]
        //                 },
        //                 {
        //                     "auditDetails": {
        //                         "createdBy": "6b813820-6ff3-466a-84a1-c4eb065fc16c",
        //                         "lastModifiedBy": "6b813820-6ff3-466a-84a1-c4eb065fc16c",
        //                         "createdTime": 1596805556173,
        //                         "lastModifiedTime": 1596805556173
        //                     },
        //                     "uuid": "8cde349c-d87c-498b-a95a-61057adcd1d2",
        //                     "tenantId": "ch.chandigarh",
        //                     "businessServiceId": "ede451ea-76fc-4b57-b2df-9a5bdd186260",
        //                     "sla": 0,
        //                     "state": "REVIEWAPPROVEEE",
        //                     "applicationStatus": "REVIEWAPPROVEEE",
        //                     "docUploadRequired": false,
        //                     "isStartState": false,
        //                     "isTerminateState": false,
        //                     "isStateUpdatable": true,
        //                     "actions": [
        //                         {
        //                             "auditDetails": {
        //                                 "createdBy": "6b813820-6ff3-466a-84a1-c4eb065fc16c",
        //                                 "lastModifiedBy": "6b813820-6ff3-466a-84a1-c4eb065fc16c",
        //                                 "createdTime": 1596805556173,
        //                                 "lastModifiedTime": 1596805556173
        //                             },
        //                             "uuid": "9e2f67d2-011f-427d-994f-65708c9dea5b",
        //                             "tenantId": "ch.chandigarh",
        //                             "currentState": "8cde349c-d87c-498b-a95a-61057adcd1d2",
        //                             "action": "REJECTED",
        //                             "nextState": "3341c8b9-1571-417a-bd8f-4eda9fa3860c",
        //                             "roles": [
        //                                 "EE"
        //                             ]
        //                         },
        //                         {
        //                             "auditDetails": {
        //                                 "createdBy": "6b813820-6ff3-466a-84a1-c4eb065fc16c",
        //                                 "lastModifiedBy": "6b813820-6ff3-466a-84a1-c4eb065fc16c",
        //                                 "createdTime": 1596805556173,
        //                                 "lastModifiedTime": 1596805556173
        //                             },
        //                             "uuid": "a537842e-56c4-4790-8994-41abb5df0e3b",
        //                             "tenantId": "ch.chandigarh",
        //                             "currentState": "8cde349c-d87c-498b-a95a-61057adcd1d2",
        //                             "action": "APPROVED",
        //                             "nextState": "f8046cd8-a254-42e0-8be5-c0e70f4c20ba",
        //                             "roles": [
        //                                 "EE"
        //                             ]
        //                         },
        //                         {
        //                             "auditDetails": {
        //                                 "createdBy": "6b813820-6ff3-466a-84a1-c4eb065fc16c",
        //                                 "lastModifiedBy": "6b813820-6ff3-466a-84a1-c4eb065fc16c",
        //                                 "createdTime": 1596805556173,
        //                                 "lastModifiedTime": 1596805556173
        //                             },
        //                             "uuid": "f1d8e44a-d5c0-40a2-8760-88a63a731358",
        //                             "tenantId": "ch.chandigarh",
        //                             "currentState": "8cde349c-d87c-498b-a95a-61057adcd1d2",
        //                             "action": "REVIEWOFSE",
        //                             "nextState": "da2f44f5-c45e-4f23-86e8-1e3bc0060ede",
        //                             "roles": [
        //                                 "EE"
        //                             ]
        //                         },
        //                         {
        //                             "auditDetails": {
        //                                 "createdBy": "6b813820-6ff3-466a-84a1-c4eb065fc16c",
        //                                 "lastModifiedBy": "6b813820-6ff3-466a-84a1-c4eb065fc16c",
        //                                 "createdTime": 1596805556173,
        //                                 "lastModifiedTime": 1596805556173
        //                             },
        //                             "uuid": "060b18e1-e3ae-4ed7-8104-457a527f022f",
        //                             "tenantId": "ch.chandigarh",
        //                             "currentState": "8cde349c-d87c-498b-a95a-61057adcd1d2",
        //                             "action": "REASSIGNTOSDO",
        //                             "nextState": "f6a36def-fa60-453f-822b-bb4cac3041f3",
        //                             "roles": [
        //                                 "EE"
        //                             ]
        //                         },
        //                         {
        //                             "auditDetails": {
        //                                 "createdBy": "6b813820-6ff3-466a-84a1-c4eb065fc16c",
        //                                 "lastModifiedBy": "6b813820-6ff3-466a-84a1-c4eb065fc16c",
        //                                 "createdTime": 1596805556173,
        //                                 "lastModifiedTime": 1596805556173
        //                             },
        //                             "uuid": "37956972-91c9-4f82-b50b-d9496c58a7b9",
        //                             "tenantId": "ch.chandigarh",
        //                             "currentState": "8cde349c-d87c-498b-a95a-61057adcd1d2",
        //                             "action": "REASSIGNDOEE",
        //                             "nextState": "33886d3b-ec42-42be-95eb-855b38115e45",
        //                             "roles": [
        //                                 "EE"
        //                             ]
        //                         }
        //                     ]
        //                 },
        //                 {
        //                     "auditDetails": {
        //                         "createdBy": "6b813820-6ff3-466a-84a1-c4eb065fc16c",
        //                         "lastModifiedBy": "6b813820-6ff3-466a-84a1-c4eb065fc16c",
        //                         "createdTime": 1596805556173,
        //                         "lastModifiedTime": 1596805556173
        //                     },
        //                     "uuid": "b115141e-b5a8-4a26-b94a-e683cbe927de",
        //                     "tenantId": "ch.chandigarh",
        //                     "businessServiceId": "ede451ea-76fc-4b57-b2df-9a5bdd186260",
        //                     "sla": 0,
        //                     "state": "REASSIGNAPPROVEEE",
        //                     "applicationStatus": "REASSIGNAPPROVEEE",
        //                     "docUploadRequired": false,
        //                     "isStartState": false,
        //                     "isTerminateState": false,
        //                     "isStateUpdatable": true,
        //                     "actions": [
        //                         {
        //                             "auditDetails": {
        //                                 "createdBy": "6b813820-6ff3-466a-84a1-c4eb065fc16c",
        //                                 "lastModifiedBy": "6b813820-6ff3-466a-84a1-c4eb065fc16c",
        //                                 "createdTime": 1596805556173,
        //                                 "lastModifiedTime": 1596805556173
        //                             },
        //                             "uuid": "4f0d5e92-b581-49ae-b47c-3fe2d8e08969",
        //                             "tenantId": "ch.chandigarh",
        //                             "currentState": "b115141e-b5a8-4a26-b94a-e683cbe927de",
        //                             "action": "APPROVED",
        //                             "nextState": "f8046cd8-a254-42e0-8be5-c0e70f4c20ba",
        //                             "roles": [
        //                                 "EE"
        //                             ]
        //                         },
        //                         {
        //                             "auditDetails": {
        //                                 "createdBy": "6b813820-6ff3-466a-84a1-c4eb065fc16c",
        //                                 "lastModifiedBy": "6b813820-6ff3-466a-84a1-c4eb065fc16c",
        //                                 "createdTime": 1596805556173,
        //                                 "lastModifiedTime": 1596805556173
        //                             },
        //                             "uuid": "03141657-f524-4a56-9506-168e0c505bdf",
        //                             "tenantId": "ch.chandigarh",
        //                             "currentState": "b115141e-b5a8-4a26-b94a-e683cbe927de",
        //                             "action": "REJECTED",
        //                             "nextState": "3341c8b9-1571-417a-bd8f-4eda9fa3860c",
        //                             "roles": [
        //                                 "EE"
        //                             ]
        //                         },
        //                         {
        //                             "auditDetails": {
        //                                 "createdBy": "6b813820-6ff3-466a-84a1-c4eb065fc16c",
        //                                 "lastModifiedBy": "6b813820-6ff3-466a-84a1-c4eb065fc16c",
        //                                 "createdTime": 1596805556173,
        //                                 "lastModifiedTime": 1596805556173
        //                             },
        //                             "uuid": "018ae9ba-626a-430b-b293-4939aa143ad1",
        //                             "tenantId": "ch.chandigarh",
        //                             "currentState": "b115141e-b5a8-4a26-b94a-e683cbe927de",
        //                             "action": "REVIEWOFSE",
        //                             "nextState": "da2f44f5-c45e-4f23-86e8-1e3bc0060ede",
        //                             "roles": [
        //                                 "EE"
        //                             ]
        //                         },
        //                         {
        //                             "auditDetails": {
        //                                 "createdBy": "6b813820-6ff3-466a-84a1-c4eb065fc16c",
        //                                 "lastModifiedBy": "6b813820-6ff3-466a-84a1-c4eb065fc16c",
        //                                 "createdTime": 1596805556173,
        //                                 "lastModifiedTime": 1596805556173
        //                             },
        //                             "uuid": "a22a8310-118c-4082-937a-9952efb843b5",
        //                             "tenantId": "ch.chandigarh",
        //                             "currentState": "b115141e-b5a8-4a26-b94a-e683cbe927de",
        //                             "action": "REASSIGNTOSDO",
        //                             "nextState": "f6a36def-fa60-453f-822b-bb4cac3041f3",
        //                             "roles": [
        //                                 "EE"
        //                             ]
        //                         },
        //                         {
        //                             "auditDetails": {
        //                                 "createdBy": "6b813820-6ff3-466a-84a1-c4eb065fc16c",
        //                                 "lastModifiedBy": "6b813820-6ff3-466a-84a1-c4eb065fc16c",
        //                                 "createdTime": 1596805556173,
        //                                 "lastModifiedTime": 1596805556173
        //                             },
        //                             "uuid": "8b81d2e2-a600-45dc-9904-28731c9d0635",
        //                             "tenantId": "ch.chandigarh",
        //                             "currentState": "b115141e-b5a8-4a26-b94a-e683cbe927de",
        //                             "action": "REASSIGNDOEE",
        //                             "nextState": "33886d3b-ec42-42be-95eb-855b38115e45",
        //                             "roles": [
        //                                 "EE"
        //                             ]
        //                         }
        //                     ]
        //                 },
        //                 {
        //                     "auditDetails": {
        //                         "createdBy": "6b813820-6ff3-466a-84a1-c4eb065fc16c",
        //                         "lastModifiedBy": "6b813820-6ff3-466a-84a1-c4eb065fc16c",
        //                         "createdTime": 1596805556173,
        //                         "lastModifiedTime": 1596805556173
        //                     },
        //                     "uuid": "da2f44f5-c45e-4f23-86e8-1e3bc0060ede",
        //                     "tenantId": "ch.chandigarh",
        //                     "businessServiceId": "ede451ea-76fc-4b57-b2df-9a5bdd186260",
        //                     "sla": 0,
        //                     "state": "REVIEWOFSE",
        //                     "applicationStatus": "REVIEWOFSE",
        //                     "docUploadRequired": false,
        //                     "isStartState": false,
        //                     "isTerminateState": false,
        //                     "isStateUpdatable": true,
        //                     "actions": [
        //                         {
        //                             "auditDetails": {
        //                                 "createdBy": "6b813820-6ff3-466a-84a1-c4eb065fc16c",
        //                                 "lastModifiedBy": "6b813820-6ff3-466a-84a1-c4eb065fc16c",
        //                                 "createdTime": 1596805556173,
        //                                 "lastModifiedTime": 1596805556173
        //                             },
        //                             "uuid": "7ccb7b12-8414-45f8-b128-f593c51ba263",
        //                             "tenantId": "ch.chandigarh",
        //                             "currentState": "da2f44f5-c45e-4f23-86e8-1e3bc0060ede",
        //                             "action": "VERIFYDOSE",
        //                             "nextState": "f5cb7eb4-01cf-4568-b61e-ac2fbc8cd3e9",
        //                             "roles": [
        //                                 "SE"
        //                             ]
        //                         },
        //                         {
        //                             "auditDetails": {
        //                                 "createdBy": "6b813820-6ff3-466a-84a1-c4eb065fc16c",
        //                                 "lastModifiedBy": "6b813820-6ff3-466a-84a1-c4eb065fc16c",
        //                                 "createdTime": 1596805556173,
        //                                 "lastModifiedTime": 1596805556173
        //                             },
        //                             "uuid": "a544c94d-b848-498b-bf0b-5dfe0b8c471e",
        //                             "tenantId": "ch.chandigarh",
        //                             "currentState": "da2f44f5-c45e-4f23-86e8-1e3bc0060ede",
        //                             "action": "REASSIGNAPPROVEEE",
        //                             "nextState": "b115141e-b5a8-4a26-b94a-e683cbe927de",
        //                             "roles": [
        //                                 "SE"
        //                             ]
        //                         }
        //                     ]
        //                 },
        //                 {
        //                     "auditDetails": {
        //                         "createdBy": "6b813820-6ff3-466a-84a1-c4eb065fc16c",
        //                         "lastModifiedBy": "6b813820-6ff3-466a-84a1-c4eb065fc16c",
        //                         "createdTime": 1596805556173,
        //                         "lastModifiedTime": 1596805556173
        //                     },
        //                     "uuid": "f5cb7eb4-01cf-4568-b61e-ac2fbc8cd3e9",
        //                     "tenantId": "ch.chandigarh",
        //                     "businessServiceId": "ede451ea-76fc-4b57-b2df-9a5bdd186260",
        //                     "sla": 0,
        //                     "state": "VERIFYDOSE",
        //                     "applicationStatus": "VERIFYDOSE",
        //                     "docUploadRequired": false,
        //                     "isStartState": false,
        //                     "isTerminateState": false,
        //                     "isStateUpdatable": false,
        //                     "actions": [
        //                         {
        //                             "auditDetails": {
        //                                 "createdBy": "6b813820-6ff3-466a-84a1-c4eb065fc16c",
        //                                 "lastModifiedBy": "6b813820-6ff3-466a-84a1-c4eb065fc16c",
        //                                 "createdTime": 1596805556173,
        //                                 "lastModifiedTime": 1596805556173
        //                             },
        //                             "uuid": "c4a9d0d5-ede2-437c-8e99-62f502fc2117",
        //                             "tenantId": "ch.chandigarh",
        //                             "currentState": "f5cb7eb4-01cf-4568-b61e-ac2fbc8cd3e9",
        //                             "action": "REVIEWAPPROVESE",
        //                             "nextState": "a1de11bd-e6f9-48b5-af84-261826cef38d",
        //                             "roles": [
        //                                 "DOSE"
        //                             ]
        //                         }
        //                     ]
        //                 },
        //                 {
        //                     "auditDetails": {
        //                         "createdBy": "6b813820-6ff3-466a-84a1-c4eb065fc16c",
        //                         "lastModifiedBy": "6b813820-6ff3-466a-84a1-c4eb065fc16c",
        //                         "createdTime": 1596805556173,
        //                         "lastModifiedTime": 1596805556173
        //                     },
        //                     "uuid": "8294d6e0-fbaa-49ed-be94-6694abec0146",
        //                     "tenantId": "ch.chandigarh",
        //                     "businessServiceId": "ede451ea-76fc-4b57-b2df-9a5bdd186260",
        //                     "sla": 0,
        //                     "state": "REASSIGNDOSE",
        //                     "applicationStatus": "REASSIGNDOSE",
        //                     "docUploadRequired": false,
        //                     "isStartState": false,
        //                     "isTerminateState": false,
        //                     "isStateUpdatable": false,
        //                     "actions": [
        //                         {
        //                             "auditDetails": {
        //                                 "createdBy": "6b813820-6ff3-466a-84a1-c4eb065fc16c",
        //                                 "lastModifiedBy": "6b813820-6ff3-466a-84a1-c4eb065fc16c",
        //                                 "createdTime": 1596805556173,
        //                                 "lastModifiedTime": 1596805556173
        //                             },
        //                             "uuid": "f3c44f3e-fa5a-45ec-9b7e-f975ec32df89",
        //                             "tenantId": "ch.chandigarh",
        //                             "currentState": "8294d6e0-fbaa-49ed-be94-6694abec0146",
        //                             "action": "REVIEWAPPROVESE",
        //                             "nextState": "a1de11bd-e6f9-48b5-af84-261826cef38d",
        //                             "roles": [
        //                                 "DOSE"
        //                             ]
        //                         }
        //                     ]
        //                 },
        //                 {
        //                     "auditDetails": {
        //                         "createdBy": "6b813820-6ff3-466a-84a1-c4eb065fc16c",
        //                         "lastModifiedBy": "6b813820-6ff3-466a-84a1-c4eb065fc16c",
        //                         "createdTime": 1596805556173,
        //                         "lastModifiedTime": 1596805556173
        //                     },
        //                     "uuid": "a1de11bd-e6f9-48b5-af84-261826cef38d",
        //                     "tenantId": "ch.chandigarh",
        //                     "businessServiceId": "ede451ea-76fc-4b57-b2df-9a5bdd186260",
        //                     "sla": 0,
        //                     "state": "REVIEWAPPROVESE",
        //                     "applicationStatus": "REVIEWAPPROVESE",
        //                     "docUploadRequired": false,
        //                     "isStartState": false,
        //                     "isTerminateState": false,
        //                     "isStateUpdatable": true,
        //                     "actions": [
        //                         {
        //                             "auditDetails": {
        //                                 "createdBy": "6b813820-6ff3-466a-84a1-c4eb065fc16c",
        //                                 "lastModifiedBy": "6b813820-6ff3-466a-84a1-c4eb065fc16c",
        //                                 "createdTime": 1596805556173,
        //                                 "lastModifiedTime": 1596805556173
        //                             },
        //                             "uuid": "0b1a4d95-c29d-4a2e-a1b4-9becdfe0e999",
        //                             "tenantId": "ch.chandigarh",
        //                             "currentState": "a1de11bd-e6f9-48b5-af84-261826cef38d",
        //                             "action": "REVIEWOFCE",
        //                             "nextState": "bc7f09a5-4b56-44bd-950a-16edca46a5d8",
        //                             "roles": [
        //                                 "SE"
        //                             ]
        //                         },
        //                         {
        //                             "auditDetails": {
        //                                 "createdBy": "6b813820-6ff3-466a-84a1-c4eb065fc16c",
        //                                 "lastModifiedBy": "6b813820-6ff3-466a-84a1-c4eb065fc16c",
        //                                 "createdTime": 1596805556173,
        //                                 "lastModifiedTime": 1596805556173
        //                             },
        //                             "uuid": "9e78714e-d6ca-42f8-8227-44862948ed87",
        //                             "tenantId": "ch.chandigarh",
        //                             "currentState": "a1de11bd-e6f9-48b5-af84-261826cef38d",
        //                             "action": "APPROVED",
        //                             "nextState": "f8046cd8-a254-42e0-8be5-c0e70f4c20ba",
        //                             "roles": [
        //                                 "SE"
        //                             ]
        //                         },
        //                         {
        //                             "auditDetails": {
        //                                 "createdBy": "6b813820-6ff3-466a-84a1-c4eb065fc16c",
        //                                 "lastModifiedBy": "6b813820-6ff3-466a-84a1-c4eb065fc16c",
        //                                 "createdTime": 1596805556173,
        //                                 "lastModifiedTime": 1596805556173
        //                             },
        //                             "uuid": "932224ba-24c4-48ae-a9dd-3a9570ab128d",
        //                             "tenantId": "ch.chandigarh",
        //                             "currentState": "a1de11bd-e6f9-48b5-af84-261826cef38d",
        //                             "action": "REJECTED",
        //                             "nextState": "3341c8b9-1571-417a-bd8f-4eda9fa3860c",
        //                             "roles": [
        //                                 "SE"
        //                             ]
        //                         },
        //                         {
        //                             "auditDetails": {
        //                                 "createdBy": "6b813820-6ff3-466a-84a1-c4eb065fc16c",
        //                                 "lastModifiedBy": "6b813820-6ff3-466a-84a1-c4eb065fc16c",
        //                                 "createdTime": 1596805556173,
        //                                 "lastModifiedTime": 1596805556173
        //                             },
        //                             "uuid": "601bdfd4-bc49-46ea-ad70-93f0911cd66a",
        //                             "tenantId": "ch.chandigarh",
        //                             "currentState": "a1de11bd-e6f9-48b5-af84-261826cef38d",
        //                             "action": "REASSIGNAPPROVEEE",
        //                             "nextState": "b115141e-b5a8-4a26-b94a-e683cbe927de",
        //                             "roles": [
        //                                 "SE"
        //                             ]
        //                         },
        //                         {
        //                             "auditDetails": {
        //                                 "createdBy": "6b813820-6ff3-466a-84a1-c4eb065fc16c",
        //                                 "lastModifiedBy": "6b813820-6ff3-466a-84a1-c4eb065fc16c",
        //                                 "createdTime": 1596805556173,
        //                                 "lastModifiedTime": 1596805556173
        //                             },
        //                             "uuid": "cf68a2c3-7ab2-4393-9320-8779288e811d",
        //                             "tenantId": "ch.chandigarh",
        //                             "currentState": "a1de11bd-e6f9-48b5-af84-261826cef38d",
        //                             "action": "REASSIGNDOSE",
        //                             "nextState": "8294d6e0-fbaa-49ed-be94-6694abec0146",
        //                             "roles": [
        //                                 "SE"
        //                             ]
        //                         }
        //                     ]
        //                 },
        //                 {
        //                     "auditDetails": {
        //                         "createdBy": "6b813820-6ff3-466a-84a1-c4eb065fc16c",
        //                         "lastModifiedBy": "6b813820-6ff3-466a-84a1-c4eb065fc16c",
        //                         "createdTime": 1596805556173,
        //                         "lastModifiedTime": 1596805556173
        //                     },
        //                     "uuid": "d645ce2f-06af-4b69-8b62-22ab02b196bb",
        //                     "tenantId": "ch.chandigarh",
        //                     "businessServiceId": "ede451ea-76fc-4b57-b2df-9a5bdd186260",
        //                     "sla": 0,
        //                     "state": "REASSIGNAPPROVESE",
        //                     "applicationStatus": "REASSIGNAPPROVESE",
        //                     "docUploadRequired": false,
        //                     "isStartState": false,
        //                     "isTerminateState": false,
        //                     "isStateUpdatable": true,
        //                     "actions": [
        //                         {
        //                             "auditDetails": {
        //                                 "createdBy": "6b813820-6ff3-466a-84a1-c4eb065fc16c",
        //                                 "lastModifiedBy": "6b813820-6ff3-466a-84a1-c4eb065fc16c",
        //                                 "createdTime": 1596805556173,
        //                                 "lastModifiedTime": 1596805556173
        //                             },
        //                             "uuid": "476ea6ed-55af-4458-8ca0-ab965a966e2b",
        //                             "tenantId": "ch.chandigarh",
        //                             "currentState": "d645ce2f-06af-4b69-8b62-22ab02b196bb",
        //                             "action": "APPROVED",
        //                             "nextState": "f8046cd8-a254-42e0-8be5-c0e70f4c20ba",
        //                             "roles": [
        //                                 "SE"
        //                             ]
        //                         },
        //                         {
        //                             "auditDetails": {
        //                                 "createdBy": "6b813820-6ff3-466a-84a1-c4eb065fc16c",
        //                                 "lastModifiedBy": "6b813820-6ff3-466a-84a1-c4eb065fc16c",
        //                                 "createdTime": 1596805556173,
        //                                 "lastModifiedTime": 1596805556173
        //                             },
        //                             "uuid": "afd80132-10bb-455c-b665-a281c2e536e1",
        //                             "tenantId": "ch.chandigarh",
        //                             "currentState": "d645ce2f-06af-4b69-8b62-22ab02b196bb",
        //                             "action": "REJECTED",
        //                             "nextState": "3341c8b9-1571-417a-bd8f-4eda9fa3860c",
        //                             "roles": [
        //                                 "SE"
        //                             ]
        //                         },
        //                         {
        //                             "auditDetails": {
        //                                 "createdBy": "6b813820-6ff3-466a-84a1-c4eb065fc16c",
        //                                 "lastModifiedBy": "6b813820-6ff3-466a-84a1-c4eb065fc16c",
        //                                 "createdTime": 1596805556173,
        //                                 "lastModifiedTime": 1596805556173
        //                             },
        //                             "uuid": "4aafd38d-4079-41f7-82ad-71aa87b0c842",
        //                             "tenantId": "ch.chandigarh",
        //                             "currentState": "d645ce2f-06af-4b69-8b62-22ab02b196bb",
        //                             "action": "REVIEWOFCE",
        //                             "nextState": "bc7f09a5-4b56-44bd-950a-16edca46a5d8",
        //                             "roles": [
        //                                 "SE"
        //                             ]
        //                         },
        //                         {
        //                             "auditDetails": {
        //                                 "createdBy": "6b813820-6ff3-466a-84a1-c4eb065fc16c",
        //                                 "lastModifiedBy": "6b813820-6ff3-466a-84a1-c4eb065fc16c",
        //                                 "createdTime": 1596805556173,
        //                                 "lastModifiedTime": 1596805556173
        //                             },
        //                             "uuid": "07743982-3e36-4692-8a59-651c24e05c79",
        //                             "tenantId": "ch.chandigarh",
        //                             "currentState": "d645ce2f-06af-4b69-8b62-22ab02b196bb",
        //                             "action": "REASSIGNAPPROVEEE",
        //                             "nextState": "b115141e-b5a8-4a26-b94a-e683cbe927de",
        //                             "roles": [
        //                                 "SE"
        //                             ]
        //                         },
        //                         {
        //                             "auditDetails": {
        //                                 "createdBy": "6b813820-6ff3-466a-84a1-c4eb065fc16c",
        //                                 "lastModifiedBy": "6b813820-6ff3-466a-84a1-c4eb065fc16c",
        //                                 "createdTime": 1596805556173,
        //                                 "lastModifiedTime": 1596805556173
        //                             },
        //                             "uuid": "ea3bd846-1fcd-4950-bfab-35cc970f830f",
        //                             "tenantId": "ch.chandigarh",
        //                             "currentState": "d645ce2f-06af-4b69-8b62-22ab02b196bb",
        //                             "action": "REASSIGNDOSE",
        //                             "nextState": "8294d6e0-fbaa-49ed-be94-6694abec0146",
        //                             "roles": [
        //                                 "SE"
        //                             ]
        //                         }
        //                     ]
        //                 },
        //                 {
        //                     "auditDetails": {
        //                         "createdBy": "6b813820-6ff3-466a-84a1-c4eb065fc16c",
        //                         "lastModifiedBy": "6b813820-6ff3-466a-84a1-c4eb065fc16c",
        //                         "createdTime": 1596805556173,
        //                         "lastModifiedTime": 1596805556173
        //                     },
        //                     "uuid": "2cb7b6a0-15c7-4bf5-9dda-4b79596392bb",
        //                     "tenantId": "ch.chandigarh",
        //                     "businessServiceId": "ede451ea-76fc-4b57-b2df-9a5bdd186260",
        //                     "sla": 0,
        //                     "state": "REASSIGNTOJE",
        //                     "applicationStatus": "REASSIGNTOJE",
        //                     "docUploadRequired": false,
        //                     "isStartState": false,
        //                     "isTerminateState": false,
        //                     "isStateUpdatable": true,
        //                     "actions": [
        //                         {
        //                             "auditDetails": {
        //                                 "createdBy": "6b813820-6ff3-466a-84a1-c4eb065fc16c",
        //                                 "lastModifiedBy": "6b813820-6ff3-466a-84a1-c4eb065fc16c",
        //                                 "createdTime": 1596805556173,
        //                                 "lastModifiedTime": 1596805556173
        //                             },
        //                             "uuid": "2b68e5dd-473d-4f58-bf4f-ec27bb59988f",
        //                             "tenantId": "ch.chandigarh",
        //                             "currentState": "2cb7b6a0-15c7-4bf5-9dda-4b79596392bb",
        //                             "action": "REVIEWSDO",
        //                             "nextState": "2f96eb75-b77a-4522-a841-44e7a8fc84de",
        //                             "roles": [
        //                                 "JE"
        //                             ]
        //                         },
        //                         {
        //                             "auditDetails": {
        //                                 "createdBy": "6b813820-6ff3-466a-84a1-c4eb065fc16c",
        //                                 "lastModifiedBy": "6b813820-6ff3-466a-84a1-c4eb065fc16c",
        //                                 "createdTime": 1596805556173,
        //                                 "lastModifiedTime": 1596805556173
        //                             },
        //                             "uuid": "34d6193c-531e-44d0-8a03-e8a0e7d764b3",
        //                             "tenantId": "ch.chandigarh",
        //                             "currentState": "2cb7b6a0-15c7-4bf5-9dda-4b79596392bb",
        //                             "action": "REASSIGN",
        //                             "nextState": "8be80c0b-86c3-4363-9bbc-18c71bab38e9",
        //                             "roles": [
        //                                 "JE"
        //                             ]
        //                         }
        //                     ]
        //                 },
        //                 {
        //                     "auditDetails": {
        //                         "createdBy": "6b813820-6ff3-466a-84a1-c4eb065fc16c",
        //                         "lastModifiedBy": "6b813820-6ff3-466a-84a1-c4eb065fc16c",
        //                         "createdTime": 1596805556173,
        //                         "lastModifiedTime": 1596805556173
        //                     },
        //                     "uuid": "bc7f09a5-4b56-44bd-950a-16edca46a5d8",
        //                     "tenantId": "ch.chandigarh",
        //                     "businessServiceId": "ede451ea-76fc-4b57-b2df-9a5bdd186260",
        //                     "sla": 0,
        //                     "state": "REVIEWOFCE",
        //                     "applicationStatus": "REVIEWOFCE",
        //                     "docUploadRequired": false,
        //                     "isStartState": false,
        //                     "isTerminateState": false,
        //                     "isStateUpdatable": true,
        //                     "actions": [
        //                         {
        //                             "auditDetails": {
        //                                 "createdBy": "6b813820-6ff3-466a-84a1-c4eb065fc16c",
        //                                 "lastModifiedBy": "6b813820-6ff3-466a-84a1-c4eb065fc16c",
        //                                 "createdTime": 1596805556173,
        //                                 "lastModifiedTime": 1596805556173
        //                             },
        //                             "uuid": "0426f785-c952-4571-86f4-22d929255507",
        //                             "tenantId": "ch.chandigarh",
        //                             "currentState": "bc7f09a5-4b56-44bd-950a-16edca46a5d8",
        //                             "action": "VERIFYDOCE",
        //                             "nextState": "60293b9a-6097-45d3-b806-e03e6b765841",
        //                             "roles": [
        //                                 "CE"
        //                             ]
        //                         },
        //                         {
        //                             "auditDetails": {
        //                                 "createdBy": "6b813820-6ff3-466a-84a1-c4eb065fc16c",
        //                                 "lastModifiedBy": "6b813820-6ff3-466a-84a1-c4eb065fc16c",
        //                                 "createdTime": 1596805556173,
        //                                 "lastModifiedTime": 1596805556173
        //                             },
        //                             "uuid": "27dee097-3604-46ac-9e38-7455b9c84d42",
        //                             "tenantId": "ch.chandigarh",
        //                             "currentState": "bc7f09a5-4b56-44bd-950a-16edca46a5d8",
        //                             "action": "REASSIGNAPPROVESE",
        //                             "nextState": "d645ce2f-06af-4b69-8b62-22ab02b196bb",
        //                             "roles": [
        //                                 "CE"
        //                             ]
        //                         }
        //                     ]
        //                 },
        //                 {
        //                     "auditDetails": {
        //                         "createdBy": "6b813820-6ff3-466a-84a1-c4eb065fc16c",
        //                         "lastModifiedBy": "6b813820-6ff3-466a-84a1-c4eb065fc16c",
        //                         "createdTime": 1596805556173,
        //                         "lastModifiedTime": 1596805556173
        //                     },
        //                     "uuid": "60293b9a-6097-45d3-b806-e03e6b765841",
        //                     "tenantId": "ch.chandigarh",
        //                     "businessServiceId": "ede451ea-76fc-4b57-b2df-9a5bdd186260",
        //                     "sla": 0,
        //                     "state": "VERIFYDOCE",
        //                     "applicationStatus": "VERIFYDOCE",
        //                     "docUploadRequired": false,
        //                     "isStartState": false,
        //                     "isTerminateState": false,
        //                     "isStateUpdatable": false,
        //                     "actions": [
        //                         {
        //                             "auditDetails": {
        //                                 "createdBy": "6b813820-6ff3-466a-84a1-c4eb065fc16c",
        //                                 "lastModifiedBy": "6b813820-6ff3-466a-84a1-c4eb065fc16c",
        //                                 "createdTime": 1596805556173,
        //                                 "lastModifiedTime": 1596805556173
        //                             },
        //                             "uuid": "7b06d8ed-fa77-4608-9635-621bbb5afbb5",
        //                             "tenantId": "ch.chandigarh",
        //                             "currentState": "60293b9a-6097-45d3-b806-e03e6b765841",
        //                             "action": "REVIEWOFWD",
        //                             "nextState": "3338c6cd-40fc-46c0-b894-79a607bf202d",
        //                             "roles": [
        //                                 "DOCE"
        //                             ]
        //                         }
        //                     ]
        //                 },
        //                 {
        //                     "auditDetails": {
        //                         "createdBy": "6b813820-6ff3-466a-84a1-c4eb065fc16c",
        //                         "lastModifiedBy": "6b813820-6ff3-466a-84a1-c4eb065fc16c",
        //                         "createdTime": 1596805556173,
        //                         "lastModifiedTime": 1596805556173
        //                     },
        //                     "uuid": "20f218ff-90c0-4172-86b6-cd4a6a48ce65",
        //                     "tenantId": "ch.chandigarh",
        //                     "businessServiceId": "ede451ea-76fc-4b57-b2df-9a5bdd186260",
        //                     "sla": 0,
        //                     "state": "REASSIGNDOCE",
        //                     "applicationStatus": "REASSIGNDOCE",
        //                     "docUploadRequired": false,
        //                     "isStartState": false,
        //                     "isTerminateState": false,
        //                     "isStateUpdatable": false,
        //                     "actions": [
        //                         {
        //                             "auditDetails": {
        //                                 "createdBy": "6b813820-6ff3-466a-84a1-c4eb065fc16c",
        //                                 "lastModifiedBy": "6b813820-6ff3-466a-84a1-c4eb065fc16c",
        //                                 "createdTime": 1596805556173,
        //                                 "lastModifiedTime": 1596805556173
        //                             },
        //                             "uuid": "dc6faa51-b372-4d34-ad72-f33ac376b90a",
        //                             "tenantId": "ch.chandigarh",
        //                             "currentState": "20f218ff-90c0-4172-86b6-cd4a6a48ce65",
        //                             "action": "REVIEWOFWD",
        //                             "nextState": "3338c6cd-40fc-46c0-b894-79a607bf202d",
        //                             "roles": [
        //                                 "DOCE"
        //                             ]
        //                         }
        //                     ]
        //                 },
        //                 {
        //                     "auditDetails": {
        //                         "createdBy": "6b813820-6ff3-466a-84a1-c4eb065fc16c",
        //                         "lastModifiedBy": "6b813820-6ff3-466a-84a1-c4eb065fc16c",
        //                         "createdTime": 1596805556173,
        //                         "lastModifiedTime": 1596805556173
        //                     },
        //                     "uuid": "3338c6cd-40fc-46c0-b894-79a607bf202d",
        //                     "tenantId": "ch.chandigarh",
        //                     "businessServiceId": "ede451ea-76fc-4b57-b2df-9a5bdd186260",
        //                     "sla": 0,
        //                     "state": "REVIEWOFWD",
        //                     "applicationStatus": "REVIEWOFWD",
        //                     "docUploadRequired": false,
        //                     "isStartState": false,
        //                     "isTerminateState": false,
        //                     "isStateUpdatable": true,
        //                     "actions": [
        //                         {
        //                             "auditDetails": {
        //                                 "createdBy": "6b813820-6ff3-466a-84a1-c4eb065fc16c",
        //                                 "lastModifiedBy": "6b813820-6ff3-466a-84a1-c4eb065fc16c",
        //                                 "createdTime": 1596805556173,
        //                                 "lastModifiedTime": 1596805556173
        //                             },
        //                             "uuid": "0e02db4e-9291-4b7e-8f89-97dc30555ca3",
        //                             "tenantId": "ch.chandigarh",
        //                             "currentState": "3338c6cd-40fc-46c0-b894-79a607bf202d",
        //                             "action": "PENDINGAPPROVAL",
        //                             "nextState": "2fb45ba2-a722-4ebb-bc10-217a04b091fc",
        //                             "roles": [
        //                                 "WD"
        //                             ]
        //                         }
        //                     ]
        //                 },
        //                 {
        //                     "auditDetails": {
        //                         "createdBy": "6b813820-6ff3-466a-84a1-c4eb065fc16c",
        //                         "lastModifiedBy": "6b813820-6ff3-466a-84a1-c4eb065fc16c",
        //                         "createdTime": 1596805556173,
        //                         "lastModifiedTime": 1596805556173
        //                     },
        //                     "uuid": "2fb45ba2-a722-4ebb-bc10-217a04b091fc",
        //                     "tenantId": "ch.chandigarh",
        //                     "businessServiceId": "ede451ea-76fc-4b57-b2df-9a5bdd186260",
        //                     "sla": 0,
        //                     "state": "PENDINGAPPROVAL",
        //                     "applicationStatus": "PENDINGAPPROVAL",
        //                     "docUploadRequired": false,
        //                     "isStartState": false,
        //                     "isTerminateState": false,
        //                     "isStateUpdatable": true,
        //                     "actions": [
        //                         {
        //                             "auditDetails": {
        //                                 "createdBy": "6b813820-6ff3-466a-84a1-c4eb065fc16c",
        //                                 "lastModifiedBy": "6b813820-6ff3-466a-84a1-c4eb065fc16c",
        //                                 "createdTime": 1596805556173,
        //                                 "lastModifiedTime": 1596805556173
        //                             },
        //                             "uuid": "90f195e1-1374-4236-b99f-7a8700fd717a",
        //                             "tenantId": "ch.chandigarh",
        //                             "currentState": "2fb45ba2-a722-4ebb-bc10-217a04b091fc",
        //                             "action": "APPROVED",
        //                             "nextState": "f8046cd8-a254-42e0-8be5-c0e70f4c20ba",
        //                             "roles": [
        //                                 "CE"
        //                             ]
        //                         },
        //                         {
        //                             "auditDetails": {
        //                                 "createdBy": "6b813820-6ff3-466a-84a1-c4eb065fc16c",
        //                                 "lastModifiedBy": "6b813820-6ff3-466a-84a1-c4eb065fc16c",
        //                                 "createdTime": 1596805556173,
        //                                 "lastModifiedTime": 1596805556173
        //                             },
        //                             "uuid": "1b579b89-58ce-4c9d-a612-5fdf3d6b02a2",
        //                             "tenantId": "ch.chandigarh",
        //                             "currentState": "2fb45ba2-a722-4ebb-bc10-217a04b091fc",
        //                             "action": "REJECTED",
        //                             "nextState": "3341c8b9-1571-417a-bd8f-4eda9fa3860c",
        //                             "roles": [
        //                                 "CE"
        //                             ]
        //                         },
        //                         {
        //                             "auditDetails": {
        //                                 "createdBy": "6b813820-6ff3-466a-84a1-c4eb065fc16c",
        //                                 "lastModifiedBy": "6b813820-6ff3-466a-84a1-c4eb065fc16c",
        //                                 "createdTime": 1596805556173,
        //                                 "lastModifiedTime": 1596805556173
        //                             },
        //                             "uuid": "fa0c4171-7851-4494-a9e2-9e0b89115a2a",
        //                             "tenantId": "ch.chandigarh",
        //                             "currentState": "2fb45ba2-a722-4ebb-bc10-217a04b091fc",
        //                             "action": "REASSIGNAPPROVESE",
        //                             "nextState": "d645ce2f-06af-4b69-8b62-22ab02b196bb",
        //                             "roles": [
        //                                 "CE"
        //                             ]
        //                         },
        //                         {
        //                             "auditDetails": {
        //                                 "createdBy": "6b813820-6ff3-466a-84a1-c4eb065fc16c",
        //                                 "lastModifiedBy": "6b813820-6ff3-466a-84a1-c4eb065fc16c",
        //                                 "createdTime": 1596805556173,
        //                                 "lastModifiedTime": 1596805556173
        //                             },
        //                             "uuid": "54f9992d-d8e2-45ac-88dd-28b627fd8b27",
        //                             "tenantId": "ch.chandigarh",
        //                             "currentState": "2fb45ba2-a722-4ebb-bc10-217a04b091fc",
        //                             "action": "REASSIGNDOCE",
        //                             "nextState": "20f218ff-90c0-4172-86b6-cd4a6a48ce65",
        //                             "roles": [
        //                                 "CE"
        //                             ]
        //                         }
        //                     ]
        //                 },
        //                 {
        //                     "auditDetails": {
        //                         "createdBy": "6b813820-6ff3-466a-84a1-c4eb065fc16c",
        //                         "lastModifiedBy": "6b813820-6ff3-466a-84a1-c4eb065fc16c",
        //                         "createdTime": 1596805556173,
        //                         "lastModifiedTime": 1596805556173
        //                     },
        //                     "uuid": "3341c8b9-1571-417a-bd8f-4eda9fa3860c",
        //                     "tenantId": "ch.chandigarh",
        //                     "businessServiceId": "ede451ea-76fc-4b57-b2df-9a5bdd186260",
        //                     "sla": 0,
        //                     "state": "REJECTED",
        //                     "applicationStatus": "REJECTED",
        //                     "docUploadRequired": false,
        //                     "isStartState": false,
        //                     "isTerminateState": true,
        //                     "isStateUpdatable": false,
        //                     "actions": null
        //                 },
        //                 {
        //                     "auditDetails": {
        //                         "createdBy": "6b813820-6ff3-466a-84a1-c4eb065fc16c",
        //                         "lastModifiedBy": "6b813820-6ff3-466a-84a1-c4eb065fc16c",
        //                         "createdTime": 1596805556173,
        //                         "lastModifiedTime": 1596805556173
        //                     },
        //                     "uuid": "8be80c0b-86c3-4363-9bbc-18c71bab38e9",
        //                     "tenantId": "ch.chandigarh",
        //                     "businessServiceId": "ede451ea-76fc-4b57-b2df-9a5bdd186260",
        //                     "sla": 0,
        //                     "state": "REASSIGN",
        //                     "applicationStatus": "REASSIGN",
        //                     "docUploadRequired": false,
        //                     "isStartState": false,
        //                     "isTerminateState": false,
        //                     "isStateUpdatable": true,
        //                     "actions": [
        //                         {
        //                             "auditDetails": {
        //                                 "createdBy": "6b813820-6ff3-466a-84a1-c4eb065fc16c",
        //                                 "lastModifiedBy": "6b813820-6ff3-466a-84a1-c4eb065fc16c",
        //                                 "createdTime": 1596805556173,
        //                                 "lastModifiedTime": 1596805556173
        //                             },
        //                             "uuid": "ebafbc52-8f28-4cae-a602-bfe93b221f9a",
        //                             "tenantId": "ch.chandigarh",
        //                             "currentState": "8be80c0b-86c3-4363-9bbc-18c71bab38e9",
        //                             "action": "RESENT",
        //                             "nextState": "8b5e2f61-7403-402a-8378-3fd28d654445",
        //                             "roles": [
        //                                 "CITIZEN"
        //                             ]
        //                         }
        //                     ]
        //                 },
        //                 {
        //                     "auditDetails": {
        //                         "createdBy": "6b813820-6ff3-466a-84a1-c4eb065fc16c",
        //                         "lastModifiedBy": "6b813820-6ff3-466a-84a1-c4eb065fc16c",
        //                         "createdTime": 1596805556173,
        //                         "lastModifiedTime": 1596805556173
        //                     },
        //                     "uuid": "8b5e2f61-7403-402a-8378-3fd28d654445",
        //                     "tenantId": "ch.chandigarh",
        //                     "businessServiceId": "ede451ea-76fc-4b57-b2df-9a5bdd186260",
        //                     "sla": 0,
        //                     "state": "RESENT",
        //                     "applicationStatus": "RESENT",
        //                     "docUploadRequired": false,
        //                     "isStartState": false,
        //                     "isTerminateState": false,
        //                     "isStateUpdatable": true,
        //                     "actions": [
        //                         {
        //                             "auditDetails": {
        //                                 "createdBy": "6b813820-6ff3-466a-84a1-c4eb065fc16c",
        //                                 "lastModifiedBy": "6b813820-6ff3-466a-84a1-c4eb065fc16c",
        //                                 "createdTime": 1596805556173,
        //                                 "lastModifiedTime": 1596805556173
        //                             },
        //                             "uuid": "610ab74c-2810-48eb-9cb3-dc0103931c23",
        //                             "tenantId": "ch.chandigarh",
        //                             "currentState": "8b5e2f61-7403-402a-8378-3fd28d654445",
        //                             "action": "REASSIGN",
        //                             "nextState": "8be80c0b-86c3-4363-9bbc-18c71bab38e9",
        //                             "roles": [
        //                                 "JE"
        //                             ]
        //                         },
        //                         {
        //                             "auditDetails": {
        //                                 "createdBy": "6b813820-6ff3-466a-84a1-c4eb065fc16c",
        //                                 "lastModifiedBy": "6b813820-6ff3-466a-84a1-c4eb065fc16c",
        //                                 "createdTime": 1596805556173,
        //                                 "lastModifiedTime": 1596805556173
        //                             },
        //                             "uuid": "491e5f4c-8876-4614-8a7b-37b7484516c6",
        //                             "tenantId": "ch.chandigarh",
        //                             "currentState": "8b5e2f61-7403-402a-8378-3fd28d654445",
        //                             "action": "REVIEWSDO",
        //                             "nextState": "2f96eb75-b77a-4522-a841-44e7a8fc84de",
        //                             "roles": [
        //                                 "JE"
        //                             ]
        //                         }
        //                     ]
        //                 },
        //                 {
        //                     "auditDetails": {
        //                         "createdBy": "6b813820-6ff3-466a-84a1-c4eb065fc16c",
        //                         "lastModifiedBy": "6b813820-6ff3-466a-84a1-c4eb065fc16c",
        //                         "createdTime": 1596805556173,
        //                         "lastModifiedTime": 1596805556173
        //                     },
        //                     "uuid": "f8046cd8-a254-42e0-8be5-c0e70f4c20ba",
        //                     "tenantId": "ch.chandigarh",
        //                     "businessServiceId": "ede451ea-76fc-4b57-b2df-9a5bdd186260",
        //                     "sla": 0,
        //                     "state": "APPROVED",
        //                     "applicationStatus": "APPROVED",
        //                     "docUploadRequired": false,
        //                     "isStartState": false,
        //                     "isTerminateState": false,
        //                     "isStateUpdatable": true,
        //                     "actions": [
        //                         {
        //                             "auditDetails": {
        //                                 "createdBy": "6b813820-6ff3-466a-84a1-c4eb065fc16c",
        //                                 "lastModifiedBy": "6b813820-6ff3-466a-84a1-c4eb065fc16c",
        //                                 "createdTime": 1596805556173,
        //                                 "lastModifiedTime": 1596805556173
        //                             },
        //                             "uuid": "22554715-8f05-4fdc-9163-fc0e9acdc45d",
        //                             "tenantId": "ch.chandigarh",
        //                             "currentState": "f8046cd8-a254-42e0-8be5-c0e70f4c20ba",
        //                             "action": "PAID",
        //                             "nextState": "2d8592f7-cd14-4717-99f3-ce1a03cc770b",
        //                             "roles": [
        //                                 "CITIZEN"
        //                             ]
        //                         }
        //                     ]
        //                 },
        //                 {
        //                     "auditDetails": {
        //                         "createdBy": "6b813820-6ff3-466a-84a1-c4eb065fc16c",
        //                         "lastModifiedBy": "e730e6d4-b215-4df6-b9cd-0aea27246538",
        //                         "createdTime": 1596805556173,
        //                         "lastModifiedTime": 1606880352878
        //                     },
        //                     "uuid": "2d8592f7-cd14-4717-99f3-ce1a03cc770b",
        //                     "tenantId": "ch.chandigarh",
        //                     "businessServiceId": "ede451ea-76fc-4b57-b2df-9a5bdd186260",
        //                     "sla": 0,
        //                     "state": "PAID",
        //                     "applicationStatus": "PAID",
        //                     "docUploadRequired": false,
        //                     "isStartState": false,
        //                     "isTerminateState": false,
        //                     "isStateUpdatable": true,
        //                     "actions": [
        //                         {
        //                             "auditDetails": {
        //                                 "createdBy": "e730e6d4-b215-4df6-b9cd-0aea27246538",
        //                                 "lastModifiedBy": "e730e6d4-b215-4df6-b9cd-0aea27246538",
        //                                 "createdTime": 1606880352878,
        //                                 "lastModifiedTime": 1606880352878
        //                             },
        //                             "uuid": "0c5fb9a9-9fce-4f41-8f9d-777d32f54201",
        //                             "tenantId": "ch.chandigarh",
        //                             "currentState": "2d8592f7-cd14-4717-99f3-ce1a03cc770b",
        //                             "action": "VERIFYANDFORWARD",
        //                             "nextState": "7286e3d7-8547-4995-94c5-3720974e8576",
        //                             "roles": [
        //                                 "SDO"
        //                             ]
        //                         }
        //                     ]
        //                 },
        //                 {
        //                     "auditDetails": {
        //                         "createdBy": "e730e6d4-b215-4df6-b9cd-0aea27246538",
        //                         "lastModifiedBy": "e730e6d4-b215-4df6-b9cd-0aea27246538",
        //                         "createdTime": 1606880352878,
        //                         "lastModifiedTime": 1606880352878
        //                     },
        //                     "uuid": "7286e3d7-8547-4995-94c5-3720974e8576",
        //                     "tenantId": "ch.chandigarh",
        //                     "businessServiceId": "ede451ea-76fc-4b57-b2df-9a5bdd186260",
        //                     "sla": 0,
        //                     "state": "VERIFYANDFORWARD",
        //                     "applicationStatus": "VERIFYANDFORWARD",
        //                     "docUploadRequired": false,
        //                     "isStartState": false,
        //                     "isTerminateState": false,
        //                     "isStateUpdatable": true,
        //                     "actions": [
        //                         {
        //                             "auditDetails": {
        //                                 "createdBy": "e730e6d4-b215-4df6-b9cd-0aea27246538",
        //                                 "lastModifiedBy": "e730e6d4-b215-4df6-b9cd-0aea27246538",
        //                                 "createdTime": 1606880352878,
        //                                 "lastModifiedTime": 1606880352878
        //                             },
        //                             "uuid": "0286d3b1-7de5-482b-8fa1-ab4aceda2e24",
        //                             "tenantId": "ch.chandigarh",
        //                             "currentState": "7286e3d7-8547-4995-94c5-3720974e8576",
        //                             "action": "COMPLETED",
        //                             "nextState": "ad3e3754-7fc5-4f3f-8f41-b9fe5dc4eb4f",
        //                             "roles": [
        //                                 "EE"
        //                             ]
        //                         }
        //                     ]
        //                 },
        //                 {
        //                     "auditDetails": {
        //                         "createdBy": "e730e6d4-b215-4df6-b9cd-0aea27246538",
        //                         "lastModifiedBy": "e730e6d4-b215-4df6-b9cd-0aea27246538",
        //                         "createdTime": 1606880352878,
        //                         "lastModifiedTime": 1606880352878
        //                     },
        //                     "uuid": "ad3e3754-7fc5-4f3f-8f41-b9fe5dc4eb4f",
        //                     "tenantId": "ch.chandigarh",
        //                     "businessServiceId": "ede451ea-76fc-4b57-b2df-9a5bdd186260",
        //                     "sla": 0,
        //                     "state": "COMPLETED",
        //                     "applicationStatus": "COMPLETED",
        //                     "docUploadRequired": false,
        //                     "isStartState": false,
        //                     "isTerminateState": true,
        //                     "isStateUpdatable": false,
        //                     "actions": null
        //                 }
        //             ],
        //             "auditDetails": {
        //                 "createdBy": "6b813820-6ff3-466a-84a1-c4eb065fc16c",
        //                 "lastModifiedBy": "e730e6d4-b215-4df6-b9cd-0aea27246538",
        //                 "createdTime": 1596805556173,
        //                 "lastModifiedTime": 1606880352878
        //             }
        //         }
        //     ]
        // }

        var DATAJSON = this.props.data.length > 0 ? this.props.data[0].BusinessServices[0].states : [];
        const desc = this.props.data[1];
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
                STATEJSON : stateidJSON,
                CheckData: this.props.data,
                description: desc
            })
    }

    componentDidUpdate(){
        //debugger;
        var data = []
        var desc = []
        if(this.props.data.length > 0){
            data = this.props.data[0].BusinessServices ? this.props.data[0].BusinessServices[0].states : [];
            desc = this.props.data[1]
        }
        if((JSON.stringify(this.state.CheckData) !== JSON.stringify(this.props.data)) && data.length > 0 ){
            var DATAJSON = data
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
                STATEJSON : stateidJSON,
                description: desc,
                CheckData : this.props.data
            })
        }

        // var DATAJSON = data.demo ? data.demo.BusinessServices[0].states : []
        //     var dataAction = []
        //     var dataWOAction = []
        //     var updatedData = []
        //     for(var i=0; i< DATAJSON.length ; i++){
        //         if(DATAJSON[i].actions === ""){
        //             dataAction[0]=DATAJSON[i]
        //             updatedData.push(DATAJSON[i])
        //         }
        //         if(DATAJSON[i].actions !== null){
        //             dataAction.push(DATAJSON[i])
        //             updatedData.push(DATAJSON[i])
        //         }else{
        //             dataWOAction.push(DATAJSON[i])
        //         }
        //     }

        //     DATAJSON = [];
        //     for(var i=0; i< dataWOAction.length; i++){
        //         updatedData.push(dataWOAction[i])
        //     }

        //     DATAJSON = updatedData
        //     var stateidJSON = {}
        //     for(var i=0; i< DATAJSON.length; i++){
        //         console.log("SD")
        //         const uuid = DATAJSON[i].uuid;
        //         const applicationState = DATAJSON[i].state
        //         stateidJSON[uuid] = applicationState
        //         console.log(stateidJSON)
        //     }

        //     if(this.state.update){
        //       this.setState({
        //         DATAJSON : DATAJSON,
        //         STATEJSON : stateidJSON,
        //         update : false
        //     })
        //     }

        
    }

  render() {
    
    return (
        <div className="previewContainer">
            {/* <center> */}
            {/* <WorkFlowTableImage  images = {[
            'http://placeimg.com/1200/800/nature',
            ]}
            /> */}
            {/* <Collapsible trigger="Workflow Table Structure">  */}
                <div className="previewTableDownload">
                    <div className="downloadLabel"> Download As: </div>
                    <button className="downloadBtn" onClick={this.pdfDownload}> PDF </button>

                    {/* <button className="columnToggleBtn" onClick={this.toggleColumn}> Column Visibility </button> */}
                </div>

            <h2> { this.state.description } </h2>
                <div>
                <table className="bodyTable">
                <tr>
                    <th> Application State  </th>
                    <th> Application Status </th>
                    <th> Action  </th>
                    <th> Actor  </th>
                    <th> Next  </th>
                </tr>
                </table>
                {
                    this.state.DATAJSON.map((applicationState, index) => (
                        <table className={ (index > 0 && (index %2 === 0)) ? "bodyTable evenRow" : "bodyTable"}>
                        {/* <li> Level {applicationState.state} </li> */}
                        {
                            applicationState.actions === null ?
                            <tr>
                            {/* class={index === this.state.DATAJSON ? alert("Check") : ""} */}
                            {/* <dd>{ index }</dd>  */}
                            <td className={ index+1 === this.state.DATAJSON.length ? "endLine" : ""}> { applicationState.state } </td>
                            <td className={ index+1 === this.state.DATAJSON.length ? "endLine" : ""}> { applicationState.applicationStatus } </td>
                            <td className={ index+1 === this.state.DATAJSON.length ? "endLine" : ""}> --- </td>
                            <td className={ index+1 === this.state.DATAJSON.length ? "endLine" : ""}> --- </td>
                            <td className={ index+1 === this.state.DATAJSON.length ? "endLine" : ""}> --- </td>
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
                                <td> { action.nextState ? this.state.STATEJSON[action.nextState] : ""   } </td>
                                </tr> :
                                <tr>
                                {/* <dd>{ index }</dd>  */}
                                <td> { action.action } </td>
                                <td> { action.roles[0] } </td>
                                <td> { action.nextState ? this.state.STATEJSON[action.nextState] : ""   } </td>
                                </tr> 
                                    :
                                    <tr>
                                {/* <dd>{ index }</dd>  */}
                                <td> { applicationState.state } </td>
                                <td> { applicationState.applicationStatus } </td>
                                <td> { action.action } </td>
                                <td> { action.roles[0] } </td>
                                <td> { action.nextState ? this.state.STATEJSON[action.nextState] : ""   } </td>
                                </tr>
                                ))
                            }
                        </table>
                        
                    ))
                }
                <hr/>
                </div>

            {/* </Collapsible> */}
            {/* </center> */}
        </div>
    
  );
  }
}

export default ReportPreview;
