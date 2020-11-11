import React, { Component } from "react";
import { Button, Icon } from "components";
import Label from "egov-ui-kit/utils/translationNode";
import SuccessMessageForPCC from "../../modules/SuccessMessageForPCC";
import { connect } from "react-redux";
import { createWaterTankerApplication, downloadBWTApplication } from "../../redux/bookings/actions";
import jp from "jsonpath";
import { getDurationDate, getFileUrlFromAPI} from '../../modules/commonFunction'
import "./index.css";
import { SortDialog, Screen } from "modules/common";
import isEmpty from "lodash/isEmpty";
import {
	downloadEsamparkApp
} from "egov-ui-kit/redux/bookings/actions";



class CreateWBTApplicationSuccess extends Component {

  continueComplaintSubmit = () => {
    let { createPACCApplicationData,userInfo,fetchSuccess } = this.props;
    createPACCApplicationData={}
    fetchSuccess=false;
    this.props.history.push("/egov-services/all-applications");
  };
  componentDidMount = async () => {   
  }

  downloadApplicationFunction = async (e) => {
    const { downloadEsamparkApp, userInfo,createPACCApplicationData,documentMap} = this.props;
    console.log("createPACCApplicationData--this.props--",this.props)
    let applicationDetails = createPACCApplicationData ? createPACCApplicationData.data : '';
    let fdocname = Object.entries(documentMap)[0][1]
    console.log("fname--",fdocname)
   let BookingInfo = [
      {
          "applicantDetail": {
              "name": applicationDetails.bkApplicantName,
              "mobileNumber":applicationDetails.bkMobileNumber,
              "email": applicationDetails.bkEmail,
              "permanentAddress": "",
              "permanentCity": "Chandigarh",
              "sector": applicationDetails.bkSector,
              "fatherName": " "
          },
          "bookingDetail": {
              "applicationNumber": applicationDetails.bkApplicationNumber,
              "applicationDate": "",
              "bookingPeriod": getDurationDate(
                applicationDetails.bkFromDate,
                applicationDetails.bkToDate
              ),
              "venueName": applicationDetails.bkLocation,
              "sector": applicationDetails.bkSector,
              "bookingPurpose": applicationDetails.bkBookingPurpose,
              "parkDim": applicationDetails.bkDimension
          },
          "feeDetail": {
              "baseCharge": applicationDetails.bkRent,
              "cleaningCharge": applicationDetails.bkCleansingCharges,
              "surcharges": applicationDetails.bkSurchargeRent,
              "facilitationCharge": "100",
              "utgst": applicationDetails.bkUtgst,
              "cgst": applicationDetails.bkCgst,
              "gst": applicationDetails.bkCgst,
              "totalAmount": applicationDetails.bkRent
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
    const {DownloadBWTApplicationDetails,userInfo,Downloadesamparkdetails}=this.props;

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
				
			}
  
  
  
  }
  render() {
    const { createWaterTankerApplicationData,downloadBWTApplication,loading,createPACCApplicationData, updatePACCApplicationData } = this.props;
    //BK_MYBK_PCC_CREATE_APPLICATION_HEADER
    // Park And Community Centre
   console.log("updatePACCApplicationData--render-props--",this.props)
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
          applicationNumber={createPACCApplicationData&&createPACCApplicationData.data?createPACCApplicationData.data.bkApplicationNumber:''}
        />
        <div className="responsive-action-button-cont">
          <Button
            className="responsive-action-button"
            primary={true}
            label={<Label buttonLabel={true} label="BK_CORE_COMMON_DOWNLOAD" />}
            fullWidth={true}
            onClick={this.downloadApplicationButton}
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
  const { updatePACCApplicationData, createPACCApplicationData,fetchSuccess, Downloadesamparkdetails} = bookings;
  const { createWaterTankerApplicationData, DownloadBWTApplicationDetails,categoriesById } = complaints;
  let documentMap = state.screenConfiguration.preparedFinalObject ? state.screenConfiguration.preparedFinalObject.documentMap : "";
  const loading = !isEmpty(createPACCApplicationData)
  ? fetchSuccess
    ? false
    : true
  : true;

  console.log("createPACCApplicationData--123--",createPACCApplicationData)
  return {
    createWaterTankerApplicationData, DownloadBWTApplicationDetails,loading,fetchSuccess,createPACCApplicationData,
    updatePACCApplicationData,Downloadesamparkdetails,userInfo,documentMap
  }
}

const mapDispatchToProps = dispatch => {
  return {
    downloadBWTApplication: criteria => dispatch(downloadBWTApplication(criteria)),
    downloadEsamparkApp: criteria => dispatch(downloadEsamparkApp(criteria)),
    createWaterTankerApplication: criteria => dispatch(createWaterTankerApplication(criteria)),
    toggleSnackbarAndSetText: (open, message, error) =>
      dispatch(toggleSnackbarAndSetText(open, message, error)),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateWBTApplicationSuccess);