
import { handleScreenConfigurationFieldChange as handleField, prepareFinalObject, toggleSnackbar, toggleSpinner } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getFileUrlFromAPI, getMultiUnits, getQueryArg, } from "egov-ui-framework/ui-utils/commons";
import { getTenantId, getUserInfo, } from "egov-ui-kit/utils/localStorageUtils";
import jp from "jsonpath";
import get from "lodash/get";
import set from "lodash/set";
import store from "redux/store";

import { httpRequest } from "./api";

import { setRoute } from "egov-ui-framework/ui-redux/app/actions";


const role_name = JSON.parse(getUserInfo()).roles[0].code
export const getstoreTenantId = () => {
  let gettenantId = getTenantId()
  gettenantId = gettenantId.split('.')
  return gettenantId[0];
};
export const getMaterialMasterSearchResults = async queryObject => {

  try {
    store.dispatch(toggleSpinner());
    const response = await httpRequest(
      "post",
      "/store-asset-services/materials/_search",
      "",
      queryObject
    );
    store.dispatch(toggleSpinner());
    return response;
  } catch (error) {
    store.dispatch(
      toggleSnackbar(
        true,
        { labelName: error.message, labelKey: error.message },
        "error"
      )
    );
    // throw error;
  }

};
export const createMaterial = async (queryObject, payload, dispatch) => {
  try {
    const response = await httpRequest(
      "post",
      "/store-asset-services/materials/_create",
      "",
      queryObject,
      { materials: payload }
    );
    return response;
  } catch (error) {
    dispatch(
      toggleSnackbar(
        true,
        { labelName: error.message, labelKey: error.message },
        "error"
      )
    );
    throw error;
  }
};
export const updateMaterial = async (queryObject, payload, dispatch) => {
  try {
    const response = await httpRequest(
      "post",
      "/store-asset-services/materials/_update",
      "",
      queryObject,
      { materials: payload }
    );
    return response;
  } catch (error) {
    dispatch(
      toggleSnackbar(
        true,
        { labelName: error.message, labelKey: error.message },
        "error"
      )
    );
    throw error;
  }
};
export const getStoresSearchResults = async queryObject => {

  try {
    store.dispatch(toggleSpinner());
    const response = await httpRequest(
      "post",
      "store-asset-services/stores/_search",
      "",
      queryObject
    );
    store.dispatch(toggleSpinner());
    return response;
  } catch (error) {
    store.dispatch(
      toggleSnackbar(
        true,
        { labelName: error.message, labelKey: error.message },
        "error"
      )
    );
    store.dispatch(toggleSpinner());
    //throw error;
  }

};
// price List API 
export const getPriceListSearchResults = async queryObject => {

  try {
    store.dispatch(toggleSpinner());
    const response = await httpRequest(
      "post",
      "/store-asset-services/pricelists/_search",
      "",
      queryObject
    );
    store.dispatch(toggleSpinner());
    return response;
  } catch (error) {
    store.dispatch(
      toggleSnackbar(
        true,
        { labelName: error.message, labelKey: error.message },
        "error"
      )
    );
    // throw error;
  }

};
export const createPriceList = async (queryObject, payload, dispatch) => {
  try {
    const response = await httpRequest(
      "post",
      "/store-asset-services/pricelists/_create",
      "",
      queryObject,
      { pricelists: payload }
    );
    return response;
  } catch (error) {
    dispatch(
      toggleSnackbar(
        true,
        { labelName: error.message, labelKey: error.message },
        "error"
      )
    );
    throw error;
  }
};
export const UpdatePriceList = async (queryObject, payload, dispatch) => {
  try {
    const response = await httpRequest(
      "post",
      "/store-asset-services/pricelists/_update",
      "",
      queryObject,
      { priceLists: payload }
    );
    return response;
  } catch (error) {
    dispatch(
      toggleSnackbar(
        true,
        { labelName: error.message, labelKey: error.message },
        "error"
      )
    );
    throw error;
  }
};
// Opening Balance API
// price List API 
export const getOpeningBalanceSearchResults = async queryObject => {

  try {
    store.dispatch(toggleSpinner());
    const response = await httpRequest(
      "post",
      "/store-asset-services/openingbalance/_search",
      "",
      queryObject
    );
    store.dispatch(toggleSpinner());
    return response;
  } catch (error) {
    store.dispatch(
      toggleSnackbar(
        true,
        { labelName: error.message, labelKey: error.message },
        "error"
      )
    );
    // throw error;
  }

};
export const createOpeningBalance = async (queryObject, payload, dispatch) => {
  try {
    const response = await httpRequest(
      "post",
      "/store-asset-services/openingbalance/_create",
      "",
      queryObject,
      { materialReceipt: payload }
    );
    return response;
  } catch (error) {
    dispatch(
      toggleSnackbar(
        true,
        { labelName: error.message, labelKey: error.message },
        "error"
      )
    );
    throw error;
  }
};
export const updateOpeningBalance = async (queryObject, payload, dispatch) => {
  try {
    const response = await httpRequest(
      "post",
      "/store-asset-services/openingbalance/_update",
      "",
      queryObject,
      { materialReceipt: payload }
    );
    return response;
  } catch (error) {
    dispatch(
      toggleSnackbar(
        true,
        { labelName: error.message, labelKey: error.message },
        "error"
      )
    );
    throw error;
  }
};
export const prepareDocumentsUploadData = async (state, dispatch, type) => {
  let documents = '';
  if (type == "SEPApplication") {
    documents = get(
      state,
      "screenConfiguration.preparedFinalObject.applyScreenMdmsData.NULM.SEPDocuments",
      []
    );
  }
  else if (type === "SMIDApplication"){
    documents = get(
      state,
      "screenConfiguration.preparedFinalObject.applyScreenMdmsData.NULM.SMIDDocuments",
      []
    );
  }


  documents = documents.filter(item => {
    return item.active;
  });
  let documentsContract = [];
  let tempDoc = {};
  documents.forEach(doc => {
    let card = {};
    card["code"] = doc.documentType;
    card["title"] = doc.documentType;
    card["cards"] = [];
    tempDoc[doc.documentType] = card;
  });

  documents.forEach(doc => {
    // Handle the case for multiple muildings

    let card = {};
    card["name"] = doc.code;
    card["code"] = doc.code;
    card["required"] = doc.required ? true : false;
    if (doc.hasDropdown && doc.dropdownData) {
      let dropdown = {};
      dropdown.label = "NOC_SELECT_DOC_DD_LABEL";
      dropdown.required = true;
      dropdown.menu = doc.dropdownData.filter(item => {
        return item.active;
      });
      dropdown.menu = dropdown.menu.map(item => {
        return { code: item.code, label: getTransformedLocale(item.code) };
      });
      card["dropdown"] = dropdown;
    }
    tempDoc[doc.documentType].cards.push(card);

  });

  Object.keys(tempDoc).forEach(key => {
    documentsContract.push(tempDoc[key]);
  });

  dispatch(prepareFinalObject("documentsContract", documentsContract));

};

export const getMaterialIndentSearchResults = async queryObject => {

  try {
    store.dispatch(toggleSpinner());
    const response = await httpRequest(
      "post",
      "/store-asset-services/indents/_search",
      "",
      queryObject
    );
    store.dispatch(toggleSpinner());
    return response;
  } catch (error) {
    store.dispatch(
      toggleSnackbar(
        true,
        { labelName: error.message, labelKey: error.message },
        "error"
      )
    );
    // throw error;
  }

};
export const createMaterialIndent = async (queryObject, payload, dispatch) => {
  try {
    const response = await httpRequest(
      "post",
      "/store-asset-services/indents/_create",
      "",
      queryObject,
      { indents: payload }
    );
    return response;
  } catch (error) {
    dispatch(
      toggleSnackbar(
        true,
        { labelName: error.message, labelKey: error.message },
        "error"
      )
    );
    throw error;
  }
};
export const updateMaterialIndent = async (queryObject, payload, dispatch) => {
  try {
    const response = await httpRequest(
      "post",
      "/store-asset-services/indents/_update",
      "",
      queryObject,
      { indents: payload }
    );
    return response;
  } catch (error) {
    console.log(error)
    dispatch(
      toggleSnackbar(
        true,
        { labelName: error.message, labelKey: error.message },
        "error"
      )
    );
    throw error;
  }
};

export const getmaterialissuesSearchResults = async queryObject => {

  try {
    store.dispatch(toggleSpinner());
    const response = await httpRequest(
      "post",
      "/store-asset-services/materialissues/_search",
      "",
      queryObject
    );
    store.dispatch(toggleSpinner());
    return response;
  } catch (error) {
    store.dispatch(
      toggleSnackbar(
        true,
        { labelName: error.message, labelKey: error.message },
        "error"
      )
    );
    // throw error;
  }

};
export const creatematerialissues = async (queryObject, payload, dispatch) => {
  try {
    const response = await httpRequest(
      "post",
      "/store-asset-services/materialissues/_create",
      "",
      queryObject,
      { materialIssues: payload }
    );
    return response;
  } catch (error) {
    dispatch(
      toggleSnackbar(
        true,
        { labelName: error.message, labelKey: error.message },
        "error"
      )
    );
    throw error;
  }
};
export const updatematerialissues = async (queryObject, payload, dispatch) => {
  try {
    const response = await httpRequest(
      "post",
      "/store-asset-services/materialissues/_update",
      "",
      queryObject,
      { materialIssues: payload }
    );
    return response;
  } catch (error) {
    dispatch(
      toggleSnackbar(
        true,
        { labelName: error.message, labelKey: error.message },
        "error"
      )
    );
    throw error;
  }
};
export const getreceiptnotesSearchResults = async queryObject => {

  try {
    store.dispatch(toggleSpinner());
    const response = await httpRequest(
      "post",
      "/store-asset-services/receiptnotes/_search",
      "",
      queryObject
    );
    store.dispatch(toggleSpinner());
    return response;
  } catch (error) {
    store.dispatch(
      toggleSnackbar(
        true,
        { labelName: error.message, labelKey: error.message },
        "error"
      )
    );
    // throw error;
  }

};
export const creatreceiptnotes = async (queryObject, payload, dispatch) => {
  try {
    const response = await httpRequest(
      "post",
      "/store-asset-services/receiptnotes/_create",
      "",
      queryObject,
      { materialReceipt: payload }
    );
    return response;
  } catch (error) {
    dispatch(
      toggleSnackbar(
        true,
        { labelName: error.message, labelKey: error.message },
        "error"
      )
    );
    throw error;
  }
};
export const updatereceiptnotes = async (queryObject, payload, dispatch) => {
  try {
    const response = await httpRequest(
      "post",
      "/store-asset-services/receiptnotes/_update",
      "",
      queryObject,
      { materialReceipt: payload }
    );
    return response;
  } catch (error) {
    dispatch(
      toggleSnackbar(
        true,
        { labelName: error.message, labelKey: error.message },
        "error"
      )
    );
    throw error;
  }
};
export const getmiscellaneousreceiptnotesSearchResults = async queryObject => {

  try {
    store.dispatch(toggleSpinner());
    const response = await httpRequest(
      "post",
      "/store-asset-services/miscellaneousreceiptnotes/_search",
      "",
      queryObject
    );
    store.dispatch(toggleSpinner());
    return response;
  } catch (error) {
    store.dispatch(
      toggleSnackbar(
        true,
        { labelName: error.message, labelKey: error.message },
        "error"
      )
    );
    // throw error;
  }

};
export const creatmiscellaneousreceiptnotes = async (queryObject, payload, dispatch) => {
  try {
    const response = await httpRequest(
      "post",
      "/store-asset-services/miscellaneousreceiptnotes/_create",
      "",
      queryObject,
      { materialReceipt: payload }
    );
    return response;
  } catch (error) {
    dispatch(
      toggleSnackbar(
        true,
        { labelName: error.message, labelKey: error.message },
        "error"
      )
    );
    throw error;
  }
};
export const updatemiscellaneousreceiptnotes = async (queryObject, payload, dispatch) => {
  try {
    const response = await httpRequest(
      "post",
      "/store-asset-services/miscellaneousreceiptnotes/_update",
      "",
      queryObject,
      { materialReceipt: payload }
    );
    return response;
  } catch (error) {
    dispatch(
      toggleSnackbar(
        true,
        { labelName: error.message, labelKey: error.message },
        "error"
      )
    );
    throw error;
  }
};