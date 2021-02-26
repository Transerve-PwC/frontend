import { getCommonCard, getCommonContainer, getDateField, getLabel, getPattern,} from "egov-ui-framework/ui-config/screens/specs/utils";
import { searchAPICall, SearchDashboardData, SearchPGRDashboardData } from "./functions";
import { dashboard1ResetFields, pgrDashboard1ResetFields } from "./functions";
import { handleScreenConfigurationFieldChange as handleField } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import './index.css';

export const FilterFormforEmployee = getCommonCard({
  FilterConstraintsContainer: getCommonContainer({
    fromDate: getDateField({
      label: { labelName: "From Date", labelKey: "DASHBOARD_FROM_DATE" },
      // placeholder: {
      //   labelName: "Select From Date",
      //   labelKey: ""
      // },
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
      label: { labelName: "To Date", labelKey: "DASHBOARD_TO_DATE" },
      // placeholder: {
      //   labelName: "To Date",
      //   labelKey: "Select To Date"
      // },
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
            labelName: "Search",
            labelKey: "DASHBOARD_SEARCH_BTN_LABEL"
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
            labelName: "Reset",
            labelKey: "DASHBOARD_RESET_BTN_LABEL"
          })
        },
        onClickDefination: {
          action: "condition",
          callBack: dashboard1ResetFields
        }
      },
    })
  })
});

export const FilterFormDashboard = getCommonCard({
  FilterConstraintsContainer: getCommonContainer({
    fromDate: getDateField({
      label: { labelName: "From Date", labelKey: "DASHBOARD_FROM_DATE_LABEL" },
      placeholder: {
        labelName: "",
        labelKey: "Select From Date"
      },
      gridDefination: {
        xs: 6,
        sm: 2,
        md: 2
      },
      pattern: getPattern("Date"),
      jsonPath: "dahsboardHome.defaultFromDate",
      required: true,
      afterFieldChange: (action, state, dispatch) => {
        dispatch(
          handleField(
            "dashboardSource",
            "components.div.children.FilterFormforEmployee.children.cardContent.children.FilterConstraintsContainer.children.toDate",
            "props.inputProps.min",
            action.value
          )
        );
        }
    }),
    toDate: getDateField({
      label: { labelName: "To Date", labelKey: "DASHBOARD_TO_DATE_LABEL" },
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
        xs: 6,
        sm: 2,
        md: 2
      },
      pattern: getPattern("Date"),
      jsonPath: "dahsboardHome.defaulttoDate",
      required: true,
    }),
    moduleDashboardDropdown: {
      uiFramework: "custom-containers-local",
      moduleName: "egov-dashboard",
      componentPath: "AutosuggestContainer",
      jsonPath: "dahsboardHome.dropDownData2",
      required: true,
      gridDefination: {
            xs: 6,
            sm: 2,
            md: 2
          },
      props: {
        style: {
        width: "100%",
        cursor: "pointer"
      },
  
      className: "citizen-city-picker",
      label: { labelName: "Report Type", labelKey: "DASHBOARD_DROPDOWN_REPORT_TYPE_LABEL" },
      placeholder: {
        labelName: "",
        labelKey: "Select Module"
      },
      sourceJsonPath: "dahsboardHome.dropDownData",
      jsonPath: "dahsboardHome.dropDownData2",
      maxLength:5,
      labelsFromLocalisation: false,
      suggestions: [],
      // fullwidth: true,
      // required: true,
      inputLabelProps: {
        shrink: true
      },
      isMulti: false,
      labelName: "name",
      valueName: "name"
      },
    
    },
    searchButton: {
      componentPath: "Button",
      gridDefination: {
        xs: 6,
        sm: 2,
        md: 2
      },
      props: {
        variant: "contained",
        color: "primary",
        style: {
        width: "60%",
        height: "55px",
        }
      },
      children: {
        buttonLabel: getLabel({
          labelName: "Search",
          labelKey: "DASHBOARD_SEARCH_BTN_LABEL"
        })
      },
      onClickDefination: {
        action: "condition",
        callBack: (state, dispatch) => {
          SearchPGRDashboardData(state, dispatch)
        }
      }
    },
    // resetButton: {
    //   componentPath: "Button",
    //   gridDefination: {
    //     xs: 6,
    //     sm: 2,
    //     md: 2
    //     // align: "center"
    //   },
    //   props: {
    //     variant: "outlined",
    //     style: {
    //       color: "rgb(254, 122, 81)",
    //       width: "50%",
    //       height: "55px",
    //       marginLeft: "50px"
    //     }
    //   },
    //   children: {
    //     buttonLabel: getLabel({
    //       labelName: "Reset",
    //       labelKey: "DASHBOARD_RESET_BTN_LABEL"
    //     })
    //   },
    //   onClickDefination: {
    //     action: "condition",
    //     callBack: pgrDashboard1ResetFields
    //   }
    // },
  })
});