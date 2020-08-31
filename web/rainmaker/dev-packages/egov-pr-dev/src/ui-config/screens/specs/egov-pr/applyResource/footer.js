import {
  dispatchMultipleFieldChangeAction,
  getLabel
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import get from "lodash/get";
import { getCommonApplyFooter, validateFields } from "../../utils";
import "./index.css";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import { httpRequest } from "../../../../../ui-utils";
import {
  createUpdateEvent,
  prepareDocumentsUploadData
} from "../../../../../ui-utils/commons";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getTenantId } from "../../../../../../../../packages/lib/egov-ui-kit/utils/localStorageUtils/index";
import { localStorageGet, localStorageSet } from "egov-ui-kit/utils/localStorageUtils";
import commonConfig from '../../../../../config/common';
import {
  
  handleScreenConfigurationFieldChange as handleField
} from "egov-ui-framework/ui-redux/screen-configuration/actions";



const setReviewPageRoute = (state, dispatch,responseMessage) => {
let id=getQueryArg(window.location.href, "eventuuId")            

	if(id){
      let tenantId = getTenantId()
      const eventId = get(
        state,
        "screenConfiguration.preparedFinalObject.PublicRelation[0].SummaryEventDetails.eventId"
      );
     
    
      const eventStatus = get(
        state,
        "screenConfiguration.preparedFinalObject.PublicRelation[0].SummaryEventDetails.status"
      );
  const appendUrl =
    process.env.REACT_APP_SELF_RUNNING === "true" ? "/egov-ui-framework" : "";
  const reviewUrl = `${appendUrl}/egov-pr/summary?eventuuId=${id}&eventId=${eventId}&status=${eventStatus}&responseMessage=${responseMessage}&tenantId=${tenantId}&eventstatus=PUBLISHED`;
  dispatch(setRoute(reviewUrl));
	}
	else{
	
	
  let tenantId = getTenantId()
 
  const eventId = get(
    state,
    "screenConfiguration.preparedFinalObject.EVENT.ResponseBody.eventId"
  );
  const eventuuId = get(
    state,
    "screenConfiguration.preparedFinalObject.EVENT.ResponseBody.eventDetailUuid"
  );

  const eventStatus = get(
    state,
    "screenConfiguration.preparedFinalObject.EVENT.ResponseBody.status"
  );
  const page="apply"
  const appendUrl =
    process.env.REACT_APP_SELF_RUNNING === "true" ? "/egov-ui-framework" : "";
  const reviewUrl = `${appendUrl}/egov-pr/summary?eventId=${eventId}&eventuuId=${eventuuId}&page=${page}&status=${eventStatus}&responseMessage=${responseMessage}&eventstatus=PUBLISHED&tenantId=${tenantId}`;
  dispatch(setRoute(reviewUrl));
	}
};
const moveToReview = (state, dispatch) => {
  
  const documentsFormat = Object.values(
    get(state.screenConfiguration.preparedFinalObject, "documentsUploadRedux")
  );

  let validateDocumentField = false;

  for (let i = 0; i < documentsFormat.length; i++) {
    let isDocumentRequired = get(documentsFormat[i], "isDocumentRequired");
    let isDocumentTypeRequired = get(
      documentsFormat[i],
      "isDocumentTypeRequired"
    );

    let documents = get(documentsFormat[i], "documents");
    if (isDocumentRequired) {
      if (documents && documents.length > 0) {
        if (isDocumentTypeRequired) {
          if (get(documentsFormat[i], "dropdown.value")) {
            validateDocumentField = true;
          } else {
            dispatch(
              toggleSnackbar(
                true,
                { labelName: "Please select type of Document!", labelKey: "" },
                "warning"
              )
            );
            validateDocumentField = false;
            break;
          }
        } else {
          validateDocumentField = true;
        }
      } else {
        dispatch(
          toggleSnackbar(
            true,
            { labelName: "Please uplaod mandatory documents!", labelKey: "" },
            "warning"
          )
        );
        validateDocumentField = false;
        break;
      }
    } else {
      validateDocumentField = true;
    }
  }

  if (validateDocumentField) {
    setReviewPageRoute(state, dispatch);
  }
};

const getMdmsData = async (state, dispatch) => {
  //let tenantId = getTenantId();
  let mdmsBody = {
    MdmsCriteria: {
      tenantId: commonConfig.tenantId,
      moduleDetails: [
        {
          moduleName: "RAINMAKER-PR",
          masterDetails: [{ name: "eventType" }, { name: "eventStatus" },{ name: "eventDocuments" }, { name: "eventSector" }]
        },
      ]
    }
  };
  try {
    let payload = await httpRequest(
      "post",
      "/egov-mdms-service/v1/_search",
      "_search",
      [],
      mdmsBody
    );

    dispatch(
      prepareFinalObject(
        "applyScreenMdmsData.PublicRelation.Documents",
        payload.MdmsRes.PublicRelation.Documents
      )
    );
    prepareDocumentsUploadData(state, dispatch);
  } catch (e) {
    console.log(e);
  }
};

const callBackForNext = async (state, dispatch) => {
  //screenConfiguration.preparedFinalObject.PublicRelation[0].CreateEventDetails.startDate1
 let startDate= get(
    state.screenConfiguration.preparedFinalObject,
    "PublicRelation[0].CreateEventDetails.startDate1",
    
  );
  let endDate= get(
    state.screenConfiguration.preparedFinalObject,
    "PublicRelation[0].CreateEventDetails.endDate1",
    
  );
  var d = new Date();
 
var currDate=d.toISOString().split('T')[0]
if(startDate>endDate)
{

  dispatch(
    toggleSnackbar(
      true,
      {
        labelName: "From Date should be less than todate",
        labelKey: "ERR_FILL_FROM_DATE_<_TODATE"
      },
      "warning"
    )
  );
}
else if(currDate>startDate){

  dispatch(
    toggleSnackbar(
      true,
      {
        labelName: "From Date should be greater than current date",
        labelKey: "ERR_FILL_STARTDATE_VALID"
      },
      "warning"
    )
  );
}
else{

  let activeStep = get(
    state.screenConfiguration.screenConfig["apply"],
    "components.div.children.stepper.props.activeStep",
    0
  );
 
  let isFormValid = true;
  let hasFieldToaster = false;
let area=get(
  state.screenConfiguration.preparedFinalObject,
  "PublicRelation[0].CreateEventDetails.area",
  
);
let dept=get(
  state.screenConfiguration.preparedFinalObject,
  "PublicRelation[0].CreateEventDetails.organizerDepartmentName",
  
);
let typeofevent=get(
  state.screenConfiguration.preparedFinalObject,
  "PublicRelation[0].CreateEventDetails.eventType",
  
);

  // let validatestepformflag = validatestepform(activeStep + 1,area,dept,typeofevent)
  
  //   isFormValid = validatestepformflag[0];
  //   hasFieldToaster = validatestepformflag[1];
  if (activeStep === 0) {

    let startdate = get(	state,"screenConfiguration.preparedFinalObject.PublicRelation[0].CreateEventDetails.startDate1",
    {}
  );
  
	

let starttime = get(state,"screenConfiguration.preparedFinalObject.PublicRelation[0].CreateEventDetails.startTime",
    {}
  );		

  var d = new Date(); // for now
  d.getHours(); // => 9
  d.getMinutes(); // =>  30
  d.getSeconds();
var currDate=d.toISOString().split('T')[0]
var curTime=d.getHours()+':'+ d.getMinutes()        

if(startdate==currDate && starttime < curTime)
{
localStorageSet("EventTimeINvalid","yes");
dispatch(
    toggleSnackbar(
      true,
      { labelName: "Select correct time slot", labelKey: "PR_END_TIME_VALIDATION_MESSAGE" },
      "warning"
    )
  );

setTimeout(function(){
dispatch(
handleField(
"apply",            "components.div.children.formwizardFirstStep.children.EventFirstStepperTimeDetail.children.cardContent.children.propertyDetailsConatiner.children.EndTime",
"value",
""
)
);
}, 1000);
}
else{
  localStorageSet("EventTimeINvalid","no");

    let isEventDetailValid = validateFields(
      "components.div.children.formwizardFirstStep.children.EventFirstStepperDetail.children.cardContent.children.propertyDetailsConatiner.children",
      state,
      dispatch
    );
    let isDescriptionvalid = validateFields(
      "components.div.children.formwizardFirstStep.children.eventDescription.children.cardContent.children.propertyDetailsConatiner.children",
      state,
      dispatch
    );
    let isTimeValid = validateFields(
      "components.div.children.formwizardFirstStep.children.EventFirstStepperTimeDetail.children.cardContent.children.propertyDetailsConatiner.children",
      state,
      dispatch
    );

    let isURLValid= validateFields(
      "components.div.children.formwizardFirstStep.children.eventDetails.children.cardContent.children.propertyDetailsConatiner.children",
      state,
      dispatch
    );
    isFormValid=isEventDetailValid && isDescriptionvalid && isTimeValid && isURLValid
    
    
  }
  
 }



  if (activeStep === 1) {
 
  }

  if (activeStep !== 2) {
  
	if(localStorageGet("EventTimeINvalid") ? localStorageGet("EventTimeINvalid") === "yes" : true)
	{
		dispatch(
              toggleSnackbar(
                true,
                { labelName: "Select correct time slot", labelKey: "PR_END_TIME_VALIDATION_MESSAGE" },
                "warning"
              )
            );
            //PR_END_TIME_VALIDATION_MESSAGE
	}
    else if (isFormValid) {
      let responseStatus = "success";
      if (activeStep === 1) {
        prepareDocumentsUploadData(state, dispatch, 'create_event');
        
        
      }
      if (activeStep === 1) {
        prepareDocumentsUploadData(state, dispatch, 'create_event');
        
      //  getMdmsData(state, dispatch);
        let response = await createUpdateEvent(
          state,
          dispatch,
          "CREATE"
        );
        responseStatus = get(response, "status", "");
        let responseMessage = get(response, "message", "");
        
        if(responseStatus === "success")
        {
          
       setReviewPageRoute(state, dispatch,responseMessage);
        }
      }
      responseStatus === "success" && changeStep(state, dispatch);
    } else if (hasFieldToaster) {
      let errorMessage = {
        labelName: "Please fill all mandatory fields and upload the documents!",
        labelKey: "PR_ERR_FILL_ALL_MANDATORY_FIELDS_TOAST"
      };
      switch (activeStep) {
        case 1:
          errorMessage = {
            labelName:
              "Please check the Missing/Invalid field for Property Details, then proceed!",
            labelKey: "ERR_FILL_ALL_MANDATORY_FIELDS_PROPERTY_TOAST"
          };
          break;
        case 2:
          errorMessage = {
            labelName:
              "Please fill all mandatory fields for Applicant Details, then proceed!",
            labelKey: "ERR_FILL_ALL_MANDATORY_FIELDS_APPLICANT_TOAST"
          };
          break;
      }
      dispatch(toggleSnackbar(true, errorMessage, "warning"));
    }
  }
}
};
export const changeStep = (
  state,
  dispatch,
  mode = "next",
  defaultActiveStep = -1
) => {
  let activeStep = get(
    state.screenConfiguration.screenConfig["apply"],
    "components.div.children.stepper.props.activeStep",
    0
  );
  if (defaultActiveStep === -1) {
      activeStep = mode === "next" ? activeStep + 1 : activeStep - 1;
   
  } else {
    activeStep = defaultActiveStep;
  }

  const isPreviousButtonVisible = activeStep > 0 ? true : false;
  const isNextButtonVisible = activeStep < 2 ? true : false;
  const isPayButtonVisible = activeStep === 2 ? true : false;
  const actionDefination = [
    {
      path: "components.div.children.stepper.props",
      property: "activeStep",
      value: activeStep
    },
    {
      path: "components.div.children.EventFooter.children.previousButton",
      property: "visible",
      value: isPreviousButtonVisible
    },
    {
      path: "components.div.children.EventFooter.children.nextButton",
      property: "visible",
      value: isNextButtonVisible
    },
    {
      path: "components.div.children.EventFooter.children.payButton",
      property: "visible",
      value: isPayButtonVisible
    }
  ];
  dispatchMultipleFieldChangeAction("apply", actionDefination, dispatch);
  renderSteps(activeStep, dispatch);
};

export const renderSteps = (activeStep, dispatch) => {
  switch (activeStep) {
    case 0:
      dispatchMultipleFieldChangeAction(
        "apply",
        getActionDefinationForStepper(
          "components.div.children.formwizardFirstStep"
        ),
        dispatch
      );
      break;
    case 1:
      dispatchMultipleFieldChangeAction(
        "apply",
        getActionDefinationForStepper(
          "components.div.children.formwizardSecondStep"
        ),
        dispatch
      );
      break;
    case 2:
      dispatchMultipleFieldChangeAction(
        "apply",
        getActionDefinationForStepper(
          "components.div.children.formwizardThirdStep"
        ),
        dispatch
      );
      break;
    default:
      dispatchMultipleFieldChangeAction(
        "apply",
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
  changeStep(state, dispatch, "previous");
};

export const EventFooter = getCommonApplyFooter({
  previousButton: {
    componentPath: "Button",
    props: {
      variant: "outlined",
      color: "primary",
      style: {
       // minWidth: "200px",
        height: "48px",
        marginRight: "16px" 
      }
    },
    children: {
      previousButtonIcon: {
        uiFramework: "custom-atoms",
        componentPath: "Icon",
        props: {
          iconName: "keyboard_arrow_left"
        }
      },
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
  nextButton: {
    componentPath: "Button",
    props: {
      variant: "contained",
      color: "primary",
      style: {
       // minWidth: "200px",
        height: "48px",
        marginRight: "45px"
      }
    },
    children: {
      nextButtonLabel: getLabel({
        labelName: "Next Step",
        labelKey: "PR_COMMON_BUTTON_NXT_STEP"
      }),
      nextButtonIcon: {
        uiFramework: "custom-atoms",
        componentPath: "Icon",
        props: {
          iconName: "keyboard_arrow_right"
        },
        
      }
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
        //minWidth: "200px",
        height: "48px",
        marginRight: "45px"
      }
    },
    children: {
      submitButtonLabel: getLabel({
        labelName: "Submit",
        labelKey: "PR_COMMON_BUTTON_SUBMIT"
      }),
      submitButtonIcon: {
        uiFramework: "custom-atoms",
        componentPath: "Icon",
        props: {
          iconName: "keyboard_arrow_right"
        }
      }
    },
    onClickDefination: {
      action: "condition",
      callBack: callBackForNext
    },
    visible: false
  }
});




export const validatestepform = (activeStep,area,dept,typeofevent, isFormValid, hasFieldToaster) => {
  
   let allAreFilled = true;
  if (activeStep == 1) {
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



document.getElementById("apply_form" + activeStep).querySelectorAll("input[type='hidden']").forEach(function (i) {
 
  if (i.value !== "Select Sector" && i.value !== "Select Committee" && i.value !== "Select Organizer Employee") {
  if (i.value == i.placeholder) {
    if(area===undefined || dept===undefined || typeofevent===undefined)
{    
    i.focus();
    allAreFilled = false;
    i.parentNode.classList.add("MuiInput-error-853");
  //  i.parentNode.parentNode.classList.add("MuiFormLabel-error-844");
    i.parentNode.parentNode.parentNode.classList.add("MuiFormLabel-error-844");
    allAreFilled = false;
    isFormValid = false;
    hasFieldToaster = true;


 
  }
}
  }
});




    // document.getElementById("apply_form" + activeStep).querySelectorAll("input[type='hidden']").forEach(function (i) {
     
    // })
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