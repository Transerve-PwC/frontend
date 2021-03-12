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
class EofficestatContainer extends Component {

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

          if(pageName ==="INTIGRATION_ESTAT")
          {
            return  ( <div>
              {
                 APIData&&(
                  APIData.map((item,i)=>{
                    return (
                    
                  <div>
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
                 <th   style={{ verticalAlign:"middle", textAlign: "center"}} colSpan="7">
                  <Label
                    className="report-header-row-label"
                    labelStyle={{ wordWrap: "unset", wordBreak: "unset", fontWeight: "bold", }}
                    label="INTIGRATION_EOFFICE_HEADING"
                  />
                  </th>
                 
                 </tr>
  
                 <tr className="report-table-header">
                 <th   style={{ verticalAlign:"middle", textAlign: "center"}} >
                  <Label
                    className="report-header-row-label"
                    labelStyle={{ wordWrap: "unset", wordBreak: "unset", fontWeight: "bold", }}
                    label="INTIGRATION_EOFFICE_OPER_TYPE"
                  />
                  </th>
                  <th   style={{ verticalAlign:"middle", textAlign: "center"}} >
                  <Label
                    className="report-header-row-label"
                    labelStyle={{ wordWrap: "unset", wordBreak: "unset", fontWeight: "bold", }}
                    label="INTIGRATION_ORG_NAME_LABEL"
                  />
                  </th>
                  <th   style={{ verticalAlign:"middle", textAlign: "center"}} >
                  <Label
                    className="report-header-row-label"
                    labelStyle={{ wordWrap: "unset", wordBreak: "unset", fontWeight: "bold", }}
                    label="INTIGRATION_DEPARTMENT_NAME_LABLE"
                  />
                  </th>
                  <th   style={{ verticalAlign:"middle", textAlign: "center"}} >
                  <Label
                    className="report-header-row-label"
                    labelStyle={{ wordWrap: "unset", wordBreak: "unset", fontWeight: "bold", }}
                    label="INTIGRATION_EMPLOYEE_NAME_LABEL"
                  />
                  </th>
                  <th   style={{ verticalAlign:"middle", textAlign: "center"}} >
                  <Label
                    className="report-header-row-label"
                    labelStyle={{ wordWrap: "unset", wordBreak: "unset", fontWeight: "bold", }}
                    label="INTIGRATION_EOFFICE_ELECTRONIC_FILE_TYPE_COUNT"
                  />
                  </th>
                  <th   style={{ verticalAlign:"middle", textAlign: "center"}} >
                  <Label
                    className="report-header-row-label"
                    labelStyle={{ wordWrap: "unset", wordBreak: "unset", fontWeight: "bold", }}
                    label="INTIGRATION_EOFFICE_PHYSICAL_FILE_TYPE_COUNT"
                  />
                  </th>
                  <th   style={{ verticalAlign:"middle", textAlign: "center"}} >
                  <Label
                    className="report-header-row-label"
                    labelStyle={{ wordWrap: "unset", wordBreak: "unset", fontWeight: "bold", }}
                    label="INTIGRATION_TOTAL_FILE_PENDING_CNT"
                  />
                  </th>
                  
                 
                 </tr>
                 
                 </thead>
                 {
                    APIData&&(
                      <tbody>
                         {//FilePending
                            <tr>
                              <th><Label
                      className="report-header-row-label"
                      labelStyle={{ wordWrap: "unset", wordBreak: "unset", fontWeight: "bold", }}
                      label="INTIGRATION_EOFFICE_OPER_TYPE_FILEPENDING_HEADING"
                    /></th>
                            {/* <th>{get(APIData[i].eofficestat, `FilePending.FilesPendingDepartmentName`, "-") || "-"}</th>                                                        */}
                            <th>{get(APIData[i].eofficestat, `FilePending.FilesPendingOrgName`, "-") || "-"}</th>                                          
                            <th style={{ verticalAlign:"middle", textAlign: "center"}}>{get(APIData[i].eofficestat, `FilePending.FilesPendingDepartmentName`, "-") || "-"}</th>
                            <th >{get(APIData[i].eofficestat, `FilePending.FilesPendingEmployeeName`, "-") || "-"}</th>
                            <th style={{ verticalAlign:"middle", textAlign: "right"}}>{get(APIData[i].eofficestat, `FilePending.ElectronicFile`, "-") || "-"}</th>
                            <th style={{ verticalAlign:"middle", textAlign: "right"}}>{get(APIData[i].eofficestat, `FilePending.PhysicalFile`, "-") || "-"}</th>
                            <th style={{ verticalAlign:"middle", textAlign: "right"}}>{get(APIData[i].eofficestat, `FilePending.totalFilesPendingCnt`, "-") || "-"}</th>
                           
                           
                          </tr>
                         }
                          {
                            <tr>
                            <th><Label
                      className="report-header-row-label"
                      labelStyle={{ wordWrap: "unset", wordBreak: "unset", fontWeight: "bold", }}
                      label="INTIGRATION_EOFFICE_OPER_TYPE_FILECLOSED_HEADING"
                    /></th>                            
                             <th>{get(APIData[i].eofficestat, `FileClosed.ReceiptsClosedOrgName`, "-") || "-"}</th>                                          
                            <th style={{ verticalAlign:"middle", textAlign: "center"}}>{get(APIData[i].eofficestat, `FileClosed.ReceiptsClosedDepartmentName`, "-") || "-"}</th>
                            <th>{get(APIData[i].eofficestat, `FileClosed.ReceiptsClosedEmployeeName`, "-") || "-"}</th>
                            <th style={{ verticalAlign:"middle", textAlign: "right"}}>{get(APIData[i].eofficestat, `FileClosed.PhysicalFileReceiptClosed`, "-") || "-"}</th>
                            <th style={{ verticalAlign:"middle", textAlign: "right"}}>{get(APIData[i].eofficestat, `FileClosed.ElectronicFileReceiptClosed`, "-") || "-"}</th>
                            <th style={{ verticalAlign:"middle", textAlign: "right"}}>{get(APIData[i].eofficestat, `FileClosed.totalReceiptsClosed`, "-") || "-"}</th>                                          
                             
                             
                            </tr>
                           }
                            {
                            <tr>
                            <th><Label
                      className="report-header-row-label"
                      labelStyle={{ wordWrap: "unset", wordBreak: "unset", fontWeight: "bold", }}
                      label="INTIGRATION_EOFFICE_OPER_TYPE_RECEIPT_PENDING_HEADING"
                    /></th>                            
                            <th>{get(APIData[i].eofficestat, `ReceiptPending.ReceiptsPendingOrgName`, "-") || "-"}</th>                                          
                            <th style={{ verticalAlign:"middle", textAlign: "center"}}>{get(APIData[i].eofficestat, `ReceiptPending.ReceiptsPendingDepartmentName`, "-") || "-"}</th>
                            <th>{get(APIData[i].eofficestat, `ReceiptPending.ReceiptsPendingEmployeeName`, "-") || "-"}</th>
                            <th style={{ verticalAlign:"middle", textAlign: "right"}}>{get(APIData[i].eofficestat, `ReceiptPending.ElectronicReceipt`, "-") || "-"}</th>
                            <th style={{ verticalAlign:"middle", textAlign: "right"}}>{get(APIData[i].eofficestat, `ReceiptPending.PhysicalReceipt`, "-") || "-"}</th>
                            <th style={{ verticalAlign:"middle", textAlign: "right"}}>{get(APIData[i].eofficestat, `ReceiptPending.totalReceiptsPending`, "-") || "-"}</th>                                          
                             
                             
                            </tr>
                           }
                         {
                            <tr>
                            <th><Label
                      className="report-header-row-label"
                      labelStyle={{ wordWrap: "unset", wordBreak: "unset", fontWeight: "bold", }}
                      label="INTIGRATION_EOFFICE_OPER_TYPE_RECEIPT_CLOSED_HEADING"
                    /></th>                            
                            <th>{get(APIData[i].eofficestat, `ReceiptClosed.ReceiptsClosedOrgName`, "-") || "-"}</th>                                          
                            <th style={{ verticalAlign:"middle", textAlign: "center"}}>{get(APIData[i].eofficestat, `ReceiptClosed.ReceiptsClosedDepartmentName`, "-") || "-"}</th>
                            <th>{get(APIData[i].eofficestat, `ReceiptClosed.ReceiptsClosedEmployeeName`, "-") || "-"}</th>
                            <th style={{ verticalAlign:"middle", textAlign: "right"}}>{get(APIData[i].eofficestat, `ReceiptClosed.PhysicalFileReceiptClosed`, "-") || "-"}</th>
                            <th style={{ verticalAlign:"middle", textAlign: "right"}}>{get(APIData[i].eofficestat, `ReceiptClosed.ElectronicFileReceiptClosed`, "-") || "-"}</th>
                            <th style={{ verticalAlign:"middle", textAlign: "right"}}>{get(APIData[i].eofficestat, `ReceiptClosed.totalReceiptsClosed`, "-") || "-"}</th>                                          
                             
                             
                            </tr>
                           }
                           {//FileClosed
                             <tr>
                             <th >
                              <Label
                                className="report-header-row-label"
                                labelStyle={{ wordWrap: "unset", wordBreak: "unset", fontWeight: "bold", }}
                                label="INTIGRATION_EOFFICE_OPER_TYPE_VIP_RECEIPT_PENDING_HEADING"
                              />
                              </th>  
                              <th>{get(APIData[i].eofficestat, `VIPReceiptsPending.VIPReceiptsPendingOrgName`, "-") || "-"}</th>                                          
                            <th style={{ verticalAlign:"middle", textAlign: "center"}}>{get(APIData[i].eofficestat, `VIPReceiptsPending.VIPReceiptsPendingDepartmentName`, "-") || "-"}</th>
                            <th>{get(APIData[i].eofficestat, `VIPReceiptsPending.VIPReceiptsPendingEmployeeName`, "-") || "-"}</th>
                            <th style={{ verticalAlign:"middle", textAlign: "right"}}>{get(APIData[i].eofficestat, `VIPReceiptsPending.NumberOfElectronicVipreceipt`, "-") || "-"}</th>
                            <th style={{ verticalAlign:"middle", textAlign: "right"}}>{get(APIData[i].eofficestat, `VIPReceiptsPending.NumberOfPhysicalVipreceipt`, "-") || "-"}</th>
                            <th style={{ verticalAlign:"middle", textAlign: "right"}}>{get(APIData[i].eofficestat, `VIPReceiptsPending.totalVIPReceiptsPending`, "-") || "-"}</th>                            
                             
                             </tr>
                           }                         
                         {/* {                          
                           
                           <tr>
                             <th><Label
                    className="report-header-row-label"
                    labelStyle={{ wordWrap: "unset", wordBreak: "unset", fontWeight: "bold", }}
                    label="INTIGRATION_DEPARTMENT_NAME_LABLE"
                  /></th>                            
                            <th>{get(APIData[i].eofficestat, `FileClosed.FilesClosedDepartmentName`, "-") || "-"}</th> 
                           </tr>
                         }
                         {   <tr>
                             <th><Label
                    className="report-header-row-label"
                    labelStyle={{ wordWrap: "unset", wordBreak: "unset", fontWeight: "bold", }}
                    label="INTIGRATION_EMPLOYEE_NAME_LABEL"
                  /></th>                            
                            <th>{get(APIData[i].eofficestat, `FileClosed.FilesClosedEmployeeName`, "-") || "-"}</th> 
                           </tr>
                         }
                         {   <tr>
                             <th><Label
                    className="report-header-row-label"
                    labelStyle={{ wordWrap: "unset", wordBreak: "unset", fontWeight: "bold", }}
                    label="INTIGRATION_ORG_NAME_LABEL"
                  /></th>                            
                            <th>{get(APIData[i].eofficestat, `FileClosed.FilesClosedOrgName`, "-") || "-"}</th> 
                           </tr>
                         }
                         {   <tr>
                             <th><Label
                    className="report-header-row-label"
                    labelStyle={{ wordWrap: "unset", wordBreak: "unset", fontWeight: "bold", }}
                    label="INTIGRATION_TOTAL_FILE_CLOSED_CNT"
                  /></th>                            
                            <th>{get(APIData[i].eofficestat, `FileClosed.totalFilesClosed`, "-") || "-"}</th> 
                           </tr>
                         }
                         {//ReceiptPending
                             <tr className="report-table-header">
                             <th   style={{ verticalAlign:"middle", textAlign: "center"}} colSpan="2">
                              <Label
                                className="report-header-row-label"
                                labelStyle={{ wordWrap: "unset", wordBreak: "unset", fontWeight: "bold", }}
                                label="INTIGRATION_EOFFICE_OPER_TYPE_RECEIPT_PENDING_HEADING"
                              />
                              </th>                              
                             
                             </tr>
                           }  
                         {
                           <tr>
                             <th><Label
                    className="report-header-row-label"
                    labelStyle={{ wordWrap: "unset", wordBreak: "unset", fontWeight: "bold", }}
                    label="INTIGRATION_DEPARTMENT_NAME_LABLE"
                  /></th>                            
                            <th>{get(APIData[i].eofficestat, `ReceiptPending.ReceiptsPendingDepartmentName`, "-") || "-"}</th> 
                           </tr>
                         }
                         {
                           <tr>
                             <th><Label
                    className="report-header-row-label"
                    labelStyle={{ wordWrap: "unset", wordBreak: "unset", fontWeight: "bold", }}
                    label="INTIGRATION_EMPLOYEE_NAME_LABEL"
                  /></th>                            
                            <th>{get(APIData[i].eofficestat, `ReceiptPending.ReceiptsPendingEmployeeName`, "-") || "-"}</th> 
                           </tr>
                         }
                         {
                           <tr>
                             <th><Label
                    className="report-header-row-label"
                    labelStyle={{ wordWrap: "unset", wordBreak: "unset", fontWeight: "bold", }}
                    label="INTIGRATION_ORG_NAME_LABEL"
                  /></th>                            
                            <th>{get(APIData[i].eofficestat, `ReceiptPending.ReceiptsPendingOrgName`, "-") || "-"}</th> 
                           </tr>
                         }
                         
                          {
                           <tr>
                             <th><Label
                    className="report-header-row-label"
                    labelStyle={{ wordWrap: "unset", wordBreak: "unset", fontWeight: "bold", }}
                    label="INTIGRATION_TOTAL_RECEIPT_PENDING_CNT"
                  /></th>                            
                            <th>{get(APIData[i].eofficestat, `ReceiptPending.totalReceiptsPending`, "-") || "-"}</th> 
                           </tr>
                         }
                          {//ReceiptClosed
                             <tr className="report-table-header">
                             <th   style={{ verticalAlign:"middle", textAlign: "center"}} colSpan="2">
                              <Label
                                className="report-header-row-label"
                                labelStyle={{ wordWrap: "unset", wordBreak: "unset", fontWeight: "bold", }}
                                label="INTIGRATION_EOFFICE_OPER_TYPE_RECEIPT_CLOSED_HEADING"
                              />
                              </th>                              
                             
                             </tr>
                           }  
                          {
                           <tr>
                             <th><Label
                    className="report-header-row-label"
                    labelStyle={{ wordWrap: "unset", wordBreak: "unset", fontWeight: "bold", }}
                    label="INTIGRATION_DEPARTMENT_NAME_LABLE"
                  /></th>                            
                            <th>{get(APIData[i].eofficestat, `ReceiptClosed.ReceiptsClosedDepartmentName`, "-") || "-"}</th> 
                           </tr>
                         }
                          {
                           <tr>
                             <th><Label
                    className="report-header-row-label"
                    labelStyle={{ wordWrap: "unset", wordBreak: "unset", fontWeight: "bold", }}
                    label="INTIGRATION_EMPLOYEE_NAME_LABEL"
                  /></th>                            
                            <th>{get(APIData[i].eofficestat, `ReceiptClosed.ReceiptsClosedEmployeeName`, "-") || "-"}</th> 
                           </tr>
                         }
                          {
                           <tr>
                             <th><Label
                    className="report-header-row-label"
                    labelStyle={{ wordWrap: "unset", wordBreak: "unset", fontWeight: "bold", }}
                    label="INTIGRATION_ORG_NAME_LABEL"
                  /></th>                            
                            <th>{get(APIData[i].eofficestat, `ReceiptClosed.ReceiptsClosedOrgName`, "-") || "-"}</th> 
                           </tr>
                         }
                          {
                           <tr>
                             <th><Label
                    className="report-header-row-label"
                    labelStyle={{ wordWrap: "unset", wordBreak: "unset", fontWeight: "bold", }}
                    label="INTIGRATION_TOTAL_RECEIPT_CLOSED_CNT"
                  /></th>                            
                            <th>{get(APIData[i].eofficestat, `ReceiptClosed.totalReceiptsClosed`, "-") || "-"}</th> 
                           </tr>
                         }
                         {//VIPReceiptsPending
                             <tr className="report-table-header">
                             <th   style={{ verticalAlign:"middle", textAlign: "center"}} colSpan="2">
                              <Label
                                className="report-header-row-label"
                                labelStyle={{ wordWrap: "unset", wordBreak: "unset", fontWeight: "bold", }}
                                label="INTIGRATION_EOFFICE_OPER_TYPE_VIP_RECEIPT_PENDING_HEADING"
                              />
                              </th>                              
                             
                             </tr>
                           }  
                         {
                           <tr>
                             <th><Label
                    className="report-header-row-label"
                    labelStyle={{ wordWrap: "unset", wordBreak: "unset", fontWeight: "bold", }}
                    label="INTIGRATION_DEPARTMENT_NAME_LABLE"
                  /></th>                            
                            <th>{get(APIData[i].eofficestat, `VIPReceiptsPending.VIPReceiptsPendingDepartmentName`, "-") || "-"}</th> 
                           </tr>
                         }
                         {
                           <tr>
                             <th><Label
                    className="report-header-row-label"
                    labelStyle={{ wordWrap: "unset", wordBreak: "unset", fontWeight: "bold", }}
                    label="INTIGRATION_EMPLOYEE_NAME_LABEL"
                  /></th>                            
                            <th>{get(APIData[i].eofficestat, `VIPReceiptsPending.VIPReceiptsPendingEmployeeName`, "-") || "-"}</th> 
                           </tr>
                         }
                         {
                           <tr>
                             <th><Label
                    className="report-header-row-label"
                    labelStyle={{ wordWrap: "unset", wordBreak: "unset", fontWeight: "bold", }}
                    label="INTIGRATION_ORG_NAME_LABEL"
                  /></th>                            
                            <th>{get(APIData[i].eofficestat, `VIPReceiptsPending.VIPReceiptsPendingOrgName`, "-") || "-"}</th> 
                           </tr>
                         }
                          {
                           <tr>
                             <th><Label
                    className="report-header-row-label"
                    labelStyle={{ wordWrap: "unset", wordBreak: "unset", fontWeight: "bold", }}
                    label="INTIGRATION_TOTAL_VIP_RECEIPT_PENDING_CNT"
                  /></th>                            
                            <th>{get(APIData[i].eofficestat, `VIPReceiptsPending.totalVIPReceiptsPending`, "-") || "-"}</th> 
                           </tr>
                         } */}
    
                    </tbody>
                    )                
                  }
                 </table>
                
                  </div>
                    }
                  </div>
                  )
                 
               
                }))
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
    
  )(EofficestatContainer);