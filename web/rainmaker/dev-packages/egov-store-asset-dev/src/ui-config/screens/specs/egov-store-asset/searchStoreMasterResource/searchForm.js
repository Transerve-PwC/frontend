import {
  getCommonCard,
  getCommonContainer,
  getCommonParagraph,
  getCommonTitle,
  getLabel,
  getPattern,
  getSelectField,
  getTextField,
} from "egov-ui-framework/ui-config/screens/specs/utils";
import {
  handleScreenConfigurationFieldChange as handleField,
  prepareFinalObject,
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { searchApiCall } from "./functions";

const resetFields = (state, dispatch) => {
  const textFields = ["name", "department", "active"];
  for (let i = 0; i < textFields.length; i++) {
    if (
      `state.screenConfiguration.screenConfig.search-store.searchForm.children.cardContent.children.searchFormContainer.children.${textFields[i]}.props.value`
    ) {
      dispatch(
        handleField(
          "search-store",
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
    labelName: "Search Store",
    labelKey: "STORE_SEARCH_RESULTS_HEADING",
  }),
  subParagraph: getCommonParagraph({
    labelName: "Provide at least one parameter to search for an application",
    labelKey: "STORE_HOME_SEARCH_RESULTS_DESC",
  }),
  searchFormContainer: getCommonContainer({
    name: getTextField({
      label: {
        labelName: "Store Name",
        labelKey: "STORE_DETAILS_STORE_NAME",
      },
      props: {
        className: "applicant-details-error",
      },
      placeholder: {
        labelName: "Enter Store Name",
        labelKey: "STORE_DETAILS_STORE_NAME_PLACEHOLDER",
      },
      pattern: getPattern("Name"),
      errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",

      jsonPath: "searchScreen.name",
    }),
    department: getSelectField({
      label: {
        labelName: "Department",
        labelKey: "STORE_DETAILS_DEPARTMENT_NAME",
      },
      placeholder: {
        labelName: "Select Department",
        labelKey: "STORE_DETAILS_DEPARTMENT_NAME_PLACEHOLDER",
      },
      required: false,
      jsonPath: "searchScreen.department",
      gridDefination: {
        xs: 12,
        sm: 4,
      },
      sourceJsonPath: "searchScreenMdmsData.store-asset.Department",
      props: {
        optionLabel: "name",
        optionValue: "code",
        // hasLocalization: false
      },
    }),
    active: {
      uiFramework: "custom-containers-local",
      moduleName: "egov-store-asset",
      componentPath: "CheckboxContainer",
      jsonPath: "searchScreen.active",
      gridDefination: {
        xs: 12,
      },
      isFieldValid: true,
      required: false,

      props: {
        content: "STORE_DETAILS_ACTIVE",
        jsonPath: "searchScreen.active",
        screenName: "search-store",
        checkBoxPath:
          "components.div.children.searchForm.children.cardContent.children.searchFormContainer.children.active",
      },
    },
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
            labelKey: "STORE_DETAILS_RESET_BUTTON",
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
            labelKey: "STORE_DETAILS_SEARCH_BUTTON",
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
