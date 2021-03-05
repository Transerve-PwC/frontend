import React, { Component } from 'react';
import { Tabs, Card, TextField, Icon, Button } from "components";
import Label from "egov-ui-kit/utils/translationNode";
import { createPACCApplication, updatePACCApplication,fetchPayment,fetchApplications } from "egov-ui-kit/redux/bookings/actions";
import { connect } from "react-redux";
import { toggleSnackbarAndSetText } from "egov-ui-kit/redux/app/actions";
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import EditIcon from '@material-ui/icons/Edit';
import "./index.css";
import Footer from "../../../modules/footer"
// import PaccFeeEstimate from "../PaccFeeEstimate"
import SummaryCCBookingDetail from "../SummaryCCBookingDetail"
import SummaryVenueDetail from "../SummaryVenueDetail"
import SummaryRoomBookingDetail from "../SummaryRoomBookingDetail"
// import { getFileUrlFromAPI } from '../../../../modules/commonFunction' //
import RoomPaymentCard from "../RoomPaymentCard"
import jp from "jsonpath";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
// import SummaryDocumentDetail from "../SummaryDocumentDetail"
import { httpRequest } from "egov-ui-kit/utils/api";
// import SummaryBankDetails from "../SummaryBankDetails"
import { hashHistory } from 'react-router';
import { withRouter } from "react-router-dom";



class SummaryDetails extends Component {

    state = {
        createPACCApp: '',
        CashPaymentApplicationNumber: '',
        appStatus: '',
        currentAppStatus: '' 
    }

    componentDidMount = async () => {

        let {DataForRoomBooking,userInfo,roomToDate,roomFromDate,fetchPayment,prepareFinalObject,bothRoom} = this.props
        console.log("propsINROOMPAGE--",this.props)
 let BothRoomSelect=[];
        if(bothRoom == "Both"){
            console.log("first")
            BothRoomSelect = [
                {
                    "action": "OFFLINE_INITIATE",
                    "remarks": "string",
                    "roomBusinessService": "BKROOM",
                    "discount": this.props.discount,
                     "totalNoOfRooms": this.props.AccRoomToBook,
                      "typeOfRoom": "AC",
                    "fromDate": roomFromDate,
                    "toDate": roomToDate
                  },
                  {
                    "action": "OFFLINE_INITIATE",
                    "remarks": "string",
                    "roomBusinessService": "BKROOM",
                    "discount": this.props.discount,
                    "totalNoOfRooms": this.props.NonAccRoomToBook,
                    "typeOfRoom": "NON-AC",
                    "fromDate": roomFromDate,
                    "toDate":roomToDate
                  }]
                }

       if(bothRoom == "AC"){
        console.log("second")
        BothRoomSelect = [
            {
              "action": "OFFLINE_INITIATE",
              "remarks": "string",
              "roomBusinessService": "BKROOM",
              "discount": this.props.discount,
               "totalNoOfRooms": this.props.AccRoomToBook,
                "typeOfRoom": this.props.TypeOfRoomToBook,
              "fromDate": roomFromDate,
              "toDate": roomToDate
            }]
                    }
                if (bothRoom == "NON-AC"){
                    console.log("three")
                    BothRoomSelect = [
                        {
                          "action": "OFFLINE_INITIATE",
                          "remarks": "string",
                          "roomBusinessService": "BKROOM",
                          "discount": this.props.discount,
                           "totalNoOfRooms": this.props.NonAccRoomToBook,
                            "typeOfRoom": this.props.TypeOfRoomToBook,
                          "fromDate": roomFromDate,
                          "toDate": roomToDate
                        }]
                      
                }
console.log("BothRoomSelect--",BothRoomSelect)
            let Booking = {
            "bkRemarks": null,
            "reInitiateStatus": false,
            "bkApplicationNumber": DataForRoomBooking.bookingsModelList[0].bkApplicationNumber,
            "bkHouseNo": DataForRoomBooking.bookingsModelList[0].bkHouseNo,
            "bkAddress": null,
            "bkSector": DataForRoomBooking.bookingsModelList[0].bkSector,
            "bkVillCity": null,
            "bkAreaRequired": null,
            "bkDuration": "FULLDAY",
            "bkCategory": null,
            "bkEmail": DataForRoomBooking.bookingsModelList[0].bkEmail,
            "bkContactNo": null,
            "bkDocumentUploadedUrl": null,
            "bkDateCreated":  DataForRoomBooking.bookingsModelList[0].bkDateCreated,
            "bkCreatedBy": null,
            "bkWfStatus": null,
            "bkAmount": null,
            "bkPaymentStatus": "",
            "bkBookingType": DataForRoomBooking.bookingsModelList[0].bkBookingType,
            "bkFromDate": DataForRoomBooking.bookingsModelList[0].bkFromDate,
            "bkToDate": DataForRoomBooking.bookingsModelList[0].bkToDate,
            "bkApplicantName": DataForRoomBooking.bookingsModelList[0].bkApplicantName,
            "bkBookingPurpose": DataForRoomBooking.bookingsModelList[0].bkBookingPurpose,
            "bkVillage": null,
            "bkDimension":DataForRoomBooking.bookingsModelList[0].bkDimension,
            "bkLocation": DataForRoomBooking.bookingsModelList[0].bkLocation,
            "bkStartingDate": null,
            "bkEndingDate": null,
            "bkType": null,
            "bkResidenceProof": null,
            "bkCleansingCharges": DataForRoomBooking.bookingsModelList[0].bkCleansingCharges,
            "bkRent": DataForRoomBooking.bookingsModelList[0].bkRent,
            "bkSurchargeRent": DataForRoomBooking.bookingsModelList[0].bkSurchargeRent,
            "bkFacilitationCharges": DataForRoomBooking.bookingsModelList[0].bkFacilitationCharges,
            "bkUtgst": DataForRoomBooking.bookingsModelList[0].bkUtgst,
            "bkCgst": DataForRoomBooking.bookingsModelList[0].bkCgst,
            "bkMobileNumber": DataForRoomBooking.bookingsModelList[0].bkMobileNumber,
            "bkCustomerGstNo": DataForRoomBooking.bookingsModelList[0].bkCustomerGstNo,
            "bkCurrentCharges": null,
            "bkLocationChangeAmount": null,
            "bkVenue": null,
            "bkDate": null,
            "bkFatherName": null,
            "bkBookingVenue": DataForRoomBooking.bookingsModelList[0].bkBookingVenue,
            "bkBookingDuration": null,
            "bkIdProof": null,
            "bkApplicantContact": null,
            "bkOpenSpaceLocation": null,
            "bkLandmark": null,
            "bkRequirementArea": null,
            "bkLocationPictures": null,
            "bkParkOrCommunityCenter": null,
            "bkRefundAmount": DataForRoomBooking.bookingsModelList[0].bkRefundAmount,
            "bkBankAccountNumber": DataForRoomBooking.bookingsModelList[0].bkBankAccountNumber,
            "bkBankName": DataForRoomBooking.bookingsModelList[0].bkBankName,
            "bkIfscCode": DataForRoomBooking.bookingsModelList[0].bkIfscCode,
            "bkAccountType": DataForRoomBooking.bookingsModelList[0].bkAccountType,
            "bkBankAccountHolder": DataForRoomBooking.bookingsModelList[0].bkBankAccountHolder,
            "bkPropertyOwnerName": null,
            "bkCompleteAddress": null,
            "bkResidentialOrCommercial": null,
            "bkMaterialStorageArea": null,
            "bkPlotSketch": null,
            "bkApplicationStatus": DataForRoomBooking.bookingsModelList[0].bkApplicationStatus,
            "bkTime": null,
            "bkStatusUpdateRequest": null,
            "bkStatus": null,
            "bkDriverName": null,
            "bkVehicleNumber": null,
            "bkEstimatedDeliveryTime": null,
            "bkActualDeliveryTime": null,
            "bkNormalWaterFailureRequest": null,
            "bkUpdateStatusOption": null,
            "bkAddSpecialRequestDetails": null,
            "bkBookingTime": null,
            "bkApprovedBy": null,
            "bkModuleType": null,
            // "uuid": "5f09ffbe-db9f-41e8-a9b2-dda6515d9cc7",
            "tenantId": DataForRoomBooking.bookingsModelList[0].tenantId,
            "bkAction": DataForRoomBooking.bookingsModelList[0].bkAction,
            "bkConstructionType": null,
            "businessService": DataForRoomBooking.bookingsModelList[0].businessService,
            "bkApproverName": null,
            "assignee": null,
            "wfDocuments": null,
            "financialYear": "2020-2021",
            "financeBusinessService": "BKROOM",
            // "roomBusinessService": "BKROOM",
            "roomsModel": BothRoomSelect,
          }
        let createAppData = {
  "applicationType": "PACC",
  "applicationStatus": null,
  "applicationId": DataForRoomBooking.bookingsModelList[0].bkApplicationNumber,
  "tenantId": userInfo.tenantId,
  "Booking": Booking   
            }
        
console.log("createAppData--",createAppData)

/** 
 {
        "slot": "1PM-5PM"
      },
      {
        "slot": "5PM-9PM"
      }
 * **/

 
let payloadfund = await httpRequest(
            "bookings/community/room/_create",
            "_search",[],
            createAppData
            );

 console.log("payloadfund--",payloadfund)

 this.setState({
  
    CashPaymentApplicationNumber : payloadfund.data.roomsModel[0].roomApplicationNumber,
   
 })

 prepareFinalObject("CreateRoomApplication",payloadfund)

//  let appNumber = payloadfund.data.bkApplicationNumber
//  console.log("appNumber--",appNumber)
//  let AAppStatus = payloadfund.data.bkApplicationStatus
//  console.log("AAppStatus--",AAppStatus)

//  prepareFinalObject("CurrentApplicationNumber",appNumber)

//  this.setState({
//     createPACCApp : payloadfund,
//     CashPaymentApplicationNumber : appNumber,
//     currentAppStatus : AAppStatus
//  })



 fetchPayment(
    [{ key: "consumerCode", value: payloadfund.data.roomsModel[0].roomApplicationNumber }, { key: "businessService", value: "BKROOM" }, { key: "tenantId", value: userInfo.tenantId }
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
this.props.SetPaymentURL(`/egov-services/PaymentReceiptDteail/ForRoomBooking/${this.state.CashPaymentApplicationNumber}`);
// this.props.history.push(`/egov-services/PaymentReceiptDteail/${this.state.CashPaymentApplicationNumber}`);
// hashHistory.push(`/egov-services/PaymentReceiptDteail/${this.state.CashPaymentApplicationNumber}`);
// this.props.history.push(`/egov-services/ApplyRoomBooking`);  
// hashHistory.push('/egov-services/PaymentReceiptDteail/${this.state.CashPaymentApplicationNumber}`);
}

    render() {
        // const { firstName, fCharges,result, email, mobileNo, locality, surcharge, fromDate, toDate, facilationChargesSuccess,
        //     onFromDateChange, onToDateChange, utGST, cGST, GSTnumber, handleChange, bankName, amount, transactionDate, transactionNumber, paymentMode,
        //     dimension, location, facilitationCharges, cleaningCharges, rent, approverName, comment, houseNo, type, purpose, residenials, documentMap,
        //     BK_FEE_HEAD_PACC,LUXURY_TAX,REFUNDABLE_SECURITY,PACC_TAX,totalAmountSuPage,one,two,three,four,five,six,
        //     PACPACC_ROUND_OFFC_TAX,FACILITATION_CHARGE,InitiateAppNumber,seven,
        //     BankAccountName,NomineeName,BankAccountNumber,IFSCCode,AccountHolderName,accountType,
        //     } = this.props;
            
        //     console.log(",one,two,three,four,five,six--",one,two,three,four,five,six)
        //     console.log("propsInRendersummary--",this.props)
        //     let fc = fCharges?fCharges.facilitationCharge:'100';
        //     console.log("stateofBooking--",this.state.createPACCApp)

            
        return (
            <div>
                <div className="form-without-button-cont-generic">
                    <div classsName="container">
                        <div className="col-xs-12">

                            <RoomPaymentCard
                            TotalAmount={this.props.TotalAmount}
                            BKROOM_TAX={this.props.BKROOM_TAX}
                            BKROOM={this.props.BKROOM}
                            BKROOM_ROUND_OFF={this.props.BKROOM_ROUND_OFF}
                            four={this.props.four}
                            />
                           

<SummaryCCBookingDetail 
Name={this.props.Name}    
purpose={this.props.purpose}
houseNo={this.props.houseNo}
mobileNo={this.props.mobileNo}
Sector={this.props.Sector}
gstNo={this.props.gstNo}
ProofOfResidence={this.props.ProofOfResidence}
                            />

                            <SummaryVenueDetail
                                 location={this.props.location}
                                 NoOfDays={this.props.NoOfDays}
                                 locality={this.props.locality}
                                 fromDate={this.props.fromDate}
                                 toDate={this.props.toDate}
                                 dimension={this.props.dimension}
                                 RefundableSecurity={this.props.RefundableSecurity}
                                 cleaningCharges={this.props.cleaningCharges}
                                 Rent={this.props.Rent}
                                 utgst={this.props.utgst}
                                 cgst={this.props.cgst}
                                 surcharge={this.props.surcharges}
                                 facilitationCharges={this.props.facilitationCharges}
                            />                   
                            <SummaryRoomBookingDetail
                                RoomBookingData={this.props.RoomBookingData}
                                AccRoomToBook={this.props.AccRoomToBook}
                                NonAccRoomToBook={this.props.NonAccRoomToBook}
                            />
                            {/* <SummaryBankDetails   
                                BankAccountName={BankAccountName}
                                NomineeName={NomineeName}
                                BankAccountNumber={BankAccountNumber}
                                IFSCCode={IFSCCode}
                                AccountHolderName={AccountHolderName}
                                accountType={accountType}
                            /> */}
                            {/* <SummaryDocumentDetail
                                documentMap={documentMap}
                            /> */}
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
    const { userInfo } = state.auth;

    let SetPaymentURL = state.screenConfiguration.preparedFinalObject ? state.screenConfiguration.preparedFinalObject.SetPaymentURL : "NA"
console.log("SetPaymentURL-SetPaymentURL",SetPaymentURL)
let DataForRoomBooking = state.screenConfiguration.preparedFinalObject ? state.screenConfiguration.preparedFinalObject.RoomBookingData : "NA"
    const { paymentData } = bookings;
    let paymentDataOne = paymentData ? paymentData : "wrong";
    console.log("paymentDataOne--",paymentDataOne)

    let bothRoom = state.screenConfiguration.preparedFinalObject ?
     (state.screenConfiguration.preparedFinalObject.GlobalTypeOfRoom !== undefined && state.screenConfiguration.preparedFinalObject.GlobalTypeOfRoom !== null ?state.screenConfiguration.preparedFinalObject.GlobalTypeOfRoom : 'NA'): "NA"
console.log("bothRoom--",bothRoom)
    let billAccountDetailsArray =  paymentDataOne ? paymentDataOne.Bill[0].billDetails[0].billAccountDetails : "NOt found Any Array"
console.log("billAccountDetailsArray--",billAccountDetailsArray)
let TotalAmount = paymentDataOne.Bill[0].totalAmount
let BKROOM_TAX = 0;
let BKROOM = 0;
let BKROOM_ROUND_OFF = 0;   
let four = 0;

for(let i = 0; i < billAccountDetailsArray.length ; i++ ){

    if(billAccountDetailsArray[i].taxHeadCode == "BKROOM_TAX"){
        BKROOM_TAX = billAccountDetailsArray[i].amount
    }
    else if(billAccountDetailsArray[i].taxHeadCode == "BKROOM"){
        BKROOM = billAccountDetailsArray[i].amount
    }
    else if(billAccountDetailsArray[i].taxHeadCode == "BKROOM_ROUND_OFF"){
        BKROOM_ROUND_OFF = billAccountDetailsArray[i].amount
    }
    else if(billAccountDetailsArray[i].taxHeadCode == "ROOM_FACILITATION_CHARGE"){
        four = billAccountDetailsArray[i].amount
    }
}
console.log("BKROOM_TAX-BKROOM-BKROOM_ROUND_OFF",BKROOM_TAX,BKROOM,BKROOM_ROUND_OFF)

// console.log("one--",one)
// console.log("two--",two)
// console.log("three--",three)
// console.log("four--",four)
// console.log("five--",five)
// console.log("six--",six)
// console.log("seven--",seven ? seven : "sdfg")

//     let myLocation = state.screenConfiguration.preparedFinalObject ? state.screenConfiguration.preparedFinalObject.availabilityCheckData:"";  
//     let myLocationtwo = myLocation?myLocation.bkLocation:"";  

//     let NewAppNumber =  state.screenConfiguration.preparedFinalObject.CurrentApplicationNumber ? state.screenConfiguration.preparedFinalObject.CurrentApplicationNumber : "NotDetemine";
//     console.log("NewAppNumber--",NewAppNumber)

//     let tryMyNumber;

//     if(NewAppNumber != "NotDetemine"){
//         tryMyNumber = NewAppNumber && NewAppNumber;
//     }
//     console.log("tryMyNumber--",tryMyNumber)

//     let InitiateAppNumber = NewAppNumber && NewAppNumber ? NewAppNumber : "NotDetemine";
    
//     console.log("InitiateAppNumber--",InitiateAppNumber)
//     let fCharges;
//     if (arrayName && arrayName.length > 0) {
//       arrayName.forEach((item) => {
//         item.forEach((value) => {
//           if (value.code == "FACILITATION_CHARGE") { 
//             fCharges = value
//           }
//         })
//       })
//     }

//     let documentMap = state.screenConfiguration.preparedFinalObject ? state.screenConfiguration.preparedFinalObject.documentMap : "";
//     let bkLocation = state.screenConfiguration.preparedFinalObject ? state.screenConfiguration.preparedFinalObject.availabilityCheckData.bkLocation : "";
   
//    let checkAppStatus = state.bookings.applicationData ? state.bookings.applicationData.bookingsModelList[0].bkApplicationStatus : "NOTFOUND";
//    console.log("checkAppStatus--",checkAppStatus)

//    let checkAppNum = state.bookings.applicationData ? state.bookings.applicationData.bookingsModelList[0].bkApplicationNumber : "NOTFOUND";
//    console.log("checkAppStatus--bkApplicationNumber",checkAppNum)

//    let DropDownValue = state.screenConfiguration.preparedFinalObject ? state.screenConfiguration.preparedFinalObject.bkBookingData.name : "";
//    console.log("DropDownValue--",DropDownValue)
//    let SecTimeSlotFromTime = ""
//    let SecTimeSlotToTime = ""
//    let firstToTimeSlot = ""
//    let firstTimeSlotValue = ""
//    let first  = ""
//    let conJsonfirst = ""
//    let SecondTimeSlotValue = ""
//    let second = ""
//    let conJsonSecond = ""
// //HALL FOR 4 HOURS AT COMMUNITY CENTRE SECTOR 39 CHANDIGARH
//    if(DropDownValue === "HALL FOR 4 HOURS AT COMMUNITY CENTRE SECTOR 39 CHANDIGARH"){

//     SecTimeSlotFromTime = state.screenConfiguration.preparedFinalObject.Booking.bkFromTimeTwo && state.screenConfiguration.preparedFinalObject.Booking.bkFromTimeTwo || "notFound"
//     console.log("SecTimeSlotFromTime--",SecTimeSlotFromTime)//screenConfiguration.preparedFinalObject.Booking.bkFromTimeTwo
  
//     SecTimeSlotToTime = state.screenConfiguration.preparedFinalObject.Booking.bkToTimeTwo && state.screenConfiguration.preparedFinalObject.Booking.bkToTimeTwo || "notFound"
//     console.log("SecTimeSlotToTime--",SecTimeSlotToTime)
//      //OFFLINE_APPLIED
  
//      firstToTimeSlot = state.screenConfiguration.preparedFinalObject.Booking.bkToTimeTwo && state.screenConfiguration.preparedFinalObject.Booking.bkToTime || "notFound"
//     console.log("firstToTimeSlot--",firstToTimeSlot)
  
  
//   //Booking.wholeDay
//   // let wholeDaySlot = state.screenConfiguration.preparedFinalObject.Booking.wholeDay && state.screenConfiguration.preparedFinalObject.Booking.wholeDay || "notFound"
//   // console.log("wholeDaySlot--",wholeDaySlot)
  
//   // let firstTimeSlotValue = state.screenConfiguration.preparedFinalObject.Booking.timeslots !== undefined ? state.screenConfiguration.preparedFinalObject.Booking.timeslots[0] : "notFound"
//   // console.log("firstTimeSlotValue-",firstTimeSlotValue)
  
//   firstTimeSlotValue = 
//     state.screenConfiguration.preparedFinalObject.Booking !== undefined ?
//     (state.screenConfiguration.preparedFinalObject.Booking.timeslots !== undefined ? (state.screenConfiguration.preparedFinalObject.Booking.timeslots[0] !== undefined ? state.screenConfiguration.preparedFinalObject.Booking.timeslots[0] : "notFound") : "notFound") :
//     "notFound"
  
 
//   if(firstTimeSlotValue !== "notFound"){
//       first=firstTimeSlotValue 
//   console.log("first--",first)
//   }
  
 
//   if(firstTimeSlotValue !== "notFound"){
//   conJsonfirst= JSON.stringify(firstTimeSlotValue);
//   console.log("conJsconJsonfirston--",conJsonfirst)
//   }
//   // let SecondTimeSlotValue = state.screenConfiguration.preparedFinalObject.Booking.timeslotsTwo !== undefined ? state.screenConfiguration.preparedFinalObject.Booking.timeslotsTwo[0] : "notFound"
//   // console.log("SecondTimeSlotValue-",SecondTimeSlotValue)
  
//    SecondTimeSlotValue = 
//     state.screenConfiguration.preparedFinalObject.Booking !== undefined ?
//     (state.screenConfiguration.preparedFinalObject.Booking.timeslotsTwo !== undefined ? (state.screenConfiguration.preparedFinalObject.Booking.timeslotsTwo[0] !== undefined ? state.screenConfiguration.preparedFinalObject.Booking.timeslotsTwo[0] : "notFound") : "notFound") :
//     "notFound"
  
 
//   if(SecondTimeSlotValue !== "notFound"){
//       second=SecondTimeSlotValue 
//   console.log("second--",second)
//   }
  
//   if(SecondTimeSlotValue !== "notFound"){
//   conJsonSecond = JSON.stringify(SecondTimeSlotValue);
//   console.log("conJsonSecond--",conJsonSecond)
//   }
  

//    }

   
    return { four,
     state,DataForRoomBooking,userInfo,TotalAmount,BKROOM_TAX,BKROOM,BKROOM_ROUND_OFF,SetPaymentURL,bothRoom
        //BK_FEE_HEAD_PACC,LUXURY_TAX,REFUNDABLE_SECURITY,PACC_TAX,  wholeDay !== undefined ? 
        //PACPACC_ROUND_OFFC_TAX,FACILITATION_CHARGE,
        // firstTimeSlotValue,SecondTimeSlotValue,first,second,
        // createPACCApplicationData,userInfo,InitiateAppNumber,SecTimeSlotFromTime,SecTimeSlotToTime,firstToTimeSlot,conJsonSecond,conJsonfirst,
        // documentMap, bkLocation, facilationChargesSuccess,seven,
        // fCharges,myLocationtwo,totalAmountSuPage,one,two,three,four,five,six,checkAppStatus,checkAppNum
    }
 
}
const mapDispatchToProps = dispatch => {
    return {

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