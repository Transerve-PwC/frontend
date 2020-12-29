import { getCommonCard, getCommonContainer, getCommonHeader, getDateField, getLabel, getPattern, getSelectField, getTextField } from "egov-ui-framework/ui-config/screens/specs/utils";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getTenantId } from "egov-ui-kit/utils/localStorageUtils";
import { httpRequest } from "../../../../ui-utils";
import "./index.css";
import get from "lodash/get";
import { TypeOfServiceRequest } from "../../../../ui-utils/commons";
import { fetchData, fetchDataForFilterFields, resetFields } from "./searchResource/citizenSearchFunctions";

import { handleScreenConfigurationFieldChange as handleField } from "egov-ui-framework/ui-redux/screen-configuration/actions";


const header = getCommonHeader(
  {
    labelName: "My Service Request",
    labelKey: "HC_MY_SERVICE_REQUEST_HEADER"
  },
  {
    style : {
      padding: 0
    }
  },
  {
    classes: {
      root: "common-header-cont"
    }
  }
);



// setapplicationType("SERVICEREQUEST");
export const FieldsForFilterForm = getCommonCard({

  masterContainer: getCommonContainer({
    ServiceRequestId: {
      ...getTextField({
        label: {
          labelName: "Service Request ID",
          labelKey: "HC_SERVICE_REQUEST_ID"
        },
        placeholder: {
          labelName: "Enter Service Request ID",
          labelKey: "HC_SERVICE_REQUEST_ID_PLACEHOLDER"
        },
        gridDefination: {
          xs: 12,
          sm: 4,
          md: 4
        },

        //  required:true,
        pattern: getPattern("HCServiceRequestId"),
        errorMessage: "ERR_INVALID_SERVICE_REQUEST_ID_FIELD_MSG",
        jsonPath: "myServiceRequests[0].servicerequestid"
      })
    },
    FromDate: getDateField({
      label: { labelName: "From Date", labelKey: "HC_FROM_DATE_LABEL" },
      placeholder: {
        labelName: "Select From Date",
        labelKey: "HC_FROM_DATE_PLACEHOLDER"
      },
      gridDefination: {
        xs: 12,
        sm: 4,
        md: 4
      },
      pattern: getPattern("Date"),


      jsonPath: "myServiceRequests[0].FromDate",
      sourceJsonPath: "myServiceRequests[0].FromDate",
      afterFieldChange: (action, state, dispatch) => {
        dispatch(
          handleField(
            "myServiceRequests",
            "components.div.children.form.children.cardContent.children.masterContainer.children.ToDate",
            "props.inputProps.min",
            action.value
          )
        );
                }


    }),

    ToDate: getDateField({
      label: { labelName: "To Date", labelKey: "HC_TO_DATE_LABEL" },
      placeholder: {
        labelName: "Select To Date",
        labelKey: "HC_TO_DATE_PLACEHOLDER"
      },
      gridDefination: {
        xs: 12,
        sm: 4,
        md: 4
      },
      pattern: getPattern("Date"),
      props: {
        inputProps: {
          min: ''
        }
      },

      jsonPath: "myServiceRequests[0].ToDate",
      sourceJsonPath: "myServiceRequests[0].ToDate",



    }),
    
    ServiceRequestType:{
      uiFramework: "custom-containers-local",
      moduleName: "egov-hc",
      componentPath: "AutosuggestContainer",
      jsonPath: "myServiceRequests[0].servicetype",
      required: false,
            gridDefination: {
              xs: 12,
              sm: 4,
              md: 4
            },
    props: {
    style: {
    width: "100%",
    cursor: "pointer"
    },
   
    className: "citizen-city-picker",
    
    label: { labelName: "Service Request Type", labelKey: "HC_SERVICE_REQUEST_TYPE_LABEL" },

    placeholder: {
      labelName: "Select Service Request Type",
      labelKey: "HC_SERVICE_REQUEST_TYPE_PLACEHOLDER"
    },
    jsonPath: "myServiceRequests[0].servicetype",
      sourceJsonPath: "applyScreenMdmsData.eg-horticulture.ServiceType",
   
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
      var currentSelectedServiceType = get(state, "screenConfiguration.preparedFinalObject.myServiceRequests[0].servicetype")
      if (currentSelectedServiceType.value != undefined)
      {
        if(currentSelectedServiceType.value ===TypeOfServiceRequest.REMOVALOFDEADDRY )
        {
          dispatch(handleField("myServiceRequests",
          "components.div.children.form.children.cardContent.children.masterContainer.children.ServiceRequestSubtype",
          "props.buttons[0].disabled",
          false
        )
      );
      dispatch(handleField("myServiceRequests",
          "components.div.children.form.children.cardContent.children.masterContainer.children.ServiceRequestSubtype",
          "props.buttons[1].disabled",
          false
        )
      );
      dispatch(handleField("myServiceRequests",
          "components.div.children.form.children.cardContent.children.masterContainer.children.ServiceRequestSubtype",
          "props.buttons[2].disabled",
          false
        )
      );
     
    }
    else
        {
          dispatch(handleField("myServiceRequests",
          "components.div.children.form.children.cardContent.children.masterContainer.children.ServiceRequestSubtype",
          "props.buttons[0].disabled",
          true
        )
      );
      dispatch(handleField("myServiceRequests",
          "components.div.children.form.children.cardContent.children.masterContainer.children.ServiceRequestSubtype",
          "props.buttons[1].disabled",
          true
        )
      );
      dispatch(handleField("myServiceRequests",
          "components.div.children.form.children.cardContent.children.masterContainer.children.ServiceRequestSubtype",
          "props.buttons[2].disabled",
          true
        )
      );
      dispatch(handleField("myServiceRequests",
      "components.div.children.form.children.cardContent.children.masterContainer.children.ServiceRequestSubtype",
      "props.value",
      undefined
    )
  );
    
    
    
    }
    }
    }
  },
  ServiceRequestSubtype: {
    uiFramework: "custom-containers",
    componentPath: "RadioGroupContainer",
    gridDefination: {
      xs: 12,
      sm: 12,
      md: 6
    },
    jsonPath: "myServiceRequests[0].serviceRequestSubtype",
     
    props: {
      label: {
        name: "Subtype",
        key: "HC_SERVICE_REQUEST_SUBTYPE"
      },
      buttons: [
       
        {
          labelName: "Dead and Dry Trees",
          labelKey: "HC_COMMON_SUBTYPE_DEAD_AND_DRY",
          disabled: true,
          value: "Dead and Dry Trees"
        },
        {
          labelName: "DANGEROUS",
          labelKey: "HC_COMMON_SUBTYPE_DANGEROUS",
          disabled: true,
          value: "DANGEROUS"
        },
        {
          labelName: "Pollarding of Trees",
          labelKey: "HC_COMMON_SUBTYPE_POLLARDINGOFTREES",
          disabled: true,
          value: "Pollarding of Trees"
        }
      ],
      jsonPath:"myServiceRequests[0].serviceRequestSubtype",
      required: false
    },
    required: false,
    type: "array",
    
  },
  }),


  button: getCommonContainer({
    buttonContainer: getCommonContainer({
      firstCont: {
        uiFramework: "custom-atoms",
        componentPath: "Div",
        // gridDefination: {
        //   xs: 12,
        //   sm: 4
        // }
      },
      searchButton: {
        componentPath: "Button",
        gridDefination: {
          xs: 12,
          sm: 4,
          md: 4,
          // align: "center"
        },
        props: {
          variant: "contained",
          style: {
            color: "white",
            // margin: "8px",
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
            labelName: "Apply",
            labelKey: "HC_APPLY_BUTTON"
          })
        },
        onClickDefination: {
          action: "condition",
          callBack: (state, dispatch) => {
            fetchDataForFilterFields(state, dispatch);
            // set("")
          }


        }
      },
      resetButton: {
        componentPath: "Button",
        gridDefination: {
          xs: 12,
          sm: 4,
          md:4 
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
          callBack: resetFields
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
//useful

const getMdmsData = async (dispatch) => {

  let tenantId = getTenantId().split(".")[0];
  let mdmsBody = {
    MdmsCriteria: {
      tenantId: tenantId,
      moduleDetails: [
        {
          moduleName: "tenant",
          masterDetails: [
            {
              name: "tenants"
            }
          ]
        },
        {
          moduleName: "eg-horticulture",
          masterDetails: [
            {
              name: "ServiceType"
            }
          ]
        },
        {
          moduleName: "RAINMAKER-PGR",
          masterDetails: [
            {
              name: "Sector"
            }
          ]
        }
      ]
    }
  };
  try {
    // debugger
    let payload = null;
    payload = await httpRequest(
      "post",
      "/egov-mdms-service/v1/_search",
      "_search",
      [],
      mdmsBody
    );
    // debugger
    dispatch(prepareFinalObject("applyScreenMdmsData", payload.MdmsRes));
  } catch (e) {
    console.log(e);
  }
};
const screenConfig = {
  uiFramework: "material-ui",
  name: "myServiceRequests",
  beforeInitScreen: (action, state, dispatch) => {
    resetFields(state, dispatch)
    // resetFieldsForEmployeeFilter(state, dispatch);

    getMdmsData(dispatch).then(response => {
    })
    fetchData(action, state, dispatch);
    return action;
  },

  components: {
    div: {
      uiFramework: "custom-atoms",
      componentPath: "Div",
      props: {
        className: "common-div-css",
        id: "myServiceRequests"
      },
      children: {
        // header: header,
        headerDiv: {
          uiFramework: "custom-atoms",
          componentPath: "Container",

          children: {
            header: {
              // gridDefination: {
              //   xs: 12,
              //   sm: 6
              // },
              ...header
            },
            
          }
        },
        form: FieldsForFilterForm,
        applicationsCard: {
          uiFramework: "custom-molecules",
          componentPath: "SingleApplication",
          visible: true,
          props: {
            contents: [
              {
                label: "HC_COMMON_TABLE_COL_SERVICE_TYPE_LABEL",
                // label: { labelName: "Type of Service Request", labelKey: "HC_COMMON_TABLE_COL_SERVICE_TYPE_LABEL" },
                jsonPath: "service_type"
              },
              {
                label: "HC_COMMON_TABLE_COL_OWNER_NAME_LABEL",
                // label: { labelName: "Owner Name", labelKey: "HC_COMMON_TABLE_COL_OWNER_NAME_LABEL" },
                jsonPath: "owner_name"
              },
              {
                label: "HC_COMMON_TABLE_COL_SERVICE_REQUEST_DATE_LABEL",
                // label: { labelName: "Type of Service Request", labelKey: "HC_COMMON_TABLE_COL_SERVICE_TYPE_LABEL" },
                jsonPath: "createdtime"
              },
              {
                label: "HC_COMMON_TABLE_COL_SERVICE_REQUEST_ID_LABEL",
                // label: { labelName: "Service Request ID", labelKey: "HC_COMMON_TABLE_COL_SERVICE_REQUEST_ID_LABEL" },
                jsonPath: "service_request_id"
              },
              {
                label: "HC_COMMON_TABLE_COL_SERVICE_REQUEST_STATUS_LABEL",
                // label: { labelName: "Service Request Status", labelKey: "HC_COMMON_TABLE_COL_SERVICE_REQUEST_STATUS_LABEL" },
                jsonPath: "service_request_status",
                prefix: "HC_SERVICE_REQUEST_STATUS_"
              }
            ],
            moduleName: "HC",
            homeURL: "/egov-hc/servicerequest"
          }
        }
      }
    }
  }
};

export default screenConfig;