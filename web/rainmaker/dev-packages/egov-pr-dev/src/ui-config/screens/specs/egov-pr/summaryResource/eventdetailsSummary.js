import {
    getBreak,
    getCommonContainer,
    getCommonGrayCard,
    getCommonSubHeader,
    getLabel,
    getLabelWithValue
  } from "egov-ui-framework/ui-config/screens/specs/utils";
  import { gotoApplyWithStep , getsocialmediaLabelWithValue} from "../../utils/index";
  import {
    getQueryArg,
    getTransformedLocale
  } from "egov-ui-framework/ui-utils/commons";
  import { httpRequest } from "../../../../../ui-utils";
  import set from "lodash/set";
  import get from "lodash/get";
  import store from "../../../../../ui-redux/store";
  import "./index.css";
  const state = store.getState();
  import { Link } from "react-router-dom";
  import { localStorageGet } from "egov-ui-kit/utils/localStorageUtils";
  import {convertTime} from "../../../../../ui-utils/commons";

    
  // const convertTime =(time)=> {
  //   // Check correct time format and split into components
  //   //time=time+":00"
  //   time = time.toString().match(/^([01]\d|2[0-3])(:)([0-5]\d)?$/) || [time];
    
  //   if (time.length > 1) { // If time format correct
  //   time = time.slice(1); // Remove full string match value
  //   time[5] = +time[0] < 12 ? ' AM' : ' PM'; // Set AM/PM
  //   time[0] = +time[0] % 12 || 12; // Adjust hours
  //   }
  //   return time.join(''); // return adjusted time or original string
  //   }
    
    
  
  const test = value => {
    value = value ? value.split(".")[0] : "";
    return value;
  };
  
  const tenantId = getQueryArg(window.location.href, "tenantId");
  
   var fblink = get( state,
        "screenConfiguration.preparedFinalObject.eventDetails[0].facebookUrl"
      );
  
  const redirecttosocialmedia = (state, dispatch,value) =>{
      window.open(value)
  
  }
  
  
  
  const getEmp=mdmsBody=>{
   let data = httpRequest(
      "post",
      "/egov-mdms-service/v1/_search",
      "_search",
      [],
      mdmsBody
    );
    return data
  }
  const getHeader = label => {
    return {
      uiFramework: "custom-molecules-local",
      moduleName: "egov-noc",
      componentPath: "DividerWithLabel",
      props: {
        className: "hr-generic-divider-label",
        labelProps: {},
        dividerProps: {},
        label
      },
      type: "array"
    };
  };
  
  
  const EventDetails =  getCommonGrayCard({
    propertyLocationContainer: getCommonContainer({
    eventType: getLabelWithValue(
      {
        labelName: "Enter Event Title",
        labelKey: "PR_EVENT_TITLE_LABEL"
      },
      {
        jsonPath: "eventDetails[0].eventTitle"
      
      }
    ),
    area: getLabelWithValue(
      {
        labelName: "Area",
        labelKey: "PR_AREA_LABEL"
      },
      {
        jsonPath: "eventDetails[0].area"
       
      }
    ),
    eventLocation: getLabelWithValue(
      {
        labelName: "Event Location",
        labelKey: "PR_EVENT_LOCATION_LABEL"
      },
      {
        jsonPath: "eventDetails[0].eventLocation"
       
      }
    ),
    sector: getLabelWithValue(
      {
        labelName: "Sector",
        labelKey: "PR_SECTOR_LABEL"
      },
      {
        jsonPath: "eventDetails[0].sector"
        
      }
    ),
    organizerDetails: getLabelWithValue(
      {
        labelName: "Organizer Details",
        labelKey: "PR_ORGANIZER_DETAILS_LABEL"
      },
      {
        jsonPath: "eventDetails[0].EmpName",
  
      }
    ),
    organizerEmployee: getLabelWithValue(
      {
        labelName: "Organizer Employee",
        labelKey: "PR_ORGANIZER_EMPLOYEE_LABEL"
      },
      {
        jsonPath: "eventDetails[0].organizerUsernName",
       
      }
    ),
    TypeOfEvent: getLabelWithValue(
      {
        labelName: "Type Of Event",
        labelKey: "PR_TYPE_OF_EVENT_LABEL"
      },
      {
        jsonPath: "eventDetails[0].eventType"
        
      }
    ),
    EventBudjet: getLabelWithValue(
      {
        labelName: "Event Budjet",
        labelKey: "PR_EVENT_BUDJET_LABEL"
      },
      {
        jsonPath: "eventDetails[0].eventBudget"
        
      }
    ),
    committiee:localStorageGet("modulecode")==="SCP"?{}: getLabelWithValue(
      {
        labelName: "Committiee",
        labelKey: "PR_COMMITTEE_LABEL"
      },
      {
        jsonPath: "eventDetails[0].committeeName"
        
      }
    )
  
  
  })
  })
    
  const EventDataAndTime = getCommonGrayCard({
    propertyLocationContainer: getCommonContainer({
    
   startDate: getLabelWithValue(
      {
        labelName: "Start Date",
        labelKey: "PR_START_DATE_LABEL"+"&"+"START_TIME_LABEL"
      },
      {
        jsonPath: "eventDetails[0].startDateStartTime",
        callBack: value =>
         {
              if(value)
              {	
                let time= value.split(" ")[0]+" "+convertTime(value.split(" ")[1])
                return time;
              }
              else
              {  return '' }	
        }
      }
    ),
    endDate: getLabelWithValue(
      {
        labelName: "End Date",
        labelKey: "PR_END_DATE_LABEL"+"&"+"END_TIME_LABEL"
      },
      {
        jsonPath: "eventDetails[0].endDateEndTime",
        callBack: value => {
              if(value)
              {	
                 let time= value.split(" ")[0]+" "+convertTime(value.split(" ")[1])
                 return time;
              }
              else
              {  return '' }	   
        }
      }
    )
  
  
  })
  })
   
  
  const EventSocialMediaLinks = getCommonGrayCard({
    propertyLocationContainer: getCommonContainer({
    
           fblink: {
              uiFramework: "custom-atoms",
              componentPath: "Div",
              children: {
          eventFacebookUrl: getsocialmediaLabelWithValue(
            {
              //labelName: "Event Facebook Url",
              labelKey: "PR_EVENT_FACEBOOK_URL_LABEL"
            },
            {
              jsonPath: "eventDetails[0].facebookUrl",
             
            },
            ),
           },
           props: {
            className: "Sociallink"
          },
           gridDefination : {
              xs : 12,
              sm : 4,
              md : 4
           },
           
            onClickDefination: {
                    action: "condition",
                    callBack: (state, dispatch) => {
                      var fblink = get( state,
                                          "screenConfiguration.preparedFinalObject.eventDetails[0].facebookUrl"
                                      );
                      redirecttosocialmedia(state, dispatch, fblink )
                    }
                  },
                  break: getBreak(),
          },		 
         
           
           twlink: {
              uiFramework: "custom-atoms",
              componentPath: "Div",
              children: {
            eventTwitterUrl: getsocialmediaLabelWithValue(
            {
              labelName: "Event Twitter Url",
              labelKey: "PR_EVENT_TWITTER_URL_LABEL"
            },
            {
              jsonPath: "eventDetails[0].twitterUrl"
             
            }
            )
             },
              props: {
            className: "Sociallink"
          },
           gridDefination : {
              xs : 12,
              sm : 4,
              md : 4
           },
            onClickDefination: {
                    action: "condition",
                    callBack: (state, dispatch) => {
                      var fblink = get( state,
                                          "screenConfiguration.preparedFinalObject.eventDetails[0].twitterUrl"
                                      );
                      redirecttosocialmedia(state, dispatch, fblink )
                    }
                  },
                  break: getBreak(),
          },	
          
          instlink: {
              uiFramework: "custom-atoms",
              componentPath: "Div",
              children: {
              eventInstagram: getsocialmediaLabelWithValue(
            {
              labelName: "Event Instagram",
              labelKey: "PR_EVENT_INSTAGRAM_LABEL"
            },
            {
              jsonPath: "eventDetails[0].instagramUrl"
             
            }
            ),
             },
              props: {
            className: "Sociallink"
          },
           gridDefination : {
              xs : 12,
              sm : 4,
              md : 4
           },
            onClickDefination: {
                    action: "condition",
                    callBack: (state, dispatch) => {
                      var fblink = get( state,
                                          "screenConfiguration.preparedFinalObject.eventDetails[0].instagramUrl"
                                      );
                      redirecttosocialmedia(state, dispatch, fblink )
                    }
                  },
                  
          }	
  
  })
  })
    
  
  const EventDescription = getCommonGrayCard({
    propertyLocationContainer: getCommonContainer({
    
          eventDescription: getLabelWithValue(
            {
              labelName: "Event Description",
              labelKey: "PR_EVENT_DESCRIPTION_LABEL"
            },
            {
              jsonPath: "eventDetails[0].eventDescription"
              
            }
            )
  })
  })
    
  
  
  
  
  
  
  export const eventdetailsSummary = getCommonGrayCard({
    header: {
      uiFramework: "custom-atoms",
      componentPath: "Container",
      props: {
        style: { marginBottom: "10px" }
      },
      children: {
        header: {
          gridDefination: {
            xs: 8
          },
         
        },
        editSection: {
          componentPath: "Button",
          props: {
            color: "primary",
            style: {
              marginTop: "-10px",
              marginRight: "-18px"
            }
          },
          gridDefination: {
            xs: 4,
            align: "right"
          },
          children: {
            editIcon: {
              uiFramework: "custom-atoms",
              componentPath: "Icon",
              props: {
                iconName: "edit"
              }
            },
            buttonLabel: getLabel({
              labelKey: "PR_SUMMARY_EDIT"
            })
          },
          onClickDefination: {
            action: "condition",
            callBack: (state, dispatch) => {
              gotoApplyWithStep(state, dispatch, 0);
            }
          }
        }
      }
    },
    eventDetailsHeader: getHeader("Event Details"),
    break: getBreak(),
    cardOne: EventDetails,
    dateTimeHeader: getHeader("Event Schedule "),
    cardTwo: EventDataAndTime,
    socialMediaHeader: getHeader("Event Social Media Link"),
    cardThree: EventSocialMediaLinks,
    descriptionHeader: getHeader("Event Description"),
    cardFour: EventDescription
  });
  