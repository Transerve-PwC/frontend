
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
  else if (type === "SUHApplication"){
    documents = get(
      state,
      "screenConfiguration.preparedFinalObject.applyScreenMdmsData.NULM.SUHDocuments",
      []
    );
  }
  else if(type === "SUSVApplication"){
    documents = get(
      state,
      "screenConfiguration.preparedFinalObject.applyScreenMdmsData.NULM.SusvDocuments",
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
    const isHandicapped = get(state.screenConfiguration.preparedFinalObject, "NULMSEPRequest.isHandicapped");      
    let card = {};
    card["name"] = doc.code;
    card["code"] = doc.code;
    if(isHandicapped ==='YES' && doc.code ==='NULM_DISABILITY_CERTIFICATE')
    {
      card["required"] = true ;
    }
    else
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
