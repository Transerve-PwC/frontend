import {
    getStepperObject,
    getCommonHeader,
    getCommonContainer
  } from "egov-ui-framework/ui-config/screens/specs/utils";
  import { getTenantId,getUserInfo } from "egov-ui-kit/utils/localStorageUtils";
  import { footer } from "./createMaterialTransferIndentResource/footer";
  import {MTIHeader  } from "./createMaterialTransferIndentResource/MTIHeader";
  import { MTIDetails } from "./createMaterialTransferIndentResource/MTIDetails";
  import { poApprovalInfo } from "./createMaterialTransferIndentResource/poApprovalInfo";
  import {totalIndentValue} from "./createMaterialTransferIndentResource/totalIndentValue";
  import commonConfig from '../../../../config/common';

  import get from "lodash/get";
  import map from "lodash/map";
  import { httpRequest } from "../../../../ui-utils";
  import { prepareFinalObject, handleScreenConfigurationFieldChange as handleField } from "egov-ui-framework/ui-redux/screen-configuration/actions";
  import { getSearchResults } from "../../../../ui-utils/commons";
  import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
  export const stepsData = [
    { labelName: "Material Transfer Indent", labelKey: "STORE_MTI_HEADER" },
    { labelName: "Material Transfer Indent Details", labelKey: "STORE_MTI_DETAILS_HEADER" },
    // { labelName: "Approval Information", labelKey: "STORE_PO_APPROVAL_INFO_HEADER" },
  ];
  export const stepper = getStepperObject(
    { props: { activeStep: 0 } },
    stepsData
  );
  
  
  export const header = getCommonContainer({
    header: getCommonHeader({
      labelName: `Material Transfer Indent`,
      labelKey: "STORE_MTI_CREATE_HEADER"
    })
  });
  
  export const formwizardFirstStep = {
    uiFramework: "custom-atoms",
    componentPath: "Form",
    props: {
      id: "apply_form1"
    },
    children: {
     MTIHeader
    }
  };
  
  export const formwizardSecondStep = {
    uiFramework: "custom-atoms",
    componentPath: "Form",
    props: {
      id: "apply_form2"
    },
    children: {
      MTIDetails,
      //totalIndentValue
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
  
  

  
  const getMdmsData = async (action, state, dispatch) => {
    let mdmsBody = {
      MdmsCriteria: {
        tenantId: commonConfig.tenantId,
        moduleDetails: [ 
          {
            moduleName: "store-asset",
            masterDetails: [
              { name: "Material" }, //filter: "[?(@.active == true)]" },
              { name: "InventoryType", filter: "[?(@.active == true)]" },
              { name: "IndentPurpose"},// filter: "[?(@.active == true)]" },
              { name: "businessService" }, 
            ]
          },
          {
            moduleName: "common-masters",
            masterDetails: [
              { name: "UOM", filter: "[?(@.active == true)]" },
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
      return true;
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
              // fetching employee designation
    const userInfo = JSON.parse(getUserInfo());
    if(userInfo){
      dispatch(prepareFinalObject("indents[0].indentCreatedBy", userInfo.name));
      const queryParams = [{ key: "codes", value: userInfo.userName },{ key: "tenantId", value:  getTenantId() }];
      try { 
        const payload = await httpRequest(
          "post",
          "/egov-hrms/employees/_search",
          "_search",
          queryParams
        );
        if(payload){
          const {designationsById} = state.common;
          const empdesignation = payload.Employees[0].assignments[0].designation;
          if(designationsById){
          const desgnName = Object.values(designationsById).filter(item =>  item.code === empdesignation )
         
          dispatch(prepareFinalObject("indents[0].designation", desgnName[0].name));
          }
        }
        
      } catch (e) {
        console.log(e);
      }
    }     
    } catch (e) {
      console.log(e);
    }
  };
  const getData = async (action, state, dispatch) => {
    getMdmsData(action, state, dispatch)
    .then(response=>
      {
        if(response)
        {
          const queryObject = [{ key: "tenantId", value: getTenantId()}];
          getSearchResults(queryObject, dispatch,"storeMaster")
          .then(response =>{
          // let response = await getSearchResults(queryObject, dispatch,"storeMaster");
          if(response)
          {
          const userInfo = JSON.parse(getUserInfo());
          let businessService  = get(state, `screenConfiguration.preparedFinalObject.createScreenMdmsData.store-asset.businessService`,[]) 
          // filter store based on login user role and assign business service
          let roles = userInfo.roles
          for (let index = 0; index < roles.length; index++) {
          const element = roles[index];
          businessService = businessService.filter(x=>x.role === element.code)
          if(businessService.length==1)
          response = response.stores.filter(x=>x.department.deptCategory===businessService[0].name)
          break;        
          }
          dispatch(prepareFinalObject("store.stores", response));
        }
        });
        }
      })
   // return true;
   // await getstoreData(action, state, dispatch);
  }
  const screenConfig = {
    uiFramework: "material-ui",
    name: "create-material-transfer-indent",
    beforeInitScreen: (action, state, dispatch) => {
      const step = getQueryArg(window.location.href, "step");
      const id = getQueryArg(window.location.href, "id");
      if(!step && !id){
        dispatch(prepareFinalObject("indents[0]",null));
      }
      getData(action, state, dispatch);
      
        const storedata = getstoreData(action,state, dispatch);
           // SEt Default data Start
     dispatch(prepareFinalObject("indents[0].indentType", "Transfer Indent"));
    // dispatch(prepareFinalObject("indents[0].designation", "MD",));
     dispatch(prepareFinalObject("indents[0].materialHandOverTo", "",));
     dispatch(prepareFinalObject("indents[0].inventoryType", "",));
     dispatch(prepareFinalObject("indents[0].expectedDeliveryDate", 1609353000000,));//31 DEC 2020
      
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
  