import {
  getCommonCard,
  getCommonContainer,
  getCommonParagraph,
  getCommonTitle,
  getLabel,
  getPattern,
  getSelectField,
  getDateField,
  getTextField,
} from "egov-ui-framework/ui-config/screens/specs/utils";
import {
  handleScreenConfigurationFieldChange as handleField,
  prepareFinalObject,
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { searchApiCall } from "./functions";
import { convertDateToEpoch, convertDateToEpochIST } from "../../utils";

const resetFields = (state, dispatch) => {
  const textFields = ["indentNumber","indentDate","indentPurpose", "inventoryType","indentStore","indentType","indentToDate","indentFromDate","indentRaisedBy"];
  for (let i = 0; i < textFields.length; i++) {
    if (
      `state.screenConfiguration.screenConfig.search-indent.searchForm.children.cardContent.children.searchFormContainer.children.${textFields[i]}.props.value`
    ) {
      dispatch(
        handleField(
          "search-indent",
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
    indentNumber: getTextField({
      label: { labelName: "Indent No.", labelKey: "STORE_MATERIAL_INDENT_NUMBER" },
      placeholder: {
        labelName: "Indent No.",
        labelKey: "STORE_MATERIAL_INDENT_NUMBER",
      },
      required: false,
      jsonPath: "searchScreen.indentNumber",
      gridDefination: {
        xs: 12,
        sm: 3,
      },
     
    }),
    // indentDate: {
    //   ...getDateField({
    //     label: {
    //       labelName: "Indent Date",
    //       labelKey: "STORE_MATERIAL_INDENT_INDENT_DATE"
    //     },
    //     placeholder: {
    //       labelName: "Enter Indent Date",
    //       labelKey: "STORE_MATERIAL_INDENT_INDENT_DATE_PLACEHOLDER"
    //     },
    //     required: false,
    //     pattern: getPattern("Date") || null,
    //     jsonPath: "searchScreen.indentDate",
    //     gridDefination: {
    //       xs: 12,
    //       sm: 3,
    //     },
    //     props: {
    //       // inputProps: {
    //       //   max: getTodaysDateInYMD()
    //       // }
    //     }
    //   }),
    
    // },
    indentPurpose: {
      ...getSelectField({
        label: { labelName: "Indent Purpose", labelKey: "STORE_MATERIAL_INDENT_INDENT_PURPOSE" },
        placeholder: {
          labelName: "Select Indent Purpose",
          labelKey: "STORE_MATERIAL_INDENT_INDENT_PURPOSE_SELECT"
        },
        required: false,
        jsonPath: "searchScreen.indentPurpose",
        gridDefination: {
          xs: 12,
          sm: 3,
        },
        sourceJsonPath: "searchScreenMdmsData.store-asset.IndentPurpose",
      props: {
        // data: [
        //   {
        //     code: "Consumption",
        //     name: "Capital/Repair/Consumption"
        //   },
         
        // ],
        optionValue: "code",
        optionLabel: "name",
      },
      })
    },
    inventoryType: {
      ...getSelectField({
        label: { labelName: "Inventry Type", labelKey: "STORE_INVENTRY_TYPE" },
        placeholder: {
          labelName: "Select Inventry Type",
          labelKey: "STORE_INVENTRY_TYPE"
        },
        required: false,
        jsonPath: "searchScreen.inventoryType",
        gridDefination: {
          xs: 12,
          sm: 3,
        },
         sourceJsonPath: "searchScreenMdmsData.store-asset.InventoryType",
        props: {
         
          optionValue: "code",
          optionLabel: "name"
        },
      })
    },   
    indentStore: {
      ...getSelectField({
        label: {
          labelName: "Indenting Store Name",
          labelKey: "STORE_MATERIAL_INDENT_STORE_NAME"
        },
        placeholder: {
          labelName: "Indenting Store Name",
          labelKey: "STORE_MATERIAL_INDENT_STORE_NAME"
        },
        required: false,
        jsonPath: "searchScreen.indentStore", 
        gridDefination: {
          xs: 12,
          sm: 3,
        },        
        sourceJsonPath: "store.stores",
        props: {
          optionValue: "code",
          optionLabel: "name",
        },
      })
    },
    // indentType: {
    //   ...getSelectField({
    //     label: { labelName: "Inventry Type", labelKey: "STORE_INVENTRY_TYPE" },
    //     placeholder: {
    //       labelName: "Select Inventry Type",
    //       labelKey: "STORE_INVENTRY_TYPE"
    //     },
    //     required: false,
    //     jsonPath: "searchScreen.indentType",
    //     gridDefination: {
    //       xs: 12,
    //       sm: 3,
    //     },
    //    //  sourceJsonPath: "searchScreenMdmsData.store-asset.InventoryType",
    //     props: {
         
    //       optionValue: "code",
    //       optionLabel: "name"
    //     },
    //   })
    // },
    indentFromDate: {
      ...getDateField({
        label: {
          labelName: "Indent Date From",
          labelKey: "STORE_INDENT_DATE_FROM "
        },
        placeholder: {
          labelName: "Enter Indent Date From",
          labelKey: "STORE_INDENT_DATE_FROM_PLACEHOLDER"
        },
        required: false,
        pattern: getPattern("Date") || null,
        jsonPath: "searchScreen.indentFromDate",
        gridDefination: {
          xs: 12,
          sm: 3,
        },
        props: {
          // inputProps: {
          //   max: getTodaysDateInYMD()
          // }
        }
      })
    },
    indentToDate: {
      ...getDateField({
        label: {
          labelName: "Indent Date To",
          labelKey: "STORE_INDENT_DATE_TO"
        },
        placeholder: {
          labelName: "Enter Indent Date To",
          labelKey: "STORE_INDENT_DATE_TO_PLACEHOLDER"
        },
        required: false,
        pattern: getPattern("Date") || null,
        jsonPath: "searchScreen.indentToDate",
        gridDefination: {
          xs: 12,
          sm: 3,
        },
        props: {
          // inputProps: {
          //   max: getTodaysDateInYMD()
          // }
        }
      })
    },
     indentRaisedBy: {
      ...getSelectField({
        label: { labelName: "Indent Raised By", labelKey: "STORE_MATERIAL_INDENT_INDENT_RAISED_BY" },
        placeholder: {
          labelName: "Select Indent Raised By",
          labelKey: "STORE_MATERIAL_INDENT_INDENT_RAISED_BY"
        },
       visible:true,
        required: false,
        jsonPath: "searchScreen.indentRaisedBy",
       sourceJsonPath: "applyScreenMdmsData.creatorList",
       gridDefination: {
        xs: 12,
        sm: 3,
      },
        props: {         
          className: "hr-generic-selectfield",
          optionValue: "element",
          optionLabel: "element",
         
        }
      }),
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
