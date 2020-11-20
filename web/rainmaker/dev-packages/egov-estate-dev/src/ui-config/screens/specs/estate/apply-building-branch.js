import {
  getCommonHeader,
  getCommonContainer
} from "egov-ui-framework/ui-config/screens/specs/utils";
import {
  stepper,
  formwizardFirstStep,
  formwizardSecondStep,
  formwizardThirdStep,
  formwizardFourthStep
} from "./applyResourceBuildingBranch/applyConfig";
import {
  footer
} from "./applyResourceBuildingBranch/footer";
import { ESTATE_SERVICES_MDMS_MODULE } from "../../../../ui-constants";
import {
  httpRequest,
} from "../../../../ui-utils";
import {
  prepareFinalObject,
  handleScreenConfigurationFieldChange as handleField
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import {
  getQueryArg
} from "egov-ui-framework/ui-utils/commons";
import commonConfig from "config/common.js";
import {
  prepareDocumentTypeObjMaster
} from "../utils";
import {
  get
} from "lodash";
import { getSearchResults } from "../../../../ui-utils/commons"
import { getTenantId } from "egov-ui-kit/utils/localStorageUtils";

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

const header = getCommonContainer({
  header: getCommonHeader({
    labelName: "Add Property",
    labelKey: "ES_COMMON_ADD_PROPERTY"
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

const getPMDetailsByFileNumber = async(
  action,
  state,
  dispatch,
  fileNumber
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
    dispatch(
      prepareFinalObject(
        "Properties",
        properties 
      )
    )
  }
}

const getData = async(action, state, dispatch) => {
  const fileNumber = getQueryArg(window.location.href, "fileNumber");
  if (!fileNumber) {
    dispatch(
      prepareFinalObject(
        "Properties",
        [{
          propertyDetails: {
            branchType: "BUILDING_BRANCH"
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
    await getPMDetailsByFileNumber(action, state, dispatch, fileNumber, "apply-building-branch")
  }

  setDocumentData(action, state, dispatch);
}

export const setDocumentData = async (action, state, dispatch, ownerIndex = 0) => {
  const documentTypePayload = [{
    moduleName: ESTATE_SERVICES_MDMS_MODULE,
    masterDetails: [{
      name: "buildingBranchOwnerDocs"
    }]
  }]
  const docsData = await getMdmsData(dispatch, documentTypePayload);
  const {
    EstateServices
  } = docsData && docsData.MdmsRes ? docsData.MdmsRes : {}
  const {
    buildingBranchOwnerDocs = []
  } = EstateServices || {}
  const findMasterItem = buildingBranchOwnerDocs.find(item => item.code === "MasterEst")
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
  documentTypes = prepareDocumentTypeObjMaster(masterDocuments, ownerIndex);
  applicationDocs = get(
    state.screenConfiguration.preparedFinalObject,
    `Properties[0].propertyDetails.owners[${ownerIndex}].ownerDetails.ownerDocuments`,
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
        `Properties[0].propertyDetails.owners[${ownerIndex}].ownerDetails.ownerDocuments`,
        applicationDocsReArranged
      )
    );
  dispatch(
    handleField(
      "apply-building-branch",
      `components.div.children.formwizardThirdStep.children.ownerDocumentDetails_${ownerIndex}.children.cardContent.children.documentList`,
      "props.inputProps",
      estateMasterDocuments
    )
  );
  dispatch(prepareFinalObject(`PropertiesTemp[0].propertyDetails.owners[${ownerIndex}].ownerDetails.ownerDocuments`, documentTypes))
  dispatch(prepareFinalObject("applyScreenMdmsData.estateApplicationsBuildingBranchDocs", buildingBranchOwnerDocs))
}

const createProperty = {
  uiFramework: "material-ui",
  name: "apply-building-branch",
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
        footer
      }
    }
  }
}

export default createProperty;