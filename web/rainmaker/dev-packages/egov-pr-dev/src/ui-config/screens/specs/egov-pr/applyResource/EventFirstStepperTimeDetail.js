import {
  getBreak,
  getCommonCard,
  getCommonContainer,
  getCommonGrayCard,
  getCommonTitle,
  getSelectField,
  getTextField,
  getTimeField,
  getPattern,
  getDateField
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { localStorageGet, localStorageSet } from "egov-ui-kit/utils/localStorageUtils";
import {
  prepareFinalObject,
  handleScreenConfigurationFieldChange as handleField
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import get from "lodash/get";
import "./index.css";
import { toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import set from "lodash/set";
import {
  getTodaysDateInYMD,
  getStartDateValue
  }  from "../../utils";
let previousUoms = [];

const dynamic = (uom, path, buildingIndex) => {
  return {
    ...getTextField({
      label: {
        labelKey: `PR_PROPERTY_DETAILS_${uom}_LABEL`
      },
      placeholder: {
        labelKey: `PR_PROPERTY_DETAILS_${uom}_PLACEHOLDER`
      },
      pattern: /^[0-9]*$/i,
      jsonPath: `PublicRelations[0].PublicRelationDetails.buildings[${buildingIndex}].uomsMap.${uom}`,
      required: false,
      props: { type: "number", className:"applicant-details-error" },
      gridDefination: {
        xs: 12,
        sm: 12,
        md: 6
      }
    }),
    componentJsonpath: `${path}.${uom}`
  };
};

const prepareSelectField = (uom, start, end) => {
  let data = [];
  for (let i = start; i <= end; i++) {
    data.push({ code: `${i}` });
  }
  return {
    ...getSelectField({
      label: {
        labelKey: `PR_PROPERTY_DETAILS_${uom}_LABEL`
      },
      placeholder: {
        labelKey: `PR_PROPERTY_DETAILS_${uom}_PLACEHOLDER`
      },
      pattern: /^[0-9]*$/i,
      errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
      required: false,
      jsonPath: `PublicRelations[0].PublicRelationDetails.buildings[0].uomsMap.${uom}`,
      data: data,
      gridDefination: {
        xs: 12,
        sm: 12,
        md: 6
      },
      props:{
        className:"applicant-details-error"
      }
    })
  };
};

const prepareTextField = uom => {
  return {
    ...getTextField({
      label: {
        labelKey: `PR_PROPERTY_DETAILS_${uom}_LABEL`
      },
      placeholder: {
        labelKey: `PR_PROPERTY_DETAILS_${uom}_PLACEHOLDER`
      },
      pattern: /^\d{0,10}$/i,
      
    
      errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
      jsonPath: `PublicRelations[0].PublicRelationDetails.buildings[0].uomsMap.${uom}`,
      gridDefination: {
        xs: 12,
        sm: 12,
        md: 6
      },
      props:{
        className:"applicant-details-error"
      }
    })
  };
};

const checkUomIsDefault = uom => {
  if (
    [
      "NO_OF_FLOORS",
      "NO_OF_BASEMENTS",
      "PLOT_SIZE",
      "BUILTUP_AREA",
      "HEIGHT_OF_BUILDING"
    ].indexOf(uom) >= 0
  ) {
    return true;
  }
  return false;
};

const setMandatory = (dispatch, path, value) => {
  dispatch(handleField("apply", path, "required", value));
  dispatch(handleField("apply", path, "props.required", value));
};


export const EventFirstStepperTimeDetail = getCommonCard({
  header: getCommonTitle(
    {
      labelName: "Event Date & Time",
      labelKey: "PR_EVENT_DATE_AND_TIME_HEADER"
    },
    
    {
      style: {
        marginBottom: 18
      }
    }
  ),
  break: getBreak(),
  propertyDetailsConatiner: getCommonContainer({
    StartDate: getDateField({
      label: {
        labelName: "Start Date",
        labelKey: "PR_START_DATE_LABEL"
      },
      placeholder: {
        labelName: "Enter Start Date",
        labelKey: "PR_EVENT_START_DATE_PLACEHOLDER"
      },
      required: true,
      pattern: getPattern("Date"),
      errorMessage: "PR_START_DATE_INVALID",
      jsonPath: "PublicRelation[0].CreateEventDetails.startDate1",
      props: {
        inputProps: {
          min: getTodaysDateInYMD()
        }
      },
  beforeFieldChange: (action, state, dispatch) => {
       
        dispatch(
          handleField(
            "apply",
            "components.div.children.formwizardFirstStep.children.EventFirstStepperTimeDetail.children.cardContent.children.propertyDetailsConatiner.children.EndDate",
            "props.inputProps.min",
            action.value
          )
        );
       
			timevalidation(action, state, dispatch)
      
        },
       
      afterFieldChange: (action, state, dispatch) => {
        datevalidation(action, state, dispatch)
        


        }
    }),
    StartTime: getTimeField({
      label: {
        labelName: "Start Time",
        labelKey: "PR_START_TIME_LABEL"
      },
      placeholder: {
        labelName: "Enter Start Time",
        labelKey: "PR_EVENT_START_TIME_PLACEHOLDER"
      },
      required: true,
      errorMessage: "PR_START_TIME_INVALID",
      jsonPath: "PublicRelation[0].CreateEventDetails.startTime",
	  beforeFieldChange: (action, state, dispatch) => {
			starttimevalidation(action, state, dispatch)
     // timevalidation(action, state, dispatch)
      
        }
      
    }),
    EndDate: getDateField({
      label: {
        labelName: "End Date",
        labelKey: "PR_END_DATE_LABEL"
      },
     
      placeholder: {
        labelName: "Enter End Date",
        labelKey: "PR_EVENT_END_DATE_PLACEHOLDER"
      },
     
      required: true,
      pattern: getPattern("Date"),
      errorMessage: "PR_END_DATE_INVALID",
      jsonPath: "PublicRelation[0].CreateEventDetails.endDate1",
      props: {
        inputProps: {
          min: ''
        }
      },

     beforeFieldChange: (action, state, dispatch) => {
			timevalidation(action, state, dispatch)
	   
        }
    }),
    
    EndTime: getTimeField({
      label: {
        labelName: "End Time",
        labelKey: "PR_END_TIME_LABEL"
      },
     
      placeholder: {
        labelName: "Enter End Time",
        labelKey: "PR_EVENT_END_TIME_PLACEHOLDER"
      },
      required: true,
   
      errorMessage: "PR_END_TIME_INVALID",
      jsonPath: "PublicRelation[0].CreateEventDetails.endTime",
	   beforeFieldChange: (action, state, dispatch) => {
			timevalidation(action, state, dispatch)
	   
        },
      props: {
        inputProps: {
        //  min: ''
        }
      }
    }),
  })
});


// Time validation
export const timevalidation =(action, state, dispatch) =>
{
 // 
 // screenConfiguration.preparedFinalObject.PublicRelation[0].CreateEventDetails.endDate1
	let startdate = get(	state,"screenConfiguration.preparedFinalObject.PublicRelation[0].CreateEventDetails.startDate1",
								{}
							);
							
	    let enddate = get(state,"screenConfiguration.preparedFinalObject.PublicRelation[0].CreateEventDetails.endDate1",
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
		if(startdate == enddate && starttime >= action.value)
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
  }
}



export const starttimevalidation =(action, state, dispatch) =>
{
	let startdate = get(	state,								"screenConfiguration.preparedFinalObject.PublicRelation[0].CreateEventDetails.startDate1",
								{}
							);
							
	    let enddate = get(state,								"screenConfiguration.preparedFinalObject.PublicRelation[0].CreateEventDetails.endDate1",
								{}
							);		
			
		 let endtime = get(state,								"screenConfiguration.preparedFinalObject.PublicRelation[0].CreateEventDetails.endTime",
								{}
							);		
              var d = new Date(); // for now
              d.getHours(); // => 9
              d.getMinutes(); // =>  30
              d.getSeconds();
var currDate=d.toISOString().split('T')[0]
   var curTime=d.getHours()+':'+ d.getMinutes()        
            
       if(startdate==currDate && action.value < curTime)
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
		if(startdate == enddate && action.value >= endtime)
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
  }
}

export const datevalidation =(action, state, dispatch) =>
{
	let startdate = get(	state,								"screenConfiguration.preparedFinalObject.PublicRelation[0].CreateEventDetails.startDate1",
								{}
							);
							
	    let enddate = get(state,								"screenConfiguration.preparedFinalObject.PublicRelation[0].CreateEventDetails.endDate1",
								{}
							);		
			
		
    if(startdate > enddate){
      dispatch(
        handleField(
          "apply",
          "components.div.children.formwizardFirstStep.children.EventFirstStepperTimeDetail.children.cardContent.children.propertyDetailsConatiner.children.EndDate",
          "props.value",
          startdate
        )
      );
     
     

    }
}