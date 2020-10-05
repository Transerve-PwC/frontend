import {
  getStepperObject,
  getCommonCard,
  getCommonTitle,
  getCommonParagraph
} from "egov-ui-framework/ui-config/screens/specs/utils";
import {
  propertyInfoDetails,
  auctionDetails,
  // allotmentDetails,
  additionalDetails
} from './propertyDetails';
import {
  ownerDetails
} from './ownerDetails';
import {
  purchaserDetails
} from './purchaserDetails';
import {
  courtCaseDetails
} from './courtCaseDetails';
import {
  groundRentDetailsPM,
  serviceTaxDetails,
  paymentMadeBy
} from './paymentDetails';
import {
  reviewDetails
} from './reviewDetails';
import {
  documentList
} from './documentList';
import {
  premiumAmountDetails,
  groundRentDetails,
  licenseFeeDetails,
  securityDetails,
  demandSelect
} from './paymentDetailsAllotment';
import {
  reviewAllotmentDetails
} from './reviewAllotmentDetails'
import {
  AllotmentAuctionDetails
} from './auction-details'
import {
  CompanyDetails
} from './company-details';
import {
  companyDetails,
  firmDetails,
  partnerDetails,
  proprietorshipDetails
} from './entityDetails'

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
  }),
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
      removedJsonPath: "PropertiesTemp[0].propertyDetails.owners[0].ownerDetails.removedDocs"
    }
  }
});

export const companyDocuments_0 = getCommonCard({
  ...documentCardConfig,
  documentList: {
    ...documentList,
    props: {
      ...documentList.props,
      documentsJsonPath: "PropertiesTemp[0].propertyDetails.partners[0].partnerDetails.partnerDocuments",
      uploadedDocumentsJsonPath: "PropertiesTemp[0].propertyDetails.partners[0].partnerDetails.uploadedDocsInRedux",
      tenantIdJsonPath: "Properties[0].tenantId",
      removedJsonPath: "PropertiesTemp[0].propertyDetails.partners[0].partnerDetails.removedDocs"
    }
  }
});

export const previousOwnerDocuments_0 = getCommonCard({
  ...documentCardConfig,
  documentList: {
    ...documentList,
    props: {
      ...documentList.props,
      documentsJsonPath: "PropertiesTemp[0].propertyDetails.purchaser[0].ownerDetails.ownerDocuments",
      uploadedDocumentsJsonPath: "PropertiesTemp[0].propertyDetails.purchaser[0].ownerDetails.uploadedDocsInRedux",
      tenantIdJsonPath: "Properties[0].tenantId",
      removedJsonPath: "PropertiesTemp[0].propertyDetails.purchaser[0].ownerDetails.removedDocs"
    }
  }
});


export const stepsData = [{
  labelName: "Property Details",
  labelKey: "ES_COMMON_PROPERTY_DETAILS"
},
{
  labelName: "Auction Details",
  labelKey: "ES_COMMON_AUCTION_DETAILS"
},
{
  labelName: "Entity/Owner Details",
  labelKey: "ES_COMMON_ENTITY_OWNER_DETAILS"
},
{
  labelName: "Entity/Owner Documents",
  labelKey: "ES_COMMON_ENTITY_OWNER_DOCUMENTS"
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
  labelName: "Court Case",
  labelKey: "ES_COMMON_COURT_CASE_DETAILS"
},
{
  labelName: "Payment Details",
  labelKey: "ES_COMMON_PAYMENT_DETAILS"
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
    propertyInfoDetails,
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
    AllotmentAuctionDetails
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
    companyDetails,
    ownerDetails,
    firmDetails,
    partnerDetails,
    proprietorshipDetails
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
    ownerDocumentDetails_0
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
    purchaserDetails
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
    previousOwnerDocuments_0
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
}

export const formwizardEighthStep = {
  uiFramework: "custom-atoms",
  componentPath: "Form",
  props: {
    id: "apply_form8"
  },
  children: {
    groundRentDetailsPM,
    serviceTaxDetails,
    paymentMadeBy
  },
  visible: false
}

export const formwizardNinthStep = {
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

/* Allotment of site */
export const stepsDataAllotment = [{
    labelName: "Property Details",
    labelKey: "ES_COMMON_PROPERTY_DETAILS"
  },
  {
    labelName: "Auction Details",
    labelKey: "ES_COMMON_AUCTION_DETAILS"
  },
  {
    labelName: "Entity/Owner Details",
    labelKey: "ES_COMMON_ENTITY_OWNER_DETAILS"
  },
  {
    labelName: "Entity/Owner Documents",
    labelKey: "ES_COMMON_ENTITY_OWNER_DOCUMENTS"
  },
  {
    labelName: "Court Case",
    labelKey: "ES_COMMON_COURT_CASE_DETAILS"
  },
  {
    labelName: "Payment Details",
    labelKey: "ES_COMMON_PAYMENT_DETAILS"
  },
  {
    labelName: "Summary",
    labelKey: "ES_COMMON_SUMMARY"
  }
];

export const stepperAllotment = getStepperObject({
  props: {
    activeStep: 0
  }
},
  stepsDataAllotment
);

export const formwizardFirstStepAllotment = {
  uiFramework: "custom-atoms",
  componentPath: "Form",
  props: {
    id: "apply_form1"
  },
  children: {
    propertyInfoDetails,
    additionalDetails
  }
};

export const formwizardSecondStepAllotment = {
  uiFramework: "custom-atoms",
  componentPath: "Form",
  props: {
    id: "apply_form2"
  },
  children: {
    AllotmentAuctionDetails
  },
  visible: false
};

export const formwizardThirdStepAllotment = {
  uiFramework: "custom-atoms",
  componentPath: "Form",
  props: {
    id: "apply_form3"
  },
  children: {
    companyDetails,
    ownerDetails,
    firmDetails,
    partnerDetails,
    proprietorshipDetails
  },
  visible: false
};

export const formwizardFourthStepAllotment = {
  uiFramework: "custom-atoms",
  componentPath: "Form",
  props: {
    id: "apply_form4"
  },
  children: {
    ownerDocumentDetails_0
  },
  visible: false
};

export const formwizardFifthStepAllotment = {
  uiFramework: "custom-atoms",
  componentPath: "Form",
  props: {
    id: "apply_form5"
  },
  children: {
    courtCaseDetails
  },
  visible: false
};

export const formwizardSixthStepAllotment = {
  uiFramework: "custom-atoms",
  componentPath: "Form",
  props: {
    id: "apply_form6"
  },
  children: {
    premiumAmountDetails,
    demandSelect,
    groundRentDetails,
    licenseFeeDetails,
    securityDetails
  },
  visible: false
};

export const formwizardSeventhStepAllotment = {
  uiFramework: "custom-atoms",
  componentPath: "Form",
  props: {
    id: "apply_form7"
  },
  children: {
    reviewAllotmentDetails
  },
  visible: false
};