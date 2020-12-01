import React, { Component } from "react";
import { Card, Image, Icon, Button } from "components";
import Label from "egov-ui-kit/utils/translationNode";
import isEmpty from "lodash/isEmpty";
import { connect } from "react-redux";
import "./index.css";

class CGBookingDetails extends Component {

  render() {
    const { locality, surcharge, fromDate, toDate,SummaryutGST,SummarycGST,Summarysurcharge,
        utGST, cGST, GSTnumber, cgstone, PrintutGST2,
        PrintcGST,
        Printsurcharge,
       utgstRateOne,surchargeOne,fCharges,
      dimension, cleaningCharges, rent, purpose, bkLocation, myLocation, secondRate ,myLocationtwo,firstrent, cleanOne} = this.props;
      console.log("propsInbookingSummaryPage--",this.props)
      if(PrintutGST2 != "notfound"){
        let UTGST = PrintutGST2
        console.log("UTGST--",UTGST)
      }
      if(PrintcGST !== "notfound"){
        let CGST = PrintcGST
        console.log("CGST--",CGST)
      }
      if(Printsurcharge !== "notfound"){
        let surCharges = Printsurcharge
        console.log("surCharges--",surCharges)
      }
 var vandanaOne = 0;

      if (SummaryutGST) {
       // do something
       vandanaOne = SummaryutGST
       console.log("vandanaOne--",vandanaOne)
    }
   
    console.log("vandanaOne-vandanaOne--",vandanaOne)

    const n = vandanaOne.toString();

    const printvandanaOne = n ? n : "NA"
    console.log("printvandanaOne--",printvandanaOne)

var vandanaTwo = 0;

   if (SummarycGST) {
    // do something
    vandanaTwo = SummarycGST
    console.log("vandanaTwo--",vandanaTwo)
  }

  const m = vandanaTwo.toString();

  const printvandanaTwo = m ? m : "NA"
  console.log("printvandanaOne--",printvandanaOne)

  console.log("vandanaTwo--vandanaTwo-",vandanaTwo)


 var vandanaThree = 0;

   if (Summarysurcharge) {
    // do something
    vandanaThree = Summarysurcharge
    console.log("vandanaThree--",vandanaTwo)
  }

  const o = vandanaThree.toString();

  var printvandanaThree = o ? o : "NA"
  console.log("printvandanaThree--",printvandanaThree)

  console.log("vandanaTwo,vandanaOne--",vandanaTwo,vandanaOne)
  var abc = 89;
return (
      <div>
        {console.log("vandanaThree-In-render--",vandanaThree)} 
        <Card
          textChildren={
            <div>
              <div className="rainmaker-displayInline">
                
                <Label label="BK_MYBK_APPLICANTION_DETAILS" containerStyle={{ marginLeft: "13px" }} labelClassName="dark-heading" />
              </div>
              <div key={10} className="complaint-detail-full-width">
              
              <div className="complaint-detail-detail-section-status row">
              <div className="col-md-4">
                                <Label className="col-xs-12  col-sm-12 col-md-12 status-color" label="BK_MYBK_CREATE_PURPOSE" />
                                <Label
                                    labelStyle={{ color: "inherit" }}
                                    className="col-xs-12  col-sm-12 col-md-12  status-result-color"
                                    id="complaint-details-complaint-number"
                                    label={purpose}
                                />
                            </div>
                            <div className="col-md-4">
                                <Label className="col-xs-12  col-sm-12 col-md-12 status-color" label="BK_MYBK_SETCOR_PLACEHOLDER" />
                                <Label
                                    className="col-xs-12  col-sm-12 col-md-12  status-result-color"
                                    id="complaint-details-current-status"
                                    labelStyle={{ color: "inherit" }}
                                    label={locality}
                                />
                            </div>
                            <div className="col-md-4">
                                <Label className="col-xs-12  col-sm-12 col-md-12 status-color" label="BK_MYBK_CREATE_DIMENSION_AREA" />
                                <Label
                                    className="col-xs-12  col-sm-12 col-md-12  status-result-color"
                                    id="complaint-details-current-status"
                                    labelStyle={{ color: "inherit" }}
                                    label={dimension}
                                />
                            </div>

                            <div className="col-md-4">
                                <Label className="col-xs-12  col-sm-12 col-md-12 status-color" label="BK_MYBK_CREATE_LOCATION" />
                                <Label
                                    className="col-xs-12  col-sm-12 col-md-12  status-result-color"
                                    id="complaint-details-current-status"
                                    labelStyle={{ color: "inherit" }}
                                    label={myLocationtwo}
                                />
                            </div>

                            <div className="col-md-4">
                                <Label className="col-xs-12  col-sm-12 col-md-12 status-color" label="BK_MYBK_FROM_DATE" />
                                <Label
                                    labelStyle={{ color: "inherit" }}
                                    className="col-xs-12  col-sm-12 col-md-12  status-result-color"
                                    id="complaint-details-complaint-number"
                                    label={fromDate}
                                />
                            </div>
                            <div className="col-md-4">
                                <Label className="col-xs-12  col-sm-12 col-md-12 status-color" label="BK_MYBK_TO_DATE" />
                                <Label
                                    className="col-xs-12  col-sm-12 col-md-12  status-result-color"
                                    id="complaint-details-current-status"
                                    labelStyle={{ color: "inherit" }}
                                    label={toDate}
                                />
                            </div>

                            <div className="col-md-4">
                                <Label className="col-xs-12  col-sm-12 col-md-12 status-color" label="BK_MYBK_CREATE_CLEANING_CHARGES" />
                                <Label
                                    className="col-xs-12  col-sm-12 col-md-12  status-result-color"
                                    id="complaint-details-current-status"
                                    labelStyle={{ color: "inherit" }}                                  
                                    label={cleanOne?cleanOne:"NA"}
                                />
                            </div>

                            <div className="col-md-4">
                                <Label className="col-xs-12  col-sm-12 col-md-12 status-color" label="BK_MYBK_CREATE_RENT" />
                                <Label
                                    className="col-xs-12  col-sm-12 col-md-12  status-result-color"
                                    id="complaint-details-current-status"
                                    labelStyle={{ color: "inherit" }}
                                    label={secondRate}
                                />
                            </div>

                            <div className="col-md-4">
                                <Label className="col-xs-12  col-sm-12 col-md-12 status-color" label="BK_MYBK_CREATE_SURCHARGE" />
                                <Label
                                    className="col-xs-12  col-sm-12 col-md-12  status-result-color"
                                    id="complaint-details-current-status"
                                    labelStyle={{ color: "inherit" }}
                                    label={printvandanaThree}
                                />
                            </div>
                            <div className="col-md-4">
                                <Label className="col-xs-12  col-sm-12 col-md-12 status-color" label="BK_MYBK_CREATE_UTGST" />
                                <Label
                                    className="col-xs-12  col-sm-12 col-md-12  status-result-color"
                                    id="complaint-details-current-status"
                                    labelStyle={{ color: "inherit" }}                
                                    label={printvandanaOne}
         
                                />
                            </div>
                            <div className="col-md-4">
                                <Label className="col-xs-12  col-sm-12 col-md-12 status-color" label="BK_MYBK_CREATE_CGST" />
                                <Label
                                    className="col-xs-12  col-sm-12 col-md-12  status-result-color"
                                    id="complaint-details-current-status"
                                    labelStyle={{ color: "inherit" }}
                                    label={printvandanaTwo}
                                />
                            </div>
                            <div className="col-md-4">
                                <Label className="col-xs-12  col-sm-12 col-md-12 status-color" label="BK_MYBK_CREATE_GSTNUMBER" />
                                <Label
                                    className="col-xs-12  col-sm-12 col-md-12  status-result-color"
                                    id="complaint-details-current-status"
                                    labelStyle={{ color: "inherit" }}
                                    label={GSTnumber?GSTnumber:"NA"}
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

