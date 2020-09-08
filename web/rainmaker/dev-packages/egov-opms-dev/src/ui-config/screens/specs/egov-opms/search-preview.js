import {
  getCommonCard,
  getCommonContainer,
  getCommonHeader,
  getLabelWithValue,
  getLabel,
  getBreak
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { httpRequest } from "../../../../ui-utils";
import {
  handleScreenConfigurationFieldChange as handleField,
  prepareFinalObject
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import {
  localStorageGet, localStorageSet, setapplicationNumber, getOPMSTenantId, setapplicationType,
  getAccessToken, getLocale, getUserInfo, getapplicationType, getapplicationNumber, setOPMSTenantId
} from "egov-ui-kit/utils/localStorageUtils";
import {
  getFileUrlFromAPI,
  getQueryArg,
  getTransformedLocale,
  setBusinessServiceDataToLocalStorage
} from "egov-ui-framework/ui-utils/commons";
import { gotoApplyWithStep } from "../utils/index";
import { fetchLocalizationLabel } from "egov-ui-kit/redux/app/actions";
import jp from "jsonpath";
import get from "lodash/get";
import set from "lodash/set";
import { searchBill } from "../utils/index";

import { footer } from "./applyResource/employeeFooter";
//import { footer ,footerReview} from "./applyResource/footer";
import { showHideAdhocPopup, showHideAdhocPopups, checkForRole } from "../utils";
import { getRequiredDocuments } from "./requiredDocuments/reqDocsPreview";
import { adhocPopup5, adhocPopup1, adhocPopup2, adhocPopup3, adhocPopup4 } from "./payResource/adhocPopup";
import {
  applicantSummary, institutionSummary
} from "./summaryResource/applicantSummary";
import { documentsSummary } from "./summaryResource/documentsSummary";
import { estimateSummary } from "./summaryResource/estimateSummary";
import { nocSummary } from "./summaryResource/nocSummary";
import { immunizationSummary } from "./summaryResource/immunizationSummary";
import { taskStatusSummary } from "./summaryResource/taskStatusSummary";
import {
  getSearchResultsView, getSearchResultsForNocCretificate,
  getSearchResultsForNocCretificateDownload, preparepopupDocumentsUploadData, prepareDocumentsUploadData, checkVisibility, setCurrentApplicationProcessInstance
} from "../../../../ui-utils/commons";
import { citizenFooter } from "./searchResource/citizenFooter";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";


let roles = JSON.parse(getUserInfo()).roles


const agree_undertaking = async (state, dispatch) => {
  let tenantId = getOPMSTenantId();
  event.target.checked === true ? localStorageSet("undertaking", "accept") : localStorageSet("undertaking", "")
  event.target.checked === true ? showHideAdhocPopups(state, dispatch, "search-preview") : '';

}


const undertakingButton1 = getCommonContainer({
  addPenaltyRebateButton1: {
    componentPath: "Checkbox",
    props: {
      checked: false,
      variant: "contained",
      color: "primary",
      style: {
        minWidth: "20",
        height: "10px",
        marginRight: "5px",
        marginTop: "15px"
      }
    },
    children: {
      previousButtonLabel: getLabel({
        labelName: "Undertaking",
        labelKey: "NOC_UNDERTAKING"
      }),
    },
    onClickDefination: {
      action: "condition",
      callBack: (state, dispatch) => showHideAdhocPopups(state, dispatch, "search-preview")
    },
    //checked:true,
    visible: localStorageGet('app_noc_status') === "DRAFT" ? true : false,
  },
  addPenaltyRebateButton: {
    componentPath: "Button",
    props: {
      color: "primary",
      style: {
        //   minWidth: "200px",
        height: "48px",
        marginRight: "40px",
        paddingLeft: "0px",
        paddingBottom: "14px",
        textTransform: "capitalize"
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
      callBack: (state, dispatch) => showHideAdhocPopups(state, dispatch, "search-preview")
    },
    visible: localStorageGet('app_noc_status') === 'DRAFT' ? true : false,
  },
  resendButton: {
    componentPath: "Button",
    props: {
      variant: "contained",
      color: "primary",
      style: {
        minWidth: "180px",
        height: "48px",
        marginRight: "45px",
        borderRadius: "inherit",
        align: "right"
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
    visible: false

  }
});

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
      number: getapplicationNumber(),
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
        props: { variant: "outlined", style: { marginLeft: 10, marginTop: "5px" } },
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
              name: "color"
            },
            {
              name: "sector"
            },
            {
              name: "breed"
            },
            {
              name: "sex"
            },
            {
              name: "age"
            }
          ]
        },
        { moduleName: "PetNOC", masterDetails: [{ name: "Documents" }, { name: "RemarksDocuments" }] }
      ]
    }
  };
  try {
    let payload = null;
    payload = await httpRequest("post", "/egov-mdms-service/v1/_search", "_search", [], mdmsBody);

    dispatch(prepareFinalObject("applyScreenMdmsData", payload.MdmsRes));
  } catch (e) {
    console.log(e);
  }
};



const prepareDocumentsView = async (state, dispatch) => {
  let documentsPreview = [];

  // Get all documents from response
  let petnocdetail = get(
    state,
    "screenConfiguration.preparedFinalObject.nocApplicationDetail[0]",
    {}
  );
  let uploadVaccinationCertificate = JSON.parse(petnocdetail.applicationdetail).hasOwnProperty('uploadVaccinationCertificate') ?
    JSON.parse(petnocdetail.applicationdetail).uploadVaccinationCertificate[0]['fileStoreId'] : '';

  let uploadPetPicture = JSON.parse(petnocdetail.applicationdetail).hasOwnProperty('uploadPetPicture') ?
    JSON.parse(petnocdetail.applicationdetail).uploadPetPicture[0]['fileStoreId'] : '';

  if (uploadVaccinationCertificate !== '' && uploadPetPicture !== '') {
    documentsPreview.push({
      title: "VACCINATION_CERTIFIACTE",
      fileStoreId: uploadVaccinationCertificate,
      linkText: "View"
    },
      {
        title: "PET_PICTURE",
        fileStoreId: uploadPetPicture,
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


const setSearchResponse = async (state, dispatch, action, applicationNumber, tenantId) => {
  const response = await getSearchResultsView([
    { key: "tenantId", value: tenantId },
    { key: "applicationNumber", value: applicationNumber }
  ]);
  if (response === undefined) {
    dispatch(setRoute(`/egov-opms/invalidIdErrorPage?applicationNumber=${applicationNumber}&tenantId=${tenantId}`))
  }
  else {
    dispatch(prepareFinalObject("nocApplicationDetail", get(response, "nocApplicationDetail", [])));
    dispatch(prepareFinalObject("nocApplicationReceiptDetail", get(response, "nocApplicationDetail", [])));
    dispatch(prepareFinalObject("nocApplicationCertificateDetail", get(response, "nocApplicationDetail", [])));

    dispatch(prepareFinalObject("PetNoc[0].PetNocDetails.Approve.badgeNumber", JSON.parse(response.nocApplicationDetail[0].applicationdetail).badgeNumber));

    let nocStatus = get(state, "screenConfiguration.preparedFinalObject.nocApplicationDetail[0].applicationstatus", {});
    localStorageSet("app_noc_status", nocStatus);
    await setCurrentApplicationProcessInstance(state);
    HideshowEdit(state, action, nocStatus);


    prepareDocumentsView(state, dispatch);

    if (checkForRole(roles, 'CITIZEN')) {

      setSearchResponseForNocCretificate(state, dispatch, action, applicationNumber, tenantId);
    }
  }

};

let httpLinkPET;
let httpLinkPET_RECEIPT;

const HideshowEdit
  = (state, action, nocStatus) => {

    let showEdit = false;
    if (nocStatus === "REASSIGN" || nocStatus === "DRAFT") {
      showEdit = true;
    }
    set(
      action,
      "screenConfig.components.div.children.body.children.cardContent.children.applicantSummary.children.cardContent.children.header.children.editSection.visible",
      checkForRole(roles, 'CITIZEN') ? showEdit === true ? true : false : false
    );

    set(
      action,
      "screenConfig.components.div.children.body.children.cardContent.children.nocSummary.children.cardContent.children.header.children.editSection.visible",
      checkForRole(roles, 'CITIZEN') ? showEdit === true ? true : false : false
    );
    set(
      action,
      "screenConfig.components.div.children.body.children.cardContent.children.immunizationSummary.children.cardContent.children.header.children.editSection.visible",
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

    set(
      action,
      "screenConfig.components.div.children.footer.children.previousButton.visible",
      checkForRole(roles, 'CITIZEN') ?
        nocStatus === "DRAFT" || nocStatus === "INITIATED" || nocStatus === "REASSIGN" ?
          true
          : false
        : false
    );
    set(
      action, "screenConfig.components.div.children.body.children.cardContent.children.undertakingButton1.children.addPenaltyRebateButton1.visible",
      nocStatus === "DRAFT" ? true : false)

    set(
      action, "screenConfig.components.div.children.body.children.cardContent.children.undertakingButton1.children.addPenaltyRebateButton.visible",
      nocStatus === "DRAFT" ? true : false)
    set(
      action,
      "screenConfig.components.div.children.footer.children.submitButton.visible",
      checkForRole(roles, 'CITIZEN') ?
        nocStatus === "DRAFT" || nocStatus === "INITIATED" || nocStatus === "REASSIGN" ?
          true
          : false
        : false
    );

    set(state, 'screenConfiguration.preparedFinalObject.WFStatus', []);
    checkVisibility(state, "REJECTED", "reject", action, "screenConfig.components.div.children.footer.children.reject.visible", null)
    checkVisibility(state, "APPROVED", "approve", action, "screenConfig.components.div.children.footer.children.approve.visible", null)
    checkVisibility(state, "REASSIGN,REASSIGNTOSI", "reassign", action, "screenConfig.components.div.children.footer.children.reassign.visible", null)
    checkVisibility(state, "FORWARD", "nextButton", action, "screenConfig.components.div.children.footer.children.nextButton.visible", null)


  }
const setSearchResponseForNocCretificate = async (state, dispatch, action, applicationNumber, tenantId) => {

  let downloadMenu = [];
  let certificateDownloadObjectPET_RECEIPT = {};
  let certificateDownloadObjectPET = {};
  let nocRemarks = get(state, "screenConfiguration.preparedFinalObject.nocApplicationDetail[0].remarks", {});
  //let nocStatus = get(state, "screenConfiguration.preparedFinalObject.nocApplicationDetail[0].applicationstatus", {});


  let nocRemark = "";
  let nocStatus = "";

  var resApproved = nocRemarks.filter(function (item) {
    return item.applicationstatus == "APPROVED";
  });
  var resPaid = nocRemarks.filter(function (item) {
    return item.applicationstatus == "PAID";
  });

  if (resApproved.length != 0)
    nocStatus = "APPROVED";

  if (resPaid.length != 0)
    nocRemark = "PAID";


  if (nocStatus == "APPROVED") {
    let getCertificateDataForPET = { "applicationType": "PETNOC", "tenantId": tenantId, "applicationId": applicationNumber, "dataPayload": { "requestDocumentType": "certificateData" } };

    //PETNOC
    const response0PET = await getSearchResultsForNocCretificate([
      { key: "tenantId", value: tenantId },
      { key: "applicationNumber", value: applicationNumber },
      { key: "getCertificateData", value: getCertificateDataForPET },
      { key: "requestUrl", value: "/pm-services/noc/_getCertificateData" }
    ]);

    let getFileStoreIdForPET = { "nocApplicationDetail": [get(response0PET, "nocApplicationDetail[0]", "")] }
    //dispatch(prepareFinalObject("nocApplicationCertificateDetail", get(response, "nocApplicationDetail", [])));

    const response1PET = await getSearchResultsForNocCretificate([
      { key: "tenantId", value: tenantId },
      { key: "applicationNumber", value: applicationNumber },
      { key: "getCertificateDataFileStoreId", value: getFileStoreIdForPET },
      { key: "requestUrl", value: "/pdf-service/v1/_create?key=pet-noc&tenantId=" + tenantId }
    ]);

    const response2PET = await getSearchResultsForNocCretificateDownload([
      { key: "tenantId", value: tenantId },
      { key: "applicationNumber", value: applicationNumber },
      { key: "filestoreIds", value: get(response1PET, "filestoreIds[0]", "") },
      { key: "requestUrl", value: "/filestore/v1/files/url?tenantId=" + tenantId + "&fileStoreIds=" }
    ]);
    httpLinkPET = get(response2PET, get(response1PET, "filestoreIds[0]", ""), "")

    //Object creation for NOC's
    certificateDownloadObjectPET = {
      label: { labelName: "NOC Certificate PET", labelKey: "NOC_CERTIFICATE_PET" },
      link: () => {
        if (httpLinkPET != "")
          window.location.href = httpLinkPET;
      },
      leftIcon: "book"
    };

  }
  if (nocRemark == "PAID") {
    //Receipts
    let getCertificateDataForPET_RECEIPT = { "applicationType": "PETNOC", "tenantId": tenantId, "applicationId": applicationNumber, "dataPayload": { "requestDocumentType": "receiptData" } };

    //PETNOC_Receipts
    const response0PET_RECEIPT = await getSearchResultsForNocCretificate([
      { key: "tenantId", value: tenantId },
      { key: "applicationNumber", value: applicationNumber },
      { key: "getCertificateData", value: getCertificateDataForPET_RECEIPT },
      { key: "requestUrl", value: "/pm-services/noc/_getCertificateData" }
    ]);

    let getFileStoreIdForPET_RECEIPT = { "nocApplicationDetail": [get(response0PET_RECEIPT, "nocApplicationDetail[0]", "")] }

    const response1PET_RECEIPT = await getSearchResultsForNocCretificate([
      { key: "tenantId", value: tenantId },
      { key: "applicationNumber", value: applicationNumber },
      { key: "getCertificateDataFileStoreId", value: getFileStoreIdForPET_RECEIPT },
      { key: "requestUrl", value: "/pdf-service/v1/_create?key=pet-receipt&tenantId=" + tenantId }
    ]);

    const response2PET_RECEIPT = await getSearchResultsForNocCretificateDownload([
      { key: "tenantId", value: tenantId },
      { key: "applicationNumber", value: applicationNumber },
      { key: "filestoreIds", value: get(response1PET_RECEIPT, "filestoreIds[0]", "") },
      { key: "requestUrl", value: "/filestore/v1/files/url?tenantId=" + tenantId + "&fileStoreIds=" }
    ]);
    httpLinkPET_RECEIPT = get(response2PET_RECEIPT, get(response1PET_RECEIPT, "filestoreIds[0]", ""), "")

    //Object creation for Receipt's
    certificateDownloadObjectPET_RECEIPT = {
      label: { labelName: "NOC Receipt PET", labelKey: "NOC_RECEIPT_PET" },
      link: () => {
        if (httpLinkPET_RECEIPT != "")
          window.location.href = httpLinkPET_RECEIPT;
      },
      leftIcon: "book"
    };

  }

  if (nocStatus == "APPROVED" && nocRemark == "PAID") {
    downloadMenu = [
      certificateDownloadObjectPET,
      certificateDownloadObjectPET_RECEIPT
    ];
  } else if (nocStatus == "APPROVED") {
    downloadMenu = [
      certificateDownloadObjectPET
    ];
  } else if (nocRemark == "PAID") {
    downloadMenu = [
      certificateDownloadObjectPET_RECEIPT
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

};

const screenConfig = {
  uiFramework: "material-ui",
  name: "search-preview",
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
      set(state.screenConfiguration.preparedFinalObject, "PetNoc[0].PetNocDetails.additionalDetail.remarks", "");
      set(state.screenConfiguration.preparedFinalObject, "PetNoc[0].PetNocDetails.Reaasign.remarks", "");
      set(state.screenConfiguration.preparedFinalObject, "PetNoc[0].PetNocDetails.Reject.remarks", "");
      set(state.screenConfiguration.preparedFinalObject, "PetNoc[0].PetNocDetails.Approve.remarks", "");
    }

    dispatch(fetchLocalizationLabel(getLocale(), tenantId, tenantId));
    searchBill(dispatch, applicationNumber, tenantId);
    setSearchResponse(state, dispatch, action, applicationNumber, tenantId);
    const queryObject = [
      { key: "tenantId", value: tenantId },
      { key: "businessServices", value: "PETNOC" }
    ];
    setBusinessServiceDataToLocalStorage(queryObject, dispatch);


    //Set Module Name
    set(state, "screenConfiguration.moduleName", "opms");
    setapplicationType('PETNOC');
    // Set MDMS Data
    getMdmsData(action, state, dispatch).then(response => {
      prepareDocumentsUploadData(state, dispatch, 'popup_pet');
    });
    set(
      action,
      "screenConfig.components.undertakingdialog.children.popup",
      getRequiredDocuments()
    );
    // Set Documents Data (TEMP)
    preparepopupDocumentsUploadData(state, dispatch, 'PETNOC');

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
            moduleName: "PETNOC",
          }

        },
        body: checkForRole(roles, 'CITIZEN') ? getCommonCard({
          estimateSummary: estimateSummary,
          applicantSummary: applicantSummary,
          nocSummary: nocSummary,
          immunizationSummary: immunizationSummary,
          documentsSummary: documentsSummary,
          taskStatusSummary: taskStatusSummary,
          undertakingButton1
        })

          :
          getCommonCard({
            estimateSummary: estimateSummary,
            applicantSummary: applicantSummary,
            nocSummary: nocSummary,
            immunizationSummary: immunizationSummary,
            documentsSummary: documentsSummary

          }),
        // citizenFooter:
        //   process.env.REACT_APP_NAME === "Citizen" ? citizenFooter : {}
        footer: footer

      }
    },
    undertakingdialog: {
      uiFramework: "custom-containers-local",
      moduleName: "egov-opms",
      componentPath: "UnderTakingContainer",
      props: {
        open: false,
        maxWidth: "md",
        screenKey: "search-preview"
      },
      children: {

        popup: {}
        //popup:adhocPopup1

      }
    },
    adhocDialog: {
      uiFramework: "custom-containers-local",
      moduleName: "egov-opms",
      componentPath: "DialogContainer",
      props: {
        open: false,
        maxWidth: "sm",
        screenKey: "search-preview"
      },
      children: {

        popup: adhocPopup1
        // popup:adhocPopup2

      }
    },
    adhocDialog2: {
      uiFramework: "custom-containers-local",
      moduleName: "egov-opms",
      componentPath: "ReassignContainer",
      props: {
        open: false,
        maxWidth: "sm",
        screenKey: "search-preview"
      },
      children: {

        popup: adhocPopup2

      }
    },
    adhocDialog1: {
      uiFramework: "custom-containers-local",
      moduleName: "egov-opms",
      componentPath: "ApproveContainer",
      props: {
        open: false,
        maxWidth: "sm",
        screenKey: "search-preview"
      },
      children: {
        popup: adhocPopup3
      }
    },
    adhocDialog3: {
      uiFramework: "custom-containers-local",
      moduleName: "egov-opms",
      componentPath: "RejectContainer",
      props: {
        open: false,
        maxWidth: "sm",
        screenKey: "search-preview"
      },
      children: {

        popup: adhocPopup4

      }
    }
  }
};

export default screenConfig;
