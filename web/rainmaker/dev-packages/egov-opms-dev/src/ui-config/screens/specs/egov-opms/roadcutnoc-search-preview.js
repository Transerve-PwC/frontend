import {
  getCommonCard, getCommonContainer, getCommonHeader, getLabelWithValue, getLabel, getBreak
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { gotoApplyWithStep } from "../utils/index";
import {
  handleScreenConfigurationFieldChange as handleField,
  prepareFinalObject
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
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
import { fetchBill, searchBill, createDemandForRoadCutNOC } from "../utils/index";

import { footerEmp, takeactionfooter, footerCitizen } from "./applyResource/employeeRoadCutFooter";
//import { footer ,footerReview} from "./applyResource/footer";
import {
  adhocPopupForJeRoadCutForward, adhocPopupForJeRoadCutReassign, adhocPopupForCeRoadCutApprove,
  adhocPopupForSeRoadCutForward, adhocPopupForCeRoadCutReject
} from "./payResource/adhocPopup";

import { getRequiredDocuments } from "./requiredDocuments/reqDocs";

import { roadcutapplicantSummary } from "./summaryResource/roadcutapplicantSummary";
import { documentsSummary } from "./summaryResource/documentsSummary";
import { estimateSummary } from "./summaryResource/estimateSummary";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";

import { checkForRole } from "../utils";
import { httpRequest } from "../../../../ui-utils";
import {
  localStorageGet, localStorageSet, setapplicationNumber, getOPMSTenantId, setapplicationType,
  getAccessToken, getLocale, getUserInfo, getapplicationType, getapplicationNumber, setOPMSTenantId
} from "egov-ui-kit/utils/localStorageUtils";

import {
  preparepopupDocumentsRoadCutUploadData, prepareDocumentsUploadData,
  getSearchResultsView, getSearchResultsForNocCretificate, getSearchResultsForNocCretificateDownload, setCurrentApplicationProcessInstance
} from "../../../../ui-utils/commons";
import { taskStatusSummary } from './summaryResource/taskStatusSummary';
import { checkVisibility } from '../../../../ui-utils/commons'

let roles = JSON.parse(getUserInfo()).roles

const ReassignButton = getCommonContainer({
  resendButton: {
    componentPath: "Button",
    props: {
      variant: "contained",
      color: "primary",
      style: {
        minWidth: "180px",
        height: "48px",
        marginRight: "45px",
        // borderRadius: "inherit",
        // align: "right"
      }
    },
    children: {
      submitButtonLabel: getLabel({
        labelName: "Resend",
        labelKey: "PM_COMMON_BUTTON_RESEND"
      }),
      submitButtonIcon: {
        uiFramework: "custom-atoms",
        componentPath: "Icon",
        props: {
          iconName: "keyboard_arrow_right"
        }
      }
    },
    onClickDefination: {
      action: "condition",
      callBack: (state, dispatch) => {
        gotoApplyWithStep(state, dispatch, 0);
      }
    },
    visible: localStorageGet("app_noc_status") == "REASSIGN" ? true : false

  }
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
              name: "roadCutDivision"
            },
            {
              name: "sector"
            }
          ]
        },
        { moduleName: "RoadCutNOC", masterDetails: [{ name: "RoadCutNOCRemarksDocuments" }] }
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
const getMdmsDataForTaxCode = async (action, state, dispatch) => {

  let tenantId = getOPMSTenantId();
  let mdmsBody = {
    MdmsCriteria: {
      tenantId: tenantId,
      moduleDetails: [
        {
          moduleName: "egpm",
          masterDetails: [
            {
              name: "roadCutDivision"
            }
          ]
        }
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
        props: { variant: "outlined", style: { marginLeft: 10, marginTop: 5 } },
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
  //  let documentsPreview = [];

  // Get all documents from response
  // let ROADCUTNOC = get(
  //   state, "screenConfiguration.preparedFinalObject.nocApplicationDetail[0]", {});
  // let uploadDocuments = JSON.parse(ROADCUTNOC.applicationdetail).hasOwnProperty('uploadDocuments') ?
  //   JSON.parse(ROADCUTNOC.applicationdetail).uploadDocuments[0]['fileStoreId'] : '';

  // let uploadPetPicture=JSON.parse(ROADCUTNOC.applicationdetail).hasOwnProperty('uploadPetPicture')?
  // JSON.parse(ROADCUTNOC.applicationdetail).uploadPetPicture[0]['fileStoreId']:'';

  // let allDocuments = [];
  // allDocuments.push(uploadDocuments)

  // if (uploadDocuments !== '') {
  //   documentsPreview.push(
  //     {
  //       title: "ROAD_CUT_STAMP_DOC",
  //       fileStoreId: uploadDocuments,
  //       linkText: "View"
  //     });

  //   let fileStoreIds = jp.query(documentsPreview, "$.*.fileStoreId");
  //   let fileUrls =
  //     fileStoreIds.length > 0 ? await getFileUrlFromAPI(fileStoreIds) : {};
  //   documentsPreview = documentsPreview.map(function (doc, index) {

  //     doc["link"] = fileUrls && fileUrls[doc.fileStoreId] && fileUrls[doc.fileStoreId].split(",")[0] || "";
  //     doc["name"] =
  //       (fileUrls[doc.fileStoreId] &&
  //         decodeURIComponent(
  //           fileUrls[doc.fileStoreId]
  //             .split(",")[0]
  //             .split("?")[0]
  //             .split("/")
  //             .pop()
  //             .slice(13)
  //         )) ||
  //       `Document - ${index + 1}`;
  //     return doc;
  //   });

  //   dispatch(prepareFinalObject("documentsPreview", documentsPreview));
  // }
  let documentsPreview = [];
  // Get all documents from response
  //  let roadcutnocdetail = get(state, "screenConfiguration.preparedFinalObject.nocApplicationDetail[0]", {});

  let ROADCUTNOC = get(
    state, "screenConfiguration.preparedFinalObject.nocApplicationDetail[0]", {});
  // let uploadDocuments = JSON.parse(ROADCUTNOC.applicationdetail).hasOwnProperty('uploadDocuments') ?
  //   JSON.parse(ROADCUTNOC.applicationdetail).uploadDocuments[0]['fileStoreId'] : '';

  //    let documentsPreview = [];

  let doc = JSON.parse(ROADCUTNOC.applicationdetail).uploadDocuments

  let doctitle = []
  if (doc.length > 0) {
    if (doc.length > 0) {

      for (let i = 0; i < doc.length; i++) {
        let eventDoc = doc[i]['fileStoreId']
        doctitle.push(doc[i]['name:']);

        if (eventDoc !== '' || eventDoc !== undefined) {
          documentsPreview.push({
            title: doc[i]['name:'],
            fileStoreId: eventDoc,
            linkText: "View",
            fileName: doc[i]['name:']
          })
          let fileStoreIds = jp.query(documentsPreview, "$.*.fileStoreId");
          let fileUrls =
            fileStoreIds.length > 0 ? await getFileUrlFromAPI(fileStoreIds) : {};

          documentsPreview = documentsPreview.map(function (doc, index) {


            doc["link"] = fileUrls && fileUrls[doc.fileStoreId] && fileUrls[doc.fileStoreId].split(",")[0] || "";
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
        }
      }

    }
  }
  dispatch(prepareFinalObject("documentsPreview", documentsPreview));

};

const setDownloadMenu = (state, dispatch) => {
  /** MenuButton data based on status */
  let downloadMenu = [];

  //Object creation for NOC's
  let certificateDownloadObjectPET = {
    label: { labelName: "NOC Certificate PET", labelKey: "NOC_CERTIFICATE_PET" },
    link: () => {
      window.location.href = httpLinkPET;
    },
    leftIcon: "book"
  };

  downloadMenu = [
    certificateDownloadObjectPET
  ];

  dispatch(
    handleField(
      "roadcutnoc-search-preview",
      "components.div.children.headerDiv.children.header.children.downloadMenu",
      "props.data.menu",
      downloadMenu
    )
  );
};

const HideshowEdit = (state, action, nocStatus, amount, applicationNumber) => {
  // Hide edit buttons
  let showEdit = false;
  if (nocStatus === "REASSIGN" || nocStatus === "DRAFT") {
    showEdit = true;
  }
  set(
    action,
    "screenConfig.components.div.children.body.children.cardContent.children.nocSummary.children.cardContent.children.header.children.editSection.visible",
    checkForRole(roles, 'CITIZEN') ? showEdit === true ? true : false : false
  );
  set(
    action,
    "screenConfig.components.div.children.body.children.cardContent.children.roadcutapplicantSummary.children.cardContent.children.header.children.editSection.visible",
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
    false
  );

  // set(
  //   action,
  //   "screenConfig.components.div.children.footerEmp.children.approve.visible",
  //   amount < 50000 && checkForRole(roles, 'EE') ? true
  //     : checkForRole(roles, 'CE') ? true : false
  // );
  //check visibile true
  //amount and role combination
  // set(
  //   action,
  //   "screenConfig.components.div.children.footerEmp.children.reject.visible",
  //   amount < 50000 && checkForRole(roles, 'EE') ? true : checkForRole(roles, 'CE') ? true : false
  // );
  // set(
  //   action,
  //   "screenConfig.components.div.children.footerEmp.children.nextButton.visible",
  //   checkVisibility("INITIATED,REVIEWSDO,REVIEWOFSE,REVIEWOFEE") ? true : false
  // );
  // set(
  //   action,
  //   "screenConfig.components.div.children.footerEmp.children.reassign.visible",
  //   checkVisibility("INITIATED,REASSIGNTOEE,REASSIGNTOJE,REASSIGNTOSDO,REASSIGNTOSE") ? true : false
  // );            
  set(state, 'screenConfiguration.preparedFinalObject.WFStatus', []);
  checkVisibility(state, "REJECT,REJECTED", "reject", action, "screenConfig.components.div.children.footerEmp.children.reject.visible", (amount < 50000 && checkForRole(roles, 'EE') && (nocStatus == "REVIEWAPPROVEEE" || nocStatus == "REASSIGNAPPROVEEE")) || (amount < 200000 && checkForRole(roles, 'SE') && (nocStatus == "REVIEWAPPROVESE") || nocStatus == "REASSIGNAPPROVESE") || checkForRole(roles, 'CE'))

  checkVisibility(state, "APPROVED", "approve", action, "screenConfig.components.div.children.footerEmp.children.approve.visible", (amount < 50000 && checkForRole(roles, 'EE') && (nocStatus == "REVIEWAPPROVEEE" || nocStatus == "REASSIGNAPPROVEEE")) || (amount < 200000 && checkForRole(roles, 'SE') && (nocStatus == "REVIEWAPPROVESE" || nocStatus == "REASSIGNAPPROVESE")) || checkForRole(roles, 'CE'))

  checkVisibility(state, "REASSIGN,REASSIGNAPPROVESE,REASSIGNAPPROVEEE,REASSIGNTOJE,REASSIGNTOSDO", "reassign", action, "screenConfig.components.div.children.footerEmp.children.reassign.visible", null)

  checkVisibility(state, "REASSIGNDOEE,REASSIGNDOSE,REASSIGNDOCE", "reassignToDO", action, "screenConfig.components.div.children.footerEmp.children.reassignToDO.visible", null)

  checkVisibility(state, "INITIATED,VERIFYDOEE,VERIFYDOSE,VERIFYDOCE,REVIEWSDO,REVIEWOFSE,REVIEWOFCE,REVIEWOFEE,REVIEWAPPROVEEE,REVIEWAPPROVESE,REVIEWOFWD,PENDINGAPPROVAL", "nextButton", action, "screenConfig.components.div.children.footerEmp.children.nextButton.visible", null)

  set(
    action,
    "screenConfig.components.div.children.footerEmp.children.MakePayment.visible",
    (checkForRole(roles, 'CITIZEN') && nocStatus === "APPROVED") ? true : false
  );

  set(
    action,
    "screenConfig.components.div.children.footerEmp.children.previousButton.visible",
    checkForRole(roles, 'CITIZEN') ?
      nocStatus === "DRAFT" || nocStatus === "REASSIGN" ?
        true
        : false
      : false
  );
  set(
    action,
    "screenConfig.components.div.children.footerEmp.children.submitButton.visible",
    checkForRole(roles, 'CITIZEN') ?
      nocStatus === "DRAFT" || nocStatus === "REASSIGN" ?
        true
        : false
      : false
  );

  set(
    action,
    "screenConfig.components.div.children.takeactionfooter.children.actionbutton.visible",
    checkForRole(roles, 'CITIZEN') ?
      nocStatus === "DRAFT" || nocStatus === "REASSIGN" || nocStatus === "APPROVED" ?
        true
        : false
      : true
  );
  //screenConfiguration.screenConfig["roadcutnoc-search-preview"].
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
    let applicationStatus = get(response, "nocApplicationDetail.[0].applicationstatus");

    let nocStatus = get(state, "screenConfiguration.preparedFinalObject.nocApplicationDetail[0].applicationstatus", {});
    localStorageSet("app_noc_status", nocStatus);
    localStorageSet("applicationStatus", applicationStatus);
    let amount = get(state, "screenConfiguration.preparedFinalObject.nocApplicationDetail[0].amount", {});
    let performancebankguaranteecharges = get(state, "screenConfiguration.preparedFinalObject.nocApplicationDetail[0].performancebankguaranteecharges", {});
    let gstamount = get(state, "screenConfiguration.preparedFinalObject.nocApplicationDetail[0].gstamount", {});

    await setCurrentApplicationProcessInstance(state);
    HideshowEdit(state, action, nocStatus, amount, applicationNumber);
    if (nocStatus === 'PAID' && checkForRole(roles, 'CITIZEN')) {
      searchBill(dispatch, applicationNumber, tenantId);
    } else {
      if (amount > 0) {
        dispatch(prepareFinalObject("OPMS[0].RoadCutUpdateStautsDetails.additionalDetail.RoadCutForwardAmount", amount));
        dispatch(prepareFinalObject("OPMS[0].RoadCutUpdateStautsDetails.additionalDetail.RoadCutForwardGstAmount", gstamount));
        dispatch(prepareFinalObject("OPMS[0].RoadCutUpdateStautsDetails.additionalDetail.RoadCutForwardPerformanceBankGuaranteeCharges", performancebankguaranteecharges));
        if (checkForRole(roles, 'CITIZEN')) {
          await getMdmsDataForTaxCode(action, state, dispatch)
          let division = JSON.parse(response.nocApplicationDetail[0].applicationdetail).division;
          let divisionMDMS = get(
            state,
            "screenConfiguration.preparedFinalObject.applyScreenMdmsData.egpm.roadCutDivision",
            []
          );
          let divisionCode = divisionMDMS.find(item => {
            return item.name == division;
          });
          let res = await createDemandForRoadCutNOC(state, dispatch, applicationNumber, tenantId, divisionCode.taxCode);
          if (res != null) {
            dispatch(prepareFinalObject("OPMS.RODCUTNOC.BusinessServiceCode", `OPMS.ROADCUTNOC_${divisionCode.taxCode}`));
            const response = await fetchBill([
              { key: "tenantId", value: tenantId },
              { key: "consumerCode", value: applicationNumber },
              {
                key: "businessService", value: `OPMS.ROADCUTNOC_${divisionCode.taxCode}`
              }
            ], dispatch);
          }

        }
      } else {
        dispatch(prepareFinalObject("ReceiptTemp[0].Bill", {}));
        dispatch(prepareFinalObject("applyScreenMdmsData.estimateCardData", {}));
      }
    }
    prepareDocumentsView(state, dispatch);

    if (checkForRole(roles, 'CITIZEN'))
      setSearchResponseForNocCretificate(state, dispatch, applicationNumber, tenantId);
  }
};

let httpLinkPET;
let httpLinkROADCUT;
let httpLinkROADCUT_RECEIPT;


const setSearchResponseForNocCretificate = async (state, dispatch, applicationNumber, tenantId) => {
  let downloadMenu = [];
  let certificateDownloadObjectROADCUT_RECEIPT = {};
  let certificateDownloadObjectROADCUT = {};
  // let nocStatus = get(state, "screenConfiguration.preparedFinalObject.nocApplicationDetail[0].applicationstatus", {});
  let nocRemarks = get(state, "screenConfiguration.preparedFinalObject.nocApplicationDetail[0].remarks", {});

  let nocRemark = "";
  let nocStatus = "";

  //var resApproved = nocRemarks.filter(function (item) {
  //  return item.applicationstatus == "APPROVED";
  //});
  var resPaid = nocRemarks.filter(function (item) {
    return item.applicationstatus == "PAID";
  });

  //if (resApproved.length != 0)
  //  nocStatus = "APPROVED";

  if (resPaid.length != 0)
    nocRemark = "PAID";


  if (nocRemark == "PAID") {
    let getCertificateDataForROADCUT = { "applicationType": "ROADCUTNOC", "tenantId": tenantId, "applicationId": applicationNumber, "dataPayload": { "requestDocumentType": "certificateData" } };

    //ROADCUTNOC
    const response0ROADCUT = await getSearchResultsForNocCretificate([
      { key: "tenantId", value: tenantId },
      { key: "applicationNumber", value: applicationNumber },
      { key: "getCertificateData", value: getCertificateDataForROADCUT },
      { key: "requestUrl", value: "/pm-services/noc/_getCertificateData" }
    ]);

    let getFileStoreIdForROADCUT = { "nocApplicationDetail": [get(response0ROADCUT, "nocApplicationDetail[0]", "")] }
    //dispatch(prepareFinalObject("nocApplicationCertificateDetail", get(response, "nocApplicationDetail", [])));

    const response1ROADCUT = await getSearchResultsForNocCretificate([
      { key: "tenantId", value: tenantId },
      { key: "applicationNumber", value: applicationNumber },
      { key: "getCertificateDataFileStoreId", value: getFileStoreIdForROADCUT },
      { key: "requestUrl", value: "/pdf-service/v1/_create?key=road-noc&tenantId=" + tenantId }
    ]);

    const response2ROADCUT = await getSearchResultsForNocCretificateDownload([
      { key: "tenantId", value: tenantId },
      { key: "applicationNumber", value: applicationNumber },
      { key: "filestoreIds", value: get(response1ROADCUT, "filestoreIds[0]", "") },
      { key: "requestUrl", value: "/filestore/v1/files/url?tenantId=" + tenantId + "&fileStoreIds=" }
    ]);
    httpLinkROADCUT = get(response2ROADCUT, get(response1ROADCUT, "filestoreIds[0]", ""), "")

    //Object creation for NOC's
    certificateDownloadObjectROADCUT = {
      label: { labelName: "NOC Certificate ROADCUT", labelKey: "NOC_CERTIFICATE_ROADCUT" },
      link: () => {
        if (httpLinkROADCUT != "")
          window.location.href = httpLinkROADCUT;
      },
      leftIcon: "book"
    };

    //Receipts
    let getCertificateDataForROADCUT_RECEIPT = { "applicationType": "ROADCUTNOC", "tenantId": tenantId, "applicationId": applicationNumber, "dataPayload": { "requestDocumentType": "receiptData" } };

    //ROADCUTNOC_Receipts
    const response0ROADCUT_RECEIPT = await getSearchResultsForNocCretificate([
      { key: "tenantId", value: tenantId },
      { key: "applicationNumber", value: applicationNumber },
      { key: "getCertificateData", value: getCertificateDataForROADCUT_RECEIPT },
      { key: "requestUrl", value: "/pm-services/noc/_getCertificateData" }
    ]);

    let getFileStoreIdForROADCUT_RECEIPT = { "nocApplicationDetail": [get(response0ROADCUT_RECEIPT, "nocApplicationDetail[0]", "")] }

    const response1ROADCUT_RECEIPT = await getSearchResultsForNocCretificate([
      { key: "tenantId", value: tenantId },
      { key: "applicationNumber", value: applicationNumber },
      { key: "getCertificateDataFileStoreId", value: getFileStoreIdForROADCUT_RECEIPT },
      { key: "requestUrl", value: "/pdf-service/v1/_create?key=roadcut-receipt&tenantId=" + tenantId }
    ]);

    const response2ROADCUT_RECEIPT = await getSearchResultsForNocCretificateDownload([
      { key: "tenantId", value: tenantId },
      { key: "applicationNumber", value: applicationNumber },
      { key: "filestoreIds", value: get(response1ROADCUT_RECEIPT, "filestoreIds[0]", "") },
      { key: "requestUrl", value: "/filestore/v1/files/url?tenantId=" + tenantId + "&fileStoreIds=" }
    ]);
    httpLinkROADCUT_RECEIPT = get(response2ROADCUT_RECEIPT, get(response1ROADCUT_RECEIPT, "filestoreIds[0]", ""), "")

    //Object creation for Receipt's
    certificateDownloadObjectROADCUT_RECEIPT = {
      label: { labelName: "NOC Receipt ROADCUT", labelKey: "NOC_RECEIPT_ROADCUT" },
      link: () => {
        if (httpLinkROADCUT_RECEIPT != "")
          window.location.href = httpLinkROADCUT_RECEIPT;
      },
      leftIcon: "book"
    };

  }

  if (nocRemark == "PAID") {
    downloadMenu = [
      certificateDownloadObjectROADCUT,
      certificateDownloadObjectROADCUT_RECEIPT
    ];
  }
  dispatch(
    handleField(
      "roadcutnoc-search-preview",
      "components.div.children.headerDiv.children.header.children.downloadMenu",
      "props.data.menu",
      downloadMenu
    )
  );

  //setDownloadMenu(state, dispatch);
};


const screenConfig = {
  uiFramework: "material-ui",
  name: "roadcutnoc-search-preview",
  beforeInitScreen: (action, state, dispatch) => {
    const applicationNumber = getQueryArg(window.location.href, "applicationNumber");
    setapplicationNumber(applicationNumber); //localStorage.setItem('ApplicationNumber', applicationNumber); , applicationNumber)
    const tenantId = getQueryArg(window.location.href, "tenantId");
    setOPMSTenantId(tenantId);

    if (JSON.parse(getUserInfo()).type === "EMPLOYEE") {
      set(state,
        "screenConfiguration.preparedFinalObject.documentsUploadRedux[0]",
        {}
      )
      set(state.screenConfiguration.preparedFinalObject, "OPMS[0].RoadCutUpdateStautsDetails.additionalDetail.FieldRoadCutForwardRemarks", "");
      set(state.screenConfiguration.preparedFinalObject, "OPMS[0].RoadCutUpdateStautsDetails.additionalDetail.RoadCutForwardAmount", "");
      set(state.screenConfiguration.preparedFinalObject, "OPMS[0].RoadCutUpdateStautsDetails.additionalDetail.RoadCutForwardGstAmount", "");
      set(state.screenConfiguration.preparedFinalObject, "OPMS[0].RoadCutUpdateStautsDetails.additionalDetail.RoadCutForwardPerformanceBankGuaranteeCharges", "");
      set(state.screenConfiguration.preparedFinalObject, "OPMS[0].RoadCutUpdateStautsDetails.additionalDetail.remarks", "");
    }

    dispatch(fetchLocalizationLabel(getLocale(), tenantId, tenantId));

    //setSearchResponseForNocCretificate(state, dispatch, applicationNumber, tenantId);
    setSearchResponse(state, action, dispatch, applicationNumber, tenantId)

    const queryObject = [
      { key: "tenantId", value: tenantId },
      { key: "businessServices", value: "ROADCUTNOC" }
    ];
    setBusinessServiceDataToLocalStorage(queryObject, dispatch);
    getMdmsData(action, state, dispatch).then(response => {
      prepareDocumentsUploadData(state, dispatch, 'popup_rodcut');
    });

    // Set Documents Data (TEMP)
    preparepopupDocumentsRoadCutUploadData(state, dispatch, 'ROADCUTNOC');

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
            moduleName: "ROADCUTNOC",
          }

        },
        body: checkForRole(roles, 'CITIZEN') ? getCommonCard({
          estimateSummary: estimateSummary,
          roadcutapplicantSummary: roadcutapplicantSummary,
          documentsSummary: documentsSummary,
          taskStatusSummary: taskStatusSummary,
          //   footerCitizen
          //ReassignButton
        }) : getCommonCard({
          // estimateSummary: estimateSummary,
          roadcutapplicantSummary: roadcutapplicantSummary,
          documentsSummary: documentsSummary,

        }),
        footerEmp,
        takeactionfooter



      }
    },
    adhocDialog: {
      uiFramework: "custom-containers-local",
      moduleName: "egov-opms",
      componentPath: "DialogContainer",
      props: {
        open: false,
        maxWidth: "sm",
        screenKey: "roadcutnoc-search-preview"
      },
      children: {

        popup: adhocPopupForJeRoadCutForward
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
        screenKey: "roadcutnoc-search-preview"
      },
      children: {

        popup: adhocPopupForSeRoadCutForward

      }
    },
    adhocDialog1: {
      uiFramework: "custom-containers-local",
      moduleName: "egov-opms",
      componentPath: "ApproveContainer",
      props: {
        open: false,
        maxWidth: "sm",
        screenKey: "roadcutnoc-search-preview"
      },
      children: {

        popup: adhocPopupForCeRoadCutApprove

      }
    },
    adhocDialog3: {
      uiFramework: "custom-containers-local",
      moduleName: "egov-opms",
      componentPath: "RejectContainer",
      props: {
        open: false,
        maxWidth: "sm",
        screenKey: "roadcutnoc-search-preview"
      },
      children: {
        popup: adhocPopupForCeRoadCutReject
      }
    },
    adhocDialog2: {
      uiFramework: "custom-containers-local",
      moduleName: "egov-opms",
      componentPath: "ReassignContainer",
      props: {
        open: false,
        maxWidth: "sm",
        screenKey: "roadcutnoc-search-preview"
      },
      children: {

        popup: adhocPopupForJeRoadCutReassign

      }
    },
  }
};

export default screenConfig;
