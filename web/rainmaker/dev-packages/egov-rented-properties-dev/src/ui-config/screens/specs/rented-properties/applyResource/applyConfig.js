import {
    getStepperObject, getCommonCard, getCommonTitle, getCommonParagraph
  } from "egov-ui-framework/ui-config/screens/specs/utils";
import {propertyDetails} from './propertyDetails';
import {rentHolderDetails} from './rentHolderDetails';
import {addressDetails} from './addressDetails';
import {rentDetails} from './rentDetails';
import {paymentDetails} from './paymentDetails'
import {documentList} from './documentList'

export const rentedDocumentsDetails = getCommonCard({
  header: getCommonTitle(
    {
      labelName: "Required Documents",
      labelKey: "TL_NEW-UPLOAD-DOCS_HEADER"
    },
    {
      style: {
        marginBottom: 18
      }
    }
  ),
  paragraph: getCommonParagraph({
    labelName:
      "Only one file can be uploaded for one document. If multiple files need to be uploaded then please combine all files in a pdf and then upload",
    labelKey: "TL_NEW-UPLOAD-DOCS_SUBHEADER"
  }),
  documentList
});

export const stepsData = [
    { labelName: "Details", labelKey: "RP_COMMON_TR_DETAILS" },
    { labelName: "Documents", labelKey: "TL_COMMON_DOCS" },
    { labelName: "Summary", labelKey: "TL_COMMON_SUMMARY" }
  ];

export const stepper = getStepperObject(
    { props: { activeStep: 0 } },
    stepsData
  );

  export const formwizardFirstStep = {
    uiFramework: "custom-atoms",
    componentPath: "Form",
    props: {
      id: "apply_form1"
    },
    children: {
      propertyDetails,
      rentHolderDetails,
      addressDetails,
      rentDetails,
      paymentDetails
    }
  };

  export const formwizardSecondStep = {
    uiFramework: "custom-atoms",
    componentPath: "Form",
    props: {
      id: "apply_form2"
    },
    children: {
      rentedDocumentsDetails
    },
    visible: false
  };

