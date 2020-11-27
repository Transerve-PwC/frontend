import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import {
  prepareFinalObject,
  toggleSnackbar
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import get from "lodash/get";
import set from "lodash/set";
import {
  creatreceiptnotes,
  getreceiptnotesSearchResults,
  getPriceListSearchResults,
  GetMdmsNameBycode,
  getCommonFileUrl,
  updatereceiptnotes,
  getWFPayload
} from "../../../../../ui-utils/storecommonsapi";
import { getFileUrlFromAPI } from "egov-ui-framework/ui-utils/commons";  
import {
  convertDateToEpoch,
  epochToYmdDate,
  showHideAdhocPopup,
  validateFields
} from "../../utils";
import { getTenantId } from "egov-ui-kit/utils/localStorageUtils";
import { handleScreenConfigurationFieldChange as handleField } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import {  
  samplematerialsSearch,
  
  } from "../../../../../ui-utils/sampleResponses";
// SET ALL SIMPLE DATES IN YMD FORMAT
const setDateInYmdFormat = (obj, values) => {
  values.forEach(element => {
    set(obj, element, epochToYmdDate(get(obj, element)));
  });
};

// SET ALL MULTIPLE OBJECT DATES IN YMD FORMAT
const setAllDatesInYmdFormat = (obj, values) => {
  values.forEach(element => {
    let elemObject =
      get(obj, `${element.object}`, []) === null
        ? []
        : get(obj, `${element.object}`, []);
    for (let i = 0; i < elemObject.length; i++) {
      element.values.forEach(item => {
        set(
          obj,
          `${element.object}[${i}].${item}`,
          epochToYmdDate(get(obj, `${element.object}[${i}].${item}`))
        );
      });
    }
  });
};

// SET ALL MULTIPLE OBJECT EPOCH DATES YEARS
const setAllYears = (obj, values) => {
  values.forEach(element => {
    let elemObject =
      get(obj, `${element.object}`, []) === null
        ? []
        : get(obj, `${element.object}`, []);
    for (let i = 0; i < elemObject.length; i++) {
      element.values.forEach(item => {
        let ymd = epochToYmdDate(get(obj, `${element.object}[${i}].${item}`));
        let year = ymd ? ymd.substring(0, 4) : null;
        year && set(obj, `${element.object}[${i}].${item}`, year);
      });
    }
  });
};

const setRolesData = obj => {
  let roles = get(obj, "user.roles", []);
  let newRolesArray = [];
  roles.forEach(element => {
    newRolesArray.push({
      label: element.name,
      value: element.code
    });
  });
  set(obj, "user.roles", newRolesArray);
};

const returnEmptyArrayIfNull = value => {
  if (value === null || value === undefined) {
    return [];
  } else {
    return value;
  }
};
const getFileUrl = async (dispatch,tenantId,fileStoreId)=>{

  //fileStoreId = "242e3bc6-7f42-444e-b562-6f23468f6e72"
  if(tenantId.includes("."))
  {
 
    var vStr = tenantId.split('.');

    tenantId = vStr[0];
  }
  //tenantId = 
  let FileURL = "";
  getFileUrlFromAPI(fileStoreId,tenantId).then(async(fileRes) => {
    console.log(fileRes)
    console.log("fileRes")
    FileURL = fileRes.fileStoreIds[0].url
    FileURL = getCommonFileUrl(FileURL)
    let  documentsPreview= [
      {
        title: "STORE_DOCUMENT_TYPE_MATERIAL_RECEIPT_NOTE",
        linkText: "VIEW", 
        link:FileURL,//"https://chstage.blob.core.windows.net/fileshare/ch/undefined/July/15/1594826295177document.pdf?sig=R3nzPxT9MRMfROREe6LHEwuGfeVxB%2FKneAeWrDJZvOs%3D&st=2020-07-15T15%3A21%3A01Z&se=2020-07-16T15%3A21%3A01Z&sv=2016-05-31&sp=r&sr=b",
          
      },]     
    dispatch(
      prepareFinalObject("documentsPreview", documentsPreview)
    );
  });  
 
}
export const setRolesList = (state, dispatch) => {
  let rolesList = get(
    state.screenConfiguration.preparedFinalObject,
    `Employee[0].user.roles`,
    []
  );
  let furnishedRolesList = rolesList.map(item => {
    return " " + item.label;
  });
  dispatch(
    prepareFinalObject(
      "hrms.reviewScreen.furnishedRolesList",
      furnishedRolesList.join()
    )
  );
};

const setDeactivationDocuments = (state, dispatch) => {
  // GET THE DEACTIVATION DOCUMENTS FROM UPLOAD FILE COMPONENT
  let deactivationDocuments = get(
    state.screenConfiguration.preparedFinalObject,
    `deactivationDocuments`,
    []
  );
  // FORMAT THE NEW DOCUMENTS ARRAY ACCORDING TO THE REQUIRED STRUCTURE
  let addedDocuments = deactivationDocuments.map(document => {
    return {
      documentName: get(document, "fileName", ""),
      documentId: get(document, "fileStoreId", ""),
      referenceType: "DEACTIVATION"
    };
  });
  // GET THE PREVIOUS DOCUMENTS FROM EMPLOYEE OBJECT
  let documents = get(
    state.screenConfiguration.preparedFinalObject,
    `Employee[0].documents`,
    []
  );
  // ADD THE NEW DOCUMENTS TO PREVIOUS DOCUMENTS
  documents = [...documents, ...addedDocuments];
  // SAVE THE DOCUMENTS BACK TO EMPLOYEE
  dispatch(prepareFinalObject("Employee[0].documents", documents));
};

// Remove objects from Arrays not having the specified key (eg. "id")
// and add the key-value isActive:false in those objects having the key
// so as to deactivate them after the API call
const handleDeletedCards = (jsonObject, jsonPath, key) => {
  let originalArray = get(jsonObject, jsonPath, []);
  let modifiedArray = originalArray.filter(element => {
    return element.hasOwnProperty(key) || !element.hasOwnProperty("isDeleted");
  });
  modifiedArray = modifiedArray.map(element => {
    if (element.hasOwnProperty("isDeleted")) {
      element["isActive"] = false;
    }
    return element;
  });
  set(jsonObject, jsonPath, modifiedArray);
};

export const furnishindentData = (state, dispatch) => {
  let materialReceipt = get(
    state.screenConfiguration.preparedFinalObject,
    "materialReceipt",
    []
  );
   setDateInYmdFormat(materialReceipt[0], ["inspectionDate","receiptDate","challanDate", "supplierBillDate" ]);
  setAllDatesInYmdFormat(materialReceipt[0], [
   // { object: "indent.materialIssueDetails[0]", values: ["ManufacturerDate",] },
    { object: "receiptDetails", values: ["receiptDetailsAddnInfo[0].manufactureDate","receiptDetailsAddnInfo[0].expiryDate"] },
    
  ]);
  // setAllYears(materialReceipt[0], [
  //   { object: "education", values: ["yearOfPassing"] },
  //   { object: "tests", values: ["yearOfPassing"] }
  // ]);
  // setRolesData(materialReceipt[0]);
  // setRolesList(state, dispatch);
  dispatch(prepareFinalObject("materialReceipt", materialReceipt));
};

export const handleCreateUpdateMaterialReceipt = (state, dispatch) => {
  let id = get(
    state.screenConfiguration.preparedFinalObject,
    "materialReceipt[0].id",
    null
  );
  if (id) {
    
    createUpdateMR(state, dispatch, "UPDATE");
  } else {
    createUpdateMR(state, dispatch, "CREATE");
  }
};

export const createUpdateMR = async (state, dispatch, action) => {
  const pickedTenant = get(
    state.screenConfiguration.preparedFinalObject,
    "materialReceipt[0].tenantId"
  );
  const tenantId =  getTenantId();
  let queryObject = [
    {
      key: "tenantId",
      value: tenantId
    }
  ];
 
  let materialReceipt = get(
    state.screenConfiguration.preparedFinalObject,
    "materialReceipt",
    []
  );
  set(materialReceipt[0], "tenantId", tenantId);
  // get set date field into epoch

  let receiptDate =
  get(state, "screenConfiguration.preparedFinalObject.materialReceipt[0].receiptDate",0) 
  receiptDate = convertDateToEpoch(receiptDate, "dayStart");
  set(materialReceipt[0],"receiptDate", receiptDate);
  let supplierBillDate =
  get(state, "screenConfiguration.preparedFinalObject.materialReceipt[0].supplierBillDate",0) 
  supplierBillDate = convertDateToEpoch(supplierBillDate, "dayStart");
  set(materialReceipt[0],"supplierBillDate", supplierBillDate);
  let challanDate =
  get(state, "screenConfiguration.preparedFinalObject.materialReceipt[0].challanDate",0) 
  challanDate = convertDateToEpoch(challanDate, "dayStart");
  set(materialReceipt[0],"challanDate", challanDate);
  let inspectionDate =
  get(state, "screenConfiguration.preparedFinalObject.materialReceipt[0].inspectionDate",0) 
  inspectionDate = convertDateToEpoch(inspectionDate, "dayStart");
  set(materialReceipt[0],"inspectionDate", inspectionDate);
  let fileStoreId =
  get(state, "screenConfiguration.preparedFinalObject.documentsUploadRedux[0].documents[0].fileStoreId",0)  
  set(materialReceipt[0],"fileStoreId", fileStoreId);

  let receiptDetails_ = returnEmptyArrayIfNull(
    get(materialReceipt[0], "receiptDetails", [])
  );
  for (let index = 0; index < receiptDetails_.length; index++) {
    const element = receiptDetails_[index];   
       set(materialReceipt[0], `receiptDetails[${index}].receiptDetailsAddnInfo[0].lotNo`, element.lotNo);
       set(materialReceipt[0], `receiptDetails[${index}].receiptDetailsAddnInfo[0].serialNo`, element.serialNo);
       set(materialReceipt[0], `receiptDetails[${index}].receiptDetailsAddnInfo[0].batchNo`, element.batchNo);
       set(materialReceipt[0], `receiptDetails[${index}].receiptDetailsAddnInfo[0].manufactureDate`, convertDateToEpoch(element.manufactureDate, "dayStart"));
       set(materialReceipt[0], `receiptDetails[${index}].receiptDetailsAddnInfo[0].expiryDate`, convertDateToEpoch(element.expiryDate, "dayStart"));
       
  }

  // set date to epoch in  price list material name
  let receiptDetails = returnEmptyArrayIfNull(
    get(materialReceipt[0], "receiptDetails[0].receiptDetailsAddnInfo", [])
  );



  for (let i = 0; i < receiptDetails.length; i++) {
    set(
      materialReceipt[0],
      `receiptDetails[${i}].receiptDetailsAddnInfo[0].manufactureDate`,
      convertDateToEpoch(
        get(materialReceipt[0], `receiptDetails[${i}].receiptDetailsAddnInfo[0].manufactureDate`),
        "dayStart"
      )
    );
    set(
      materialReceipt[0],
      `receiptDetails[${i}].receiptDetailsAddnInfo[0].expiryDate`,
      convertDateToEpoch(
        get(materialReceipt[0], `receiptDetails[${i}].receiptDetailsAddnInfo[0].expiryDate`),
        "dayStart"
      )
    );
  }

  

  //set defailt value
  let id = get(
    state.screenConfiguration.preparedFinalObject,
    "materialReceipt[0].id",
    null
  );
  if(id === null)
  {
    // set(materialReceipt[0],"indentNumber", "");
    // set(materialReceipt[0],"indentType", "Indent");
    // set(materialReceipt[0],"materialHandOverTo", "Test");
    // set(materialReceipt[0],"designation", "");
  }
 
  



  if (action === "CREATE") {
    try {
      let wfobject = getWFPayload(state, dispatch)
      console.log(queryObject)
      console.log("queryObject")
      let response = await creatreceiptnotes(
        queryObject,        
        materialReceipt,
        dispatch,
        wfobject
      );
      if(response){
        let mrnNumber = response.MaterialReceipt[0].mrnNumber
        //dispatch(setRoute(`/egov-store-asset/acknowledgement?screen=MATERIALRECEIPT&mode=create&code=${mrnNumber}`));
        dispatch(setRoute(`/egov-store-asset/view-material-receipt-note?applicationNumber=${mrnNumber}&tenantId=${response.MaterialReceipt[0].tenantId}&Status=${response.MaterialReceipt[0].mrnStatus}`));}
    } catch (error) {
      furnishindentData(state, dispatch);
    }
  } else if (action === "UPDATE") {
    try {
      let response = await updatereceiptnotes(
        queryObject,
        materialReceipt,
        dispatch
      );
      if(response){
        let mrnNumber = response.MaterialReceipt[0].mrnNumber
        //dispatch(setRoute(`/egov-store-asset/acknowledgement?screen=MATERIALRECEIPT&mode=update&code=${mrnNumber}`));
        dispatch(setRoute(`/egov-store-asset/view-material-receipt-note?applicationNumber=${mrnNumber}&tenantId=${response.MaterialReceipt[0].tenantId}&Status=${response.MaterialReceipt[0].mrnStatus}`));}
    } catch (error) {
      furnishindentData(state, dispatch);
    }
  }

};

export const getMaterialIndentData = async (
  state,
  dispatch,
  id,
  tenantId,
  mrnNumber
) => {
  let queryObject = [
    // {
    //   key: "ids",
    //   value: id
    // },
    {
      key: "mrnNumber",
      value: mrnNumber
    },
    {
      key: "tenantId",
      value: tenantId
    }
  ];

 let response = await getreceiptnotesSearchResults(queryObject, dispatch);
// let response = samplematerialsSearch();
//response = response.MaterialReceipt.filter(x=>x.id===id)
response = response.MaterialReceipt.filter(x => x.mrnNumber === mrnNumber)
let totalvalue = 0
let TotalQty = 0;

  if(response && response[0])
  {

    set(response[0], `challanDate`, epochToYmdDate(response[0].challanDate));
    set(response[0], `receiptDate`, epochToYmdDate(response[0].receiptDate));
    set(response[0], `supplierBillDate`, epochToYmdDate(response[0].supplierBillDate));
    set(response[0], `inspectionDate`, epochToYmdDate(response[0].inspectionDate));
   
  for (let index = 0; index < response[0].receiptDetails.length; index++) {
    const element = response[0].receiptDetails[index];
    let Uomname = GetMdmsNameBycode(state, dispatch,"viewScreenMdmsData.common-masters.UOM",element.uom.code)    
       
       set(response[0], `receiptDetails[${index}].uom.name`, Uomname);
       set(response[0], `receiptDetails[${index}].lotNo`, element.receiptDetailsAddnInfo[0].lotNo);
       set(response[0], `receiptDetails[${index}].serialNo`, element.receiptDetailsAddnInfo[0].serialNo);
       set(response[0], `receiptDetails[${index}].batchNo`, element.receiptDetailsAddnInfo[0].batchNo);
       set(response[0], `receiptDetails[${index}].manufactureDate`, epochToYmdDate(element.receiptDetailsAddnInfo[0].manufactureDate));
       set(response[0], `receiptDetails[${index}].expiryDate`, epochToYmdDate(element.receiptDetailsAddnInfo[0].expiryDate));
       totalvalue = totalvalue+( Number(element.acceptedQty) *element.unitRate)
      
       TotalQty = TotalQty + Number(element.acceptedQty)
       
  }
}

set(response[0],`totalQty`, TotalQty);
set(response[0],`totalvalue`, totalvalue);
getFileUrl(dispatch,tenantId,response[0].fileStoreId);
dispatch(prepareFinalObject("materialReceipt", response));
 // furnishindentData(state, dispatch);
};
