import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import {
  prepareFinalObject,
  toggleSnackbar
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import get from "lodash/get";
import set from "lodash/set";
import {
  getIndentInwordSearchResults,
  getmaterialOutwordSearchResults,
  updateIndentInword,
  creatIndentInword,
  GetMdmsNameBycode,
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
  let transferInwards = get(
    state.screenConfiguration.preparedFinalObject,
    "transferInwards",
    []
  );
   setDateInYmdFormat(transferInwards[0], ["receiptDate", ]);

  // setAllYears(transferInwards[0], [
  //   { object: "education", values: ["yearOfPassing"] },
  //   { object: "tests", values: ["yearOfPassing"] }
  // ]);
  // setRolesData(transferInwards[0]);
  // setRolesList(state, dispatch);
  dispatch(prepareFinalObject("transferInwards", transferInwards));
};

export const handleCreateUpdateMaterialInword = (state, dispatch) => {
  let id = get(
    state.screenConfiguration.preparedFinalObject,
    "transferInwards[0].id",
    null
  );
  if (id) {
    
    createUpdateIndentInword(state, dispatch, "UPDATE");
  } else {
    createUpdateIndentInword(state, dispatch, "CREATE");
  }
};

export const createUpdateIndentInword = async (state, dispatch, action) => {
  const pickedTenant = get(
    state.screenConfiguration.preparedFinalObject,
    "transferInwards[0].tenantId"
  );
  const tenantId =  getTenantId();
  let queryObject = [
    {
      key: "tenantId",
      value: tenantId
    }
  ];
 
  let transferInwards = get(
    state.screenConfiguration.preparedFinalObject,
    "transferInwards",
    []
  );
  set(transferInwards[0], "tenantId", tenantId);
  // get set date field into epoch

  let receiptDate =
  get(state, "screenConfiguration.preparedFinalObject.transferInwards[0].receiptDate",0) 
  receiptDate = convertDateToEpoch(receiptDate, "dayStart");
  set(transferInwards[0],"receiptDate", receiptDate);
 



  

  //set defailt value
  let id = get(
    state.screenConfiguration.preparedFinalObject,
    "transferInwards[0].id",
    null
  );

 
  



  if (action === "CREATE") {
    try {
      let wfobject = getWFPayload(state, dispatch)
      console.log(queryObject)
      console.log("queryObject")
      let response = await creatIndentInword(
        queryObject,        
        transferInwards,
        dispatch,
        wfobject
      );
      if(response){
        let mrnNumber = response.transferInwards[0].mrnNumber
        //dispatch(setRoute(`/egov-store-asset/acknowledgement?screen=INDENTINWORD&mode=create&code=${mrnNumber}`));
        dispatch(setRoute(`/egov-store-asset/view-indent-inword?applicationNumber=${mrnNumber}&tenantId=${response.transferInwards[0].tenantId}&Status=${response.transferInwards[0].mrnStatus}`));
      }
    } catch (error) {
      furnishindentData(state, dispatch);
    }
  } else if (action === "UPDATE") {
    try {
      let response = await updateIndentInword(
        queryObject,
        transferInwards,
        dispatch
      );
      if(response){
        let mrnNumber = response.transferInwards[0].mrnNumber
        //dispatch(setRoute(`/egov-store-asset/acknowledgement?screen=INDENTINWORD&mode=update&code=${mrnNumber}`));
        dispatch(setRoute(`/egov-store-asset/view-indent-inword?applicationNumber=${mrnNumber}&tenantId=${response.transferInwards[0].tenantId}&Status=${response.transferInwards[0].mrnStatus}`)); 
      }
    } catch (error) {
      furnishindentData(state, dispatch);
    }
  }

};

export const getIndentInwordData = async (
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

 let response = await getIndentInwordSearchResults(queryObject, dispatch);
// let response = samplematerialsSearch();
response = get(response, "transferInwards")
if(response)
{
for (let index = 0; index < response[0].receiptDetails.length; index++) {
  const element = response[0].receiptDetails[index];
 let Uomname = GetMdmsNameBycode(state, dispatch,"viewScreenMdmsData.common-masters.UOM",element.uom.code) 
    set(response[0], `receiptDetails[${index}].uom.name`, Uomname);  
}
dispatch(prepareFinalObject("transferInwards",response ));
const tenantId = getTenantId();
let queryObject = [
  {
    key: "tenantId",
    value: tenantId
  },
  {
    key: "materialIssueStatus",
    value: "Approved"
  }

];
try {
  let responseOut = await getmaterialOutwordSearchResults(queryObject, dispatch);
  dispatch(prepareFinalObject("materialOutword", responseOut));
  if(responseOut)
  {
    var x = responseOut.materialIssues.filter(x=x.id ===5)
  }
} catch (e) {
  console.log(e);
}
}
  furnishindentData(state, dispatch);
};
