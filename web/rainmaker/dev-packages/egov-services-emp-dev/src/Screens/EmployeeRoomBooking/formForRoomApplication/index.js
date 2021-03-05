import React, { Component } from 'react';
import CCBookingDetail from '../CCBookingDetail';  
import CCVenueDetail from '../CCVenueDetail'; 
import RoomBookingStep from '../RoomBookingStep';
import SummaryDetails from '../SummaryDetails';
import { connect } from "react-redux";
import get from "lodash/get";
import moment from 'moment';
import { httpRequest } from "egov-ui-kit/utils/api";
import Label from "egov-ui-kit/utils/translationNode";
import { Box, Button, Card, CardContent, CircularProgress, Grid, Step, StepLabel, Stepper } from '@material-ui/core';
import commonConfig from "config/common.js";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";

export class StepForm extends Component {
// this.props.appData &&  this.props.appData.bkApplicantName ||  "" 

    state = {
      AccRoomToBook:'',  
      NonAccRoomToBook:'',
      RoomBookingData:'',
      TypeOfRoomToBook: '',
      NumOfDaysToBookRoom: '',
      roomFromDate:'',
      roomToDate:'',
      step: 0,
      Name : this.props.DataForRoomBooking.bookingsModelList[0].bkApplicantName,
      email : this.props.DataForRoomBooking.bookingsModelList[0].bkEmail,
      purpose : this.props.DataForRoomBooking.bookingsModelList[0].bkBookingPurpose,
      houseNo : this.props.DataForRoomBooking.bookingsModelList[0].bkHouseNo,//
      ReasonForDiscount : this.props.DataForRoomBooking.bookingsModelList[0].bkRemarks,
      discount: this.props.DataForRoomBooking.bookingsModelList[0].discount,
      Sector : this.props.DataForRoomBooking.bookingsModelList[0].bkSector,
      mobileNo : this.props.DataForRoomBooking.bookingsModelList[0].bkMobileNumber,
      gstNo : this.props.DataForRoomBooking.bookingsModelList[0].bkCustomerGstNo,
      ProofOfResidence : '',
      location:this.props.DataForRoomBooking.bookingsModelList[0].bkLocation,
      NoOfDays: this.props.DataForRoomBooking.bookingsModelList[0].bkCustomerGstNo,
      locality: this.props.DataForRoomBooking.bookingsModelList[0].bkLocation,
      fromDate:this.props.DataForRoomBooking.bookingsModelList[0].bkFromDate,
      toDate :this.props.DataForRoomBooking.bookingsModelList[0].bkToDate,
      dimension: this.props.DataForRoomBooking.bookingsModelList[0].bkDimension,
      RefundableSecurity:this.props.DataForRoomBooking.bookingsModelList[0].bkRefundAmount,
      Rent:this.props.DataForRoomBooking.bookingsModelList[0].bkRent,
      utgst:this.props.DataForRoomBooking.bookingsModelList[0].bkUtgst,
      cgst:this.props.DataForRoomBooking.bookingsModelList[0].bkCgst,
      surcharges:this.props.DataForRoomBooking.bookingsModelList[0].bkSurchargeRent,
      facilitationCharges:this.props.DataForRoomBooking.bookingsModelList[0].bkFacilitationCharges, 
      cleaningCharges:this.props.DataForRoomBooking.bookingsModelList[0].bkCleansingCharges,
        childrenArray: [
            { labelName: "Community Center Details", labelKey: "Community Center Details" },
            { labelName: "Venue Details", labelKey: "Venue Details" },
            { labelName: "Room Booking Details", labelKey: "Room Booking Details" },
            // { labelName: "Payments Details", labelKey: "PAYMENT DETAILS" },
            // { labelName: "Documents", labelKey: "DOCUMENTS" },
            { labelName: "Summary", labelKey: "SUMMARY" },
        ]

            
    }

    componentDidMount = async () => {

        let complaintCountRequest = 
        {
          "applicationNumber": this.props.DataForRoomBooking.bookingsModelList[0].bkApplicationNumber, 
        }
        
      let RoomData = await httpRequest( 	
        "bookings/community/room/availability/_fetch",
          "_search",[],
          complaintCountRequest
        );
      console.log("RoomData --",RoomData)
      console.log("RoomDataMain--",RoomData.data)
      
      prepareFinalObject("RoomBookingData.RoomData", RoomData.data)

      this.setState({
        RoomBookingData :RoomData.data
      })

  //       let requestBody = {
  //           MdmsCriteria:{
  //               tenantId: commonConfig.tenantId,
  //           moduleDetails: [
  //               {
  //                   "moduleName": "BillingService",
  //                   "masterDetails": [
  //                       {
  //                           "name": "TaxHeadMaster"
  //                       }
  //                   ]
  //               }
  //           ]
  //       }
  //       }


  //       let hereFcCharges = await httpRequest(
  //           "egov-mdms-service/v1/_search",
  //           "_search", [],
  //           requestBody
  //         );
  //       console.log("hereFcCharges--",hereFcCharges)  


  //       let TaxHeadMaster = hereFcCharges.MdmsRes.BillingService.TaxHeadMaster
  //       console.log("TaxHeadMaster--",TaxHeadMaster)
  //       var arrayName = [];
  //       arrayName.push(hereFcCharges.MdmsRes.BillingService.TaxHeadMaster)
  //       console.log("arrayName--",arrayName)

  //       let IndexfCharges;
  //       if (arrayName && arrayName.length > 0) {
  //         arrayName.forEach((item) => {
  //           item.forEach((value) => {
  //             if (value.code == "FACILITATION_CHARGE") { 
  //               IndexfCharges = value
  //             }
  //           })
  //         })
  //       }
  //    console.log("fCharges--inindexPage--",IndexfCharges)

  //  let testFcharges = IndexfCharges && IndexfCharges.facilitationCharge ? IndexfCharges.facilitationCharge : "valueNotsetYet"
  //  console.log("testFcharges--",testFcharges)
  //    this.setState({
  //       NewfCharges : testFcharges
  //    })    
      }

     nextStep = () => {
        const { step } = this.state;
        this.setState({
            step: step + 1
        });
    }

    prevStep = () => {
        const { step } = this.state;
        this.setState({
            step: step - 1
        });
    }

    firstStep = () => {
        const { step } = this.state;
        this.setState({
            step: step - 3
        });
    }

    onFromDateChange = e => {
        let fromDate = e.target.value;
        this.setState({
            fromDate
        })
    }
    handleChangeDiscount = (event) => {
        console.log("event--",event)
        this.setState({ discountType: event.target.value });
        console.log("this.state-of-discountType--",this.state.discountType)
    };
    AccountType = (event) => {
        console.log("event--",event)
        this.setState({ accountType: event.target.value });
        console.log("this.state-of-accountType--",this.state.discountType)
    };

    onToDateChange = e => {
        const toDate = e.target.value;
        this.setState({
            toDate: toDate
        })
    }

    transactionDateChange = e => {
        const trDate = e.target.value;
        this.setState({
            transactionDate: trDate
        })

    }
 



    handleChange = input => e => {
        this.setState({ [input]: e.target.value });
        if(e.target.value === "Both"){
            this.props.prepareFinalObject("GlobalTypeOfRoom",e.target.value)
        }
        else if(e.target.value === "AC"){
            this.props.prepareFinalObject("GlobalTypeOfRoom",e.target.value)
        }
        else if(e.target.value === "NON-AC"){
            this.props.prepareFinalObject("GlobalTypeOfRoom",e.target.value)
        }
        else if(e.target.value === "AccRoomToBook"){
            this.props.prepareFinalObject("GlobalAccRoomToBook",e.target.value)
        }
        else if(e.target.value ===  "NonAccRoomToBook"){
            this.props.prepareFinalObject("GlobalNonAccRoomToBook",e.target.value)
        }
    }



    calculateBetweenDaysCount = (startDate, endDate) => {
        const oneDay = 24 * 60 * 60 * 1000;
        const firstDate = new Date(startDate);
        const secondDate = new Date(endDate);

        const daysCount =
            Math.round(Math.abs((firstDate - secondDate) / oneDay)) + 1;
        return daysCount;
    };
    showStep = () => {
 
   const {utgst,cgst,RefundableSecurity,Rent,dimension,Name,purpose,houseNo,ReasonForDiscount,Sector,mobileNo,gstNo,ProofOfResidence, location,NoOfDays,locality, fromDate,toDate,
    facilitationCharges,step,cleaningCharges,surcharges,discount,
    AccRoomToBook,NonAccRoomToBook,RoomBookingData,TypeOfRoomToBook,NumOfDaysToBookRoom,
    roomFromDate,roomToDate,email
  } = this.state
      console.log("stateofROOMinFORM--",this.state)
 
        if (step === 0)
            return (<CCBookingDetail
                nextStep={this.nextStep}
                handleChange={this.handleChange}
                Name={Name}    
                purpose={purpose}
                houseNo={houseNo}
                mobileNo={mobileNo}
                Sector={Sector}
                handleChangeDiscount={this.handleChangeDiscount}
                gstNo={gstNo}
                ProofOfResidence={ProofOfResidence}

            />);
        if (step === 1)
            return (<CCVenueDetail
                email={email}
                location={location}
                NoOfDays={NoOfDays}
                locality={locality}
                fromDate={fromDate}
                toDate={toDate}
                ReasonForDiscount={ReasonForDiscount}
                discount={discount}
                dimension={dimension}
                RefundableSecurity={RefundableSecurity}
                cleaningCharges={cleaningCharges}
                Rent={Rent}
                utgst={utgst}
                cgst={cgst}
                Sector={Sector}
                surcharge={surcharges}
                facilitationCharges={facilitationCharges}
                nextStep={this.nextStep}
                prevStep={this.prevStep}
                handleChange={this.handleChange}
            />);
        if (step === 2)
            return (<RoomBookingStep
                nextStep={this.nextStep}
                handleChange={this.handleChange}
                nextStep={this.nextStep}
                prevStep={this.prevStep}
                RoomBookingData={RoomBookingData}
                AccRoomToBook={AccRoomToBook}
                NumOfDaysToBookRoom={NumOfDaysToBookRoom}
                NonAccRoomToBook={NonAccRoomToBook}
                roomFromDate={roomFromDate}
                roomToDate={roomToDate}
                TypeOfRoomToBook={TypeOfRoomToBook}
                fromDate={fromDate}
                toDate={toDate}
                Sector={Sector}
            />);

        if (step === 3)
            return (<SummaryDetails
                nextStep={this.nextStep}
                prevStep={this.prevStep}
                handleChange={this.handleChange}
                Name={Name}    
                purpose={purpose}
                discount={discount}
                houseNo={houseNo}
                mobileNo={mobileNo}
                Sector={Sector}
                gstNo={gstNo}
                ProofOfResidence={ProofOfResidence}
                location={location}
                NoOfDays={NoOfDays}
                locality={locality}
                fromDate={fromDate}
                toDate={toDate}
                dimension={dimension}
                RefundableSecurity={RefundableSecurity}
                cleaningCharges={cleaningCharges}
                Rent={Rent}
                utgst={utgst}
                cgst={cgst}
                surcharge={surcharges}
                facilitationCharges={facilitationCharges}
                RoomBookingData={RoomBookingData}
                TypeOfRoomToBook={TypeOfRoomToBook}
                NumOfDaysToBookRoom={NumOfDaysToBookRoom}
                AccRoomToBook={AccRoomToBook}
                NonAccRoomToBook={NonAccRoomToBook}
                roomFromDate={roomFromDate}
                roomToDate={roomToDate}

            />);

        // if (step === 4)
        //     return (<DocumentDetails
        //         nextStep={this.nextStep}
        //         rent={vrent}
        //         prevStep={this.prevStep}
        //         handleChange={this.handleChange}
        //         firstName={firstName}
        //         lastName={lastName}
        //         email={email}
        //         mobileNo={mobileNo}
        //     />);
        // if (step === 5)
        //     return (<SummaryInfo
        //         bookingData={bookingData}
        //         venueType={venueType}
        //         bokingType={bokingType}
        //         discountType={discountType}
        //         accountType={accountType}
        //         approverName={approverName}
        //         amount={amount}
        //         bankName={bankName}
        //         transactionDate={transactionDate}
        //         transactionNumber={transactionNumber}
        //         paymentMode={paymentMode}
        //         comment={comment} 
        //         BankAccountName={BankAccountName}  //start for bank details
        //         NomineeName={NomineeName} 
        //         BankAccountNumber={BankAccountNumber}
        //         IFSCCode={IFSCCode}
        //         AccountHolderName={AccountHolderName}
        //         firstName={firstName} //start of application details
        //         purpose={purpose}
        //         utGST={utGST}
        //         cGST={cGST}
        //         lastName={lastName}
        //         jobTitle={jobTitle}
        //         jobCompany={jobCompany}
        //         jobLocation={jobLocation}
        //         prevStep={this.prevStep}
        //         mobileNo={mobileNo}
        //         email={email}
        //         houseNo={houseNo}
        //         dimension={dimension}
        //         location={location}
        //         cleaningCharges={cleaningCharges}
        //         type={type}
        //         rent={vrent}
        //         fromDate={fromDate}
        //         toDate={toDate}
        //         GSTnumber={GSTnumber}
        //         surcharge={surcharge}
        //         facilitationCharges={facilitationCharges}
        //         locality={locality}
        //         residenials={residenials}
        //         {...propsData}
        //         firstStep={this.firstStep}
        //     />);
    }

    render() {
    const { step } = this.state;
    const {fromDateone,
    bookingOne} = this.props;
        return (
            <div style={{ backgroundColor: 'aliceblue'}}>
                <div className="col-xs-12" style={{ padding: 0, float: 'left', width: '100%', backgroundColor: 'aliceblue'}}>
                    <div className="col-sm-12 col-xs-12" style={{ backgroundColor: 'aliceblue'}}>
                        <Stepper  style={{ backgroundColor: "transparent" }} alternativeLabel activeStep={step}>
                            {this.state.childrenArray.map((child, index) => (
                                <Step key={child.labelKey}>
                                    <StepLabel>{child.labelKey}</StepLabel>
                                </Step>
                            ))}

                        </Stepper>
                    </div>
                </div>
                {this.showStep()}
            </div>
        );
    }
}


const mapStateToProps = state => {
  const { complaints, common, auth, form } = state;
  const { userInfo } = state.auth;

  let DataForRoomBooking = state.screenConfiguration.preparedFinalObject ? state.screenConfiguration.preparedFinalObject.RoomBookingData : "NA"


  return {
    state,userInfo,DataForRoomBooking
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
)(StepForm);
