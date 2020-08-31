import {
  getCommonCard,
  getCommonContainer, getCommonHeader, getStepperObject, getLabel,
  getBreak
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import {
  handleScreenConfigurationFieldChange as handleField,
  prepareFinalObject
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import {
  getFileUrlFromAPI, getQueryArg,
  getTransformedLocale,
  setBusinessServiceDataToLocalStorage
} from "egov-ui-framework/ui-utils/commons";
import { fetchLocalizationLabel } from "egov-ui-kit/redux/app/actions";
import jp from "jsonpath";
import get from "lodash/get";
import set from "lodash/set";
import { getSearchResultsView, updateAppStatus } from "../../../../ui-utils/commons";
import { searchBill, searchdemand } from "../utils/index";

import { toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { citizenFooter } from "./searchResource/citizenFooter";
import {
  applicantSummary,
  institutionSummary
} from "./summaryResource/applicantSummary";
import { documentsSummary } from "./summaryResource/documentsSummary";
import { estimateSummary } from "./summaryResource/estimateSummary";
import { nocSummary } from "./summaryResource/nocSummary";
import { immunizationSummary } from "./summaryResource/immunizationSummary";
import { getAccessToken, localStorageGet, localStorageSet, getOPMSTenantId, getLocale, getUserInfo, setapplicationNumber } from "egov-ui-kit/utils/localStorageUtils";
import { taskStatusSummary } from './summaryResource/taskStatusSummary';
import { getRequiredDocuments } from "./requiredDocuments/reqDocs";
import { showHideAdhocPopup, showHideAdhocPopups, checkForRole } from "../utils";

import { toggleSpinner } from "egov-ui-framework/ui-redux/screen-configuration/actions";
export const stepsData = [
  { labelName: "PET NOC Details", labelKey: "Applicant_DETAILS" },
  { labelName: "Verternariy Details", labelKey: "STEP_PET_NOC_VETERINARY_DETAILS" },
  { labelName: "Documents", labelKey: "STEP_PET_NOC_DOCUMENTS" },
  { labelName: "Summary", labelKey: "PET_NOC_SUMMARY" }
];
export const stepper = getStepperObject(
  { props: { activeStep: 3 } },
  stepsData
);
import {

  getCommonApplyFooter,

} from "../utils";


let roles = JSON.parse(getUserInfo()).roles

const agree_undertaking = async (state, dispatch) => {
  let tenantId = getOPMSTenantId();
  event.target.checked === true ? localStorageSet("undertaking", "accept") : localStorageSet("undertaking", "")
  event.target.checked === true ? showHideAdhocPopups(state, dispatch, "petnoc_summary") : '';

}


const undertakingButton1 = getCommonContainer({
  addPenaltyRebateButton1: {
    componentPath: "Checkbox",
    props: {
      checked: false,
      variant: "contained",
      color: "primary",
      style: {
        // minWidth: "20",
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
      callBack: (state, dispatch) => showHideAdhocPopups(state, dispatch, "petnoc_summary")
    },
    //checked:true,
    visible: localStorageGet('app_noc_status') === "DRAFT" ? true : false,
  },
  addPenaltyRebateButton: {
    componentPath: "Button",
    props: {
      color: "primary",
      style: {
        //minWidth: "200px",
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
      callBack: (state, dispatch) => showHideAdhocPopups(state, dispatch, "petnoc_summary")
    },
    visible: true,
  }
});

const titlebar = getCommonContainer({
  header: getCommonHeader({
    labelName: "Application for PET NOC",
    labelKey: "PET_NOC_APPLICATION_Detail"
  }),
  applicationNumber: {
    uiFramework: "custom-atoms-local",
    moduleName: "egov-opms",
    componentPath: "ApplicationNoContainer",
    props: {
      number: getQueryArg(window.location.href, "applicationNumber")
    }
  },
});

const routeToPage = (dispatch, type) => {
  let tenantId = getOPMSTenantId();
  const applicationid = getQueryArg(window.location.href, "applicationNumber");
  const appendUrl =
    process.env.REACT_APP_SELF_RUNNING === "true" ? "/egov-ui-framework" : "";
  if (type === "payment") {
    const reviewUrl = `${appendUrl}/egov-opms/pay?applicationNumber=${applicationid}&tenantId=${tenantId}`
    dispatch(toggleSpinner());
    dispatch(setRoute(reviewUrl));
  } else if (type === "home") {
    const reviewUrl = localStorageGet('app_noc_status') === 'REASSIGN' ?
      `/egov-opms/my-applications` : ''
    dispatch(toggleSpinner());
    dispatch(setRoute(reviewUrl));
  }
}


export const callbackforsummaryactionpay = async (state, dispatch) => {
  try {
    dispatch(toggleSpinner());
    let applicationStatus = get(
      state,
      "screenConfiguration.preparedFinalObject.nocApplicationDetail[0].applicationstatus",
      {}
    );

    if (applicationStatus === "DRAFT") {
      if (localStorageGet("undertaking") == "accept") {
        let response = await updateAppStatus(state, dispatch, "INITIATED");
        let responseStatus = get(response, "status", "");
        if (responseStatus == "success") {
          routeToPage(dispatch, "payment")
        }
        else if (responseStatus == "fail" || responseStatus == "Fail") {
          dispatch(toggleSpinner());
          dispatch(toggleSnackbar(true, { labelName: "API ERROR" }, "error"));
        }
      }
      else {
        dispatch(toggleSpinner());
        let errorMessage = {
          labelName:
            "Please Check Undertaking box!",
          labelKey: ""
        };
        dispatch(toggleSnackbar(true, errorMessage, "warning"));
      }
    }
    else if (applicationStatus === "INITIATED") {
      routeToPage(dispatch, "payment")
    }
    else if (applicationStatus === "REASSIGN") {
      let response = await updateAppStatus(state, dispatch, "RESENT");
      let responseStatus = get(response, "status", "");
      if (responseStatus == "success") {
        routeToPage(dispatch, "home")
      }
      else if (responseStatus == "fail" || responseStatus == "Fail") {
        dispatch(toggleSpinner());
        dispatch(toggleSnackbar(true, { labelName: "API ERROR" }, "error"));
      }
    }
    else {
      routeToPage(dispatch, "home")
    }
  } catch (error) {
    dispatch(toggleSpinner());
    console.log(error)
  }
}

export const callbackforsummaryaction = async (state, dispatch) => {
  const appendUrl =
    process.env.REACT_APP_SELF_RUNNING === "true" ? "/egov-ui-framework" : "";
  const reviewUrl = `${appendUrl}/egov-opms/my-applications`;
  dispatch(setRoute(reviewUrl));
};


var titlebarfooter = getCommonApplyFooter({
  previousButton: {
    componentPath: "Button",
    props: {
      variant: "outlined",
      color: "primary",
      style: {
        minWidth: "180px",
        height: "48px",
        marginRight: "16px",

      }
    },
    children: {
      cancelButtonIcon: {
        uiFramework: "custom-atoms",
        componentPath: "Icon",
        props: {
          iconName: "keyboard_arrow_left"
        }
      },
      previousButtonLabel: getLabel({
        labelName: "Previous Step",
        labelKey: "NOC_CANCEL_BUTTON"
      })
    },
    onClickDefination: {
      action: "condition",
      callBack: callbackforsummaryaction
    },
    visible: true
  },
  submitButton: {
    componentPath: "Button",
    props: {
      variant: "contained",
      color: "primary",
      style: {
        minWidth: "180px",
        height: "48px",
        marginRight: "16px"
      }
    },
    children: {
      nextButtonLabel: getLabel({
        labelName: "RESEND",
        labelKey: "NOC_SUBMIT_BUTTON"
      }),
      nextButtonIcon: {
        uiFramework: "custom-atoms",
        componentPath: "Icon",
        props: {
          iconName: "keyboard_arrow_right"
        }
      }
    },
    onClickDefination: {
      action: "condition",
      callBack: callbackforsummaryactionpay
    }
  }
});

const prepareDocumentsView = async (state, dispatch) => {
  let documentsPreview = [];

  // Get all documents from response
  let petnocdetail = get(state, "screenConfiguration.preparedFinalObject.nocApplicationDetail[0].applicationdetail", {});

  if (petnocdetail) {
    let uploadVaccinationCertificate = JSON.parse(petnocdetail).hasOwnProperty('uploadVaccinationCertificate') ?
      JSON.parse(petnocdetail).uploadVaccinationCertificate[0]['fileStoreId'] : '';

    let uploadPetPicture = JSON.parse(petnocdetail).hasOwnProperty('uploadPetPicture') ?
      JSON.parse(petnocdetail).uploadPetPicture[0]['fileStoreId'] : '';

    let allDocuments = [];
    allDocuments.push(uploadVaccinationCertificate)
    allDocuments.push(uploadPetPicture)


    if (uploadVaccinationCertificate !== '' && uploadPetPicture !== '') {
      documentsPreview.push({
        title: "uploadVaccinationCertificate",
        fileStoreId: uploadVaccinationCertificate,
        linkText: "View"
      }, {
        title: "uploadPetPicture",
        fileStoreId: uploadPetPicture,
        linkText: "View"
      });
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

      dispatch(prepareFinalObject("documentsPreview", documentsPreview));
    }
  }
};

const setSearchResponse = async (state, dispatch, applicationNumber, tenantId) => {
  const response = await getSearchResultsView([
    { key: "tenantId", value: tenantId },
    { key: "applicationNumber", value: applicationNumber }
  ]);
  if (response === undefined) {
    dispatch(setRoute(`/egov-opms/invalidIdErrorPage?applicationNumber=${applicationNumber}&tenantId=${tenantId}`))
  }
  else {
    dispatch(prepareFinalObject("nocApplicationDetail", get(response, "nocApplicationDetail", [])));

    prepareDocumentsView(state, dispatch);
  }
};



const screenConfig = {
  uiFramework: "material-ui",
  name: "petnoc_summary",
  beforeInitScreen: (action, state, dispatch) => {
    const applicationNumber = getQueryArg(window.location.href, "applicationNumber");
    setapplicationNumber(applicationNumber);
    const tenantId = getQueryArg(window.location.href, "tenantId");
    dispatch(fetchLocalizationLabel(getLocale(), tenantId, tenantId));

    searchBill(dispatch, applicationNumber, tenantId);


    setSearchResponse(state, dispatch, applicationNumber, tenantId);

    const queryObject = [
      { key: "tenantId", value: tenantId },
      { key: "businessServices", value: "PETNOC" }
    ];

    setBusinessServiceDataToLocalStorage(queryObject, dispatch);
    //Set Module Name
    set(state, "screenConfiguration.moduleName", "opms");
    set(
      action,
      "screenConfig.components.undertakingdialog.children.popup",
      getRequiredDocuments()
    );
    set(
      action, "screenConfig.components.div.children.body.children.cardContent.children.undertakingButton1.children.addPenaltyRebateButton1.visible",
      localStorageGet("app_noc_status") !== 'REASSIGN' ? true : false)

    set(
      action, "screenConfig.components.div.children.body.children.cardContent.children.undertakingButton1.children.addPenaltyRebateButton.visible",
      localStorageGet("app_noc_status") !== 'REASSIGN' ? true : false)



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
        stepper,
        taskStatus: {
          uiFramework: "custom-containers-local",
          componentPath: "WorkFlowContainer",
          moduleName: "egov-workflow",
          visible: process.env.REACT_APP_NAME === "Citizen" ? false : true,
          props: {
            dataPath: "nocApplicationDetail",
            moduleName: "petnoc_summary"
          }
        },
        body: checkForRole(roles, 'CITIZEN') ? getCommonCard({

          estimateSummary: estimateSummary,
          applicantSummary: applicantSummary,
          nocSummary: nocSummary,
          immunizationSummary: immunizationSummary,
          documentsSummary: documentsSummary,
          undertakingButton1
          //taskStatusSummary: taskStatusSummary,
        }) : getCommonCard({
          estimateSummary: estimateSummary,
          applicantSummary: applicantSummary,
          nocSummary: nocSummary,
          immunizationSummary: immunizationSummary,
          documentsSummary: documentsSummary
        })
        ,
        break: getBreak(),
        titlebarfooter
        // citizenFooter:
        //   process.env.REACT_APP_NAME === "Citizen" ? citizenFooter : citizenFooter
      }
    }, undertakingdialog: {
      uiFramework: "custom-containers-local",
      moduleName: "egov-opms",
      componentPath: "UnderTakingContainer",
      props: {
        open: false,
        maxWidth: "md",
        screenKey: "petnoc_summary"
      },
      children: {
        popup: {}
      }
    }
  }
};

export default screenConfig;
