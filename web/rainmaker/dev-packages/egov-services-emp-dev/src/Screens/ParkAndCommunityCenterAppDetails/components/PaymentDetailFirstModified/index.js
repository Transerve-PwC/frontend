import React, { Component } from "react";
import { Card, Image, Icon, Button } from "components";
import Label from "egov-ui-kit/utils/translationNode";
import isEmpty from "lodash/isEmpty";
import "./index.css";
import { connect } from "react-redux";
import get from "lodash/get";
class PayDetails extends Component {
  
  render() {
    const { paymentDetails,ChangeAmount,taxes,userInfo,PACC,LUXURY_TAX,REFUNDABLE_SECURITY,PACC_TAX,PACC_ROUND_OFF,FACILITATION_CHARGE } = this.props;

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

              <div className="complaint-detail-detail-section-status row" style={{marginLeft:'-10px'}}>
                <div className="col-sm-4 col-xs-12">
                  <Label className="col-xs-12  col-sm-12 col-md-12 status-color" label="BK_MYBK__EMP_LUXURY_TAX" />
                </div>
                <div className="col-sm-4 col-xs-12">
                  <h5 style={{ textAlign: "right" }}>{LUXURY_TAX}</h5>
                </div>
              </div>
              <div className="complaint-detail-detail-section-status row" style={{marginLeft:'-10px'}}>
                <div className="col-sm-4 col-xs-12">
                  <Label className="col-xs-12  col-sm-12 col-md-12 status-color" label="BK_MYBK_EMP_REFUNDABLE_SECURITY" /> {/*BK_MYBK_TAX_RENT_PACC*/}
                </div>
                <div className="col-sm-4 col-xs-12">
                  <h5 style={{ textAlign: "right" }}>{REFUNDABLE_SECURITY}</h5>
                </div>
              </div>
              <div className="complaint-detail-detail-section-status row" style={{marginLeft:'-10px'}}>
                <div className="col-sm-4 col-xs-12">
                  <Label className="col-xs-12  col-sm-12 col-md-12 status-color" label="BK_MYBK_EMP_PACC_TAX" /> {/*BK_MYBK_TAX_RENT_PACC*/}
                </div>
                <div className="col-sm-4 col-xs-12">
                  <h5 style={{ textAlign: "right" }}>{PACC_TAX}</h5>
                </div>
              </div>

              <div className="complaint-detail-detail-section-status row" style={{marginLeft:'-10px'}}>
                <div className="col-sm-4 col-xs-12">
                  <Label className="col-xs-12  col-sm-12 col-md-12 status-color" label="BK_MYBK_TAX_RENT_PACC" /> {/*BK_MYBK_TAX_RENT_PACC*/}
                </div>
                <div className="col-sm-4 col-xs-12">
                  <h5 style={{ textAlign: "right" }}>{PACC}</h5>
                </div>
              </div>
              {FACILITATION_CHARGE !== 0 ? 
               <div className="complaint-detail-detail-section-status row" style={{marginLeft:'-10px'}}>
               <div className="col-sm-4 col-xs-12">
                 <Label className="col-xs-12  col-sm-12 col-md-12 status-color" label="BK_MYBK_FACILITATION_CHARGE" /> {/*BK_MYBK_TAX_RENT_PACC*/}
               </div>
               <div className="col-sm-4 col-xs-12">
                 <h5 style={{ textAlign: "right" }}>{FACILITATION_CHARGE}</h5>
               </div>
             </div>
              : "" }

              {/*last one*/}
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
let PACC = 0;
	let LUXURY_TAX = 0;
	let REFUNDABLE_SECURITY = 0;   
	let PACC_TAX = 0;
	let PACC_ROUND_OFF = 0;
	let FACILITATION_CHARGE = 0;
  let DateVenueChangeAmount  = get(
    state,
    "screenConfiguration.preparedFinalObject.DateVenueChngeAmount",
    "NotFound"
);
console.log("DateVenueChangeAmount",DateVenueChangeAmount)

if(DateVenueChangeAmount !== "NotFound"){
  DateVenueChangeArray = DateVenueChangeAmount.Bill[0].billDetails[0].billAccountDetails

  if(selectedType == "Parks"){
    for(let i = 0; i < DateVenueChangeArray.length ; i++ ){
  
      if(DateVenueChangeArray[i].taxHeadCode == "PARKING_LOTS_MANUAL_OPEN_SPACE_BOOKING_BRANCH"){//PACC
        PACC = DateVenueChangeArray[i].amount
      }
      else if(DateVenueChangeArray[i].taxHeadCode == "CLEANING_CHRGS_MANUAL_OPEN_SPACE_BOOKING_BRANCH"){//LUXURY_TAX
        LUXURY_TAX = DateVenueChangeArray[i].amount
      }
      else if(DateVenueChangeArray[i].taxHeadCode == "SECURITY_MANUAL_OPEN_SPACE_BOOKING_BRANCH"){//REFUNDABLE_SECURITY
        REFUNDABLE_SECURITY = DateVenueChangeArray[i].amount
      }
      else if(DateVenueChangeArray[i].taxHeadCode == "CGST_UTGST_MANUAL_OPEN_SPACE_BOOKING_BRANCH"){//PACC_TAX
        PACC_TAX = DateVenueChangeArray[i].amount
      }
      else if(DateVenueChangeArray[i].taxHeadCode == "PACC_ROUND_OFF"){
        PACC_ROUND_OFF = DateVenueChangeArray[i].amount
      }
      else if(DateVenueChangeArray[i].taxHeadCode == "FACILITATION_CHRGS_MANUAL_OPEN_SPACE_BOOKING_BRANCH"){//FACILITATION_CHARGE
        FACILITATION_CHARGE = DateVenueChangeArray[i].amount
      }
      }
      }
  
      if(selectedType == "Community Center"){
        for(let i = 0; i < DateVenueChangeArray.length ; i++ ){
      
          if(DateVenueChangeArray[i].taxHeadCode == "RENT_COMMUNITY_CENTRES_JHANJ_GHAR_BOOKING_BRANCH"){//PACC
            PACC = DateVenueChangeArray[i].amount
          }
          else if(DateVenueChangeArray[i].taxHeadCode == "CLEANING_CHRGS_COMMUNITY_CENTRES_JHANJ_GHAR_BOOKING_BRANCH"){//LUXURY_TAX
            LUXURY_TAX = DateVenueChangeArray[i].amount
          }
          else if(DateVenueChangeArray[i].taxHeadCode == "SECURITY_CHRGS_COMMUNITY_CENTRES_JHANJ_GHAR_BOOKING_BRANCH"){//REFUNDABLE_SECURITY
            REFUNDABLE_SECURITY = DateVenueChangeArray[i].amount
          }
          else if(DateVenueChangeArray[i].taxHeadCode == "CGST_UTGST_COMMUNITY_CENTRES_JHANJ_GHAR_BOOKING_BRANCH"){//PACC_TAX
            PACC_TAX = DateVenueChangeArray[i].amount
          }
          else if(DateVenueChangeArray[i].taxHeadCode == "PACC_ROUND_OFF"){
            PACC_ROUND_OFF = DateVenueChangeArray[i].amount
          }
          else if(DateVenueChangeArray[i].taxHeadCode == "FACILITATION_CHRGS_COMMUNITY_CENTRES_JHANJ_GHAR_BOOKING_BRANCH"){ //FACILITATION_CHARGE
            FACILITATION_CHARGE = DateVenueChangeArray[i].amount
          }
          }
          }
  
}
console.log("ChangeAmount,taxes",ChangeAmount,taxes)
return {
  ChangeAmount,taxes,userInfo,PACC,LUXURY_TAX,REFUNDABLE_SECURITY,PACC_TAX,PACC_ROUND_OFF,FACILITATION_CHARGE
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