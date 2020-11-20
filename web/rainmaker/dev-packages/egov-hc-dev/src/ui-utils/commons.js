
import { handleScreenConfigurationFieldChange as handleField, prepareFinalObject, toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getTenantId, getUserInfo, setapplicationMode, setapplicationNumber } from "egov-ui-kit/utils/localStorageUtils";
import get from "lodash/get";
import set from "lodash/set";
import store from "redux/store";
import { getTranslatedLabel } from "../ui-config/screens/specs/utils";
import { httpRequest } from "./api";
import { toggleSpinner } from "egov-ui-framework/ui-redux/screen-configuration/actions";
// import { getUserInfo } from "egov-ui-kit/utils/localStorageUtils";



export const commonConfig = {
  
  tenantId: "ch.chandigarh"
  // forgotPasswordTenant: "ch.chandigarh",
};
export const TypeOfServiceRequest = {
  
  PRUNLESSTHAN90: "PRUNING OF TREES GIRTH LESS THAN OR EQUAL TO 90 CMS",
  PRUNMORETHAN90: "PRUNING OF TREES GIRTH GREATER THAN 90 CMS",
  REMOVALOFGREEN: "REMOVAL OF GREEN TREES",
  REMOVALOFDEADDRY: "REMOVAL OF DEAD/DANGEROUS/DRY TREES",
};
export const NumberOfTreesInPruning = {
  
  DefaultTrees: 1,
  
};


export const getLocaleLabelsforTL = (label, labelKey, localizationLabels) => {
  if (labelKey) {
    let translatedLabel = getTranslatedLabel(labelKey, localizationLabels);
    if (!translatedLabel || labelKey === translatedLabel) {
      return label;
    } else {
      return translatedLabel;
    }
  } else {
    return label;
  }
};

export const getSearchResultsEmployeeRequestFilter = async (data) => {
  // debugger
  
  try {
    store.dispatch(toggleSpinner());
    const response = await httpRequest(
      "post",
      "/hc-services/serviceRequest/_get",
      "",
      [],
      data
    );
    store.dispatch(toggleSpinner());
    return response;
  } catch (error) {
    store.dispatch(toggleSpinner());
    store.dispatch(
      toggleSnackbar(
        true,
        { labelName: error.message, labelCode: error.message },
        "error"
      )
    );
  }
};

export const getSearchResults = async queryObject => {
  let data = {
    "iscitizen" : 1
  };
  try {
    const response = await httpRequest(
      "post",
      "/hc-services/serviceRequest/_get",
      "",
      [],
      data
    );
    store.dispatch(toggleSpinner())
    return response;

  } catch (error) {
    store.dispatch(toggleSpinner())
    store.dispatch(
      toggleSnackbar(
        true,
        { labelName: error.message, labelCode: error.message },
        "error"
      )
    );
  }

};

export const getCurrentAssigneeUserNameAndRole = async (dispatch,userId) => {
  var tenantIdCommonConfig
      if (getTenantId() != commonConfig.tenantId){
          tenantIdCommonConfig = JSON.parse(getUserInfo()).permanentCity
      }
      else{
        tenantIdCommonConfig = getTenantId()
      }
  
  try {
    let payload = null;
    payload = await httpRequest(
      "post",
      `/egov-hrms/employees/_search?ids=${userId}&tenantId=${tenantIdCommonConfig}`,
      "_search",  
      [],
      
    );
    return(payload)
   
  } catch (e) {
    console.log(e);
  }};

  export const getSearchResultsForFilters = async (filterdata) => {
    
    let data = filterdata
   
    try {
      store.dispatch(toggleSpinner());
      const response = await httpRequest(
        "post",
        "/hc-services/serviceRequest/_get",
        "",
        [],
        data
      );
      store.dispatch(toggleSpinner());
      return response;
  
    } catch (error) {
      store.dispatch(toggleSpinner());
      store.dispatch(
        toggleSnackbar(
          true,
          { labelName: error.message, labelCode: error.message },
          "error"
        )
      );
    }
  
  };

export const getSearchResultsView = async queryObject => {


  try {
    //debugger
    const response = await httpRequest(
      "post", "hc-services/serviceRequest/_getDetail", "",
      [],
      {
        "service_request_id": queryObject[1].value,
        "tenantId":queryObject[0].value
        }
      
    );
    return response;
  } catch (error) {
    store.dispatch(
      toggleSnackbar(
        true, { labelName: error.message, labelCode: error.message }, "error"
      )
    );
  }
  
};

export const setRadioButtonResponse =  (serviceRequestType, subType,  dispatch) => {

  if(serviceRequestType === TypeOfServiceRequest.REMOVALOFDEADDRY)
  {
    dispatch(handleField("apply",
    "components.div.children.formwizardFirstStep.children.servicerequestdetailsEdit.children.cardContent.children.servicerequestdetailsContainer.children.serviceRequestSubtype",
    "props.buttons[0].disabled",
    false
  )
);
dispatch(handleField("apply",
    "components.div.children.formwizardFirstStep.children.servicerequestdetailsEdit.children.cardContent.children.servicerequestdetailsContainer.children.serviceRequestSubtype",
    "props.buttons[1].disabled",
    false
  )
);
dispatch(handleField("apply",
    "components.div.children.formwizardFirstStep.children.servicerequestdetailsEdit.children.cardContent.children.servicerequestdetailsContainer.children.serviceRequestSubtype",
    "props.buttons[2].disabled",
    false
  )
);
dispatch(handleField("apply",
    "components.div.children.formwizardFirstStep.children.servicerequestdetailsEdit.children.cardContent.children.servicerequestdetailsContainer.children.serviceRequestSubtype",
    "props.value",
    subType
  )
);
  }
  else{
    dispatch(handleField("apply",
          "components.div.children.formwizardFirstStep.children.servicerequestdetailsEdit.children.cardContent.children.servicerequestdetailsContainer.children.serviceRequestSubtype",
          "props.buttons[0].disabled",
          true
        )
      );
      dispatch(handleField("apply",
          "components.div.children.formwizardFirstStep.children.servicerequestdetailsEdit.children.cardContent.children.servicerequestdetailsContainer.children.serviceRequestSubtype",
          "props.buttons[1].disabled",
          true
        )
      );
      dispatch(handleField("apply",
          "components.div.children.formwizardFirstStep.children.servicerequestdetailsEdit.children.cardContent.children.servicerequestdetailsContainer.children.serviceRequestSubtype",
          "props.buttons[2].disabled",
          true
        )
      );
      dispatch(handleField("apply",
      "components.div.children.formwizardFirstStep.children.servicerequestdetailsEdit.children.cardContent.children.servicerequestdetailsContainer.children.serviceRequestSubtype",
      "props.value",
      undefined
    )
  );
  }

  
  
};
export const setTreeCountFieldEnableDisable =  (serviceRequestType,  dispatch) => {
  
        if(serviceRequestType ===TypeOfServiceRequest.PRUNLESSTHAN90 || serviceRequestType ===TypeOfServiceRequest.PRUNMORETHAN90 ){
         
        dispatch(handleField("apply",
        "components.div.children.formwizardFirstStep.children.servicerequestdetailsEdit.children.cardContent.children.servicerequestdetailsContainer.children.nooftrees",
        "props.disabled",
        true
      ))
      }
      else{
      
      dispatch(handleField("apply",
      "components.div.children.formwizardFirstStep.children.servicerequestdetailsEdit.children.cardContent.children.servicerequestdetailsContainer.children.nooftrees",
      "props.disabled",
      false
      ))
      }
  
  
};

export const returnNameFromCodeMdmsorViceVersa = (JSonArrayFromWhichValueToBeFiltered, valueToBeFiltered,codeRequiredOrName) => {
  
 
  var nameArray = []
  var keyValuePairObtainedFromFilter = []
  var codeArray = []
  var codeString = ""
  var nameString = ""
  
  keyValuePairObtainedFromFilter = JSonArrayFromWhichValueToBeFiltered.filter(function (state) {
    if (valueToBeFiltered === state.code )
    return state 
  });
  //if name is required from code
    if(codeRequiredOrName == 1)
   {
     nameArray = keyValuePairObtainedFromFilter.map(element => element.name )
     nameString = nameArray.join(",") 
     return nameString
    
  }
  else
 {  
  codeArray = keyValuePairObtainedFromFilter.map(element => element.code )
  codeString = codeArray.join(",") 
  return codeString
}

};
export const prepareDocumentsUploadData = (state, dispatch, type) => {
  let documents = '';
  if (type == "serviceRequestIDProof") {
    documents = get(
      state,
      "screenConfiguration.preparedFinalObject.applyScreenMdmsData['eg-horticulture'].IDProofDocument",
      []
    );
  }
  
  else {
    documents = get(
      state,
      "screenConfiguration.preparedFinalObject.applyScreenMdmsData.PetNOC.Documents",
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
   
     if (doc.code === "HORTICULTURE.ID_PROOF" && doc.hasMultipleRows && doc.options) {

      let buildingsData = get(state,
        "screenConfiguration.preparedFinalObject.applyScreenMdmsData['eg-horticulture'].IDProofDocument",
        []
      );

      buildingsData.forEach(building => {
        let card = {};
        card["name"] = building.name;
        card["code"] = doc.code;
        card["hasSubCards"] = true;
        card["subCards"] = [];
        doc.options.forEach(subDoc => {
          let subCard = {};
          subCard["name"] = subDoc.code;
          subCard["required"] = subDoc.required ? true : false;
          card.subCards.push(subCard);
        });
        tempDoc[doc.documentType].cards.push(card);
      });
    }
  
    else {
      let card = {};
      card["name"] = doc.code;
      card["code"] = doc.code;
      card["required"] = doc.required ? true : false;
      if (doc.hasDropdown && doc.dropdownData) {
        let dropdown = {};
        dropdown.label = "HC_SELECT_DOC_DD_LABEL";
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
    }
  });

  Object.keys(tempDoc).forEach(key => {
    documentsContract.push(tempDoc[key]);
  });

  dispatch(prepareFinalObject("documentsContract", documentsContract));
};
export const furnishServiceRequestDetailResponse = (state, response, dispatch) => {
  debugger
  let refurnishresponse = {};
  var serviceRequestType = []
  var sectorData = []
  serviceRequestTypeCodeFromResponse = []
  serviceRequestType = get(state, "screenConfiguration.preparedFinalObject.applyScreenMdmsData['eg-horticulture'].ServiceType")
  sectorData = get(state, "screenConfiguration.preparedFinalObject.applyScreenMdmsData['RAINMAKER-PGR'].Sector")

  //setting service request type data
  var serviceRequestTypeFromResponse = serviceRequestType.filter(function (state) {
    if (response.ResponseBody[0].service_type === state.code )
    return state 
  });
  var serviceRequestTypeCodeFromResponse = serviceRequestTypeFromResponse.map(element => element.code )
  var finalserviceRequestTypeCodeFromResponse = serviceRequestTypeCodeFromResponse.join(",")
  serviceRequestTypeFromResponse = serviceRequestTypeFromResponse.map(element => element.name )
  var serviceRequestTypeNameFromResponse = serviceRequestTypeFromResponse.join(",")

  // setting sector data 
  var sectorDataFromResponse = sectorData.filter(function (state) {
    if (response.ResponseBody[0].locality === state.code )
    return state 
  });
  var sectorDataNameFromResponse = sectorDataFromResponse.map(element => element.name )
   sectorDataNameFromResponse = sectorDataNameFromResponse.join(",") 
   var sectorDataCodeFromResponse = sectorDataFromResponse.map(element => element.code )
   sectorDataCodeFromResponse = sectorDataCodeFromResponse.join(",") 


  if(response.ResponseBody[0].servicerequestsubtype != null && response.ResponseBody[0].servicerequestsubtype != undefined && response.ResponseBody[0].servicerequestsubtype != ""  ){
    var serviceRequestSubtype =  response.ResponseBody[0].servicerequestsubtype
    serviceRequestSubtype = JSON.parse(serviceRequestSubtype)
    response.ResponseBody[0].servicerequestsubtype = serviceRequestSubtype.subservicetype
  }
  setRadioButtonResponse(finalserviceRequestTypeCodeFromResponse, response.ResponseBody[0].servicerequestsubtype, dispatch)
  setTreeCountFieldEnableDisable(finalserviceRequestTypeCodeFromResponse, dispatch)
  set(refurnishresponse, "contactNumber", response.ResponseBody[0].contact_number);
  set(refurnishresponse, "subType", response.ResponseBody[0].servicerequestsubtype);
  set(refurnishresponse, "description", response.ResponseBody[0].description);
  set(refurnishresponse, "ownerName", response.ResponseBody[0].owner_name);
  set(refurnishresponse, "tenantId", response.ResponseBody[0].tenant_id);
  set(refurnishresponse, "email", response.ResponseBody[0].email_id);
  set(refurnishresponse, "mohalla", {value:sectorDataCodeFromResponse, label:sectorDataNameFromResponse});
  set(refurnishresponse, "houseNoAndStreetName", response.ResponseBody[0].street_name);
  set(refurnishresponse, "landmark", response.ResponseBody[0].landmark);
  set(refurnishresponse, "latitude", response.ResponseBody[0].latitude);
  set(refurnishresponse, "longitude", response.ResponseBody[0].longitude);
  set(refurnishresponse, "address", response.ResponseBody[0].location);
  set(refurnishresponse, "serviceType", {value:finalserviceRequestTypeCodeFromResponse, label:serviceRequestTypeNameFromResponse});
  set(refurnishresponse, "treeCount", response.ResponseBody[0].tree_count);
  set(refurnishresponse, "service_request_id", response.ResponseBody[0].service_request_id);
  set(refurnishresponse, "media", JSON.parse(response.ResponseBody[0].service_request_document));
  
  set(refurnishresponse, "isEditState", 1);
  return refurnishresponse;
};
export const furnishServiceRequestDetailResponseForEdit = (response, state,dispatch)=> {
  debugger
  let refurnishresponse = {};
  var serviceRequestType = []
  var sectorData = []
  serviceRequestType = get(state, "screenConfiguration.preparedFinalObject.applyScreenMdmsData['eg-horticulture'].ServiceType")
  sectorData = get(state, "screenConfiguration.preparedFinalObject.applyScreenMdmsData['RAINMAKER-PGR'].Sector")

  //setting service request type data
  var serviceRequestTypeFromResponse = serviceRequestType.filter(function (state) {
    if (response.serviceType === state.code )
    return state 
  });
  var serviceRequestTypeCodeFromResponse = serviceRequestTypeFromResponse.map(element => element.code )
  var serviceRequestTypenameFromResponse = serviceRequestTypeFromResponse.map(element => element.name )
  var finalserviceRequestTypeCodeFromResponse = serviceRequestTypeCodeFromResponse.join(",")
  var finalServiceRequestTypeNameFromResponse = serviceRequestTypenameFromResponse.join(",")

  // setting sector data 
  var sectorDataFromResponse = sectorData.filter(function (state) {
    if ( response.mohalla === state.code )
    return state 
  });
  var sectorDataNameFromResponse = sectorDataFromResponse.map(element => element.name )
  var sectorDataCodeFromResponse = sectorDataFromResponse.map(element => element.code )
  var finalSectorDataNameFromResponse = sectorDataNameFromResponse.join(",")
  var finalSectorDataCodeFromResponse = sectorDataCodeFromResponse.join(",")
  
 

  set(refurnishresponse, "contactNumber", response.contactNumber);
  set(refurnishresponse, "description", response.description);
  set(refurnishresponse, "ownerName", response.ownerName);
  set(refurnishresponse, "tenantId", response.tenantId);
  set(refurnishresponse, "email", response.email);
  set(refurnishresponse, "mohalla", {value:finalSectorDataCodeFromResponse, label:finalSectorDataNameFromResponse});
  set(refurnishresponse, "houseNoAndStreetName", response.houseNoAndStreetName);
  set(refurnishresponse, "landmark", response.landmark);
  set(refurnishresponse, "latitude", response.latitude);
  set(refurnishresponse, "longitude", response.longitude);
  set(refurnishresponse, "address", response.address);
  set(refurnishresponse, "serviceType", {value:finalServiceRequestTypeNameFromResponse, label: finalserviceRequestTypeCodeFromResponse});
  set(refurnishresponse, "subType", response.subType);
  set(refurnishresponse, "treeCount", response.treeCount);
  set(refurnishresponse, "service_request_id", response.service_request_id);
  // set(refurnishresponse, "media", JSON.parse(response.media));
  
  set(refurnishresponse, "isEditState", 1);
  return refurnishresponse;
};
export const setApplicationNumberBox = (state, dispatch) => {

  let applicationNumber = get(state, "state.screenConfiguration.preparedFinalObject.SERVICEREQUEST.service_request_id", null);

  if (applicationNumber) {
    dispatch(
      handleField(
        "apply",
        "components.div.children.headerDiv.children.header.children.service_request_id",
        "visible",
        true
      )
    );
    dispatch(
      handleField(
        "apply",
        "components.div.children.headerDiv.children.header.children.service_request_id",
        "props.number",
        applicationNumber
      )
    );
  }
};

export const findItemInArrayOfObject = (arr, conditionCheckerFn) => {
  // debugger
  for (let i = 0; i < arr.length; i++) {
    if (conditionCheckerFn(arr[i])) {
      return arr[i];
    }
  }
};



export const EditServiceRequest = async (state, dispatch, status) => {
  let response = '';
  
  let method = "CREATE";

  try {
    
    let payload = get(state.screenConfiguration.preparedFinalObject, "SERVICEREQUEST", []);
    // console.log("payload"+payload)
   
    let service_request_id_for_edit
    try{
      service_request_id_for_edit = payload.service_request_id
    }
    catch(e){
      service_request_id_for_edit= "";
    }
    let response = '';
    setapplicationMode(status);
    let arraypayload=[]
    arraypayload.push(payload);

    if (method === "CREATE") {
      
      dispatch(toggleSpinner());
      response = await httpRequest("post", "hc-services/serviceRequest/_create", "", [], {services: arraypayload });

      if (response.ResponseInfo.status === 'successful') {
        dispatch(prepareFinalObject("SERVICES", response));
        setapplicationNumber(service_request_id_for_edit);

        setApplicationNumberBox(state, dispatch);
        dispatch(toggleSpinner());
        return { status: "successful", message: response };
      } else {
        dispatch(toggleSpinner());
        return { status: "fail", message: response };
      }
    } 

  } catch (error) {
    dispatch(toggleSpinner());
    dispatch(toggleSnackbar(true, { labelName: error.message }, "error"));

  }
};

export const createServiceRequest = async (state, dispatch, status) => {
let response = '';

let method = "CREATE";

try {
  
  let payload = get(state.screenConfiguration.preparedFinalObject, "SERVICEREQUEST", []);
  console.log("payload",payload)

  let response = '';
  setapplicationMode(status);
  let arraypayload=[]
  arraypayload.push(payload);

  if (method === "CREATE") {
    
    dispatch(toggleSpinner());

    response = await httpRequest("post", "hc-services/serviceRequest/_create", "", [], {services: arraypayload });
    
    if (response.services[0].serviceRequestId !== 'null' || response.services[0].serviceRequestId !== '') {
      dispatch(prepareFinalObject("SERVICES", response));
    
      setapplicationNumber(response.services[0].service_request_id);
      
    
      
      setApplicationNumberBox(state, dispatch);
      dispatch(toggleSpinner());
      return { status: "success", message: response };
    } else {
      dispatch(toggleSpinner());
      return { status: "fail", message: response };
    }
  } 

} catch (error) {
  dispatch(toggleSpinner());
  dispatch(toggleSnackbar(true, { labelName: error.message }, "error"));

  
  
  return { status: "failure", message: error };
}
};

