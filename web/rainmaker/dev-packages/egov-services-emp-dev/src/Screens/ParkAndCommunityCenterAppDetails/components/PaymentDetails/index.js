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
    const { bkPaymentDate, paymentDetails, bkPaymentReceiptNumber, bkPaymentStatus,PayMentOne,PayMentTwo } = this.props;

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
                  <Label className="col-xs-12  col-sm-12 col-md-12 status-color" label="BK_MYBK_REGISTRATION_RENT" />
                </div>
                <div className="col-sm-4 col-xs-12">
                  <h5 style={{ textAlign: "right" }}>{paymentDetails && paymentDetails.billDetails[0] && paymentDetails.billDetails[0].billAccountDetails[0].amount}</h5>
                </div>
              </div>

              <div className="complaint-detail-detail-section-status row" style={{marginLeft:'-10px'}}>
                <div className="col-sm-4 col-xs-12">
                  <Label className="col-xs-12  col-sm-12 col-md-12 status-color" label="BK_MYBK_TAX_RENT" />
                </div>
                <div className="col-sm-4 col-xs-12">
                  <h5 style={{ textAlign: "right" }}>{paymentDetails && paymentDetails.billDetails[0] && paymentDetails.billDetails[0].billAccountDetails[3].amount}</h5>
                </div>
              </div>
              <div className="complaint-detail-detail-section-status row" style={{marginLeft:'-10px'}}>
                <div className="col-sm-4 col-xs-12">
                  <Label className="col-xs-12  col-sm-12 col-md-12 status-color" label="BK_MYBK_TAX_RENT_PACC" />
                </div>
                <div className="col-sm-4 col-xs-12">
                  <h5 style={{ textAlign: "right" }}>{paymentDetails && paymentDetails.billDetails[0] && paymentDetails.billDetails[0].billAccountDetails[4].amount}</h5>
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