import React, { Component } from "react";
import { Card, Image, Icon, Button } from "components";
import Label from "egov-ui-kit/utils/translationNode";
import isEmpty from "lodash/isEmpty";
import "./index.css";
import EditIcon from '@material-ui/icons/Edit';

class PayDetails extends Component {
  
  

render() {
const {amount, cGST, utGST, location,facilationChargesSuccess,result, firstStep,fc,
  BK_FEE_HEAD_PACC,LUXURY_TAX,REFUNDABLE_SECURITY,PACC_TAX,totalAmountSuPage,one,two,three,four,five,six,
  PACPACC_ROUND_OFFC_TAX,FACILITATION_CHARGE} = this.props

// let num = 100.000;
// let convNumAmount =  Number(amount)
// let conNumcGST =  Number(cGST)
// let conNumutGST =  Number(utGST)
// let conNumfc =  Number(fc)
//convert into new number 

// let convNumAmount =  Number(BK_FEE_HEAD_PACC)
// let conNumcGST =  Number(PACC_TAX)
// let conNumutGST =  Number(utGST)
// let conNumfc =  Number(fc)


// let finalAmountOne = convNumAmount + conNumcGST + conNumutGST + conNumfc;

// let finalAmountwo = Number(finalAmountOne)
// let finalAmounfive = (Math.round(finalAmountOne * 100) / 100).toFixed(2);


// let TotalAmountSp = parseInt(amount) + parseInt(cGST) + parseInt(utGST) + parseInt(fc);

// let Ramount =  (Math.round(amount * 100) / 100).toFixed(2);

// let RcGST = (Math.round(cGST * 100) / 100).toFixed(2);

// let RutGST = (Math.round(utGST * 100) / 100).toFixed(2);

// let Rnum = (Math.round(fc * 100) / 100).toFixed(2);


// let ONE =  (Math.round(BK_FEE_HEAD_PACC * 100) / 100).toFixed(2);

// let TWO = (Math.round(PACC_TAX * 100) / 100).toFixed(2);

// let THREE = (Math.round(PACPACC_ROUND_OFFC_TAX * 100) / 100).toFixed(2);

// let FOUR = (Math.round(FACILITATION_CHARGE * 100) / 100).toFixed(2);

// let FIVE = (Math.round(LUXURY_TAX * 100) / 100).toFixed(2);

// let SIX = (Math.round(REFUNDABLE_SECURITY * 100) / 100).toFixed(2);

// let SEVEN = (Math.round(totalAmountSuPage * 100) / 100).toFixed(2);


let ONE =  (Math.round(one * 100) / 100).toFixed(2);

let TWO = (Math.round(two * 100) / 100).toFixed(2);

let THREE = (Math.round(three * 100) / 100).toFixed(2);

let FOUR = (Math.round(four * 100) / 100).toFixed(2);

let FIVE = (Math.round(five * 100) / 100).toFixed(2);

let SIX = (Math.round(six * 100) / 100).toFixed(2);

let SEVEN = (Math.round(totalAmountSuPage * 100) / 100).toFixed(2);


// let RoundAmount = (Math.round(TotalAmountSp * 100) / 100).toFixed(2);
    return (
      <div>
        <Card
          textChildren={
            <div>  
                <Label label="BK_MYBK_FEE_ESTIMATE" containerStyle={{ marginLeft: "13px" }} labelClassName="dark-heading" />
                      <button
                        style={{ color: "#FE7A51", border: "none", outline: "none", fontWeight: "650", float: 'right', marginRight: '43px', marginTop: '-16px', background: "white" }}
                        onClick={(e)=>this.props.firstStep(e)}
                        >
                        <EditIcon />
                        <h5 style={{ fontSize: "14px", marginTop: "-27px", marginBottom: "15px", marginLeft: "59px" }}>
                            Edit
                       
              </h5>
                    </button>
                 

              <div className="complaint-detail-detail-section-status row" style={{marginLeft:'-10px',marginTop:30}}>
                <div className="col-sm-4 col-xs-12">
                  <Label className="col-xs-12  col-sm-12 col-md-12 status-color" label="BK_FEE_HEAD_PACC" />
                </div>
                <div className="col-sm-4 col-xs-12"> 
                <h5 style={{ textAlign: "right" }}>{ONE ? ONE : 'NA'}</h5>
                </div>
              </div>

              <div className="complaint-detail-detail-section-status row" style={{marginLeft:'-10px'}}>
                <div className="col-sm-4 col-xs-12">
                  <Label className="col-xs-12  col-sm-12 col-md-12 status-color" label="PACC_TAX" />
                </div>
                <div className="col-sm-4 col-xs-12">
                <h5 style={{ textAlign: "right" }}>{FOUR ? FOUR : 'NA'}</h5>
                </div>
              </div>
             

              <div className="complaint-detail-detail-section-status row" style={{marginLeft:'-10px'}}>
                <div className="col-sm-4 col-xs-12">
                  <Label className="col-xs-12  col-sm-12 col-md-12 status-color" label="PACPACC_ROUND_OFFC_TAX" />
                </div>
                <div className="col-sm-4 col-xs-12">
                <h5 style={{ textAlign: "right" }}>{FIVE ? FIVE : 'NA'}</h5>
              
                </div>
              </div>

              <div className="complaint-detail-detail-section-status row" style={{marginLeft:'-10px'}}>
                <div className="col-sm-4 col-xs-12">
                  <Label className="col-xs-12  col-sm-12 col-md-12 status-color" label="BK_MYBK_FACILITATION_CHARGE" />
                </div>
                <div className="col-sm-4 col-xs-12">
                <h5 style={{ textAlign: "right" }}>{SIX ? SIX : 'NA'}</h5>
              
                </div>
              </div>

              <div className="complaint-detail-detail-section-status row" style={{marginLeft:'-10px'}}>
                <div className="col-sm-4 col-xs-12">
                  <Label className="col-xs-12  col-sm-12 col-md-12 status-color" label="LUXURY_TAX" />
                </div>
                <div className="col-sm-4 col-xs-12">
                <h5 style={{ textAlign: "right" }}>{TWO ? TWO : 'NA'}</h5>
              
                </div>
              </div>

              <div className="complaint-detail-detail-section-status row" style={{marginLeft:'-10px'}}>
                <div className="col-sm-4 col-xs-12">
                  <Label className="col-xs-12  col-sm-12 col-md-12 status-color" label="REFUNDABLE_SECURITY"/>
                </div>
                <div className="col-sm-4 col-xs-12">
                <h5 style={{ textAlign: "right" }}>{THREE ? THREE: "100"}</h5>
               
                </div>
              </div>


              <div className="complaint-detail-detail-section-status row" style={{marginLeft:'-10px'}}>
                <hr class="MuiDividerLine" style={{ marginbottom: "16px" }}></hr>
                <div className="col-sm-4 col-xs-12">
                  <Label className="col-xs-12  col-sm-12 col-md-12 status-color" label="BK_MYBK_TOTAL_AMOUNT" />
                </div>
                <div className="col-sm-4 col-xs-12">
                  <h5 style={{ textAlign: "right" }}>{SEVEN ? SEVEN: "notFound"}</h5>
                </div>
              </div>
            </div>
             } 
          /> 
      </div>
    );
  }
}

export default PayDetails;