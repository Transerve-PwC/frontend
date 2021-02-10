import React, { Component } from 'react';
import { Tabs, Card, TextField, Icon, Button } from "components";
import Label from "egov-ui-kit/utils/translationNode";
import { createPACCApplication, updatePACCApplication,fetchPayment,fetchApplications } from "egov-ui-kit/redux/bookings/actions";
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
import { httpRequest } from "egov-ui-kit/utils/api";

class SummaryDetails extends Component {

    state = {
        createPACCApp: '',
        CashPaymentApplicationNumber: '',
        appStatus: '',
        currentAppStatus: ''
    }

    componentDidMount = async () => {
        let { createPACCApplication, userInfo, documentMap,fetchPayment,prepareFinalObject,fetchApplications } = this.props;
        let { firstName, venueType, bokingType, bookingData, email, mobileNo, surcharge, fromDate, toDate,myLocationtwo,
            FatherName,completeAddress,cgToDate,cgFromDate,cgBookingVenue,
            utGST, cGST, GSTnumber, dimension, location, facilitationCharges, cleaningCharges, rent, type, purpose, locality, residenials, facilationChargesSuccess,discountType,checkAppStatus,checkAppNum } = this.props;
            console.log("this.propos--insummaryPage--",this.props)

            let fid = documentMap ? Object.keys(documentMap) : ""

            let Booking = {
                "bkFromDate": cgFromDate,
                "bkToDate": cgToDate,
                "bkBookingVenue": cgBookingVenue,
                "bkSector": cgBookingVenue,
                "bkApplicantName": firstName,
                "bkMobileNumber": mobileNo,
                "bkEmail": email,
                "bkCompleteAddress": completeAddress,
                "bkFatherName": FatherName,
                "bkBookingPurpose": purpose,
                "bkCategory": "Corporate",
                "financeBusinessService": "GFCP",
                "wfDocuments": [{
                    "fileStoreId": fid[0]
                }],
                "bkBookingType": "GROUND_FOR_COMMERCIAL_PURPOSE",
                "tenantId": userInfo.tenantId,
                "bkAction": "INITIATE",
                "businessService": "GFCP",
                "financialYear": "2020-2021"
              }
        let createAppData = {
             
                "applicationType": "GFCP",
                "applicationStatus": "",
                "applicationId":null,
                "tenantId": userInfo.tenantId,
                "Booking": Booking   
            }
        
console.log("createAppData--",createAppData)

let payloadfund = await httpRequest(
            "bookings/api/_create",
            "_search",[],
            createAppData
            );

 console.log("payloadfund--",payloadfund)

 prepareFinalObject("createAppData",payloadfund)

 let appNumber = payloadfund.data.bkApplicationNumber
 console.log("appNumber--",appNumber)
 let AAppStatus = payloadfund.data.bkApplicationStatus
 console.log("AAppStatus--",AAppStatus)

 prepareFinalObject("CurrentApplicationNumber",appNumber)

 this.setState({
    createPACCApp : payloadfund,
    CashPaymentApplicationNumber : appNumber,
    currentAppStatus : AAppStatus
 })


 fetchPayment(
    [{ key: "consumerCode", value: appNumber }, { key: "businessService", value: "GFCP" }, { key: "tenantId", value: userInfo.tenantId }
    ])
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
        const { documentMap, userInfo } = this.props;
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
            let changetenantId = userInfo.tenantId ? userInfo.tenantId.split(".")[0] : "ch";
            let fileStoreIds = jp.query(documentsPreview, "$.*.fileStoreId");
            let fileUrls =
                fileStoreIds.length > 0 ? await getFileUrlFromAPI(fileStoreIds, changetenantId) : {};


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

submit = async (InitiateAppNumber) => {

console.log("this.state.CashPaymentApplicationNumber--",this.state.CashPaymentApplicationNumber)    

let NumberApp = this.state.CashPaymentApplicationNumber;

console.log("NumberApp--",NumberApp)

this.props.history.push(`/egov-services/PaymentReceiptDteail/${this.state.CashPaymentApplicationNumber}`);
   
}

    render() {
        const { firstName, fCharges,result, email, mobileNo, locality, surcharge, fromDate, toDate,facilationChargesSuccess,
            onFromDateChange, onToDateChange, utGST, cGST, GSTnumber, handleChange, bankName, amount, transactionDate, transactionNumber, paymentMode,
            dimension, location, facilitationCharges, cleaningCharges, rent, approverName, comment, houseNo, type, purpose, residenials, documentMap,
            BK_FEE_HEAD_PACC,LUXURY_TAX,REFUNDABLE_SECURITY,PACC_TAX,totalAmountSuPage,one,two,three,four,five,six,
            PACPACC_ROUND_OFFC_TAX,FACILITATION_CHARGE,InitiateAppNumber,seven,
            FatherName,completeAddress,cgToDate,cgFromDate,cgBookingVenue,cgBaseCharges,chTaxes,cgCategoryType
            } = this.props;
            
            console.log(",one,two,three,four,five,six--",one,two,three,four,five,six)
            console.log("propsInRendersummary--",this.props)
            let fc = fCharges?fCharges.facilitationCharge:'100';
            console.log("stateofBooking--",this.state.createPACCApp)

            
        return (
            <div>
                <div className="form-without-button-cont-generic">
                    <div classsName="container">
                        <div className="col-xs-12">
                           

                            <PaccFeeEstimate
                            totalAmountSuPage={totalAmountSuPage}
                            cgBaseCharges={cgBaseCharges}
                            chTaxes={chTaxes}
                            />
                            <SummaryApplicantDetail
                                firstName={firstName}
                                email={email}
                                FatherName={FatherName}
                                completeAddress={completeAddress}
                                mobileNo={mobileNo}
                            />                   
                            <SummaryApplicationDetail
                               fromDate={cgFromDate}
                               toDate={cgToDate}
                               cgBookingVenue={cgBookingVenue}
                               Category={cgCategoryType}
                               purpose={purpose}
                            />
                            <SummaryDocumentDetail
                                documentMap={documentMap}
                            />
                            <div className="col-xs-12" style={{ marginLeft: '10px' }}>
                                <div className="col-sm-12 col-xs-12" style={{ marginBottom: '90px' }}>
                                    <div className="complaint-detail-detail-section-status row">
                                        <div className="col-md-4">
                                        </div>
                                    </div>
                                </div>
                            </div>


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
    const { createPACCApplicationData} = bookings;
    const { userInfo } = state.auth;
    const { facilationChargesSuccess, arrayName } = bookings;
    const { paymentData } = bookings;
    let paymentDataOne = paymentData ? paymentData : "wrong";
    console.log("paymentDataOne--",paymentDataOne)
    let checkBillLength =  paymentDataOne != "wrong" ? paymentDataOne.Bill.length > 0 : "";
    let totalAmountSuPage = checkBillLength ? paymentDataOne.Bill[0].totalAmount: "notfound";
    console.log("totalAmountSuPage-",totalAmountSuPage)

    let billAccountDetailsArray =  checkBillLength ? paymentDataOne.Bill[0].billDetails[0].billAccountDetails : "NOt found Any Array"
    console.log("billAccountDetailsArray--",billAccountDetailsArray)
    let cgBaseCharges = 0;
    let chTaxes = 0;
    
for(let i = 0; i < billAccountDetailsArray.length ; i++ ){

    if(billAccountDetailsArray[i].taxHeadCode == "GFCP"){
        cgBaseCharges = billAccountDetailsArray[i].amount
    }
    else if(billAccountDetailsArray[i].taxHeadCode == "GFCP_TAX"){
        chTaxes = billAccountDetailsArray[i].amount
    }
}

console.log("cgBaseCharges--",cgBaseCharges)
console.log("cgBaseCharges--",chTaxes)

    let myLocation = state.screenConfiguration.preparedFinalObject ? state.screenConfiguration.preparedFinalObject.availabilityCheckData:"";  
    let myLocationtwo = myLocation?myLocation.bkLocation:"";  

    let NewAppNumber =  state.screenConfiguration.preparedFinalObject.CurrentApplicationNumber ? state.screenConfiguration.preparedFinalObject.CurrentApplicationNumber : "NotDetemine";
    console.log("NewAppNumber--",NewAppNumber)

    let tryMyNumber;

    if(NewAppNumber != "NotDetemine"){
        tryMyNumber = NewAppNumber && NewAppNumber;
    }
    console.log("tryMyNumber--",tryMyNumber)

    let InitiateAppNumber = NewAppNumber && NewAppNumber ? NewAppNumber : "NotDetemine";
    
    console.log("InitiateAppNumber--",InitiateAppNumber)
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
    let documentMap = state.screenConfiguration.preparedFinalObject ? state.screenConfiguration.preparedFinalObject.documentMap : "";
    let bkLocation = state.screenConfiguration.preparedFinalObject ? state.screenConfiguration.preparedFinalObject.availabilityCheckData.bkLocation : "";
   
   let checkAppStatus = state.bookings.applicationData ? state.bookings.applicationData.bookingsModelList[0].bkApplicationStatus : "NOTFOUND";
   console.log("checkAppStatus--",checkAppStatus)

   let checkAppNum = state.bookings.applicationData ? state.bookings.applicationData.bookingsModelList[0].bkApplicationNumber : "NOTFOUND";
   console.log("checkAppStatus--bkApplicationNumber",checkAppNum)

   let cgFromDate = state.screenConfiguration.preparedFinalObject ? state.screenConfiguration.preparedFinalObject.availabilityCheckData.bkFromDate:"two"
  console.log("cgFromDate--",cgFromDate)
  let cgToDate = state.screenConfiguration.preparedFinalObject ? state.screenConfiguration.preparedFinalObject.availabilityCheckData.bkToDate:"two"
  console.log("cgToDate--",cgToDate)
  let cgBookingVenue = state.screenConfiguration.preparedFinalObject ? state.screenConfiguration.preparedFinalObject.CommercialEmpBooking.BookingVenue:"two"
  console.log("cgBooking--",cgBookingVenue)

   //OFFLINE_APPLIED

    return {
        //BK_FEE_HEAD_PACC,LUXURY_TAX,REFUNDABLE_SECURITY,PACC_TAX,
        //PACPACC_ROUND_OFFC_TAX,FACILITATION_CHARGE,
        createPACCApplicationData,userInfo,InitiateAppNumber,cgToDate,cgFromDate,cgBookingVenue,
        documentMap, bkLocation,
        totalAmountSuPage,cgBaseCharges,chTaxes,checkAppStatus,checkAppNum
    }

}
const mapDispatchToProps = dispatch => {
    return {

        createPACCApplication: (criteria, hasUsers, overWrite) => dispatch(createPACCApplication(criteria, hasUsers, overWrite)),
        updatePACCApplication: (criteria, hasUsers, overWrite) => dispatch(updatePACCApplication(criteria, hasUsers, overWrite)),
        toggleSnackbarAndSetText: (open, message, error) =>
            dispatch(toggleSnackbarAndSetText(open, message, error)),
            fetchPayment: criteria => dispatch(fetchPayment(criteria)), 
            prepareFinalObject: (jsonPath, value) =>
            dispatch(prepareFinalObject(jsonPath, value)),
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SummaryDetails);