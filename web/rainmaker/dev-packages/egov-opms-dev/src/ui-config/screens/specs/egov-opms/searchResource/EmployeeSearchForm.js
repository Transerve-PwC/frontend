import { getCommonCard, getCommonContainer, getDateField, getLabel, getPattern, getSelectField, getTextField } from "egov-ui-framework/ui-config/screens/specs/utils";
import { searchApiCallForEmployeeFilter } from "./searchFunctions";
import { resetFieldsForEmployeeFilter } from "./citizenSearchFunctions";
import { handleScreenConfigurationFieldChange as handleField } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getapplicationType } from "egov-ui-kit/utils/localStorageUtils";



export const SearchFormForEmployee = getCommonCard({
  StatusLocalityAndFromToDateContainer: getCommonContainer({
    ServiceRequestId: {
      ...getTextField({
        label: {
          labelName: "Application  No.",
          labelKey: "PM_APPLICATION_ID"
        },
        placeholder: {
          labelName: "Enter Application No.",
          labelKey: "PM_APPLICATION_ID_PLACEHOLDER"
        },
        gridDefination: {
          xs: 12,
          sm: 6,
          md: 4
        },
        pattern: getPattern("BuildingStreet"),
        errorMessage: "PM_ERR_INVALID_APPLICATION_ID_FIELD_MSG",
        jsonPath: "OPMS.searchFilter.applicationId"
      })
    },
    fromDate: getDateField({
      label: { labelName: "From Date", labelKey: "PM_FROM_DATE_LABEL" },
      placeholder: {
        labelName: "FromDate",
        labelKey: "PM_FROM_DATE_PLACEHOLDER"
      },
      gridDefination: {
        xs: 12,
        sm: 6,
        md: 4
      },
      pattern: getPattern("Date"),
      jsonPath: "OPMS.searchFilter.fromDate",
      afterFieldChange: (action, state, dispatch) => {
        dispatch(
          handleField(
            getPageName(),
            "components.div.children.SearchFormForEmployee.children.cardContent.children.StatusLocalityAndFromToDateContainer.children.toDate",
            "props.inputProps.min",
            action.value
          )
        );
      }


    }),
    toDate: getDateField({
      label: { labelName: "To Date", labelKey: "PM_TO_DATE_LABEL" },
      placeholder: {
        labelName: "To Date",
        labelKey: "PM_TO_DATE_PLACEHOLDER"
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
      jsonPath: "OPMS.searchFilter.toDate",
    }),
    ServiceRequestStatus: {
      uiFramework: "custom-containers-local",
      moduleName: "egov-opms",
      componentPath: "AutosuggestContainer",
      jsonPath: "OPMS.searchFilter.applicationStatus",

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
        label: { labelName: "Application Status", labelKey: "PM_APPLICATION_STATUS" },

        placeholder: {
          labelName: "Application Status",
          labelKey: "PM_APPLICATION_STATUS_PLACEHOLDER"
        },
        sourceJsonPath: "applyScreenMdmsData.searchScreen.status",
        jsonPath: "OPMS.searchFilter.applicationStatus",

        labelsFromLocalisation: false,
        suggestions: [],
        fullwidth: true,
        required: false,
        inputLabelProps: {
          shrink: true
        },
        isMulti: false,
        labelName: "name",
        valueName: "code"
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
            height: "48px"
          }
        },
        children: {
          buttonLabel: getLabel({
            labelName: "Search",
            labelKey: "PM_HOME_SEARCH_RESULTS_BUTTON"
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
            height: "48px"
          }
        },
        children: {
          buttonLabel: getLabel({
            labelName: "CLEAR ALL",
            labelKey: "PM_CLEARFORM_BUTTON"
          })
        },
        onClickDefination: {
          action: "condition",
          callBack: (state, dispatch) => {
            resetFieldsForEmployeeFilter(state, dispatch)
          }
        }
      }
    })
  })

});

export const getPageName = () => {
  switch (getapplicationType()) {
    case "PETNOC": return "search";
    case "SELLMEATNOC": return "sellmeat-search";
    case "ROADCUTNOC": return "roadcut-search";
    case "ADVERTISEMENTNOC": return "advertisement-search";
  }

}














