import {
    getCommonHeader,
    getCommonContainer,
    getLabel,
    getCommonCard
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { getQueryArg, setDocuments } from "egov-ui-framework/ui-utils/commons";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getSearchResults } from "../../../../ui-utils/commons";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import { getReviewAuction, getPropertyDetails,getAllotmentDetails,getAdditionalDetails } from "./preview-resource/preview-properties";
import { getUserInfo ,getTenantId} from "egov-ui-kit/utils/localStorageUtils";
import { WF_PROPERTY_MASTER } from "../../../../ui-constants";

const userInfo = JSON.parse(getUserInfo());
const {roles = []} = userInfo
const findItem = roles.find(item => item.code === "CTL_CLERK");

let fileNumber = getQueryArg(window.location.href, "fileNumber");
let tenantId = getTenantId()

export const headerrow = getCommonContainer({
  header: getCommonHeader({
    labelName: "Estate",
    labelKey: "ESTATE_COMMON_ESTATE"
  })
});
const reviewAuctionDetails = getReviewAuction(false);
const reviewPropertyDetails = getPropertyDetails(false);
const reviewAllotmentDetails = getAllotmentDetails(false);
const additionalDetails = getAdditionalDetails(false)


export const propertyReviewDetails = getCommonCard({
  reviewPropertyDetails,
  reviewAuctionDetails,
  reviewAllotmentDetails,
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

export const onTabChange = async(tabIndex, dispatch, state) => {
  fileNumber = getQueryArg(window.location.href, "filenumber");
  let path = ""
  switch(tabIndex){
      case 0:
        path = `/estate/search-preview?filenumber=${fileNumber}&tenantId=${tenantId}`
        break
      case 1:
        path = `/estate/owner-details?filenumber=${fileNumber}&tenantId=${tenantId}`
        break
      case 2:
        path = `/estate/purchaser-details?filenumber=${fileNumber}&tenantId=${tenantId}`
        break
      case 3:
        path = `/estate/payment-details?filenumber=${fileNumber}&tenantId=${tenantId}`
        break
      case 4:
        path = `/estate/document-details?filenumber=${fileNumber}&tenantId=${tenantId}`
        break
      case 5:
        path = `/estate/notices?filenumber=${fileNumber}&tenantId=${tenantId}`
        break
      case 6:
        path = `/estate/court-case?filenumber=${fileNumber}&tenantId=${tenantId}`
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
  },
  {
    tabButton: { labelName: "Purchaser Details", labelKey: "ESTATE_PURCHASER_DETAILS" },
  },
  {
    tabButton: { labelName: "Payment Details", labelKey: "ESTATE_PAYMENT_DETAILS" },
  },
  {
    tabButton: { labelName: "Documents", labelKey: "ESTATE_DOCUMENTS" },
  },
  {
    tabButton: { labelName: "Notices", labelKey: "ESTATE_NOTICES" },
  },
  {
    tabButton: { labelName: "Court Case", labelKey: "ESTATE_COURT_CASE" },
  }
]

const estateDetailPreview = {
  uiFramework: "material-ui",
  name: "court-case",
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
              activeIndex: 0,
              onTabChange
            },
            type: "array",
          },
          taskStatus: {
            uiFramework: "custom-containers-local",
            moduleName: "egov-estate",
            componentPath: "WorkFlowContainer",
            props: {
              dataPath: "Properties",
              moduleName: WF_PROPERTY_MASTER,
              updateUrl: "/est-services/property-master/_update",
              style: {
                wordBreak: "break-word"
              }
            }
          },
        propertyReviewDetails
      }
    }
  }
};

export default estateDetailPreview;