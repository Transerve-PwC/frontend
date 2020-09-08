import {
    getCommonContainer,
    getCommonHeader,
    getStepperObject,
    getBreak
  } from "egov-ui-framework/ui-config/screens/specs/utils";
  import { getTextToLocalMapping } from "../utils";
  import { footer,takeactionfooter } from "./committeeResource/footer";
  import { searchDepartmentEmployeesResults_committee1,searchDepartmentEmployeesResults,searchDepartmentEmployeesResults_committee,searchDepartmentEmployeesResults1, searchInvitedEmployeesResults } from "./committeeResource/searchResults";
  import { GetCommiteeEmployees} from "./searchResource/citizenSearchFunctions";
  import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
  import {
    prepareFinalObject,
    handleScreenConfigurationFieldChange as handleField
  } from "egov-ui-framework/ui-redux/screen-configuration/actions";
  import { getTenantId, localStorageGet, localStorageSet,lSRemoveItemlocal,lSRemoveItem } from "egov-ui-kit/utils/localStorageUtils";
  import { httpRequest } from "../../../../ui-utils";
  
  import set from "lodash/set";
  import get from "lodash/get";
  import {
    prepareDocumentsUploadData,
    
    furnishResponse_Committee,
   
    getCommittiee
  } from "../../../../ui-utils/commons";
  import { createCommittee } from "./committeeResource/createCommittee";
  import { selectCommitteeMember } from "./committeeResource/selectCommitteeMember"
  
  import commonConfig from '../../../../config/common';
  
  export const stepsData = [
    { labelName: "Create Commitee Details", labelKey: "PR_CREATE_COMMITTEE" },
    { labelName: "Commitee Member List", labelKey: "PR_COMMITTEE_MEMBER" },
   
  ];
  export const stepper = getStepperObject(
    { props: { activeStep: 0 } },
    stepsData
  );
  
 
  export const header = getCommonContainer({
    header: getCommonHeader({
      labelName: `Create Commitee`, //later use getFinancialYearDates
      labelKey: "PR_CREATE_COMMITTE_CARD"
      
      
    }),

  });
  
  export const formwizardFirstStep = {
    uiFramework: "custom-atoms",
    componentPath: "Form",
    props: {
      id: "apply_form1"
    },
    children: {
     
    createCommittee,
    break: getBreak(),
    selectCommitteeMember,
    break: getBreak(),
	
    searchDepartmentEmployeesResults_committee,
   
      
      }
  };
  
  export const formwizardSecondStep = {
    uiFramework: "custom-atoms",
    componentPath: "Form",
    props: {
      id: "apply_form2"
    },
    children: {
      searchDepartmentEmployeesResults_committee1
    },
    visible: false
  };
  
  const getMdmsData = async (action, state, dispatch) => {
    let tenantId = commonConfig.tenantId;
     let mdmsBody = {
      MdmsCriteria: {
        tenantId: tenantId,
        moduleDetails: [
          {
            moduleName: "common-masters",
            masterDetails: [
              {
                name: "Department"
              }
            ]
          },
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
      dispatch(prepareFinalObject("applyScreenMdmsData", payload.MdmsRes));
    } catch (e) {
      console.log(e);
    }
  };
  
  
  // Get Departments 
  const GetDepartments = async (action, state, dispatch) => {
    let tenantId = getTenantId();
    let mdmsBody = {
      MdmsCriteria: {
        tenantId: tenantId,
        moduleDetails: [
          {
            moduleName: "common-masters",
            masterDetails: [{ name: "Department" }]
          },
         
        ]
      }
    };
    try {
      let payload = null;
       const queryStr = [
          { key: "moduleName", value: "masters" },
          { key: "tenantId", value: getTenantId() },
          { key: "masterName", value: "setContentToState" },
        ];
       
      payload = await httpRequest(
        "post",
        "egov-mdms-service/v1/_search",
        "_search",
        queryStr,
        mdmsBody
      );
      dispatch(prepareFinalObject("applyScreenMdmsData.departments", payload));
    } catch (e) {
      console.log(e);
    }
  };
  
  
  // GET EMPLOYEES
  const GetEmployees = async (action, state, dispatch) => {
    let tenantId = getTenantId();
   
    try {
      let payload = null;
       const queryStr = [
          { key: "departments", value: action.value },
        ]
      payload = await httpRequest(
        "post",
        "/egov-hrms/employees/_search",
        "_search",
        queryStr,
        {}
      );
      dispatch(prepareFinalObject("applyScreenMdmsData.employees", payload));
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
  
    
  export const prepareEditFlow = async (
    state,
    dispatch,
  
    tenantId
  ) => {
  
    let id=getQueryArg(window.location.href, "committeeUUID")
    if (id) {
      let payload={
        "tenantId": getTenantId(),
        "RequestBody":{
        
        "committeeUuid": getQueryArg(window.location.href, "committeeUUID"),
        "committeeName": "",
        "committeeDescription": "",
        "isActive": true,
        "tenantId": getTenantId(),
        "moduleCode": localStorageGet("modulecode"),
        "committeeMember": [ ]
        }
        }
         
      let response = await getCommittiee(payload);
     
		let temparray = [];
		let bucket = [];
		response.ResponseBody[0].committeeMember.map(item => {
			let temp= { cat: item.departmentName}
			
			if(!bucket.includes(item.departmentName))
			{	temparray.push(temp)  }
			
			bucket.push(item.departmentName)
		});
		
		
		localStorageSet("selectedDepartmentsInvite",JSON.stringify(temparray));
  let Refurbishresponse = furnishResponse_Committee(response);
  let empdata=await GetCommiteeEmployees(state, dispatch,response.ResponseBody[0].committeeMember[0].departmentName
  )

let selectedrowslocal=[];
let selectedRows=[];
empdata.map(function (item, index) {
  if(item.user!=null && item.user.uuid){

  response.ResponseBody[0].committeeMember.map(function (commiteeMember,index1) {
    if(commiteeMember.userUuid===item.user.uuid){
     
      let obj={}
      obj['Department']=item.assignments[0].EmpName
      obj['Designation']=item.assignments[0].DesignationName
      obj['Employee Name']=item.user.name
      obj['Mobile No']=item.user.mobileNumber
      obj['Email ID']=item.user.emailId
      obj['Department Id']=commiteeMember.departmentUuid
      obj['Employee ID']=commiteeMember.userUuid
      obj['DepartmentName']=item.assignments[0].department
      obj['index']=index
      
      selectedrowslocal.push(obj)
      selectedRows.push(index)
      localStorageSet("committeelist", JSON.stringify(selectedrowslocal));
      let data = selectedrowslocal.map(item => ({
      
        [getTextToLocalMapping("Department")]:
        item.Department || "-",
        [getTextToLocalMapping("Designation")]: item.Designation || "-",
        
         [getTextToLocalMapping("Employee Name")]: item['Employee Name'] || "-",
         [getTextToLocalMapping("Mobile No")]: item['Mobile No'] || "-",
         [getTextToLocalMapping("Email ID")]:  item['Email ID'] || "-",
         [getTextToLocalMapping("Department Id")]: item['Department Id'] || "-",
         [getTextToLocalMapping("Employee ID")]:  item['Employee ID'] || "-",
         
        
        
       }));
     
      
      dispatch(
        handleField(
          "createCommitteeMaster",
          "components.div.children.formwizardSecondStep.children.searchDepartmentEmployeesResults_committee1",
          "props.data",
          data
        )
      );
    }
  });
}
  });
dispatch(
  handleField(
    "createCommitteeMaster",
    "components.div.children.formwizardFirstStep.children.searchDepartmentEmployeesResults_committee.children.cardContent.children.committieegrid",
    "props.options.rowsSelected",
    selectedRows
  )
);


      dispatch(prepareFinalObject("PublicRelation[0].CreateCommitteeDetails", Refurbishresponse));

      dispatch(prepareFinalObject("PublicRelation[0].CreateMasterCommitee", Refurbishresponse));
      
         }
  };
  
  const screenConfig = {
    uiFramework: "material-ui",
    name: "createCommitteeMaster",
    beforeInitScreen: (action, state, dispatch) => {
      dispatch(prepareFinalObject("PublicRelation[0].CreateCommitteeDetails", {}));
      dispatch(prepareFinalObject("PublicRelation[0].CreateMasterCommitee", {}));
      dispatch(prepareFinalObject("CreateInvite", {}));
      
     const tenantId = getQueryArg(window.location.href, "tenantId");
      const step = getQueryArg(window.location.href, "step");
      localStorageSet("committeelist",[]);
      localStorageSet("committeelistAll",[]);
     
  lSRemoveItem("selectedDepartmentsInvite");
  lSRemoveItemlocal("selectedDepartmentsInvite");
      //Set Module Name
      set(state, "screenConfiguration.moduleName", "PublicRelations");
  
      // Set MDMS Data
      getMdmsData(action, state, dispatch).then(response => {
   
        // Set Documents Data (TEMP)
        prepareDocumentsUploadData(state, dispatch);
      });
   
        GetDepartments(action, state, dispatch).then(response => {
          
              
        });
        
      // Search in case of EDIT flow
      prepareEditFlow(state, dispatch, tenantId);
  
       
      // Code to goto a specific step through URL
      if (step && step.match(/^\d+$/)) {
        let intStep = parseInt(step);
        set(
          action.screenConfig,
          "components.div.children.stepper.props.activeStep",
          intStep
        );
        let formWizardNames = [
          "formwizardFirstStep",
          "formwizardSecondStep",
          
        ];
        for (let i = 0; i < 1; i++) {
          set(
            action.screenConfig,
            `components.div.children.${formWizardNames[i]}.visible`,
            i == step
          );
          set(
            action.screenConfig,
            `components.div.children.footer.children.previousButton.visible`,
            step != 0
          );
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
        
          footer,
          takeactionfooter
        }
      },
      
      adhocDialog: {
        uiFramework: "custom-containers-local",
        moduleName: "egov-pr",
        componentPath: "DialogContainer",
        props: {
          open: false,
          maxWidth: "md",
          screenKey: "search-preview"
        },
        children: {
        }
      },
    }
  };
  
  export default screenConfig;
  