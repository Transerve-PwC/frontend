import { getCommonContainer, getCommonHeader, getStepperObject } from "egov-ui-framework/ui-config/screens/specs/utils";
import { footer } from "./applyResourceRoadCut/footer";
import { nocDetails } from "./applyResourceRoadCut/nocDetails";
import { documentDetails } from "./applyResourceRoadCut/documentDetails";
import { getFileUrlFromAPI, getQueryArg, getTransformedLocale, setBusinessServiceDataToLocalStorage } from "egov-ui-framework/ui-utils/commons";
import { prepareFinalObject, handleScreenConfigurationFieldChange as handleField } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getOPMSTenantId, setapplicationType, getUserInfo, setapplicationNumber, lSRemoveItem, lSRemoveItemlocal } from "egov-ui-kit/utils/localStorageUtils";
import { httpRequest } from "../../../../ui-utils";
import set from "lodash/set";
import get from "lodash/get";
import jp from "jsonpath";
import { getCurrentFinancialYear, clearlocalstorageAppDetails } from "../utils";

import {
  prepareDocumentsUploadData, getSearchResultsView, furnishRoadcutNocResponse,
  setApplicationNumberBox
} from "../../../../ui-utils/commons";

export const stepsData = [
  { labelName: "Road Cut NOC Details", labelKey: "ROADCUT_APPLICANT_DETAILS_NOC" },
  { labelName: "Documents", labelKey: "ROADCUT_STEP_DOCUMENTS_NOC" },
  { labelName: "Summary", labelKey: "SELLMEATNOC_SUMMARY" }
  //{ labelName: "Application Summary", labelKey: "ROADCUT_STEP_APPLICANTION_SUMMARY_NOC" }
];
export const stepper = getStepperObject(
  { props: { activeStep: 0 } },
  stepsData
);

const applicationNumberContainer = () => {
  const applicationNumber = getQueryArg(
    window.location.href,
    "applicationNumber"
  );
  if (applicationNumber)
    return {
      uiFramework: "custom-atoms-local",
      moduleName: "egov-opms",
      componentPath: "ApplicationNoContainer",
      props: {
        number: `${applicationNumber}`,
        visibility: "hidden"
      },
      visible: true
    };
  else return {};
};

export const header = getCommonContainer({
  header: getCommonHeader({
    labelName: `Apply New Permission for Road Cut NOC`, //later use getFinancialYearDates
    labelKey: "ROADCUT_COMMON_APPLY_NOC"
  }),
  //applicationNumber: applicationNumberContainer()
  applicationNumber: {
    uiFramework: "custom-atoms-local",
    moduleName: "egov-opms",
    componentPath: "ApplicationNoContainer",
    props: {
      number: "NA"
    },
    visible: false
  }
});

export const formwizardFirstStep = {
  uiFramework: "custom-atoms",
  componentPath: "Form",
  props: {
    id: "apply_form1"
  },
  children: {
    nocDetails
  }
};

export const formwizardSecondStep = {
  uiFramework: "custom-atoms",
  componentPath: "Form",
  props: {
    id: "apply_form2"
  },
  children: {
    documentDetails
  },
  visible: false
};

export const formwizardThirdStep = {
  uiFramework: "custom-atoms",
  componentPath: "Form",
  props: {
    id: "apply_form3"
  },
  children: {
    //roadcutnoc_summary
  },
  visible: false
};

// export const formwizardThirdStep = {
//   uiFramework: "custom-atoms",
//   componentPath: "Form",
//   props: {
//     id: "apply_form3"
//   },
//   children: {
//     //documentuploadDetails
//   },
//   visible: false
// };


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
              name: "length"
            },
            {
              name: "sector"
            },
            {
              name: "purposeOfRoadCutting"
            },
            {
              name: "RoadCutTypeOfApplicant"
            },

            {
              name: "roadCutDivision"
            },
            {
              name: "roadCutType"
            }
          ]
        },
        {
          moduleName: "RoadCutNOC",
          masterDetails: [
            {
              name: "RoadCutDocuments"
            }
          ]
        }
      ]
    }
  };
  try {
    let payload = null;
    payload = await httpRequest(
      "post", "/egov-mdms-service/v1/_search", "_search", [], mdmsBody);
    dispatch(prepareFinalObject("applyScreenMdmsData", payload.MdmsRes));
  } catch (e) {
    console.log(e);
  }
};

const getFirstListFromDotSeparated = list => {
  list = list.map(item => {
    if (item.active) {
      return item.code.split(".")[0];
    }
  });
  list = [...new Set(list)].map(item => {
    return { code: item };
  });
  return list;
};

export const prepareEditFlow = async (state, dispatch, applicationNumber, tenantId) => {
  if (applicationNumber) {
    let response = await getSearchResultsView([
      { key: "tenantId", value: tenantId },
      { key: "applicationNumber", value: applicationNumber }
    ]);

    let Refurbishresponse = furnishRoadcutNocResponse(response);
    dispatch(prepareFinalObject("ROADCUTNOC", Refurbishresponse));
    if (applicationNumber) {
      setapplicationNumber(applicationNumber);
      setApplicationNumberBox(state, dispatch, applicationNumber);
    }
    let documentsPreview = [];
    // Get all documents from response
    let roadcutnocdetail = get(state, "screenConfiguration.preparedFinalObject.ROADCUTNOC", {});

    //    let documentsPreview = [];

    let doc = roadcutnocdetail.uploadDocuments

    let doctitle = [];
    if (doc.length > 0) {


      if (doc.length > 0) {

        for (let i = 0; i < doc.length; i++) {
          let eventDoc = doc[i]['fileStoreId']
          doctitle.push(doc[i]['fileName:']);

          if (eventDoc !== '' || eventDoc !== undefined) {
            documentsPreview.push({
              title: doc[i]['fileName:'],
              fileStoreId: eventDoc,
              linkText: "View",
              fileName: doc[i]['fileName:']
            })
            let fileStoreIds = jp.query(documentsPreview, "$.*.fileStoreId");
            let fileUrls =
              fileStoreIds.length > 0 ? await getFileUrlFromAPI(fileStoreIds) : {};

            documentsPreview = documentsPreview.map(function (doc, index) {


              doc["link"] = fileUrls && fileUrls[doc.fileStoreId] && fileUrls[doc.fileStoreId].split(",")[0] || "";
              doc["fileName"] =
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
    dispatch(prepareFinalObject("RoadCutDocuments", documentsPreview));
    // let uploadRoadCutCertificate = roadcutnocdetail.hasOwnProperty('uploadDocuments') ?
    //   roadcutnocdetail.uploadDocuments[0]['fileStoreId'] : '';

    // if (uploadRoadCutCertificate !== '') {
    //   documentsPreview.push({
    //     title: "ROADCUT_CERTIFIACTE",
    //     fileStoreId: uploadRoadCutCertificate,
    //     linkText: "View"
    //   });
    //   let fileStoreIds = jp.query(documentsPreview, "$.*.fileStoreId");
    //   let fileUrls =
    //     fileStoreIds.length > 0 ? await getFileUrlFromAPI(fileStoreIds) : {};
    //   documentsPreview = documentsPreview.map(function (doc, index) {

    //     doc["link"] = fileUrls && fileUrls[doc.fileStoreId] && fileUrls[doc.fileStoreId].split(",")[0] || "";
    //     //doc["name"] = doc.fileStoreId;
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

    //       doc["fileUrl"] = fileUrls && fileUrls[doc.fileStoreId] && fileUrls[doc.fileStoreId].split(",")[0] || "";
    //       doc["fileName"] =
    //         (fileUrls[doc.fileStoreId] &&
    //           decodeURIComponent(
    //             fileUrls[doc.fileStoreId]
    //               .split(",")[0]
    //               .split("?")[0]
    //               .split("/")
    //               .pop()
    //               .slice(13)
    //           )) ||
    //         `Document - ${index + 1}`;
    //     return doc;
    //   });
    //   dispatch(prepareFinalObject("documentsPreview", documentsPreview));
    //   dispatch(prepareFinalObject("documentsUploadRedux[0].documents", documentsPreview));

    //    }

  }
};

const screenConfig = {
  uiFramework: "material-ui",
  name: "applyroadcuts",
  beforeInitScreen: (action, state, dispatch) => {
    const applicationNumber = getQueryArg(window.location.href, "applicationNumber");
    !applicationNumber ? clearlocalstorageAppDetails(state) : '';
    setapplicationType('ROADCUTNOC');

    const tenantId = getQueryArg(window.location.href, "tenantId");
    const step = getQueryArg(window.location.href, "step");

    const userInfo = JSON.parse(getUserInfo());
    const applicantName = userInfo.hasOwnProperty('name') && userInfo.name != null ? userInfo.name : '';
    dispatch(prepareFinalObject("ROADCUTNOC.applicantName", applicantName));

    //Set Module Name
    set(state, "screenConfiguration.moduleName", "opms");

    // Set MDMS Data
    getMdmsData(action, state, dispatch).then(response => {
      prepareDocumentsUploadData(state, dispatch, 'apply_roadcut');
    });

    // Search in case of EDIT flow
    prepareEditFlow(state, dispatch, applicationNumber, tenantId);

    // Code to goto a specific step through URL
    if (step && step.match(/^\d+$/)) {
      let intStep = parseInt(step);
      set(
        action.screenConfig,
        "components.div.children.stepper.props.activeStep",
        intStep
      );
      let formWizardNames = [
        "formwizardFirstStep",
        "formwizardSecondStep"
        //"formwizardThirdStep"
      ];
      for (let i = 0; i < 2; i++) {
        set(
          action.screenConfig,
          `components.div.children.${formWizardNames[i]}.visible`,
          i == step
        );
        set(
          action.screenConfig,
          `components.div.children.footer.children.previousButton.visible`,
          step != 0
        );
      }
    }

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
              ...header
            }
          }
        },
        stepper,
        formwizardFirstStep,
        formwizardSecondStep,
        formwizardThirdStep,
        footer
      }
    }
  }
};

export default screenConfig;
