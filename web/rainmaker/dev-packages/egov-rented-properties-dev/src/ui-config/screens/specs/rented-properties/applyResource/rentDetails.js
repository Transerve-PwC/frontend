import { getCommonCard, getSelectField, getTextField, getDateField, getCommonTitle, getPattern, getCommonContainer } from "egov-ui-framework/ui-config/screens/specs/utils";

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

const revisedPeriodField = {
    label: {
        labelName: "Rent Amount Revised Period",
        labelKey: "RP_RENT_AMOUNT_REVISED_PERIOD_LABEL"
    },
    placeholder: {
        labelName: "Enter Rent Amount Revised Period",
        labelKey: "RP_RENT_AMOUNT_REVISED_PERIOD_PLACEHOLDER"
    },
    gridDefination: {
        xs: 12,
        sm: 6
    },
    minLength: 1,
    maxLength: 5,
    required: true,
    jsonPath: "Properties[0].owners[0].ownerDetails.revisionPeriod",
    errorMessage: "RP_ERR_REVISED_PERIOD_FIELD",
  }

const revisedPercentageField = {
    label: {
        labelName: "Rent Amount Revision Percentage",
        labelKey: "RP_RENT_AMOUNT_REVISED_PERCENTAGE_LABEL"
    },
    placeholder: {
        labelName: "Enter Rent Amount Revised Percentage",
        labelKey: "RP_RENT_AMOUNT_REVISED_PERCENTAGE_PLACEHOLDER"
    },
    gridDefination: {
        xs: 12,
        sm: 6
    },
    minLength: 1,
    maxLength: 3,
    required: true,
    jsonPath: "Properties[0].owners[0].ownerDetails.revisionPercentage",
    errorMessage: "RP_ERR_REVISED_PERCENTAGE_FIELD",
  }

const getRentDetails = () => {
    return {
        header: rentHeader,
        detailsContainer: getCommonContainer({
            rentAmount: getTextField(rentAmountField),
            revisedPeriod: getTextField(revisedPeriodField),
            revisedPercentage: getTextField(revisedPercentageField)
        })
    }
}

export const rentDetails = getCommonCard(getRentDetails())