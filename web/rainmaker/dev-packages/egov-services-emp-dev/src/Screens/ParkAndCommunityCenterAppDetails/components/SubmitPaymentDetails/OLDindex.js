import React, { Component } from 'react';
import { Tabs, Card, TextField, Icon, Button } from "components";
import Label from "egov-ui-kit/utils/translationNode";
import { createPACCApplication, updatePACCApplication,fetchPayment } from "egov-ui-kit/redux/bookings/actions";
import { connect } from "react-redux";
import { toggleSnackbarAndSetText } from "egov-ui-kit/redux/app/actions";
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import EditIcon from '@material-ui/icons/Edit';
import "./index.css";
import Footer from "../../../../modules/footer"
import PaymentReceiptDetail from "../PaymentReceiptDetail"
import PaymentOptionDetails from "../PaymentOptionDetails"
import { getFileUrlFromAPI } from '../../../../modules/commonFunction'
import jp from "jsonpath";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import SummaryDocumentDetail from "../SummaryDocumentDetail"
import { httpRequest } from "egov-ui-kit/utils/api";

class SummaryDetails extends Component {

    state = {
        PayerName : '',
        mobileNo : '',
        PaidBy : '',
        PaymentReceiptNumber : '',
        transactionDate : '',


    }

    componentDidMount = async () => {

        let fetchUrl = window.location.pathname;
        console.log(fetchUrl)
         
        let fetchApplicationNumber = fetchUrl.substring(fetchUrl.lastIndexOf('/') + 1)
        console.log("fetchApplicationNumber--",fetchApplicationNumber)
       
        let { createPACCApplication, userInfo, documentMap,fetchPayment,prepareFinalObject } = this.props;
        let { firstName, venueType, bokingType, bookingData, email, mobileNo, surcharge, fromDate, toDate,myLocationtwo,
            utGST, cGST, GSTnumber, dimension, location, facilitationCharges, cleaningCharges, rent, houseNo, type, purpose, locality, residenials, facilationChargesSuccess,discountType } = this.props;
// console.log("this.propos--insummaryPage--",this.props)
// console.log("discountType--",discountType)
// console.log("newConsole--ut",utGST)

// prepareFinalObject("SummaryutGST",this.props.utGST);
// prepareFinalObject("SummarycGST",this.props.cGST);
// prepareFinalObject("Summarysurcharge",this.props.surcharge);


// prepareFinalObject("cGSTSummary",cGST);


// let newDisCount;
// let finalDiscount;
// if(discountType == "50%"){
// newDisCount = 50; 
// finalDiscount = Number(newDisCount);
// console.log("newDisCount--",newDisCount)
// console.log("finalDiscount--",finalDiscount)
// }
// else if(discountType == "20%"){
//     newDisCount = 20; 
//     finalDiscount = Number(newDisCount);
//     console.log("newDisCount--",newDisCount)
//     console.log("finalDiscount--",finalDiscount)
//     }
//     else if (discountType == '100%' || discountType == "KirayaBhog" || discountType == "ReligiousFunction"){
//         newDisCount = 100; 
//         finalDiscount = Number(newDisCount);
//         console.log("newDisCount--",newDisCount)
//         console.log("finalDiscount--",finalDiscount)
//         }
//         else{
//             newDisCount = 0; 
//             finalDiscount = Number(newDisCount);
//             console.log("newDisCount--",newDisCount)
//             console.log("finalDiscount--",finalDiscount)
//             }


//         let fid = documentMap ? Object.keys(documentMap) : ""
//         let Booking = {
//             "discount": finalDiscount,
//             "bkBookingType": venueType,
//             "bkBookingVenue": bokingType,
//             "bkApplicantName": firstName,
//             "bkMobileNumber": mobileNo,
//             "bkDimension": dimension,
//             "bkLocation": myLocationtwo,
//             "bkFromDate": fromDate,
//             "bkToDate": toDate,
//             "bkCleansingCharges": cleaningCharges,
//             "bkRent": rent,
//             "bkSurchargeRent": surcharge,
//             "bkUtgst": utGST,
//             "bkCgst": cGST,
//             "bkSector": locality,
//             "bkEmail": email,
//             "bkHouseNo": houseNo,
//             "bkBookingPurpose": purpose,
//             "bkCustomerGstNo": GSTnumber,
//             "wfDocuments": [{
//                 "fileStoreId": fid[0]
//             }],
//             "tenantId": userInfo.tenantId,
//             "bkAction": "OFFLINE_INITIATE",
//             "businessService": "PACC",
//             "financialYear": "2020-2021"
//         }

//         if (venueType == "Community Center" && bookingData && bookingData.bkFromTime) {
//             Booking.timeslots = [{
//                 "slot": bookingData.bkFromTime + '-' + bookingData.bkToTime
//             }],
//                 Booking.bkDuration = "HOURLY",
//                 Booking.bkFromDate = bookingData.bkFromDate,
//                 Booking.bkToDate = bookingData.bkToDate,
//                 Booking.bkFromTime = bookingData.bkFromTime,
//                 Booking.bkToTime = bookingData.bkToTime
//         }
//         else if (venueType == "Community Center" && (!bookingData) && (!bookingData.bkFromTime)) {
//             Booking.timeslots = [{
//                 "slot": "9:00 AM - 8:59 AM"
//             }],
//                 Booking.bkDuration = "FULLDAY"
//         }
      
//     //  await createPACCApplication(
//     //         {
//     //             "applicationType": "PACC",
//     //             "applicationStatus": "",
//     //             "applicationId": null,
//     //             "tenantId": userInfo.tenantId,
//     //             "Booking": Booking
//     //         });

//         let createAppData = {
             
//                 "applicationType": "PACC",
//                 "applicationStatus": "",
//                 "applicationId": null,
//                 "tenantId": userInfo.tenantId,
//                 "Booking": Booking   
//             }
        
// console.log("createAppData--",createAppData)

// let payloadfund = await httpRequest(
//             "bookings/park/community/_create",
//             "_search",[],
//             createAppData
//             );

//  console.log("payloadfund--",payloadfund)

//  let appNumber = payloadfund.data.bkApplicationNumber
//  console.log("appNumber--",appNumber)

//  this.setState({
//     createPACCApp : payloadfund
//  })


 fetchPayment(
    [{ key: "consumerCode", value: fetchApplicationNumber }, { key: "businessService", value: "PACC" }, { key: "tenantId", value: userInfo.tenantId }
    ])

//  let RequestData = [
//             { key: "consumerCode", value: appNumber },
//             { key: "businessService", value: "PACC" },
//             { key: "tenantId", value: userInfo.tenantId }
//             ];
// let payloadbill = await httpRequest(
//             "billing-service/bill/v2/_fetchbill",
//             "_search",[],
//             RequestData
//             );

//      console.log("payloadbill--",payloadbill)







    //  let data={
    //     "RefundTransaction" : {
    //     "additionalDetails": {},
        
    //     "gateway": gateway,
    //     "gatewayRefundStatusCode": txnStatus,
    //     "gatewayRefundStatusMsg": txnStatusMsg,
    //     "gatewayTxnId": gatewayTxnId,
    //     "refundAmount": "250.00",
    //     "tenantId": userInfo.tenantId,
    //     "txnAmount": txnAmount,
    //     "txnId": txnId
    
    //   }
    // }
    
    //   let ResOfRefund = await httpRequest(
    //     "pg-service/transaction/v1/_refund",
    //     "_search",[],
    //     data
    //   );


        // let RequestData = [
        //     { key: "consumerCode", value: "CH-BK-2020-10-30-003136" },
        //     { key: "tenantId", value: userInfo.tenantId }
        //     ];
        //   let payloadfund = await httpRequest(
        //     "billing-service/bill/v2/_fetchbill",
        //     "_search",
        //     RequestData
        //     );

    //  console.log("payloadfund--",payloadfund)


    }

  
    transactionDateChange = e => {
        const trDate = e.target.value;
        this.setState({
            transactionDate: trDate
        })

    }


    submit = e => {
        let { updatePACCApplication, documentMap, createPACCApplicationData, bookingData, venueType,prepareFinalObject } = this.props;
        let dataOne = this.state.createPACCApp && this.state.createPACCApp.data ? this.state.createPACCApp.data: "NoDataFound"
        console.log("dataOne--",dataOne)
        let data  = dataOne;
        console.log("data--",data)
        prepareFinalObject("CreatePaccAppData",data);
        let fid = documentMap ? Object.keys(documentMap) : ""
        const { firstName, userInfo, email, mobileNo, surcharge, fromDate, toDate, utGST, cGST, GSTnumber, dimension, location, facilitationCharges, cleaningCharges, rent, houseNo, type, purpose, locality, residenials } = this.props;
     
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
            this.props.history.push(`/egov-services/create-success-pcc`);
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

    handleChange = input => e => {
        this.setState({ [input]: e.target.value });
    }
    render() {
        // const { firstName, fCharges,result, email, mobileNo, locality, surcharge, fromDate, toDate, facilationChargesSuccess,
        //     onFromDateChange, onToDateChange, utGST, cGST, GSTnumber, handleChange, bankName, amount, transactionDate, transactionNumber, paymentMode,
        //     dimension, location, facilitationCharges, cleaningCharges, rent, approverName, comment, houseNo, type, purpose, residenials, documentMap,
        //     BK_FEE_HEAD_PACC,LUXURY_TAX,REFUNDABLE_SECURITY,PACC_TAX,totalAmountSuPage,one,two,three,four,five,six,
        //     PACPACC_ROUND_OFFC_TAX,FACILITATION_CHARGE
        //     } = this.props;


            // console.log(",one,two,three,four,five,six--",one,two,three,four,five,six)
            // console.log("propsInRendersummary--",this.props)
            // let fc = fCharges?fCharges.facilitationCharge:'100';
            // console.log("stateofBooking--",this.state.createPACCApp)
           

            let { PayerName, mobileNo, PaidBy, transactionDate, PaymentReceiptNumber  } = this.state;
            
        return (
            <div>
                <div className="form-without-button-cont-generic">
                    <div classsName="container">
                        <div className="col-xs-12">
                            
               < PaymentReceiptDetail 
                PaymentReceiptNumber={PaymentReceiptNumber}
                handleChange={this.handleChange}
                transactionDateChange={this.transactionDateChange}
                transactionDate={transactionDate}
               />
               <PaymentOptionDetails 
               PayerName={PayerName}
               handleChange={this.handleChange}
               mobileNo={mobileNo}
               PaidBy={PaidBy}
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
    let one = 0;
    let two = 0;
    let three = 0;
    let four = 0;
    let five = 0;
    let six = 0;
for(let i = 0; i < billAccountDetailsArray.length ; i++ ){

    if(billAccountDetailsArray[i].taxHeadCode == "PACC"){
        one = billAccountDetailsArray[i].amount
    }
    else if(billAccountDetailsArray[i].taxHeadCode == "LUXURY_TAX"){
        two = billAccountDetailsArray[i].amount
    }
    else if(billAccountDetailsArray[i].taxHeadCode == "REFUNDABLE_SECURITY"){
        three = billAccountDetailsArray[i].amount
    }
    else if(billAccountDetailsArray[i].taxHeadCode == "PACC_TAX"){
        four = billAccountDetailsArray[i].amount
    }
    else if(billAccountDetailsArray[i].taxHeadCode == "PACC_ROUND_OFF"){
        five = billAccountDetailsArray[i].amount
    }
    else if(billAccountDetailsArray[i].taxHeadCode == "FACILITATION_CHARGE"){
        six = billAccountDetailsArray[i].amount
    }
}

console.log("one--",one)
console.log("two--",two)
console.log("three--",three)
console.log("four--",four)
console.log("five--",five)
console.log("six--",six)

    

    let myLocation = state.screenConfiguration.preparedFinalObject ? state.screenConfiguration.preparedFinalObject.availabilityCheckData:"";  
    let myLocationtwo = myLocation?myLocation.bkLocation:"";  


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
    return {
        //BK_FEE_HEAD_PACC,LUXURY_TAX,REFUNDABLE_SECURITY,PACC_TAX,
        //PACPACC_ROUND_OFFC_TAX,FACILITATION_CHARGE,
        createPACCApplicationData,userInfo,
        documentMap, bkLocation, facilationChargesSuccess,
        fCharges,myLocationtwo,totalAmountSuPage,one,two,three,four,five,six
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