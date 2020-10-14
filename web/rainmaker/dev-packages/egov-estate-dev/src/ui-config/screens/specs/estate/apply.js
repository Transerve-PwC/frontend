import {
  getCommonHeader,
  dispatchMultipleFieldChangeAction,
  getCommonContainer
} from "egov-ui-framework/ui-config/screens/specs/utils";
import {
  stepper,
  formwizardFirstStep,
  formwizardSecondStep,
  formwizardThirdStep,
  formwizardFourthStep,
  formwizardFifthStep,
  formwizardSixthStep,
  formwizardSeventhStep,
  formwizardEighthStep,
  formwizardNinthStep
} from './applyResource/applyConfig'
import {
  httpRequest
} from "../../../../ui-utils";
import {
  prepareFinalObject
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import commonConfig from "config/common.js";
import {
  footer
} from './applyResource/footer';
import {
  getQueryArg
} from "egov-ui-framework/ui-utils/commons";
import {
  prepareDocumentTypeObjMaster,
  prepareCompanyDocumentTypeObjMaster,
  preparePrevOwnerDocumentTypeObjMaster,
  prepareBiddersDocumentTypeObjMaster
} from "../utils";
import {
  handleScreenConfigurationFieldChange as handleField
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import {
  get
} from "lodash";
import {
  getSearchResults,
  populateBiddersTable
} from "../../../../ui-utils/commons";
import * as companyDocsData from './applyResource/company-docs.json';
import { getTenantId } from "egov-ui-kit/utils/localStorageUtils";
import * as previousDocsData from './applyResource/previousOwnerDocs.json';
import * as biddersListData from './applyResource/biddersListDoc.json';
import { toggleEntityOwnersDivsBasedOnEntityType, toggleEntityOwnersDivsBasedOnPropertyRegisteredTo, getActionDefinationForAuctionDetailsFields } from './applyResource/propertyDetails'
import { ESTATE_SERVICES_MDMS_MODULE } from "../../../../ui-constants";


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

const setPaymentDocumentData = async (action, state, dispatch,owner = 0) => {

  const paymentDocuments=[{
    type:"PAYMENT_DOCUMENT",
    description: {
      labelName: "ONLY_CSV",
      labelKey: "ONLY_CSV",
    },
      formatProps :{
        accept : ".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel",
      }, 
      maxFileSize: 6000,
      moduleName: "Estate",
      statement: {
       labelName: "UPLOAD_CSV",
       labelKey: "UPLOAD_CSV"
  }
  }]
  const documentsType=[
    {
    name: "PAYMENT_DOCUMENT",
    required: true,
    jsonPath: `paymentDocuments`,
    statement: "UPLOAD_CSV"
    }
  ]
  dispatch(
    handleField(
        "apply",
        `components.div.children.formwizardEighthStep.children.paymentDocumentsDetails.children.cardContent.children.documentList`,
        "props.inputProps",
        paymentDocuments
    )
);

dispatch(prepareFinalObject(`PropertiesTemp[0].propertyDetails.owners[${owner}].ownerDetails.applicationPaymentDocuments`, documentsType))
}

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
      "apply",
      `components.div.children.formwizardFourthStep.children.ownerDocumentDetails_${owner}.children.cardContent.children.documentList`,
      "props.inputProps",
      estateMasterDocuments
    )
  );
  dispatch(prepareFinalObject(`PropertiesTemp[0].propertyDetails.owners[${owner}].ownerDetails.ownerDocuments`, documentTypes))
  dispatch(prepareFinalObject("applyScreenMdmsData.estateApplications", documents))
  setPaymentDocumentData(action, state, dispatch,owner)

}

export const setPrevOwnerDocs = (action, state, dispatch, prevOwnerIndex = 0) => {
  const {
    EstateServices
  } = previousDocsData && previousDocsData.MdmsRes ? previousDocsData.MdmsRes : {}
  const {
    previousOwnerDocs = []
  } = EstateServices || {}
  const findMasterItem = previousOwnerDocs.find(item => item.code === "MasterEst")
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
  documentTypes = preparePrevOwnerDocumentTypeObjMaster(masterDocuments, prevOwnerIndex);
  applicationDocs = get(
    state.screenConfiguration.preparedFinalObject,
    `Properties[0].propertyDetails.purchaser[${prevOwnerIndex}].ownerDetails.ownerDocuments`,
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
        `Properties[0].propertyDetails.purchaser[${prevOwnerIndex}].ownerDetails.ownerDocuments`,
        applicationDocsReArranged
      )
    );
  dispatch(
    handleField(
      "apply",
      `components.div.children.formwizardSixthStep.children.previousOwnerDocuments_${prevOwnerIndex}.children.cardContent.children.documentList`,
      "props.inputProps",
      estateMasterDocuments
    )
  );
  dispatch(prepareFinalObject(`PropertiesTemp[0].propertyDetails.purchaser[${prevOwnerIndex}].ownerDetails.ownerDocuments`, documentTypes))
  dispatch(prepareFinalObject("applyScreenMdmsData.estateApplicationsPrevOwnerDocs", previousOwnerDocs))
}

const setBiddersDoc = (action, state, dispatch) => {
  const {
    EstateServices
  } = biddersListData && biddersListData.MdmsRes ? biddersListData.MdmsRes : {}
  const {
    biddersListDoc = []
  } = EstateServices || {}

  const findMasterItem = biddersListDoc.find(item => item.code === "MasterEst")
  const masterDocuments = !!findMasterItem ? findMasterItem.documentList : [];

  var documentTypes;
  documentTypes = prepareBiddersDocumentTypeObjMaster(masterDocuments);

  dispatch(
    handleField(
      "apply",
      `components.div.children.formwizardSecondStep.children.AllotmentAuctionDetails.children.cardContent.children.biddersListContainer.children.cardContent.children.documentList`,
      "props.inputProps",
      masterDocuments
    )
  );
  dispatch(prepareFinalObject(`temp[0].documents`, documentTypes))
}

const getCompanyDocs = (action, state, dispatch, owner = 0) => {
  const {
    EstateServices
  } = companyDocsData && companyDocsData.MdmsRes ? companyDocsData.MdmsRes : {}
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
      "apply",
      `components.div.children.formwizardFourthStep.children.companyDocuments_${owner}.children.cardContent.children.documentList`,
      "props.inputProps",
      estateMasterDocuments
    )
  );
  dispatch(prepareFinalObject(`PropertiesTemp[0].propertyDetails.owners[${owner}].ownerDetails.ownerDocuments`, documentTypes))
  dispatch(prepareFinalObject("applyScreenMdmsData.estateApplicationsCompanyDocs", documents))

}

const header = getCommonContainer({
  header: getCommonHeader({
    labelName: "Add Estate",
    labelKey: "ES_COMMON_ESTATES_ADD"
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

export const setData = (properties, screenName, dispatch, state) => {
  let propertyRegisteredTo = properties[0].propertyDetails.propertyRegisteredTo;
  let entityType = properties[0].propertyDetails.entityType;
  let fileNumber = properties[0].fileNumber;
  let stepSecond;
  let allocationType = properties[0].propertyDetails.typeOfAllocation;
  let propertyType = properties[0].propertyDetails.propertyType;
  let category = properties[0].category;
  let stepFirst;

  switch(screenName) {
    case "apply":
      stepFirst = "formwizardFirstStep";
      stepSecond = "formwizardSecondStep";
      break;
    case "allotment":
      stepFirst = "formwizardFirstStepAllotment";
      stepSecond = "formwizardSecondStepAllotment";
      break;
  }

  /* set file number in the file number container and disable file number field */
  dispatch(
    handleField(
      screenName,
      `components.div.children.headerDiv.children.header.children.fileNumber`,
      `props.number`,
      fileNumber
    )
  )
  dispatch(
    handleField(
      screenName,
      `components.div.children.headerDiv.children.header.children.fileNumber`,
      `visible`,
      true
    )
  )
  dispatch(
    handleField(
      screenName,
      `components.div.children.formwizardFirstStep.children.propertyInfoDetails.children.cardContent.children.detailsContainer.children.fileNumber`,
      `props.disabled`,
      true
    )
  )
  /**********************************************************************************************/

  /* toggle display of entity owner divs based on the value of PropertyRegisteredTo and entityType */
  if (propertyRegisteredTo == "ENTITY") {
    toggleEntityOwnersDivsBasedOnEntityType(entityType, dispatch);
  }
  else {
    toggleEntityOwnersDivsBasedOnPropertyRegisteredTo(propertyRegisteredTo, dispatch)
  }
  /**********************************************************************************************/

  /* based on allocationType toggle display of bidders list upload container and disable auction details fields */
  dispatchMultipleFieldChangeAction(
    screenName,
    getActionDefinationForAuctionDetailsFields(!!(allocationType == "ALLOCATION_TYPE.ALLOTMENT"), stepSecond),
    dispatch
  );
  dispatch(
    handleField(
      screenName,
      `components.div.children.${stepSecond}.children.AllotmentAuctionDetails.children.cardContent.children.biddersListContainer`,
      `visible`,
      !!(allocationType == "ALLOCATION_TYPE.AUCTION")
    )
  )
  /*************************************************************************************************/

  /* based on the propertyType toggle display of groundRent and licenseFee containers */
  if (screenName == "allotment") {
    dispatch(
      handleField(
          "allotment",
          "components.div.children.formwizardSixthStepAllotment.children.demandSelect",
          "visible",
          !!(propertyType == "PROPERTY_TYPE.LEASEHOLD")
      )
    ) 
  }
  /*************************************************************************************************/

  /* based on selected category toggle display of sub-category field */
  if (category == "CAT.RESIDENTIAL" || category == "CAT.COMMERCIAL") {
    dispatch(
      handleField(
        screenName,
        `components.div.children.${stepFirst}.children.propertyInfoDetails.children.cardContent.children.detailsContainer.children.subCategory`,
        "visible",
        true
      )
    );

    const categories = get(
      state.screenConfiguration.preparedFinalObject,
      "applyScreenMdmsData.EstateServices.categories"
    )

    const filteredCategory = categories.filter(item => item.code === category)
    dispatch(
      handleField(
          screenName,
          `components.div.children.${stepFirst}.children.propertyInfoDetails.children.cardContent.children.detailsContainer.children.subCategory`,
          "props.data",
          filteredCategory[0].SubCategory
      )
    )
    dispatch(
      handleField(
          screenName,
          `components.div.children.${stepFirst}.children.propertyInfoDetails.children.cardContent.children.detailsContainer.children.subCategory`,
          "props.value",
          properties[0].subCategory
      )
    )
  }

  /* Show current bidders list data if uploaded */
  if (properties[0].propertyDetails.bidders) {
    dispatch(
      handleField(
        screenName,
        `components.div.children.${stepSecond}.children.AllotmentAuctionDetails.children.cardContent.children.auctionTableContainer`,
        "visible",
        true
      )
    );
    let { bidders } = properties[0].propertyDetails;
    populateBiddersTable(bidders, screenName, `components.div.children.${stepSecond}.children.AllotmentAuctionDetails.children.cardContent.children.auctionTableContainer`)
  }
  /*******************************************************************************/
}

export const getPMDetailsByFileNumber = async (
  action,
  state,
  dispatch,
  fileNumber,
  screenName
) => {
  let queryObject = [
    {
      key: "tenantId",
      value: getTenantId()
    },
    { 
      key: "fileNumber", 
      value: fileNumber 
    }
  ];

  const payload = await getSearchResults(queryObject);

  if (payload) {
    let properties = payload.Properties;
    let owners = properties[0].propertyDetails.owners;
    owners = owners.map(item => ({...item, share: (item.share).toString()}))

    let currOwners = owners.filter(item => item.ownerDetails.isCurrentOwner == true);
    let prevOwners = owners.filter(item => item.ownerDetails.isCurrentOwner == false);
    let ratePerSqft = (properties[0].propertyDetails.ratePerSqft).toString();
    let areaSqft = (properties[0].propertyDetails.areaSqft).toString();

    properties = [{...properties[0], propertyDetails: {...properties[0].propertyDetails, owners: currOwners, purchaser: prevOwners, ratePerSqft: ratePerSqft, areaSqft: areaSqft}}]

    dispatch(
      prepareFinalObject(
        "Properties",
        properties 
      )
    )

    setData(properties, screenName, dispatch, state);
  }
}

const getData = async (action, state, dispatch) => {
  const fileNumber = getQueryArg(window.location.href, "filenumber");
  if (!fileNumber) {
    dispatch(
      prepareFinalObject(
        "Properties",
        [{propertyMasterOrAllotmentOfSite: "PROPERTY_MASTER"}]
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
    }
    ]
  }]

  const response = await getMdmsData(dispatch, mdmsPayload);
  dispatch(prepareFinalObject("applyScreenMdmsData", response.MdmsRes));

  if (!!fileNumber) {
    await getPMDetailsByFileNumber(action, state, dispatch, fileNumber, "apply")
  }
  setDocumentData(action, state, dispatch);
  setPrevOwnerDocs(action, state, dispatch);
  setBiddersDoc(action, state, dispatch);

  dispatch(
    handleField(
      "apply",
      "components.div.children.formwizardSecondStep.children.AllotmentAuctionDetails.children.cardContent.children.biddersListContainer.children.cardContent.children.documentList",
      "props.screenKey",
      "apply"
    )
  )
  dispatch(
    handleField(
      "apply",
      "components.div.children.formwizardSecondStep.children.AllotmentAuctionDetails.children.cardContent.children.biddersListContainer.children.cardContent.children.documentList",
      "props.componentJsonPath",
      "components.div.children.formwizardSecondStep.children.AllotmentAuctionDetails.children.cardContent.children.auctionTableContainer"
    )
  )
}

const applyEstate = {
  uiFramework: "material-ui",
  name: "apply",
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
        stepper,
        formwizardFirstStep,
        formwizardSecondStep,
        formwizardThirdStep,
        formwizardFourthStep,
        formwizardFifthStep,
        formwizardSixthStep,
        formwizardSeventhStep,
        formwizardEighthStep,
        formwizardNinthStep,
        footer
      }
    }
  }
}

export default applyEstate;