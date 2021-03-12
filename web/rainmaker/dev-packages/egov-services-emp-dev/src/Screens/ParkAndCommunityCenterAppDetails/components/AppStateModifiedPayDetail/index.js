import React, { Component } from "react";
import { Card, Image, Icon, Button } from "components";
import Label from "egov-ui-kit/utils/translationNode";
import isEmpty from "lodash/isEmpty";
import "./index.css";
import { connect } from "react-redux";
import get from "lodash/get";
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
    console.log("PayDetailsInAppStateModified--",this.props)

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
                  <Label className="col-xs-12  col-sm-12 col-md-12 status-color" label="BK_MYBK_DATE/VENUE_CHANGE_CHARGES" />
                </div>
                <div className="col-sm-4 col-xs-12">
                  <h5 style={{ textAlign: "right" }}>{this.props.ChangeAmount}</h5>
                </div>
              </div>

              <div className="complaint-detail-detail-section-status row" style={{marginLeft:'-10px'}}>
                <div className="col-sm-4 col-xs-12">
                  <Label className="col-xs-12  col-sm-12 col-md-12 status-color" label="BK_MYBK_AMOUNT" />
                </div>
                <div className="col-sm-4 col-xs-12">
                  <h5 style={{ textAlign: "right" }}>{this.props.taxes}</h5>
                </div>
              </div>
            </div>
          }
        />
      </div>
    );
  }
}

const mapStateToProps = state => {

  const { bookings, common, auth, form } = state;
  const { createPACCApplicationData} = bookings;
  const { userInfo } = state.auth;
  const { facilationChargesSuccess, arrayName } = bookings;
  const { applicationData } = bookings;
  let selectedComplaint = applicationData ? applicationData.bookingsModelList[0] : ''
  let selectedType = selectedComplaint ? selectedComplaint.bkBookingType : ''
let DateVenueChangeArray;
let ChangeAmount;
let taxes;
  let DateVenueChangeAmount  = get(
    state,
    "screenConfiguration.preparedFinalObject.DateVenueChngeAmount",
    "NotFound"
);
console.log("DateVenueChangeAmount",DateVenueChangeAmount)

if(DateVenueChangeAmount !== "NotFound"){
  DateVenueChangeArray = DateVenueChangeAmount.Bill[2].billDetails[0].billAccountDetails

if(selectedType == "Community Center"){
  for(let i=0; i<DateVenueChangeArray.length ; i++){
    if(DateVenueChangeArray[i].taxHeadCode == "COMMUNITY_LOCATION_AND_VENUE_CHANGE_AMOUNT"){
      ChangeAmount = DateVenueChangeArray[i].amount
    }
    if(DateVenueChangeArray[i].taxHeadCode == "CGST_UTGST_COMMUNITY_CENTRES_JHANJ_GHAR_BOOKING_BRANCH"){
      taxes = DateVenueChangeArray[i].amount
    }
      }
}

if(selectedType == "Parks"){
  for(let i=0; i<DateVenueChangeArray.length ; i++){
    if(DateVenueChangeArray[i].taxHeadCode == "PARK_LOCATION_AND_VENUE_CHANGE_AMOUNT"){
      ChangeAmount = DateVenueChangeArray[i].amount
    }
    if(DateVenueChangeArray[i].taxHeadCode == "CGST_UTGST_MANUAL_OPEN_SPACE_BOOKING_BRANCH"){
      taxes = DateVenueChangeArray[i].amount
    }
      }
}
  
}
console.log("ChangeAmount,taxes",ChangeAmount,taxes)
return {
  ChangeAmount,taxes,userInfo
}

}

const mapDispatchToProps = dispatch => {
  return { 
          prepareFinalObject: (jsonPath, value) =>
          dispatch(prepareFinalObject(jsonPath, value)),
  }
}
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(PayDetails);
