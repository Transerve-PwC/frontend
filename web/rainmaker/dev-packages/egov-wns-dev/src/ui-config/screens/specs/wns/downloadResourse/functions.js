import get from "lodash/get";
import find from "lodash/find";
import {
  handleScreenConfigurationFieldChange as handleField,
  toggleSnackbar,
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getSearchResults } from "../../../../../ui-utils/commons";
import { getTextToLocalMapping } from "./searchResults";
import { validateFields } from "../../utils";
import { getTenantId } from "egov-ui-kit/utils/localStorageUtils";
import { convertEpochToDate, convertDateToEpoch } from "../../utils/index";

export const searchApiCall = async (state, dispatch) => {
  let { localisationLabels } = state.app || {};
  showHideTable(false, dispatch);
  const tenantId =  getTenantId();
  let queryObject = [
    {
      key: "tenantId",
      value: tenantId,
    },
  ];


 
    // Add selected search fields to queryobject , "dayStart"
    
    let response = await getSearchResults(queryObject, dispatch,"purchaseOrder");
    try {
      let data = response.purchaseOrders.map((item) => {
        return {
           
            [getTextToLocalMapping("Col 1")]: get(item, "rateType", "-") || "-",
            [getTextToLocalMapping("Col 2")]: get(item, "supplier.name", "-") || "-",
            [getTextToLocalMapping("Download")]: get(item, "status", "-") || "-",
        };
      });

      dispatch(
        handleField(
          "download",
          "components.div.children.searchResults",
          "props.data",
          data
        )
      );
      dispatch(
        handleField(
          "download",
          "components.div.children.searchResults",
          "props.title",
          `${getTextToLocalMapping("Search Results for Purchase Order")} (${
            response.purchaseOrders.length
          })`
        )
      );
      showHideTable(true, dispatch);
    } catch (error) {
      dispatch(
        toggleSnackbar(
          true,
          { labelName: "Unable to parse search results!" },
          "error"
        )
      );
    }
  
};

const showHideTable = (booleanHideOrShow, dispatch) => {
  dispatch(
    handleField(
      "download",
      "components.div.children.searchResults",
      "visible",
      booleanHideOrShow
    )
  );
};
