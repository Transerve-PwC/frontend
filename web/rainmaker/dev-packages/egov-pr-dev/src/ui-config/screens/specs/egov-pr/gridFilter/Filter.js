import {
  getCommonCard,
  getCommonContainer,
  getCommonParagraph,
  getCommonTitle,
  getDateField,
  getLabel,
  getPattern,
  getSelectField,
  getTextField
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { handleScreenConfigurationFieldChange as handleField ,prepareFinalObject} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { searchApiCall,searchEventApiCall,searchInviteApiCall ,searchLibraryApiCall,searchPressMasterApiCall,searchPressApiCall,searchTenderApiCall} from "./functions";
// import "./searchfilter.css"
import {
  getTodaysDateInYMD,
  getStartDateValue
  }  from "../../utils";
  import "./index.css";
 
  export const ResetEventField = async (state, dispatch) => {
    //Event
    dispatch(
      handleField(
        "search",
        "components.div.children.EventFilter.children.cardContent.children.eventFilterContainer.children.eventId",
        "props.value",
        ""
      )
    );
    dispatch(
      handleField(
        "search",
        "components.div.children.EventFilter.children.cardContent.children.eventFilterContainer.children.eventStatus",
        "props.value",
        undefined
      )
    );
    
    dispatch(
      handleField(
        "search",
        "components.div.children.EventFilter.children.cardContent.children.eventFilterContainer.children.eventTitle",
        "props.value",
        ""
      )
    );
    dispatch(
      handleField(
        "search",
        "components.div.children.EventFilter.children.cardContent.children.eventFilterContainer.children.fromDate",
        "props.value",
        ""
      )
    );
    dispatch(
      handleField(
        "search",
        "components.div.children.EventFilter.children.cardContent.children.eventFilterContainer.children.scheduleStatus",
        "props.value",
        undefined
      )
    );
    dispatch(
      handleField(
        "search",
        "components.div.children.EventFilter.children.cardContent.children.eventFilterContainer.children.toDate",
        "props.value",
        ""
      )
    );
    //Invite
    
  }
  export const ResetInviteField = async (state, dispatch) =>{



    dispatch(
      handleField(
        "eventList",
        "components.div.children.InviteGuestFilter.children.cardContent.children.eventFilterContainer.children.eventId",
        "props.value",
        ""
      )
    );
    dispatch(
      handleField(
        "eventList",
        "components.div.children.InviteGuestFilter.children.cardContent.children.eventFilterContainer.children.eventStatus",
        "props.value",
        undefined
      )
    );
    
    dispatch(
      handleField(
        "eventList",
        "components.div.children.InviteGuestFilter.children.cardContent.children.eventFilterContainer.children.eventTitle",
        "props.value",
        ""
      )
    );
    dispatch(
      handleField(
        "eventList",
        "components.div.children.InviteGuestFilter.children.cardContent.children.eventFilterContainer.children.fromDate",
        "props.value",
        ""
      )
    );
    dispatch(
      handleField(
        "eventList",
        "components.div.children.InviteGuestFilter.children.cardContent.children.eventFilterContainer.children.scheduleStatus",
        "props.value",
        undefined
      )
    );
    dispatch(
      handleField(
        "eventList",
        "components.div.children.InviteGuestFilter.children.cardContent.children.eventFilterContainer.children.toDate",
        "props.value",
        ""
      )
    );
  }
  
  export const ResetLibraryField = async (state, dispatch) =>{
    
        dispatch(
          handleField(
            "library-search",
            "components.div.children.LibraryFilter.children.cardContent.children.eventFilterContainer.children.eventId",
            "props.value",
            ""
          )
        );
   
        
        dispatch(
          handleField(
            "library-search",
            "components.div.children.LibraryFilter.children.cardContent.children.eventFilterContainer.children.eventTitle",
            "props.value",
            ""
          )
        );
        dispatch(
          handleField(
            "library-search",
            "components.div.children.LibraryFilter.children.cardContent.children.eventFilterContainer.children.fromDate",
            "props.value",
            ""
          )
        );

        dispatch(
          handleField(
            "library-search",
            "components.div.children.LibraryFilter.children.cardContent.children.eventFilterContainer.children.toDate",
            "props.value",
            ""
          )
        );
      }
      export const ResetGENPRESSField = async (state, dispatch) =>{
        
       
            
            dispatch(
              handleField(
                "pressNoteList",
                "components.div.children.PressNoteFilter.children.cardContent.children.pressNoteFilterContainer.children.Subject",
                "props.value",
                ""
              )
            );
            dispatch(
              handleField(
                "pressNoteList",
                "components.div.children.PressNoteFilter.children.cardContent.children.pressNoteFilterContainer.children.fileNumber",
                "props.value",
                ""
              )
            );
    
            dispatch(
              handleField(
                "pressNoteList",
                "components.div.children.PressNoteFilter.children.cardContent.children.pressNoteFilterContainer.children.fromDate",
                "props.value",
                undefined
              )
            );

            dispatch(
              handleField(
                "pressNoteList",
                "components.div.children.PressNoteFilter.children.cardContent.children.pressNoteFilterContainer.children.toDate",
                "props.value",
                undefined
              )
            );

            
          }

          export const ResetPressField = async (state, dispatch) =>{
            
           
                
                dispatch(
                  handleField(
                    "pressGrid",
                    "components.div.children.pressMasterFilter.children.cardContent.children.pressMasterFilterContainer.children.PersonnelName",
                    "props.value",
                    ""
                  )
                );
                dispatch(
                  handleField(
                    "pressGrid",
                    "components.div.children.pressMasterFilter.children.cardContent.children.pressMasterFilterContainer.children.publicationName",
                    "props.value",
                    ""
                  )
                );
        
                dispatch(
                  handleField(
                    "pressGrid",
                    "components.div.children.pressMasterFilter.children.cardContent.children.pressMasterFilterContainer.children.typeOfPress",
                    "props.value",
                    undefined
                  )
                );
    
              
                
              }
              export const ResetTenderField = async (state, dispatch) =>{
                
                    
                    dispatch(
                      handleField(
                        "TenderSearch",
                        "components.div.children.TenderFilter.children.cardContent.children.tenderFilterContainer.children.Subject",
                        "props.value",
                        ""
                      )
                    );
                    dispatch(
                      handleField(
                        "TenderSearch",
                        "components.div.children.TenderFilter.children.cardContent.children.tenderFilterContainer.children.fileNumber",
                        "props.value",
                        ""
                      )
                    );
            
                    dispatch(
                      handleField(
                        "TenderSearch",
                        "components.div.children.TenderFilter.children.cardContent.children.tenderFilterContainer.children.fromDate",
                        "props.value",
                        ""
                      )
                    );
        
                    dispatch(
                      handleField(
                        "TenderSearch",
                        "components.div.children.TenderFilter.children.cardContent.children.tenderFilterContainer.children.toDate",
                        "props.value",
                        ""
                      )
                    );
        
                    
                  }
export const EventFilter = getCommonCard({
  
  eventFilterContainer: getCommonContainer({

    eventId: getTextField({
      label: {
        labelName: "Event Id.",
        labelKey: "PR_EVENT_ID"
      },
      placeholder: {
        labelName: "Enter Event Id",
        labelKey: "PR_EVENT_Id_PLACEHOLDER"
      },
      gridDefination: {
        xs: 12,
        sm: 4
      },
      required: false,
    
      errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
      jsonPath: "PublicRelation[0].filterEvent.eventId"
    }),
  
    eventTitle: getTextField({
      label: {
        labelName: "Event Title.",
        labelKey: "PR_EVENT_TITLE"
      },
      placeholder: {
        labelName: "Enter Event Title",
        labelKey: "PR_EVENT_TITLE_PLACEHOLDER"
      },
      gridDefination: {
        xs: 12,
        sm: 4
      },
      required: false,
      
      pattern:getPattern("EventTitle"),
      errorMessage: "PR_EVENT_TITLE_INVALID",
      jsonPath: "PublicRelation[0].filterEvent.eventTitle",
     
    }),

    fromDate: getDateField({
      label: { labelName: "From Date", labelKey: "PR_FROM_DATE_LABEL" },
      placeholder: {
        labelName: "From Date",
        labelKey: "PR_FROM_DATE_PLACEHOLDER"
      },
      jsonPath: "PublicRelation[0].filterEvent.fromDate",
      
      gridDefination: {
        xs: 12,
        sm: 4
      },
      pattern: getPattern("Date"),
      errorMessage: "PR_START_DATE_INVALID",
      required: false,
      afterFieldChange: (action, state, dispatch) => {
        // 
        // alert(action.value)
 
 
        
         dispatch(
           handleField(
             "search",
             "components.div.children.EventFilter.children.cardContent.children.eventFilterContainer.children.toDate",
             "props.inputProps.min",
             action.value
           )
         );
        
         },
   

    }),

    toDate: getDateField({
      label: { labelName: "To Date", labelKey: "PR_TO_DATE_LABEL" },
      placeholder: {
        labelName: "To Date",
        labelKey: "PR_TO_DATE_PLACEHOLDER"
      },
      jsonPath: "PublicRelation[0].filterEvent.toDate",
      pattern: getPattern("Date"),
      gridDefination: {
        xs: 12,
        sm: 4
      },
      pattern: getPattern("Date"),
      errorMessage: "PR_END_DATE_INVALID",
      required: false,
    }),
//     scheduleStatus: getSelectField({
//       label: {
//         labelName: "Schedule Status",
//         labelKey: "PR_SCHEDULE_STATUS_LABEL"
//       },
//       placeholder: {
//         labelName: "Select Schedule Status",
//         labelKey: "PR_SCHEDULE_STATUS_PLACEHOLDER"
//       },
//       optionValue:"name",
//       optionLabel:"name"
//  ,   
     
//       jsonPath: "PublicRelation[0].filterEvent.Scedulestatus",
//       sourceJsonPath: "applyScreenMdmsData['RAINMAKER-PR'].eventScheduledStatus",
//       required: false,
//       gridDefination: {
//         xs: 12,
//         sm: 4
//       }
    
//     }),
//     eventStatus: getSelectField({
//       label: {
//         labelName: "Event status",
//         labelKey: "PR_EVENT_STATUS_LABEL"
//       },
//       placeholder: {
//         labelName: "Select Event status",
//         labelKey: "PR_EVENT_STATUS_PLACEHOLDER"
//       },
//       optionValue:"name",
//       optionLabel:"name"
//  ,   
 
//       jsonPath: "PublicRelation[0].filterEvent.Eventstatus",
//       sourceJsonPath: "applyScreenMdmsData['RAINMAKER-PR'].eventStatus",
//       required: false,
//       gridDefination: {
//         xs: 12,
//         sm: 4
//       }
    
//     }),

    scheduleStatus: {
      uiFramework: "custom-containers-local",
      moduleName: "egov-pr",
      componentPath: "AutosuggestContainer",
      jsonPath: "PublicRelation[0].filterEvent.Scedulestatus",
      
            required: false,
   gridDefination: {
    xs: 12,
    sm: 4
  },
    props: {
    style: {
    width: "100%",
    cursor: "pointer"
    },
   
    className:"basic-multi-select",
    label: {
      labelName: "Schedule Status",
      labelKey: "PR_SCHEDULE_STATUS_LABEL"
    },
    placeholder: {
      labelName: "Select Schedule Status",
      labelKey: "PR_SCHEDULE_STATUS_PLACEHOLDER"
    },
    jsonPath: "PublicRelation[0].filterEvent.Scedulestatus",
      sourceJsonPath: "applyScreenMdmsData['RAINMAKER-PR'].eventScheduledStatus",
    labelsFromLocalisation: false,
    suggestions: [],
    fullwidth: true,
    required: false,
    inputLabelProps: {
      shrink: true
    },
    isMulti: false,
  labelName: "name",
   valueName: "name"
    },
  },

  eventStatus: {
    uiFramework: "custom-containers-local",
    moduleName: "egov-pr",
    componentPath: "AutosuggestContainer",
    jsonPath: "PublicRelation[0].filterEvent.Eventstatus",
    
          required: false,
 gridDefination: {
  xs: 12,
  sm: 4
},
  props: {
  style: {
  width: "100%",
  cursor: "pointer"
  },
 
  className:"basic-multi-select",
  label: {
    labelName: "Event status",
    labelKey: "PR_EVENT_STATUS_LABEL"
  },
  placeholder: {
    labelName: "Select Event status",
    labelKey: "PR_EVENT_STATUS_PLACEHOLDER"
  },
  jsonPath: "PublicRelation[0].filterEvent.Eventstatus",
      sourceJsonPath: "applyScreenMdmsData['RAINMAKER-PR'].eventStatus",
  labelsFromLocalisation: false,
  suggestions: [],
  fullwidth: true,
  required: false,
  inputLabelProps: {
    shrink: true
  },
  isMulti: false,
labelName: "name",
 valueName: "name"
  },
},
  }),
  

  button: getCommonContainer({
    buttonContainer: getCommonContainer({
      
      searchButton: {
        componentPath: "Button",
        gridDefination: {
          xs: 12,
          sm: 4,
          md:4
          // align: "center",
          // id: "search-btn"
        },

        props: {
          variant: "contained",
          style: {
            color: "white",
            marginRight: "8px",
            backgroundColor: "rgba(0, 0, 0, 0.6000000238418579)",
            borderRadius: "2px",
            width: "80%",
            height: "48px",
            marginBottom: "8px",
          }
        },
        children: {
          buttonLabel: getLabel({
            labelName: "Search",
            labelKey: "PR_BUTTON_SEARCH"
          })
        },
        onClickDefination: {
          action: "condition",
        callBack: searchEventApiCall
        }
      },
      ResetButton: {
        componentPath: "Button",
        gridDefination: {
          xs: 12,
          sm: 4,
          md: 4
          // align: "center",
          // id: "search-btn"
        },

        props: {
          variant: "contained",
          style: {
           //// marginLeft: "8px",
            backgroundColor: "unset",
            color: "rgb(254, 122, 81)",
            border: "1px solid rgb(254, 122, 81)",
            borderRadius: "2px",
            width: "80%",
            height: "48px",
            marginBottom: "8px",
          }
        },
        children: {
          buttonLabel: getLabel({
            labelName: "RESET",
            labelKey: "PR_BUTTON_RESET"
          })
        },
        onClickDefination: {
          action: "condition",
        callBack: ResetEventField
        }
      }
    })
  })
});
export const InviteGuestFilter = getCommonCard({
  
  eventFilterContainer: getCommonContainer({


    eventId: getTextField({
      label: {
        labelName: "Event Id.",
        labelKey: "PR_EVENT_ID"
      },
      placeholder: {
        labelName: "Enter Event Id",
        labelKey: "PR_EVENT_Id_PLACEHOLDER"
      },
      gridDefination: {
        xs: 12,
        sm: 4
      },
      required: false,
   //   pattern: /^[a-zA-Z ]*$/i,
      errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
      jsonPath: "PublicRelation[0].filterInviteEvent.eventId"
    }),
  
  
    eventTitle: getTextField({
      label: {
        labelName: "Event Title.",
        labelKey: "PR_EVENT_TITLE"
      },
      placeholder: {
        labelName: "Enter Event Title",
        labelKey: "PR_EVENT_TITLE_PLACEHOLDER"
      },
      gridDefination: {
        xs: 12,
        sm: 4
      },
      required: false,
      pattern:getPattern("EventTitle"),
      
      errorMessage: "PR_EVENT_TITLE_INVALID",
      jsonPath: "PublicRelation[0].filterInviteEvent.eventTitle"
    }),
    fromDate: getDateField({
      label: { labelName: "From Date", labelKey: "PR_FROM_DATE_LABEL" },
      placeholder: {
        labelName: "From Date",
        labelKey: "PR_FROM_DATE_PLACEHOLDER"
      },
      jsonPath: "PublicRelation[0].filterEvent.fromDate",
    
      gridDefination: {
        xs: 12,
        sm: 4
      },
      pattern: getPattern("Date"),
      errorMessage: "PR_START_DATE_INVALID",
      required: false,
      
  afterFieldChange: (action, state, dispatch) => {
       // 
       // alert(action.value)


  
        dispatch(
          handleField(
            "eventList",
            "components.div.children.InviteGuestFilter.children.cardContent.children.eventFilterContainer.children.toDate",
            "props.inputProps.min",
            action.value
          )
        );
       
        },
    }),

    toDate: getDateField({
      label: { labelName: "To Date", labelKey: "PR_TO_DATE_LABEL" },
      placeholder: {
        labelName: "To Date",
        labelKey: "PR_TO_DATE_PLACEHOLDER"
      },
      jsonPath: "PublicRelation[0].filterInviteEvent.toDate",
      props: {
        inputProps: {
          min: ''
        }
      },
      gridDefination: {
        xs: 12,
        sm: 4
      },
      pattern: getPattern("Date"),
      errorMessage: "PR_END_DATE_INVALID",
      required: false,
    }),

//   scheduleStatus: {
//       uiFramework: "custom-containers-local",
//       moduleName: "egov-pr",
//       className:"basic-multi-select",
//       jsonPath: "PublicRelation[0].filterInviteEvent.Scedulestatus",
      
//             required: false,
//    gridDefination: {
//     xs: 12,
//     sm: 6
//   },
//     props: {
//     style: {
//     width: "100%",
//     cursor: "pointer"
//     },
   
//     className: "citizen-city-picker",
//     label: {
//       labelName: "Schedule Status",
//       labelKey: "PR_SCHEDULE_STATUS_LABEL"
//     },
//     placeholder: {
//       labelName: "Select Schedule Status",
//       labelKey: "PR_SCHEDULE_STATUS_PLACEHOLDER"
//     },
//     jsonPath: "PublicRelation[0].filterInviteEvent.Scedulestatus",
//     sourceJsonPath: "applyScreenMdmsData['RAINMAKER-PR'].eventScheduledStatus",
//     labelsFromLocalisation: false,
//     suggestions: [],
//     fullwidth: true,
//     required: false,
//     inputLabelProps: {
//       shrink: true
//     },
//     isMulti: false,
//   labelName: "name",
//    valueName: "name"
//     },
//   },

//   eventStatus: {
//     uiFramework: "custom-containers-local",
//     moduleName: "egov-pr",
//     //className:"basic-multi-select",
//     jsonPath: "PublicRelation[0].filterInviteEvent.Eventstatus",
    
//           required: false,
//  gridDefination: {
//   xs: 12,
//   sm: 6
// },
//   props: {
//   style: {
//   width: "100%",
//   cursor: "pointer"
//   },
 
//   className: "citizen-city-picker",
//   label: {
//     labelName: "Event status",
//     labelKey: "PR_EVENT_STATUS_LABEL"
//   },
//   placeholder: {
//     labelName: "Select Event status",
//     labelKey: "PR_EVENT_STATUS_PLACEHOLDER"
//   },
//   jsonPath: "PublicRelation[0].filterInviteEvent.Eventstatus",
//   sourceJsonPath: "applyScreenMdmsData['RAINMAKER-PR'].eventStatus",
//   labelsFromLocalisation: false,
//   suggestions: [],
//   fullwidth: true,
//   required: false,
//   inputLabelProps: {
//     shrink: true
//   },
//   isMulti: false,
// labelName: "name",
//  valueName: "name"
//   },
// },




//     scheduleStatus: getSelectField({
//       label: {
//         labelName: "Schedule Status",
//         labelKey: "PR_SCHEDULE_STATUS_LABEL"
//       },
//       placeholder: {
//         labelName: "Select Schedule Status",
//         labelKey: "PR_SCHEDULE_STATUS_PLACEHOLDER"
//       },

//      jsonPath: "PublicRelation[0].filterInviteEvent.Scedulestatus",
//       sourceJsonPath: "applyScreenMdmsData['RAINMAKER-PR'].eventScheduledStatus",
//       optionValue:"name",
//       optionLabel:"name"
//  ,     
   
//       required: false,
//       gridDefination: {
//         xs: 12,
//         sm: 4
//       }
    
//     }),


  

scheduleStatus: {
  uiFramework: "custom-containers-local",
  moduleName: "egov-pr",
  componentPath: "AutosuggestContainer",
  jsonPath: "PublicRelation[0].filterInviteEvent.Scedulestatus",
  
        required: false,
gridDefination: {
xs: 12,
sm: 4
},
props: {
style: {
width: "100%",
cursor: "pointer"
},

className:"basic-multi-select",
label: {
  labelName: "Schedule Status",
  labelKey: "PR_SCHEDULE_STATUS_LABEL"
},
placeholder: {
  labelName: "Select Schedule Status",
  labelKey: "PR_SCHEDULE_STATUS_PLACEHOLDER"
},

jsonPath: "PublicRelation[0].filterInviteEvent.Scedulestatus",
sourceJsonPath: "applyScreenMdmsData['RAINMAKER-PR'].eventScheduledStatus",
labelsFromLocalisation: false,
suggestions: [],
fullwidth: true,
required: false,
inputLabelProps: {
  shrink: true
},
isMulti: false,
labelName: "name",
valueName: "name"
},
},

eventStatus: {
uiFramework: "custom-containers-local",
moduleName: "egov-pr",
componentPath: "AutosuggestContainer",
jsonPath: "PublicRelation[0].filterInviteEvent.Eventstatus",

      required: false,
gridDefination: {
xs: 12,
sm: 4
},
props: {
style: {
width: "100%",
cursor: "pointer"
},

className:"basic-multi-select",
label: {
  labelName: "Event status",
  labelKey: "PR_EVENT_STATUS_LABEL"
},
placeholder: {
  labelName: "Select Event status",
  labelKey: "PR_EVENT_STATUS_PLACEHOLDER"
},


jsonPath: "PublicRelation[0].filterInviteEvent.Eventstatus",
sourceJsonPath: "applyScreenMdmsData['RAINMAKER-PR'].eventStatus",
labelsFromLocalisation: false,
suggestions: [],
fullwidth: true,
required: false,
inputLabelProps: {
shrink: true
},
isMulti: false,
labelName: "name",
valueName: "name"
},
},
  }),
  

  button: getCommonContainer({
    buttonContainer: getCommonContainer({
     
      searchButton: {
        componentPath: "Button",
        gridDefination: {
          xs: 12,
          sm: 4,
          md: 4
          // align: "center"
        },
        props: {
          variant: "contained",
          style: {
            color: "white",
            marginRight: "8px",
            backgroundColor: "rgba(0, 0, 0, 0.6000000238418579)",
            borderRadius: "2px",
            width: "80%",
            height: "48px",
            marginBottom: "8px",
          }
        },
        children: {
          buttonLabel: getLabel({
            labelName: "Search",
            labelKey: "PR_BUTTON_SEARCH"
          })
        },
        onClickDefination: {
          action: "condition",
        callBack: searchInviteApiCall
        }
      },
      ResetButton: {
        componentPath: "Button",
        gridDefination: {
          xs: 12,
          sm: 4,
          md: 4
          // align: "center",
          // id: "search-btn"
        },
  
        props: {
          variant: "contained",
          style: {
           // marginLeft: "8px",
            backgroundColor: "unset",
            color: "rgb(254, 122, 81)",
            border: "1px solid rgb(254, 122, 81)",
            borderRadius: "2px",
            width: "80%",
            height: "48px",
            marginBottom: "8px",
          }
        },
        children: {
          buttonLabel: getLabel({
            labelName: "RESET",
            labelKey: "PR_BUTTON_RESET"
          })
        },
        onClickDefination: {
          action: "condition",
        callBack: ResetInviteField
        }
      }
    }),
    
  })
});

export const LibraryFilter = getCommonCard({
  
  eventFilterContainer: getCommonContainer({

    eventId: getTextField({
      label: {
        labelName: "Event Id.",
        labelKey: "PR_EVENT_ID"
      },
      placeholder: {
        labelName: "Enter Event id",
        labelKey: "PR_EVENT_ID"
      },
      gridDefination: {
        xs: 12,
        sm: 4
      },
      required: false,
      pattern: /^[a-zA-Z0-9-]*$/i,
      errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
      jsonPath: "PublicRelation[0].filterLibraryEvent.eventId"
    }),
  
    eventTitle: getTextField({
      label: {
        labelName: "Event Title.",
        labelKey: "PR_EVENT_TITLE"
      },
      placeholder: {
        labelName: "Enter Event Title",
        labelKey: "PR_EVENT_TITLE_PLACEHOLDER"
      },
      gridDefination: {
        xs: 12,
        sm: 4
      },
      required: false,
      pattern:getPattern("EventTitle"),
      
      errorMessage: "PR_EVENT_TITLE_INVALID",
      jsonPath: "PublicRelation[0].filterLibraryEvent.eventTitle"
    }),
    fromDate: getDateField({
      label: { labelName: "From Date", labelKey: "PR_FROM_DATE_LABEL" },
      placeholder: {
        labelName: "From Date",
        labelKey: "PR_FROM_DATE_PLACEHOLDER"
      },
      jsonPath: "PublicRelation[0].filterLibraryEvent.fromDate",
     
      gridDefination: {
        xs: 12,
        sm: 4
      },
      pattern: getPattern("Date"),
      errorMessage: "PR_START_DATE_INVALID",
      required: false,
          
  afterFieldChange: (action, state, dispatch) => {
 
     dispatch(
       handleField(
         "library-search",
         "components.div.children.LibraryFilter.children.cardContent.children.eventFilterContainer.children.toDate",
         "props.inputProps.min",
         action.value
       )
     );
    
     },
    }),

    toDate: getDateField({
      label: { labelName: "To Date", labelKey: "PR_TO_DATE_LABEL" },
      placeholder: {
        labelName: "To Date",
        labelKey: "PR_TO_DATE_PLACEHOLDER"
      },
      jsonPath: "PublicRelation[0].filterLibraryEvent.toDate",
      props: {
        inputProps: {
          min: getTodaysDateInYMD()
        }
      },
      gridDefination: {
        xs: 12,
        sm: 4
      },
      pattern: getPattern("Date"),
      errorMessage: "PR_END_DATE_INVALID",
      required: false,
    }),

  }),
  

  button: getCommonContainer({
    buttonContainer: getCommonContainer({
     
      searchButton: {
        componentPath: "Button",
        gridDefination: {
          xs: 12,
          sm: 4,
          md: 4
          // align: "center"
        },
        props: {
          variant: "contained",
          style: {
            color: "white",
            marginRight: "8px",
            backgroundColor: "rgba(0, 0, 0, 0.6000000238418579)",
            borderRadius: "2px",
            width: "80%",
            height: "48px",
            marginBottom: "8px",
          }
        },
        children: {
          buttonLabel: getLabel({
            labelName: "Search",
            labelKey: "PR_BUTTON_SEARCH"
          })
        },
        onClickDefination: {
          action: "condition",
        callBack: searchLibraryApiCall
        }
      },

      ResetButton: {
        componentPath: "Button",
        gridDefination: {
          xs: 12,
          sm: 4,
          md: 4
          // align: "center",
          // id: "search-btn"
        },
  
        props: {
          variant: "contained",
          style: {
           // marginLeft: "8px",
            backgroundColor: "unset",
            color: "rgb(254, 122, 81)",
            border: "1px solid rgb(254, 122, 81)",
            borderRadius: "2px",
            width: "80%",
            height: "48px",
            marginBottom: "8px",
          }
        },
        children: {
          buttonLabel: getLabel({
            labelName: "RESET",
            labelKey: "PR_BUTTON_RESET"
          })
        },
        onClickDefination: {
          action: "condition",
       callBack: ResetLibraryField
        }
      }

    }),
    
  })
});

export const PressNoteFilter = getCommonCard({
  
  pressNoteFilterContainer: getCommonContainer({


  
    fileNumber: getTextField({
      label: {
        labelName: "File Number",
        labelKey: "PR_PRESS_NOTE_FILE_NUMBER"
      },
      placeholder: {
        labelName: "Enter File Number",
        labelKey: "PR_PRESS_NOTE_FILE_NUMBER_PLACEHOLDER"
      },
      gridDefination: {
        xs: 12,
        sm: 4
      },
      required: false,
      pattern:  getPattern("fileNumber"),
      errorMessage: "PR_PRESS_NOTE_FILE_NUMBER_INVALID",
      jsonPath: "PublicRelation[0].filterpress.fileNumber"
    }),
    Subject: getTextField({
      label: {
        labelName: "Subject",
        labelKey: "PR_PRESS_NOTE_SUBJECT"
      },
      placeholder: {
        labelName: "Enter Subject",
        labelKey: "PR_PRESS_NOTE_SUBJECT_PLACEHOLDER"
      },
      gridDefination: {
        xs: 12,
        sm: 4
      },
      required: false,
      //pattern: /^[a-zA-Z ]*$/i,
      errorMessage: "PR_PRESS_NOTE_SUBJECT_INVALID",
      jsonPath: "PublicRelation[0].filterpress.subject"
    }),
    fromDate: getDateField({
      label: { labelName: "From Date", labelKey: "PR_PRESS_FROM_DATE_LABEL" },
      placeholder: {
        labelName: "From Date",
        labelKey: "PR_PRESS_FROM_DATE_PLACEHOLDER"
      },
      jsonPath: "PublicRelation[0].filterpress.fromDate",
      gridDefination: {
        xs: 12,
        sm: 4
      },
      pattern: getPattern("Date"),
      errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
      required: false,
    }),

    toDate: getDateField({
      label: { labelName: "To Date", labelKey: "PR_PRESS_TO_DATE_LABEL" },
      placeholder: {
        labelName: "To Date",
        labelKey: "PR_PRESS_TO_DATE_PLACEHOLDER"
      },
      jsonPath: "PublicRelation[0].filterpress.toDate",
      gridDefination: {
        xs: 12,
        sm: 4
      },
      pattern: getPattern("Date"),
      errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
      required: false,
    }),
    
    
  }),
  

  button: getCommonContainer({
    buttonContainer: getCommonContainer({
     
      searchButton: {
        componentPath: "Button",
        gridDefination: {
          xs: 12,
          sm: 4,
          md: 4
          // align: "center"
        },
        props: {
          variant: "contained",
          style: {
            color: "white",
            marginRight: "8px",
            backgroundColor: "rgba(0, 0, 0, 0.6000000238418579)",
            borderRadius: "2px",
            width: "80%",
            height: "48px",
            marginBottom: "8px",
          }
        },
        children: {
          buttonLabel: getLabel({
            labelName: "Search",
            labelKey: "PR_BUTTON_SEARCH"
          })
        },
        onClickDefination: {
          action: "condition",
        callBack: searchPressApiCall
        }
      },
    
    ResetButton: {
      componentPath: "Button",
      gridDefination: {
        xs: 12,
        sm: 4,
        md: 4
        // align: "center",
        // id: "search-btn"
      },

      props: {
        variant: "contained",
        style: {
         // marginLeft: "8px",
          backgroundColor: "unset",
          color: "rgb(254, 122, 81)",
          border: "1px solid rgb(254, 122, 81)",
          borderRadius: "2px",
          width: "80%",
          height: "48px",
          marginBottom: "8px",
        }
      },
      children: {
        buttonLabel: getLabel({
          labelName: "RESET",
          labelKey: "PR_BUTTON_RESET"
        })
      },
      onClickDefination: {
        action: "condition",
     callBack: ResetGENPRESSField
      }
    }
  }),
  })
});




export const TenderFilter = getCommonCard({
  
  tenderFilterContainer: getCommonContainer({
    tenderId: getTextField({
      label: {
        labelName: "Tender Id",
        labelKey: "PR_TENDER_ID"
      },
      placeholder: {
        labelName: "Enter Tender Id",
        labelKey: "PR_TENDER_ID"
      },
      gridDefination: {
        xs: 12,
        sm: 4
      },
      required: false,
     // pattern: /^[a-zA-Z ]*$/i,
      errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
      jsonPath: "PublicRelation[0].filtertender.tenderId"
    }),

  
    fileNumber: getTextField({
      label: {
        labelName: "File Number",
        labelKey: "PR_FILE_NUMBER"
      },
      placeholder: {
        labelName: "Enter File Number",
        labelKey: "PR_FILE_NUMBER_PLACEHOLDER"
      },
      gridDefination: {
        xs: 12,
        sm: 4
      },
      required: false,
      pattern: getPattern("fileNumber"),
      errorMessage: "PR_TENDER_FILE_NUMBER_INVALID",
      jsonPath: "PublicRelation[0].filtertender.fileNumber"
    }),
    Subject: getTextField({
      label: {
        labelName: "Subject",
        labelKey: "PR_TENDER_DETAILS_SUBJECT"
      },
      placeholder: {
        labelName: "Enter Subject",
        labelKey: "PR_TENDER_DETAILS_SUBJECT_PLACEHOLDER"
      },
      gridDefination: {
        xs: 12,
        sm: 4
      },
      required: false,
     // pattern: /^[a-zA-Z ]*$/i,
      errorMessage: "PR_PRESS_NOTE_EMAIL_SUBJECT_INVALID",
      jsonPath: "PublicRelation[0].filtertender.subject"
    }),
    fromDate: getDateField({
      label: { labelName: "From Date", labelKey: "PR_PRESS_FROM_DATE_LABEL" },
      placeholder: {
        labelName: "From Date",
        labelKey: "PR_PRESS_FROM_DATE_LABEL"
      },
      jsonPath: "PublicRelation[0].filtertender.fromDate",
      gridDefination: {
        xs: 12,
        sm: 4
      },
      pattern: getPattern("Date"),
      errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
      required: false,
    }),

    toDate: getDateField({
      label: { labelName: "To Date", labelKey: "PR_PRESS_TO_DATE_LABEL" },
      placeholder: {
        labelName: "To Date",
        labelKey: "PR_PRESS_TO_DATE_PLACEHOLDER"
      },
      jsonPath: "PublicRelation[0].filtertender.toDate",
      gridDefination: {
        xs: 12,
        sm: 4
      },
      pattern: getPattern("Date"),
      errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
      required: false,
    }),
    
    
  }),
  

  button: getCommonContainer({
    buttonContainer: getCommonContainer({
     
      searchButton: {
        componentPath: "Button",
        gridDefination: {
          xs: 12,
          sm: 4,
          md: 4
          // align: "center"
        },
        props: {
          variant: "contained",
          style: {
            color: "white",
            marginRight: "8px",
            backgroundColor: "rgba(0, 0, 0, 0.6000000238418579)",
            borderRadius: "2px",
            width: "80%",
            height: "48px",
            marginBottom: "8px",
          }
        },
        children: {
          buttonLabel: getLabel({
            labelName: "Search",
            labelKey: "PR_BUTTON_SEARCH"
          })
        },
        onClickDefination: {
          action: "condition",
        callBack: searchTenderApiCall
        }
      },
   
    ResetButton: {
      componentPath: "Button",
      gridDefination: {
        xs: 12,
        sm: 4,
        md: 4
        // align: "center",
        // id: "search-btn"
      },

      props: {
        variant: "contained",
        style: {
          ////// marginLeft: "8px",
          backgroundColor: "unset",
          color: "rgb(254, 122, 81)",
          border: "1px solid rgb(254, 122, 81)",
          borderRadius: "2px",
          width: "80%",
          height: "48px",
          marginBottom: "8px",
        }
      },
      children: {
        buttonLabel: getLabel({
          labelName: "RESET",
          labelKey: "PR_BUTTON_RESET"
        })
      },
      onClickDefination: {
        action: "condition",
    callBack: ResetTenderField
      }
    }
  }),
  })
});





export const pressMasterFilter = getCommonCard({
  
  pressMasterFilterContainer: getCommonContainer({


  
    publicationName: getTextField({
      label: {
        labelName: "Publication Name",
        labelKey: "PR_PRESS_DETAILS_PUBLICATION_NAME"
      },
      placeholder: {
        labelName: "Enter Publication Name",
        labelKey: "PR_PRESS_DETAILS_PUBLICATION_NAME"
      },
      gridDefination: {
        xs: 12,
        sm: 4
      },
      required: false,
      pattern: /^[a-zA-Z ]*$/i,
      errorMessage: "PR_PUBLICATION_NAME_INVALID",
      jsonPath: "PublicRelation[0].filterpressMaster.publicationname"
    }),
//     typeOfPress: getSelectField({
//       label: {
//         labelName: "Event Type Of Press",
//         labelKey: "PR_TYPEOFTHEPRESS"
//       },
//       placeholder: {
//         labelName: "Select Type Of Press",
//         labelKey: "PR_TYPEOFTHEPRESS_PLACEHOLDER"
//       },
//       optionValue:"name",
//       optionLabel:"name"
//  ,   
 
//       jsonPath: "PublicRelation[0].filterpressMaster.typeofpress",
//       sourceJsonPath: "applyScreenMdmsData['RAINMAKER-PR'].pressType",
//       required: false,
//       gridDefination: {
//         xs: 12,
//         sm: 4
//       }
    
//    }),
    typeOfPress: {
      uiFramework: "custom-containers-local",
      moduleName: "egov-pr",
      componentPath: "AutosuggestContainer",
      jsonPath: "PublicRelation[0].filterpressMaster.typeofpress",

      
            required: false,
   gridDefination: {
    xs: 12,
    sm: 4
  },
    props: {
    style: {
    width: "100%",
    cursor: "pointer"
    },
   
    className:"basic-multi-select",
    label: {
      labelName: "Event Type Of Press",
      labelKey: "PR_TYPEOFTHEPRESS"
    },
    placeholder: {
      labelName: "Select Type Of Press",
      labelKey: "PR_TYPEOFTHEPRESS_PLACEHOLDER"
    },
    jsonPath: "PublicRelation[0].filterpressMaster.typeofpress",
      sourceJsonPath: "applyScreenMdmsData['RAINMAKER-PR'].pressType",
    labelsFromLocalisation: false,
    suggestions: [],
    fullwidth: true,
    required: false,
    inputLabelProps: {
      shrink: true
    },
    isMulti: false,
  labelName: "name",
   valueName: "name"
    },
  },
    PersonnelName: getTextField({
      label: {
        labelName: "Personnel Name",
        labelKey: "PR_PRESS_DETAILS_PERSONNEL_NAME"
      },
      placeholder: {
        labelName: "Enter Personnel Namet",
        labelKey: "PR_PRESS_DETAILS_PERSONNEL_NAME"
      },
      gridDefination: {
        xs: 12,
        sm: 4
      },
      required: false,
      pattern: /^[a-zA-Z ]*$/i,
      errorMessage: "PR_PERSONNEL_NAME_INVALID",
      jsonPath: "PublicRelation[0].filterpressMaster.personnelname"
    }),
   
    
    
  }),
  

  button: getCommonContainer({
    buttonContainer: getCommonContainer({
     
      searchButton: {
        componentPath: "Button",
        gridDefination: {
          xs: 12,
          sm: 4,
          md: 4
          // align: "center"
        },
        props: {
          variant: "contained",
          style: {
            color: "white",
            marginRight: "8px",
            backgroundColor: "rgba(0, 0, 0, 0.6000000238418579)",
            borderRadius: "2px",
            width: "80%",
            height: "48px",
            marginBottom: "8px",
          }
        },
        children: {
          buttonLabel: getLabel({
            labelName: "Search",
            labelKey: "PR_BUTTON_SEARCH"
          })
        },
        onClickDefination: {
          action: "condition",
        callBack: searchPressMasterApiCall
        }
      },
   
    ResetButton: {
      componentPath: "Button",
      gridDefination: {
        xs: 12,
        sm: 4,
        md: 4
        // align: "center",
        // id: "search-btn"
      },

      props: {
        variant: "contained",
        style: {
           //// marginLeft: "8px",
            backgroundColor: "unset",
            color: "rgb(254, 122, 81)",
            border: "1px solid rgb(254, 122, 81)",
            borderRadius: "2px",
            width: "80%",
            height: "48px",
            marginBottom: "8px",
        }
      },
      children: {
        buttonLabel: getLabel({
          labelName: "RESET",
          labelKey: "PR_BUTTON_RESET"
        })
      },
      onClickDefination: {
        action: "condition",
     callBack: ResetPressField
      }
    }
  }),
  })
});