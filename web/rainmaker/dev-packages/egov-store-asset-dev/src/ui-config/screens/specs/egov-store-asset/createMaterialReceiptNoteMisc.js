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
  import { commonTransform, objectArrayToDropdown } from "../utils";
  import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
  import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
  import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
  //import { getEmployeeData } from "./viewResource/functions";
  import { getTenantId,getUserInfo } from "egov-ui-kit/utils/localStorageUtils";
  import {totalValue} from './creatematerialReceiptNoteMiscResource/totalValue';
  import {
    IndentConfiguration
  } from "../../../../ui-utils/sampleResponses";
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
              
            ],
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
    name: "createMaterialReceiptNoteMisc",
    // hasBeforeInitAsync:true,
    beforeInitScreen: (action, state, dispatch) => {
     
      let tenantId = getstoreTenantId();
      const mdmsDataStatus = getMdmsData(state, dispatch, tenantId);
      const storedata = getstoreData(action,state, dispatch);
      const step = getQueryArg(window.location.href, "step");
      tenantId = getQueryArg(window.location.href, "tenantId");
      if(!step && !tenantId){
        dispatch(prepareFinalObject("materialReceipt[0]",null));
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

   
     // SEt Default data End
     
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
  



