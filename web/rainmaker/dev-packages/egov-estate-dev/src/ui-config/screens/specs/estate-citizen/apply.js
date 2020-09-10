import { getCommonHeader } from "egov-ui-framework/ui-config/screens/specs/utils";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import {footer, stepper} from './footer'
import { setThirdStep } from "./applyResource/review";
import { getSearchResults } from "../../../../ui-utils/commons";
import { setFirstStep } from "./applyResource/detailsStep";
import { setDocumentData, documentDetails, inputProps } from "./applyResource/documentsStep";
import { toggleSpinner } from "egov-ui-kit/redux/common/actions";
import get from "lodash/get";
import { registerDatasource } from "./dataSources";

const header = getCommonHeader({
    labelName: "Apply",
    labelKey: "EST_COMMON_APPLY"
  });

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
    const dataConfig = require(`./${applicationType}.json`);
    let {fields: data_config, first_step, second_step, dataSources} = dataConfig[applicationType];
    
    //Register all the datasources in the config.
    !!dataSources && dataSources.forEach(dataSource => registerDatasource(dataSource));

    const first_step_sections = await setFirstStep(state, dispatch, { data_config, format_config: first_step})
    const second_step_sections = await setDocumentData(state, dispatch, { format_config: second_step})
    const third_step = await setThirdStep(state, dispatch)
    inputProps.push(...second_step_sections);
    return {
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
              },
              updateContainer: {
                uiFramework: "custom-containers-local",
                moduleName: "egov-estate",
                componentPath: "UpdateContainer",
              }
            }
          },
          stepper,
          formwizardFirstStep : {
            uiFramework: "custom-atoms",
          componentPath: "Form",
          props: {
            id: "apply_form1"
          },
          children: first_step_sections
        },
          formwizardSecondStep : {
            uiFramework: "custom-atoms",
            componentPath: "Form",
            props: {
              id: "apply_form2"
            },
            children: {
              documentDetails
            },
            visible: false
          } ,
          formwizardThirdStep: {
            uiFramework: "custom-atoms",
            componentPath: "Form",
            props: {
              id: "apply_form3"
            },
            children: {
              reviewDetails: third_step
            },
            visible: false
          } ,
          footer
        }
      }
    }
}

const commonApply = {
    uiFramework: "material-ui",
    name: "apply",
    hasBeforeInitAsync: true,
    beforeInitScreen: async (action, state, dispatch) => {
        dispatch(toggleSpinner())
        await getPropertyData(action, state, dispatch)
        const components = await getData(action, state, dispatch)
        dispatch(toggleSpinner())
        return {
          "type": "INIT_SCREEN",
          "screenKey": "apply",
          "screenConfig": {
            "uiFramework": "material-ui",
            "name": "apply",
            components
          }
        }
    }
}

export default commonApply;