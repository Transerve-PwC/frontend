import React, { Component } from "react";
import { Card, Image, Icon, Button } from "components";
import Label from "egov-ui-kit/utils/translationNode";
import isEmpty from "lodash/isEmpty";
import "./index.css";

// const iconStyle = {
//   marginRight: "13px",
//   height: "24px",
//   width: "24px",
// };

// const imageStyles = {
//   maxHeight: "100px",
//   minHeight: "100px",
// };

// const mapIconStyle = {
//   marginRight: "7px",
//   height: "12px",
//   width: "14px",
//   borderRadius: "50%",
// };

class PayDetails extends Component {
  // navigateToComplaintType = () => {
  //   this.props.history.push("/complaint-type");
  // };
  // getImageSource = (imageSource, size) => {
  //   const images = imageSource.split(",");
  //   if (!images.length) {
  //     return null;
  //   }
  //   switch (size) {
  //     case "small":
  //       imageSource = images[2];
  //       break;
  //     case "medium":
  //       imageSource = images[1];
  //       break;
  //     case "large":
  //     default:
  //       imageSource = images[0];
  //   }
  //   return imageSource || images[0];
  // };
  // onImageClick = (source) => {
  //   window.open(this.getImageSource(source, "large"), 'Image');
  // };

  render() {
    const { bkPaymentDate, paymentDetails, bkPaymentReceiptNumber, bkPaymentStatus,
      PayMentOne,PayMentTwo, 
      one,two,three,four,five,six,
    } = this.props;


let ONE =  (Math.round(one * 100) / 100).toFixed(2);

let TWO = (Math.round(two * 100) / 100).toFixed(2);

let THREE = (Math.round(three * 100) / 100).toFixed(2);

let FOUR = (Math.round(four * 100) / 100).toFixed(2);

let FIVE = (Math.round(five * 100) / 100).toFixed(2);

let SIX = (Math.round(six * 100) / 100).toFixed(2);
 
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
             

              {/* <div className="complaint-detail-detail-section-status row" style={{marginLeft:'-10px'}}>
                <div className="col-sm-4 col-xs-12">
                  <Label className="col-xs-12  col-sm-12 col-md-12 status-color" label="PACPACC_ROUND_OFFC_TAX" />
                </div>
                <div className="col-sm-4 col-xs-12">
                <h5 style={{ textAlign: "right" }}>{FIVE ? FIVE : 'NA'}</h5>
              
                </div>
              </div> */}

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
                  <Label className="col-xs-12  col-sm-12 col-md-12 status-color" label="BK_MYBK_CLEANING_CHRGS_COMMERCIAL_GROUND_BOOKING_BRANCH" />
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