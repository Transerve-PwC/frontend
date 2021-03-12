import React, { Component } from "react";
import { Button, Icon } from "components";
import Label from "egov-ui-kit/utils/translationNode";
import SuccessMessageForPCC from "../../modules/SuccessMessageForPCC";
import { connect } from "react-redux";
// import { createWaterTankerApplication, downloadBWTApplication,downloadPaccPermissionLetter,,
//   downloadEsampPaymentReceipt} from "../../redux/bookings/actions";
import jp from "jsonpath";
import { getDurationDate, getFileUrlFromAPI,convertEpochToDate} from '../../modules/commonFunction'
import {downloadEsampPaymentReceipt} from "egov-ui-kit/redux/bookings/actions";
import "./index.css";
import { SortDialog, Screen } from "modules/common";
import isEmpty from "lodash/isEmpty";
import {
	downloadEsamparkApp,downloadPaccPermissionLetter,fetchDataAfterPayment
} from "egov-ui-kit/redux/bookings/actions";
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


  continueComplaintSubmit = () => {
    let { createPACCApplicationData,userInfo,fetchSuccess } = this.props;
    createPACCApplicationData={}
    fetchSuccess=false;
  
    this.props.history.push(`/egov-services/all-applications`);
    window.location.reload(); 
  };
  componentDidMount = async () => {  
    let {userInfo} = this.props
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
              "refundableCharges": applicationDetails.bkRefundAmount,
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
    const { createWaterTankerApplicationData,myLocationtwo, downloadBWTApplication,loading,createPACCApplicationData, updatePACCApplicationData } = this.props;
    return (
      <Screen loading={loading}>
      <div className="success-message-main-screen resolve-success">
      <SuccessMessageForPCC
         headermessage="BK_MYBK_APPLY_SPECIAL_REQUEST_HEADER"
          successmessage="BK_ES_APPLICATION_CREATED_SUCCESS_MESSAGE"
          secondaryLabel="BK_CS_COMMON_SEND_MESSAGE"
          containerStyle={{ display: "inline-block" }}
          icon={<Icon action="navigation" name="check" />}
          backgroundColor={"#22b25f"}
          applicationNumber={createPACCApplicationData&&createPACCApplicationData?createPACCApplicationData.bkApplicationNumber:''}
        />
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
            onClick={this.continueComplaintSubmit}
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
  const { updatePACCApplicationData,fetchSuccess, Downloadesamparkdetails,EmpPaccPermissionLetter,fetchPaymentAfterPayment,PaymentReceiptByESamp} = bookings;
  const { createWaterTankerApplicationData, DownloadBWTApplicationDetails,categoriesById } = complaints;
  let documentMap = state.screenConfiguration.preparedFinalObject ? state.screenConfiguration.preparedFinalObject.documentMap : "";
  let createPACCApplicationData = state.screenConfiguration.preparedFinalObject ? state.screenConfiguration.preparedFinalObject.CreatePaccAppData : "NotAnyMore";
  console.log("createPACCApplicationData--",createPACCApplicationData)

  let ReceiptPaymentDetails = fetchPaymentAfterPayment;
console.log("ReceiptPaymentDetails--",ReceiptPaymentDetails)
  let totalAmount = state.screenConfiguration.preparedFinalObject.ResponseOfCashPayment.Payments[0].paymentDetails[0].totalAmountPaid
  

  let offlinePayementMode = state.screenConfiguration.preparedFinalObject.ResponseOfCashPayment.Payments[0].paymentMode
  console.log("offlinePayementMode--",offlinePayementMode)

  let offlineTransactionDate = state.screenConfiguration.preparedFinalObject.ResponseOfCashPayment.Payments[0].transactionDate
  console.log("offlineTransactionDate--",offlineTransactionDate) 

  let offlineTransactionNum = state.screenConfiguration.preparedFinalObject.ResponseOfCashPayment.Payments[0].transactionNumber
  console.log("offlineTransactionNum--",offlineTransactionNum)

  let recNumber = state.screenConfiguration.preparedFinalObject.ResponseOfCashPayment.Payments[0].paymentDetails[0].receiptNumber

console.log("recNumber--",recNumber)

let billAccountDetailsArray =  state.screenConfiguration.preparedFinalObject.ResponseOfCashPayment.Payments[0].paymentDetails[0].bill.billDetails[0].billAccountDetails
console.log("billAccountDetailsArray--",billAccountDetailsArray)
let PACC = 0;
let LUXURY_TAX = 0;
let REFUNDABLE_SECURITY = 0;
let PACC_TAX = 0;
let PACC_ROUND_OFF = 0;
let FACILITATION_CHARGE = 0;

if(billAccountDetailsArray !== "NOt found Any Array"){
for(let i = 0; i < billAccountDetailsArray.length ; i++ ){

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
}


  const loading = false;

  
  return {PACC,LUXURY_TAX,REFUNDABLE_SECURITY,PACC_TAX,PACC_ROUND_OFF,FACILITATION_CHARGE,totalAmount,offlinePayementMode,
    offlineTransactionDate,recNumber,offlineTransactionDate,offlineTransactionNum,PaymentReceiptByESamp,
    createWaterTankerApplicationData, DownloadBWTApplicationDetails,loading,fetchSuccess,createPACCApplicationData,
    updatePACCApplicationData,Downloadesamparkdetails,userInfo,documentMap,EmpPaccPermissionLetter
  }
}

const mapDispatchToProps = dispatch => {
  return {
    downloadPaccPermissionLetter: criteria => dispatch(downloadPaccPermissionLetter(criteria)), 
    downloadEsampPaymentReceipt: criteria => dispatch(downloadEsampPaymentReceipt(criteria)), 
    downloadEsamparkApp: criteria => dispatch(downloadEsamparkApp(criteria)),
    createWaterTankerApplication: criteria => dispatch(createWaterTankerApplication(criteria)),//
    toggleSnackbarAndSetText: (open, message, error) =>
      dispatch(toggleSnackbarAndSetText(open, message, error)),
      fetchDataAfterPayment: (open, message, error) =>
      dispatch(fetchDataAfterPayment(open, message, error)),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateWBTApplicationSuccess);