import {
    getStepperObject,
    getCommonHeader,
    getCommonContainer
  } from "egov-ui-framework/ui-config/screens/specs/utils";  
  import { footer } from "./creatematerialReceiptNoteMiscResource/footer";
  import { getstoreTenantId,getStoresSearchResults, } from "../../../../ui-utils/storecommonsapi";
  import { getSearchResults } from "../../../../ui-utils/commons";
  import { materialReceiptMiscDetail } from "./creatematerialReceiptNoteMiscResource/Material-receipt-details"; 
  import { MaterialReceiptMiscNote ,MaterialSearch } from "./creatematerialReceiptNoteMiscResource/Material-receipt-note"; 
  import { otherDetails } from "./creatematerialReceiptNoteMiscResource/other-details";
  import set from "lodash/set";
  import get from "lodash/get";
  import map from "lodash/map";
  import { httpRequest } from "../../../../ui-utils";
  import {handleSearchMaterial} from './creatematerialReceiptNoteMiscResource/footer'
  import { commonTransform, objectArrayToDropdown } from "../utils";
  import { prepareFinalObject , handleScreenConfigurationFieldChange as handleField } from "egov-ui-framework/ui-redux/screen-configuration/actions";
  import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
  import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
  //import { getEmployeeData } from "./viewResource/functions";
  import { getTenantId,getUserInfo } from "egov-ui-kit/utils/localStorageUtils";
  import {totalValue} from './creatematerialReceiptNoteMiscResource/totalValue';
  import {
    IndentConfiguration
  } from "../../../../ui-utils/sampleResponses";
  export const prepareEditFlow = async (
    state,
    dispatch,    
  ) => {
    let isAdHoc =  get(state.screenConfiguration.preparedFinalObject, "materialReceipt[0].isAdHoc",false)
    
    dispatch(
     handleField(
       "createMaterialReceiptNoteMisc",
       "components.div.children.formwizardFirstStep.children.MaterialSearch.children.cardContent.children.MaterialSearchContainer.children.isAdhoc",
       "props.value",
       isAdHoc
     )
   );

  }
  export const stepsData = [
    { labelName: "Miscellaneous Material Receipt", labelKey: "STORE_MATERIAL_RECEIPT_MATERIAL_MISC" },
    {
      labelName: "Miscellaneous Material Receipt Details",
      labelKey: "STORE_MATERIAL_RECEIPT_MATERIAL_MISC_DETAILS"
    },
    // { labelName: "Approval Informtion", labelKey: "STORE_MATERIAL_INDENT_NOTE_APPROVAL_INFORMTION" },
    
  ];
  export const stepper = getStepperObject(
    { props: { activeStep: 0 } },
    stepsData
  );

  
export const header = getCommonContainer({
    header: getCommonHeader({
      labelName: `Miscellaneous Material Receipt Note `,
      labelKey: "STORE_MATERIAL_RECEIPT_MATERIAL_MISC_HEADER"
    })
  });
  
  export const formwizardFirstStep = {
    uiFramework: "custom-atoms",
    componentPath: "Form",
    props: {
      id: "apply_form1"
    },
    children: {
      MaterialSearch,
      MaterialReceiptMiscNote
    }
  };
  
  export const formwizardSecondStep = {
    uiFramework: "custom-atoms",
    componentPath: "Form",
    props: {
      id: "apply_form2"
    },
    children: {
      
      materialReceiptMiscDetail,
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
 
  
  const getMdmsData = async (state, dispatch, tenantId) => {
    let mdmsBody = {
      MdmsCriteria: {
        tenantId: tenantId,
        moduleDetails: [
          {
            moduleName: "store-asset",
            masterDetails: [
              { name: "Material",},
              { name: "ReceiptType", },
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
      dispatch(prepareFinalObject("store", response));
            // fetching employee designation
            const userInfo = JSON.parse(getUserInfo());
            if(userInfo){
              dispatch(prepareFinalObject("materialReceipt[0].createdByName", userInfo.name));
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
                  
                  dispatch(prepareFinalObject("materialReceipt[0].designation", desgnName[0].name));
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
    name: "createMaterialReceiptNoteMisc",
    // hasBeforeInitAsync:true,
    beforeInitScreen: (action, state, dispatch) => {
     
      let tenantId = getstoreTenantId();
      //const mdmsDataStatus = getMdmsData(state, dispatch, tenantId);
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
                 
        
         }
        }
      )
     
      const storedata = getstoreData(action,state, dispatch);
      const step = getQueryArg(window.location.href, "step");
      tenantId = getQueryArg(window.location.href, "tenantId");
     
      let isAdHoc =  get(state.screenConfiguration.preparedFinalObject, "materialReceipt[0].isAdHoc",false)
      if(!step && !tenantId){
        dispatch(prepareFinalObject("materialReceipt[0].isAdHoc", false));
        isAdHoc =  get(state.screenConfiguration.preparedFinalObject, "materialReceipt[0].isAdHoc",false)
        dispatch(prepareFinalObject("materialReceipt[0]",null));
       
      }
      else
      {
        
        if(isAdHoc)
        handleSearchMaterial( state,dispatch)
        else{
          let code =  get(state.screenConfiguration.preparedFinalObject, "materialReceipt[0].receivingStore.code",'')
          const queryObject = [{ key: "tenantId", value: getTenantId()},{ key: "store", value: code}];
              getSearchResults(queryObject, dispatch,"materials")
              .then(async response =>{
                if(response){
                  let indentingMaterial =[];
                  let  materialNames = response.materials.map(material => {
                      const materialName = material.name;
                      const materialcode = material.code;
                      const id = material.id
                      const description = material.description;
                      const uom = material.baseUom;
                      const quantityIssued = 0;
                      const issuedToEmployee = '';
                      const issuedToDesignation = '';
                     // const poOrderedQuantity = 0;
                      return{ materialName, materialcode,description,uom ,quantityIssued,issuedToEmployee,issuedToDesignation}
                  })
  
                  dispatch(prepareFinalObject("MiscMaterilList", materialNames));          
               }
                
              });   
              

        }

       
      }
     // SEt Default data Start

     dispatch(prepareFinalObject("materialReceipt[0].receiptType", "MISCELLANEOUS RECEIPT",));
     dispatch(prepareFinalObject("materialReceipt[0].supplier.code", "",));
     dispatch(prepareFinalObject("materialReceipt[0].mrnNumber", "",));
     dispatch(prepareFinalObject("materialReceipt[0].supplierBillNo", "",));
     dispatch(prepareFinalObject("materialReceipt[0].challanNo", "",));
     dispatch(prepareFinalObject("materialReceipt[0].supplierBillDate", 1512365762000,));
     dispatch(prepareFinalObject("materialReceipt[0].challanDate", 1512365762000,));
     dispatch(prepareFinalObject("materialReceipt[0].inspectionDate", 45698756,));
     dispatch(prepareFinalObject("materialReceipt[0].inspectionRemarks", '',));
//isAdHoc
//dispatch(prepareFinalObject("materialReceipt[0].isAdHoc", "NO"));
     // SEt Default data End
    
    
     if(isAdHoc)
     dispatch(prepareFinalObject("materialReceipt[0].isAdHoc", "YES"));
     else
     {
      dispatch(prepareFinalObject("materialReceipt[0].isAdHoc", "NO"));
     }
    //  let isAdHoc_ =
    //  isAdHoc === false
    //    ? "YES"
    //    : "NO";
    //  dispatch(
    //   handleField(
    //     "createMaterialReceiptNoteMisc",
    //     "components.div.children.formwizardFirstStep.children.MaterialSearch.children.cardContent.children.MaterialSearchContainer.children.isAdhoc",
    //     "props.value",
    //     isAdHoc_
    //   )
    // );
    // set(
    //   action.screenConfig,
    //   "components.div.children.formwizardFirstStep.children.MaterialSearch.children.cardContent.children.MaterialSearchContainer.children.ViewButton.props.style",
    //   { marginTop: "20px" }
    // );
     if(!isAdHoc)
     {
       
       set(
         action.screenConfig,
         "components.div.children.formwizardFirstStep.children.MaterialReceiptMiscNote.children.cardContent.children.MaterialReceiptNoteContainer.children.StoreName.props.style",
         { display: "none",width:"40%" }
       );
       set(
        action.screenConfig,
        "components.div.children.formwizardFirstStep.children.MaterialReceiptMiscNote.children.cardContent.children.MaterialReceiptNoteContainer.children.StoreNameAd.props.style",
        { display: "inline-block",width:"40%" }
      );
      set(
        action.screenConfig,
        "components.div.children.formwizardFirstStep.children.MaterialSearch.children.cardContent.children.MaterialSearchContainer.children.issueNumber.props.style",
        { display: "none" }
      );
      set(
        action.screenConfig,
        "components.div.children.formwizardFirstStep.children.MaterialSearch.children.cardContent.children.MaterialSearchContainer.children.ViewButton.props.style",
        { display: "none",marginTop: "20px"  }
      );
    
     }     
     
     else
     {
      set(
        action.screenConfig,
        "components.div.children.formwizardFirstStep.children.MaterialReceiptMiscNote.children.cardContent.children.MaterialReceiptNoteContainer.children.StoreName.props.style",
        { display: "inline-block",width:"40%" }
      );
      set(
        action.screenConfig,
        "components.div.children.formwizardFirstStep.children.MaterialReceiptMiscNote.children.cardContent.children.MaterialReceiptNoteContainer.children.StoreNameAd.props.style",
        { display: "none",width:"40%" }
      );
      set(
        action.screenConfig,
        "components.div.children.formwizardFirstStep.children.MaterialSearch.children.cardContent.children.MaterialSearchContainer.children.issueNumber.props.style",
        { display: "inline-block" }
      );
      set(
        action.screenConfig,
        "components.div.children.formwizardFirstStep.children.MaterialSearch.children.cardContent.children.MaterialSearchContainer.ViewButton.props.style",
        { display: "inline-block",marginTop: "20px"  }
      );
     }
     
     prepareEditFlow(state, dispatch).then(res=>
      {
    
      }
    );
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
  



