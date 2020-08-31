import get from "lodash/get";
import find from "lodash/find";
import {
  handleScreenConfigurationFieldChange as handleField,
  toggleSnackbar,
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getSearchResults } from "../../../../../ui-utils/commons";
import { getTextToLocalMapping } from "./searchResults";
import { validateFields,convertDateToEpoch } from "../../utils";
import { getTenantId,getUserInfo } from "egov-ui-kit/utils/localStorageUtils";
import set from "lodash/set";
export const searchApiCall = async (state, dispatch) => {
  let { localisationLabels } = state.app || {};
  showHideTable(false, dispatch);
  const tenantId = process.env.REACT_APP_NAME === "Employee" ?  getTenantId() : JSON.parse(getUserInfo()).permanentCity;

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
    "search-organization"
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
    // for (var key in searchScreenObject) {
      
    //   if(searchScreenObject.hasOwnProperty(key) && typeof searchScreenObject[key] === "boolean"){
    //     queryObject.push({ key: key, value: searchScreenObject[key] });
    //   }
    //   else  if (
    //     searchScreenObject.hasOwnProperty(key) &&
    //     searchScreenObject[key].trim() !== ""
    //   ) {
    //     queryObject.push({ key: key, value: searchScreenObject[key].trim() });
    //   }
    // }
   let OrganizationRequest = {...searchScreenObject};
   OrganizationRequest.tenantId = tenantId;

  // if(get(OrganizationRequest, "toDate")){
  //   let toDate = get(OrganizationRequest, "toDate").split("-").reverse().join("-");
  //   set( OrganizationRequest,"toDate",toDate );
  // }
  // if(get(OrganizationRequest, "fromDate")){
  //   let fromDate = get(OrganizationRequest, "fromDate").split("-").reverse().join("-");
  //   set( OrganizationRequest,"fromDate",fromDate );
  // }
  
   const requestBody = {OrganizationRequest}
    let response = await getSearchResults([],requestBody, dispatch,"organization");
    try {
      let data = response.ResponseBody.map((item) => {
  
        return {
          [getTextToLocalMapping("Organization Name")]: get(item, "organizationName", "-") || "-",
          [getTextToLocalMapping("Registration number of the organization")]: get(item, "registrationNo", "-") || "-",
          [getTextToLocalMapping("Name of authorized representative")]: get(item, "representativeName", "-") || "-",
          [getTextToLocalMapping("Active")]: get(item, "isActive", false)? "Yes": "No",
          ["code"]: get(item, "organizationUuid", "-")
        };
      });

      dispatch(
        handleField(
          "search-organization",
          "components.div.children.searchResults",
          "props.data",
          data
        )
      );
      dispatch(
        handleField(
          "search-organization",
          "components.div.children.searchResults",
          "props.title",
          `${getTextToLocalMapping("Search Results for Organization")} (${
            response.ResponseBody.length
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
      "search-organization",
      "components.div.children.searchResults",
      "visible",
      booleanHideOrShow
    )
  );
};
