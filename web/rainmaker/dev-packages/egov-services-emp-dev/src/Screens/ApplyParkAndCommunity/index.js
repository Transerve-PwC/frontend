import React, { Component } from 'react';
import PersonalInfo from './components/ApplicatDetails';
import BookingDetails from './components/BookingDetails';
import SummaryInfo from './components/SummaryDetails';
import DocumentDetails from './components/DocumentsDetails';
import ParkPaymentDetails from './components/PaccPaymentDetails'
import fetchfacilationCharges from 'egov-ui-kit/redux/bookings/actions'
import { connect } from "react-redux";
import get from "lodash/get";
import moment from 'moment';

import { Box, Button, Card, CardContent, CircularProgress, Grid, Step, StepLabel, Stepper } from '@material-ui/core';

export class StepForm extends Component {


/* 
 childrenArray: [
            { labelName: "Applicant Details", labelKey: "BK_MYBK_PCC_EMP_APPLICANT_DETAILS" },
            { labelName: "Booking Details", labelKey: "BK_MYBK_PCC_EMP_BOOKING_DETAILS" },
            { labelName: "Payments Details", labelKey: "BK_PCC_PAYMENT_DETAILS" },
            { labelName: "Documents", labelKey: "BK_MYBK_PCC_EMP_DOCUMENTS" },
            { labelName: "Summary", labelKey: "BK_MYBK_PCC_EMP_SUMMARY" },]

*/

    state = {
        step: 0,
        firstName: '',
        lastName: '',
        email: '',
        mobileNo: '',
        jobTitle: '',
        jobCompany: '',
        jobLocation: '',
        houseNo: '',
        purpose: '',
        locality: '',
        residenials: '',
        approverName: '',
        comment: '',
        dimension: '',
        location: '',
        cleaningCharges: '',
        rent: '',
        facilitationCharges: '',
        surcharge: '', utGST: '', cGST: '',
        GSTnumber: '', type: '',
        fromDate: '', finalRent: '',
        toDate: '', transactionNumber: '', bankName: '', paymentMode: '', amount: '', transactionDate: '', discountType: 'General',
        childrenArray: [
            { labelName: "Applicant Details", labelKey: "APPLICANT DETAILS" },
            { labelName: "Booking Details", labelKey: "BOOKING DETAILS" },
            { labelName: "Payments Details", labelKey: "PAYMENT DETAILS" },
            { labelName: "Documents", labelKey: "DOCUMENTS" },
            { labelName: "Summary", labelKey: "SUMMARY" },]

    }
    // childrenArray: [{ label: "APPLICANT DETAILS" }, { label: "BOOKING DETAILS" },{ label: "PAYMENT DETAILS" },{ label: "DOCUMENTS" }, { label: "SUMMARY" }]
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
        this.setState({ discountType: event.target.value });
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

        // const {facilationChargesSuccess} = this.props;

        let { step, firstName, transactionDate, transactionNumber, bankName, paymentMode,
            lastName, utGST, cGST, GSTnumber, type, jobTitle, facilitationCharges, surcharge,
            jobCompany, approverName, comment, jobLocation, mobileNo, email,
            dimension, cleaningCharges, houseNo, rent, purpose, locality, residenials, discountType } = this.state;
       console.log("propsInshowStep--",this.props)

        let bookingData = this.props.stateData.screenConfiguration.preparedFinalObject ? this.props.stateData.screenConfiguration.preparedFinalObject.availabilityCheckData:""
        let vanueData = this.props.stateData.screenConfiguration.preparedFinalObject ? this.props.stateData.screenConfiguration.preparedFinalObject.bkBookingData:""
        let { fromDate, toDate, location, amount, finalRent } = this.state;
        let paccDate = this.props.stateData.screenConfiguration.preparedFinalObject ? this.props.stateData.screenConfiguration.preparedFinalObject.DisplayPacc : '';
        let daysCount = this.calculateBetweenDaysCount(
            bookingData ? bookingData.bkFromDate: "",
            bookingData ? bookingData.bkToDate: ""
        );
        let venueType = vanueData.venueType;
        let bokingType = bookingData ? bookingData.bkBookingVenue : ""
        console.log(bookingData, "bookingData in first", 'vanueData', vanueData);
        let tAmount = Number(vanueData.rent) + Number(vanueData.cleaningCharges);
        let totalAmount = tAmount * daysCount;

        if (discountType == '100%' || discountType == "KirayaBhog" || discountType == "ReligiousFunction") {
            totalAmount = 0;
        } else if (discountType == '50%') {
            let discount = (50 * Number(totalAmount)) / 100;
            totalAmount = Number(totalAmount) - discount;
        } else if (discountType == '20%') {
            let discount = (20 * Number(totalAmount)) / 100;
            totalAmount = Number(totalAmount) - discount;

        } else {
            totalAmount = totalAmount;
        }
        //   console.log("paccDate=======",paccDate)      
        if (paccDate) {
            // console.log(" i paccDate",paccDate.bkDisplayFromDateTime)
            fromDate = paccDate.bkDisplayFromDateTime;
            toDate = paccDate.bkDisplayToDateTime;
        }
        else {
            fromDate = moment(bookingData.bkFromDate).format("YYYY-MM-DD");
            toDate = moment(bookingData.bkToDate).format("YYYY-MM-DD");
        }
        location = bookingData.bkLocation;
        amount = vanueData.amount;
        rent = totalAmount;
        cleaningCharges = Number(vanueData.cleaningCharges) * daysCount;

        utGST = (Number(totalAmount) * Number(vanueData.utgstRate)) / 100
        cGST = (Number(totalAmount) * Number(vanueData.cgstRate)) / 100
        locality = vanueData.sector;

        surcharge = (Number(totalAmount) * Number(vanueData.surcharge)) / 100
        dimension = vanueData.dimensionSqrYards;
        console.log('facilitationCharges in apply', facilitationCharges)
        finalRent = totalAmount + surcharge + utGST + cGST + facilitationCharges;
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
            />);


        if (step === 1)
            return (<BookingDetails
                houseNo={houseNo}
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
                rent={rent}
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
            return (<ParkPaymentDetails
                nextStep={this.nextStep}
                prevStep={this.prevStep}
                handleChange={this.handleChange}
                transactionNumber={transactionNumber}
                transactionDateChange={this.transactionDateChange}
                bankName={bankName}
                paymentMode={paymentMode}
                amount={amount}
                finalRent={finalRent}
                transactionDate={transactionDate}
                discountType={discountType}
                rent={rent}
                facilitationCharges={facilitationCharges}
            />);

        if (step === 3)
            return (<DocumentDetails
                nextStep={this.nextStep}
                rent={rent}
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
                approverName={approverName}
                amount={amount}
                bankName={bankName}
                transactionDate={transactionDate}
                transactionNumber={transactionNumber}
                paymentMode={paymentMode}
                comment={comment}
                firstName={firstName}
                purpose={purpose}
                utGST={utGST}
                lastName={lastName}
                jobTitle={jobTitle}
                jobCompany={jobCompany}
                jobLocation={jobLocation}
                prevStep={this.prevStep}
                mobileNo={mobileNo}
                email={email}
                houseNo={houseNo}
                dimension={dimension}
                location={location}
                cleaningCharges={cleaningCharges}
                type={type}
                rent={rent}
                cGST={cGST}
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
    console.log("fromDateone,bookingOne---",fromDateone,bookingOne)
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
    const {arrayName} = bookings;
    console.log('state--->>apply',state)
  let fromDateone = state.screenConfiguration.preparedFinalObject ? state.screenConfiguration.preparedFinalObject.availabilityCheckData : "one"
  console.log("fromDateone1--",fromDateone)
  let bookingOne = state.screenConfiguration.preparedFinalObject ? state.screenConfiguration.preparedFinalObject.bkBookingData:"two"
//   const {facilationChargesSuccess} = bookings;
//   console.log("facilationChargesSuccess--",facilationChargesSuccess)
  let stateData = state;

    return {
        stateData,
        fromDateone,
        bookingOne,
        arrayName
        // facilationChargesSuccess
    }
}
export default connect(
    mapStateToProps,
    null
)(StepForm);
