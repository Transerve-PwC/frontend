import {
  getCommonCard,
  getCommonContainer,
  getCommonParagraph,
  getCommonTitle,
  getDateField,
  getLabel,
  getPattern,
  getSelectField,
  getTextField
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";

import { UpdateMasterPrice } from "../../../../../ui-utils/commons";
import {
  getAccessToken,
  getOPMSTenantId,
  getLocale,
  getUserInfo
} from "egov-ui-kit/utils/localStorageUtils";
import get from "lodash/get";
import { convertEpochToDate, convertDateToEpoch } from "../../utils/index";
import {  validateFields } from "../../utils";

export const UpdateMaster = async (state, dispatch) => {
  let perDay = 0
  let perWeek = 0
  let perMonth = 0
  let annual = 0
  let isValid = true;
  let isDateValid = true;
  // let validatMasterUpdateformflag = masterFormvalidate()
  // let isFormValid = validatMasterUpdateformflag[0];
  //screenConfiguration.screenConfig.masterUpdateRate.components.div.children.NOCApplication2.children.cardContent.children.masterContainer.children
let  isFormValid = validateFields(
    "components.div.children.NOCApplication2.children.cardContent.children.masterContainer.children",
    state,
    dispatch,
    "masterUpdateRate"
  );
  let Duration = get(
    state.screenConfiguration.preparedFinalObject,
    "Matserdata[0].duration"
  )
  let NewDueation = Duration
  let errorMessage1 = {
    labelName: "Fill all complusory fields'.",
    labelKey: "COMPULSORY_FEILD_MASTER_TOST"
  };
  
      perDay = get(
        state.screenConfiguration.preparedFinalObject,
        "Matserdata[0].perDayPrice"
      )
 
  
      perWeek = get(
        state.screenConfiguration.preparedFinalObject,
        "Matserdata[0].perWeekPrice"
      )
  
      perMonth = get(
        state.screenConfiguration.preparedFinalObject,
        "Matserdata[0].perMonthPrice"
      )
  
      annual = get(
        state.screenConfiguration.preparedFinalObject,
        "Matserdata[0].annualPrice"
      )
  
  let date = convertEpochToDate(get(
    state.screenConfiguration.preparedFinalObject,
    "Matserdata[0].effectiveFromDate"
  ))
  date = date.split('/')
  date = date[2] + '-' + date[1] + '-' + date[0]
  var GivenDate = '2018-02-22';
  var CurrentDate = new Date();
  let date1 = new Date(date);

  if (date1 <= CurrentDate) {
    let errorMessage = {
      labelName: "Date should be greater than the current date.",
      labelKey: "DATE_FORMAT_TOST"
    };
    isValid = false;
    isDateValid = false;
    dispatch(toggleSnackbar(true, errorMessage, "warning"));

  }
  if (isValid && isFormValid) {
    let data = {
      "tenantId": getOPMSTenantId(),
      "applicationType": "ADVERTISEMENTNOC",
      "applicationStatus": "UPDATE",
      "dataPayload": {
        "effectiveFromDate": date,
        "categoryId": get(
          state.screenConfiguration.preparedFinalObject,
          "Matserdata[0].categoryId"
        ),
        "subCategoryId": get(
          state.screenConfiguration.preparedFinalObject,
          "Matserdata[0].subCategoryId"
        ),
        "perDayPrice": perDay,
        "perWeekPrice": perWeek,
        "perMonthPrice": perMonth,
        "annualPrice": annual,
        "fixedPrice": get(
          state.screenConfiguration.preparedFinalObject,
          "Matserdata[0].fixedPrice"
        ),

      }
    }
    let res = UpdateMasterPrice(state, dispatch, [],
      data
    );

  }
  else {
    if (isDateValid === false) {
      let errorMessage = {
        labelName: "Date should be greater than the current date.",
        labelKey: "DATE_FORMAT_TOST"
      };

      dispatch(toggleSnackbar(true, errorMessage, "warning"));
    } else {
      dispatch(toggleSnackbar(true, errorMessage1, "warning"));
    }
  }
}


export const NOCApplication = getCommonCard({
  subHeader: getCommonTitle({
    labelName: "Select Advertisement Category",
    labelKey: "NOC_SELECT_ADVERTISEMENT_CATEGORY_HEADING"
  }),


  appStatusAndToFromDateContainer: getCommonContainer({


    Category: getSelectField({
      label: { labelName: "Category", labelKey: "NOC_CATEGORY_LABEL" },
      optionLabel: "name",
      optionValue: "id",


      placeholder: {
        labelName: "Category",
        labelKey: "NOC_CATEGORY_PLACEHOLDER"
      },
      //  jsonPath: "searchScreen.fromDate",
      gridDefination: {
        xs: 12,
        sm: 4
      },
      props: {
        disabled: true
      },
      //    pattern: getPattern("Date"),
      //   errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
      jsonPath: "Matserdata[0].categoryId",
      sourceJsonPath: "category",
      required: false,

    }),

    SubCategory: getSelectField({
      label: { labelName: "SubCategory", labelKey: "NOC_SUB_CATEGORE_LABEL" },
      optionLabel: "name",
      optionValue: "id",
      placeholder: {
        labelName: "SubCategorye",
        labelKey: "NOC_SUB_CATEGOR_PLACEHOLDER"
      },
      gridDefination: {
        xs: 12,
        sm: 4
      },
      props: {
        disabled: true
      },
      jsonPath: "Matserdata[0].subCategoryId",
      sourceJsonPath: "subcategory",

      required: false
    })
  }),


});
export const NOCApplication2 = getCommonCard({
  subHeader: getCommonTitle({
    labelName: "Rate Proposed",
    labelKey: "NOC_RATE_PROPOSED_HEADING"
  }),
  masterContainer: getCommonContainer({
    EffectiveDate: getDateField({
      label: { labelName: "Effective Date", labelKey: "NOC_EFFECTIVE_DATE_LABEL" },
      placeholder: {
        labelName: "Effective Date",
        labelKey: "NOC_EFFECTIVE_DATE_PLACEHOLDER"
      },
      gridDefination: {
        xs: 12,
        sm: 4
      },
      pattern: getPattern("Date"),
      jsonPath: "Matserdata[0].effectiveFromDate",
      sourceJsonPath: "Matserdata[0].effectiveFromDate"
    }),
    perDay: getTextField({
      label: {
        labelName: "Per Day",
        labelKey: "NOC_PER_DAY_LABEL"
      },
      placeholder: {
        labelName: "Enter Per Day",
        labelKey: "NOC_PER DAY_PLACEHOLDER"
      },
      gridDefination: {
        xs: 12,
        sm: 4
      },
      required: false,
      props: {
        //  disabled:localStorage.getItem('duration').includes("perDay")===true?false:true
        disabled: true
      },
      pattern: /^[1-9][0-9]{0,9}$/i,
      errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
      jsonPath: "Matserdata[0].perDayPrice",
      sourceJsonPath: "Matserdata[0].perDayPrice"
    }),

    perWeek: getTextField({
      label: {
        labelName: "Per Week",
        labelKey: "NOC_Per_Week_LABEL"
      },
      placeholder: {
        labelName: "Enter Per Week",
        labelKey: "NOC_Per_Week_PLACEHOLDER"
      },
      gridDefination: {
        xs: 12,
        sm: 4
      },
      props: {
        //  disabled:localStorage.getItem('duration').includes("perWeek")===true?false:true
        disabled: true

      },
      //  required: false,
      pattern: /^[1-9][0-9]{0,9}$/i,
      errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
      jsonPath: "Matserdata[0].perWeekPrice",
      sourceJsonPath: "Matserdata[0].perWeekPrice"
    }),
    perMonth: getTextField({
      label: {
        labelName: "Per Month",
        labelKey: "NOC_PER_MONTH_LABEL"
      },
      placeholder: {
        labelName: "Enter Per Day",
        labelKey: "NOC_PER_MONTH_PLACEHOLDER"
      },
      gridDefination: {
        xs: 12,
        sm: 4
      },
      props: {
        //  disabled:localStorage.getItem('duration').includes("month")===true?false:true
        disabled: true
      },

      pattern: /^[1-9][0-9]{0,9}$/i,
      errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
      jsonPath: "Matserdata[0].perMonthPrice",
      sourceJsonPath: "Matserdata[0].perMonthPrice",
    }),
    anual: getTextField({
      label: {
        labelName: "Anual",
        labelKey: "NOC_ANUAL_LABEL"
      },
      placeholder: {
        labelName: "Enter anual",
        labelKey: "NOC_ANUAL_PLACEHOLDER"
      },
      gridDefination: {
        xs: 12,
        sm: 4
      },
      props: {
        //       disabled:localStorage.getItem('duration').includes("annual")===true?false:true
        disabled: true

      },
      required: false,
      pattern: /^[1-9][0-9]{0,9}$/i,
      errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
      jsonPath: "Matserdata[0].annualPrice",
      sourceJsonPath: "Matserdata[0].annualPrice"
    }),
  }),



  button: getCommonContainer({
    buttonContainer: getCommonContainer({
      resetButton: {
        componentPath: "Button",
        gridDefination: {
          xs: 12,
          sm: 6
          // align: "center"
        },
        props: {
          variant: "outlined",
          style: {
            color: "#FE7A51",
            borderColor: "#FE7A51",
            width: "220px",
            height: "48px",
            margin: "8px",
            float: "right"
          }
        },
        children: {
          buttonLabel: getLabel({
            labelName: "Cancel",
            labelKey: "NOC_CANCEL_BUTTON"
          })
        },
        onClickDefination: {
          action: "page_change",
          path: `/egov-opms/masterAdvertisement?purpose=cancel`
        },
      },
      searchButton: {
        componentPath: "Button",
        gridDefination: {
          xs: 12,
          sm: 6
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
            height: "48px"
          }
        },
        children: {
          buttonLabel: getLabel({
            labelName: "Submit",
            labelKey: "NOC_SUBMIT_BUTTON"
          })
        },
        onClickDefination: {
          action: "condition",
          callBack: UpdateMaster
        }
      }
    })
  })
});
const masterFormvalidate = () => {

  let allAreFilled = true;
  let isFormValid = true;
  let hasFieldToaster = false;
  document.getElementById("masterUpdateRate").querySelectorAll("input[type='text']").forEach(function (i) {
    i.parentNode.classList.remove("MuiInput-error-853");
    i.parentNode.parentNode.classList.remove("MuiFormLabel-error-844");
    if (!i.value) {
      i.focus();
      allAreFilled = false;
      i.parentNode.classList.add("MuiInput-error-853");
      i.parentNode.parentNode.classList.add("MuiFormLabel-error-844");
    }
    if (i.getAttribute("aria-invalid") === 'true' && allAreFilled) {
      i.parentNode.classList.add("MuiInput-error-853");
      i.parentNode.parentNode.classList.add("MuiFormLabel-error-844");
      allAreFilled = false;
      isFormValid = false;
      hasFieldToaster = true;
    }
  })
  if (!allAreFilled) {
    isFormValid = false;
    hasFieldToaster = true;
  }
  else {
    isFormValid = true;
    hasFieldToaster = false;
  }
  return [isFormValid, hasFieldToaster]
}

