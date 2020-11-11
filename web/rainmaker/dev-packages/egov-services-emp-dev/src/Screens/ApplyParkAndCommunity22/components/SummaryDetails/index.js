import React, { Component } from 'react';
import { Tabs, Card, TextField, Icon, Button } from "components";
import Label from "egov-ui-kit/utils/translationNode";
import { createPACCApplication,updatePACCApplication } from "egov-ui-kit/redux/bookings/actions";
import { connect } from "react-redux";
import { toggleSnackbarAndSetText } from "egov-ui-kit/redux/app/actions";
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import EditIcon from '@material-ui/icons/Edit';
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import "./index.css";
import Footer from "../../../../modules/footer"
import { getFileUrlFromAPI } from "egov-ui-framework/ui-utils/commons";
import PaccFeeEstimate from "../PaccFeeEstimate"
import SummaryApplicationDetail from "../SummaryApplicationDetail"
import jp from "jsonpath";


class SummaryDetails extends Component {

    componentDidMount = async () => {
        console.log('createPACCApplication',this.props)
        let { createPACCApplication,userInfo } = this.props;
        const { firstName,venurType, bokingType,email, mobileNo, surcharge, fromDate, toDate, utGST, cGST, GSTnumber, dimension, location, facilitationCharges, cleaningCharges, rent, houseNo, type, purpose, locality, residenials } = this.props;
      console.log('type==',venurType,bokingType)
        let Booking = {
            "discount" : 50,
            "bkBookingType": "Parks",
            "documentMap":documentMap,
            "bkBookingVenue": "fabc3ff6-70d8-4ae6-8ac7-00c9c714c202",
            "bkApplicantName": "Sumit Kumar",
            "bkMobileNumber": "9138912806",
            "bkDimension": "1342",
            "bkLocation": "PARK NO 11 NEAR H NO 710 SEC 11 CHD",
            "bkFromDate": fromDate,
            "bkToDate": toDate,
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
            "bkAction": "OFFLINE_INITIATE",
            "businessService": "PACC",
            "financialYear": "2020-2021"
        }
        createPACCApplication(
            {
                "applicationType": "PACC",
                "applicationStatus": "",
                "applicationId": null,
                "tenantId": userInfo.tenantId,
                "Booking": Booking
            });   
            // this.props.history.push("/egov-services/create-success-pcc");
    }
      

    submit = e => {
        let { updatePACCApplication,createPACCApplicationData } = this.props;
let {data}=createPACCApplicationData;
        const { firstName,userInfo, email, mobileNo, surcharge, fromDate, toDate, utGST, cGST, GSTnumber, dimension, location, facilitationCharges, cleaningCharges, rent, houseNo, type, purpose, locality, residenials } = this.props;
        console.log('data in submit button',data)
        if(data){
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
            bkSurchargeRent:data.bkSurchargeRent,
            bkUtgst: data.bkUtgst,
            bkCgst: data.bkCgst,
            bkSector: data.bkSector,
            bkEmail: data.bkEmail,
            bkHouseNo: data.bkHouseNo,
            bkBookingPurpose: data.bkBookingPurpose,
            bkApplicationNumber:data.bkApplicationNumber,
            bkCustomerGstNo: data.bkCustomerGstNo?data.bkCustomerGstNo:'NA',
            "wfDocuments": [{
                "fileStoreId": "0387281e-a040-49e7-af9d-99e9dac3a19d"
            }],
            "tenantId": "ch",
            "bkAction": "OFFLINE_APPLY",
            "businessService": "PACC",
            "financialYear": "2020-2021"
        }
    
        updatePACCApplication(
            {
                "applicationType": "PACC",
                "applicationStatus": "",
                "applicationId": null,
                "tenantId": userInfo.tenantId,
                "Booking": Booking
            });
        this.props.history.push("/egov-services/create-success");
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
       const { documentMap } = this.props;
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
				fileStoreIds.length > 0 ? await getFileUrlFromAPI(fileStoreIds) : {};
		

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

        const { firstName, email, mobileNo, locality, surcharge, fromDate, toDate,documentMap,abc,oneTwoThree,
            onFromDateChange, onToDateChange, utGST, cGST, GSTnumber, handleChange,bankName,amount,transactionDate,transactionNumber,paymentMode,
            bkLocation, dimension, location, facilitationCharges, cleaningCharges, rent, approverName, comment, houseNo, type, purpose, residenials } = this.props;
       console.log("documentMapinsummaryPage--",documentMap)
       console.log("propsInsummaryPage",this.props)
       console.log("oneTwoThree--",oneTwoThree)

       return (
            <div>
                <div classsName="container">
                    {/* <div className="col-xs-12">
                        <EditIcon/>
                        <button
                            style={{ float: 'right', marginRight: '50px', marginTop: '40px' }}
                            primary={true}
                            onClick={this.firstStep}
                            // className="ViewDetailButton"
                        >EDIT</button>
                    </div> */}

{/* <div className="col-xs-12">
                        <EditIcon/>
                        <button
                            style={{ float: 'right', marginRight: '50px', marginTop: '40px' }}
                            primary={true}
                             style={{ color: "#FE7A51", border: "none", outline: "none", fontWeight: "500", background: "white" }}
                            onClick={this.firstStep}
                            // className="ViewDetailButton"
                        >EDIT</button>
                         <EditIcon/>
                    <h5 style={{ marginTo
                        p: "-25px", marginBottom: "60px", marginLeft: "130px"}}>
                    EDIT
                    </h5>
                    </div> */}


<div className="col-xs-12">
                  <button
                    style={{ color: "#FE7A51", border: "none", outline: "none", fontWeight: "500", float: 'right', marginRight: '50px', marginTop: '40px', background: "white" }}
                    onClick={this.firstStep}>
                   <EditIcon/>
                    <h5 style={{fontSize: "14px", marginTop: "-27px", marginBottom: "15px", marginLeft: "59px"}}>
                    EDIT
                    </h5>
                  </button>
                </div>
                </div>

                <div style={{ marginLeft: "20px", paddingBottom: '5px', paddingLeft: 25 }}>
                <Label label="BK_MYBK_FEE_ESTIMATE" containerStyle={{ marginLeft: "13px" }} labelClassName="dark-heading" />
                
                <div style={{right: '50px',position: 'absolute'}}>
                  <h5><Label label="BK_TOTAL_AMOUNT" /></h5>
                  <h3 style={{marginTop: '-8px',fontSize: '28px',color: 'black'}}><b>Rs {amount ? amount : 'NA'}</b></h3>
                </div>

                <PaccFeeEstimate
               amount={amount}
               cGST={cGST}
               utGST={utGST}
            //    location={location}
                />
                </div>
                {/* <PaccFeeEstimate
               amount={amount}
               cGST={cGST}
               utGST={utGST}
                /> */}

{/* <Label
label="BK_MYBK_REQUIRED_DOC_HEADING"
style={{ paddingTop: "24px", fontWeight: 'bold',  }}
color="#000000"
fontSize= "17"
/> */}

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
                            <div className="col-md-4">
                                <Label className="col-xs-12  col-sm-12 col-md-12 status-color" label="BK_MYBK_CREATE_HOUSE_NUMBER" />
                                <Label
                                    className="col-xs-12  col-sm-12 col-md-12  status-result-color"
                                    id="complaint-details-current-status"
                                    labelStyle={{ color: "inherit" }}
                                    label={houseNo}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div style={{ marginLeft: "45px", paddingBottom: '5px', marginTop: 10 }} >
                    <Label label="BK_MYBK_APPLICANTION_DETAILS" labelClassName="dark-heading" />
                </div>
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

                {/* <div className="col-xs-12" style={{ marginLeft: '10px' }}>
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
                                <Label className="col-xs-12  col-sm-12 col-md-12 status-color" label="BK_MYBK_LOCALITY" />
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
                                    label={this.props.location}
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
                                <Label className="col-xs-12  col-sm-12 col-md-12 status-color" label="BK_MYBK_CLEANINGCHARGES" />
                                <Label
                                    className="col-xs-12  col-sm-12 col-md-12  status-result-color"
                                    id="complaint-details-current-status"
                                    labelStyle={{ color: "inherit" }}                                  
                                    label={this.props.purpose?this.props.purpose:"NA"}
                                    // label={this.props.cleaningCharges?this.props.cleaningCharges:"NA"}
                                />
                            </div>

                            <div className="col-md-4">
                                <Label className="col-xs-12  col-sm-12 col-md-12 status-color" label="BK_MYBK_CREATE_RENT" />
                                <Label
                                    className="col-xs-12  col-sm-12 col-md-12  status-result-color"
                                    id="complaint-details-current-status"
                                    labelStyle={{ color: "inherit" }}
                                    label={this.props. purpose}
                                    // label={this.props.rent}
                                />
                            </div>

                            <div className="col-md-4">
                                <Label className="col-xs-12  col-sm-12 col-md-12 status-color" label="BK_MYBK_CREATE_SURCHARGE" />
                                <Label
                                    className="col-xs-12  col-sm-12 col-md-12  status-result-color"
                                    id="complaint-details-current-status"
                                    labelStyle={{ color: "inherit" }}
                                    label={this.props.surcharge?this.props.surcharge:"NA"}
                                />
                            </div>
                            <div className="col-md-4">
                                <Label className="col-xs-12  col-sm-12 col-md-12 status-color" label="BK_MYBK_CREATE_UTGST" />
                                <Label
                                    className="col-xs-12  col-sm-12 col-md-12  status-result-color"
                                    id="complaint-details-current-status"
                                    labelStyle={{ color: "inherit" }}
                                    label={this.props.utGST?this.props.utGST:"NA"}
                                />
                            </div>
                            <div className="col-md-4">
                                <Label className="col-xs-12  col-sm-12 col-md-12 status-color" label="BK_MYBK_CREATE_CGST" />
                                <Label
                                    className="col-xs-12  col-sm-12 col-md-12  status-result-color"
                                    id="complaint-details-current-status"
                                    labelStyle={{ color: "inherit" }}
                                    label={this.props.cGST?this.props.cGST:"NA"}
                                />
                            </div>
                            <div className="col-md-4">
                                <Label className="col-xs-12  col-sm-12 col-md-12 status-color" label="BK_MYBK_CREATE_GSTNUMBER" />
                                <Label
                                    className="col-xs-12  col-sm-12 col-md-12  status-result-color"
                                    id="complaint-details-current-status"
                                    labelStyle={{ color: "inherit" }}
                                    label={this.props.GSTnumber?this.props.GSTnumber:"NA"}
                                />
                            </div>
                           
{/*                            
                            <div className="col-md-4">
                                <Label className="col-xs-12  col-sm-12 col-md-12 status-color" label="BK_MYBK_CREATE_FCHARGES" />
                                <Label
                                    className="col-xs-12  col-sm-12 col-md-12  status-result-color"
                                    id="complaint-details-current-status"
                                    labelStyle={{ color: "inherit" }}
                                    label={facilitationCharges}
                                />
                            </div> */}
                           
                          
{/*                        
                        </div>
                    </div>
                </div> */} 
                <div style={{ marginLeft: "45px", paddingBottom: '5px' }} >
                    <Label label="BK_MYBK_PAYMENT_DETAILS" labelClassName="dark-heading" />
                </div>
                <div className="col-xs-12" style={{ marginLeft: '10px' }}>
                    <div className="col-sm-12 col-xs-12" style={{ marginBottom: '90px' }}>
                        <div className="complaint-detail-detail-section-status row">
                        {/* <div className="col-md-4">
                                <Label className="col-xs-12  col-sm-12 col-md-12 status-color" label="BK_MYBK_RENT" />
                                <Label
                                    className="col-xs-12  col-sm-12 col-md-12  status-result-color"
                                    id="complaint-details-current-status"
                                    labelStyle={{ color: "inherit" }}
                                    label={bankName}
                                />
                            </div> */}
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
                <div style={{ marginLeft: "45px", paddingBottom: '5px' }} >
                    <Label label="Documents" labelClassName="dark-heading" />
                </div>
                
                {/* <div>
                <b>Documents</b>

									{documentMap && Object.values(documentMap) ? Object.values(documentMap) : "Not found"}
									<button className="ViewDetailButton" data-doc={documentMap} onClick={(e) => { this.callApiForDocumentData(e) }}>VIEW</button>
								</div>       */}
          <div className="col-xs-12" style={{ marginLeft: '10px' }}>
                    <div className="col-sm-12 col-xs-12" style={{ marginBottom: '90px' }}>
                        <div className="complaint-detail-detail-section-status row">
                        <div className="col-md-4">
                                <Label className="col-xs-12  col-sm-12 col-md-12 status-color" label="BK_MYBK_PCC_Document" />
                                <Label //Document ==BK_PCC_Document BK_MYBK_PCC_DOCNOT_FOUND==Document Not Found
                                    className="col-xs-12  col-sm-12 col-md-12  status-result-color"
                                    id="complaint-details-current-status"
                                    labelStyle={{ color: "inherit" }}
                                    label={documentMap && Object.values(documentMap) ? Object.values(documentMap) : "BK_MYBK_PCC_DOCNOT_FOUND"}
                                />
                                <button className="ViewDetailButton" data-doc={documentMap} onClick={(e) => { this.callApiForDocumentData(e) }}>VIEW</button>
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
    console.log("stateoFsummaryPage--",state)
    let documentMap = state.screenConfiguration.preparedFinalObject ? state.screenConfiguration.preparedFinalObject.documentMap:"";
    let bkLocation = state.screenConfiguration.preparedFinalObject ? state.screenConfiguration.preparedFinalObject.availabilityCheckData.bkLocation:"";   
    const { createPACCApplicationData } = bookings;
    console.log('createPACCApplicationData', createPACCApplicationData,"state---",state)
    console.log("documentMapINSUMMARYbYRedux--",documentMap)
    return {
        createPACCApplicationData,
        documentMap,bkLocation
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