import {
    getCommonHeader,
    getCommonContainer
  } from "egov-ui-framework/ui-config/screens/specs/utils";
  
  import { MTONReviewDetails } from "./viewMTONResource/mton-review";
  import { poViewFooter } from "./viewMTONResource/footer";
  import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
  import { getTenantId } from "egov-ui-kit/utils/localStorageUtils";
  import { httpRequest } from "../../../../ui-utils";
  import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
  import { getstoreTenantId } from "../../../../ui-utils/storecommonsapi";
  export const header = getCommonContainer({
    header: getCommonHeader({
      labelName: `View Material Transfer Outward Note`,
      labelKey: "STORE_MTON_VIEW"
    })
  });
  
  const tradeView = MTONReviewDetails(false);
  

  const getData = async (action, state, dispatch) => {
   
    await getEmployeeData(action, state, dispatch);
    await getMdmsData(action, state, dispatch);
  }
  const getMdmsData = async (action, state, dispatch) => {
    let mdmsBody = {
      MdmsCriteria: {
        tenantId: commonConfig.tenantId,
        moduleDetails: [ 
          {
            moduleName: "store-asset",
            masterDetails: [
              { name: "Material", },
              { name: "RateType", filter: "[?(@.active == true)]" },
            ]
          },
          {
            moduleName: "common-masters",
            masterDetails: [
              { name: "UOM", filter: "[?(@.active == true)]" },
              { name: "Department", filter: "[?(@.active == true)]" },
              { name: "Designation", filter: "[?(@.active == true)]" }
            ]
          }
        ]
      }
    };
    try {
      const response = await httpRequest(
        "post",
        "/egov-mdms-service/v1/_search",
        "_search",
        [],
        mdmsBody
      );
      dispatch( prepareFinalObject("createScreenMdmsData", get(response, "MdmsRes")) );
    } catch (e) {
      console.log(e);
    }
  };
  const getEmployeeData = async (action, state, dispatch) => {
    //fecthing employee details 
    const queryParams = [{ key: "roles", value: "EMPLOYEE" },{ key: "tenantId", value:  getTenantId() }];
    const payload = await httpRequest(
      "post",
      "/egov-hrms/employees/_search",
      "_search",
      queryParams,
    );
    if(payload){
      if (payload.Employees) {
        const empDetails =
        payload.Employees.map((item, index) => {
            const deptCode = item.assignments[0] && item.assignments[0].department;
            const designation =   item.assignments[0] && item.assignments[0].designation;
            const empCode = item.code;
            const empName = `${item.user.name}`;
          return {
                  code : empCode,
                  name : empName,
                  dept : deptCode,
                  designation:designation,
          };
        });
      
        if(empDetails){
          dispatch(prepareFinalObject("createScreenMdmsData.employee",empDetails));  
        }
        
      }
    }

  }
  const screenConfig = {
    uiFramework: "material-ui",
    name: "view-material-transfer-outward",
    beforeInitScreen: (action, state, dispatch) => {
      getData(action, state, dispatch);
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
                ...header
              }
            }
          },
          tradeView,
          footer: poViewFooter()
        }
      },
    }
  };
  
  export default screenConfig;
  