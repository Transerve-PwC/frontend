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
import SummaryBankDetails from "../SummaryBankDetails"

class SummaryDetails extends Component {

    state = {
        createPACCApp: '',
        CashPaymentApplicationNumber: '',
        appStatus: '',
        currentAppStatus: ''
    }

    componentDidMount = async () => {
       
        let {createPACCApplication, userInfo, documentMap,fetchPayment,prepareFinalObject,fetchApplications,conJsonSecond,conJsonfirst } = this.props;
        let { DiscountReason,firstName, venueType, bokingType, bookingData, email, mobileNo, surcharge, fromDate, toDate,myLocationtwo,ReasonForDiscount,
            utGST, cGST, GSTnumber, dimension, location, facilitationCharges, cleaningCharges, rent, houseNo, type, purpose, 
            BankAccountName,NomineeName,BankAccountNumber,IFSCCode,AccountHolderName,accountType,SecTimeSlotFromTime,SecTimeSlotToTime,
            locality, residenials, facilationChargesSuccess,discountType,checkAppStatus,checkAppNum,firstToTimeSlot } = this.props;
console.log("this.propos--insummaryPage--",this.props)
console.log("discountType--",discountType)
console.log("newConsole--ut",utGST)

console.log("checkAppStatus-props-",checkAppStatus ? checkAppStatus : "notFound")
console.log("checkAppStatus-props-",checkAppNum ? checkAppNum : "notFound")
this.setState({
    appStatus : checkAppStatus
})

let sendCurrentStatus;
if(checkAppStatus){
    if(checkAppStatus == "NOTFOUND"){
        sendCurrentStatus = "OFFLINE_INITIATE"
    }
   else if(checkAppStatus == "OFFLINE_APPLIED"){
       sendCurrentStatus = "OFFLINE_RE_INITIATE"
   }
}

prepareFinalObject("SummaryutGST",this.props.utGST);
prepareFinalObject("SummarycGST",this.props.cGST);
prepareFinalObject("Summarysurcharge",this.props.surcharge);


prepareFinalObject("cGSTSummary",cGST);


let newDisCount;
let finalDiscount;
if(discountType == "50%"){
newDisCount = 50; 
finalDiscount = Number(newDisCount);
console.log("newDisCount--",newDisCount)
console.log("finalDiscount--",finalDiscount)
}
else if(discountType == "20%"){
    newDisCount = 20; 
    finalDiscount = Number(newDisCount);
    console.log("newDisCount--",newDisCount)
    console.log("finalDiscount--",finalDiscount)
    }
    else if (discountType == '100%' || discountType == "KirayaBhog" || discountType == "ReligiousFunction"){
        newDisCount = 100; 
        finalDiscount = Number(newDisCount);
        console.log("newDisCount--",newDisCount)
        console.log("finalDiscount--",finalDiscount)
        } 
        else{
            newDisCount = 0; 
            finalDiscount = Number(newDisCount);
            console.log("newDisCount--",newDisCount)
            console.log("finalDiscount--",finalDiscount)
            }


        let fid = documentMap ? Object.keys(documentMap) : ""
        let Booking = {
            "uuid": userInfo.uuid,
           "bkRemarks": DiscountReason,
            "discount": finalDiscount,
            "bkBookingType": venueType,
            "bkBookingVenue": bokingType,
            "bkApplicantName": firstName,
            "bkMobileNumber": mobileNo,
            "bkDimension": dimension,
            "bkLocation": myLocationtwo,
            "bkFromDate": fromDate,
            "bkToDate": toDate,
            "bkCleansingCharges": cleaningCharges,
            "bkRent": rent,
            "bkSurchargeRent": surcharge,
            "bkUtgst": utGST,
            "bkCgst": cGST,
            "bkSector": locality,
            "bkEmail": email,
            "bkHouseNo": houseNo,
            "bkBookingPurpose": purpose,
            // "bkPaymentStatus": checkAppStatus == "OFFLINE_APPLIED" ? "SUCCESS" : "",  
            "bkPaymentStatus": checkAppStatus == "OFFLINE_APPLIED" ? "SUCCESS" : "",
            "bkApplicationNumber": checkAppNum !== "NOTFOUND" ? checkAppNum : null,
            "bkCustomerGstNo": GSTnumber,
            "wfDocuments": [{
                "fileStoreId": fid[0]
            }],
            "tenantId": userInfo.tenantId,
            // "bkAction": checkAppStatus == "OFFLINE_APPLIED" ? "OFFLINE_RE_INITIATE" : "OFFLINE_INITIATE", //sendCurrentStatus
            "bkAction": sendCurrentStatus,
            "businessService": "PACC",
            "financeBusinessService": "PACC",
            "reInitiateStatus": checkAppStatus == "OFFLINE_APPLIED" ? true : false,
            "financialYear": "2020-2021",
            "bkBankAccountNumber":BankAccountNumber,
            "bkBankName":BankAccountName,
            "bkIfscCode":IFSCCode,
            "bkAccountType":accountType,
            "bkBankAccountHolder":AccountHolderName,
            
        }

if (venueType == "Community Center" && bookingData && bookingData.bkFromTime) {
let slotArray = []
let checkslotArray = []
// if(wholeDaySlot != "notFound" && wholeDaySlot != "notFound"){
//     console.log("OneDay")
//     checkslotArray[0] = {"slot":"9AM - 1PM"}
//     checkslotArray[1] = {"slot": "1PM - 5PM"}
//     checkslotArray[2] = {"slot": "5PM - 9PM"}
// }
if(SecTimeSlotFromTime != "notFound" && SecTimeSlotToTime != "notFound"){
    console.log("secondTimeSlot")
    slotArray[0] = conJsonfirst,
    slotArray[1] = conJsonSecond //conJsonSecond,conJsonfirst  ,second

    checkslotArray[0] = this.props.first,
    checkslotArray[1] = this.props.second
}
else{
    console.log("oneTimeSlot")
	checkslotArray[0] = {
	"slot": bookingData.bkFromTime + '-' + firstToTimeSlot
	}
}
console.log("slotArray_",slotArray)   //checkslotArray
console.log("checkslotArray",checkslotArray)
				Booking.timeslots = checkslotArray,
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
        let createAppData = {
             
                "applicationType": "PACC",
                "applicationStatus": "",
                "applicationId": checkAppNum !== "NOTFOUND" ? checkAppNum : null,
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
            "bookings/park/community/_create",
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
    [{ key: "consumerCode", value: appNumber }, { key: "businessService", value: "PACC" }, { key: "tenantId", value: userInfo.tenantId }
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
        const { firstName, fCharges,result, email, mobileNo, locality, surcharge, fromDate, toDate, facilationChargesSuccess,
            onFromDateChange, onToDateChange, utGST, cGST, GSTnumber, handleChange, bankName, amount, transactionDate, transactionNumber, paymentMode,
            dimension, location, facilitationCharges, cleaningCharges, rent, approverName, comment, houseNo, type, purpose, residenials, documentMap,
            BK_FEE_HEAD_PACC,LUXURY_TAX,REFUNDABLE_SECURITY,PACC_TAX,totalAmountSuPage,one,two,three,four,five,six,
            PACPACC_ROUND_OFFC_TAX,FACILITATION_CHARGE,InitiateAppNumber,seven,
            BankAccountName,NomineeName,BankAccountNumber,IFSCCode,AccountHolderName,accountType,
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
one={one} 
two={two}
three={three} 
four={four}
five={five}
six={six}
seven={seven && seven ? seven :"notfound"}
REFUNDABLE_SECURITY={REFUNDABLE_SECURITY}
PACC_TAX={PACC_TAX}
PACPACC_ROUND_OFFC_TAX={PACPACC_ROUND_OFFC_TAX}
FACILITATION_CHARGE={FACILITATION_CHARGE}
totalAmountSuPage={totalAmountSuPage}
                                amount={amount}
                                cGST={cGST}
                                utGST={utGST}
                                fc={fc}
                                firstStep={this.firstStep}
                                currentAppStatus= {this.state.currentAppStatus && this.state.currentAppStatus}
                            />

                            <SummaryApplicantDetail
                             firstStep={this.firstStep}
                                firstName={firstName}
                                email={email}
                                mobileNo={mobileNo}
                            />                   
                            <SummaryApplicationDetail
                             firstStep={this.firstStep}
                                purpose={purpose}
                                locality={locality}
                                dimension={dimension}
                                fromDate={fromDate}
                                toDate={toDate}
                                cleaningCharges={cleaningCharges}
                                rent={rent}
                                surcharge={this.props.surcharge}
                                cGST={this.props.cGST}
                                utGST={this.props.utGST}
                                GSTnumber={GSTnumber}
                            />
                            <SummaryBankDetails  
                               firstStep={this.firstStep} 
                                BankAccountName={BankAccountName}
                                NomineeName={NomineeName}
                                BankAccountNumber={BankAccountNumber}
                                IFSCCode={IFSCCode}
                                AccountHolderName={AccountHolderName}
                                accountType={accountType}
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
 

    let ReasonForDiscount = state.screenConfiguration.preparedFinalObject ? 
    (state.screenConfiguration.preparedFinalObject.ReasonForDiscount !== undefined && state.screenConfiguration.preparedFinalObject.ReasonForDiscount !== null ? (state.screenConfiguration.preparedFinalObject.ReasonForDiscount):'NA') :"NA";  

    console.log("ReasonForDiscount--",ReasonForDiscount)

    let billAccountDetailsArray =  checkBillLength ? paymentDataOne.Bill[0].billDetails[0].billAccountDetails : "NOt found Any Array"
    console.log("billAccountDetailsArray--",billAccountDetailsArray)
    let one = 0;
    let two = 0;
    let three = 0;
    let four = 0;
    let five = 0;
    let six = 0;
    let seven = 0;
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
    else if(billAccountDetailsArray[i].taxHeadCode == "PACC_LOCATION_AND_VENUE_CHANGE_AMOUNT"){
        seven = billAccountDetailsArray[i].amount
    }
}

console.log("one--",one)
console.log("two--",two)
console.log("three--",three)
console.log("four--",four)
console.log("five--",five)
console.log("six--",six)
console.log("seven--",seven ? seven : "sdfg")

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
   let checkAppStatus = 'NOTFOUND';
   let checkAppNum = 'NOTFOUND';
   let createInitateApp = bookings ? (bookings.applicationData ?(bookings.applicationData.bookingsModelList.length > 0 ? (bookings.applicationData.bookingsModelList): 'NA'): 'NA'): "NA"
  console.log("createInitateApp--createInitateApp",createInitateApp)
   if(createInitateApp !== "NA"){
    console.log("comeInFoundCondition")
    checkAppStatus = state.bookings.applicationData ? state.bookings.applicationData.bookingsModelList[0].bkApplicationStatus : "NOTFOUND";
    console.log("checkAppStatus-id",checkAppStatus)
    checkAppNum = state.bookings.applicationData ? state.bookings.applicationData.bookingsModelList[0].bkApplicationNumber : "NOTFOUND";
    console.log("checkAppNum-id",checkAppNum)   
}
   
   console.log("checkAppStatus--",checkAppStatus)
   console.log("checkAppNum--",checkAppNum)
// checkAppStatus = state.bookings.applicationData ? state.bookings.applicationData.bookingsModelList[0].bkApplicationStatus : "NOTFOUND";
   let DropDownValue = state.screenConfiguration.preparedFinalObject ? state.screenConfiguration.preparedFinalObject.bkBookingData.name : "";
   console.log("DropDownValue--",DropDownValue)
   let SecTimeSlotFromTime = ""
   let SecTimeSlotToTime = ""
   let firstToTimeSlot = ""
   let firstTimeSlotValue = ""
   let first  = ""
   let conJsonfirst = ""
   let SecondTimeSlotValue = ""
   let second = ""
   let conJsonSecond = ""
//HALL FOR 4 HOURS AT COMMUNITY CENTRE SECTOR 39 CHANDIGARH
   if(DropDownValue === "HALL FOR 4 HOURS AT COMMUNITY CENTRE SECTOR 39 CHANDIGARH"){

    SecTimeSlotFromTime = state.screenConfiguration.preparedFinalObject.Booking.bkFromTimeTwo && state.screenConfiguration.preparedFinalObject.Booking.bkFromTimeTwo || "notFound"
    console.log("SecTimeSlotFromTime--",SecTimeSlotFromTime)//screenConfiguration.preparedFinalObject.Booking.bkFromTimeTwo
  
    SecTimeSlotToTime = state.screenConfiguration.preparedFinalObject.Booking.bkToTimeTwo && state.screenConfiguration.preparedFinalObject.Booking.bkToTimeTwo || "notFound"
    console.log("SecTimeSlotToTime--",SecTimeSlotToTime)
     //OFFLINE_APPLIED
  
     firstToTimeSlot = state.screenConfiguration.preparedFinalObject.Booking.bkToTimeTwo && state.screenConfiguration.preparedFinalObject.Booking.bkToTime || "notFound"
    console.log("firstToTimeSlot--",firstToTimeSlot)
  
  
  //Booking.wholeDay
  // let wholeDaySlot = state.screenConfiguration.preparedFinalObject.Booking.wholeDay && state.screenConfiguration.preparedFinalObject.Booking.wholeDay || "notFound"
  // console.log("wholeDaySlot--",wholeDaySlot)
  
  // let firstTimeSlotValue = state.screenConfiguration.preparedFinalObject.Booking.timeslots !== undefined ? state.screenConfiguration.preparedFinalObject.Booking.timeslots[0] : "notFound"
  // console.log("firstTimeSlotValue-",firstTimeSlotValue)
  
  firstTimeSlotValue = 
    state.screenConfiguration.preparedFinalObject.Booking !== undefined ?
    (state.screenConfiguration.preparedFinalObject.Booking.timeslots !== undefined ? (state.screenConfiguration.preparedFinalObject.Booking.timeslots[0] !== undefined ? state.screenConfiguration.preparedFinalObject.Booking.timeslots[0] : "notFound") : "notFound") :
    "notFound"
  
 
  if(firstTimeSlotValue !== "notFound"){
      first=firstTimeSlotValue 
  console.log("first--",first)
  }
  
 
  if(firstTimeSlotValue !== "notFound"){
  conJsonfirst= JSON.stringify(firstTimeSlotValue);
  console.log("conJsconJsonfirston--",conJsonfirst)
  }
  // let SecondTimeSlotValue = state.screenConfiguration.preparedFinalObject.Booking.timeslotsTwo !== undefined ? state.screenConfiguration.preparedFinalObject.Booking.timeslotsTwo[0] : "notFound"
  // console.log("SecondTimeSlotValue-",SecondTimeSlotValue)
  
   SecondTimeSlotValue = 
    state.screenConfiguration.preparedFinalObject.Booking !== undefined ?
    (state.screenConfiguration.preparedFinalObject.Booking.timeslotsTwo !== undefined ? (state.screenConfiguration.preparedFinalObject.Booking.timeslotsTwo[0] !== undefined ? state.screenConfiguration.preparedFinalObject.Booking.timeslotsTwo[0] : "notFound") : "notFound") :
    "notFound"
  
 
  if(SecondTimeSlotValue !== "notFound"){
      second=SecondTimeSlotValue 
  console.log("second--",second)
  }
  
  if(SecondTimeSlotValue !== "notFound"){
  conJsonSecond = JSON.stringify(SecondTimeSlotValue);
  console.log("conJsonSecond--",conJsonSecond)
  }
  

   }

   
    return {
        //BK_FEE_HEAD_PACC,LUXURY_TAX,REFUNDABLE_SECURITY,PACC_TAX,  wholeDay !== undefined ? 
        //PACPACC_ROUND_OFFC_TAX,FACILITATION_CHARGE,
        firstTimeSlotValue,SecondTimeSlotValue,first,second,ReasonForDiscount,
        createPACCApplicationData,userInfo,InitiateAppNumber,SecTimeSlotFromTime,SecTimeSlotToTime,firstToTimeSlot,conJsonSecond,conJsonfirst,
        documentMap, bkLocation, facilationChargesSuccess,seven,
        fCharges,myLocationtwo,totalAmountSuPage,one,two,three,four,five,six,checkAppStatus,checkAppNum
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