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

	constructor(props) {
		super(props);
		this.state = {
	operatorCode : "",
  Address : "",
  hsnCode : "",
  name : ""
}
	}
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
	  let {acRoomId,nonAcRoomId,discountForRoom,GlobalNonAccRoomToBook,GlobalAccRoomToBook,RoomId,AppNum,DataForRoomBooking,roomFromDate,roomToDate,userInfo,bothRoom,typeOfRoom,totalRoom,updateNumOfAcRoom,updateNumOfNonAcRoom} = this.props
console.log("typesforDiscount--",typeof(discountForRoom))

	  let BothRoomSelect=[];
	  if(bothRoom == "Both"){
		  console.log("one")
		  BothRoomSelect = [
 
			  { "id": acRoomId,
			  "roomApplicationNumber": AppNum,
				  "action": "OFFLINE_APPLY",
				  "remarks": "string",
				  "roomBusinessService": "BKROOM",
				  "discount": discountForRoom,
				   "totalNoOfRooms": updateNumOfAcRoom,
					"typeOfRoom": "AC",            //updateNumOfAcRoom,updateNumOfNonAcRoom
				  "fromDate": roomFromDate,
				  "toDate": roomToDate
				},
				{
				"id": nonAcRoomId,
				"roomApplicationNumber": AppNum,
				"action": "OFFLINE_APPLY",
				  "remarks": "string",
				  "discount": discountForRoom,
				  "roomBusinessService": "BKROOM",
				  "totalNoOfRooms": updateNumOfNonAcRoom,
				  "typeOfRoom": "NON-AC",
				  "fromDate": roomFromDate,
				  "toDate":roomToDate
				  }]

				   }

	 else if(bothRoom == "AC"){
		 console.log("two")
	  BothRoomSelect = [
		  {
			"id": acRoomId,
				"roomApplicationNumber": AppNum,
				"action": "OFFLINE_APPLY",
			"remarks": "string",
			"roomBusinessService": "BKROOM",
			"discount": discountForRoom,
			 "totalNoOfRooms": updateNumOfAcRoom,
			  "typeOfRoom": typeOfRoom,
			"fromDate": roomFromDate,
			"toDate": roomToDate
		  }]
		
				  }
			  else if (bothRoom == "NON-AC"){
				  console.log("three")
				  BothRoomSelect = [
					  {
						"id": nonAcRoomId,
				"roomApplicationNumber": AppNum,
				"action": "OFFLINE_APPLY",
						"remarks": "string",
						"roomBusinessService": "BKROOM",
						"discount": discountForRoom,
						 "totalNoOfRooms": updateNumOfNonAcRoom,
						  "typeOfRoom": typeOfRoom,
						"fromDate": roomFromDate,
						"toDate": roomToDate
					  }]
			  }
console.log("BothRoomSelect--success--",BothRoomSelect)
	  
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
		"bkPaymentStatus": "SUCCESS",
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
		"financeBusinessService": "BOOKING_BRANCH_SERVICES.COMMUNITY_CENTRES_JHANJ_GHAR",
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

let payloadfund = await httpRequest(
	"bookings/community/room/_update",
	"_search",[],
	createAppData
	);

console.log("payloadfund--",payloadfund)

this.props.prepareFinalObject("ApplicationCreateForRoom",payloadfund)

this.props.history.push(`/egov-services/RoomBooking-Created-Successfully`);


  };
  componentDidMount = async () => {  
  }

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
        //   headermessage="Collection Details"
		  headermessage={`Rooms Booking`}
          successmessage="Payment has been collected successfully!"
          secondaryLabel="A notification regarding Payment Collection has been sent to property owner at registered Mobile No."
          containerStyle={{ display: "inline-block" }}
          icon={<Icon action="navigation" name="check" />}
          backgroundColor={"#22b25f"}
          applicationNumber={AppNum}
          ReceiptNumber={RecNumber}
        />
        <div className="responsive-action-button-cont">
          {/* <Button
            className="responsive-action-button"
            primary={true}
            label={<Label buttonLabel={true} label="BK_CORE_COMMON_DOWNLOAD" />}
            fullWidth={true}
            onClick={this.downloadPaymentReceiptButton}
            style={{ marginRight: 18 }}
          /> */}
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
//   let createPACCApplicationData = state.screenConfiguration.preparedFinalObject ? state.screenConfiguration.preparedFinalObject.CreatePaccAppData : "NotAnyMore"; 
  let RecNumber = state.screenConfiguration.preparedFinalObject ? state.screenConfiguration.preparedFinalObject.CollectionReceiptNum : "NotAnyMore";
  console.log("RecNumber--",RecNumber)
 //RecNumber,offlinePayment,offlineTransactionNum,offlineTransactionDate,
 //offlinePayementMode,offlinePayementMode,totalAmountPaid,totalAmount
let offlinePayment = state.screenConfiguration.preparedFinalObject ? state.screenConfiguration.preparedFinalObject.ResponseOfCashPayment:"notFound"
console.log("offlinePayment--",offlinePayment)

let RoomBookingData = state.screenConfiguration.preparedFinalObject ? state.screenConfiguration.preparedFinalObject.RoomBookingData : "NA"
console.log("-RoomBookingData-",RoomBookingData)  

let DataForRoomBooking = state.screenConfiguration.preparedFinalObject ? state.screenConfiguration.preparedFinalObject.RoomBookingData : "NA"
console.log("DataForRoomBooking-",DataForRoomBooking)
let CreateRoomApplication = state.screenConfiguration.preparedFinalObject ? state.screenConfiguration.preparedFinalObject.CreateRoomApplication : "NA"
console.log("CreateRoomApplication-",CreateRoomApplication)
let AppNum = CreateRoomApplication.data.roomsModel[0].roomApplicationNumber
console.log("AppNum--AppNum",AppNum)

let acRoomId;  //acRoomId,nonAcRoomId
let nonAcRoomId;
let updateNumOfAcRoom; //updateNumOfAcRoom,updateNumOfNonAcRoom

let updateNumOfNonAcRoom;
//data.roomsModel
for(let i = 0; i < CreateRoomApplication.data.roomsModel.length; i++){
console.log("CreateRoomApplication.data.roomsModel",CreateRoomApplication.data.roomsModel)
if(CreateRoomApplication.data.roomsModel[i].typeOfRoom == "AC"){
	console.log("CreateRoomApplication.TypeOfAcRoom",CreateRoomApplication.data.roomsModel[i])
	updateNumOfAcRoom = CreateRoomApplication.data.roomsModel[i].totalNoOfRooms   
	acRoomId = CreateRoomApplication.data.roomsModel[i].id
}
if(CreateRoomApplication.data.roomsModel[i].typeOfRoom == "NON-AC"){
	nonAcRoomId = CreateRoomApplication.data.roomsModel[i].id
	updateNumOfNonAcRoom = CreateRoomApplication.data.roomsModel[i].totalNoOfRooms
}
}
console.log("acRoomId--",acRoomId)
console.log("nonAcRoomId--",nonAcRoomId)
console.log("updateNumOfAcRoom--",updateNumOfAcRoom)
console.log("updateNumOfNonAcRoom--",updateNumOfNonAcRoom)
let totalRoom = CreateRoomApplication.data.roomsModel[0].totalNoOfRooms
console.log("totalRoom--",totalRoom)

let discountForRoom = CreateRoomApplication.data.roomsModel[0].discount
console.log("discountForRoom--",discountForRoom)
//GlobalNonAccRoomToBook,GlobalAccRoomToBook
let GlobalNonAccRoomToBook = state.screenConfiguration.preparedFinalObject ? 
(state.screenConfiguration.preparedFinalObject.GlobalNonAccRoomToBook != undefined && state.screenConfiguration.preparedFinalObject.GlobalNonAccRoomToBook != null ? (state.screenConfiguration.preparedFinalObject.GlobalNonAccRoomToBook) : 'NA') : "NA"
console.log("GlobalNonAccRoomToBook--",GlobalNonAccRoomToBook)
let GlobalAccRoomToBook = state.screenConfiguration.preparedFinalObject ? 
(state.screenConfiguration.preparedFinalObject.GlobalAccRoomToBook != undefined && state.screenConfiguration.preparedFinalObject.GlobalAccRoomToBook != null ? (state.screenConfiguration.preparedFinalObject.GlobalAccRoomToBook) : 'NA') : "NA"
console.log("GlobalAccRoomToBook-",GlobalAccRoomToBook)

let typeOfRoom = CreateRoomApplication.data.roomsModel[0].typeOfRoom
console.log("totalRoom--",typeOfRoom)

let roomFromDate = CreateRoomApplication.data.roomsModel[0].fromDate
console.log("roomFromDate--roomFromDate",roomFromDate)

let roomToDate = CreateRoomApplication.data.roomsModel[0].toDate
console.log("roomToDate--roomToDate",roomToDate)   //roomFromDate,roomToDatep  

let RoomId = CreateRoomApplication.data.roomsModel[0].id
console.log("RoomId--",RoomId)

let bothRoom = state.screenConfiguration.preparedFinalObject ?
(state.screenConfiguration.preparedFinalObject.GlobalTypeOfRoom !== undefined && state.screenConfiguration.preparedFinalObject.GlobalTypeOfRoom !== null ?state.screenConfiguration.preparedFinalObject.GlobalTypeOfRoom : 'NA'): "NA"
console.log("bothRoom--",bothRoom)

//transactionNum
let offlineTransactionNum = offlinePayment ? offlinePayment.Payments[0].transactionNumber : "NotFound"
console.log("offlineTransactionNum--",offlineTransactionNum)  

//transactionDate
let offlineTransactionDate = offlinePayment ? offlinePayment.Payments[0].transactionDate : "NotFound"
console.log("offlineTransactionDate--",offlineTransactionDate) 

//paymentMode
let offlinePayementMode = offlinePayment ? offlinePayment.Payments[0].paymentMode : "NotFound"
console.log("offlinePayementMode--",offlinePayementMode)

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

return {typeOfRoom,totalRoom,GlobalNonAccRoomToBook,GlobalAccRoomToBook,discountForRoom,acRoomId,nonAcRoomId,updateNumOfAcRoom,updateNumOfNonAcRoom,
	RecNumber,offlinePayment,offlineTransactionNum,offlineTransactionDate,AppNum,roomFromDate,roomToDate,
	offlinePayementMode,totalAmountPaid,totalAmount,RoomBookingData,RoomId,DataForRoomBooking,userInfo,bothRoom
}

//surcharges
// let firstrent = state.screenConfiguration.preparedFinalObject ? state.screenConfiguration.preparedFinalObject.bkBookingData: "";
// console.log("firstrent--",firstrent)

// let cleanOne =  firstrent?firstrent.cleaningCharges:""; 
// console.log("cleanOne--",cleanOne)

// let Summarysurcharge = state.screenConfiguration.preparedFinalObject ? state.screenConfiguration.preparedFinalObject.Summarysurcharge: "NotFound";
// console.log("Summarysurcharge-2-",Summarysurcharge)

// let SummarycGST = state.screenConfiguration.preparedFinalObject ? state.screenConfiguration.preparedFinalObject.SummarycGST: "NotFound";
// console.log("SummarycGST-2-",SummarycGST)

//   return {first,second,firstToTimeSlot, firstTimeSlotValue,SecondTimeSlotValue,conJsonSecond,conJsonfirst,
//     createWaterTankerApplicationData, DownloadBWTApplicationDetails,loading,fetchSuccess,selectedComplaint,
//     updatePACCApplicationData,Downloadesamparkdetails,userInfo,documentMap,AppNum,DownloadReceiptDetailsforPCC,RecNumber,createAppData
//  ,venueType,vanueData,bookingData,bookingData,offlinePayment,offlineTransactionNum,offlineTransactionDate,
//  offlinePayementMode,location,totalAmountPaid,six,one,Summarysurcharge,cleanOne,SummarycGST,SecTimeSlotFromTime,SecTimeSlotToTime,
// }
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