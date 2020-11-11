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
  const textFields = ["applicationId","applicationStatus","fromDate","toDate"];
  for (let i = 0; i < textFields.length; i++) {
    if (
      `state.screenConfiguration.screenConfig.search-smid.searchForm.children.cardContent.children.searchFormContainer.children.${textFields[i]}.props.value`
    ) {
      dispatch(
        handleField(
          "search-smid",
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
    applicationId: {
      ...getTextField({
        label: {
          labelName: "Application Id",
          labelKey: "NULM_SEP_APPLICATION_ID"
        },
        placeholder: {
          labelName: "Enter Application Id",
          labelKey: "NULM_SEP_APPLICATION_ID_PLACEHOLDER"
        },
      //  pattern: getPattern("Amount"),
        gridDefination: {
          xs: 12,
          sm: 4,
        },
        jsonPath: "searchScreen.applicationId"
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
    applicationStatus: getSelectField({
      label: { labelName: "Application Status", labelKey: "NULM_SEP_APPLICATION_STATUS" },
      placeholder: {
        labelName: "Select Application Status",
        labelKey: "NULM_SEP_APPLICATION_STATUS_SELECT",
      },
      jsonPath: "searchScreen.applicationStatus",
      gridDefination: {
        xs: 12,
        sm: 4,
      },
    //  sourceJsonPath: "searchScreenMdmsData.store-asset.MaterialType",
      props: {
        optionValue: "value",
        optionLabel: "label",
        style : {
          display: process.env.REACT_APP_NAME === "Employee" ? "none" : "",
        },
        data: [
          {
            value: "Created",
            label: "Created"
          },
          {
            value: "Drafted",
            label: "Drafted"
          }
        ],
      },
    }),
  }),

  button: getCommonContainer({
    buttonContainer: getCommonContainer({
      resetButton: {
        componentPath: "Button",
        gridDefination: {
          xs: 12,
          sm: 6,
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
            float: "right",
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
          sm: 6,
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
