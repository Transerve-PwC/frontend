import React, { Component } from "react";
import { Card, Image, Icon, Button } from "components";
import Label from "egov-ui-kit/utils/translationNode";
import isEmpty from "lodash/isEmpty";
import "./index.css";
import ActionButtonDropdown from '../../../../modules/ActionButtonDropdown'
import { convertEpochToDate, getDurationDate,getFileUrlFromAPI } from '../../../../modules/commonFunction'
import {
	downloadEsamparkApp,downloadRoomPaymentRecipt,downloadRoomPermissionLetter,fetchDataAfterPayment
} from "egov-ui-kit/redux/bookings/actions";
import { connect } from "react-redux";
import jp from "jsonpath";
import { httpRequest } from "egov-ui-kit/utils/api";
 
class AppDetails extends Component {

  goToRoomDetails = (RoomApplicationNumber) => {
    this.props.history.push(`/egov-services/Employee/ApplicationDetailsForRoom/${RoomApplicationNumber}`);
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



  downloadPermissionLetterBody = async (room) => {
    const {selectedComplaint,userInfo,downloadRoomPermissionLetter} = this.props
let RoomApplicationNumber = room.roomApplicationNumber
console.log("RoomApplicationNumber--",RoomApplicationNumber)


let createAppData = {
  "applicationNumber": RoomApplicationNumber,
"applicationStatus": "",
"typeOfRoom": "",
"fromDate": "",
"toDate": ""
  }

  let payloadfund2 = await httpRequest(
    "bookings/api/employee/community/center/room/_search",
    "_search",[],
    createAppData
    );

console.log("payloadfund--",payloadfund2)		
// this.props.prepareFinalObject("DataOfRoomAndCommunity",payloadfund)
let documentForBothBooking = payloadfund2.communityCenterDocumentMap
console.log("documentForBothBooking-",documentForBothBooking)
let RoomCommData = payloadfund2.communityCenterRoomBookingMap
  console.log("RoomCommData--",RoomCommData)
let AllKeysOfRoom = []
let AllValues
for (const [key] of Object.entries(RoomCommData)) {
  console.log("allKeys--",`${key}`);
  AllKeysOfRoom.push(`${key}`)
  }
  console.log("AllKeysOfRoom--",AllKeysOfRoom)
console.log("RoomApplicationNumber--",AllKeysOfRoom[0].roomApplicationNumber,AllKeysOfRoom[0].typeOfRoom)
//["RoomsModel(id=8fa9e31d-f71a-4aff-8e55-a2879e124b4e, roomApplicationNumber=CH-BK-ROOM-2021-02-16-004311, typeOfRoom=AC, totalNoOfRooms=25, communityApplicationNumber=CH-BK-2021-02-16-004309, roomApplicationStatus=OFFLINE_APPLIED, roomBusinessService=BKROOM, remarks=string, action=OFFLINE_APPLY, lastModifiedDate=2021-02-16, createdDate=2021-02-16, fromDate=2021-04-22, toDate=2021-04-22, discount=null, facilationCharge=null, roomPaymentStatus=null)"]
AllValues = Object.values(RoomCommData)
console.log("AllValues--",AllValues);  //[0]

let RoomModel = selectedComplaint && selectedComplaint.bookingsModelList ? (selectedComplaint.bookingsModelList[0].roomsModel ?(selectedComplaint.bookingsModelList[0].roomsModel.length > 0 ? (selectedComplaint.bookingsModelList[0].roomsModel):'NA') :'NA'): 'NA'
let AC = "";
let NonAC = "";
let TypeOfRoom = room.typeOfRoom
if(TypeOfRoom == "AC"){
   AC = this.props.totalNumber
  }
else(TypeOfRoom == "NON-AC")
{
  NonAC = this.props.totalNumber
}
//Call api for Payment
let RequestData = [
	{ key: "consumerCodes", value: RoomApplicationNumber },
	{ key: "tenantId", value: userInfo.tenantId }
	];
	
	let payloadfund = await httpRequest(
		"collection-services/payments/_search",
		"_search",
		RequestData,
		// customRequestInfo
		);
	  
		console.log("RequestData--",RequestData)
		console.log("payloadfund--",payloadfund)

		let paymentData =  payloadfund ? payloadfund.Payments[0].paymentDetails[0].bill.billDetails[0].billAccountDetails : "NOt found Any Array"
console.log("paymentData--",paymentData)

let totalAmountPaid = payloadfund ? payloadfund.Payments[0].totalAmountPaid : ""

let PaymentDate = payloadfund ? payloadfund.Payments[0].transactionDate : ""  

let receiptNumber = payloadfund ? payloadfund.Payments[0].paymentDetails[0].receiptNumber : ""  //PaymentDate,receiptNumber,PaymentMode,transactionNumber

let PaymentMode = payloadfund ? payloadfund.Payments[0].paymentMode : ""

let transactionNumber =  payloadfund ? payloadfund.Payments[0].transactionNumber : ""

let BKROOM_TAX = 0;
let BKROOM = 0;
let BKROOM_ROUND_OFF = 0;   
let four = 0;


for(let i = 0; i < paymentData.length ; i++ ){

if(paymentData[i].taxHeadCode == "BKROOM_TAX"){
BKROOM_TAX = paymentData[i].amount
}
else if(paymentData[i].taxHeadCode == "BKROOM"){
BKROOM = paymentData[i].amount
}
else if(paymentData[i].taxHeadCode == "BKROOM_ROUND_OFF"){
BKROOM_ROUND_OFF = paymentData[i].amount
}
else if(paymentData[i].taxHeadCode == "ROOM_FACILITATION_CHARGE"){
four = paymentData[i].amount
}
} 


let Newugst;
let perFind = 50;
let ugst = BKROOM_TAX
let find50Per = (perFind/100) * ugst
console.log("find50Per--",find50Per)		
let findNumOrNot = Number.isInteger(find50Per);
console.log("findNumOrNot--",findNumOrNot)
if(findNumOrNot == true){
  Newugst = find50Per
  console.log("trueCondition")
}
else{
  Newugst = find50Per.toFixed(2);
  console.log("second-Newugst-",Newugst)
}


let toDayDate = new Date()
let approverName;
for(let i = 0; i < userInfo.roles.length ; i++ ){
  if(userInfo.roles[i].code == "BK_E-SAMPARK-CENTER"){
    approverName = userInfo.roles[i].name
  }
}

var date2 = new Date();

var generatedDateTime = `${date2.getDate()}-${date2.getMonth() + 1}-${date2.getFullYear()}, ${date2.getHours()}:${date2.getMinutes() < 10 ? "0" : ""}${date2.getMinutes()}`;
	

   let BookingInfo = [
      {
          "applicantDetails": {
              "name":  AllValues[0].bkApplicantName,
              "permanentAddress": AllValues[0].bkSector,
              "permanentCity": "chandigarh",
              "placeOfService": "Chandigarh"
          },
          "bookingDetails": {
              "bkLocation": AllValues[0].bkLocation,
              "bkDept": AllValues[0].bkBookingType,
              "noOfACRooms": AC,
              "noOfNonACRooms": NonAC,
              "bookingPurpose": AllValues[0].bkBookingPurpose,
              "bkStartDate": room.fromDate,
              "bkEndDate": room.toDate,
              "placeOfService": "Chandigarh",
              "venueName": AllValues[0].bkLocation,
              "sector": AllValues[0].bkSector,
              "bookingType":AllValues[0].bkBookingType,
              "applicationDate":room.createdDate,
              "bookingPeriod": getDurationDate(
                room.fromDate,
                room.toDate
              ),
          },
          "generated": {
              "generatedBy": approverName,
              "generatedDateTime": generatedDateTime
          },
          "approvedBy": {
            "approvedBy": userInfo.name,
            "role": approverName
        },
          "emp": {
              "samparkName": this.props.name,
              "samparkaddress": this.props.Address
          },
          "paymentInfo": {
              "cleaningCharges": "Not Applicable",
              "baseCharge": BKROOM,
              "cgst": Newugst,
              "utgst": Newugst,
              "totalgst": BKROOM_TAX,
              "refundableCharges": "",
              "totalPayment": totalAmountPaid,
              "paymentDate": convertEpochToDate(PaymentDate, "dayend"),
              "receiptNo": receiptNumber,
              "currentDate":   convertEpochToDate(toDayDate, "dayend"),
              "paymentType": PaymentMode,
              "facilitationCharge": four,
              "custGSTN": AllValues[0].bkCustomerGstNo,
              "mcGSTN": "aasdadad",
              "bankName": "",
              "transactionId":transactionNumber,
              "totalPaymentInWords": this.NumInWords(
                totalAmountPaid
              ),
              "discType": AllValues[0].discount
          },
          "tenantInfo": {
              "municipalityName": "Municipal Corporation Chandigarh",
              "address": "New Deluxe Building, Sector 17, Chandigarh",
              "contactNumber": "+91-172-2541002, 0172-2541003",
              "logoUrl": "https://chstage.blob.core.windows.net/fileshare/logo.png",
               "webSite": "http://mcchandigarh.gov.in",
              "mcGSTN": "aasdadad",
              "statecode": "04",
              "hsncode": this.props.hsnCode
          },
          "bankInfo": {
              "accountholderName": AllValues[0].bkBankAccountHolder,
              "rBankName": AllValues[0].bkBankName,
              "rBankACNo": AllValues[0].bkBankAccountNumber,
              "rIFSCCode": AllValues[0].bkIfscCode
          }
      }
  ]

  downloadRoomPermissionLetter({ BookingInfo: BookingInfo })
  }

  permissionLetterDownloadFunction = async (room) => {
    // let room = room;
    await this.downloadPermissionLetterBody(room);
    const {DownloadBWTApplicationDetails,userInfo,RoomPermissionLetter}=this.props;

    var documentsPreview = [];
    let documentsPreviewData;
    if (RoomPermissionLetter && RoomPermissionLetter.filestoreIds.length > 0) {	
      documentsPreviewData = RoomPermissionLetter.filestoreIds[0];
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
        
      }
  }


  PaymentReceiptDownloadFunction = async (room) => {
    await this.PaymentReceiptDownloadFunctionBody(room);
    const {DownloadBWTApplicationDetails,userInfo,RoomPaymentReceipt}=this.props;

    var documentsPreview = [];
    let documentsPreviewData;
    if (RoomPaymentReceipt && RoomPaymentReceipt.filestoreIds.length > 0) {	
      documentsPreviewData = RoomPaymentReceipt.filestoreIds[0];
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
        
      }
  }

  PaymentReceiptDownloadFunctionBody = async (room) => { 
    const {selectedComplaint,userInfo,downloadRoomPermissionLetter,downloadRoomPaymentRecipt} = this.props

    let RoomApplicationNumber = room.roomApplicationNumber
    console.log("RoomApplicationNumber--",RoomApplicationNumber)
    
    
    
    let createAppData = {
      "applicationNumber": RoomApplicationNumber,
    "applicationStatus": "",
    "typeOfRoom": "",
    "fromDate": "",
    "toDate": ""
      }
    
      let payloadfund2 = await httpRequest(
        "bookings/api/employee/community/center/room/_search",
        "_search",[],
        createAppData
        );
    
    console.log("payloadfund2--",payloadfund2)		
    // this.props.prepareFinalObject("DataOfRoomAndCommunity",payloadfund)
    let documentForBothBooking = payloadfund2.communityCenterDocumentMap
    console.log("documentForBothBooking-",documentForBothBooking)
    let RoomCommData = payloadfund2.communityCenterRoomBookingMap
      console.log("RoomCommData--",RoomCommData)
    let AllKeysOfRoom = []
    let AllValues
    for (const [key] of Object.entries(RoomCommData)) {
      console.log("allKeys--",`${key}`);
      AllKeysOfRoom.push(`${key}`)
      }
      console.log("AllKeysOfRoom--",AllKeysOfRoom)
    console.log("RoomApplicationNumber--",AllKeysOfRoom[0].roomApplicationNumber,AllKeysOfRoom[0].typeOfRoom)
    //["RoomsModel(id=8fa9e31d-f71a-4aff-8e55-a2879e124b4e, roomApplicationNumber=CH-BK-ROOM-2021-02-16-004311, typeOfRoom=AC, totalNoOfRooms=25, communityApplicationNumber=CH-BK-2021-02-16-004309, roomApplicationStatus=OFFLINE_APPLIED, roomBusinessService=BKROOM, remarks=string, action=OFFLINE_APPLY, lastModifiedDate=2021-02-16, createdDate=2021-02-16, fromDate=2021-04-22, toDate=2021-04-22, discount=null, facilationCharge=null, roomPaymentStatus=null)"]
    AllValues = Object.values(RoomCommData)
    console.log("AllValues--",AllValues);
    
    let RoomModel = selectedComplaint && selectedComplaint.bookingsModelList ? (selectedComplaint.bookingsModelList[0].roomsModel ?(selectedComplaint.bookingsModelList[0].roomsModel.length > 0 ? (selectedComplaint.bookingsModelList[0].roomsModel):'NA') :'NA'): 'NA'
    let AC = "";
    let NonAC = "";
    let TypeOfRoom = room.typeOfRoom
    if(TypeOfRoom == "AC"){
       AC = this.props.totalNumber
      }
    else(TypeOfRoom == "NON-AC")
    {
      NonAC = this.props.totalNumber
    }
    //Call api for Payment
    let RequestData = [
      { key: "consumerCodes", value: RoomApplicationNumber },
      { key: "tenantId", value: userInfo.tenantId }
      ];
      
      let payloadfund = await httpRequest(
        "collection-services/payments/_search",
        "_search",
        RequestData,
        // customRequestInfo
        );
        
        console.log("RequestData--",RequestData)
        console.log("payloadfund--",payloadfund)
    
        let paymentData =  payloadfund ? payloadfund.Payments[0].paymentDetails[0].bill.billDetails[0].billAccountDetails : "NOt found Any Array"
    console.log("paymentData--",paymentData)
    
    let totalAmountPaid = payloadfund ? payloadfund.Payments[0].totalAmountPaid : ""
    
    let PaymentDate = payloadfund ? payloadfund.Payments[0].transactionDate : ""  
    
    let receiptNumber = payloadfund ? payloadfund.Payments[0].paymentDetails[0].receiptNumber : ""  //PaymentDate,receiptNumber,PaymentMode,transactionNumber
    
    let PaymentMode = payloadfund ? payloadfund.Payments[0].paymentMode : ""
    
    let transactionNumber =  payloadfund ? payloadfund.Payments[0].transactionNumber : ""
    
    let BKROOM_TAX = 0;
    let BKROOM = 0;
    let BKROOM_ROUND_OFF = 0;   
    let four = 0;
    
    
    for(let i = 0; i < paymentData.length ; i++ ){
    
    if(paymentData[i].taxHeadCode == "BKROOM_TAX"){
    BKROOM_TAX = paymentData[i].amount
    }
    else if(paymentData[i].taxHeadCode == "BKROOM"){
    BKROOM = paymentData[i].amount
    }
    else if(paymentData[i].taxHeadCode == "BKROOM_ROUND_OFF"){
    BKROOM_ROUND_OFF = paymentData[i].amount
    }
    else if(paymentData[i].taxHeadCode == "ROOM_FACILITATION_CHARGE"){
    four = paymentData[i].amount
    }
    } 
    
    
    let Newugst;
    let perFind = 50;
    let ugst = BKROOM_TAX
    let find50Per = (perFind/100) * ugst
    console.log("find50Per--",find50Per)		
    let findNumOrNot = Number.isInteger(find50Per);
    console.log("findNumOrNot--",findNumOrNot)
    if(findNumOrNot == true){
      Newugst = find50Per
      console.log("trueCondition")
    }
    else{
      Newugst = find50Per.toFixed(2);
      console.log("second-Newugst-",Newugst)
    }
    
    
    let toDayDate = new Date()
    let approverName;
    for(let i = 0; i < userInfo.roles.length ; i++ ){
      if(userInfo.roles[i].code == "BK_E-SAMPARK-CENTER"){
        approverName = userInfo.roles[i].name
      }
    }
    
    var date2 = new Date();
    
    var generatedDateTime = `${date2.getDate()}-${date2.getMonth() + 1}-${date2.getFullYear()}, ${date2.getHours()}:${date2.getMinutes() < 10 ? "0" : ""}${date2.getMinutes()}`;
    

  let BookingInfo = [
      {
          "applicantDetails": {
              "name": AllValues[0].bkApplicantName,
          },
          "booking": {
              "bkLocation": AllValues[0].bkLocation,
              "bkDept": AllValues[0].bkBookingType,
              "noOfAcRooms": AC,
              "noOfNonAcRooms": NonAC,
              "bookingPurpose": AllValues[0].bkBookingPurpose,
              "bkStartDate": room.fromDate,
              "bkEndDate": room.toDate,
              "placeOfService": "Chandigarh",
          },
          "generated": {
            "generatedBy": approverName,
            "generatedDateTime": generatedDateTime
        },
        "approvedBy": {
          "approvedBy": userInfo.name,
          "role": approverName
      },
      "emp": {
        "OpCode": this.props.operatorCode,
        "samparkAdd": this.props.Address,
    },
        "paymentInfo": {
          "cleaningCharges": "Not Applicable",
          "baseCharge": BKROOM,
          "cgst": Newugst,
          "utgst": Newugst,
          "totalgst":BKROOM_TAX,
          "refundableCharges": "",
          "totalPayment": totalAmountPaid,
          "paymentDate": convertEpochToDate(PaymentDate, "dayend"),
          "receiptNo": receiptNumber,
          "currentDate":   convertEpochToDate(toDayDate, "dayend"),
          "paymentType": PaymentMode,
          "facilitationCharge": four,
          "custGSTN": AllValues[0].bkCustomerGstNo,
          "mcGSTN": "aasdadad",
          "bankName": "",
          "transactionId":transactionNumber,
          "totalPaymentInWords": this.NumInWords(
            totalAmountPaid
          ),
          "discType": AllValues.discount
      },
          "tenantInfo": {
              "municipalityName": "Municipal Corporation Chandigarh",
              "address": "New Deluxe Building, Sector 17, Chandigarh",
              "contactNumber": "+91-172-2541002, 0172-2541003",
              "logoUrl": "https://chstage.blob.core.windows.net/fileshare/logo.png",
              "webSite": "http://mcchandigarh.gov.in",
              "mcGSTN": "aasdadad",
              "statecode": " 04",
              "hsncode": this.props.hsnCode
          },
          "bankInfo": {
            "accountholderName": AllValues[0].bkBankAccountHolder,
            "rBankName": AllValues[0].bkBankName,
            "rBankACNo": AllValues[0].bkBankAccountNumber,
            "rIFSCCode": AllValues[0].bkIfscCode
        }
      }
  ]
  downloadRoomPaymentRecipt({ BookingInfo: BookingInfo })

  }

/**
   return (
      <div>
        <Card
          textChildren={
            <div>
              <div className="rainmaker-displayInline">
                <Label label="BK_MYBK_ROOM_DETAILS" containerStyle={{ marginLeft: "13px" }} labelClassName="dark-heading" />
                <div class="col-12 col-md-6 col-sm-3" >
												<ActionButtonDropdown data={{
													label: { labelName: "Print", labelKey: "BK_COMMON_PRINT_ACTION" },
													rightIcon: "arrow_drop_down",
													leftIcon: "print",
													props: {
														variant: "outlined",
														style: { marginLeft: 5, marginRight: 15, color: "#FE7A51", height: "60px" }, className: "tl-download-button"
													},
                          menu :
													 [{
														label: {
															labelName: "Permission Letter",
															labelKey: "Permission Letter"
														},
														link: () => this.permissionLetterDownloadFunction('state', "dispatch", 'REJECT'),
														leftIcon: "assignment"
													},
                          {
														label: {
															labelName: "Payment Receipt",
															labelKey: "Payment Receipt"
														},
														link: () => this.PaymentReceiptDownloadFunction('state', "dispatch", 'REJECT'),
														leftIcon: "assignment"
													},
                          // {
													// 	label: {
													// 		labelName: "Payment Receipt",
													// 		labelKey: "Payment Receipt"
													// 	},
													// 	link: () => this.downloadApplicationButton('state', "dispatch", 'REJECT'),
													// 	leftIcon: "assignment"
													// }
                        ]
												}} />

											</div>

              </div>
              <div key={10} className="complaint-detail-full-width">
                <div className="complaint-detail-detail-section-status row">

                  <div className="col-md-4">
                    <Label className="col-xs-12  col-sm-12 col-md-12 status-color" label="BK_MY_BK_ROOM_APPLICATION_NUMBER" />
                    <Label
                      className="col-xs-12  col-sm-12 col-md-12  status-result-color"
                      label={this.props.RoomApplicationNumber}
                      id="complaint-details-submission-date"
                      labelStyle={{ color: "inherit" }}
                    />
                  </div>
                  <div className="col-md-4">
                    <Label className="col-xs-12  col-sm-12 col-md-12 status-color" label="BK_MY_BK_ROOM_TOTAL_NUMBER" />
                    <Label
                      className="col-xs-6  col-sm-8 col-md-10  status-result-color"
                      id="complaint-details-current-status"
                      labelStyle={{ color: "inherit" }}
                      label={this.props.totalNumber}
                    />
                  </div>
                  <div className="col-md-4">
                    <Label className="col-xs-112  col-sm-12 col-md-12 status-color" label="BK_MY_BK_ROOM_TYPES" />
                    <Label
                      className="col-xs-12 col-sm-12 col-md-12  status-result-color"
                     
                      id="complaint-details-submission-date"
                      labelStyle={{ color: "inherit" }}
                      label={this.props.typeOfRoom}//bkIfscCode
                    />
                  </div>
             
                  <div className="col-md-4">
                    <Label className="col-xs-112  col-sm-12 col-md-12 status-color" label="BK_MY_BK_ROOM_FROM_DATE" />
                    <Label
                      className="col-xs-12 col-sm-12 col-md-12  status-result-color"
                    
                      id="complaint-details-submission-date"
                      labelStyle={{ color: "inherit" }}
                      label={this.props.roomFromDate}
                    />
                  </div>
                  <div className="col-md-4">
                    <Label className="col-xs-112  col-sm-12 col-md-12 status-color" label="BK_MY_BK_ROOM_TO_DATE" />
                    <Label
                      className="col-xs-12 col-sm-12 col-md-12  status-result-color"
                    
                      id="complaint-details-submission-date"
                      labelStyle={{ color: "inherit" }}
                      label={this.props.roomToDate}
                    />
                  </div>
               
               
                </div>
              </div>
            </div>
          }
        />
      </div>
    );
 */
  render() {
 return(
<div>
  {console.log("this.props.roomData-InRoomCard",this.props.roomData)}
 {this.props.roomData.map ((room) =>{
   return (
          <Card key={room.RoomApplicationNumber}
          textChildren={
            <div>
              <div className="rainmaker-displayInline">
              
              <div className="col-md-4">
              <Label label="Room Details" containerStyle={{ marginLeft: "13px" }} labelClassName="dark-heading" />
                </div>
                <div className="col-md-4">
                  </div>
                <div className="col-md-6">
                <Button
		  label={
			<Label
			  buttonLabel={true}
			  color="#fe7a51"
			  label="VIEW DETAIL"
			/>
		  }
		  labelStyle={{
			letterSpacing: 0.7,
			padding: 0,
			color: "#fe7a51"
		  }}
		  buttonStyle={{ border: "1px solid #fe7a51" }}
		  style={{ width: "15%" , float : "Right"}}
		  onClick={(e)=>this.goToRoomDetails(room.roomApplicationNumber)}
		/> 
                    </div>
                        {/* <button
                        style={{ color: "#FE7A51", border: "none", outline: "none", fontWeight: "650", float: 'right', marginRight: '43px', marginTop: '-16px', background: "white" }}
                        onClick={(e)=>this.goToRoomDetails(room.roomApplicationNumber)}
                        >
                        {/* <EditIcon /> */}
                        {/* <h5 style={{ fontSize: "14px", marginTop: "-27px", marginBottom: "15px", marginLeft: "59px" }}>
                           VIEW DETAILS */}
                       
              {/* </h5> */}
                    {/* </button> */}
              </div>
              <div key={10} className="complaint-detail-full-width">
                <div className="complaint-detail-detail-section-status row">
                  <div className="col-md-4">
                    <Label className="col-xs-12  col-sm-12 col-md-12 status-color" label="BK_MY_BK_ROOM_APPLICATION_NUMBER" />
                    <Label
                      className="col-xs-12  col-sm-12 col-md-12  status-result-color"
                      label={room.roomApplicationNumber}
                      id="complaint-details-submission-date"
                      labelStyle={{ color: "inherit" }}
                    />
                  </div>
                  <div className="col-md-4">
                    <Label className="col-xs-12  col-sm-12 col-md-12 status-color" label="BK_MY_BK__AC_ROOM_TOTAL_NUMBER" />
                    <Label
                      className="col-xs-6  col-sm-8 col-md-10  status-result-color"
                      id="complaint-details-current-status"
                      labelStyle={{ color: "inherit" }}
                      label={room.totalNoOfACRooms !==0 ? room.totalNoOfACRooms : "0"}
                    />
                  </div>
                  <div className="col-md-4">
                    <Label className="col-xs-12  col-sm-12 col-md-12 status-color" label="BK_MY_BK_NON_AC_ROOM_TOTAL_NUMBER" />
                    <Label
                      className="col-xs-6  col-sm-8 col-md-10  status-result-color"
                      id="complaint-details-current-status"
                      labelStyle={{ color: "inherit" }}
                      label={room.totalNoOfNonACRooms !== 0 ? room.totalNoOfNonACRooms :"0"}
                    />
                  </div>
                  <div className="col-md-4">
                    <Label className="col-xs-112  col-sm-12 col-md-12 status-color" label="BK_MY_BK_ROOM_TYPES" />
                    <Label
                      className="col-xs-12 col-sm-12 col-md-12  status-result-color"
                     
                      id="complaint-details-submission-date"
                      labelStyle={{ color: "inherit" }}
                      label={room.typeOfRooms}//bkIfscCode
                    />
                  </div>
             
                  <div className="col-md-4">
                    <Label className="col-xs-112  col-sm-12 col-md-12 status-color" label="BK_MY_BK_ROOM_FROM_DATE" />
                    <Label
                      className="col-xs-12 col-sm-12 col-md-12  status-result-color"
                    
                      id="complaint-details-submission-date"
                      labelStyle={{ color: "inherit" }}
                      label={room.fromDate}
                    />
                  </div>
                  <div className="col-md-4">
                    <Label className="col-xs-112  col-sm-12 col-md-12 status-color" label="BK_MY_BK_ROOM_TO_DATE" />
                    <Label
                      className="col-xs-12 col-sm-12 col-md-12  status-result-color"
                    
                      id="complaint-details-submission-date"
                      labelStyle={{ color: "inherit" }}
                      label={room.toDate}
                    />
                  </div>
                  {/* <div className="col-md-4">
                    <Label className="col-xs-112  col-sm-12 col-md-12 status-color" label="BK_MY_BK_ROOM_APPLICATION_CREATED_DATE" />
                    <Label
                      className="col-xs-12 col-sm-12 col-md-12  status-result-color"
                    
                      id="complaint-details-submission-date"
                      labelStyle={{ color: "inherit" }}
                      label={room.createdDate}
                    />
                  </div> */}
               
                </div>
              </div>
            </div>
          }
        />
   )
 })}
   </div>
 )
 
  }
}
const mapStateToProps = state => {
  const { complaints, bookings,common, auth, form } = state;
  const { userInfo } = auth;
  const {RoomPaymentReceipt,RoomPermissionLetter} = bookings

  return {userInfo,state,RoomPermissionLetter,RoomPaymentReceipt}
}

const mapDispatchToProps = dispatch => {
  return {
    downloadRoomPermissionLetter: criteria => dispatch(downloadRoomPermissionLetter(criteria)),  //
    downloadRoomPaymentRecipt: criteria => dispatch(downloadRoomPaymentRecipt(criteria)),//
    fetchDataAfterPayment: criteria => dispatch(fetchDataAfterPayment(criteria)),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AppDetails);

// export default AppDetails;
