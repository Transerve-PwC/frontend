import {
    getStepperObject,
    getCommonHeader,
    getCommonContainer
  } from "egov-ui-framework/ui-config/screens/specs/utils";
  import { getTenantId,getUserInfo } from "egov-ui-kit/utils/localStorageUtils";
  import { footer } from "./createPurchaseOrderResource/footer";
  import {purchaseOrderHeader  } from "./createPurchaseOrderResource/purchaseOrderHeader";
  import { contractDetails } from "./createPurchaseOrderResource/contractDetails";
  import { purchaseOrderDetails } from "./createPurchaseOrderResource/purchaseOrderDetails";
  import { poApprovalInfo } from "./createPurchaseOrderResource/poApprovalInfo";
  import {totalPOValue} from './createPurchaseOrderResource/totalPOValue';
  import commonConfig from '../../../../config/common';
  import set from "lodash/set";
  import get from "lodash/get";
  import map from "lodash/map";
  import { httpRequest } from "../../../../ui-utils";
  import { prepareFinalObject, handleScreenConfigurationFieldChange as handleField } from "egov-ui-framework/ui-redux/screen-configuration/actions";
  import { getSearchResults } from "../../../../ui-utils/commons";  
  import { getMaterialIndentSearchResults } from "../../../../ui-utils/storecommonsapi";
  import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
  export const stepsData = [
    { labelName: "Purchase Order", labelKey: "STORE_PO_HEADER" },
    { labelName: "Tender/Quotation/Rate Contract Detail",  labelKey: "STORE_PO_RC_DETAIL_HEADER"},
    { labelName: "Purchase Order Details", labelKey: "STORE_PO_DETAILS_HEADER" },
  //  { labelName: "Approval Information", labelKey: "STORE_PO_APPROVAL_INFO_HEADER" },
  ];
  export const stepper = getStepperObject(
    { props: { activeStep: 0 } },
    stepsData
  );
  
  
  export const header = getCommonContainer({
    header: getCommonHeader({
      labelName: `Create Purchase Order`,
      labelKey: "STORE_PO_CREATE_HEADER"
    })
  });
  
  export const formwizardFirstStep = {
    uiFramework: "custom-atoms",
    componentPath: "Form",
    props: {
      id: "apply_form1"
    },
    children: {
     purchaseOrderHeader
    }
  };
  
  export const formwizardSecondStep = {
    uiFramework: "custom-atoms",
    componentPath: "Form",
    props: {
      id: "apply_form2"
    },
    children: {
      contractDetails
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
      purchaseOrderDetails,
      totalPOValue
    },
    visible: false
  };
  
  export const formwizardFourthStep = {
    uiFramework: "custom-atoms",
    componentPath: "Form",
    props: {
      id: "apply_form4"
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
              { name: "PORateType", filter: "[?(@.active == true)]" },
              { name: "Material" },
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
    } catch (e) {
      console.log(e);
    }
  };
  
  const getData = async (action, state, dispatch) => {
    await getMdmsData(action, state, dispatch);
    //fetching supplier master
    const queryObject = [{ key: "tenantId", value: getTenantId()  }];
  
    getSearchResults(queryObject, dispatch,"supplier")
    .then(response =>{
      if(response){
        const supplierNames = response.suppliers.map(item => {
          let code = item.code;
          let name = item.name;
          return{code,name}
        } )
        dispatch(prepareFinalObject("searchMaster.supplierName", supplierNames));
      }
    });

    //fetching store name
    getSearchResults(queryObject, dispatch,"storeMaster")
    .then(response =>{
      if(response){
        const storeNames = response.stores.map(item => {
          let code = item.code;
          let name = item.name;
          let department = item.department.name;
          let divisionName = item.divisionName;
          return{code,name,department,divisionName}
        } )
        dispatch(prepareFinalObject("searchMaster.storeNames", storeNames));
      }
    });

    // fetching employee designation
    const userInfo = JSON.parse(getUserInfo());
    if(userInfo){
      dispatch(prepareFinalObject("purchaseOrders[0].poCreatedBy", userInfo.name));
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
          dispatch(prepareFinalObject("purchaseOrders[0].issuedToDesignation", desgnName[0].name));
          dispatch(prepareFinalObject("purchaseOrders[0].designation", desgnName[0].name));
          }
        }
        
      } catch (e) {
        console.log(e);
      }
    }

  }
  const screenConfig = {
    uiFramework: "material-ui",
    name: "create-purchase-order",
    // hasBeforeInitAsync:true,
    beforeInitScreen: (action, state, dispatch) => {
      getData(action, state, dispatch);
      let indentNumber="";
      indentNumber = getQueryArg(window.location.href, "indentNumber");
      const step = getQueryArg(window.location.href, "tenantId");
      const poNumber = getQueryArg(window.location.href, "poNumber");
      if(!step && !poNumber){
        dispatch(prepareFinalObject("purchaseOrders[0]",null));
        // set(
        //   action.screenConfig,
        //   "components.div.children.formwizardFirstStep.children.purchaseOrderHeader.children.cardContent.children.purchaseOrderHeaderContainer.children.supplier.props.style",
        //   { display: "none" }
        // );
        // set(
        //   action.screenConfig,
        //   "components.div.children.formwizardFirstStep.children.purchaseOrderHeader.children.cardContent.children.purchaseOrderHeaderContainer.children.supplier.props",
        //   { disabled: true }
        // );
        dispatch(prepareFinalObject("purchaseOrders[0].purchaseOrderDate",new Date().toISOString().substr(0,10))); 
      }
      if(indentNumber){     
          dispatch(prepareFinalObject("purchaseOrders[0].purchaseType", "Indent"));   
          dispatch(prepareFinalObject("purchaseOrders[0].indentNumbers", [indentNumber]));
          // get store from indent then set materilal and disable store selection
          let storecode="";
          let indents = get(
            state.screenConfiguration.preparedFinalObject,
            `indents`,
            []
          );
          indents = indents.filter(x=> x.indentNumber === indentNumber)
          if(indents && indents[0] )
          {
            storecode = indents[0].indentStore.code;
            dispatch(prepareFinalObject("purchaseOrders[0].store.code", storecode)); 
             //set min Issue Date based on Indent Create date
            // alert(indents[0].indentDate);
             
          }          
         // storecode = getQueryArg(window.location.href, "indentNumber");
          if(storecode){
            const queryObject = [{ key: "tenantId", value: getTenantId()},{ key: "store", value: storecode}];
            getSearchResults(queryObject, dispatch,"materials")
            .then(async response =>{
              if(response){
                let indentingMaterial =[];
                let  materialNames = response.materials.map(material => {
                    const name = material.name;
                    const code = material.code;
                    const description = material.description;
                    const uom = material.baseUom;
                    const indentQuantity = 0;
                    return{ name, code,description,uom ,indentQuantity}
                })
                  if(indentNumber){
                    const queryObj = [{ key: "tenantId", value: getTenantId()},{ key: "indentNumber", value: indentNumber}];               
                    let res = await getMaterialIndentSearchResults(queryObj, dispatch);
                    if(res && res.indents &&  res.indents.length > 0){
                        res.indents.forEach(item => {
                          if(item.indentDetails.length > 0){
                            item.indentDetails.forEach(ele =>{
                              const name = ele.material.name;
                              const code = ele.material.code;
                              const description = ele.material.description;
                              const uom = ele.material.baseUom;
                              const indentQuantity = ele.indentQuantity;
                              if(!indentingMaterial.find(mat => mat.code === code))
                                   indentingMaterial.push({name,code,description,uom,indentQuantity})
                            })
                          }
                        })
                    }
    
                    // finding common material
                       materialNames = indentingMaterial.filter(function(ele) {
                            return materialNames.findIndex(mat => mat.code === ele.code) !== -1;
                        })
                  }
                  else{
                    
                    dispatch(
                      handleField(`create-purchase-order`,
                   // state.screenConfiguration.screenConfig["create-purchase-order"],
                        "components.div.children.formwizardFirstStep.children.purchaseOrderHeader.children.cardContent.children.purchaseOrderHeaderContainer.children.purchaseOrderDate",
                        "props.inputProps",
                        { max: new Date().toISOString().slice(0, 10)}
                      )
                    ); 
                   

                  }
                 
                  dispatch(
                    handleField(`create-purchase-order`,
                 // state.screenConfiguration.screenConfig["create-purchase-order"],
                      "components.div.children.formwizardFirstStep.children.purchaseOrderHeader.children.cardContent.children.purchaseOrderHeaderContainer.children.purchaseOrderDate",
                      "props.inputProps",
                      { min: new Date(indents[0].indentDate).toISOString().slice(0, 10),
                        max: new Date().toISOString().slice(0, 10)}
                    )
                  ); 
                      
                   
                dispatch(prepareFinalObject("searchMaster.materialNames", materialNames));  
                if(state.screenConfiguration.preparedFinalObject.searchMaster && state.screenConfiguration.preparedFinalObject.searchMaster.storeNames){
                  const {storeNames} = state.screenConfiguration.preparedFinalObject.searchMaster;
                  const storebj =  storeNames.filter(ele => ele.code === storecode);
                  if(storebj && storebj[0]){
                    dispatch(prepareFinalObject("purchaseOrders[0].store.name", storebj[0].name)); 
                    dispatch(prepareFinalObject("purchaseOrders[0].store.department.name", storebj[0].department));      
                    dispatch(prepareFinalObject("purchaseOrders[0].store.divisionName", storebj[0].divisionName));              
                  }
                }        
             }
              
            });   

            }
      }
      else{
        dispatch(prepareFinalObject("purchaseOrders[0].purchaseType", "Non Indent"));  
        dispatch(
          handleField(`create-purchase-order`,
       // state.screenConfiguration.screenConfig["create-purchase-order"],
            "components.div.children.formwizardFirstStep.children.purchaseOrderHeader.children.cardContent.children.purchaseOrderHeaderContainer.children.purchaseOrderDate",
            "props.inputProps",
            { max: new Date().toISOString().slice(0, 10)}
          )
        );  

      }
      let rateType =  get(state.screenConfiguration.preparedFinalObject, "purchaseOrders[0].rateType",'')
      if(rateType ==='Gem')
      {
        set(
          action.screenConfig,
          "components.div.children.formwizardFirstStep.children.purchaseOrderHeader.children.cardContent.children.purchaseOrderHeaderContainer.children.supplier.props.style",
          { display: "none" }
        );
        set(
          action.screenConfig,
          "components.div.children.formwizardFirstStep.children.purchaseOrderHeader.children.cardContent.children.purchaseOrderHeaderContainer.children.externalPoNumber.props.style",
          { display: "inline-block" }
        );
        set(
          action.screenConfig,
          "components.div.children.formwizardFirstStep.children.purchaseOrderHeader.children.cardContent.children.purchaseOrderHeaderContainer.children.supplierGem.props.style",
          { display: "inline-block" }
        );

      }
      else{
        set(
          action.screenConfig,
          "components.div.children.formwizardFirstStep.children.purchaseOrderHeader.children.cardContent.children.purchaseOrderHeaderContainer.children.supplier.props.style",
          { display: "inline-block",width:"40%" }
        );
        set(
          action.screenConfig,
          "components.div.children.formwizardFirstStep.children.purchaseOrderHeader.children.cardContent.children.purchaseOrderHeaderContainer.children.supplierGem.props.style",
          { display: "none" }
        );
        set(
          action.screenConfig,
          "components.div.children.formwizardFirstStep.children.purchaseOrderHeader.children.cardContent.children.purchaseOrderHeaderContainer.children.externalPoNumber.props.style",
          { display: "none" }
        );

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
        //  formwizardFourthStep,
          footer
        }
      }
    }
  };
  
  export default screenConfig;
  