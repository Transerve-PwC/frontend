import {
  getCommonCard,
  getSelectField,
  getTextField,
  getDateField,
  getCommonTitle,
  getPattern,
  getCommonContainer,
  getCommonGrayCard
} from "egov-ui-framework/ui-config/screens/specs/utils";
import {getPattern
} from "../../utils";
import {
  prepareFinalObject
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import {
  getTodaysDateInYMD
} from "../../utils";
import get from "lodash/get";

export const courtCaseHeader = getCommonTitle({
  labelName: "Court Case Details",
  labelKey: "ES_COURT_CASE_DETAILS_HEADER"
}, {
  style: {
    marginBottom: 18,
    marginTop: 18
  }
})

const estateOfficerCourtField = {
  label: {
      labelName: "Estate Officer Court",
      labelKey: "ES_ESTATE_OFFICER_COURT_LABEL"
  },
  placeholder: {
      labelName: "Enter Estate Officer Court",
      labelKey: "ES_ESTATE_OFFICER_COURT_PLACEHOLDER"
  },
  gridDefination: {
      xs: 12,
      sm: 6
  },
  errorMessage:"ERR_COURT_DETAILS_250_CHARACTERS",
  pattern: _getPattern("courtCase"),
  jsonPath: "Properties[0].propertyDetails.courtCases[0].estateOfficerCourt"
}

const commissionersCourtField = {
  label: {
      labelName: "Commissioners Court",
      labelKey: "ES_COMMISSIONERS_COURT_LABEL"
  },
  placeholder: {
      labelName: "Enter Commissioners Court",
      labelKey: "ES_COMMISSIONERS_COURT_PLACEHOLDER"
  },
  gridDefination: {
      xs: 12,
      sm: 6
  },
  errorMessage:"ERR_COURT_DETAILS_250_CHARACTERS",
  pattern: _getPattern("courtCase"),
  jsonPath: "Properties[0].propertyDetails.courtCases[0].commissionersCourt"
}

const chiefAdministratorsCourtField = {
  label: {
      labelName: "Chief Administrators Court",
      labelKey: "ES_CHIEF_ADMINISTRATORS_COURT_LABEL"
  },
  placeholder: {
      labelName: "Enter Chief Administrators Court",
      labelKey: "ES_CHIEF_ADMINISTRATORS_COURT_PLACEHOLDER"
  },
  gridDefination: {
      xs: 12,
      sm: 6
  },
  errorMessage:"ERR_COURT_DETAILS_250_CHARACTERS",
  pattern: _getPattern("courtCase"),
  // maxLength: 250,
  jsonPath: "Properties[0].propertyDetails.courtCases[0].chiefAdministartorsCourt"
}

const advisorToAdminCourtField = {
  label: {
      labelName: "Advisor to Admin Court",
      labelKey: "ES_ADVISOR_TO_ADMIN_COURT_LABEL"
  },
  placeholder: {
      labelName: "Enter Advisor to Admin Court",
      labelKey: "ES_ADVISOR_TO_ADMIN_COURT_PLACEHOLDER"
  },
  gridDefination: {
      xs: 12,
      sm: 6
  },
  errorMessage:"ERR_COURT_DETAILS_250_CHARACTERS",
  pattern: _getPattern("courtCase"),
  // maxLength: 250,
  jsonPath: "Properties[0].propertyDetails.courtCases[0].advisorToAdminCourt"
}

const honbleDistrictCourtField = {
  label: {
      labelName: "Hon'ble District Court",
      labelKey: "ES_HONBLE_DISTRICT_COURT_LABEL"
  },
  placeholder: {
      labelName: "Enter Hon'ble District Court",
      labelKey: "ES_HONBLE_DISTRICT_COURT_PLACEHOLDER"
  },
  gridDefination: {
      xs: 12,
      sm: 6
  },
  pattern: _getPattern("courtCase"),
  errorMessage:"ERR_COURT_DETAILS_250_CHARACTERS",
  // maxLength: 250,
  jsonPath: "Properties[0].propertyDetails.courtCases[0].honorableDistrictCourt"
}

const honbleHighCourtField = {
  label: {
      labelName: "Hon'ble High Court",
      labelKey: "ES_HONBLE_HIGH_COURT_LABEL"
  },
  placeholder: {
      labelName: "Enter Hon'ble High Court",
      labelKey: "ES_HONBLE_HIGH_COURT_PLACEHOLDER"
  },
  gridDefination: {
      xs: 12,
      sm: 6
  },
  errorMessage:"ERR_COURT_DETAILS_250_CHARACTERS",
  pattern: _getPattern("courtCase"),
  // maxLength: 250,
  jsonPath: "Properties[0].propertyDetails.courtCases[0].honorableHighCourt"
}

const honbleSupremeCourtField = {
  label: {
      labelName: "Hon'ble Supreme Court",
      labelKey: "ES_HONBLE_SUPREME_COURT_LABEL"
  },
  placeholder: {
      labelName: "Enter Hon'ble Supreme Court",
      labelKey: "ES_HONBLE_SUPREME_COURT_PLACEHOLDER"
  },
  gridDefination: {
      xs: 12,
      sm: 6
  },
  errorMessage:"ERR_COURT_DETAILS_250_CHARACTERS",
  pattern: _getPattern("courtCase"),
  // maxLength: 250,
  jsonPath: "Properties[0].propertyDetails.courtCases[0].honorableSupremeCourt"
}

// export const courtCaseDetails = getCommonCard({
//   header: courtCaseHeader,
//   detailsContainer: getCommonContainer({
//     estateOfficerCourt: getTextField(estateOfficerCourtField),
//     commissionersCourt: getTextField(commissionersCourtField),
//     chiefAdministratorsCourt: getTextField(chiefAdministratorsCourtField),
//     advisorToAdminCourt: getTextField(advisorToAdminCourtField),
//     honbleDistrictCourt: getTextField(honbleDistrictCourtField),
//     honbleHighCourt: getTextField(honbleHighCourtField),
//     honbleSupremeCourt: getTextField(honbleSupremeCourtField)
//   })
// })

const commonCourtCaseInformation = () => {
  return getCommonGrayCard({
    header: getCommonTitle({
      labelName: "Court Case Information",
      labelKey: "ES_COMMON_COURT_CASE_INFORMATION"
    }, {
      style: {
        marginBottom: 18
      }
    }),
    courtCaseCard: getCommonContainer({
      estateOfficerCourt: getTextField(estateOfficerCourtField),
      commissionersCourt: getTextField(commissionersCourtField),
      chiefAdministratorsCourt: getTextField(chiefAdministratorsCourtField),
      advisorToAdminCourt: getTextField(advisorToAdminCourtField),
      honbleDistrictCourt: getTextField(honbleDistrictCourtField),
      honbleHighCourt: getTextField(honbleHighCourtField),
      honbleSupremeCourt: getTextField(honbleSupremeCourtField)
    })
  });
};

export const courtCaseDetails = getCommonCard({
  header: courtCaseHeader,
  detailsContainer: getCommonContainer({
    multipleApplicantContainer: {
      uiFramework: "custom-atoms",
      componentPath: "Div",
      props: {
        style: {
          width: "100%"
        }
      },
      children: {
        multipleApplicantInfo: {
          uiFramework: "custom-containers-local",
          moduleName: "egov-estate",
          componentPath: "MultiItem",
          props: {
            scheama: commonCourtCaseInformation(),
            items: [],
            addItemLabel: {
              labelName: "Add Court Case",
              labelKey: "ES_COMMON_ADD_COURT_CASE_LABEL"
            },
            headerName: "Court Case",
            headerJsonPath:
              "children.cardContent.children.header.children.Court Case.props.label",
            sourceJsonPath: "Properties[0].propertyDetails.courtCases",
            prefixSourceJsonPath: "children.cardContent.children.courtCaseCard.children"
          },
          type: "array"
        }
      }
    }
  })
})