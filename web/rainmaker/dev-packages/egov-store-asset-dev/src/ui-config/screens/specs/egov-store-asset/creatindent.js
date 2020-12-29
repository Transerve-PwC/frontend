import {
    getStepperObject,
    getCommonHeader,
    getCommonContainer
  } from "egov-ui-framework/ui-config/screens/specs/utils";  
  import { footer } from "./createindentResource/footer";
  import { getstoreTenantId ,getsuppliersSearchResults} from "../../../../ui-utils/storecommonsapi";
  import { getSearchResults} from "../../../../ui-utils/commons";
  import { MaterialIndentDetails } from "./createindentResource/Material-Indent"; 
  import { MaterialIndentMapDetails } from "./createindentResource/Material-indent-map"; 
  import {totalValue} from './createindentResource/totalValue';
  import set from "lodash/set";
  import get from "lodash/get";
  import map from "lodash/map";
  import { httpRequest } from "../../../../ui-utils";
  import { commonTransform, objectArrayToDropdown } from "../utils";
  import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
  import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
  //import { getEmployeeData } from "./viewResource/functions";
  import { getTenantId,getUserInfo } from "egov-ui-kit/utils/localStorageUtils";
  import {
    prepareDocumentsUploadData,
    
  } from "../../../../ui-utils/storecommonsapi";
  let tenantId = getQueryArg(window.location.href, "tenantId");
  let disabled = false
  if(tenantId)
  disabled = true
  export const stepsData = [
    { labelName: "Material  Indent", labelKey: "STORE_MATERIAL_INDENT_MATERIAL_INDENT" },
    { labelName: "Material  Indent Details" ,  labelKey: "STORE_MATERIAL_INDENT_MATERIAL_INDENT_DETAILS" },
    //{ labelName: "Documents", labelKey: "STORE_PRICE_LIST_DOCUMENTS" },
   
    
  ];
  export const stepper = getStepperObject(
    { props: { activeStep: 0 } },
    stepsData
  );

  
export const header = getCommonContainer({
    header: getCommonHeader({
      labelName: `Material  Indent Note`,
      labelKey: "STORE_MATERIAL_INDENT_MATERIAL_INDENT_NOTE"
    })
  });
  
  export const formwizardFirstStep = {
    uiFramework: "custom-atoms",
    componentPath: "Form",
    props: {
      id: "apply_form1"
    },
    children: {
      MaterialIndentDetails:MaterialIndentDetails(disabled)
     // MaterialIndentDetails(disabled)
    }
  };
  
  export const formwizardSecondStep = {
    uiFramework: "custom-atoms",
    componentPath: "Form",
    props: {
      id: "apply_form2"
    },
    children: {     
     // MaterialIndentMapDetails:MaterialIndentMapDetails(disabled),
      MaterialIndentMapDetails,
     totalValue
    },
    visible: false
  };

  

 
  
  const getMdmsData = async (state, dispatch, tenantId) => {
    let mdmsBody = {
      MdmsCriteria: {
        tenantId: tenantId,
        moduleDetails: [
          {
            moduleName: "store-asset",
            masterDetails: [
              { name: "Material" }, //filter: "[?(@.active == true)]" },
              { name: "InventoryType", filter: "[?(@.active == true)]" },
              { name: "IndentPurpose"},// filter: "[?(@.active == true)]" },
              { name: "businessService" }, 
              
            ],
          },
          {
            moduleName: "common-masters",
            masterDetails: [
              {
                name: "UOM",
                filter: "[?(@.active == true)]"
              },
              
            ]
          },
          {
            moduleName: "ACCESSCONTROL-ROLES",
            masterDetails: [
              {
                name: "roles",
                filter: "$.[?(@.code!='CITIZEN')]"
              }
            ]
          },
         
         
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
      // document type 

     let  DocumentType_PriceList= [
        {
            code: "STORE_DOCUMENT_TYPE_RATE_CONTRACT_QUATION",
            isMandatory: true, 
            required:true,
            documentType:"STORE_DOCUMENT_TYPE_RATE_CONTRACT_QUATION"  ,         
            active: true
        },]
        dispatch(
          prepareFinalObject("createScreenMdmsData", get(response, "MdmsRes"))
        );
      dispatch(
        prepareFinalObject("DocumentType_PriceList", DocumentType_PriceList)
      );
      prepareDocumentsUploadData(state, dispatch, 'pricelist');
      setRolesList(state, dispatch);
      setHierarchyList(state, dispatch);
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
      const userInfo = JSON.parse(getUserInfo());
      // let businessService  = get(state, `screenConfiguration.preparedFinalObject.createScreenMdmsData.store-asset.businessService`,[]) 
      // // filter store based on login user role and assign business service
      // let roles = userInfo.roles
      // for (let index = 0; index < roles.length; index++) {
      //   const element = roles[index];
      //   businessService = businessService.filter(x=>x.role === element.code)
      //   if(businessService.length==1)
      //   response = response.stores.filter(x=>x.department.deptCategory===businessService[0].name)
      //   break;        
      // }
       dispatch(prepareFinalObject("store", response));
       response = await getSearchResults(queryObject, dispatch,"materials");
      dispatch(prepareFinalObject("materials", response));
            // fetching employee designation
   
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

  
  const setRolesList = (state, dispatch) => {
    let rolesList = get(
      state.screenConfiguration.preparedFinalObject,
      `createScreenMdmsData.ACCESSCONTROL-ROLES.roles`,
      []
    );
    let furnishedRolesList = rolesList.filter(item => {
      return item.code;
    });
    dispatch(
      prepareFinalObject(
        "createScreenMdmsData.furnishedRolesList",
        furnishedRolesList
      )
    );
  };
  
  const setHierarchyList = (state, dispatch) => {
    let tenantBoundary = get(
      state.screenConfiguration.preparedFinalObject,
      `createScreenMdmsData.egov-location.TenantBoundary`,
      []
    );
    let hierarchyList = map(tenantBoundary, "hierarchyType", []);
    dispatch(
      prepareFinalObject("createScreenMdmsData.hierarchyList", hierarchyList)
    );
  };
  
  const freezeEmployedStatus = (state, dispatch) => {
    let employeeStatus = get(
      state.screenConfiguration.preparedFinalObject,
      "Employee[0].employeeStatus"
    );
    if (!employeeStatus) {
      dispatch(prepareFinalObject("Employee[0].employeeStatus", "EMPLOYED"));
    }
  };
  
  const screenConfig = {
    uiFramework: "material-ui",
    name: `creatindent`,
    // hasBeforeInitAsync:true,
    beforeInitScreen: (action, state, dispatch) => {
      // const pickedTenant = getQueryArg(window.location.href, "tenantId");
      // pickedTenant &&
      //   dispatch(prepareFinalObject("Employee[0].tenantId", pickedTenant));
      // const empTenantId = get(
      //   state.screenConfiguration.preparedFinalObject,
      //   "Employee[0].tenantId"
      // );
      let tenantId = getstoreTenantId();
     // const mdmsDataStatus = getMdmsData(state, dispatch, tenantId);

     getMdmsData(state, dispatch, tenantId)
     .then(response=>
       {
        if(response)
        {
          //
          // getstoreData(action,state, dispatch)
          // .then(response=>{
            // if(response)
            // {
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
          // if(userInfo){
          //   dispatch(prepareFinalObject("indents[0].indentCreatedBy", userInfo.name));
          //   const queryParams = [{ key: "codes", value: userInfo.userName },{ key: "tenantId", value:  getTenantId() }];
          //   try { 
          //     const payload = await httpRequest(
          //       "post",
          //       "/egov-hrms/employees/_search",
          //       "_search",
          //       queryParams
          //     );
          //     if(payload){
          //       const {designationsById} = state.common;
          //       const empdesignation = payload.Employees[0].assignments[0].designation;
          //       if(designationsById){
          //       const desgnName = Object.values(designationsById).filter(item =>  item.code === empdesignation )
               
          //       dispatch(prepareFinalObject("indents[0].designation", desgnName[0].name));
          //       alert('123')
          //       }
          //     }
              
          //   } catch (e) {
          //     console.log(e);
          //   }
          // }
           // }            
         // });         
       
        }
       }
     )
     const storedata = getstoreData(action,state, dispatch);
      const step = getQueryArg(window.location.href, "step");
       tenantId = getQueryArg(window.location.href, "tenantId");
      if(!step && !tenantId){
        dispatch(prepareFinalObject("indents[0]",null));
      }
       // Set MDMS Data
    // getMdmsData(action, state, dispatch).then(response => {
    //   prepareDocumentsUploadData(state, dispatch, 'pricelist');
    // });
      let employeeCode = getQueryArg(window.location.href, "employeeCode");
     // employeeCode && getEmployeeData(state, dispatch, employeeCode, tenantId);
      // getYearsList(1950, state, dispatch);
      // freezeEmployedStatus(state, dispatch);
      // if (mdmsDataStatus) {
      //   setHierarchyList(state, dispatch);
      // }
      //   dispatch(prepareFinalObject("Licenses", [{ licenseType: "PERMANENT" }]));
      //   dispatch(prepareFinalObject("LicensesTemp", []));
      //   // getData(action, state, dispatch);
      //   getData(action, state, dispatch).then(responseAction => {
      //     const queryObj = [{ key: "tenantId", value: tenantId }];
      //     getBoundaryData(action, state, dispatch, queryObj);
      //     let props = get(
      //       action.screenConfig,
      //       "components.div.children.formwizardFirstStep.children.tradeLocationDetails.children.cardContent.children.tradeDetailsConatiner.children.tradeLocCity.props",
      //       {}
      //     );
      //     props.value = tenantId;
      //     props.disabled = true;
      //     set(
      //       action.screenConfig,
      //       "components.div.children.formwizardFirstStep.children.tradeLocationDetails.children.cardContent.children.tradeDetailsConatiner.children.tradeLocCity.props",
      //       props
      //     );
      //     dispatch(
      //       prepareFinalObject(
      //         "Licenses[0].tradeLicenseDetail.address.city",
      //         tenantId
      //       )
      //     );
      //     //hardcoding license type to permanent
      //     set(
      //       action.screenConfig,
      //       "components.div.children.formwizardFirstStep.children.tradeDetails.children.cardContent.children.tradeDetailsConatiner.children.tradeLicenseType.props.value",
      //       "PERMANENT"
      //     );
      //   });

  
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
         // formwizardThirdStep,
         
         
          footer
        }
      }
      // breakUpDialog: {
      //   uiFramework: "custom-containers-local",
      //   componentPath: "ViewBreakupContainer",
      //   props: {
      //     open: false,
      //     maxWidth: "md",
      //     screenKey: "apply"
      //   }
      // }
    }
  };
  
  export default screenConfig;
  



