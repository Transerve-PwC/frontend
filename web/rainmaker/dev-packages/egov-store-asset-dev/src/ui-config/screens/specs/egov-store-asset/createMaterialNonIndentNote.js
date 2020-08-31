import {
    getStepperObject,
    getCommonHeader,
    getCommonContainer
  } from "egov-ui-framework/ui-config/screens/specs/utils";  
  import { footer } from "./creatematerialNonindentnoteResource/footer";
  import { getstoreTenantId,getStoresSearchResults, } from "../../../../ui-utils/storecommonsapi";
  import { IndentMaterialIssueDetails } from "./creatematerialNonindentnoteResource/Material-indent-note"; 
  import { materialIssue } from "./creatematerialNonindentnoteResource/Material-issue-note-map"; 
  import { otherDetails } from "./creatematerialNonindentnoteResource/other-details";
  import {totalValue} from './creatematerialNonindentnoteResource/totalValue';
  import set from "lodash/set";
  import get from "lodash/get";
  import map from "lodash/map";
  import { httpRequest } from "../../../../ui-utils";
  import { getSearchResults } from "../../../../ui-utils/commons";
  import { commonTransform, objectArrayToDropdown } from "../utils";
  import { prepareFinalObject,  handleScreenConfigurationFieldChange as handleField } from "egov-ui-framework/ui-redux/screen-configuration/actions";
  import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
  import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
  //import { getEmployeeData } from "./viewResource/functions";
  import { getTenantId } from "egov-ui-kit/utils/localStorageUtils";
  import {
    NonIndentConfiguration
  } from "../../../../ui-utils/sampleResponses";
  export const stepsData = [
    { labelName: "Non-Indent Material Issue ", labelKey: "STORE_MATERIAL_INDENT_NOTE_NON_INDENT_MATERIAL_ISSUE_NOTE" },
    {
      labelName: "Non-Indent Material Issue Details",
      labelKey: "STORE_MATERIAL_INDENT_NOTE_NON_INDENT_MATERIAL_ISSUE_NOTE_DETAILS"
    },
    { labelName: "Approval Informtion", labelKey: "STORE_MATERIAL_INDENT_NOTE_APPROVAL_INFORMTION" },
    
  ];
  export const stepper = getStepperObject(
    { props: { activeStep: 0 } },
    stepsData
  );

  
export const header = getCommonContainer({
    header: getCommonHeader({
      labelName: `Non-Indent Material Issue Note `,
      labelKey: "STORE_MATERIAL_INDENT_NOTE_NON_INDENT_MATERIAL_ISSUE_NOTE_HEADER"
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
      dispatch(prepareFinalObject("store", response));
    } catch (e) {
      console.log(e);
    }
  };
  const getSupllierData = async (  action, state,dispatch,)=>{
    const tenantId = getTenantId();
    let queryObject = [
      {
        key: "tenantId",
        value: tenantId
      }];
    try {
      let response = await getSearchResults(queryObject, dispatch,"supplier");
      dispatch(prepareFinalObject("supplier", response));
    } catch (e) {
      console.log(e);
    }
  }
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
    name: "createMaterialNonIndentNote",
    // hasBeforeInitAsync:true,
    beforeInitScreen: (action, state, dispatch) => {
     
      const tenantId = getstoreTenantId();
      const mdmsDataStatus = getMdmsData(state, dispatch, tenantId);
      const storedata = getstoreData(action,state, dispatch);
      const SupllierData = getSupllierData(action,state, dispatch);
      const step = getQueryArg(window.location.href, "step");
      const issueNoteNumber = getQueryArg(window.location.href, "issueNoteNumber");
      if(!step && !issueNoteNumber){
        dispatch(prepareFinalObject("materialIssues[0]",null));
      }
     // SEt Default data

     dispatch(
      prepareFinalObject(
        "materialIssues[0].materialIssueStatus",
        NonIndentConfiguration().materialIssueStatus,
      )
    );
    dispatch(
      prepareFinalObject(
        "materialIssues[0].issueType",
        NonIndentConfiguration().IssueType.NONINDENTISSUE,
      )
    );
    dispatch(
      prepareFinalObject(
        "materialIssues[0].issuedToEmployee",
        "shipra",
      )
    );
    dispatch(
      prepareFinalObject(
        "materialIssues[0].indent",
        null,
      )
    );
    //Set supplier visibility based on  issuePurpose
 let issuePurpose =
 get(state, "ProcessInstances[0].employeeOtherDetails.issuePurpose") 
 issuePurpose = "RETURNTOSUPPLIER";
   
 if(issuePurpose ==='RETURNTOSUPPLIER')
 {
  dispatch(
    handleField(
      "createMaterialNonIndentNote",
      "components.div.children.formwizardFirstStep.children.IndentMaterialIssueDetails.children.cardContent.children.IndentMaterialIssueContainer.children.supplier",
      "props.style",
      { display: "none" }
      
    )
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
  



