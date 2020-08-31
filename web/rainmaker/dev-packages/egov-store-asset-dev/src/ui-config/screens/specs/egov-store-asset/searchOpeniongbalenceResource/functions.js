import get from "lodash/get";
import find from "lodash/find";
import {
  handleScreenConfigurationFieldChange as handleField,
  toggleSnackbar,
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getOpeningBalanceSearchResults } from "../../../../../ui-utils/storecommonsapi";
import { ReceiptType } from "../../../../../ui-utils/sampleResponses";
import { getTextToLocalMapping } from "./searchResults";
import { validateFields } from "../../utils";
import { getTenantId,getOPMSTenantId } from "egov-ui-kit/utils/localStorageUtils";

export const getDeptName = (state, codes) => {
  let deptMdmsData = get(
    state.screenConfiguration.preparedFinalObject,
    "searchScreenMdmsData.common-masters.Department",
    []
  );
  let codeNames = codes.map((code) => {
    return get(find(deptMdmsData, { code: code }), "name", "");
  });
  return codeNames.join();
};

export const getDesigName = (state, codes) => {
  let desigMdmsData = get(
    state.screenConfiguration.preparedFinalObject,
    "searchScreenMdmsData.common-masters.Designation",
    []
  );
  let codeNames = codes.map((code) => {
    return get(find(desigMdmsData, { code: code }), "name", "");
  });
  return codeNames.join();
};

export const searchApiCall = async (state, dispatch) => {
  let { localisationLabels } = state.app || {};
  showHideTable(false, dispatch);
  const tenantId =
    get(state.screenConfiguration.preparedFinalObject, "searchScreen.ulb") ||
    getTenantId();
  let queryObject = [
    {
      key: "tenantId",
      value: tenantId,
    },
// add default receiptType(remove from UI if exist) hard code in search query string
    {
      key: "receiptType",
      value: ReceiptType().StoreReceiptType.OPENINGBALANCE_RECEIPT_TYPE
    }
  ];
  
  let searchScreenObject = get(
    state.screenConfiguration.preparedFinalObject,
    "searchScreen",
    {}
  );
  const isSearchFormValid = validateFields(
    "components.div.children.searchForm.children.cardContent.children.searchFormContainer.children",
    state,
    dispatch,
    "search-opening-balence"
  );

  if (!isSearchFormValid) {
    dispatch(
      toggleSnackbar(
        true,
        {
          labelName: "Please fill valid fields to start search",
          labelKey: "ERR_FILL_VALID_FIELDS",
        },
        "warning"
      )
    );
  } else if (
    Object.keys(searchScreenObject).length == 0 ||
    Object.values(searchScreenObject).every(x => x === "")
  ) {
    dispatch(
      toggleSnackbar(
        true,
        {
          labelName: "Please fill at least one field to start search",
          labelKey: "ERR_FILL_ONE_FIELDS",
        },
        "warning"
      )
    );
  } else {
    // Add selected search fields to queryobject
    for (var key in searchScreenObject) {
      if (
        searchScreenObject.hasOwnProperty(key) &&
        searchScreenObject[key].trim() !== ""
      ) {
        queryObject.push({ key: key, value: searchScreenObject[key].trim() });
      }
    }
    let response = await getOpeningBalanceSearchResults(queryObject, dispatch);
    try {
      if(response.materialReceipt.length===0)
      {
        dispatch(
              toggleSnackbar(
                true,
                { labelName: "No Records found for Input parameter", labelKey: "STORE_NO_RECORDS_FOUND" },
                "warning"
              )
            );
          
      }
      else{
      let data = response.materialReceipt.map((item) => {
       

        return {
          [getTextToLocalMapping("MRN Number")]: get(item, "mrnNumber", "-") || "-",
          [getTextToLocalMapping("Store Name")]: get(item, "receivingStore.code", "-") || "-", 
          [getTextToLocalMapping("Financial Year")]: get(item, "financialYear", "-") || "-", 
         // [getTextToLocalMapping("Active")]: get(item, "status", "-") || "-",  
          id: item.id,       
         
        };
      });

      dispatch(
        handleField(
          "search-opening-balence",
          "components.div.children.searchResults",
          "props.data",
          data
        )
      );
      dispatch(
        handleField(
          "search-opening-balence",
          "components.div.children.searchResults",
          "props.title",
          `${getTextToLocalMapping("Search Results for Opening Balence")} (${
            response.materialReceipt.length
          })`
        )
      );
      showHideTable(true, dispatch);
        }
    } catch (error) {
      dispatch(
        toggleSnackbar(
          true,
          { labelName: "Unable to parse search results!" },
          "error"
        )
      );
    }
  }
};

const showHideTable = (booleanHideOrShow, dispatch) => {
  dispatch(
    handleField(
      "search-opening-balence",
      "components.div.children.searchResults",
      "visible",
      booleanHideOrShow
    )
  );
};
