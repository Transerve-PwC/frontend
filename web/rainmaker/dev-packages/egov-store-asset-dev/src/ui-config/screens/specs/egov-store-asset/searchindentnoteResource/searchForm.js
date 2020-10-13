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

const resetFields = (state, dispatch) => {
  const textFields = ["issueStore",  "issueNoteNumber","issueDate","issueFromDate","issueToDate","indentRaisedBy","indentPurpose"];
  for (let i = 0; i < textFields.length; i++) {
    if (
      `state.screenConfiguration.screenConfig.search-indent-note.searchForm.children.cardContent.children.searchFormContainer.children.${textFields[i]}.props.value`
    ) {
      dispatch(
        handleField(
          "search-indent-note",
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
    issueStore: {
      ...getSelectField({
        label: {
          labelName: "Indenting Store",
          labelKey: "STORE_DETAILS_STORE_NAME_INDENT"
        },
        placeholder: {
          labelName: "Select Indenting Store",
          labelKey: "STORE_DETAILS_STORE_NAME_INDENT_SELECT"
        },
        required: false,
        jsonPath: "searchScreen.fromStore", 
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
    issueNoteNumber: {
      ...getTextField({
        label: { labelName: "Issue Note Number", labelKey: "STORE_MATERIAL_INDENT_NOTE_ISSUE_NOTE_NUMBER" },
        placeholder: {
          labelName: "Select Indent Purpose",
          labelKey: "STORE_MATERIAL_INDENT_NOTE_ISSUE_NOTE_NUMBER"
        },
        required: false,
        jsonPath: "searchScreen.issueNoteNumber",
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
    // issueDate: {
    //   ...getDateField({
    //     label: {
    //       labelName: "Issue Date",
    //       labelKey: "STORE_MATERIAL_INDENT_NOTE_ISSUE_DATE"
    //     },
    //     placeholder: {
    //       labelName: "Enter Issue Date",
    //       labelKey: "STORE_MATERIAL_INDENT_NOTE_ISSUE_DATE_PLACEHOLDER"
    //     },
    //     required: false,
    //     pattern: getPattern("Date") || null,
    //     jsonPath: "searchScreen.issueDate",
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
    issueFromDate: {
      ...getDateField({
        label: {
          labelName: "Issue Date From",
          labelKey: "STORE_INDENT_ISSUE_DATE_FROM "
        },
        placeholder: {
          labelName: "Enter Issue Date From",
          labelKey: "STORE_INDENT_ISSUE_DATE_FROM_PLACEHOLDER"
        },
        required: false,
        pattern: getPattern("Date") || null,
        jsonPath: "searchScreen.issueFromDate",
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
    issueToDate: {
      ...getDateField({
        label: {
          labelName: "Issue Date To",
          labelKey: "STORE_INDENT_ISSUE_DATE_TO"
        },
        placeholder: {
          labelName: "Enter Issue Date To",
          labelKey: "STORE_INDENT_ISSUE_DATE_TO_PLACEHOLDER"
        },
        required: false,
        pattern: getPattern("Date") || null,
        jsonPath: "searchScreen.issueToDate",
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
    // issuePurpose: {
    //   ...getSelectField({
    //     label: { labelName: "Indent Purpose", labelKey: "STORE_MATERIAL_INDENT_INDENT_PURPOSE" },
    //     placeholder: {
    //       labelName: "Select Indent Purpose",
    //       labelKey: "STORE_MATERIAL_INDENT_INDENT_PURPOSE_SELECT"
    //     },
    //     required: false,
    //     visible:false,
    //     jsonPath: "searchScreen.issuePurpose",
    //     gridDefination: {
    //       xs: 12,
    //       sm: 3,
    //     },
    //     //sourceJsonPath: "searchScreenMdmsData.store-asset.RateType",
    //   props: {
    //     data: [
    //       {
    //         code: "Consumption",
    //         name: "Capital/Repair/Consumption"
    //       },
         
    //     ],
    //     optionValue: "code",
    //     optionLabel: "name",
    //   },
    //   })
    // },
   
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
