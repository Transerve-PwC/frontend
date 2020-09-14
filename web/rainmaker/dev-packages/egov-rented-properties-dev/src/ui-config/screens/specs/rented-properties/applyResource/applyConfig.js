import React from "react";
import {
    getStepperObject, getCommonCard, getCommonTitle, getCommonParagraph, getBreak
  } from "egov-ui-framework/ui-config/screens/specs/utils";
import {noticePropertyDetails,ownerDetailsForNotice,ownerDetailsForViolationNotice,paymentDetailsNotice} from './noticeDetails'
import {rentHolderDetails,applicantDetailsMortgage,applicantDetails,rentHolderDetailsForDuplicateProperties} from './rentHolderDetails';
import {propertyDetails, transitSiteDetails} from './propertyDetails';
import {addressDetails, ownershipAddressDetails,ownershipAddressDetailsMortgage,transitSitePropertyDetails,transitSiteComments} from './addressDetails';
import {uploadimage,imageUploadDetailsProperties} from './imageUploadDetails'
import {rentDetails} from './rentDetails';
import {paymentDetails} from './paymentDetails'
import {documentList} from './documentList'
import {rentedReviewDetails, ownerShipReviewDetails, mortgageReviewDetails,duplicateCopyDetails} from './reviewDetails'
import { getEpochForDate, sortByEpoch } from "../../utils";
import { getLocaleLabels } from "egov-ui-framework/ui-utils/commons";
import {RP_DEMAND_GENERATION_DATE, RP_PAYMENT_DATE, RP_ASSESSMENT_AMOUNT, RP_REALIZATION_AMOUNT, RP_RECEIPT_NO} from '../../../../../ui-constants'

const documentCardConfig = {
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
}

const documentHeaderConfig = {
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
  )
}

export const rentedDocumentsDetails = getCommonCard({
  ...documentCardConfig,
  documentList : {
    ...documentList,
    props: {
      ...documentList.props,
      documentsJsonPath: "PropertiesTemp[0].applicationDocuments",
      uploadedDocumentsJsonPath: "PropertiesTemp[0].uploadedDocsInRedux",
      tenantIdJsonPath: "Properties[0].tenantId",
      removedJsonPath: "PropertiesTemp[0].removedDocs"
    }
  }
});


export const paymentDocumentsDetails = getCommonCard({
  ...documentHeaderConfig,
  documentList : {
    ...documentList,
    props: {
      ...documentList.props,
       documentsJsonPath: "PropertiesTemp[0].applicationPaymentDocuments",
       uploadedDocumentsJsonPath: "PropertiesTemp[0].uploadedPaymentInRedux",
       tenantIdJsonPath: "Properties[0].tenantId",
      //  getUrl: "/rp-services/v1/excel/read",
       screenKey: "apply",
       componentJsonPath: "components.div.children.formwizardThirdStep.children.paymentDetailsTable",
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
      {
        name: RP_DEMAND_GENERATION_DATE,
        options: {
          customBodyRender: value => (
            <span style={{ color: "black" }}>
              {value}
            </span>
          )
        }
      },
      RP_PAYMENT_DATE,
      RP_ASSESSMENT_AMOUNT,
      RP_REALIZATION_AMOUNT,
      RP_RECEIPT_NO
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

export const ownershipTransferDocumentsDetails = getCommonCard({
  ...documentCardConfig,
  documentList : {
    ...documentList,
    props: {
      ...documentList.props,
      documentsJsonPath: "OwnersTemp[0].ownershipTransferDocuments",
      uploadedDocumentsJsonPath: "OwnersTemp[0].uploadedDocsInRedux",
      tenantIdJsonPath: "Owners[0].tenantId",
      removedJsonPath: "OwnersTemp[0].removedDocs"
    }
  }
});


export const ownershipTransferDuplicateDocumentsDetails = getCommonCard({
  ...documentCardConfig,
  documentList : {
    ...documentList,
    props: {
      ...documentList.props,
      documentsJsonPath: "DuplicateTemp[0].ownershipTransferDocuments",
      uploadedDocumentsJsonPath: "DuplicateTemp[0].uploadedDocsInRedux",
      tenantIdJsonPath: "DuplicateCopyApplications[0].tenantId",
      removedJsonPath: "DuplicateTemp[0].removedDocs"
    }
  }
});

export const stepsData = [
    { labelName: "Details", labelKey: "RP_COMMON_TR_DETAILS" },
    { labelName: "Documents", labelKey: "TL_COMMON_DOCS" },
    { labelName: "Summary", labelKey: "TL_COMMON_SUMMARY" }
  ];
  export const steps = [
    { labelName: "Details", labelKey: "RP_COMMON_TR_DETAILS" },
    { labelName: "Documents", labelKey: "TL_COMMON_DOCS" },
    { labelName: "Rent History", labelKey: "RP_COMMON_RENT_HISTORY" },
    { labelName: "Summary", labelKey: "TL_COMMON_SUMMARY" }
  ];

export const stepper = getStepperObject(
    { props: { activeStep: 0 } },
    stepsData
  );
  export const addPropertyStepper = getStepperObject(
    { props: { activeStep: 0 } },
    steps
  );
  export const mortgageDocumentsDetails = getCommonCard({
    ...documentCardConfig,
    documentList : {
      ...documentList,
      props: {
        ...documentList.props,
        documentsJsonPath: "MortgageApplicationsTemp[0].applicationDocuments",
        uploadedDocumentsJsonPath: "MortgageApplicationsTemp[0].uploadedDocsInRedux",
        tenantIdJsonPath: "MortgageApplications[0].tenantId",
        removedJsonPath: "MortgageApplicationsTemp[0].removedDocs"
      }
    }
  });
  
  export const formwizardFirstStep = {
    uiFramework: "custom-atoms",
    componentPath: "Form",
    props: {
      id: "apply_form1"
    },
    children: {
      propertyDetails,
      addressDetails,
      rentHolderDetails,
      rentDetails
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
  export const formwizardThirdStep = {
    uiFramework: "custom-atoms",
    componentPath: "Form",
    props: {
      id: "apply_form3"
    },
    children: {
      paymentDocumentsDetails,
      breakAfterSearch: getBreak(),
      paymentDetailsTable
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
    rentedReviewDetails
  },
  visible: false
}

export const formwizardOwnershipFirstStep = {
  uiFramework: "custom-atoms",
  componentPath: "Form",
  props: {
    id: "apply_form1"
  },
  children: {
    ownershipAddressDetails,
    applicantDetails,
  }
};

export const formwizardOwnershipSecondStep = {
  uiFramework: "custom-atoms",
  componentPath: "Form",
  props: {
    id: "apply_form2"
  },
  children: {
    ownershipTransferDocumentsDetails
  },
  visible: false
};

export const formwizardOwnershipThirdStep = {
  uiFramework: "custom-atoms",
  componentPath: "Form",
  props: {
    id: "apply_form3"
  },
  children: {
    ownerShipReviewDetails
  },
  visible: false
}

export const formwizardMortgageFirstStep = {
  uiFramework: "custom-atoms",
  componentPath: "Form",
  props: {
    id: "apply_form5"
  },
  children: {
    ownershipAddressDetailsMortgage,
    applicantDetailsMortgage
    
  }
}

export const formwizardTransitSiteImagesFirstStep = {
  uiFramework: "custom-atoms",
  componentPath: "Form",
  props: {
    id: "apply_form1"
  },
  children: {
    transitSitePropertyDetails,
    // applicantDetailsMortgage
    imageUploadDetailsProperties,
    transitSiteComments
    
  }
}

export const formwizardMortgageSecondStep = {
  uiFramework: "custom-atoms",
  componentPath: "Form",
  props: {
    id: "apply_form7"
  },
  children: {
    mortgageDocumentsDetails
  },
  visible: false
}


export const formwizardMortgageThirdStep = {
  uiFramework: "custom-atoms",
  componentPath: "Form",
  props: {
    id: "apply_form6"
  },
  children: {
    mortgageReviewDetails
    
    },
  visible: false
}

export const formwizardDuplicateCopyFirstStep = {
  uiFramework: "custom-atoms",
  componentPath: "Form",
  props: {
    id: "apply_form4"
  },
  children: {
    transitSiteDetails,
    rentHolderDetailsForDuplicateProperties,
    //ownershipAddressDetails
  }
};

export const formwizardDuplicateCopySecondStep = {
    uiFramework: "custom-atoms",
  componentPath: "Form",
  props: {
    id: "apply_form2"
  },
  children: {
    ownershipTransferDuplicateDocumentsDetails
  },
  visible: false
};

export const formwizardDuplicateCopyThirdStep = {
  uiFramework: "custom-atoms",
  componentPath: "Form",
  props: {
    id: "apply_form3"
  },
  children: {
    duplicateCopyDetails
  },
  visible: false
};
export const recoveryNoticeFirstStep ={
  uiFramework: "custom-atoms",
  componentPath: "Form",
  props: {
    id: "apply_form4"
  },
  children: {
    noticePropertyDetails,
    ownerDetailsForNotice,
    paymentDetailsNotice
    //ownershipAddressDetails
  }
}

export const noticeViolationForm = {
  uiFramework: "custom-atoms",
  componentPath: "Form",
  props: {
    id: "apply_form3"
  },
  children: {
    noticePropertyDetails,
    ownerDetailsForViolationNotice,
    document
  },
}