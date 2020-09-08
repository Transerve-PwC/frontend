import {
  getBreak, getCommonCard,
  getCommonContainer,
  getCommonHeader,
  getLabelWithValue,
  getStepperObject, getLabel,
  getCommonGrayCard,
  getCommonSubHeader
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { handleScreenConfigurationFieldChange as handleField, prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getFileUrlFromAPI, getQueryArg, getTransformedLocale, setBusinessServiceDataToLocalStorage } from "egov-ui-framework/ui-utils/commons";
import { fetchLocalizationLabel } from "egov-ui-kit/redux/app/actions";
import jp from "jsonpath";
import get from "lodash/get";
import set from "lodash/set";
import { searchBill, generateBill, createDemandForChallan, getTextToLocalMapping, convertEpochToDate, sendReceiptBymail, truncData, integer_to_roman, getDiffernceBetweenTodayDate, fetchRoleCode } from "../utils/index";
import { httpRequest } from "../../../../ui-utils";
import { violatorSummary } from "./summaryResource/violatorSummary";
import { violationsSummary } from "./summaryResource/violationsSummary";
import { documentsSummary } from "./summaryResource/documentsSummary";
import { estimateSummary } from "./summaryResource/estimateSummary";
import { searchResultsSummary, searchVehicleResultsSummary } from "./summaryResource/summaryGrid";
import { footer, takeactionfooter } from "./summaryResource/footer";
import { getSearchResultsView, getSearchResultsForNocCretificate, getSearchResultsForNocCretificateDownload, fetchMdmsData, checkVisibility, setCurrentApplicationProcessInstance } from "../../../../ui-utils/commons";
import "./index.css";
import { getAccessToken, setapplicationType, getTenantId, getLocale, getUserInfo, localStorageGet, localStorageSet, setapplicationNumber, setEncroachmentType } from "egov-ui-kit/utils/localStorageUtils";

export const stepsData = [
  { labelName: "Violations Details", labelKey: "EC_STEPPER_VIOLATIONS_STEP_1" },
  { labelName: "Article Details", labelKey: "EC_STEPPER_ARTICLE_DETAILS_STEP_2" },
  { labelName: "Documents", labelKey: "EC_STEPPER_DOCUMENTS_STEP_3" },
  { labelName: "Summary", labelKey: "EC_STEPPER_SUMMARY_STEP_4" }
];
export const stepper = getStepperObject(
  { props: { activeStep: 3 } },
  stepsData
);

const getMdmsData = async (action, state, dispatch) => {

  let tenantId = getTenantId().length > 2 ? getTenantId().split('.')[0] : getTenantId();;
  let mdmsBody = {
    MdmsCriteria: {
      tenantId: tenantId,
      moduleDetails: [
        {
          moduleName: "tenant",
          masterDetails: [
            {
              name: "tenants"
            }
          ]
        },
        {
          moduleName: "egec",
          masterDetails: [
            {
              name: "EncroachmentType"
            },
            {
              name: "sector"
            },
            ,
            {
              name: "NotificationTemplate"
            }
          ]
        },

      ]
    }
  };
  await fetchMdmsData(state, dispatch, mdmsBody, false);
};

const titlebar = getCommonContainer({
  header: getCommonHeader({
    labelName: "Echallan ",
    labelKey: "EC_CREATE_CHALLAN_MAIN_HEADER"
  }),
  applicationNumber: {
    uiFramework: "custom-atoms-local",
    moduleName: "egov-echallan",
    componentPath: "ApplicationNoContainer",
    props: {
      number: getQueryArg(window.location.href, "applicationNumber")
    }
  },
  applicationStatus: {
    uiFramework: "custom-atoms-local",
    moduleName: "egov-echallan",
    componentPath: "ApplicationStatusContainer",
    props: {
      status: "Status : " + getQueryArg(window.location.href, "applicationNumber")
    }
  },
  paymentStatus: {
    uiFramework: "custom-atoms-local",
    moduleName: "egov-echallan",
    componentPath: "ApplicationStatusContainer",
    props: {
      status: "Payment Status : "
    }
  },
  downloadMenu: {
    uiFramework: "custom-atoms",
    componentPath: "MenuButton",
    props: {
      data: {
        label: "Download",
        leftIcon: "cloud_download",
        rightIcon: "arrow_drop_down",
        props: { variant: "outlined", style: { marginLeft: 8, marginRight: 0, marginTop: "5px" } },
        menu: []
      }
    }
  },
});

const prepareDocumentsView = async (state, dispatch) => {
  let documentsPreview = [];

  // Get all documents from response
  let eChallanDocs = get(
    state,
    "screenConfiguration.preparedFinalObject.eChallanDetail[0].document",
    {}
  );

  if (eChallanDocs !== {} && eChallanDocs[0].documentUuid !== null) {
    eChallanDocs.forEach(element => {
      let docType = element.documentType.search('-') !== -1 ? element.documentType.split('-')[0].trim() : element.documentType

      documentsPreview.push({
        title: getTextToLocalMapping("EC_" + docType),
        fileStoreId: element.fileStoreId,
        linkText: "Download"
      })
    });
  }

  // let uploadViolatorImage = eChallanDocs.hasOwnProperty('document') ?
  //   JSON.parse(eChallanDocs).document[0]['documentType'] === 'ViolatorImage' ?
  //     JSON.parse(eChallanDocs).document[0]['fileStoreId'] : '' : '';

  // let uploadViolatorIdProof = JSON.parse(eChallanDocs).hasOwnProperty('document') ?
  //   JSON.parse(eChallanDocs).document[1]['documentType'] === 'ViolatorIdProof' ?
  //     JSON.parse(eChallanDocs).document[1]['fileStoreId'] : '' : '';

  let fileStoreIds = jp.query(documentsPreview, "$.*.fileStoreId");
  let fileUrls =
    fileStoreIds.length > 0 ? await getFileUrlFromAPI(fileStoreIds) : {};
  documentsPreview = documentsPreview.map(function (doc, index) {

    doc["link"] = fileUrls && fileUrls[doc.fileStoreId] && fileUrls[doc.fileStoreId].split(",")[0] || "";
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
  dispatch(prepareFinalObject("documentsPreview", documentsPreview));
  //}
};

// const prepareItemSeizedDetails = async (state, dispatch) => {
//   let documentsPreview = [];
//   let encroachmentType = get(state, "screenConfiguration.preparedFinalObject.eChallanDetail[0].encroachmentType", '');

//   // Get all documents from response
//   let SeizedItemDetailList = get(
//     state,
//     "screenConfiguration.preparedFinalObject.eChallanDetail[0].violationItem",
//     {}
//   );
//   let siarray = [];
//   if (SeizedItemDetailList.length > 0) {


//     SeizedItemDetailList.map(function (item, index) {
//       let temp1 = [];
//       temp1[0] = item['itemName'];
//       if (encroachmentType === 'Seizure of Vehicles') {
//         temp1[1] = item['itemType'];
//         temp1[2] = item['vehicleNumber'];
//         temp1[3] = item['quantity'];
//         temp1[4] = item['remark'];
//       } else {
//         temp1[1] = item['quantity'];
//         temp1[2] = item['remark'];
//       }
//       siarray.push(temp1);
//     });

//     if (encroachmentType === 'Seizure of Vehicles') {
//       dispatch(
//         handleField(
//           "summary",
//           "components.div.children.body.children.cardContent.children.searchVehicleResultsSummary",
//           "props.data",
//           siarray
//         )
//       );
//       dispatch(
//         handleField(
//           "summary",
//           "components.div.children.body.children.cardContent.children.searchVehicleResultsSummary",
//           "visible",
//           true
//         )
//       );
//       dispatch(
//         handleField(
//           "summary",
//           "components.div.children.body.children.cardContent.children.searchResultsSummary",
//           "visible",
//           false
//         )
//       );
//     } else {
//       dispatch(
//         handleField(
//           "summary",
//           "components.div.children.body.children.cardContent.children.searchResultsSummary",
//           "props.data",
//           siarray
//         )
//       );
//     }

//   }

// }

const prepareItemSeizedDetails = async (state, dispatch, encroachmentType, appstatus) => {
  // Get all documents from response
  let SeizedItemDetailList = get(
    state,
    "screenConfiguration.preparedFinalObject.eChallanDetail[0].violationItem",
    {}
  );
  let processInstanceData = get(state, "screenConfiguration.preparedFinalObject.ECHALLAN.WF.ProcessInstanceData.ProcessInstances[0]", []);
  const challanUuid = get(state, "screenConfiguration.preparedFinalObject.eChallanDetail[0].challanUuid", "");
  let showstoredDetails = false;
  let showSeizureOfVehicle = false;
  if (challanUuid !== "") {

    let rolecode = fetchRoleCode(true, appstatus);
    switch (processInstanceData.action) {
      case "CHALLAN ISSUED":
      case "CITIZEN":
      case "CLOSED":
      case "RELEASED ON GROUND":
      case "SENT TO STORE":
        if (encroachmentType === 'Seizure of Vehicles') {
          showSeizureOfVehicle = true;
        } else {
          showSeizureOfVehicle = false;
        }
        break;
      case "RELEASED FROM STORE":
      case "ADDED TO STORE":
      case "PENDING FOR AUCTION":
      case "PENDING FOR APPROVAL":
        showstoredDetails = true;
        break;
    }

    if (SeizedItemDetailList.length > 0) {
      //const challanUuid = getQueryArg(window.location.href, "Key");
      let dataarray = [];
      let siarray = [];

      if (showstoredDetails) {
        let requestBody = {
          "tenantId": getTenantId(),
          "action": "",
          "offset": 1,
          "limit": -1,
          "orderDir": "DESC",
          "orderColumn": "",
          "searchText": challanUuid
        }
        let response = await fetchStoreItemHODMasterChallanData(requestBody);

        for (let storedItemIndex = 0; storedItemIndex < response.length; storedItemIndex++) {
          const item = response[storedItemIndex];
          for (let seizedItemList = 0; seizedItemList < SeizedItemDetailList.length; seizedItemList++) {
            const element = SeizedItemDetailList[seizedItemList];
            let temp = [];
            if (item['violationItemUuid'] === element['violationItemUuid']) {
              let defectqty = parseInt(element['quantity']) - parseInt(item['quantity']);
              let intactQty = parseInt(item['quantity']) - parseInt(item['damagedQuantity']);
              temp[0] = truncData(item['itemName'], 25);
              temp[1] = element['quantity'];
              temp[2] = element['remark'];
              temp[3] = intactQty;
              temp[4] = item['damagedQuantity'];
              temp[5] = item['remark'];
              if (rolecode === 'challanHOD') {
                temp[6] = item['isVerified'];
                temp[7] = item['isAuctioned'];
                temp[8] = item['isReturned'];
                temp[9] = item['violationItemUuid'];
                temp[10] = item['violationUuid'];
              } else if (rolecode === 'challanSM') {
                temp[6] = item['violationItemUuid'];
                temp[7] = item['violationUuid'];
              }
              dataarray.push(temp);
            }

          }
        }
      } else {
        SeizedItemDetailList.map(function (item, index) {
          let temp = [];
          temp[0] = truncData(item['itemName'], 25);
          temp[1] = item['quantity'];
          temp[2] = item['remark'];
          temp[3] = '';
          temp[4] = '';
          temp[5] = '';
          temp[6] = item['violationItemUuid'];
          temp[7] = item['violationUuid'];
          dataarray.push(temp);
          let temp1 = [];
          temp1[0] = item['itemName'];
          if (encroachmentType === 'Seizure of Vehicles' && showSeizureOfVehicle) {
            temp1[1] = item['itemType'];
            temp1[2] = item['vehicleNumber'];
            temp1[3] = item['quantity'];
            temp1[4] = item['remark'];
          } else if (encroachmentType !== 'Seizure of Vehicles' && (!showSeizureOfVehicle)) {
            temp1[1] = item['quantity'];
            temp1[2] = item['remark'];
          }
          siarray.push(temp1);
        });
      }

      dispatch(prepareFinalObject('eChallanSMSeizedList', dataarray));


      switch (processInstanceData.action) {
        case "CHALLAN ISSUED":
        case "CITIZEN":
        case "CLOSED":
          if (encroachmentType === 'Seizure of Vehicles' && showSeizureOfVehicle) {
            dispatch(
              handleField(
                "summary",
                "components.div.children.body.children.cardContent.children.searchVehicleResultsSummary",
                "props.data",
                siarray
              )
            );
          } else {
            dispatch(
              handleField(
                "summary",
                "components.div.children.body.children.cardContent.children.searchResultsSummary",
                "props.data",
                siarray
              )
            );
          }
          break;
        case "RELEASED ON GROUND":
        case "SENT TO STORE":
          dispatch(
            handleField(
              "summary",
              "components.div.children.body.children.cardContent.children.searchResultsSummarySM",
              "props.data",
              dataarray
              // dataarray
            )
          );
          break;
        case "RELEASED FROM STORE":
        case "ADDED TO STORE":
        case "PENDING FOR AUCTION":
        case "PENDING FOR APPROVAL":
          dispatch(
            handleField(
              "summary",
              "components.div.children.body.children.cardContent.children.searchResultsSummaryHOD",
              "props.data",
              dataarray
              // dataarray
            )
          );
          break;
        // case "PENDING FOR AUCTION":
        //   break;

        default:
          break;
      }
    }
  }
}

const setModulesVisibleTrueFalse = (isVisible, dispatch) => {
  dispatch(
    handleField(
      "summary",
      "components.div.children.body.children.cardContent.children.estimateSummary",
      "visible",
      isVisible
    )
  );

  dispatch(
    handleField(
      "summary",
      "components.div.children.body.children.cardContent.children.violationsSummary",
      "visible",
      isVisible
    )
  );

  dispatch(
    handleField(
      "summary",
      "components.div.children.body.children.cardContent.children.searchResultsSummary",
      "visible",
      isVisible
    )
  );

  dispatch(
    handleField(
      "summary",
      "components.div.children.body.children.cardContent.children.violatorSummary",
      "visible",
      isVisible
    )
  );

  dispatch(
    handleField(
      "summary",
      "components.div.children.body.children.cardContent.children.documentsSummary",
      "visible",
      isVisible
    )
  );

};

const setEditVisibleTrueFalse = (action) => {
  set(
    action,
    "screenConfig.components.div.children.body.children.cardContent.children.estimateSummary.children.cardContent.children.header.children.editSection.visible",
    status === 'INITIATED' ? true : false
  );
  set(
    action,
    "screenConfig.components.div.children.body.children.cardContent.children.searchResultsSummary.children.cardContent.children.header.children.editSection.visible",
    status === 'INITIATED' ? true : false
  );
  set(
    action,
    "screenConfig.components.div.children.body.children.cardContent.children.violatorSummary.children.cardContent.children.header.children.editSection.visible",
    status === 'INITIATED' ? true : false
  );

  set(
    action,
    "screenConfig.components.div.children.body.children.cardContent.children.documentsSummary.children.cardContent.children.header.children.editSection.visible",
    status === 'INITIATED' ? true : false
  );

};


// const setSearchResponse = async (
//   state,
//   dispatch,
//   applicationNumber,
//   tenantId,
//   action
// ) => {


//   let RequestBody = {
//     searchtext: applicationNumber,
//     tenantId: tenantId,
//     action: '',
//   }
//   // const response = await getSearchResultsView([
//   //   { key: "applicationNumber", value: applicationNumber }
//   // ]);
//   await getMdmsData(action, state, dispatch);
//   const response = await getSearchResultsView(RequestBody);

//   dispatch(prepareFinalObject("eChallanDetail", get(response, "ResponseBody", [])));
//   if (response.ResponseBody.length > 0) {
//     let sectorval = get(state, 'screenConfiguration.preparedFinalObject.eChallanDetail[0]', []);
//     let sectorValue = get(state, 'screenConfiguration.preparedFinalObject.applyScreenMdmsData.egec.sector', []);
//     let __FOUND = sectorValue.find(function (sectorRecord, index) {
//       if (sectorRecord.code == sectorval.sector)
//         return true;
//     });
//     set(state, 'screenConfiguration.preparedFinalObject.eChallanDetail[0].sector', __FOUND.name);

//     let encroachValue = get(state, 'screenConfiguration.preparedFinalObject.applyScreenMdmsData.egec.EncroachmentType', []);
//     let __FOUNDENCROACH = encroachValue.find(function (encroachRecord, index) {
//       if (encroachRecord.code == sectorval.encroachmentType)
//         return true;
//     });

//     set(state, 'screenConfiguration.preparedFinalObject.eChallanDetail[0].encroachmentTypeName', __FOUNDENCROACH.name);

//     let processedViolationTime = sectorval.violationTime.split(':')[0] + ":" + sectorval.violationTime.split(':')[1];
//     set(state, 'screenConfiguration.preparedFinalObject.eChallanDetail[0].violationTime', processedViolationTime);

//   }

//   let formatedDate = convertEpochToDate(get(state, "screenConfiguration.preparedFinalObject.eChallanDetail[0].violationDate", new Date()));
//   set(state, 'screenConfiguration.preparedFinalObject.eChallanDetail[0].violationDate', formatedDate);
//   let encroachmentType = get(state, "screenConfiguration.preparedFinalObject.eChallanDetail[0].encroachmentType", '');
//   let appstatus = get(state, "screenConfiguration.preparedFinalObject.eChallanDetail[0].status", '');
//   let paystatus = get(state, "screenConfiguration.preparedFinalObject.eChallanDetail[0].paymentDetails.paymentStatus", '') === 'PENDING' ? 'UNPAID' : 'PAID';

//   // Set Institution/Applicant info card visibility
//   let appnumber = get(state, "screenConfiguration.preparedFinalObject.eChallanDetail[0].challanId", '');
//   dispatch(
//     handleField(
//       "summary",
//       "components.div.children.headerDiv.children.header.children.applicationNumber",
//       "props.number",
//       appnumber
//     )
//   );


//   dispatch(
//     handleField(
//       "summary",
//       "components.div.children.headerDiv.children.header.children.applicationStatus",
//       "props.status",
//       "Status : " + appstatus
//     )
//   );

//   dispatch(
//     handleField(
//       "summary",
//       "components.div.children.headerDiv.children.header.children.paymentStatus",
//       "props.status",
//       "Payment Status : " +
//       paystatus
//     )
//   );

//   setModulesVisibleTrueFalse(true, dispatch);
//   prepareDocumentsView(state, dispatch);
//   prepareItemSeizedDetails(state, dispatch);

//   createDemandforChallanCertificate(state, dispatch, tenantId);
//   setReceiveButtonVisibleTrueFalse(false, dispatch);
//   setReturnCloseButtonVisibleTrueFalse(false, dispatch);
//   setAddToStoreButtonVisibleTrueFalse(false, dispatch);
//   setHodApprovalButtonVisibleTrueFalse(false, dispatch);
//   setOnGroundButtonVisibleTrueFalse(false, dispatch);
//   setSendtoSoreButtonVisibleTrueFalse(false, dispatch);

//   switch (appstatus) {
//     case "CHALLAN ISSUED":
//       setSendtoSoreButtonVisibleTrueFalse(true, dispatch);
//       if (encroachmentType === 'Unauthorized/Unregistered Vendor') {
//         setOnGroundButtonVisibleTrueFalse(false, dispatch);
//       } else {
//         setOnGroundButtonVisibleTrueFalse(true, dispatch);
//       }
//       break;
//     case "CLOSED":
//     case "SENT TO STORE":
//     case "ADDED TO STORE":
//     case "PENDING FOR AUCTION":
//     case "RELEASED ON GROUND":
//     case "RELEASED FROM STORE":
//       setSendtoSoreButtonVisibleTrueFalse(false, dispatch);
//       setOnGroundButtonVisibleTrueFalse(false, dispatch);
//       break;

//   }

//   setSearchResponseForNocCretificate(state, dispatch, applicationNumber, tenantId);

// };


const setOnGroundButtonVisibleTrueFalse = (isVisible, dispatch) => {
  dispatch(
    handleField(
      "summary",
      "components.div.children.employeeFooter.children.onGroundPaymentButton",
      "visible",
      isVisible
    )
  );
}

const setReceiveButtonVisibleTrueFalse = (isVisible, dispatch) => {
  dispatch(
    handleField(
      "summary",
      "components.div.children.employeeFooter.children.StoreManagerReceivePaymentProcess",
      "visible",
      isVisible
    )
  );
}


const setReturnCloseButtonVisibleTrueFalse = (isVisible, dispatch) => {
  dispatch(
    handleField(
      "summary",
      "components.div.children.employeeFooter.children.StoreManagerReturnandCloseProcess",
      "visible",
      isVisible
    )
  );
}

const setAddToStoreButtonVisibleTrueFalse = (isVisible, dispatch) => {
  dispatch(
    handleField(
      "summary",
      "components.div.children.employeeFooter.children.StoreManagerAddToStoreProcess",
      "visible",
      isVisible
    )
  );
}

const setHodApprovalButtonVisibleTrueFalse = (isVisible, dispatch) => {
  dispatch(
    handleField(
      "summary",
      "components.div.children.employeeFooter.children.StoreManagerHODApprovalProcess",
      "visible",
      false //isVisible //changed since the requirement is changed
    )
  );
}

const setSendtoSoreButtonVisibleTrueFalse = (isVisible, dispatch) => {
  dispatch(
    handleField(
      "summary",
      "components.div.children.employeeFooter.children.sendtoSoreButton",
      "visible",
      isVisible
    )
  );
}

let httpLinkEchallan;

const nullToNa = value => {
  return ["", "NA", "null", null].includes(value) ? "NA" : value;
};

const setSearchResponseForNocCretificate = async (
  state,
  dispatch,
  applicationNumber,
  tenantId
) => {
  let downloadMenu = [];
  let certificateDownloadObjectEchallan_RECEIPT = {};
  let certificateDownloadObjectEchallan = {};
  let violatorDetails = get(state, 'screenConfiguration.preparedFinalObject.eChallanDetail[0]', []);
  let nocRemarks = get(state, "screenConfiguration.preparedFinalObject.eChallanDetail[0].status", {});
  let encorachmentvalue = '';
  let pdfCreateKey = '';
  let tenant = tenantId.length > 2 ? tenantId.split('.')[0] : tenantId;

  let encroachValue = get(state, 'screenConfiguration.preparedFinalObject.applyScreenMdmsData.egec.EncroachmentType', []);
  let violationEncroached = get(state, "screenConfiguration.preparedFinalObject.eChallanDetail[0].encroachmentType", "NA")

  let __FOUNDENCROACH = encroachValue.find(function (encroachRecord, index) {
    if (encroachRecord.code == violationEncroached)
      return true;
  });

  if (nocRemarks == "CHALLAN ISSUED") {
    let data = {};

    data.serialNo = nullToNa(
      get(state, "screenConfiguration.preparedFinalObject.eChallanDetail[0].challanId", "NA")
    );
    data.status = get(state, "screenConfiguration.preparedFinalObject.eChallanDetail[0].status");

    data.date = nullToNa(
      //epochToDate(
      get(state, "screenConfiguration.preparedFinalObject.eChallanDetail[0].violationDate", "NA")
      //)
    );
    data.violationTime = nullToNa(
      //epochToDate(
      get(state, "screenConfiguration.preparedFinalObject.eChallanDetail[0].violationTime", "NA")
      //)
    );

    data.encroachmentType = nullToNa(__FOUNDENCROACH.name);

    switch (violationEncroached) {
      case "Unauthorized/Unregistered Vendor":
        encorachmentvalue = "unregisteredEchallan";
        pdfCreateKey = "unregistered-ec";
        break;
      case "Registered Street Vendors":
        encorachmentvalue = "registeredEchallan";
        pdfCreateKey = "registered-ec";
        data.site = nullToNa(
          get(state, "screenConfiguration.preparedFinalObject.eChallanDetail[0].sector", "NA")
        );
        data.sector = nullToNa(
          get(state, "screenConfiguration.preparedFinalObject.eChallanDetail[0].sector", "NA")
        );

        data.licenseNo = nullToNa(
          get(state, "screenConfiguration.preparedFinalObject.eChallanDetail[0].licenseNoCov", "NA")
        );
        data.natureOfViolation = nullToNa(
          get(state, "screenConfiguration.preparedFinalObject.eChallanDetail[0].natureOfViolation", "NA")
        );

        break;
      case "Shopkeeper/Corridor":
        encorachmentvalue = "shopkeeperEchallan";
        pdfCreateKey = "shopkeeper-ec";
        break;

      case "Seizure of Vehicles":
        encorachmentvalue = "vehicleEchallan";
        pdfCreateKey = "vehicle-ec";
        data.vehicleType = nullToNa(
          get(state, "screenConfiguration.preparedFinalObject.eChallanDetail[0].violationItem[0].itemType", "NA")
        );
        data.VehicleNumber = nullToNa(
          get(state, "screenConfiguration.preparedFinalObject.eChallanDetail[0].violationItem[0].vehicleNumber", "NA")
        );
        data.vehicleName = nullToNa(
          get(state, "screenConfiguration.preparedFinalObject.eChallanDetail[0].violationItem[0].itemName", "NA")
        );
        data.remark = nullToNa(
          get(state, "screenConfiguration.preparedFinalObject.eChallanDetail[0].violationItem[0].remark", "NA")
        );
        break;
      default:
        break;
    }

    // Applicant Details
    data.violatorName = nullToNa(
      get(state, "screenConfiguration.preparedFinalObject.eChallanDetail[0].violatorName", "NA")
    );

    data.fatherName = nullToNa(
      get(state, "screenConfiguration.preparedFinalObject.eChallanDetail[0].fatherName", "NA")
    );

    data.address = nullToNa(
      get(state, "screenConfiguration.preparedFinalObject.eChallanDetail[0].address", "NA")
    );

    // data.contactNumber = nullToNa(
    //   get(state, "screenConfiguration.preparedFinalObject.eChallanDetail[0].contactNumber", "NA")
    // );
    // data.emailId = nullToNa(
    //   get(state, "screenConfiguration.preparedFinalObject.eChallanDetail[0].emailId", "NA")
    // );

    data.siName = nullToNa(
      get(state, "screenConfiguration.preparedFinalObject.eChallanDetail[0].siName", "NA")
    );

    let article = []
    if (data.encroachmentType !== "Seizure of Vehicles") {
      let violationitemList = get(state, "screenConfiguration.preparedFinalObject.eChallanDetail[0].violationItem", [])
      for (let index = 0; index < violationitemList.length; index++) {
        const element = violationitemList[index];
        // let articleobj = "article" + [index + 1];
        let artilceName = "(" + integer_to_roman(index + 1) + ")  " + truncData(element.itemName, 25) + " - " + element.quantity + " - " + truncData(element.remark, 25);
        if (artilceName.length < 80) {
          while (artilceName.length < 160) {
            artilceName = artilceName + " ";
          }
        }
        article.push(artilceName);
      }
      let art = "";
      article.forEach(element => {
        art += element;
      });

      data.article = art;
    }

    data.placeTime = nullToNa(
      get(state, "screenConfiguration.preparedFinalObject.eChallanDetail[0].sector", "NA")) + " " + nullToNa(
        get(state, "screenConfiguration.preparedFinalObject.eChallanDetail[0].violationTime", "NA")
      );

    let getFileStoreIdForeChallan = { [encorachmentvalue]: [data] };

    const responseEchallan = await getSearchResultsForNocCretificate([
      { key: "tenantId", value: tenant },
      { key: "applicationNumber", value: applicationNumber },
      { key: "getCertificateDataFileStoreId", value: getFileStoreIdForeChallan },
      { key: "requestUrl", value: `/pdf-service/v1/_create?key=${pdfCreateKey}&tenantId=` + tenant }
    ]);
    //http://192.168.12.116:8080

    const response_Echallan = await getSearchResultsForNocCretificateDownload([
      { key: "tenantId", value: tenant },
      { key: "challanId", value: applicationNumber },
      { key: "filestoreIds", value: get(responseEchallan, "filestoreIds[0]", "") },
      { key: "requestUrl", value: "/filestore/v1/files/url?tenantId=" + tenant + "&fileStoreIds=" }
    ]);

    httpLinkEchallan = get(response_Echallan, get(responseEchallan, "filestoreIds[0]", ""), "")

    //Object creation for NOC's
    certificateDownloadObjectEchallan = {
      label: { labelName: "CHALLAN", labelKey: "EC_CHALLAN_CERTIFICATE" },
      link: () => {
        if (httpLinkEchallan != "")
          window.location.href = httpLinkEchallan;
        //// generatePdf(state, dispatch, "certificate_download");
      },
      leftIcon: "book"
    };
    if (violatorDetails.emailId !== "") {
      sendReceiptBymail(state, dispatch, httpLinkEchallan, violatorDetails, false);
    }
  }

  downloadMenu = [
    certificateDownloadObjectEchallan
    //certificateDownloadObjectEchallan_RECEIPT
  ];

  dispatch(
    handleField(
      "summary",
      "components.div.children.headerDiv.children.header.children.downloadMenu",
      "props.data.menu",
      downloadMenu
    )
  );

  //setDownloadMenu(state, dispatch);
};

const createDemandforChallanCertificate = async (state, dispatch, tenantId) => {
  let response = await createDemandForChallan(state, dispatch, tenantId);
  let applicationNumber = get(state, 'screenConfiguration.preparedFinalObject.eChallanDetail[0].challanId', '');
  if (response) {
    response.Calculations[0].taxHeadEstimates.forEach(element => {
      if (element.taxHeadCode === 'EC_ECHALLAN_FEE' && element.estimateAmount > 0) {
        generateBill(dispatch, applicationNumber, tenantId);
      }
    });
  }

}

const titleHeader = getCommonSubHeader(
  {
    labelName: "Seized Item Detail",
    labelKey: "EC_SEARCH_PRIVIEW_SEIZED_ITEM_DETAIL",
  },
  {
    style: {
      padding: "20px",
    }
  },
  {
    classes: {
      root: "common-header-cont"
    }
  }
);

const setAuctionButtonVisibleTrueFalse = (isVisible, dispatch,appstatus) => {
  switch (appstatus) {
    case "CHALLAN ISSUED":
    case "SENT TO STORE":
    case "CLOSED":
    case "RELEASED ON GROUND":
    case "RELEASED FROM STORE":
    case "ADDED TO STORE":
      dispatch(
        handleField(
          "summary",
          "components.div.children.employeeFooter.children.auctionButton",
          "visible",
          false
        )
      );
      break;
    case "PENDING FOR AUCTION":
      if (checkForRole(roles, 'challanSM')) {
        dispatch(
          handleField(
            "summary",
            "components.div.children.employeeFooter.children.auctionButton",
            "visible",
            isVisible
          )
        );
      } else {
        dispatch(
          handleField(
            "summary",
            "components.div.children.employeeFooter.children.auctionButton",
            "visible",
            false
          )
        );
      }
      break;
  }
}

const HideshowEdit = (state, action,dispatch) => {
  let processInstanceData = get(state, "screenConfiguration.preparedFinalObject.ECHALLAN.WF.ProcessInstanceData.ProcessInstances[0]", []);
  let encroachmentType = get(state, "screenConfiguration.preparedFinalObject.eChallanDetail[0].encroachmentType", '');
  set(state, 'screenConfiguration.preparedFinalObject.WFStatus', []);

  checkVisibility(state, "SENT TO STORE", "sendtoSoreButton", action, "screenConfig.components.div.children.employeeFooter.children.sendtoSoreButton.visible", false);
  checkVisibility(state, "ADDED TO STORE", "StoreManagerAddToStoreProcess", action, "screenConfig.components.div.children.employeeFooter.children.StoreManagerAddToStoreProcess.visible", false);
  //checkVisibility(state, "SENT TO STORE", "StoreManagerHODApprovalProcess", action, "screenConfig.components.div.children.employeeFooter.children.StoreManagerHODApprovalProcess.visible", null)
  if (encroachmentType !== 'Unauthorized/Unregistered Vendor') {
    processInstanceData.action !== 'PENDING FOR AUCTION' ?
      processInstanceData.action !== 'CHALLAN ISSUED' ?
        checkVisibility(state, "CLOSED", "StoreManagerReturnandCloseProcess", action, "screenConfig.components.div.children.employeeFooter.children.StoreManagerReturnandCloseProcess.visible", false)
        : "" : "";
    processInstanceData.action === 'ADDED TO STORE' ? checkVisibility(state, "PAID", "StoreManagerReceivePaymentProcess", action, "screenConfig.components.div.children.employeeFooter.children.StoreManagerReceivePaymentProcess.visible", true) : "";
    processInstanceData.action === 'CHALLAN ISSUED' ? setOnGroundButtonVisibleTrueFalse(true, dispatch) : "";
  }



};

const setSearchResponse = async (
  state,
  dispatch,
  applicationNumber,
  tenantId,
  action
) => {
  let RequestBody = {
    searchtext: applicationNumber,
    tenantId: tenantId,
    action: '',
  }
  // const response = await getSearchResultsView([
  //   { key: "applicationNumber", value: applicationNumber }
  // ]);
  await getMdmsData(action, state, dispatch);
  const response = await getSearchResultsView(RequestBody);
  //
  if (response.ResponseBody.length > 0) {

    dispatch(prepareFinalObject("eChallanDetail", get(response, "ResponseBody", [])));

    await setCurrentApplicationProcessInstance(state, false);
    await setCurrentApplicationProcessInstance(state, true);

    let sectorval = get(state, 'screenConfiguration.preparedFinalObject.eChallanDetail[0]', []);
    let sectorValue = get(state, 'screenConfiguration.preparedFinalObject.applyScreenMdmsData.egec.sector', []);
    let __FOUND = sectorValue.find(function (sectorRecord, index) {
      if (sectorRecord.code == sectorval.sector)
        return true;
    });
    set(state, 'screenConfiguration.preparedFinalObject.eChallanDetail[0].sector', __FOUND.name);

    let encroachValue = get(state, 'screenConfiguration.preparedFinalObject.applyScreenMdmsData.egec.EncroachmentType', []);
    let __FOUNDENCROACH = encroachValue.find(function (encroachRecord, index) {
      if (encroachRecord.code == sectorval.encroachmentType)
        return true;
    });

    set(state, 'screenConfiguration.preparedFinalObject.eChallanDetail[0].encroachmentTypeName', __FOUNDENCROACH.name);
    setEncroachmentType(get(state, "screenConfiguration.preparedFinalObject.eChallanDetail[0].encroachmentType", ''));


    let processedViolationTime = sectorval.violationTime.split(':')[0] + ":" + sectorval.violationTime.split(':')[1];
    set(state, 'screenConfiguration.preparedFinalObject.eChallanDetail[0].violationTime', processedViolationTime);

    // Set Institution/Applicant info card visibility
    let formatedDate = convertEpochToDate(get(state, "screenConfiguration.preparedFinalObject.eChallanDetail[0].violationDate", new Date()));
    set(state, 'screenConfiguration.preparedFinalObject.eChallanDetail[0].violationDate', formatedDate);

    let appstatus = get(state, "screenConfiguration.preparedFinalObject.eChallanDetail[0].status", '');
    let paystatus = get(state, "screenConfiguration.preparedFinalObject.eChallanDetail[0].paymentDetails.paymentStatus", '') === 'PENDING' ? 'UNPAID' : 'PAID';
    let appnumber = get(state, "screenConfiguration.preparedFinalObject.eChallanDetail[0].challanId", '');

    dispatch(
      handleField(
        "summary",
        "components.div.children.headerDiv.children.header.children.applicationNumber",
        "props.number",
        appnumber
      )
    );

    dispatch(
      handleField(
        "summary",
        "components.div.children.headerDiv.children.header.children.applicationStatus",
        "props.status",
        "Status : " + appstatus
      )
    );
    dispatch(
      handleField(
        "summary",
        "components.div.children.headerDiv.children.header.children.paymentStatus",
        "props.status",
        "Payment Status : " +
        paystatus
      )
    );


    let encroachmentType = get(state, "screenConfiguration.preparedFinalObject.eChallanDetail[0].encroachmentType", '');
    let paymentStatus = get(state, "screenConfiguration.preparedFinalObject.eChallanDetail[0].paymentDetails.paymentStatus", 'PENDING');
    let receiveVisible = appstatus === "PENDING FOR AUCTION" ? false : paymentStatus === 'PAID' ? false : true;

    setGridVisibleTrueFalse(state, encroachmentType, appstatus, dispatch);

    setReceiveButtonVisibleTrueFalse(false, dispatch, appstatus);
    setAuctionButtonVisibleTrueFalse(false, dispatch, appstatus);
    setReturnCloseButtonVisibleTrueFalse(false, dispatch);
    setAddToStoreButtonVisibleTrueFalse(false, dispatch);
    setHodApprovalButtonVisibleTrueFalse(false, dispatch);
    setOnGroundButtonVisibleTrueFalse(false, dispatch);
    setSendtoSoreButtonVisibleTrueFalse(false, dispatch);

    HideshowEdit(state, action,dispatch);

    //setModulesVisibleTrueFalse(true, dispatch);
    prepareDocumentsView(state, dispatch);
    prepareItemSeizedDetails(state, dispatch, encroachmentType, appstatus);

    createDemandforChallanCertificate(state, dispatch, tenantId);
    setSearchResponseForNocCretificate(state, dispatch, applicationNumber, tenantId);

    let violationDate = get(state, "screenConfiguration.preparedFinalObject.eChallanDetail[0].violationDate", new Date());
    if (getDiffernceBetweenTodayDate(violationDate) > 30 && encroachmentType !== "Seizure of Vehicles") {
      setReturnCloseButtonVisibleTrueFalse(false, dispatch);
      setAddToStoreButtonVisibleTrueFalse(false, dispatch);
      setHodApprovalButtonVisibleTrueFalse(false, dispatch);
      setOnGroundButtonVisibleTrueFalse(false, dispatch);
      setSendtoSoreButtonVisibleTrueFalse(false, dispatch);
    }
  }
};


const setGridVisibleTrueFalse = (state, encroachmentType, appstatus, dispatch) => {

  //#region Visible false all Search
  dispatch(
    handleField(
      "summary",
      "components.div.children.body.children.cardContent.children.searchVehicleResultsSummary",
      "visible",
      false
    )
  );

  dispatch(
    handleField(
      "summary",
      "components.div.children.body.children.cardContent.children.searchResultsSummary",
      "visible",
      false
    )
  );

  dispatch(
    handleField(
      "summary",
      "components.div.children.body.children.cardContent.children.searchResultsSummarySM",
      "visible",
      false
    )
  );

  dispatch(
    handleField(
      "summary",
      "components.div.children.body.children.cardContent.children.searchResultsSummaryHOD",
      "visible",
      false
    )
  );
  //#region 
  let processInstanceData = get(state, "screenConfiguration.preparedFinalObject.ECHALLAN.WF.ProcessInstanceData.ProcessInstances[0]", []);
  switch (processInstanceData.action) {
    case "CHALLAN ISSUED":
    case "CITIZEN":
    case "CLOSED":
      if (encroachmentType === 'Seizure of Vehicles') {
        dispatch(
          handleField(
            "summary",
            "components.div.children.body.children.cardContent.children.searchVehicleResultsSummary",
            "visible",
            true)
        );
      } else {
        dispatch(
          handleField(
            "summary",
            "components.div.children.body.children.cardContent.children.searchResultsSummary",
            "visible",
            true)
        );
      }
      break;
    case "RELEASED ON GROUND":
    case "SENT TO STORE":
      dispatch(
        handleField(
          "summary",
          "components.div.children.body.children.cardContent.children.searchResultsSummarySM",
          "visible",
          false
        )
      );
      break;
    case "RELEASED FROM STORE":
    case "ADDED TO STORE":
    case "PENDING FOR AUCTION":
    case "PENDING FOR APPROVAL":
      dispatch(
        handleField(
          "summary",
          "components.div.children.body.children.cardContent.children.searchResultsSummaryHOD",
          "visible",
          false
        )
      );
      break;
    // case "PENDING FOR AUCTION":
    //   break;

    default:
      break;
  }
}

const screenConfig = {
  uiFramework: "material-ui",
  name: "summary",
  beforeInitScreen: (action, state, dispatch) => {
    const applicationNumber = getQueryArg(window.location.href, "applicationNumber");
    const tenantId = getQueryArg(window.location.href, "tenantId");
    dispatch(fetchLocalizationLabel(getLocale(), tenantId, tenantId));
    set(state, 'form.apply_Violator_Image.files.echallanViolaterImage', []);
    set(state, 'form.apply_Violator_ID_PROOF.files.echallanViolaterIDProofImage', []);
    set(state, 'form.apply_Violations_Image.files.echallanViolationImage', []);

    setSearchResponse(state, dispatch, applicationNumber, tenantId, action);
    // Hide edit buttons
    setEditVisibleTrueFalse(action)

    return action;
  },
  components: {
    div: {
      uiFramework: "custom-atoms",
      componentPath: "Div",
      props: {
        className: "common-div-css"
      },
      children: {
        headerDiv: {
          uiFramework: "custom-atoms",
          componentPath: "Container",
          children: {
            header: {
              gridDefination: {
                xs: 12,
                sm: 12
              },
              ...titlebar
            }
          }
        },
        stepper,

        body: getCommonCard({
          estimateSummary: estimateSummary,
          violationsSummary: violationsSummary,
          titleHeader: titleHeader,
          searchResultsSummary: searchResultsSummary,
          searchVehicleResultsSummary: searchVehicleResultsSummary,
          violatorSummary: violatorSummary,
          documentsSummary: documentsSummary

        }),
        break: getBreak(),
        //titlebarfooter,
        employeeFooter: footer,
        takeactionfooter,
      }
    }
  }
};

export default screenConfig;
