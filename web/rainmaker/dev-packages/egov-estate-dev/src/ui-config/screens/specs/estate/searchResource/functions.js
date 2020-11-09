import get from "lodash/get";
import set from "lodash/set";
import { handleScreenConfigurationFieldChange as handleField } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getSearchResults, getSearchApplicationsResults} from "../../../../..//ui-utils/commons";
import {
  convertEpochToDate,
  getTextToLocalMapping
} from "../../utils/index";
import { toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { validateFields } from "../../utils";
import { localStorageGet } from "egov-ui-kit/utils/localStorageUtils";
import { setBusinessServiceDataToLocalStorage, getLocaleLabels } from "egov-ui-framework/ui-utils/commons";
import commonConfig from "config/common.js";
import { httpRequest } from "../../../../../ui-utils"
import { APPLICATION_TYPE, LAST_MODIFIED_ON } from "./searchResults";
export const getStatusList = async (state, dispatch, queryObject, screen, path, moduleName) => {
  await setBusinessServiceDataToLocalStorage(queryObject, dispatch);
  const businessServices = JSON.parse(localStorageGet("businessServiceData"));
  if(!!businessServices && !!screen && !!path) {
    const status = businessServices[0].states.filter(item => !!item.state).map(({state}) => ({code: state}))
    dispatch(
      handleField(
        screen,
        path,
        "props.data",
        status
      )
    );
  }
}

export const searchApiCall = async (state, dispatch, onInit, offset, limit , hideTable = true, branchType = "ESTATE_BRANCH", screenKey = "search") => {
  !!hideTable && showHideTable(false, dispatch, "search");
  let queryObject = [
    // {
    //   key: "tenantId",
    //   value: getTenantId()
    // },
    { key: "offset", value: offset },
    { key: "limit", value: limit },
    { key: "branchType", value: branchType }
  ];
  queryObject = queryObject.filter(({value}) => !!value)
  let searchScreenObject = get(
    state.screenConfiguration.preparedFinalObject,
    "searchScreen",
    {}
  );

  

  const isSearchBoxFirstRowValid = validateFields(
    "components.div.children.rentedPropertyApplication.children.cardContent.children.colonyContainer.children",
    state,
    dispatch,
    screenKey
  );

  const isSearchBoxSecondRowValid = validateFields(
    "components.div.children.rentedPropertyApplication.children.cardContent.children.transitNumberContainer.children",
    state,
    dispatch,
    screenKey
  );

  if (!(isSearchBoxFirstRowValid && isSearchBoxSecondRowValid) && typeof onInit != "boolean") {
    dispatch(
      toggleSnackbar(
        true,
        {
          labelName: "Please fill valid fields to start search",
          labelKey: "ES_ERR_FILL_VALID_FIELDS"
        },
        "warning"
      )
    );
  } else if (
    (Object.keys(searchScreenObject).length == 0 ||
    Object.values(searchScreenObject).every(x => x === "")) && typeof onInit != "boolean"
  ) {
    dispatch(
      toggleSnackbar(
        true,
        {
          labelName: "Please fill at least one field to start search",
          labelKey: "ES_ERR_FILL_ONE_FIELDS"
        },
        "warning"
      )
    );
  } else {
      for (var key in searchScreenObject) {
        if (
          searchScreenObject.hasOwnProperty(key) &&
          searchScreenObject[key].trim() !== ""
        ) {
            queryObject.push({ key: key, value: searchScreenObject[key].trim() });
        }
    }
    const response = await getSearchResults(queryObject);
    try {
      let data = response.Properties.map(item => ({
        [getTextToLocalMapping("File Number")]: item.fileNumber || "-",
        [getTextToLocalMapping("Sector Number")]: item.sectorNumber || "-",
        [getTextToLocalMapping("Status")]: getLocaleLabels(item.state, item.state) || "-",
        [LAST_MODIFIED_ON]: convertEpochToDate(item.auditDetails.lastModifiedTime) || "-",
        ["propertyMasterOrAllotmentOfSite"]: item.propertyMasterOrAllotmentOfSite
      }));
      dispatch(
        handleField(
          screenKey,
          "components.div.children.searchResults",
          "props.data",
          data
        )
      );
      !!hideTable && showHideTable(true, dispatch, screenKey);
    } catch (error) {
      dispatch(toggleSnackbar(true, error.message, "error"));
      console.log(error);
    }
  }
};

export const searchApplicationApiCall = async (state, dispatch, onInit, offset, limit , hideTable = true, branchType="ESTATE_BRANCH") => {
  !!hideTable && showHideTable(false, dispatch, "search-application");
  let queryObject = [
    // {
    //   key: "tenantId",
    //   value: getTenantId()
    // },
    { key: "offset", value: offset },
    { key: "limit", value: limit },
    { key: "branchType", value: branchType }
  ];
  queryObject = queryObject.filter(({value}) => !!value)
  let searchScreenObject = get(
    state.screenConfiguration.preparedFinalObject,
    "searchScreen",
    {}
  );

  const isSearchBoxFirstRowValid = validateFields(
    "components.div.children.estateApplicationSearch.children.cardContent.children.fileStatusContainer.children",
    state,
    dispatch,
    "search-application"
  );

  const isSearchBoxSecondRowValid = validateFields(
    "components.div.children.estateApplicationSearch.children.cardContent.children.applicationNumberContainer.children",
    state,
    dispatch,
    "search-application"
  );

  if (!(isSearchBoxFirstRowValid && isSearchBoxSecondRowValid) && typeof onInit != "boolean") {
    dispatch(
      toggleSnackbar(
        true,
        {
          labelName: "Please fill valid fields to start search",
          labelKey: "ES_ERR_FILL_VALID_FIELDS"
        },
        "warning"
      )
    );
  } else if (
    (Object.keys(searchScreenObject).length == 0 ||
    Object.values(searchScreenObject).every(x => x === "")) && typeof onInit != "boolean"
  ) {
    dispatch(
      toggleSnackbar(
        true,
        {
          labelName: "Please fill at least one field to start search",
          labelKey: "ES_ERR_FILL_ONE_FIELDS"
        },
        "warning"
      )
    );
  } else {
      for (var key in searchScreenObject) {
        if (
          searchScreenObject.hasOwnProperty(key) &&
          searchScreenObject[key].trim() !== ""
        ) {
            queryObject.push({ key: key, value: searchScreenObject[key].trim() });
        }
    }
    const response = await getSearchApplicationsResults(queryObject);
    try {
      let data = response.Applications.map(item => ({
        [getTextToLocalMapping("File Number")]: item.property.fileNumber || "-",
        [getTextToLocalMapping("Application Number")]: item.applicationNumber || "-",
        [getTextToLocalMapping("Application Status")]: getLocaleLabels(item.state, item.state) || "-",
        [APPLICATION_TYPE]: getLocaleLabels(item.applicationType, item.applicationType) || "-",
        [LAST_MODIFIED_ON]: convertEpochToDate(item.auditDetails.lastModifiedTime) || "-"
      }));
      dispatch(
        handleField(
          "search-application",
          "components.div.children.searchApplicationResults",
          "props.data",
          data
        )
      );
      !!hideTable && showHideTable(true, dispatch, "search-application");
    } catch (error) {
      dispatch(toggleSnackbar(true, error.message, "error"));
      console.log(error);
    }
  }
};

const showHideTable = (booleanHideOrShow, dispatch, screenKey) => {
  dispatch(
    handleField(
      screenKey,
      "components.div.children.searchResults",
      "visible",
      booleanHideOrShow
    )
  );
};

export const getFileUrlAPI = async (fileStoreId,tenantId) => {
  const queryObject = [
  	//{ key: "tenantId", value: tenantId||commonConfig.tenantId },
    { key: "tenantId", value: tenantId },
    { key: "fileStoreIds", value: fileStoreId }
  ];
  try {
    const fileUrl = await httpRequest(
      "get",
      "/filestore/v1/files/url",
      "",
      queryObject
    );
    return fileUrl;
  } catch (e) {
    console.log(e);
  }
};

export const downloadCSVFromFilestoreID=(fileStoreId,mode,tenantId)=>{
  getFileUrlAPI(fileStoreId,tenantId).then(async(fileRes) => {
    if (mode === 'download') {
      var win = window.open(fileRes[fileStoreId], '_blank');
      if(win){
        win.focus();
      }
    }
    else {
     // printJS(fileRes[fileStoreId])
      var response =await axios.get(fileRes[fileStoreId], {
        //responseType: "blob",
        responseType: "arraybuffer",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/pdf"
        }
      });
      console.log("responseData---",response);
      const file = new Blob([response.data], { type: "application/pdf" });
      const fileURL = URL.createObjectURL(file);
      var myWindow = window.open(fileURL);
      if (myWindow != undefined) {
        myWindow.addEventListener("load", event => {
          myWindow.focus();
          myWindow.print();
        });
      }

    }
  });
}

const getMdmsData = async (dispatch, body) => {
  let mdmsBody = {
    MdmsCriteria: {
      tenantId: commonConfig.tenantId,
      moduleDetails: body
    }
  };
  try {
    let payload = await httpRequest(
      "post",
      "/egov-mdms-service/v1/_search",
      "_search",
      [],
      mdmsBody
    );
    return payload;
  } catch (e) {
    console.log(e);
  }
};