import { getCommonCard, getCommonContainer, getDateField, getLabel, getPattern, getSelectField, getTextField } from "egov-ui-framework/ui-config/screens/specs/utils";
import { searchAPICall } from "./functions";
import { resetConstraintsFields, resetFields } from "./citizenSearchFunctions";
import { handleScreenConfigurationFieldChange as handleField } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import  {TypeOfServiceRequest} from "../../../../../ui-utils/commons"
import get from "lodash/get";


export const FilterFormforEmployee = getCommonCard({

  FilterConstraintsContainer: getCommonContainer({
    moduleDashboardDropdown: {
      uiFramework: "custom-containers-local",
      moduleName: "egov-dashboard",
      componentPath: "AutosuggestContainer",
      jsonPath: "dahsboardHome.dropDownData2",
      // required: true,
      gridDefination: {
              xs: 12,
              sm: 12,
              md: 12,
              lg:12
            },
      props: {
        style: {
        width: "100%",
        cursor: "pointer"
      },
  
      className: "citizen-city-picker",
      label: { labelName: "", labelKey: "Module" },
      placeholder: {
        labelName: "",
        labelKey: "Select Module"
      },
      sourceJsonPath: "dahsboardHome.dropDownData",
      jsonPath: "dahsboardHome.dropDownData2",
      maxLength:5,
      labelsFromLocalisation: false,
      suggestions: [],
      fullwidth: true,
      // required: true,
      inputLabelProps: {
        shrink: true
      },
      isMulti: false,
      labelName: "name",
      valueName: "name"
      },
    
    },
    reportDashboardDropdown: {
      uiFramework: "custom-containers-local",
      moduleName: "egov-dashboard",
      componentPath: "AutosuggestContainer",
      jsonPath: "dahsboardHome.reportdefaultDropDownData",
      // required: true,
      gridDefination: {
              xs: 12,
              sm: 12,
              md: 12,
              lg:12
            },
      props: {
        style: {
        width: "100%",
        cursor: "pointer"
      },
  
      className: "citizen-city-picker",
      label: { labelName: "", labelKey: "Reports" },
      placeholder: {
        labelName: "",
        labelKey: "Select Reports"
      },
      sourceJsonPath: "dahsboardHome.reportDropDownData",
      jsonPath: "dahsboardHome.reportdefaultDropDownData",
      maxLength:5,
      labelsFromLocalisation: false,
      suggestions: [],
      fullwidth: true,
      // required: true,
      inputLabelProps: {
        shrink: true
      },
      isMulti: false,
      labelName: "name",
      valueName: "name"
      },
    
    },
    fromDate: getDateField({
      label: { labelName: "From Date", labelKey: "From Date" },
      placeholder: {
        labelName: "",
        labelKey: "Select From Date"
      },
      gridDefination: {
        xs: 12,
        sm: 6,
        md: 4
      },
      pattern: getPattern("Date"),
      jsonPath: "dahsboardHome.defaultFromDate",
      afterFieldChange: (action, state, dispatch) => {
        dispatch(
          handleField(
            "dashboardType",
            "components.div.children.FilterFormforEmployee.children.cardContent.children.FilterConstraintsContainer.children.toDate",
            "props.inputProps.min",
            action.value
          )
        );
        }
    }),
    toDate: getDateField({
      label: { labelName: "To Date", labelKey: "To Date" },
      placeholder: {
        labelName: "To Date",
        labelKey: "Select To Date"
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
      jsonPath: "dahsboardHome.defaulttoDate"
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
            searchAPICall(state, dispatch)
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
          callBack: resetFields
        }
      },
    })
  })

});