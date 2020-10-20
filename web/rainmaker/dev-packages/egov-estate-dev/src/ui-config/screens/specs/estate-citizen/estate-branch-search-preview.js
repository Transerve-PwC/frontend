import {
  getCommonHeader,
  getCommonContainer,
  getCommonCard
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getSearchResults } from "../../../../ui-utils/commons";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import { getReviewAuction, getPropertyDetails,getAdditionalDetails } from "../estate/preview-resource/preview-properties";

let fileNumber = getQueryArg(window.location.href, "fileNumber");

export const headerrow = getCommonContainer({
header: getCommonHeader({
  labelName: "Estate",
  labelKey: "ESTATE_COMMON_ESTATE"
})
});
const reviewAuctionDetails = getReviewAuction(false);
const reviewPropertyDetails = getPropertyDetails(false);
const additionalDetails = getAdditionalDetails(false)


export const propertyReviewDetails = getCommonCard({
reviewPropertyDetails,
reviewAuctionDetails,
additionalDetails
});

export const searchResults = async (action, state, dispatch, fileNumber) => {
let queryObject = [
  { key: "fileNumber", value: fileNumber }
];
let payload = await getSearchResults(queryObject);
if(payload) {
  let properties = payload.Properties;

  let applicationDocuments = properties[0].propertyDetails.applicationDocuments || [];
  const removedDocs = applicationDocuments.filter(item => !item.active)
  applicationDocuments = applicationDocuments.filter(item => !!item.active)
  properties = [{...properties[0], propertyDetails: {...properties[0].propertyDetails, applicationDocuments}}]
  dispatch(prepareFinalObject("Properties[0]", properties[0]));

}
}

const beforeInitFn = async (action, state, dispatch, fileNumber) => {
dispatch(prepareFinalObject("workflow.ProcessInstances", []))
if(fileNumber){
 
   await searchResults(action, state, dispatch, fileNumber)
}
}

export const onTabChange = async(tabIndex, dispatch, state) => {
fileNumber = getQueryArg(window.location.href, "fileNumber");
let path = ""
switch(tabIndex){
    case 0:
      path = `/estate-citizen/estate-branch-search-preview?fileNumber=${fileNumber}`
      break
    case 1:
      path = `/estate-citizen/estate-branch-owner-details?fileNumber=${fileNumber}`
      break
}
dispatch(setRoute(path))
}

export const tabs = [
{
  tabButton: { labelName: "Property Details", labelKey: "ESTATE_PROPERTY_DETAILS" },
},
{
  tabButton: { labelName: "Owner Details", labelKey: "ESTATE_OWNER_DETAILS" },
}
]

const EstateBranchPropertyDetails = {
uiFramework: "material-ui",
name: "estate-branch-search-preview",
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
            tabs,
            activeIndex: 0,
            onTabChange
          },
          type: "array",
        },
      propertyReviewDetails
    }
  }
}
};

export default EstateBranchPropertyDetails;