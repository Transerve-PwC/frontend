import {
  getCommonContainer,
  getCommonHeader,
  getTodaysDateInYMD,
  getStepperObject
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { getCurrentFinancialYear, getTextToLocalMappingItemMaster, convertDateToEpoch, getEpochForDate, clearlocalstorageAppDetails, convertEpochToDate } from "../utils";
import { footer } from "./applyResource/footer";

import { violationsDetails, violatorDetails } from "./applyResource/violationDetail";
import { ArticleDetails } from "./applyResource/articleDetails";
import { ArticleGridDetails } from "./applyResource/articleGridDetails"
import { ViolationDocumentDetailsUpload, ViolatorIDProofUpload, ViolatorImageIDUpload } from "./applyResource/documentDetails";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import {
  prepareFinalObject,
  handleScreenConfigurationFieldChange as handleField,
  toggleSpinner
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getTenantId, setapplicationType } from "egov-ui-kit/utils/localStorageUtils";
import set from "lodash/set";
import get from "lodash/get";
import {
  prepareDocumentsUploadData,
  fetchVendorDetails
} from "../../../../ui-utils/commons";
import { fetchMdmsData } from "../../../../ui-utils/commons";

export const stepsData = [
  { labelName: "Violations Details", labelKey: "EC_STEPPER_VIOLATIONS_STEP_1" },
  { labelName: "Article Details", labelKey: "EC_STEPPER_ARTICLE_DETAILS_STEP_2" },
  { labelName: "Documents", labelKey: "EC_STEPPER_DOCUMENTS_STEP_3" },
  { labelName: "Summary", labelKey: "EC_STEPPER_SUMMARY_STEP_4" }
];
export const stepper = getStepperObject(
  { props: { activeStep: 0 } },
  stepsData
);

export const header = getCommonContainer({
  header: getCommonHeader({
    labelName: `Create Challan (${getCurrentFinancialYear()})`, //later use getFinancialYearDates
    labelKey: "EC_CREATE_CHALLAN_MAIN_HEADER"
  }),
  //ChallanNumber: ChallanNumberContainer()
  ChallanNumber: {
    uiFramework: "custom-atoms-local",
    moduleName: "egov-echallan",
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
    violationsDetails,
    violatorDetails
  }
};

export const formwizardSecondStep = {
  uiFramework: "custom-atoms",
  componentPath: "Form",
  props: {
    id: "apply_form2"
  },
  children: {
    ArticleDetails,
    ArticleGridDetails
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
    ViolatorImageIDUpload,
    ViolatorIDProofUpload,
    ViolationDocumentDetailsUpload,
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
    // documentDetails
  },
  visible: false
};

const getMdmsData = async (action, state, dispatch) => {

  try {
    let tenantId = getTenantId().length > 2 ? getTenantId().split('.')[0] : getTenantId();
    let mdmsBody = {
      MdmsCriteria: {
        tenantId: tenantId,
        moduleDetails: [
          {
            moduleName: "egec",
            masterDetails: [
              {
                name: "NumberOfViolation"
              },
              {
                name: "EncroachmentType"
              },
              {
                name: "sector"
              },
              {
                name: "IDProof"
              },
              {
                name: "VehicleType"
              },
              {
                name: "documents"
              },
              {
                name: "NotificationTemplate"
              },
            ]
          }
        ]
      }
    };
    await fetchMdmsData(state, dispatch, mdmsBody, false);
  } catch (e) {
    console.log(e);
  }
};

export const getVendorDetail = async (action, state, dispatch) => {
  try {
    let payload = null;
    payload = await fetchVendorDetails(state, dispatch);
    dispatch(prepareFinalObject("applyScreenMdmsData.egec.vendorList", payload));
  } catch (e) {
    dispatch(toggleSpinner())
    console.log(e);
  }
};

const screenConfig = {
  uiFramework: "material-ui",
  name: "apply",
  beforeInitScreen: (action, state, dispatch) => {
    clearlocalstorageAppDetails(state);
    setapplicationType('egov-echallan');
    dispatch(prepareFinalObject("eChallan", {}));
    const step = getQueryArg(window.location.href, "step");
    //Set Module Name
    set(state, "screenConfiguration.moduleName", "eChallan");
    // Set MDMS Data
    getMdmsData(action, state, dispatch).then(response => {
      // Set Dropdowns Data
      // Set Documents Data (TEMP)
      prepareDocumentsUploadData(state, dispatch);
      //getVendorDetail(action, state, dispatch);
    });

    let dateString = new Date();
    let dateTimeHourString = dateString.getHours().toString() 
    let dateTimeSecString = dateString.getMinutes().toString();
    dateTimeHourString = (dateTimeHourString > 9 ? "" : "0") + dateTimeHourString;

    dateTimeSecString = (dateTimeSecString > 9 ? "" : "0") + dateTimeSecString;
  
    //getEpochForDate(convertDateToEpoch(getTodaysDateInYMD()))
    dispatch(prepareFinalObject("eChallan.violationDate", convertEpochToDate(dateString)));
    dispatch(prepareFinalObject("eChallan.violationTime", dateTimeHourString + ":" + dateTimeSecString));
    // dispatch(
    //   handleField(
    //     "apply",
    //     "components.div.children.formwizardFirstStep.children.violationsDetails.children.cardContent.children.violationsDetailsContainer.children.Time",
    //     "props.value",
    //     dateTimeString
    //   )
    // );
    // set(
    //   action.screenConfig,
    //   "components.div.children.formwizardFirstStep.children.violationsDetails.children.cardContent.children.violationsDetailsContainer.children.Time.props.value",
    //   dateTimeHourString + ":" + dateTimeSecString
    // );
    //dispatch(prepareFinalObject("eChallan.licenseNoCov", ""));
    set(
      action.screenConfig,
      "components.div.children.formwizardFirstStep.children.violationsDetails.children.cardContent.children.violationsDetailsContainer.children.Date.props.disabled",
      true
    );
    set(
      action.screenConfig,
      "components.div.children.formwizardFirstStep.children.violationsDetails.children.cardContent.children.violationsDetailsContainer.children.Time.props.disabled",
      true
    );
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
