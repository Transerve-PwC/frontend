import {
  getCommonHeader,
  dispatchMultipleFieldChangeAction,getLabel
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
  get,set
} from "lodash";
import {
  getSearchResults
} from "../../../../ui-utils/commons";
import * as companyDocsData from './applyResource/company-docs.json';
import { getTenantId } from "egov-ui-kit/utils/localStorageUtils";
import * as previousDocsData from './applyResource/previousOwnerDocs.json';
import * as biddersListData from './applyResource/biddersListDoc.json';
import { toggleEntityOwnersDivsBasedOnEntityType, toggleEntityOwnersDivsBasedOnPropertyRegisteredTo, getActionDefinationForAuctionDetailsFields } from './applyResource/propertyDetails'
import {downloadSummary} from "../utils"

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
      "apply",
      `components.div.children.formwizardFourthStep.children.ownerDocumentDetails_${owner}.children.cardContent.children.documentList`,
      "props.inputProps",
      estateMasterDocuments
    )
  );
  dispatch(prepareFinalObject(`PropertiesTemp[0].propertyDetails.owners[${owner}].ownerDetails.ownerDocuments`, documentTypes))
  dispatch(prepareFinalObject("applyScreenMdmsData.estateApplications", documents))
}

export const setPrevOwnerDocs = (action, state, dispatch, prevOwnerIndex = 0) => {
  const {
    EstatePropertyService
  } = previousDocsData && previousDocsData.MdmsRes ? previousDocsData.MdmsRes : {}
  const {
    previousOwnerDocs = []
  } = EstatePropertyService || {}
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
    EstatePropertyService
  } = biddersListData && biddersListData.MdmsRes ? biddersListData.MdmsRes : {}
  const {
    biddersListDoc = []
  } = EstatePropertyService || {}

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
    EstatePropertyService
  } = companyDocsData && companyDocsData.MdmsRes ? companyDocsData.MdmsRes : {}
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
      "apply",
      `components.div.children.formwizardFourthStep.children.companyDocuments_${owner}.children.cardContent.children.documentList`,
      "props.inputProps",
      estateMasterDocuments
    )
  );
  dispatch(prepareFinalObject(`PropertiesTemp[0].propertyDetails.owners[${owner}].ownerDetails.ownerDocuments`, documentTypes))
  dispatch(prepareFinalObject("applyScreenMdmsData.estateApplicationsCompanyDocs", documents))

}

const header = getCommonHeader({
  labelName: "Add Estate",
  labelKey: "ES_COMMON_ESTATES_ADD"
});

export const setData = (properties, screenName, dispatch) => {
  let propertyRegisteredTo = properties[0].propertyDetails.propertyRegisteredTo;
  let entityType = properties[0].propertyDetails.entityType;
  if (propertyRegisteredTo == "ENTITY") {
    toggleEntityOwnersDivsBasedOnEntityType(entityType, dispatch);
  }
  else {
    toggleEntityOwnersDivsBasedOnPropertyRegisteredTo(propertyRegisteredTo, dispatch)
  }

  let stepSecond;
  switch(screenName) {
    case "apply":
      stepSecond = "formwizardSecondStep";
      break;
    case "allotment":
      stepSecond = "formwizardSecondStepAllotment";
      break;
  }

  let allocationType = properties[0].propertyDetails.typeOfAllocation;
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

    setData(properties, screenName, dispatch);
  }
}

const getData = async (action, state, dispatch) => {
  const fileNumber = getQueryArg(window.location.href, "filenumber");

  if (fileNumber) {
    await getPMDetailsByFileNumber(action, state, dispatch, fileNumber, "apply")
  } else {
    dispatch(
      prepareFinalObject(
        "Properties",
        [{propertyMasterOrAllotmentOfSite: "PROPERTY_MASTER"}]
      )
    )
  }
  setDocumentData(action, state, dispatch);

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
  // getCompanyDocs(state, dispatch)
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

const buttonComponent = (label) => ({
  componentPath: "Button",
  gridDefination: {
    xs: 12,
    sm: 2
  },
  props: {
    variant: "contained",
    style: {
      color: "white",
      backgroundColor: "#fe7a51",
      borderColor:"#fe7a51",
      borderRadius: "2px",
      height: "48px"
    }
  },
  children: {
    buttonLabel: getLabel({
      labelName: label,
      labelKey: label
    })
  },
  onClickDefination: {
    action: "condition",
    callBack: (state, dispatch) => {
      if(label === "Download Summary"){
        const { Properties } = state.screenConfiguration.preparedFinalObject;
        // const documents = PropertiesTemp[0].reviewDocData;
        // set(Properties[0],"additionalDetails.ownerDocuments",documents)
        downloadSummary(Properties, []);
      }else{
        const { Properties } = state.screenConfiguration.preparedFinalObject;
        // const documents = PropertiesTemp[0].reviewDocData;
        // set(Properties[0],"additionalDetails.ownerDocuments",documents)
        downloadSummary(Properties,'print');
      }

    }
  }
})

const applyEstate = {
  uiFramework: "material-ui",
  name: "apply",
  beforeInitScreen: (action, state, dispatch) => {
    // let activeStep = get(
    //   state.screenConfiguration.screenConfig, 
    //   `apply.components.div.children.stepper.props.activeStep`
    // ) || 0;
    // console.log(activeStep)
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
        rightdiv: {
          visible:true,
          uiFramework: "custom-atoms",
          componentPath: "Container",
          props: {
            style: { justifyContent: "flex-end", marginTop: 10 }
          },
          gridDefination: {
            xs: 12,
            sm: 12,
            align: "right",
          },
          children: {
            downloadButton: buttonComponent("Download Summary"),
            printButton: buttonComponent("Print Summary"),
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