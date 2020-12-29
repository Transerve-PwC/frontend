import React, { Component } from "react";
import { Details } from "modules/common";
import { ComplaintTimeLine } from "modules/common";
import { Comments } from "modules/common";
import { ActionButton } from "modules/common";
import { Icon, MapLocation, ShareButton } from "components";
import CommonShare from "egov-ui-kit/components/CommonShare";
import { Screen } from "modules/common";
import pinIcon from "egov-ui-kit/assets/Location_pin.svg";
import { resetFiles } from "egov-ui-kit/redux/form/actions";
import Button from "@material-ui/core/Button";
import ShareIcon from "@material-ui/icons/Share";
import get from "lodash/get";
import isEqual from "lodash/isEqual";
import { httpRequest } from "egov-ui-kit/utils/api";
import { prepareFormData } from "egov-ui-kit/redux/common/actions";
import { getTenantId } from "egov-ui-kit/utils/localStorageUtils";
import CGAppDetails from "../AllApplications/components/CGAppDetails"
import PaymentDetails from "../AllApplications/components/PaymentDetails"
import CGPaymentDetails from "../AllApplications/components/CGPaymentDetails"
import CGBookingDetails from "../AllApplications/components/CGBookingDetails"
import DocumentPreview from "../AllApplications/components/DocumentPreview"
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import DownloadFileContainer from "../../modules/DownloadFileContainer";
import jp from "jsonpath";
// import {
// 	getQueryArg,
// 	setBusinessServiceDataToLocalStorage,
// 	getFileUrlFromAPI,
// 	setDocuments
// } from "egov-ui-framework/ui-utils/commons";
import {
	getDateFromEpoch,
	mapCompIDToName,
	isImage,
	fetchImages,
	returnSLAStatus,
	getPropertyFromObj,
	findLatestAssignee,
	getTranslatedLabel
} from "egov-ui-kit/utils/commons";
import {
	fetchApplications, fetchPayment, fetchperDayRate,fetchHistory, fetchDataAfterPayment,downloadPaymentReceiptforCG,downloadReceiptforCG,
	sendMessage,downloadLetterforCG,
	sendMessageMedia,downloadPermissionLetterforCG,downloadApplicationforCG
} from "egov-ui-kit/redux/bookings/actions";
import { connect } from "react-redux";

import "./index.css";

import { convertEpochToDate, getDurationDate,getFileUrlFromAPI} from '../../modules/commonFunction'
import ActionButtonDropdown from "../../modules/ActionButtonDropdown"
class CGApplicationDetails extends Component {
	constructor(props) {
		super(props);
		this.state = {
			openMap: false,
			docFileData: [],
			bookingType:'',
			rSector:'',
            rCategormy:''
		};
	};

	componentDidMount = async () => {
		let {
			fetchApplications,
			fetchHistory,
			fetchPayment,fetchperDayRate,
			fetchDataAfterPayment,downloadReceiptforCG,downloadPaymentReceiptforCG,downloadLetterforCG,downloadPermissionLetterforCG,downloadApplicationforCG,
			match,
			resetFiles,
			transformedComplaint,
			prepareFormData,
			userInfo,
			documentMap,
			prepareFinalObject
		} = this.props;

		prepareFormData("complaints", transformedComplaint);

		const { complaint } = transformedComplaint;

    await fetchApplications(
			{
				"applicationNumber": match.params.applicationId, 'uuid': userInfo.uuid,
				"applicationStatus": "",
				"mobileNumber": "", "bookingType": "",
				"tenantId":userInfo.tenantId
			}
		);
		fetchHistory([
			{ key: "businessIds", value: match.params.applicationId }, { key: "history", value: true }, { key: "tenantId", value: userInfo.tenantId }])
		
		fetchPayment(
			[{ key: "consumerCode", value: match.params.applicationId }, { key: "businessService", value: "GFCP" }, { key: "tenantId", value: userInfo.tenantId }
			])
		fetchDataAfterPayment(
			[{ key: "consumerCodes", value: match.params.applicationId }, { key: "tenantId", value: userInfo.tenantId }
			])
		
		let complaintCountRequest = 
			{
				"applicationNumber": match.params.applicationId, 'uuid': userInfo.uuid,
				"applicationStatus": "",
				"mobileNumber": "", "bookingType": "","tenantId" : userInfo.tenantId
			}
		  
		let dataforSectorAndCategory = await httpRequest( 	
			"bookings/api/employee/_search",
		    "_search",[],
		    complaintCountRequest
		  );
		
		let venueData = dataforSectorAndCategory && dataforSectorAndCategory.bookingsModelList ? dataforSectorAndCategory.bookingsModelList[0].bkBookingVenue : 'NA'
        let categoryData = dataforSectorAndCategory && dataforSectorAndCategory.bookingsModelList ? dataforSectorAndCategory.bookingsModelList[0].bkCategory : 'NA'
		

    fetchperDayRate({	
				bookingVenue:venueData ,
	          	category:categoryData
			});
	}
	
	

	componentWillReceiveProps = async (nextProps) =>  {
		const { transformedComplaint, prepareFormData } = this.props;
		if (!isEqual(transformedComplaint, nextProps.transformedComplaint)) {
			prepareFormData("complaints", nextProps.transformedComplaint);
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

	btnOneOnClick = (e,complaintNo, label) => {
	
		
		let { history } = this.props;
		if (e.target.value=="REJECTED") {
				history.push(`/reject-booking/${complaintNo}`);
		}else if(e.target.value=='APPROVED'){
			history.push(`/booking-resolved/${complaintNo}`);

		}		
	};
	btnTwoOnClick = (complaintNo, label) => {
		
		let { history } = this.props;
		switch (label) {
			case "ES_COMMON_ASSIGN":
				history.push(`/assign-complaint/${complaintNo}`);
				break;
			case "ES_COMMON_REASSIGN":
				history.push(`/reassign-complaint/${complaintNo}`);
				break;
			case "BK_MYBK_RESOLVE_MARK_RESOLVED":
				history.push(`/booking-resolved/${complaintNo}`);
				break;
		}
	};
	downloadPermissionLetterFunction = async (e) => {
		
		const { transformedComplaint,paymentDetails,downloadPermissionLetterforCG,userInfo } = this.props;
		
		const {complaint} = transformedComplaint;
		let receiptData = [
			{
				applicantDetail: {
					name: complaint.applicantName,
					mobileNumber: complaint.bkMobileNumber,
					houseNo: complaint.houseNo,
					permanentAddress: complaint.address,
					permanentCity: complaint.villageCity,
					sector: complaint.sector,
				},
				bookingDetail: {
					applicationNumber:
					complaint.applicationNo,
					applicationDate: convertEpochToDate(
						complaint.dateCreated,"dayend"
					),
					bookingPeriod: getDurationDate(
						complaint.bkFromDate,
						complaint.bkToDate
					),
					groundName:complaint.sector
				},
				generatedBy: {
					generatedBy: userInfo.name,
				},
			}]
	
			downloadPermissionLetterforCG({BookingInfo:receiptData})
	
	
	}


downloadPaymentReceiptFunction = async (e) => {
	const { transformedComplaint, paymentDetailsForReceipt, downloadPaymentReceiptforCG, userInfo, paymentDetails } = this.props;
	const { complaint } = transformedComplaint;
	let receiptData = [
		{
			applicantDetail: {
				name: complaint.applicantName,
				mobileNumber: complaint.bkMobileNumber,
				houseNo: complaint.houseNo,
				permanentAddress: complaint.address,
				permanentCity: complaint.villageCity,
				sector: complaint.sector,
				permanentCity: "ch"
			},
			bookingDetail: {
				applicationNumber:
				complaint.applicationNo,
				applicationDate: convertEpochToDate(
					complaint.dateCreated,"dayend"
				),
				bookingPeriod: getDurationDate(
					complaint.bkFromDate,
					complaint.bkToDate
				),
				groundName:complaint.sector
			},
			generatedBy: {
				generatedBy: userInfo.name,
			},
			approvedBy: {
				approvedBy: "Renil Commissioner",
				role: "Additional Commissioner"
			  },
			  tenantInfo: {
				municipalityName: "Municipal Corporation Chandigarh",
				address: "New Deluxe Building, Sector 17, Chandigarh",
				contactNumber: "+91-172-2541002, 0172-2541003",
				logoUrl: "https://chstage.blob.core.windows.net/fileshare/logo.png",
				webSite: "http://mcchandigarh.gov.in"
			  }
		}]
	downloadPaymentReceiptforCG({BookingInfo:receiptData})
}


downloadApplicationFunction = async (e) => {
const { transformedComplaint,paymentDetails,downloadApplicationforCG,paymentDetailsForReceipt,userInfo } = this.props;

const {complaint} = transformedComplaint;

let BookingInfo = [{
	"applicantDetail": {
		"name": complaint && complaint.applicantName ? complaint.applicantName : 'NA',
		"mobileNumber": complaint && complaint.bkMobileNumber ? complaint.bkMobileNumber : '',
		"houseNo": complaint && complaint.houseNo ? complaint.houseNo : '',
		"permanentAddress": complaint && complaint.address ? complaint.address : '',
		"permanentCity": complaint && complaint.villageCity ? complaint.villageCity : '',
		"sector": complaint && complaint.sector ? complaint.sector : '',
		"fatherName":complaint.bkFatherName,
		"DOB": null,
		"email":complaint.bkEmail,
	},
	"bookingDetail": {
		"applicationNumber":complaint.applicationNo,
		"venue": complaint.sector,
        "bookingCategory": complaint.bkCategory,
        "bookingPeriod": getDurationDate(
			complaint.bkFromDate,
			complaint.bkToDate
		),
        "bookingPurpose": complaint.bkBookingPurpose
	},
	"feeDetail": {
		"baseCharge": paymentDetailsForReceipt.Payments[0].paymentDetails[0].bill.billDetails[0].billAccountDetails.filter(
			(el) => !el.taxHeadCode.includes("TAX")
		)[0].amount,
		"taxes": paymentDetailsForReceipt.Payments[0].paymentDetails[0].bill.billDetails[0].billAccountDetails.filter(
			(el) => el.taxHeadCode.includes("TAX")
		)[0].amount,
		"totalAmount": paymentDetailsForReceipt.Payments[0].totalAmountPaid,
	},
	generatedBy: {
		generatedBy: userInfo.name,
	},
}
]
downloadApplicationforCG({BookingInfo:BookingInfo})
}


downloadApplicationButton = async (e) => {
	await this.downloadApplicationFunction();
	let documentsPreviewData;
	const { DownloadApplicationDetailsforCG,userInfo } = this.props;
	
	var documentsPreview = [];
	if (DownloadApplicationDetailsforCG && DownloadApplicationDetailsforCG.filestoreIds.length > 0) {

		 documentsPreviewData=DownloadApplicationDetailsforCG.filestoreIds[0];

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


downloadReceiptButton = async (e) => {
	
	await this.downloadReceiptFunction();

	
	let documentsPreviewData;
	const { DownloadReceiptDetailsforCG,userInfo } = this.props;
	
	var documentsPreview = [];
	if (DownloadReceiptDetailsforCG && DownloadReceiptDetailsforCG.filestoreIds.length > 0) {
		 documentsPreviewData=DownloadReceiptDetailsforCG.filestoreIds[0];
		

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

downloadReceiptFunction = async (e) => {
	const { transformedComplaint, paymentDetailsForReceipt, downloadPaymentReceiptforCG,downloadReceiptforCG, userInfo, paymentDetails } = this.props;
	const { complaint } = transformedComplaint;

	let BookingInfo = [{
		"applicantDetail": {
			"name": complaint && complaint.applicantName ? complaint.applicantName : 'NA',
			"mobileNumber": complaint && complaint.bkMobileNumber ? complaint.bkMobileNumber : '',
			"houseNo": complaint && complaint.houseNo ? complaint.houseNo : '',
			"permanentAddress": complaint && complaint.address ? complaint.address : '',
			"permanentCity": complaint && complaint.villageCity ? complaint.villageCity : '',
			"sector": complaint && complaint.sector ? complaint.sector : ''
		},
		"booking": {
			"bkApplicationNumber": complaint && complaint.applicationNo ? complaint.applicationNo : ''
		},
		"paymentInfo": {
			"paymentDate": paymentDetailsForReceipt && convertEpochToDate(paymentDetailsForReceipt.Payments[0].transactionDate, "dayend"),
			"transactionId": paymentDetailsForReceipt && paymentDetailsForReceipt.Payments[0].transactionNumber,
			"bookingPeriod": getDurationDate(
				complaint.bkFromDate,
				complaint.bkToDate
			),
			"bookingItem": "Online Payment Against Booking of Commercial Ground",
			"amount": paymentDetailsForReceipt.Payments[0].paymentDetails[0].bill.billDetails[0].billAccountDetails.filter(
				(el) => !el.taxHeadCode.includes("TAX")
			)[0].amount,
			"tax": paymentDetailsForReceipt.Payments[0].paymentDetails[0].bill.billDetails[0].billAccountDetails.filter(
				(el) => el.taxHeadCode.includes("TAX")
			)[0].amount,
			"grandTotal": paymentDetailsForReceipt.Payments[0].totalAmountPaid,
			"amountInWords": this.NumInWords(
				paymentDetailsForReceipt.Payments[0].totalAmountPaid
			),
			paymentItemExtraColumnLabel: "Booking Period",
			paymentMode:
				paymentDetailsForReceipt.Payments[0].paymentMode,
			receiptNo:
				paymentDetailsForReceipt.Payments[0].paymentDetails[0]
					.receiptNumber,
		},
		payerInfo: {
			payerName: paymentDetailsForReceipt.Payments[0].payerName,
			payerMobile:
				paymentDetailsForReceipt.Payments[0].mobileNumber,
		},
		generatedBy: {
			generatedBy: userInfo.name,
		},
	}
	]
	downloadReceiptforCG({BookingInfo: BookingInfo})
}

downloadPaymentReceiptButton = async (e) => {
	
	await this.downloadPaymentReceiptFunction();

	let documentsPreviewData;
	const { DownloadPaymentReceiptDetailsforCG,userInfo } = this.props;
	
	var documentsPreview = [];
	if (DownloadPaymentReceiptDetailsforCG && DownloadPaymentReceiptDetailsforCG.filestoreIds.length > 0) {
		 documentsPreviewData=DownloadPaymentReceiptDetailsforCG.filestoreIds[0];

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

callApiDorData = async (e) =>  {

const {documentMap,userInfo}=this.props;

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

	callApiForDocumentData = async (e) => {
		const { documentMap,userInfo } = this.props;
		var documentsPreview = [];
		console.log("document--",documentMap)
		if (documentMap && Object.keys(documentMap).length > 0) {
			let keys = Object.keys(documentMap);
			console.log("keys--",keys)
			console.log("Types--keys--",typeof(keys))
			let values = Object.values(documentMap);
			console.log("values--values",values)
			let id = keys[0]
			console.log("id--cg",id);
			let	fileName = values[0];
            console.log("fileName--",fileName)
			documentsPreview.push({
				title: "DOC_DOC_PICTURE",
				fileStoreId: id,
				linkText: "View",
			});
			let changetenantId = userInfo.tenantId ? userInfo.tenantId.split(".")[0] : "ch";
			let fileStoreIds = jp.query(documentsPreview, "$.*.fileStoreId");
			let fileUrls =
				fileStoreIds.length > 0 ? await getFileUrlFromAPI(fileStoreIds,changetenantId) : {};
		

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

	render() {
		const dropbordernone = {
			float: "right",
			paddingRight: "20px"
		
		};
		let { shareCallback } = this;
		let { comments, openMap } = this.state;
		let { complaint, timeLine } = this.props.transformedComplaint;
		let { documentMap } = this.props;
		let { historyApiData, paymentDetails, perDayRupees, match, userInfo } = this.props;
		let {
			role,
			serviceRequestId,
			history,
			isAssignedToEmployee,
			reopenValidChecker
		} = this.props;
		let btnOneLabel = "";
		let btnTwoLabel = "";
		let action;
		let complaintLoc = {};
		
		if (complaint) {
			if (role === "ao") {
				if (complaint.complaintStatus.toLowerCase() === "unassigned") {
					btnOneLabel = "ES_REJECT_BUTTON";
					btnTwoLabel = "ES_COMMON_ASSIGN";
				} else if (complaint.complaintStatus.toLowerCase() === "reassign") {
					btnOneLabel = "ES_REJECT_BUTTON";
					btnTwoLabel = "ES_COMMON_REASSIGN";
				} else if (complaint.complaintStatus.toLowerCase() === "assigned") {
					btnTwoLabel = "ES_COMMON_REASSIGN";
				}
				else if (complaint.complaintStatus.toLowerCase() === "escalated") {
					btnOneLabel = "ES_REJECT_BUTTON";
					btnTwoLabel = "ES_RESOLVE_MARK_RESOLVED";
				}
			} else if (role == "eo") {
				if (complaint.status.toLowerCase() === "escalatedlevel1pending" ||
					complaint.status.toLowerCase() === "escalatedlevel2pending") {
					btnOneLabel = "ES_REJECT_BUTTON";
					btnTwoLabel = "ES_RESOLVE_MARK_RESOLVED";
				}
				else if (complaint.status.toLowerCase() === "assigned") {
					btnOneLabel = "ES_REQUEST_REQUEST_RE_ASSIGN";
					btnTwoLabel = "ES_RESOLVE_MARK_RESOLVED";
				}
			}
			else if (role === "employee") {
				btnOneLabel = "BK_MYBK_REJECT_BUTTON";
				btnTwoLabel = "BK_MYBK_RESOLVE_MARK_RESOLVED";
				
			}
		}
		if (timeLine && timeLine[0]) {
			action = timeLine[0].action;
		}
		return (
			<div>
				<Screen>
				{complaint && !openMap && (
						<div>
							<div className="form-without-button-cont-generic">
								<div className="container" >
									<div className="row">
										<div className="col-12 col-md-6" style={{fontSize: 'x-large'}}>
											
Application Details
										</div>
										<div className="col-12 col-md-6 row">
										<div class="col-12 col-md-6 col-sm-3" >
										<ActionButtonDropdown data={{
									label: { labelName: "Download ", labelKey: "BK_COMMON_DOWNLOAD_ACTION" },
									rightIcon: "arrow_drop_down",
									leftIcon: "cloud_download",
									props: {
										variant: "outlined",
										style: { marginLeft: 5, marginRight: 15, color: "#FE7A51", height: "60px" }, className: "tl-download-button"
									},
									menu: [{


										label: {
											labelName: "PermissionLetter",
											labelKey: "BK_MYBK_DOWNLOAD_PERMISSION_LETTER"
										},
										leftIcon: "book",
										link: () => this.downloadPaymentReceiptButton('Receipt')
									},
									{
										label: {
											labelName: "Receipt",
											labelKey: "BK_MYBK_DOWNLOAD_RECEIPT"
										},
										leftIcon: "receipt",

										link: () => this.downloadReceiptButton('PermissionLetter')
									},
									{
										label: {
											labelName: "Application",
											labelKey: "BK_MYBK_DOWNLOAD_APPLICATION"
										},
										leftIcon:"assignment",
										 link: () => this.downloadApplicationButton('Application')
									}]
								}} />
								</div>
								<div class="col-12 col-md-6 col-sm-3" >
										<ActionButtonDropdown data={{
									label: { labelName: "Print", labelKey: "BK_COMMON_PRINT_ACTION" },
									rightIcon: "arrow_drop_down",
									leftIcon: "print",
									props: {
										variant: "outlined",
										style: { marginLeft: 5, marginRight: 15, color: "#FE7A51", height: "60px" }, className: "tl-download-button"
									},
									menu: [{


										label: {
											labelName: "PermissionLetter",
											labelKey: "BK_MYBK_DOWNLOAD_PERMISSION_LETTER"
										},
										leftIcon: "book",
										link: () => this.downloadPaymentReceiptButton('Receipt')
									},
									{
										label: {
											labelName: "Receipt",
											labelKey: "BK_MYBK_DOWNLOAD_RECEIPT"
										},
										leftIcon: "receipt",

										link: () => this.downloadReceiptButton('PermissionLetter')
									},
									{
										label: {
											labelName: "Application",
											labelKey: "BK_MYBK_DOWNLOAD_APPLICATION"
										},
										leftIcon:"assignment",
										 link: () => this.downloadApplicationButton('Application')
									}]
								}} />

</div>
										</div>
									</div>
								</div>


								<CGAppDetails
									{...complaint}
								/>

                              <CGBookingDetails
									{...complaint}
								/>
                                 
							

<CGPaymentDetails
	paymentDetails={paymentDetails && paymentDetails}
	perDayRupees={perDayRupees && perDayRupees}

/>

                             <div style={{
									height: "100px",
									width: "100",
									backgroundColor: "white",
									border: "2px solid white",
									boxShadow: "0 0 2px 2px #e7dcdc", paddingLeft: "30px", paddingTop: "10px"
								}}><b>Documents</b><br></br>

									{documentMap && Object.values(documentMap) ? Object.values(documentMap) : "Not found"}
									<button className="ViewDetailButton" data-doc={documentMap} onClick={(e) => { this.callApiForDocumentData(e) }}>VIEW</button>
								</div>
							</div>
						</div>
					)}
				</Screen>
			</div>
		);
	}
}

const roleFromUserInfo = (roles = [], role) => {
	const roleCodes = roles.map((role, index) => {
		return role.code;
	});
	return roleCodes && roleCodes.length && roleCodes.indexOf(role) > -1
		? true
		: false;
};


let gro = "";
const mapStateToProps = (state, ownProps) => {
	const { bookings, common, auth, form } = state;
	const { applicationData } = bookings;
	const {DownloadPaymentReceiptDetailsforCG}=bookings;
	const {DownloadPermissionLetterDetailsforCG}=bookings;
	const {DownloadApplicationDetailsforCG,DownloadReceiptDetailsforCG}=bookings;
	const { id } = auth.userInfo;
	const { citizenById } = common || {};
	const { employeeById, departmentById, designationsById, cities } =
		common || {};
	// const { categoriesById } = complaints;
	const { userInfo } = state.auth;
	const serviceRequestId = ownProps.match.params.applicationId;
	let selectedComplaint = applicationData ? applicationData.bookingsModelList[0] : ''
	let businessService = applicationData ? applicationData.businessService : "";
	let bookingDocs;
	const { documentMap } = applicationData;
	const { HistoryData } = bookings;
	let temp;
	let historyObject = HistoryData ? HistoryData : ''
	const { paymentData } = bookings;
	const { fetchPaymentAfterPayment } = bookings;
	const { perDayRate } = bookings;
	let paymentDetailsForReceipt = fetchPaymentAfterPayment;
	let paymentDetails;
	let perDayRupees;
	if (selectedComplaint && selectedComplaint.bkApplicationStatus == "APPLIED") {
		paymentDetails = fetchPaymentAfterPayment && fetchPaymentAfterPayment.Payments[0] && fetchPaymentAfterPayment.Payments[0].paymentDetails[0].bill ;
		perDayRupees = perDayRate && perDayRate ? perDayRate.data.ratePerDay : '';
	} 
	else {
		paymentDetails = paymentData ? paymentData.Bill[0] : '';
		perDayRupees = perDayRate && perDayRate ? perDayRate.data.ratePerDay : '';
	} 

	
	let historyApiData = {}
	if (historyObject) {
		historyApiData = historyObject;
	}
	
	const role =
		roleFromUserInfo(userInfo.roles, "GRO") ||
			roleFromUserInfo(userInfo.roles, "DGRO")
			? "ao"
			: roleFromUserInfo(userInfo.roles, "ESCALATION_OFFICER1") ||
				roleFromUserInfo(userInfo.roles, "ESCALATION_OFFICER2")
				? "eo"
				: roleFromUserInfo(userInfo.roles, "CSR")
					? "csr"
					: "employee";

	let isAssignedToEmployee = true;
	if (selectedComplaint && businessService) {

		let details = {
			applicantName: selectedComplaint.bkApplicantName,
			status: selectedComplaint.bkApplicationStatus,
			applicationNo: selectedComplaint.bkApplicationNumber,
			address: selectedComplaint.bkCompleteAddress,
			bookingType: selectedComplaint.bkBookingType,
			sector: selectedComplaint.bkSector,
			bkEmail: selectedComplaint.bkEmail,
			bkMobileNumber: selectedComplaint.bkMobileNumber,
			houseNo: selectedComplaint.bkHouseNo,
			dateCreated: selectedComplaint.bkDateCreated,
			areaRequired: selectedComplaint.bkAreaRequired,
			bkDuration: selectedComplaint.bkDuration,
			bkCategory: selectedComplaint.bkCategory,
			constructionType: selectedComplaint.bkConstructionType,
			villageCity: selectedComplaint.bkVillCity,
			residentialCommercial: selectedComplaint.bkType,
			businessService: businessService,
			bkConstructionType: selectedComplaint.bkConstructionType,
			bkFatherName: selectedComplaint.bkFatherName,
		    bkBookingPurpose: selectedComplaint.bkBookingPurpose,
		    bkFromDate: selectedComplaint.bkFromDate,
		    bkToDate: selectedComplaint.bkToDate
		}



		let transformedComplaint;
		if (applicationData != null && applicationData != undefined) {

			transformedComplaint = {
				complaint: details,
			};
		}

		const { localizationLabels } = state.app;
		const complaintTypeLocalised = getTranslatedLabel(
			`SERVICEDEFS.${transformedComplaint.complaint.complaint}`.toUpperCase(),
			localizationLabels
		);
		
		return {
			paymentDetails,
			historyApiData,
			DownloadPaymentReceiptDetailsforCG,
			DownloadReceiptDetailsforCG,
			DownloadPermissionLetterDetailsforCG,
			DownloadApplicationDetailsforCG,
			paymentDetailsForReceipt,
			perDayRupees,
			userInfo,
			documentMap,
			form,
			transformedComplaint,
			role,
			serviceRequestId,
			isAssignedToEmployee,
			complaintTypeLocalised,
		
		};
	} else {
		return {
			paymentDetails,
			historyApiData,
			DownloadPaymentReceiptDetailsforCG,
			DownloadReceiptDetailsforCG,
			DownloadPermissionLetterDetailsforCG,
			DownloadApplicationDetailsforCG,
			paymentDetailsForReceipt,
			perDayRupees,
			userInfo,
			documentMap,
			form,
			transformedComplaint: {},
			role,
			serviceRequestId,
			isAssignedToEmployee,
		
		};
	}
};

const mapDispatchToProps = dispatch => {
	return {
		fetchApplications: criteria => dispatch(fetchApplications(criteria)),
		fetchPayment: criteria => dispatch(fetchPayment(criteria)), 
		fetchperDayRate: criteria => dispatch(fetchperDayRate(criteria)),
		fetchDataAfterPayment: criteria => dispatch(fetchDataAfterPayment(criteria)),

		downloadPaymentReceiptforCG: criteria => dispatch(downloadPaymentReceiptforCG(criteria)),
		downloadReceiptforCG: criteria => dispatch(downloadReceiptforCG(criteria)),
		downloadLetterforCG: criteria => dispatch(downloadLetterforCG(criteria)),
		downloadPermissionLetterforCG: criteria => dispatch(downloadPermissionLetterforCG(criteria)),
		downloadApplicationforCG: criteria => dispatch(downloadApplicationforCG(criteria)),
		fetchHistory: criteria => dispatch(fetchHistory(criteria)),
		resetFiles: formKey => dispatch(resetFiles(formKey)),
		sendMessage: message => dispatch(sendMessage(message)),
		sendMessageMedia: message => dispatch(sendMessageMedia(message)),
		prepareFormData: (jsonPath, value) =>
		dispatch(prepareFormData(jsonPath, value)),
		prepareFinalObject: (jsonPath, value) =>
			dispatch(prepareFinalObject(jsonPath, value))
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(CGApplicationDetails);
