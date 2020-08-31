import {
  dispatchMultipleFieldChangeAction,
  getLabel
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import get from "lodash/get";
import { getCommonApplyFooter, validateFields, showHideAdhocPopupopmsReject, getTextToLocalMapping } from "../../utils";
import "./index.css";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import { httpRequest } from "../../../../../ui-utils";
import {
  createUpdateNocApplication,
  prepareDocumentsUploadData
} from "../../../../../ui-utils/commons";
import { prepareFinalObject, handleScreenConfigurationFieldChange as handleField  } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { invitationtoguests ,updateCommitteemaster,createCommitteemaster} from "../../../../../ui-utils/commons.js";
import { getTenantId} from "egov-ui-kit/utils/localStorageUtils";
import { localStorageGet,localStorageSet, lSRemoveItemlocal, lSRemoveItem} from "egov-ui-kit/utils/localStorageUtils";
import store from "../../../../../ui-redux/store";
const state = store.getState();


// toggleactionmenu
const toggleactionmenu = (state, dispatch) => {
	
  var x = document.getElementById("custom-atoms-footer");
 	 // if (x.style.display === "none") {
   if(window.getComputedStyle(x).display === "none") {   
    x.style.display = "block";
    x.classList.add("addpadding");
	  } else {
    x.style.display = "none";
    x.classList.remove("addpadding");
	  }
}

export const cancelCommittee  = (
  state, dispatch
) => {
  dispatch(prepareFinalObject("PublicRelation[0].CreateCommitteeDetails", {}));
  dispatch(prepareFinalObject("PublicRelation[0].CreateMasterCommitee", {}));
  dispatch(prepareFinalObject("CreateInvite", {}));
  
  const appendUrl =
  process.env.REACT_APP_SELF_RUNNING === "true" ? "/egov-ui-framework" : "";
const reviewUrl = `${appendUrl}/egov-pr/committeeMaster`;
dispatch(setRoute(reviewUrl));

}
const CommitteeSubmit = (state, dispatch) => {


  let committeeUUID=getQueryArg(window.location.href, "committeeUUID");
  let committeeData=''
  if(committeeUUID){
	if(localStorageGet("committeelist")!==null){
		committeeData=JSON.parse(localStorageGet("committeelist"))
	}
	else{
		committeeData=JSON.parse(localStorageGet("committeelistAll"))
	}
	
  let arr=[]
  for(let i=0;i<committeeData.length;i++)
  {
  let obj= {
      "committeeMemberUuid":committeeUUID,
      "userUuid":committeeData[i]['Employee ID'],
      "departmentUuid": committeeData[i]['Department Id'],
      "departmentName":committeeData[i]['DepartmentName'],
      "committeeUuid": "",
      "tenantId": getTenantId(),
      "moduleCode": localStorageGet("modulecode")
      
      }
     // console.log(obj)
      arr.push(obj)
  }
  
        let payload={
          "RequestBody":{
            "committeeUuid":committeeUUID,
            "committeeName":get(
              state.screenConfiguration.preparedFinalObject,
              "PublicRelation[0].CreateCommitteeDetails.committeename"
            ),
            "committeeDescription": "",
            "isActive": true,
            "tenantId": getTenantId(),
            "moduleCode": localStorageGet("modulecode"),
            "committeeMember":arr
          }
            }



        updateCommitteemaster(dispatch,payload);
      
      }
 
  else{
  
 let committeeData=''
	if(localStorageGet("committeelist")!==null){
		 committeeData=JSON.parse(localStorageGet("committeelist"))
	}
	else{
		 committeeData=JSON.parse(localStorageGet("committeelistAll"))
	}
//alert(committeeData.length)
let arr=[]
for(let i=0;i<committeeData.length;i++)
{
let obj= {
    "committeeMemberUuid": "",
    "userUuid":committeeData[i]['Employee ID'],
    "departmentUuid": committeeData[i]['Department Id'],
    "departmentName":committeeData[i]['DepartmentName'],
    "committeeUuid": "",
    "tenantId": getTenantId(),
    "moduleCode": localStorageGet("modulecode")
    
    }
   // console.log(obj)
    arr.push(obj)
}

      let payload={
        "RequestBody":{
          "committeeUuid": "",
          "committeeName":get(
            state.screenConfiguration.preparedFinalObject,
            "PublicRelation[0].CreateCommitteeDetails.committeename"
          ),
          "committeeDescription": "",
          "isActive": true,
          "tenantId": getTenantId(),
          "moduleCode": localStorageGet("modulecode"),
          "committeeMember":arr
        }
          }
        createCommitteemaster(dispatch,payload);
    
    }
 // }
  };


let activeStepforbtn = 0;

const callBackForNext = async (state, dispatch) => {
  toggleactionmenu(state, dispatch)
  let activeStep = get(
    state.screenConfiguration.screenConfig["createCommitteeMaster"],
    "components.div.children.stepper.props.activeStep",
    0
  );
  let committedept=get(
  state.screenConfiguration.preparedFinalObject,
  "PublicRelation[0].CreateCommitteeDetails.organizerDepartmentName"
)
let checkboxcheck=localStorageGet("committeelist")
   activeStepforbtn = activeStep;
    let isFormValid = false;
  //  let hasFieldToaster = false;
  //  let validatestepformflag = validatestepform(activeStep,committedept,checkboxcheck)
  // screenConfiguration.screenConfig.createCommitteeMaster.components.div.children.formwizardFirstStep.children.createCommittee.children.cardContent.children.propertyDetailsConatiner.children
   isFormValid = validateFields(
    "components.div.children.formwizardFirstStep.children.createCommittee.children.cardContent.children.propertyDetailsConatiner.children",
    state,
    dispatch,
    "createCommitteeMaster")
    //  isFormValid = validatestepformflag[0];
    //  hasFieldToaster = validatestepformflag[1];
  
  if(activeStep === 0){
    if(isFormValid==false){
	   let errorMessage = {
					labelName:"Please fill all mandatory fields and select atleast one employee!",
					labelKey: "PR_ERR_FILL_ALL_COMMITTEE_MANDATORY_FIELDS_TOAST"
				  };
			   
			  dispatch(toggleSnackbar(true, errorMessage, "warning"));
    }
    else{
     
      if(localStorageGet("committeelist")!=="[]")
      {
    if(localStorageGet("committeelist")!==null || localStorageGet("committeelistAll") !== null )
    {
			
			
			let selectedrows = localStorageGet("committeelist") === null ? JSON.parse(localStorageGet("committeelistAll")) : JSON.parse(localStorageGet("committeelist"));
			
			let data = selectedrows.map(item => ({
			// alert(item)
			[getTextToLocalMapping("Department")]:
			item.Department || "-",
			[getTextToLocalMapping("Employee Name")]: item['Employee Name'] || "-",
			[getTextToLocalMapping("Mobile No")]: item['Mobile No'] || "-",
			[getTextToLocalMapping("Email ID")]:  item['Email ID'] || "-",
			[getTextToLocalMapping("Department Id")]: item['Department Id'] || "-",
			[getTextToLocalMapping("Employee ID")]:  item['Employee ID'] || "-",
      [getTextToLocalMapping("Designation")]:  item['Designation'] || "-"
     
			}));
			
		
			dispatch(
			handleField(
			"createCommitteeMaster",
			"components.div.children.formwizardSecondStep.children.searchDepartmentEmployeesResults_committee1",			 
			"props.data",
			data
			)
			);
    	
	changeStep(state, dispatch);
  }
  
    else{
      let errorMessage = {
        labelName:"Please fill all mandatory fields and select atleast one employee!",
        labelKey: "PR_ERR_FILL_ALL_COMMITTEE_MANDATORY_FIELDS_TOAST"
        };
       
      dispatch(toggleSnackbar(true, errorMessage, "warning"));
    }
  
}
else{
  let errorMessage = {
    labelName:"Please fill all mandatory fields and select atleast one employee!",
    labelKey: "PR_ERR_FILL_ALL_COMMITTEE_MANDATORY_FIELDS_TOAST"
    };
   
  dispatch(toggleSnackbar(true, errorMessage, "warning"));
}
}
 
  }

  if (activeStep === 1) {
   // moveToReview(state, dispatch);
   changeStep(state, dispatch);
  }
 
};

export const changeStep = (
  state,
  dispatch,
  mode = "next",
  defaultActiveStep = -1
) => {
  let activeStep = get(
    state.screenConfiguration.screenConfig["createCommitteeMaster"],
    "components.div.children.stepper.props.activeStep",
    0
  );
  
  if (defaultActiveStep === -1) {
       activeStep = mode === "next" ? activeStep + 1 : activeStep - 1;
  } else {
    activeStep = defaultActiveStep;
  }

 const isPreviousButtonVisible = activeStep === 1 ? true : false;
  const isNextButtonVisible = activeStep < 1 ? true : false;
  const isPayButtonVisible = activeStep ===1 ? true : false;
  const iscancel = activeStep ===1 ? true : false;
  
  const actionDefination = [
    {
      path: "components.div.children.stepper.props",
      property: "activeStep",
      value: activeStep
    },
    {
      path: "components.div.children.footer.children.previousButton",
      property: "visible",
      value: isPreviousButtonVisible
    },
    {
      path: "components.div.children.footer.children.cancel",
      property: "visible",
      value: iscancel
    },
    {
      path: "components.div.children.footer.children.nextButton",
      property: "visible",
      value: isNextButtonVisible
    },
    {
      path: "components.div.children.footer.children.payButton",
      property: "visible",
      value: isPayButtonVisible
    },

  ];
  dispatchMultipleFieldChangeAction("createCommitteeMaster", actionDefination, dispatch);
  renderSteps(activeStep, dispatch);
};

export const renderSteps = (activeStep, dispatch) => {
  switch (activeStep) {
    case 0:
      dispatchMultipleFieldChangeAction(
        "createCommitteeMaster",
        getActionDefinationForStepper(
          "components.div.children.formwizardFirstStep"
        ),
        dispatch
      );
      break;
    case 1:
      dispatchMultipleFieldChangeAction(
        "createCommitteeMaster",
        getActionDefinationForStepper(
          "components.div.children.formwizardSecondStep"
        ),
        dispatch
      );
      break;
    case 2:
      dispatchMultipleFieldChangeAction(
        "createCommitteeMaster",
        getActionDefinationForStepper(
          "components.div.children.formwizardThirdStep"
        ),
        dispatch
      );
      break;
    default:
      dispatchMultipleFieldChangeAction(
        "createCommitteeMaster",
        getActionDefinationForStepper(
          "components.div.children.formwizardFourthStep"
        ),
        dispatch
      );
  }
};

export const getActionDefinationForStepper = path => {
  const actionDefination = [
    {
      path: "components.div.children.formwizardFirstStep",
      property: "visible",
      value: true
    },
    {
      path: "components.div.children.formwizardSecondStep",
      property: "visible",
      value: false
    },
    {
      path: "components.div.children.formwizardThirdStep",
      property: "visible",
      value: false
    },
    {
      path: "components.div.children.formwizardFourthStep",
      property: "visible",
      value: false
    }
  ];
  for (var i = 0; i < actionDefination.length; i++) {
    actionDefination[i] = {
      ...actionDefination[i],
      value: false
    };
    if (path === actionDefination[i].path) {
      actionDefination[i] = {
        ...actionDefination[i],
        value: true
      };
    }
  }
  return actionDefination;
};

export const callBackForPrevious = (state, dispatch) => {
 // localStorageSet("selectedDepartmentsInvite",[{"key":"REVENUE","cat":"REV01","active":true}]);
 toggleactionmenu(state, dispatch)
  if(localStorageGet("committeelist")!=="[]")
  {
if(localStorageGet("committeelist")!==null || localStorageGet("committeelistAll") !== null )
{
  

  let selectedrows = localStorageGet("committeelist") === null ? JSON.parse(localStorageGet("committeelistAll")) : JSON.parse(localStorageGet("committeelist"));
  
  let data = selectedrows.map(item => ({
  // alert(item)
  [getTextToLocalMapping("Department")]:
  item.Department || "-",
  [getTextToLocalMapping("Employee Name")]: item['Employee Name'] || "-",
  [getTextToLocalMapping("Mobile No")]: item['Mobile No'] || "-",
  [getTextToLocalMapping("Email ID")]:  item['Email ID'] || "-",
  [getTextToLocalMapping("Department Id")]: item['Department Id'] || "-",
  [getTextToLocalMapping("Employee ID")]:  item['Employee ID'] || "-",
  [getTextToLocalMapping("Designation")]:  item['Designation'] || "-"
 
  }));
  

  dispatch(
  handleField(
  "createCommitteeMaster",
  "components.div.children.formwizardSecondStep.children.searchDepartmentEmployeesResults_committee1",			 
  "props.data",
  data
  )
  );
  
//changeStep(state, dispatch);
changeStep(state, dispatch, "previous");

}

else{
  let errorMessage = {
    labelName:"Please fill all mandatory fields and select atleast one employee!",
    labelKey: "PR_ERR_FILL_ALL_COMMITTEE_MANDATORY_FIELDS_TOAST"
    };
   
  dispatch(toggleSnackbar(true, errorMessage, "warning"));
}

}
else{
let errorMessage = {
labelName:"Please fill all mandatory fields and select atleast one employee!",
labelKey: "PR_ERR_FILL_ALL_COMMITTEE_MANDATORY_FIELDS_TOAST"
};

dispatch(toggleSnackbar(true, errorMessage, "warning"));
}


};

 
export const footer = getCommonApplyFooter({
  previousButton: {
    componentPath: "Button",
    props: {
      variant: "outlined",
      color: "primary",
      style: {
        height: "48px",
        marginRight: "16px",
        // width: "30%"
        minWidth: "220px",
        background:"#fff",
        border: "1px solid #ddd" ,
        color: "#000"
        
      }
    },
    gridDefination: {
      xs: 12,
      sm: 12,
      md: 12
    },
    children: {
      
      previousButtonLabel: getLabel({
        labelName: "Previous Step",
        labelKey: "PR_COMMON_BUTTON_PREV_STEP"
      })
    },
    onClickDefination: {
      action: "condition",
      callBack: callBackForPrevious
    },
    visible: false
  },
  
  previousButton: {
    componentPath: "Button",
    props: {
      variant: "outlined",
      color: "primary",
      style: {
        height: "48px",
        marginRight: "16px",
        // width: "30%"
        minWidth: "220px",
        background:"#fff",
        border: "1px solid #ddd" ,
        color: "#000"
        
      }
    },
    gridDefination: {
      xs: 12,
      sm: 12,
      md: 12
    },
    children: {
     
      previousButtonLabel: getLabel({
        labelName: "Previous Step",
        labelKey: "PR_COMMON_BTN_PREV_STEP"
      })
    },
    onClickDefination: {
      action: "condition",
      callBack: callBackForPrevious
    },
    visible: false
  },
  nextButton: {
    componentPath: "Button",
    props: {
      variant: "contained",
      color: "primary",
      style: {
        height: "48px",
        marginRight: "16px",
        // width: "30%"
        minWidth: "220px",
        background:"#fff",
        border: "1px solid #ddd" ,
        color: "#000"
        
      }
    },
    gridDefination: {
      xs: 12,
      sm: 12,
      md: 12
    },
    children: {
      nextButtonLabel: getLabel({
        labelName: "Next Step",
        labelKey: "PR_COMMON_BTN_NXT_STEP"
      }),
     
    },
    onClickDefination: {
      action: "condition",
      callBack: callBackForNext
    }
  },
  payButton: {
    componentPath: "Button",
    props: {
      variant: "contained",
      color: "primary",
      style: {
        height: "48px",
        marginRight: "16px",
        // width: "30%"
        minWidth: "220px",
        background:"#fff",
        border: "1px solid #ddd" ,
        color: "#000"
        
      }
    },
    gridDefination: {
      xs: 12,
      sm: 12,
      md: 12
    },
    children: {
      submitButtonLabel: getLabel({
        labelName: "Submit",
        labelKey: "PR_COMMON_BTN_SUBMIT"
      }),
    
    },
    onClickDefination: {
      action: "condition",
      callBack: CommitteeSubmit
    },
    visible: false
  }, 
 
  cancel: {
    componentPath: "Button",
    props: {
      variant: "outlined",
      color: "primary",
      style: {
        height: "48px",
        marginRight: "16px",
        // width: "30%"
        minWidth: "220px",
        background:"#fff",
        border: "1px solid #ddd" ,
        color: "#000"
        
      }
    },
    gridDefination: {
      xs: 12,
      sm: 12,
      md: 12
    },
    children: {
     
      previousButtonLabel: getLabel({
        labelName: "Cancel",
        labelKey: "PR_COMMON_BUTTON_CANCLE"
      })
    },
    onClickDefination: {
      action: "condition",
      callBack: cancelCommittee
    },
    visible: false
  }
});
export const validatestepform = (activeStep,committedept,checkboxcheck,isFormValid, hasFieldToaster) => {
  
   let allAreFilled = true;
   if (activeStep == 0) {
		activeStep = activeStep+1;
     document.getElementById("apply_form" + activeStep).querySelectorAll("[required]").forEach(function (i) {
       if (!i.value) {
         i.focus();
         allAreFilled = false;
         i.parentNode.classList.add("MuiInput-error-853");
         i.parentNode.parentNode.classList.add("MuiFormLabel-error-844");
       }
       if (i.getAttribute("aria-invalid") === 'true' && allAreFilled) {
         i.parentNode.classList.add("MuiInput-error-853");
         i.parentNode.parentNode.classList.add("MuiFormLabel-error-844");
         allAreFilled = false;
         isFormValid = false;
         hasFieldToaster = true;
       }
     })
 
	if(localStorageGet("committeelist")===null && localStorageGet("committeelistAll")===null)
	{    allAreFilled = false;
		allAreFilled = false;  
		isFormValid = false;
		hasFieldToaster = true;
	}
    
   } 
   if (allAreFilled == false) {
     isFormValid = false;
     hasFieldToaster = true;
   }
   else {
     isFormValid = true;
     hasFieldToaster = false;
   }
   return [isFormValid, hasFieldToaster]
 };


 export const takeactionfooter = getCommonApplyFooter({
  actionbutton: {
    componentPath: "Button",
    props: {
      variant: "contained",
      color: "primary",
      style: {
        height: "48px",
        marginRight: "16px" 
      }
    },
    children: {
       
      pressguestbuttonLabel: getLabel({
        labelName: "Take Action",
        labelKey: "PR_TAKE_ACTION"
      }),
	  nextButtonIcon: {
        uiFramework: "custom-atoms",
        componentPath: "Icon",
        props: {
          iconName: "keyboard_arrow_up"
        }
      },
    },
    onClickDefination: {
      action: "condition",
       callBack: (state, dispatch) =>{
           toggleactionmenu(state, dispatch)
    }
    },
    visible: true
  }
});  
