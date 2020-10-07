import {
  getCommonCard,
  getBreak
} from "egov-ui-framework/ui-config/screens/specs/utils";
import {
  getQueryArg
} from "egov-ui-framework/ui-utils/commons";
import {
  prepareFinalObject,
  handleScreenConfigurationFieldChange as handleField
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import {
  getSearchResults,
  getAuctionDetails,
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
  tabs
} from './search-preview';
import {
  auctionTable
} from './applyResource/auction-details';
import {
  getTextToLocalMapping
} from '../utils'

const searchResults = async (action, state, dispatch, fileNumber) => {
  let queryObject = [{
      key: "fileNumber",
      value: fileNumber
    }
  ];
  let payload = await getSearchResults(queryObject);
  if (payload) {
    let properties = payload.Properties;
    dispatch(prepareFinalObject("Properties", properties));
  }

  let reqBody = {
    AuctionSearchCritirea: {
      "fileNumber": fileNumber
    }
  };
  let auctionPayload = await getAuctionDetails(reqBody);
  if (!!auctionPayload) {
    dispatch(
      handleField(
        "auction-details",
        "components.div.children.auctionTableContainer",
        "visible",
        true
      )
    );
    let auctionPayload = {
      "ResponseInfo": {
      "apiId": "Rainmaker",
      "ver": ".01",
      "ts": null,
      "resMsgId": "uief87324",
      "msgId": "20170310130900|en_IN",
      "status": "successful"
      },
      "Auctions": [
      {
      "id": "3e6aaff5-02d8-47c2-9d16-bcadd7b9cb8c",
      "propertyId": "1",
      "tenantId": "Hello",
      "fileNumber": "File-1237",
      "auctionDescription": "Can be ignored ",
      "participatedBidders": "a",
      "depositedEMDAmount": 10000.0,
      "depositDate": 1599264000000,
      "emdValidityDate": null,
      "refundStatus": "",
      "auditDetails": {
      "createdBy": "2743bf22-6499-4029-bd26-79e5d0ce6427",
      "lastModifiedBy": "2743bf22-6499-4029-bd26-79e5d0ce6427",
      "createdTime": 1601298961101,
      "lastModifiedTime": 1601298961101
      }
      },
      {
      "id": "752890a0-3cce-4f3a-84aa-cb6f6ce3c2e7",
      "propertyId": "1",
      "tenantId": "Hello",
      "fileNumber": "File-1237",
      "auctionDescription": "",
      "participatedBidders": "b",
      "depositedEMDAmount": 10000.0,
      "depositDate": 1599264000000,
      "emdValidityDate": null,
      "refundStatus": "",
      "auditDetails": {
      "createdBy": "2743bf22-6499-4029-bd26-79e5d0ce6427",
      "lastModifiedBy": "2743bf22-6499-4029-bd26-79e5d0ce6427",
      "createdTime": 1601298961101,
      "lastModifiedTime": 1601298961101
      }
      },
      {
      "id": "3795ba93-28de-400d-b347-9a55061c405a",
      "propertyId": "1",
      "tenantId": "Hello",
      "fileNumber": "File-1237",
      "auctionDescription": "",
      "participatedBidders": "c",
      "depositedEMDAmount": 10000.0,
      "depositDate": 1599264000000,
      "emdValidityDate": null,
      "refundStatus": "",
      "auditDetails": {
      "createdBy": "2743bf22-6499-4029-bd26-79e5d0ce6427",
      "lastModifiedBy": "2743bf22-6499-4029-bd26-79e5d0ce6427",
      "createdTime": 1601298961101,
      "lastModifiedTime": 1601298961101
      }
      },
      {
      "id": "ef512c07-b1b0-4b07-a6d2-bd5dd8622aa8",
      "propertyId": "1",
      "tenantId": "Hello",
      "fileNumber": "File-1237",
      "auctionDescription": "",
      "participatedBidders": "d",
      "depositedEMDAmount": 10000.0,
      "depositDate": 1599264000000,
      "emdValidityDate": null,
      "refundStatus": "",
      "auditDetails": {
      "createdBy": "2743bf22-6499-4029-bd26-79e5d0ce6427",
      "lastModifiedBy": "2743bf22-6499-4029-bd26-79e5d0ce6427",
      "createdTime": 1601298961101,
      "lastModifiedTime": 1601298961101
      }
      }
      ]
      }
    let { Auctions } = auctionPayload;
    populateBiddersTable(Auctions, "auction-details", "components.div.children.auctionTableContainer")
  }
}

const beforeInitFn = async (action, state, dispatch, fileNumber) => {
  dispatch(prepareFinalObject("workflow.ProcessInstances", []))
  if(fileNumber){
      await searchResults(action, state, dispatch, fileNumber);

      const auctionTableColumns = [
        getTextToLocalMapping("File Number"),
        getTextToLocalMapping("Participated Bidders"),
        getTextToLocalMapping("Deposited EMD Amount"),
        getTextToLocalMapping("Deposit Date"),
        getTextToLocalMapping("EMD Validity Date"),
        {
          name: getTextToLocalMapping("Mark as Refunded"),
          options: { 
            display: true,
            viewColumns: true
          }
        }
      ]

      dispatch(
        handleField(
          "auction-details",
          "components.div.children.auctionTableContainer",
          "props.columns",
          auctionTableColumns
        )
      )
  }
}

let auctionDetailsCont = getReviewAuction(false);
const auctionDetailsContainer = getCommonCard({
  auctionDetailsCont
})

const auctionTableContainer = auctionTable;

const auctionDetails = {
  uiFramework: "material-ui",
  name: "auction-details",
  beforeInitScreen: (action, state, dispatch) => {
    let fileNumber = getQueryArg(window.location.href, "filenumber");
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
};

export default auctionDetails;