import {
  getCommonHeader,
  getTextField,
  getLabelWithValue,
  getCommonContainer
} from "egov-ui-framework/ui-config/screens/specs/utils";

import { employeeReviewDetails } from "./viewResource/employee-review";
import { hrViewFooter } from "./viewResource/footer";
import { getEmployeeData } from "./viewResource/functions";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import { showHideAdhocPopup } from "../utils";
import { getTenantId,getUserInfo } from "egov-ui-kit/utils/localStorageUtils";
import { httpRequest } from "../../../../ui-utils";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";

export const header = getCommonContainer({
  header: getCommonHeader({
    labelName: `View Employee Information`,
    labelKey: "HR_VIEW_HEADER"
  })
});

const tradeView = employeeReviewDetails(false);



const screenConfig = {
  uiFramework: "material-ui",
  name: "empDetails",
  beforeInitScreen: (action, state, dispatch) => {
    let employeeCode = getQueryArg(window.location.href, "employeeID");
    let tenantId = getTenantId();
    const userInfo = JSON.parse(getUserInfo());
    getEmployeeData(state, dispatch, userInfo, tenantId);
   // showHideAdhocPopup(state, dispatch);
    //getMdmsData(action, state, dispatch, tenantId);
    // dispatch(
    //   handleField(
    //     "empDetails",
    //     "components.div.children.EmpUpdateInfoText",
    //     "props.style",
    //     { display: "none" }
    //   )
    // );
    return action;
  },
  components: {
    div: {
      uiFramework: "custom-atoms",
      componentPath: "Div",
      props: {
        className: "common-div-css"
      },
      children: {
        headerDiv: {
          uiFramework: "custom-atoms",
          componentPath: "Container",
          children: {
            header: {
              gridDefination: {
                xs: 12,
                sm: 10
              },
              //...header
            }
          }
        },
        EmpUpdateInfoText: getLabelWithValue(
          {
            labelName: "Employee code update function is available only one time from UI, If Required need to rais ticket for the same",
            labelKey: "INTIGRATION_EMP_UPDATE_INFORMATION"
          },
          
        ),
        empCode: {
          ...getTextField({
            label: {
              labelName: "Employee code",
              labelKey: "INTIGRATION_SF_EMPLOYEE_CODE"
            },
            placeholder: {
              labelName: "Enter Employee code",
              labelKey: "INTIGRATION_SF_EMPLOYEE_CODE_PLACEHOLDER"
            },
            props:{
              disabled:false
            },
            required: true, 
            visible:false,
            errorMessage:"INTIGRATION_ERROR_SF_EMPLOYEE_ID",      
            jsonPath: "Employees.Employees[0].hrmsCode",     
           
          }),
         
          
        },
        tradeView,
        footer: hrViewFooter()
      }
    },
    
    
  }
};

export default screenConfig;
