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
import { prepareFormData } from "egov-ui-kit/redux/common/actions";
import { getTenantId } from "egov-ui-kit/utils/localStorageUtils";
import NewLocationTaskStatus from "../AllMCCApplication/components/NewLocationTaskStatus"
import AppDetails from "../AllMCCApplication/components/NewLocationAppDetails"
import NewLocationFieldsDetails from '../AllMCCApplication/components/NewLocationFieldsDetails'
import BookingDetails from "../AllMCCApplication/components/NewLocationBookingDetails"
import ImageListDetails from '../AllMCCApplication/components/Image'
import DocumentPreview from "../AllApplications/components/DocumentPreview"
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
// import DialogContainer from "../../modules/DialogContainer"
import PaymentDetails from "../AllApplications/components/PaymentDetails"
import NewLocationResolved from "../NewLocationResolved";
import NewLocationRejected from "../NewLocationRejected";
import NewLocationPublished from '../NewLocationPublished';

import jp from "jsonpath";
import {
	getQueryArg,
	setBusinessServiceDataToLocalStorage,
	getFileUrlFromAPI,
	setDocuments
} from "egov-ui-framework/ui-utils/commons";
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
	fetchApplications, fetchMccApplications, fetchPayment, fetchHistory, fetchDataAfterPayment, downloadPaymentReceipt, downloadApplication,
	sendMessage, downloadPermissionLetter,
	sendMessageMedia
} from "egov-ui-kit/redux/bookings/actions";
import { connect } from "react-redux";
import DialogContainer from '../../modules/DialogContainer';
import Footer from "../../modules/footer"
import ActionButtonDropdown from '../../modules/ActionButtonDropdown'
import { convertEpochToDate, getDurationDate } from '../../modules/commonFunction'
import "./index.css";
import { withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import { httpRequest } from "egov-ui-kit/utils/api";
import Label from "egov-ui-kit/utils/translationNode";



const styles = (theme) => ({

});
const dosalogStyle = {
	flex: '1 1 auto',
	padding: '0 24px 24px',
	overflowY: 'auto',
	overflowScrolling: 'touch',
	zIndex: '2000',
}

const DialogTitle = withStyles(styles)((props) => {
	const { children, classes, onClose, ...other } = props;
	return (
		<MuiDialogTitle disableTypography className={classes.root} {...other}>
			<Typography variant="h6">{children}</Typography>
			{onClose ? (
				<IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
					<CloseIcon />
				</IconButton>
			) : null}
		</MuiDialogTitle>
	);
});

const DialogContent = withStyles((theme) => ({

}))(MuiDialogContent);

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
			actionOpen: false,
			imageData: [],
			ImageList: [],
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


	async componentDidMount() {
		let {
			fetchApplications,
			fetchMccApplications,
			fetchHistory,
			fetchPayment,
			fetchDataAfterPayment, downloadPaymentReceipt,
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

		let requestbody = {
			"applicationNumber": match.params.applicationId, 'uuid': userInfo.uuid,
			"applicationStatus": "",
			"mobileNumber": "", "bookingType": "", "tenantId": "ch"
		}

		let imageListFromAPI = await httpRequest(
			"bookings/newLocation/employee/osujm/_search",
			"_search", [],
			requestbody
		);

		let bookingDocs = imageListFromAPI && imageListFromAPI.documentList;
		let fileStoreIds = bookingDocs.map(e => e.fileStoreId).join(",");

		const fileUrlPayload = fileStoreIds && (await getFileUrlFromAPI(fileStoreIds));
		let newLocationImagesPreview = [];
		bookingDocs && bookingDocs.forEach((item, index) => {

			newLocationImagesPreview[index] = {
				fileName: item.fileName ||
					`Document - ${index + 1}`,
				fileStoreId: item.fileStoreId,
				fileUrl: Object.values(fileUrlPayload)[index].split(",")[0],
				documentType: item.documentType,

			};

		});
		let part2 = newLocationImagesPreview && newLocationImagesPreview.filter(item => item.documentType != "IDPROOF");

		this.setState({
			ImageList: part2
		})

		fetchMccApplications(
			{
				"applicationNumber": match.params.applicationId, 'uuid': userInfo.uuid,
				"applicationStatus": "",
				"mobileNumber": "", "bookingType": "",
				"tenantId":userInfo.tenantId
			}
		);


		fetchHistory([
			{ key: "businessIds", value: match.params.applicationId }, { key: "history", value: true }, { key: "tenantId", value: userInfo.tenantId }])
		//complaint.businessService
		fetchPayment(
			[{ key: "consumerCode", value: match.params.applicationId }, { key: "businessService", value: "OSBM" }, { key: "tenantId", value: userInfo.tenantId }
			])
		fetchDataAfterPayment(
			[{ key: "consumerCodes", value: match.params.applicationId }, { key: "tenantId", value: userInfo.tenantId }
			])	
	}

	componentWillReceiveProps = async (nextProps) => {

		// this.getImegeDocument();
		const { transformedComplaint, prepareFormData } = this.props;
		if (!isEqual(transformedComplaint, nextProps.transformedComplaint)) {
			prepareFormData("complaints", nextProps.transformedComplaint);
		}
	}

	actionButtonOnClick = (e, complaintNo, label) => {
		if (label == 'APPROVED') {
			this.setState({
				actionTittle: "Approve Application"
			})
		} else if (label == 'PUBLISH') {
			this.setState({
				actionTittle: "Publish Application"
			})
		}


		else {
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
		//Action for second button
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
		const { transformedComplaint, paymentDetailsForReceipt, downloadPaymentReceipt, userInfo } = this.props;
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
				"bookingItem": "Online Payment Against Booking of Open Space for Building Material",
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
				// name: paymentDetailsForReceipt.Payments[0].payerName,
				//     mobileNumber:
				//         paymentDetailsForReceipt.Payments[0].mobileNumber,
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
		downloadPaymentReceipt({ BookingInfo: BookingInfo })
	}

	downloadApplicationFunction = async (e) => {
		const { transformedComplaint, paymentDetailsForReceipt, downloadApplication, paymentDetails, userInfo } = this.props;

		const { complaint } = transformedComplaint;


		let bookingDataOsbm = {
			applicationNumber: complaint.applicationNo,
			houseNo: complaint.houseNo,
			locality: complaint.sector,
			address: complaint.address,
			applicationDate: complaint.dateCreated,
			villageOrCity: complaint.villageCity,
			propertyType: complaint.residentialCommercial,
			storageAreaRequired: complaint.areaRequired,
			category: complaint.bkCategory,
			typeOfConstruction: complaint.bkConstructionType,
			// permissionPeriod: "From 18-03-2020 To 17-04-2020",
			duration:
				complaint.bkDuration == "1"
					? `${complaint.bkDuration} Month`
					: `${complaint.bkDuration} Months`,
			categoryImage: "",
			// categoryImage: applicationData.bkCategory === "Cat-A" ? "http://3.6.65.87:3000/static/media/cat-a.4e1bc5ec.jpeg" : applicationData.bkCategory === "Cat-B" ? "" : "http://3.6.65.87:3000/static/media/cat-c.4e1bc5ec.jpeg"
		};
		const queryStr = [
			{
				key: "key",
				value: "bk-osbm-app-form"
			},
			{ key: "tenantId", value: "ch" },
		];

		let appData = [
			{
				applicantDetail: {
					name: complaint.applicantName,
					mobileNumber: complaint.bkMobileNumber,
					houseNo: complaint.houseNo,
					permanentAddress: complaint.address,
					// permanentCity: tenantId,
					sector: complaint.sector,
					email: complaint.bkEmail,
				},
				bookingDetail: bookingDataOsbm,
				feeDetail: {
					baseCharge:
						paymentDetails === undefined
							? null
							: paymentDetails.billDetails[0].billAccountDetails.filter(el => !el.taxHeadCode.includes("TAX"))[0].amount,
					taxes:
						paymentDetails === undefined
							? null
							: paymentDetails.billDetails[0].billAccountDetails.filter(el => el.taxHeadCode.includes("TAX"))[0].amount,
					totalAmount:
						paymentDetails === undefined
							? null
							: paymentDetails.totalAmount,
				},
			},
		];


		downloadApplication({ BookingInfo: appData })
	}
	// Download Application 
	downloadApplicationButton = async (e) => {
		this.downloadApplicationFunction();

		const { DownloadApplicationDetails } = this.props;
		var documentsPreview = [];
		let documentsPreviewData;
		if (DownloadApplicationDetails && DownloadApplicationDetails.filestoreIds.length > 0) {
			documentsPreviewData = DownloadApplicationDetails.filestoreIds[0];
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
				//doc["name"] = doc.fileStoreId;
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

	//*****Download Permission letter for OSBM application*****//
	downloadPermissionLetterButton = async (e) => {
		await this.downloadPermissionLetterFunction();
		let documentsPreviewData;
		const { DownloadPermissionLetterDetails } = this.props;
		var documentsPreview = [];
		if (DownloadPermissionLetterDetails && DownloadPermissionLetterDetails.filestoreIds.length > 0) {
			documentsPreviewData = DownloadPermissionLetterDetails.filestoreIds[0];
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
				//doc["name"] = doc.fileStoreId;
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
		const { transformedComplaint, paymentDetails, downloadPermissionLetter, userInfo } = this.props;
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
				},
				bookingDetail: {
					applicationNumber:
						complaint.applicationNo,
					applicationDate: convertEpochToDate(
						complaint.dateCreated, "dayend"
					),
					bookingPeriod: getDurationDate(
						complaint.bkFromDate,
						complaint.bkToDate
					),

					villageOrCity: complaint.villageCity,
					residentialOrCommercial: complaint.residentialCommercial,
					areaRequired: complaint.areaRequired,
					category: complaint.bkCategory,
					typeOfConstruction: complaint.bkConstructionType,
					permissionPeriod: getDurationDate(
						complaint.bkFromDate,
						complaint.bkToDate
					),

					duration:
						complaint.bkDuration == "1"
							? `${complaint.bkDuration} Month`
							: `${complaint.bkDuration} Months`,
					categoryImage: "",
					groundName: complaint.sector
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
				},
				generatedBy: {
					generatedBy: userInfo.name,
				}
			}]

		downloadPermissionLetter({ BookingInfo: receiptData })
	}
	//****end*****//
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
				//doc["name"] = doc.fileStoreId;
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
		const { part1 } = this.props;
		var documentsPreview = [];
		if (part1 && part1.length > 0) {
			let keys = part1[0].fileStoreId;
			let values = part1[0].fileName;
			let id = keys,
				fileName = values;

			documentsPreview.push({
				title: "DOC_DOC_PICTURE",
				fileStoreId: id,
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
				//doc["name"] = doc.fileStoreId;
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
	// getImegeDocument = async () => {

	// 	const { bookingDocs } = this.props;
	// 	if (bookingDocs.length > 0) {

	// 		let fileStoreIds = bookingDocs.map(e => e.fileStoreId).join(",");

	// 		const fileUrlPayload = fileStoreIds && (await getFileUrlFromAPI(fileStoreIds));
	// 		let newLocationImagesPreview = [];
	// 		bookingDocs && bookingDocs.forEach((item, index) => {

	// 			newLocationImagesPreview[index] = {
	// 				fileName: item.fileName ||
	// 					`Document - ${index + 1}`,
	// 				fileStoreId: item.fileStoreId,
	// 				fileUrl: Object.values(fileUrlPayload)[index].split(",")[0],
	// 				documentType: item.documentType,

	// 			};

	// 		});
	// 		let part2 = newLocationImagesPreview && newLocationImagesPreview.filter(item => item.documentType != "IDPROOF");

	// 		prepareFinalObject('locationImages', part2)

	// 		this.setState({ imageData: part2 })
	// 	}
	// }
	render() {
		const dropbordernone = {
			float: "right",
			paddingRight: "20px"

		};
		let { comments, openMap, imageData } = this.state;
		let { complaint, timeLine } = this.props.transformedComplaint;
		let { documentMap, part1, part2 } = this.props;
		let { historyApiData, paymentDetails, match, userInfo } = this.props;
		let imageDetails;
		if (imageData.length != 0) {
			imageDetails = imageData;

		}

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

				//  if () {
				btnOneLabel = "BK_MYBK_REJECT_BUTTON";
				btnTwoLabel = "BK_MYBK_RESOLVE_MARK_RESOLVED";
				//  }
			}
		}
		if (timeLine && timeLine[0]) {
			action = timeLine[0].action;
		}
		const foundFirstLavel = userInfo && userInfo.roles.some(el => el.code === 'MCC_APPROVER');
		const foundSecondLavel = userInfo && userInfo.roles.some(el => el.code === 'OSD_APPROVER');
		const foundthirdLavel = userInfo && userInfo.roles.some(el => el.code === 'ADMIN_APPROVER');


		return (
			<div>
				<Screen>
					{complaint && !openMap && (
						<div>
							<div className="form-without-button-cont-generic">
								<div className="container" >
									<div className="row">
										<div className="col-12 col-md-6" style={{ fontSize: 'x-large' }}>

											Application Details
										</div>
										<div className="col-12 col-md-6 row">
											<div class="col-12 col-md-6 col-sm-3" >

											</div>
											<div class="col-12 col-md-6 col-sm-3" >


											</div>
										</div>
									</div>
								</div>

								<NewLocationTaskStatus
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


								<NewLocationFieldsDetails
									{...complaint}
								/>


								<div style={{
									height: "250px", marginBottom: '15px', width: "100", backgroundColor: "white", border: "2px solid white",
									boxShadow: "0 0 2px 2px #e7dcdc", paddingLeft: "30px", paddingTop: "10px"
								}}>
									<div style={{ marginTop: 30 }}> <Label label="BK_NEW_LOCATION_IMAGES" /></div><br></br>
									<div>
										{(() => {
											if (this.state && this.state.ImageList.length > 0) {

												return this.state.ImageList.map((item, index) => {

													return <div style={{ marginRight: "20px", display: 'inline-block' }}><img size="medium" width={200} height={154} src={item.fileUrl} />	</div>
												})
											}
										})()}
									</div>
								</div>

								<div style={{
									height: "100px",
									width: "100",
									backgroundColor: "white",
									border: "2px solid white",
									boxShadow: "0 0 2px 2px #e7dcdc", paddingLeft: "30px", paddingTop: "10px"
								}}><b>Documents</b><br></br>


									document.pdf
									<button className="ViewDetailButton" onClick={(e) => { this.callApiForDocumentData(e) }}>VIEW</button>
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
											(complaint.status == "PENDINGAPPROVAL" && foundFirstLavel &&


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
										))}
								{(role === "employee" &&

									(complaint.status == "PENDINGAPPROVALOSD" && foundSecondLavel &&

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
									(complaint.status == "PENDINGPUBLISH" && foundthirdLavel &&

										<Footer className="apply-wizard-footer" style={{ display: 'flex', justifyContent: 'flex-end' }} children={<ActionButtonDropdown data={{
											label: { labelName: "TAKE ACTION ", labelKey: "BK_COMMON_TAKE_ACTION" },
											rightIcon: "arrow_drop_down",
											props: {
												variant: "outlined",
												style: { marginLeft: 5, marginRight: 15, backgroundColor: "#FE7A51", color: "#fff", border: "none", height: "60px", width: "250px" }
											},
											menu: [{
												label: {
													labelName: "Publish",
													labelKey: "BK_MYBK_PUBLISH_ACTION_BUTTON"
												},

												link: () => this.actionButtonOnClick('state', "dispatch", 'PUBLISH')
											},
											]
										}} />}></Footer>

									)

								)}

								<DialogContainer
									toggle={this.state.togglepopup}
									actionTittle={this.state.actionTittle}
									togglepopup={this.actionButtonOnClick}
									children={this.state.actionOnApplication == 'APPROVED' ? <NewLocationResolved
										applicationNumber={match.params.applicationId}
										userInfo={userInfo}
									/> : this.state.actionOnApplication == 'PUBLISH' ? <NewLocationPublished
										applicationNumber={match.params.applicationId}
										userInfo={userInfo}
									/> : <NewLocationRejected
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


//Don't Delete this
let gro = "";

const mapStateToProps = (state, ownProps) => {
	const { bookings, common, auth, form } = state;
	const { MccApplicationData } = bookings;
	const { DownloadPaymentReceiptDetails, DownloadApplicationDetails, DownloadPermissionLetterDetails } = bookings;
	// complaint=applicationData?applicationData.bookingsModelList:'';

	const { id } = auth.userInfo;
	
	const { employeeById, departmentById, designationsById, cities } =
		common || {};
	
	const { userInfo } = state.auth;
	const serviceRequestId = ownProps.match.params.applicationId;
	let selectedComplaint = MccApplicationData ? MccApplicationData.osujmNewLocationModelList[0] : ''
	let businessService = MccApplicationData ? MccApplicationData.osujmNewLocationModelList : "";
	


	let documentMap = MccApplicationData && MccApplicationData.documentMap ? MccApplicationData.documentMap : '';

	let bookingDocs = MccApplicationData && MccApplicationData.documentList ? MccApplicationData.documentList : '';


	let newLocationImagesPreview = [];
	bookingDocs && bookingDocs.forEach((item, index) => {

		newLocationImagesPreview[index] = {
			fileName: item.fileName ||
				`Document - ${index + 1}`,
			fileStoreId: item.fileStoreId,
			documentType: item.documentType,

		};

	});

	let part1 = newLocationImagesPreview && newLocationImagesPreview.filter(item => item.documentType == "IDPROOF");

	let part2 = newLocationImagesPreview && newLocationImagesPreview.filter(item => item.documentType != "IDPROOF");


	const { HistoryData } = bookings;
	let historyObject = HistoryData ? HistoryData : ''
	const { paymentData } = bookings;
	const { fetchPaymentAfterPayment } = bookings;

	let paymentDetailsForReceipt = fetchPaymentAfterPayment;
	let paymentDetails;
	if (selectedComplaint && selectedComplaint.bkApplicationStatus == "APPROVED") {
		paymentDetails = fetchPaymentAfterPayment && fetchPaymentAfterPayment.Payments[0] && fetchPaymentAfterPayment.Payments[0].paymentDetails[0].bill;
	} else {
		paymentDetails = paymentData ? paymentData.Bill[0] : '';
	}

	// let paymentDetails = paymentData ? paymentData.Bill[0] : ''
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
			applicantName: selectedComplaint.applicantName,
			status: selectedComplaint.applicationStatus,
			applicationNo: selectedComplaint.applicationNumber,
			address: selectedComplaint.applicantAddress,
			bookingType: selectedComplaint.bkBookingType,
			sector: selectedComplaint.sector,
			bkEmail: selectedComplaint.mailAddress,
			bkMobileNumber: selectedComplaint.contact,
			houseNo: selectedComplaint.bkHouseNo,
			dateCreated: selectedComplaint.dateCreated,
			areaRequired: selectedComplaint.areaRequirement,
			bkDuration: selectedComplaint.bkDuration,
			bkCategory: selectedComplaint.bkCategory,
			constructionType: selectedComplaint.bkConstructionType,
			villageCity: selectedComplaint.bkVillCity,
			residentialCommercial: selectedComplaint.bkType,
			businessService: selectedComplaint.businessService,
			bkConstructionType: selectedComplaint.bkConstructionType,
			bkFromDate: selectedComplaint.bkFromDate,
			bkToDate: selectedComplaint.bkToDate,
			localityAddress: selectedComplaint.localityAddress,
			landmark: selectedComplaint.landmark,
			areaRequirement: selectedComplaint.areaRequirement

		}



		let transformedComplaint;
		if (MccApplicationData != null && MccApplicationData != undefined) {

			transformedComplaint = {
				complaint: details,//applicationData?applicationData.bookingsModelList[0]:'',
			};
		}

		const { localizationLabels } = state.app;
		const complaintTypeLocalised = getTranslatedLabel(
			`SERVICEDEFS.${transformedComplaint.complaint.complaint}`.toUpperCase(),
			localizationLabels
		);
		// let documentMapDataValues = [];
		return {
			paymentDetails, part1, bookingDocs, part2,
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
			// reopenValidChecker
		};
	} else {
		return {
			paymentDetails, part1, bookingDocs, part2,
			historyApiData,
			DownloadPaymentReceiptDetails,
			paymentDetailsForReceipt, DownloadApplicationDetails, DownloadPermissionLetterDetails,
			documentMap,
			form,
			transformedComplaint: {},
			role,
			serviceRequestId,
			isAssignedToEmployee,
			// reopenValidChecker
		};
	}
};

const mapDispatchToProps = dispatch => {
	return {
		fetchApplications: criteria => dispatch(fetchApplications(criteria)),
		fetchPayment: criteria => dispatch(fetchPayment(criteria)),
		fetchDataAfterPayment: criteria => dispatch(fetchDataAfterPayment(criteria)),
		fetchMccApplications: criteria => dispatch(fetchMccApplications(criteria)),
		downloadPaymentReceipt: criteria => dispatch(downloadPaymentReceipt(criteria)),
		downloadPermissionLetter: criteria => dispatch(downloadPermissionLetter(criteria)),
		downloadApplication: criteria => dispatch(downloadApplication(criteria)),
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
)(ApplicationDetails);