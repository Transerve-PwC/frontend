import React, { Component } from 'react';
import PersonalInfo from './components/ApplicatDetails';  
import BookingDetails from './components/BookingDetails'; 
import BankDetails from './components/BankDetails';
import SummaryInfo from './components/SummaryDetails';
import DocumentDetails from './components/DocumentsDetails'; 
import ParkPaymentDetails from './components/PaccPaymentDetails'
import fetchfacilationCharges from 'egov-ui-kit/redux/bookings/actions'
import { connect } from "react-redux";
import get from "lodash/get"; 
import moment from 'moment';
import { httpRequest } from "egov-ui-kit/utils/api";
import Label from "egov-ui-kit/utils/translationNode";
import { Box, Button, Card, CardContent, CircularProgress, Grid, Step, StepLabel, Stepper } from '@material-ui/core';
import commonConfig from "config/common.js";


export class StepForm extends Component {
// this.props.appData &&  this.props.appData.bkApplicantName ||  "" 

    state = {
        step: 0,
        firstName: this.props.appData.bkApplicantName ? this.props.appData.bkApplicantName : '',
        bookingStepRefundAmount:'',
        BankAccountName: this.props.appData.bkBankName ? this.props.appData.bkBankName : '',
        NomineeName:this.props.appData.bkNomineeName ? this.props.appData.bkNomineeName : '',
        BankAccountNumber:this.props.appData.bkBankAccountNumber ? this.props.appData.bkBankAccountNumber : '',
        IFSCCode:this.props.appData.bkIfscCode ? this.props.appData.bkIfscCode : '',
        AccountHolderName:this.props.appData.bkBankAccountHolder ? this.props.appData.bkBankAccountHolder : '',
        accountType: 'Saving',
        lastName: '',
        email: this.props.appData.bkEmail ? this.props.appData.bkEmail : '',
        mobileNo: this.props.appData.bkMobileNumber ? this.props.appData.bkMobileNumber : '',
        jobTitle: '', 
        jobCompany: '',
        jobLocation: '',
        houseNo: this.props.appData.bkHouseNo ? this.props.appData.bkHouseNo : '',
        purpose: this.props.appData.bkBookingPurpose ? this.props.appData.bkBookingPurpose : '',
        locality: this.props.appData.bkLocation ? this.props.appData.bkLocation : '',
        residenials: this.props.appData.bkResidentialOrCommercial !== undefined && this.props.appData.bkResidentialOrCommercial !== null ? this.props.appData.bkResidentialOrCommercial : '',
        approverName: '',//bkBookingPurpose
        comment: '',
        dimension: '', 
        DiscountReason : this.props.appData.bkRemarks ? this.props.appData.bkRemarks : '',//
        location: this.props.appData.bkLocation ? this.props.appData.bkLocation : '',//bkLocation
        cleaningCharges: '', 
        rent: '',
        facilitationCharges: '',
        NewfCharges: '',
        surcharge: '', utGST: '', cGST: '',
        GSTnumber: this.props.appData &&  this.props.appData.bkCustomerGstNo ||  "", type: '',
        fromDate: '', finalRent: '',
        toDate: '', transactionNumber: '', bankName: '', 
        paymentMode: this.props.appData.bkMaterialStorageArea !== undefined && this.props.appData.bkMaterialStorageArea !== null ? this.props.appData.bkMaterialStorageArea : '',
         amount: '', transactionDate: '', 
        discountType: this.props.appData.bkPlotSketch ? this.props.appData.bkPlotSketch : 'General',       //bkPlotSketch 
        childrenArray: [
            { labelName: "Applicant Details", labelKey: "APPLICANT DETAILS" },
            { labelName: "Booking Details", labelKey: "BOOKING DETAILS" },
            { labelName: "Bank Details", labelKey: "BANK DETAILS" },
            // { labelName: "Payments Details", labelKey: "PAYMENT DETAILS" },
            { labelName: "Documents", labelKey: "DOCUMENTS" },
            { labelName: "Summary", labelKey: "SUMMARY" },]

            
    }

    componentDidMount = async () => {

        let requestBody = {
            MdmsCriteria:{
                tenantId: commonConfig.tenantId,
            moduleDetails: [
                {
                    "moduleName": "BillingService",
                    "masterDetails": [
                        {
                            "name": "TaxHeadMaster"
                        }
                    ]
                }
            ]
        }
        }


        let hereFcCharges = await httpRequest(
            "egov-mdms-service/v1/_search",
            "_search", [],
            requestBody
          );
        console.log("hereFcCharges--",hereFcCharges)  


        let TaxHeadMaster = hereFcCharges.MdmsRes.BillingService.TaxHeadMaster
        console.log("TaxHeadMaster--",TaxHeadMaster)
        var arrayName = [];
        arrayName.push(hereFcCharges.MdmsRes.BillingService.TaxHeadMaster)
        console.log("arrayName--",arrayName)

        let IndexfCharges;
        if (arrayName && arrayName.length > 0) {
          arrayName.forEach((item) => {
            item.forEach((value) => {
              if (value.code == "FACILITATION_CHARGE") { 
                IndexfCharges = value
              }
            })
          })
        }
     console.log("fCharges--inindexPage--",IndexfCharges)

   let testFcharges = IndexfCharges && IndexfCharges.facilitationCharge ? IndexfCharges.facilitationCharge : "valueNotsetYet"
   console.log("testFcharges--",testFcharges)
     this.setState({
        NewfCharges : testFcharges
     })    
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
            step: step - 4
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
    console.log("fchargesInshowStep--",this.state.NewfCharges)
        let { step, firstName, transactionDate, transactionNumber, bankName, paymentMode,
            BankAccountName,NomineeName,BankAccountNumber,IFSCCode,AccountHolderName,
            lastName, utGST, cGST, GSTnumber, type, jobTitle, facilitationCharges, surcharge,DiscountReason,
            jobCompany, approverName, comment, jobLocation, mobileNo, email,fCharges,
            dimension, cleaningCharges, houseNo, rent, purpose, locality, residenials, discountType,NewfCharges,accountType } = this.state;
            let fc = fCharges?fCharges.facilitationCharge:'100';
 var facCharges = NewfCharges !== "valueNotsetYet" && NewfCharges !== undefined && NewfCharges !== null && NewfCharges !== ""? NewfCharges : fc

      let bookingData = this.props.stateData.screenConfiguration.preparedFinalObject ? this.props.stateData.screenConfiguration.preparedFinalObject.availabilityCheckData:""
      console.log("bookingData.bkFromDate--",bookingData.bkFromDate)  
      console.log("bookingData.bkToDate--",bookingData.bkToDate)  
        let vanueData = this.props.stateData.screenConfiguration.preparedFinalObject ? this.props.stateData.screenConfiguration.preparedFinalObject.bkBookingData:""
        console.log("vanueData--",vanueData)
        let { fromDate, toDate, location, amount, finalRent } = this.state;
        console.log("ApplyParkState--",this.state)
        let paccDate = this.props.stateData.screenConfiguration.preparedFinalObject ? this.props.stateData.screenConfiguration.preparedFinalObject.DisplayPacc : '';
        let daysCount = this.calculateBetweenDaysCount(
            bookingData ? bookingData.bkFromDate: "",
            bookingData ? bookingData.bkToDate: ""
        );
        console.log("totalDays--",daysCount ? daysCount :"")
        let venueType = vanueData ? vanueData.venueType: "";
        console.log("venueType--",venueType)
        let bokingType = bookingData ? bookingData.bkBookingVenue : ""
        console.log("bokingType--",bokingType)
        console.log("vanueData.rent--",vanueData ? vanueData.rent :"")
        console.log("vanueData.cleaningCharges--",vanueData && vanueData.cleaningCharges || "")


    //     let tAmount = vanueData ? Number(vanueData.rent) + Number(vanueData.cleaningCharges) : ""
    //    console.log("tAmount--",tAmount)
let vrent = Number(vanueData.rent);

        let totalAmount1 = vrent * daysCount;
       console.log("totalAmount--with-Number-of-Days",totalAmount1)
        if (discountType == '100%' || discountType == "KirayaBhog" || discountType == "ReligiousFunction") {
            totalAmount1 = 0;
        } else if (discountType == '50%') {
            let discount = (50 * Number(totalAmount1)) / 100;
            console.log("discount--50",discount)
            totalAmount1 = Number(totalAmount1) - discount;
            console.log("totalAmount-After-discount--",totalAmount1)
        } else if (discountType == '20%') {
            let discount = (20 * Number(totalAmount1)) / 100;
            console.log("discount--20",discount)
            totalAmount1 = Number(totalAmount1) - discount;
            console.log("totalAmount--",totalAmount1)

        } else {
            totalAmount1 = totalAmount1;
            console.log("totalAmount-in-else--",totalAmount1)
        }
        if (paccDate) {
           
            fromDate = paccDate.bkDisplayFromDateTime;
            console.log("fromDate--paccDate",fromDate)
            toDate = paccDate.bkDisplayToDateTime;
            console.log("toDate--paccDate",toDate)
        }
        else {
            fromDate = moment(bookingData.bkFromDate).format("YYYY-MM-DD");
            console.log("fromDate--moment",fromDate)
            toDate = moment(bookingData.bkToDate).format("YYYY-MM-DD");
            console.log("toDate--moment",toDate)
        }

        if(location == ''){
            location = bookingData.bkLocation;
            console.log("location--",location)
        }
        amount = vanueData.amount;
let displayRefundAmount =   vanueData!== undefined && vanueData!== null ? (vanueData.refundabelSecurity !== undefined && vanueData.refundabelSecurity !== null ? (vanueData.refundabelSecurity) : "") : ""
console.log("typesOfdisplayRefundAmount-",typeof(displayRefundAmount))  
let NumberRefundAmount = Number(displayRefundAmount);

// rent = totalAmount;
        cleaningCharges = Number(vanueData.cleaningCharges);
        let RentPlusCcharges = Number(cleaningCharges) + Number(totalAmount1);
        console.log("RentPlusCcharges--",RentPlusCcharges)
        console.log("vanueData.utgstRate--",vanueData.utgstRate)
        console.log("vanueData.cgstRate--",vanueData.cgstRate)
        utGST = (Number(RentPlusCcharges) * Number(vanueData.utgstRate)) / 100
        console.log("utGST--",utGST)
       
        cGST = (Number(RentPlusCcharges) * Number(vanueData.cgstRate)) / 100
        console.log("cGST--",cGST)

        locality = vanueData.sector;
        console.log("locality--",locality)
        // surcharge = (Number(totalAmount) * Number(vanueData.surcharge)) / 100
        let Newsurcharge = Number(utGST) + Number(cGST)
        console.log("Newsurcharge--",Newsurcharge)
        console.log("typeofNewsurcharge--",typeof(Newsurcharge))
        surcharge = Number(Newsurcharge)
        console.log("surcharge--",surcharge)
       
        dimension = vanueData.dimensionSqrYards;
        console.log("dimension--",dimension)
        // facilitationCharges = (Number(totalAmount) * Number(vanueData.facilitationCharges)) / 100
        // console.log("facilitationCharges--",facilitationCharges)
        let typefc = typeof(facCharges)
        console.log("typefc--",typefc)
        let conFc = Number(facCharges)
        let showAmount;
        // finalRent = totalAmount + surcharge + utGST + cGST + conFc
        finalRent = RentPlusCcharges + utGST + cGST + conFc;
        console.log("finalAmount--for--paymentPage--",finalRent)
//
        let checkOne = Number.isNaN(finalRent)
        if(checkOne == false){
            showAmount = finalRent
        }
        console.log("showAmount",showAmount)
        let finalRent1 = Number(finalRent)

        let RefundPlusAllRent = finalRent1 + NumberRefundAmount;
        console.log("RefundPlusAllRent--",RefundPlusAllRent)
        console.log("RefundPlusAllRenttypeof",typeof(RefundPlusAllRent))
        console.log("finalRent1--",finalRent1)

        let RefundPlusAllRentNum = Number(RefundPlusAllRent)
        console.log("RefundPlusAllRentNum",RefundPlusAllRentNum)
        let fixedRefundPlusAllRentNum = RefundPlusAllRentNum.toFixed()
console.log("fixedRefundPlusAllRentNum--",fixedRefundPlusAllRentNum)
        let VfinalAmount = finalRent1.toFixed()
        console.log("VfinalAmount--",VfinalAmount)
        let propsData = this.props
        if (step === 0)
            return (<PersonalInfo
                nextStep={this.nextStep}
                handleChange={this.handleChange}
                firstName={firstName}    
                lastName={lastName}
                email={email}
                mobileNo={mobileNo}
                houseNo={houseNo}
                handleChangeDiscount={this.handleChangeDiscount}
                discountType={discountType}
                DiscountReason={DiscountReason}
            />);
        if (step === 1)
            return (<BookingDetails
                houseNo={houseNo}
                refundAbleAmount={displayRefundAmount}
                handleChangeDiscount={this.handleChangeDiscount}
                discountType={discountType}
                onFromDateChange={this.onFromDateChange}
                onToDateChange={this.onToDateChange}
                fromDate={fromDate}
                toDate={toDate}
                dimension={dimension}
                 location={location}
                cleaningCharges={cleaningCharges}
                purpose={purpose}
                rent={vrent}
                utGST={utGST}
                cGST={cGST}
                GSTnumber={GSTnumber}
                surcharge={surcharge}
                facilitationCharges={facilitationCharges}
                residenials={residenials}
                locality={locality}
                nextStep={this.nextStep}
                prevStep={this.prevStep}
                handleChange={this.handleChange}
                jobTitle={jobTitle}
                jobCompany={jobCompany}
                jobLocation={jobLocation}
                approverName={approverName}
                comment={comment}
                type={type}
            />);
        if (step === 2)
            return (<BankDetails
                nextStep={this.nextStep}
                handleChange={this.handleChange}
                BankAccountName={BankAccountName}    
                NomineeName={NomineeName}
                BankAccountNumber={BankAccountNumber}
                IFSCCode={IFSCCode}
                AccountHolderName={AccountHolderName}
                accountType={accountType}
                AccountType={this.AccountType}
                nextStep={this.nextStep}
                prevStep={this.prevStep}
            />);

        // if (step === 3)
        //     return (<ParkPaymentDetails
        //         nextStep={this.nextStep}
        //         prevStep={this.prevStep}
        //         handleChange={this.handleChange}
        //         showAmount={showAmount}
        //         transactionNumber={transactionNumber}
        //         transactionDateChange={this.transactionDateChange}
        //         bankName={bankName}
        //         paymentMode={paymentMode}
        //         amount={VfinalAmount}
        //         finalRent={finalRent}
        //         transactionDate={transactionDate}
        //         discountType={discountType}
        //         // rent={VfinalAmount}  
        //         rent={fixedRefundPlusAllRentNum}
        //         facilitationCharges={facilitationCharges}
        //     />);

        if (step === 3)
            return (<DocumentDetails
                nextStep={this.nextStep}
                rent={vrent}
                prevStep={this.prevStep}
                handleChange={this.handleChange}
                firstName={firstName}
                lastName={lastName}
                email={email}
                mobileNo={mobileNo}
            />);
        if (step === 4)
            return (<SummaryInfo

                bookingData={bookingData}
                venueType={venueType}
                bokingType={bokingType}
                discountType={discountType}
                accountType={accountType}
                approverName={approverName}
                amount={amount}
                bankName={bankName}
                transactionDate={transactionDate}
                transactionNumber={transactionNumber}
                paymentMode={paymentMode}
                comment={comment} 
                BankAccountName={BankAccountName}  //start for bank details 
                NomineeName={NomineeName} 
                BankAccountNumber={BankAccountNumber}
                IFSCCode={IFSCCode}
                AccountHolderName={AccountHolderName}
                firstName={firstName} //start of application details
                purpose={purpose}
                utGST={utGST}
                cGST={cGST}
                lastName={lastName}
                jobTitle={jobTitle}
                jobCompany={jobCompany}
                jobLocation={jobLocation}
                prevStep={this.prevStep}
                mobileNo={mobileNo}
                email={email}
                houseNo={houseNo}
                DiscountReason={DiscountReason}
                dimension={dimension}
                location={location}
                cleaningCharges={cleaningCharges}
                type={type}
                rent={vrent}
                fromDate={fromDate}
                toDate={toDate}
                GSTnumber={GSTnumber}
                surcharge={surcharge}
                facilitationCharges={facilitationCharges}
                locality={locality}
                residenials={residenials}
                {...propsData}
                firstStep={this.firstStep}
            />);
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
    const { complaints, common, auth, form, bookings} = state;
    // const {arrayName} = bookings;
    const { facilationChargesSuccess, arrayName } = bookings;
  let fromDateone = state.screenConfiguration.preparedFinalObject ? state.screenConfiguration.preparedFinalObject.availabilityCheckData : "one"
  let bookingOne = state.screenConfiguration.preparedFinalObject ? state.screenConfiguration.preparedFinalObject.bkBookingData:"two"
  let stateData = state;
  let Previousdiscount = "NotFound"
//   let appData = state.bookings.applicationData ? state.bookings.applicationData.bookingsModelList[0] : ""
//   console.log("appData--",appData)

  let appData = state.bookings ? (state.bookings.applicationData !== undefined && state.bookings.applicationData !== null ? state.bookings.applicationData.bookingsModelList.length > 0 ?(state.bookings.applicationData.bookingsModelList[0]) :'NA' : 'NA'): 'NA'
  console.log("appData--",appData)

  if(appData !== undefined && appData !== null && appData !== 'NA'){
     if(appData.discount == 0){
        Previousdiscount = "General"
     } 
     if(appData.discount == 50){
        Previousdiscount = "50%"
     }
     if(appData.discount == 20){
        Previousdiscount = "50%"
     }
     if(appData.discount == 100){
        Previousdiscount = "100%"
     }
  }
  
  
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

    return {
        stateData,
        fromDateone,
        bookingOne,
        fCharges,
        appData,
        Previousdiscount
    }
}

// const mapDispatchToProps = dispatch => {
//     return {
//       fetchfacilationCharges: () => dispatch(fetchfacilationCharges()),  
//     }
//   }

export default connect(
    mapStateToProps,
    null
)(StepForm);
