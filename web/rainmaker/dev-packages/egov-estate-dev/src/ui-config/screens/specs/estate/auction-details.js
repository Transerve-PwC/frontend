import {
  getCommonCard,
  getBreak
} from "egov-ui-framework/ui-config/screens/specs/utils";
import {
  getQueryArg
} from "egov-ui-framework/ui-utils/commons";
import {
  prepareFinalObject,
  handleScreenConfigurationFieldChange as handleField,
  toggleSpinner
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import {
  getSearchResults,
  populateBiddersTable
} from "../../../../ui-utils/commons";
import {
  getReviewAuction
} from "./preview-resource/preview-properties";
import {
  getUserInfo,
  getTenantId
} from "egov-ui-kit/utils/localStorageUtils";
import {
  onTabChange,
  headerrow,
  tabs,
  tabsAllotment
} from './search-preview';
import {
  auctionTable
} from './applyResource/auction-details';
import {
  getTextToLocalMapping
} from '../utils';
import get from "lodash/get";

let isPropertyMasterOrAllotmentOfSite;

const searchResults = async (action, state, dispatch, fileNumber) => {
  let queryObject = [
    { key: "fileNumber", value: fileNumber },
    {key: "relations", value: "bidder"}
  ];
  let payload = await getSearchResults(queryObject);
  if (payload) {
    let properties = payload.Properties;
    isPropertyMasterOrAllotmentOfSite = properties[0].propertyMasterOrAllotmentOfSite;
    dispatch(prepareFinalObject("Properties", properties));
    if (properties[0].propertyDetails.bidders) {
      dispatch(
        handleField(
          "auction-details",
          "components.div.children.auctionTableContainer",
          "visible",
          true
        )
      );
      let { bidders } = properties[0].propertyDetails;
      populateBiddersTable(bidders, "auction-details", "components.div.children.auctionTableContainer")
    }

    dispatch(
      handleField(
        action.screenKey,
        "components.div.children.tabSection",
        "props.tabs",
        (isPropertyMasterOrAllotmentOfSite == "PROPERTY_MASTER") ? tabs : tabsAllotment
      )
    )
  }
}

const getData = async (action, state, dispatch, fileNumber) => {
  dispatch(prepareFinalObject("workflow.ProcessInstances", []))
  if(fileNumber){
      // await searchResults(action, state, dispatch, fileNumber);
    let queryObject = [
      { key: "fileNumber", value: fileNumber },
      {key: "relations", value: "bidder"}
    ];
    let payload = await getSearchResults(queryObject);
    if (payload) {
      let properties = payload.Properties;
      isPropertyMasterOrAllotmentOfSite = properties[0].propertyMasterOrAllotmentOfSite;
      dispatch(prepareFinalObject("Properties", properties));

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
                tabs: tabs,
                activeIndex: 1,
                onTabChange
              },
              type: "array",
            },
            auctionDetailsContainer,
            breakAfterSearch: getBreak(),
            auctionTableContainer
          }
        }
      }
    }
  }
}

let auctionDetailsCont = getReviewAuction(false);
const auctionDetailsContainer = getCommonCard({
  auctionDetailsCont
})

const auctionTableContainer = auctionTable;

const updateAllFields = (action, state, dispatch) => {
  const properties = get(state, "screenConfiguration.preparedFinalObject.Properties");

  if (properties[0].propertyDetails.bidders) {
    dispatch(
      handleField(
        "auction-details",
        "components.div.children.auctionTableContainer",
        "visible",
        true
      )
    );
    let { bidders } = properties[0].propertyDetails;
    populateBiddersTable(bidders, "auction-details", "components.div.children.auctionTableContainer")
  }

  dispatch(
    handleField(
      action.screenKey,
      "components.div.children.tabSection",
      "props.tabs",
      (isPropertyMasterOrAllotmentOfSite == "PROPERTY_MASTER") ? tabs : tabsAllotment
    )
  )
}

const commonAuctionDetails = {
  uiFramework: "material-ui",
  name: "auction-details",
  hasBeforeInitAsync: true,
  beforeInitScreen: async (action, state, dispatch) => {
      const fileNumber = getQueryArg(window.location.href, "fileNumber");
      dispatch(toggleSpinner())
      const components = await getData(action, state, dispatch, fileNumber)
      dispatch(toggleSpinner())
      setTimeout(() => updateAllFields(action, state, dispatch), 100)
      return {
        "type": "INIT_SCREEN",
        "screenKey": "auction-details",
        "screenConfig": {
          "uiFramework": "material-ui",
          "name": "auction-details",
          components
        }
      }
  }
}

export default commonAuctionDetails;