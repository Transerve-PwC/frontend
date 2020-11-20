import {
  getStepperObject,
  getCommonCard,
  getCommonTitle,
  getCommonParagraph,getBreak
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { propertyDetails } from "./propertyDetails";
import { additionalDetails } from "../applyResource/propertyDetails";
import { ownerDetails } from "../applyResourceBuildingBranch/ownerDetails";
import { 
  ownerDocumentDetails_0, 
  previousOwnerDocuments_0 
} from "../applyResource/applyConfig";
import { purchaserDetails } from "../applyResource/purchaserDetails";
import { courtCaseDetails } from "../applyResource/courtCaseDetails";
import { reviewDetails } from "./reviewDetails"

export const manimajraStepsData = [{
  labelName: "Property Details",
  labelKey: "ES_COMMON_PROPERTY_DETAILS"
},
{
  labelName: "Owner Details",
  labelKey: "ES_COMMON_OWNER_DETAILS"
},
{
  labelName: "Owner Documents",
  labelKey: "ES_COMMON_OWNER_DOCUMENTS"
},
{
  labelName: "Previous Owner Details",
  labelKey: "ES_COMMON_PREVIOUS_OWNER_DETAILS"
},
{
  labelName: "Previous Owner Documents",
  labelKey: "ES_COMMON_PREVIOUS_OWNER_DOCUMENTS"
},
{
  labelName: "Payment Details",
  labelKey: "ES_COMMON_PAYMENT_DETAILS"
},
{
  labelName: "Court Case",
  labelKey: "ES_COMMON_COURT_CASE_DETAILS"
},
{
  labelName: "Summary",
  labelKey: "ES_COMMON_SUMMARY"
}
];

export const manimajraStepper = getStepperObject({
  props: {
    activeStep: 0
  }
},
  manimajraStepsData
);

export const formwizardFirstStep = {
  uiFramework: "custom-atoms",
  componentPath: "Form",
  props: {
    id: "apply_form1"
  },
  children: {
    propertyDetails,
    additionalDetails
  }
};

export const formwizardSecondStep = {
  uiFramework: "custom-atoms",
  componentPath: "Form",
  props: {
    id: "apply_form2"
  },
  children: {
    ownerDetails
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
    ownerDocumentDetails_0
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
    purchaserDetails
  },
  visible: false
};

export const formwizardFifthStep = {
  uiFramework: "custom-atoms",
  componentPath: "Form",
  props: {
    id: "apply_form5"
  },
  children: {
    previousOwnerDocuments_0
  },
  visible: false
};

export const formwizardSixthStep = {
  uiFramework: "custom-atoms",
  componentPath: "Form",
  props: {
    id: "apply_form6"
  },
  children: {
    
  },
  visible: false
};

export const formwizardSeventhStep = {
  uiFramework: "custom-atoms",
  componentPath: "Form",
  props: {
    id: "apply_form7"
  },
  children: {
    courtCaseDetails
  },
  visible: false
};

export const formwizardEighthStep = {
  uiFramework: "custom-atoms",
  componentPath: "Form",
  props: {
    id: "apply_form8"
  },
  children: {
    reviewDetails
  },
  visible: false
}