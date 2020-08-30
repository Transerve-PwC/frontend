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
import {
  prepareFinalObject
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import {
  getTodaysDateInYMD,
  getRentSummaryCard
} from "../../utils";
import get from "lodash/get";

const rentSummaryHeader = getCommonTitle({
  labelName: "Rent Summary",
  labelKey: "RP_RENT_SUMMARY_HEADER"
}, {
  style: {
    marginBottom: 18,
    marginTop: 18
  }
})

const paymentInfoHeader = getCommonTitle({
  labelName: "Payment Info",
  labelKey: "RP_PAYMENT_INFO_HEADER"
}, {
  style: {
    marginBottom: 18,
    marginTop: 18
  }
})

const amountField = {
  label: {
    labelName: "Amount",
    labelKey: "RP_AMOUNT_LABEL"
  },
  placeholder: {
    labelName: "Please Enter Amount",
    labelKey: "RP_ENTER_AMOUNT_PLACEHOLDER"
  },
  gridDefination: {
    xs: 12,
    sm: 6
  },
  required: true,
  minLength: 4,
  maxLength: 40,
  jsonPath: "OfflineRentPayment[0].paymentInfo.amount",
  errorMessage: ""
}

const bankNameField = {
  label: {
    labelName: "Bank Name",
    labelKey: "RP_BANK_NAME_LABEL"
  },
  placeholder: {
    labelName: "Please Enter Bank Name",
    labelKey: "RP_ENTER_BANK_NAME_PLACEHOLDER"
  },
  gridDefination: {
    xs: 12,
    sm: 6
  },
  required: true,
  maxLength: 40,
  jsonPath: "",
  errorMessage: "OfflineRentPayment[0].paymentInfo.bankName"
}

const transactionNumberField = {
  label: {
    labelName: "Transaction/Cheque/DD No",
    labelKey: "RP_TRANSACTION_NUMBER_LABEL"
  },
  placeholder: {
    labelName: "Please Enter Transaction/Cheque/DD No",
    labelKey: "RP_ENTER_TRANSACTION_NUMBER_PLACEHOLDER"
  },
  gridDefination: {
    xs: 12,
    sm: 6
  },
  required: true,
  maxLength: 40,
  jsonPath: "OfflineRentPayment[0].paymentInfo.transactionNumber",
  errorMessage: ""
}

const rentSummary = getCommonGrayCard({
  rentSection: getRentSummaryCard({
    sourceJsonPath: "OfflineRentPayment[0].rentSummary"
  })
});



const getRentSummaryDetails = () => {
  return {
    header: rentSummaryHeader,
    detailsContainer: rentSummary
  }
}
const getPaymentInfo = () => {
  return {
    header: paymentInfoHeader,
    detailsContainer: getCommonContainer({
      amount: getTextField(amountField),
      bankName: getTextField(bankNameField),
      transactionNumber: getTextField(transactionNumberField)
    })
  }
}


export const rentSummaryDetails = getCommonCard(getRentSummaryDetails())
export const paymentInfo = getCommonCard(getPaymentInfo())