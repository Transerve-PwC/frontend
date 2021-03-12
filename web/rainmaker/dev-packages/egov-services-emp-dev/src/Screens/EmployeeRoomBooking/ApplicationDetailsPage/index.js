import React, { Component } from "react";
import { Details } from "modules/common";
import { ComplaintTimeLine } from "modules/common";
import { Comments } from "modules/common";
import { Screen } from "modules/common";
import { resetFiles } from "egov-ui-kit/redux/form/actions";
import get from "lodash/get";
import isEqual from "lodash/isEqual";
import { prepareFormData } from "egov-ui-kit/redux/common/actions";
import { toggleSnackbarAndSetText } from "egov-ui-kit/redux/app/actions";
import { getTenantId } from "egov-ui-kit/utils/localStorageUtils";
// import OSMCCBookingDetails from "../AllApplications/components/OSMCCBookingDetails"
// import AppDetails from "../AllApplications/components/ApplicantDetails"
// import OSBMBookingDetails from "../AllApplications/components/OSBMBookingDetails"
// import DocumentPreview from "../AllApplications/components/DocumentPreview"
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import PaymentCardForRoom from "../../ParkAndCommunityCenterAppDetails/components/PaymentCardForRoom"
import CombinedRoomDetail from "../CombinedRoomDetail"
import ActionButtonDropdown from '../../../modules/ActionButtonDropdown'
// import PaymentDetails from "../AllApplications/components/PaymentDetails"
// import ApproveBooking from "../ApplicationResolved";
// import RejectBooking from "../RejectComplaint";
// import ActionButtonDropdown from '../../modules/ActionButtonDropdown'
import axios from "axios";
import jp, { value } from "jsonpath";
import { httpRequest } from "egov-ui-kit/utils/api";
// import {
// 	getFileUrlFromAPI,
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
	fetchApplications, fetchPayment, fetchHistory, fetchDataAfterPayment, downloadPaymentReceipt, downloadApplication,
	sendMessage,downloadPermissionLetter,
	sendMessageMedia,downloadRoomPaymentRecipt,downloadRoomPermissionLetter
} from "egov-ui-kit/redux/bookings/actions";
import { connect } from "react-redux";
// import DialogContainer from '../../modules/DialogContainer';
// import Footer from "../../modules/footer"
// import ActionButtonDropdown from '../../modules/ActionButtonDropdown'
// import { convertEpochToDate, getDurationDate,getFileUrlFromAPI } from '../../modules/commonFunction'
import "./index.css";
import { withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import { convertEpochToDate, getDurationDate,getFileUrlFromAPI } from '../../../modules/commonFunction'


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
			BankName: '',
			RoomDocument: '',
			commRoomData: '',
			TotalPaidAmount : '',
BKROOM_TAX : '',
BKROOM : '',
BKROOM_ROUND_OFF : '',
four : '',
totalACRoom : 0,
totalNonAcRoom : 0,
FromDate : "",
ToDate : "",
CreatedDate : "",
ApplicationNumber : "",
discountForRoom : "",
AllValues : "",
operatorCode : "",
Address: "",
hsnCode : "",
name: "",
PaymentDate : "",
			receiptNumber : "",
			PaymentMode : "",
			transactionNumber : ""
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
const {userInfo} = this.props
		let fetchUrl = window.location.pathname;
        console.log(fetchUrl)
         
        let fetchApplicationNumber = fetchUrl.substring(fetchUrl.lastIndexOf('/') + 1)
        console.log("fetchApplicationNumber--",fetchApplicationNumber)

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
		Address:Address,  //operatorCode,Address,hsnCode
		hsnCode:hsnCode,
		name:name
	})
   let createAppData = {
	"uuid": userInfo.uuid,
    "applicationNumber": fetchApplicationNumber,
	"applicationStatus": "",
	"typeOfRoom": "",
	"fromDate": "",
	"toDate": ""
    }
		
	let payloadfund = await httpRequest(
			"bookings/api/employee/community/center/room/_search",
			"_search",[],
			createAppData
			);
 
	console.log("payloadfund--",payloadfund)		
	this.props.prepareFinalObject("DataOfRoomAndCommunity",payloadfund)
	let documentForBothBooking;
	
  if(payloadfund.communityCenterDocumentMap !== undefined && payloadfund.communityCenterDocumentMap !== null){

	let checkDocumentUpload = Object.entries(payloadfund.communityCenterDocumentMap).length === 0;
	console.log("checkDocumentUpload",checkDocumentUpload)

	if(checkDocumentUpload === true){
		documentForBothBooking = "Not Applicable"
		console.log("firstDocument--",documentForBothBooking)
	}
	if(checkDocumentUpload === false){
		documentForBothBooking = payloadfund.communityCenterDocumentMap
		console.log("documentForBothBooking-second",documentForBothBooking)
	}

}

	// documentForBothBooking = payloadfund.communityCenterDocumentMap
	// console.log("documentForBothBooking-",documentForBothBooking)

if(payloadfund.communityCenterRoomBookingMap !== undefined && payloadfund.communityCenterRoomBookingMap !== null){

	let RoomCommData = payloadfund.communityCenterRoomBookingMap
    console.log("RoomCommData--",RoomCommData)
	let AllKeysOfRoom = []
	let AllValues
	for (const [key] of Object.entries(RoomCommData)) {
		console.log("allKeys--",`${key}`);
		AllKeysOfRoom.push(`${key}`)
	  }
    console.log("AllKeysOfRoom--",AllKeysOfRoom)
	console.log("RoomApplicationNumber--",AllKeysOfRoom[0].roomApplicationNumber,AllKeysOfRoom[0].typeOfRoom)
	AllValues = Object.values(RoomCommData)
	console.log("AllValues--",AllValues);
	this.setState({
		AllValues :AllValues	
	})
//[0].roomsModel   
console.log("AllValuesZeroIndex--",AllValues[0].roomsModel)

let totalACRoom = 0;
let totalNonAcRoom = 0;
let FromDate;
let ToDate;
let CreatedDate;
let ApplicationNumber;
let discountForRoom;
	
for(let i = 0; i < AllValues[0].roomsModel.length; i++){
if(AllValues[0].roomsModel[i].typeOfRoom == "AC"){
	totalACRoom = AllValues[0].roomsModel[i].totalNoOfRooms
	FromDate = AllValues[0].roomsModel[i].fromDate
	ToDate = AllValues[0].roomsModel[i].toDate
	CreatedDate = AllValues[0].roomsModel[i].createdDate
	ApplicationNumber = AllValues[0].roomsModel[i].roomApplicationNumber
	discountForRoom = AllValues[0].roomsModel[i].discount
}
if(AllValues[0].roomsModel[i].typeOfRoom == "NON-AC"){
	totalNonAcRoom = AllValues[0].roomsModel[i].totalNoOfRooms	
}
}
this.setState({
	totalACRoom : totalACRoom,
	totalNonAcRoom : totalNonAcRoom,
	FromDate : FromDate,
	ToDate : ToDate,
	CreatedDate : CreatedDate,
	ApplicationNumber : ApplicationNumber,
	discountForRoom :discountForRoom
})
console.log("totalACRoom--",totalACRoom)
console.log("totalNonAcRoom--",totalNonAcRoom)
console.log("FromDate--",FromDate)
console.log("ToDate--",ToDate)
console.log("CreatedDate--",CreatedDate)


this.props.prepareFinalObject("DataOfRoomAndCommunity.MainData",AllValues[0])
	this.setState({
		RoomDocument:documentForBothBooking,
		commRoomData:AllValues[0]
	})

let RequestData = [
	{ key: "consumerCodes", value: fetchApplicationNumber},
	{ key: "tenantId", value: userInfo.tenantId }
	];
	
	let ResponseOfPaymentCall = await httpRequest(
		"collection-services/payments/_search",
		"_search",
		RequestData,
		);
	  
		console.log("RequestData--",RequestData)
		console.log("ResponseOfPaymentCall--",ResponseOfPaymentCall)
		let TotalPaidAmount = ResponseOfPaymentCall ? ResponseOfPaymentCall.Payments[0].totalAmountPaid : ""
		console.log("totalAmountPaid--",TotalPaidAmount)
			let paymentData =  ResponseOfPaymentCall ? (ResponseOfPaymentCall.Payments.length > 0 ? (ResponseOfPaymentCall.Payments[0].paymentDetails[0].bill.billDetails[0].billAccountDetails): "NOt found Any Array") : "NOt found Any Array"
			console.log("paymentData--",paymentData)
		
			let PaymentDate = ResponseOfPaymentCall ? ResponseOfPaymentCall.Payments[0].transactionDate : ""  

			let receiptNumber = ResponseOfPaymentCall ? ResponseOfPaymentCall.Payments[0].paymentDetails[0].receiptNumber : ""  //PaymentDate,receiptNumber,PaymentMode,transactionNumber
			
			let PaymentMode = ResponseOfPaymentCall ? ResponseOfPaymentCall.Payments[0].paymentMode : ""
			
			let transactionNumber =  ResponseOfPaymentCall ? ResponseOfPaymentCall.Payments[0].transactionNumber : ""
 
		let BKROOM_TAX = 0;
		let BKROOM = 0;
		let BKROOM_ROUND_OFF = 0;  
		let four = 0;
		
		for(let i = 0; i < paymentData.length ; i++ ){
		
		if(paymentData[i].taxHeadCode == "CGST_UTGST_COMMUNITY_CENTRES_JHANJ_GHAR_BOOKING_BRANCH"){
		BKROOM_TAX = paymentData[i].amount
		}
		else if(paymentData[i].taxHeadCode == "RENT_COMMUNITY_CENTRES_JHANJ_GHAR_BOOKING_BRANCH"){
		BKROOM = paymentData[i].amount
		}
		else if(paymentData[i].taxHeadCode == "BKROOM_ROUND_OFF"){
		BKROOM_ROUND_OFF = paymentData[i].amount
		}
		else if(paymentData[i].taxHeadCode == "ROOM_FACILITATION_CHARGE"){
		four = paymentData[i].amount
		}
		} 

		this.setState({
TotalPaidAmount : TotalPaidAmount,
BKROOM_TAX : BKROOM_TAX,
BKROOM : BKROOM,
BKROOM_ROUND_OFF : BKROOM_ROUND_OFF,
four : four,
PaymentDate : PaymentDate,
receiptNumber : receiptNumber,
PaymentMode : PaymentMode,
transactionNumber : transactionNumber
		})


}
else{
	this.props.toggleSnackbarAndSetText(
		true,
		{
		  labelName: "From_Date_Is_Greater_Than_To_Date",
		  labelKey: `From_Date_Is_Greater_Than_To_Date`
		},
		"warning"
	  );
}
}
	

	actionButtonOnClick = (e, complaintNo, label) => {
		if (label == 'APPROVED') {
			this.setState({
				actionTittle: "Approve Application"
			})
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
		const { transformedComplaint, paymentDetailsForReceipt, downloadPaymentReceipt, userInfo,pdfBankName,downloadRoomPaymentRecipt } = this.props;
		
	let Newugst;
    let perFind = 50;
    let ugst = this.state.BKROOM_TAX
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

		var date2 = new Date();

		var generatedDateTime = `${date2.getDate()}-${date2.getMonth() + 1}-${date2.getFullYear()}, ${date2.getHours()}:${date2.getMinutes() < 10 ? "0" : ""}${date2.getMinutes()}`;
 	

		let BookingInfo = [
			{
				"applicantDetails": {
					"name": this.state.AllValues[0].bkApplicantName,
				},
				"booking": {
					"bkLocation": this.state.AllValues[0].bkLocation,
					"bkDept": this.state.AllValues[0].bkBookingType,
					"noOfAcRooms": this.state.totalACRoom,
					"noOfNonAcRooms": this.state.totalNonAcRoom,
					"bookingPurpose": this.state.AllValues[0].bkBookingPurpose,
					"bkStartDate": this.state.FromDate,
					"bkEndDate": this.state.ToDate,
					"placeOfService": "Chandigarh",
					"applicationNumber":this.state.ApplicationNumber
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
			  "OpCode": this.state.operatorCode,
			  "samparkAdd": this.state.Address,
		  },
			  "paymentInfo": {
				"cleaningCharges": "Not Applicable",
				"baseCharge": this.state.BKROOM,
				"cgst": Newugst,
				"utgst": Newugst,
				"totalgst":this.state.BKROOM_TAX,
				"refundableCharges": "",
				"totalPayment": this.state.TotalPaidAmount,
				"paymentDate": convertEpochToDate(this.state.PaymentDate, "dayend"),
				"receiptNo": this.state.receiptNumber,
				"currentDate":   convertEpochToDate(date2, "dayend"),
				"paymentType": this.state.PaymentMode,
				"facilitationCharge": this.state.four,
				"custGSTN": this.state.AllValues[0].bkCustomerGstNo,
				"mcGSTN": "aasdadad",
				"bankName": "",
				"transactionId":this.state.transactionNumber,
				"totalPaymentInWords": this.NumInWords(
					this.state.totalAmountPaid
				),
				"discType": this.state.AllValues[0].discount
			},
				"tenantInfo": {
					"municipalityName": "Municipal Corporation Chandigarh",
					"address": "New Deluxe Building, Sector 17, Chandigarh",
					"contactNumber": "+91-172-2541002, 0172-2541003",
					"logoUrl": "https://chstage.blob.core.windows.net/fileshare/logo.png",
					"webSite": "http://mcchandigarh.gov.in",
					"mcGSTN": "aasdadad",
					"statecode": " 04",
					"hsncode": this.state.hsnCode
				},
				"bankInfo": {
				  "accountholderName": this.state.AllValues[0].bkBankAccountHolder,
				  "rBankName": this.state.AllValues[0].bkBankName,
				  "rBankACNo": this.state.AllValues[0].bkBankAccountNumber,
				  "rIFSCCode": this.state.AllValues[0].bkIfscCode
			  }
			}
		]
		downloadRoomPaymentRecipt({ BookingInfo: BookingInfo })
			
		}

	
	downloadApplicationFunction = async (e) => {
		const { ab,xyz,Newugst } = this.props;
		const { transformedComplaint, paymentDetailsForReceipt, downloadApplication,paymentDetails,userInfo,documentMap } = this.props;
		let fdocname = Object.entries(documentMap)[0][1]
		let value1 = xyz[1];
		console.log("value1--",value1)
		let value2 = ab[1];
		console.log("value2--",value2)

		var date2 = new Date();

	var generatedDateTime = `${date2.getDate()}-${date2.getMonth() + 1}-${date2.getFullYear()}, ${date2.getHours()}:${date2.getMinutes() < 10 ? "0" : ""}${date2.getMinutes()}`;


		const { complaint } = transformedComplaint;
		let bookingDataOsbm = {
            applicationNumber: complaint.applicationNo,
            houseNo: complaint.houseNo,
            locality: complaint.sector,
            completeAddress: complaint.address,
            applicationDate: complaint.dateCreated,
            villageOrCity: complaint.villageCity,
            propertyType: complaint.residentialCommercial,
            storageAreaRequired: complaint.areaRequired,
            category: complaint.bkCategory,
            typeOfConstruction: complaint.bkConstructionType,
            
            duration:
                complaint.bkDuration == "1"
                    ? `${complaint.bkDuration} Month`
                    : `${complaint.bkDuration} Months`,
            categoryImage: "",
        };
	
		
		let appData = [
            {
                applicantDetail: {
                    name: complaint.applicantName,
                    mobileNumber: complaint.bkMobileNumber,
                    houseNo: complaint.houseNo,
                    permanentAddress: complaint.address,
                    
                    sector: complaint.sector,
                    email: complaint.bkEmail,
                },
                bookingDetail:bookingDataOsbm,
                feeDetail: {
                    baseCharge:
                        paymentDetails === undefined
                            ? null
                            : paymentDetails.billDetails[0].billAccountDetails.filter(el => !el.taxHeadCode.includes("PARKING_LOTS_MANUAL_OPEN_SPACE_BOOKING_BRANCH"))[0].amount,
                    taxes:
                        paymentDetails === undefined
                            ? null
                            : paymentDetails.billDetails[0].billAccountDetails.filter(el => el.taxHeadCode.includes("CGST_UTGST_MANUAL_OPEN_SPACE_BOOKING_BRANCH"))[0].amount,
					ugst: Newugst,
					cgst: Newugst,
					
					totalAmount:
                        paymentDetails === undefined
                            ? null
                            : paymentDetails.totalAmount,
				},
				"generatedBy": {
					"generatedBy": userInfo.name,
					"generatedDateTime":generatedDateTime
				  },
				documentDetail:{
					documentName: value1,
					document2: value2
				}

            },
        ];
		// let tenantId= userInfo&&userInfo.tenantId ? userInfo.tenantId.split(".")[0] : "";
		// console.log('tenantId==in applicaion details page',tenantId);
		downloadApplication( { BookingInfo: appData })
		

	}
	
	downloadApplicationButton = async (mode) => {
		
		await this.downloadApplicationFunction();
		setTimeout(async()=>{
		const { DownloadApplicationDetails,userInfo } = this.props;
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
				if(mode==='print'){

					var response = await axios.get(documentsPreview[0].link, {
						//responseType: "blob",
						responseType: "arraybuffer",
						
						
						headers: {
							"Content-Type": "application/json",
							Accept: "application/pdf",
						},
					});
					console.log("responseData---", response);
					const file = new Blob([response.data], { type: "application/pdf" });
					const fileURL = URL.createObjectURL(file);
					var myWindow = window.open(fileURL);
					if (myWindow != undefined) {
						myWindow.addEventListener("load", (event) => {
							myWindow.focus();
							myWindow.print();
						});
					}

				}


				else{

					setTimeout(() => {
					
						window.open(documentsPreview[0].link);
					}, 100);
				}
				
				prepareFinalObject('documentsPreview', documentsPreview)
			}
		},1500)
	}
	
  
	
downloadPermissionLetterButton = async (mode) => {
	await this.downloadPermissionLetterFunction();
	setTimeout(async()=>{
	
		let documentsPreviewData;
		const { RoomPermissionLetterData,userInfo } = this.props;
		var documentsPreview = [];
		if (RoomPermissionLetterData && RoomPermissionLetterData.filestoreIds.length > 0) {
			 documentsPreviewData=RoomPermissionLetterData.filestoreIds[0];
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
			
			if(mode==='print'){
	
				var response = await axios.get(documentsPreview[0].link, {
					//responseType: "blob",
					responseType: "arraybuffer",
					
					
					headers: {
						"Content-Type": "application/json",
						Accept: "application/pdf",
					},
				});
				console.log("responseData---", response);
				const file = new Blob([response.data], { type: "application/pdf" });
				const fileURL = URL.createObjectURL(file);
				var myWindow = window.open(fileURL);
				if (myWindow != undefined) {
					myWindow.addEventListener("load", (event) => {
						myWindow.focus();
						myWindow.print();
					});
				}
	
			}
			else{
	
				setTimeout(() => {
				
					window.open(documentsPreview[0].link);
				}, 100);
			}
			
			prepareFinalObject('documentsPreview', documentsPreview)
			
	}
	},1500)
	

}

downloadPermissionLetterFunction = async (e) => {
	const {selectedComplaint,userInfo,downloadRoomPermissionLetter} = this.props
	
	let Newugst;
    let perFind = 50;
    let ugst = this.state.BKROOM_TAX
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

		var date2 = new Date();

		var generatedDateTime = `${date2.getDate()}-${date2.getMonth() + 1}-${date2.getFullYear()}, ${date2.getHours()}:${date2.getMinutes() < 10 ? "0" : ""}${date2.getMinutes()}`;

		let BookingInfo = [
			{
				"applicantDetails": {
					"name":  this.state.AllValues[0].bkApplicantName,
					"permanentAddress":this.state.AllValues[0].bkSector,
					"permanentCity": "chandigarh",
					"placeOfService": "Chandigarh"
				},
				"bookingDetails": {
					"bkLocation": this.state.AllValues[0].bkLocation,
					"bkDept": this.state.AllValues[0].bkBookingType,
					"noOfACRooms": this.state.totalACRoom,
					"noOfNonACRooms": this.state.totalNonAcRoom,
					"bookingPurpose": this.state.AllValues[0].bkBookingPurpose,
					"bkStartDate": this.state.FromDate,
					"bkEndDate": this.state.ToDate,
					"placeOfService": "Chandigarh",
	 				"venueName": this.state.AllValues[0].bkLocation,
					"sector": this.state.AllValues[0].bkSector,
					"bookingType":this.state.AllValues[0].bkBookingType,
					"applicationDate":this.state.CreatedDate,
					"bookingPeriod": getDurationDate(
						this.state.FromDate,
						this.state.ToDate
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
					"samparkName": this.state.name,
					"samparkaddress": this.state.Address
				},
				"paymentInfo": {
					"cleaningCharges": "Not Applicable",
					"baseCharge": this.state.BKROOM,
					"cgst": Newugst,
					"utgst": Newugst,
					"totalgst":this.state.BKROOM_TAX,
					"refundableCharges": "",
					"totalPayment": this.state.TotalPaidAmount,
					"paymentDate": convertEpochToDate(this.state.PaymentDate, "dayend"),
					"receiptNo": this.state.receiptNumber,
					"currentDate":   convertEpochToDate(date2, "dayend"),
					"paymentType": this.state.PaymentMode,
					"facilitationCharge": this.state.four,
					"custGSTN": this.state.AllValues[0].bkCustomerGstNo,
					"mcGSTN": "aasdadad",
					"bankName": "",
					"transactionId":this.state.transactionNumber,
					"totalPaymentInWords": this.NumInWords(
						this.state.totalAmountPaid
					),
					"discType": this.state.AllValues[0].discount
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
					"accountholderName": this.state.AllValues[0].bkBankAccountHolder,
					"rBankName": this.state.AllValues[0].bkBankName,
					"rBankACNo": this.state.AllValues[0].bkBankAccountNumber,
					"rIFSCCode": this.state.AllValues[0].bkIfscCode
				}
			}
		]
	  
		downloadRoomPermissionLetter({ BookingInfo: BookingInfo })
		}
	
	downloadPaymentReceiptButton = async (mode) => {
		this.downloadPaymentReceiptFunction();
		setTimeout(async()=>{
		let documentsPreviewData;
		const { RoomReceiptData,userInfo,bookings,MyName } = this.props;
		console.log("PropsInPayementFunction-",this.props)
		console.log("StaticData--",MyName)
		let {RoomPaymentReceipt} = bookings
		console.log("RoomPaymentReceipt-Extract-from-bookings",
		(RoomPaymentReceipt !== undefined && RoomPaymentReceipt !== null) ? RoomPaymentReceipt : "NotFound")
		console.log("downloadPaymentReceiptButton--props",bookings.RoomPaymentReceipt,userInfo)
		var documentsPreview = [];
		if (bookings.RoomPaymentReceipt && bookings.RoomPaymentReceipt.filestoreIds.length > 0) {	
			documentsPreviewData = bookings.RoomPaymentReceipt.filestoreIds[0];
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
			
			if(mode==='print'){

				var response = await axios.get(documentsPreview[0].link, {
					//responseType: "blob",
					responseType: "arraybuffer",
					
					
					headers: {
						"Content-Type": "application/json",
						Accept: "application/pdf",
					},
				});
				console.log("responseData---", response);
				const file = new Blob([response.data], { type: "application/pdf" });
				const fileURL = URL.createObjectURL(file);
				var myWindow = window.open(fileURL);
				if (myWindow != undefined) {
					myWindow.addEventListener("load", (event) => {
						myWindow.focus();
						myWindow.print();
					});
				}

			}
			else{

				setTimeout(() => {
				
					window.open(documentsPreview[0].link);
				}, 100);
			}
			
			prepareFinalObject('documentsPreview', documentsPreview)
		}
	},1500)
	}


	callApiForDocumentData = async (e) => {
		const { xyz,userInfo } = this.props;
		console.log("xyzInPDF--",xyz)
		var documentsPreview = [];
		if (xyz && xyz.length > 0) {
			console.log("xyzGreater--",xyz)
			console.log("key[0-",xyz[0])
			let keys = xyz[0]
			console.log("key---",keys)
			let values = xyz[1];
			console.log("valuesInDoc--",values)
			let id = keys
			console.log("id--",id)
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

	DownloadOtherDocumentData = async (e) => {
		const { ab,userInfo } = this.props;
		var documentsPreview = [];
		if (ab && ab.length > 0) {
			let keys = ab[0];
			console.log("keys2--",keys)
			let values = ab[1];
			console.log("values2--",values)
			let id = keys
			console.log("id2--",id)
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
	const {TotalPaidAmount,BKROOM_TAX,BKROOM,BKROOM_ROUND_OFF,four,
		totalACRoom,totalNonAcRoom,FromDate,ToDate,CreatedDate,ApplicationNumber,discountForRoom
} = this.state
console.log("state--inrender",this.state)
console.log("ValuesState--",this.state.AllValues)
	// const {totalAmountPaid,BKROOM_TAX,BKROOM,BKROOM_ROUND_OFF,four} = this.props
		return (
			<div>
         <Screen> 
		<div>
	<div className="form-without-button-cont-generic">
	<div className="container" >
	<div className="row">						
	<div className="col-12 col-md-6" style={{ fontSize: 'x-large' }}>

Room Details
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
													menu:[{
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
															labelName: "Receipt",
															labelKey: "BK_MYBK_PRINT_RECEIPT"
														},

														link: () => this.downloadPaymentReceiptButton('print'),
														leftIcon: "receipt"
													},
													{
														label: {
															labelName: "PermissionLetter",
															labelKey: "BK_MYBK_DOWNLOAD_PERMISSION_LETTER"
														},
														 link: () => this.downloadPermissionLetterButton('print'),
														 leftIcon: "book"
													}]
												}} />

											</div>
										</div>		
	</div>
	</div>
				<PaymentCardForRoom 
				TotalPaidAmount={TotalPaidAmount}
				BKROOM_TAX={BKROOM_TAX}
				BKROOM={BKROOM}
				BKROOM_ROUND_OFF={BKROOM_ROUND_OFF}
				four={four}
				/>  

<CombinedRoomDetail
totalACRoom = {totalACRoom}
totalNonAcRoom = {totalNonAcRoom}
FromDate = {FromDate}
ToDate = {ToDate}
CreatedDate = {CreatedDate}
ApplicationNumber = {ApplicationNumber}
discountForRoom = {discountForRoom}
// discount = {this.state.AllValues[0].discount}
/>


			</div>
										
			</div>
			</Screen></div>							


				

			// <div>
			// 	<Screen>
			// 			<div>
			// 				<div className="form-without-button-cont-generic">
			// 					<div className="container" >
			// 						<div className="row">
			// 							<div className="col-12 col-md-6" style={{ fontSize: 'x-large' }}>

			// 								Application Details
			// 							</div>
			// 							{/* <div className="col-12 col-md-6 row">
			// 								<div class="col-12 col-md-6 col-sm-3" >
			// 									<ActionButtonDropdown data={{
			// 										label: { labelName: "Download ", labelKey: "BK_COMMON_DOWNLOAD_ACTION" },
			// 										rightIcon: "arrow_drop_down",
			// 										leftIcon: "cloud_download",
			// 										props: {
			// 											variant: "outlined",
			// 											style: { marginLeft: 5, marginRight: 15, color: "#FE7A51", height: "60px" }, className: "tl-download-button"
			// 										},
			// 										menu: (complaint.status=='APPROVED')?[{
			// 											label: {
			// 												labelName: "Receipt",
			// 												labelKey: "BK_MYBK_DOWNLOAD_RECEIPT"
			// 											},

			// 											link: () => this.downloadPaymentReceiptButton('Receipt'),
			// 											leftIcon: "receipt"
			// 										},
			// 										{
			// 											label: {
			// 												labelName: "PermissionLetter",
			// 												labelKey: "BK_MYBK_DOWNLOAD_PERMISSION_LETTER"
			// 											},
			// 											link: () => this.downloadPermissionLetterButton('PermissionLetter'),
			// 											leftIcon: "book"
			// 										},{
			// 											label: {
			// 												labelName: "Application",
			// 												labelKey: "BK_MYBK_PRINT_APPLICATION"
			// 											},
			// 											link: () => this.downloadApplicationButton('state', "dispatch", 'REJECT'),
			// 											leftIcon: "assignment"
			// 										}]:
			// 										[{
			// 											label: {
			// 												labelName: "Application",
			// 												labelKey: "BK_MYBK_DOWNLOAD_APPLICATION"
			// 											},
			// 											link: () => this.downloadApplicationButton('Application'),
			// 											leftIcon: "assignment"
			// 										}]
			// 									}} />
			// 								</div>
			// 								<div class="col-12 col-md-6 col-sm-3" >
			// 									<ActionButtonDropdown data={{
			// 										label: { labelName: "Print", labelKey: "BK_COMMON_PRINT_ACTION" },
			// 										rightIcon: "arrow_drop_down",
			// 										leftIcon: "print",
			// 										props: {
			// 											variant: "outlined",
			// 											style: { marginLeft: 5, marginRight: 15, color: "#FE7A51", height: "60px" }, className: "tl-download-button"
			// 										},
			// 										menu:  (complaint.status=='APPROVED')?[{
			// 											label: {
			// 												labelName: "Receipt",
			// 												labelKey: "BK_MYBK_PRINT_RECEIPT"
			// 											},

			// 											link: () => this.downloadPaymentReceiptButton('print'),
			// 											leftIcon: "receipt"
			// 										},
			// 										{
			// 											label: {
			// 												labelName: "PermissionLetter",
			// 												labelKey: "BK_MYBK_DOWNLOAD_PERMISSION_LETTER"
			// 											},
			// 											 link: () => this.downloadPermissionLetterButton('print'),
			// 											 leftIcon: "book"
			// 										},{
			// 											label: {
			// 												labelName: "Application",
			// 												labelKey: "BK_MYBK_PRINT_APPLICATION"
			// 											},
			// 											link: () => this.downloadApplicationButton('print'),
			// 											leftIcon: "assignment"
			// 										}]:[{
			// 											label: {
			// 												labelName: "Application",
			// 												labelKey: "BK_MYBK_PRINT_APPLICATION"
			// 											},
			// 											link: () => this.downloadApplicationButton('print'),
			// 											leftIcon: "assignment"
			// 										}]
			// 									}} />

			// 								</div>
			// 							</div> */}
			// 						</div>
			// 					</div>

			// 					{/* <OSMCCBookingDetails
			// 						{...complaint}
			// 						historyApiData={historyApiData && historyApiData}
			// 					/>

            //                     <AppDetails
			// 						{...complaint}

			// 					/>

			// 					<OSBMBookingDetails
			// 						{...complaint}
			// 						historyApiData={historyApiData && historyApiData}
			// 					/>
								

			// 					<PaymentDetails
			// 						paymentDetails={paymentDetails && paymentDetails}
			// 					/>
			// 					 */}
			// 					<div style={{
			// 						height: "100px",
			// 						width: "100",
			// 						backgroundColor: "white",
			// 						border: "2px solid white",
			// 						boxShadow: "0 0 2px 2px #e7dcdc", paddingLeft: "30px", paddingTop: "10px"
			// 					}}><b>Documents</b><br></br>

			// 						{/* {documentMap && Object.values(documentMap) ? Object.values(documentMap) : "Not found"} */}
			// 						{xyz && xyz ? xyz[1] : "Not Found"}
			// 						<button className="ViewDetailButton" data-doc={documentMap} onClick={(e) => { this.callApiForDocumentData(e) }}>VIEW</button>
			// 					</div>

			// 					<div style={{
			// 						height: "100px",
			// 						width: "100",
			// 						backgroundColor: "white",
			// 						border: "2px solid white",
			// 						boxShadow: "0 0 2px 2px #e7dcdc", paddingLeft: "30px", paddingTop: "10px"
			// 					}}><b>Other Documents</b><br></br>

			// 						{/* {documentMap && Object.values(documentMap) ? Object.values(documentMap) : "Not found"} */}
			// 						{ab && ab ? ab[1] : "Not Found"}
			// 						<button className="ViewDetailButton" data-doc={documentMap} onClick={(e) => { this.DownloadOtherDocumentData(e) }}>VIEW</button>
			// 					</div>

			// 					<Comments
			// 						comments={comments}
			// 						role={role}
			// 						isAssignedToEmployee={isAssignedToEmployee}
			// 					/>
			// 				</div>
			// 				<div style={{
			// 					paddingTop: "30px",
			// 					paddingRight: "30px", float: "right",
			// 				}}>
			// 					{(role === "ao" &&
			// 						complaint.complaintStatus.toLowerCase() !== "closed") ||
			// 						(role === "eo" &&
			// 							(complaint.status.toLowerCase() === "escalatedlevel1pending" ||
			// 								complaint.status.toLowerCase() === "escalatedlevel2pending" ||
			// 								complaint.status.toLowerCase() === "assigned")) ||
			// 						(role === "employee" &&
			// 							(
			// 								(complaint.status == "PENDINGAPPROVAL" &&
												

			// 									<Footer className="apply-wizard-footer" style={{ display: 'flex', justifyContent: 'flex-end' }} children={<ActionButtonDropdown data={{
			// 										label: { labelName: "TAKE ACTION ", labelKey: "BK_COMMON_TAKE_ACTION" },
			// 										rightIcon: "arrow_drop_down",
			// 										props: {
			// 											variant: "outlined",
			// 											style: { marginLeft: 5, marginRight: 15, backgroundColor: "#FE7A51", color: "#fff", border: "none", height: "48px", width: "250px" }
			// 										},
			// 										menu: [{
			// 											label: {
			// 												labelName: "Approve",
			// 												labelKey: "BK_MYBK_APPROVE_ACTION_BUTTON"
			// 											},

			// 											link: () => this.actionButtonOnClick('state', "dispatch", 'APPROVED')
			// 										},
			// 										{
			// 											label: {
			// 												labelName: "Reject",
			// 												labelKey: "BK_MYBK_REJECT_ACTION_BUTTON"
			// 											},
			// 											link: () => this.actionButtonOnClick('state', "dispatch", 'REJECT')
			// 										}]
			// 									}} />}></Footer>
			// 								)

			// 							)
			// 						)}

			// 					<DialogContainer
			// 						toggle={this.state.togglepopup}
			// 						actionTittle={this.state.actionTittle}
			// 						togglepopup={this.actionButtonOnClick}									
			// 						maxWidth={'md'}
			// 						children={this.state.actionOnApplication == 'APPROVED' ? <ApproveBooking
			// 							applicationNumber={match.params.applicationId}
			// 							userInfo={userInfo}
			// 						/> : <RejectBooking
			// 								applicationNumber={match.params.applicationId}
			// 								userInfo={userInfo}
			// 							/>}
			// 					/>

			// 				</div>
			// 			</div>
					
			// 	</Screen>
			// </div>
		);
	} 
} 

const mapStateToProps = (state, ownProps) => {
	const { bookings, common, auth, form } = state;
	const { applicationData } = bookings;
	const { userInfo } = auth;
	const {RoomPaymentReceipt,RoomPermissionLetter} = bookings
	console.log("BookingsDataFromRedux--",bookings)
	let RoomReceiptData = (RoomPaymentReceipt !== undefined && RoomPaymentReceipt !== null) ? RoomPaymentReceipt : ""
	console.log("RoomReceiptData-",RoomReceiptData)
	let RoomPermissionLetterData = (RoomPermissionLetter !== undefined && RoomPermissionLetter !== null) ? RoomPermissionLetter : ""
	console.log("RoomPermissionLetterData-",RoomPermissionLetterData)
	console.log("RoomPaymentReceipt,RoomPermissionLetter--",RoomPaymentReceipt,RoomPermissionLetter)
	const { DownloadPaymentReceiptDetails,DownloadApplicationDetails,DownloadPermissionLetterDetails } = bookings;
	const { fetchPaymentAfterPayment } = bookings;
	console.log("fetchPaymentAfterPayment--",fetchPaymentAfterPayment ? fetchPaymentAfterPayment : "NofetchPaymentAfterPaymentData")
	let ReceiptPaymentDetails = fetchPaymentAfterPayment;
	let MyName = "Vandana"

	return{
		userInfo,RoomPermissionLetter,RoomPaymentReceipt,RoomReceiptData,RoomPermissionLetterData,bookings,MyName	
	}
};

const mapDispatchToProps = dispatch => {
	return {
		toggleSnackbarAndSetText: (open, message, error) =>
		dispatch(toggleSnackbarAndSetText(open, message, error)),
		fetchApplications: criteria => dispatch(fetchApplications(criteria)), //
		downloadRoomPermissionLetter: criteria => dispatch(downloadRoomPermissionLetter(criteria)),
		fetchPayment: criteria => dispatch(fetchPayment(criteria)),
		fetchDataAfterPayment: criteria => dispatch(fetchDataAfterPayment(criteria)),
		downloadRoomPaymentRecipt : criteria => dispatch(downloadRoomPaymentRecipt(criteria)),
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




