import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import {
  prepareFinalObject,
  toggleSnackbar
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import get from "lodash/get";
import set from "lodash/set";
import {
  
  getMaterialIndentSearchResults,  
  GetMdmsNameBycode,
  
} from "../../../../../ui-utils/storecommonsapi";
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
export const furnishindentData = (state, dispatch) => {
  let indents = get(
    state.screenConfiguration.preparedFinalObject,
    "indents",
    []
  );
   setDateInYmdFormat(indents[0], ["indentDate",]);
  
  dispatch(prepareFinalObject("indents", indents));
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



export const handleCreateUpdateIT = (state, dispatch) => {
  let uuid = get(
    state.screenConfiguration.preparedFinalObject,
    "indents[0].id",
    null
  );
  let indents = get(
    state.screenConfiguration.preparedFinalObject,
    "indents",
    []
  );
  let indentDate =
  get(state, "screenConfiguration.preparedFinalObject.indents[0].indentDate",0) 
  indentDate = convertDateToEpoch(indentDate);
  set(indents[0],"indentDate", indentDate);
  //furnishindentData(state, dispatch);
  if (uuid) {
    createUpdateIT(state, dispatch, "UPDATE");
  } else {
    createUpdateIT(state, dispatch, "CREATE");
  }
};

export const createUpdateIT = async (state, dispatch, action) => {

  let indents = get(
    state.screenConfiguration.preparedFinalObject,
    "indents",
    []
  );
  let priceList = get(
    state.screenConfiguration.preparedFinalObject,
    "searchMaster.priceList",
    []
  );
  const tenantId =  getTenantId();
  indents[0].tenantId = tenantId;
  let queryObject = [{ key: "tenantId", value: tenantId }];
 

  indents = handleCardDelete(indents, "indentDetails", false);


 

  

  const requestBody = {indents};
  console.log("requestbody", requestBody);

  if (action === "CREATE") {
    try {
      const response = await httpRequest(
        "post",
        "/store-asset-services/indents/_create",
        "",
        queryObject,
        requestBody
      );
       if(response){
        dispatch(setRoute(`/egov-store-asset/acknowledgement?screen=INDENTTFR&mode=create&code=${response.indents[0].indentNumber}`));
       }
  
    } catch (error) {
      dispatch(toggleSnackbar(true, { labelName: error.message, labelCode: error.message }, "error" ) );
    }
  } else if (action === "UPDATE") {
    try {
      const response = await httpRequest(
        "post",
        "/store-asset-services/indents/_update",
        "",
        queryObject,
        requestBody
      );
       if(response){
        dispatch(setRoute(`/egov-store-asset/acknowledgement?screen=INDENTTFR&mode=update&code=${response.indents[0].indentNumber}`));
       }
  
    } catch (error) {
      dispatch(toggleSnackbar(true, { labelName: error.message, labelCode: error.message }, "error" ) );
    }
  } 
};

export const getMaterialIndentTransferData = async (
  state,
  dispatch,
  id,
  tenantId
) => {
  let queryObject = [
    {
      key: "ids",
      value: id
    },
    {
      key: "tenantId",
      value: tenantId
    }
  ];

 let response = await getMaterialIndentSearchResults(queryObject, dispatch);
response = response.indents.filter(x=>x.id === id)
if(response && response[0])
{
  for (let index = 0; index < response[0].indentDetails.length; index++) {
    const element = response[0].indentDetails[index];
   let Uomname = GetMdmsNameBycode(state, dispatch,"viewScreenMdmsData.common-masters.UOM",element.uom.code)   
   set(response[0], `indentDetails[${index}].uom.name`, Uomname);
  }
}
dispatch(prepareFinalObject("indents", response));
 
  furnishindentData(state, dispatch);
};


