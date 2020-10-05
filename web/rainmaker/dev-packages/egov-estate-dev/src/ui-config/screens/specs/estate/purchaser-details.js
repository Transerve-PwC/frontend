import {
    getCommonCard
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import { prepareFinalObject,handleScreenConfigurationFieldChange as handleField  } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getSearchResults } from "../../../../ui-utils/commons";
import { getPurchaserDetails } from "./preview-resource/purchaser-details";
import {onTabChange, headerrow, tabs} from './search-preview'

let fileNumber = getQueryArg(window.location.href, "fileNumber");


// const purchaserDetails = getPurchaserDetails(false);


// export const propertyReviewDetails = getCommonCard({
//   purchaserDetails,
// });

const purchaserContainer = {
  uiFramework: "custom-atoms",
componentPath: "Container",
props: {
  id: "docs"
},
children: {
}
}

export const searchResults = async (action, state, dispatch, fileNumber) => {
  let queryObject = [
    { key: "fileNumber", value: fileNumber },
    {key: "relations", value: "purchase"}
  ];
  let payload = await getSearchResults(queryObject);
  if(payload) {
    let properties = payload.Properties;
    dispatch(prepareFinalObject("Properties", properties));
    
    let containers={}
    if(properties[0].propertyDetails.owners){
      properties[0].propertyDetails.owners.forEach((element,index) => { 
        if (!element.isCurrentOwner) {
          let purchaseDetailContainer = getPurchaserDetails(false,index);
          containers[index] = getCommonCard({purchaseDetailContainer})
        }
      });
    }
    
    dispatch(
      handleField(
      "purchaser-details",
      "components.div.children.purchaserContainer",
      "children",
      containers
      )
    );
  }
}

const beforeInitFn = async (action, state, dispatch, fileNumber) => {
  dispatch(prepareFinalObject("workflow.ProcessInstances", []))
  if(fileNumber){
      await searchResults(action, state, dispatch, fileNumber)
    }
}


const EstatePurchaserDetails = {
  uiFramework: "material-ui",
  name: "purchaser-details",
  beforeInitScreen: (action, state, dispatch) => {
    fileNumber = getQueryArg(window.location.href, "filenumber");
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
              tabs,
              activeIndex: 3,
              onTabChange
            },
            type: "array",
          },
          purchaserContainer
      }
    }
  }
};

export default EstatePurchaserDetails;