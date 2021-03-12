import React, { Component } from "react"; 
import { Button, Icon } from "components";
import Label from "egov-ui-kit/utils/translationNode";
import SuccessMessageForPayment from "../../modules/SuccessMessageForPayment";
import { connect } from "react-redux";
import { createWaterTankerApplication, downloadBWTApplication,downloadReceiptForPCC,
	fetchDataAfterPayment } from "../../redux/bookings/actions";
import jp from "jsonpath";
import "./index.css";
import { SortDialog, Screen } from "modules/common";
import isEmpty from "lodash/isEmpty";
import {
	downloadEsamparkApp,updatePACCApplication,downloadPaccPermissionLetter,downloadEsampPaymentReceipt
} from "egov-ui-kit/redux/bookings/actions";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { convertEpochToDate, getDurationDate,getFileUrlFromAPI} from '../../modules/commonFunction'
import { httpRequest } from "egov-ui-kit/utils/api";


class CreateWBTApplicationSuccess extends Component {

	constructor(props) {
		super(props);
	this.state = { 
operatorCode : "",
Address: "",
hsnCode : "",
name: "",
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

	this.props.history.push(`/egov-services/all-applications`);
    window.location.reload(); 

//   alert("comesInSubmit Function")
//    let { conJsonSecond,conJsonfirst,updatePACCApplication, documentMap,createAppData, bookingData, venueType,prepareFinalObject,createPACCApplicationData,SecTimeSlotFromTime,SecTimeSlotToTime,firstToTimeSlot,ReasonForDiscount} = this.props;
// console.log("AllPropsOfSubmitPage--",this.props)	   
//    let data = createAppData.data
// 		console.log("data--",data)
//         // let data  = dataOne;
//         // console.log("data--",data),
//         prepareFinalObject("CreatePaccAppData",data);
//         let fid = documentMap ? Object.keys(documentMap) : ""
//         const { firstName, userInfo, email, mobileNo, surcharge, fromDate, toDate, utGST, cGST, GSTnumber, dimension, location, facilitationCharges, cleaningCharges, rent, houseNo, type, purpose, locality, residenials } = this.props;
     
//         if (data) {
// 			console.log("HereIsData--",data)
//             let Booking = {
// 				bkRemarks: data.bkRemarks,
// 				bkResidentialOrCommercial: data.bkResidentialOrCommercial,
// 				bkMaterialStorageArea: data.bkMaterialStorageArea,
// 				discount:data.discount,
// 				bkPlotSketch:data.bkPlotSketch,
//                 bkBookingType: data.bkBookingType,
//                 bkBookingVenue: data.bkBookingVenue,
//                 bkApplicantName: data.bkApplicantName,
//                 bkMobileNumber: data.bkMobileNumber,
// 				bkDimension: data.bkDimension,
// 				bkPaymentStatus: "SUCCESS",
//                 bkLocation: data.bkLocation,
//                 bkFromDate: data.bkFromDate,
//                 bkToDate: data.bkToDate,
//                 bkCleansingCharges: data.bkCleansingCharges,
//                 bkRent: data.bkRent,
//                 bkSurchargeRent: data.bkSurchargeRent,
//                 bkUtgst: data.bkUtgst,
//                 bkCgst: data.bkCgst,
//                 bkSector: data.bkSector,
//                 bkEmail: data.bkEmail,
//                 bkHouseNo: data.bkHouseNo,
//                 bkBookingPurpose: data.bkBookingPurpose,
//                 bkApplicationNumber: data.bkApplicationNumber,
//                 bkCustomerGstNo: data.bkCustomerGstNo ? data.bkCustomerGstNo : 'NA',
//                 "wfDocuments": [{
//                     "fileStoreId": fid[0]
//                 }],
//                 "tenantId": userInfo.tenantId,
//                 "bkAction": data.bkApplicationStatus == "OFFLINE_RE_INITIATED" ? "OFFLINE_MODIFY" : "OFFLINE_APPLY",
// 				"businessService": "PACC",
// 				"reInitiateStatus": false,
// 				"financialYear": "2020-2021",
// 				"bkBankAccountNumber":data.bkBankAccountNumber,
// 				"bkBankName":data.bkBankName,
// 				"bkIfscCode":data.bkIfscCode,
// 				"bkAccountType":data.bkAccountType,
// 				"bkBankAccountHolder":data.bkBankAccountHolder,
// 				"bkNomineeName": data.bkNomineeName
//             }


//             if (venueType == "Community Center" && bookingData && bookingData.bkFromTime) {
// 				let slotArray = []
// 				let checkslotArray = []
// 				// if(wholeDaySlot != "notFound" && wholeDaySlot != "notFound"){
// 				// 	console.log("OneDay")
// 				// 	checkslotArray[0] = {"slot":"9AM - 1PM"}
// 				// 	checkslotArray[1] = {"slot": "1PM - 5PM"}
// 				// 	checkslotArray[2] = {"slot": "5PM - 9PM"}
// 				// }
// 				if(SecTimeSlotFromTime != "notFound" && SecTimeSlotToTime != "notFound"){
// 					console.log("secondTimeSlot")
// 					slotArray[0] = conJsonfirst,
// 					slotArray[1] = conJsonSecond //conJsonSecond,conJsonfirst
				
// 					checkslotArray[0] = this.props.first,
//                      checkslotArray[1] = this.props.second
// 				}
// 				else{
// 					console.log("oneTimeSlot")
// 					checkslotArray[0] = {
// 					"slot": bookingData.bkFromTime + '-' + firstToTimeSlot
// 					}
// 				}
// 				console.log("slotArray_",slotArray)   //checkslotArray
// 				console.log("checkslotArray",checkslotArray)
// 				Booking.timeslots = checkslotArray,
//                 Booking.bkDuration = "HOURLY",
//                 Booking.bkFromDate = bookingData.bkFromDate,
//                 Booking.bkToDate = bookingData.bkToDate,
//                 Booking.bkFromTime = bookingData.bkFromTime,
//                 Booking.bkToTime = bookingData.bkToTime
//             }
//             else if (venueType == "Community Center" && (!bookingData) && (!bookingData.bkFromTime)) {
//                 Booking.timeslots = [{
//                     "slot": "9:00 AM - 8:59 AM"
//                 }],
//                     Booking.bkDuration = "FULLDAY"
//             }

// console.log("Booking-requestBody--",Booking)

//  await updatePACCApplication(
//                 {
//                     "applicationType": "PACC",
//                     "applicationStatus": "",
//                     "applicationId": data.bkApplicationNumber,
//                     "tenantId": userInfo.tenantId,
//                     "Booking": Booking
// 				});
				
//             this.props.history.push(`/egov-services/create-success-pcc`);
//         }
  };
//   componentDidMount = async () => {   


//   }

componentDidMount = async () => {  
    let {userInfo,fetchDataAfterPayment} = this.props
      let mdmsBody = {
        MdmsCriteria: {
          tenantId: userInfo.tenantId,
          moduleDetails: [
    
            {
              moduleName: "Booking",
              masterDetails: [
                {
                  name: "E_SAMPARK_BOOKING",
                }
              ],
            },
    
          ],
        },
      };
    
      let payloadRes = null;
      payloadRes = await httpRequest(
        "egov-mdms-service/v1/_search",
        "_search",[],
        mdmsBody
      );
      console.log(payloadRes, "hsncodeAndAll");
    
    let samparkDetail = payloadRes.MdmsRes.Booking.E_SAMPARK_BOOKING
    
    let operatorCode;
    let Address;
    let hsnCode;
    let name;
    
    for(let i = 0; i < samparkDetail.length; i++){
      if(samparkDetail[i].id == userInfo.fatherOrHusbandName){
      operatorCode = samparkDetail[i].operatorCode
      hsnCode = samparkDetail[i].hsnCode
      name = samparkDetail[i].name
      Address = samparkDetail[i].centreAddres
      }
    }
    this.setState({
      operatorCode:operatorCode,
      Address:Address,  
      hsnCode:hsnCode,
      name:name
    })
    
        fetchDataAfterPayment(
          [{ key: "consumerCodes", value: this.props.AppNum }, { key: "tenantId", value: userInfo.tenantId }
          ])
    
    
      }

downloadPermissionButton = async (e) => {
	console.log("comInFunction")
  await this.downloadPermissionLetter();
	   const {DownloadBWTApplicationDetails,userInfo,EmpPaccPermissionLetter}=this.props;
   
	   var documentsPreview = [];
	   let documentsPreviewData;
	   if (EmpPaccPermissionLetter && EmpPaccPermissionLetter.filestoreIds.length > 0) {	
		 documentsPreviewData = EmpPaccPermissionLetter.filestoreIds[0];
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

 downloadPermissionLetter = async (e) => {
		console.log("comeInAnotherFunction")
		const { downloadPaccPermissionLetter, userInfo,createPACCApplicationData,documentMap,PACC,LUXURY_TAX,REFUNDABLE_SECURITY,PACC_TAX,PACC_ROUND_OFF,FACILITATION_CHARGE} = this.props;
	
		let applicationDetails = createPACCApplicationData ? createPACCApplicationData : 'dataNotFound';
		console.log("applicationDetails--",applicationDetails)
	
	
		let Newugst;
		let perFind = 50;
		let ugst = PACC_TAX 
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
	
		let approverName;
	  for(let i = 0; i < userInfo.roles.length ; i++ ){
		if(userInfo.roles[i].code == "BK_E-SAMPARK-CENTER"){
		  approverName = userInfo.roles[i].name
		}
	  }
	  let fdocname = "Not Applicable"
	  let checkDocumentUpload;
	if(documentMap !== undefined && documentMap !== null){
	
	  checkDocumentUpload = Object.entries(documentMap).length === 0;
	  console.log("checkDocumentUpload",checkDocumentUpload)
	
	
	  if(checkDocumentUpload == false){
		fdocname = Object.entries(documentMap)[0][1]
	  }
	}
	   let BookingInfo  = [
		 {
		"applicantDetail": {
		  "name": applicationDetails.bkApplicantName,
		  "mobileNumber":applicationDetails.bkMobileNumber,
		  "email": applicationDetails.bkEmail,
		  "permanentAddress": "Not Applicable",
		  "permanentCity": "Chandigarh",
		  "sector": applicationDetails.bkSector,
		  "fatherName": "",
		  "custGSTN": applicationDetails.bkCustomerGstNo,
		  "placeOfService": "Chandigarh"
	  },
				"bookingDetail": {
				  "applicationNumber": applicationDetails.bkApplicationNumber,
				  "applicationDate": applicationDetails.bkDateCreated,
				  "bookingPeriod":  getDurationDate(
					applicationDetails.bkFromDate,
					applicationDetails.bkToDate
				  ),
				  "bookingType": applicationDetails.bkBookingType, 
				  "bkRemarks": applicationDetails.bkRemarks,
				   "venueName": applicationDetails.bkLocation,
				  "sector": applicationDetails.bkSector,
				  "bookingPurpose": applicationDetails.bkBookingPurpose,
			  },
			  "generated": {
				"generatedBy": userInfo.name,
			  },
			  "approvedBy": {
				"approvedBy": userInfo.name,
				"role": approverName
			},
			"emp": {
			  "samparkName": this.state.name,
			  "samparkaddress": this.state.Address,
			  "OpCode":this.state.operatorCode
			},
	  //PACC,LUXURY_TAX,REFUNDABLE_SECURITY,PACC_TAX,PACC_ROUND_OFF,FACILITATION_CHARGE     
			  "paymentInfo": {
				  "cleaningCharges": applicationDetails.bkCleansingCharges,
				  "baseCharge": PACC,
				  "cgst" :applicationDetails.bkCgst,
				  "utgst": applicationDetails.bkCgst,
				  "totalgst": PACC_TAX,
				  "refundableCharges": REFUNDABLE_SECURITY,
				  "totalPayment": this.props.totalAmount,
				  "paymentDate": convertEpochToDate(this.props.offlineTransactionDate,"dayend"),
				  "receiptNo": this.props.recNumber,
			  },
			  "OtherDetails": {
				  "clchargeforwest":  applicationDetails.bkCleansingCharges,
				  "westaddress": "",
				  "clchargeforother": ""
			  },
			  "tenantInfo": {
				  "municipalityName": "Municipal Corporation Chandigarh",
				  "address": "New Deluxe Building, Sector 17, Chandigarh",
				  "contactNumber": "+91-172-2541002, 0172-2541003",
				  "logoUrl": "https://chstage.blob.core.windows.net/fileshare/logo.png",
				  "webSite": "http://mcchandigarh.gov.in",
				  "statecode": "998",
				  "hsncode": this.state.hsnCode,
				  "mcGSTN":""
			  },
			  "bankInfo": {
				  "accountholderName": applicationDetails.bkBankAccountHolder,
				  "rBankName": applicationDetails.bkBankName,
				  "rBankACNo": applicationDetails.bkBankAccountNumber,
				  "rIFSCCode": applicationDetails.bkIfscCode
			  }
		  }
	  ]
	  // downloadEsamparkApp({ BookingInfo: BookingInfo })
	  downloadPaccPermissionLetter({ BookingInfo: BookingInfo })
	
	  
	
	  }

// 	downloadPaymentReceiptButton = async (e) => {
// 		this.downloadPaymentReceiptFunction();
// 		let documentsPreviewData;
// 		const { DownloadReceiptDetailsforPCC,userInfo } = this.props;
// 		var documentsPreview = [];
// 		if (DownloadReceiptDetailsforPCC && DownloadReceiptDetailsforPCC.filestoreIds.length > 0) {
// 			documentsPreviewData = DownloadReceiptDetailsforPCC.filestoreIds[0];
// 			documentsPreview.push({ 
// 				title: "DOC_DOC_PICTURE",
// 				fileStoreId: documentsPreviewData,
// 				linkText: "View",
// 			});
// 			let fileStoreIds = jp.query(documentsPreview, "$.*.fileStoreId");
// 			let fileUrls =
// 				fileStoreIds.length > 0 ? await getFileUrlFromAPI(fileStoreIds,userInfo.tenantId) : {};


// 			documentsPreview = documentsPreview.map(function (doc, index) {
// 				doc["link"] =
// 					(fileUrls &&
// 						fileUrls[doc.fileStoreId] &&
// 						fileUrls[doc.fileStoreId].split(",")[0]) ||
// 					"";

// 				doc["name"] =
// 					(fileUrls[doc.fileStoreId] &&
// 						decodeURIComponent(
// 							fileUrls[doc.fileStoreId]
// 								.split(",")[0]
// 								.split("?")[0]
// 								.split("/")
// 								.pop()
// 								.slice(13)
// 						)) ||
// 					`Document - ${index + 1}`;
// 				return doc;
// 			});

// 			setTimeout(() => {
// 				window.open(documentsPreview[0].link);
// 			}, 100);
// 			prepareFinalObject('documentsPreview', documentsPreview)
// 		}
// 	}

//   downloadPaymentReceiptFunction = async (e) => {
//     const {  paymentDetailsForReceipt, downloadReceiptForPCC, userInfo, selectedComplaint,offlineTransactionNum,
//       offlineTransactionDate,offlinePayementMode,location,RecNumber,totalAmountPaid,six,one,Summarysurcharge,cleanOne,SummarycGST } = this.props;
// 	//offlineTransactionNum,offlineTransactionDate,offlinePayementMode	
// 		let BookingInfo = [{
// 			"applicantDetail": {
// 				"name": selectedComplaint.bkApplicantName,
// 				"mobileNumber": selectedComplaint.bkMobileNumber,
// 				"houseNo": selectedComplaint.bkHouseNo,
// 				"permanentAddress": "",
// 				"permanentCity": "ch.chandigarh",
// 				"sector": selectedComplaint.bkSector
// 			},
// 			"booking": {
// 				"bkApplicationNumber": selectedComplaint.bkApplicationNumber
// 			},
// 			"paymentInfo": {
// 				"paymentDate": convertEpochToDate(offlineTransactionDate, "dayend"),
// 				"transactionId": offlineTransactionNum,
// 				"bookingPeriod": getDurationDate(
// 					selectedComplaint.bkFromDate,
// 					selectedComplaint.bkToDate
//         ),
// 				"bookingItem": `Online Payment Against Booking of ${location}`,
// 				"amountInWords": this.NumInWords(
// 					totalAmountPaid
// 				),
//         paymentItemExtraColumnLabel: "Booking Period",
// 				"paymentMode": offlinePayementMode,
// 				"receiptNo": RecNumber,
// 				"baseCharge": one,
// 				"cleaningCharges": cleanOne,
// 				"surcharges": Summarysurcharge,
// 				"facilitationCharge": six,
// 				"utgst": SummarycGST,
// 				"cgst": SummarycGST,
// 				"gst": SummarycGST,
// 				"totalAmount": totalAmountPaid
// 			},
// 			"payerInfo": {
// 				"payerName":  selectedComplaint.bkApplicantName,
// 				"payerMobile":  selectedComplaint.bkMobileNumber
// 			},
// 			"generatedBy": {
// 				"generatedBy": userInfo.name,
// 			},
// 			"tenantInfo": {
// 				"municipalityName": "Municipal Corporation Chandigarh",
// 				"address": "New Deluxe Building, Sector 17, Chandigarh",
// 				"contactNumber": "+91-172-2541002, 0172-2541003"
// 			}
// 		}
// 		]

// 		downloadReceiptForPCC({ BookingInfo: BookingInfo })
// 	}

	

	// downloadpermissionletter = async = (e) => {
	// 	alert("hlo")
	// }


	downloadPaymentReceiptBody = async (e) => {
		const { downloadEsamparkApp, userInfo,createPACCApplicationData,documentMap,downloadEsampPaymentReceipt,PACC,LUXURY_TAX,REFUNDABLE_SECURITY,PACC_TAX,PACC_ROUND_OFF,FACILITATION_CHARGE} = this.props;
		
		let applicationDetails = createPACCApplicationData ? createPACCApplicationData : 'dataNotFound';
		console.log("applicationDetails--",applicationDetails)
		let Newugst;
		let perFind = 50;
		let ugst = PACC_TAX 
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
	
		let approverName;
	  for(let i = 0; i < userInfo.roles.length ; i++ ){
		if(userInfo.roles[i].code == "BK_E-SAMPARK-CENTER"){
		  approverName = userInfo.roles[i].name
		}
	  }
	  let fdocname = "Not Applicable"
	  let checkDocumentUpload;
	if(documentMap !== undefined && documentMap !== null){
	
	  checkDocumentUpload = Object.entries(documentMap).length === 0;
	  console.log("checkDocumentUpload",checkDocumentUpload)
	
	
	  if(checkDocumentUpload == false){
		fdocname = Object.entries(documentMap)[0][1]
	  } 
	
	}
		let BookingInfo = [
		  {
			  "applicantDetail": {
				"name": applicationDetails.bkApplicantName,
				"mobileNumber":applicationDetails.bkMobileNumber,
				"email": applicationDetails.bkEmail,
				  "permanentAddress": applicationDetails.bkHouseNo,
				  "permanentCity": "Chandigarh",
				  "sector": applicationDetails.bkSector,
				  "fatherName": "",
				  "custGSTN": applicationDetails.bkCustomerGstNo == "NA" ? "Not Applicable":applicationDetails.bkCustomerGstNo ,
				  "placeOfService": "Chandigarh"
			  },
			  "bookingDetail": {
				  "applicationNumber": applicationDetails.bkApplicationNumber,
				  "applicationDate":applicationDetails. createdDate,
				  "bookingPeriod": getDurationDate(
					applicationDetails.bkFromDate,
					applicationDetails.bkToDate
				  ), 
				  "bookingType": applicationDetails.bkBookingType,
				  "venueName": applicationDetails.bkLocation,
				  "sector": applicationDetails.bkSector,
				  "bookingPurpose": applicationDetails.bkBookingPurpose,
				  
			  },
			  "booking": {
				  "bkLocation": applicationDetails.bkLocation,
				  "bkDept": applicationDetails.bkBookingType,
				  "bkFromTo": getDurationDate(
					applicationDetails.bkFromDate,
					applicationDetails.bkToDate
				  ),
				  "applicationNumber": applicationDetails.bkApplicationNumber,
			  },
			  "generated": {
				"generatedBy": userInfo.name,
			  },
			  "approvedBy": {
				"approvedBy": userInfo.name,
				"role": approverName
			},
			  "emp": {
				  "samparkName": this.state.name,
				  "address":this.state.Address,
				  "OpCode":this.state.operatorCode
			  },
			  "paymentInfo": {
				"cleaningCharges": applicationDetails.bkCleansingCharges,
				"baseCharge": PACC,
				"cgst" :applicationDetails.bkCgst,
				"utgst": applicationDetails.bkCgst,
				"totalgst": PACC_TAX,
				"refundableCharges": this.props.REFUNDABLE_SECURITY,    //applicationDetails.bkRefundAmount,
				"totalPayment": this.props.totalAmount,
				"paymentDate": convertEpochToDate(this.props.offlineTransactionDate,"dayend"),
				"receiptNo": this.props.recNumber,
				  "paymentType": this.props.offlinePayementMode,
				  "facilitationCharge": FACILITATION_CHARGE,
				  "discType": applicationDetails.discount,
				  "transactionId": this.props.offlineTransactionNum,
				  "totalPaymentInWords": this.NumInWords(
					this.props.totalAmount
				  ),  //offlineTransactionDate,,
				  "bankName":""
			  },
			  "OtherDetails": {
				"clchargeforwest":  applicationDetails.bkCleansingCharges,
				"westaddress": "",
				"clchargeforother": ""
			},
			  "tenantInfo": {
				  "municipalityName": "Municipal Corporation Chandigarh",
				  "address": "New Deluxe Building, Sector 17, Chandigarh",
				  "contactNumber": "+91-172-2541002, 0172-2541003",
				  "logoUrl": "https://chstage.blob.core.windows.net/fileshare/logo.png",
				  "webSite": "http://mcchandigarh.gov.in",
				  "mcGSTN": "",
				  "statecode": "998",
				  "hsncode": this.state.hsnCode
			  },
	  
			  "bankInfo": {
				"accountholderName": applicationDetails.bkBankAccountHolder,
				"rBankName": applicationDetails.bkBankName,
				"rBankACNo": applicationDetails.bkBankAccountNumber,
				"rIFSCCode": applicationDetails.bkIfscCode
			}
	
	
		  }
	  ]
	  downloadEsampPaymentReceipt({ BookingInfo: BookingInfo })
	 };
	 downloadPaymentReceiptButton = async (e) => {
	  await this.downloadPaymentReceiptBody();
	  const {DownloadBWTApplicationDetails,userInfo,Downloadesamparkdetails,PaymentReceiptByESamp}=this.props;
	  
		  var documentsPreview = [];
		  let documentsPreviewData;
		  if (PaymentReceiptByESamp && PaymentReceiptByESamp.filestoreIds.length > 0) {	
			documentsPreviewData = PaymentReceiptByESamp.filestoreIds[0];
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
			  
			}}
		

  render() {
  const { RecNumber,createWaterTankerApplicationData,myLocationtwo, downloadBWTApplication,loading,createPACCApplicationData, updatePACCApplicationData,AppNum} = this.props;
    return (
      <Screen loading={loading}>
      <div className="success-message-main-screen resolve-success">
      <SuccessMessageForPayment
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
		    <div className="responsive-action-button-cont">
          <Button
            className="responsive-action-button"
            primary={true}
            label={<Label buttonLabel={true} label="BK_CORE_ROOM_DOWNLOAD_PAYMENT_BUTTON" />}
            fullWidth={true}
            onClick={this.downloadPaymentReceiptButton}
            style={{ marginRight: 18 }}
          />
           <Button
            className="responsive-action-button"
            primary={true}
            label={<Label buttonLabel={true} label="BK_CORE_ROOM_DOWNLOAD_PERMISSION_LETTER_BUTTON" />}
            fullWidth={true}
            onClick={this.downloadPermissionButton}
            style={{ marginRight: 18 }}
          />
          <Button
            id="resolve-success-continue"
            primary={true}
            label={<Label buttonLabel={true} label="CORE_COMMON_GOTOHOME" />}
            fullWidth={true}
            onClick={this.Submit}
            className="responsive-action-button"
          />
        </div>
        </div>
      </div>
      </Screen>
    );
  }
}


const mapStateToProps = state => {
  const { complaints, bookings,common, auth, form } = state;
  const { userInfo } = auth;
  const { updatePACCApplicationData,fetchSuccess, Downloadesamparkdetails, applicationData,DownloadReceiptDetailsforPCC,EmpPaccPermissionLetter,PaymentReceiptByESamp} = bookings;
  const { createWaterTankerApplicationData, DownloadBWTApplicationDetails,categoriesById } = complaints;
  let documentMap = state.screenConfiguration.preparedFinalObject ? state.screenConfiguration.preparedFinalObject.documentMap : ""; 
  let createPACCApplicationData = state.screenConfiguration.preparedFinalObject ? state.screenConfiguration.preparedFinalObject.CreatePaccAppData : "NotAnyMore"; 
  console.log("createPACCApplicationData--",createPACCApplicationData)
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
// let offlineTransactionNum = offlinePayment ? offlinePayment.Payments[0].transactionNumber : "NotFound"
// console.log("offlineTransactionNum--",offlineTransactionNum)  

//transactionDate
// let offlineTransactionDate = offlinePayment ? offlinePayment.Payments[0].transactionDate : "NotFound"
// console.log("offlineTransactionDate--",offlineTransactionDate) 

//paymentMode
// let offlinePayementMode = offlinePayment ? offlinePayment.Payments[0].paymentMode : "NotFound"
// console.log("offlinePayementMode--",offlinePayementMode)

//screenConfiguration.preparedFinalObject.availabilityCheckData.bkLocation
let location = state.screenConfiguration.preparedFinalObject.availabilityCheckData.bkLocation ? state.screenConfiguration.preparedFinalObject.availabilityCheckData.bkLocation : "notfound"
console.log("location--",location)

//totalAmountPaid
let totalAmountPaid = offlinePayment ? offlinePayment.Payments[0].paymentDetails[0].bill.totalAmount : "NotFound"
console.log("totalAmountPaid--",totalAmountPaid)

//base charges
// let totalAmount =  offlinePayment ? offlinePayment.Payments[0].paymentDetails[0].bill : "NotFound" // till here

let totalAmount = state.screenConfiguration.preparedFinalObject.ResponseOfCashPayment.Payments[0].paymentDetails[0].totalAmountPaid
  

  let offlinePayementMode = state.screenConfiguration.preparedFinalObject.ResponseOfCashPayment.Payments[0].paymentMode
  console.log("offlinePayementMode--",offlinePayementMode)

  let offlineTransactionDate = state.screenConfiguration.preparedFinalObject.ResponseOfCashPayment.Payments[0].transactionDate
  console.log("offlineTransactionDate--",offlineTransactionDate) 

  let offlineTransactionNum = state.screenConfiguration.preparedFinalObject.ResponseOfCashPayment.Payments[0].transactionNumber
  console.log("offlineTransactionNum--",offlineTransactionNum)

  let recNumber = state.screenConfiguration.preparedFinalObject.ResponseOfCashPayment.Payments[0].paymentDetails[0].receiptNumber

console.log("recNumber--",recNumber)


let billAccountDetailsArray =  offlinePayment ? offlinePayment.Payments[0].paymentDetails[0].bill.billDetails[0].billAccountDetails : "NOt found Any Array"
console.log("billAccountDetailsArray--",billAccountDetailsArray)
let one = 0;
let two = 0;
let three = 0;
let four = 0;
let five = 0;
let six = 0;
for(let i = 0; i < billAccountDetailsArray.length ; i++ ){

if(billAccountDetailsArray[i].taxHeadCode == "PARKING_LOTS_MANUAL_OPEN_SPACE_BOOKING_BRANCH"){//PACC
    one = billAccountDetailsArray[i].amount 
}
else if(billAccountDetailsArray[i].taxHeadCode == "CLEANING_CHRGS_MANUAL_OPEN_SPACE_BOOKING_BRANCH"){//LUXURY_TAX
    two = billAccountDetailsArray[i].amount
}
else if(billAccountDetailsArray[i].taxHeadCode == "SECURITY_MANUAL_OPEN_SPACE_BOOKING_BRANCH"){//REFUNDABLE_SECURITY
    three = billAccountDetailsArray[i].amount
}
else if(billAccountDetailsArray[i].taxHeadCode == "CGST_UTGST_MANUAL_OPEN_SPACE_BOOKING_BRANCH"){//PACC_TAX
    four = billAccountDetailsArray[i].amount
}
else if(billAccountDetailsArray[i].taxHeadCode == "PACC_ROUND_OFF"){
    five = billAccountDetailsArray[i].amount
}
else if(billAccountDetailsArray[i].taxHeadCode == "FACILITATION_CHRGS_MANUAL_OPEN_SPACE_BOOKING_BRANCH"){//FACILITATION_CHARGE
    six = billAccountDetailsArray[i].amount
}
}
let PACC = 0;
let LUXURY_TAX = 0;
let REFUNDABLE_SECURITY = 0;
let PACC_TAX = 0;  
let PACC_ROUND_OFF = 0;
let FACILITATION_CHARGE = 0;


if(billAccountDetailsArray !== "NOt found Any Array"){
	for(let i = 0; i < billAccountDetailsArray.length ; i++ ){

	if(selectedComplaint.bkBookingType == "Parks"){

	if(billAccountDetailsArray[i].taxHeadCode == "PARKING_LOTS_MANUAL_OPEN_SPACE_BOOKING_BRANCH"){//PACC
	PACC = billAccountDetailsArray[i].amount
	}
	else if(billAccountDetailsArray[i].taxHeadCode == "CLEANING_CHRGS_MANUAL_OPEN_SPACE_BOOKING_BRANCH"){//LUXURY_TAX
		LUXURY_TAX = billAccountDetailsArray[i].amount
	}
	else if(billAccountDetailsArray[i].taxHeadCode == "SECURITY_MANUAL_OPEN_SPACE_BOOKING_BRANCH"){//REFUNDABLE_SECURITY
		REFUNDABLE_SECURITY = billAccountDetailsArray[i].amount
	}
	else if(billAccountDetailsArray[i].taxHeadCode == "CGST_UTGST_MANUAL_OPEN_SPACE_BOOKING_BRANCH"){//PACC_TAX
		PACC_TAX = billAccountDetailsArray[i].amount
	}
	else if(billAccountDetailsArray[i].taxHeadCode == "PACC_ROUND_OFF"){//FACILITATION_CHARGE
		PACC_ROUND_OFF = billAccountDetailsArray[i].amount
	}
	else if(billAccountDetailsArray[i].taxHeadCode == "FACILITATION_CHRGS_MANUAL_OPEN_SPACE_BOOKING_BRANCH"){
		FACILITATION_CHARGE = billAccountDetailsArray[i].amount
	}
       }
    if(selectedComplaint.bkBookingType == "Community Center"){

	if(billAccountDetailsArray[i].taxHeadCode == "RENT_COMMUNITY_CENTRES_JHANJ_GHAR_BOOKING_BRANCH"){//PACC
	PACC = billAccountDetailsArray[i].amount
	}
	else if(billAccountDetailsArray[i].taxHeadCode == "CLEANING_CHRGS_COMMUNITY_CENTRES_JHANJ_GHAR_BOOKING_BRANCH"){//LUXURY_TAX
		LUXURY_TAX = billAccountDetailsArray[i].amount
	}
	else if(billAccountDetailsArray[i].taxHeadCode == "SECURITY_CHRGS_COMMUNITY_CENTRES_JHANJ_GHAR_BOOKING_BRANCH"){//REFUNDABLE_SECURITY
		REFUNDABLE_SECURITY = billAccountDetailsArray[i].amount
	}
	else if(billAccountDetailsArray[i].taxHeadCode == "CGST_UTGST_COMMUNITY_CENTRES_JHANJ_GHAR_BOOKING_BRANCH"){//PACC_TAX
		PACC_TAX = billAccountDetailsArray[i].amount
	}
	else if(billAccountDetailsArray[i].taxHeadCode == "PACC_ROUND_OFF"){//FACILITATION_CHARGE
		PACC_ROUND_OFF = billAccountDetailsArray[i].amount
	}
	else if(billAccountDetailsArray[i].taxHeadCode == "FACILITATION_CHRGS_COMMUNITY_CENTRES_JHANJ_GHAR_BOOKING_BRANCH"){
		FACILITATION_CHARGE = billAccountDetailsArray[i].amount
	}
}
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
 ,venueType,vanueData,bookingData,bookingData,offlinePayment,offlineTransactionNum,offlineTransactionDate,recNumber,
 PACC,LUXURY_TAX,REFUNDABLE_SECURITY,PACC_TAX,PACC_ROUND_OFF,FACILITATION_CHARGE,totalAmount,PaymentReceiptByESamp,
 offlinePayementMode,location,totalAmountPaid,six,one,Summarysurcharge,cleanOne,SummarycGST,SecTimeSlotFromTime,SecTimeSlotToTime,EmpPaccPermissionLetter
}
}

const mapDispatchToProps = dispatch => {
  return {
    downloadBWTApplication: criteria => dispatch(downloadBWTApplication(criteria)),
    downloadReceiptForPCC: criteria => dispatch(downloadReceiptForPCC(criteria)),
    downloadEsamparkApp: criteria => dispatch(downloadEsamparkApp(criteria)),
	createWaterTankerApplication: criteria => dispatch(createWaterTankerApplication(criteria)),
	downloadPaccPermissionLetter: criteria => dispatch(downloadPaccPermissionLetter(criteria)),
	downloadEsampPaymentReceipt: criteria => dispatch(downloadEsampPaymentReceipt(criteria)), 
	updatePACCApplication: (criteria, hasUsers, overWrite) => dispatch(updatePACCApplication(criteria, hasUsers, overWrite)),
    toggleSnackbarAndSetText: (open, message, error) =>
	  dispatch(toggleSnackbarAndSetText(open, message, error)),
	  prepareFinalObject: (jsonPath, value) =>
	  dispatch(prepareFinalObject(jsonPath, value)),
	  fetchDataAfterPayment: (open, message, error) =>
      dispatch(fetchDataAfterPayment(open, message, error)), 
	 
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateWBTApplicationSuccess);
/**
 {"ResponseInfo":{"apiId":"Rainmaker","ver":".01","ts":null,"resMsgId":"uief87324","msgId":"20170310130900|en_IN","status":"200"},"Payments":[{"id":"38bfccf5-3045-4702-aa09-a208e4c1f02c","tenantId":"ch.chandigarh","totalDue":1634.00,"totalAmountPaid":1634,"transactionNumber":"2484302323152424","transactionDate":1613705879797,"paymentMode":"CASH","instrumentDate":1613705879797,"instrumentNumber":null,"instrumentStatus":"APPROVED","ifscCode":null,"auditDetails":{"createdBy":"182","createdTime":1613705879742,"lastModifiedBy":"182","lastModifiedTime":1613705879742},"additionalDetails":null,"paymentDetails":[{"id":"264e1d50-2763-4197-8c82-1161853410af","tenantId":"ch.chandigarh","totalDue":1634.00,"totalAmountPaid":1634,"receiptNumber":"02/2020-21/001166","manualReceiptNumber":null,"manualReceiptDate":null,"receiptDate":1613705879742,"receiptType":"BILLBASED","businessService":"BKROOM","billId":"b5e9a7c2-8fea-4954-8c3a-a2cacb4bb9f5","bill":{"id":"b5e9a7c2-8fea-4954-8c3a-a2cacb4bb9f5","mobileNumber":"6398193660","paidBy":" ","payerName":"Vandana","payerAddress":null,"payerEmail":null,"payerId":null,"status":"ACTIVE","reasonForCancellation":null,"isCancelled":null,"additionalDetails":null,"billDetails":[{"billDescription":null,"displayMessage":null,"callBackForApportioning":null,"cancellationRemarks":null,"id":"4b2b8810-e370-469d-98b7-4360c4cdd42d","tenantId":"ch.chandigarh","demandId":"c43668ff-e495-4f6f-b64b-e565309afd3b","billId":"b5e9a7c2-8fea-4954-8c3a-a2cacb4bb9f5","amount":1634.00,"amountPaid":1634,"fromPeriod":1554057000000,"toPeriod":1869676199000,"additionalDetails":{"calculationDes1cription":[]},"channel":null,"voucherHeader":null,"boundary":null,"manualReceiptNumber":null,"manualReceiptDate":null,"billAccountDetails":[{"id":"c88db73d-32e3-4b13-9bbe-ddc47376c29b","tenantId":"ch.chandigarh","billDetailId":"4b2b8810-e370-469d-98b7-4360c4cdd42d","demandDetailId":"58289005-7195-4d10-adc8-de26503ba2e7","order":0,"amount":100.00,"adjustedAmount":100.00,"isActualDemand":null,"taxHeadCode":"ROOM_FACILITATION_CHARGE","additionalDetails":null,"purpose":null,"auditDetails":null},{"id":"f54233b5-a83c-4f45-aacb-d1fa4ab4e2e8","tenantId":"ch.chandigarh","billDetailId":"4b2b8810-e370-469d-98b7-4360c4cdd42d","demandDetailId":"834c0892-9dcd-4bd2-b404-9559d04822d5","order":0,"amount":234.00,"adjustedAmount":234.00,"isActualDemand":null,"taxHeadCode":"BKROOM_TAX","additionalDetails":null,"purpose":null,"auditDetails":null},{"id":"71d446bb-cb85-4394-931c-e7d579086c09","tenantId":"ch.chandigarh","billDetailId":"4b2b8810-e370-469d-98b7-4360c4cdd42d","demandDetailId":"3cac7095-7d20-4ae1-a915-72a38b5ecf09","order":0,"amount":1300.00,"adjustedAmount":1300.00,"isActualDemand":null,"taxHeadCode":"BKROOM","additionalDetails":null,"purpose":null,"auditDetails":null}],"collectionType":null,"auditDetails":null,"expiryDate":1613779199770}],"tenantId":"ch.chandigarh","auditDetails":{"createdBy":"28df855b-d5ff-43ff-bd13-fdf28875106b","createdTime":1613705864770,"lastModifiedBy":"28df855b-d5ff-43ff-bd13-fdf28875106b","lastModifiedTime":1613705864770},"collectionModesNotAllowed":null,"partPaymentAllowed":false,"isAdvanceAllowed":false,"minimumAmountToBePaid":null,"businessService":"BKROOM","totalAmount":1634.00,"consumerCode":"CH-BK-ROOM-2021-02-19-004381","billNumber":"BILLNO-BKROOM-004670","billDate":1613705864770,"amountPaid":1634},"additionalDetails":null,"auditDetails":{"createdBy":"182","createdTime":1613705879742,"lastModifiedBy":"182","lastModifiedTime":1613705879742}}],"paidBy":" ","mobileNumber":"6398193660","payerName":"Vandana","payerAddress":null,"payerEmail":null,"payerId":null,"paymentStatus":"NEW","fileStoreId":null}]}
  
 */