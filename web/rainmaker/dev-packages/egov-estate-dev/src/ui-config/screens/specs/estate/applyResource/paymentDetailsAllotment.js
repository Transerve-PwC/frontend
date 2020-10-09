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
  prepareFinalObject,
  handleScreenConfigurationFieldChange as handleField
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import {
  getTodaysDateInYMD
} from "../../utils";
import get from "lodash/get";
import { set } from "lodash";

var data = []
new Array(28).fill(undefined).map((val,idx) => {
  data.push({ code: idx + 1 })
});
/***************** Common fields to Ground rent and License fee *********************/
const advancedRentField = {
  label: {
      labelName: "Advance Rent",
      labelKey: "ES_ADVANCED_RENT_LABEL"
  },
  placeholder: {
      labelName: "Enter Advanced Rent",
      labelKey: "ES_ADVANCED_RENT_PLACEHOLDER"
  },
  gridDefination: {
      xs: 12,
      sm: 6
  },
  maxLength: 100,
  jsonPath: "Properties[0].propertyDetails.paymentDetails[0].advanceRent"
}

const dateOfPaymentOfAdvanceRentField = {
  label: {
      labelName: "Date of Payment of Advance Rent",
      labelKey: "ES_DATE_OF_PAYMENT_OF_ADVANCE_RENT_LABEL"
  },
  placeholder: {
      labelName: "Enter Date of Payment of Advance Rent",
      labelKey: "ES_DATE_OF_PAYMENT_OF_ADVANCE_RENT_PLACEHOLDER"
  },
  pattern: getPattern("Date"),
  jsonPath: "Properties[0].propertyDetails.paymentDetails[0].dateOfPaymentOfAdvanceRent",
  // props: {
  //     inputProps: {
  //         max: getTodaysDateInYMD()
  //     }
  // }
}

/************************ Premium Amount Deatails *******************/
const premiumAmountField = {
  label: {
      labelName: "Premium Amount",
      labelKey: "ES_PREMIUM_AMOUNT_LABEL"
  },
  placeholder: {
      labelName: "Enter Premium Amount",
      labelKey: "ES_PREMIUM_AMOUNT_PLACEHOLDER"
  },
  gridDefination: {
      xs: 12,
      sm: 6
  },
  maxLength: 100,
  jsonPath: "Properties[0].propertyDetails.paymentDetails[0].premiumAmount"
}

const installmentField = {
  label: {
      labelName: "Installment",
      labelKey: "ES_INSTALLMENT_LABEL"
  },
  placeholder: {
      labelName: "Enter Installment",
      labelKey: "ES_INSTALLMENT_PLACEHOLDER"
  },
  gridDefination: {
      xs: 12,
      sm: 6
  },
  maxLength: 100,
  jsonPath: "Properties[0].propertyDetails.paymentDetails[0].installments[0].installmentAmount"
}

const dueDateForInstallmentField = {
  label: {
      labelName: "Due Date for Installment",
      labelKey: "ES_DUE_DATE_INSTALLMENT_LABEL"
  },
  placeholder: {
      labelName: "Due Date for Installment",
      labelKey: "ES_DUE_DATE_INSTALLMENT_PLACEHOLDER"
  },
  pattern: getPattern("Date"),
  jsonPath: "Properties[0].propertyDetails.paymentDetails[0].installments[0].dueDate",
  // props: {
  //     inputProps: {
  //         max: getTodaysDateInYMD()
  //     }
  // }
}

const commonInstallmentInformation = () => {
  return getCommonGrayCard({
    header: getCommonTitle({
      labelName: "Installment",
      labelKey: "ES_INSTALLMENT"
    }, {
      style: {
        marginBottom: 18
      }
    }),
    installmentCard: getCommonContainer({
      installment: getTextField(installmentField),
      dueDateForInstallment: getDateField(dueDateForInstallmentField),
    })
  });
};

export const installmentDetails = getCommonCard({
  detailsContainer: getCommonContainer({
    multipleInstallmentContainer: {
      uiFramework: "custom-atoms",
      componentPath: "Div",
      props: {
        style: {
          width: "100%"
        }
      },
      children: {
        multipleInstallmentInfo: {
          uiFramework: "custom-containers",
          componentPath: "MultiItem",
          props: {
            scheama: commonInstallmentInformation(),
            items: [],
            addItemLabel: {
              labelName: "Add Installment",
              labelKey: "ES_COMMON_ADD_INSTALLMENT_LABEL"
            },
            headerName: "Installment",
            headerJsonPath:
              "children.cardContent.children.header.children.key.props.labelKey",
            sourceJsonPath: "Properties[0].propertyDetails.paymentDetails[0].installments",
            prefixSourceJsonPath: "children.cardContent.children.installmentCard.children",
            onMultiItemAdd: (state, muliItemContent) => {
              console.log(muliItemContent);
              // muliItemContent["dueDateForInstallment"]["visible"] = true;
              return muliItemContent;
            }
          },
          type: "array"
        }
      }
    }
  })
})

const premiumAmountHeader = getCommonTitle({
  labelName: "Premium Amount Details",
  labelKey: "ES_PREMIUM_AMOUNT_HEADER"
}, {
  style: {
      marginBottom: 18,
      marginTop: 18
  }
})

export const premiumAmountDetails = getCommonCard({
  header: premiumAmountHeader,
  detailsContainer: getCommonContainer({
    premiumAmount: getTextField(premiumAmountField)
  }),
  installmentContainer: installmentDetails
})

/******************** Select demand ******************/
const getDemandRadioButton = {
  uiFramework: "custom-containers",
  componentPath: "RadioGroupContainer",
  gridDefination: {
    xs: 12,
    sm: 6,
  },
  jsonPath: "Properties[0].propertyDetails.paymentDetails[0].demand",
  props: {
    label: {
      name: "Demand",
      key: "ES_DEMAND_LABEL"
    },
    buttons: [{
        labelName: "Ground Rent",
        labelKey: "ES_GROUND_RENT_LABEL",
        value: "GROUNDRENT"
      },
      {
        label: "License Fee",
        labelKey: "ES_LICENSE_FEE_LABEL",
        value: "LICENSEFEE"
      }
    ],
    jsonPath: "Properties[0].propertyDetails.paymentDetails[0].demand",
    required: true
  },
  required: true,
  type: "array",
  beforeFieldChange: (action, state, dispatch) => {
    if (action.value == "GROUNDRENT") {
      dispatch(
        handleField(
          "allotment",
          "components.div.children.formwizardSixthStepAllotment.children.groundRentDetails",
          "visible",
          true
        )
      )
      dispatch(
        handleField(
          "allotment",
          "components.div.children.formwizardSixthStepAllotment.children.licenseFeeDetails",
          "visible",
          false
        )
      )
    }
    else {
      dispatch(
        handleField(
          "allotment",
          "components.div.children.formwizardSixthStepAllotment.children.licenseFeeDetails",
          "visible",
          true
        )
      )
      dispatch(
        handleField(
          "allotment",
          "components.div.children.formwizardSixthStepAllotment.children.groundRentDetails",
          "visible",
          false
        )
      )
    }
  }
};

export const demandSelect = getCommonCard({
  detailsContainer: getCommonContainer({
    demand: getDemandRadioButton
  })
})

/****************** Ground Rent Details **********************/
const groundRentGenerationTypeField = {
  label: {
      labelName: "Ground Rent Generation Type",
      labelKey: "ES_GROUND_RENT_GENERATION_TYPE_LABEL"
  },
  placeholder: {
      labelName: "Enter Ground Rent Generation Type",
      labelKey: "ES_GROUND_RENT_GENERATION_TYPE_PLACEHOLDER"
  },
  gridDefination: {
      xs: 12,
      sm: 6
  },
  maxLength: 100,
  jsonPath: "Properties[0].propertyDetails.paymentDetails[0].groundRentGenerationType",
  props: {
    data: [
      {code: "Monthly"},
      {code: "Annually"}
    ]
  },
  beforeFieldChange: (action, state, dispatch) => {
    if (action.value == "Monthly") {
      dispatch(
        handleField(
          "allotment",
          "components.div.children.formwizardSixthStepAllotment.children.groundRentDetails.children.cardContent.children.detailsContainer.children.dateToGenerateDemandRent",
          "visible",
          true
        )
      )
    }
    else {
      dispatch(
        handleField(
          "allotment",
          "components.div.children.formwizardSixthStepAllotment.children.groundRentDetails.children.cardContent.children.detailsContainer.children.dateToGenerateDemandRent",
          "visible",
          false
        )
      )
    }
  }
}

const billingStartDateField = {
  label: {
      labelName: "Billing Start Date",
      labelKey: "ES_BILLING_START_DATE_LABEL"
  },
  placeholder: {
      labelName: "Enter Billing Start Date",
      labelKey: "ES_BILLING_START_DATE_PLACEHOLDER"
  },
  pattern: getPattern("Date"),
  jsonPath: "Properties[0].propertyDetails.paymentDetails[0].billingStartDate",
  // props: {
  //     inputProps: {
  //         max: getTodaysDateInYMD()
  //     }
  // }
}

const dateToGenerateDemandRentField = {
  label: {
    labelName: "Date to Generate the Demand/Rent",
    labelKey: "ES_DATE_TO_GENERATE_DEMAND_RENT_LABEL"
  },
  placeholder: {
    labelName: "Select Date to Generate the Demand/Rent",
    labelKey: "ES_DATE_TO_GENERATE_DEMAND_RENT_PLACEHOLDER"
  },
  jsonPath: "Properties[0].propertyDetails.paymentDetails[0].dateToGenerateDemandRent",
  gridDefination: {
    xs: 12,
    sm: 6
  },
  props: {
      data: data
  },
  visible: false
}

const rentAmountField = {
  label: {
      labelName: "Rent Amount",
      labelKey: "ES_RENT_AMOUNT_LABEL"
  },
  placeholder: {
      labelName: "Enter Rent Amount",
      labelKey: "ES_RENT_AMOUNT_PLACEHOLDER"
  },
  gridDefination: {
      xs: 12,
      sm: 4
  },
  maxLength: 100,
  jsonPath: "Properties[0].propertyDetails.paymentDetails[0].rent[0].rentAmount"
}

const startYearField = {
  label: {
      labelName: "Start Year",
      labelKey: "ES_START_YEAR_LABEL"
  },
  placeholder: {
      labelName: "Enter Start Year",
      labelKey: "ES_START_YEAR_PLACEHOLDER"
  },
  gridDefination: {
      xs: 12,
      sm: 4
  },
  maxLength: 100,
  jsonPath: "Properties[0].propertyDetails.paymentDetails[0].rent[0].startYear"
}

const endYearField = {
  label: {
      labelName: "End Year",
      labelKey: "ES_END_YEAR_LABEL"
  },
  placeholder: {
      labelName: "Enter End Year",
      labelKey: "ES_END_YEAR_PLACEHOLDER"
  },
  gridDefination: {
      xs: 12,
      sm: 4
  },
  maxLength: 100,
  jsonPath: "Properties[0].propertyDetails.paymentDetails[0].rent[0].endYear"
}

const commonRentInformation = () => {
  return getCommonGrayCard({
    header: getCommonTitle({
      labelName: "Rent",
      labelKey: "ES_RENT"
    }, {
      style: {
        marginBottom: 18
      }
    }),
    rentCard: getCommonContainer({
      rentAmount: getTextField(rentAmountField),
      startYear: getTextField(startYearField),
      endYear: getTextField(endYearField)
    })
  });
};

export const rentDetails = getCommonCard({
  detailsContainer: getCommonContainer({
    multipleRentContainer: {
      uiFramework: "custom-atoms",
      componentPath: "Div",
      props: {
        style: {
          width: "100%"
        }
      },
      children: {
        multipleRentInfo: {
          uiFramework: "custom-containers",
          componentPath: "MultiItem",
          props: {
            scheama: commonRentInformation(),
            items: [],
            addItemLabel: {
              labelName: "Add Rent",
              labelKey: "ES_COMMON_ADD_RENT_LABEL"
            },
            headerName: "Rent",
            headerJsonPath:
              "children.cardContent.children.header.children.key.props.labelKey",
            sourceJsonPath: "Properties[0].propertyDetails.paymentDetails[0].rent",
            prefixSourceJsonPath: "children.cardContent.children.rentCard.children",
            onMultiItemAdd: (state, muliItemContent) => {
              console.log(muliItemContent);
              return muliItemContent;
            }
          },
          type: "array"
        }
      }
    }
  })
})
const groundRentHeader = getCommonTitle({
  labelName: "Ground Rent Details",
  labelKey: "ES_GROUND_RENT_HEADER"
}, {
  style: {
      marginBottom: 18,
      marginTop: 18
  }
})

export const groundRentDetails = getCommonCard({
  header: groundRentHeader,
  detailsContainer: getCommonContainer({
    groundRentGenerationType: getSelectField(groundRentGenerationTypeField),
    billingStartDate: getDateField(billingStartDateField),
    dateToGenerateDemandRent: getSelectField(dateToGenerateDemandRentField),
    advanceRent: getTextField(advancedRentField),
    dateOfPaymentOfAdvanceRent: getDateField(dateOfPaymentOfAdvanceRentField)
  }),
  rentContainer: rentDetails
})


/*********************** License Fee Details ************************/
const licenseFeeGenerationTypeField = {
  label: {
      labelName: "License Fee Generation Type",
      labelKey: "ES_LICENSE_FEE_GENERATION_TYPE_LABEL"
  },
  placeholder: {
      labelName: "Enter License Fee Generation Type",
      labelKey: "ES_LICENSE_FEE_GENERATION_TYPE_PLACEHOLDER"
  },
  gridDefination: {
      xs: 12,
      sm: 6
  },
  maxLength: 100,
  jsonPath: "Properties[0].propertyDetails.paymentDetails[0].licenseFeeGenerationType",
  props: {
    data: [
      {code: "Monthly"},
      {code: "Annually"}
    ]
  },
  beforeFieldChange: (action, state, dispatch) => {
    if (action.value == "Monthly") {
      dispatch(
        handleField(
          "allotment",
          "components.div.children.formwizardSixthStepAllotment.children.licenseFeeDetails.children.cardContent.children.detailsContainer.children.dateToGenerateDemandLf",
          "visible",
          true
        )
      )
    }
    else {
      dispatch(
        handleField(
          "allotment",
          "components.div.children.formwizardSixthStepAllotment.children.licenseFeeDetails.children.cardContent.children.detailsContainer.children.dateToGenerateDemandLf",
          "visible",
          false
        )
      )
    }
  }
}

const dateToGenerateDemandLicenseFeeField = {
  label: {
    labelName: "Date to Generate the Demand/License Fee",
    labelKey: "ES_DATE_TO_GENERATE_DEMAND_LICENSE_FEE_LABEL"
  },
  placeholder: {
    labelName: "Select Date to Generate the Demand/License Fee",
    labelKey: "ES_DATE_TO_GENERATE_DEMAND_LICENSE_FEE_PLACEHOLDER"
  },
  jsonPath: "Properties[0].propertyDetails.paymentDetails[0].dateToGenerateDemandLf",
  gridDefination: {
    xs: 12,
    sm: 6
  },
  props: {
      data: data
  },
  visible: false
}

const billingStartDateLicenseFeeField = {
  label: {
      labelName: "Billing Start Date",
      labelKey: "ES_BILLING_START_DATE_LABEL"
  },
  placeholder: {
      labelName: "Enter Billing Start Date",
      labelKey: "ES_BILLING_START_DATE_PLACEHOLDER"
  },
  pattern: getPattern("Date"),
  jsonPath: "Properties[0].propertyDetails.paymentDetails[0].billingStartDateLf",
  gridDefination: {
    xs: 12,
    sm: 6
  },
  // props: {
  //     inputProps: {
  //         max: getTodaysDateInYMD()
  //     }
  // }
}

const licenseFeeField = {
  label: {
      labelName: "License Fee",
      labelKey: "ES_LICENSE_FEE_LABEL"
  },
  placeholder: {
      labelName: "Enter License Fee",
      labelKey: "ES_LICENSE_FEE_PLACEHOLDER"
  },
  gridDefination: {
      xs: 12,
      sm: 4
  },
  maxLength: 100,
  jsonPath: "Properties[0].propertyDetails.paymentDetails[0].licenseFees[0].licenseFee"
}

const startYearLfField = {
  label: {
      labelName: "Start Year",
      labelKey: "ES_START_YEAR_LABEL"
  },
  placeholder: {
      labelName: "Enter Start Year",
      labelKey: "ES_START_YEAR_PLACEHOLDER"
  },
  gridDefination: {
      xs: 12,
      sm: 4
  },
  maxLength: 100,
  jsonPath: "Properties[0].propertyDetails.paymentDetails[0].licenseFees[0].startYear"
}

const endYearLfField = {
  label: {
      labelName: "End Year",
      labelKey: "ES_END_YEAR_LABEL"
  },
  placeholder: {
      labelName: "Enter End Year",
      labelKey: "ES_END_YEAR_PLACEHOLDER"
  },
  gridDefination: {
      xs: 12,
      sm: 4
  },
  maxLength: 100,
  jsonPath: "Properties[0].propertyDetails.paymentDetails[0].licenseFees[0].endYear"
}


const commonLicenseInformation = () => {
  return getCommonGrayCard({
    header: getCommonTitle({
      labelName: "License Fee for Year",
      labelKey: "ES_LICENSE_FEE_FOR_YEAR"
    }, {
      style: {
        marginBottom: 18
      }
    }),
    licenseCard: getCommonContainer({
      licenseFee: getTextField(licenseFeeField),
      startYear: getTextField(startYearLfField),
      endYear: getTextField(endYearLfField)
    })
  });
};

export const licenseFeeForYearDetails = getCommonCard({
  detailsContainer: getCommonContainer({
    multipleLicenseContainer: {
      uiFramework: "custom-atoms",
      componentPath: "Div",
      props: {
        style: {
          width: "100%"
        }
      },
      children: {
        multipleLicenseInfo: {
          uiFramework: "custom-containers",
          componentPath: "MultiItem",
          props: {
            scheama: commonLicenseInformation(),
            items: [],
            addItemLabel: {
              labelName: "Add License Fee",
              labelKey: "ES_COMMON_LICENSE_FEE_LABEL"
            },
            headerName: "License Fee for Year",
            headerJsonPath:
              "children.cardContent.children.header.children.key.props.labelKey",
            sourceJsonPath: "Properties[0].propertyDetails.paymentDetails[0].licenseFees",
            prefixSourceJsonPath: "children.cardContent.children.licenseCard.children",
            onMultiItemAdd: (state, muliItemContent) => {
              console.log(muliItemContent);
              return muliItemContent;
            }
          },
          type: "array"
        }
      }
    }
  })
})

const licenseFeeHeader = getCommonTitle({
  labelName: "License Fee Details",
  labelKey: "ES_LICENSE_FEE_HEADER"
}, {
  style: {
      marginBottom: 18,
      marginTop: 18
  }
})

export const licenseFeeDetails = getCommonCard({
  header: licenseFeeHeader,
  detailsContainer: getCommonContainer({
      demandGenerationType: getSelectField(licenseFeeGenerationTypeField),
      dateToGenerateDemandLf: getSelectField(dateToGenerateDemandLicenseFeeField),
      billingStartDateLf: getDateField(billingStartDateLicenseFeeField),
      advanceRent: getTextField(advancedRentField),
      dateOfPaymentOfAdvanceRent: getDateField(dateOfPaymentOfAdvanceRentField)
  }),
  licenseFeeForYearContainer: licenseFeeForYearDetails
})


/******************** Security Fee Details ********************/ 
const securityFeeAmountField = {
  label: {
      labelName: "Security Fee Amount",
      labelKey: "ES_SECURITY_FEE_AMOUNT_LABEL"
  },
  placeholder: {
      labelName: "Enter Security Fee Amount",
      labelKey: "ES_SECURITY_FEE_AMOUNT_PLACEHOLDER"
  },
  gridDefination: {
      xs: 12,
      sm: 6
  },
  maxLength: 100,
  jsonPath: "Properties[0].propertyDetails.paymentDetails[0].securityFeeAmount"
}

const dateOfPaymentField = {
  label: {
      labelName: "Date of Payment",
      labelKey: "ES_DATE_OF_PAYMENT_LABEL"
  },
  placeholder: {
      labelName: "Enter Date of Payment",
      labelKey: "ES_DATE_OF_PAYMENT_PLACEHOLDER"
  },
  pattern: getPattern("Date"),
  jsonPath: "Properties[0].propertyDetails.paymentDetails[0].securityFeeDateOfPayment",
  // props: {
  //     inputProps: {
  //         max: getTodaysDateInYMD()
  //     }
  // }
}

const securityDetailsHeader = getCommonTitle({
  labelName: "Security Details",
  labelKey: "ES_SECURITY_DETAILS_HEADER"
}, {
  style: {
      marginBottom: 18,
      marginTop: 18
  }
})

export const securityDetails = getCommonCard({
  header: securityDetailsHeader,
  detailsContainer: getCommonContainer({
      securityFeeAmount: getTextField(securityFeeAmountField),
      securityFeeDateOfPayment: getDateField(dateOfPaymentField)
  })
})