import React, { Component } from 'react';
import PersonalInfo from './components/ApplicatDetails';
import JobDetails from './components/BookingDetails';
import AllInfo from './components/SummaryDetails';
import Label from "egov-ui-kit/utils/translationNode";
import { Box, Button, Card, CardContent, CircularProgress, Grid, Step, StepLabel, Stepper } from '@material-ui/core';

export class StepForm extends Component {
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
        address: '',
        locality: '',
        residenials: '',
        approverName:'',
        comment:'',
        childrenArray: [{ label: "APPLICANT DETAILS" }, { label: "BOOKING DETAILS" }, { label: "SUMMARY" }]

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
            step: step - 2
        });
    }
    

    handleChange = input => e => {
        this.setState({ [input]: e.target.value });
    }

    showStep = () => {
        const { step, firstName, lastName, jobTitle, jobCompany, approverName,comment,jobLocation, mobileNo, email, houseNo, address, locality, residenials } = this.state;
        let propsData =this.props
        if (step === 0)
            return (<PersonalInfo
                nextStep={this.nextStep}
                handleChange={this.handleChange}
                firstName={firstName}
                lastName={lastName}
                email={email}
                mobileNo={mobileNo}
            />);
        if (step === 1)
            return (<JobDetails
                houseNo={houseNo}
                address={address}
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
            />);
        if (step === 2)
            return (<AllInfo
                approverName={approverName}
                comment={comment}
                firstName={firstName}
                lastName={lastName}
                jobTitle={jobTitle}
                jobCompany={jobCompany}
                jobLocation={jobLocation}
                prevStep={this.prevStep}
                mobileNo={mobileNo}
                email={email}
                houseNo={houseNo}
                address={address}
                locality={locality}
                residenials={residenials}
                {...propsData}
                firstStep={this.firstStep}
            />);
    }

    render() {
        const { step } = this.state;

        return (
            <div>
            <div className="col-xs-12" style={{ padding: 0, float: 'left', width: '100%' }}>
              <div className="col-sm-12 col-xs-12">
                    <Stepper alternativeLabel activeStep={step}>
                        {this.state.childrenArray.map((child, index) => (
                            <Step key={child.label}>
                                <StepLabel>{child.label}</StepLabel>
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

export default StepForm;