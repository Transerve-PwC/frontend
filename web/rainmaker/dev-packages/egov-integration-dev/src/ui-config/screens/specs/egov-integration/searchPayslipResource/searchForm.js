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
  const textFields = ["month","year","empCode"];
  for (let i = 0; i < textFields.length; i++) {
    if (
      `state.screenConfiguration.screenConfig.payslipsearch.searchForm.children.cardContent.children.searchFormContainer.children.${textFields[i]}.props.value`
    ) {
      dispatch(
        handleField(
          "payslipsearch",
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
    empCode: {
      ...getTextField({
        label: {
          labelName: "Employee ID",
          labelKey: "INTIGRATION_SF_EMPLOYEE_ID"
        },
        placeholder: {
          labelName: "Enter Employee ID",
          labelKey: "INTIGRATION_SF_EMPLOYEE_ID_PLACEHOLDER"
        },
        required: true, 
        errorMessage:"INTIGRATION_ERROR_SF_EMPLOYEE_ID",      
        jsonPath: "searchScreen.empCode",     
       
      }),
     
      
    },
    month: {
      ...getSelectField({
        label: {
          labelName: "Month",
          labelKey: "INTIGRATION_MONTH"
        },
        placeholder: {
          labelName: "Select Month",
          labelKey: "INTIGRATION_MONTH_SELECT"
        },
        errorMessage:"INTIGRATION_ERROR_MONTH_SELECT",
        props: {
          data: [
            { code: "01",name: "Jan"},
            { code: "02",name: "Feb"},
            { code: "03",name: "Mar"},
            { code: "04",name: "Apr"},
            { code: "05",name: "May"},
            { code: "06",name: "Jun"},
            { code: "07",name: "Jul"},
            { code: "08",name: "Aug"},
            { code: "09",name: "Sep"},
            { code: "10",name: "Oct"},
            { code: "11",name: "Nov"},
            { code: "12",name: "Dec"},          
           
          ],
          optionValue: "code",
          optionLabel: "name",
        },
      //  pattern: getPattern("Amount"),
      required: true, 
        gridDefination: {
          xs: 12,
          sm: 4,
        },
        jsonPath: "searchScreen.month"
      })
    },
    year: {
      ...getSelectField({
        label: {
          labelName: "Year",
          labelKey: "INTIGRATION_YEAR"
        },
        placeholder: {
          labelName: "Select Year",
          labelKey: "INTIGRATION_YEAR_SELECT"
        },
        required: true,
        errorMessage:"INTIGRATION_YEAR_ERROR_SELECT",
        jsonPath: "searchScreen.year",
        sourceJsonPath: "intigration.year",
          props: {
            optionValue: "code",
            optionLabel: "name",
          },
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
