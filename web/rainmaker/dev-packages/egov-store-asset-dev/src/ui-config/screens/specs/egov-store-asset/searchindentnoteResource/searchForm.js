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
  const textFields = ["issueStore",  "issueNoteNumber","issueDate",];
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
          labelName: "Store Name",
          labelKey: "STORE_DETAILS_STORE_NAME"
        },
        placeholder: {
          labelName: "Select Store Name",
          labelKey: "STORE_DETAILS_STORE_NAME_SELECT"
        },
        required: false,
        jsonPath: "searchScreen.fromStore", 
        gridDefination: {
          xs: 12,
          sm: 4,
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
          sm: 4,
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
    // RaisedBy: getSelectField({
    //   label: { labelName: "Indent No.", labelKey: "STORE_MATERIAL_INDENT_NUMBER" },
    //   placeholder: {
    //     labelName: "Indent No.",
    //     labelKey: "STORE_MATERIAL_INDENT_NUMBER",
    //   },
    //   required: false,
    //   jsonPath: "searchScreen.indentNumber",
    //   gridDefination: {
    //     xs: 12,
    //     sm: 4,
    //   },
     
    // }),
    indentDate: {
      ...getDateField({
        label: {
          labelName: "Issue Date",
          labelKey: "STORE_MATERIAL_INDENT_NOTE_ISSUE_DATE"
        },
        placeholder: {
          labelName: "Enter Issue Date",
          labelKey: "STORE_MATERIAL_INDENT_NOTE_ISSUE_DATE_PLACEHOLDER"
        },
        required: false,
        pattern: getPattern("Date") || null,
        jsonPath: "searchScreen.issueDate",
        gridDefination: {
          xs: 12,
          sm: 4,
        },
        props: {
          // inputProps: {
          //   max: getTodaysDateInYMD()
          // }
        }
      })
    },
    issuePurpose: {
      ...getSelectField({
        label: { labelName: "Indent Purpose", labelKey: "STORE_MATERIAL_INDENT_INDENT_PURPOSE" },
        placeholder: {
          labelName: "Select Indent Purpose",
          labelKey: "STORE_MATERIAL_INDENT_INDENT_PURPOSE_SELECT"
        },
        required: false,
        visible:false,
        jsonPath: "searchScreen.issuePurpose",
        gridDefination: {
          xs: 12,
          sm: 4,
        },
        //sourceJsonPath: "searchScreenMdmsData.store-asset.RateType",
      props: {
        data: [
          {
            code: "Consumption",
            name: "Capital/Repair/Consumption"
          },
         
        ],
        optionValue: "code",
        optionLabel: "name",
      },
      })
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
