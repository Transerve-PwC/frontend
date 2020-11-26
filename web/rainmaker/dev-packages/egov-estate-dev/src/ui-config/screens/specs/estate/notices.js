import {
    getCommonCard
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { getQueryArg, setDocuments } from "egov-ui-framework/ui-utils/commons";
import { 
  prepareFinalObject,
  handleScreenConfigurationFieldChange as handleField,
  toggleSpinner
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getSearchResults } from "../../../../ui-utils/commons";
import {onTabChange, headerrow, tabs, tabsAllotment} from './search-preview';
import get from "lodash/get";

let isPropertyMasterOrAllotmentOfSite;

export const noticesDetails = getCommonCard({

});

export const searchResults = async (action, state, dispatch, fileNumber) => {
  let queryObject = [
    { key: "fileNumber", value: fileNumber }
  ];
  let payload = await getSearchResults(queryObject);
  if(payload) {
    let properties = payload.Properties;
    
    // let applicationDocuments = properties[0].propertyDetails.applicationDocuments || [];
    // const removedDocs = applicationDocuments.filter(item => !item.active)
    // applicationDocuments = applicationDocuments.filter(item => !!item.active)
    // properties = [{...properties[0], propertyDetails: {...properties[0].propertyDetails, applicationDocuments}}]
    
    // dispatch(
    //   prepareFinalObject(
    //     "PropertiesTemp[0].removedDocs",
    //     removedDocs
    //   )
    // );
    // await setDocuments(
    //   payload,
    //   "Properties[0].propertyDetails.applicationDocuments",
    //   "PropertiesTemp[0].reviewDocData",
    //   dispatch,'RP'
    // );
  }
}

const getData = async (action, state, dispatch, fileNumber) => {
  dispatch(prepareFinalObject("workflow.ProcessInstances", []))
  if(fileNumber){
    // await searchResults(action, state, dispatch, fileNumber)
    let queryObject = [
      { key: "fileNumber", value: fileNumber }
    ];
    let payload = await getSearchResults(queryObject);
    if(!!payload) {
      let properties = payload.Properties;
      isPropertyMasterOrAllotmentOfSite = properties[0].propertyMasterOrAllotmentOfSite;
      
      let applicationDocuments = properties[0].propertyDetails.applicationDocuments || [];
      const removedDocs = applicationDocuments.filter(item => !item.active)
      applicationDocuments = applicationDocuments.filter(item => !!item.active)
      properties = [{...properties[0], propertyDetails: {...properties[0].propertyDetails, applicationDocuments}}]

      dispatch(prepareFinalObject("Properties[0]", properties[0]));

      return {
        div: {
          uiFramework: "custom-atoms",
          componentPath: "Div",
          props: {
            className: "common-div-css search-preview"
          },
          children: {
            headerDiv: {
              uiFramework: "custom-atoms",
              componentPath: "Container",
              children: {
                header1: {
                  gridDefination: {
                    xs: 12,
                    sm: 8
                  },
                 ...headerrow
                },
                }
              },
              tabSection: {
                uiFramework: "custom-containers-local",
                moduleName: "egov-estate",
                componentPath: "CustomTabContainer",
                props: {
                  tabs: (isPropertyMasterOrAllotmentOfSite == "PROPERTY_MASTER") ? tabs : tabsAllotment,
                  activeIndex: (isPropertyMasterOrAllotmentOfSite == "PROPERTY_MASTER") ? 8 : 5,
                  onTabChange
                },
                type: "array",
              },
            noticesDetails
          }
        }
      }
    }
  }
  
}

const updateAllFields = async(action, state, dispatch) => {
  const properties = get(state, "screenConfiguration.preparedFinalObject.Properties");
  isPropertyMasterOrAllotmentOfSite = properties[0].propertyMasterOrAllotmentOfSite;
  let payload = {};
  payload.Properties = properties;

  let applicationDocuments = properties[0].propertyDetails.applicationDocuments || [];
  const removedDocs = applicationDocuments.filter(item => !item.active)
  applicationDocuments = applicationDocuments.filter(item => !!item.active)

  dispatch(
    prepareFinalObject(
      "PropertiesTemp[0].removedDocs",
      removedDocs
    )
  );
  await setDocuments(
    payload,
    "Properties[0].propertyDetails.applicationDocuments",
    "PropertiesTemp[0].reviewDocData",
    dispatch,'RP'
  );
}

const commonNotices = {
  uiFramework: "material-ui",
  name: "notices",
  hasBeforeInitAsync: true,
  beforeInitScreen: async (action, state, dispatch) => {
      const fileNumber = getQueryArg(window.location.href, "fileNumber");
      dispatch(toggleSpinner())
      const components = await getData(action, state, dispatch, fileNumber)
      dispatch(toggleSpinner())
      setTimeout(() => updateAllFields(action, state, dispatch), 100)
      return {
        "type": "INIT_SCREEN",
        "screenKey": "notices",
        "screenConfig": {
          "uiFramework": "material-ui",
          "name": "notices",
          components
        }
      }
  }
}

export default commonNotices;