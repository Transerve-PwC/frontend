
import {
    getCommonContainer,
    getCommonHeader
  } from "egov-ui-framework/ui-config/screens/specs/utils";
  import { verifyPropertyFooter } from "./applyResource/footer";
  import {
    propertyLocationDetails
  } from "./propertyDetailResource/propertyLocationDetails";
  import {
    propertyAssemblyDetails
  } from "./propertyDetailResource/propertyAssemblyDetails";
  import {
    prepareFinalObject
  } from "egov-ui-framework/ui-redux/screen-configuration/actions";
  import { getTenantId, getUserInfo } from "egov-ui-kit/utils/localStorageUtils";
  import { httpRequest } from "../../../../ui-utils";
  import set from "lodash/set";
  import get from "lodash/get";
  
  import { propertyOwnershipDetails } from './propertyDetailResource/propertyOwnershipDetails';
  import commonConfig from "config/common.js";
  import {
    getBoundaryData
  } from "../../../../ui-utils/commons";
  
  export const header = getCommonContainer({
    header: getCommonHeader({
      labelKey: "PT_COMMON_PROPERTY_DETAILS_HEADER"
    }),
  });
  
  
  export const formwizardFirstStep = {
    uiFramework: "custom-atoms",
    componentPath: "Form",
    props: {
      id: "apply_form1"
    },
    children: {
      propertyAssemblyDetails,
      propertyLocationDetails,
      propertyOwnershipDetails
    }
  };
  const getMDMSPropertyData = async (dispatch) => {
    const mdmsBody = {
      MdmsCriteria: {
        tenantId: commonConfig.tenantId,
        moduleDetails: [
          {
            moduleName: "PropertyTax",
            masterDetails: [
            {name: "PropertyType"},
            {name: "UsageCategory"},
            {name:"UsageCategoryMajor"},
            {name:"UsageCategoryMinor"},
            {name:"UsageCategorySubMinor"}
            ]
          }
        ],
        
      }
    }
    try {
      let payload=null;
       payload = await httpRequest("post","/egov-mdms-service/v1/_search","_search",[],mdmsBody);
    let PropertyType=[]; let UsageType=[];let subUsageType=[];
    payload.MdmsRes.PropertyTax.PropertyType.filter(item=>{
      if(item.name!="Built Up"){
        PropertyType.push({
          name:item.name,
          code: item.code,
          isActive: item.active
        })
      }
      
    })
  payload.MdmsRes.PropertyTax.PropertyType=PropertyType;
  
  // payload.MdmsRes.PropertyTax.UsageCategory.forEach(item=>{
  //   if(item.code.split(".").length<=2 && item.code!="NONRESIDENTIAL"){
  //       UsageType.push({
  //         active:item.active,
  //         name:item.name,
  //         code:item.code,
  //         fromFY:item.fromFY
  //       })
  //     }
  // })
  // payload.MdmsRes.PropertyTax.UsageType=UsageType;
  // let array1 = [];
  // let array2 = [];
  // payload.MdmsRes.PropertyTax.UsageCategory.forEach(item=>{
  //  let itemCode = item.code.split(".");
  //  const codeLength = itemCode.length;
  //     if(codeLength>3){
  //       array1.push(item);
  //     }else if(codeLength===3){
  //       array2.push(item);
  //     }
  // })
  // array1.forEach(item=>{
  // array2 = array2.filter(item1=>{
  //   return (!(item.code.includes(item1.code)));
  // })
  // });
  // array1 = array2.concat(array1);
  //payload.MdmsRes.PropertyTax.subUsageType=array1;
  
  //code for chandigarh as per requirement
  payload.MdmsRes.PropertyTax.UsageCategory.forEach(item=>{
    if(item.code.split(".").length<=1){
        UsageType.push({
          active:item.active,
          name:item.name,
          code:item.code,
          fromFY:item.fromFY
        })
      }
  });
   payload.MdmsRes.PropertyTax.UsageType=UsageType;
  
   payload.MdmsRes.PropertyTax.UsageCategory.forEach(item=>{
    if(item.code.split(".").length==2){
      subUsageType.push({
          active:item.active,
          name:item.name,
          code:item.code,
          fromFY:item.fromFY
        })
      }
  });
  payload.MdmsRes.PropertyTax.subUsageType=subUsageType;
    dispatch(prepareFinalObject("searchScreenMdmsData", payload.MdmsRes));
    } catch (e) {
      console.log(e);
    }
  };
  
  
  const getMdmsData = async (action, state, dispatch) => {
    let tenantId = process.env.REACT_APP_NAME === "Employee" ? getTenantId() : JSON.parse(getUserInfo()).permanentCity;
    let mdmsBody = {
      MdmsCriteria: {
        tenantId: tenantId,
        moduleDetails: [
          {
            moduleName: "common-masters",
            masterDetails: [{ name: "OwnerType" }, { name: "OwnerShipCategory" }]
          },
          {
            moduleName: "egov-location",
            masterDetails: [
              {
                name: "TenantBoundary"
              }
            ]
          },
          {
            moduleName: "tenant",
            masterDetails: [
              {
                name: "tenants"
              }
            ]
          }
        ]
      }
    };
    try {
      let payload = null;
      payload = await httpRequest(
        "post",
        "/egov-mdms-service/v1/_search",
        "_search",
        [],
        mdmsBody
      );
  
      let OwnerShipCategory = get(
        payload,
        "MdmsRes.common-masters.OwnerShipCategory"
      )
      let institutions = []
      OwnerShipCategory = OwnerShipCategory.map(category => {
        if (category.code.includes("INDIVIDUAL")) {
          return category.code;
        }
        else {
          let code = category.code.split(".");
          institutions.push({ code: code[1], parent: code[0], active: true });
          return code[0];
        }
      });
      OwnerShipCategory = OwnerShipCategory.filter((v, i, a) => a.indexOf(v) === i)
      OwnerShipCategory = OwnerShipCategory.map(val => { return { code: val, active: true } });
      
      payload.MdmsRes['common-masters'].Institutions = institutions;
      payload.MdmsRes['common-masters'].OwnerShipCategory = OwnerShipCategory;
      const localities = get(
        state.screenConfiguration,
        "preparedFinalObject.applyScreenMdmsData.tenant.localities",
        []
      );
      if (localities && localities.length > 0) {
        payload.MdmsRes.tenant.localities = localities;
      }
      dispatch(prepareFinalObject("applyScreenMdmsData", payload.MdmsRes));
    } catch (e) {
      console.log(e);
    }
  };
  
  
  
  const getFirstListFromDotSeparated = list => {
    list = list.map(item => {
      if (item.active) {
        return item.code.split(".")[0];
      }
    });
    list = [...new Set(list)].map(item => {
      return { code: item };
    });
    return list;
  };
  export const getData = async (action, state, dispatch) => {
    await getMdmsData(action, state, dispatch);
      }
  
  const screenConfig = {
    uiFramework: "material-ui",
    name: "view-property-detail",
    beforeInitScreen: (action, state, dispatch) => {
      getMDMSPropertyData(dispatch);
  
  
      //Set Module Name
      set(state, "screenConfiguration.moduleName", "egov-pt");
  
      getData(action, state, dispatch).then(responseAction => {
        let tenantId = process.env.REACT_APP_NAME === "Employee" ? getTenantId() : JSON.parse(getUserInfo()).permanentCity;
  
        const queryObj = [{ key: "tenantId", value: tenantId }];
      //   getBoundaryData(action, state, dispatch, queryObj);
         if(process.env.REACT_APP_NAME != "Citizen"){
         let props = get(
           action.screenConfig,
           "components.div.children.formwizardFirstStep.children.propertyLocationDetails.children.cardContent.children.propertyLocationDetailsContainer.children.city.props",
           {}
         );
         props.value = tenantId;
         props.disabled = true;
         set(
           action.screenConfig,
           "components.div.children.formwizardFirstStep.children.propertyLocationDetails.children.cardContent.children.propertyLocationDetailsContainer.children.city.props",
           props
         );
         dispatch(
           prepareFinalObject(
             "Property.address.city",
             tenantId
           )
         );
           }
       
      });
  
  
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
          formwizardFirstStep,
          verifyPropertyFooter
        }
      },
      adhocDialog: {
        uiFramework: "custom-containers-local",
        moduleName: "egov-pt",
        componentPath: "SuccessPTPopupContainer",
        props: {
          open: false,
          maxWidth: "md",
          screenKey: "view-property-detail"
        }
      }    
    }
  };
  
  export default screenConfig;
  