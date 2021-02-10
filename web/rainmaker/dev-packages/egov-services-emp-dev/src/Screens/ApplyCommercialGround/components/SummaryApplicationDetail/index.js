import React, { Component } from "react";
import { Card, Image, Icon, Button } from "components";
import Label from "egov-ui-kit/utils/translationNode";
import isEmpty from "lodash/isEmpty";
import { connect } from "react-redux";
import "./index.css";
import moment from 'moment';

class CGBookingDetails extends Component {

  render() {
    const {fromDate, toDate,purpose,cgBookingVenue,Category} = this.props;
    
    let StrfromDate = moment(fromDate).format("YYYY-MM-DD");
    let strtoDate  = moment(toDate).format("YYYY-MM-DD");
    
      console.log("propsInbookingSummaryPage--",this.props)
return (
      <div>
        <Card
          textChildren={
            <div>
              <div className="rainmaker-displayInline">
                
                <Label label="BK_MYBK_APPLICANTION_DETAILS" containerStyle={{ marginLeft: "13px" }} labelClassName="dark-heading" />
              </div>
              <div key={10} className="complaint-detail-full-width">
              
              <div className="complaint-detail-detail-section-status row">
              <div className="col-md-4">
                                <Label className="col-xs-12  col-sm-12 col-md-12 status-color" label="BK_CGB_FROM_DATE_LABEL" />
                                <Label
                                    labelStyle={{ color: "inherit" }}
                                    className="col-xs-12  col-sm-12 col-md-12  status-result-color"
                                    id="complaint-details-complaint-number"
                                    label={StrfromDate}
                                />
                            </div>
                            <div className="col-md-4">
                                <Label className="col-xs-12  col-sm-12 col-md-12 status-color" label="BK_CGB_TO_DATE_LABEL" />
                                <Label
                                    className="col-xs-12  col-sm-12 col-md-12  status-result-color"
                                    id="complaint-details-current-status"
                                    labelStyle={{ color: "inherit" }}
                                    label={strtoDate}
                                />
                            </div>
                            <div className="col-md-4">
                                <Label className="col-xs-12  col-sm-12 col-md-12 status-color" label="BK_CGB_BOOKING_VENUE_LABEL" />
                                <Label
                                    className="col-xs-12  col-sm-12 col-md-12  status-result-color"
                                    id="complaint-details-current-status"
                                    labelStyle={{ color: "inherit" }}
                                    label={cgBookingVenue}
                                />
                            </div>

                            <div className="col-md-4">
                                <Label className="col-xs-12  col-sm-12 col-md-12 status-color" label="BK_CGB_CATEGORY_LABEL" />
                                <Label
                                    className="col-xs-12  col-sm-12 col-md-12  status-result-color"
                                    id="complaint-details-current-status"
                                    labelStyle={{ color: "inherit" }}
                                    label={Category}
                                />
                            </div>

                            <div className="col-md-4">
                                <Label className="col-xs-12  col-sm-12 col-md-12 status-color" label="BK_CGB_PURPOSE_LABEL" />
                                <Label
                                    labelStyle={{ color: "inherit" }}
                                    className="col-xs-12  col-sm-12 col-md-12  status-result-color"
                                    id="complaint-details-complaint-number"
                                    label={purpose}
                                />
                            </div>                        
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

    const { complaints, common, auth, form,bookings } = state;
    let myLocation = state.screenConfiguration.preparedFinalObject ? state.screenConfiguration.preparedFinalObject.availabilityCheckData:"";  
    let myLocationtwo = myLocation?myLocation.bkLocation:"";  

    const { facilationChargesSuccess, arrayName } = bookings;
  
  let fCharges;
  if (arrayName && arrayName.length > 0) {
    arrayName.forEach((item) => {
      item.forEach((value) => {
        if (value.code == "FACILITATION_CHARGE") { 
          fCharges = value
        }
      })
    })
  }
  
    let firstrent = state.screenConfiguration.preparedFinalObject ? state.screenConfiguration.preparedFinalObject.bkBookingData: "";
   
    let secondRate = firstrent ?firstrent.rent:"";
  
    let cleanOne =  firstrent?firstrent.cleaningCharges:""; 
   
    let surchargeOne =  firstrent?firstrent.surcharge:""; 
   
    let cgstone =  firstrent?firstrent.cgstRate:""; 
  
    let utgstRateOne =  firstrent?firstrent.utgstRate:""; 

    let SummaryutGST = state.screenConfiguration.preparedFinalObject ? state.screenConfiguration.preparedFinalObject.SummaryutGST: "NotFound";
   console.log("SummaryutGST-2-",SummaryutGST)

   

   let PrintutGST2 = SummaryutGST && SummaryutGST ? SummaryutGST : " notfound";
   console.log("PrintutGST2--",PrintutGST2)

   let SummarycGST = state.screenConfiguration.preparedFinalObject ? state.screenConfiguration.preparedFinalObject.SummarycGST: "NotFound";
   console.log("SummarycGST-2-",SummarycGST)

   

   let PrintcGST = SummarycGST && SummarycGST ? SummarycGST : " notfound";
   console.log("PrintcGST--",PrintcGST)

   let Summarysurcharge = state.screenConfiguration.preparedFinalObject ? state.screenConfiguration.preparedFinalObject.Summarysurcharge: "NotFound";
   console.log("Summarysurcharge-2-",Summarysurcharge)

   let Printsurcharge = Summarysurcharge && Summarysurcharge ? Summarysurcharge : " notfound";
   console.log("Printsurcharge--",Printsurcharge) 

   


    const { createPACCApplicationData } = complaints;
   
    return {
        createPACCApplicationData,
        SummarycGST,
        Summarysurcharge,
        SummaryutGST,
        PrintutGST2,
        PrintcGST,
        Printsurcharge,
         myLocation,
         firstrent,
         secondRate,
         myLocationtwo,
         cleanOne,
         cgstone,
         utgstRateOne,
         surchargeOne,
         facilationChargesSuccess,
         fCharges
    }

}
const mapDispatchToProps = dispatch => {
    return {

        createPACCApplication: criteria => dispatch(createPACCApplication(criteria)),
        toggleSnackbarAndSetText: (open, message, error) =>
            dispatch(toggleSnackbarAndSetText(open, message, error)),
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(CGBookingDetails);

