import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import {
  prepareFinalObject,
  toggleSnackbar
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import get from "lodash/get";
import set from "lodash/set";
import {
  getmaterialOutwordSearchResults,
  GetMdmsNameBycode,
  getMaterialBalanceRateResults,
  getWFPayload
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
    "materialIssues[0].id",
    null
  );
  let indentDate =
  get(state, "screenConfiguration.preparedFinalObject.materialIssues[0].indent.indentDate",0) 
  indentDate = convertDateToEpoch(indentDate, "dayStart");
  set(state,"screenConfiguration.preparedFinalObject.materialIssues[0].indent.indentDate", indentDate);
  if (uuid) {
      // get set date field into epoch
  
    createUpdatePO(state, dispatch, "UPDATE");
  } else {
    createUpdatePO(state, dispatch, "CREATE");
  }
};

export const createUpdatePO = async (state, dispatch, action) => {

  let materialIssues = get(
    state.screenConfiguration.preparedFinalObject,
    "materialIssues",
    []
  );
  set(
    materialIssues[0],
    "issueDate",
    convertDateToEpoch(get(materialIssues[0], "issueDate"), "dayStart")
  );
  const tenantId =  getTenantId();
  materialIssues[0].tenantId = tenantId;
  let queryObject = [{ key: "tenantId", value: tenantId }];
 



  const requestBody = {materialIssues};
  console.log("requestbody", requestBody);

  if (action === "CREATE") {
    try {
      const wfobject=getWFPayload(state,dispatch)
      const response = await httpRequest(
        "post",
        "/store-asset-services/materialissues-to/_create",
        "",
        queryObject,
        { materialIssues:requestBody.materialIssues,workFlowDetails:wfobject }
      );
       if(response){
        // dispatch(setRoute(`/egov-store-asset/acknowledgement?screen=indentOutword&mode=create&code=${response.materialIssues[0].issueNumber}`));
        dispatch(setRoute(`/egov-store-asset/view-indent-outword?applicationNumber=${response.materialIssues[0].issueNumber}&tenantId=${response.materialIssues[0].tenantId}&Status=${response.materialIssues[0].materialIssueStatus}`));
       }
  
    } catch (error) {
      dispatch(toggleSnackbar(true, { labelName: error.message, labelCode: error.message }, "error" ) );
    }
  } else if (action === "UPDATE") {
    try {
      const response = await httpRequest(
        "post",
        "/store-asset-services/materialissues-to/_update",
        "",
        queryObject,
        requestBody
      );
       if(response){
      //  dispatch(setRoute(`/egov-store-asset/acknowledgement?screen=indentOutword&mode=update&code=${response.materialIssues[0].issueNumber}`));
        dispatch(setRoute(`/egov-store-asset/view-indent-outword?applicationNumber=${response.materialIssues[0].issueNumber}&tenantId=${response.materialIssues[0].tenantId}&Status=${response.materialIssues[0].materialIssueStatus}`));
      }
  
    } catch (error) {
      dispatch(toggleSnackbar(true, { labelName: error.message, labelCode: error.message }, "error" ) );
    }
  } 
};

export const getIndentOutwordData = async (
  state,
  dispatch,
  id,
  tenantId,
  issueNoteNumber
) => {
  let queryObject = [
    // {
    //   key: "ids",
    //   value: id
    // },
    {
      key: "issueNumber",
      value: issueNoteNumber
    },
    {
      key: "tenantId",
      value: tenantId
    }
  ];

 let response = await getmaterialOutwordSearchResults(queryObject, dispatch);
// let response = samplematerialsSearch();
response = response.materialIssues.filter(x=>x.issueNumber === issueNoteNumber)
let totalvalue = 0
let TotalQty = 0;
if(response && response[0])
{
for (let index = 0; index < response[0].materialIssueDetails.length; index++) {
  const element = response[0].materialIssueDetails[index];
 let Uomname = GetMdmsNameBycode(state, dispatch,"viewScreenMdmsData.common-masters.UOM",element.uom.code) 
 let matname = GetMdmsNameBycode(state, dispatch,"viewScreenMdmsData.store-asset.Material",element.material.code) 
    
    set(response[0], `materialIssueDetails[${index}].uom.name`, Uomname);
    set(response[0], `materialIssueDetails[${index}].material.name`, matname);
    set(response[0], `materialIssueDetails[${index}].receiptId`, element.materialIssuedFromReceipts[0].materialReceiptId); 
    set(response[0], `materialIssueDetails[${index}].quantityIssuedE`,(element.indentDetail.userQuantity +element.indentDetail.indentIssuedQuantity)); 
    totalvalue = totalvalue+( Number(element.value) )
       
    TotalQty = TotalQty + Number(element.quantityIssued)   
  
}
//set issue to employee name from store incharge
if(response[0].indent.issueStore.storeInCharge.code)
{
  
  let emp = get(state, "screenConfiguration.preparedFinalObject.createScreenMdmsData.employee",[]) 
  
  emp = emp.filter(x=>x.code ===response[0].indent.issueStore.storeInCharge.code)
  if(emp&& emp[0])
  {
  //dispatch(prepareFinalObject("materialIssues[0].issuedToEmployeename", emp[0].name));
  set(response[0], `issuedToEmployeename`,emp[0].name);
  set(response[0], `issuedToEmployee`, emp[0].code);
  let issuedToDesignation =GetMdmsNameBycode(state, dispatch,"viewScreenMdmsData.common-masters.Designation",emp[0].designation)          
  set(response[0], `issuedToDesignation`, issuedToDesignation); 
  const {designationsById} = state.common;
  // if(designationsById){
  //   const desgnName = Object.values(designationsById).filter(item =>  item.code === emp[0].designation )
  //  // dispatch(prepareFinalObject("materialIssues[0].issuedToDesignation", issuedToDesignation));
  //  if(desgnName &&desgnName[0])
  //   set(response[0], `issuedToDesignation`, desgnName[0].name); 
  //   }
  }
}


set(response[0],`totalQty`, TotalQty);
 set(response[0],`totalvalue`, totalvalue);
}
  dispatch(prepareFinalObject("materialIssues", response));

 furnishPriceListData(state, dispatch);
};

export const furnishPriceListData = (state, dispatch) => {
  let materialIssues = get(
    state.screenConfiguration.preparedFinalObject,
    "materialIssues",
    []
  );
  setDateInYmdFormat(materialIssues[0], ["issueDate", "indent.indentDate",]);
  
  dispatch(prepareFinalObject("materialIssues", materialIssues));
  //set indentsOutmaterial based on indent number

  let indentDetails = get(
    materialIssues[0],
    "indent.indentDetails",
    []
  );
          let material=[];
          let matcode =[];
          let storecode = materialIssues[0].indent.issueStore.code;
          for (let index = 0; index < indentDetails.length; index++) {
            const element = indentDetails[index];
            dispatch(prepareFinalObject(`materialIssues[0].indent.indentDetails[${index}].id`, element.id));
            dispatch(prepareFinalObject(`materialIssues[0].indent.indentDetails[${index}].uom.code`, element.uom.code));
            dispatch(prepareFinalObject(`materialIssues[0].indent.indentDetails[${index}].userQuantity`, element.userQuantity));
            dispatch(prepareFinalObject(`materialIssues[0].indent.indentDetails[${index}].material.code`, element.material.code));
            //create material list for card item
           
            material.push(
              {
                materialcode:element.material.code,
                materialName:GetMdmsNameBycode(state, dispatch,"viewScreenMdmsData.store-asset.Material",element.material.code),
                uomcode:element.uom.code,
                uomname:GetMdmsNameBycode(state, dispatch,"viewScreenMdmsData.common-masters.UOM",element.uom.code),
                id:element.id,
                indentQuantity:element.indentQuantity,
                totalProcessedQuantity:element.totalProcessedQuantity,
                indentIssuedQuantity:element.indentIssuedQuantity,
                interstoreRequestQuantity:element.interstoreRequestQuantity,
                //unitRate://to be deside
              });
              matcode.push( element.material.code)
          }  
          
          let matcodes_= matcode.map(itm => {
            return `${itm}`;
          })
          .join() || "-"
          const queryObject = [{ key: "tenantId", value: getTenantId()},{ key: "issueingStore", value: storecode},{ key: "material", value: matcodes_}];
          getMaterialBalanceRateResults(queryObject)
          .then(async response =>{
            if(response){
              dispatch(prepareFinalObject("indentsOutmaterial", response.MaterialBalanceRate));
              
            }
          }); 
};
