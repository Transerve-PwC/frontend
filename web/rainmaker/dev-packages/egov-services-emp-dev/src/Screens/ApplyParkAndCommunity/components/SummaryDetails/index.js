import React, { Component } from 'react';
import { Tabs, Card, TextField, Icon, Button } from "components";
import Label from "egov-ui-kit/utils/translationNode";
import { createPACCApplication } from "../../../../redux/bookings/actions";
import { connect } from "react-redux";
import { toggleSnackbarAndSetText } from "egov-ui-kit/redux/app/actions";
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import EditIcon from '@material-ui/icons/Edit';
import "./index.css";
import Footer from "../../../../modules/footer"
class SummaryDetails extends Component {

    submit = e => {
        let { createPACCApplication } = this.props;
        const { firstName, email, mobileNo, surcharge, fromDate, toDate, utGST, cGST, GSTnumber, dimension, location, facilitationCharges, cleaningCharges, rent, houseNo, type, purpose, locality, residenials } = this.props;
        //    const { firstName,approverName,comment, email, mobileNo, houseNo, address, locality, residenials } = this.props;
        let Booking = {
            "bkBookingType": "Parks",
            "bkBookingVenue": "fabc3ff6-70d8-4ae6-8ac7-00c9c714c202",
            "bkApplicantName": "Sumit Kumar",
            "bkMobileNumber": "9138912806",
            "bkDimension": "1342",
            "bkLocation": "PARK NO 11 NEAR H NO 710 SEC 11 CHD",
            "bkFromDate": "2020-10-14",
            "bkToDate": "2020-10-17",
            "bkCleansingCharges": 4000,
            "bkRent": 9680,
            "bkSurchargeRent": 1742.4,
            "bkUtgst": 871.2,
            "bkCgst": 871.2,
            "bkSector": "SECTOR-11",
            "bkEmail": "test@gmail.com",
            "bkHouseNo": "548",
            "bkBookingPurpose": "test",
            "bkCustomerGstNo": "test",
            "wfDocuments": [{
                "fileStoreId": "0387281e-a040-49e7-af9d-99e9dac3a19d"
            }],
            "tenantId": "ch",
            "bkAction": "OFFLINEAPPLY",
            "businessService": "PACC",
            "financialYear": "2020-2021"
        }
        createPACCApplication(
            {
                "applicationType": "PACC",
                "applicationStatus": "",
                "applicationId": null,
                "tenantId": "ch",
                "Booking": Booking
            });
        // this.props.history.push("/egov-services/create-success");
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
        //const { firstName,approverName,comment, email, mobileNo, houseNo, address, locality, residenials, propsData } = this.props;

        const { firstName, email, mobileNo, locality, surcharge, fromDate, toDate,
            onFromDateChange, onToDateChange, utGST, cGST, GSTnumber, handleChange,bankName,amount,transactionDate,transactionNumber,paymentMode,
            dimension, location, facilitationCharges, cleaningCharges, rent, approverName, comment, houseNo, type, purpose, residenials } = this.props;
        return (
            <div>
                <div classsName="container">
                    <div className="col-xs-12">
                        <button
                            style={{ float: 'right', marginRight: '50px', marginTop: '40px' }}
                            primary={true}
                            onClick={this.firstStep}
                            className="ViewDetailButton"
                        >EDIT</button>
                    </div>
                </div>
                <div style={{ marginLeft: "20px", paddingBottom: '5px', paddingLeft: 25 }}>
                    <Label label="BK_MYBK_APPLICANT_DETAILS" labelClassName="dark-heading" />
                </div>

                <div className="col-xs-12" style={{ paddingBottom: '50px', paddingLeft: 25 }}>
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
                <div className="col-xs-12" style={{ marginLeft: '10px' }}>
                    <div className="col-sm-12 col-xs-12" style={{ marginBottom: '90px' }}>
                        <div className="complaint-detail-detail-section-status row">
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
                                <Label className="col-xs-12  col-sm-12 col-md-12 status-color" label="BK_MYBK_SURCHARGE" />
                                <Label
                                    className="col-xs-12  col-sm-12 col-md-12  status-result-color"
                                    id="complaint-details-current-status"
                                    labelStyle={{ color: "inherit" }}
                                    label={surcharge}
                                />
                            </div>
                            <div className="col-md-4">
                                <Label className="col-xs-12  col-sm-12 col-md-12 status-color" label="BK_UGST_NO_LABEL" />
                                <Label
                                    className="col-xs-12  col-sm-12 col-md-12  status-result-color"
                                    id="complaint-details-current-status"
                                    labelStyle={{ color: "inherit" }}
                                    label={utGST}
                                />
                            </div>
                            <div className="col-md-4">
                                <Label className="col-xs-12  col-sm-12 col-md-12 status-color" label="BK_MYBK_CGST" />
                                <Label
                                    className="col-xs-12  col-sm-12 col-md-12  status-result-color"
                                    id="complaint-details-current-status"
                                    labelStyle={{ color: "inherit" }}
                                    label={cGST}
                                />
                            </div>
                            <div className="col-md-4">
                                <Label className="col-xs-12  col-sm-12 col-md-12 status-color" label="BK_MYBK_GSTNUMBER_SECTOR" />
                                <Label
                                    className="col-xs-12  col-sm-12 col-md-12  status-result-color"
                                    id="complaint-details-current-status"
                                    labelStyle={{ color: "inherit" }}
                                    label={GSTnumber}
                                />
                            </div>
                            <div className="col-md-4">
                                <Label className="col-xs-12  col-sm-12 col-md-12 status-color" label="BK_MYBK_DIMENTION" />
                                <Label
                                    className="col-xs-12  col-sm-12 col-md-12  status-result-color"
                                    id="complaint-details-current-status"
                                    labelStyle={{ color: "inherit" }}
                                    label={dimension}
                                />
                            </div>
                            <div className="col-md-4">
                                <Label className="col-xs-12  col-sm-12 col-md-12 status-color" label="BK_MYBK_LOCATION" />
                                <Label
                                    className="col-xs-12  col-sm-12 col-md-12  status-result-color"
                                    id="complaint-details-current-status"
                                    labelStyle={{ color: "inherit" }}
                                    label={location}
                                />
                            </div>
                            <div className="col-md-4">
                                <Label className="col-xs-12  col-sm-12 col-md-12 status-color" label="BK_MYBK_FAC_CHARGES" />
                                <Label
                                    className="col-xs-12  col-sm-12 col-md-12  status-result-color"
                                    id="complaint-details-current-status"
                                    labelStyle={{ color: "inherit" }}
                                    label={facilitationCharges}
                                />
                            </div>
                           
                            <div className="col-md-4">
                                <Label className="col-xs-12  col-sm-12 col-md-12 status-color" label="BK_MYBK_RENT" />
                                <Label
                                    className="col-xs-12  col-sm-12 col-md-12  status-result-color"
                                    id="complaint-details-current-status"
                                    labelStyle={{ color: "inherit" }}
                                    label={rent}
                                />
                            </div>
                       
                        </div>
                    </div>
                </div>
                <div style={{ marginLeft: "45px", paddingBottom: '5px', marginTop: 10 }} >
                    <Label label="BK_MYBK_PAYMENT_DETAILS" labelClassName="dark-heading" />
                </div>
                <div className="col-xs-12" style={{ marginLeft: '10px' }}>
                    <div className="col-sm-12 col-xs-12" style={{ marginBottom: '90px' }}>
                        <div className="complaint-detail-detail-section-status row">
                        <div className="col-md-4">
                                <Label className="col-xs-12  col-sm-12 col-md-12 status-color" label="BK_MYBK_RENT" />
                                <Label
                                    className="col-xs-12  col-sm-12 col-md-12  status-result-color"
                                    id="complaint-details-current-status"
                                    labelStyle={{ color: "inherit" }}
                                    label={bankName}
                                />
                            </div>
                            <div className="col-md-4">
                                <Label className="col-xs-12  col-sm-12 col-md-12 status-color" label="BK_MYBK_AMOUNT" />
                                <Label
                                    className="col-xs-12  col-sm-12 col-md-12  status-result-color"
                                    id="complaint-details-current-status"
                                    labelStyle={{ color: "inherit" }}
                                    label={amount}
                                />
                            </div>
                            <div className="col-md-4">
                                <Label className="col-xs-12  col-sm-12 col-md-12 status-color" label="BK_MYBK_TRDATE" />
                                <Label
                                    className="col-xs-12  col-sm-12 col-md-12  status-result-color"
                                    id="complaint-details-current-status"
                                    labelStyle={{ color: "inherit" }}
                                    label={transactionDate}
                                />
                            </div>
                            <div className="col-md-4">
                                <Label className="col-xs-12  col-sm-12 col-md-12 status-color" label="BK_MYBK_TRNUMBER" />
                                <Label
                                    className="col-xs-12  col-sm-12 col-md-12  status-result-color"
                                    id="complaint-details-current-status"
                                    labelStyle={{ color: "inherit" }}
                                    label={transactionNumber}
                                />
                            </div>
                        
                            <div className="col-md-4">
                                <Label className="col-xs-12  col-sm-12 col-md-12 status-color" label="BK_MYBK_PMODE" />
                                <Label
                                    className="col-xs-12  col-sm-12 col-md-12  status-result-color"
                                    id="complaint-details-current-status"
                                    labelStyle={{ color: "inherit" }}
                                    label={paymentMode}
                                />
                            </div>
                        
                        </div>
                    </div>
                </div>
                <Footer className="apply-wizard-footer" style={{ display: 'flex', justifyContent: 'flex-end' }} children={
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
                            style={{ rightIcon: "arrow_drop_down" }}
                        />
                    </div>
                }></Footer>
            </div>
        );
    }
}

const mapStateToProps = state => {

    const { bookings, common, auth, form } = state;
    const { createPACCApplicationData } = bookings;
    console.log('createPACCApplicationData', createPACCApplicationData)
    return {
        createPACCApplicationData
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
)(SummaryDetails);