import get from "lodash/get";
import find from "lodash/find";
import {
  handleScreenConfigurationFieldChange as handleField,
  toggleSnackbar,
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getPriceListSearchResults } from "../../../../../ui-utils/storecommonsapi";
import { getTextToLocalMapping } from "./searchResults";
import { validateFields } from "../../utils";
import { convertEpochToDate,  } from "../../utils/index";
import { getTenantId, } from "egov-ui-kit/utils/localStorageUtils";

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
    "search-price-list"
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
      if(searchScreenObject.hasOwnProperty(key) && typeof searchScreenObject[key] === "boolean"){
        queryObject.push({ key: key, value: searchScreenObject[key] });
      }
      else if (
        searchScreenObject.hasOwnProperty(key) &&
        searchScreenObject[key].trim() !== ""
      ) {
        queryObject.push({ key: key, value: searchScreenObject[key].trim() });
      }
    }
    let response = await getPriceListSearchResults(queryObject, dispatch);
    try {

      if(response.priceLists.length===0)
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
      let data = response.priceLists.map((item) => {
       

        return {
          [getTextToLocalMapping("Suplier Name")]: get(item, "supplier.name", "-") || "-",
          [getTextToLocalMapping("Rate Type")]: get(item, "rateType", "-") || "-", 
        // [getTextToLocalMapping("Store Name")]: get(item, "StoreName", "-") || "-", 
         [getTextToLocalMapping("Agrement No")]: get(item, "agreementNumber", "-") || "-", 
         [getTextToLocalMapping("Agrement Start Date")]: convertEpochToDate(item.agreementStartDate, "agreementStartDate", "-") || "-",  
         [getTextToLocalMapping("Agrement End Date")]: convertEpochToDate(item.agreementEndDate, "agreementEndDate", "-") || "-",  
          [getTextToLocalMapping("Active")]: get(item, "active",false) ? "Yes": "No", 
          id: item.id,       
         
        };
      });

      dispatch(
        handleField(
          "search-price-list",
          "components.div.children.searchResults",
          "props.data",
          data
        )
      );
      dispatch(
        handleField(
          "search-price-list",
          "components.div.children.searchResults",
          "props.title",
          `${getTextToLocalMapping("Search Results for Price List")} (${
            response.priceLists.length
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
      "search-price-list",
      "components.div.children.searchResults",
      "visible",
      booleanHideOrShow
    )
  );
};
