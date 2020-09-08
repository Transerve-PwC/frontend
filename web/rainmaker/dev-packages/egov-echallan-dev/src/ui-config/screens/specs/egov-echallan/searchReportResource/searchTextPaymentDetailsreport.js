import {
  getCommonCard,
  getCommonContainer,
  getCommonParagraph,
  getCommonTitle,
  getDateField,
  getLabel,
  getPattern,
  getBreak,
  getSelectField,
  getTextField
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { searchResultPaymentDetailsApiResponse } from './searchResultReportApiResponse';
import get from "lodash/get";
import { resetAllFields } from "../../utils";

const resetAll = async (state, dispatch) => {
  const objectJsonPath = `components.div.children.searchTextPaymentDetailsreport.children.cardContent.children`;
  const children = get(
    state.screenConfiguration.screenConfig["reportPaymentDetails"],
    objectJsonPath,
    {}
  );
  resetAllFields(children, dispatch, state, 'reportPaymentDetails');
}
/*...SearchTextPaymentDetailsreport...*/
export const searchTextPaymentDetailsreport = getCommonCard({
  header: getCommonTitle(
    {
      labelName: "Search Criteria",
      labelKey: "EC_REPORT_PAYMENT_DETAIL_SEARCH_CRITERIA"
    },
    {
      style: {
        marginBottom: 18
      }
    }
  ),
  break: getBreak(),

  paymentDetailContainer: getCommonContainer({
    StartDate: getDateField({
      label: { labelName: "Start Date", labelKey: "EC_START_DATE_LABEL" },
      placeholder: {
        labelName: "Select Start Date",
        labelKey: "EC_START_DATE_PLACEHOLDER"
      },
      gridDefination: {
        xs: 12,
        sm: 6,
        md: 4
      },
      pattern: getPattern("Date"),
      sourceJsonPath: "paymentdetailReport[0].FromDate",
      jsonPath: "paymentdetailReport[0].FromDate",
      required: true,
      errorMessage: "EC_ERR_DEFAULT_INPUT_START_FIELD_MSG"
    }),

    EndDate: getDateField({
      label: { labelName: "End Date", labelKey: "EC_END_DATE_LABEL" },
      placeholder: {
        labelName: "Select End Date",
        labelKey: "EC_END_DATE_PLACEHOLDER"
      },
      gridDefination: {
        xs: 12,
        sm: 6,
        md: 4
      },
      pattern: getPattern("Date"),
      sourceJsonPath: "paymentdetailReport[0].ToDate",
      jsonPath: "paymentdetailReport[0].ToDate",
      required: true,
      errorMessage: "EC_ERR_DEFAULT_INPUT_END_FIELD_MSG"
    }),
    PaymentStatus: getSelectField({
      label: {
        labelName: "Payment Status",
        labelKey: "EC_REPORT_PAYMENT_STATUS_LABEL"
      },
      optionLabel: "name",
      optionValue: "name",
      placeholder: {
        labelName: "Select Payment Status",
        labelKey: "EC_REPORT_PAYMENT_STATUS_PLACEHOLDER"
      },
      gridDefination: {
        xs: 12,
        sm: 6,
        md: 4
      },
      sourceJsonPath: "applyScreenMdmsData.egec.paymentStatus",
      jsonPath: "paymentdetailReport[0].paymentStatus",
      required: false
    }),


  }),
  button: getCommonContainer({
    buttonContainer: getCommonContainer({

      searchButton: {
        componentPath: "Button",
        gridDefination: {
          xs: 12,
          sm: 6,
          md: 4
        },
        props: {
          variant: "contained",
          style: {
            color: "white",
            backgroundColor: "rgba(0, 0, 0, 0.6000000238418579)",
            borderRadius: "2px",
            width: "80%",
            height: "48px",
            marginBottom: "8px"
          }
        },
        children: {
          buttonLabel: getLabel({
            labelName: "Apply",
            labelKey: "EC_REPORT_PAYMENT_APPLY_BUTTON"
          })
        },
        onClickDefination: {
          action: "condition",
          callBack: searchResultPaymentDetailsApiResponse
        }
      },
      resetButton: {
        componentPath: "Button",
        gridDefination: {
          xs: 12,
          sm: 6,
          md: 4
        },
        props: {
          variant: "contained",
          style: {
            color: "rgb(254, 122, 81)",
            background: "#fff",
            border: "1px solid rgb(254, 122, 81)",
            borderRadius: "2px",
            width: "80%",
            height: "48px",
            marginBottom:"8px"
          }
        },
        children: {
          buttonLabel: getLabel({
            labelName: "Reset All",
            labelKey: "EC_REPORT_RESET_ALL_BUTTON"
          })

        },
        onClickDefination: {
          action: "condition",
          callBack: (state, dispatch) => {
            resetAll(state, dispatch)
          }
        }
      }
    })
  })
});

