import React, { Component } from "react";
import { Card, Image, Icon, Button } from "components";
import Label from "egov-ui-kit/utils/translationNode";
import isEmpty from "lodash/isEmpty";
import "./index.css";
import { httpRequest } from "egov-ui-kit/utils/api";


class PayDetails extends Component {
  diffDates = (fromDate,toDate) => {
    var date1 = new Date(fromDate);
    var date2 = new Date(toDate);
     var Difference_In_Time = date2.getTime() - date1.getTime();
     var Difference_In_Days = (Difference_In_Time / (1000 * 3600 * 24)) + 1;
    return Difference_In_Days
  }
  render() {
    const { bkPaymentDate,paymentDetails,area, fromDate, toDate,perDayRupees, bkPaymentReceiptNumber, bkPaymentStatus } = this.props;

let str = 'Base Charges' + (area)+ 'sqft X' +(this.diffDates(fromDate,toDate))+ 'days(@Rs.' +  (perDayRupees) +'/sqft)'
let str1 = str .substring(0,11) + "\r\n" + str.substring(12,str.length);
const level2 = str1


let first = 'Base Charges'
const second = +(area)+ 'sqft X' +(this.diffDates(fromDate,toDate))+ 'days(@Rs.' +  (perDayRupees) +'/sqft)'

    return (
      <div>
        <Card
          textChildren={
            <div>
              <div className="rainmaker-displayInline row">
                <div className="col-md-4">
                  <Label label="BK_MYBK_FEE_ESTIMATE" containerStyle={{ marginLeft: "13px" }} labelClassName="dark-heading" />
                </div>
                <div style={{right: '50px',position: 'absolute'}}>
                  <h5><Label label="BK_TOTAL_AMOUNT" /></h5>
                  <h3 style={{marginTop: '-8px',fontSize: '28px',color: 'black'}}><b>Rs {paymentDetails ? paymentDetails.totalAmount : 'NA'}</b></h3>
                </div>
              </div>

              <div className="complaint-detail-detail-section-status row" style={{marginLeft:'-10px',marginTop:30}}>
                <div className="col-sm-4 col-xs-12">
                <Label className="col-xs-12  col-sm-12 col-md-12 status-color"                       
                        label={first }
                        />
                        <Label className="col-xs-12  col-sm-12 col-md-12 status-color"    
                        labelStyle={{ fontstyle: "italic" }}                 
                        label={second }
                        />
                </div>
                <div className="col-sm-4 col-xs-12">
                  {/* <h5 style={{ textAlign: "right" }}>{paymentDetails && paymentDetails.billDetails[0] && paymentDetails.billDetails[0].billAccountDetails[1].amount}</h5> */}
                  <h5 style={{ textAlign: "right" }}>{this.props.CommercialParkingCharges}</h5>
                </div>
              </div>

              <div className="complaint-detail-detail-section-status row" style={{marginLeft:'-10px'}}>
                <div className="col-sm-4 col-xs-12">
                  <Label className="col-xs-12  col-sm-12 col-md-12 status-color" label="BK_MYBK_TAX_RENT" />
                </div>
                <div className="col-sm-4 col-xs-12">
                  <h5 style={{ textAlign: "right" }}>{this.props.CommercialTaxes}</h5>
                </div>
              </div>
     
              <div className="complaint-detail-detail-section-status row" style={{marginLeft:'-10px'}}>
                <div className="col-sm-4 col-xs-12">
                  <Label className="col-xs-12  col-sm-12 col-md-12 status-color" label="BK_MYBK_SECURITY_COMMERCIAL_GROUND_BOOKING_BRANCH" />
                </div>
                <div className="col-sm-4 col-xs-12">
                  <h5 style={{ textAlign: "right" }}>{this.props.CommercialSecurityCharges}</h5>
                </div>
              </div>
     
              <div className="complaint-detail-detail-section-status row" style={{marginLeft:'-10px'}}>
                <div className="col-sm-4 col-xs-12">
                  <Label className="col-xs-12  col-sm-12 col-md-12 status-color" label="BK_MYBK_FACILITATION_CHRGS_COMMERCIAL_GROUND_BOOKING_BRANCH" />
                </div>
                <div className="col-sm-4 col-xs-12">
                   <h5 style={{ textAlign: "right" }}>{this.props.CommercialFaciliCharges}</h5>
                </div>
              </div>
      
              <div className="complaint-detail-detail-section-status row" style={{marginLeft:'-10px'}}>
                <div className="col-sm-4 col-xs-12">
                  <Label className="col-xs-12  col-sm-12 col-md-12 status-color" label="BK_MYBK_CLEANING_CHRGS_COMMERCIAL_GROUND_BOOKING_BRANCH" />
                </div>
                <div className="col-sm-4 col-xs-12">
                  <h5 style={{ textAlign: "right" }}>{this.props.CommercialcleaningCharge}</h5>
                </div>
              </div>     
              <div className="complaint-detail-detail-section-status row" style={{marginLeft:'-10px'}}>
                <hr class="MuiDividerLine" style={{ marginbottom: "16px" }}></hr>
                <div className="col-sm-4 col-xs-12">
                  <Label className="col-xs-12  col-sm-12 col-md-12 status-color" label="BK_MYBK_TOTAL_AMOUNT" />
                </div>
                <div className="col-sm-4 col-xs-12">
                  <h5 style={{ textAlign: "right" }}>{paymentDetails ? paymentDetails.totalAmount : 'NA'}</h5>
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