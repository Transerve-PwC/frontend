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
import { _getPattern } from "../../utils/";
import { applyEstates } from "../../../../../ui-utils/apply"

const documentList = {
  uiFramework: "custom-containers-local",
  moduleName: "egov-estate",
  componentPath: "DocumentListContainer",
  props: {
    buttonLabel: {
      labelName: "UPLOAD FILE",
      labelKey: "ES_BUTTON_UPLOAD_FILE"
    },
    inputProps: [],
    documentTypePrefix: "ES_",
    documentsJsonPath: "PropertiesTemp[0].propertyDetails.accountStatementDocument",
    uploadedDocumentsJsonPath: "PropertiesTemp[0].propertyDetails.accountStatementUploadedDocInRedux",
    tenantIdJsonPath: "Properties[0].tenantId",
    removedJsonPath: "PropertiesTemp[0].propertyDetails.accountStatementRemovedDoc",
    // callBack: applyEstates,
    // activeIndex: 8
    // excelUrl: "/est-services/auctions/_parse?"
  }
};

export const documentDetails = getCommonCard({
  header: getCommonTitle(
    {
      labelName: "Upload Legacy Account Statement",
      labelKey: "ES_UPLOAD_LEGACY_ACCOUNT_STMT_HEADER"
    },
    {
      style: {
        marginBottom: "18px"
      }
    }
  ),
  // paragraph: getCommonParagraph({
  //   labelName:
  //     "Only one file can be uploaded for one document. If multiple files need to be uploaded then please combine all files in a pdf and then upload",
  //   labelKey: "ES_NEW-UPLOAD-DOCS_SUBHEADER"
  // }),
  documentList
})

const paymentHeader = getCommonTitle({
  labelName: "Consolidated Payment Details",
  labelKey: "ES_CONSOLIDATED_PAYMENT_DETAILS_HEADER"
})

const rentField = {
  label: {
    labelName: "Consolidated Rent",
    labelKey: "ES_CONSOLIDATED_RENT_LABEL"
  },
  placeholder: {
    labelName: "Enter Consolidated Rent",
    labelKey: "ES_CONSOLIDATED_RENT_PLACEHOLDER"
  },
  gridDefination: {
    xs: 12,
    sm: 6
  },
  pattern: _getPattern("areaOfProperty"),
  required: true,
  jsonPath: `Properties[0].propertyDetails.estateDemands[0].rent`
}

const gstField = {
  label: {
    labelName: "Consolidated GST",
    labelKey: "ES_CONSOLIDATED_GST_LABEL"
  },
  placeholder: {
    labelName: "Enter Consolidated GST",
    labelKey: "ES_CONSOLIDATED_GST_PLACEHOLDER"
  },
  gridDefination: {
    xs: 12,
    sm: 6
  },
  pattern: _getPattern("areaOfProperty"),
  required: true,
  jsonPath: `Properties[0].propertyDetails.estateDemands[0].gst`
}

const interestOnRentField = {
  label: {
    labelName: "Consolidated Interest on Rent",
    labelKey: "ES_CONSOLIDATED_INTEREST_ON_RENT_LABEL"
  },
  placeholder: {
    labelName: "Enter Consolidated Interest on Rent",
    labelKey: "ES_CONSOLIDATED_INTEREST_ON_RENT_PLACEHOLDER"
  },
  gridDefination: {
    xs: 12,
    sm: 6
  },
  pattern: _getPattern("areaOfProperty"),
  required: true,
  jsonPath: `Properties[0].propertyDetails.estateDemands[0].penaltyInterest`
}

const interestOnGstField = {
  label: {
    labelName: "Consolidated Interest on GST",
    labelKey: "ES_CONSOLIDATED_INTEREST_ON_GST_LABEL"
  },
  placeholder: {
    labelName: "Enter Consolidated Interest on GST",
    labelKey: "ES_CONSOLIDATED_INTEREST_ON_GST_PLACEHOLDER"
  },
  gridDefination: {
    xs: 12,
    sm: 6
  },
  pattern: _getPattern("areaOfProperty"),
  required: true,
  jsonPath: `Properties[0].propertyDetails.estateDemands[0].gstInterest`
}

const consolidatedTillField = {
  label: {
    labelName: "Consolidated Till",
    labelKey: "ES_CONSOLIDATED_TILL_LABEL"
  },
  pattern: _getPattern("Date"),
  required: true,
  jsonPath: `Properties[0].propertyDetails.estateDemands[0].generationDate`,
  props: {
    inputProps: {
      max: getTodaysDateInYMD()
    }
  }
}

export const paymentDetails = getCommonCard({
  header: paymentHeader,
  detailsContainer: getCommonContainer({
    rent: getTextField(rentField),
    gst: getTextField(gstField),
    interestOnRent: getTextField(interestOnRentField),
    interestOnGst: getTextField(interestOnGstField),
    consolidatedTill: getDateField(consolidatedTillField)
  })
})

/* export const groundRentHeader = getCommonTitle({
  labelName: "Ground Rent Details",
  labelKey: "ES_GROUND_RENT_DETAILS_HEADER"
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
    labelKey: "ES_DUE_DATE_OF_PAYMENT_LABEL"
  },
  pattern: getPattern("Date"),
  // required: true,
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
    labelKey: "ES_PAYABLE_LABEL"
  },
  placeholder: {
    labelName: "Enter Payable",
    labelKey: "ES_PAYABLE_PLACEHOLDER"
  },
  gridDefination: {
    xs: 12,
    sm: 6
  },
  // required: true,
  maxLength: 15,
  jsonPath: `Properties[0].propertyDetails.owners[0].ownerDetails.paymentDetails[0].grPayable`
}

const amountOfGRField = {
  label: {
    labelName: "Amount of GR",
    labelKey: "ES_AMOUNT_OF_GR_LABEL"
  },
  placeholder: {
    labelName: "Enter Amount of GR",
    labelKey: "ES_AMOUNT_OF_GR_PLACEHOLDER"
  },
  gridDefination: {
    xs: 12,
    sm: 6
  },
  // required: true,
  maxLength: 15,
  jsonPath: `Properties[0].propertyDetails.owners[0].ownerDetails.paymentDetails[0].grAmountOfGr`
}

const totalGRField = {
  label: {
    labelName: "Total GR",
    labelKey: "ES_TOTAL_GR_LABEL"
  },
  placeholder: {
    labelName: "Enter Total GR",
    labelKey: "ES_TOTAL_GR_PLACEHOLDER"
  },
  gridDefination: {
    xs: 12,
    sm: 6
  },
  // required: true,
  maxLength: 15,
  jsonPath: `Properties[0].propertyDetails.owners[0].ownerDetails.paymentDetails[0].grTotalGr`
}

const dateOfDepositField = {
  label: {
    labelName: "Date of Deposit",
    labelKey: "ES_DATE_OF_DEPOSIT_LABEL"
  },
  pattern: getPattern("Date"),
  // required: true,
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
    labelKey: "ES_DELAY_IN_PAYMENT_LABEL"
  },
  placeholder: {
    labelName: "Enter Delay in Payment",
    labelKey: "ES_DELAY_IN_PAYMENT_PLACEHOLDER"
  },
  gridDefination: {
    xs: 12,
    sm: 6
  },
  // required: true,
  maxLength: 15,
  jsonPath: `Properties[0].propertyDetails.owners[0].ownerDetails.paymentDetails[0].grDelayInPayment`
}

const interestForDelayField = {
  label: {
    labelName: "Interest For Delay",
    labelKey: "ES_INTERES_FOR_DELAY_LABEL"
  },
  placeholder: {
    labelName: "Enter Interest For Delay",
    labelKey: "ES_INTERES_FOR_DELAY_PLACEHOLDER"
  },
  gridDefination: {
    xs: 12,
    sm: 6
  },
  // required: true,
  maxLength: 15,
  jsonPath: `Properties[0].propertyDetails.owners[0].ownerDetails.paymentDetails[0].grInterestForDelay`
}

const totalAmountDueWithInterestField = {
  label: {
    labelName: "Total Amount Due with Interest",
    labelKey: "ES_TOTAL_AMOUNT_DUE_WITH_INTERES_LABEL"
  },
  placeholder: {
    labelName: "Enter Total Amount Due with Interest",
    labelKey: "ES_TOTAL_AMOUNT_DUE_WITH_INTERES_PLACEHOLDER"
  },
  gridDefination: {
    xs: 12,
    sm: 6
  },
  // required: true,
  maxLength: 15,
  jsonPath: `Properties[0].propertyDetails.owners[0].ownerDetails.paymentDetails[0].grTotalAmountDueWithInterest`
}

const amountDepositedGRField = {
  label: {
    labelName: "Amount Desposited GR",
    labelKey: "ES_AMOUNT_DEPOSITED_GR_LABEL"
  },
  placeholder: {
    labelName: "Enter Amount Desposited GR",
    labelKey: "ES_AMOUNT_DEPOSITED_GR_PLACEHOLDER"
  },
  gridDefination: {
    xs: 12,
    sm: 6
  },
  // required: true,
  maxLength: 15,
  jsonPath: `Properties[0].propertyDetails.owners[0].ownerDetails.paymentDetails[0].grAmountDepositedGr`
}

const amountDepositedInttField = {
  label: {
    labelName: "Amount Desposited Intt",
    labelKey: "ES_AMOUNT_DEPOSITED_INTT_LABEL"
  },
  placeholder: {
    labelName: "Enter Amount Desposited Intt",
    labelKey: "ES_AMOUNT_DEPOSITED_INTT_PLACEHOLDER"
  },
  gridDefination: {
    xs: 12,
    sm: 6
  },
  // required: true,
  maxLength: 15,
  jsonPath: `Properties[0].propertyDetails.owners[0].ownerDetails.paymentDetails[0].grAmountDepositedIntt`
}

const balanceGRField = {
  label: {
    labelName: "Balance(+due, -excess) GR",
    labelKey: "ES_BALANCE_GR_LABEL"
  },
  placeholder: {
    labelName: "Enter Balance(+due, -excess) GR",
    labelKey: "ES_BALANCE_GR_PLACEHOLDER"
  },
  gridDefination: {
    xs: 12,
    sm: 6
  },
  // required: true,
  maxLength: 15,
  jsonPath: `Properties[0].propertyDetails.owners[0].ownerDetails.paymentDetails[0].grBalanceGr`
}

const balanceInttField = {
  label: {
    labelName: "Balance(+due, -excess) Intt",
    labelKey: "ES_BALANCE_INTT_LABEL"
  },
  placeholder: {
    labelName: "Enter Balance(+due, -excess) Intt",
    labelKey: "ES_BALANCE_INTT_PLACEHOLDER"
  },
  gridDefination: {
    xs: 12,
    sm: 6
  },
  // required: true,
  maxLength: 15,
  jsonPath: `Properties[0].propertyDetails.owners[0].ownerDetails.paymentDetails[0].grBalanceIntt`
}

const totalDueField = {
  label: {
    labelName: "Total Due",
    labelKey: "ES_TOTAL_DUE_LABEL"
  },
  placeholder: {
    labelName: "Enter Total Due",
    labelKey: "ES_TOTAL_DUE_PLACEHOLDER"
  },
  gridDefination: {
    xs: 12,
    sm: 6
  },
  // required: true,
  maxLength: 15,
  jsonPath: `Properties[0].propertyDetails.owners[0].ownerDetails.paymentDetails[0].grTotalDue`
}

const receiptNumberField = {
  label: {
    labelName: "Receipt No.",
    labelKey: "ES_RECEIPT_NUMBER_LABEL"
  },
  placeholder: {
    labelName: "Enter Receipt No.",
    labelKey: "ES_RECEIPT_NUMBER_PLACEHOLDER"
  },
  gridDefination: {
    xs: 12,
    sm: 6
  },
  // required: true,
  maxLength: 75,
  jsonPath: `Properties[0].propertyDetails.owners[0].ownerDetails.paymentDetails[0].grReceiptNumber`
}

const receiptDateField = {
  label: {
    labelName: "Receipt Date",
    labelKey: "ES_RECEIPT_DATE_LABEL"
  },
  pattern: getPattern("Date"),
  // required: true,
  jsonPath: `Properties[0].propertyDetails.owners[0].ownerDetails.paymentDetails[0].grReceiptDate`,
  props: {
    inputProps: {
      max: getTodaysDateInYMD()
    }
  }
}

export const groundRentDetailsPM = getCommonCard({
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
  labelKey: "ES_SERVICE_TAX_DETAILS_HEADER"
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
    labelKey: "ES_RATE_ST_GST_LABEL"
  },
  placeholder: {
    labelName: "Enter Rate of ST/GST",
    labelKey: "ES_RATE_ST_GST_PLACEHOLDER"
  },
  gridDefination: {
    xs: 12,
    sm: 6
  },
  // required: true,
  maxLength: 15,
  jsonPath: `Properties[0].propertyDetails.owners[0].ownerDetails.paymentDetails[0].stRateOfStGst`
}

const amountOfGstFieldST = {
  label: {
    labelName: "Amount Of GST",
    labelKey: "ES_AMOUNT_OF_GST_LABEL"
  },
  placeholder: {
    labelName: "Enter Amount Of GST",
    labelKey: "ES_AMOUNT_OF_GST_PLACEHOLDER"
  },
  gridDefination: {
    xs: 12,
    sm: 6
  },
  // required: true,
  maxLength: 15,
  jsonPath: `Properties[0].propertyDetails.owners[0].ownerDetails.paymentDetails[0].stAmountOfGst`
}

const amountDueFieldST = {
  label: {
    labelName: "Amount Due",
    labelKey: "ES_AMOUNT_DUE_LABEL"
  },
  placeholder: {
    labelName: "Enter Amount Due",
    labelKey: "ES_AMOUNT_DUE_PLACEHOLDER"
  },
  gridDefination: {
    xs: 12,
    sm: 6
  },
  // required: true,
  maxLength: 15,
  jsonPath: `Properties[0].propertyDetails.owners[0].ownerDetails.paymentDetails[0].stAmountDue`
}

const dateOfDepositFieldST = {
  label: {
    labelName: "Date of Deposit",
    labelKey: "ES_DATE_OF_DEPOSIT_LABEL"
  },
  pattern: getPattern("Date"),
  // required: true,
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
    labelKey: "ES_DELAY_IN_PAYMENT_LABEL"
  },
  placeholder: {
    labelName: "Enter Delay in Payment",
    labelKey: "ES_DELAY_IN_PAYMENT_PLACEHOLDER"
  },
  gridDefination: {
    xs: 12,
    sm: 6
  },
  // required: true,
  maxLength: 15,
  jsonPath: `Properties[0].propertyDetails.owners[0].ownerDetails.paymentDetails[0].stDelayInPayment`
}

const interestForDelayFieldST = {
  label: {
    labelName: "Interest For Delay",
    labelKey: "ES_INTERES_FOR_DELAY_LABEL"
  },
  placeholder: {
    labelName: "Enter Interest For Delay",
    labelKey: "ES_INTERES_FOR_DELAY_PLACEHOLDER"
  },
  gridDefination: {
    xs: 12,
    sm: 6
  },
  // required: true,
  maxLength: 15,
  jsonPath: `Properties[0].propertyDetails.owners[0].ownerDetails.paymentDetails[0].stInterestForDelay`
}

const totalAmountDueWithInterestFieldST = {
  label: {
    labelName: "Total Amount Due with Interest",
    labelKey: "ES_TOTAL_AMOUNT_DUE_WITH_INTERES_LABEL"
  },
  placeholder: {
    labelName: "Enter Total Amount Due with Interest",
    labelKey: "ES_TOTAL_AMOUNT_DUE_WITH_INTERES_PLACEHOLDER"
  },
  gridDefination: {
    xs: 12,
    sm: 6
  },
  // required: true,
  maxLength: 15,
  jsonPath: `Properties[0].propertyDetails.owners[0].ownerDetails.paymentDetails[0].stTotalAmountDueWithInterest`
}

const amountDepositedFieldST = {
  label: {
    labelName: "Amount Deposited ST/GST",
    labelKey: "ES_AMOUNT_DEPOSITED_ST_LABEL"
  },
  placeholder: {
    labelName: "Enter Amount Deposited ST/GST",
    labelKey: "ES_AMOUNT_DEPOSITED_ST_PLACEHOLDER"
  },
  gridDefination: {
    xs: 12,
    sm: 6
  },
  // required: true,
  maxLength: 15,
  jsonPath: `Properties[0].propertyDetails.owners[0].ownerDetails.paymentDetails[0].stAmountDepositedStGst`
}

const amountDepositedInttFieldST = {
  label: {
    labelName: "Amount Deposited Intt",
    labelKey: "ES_AMOUNT_DEPOSITED_INTT_ST_LABEL"
  },
  placeholder: {
    labelName: "Enter Amount Deposited Intt",
    labelKey: "ES_AMOUNT_DEPOSITED_INTT_ST_PLACEHOLDER"
  },
  gridDefination: {
    xs: 12,
    sm: 6
  },
  // required: true,
  maxLength: 15,
  jsonPath: `Properties[0].propertyDetails.owners[0].ownerDetails.paymentDetails[0].stAmountDepositedIntt`
}

const balanceFieldST = {
  label: {
    labelName: "Balance ST/GST",
    labelKey: "ES_BALANCE_ST_LABEL"
  },
  placeholder: {
    labelName: "Enter Balance ST/GST",
    labelKey: "ES_BALANCE_ST_PLACEHOLDER"
  },
  gridDefination: {
    xs: 12,
    sm: 6
  },
  // required: true,
  maxLength: 15,
  jsonPath: `Properties[0].propertyDetails.owners[0].ownerDetails.paymentDetails[0].stBalanceStGst`
}

const balanceInttFieldST = {
  label: {
    labelName: "Balance Intt",
    labelKey: "ES_BALANCE_INTT_LABEL"
  },
  placeholder: {
    labelName: "Enter Balance Intt",
    labelKey: "ES_BALANCE_INTT_PLACEHOLDER"
  },
  gridDefination: {
    xs: 12,
    sm: 6
  },
  // required: true,
  maxLength: 15,
  jsonPath: `Properties[0].propertyDetails.owners[0].ownerDetails.paymentDetails[0].stBalanceIntt`
}

const totalDueFieldST = {
  label: {
    labelName: "Total Due",
    labelKey: "ES_TOTAL_DUE_LABEL"
  },
  placeholder: {
    labelName: "Enter Total Due",
    labelKey: "ES_TOTAL_DUE_PLACEHOLDER"
  },
  gridDefination: {
    xs: 12,
    sm: 6
  },
  // required: true,
  maxLength: 15,
  jsonPath: `Properties[0].propertyDetails.owners[0].ownerDetails.paymentDetails[0].stTotalDue`
}

const receiptNumberFieldST = {
  label: {
    labelName: "Receipt No.",
    labelKey: "ES_RECEIPT_NUMBER_LABEL"
  },
  placeholder: {
    labelName: "Enter Receipt No.",
    labelKey: "ES_RECEIPT_NUMBER_PLACEHOLDER"
  },
  gridDefination: {
    xs: 12,
    sm: 6
  },
  // required: true,
  maxLength: 75,
  jsonPath: `Properties[0].propertyDetails.owners[0].ownerDetails.paymentDetails[0].stReceiptNumber`
}

const receiptDateFieldST = {
  label: {
    labelName: "Receipt Date",
    labelKey: "ES_RECEIPT_DATE_LABEL"
  },
  pattern: getPattern("Date"),
  // required: true,
  jsonPath: `Properties[0].propertyDetails.owners[0].ownerDetails.paymentDetails[0].stReceiptDate`,
  props: {
    inputProps: {
      max: getTodaysDateInYMD()
    }
  }
}

export const serviceTaxDetails = getCommonCard({
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
    labelKey: "ES_PAYMENT_MADE_BY_LABEL"
  },
  placeholder: {
    labelName: "Enter Payment Made By",
    labelKey: "ES_PAYMENT_MADE_BY_PLACEHOLDER"
  },
  gridDefination: {
    xs: 12,
    sm: 6
  },
  // props: {
  //   disabled: true
  // },
  // required: true,
  maxLength: 15,
  jsonPath: `Properties[0].propertyDetails.owners[0].ownerDetails.paymentDetails[0].stPaymentMadeBy`
}

export const paymentMadeBy = getCommonCard({
  detailsContainer: getCommonContainer({
    paymentMadeBy: getTextField(paymentMadeByField)
  })
}) */