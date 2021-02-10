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
  import { handleScreenConfigurationFieldChange as handleField } from "egov-ui-framework/ui-redux/screen-configuration/actions";
  import { searchApiCall1,searchApiCall2,searchApiCall3,searchApiCall4} from "./functions";
  import {
    getCommonHeader,
    getTodaysDateInYMD,
    getCommonSubHeader,
    
  } from "egov-ui-framework/ui-config/screens/specs/utils";
  import { UpdateMasterPrice } from "../../../../../ui-utils/commons";
  import {
    getAccessToken,
    getOPMSTenantId,
    getLocale,
    getUserInfo
  } from "egov-ui-kit/utils/localStorageUtils";
  import get from "lodash/get";
  import { convertEpochToDate, convertDateToEpoch } from "../../utils/index";
  
  // import { getTodaysDateInYMD,getFinancialYearDates} from "../../utils";
  
  
import './index.css'
  
  export const UpdateMaster = async (state, dispatch) => {





      let date=convertEpochToDate(get(
        state.screenConfiguration.preparedFinalObject,
        "Matserdata[0].effectiveFromDate"
      ))
      date=date.split('/')
      date=date[2]+'-'+date[1]+'-'+date[0]
      //alert(date)
     let data= { 
        "tenantId":getOPMSTenantId(),
        "applicationType":"ADVERTISEMENTNOC",
        "applicationStatus":"UPDATE",
        "dataPayload": {
        "effective_from_date":date,
        "category_id": get(
    state.screenConfiguration.preparedFinalObject,
    "Matserdata[0].categoryId"
  ),
        "sub_category_id": get(
            state.screenConfiguration.preparedFinalObject,
            "Matserdata[0].subCategoryId"
          ),
        "per_day_price": get(
            state.screenConfiguration.preparedFinalObject,
            "Matserdata[0].perDayPrice"
          ),
        "per_week_price":get(
            state.screenConfiguration.preparedFinalObject,
            "Matserdata[0].perWeekPrice"
          ),
        "per_month_price": get(
            state.screenConfiguration.preparedFinalObject,
            "Matserdata[0].perMonthPrice"
          ),
        "annual_price": get(
            state.screenConfiguration.preparedFinalObject,
            "Matserdata[0].annualPrice"
          ),
        "fixed_price": get(
            state.screenConfiguration.preparedFinalObject,
            "Matserdata[0].fixedPrice"
          ),
       // "fixed_price": 1,
        "cal_squenece":"1"
        }
        }


        UpdateMasterPrice([],
            data
          );
        
  }
  const resetFields = (state, dispatch) => {
    dispatch(
      handleField(
        "search",
        "components.div.children.NOCApplication.children.cardContent.children.appNOCAndMobNumContainer.children.applicationNo",
        "props.value",
        ""
      )
    );
    dispatch(
      handleField(
        "search",
        "components.div.children.NOCApplication.children.cardContent.children.appNOCAndMobNumContainer.children.NOCNo",
        "props.value",
        ""
      )
    );
    dispatch(
      handleField(
        "search",
        "components.div.children.NOCApplication.children.cardContent.children.appNOCAndMobNumContainer.children.ownerMobNo",
        "props.value",
        ""
      )
    );
    dispatch(
      handleField(
        "search",
        "components.div.children.NOCApplication.children.cardContent.children.appStatusAndToFromDateContainer.children.applicationNo",
        "props.value",
        ""
      )
    );
    dispatch(
      handleField(
        "search",
        "components.div.children.NOCApplication.children.cardContent.children.appStatusAndToFromDateContainer.children.fromDate",
        "props.value",
        ""
      )
    );
    dispatch(
      handleField(
        "search",
        "components.div.children.NOCApplication.children.cardContent.children.appStatusAndToFromDateContainer.children.toDate",
        "props.value",
        ""
      )
    );
  };
  
  export const NOCApplication = getCommonCard({
    subHeader: getCommonTitle({
      labelName: "Select Advertisement Category",
      labelKey: "NOC_SELECT_ADVERTISEMENT_CATEGORY_HEADING"
    }),
    
  
    appStatusAndToFromDateContainer: getCommonContainer({
     
  
      Category: getSelectField({
        label: { labelName: "Category", labelKey: "NOC_CATEGORY_LABEL" },
        optionLabel: "name",
        optionValue : "id",
        
                
        placeholder: {
          labelName: "Category",
          labelKey: "NOC_CATEGORY_PLACEHOLDER"
        },
      //  jsonPath: "searchScreen.fromDate",
        gridDefination: {
          xs: 12,
          sm: 4
        },
        props:{
disabled:true
        },
    //    pattern: getPattern("Date"),
     //   errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
     jsonPath: "Matserdata[0].categoryId"  , 
     sourceJsonPath:"category",
        required: false,

      }),
  
      SubCategory: getSelectField({
        label: { labelName: "SubCategory", labelKey: "NOC_SUB_CATEGORE_LABEL" },
        optionLabel: "name",
        optionValue :"id",
        placeholder: {
          labelName: "SubCategorye",
          labelKey: "NOC_SUB_CATEGOR_PLACEHOLDER"
        },
    //    jsonPath: "searchScreen.toDate",
        gridDefination: {
          xs: 12,
          sm: 4
        },
        props:{
            disabled:true
                    },
        jsonPath: "Matserdata[0].subCategoryId"  , 
        sourceJsonPath:"subcategory",
        
      //  pattern: getPattern("Date"),
     //   errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
        required: false
      })
    }),
  
    // button: getCommonContainer({
    //   buttonContainer: getCommonContainer({
    //     resetButton: {
    //       componentPath: "Button",
    //       gridDefination: {
    //         xs: 12,
    //         sm: 6
    //         // align: "center"
    //       },
    //       props: {
    //         variant: "outlined",
    //         style: {
    //           color: "#FE7A51",
    //           borderColor: "#FE7A51",
    //           width: "220px",
    //           height: "48px",
    //           margin: "8px",
    //           float: "right"
    //         }
    //       },
    //       children: {
    //         buttonLabel: getLabel({
    //           labelName: "Reset",
    //           labelKey: "NOC_HOME_SEARCH_RESET_BUTTON"
    //         })
    //       },
    //       onClickDefination: {
    //         action: "condition",
    //         callBack: resetFields
    //       }
    //     },
    //     searchButton: {
    //       componentPath: "Button",
    //       gridDefination: {
    //         xs: 12,
    //         sm: 6
    //         // align: "center"
    //       },
    //       props: {
    //         variant: "contained",
    //         style: {
    //           color: "white",
    //           margin: "8px",
    //           backgroundColor: "rgba(0, 0, 0, 0.6000000238418579)",
    //           borderRadius: "2px",
    //           width: "220px",
    //           height: "48px"
    //         }
    //       },
    //       children: {
    //         buttonLabel: getLabel({
    //           labelName: "Search",
    //           labelKey: "NOC_HOME_SEARCH_RESULTS_BUTTON_SEARCH"
    //         })
    //       },
    //       onClickDefination: {
    //         action: "condition",
    //         callBack: searchApiCall
    //       }
    //     }
    //   })
    // })
  });
  export const NOCApplication2 = getCommonCard({
    
    
    masterContainer: getCommonContainer({
        FromDate: getDateField({
            label: { labelName: "FromDate Date", labelKey: "NOC_FROM_DATE_LABEL" },
            placeholder: {
              labelName: "FromDate Date",
              labelKey: "NOC_FROM_DATE_PLACEHOLDER"
            },
            gridDefination: {
              xs: 12,
              sm: 4
            },
             pattern: getPattern("Date"),
          
            jsonPath:"MISSummaryReport[0].FromDate",
            sourceJsonPath:"MISSummaryReport[0].FromDate",
            maxValue: new Date(),      
            props: {
                inputProps: {
                 max: getTodaysDateInYMD()
                }
              },
    required:true
                                  
      }),

      ToDate: getDateField({
        label: { labelName: "To Date", labelKey: "NOC_TO_DATE_LABEL" },
        placeholder: {
          labelName: "To Date",
          labelKey: "NOC_TO_DATE_PLACEHOLDER"
        },
        gridDefination: {
          xs: 12,
          sm: 4
        },
         pattern: getPattern("Date"),
        jsonPath:"MISSummaryReport[0].ToDate",
       sourceJsonPath:"MISSummaryReport[0].ToDate",
        maxValue: new Date(),
        props: {
            inputProps: {
            max: getTodaysDateInYMD()
            }
          },
          required: true
    
          
       
      }),
     
                              
  }),
   
  
    button: getCommonContainer({
      buttonContainer: getCommonContainer({
       
        searchButton: {
          componentPath: "Button",
          gridDefination: {
            xs: 12,
            sm: 6
            // align: "center"
          },
          props: {
            variant: "contained",
            style: {
              color: "white",
              margin: "8px",
              backgroundColor: "rgba(0, 0, 0, 0.6000000238418579)",
              borderRadius: "2px",
              width: "220px",
              height: "48px"
            }
          },
          children: {
            buttonLabel: getLabel({
              labelName: "Apply",
              labelKey: "NOC_APPLY_BUTTON"
            })
          },
          onClickDefination: {
            action: "condition",
            callBack: searchApiCall1
            

          }
        }
      })
    })
  });


  //report2
  export const NOCReport2= getCommonCard({
   
    
    masterContainer: getCommonContainer({
        FromDate: getDateField({
            label: { labelName: "FromDate Date", labelKey: "NOC_FROM_DATE_LABEL" },
            placeholder: {
              labelName: "FromDate Date",
              labelKey: "NOC_FROM_DATE_PLACEHOLDER"
            },
            gridDefination: {
              xs: 12,
              sm: 4
            },
             pattern: getPattern("Date"),
             required:true,
            jsonPath:"RevenueByApplicationTypeReport[0].FromDate" ,       
            sourceJsonPath:"RevenueByApplicationTypeReport[0].FromDate",
            maxValue: new Date(),      
            props: {
                inputProps: {
                 max: getTodaysDateInYMD()
                }
              }
      }),

      ToDate: getDateField({
        label: { labelName: "To Date", labelKey: "NOC_TO_DATE_LABEL" },
        placeholder: {
          labelName: "To Date",
          labelKey: "NOC_TO_DATE_PLACEHOLDER"
        },
        gridDefination: {
          xs: 12,
          sm: 4
        },
         pattern: getPattern("Date"),
         required:true,
         
        jsonPath:"RevenueByApplicationTypeReport[0].ToDate",
        sourceJsonPath:"RevenueByApplicationTypeReport[0].ToDate",
        maxValue: new Date(),      
        props: {
            inputProps: {
             max: getTodaysDateInYMD()
            }
          } 
      }),
                           
  }),
   
  
    button: getCommonContainer({
      buttonContainer: getCommonContainer({
       
        searchButton: {
          componentPath: "Button",
          gridDefination: {
            xs: 12,
            sm: 6
            // align: "center"
          },
          props: {
            variant: "contained",
            style: {
              color: "white",
              margin: "8px",
              backgroundColor: "rgba(0, 0, 0, 0.6000000238418579)",
              borderRadius: "2px",
              width: "220px",
              height: "48px"
            }
          },
          children: {
            buttonLabel: getLabel({
              labelName: "Apply",
              labelKey: "NOC_APPLY_BUTTON"
            })
          },
          onClickDefination: {
            action: "condition",
            callBack: searchApiCall2
            

          }
        }
      })
    })
  });























  export const NOCReport3= getCommonCard({
    
     
     masterContainer: getCommonContainer({
         FromDate: getDateField({
             label: { labelName: "FromDate Date", labelKey: "NOC_FROM_DATE_LABEL" },
             placeholder: {
               labelName: "FromDate Date",
               labelKey: "NOC_FROM_DATE_PLACEHOLDER"
             },
             gridDefination: {
               xs: 12,
               sm: 4
             },
              pattern: getPattern("Date"),
              required:true,
              
             jsonPath:"reportSectorWise[0].FromDate" ,       
             sourceJsonPath:"reportSectorWise[0].FromDate",
             maxValue: new Date(),      
             props: {
                 inputProps: {
                  max: getTodaysDateInYMD()
                 }
               }
 
                                   
       }),
 
       ToDate: getDateField({
         label: { labelName: "To Date", labelKey: "NOC_TO_DATE_LABEL" },
         placeholder: {
           labelName: "To Date",
           labelKey: "NOC_TO_DATE_PLACEHOLDER"
         },
         gridDefination: {
           xs: 12,
           sm: 4
         },
          pattern: getPattern("Date"),
          required:true,
          
         jsonPath:"reportSectorWise[0].ToDate",
         sourceJsonPath:"reportSectorWise[0].ToDate",
         maxValue: new Date(),      
         props: {
             inputProps: {
              max: getTodaysDateInYMD()
             }
           }

           
        
       }),
    //    Sector: getSelectField({
    //     label: { labelName: "Sector", labelKey: "NOC_SECTOR_LABEL" },
    //     optionLabel: "code",
    //     optionValue :"name",
    //     placeholder: {
    //       labelName: "Sector",
    //       labelKey: "NOC_SECTOR_PLACEHOLDER"
    //     },
       
    // //    jsonPath: "searchScreen.toDate",
    //     gridDefination: {
    //       xs: 12,
    //       sm: 4
    //     },
       
    //     jsonPath: "reportSectorWise[0].sector"  , 
    //    sourceJsonPath:"SectorData",
      
    //   //  pattern: getPattern("Date"),
    //  //   errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
    //     required: false
    //   })
    sector: getSelectField({
      label: { labelName: "Sector", labelKey: "NOC_SECTOR_LABEL" },
      optionLabel: "code",
      optionValue :"code",
      placeholder: {
        labelName: "Sector",
             labelKey: "NOC_SECTOR_PLACEHOLDER"
      },
      
  //    jsonPath: "searchScreen.toDate",
      gridDefination: {
        xs: 12,
        sm: 4
      },
      props: {
     
        style: {
          texttransform: "uppercase"
        }
      },
      jsonPath: "reportSectorWise[0].sector"  , 
sourceJsonPath:"SectorData",
    //  pattern: getPattern("Date"),
   //   errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
      required: true
    }),
                            
   }),
    
   
     button: getCommonContainer({
       buttonContainer: getCommonContainer({
        
         searchButton: {
           componentPath: "Button",
           gridDefination: {
             xs: 12,
             sm: 6
             // align: "center"
           },
           props: {
             variant: "contained",
             style: {
               color: "white",
               margin: "8px",
               backgroundColor: "rgba(0, 0, 0, 0.6000000238418579)",
               borderRadius: "2px",
               width: "220px",
               height: "48px"
             }
           },
           children: {
             buttonLabel: getLabel({
               labelName: "Apply",
               labelKey: "NOC_APPLY_BUTTON"
             })
           },
           onClickDefination: {
             action: "condition",
             callBack: searchApiCall3
             
 
           }
         }
       })
     })
   });





   export const NOCReport4= getCommonCard({
    
     
     masterContainer: getCommonContainer({
       
    Year: getSelectField({
        label: { labelName: "Year", labelKey: "NOC_YEAR_LABEL" },
        optionLabel: "name",
        optionValue :"name",
        placeholder: {
          labelName: "Year",
          labelKey: "NOC_YEAR_PLACEHOLDER"
        },
    //    jsonPath: "searchScreen.toDate",
        gridDefination: {
          xs: 12,
          sm: 4
        },
       
        jsonPath: "reportMonthWise[0].reportYear"  , 
  sourceJsonPath:"reportYear",
      //  pattern: getPattern("Date"),
     //   errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
        required: true
      }),
      Month: getSelectField({
        label: { labelName: "Month", labelKey: "NOC_MONTH_LABEL" },
        optionLabel: "name",
        optionValue :"id",
        placeholder: {
          labelName: "Month",
          labelKey: "NOC_MONTH_PLACEHOLDER"
        },
    //    jsonPath: "searchScreen.toDate",
        gridDefination: {
          xs: 12,
          sm: 4
        },
       
      
        jsonPath: "reportMonthWise[0].reportMonth"  , 
        sourceJsonPath:"reportMonth",
        
      //  pattern: getPattern("Date"),
     //   errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
        required: true
      })
                            
   }),
    
   
     button: getCommonContainer({
       buttonContainer: getCommonContainer({
        
         searchButton: {
           componentPath: "Button",
           gridDefination: {
             xs: 12,
             sm: 6
             // align: "center"
           },
           props: {
             variant: "contained",
             style: {
               color: "white",
               margin: "8px",
               backgroundColor: "rgba(0, 0, 0, 0.6000000238418579)",
               borderRadius: "2px",
               width: "220px",
               height: "48px"
             }
           },
           children: {
             buttonLabel: getLabel({
               labelName: "Apply",
               labelKey: "NOC_APPLY_BUTTON"
             })
           },
           onClickDefination: {
             action: "condition",
             callBack: searchApiCall4             
 
           }
         }
       })
     })
   });













