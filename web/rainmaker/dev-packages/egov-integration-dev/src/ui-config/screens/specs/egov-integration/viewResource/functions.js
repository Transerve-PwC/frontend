import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import {
  prepareFinalObject,
  toggleSnackbar
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import get from "lodash/get";
import set from "lodash/set";
import {  
  getSearchResults,
  getHRMSEmpSearchResults,
  updateEmployee
} from "../../../../..//ui-utils/commons";
import { httpRequest } from "../../../../../ui-utils/api";//../../../../ui-utils
import {
  convertDateToEpoch,
  epochToYmdDate,
  showHideAdhocPopup,
  validateFields
} from "../../utils";
import { getTenantId } from "egov-ui-kit/utils/localStorageUtils";
import { handleScreenConfigurationFieldChange as handleField } from "egov-ui-framework/ui-redux/screen-configuration/actions";

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

export const furnishEmployeeData = (state, dispatch) => {
  let employeeObject = get(
    state.screenConfiguration.preparedFinalObject,
    "Employee",
    []
  );
  setDateInYmdFormat(employeeObject[0], ["dateOfAppointment", "user.dob","dateOfSuperannuation"]);
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





export const getEmployeeData = async (
  state,
  dispatch,
  userInfo,
  tenantId
) => {
  let hrmsCodeAbailable = false;
  
  let queryObject = [
    {
      key: "tenantId",
      value: tenantId
    }
  ];
  queryObject.push({ key: "uuids", value: userInfo.uuid });

  let payload = await getHRMSEmpSearchResults(queryObject, dispatch);
  let hrmsCode = '11832' ;
  if(payload){ 
    if(payload.Employees[0].hrmsCode !==null)
    {
      hrmsCode = payload.Employees[0].hrmsCode
      hrmsCodeAbailable = true
    }
    else{
      hrmsCode = '11832';
    }
    dispatch(prepareFinalObject("Employees", payload));
    
  }
  let requestBody ={
    hrmsRequest:
    {
      empCode:hrmsCode
    }
    

  }
  let Empdata = await getSearchResults([],requestBody, dispatch, "Empdata");
  let Empleavedata = await getSearchResults([],requestBody, dispatch, "Empleavedata");
  let EmpJoiningdata = await getSearchResults([],requestBody, dispatch, "EmpJoiningdata");
  dispatch(prepareFinalObject("Employeebasic", get(Empdata, "ResponseBody",{})));
  dispatch(prepareFinalObject("Empleavedata", get(Empleavedata, "ResponseBody",{})));
  dispatch(prepareFinalObject("EmpJoiningdata", get(EmpJoiningdata, "ResponseBody",{})));
  let Message = get(
    state.screenConfiguration.preparedFinalObject.Employeebasic, 'Message','');
  if(Message)
  {
    const errorMessage = {
      labelName: Message,
      labelKey: Message
    };
    dispatch(toggleSnackbar(true, errorMessage, "warning"));
  }
  dispatch(
    handleField(
      "create",
      "components.div.children.headerDiv.children.header.children.header.children.key",
      "props",
      {
        labelName: "Edit Employee",
        labelKey: "HR_COMMON_EDIT_EMPLOYEE_HEADER"
      }
    )
  );
if(hrmsCodeAbailable)
{
  dispatch(
    handleField(
      "empDetails",
      "components.div.children.EmpUpdateInfoText",
      "props.style",
      { display: "none" }
    )
  );
  dispatch(
    handleField(
      "empDetails",
      "components.div.children.footer.children.editDetails",
        "visible",
        false
        //true
    )
  );
  dispatch(
    handleField(
      "empDetails",
      "components.div.children.empCode",
      "visible",
      false
      //true
    )
  );

}
else{
  dispatch(
    handleField(
      "empDetails",
      "components.div.children.EmpUpdateInfoText",
      "props.style",
      { display: "inline-block" }
    )
  );
  dispatch(
    handleField(
      "empDetails",
      "components.div.children.empCode",
      "visible",
      true
    )
  );
  dispatch(
    handleField(
      "empDetails",
      "components.div.children.footer.children.editDetails",
        "visible",
        true
    )
  );

}

  //furnishEmployeeData(state, dispatch);
};
// HRMS Update API
export const updateEmployees = async (queryObject, payload, dispatch) => {
  try {
    const response = await httpRequest(
      "post",
      "/egov-hrms/employees/_updateEmployeeTable",
      "",
      queryObject,
      payload
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
