//import { getSearchResults } from "../../../../../ui-utils/commons";
import { prepareFinalObject, toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";
//import { getGridData1,getCategory1,getYear1,getMonth1,getrepotforproccessingTime1,getSectordata1,getSubCategory1,getUpdatePriceBook1,getMasterGridData1,getGridDataSellMeat1,getGridDataRoadcut1,getGridDataAdvertisement1} from "../../../../../ui-utils/commons";
import { convertEpochToDate, convertDateToEpoch, fetchRoleCode, truncData, getSiNameDetails } from "../../utils/index";
import { handleScreenConfigurationFieldChange as handleField } from "egov-ui-framework/ui-redux/screen-configuration/actions";

import { validateFields, getMdmsEncroachmentSectorData } from "../../utils";
import get from "lodash/get";
import set from "lodash/set";
import { fetchMasterChallanData, fetchViewSeizureData, fetchPaymentDetailsData, fetchStoreItemHODMasterChallanData, fetchSearchMasterChallanData } from "../../../../../ui-utils/commons";
import { getTenantId, getUserInfo } from "egov-ui-kit/utils/localStorageUtils";
import { getTodaysDateInYMD } from "egov-ui-framework/ui-config/screens/specs/utils";

export const searchResultApiResponse = async (state, dispatch) => {

  let Todate = get(
    state.screenConfiguration.preparedFinalObject,
    "searchCriteriaManageChallan[0].ToDate", '')

  let fromdate = get(
    state.screenConfiguration.preparedFinalObject,
    "searchCriteriaManageChallan[0].FromDate", '')

  let storeItemDateprocess = getTodaysDateInYMD();

  let encroachmentType = get(
    state.screenConfiguration.preparedFinalObject,
    "searchCriteriaManageChallan[0].EncroachmentType", ''
  ) === '0' ? '' : get(
    state.screenConfiguration.preparedFinalObject,
    "searchCriteriaManageChallan[0].EncroachmentType", ''
  ).trim();

  let sector = get(
    state.screenConfiguration.preparedFinalObject,
    "searchCriteriaManageChallan[0].sector", ''
  ) === '0' ? '' : get(
    state.screenConfiguration.preparedFinalObject,
    "searchCriteriaManageChallan[0].sector", ''
  ).trim();

  let siName = get(
    state.screenConfiguration.preparedFinalObject,
    "searchCriteriaManageChallan[0].SIName", ''
  ) === '0' ? '' : get(
    state.screenConfiguration.preparedFinalObject,
    "searchCriteriaManageChallan[0].SIName", ''
  ).trim();

  let challanStatus = get(
    state.screenConfiguration.preparedFinalObject,
    "searchCriteriaManageChallan[0].Status", ''
  ) === '0' ? '' : get(
    state.screenConfiguration.preparedFinalObject,
    "searchCriteriaManageChallan[0].Status", ''
  ).trim();

  if ((fromdate === undefined || fromdate === '')) {
    dispatch(
      toggleSnackbar(
        true,
        { labelName: "Please fill Date", labelKey: "EC_ERR_FILL_DATE" },
        "warning"
      )
    );
  } else if ((Todate === undefined || Todate === '')) {
    dispatch(
      toggleSnackbar(
        true,
        { labelName: "Please fill Date", labelKey: "EC_ERR_FILL_DATE" },
        "warning"
      )
    );
  }
  else if (fromdate > Todate) {
    dispatch(
      toggleSnackbar(
        true,
        { labelName: "Start Date should be less than End date", labelKey: "EC_ERR_FILL_FROM_DATE_LESS_THAN_TODATE" }, "warning"
      )
    );
  }
  else if (Todate > storeItemDateprocess) {
    dispatch(
      toggleSnackbar(
        true,
        { labelName: "End Date should be less than Today Date", labelKey: "EC_ERR_FILL_TODATE_GREATER_DATE" },
        "warning"
      )
    );
  }
  else {
    let requestBody = {
      "tenantId": getTenantId(),
      "fromDate": fromdate,
      "toDate": Todate,
      "encroachmentType": encroachmentType,
      "sector": sector,
      "siName": siName,
      "status": challanStatus
    }
    try {
      let response;
      response = await fetchSearchMasterChallanData(requestBody);

      if (response) {
        let dataarray = [];
        let sectorValue = get(state, 'screenConfiguration.preparedFinalObject.applyScreenMdmsData.egec.sector', []);
        let encroachValue = get(state, 'screenConfiguration.preparedFinalObject.applyScreenMdmsData.egec.EncroachmentType', []);

        response.ResponseBody.map(function (item, index) {
          // alert(item)
          let temp = [];

          let __FOUND = sectorValue.find(function (sectorRecord, index) {
            if (sectorRecord.code == item['sector'])
              return true;
          });
          let __FOUNDENCROACH = encroachValue.find(function (encroachRecord, index) {
            if (encroachRecord.code == item['encroachmentType'])
              return true;
          });

          let paymentStatus = item.paymentDetails.paymentStatus === 'PENDING' ? 'UNPAID' : 'PAID';
          temp[0] = item['challanId'];
          temp[1] = __FOUNDENCROACH.name;
          temp[2] = convertEpochToDate(item['violationDate']);
          temp[3] = truncData(item['violatorName'], 25);
          temp[4] = __FOUND.name;
          temp[5] = item['contactNumber'];
          temp[6] = item['siName'];
          temp[7] = item['status'];
          temp[8] = item['tenantId'];
          temp[9] = item['challanUuid'];
          temp[10] = paymentStatus
          dataarray.push(temp);
        });


        dispatch(prepareFinalObject('eChallanMasterGrid', dataarray));
        localStorage.setItem('eChallanMasterGrid', JSON.stringify(dataarray));

        dispatch(
          handleField(
            "echallan-landing",
            "components.div.children.serachResultGrid",
            "props.data",
            dataarray
          )
        );
        showHideTable(true, dispatch);
      }
    } catch (error) {
      console.log(error);
    }
  }
};

export const searchResultCitizenApiResponse = async (action, state, dispatch) => {
  let userInfo = JSON.parse(getUserInfo());
  let requestBody = {
    "tenantId": getTenantId(),
    "action": "",
    "offset": -1,
    "limit": -1,
    "orderDir": "DESC",
    "orderColumn": "violationDate",
    "searchText": get(userInfo, "mobileNumber")
  }
    await getMdmsEncroachmentSectorData(action, state, dispatch);

  const response = await fetchMasterChallanData(requestBody)

  console.log("res", response)
  try {

    if (response) {

      let sectorValue = get(state, 'screenConfiguration.preparedFinalObject.applyScreenMdmsData.egec.sector', []);
      let encroachValue = get(state, 'screenConfiguration.preparedFinalObject.applyScreenMdmsData.egec.EncroachmentType', []);
      dispatch(prepareFinalObject("searchResults", response.ResponseBody));
      dispatch(
        prepareFinalObject("myApplicationsCount", response.ResponseBody.length)
      ); 
      response.ResponseBody.map(function (item, index) {
       
        let __FOUND = sectorValue.find(function (sectorRecord, index) {
          if (sectorRecord.code == item['sector'])
            return true;
        });
        item.sector = __FOUND.name;
        set(state, 'screenConfiguration.preparedFinalObject.searchResults.sector', __FOUND.name);

        let __FOUNDENCROACH = encroachValue.find(function (encroachRecord, index) {
          if (encroachRecord.code == item['encroachmentType'])
            return true;
        });
        item.encroachmentType = __FOUNDENCROACH.name;
        set(state, 'screenConfiguration.preparedFinalObject.searchResults.encroachmentType', __FOUNDENCROACH.name);

      })
      
     
      showHideTable(true, dispatch);
    }
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

