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
import { httpRequest } from "egov-ui-kit/utils/api";
import Label from "egov-ui-kit/utils/translationNode";
import { Box, Button, Card, CardContent, CircularProgress, Grid, Step, StepLabel, Stepper } from '@material-ui/core';
import commonConfig from "config/common.js";


export class StepForm extends Component {
// this.props.appData &&  this.props.appData.bkApplicantName ||  "" 

    state = {
        step: 0,
        firstName: '',
        lastName: '',
        email: '',
        mobileNo: '',
        jobTitle: '',
        jobCompany: '',
        jobLocation: '',
        completeAddress: '',
        FatherName:'',
        purpose: '',
        cgCategoryType:'',
        cgBookingVenue:'',
        locality: '',
        residenials: '',
        approverName: '',//bkBookingPurpose
        comment: '',
        dimension: '',
        location: '',
        cleaningCharges: '',
        rent: '',
        facilitationCharges: '',
        NewfCharges: '',
        surcharge: '', utGST: '', cGST: '',
        GSTnumber: this.props.appData &&  this.props.appData.bkCustomerGstNo ||  "", type: '',
        fromDate: '', finalRent: '',
        toDate: '', transactionNumber: '', bankName: '', paymentMode: '', amount: '', transactionDate: '', discountType: 'General',          
        childrenArray: [
            { labelName: "Applicant Details", labelKey: "APPLICANT DETAILS" },
            { labelName: "Booking Details", labelKey: "BOOKING DETAILS" },
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
            completeAddress,FatherName,cgBookingVenue,cgCategoryType,
            lastName, utGST, cGST, GSTnumber, type, jobTitle, facilitationCharges, surcharge,
            jobCompany, approverName, comment, jobLocation, mobileNo, email,fCharges,
            dimension, cleaningCharges, houseNo, rent, purpose, locality, residenials, discountType,NewfCharges } = this.state;
            let fc = fCharges?fCharges.facilitationCharge:'100';

            let { fromDate, toDate, location, amount, finalRent } = this.state;

        if (step === 0)
            return (<PersonalInfo
                nextStep={this.nextStep}
                handleChange={this.handleChange}
                firstName={firstName}
                lastName={lastName}
                email={email}
                mobileNo={mobileNo}
                completeAddress={completeAddress}
                FatherName={FatherName}
                handleChangeDiscount={this.handleChangeDiscount}
            />);


        if (step === 1)
            return (<BookingDetails
                onFromDateChange={this.onFromDateChange}
                onToDateChange={this.onToDateChange}
                purpose={purpose}
                cgCategoryType={cgCategoryType}
                cgBookingVenue={cgBookingVenue}
                nextStep={this.nextStep}
                prevStep={this.prevStep}
                handleChange={this.handleChange}
            />);
        if (step === 2)
            return (<DocumentDetails
                nextStep={this.nextStep}
                prevStep={this.prevStep}
                handleChange={this.handleChange}
                firstName={firstName}
                lastName={lastName}
                email={email}
                mobileNo={mobileNo}
            />);
        if (step === 3)
            return (<SummaryInfo
                firstName={firstName}
                purpose={purpose}
                cgBookingVenue={cgBookingVenue}
                cgCategoryType={cgCategoryType}
                prevStep={this.prevStep}
                mobileNo={mobileNo}
                email={email}
                completeAddress={completeAddress}
                FatherName={FatherName}
                dimension={dimension}
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

  let appData = state.bookings.applicationData ? state.bookings.applicationData.bookingsModelList[0] : ""
  console.log("appData--",appData)

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
        appData
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
