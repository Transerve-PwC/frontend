//import { getSearchResults } from "../../../../../ui-utils/commons";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
//import { getGridData1,getCategory1,getYear1,getMonth1,getrepotforproccessingTime1,getSectordata1,getSubCategory1,getUpdatePriceBook1,getMasterGridData1,getGridDataSellMeat1,getGridDataRoadcut1,getGridDataAdvertisement1} from "../../../../../ui-utils/commons";
import { convertEpochToDate, convertDateToEpoch, truncData } from "../../utils/index";
import { handleScreenConfigurationFieldChange as handleField } from "egov-ui-framework/ui-redux/screen-configuration/actions";

import { validateFields, getTextToLocalMappingItemMaster } from "../../utils";
import get from "lodash/get";
import set from "lodash/set";
import { fetchItemMasterData } from "../../../../../ui-utils/commons";
import { getUserInfo } from "egov-ui-kit/utils/localStorageUtils";

export const searchResultApiResponse = async (action, state, dispatch) => {
  const response = await fetchItemMasterData('');
  try {

    if (response) {
      let dataarray = [];
      let Item_Master = response.ResponseBody;
      Item_Master.map(function (item, index) {
        let temp = [];
        temp[0] = item['itemUuid'] +"~"+item['itemName']+"~"+item['description'];
        temp[1] = truncData(item['itemName'], 25);
        temp[2] = truncData(item['description'], 25);
        temp[3] = item['approvalStatus'];
        temp[4] = "";
        temp[5] = "";
        dataarray.push(temp);
      });

      dispatch(prepareFinalObject('ItemMasterGrid', dataarray));
      localStorage.setItem('ItemMasterGrid', JSON.stringify(dataarray));
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


