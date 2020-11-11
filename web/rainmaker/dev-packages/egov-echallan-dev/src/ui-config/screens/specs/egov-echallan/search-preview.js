import {
  getBreak, getCommonCard,
  getCommonContainer,
  getCommonHeader,
  getStepperObject, getLabel, getCommonSubHeader,
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import { handleScreenConfigurationFieldChange as handleField, prepareFinalObject, toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getFileUrlFromAPI, getQueryArg } from "egov-ui-framework/ui-utils/commons";
import { fetchLocalizationLabel } from "egov-ui-kit/redux/app/actions";
import jp from "jsonpath";
import get from "lodash/get";
import set from "lodash/set";
import { searchBill, generateBill, createDemandForChallan, numWords, getTextToLocalMapping, getDiffernceBetweenTodayDate, checkForRole, generateReceiptNumber, getTextToLocalMappingChallanSummary, fetchRoleCode, convertEpochToDate, getMdmsEncroachmentSectorData, truncData, integer_to_roman } from "../utils/index";
import { violatorSummary } from "./summaryResource/violatorSummary";
import { violationsSummary } from "./summaryResource/violationsSummary";
import { documentsSummary } from "./summaryResource/documentsSummary";
import { estimateSummary } from "./summaryResource/estimateSummary";
import { searchResultsSummary, serachResultGridSM, searchResultsSummaryHOD, searchVehicleResultsSummary } from "./summaryResource/summaryGrid";
import { footer, takeactionfooter } from "./summaryResource/footer";
import { titlebarfooter } from "./summaryResource/citizenFooter";
import { getSearchResultsView, getSearchResultsForNocCretificate, getSearchResultsForNocCretificateDownload, fetchStoreItemHODMasterChallanData, fetchMdmsData, setCurrentApplicationProcessInstance, checkVisibility } from "../../../../ui-utils/commons";
import { setEncroachmentType, getAccessToken, setapplicationType, getTenantId, getLocale, getUserInfo, localStorageGet, localStorageSet, setapplicationNumber } from "egov-ui-kit/utils/localStorageUtils";
import store from "ui-redux/store";
import "./index.css";
import { adhocPopupReceivePayment, adhocPopupStockViolationForwardHOD, challanDeletionPopup, returnAndCloseConfirmationPopup } from "./payResource/adhocPopup";

let roles = JSON.parse(getUserInfo()).roles;

//alert('CITIZEN');
const hasButton = getQueryArg(window.location.href, "hasButton");
let enableButton = true;
enableButton = hasButton && hasButton === "false" ? false : true;

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

const titlebar = getCommonContainer({
  header: getCommonHeader({
    labelName: "View Challan ",
    labelKey: "EC_CHALLAN_NUMBER"
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
      status: "Status : " + ""
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
    },
    roleDefination: {
      rolePath: "user-info.roles",
      roles: ["challanSM", "challanSI", "CITIZEN"],
    },

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
  if (eChallanDocs[0].documentUuid !== null) {
    eChallanDocs.forEach(element => {
      let docType = element.documentType.search('-') !== -1 ? element.documentType.split('-')[0].trim() : element.documentType
      documentsPreview.push({
        title: getTextToLocalMapping("EC_" + docType),
        fileStoreId: element.fileStoreId,
        linkText: "Download"
      })
    });
  }

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
                "search-preview",
                "components.div.children.body.children.cardContent.children.searchVehicleResultsSummary",
                "props.data",
                siarray
              )
            );
          } else {
            dispatch(
              handleField(
                "search-preview",
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
              "search-preview",
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
              "search-preview",
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

const setAuctionButtonVisibleTrueFalse = (isVisible, dispatch, appstatus) => {
  switch (appstatus) {
    case "CHALLAN ISSUED":
    case "SENT TO STORE":
    case "CLOSED":
    case "RELEASED ON GROUND":
    case "RELEASED FROM STORE":
    case "ADDED TO STORE":
      dispatch(
        handleField(
          "search-preview",
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
            "search-preview",
            "components.div.children.employeeFooter.children.auctionButton",
            "visible",
            isVisible
          )
        );
      } else {
        dispatch(
          handleField(
            "search-preview",
            "components.div.children.employeeFooter.children.auctionButton",
            "visible",
            false
          )
        );
      }
      break;
  }
}
const setReceiveButtonVisibleTrueFalse = (isVisible, dispatch, appstatus) => {
  switch (appstatus) {
    case "CHALLAN ISSUED":
    case "SENT TO STORE":
    case "CLOSED":
    case "RELEASED ON GROUND":
    case "RELEASED FROM STORE":
      dispatch(
        handleField(
          "search-preview",
          "components.div.children.employeeFooter.children.StoreManagerReceivePaymentProcess",
          "visible",
          false
        )
      );
      break;
    case "ADDED TO STORE":
      if (checkForRole(roles, 'challanSM')) {
        dispatch(
          handleField(
            "search-preview",
            "components.div.children.employeeFooter.children.StoreManagerReceivePaymentProcess",
            "visible",
            isVisible
          )
        );
      } else {
        dispatch(
          handleField(
            "search-preview",
            "components.div.children.employeeFooter.children.StoreManagerReceivePaymentProcess",
            "visible",
            false
          )
        );

      }
      break;
    case "PENDING FOR AUCTION":
      dispatch(
        handleField(
          "search-preview",
          "components.div.children.employeeFooter.children.StoreManagerReceivePaymentProcess",
          "visible",
          false
        )
      );
      break;

  }

  dispatch(
    handleField(
      "search-preview",
      "components.div.children.citizenFooter.children.submitButton",
      "visible",
      (appstatus === 'RELEASED FROM STORE' || appstatus === 'RELEASED ON GROUND' || appstatus === 'CLOSED') ? false : isVisible

    )
  );
}

const setReturnCloseButtonVisibleTrueFalse = (isVisible, dispatch) => {
  dispatch(
    handleField(
      "search-preview",
      "components.div.children.employeeFooter.children.StoreManagerReturnandCloseProcess",
      "visible",
      checkForRole(roles, 'challanSM') ? isVisible ? true : false : false
    )
  );
}

const setAddToStoreButtonVisibleTrueFalse = (isVisible, dispatch) => {
  dispatch(
    handleField(
      "search-preview",
      "components.div.children.employeeFooter.children.StoreManagerAddToStoreProcess",
      "visible",
      checkForRole(roles, 'challanSM') ? isVisible ? true : false : false
    )
  );
}

const setHodApprovalButtonVisibleTrueFalse = (isVisible, dispatch) => {
  dispatch(
    handleField(
      "search-preview",
      "components.div.children.employeeFooter.children.StoreManagerHODApprovalProcess",
      "visible",
      false //isVisible //changed since the requirement is changed
    )
  );
}

const setOnGroundButtonVisibleTrueFalse = (isVisible, dispatch) => {
  dispatch(
    handleField(
      "search-preview",
      "components.div.children.employeeFooter.children.onGroundPaymentButton",
      "visible",
      checkForRole(roles, 'challanSI') ? isVisible ? true : false : false
    )
  );
}

const setSendtoSoreButtonVisibleTrueFalse = (isVisible, dispatch) => {
  dispatch(
    handleField(
      "search-preview",
      "components.div.children.employeeFooter.children.sendtoSoreButton",
      "visible",
      checkForRole(roles, 'challanSI') ? isVisible ? true : false : false
    )
  );
}

const setGridVisibleTrueFalse = (state, encroachmentType, appstatus, dispatch) => {

  //#region Visible false all Search
  dispatch(
    handleField(
      "search-preview",
      "components.div.children.body.children.cardContent.children.searchVehicleResultsSummary",
      "visible",
      false
    )
  );

  dispatch(
    handleField(
      "search-preview",
      "components.div.children.body.children.cardContent.children.searchResultsSummary",
      "visible",
      false
    )
  );

  dispatch(
    handleField(
      "search-preview",
      "components.div.children.body.children.cardContent.children.searchResultsSummarySM",
      "visible",
      false
    )
  );

  dispatch(
    handleField(
      "search-preview",
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
            "search-preview",
            "components.div.children.body.children.cardContent.children.searchVehicleResultsSummary",
            "visible",
            true)
        );
      } else {
        dispatch(
          handleField(
            "search-preview",
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
          "search-preview",
          "components.div.children.body.children.cardContent.children.searchResultsSummarySM",
          "visible",
          true
        )
      );
      break;
    case "RELEASED FROM STORE":
    case "ADDED TO STORE":
    case "PENDING FOR AUCTION":
    case "PENDING FOR APPROVAL":
      dispatch(
        handleField(
          "search-preview",
          "components.div.children.body.children.cardContent.children.searchResultsSummaryHOD",
          "visible",
          true
        )
      );
      break;
    // case "PENDING FOR AUCTION":
    //   break;

    default:
      break;
  }
}

const setModulesVisibleTrueFalse = (isVisible, dispatch) => {
  dispatch(
    handleField(
      "search-preview",
      "components.div.children.body.children.cardContent.children.estimateSummary",
      "visible",
      isVisible
    )
  );

  dispatch(
    handleField(
      "search-preview",
      "components.div.children.body.children.cardContent.children.violationsSummary",
      "visible",
      isVisible
    )
  );

  dispatch(
    handleField(
      "search-preview",
      "components.div.children.body.children.cardContent.children.violatorSummary",
      "visible",
      isVisible
    )
  );

  dispatch(
    handleField(
      "search-preview",
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

const HideshowEdit = (state, action, dispatch) => {
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
    processInstanceData.action === 'CHALLAN ISSUED' ?
      setOnGroundButtonVisibleTrueFalse(true, dispatch) : "";
  }
  if (processInstanceData.action === 'PENDING FOR AUCTION') {
    dispatch(
      handleField(
        "search-preview",
        "components.div.children.employeeFooter.children.auctionButton",
        "visible",
        true
      )
    );
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
  await getMdmsEncroachmentSectorData(action, state, dispatch);
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
        "search-preview",
        "components.div.children.headerDiv.children.header.children.applicationNumber",
        "props.number",
        appnumber
      )
    );

    dispatch(
      handleField(
        "search-preview",
        "components.div.children.headerDiv.children.header.children.applicationStatus",
        "props.status",
        "Status : " + appstatus
      )
    );
    dispatch(
      handleField(
        "search-preview",
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

    setReceiveButtonVisibleTrueFalse(receiveVisible, dispatch, appstatus);
    setAuctionButtonVisibleTrueFalse(false, dispatch, appstatus);
    setReturnCloseButtonVisibleTrueFalse(false, dispatch);
    setAddToStoreButtonVisibleTrueFalse(false, dispatch);
    setHodApprovalButtonVisibleTrueFalse(false, dispatch);
    setOnGroundButtonVisibleTrueFalse(false, dispatch);
    setSendtoSoreButtonVisibleTrueFalse(false, dispatch);

    HideshowEdit(state, action, dispatch);

    setModulesVisibleTrueFalse(true, dispatch);
    prepareDocumentsView(state, dispatch);
    prepareItemSeizedDetails(state, dispatch, encroachmentType, appstatus);

    await createDemandforChallanCertificate(state, dispatch, tenantId);
    if (checkForRole(roles, 'challanSM') || checkForRole(roles, 'challanSI') || checkForRole(roles, 'CITIZEN')) {
      setSearchResponseForNocCretificate(state, dispatch, applicationNumber, tenantId);
    }

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

let httpLinkChallan;
let httpLinkChallan_RECEIPT;

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
  let challanCertificateDownloadObj_RECEIPT = {};
  let challanCertificateDownloadObj = {};
  let nocRemarks = get(state, "screenConfiguration.preparedFinalObject.eChallanDetail[0].status", {});
  let paymentStatus = get(state, "screenConfiguration.preparedFinalObject.eChallanDetail[0].paymentDetails.paymentStatus", {});
  let encorachmentvalue = '';
  let pdfCreateKey = '';
  let tenant = tenantId.length > 2 ? tenantId.split('.')[0] : tenantId;

  let encroachValue = get(state, 'screenConfiguration.preparedFinalObject.applyScreenMdmsData.egec.EncroachmentType', []);
  let violationEncroached = get(state, "screenConfiguration.preparedFinalObject.eChallanDetail[0].encroachmentType", "NA")

  let __FOUNDENCROACH = encroachValue.find(function (encroachRecord, index) {
    if (encroachRecord.code == violationEncroached)
      return true;
  });

  if (nocRemarks !== "") {
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

    let getFileStoreIdForChallan = { [encorachmentvalue]: [data] };

    const response1GenerateChallan = await getSearchResultsForNocCretificate([
      { key: "tenantId", value: tenant },
      { key: "applicationNumber", value: applicationNumber },
      { key: "getCertificateDataFileStoreId", value: getFileStoreIdForChallan },
      { key: "requestUrl", value: `/pdf-service/v1/_create?key=${pdfCreateKey}&tenantId=` + tenant }
    ]);
    //http://192.168.12.116:8080

    const response_echallan = await getSearchResultsForNocCretificateDownload([
      { key: "tenantId", value: tenant },
      { key: "challanId", value: applicationNumber },
      { key: "filestoreIds", value: get(response1GenerateChallan, "filestoreIds[0]", "") },
      { key: "requestUrl", value: "/filestore/v1/files/url?tenantId=" + tenant + "&fileStoreIds=" }
    ]);

    httpLinkChallan = get(response_echallan, get(response1GenerateChallan, "filestoreIds[0]", ""), "")

    //Object creation for NOC's
    challanCertificateDownloadObj = {
      label: { labelName: "CHALLAN", labelKey: "EC_CHALLAN_CERTIFICATE" },
      link: () => {
        if (httpLinkChallan != "")
          window.location.href = httpLinkChallan;
        //// generatePdf(state, dispatch, "certificate_download");
      },
      leftIcon: "book"
    };

  }
  if (paymentStatus === 'PAID') {
    let violatorDetails = get(state, 'screenConfiguration.preparedFinalObject.eChallanDetail[0]', []);
    let paydetails = get(state, 'screenConfiguration.preparedFinalObject.ReceiptTemp[0].Bill[0].billDetails[0].billAccountDetails', []);
    let numbertowords = numWords(violatorDetails.totalChallanAmount) + ' ' + 'only'
    //NOC_Receipts
    let paymentdata = {
      "receiptNo": generateReceiptNumber(violatorDetails.challanId),
      "dated": convertEpochToDate(violatorDetails.paymentDetails.lastModifiedTime),
      "violatorName": violatorDetails.violatorName, // get(state, 'screenConfiguration.preparedFinalObject.echallanDetail.violatorName', ''),
      "amount": violatorDetails.totalChallanAmount, //get(state, 'screenConfiguration.preparedFinalObject.echallanDetail.challanAmount', '0'),
      "amountInWord": numbertowords,
      "paymentMode": violatorDetails.paymentDetails.paymentMode,
      "memoNo": violatorDetails.challanId,
      "fineAmount": violatorDetails.challanAmount,//paydetails[0].taxHeadCode === 'EC_ECHALLAN_FEE' ? paydetails[0].amount : paydetails[1].amount,
      "storageAmount": violatorDetails.penaltyAmount, //paydetails[1].taxHeadCode === 'EC_ECHALLAN_PENALTY' ? paydetails[1].amount : paydetails[0].amount,
      //"smName" : nullToNa(JSON.parse(getUserInfo()).name, 'NA')
    }

    let getFileStoreIdFor_RECEIPT = { "paymentEchallan": [paymentdata] }

    let pdfCreateKey = "challanReceipt-ec";
    if (violatorDetails.encroachmentType === "Seizure of Vehicles") {
      pdfCreateKey = "challanReceiptVehicle-ec"
    }

    const response1_RECEIPT = await getSearchResultsForNocCretificate([
      { key: "tenantId", value: tenantId },
      { key: "applicationNumber", value: applicationNumber },
      { key: "getCertificateDataFileStoreId", value: getFileStoreIdFor_RECEIPT },
      { key: "requestUrl", value: `/pdf-service/v1/_create?key=${pdfCreateKey}&tenantId=` + tenantId }
    ]);

    const response2_RECEIPT = await getSearchResultsForNocCretificateDownload([
      { key: "tenantId", value: tenantId },
      { key: "applicationNumber", value: applicationNumber },
      { key: "filestoreIds", value: get(response1_RECEIPT, "filestoreIds[0]", "") },
      { key: "requestUrl", value: "/filestore/v1/files/url?tenantId=" + tenantId + "&fileStoreIds=" }
    ]);

    let httpLink_RECEIPT = get(response2_RECEIPT, get(response1_RECEIPT, "filestoreIds[0]", ""), "")
    //window.open(httpLink_RECEIPT,  "_blank");
    challanCertificateDownloadObj_RECEIPT = {
      label: { labelName: "CHALLAN RECEIPT", labelKey: "EC_CHALLAN_RECEIPT" },
      link: () => {
        if (httpLink_RECEIPT != "")
          window.location.href = httpLink_RECEIPT;
        //// generatePdf(state, dispatch, "certificate_download");
      },
      leftIcon: "book"
    };
  }
  let isassigned = false;

  if (!isassigned && challanCertificateDownloadObj_RECEIPT.label !== undefined && challanCertificateDownloadObj.label !== undefined) {
    isassigned = true;
    downloadMenu = [
      challanCertificateDownloadObj,
      challanCertificateDownloadObj_RECEIPT
    ];
  } else if (!isassigned && challanCertificateDownloadObj_RECEIPT.label !== undefined) {
    isassigned = true;
    downloadMenu = [
      challanCertificateDownloadObj,
      challanCertificateDownloadObj_RECEIPT
    ];
  } else if (!isassigned && challanCertificateDownloadObj.label !== undefined) {
    isassigned = true;
    downloadMenu = [
      challanCertificateDownloadObj,
    ];
  }

  dispatch(
    handleField(
      "search-preview",
      "components.div.children.headerDiv.children.header.children.downloadMenu",
      "props.data.menu",
      downloadMenu
    )
  );

  //setDownloadMenu(state, dispatch);
};

const createDemandforChallanCertificate = async (state, dispatch, tenantId) => {

  let applicationNumber = get(state, 'screenConfiguration.preparedFinalObject.eChallanDetail[0].challanId', '');
    let response = await createDemandForChallan(state, dispatch, tenantId);
    let paymentStatus = get(state, "screenConfiguration.preparedFinalObject.eChallanDetail[0].paymentDetails.paymentStatus", 'PENDING');
    if (response) {
      response.Calculations[0].taxHeadEstimates.forEach(element => {
        if (element.taxHeadCode === 'EC_ECHALLAN_FEE' && element.estimateAmount > 0) {
          searchBill(dispatch, applicationNumber, tenantId, paymentStatus);
          //generateBill(dispatch, applicationNumber, getTenantId());
        }
      });
    }
}


const screenConfig = {
  uiFramework: "material-ui",
  name: "search-preview",
  beforeInitScreen: (action, state, dispatch) => {
    const applicationNumber = getQueryArg(window.location.href, "applicationNumber");
    const tenantId = getQueryArg(window.location.href, "tenantId");
    setapplicationType("egov-echallan");
    dispatch(fetchLocalizationLabel(getLocale(), tenantId, tenantId));

    //searchBill(dispatch, applicationNumber, tenantId);
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
        body: getCommonCard({
          estimateSummary: estimateSummary,
          violationsSummary: violationsSummary,
          titleHeader: titleHeader,
          searchResultsSummary: searchResultsSummary,
          searchVehicleResultsSummary: searchVehicleResultsSummary,
          searchResultsSummarySM: serachResultGridSM,
          searchResultsSummaryHOD: searchResultsSummaryHOD,
          violatorSummary: violatorSummary,
          documentsSummary: documentsSummary
        }),
        break: getBreak(),
        citizenFooter:
          process.env.REACT_APP_NAME === "Citizen" ? titlebarfooter : {},
        employeeFooter:
          process.env.REACT_APP_NAME === "Employee" ? footer : {},
        employeeTakeActionFooter:
          process.env.REACT_APP_NAME === "Employee" ? takeactionfooter : {},

      }
    },
    receivePayment: {
      uiFramework: "custom-containers-local",
      moduleName: "egov-echallan",
      componentPath: "DialogContainer",
      props: {
        open: false,
        maxWidth: "sm",
        screenKey: "search-preview"
      },
      children: {
        popup: adhocPopupReceivePayment
      },
      visible: true
    },
    forwardViolation: {
      uiFramework: "custom-containers-local",
      moduleName: "egov-echallan",
      componentPath: "ForwardContainer",
      props: {
        open: false,
        maxWidth: "sm",
        screenKey: "search-preview"
      },
      children: {
        popup: adhocPopupStockViolationForwardHOD
      }
    },
    deleteConfirmation: {
      uiFramework: "custom-containers-local",
      moduleName: "egov-echallan",
      componentPath: "DeleteConfirmationContainer",
      props: {
        open: false,
        maxWidth: "sm",
        screenKey: "search-preview"
      },
      children: {
        popup: challanDeletionPopup
      },
      visible: true
    },
    returnConfirmation: {
      uiFramework: "custom-containers-local",
      moduleName: "egov-echallan",
      componentPath: "ReturnCloseConfirmationContainer",
      props: {
        open: false,
        maxWidth: "sm",
        screenKey: "search-preview"
      },
      children: {
        popup: returnAndCloseConfirmationPopup
      },
      visible: true
    }
  }
};

export default screenConfig;
