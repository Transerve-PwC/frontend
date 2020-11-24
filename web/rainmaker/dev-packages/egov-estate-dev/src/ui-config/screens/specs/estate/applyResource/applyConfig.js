
import React from "react";
import {
  getStepperObject,
  getCommonCard,
  getCommonTitle,
  getCommonParagraph,getBreak
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { getEpochForDate, sortByEpoch } from "../../utils";
import {
  propertyInfoDetails,
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
  paymentDetails
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
  interestDetails,
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
  companyDetails,
  firmDetails,
  partnerDetails,
  proprietorshipDetails
} from './entityDetails'
import {ES_MONTH, ES_RENT_DUE, ES_RENT_RECEIVED, ES_RECEIPT_NO, ES_DATE,ES_RENT_DUE_DATE,
ES_PENALTY_INTEREST,ES_ST_GST_RATE,ES_ST_GST_DUE,ES_PAID,
ES_DATE_OF_RECEIPT,ES_NO_OF_DAYS,ES_INTEREST_ON_DELAYED_PAYMENT} from '../../../../../ui-constants';
import {
 applyEstates
} from '../../../../../ui-utils/apply'

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
      removedJsonPath: "PropertiesTemp[0].propertyDetails.owners[0].ownerDetails.removedDocs",
      callBack: applyEstates,
      activeIndex: 3
    }
  }
});

export const paymentDocumentsDetails = getCommonCard({
  ...documentCardConfig,
  header: getCommonTitle({
    labelName: "Documents",
    labelKey: "ES_UPLOAD_PAYMENT_DOCS_HEADER"
  }),
  documentList : {
    ...documentList,
    props: {
      ...documentList.props,
       documentsJsonPath: "PropertiesTemp[0].propertyDetails.owners[0].ownerDetails.applicationPaymentDocuments",
       uploadedDocumentsJsonPath: "PropertiesTemp[0].propertyDetails.owners[0].ownerDetails.uploadedDocsInRedux",
       tenantIdJsonPath: "Properties[0].tenantId",
       removedJsonPath: "PropertiesTemp[0].propertyDetails.owners[0].ownerDetails.removedDocs",
       getUrl: "/est-services/estate/_calculation",
       screenKey: "apply",
       componentJsonPath: "components.div.children.formwizardNinthStep.children.paymentDetailsTable",
      // removedJsonPath: "PropertiesTemp[0].removedPaymentDocs"
    }
  }
});

export const paymentDetailsTable =  {
  uiFramework: "custom-molecules",
  componentPath: "Table",
  visible: false,
  props: {
    columns: [
      ES_MONTH,
      ES_RENT_DUE,
      ES_RENT_RECEIVED,
      ES_RECEIPT_NO,
      ES_DATE,
      {
        name: ES_RENT_DUE_DATE,
        options: {
          setCellProps: () => ({ style: { minWidth: "150px", maxWidth: "150px" }})
        }
      },
      // ES_PENALTY_INTEREST,
      ES_ST_GST_RATE,
      ES_ST_GST_DUE,
      // ES_PAID,
      ES_DATE_OF_RECEIPT,
      // {
      //   name: ES_NO_OF_DAYS,
      //   options: {
      //     setCellProps: () => ({ style: { minWidth: "150px", maxWidth: "150px" }}),
      //   }
      // },
      // {
      //   name: ES_INTEREST_ON_DELAYED_PAYMENT,
      //   options: {
      //     setCellProps: () => ({ style: { minWidth: "200px", maxWidth: "200px" }}),
      //   }
      // },
      
    ],
    options: {
      pagination: false,
      filter: false,
      download: false,
      print: false,
      search:false,
      viewColumns:false,
      responsive: "stacked",
      selectableRows: false,
      hover: true,
      rowsPerPageOptions: [10, 15, 20]
    },
    customSortColumn: {
      column: "Application Date",
      sortingFn: (data, i, sortDateOrder) => {
        const epochDates = data.reduce((acc, curr) => {
          acc.push([...curr, getEpochForDate(curr[4], "dayend")]);
          return acc;
        }, []);
        const order = sortDateOrder === "asc" ? true : false;
        const finalData = sortByEpoch(epochDates, !order).map(item => {
          item.pop();
          return item;
        });
        return { data: finalData, currentOrder: !order ? "asc" : "desc" };
      }
    }
  }
}

export const previousOwnerDocuments_0 = getCommonCard({
  ...documentCardConfig,
  documentList: {
    ...documentList,
    props: {
      ...documentList.props,
      documentsJsonPath: "PropertiesTemp[0].propertyDetails.purchaser[0].ownerDetails.ownerDocuments",
      uploadedDocumentsJsonPath: "PropertiesTemp[0].propertyDetails.purchaser[0].ownerDetails.uploadedDocsInRedux",
      tenantIdJsonPath: "Properties[0].tenantId",
      removedJsonPath: "PropertiesTemp[0].propertyDetails.purchaser[0].ownerDetails.removedDocs",
      callBack: applyEstates,
      activeIndex: 5
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
  labelName: "Rent Information",
  labelKey: "ES_COMMON_RENT_INFORMATION"
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
    demandSelect,
    groundRentDetails,
    licenseFeeDetails,
    interestDetails,
    securityDetails
  },
  visible: false
}

export const formwizardNinthStep = {
  uiFramework: "custom-atoms",
  componentPath: "Form",
  props: {
    id: "apply_form9"
  },
  children: {
    paymentDetails
  },
  visible: false
}

export const formwizardTenthStep = {
  uiFramework: "custom-atoms",
  componentPath: "Form",
  props: {
    id: "apply_form10"
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
    interestDetails,
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