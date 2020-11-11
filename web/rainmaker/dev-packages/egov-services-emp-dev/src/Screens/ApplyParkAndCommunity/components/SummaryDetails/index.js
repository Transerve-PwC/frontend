import React, { Component } from 'react';
import { Tabs, Card, TextField, Icon, Button } from "components";
import Label from "egov-ui-kit/utils/translationNode";
import { createPACCApplication, updatePACCApplication } from "egov-ui-kit/redux/bookings/actions";
import { connect } from "react-redux";
import { toggleSnackbarAndSetText } from "egov-ui-kit/redux/app/actions";
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import EditIcon from '@material-ui/icons/Edit';
import "./index.css";
import Footer from "../../../../modules/footer"
import PaccFeeEstimate from "../PaccFeeEstimate"
import SummaryApplicationDetail from "../SummaryApplicationDetail"
import SummaryApplicantDetail from "../SummaryApplicantDetail"
import { getFileUrlFromAPI } from '../../../../modules/commonFunction'
import jp from "jsonpath";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import SummaryDocumentDetail from "../SummaryDocumentDetail"

class SummaryDetails extends Component {

    componentDidMount = async () => {
        console.log('createPACCApplication', this.props)
        let { createPACCApplication, userInfo,documentMap } = this.props;
        let { firstName, venueType, bokingType, bookingData, email, mobileNo, surcharge, fromDate, toDate,
            utGST, cGST, GSTnumber, dimension, location, facilitationCharges, cleaningCharges, rent, houseNo, type, purpose, locality, residenials, facilationChargesSuccess} = this.props;
       
        let fid=documentMap?Object.keys(documentMap):""
        let fname=documentMap?documentMap.fid:""
        console.log("fname--",fname)
        console.log('type==', documentMap, fid[0], toDate, venueType)
        let Booking = {
            "discount": 50,
            "bkBookingType": venueType,
            "bkBookingVenue": bokingType,
            "bkApplicantName": firstName,
            "bkMobileNumber": mobileNo,
            "bkDimension": dimension,
            "bkLocation": "new delhi",
            "bkFromDate": fromDate,
            "bkToDate": toDate,
            "bkCleansingCharges": cleaningCharges,
            "bkRent": rent,
            "bkSurchargeRent": surcharge,
            "bkUtgst": utGST,
            "bkCgst": cGST,
            "bkSector": locality,
            "fname":fname,
            "bkEmail": email,
            "bkHouseNo": houseNo,
            "bkBookingPurpose": purpose,
            "bkCustomerGstNo": GSTnumber,
            "wfDocuments": [{
                "fileStoreId": fid[0],
                "fname":fname
            }],
            "tenantId": userInfo.tenantId,
            "bkAction": "OFFLINE_INITIATE",
            "businessService": "PACC",
            "financialYear": "2020-2021"
        }

        if (venueType == "Community Center" && bookingData && bookingData.bkFromTime) {
            Booking.timeslots = [{
                "slot": bookingData.bkFromTime + '-' + bookingData.bkToTime
            }],
                Booking.bkDuration = "HOURLY",
                Booking.bkFromDate = bookingData.bkFromDate,
                Booking.bkToDate = bookingData.bkToDate,
                Booking.bkFromTime = bookingData.bkFromTime,
                Booking.bkToTime = bookingData.bkToTime
        }
        else if (venueType == "Community Center" && (!bookingData) && (!bookingData.bkFromTime)) {
            Booking.timeslots = [{
                "slot": "9:00 AM - 8:59 AM"
            }],
                Booking.bkDuration = "FULLDAY"
        }
        console.log('Booking---', Booking)
        createPACCApplication(
            {
                "applicationType": "PACC",
                "applicationStatus": "",
                "applicationId": null,
                "tenantId": userInfo.tenantId,
                "Booking": Booking
            });
    }


    submit = e => {
        let { updatePACCApplication,documentMap, createPACCApplicationData, bookingData, venueType } = this.props;
        let { data } = createPACCApplicationData;
        let fid=documentMap?Object.keys(documentMap):""
        const { firstName, userInfo, email, mobileNo, surcharge, fromDate, toDate, utGST, cGST, GSTnumber, dimension, location, facilitationCharges, cleaningCharges, rent, houseNo, type, purpose, locality, residenials } = this.props;
        console.log('data in submit button', data)
        if (data) {
            let Booking = {
                bkBookingType: data.bkBookingType,
                bkBookingVenue: data.bkBookingVenue,
                bkApplicantName: data.bkApplicantName,
                bkMobileNumber: data.bkMobileNumber,
                bkDimension: data.bkDimension,
                bkLocation: data.bkLocation,
                bkFromDate: data.bkFromDate,
                bkToDate: data.bkToDate,
                bkCleansingCharges: data.bkCleansingCharges,
                bkRent: data.bkRent,
                bkSurchargeRent: data.bkSurchargeRent,
                bkUtgst: data.bkUtgst,
                bkCgst: data.bkCgst,
                bkSector: data.bkSector,
                bkEmail: data.bkEmail,
                bkHouseNo: data.bkHouseNo,
                bkBookingPurpose: data.bkBookingPurpose,
                bkApplicationNumber: data.bkApplicationNumber,
                bkCustomerGstNo: data.bkCustomerGstNo ? data.bkCustomerGstNo : 'NA',
                "wfDocuments": [{
                    "fileStoreId": fid[0]
                }],
                "tenantId": userInfo.tenantId,
                "bkAction": "OFFLINE_APPLY",
                "businessService": "PACC",
                "financialYear": "2020-2021"
            }


            if (venueType == "Community Center" && bookingData && bookingData.bkFromTime) {
                Booking.timeslots = [{
                    "slot": bookingData.bkFromTime + ' - ' + bookingData.bkToTime
                }],
                    Booking.bkDuration = "HOURLY",
                    Booking.bkFromDate = bookingData.bkFromDate,
                    Booking.bkToDate = bookingData.bkToDate,
                    Booking.bkFromTime = bookingData.bkFromTime,
                    Booking.bkToTime = bookingData.bkToTime
            }
            else if (venueType == "Community Center" && (!bookingData) && (!bookingData.bkFromTime)) {
                Booking.timeslots = [{
                    "slot": "9:00 AM - 8:59 AM"
                }],
                    Booking.bkDuration = "FULLDAY"
            }


            updatePACCApplication(
                {
                    "applicationType": "PACC",
                    "applicationStatus": "",
                    "applicationId": data.bkApplicationNumber,
                    "tenantId": userInfo.tenantId,
                    "Booking": Booking
                });
                this.props.history.push("/egov-services/create-success-pcc");
        }
    }

    firstStep = e => {
        e.preventDefault();
        this.props.firstStep();
    }
    back = e => {
        e.preventDefault();
        this.props.prevStep();
    }
    callApiForDocumentData = async (e) => {
        alert("hello callApiForDocumentData")
        const { documentMap,userInfo } = this.props;
        var documentsPreview = [];
        if (documentMap && Object.keys(documentMap).length > 0) {
            let keys = Object.keys(documentMap);
            let values = Object.values(documentMap);
            let id = keys[0],
                fileName = values[0];

            documentsPreview.push({
                title: "DOC_DOC_PICTURE",
                fileStoreId: id,
                linkText: "View",
            });
            let fileStoreIds = jp.query(documentsPreview, "$.*.fileStoreId");
            let fileUrls =
                fileStoreIds.length > 0 ? await getFileUrlFromAPI(fileStoreIds,userInfo.tenantId) : {};


            documentsPreview = documentsPreview.map(function (doc, index) {
                doc["link"] =
                    (fileUrls &&
                        fileUrls[doc.fileStoreId] &&
                        fileUrls[doc.fileStoreId].split(",")[0]) ||
                    "";

                doc["name"] =
                    (fileUrls[doc.fileStoreId] &&
                        decodeURIComponent(
                            fileUrls[doc.fileStoreId]
                                .split(",")[0]
                                .split("?")[0]
                                .split("/")
                                .pop()
                                .slice(13)
                        )) ||
                    `Document - ${index + 1}`;
                return doc;
            });
            setTimeout(() => {
                window.open(documentsPreview[0].link);
            }, 100);
            prepareFinalObject('documentsPreview', documentsPreview)
        }
    }
    render() {
        //const { firstName,approverName,comment, email, mobileNo, houseNo, address, locality, residenials, propsData } = this.props;

        const { firstName,result, email, mobileNo, locality, surcharge, fromDate, toDate,facilationChargesSuccess,
            onFromDateChange, onToDateChange, utGST, cGST, GSTnumber, handleChange, bankName, amount, transactionDate, transactionNumber, paymentMode,
            dimension, location, facilitationCharges, cleaningCharges, rent, approverName, comment, houseNo, type, purpose, residenials,documentMap} = this.props;
            console.log("facilationChargesSuccess-in summarPage--",this.props)
        return (
            <div>
<div className="form-without-button-cont-generic">
               
                        {/* <button
                            style={{ color: "#FE7A51", border: "none", outline: "none", fontWeight: "500", float: 'right', marginRight: '50px', marginTop: '40px', background: "white" }}
                            onClick={this.firstStep}>
                            <EditIcon />
                            <h5 style={{ fontSize: "14px", marginTop: "-27px", marginBottom: "15px", marginLeft: "59px" }}>
                                Edit
                           
                    </h5>
                        </button> */}
                   

            
                {/* <div style={{ marginLeft: "20px", paddingBottom: '5px', paddingLeft: 25 }}>
                    <Label label="BK_MYBK_FEE_ESTIMATE" containerStyle={{ marginLeft: "13px" }} labelClassName="dark-heading" />

  facilationChargesSuccess={facilationChargesSuccess}

                    <div style={{ right: '50px', position: 'absolute' }}>
                        <h5><Label label="BK_TOTAL_AMOUNT" /></h5>
                        <h3 style={{ marginTop: '-8px', fontSize: '28px', color: 'black' }}><b>Rs {amount ? amount : 'NA'}</b></h3>
                    </div> */}
                    <div classsName="container">
                    <div className="col-xs-12">
                    <PaccFeeEstimate
                        amount={amount}
                        cGST={cGST}
                        utGST={utGST}      
                        firstStep={this.firstStep}       
                    />
                   
                {/* </div> */}

                <SummaryApplicantDetail
                    firstName={firstName}
                    email={email}
                    mobileNo={mobileNo}
                />

                {/* <div style={{ marginLeft: "20px", paddingBottom: '5px', paddingLeft: 25 }}>
                    <Label label="BK_MYBK_APPLICANT_DETAILS" labelClassName="dark-heading" />
                </div>
               
                <div className="col-xs-12" style={{ paddingBottom: '50px', paddingLeft: 25 }}>
                    <div className="col-sm-12 col-xs-12">
                    <Card>
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
                        </Card>
                    </div>
                </div> */}
               
               
                {/* <div style={{ marginLeft: "45px", paddingBottom: '5px', marginTop: 10 }} >
                    <Label label="BK_MYBK_APPLICANTION_DETAILS" labelClassName="dark-heading" />
                </div> */}
                <SummaryApplicationDetail
                    purpose={purpose}
                    locality={locality}
                    dimension={dimension}
                    fromDate={fromDate}
                    toDate={toDate}
                    cleaningCharges={cleaningCharges}
                    rent={rent}
                    surcharge={surcharge}
                    cGST={cGST}
                    utGST={utGST}
                    GSTnumber={GSTnumber}
                />
               

<SummaryDocumentDetail
documentMap={documentMap}
/>

                {/* <div style={{ marginLeft: "45px", paddingBottom: '5px', marginTop: 10 }} >
                    <Label label="BK_MYBK_APPLICANTION_DETAILS" labelClassName="dark-heading" />
                </div>
                <div className="col-xs-12" style={{ marginLeft: '10px' }}>
                    <div className="col-sm-12 col-xs-12" style={{ marginBottom: '30px' }}>
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
                                <Label className="col-xs-12  col-sm-12 col-md-12 status-color" label="BK_MYBK_CREATE_SURCHARGE" />
                                <Label
                                    className="col-xs-12  col-sm-12 col-md-12  status-result-color"
                                    id="complaint-details-current-status"
                                    labelStyle={{ color: "inherit" }}
                                    label={surcharge}
                                />
                            </div>
                            <div className="col-md-4">
                                <Label className="col-xs-12  col-sm-12 col-md-12 status-color" label="BK_MYBK_CREATE_UTGST" />
                                <Label
                                    className="col-xs-12  col-sm-12 col-md-12  status-result-color"
                                    id="complaint-details-current-status"
                                    labelStyle={{ color: "inherit" }}
                                    label={utGST}
                                />
                            </div>
                            <div className="col-md-4">
                                <Label className="col-xs-12  col-sm-12 col-md-12 status-color" label="BK_MYBK_CREATE_CGST" />
                                <Label
                                    className="col-xs-12  col-sm-12 col-md-12  status-result-color"
                                    id="complaint-details-current-status"
                                    labelStyle={{ color: "inherit" }}
                                    label={cGST}
                                />
                            </div>
                            <div className="col-md-4">
                                <Label className="col-xs-12  col-sm-12 col-md-12 status-color" label="BK_MYBK_CREATE_GSTNUMBER" />
                                <Label
                                    className="col-xs-12  col-sm-12 col-md-12  status-result-color"
                                    id="complaint-details-current-status"
                                    labelStyle={{ color: "inherit" }}
                                    label={GSTnumber}
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
                                    label={location}
                                />
                            </div>
                            <div className="col-md-4">
                                <Label className="col-xs-12  col-sm-12 col-md-12 status-color" label="BK_MYBK_CREATE_FCHARGES" />
                                <Label
                                    className="col-xs-12  col-sm-12 col-md-12  status-result-color"
                                    id="complaint-details-current-status"
                                    labelStyle={{ color: "inherit" }}
                                    label={facilitationCharges}
                                />
                            </div>
                           
                            <div className="col-md-4">
                                <Label className="col-xs-12  col-sm-12 col-md-12 status-color" label="BK_MYBK_CREATE_RENT" />
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
              */}
                {/* <div style={{ marginLeft: "45px", paddingBottom: '5px' }} >
                    <Label label="BK_MYBK_PAYMENT_DETAILS" labelClassName="dark-heading" />
                </div>
                <div className="col-xs-12" style={{ marginLeft: '10px' }}>
                    <div className="col-sm-12 col-xs-12" style={{ marginBottom: '90px' }}>
                        <div className="complaint-detail-detail-section-status row">
                      
                            <div className="col-md-4">
                                <Label className="col-xs-12  col-sm-12 col-md-12 status-color" label="BK_MYBK_CREATE_AMOUNT" />
                                <Label
                                    className="col-xs-12  col-sm-12 col-md-12  status-result-color"
                                    id="complaint-details-current-status"
                                    labelStyle={{ color: "inherit" }}
                                    label={amount}
                                />
                            </div>
                            <div className="col-md-4">
                                <Label className="col-xs-12  col-sm-12 col-md-12 status-color" label="BK_MYBK_CREATE_TRDATE" />
                                <Label
                                    className="col-xs-12  col-sm-12 col-md-12  status-result-color"
                                    id="complaint-details-current-status"
                                    labelStyle={{ color: "inherit" }}
                                    label={transactionDate}
                                />
                            </div>
                            <div className="col-md-4">
                                <Label className="col-xs-12  col-sm-12 col-md-12 status-color" label="BK_MYBK_CREATE_TRANSACTION_NUMBER" />
                                <Label
                                    className="col-xs-12  col-sm-12 col-md-12  status-result-color"
                                    id="complaint-details-current-status"
                                    labelStyle={{ color: "inherit" }}
                                    label={transactionNumber}
                                />
                            </div>
                        
                            <div className="col-md-4">
                                <Label className="col-xs-12  col-sm-12 col-md-12 status-color" label="BK_MYBK_CREATE_PAYMENTMODE" />
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
                */}



<div className="col-xs-12" style={{ marginLeft: '10px' }}>
                    <div className="col-sm-12 col-xs-12" style={{ marginBottom: '90px' }}>
                        <div className="complaint-detail-detail-section-status row">
                            <div className="col-md-4">
                            {console.log("hello")}
                            </div>
                        </div>
                    </div>
                </div>


                    {/* <div style={{
									height: "100px",
									width: "100",
									backgroundColor: "white",
									border: "2px solid white",
									boxShadow: "0 0 2px 2px #e7dcdc", paddingLeft: "30px", paddingTop: "10px"
								}}><b>Documents</b><br></br>

									{documentMap && Object.values(documentMap) ? Object.values(documentMap) : "BK_MYBK_PCC_DOCNOT_FOUND"}
									<button className="ViewDetailButton" data-doc={documentMap} onClick={(e) => { this.callApiForDocumentData(e) }}>VIEW</button>
					</div> */}
                    </div>
               
</div></div>
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
    const { createPACCApplicationData,facilationChargesSuccess,arrayName } = bookings;

    let documentMap = state.screenConfiguration.preparedFinalObject ? state.screenConfiguration.preparedFinalObject.documentMap : "";
    let bkLocation = state.screenConfiguration.preparedFinalObject ? state.screenConfiguration.preparedFinalObject.availabilityCheckData.bkLocation : "";

    console.log('createPACCApplicationData', createPACCApplicationData, "state---", state)

    return {
        createPACCApplicationData,
        documentMap, bkLocation,facilationChargesSuccess
    }

}
const mapDispatchToProps = dispatch => {
    return {

        createPACCApplication: (criteria, hasUsers, overWrite) => dispatch(createPACCApplication(criteria, hasUsers, overWrite)),
        updatePACCApplication: (criteria, hasUsers, overWrite) => dispatch(updatePACCApplication(criteria, hasUsers, overWrite)),
        toggleSnackbarAndSetText: (open, message, error) =>
            dispatch(toggleSnackbarAndSetText(open, message, error)),
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SummaryDetails);