import get from "lodash/get";
import find from "lodash/find";
import {
  handleScreenConfigurationFieldChange as handleField,
  toggleSnackbar,
  prepareFinalObject
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getSearchResults } from "../../../../../ui-utils/commons";
import { getTextToLocalMapping } from "./searchResults";
import { validateFields,convertDateToEpoch } from "../../utils";
import { getTenantId,getUserInfo } from "egov-ui-kit/utils/localStorageUtils";
import set from "lodash/set";
export const searchApiCall = async (state, dispatch) => {
  let { localisationLabels } = state.app || {};
  showHideTable(false, dispatch);
  const tenantId = "ch.chandigarh" // process.env.REACT_APP_NAME === "Employee" ?  getTenantId() : JSON.parse(getUserInfo()).permanentCity;

  let queryObject = [];
  let searchScreenObject = get(
    state.screenConfiguration.preparedFinalObject,
    "searchScreen",
    {}
  );
  const isSearchFormValid = validateFields(
    "components.div.children.searchForm.children.cardContent.children.searchFormContainer.children",
    state,
    dispatch,
    "search-house"
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
    Object.keys(searchScreenObject).length < 2||
    Object.values(searchScreenObject).every((x) => (typeof x === "string") && x.trim() === "")
  ) {
    dispatch(
      toggleSnackbar(
        true,
        {
          labelName: "Please fill all required field then search",
          labelKey: "ERR_FILL_INTIGRATION_HOUSE_FIELDS",
        },
        "warning"
      )
    );
  } else {
    // Add selected search fields to queryobject
    // for (var key in searchScreenObject) {      
      
    //     queryObject.push({ key: key, value: searchScreenObject[key] });
      
    // }
  // let NulmSuhRequest = {...searchScreenObject};
   //NulmSuhRequest.tenantId = tenantId;
   const requestBody = {...searchScreenObject}
    let response = await getSearchResults([],requestBody, dispatch, "house");
    dispatch(prepareFinalObject("RecordSet", response.ResponseBody[0].RecordSet));
    try {
      let data = response.ResponseBody[0].RecordSet.map((item) => {
  
        return {
          [getTextToLocalMapping("Property ID")]: get(item, "PROPERTYID", "-") || "-",
          [getTextToLocalMapping("House No")]: get(item, "HOUSENO", "-") || "-",
          [getTextToLocalMapping("Owner Name")]: get(item, "PROPERTYOWNER", "-") || "-",
          [getTextToLocalMapping("Mobile No")]: get(item, "Number", "-") || "-",
          
        };
      });

      dispatch(
        handleField(
          "search-house",
          "components.div.children.searchResults",
          "props.data",
          data
        )
      );
      dispatch(
        handleField(
          "search-house",
          "components.div.children.searchResults",
          "props.title",
          `${getTextToLocalMapping("Search Results for House")} (${
            response.ResponseBody[0].RecordSet.length
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
      "search-house",
      "components.div.children.searchResults",
      "visible",
      booleanHideOrShow
    )
  );
};
