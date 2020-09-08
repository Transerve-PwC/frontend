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
  const textFields = ["supplierName","materialCode","RateType",  "active"];
  for (let i = 0; i < textFields.length; i++) {
    if (
      `state.screenConfiguration.screenConfig.search-price-list.searchForm.children.cardContent.children.searchFormContainer.children.${textFields[i]}.props.value`
    ) {
      dispatch(
        handleField(
          "search-price-list",
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
    supplierName: getSelectField({
      label: { labelName: "supplier Name", labelKey: "STORE_SUPPLIER_MASTER_SUPPLIER_NAME" },
      placeholder: {
        labelName: "supplier Name",
        labelKey: "STORE_SUPPLIER_MASTER_SUPPLIER_NAME",
      },
      required: false,
      jsonPath: "searchScreen.supplierName",
      gridDefination: {
        xs: 12,
        sm: 4,
      },
      sourceJsonPath: "suppliers.suppliers",
      props: {
        optionValue: "code",
        optionLabel: "name",
      },
      
    }),
    materialCode: getSelectField({
      label: { labelName: "material Code", labelKey: "STORE_MATERIAL_NAME" },
      placeholder: {
        labelName: "material Code",
        labelKey: "STORE_MATERIAL_NAME_SELECT",
      },
      required: false,
      jsonPath: "searchScreen.materialCode",
      gridDefination: {
        xs: 12,
        sm: 4,
      },
      sourceJsonPath: "searchScreenMdmsData.store-asset.Material",
          props: {
            optionValue: "code",
            optionLabel: "name",
          },
    }),
    RateType: {
      ...getSelectField({
        label: { labelName: "Rate Type", labelKey: "STORE_PRICE_RATE_TYPE" },
        placeholder: {
          labelName: "Select Rate Type",
          labelKey: "STORE_PRICE_RATE_TYPE_SELECT"
        },
        required: false,
        jsonPath: "searchScreen.rateType",
        gridDefination: {
          xs: 12,
          sm: 4,
        },
        sourceJsonPath: "searchScreenMdmsData.store-asset.RateType",
        props: {          
          optionValue: "code",
          optionLabel: "name",
        },
      })
    },    
    active: {
      uiFramework: "custom-containers-local",
      moduleName: "egov-store-asset",
      componentPath: "CheckboxContainer",
      jsonPath: "searchScreen.active",
      gridDefination: {
        xs: 4,
      },
      isFieldValid: true,
      required: false,

      props: {
        content: "STORE_MATERIAL_TYPE_ACTIVE",
        jsonPath: "searchScreen.active",
        screenName: "search-price-list",
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
