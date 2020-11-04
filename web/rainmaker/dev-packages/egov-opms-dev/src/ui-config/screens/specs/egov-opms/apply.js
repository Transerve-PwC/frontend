import {
  getCommonContainer,  getCommonHeader,  getStepperObject} from "egov-ui-framework/ui-config/screens/specs/utils";
import { getCurrentFinancialYear, clearlocalstorageAppDetails } from "../utils";
import { footer } from "./applyResource/footer";
import { nocDetails, PetParticularDetails } from "./applyResource/nocDetails";
import { immunizationDetails } from "./applyResource/immunization";
import jp from "jsonpath";

import { documentDetails } from "./applyResource/documentDetails";
import { getFileUrlFromAPI, getQueryArg, getTransformedLocale, setBusinessServiceDataToLocalStorage } from "egov-ui-framework/ui-utils/commons";
import {
  prepareFinalObject,
  handleScreenConfigurationFieldChange as handleField
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getOPMSTenantId, setapplicationType, lSRemoveItem, lSRemoveItemlocal, setapplicationNumber, getUserInfo } from "egov-ui-kit/utils/localStorageUtils";
import { httpRequest } from "../../../../ui-utils";
import set from "lodash/set";
import get from "lodash/get";

import {
  prepareDocumentsUploadData,
  getSearchResults,
  getSearchResultsView,
  setApplicationNumberBox,
  furnishNocResponse,
} from "../../../../ui-utils/commons";

export const stepsData = [
  { labelName: "PET NOC Details", labelKey: "Applicant_DETAILS" },
  { labelName: "veterinary Details", labelKey: "STEP_PET_NOC_VETERINARY_DETAILS" },
  { labelName: "Documents", labelKey: "STEP_PET_NOC_DOCUMENTS" },
  { labelName: "Applicant Details", labelKey: "PET_NOC_APPLICANT_SUMMARY_STEP" }
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
    labelName: `Application for PET NOC (${getCurrentFinancialYear()})`, //later use getFinancialYearDates
    labelKey: "NOC_COMMON_APPLY_PET"
  }),
  //applicationNumber: applicationNumberContainer()
  applicationNumber: {
    uiFramework: "custom-atoms-local",
    moduleName: "egov-opms",
    componentPath: "applicationNumberContainer",
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
    nocDetails,
    PetParticularDetails
  }
};

export const formwizardSecondStep = {
  uiFramework: "custom-atoms",
  componentPath: "Form",
  props: {
    id: "apply_form2"
  },
  children: {
    immunizationDetails
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
    documentDetails
  },
  visible: false
};

export const formwizardFourthStep = {
  uiFramework: "custom-atoms",
  componentPath: "Form",
  props: {
    id: "apply_form4"
  },
  children: {
    //documentuploadDetails
  },
  visible: false
};


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
    payload = await httpRequest(
      "post",
      "/egov-mdms-service/v1/_search",
      "_search",
      [],
      mdmsBody
    );
    
    let sectorData = get(payload.MdmsRes,"egpm.sector", []);
    let immunizationSector = [{name:"NA",code:"NA"},...sectorData];
    set(payload.MdmsRes, "egpm.immunizationSector", immunizationSector);
    dispatch(prepareFinalObject("applyScreenMdmsData", payload.MdmsRes));
  } catch (e) {
    console.log(e);
  }
};


export const prepareEditFlow = async (state, dispatch, applicationNumber, tenantId) => {
  if (applicationNumber) {
    let response = await getSearchResultsView([
      { key: "tenantId", value: tenantId },
      { key: "applicationNumber", value: applicationNumber }
    ]);

    let Refurbishresponse = furnishNocResponse(response);
    dispatch(prepareFinalObject("PETNOC", Refurbishresponse));
    if (applicationNumber) {
      setapplicationNumber(applicationNumber);
      setApplicationNumberBox(state, dispatch, applicationNumber);
    }

    // Set sample docs upload
    // dispatch(prepareFinalObject("documentsUploadRedux", sampleDocUpload()));
    let documentsPreview = [];

    // Get all documents from response
    let petnocdetails = get(state, "screenConfiguration.preparedFinalObject.PETNOC", {});
    let uploadVaccinationCertificate = petnocdetails.hasOwnProperty('uploadVaccinationCertificate') ?
      petnocdetails.uploadVaccinationCertificate[0]['fileStoreId'] : '';

    let uploadPetPicture = petnocdetails.hasOwnProperty('uploadPetPicture') ?
      petnocdetails.uploadPetPicture[0]['fileStoreId'] : '';

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

          doc["fileUrl"] = fileUrls && fileUrls[doc.fileStoreId] && fileUrls[doc.fileStoreId].split(",")[0] || "";
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
      dispatch(prepareFinalObject("documentsPreview", documentsPreview));

    dispatch(prepareFinalObject("documentsUploadRedux[0].documents[0]", documentsPreview[1]));    
    dispatch(prepareFinalObject("documentsUploadRedux[1].documents[0]", documentsPreview[0]));    
    
    }


  }
};


const screenConfig = {
  uiFramework: "material-ui",
  name: "apply",
  beforeInitScreen: (action, state, dispatch) => {
    const applicationNumber = getQueryArg(window.location.href, "applicationNumber");
    !applicationNumber ? clearlocalstorageAppDetails(state) : '';
    setapplicationType('PETNOC');
    const tenantId = getQueryArg(window.location.href, "tenantId");
    const step = getQueryArg(window.location.href, "step");
    dispatch(prepareFinalObject("PETNOC.applicantName", JSON.parse(getUserInfo()).name));

    //Set Module Name
    set(state, "screenConfiguration.moduleName", "opms");

    // Set MDMS Data
    getMdmsData(action, state, dispatch).then(response => {
      prepareDocumentsUploadData(state, dispatch, 'apply_pet');
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
        "formwizardSecondStep",
        "formwizardThirdStep",
        "formwizardFourthStep"
      ];
      for (let i = 0; i < 4; i++) {
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
        formwizardFourthStep,
        footer
      }
    }
  }
};

export default screenConfig;
