import {
  getCommonCard,
  getSelectField,
  getTextField,
  getDateField,
  getCommonTitle,
  getPattern,
  getCommonContainer,
  getLabelWithValue
} from "egov-ui-framework/ui-config/screens/specs/utils";
import {
  prepareFinalObject
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import {
  getTodaysDateInYMD
} from "../../utils";
import get from "lodash/get";

const paymentHeader = getCommonTitle({
  labelName: "Payment Details",
  labelKey: "EST_PAYMENT_DETAILS_HEADER"
})

export const groundRentHeader = getCommonTitle({
  labelName: "Ground Rent Details",
  labelKey: "EST_GROUND_RENT_DETAILS_HEADER"
}, {
  style: {
    marginBottom: 18,
    marginTop: 18,
    width: "100%"
  }
})

const dueDateOfPaymentField = {
  label: {
    labelName: "Due Date of Payment",
    labelKey: "EST_DUE_DATE_OF_PAYMENT_LABEL"
  },
  pattern: getPattern("Date"),
  required: false,
  jsonPath: `Properties[0].propertyDetails.owners[0].ownerDetails.paymentDetails[0].grDueDateOfPayment`,
  props: {
    inputProps: {
      max: getTodaysDateInYMD()
    }
  }
}

const payableField = {
  label: {
    labelName: "Payable",
    labelKey: "EST_PAYABLE_LABEL"
  },
  placeholder: {
    labelName: "Enter Payable",
    labelKey: "EST_PAYABLE_PLACEHOLDER"
  },
  gridDefination: {
    xs: 12,
    sm: 6
  },
  required: false,
  maxLength: 15,
  jsonPath: `Properties[0].propertyDetails.owners[0].ownerDetails.paymentDetails[0].grPayable`
}

const amountOfGRField = {
  label: {
    labelName: "Amount of GR",
    labelKey: "EST_AMOUNT_OF_GR_LABEL"
  },
  placeholder: {
    labelName: "Enter Amount of GR",
    labelKey: "EST_AMOUNT_OF_GR_PLACEHOLDER"
  },
  gridDefination: {
    xs: 12,
    sm: 6
  },
  required: false,
  maxLength: 15,
  jsonPath: `Properties[0].propertyDetails.owners[0].ownerDetails.paymentDetails[0].grAmountOfGr`
}

const totalGRField = {
  label: {
    labelName: "Total GR",
    labelKey: "EST_TOTAL_GR_LABEL"
  },
  placeholder: {
    labelName: "Enter Total GR",
    labelKey: "EST_TOTAL_GR_PLACEHOLDER"
  },
  gridDefination: {
    xs: 12,
    sm: 6
  },
  required: false,
  maxLength: 15,
  jsonPath: `Properties[0].propertyDetails.owners[0].ownerDetails.paymentDetails[0].grTotalGr`
}

const dateOfDepositField = {
  label: {
    labelName: "Date of Deposit",
    labelKey: "EST_DATE_OF_DEPOSIT_LABEL"
  },
  pattern: getPattern("Date"),
  required: false,
  jsonPath: `Properties[0].propertyDetails.owners[0].ownerDetails.paymentDetails[0].grDateOfDeposit`,
  props: {
    inputProps: {
      max: getTodaysDateInYMD()
    }
  }
}

const delayInPaymentField = {
  label: {
    labelName: "Delay in Payment",
    labelKey: "EST_DELAY_IN_PAYMENT_LABEL"
  },
  placeholder: {
    labelName: "Enter Delay in Payment",
    labelKey: "EST_DELAY_IN_PAYMENT_PLACEHOLDER"
  },
  gridDefination: {
    xs: 12,
    sm: 6
  },
  required: false,
  maxLength: 15,
  jsonPath: `Properties[0].propertyDetails.owners[0].ownerDetails.paymentDetails[0].grDelayInPayment`
}

const interestForDelayField = {
  label: {
    labelName: "Interest For Delay",
    labelKey: "EST_INTEREST_FOR_DELAY_LABEL"
  },
  placeholder: {
    labelName: "Enter Interest For Delay",
    labelKey: "EST_INTEREST_FOR_DELAY_PLACEHOLDER"
  },
  gridDefination: {
    xs: 12,
    sm: 6
  },
  required: false,
  maxLength: 15,
  jsonPath: `Properties[0].propertyDetails.owners[0].ownerDetails.paymentDetails[0].grInterestForDelay`
}

const totalAmountDueWithInterestField = {
  label: {
    labelName: "Total Amount Due with Interest",
    labelKey: "EST_TOTAL_AMOUNT_DUE_WITH_INTEREST_LABEL"
  },
  placeholder: {
    labelName: "Enter Total Amount Due with Interest",
    labelKey: "EST_TOTAL_AMOUNT_DUE_WITH_INTEREST_PLACEHOLDER"
  },
  gridDefination: {
    xs: 12,
    sm: 6
  },
  required: false,
  maxLength: 15,
  jsonPath: `Properties[0].propertyDetails.owners[0].ownerDetails.paymentDetails[0].grTotalAmountDueWithInterest`
}

const amountDepositedGRField = {
  label: {
    labelName: "Amount Desposited GR",
    labelKey: "EST_AMOUNT_DEPOSITED_GR_LABEL"
  },
  placeholder: {
    labelName: "Enter Amount Desposited GR",
    labelKey: "EST_AMOUNT_DEPOSITED_GR_PLACEHOLDER"
  },
  gridDefination: {
    xs: 12,
    sm: 6
  },
  required: false,
  maxLength: 15,
  jsonPath: `Properties[0].propertyDetails.owners[0].ownerDetails.paymentDetails[0].grAmountDepositedGr`
}

const amountDepositedInttField = {
  label: {
    labelName: "Amount Desposited Intt",
    labelKey: "EST_AMOUNT_DEPOSITED_INTT_LABEL"
  },
  placeholder: {
    labelName: "Enter Amount Desposited Intt",
    labelKey: "EST_AMOUNT_DEPOSITED_INTT_PLACEHOLDER"
  },
  gridDefination: {
    xs: 12,
    sm: 6
  },
  required: false,
  maxLength: 15,
  jsonPath: `Properties[0].propertyDetails.owners[0].ownerDetails.paymentDetails[0].grAmountDepositedIntt`
}

const balanceGRField = {
  label: {
    labelName: "Balance(+due, -excess) GR",
    labelKey: "EST_BALANCE_GR_LABEL"
  },
  placeholder: {
    labelName: "Enter Balance(+due, -excess) GR",
    labelKey: "EST_BALANCE_GR_PLACEHOLDER"
  },
  gridDefination: {
    xs: 12,
    sm: 6
  },
  required: false,
  maxLength: 15,
  jsonPath: `Properties[0].propertyDetails.owners[0].ownerDetails.paymentDetails[0].grBalanceGr`
}

const balanceInttField = {
  label: {
    labelName: "Balance(+due, -excess) Intt",
    labelKey: "EST_BALANCE_INTT_LABEL"
  },
  placeholder: {
    labelName: "Enter Balance(+due, -excess) Intt",
    labelKey: "EST_BALANCE_INTT_PLACEHOLDER"
  },
  gridDefination: {
    xs: 12,
    sm: 6
  },
  required: false,
  maxLength: 15,
  jsonPath: `Properties[0].propertyDetails.owners[0].ownerDetails.paymentDetails[0].grBalanceIntt`
}

const totalDueField = {
  label: {
    labelName: "Total Due",
    labelKey: "EST_TOTAL_DUE_LABEL"
  },
  placeholder: {
    labelName: "Enter Total Due",
    labelKey: "EST_TOTAL_DUE_PLACEHOLDER"
  },
  gridDefination: {
    xs: 12,
    sm: 6
  },
  required: false,
  maxLength: 15,
  jsonPath: `Properties[0].propertyDetails.owners[0].ownerDetails.paymentDetails[0].grTotalDue`
}

const receiptNumberField = {
  label: {
    labelName: "Receipt No.",
    labelKey: "EST_RECEIPT_NUMBER_LABEL"
  },
  placeholder: {
    labelName: "Enter Receipt No.",
    labelKey: "EST_RECEIPT_NUMBER_PLACEHOLDER"
  },
  gridDefination: {
    xs: 12,
    sm: 6
  },
  required: false,
  maxLength: 75,
  jsonPath: `Properties[0].propertyDetails.owners[0].ownerDetails.paymentDetails[0].grReceiptNumber`
}

const receiptDateField = {
  label: {
    labelName: "Receipt Date",
    labelKey: "EST_RECEIPT_DATE_LABEL"
  },
  pattern: getPattern("Date"),
  required: false,
  jsonPath: `Properties[0].propertyDetails.owners[0].ownerDetails.paymentDetails[0].grReceiptDate`,
  props: {
    inputProps: {
      max: getTodaysDateInYMD()
    }
  }
}

export const groundRentDetails_0 = getCommonCard({
  header: groundRentHeader,
  detailsContainer: getCommonContainer({
    dueDateOfPayment: getDateField(dueDateOfPaymentField),
    payable: getTextField(payableField),
    amountOfGR: getTextField(amountOfGRField),
    totalGR: getTextField(totalGRField),
    dateOfDeposit: getDateField(dateOfDepositField),
    delayInPayment: getTextField(delayInPaymentField),
    interestForDelay: getTextField(interestForDelayField),
    totalAmountDueWithInterest: getTextField(totalAmountDueWithInterestField),
    amountDepositedGR: getTextField(amountDepositedGRField),
    amountDepositedIntt: getTextField(amountDepositedInttField),
    balanceGR: getTextField(balanceGRField),
    balanceIntt: getTextField(balanceInttField),
    totalDue: getTextField(totalDueField),
    receiptNumber: getTextField(receiptNumberField),
    receiptDate: getDateField(receiptDateField)
  })
})

export const serviceTaxHeader = getCommonTitle({
  labelName: "Service Tax/GST Details",
  labelKey: "EST_SERVICE_TAX_DETAILS_HEADER"
}, {
  style: {
    marginBottom: 18,
    marginTop: 18,
    width: "100%"
  }
})

const rateOfStOrGstFieldST = {
  label: {
    labelName: "Rate of ST/GST",
    labelKey: "EST_RATE_ST_GST_LABEL"
  },
  placeholder: {
    labelName: "Enter Rate of ST/GST",
    labelKey: "EST_RATE_ST_GST_PLACEHOLDER"
  },
  gridDefination: {
    xs: 12,
    sm: 6
  },
  required: false,
  maxLength: 15,
  jsonPath: `Properties[0].propertyDetails.owners[0].ownerDetails.paymentDetails[0].stRateOfStGst`
}

const amountOfGstFieldST = {
  label: {
    labelName: "Amount Of GST",
    labelKey: "EST_AMOUNT_OF_GST_LABEL"
  },
  placeholder: {
    labelName: "Enter Amount Of GST",
    labelKey: "EST_AMOUNT_OF_GST_PLACEHOLDER"
  },
  gridDefination: {
    xs: 12,
    sm: 6
  },
  required: false,
  maxLength: 15,
  jsonPath: `Properties[0].propertyDetails.owners[0].ownerDetails.paymentDetails[0].stAmountOfGst`
}

const amountDueFieldST = {
  label: {
    labelName: "Amount Due",
    labelKey: "EST_AMOUNT_DUE_LABEL"
  },
  placeholder: {
    labelName: "Enter Amount Due",
    labelKey: "EST_AMOUNT_DUE_PLACEHOLDER"
  },
  gridDefination: {
    xs: 12,
    sm: 6
  },
  required: false,
  maxLength: 15,
  jsonPath: `Properties[0].propertyDetails.owners[0].ownerDetails.paymentDetails[0].stAmountDue`
}

const dateOfDepositFieldST = {
  label: {
    labelName: "Date of Deposit",
    labelKey: "EST_DATE_OF_DEPOSIT_LABEL"
  },
  pattern: getPattern("Date"),
  required: false,
  jsonPath: `Properties[0].propertyDetails.owners[0].ownerDetails.paymentDetails[0].stDateOfDeposit`,
  props: {
    inputProps: {
      max: getTodaysDateInYMD()
    }
  }
}

const delayInPaymentFieldST = {
  label: {
    labelName: "Delay in Payment",
    labelKey: "EST_DELAY_IN_PAYMENT_LABEL"
  },
  placeholder: {
    labelName: "Enter Delay in Payment",
    labelKey: "EST_DELAY_IN_PAYMENT_PLACEHOLDER"
  },
  gridDefination: {
    xs: 12,
    sm: 6
  },
  required: false,
  maxLength: 15,
  jsonPath: `Properties[0].propertyDetails.owners[0].ownerDetails.paymentDetails[0].stDelayInPayment`
}

const interestForDelayFieldST = {
  label: {
    labelName: "Interest For Delay",
    labelKey: "EST_INTEREST_FOR_DELAY_LABEL"
  },
  placeholder: {
    labelName: "Enter Interest For Delay",
    labelKey: "EST_INTEREST_FOR_DELAY_PLACEHOLDER"
  },
  gridDefination: {
    xs: 12,
    sm: 6
  },
  required: false,
  maxLength: 15,
  jsonPath: `Properties[0].propertyDetails.owners[0].ownerDetails.paymentDetails[0].stInterestForDelay`
}

const totalAmountDueWithInterestFieldST = {
  label: {
    labelName: "Total Amount Due with Interest",
    labelKey: "EST_TOTAL_AMOUNT_DUE_WITH_INTEREST_LABEL"
  },
  placeholder: {
    labelName: "Enter Total Amount Due with Interest",
    labelKey: "EST_TOTAL_AMOUNT_DUE_WITH_INTEREST_PLACEHOLDER"
  },
  gridDefination: {
    xs: 12,
    sm: 6
  },
  required: false,
  maxLength: 15,
  jsonPath: `Properties[0].propertyDetails.owners[0].ownerDetails.paymentDetails[0].stTotalAmountDueWithInterest`
}

const amountDepositedFieldST = {
  label: {
    labelName: "Amount Deposited ST/GST",
    labelKey: "EST_AMOUNT_DEPOSITED_ST_LABEL"
  },
  placeholder: {
    labelName: "Enter Amount Deposited ST/GST",
    labelKey: "EST_AMOUNT_DEPOSITED_ST_PLACEHOLDER"
  },
  gridDefination: {
    xs: 12,
    sm: 6
  },
  required: false,
  maxLength: 15,
  jsonPath: `Properties[0].propertyDetails.owners[0].ownerDetails.paymentDetails[0].stAmountDepositedStGst`
}

const amountDepositedInttFieldST = {
  label: {
    labelName: "Amount Deposited Intt",
    labelKey: "EST_AMOUNT_DEPOSITED_INTT_ST_LABEL"
  },
  placeholder: {
    labelName: "Enter Amount Deposited Intt",
    labelKey: "EST_AMOUNT_DEPOSITED_INTT_ST_PLACEHOLDER"
  },
  gridDefination: {
    xs: 12,
    sm: 6
  },
  required: false,
  maxLength: 15,
  jsonPath: `Properties[0].propertyDetails.owners[0].ownerDetails.paymentDetails[0].stAmountDepositedIntt`
}

const balanceFieldST = {
  label: {
    labelName: "Balance ST/GST",
    labelKey: "EST_BALANCE_ST_LABEL"
  },
  placeholder: {
    labelName: "Enter Balance ST/GST",
    labelKey: "EST_BALANCE_ST_PLACEHOLDER"
  },
  gridDefination: {
    xs: 12,
    sm: 6
  },
  required: false,
  maxLength: 15,
  jsonPath: `Properties[0].propertyDetails.owners[0].ownerDetails.paymentDetails[0].stBalanceStGst`
}

const balanceInttFieldST = {
  label: {
    labelName: "Balance Intt",
    labelKey: "EST_BALANCE_INTT_LABEL"
  },
  placeholder: {
    labelName: "Enter Balance Intt",
    labelKey: "EST_BALANCE_INTT_PLACEHOLDER"
  },
  gridDefination: {
    xs: 12,
    sm: 6
  },
  required: false,
  maxLength: 15,
  jsonPath: `Properties[0].propertyDetails.owners[0].ownerDetails.paymentDetails[0].stBalanceIntt`
}

const totalDueFieldST = {
  label: {
    labelName: "Total Due",
    labelKey: "EST_TOTAL_DUE_LABEL"
  },
  placeholder: {
    labelName: "Enter Total Due",
    labelKey: "EST_TOTAL_DUE_PLACEHOLDER"
  },
  gridDefination: {
    xs: 12,
    sm: 6
  },
  required: false,
  maxLength: 15,
  jsonPath: `Properties[0].propertyDetails.owners[0].ownerDetails.paymentDetails[0].stTotalDue`
}

const receiptNumberFieldST = {
  label: {
    labelName: "Receipt No.",
    labelKey: "EST_RECEIPT_NUMBER_LABEL"
  },
  placeholder: {
    labelName: "Enter Receipt No.",
    labelKey: "EST_RECEIPT_NUMBER_PLACEHOLDER"
  },
  gridDefination: {
    xs: 12,
    sm: 6
  },
  required: false,
  maxLength: 75,
  jsonPath: `Properties[0].propertyDetails.owners[0].ownerDetails.paymentDetails[0].stReceiptNumber`
}

const receiptDateFieldST = {
  label: {
    labelName: "Receipt Date",
    labelKey: "EST_RECEIPT_DATE_LABEL"
  },
  pattern: getPattern("Date"),
  required: false,
  jsonPath: `Properties[0].propertyDetails.owners[0].ownerDetails.paymentDetails[0].stReceiptDate`,
  props: {
    inputProps: {
      max: getTodaysDateInYMD()
    }
  }
}

export const serviceTaxDetails_0 = getCommonCard({
  header: serviceTaxHeader,
  detailsContainer: getCommonContainer({
    rateOfStOrGst: getTextField(rateOfStOrGstFieldST),
    amountOfGst: getTextField(amountOfGstFieldST),
    amountDue: getTextField(amountDueFieldST),
    dateOfDeposit: getDateField(dateOfDepositFieldST),
    delayInPayment: getTextField(delayInPaymentFieldST),
    interestForDelay: getTextField(interestForDelayFieldST),
    totalAmountDueWithInterest: getTextField(totalAmountDueWithInterestFieldST),
    amountDepositedSt: getTextField(amountDepositedFieldST),
    amountDepositedIntt: getTextField(amountDepositedInttFieldST),
    balanceSt: getTextField(balanceFieldST),
    balanceIntt: getTextField(balanceInttFieldST),
    totalDue: getTextField(totalDueFieldST),
    receiptNumber: getTextField(receiptNumberFieldST),
    receiptDate: getDateField(receiptDateFieldST)
  })
})

const paymentMadeByField = {
  label: {
    labelName: "Payment Made By",
    labelKey: "EST_PAYMENT_MADE_BY_LABEL"
  },
  placeholder: {
    labelName: "Enter Payment Made By",
    labelKey: "EST_PAYMENT_MADE_BY_PLACEHOLDER"
  },
  gridDefination: {
    xs: 12,
    sm: 6
  },
  props: {
    disabled: true
  },
  required: false,
  maxLength: 15,
  jsonPath: `Properties[0].propertyDetails.owners[0].ownerDetails.paymentDetails[0].stPaymentMadeBy`
}

export const paymentMadeBy_0 = getCommonCard({
  detailsContainer: getCommonContainer({
    paymentMadeBy: getTextField(paymentMadeByField)
  })
})

// export const getPaymentDetails = (owner) => {
//   return getCommonCard({
//     header: paymentHeader,
//     groundRentContainer: getCommonContainer({
//       // header: groundRentHeader,
//       dueDateOfPayment: getDateField(dueDateOfPaymentField(owner)),
//       payable: getTextField(payableField(owner)),
//       amountOfGR: getTextField(amountOfGRField(owner)),
//       totalGR: getTextField(totalGRField(owner)),
//       dateOfDeposit: getDateField(dateOfDepositField(owner)),
//       delayInPayment: getTextField(delayInPaymentField(owner)),
//       interestForDelay: getTextField(interestForDelayField(owner)),
//       totalAmountDueWithInterest: getTextField(totalAmountDueWithInterestField(owner)),
//       amountDepositedGR: getTextField(amountDepositedGRField(owner)),
//       amountDepositedIntt: getTextField(amountDepositedInttField(owner)),
//       balanceGR: getTextField(balanceGRField(owner)),
//       balanceIntt: getTextField(balanceInttField(owner)),
//       totalDue: getTextField(totalDueField(owner)),
//       receiptNumberAndDate: getTextField(receiptNumberAndDateField(owner))
//     }),
//     serviceTaxContainer: getCommonContainer({
//       // header: serviceTaxHeader,
//       rateOfStOrGst: getTextField(rateOfStOrGstFieldST()),
//       amountOfGst: getTextField(amountOfGstFieldST()),
//       amountDue: getTextField(amountDueFieldST()),
//       dateOfDeposit: getDateField(dateOfDepositFieldST()),
//       delayInPayment: getTextField(delayInPaymentFieldST()),
//       interestForDelay: getTextField(interestForDelayFieldST()),
//       totalAmountDueWithInterest: getTextField(totalAmountDueWithInterestFieldST()),
//       amountDepositedSt: getTextField(amountDepositedFieldST()),
//       amountDepositedIntt: getTextField(amountDepositedInttFieldST()),
//       balanceSt: getTextField(balanceFieldST()),
//       balanceIntt: getTextField(balanceInttFieldST()),
//       totalDue: getTextField(totalDueFieldST()),
//       receiptNumberAndDate: getTextField(receiptNumberAndDateFieldST())
//     }),
//     paymentMadeByContainer: getCommonContainer({
//       paymentMadeBy: getTextField(paymentMadeByField())
//     })
//   })
// }