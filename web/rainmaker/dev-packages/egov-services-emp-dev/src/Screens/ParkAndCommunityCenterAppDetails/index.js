import React, { Component } from "react";
import { Details } from "modules/common";
import { ComplaintTimeLine } from "modules/common";
import { Comments } from "modules/common";
import { Screen } from "modules/common";
import { resetFiles } from "egov-ui-kit/redux/form/actions";
import get from "lodash/get";
import isEqual from "lodash/isEqual";
import { prepareFormData } from "egov-ui-kit/redux/common/actions";
import { getTenantId } from "egov-ui-kit/utils/localStorageUtils";
import OSMCCBookingDetails from "../AllApplications/components/OSMCCBookingDetails"
import AppDetails from "./components/ApplicantDetails";
import BookingDetails from "./components/BookingDetails"
import DocumentPreview from "../AllApplications/components/DocumentPreview"
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import PaymentDetails from "./components/PaymentDetails"
import ApproveCancellation from "../CancelledAppApproved";
import RejectCancellation from "../CancelledAppReject";
import Label from "egov-ui-kit/utils/translationNode";
import jp from "jsonpath";
import {
	downloadEsamparkApp,downloadEsamparkPL
} from "egov-ui-kit/redux/bookings/actions";
import {getFileUrlFromAPI} from '../../modules/commonFunction'
import { httpRequest } from "egov-ui-kit/utils/api";
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
	fetchApplications,fetchPayment, fetchHistory, fetchDataAfterPayment, downloadReceiptForPCC, downloadAppForPCC,
	sendMessage, downloadPLForPCC,
	sendMessageMedia
} from "egov-ui-kit/redux/bookings/actions";
import { connect } from "react-redux";
import DialogContainer from '../../modules/DialogContainer';
import Footer from "../../modules/footer"
import ActionButtonDropdown from '../../modules/ActionButtonDropdown'
import { convertEpochToDate, getDurationDate } from '../../modules/commonFunction'
import "./index.css";



class ApplicationDetails extends Component {
	constructor(props) {
		super(props);
		this.state = {
			openMap: false,
			docFileData: [],
			bookingType: '',
			open: false,
			setOpen: false,
			togglepopup: false,
			actionOnApplication: '',
			actionTittle: '',
			actionOpen: false
		};
	};

	handleActionButtonClose = () => {
		this.setState({
			actionOpen: false
		})
	};

	handleActionButtonOpen = () => {
		this.setState({
			actionOpen: true
		})
	};


	componentDidMount = async () => {
		let {
			fetchApplications,
			fetchHistory,
			fetchPayment,
			fetchDataAfterPayment, downloadReceiptForPCC,
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
		fetchApplications(
			{
				"applicationNumber": match.params.applicationId, 'uuid': userInfo.uuid,
				"applicationStatus": "",
				"mobileNumber": "", "bookingType": "",
				"tenantId": userInfo.tenantId
			}
		);
		fetchHistory([
			{ key: "businessIds", value: match.params.applicationId }, { key: "history", value: true }, { key: "tenantId", value: userInfo.tenantId }])

		fetchPayment(
			[{ key: "consumerCode", value: match.params.applicationId }, { key: "businessService", value: "PACC" }, { key: "tenantId", value: userInfo.tenantId }
			])
		fetchDataAfterPayment(
			[{ key: "consumerCodes", value: match.params.applicationId }, { key: "tenantId", value: userInfo.tenantId }
			])

		// fetchResponseForRefdunf(
		// 		[{ key: "consumerCodes", value: match.params.applicationId }, { key: "tenantId", value: userInfo.tenantId }
		// 		])
		



		let { details } = this.state;
	}

	componentWillReceiveProps = async (nextProps) => {
		const { transformedComplaint, prepareFormData } = this.props;
		if (!isEqual(transformedComplaint, nextProps.transformedComplaint)) {
			prepareFormData("complaints", nextProps.transformedComplaint);
		}
	}

	//actionButtonOnClick = (e, complaintNo, label)
	actionButtonOnClick = async (e, complaintNo, label) => {

		let {
			match,
			userInfo,
			selectedComplaint
		} = this.props;
		if (label == 'APPROVED') {
			this.setState({
				actionTittle: "Approve Application"
			})
			if(selectedComplaint.bkApplicationStatus == "PENDING_FOR_DISBURSEMENT"){
				let RequestData = [
					{ key: "consumerCode", value: match.params.applicationId },
					{ key: "tenantId", value: userInfo.tenantId }
				  ];
				let payloadfund = await httpRequest(
					"pg-service/transaction/v1/_search",
					"_search",
					RequestData
				  );
				
	console.log("RequestData--",RequestData)
	console.log("payloadfund--",payloadfund)
	console.log("payloadfund.Transaction--",payloadfund.Transaction)
			}
			

		} else {
			this.setState({
				actionTittle: "Reject Application"
			})
		}
		this.setState({
			togglepopup: !this.state.togglepopup,
			actionOnApplication: label
		})
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

	handleClickOpen = () => {
		this.setState({
			open: true
		})

	};
	handleClose = () => {
		this.setState({
			openPopup: false
		})
	};

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

	downloadPaymentReceiptFunction = async (e) => {
		const { transformedComplaint, paymentDetailsForReceipt, downloadReceiptForPCC, userInfo } = this.props;
		const { complaint } = transformedComplaint;


		let BookingInfo = [{
			"applicantDetail": {
				"name": "Sumit Kumar",
				"mobileNumber": "9138912806",
				"houseNo": "555",
				"permanentAddress": "klklkk",
				"permanentCity": "ch.chandigarh",
				"sector": "7"
			},
			"booking": {
				"bkApplicationNumber": "CH-BK-2020-07-25-000183"
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

	downloadApplicationFunction = async (e) => {
		const { downloadEsamparkApp, userInfo,createPACCApplicationData,selectedComplaint,documentMap} = this.props;
		let fdocname = Object.entries(documentMap)[0][1]
	   let BookingInfo = [
		  {
			  "applicantDetail": {
				  "name": selectedComplaint.bkApplicantName,
				  "mobileNumber":selectedComplaint.bkMobileNumber,
				  "email": selectedComplaint.bkEmail,
				  "permanentAddress": "",
				  "permanentCity": "Chandigarh",
				  "sector": selectedComplaint.bkSector,
				  "fatherName": " "
			  },
			  "bookingDetail": {
				  "applicationNumber": selectedComplaint.bkApplicationNumber,
				  "applicationDate": "",
				  "bookingPeriod": getDurationDate(
					selectedComplaint.bkFromDate,
					selectedComplaint.bkToDate
				  ),
				  "venueName": selectedComplaint.bkLocation,
				  "sector": selectedComplaint.bkSector,
				  "bookingPurpose": selectedComplaint.bkBookingPurpose,
				  "parkDim": selectedComplaint.bkDimension
			  },
			  "feeDetail": {
				  "baseCharge": selectedComplaint.bkRent,
				  "cleaningCharge": selectedComplaint.bkCleansingCharges,
				  "surcharges": selectedComplaint.bkSurchargeRent,
				  "facilitationCharge": "100",
				  "utgst": selectedComplaint.bkUtgst,
				  "cgst": selectedComplaint.bkCgst,
				  "gst": selectedComplaint.bkCgst,
				  "totalAmount": selectedComplaint.bkRent
			  },
			  "generatedBy":{
				"generatedBy": userInfo.name,
				"generatedDateTime": userInfo.createdDate
			},
			"documentDetail":{
				"documentName": fdocname
			}
		  }
	  ]
	
	  downloadEsamparkApp({ BookingInfo: BookingInfo })
	  };

	downloadApplicationButton = async (e) => {
		await this.downloadApplicationFunction();
		const { DownloadApplicationDetails,userInfo,Downloadesamparkdetails } = this.props;
		var documentsPreview = [];
		let documentsPreviewData;
		if (Downloadesamparkdetails && Downloadesamparkdetails.filestoreIds.length > 0) {	
			documentsPreviewData = Downloadesamparkdetails.filestoreIds[0];
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

	downloadPermissionLetterButton = async (e) => {
		await this.downloadPermissionLetterFunction();
		let documentsPreviewData;
		const { DownloadPermissionLetterDetails,userInfo,Downloadesamparkdetailspl
		} = this.props;
		var documentsPreview = [];
		if (Downloadesamparkdetailspl
			&& Downloadesamparkdetailspl
			.filestoreIds.length > 0) {
			 documentsPreviewData=Downloadesamparkdetailspl
			 .filestoreIds[0];
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

	downloadPermissionLetterFunction = async (e) => {
		const { transformedComplaint,paymentDetails,downloadPLForPCC ,userInfo,createPACCApplicationData,downloadEsamparkPL,Downloadesamparkdetailspl
			,selectedComplaint	} = this.props;
		let applicationDetails = createPACCApplicationData ? createPACCApplicationData.data : '';
		const {complaint} = transformedComplaint;
		let receiptData = [
			{
				"applicantDetail": {
					"name": selectedComplaint.bkApplicantName,
					"mobileNumber": selectedComplaint.bkMobileNumber,
					"email":selectedComplaint.bkEmail,
					"permanentAddress": " ",
					"permanentCity": "Chandigarh",
					"sector": selectedComplaint.bkSector,
					"fatherName": ""
				},
				
				"bookingDetail": {
					"applicationNumber": selectedComplaint.bkApplicationNumber,
					"applicationDate": "",
					"bookingPeriod": getDurationDate(
						selectedComplaint.bkFromDate,
						selectedComplaint.bkToDate
					),
					"venueName": selectedComplaint.bkLocation,
					"sector": selectedComplaint.bkSector,
					"bookingPurpose": selectedComplaint.bkBookingPurpose,
					"parkDim": selectedComplaint.bkDimension
				},
				"generatedBy":{
					"generatedBy": userInfo.name,
				},
				"approvedBy": {
					"approvedBy": "Renil Commissioner",
					"role": "Additional Commissioner"
				},
				"tenantInfo": {
					"municipalityName": "Municipal Corporation Chandigarh",
					"address": "New Deluxe Building, Sector 17, Chandigarh",
					"contactNumber": "+91-172-2541002, 0172-2541003",
					"logoUrl": "https://chstage.blob.core.windows.net/fileshare/logo.png",
					"webSite": "http://mcchandigarh.gov.in"
				}
			}]
	
			downloadEsamparkPL({BookingInfo:receiptData})
	}

	downloadPaymentReceiptButton = async (e) => {
		this.downloadPaymentReceiptFunction();
		let documentsPreviewData;
		const { DownloadPaymentReceiptDetails } = this.props;
		var documentsPreview = [];
		if (DownloadPaymentReceiptDetails && DownloadPaymentReceiptDetails.filestoreIds.length > 0) {
			documentsPreviewData = DownloadPaymentReceiptDetails.filestoreIds[0];
			documentsPreview.push({
				title: "DOC_DOC_PICTURE",
				fileStoreId: documentsPreviewData,
				linkText: "View",
			});
			let fileStoreIds = jp.query(documentsPreview, "$.*.fileStoreId");
			let fileUrls =
				fileStoreIds.length > 0 ? await getFileUrlFromAPI(fileStoreIds) : {};


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
		let { historyApiData, paymentDetails, match, userInfo,paymentDetailsForReceipt,PayMentTwo,PayMentOne } = this.props;
		console.log("this.props.match--",match)
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

			}
			else if (role === "employee") {
				btnOneLabel = "BK_MYBK_REJECT_BUTTON";
				btnTwoLabel = "BK_MYBK_RESOLVE_MARK_RESOLVED";

			}
		}
		if (timeLine && timeLine[0]) {
			action = timeLine[0].action;
		}
		const foundFirstLavel = userInfo && userInfo.roles.some(el => el.code === 'BK_CLERK' || el.code === 'BK_DEO');
		const foundSecondLavel = userInfo && userInfo.roles.some(el => el.code === 'BK_SENIOR_ASSISTANT');
		const foundThirdLavel = userInfo && userInfo.roles.some(el => el.code === 'BK_AUDIT_DEPARTMENT');
		const foundFourthLavel = userInfo && userInfo.roles.some(el => el.code === 'BK_CHIEF_ACCOUNT_OFFICER');
		const foundFifthLavel = userInfo && userInfo.roles.some(el => el.code === 'BK_PAYMENT_PROCESSING_AUTHORITY');
		const foundSixthLavel = userInfo && userInfo.roles.some(el => el.code === 'BK_E-SAMPARK-CENTER');

		return (
			<div>
				<Screen>
					{complaint && !openMap && (
						<div>
							{console.log("matchOne--",match)}
							{console.log("matchparms--",this.props.match)}
							<div className="form-without-button-cont-generic">
								<div className="container" >
									<div className="row">
										<div className="col-12 col-md-6" style={{ fontSize: '26px' }}>
											{/* <Label style={{ fontSize: '26px',marginTop: '10px' }} label="BK_MYBK_APPLICATION_DETAILS" /> */}
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
													menu: (complaint.status == 'APPROVED') ? [{
														label: {
															labelName: "Receipt",
															labelKey: "BK_MYBK_DOWNLOAD_RECEIPT"
														},

														link: () => this.downloadPaymentReceiptButton('Receipt'),
														leftIcon: "receipt"
													},
													{
														label: {
															labelName: "PermissionLetter",
															labelKey: "BK_MYBK_DOWNLOAD_PERMISSION_LETTER"
														},
														link: () => this.downloadPermissionLetterButton('PermissionLetter'),
														leftIcon: "book"
													}, {
														label: {
															labelName: "Application",
															labelKey: "BK_MYBK_PRINT_APPLICATION"
														},
														link: () => this.downloadApplicationButton('state', "dispatch", 'REJECT'),
														leftIcon: "assignment"
													}] :
														[{
															label: {
																labelName: "Application",
																labelKey: "BK_MYBK_DOWNLOAD_APPLICATION"
															},
															link: () => this.downloadApplicationButton('Application'),
															leftIcon: "assignment"
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
													menu: (complaint.status == 'APPROVED') ? [{
														label: {
															labelName: "Receipt",
															labelKey: "BK_MYBK_PRINT_RECEIPT"
														},

														link: () => this.downloadPaymentReceiptButton('Receipt'),
														leftIcon: "receipt"
													},
													{
														label: {
															labelName: "PermissionLetter",
															labelKey: "BK_MYBK_DOWNLOAD_PERMISSION_LETTER"
														},
														link: () => this.downloadPermissionLetterButton('state', "dispatch", 'REJECT'),
														leftIcon: "book"
													}, {
														label: {
															labelName: "Application",
															labelKey: "BK_MYBK_PRINT_APPLICATION"
														},
														link: () => this.downloadApplicationButton('state', "dispatch", 'REJECT'),
														leftIcon: "assignment"
													}] : [{
														label: {
															labelName: "Application",
															labelKey: "BK_MYBK_PRINT_APPLICATION"
														},
														link: () => this.downloadApplicationButton('state', "dispatch", 'REJECT'),
														leftIcon: "assignment"
													}]
												}} />

											</div>
										</div>
									</div>
								</div>

								<OSMCCBookingDetails
									{...complaint}
									historyApiData={historyApiData && historyApiData}
								/>

								<AppDetails
									{...complaint}

								/>

								<BookingDetails
									{...complaint}
									historyApiData={historyApiData && historyApiData}
								/>
								<PaymentDetails
									paymentDetails={paymentDetails && paymentDetails}
									PayMentTwo={PayMentTwo && PayMentTwo}
									PayMentOne={PayMentOne && PayMentOne}

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

								<Comments
									comments={comments}
									role={role}
									isAssignedToEmployee={isAssignedToEmployee}
								/>
							</div>
							<div style={{
								paddingTop: "30px",
								paddingRight: "30px", float: "right",
							}}>
								{(role === "ao" &&
									complaint.complaintStatus.toLowerCase() !== "closed") ||
									(role === "eo" &&
										(complaint.status.toLowerCase() === "escalatedlevel1pending" ||
											complaint.status.toLowerCase() === "escalatedlevel2pending" ||
											complaint.status.toLowerCase() === "assigned")) ||
									(role === "employee" &&
										(
											(complaint.status == "PENDING_FOR_APPROVAL_CLEARK_DEO" && foundFirstLavel &&
												<Footer className="apply-wizard-footer" style={{ display: 'flex', justifyContent: 'flex-end' }} children={<ActionButtonDropdown data={{
													label: { labelName: "TAKE ACTION ", labelKey: "BK_COMMON_TAKE_ACTION" },
													rightIcon: "arrow_drop_down",
													props: {
														variant: "outlined",
														style: { marginLeft: 5, marginRight: 15, backgroundColor: "#FE7A51", color: "#fff", border: "none", height: "60px", width: "250px" }
													},
													menu: [{
														label: {
															labelName: "Approve",
															labelKey: "BK_MYBK_APPROVE_ACTION_BUTTON"
														},

														link: () => this.actionButtonOnClick('state', "dispatch", 'APPROVED')
													},
													{
														label: {
															labelName: "Reject",
															labelKey: "BK_MYBK_REJECT_ACTION_BUTTON"
														},
														link: () => this.actionButtonOnClick('state', "dispatch", 'REJECT')
													}]
												}} />}></Footer>
											)

										)
									)}
								{(role === "employee" &&

									(complaint.status == "PENDING_FOR_APPROVAL_SENIOR_ASSISTANT" && foundSecondLavel &&

										<Footer className="apply-wizard-footer" style={{ display: 'flex', justifyContent: 'flex-end' }} children={<ActionButtonDropdown data={{
											label: { labelName: "TAKE ACTION ", labelKey: "BK_COMMON_TAKE_ACTION" },
											rightIcon: "arrow_drop_down",
											props: {
												variant: "outlined",
												style: { marginLeft: 5, marginRight: 15, backgroundColor: "#FE7A51", color: "#fff", border: "none", height: "60px", width: "250px" }
											},
											menu: [{
												label: {
													labelName: "Approve",
													labelKey: "BK_MYBK_APPROVE_ACTION_BUTTON"
												},

												link: () => this.actionButtonOnClick('state', "dispatch", 'APPROVED')
											},
											{
												label: {
													labelName: "Reject",
													labelKey: "BK_MYBK_REJECT_ACTION_BUTTON"
												},
												link: () => this.actionButtonOnClick('state', "dispatch", 'REJECT')
											}]
										}} />}></Footer>

									)
								)}
								{(role === "employee" &&

									(complaint.status == "PENDING_FOR_APPROVAL_AUDIT_DEPARTMENT" && foundThirdLavel &&

										<Footer className="apply-wizard-footer" style={{ display: 'flex', justifyContent: 'flex-end' }} children={<ActionButtonDropdown data={{
											label: { labelName: "TAKE ACTION ", labelKey: "BK_COMMON_TAKE_ACTION" },
											rightIcon: "arrow_drop_down",
											props: {
												variant: "outlined",
												style: { marginLeft: 5, marginRight: 15, backgroundColor: "#FE7A51", color: "#fff", border: "none", height: "60px", width: "250px" }
											},
											menu: [{
												label: {
													labelName: "Approve",
													labelKey: "BK_MYBK_APPROVE_ACTION_BUTTON"
												},

												link: () => this.actionButtonOnClick('state', "dispatch", 'APPROVED')
											},
											{
												label: {
													labelName: "Reject",
													labelKey: "BK_MYBK_REJECT_ACTION_BUTTON"
												},
												link: () => this.actionButtonOnClick('state', "dispatch", 'REJECT')
											}]
										}} />}></Footer>

									)
								)}
								{(role === "employee" &&

									(complaint.status == "PENDING_FOR_APPROVAL_CAO" && foundFourthLavel &&

										<Footer className="apply-wizard-footer" style={{ display: 'flex', justifyContent: 'flex-end' }} children={<ActionButtonDropdown data={{
											label: { labelName: "TAKE ACTION ", labelKey: "BK_COMMON_TAKE_ACTION" },
											rightIcon: "arrow_drop_down",
											props: {
												variant: "outlined",
												style: { marginLeft: 5, marginRight: 15, backgroundColor: "#FE7A51", color: "#fff", border: "none", height: "60px", width: "250px" }
											},
											menu: [{
												label: {
													labelName: "Approve",
													labelKey: "BK_MYBK_APPROVE_ACTION_BUTTON"
												},

												link: () => this.actionButtonOnClick('state', "dispatch", 'APPROVED')
											},
											{
												label: {
													labelName: "Reject",
													labelKey: "BK_MYBK_REJECT_ACTION_BUTTON"
												},
												link: () => this.actionButtonOnClick('state', "dispatch", 'REJECT')
											}]
										}} />}></Footer>

									)
								)}
{/*sixStep*/}
{(role === "employee" &&

									(complaint.status == "OFFLINE_APPLIED" && foundSixthLavel &&

										<Footer className="apply-wizard-footer" style={{ display: 'flex', justifyContent: 'flex-end' }} children={<ActionButtonDropdown data={{
											label: { labelName: "TAKE ACTION ", labelKey: "BK_COMMON_TAKE_ACTION" },
											rightIcon: "arrow_drop_down",
											props: {
												variant: "outlined",
												style: { marginLeft: 5, marginRight: 15, backgroundColor: "#FE7A51", color: "#fff", border: "none", height: "60px", width: "250px" }
											},
											menu: [{
												label: {
													labelName: "Approve",
													labelKey: "BK_MYBK_APPROVE_ACTION_BUTTON"
												},

												link: () => this.actionButtonOnClick('state', "dispatch", 'APPROVED')
											},
											// {
											// 	label: {
											// 		labelName: "Reject",
											// 		labelKey: "BK_MYBK_REJECT_ACTION_BUTTON"
											// 	},
											// 	link: () => this.actionButtonOnClick('state', "dispatch", 'REJECT')
											// }
										]
										}} />}></Footer>

									)
								)}
{/*sixStep*/}

								{(role === "employee" &&

									(complaint.status == "PENDING_FOR_DISBURSEMENT" && foundFifthLavel &&

										<Footer className="apply-wizard-footer" style={{ display: 'flex', justifyContent: 'flex-end' }} children={<ActionButtonDropdown data={{
											label: { labelName: "TAKE ACTION ", labelKey: "BK_COMMON_TAKE_ACTION" },
											rightIcon: "arrow_drop_down",
											props: {
												variant: "outlined",
												style: { marginLeft: 5, marginRight: 15, backgroundColor: "#FE7A51", color: "#fff", border: "none", height: "60px", width: "250px" }
											},
											menu: [{
												label: {
													labelName: "PAY",
													labelKey: "PAY"
												},

												link: () => this.actionButtonOnClick('state', "dispatch", 'APPROVED')
											},
											{
												label: {
													labelName: "Reject",
													labelKey: "BK_MYBK_REJECT_ACTION_BUTTON"
												},
												link: () => this.actionButtonOnClick('state', "dispatch", 'REJECT')
											}]
										}} />}></Footer>

									)
								)}
{console.log("match.params.applicationId--",match.params.applicationId)}
								<DialogContainer
									toggle={this.state.togglepopup}
									actionTittle={this.state.actionTittle}
									togglepopup={this.actionButtonOnClick}
									maxWidth={'md'}
									children={this.state.actionOnApplication == 'APPROVED' ? <ApproveCancellation
										applicationNumber={match.params.applicationId}
										matchparams={match.params}
										match={this.props.match}
										selectedComplaint={this.props.selectedComplaint}
										userInfo={userInfo}
										payload={paymentDetailsForReceipt}
										payloadTwo={this.props.paymentDetailsForReceipt}
									/> : <RejectCancellation
											applicationNumber={match.params.applicationId}
											userInfo={userInfo}
										/>}
								/>

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

const mapCitizenIdToMobileNumber = (citizenObjById, id) => {
	return citizenObjById && citizenObjById[id]
		? citizenObjById[id].mobileNumber
		: "";
};
let gro = "";

const mapStateToProps = (state, ownProps) => {
	const { bookings, common, auth, form } = state;
	const { applicationData, createPACCApplicationData,Downloadesamparkdetails,Downloadesamparkdetailspl} = bookings;
	const { DownloadPaymentReceiptDetails, DownloadApplicationDetails, DownloadPermissionLetterDetails } = bookings;
	const { id } = auth.userInfo;
	const { employeeById, departmentById, designationsById, cities } =
		common || {};

	const { userInfo } = state.auth;
	const serviceRequestId = ownProps.match.params.applicationId;
	let selectedComplaint = applicationData ? applicationData.bookingsModelList[0] : ''
	let businessService = applicationData ? applicationData.businessService : "";
	let bookingDocs;
	
	let documentMap = applicationData && applicationData.documentMap ? applicationData.documentMap : '';
	const { HistoryData } = bookings;
	let historyObject = HistoryData ? HistoryData : ''
	const { paymentData } = bookings;
	console.log("paymentData--",paymentData ? paymentData : "NopaymentData")


	const { fetchPaymentAfterPayment } = bookings;
	console.log("fetchPaymentAfterPayment--",fetchPaymentAfterPayment ? fetchPaymentAfterPayment : "NofetchPaymentAfterPaymentData")

	let paymentDetailsForReceipt = fetchPaymentAfterPayment;
	let paymentDetails;

	let PayMentOne = fetchPaymentAfterPayment && fetchPaymentAfterPayment.Payments[0] && fetchPaymentAfterPayment.Payments[0].paymentDetails[0].bill;
	let xyz = PayMentOne && PayMentOne ? PayMentOne : "xyz";
	console.log("xyz--",xyz)
	console.log("PayMentOne--",PayMentOne)
	let PayMentTwo = paymentData ? paymentData.Bill[0] : '';
	console.log("PayMentTwo--",PayMentTwo)
	let abc = PayMentTwo && PayMentTwo ? PayMentTwo : "abc"
	console.log("abc--",abc)
	// if (selectedComplaint && selectedComplaint.bkPaymentStatus == "SUCCESS") {

	// 	paymentDetails = fetchPaymentAfterPayment && fetchPaymentAfterPayment.Payments[0] && fetchPaymentAfterPayment.Payments[0].paymentDetails[0].bill;
		
	// }
	
	// if (selectedComplaint && selectedComplaint.bkPaymentStatus == "SUCCESS") {

	// 	paymentDetails = fetchPaymentAfterPayment && fetchPaymentAfterPayment.Payments[0] && fetchPaymentAfterPayment.Payments[0].paymentDetails[0].bill;
		
	// }

	// else {
	// 	paymentDetails = paymentData ? paymentData.Bill[0] : '';
		
	// }

	paymentDetails = fetchPaymentAfterPayment && fetchPaymentAfterPayment.Payments[0] && fetchPaymentAfterPayment.Payments[0].paymentDetails[0].bill;

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
			businessService: selectedComplaint.businessService,
			bkConstructionType: selectedComplaint.bkConstructionType,
			bkFromDate: selectedComplaint.bkFromDate,
			bkToDate: selectedComplaint.bkToDate,
			bkBookingPurpose: selectedComplaint.bkBookingPurpose,
			bkDimension: selectedComplaint.bkDimension,
			bkLocation: selectedComplaint.bkLocation,

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
			DownloadPaymentReceiptDetails,
			paymentDetailsForReceipt, DownloadApplicationDetails, DownloadPermissionLetterDetails,
			documentMap,
			form,
			transformedComplaint,
			role,
			serviceRequestId,
			isAssignedToEmployee,
			complaintTypeLocalised,
			Downloadesamparkdetailspl,
			Downloadesamparkdetails,
			selectedComplaint,
			userInfo,
			PayMentOne,
			PayMentTwo
		};
	} else {
		return {
			paymentDetails,
			historyApiData,
			DownloadPaymentReceiptDetails,
			paymentDetailsForReceipt, DownloadApplicationDetails, DownloadPermissionLetterDetails,
			documentMap,
			form,
			transformedComplaint: {},
			role,
			serviceRequestId,
			isAssignedToEmployee,
			Downloadesamparkdetailspl,
			Downloadesamparkdetails,
			selectedComplaint,
			userInfo,
			PayMentOne,
			PayMentTwo
		};
	}
};

const mapDispatchToProps = dispatch => {
	return {
		fetchApplications: criteria => dispatch(fetchApplications(criteria)), //fetchResponseForRefdunf
		// fetchResponseForRefdunf: criteria => dispatch(fetchResponseForRefdunf(criteria)),
		fetchPayment: criteria => dispatch(fetchPayment(criteria)),
		fetchDataAfterPayment: criteria => dispatch(fetchDataAfterPayment(criteria)),

		downloadReceiptForPCC: criteria => dispatch(downloadReceiptForPCC(criteria)),
		downloadPLForPCC: criteria => dispatch(downloadPLForPCC(criteria)),
		downloadAppForPCC: criteria => dispatch(downloadAppForPCC(criteria)),
		fetchHistory: criteria => dispatch(fetchHistory(criteria)),
		resetFiles: formKey => dispatch(resetFiles(formKey)),
		sendMessage: message => dispatch(sendMessage(message)),
		sendMessageMedia: message => dispatch(sendMessageMedia(message)),
		prepareFormData: (jsonPath, value) =>
			dispatch(prepareFormData(jsonPath, value)),
		prepareFinalObject: (jsonPath, value) =>
			dispatch(prepareFinalObject(jsonPath, value)),
			downloadEsamparkApp: criteria => dispatch(downloadEsamparkApp(criteria)),  
			downloadEsamparkPL: criteria => dispatch(downloadEsamparkPL(criteria)),
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(ApplicationDetails);