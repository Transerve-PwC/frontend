import { getCommonHeader, getCommonCard, getCommonTitle, getCommonParagraph } from "egov-ui-framework/ui-config/screens/specs/utils";
import { prepareFinalObject, handleScreenConfigurationFieldChange as handleField } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import {footer, stepper} from './footer'
import { setThirdStep } from "./applyResource/review";
import { getSearchResults } from "../../../../ui-utils/commons";
import { setFirstStep } from "./applyResource/detailsStep";
import { setDocumentData, documentDetails } from "./applyResource/documentsStep";

const header = getCommonHeader({
    labelName: "Apply",
    labelKey: "EST_COMMON_APPLY"
  });

const formwizardFirstStep = {
    uiFramework: "custom-atoms",
  componentPath: "Form",
  props: {
    id: "apply_form1"
  },
  children: {
  }
}

const formwizardSecondStep = {
  uiFramework: "custom-atoms",
  componentPath: "Form",
  props: {
    id: "apply_form2"
  },
  children: {
    documentDetails
  },
  visible: false
}

const getPropertyData = async (action, state, dispatch) => {
  const fileNumber = getQueryArg(window.location.href, "fileNumber")
  const queryObject = [
    {key: "fileNumber", value: fileNumber}
  ]
  const response = await getSearchResults(queryObject)
  if(!!response.Properties && !!response.Properties.length) {
    dispatch(prepareFinalObject("property", response.Properties[0]));
    dispatch(prepareFinalObject("payload.property.id", response.Properties[0].propertyDetails.propertyId ))
  }
}

const getData = async (action, state, dispatch) => {
    await new Promise((resolve) => {
        setTimeout(resolve, 0)
    })
    const applicationType = getQueryArg(window.location.href, "applicationType");
    const dataConfig = require("./config.json")
    const {fields: data_config, first_step, second_step} = dataConfig[applicationType]
    setFirstStep(action, state, dispatch, {screenKey: "apply", screenPath: "components.div.children.formwizardFirstStep", data_config, format_config: first_step})
    setDocumentData(action, state, dispatch, {screenKey: "apply", screenPath: "components.div.children.formwizardSecondStep.children.documentDetails.children.cardContent.children.documentList", format_config: second_step})
    setThirdStep(action, state, dispatch, {screenKey: "apply", screenPath: "components.div.children.formwizardThirdStep.children"})
}

const formwizardThirdStep = {
  uiFramework: "custom-atoms",
  componentPath: "Form",
  props: {
    id: "apply_form3"
  },
  children: {
    // reviewDetails
  },
  visible: false
}

const commonApply = {
    uiFramework: "material-ui",
    name: "apply",
    beforeInitScreen: (action, state, dispatch) => {
        getPropertyData(action, state, dispatch)
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
            footer
          }
        }
      }
}

export default commonApply;