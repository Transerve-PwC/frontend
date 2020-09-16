import {
  getCommonHeader
} from "egov-ui-framework/ui-config/screens/specs/utils";
import {
  stepperAllotment,
  formwizardFirstStepAllotment,
  formwizardSecondStepAllotment,
  formwizardThirdStepAllotment,
  formwizardFourthStepAllotment,
  formwizardFifthStepAllotment,
  formwizardSixthStepAllotment,
  formwizardSeventhStepAllotment,
  formwizardEighthStepAllotment,
  formwizardNinthStepAllotment
} from './applyResource/applyConfig'
import {
  httpRequest
} from "../../../../ui-utils";
import {
  prepareFinalObject
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import commonConfig from "config/common.js";
import {
  footerAllotment
} from './applyResource/footerAllotment';
import {
  getQueryArg
} from "egov-ui-framework/ui-utils/commons";
import {
  prepareDocumentTypeObjMaster,
  prepareCompanyDocumentTypeObjMaster
} from "../utils";
import {
  handleScreenConfigurationFieldChange as handleField
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import {
  get
} from "lodash";
import {
  updatePFOforSearchResults
} from "../../../../ui-utils/commons";

const propertyId = getQueryArg(window.location.href, "propertyId")

export const getMdmsData = async (dispatch, body) => {
  let mdmsBody = {
    MdmsCriteria: {
      tenantId: commonConfig.tenantId,
      moduleDetails: body
    }
  };
  try {
    let payload = await httpRequest(
      "post",
      "/egov-mdms-service/v1/_search",
      "_search",
      [],
      mdmsBody
    );
    return payload;
  } catch (e) {
    console.log(e);
  }
};

export const setDocumentData = async (action, state, dispatch, owner = 0) => {
  const documentTypePayload = [{
    moduleName: "EstatePropertyService",
    masterDetails: [{
      name: "documents"
    }]
  }]
  const documentRes = await getMdmsData(dispatch, documentTypePayload);
  const {
    EstatePropertyService
  } = documentRes && documentRes.MdmsRes ? documentRes.MdmsRes : {}
  const {
    documents = []
  } = EstatePropertyService || {}
  const findMasterItem = documents.find(item => item.code === "MasterEst")
  const masterDocuments = !!findMasterItem ? findMasterItem.documentList : [];
  const estateMasterDocuments = masterDocuments.map(item => ({
    type: item.code,
    description: {
      labelName: "Only .jpg and .pdf files. 6MB max file size.",
      labelKey: item.fileType
    },
    formatProps: {
      accept: item.accept || "image/*, .pdf, .png, .jpeg",
    },
    maxFileSize: 6000,
    downloadUrl: item.downloadUrl,
    moduleName: "Estate",
    statement: {
      labelName: "Allowed documents are Aadhar Card / Voter ID Card / Driving License",
      labelKey: item.description
    }
  }))
  var documentTypes;
  var applicationDocs;
  documentTypes = prepareDocumentTypeObjMaster(masterDocuments, owner);
  applicationDocs = get(
    state.screenConfiguration.preparedFinalObject,
    `Properties[0].propertyDetails.owners[${owner}].ownerDetails.ownerDocuments`,
    []
  ) || [];


  applicationDocs = applicationDocs.filter(item => !!item)
  let applicationDocsReArranged =
    applicationDocs &&
    applicationDocs.length &&
    documentTypes.map(item => {
      const index = applicationDocs.findIndex(
        i => i.documentType === item.name
      );
      return applicationDocs[index];
    }).filter(item => !!item)
  applicationDocsReArranged &&
    dispatch(
      prepareFinalObject(
        `Properties[0].propertyDetails.owners[${owner}].ownerDetails.ownerDocuments`,
        applicationDocsReArranged
      )
    );
  dispatch(
    handleField(
      "allotment",
      `components.div.children.formwizardSixthStepAllotment.children.ownerDocumentDetails_${owner}.children.cardContent.children.documentList`,
      "props.inputProps",
      estateMasterDocuments
    )
  );
  dispatch(prepareFinalObject(`PropertiesTemp[0].propertyDetails.owners[${owner}].ownerDetails.ownerDocuments`, documentTypes))
  dispatch(prepareFinalObject("applyScreenMdmsData.estateApplications", documents))
}

const header = getCommonHeader({
  labelName: "Allotment of Site",
  labelKey: "EST_ALLOTMENT_OF_SITE"
});

const getData = async (action, state, dispatch) => {
  const transitNumber = getQueryArg(window.location.href, "transitNumber");

  if (transitNumber) {
    await updatePFOforSearchResults(action, state, dispatch, transitNumber)
  } else {
    dispatch(
      prepareFinalObject(
        "Properties",
        []
      )
    )
  }
  setDocumentData(action, state, dispatch);
  setCompanyDocs(action, state, dispatch);

  const mdmsPayload = [{
    moduleName: "EstatePropertyService",
    masterDetails: [{
        name: "categories"
      },
      {
        name: "propertyType"
      },
      {
        name: "modeOfTransfer"
      },
      {
        name: "allocationType"
      }
    ]
  }]

  const response = await getMdmsData(dispatch, mdmsPayload);
  dispatch(prepareFinalObject("applyScreenMdmsData", response.MdmsRes));

  dispatch(
    handleField(
      "allotment",
      "components.div.children.formwizardEighthStepAllotment.children.groundRentDetails",
      "visible",
      false
    )
  )
  dispatch(
    handleField(
      "allotment",
      "components.div.children.formwizardEighthStepAllotment.children.licenseFeeDetails",
      "visible",
      false
    )
  )
  // dispatch(
  //   handleField(
  //     "allotment",
  //     "components.div.children.formwizardSixthStepAllotment.children.premiumAmountDetails.children.cardContent.children.installmentContainer.children.cardContent.children.detailsContainer.children.multipleInstallmentContainer.children.multipleInstallmentInfo.props.scheama.children.cardContent.children.installmentCard.children.dueDateForInstallment",
  //     "visible", 
  //     false
  //   )
  // )
}

export const setCompanyDocs = async  (action, state ,dispatch, partner = 0) => {
  const documentTypePayload = [{
    moduleName: "EstatePropertyService",
    masterDetails: [{
      name: "documents"
    }]
  }]
  const documentRes = await getMdmsData(dispatch, documentTypePayload);
  const {
    EstatePropertyService
  } = documentRes && documentRes.MdmsRes ? documentRes.MdmsRes : {}
  const {
    documents = []
  } = EstatePropertyService || {}
  const findMasterItem = documents.find(item => item.code === "MasterEst")
  const masterDocuments = !!findMasterItem ? findMasterItem.documentList : [];
  const estateMasterDocuments = masterDocuments.map(item => ({
    type: item.code,
    description: {
      labelName: "Only .jpg and .pdf files. 6MB max file size.",
      labelKey: item.fileType
    },
    formatProps: {
      accept: item.accept || "image/*, .pdf, .png, .jpeg",
    },
    maxFileSize: 6000,
    downloadUrl: item.downloadUrl,
    moduleName: "Estate",
    statement: {
      labelName: "Allowed documents are Aadhar Card / Voter ID Card / Driving License",
      labelKey: item.description
    }
  }))
  var documentTypes;
  var applicationDocs;
  documentTypes = prepareCompanyDocumentTypeObjMaster(masterDocuments, partner);
  applicationDocs = get(
    state.screenConfiguration.preparedFinalObject,
    `Properties[0].propertyDetails.partners[${partner}].partnerDetails.partnerDocuments`,
    []
  ) || [];


  applicationDocs = applicationDocs.filter(item => !!item)
  let applicationDocsReArranged =
    applicationDocs &&
    applicationDocs.length &&
    documentTypes.map(item => {
      const index = applicationDocs.findIndex(
        i => i.documentType === item.name
      );
      return applicationDocs[index];
    }).filter(item => !!item)
  applicationDocsReArranged &&
    dispatch(
      prepareFinalObject(
        `Properties[0].propertyDetails.partners[${partner}].partnerDetails.partnerDocuments`,
        applicationDocsReArranged
      )
    );
  dispatch(
    handleField(
      "allotment",
      `components.div.children.formwizardFourthStepAllotment.children.companyDocuments_${partner}.children.cardContent.children.documentList`,
      "props.inputProps",
      estateMasterDocuments
    )
  );
  dispatch(prepareFinalObject(`PropertiesTemp[0].propertyDetails.partners[${partner}].partnerDetails.partnerDocuments`, documentTypes))
  dispatch(prepareFinalObject("applyScreenMdmsData.estateApplications", documents))
}

const applyAllotment = {
  uiFramework: "material-ui",
  name: "allotment",
  beforeInitScreen: (action, state, dispatch) => {
    getData(action, state, dispatch)
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
        stepperAllotment,
        formwizardFirstStepAllotment,
        formwizardSecondStepAllotment,
        formwizardThirdStepAllotment,
        formwizardFourthStepAllotment,
        formwizardFifthStepAllotment,
        formwizardSixthStepAllotment,
        formwizardSeventhStepAllotment,
        formwizardEighthStepAllotment,
        formwizardNinthStepAllotment,
        footerAllotment
      }
    }
  }
}

export default applyAllotment;