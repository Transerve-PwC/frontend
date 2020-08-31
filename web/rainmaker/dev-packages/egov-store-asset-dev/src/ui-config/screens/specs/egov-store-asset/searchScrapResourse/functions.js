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
  let searchScreenObject = get(
    state.screenConfiguration.preparedFinalObject,
    "searchScreen",
    {}
  );
  const isSearchFormValid = validateFields(
    "components.div.children.searchForm.children.cardContent.children.searchFormContainer.children",
    state,
    dispatch,
    "search-store"
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
    Object.values(searchScreenObject).every((x) => (typeof x === "string") && x.trim() === "")
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
      else  if (
        searchScreenObject.hasOwnProperty(key) &&
        searchScreenObject[key].trim() !== ""
      ) {
        queryObject.push({ key: key, value: searchScreenObject[key].trim() });
      }
    }
    let response = await getSearchResults(queryObject, dispatch,"scrap");
    try {
      let data = response.scraps.map((item) => {
        return {
            [getTextToLocalMapping("Scrap Number")]: get(item, "scrapNumber", "-") || "-",
            [getTextToLocalMapping("Scrap Date")]: get(item, "scrapDate", "")? new Date(get(item, "scrapDate", "-")).toISOString().substr(0,10) : "-",
            [getTextToLocalMapping("Store Name")]: get(item, "store.name", "-") || "-",
            [getTextToLocalMapping("Scrap Status")]: get(item, "scrapStatus", "-") || "-",
        };
      });

      dispatch(
        handleField(
          "search-scrap-material",
          "components.div.children.searchResults",
          "props.data",
          data
        )
      );
      dispatch(
        handleField(
          "search-scrap-material",
          "components.div.children.searchResults",
          "props.title",
          `${getTextToLocalMapping("Search Results for Scrap Material")} (${
            response.scraps.length
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
  }
};

const showHideTable = (booleanHideOrShow, dispatch) => {
  dispatch(
    handleField(
      "search-scrap-material",
      "components.div.children.searchResults",
      "visible",
      booleanHideOrShow
    )
  );
};
