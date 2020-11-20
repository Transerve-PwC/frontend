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
class InventoryContainer extends Component {

  state = {
    open: false,
    action: ""
  };

  onPayClick=async()=>{  
    const { prepareFinalObject, toggleSnackbar, state,ProcessInstances } = this.props;

    //window.location.href = `http://sampark.chd.nic.in/Epayment/Services/PAID/PropertyTax/PropertyTaxbyPID.aspx`,`_blank`;
    window.open(`http://sampark.chd.nic.in/Epayment/Services/PAID/PropertyTax/PropertyTaxbyPID.aspx`,`_blank`);
  
    }
    componentDidMount = async () => {
      const { prepareFinalObject, toggleSnackbar } = this.props;
      
    };
    render() {
        const {  ProcessInstances,
          state,
          APIData, 
          pageName,        
          moduleName } = this.props;

          if(pageName ==="INTIGRATION_PT")
          {
            return  ( <div>
              {
                 APIData&&(
                  APIData.length>0?(              
                  <div>               
                
               <table 
                style={{
                  width: "100%",
                }}>

<tr><td  style={{
                  textAlign: "left",
                  width:"15%"
                }}><Label labelClassName="" style={{
                  fontWeight: "bold",
                  
                }} label="INTIGRATION_TH_PT_HOUSE" /></td>
                {/* <td><Label labelClassName="" label={APIData[0].PropertyDetail[0].HOUSENO}/></td> */}
                <td><Label labelClassName="" label={APIData[0].PropertyTaxCalculation[0].HouseNo}/></td>
               
                {/* <td  style={{
                  textAlign: "right",
                  width:"15%"
                }}><Label labelClassName="" style={{
                  fontWeight: "bold",
                  
                }} label="PT_CODE" /></td>
                <td><Label labelClassName="" label={APIData[0].PropertyTaxCalculation[0].PropertyId}/></td> */}
                </tr> 
                <tr><td  style={{
                  textAlign: "left",
                  width:"15%"
                }}><Label labelClassName="" style={{
                  fontWeight: "bold",
                  
                }} label="INTIGRATION_DF_SECTOR_NAME" /></td>
                <td><Label labelClassName="" label={APIData[0].PropertyDetail[0].SECTORNAME}/></td>
                <td  style={{
                  textAlign: "right",
                  width:"15%"
                }}><Label labelClassName="" style={{
                  fontWeight: "bold",
                  
                }} label="INTIGRATION_DF_PROPERTY_TYPE" /></td>
                <td style={{
                  textAlign: "right",                 
                }}><Label labelClassName="" label={APIData[0].PropertyDetail[0].PROPERTYTYPE}/></td>
                </tr> 
               <tr><td  style={{
                  textAlign: "left",
                  width:"15%"
                }}><Label labelClassName="" style={{
                  fontWeight: "bold",
                  
                }} label="PT_CODE" /></td>
                <td><Label labelClassName="" label={APIData[0].PropertyTaxCalculation[0].PropertyId}/></td>
                {/* <td  style={{
                  textAlign: "right",
                  width:"15%"
                }}><Label labelClassName="" style={{
                  fontWeight: "bold",
                  textAlign: "center", 
                  width:"40%"               
                }} label="INTIGRATION_PAYABLE_AMOUNT" /></td>
                <td><Label labelClassName="" label={APIData[0].PayableAmount}/></td> */}
                </tr>  
                <tr><td  style={{
                  textAlign: "left",
                  width:"15%"
                }}><Label labelClassName="" style={{
                  fontWeight: "bold",
                  
                }} label="INTIGRATION_PAYABLE_AMOUNT" /></td>
                <td><Label labelClassName="" label={APIData[0].PayableAmount}/></td>
                <td style={{
                  width: "35%",
                 
                }}>

                </td>
                <td style={{
                  textAlign: "right",
                 
                }}> 
    
                <Button  color="primary" onClick={() => this.onPayClick()}  target="_blank" style={{ alignItems: "right"}}>
                                         <LabelContainer
                                                 labelName="Pay"
                                                 labelKey="INTIGRATION_PAY"
                                                 color="#FE7A51"/> </Button>
                </td>
                </tr>            
                     
              </table>
              </div>
                ):
                (
                  <div>

                  </div>
                 
                )
                 )
              }         
             {
               // APIData&&APIData[0]( 
               <div style={{ overscrollBehaviorX:"overlay",overflow:"overlay"}}>
                 
<table  id="reportTable"
                 style={{
                   width: "100%",
                   marginBottom:"20px"
                 }}
                 className="table table-striped table-bordered">
                   {/* <thead>
                   <tr><td  style={{
                  textAlign: "left",
                  width:"15%"
                }}colSpan="2"><Label labelClassName="" style={{
                  fontWeight: "bold",
                  
                }} label="INTIGRATION_TH_BASIC_DETAILS" /></td>
                </tr> 
                   </thead> */}
                 <thead>
                 <tr className="report-table-header">
                 <th   style={{ verticalAlign:"middle", textAlign: "center"}} rowspan="1">
                  <Label
                    className="report-header-row-label"
                    labelStyle={{ wordWrap: "unset", wordBreak: "unset", fontWeight: "bold", }}
                    label="INTIGRATION_DEPOSITER_NAME"
                  />
                  </th>
                  <th  style={{ verticalAlign:"middle", textAlign: "center"}} colSpan="1">
                  <Label
                    className="report-header-row-label"
                    labelStyle={{ wordWrap: "unset", wordBreak: "unset", fontWeight: "bold", }}
                    label="INTIGRATION_FATER_HUSBAND_NAME"
                  />
                  </th>
                  <th  style={{ verticalAlign:"middle", textAlign: "center"}} colSpan="1">
                  <Label
                    className="report-header-row-label"
                    labelStyle={{ wordWrap: "unset", wordBreak: "unset", fontWeight: "bold", }}
                    label="INTIGRATION_PLOT_COVERED"
                  />
                  </th>
                  <th  style={{ verticalAlign:"middle", textAlign: "center"}} colSpan="1">
                  <Label
                    className="report-header-row-label"
                    labelStyle={{ wordWrap: "unset", wordBreak: "unset", fontWeight: "bold", }}
                    label="INTIGRATION_PLOT_AREA_UNCOVERED"
                  />
                  </th>
                  <th  style={{ verticalAlign:"middle", textAlign: "center"}} colSpan="1">
                  <Label
                    className="report-header-row-label"
                    labelStyle={{ wordWrap: "unset", wordBreak: "unset", fontWeight: "bold", }}
                    label="INTIGRATION_AREA_COVERED"
                  />
                  </th>
                  <th  style={{ verticalAlign:"middle", textAlign: "center"}} colSpan="1">
                  <Label
                    className="report-header-row-label"
                    labelStyle={{ wordWrap: "unset", wordBreak: "unset", fontWeight: "bold", }}
                    label="INTIGRATION_FIRST_FLOOR"
                  />
                  </th>  
                  <th  style={{ verticalAlign:"middle", textAlign: "center"}} colSpan="1">
                  <Label
                    className="report-header-row-label"
                    labelStyle={{ wordWrap: "unset", wordBreak: "unset", fontWeight: "bold", }}
                    label="INTIGRATION_SECOND_FLOOR"
                  />
                  </th>  
                  <th  style={{ verticalAlign:"middle", textAlign: "center"}} colSpan="1">
                  <Label
                    className="report-header-row-label"
                    labelStyle={{ wordWrap: "unset", wordBreak: "unset", fontWeight: "bold", }}
                    label="INTIGRATION_BASEMENT"
                  />
                  </th>                  
                 </tr>
                
                 {
                   APIData&&(
                     <tr>
                       {
                          APIData.length==0?(                     
                            
                              <th  style={{ verticalAlign:"middle", textAlign: "center"}}colSpan="9" ><Label labelClassName="" label="COMMON_INBOX_NO_DATA" /></th>
                           
                           
                          ):(
                            <div  style={{ display:"none"}}></div>
                          )
                       }
                     </tr>
                   )
                 }
                 </thead>
                 {
                    APIData&&(
                      <tbody>
                         {
                           APIData.length==0?(
                            
                             <tr  style={{ display:"none"}}>
                               <th  style={{ verticalAlign:"middle", textAlign: "center"}} colSpan="2"><Label labelClassName="" label="COMMON_INBOX_NO_DATA" /></th>
                             </tr>
                            
                           ):(
                            <tr>
                            {/* <th>{item.srNo}</th> */}
                            
                            <th>{get(APIData[0].PropertyDetail[0], `Depositer Name`, "-") || "-"}</th>
                            <th>{get(APIData[0].PropertyDetail[0], `FatherName`, "-") || "-"}</th>
                            <th>{get(APIData[0].PropertyDetail[0], `ACTUALAREA`, "-") || "-"}</th>
                            <th>{get(APIData[0].PropertyDetail[0], "Plot Area", "-") || "-"}</th>
                            <th>{get(APIData[0].PropertyDetail[0], "Area Covered on Ground Floor", "-") || "-"}</th>
                            <th>{get(APIData[0].PropertyDetail[0], "1st Floor", "-") || "-"}</th>
                            <th>{get(APIData[0].PropertyDetail[0], "2nd Floor1", "-") || "-"}</th>
                            <th>{get(APIData[0].PropertyDetail[0], "Basement", "-") || "-"}</th>
                            {/* <th>{item.totalAmount}</th>
                            <th>{item.remarks}</th> */}
                           
                          </tr>
                            // APIData[0].PropertyTaxCalculation.map((item,i)=>{
                            //   return(
                            //     <tr>
                            //       {/* <th>{item.srNo}</th> */}
                            //       <th>{item.Session}</th>
                            //       <th>{item.AmountDue}</th>
                            //       <th>{item.Discount}</th>
                            //       <th>{item.DepositAmount}</th>
                            //       <th>{item.AmtOfInt}</th>
                            //       <th>{item.BalanceAmount}</th>
                            //       {/* <th>{item.totalAmount}</th>
                            //       <th>{item.remarks}</th> */}
                                 
                            //     </tr>
                            //   )
                            
                            // })
                           )
                          
                         }
    
                    </tbody>
                    )                
                  }
                 </table>
                 <br>
                 {/* Payment Detail */}
                 </br>
                  <table  id="reportTable"
                 style={{
                   width: "100%",
                   marginBottom:"20px"
                 }}
                 className="table table-striped table-bordered">
                   {/* <thead>
                   <tr><td  style={{
                  textAlign: "left",
                  width:"15%"
                }}colSpan="2"><Label labelClassName="" style={{
                  fontWeight: "bold",
                  
                }} label="INTIGRATION_TH_PROPERTY_DETAILS" /></td>
                </tr> 
                   </thead> */}
                 <thead>
                 <tr className="report-table-header">
                 <th   style={{ verticalAlign:"middle", textAlign: "center"}} rowspan="1">
                  <Label
                    className="report-header-row-label"
                    labelStyle={{ wordWrap: "unset", wordBreak: "unset", fontWeight: "bold", }}
                    label="INTIGRATION_FINANCIAL_YEAR"
                  />
                  </th>
                  <th  style={{ verticalAlign:"middle", textAlign: "center"}} colSpan="1">
                  <Label
                    className="report-header-row-label"
                    labelStyle={{ wordWrap: "unset", wordBreak: "unset", fontWeight: "bold", }}
                    label="INTIGRATION_DUE_AMOUNT"
                  />
                  </th>
                  <th  style={{ verticalAlign:"middle", textAlign: "center"}} colSpan="1">
                  <Label
                    className="report-header-row-label"
                    labelStyle={{ wordWrap: "unset", wordBreak: "unset", fontWeight: "bold", }}
                    label="INTIGRATION_DISCOUNT"
                  />
                  </th>
                  <th  style={{ verticalAlign:"middle", textAlign: "center"}} colSpan="1">
                  <Label
                    className="report-header-row-label"
                    labelStyle={{ wordWrap: "unset", wordBreak: "unset", fontWeight: "bold", }}
                    label="INTIGRATION_DEPOSIT_AMOUNT"
                  />
                  </th>
                  <th  style={{ verticalAlign:"middle", textAlign: "center"}} colSpan="1">
                  <Label
                    className="report-header-row-label"
                    labelStyle={{ wordWrap: "unset", wordBreak: "unset", fontWeight: "bold", }}
                    label="INTIGRATION_AMOUNT_OF_INTEREST"
                  />
                  </th>
                  <th  style={{ verticalAlign:"middle", textAlign: "center"}} colSpan="1">
                  <Label
                    className="report-header-row-label"
                    labelStyle={{ wordWrap: "unset", wordBreak: "unset", fontWeight: "bold", }}
                    label="INTIGRATION_BALANCE_AMOUNT"
                  />
                  </th>                  
                 </tr>
                
                 {
                   APIData&&(
                     <tr>
                       {
                          APIData.length==0?(                     
                            
                              <th  style={{ verticalAlign:"middle", textAlign: "center"}}colSpan="9" ><Label labelClassName="" label="COMMON_INBOX_NO_DATA" /></th>
                           
                           
                          ):(
                            <div  style={{ display:"none"}}></div>
                          )
                       }
                     </tr>
                   )
                 }
                 </thead>
                 {
                    APIData&&(
                      <tbody>
                         {
                           APIData.length==0?(
                            
                             <tr  style={{ display:"none"}}>
                               <th  style={{ verticalAlign:"middle", textAlign: "center"}} colSpan="2"><Label labelClassName="" label="COMMON_INBOX_NO_DATA" /></th>
                             </tr>
                            
                           ):(

                            APIData[0].PropertyTaxCalculation.map((item,i)=>{
                              return(
                                <tr>
                                  {/* <th>{item.srNo}</th> */}
                                  <th>{item.Session}</th>
                                  <th>{item.AmountDue}</th>
                                  <th>{item.Discount}</th>
                                  <th>{item.DepositAmount}</th>
                                  <th>{item.AmtOfInt}</th>
                                  <th>{item.BalanceAmount}</th>
                                  {/* <th>{item.totalAmount}</th>
                                  <th>{item.remarks}</th> */}
                                 
                                </tr>
                              )
                            
                            })
                           )
                          
                         }
    
                    </tbody>
                    )                
                  }
                 </table>
                 </div>
               //)
            }
               
               </div>);

          }
          else if(pageName ==="INTIGRATION_NODAL")
          {
            return  ( <div>
                    
             {
              //  APIData&&APIData[0]&&( 
               <div style={{ overscrollBehaviorX:"overlay",overflow:"overlay"}}>
                 
                  <table  id="reportTable"
                 style={{
                   width: "100%",
                   marginBottom:"20px"
                 }}
                 className="table table-striped table-bordered">
                 <thead>
                 <tr className="report-table-header">
                 <th   style={{ verticalAlign:"middle", textAlign: "center"}} rowspan="2">
                  <Label
                    className="report-header-row-label"
                    labelStyle={{ wordWrap: "unset", wordBreak: "unset", fontWeight: "bold", }}
                    label="INTIGRATION_MINISTRY_NAME"
                  />
                  </th>
                  <th  style={{ verticalAlign:"middle", textAlign: "center"}} colSpan="2">
                  <Label
                    className="report-header-row-label"
                    labelStyle={{ wordWrap: "unset", wordBreak: "unset", fontWeight: "bold", }}
                    label="INTIGRATION_APPELLATE_AUTHORITY"
                  />
                  </th>
                 
                  <th  style={{ verticalAlign:"middle", textAlign: "center"}} colSpan="2">
                  <Label
                    className="report-header-row-label"
                    labelStyle={{ wordWrap: "unset", wordBreak: "unset", fontWeight: "bold", }}
                    label="INTIGRATION_NODAL_OFFICER"
                  />
                  </th>             
                  <th  style={{ verticalAlign:"middle", textAlign: "center"}} colSpan="2">
                  <Label
                    className="report-header-row-label"
                    labelStyle={{ wordWrap: "unset", wordBreak: "unset", fontWeight: "bold", }}
                    label="INTIGRATION_CPIO"
                  />
                  </th>             
                           
                 </tr>
                 <tr>
                
                  <th  style={{ verticalAlign:"middle", textAlign: "center",columnSpan:"1"}}>
                  <Label
                    className="report-header-row-label"
                    labelStyle={{ wordWrap: "unset", wordBreak: "unset", fontWeight: "bold", }}
                    label="INTIGRATION_TOTAL_REQUEST_RECEIVED"
                  />
                 </th>
                 <th  style={{ verticalAlign:"middle", textAlign: "center",columnSpan:"1"}}>
                 <Label
                    className="report-header-row-label"
                    labelStyle={{ wordWrap: "unset", wordBreak: "unset", fontWeight: "bold", }}
                    label="INTIGRATION_TOTAL_REQUEST_PENDING"
                  />
                 </th>
                 <th  style={{ verticalAlign:"middle", textAlign: "center",columnSpan:"1"}}>
                 <Label
                    className="report-header-row-label"
                    labelStyle={{ wordWrap: "unset", wordBreak: "unset", fontWeight: "bold", }}
                    label="INTIGRATION_TOTAL_REQUEST_RECEIVED"
                  />
                 </th>
                 <th  style={{ verticalAlign:"middle", textAlign: "center",columnSpan:"1"}}>
                 <Label
                    className="report-header-row-label"
                    labelStyle={{ wordWrap: "unset", wordBreak: "unset", fontWeight: "bold", }}
                    label="INTIGRATION_TOTAL_REQUEST_PENDING"
                  />
                 </th>
                 <th  style={{ verticalAlign:"middle", textAlign: "center",columnSpan:"1"}}>
                 <Label
                    className="report-header-row-label"
                    labelStyle={{ wordWrap: "unset", wordBreak: "unset", fontWeight: "bold", }}
                    label="INTIGRATION_TOTAL_REQUEST_RECEIVED"
                  />
                 </th>
                 <th  style={{ verticalAlign:"middle", textAlign: "center",columnSpan:"1"}}>
                 <Label
                    className="report-header-row-label"
                    labelStyle={{ wordWrap: "unset", wordBreak: "unset", fontWeight: "bold", }}
                    label="INTIGRATION_TOTAL_REQUEST_PENDING"
                  />
                 </th>
                 
                 </tr>
                 {
                   APIData&&(
                     <tr>
                       {
                          APIData.length==0?(                      
                            
                              <th  style={{ verticalAlign:"middle", textAlign: "center"}}colSpan="21" ><Label labelClassName="" label="COMMON_INBOX_NO_DATA" /></th>
                           
                           
                          ):(
                            <div  style={{ display:"none"}}></div>
                          )
                       }
                     </tr>
                   )
                 }
                 </thead>
                 {
                    APIData&&(
                      <tbody>
                         {
                           APIData.length==0?(
                            
                             <tr  style={{ display:"none"}}>
                               <th  style={{ verticalAlign:"middle", textAlign: "center",columnSpan:"21"}} ><Label labelClassName="" label="COMMON_INBOX_NO_DATA" /></th>
                             </tr>
                            
                           ):(
                            //  <tr> pritam data</tr>
                          
                           <tr>
                             <th>
                               {
                                  APIData.appellate.records.map((item,i)=>{
                                    return(
                                      <tr>
                                        {/* <th>{item.srNo}</th> */}
                                        <th>{item.minDeptDesc}</th>
                                        <th>{item.totalRequestReceived}</th>
                                        <th>{item.totalRequestPending}</th>
                                        {/* <th>{item.receiptDate}</th>
                                        <th>{item.receiptNo}</th>
                                        <th>{item.receiptDepartment}</th> */}
                                       
                                      </tr>
                                    )                            
                                  })
                               }
                             </th>
                             {/* <th>
                               {
                                  APIData.appellate.records.map((item,i)=>{
                                    return(
                                      <tr>
                                       
                                        <th>{item.totalRequestReceived}</th>
                                        <th>{item.totalRequestPending}</th>
                                      </tr>
                                    )                            
                                  })
                               }
                             </th>
                             <th>
                               {
                                  APIData.appellate.records.map((item,i)=>{
                                    return(
                                      <tr>                                        
                                        <th>{item.totalRequestReceived}</th>
                                        <th>{item.totalRequestPending}</th> 
                                      </tr>
                                    )                            
                                  })
                               }
                             </th> */}
                           </tr>
                           )
                          
                         }
    
                    </tbody>
                    )                
                  }
                 </table>
                 </div>
               //)
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
    
  )(InventoryContainer);