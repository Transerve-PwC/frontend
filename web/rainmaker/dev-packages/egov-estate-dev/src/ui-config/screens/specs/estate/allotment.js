import {
  getCommonHeader,
  getCommonContainer
} from "egov-ui-framework/ui-config/screens/specs/utils";
import {
  stepperAllotment,
  formwizardFirstStepAllotment,
  formwizardSecondStepAllotment,
  formwizardThirdStepAllotment,
  formwizardFourthStepAllotment,
  formwizardFifthStepAllotment,
  formwizardSixthStepAllotment,
  formwizardSeventhStepAllotment
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
  prepareBiddersDocumentTypeObjMaster
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
import { getPMDetailsByFileNumber } from './apply'
import { ESTATE_SERVICES_MDMS_MODULE } from "../../../../ui-constants";


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
    moduleName: ESTATE_SERVICES_MDMS_MODULE,
    masterDetails: [{
      name: "documents"
    }]
  }]
  const documentRes = await getMdmsData(dispatch, documentTypePayload);
  const {
    EstateServices
  } = documentRes && documentRes.MdmsRes ? documentRes.MdmsRes : {}
  const {
    documents = []
  } = EstateServices || {}
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
      `components.div.children.formwizardFourthStepAllotment.children.ownerDocumentDetails_${owner}.children.cardContent.children.documentList`,
      "props.inputProps",
      estateMasterDocuments
    )
  );
  dispatch(prepareFinalObject(`PropertiesTemp[0].propertyDetails.owners[${owner}].ownerDetails.ownerDocuments`, documentTypes))
  dispatch(prepareFinalObject("applyScreenMdmsData.estateApplications", documents))
}

const setBiddersDoc = async (action, state, dispatch) => {
  const documentTypePayload = [{
    moduleName: ESTATE_SERVICES_MDMS_MODULE,
    masterDetails: [{
      name: "biddersListDoc"
    }]
  }]
  const documentRes = await getMdmsData(dispatch, documentTypePayload);
  const {
    EstateServices
  } = documentRes && documentRes.MdmsRes ? documentRes.MdmsRes : {}
  const {
    biddersListDoc = []
  } = EstateServices || {}

  const findMasterItem = biddersListDoc.find(item => item.code === "MasterEst")
  const masterDocuments = !!findMasterItem ? findMasterItem.documentList : [];

  var documentTypes;
  documentTypes = prepareBiddersDocumentTypeObjMaster(masterDocuments);

  dispatch(
    handleField(
      "allotment",
      `components.div.children.formwizardSecondStepAllotment.children.AllotmentAuctionDetails.children.cardContent.children.biddersListContainer.children.cardContent.children.documentList`,
      "props.inputProps",
      masterDocuments
    )
  );
  dispatch(prepareFinalObject(`temp[0].documents`, documentTypes))
  dispatch(
    handleField(
      "allotment",
      "components.div.children.formwizardSecondStepAllotment.children.AllotmentAuctionDetails.children.cardContent.children.biddersListContainer.children.cardContent.children.documentList",
      "props.screenKey",
      "allotment"
    )
  )
  dispatch(
    handleField(
      "allotment",
      "components.div.children.formwizardSecondStepAllotment.children.AllotmentAuctionDetails.children.cardContent.children.biddersListContainer.children.cardContent.children.documentList",
      "props.componentJsonPath",
      "components.div.children.formwizardSecondStepAllotment.children.AllotmentAuctionDetails.children.cardContent.children.auctionTableContainer"
    )
  )
}

const header = getCommonContainer({
  header: getCommonHeader({
    labelName: "Allotment of Site",
    labelKey: "ES_ALLOTMENT_OF_SITE"
  }),
  fileNumber: {
    uiFramework: "custom-atoms-local",
    moduleName: "egov-estate",
    componentPath: "FileNumberContainer",
    props: {
      number: ""
    },
    visible: false
  }
})

const getData = async (action, state, dispatch) => {
  const fileNumber = getQueryArg(window.location.href, "fileNumber");
  if (!fileNumber) {
    dispatch(
      prepareFinalObject(
        "Properties",
        [{
          propertyMasterOrAllotmentOfSite: "ALLOTMENT_OF_SITE",
          propertyDetails: {
            branchType: "ESTATE_BRANCH"
          }
        }]
      )
    )
  }
  
  const mdmsPayload = [{
    moduleName: ESTATE_SERVICES_MDMS_MODULE,
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
      },
      {
        name: "sector"
      }
    ]
  }]

  const response = await getMdmsData(dispatch, mdmsPayload);
  dispatch(prepareFinalObject("applyScreenMdmsData", response.MdmsRes));

  if (!!fileNumber) {
    await getPMDetailsByFileNumber(action, state, dispatch, fileNumber, "allotment")
  }
  
  setDocumentData(action, state, dispatch);

  dispatch(
    handleField(
      "allotment",
      "components.div.children.formwizardSixthStepAllotment.children.groundRentDetails",
      "visible",
      false
    )
  )
  dispatch(
    handleField(
      "allotment",
      "components.div.children.formwizardSixthStepAllotment.children.licenseFeeDetails",
      "visible",
      false
    )
  )
  dispatch(
    handleField(
      "allotment",
      "components.div.children.formwizardSeventhStepAllotment.children.reviewAllotmentDetails.children.cardContent.children.reviewGroundRent",
      "visible",
      false
    )
  )
  dispatch(
    handleField(
      "allotment",
      "components.div.children.formwizardSeventhStepAllotment.children.reviewAllotmentDetails.children.cardContent.children.reviewLicenseFee",
      "visible",
      false
    )
  )
  dispatch(
    handleField(
      "allotment",
      "components.div.children.formwizardSeventhStepAllotment.children.reviewAllotmentDetails.children.cardContent.children.reviewAdvanceRent",
      "visible",
      false
    )
  )

  setBiddersDoc(action, state, dispatch);
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
        footerAllotment
      }
    }
  }
}

export default applyAllotment;