import get from "lodash/get";
import set from "lodash/set";
import memoize from "lodash/memoize";
import { handleScreenConfigurationFieldChange as handleField } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getSearchResults, getCount } from "../../../../..//ui-utils/commons";
import {
  convertEpochToDate,
  convertDateToEpoch,
  getTextToLocalMapping as _getTextToLocalMapping,
  validateFields
} from "../../utils";
import { toggleSnackbar, prepareFinalObject, toggleSpinner } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getTenantId } from "egov-ui-kit/utils/localStorageUtils";
import { setBusinessServiceDataToLocalStorage, getLocaleLabels } from "egov-ui-framework/ui-utils/commons";
import commonConfig from "config/common.js";
import { httpRequest } from "../../../../../ui-utils"
import {
  localStorageGet,
} from "egov-ui-kit/utils/localStorageUtils";
import React from 'react';

export const getTextToLocalMapping = memoize((label) => _getTextToLocalMapping(label));

export const searchApiCall = async (state, dispatch, onInit, offset, limit = 100, hideTable = true) => {
  dispatch(toggleSpinner());
  !!hideTable && showHideTable(false, dispatch);
  let queryObject = [
    {
      key: "offset",
      value: offset
    },
    {
      key: "limit",
      value: limit
    }
  ];
  queryObject = queryObject.filter(({
    value
  }) => !!value)
  
  var searchScreenObject = get(
    state.screenConfiguration.preparedFinalObject,
    "searchApplicationsScreen", {}
  );
  var isSearchBoxValid = validateFields(
    "components.div.children.estateApplication.children.cardContent.children.searchBoxContainer.children",
    state,
    dispatch,
    "search-applications"
  );

  if (!isSearchBoxValid && typeof onInit != "boolean") {
    dispatch(
      toggleSnackbar(
        true, {
          labelName: "Please fill valid fields to start search",
          labelKey: "ERR_FILL_VALID_FIELDS"
        },
        "warning"
      )
    );
    dispatch(toggleSpinner());
  } else if ((Object.keys(searchScreenObject).length == 0 || Object.values(searchScreenObject).every(x => x === "")) && typeof onInit != "boolean") {
    dispatch(
      toggleSnackbar(
        true, {
          labelName: "Please fill at least one field to start search",
          labelKey: "ERR_FILL_ONE_FIELDS"
        },
        "warning"
      )
    );
    dispatch(toggleSpinner());
  }
  else {
    for (var key in searchScreenObject) {
      if (
        searchScreenObject.hasOwnProperty(key) &&
        searchScreenObject[key].trim() !== ""
      ) {
          queryObject.push({
            key: key,
            value: searchScreenObject[key].trim()
          });
      }
    }

    const response = await getSearchResults(queryObject);
    try {
      const length = response.Properties.length
      dispatch(
        handleField(
          "search-applications",
          "components.div.children.searchResults",
          "props.count",
          length
        )
      );

      dispatch(
        handleField(
          "search-applications",
          "components.div.children.searchResults",
          "props.title",
          `${getTextToLocalMapping(
            "Search Results for Applications"
          )} (${length})`
        )
      );
      
      let data = response.Properties.map(item => ({
        [getTextToLocalMapping("Application No")]: item.applicationNumber || "-",
        [getTextToLocalMapping("File No")]: item.fileNumber || "-",
        [getTextToLocalMapping("Status")]: item.state,
        [getTextToLocalMapping("Last Modified On")]: item.lastModifiedOn || "-",
        [getTextToLocalMapping("Application Type")]: item.applicationType || "-",
      }));

      dispatch(
        handleField(
          "search-applications",
          "components.div.children.searchResults",
          "props.data",
          data
        )
      );
      !!hideTable && showHideTable(true, dispatch);
      dispatch(toggleSpinner());
    } catch (error) {
      dispatch(toggleSnackbar(true, error.message, "error"));
      console.log(error);
      dispatch(toggleSpinner());
    }
  }
};

const showHideTable = (booleanHideOrShow, dispatch) => {
  dispatch(
    handleField(
      "search-applications",
      "components.div.children.searchResults",
      "visible",
      booleanHideOrShow
    )
  );
};