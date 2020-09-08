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
  const textFields = ["name","type", "active"];
  for (let i = 0; i < textFields.length; i++) {
    if (
      `state.screenConfiguration.screenConfig.search-supplier-master.searchForm.children.cardContent.children.searchFormContainer.children.${textFields[i]}.props.value`
    ) {
      dispatch(
        handleField(
          "search-supplier-master",
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
    // name: getSelectField({
    //   label: { labelName: "Supplier Name", labelKey: "STORE_SUPPLIER_MASTER_SUPPLIER_NAME" },
    //   placeholder: {
    //     labelName: "Select Supplier Name",
    //     labelKey: "STORE_SUPPLIER_MASTER_NAME_SELECT",
    //   },
    //   required: false,
    //   jsonPath: "searchScreen.name",
    //   gridDefination: {
    //     xs: 12,
    //     sm: 4,
    //   },
    //   sourceJsonPath: "searhSupplierMaster.supplierName",
    //   props: {
    //     optionValue: "code",
    //     optionLabel: "name",
    //   },
    // }),
    name: getTextField({
      label: {
        labelName: "Supplier Name",
        labelKey: "STORE_SUPPLIER_MASTER_SUPPLIER_NAME",
      },
      props: {
        className: "applicant-details-error",
      },
      placeholder: {
        labelName: "Enter Supplier Name",
        labelKey: "STORE_SUPPLIER_MASTER_SUPPLIER_NAME_PLACEHOLDER",
      },
      pattern: getPattern("Name"),
      errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",

      jsonPath: "searchScreen.name",
    }),
    type: getSelectField({
      label: {
        labelName: "Supplier Type",
        labelKey: "STORE_SUPPLIER_MASTER_SUPPLIER_TYPE",
      },
      placeholder: {
        labelName: "Select Supplier Type",
        labelKey: "STORE_SUPPLIER_MASTER_TYPE_SELECT",
      },
      required: false,
      jsonPath: "searchScreen.type",
      gridDefination: {
        xs: 12,
        sm: 4,
      },
      sourceJsonPath: "searchScreenMdmsData.store-asset.SupplierType",
      props: {
        optionLabel: "name",
        optionValue: "code",
      },
    }),
    active: {
      uiFramework: "custom-containers-local",
      moduleName: "egov-store-asset",
      componentPath: "CheckboxContainer",
      jsonPath: "searchScreen.active",
      gridDefination: {
        xs: 6,
      },
      isFieldValid: true,
      required: false,

      props: {
        content: "STORE_SUPPLIER_MASTER_ACTIVE",
        jsonPath: "searchScreen.active",
        screenName: "search-material-type",
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
        },
        props: {
          variant: "outlined",
          style: {
            color: "#FE7A51",
            borderColor: "#FE7A51",
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
