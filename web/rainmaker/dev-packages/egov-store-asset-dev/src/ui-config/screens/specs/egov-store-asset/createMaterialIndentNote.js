import {
    getStepperObject,
    getCommonHeader,
    getCommonContainer
  } from "egov-ui-framework/ui-config/screens/specs/utils";  
  import { footer } from "./creatematerialindentnoteResource/footer";
  import { 
    getstoreTenantId,
    getStoresSearchResults, 
    getMaterialIndentSearchResults,
    getMaterialBalanceRateResults,
    getmaterialissuesSearchResults
  } from "../../../../ui-utils/storecommonsapi";
  
  import { IndentMaterialIssueDetails } from "./creatematerialindentnoteResource/Material-indent-note"; 
  import { getSearchResults } from "../../../../ui-utils/commons";
  import { materialIssue } from "./creatematerialindentnoteResource/Material-issue-note-map"; 
  import { otherDetails } from "./creatematerialindentnoteResource/other-details";
  import {totalValue} from './creatematerialindentnoteResource/totalValue';
  import set from "lodash/set";
  import get from "lodash/get";
  import map from "lodash/map";
  import { httpRequest } from "../../../../ui-utils";
  import { commonTransform, objectArrayToDropdown } from "../utils";
  import {  handleScreenConfigurationFieldChange as handleField, prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
  import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
  import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
  //import { getEmployeeData } from "./viewResource/functions";
  import { getTenantId,getUserInfo } from "egov-ui-kit/utils/localStorageUtils";
  import {
    IndentConfiguration
  } from "../../../../ui-utils/sampleResponses";
import Iframe from "egov-ui-framework/ui-atoms/HtmlElements/Iframe";
  export const stepsData = [
    { labelName: "Indent Material Issue", labelKey: "STORE_MATERIAL_INDENT_NOTE_INDENT_MATERIAL_ISSUE" },
    {
      labelName: "Indent Material Issue Details",
      labelKey: "STORE_MATERIAL_INDENT_NOTE_INDENT_MATERIAL_ISSUE_DETAILS"
    },
    // { labelName: "Approval Informtion", labelKey: "STORE_MATERIAL_INDENT_NOTE_APPROVAL_INFORMTION" },
    
  ];
  export const stepper = getStepperObject(
    { props: { activeStep: 0 } },
    stepsData
  );

  
export const header = getCommonContainer({
    header: getCommonHeader({
      labelName: `Indent Material Issue Note `,
      labelKey: "STORE_COMMON_CREATE_INDENT_MATERIAL_ISSUE_NOTE"
    })
  });
  
  export const formwizardFirstStep = {
    uiFramework: "custom-atoms",
    componentPath: "Form",
    props: {
      id: "apply_form1"
    },
    children: {
      IndentMaterialIssueDetails
    }
  };
  
  export const formwizardSecondStep = {
    uiFramework: "custom-atoms",
    componentPath: "Form",
    props: {
      id: "apply_form2"
    },
    children: {
      materialIssue,
      totalValue
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
        otherDetails
    },
    visible: false
  };
 
  const getMaterialData = async (action, state, dispatch ,storecode) => {
    const tenantId = getTenantId();
    let queryObject = [
      {
        key: "tenantId",
        value: getTenantId(),
      },
    ];
    //let storecode = get(state,"screenConfiguration.preparedFinalObject.materialIssues[0].fromStore.code",'')
    queryObject.push({
      key: "issueingStore",
      value: storecode
    });
  
    //get Material based on Indent
    let material =[]
    let  indents =  get(
      state.screenConfiguration.preparedFinalObject,
      `indents`,
      []
    );
    let indentDetails = get(
      indents[0],
      `indentDetails`,
      []
    );
    for (let index = 0; index < indentDetails.length; index++) {
      const element = indentDetails[index];
      material.push( element.material.code)
      
    }
    let matcodes= material.map(itm => {
                  return `${itm}`;
                })
                .join() || "-"
   // dispatch(prepareFinalObject("indentsmaterial",material));
    queryObject.push({
      key: "material",
      value: matcodes
    });
  console.log(matcodes)
      
    try {
      let response = await getMaterialBalanceRateResults(queryObject, dispatch);
  
      dispatch(prepareFinalObject("indentsmaterial", response.MaterialBalanceRate));
     //set materialIssues[0].issuedToEmployee
     const queryParams = [{ key: "roles", value: "EMPLOYEE" },{ key: "tenantId", value:  getTenantId() }];
     const payload = await httpRequest(
       "post",
       "/egov-hrms/employees/_search",
       "_search",
       queryParams,
     );
    
     let stores = get(state,"screenConfiguration.preparedFinalObject.store.stores",[])
     stores = stores.filter(x=>x.code === storecode)
     //alert(stores[0].storeInCharge.code)
     if(payload){
       if (payload.Employees) {
         const {screenConfiguration} = state;
         const {designationsById} = state.common;
          const empdesignation = payload.Employees[0].assignments[0].designation;
         const empDetails =
         payload.Employees.filter((item, index) =>  stores[0].storeInCharge.code === item.code);
       
         if(empDetails && empDetails[0] ){
           //alert(empDetails[0].user.name)        
           dispatch(prepareFinalObject("materialIssues[0].issuedToEmployee",empDetails[0].user.name));
           if(designationsById){
            const desgnName = Object.values(designationsById).filter(item =>  item.code === empdesignation )
            dispatch(prepareFinalObject("materialIssues[0].issuedToDesignation", desgnName[0].name));
            }  
          // dispatch(prepareFinalObject("materialIssues[0].issuedToDesignation",empDetails[0].user.name));  
         }
         else{
          dispatch(prepareFinalObject("materialIssues[0].issuedToEmployee",""));  
         }
       }
     }
    } catch (e) {
      console.log(e);
    }
  };
  const getMdmsData = async (state, dispatch, tenantId) => {
    let mdmsBody = {
      MdmsCriteria: {
        tenantId: tenantId,
        moduleDetails: [
          {
            moduleName: "store-asset",
            masterDetails: [
              { name: "Material", },
              { name: "InventoryType", },
              { name: "MaterialType", filter: "[?(@.active == true)]"},
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
          {
            moduleName: "egov-location",
            masterDetails: [
              {
                name: "TenantBoundary"
                // filter: "$.*.hierarchyType"
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
      dispatch(
        prepareFinalObject("createScreenMdmsData", get(response, "MdmsRes"))
      );
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
      let response = await getStoresSearchResults(queryObject, dispatch);
      if(response)
      {

      }
      dispatch(prepareFinalObject("store", response));
    } catch (e) {
      console.log(e);
    }
  };
  const getUserData = async (action, state, dispatch) => {
    const tenantId = getTenantId();
    const issueNumber = getQueryArg(window.location.href, "applicationNumber");
    // let Indent=[];
    // let IndentId =''
    // if(issueNumber)
    // {
    //   let queryObjectIndent = [
    //     {
    //       key: "tenantId",
    //       value: tenantId
    //     },
    //     {
    //       key: "issueNumber",
    //       value: issueNumber
    //     }
    //   ];
    //   let indentissuedata = await getmaterialissuesSearchResults(queryObjectIndent, dispatch);
    //   indentissuedata = indentissuedata.materialIssues.filter(x=>x.issueNumber === issueNumber)
    //   if(indentissuedata && indentissuedata[0])
    //   {
    //     IndentId = indentissuedata[0].indent.id;
    //   }
    // }    
    // else   
    // IndentId = getQueryArg(window.location.href, "IndentId");
    // let queryObject = [
    //   {
    //     key: "tenantId",
    //     value: tenantId
    //   },
    //   {
    //     key: "ids",
    //     value: IndentId
    //   }
    // ];
    try {
      // if(IndentId)
      // {
      // let response = await getMaterialIndentSearchResults(queryObject, dispatch);
      // if(response)
      // dispatch(prepareFinalObject("indents", response));
      // }
        // fetching employee designation
    const userInfo = JSON.parse(getUserInfo());
    if(userInfo){
      dispatch(prepareFinalObject("materialIssues[0].createdByName", userInfo.name));
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
          dispatch(prepareFinalObject("materialIssues[0].designation", desgnName[0].name));
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
  const getYearsList = (startYear, state, dispatch) => {
    var currentYear = new Date().getFullYear(),
      years = [];
    startYear = startYear || 1980;
  
    while (startYear <= currentYear) {
      years.push({ value: (startYear++).toString() });
    }
  
    dispatch(prepareFinalObject("yearsList", years));
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
    name: "createMaterialIndentNote",
    // hasBeforeInitAsync:true,
    beforeInitScreen: (action, state, dispatch) => {
     
      const tenantId = getstoreTenantId();
     // const mdmsDataStatus = getMdmsData(state, dispatch, tenantId);
      getMdmsData(state, dispatch, tenantId)
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
        }
      )
      const storedata = getstoreData(action,state, dispatch);        
      const Indentdata = getUserData(action,state, dispatch);
      const step = getQueryArg(window.location.href, "step");
      const applicationNumber = getQueryArg(window.location.href, "applicationNumber");
      if(!step && !applicationNumber){
        dispatch(prepareFinalObject("materialIssues[0]",null));
      }
     // SEt Default data

     dispatch(
      prepareFinalObject(
        "materialIssues[0].materialIssueStatus",
        IndentConfiguration().materialIssueStatus,
      )
    );
    dispatch(
      prepareFinalObject(
        "materialIssues[0].issueType",
        IndentConfiguration().IssueType.INDENTISSUE,
      )
    );
    let indents = get(
      state.screenConfiguration.preparedFinalObject,
      `indents`,
      []
    ); 
   
    //indents = indents.filter(x=> x.id === IndentId)
    //designation
    
    //let indents = get(state.screenConfiguration.preparedFinalObject,`indents`,[])
    // if(indents && indents[0])
    // {
    //   indents = indents;
    // }
    // else
    // {
    //   indents = indents.indents;
    // }
    if(applicationNumber)
    {
      let tenantId = getTenantId();
      const queryObject = [{ key: "tenantId", value: tenantId},{ key: "issueNoteNumber", value: applicationNumber}];
      getSearchResults(queryObject, dispatch,"materialissues")
      .then(response=>{
        if(response){
          
          if(response.materialIssues && response.materialIssues[0].indent.id){
            let indents =get(response.materialIssues[0],`indent`,[])                
              // dispatch(prepareFinalObject("materialIssues[0].toStore.code",indents[0].indentStore.code));
              // dispatch(prepareFinalObject("materialIssues[0].toStore.name",indents[0].indentStore.name));
              // dispatch(prepareFinalObject("materialIssues[0].indent",indents[0]));       
              // dispatch(prepareFinalObject("materialIssues[0].issuedToEmployee",null));
              // dispatch(prepareFinalObject("materialIssues[0].issuedToDesignation",null));
               //set min Issue Date based on Indent Create date
               dispatch(
                handleField(
                  "createMaterialIndentNote",
                  "components.div.children.formwizardFirstStep.children.IndentMaterialIssueDetails.children.cardContent.children.IndentMaterialIssueContainer.children.IssueDate",
                  "props.inputProps",
                  { min: new Date(response.materialIssues[0].indent.indentDate).toISOString().slice(0, 10),
                    max: new Date().toISOString().slice(0, 10)}
                )
              );  
              //set receipt id
              let totalIndentQty = 0;
              let totalvalue = 0
              let TotalQty = 0;
              if(response && response.materialIssues[0])
                {
                  for (let index = 0; index < response.materialIssues[0].materialIssueDetails.length; index++) {
                    const element = response.materialIssues[0].materialIssueDetails[index];
                    set(response.materialIssues[0], `materialIssueDetails[${index}].receiptId`, element.materialIssuedFromReceipts[index].materialReceiptId);
                    set(response.materialIssues[0], `materialIssueDetails[${index}].indentDetail.userQuantity`, Number(element.quantityIssued));
                    if(Number(response.materialIssues[0].indent.indentDetails[index].indentQuantity))
                    set(response.materialIssues[0], `materialIssueDetails[${index}].indentDetail.indentQuantity`, Number(response.materialIssues[0].indent.indentDetails[index].indentQuantity) );
                    set(response.materialIssues[0], `materialIssueDetails[${index}].indentDetail.TotalValue`,  Number(element.value));
                    let BalanceQtyAfterIssue = Number(response.materialIssues[0].indent.indentDetails[index].balanceQty) - Number(element.quantityIssued)
                    set(response.materialIssues[0], `materialIssueDetails[${index}].indentDetail.BalanceQtyAfterIssue`,  BalanceQtyAfterIssue);
                    totalvalue = totalvalue+ Number(element.value)
                    totalIndentQty = totalIndentQty+ Number(response.materialIssues[0].indent.indentDetails[index].indentQuantity)
                    TotalQty = TotalQty + Number(element.quantityIssued)

                  }
                  set(response.materialIssues[0],`totalIndentQty`, totalIndentQty);
                  set(response.materialIssues[0],`totalQty`, TotalQty);
                  set(response.materialIssues[0],`totalvalue`, totalvalue);
                }
                dispatch(prepareFinalObject("materialIssues", [...response.materialIssues]));
              //get Material based on Indent
              let material =[]
              let indentDetails = get(
                indents,
                `indentDetails`,
                []
              );
              for (let index = 0; index < indentDetails.length; index++) {
                const element = indentDetails[index];
                material.push( element.material.code)
                
              }
              let matcodes= material.map(itm => {
                            return `${itm}`;
                          })
                          .join() || "-"
             // dispatch(prepareFinalObject("IndentMaterial",material));
             const queryObject = [
               { key: "tenantId", value: getTenantId()},
               { key: "issueingStore", value: response.materialIssues[0].fromStore.code},
               {key:"material",value:matcodes}
              ];
              getSearchResults(queryObject, dispatch,"materialBalanceAndName")
              .then(response =>{
                if(response)
                {
                  dispatch(prepareFinalObject("indentsmaterial", [...response.MaterialBalanceRate]));
                }
                
              });
            

          }
        }

      });
    // if(indents && indents[0] )
    // { 
      
    // }
  }
  else{
    const IndentId = getQueryArg(window.location.href, "IndentId");
    if(IndentId)
    {
      let tenantId = getTenantId();
      const queryObject = [{ key: "tenantId", value: tenantId},{ key: "ids", value: IndentId}];
      getSearchResults(queryObject, dispatch,"indents")
      .then(response=>{
        if(response){
          dispatch(prepareFinalObject("indents", [...response.indents]));
          if(response.indents && response.indents[0]){
           // let indents =get(response.materialIssues[0],`indents`,[])                
              dispatch(prepareFinalObject("materialIssues[0].toStore.code",response.indents[0].indentStore.code));
              dispatch(prepareFinalObject("materialIssues[0].toStore.name",response.indents[0].indentStore.name));
              dispatch(prepareFinalObject("materialIssues[0].indent.indentNumber",response.indents[0].indentNumber));  
              dispatch(prepareFinalObject("materialIssues[0].indent",response.indents[0]));  
              dispatch(prepareFinalObject("materialIssues[0].indent.indentDate",response.indents[0].indentDate));   
              //set min Issue Date based on Indent Create date
              dispatch(
                handleField(
                  "createMaterialIndentNote",
                  "components.div.children.formwizardFirstStep.children.IndentMaterialIssueDetails.children.cardContent.children.IndentMaterialIssueContainer.children.IssueDate",
                  "props.inputProps",
                  { min: new Date(response.indents[0].indentDate).toISOString().slice(0, 10),
                    max: new Date().toISOString().slice(0, 10)}
                )
              );  
              dispatch(prepareFinalObject("materialIssues[0].issueDate",new Date().toISOString().substr(0,10)));  
              // dispatch(
              //   handleField(
              //     "createMaterialIndentNote",
              //     "components.div.children.formwizardFirstStep.children.IndentMaterialIssueDetails.children.cardContent.children.IndentMaterialIssueContainer.children.IssueDate",
              //     "props.inputProps",
              //     { max: new Date().toISOString().slice(0, 10)}
              //   )
              // );   
              dispatch(prepareFinalObject("materialIssues[0].issuedToEmployee",null));
              dispatch(prepareFinalObject("materialIssues[0].issuedToDesignation",null));
              const userInfo = JSON.parse(getUserInfo());
              if(userInfo){
                dispatch(prepareFinalObject("materialIssues[0].createdByName", userInfo.name));
              }
          }
        }
      });
    }
  }
    

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
  



