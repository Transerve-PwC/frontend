import {
  getCommonContainer,
  getCommonHeader,
  getStepperObject,
  getBreak,
  getCommonParagraph ,
  getLabel,
  getCommonCard 
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { getCurrentFinancialYear } from "../utils";
import { Invitefooter, takeactionfooter } from "./inviteResources/footer";
import { eventDetails } from "./applyResource/eventDetails";
import { eventDescription } from "./applyResource/eventDescription";
import { propertyDetails } from "./applyResource/propertyDetails";
import { propertyLocationDetails } from "./applyResource/propertyLocationDetails";
import { applicantDetails, pressDetails , searchemployee, EmailSmsContent} from "./inviteResources/applicantDetails";
import { documentDetails } from "./inviteResources/documentDetails";
import { searchDepartmentEmployeesResults, searchInvitedEmployeesResults } from "./inviteResources/searchResults";
import { getEventInviteeList} from "./searchResource/citizenSearchFunctions";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import {
  prepareFinalObject,
  handleScreenConfigurationFieldChange as handleField
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getTenantId, localStorageGet, localStorageSet,lSRemoveItemlocal,lSRemoveItem } from "egov-ui-kit/utils/localStorageUtils";
import { httpRequest } from "../../../../ui-utils";
import "../../../../customstyle.css";
  import commonConfig from '../../../../config/common';
  import {  deleteguestbyid} from "./searchResource/citizenSearchFunctions"

import {
  sampleSearch,
  sampleSingleSearch,
  sampleDocUpload
} from "../../../../ui-utils/sampleResponses";
import set from "lodash/set";
import get from "lodash/get";
import {
  prepareDocumentsUploadData,
 
  furnishNocResponse,
  setApplicationNumberBox,
  getsampleemailtemplate
} from "../../../../ui-utils/commons";

export const stepsData = [
  { labelName: "Invite Guests", labelKey: "PR_INVITE_GUESTS" },
  { labelName: "EMAIL/SMS Content", labelKey: "PR_EMAIL_SMS_CONTENT" },
  
];
export const stepper = getStepperObject(
  { props: { activeStep: 0 } },
  stepsData
);

export const ConfirmMsg = getCommonContainer({
   
  msgContainer: getCommonContainer({
    subText: getCommonParagraph({
      labelName: "Are you sure you want to remove this guest?",
      
      labelKey: "PR_CONFIRM_MSG"
    }
    ,
      
      {
        style: {
          wordBreak:"break-all"
        }
      }
    ),
  }),
    break: getBreak(),
    btnContainer: getCommonContainer({

    cancel: {
      componentPath: "Button",
      props: {
        variant: "outlined",
      //  color: "primary",
        style: {
          color: "rgb(254, 122, 81)",
          border: "1px solid rgb(254, 122, 81)",
          borderRadius: "2px",
          height: "38px",
          marginRight: "16px",
          marginTop: "40px",
          minWidth:"80px",

        }
      },
      children: {
        nextButtonLabel: getLabel({
          labelName: "Cancel",
          labelKey: "PR_BUTTON_CANCEL"
        }),
  
      },
      onClickDefination: {


        action: "condition",
        callBack: (action, state, dispatch) => { window.location.reload(); }
      }
    },
    submit: {
      componentPath: "Button",
      props: {
        variant: "contained",
       color: "primary",
        style: {
         
            borderRadius: "2px",
            height: "38px",
            marginRight: "16px",
            marginTop: "40px",
            minWidth:"80px",

        }
      },
      children: {
        nextButtonLabel: getLabel({
          labelName: "Ok",
          labelKey: "PR_OK_BUTTON"
        }),
        
      },
      onClickDefination: {


        action: "condition",
        callBack:deleteguestbyid
      }
    }

  })
});
const eventifforinvitatoin = getQueryArg(
    window.location.href,
    "id"
  );
  
  localStorageSet("eventifforinvitatoin", eventifforinvitatoin);
  localStorageSet("templateMappedUuid", eventifforinvitatoin);
  localStorageSet("templateType", "CREATE_EVENT");
  localStorageSet("templateModuleName", "EVENT");

const applicationNumberContainer = () => {
  const applicationNumber = getQueryArg(
    window.location.href,
    "applicationNumber"
  );
  if (applicationNumber)
    return {
      uiFramework: "custom-atoms-local",
      moduleName: "egov-pr",
      componentPath: "ApplicationNoContainer",
      props: {
        number: `${applicationNumber}`,
        visibility: "hidden"
      },
      visible: true
    };
  else return {};
};

export const header = getCommonContainer({
  header: getCommonHeader({
    labelName: `Invite Guests`, //later use getFinancialYearDates
    labelKey: "PR_INVITE_GUESTS_HEADER"
  }),
  
});

export const formwizardFirstStep = {
  uiFramework: "custom-atoms",
  componentPath: "Form",
  props: {
    id: "apply_form1"
  },
  children: {
   applicantDetails,
	  break: getBreak(),
	 searchDepartmentEmployeesResults,
	  break: getBreak(),
	  searchInvitedEmployeesResults,
	   break: getBreak(),
	 documentDetails,
	  break: getBreak(),
		pressDetails 
    }
};

export const formwizardSecondStep = {
  uiFramework: "custom-atoms",
  componentPath: "Form",
  props: {
    id: "apply_form2"
  },
  children: {
    EmailSmsContent 
  },
  visible: false
};


const getMdmsData = async (action, state, dispatch) => {
  
   let mdmsBody = {
    MdmsCriteria: {
      tenantId: commonConfig.tenantId,
      moduleDetails: [
        {
          moduleName: "RAINMAKER-PR",
          masterDetails: [{ name: "eventType" }, { name: "eventStatus" },{ name: "eventDocuments" },  { name: "eventSector" }]
        },
        {
          moduleName: "tenant",
          masterDetails: [
            {
              name: "tenants"
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
        },
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
  let tenantId =
    get(
      state.screenConfiguration.preparedFinalObject,
      "PublicRelations[0].PublicRelationDetails.propertyDetails.address.city"
    ) || getTenantId();
  let mdmsBody = {
    MdmsCriteria: {
      tenantId: tenantId,
      moduleDetails: [
        {
          moduleName: "common-masters",
          masterDetails: [{ name: "Department" }]
        },
        { moduleName: "PublicRelation", masterDetails: [{ name: "Documents" }] }
      ]
    }
  };
  try {
    let payload = null;
	 const queryStr = [
        { key: "moduleName", value: "masters" },
        { key: "tenantId", value: tenantId },
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
  let tenantId =
    get(
      state.screenConfiguration.preparedFinalObject,
      "PublicRelations[0].PublicRelationDetails.propertyDetails.address.city"
    ) || getTenantId();
  let mdmsBody = {
    MdmsCriteria: {
      tenantId: tenantId,
      moduleDetails: [
        {
          moduleName: "common-masters",
          masterDetails: [{ name: "OwnerType" }, { name: "OwnerShipCategory" }]
        },
        {
          moduleName: "PublicRelation",
          masterDetails: [{ name: "BuildingType" }, { name: "PRStations" }]
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
        },
        { moduleName: "PublicRelation", masterDetails: [{ name: "Documents" }] }
      ]
    }
  };
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


// export const prepareEditFlow = async (
//   state,
//   dispatch,
//   applicationNumber,
//   tenantId
// ) => {
//   const buildings = get(
//     state,
//     "screenConfiguration.preparedFinalObject.PublicRelations[0].PublicRelationDetails.buildings",
//     []
//   );
//   if (applicationNumber && buildings.length == 0) {
//     let response = await getSearchResults([
//       {
//         key: "tenantId",
//         value: tenantId
//       },
//       { key: "applicationNumber", value: applicationNumber }
//     ]);
   
//     response = furnishNocResponse(response);

//     dispatch(prepareFinalObject("PublicRelations", get(response, "PublicRelations", [])));
//     if (applicationNumber) {
//       setApplicationNumberBox(state, dispatch, applicationNumber);
//     }
//   }
// };

const screenConfig = {
  uiFramework: "material-ui",
  name: "createInvite",
  beforeInitScreen: (action, state, dispatch) => {
    const applicationNumber = getQueryArg(
      window.location.href,
      "applicationNumber"
    );
    const tenantId = getQueryArg(window.location.href, "tenantId");
    const step = getQueryArg(window.location.href, "step");
	
	lSRemoveItemlocal("selectedDepartmentsInvite");
	lSRemoveItem("selectedDepartmentsInvite");
	lSRemoveItemlocal("selectedPressList");
	lSRemoveItem("selectedPressList");
  // Get Invitee List
  localStorageSet("EmailTemplate", "")
	localStorageSet("EmailTemplatesubject", "")
  localStorageSet("smsTemplate", "")
  localStorageSet("email", "")
  localStorageSet("sms", "")



	getEventInviteeList(action, state, dispatch);
	
	// Get Sample email tmplate for event 
	getsampleemailtemplate(action, state, dispatch);
	
	
    //Set Module Name
    set(state, "screenConfiguration.moduleName", "PublicRelations");

    // Set MDMS Data
    getMdmsData(action, state, dispatch).then(response => {
      prepareDocumentsUploadData(state, dispatch);
    });
 
      GetDepartments(action, state, dispatch).then(response => {
	  });
	  
	 // prepareEditFlow(state, dispatch, applicationNumber, tenantId);

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
          `components.div.children.Invitefooter.children.previousButton.visible`,
          step != 0
        );
      }
    }

    set(
        action.screenConfig,
        "components.div.children.formwizardFirstStep.children.searchDepartmentEmployeesResults",
        { visibility: "hidden" }
      );
	set(
        action.screenConfig,
        "components.div.children.formwizardFirstStep.children.applicantDetails",
        { visibility: "hidden" }
      );  
	  
	  set(
        action.screenConfig,
        "components.div.children.formwizardFirstStep.children.documentDetails",
        { visibility: "hidden" }
      ); 
	  
	  set(
        action.screenConfig,
        "components.div.children.formwizardFirstStep.children.pressDetails",
        { visibility: "hidden" }
      ); 
	 
	 
	  set(
		action.screenConfig,  "components.div.children.formwizardSecondStep.children.EmailSmsContent.children.cardContent.children.SMSContent.props.value",
        localStorageGet("smsTemplate")
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
        Invitefooter,
		takeactionfooter
      }
    },
	 adhocDialogpress: {
      uiFramework: "custom-containers-local",
      moduleName: "egov-pr",
      componentPath: "PressInviteContainer",
      props: {
        open: false,
        maxWidth: "md",
        screenKey: "createInvite"
      },
      children: {

        popup: pressDetails
        
      }
    },
    adhocDialogexternal: {
      uiFramework: "custom-containers-local",
      moduleName: "egov-pr",
      componentPath: "ExternalInviteContainer",
      props: {
        open: false,
        maxWidth: "md",
        screenKey: "createInvite"
      },
      children: {

        popup: documentDetails

      }
    },
    adhocDialoginternal: {
      uiFramework: "custom-containers-local",
      moduleName: "egov-pr",
      componentPath: "InternalInviteContainer",
      props: {
        open: false,
        maxWidth: "md",
        screenKey: "createInvite"
      },
      children: {
        popup: applicantDetails,
		 break: getBreak(),
		break: getBreak(),
		//  searchheader: getCommonHeader({
		// 		labelName: "Employee Search",
		// 		labelKey: "PR_EMPLOYEE_SEARCH"
    //   }),	
      subText: getCommonParagraph({
        labelName: "Employee Search",
				labelKey: "PR_EMPLOYEE_SEARCH"
      },
      {
        style:{
          marginLeft:"25px",
        }
      }),


		grid : searchDepartmentEmployeesResults
      }
    },
	adhocDialog: {
      uiFramework: "custom-containers-local",
      moduleName: "egov-pr",
      componentPath: "DialogContainer",
      props: {
        open: false,
        maxWidth: "xs",
        screenKey: "createInvite"
      },
      children: {
        popup: ConfirmMsg
      }
    },
  }
};

export default screenConfig;
