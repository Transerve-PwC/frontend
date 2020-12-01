import { convertDateToEpoch } from "egov-ui-framework/ui-config/screens/specs/utils";
import React, { Component } from "react";
import { Button} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import MenuButton from "egov-ui-framework/ui-molecules/MenuButton";
import { connect } from "react-redux";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import get from "lodash/get";
import set from "lodash/set";
import Label from "egov-ui-kit/utils/translationNode";
import {
  LabelContainer,

} from "egov-ui-framework/ui-containers";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { downloadInventoryPdf} from '../../ui-config/screens/specs/utils'
import store from "ui-redux/store";
import { getprintpdf } from "../../ui-utils/storecommonsapi";
import "./index.scss";
import Div from "egov-ui-framework/ui-atoms/HtmlElements/Div";
class PayslipContainer extends Component {

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

          if(pageName ==="INTIGRATION_PAYSLIP")
          {
            return  ( <div>
              {
                 APIData&&(
                 
                  <div>
 {
               
               <div style={{ overscrollBehaviorX:"overlay",overflow:"overlay"}}>

                <table style={{width: "100%",}}>
                <tr><td  style={{
                  textAlign: "center",
                  width:"100%",
                  
                }} colSpan="2"><Label labelClassName="" style={{
                  fontWeight: "bold",                  
                }} label="INTIGRATION_PAY_EMP_CODE" /></td>
                </tr>
                <tr>                 
                
                <td style={{
                  textAlign: "center",
                  width:"100%",
                  
                }} colSpan="2"><Label labelClassName="" label={get(APIData.PaySlip, `EmployeeCode`, "-") || "-"} /></td>              
               
                </tr>
                <tr><td  style={{
                  textAlign: "left",
                  width:"15%"
                }}><Label labelClassName="" style={{
                  fontWeight: "bold",
                  
                }} label="INTIGRATION_PAY_EMP_NAME" /></td>                
                <td><Label labelClassName="" label={get(APIData.PaySlip, `Name`, "-") || "-"}/></td> 
                </tr> 
                <tr><td  style={{
                  textAlign: "left",
                  width:"15%"
                }}><Label labelClassName="" style={{
                  fontWeight: "bold",
                  
                }} label="INTIGRATION_PAY_EMP_FATHER_NAME" /></td>                
                <td><Label labelClassName="" label={get(APIData.PaySlip, `FatherName`, "-") || "-"}/></td> 
                </tr> 
                <tr><td  style={{
                  textAlign: "left",
                  width:"15%"
                }}><Label labelClassName="" style={{
                  fontWeight: "bold",
                  
                }} label="INTIGRATION_PAY_EMP_DEGIGNATION" /></td>                
                <td><Label labelClassName="" label={get(APIData.PaySlip, `Designation`, "-") || "-"}/></td> 
                </tr> 
                <tr><td  style={{
                  textAlign: "left",
                  width:"15%"
                }}><Label labelClassName="" style={{
                  fontWeight: "bold",
                  
                }} label="INTIGRATION_PAY_EMP_DEPARTMENT" /></td>                
                <td><Label labelClassName="" label={get(APIData.PaySlip, `DDOName`, "-") || "-"}/></td> 
                </tr> 
                 </table>
                 {
                    <div style={{ overscrollBehaviorX:"overlay",overflow:"overlay"}}>
                      <table  id="reportTable"
                 style={{
                   width: "100%",
                   marginBottom:"20px"
                 }}
                 className="table table-striped table-bordered">
                   <thead>
                   <tr className="report-table-header">
                   <th  style={{ verticalAlign:"middle", textAlign: "center"}} colSpan="1">
                  <Label
                    className="report-header-row-label"
                    labelStyle={{ wordWrap: "unset", wordBreak: "unset", fontWeight: "bold", }}
                    label="INTIGRATION_PAYSLIP_HEADER_ALLOWANCES"
                  />
                  </th>
                  <th  style={{ verticalAlign:"middle", textAlign: "center"}} colSpan="1">
                  <Label
                    className="report-header-row-label"
                    labelStyle={{ wordWrap: "unset", wordBreak: "unset", fontWeight: "bold", }}
                    label="INTIGRATION_PAYSLIP_AMOUNT"
                  />
                  </th>
                  <th  style={{ verticalAlign:"middle", textAlign: "center"}} colSpan="1">
                  <Label
                    className="report-header-row-label"
                    labelStyle={{ wordWrap: "unset", wordBreak: "unset", fontWeight: "bold", }}
                    label="INTIGRATION_PAYSLIP_HEADER_DEDUCTION"
                  />
                  </th>
                  <th  style={{ verticalAlign:"middle", textAlign: "center"}} colSpan="1">
                  <Label
                    className="report-header-row-label"
                    labelStyle={{ wordWrap: "unset", wordBreak: "unset", fontWeight: "bold", }}
                    label="INTIGRATION_PAYSLIP_AMOUNT"
                  />
                  </th>
                   </tr>
                   </thead>
                   <tbody>
                     {
                       APIData&&(
                       APIData.PaySlip.Allowances.map((item,i)=>{
                              return(
                                <tr>
                                 
                                  <th>{item.Allowances_Text}</th>
                                  <th style={{fontWeight: "initial", textAlign:"right"}}>{item.Allowances_Amount}</th>
                                  <th>{item.Deductions_Text}</th>
                                  <th style={{fontWeight: "initial", textAlign:"right"}}>{item.Deductions_Amount}</th>
                                  
                                 
                                 
                                </tr>
                              )
                            
                            }))
                     }
                   </tbody>
                 </table>
                      </div>
                 }
                 
              {/* <table  id="reportTable"
                 style={{
                   width: "100%",
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
                 <tr className="report-table-header">
                 <th   style={{ verticalAlign:"middle", textAlign: "center"}} colSpan="1">
                 
                  </th>
                  <th   style={{ verticalAlign:"middle", textAlign: "center"}} colSpan="1">
                  <Label
                    className="report-header-row-label"
                    labelStyle={{ wordWrap: "unset", wordBreak: "unset", fontWeight: "bold", }}
                    label="INTIGRATION_EOFFICE_COUNT_HEADING"
                  />
                  </th>
                 
                 </tr>
                 
                 </thead>
                 {
                    APIData&&(
                      <tbody>
                         {
                            <tr>
                          <th><Label
                    className="report-header-row-label"
                    labelStyle={{ wordWrap: "unset", wordBreak: "unset", fontWeight: "bold", }}
                    label="INTIGRATION_TOTAL_FILE_PENDING_CNT"
                  /></th>                            
                            <th>{get(APIData.eofficestat, `totalFilesPendingCnt`, "-") || "-"}</th>                                            
                            
                           
                          </tr>
                         }
                         {
                           <tr>
                             <th><Label
                    className="report-header-row-label"
                    labelStyle={{ wordWrap: "unset", wordBreak: "unset", fontWeight: "bold", }}
                    label="INTIGRATION_TOTAL_FILE_CLOSED_CNT"
                  /></th>                            
                            <th>{get(APIData.eofficestat, `totalFilesClosed`, "-") || "-"}</th> 
                           </tr>
                         }
                          {
                           <tr>
                             <th><Label
                    className="report-header-row-label"
                    labelStyle={{ wordWrap: "unset", wordBreak: "unset", fontWeight: "bold", }}
                    label="INTIGRATION_TOTAL_RECEIPT_PENDING_CNT"
                  /></th>                            
                            <th>{get(APIData.eofficestat, `totalReceiptsPending`, "-") || "-"}</th> 
                           </tr>
                         }
                          {
                           <tr>
                             <th><Label
                    className="report-header-row-label"
                    labelStyle={{ wordWrap: "unset", wordBreak: "unset", fontWeight: "bold", }}
                    label="INTIGRATION_TOTAL_RECEIPT_CLOSED_CNT"
                  /></th>                            
                            <th>{get(APIData.eofficestat, `totalReceiptsClosed`, "-") || "-"}</th> 
                           </tr>
                         }
                          {
                           <tr>
                             <th><Label
                    className="report-header-row-label"
                    labelStyle={{ wordWrap: "unset", wordBreak: "unset", fontWeight: "bold", }}
                    label="INTIGRATION_TOTAL_VIP_RECEIPT_PENDING_CNT"
                  /></th>                            
                            <th>{get(APIData.eofficestat, `totalVIPReceiptsPending`, "-") || "-"}</th> 
                           </tr>
                         }
    
                    </tbody>
                    )                
                  }
                 </table> */}
                
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
    
  )(PayslipContainer);