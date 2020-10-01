
import { handleScreenConfigurationFieldChange as handleField, prepareFinalObject, toggleSnackbar, toggleSpinner } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getFileUrlFromAPI, getMultiUnits, getQueryArg,getFileUrl } from "egov-ui-framework/ui-utils/commons";
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
    const isDisabilityCertificateAvailable = get(state.screenConfiguration.preparedFinalObject, "NULMSEPRequest.isDisabilityCertificateAvailable");
    let card = {};
    card["name"] = doc.code;
    card["code"] = doc.code;
    if(isHandicapped ==='YES'&& isDisabilityCertificateAvailable==="YES" && doc.code ==='NULM_DISABILITY_CERTIFICATE')
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

export const getprintpdf = async (queryObject , api) => {

  try {
    store.dispatch(toggleSpinner());
   const state = store.getState();
const {NULMSEPRequest} = state.screenConfiguration.preparedFinalObject;

const SepApplication = [NULMSEPRequest]; 
const fileStoreIdsObj = NULMSEPRequest.applicationDocument.filter(docInfo => {
  if(docInfo.documentType==="Photo copy of Applicant" || docInfo.documentType==="Photo of Applicant") 
  return docInfo.filestoreId
  });
  const fileStoreIds = fileStoreIdsObj[0].filestoreId;
   const fileUrlPayload =  fileStoreIds && (await getFileUrlFromAPI(fileStoreIds));
   if(fileUrlPayload){
    const photoUrl = getFileUrl(fileUrlPayload[fileStoreIds]);
    SepApplication[0].applicantPhoto = photoUrl;
      SepApplication[0].nameOfApplicant = SepApplication[0].name;
   let requestBody = {SepApplication};
    const response = await httpRequest(
      "post",
      api,     
      "",
      queryObject,
      requestBody
    );
    store.dispatch(toggleSpinner());
    return response;
   }
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