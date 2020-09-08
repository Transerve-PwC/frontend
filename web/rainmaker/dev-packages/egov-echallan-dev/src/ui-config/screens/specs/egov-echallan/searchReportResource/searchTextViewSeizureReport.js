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
//import { searchApiCall1, searchApiCall2, searchApiCall3 } from "./functions";
import { searchResultViewSeizureApiResponse } from './searchResultReportApiResponse';
import get from "lodash/get";
import { resetAllFields } from "../../utils";


const resetAll = async (state, dispatch) => {

  const objectJsonPath = `components.div.children.searchTextViewSeizureReport.children.cardContent.children`;
  const children = get(
    state.screenConfiguration.screenConfig["reportSearchViewSeizure"],
    objectJsonPath,
    {}
  );
  resetAllFields(children, dispatch, state, 'reportSearchViewSeizure');
}
/*...SearchTextViewSizureReport..*/
export const searchTextViewSeizureReport = getCommonCard({
  header: getCommonTitle(
    {
      labelName: "Search Criteria",
      labelKey: "EC_REPORT_SEIZURE_SEARCH_CRITERIA"
    },
    {
      style: {
        marginBottom: 18
      }
    }
  ),
  break: getBreak(),

  viewSeizureContainer: getCommonContainer({
    seizureCriteria: getSelectField({
      label: {
        labelName: "ENCROACHMENT TYPE",
        labelKey: "EC_REPORT_SEIZURE_ENCROACHMENT_TYPE_LABEL"
      },
      optionLabel: "name",
      optionValue: "code",
      placeholder: {
        labelName: "ENCROACHMENT TYPE",
        labelKey: "EC_REPORT_SEIZURE_ENCROACHMENT_TYPE_PLACEHOLDER"
      },
      gridDefination: {
        xs: 12,
        sm: 6,
        md: 4,

      },
      sourceJsonPath: "applyScreenMdmsData.egec.EncroachmentType",
      jsonPath: "searchViewSeizureReport[0].EncroachmentType",
      required: false
    }),
    sector: {
      uiFramework: "custom-containers-local",
      moduleName: "egov-echallan",
      componentPath: "AutosuggestContainer",
      jsonPath: "searchViewSeizureReport[0].sector",
      errorMessage: "EC_ERR_DEFAULT_INPUT_SECTOR_FIELD_MSG",
      required: true,
      // visible: true,
      gridDefination: {
        xs: 12,
        sm: 6,
        md: 4,
      },
      props: {
        style: {
          width: "100%",
          cursor: "pointer"
        },
        label: { labelName: "Sector", labelKey: "EC_REPORT_SEIZURE_SECTOR_LABEL" },
        placeholder: {
          labelName: "select Violation Sector",
          labelKey: "EC_REPORT_SEIZURE_SECTOR_PLACEHOLDER"
        },
        jsonPath: "searchViewSeizureReport[0].sector",
        sourceJsonPath: "applyScreenMdmsData.egec.sector",
        labelsFromLocalisation: true,
        // setDataInField: true,
        // suggestions: [],
        fullwidth: true,
        required: false,
        inputLabelProps: {
          shrink: true
        },
        // localePrefix: {
        //   moduleName: "ACCESSCONTROL_ROLES",
        //   masterName: "ROLES"
        // },
      },

    },
    SINameSelection: {
      uiFramework: "custom-containers-local",
      moduleName: "egov-echallan",
      componentPath: "AutosuggestContainer",
      jsonPath: "searchViewSeizureReport[0].SIName",
      errorMessage: "EC_ERR_DEFAULT_INPUT_SECTOR_FIELD_MSG",
      required: true,
      // visible: true,
      gridDefination: {
        xs: 12,
        sm: 6,
        md: 4,
      },
      props: {
        style: {
          width: "100%",
          cursor: "pointer"
        },
        label: { labelName: "SI Name", labelKey: "EC_REPORT_SEIZURE_SI_NAME_LABEL" },
        placeholder: {
          labelName: "select SI Name",
          labelKey: "EC_REPORT_SEIZURE_SI_NAME_PLACEHOLDER"
        },
        jsonPath: "searchViewSeizureReport[0].SIName",
        sourceJsonPath: "applyScreenMdmsData.egec.SINameList",
        labelsFromLocalisation: true,
        // setDataInField: true,
        // suggestions: [],
        fullwidth: true,
        required: false,
        inputLabelProps: {
          shrink: true
        },
        // localePrefix: {
        //   moduleName: "ACCESSCONTROL_ROLES",
        //   masterName: "ROLES"
        // },
      },

    },
    StartDate: getDateField({
      label: { labelName: "Start Date", labelKey: "EC_REPORT_SEIZURE_START_DATE_LABEL" },
      placeholder: {
        labelName: "Select Start Date",
        labelKey: "EC_REPORT_SEIZURE_START_DATE_PLACEHOLDER"
      },
      gridDefination: {
        xs: 12,
        sm: 6,
        md: 4
      },
      pattern: getPattern("Date"),
      sourceJsonPath: "searchViewSeizureReport[0].FromDate",
      jsonPath: "searchViewSeizureReport[0].FromDate",
      required: true,
      errorMessage: "EC_ERR_DEFAULT_INPUT_START_FIELD_MSG"
    }),

    EndDate: getDateField({
      label: { labelName: "End Date", labelKey: "EC_REPORT_SEIZURE_END_DATE_LABEL" },
      placeholder: {
        labelName: "Select End Date",
        labelKey: "EC_REPORT_SEIZURE_END_DATE_PLACEHOLDER"
      },
      gridDefination: {
        xs: 12,
        sm: 6,
        md: 4
      },
      pattern: getPattern("Date"),
      sourceJsonPath: "searchViewSeizureReport[0].ToDate",
      jsonPath: "searchViewSeizureReport[0].ToDate",
      required: true,
      errorMessage: "EC_ERR_DEFAULT_INPUT_END_FIELD_MSG"
    }),
    ChallanSelection: {
      uiFramework: "custom-containers-local",
      moduleName: "egov-echallan",
      componentPath: "AutosuggestContainer",
      jsonPath: "searchViewSeizureReport[0].Status",
      errorMessage: "EC_ERR_DEFAULT_INPUT_STATUS_FIELD_MSG",
      required: true,
      // visible: true,
      gridDefination: {
        xs: 12,
        sm: 6,
        md: 4,
      },
      props: {
        style: {
          width: "100%",
          cursor: "pointer"
        },
        label: { labelName: "Status", labelKey: "EC_REPORT_SEIZURE_STATUS_LABEL" },
        placeholder: {
          labelName: "select SI Name",
          labelKey: "EC_REPORT_SEIZURE_STATUS_PLACEHOLDER"
        },
        jsonPath: "searchViewSeizureReport[0].Status",
        sourceJsonPath: "applyScreenMdmsData.egec.ChallanStatus",
        labelsFromLocalisation: true,
        // setDataInField: true,
        // suggestions: [],
        fullwidth: true,
        required: false,
        inputLabelProps: {
          shrink: true
        },
        // localePrefix: {
        //   moduleName: "ACCESSCONTROL_ROLES",
        //   masterName: "ROLES"
        // },
      },

    },

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
            labelKey: "EC_REPORT_SEIZURE_APPLY_BUTTON"
          })
        },
        onClickDefination: {
          action: "condition",
          callBack: searchResultViewSeizureApiResponse
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
            // margin: "8px",
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
