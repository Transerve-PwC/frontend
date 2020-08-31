import {
    getStepperObject,
    getCommonHeader,
    getCommonContainer
  } from "egov-ui-framework/ui-config/screens/specs/utils";
  import { getTenantId,getUserInfo } from "egov-ui-kit/utils/localStorageUtils";
  import { footer } from "./createMaterialTransferOutwardResource/footer";
  import {MTONHeader  } from "./createMaterialTransferOutwardResource/MTONHeader";
  import { MTONDetails } from "./createMaterialTransferOutwardResource/MTONDetails";
  import { poApprovalInfo } from "./createMaterialTransferOutwardResource/poApprovalInfo";
  import {totalIssueValue} from "./createMaterialTransferOutwardResource/totalIssueValue";
  import commonConfig from '../../../../config/common';
  import { IndentConfigType } from "../../../../ui-utils/sampleResponses";
  import get from "lodash/get";
  import map from "lodash/map";
  import { httpRequest } from "../../../../ui-utils";
  import { prepareFinalObject, handleScreenConfigurationFieldChange as handleField } from "egov-ui-framework/ui-redux/screen-configuration/actions";
  import { getSearchResults } from "../../../../ui-utils/commons";
  import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
  export const stepsData = [
    { labelName: "Material Transfer Outward", labelKey: "STORE_MTON_HEADER" },
    { labelName: "Material Transfer Outward Details", labelKey: "STORE_MTON_DETAILS_HEADER" },
    { labelName: "Approval Information", labelKey: "STORE_PO_APPROVAL_INFO_HEADER" },
  ];
  export const stepper = getStepperObject(
    { props: { activeStep: 0 } },
    stepsData
  );
  
  
  export const header = getCommonContainer({
    header: getCommonHeader({
      labelName: `Material Transfer Outward Note`,
      labelKey: "STORE_MTON_CREATE_HEADER"
    })
  });
  
  export const formwizardFirstStep = {
    uiFramework: "custom-atoms",
    componentPath: "Form",
    props: {
      id: "apply_form1"
    },
    children: {
     MTONHeader
    }
  };
  
  export const formwizardSecondStep = {
    uiFramework: "custom-atoms",
    componentPath: "Form",
    props: {
      id: "apply_form2"
    },
    children: {
      MTONDetails,
      totalIssueValue
    },
    visible: false
  };
  
  export const formwizardThirdStep = {
    uiFramework: "custom-atoms",
    componentPath: "Form",
    props: {
      id: "apply_form3"
    },
    children: {
        poApprovalInfo
    },
    visible: false
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
const getTransferIndentData = async (action, state, dispatch) => {
  const tenantId = getTenantId();
    let queryObject = [
      {
        key: "tenantId",
        value: tenantId
      },
      {
        key: "indentType",
        value: IndentConfigType().IndntType.INDENT_TFR
      },
    ];
    try {
      let response = await getSearchResults(queryObject, dispatch,"indents");
    //   const indentNumber = getQueryArg(window.location.href, "indentNumber");
    //   if(indentNumber)
    //   {
    //   response = response.indents.filter(x=>x.indentNumber ===indentNumber)
    //   dispatch(prepareFinalObject("TransferIndent", response));
     
    // }
    dispatch(prepareFinalObject("TransferIndent", response));
      
    } catch (e) {
      console.log(e);
    }
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
  const getstoreData = async (action, state, dispatch) => {
    const tenantId = getTenantId();
    let queryObject = [
      {
        key: "tenantId",
        value: tenantId
      }];
    try {
      let response = await getSearchResults(queryObject, dispatch,"storeMaster");
      dispatch(prepareFinalObject("store", response));
      
    } catch (e) {
      console.log(e);
    }
  };
  const getData = async (action, state, dispatch) => {
    await getMdmsData(action, state, dispatch);
    await getstoreData(action, state, dispatch);
    await getTransferIndentData(action, state, dispatch);
    await getEmployeeData(action, state, dispatch);
  }
  const screenConfig = {
    uiFramework: "material-ui",
    name: "create-material-transfer-outward",
    beforeInitScreen: (action, state, dispatch) => {
      const step = getQueryArg(window.location.href, "step");
      const id = getQueryArg(window.location.href, "id");
      if(!step && !id){
        dispatch(prepareFinalObject("materialIssues[0]",null));
      }
      getData(action, state, dispatch);
      // SEt Default data Start
     
     dispatch(prepareFinalObject("materialIssues[0].materialIssueStatus", "CREATED"));
     dispatch(prepareFinalObject("materialIssues[0].issueType", "MATERIALOUTWARD",));
     dispatch(prepareFinalObject("materialIssues[0].materialHandOverTo", "",));
     dispatch(prepareFinalObject("materialIssues[0].inventoryType", "",));
     dispatch(prepareFinalObject("materialIssues[0].expectedDeliveryDate", 1609353000000,));//31 DEC 2020

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
          stepper,
          formwizardFirstStep,
          formwizardSecondStep,
          formwizardThirdStep,
          footer
        }
      }
    }
  };
  
  export default screenConfig;
  