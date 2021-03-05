import React, { Component } from "react"; 
import { Button, Icon } from "components";
import Label from "egov-ui-kit/utils/translationNode";
import SuccessMessageForPayment from "../../modules/SuccessMessageForPayment";
import { connect } from "react-redux";
import { createWaterTankerApplication, downloadBWTApplication,downloadReceiptForPCC } from "../../redux/bookings/actions";
import jp from "jsonpath";
import "./index.css";
import { SortDialog, Screen } from "modules/common";
import isEmpty from "lodash/isEmpty";
import {
	downloadEsamparkApp,updatePACCApplication
} from "egov-ui-kit/redux/bookings/actions";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { convertEpochToDate, getDurationDate,getFileUrlFromAPI} from '../../modules/commonFunction'
import { httpRequest } from "egov-ui-kit/utils/api";

class CreateWBTApplicationSuccess extends Component {


  NumInWords = (number) => {
		const first = [
			"",
			"One ",
			"Two ",
			"Three ",
			"Four ",
			"Five ",
			"Six ",
			"Seven ",
			"Eight ",
			"Nine ",
			"Ten ",
			"Eleven ",
			"Twelve ",
			"Thirteen ",
			"Fourteen ",
			"Fifteen ",
			"Sixteen ",
			"Seventeen ",
			"Eighteen ",
			"Nineteen ",
		];
		const tens = [
			"",
			"",
			"Twenty",
			"Thirty",
			"Forty",
			"Fifty",
			"Sixty",
			"Seventy",
			"Eighty",
			"Ninety",
		];
		const mad = ["", "Thousand", "Million", "Billion", "Trillion"];
		let word = "";

		for (let i = 0; i < mad.length; i++) {
			let tempNumber = number % (100 * Math.pow(1000, i));
			if (Math.floor(tempNumber / Math.pow(1000, i)) !== 0) {
				if (Math.floor(tempNumber / Math.pow(1000, i)) < 20) {
					word =
						first[Math.floor(tempNumber / Math.pow(1000, i))] +
						mad[i] +
						" " +
						word;
				} else {
					word =
						tens[Math.floor(tempNumber / (10 * Math.pow(1000, i)))] +
						first[Math.floor(tempNumber / Math.pow(1000, i)) % 10] +
						mad[i] +
						" " +
						word;
				}
			}

			tempNumber = number % Math.pow(1000, i + 1);
			if (Math.floor(tempNumber / (100 * Math.pow(1000, i))) !== 0)
				word =
					first[Math.floor(tempNumber / (100 * Math.pow(1000, i)))] +
					"Hunderd " +
					word;
		}
		return word + "Rupees Only";
	};


  Submit = async () => {
	//   alert("comesInSubmit Function")
   let { conJsonSecond,conJsonfirst,updatePACCApplication, documentMap,createAppData, bookingData, venueType,prepareFinalObject,createPACCApplicationData,SecTimeSlotFromTime,SecTimeSlotToTime,firstToTimeSlot,ReasonForDiscount} = this.props;
console.log("AllPropsOfSubmitPage--",this.props)	   
   let data = createAppData.data
		console.log("data--",data)
        // let data  = dataOne;
        // console.log("data--",data),
        prepareFinalObject("CreatePaccAppData",data);
        let fid = documentMap ? Object.keys(documentMap) : ""
        const { firstName, userInfo, email, mobileNo, surcharge, fromDate, toDate, utGST, cGST, GSTnumber, dimension, location, facilitationCharges, cleaningCharges, rent, houseNo, type, purpose, locality, residenials } = this.props;
     
        if (data) {
			console.log("HereIsData--",data)
            let Booking = {
				bkRemarks: ReasonForDiscount,
				discount:data.discount,
                bkBookingType: data.bkBookingType,
                bkBookingVenue: data.bkBookingVenue,
                bkApplicantName: data.bkApplicantName,
                bkMobileNumber: data.bkMobileNumber,
				bkDimension: data.bkDimension,
				bkPaymentStatus: "SUCCESS",
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
                "bkAction": data.bkApplicationStatus == "OFFLINE_RE_INITIATED" ? "OFFLINE_MODIFY" : "OFFLINE_APPLY",
				"businessService": "PACC",
				"reInitiateStatus": false,
				"financialYear": "2020-2021",
				"bkBankAccountNumber":data.bkBankAccountNumber,
				"bkBankName":data.bkBankName,
				"bkIfscCode":data.bkIfscCode,
				"bkAccountType":data.bkAccountType,
				"bkBankAccountHolder":data.bkBankAccountHolder
            }


            if (venueType == "Community Center" && bookingData && bookingData.bkFromTime) {
				let slotArray = []
				let checkslotArray = []
				// if(wholeDaySlot != "notFound" && wholeDaySlot != "notFound"){
				// 	console.log("OneDay")
				// 	checkslotArray[0] = {"slot":"9AM - 1PM"}
				// 	checkslotArray[1] = {"slot": "1PM - 5PM"}
				// 	checkslotArray[2] = {"slot": "5PM - 9PM"}
				// }
				if(SecTimeSlotFromTime != "notFound" && SecTimeSlotToTime != "notFound"){
					console.log("secondTimeSlot")
					slotArray[0] = conJsonfirst,
					slotArray[1] = conJsonSecond //conJsonSecond,conJsonfirst
				
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

console.log("Booking-requestBody--",Booking)

 await updatePACCApplication(
                {
                    "applicationType": "PACC",
                    "applicationStatus": "",
                    "applicationId": data.bkApplicationNumber,
                    "tenantId": userInfo.tenantId,
                    "Booking": Booking
				});
				
            this.props.history.push(`/egov-services/create-success-pcc`);
        }
  };
//   componentDidMount = async () => {   


//   }

	downloadPaymentReceiptButton = async (e) => {
		this.downloadPaymentReceiptFunction();
		let documentsPreviewData;
		const { DownloadReceiptDetailsforPCC,userInfo } = this.props;
		var documentsPreview = [];
		if (DownloadReceiptDetailsforPCC && DownloadReceiptDetailsforPCC.filestoreIds.length > 0) {
			documentsPreviewData = DownloadReceiptDetailsforPCC.filestoreIds[0];
			documentsPreview.push({
				title: "DOC_DOC_PICTURE",
				fileStoreId: documentsPreviewData,
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

  downloadPaymentReceiptFunction = async (e) => {
    const {  paymentDetailsForReceipt, downloadReceiptForPCC, userInfo, selectedComplaint,offlineTransactionNum,
      offlineTransactionDate,offlinePayementMode,location,RecNumber,totalAmountPaid,six,one,Summarysurcharge,cleanOne,SummarycGST } = this.props;
	//offlineTransactionNum,offlineTransactionDate,offlinePayementMode	
		let BookingInfo = [{
			"applicantDetail": {
				"name": selectedComplaint.bkApplicantName,
				"mobileNumber": selectedComplaint.bkMobileNumber,
				"houseNo": selectedComplaint.bkHouseNo,
				"permanentAddress": "",
				"permanentCity": "ch.chandigarh",
				"sector": selectedComplaint.bkSector
			},
			"booking": {
				"bkApplicationNumber": selectedComplaint.bkApplicationNumber
			},
			"paymentInfo": {
				"paymentDate": convertEpochToDate(offlineTransactionDate, "dayend"),
				"transactionId": offlineTransactionNum,
				"bookingPeriod": getDurationDate(
					selectedComplaint.bkFromDate,
					selectedComplaint.bkToDate
        ),
				"bookingItem": `Online Payment Against Booking of ${location}`,
				"amountInWords": this.NumInWords(
					totalAmountPaid
				),
        paymentItemExtraColumnLabel: "Booking Period",
				"paymentMode": offlinePayementMode,
				"receiptNo": RecNumber,
				"baseCharge": one,
				"cleaningCharges": cleanOne,
				"surcharges": Summarysurcharge,
				"facilitationCharge": six,
				"utgst": SummarycGST,
				"cgst": SummarycGST,
				"gst": SummarycGST,
				"totalAmount": totalAmountPaid
			},
			"payerInfo": {
				"payerName":  selectedComplaint.bkApplicantName,
				"payerMobile":  selectedComplaint.bkMobileNumber
			},
			"generatedBy": {
				"generatedBy": userInfo.name,
			},
			"tenantInfo": {
				"municipalityName": "Municipal Corporation Chandigarh",
				"address": "New Deluxe Building, Sector 17, Chandigarh",
				"contactNumber": "+91-172-2541002, 0172-2541003"
			}
		}
		]

		downloadReceiptForPCC({ BookingInfo: BookingInfo })
	}

	// downloadpermissionletter = async = (e) => {
	// 	alert("hlo")
	// }

  render() {
  const { RecNumber,createWaterTankerApplicationData,myLocationtwo, downloadBWTApplication,loading,createPACCApplicationData, updatePACCApplicationData,AppNum} = this.props;
	console.log("this.props-in-paymentSuccessForEmp-",this.props)
	console.log(RecNumber?RecNumber:"notfound","RecNumber")
	console.log("AppNum--",AppNum?AppNum:"non")
    //BK_MYBK_PCC_CREATE_APPLICATION_HEADER
    // Park And Community Centre

    console.log("InSuccessPage--",
    { labelName: "BK_MYBK_APPLY_SPECIAL_REQUEST_HEADER-Value", labelKey: "BK_MYBK_APPLY_SPECIAL_REQUEST_HEADER" },
    { labelName: "BK_ES_APPLICATION_CREATED_SUCCESS_MESSAGE--", labelKey: "BK_ES_APPLICATION_CREATED_SUCCESS_MESSAGE" },
    { labelName: "BK_CS_COMMON_SEND_MESSAGE--", labelKey: "BK_CS_COMMON_SEND_MESSAGE" },
)

    return (
      <Screen loading={loading}>
      <div className="success-message-main-screen resolve-success">
      <SuccessMessageForPayment
        //  headermessage="Collection Details"
		//{`Parks & Community Centre/Banquet hall application number`}
	      headermessage = {`Parks & Community Centre/Banquet hall`}
          successmessage="Payment has been collected successfully!"
          secondaryLabel="A notification regarding Payment Collection has been sent to property owner at registered Mobile No."
          containerStyle={{ display: "inline-block" }}
          icon={<Icon action="navigation" name="check" />}
          backgroundColor={"#22b25f"}
          applicationNumber={AppNum}
          ReceiptNumber={RecNumber}
        />
        <div className="responsive-action-button-cont">
          <Button
            className="responsive-action-button"
            primary={true}
            label={<Label buttonLabel={true} label="BK_CORE_COMMON_DOWNLOAD"/>}
            fullWidth={true}
            onClick={this.downloadPaymentReceiptButton}
            style={{ marginRight: 18 }}
          />
          <Button
            id="resolve-success-continue"
            primary={true}
            label={<Label buttonLabel={true} label="SUBMIT" />}
            fullWidth={true}
            onClick={this.Submit}
            className="responsive-action-button"
          />
        </div>
      </div>
      </Screen>
    );
  }
}


const mapStateToProps = state => {
  const { complaints, bookings,common, auth, form } = state;
  const { userInfo } = auth;
  const { updatePACCApplicationData,fetchSuccess, Downloadesamparkdetails, applicationData,DownloadReceiptDetailsforPCC} = bookings;
  const { createWaterTankerApplicationData, DownloadBWTApplicationDetails,categoriesById } = complaints;
  let documentMap = state.screenConfiguration.preparedFinalObject ? state.screenConfiguration.preparedFinalObject.documentMap : ""; 
  let createPACCApplicationData = state.screenConfiguration.preparedFinalObject ? state.screenConfiguration.preparedFinalObject.CreatePaccAppData : "NotAnyMore"; 
  let RecNumber = state.screenConfiguration.preparedFinalObject ? state.screenConfiguration.preparedFinalObject.CollectionReceiptNum : "NotAnyMore";
  console.log("RecNumber--",RecNumber)
  let AppNum =  applicationData ? applicationData.bookingsModelList[0].bkApplicationNumber : "Not Found";
  console.log("AppNum--",AppNum)
  let selectedComplaint = applicationData ? applicationData.bookingsModelList[0] : ''
console.log("selectedComplaint--",selectedComplaint)
const loading = false;

let ReasonForDiscount = state.screenConfiguration.preparedFinalObject ? 
(state.screenConfiguration.preparedFinalObject.ReasonForDiscount !== undefined && state.screenConfiguration.preparedFinalObject.ReasonForDiscount !== null ? (state.screenConfiguration.preparedFinalObject.ReasonForDiscount):'NA') :"NA";  

console.log("ReasonForDiscount--",ReasonForDiscount)

let bookingData = state.screenConfiguration.preparedFinalObject ? state.screenConfiguration.preparedFinalObject.availabilityCheckData:""
console.log("bookingData.bkFromDate--",bookingData.bkFromDate)  
console.log("bookingData.bkToDate--",bookingData.bkToDate) 

let vanueData = state.screenConfiguration.preparedFinalObject ? state.screenConfiguration.preparedFinalObject.bkBookingData:""
console.log("vanueData--",vanueData)

let venueType = vanueData ? vanueData.venueType: "";
console.log("venueType--",venueType)
let bokingType = bookingData ? bookingData.bkBookingVenue : ""
console.log("bokingType--",bokingType)
//createAppData

let createAppData = state.screenConfiguration.preparedFinalObject ? state.screenConfiguration.preparedFinalObject.createAppData:""
console.log("createAppData--",createAppData)

//ResponseOfCashPayment

let offlinePayment = state.screenConfiguration.preparedFinalObject ? state.screenConfiguration.preparedFinalObject.ResponseOfCashPayment:"notFound"
console.log("offlinePayment--",offlinePayment)

//transactionNum
let offlineTransactionNum = offlinePayment ? offlinePayment.Payments[0].transactionNumber : "NotFound"
console.log("offlineTransactionNum--",offlineTransactionNum)  

//transactionDate
let offlineTransactionDate = offlinePayment ? offlinePayment.Payments[0].transactionDate : "NotFound"
console.log("offlineTransactionDate--",offlineTransactionDate) 

//paymentMode
let offlinePayementMode = offlinePayment ? offlinePayment.Payments[0].paymentMode : "NotFound"
console.log("offlinePayementMode--",offlinePayementMode)

//screenConfiguration.preparedFinalObject.availabilityCheckData.bkLocation
let location = state.screenConfiguration.preparedFinalObject.availabilityCheckData.bkLocation ? state.screenConfiguration.preparedFinalObject.availabilityCheckData.bkLocation : "notfound"
console.log("location--",location)

//totalAmountPaid
let totalAmountPaid = offlinePayment ? offlinePayment.Payments[0].paymentDetails[0].bill.totalAmount : "NotFound"
console.log("totalAmountPaid--",totalAmountPaid)

//base charges
let totalAmount =  offlinePayment ? offlinePayment.Payments[0].paymentDetails[0].bill : "NotFound" // till here

let billAccountDetailsArray =  offlinePayment ? offlinePayment.Payments[0].paymentDetails[0].bill.billDetails[0].billAccountDetails : "NOt found Any Array"
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



//surcharges
let firstrent = state.screenConfiguration.preparedFinalObject ? state.screenConfiguration.preparedFinalObject.bkBookingData: "";
console.log("firstrent--",firstrent)

let cleanOne =  firstrent?firstrent.cleaningCharges:""; 
console.log("cleanOne--",cleanOne)

let Summarysurcharge = state.screenConfiguration.preparedFinalObject ? state.screenConfiguration.preparedFinalObject.Summarysurcharge: "NotFound";
console.log("Summarysurcharge-2-",Summarysurcharge)

let SummarycGST = state.screenConfiguration.preparedFinalObject ? state.screenConfiguration.preparedFinalObject.SummarycGST: "NotFound";
console.log("SummarycGST-2-",SummarycGST)

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

  return {first,second,firstToTimeSlot, firstTimeSlotValue,SecondTimeSlotValue,conJsonSecond,conJsonfirst,ReasonForDiscount,
    createWaterTankerApplicationData, DownloadBWTApplicationDetails,loading,fetchSuccess,createPACCApplicationData,selectedComplaint,
    updatePACCApplicationData,Downloadesamparkdetails,userInfo,documentMap,AppNum,DownloadReceiptDetailsforPCC,RecNumber,createAppData
 ,venueType,vanueData,bookingData,bookingData,offlinePayment,offlineTransactionNum,offlineTransactionDate,
 offlinePayementMode,location,totalAmountPaid,six,one,Summarysurcharge,cleanOne,SummarycGST,SecTimeSlotFromTime,SecTimeSlotToTime,
}
}

const mapDispatchToProps = dispatch => {
  return {
    downloadBWTApplication: criteria => dispatch(downloadBWTApplication(criteria)),
    downloadReceiptForPCC: criteria => dispatch(downloadReceiptForPCC(criteria)),
    downloadEsamparkApp: criteria => dispatch(downloadEsamparkApp(criteria)),
	createWaterTankerApplication: criteria => dispatch(createWaterTankerApplication(criteria)),
	updatePACCApplication: (criteria, hasUsers, overWrite) => dispatch(updatePACCApplication(criteria, hasUsers, overWrite)),
    toggleSnackbarAndSetText: (open, message, error) =>
	  dispatch(toggleSnackbarAndSetText(open, message, error)),
	  prepareFinalObject: (jsonPath, value) =>
	  dispatch(prepareFinalObject(jsonPath, value)),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateWBTApplicationSuccess);
/**
 {"ResponseInfo":{"apiId":"Rainmaker","ver":".01","ts":null,"resMsgId":"uief87324","msgId":"20170310130900|en_IN","status":"200"},"Payments":[{"id":"38bfccf5-3045-4702-aa09-a208e4c1f02c","tenantId":"ch.chandigarh","totalDue":1634.00,"totalAmountPaid":1634,"transactionNumber":"2484302323152424","transactionDate":1613705879797,"paymentMode":"CASH","instrumentDate":1613705879797,"instrumentNumber":null,"instrumentStatus":"APPROVED","ifscCode":null,"auditDetails":{"createdBy":"182","createdTime":1613705879742,"lastModifiedBy":"182","lastModifiedTime":1613705879742},"additionalDetails":null,"paymentDetails":[{"id":"264e1d50-2763-4197-8c82-1161853410af","tenantId":"ch.chandigarh","totalDue":1634.00,"totalAmountPaid":1634,"receiptNumber":"02/2020-21/001166","manualReceiptNumber":null,"manualReceiptDate":null,"receiptDate":1613705879742,"receiptType":"BILLBASED","businessService":"BKROOM","billId":"b5e9a7c2-8fea-4954-8c3a-a2cacb4bb9f5","bill":{"id":"b5e9a7c2-8fea-4954-8c3a-a2cacb4bb9f5","mobileNumber":"6398193660","paidBy":" ","payerName":"Vandana","payerAddress":null,"payerEmail":null,"payerId":null,"status":"ACTIVE","reasonForCancellation":null,"isCancelled":null,"additionalDetails":null,"billDetails":[{"billDescription":null,"displayMessage":null,"callBackForApportioning":null,"cancellationRemarks":null,"id":"4b2b8810-e370-469d-98b7-4360c4cdd42d","tenantId":"ch.chandigarh","demandId":"c43668ff-e495-4f6f-b64b-e565309afd3b","billId":"b5e9a7c2-8fea-4954-8c3a-a2cacb4bb9f5","amount":1634.00,"amountPaid":1634,"fromPeriod":1554057000000,"toPeriod":1869676199000,"additionalDetails":{"calculationDes1cription":[]},"channel":null,"voucherHeader":null,"boundary":null,"manualReceiptNumber":null,"manualReceiptDate":null,"billAccountDetails":[{"id":"c88db73d-32e3-4b13-9bbe-ddc47376c29b","tenantId":"ch.chandigarh","billDetailId":"4b2b8810-e370-469d-98b7-4360c4cdd42d","demandDetailId":"58289005-7195-4d10-adc8-de26503ba2e7","order":0,"amount":100.00,"adjustedAmount":100.00,"isActualDemand":null,"taxHeadCode":"ROOM_FACILITATION_CHARGE","additionalDetails":null,"purpose":null,"auditDetails":null},{"id":"f54233b5-a83c-4f45-aacb-d1fa4ab4e2e8","tenantId":"ch.chandigarh","billDetailId":"4b2b8810-e370-469d-98b7-4360c4cdd42d","demandDetailId":"834c0892-9dcd-4bd2-b404-9559d04822d5","order":0,"amount":234.00,"adjustedAmount":234.00,"isActualDemand":null,"taxHeadCode":"BKROOM_TAX","additionalDetails":null,"purpose":null,"auditDetails":null},{"id":"71d446bb-cb85-4394-931c-e7d579086c09","tenantId":"ch.chandigarh","billDetailId":"4b2b8810-e370-469d-98b7-4360c4cdd42d","demandDetailId":"3cac7095-7d20-4ae1-a915-72a38b5ecf09","order":0,"amount":1300.00,"adjustedAmount":1300.00,"isActualDemand":null,"taxHeadCode":"BKROOM","additionalDetails":null,"purpose":null,"auditDetails":null}],"collectionType":null,"auditDetails":null,"expiryDate":1613779199770}],"tenantId":"ch.chandigarh","auditDetails":{"createdBy":"28df855b-d5ff-43ff-bd13-fdf28875106b","createdTime":1613705864770,"lastModifiedBy":"28df855b-d5ff-43ff-bd13-fdf28875106b","lastModifiedTime":1613705864770},"collectionModesNotAllowed":null,"partPaymentAllowed":false,"isAdvanceAllowed":false,"minimumAmountToBePaid":null,"businessService":"BKROOM","totalAmount":1634.00,"consumerCode":"CH-BK-ROOM-2021-02-19-004381","billNumber":"BILLNO-BKROOM-004670","billDate":1613705864770,"amountPaid":1634},"additionalDetails":null,"auditDetails":{"createdBy":"182","createdTime":1613705879742,"lastModifiedBy":"182","lastModifiedTime":1613705879742}}],"paidBy":" ","mobileNumber":"6398193660","payerName":"Vandana","payerAddress":null,"payerEmail":null,"payerId":null,"paymentStatus":"NEW","fileStoreId":null}]}
  
 */