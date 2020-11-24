import {
    getCommonCard
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { getQueryArg, setDocuments } from "egov-ui-framework/ui-utils/commons";
import { 
  prepareFinalObject,
  handleScreenConfigurationFieldChange as handleField
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getSearchResults } from "../../../../ui-utils/commons";
import {onTabChange, headerrow, tabs, tabsAllotment} from './search-preview'

let fileNumber = getQueryArg(window.location.href, "fileNumber");
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
    isPropertyMasterOrAllotmentOfSite = properties[0].propertyMasterOrAllotmentOfSite;

    let applicationDocuments = properties[0].propertyDetails.applicationDocuments || [];
    const removedDocs = applicationDocuments.filter(item => !item.active)
    applicationDocuments = applicationDocuments.filter(item => !!item.active)
    properties = [{...properties[0], propertyDetails: {...properties[0].propertyDetails, applicationDocuments}}]
    dispatch(prepareFinalObject("Properties[0]", properties[0]));
    dispatch(
      handleField(
        action.screenKey,
        "components.div.children.tabSection",
        "props.tabs",
        (isPropertyMasterOrAllotmentOfSite == "PROPERTY_MASTER") ? tabs : tabsAllotment
      )
    )
    dispatch(
      handleField(
        action.screenKey,
        "components.div.children.tabSection",
        "props.activeIndex",
        (isPropertyMasterOrAllotmentOfSite == "PROPERTY_MASTER") ? 8 : 5,
      )
    )
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
}

const beforeInitFn = async (action, state, dispatch, fileNumber) => {
  dispatch(prepareFinalObject("workflow.ProcessInstances", []))
  if(fileNumber){
    await searchResults(action, state, dispatch, fileNumber)
  }
}


const EstateNotices = {
  uiFramework: "material-ui",
  name: "notices",
  beforeInitScreen: (action, state, dispatch) => {
    fileNumber = getQueryArg(window.location.href, "fileNumber");
    beforeInitFn(action, state, dispatch, fileNumber);
    return action;
  },
  components: {
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
          // taskStatus: {
          //   uiFramework: "custom-containers-local",
          //   moduleName: "egov-estate",
          //   componentPath: "WorkFlowContainer",
          //   props: {
          //     dataPath: "Properties",
          //     moduleName: "MasterRP",
          //     updateUrl: "/csp/property/_update"
          //   }
          // },
        noticesDetails
      }
    }
  }
};

export default EstateNotices;