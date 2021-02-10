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
  footer, getPMDetailsByFileNumber,
} from './applyResourceManimajra/footer';
import {
  getQueryArg
} from "egov-ui-framework/ui-utils/commons";
import {
  handleScreenConfigurationFieldChange as handleField
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getTenantId } from "egov-ui-kit/utils/localStorageUtils";
import { ESTATE_SERVICES_MDMS_MODULE } from "../../../../ui-constants";
import { setDocumentData, setPrevOwnerDocs } from "./apply";
import { changeStep } from "./applyResourceManimajra/footer"
import {setDocsForEditFlow} from "../../../../ui-utils/apply"

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
    await getPMDetailsByFileNumber(action, state, dispatch, fileNumber, "apply-manimajra")
    setDocsForEditFlow(state, dispatch, "Properties[0].propertyDetails.owners[0].ownerDetails.ownerDocuments", "PropertiesTemp[0].propertyDetails.owners[0].ownerDetails.uploadedDocsInRedux");
    dispatch(
      handleField(
        "apply-manimajra",
        `components.div.children.formwizardFirstStep.children.propertyDetails.children.cardContent.children.detailsContainer.children.fileNumber`,
        `props.disabled`,
         true
      )
    )
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

  const stepNumber = getQueryArg(window.location.href, "stepNumber");
  if(!!stepNumber) {
    changeStep(state, dispatch, "apply-manimajra", "", Number(stepNumber))
  }
}

const applyManimajra = {
  uiFramework: "material-ui",
  name: "apply-manimajra",
  beforeInitScreen: (action, state, dispatch) => {
    dispatch(
      handleField(
        action.screenKey,
        "components.div.children.formwizardFirstStep.children",
        "monthlyDetails.visible",
         false
      )
    )
    dispatch(
      handleField(
        action.screenKey,
        "components.div.children.formwizardFirstStep.children",
        "annualDetails.visible",
        false
      )
    )
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
        // formwizardSixthStep,
        formwizardSeventhStep,
        formwizardEighthStep,
        footer
      }
    }
  }
}

export default applyManimajra;