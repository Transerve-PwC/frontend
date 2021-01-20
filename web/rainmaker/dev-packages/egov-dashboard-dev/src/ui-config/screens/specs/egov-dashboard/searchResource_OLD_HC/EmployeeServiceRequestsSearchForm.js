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
          color: "primary",
          style: {
            minWidth: "200px",
            height: "48px",
            marginRight: "45px"
          }
        },
        children: {
          buttonLabel: getLabel({
            labelName: "",
            labelKey: "Search"
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
            border: "#FE7A51 solid 1px",
            borderRadius: "2px",
             width: "80%",
            height: "48px",
            marginBottom: "8px"
          }
        },
        children: {
          buttonLabel: getLabel({
            labelName: "",
            labelKey: "Reset"
          })
        },
        onClickDefination: {
          action: "condition",
          callBack: resetFieldsForEmployeeFilter
        }
      },
    })
  })

});














