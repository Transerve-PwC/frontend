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
  render() {
    const {paymentDetails} = this.props;

    return (
      <div>
        <Card
          textChildren={
            <div>
              <div className="rainmaker-displayInline row">
                <div className="col-md-4">
<Label label="Date/Venue Change Charge" containerStyle={{ marginLeft: "13px" }} labelClassName="dark-heading" />

                </div>
                <div style={{right: '50px',position: 'absolute'}}>
                  <h5><Label label="BK_TOTAL_AMOUNT" /></h5>
                  <h3 style={{marginTop: '-8px',fontSize: '28px',color: 'black'}}><b>Rs {paymentDetails ? paymentDetails.totalAmount : 'NA'}</b></h3>
                </div>
              </div>

              <div className="complaint-detail-detail-section-status row" style={{marginLeft:'-10px',marginTop:30}}>
                <div className="col-sm-4 col-xs-12">
                  <Label className="col-xs-12  col-sm-12 col-md-12 status-color" label="BK_MYBK_Date/Venue_CHANGE_CHARGES" />
                </div>
                <div className="col-sm-4 col-xs-12">
                  <h5 style={{ textAlign: "right" }}>{paymentDetails && paymentDetails.billDetails[0] && paymentDetails.billDetails[0].billAccountDetails[5].amount}</h5>
                </div>
              </div>

              <div className="complaint-detail-detail-section-status row" style={{marginLeft:'-10px'}}>
                <div className="col-sm-4 col-xs-12">
                  <Label className="col-xs-12  col-sm-12 col-md-12 status-color" label="BK_MYBK_TAXES" />
                </div>
                <div className="col-sm-4 col-xs-12">
                  <h5 style={{ textAlign: "right" }}>{paymentDetails && paymentDetails.billDetails[0] && paymentDetails.billDetails[0].billAccountDetails[3].amount}</h5>
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