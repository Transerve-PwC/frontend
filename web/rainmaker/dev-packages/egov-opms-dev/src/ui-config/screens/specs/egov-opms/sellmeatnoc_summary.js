import {
  getBreak, getCommonCard, getCommonContainer, getCommonHeader, getLabelWithValue, getStepperObject, getLabel
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import { handleScreenConfigurationFieldChange as handleField, prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getFileUrlFromAPI, getQueryArg, getTransformedLocale, setBusinessServiceDataToLocalStorage } from "egov-ui-framework/ui-utils/commons";
import { fetchLocalizationLabel } from "egov-ui-kit/redux/app/actions";
import jp from "jsonpath";
import get from "lodash/get";
import set from "lodash/set";
import { getSearchResultsView, updateAppStatus } from "../../../../ui-utils/commons";
import { toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";

import { citizenFooter } from "./searchResource/citizenFooter";
import { documentsSummary } from "./summaryResource/documentsSummary";
import {
  sellmeatapplicantSummary
} from "./summaryResource/sellmeatapplicantSummary";
import {
  getAccessToken,
  getOPMSTenantId,
  getLocale,
  getUserInfo,
  localStorageGet,
  setapplicationNumber
} from "egov-ui-kit/utils/localStorageUtils";
import { toggleSpinner } from "egov-ui-framework/ui-redux/screen-configuration/actions";

import { checkForRole } from "../utils";
export const stepsData = [
  { labelName: "Sell Meat NOC Details", labelKey: "SELLMEATNOC_APPLICANT_DETAILS_NOC" },
  { labelName: "Documents", labelKey: "SELLMEATNOC_STEP_DOCUMENTS_NOC" },
  { labelName: "Summary", labelKey: "SELLMEATNOC_SUMMARY" }
];
export const stepper = getStepperObject(
  { props: { activeStep: 2 } },
  stepsData
);
import {

  getCommonApplyFooter,

} from "../utils";


const undertakingsellmeatButton = getCommonContainer({

  downloadcard: {
    uiFramework: "custom-molecules-local",
    moduleName: "egov-opms",
    componentPath: "SampleDownloadForSellMeat",

    visible: true,
  },

});

let roles = JSON.parse(getUserInfo()).roles

//alert('CITIZEN');

const titlebar = getCommonContainer({
  header: getCommonHeader({
    labelName: "Application for Sell Meat",
    labelKey: "SELLMEAT_APPLY_NOC"
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

const routePage = (dispatch) => {
  const appendUrl =
    process.env.REACT_APP_SELF_RUNNING === "true" ? "/egov-ui-framework" : "";
  const reviewUrl = `${appendUrl}/egov-opms/sellmeatnoc-my-applications`;
  dispatch(toggleSpinner());
  dispatch(setRoute(reviewUrl));

}

// REdirect to home page on submit 
export const callBackForNexthome = async (state, dispatch) => {
  try {
    dispatch(toggleSpinner());

    let applicationStatus = get(
      state,
      "screenConfiguration.preparedFinalObject.nocApplicationDetail[0].applicationstatus",
      {}
    );

    if (applicationStatus === "DRAFT") {
      let response = await updateAppStatus(state, dispatch, "INITIATED");
      let responseStatus = get(response, "status", "");
      if (responseStatus == "success") {
        routePage(dispatch);
      }
      else if (responseStatus == "fail" || responseStatus == "Fail") {
        dispatch(toggleSpinner());
        dispatch(toggleSnackbar(true, { labelName: "API ERROR" }, "error"));
      }
    } else if (applicationStatus === "REASSIGN") {
      let response = await updateAppStatus(state, dispatch, "RESENT");
      let responseStatus = get(response, "status", "");
      if (responseStatus == "success") {
        routePage(dispatch);
      }
      else if (responseStatus == "fail" || responseStatus == "Fail") {
        dispatch(toggleSpinner());
        dispatch(toggleSnackbar(true, { labelName: "API ERROR" }, "error"));
      }
    }
    else {
      routePage(dispatch);
    }
  } catch (error) {
    dispatch(toggleSpinner());
    console.log(error);
  }

};

export const callBackForCancel = async (state, dispatch) => {
  const appendUrl =
    process.env.REACT_APP_SELF_RUNNING === "true" ? "/egov-ui-framework" : "";
  const reviewUrl = `${appendUrl}/egov-opms/sellmeatnoc-my-applications`;
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
      callBack: callBackForCancel
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
      callBack: callBackForNexthome
    }
  }
});

const prepareDocumentsView = async (state, dispatch) => {
  let documentsPreview = [];

  // Get all documents from response
  let SELLMEATNOC = get(state, "screenConfiguration.preparedFinalObject.nocApplicationDetail[0]", {});

  let uploadDocuments = SELLMEATNOC.hasOwnProperty('applicationdetail') ? JSON.parse(SELLMEATNOC.applicationdetail).hasOwnProperty('uploadDocuments') ?
    JSON.parse(SELLMEATNOC.applicationdetail).uploadDocuments[0]['fileStoreId'] : '' : '';

  let allDocuments = [];
  // allDocuments.push(uploadVaccinationCertificate)
  allDocuments.push(uploadDocuments)


  if (uploadDocuments !== '') {
    documentsPreview.push({
      title: "SELLMEAT.PROOF_POSSESSION_RENT_AGREEMENT",
      fileStoreId: uploadDocuments,
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
};

const setSearchResponse = async (
  state,
  dispatch,
  applicationNumber,
  tenantId
) => {
  const response = await getSearchResultsView([
    {
      key: "tenantId",
      value: tenantId
    },
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
  name: "sellmeatnoc_summary",
  beforeInitScreen: (action, state, dispatch) => {
    const applicationNumber = getQueryArg(
      window.location.href,
      "applicationNumber"
    );
    setapplicationNumber(applicationNumber);

    const tenantId = getQueryArg(window.location.href, "tenantId");
    dispatch(fetchLocalizationLabel(getLocale(), tenantId, tenantId));


    setSearchResponse(state, dispatch, applicationNumber, tenantId);

    const queryObject = [
      { key: "tenantId", value: tenantId },
      { key: "businessServices", value: "SELLMEATNOC" }
    ];
    setBusinessServiceDataToLocalStorage(queryObject, dispatch);


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
            moduleName: "OPMS",
            //updateUrl: "/opms-services/v1/_update"
          }
        },
        body: checkForRole(roles, 'CITIZEN') ? getCommonCard({
          sellmeatapplicantSummary: sellmeatapplicantSummary,
          documentsSummary: documentsSummary,
          undertakingsellmeatButton: undertakingsellmeatButton
          //taskStatusSummary:taskStatusSummary

        }) : getCommonCard({
          sellmeatapplicantSummary: sellmeatapplicantSummary,
          documentsSummary: documentsSummary
        })
        ,
        break: getBreak(),
        titlebarfooter,
        // citizenFooter:
        //   process.env.REACT_APP_NAME === "Citizen" ? citizenFooter : citizenFooter
      }
    }
  }
};

export default screenConfig;
