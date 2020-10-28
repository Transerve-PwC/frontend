import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import {
  prepareFinalObject,
  toggleSnackbar
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import get from "lodash/get";
import set from "lodash/set";
import {
  creatematerialissues,
  getmaterialissuesSearchResults,
  getMaterialIndentSearchResults,
  getPriceListSearchResults,
  GetMdmsNameBycode,
  updatematerialissues,
  getWFPayload
} from "../../../../../ui-utils/storecommonsapi";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
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
  let materialIssues = get(
    state.screenConfiguration.preparedFinalObject,
    "materialIssues",
    []
  );
   setDateInYmdFormat(materialIssues[0], ["issueDate", ]);
  // setAllDatesInYmdFormat(materialIssues[0], [
  //   { object: "assignments", values: ["fromDate", "toDate"] },
  //   { object: "priceListDetails", values: ["serviceFrom", "serviceTo"] }
  // ]);
  // setAllYears(materialIssues[0], [
  //   { object: "education", values: ["yearOfPassing"] },
  //   { object: "tests", values: ["yearOfPassing"] }
  // ]);
  // setRolesData(materialIssues[0]);
  // setRolesList(state, dispatch);
  dispatch(prepareFinalObject("materialIssues", materialIssues));
};

export const handleCreateUpdateIndent = (state, dispatch) => {
  let id = get(
    state.screenConfiguration.preparedFinalObject,
    "materialIssues[0].id",
    null
  );
  if (id) {
    
    createUpdateIndent(state, dispatch, "UPDATE");
  } else {
    createUpdateIndent(state, dispatch, "CREATE");
  }
};

export const createUpdateIndent = async (state, dispatch, action) => {
  const pickedTenant = get(
    state.screenConfiguration.preparedFinalObject,
    "materialIssues[0].tenantId"
  );
  const tenantId =  getTenantId();
  let queryObject = [
    {
      key: "tenantId",
      value: tenantId
    }
  ];
 
  let materialIssues = get(
    state.screenConfiguration.preparedFinalObject,
    "materialIssues",
    []
  );
  set(materialIssues[0], "tenantId", tenantId);
  // get set date field into epoch

  let issueDate =
  get(state, "screenConfiguration.preparedFinalObject.materialIssues[0].issueDate",0) 
  issueDate = convertDateToEpoch(issueDate);
  set(materialIssues[0],"issueDate", issueDate);


  let indentDate =
  get(state, "screenConfiguration.preparedFinalObject.materialIssues[0].indent.indentDate",0) 
  indentDate = convertDateToEpoch(indentDate);
  set(materialIssues[0],"indent.indentDate", indentDate);

  let expectedDeliveryDate =
  get(state, "screenConfiguration.preparedFinalObject.materialIssues[0].expectedDeliveryDate",0) 
  expectedDeliveryDate = convertDateToEpoch(expectedDeliveryDate);
  set(materialIssues[0],"indent.expectedDeliveryDate", expectedDeliveryDate);

  

  //set defailt value
  let id = get(
    state.screenConfiguration.preparedFinalObject,
    "materialIssues[0].id",
    null
  );
  if(id === null)
  {
    // set(materialIssues[0],"indentNumber", "");
    // set(materialIssues[0],"indentType", "Indent");
    // set(materialIssues[0],"materialHandOverTo", "Test");
    // set(materialIssues[0],"designation", "");

      //get and set indentDetail id from indent --> indentDetail objet

      let indentDetails = get(
        state.screenConfiguration.preparedFinalObject,
        "materialIssues[0].indent.indentDetails",
        []
      );
      let materialIssueDetails = get(
        state.screenConfiguration.preparedFinalObject,
        "materialIssues[0].materialIssueDetails",
        []
      );
      for (let index = 0; index < materialIssueDetails.length; index++) {
        const element = materialIssueDetails[index];
        dispatch(
          prepareFinalObject(
            `materialIssues[0].materialIssueDetails[${index}].indentDetail.id`,
            indentDetails[index].id,
          )
        );
        
      }
  }
  



  // set date to epoch in  price list material name
  let priceListDetails = returnEmptyArrayIfNull(
    get(materialIssues[0], "indent.materialIssueDetails[0]", [])
  );
 
  //handleDeletedCards(materialIssues[0], "storeMapping", "id");
 

  



  if (action === "CREATE") {
    try {
      let wfobject = getWFPayload(state, dispatch)

      console.log(queryObject)
      console.log("queryObject")
      let response = await creatematerialissues(
        queryObject,        
        materialIssues,
        dispatch,
        wfobject
      );
      if(response){
        let indentNumber = response.materialIssues[0].issueNumber
       // dispatch(setRoute(`/egov-store-asset/acknowledgement?screen=MATERIALINDENT&mode=create&code=${indentNumber}`));
       dispatch(setRoute(`/egov-store-asset/view-indent-note?applicationNumber=${indentNumber}&tenantId=${response.materialIssues[0].tenantId}&Status=${response.materialIssues[0].materialIssueStatus}`)); 
      }
    } catch (error) {
      //alert('123')
      furnishindentData(state, dispatch);
    }
  } else if (action === "UPDATE") {
    try {
      let response = await updatematerialissues(
        queryObject,
        materialIssues,
        dispatch
      );
      if(response){
        let issueNumber = response.materialIssues[0].issueNumber
        //dispatch(setRoute(`/egov-store-asset/acknowledgement?screen=MATERIALINDENT&mode=update&code=${indentNumber}`));
        dispatch(setRoute(`/egov-store-asset/view-indent-note?applicationNumber=${issueNumber}&tenantId=${response.materialIssues[0].tenantId}&Status=${response.materialIssues[0].materialIssueStatus}`)); 
      }
    } catch (error) {
      furnishindentData(state, dispatch);
    }
  }

};

export const getMaterialIndentData = async (
  state,
  dispatch,
  issueNumber,
  tenantId
) => {
  let queryObject = [
    {
      key: "issueNoteNumber",
      value: issueNumber
    },
    {
      key: "tenantId",
      value: tenantId
    }
  ];

 let response = await getmaterialissuesSearchResults(queryObject, dispatch);
// let response = samplematerialsSearch();
response = response.materialIssues.filter(x=>x.issueNumber === issueNumber)
let totalIndentQty = 0;
let totalvalue = 0
let TotalQty = 0;
if(response && response[0])
{
  for (let index = 0; index < response[0].materialIssueDetails.length; index++) {
    const element = response[0].materialIssueDetails[index];
   let Uomname = GetMdmsNameBycode(state, dispatch,"viewScreenMdmsData.common-masters.UOM",element.uom.code)  
   let matname = GetMdmsNameBycode(state, dispatch,"viewScreenMdmsData.store-asset.Material",element.material.code)  
   set(response[0], `materialIssueDetails[${index}].material.name`, matname);
   set(response[0], `materialIssueDetails[${index}].receiptId`, element.materialIssuedFromReceipts[index].materialReceiptId);
   //quantityIssued
   set(response[0], `materialIssueDetails[${index}].indentDetail.userQuantity`, Number(element.quantityIssued));
   set(response[0], `materialIssueDetails[${index}].uom.name`, Uomname);
   if(Number(response[0].indent.indentDetails[index].indentQuantity))
   set(response[0], `materialIssueDetails[${index}].indentDetail.indentQuantity`, Number(response[0].indent.indentDetails[index].indentQuantity) );
   set(response[0], `materialIssueDetails[${index}].indentDetail.projectCode.code`,(response[0].indent.indentDetails[index].projectCode.code) );
   set(response[0], `materialIssueDetails[${index}].indent.indentPurpose`,(response[0].indent.indentPurpose) );
   set(response[0], `materialIssueDetails[${index}].indentDetail.TotalValue`,  Number(element.value));
   totalvalue = totalvalue+ Number(element.value)
   //totalIndentQty = totalIndentQty+ Number(response[0].indent.indentDetails[index].indentQuantity)
   TotalQty = TotalQty + Number(element.quantityIssued)
  }
  let totalDeductionValue = response[0].totalDeductionValue
  set(response[0],`totalIndentQty`, Number(response[0].indent.indentDetails[0].indentQuantity));
  set(response[0],`totalQty`, TotalQty);
  set(response[0],`totalvalue`, totalvalue - totalDeductionValue);
  // set(prepareFinalObject(`materialIssues[0].indentQuantity`, totalIndentQty));
  // set(prepareFinalObject(`materialIssues[0].indentQuantity`, totalIndentQty));

  // dispatch(prepareFinalObject(`materialIssues[0].indentQuantity`, totalIndentQty));
  // dispatch(prepareFinalObject(`materialIssues[0].totalQty`, TotalQty));
  // dispatch(prepareFinalObject(`materialIssues[0].totalvalue`, totalvalue));
  // let IndentId = getQueryArg(window.location.href, "IndentId");
  // let queryObject_ = [
    
  //   {
  //     key: "ids",
  //     value: IndentId
  //   },
  //   {
  //     key: "tenantId",
  //     value: tenantId
  //   }
  // ];
  
}

  dispatch(prepareFinalObject("materialIssues", response));
  // let indentres = await getMaterialIndentSearchResults(queryObject, dispatch);
  // dispatch(prepareFinalObject("indents", get(indentres, "indents")));
  furnishindentData(state, dispatch);
};
