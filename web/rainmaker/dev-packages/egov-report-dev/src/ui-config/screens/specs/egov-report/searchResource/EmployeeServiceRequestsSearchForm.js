import { getCommonCard, getCommonContainer, getDateField, getLabel, getPattern, getSelectField, getTextField } from "egov-ui-framework/ui-config/screens/specs/utils";
import { searchApiCallForEmployeeFilter } from "./functions";
import { resetFieldsForEmployeeFilter } from "./citizenSearchFunctions";
import { handleScreenConfigurationFieldChange as handleField } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import  {TypeOfServiceRequest} from "../../../../../ui-utils/commons"
import get from "lodash/get";


export const ServiceRequestFilterFormForEmployee = getCommonCard({


  serviceRequestidContactNoAndRequestTypeContainer: getCommonContainer({

    ServiceRequestId: {
      ...getTextField({
        label: {
          labelName: "Service Request No.",
          labelKey: "HC_SERVICE_REQUEST_ID"
        },
        placeholder: {
          labelName: "Enter Service Request No.",
          labelKey: "HC_SERVICE_REQUEST_ID_PLACEHOLDER"
        },
        gridDefination: {
          xs: 12,
          sm: 6,
          md: 4
        },
        
        pattern: getPattern("HCServiceRequestId"),
        errorMessage: "ERR_INVALID_SERVICE_REQUEST_ID_FIELD_MSG",
        jsonPath: "serviceRequests.servicerequestid"
      })
    },
    contactno: {
      ...getTextField({
        label: {
          labelName: "Owner Contact Number",
          labelKey: "HC_OWNER_CONTACT_NUMBER_LABEL"
        },
        placeholder: {
          labelName: "Enter Contact Number",
          labelKey: "HC_OWNER_CONTACT_NUMBER_LABLE_PLACEHOLDER"
        },
        gridDefination: {
          xs: 12,
          sm: 6,
          md: 4
        },
       type:"number",
        pattern: getPattern("HCMobileNoSearch"),
        errorMessage: "ERR_INVALID_CONTACT_NO_FIELD_MSG",
        jsonPath: "serviceRequests.contactNumber"
      })
    },
   
    ServiceRequestType: {
      uiFramework: "custom-containers-local",
      moduleName: "egov-hc",
      componentPath: "AutosuggestContainer",
      jsonPath: "serviceRequests.servicetype",
      required: false,
            gridDefination: {
              xs: 12,
              sm: 6,
              md: 4
            },
    props: {
    style: {
    width: "100%",
    cursor: "pointer"
    },
   
    className: "citizen-city-picker",
    label: { labelName: "Service Request Type", labelKey: "HC_SERVICE_REQUEST_TYPE" },
    placeholder: {
      labelName: "Select Service Request Type",
      labelKey: "HC_SERVICE_REQUEST_TYPE_PLACEHOLDER"
    },
    sourceJsonPath: "applyScreenMdmsData.eg-horticulture.ServiceType",
    jsonPath: "serviceRequests.servicetype",
   
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
    afterFieldChange: (action, state, dispatch) => {
      var currentSelectedServiceType = get(state, "screenConfiguration.preparedFinalObject.serviceRequests.servicetype")
      if (currentSelectedServiceType.value != undefined)
      {
        if(currentSelectedServiceType.value ===TypeOfServiceRequest.REMOVALOFDEADDRY )
        {
          dispatch(handleField("employeeServiceRequestsFilter",
          "components.div.children.ServiceRequestFilterFormForEmployee.children.cardContent.children.StatusLocalityAndFromToDateContainer.children.ServiceRequestSubtype",
          "props.buttons[0].disabled",
          false
        )
      );
      dispatch(handleField("employeeServiceRequestsFilter",
          "components.div.children.ServiceRequestFilterFormForEmployee.children.cardContent.children.StatusLocalityAndFromToDateContainer.children.ServiceRequestSubtype",
          "props.buttons[1].disabled",
          false
        )
      );
      dispatch(handleField("employeeServiceRequestsFilter",
          "components.div.children.ServiceRequestFilterFormForEmployee.children.cardContent.children.StatusLocalityAndFromToDateContainer.children.ServiceRequestSubtype",
          "props.buttons[2].disabled",
          false
        )
      );
     
    }
    else
        {
          dispatch(handleField("employeeServiceRequestsFilter",
          "components.div.children.ServiceRequestFilterFormForEmployee.children.cardContent.children.StatusLocalityAndFromToDateContainer.children.ServiceRequestSubtype",
          "props.buttons[0].disabled",
          true
        )
      );
      dispatch(handleField("employeeServiceRequestsFilter",
          "components.div.children.ServiceRequestFilterFormForEmployee.children.cardContent.children.StatusLocalityAndFromToDateContainer.children.ServiceRequestSubtype",
          "props.buttons[1].disabled",
          true
        )
      );
      dispatch(handleField("employeeServiceRequestsFilter",
          "components.div.children.ServiceRequestFilterFormForEmployee.children.cardContent.children.StatusLocalityAndFromToDateContainer.children.ServiceRequestSubtype",
          "props.buttons[2].disabled",
          true
        )
      );
      dispatch(handleField("employeeServiceRequestsFilter",
      "components.div.children.ServiceRequestFilterFormForEmployee.children.cardContent.children.StatusLocalityAndFromToDateContainer.children.ServiceRequestSubtype",
      "props.value",
      undefined
    )
  );
    
    
    
    }
    }
    }
  },
  
  }),
  StatusLocalityAndFromToDateContainer: getCommonContainer({
    ServiceRequestSubtype: {
      uiFramework: "custom-containers",
      componentPath: "RadioGroupContainer",
      gridDefination: {
        xs: 12,
        sm: 6,
        md: 4
      },
      jsonPath: "serviceRequests.serviceRequestSubtype",
       
      props: {
        label: {
          name: "Subtype",
          key: "HC_SERVICE_REQUEST_SUBTYPE"
        },
        buttons: [
       
          {
            labelName: "DEAD",
            labelKey: "HC_COMMON_SUBTYPE_DEAD",
            disabled: true,
            value: "DEAD"
          },
          {
            labelName: "DANGEROUS",
            labelKey: "HC_COMMON_SUBTYPE_DANGEROUS",
            disabled: true,
            value: "DANGEROUS"
          },
          {
            labelName: "DRY",
            labelKey: "HC_COMMON_SUBTYPE_DRY",
            disabled: true,
            value: "DRY"
          }
        ],
        jsonPath:"serviceRequests.serviceRequestSubtype",
        required: false
      },
      required: false,
      type: "array",
      
    },
    fromDate: getDateField({
      label: { labelName: "From Date", labelKey: "HC_FROM_DATE_LABEL" },
      placeholder: {
        labelName: "FromDate",
        labelKey: "HC_FROM_DATE_PLACEHOLDER"
      },
      gridDefination: {
        xs: 12,
        sm: 6,
        md: 4
      },
      pattern: getPattern("Date"),
      

      jsonPath: "serviceRequests.fromDate",
      afterFieldChange: (action, state, dispatch) => {
        dispatch(
          handleField(
            "employeeServiceRequestsFilter",
            "components.div.children.ServiceRequestFilterFormForEmployee.children.cardContent.children.StatusLocalityAndFromToDateContainer.children.toDate",
            "props.inputProps.min",
            action.value
          )
        );
        }


    }),
    toDate: getDateField({
      label: { labelName: "To Date", labelKey: "HC_TO_DATE_LABEL" },
      placeholder: {
        labelName: "To Date",
        labelKey: "HC_TO_DATE_PLACEHOLDER"
      },
      props: {
        inputProps: {
          min: ''
        }
      },
      gridDefination: {
        xs: 12,
        sm: 6,
        md: 4
      },
      pattern: getPattern("Date"),
      jsonPath: "serviceRequests.toDate",
    }),
    // ServiceRequestStatus: getSelectField({
    //   label: { labelName: "Service Request Status", labelKey: "HC_SERVICE_REQUEST_STATUS" },
    //   optionLabel: "name",
    //   optionValue: "name",
      // placeholder: {
      //   labelName: "Service Request Status",
      //   labelKey: "HC_SERVICE_REQUEST_STATUS_PLACEHOLDER"
      // },
      
      // gridDefination: {
      //   xs: 12,
      //   sm: 6,
      //   md: 4
      // },
    //   jsonPath: "serviceRequests.servicestatus",
    //   sourceJsonPath: "applyScreenMdmsData.eg-horticulture.ServiceStatus",
      
    // }),
    ServiceRequestStatus: {
      uiFramework: "custom-containers-local",
      moduleName: "egov-hc",
      componentPath: "AutosuggestContainer",
      jsonPath: "serviceRequests.servicestatus",
            required: false,
            gridDefination: {
              xs: 12,
              sm: 6,
              md: 4
            },
    props: {
    style: {
    width: "100%",
    cursor: "pointer"
    },
   
    className: "citizen-city-picker",
    label: { labelName: "Service Request Status", labelKey: "HC_SERVICE_REQUEST_STATUS" },
    
    placeholder: {
      labelName: "Service Request Status",
      labelKey: "HC_SERVICE_REQUEST_STATUS_PLACEHOLDER"
    },
    sourceJsonPath: "applyScreenMdmsData.eg-horticulture.ServiceStatus",
    jsonPath: "serviceRequests.servicestatus",
   
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
    // locality: {
    //   ...getSelectField({
    //     label: {
    //       labelName: "Locality/Mohalla",
    //       labelKey: "HC_LOCALITY_MOHALLA_LABEL"
    //     },
    //     optionLabel: "name",
    //     optionValue: "name",
    //     placeholder: {
    //       labelName: "Locality/Mohalla",
    //       labelKey: "HC_CHOOSE_LOCALITY_MOHALLA_LABEL_PLACEHOLDER"
    //     },
    //     gridDefination: {
    //       xs: 12,
    //       sm: 6,
    //       md: 4
    //     },
    //     sourceJsonPath: "applyScreenMdmsData.RAINMAKER-PGR.Sector",
    //     jsonPath: "serviceRequests.mohalla",
    //     errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
        
    //     props: {
    //       className: "applicant-details-error",
          
          
    //     },

    //   }),



    // },
    locality: {
      uiFramework: "custom-containers-local",
      moduleName: "egov-hc",
      componentPath: "AutosuggestContainer",
      jsonPath: "serviceRequests.mohalla",
            required: false,
            gridDefination: {
              xs: 12,
              sm: 6,
              md: 4
            },
    props: {
    style: {
    width: "100%",
    cursor: "pointer"
    },
   
    className: "citizen-city-picker",
    label: {
      labelName: "Locality/Mohalla",
      labelKey: "HC_LOCALITY_MOHALLA_LABEL"
    },
    placeholder: {
      labelName: "Locality/Mohalla",
      labelKey: "HC_CHOOSE_LOCALITY_MOHALLA_LABEL_PLACEHOLDER"
    },
    sourceJsonPath: "applyScreenMdmsData.RAINMAKER-PGR.Sector",
    jsonPath: "serviceRequests.mohalla",
   
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
  }
  }),
  button: getCommonContainer({
    buttonContainer: getCommonContainer({
      searchButton: {
        componentPath: "Button",
        gridDefination: {
          xs: 12,
          sm: 4,
          md: 4
        },
        props: {
          variant: "contained",
          style: {
            color: "white",
            backgroundColor: "rgba(0, 0, 0, 0.6000000238418579)",
            borderRadius: "2px",
            // minWidth: "220px",
            width: "80%",
            height: "48px",
            marginBottom: "8px"
          }
        },
        children: {
          buttonLabel: getLabel({
            labelName: "Search",
            labelKey: "HC_HOME_SEARCH_RESULTS_BUTTON"
          })
        },
        onClickDefination: {
          action: "condition",
          callBack: (state, dispatch) => {
            searchApiCallForEmployeeFilter(state, dispatch)
          }
        }
      },
      resetButton: {
        componentPath: "Button",
        gridDefination: {
          xs: 12,
          sm: 4,
          md: 4
          // align: "center"
        },
        props: {
          variant: "outlined",
          style: {
            color: "#FE7A51",
            // backgroundColor: "#FE7A51",
            border: "#FE7A51 solid 1px",
            borderRadius: "2px",
            // width: window.innerWidth > 480 ? "80%" : "100%",
             // minWidth: "220px",
             width: "80%",
            height: "48px",
            marginBottom: "8px"
          }
        },
        children: {
          buttonLabel: getLabel({
            labelName: "CLEAR ALL",
            labelKey: "HC_CLEARFORM_BUTTON"
          })
        },
        onClickDefination: {
          action: "condition",
          callBack: resetFieldsForEmployeeFilter
        }
      },
      
      // lastCont: {
      //   uiFramework: "custom-atoms",
      //   componentPath: "Div",
      //   gridDefination: {
      //     xs: 12,
      //     sm: 4
      //   }
      // }
    })
  })

});














