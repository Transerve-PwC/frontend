import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import {
  prepareFinalObject,
  toggleSnackbar,
  toggleSpinner
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import{GetMdmsNameBycode, getWFPayload} from '../../../../../ui-utils/storecommonsapi'
import get from "lodash/get";
import set from "lodash/set";
import {
  creatmiscellaneousreceiptnotes,
  getmiscellaneousreceiptnotesSearchResults,
  updatemiscellaneousreceiptnotes,
  
} from "../../../../../ui-utils/storecommonsapi";
import store from "ui-redux/store";
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





export const furnishindentData = (state, dispatch) => {
  let materialReceipt = get(
    state.screenConfiguration.preparedFinalObject,
    "materialReceipt",
    []
  );
   setDateInYmdFormat(materialReceipt[0], ["receiptDate", ]);

  // setAllYears(materialReceipt[0], [
  //   { object: "education", values: ["yearOfPassing"] },
  //   { object: "tests", values: ["yearOfPassing"] }
  // ]);
  // setRolesData(materialReceipt[0]);
  // setRolesList(state, dispatch);
  dispatch(prepareFinalObject("materialReceipt", materialReceipt));
};

export const handleCreateUpdateMaterialReceiptMisc = (state, dispatch) => {
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
  receiptDate = convertDateToEpoch(receiptDate);
  set(materialReceipt[0],"receiptDate", receiptDate);

  let isAdHoc = get(
    state.screenConfiguration.preparedFinalObject,
    "materialReceipt[0].isAdHoc",false);
if(isAdHoc ==='YES')
  set(materialReceipt[0], "isAdHoc", true);
  else
  set(materialReceipt[0], "isAdHoc", false);




  

  //set defailt value
  let id = get(
    state.screenConfiguration.preparedFinalObject,
    "materialReceipt[0].id",
    null
  );

 
  



  if (action === "CREATE") {
    try {
      let wfobject = getWFPayload(state, dispatch)
      console.log(queryObject)
      console.log("queryObject")
      let response = await creatmiscellaneousreceiptnotes(
        queryObject,        
        materialReceipt,
        dispatch,
        wfobject
      );
      if(response){
        let mrnNumber = response.MaterialReceipt[0].mrnNumber
       // dispatch(setRoute(`/egov-store-asset/acknowledgement?screen=MATERIALRECEIPTMISC&mode=create&code=${mrnNumber}`));
       dispatch(setRoute(`/egov-store-asset/view-material-receipt-note-misc?applicationNumber=${mrnNumber}&tenantId=${response.MaterialReceipt[0].tenantId}&Status=${response.MaterialReceipt[0].mrnStatus}`));
      }
    } catch (error) {
      furnishindentData(state, dispatch);
    }
  } else if (action === "UPDATE") {
    try {
      let response = await updatemiscellaneousreceiptnotes(
        queryObject,
        materialReceipt,
        dispatch
      );
      if(response){
        let mrnNumber = response.MaterialReceipt[0].mrnNumber
       // dispatch(setRoute(`/egov-store-asset/acknowledgement?screen=MATERIALRECEIPTMISC&mode=update&code=${mrnNumber}`));
       dispatch(setRoute(`/egov-store-asset/view-material-receipt-note-misc?applicationNumber=${mrnNumber}&tenantId=${response.MaterialReceipt[0].tenantId}&Status=${response.MaterialReceipt[0].mrnStatus}`));
      }
    } catch (error) {
      furnishindentData(state, dispatch);
    }
  }

};

export const getmiscellaneousreceiptnotes = async (
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
  try {
 let response = await getmiscellaneousreceiptnotesSearchResults(queryObject, dispatch);
// let response = samplematerialsSearch();
 //response = response.MaterialReceipt.filter(x=>x.id === id)
 response = response.MaterialReceipt.filter(x => x.mrnNumber === mrnNumber)
 let totalvalue = 0
 let TotalQty = 0;
if(response && response[0])
{
  for (let index = 0; index < response[0].receiptDetails.length; index++) {
    const element = response[0].receiptDetails[index];
   let Uomname = GetMdmsNameBycode(state, dispatch,"viewScreenMdmsData.common-masters.UOM",element.uom.code)   
   set(response[0], `receiptDetails[${index}].uom.name`, Uomname);
   totalvalue = totalvalue+( Number(element.acceptedQty) *element.unitRate)
      
   TotalQty = TotalQty + Number(element.acceptedQty)
  }
}
set(response[0],`totalQty`, TotalQty);
set(response[0],`totalvalue`, totalvalue);
// for (let index = 0; index < MaterialReceipt[0].receiptDetails.length; index++) {
//   const element = MaterialReceipt[0].receiptDetails[index];
//  let Uomname = GetMdmsNameBycode(state, dispatch,"viewScreenMdmsData.common-masters.UOM",element.uom.code) 
 
//     set(MaterialReceipt[0], `materialReceipt[${index}].uom.name`, Uomname);
     
// }
  dispatch(prepareFinalObject("materialReceipt", response));
  //dispatch(prepareFinalObject("materialReceipt", get(response, "MaterialReceipt")));
 
  furnishindentData(state, dispatch);
}
catch (error) {
  dispatch(
    toggleSnackbar(
      true,
      { labelName: "Unable to parse search results!" },
      "error"
    )
  );
  store.dispatch(toggleSpinner());
}
};
