
import { handleScreenConfigurationFieldChange as handleField, prepareFinalObject, toggleSnackbar,toggleSpinner } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getFileUrlFromAPI, getMultiUnits, getQueryArg,   } from "egov-ui-framework/ui-utils/commons";
import {  getTenantId, getUserInfo,  } from "egov-ui-kit/utils/localStorageUtils";
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
  if (type == "pricelist") {
    documents = get(
      state,
      "screenConfiguration.preparedFinalObject.DocumentType_PriceList",
      []
    );
  }
  else  if (type == "materialReceipt") {
    documents = get(
      state,
      "screenConfiguration.preparedFinalObject.DocumentType_MaterialReceipt",
      []
    );
  }

  else {
    documents = get(
      state,
      "screenConfiguration.preparedFinalObject.applyScreenMdmsData.store.Documents",
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
    card["url"] = doc.url;
    card["cards"] = [];
    tempDoc[doc.documentType] = card;
  });

  documents.forEach(doc => {
    // Handle the case for multiple muildings
 
      let card = {};
      card["name"] = doc.code;
      card["code"] = doc.code;
      card["url"] = doc.url;
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
export const createMaterialIndent = async (queryObject, payload, dispatch,wfobject) => {
  try {
    const response = await httpRequest(
      "post",
      "/store-asset-services/indents/_create",
      "",
      queryObject,
      { indents: payload, workFlowDetails: wfobject }
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

export const getprintpdf = async (queryObject , api) => {

  try {
    store.dispatch(toggleSpinner());
    const response = await httpRequest(
      "post",
      api,     
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
export const getMaterialBalanceRateResults = async queryObject => {

  try {
    store.dispatch(toggleSpinner());
    const response = await httpRequest(
      "post",
      "/store-asset-services/receiptnotes/_balance",     
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
export const creatematerialissues = async (queryObject, payload, dispatch,wfobject) => {
  try {
    const response = await httpRequest(
      "post",
      "/store-asset-services/materialissues/_create",
      "",
      queryObject,
      { materialIssues: payload, workFlowDetails: wfobject }
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
export const creatreceiptnotes = async (queryObject, payload, dispatch,wfobject) => {
  try {
    const response = await httpRequest(
      "post",
      "/store-asset-services/receiptnotes/_create",
      "",
      queryObject,
      { materialReceipt: payload, workFlowDetails: wfobject }
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
export const creatmiscellaneousreceiptnotes = async (queryObject, payload, dispatch,wfobject) => {
  try {
    const response = await httpRequest(
      "post",
      "/store-asset-services/miscellaneousreceiptnotes/_create",
      "",
      queryObject,
      { materialReceipt: payload, workFlowDetails: wfobject }
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

//Non-Indent Material Issue Note
export const getNonIndentMaterialIssueSearchResults = async queryObject => {

  try {
    store.dispatch(toggleSpinner());
    const response = await httpRequest(
      "post",
      "/store-asset-services/materialissues-ni/_search",     
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
export const creatNonIndentMaterialIssue = async (queryObject, payload, dispatch,wfobject) => {
  try {
    const response = await httpRequest(
      "post",
      "/store-asset-services/materialissues-ni/_create",
      "",
      queryObject,
      { materialIssues: payload, workFlowDetails: wfobject }
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
export const updateNonIndentMaterialIssue = async (queryObject, payload, dispatch) => {
  try {
    const response = await httpRequest(
      "post",
      "/store-asset-services/materialissues-ni/_update",
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


export const GetMdmsNameBycode = (state, dispatch,jsonpath, code) => {
  //Material
  let Obj  = get(state, `screenConfiguration.preparedFinalObject.${jsonpath}`,[]) 
  let Name = code
  Obj = Obj.filter(x=>x.code === code)
  if(Obj &&Obj[0])
  Name = Obj[0].name
  return Name;
};

export const ValidateCard = (state,dispatch,cardJsonPath,pagename,jasonpath,value) => {
  let  DuplicatItem =[];
  let CardItem = get(
    state.screenConfiguration.screenConfig[`${pagename}`],
    cardJsonPath,
    []
  );
 let matcode =[];
  for (let index = 0; index < CardItem.length; index++) {
    if(CardItem[index].isDeleted === undefined ||
    CardItem[index].isDeleted !== false)
    {
    let code = get(state.screenConfiguration.preparedFinalObject,`${jasonpath}[${index}].${value}`,'')  
    code = GetMdmsNameBycode(state, dispatch,"createScreenMdmsData.store-asset.Material",code)       
    matcode.push(code)
    }
  } 
  var uniq = matcode
  .map((name) => {
    return {
      count: 1,
      name: name
    }
  })
  .reduce((a, b) => {
    a[b.name] = (a[b.name] || 0) + b.count
    return a
  }, {})  
  var duplicates = Object.keys(uniq).filter((a) => uniq[a] > 1)
  if(duplicates.length>0)
  {
  duplicates= duplicates.map(itm => {
      return `${itm}`;
    })
    .join() || "-"
   // IsDuplicatItem = true;  
    DuplicatItem.push(
      {
        duplicates: duplicates,
        IsDuplicatItem:true
      }      
    )  
  } 
  else{
    DuplicatItem.push(
      {
        duplicates: duplicates,
        IsDuplicatItem:false
      });

  }

  return DuplicatItem;
};
export const ValidateCardMultiItem = (state,dispatch,cardJsonPath,pagename,jasonpath,value, value1) => {
  let  DuplicatItem =[];
  let CardItem = get(
    state.screenConfiguration.screenConfig[`${pagename}`],
    cardJsonPath,
    []
  );
 let matcode =[];
  for (let index = 0; index < CardItem.length; index++) {
    if(CardItem[index].isDeleted === undefined ||
    CardItem[index].isDeleted !== false)
    {
    let code = get(state.screenConfiguration.preparedFinalObject,`${jasonpath}[${index}].${value}`,'')  
    code = GetMdmsNameBycode(state, dispatch,"createScreenMdmsData.store-asset.Material",code)  
    let value1_ = get(state.screenConfiguration.preparedFinalObject,`${jasonpath}[${index}].${value1}`,'') 
    value1_ = GetMdmsNameBycode(state, dispatch,"createScreenMdmsData.store-asset.Material",value1_)      
    matcode.push(code+'_'+value1_)
    }
  } 
  var uniq = matcode
  .map((name) => {
    return {
      count: 1,
      name: name
    }
  })
  .reduce((a, b) => {
    a[b.name] = (a[b.name] || 0) + b.count
    return a
  }, {})  
  var duplicates = Object.keys(uniq).filter((a) => uniq[a] > 1)
  if(duplicates.length>0)
  {
  duplicates= duplicates.map(itm => {
      return `${itm}`;
    })
    .join() || "-"
   // IsDuplicatItem = true;  
   // replace char
   if(duplicates.indexOf('_') !== -1)
   duplicates = duplicates.replace("_", ",");
    DuplicatItem.push(
      {
        duplicates: duplicates,
        IsDuplicatItem:true
      }      
    )  
  } 
  else{
    DuplicatItem.push(
      {
        duplicates: duplicates,
        IsDuplicatItem:false
      });

  }

  return DuplicatItem;
};
export const ValidateCardUserQty = (state,dispatch,cardJsonPath,pagename,jasonpath,value,InputQtyValue,CompareQtyValue,balanceQuantity,doubleqtyCheck) => {
  let  DuplicatItem =[];
  let CardItem = get(
    state.screenConfiguration.screenConfig[`${pagename}`],
    cardJsonPath,
    []
  );
 let matcode =[];
  for (let index = 0; index < CardItem.length; index++) {
    if(CardItem[index].isDeleted === undefined ||
    CardItem[index].isDeleted !== false)
    {
    let code = get(state.screenConfiguration.preparedFinalObject,`${jasonpath}[${index}].${value}`,'') 
    code = GetMdmsNameBycode(state, dispatch,"createScreenMdmsData.store-asset.Material",code)  
    let InputQtyValue_ = get(state.screenConfiguration.preparedFinalObject,`${jasonpath}[${index}].${InputQtyValue}`,0) 
    let CompareQtyValue_ = get(state.screenConfiguration.preparedFinalObject,`${jasonpath}[${index}].${CompareQtyValue}`,0) 
    let balanceQuantity_ = get(state.screenConfiguration.preparedFinalObject,`${jasonpath}[${index}].${balanceQuantity}`,0) 
    if(doubleqtyCheck)
    {
     if(balanceQuantity_>CompareQtyValue_)
     {
      if(pagename ==='createMaterialIndentNote')
      {

        let IssueQty = get(state.screenConfiguration.preparedFinalObject,`${jasonpath}[${index}].indentDetail.issuedQuantity`,0)
        let poOrderedQuantity = get(state.screenConfiguration.preparedFinalObject,`${jasonpath}[${index}].indentDetail.poOrderedQuantity`,0)
        
        CompareQtyValue_ = CompareQtyValue_ - (IssueQty+poOrderedQuantity);
        if(InputQtyValue_>CompareQtyValue_)       
        matcode.push(code)
      }
      else{
        if(InputQtyValue_>CompareQtyValue_)       
        matcode.push(code)

      }
     
     }
     else if (balanceQuantity_<=CompareQtyValue_)
     {
      if(InputQtyValue_>balanceQuantity_)       
      matcode.push(code)
     }

    }
    else{
      if(pagename ==='create-purchase-order')
      {
        let IssueQty = get(state.screenConfiguration.preparedFinalObject,`${jasonpath}[${index}].issuedQuantity`,0)
        let poOrderedQuantity = get(state.screenConfiguration.preparedFinalObject,`${jasonpath}[${index}].poOrderedQuantity`,0)
        
        CompareQtyValue_ = CompareQtyValue_ - (IssueQty+poOrderedQuantity);
        if(InputQtyValue_>CompareQtyValue_)       
        matcode.push(code)

      }
      else{
        if(InputQtyValue_>CompareQtyValue_)       
    matcode.push(code)

      }
      
    }
    }
    
  } 
  var uniq = matcode
  .map((name) => {
    return {
      count: 1,
      name: name
    }
  })
  .reduce((a, b) => {
    a[b.name] = (a[b.name] || 0) + b.count
    return a
  }, {})  
  var duplicates = Object.keys(uniq).filter((a) => uniq[a] > 0)
  if(duplicates.length>0)
  {
  duplicates= duplicates.map(itm => {
      return `${itm}`;
    })
    .join() || "-"
   // IsDuplicatItem = true;  
    DuplicatItem.push(
      {
        duplicates: duplicates,
        IsInvalidQty:true
      }      
    )  
  } 
  else{
    DuplicatItem.push(
      {
        duplicates: duplicates,
        IsInvalidQty:false
      });

  }

  return DuplicatItem;
};
export const ValidateCardQty = (state,dispatch,cardJsonPath,pagename,jasonpath,value,InputQtyValue,CompareQtyValue,balanceQuantity,doubleqtyCheck,value2,InputQtyValue2) => {
  let  DuplicatItem =[];
  let CardItem = get(
    state.screenConfiguration.screenConfig[`${pagename}`],
    cardJsonPath,
    []
  );
 let matcode =[];
 let PONumber =[];
  for (let index = 0; index < CardItem.length; index++) {
    if(CardItem[index].isDeleted === undefined ||
    CardItem[index].isDeleted !== false)
    {
    let code = get(state.screenConfiguration.preparedFinalObject,`${jasonpath}[${index}].${value}`,'') 
    code = GetMdmsNameBycode(state, dispatch,"createScreenMdmsData.store-asset.Material",code)  
    let InputQtyValue_ = get(state.screenConfiguration.preparedFinalObject,`${jasonpath}[${index}].${InputQtyValue}`,0) 
    let InputQtyValue2_ = get(state.screenConfiguration.preparedFinalObject,`${jasonpath}[${index}].${InputQtyValue2}`,0) 
    let CompareQtyValue_ = get(state.screenConfiguration.preparedFinalObject,`${jasonpath}[${index}].${CompareQtyValue}`,0) 
    let balanceQuantity_ = get(state.screenConfiguration.preparedFinalObject,`${jasonpath}[${index}].${balanceQuantity}`,0) 
    if(doubleqtyCheck)
    {
     if(balanceQuantity_>CompareQtyValue_)
     {
      if(InputQtyValue_>CompareQtyValue_)       
      matcode.push(code)
     }
     else if (balanceQuantity_<=CompareQtyValue_)
     {
      if(InputQtyValue_>balanceQuantity_)       
      matcode.push(code)
     }

    }
    else{
      if(InputQtyValue_>CompareQtyValue_ || InputQtyValue2_ > CompareQtyValue_)       
    matcode.push(code)
    }
    }
    
  } 
  var uniq = matcode
  .map((name) => {
    return {
      count: 1,
      name: name
    }
  })
  .reduce((a, b) => {
    a[b.name] = (a[b.name] || 0) + b.count
    return a
  }, {})  
  var duplicates = Object.keys(uniq).filter((a) => uniq[a] > 0)
  if(duplicates.length>0)
  {
  duplicates= duplicates.map(itm => {
      return `${itm}`;
    })
    .join() || "-"
   // IsDuplicatItem = true;  
    DuplicatItem.push(
      {
        duplicates: duplicates,
        IsInvalidQty:true
      }      
    )  
  } 
  else{
    DuplicatItem.push(
      {
        duplicates: duplicates,
        IsInvalidQty:false
      });

  }

  return DuplicatItem;
};

export const GetTotalQtyValue = (state,cardJsonPath,pagename,jasonpath,InputQtyValue,TotalValue,TotalQty) => {
  let  CardTotalQty =[];
  let InputQtyValue_ =0;
  let TotalValue_ = 0;
  let TotalQty_ = 0;
  let CardItem = get(
    state.screenConfiguration.screenConfig[`${pagename}`],
    cardJsonPath,
    []
  );

  for (let index = 0; index < CardItem.length; index++) {
    if(CardItem[index].isDeleted === undefined ||
    CardItem[index].isDeleted !== false)
    {   
     InputQtyValue_ = InputQtyValue_+ get(state.screenConfiguration.preparedFinalObject,`${jasonpath}[${index}].${InputQtyValue}`,0) 
    TotalValue_  = TotalValue_+ get(state.screenConfiguration.preparedFinalObject,`${jasonpath}[${index}].${TotalValue}`,0)  
    TotalQty_ = TotalQty_ + Number( get(state.screenConfiguration.preparedFinalObject,`${jasonpath}[${index}].${TotalQty}`,0))
    }
  }
  CardTotalQty.push(
    {
      InputQtyValue: InputQtyValue_,
      TotalValue : TotalValue_,
      TotalQty:TotalQty_
    }
  )

  return CardTotalQty;
};



export const getCommonFileUrl = (linkText="") => {
  const linkList = linkText.split(",");
  let fileURL = '';
  linkList&&linkList.map(link => {
    if (!link.includes('large') && !link.includes('medium') && !link.includes('small')) {
      fileURL = link;
    }
  })
  return fileURL;
}


// indent outword api call
export const getmaterialOutwordSearchResults = async queryObject => {

  try {
    store.dispatch(toggleSpinner());
    const response = await httpRequest(
      "post",
      "/store-asset-services/materialissues-to/_search",     
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


//Material Indent Inword Apis
export const getIndentInwordSearchResults = async queryObject => {

  try {
    store.dispatch(toggleSpinner());
    const response = await httpRequest(
      "post",
      "/store-asset-services/transferinwards/_search",     
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
export const creatIndentInword = async (queryObject, payload, dispatch,wfobject) => {
  try {
    const response = await httpRequest(
      "post",
      "/store-asset-services/transferinwards/_create",
      "",
      queryObject,
      { transferInwards: payload, workFlowDetails: wfobject }
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
export const updateIndentInword = async (queryObject, payload, dispatch) => {
  try {
    const response = await httpRequest(
      "post",
      "/store-asset-services/transferinwards/_update",
      "",
      queryObject,
      { transferInwards: payload }
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

export const getWFPayload = (state, dispatch) => {
  try {
    let businessSeviceTypeData =
      get(state, "screenConfiguration.preparedFinalObject.businessServiceTypeData.store-asset.businessService", [])

    let roles = JSON.parse(getUserInfo()).roles
    let businessServiceName = "";
    businessSeviceTypeData.map(item => {
      roles.some(r => {
        if (item.role.includes(r.code)) {
          businessServiceName = item.name
        }
      })
    });
    let wfobject = {
      "businessService": businessServiceName,
      "action": "CREATED",
      "comments": "",
      "assignee":[JSON.parse(getUserInfo()).uuid]
    }
    return wfobject;
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
