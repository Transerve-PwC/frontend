import {
  getCommonCard,
  getCommonContainer,
  getCommonParagraph,
  getCommonTitle,
  getLabel,
  getPattern,
  getSelectField,
  getTextField,
  getDateField,
} from "egov-ui-framework/ui-config/screens/specs/utils";
import {
  handleScreenConfigurationFieldChange as handleField,
  prepareFinalObject,
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { searchApiCall } from "./functions";

const resetFields = (state, dispatch) => {
  const textFields = ["name","nameOfShelter","fromDate","toDate"];
  for (let i = 0; i < textFields.length; i++) {
    if (
      `state.screenConfiguration.screenConfig.search-log-maintenance.searchForm.children.cardContent.children.searchFormContainer.children.${textFields[i]}.props.value`
    ) {
      dispatch(
        handleField(
          "search-log-maintenance",
          `components.div.children.searchForm.children.cardContent.children.searchFormContainer.children.${textFields[i]}`,
          "props.value",
          ""
        )
      );
    }
  }
  dispatch(prepareFinalObject("searchScreen", {}));
};

export const searchForm = getCommonCard({
  subHeader: getCommonTitle({
    labelName: "Search Criteria",
    labelKey: "STORE_SEARCH_RESULTS_HEADING",
  }),
  subParagraph: getCommonParagraph({
    labelName: "Provide at least one parameter to search for an application",
    labelKey: "STORE_HOME_SEARCH_RESULTS_DESC",
  }),
  searchFormContainer: getCommonContainer({
    nameOfShelter: {
      ...getTextField({
        label: {
          labelName: "Name of shelter",
          labelKey: "NULM_SUH_OF_SHELTER"
        },
        placeholder: {
          labelName: "Enter Name of shelter",
          labelKey: "NULM_SUH_NAME_OF_SHELTER_PLACEHOLDER"
        },
      //  pattern: getPattern("Amount"),
        gridDefination: {
          xs: 12,
          sm: 4,
        },
        jsonPath: "searchScreen.nameOfShelter"
      })
    },
    name: {
      ...getTextField({
        label: {
          labelName: "Name",
          labelKey: "NULM_SUH_LOG_NAME"
        },
        placeholder: {
          labelName: "Enter Name",
          labelKey: "NULM_SUH_LOG_NAME_PLACEHOLDER"
        },
      //  pattern: getPattern("Amount"),
        gridDefination: {
          xs: 12,
          sm: 4,
        },
        jsonPath: "searchScreen.name"
      })
    },
    fromDate: {
      ...getDateField({
        label: {
          labelName: "From date",
          labelKey: "NULM_SEP_FROM_DATE"
        },
        placeholder: {
          labelName: "From date",
          labelKey: "NULM_SEP_FROM_DATE"
        },
        pattern: getPattern("Date") || null,
        jsonPath: "searchScreen.fromDate",
        gridDefination: {
          xs: 12,
          sm: 4,
        },
        props: {
          inputProps: {
           // max: getTodaysDateInYMD()
          }
        }
      })
    },
    toDate: {
      ...getDateField({
        label: {
          labelName: "To date",
          labelKey: "NULM_SEP_TO_DATE"
        },
        placeholder: {
          labelName: "To date",
          labelKey: "NULM_SEP_TO_DATE"
        },
        pattern: getPattern("Date") || null,
        jsonPath: "searchScreen.toDate",
         gridDefination: {
          xs: 12,
          sm: 4,
        },
        props: {
          inputProps: {
         //   max: getTodaysDateInYMD()
          }
        }
      })
    },
  
  }),

  button: getCommonContainer({
    buttonContainer: getCommonContainer({
      resetButton: {
        componentPath: "Button",
        gridDefination: {
          xs: 12,
          sm: 4,
          // align: "center"
        },
        props: {
          variant: "outlined",
          style: {
            color: "#FE7A51",
            borderColor: "#FE7A51",
            //   borderRadius: "2px",
            width: "220px",
            height: "48px",
            margin: "8px",
            float: "center",
          },
        },
        children: {
          buttonLabel: getLabel({
            labelName: "Reset",
            labelKey: "STORE_COMMON_RESET_BUTTON",
          }),
        },
        onClickDefination: {
          action: "condition",
          callBack: resetFields,
        },
      },
      searchButton: {
        componentPath: "Button",
        gridDefination: {
          xs: 12,
          sm: 4,
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
            height: "48px",
            float: "center",
            textalign:"center",
          },
        },
        children: {
          buttonLabel: getLabel({
            labelName: "Search",
            labelKey: "STORE_COMMON_SEARCH_BUTTON",
          }),
        },
        onClickDefination: {
          action: "condition",
          callBack: searchApiCall,
        },
      },
    }),
  }),
});
