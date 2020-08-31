import { AuctionDetails } from "./applyResource/auctionDetails";
import { AuctionGridDetails } from "./applyResource/auctionGridDetails"
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import {
  getCommonCard,
  getCommonContainer,
  getCommonHeader,
  getLabelWithValue,
  getTodaysDateInYMD
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { footer } from "./applyResource/footer";
import set from "lodash/set";
import get from "lodash/get";
import {
  prepareFinalObject,
  handleScreenConfigurationFieldChange as handleField
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getTenantId, getUserInfo } from "egov-ui-kit/utils/localStorageUtils";
import { getSearchResultsView, fetchStoreItemHODMasterChallanData } from "../../../../ui-utils/commons";
const header = getCommonContainer({
  header: getCommonHeader({
    labelName: "Auction Details",
    labelKey: "EC_AUCTION_DETAILS"
  })
});

const prepareItemSeizedDetails = async (state, dispatch) => {
  // Get all documents from response
  let SeizedItemDetailList = get(
    state,
    "screenConfiguration.preparedFinalObject.eChallanDetail[0].violationItem",
    {}
  );

  let appstatus = get(state, "screenConfiguration.preparedFinalObject.eChallanDetail[0].status", '');

  const challanUuid = getQueryArg(window.location.href, "Key");
  let dataarray = [];
  let SeizedItemlistforAuction = [];
  let SeizedItemMergedlist = [];
  let showstoredDetails = false;
  if (appstatus === 'PENDING FOR AUCTION') {
    showstoredDetails = true;
  }

  if (showstoredDetails) {
    let requestBody = {
      "tenantId": getTenantId(),
      "action": "",
      "offset": 1,
      "limit": -1,
      "orderDir": "DESC",
      "orderColumn": "",
      "searchText": challanUuid
    }
    let response = await fetchStoreItemHODMasterChallanData(requestBody);


    for (let storedItemIndex = 0; storedItemIndex < response.length; storedItemIndex++) {
      const item = response[storedItemIndex];
      for (let seizedItemList = 0; seizedItemList < SeizedItemDetailList.length; seizedItemList++) {
        const element = SeizedItemDetailList[seizedItemList];
        let temp = [];
      
        if (item['violationItemUuid'] === element['violationItemUuid']) {
          let defectqty = parseInt(element['quantity']) - parseInt(item['auctionedQuantity']);

          temp[0] = item['itemName'];
          temp[1] = element['quantity'];
          temp[2] = item['remark'];
          temp[3] = item['quantity'];
          temp[4] = defectqty;
          temp[5] = item['remark'];
          temp[6] = item['isVerified'];
          temp[7] = item['isAuctioned'];
          temp[8] = item['isReturned'];
          temp[9] = item['violationItemUuid'];
          temp[10] = item['violationUuid'];

          dataarray.push(temp);
          let tempAuctionList = {
            code: item['itemName']+"~"+item['violationItemUuid'],
            name: item['itemName']
          }
          SeizedItemlistforAuction.push(tempAuctionList);
          let auctionedqty = item['auctionedQuantity'] === null ? 0 : item['auctionedQuantity'];
          let meregedList = {
            itemName: item['itemName'],
            actualQuantity: parseInt(item['quantity']) - parseInt(auctionedqty),
            itemStoreUuid: item['storeItemUuid'],
            violationItemUuid: item['violationItemUuid'],
            violationUuid: item['violationUuid'],
          }
          SeizedItemMergedlist.push(meregedList);
        }
      }
    }

  } else {

    // SeizedItemDetailList.map(function (item, index) {
    //   let temp = [];
    //   temp[0] = item['itemName'];
    //   temp[1] = item['quantity'];
    //   temp[2] = item['remark'];
    //   temp[3] = '';
    //   temp[4] = '';
    //   temp[5] = '';
    //   temp[6] = item['violationItemUuid'];
    //   temp[7] = item['violationUuid'];
    //   dataarray.push(temp);
    // });
  }
  dispatch(prepareFinalObject('eChallanSMSeizedList', dataarray));
  dispatch(prepareFinalObject('applyScreenMdmsData.egec.seizedItemList', SeizedItemlistforAuction));
  dispatch(prepareFinalObject('applyScreenMdmsData.egec.mergedList', SeizedItemMergedlist));
}

const setSearchResponse = async (
  state,
  dispatch,
  applicationNumber,
  tenantId,
  action
) => {

  let RequestBody = {
    searchtext: applicationNumber,
    tenantId: tenantId,
    action: '',
  }
  const response = await getSearchResultsView(RequestBody);
  //
  dispatch(prepareFinalObject("eChallanDetail", get(response, "ResponseBody", [])));

  prepareItemSeizedDetails(state, dispatch);

};

const screenConfig = {
  uiFramework: "material-ui",
  name: "apply",
  beforeInitScreen: (action, state, dispatch) => {
    const applicationNumber = getQueryArg(window.location.href, "applicationNumber");
    const tenantId = getQueryArg(window.location.href, "tenantId");
    setSearchResponse(state, dispatch, applicationNumber, tenantId, action);
    
    dispatch(prepareFinalObject("auctionDetails.isSubmitted", false));
    
    dispatch(prepareFinalObject("auctionDetails.auctionDate", getTodaysDateInYMD()));
    dispatch(prepareFinalObject("auctionDetails.challanNumber", applicationNumber));
    return action;
  },
  components: {
    div: {
      uiFramework: "custom-atoms",
      componentPath: "Div",
      props: {
        className: "common-div-css",
        id: "AuctionGridDetails"
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
        AuctionDetails,
        AuctionGridDetails,
        footer: footer,
      }
    }
  }
};

export default screenConfig;
