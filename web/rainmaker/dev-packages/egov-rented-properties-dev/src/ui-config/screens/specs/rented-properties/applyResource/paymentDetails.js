import { getCommonCard, getSelectField, getTextField, getDateField, getCommonTitle, getPattern, getCommonContainer } from "egov-ui-framework/ui-config/screens/specs/utils";
import { getTodaysDateInYMD } from "../../utils";

const paymentHeader = getCommonTitle(
    {
        labelName: "Payment Details",
        labelKey: "RP_PAYMENT_DETAILS_HEADER"
    },
    {
        style: {
                marginBottom: 18,
                marginTop: 18
        }
    }
  )

const paymentAmountField = {
    label: {
        labelName: "Payment Amount",
        labelKey: "RP_PAYMENT_AMOUNT_LABEL"
    },
    placeholder: {
        labelName: "Enter Payment Amount",
        labelKey: "RP_PAYMENT_AMOUNT"
    },
    gridDefination: {
        xs: 12,
        sm: 6
    },
    // minLength: 1,
    // maxLength: 100,
    // required: true,
    jsonPath: "Properties[0].owners[0].ownerDetails.payment[0].amountPaid"
  }

const paymentDateField = {
    label: {
        labelName: "Date of Payment",
        labelKey: "RP_DATE_PAYMENT_LABEL"
    },
    placeholder: {
        labelName: "Enter Date of Payment",
        labelKey: "RP_DATE_PAYEMNT_PLACEHOLDER"
    },
    // required: true,
    pattern: getPattern("Date"),
    jsonPath: "Properties[0].owners[0].ownerDetails.payment[0].paymentDate",
    props: {
        inputProps: {
            max: getTodaysDateInYMD()
        }
    }
  }

const paymentModeField = {
    label: {
        labelName: "Payment Mode",
        labelKey: "RP_PAYMENT_MODE_LABEL"
    },
    placeholder: {
        labelName: "Enter Payment Mode",
        labelKey: "RP_PAYMENT_MODE_PLACEHOLDER"
    },
    gridDefination: {
        xs: 12,
        sm: 6
    },
    // minLength: 1,
    // maxLength: 100,
    // required: true,
    jsonPath: "Properties[0].owners[0].ownerDetails.payment[0].paymentMode"
  }


  
 

const getPaymentDetails = () => {
    return {
        header: paymentHeader,
        detailsContainer: getCommonContainer({
            paymentAmount: getTextField(paymentAmountField),
            paymentDate: getDateField(paymentDateField),
            paymentMode: getTextField(paymentModeField)
        })
    }
}



export const paymentDetails = getCommonCard(getPaymentDetails())
