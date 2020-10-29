import {
  getStepperObject,
  getCommonCard,
  getCommonTitle,
  getCommonParagraph,
  getBreak
} from "egov-ui-framework/ui-config/screens/specs/utils";
import {
  documentList
} from "../applyResource/documentList";
import {
  propertyDetails
} from "./propertyDetails"
import {
  ownerDetails
} from "./ownerDetails"
import {
  reviewDetails
} from "./reviewDetails";
import {
  applyEstates
} from "../../../../../ui-utils/apply"

const documentCardConfig = {
  header: getCommonTitle({
    labelName: "Required Documents",
    labelKey: "ES_UPLOAD_DOCS_HEADER"
  }, {
    style: {
      marginBottom: 18
    }
  }),
  paragraph: getCommonParagraph({
    labelName: "Only one file can be uploaded for one document. If multiple files need to be uploaded then please combine all files in a pdf and then upload",
    labelKey: "ES_UPLOAD_DOCS_SUBHEADER"
  })
}

export const ownerDocumentDetails_0 = getCommonCard({
  ...documentCardConfig,
  documentList: {
    ...documentList,
    props: {
      ...documentList.props,
      documentsJsonPath: "PropertiesTemp[0].propertyDetails.owners[0].ownerDetails.ownerDocuments",
      uploadedDocumentsJsonPath: "PropertiesTemp[0].propertyDetails.owners[0].ownerDetails.uploadedDocsInRedux",
      tenantIdJsonPath: "Properties[0].tenantId",
      removedJsonPath: "PropertiesTemp[0].propertyDetails.owners[0].ownerDetails.removedDocs",
      callBack: applyEstates,
      activeIndex: 2
    }
  }
});

export const stepsData = [{
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
    labelName: "Summary",
    labelKey: "ES_COMMON_SUMMARY"
  }
];

export const stepper = getStepperObject({
  props: {
    activeStep: 0
  }
},
  stepsData
);

export const formwizardFirstStep = {
  uiFramework: "custom-atoms",
  componentPath: "Form",
  props: {
    id: "apply_form1"
  },
  children: {
    propertyDetails
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
    reviewDetails
  },
  visible: false
}