import { dispatchMultipleFieldChangeAction, getCommonCard, getCommonHeader, getStepperObject,getCommonTitle } from "egov-ui-framework/ui-config/screens/specs/utils";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import { getCommonContainer } from "egov-ui-framework/ui-config/screens/specs/utils";
import {footer, stepsData} from './footer'
import { setThirdStep } from "./applyResource/review";
import { getSearchApplicationsResults, getSearchResults } from "../../../../ui-utils/commons";
import { setFirstStep, updateReadOnlyForAllFields } from "./applyResource/detailsStep";
import { setDocumentData, documentDetails, inputProps } from "./applyResource/documentsStep";
import { toggleSpinner } from "egov-ui-kit/redux/common/actions";
import get from "lodash/get";
import { registerDatasource } from "./dataSources";
import { getCommonApplyHeader } from "../utils";
import commonConfig from "config/common.js";
import { getMdmsData } from "../estate/apply";

export const getApplicationConfig = async({dispatch, applicationType}) => {
  const payload = [
    {
      moduleName: "EstateServices",
      masterDetails: [
        { name:  applicationType}
      ]
    }
  ]
  const applicationResponse = await getMdmsData(dispatch, payload)
  try {
   return applicationResponse.MdmsRes.EstateServices[applicationType][0]
  } catch (error) {
    console.log(error)
  }
}

const hideFooter = async (action, state, dispatch) => {
  const screenConfig = get(state.screenConfiguration, "screenConfig");
  const {_apply} = screenConfig;
  if(!!_apply) {
    const actionDefination = [{
                path: "components.div.children.footer.children.previousButton",
                property: "visible",
                value: false
            },
            {
                path: "components.div.children.footer.children.nextButton",
                property: "visible",
                value: true
            },
            {
                path: "components.div.children.footer.children.submitButton",
                property: "visible",
                value: false
            }]
    await dispatchMultipleFieldChangeAction("_apply", actionDefination, dispatch);
  }
}


const getData = async (action, state, dispatch) => {
  await dispatch(prepareFinalObject("Applications", []))
  await dispatch(prepareFinalObject("temp", []))
  let applicationType = getQueryArg(window.location.href, "applicationType");
  const applicationNumber = getQueryArg(window.location.href, "applicationNumber")
  let propertyId = getQueryArg(window.location.href, "propertyId")
  let fileNumber = getQueryArg(window.location.href, "fileNumber")
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
      fileNumber = Applications[0].property.fileNumber
    } catch (error) {
      return {}
    }
  } 
  // else {
    const queryObject = [
      {key: "propertyIds", value: propertyId},
      {key: "fileNumber", value: fileNumber}
    ]
    const response = await getSearchResults(queryObject)
    if(!!response.Properties && !!response.Properties.length) {
       property = response.Properties[0]
       dispatch(prepareFinalObject("Applications[0].property.id", propertyId ))
    }
  // }
    await hideFooter(action, state, dispatch)
    const owners = property.propertyDetails.owners.filter(item => !!item.ownerDetails.isCurrentOwner)
    property = {...property, propertyDetails: {...property.propertyDetails, owners}}
    
    const headerLabel = `ES_APPLY_${applicationType.toUpperCase()}`

    const header = getCommonApplyHeader({label: headerLabel, number: applicationNumber})
    const headerDeclaration = getCommonTitle({labelName: "Declaration", labelKey: "ES_DECLARATION_CHECKBOX_LABEL"})
    
    dispatch(prepareFinalObject("property", property));

    let {fields: data_config, documentList, uiConfig} = await getApplicationConfig({dispatch, applicationType})
    // const dataConfig = require(`./${applicationType}.json`);
    // let {fields: data_config, documentList, uiConfig} = dataConfig[applicationType][0];
    let {first_step, second_step, dataSources, preview} = uiConfig
    const values = applicationType.split("_")
    dispatch(prepareFinalObject("Applications[0].branchType", values[0] ))
    dispatch(prepareFinalObject("Applications[0].moduleType", values[1] ))
    dispatch(prepareFinalObject("Applications[0].applicationType", values[2] ))
    // dispatch(prepareFinalObject("temp[0].declaration", false));
    //Register all the datasources in the config.
    !!dataSources && dataSources.forEach(dataSource => dataSource.type === "path" ?
      registerDatasource({...dataSource, data: property})
    : registerDatasource(dataSource));
    
    const stepper = getStepperObject(
      { props: { activeStep: 0 } },
      stepsData
    );

    const applyFooter = footer;
    const first_step_sections = await setFirstStep(state, dispatch, { data_config, format_config: first_step})
    const second_step_sections = await setDocumentData(state, dispatch, { format_config: second_step, documentList})
    let third_step = await setThirdStep({state, dispatch, applicationType, preview})
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
              reviewDetails: third_step,
              headerDiv: {
                uiFramework: "custom-atoms",
                componentPath: "Container",
                props: {	
                  style: { marginBottom: "5px" }	
                },
                children: {
                  header: {
                    gridDefination: {
                      xs: 12,
                      sm: 10
                    },
                    ...headerDeclaration
                  }
                }
              },
              declarationSummary: {
                uiFramework: "custom-containers-local",
                moduleName: "egov-estate",
                componentPath: "CheckboxContainer",
                jsonPath: "temp[0].declaration",
                props: {
                  label: {
                    labelName: "I hereby declare and affirm that the above-furnished information is true and correct and nothing has been concealed therefrom. I am also aware of the fact that in case this information is found false/inconect, the authorities are at liberty to initiate recovery of amount/interest/penalty/fine as providod in Punjab Municipal Act 1911 or Punjab Municipal Corporation Act 1976.",
                    labelKey: "ES_DECLARATION_SUMMARY_VALUE"
                  },
                  style: { margin: "10px" },
                  jsonPath: "temp[0].declaration"
                },
                type: "array"
              }
            },
            visible: false
          } ,
          footer: applyFooter
        }
      }
    }
}

const commonApply = {
    uiFramework: "material-ui",
    name: "_apply",
    hasBeforeInitAsync: true,
    beforeInitScreen: async (action, state, dispatch) => {
        dispatch(toggleSpinner())
        // await getPropertyData(action, state, dispatch)
        const components = await getData(action, state, dispatch)
        dispatch(toggleSpinner())
        setTimeout(() => updateReadOnlyForAllFields(action, state, dispatch), 100)
        return {
          "type": "INIT_SCREEN",
          "screenKey": "_apply",
          "screenConfig": {
            "uiFramework": "material-ui",
            "name": "_apply",
            components
          }
        }
    }
}

export default commonApply;