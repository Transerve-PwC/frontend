import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import {
  prepareFinalObject,
  toggleSnackbar
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import get from "lodash/get";
import set from "lodash/set";
import {
  createEmployee,
  getSearchResults,
  updateEmployee
} from "../../../../../ui-utils/commons";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import {
  convertDateToEpoch,
  epochToYmdDate,
  showHideAdhocPopup,
  validateFields
} from "../../utils";
import { getTenantId } from "egov-ui-kit/utils/localStorageUtils";
import { handleScreenConfigurationFieldChange as handleField } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import {  handleCardDelete } from "../../../../../ui-utils/commons";
import{httpRequest} from '../../../../../ui-utils/api'
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



export const handleCreateUpdatePO = (state, dispatch) => {
  let uuid = get(
    state.screenConfiguration.preparedFinalObject,
    "purchaseOrders[0].id",
    null
  );
  if (uuid) {
    createUpdatePO(state, dispatch, "UPDATE");
  } else {
    createUpdatePO(state, dispatch, "CREATE");
  }
};

export const createUpdatePO = async (state, dispatch, action) => {

  let purchaseOrders = get(
    state.screenConfiguration.preparedFinalObject,
    "purchaseOrders",
    []
  );
  let priceList = get(
    state.screenConfiguration.preparedFinalObject,
    "searchMaster.priceList",
    []
  );
  const tenantId =  getTenantId();
  purchaseOrders[0].tenantId = tenantId;
  let queryObject = [{ key: "tenantId", value: tenantId }];
 

  purchaseOrders = handleCardDelete(purchaseOrders, "purchaseOrderDetails", false);


  //SET TENANT IDS IN ALL NEWLY ADDED JURISDICTIONS, DOESNT CHANGE ALREADY PRESENT
  let poDetailArray = returnEmptyArrayIfNull(
    get(purchaseOrders[0], "purchaseOrderDetails", [])
  );
  for (let i = 0; i < poDetailArray.length; i++) {
    set(purchaseOrders[0], `purchaseOrderDetails[${i}].tenantId`, tenantId);
    // if ratebtype is GEM
    const {rateType} = purchaseOrders[0];  
    const {supplier} = purchaseOrders[0];  
    let priceListgem = get(
      state.screenConfiguration.preparedFinalObject,
      "purchaseOrders[0].priceList",
      []
    );
    const {rateContractNumber} = priceListgem[0];
    const {rateContractDate} = priceListgem[0];
    const {agreementNumber} = priceListgem[0];
    const {agreementDate} = priceListgem[0];
    const {agreementStartDate} = priceListgem[0];
    const {agreementEndDate} = priceListgem[0];
    if(rateType.toLocaleUpperCase() === 'GEM')
    {
      set(purchaseOrders[0], `purchaseOrderDetails[${i}].priceList.tenantId`, null);
      set(purchaseOrders[0], `purchaseOrderDetails[${i}].priceList.supplier.code`, supplier.code);
      set(purchaseOrders[0], `purchaseOrderDetails[${i}].priceList.supplier.name`, supplier.name);
      set(purchaseOrders[0], `purchaseOrderDetails[${i}].priceList.rateType`, "Gem");
      set(purchaseOrders[0], `rateType`, "Gem");
      dispatch(prepareFinalObject("purchaseOrders[0].rateType", "Gem"));  
      set(purchaseOrders[0], `purchaseOrderDetails[${i}].priceList.rateContractNumber`, rateContractNumber);
      set(purchaseOrders[0], `purchaseOrderDetails[${i}].priceList.rateContractDate`, convertDateToEpoch(rateContractDate));
      set(purchaseOrders[0], `purchaseOrderDetails[${i}].priceList.agreementNumber`, (agreementNumber));
      set(purchaseOrders[0], `purchaseOrderDetails[${i}].priceList.agreementDate`,convertDateToEpoch( agreementDate));
      set(purchaseOrders[0], `purchaseOrderDetails[${i}].priceList.agreementStartDate`, convertDateToEpoch(agreementStartDate));
      set(purchaseOrders[0], `purchaseOrderDetails[${i}].priceList.agreementEndDate`, convertDateToEpoch(agreementEndDate));
      set(purchaseOrders[0], `purchaseOrderDetails[${i}].priceList.active`, true);
    }
    else{
      set(purchaseOrders[0], `purchaseOrderDetails[${i}].priceList`, priceList[0]);

    }
    let indentNumber="";
    indentNumber = getQueryArg(window.location.href, "indentNumber");
   if(indentNumber){
    //set purchaseIndentDetails
    // get Indent details from Indent
   let indentDetails = get(state.screenConfiguration.preparedFinalObject, "indents[0].indentDetails", [])
   indentDetails = indentDetails.filter(x=>x.material.code === poDetailArray[i].material.code)
   if(indentDetails && indentDetails[0])
   {
    dispatch(prepareFinalObject(`purchaseOrders[0].purchaseOrderDetails[${i}].purchaseIndentDetails[0].id`, null));
    dispatch(prepareFinalObject(`purchaseOrders[0].purchaseOrderDetails[${i}].purchaseIndentDetails[0].tenantId`, tenantId));
    dispatch(prepareFinalObject(`purchaseOrders[0].purchaseOrderDetails[${i}].purchaseIndentDetails[0].indentDetail.id`, indentDetails[0].id));
    dispatch(prepareFinalObject(`purchaseOrders[0].purchaseOrderDetails[${i}].purchaseIndentDetails[0].quantity`, null));
    dispatch(prepareFinalObject(`purchaseOrders[0].purchaseOrderDetails[${i}].purchaseIndentDetails[0].indentDetail.tenantId`, tenantId));
    dispatch(prepareFinalObject(`purchaseOrders[0].purchaseOrderDetails[${i}].purchaseIndentDetails[0].indentDetail.material.code`, indentDetails[0].material.code));
    dispatch(prepareFinalObject(`purchaseOrders[0].purchaseOrderDetails[${i}].purchaseIndentDetails[0].indentDetail.uom.code`, indentDetails[0].uom.code));
    dispatch(prepareFinalObject(`purchaseOrders[0].purchaseOrderDetails[${i}].purchaseIndentDetails[0].indentDetail.parentIndentLine`, null));
    dispatch(prepareFinalObject(`purchaseOrders[0].purchaseOrderDetails[${i}].purchaseIndentDetails[0].indentDetail.projectCode`, null));
    dispatch(prepareFinalObject(`purchaseOrders[0].purchaseOrderDetails[${i}].purchaseIndentDetails[0].indentDetail.orderNumber`, null));
    dispatch(prepareFinalObject(`purchaseOrders[0].purchaseOrderDetails[${i}].purchaseIndentDetails[0].indentDetail.projectCode.code`, null));
    dispatch(prepareFinalObject(`purchaseOrders[0].purchaseOrderDetails[${i}].purchaseIndentDetails[0].indentDetail.asset`, null));
    dispatch(prepareFinalObject(`purchaseOrders[0].purchaseOrderDetails[${i}].purchaseIndentDetails[0].indentDetail.indentQuantity`, indentDetails[0].indentQuantity));
    dispatch(prepareFinalObject(`purchaseOrders[0].purchaseOrderDetails[${i}].purchaseIndentDetails[0].indentDetail.totalProcessedQuantity`, 0));
    dispatch(prepareFinalObject(`purchaseOrders[0].purchaseOrderDetails[${i}].purchaseIndentDetails[0].indentDetail.indentIssuedQuantity`, 0));
    dispatch(prepareFinalObject(`purchaseOrders[0].purchaseOrderDetails[${i}].purchaseIndentDetails[0].indentDetail.poOrderedQuantity`, 0));
    dispatch(prepareFinalObject(`purchaseOrders[0].purchaseOrderDetails[${i}].purchaseIndentDetails[0].indentDetail.interstoreRequestQuantity`, 0));
    //get deliveryTerms fron firstep UI Data
    dispatch(prepareFinalObject(`purchaseOrders[0].purchaseOrderDetails[${i}].purchaseIndentDetails[0].indentDetail.deliveryTerms`, get(state.screenConfiguration.preparedFinalObject, "purchaseOrders[0].deliveryTerms", '')));
    dispatch(prepareFinalObject(`purchaseOrders[0].purchaseOrderDetails[${i}].purchaseIndentDetails[0].indentDetail.remarks`, get(state.screenConfiguration.preparedFinalObject, "purchaseOrders[0].remarks", '')));
    dispatch(prepareFinalObject(`purchaseOrders[0].purchaseOrderDetails[${i}].purchaseIndentDetails[0].quantity`, indentDetails[0].indentQuantity));

   }
   }
   else
    set(purchaseOrders[0], `purchaseOrderDetails[${i}].purchaseIndentDetails`, []);
  }

  set(
    purchaseOrders[0],
    "purchaseOrderDate",
    convertDateToEpoch(get(purchaseOrders[0], "purchaseOrderDate"), "dayStart")
  );
  set(
    purchaseOrders[0],
    "expectedDeliveryDate",
    convertDateToEpoch(get(purchaseOrders[0], "expectedDeliveryDate"), "dayStart")
  );

  set(
    purchaseOrders[0],
    "rateContractDate",
    convertDateToEpoch(get(purchaseOrders[0], "rateContractDate"), "dayStart")
  );
  set(
    purchaseOrders[0],
    "agreementDate",
    convertDateToEpoch(get(purchaseOrders[0], "agreementDate"), "dayStart")
  );
  set(
    purchaseOrders[0],
    "agreementStartDate",
    convertDateToEpoch(get(purchaseOrders[0], "agreementStartDate"), "dayStart")
  );
  set(
    purchaseOrders[0],
    "agreementEndDate",
    convertDateToEpoch(get(purchaseOrders[0], "agreementEndDate"), "dayStart")
  );

  const requestBody = {purchaseOrders};
  console.log("requestbody", requestBody);

  if (action === "CREATE") {
    try {
      const response = await httpRequest(
        "post",
        "/store-asset-services/purchaseorders/_create",
        "",
        queryObject,
        requestBody
      );
       if(response){
        dispatch(setRoute(`/egov-store-asset/acknowledgement?screen=purchaseOrder&mode=create&code=${response.purchaseOrders[0].purchaseOrderNumber}`));
       }
  
    } catch (error) {
      dispatch(toggleSnackbar(true, { labelName: error.message, labelCode: error.message }, "error" ) );
    }
  } else if (action === "UPDATE") {
    try {
      const response = await httpRequest(
        "post",
        "/store-asset-services/purchaseorders/_update",
        "",
        queryObject,
        requestBody
      );
       if(response){
        dispatch(setRoute(`/egov-store-asset/acknowledgement?screen=purchaseOrder&mode=update&code=${response.purchaseOrders[0].purchaseOrderNumber}`));
       }
  
    } catch (error) {
      dispatch(toggleSnackbar(true, { labelName: error.message, labelCode: error.message }, "error" ) );
    }
  } 
};


