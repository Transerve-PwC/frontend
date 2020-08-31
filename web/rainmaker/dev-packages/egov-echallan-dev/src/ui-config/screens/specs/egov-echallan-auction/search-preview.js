import {
  getBreak, getCommonCard,
  getCommonContainer,
  getCommonHeader,
  getLabelWithValue,
  getStepperObject, getLabel,
  getCommonGrayCard,
  getCommonSubHeader,
  convertEpochToDate
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import { handleScreenConfigurationFieldChange as handleField, prepareFinalObject, toggleSnackbar, toggleSpinner } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getFileUrlFromAPI, getQueryArg, getTransformedLocale, setBusinessServiceDataToLocalStorage } from "egov-ui-framework/ui-utils/commons";
import { fetchLocalizationLabel } from "egov-ui-kit/redux/app/actions";
import jp from "jsonpath";
import get from "lodash/get";
import set from "lodash/set";
import { httpRequest } from "../../../../ui-utils";
import { violatorSummary } from "./summaryResource/violatorSummary";
import { violationsSummary } from "./summaryResource/violationsSummary";
import { documentsSummary } from "./summaryResource/documentsSummary";
import { searchResultsSummary, searchResultsSummaryHOD } from "./summaryResource/summaryGrid";
import {
  getSearchResultsView, fetchStoreItemHODMasterChallanData, fetchauctionHODMasterChallanData, findItemInArrayOfObject, approverejectAuctionDetails, fetchMdmsData, fetchMasterChallanHODAuction,
  setCurrentApplicationProcessInstance, checkVisibility
} from "../../../../ui-utils/commons";
import { setEncroachmentType, setapplicationType, getTenantId, getLocale, getUserInfo, localStorageGet, localStorageSet, setapplicationNumber } from "egov-ui-kit/utils/localStorageUtils";
import { AuctionGridHistoryDetails } from "./auctionHistory/serachResultGrid"
import { searchResultApiResponseViewHistory } from "./searchResource/searchResultApiResponse"
import { getTextToLocalMapping, checkForRole, fetchRoleCode, getMdmsEncroachmentSectorData, truncData } from "../utils";
import { showHideAdhocPopupAuction } from "../utils/index";
import { titlebarfooter, takeactionfooter } from "./footer/footer";
import { adhocPopup } from "./Popup/addPopup";

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
    labelName: "Apply New Permision for Advertisement ",
    labelKey: "EC_CHALLAN_NUMBER"
  }),
  applicationNumber: {
    uiFramework: "custom-atoms-local",
    moduleName: "egov-echallan",
    componentPath: "ApplicationNoContainer",
    props: {
      number: ""
    }
  },
  applicationStatus: {
    uiFramework: "custom-atoms-local",
    moduleName: "egov-echallan",
    componentPath: "ApplicationStatusContainer",
    props: {
      status: "Status : "
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
      //"EC_" + element.documentType.split('-')[0].trim();
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


const prepareItemSeizedDetails = async (state, dispatch, appstatus) => {
  // Get all documents from response

  let challanDetail = get(
    state, "screenConfiguration.preparedFinalObject.eChallanDetail[0]", {}
  );

  let AuctionDetail = get(
    state, "screenConfiguration.preparedFinalObject.eChallanAuctionDet[0]", {}
  );

  let SeizedItemDetailList = get(
    state, "screenConfiguration.preparedFinalObject.eChallanDetail[0].violationItem", {}
  );

  let dataarray = [];
  let showstoredDetails = false;
  let showauctionDetails = false;

  if (appstatus === 'PENDING FOR AUCTION' && checkForRole(roles, 'challanSM')) {
    showstoredDetails = true;
  }
  if (appstatus === 'PENDING FOR APPROVAL' && checkForRole(roles, 'challanHOD')) {
    showauctionDetails = true;
  }

  if (showstoredDetails) {
    let requestBody = {
      "tenantId": getTenantId(),
      "action": "",
      "offset": 1,
      "limit": -1,
      "orderDir": "DESC",
      "orderColumn": "",
      "searchText": challanDetail.challanUuid
    }

    let response = await fetchStoreItemHODMasterChallanData(requestBody);


    for (let storedItemIndex = 0; storedItemIndex < response.length; storedItemIndex++) {
      const item = response[storedItemIndex];
      for (let seizedItemList = 0; seizedItemList < SeizedItemDetailList.length; seizedItemList++) {
        const element = SeizedItemDetailList[seizedItemList];
        let temp = [];
        //if (item['itemName'] === element['itemName']) {
        if (item['violationItemUuid'] === element['violationItemUuid']) {
          //let defectqty = parseInt(item['quantity']) - parseInt(item['auctionedQuantity']);
          let intactQty = parseInt(item['quantity']) - parseInt(item['auctionedQuantity']);
          temp[0] = truncData(item['itemName'], 25);
          temp[1] = element['quantity'];
          temp[2] = element['remark'];
          temp[3] = item['quantity'];
          temp[4] = intactQty; //item['damagedQuantity'];
          temp[5] = item['remark'];
          temp[6] = item['isVerified'];
          temp[7] = item['isAuctioned'];
          temp[8] = item['isReturned'];
          temp[9] = item['violationItemUuid'];
          temp[10] = item['violationUuid'];

          dataarray.push(temp);
        }
      }
    }

  } else if (showauctionDetails) {
    let requestBody = {
      "tenantId": getTenantId(),
      "action": "",
      "offset": 1,
      "limit": -1,
      "orderDir": "DESC",
      "orderColumn": "",
      "searchText": challanDetail.challanUuid,
      "challanUuid": challanDetail.challanUuid
    }

    let approverejectList = [];
    let storeresponse = await fetchStoreItemHODMasterChallanData(requestBody);
    let Wauctionresponse = await fetchauctionHODMasterChallanData(requestBody);
    let auctionresponse = [];

    Wauctionresponse.find(function (auctionRecord, index) {

      if (auctionRecord.auctionUuid === AuctionDetail.auctionUuid) {
        auctionresponse.push(auctionRecord);
        //return true;
      }
    });

    for (let auctionIndex = 0; auctionIndex < auctionresponse.length; auctionIndex++) {
      const auctionelement = auctionresponse[auctionIndex];
      if (auctionelement.status === 'PENDING') //PENDING FOR APPROVAL
      {
        for (let index = 0; index < storeresponse.length; index++) {
          const storeelement = storeresponse[index];
          if (auctionelement.storeItemUuid === storeelement.storeItemUuid) {
            for (let index = 0; index < SeizedItemDetailList.length; index++) {
              const seizedelement = SeizedItemDetailList[index];
              if (storeelement.violationItemUuid === seizedelement.violationItemUuid) {
                let temp = [];
                temp[0] = truncData(storeelement['itemName'], 25);
                temp[1] = seizedelement['quantity'].toString();
                temp[2] = storeelement['quantity'].toString();
                temp[3] = auctionelement['auctionDate'] === null ? '' : auctionelement['auctionDate'];
                temp[4] = auctionelement['purchaserName'].toString();
                temp[5] = auctionelement['purchaserContactNo'] === null ? '' : auctionelement['purchaserContactNo'].toString();
                temp[6] = auctionelement['auctionQuantity'] === null ? '' : auctionelement['auctionQuantity'].toString();
                temp[7] = auctionelement['auctionAmount'] === null ? '' : auctionelement['auctionAmount'].toString();
                dataarray.push(temp);
                let approjectTemp = {
                  auctionQuantity: auctionelement['auctionQuantity'] === null ? 0 : auctionelement['auctionQuantity'],
                  storeItemUuid: auctionelement['storeItemUuid'],
                  auctionUuid: auctionelement['auctionUuid']
                }
                approverejectList.push(approjectTemp);
              }
            }
          }
        }
      }
    }
    dispatch(prepareFinalObject('auctionapproverejectlist', approverejectList));

  }
  dispatch(prepareFinalObject('eChallanSMSeizedList', dataarray));

  setGridVisibleTrueFalse(appstatus, dispatch);
  setGridDatabasedOnRole(appstatus, dataarray, dispatch);

  dispatch(
    handleField(
      "search-preview",
      "components.div.children.body.children.cardContent.children.searchResultsSummary",
      "props.data",
      dataarray
    )
  );

}

const setGridVisibleTrueFalse = (appstatus, dispatch) => {
  dispatch(
    handleField(
      "search-preview",
      "components.div.children.body.children.cardContent.children.searchResultsSummary",
      "visible", false
    )
  );
  dispatch(
    handleField(
      "search-preview",
      "components.div.children.body.children.cardContent.children.searchResultsSummaryHOD",
      "visible", false
    )
  );

  if (appstatus === 'PENDING FOR APPROVAL' && checkForRole(roles, 'challanHOD')) {
    dispatch(
      handleField(
        "search-preview",
        "components.div.children.body.children.cardContent.children.searchResultsSummary",
        "visible", true
      )
    );
  } else if (appstatus === 'PENDING FOR AUCTION' && checkForRole(roles, 'challanSM')) {
    dispatch(
      handleField(
        "search-preview",
        "components.div.children.body.children.cardContent.children.searchResultsSummaryHOD",
        "visible", true
      )
    );
  }
}

const setGridDatabasedOnRole = (appstatus, dataarray, dispatch) => {

  dispatch(
    handleField(
      "search-preview",
      "components.div.children.body.children.cardContent.children.searchResultsSummary",
      "props.data", []
    )
  );
  dispatch(
    handleField(
      "search-preview",
      "components.div.children.body.children.cardContent.children.searchResultsSummaryHOD",
      "props.data", []
    )
  );

  if (appstatus === 'PENDING FOR APPROVAL' && checkForRole(roles, 'challanHOD')) {
    dispatch(
      handleField(
        "search-preview",
        "components.div.children.body.children.cardContent.children.searchResultsSummary",
        "props.data", dataarray
      )
    );
  } else if (appstatus === 'PENDING FOR AUCTION' && checkForRole(roles, 'challanSM')) {
    dispatch(
      handleField(
        "search-preview",
        "components.div.children.body.children.cardContent.children.searchResultsSummaryHOD",
        "props.data", dataarray
      )
    );
  }
}

const setModulesVisibleTrueFalse = (isVisible, dispatch) => {
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

const setAuctionButtonVisibleTrueFalse = (isVisible, dispatch) => {
  dispatch(
    handleField(
      "search-preview",
      "components.div.children.employeeFooter.children.submitButton",
      "visible",
      checkForRole(roles, 'challanSM') ? isVisible ? true : false : false
    )
  );
}

const setApproveButtonVisibleTrueFalse = (isVisible, dispatch) => {
  dispatch(
    handleField(
      "search-preview",
      "components.div.children.employeeFooter.children.approveButton",
      "visible",
      checkForRole(roles, 'challanHOD') ? isVisible ? true : false : false
    )
  );
}

const setRejectButtonVisibleTrueFalse = (isVisible, dispatch) => {
  dispatch(
    handleField(
      "search-preview",
      "components.div.children.employeeFooter.children.rejectButton",
      "visible",
      checkForRole(roles, 'challanHOD') ? isVisible ? true : false : false
    )
  );
}

const setSearchResponse = async (
  state,
  dispatch,
  tenantId,
  action
) => {

  await getMdmsEncroachmentSectorData(action, state, dispatch);
  let auctionUuid = getQueryArg(window.location.href, "applicationNumber") !== null ? getQueryArg(window.location.href, "applicationNumber") : "";
  let challanUuid = getQueryArg(window.location.href, "challanNumber");

  let requestBody = {
    auctionUuid: auctionUuid,
    tenantId: tenantId,
    action: '',
  }
  let response = auctionUuid !== "" ? await fetchMasterChallanHODAuction(requestBody) : "";

  if (response !== "" && response.ResponseBody.length > 0) {

    dispatch(prepareFinalObject("eChallanAuctionDet", get(response, "ResponseBody", [])));
    //68f93cf6-558f-469f-be38-77a00e4a3de7
    challanUuid = response.ResponseBody[0].challanUuid
    await setCurrentApplicationProcessInstance(state, false);
  }

  let RequestBody = {
    searchtext: challanUuid,
    tenantId: tenantId,
    action: '',
  }

  response = await getSearchResultsView(RequestBody);


  //
  dispatch(prepareFinalObject("eChallanDetail", get(response, "ResponseBody", [])));
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

  let formatedDate = convertEpochToDate(get(state, "screenConfiguration.preparedFinalObject.eChallanDetail[0].violationDate", new Date()));
  set(state, 'screenConfiguration.preparedFinalObject.eChallanDetail[0].violationDate', formatedDate);

  let processedViolationTime = sectorval.violationTime.split(':')[0] + ":" + sectorval.violationTime.split(':')[1];
  set(state, 'screenConfiguration.preparedFinalObject.eChallanDetail[0].violationTime', processedViolationTime);

  let appstatus = auctionUuid === '' ? get(state, "screenConfiguration.preparedFinalObject.eChallanDetail[0].status", '') : 'PENDING FOR APPROVAL';
  let paystatus = get(state, "screenConfiguration.preparedFinalObject.eChallanDetail[0].paymentDetails.paymentStatus", '') === 'PENDING' ? 'UNPAID' : 'PAID';
  let appnumber = get(state, "screenConfiguration.preparedFinalObject.eChallanDetail[0].challanId", '');

  let isVisible = auctionUuid === '' ? true : false;

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


  setEncroachmentType(get(state, "screenConfiguration.preparedFinalObject.eChallanDetail[0].encroachmentType", ''));

  setModulesVisibleTrueFalse(true, dispatch);
  setAuctionButtonVisibleTrueFalse(isVisible, dispatch);
  setApproveButtonVisibleTrueFalse(false, dispatch);
  setRejectButtonVisibleTrueFalse(false, dispatch);

  checkVisibility(state, "APPROVE", "approveButton", action, "screenConfig.components.div.children.employeeFooter.children.approveButton.visible", false);
  checkVisibility(state, "REJECT", "rejectButton", action, "screenConfig.components.div.children.employeeFooter.children.rejectButton.visible", false);



  prepareDocumentsView(state, dispatch);
  prepareItemSeizedDetails(state, dispatch, appstatus);
  searchResultApiResponseViewHistory(dispatch, challanUuid, tenantId);

};

const screenConfig = {
  uiFramework: "material-ui",
  name: "search-preview",
  beforeInitScreen: (action, state, dispatch) => {
    const tenantId = getQueryArg(window.location.href, "tenantId");
    dispatch(fetchLocalizationLabel(getLocale(), tenantId, tenantId));
    setapplicationType('eAuction');

    setSearchResponse(state, dispatch, tenantId, action);
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
              // gridDefination: {
              //   xs: 12,
              //   sm: 10
              // },
              ...titlebar
            }
          }
        },
        body: getCommonCard({
          violationsSummary: violationsSummary,
          titleHeader: titleHeader,
          searchResultsSummary: searchResultsSummary,
          searchResultsSummaryHOD: searchResultsSummaryHOD,
          violatorSummary: violatorSummary,
          documentsSummary: documentsSummary
        }),
        break: getBreak(),
        employeeFooter:
          process.env.REACT_APP_NAME === "Employee" ? titlebarfooter : {},
        employeeTakeActionFooter:
          process.env.REACT_APP_NAME === "Employee" ? takeactionfooter : {},
      }
    },
    adhocDialog: {
      uiFramework: "custom-containers-local",
      moduleName: "egov-echallan",
      componentPath: "PopupContainer",
      props: {
        open: false,
        maxWidth: "xl",
        screenKey: "search-preview"
      },
      div1: {
        uiFramework: "custom-atoms",
        componentPath: "Div",
        gridDefination: {
          xs: 12,
          sm: 12
        },
        props: {
          style: {
            width: "100%",
            float: "right"
          }
        },

      },
      children: {
        popup: adhocPopup,

        cancelApplicationButton: {
          componentPath: "Button",
          visible: enableButton,
          props: {
            variant: "outlined",
            color: "primary",
            style: {
              borderRadius: "2px",
              minWidth: "180px",
              height: "48px",
              marginRight: "16px",
              marginBottom: "8px",
              marginTop: "25px"
            }
          },

          children: {
            buttonLabel: getLabel({
              labelName: "CANCEL",
              labelKey: "EC_POPUP_SEARCH_RESULTS_CANCEL_APP_BUTTON"
            })
          },
          onClickDefination: {
            action: "condition",
            callBack: (state, dispatch) => {
              dispatch(
                handleField("search-preview", "components.adhocDialog", "props.open", false)
              );
            }
          },
        },
      },
    }

  },

};

export default screenConfig;
