import {
    getStepperObject,
    getCommonHeader,
    getCommonContainer
  } from "egov-ui-framework/ui-config/screens/specs/utils";  
  import { footer } from "./creatematerialTransferInwordResource/footer";
  import { getstoreTenantId,getmaterialOutwordSearchResults, } from "../../../../ui-utils/storecommonsapi";
  import { getSearchResults } from "../../../../ui-utils/commons";
  import { MaterialTransferInwordDetail } from "./creatematerialTransferInwordResource/Material-transfer-inword-details"; 
  import { MaterialTransferInwordNote } from "./creatematerialTransferInwordResource/Material-transfer-inword-note"; 
  import { otherDetails } from "./creatematerialTransferInwordResource/other-details";
  import set from "lodash/set";
  import get from "lodash/get";
  import map from "lodash/map";
  import { httpRequest } from "../../../../ui-utils";
  import {
    convertDateToEpoch,
  } from "../utils";
  import{GetMdmsNameBycode} from '../../../../ui-utils/storecommonsapi'  
  import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
  import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
  import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
  //import { getEmployeeData } from "./viewResource/functions";
  import { getTenantId,getUserInfo } from "egov-ui-kit/utils/localStorageUtils";
  import {
    IndentConfiguration
  } from "../../../../ui-utils/sampleResponses";
  export const stepsData = [
    { labelName: "Material Transfer Inward", labelKey: "STORE_MATERIAL_TRANSFER_INWARD" },
    {
      labelName: "Material Transfer Inward Details",
      labelKey: "STORE_MATERIAL_TRANSFER_INWARD_DETAILS"
    },
    // { labelName: "Approval Informtion", labelKey: "STORE_MATERIAL_INDENT_NOTE_APPROVAL_INFORMTION" },
    
  ];
  export const stepper = getStepperObject(
    { props: { activeStep: 0 } },
    stepsData
  );

  
export const header = getCommonContainer({
    header: getCommonHeader({
      labelName: `Material Transfer Inward Note`,
      labelKey: "STORE_MATERIAL_TRANSFER_INWORD_NOTE_HEADER"
    })
  });
  
  export const formwizardFirstStep = {
    uiFramework: "custom-atoms",
    componentPath: "Form",
    props: {
      id: "apply_form1"
    },
    children: {
      MaterialTransferInwordNote
    }
  };
  
  export const formwizardSecondStep = {
    uiFramework: "custom-atoms",
    componentPath: "Form",
    props: {
      id: "apply_form2"
    },
    children: {
      MaterialTransferInwordDetail
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
              { name: "ReceiptType", },
              
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
      },

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
  const gettransferOutword = async (action, state, dispatch,id) => {
    const tenantId = getTenantId();
    let queryObject = [
      {
        key: "tenantId",
        value: tenantId
      },
      // {
      //   key: "materialIssueStatus",
      //   value: "APPROVED"
      // }
    
    ];

 //
    if(!id)
    {
      queryObject.push({ key: "materialIssueStatus", value: "APPROVED" })
    }
    try {
      let response = await getmaterialOutwordSearchResults(queryObject, dispatch);
      dispatch(prepareFinalObject("materialOutword", response));
      if (state.screenConfiguration.preparedFinalObject.transferInwards && state.screenConfiguration.preparedFinalObject.transferInwards[0])
      {
        dispatch(prepareFinalObject("materialReceipt[0].TransferOutwordNo.code", state.screenConfiguration.preparedFinalObject.transferInwards[0].issueNumber));
        let materialIssues = get(
          state.screenConfiguration.preparedFinalObject,
          `materialOutword.materialIssues`,
          []
        ); 
        materialIssues =  materialIssues.filter(x=> x.issueNumber === state.screenConfiguration.preparedFinalObject.transferInwards[0].issueNumber)
        if(materialIssues && materialIssues[0]) 
        {
          dispatch(prepareFinalObject("transferInwards[0].issueNumber",materialIssues[0].issueNumber));
          dispatch(prepareFinalObject("transferInwards[0].receivingStore.code",materialIssues[0].toStore.code));
          dispatch(prepareFinalObject("transferInwards[0].issueingStore.code",materialIssues[0].fromStore.code));
          dispatch(prepareFinalObject("transferInwards[0].issueDate", convertDateToEpoch(materialIssues[0].issueDate)));
          dispatch(prepareFinalObject("transferInwards[0].indent.issueStore.code",materialIssues[0].indent.issueStore.code));
          dispatch(prepareFinalObject("transferInwards[0].indent.indentStore.code",materialIssues[0].indent.indentStore.code));
          dispatch(prepareFinalObject("transferInwards[0].indent.indentPurpose",materialIssues[0].indent.indentPurpose));

          let materialIssueDetails = get(
            materialIssues[0],
            'materialIssueDetails',
            []
          )
          let material =[]
          for (let index = 0; index < materialIssueDetails.length; index++) {
            const element = materialIssueDetails[index];
            let matname = GetMdmsNameBycode(state, dispatch,`createScreenMdmsData.store-asset.Material`,element.material.code)
            material.push(
              {
                code:element.material.code,
                name:matname,
                uom:element.uom,
                unitRate:1,
                quantityIssued:element.quantityIssued,
              }
            )
            
          }

          dispatch(prepareFinalObject("indentsOutmaterial", material));
        }
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
    name: "createMaterialTransferInword",
    // hasBeforeInitAsync:true,
    beforeInitScreen: (action, state, dispatch) => {
     
      let tenantId = getstoreTenantId();
      const mdmsDataStatus = getMdmsData(state, dispatch, tenantId);
      const id = getQueryArg(window.location.href, "id");
      const storedata = gettransferOutword(action,state, dispatch,id);
      const step = getQueryArg(window.location.href, "step");
      tenantId = getQueryArg(window.location.href, "tenantId");
      if(!step && !tenantId){
        dispatch(prepareFinalObject("transferInwards[0]",null));
      }
     // SEt Default data

     dispatch(
      prepareFinalObject(
        "transferInwards[0].receiptType",
        "INWARD RECEIPT",
      )
    );
    dispatch(
      prepareFinalObject(
        "transferInwards[0].mrnStatus",
        "CREATED",
      )
    );
    dispatch(
      prepareFinalObject(
        "transferInwards[0].designation",
        "ASST-ENG",
      )
    );
    dispatch(
      prepareFinalObject(
        "transferInwards[0].receivedBy",
        "sanjeev",
      )
    );
    dispatch(
      prepareFinalObject(
        "transferInwards[0].inspectedBy",
        "Ramesh",
      )
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
  



