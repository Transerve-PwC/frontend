import React, { Component } from 'react';
import { Tabs, Card, TextField, Icon, Button } from "components";
import Label from "egov-ui-kit/utils/translationNode";
import { createWaterTankerApplication } from  "../../../../redux/bookings/actions";
import { connect } from "react-redux";
import { toggleSnackbarAndSetText } from "egov-ui-kit/redux/app/actions";
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import EditIcon from '@material-ui/icons/Edit';
import "./index.css";
class SummaryDetails extends Component {

    submit = e => {
       
        let { createWaterTankerApplication , userInfo} = this.props;
        const { firstName,approverName,comment, email, mobileNo, houseNo, address, locality, residenials } = this.props;
        let Booking = {
            "bkApproverName":approverName,
            "bookingsRemarks": [{"bkRemarks": comment}],
            "comment":comment,
            "action":"DELIVER",
            "bkApplicantName": firstName,
            "bkMobileNumber": mobileNo,
            "bkEmail": email,
            "bkHouseNo": houseNo,
            "bkCompleteAddress": address,
            "bkSector": locality,
            "bkType": residenials,
            "bkDate": "",
            "bkTime": "",
            "bkStatus": "Request due to water supply failure",
            "bkBookingType": "WATER_TANKERS",
            "tenantId": userInfo.tenantId,
            "bkAction": "DELIVER",
            "businessService": "BWT"
        }
        createWaterTankerApplication(
            {
                "applicationType": "BWT",
                "applicationStatus": "",
                "applicationId": null,
                "tenantId": userInfo.tenantId,
                "Booking": Booking
            });
            this.props.history.push(`/egov-services/create-success`);

    }

    firstStep = e => {
        e.preventDefault();
        this.props.firstStep();

    }


    back = e => {
        e.preventDefault();
        this.props.prevStep();
    }
    render() {
        const { firstName,approverName,comment, email, mobileNo, houseNo, address, locality, residenials, propsData } = this.props;
        return (
            <div>
<div classsName="container">
                    <div className="col-xs-12">
                        <button
                            style={{ color: "#FE7A51", border: "none", outline: "none", fontWeight: "500", float: 'right', marginRight: '50px', marginTop: '40px', background: "#f9f6f6" }}
                            onClick={this.firstStep}>
                            <EditIcon />
                            <h5 style={{ fontSize: "14px", marginTop: "-27px", marginBottom: "15px", marginLeft: "59px" }}>
                                EDIT
                    </h5>
                        </button>
                    </div>
                </div>



                {/* <div classsName="container">
                <div className="col-xs-12">
                  <button
                        style={{ float: 'right', marginRight: '50px', marginTop: '40px' }}
                        primary={true}
                        onClick={this.firstStep}
                        className="ViewDetailButton"
                    >EDIT</button>
                </div>
                </div> */}
                <div style={{marginLeft: "20px", paddingBottom: '5px',paddingLeft:25}}>
                    <Label label="BK_MYBK_APPLICANT_DETAILS" labelClassName="dark-heading" />
                </div>

                <div className="col-xs-12" style={{ paddingBottom: '50px',paddingLeft:25 }}>
                    <div className="col-sm-12 col-xs-12">

                        <div className="complaint-detail-detail-section-status row">
                            <div className="col-md-4">
                                <Label className="col-xs-12  col-sm-12 col-md-12 status-color" label="BK_MYBK_APPLICANT_NAME" />
                                <Label
                                    labelStyle={{ color: "inherit" }}
                                    className="col-xs-12  col-sm-12 col-md-12  status-result-color"
                                    id="complaint-details-complaint-number"
                                    label={firstName}
                                />
                            </div>
                            <div className="col-md-4">
                                <Label className="col-xs-12  col-sm-12 col-md-12 status-color" label="BK_MYBK_APPLICANT_DETAILS_EMAIL" />
                                <Label
                                    className="col-xs-12  col-sm-12 col-md-12  status-result-color"
                                    id="complaint-details-current-status"
                                    labelStyle={{ color: "inherit" }}
                                    label={email}
                                />
                            </div>
                            <div className="col-md-4">
                                <Label className="col-xs-12  col-sm-12 col-md-12 status-color" label="BK_MYBK_APPLICANT_MOBILENUMBER" />
                                <Label
                                    className="col-xs-12  col-sm-12 col-md-12  status-result-color"
                                    id="complaint-details-current-status"
                                    labelStyle={{ color: "inherit" }}
                                    label={mobileNo}
                                />
                            </div>
                        </div>
                    </div>
                </div>




                <div style={{ marginLeft: "45px", paddingBottom: '5px', marginTop: 10 }} >
                    <Label label="BK_MYBK_APPLICANTION_DETAILS" labelClassName="dark-heading" />
                </div>
                <div className="col-xs-12" style={{marginLeft: '10px'}}>
                    <div className="col-sm-12 col-xs-12" style={{ marginBottom: '90px' }}>

                        <div className="complaint-detail-detail-section-status row">
                            <div className="col-md-4">
                                <Label className="col-xs-12  col-sm-12 col-md-12 status-color" label="BK_MYBK_APPLICANT_NAME" />
                                <Label
                                    labelStyle={{ color: "inherit" }}
                                    className="col-xs-12  col-sm-12 col-md-12  status-result-color"
                                    id="complaint-details-complaint-number"
                                    label={firstName}
                                />
                            </div>
                            <div className="col-md-4">
                                <Label className="col-xs-12  col-sm-12 col-md-12 status-color" label="BK_MYBK_APPLICANT_DETAILS_EMAIL" />
                                <Label
                                    className="col-xs-12  col-sm-12 col-md-12  status-result-color"
                                    id="complaint-details-current-status"
                                    labelStyle={{ color: "inherit" }}
                                    label={email}
                                />
                            </div>
                            <div className="col-md-4">
                                <Label className="col-xs-12  col-sm-12 col-md-12 status-color" label="BK_MYBK_APPLICANT_MOBILENUMBER" />
                                <Label
                                    className="col-xs-12  col-sm-12 col-md-12  status-result-color"
                                    id="complaint-details-current-status"
                                    labelStyle={{ color: "inherit" }}
                                    label={mobileNo}
                                />
                            </div>
                            <div className="col-md-4">
                                <Label className="col-xs-12  col-sm-12 col-md-12 status-color" label="BK_MY_BK_HOUSE_NO_LABEL" />
                                <Label
                                    className="col-xs-12  col-sm-12 col-md-12  status-result-color"
                                    id="complaint-details-current-status"
                                    labelStyle={{ color: "inherit" }}
                                    label={houseNo}
                                />
                            </div>

                            <div className="col-md-4">
                                <Label className="col-xs-12  col-sm-12 col-md-12 status-color" label="BK_MYBK_APPLICANT_ADDRESS" />
                                <Label
                                    className="col-xs-12  col-sm-12 col-md-12  status-result-color"
                                    id="complaint-details-current-status"
                                    labelStyle={{ color: "inherit" }}
                                    label={address}
                                />
                            </div>

                            <div className="col-md-4">
                                <Label className="col-xs-12  col-sm-12 col-md-12 status-color" label="BK_MYBK_APPLICANT_SECTOR" />
                                <Label
                                    className="col-xs-12  col-sm-12 col-md-12  status-result-color"
                                    id="complaint-details-current-status"
                                    labelStyle={{ color: "inherit" }}
                                    label={locality}
                                />
                            </div>
                            <div className="col-md-4">
                                <Label className="col-xs-12  col-sm-12 col-md-12 status-color" label="BK_MYBK_APPLICANT_RESIDENTAILSTYPE" />
                                <Label
                                    className="col-xs-12  col-sm-12 col-md-12  status-result-color"
                                    id="complaint-details-current-status"
                                    labelStyle={{ color: "inherit" }}
                                    label={residenials}
                                />
                            </div>
                            <div className="col-md-4">
                                <Label className="col-xs-12  col-sm-12 col-md-12 status-color" label="BK_MYBK_CREATE_APPROVER_NAME" />
                                <Label
                                    className="col-xs-12  col-sm-12 col-md-12  status-result-color"
                                    id="complaint-details-current-status"
                                    labelStyle={{ color: "inherit" }}
                                    label={approverName}
                                />
                            </div>
                            <div className="col-md-4">
                                <Label className="col-xs-12  col-sm-12 col-md-12 status-color" label="BK_MYBK_CREATE_COMMENT" />
                                <Label
                                    className="col-xs-12  col-sm-12 col-md-12  status-result-color"
                                    id="complaint-details-current-status"
                                    labelStyle={{ color: "inherit" }}
                                    label={comment}
                                />
                            </div>

                            <div className="col-md-4">
                                <Label className="col-xs-12  col-sm-12 col-md-12 status-color" label="BK_MYBK_TYPE_OF_REQUEST" />
                                <Label
                                    className="col-xs-12  col-sm-12 col-md-12  status-result-color"
                                    id="complaint-details-current-status"
                                    labelStyle={{ color: "inherit" }}
                                    label="BK_MYBK_WATER_TANKER_REQUEST"
                                />
                            </div>
                        </div>
                    </div>
                </div>
               
                <div className="responsive-action-button-cont">
                    <Button
                         className="responsive-action-button"
                        primary={true}
                        label={<Label buttonLabel={true} label="BK_CORE_COMMON_GOBACK" />}
                        fullWidth={true}
                        onClick={this.back}
                        style={{ marginRight: 18 }}
                        startIcon={<ArrowBackIosIcon />}
                    />


                    <Button
                        className="responsive-action-button"
                        primary={true}
                        label={<Label buttonLabel={true} label="BK_CORE_COMMON_SUBMIT" />}
                        fullWidth={true}
                        onClick={this.submit}
                     style={{rightIcon:"arrow_drop_down"}}
                    />
                </div>
               


            </div>
        );
    }
}

const mapStateToProps = state => {

    const { bookings, common, auth, form } = state;
    const { createWaterTankerApplicationData } = bookings;
    return {
        createWaterTankerApplicationData
    }

}
const mapDispatchToProps = dispatch => {
    return {

        createWaterTankerApplication: criteria => dispatch(createWaterTankerApplication(criteria)),
        toggleSnackbarAndSetText: (open, message, error) =>
            dispatch(toggleSnackbarAndSetText(open, message, error)),
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SummaryDetails);