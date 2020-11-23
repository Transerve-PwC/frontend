import {
  getCommonHeader,
  getCommonContainer
} from "egov-ui-framework/ui-config/screens/specs/utils";
import {
  manimajraStepper,
  formwizardFirstStep,
  formwizardSecondStep,
  formwizardThirdStep,
  formwizardFourthStep,
  formwizardFifthStep,
  formwizardSixthStep,
  formwizardSeventhStep,
  formwizardEighthStep
} from './applyResourceManimajra/applyConfig'
import {
  httpRequest
} from "../../../../ui-utils";
import {
  prepareFinalObject
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import commonConfig from "config/common.js";
import {
  footer,
} from './applyResourceManimajra/footer';
import {
  getQueryArg
} from "egov-ui-framework/ui-utils/commons";
import {
  handleScreenConfigurationFieldChange as handleField
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import {
  getSearchResults,
} from "../../../../ui-utils/commons";
import { getTenantId } from "egov-ui-kit/utils/localStorageUtils";
import { ESTATE_SERVICES_MDMS_MODULE } from "../../../../ui-constants";
import { setDocumentData, setPrevOwnerDocs } from "./apply"


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

export const getPMDetailsByFileNumber = async (
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
    let owners = properties[0].propertyDetails.owners;

    owners = owners.map(item => ({...item, share: (item.share).toString(), ownerDetails: {...item.ownerDetails, isPreviousOwnerRequired: (item.ownerDetails.isPreviousOwnerRequired).toString()}}));

    let currOwners = owners.filter(item => item.ownerDetails.isCurrentOwner == true);
    let prevOwners = owners.filter(item => item.ownerDetails.isCurrentOwner == false);
    let areaSqft = (properties[0].propertyDetails.areaSqft).toString();

    properties = [{...properties[0], propertyDetails: {...properties[0].propertyDetails, owners: currOwners, purchaser: prevOwners, areaSqft: areaSqft}}]

    dispatch(
      prepareFinalObject(
        "Properties",
        properties 
      )
    )
  }
}

const getData = async (action, state, dispatch) => {
  const fileNumber = getQueryArg(window.location.href, "fileNumber");
  if (!fileNumber) {
    dispatch(
      prepareFinalObject(
        "Properties",
        [{
          propertyMasterOrAllotmentOfSite: "PROPERTY_MASTER",
          propertyDetails: {
            branchType: "MANI_MAJRA"
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
      name: "propertyTypeMM"
    },
    {
      name: "modeOfTransfer"
    },
    {
      name: "sector"
    }
    ]
  }]

  const response = await getMdmsData(dispatch, mdmsPayload);
  dispatch(prepareFinalObject("applyScreenMdmsData", response.MdmsRes));

  if (!!fileNumber) {
    await getPMDetailsByFileNumber(action, state, dispatch, fileNumber, "apply")
  }
  setDocumentData(action, state, dispatch, 0, "formwizardThirdStep");
  setPrevOwnerDocs(action, state, dispatch, 0, "formwizardFifthStep");

  // hide isCurrentOwner radio button for create pm manimajra
  dispatch(
    handleField(
      action.screenKey,
      "components.div.children.formwizardSecondStep.children.ownerDetails.children.cardContent.children.detailsContainer.children.multipleApplicantContainer.children.multipleApplicantInfo.props.scheama.children.cardContent.children.ownerCard.children.isCurrentOwner",
      "visible",
      false
    )
  )
}

const applyManimajra = {
  uiFramework: "material-ui",
  name: "apply-manimajra",
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
        manimajraStepper,
        formwizardFirstStep,
        formwizardSecondStep,
        formwizardThirdStep,
        formwizardFourthStep,
        formwizardFifthStep,
        formwizardSixthStep,
        formwizardSeventhStep,
        formwizardEighthStep,
        footer
      }
    }
  }
}

export default applyManimajra;