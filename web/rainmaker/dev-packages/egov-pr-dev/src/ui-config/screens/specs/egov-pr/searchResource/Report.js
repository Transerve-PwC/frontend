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
  import "./index.css";
  import { handleScreenConfigurationFieldChange as handleField } from "egov-ui-framework/ui-redux/screen-configuration/actions";
  import { TimeSeriesReportSearch,EventReportSearch,LocalityReportSearch } from "./functions";
  import {
    getTodaysDateInYMD,
    getStartDateValue
    }  from "../../utils";
    import get from "lodash/get";
    
  
    export const ResetTimeseriesField = async (state, dispatch) =>{
      let month=get(
        state.screenConfiguration.preparedFinalObject,
        "TimeseriesReport.Month"
      )
      let year=get(
        state.screenConfiguration.preparedFinalObject,
        "TimeseriesReport.Year"
      )
      let Aggrigate=get(
        state.screenConfiguration.preparedFinalObject,
        "TimeseriesReport.AggrigatedBy"
      )
      if((Aggrigate!==undefined ) )
      {
     
          
       
        dispatch(
          handleField(
            "TimeSeriesReport",
            "components.div.children.TimeSeriesReport.children.cardContent.children.TimeseriesReportContainer.children.AggrigatedBy",
            "props.value",
            undefined
          )
        );
  
         

        }
         if(month!==undefined  )
        {

         
  
          dispatch(
            handleField(
              "TimeSeriesReport",
              "components.div.children.TimeSeriesReport.children.cardContent.children.TimeseriesReportContainer.children.Month",
              "props.value",
              undefined
            )
          );

        }
         if( year!==undefined  )
        {

         
          dispatch(
            handleField(
              "TimeSeriesReport",
              "components.div.children.TimeSeriesReport.children.cardContent.children.TimeseriesReportContainer.children.Year",
              "props.value",
              undefined
            )
          );
        
        }
     
          
         
  

        
          
        }
        export const ResetEventField = async (state, dispatch) =>{
          
              
          let dept=get(
            state.screenConfiguration.preparedFinalObject,
            "eventReport.dept"
          )
if(dept!=undefined )
{


              dispatch(
                handleField(
                  "EventReport",
                  "components.div.children.EventWiseReport.children.cardContent.children.EventReportContainer.children.DepartmentName",
                  "props.value",
                  undefined
                )
              );
            }
  
              
            }

          export const ResetLocalityField = async (state, dispatch) =>{
           
            let fromDate=get(
              state.screenConfiguration.preparedFinalObject,
              "LocalityReport.fromDate"
            )
            let todate=get(
              state.screenConfiguration.preparedFinalObject,
              "LocalityReport.toDate"
            )
            let localityName=get(
              state.screenConfiguration.preparedFinalObject,
              "LocalityReport.localityname"
            )
            if((fromDate!==undefined ) )
            {
           
                
                
                dispatch(
                  handleField(
                    "LocalityReports",
                    "components.div.children.LocalityWiseReport.children.cardContent.children.LocalityReportContainer.children.fromDate",
                    "props.value",
                    undefined
                  )
                );
        
               
    
              }
               if(todate!==undefined  )
              {

               
        
                dispatch(
                  handleField(
                    "LocalityReports",
                    "components.div.children.LocalityWiseReport.children.cardContent.children.LocalityReportContainer.children.toDate",
                    "props.value",
                    undefined
                  )
                );

              }
               if( localityName!==undefined  )
              {

                dispatch(
                  handleField(
                    "LocalityReports",
                    "components.div.children.LocalityWiseReport.children.cardContent.children.LocalityReportContainer.children.LocalityName",
                    "props.value",
                    undefined
                  )
                );
              
              }
              
                
              }
              
  export const TimeSeriesReport = getCommonCard({
    
    
    TimeseriesReportContainer: getCommonContainer({
      // Year: getSelectField({
      //   label: {
      //     labelName: "Year",
      //     labelKey: "PR_REPORT_YEAR_LABEL"
      //   },
      //   placeholder: {
      //     labelName: "Select Year",
      //     labelKey: "PR_REPORT_YEAR_PLACEHOLDER"
      //   },
  
       
      //   jsonPath: "TimeseriesReport.Year",
      //   sourceJsonPath: "applyScreenMdmsData['RAINMAKER-PR'].eventReportYear",
      //   required: true,
      //   optionValue:"code",
      //   optionLabel:"name",
      //   gridDefination: {
      //     xs: 12,
      //     sm: 4
      //   }
      
      // }),
  
      // Month: getSelectField({
      //   label: {
      //     labelName: "Month",
      //     labelKey: "PR_REPORT_MONTH_LABEL"
      //   },
      //   placeholder: {
      //     labelName: "Select Month",
      //     labelKey: "PR_REPORT_MONTH_PLACEHOLDER"
      //   },
  
        
      //   jsonPath: "TimeseriesReport.Month",
      //   sourceJsonPath: "applyScreenMdmsData['RAINMAKER-PR'].eventReportMonth",
      //   optionValue:"code",
      //   optionLabel:"name",
      //   required: false,
      //   gridDefination: {
      //     xs: 12,
      //     sm: 4
      //   }
      
      // }),
      Year: {
        uiFramework: "custom-containers-local",
        moduleName: "egov-pr",
        componentPath: "AutosuggestContainer",
        jsonPath: "TimeseriesReport.Year",

        
              required: true,
     gridDefination: {
      xs: 12,
      sm: 4
    },
      props: {
      style: {
      width: "100%",
      cursor: "pointer",
      

      },
     
      className: "citizen-city-picker",
      label: {
        labelName: "Year",
        labelKey: "PR_REPORT_YEAR_LABEL"
      },
      placeholder: {
        labelName: "Select Year",
        labelKey: "PR_REPORT_YEAR_PLACEHOLDER"
      },

     
      jsonPath: "TimeseriesReport.Year",
      sourceJsonPath: "applyScreenMdmsData['RAINMAKER-PR'].eventReportYear",
      labelsFromLocalisation: false,
      suggestions: [],
      fullwidth: true,
      required: true,
      inputLabelProps: {
        shrink: true
      },
      isMulti: false,
    labelName: "name",
     valueName: "name"
      },
    },
    Month: {
      uiFramework: "custom-containers-local",
      moduleName: "egov-pr",
      componentPath: "AutosuggestContainer",
      jsonPath: "TimeseriesReport.Month",
      
            required: false,
   gridDefination: {
    xs: 12,
    sm: 4
  },
    props: {
    style: {
    width: "100%",
    cursor: "pointer",
    

    },
   
    className: "citizen-city-picker",
    label: {
      labelName: "Month",
      labelKey: "PR_REPORT_MONTH_LABEL"
    },
    placeholder: {
      labelName: "Select Month",
      labelKey: "PR_REPORT_MONTH_PLACEHOLDER"
    },

    
    jsonPath: "TimeseriesReport.Month",
    sourceJsonPath: "applyScreenMdmsData['RAINMAKER-PR'].eventReportMonth",
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

      // AggrigatedBy: getSelectField({
      //   label: {
      //     labelName: "Aggrigated By",
      //     labelKey: "PR_REPORT_AGGRIGATEDBY_LABEL"
      //   },
      //   placeholder: {
      //     labelName: "Select AggrigatedBy",
      //     labelKey: "PR_REPORT_AGGRIGATEDBY_LABEL_PLACEHOLDER"
      //   },
        
       
      //   jsonPath: "TimeseriesReport.AggrigatedBy",
      //   sourceJsonPath: "applyScreenMdmsData['RAINMAKER-PR'].eventReportAggregatedBy",
      //   optionValue:"name",
      //   optionLabel:"name",
      //   required: true,
      //   gridDefination: {
      //     xs: 12,
      //     sm: 4
      //   }
      // }),

      AggrigatedBy: {
        uiFramework: "custom-containers-local",
        moduleName: "egov-pr",
        componentPath: "AutosuggestContainer",
        jsonPath: "TimeseriesReport.AggrigatedBy",
        
              required: true,
     gridDefination: {
      xs: 12,
      sm: 4
    },
      props: {
      style: {
      width: "100%",
      cursor: "pointer",
      
  
      },
     
      className: "citizen-city-picker",
      label: {
        labelName: "Aggrigated By",
        labelKey: "PR_REPORT_AGGRIGATEDBY_LABEL"
      },
      placeholder: {
        labelName: "Select AggrigatedBy",
        labelKey: "PR_REPORT_AGGRIGATEDBY_LABEL_PLACEHOLDER"
      },
      
     
      jsonPath: "TimeseriesReport.AggrigatedBy",
      sourceJsonPath: "applyScreenMdmsData['RAINMAKER-PR'].eventReportAggregatedBy",
      labelsFromLocalisation: false,
      suggestions: [],
      fullwidth: true,
      required: true,
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
              labelName: "Apply",
              labelKey: "PR_APPLY_RESULTS_BUTTON_SEARCH"
            })
          },
          onClickDefination: {
            action: "condition",
            callBack: TimeSeriesReportSearch
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
          callBack: ResetTimeseriesField
          }
        }
      })
    })
  });
  


  export const EventWiseReport = getCommonCard({
    
    
    EventReportContainer: getCommonContainer({
      // DepartmentName: getSelectField({
      //   label: {
      //     labelName: "Department Name",
      //     labelKey: "PR_REPORT_DEPARTMENTNAME_LABEL"
      //   },
      //   placeholder: {
      //     labelName: "Select Department Name",
      //     labelKey: "PR_REPORT_DEPARTMENTNAME_PLACEHOLDER"
      //   },
      //   optionValue:"code",
      //   optionLabel:"name",
  
      //   sourceJsonPath: "applyScreenMdmsData['common-masters'].Department",
      //   jsonPath: "eventReport.dept",
      //   required: true,
      //   gridDefination: {
      //     xs: 12,
      //     sm: 4
      //   }
      
      // }),
  
      DepartmentName: {
        uiFramework: "custom-containers-local",
        moduleName: "egov-pr",
        componentPath: "AutosuggestContainer",
        jsonPath: "eventReport.dept",
        
              required: true,
     gridDefination: {
      xs: 12,
      sm: 4
    },
      props: {
      style: {
      width: "100%",
      cursor: "pointer",
      },
     
      className: "citizen-city-picker",
      label: {
        labelName: "Department Name",
        labelKey: "PR_REPORT_DEPARTMENTNAME_LABEL"
      },
      placeholder: {
        labelName: "Select Department Name",
        labelKey: "PR_REPORT_DEPARTMENTNAME_PLACEHOLDER"
      },   
      sourceJsonPath: "applyScreenMdmsData['common-masters'].Department",
      jsonPath: "eventReport.dept",
     
      labelsFromLocalisation: false,
      suggestions: [],
      fullwidth: true,
      required: true,
      inputLabelProps: {
        shrink: true
      },
      isMulti: false,
    // labelName: "name",
    //  valueName: "name"
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
              labelName: "Apply",
              labelKey: "PR_APPLY_RESULTS_BUTTON_SEARCH"
            })
          },
          onClickDefination: {
            action: "condition",
            callBack: EventReportSearch
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
          callBack: ResetEventField
          }
        }
      })
    })
  });
  





  export const LocalityWiseReport = getCommonCard({
 
    LocalityReportContainer: getCommonContainer({
      fromDate: getDateField({
        label: { labelName: "From Date", labelKey: "PR_EVENT_CREATE_DATE_LABEL" },
        placeholder: {
          labelName: "From Date",
          labelKey: "PR_EVENT_CREATE_DATE_PLACEHOLDER"
        },
        jsonPath: "LocalityReport.fromDate",
       
        gridDefination: {
          xs: 12,
          sm: 4
        },
        pattern: getPattern("Date"),
        errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
        required: true,
        afterFieldChange: (action, state, dispatch) => {
              dispatch(
                handleField(
                  "LocalityReports",
                  "components.div.children.LocalityWiseReport.children.cardContent.children.LocalityReportContainer.children.toDate",
                  "props.inputProps.min",
                  action.value
                )
              );
             
              },
      }),
  
      toDate: getDateField({
        label: { labelName: "To Date", labelKey: "PR_EVENT_TO_DATE_LABEL" },
        placeholder: {
          labelName: "To Date",
          labelKey: "PR_EVENT_TO_DATE_PLACEHOLDER"
        },
        jsonPath: "LocalityReport.toDate",
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
        errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
        required: true
      }),
  //     LocalityName: getSelectField({
  //       label: {
  //         labelName: "Locality Name",
  //         labelKey: "PR_REPORT_LOCALITYNAME_LABEL"
  //       },
  //       placeholder: {
  //         labelName: "Select Locality Name",
  //         labelKey: "PR_REPORT_LOCALITYNAME_LABEL_PLACEHOLDER"
  //       },
  // optionLabel:"name",
  // optionValue:"name",
  
  //       jsonPath: "LocalityReport.localityname",
  //    sourceJsonPath: "applyScreenMdmsData['RAINMAKER-PR'].localityAreaName",
  //       required: true,
  //       gridDefination: {
  //         xs: 12,
  //         sm: 4
  //       }
      
  //     }),

      LocalityName: {
        uiFramework: "custom-containers-local",
        moduleName: "egov-pr",
        componentPath: "AutosuggestContainer",
        jsonPath: "LocalityReport.localityname",
        
              required: true,
     gridDefination: {
      xs: 12,
      sm: 4
    },
      props: {
      style: {
      width: "100%",
      cursor: "pointer",
      

      },
     
      className: "citizen-city-picker",
      label: {
        labelName: "Locality Name",
        labelKey: "PR_REPORT_LOCALITYNAME_LABEL"
      },
      placeholder: {
        labelName: "Select Locality Name",
        labelKey: "PR_REPORT_LOCALITYNAME_LABEL_PLACEHOLDER"
      },    
      jsonPath: "LocalityReport.localityname",
      sourceJsonPath: "applyScreenMdmsData['RAINMAKER-PR'].localityAreaName",
     
      labelsFromLocalisation: false,
      suggestions: [],
      fullwidth: true,
      required: true,
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
              labelName: "Apply",
              labelKey: "PR_APPLY_RESULTS_BUTTON_SEARCH"
            })
          },
          onClickDefination: {
            action: "condition",
            callBack: LocalityReportSearch
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
          callBack: ResetLocalityField
          }
        }
      })
    })
  });
  