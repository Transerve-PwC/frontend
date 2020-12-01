import React, { Component } from "react";
import { Button, Icon } from "components";
import Label from "egov-ui-kit/utils/translationNode";
import SuccessMessage from "../../modules/SuccessMessage";
import { connect } from "react-redux";
import { createWaterTankerApplication, downloadBWTApplication } from "egov-ui-kit/redux/bookings/actions";
import jp from "jsonpath";
// import {
// 	getFileUrlFromAPI
// } from "egov-ui-framework/ui-utils/commons";
import {getFileUrlFromAPI} from '../../modules/commonFunction'
import "./index.css";
import { SortDialog, Screen } from "modules/common";
import isEmpty from "lodash/isEmpty";


class CreateWBTApplicationSuccess extends Component {

  continueComplaintSubmit = () => {
    let { createWaterTankerApplicationData,downloadBWTApplication,userInfo,fetchSuccess } = this.props;
    createWaterTankerApplicationData={}
    fetchSuccess=false;
    this.props.history.push("/egov-services/all-applications");
  };
  componentDidMount = async () => {   
  }

  downloadApplicationFunction = async (e) => {
    const { createWaterTankerApplicationData,downloadBWTApplication,userInfo } = this.props;
    let applicationDetails = createWaterTankerApplicationData ? createWaterTankerApplicationData.data : '';
    let BookingInfo = [
      {
        "applicantDetail": {
          "name":applicationDetails.bkApplicantName,
          "mobileNumber":applicationDetails.bkMobileNumber,
          "houseNo":applicationDetails.bkHouseNo,
          "permanentAddress":applicationDetails.bkCompleteAddress,
          "permanentCity":applicationDetails.bkVillCity,
          "sector":applicationDetails.bkSector,
          "fatherName":applicationDetails.bkFatherName,
          "DOB":applicationDetails.bkDate,
          "email":applicationDetails.bkEmail
        },
        "bookingDetail": {
          "applicationNumber": applicationDetails.bkApplicationNumber,
          "name": applicationDetails.bkApplicantName,
          "mobileNumber":applicationDetails.bkMobileNumber,
          "email": applicationDetails.bkEmail,
          "houseNo":applicationDetails.bkHouseNo,
          "locality": applicationDetails.bkSector,
          "completeAddress": applicationDetails.bkCompleteAddress,
          "applicationDate": applicationDetails.bkDateCreated,
          "applicationDate": applicationDetails.bkDateCreated,
          "propertyType": applicationDetails.bkType,
          "date": applicationDetails.bkDate,
          "time": applicationDetails.bkTime,
          "applicationStatus": applicationDetails.bkApplicationStatus,
          "applicationType": applicationDetails.bkStatus
        },
        "feeDetail": {
          "baseCharge": 'NA',
          "taxes": 'NA',
          "totalAmount": 'NA'
        },
        "generatedBy": {
          "generatedBy": userInfo.name
        }
      }
    ]
    downloadBWTApplication({ BookingInfo: BookingInfo })
  };

  downloadApplicationButton = async (e) => {
   await this.downloadApplicationFunction();
    const {DownloadBWTApplicationDetails,userInfo}=this.props;

		var documentsPreview = [];
		let documentsPreviewData;
		if (DownloadBWTApplicationDetails && DownloadBWTApplicationDetails.filestoreIds.length > 0) {	
			documentsPreviewData = DownloadBWTApplicationDetails.filestoreIds[0];
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
    const { createWaterTankerApplicationData,downloadBWTApplication,loading } = this.props;
    return (
      <Screen loading={loading}>
      <div className="success-message-main-screen resolve-success">
      <SuccessMessage
         headermessage="BK_MYBK_APPLY_SPECIAL_REQUEST_HEADER"       
          successmessage="BK_ES_APPLICATION_CREATED_SUCCESS_MESSAGE"
          secondaryLabel="BK_CS_COMMON_SEND_MESSAGE"
          containerStyle={{ display: "inline-block" }}
          icon={<Icon action="navigation" name="check" />}
          backgroundColor={"#22b25f"}
          applicationNumber={createWaterTankerApplicationData&&createWaterTankerApplicationData.data?createWaterTankerApplicationData.data.bkApplicationNumber:''}
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
            label={<Label buttonLabel={true} label="BK_CORE_COMMON_GOTOHOME" />}
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
  const { bookings, common, auth, form } = state;
  const { createWaterTankerApplicationData, DownloadBWTApplicationDetails,fetchSuccess } = bookings;
  const loading = !isEmpty(createWaterTankerApplicationData)
  ? fetchSuccess
    ? false
    : true
  : true;
  return {
    createWaterTankerApplicationData, DownloadBWTApplicationDetails,loading,fetchSuccess
  }
}

const mapDispatchToProps = dispatch => {
  return {
    downloadBWTApplication: criteria => dispatch(downloadBWTApplication(criteria)),
    createWaterTankerApplication: criteria => dispatch(createWaterTankerApplication(criteria)),
    toggleSnackbarAndSetText: (open, message, error) =>
      dispatch(toggleSnackbarAndSetText(open, message, error)),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateWBTApplicationSuccess);



// import React, { Component } from "react";
// import { Button, Icon } from "components";
// import Label from "egov-ui-kit/utils/translationNode";
// import SuccessMessage from "../../modules/SuccessMessage";
// import { connect } from "react-redux";
// import { createWaterTankerApplication, downloadBWTApplication } from "../../redux/bookings/actions";
// import jp from "jsonpath";
// import {
// 	getQueryArg,
// 	setBusinessServiceDataToLocalStorage,
// 	getFileUrlFromAPI,
// 	setDocuments
// } from "egov-ui-framework/ui-utils/commons";

// import "./index.css";
// import { SortDialog, Screen } from "modules/common";
// import isEmpty from "lodash/isEmpty";
// class CreateWBTApplicationSuccess extends Component {

//   continueComplaintSubmit = () => {
//     let { createWaterTankerApplicationData,downloadBWTApplication,userInfo,fetchSuccess } = this.props;
//     createWaterTankerApplicationData={}
//     fetchSuccess=false;
//     this.props.history.push("/egov-services/all-applications");
//   };
//   componentDidMount = async () => {   
//   }

//   downloadApplicationFunction = async (e) => {
//     const { createWaterTankerApplicationData,downloadBWTApplication,userInfo } = this.props;
//     let applicationDetails = createWaterTankerApplicationData ? createWaterTankerApplicationData.data : '';
//     let BookingInfo = [
//       {
//         "applicantDetail": {
//           "name":applicationDetails.bkApplicantName,
//           "mobileNumber":applicationDetails.bkMobileNumber,
//           "houseNo":applicationDetails.bkHouseNo,
//           "permanentAddress":applicationDetails.bkCompleteAddress,
//           "permanentCity":applicationDetails.bkVillCity,
//           "sector":applicationDetails.bkSector,
//           "fatherName":applicationDetails.bkFatherName,
//           "DOB":applicationDetails.bkDate,
//           "email":applicationDetails.bkEmail
//         },
//         "bookingDetail": {
//           "applicationNumber": applicationDetails.bkApplicationNumber,
//           "name": applicationDetails.bkApplicantName,
//           "mobileNumber":applicationDetails.bkMobileNumber,
//           "email": applicationDetails.bkEmail,
//           "houseNo":applicationDetails.bkHouseNo,
//           "locality": applicationDetails.bkSector,
//           "completeAddress": applicationDetails.bkCompleteAddress,
//           "applicationDate": applicationDetails.bkDateCreated,
//           "applicationDate": applicationDetails.bkDateCreated,
//           "propertyType": applicationDetails.bkType,
//           "date": applicationDetails.bkDate,
//           "time": applicationDetails.bkTime,
//           "applicationStatus": applicationDetails.bkApplicationStatus,
//           "applicationType": applicationDetails.bkStatus
//         },
//         "feeDetail": {
//           "baseCharge": 'NA',
//           "taxes": 'NA',
//           "totalAmount": 'NA'
//         },
//         "generatedBy": {
//           "generatedBy": userInfo.name
//         }
//       }
//     ]
//     downloadBWTApplication({ BookingInfo: BookingInfo })
//   };

//   downloadApplicationButton = async (e) => {
//    await this.downloadApplicationFunction();
//     const {DownloadBWTApplicationDetails}=this.props;

// 		var documentsPreview = [];
// 		let documentsPreviewData;
// 		if (DownloadBWTApplicationDetails && DownloadBWTApplicationDetails.filestoreIds.length > 0) {	
// 			documentsPreviewData = DownloadBWTApplicationDetails.filestoreIds[0];
// 				documentsPreview.push({
// 					title: "DOC_DOC_PICTURE",
// 					fileStoreId: documentsPreviewData,
// 					linkText: "View",
// 				});
// 				let fileStoreIds = jp.query(documentsPreview, "$.*.fileStoreId");
// 				let fileUrls =
// 					fileStoreIds.length > 0 ? await getFileUrlFromAPI(fileStoreIds) : {};
				
	
// 				documentsPreview = documentsPreview.map(function (doc, index) {
// 					doc["link"] =
// 						(fileUrls &&
// 							fileUrls[doc.fileStoreId] &&
// 							fileUrls[doc.fileStoreId].split(",")[0]) ||
// 						"";
					
// 					doc["name"] =
// 						(fileUrls[doc.fileStoreId] &&
// 							decodeURIComponent(
// 								fileUrls[doc.fileStoreId]
// 									.split(",")[0]
// 									.split("?")[0]
// 									.split("/")
// 									.pop()
// 									.slice(13)
// 							)) ||
// 						`Document - ${index + 1}`;
// 					return doc;
// 				});
		
// 				setTimeout(() => {
// 					window.open(documentsPreview[0].link);
// 				}, 100);
				
// 			}
  
  
  
//   }
//   render() {
//     const { createWaterTankerApplicationData,downloadBWTApplication,loading } = this.props;

//     return (
//       <Screen loading={loading}>
//       <div className="success-message-main-screen resolve-success">
//         <SuccessMessage
//          headermessage="BK_MYBK_APPLY_SPECIAL_REQUEST_HEADER"
//           successmessage="BK_ES_APPLICATION_CREATED_SUCCESS_MESSAGE"
//           secondaryLabel="BK_CS_COMMON_SEND_MESSAGE"
//           containerStyle={{ display: "inline-block" }}
//           icon={<Icon action="navigation" name="check" />}
//           backgroundColor={"#22b25f"}
//           applicationNumber={createWaterTankerApplicationData&&createWaterTankerApplicationData.data?createWaterTankerApplicationData.data.bkApplicationNumber:''}
//         />
//         <div className="responsive-action-button-cont">
//           <Button
//             className="responsive-action-button"
//             primary={true}
//             label={<Label buttonLabel={true} label="BK_CORE_COMMON_DOWNLOAD" />}
//             fullWidth={true}
//             onClick={this.downloadApplicationButton}
//             style={{ marginRight: 18 }}
//           />


//           <Button
//             id="resolve-success-continue"
//             primary={true}
//             label={<Label buttonLabel={true} label="CORE_COMMON_GOTOHOME" />}
//             fullWidth={true}
//             onClick={this.continueComplaintSubmit}
//             className="responsive-action-button"
//           />
//         </div>
//       </div>
//       </Screen>
//     );
//   }
// }


// const mapStateToProps = state => {
//   const { complaints, common, auth, form } = state;
//   const { createWaterTankerApplicationData, DownloadBWTApplicationDetails,fetchSuccess } = complaints;
//   const loading = !isEmpty(createWaterTankerApplicationData)
//   ? fetchSuccess
//     ? false
//     : true
//   : true;
//   return {
//     createWaterTankerApplicationData, DownloadBWTApplicationDetails,loading,fetchSuccess
//   }
// }

// const mapDispatchToProps = dispatch => {
//   return {
//     downloadBWTApplication: criteria => dispatch(downloadBWTApplication(criteria)),
//     createWaterTankerApplication: criteria => dispatch(createWaterTankerApplication(criteria)),
//     toggleSnackbarAndSetText: (open, message, error) =>
//       dispatch(toggleSnackbarAndSetText(open, message, error)),
//   }
// }

// export default connect(
//   mapStateToProps,
//   mapDispatchToProps
// )(CreateWBTApplicationSuccess);