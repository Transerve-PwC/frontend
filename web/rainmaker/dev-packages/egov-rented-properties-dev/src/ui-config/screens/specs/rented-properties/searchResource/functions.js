import get from "lodash/get";
import set from "lodash/set";
import { handleScreenConfigurationFieldChange as handleField ,prepareFinalObject} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getSearchResults, getCount, getDuplicateCopySearchResults , getOwnershipSearchResults, getMortgageSearchResults} from "../../../../..//ui-utils/commons";
import {
  convertEpochToDate,
  convertDateToEpoch,
  getTextToLocalMapping
} from "../../utils/index";
import { toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { validateFields } from "../../utils";
import { getTenantId } from "egov-ui-kit/utils/localStorageUtils";
import { setBusinessServiceDataToLocalStorage, getLocaleLabels } from "egov-ui-framework/ui-utils/commons";
import commonConfig from "config/common.js";
import { httpRequest } from "../../../../../ui-utils"
import { APPLICATION_NO, PROPERTY_ID, OWNER_NAME, STATUS, LAST_MODIFIED_ON, DATE, AMOUNT, TYPE,TYPES, REMAINING_INTEREST, REMAINING_PRINCIPAL, TOTAL_DUE, ACCOUNT_BALANCE } from "./searchResults";
import { getAccountStatementProperty } from "../../../../../ui-utils/apply";
import moment from "moment";
import {
  downloadReceiptFromFilestoreID
} from "egov-common/ui-utils/commons"
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

export const formatAmount = (x) => {
  
  return x.toString().split('.')[0].length > 3 ? x.toString().substring(0,x.toString().split('.')[0].length-3).replace(/\B(?=(\d{2})+(?!\d))/g, ",") + "," + x.toString().substring(x.toString().split('.')[0].length-3): x.toString();
  
}

export const changeType = (type) => {
    if(type === 'C'){
      return "Payment"
      }else
      {
        return "-"
  }
}
export const changePType=(type)=>{
  if(type==='D'){
    return "Rent"
  }else
  {
    return "-"
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
          dispatch(
            prepareFinalObject(
              "RentAccountStatements",
              response.RentAccountStatements
            )
          );
          let data = response.RentAccountStatements.map(item => ({
            [DATE]: moment(new Date(item.date)).format("DD-MMM-YYYY") || "-",
            [AMOUNT]:  formatAmount(item.amount.toFixed(2)) || "-",
            [TYPE]: changeType(item.type) || "-",
            [TYPES]: changePType(item.type) || "-",
            [REMAINING_INTEREST]:  formatAmount(item.remainingInterest.toFixed(2)),
            [REMAINING_PRINCIPAL]: formatAmount(item.remainingPrincipal.toFixed(2)),
            [TOTAL_DUE]: formatAmount(item.dueAmount.toFixed(2)),
            [ACCOUNT_BALANCE]: formatAmount(item.remainingBalance.toFixed(2))
          }));
          let lastElement = data.pop();
          lastElement.Date = "Total as on "+lastElement.Date
          lastElement.Type = 0
          data.push(lastElement)
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
        dispatch(
        handleField(
          "search-account-statement",
          "components.div.children.downloadButton",
          "visible",
          true
      ),
    );
        } catch (error) {
          dispatch(toggleSnackbar(true, error.message, "error"));
        }
    }
  }
}

export const downloadAccountStatementPdf = async(state, dispatch) => {
  const { RentAccountStatements } = state.screenConfiguration.preparedFinalObject;
  const {Properties} = state.screenConfiguration.preparedFinalObject;
  const data = RentAccountStatements.map(item =>
    ({
      ...item,
      date: moment(new Date(item.date)).format("DD-MMM-YYYY") || "-",
      amount : formatAmount(item.amount.toFixed(2)) || "-",
      type : changeType(item.type || "-"),
      remainingInterest : formatAmount(item.remainingInterest.toFixed(2)),
      remainingPrincipal :formatAmount(item.remainingPrincipal.toFixed(2)),
      dueAmount :formatAmount(item.dueAmount.toFixed(2)),
      remainingBalance : formatAmount(item.remainingBalance.toFixed(2))
    })
  )

  let lastElement = data.pop();
  lastElement.date = "Total as on "+ lastElement.date
  lastElement.type = '-'
  lastElement.amount = '-'
  data.push(lastElement)
  
  const mode = "download"
  let   queryStr = [{
    key: "key",
    value: "rp-account-statement-generation"
  },
  {
    key: "tenantId",
    value: "ch"
  }
]

  const DOWNLOADRECEIPT = {
    GET: {
      URL: "/pdf-service/v1/_create",
      ACTION: "_get",
    },
  };
  try {
        httpRequest("post", DOWNLOADRECEIPT.GET.URL, DOWNLOADRECEIPT.GET.ACTION, queryStr, {
          Properties : Properties,RentAccountStatements: data 
          }, {
            'Accept': 'application/json'
          }, {
            responseType: 'arraybuffer'
          })
          .then(res => {
            res.filestoreIds[0]
            if (res && res.filestoreIds && res.filestoreIds.length > 0) {
              res.filestoreIds.map(fileStoreId => {
                downloadReceiptFromFilestoreID(fileStoreId, mode)
              })
            } else {
              console.log("Error In Acknowledgement form Download");
            }
          });
   
  } catch (exception) {
    alert('Some Error Occured while downloading Acknowledgement form!');
  }
}

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

export const downloadAccountStatementXLS = async (state, dispatch) => {
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
      fromDate: !!searchScreenObject.fromDate ? convertDateToEpoch(searchScreenObject.fromDate) : "",
      toDate: !!searchScreenObject.toDate ? convertDateToEpoch(searchScreenObject.toDate) : ""
    }
    const propertyId = !!searchScreenObject.propertyId ? searchScreenObject.propertyId : await getAccountStatementProperty(state, dispatch)
      if(!!propertyId) {
        Criteria = {...Criteria, propertyid: propertyId}
        const res = await httpRequest(
          "post",
          '/rp-services/property/_accountstatementxlsx',
          "",
          [],
          {Criteria}
        )

        try {
          if (res && res[0].fileStoreId) {
            console.log(res[0].fileStoreId)
            console.log(res[0].tenantId)

            downloadCSVFromFilestoreID(res[0].fileStoreId, 'download' ,res[0].tenantId)
          }
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
    moduleName: "RentedProperties",
    masterDetails: [{name: "colonies"}]
  }]
  const colonyRes = await getMdmsData(dispatch, colonyTypePayload);
  const {RentedProperties = []} = colonyRes.MdmsRes || {}
  dispatch(prepareFinalObject("applyScreenMdmsData.rentedPropertyColonies", RentedProperties.colonies))
  const propertyTypes = RentedProperties.colonies.map(item => ({
    code: item.code,
    label: item.code
  }))
  dispatch(prepareFinalObject("applyScreenMdmsData.propertyTypes", propertyTypes))
}

