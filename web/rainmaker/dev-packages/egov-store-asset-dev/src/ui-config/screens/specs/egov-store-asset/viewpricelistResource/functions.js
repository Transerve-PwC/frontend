import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import {
  prepareFinalObject,
  toggleSnackbar
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import get from "lodash/get";
import set from "lodash/set";
import {
  createPriceList,
  getMaterialMasterSearchResults,
  getPriceListSearchResults,
  UpdatePriceList,
  GetMdmsNameBycode,
  getCommonFileUrl
} from "../../../../../ui-utils/storecommonsapi";
import {
  convertDateToEpoch,
  epochToYmdDate,
  showHideAdhocPopup,
  validateFields
} from "../../utils";
import { getFileUrlFromAPI } from "egov-ui-framework/ui-utils/commons";  
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

export const furnishPriceListData = (state, dispatch) => {
  let priceLists = get(
    state.screenConfiguration.preparedFinalObject,
    "priceLists",
    []
  );
  setDateInYmdFormat(priceLists[0], ["agreementDate", "agreementEndDate","agreementStartDate","rateContractDate"]);
  // setAllDatesInYmdFormat(priceLists[0], [
  //   { object: "assignments", values: ["fromDate", "toDate"] },
   
  // ]);
  // setAllYears(priceLists[0], [
  //   { object: "education", values: ["yearOfPassing"] },
  //   { object: "tests", values: ["yearOfPassing"] }
  // ]);
  // setRolesData(priceLists[0]);
  // setRolesList(state, dispatch);
  dispatch(prepareFinalObject("priceLists", priceLists));
};

export const handleCreateUpdatePriceList = (state, dispatch) => {
  let id = get(
    state.screenConfiguration.preparedFinalObject,
    "priceLists[0].id",
    null
  );
  if (id) {
    createUpdatePriceList(state, dispatch, "UPDATE");
  } else {
    createUpdatePriceList(state, dispatch, "CREATE");
  }
};

export const createUpdatePriceList = async (state, dispatch, action) => {
  const pickedTenant = get(
    state.screenConfiguration.preparedFinalObject,
    "priceLists[0].tenantId"
  );
  const tenantId =  getTenantId();
  let queryObject = [
    {
      key: "tenantId",
      value: tenantId
    }
  ];
 
  let priceLists = get(
    state.screenConfiguration.preparedFinalObject,
    "priceLists",
    []
  );
  set(priceLists[0], "tenantId", tenantId);
  set(priceLists[0], "status", true);
  // get set date field into epoch

  let rateContractDate =
  get(state, "screenConfiguration.preparedFinalObject.priceLists[0].rateContractDate",0) 
  rateContractDate = convertDateToEpoch(rateContractDate);
  set(priceLists[0],"rateContractDate", rateContractDate);

  let agreementDate =
  get(state, "screenConfiguration.preparedFinalObject.priceLists[0].agreementDate",0) 
  agreementDate = convertDateToEpoch(agreementDate);
  set(priceLists[0],"agreementDate", agreementDate);

  let agreementStartDate =
  get(state, "screenConfiguration.preparedFinalObject.priceLists[0].agreementStartDate",0) 
  agreementStartDate = convertDateToEpoch(agreementStartDate);
  set(priceLists[0],"agreementStartDate", agreementStartDate);

  let agreementEndDate =
  get(state, "screenConfiguration.preparedFinalObject.priceLists[0].agreementEndDate",0) 
  agreementEndDate = convertDateToEpoch(agreementEndDate);
  set(priceLists[0],"agreementEndDate", agreementEndDate);
  // priceLists[0].priceListDetails[0].uom.code
  let UOMList = get(state, "screenConfiguration.preparedFinalObject.createScreenMdmsData.common-masters.UOM",[]) 
  let UOM =  get(state, "screenConfiguration.preparedFinalObject.priceLists[0].priceListDetails[0].uom.code",'') 

  // let conversionFactor = UOMList.filter(x=> x.code === UOM)
  // set(priceLists[0],"priceListDetails[0].uom.conversionFactor", conversionFactor[0].conversionFactor);
  let fileStoreId =
  get(state, "screenConfiguration.preparedFinalObject.documentsUploadRedux[0].documents[0].fileStoreId",0)  
  set(priceLists[0],"fileStoreId", fileStoreId);
  // set date to epoch in  price list material name
  let priceListDetails = returnEmptyArrayIfNull(
    get(priceLists[0], "priceListDetails", [])
  );
  for (let i = 0; i < priceListDetails.length; i++) {
    const element = priceListDetails[i];
    let conversionFactor = UOMList.filter(x=> x.code === element.uom.code)
    set(
      priceLists[0],
      `priceListDetails[${i}].uom.conversionFactor`,
      conversionFactor[0].conversionFactor
    );
    
  }
  //handleDeletedCards(priceLists[0], "storeMapping", "id");
 

  



  if (action === "CREATE") {
    try {
      console.log(queryObject)
      console.log("queryObject")
      let response = await createPriceList(
        queryObject,        
        priceLists,
        dispatch
      );
      // let employeeId = get(response, "Employees[0].code");
      // const acknowledgementUrl =
      //   process.env.REACT_APP_SELF_RUNNING === "true"
      //     ? `/egov-ui-framework/hrms/acknowledgement?purpose=create&status=success&applicationNumber=${employeeId}`
      //     : `/hrms/acknowledgement?purpose=create&status=success&applicationNumber=${employeeId}`;
      // dispatch(setRoute(acknowledgementUrl));
      if(response){
        dispatch(setRoute(`/egov-store-asset/acknowledgement?screen=PRICELIST&mode=create&code=`));
       }
    } catch (error) {
      furnishPriceListData(state, dispatch);
    }
  } else if (action === "UPDATE") {
    try {
      let response = await UpdatePriceList(
        queryObject,
        priceLists,
        dispatch
      );
      // let employeeId = response && get(response, "Employees[0].code");
      // const acknowledgementUrl =
      //   process.env.REACT_APP_SELF_RUNNING === "true"
      //     ? `/egov-ui-framework/hrms/acknowledgement?purpose=update&status=success&applicationNumber=${employeeId}`
      //     : `/hrms/acknowledgement?purpose=update&status=success&applicationNumber=${employeeId}`;
      // dispatch(setRoute(acknowledgementUrl));
      if(response){
        dispatch(setRoute(`/egov-store-asset/acknowledgement?screen=priceList&mode=update&code=`));
       }
    } catch (error) {
      furnishPriceListData(state, dispatch);
    }
  }

};

export const getMaterialmasterData = async (
  state,
  dispatch,
  code,
  tenantId
) => {
  let queryObject = [
    {
      key: "code",
      value: code
    },
    {
      key: "tenantId",
      value: tenantId
    }
  ];

 let response = await getMaterialMasterSearchResults(queryObject, dispatch);
// let response = samplematerialsSearch();
  dispatch(prepareFinalObject("materials", get(response, "materials")));
  dispatch(
    handleField(
      "create",
      "components.div.children.headerDiv.children.header.children.header.children.key",
      "props",
      {
        labelName: "Edit Material Maste",
        labelKey: "STORE_EDITMATERIAL_MASTER_HEADER"
      }
    )
  );
 // furnishPriceListData(state, dispatch);
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
        title: "STORE_DOCUMENT_TYPE_RATE_CONTRACT_QUATION",
        linkText: "VIEW", 
        link:FileURL,//"https://chstage.blob.core.windows.net/fileshare/ch/undefined/July/15/1594826295177document.pdf?sig=R3nzPxT9MRMfROREe6LHEwuGfeVxB%2FKneAeWrDJZvOs%3D&st=2020-07-15T15%3A21%3A01Z&se=2020-07-16T15%3A21%3A01Z&sv=2016-05-31&sp=r&sr=b",
          
      },]     
    dispatch(
      prepareFinalObject("documentsPreview", documentsPreview)
    );
  });  
 
}
export const getPriceLstData = async (
  state,
  dispatch,
  id,
  tenantId
) => {
  let queryObject = [
    {
      key: "id",
      value: id
    },
    {
      key: "tenantId",
      value: tenantId
    }
  ];

 let response = await getPriceListSearchResults(queryObject, dispatch);
 response = response.priceLists.filter(x=>x.id === id)
  //dispatch(prepareFinalObject("priceLists", get(response, "priceLists")));
  if(response && response[0])
  {
  for (let index = 0; index < response[0].priceListDetails.length; index++) {
    const element = response[0].priceListDetails[index];
   let Uomname = GetMdmsNameBycode(state, dispatch,"viewScreenMdmsData.common-masters.UOM",element.uom.code) 
   let matname = GetMdmsNameBycode(state, dispatch,"viewScreenMdmsData.store-asset.Material",element.material.code) 
      // dispatch(
      //   prepareFinalObject(
      //     `priceLists[0].priceListDetails[${index}].uom.name`,
      //     uonname,
      //   )
      // );

      set(response[0], `priceListDetails[${index}].uom.name`, Uomname);
      set(response[0], `priceListDetails[${index}].material.name`, matname);    
    
  }
}

getFileUrl(dispatch,tenantId,response[0].fileStoreId);
  dispatch(prepareFinalObject("priceLists", response));
  // dispatch(
  //   handleField(
  //     "create",
  //     "components.div.children.headerDiv.children.header.children.header.children.key",
  //     "props",
  //     {
  //       labelName: "Edit Material Maste",
  //       labelKey: "STORE_EDITMATERIAL_MASTER_HEADER"
  //     }
  //   )
  // );
  furnishPriceListData(state, dispatch);
};
