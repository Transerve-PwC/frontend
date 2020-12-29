import React, { Component } from "react";
import { Button, Icon } from "components";
import Label from "egov-ui-kit/utils/translationNode";
import SuccessMessageForPayment from "../../modules/SuccessMessageForPayment";
import { connect } from "react-redux";
import { createWaterTankerApplication, downloadBWTApplication,downloadReceiptForPCC } from "../../redux/bookings/actions";
import jp from "jsonpath";
import { getDurationDate, getFileUrlFromAPI} from '../../modules/commonFunction'
import "./index.css";
import { SortDialog, Screen } from "modules/common";
import isEmpty from "lodash/isEmpty";
import {
	downloadEsamparkApp,updatePACCApplication
} from "egov-ui-kit/redux/bookings/actions";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";


class CreateWBTApplicationSuccess extends Component {

  Submit = async () => {
	  alert("comesInSubmit Function")
   let { updatePACCApplication, documentMap,createAppData, bookingData, venueType,prepareFinalObject,createPACCApplicationData } = this.props;
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
		const {  paymentDetailsForReceipt, downloadReceiptForPCC, userInfo, selectedComplaint } = this.props;
		
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
				"paymentDate": "13th Augest 2020",
				"transactionId": "EDR654GF35",
				"bookingPeriod": "13th Aug 2020 to 12th Sep 2020",
				"bookingItem": "Online Payment Against Booking of PARK NO 69 INFRONT OF HNO 3259-60 SEC 44 CHD",
				"amountInWords": "Three Thousands Five Hundred Fourty Rupees",
				"paymentItemExtraColumnLabel": "Booking Period",
				"paymentMode": "Online",
				"receiptNo": "08/2020-21/000304",
				"baseCharge": 4000,
				"cleaningCharges": 345,
				"surcharges": 100,
				"facilitationCharge": 100,
				"utgst": 100,
				"cgst": 100,
				"gst": 200,
				"totalAmount": 4400
			},
			"payerInfo": {
				"payerName": "Ramadesh KushWaha",
				"payerMobile": "9877782389"
			},
			"generatedBy": {
				"generatedBy": "Anil Clerk"
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
	const { RecNumber,createWaterTankerApplicationData,myLocationtwo, downloadBWTApplication,loading,createPACCApplicationData, updatePACCApplicationData,AppNum } = this.props;
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
         headermessage="Collection Details"
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
            label={<Label buttonLabel={true} label="BK_CORE_COMMON_DOWNLOAD" />}
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
  
  return {
    createWaterTankerApplicationData, DownloadBWTApplicationDetails,loading,fetchSuccess,createPACCApplicationData,selectedComplaint,
    updatePACCApplicationData,Downloadesamparkdetails,userInfo,documentMap,AppNum,DownloadReceiptDetailsforPCC,RecNumber,createAppData
 ,venueType,vanueData,bookingData,bookingData
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