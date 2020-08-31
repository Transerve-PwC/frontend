import get from "lodash/get";
import set from "lodash/set";
import { handleScreenConfigurationFieldChange as handleField } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getSearchResults, getCount, getDuplicateCopySearchResults , getOwnershipSearchResults, getMortgageSearchResults} from "../../../../..//ui-utils/commons";
import {
  convertEpochToDate,
  convertDateToEpoch,
  getTextToLocalMapping
} from "../../utils/index";
import { toggleSnackbar, prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { validateFields } from "../../utils";
import { getTenantId } from "egov-ui-kit/utils/localStorageUtils";
import { setBusinessServiceDataToLocalStorage, getLocaleLabels } from "egov-ui-framework/ui-utils/commons";
import commonConfig from "config/common.js";
import { httpRequest } from "../../../../../ui-utils"
import { APPLICATION_NO, PROPERTY_ID, OWNER_NAME, STATUS, LAST_MODIFIED_ON, DATE, AMOUNT, TYPE, REMAINING_INTEREST, REMAINING_PRINCIPAL, TOTAL_DUE, ACCOUNT_BALANCE } from "./searchResults";
import { getAccountStatementProperty } from "../../../../../ui-utils/apply";
import moment from "moment";

export const getStatusList = async (state, dispatch, screen, path) => {
  const queryObject = [{ key: "tenantId", value: getTenantId() }, 
                      { key: "businessServices", value: "NewTL" }]
  const businessServices = await setBusinessServiceDataToLocalStorage(queryObject, dispatch);
  if(!!businessServices) {
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

export const searchTransferProperties = async (state, dispatch, onInit, offset, limit , hideTable = true) => {
  !!hideTable && showHideTable(false, dispatch, "search-transfer-properties");
  let queryObject = [
    // {
    //   key: "tenantId",
    //   value: getTenantId()
    // },
    { key: "offset", value: offset },
    { key: "limit", value: limit }
  ];
  queryObject = queryObject.filter(({value}) => !!value)
  let searchScreenObject = get(
    state.screenConfiguration.preparedFinalObject,
    "searchScreen",
    {}
  );
  const isSearchBoxFirstRowValid = validateFields(
    "components.div.children.ownerShipTransferApplication.children.cardContent.children.applicationNoContainer.children",
    state,
    dispatch,
    "search-transfer-properties"
  );

  const isSearchBoxSecondRowValid = validateFields(
    "components.div.children.ownerShipTransferApplication.children.cardContent.children.statusContainer.children",
    state,
    dispatch,
    "search-transfer-properties"
  );

  if (!(isSearchBoxFirstRowValid && isSearchBoxSecondRowValid) && typeof onInit != "boolean") {
    dispatch(
      toggleSnackbar(
        true,
        {
          labelName: "Please fill valid fields to start search",
          labelKey: "ERR_FILL_VALID_FIELDS"
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
          labelKey: "ERR_FILL_ONE_FIELDS"
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
    const response = await getOwnershipSearchResults(queryObject);
    try {
      let data = response.Owners.map(item => ({
        [APPLICATION_NO]: item.ownerDetails.applicationNumber || "-",
        [getTextToLocalMapping("Transit No")]: item.property.transitNumber || "-",
        // [PROPERTY_ID]: item.property.id || "-",
        [OWNER_NAME]: item.ownerDetails.name || "-",
        [STATUS]: getTextToLocalMapping(item.applicationState) || "-",
        [LAST_MODIFIED_ON]: convertEpochToDate(item.auditDetails.lastModifiedTime) || "-"
      }));
      dispatch(
        handleField(
          "search-transfer-properties",
          "components.div.children.transferSearchResults",
          "props.data",
          data
        )
      );
      !!hideTable && showHideTable(true, dispatch, "search-transfer-properties");
    } catch (error) {
      dispatch(toggleSnackbar(true, error.message, "error"));
      console.log(error);
    }
  }
}

export const searchMortgage = async (state, dispatch, onInit, offset, limit , hideTable = true) => {
  !!hideTable && showHideTable(false, dispatch, "search-mortgage");
  let queryObject = [
    {
      key: "tenantId",
      value: getTenantId()
    },
    { key: "offset", value: offset },
    { key: "limit", value: limit }
  ];
  queryObject = queryObject.filter(({value}) => !!value)
  let searchScreenObject = get(
    state.screenConfiguration.preparedFinalObject,
    "searchScreen",
    {}
  );
  const isSearchBoxFirstRowValid = validateFields(
    "components.div.children.searchMortgageApplication.children.cardContent.children.applicationNoContainer.children",
    state,
    dispatch,
    "search-mortgage"
  );

  const isSearchBoxSecondRowValid = validateFields(
    "components.div.children.searchMortgageApplication.children.cardContent.children.statusContainer.children",
    state,
    dispatch,
    "search-mortgage"
  );

  if (!(isSearchBoxFirstRowValid && isSearchBoxSecondRowValid) && typeof onInit != "boolean") {
    dispatch(
      toggleSnackbar(
        true,
        {
          labelName: "Please fill valid fields to start search",
          labelKey: "ERR_FILL_VALID_FIELDS"
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
          labelKey: "ERR_FILL_ONE_FIELDS"
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
    const response = await getMortgageSearchResults(queryObject);
    try {
      let data = response.MortgageApplications.map(item => ({
        [APPLICATION_NO]: item.applicationNumber || "-",
        [getTextToLocalMapping("Transit No")]: item.property.transitNumber || "-",
        [OWNER_NAME]: item.applicant[0].name || "-",
        [STATUS]: getTextToLocalMapping(item.state) || "-",
        [LAST_MODIFIED_ON]: convertEpochToDate(item.auditDetails.lastModifiedTime) || "-"
      }));
      dispatch(
        handleField(
          "search-mortgage",
          "components.div.children.mortgageSearchResults",
          "props.data",
          data
        )
      );
      !!hideTable && showHideTable(true, dispatch, "search-mortgage");
    } catch (error) {
      dispatch(toggleSnackbar(true, error.message, "error"));
    }
  }
}

export const searchAccountStatement = async (state, dispatch) => {
  let searchScreenObject = get(
    state.screenConfiguration.preparedFinalObject,
    "searchScreen",
    {}
  );

  const isSearchBoxFirstRowValid = validateFields(
    "components.div.children.accountStatementFilterForm.children.cardContent.children.applicationNoContainer.children",
    state,
    dispatch,
    "search-account-statement"
  );

  if(!!isSearchBoxFirstRowValid) {
    let Criteria = {
      fromdate: !!searchScreenObject.fromDate ? convertDateToEpoch(searchScreenObject.fromDate) : "",
      todate: !!searchScreenObject.toDate ? convertDateToEpoch(searchScreenObject.toDate) : ""
    }
    const propertyId = !!searchScreenObject.propertyId ? searchScreenObject.propertyId : await getAccountStatementProperty(state, dispatch)
      if(!!propertyId) {
        Criteria = {...Criteria, propertyid: propertyId}
        const response = await httpRequest(
          "post",
          '/rp-services/property/_accountstatement',
          "",
          [],
          {Criteria}
        )

        try {
          let data = response.RentAccountStatements.map(item => ({
            [DATE]: moment(new Date(item.date)).format("DD/MM/YYYY") || "-",
            [AMOUNT]: item.amount.toFixed(2) || "-",
            [TYPE]: item.type || "-",
            [REMAINING_INTEREST]: item.remainingInterest.toFixed(2),
            [REMAINING_PRINCIPAL]: item.remainingPrincipal.toFixed(2),
            [TOTAL_DUE]: item.dueAmount.toFixed(2),
            [ACCOUNT_BALANCE]: item.remainingBalance.toFixed(2)
          }));
          dispatch(
            handleField(
              "search-account-statement",
              "components.div.children.accountStatementResults",
              "visible",
              true
            )
          );
          dispatch(
            handleField(
              "search-account-statement",
              "components.div.children.accountStatementResults",
              "props.data",
              data
            )
          );
        } catch (error) {
          dispatch(toggleSnackbar(true, error.message, "error"));
        }
    }
  }
}

export const searchDuplicateCopy = async (state, dispatch, onInit, offset, limit , hideTable = true) => {
  !!hideTable && showHideTable(false, dispatch, "search-duplicate-copy");
  let queryObject = [
    {
      key: "tenantId",
      value: getTenantId()
    },
    { key: "offset", value: offset },
    { key: "limit", value: limit }
  ];
  queryObject = queryObject.filter(({value}) => !!value)
  let searchScreenObject = get(
    state.screenConfiguration.preparedFinalObject,
    "searchScreen",
    {}
  );
  const isSearchBoxFirstRowValid = validateFields(
    "components.div.children.searchDuplicateCopyApplication.children.cardContent.children.applicationNoContainer.children",
    state,
    dispatch,
    "search-duplicate-copy"
  );

  const isSearchBoxSecondRowValid = validateFields(
    "components.div.children.searchDuplicateCopyApplication.children.cardContent.children.statusContainer.children",
    state,
    dispatch,
    "search-duplicate-copy"
  );

  if (!(isSearchBoxFirstRowValid && isSearchBoxSecondRowValid) && typeof onInit != "boolean") {
    dispatch(
      toggleSnackbar(
        true,
        {
          labelName: "Please fill valid fields to start search",
          labelKey: "ERR_FILL_VALID_FIELDS"
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
          labelKey: "ERR_FILL_ONE_FIELDS"
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
    const response = await getDuplicateCopySearchResults(queryObject);
    try {
      let data = response.DuplicateCopyApplications.map(item => ({
        [APPLICATION_NO]: item.applicationNumber || "-",
        [getTextToLocalMapping("Transit No")]: item.property.transitNumber || "-",
        [OWNER_NAME]: item.applicant[0].name || "-",
        [STATUS]: getTextToLocalMapping(item.state) || "-",
        [LAST_MODIFIED_ON]: convertEpochToDate(item.auditDetails.lastModifiedTime) || "-"
      }));
      dispatch(
        handleField(
          "search-duplicate-copy",
          "components.div.children.duplicateCopySearchResult",
          "props.data",
          data
        )
      );
      !!hideTable && showHideTable(true, dispatch, "search-duplicate-copy");
    } catch (error) {
      dispatch(toggleSnackbar(true, error.message, "error"));
    }
  }
}

export const searchApiCall = async (state, dispatch, onInit, relations = "owner", offset, limit , hideTable = true) => {
  !!hideTable && showHideTable(false, dispatch, "search");
  let queryObject = [
    {
      key: "tenantId",
      value: getTenantId()
    },
    { key: "offset", value: offset },
    { key: "limit", value: limit },
    { key: "relations", value: relations}
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
    "search"
  );

  const isSearchBoxSecondRowValid = validateFields(
    "components.div.children.rentedPropertyApplication.children.cardContent.children.transitNumberContainer.children",
    state,
    dispatch,
    "search"
  );

  if (!(isSearchBoxFirstRowValid && isSearchBoxSecondRowValid) && typeof onInit != "boolean") {
    dispatch(
      toggleSnackbar(
        true,
        {
          labelName: "Please fill valid fields to start search",
          labelKey: "ERR_FILL_VALID_FIELDS"
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
          labelKey: "ERR_FILL_ONE_FIELDS"
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
      let data = response.Properties.map(item => {
        const findOwner = item.owners.find(itemdat => itemdat.activeState === true)
        return {
        [getTextToLocalMapping("Transit No")]: item.transitNumber || "-",
        [getTextToLocalMapping("Colony")]: getTextToLocalMapping(item.colony) || "-",
        [getTextToLocalMapping("Owner")]: !!findOwner ? findOwner.ownerDetails.name : "-",
        [getTextToLocalMapping("Status")]: getTextToLocalMapping(item.masterDataState) || "-",
        [LAST_MODIFIED_ON]: convertEpochToDate(item.auditDetails.lastModifiedTime) || "-"
      }
    });
      dispatch(
        handleField(
          "search",
          "components.div.children.searchResults",
          "props.data",
          data
        )
      );
      !!hideTable && showHideTable(true, dispatch, "search");
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

export const getColonyTypes = async(action, state, dispatch) => {
  const colonyTypePayload = [{
    moduleName: "PropertyServices",
    masterDetails: [{name: "colonies"}]
  }]
  const colonyRes = await getMdmsData(dispatch, colonyTypePayload);
  const {PropertyServices = []} = colonyRes.MdmsRes || {}
  dispatch(prepareFinalObject("applyScreenMdmsData.rentedPropertyColonies", PropertyServices.colonies))
  const propertyTypes = PropertyServices.colonies.map(item => ({
    code: item.code,
    label: item.code
  }))
  dispatch(prepareFinalObject("applyScreenMdmsData.propertyTypes", propertyTypes))
}

