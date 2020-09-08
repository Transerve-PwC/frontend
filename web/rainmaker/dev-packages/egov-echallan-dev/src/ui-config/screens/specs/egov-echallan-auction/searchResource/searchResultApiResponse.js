import { prepareFinalObject, toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { convertEpochToDate, convertDateToEpoch, checkForRole, getMdmsEncroachmentSectorData, truncData } from "../../utils/index";
import { handleScreenConfigurationFieldChange as handleField } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getTenantId, getUserInfo } from "egov-ui-kit/utils/localStorageUtils";
import { fetchMasterChallanData, fetchMasterChallanHODAuction, fetchViewHistorytData } from "../../../../../ui-utils/commons";
import get from "lodash/get";

export const searchResultApiResponse = async (action, state, dispatch) => {
  let requestBody = {
    "tenantId": getTenantId(),
    "action": "auctionChallan",
    "offset": 1,
    "limit": -1,
    "orderDir": "DESC",
    "orderColumn": "violation_date",
    "searchText": ""
  }
  let roles = JSON.parse(getUserInfo()).roles;
  let response = [];
  let auctionResponse = [];
  await getMdmsEncroachmentSectorData(action, state, dispatch,true);

  let sectorValue = get(state, 'screenConfiguration.preparedFinalObject.applyScreenMdmsData.egec.sector', []);
  let encroachValue = get(state, 'screenConfiguration.preparedFinalObject.applyScreenMdmsData.egec.EncroachmentType', []);

  checkForRole(roles, 'challanHOD') ? response = await fetchMasterChallanHODAuction(requestBody) : '';
  checkForRole(roles, 'challanSM') ? auctionResponse = await fetchMasterChallanData(requestBody) : '';
  //}

  let dataarray = [];

  try {
    if (response.ResponseBody !== undefined) {
      response.ResponseBody.map(function (item, index) {

        let __FOUND = sectorValue.find(function (sectorRecord, index) {
          if (sectorRecord.code == item['sector'])
            return true;
        });

        let __FOUNDENCROACH = encroachValue.find(function (encroachRecord, index) {
          if (encroachRecord.code == item['encroachmentType'])
            return true;
        });    
 
        let temp = [];
        temp[0] = item['challanId'];
        temp[1] = __FOUNDENCROACH.name;
        temp[2] = convertEpochToDate(item['violationDate']);
        temp[3] = truncData(item['violatorName'],25);
        temp[4] = __FOUND.name;
        temp[5] = item['contactNumber'];
        temp[6] = item['siName'];
        temp[7] = item['status'] === 'PENDING' ? 'PENDING FOR APPROVAL' : item['status'];
        temp[8] = item['tenantId'];
        temp[9] = item['challanUuid'];
        temp[10] = item['auctionUuid'] === undefined ? '' : item['auctionUuid'];
        dataarray.push(temp);
      });

    }
    if (auctionResponse.ResponseBody !== undefined) {

      auctionResponse.ResponseBody.map(function (item, index) {
        // alert(item)
        let __FOUND = sectorValue.find(function (sectorRecord, index) {
          if (sectorRecord.code == item['sector'])
            return true;
        });
        let __FOUNDENCROACH = encroachValue.find(function (encroachRecord, index) {
          if (encroachRecord.code == item['encroachmentType'])
            return true;
        });    

        let temp = [];
        temp[0] = item['challanId'];
        temp[1] = __FOUNDENCROACH.name;
        temp[2] = convertEpochToDate(item['violationDate']);
        temp[3] = truncData(item['violatorName'],25);
        temp[4] = __FOUND.name;
        temp[5] = item['contactNumber'];
        temp[6] = item['siName'];
        temp[7] = item['status'];
        temp[8] = item['tenantId'];
        temp[9] = item['challanUuid'];
        temp[10] = item['auctionUuid'] === undefined ? '' : item['auctionUuid'];
        dataarray.push(temp);
      });
    }
    dispatch(prepareFinalObject('eAuctionMasterGrid', dataarray));
    localStorage.setItem('eAuctionMasterGrid', JSON.stringify(dataarray));

    dispatch(
      handleField(
        "home",
        "components.div.children.serachResultGrid",
        "props.data",
        dataarray
      )
    );
    showHideTable(true, dispatch);
  } catch (error) {
    console.log(error);
  }
};

const showHideTable = (booleanHideOrShow, dispatch) => {
  dispatch(
    handleField(
      "search",
      "components.div.children.serachResultGrid",
      "visible",
      booleanHideOrShow
    )
  );
};

export const searchResultApiResponseViewHistory = async (dispatch, challanUuid, tenantId) => {

  let requestBody = {
    "tenantId": tenantId,
    "challanUuid": challanUuid
  }

  try {
    let dataarray = [];
    const response = await fetchViewHistorytData(requestBody)
    let datastorage = response.ResponseBody;
    datastorage.map(function (item, index) {
      let temp = [];
      temp[0] = item['itemName'];
      temp[1] = truncData(item['purchaserName'],25);
      temp[2] = convertEpochToDate(item['auctionDate']);
      temp[3] = item['auctionQuantity'];
      temp[4] = item['purchaserContactNo'];
      temp[5] = item['auctionAmount'];
      temp[6] = item['status'];
      dataarray.push(temp);
    });

    dispatch(prepareFinalObject('eAuctionGridHistoryDetails', dataarray));

    dispatch(
      handleField(
        "search-preview", "components.adhocDialog.children.popup.children.GridDetails.children.AuctionGridHistoryDetails",
        "props.data", dataarray)
    );
    //showHideViewDetailsTable(true, dispatch);
  } catch (error) {
    dispatch(
      toggleSnackbar(
        true,
        { labelName: error.message, labelKey: error.message },
        "error"
      )
    );
    console.log(error);
  }
};

const showHideViewDetailsTable = (booleanHideOrShow, dispatch) => {
  dispatch(
    handleField(
      "search-preview",
      "components.adhocDialog.children.AuctionGridHistoryDetails",
      "visible",
      booleanHideOrShow
    )
  );
};