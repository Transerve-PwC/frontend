import { getCommonCard, getSelectField, getTextField, getDateField, getCommonTitle, getPattern, getCommonContainer } from "egov-ui-framework/ui-config/screens/specs/utils";
import { handleScreenConfigurationFieldChange as handleField } from "egov-ui-framework/ui-redux/screen-configuration/actions";
const rentHeader =  getCommonTitle(
    {
        labelName: "Rent Details",
        labelKey: "RP_RENT_DETAILS_HEADER"
    },
    {
        style: {
                marginBottom: 18,
                marginTop: 18
        }
    }
  )

const rentAmountField = {
    label: {
        labelName: "Monthly Rent Amount",
        labelKey: "RP_MONTHLY_RENT_LABEL"
    },
    placeholder: {
        labelName: "Enter Monthly Rent Amount",
        labelKey: "RP_MONTHLY_RENT_PLACEHOLDER"
    },
    gridDefination: {
        xs: 12,
        sm: 6
    },
    minLength: 1,
    maxLength: 5,
    required: true,
    jsonPath: "Properties[0].owners[0].ownerDetails.monthlyRent",
    errorMessage: "RP_ERR_RENT_AMOUNT_FIELD",
  }

const interestRateField = {
    label: {
        labelName: "Interest Rate/Year",
        labelKey: "RP_INTEREST_RATE_PER_YEAR_LABEL"
    },
    placeholder: {
        labelName: "Enter Interest Rate/Year",
        labelKey: "RP_INTEREST_RATE_PER_YEAR_PLACEHOLDER"
    },
    gridDefination: {
        xs: 12,
        sm: 6
    },
    // minLength: 1,
    //maxLength: 5,
    pattern:getPattern("twodigit-number"),
    required: true,
    jsonPath: "Properties[0].propertyDetails.interestRate",
    errorMessage: "RP_ERR_INTEREST_RATE_OR_YEAR_FIELD",
    afterFieldChange: (action, state, dispatch) => {
        if (action.value.length > 2) {
            dispatch(
                handleField(
                  "apply",
                  action.componentJsonpath,
                  "errorMessage",
                  "RP_ERR_INTEREST_RATE_OR_YEAR_FIELD_MAXLENGTH"
                )
            )
            dispatch(
                handleField(
                  "apply",
                  action.componentJsonpath,
                  "props.errorMessage",
                  "RP_ERR_INTEREST_RATE_OR_YEAR_FIELD_MAXLENGTH"
                )
            )
        }
        else {
            dispatch(
                handleField(
                  "apply",
                  action.componentJsonpath,
                  "errorMessage",
                  "RP_ERR_INTEREST_RATE_OR_YEAR_FIELD"
                )
            )
            dispatch(
                handleField(
                  "apply",
                  action.componentJsonpath,
                  "props.errorMessage",
                  "RP_ERR_INTEREST_RATE_OR_YEAR_FIELD"
                )
            )
        }
      }
}

const rentIncrementPeriodField = {
    label: {
        labelName: "Rent Increment Period(in years)",
        labelKey: "RP_RENT_INCREMENT_PERIOD_LABEL"
    },
    placeholder: {
        labelName: "Enter Rent Increment Period(in years)",
        labelKey: "RP_RENT_INCREMENT_PERIOD_PLACEHOLDER"
    },
    gridDefination: {
        xs: 12,
        sm: 6
    },
    // minLength: 1,
    // maxLength: 2,
    pattern:getPattern("twodigit-number-without-zero"),
    required: true,
    jsonPath: "Properties[0].propertyDetails.rentIncrementPeriod",
    errorMessage: "RP_ERR_RENT_INCREMENT_PERIOD_FIELD",
    afterFieldChange: (action, state, dispatch) => {
        if (action.value.length > 2) {
            dispatch(
                handleField(
                  "apply",
                  action.componentJsonpath,
                  "errorMessage",
                  "RP_ERR_RENT_INCREMENT_PERIOD_FIELD_MAXLENGTH"
                )
            )
            dispatch(
                handleField(
                  "apply",
                  action.componentJsonpath,
                  "props.errorMessage",
                  "RP_ERR_RENT_INCREMENT_PERIOD_FIELD_MAXLENGTH"
                )
            )
        }
        else {
            dispatch(
                handleField(
                  "apply",
                  action.componentJsonpath,
                  "errorMessage",
                  "RP_ERR_RENT_INCREMENT_PERIOD_FIELD"
                )
            )
            dispatch(
                handleField(
                  "apply",
                  action.componentJsonpath,
                  "props.errorMessage",
                  "RP_ERR_RENT_INCREMENT_PERIOD_FIELD"
                )
            )
        }
      }
  }

const rentIncrementPercentageField = {
    label: {
        labelName: "Rent Increment Percentage",
        labelKey: "RP_RENT_INCREMENT_PERCENTAGE_LABEL"
    },
    placeholder: {
        labelName: "Enter Rent Increment Percentage",
        labelKey: "RP_RENT_INCREMENT_PERCENTAGE_PLACEHOLDER"
    },
    gridDefination: {
        xs: 12,
        sm: 6
    },
    // minLength: 1,
    //maxLength: 3,
    pattern:getPattern("interestRate"),
    required: true,
    jsonPath: "Properties[0].propertyDetails.rentIncrementPercentage",
    errorMessage: "RP_ERR_RENT_INCREMENT_PERCENTAGE_FIELD",
  }

const getRentDetails = () => {
    return {
        header: rentHeader,
        detailsContainer: getCommonContainer({
            interestRatePerYear: getTextField(interestRateField),
            rentIncrementPeriod: getTextField(rentIncrementPeriodField),
            rentIncrementPercentage: getTextField(rentIncrementPercentageField)
        })
    }
}

export const rentDetails = getCommonCard(getRentDetails())