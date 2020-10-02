import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import {
  prepareFinalObject,
  toggleSnackbar
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import get from "lodash/get";
import set from "lodash/set";
import {
  createMaterial,
  getOpeningBalanceSearchResults,
  updateMaterial
} from "../../../../../ui-utils/storecommonsapi";
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

export const furnishmaterialsData = (state, dispatch) => {
  let employeeObject = get(
    state.screenConfiguration.preparedFinalObject,
    "Employee",
    []
  );
  setDateInYmdFormat(employeeObject[0], ["dateOfAppointment", "user.dob"]);
  setAllDatesInYmdFormat(employeeObject[0], [
    { object: "assignments", values: ["fromDate", "toDate"] },
    { object: "serviceHistory", values: ["serviceFrom", "serviceTo"] }
  ]);
  setAllYears(employeeObject[0], [
    { object: "education", values: ["yearOfPassing"] },
    { object: "tests", values: ["yearOfPassing"] }
  ]);
  setRolesData(employeeObject[0]);
  setRolesList(state, dispatch);
  dispatch(prepareFinalObject("Employee", employeeObject));
};

export const handleCreateUpdateMaterialMaster = (state, dispatch) => {
  let uuid = get(
    state.screenConfiguration.preparedFinalObject,
    "Employee[0].uuid",
    null
  );
  if (uuid) {
    createUpdateMaterialMaster(state, dispatch, "UPDATE");
  } else {
    createUpdateMaterialMaster(state, dispatch, "CREATE");
  }
};

export const createUpdateMaterialMaster = async (state, dispatch, action) => {
  const pickedTenant = get(
    state.screenConfiguration.preparedFinalObject,
    "materials[0].tenantId"
  );
  const tenantId =  getTenantId();
  let queryObject = [
    {
      key: "tenantId",
      value: tenantId
    }
  ];
 
  let materialsObject = get(
    state.screenConfiguration.preparedFinalObject,
    "materials",
    []
  );
  set(materialsObject[0], "tenantId", tenantId);
  set(materialsObject[0], "status", true);
  //handleDeletedCards(materialsObject[0], "storeMapping", "id");
 

  



  if (action === "CREATE") {
    try {
      console.log(queryObject)
      console.log("queryObject")
      let response = await createMaterial(
        queryObject,
        tenantId,
        materialsObject,
        dispatch
      );
      // let employeeId = get(response, "Employees[0].code");
      // const acknowledgementUrl =
      //   process.env.REACT_APP_SELF_RUNNING === "true"
      //     ? `/egov-ui-framework/hrms/acknowledgement?purpose=create&status=success&applicationNumber=${employeeId}`
      //     : `/hrms/acknowledgement?purpose=create&status=success&applicationNumber=${employeeId}`;
      // dispatch(setRoute(acknowledgementUrl));
    } catch (error) {
      furnishmaterialsData(state, dispatch);
    }
  } else if (action === "UPDATE") {
    try {
      let response = await updateMaterial(
        queryObject,
        materialsObject,
        dispatch
      );
      // let employeeId = response && get(response, "Employees[0].code");
      // const acknowledgementUrl =
      //   process.env.REACT_APP_SELF_RUNNING === "true"
      //     ? `/egov-ui-framework/hrms/acknowledgement?purpose=update&status=success&applicationNumber=${employeeId}`
      //     : `/hrms/acknowledgement?purpose=update&status=success&applicationNumber=${employeeId}`;
      // dispatch(setRoute(acknowledgementUrl));
    } catch (error) {
      furnishmaterialsData(state, dispatch);
    }
  }

};

export const getOpeningBalanceData = async (
  state,
  dispatch,
  mrnNumber,
  tenantId
) => {
  let queryObject = [
    {
      key: "mrnNumber",
      value: mrnNumber
    },
    {
      key: "tenantId",
      value: tenantId
    }
  ];

 let response = await getOpeningBalanceSearchResults(queryObject, dispatch);
// let response = samplematerialsSearch();
///
// let  materialReceipt = response.materialReceipt
// materialReceipt = materialReceipt.filter(x=>x.mrnNumber === mrnNumber)
response = response.materialReceipt.filter(x => x.mrnNumber === mrnNumber)
if(response && response[0])
  {
  for (let index = 0; index < response[0].receiptDetails.length; index++) {
    const element = response[0].receiptDetails[index];
   
       set(response[0], `receiptDetails[${index}].lotNo`, element.receiptDetailsAddnInfo[0].lotNo);
       set(response[0], `receiptDetails[${index}].expiryDate`, epochToYmdDate(element.receiptDetailsAddnInfo[0].expiryDate));
       set(response[0], `receiptDetails[${index}].receivedDate`, epochToYmdDate(element.receiptDetailsAddnInfo[0].receivedDate));
       set(response[0], `receiptDetails[${index}].userAcceptedQty`, element.receiptDetailsAddnInfo[0].userQuantity);       
       set(response[0], `receiptDetails[${index}].oldReceiptNumber`, element.receiptDetailsAddnInfo[0].oldReceiptNumber);
      
       
  }
  dispatch(prepareFinalObject("materialReceipt", response));
}
////

 
 // dispatch(prepareFinalObject("materials", get(response, "materials")));

 // furnishmaterialsData(state, dispatch);
};
