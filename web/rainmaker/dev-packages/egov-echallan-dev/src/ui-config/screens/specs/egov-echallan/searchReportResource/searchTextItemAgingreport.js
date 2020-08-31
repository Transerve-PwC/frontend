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
import { searchResultInventoryDetailApiResponse } from './searchResultReportApiResponse';
import get from "lodash/get";
import { resetAllFields } from "../../utils";

const resetAll = async (state, dispatch) => {
  const objectJsonPath = `components.div.children.searchTextItemAgingreport.children.cardContent.children`;
  const children = get(
    state.screenConfiguration.screenConfig["reportInventoryDetail"],
    objectJsonPath,
    {}
  );
  resetAllFields(children, dispatch, state, 'reportInventoryDetail');
}
export const searchTextItemAgingreport = getCommonCard({
  header: getCommonTitle(
    {
      labelName: "Search Criteria",
      labelKey: "EC_REPORT_SEARCH_CRITERIA_DATE"
    },
    {
      style: {
        marginBottom: 18
      }
    }
  ),
  break: getBreak(),

  itemAgingContainer: getCommonContainer({
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
      sourceJsonPath: "itemAgingReport[0].FromDate",
      jsonPath: "itemAgingReport[0].FromDate",
      required: false,
      visible: false,
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
      sourceJsonPath: "itemAgingReport[0].ToDate",
      jsonPath: "itemAgingReport[0].ToDate",
      required: false,
      visible: false,
      errorMessage: "EC_ERR_DEFAULT_INPUT_END_FIELD_MSG"
    }),
    timeLineSelect: getSelectField({
      label: {
        labelName: "Timeline",
        labelKey: "EC_REPORT_TIMELINE_LABEL"
      },
      optionLabel: "name",
      optionValue: "name",
      placeholder: {
        labelName: "Select Timeline",
        labelKey: "EC_REPORT_TIMELINE_PLACEHOLDER"
      },
      gridDefination: {
        xs: 12,
        sm: 6,
        md: 4
      },
      sourceJsonPath: "applyScreenMdmsData.egec.TimeLine",
      jsonPath: "itemAgingReport[0].itemAgeingTimeline",
      required: true
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
            labelKey: "EC_REPORT_ITEM_AGING_BUTTON"
          })
        },
        onClickDefination: {
          action: "condition",
          callBack: searchResultInventoryDetailApiResponse
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
            marginBottom: "8px"
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
