import {
  getCommonCard
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import { prepareFinalObject,handleScreenConfigurationFieldChange as handleField, toggleSpinner } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getSearchResults } from "../../../../ui-utils/commons";
import { getCourtCaseDetails } from "./preview-resource/courtCase-details";
import {onTabChange, headerrow, tabs, tabsAllotment} from './search-preview';
import {
  BUILDING_BRANCH_TABS as tabsBB,
  MANIMAJRA_BRANCH_TABS as tabsMM
} from "../../../../ui-constants";
import get from "lodash/get";

let isPropertyMasterOrAllotmentOfSite;
let branchTabs = tabs;
let activeIndex = 9;

const courtCaseContainer = {
  uiFramework: "custom-atoms",
componentPath: "Div",
props: {
  id: "docs"
},
children: {
}
}

const getData = async (action, state, dispatch, fileNumber) => {
  dispatch(prepareFinalObject("workflow.ProcessInstances", []))
  if (fileNumber){
      // await searchResults(action, state, dispatch, fileNumber)
      let queryObject = [
        { key: "fileNumber", value: fileNumber },
        {key: "relations", value: "court"}
      ];
      let payload = await getSearchResults(queryObject);
      if(!!payload) {
        let properties = payload.Properties;
        let branchType = properties[0].propertyDetails.branchType;
        isPropertyMasterOrAllotmentOfSite = properties[0].propertyMasterOrAllotmentOfSite;
        dispatch(prepareFinalObject("Properties", properties));

        switch(branchType) {
          case "ESTATE_BRANCH":
            branchTabs = (isPropertyMasterOrAllotmentOfSite == "PROPERTY_MASTER") ? tabs : tabsAllotment;
            activeIndex = (isPropertyMasterOrAllotmentOfSite == "PROPERTY_MASTER") ? 9 : 6;
            break;
          case "BUILDING_BRANCH":
            branchTabs = tabsBB;
            break;
          case "MANI_MAJRA":
            branchTabs = tabsMM;
            activeIndex = 6;
            break;
        }

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
                    tabs: branchTabs,
                    activeIndex: activeIndex,
                    onTabChange
                  },
                  type: "array",
                },
                courtCaseContainer
            }
          }
        }
      }
  }
  
}

const updateAllFields = (action, state, dispatch) => {
  const properties = get(state, "screenConfiguration.preparedFinalObject.Properties");
  isPropertyMasterOrAllotmentOfSite = properties[0].propertyMasterOrAllotmentOfSite;
  let containers={}
  if(properties[0].propertyDetails.courtCases){
    properties[0].propertyDetails.courtCases.forEach((element,index) => { 
      let courtCaseDetails = getCourtCaseDetails(false,index);
      containers[index] = getCommonCard({
        courtCaseDetails
      });  
    });
  }
  dispatch(
    handleField(
    "court-case",
    "components.div.children.courtCaseContainer",
    "children",
    containers
    )
  );
}

const commonCourtCase = {
  uiFramework: "material-ui",
  name: "court-case",
  hasBeforeInitAsync: true,
  beforeInitScreen: async (action, state, dispatch) => {
      const fileNumber = getQueryArg(window.location.href, "fileNumber");
      dispatch(toggleSpinner())
      const components = await getData(action, state, dispatch, fileNumber)
      dispatch(toggleSpinner())
      setTimeout(() => updateAllFields(action, state, dispatch), 100)
      return {
        "type": "INIT_SCREEN",
        "screenKey": "court-case",
        "screenConfig": {
          "uiFramework": "material-ui",
          "name": "court-case",
          components
        }
      }
  }
}

export default commonCourtCase;