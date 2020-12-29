import {
  getCommonCard,
  getCommonContainer,
  getCommonParagraph,
  getCommonTitle,
  getLabel,
  getPattern,
  getSelectField,
  getTextField,
  getDateField
} from "egov-ui-framework/ui-config/screens/specs/utils";
import {
  handleScreenConfigurationFieldChange as handleField,
  prepareFinalObject,
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { searchApiCall } from "./functions";

const resetFields = (state, dispatch) => {
  const textFields = ["store", "rateType", "supplierCode","purchaseOrderNumber","indentFromDate","indentToDate","indentPurpose","inventoryType","indentRaisedBy"];
  for (let i = 0; i < textFields.length; i++) {
    if (
      `state.screenConfiguration.screenConfig.search-purchase-order.searchForm.children.cardContent.children.searchFormContainer.children.${textFields[i]}.props.value`
    ) {
      dispatch(
        handleField(
          "search-purchase-order",
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
    purchaseOrderNumber: getTextField({
      label: {
        labelName: "Purchase Order Number",
        labelKey: `STORE_PURCHASE_ORDER_NUMBER`,
      },
      props: {
        className: "applicant-details-error",
      },
      gridDefination: {
        xs: 12,
        sm: 3,
      },
      placeholder: {
        labelName: "Enter Purchase Order Number",
        labelKey: `STORE_PURCHASE_ORDER_NUMBER_PLCHLDR`,
      },
     // pattern: getPattern("alpha-only"),
      errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",

      jsonPath: "searchScreen.purchaseOrderNumber",
    }),
    store: getSelectField({
      label: { labelName: "Store Name", labelKey: "STORE_DETAILS_STORE_NAME" },
      placeholder: {
        labelName: "Select Store Name",
        labelKey: "STORE_DETAILS_STORE_NAME_SELECT",
      },
      required: false,
      jsonPath: "searchScreen.store",
      gridDefination: {
        xs: 12,
        sm: 3,
      },
      sourceJsonPath: "searchMaster.storeNames",
      props: {
        optionValue: "code",
        optionLabel: "name",
      },
    }),  
    rateType: {
      ...getSelectField({
        label: { labelName: "PO Rate Type", labelKey: "STORE_PURCHASE_ORDER_RATETYPE" },
        placeholder: {
          labelName: "Select PO Rate Type",
          labelKey: "STORE_PURCHASE_ORDER_RATETYPE_SELECT"
        },
        gridDefination: {
          xs: 12,
          sm: 3,
        },
        jsonPath: "searchScreen.rateType",
        sourceJsonPath: "searchScreenMdmsData.store-asset.PORateType",
        props: {
          className: "hr-generic-selectfield",
          optionValue: "code",
          optionLabel: "name"
        }
      }),
    },
    supplierCode: {
      ...getSelectField({
        label: { labelName: "Supplier", labelKey: "STORE_SUPPLIER_MASTER_SUPPLIER_NAME" },
        placeholder: {
          labelName: "Select supplier",
          labelKey: "STORE_SUPPLIER_MASTER_NAME_SELECT"
        },
        gridDefination: {
          xs: 12,
          sm: 3,
        },
        jsonPath: "searchScreen.supplierCode",
        sourceJsonPath: "searchMaster.supplierName",
        props: {
          className: "hr-generic-selectfield",
          optionValue: "code",
          optionLabel: "name"
        }
      }),
    },
    // indentFromDate: {
    //   ...getDateField({
    //     label: {
    //       labelName: "Indent Date From",
    //       labelKey: "STORE_INDENT_DATE_FROM "
    //     },
    //     placeholder: {
    //       labelName: "Enter Indent Date From",
    //       labelKey: "STORE_INDENT_DATE_FROM_PLACEHOLDER"
    //     },
    //     required: false,
    //     pattern: getPattern("Date") || null,
    //     jsonPath: "searchScreen.indentFromDate",
    //     gridDefination: {
    //       xs: 12,
    //       sm: 3,
    //     },
    //     props: {
    //       // inputProps: {
    //       //   max: getTodaysDateInYMD()
    //       // }
    //     }
    //   })
    // },
    // indentToDate: {
    //   ...getDateField({
    //     label: {
    //       labelName: "Indent Date To",
    //       labelKey: "STORE_INDENT_DATE_TO"
    //     },
    //     placeholder: {
    //       labelName: "Enter Indent Date To",
    //       labelKey: "STORE_INDENT_DATE_TO_PLACEHOLDER"
    //     },
    //     required: false,
    //     pattern: getPattern("Date") || null,
    //     jsonPath: "searchScreen.indentToDate",
    //     gridDefination: {
    //       xs: 12,
    //       sm: 3,
    //     },
    //     props: {
    //       // inputProps: {
    //       //   max: getTodaysDateInYMD()
    //       // }
    //     }
    //   })
    // },
    // purchaseType: {
    //   ...getSelectField({
    //     label: { labelName: "Purchase Type", labelKey: "STORE_PURCHASE_ORDER_TYPE" },
    //     placeholder: {
    //       labelName: "Select Purchase Type",
    //       labelKey: "STORE_PURCHASE_ORDER_TYPE_SELECT"
    //     },
    //    visible:false,
    //     required: false,
    //     jsonPath: "searchScreen.purchaseType",
    //    // sourceJsonPath: "searchMaster.storeNames",
    //     props: {         
    //       className: "hr-generic-selectfield",
    //       optionValue: "value",
    //       optionLabel: "label",
    //       data: [
    //         {
    //           value: "Indent",
    //           label: "Indent"
    //         },
    //         {
    //           value: "Non Indent",
    //           label: "Non Indent"
    //         }
    //       ],
    //     }
    //   }),
    // },
    // indentPurpose: {
    //   ...getSelectField({
    //     label: { labelName: "Indent Purpose", labelKey: "STORE_MATERIAL_INDENT_INDENT_PURPOSE" },
    //     placeholder: {
    //       labelName: "Select Indent Purpose",
    //       labelKey: "STORE_MATERIAL_INDENT_INDENT_PURPOSE_SELECT"
    //     },
    //     required: false,
    //     errorMessage: "STORE_VALIDATION_INDENT_PURPOSE",
    //     jsonPath: "searchScreen.indentPurpose",
    //     sourceJsonPath: "searchScreenMdmsData.store-asset.IndentPurpose",
    //     gridDefination: {
    //       xs: 12,
    //       sm: 3,
    //     },
    //   props: {
        
    //     optionValue: "code",
    //     optionLabel: "name",
    //   },
    //   }),
     
    // },
    // inventoryType: {
    //   ...getSelectField({
    //     label: { labelName: "Inventry Type", labelKey: "STORE_INVENTRY_TYPE" },
    //     placeholder: {
    //       labelName: "Select Inventry Type",
    //       labelKey: "STORE_MATERIAL_TYPE_NAME_SELECT"
    //     },
    //     required: false,
    //     errorMessage: "STORE_VALIDATION_INVENTRY_TYPE",
    //     jsonPath: "searchScreen.inventoryType",
    //      sourceJsonPath: "searchScreenMdmsData.store-asset.InventoryType",
    //      gridDefination: {
    //       xs: 12,
    //       sm: 3,
    //     },
    //     props: {
         
    //       optionValue: "code",
    //       optionLabel: "name"
    //     },
    //   })
    // },
    // indentRaisedBy: {
    //   ...getSelectField({
    //     label: { labelName: "Indent Raised By", labelKey: "STORE_MATERIAL_INDENT_INDENT_RAISED_BY" },
    //     placeholder: {
    //       labelName: "Select Indent Raised By",
    //       labelKey: "STORE_MATERIAL_INDENT_INDENT_RAISED_BY"
    //     },
    //    visible:true,
    //     required: false,
    //     jsonPath: "searchScreen.indentRaisedBy",
    //    sourceJsonPath: "applyScreenMdmsData.creatorList",
    //    gridDefination: {
    //     xs: 12,
    //     sm: 3,
    //   },
    //     props: {         
    //       className: "hr-generic-selectfield",
    //       optionValue: "element",
    //       optionLabel: "element",
         
    //     }
    //   }),
    // },
  }),

  button: getCommonContainer({
    buttonContainer: getCommonContainer({
      resetButton: {
        componentPath: "Button",
        gridDefination: {
          xs: 12,
          sm: 3,
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
          sm: 3,
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
