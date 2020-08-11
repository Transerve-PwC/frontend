import {
  getCommonCard,
  getSelectField,
  getTextField,
  getDateField,
  getCommonTitle,
  getPattern,
  getCommonContainer
} from "egov-ui-framework/ui-config/screens/specs/utils";
import {
  prepareFinalObject
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import {
  getTodaysDateInYMD
} from "../../utils";
import get from "lodash/get";

export const courtCaseHeader = getCommonTitle({
  labelName: "Court Case Details",
  labelKey: "EST_COURT_CASE_DETAILS_HEADER"
}, {
  style: {
    marginBottom: 18,
    marginTop: 18
  }
})

const estateOfficerCourtField = {
  label: {
      labelName: "Estate Officer Court",
      labelKey: "EST_ESTATE_OFFICER_COURT_LABEL"
  },
  placeholder: {
      labelName: "Enter Estate Officer Court",
      labelKey: "EST_ESTATE_OFFICER_COURT_PLACEHOLDER"
  },
  gridDefination: {
      xs: 12,
      sm: 6
  },
  maxLength: 250,
  jsonPath: "Properties[0].propertyDetails.courtCases[0].estateOfficerCourt"
}

const commissionersCourtField = {
  label: {
      labelName: "Commissioners Court",
      labelKey: "EST_COMMISSIONERS_COURT_LABEL"
  },
  placeholder: {
      labelName: "Enter Commissioners Court",
      labelKey: "EST_COMMISSIONERS_COURT_PLACEHOLDER"
  },
  gridDefination: {
      xs: 12,
      sm: 6
  },
  maxLength: 250,
  jsonPath: "Properties[0].propertyDetails.courtCases[0].commissionersCourt"
}

const chiefAdministratorsCourtField = {
  label: {
      labelName: "Chief Administrators Court",
      labelKey: "EST_CHIEF_ADMINISTRATORS_COURT_LABEL"
  },
  placeholder: {
      labelName: "Enter Chief Administrators Court",
      labelKey: "EST_CHIEF_ADMINISTRATORS_COURT_PLACEHOLDER"
  },
  gridDefination: {
      xs: 12,
      sm: 6
  },
  maxLength: 250,
  jsonPath: "Properties[0].propertyDetails.courtCases[0].chiefAdministartorsCourt"
}

const advisorToAdminCourtField = {
  label: {
      labelName: "Advisor to Admin Court",
      labelKey: "EST_ADVISOR_TO_ADMIN_COURT_LABEL"
  },
  placeholder: {
      labelName: "Enter Advisor to Admin Court",
      labelKey: "EST_ADVISOR_TO_ADMIN_COURT_PLACEHOLDER"
  },
  gridDefination: {
      xs: 12,
      sm: 6
  },
  maxLength: 250,
  jsonPath: "Properties[0].propertyDetails.courtCases[0].advisorToAdminCourt"
}

const honbleDistrictCourtField = {
  label: {
      labelName: "Hon'ble District Court",
      labelKey: "EST_HONBLE_DISTRICT_COURT_LABEL"
  },
  placeholder: {
      labelName: "Enter Hon'ble District Court",
      labelKey: "EST_HONBLE_DISTRICT_COURT_PLACEHOLDER"
  },
  gridDefination: {
      xs: 12,
      sm: 6
  },
  maxLength: 250,
  jsonPath: "Properties[0].propertyDetails.courtCases[0].honorableDistrictCourt"
}

const honbleHighCourtField = {
  label: {
      labelName: "Hon'ble High Court",
      labelKey: "EST_HONBLE_HIGH_COURT_LABEL"
  },
  placeholder: {
      labelName: "Enter Hon'ble High Court",
      labelKey: "EST_HONBLE_HIGH_COURT_PLACEHOLDER"
  },
  gridDefination: {
      xs: 12,
      sm: 6
  },
  maxLength: 250,
  jsonPath: "Properties[0].propertyDetails.courtCases[0].honorableHighCourt"
}

const honbleSupremeCourtField = {
  label: {
      labelName: "Hon'ble Supreme Court",
      labelKey: "EST_HONBLE_SUPREME_COURT_LABEL"
  },
  placeholder: {
      labelName: "Enter Hon'ble Supreme Court",
      labelKey: "EST_HONBLE_SUPREME_COURT_PLACEHOLDER"
  },
  gridDefination: {
      xs: 12,
      sm: 6
  },
  maxLength: 250,
  jsonPath: "Properties[0].propertyDetails.courtCases[0].honorableSupremeCourt"
}

export const courtCaseDetails = getCommonCard({
  header: courtCaseHeader,
  detailsContainer: getCommonContainer({
    estateOfficerCourt: getTextField(estateOfficerCourtField),
    commissionersCourt: getTextField(commissionersCourtField),
    chiefAdministratorsCourt: getTextField(chiefAdministratorsCourtField),
    advisorToAdminCourt: getTextField(advisorToAdminCourtField),
    honbleDistrictCourt: getTextField(honbleDistrictCourtField),
    honbleHighCourt: getTextField(honbleHighCourtField),
    honbleSupremeCourt: getTextField(honbleSupremeCourtField)
  })
})