import { getCommonCard, getCommonHeader } from "egov-ui-framework/ui-config/screens/specs/utils";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import {footer, stepper} from './footer'
import { setThirdStep } from "./applyResource/review";
import { getSearchApplicationsResults, getSearchResults } from "../../../../ui-utils/commons";
import { setFirstStep } from "./applyResource/detailsStep";
import { setDocumentData, documentDetails, inputProps } from "./applyResource/documentsStep";
import { toggleSpinner } from "egov-ui-kit/redux/common/actions";
import get from "lodash/get";
import { registerDatasource } from "./dataSources";

const header = getCommonHeader({
    labelName: "Apply",
    labelKey: "ES_COMMON_APPLY"
  });

const getPropertyData = async (action, state, dispatch) => {
  const fileNumber = getQueryArg(window.location.href, "fileNumber")
  const queryObject = [
    {key: "fileNumber", value: fileNumber}
  ]
  const response = await getSearchResults(queryObject)
  if(!!response.Properties && !!response.Properties.length) {
    dispatch(prepareFinalObject("property", response.Properties[0]));
    dispatch(prepareFinalObject("Applications[0].property.id", response.Properties[0].propertyDetails.propertyId ))
  }
}

const getData = async (action, state, dispatch) => {
  let applicationType = getQueryArg(window.location.href, "applicationType");
  const applicationNumber = getQueryArg(window.location.href, "applicationNumber")
  let propertyId = getQueryArg(window.location.href, "propertyId")
  let property = {};
  if(!!applicationNumber) {
    const applicationQueryObject = [
      {key: "applicationNumber", value: applicationNumber}
    ] 
    try {
      const applicationRes = await getSearchApplicationsResults(applicationQueryObject)
      const {Applications = []} = applicationRes;
      dispatch(prepareFinalObject("Applications", Applications))
      const {branchType, moduleType, applicationType: type} = Applications[0];
      applicationType = `${branchType}_${moduleType}_${type}`;
      property = Applications[0].property
      propertyId = Applications[0].property.id
    } catch (error) {
      return {}
    }
  } else {
    const queryObject = [
      {key: "propertyId", value: propertyId}
    ]
    const response = await getSearchResults(queryObject)
    if(!!response.Properties && !!response.Properties.length) {
       property = response.Properties[0]
       dispatch(prepareFinalObject("Applications[0].property.id", propertyId ))
    }
  }
    // await new Promise((resolve) => {
    //     setTimeout(resolve, 0)
    // })
    dispatch(prepareFinalObject("property", property));
    const dataConfig = require(`./${applicationType}.json`);
    let {fields: data_config, first_step, second_step, dataSources} = dataConfig[applicationType][0];
    const values = applicationType.split("_")
    dispatch(prepareFinalObject("Applications[0].branchType", values[0] ))
    dispatch(prepareFinalObject("Applications[0].moduleType", values[1] ))
    dispatch(prepareFinalObject("Applications[0].applicationType", values[2] ))
    //Register all the datasources in the config.
    !!dataSources && dataSources.forEach(dataSource => dataSource.type === "path" ?
      registerDatasource({...dataSource, data: property})
    : registerDatasource(dataSource));

    const first_step_sections = await setFirstStep(state, dispatch, { data_config, format_config: first_step})
    const second_step_sections = await setDocumentData(state, dispatch, { format_config: second_step})
    let third_step = await setThirdStep({state, dispatch, applicationType})
    third_step = getCommonCard({...third_step})
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
        // await getPropertyData(action, state, dispatch)
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