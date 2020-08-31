//import { getSearchResults } from "../../../../../ui-utils/commons";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
//import { getGridData1,getCategory1,getYear1,getMonth1,getrepotforproccessingTime1,getSectordata1,getSubCategory1,getUpdatePriceBook1,getMasterGridData1,getGridDataSellMeat1,getGridDataRoadcut1,getGridDataAdvertisement1} from "../../../../../ui-utils/commons";
import { convertEpochToDate, convertDateToEpoch, getMdmsEncroachmentSectorData } from "../../utils/index";
import { handleScreenConfigurationFieldChange as handleField } from "egov-ui-framework/ui-redux/screen-configuration/actions";

import { validateFields, getTextToLocalMappingItemMaster } from "../../utils";
import get from "lodash/get";
import set from "lodash/set";
import { getFineMasterGridData } from "../../../../../ui-utils/commons";
import { getUserInfo } from "egov-ui-kit/utils/localStorageUtils";

export const searchResultApiResponse = async (action, state, dispatch) => {
  const mdmsresponse =  await getMdmsEncroachmentSectorData(action,state,dispatch);
  const response = await getFineMasterGridData('');
  try {
    let encroachValue = get(state, 'screenConfiguration.preparedFinalObject.applyScreenMdmsData.egec.EncroachmentType', []);

    if (response.ResponseBody !== undefined) {
      let dataarray = [];
      response.ResponseBody.map(function (item, index) {
        let __FOUND = encroachValue.find(function (encroachRecord, index) {
          if (encroachRecord.code == item['encroachmentType'])
            return true;
        });    
        let temp = [];
        temp[0] = item['fineUuid'];
        temp[1] = __FOUND.name;
        temp[2] = item['numberOfViolation'];
        temp[3] = item['penaltyAmount'].split('.')[0];
        temp[4] = item['storageCharges'].split('.')[0];
        temp[5] = convertEpochToDate(item['effectiveStartDate']);
        temp[6] = convertEpochToDate(item['effectiveEndDate']);
        temp[7] = item['approvalStatus'];
        temp[8] = item['encroachmentType'];
        temp[9]="";        
        // temp[7]="";    
        // temp[8]=item['fromDate'];          
        dataarray.push(temp);
      });

      dispatch(prepareFinalObject('FineMasterGrid', dataarray));
      localStorage.setItem('FineMasterGrid', JSON.stringify(dataarray));
      dispatch(
        handleField(
          "search",
          "components.div.children.serachResultGrid",
          "props.data",
          dataarray,
        )
      );
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


