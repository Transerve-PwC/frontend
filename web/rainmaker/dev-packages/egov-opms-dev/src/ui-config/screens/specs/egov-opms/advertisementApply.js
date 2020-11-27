import {
  getCommonContainer,
  getCommonHeader,
  getTodaysDateInYMD,
  getStepperObject
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { getCurrentFinancialYear, clearlocalstorageAppDetails } from "../utils";

import { footer } from "./advApplyResource/footer";
import { AdvtDetails, PetParticularDetails } from "./advApplyResource/nocDetails";
import { immunizationDetails } from "./advApplyResource/immunization";

import { documentDetails } from "./advApplyResource/documentDetails";
import {
  prepareFinalObject, handleScreenConfigurationFieldChange as handleField
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getOPMSTenantId, getUserInfo, setapplicationType, lSRemoveItem, lSRemoveItemlocal, setapplicationNumber, localStorageSet } from "egov-ui-kit/utils/localStorageUtils";
import { httpRequest } from "../../../../ui-utils";
import jp from "jsonpath";
import set from "lodash/set";
import get from "lodash/get";
import {
  prepareDocumentsUploadData, getSearchResultsView, setApplicationNumberBox, furnishAdvertisementNocResponse
} from "../../../../ui-utils/commons";
import { getFileUrlFromAPI, getQueryArg, getTransformedLocale, setBusinessServiceDataToLocalStorage } from "egov-ui-framework/ui-utils/commons";


export const stepsData = [
  { labelName: "Applicant Details", labelKey: "ADV_APPLICANT_DETAILS_NOC" },
  { labelName: "Advertisement Details", labelKey: "ADV_ADVERTISEMENT_DETAILS_NOC" },
  { labelName: "Documents", labelKey: "ADV_DOCUMENT_NOC" },
  { labelName: "Summary", labelKey: "ADV_SUMMARY_NOC" }
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
    labelName: `Apply New Permision for Advertisement (${getCurrentFinancialYear()})`, //later use getFinancialYearDates
    labelKey: "ADV_APPLY_NOC"
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
    AdvtDetails,
    // PetParticularDetails
  }
};


export const formwizardSecondStep = {
  // This is for step 2
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
  //this is for step 3
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
  // This is for step 4
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
  //alert("call mdmsdata***1")
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
              name: "typeOfApplicant"
            },
            {
              name: "sector"
            },
            {
              name: "typeOfAdvertisement",
              "filter": "$.[?(@.active==true)]"
            },
            {
              name: "subTypeOfAdvertisement"
            },
            {
              name: "duration"
            }
            ,
            {
              name: "roadCutDivision"
            },
            {
              name: "applicationType"
            }
          ]
        },
        { moduleName: "AdvNOC", masterDetails: [{ name: "AdvNOCDocuments" }] }
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
    console.log('response*********************')

    console.log(response)
    let Refurbishresponse = furnishAdvertisementNocResponse(response);
    dispatch(prepareFinalObject("ADVERTISEMENTNOC", Refurbishresponse));

    if (applicationNumber) {
      setapplicationNumber(applicationNumber);
      setApplicationNumberBox(state, dispatch, applicationNumber);
    }
    let typecateID =
      get(state, "screenConfiguration.preparedFinalObject.applyScreenMdmsData.egpm.typeOfAdvertisement", []).filter(
        item => item.name === Refurbishresponse.typeOfAdvertisement
      );

    dispatch(
      prepareFinalObject(
        "applyScreenMdmsData.egpm.subTypeOfAdvertisement-new", typecateID[0].subTypeOfAdvertisement
      )
    );

    dispatch(
      prepareFinalObject(
        "applyScreenMdmsData.egpm.duration-new", typecateID[0].durationDropdown
      )
    );
    // Set sample docs upload
    // dispatch(prepareFinalObject("documentsUploadRedux", sampleDocUpload()));
    let documentsPreview = [];

    // Get all documents from response
    let advtnocdetail = get(state, "screenConfiguration.preparedFinalObject.ADVERTISEMENTNOC", {});
    let applicationStatus = response.nocApplicationDetail[0].applicationstatus

    localStorageSet("advertisementStatus", applicationStatus);
    dispatch(
      handleField(
        "advertisementApply",
        "components.div.children.formwizardSecondStep.children.immunizationDetails.children.cardContent.children.immunizationDetailsConatiner.children.buildingDataCard.children.singleBuildingContainer.children.singleBuilding.children.cardContent.children.singleBuildingCard.children.typeOfAdvertisement",
        "props.disabled", applicationStatus === "REASSIGN" ? true : false));
    dispatch(
      handleField(
        "advertisementApply",
        "components.div.children.formwizardSecondStep.children.immunizationDetails.children.cardContent.children.immunizationDetailsConatiner.children.buildingDataCard.children.singleBuildingContainer.children.singleBuilding.children.cardContent.children.singleBuildingCard.children.subTypeOfAdvertisement",
        "props.disabled", applicationStatus === "REASSIGN" ? true : false));
    dispatch(
      handleField(
        "advertisementApply",
        "components.div.children.formwizardSecondStep.children.immunizationDetails.children.cardContent.children.immunizationDetailsConatiner.children.buildingDataCard.children.singleBuildingContainer.children.singleBuilding.children.cardContent.children.singleBuildingCard.children.toDatePeriodOfDisplay",
        "props.disabled", applicationStatus === "REASSIGN" ? true : false));
    dispatch(
      handleField(
        "advertisementApply",
        "components.div.children.formwizardSecondStep.children.immunizationDetails.children.cardContent.children.immunizationDetailsConatiner.children.buildingDataCard.children.singleBuildingContainer.children.singleBuilding.children.cardContent.children.singleBuildingCard.children.fromDatePeriodOfDisplay",
        "props.disabled", applicationStatus === "REASSIGN" ? true : false));
    dispatch(
      handleField(
        "advertisementApply",
        "components.div.children.formwizardSecondStep.children.immunizationDetails.children.cardContent.children.immunizationDetailsConatiner.children.buildingDataCard.children.singleBuildingContainer.children.singleBuilding.children.cardContent.children.singleBuildingCard.children.enterSpace",
        "props.disabled", applicationStatus === "REASSIGN" || typecateID[0].id === "10010" || typecateID[0].id === "10012" ? true : false));
    dispatch(
      handleField(
        "advertisementApply",
        "components.div.children.formwizardSecondStep.children.immunizationDetails.children.cardContent.children.immunizationDetailsConatiner.children.buildingDataCard.children.singleBuildingContainer.children.singleBuilding.children.cardContent.children.singleBuildingCard.children.duration",
        "props.disabled", applicationStatus === "REASSIGN" ? true : false));

    dispatch(
      handleField(
        "advertisementApply",
        "components.div.children.formwizardSecondStep.children.immunizationDetails.children.cardContent.children.immunizationDetailsConatiner.children.buildingDataCard.children.singleBuildingContainer.children.singleBuilding.children.cardContent.children.singleBuildingCard.children.exemptedCategory.children.exemptionradio",
        "props.buttons[0].disabled", applicationStatus === "REASSIGN" ? true : false));

    dispatch(
      handleField(
        "advertisementApply",
        "components.div.children.formwizardSecondStep.children.immunizationDetails.children.cardContent.children.immunizationDetailsConatiner.children.buildingDataCard.children.singleBuildingContainer.children.singleBuilding.children.cardContent.children.singleBuildingCard.children.exemptedCategory.children.exemptionradio",
        "props.buttons[1].disabled", applicationStatus === "REASSIGN" ? true : false));


    let uploadVaccinationCertificate = advtnocdetail.hasOwnProperty('uploadDocuments') ?
      advtnocdetail.uploadDocuments[0]['fileStoreId'] : '';

    if (uploadVaccinationCertificate !== '') {
      documentsPreview.push({
        title: "ADV.ADV_PHOTOCOPY_HOARDING",
        fileStoreId: uploadVaccinationCertificate,
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
        //doc["name"] = doc.fileStoreId;
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
      dispatch(prepareFinalObject("documentsUploadRedux[0].documents", documentsPreview));

    }

  }
};

const screenConfig = {
  uiFramework: "material-ui",
  name: "advertisementApply",
  beforeInitScreen: (action, state, dispatch) => {
    localStorageSet("advertisementStatus", "");
    const applicationNumber = getQueryArg(window.location.href, "applicationNumber");
    !applicationNumber ? clearlocalstorageAppDetails(state) : ''

    setapplicationType("ADVERTISEMENTNOC");


    const tenantId = getQueryArg(window.location.href, "tenantId");
    const step = getQueryArg(window.location.href, "step");
    const userInfo = JSON.parse(getUserInfo());
    const applicantName = userInfo.hasOwnProperty('name') && userInfo.name != null ? userInfo.name : '';
    dispatch(prepareFinalObject("ADVERTISEMENTNOC.applicantName", applicantName));
    dispatch(prepareFinalObject("ADVERTISEMENTNOC.pan", JSON.parse(getUserInfo()).pan));
    dispatch(prepareFinalObject("ADVERTISEMENTNOC.applicantAddress", JSON.parse(getUserInfo()).permanentAddress));
    dispatch(prepareFinalObject("ADVERTISEMENTNOC.mobileNo", JSON.parse(getUserInfo()).mobileNumber));
    dispatch(prepareFinalObject("ADVERTISEMENTNOC.emailId", JSON.parse(getUserInfo()).emailId));
    dispatch(prepareFinalObject("ADVERTISEMENTNOC.date", getTodaysDateInYMD()));
    dispatch(prepareFinalObject("ADVERTISEMENTNOC.exemptedCategory", 0));

    //Set Module Name
    set(state, "screenConfiguration.moduleName", "opms");

    // Set MDMS Data
    getMdmsData(action, state, dispatch).then(response => {
      // Set Documents Data (TEMP)
      prepareDocumentsUploadData(state, dispatch, 'apply_Advt');
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
    if (applicationNumber) {
      dispatch(
        handleField(
          "advertisementApply",
          "components.div.children.formwizardSecondStep.children.immunizationDetails.children.cardContent.children.immunizationDetailsConatiner.children.buildingDataCard.children.singleBuildingContainer.children.singleBuilding.children.cardContent.children.singleBuildingCard.children.exemptedCategory.children.exemptionradio.props.buttons",
          "disabled", true)
      );
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