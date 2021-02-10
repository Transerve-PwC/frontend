import React, { Component } from "react";
import { Card, Image, Icon, Button } from "components";
import Label from "egov-ui-kit/utils/translationNode";
import isEmpty from "lodash/isEmpty";
import "./index.css";
import EditIcon from '@material-ui/icons/Edit';

class PayDetails extends Component {
  
  

render() {
const {totalAmountSuPage,cgBaseCharges,chTaxes} = this.props
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
                  <Label className="col-xs-12  col-sm-12 col-md-12 status-color" label="BK_FEE_HEAD_GFCP" />
                </div>
                <div className="col-sm-4 col-xs-12"> 
                <h5 style={{ textAlign: "right" }}>{cgBaseCharges ? cgBaseCharges : 'NA'}</h5>
                </div>
              </div>

              <div className="complaint-detail-detail-section-status row" style={{marginLeft:'-10px'}}>
                <div className="col-sm-4 col-xs-12">
                  <Label className="col-xs-12  col-sm-12 col-md-12 status-color" label="BK_FEE_HEAD_GFCP_TAX" />
                </div>
                <div className="col-sm-4 col-xs-12">
                <h5 style={{ textAlign: "right" }}>{chTaxes ? chTaxes : 'NA'}</h5>
                </div>
              </div>
             

              <div className="complaint-detail-detail-section-status row" style={{marginLeft:'-10px'}}>
                <div className="col-sm-4 col-xs-12">
                  <Label className="col-xs-12  col-sm-12 col-md-12 status-color" label="BK_MY_BK_TOTAL_AMT" />
                </div>
                <div className="col-sm-4 col-xs-12">
                <h5 style={{ textAlign: "right" }}>{totalAmountSuPage ? totalAmountSuPage : 'NA'}</h5>
              
                </div>
              </div>

              {/* <div className="complaint-detail-detail-section-status row" style={{marginLeft:'-10px'}}>
                <div className="col-sm-4 col-xs-12">
                  <Label className="col-xs-12  col-sm-12 col-md-12 status-color" label="BK_MYBK_FACILITATION_CHARGE" />
                </div>
                <div className="col-sm-4 col-xs-12">
                <h5 style={{ textAlign: "right" }}>{SIX ? SIX : 'NA'}</h5>
              
                </div>
              </div> */}

              {/* <div className="complaint-detail-detail-section-status row" style={{marginLeft:'-10px'}}>
                <div className="col-sm-4 col-xs-12">
                  <Label className="col-xs-12  col-sm-12 col-md-12 status-color" label="LUXURY_TAX" />
                </div>
                <div className="col-sm-4 col-xs-12">
                <h5 style={{ textAlign: "right" }}>{TWO ? TWO : 'NA'}</h5>
              
                </div>
              </div> */}

              {/* <div className="complaint-detail-detail-section-status row" style={{marginLeft:'-10px'}}>
                <div className="col-sm-4 col-xs-12">
                  <Label className="col-xs-12  col-sm-12 col-md-12 status-color" label="REFUNDABLE_SECURITY"/>
                </div>
                <div className="col-sm-4 col-xs-12">
                <h5 style={{ textAlign: "right" }}>{THREE ? THREE: "100"}</h5>
               
                </div>
              </div> */}


              {/* <div className="complaint-detail-detail-section-status row" style={{marginLeft:'-10px'}}>
                <hr class="MuiDividerLine" style={{ marginbottom: "16px" }}></hr>
                <div className="col-sm-4 col-xs-12">
                  <Label className="col-xs-12  col-sm-12 col-md-12 status-color" label="BK_MYBK_TOTAL_AMOUNT" />
                </div>
                <div className="col-sm-4 col-xs-12">
                  <h5 style={{ textAlign: "right" }}>{SEVEN ? SEVEN: "notFound"}</h5>
                </div>
              </div> */}
            </div>
             } 
          /> 
      </div>
    );
  }
}

export default PayDetails;