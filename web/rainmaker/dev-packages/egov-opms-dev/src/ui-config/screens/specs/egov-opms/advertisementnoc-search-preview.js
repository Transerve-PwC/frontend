import {
  getCommonCard, getCommonContainer, getCommonHeader, getLabelWithValue, getLabel, getBreak
} from "egov-ui-framework/ui-config/screens/specs/utils";
import {
  handleScreenConfigurationFieldChange as handleField,
  prepareFinalObject
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { gotoApplyWithStep } from "../utils/index";
import {
  getFileUrlFromAPI,
  getQueryArg,
  getTransformedLocale,
  setBusinessServiceDataToLocalStorage
} from "egov-ui-framework/ui-utils/commons";
import { fetchLocalizationLabel } from "egov-ui-kit/redux/app/actions";
import jp from "jsonpath";
import get from "lodash/get";
import set from "lodash/set";
import { searchBill, createDemandForAdvNOC } from "../utils/index";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";

import { footer } from "./applyResource/employeeAdvertisementFooter";
//import { footer ,footerReview} from "./applyResource/footer";
import { adhocPopupAdvertisementWithdraw, adhocPopupAdvertisementwithdrawApproval, adhocPopupAdvertisementForward, adhocPopupAdvertisementReassign, adhocPopupAdvertisementReject, adhocPopupAdvertisementApprove } from "./payResource/adhocPopup";
import { getRequiredDocuments } from "./requiredDocuments/reqDocs";
import { preparepopupDocumentsADVUploadData, prepareDocumentsUploadData, checkVisibility, setCurrentApplicationProcessInstance } from "../../../../ui-utils/commons";
import { httpRequest } from "../../../../ui-utils";

import {
  advertisementapplicantSummary, detailSummary

} from "./summaryResource/advertisementapplicantSummary";
import { documentsSummary } from "./summaryResource/documentsSummary";
import { estimateSummary } from "./summaryResource/estimateSummary";
import { taskStatusSummary } from "./summaryResource/taskStatusSummary";
import { showHideAdhocPopup, checkForRole } from "../utils";

import { getAccessToken, getOPMSTenantId, getLocale, getUserInfo, localStorageGet, localStorageSet, setapplicationType, setapplicationNumber, getapplicationNumber, setOPMSTenantId } from "egov-ui-kit/utils/localStorageUtils";
import { getSearchResultsView, getSearchResultsForNocCretificate, getSearchResultsForNocCretificateDownload } from "../../../../ui-utils/commons";


let roles = JSON.parse(getUserInfo()).roles

const undertakingButton = getCommonContainer({
  addPenaltyRebateButton: {
    componentPath: "Button",
    props: {
      variant: "contained",
      color: "primary",
      style: {
        minWidth: "200px",
        height: "48px",
        marginRight: "40px"
      }
    },
    children: {
      previousButtonLabel: getLabel({
        labelName: "Undertaking",
        labelKey: "NOC_UNDERTAKING"
      })
    },
    onClickDefination: {
      action: "condition",
      callBack: (state, dispatch) => showHideAdhocPopup(state, dispatch, "advertisementnoc-search-preview")
    }
  },
});


const getMdmsData = async (action, state, dispatch) => {

  let tenantId = getOPMSTenantId();
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
          moduleName: "egpm",
          masterDetails: [
            {
              name: "typeOfAdvertisement"
            },
            {
              name: "AdvertisementEmployeeList"
            }
          ]
        },
        { moduleName: "AdvertisementNOC", masterDetails: [{ name: "AdvertisementNOCRemarksDocuments" }] }
      ]
    }
  };
  try {
    let payload = null;
    payload = await httpRequest(
      "post",
      "/egov-mdms-service/v1/_search",
      "_search",
      [],
      mdmsBody
    );


    dispatch(prepareFinalObject("applyScreenMdmsData", payload.MdmsRes));
  } catch (e) {
    console.log(e);
  }
};

const titlebar = getCommonContainer({
  header: getCommonHeader({
    labelName: "Task Details",
    labelKey: "NOC_TASK_DETAILS_HEADER"
  }),
  applicationNumber: {
    uiFramework: "custom-atoms-local",
    moduleName: "egov-opms",
    componentPath: "ApplicationNoContainer",
    props: {
      number: getapplicationNumber()
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
        props: { variant: "outlined", style: { marginLeft: 10, marginTop: 5, } },
        menu: []
      }
    }
  }//,
  // printMenu: {
  //   uiFramework: "custom-atoms",
  //   componentPath: "MenuButton",
  //   props: {
  //     data: {
  //       label: "Print",
  //       leftIcon: "print",
  //       rightIcon: "arrow_drop_down",
  //       props: { variant: "outlined", style: { marginLeft: 10 } },
  //       menu: []
  //     }
  //   }
  // }
});

const prepareDocumentsView = async (state, dispatch) => {
  let documentsPreview = [];

  // Get all documents from response
  let advtnocdetail = get(
    state,
    "screenConfiguration.preparedFinalObject.nocApplicationDetail[0]",
    {}
  );
  let uploadDocuments = JSON.parse(advtnocdetail.applicationdetail).hasOwnProperty('uploadDocuments') ?
    JSON.parse(advtnocdetail.applicationdetail).uploadDocuments[0]['fileStoreId'] : '';

  if (uploadDocuments !== '') {
    documentsPreview.push({
      title: "NOC_ADV_PHOTOCOPY_HOARDING",
      fileStoreId: uploadDocuments,
      linkText: "View"
    });
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
  }
};

const setDownloadMenu = (state, dispatch) => {
  /** MenuButton data based on status */
  let downloadMenu = [];

  let certificateDownloadObject = {
    label: { labelName: "NOC Certificate PET", labelKey: "NOC_CERTIFICATE_PET" },
    link: () => {
      window.location.href = httpLinkPET;
    },
    leftIcon: "book"
  };

  downloadMenu = [
    certificateDownloadObject
  ];

  dispatch(
    handleField(
      "advertisementnoc-search-preview",
      "components.div.children.headerDiv.children.header.children.downloadMenu",
      "props.data.menu",
      downloadMenu
    )
  );
  /** END */
};

const HideshowEdit = (state, action, nocStatus, exemptedcategory, dispatch) => {
  let showEdit = false;

  if (nocStatus === "REASSIGN" || nocStatus === "DRAFT") {
    showEdit = true;
  }
  // Hide edit buttons
  set(
    action,
    "screenConfig.components.div.children.body.children.cardContent.children.nocSummary.children.cardContent.children.header.children.editSection.visible",
    checkForRole(roles, 'CITIZEN') ? showEdit === true ? true : false : false
  );
  set(
    action,
    "screenConfig.components.div.children.body.children.cardContent.children.advertisementapplicantSummary.children.cardContent.children.header.children.editSection.visible",
    checkForRole(roles, 'CITIZEN') ? showEdit === true ? true : false : false
  );
  set(
    action,
    "screenConfig.components.div.children.body.children.cardContent.children.detailSummary.children.cardContent.children.header.children.editSection.visible",
    checkForRole(roles, 'CITIZEN') ? showEdit === true ? true : false : false
  );
  set(
    action,
    "screenConfig.components.div.children.body.children.cardContent.children.documentsSummary.children.cardContent.children.header.children.editSection.visible",
    checkForRole(roles, 'CITIZEN') ? showEdit === true ? true : false : false
  );

  set(
    action,
    "screenConfig.components.div.children.body.children.cardContent.children.taskStatusSummary.children.cardContent.children.header.children.editSection.visible",
    false);

  set(
    action,
    "screenConfig.components.adhocDialogForward.children.popup.children.adhocPopupAdvertisementForwardRemarkCard.children.advertisementForwardRemarkContainer.children.employeeList.visible",
    checkForRole(roles, 'OSD') ? nocStatus == "REVIEWOFOSD" || nocStatus == "REASSIGNTOOSD" ? true : false : false);
  //advertisementOSDWithdraApprovalAmountField
  set(
    action,
    "screenConfig.components.adhocDialog.children.popup.children.adhocPopupAdvertisementOSDWithdraApprovalAmountCard.children.advertisementOSDWithdraApprovalAmountContainer.children.employeeList.visible",
    checkForRole(roles, 'OSD') ? nocStatus == "REVIEWOFOSD" || nocStatus == "REASSIGNTOOSD" ? true : false : false);

  set(
    action,
    "screenConfig.components.adhocDialogForward.children.popup.children.adhocPopupAdvertisementForwardRemarkCard.children.advertisementForwardRemarkContainer.children.employeeList.required",
    checkForRole(roles, 'OSD') ? nocStatus == "REVIEWOFOSD" || nocStatus == "REASSIGNTOOSD" ? true : false : false);
  //advertisementOSDWithdraApprovalAmountField
  set(
    action,
    "screenConfig.components.adhocDialog.children.popup.children.adhocPopupAdvertisementOSDWithdraApprovalAmountCard.children.advertisementOSDWithdraApprovalAmountContainer.children.employeeList.required",
    checkForRole(roles, 'OSD') ? nocStatus == "REVIEWOFOSD" || nocStatus == "REASSIGNTOOSD" ? true : false : false);

  // set(
  //   action,
  //   "screenConfig.components.div.children.footer.children.withdrawapprove.visible",
  //   checkForRole(roles, 'OSD') || checkForRole(roles, 'JEX')
  //     ? localStorageGet('pms_iswithdrawn') === "yes"
  //       ? exemptedcategory == 0
  //         ? true
  //         : false
  //       : false
  //     : false);


  set(
    action,
    "screenConfig.components.div.children.footer.children.withdraw.visible",
    checkForRole(roles, 'CITIZEN') ?
      nocStatus != "INITIATED" ?
        nocStatus != "DRAFT" ?
          localStorageGet('pms_iswithdrawn') !== "yes" ?
            exemptedcategory == 0
              ? true
              : false
            : false
          : false
        : false
      : false
  );

  // set(
  //   action,
  //   "screenConfig.components.div.children.footer.children.nextButton.visible",
  //   checkForRole(roles, 'JEX') || checkForRole(roles, 'OSD')
  //     ? localStorageGet('pms_iswithdrawn') !== "yes"
  //       ? true
  //       : false
  //     : checkForRole(roles, 'SUPERINTENDENT')
  //       ? true
  //       : false
  // );

  // set(
  //   action,
  //   "screenConfig.components.div.children.footer.children.reassign.visible",
  //   checkForRole(roles, 'SUPERINTENDENT') || checkForRole(roles, 'OSD') || checkForRole(roles, 'CA')
  //     ? true
  //     : checkForRole(roles, 'JEX')
  //       ? localStorageGet('pms_iswithdrawn') !== "yes"
  //         ? true
  //         : false
  //       : false
  // );
  //fwd
  set(state, 'screenConfiguration.preparedFinalObject.WFStatus', []);
  if (localStorageGet('pms_iswithdrawn') !== "yes") {
    checkVisibility(state, "REVIEWOFSUPERINTENDENT,REVIEWOFOSD,REVIEWOFJC,REVIEWOFAC,REVIEWOFSC,REVIEWOFSEC,PENDINGAPPROVAL", "nextButton", action, "screenConfig.components.div.children.footer.children.nextButton.visible", null)
    checkVisibility(state, "REASSIGN,REASSIGNTOJEX,REASSIGNTOSUPERINTENDENT,REASSIGNTOOSD,REASSIGNTOJC,REASSIGNTOAC,REASSIGNTOSC,REASSIGNTOSEC", "reassign", action, "screenConfig.components.div.children.footer.children.reassign.visible", null)
  }
  else if (localStorageGet('pms_iswithdrawn') === "yes") {
    checkVisibility(state, "REVIEWOFOSD,PENDINGAPPROVAL", "nextButton", action, "screenConfig.components.div.children.footer.children.nextButton.visible", null)
    checkVisibility(state, "REASSIGNTOJEX,REASSIGNTOSUPERINTENDENT,REASSIGNTOOSD,REASSIGNTOJC,REASSIGNTOAC,REASSIGNTOSC,REASSIGNTOSEC", "reassign", action, "screenConfig.components.div.children.footer.children.reassign.visible", null)
    //withdrawapprove
    checkVisibility(state, "REVIEWOFACFORWITHDRAW,REVIEWOFJCFORWITHDRAW,REVIEWOFSCFORWITHDRAW,REVIEWOFSECFORWITHDRAW,REVIEWOFSPAFTERWITHDRAW", "withdrawapprove", action, "screenConfig.components.div.children.footer.children.withdrawapprove.visible", exemptedcategory == 0)
  }
  //approve
  checkVisibility(state, "APPROVED", "approve", action, "screenConfig.components.div.children.footer.children.approve.visible", null)
  //reject
  checkVisibility(state, "REJECTED", "reject", action, "screenConfig.components.div.children.footer.children.reject.visible", null)





  set(
    action,
    "screenConfig.components.div.children.body.children.cardContent.children.detailSummary.children.cardContent.children.body.children.withdrawapprovalamount.visible",
    localStorageGet('pms_iswithdrawn') === "yes" ? true : false
  );

  set(
    action,
    "screenConfig.components.div.children.footer.children.previousButton.visible",
    checkForRole(roles, 'CITIZEN') ?
      nocStatus === "DRAFT" || nocStatus === "INITIATED" || nocStatus === "REASSIGN" || nocStatus === "INITIATEDEXC" ?
        true
        : false
      : false
  );

  set(
    action,
    "screenConfig.components.div.children.footer.children.submitButton.visible",
    checkForRole(roles, 'CITIZEN') ?
      nocStatus === "DRAFT" || nocStatus === "INITIATED" || nocStatus === "REASSIGN"
        ? true
        : false
      : false
  );
}

const setSearchResponse = async (state, action, dispatch, applicationNumber, tenantId) => {
  const response = await getSearchResultsView([
    { key: "tenantId", value: tenantId },
    { key: "applicationNumber", value: applicationNumber }
  ]);
  if (response === undefined) {
    dispatch(setRoute(`/egov-opms/invalidIdErrorPage?applicationNumber=${applicationNumber}&tenantId=${tenantId}`))
  }
  else {
    dispatch(prepareFinalObject("nocApplicationDetail", get(response, "nocApplicationDetail", [])));
    // Set Institution/Applicant info card visibility
    let nocStatus = get(state, "screenConfiguration.preparedFinalObject.nocApplicationDetail[0].applicationstatus", {});
    localStorageSet("app_noc_status", nocStatus);
    let remarksData = get(state, "screenConfiguration.preparedFinalObject.nocApplicationDetail[0].remarks", []);

    remarksData.forEach(doc => {
      if (doc.applicationstatus == 'WITHDRAWAFTERAPRROVAL' || doc.applicationstatus == 'WITHDRAW') {
        localStorageSet("pms_iswithdrawn", "yes");
      }
    });

    let applicationStatus = get(response, "nocApplicationDetail.[0].applicationstatus");
    localStorageSet("footerApplicationStatus", applicationStatus);
    let exampted = get(state.screenConfiguration.preparedFinalObject, 'nocApplicationDetail[0].applicationdetail');
    let exemptedcategory = JSON.parse(exampted)['exemptedCategory'];
    await setCurrentApplicationProcessInstance(state);

    HideshowEdit(state, action, nocStatus, exemptedcategory, dispatch);

    if (JSON.parse(exampted).hasOwnProperty('withdrawapprovalamount'))
      dispatch(prepareFinalObject("advertisement[0].WithdraApproval.Amount", JSON.parse(exampted)['withdrawapprovalamount']));

    dispatch(
      handleField(
        "advertisementnoc-search-preview",
        "components.div.children.body.children.cardContent.children.advertisementapplicantSummary",
        "visible",
        true
      )
    );

    dispatch(
      handleField(
        "advertisementnoc-search-preview",
        "components.div.children.body.children.cardContent.children.detailSummary",
        "visible",
        true
      )
    );


    prepareDocumentsView(state, dispatch);
    if (checkForRole(roles, 'CITIZEN'))
      setSearchResponseForNocCretificate(state, dispatch, applicationNumber, tenantId);


    getMdmsData(action, state, dispatch).then(response => {
      //JSON.Parse(nocApplicationDetail[0].applicationdetail).typeOfAdvertisement

      let advertisementtypeselected = '';
      let advertisementsubtypeselected = '';
      let advt = get(state, "screenConfiguration.preparedFinalObject.nocApplicationDetail[0].applicationdetail",
        {}
      );

      //if (advertisementtypeselected !== null && advertisementtypeselected !== '' && advertisementtypeselected !== 'undefined') {
      if (advt !== null && advt !== '' && advt !== 'undefined') {
        advertisementtypeselected = JSON.parse(advt).typeOfAdvertisement;
        advertisementsubtypeselected = JSON.parse(advt).subTypeOfAdvertisement;

        let advertisementtypeid = get(state, "screenConfiguration.preparedFinalObject.applyScreenMdmsData.egpm.typeOfAdvertisement",
          []
        );
        let adv_id = advertisementtypeid.filter(item => {
          if (item.name == advertisementtypeselected) {
            localStorageSet("this_adv_code", item.code);
            localStorageSet("this_adv_id", item.id);
            item.subTypeOfAdvertisement.filter(subitem => {
              if (subitem.name === advertisementsubtypeselected) {
                localStorageSet("this_sub_adv_code", subitem.code);
                localStorageSet("this_sub_adv_id", subitem.id);
              }
            });

            //   createDemandForAdvNOC(state, dispatch, applicationNumber, tenantId);
          }
        });


      }
      else {
        alert("Error Fetching advertisement code. Reload!")
      }


    });

  }

};


let httpLinkPET;


//setDownloadMenu(state, dispatch);


let httpLinkADVERTISEMENT;
let httpLinkADVERTISEMENT_RECEIPT;


const setSearchResponseForNocCretificate = async (
  state,
  dispatch,
  applicationNumber,
  tenantId
) => {
  let downloadMenu = [];
  let certificateDownloadObjectADVERTISEMENT_RECEIPT = {};
  let certificateDownloadObjectADVERTISEMENT = {};
  //let nocStatus = get(state, "screenConfiguration.preparedFinalObject.nocApplicationDetail[0].applicationstatus", {});
  let nocRemarks = get(state, "screenConfiguration.preparedFinalObject.nocApplicationDetail[0].remarks", {});

  let nocRemark = "";
  let nocStatus = "";

  var resApproved = nocRemarks.filter(function (item) {
    return item.applicationstatus == "APPROVED";
  });
  var resPaid = nocRemarks.filter(function (item) {
    return item.applicationstatus == "PAID";
  });

  var resWITHDRAWAPPROVAL = nocRemarks.filter(function (item) {
    return item.applicationstatus == "WITHDRAWAPPROVAL";
  });

  if (resApproved.length != 0)
    nocStatus = "APPROVED";

  if (resPaid.length != 0)
    nocRemark = "PAID";


  if (nocStatus == "APPROVED" && resWITHDRAWAPPROVAL.length == 0) {
    let getCertificateDataForADVERTISEMENT = { "applicationType": "ADVERTISEMENTNOC", "tenantId": tenantId, "applicationId": applicationNumber, "dataPayload": { "requestDocumentType": "certificateData" } };

    //ADVERTISEMENTNOC
    const response0ADVERTISEMENT = await getSearchResultsForNocCretificate([
      { key: "tenantId", value: tenantId },
      { key: "applicationNumber", value: applicationNumber },
      { key: "getCertificateData", value: getCertificateDataForADVERTISEMENT },
      { key: "requestUrl", value: "/pm-services/noc/_getCertificateData" }
    ]);

    let getFileStoreIdForADVERTISEMENT = { "nocApplicationDetail": [get(response0ADVERTISEMENT, "nocApplicationDetail[0]", "")] }
    //dispatch(prepareFinalObject("nocApplicationCertificateDetail", get(response, "nocApplicationDetail", [])));

    const response1ADVERTISEMENT = await getSearchResultsForNocCretificate([
      { key: "tenantId", value: tenantId },
      { key: "applicationNumber", value: applicationNumber },
      { key: "getCertificateDataFileStoreId", value: getFileStoreIdForADVERTISEMENT },
      { key: "requestUrl", value: "/pdf-service/v1/_create?key=advertisement-noc&tenantId=" + tenantId }
    ]);

    const response2ADVERTISEMENT = await getSearchResultsForNocCretificateDownload([
      { key: "tenantId", value: tenantId },
      { key: "applicationNumber", value: applicationNumber },
      { key: "filestoreIds", value: get(response1ADVERTISEMENT, "filestoreIds[0]", "") },
      { key: "requestUrl", value: "/filestore/v1/files/url?tenantId=" + tenantId + "&fileStoreIds=" }
    ]);
    httpLinkADVERTISEMENT = get(response2ADVERTISEMENT, get(response1ADVERTISEMENT, "filestoreIds[0]", ""), "")

    //Object creation for NOC's
    certificateDownloadObjectADVERTISEMENT = {
      label: { labelName: "NOC Certificate ADVERTISEMENT", labelKey: "NOC_CERTIFICATE_ADVERTISEMENT" },
      link: () => {
        if (httpLinkADVERTISEMENT != "")
          window.location.href = httpLinkADVERTISEMENT;
      },
      leftIcon: "book"
    };

  }
  if (nocRemark == "PAID" && resWITHDRAWAPPROVAL.length == 0) {
    //Receipts
    let getCertificateDataForADVERTISEMENT_RECEIPT = { "applicationType": "ADVERTISEMENTNOC", "tenantId": tenantId, "applicationId": applicationNumber, "dataPayload": { "requestDocumentType": "receiptData" } };

    //ADVERTISEMENTNOC_Receipts
    const response0ADVERTISEMENT_RECEIPT = await getSearchResultsForNocCretificate([
      { key: "tenantId", value: tenantId },
      { key: "applicationNumber", value: applicationNumber },
      { key: "getCertificateData", value: getCertificateDataForADVERTISEMENT_RECEIPT },
      { key: "requestUrl", value: "/pm-services/noc/_getCertificateData" }
    ]);

    let getFileStoreIdForADVERTISEMENT_RECEIPT = { "nocApplicationDetail": [get(response0ADVERTISEMENT_RECEIPT, "nocApplicationDetail[0]", "")] }

    const response1ADVERTISEMENT_RECEIPT = await getSearchResultsForNocCretificate([
      { key: "tenantId", value: tenantId },
      { key: "applicationNumber", value: applicationNumber },
      { key: "getCertificateDataFileStoreId", value: getFileStoreIdForADVERTISEMENT_RECEIPT },
      { key: "requestUrl", value: "/pdf-service/v1/_create?key=advertisement-receipt&tenantId=" + tenantId }
    ]);

    const response2ADVERTISEMENT_RECEIPT = await getSearchResultsForNocCretificateDownload([
      { key: "tenantId", value: tenantId },
      { key: "applicationNumber", value: applicationNumber },
      { key: "filestoreIds", value: get(response1ADVERTISEMENT_RECEIPT, "filestoreIds[0]", "") },
      { key: "requestUrl", value: "/filestore/v1/files/url?tenantId=" + tenantId + "&fileStoreIds=" }
    ]);
    httpLinkADVERTISEMENT_RECEIPT = get(response2ADVERTISEMENT_RECEIPT, get(response1ADVERTISEMENT_RECEIPT, "filestoreIds[0]", ""), "")

    //Object creation for Receipt's
    certificateDownloadObjectADVERTISEMENT_RECEIPT = {
      label: { labelName: "NOC Receipt ADVERTISEMENT", labelKey: "NOC_RECEIPT_ADVERTISEMENT" },
      link: () => {
        if (httpLinkADVERTISEMENT_RECEIPT != "")
          window.location.href = httpLinkADVERTISEMENT_RECEIPT;
      },
      leftIcon: "book"
    };

  }

  if (nocStatus == "APPROVED" && nocRemark == "PAID" && resWITHDRAWAPPROVAL.length == 0) {
    downloadMenu = [
      certificateDownloadObjectADVERTISEMENT,
      certificateDownloadObjectADVERTISEMENT_RECEIPT
    ];
  } else if (nocStatus == "APPROVED" && resWITHDRAWAPPROVAL.length == 0) {
    downloadMenu = [
      certificateDownloadObjectADVERTISEMENT
    ];
  } else if (nocRemark == "PAID" && resWITHDRAWAPPROVAL.length == 0) {
    downloadMenu = [
      certificateDownloadObjectADVERTISEMENT_RECEIPT
    ];
  }

  dispatch(
    handleField(
      "advertisementnoc-search-preview",
      "components.div.children.headerDiv.children.header.children.downloadMenu",
      "props.data.menu",
      downloadMenu
    )
  );

  //setDownloadMenu(state, dispatch);
};

const screenConfig = {
  uiFramework: "material-ui",
  name: "advertisementnoc-search-preview",
  beforeInitScreen: (action, state, dispatch) => {
    const applicationNumber = getQueryArg(window.location.href, "applicationNumber");
    setapplicationNumber(applicationNumber);
    const tenantId = getQueryArg(window.location.href, "tenantId");
    setOPMSTenantId(tenantId);

    if (JSON.parse(getUserInfo()).type === "EMPLOYEE") {
      set(state,
        "screenConfiguration.preparedFinalObject.documentsUploadRedux[0]",
        ""
      )
      set(state.screenConfiguration.preparedFinalObject, "advertisement[0].Forward.Remark", "");
      set(state.screenConfiguration.preparedFinalObject, "advertisement[0].Approve.Remark", "");
      set(state.screenConfiguration.preparedFinalObject, "advertisement[0].Reject.Remark", "");
      set(state.screenConfiguration.preparedFinalObject, "advertisement[0].Reassign.Remark", "");
      set(state.screenConfiguration.preparedFinalObject, "advertisement[0].WithdraApproval.Amount", "");
      set(state.screenConfiguration.preparedFinalObject, "advertisement[0].WithdraApproval.Remark", "");
      set(state.screenConfiguration.preparedFinalObject, "OPMS.AdvertisementNOC.typeOfCommissioner", "");
    }

    dispatch(fetchLocalizationLabel(getLocale(), tenantId, tenantId));
    searchBill(dispatch, applicationNumber, tenantId);
    //localStorage.setItem('ApplicationNumber', applicationNumber); , applicationNumber)
    // localStorage.setItem('applicationType', 'ADVERTISEMENTNOC')
    setapplicationType('ADVERTISEMENTNOC');

    if (checkForRole(roles, 'CITIZEN')) {
      set(action, "screenConfig.components.adhocDialog.children.popup", adhocPopupAdvertisementWithdraw);
    }
    localStorageSet("pms_iswithdrawn", "no")
    setSearchResponse(state, action, dispatch, applicationNumber, tenantId);

    const queryObject = [
      { key: "tenantId", value: tenantId },
      { key: "businessServices", value: "ADVERTISEMENTNOC" }
    ];
    setBusinessServiceDataToLocalStorage(queryObject, dispatch);


    getMdmsData(action, state, dispatch).then(response => {
      prepareDocumentsUploadData(state, dispatch, 'popup_adv');

    });

    // Set Documents Data (TEMP)
    preparepopupDocumentsADVUploadData(state, dispatch, 'ADVERTISEMENTNOC');
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
                sm: 10
              },
              ...titlebar
            }
          }
        },
        taskStatus: {
          uiFramework: "custom-containers-local",
          componentPath: "WorkFlowContainer",
          moduleName: "egov-workflow",
          visible: process.env.REACT_APP_NAME === "Citizen" ? false : true,
          props: {
            dataPath: "Licenses",
            moduleName: "ADVERTISEMENTNOC",
          }

        },
        body: checkForRole(roles, 'CITIZEN') ? getCommonCard({
          estimateSummary: estimateSummary,
          advertisementapplicantSummary: advertisementapplicantSummary,
          detailSummary: detailSummary,
          documentsSummary: documentsSummary,
          taskStatusSummary: taskStatusSummary,
        }) : getCommonCard({
          //taskStatusSummary: taskStatusSummary,
          estimateSummary: estimateSummary,
          advertisementapplicantSummary: advertisementapplicantSummary,
          detailSummary: detailSummary,
          documentsSummary: documentsSummary

        })
        ,
        break: getBreak(),
        //undertakingButton,
        // citizenFooter:
        //   process.env.REACT_APP_NAME === "Citizen" ? citizenFooter : {}
        footer: footer

      }
    },
    adhocDialog: {
      uiFramework: "custom-containers-local",
      moduleName: "egov-opms",
      componentPath: "DialogContainer",
      props: {
        open: false,
        maxWidth: "sm",
        screenKey: "advertisementnoc-search-preview"
      },
      children: {

        popup: adhocPopupAdvertisementwithdrawApproval
        //popup:adhocPopup1

      }
    },
    adhocDialogForward: {
      uiFramework: "custom-containers-local",
      moduleName: "egov-opms",
      componentPath: "ForwardContainer",
      props: {
        open: false,
        maxWidth: "sm",
        screenKey: "advertisementnoc-search-preview"
      },
      children: {

        popup: adhocPopupAdvertisementForward

      }
    },

    adhocDialog1: {
      uiFramework: "custom-containers-local",
      moduleName: "egov-opms",
      componentPath: "ApproveContainer",
      props: {
        open: false,
        maxWidth: "sm",
        screenKey: "advertisementnoc-search-preview"
      },
      children: {

        popup: adhocPopupAdvertisementApprove


      }
    },

    adhocDialog3: {
      uiFramework: "custom-containers-local",
      moduleName: "egov-opms",
      componentPath: "RejectContainer",
      props: {
        open: false,
        maxWidth: "sm",
        screenKey: "advertisementnoc-search-preview"
      },
      children: {

        popup: adhocPopupAdvertisementReject

      }
    },
    adhocDialog2: {
      uiFramework: "custom-containers-local",
      moduleName: "egov-opms",
      componentPath: "ReassignContainer",
      props: {
        open: false,
        maxWidth: "sm",
        screenKey: "advertisementnoc-search-preview"
      },
      children: {

        popup: adhocPopupAdvertisementReassign


      }
    },


  }
};


export default screenConfig;
