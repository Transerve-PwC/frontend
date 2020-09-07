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

/***************** Common fields to Ground rent and License fee *********************/
const advancedRentField = {
  label: {
      labelName: "Advanced Rent",
      labelKey: "EST_ADVANCED_RENT_LABEL"
  },
  placeholder: {
      labelName: "Enter Advanced Rent",
      labelKey: "EST_ADVANCED_RENT_PLACEHOLDER"
  },
  gridDefination: {
      xs: 12,
      sm: 6
  },
  maxLength: 100,
  jsonPath: ""
}

const dateOfPaymentOfAdvanceRentField = {
  label: {
      labelName: "Date of Payment of Advance Rent",
      labelKey: "EST_DATE_OF_PAYMENT_OF_ADVANCE_RENT_LABEL"
  },
  placeholder: {
      labelName: "Enter Date of Payment of Advance Rent",
      labelKey: "EST_DATE_OF_PAYMENT_OF_ADVANCE_RENT_PLACEHOLDER"
  },
  pattern: getPattern("Date"),
  jsonPath: "",
  props: {
      inputProps: {
          max: getTodaysDateInYMD()
      }
  }
}

/************************ Premium Amount Deatails *******************/
const premiumAmountField = {
  label: {
      labelName: "Premium Amount",
      labelKey: "EST_PREMIUM_AMOUNT_LABEL"
  },
  placeholder: {
      labelName: "Enter Premium Amount",
      labelKey: "EST_PREMIUM_AMOUNT_PLACEHOLDER"
  },
  gridDefination: {
      xs: 12,
      sm: 6
  },
  maxLength: 100,
  jsonPath: ""
}

const installmentField = {
  label: {
      labelName: "Installment",
      labelKey: "EST_INSTALLMENT_LABEL"
  },
  placeholder: {
      labelName: "Enter Installment",
      labelKey: "EST_INSTALLMENT_PLACEHOLDER"
  },
  gridDefination: {
      xs: 12,
      sm: 6
  },
  maxLength: 100,
  jsonPath: "Properties[0].propertyDetails.premiumAmount.installments[0].installemntAmount"
}

const dueDateForInstallmentField = {
  label: {
      labelName: "Due Date for Installment",
      labelKey: "EST_DUE_DATE_INSTALLMENT_LABEL"
  },
  placeholder: {
      labelName: "Due Date for Installment",
      labelKey: "EST_DUE_DATE_INSTALLMENT_PLACEHOLDER"
  },
  pattern: getPattern("Date"),
  jsonPath: "Properties[0].propertyDetails.premiumAmount.installments[0].dueDate",
  props: {
      inputProps: {
          max: getTodaysDateInYMD()
      }
  }
}

const getDemandRadioButton = {
  uiFramework: "custom-containers",
  componentPath: "RadioGroupContainer",
  gridDefination: {
    xs: 12,
    sm: 6,
  },
  jsonPath: "Properties[0].propertyDetails.demand",
  props: {
    label: {
      name: "Demand",
      key: "EST_DEMAND_LABEL"
    },
    buttons: [{
        labelName: "Ground Rent",
        labelKey: "EST_GROUND_RENT_LABEL",
        value: "GROUNDRENT"
      },
      {
        label: "License Fee",
        labelKey: "EST_LICENSE_FEE_LABEL",
        value: "LICENSEFEE"
      }
    ],
    jsonPath: "Properties[0].propertyDetails.demand",
    required: true
  },
  required: true,
  type: "array",
  visible: false,
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

const commonInstallmentInformation = () => {
  return getCommonGrayCard({
    header: getCommonTitle({
      labelName: "Installment",
      labelKey: "EST_INSTALLMENT"
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
              labelKey: "EST_COMMON_ADD_INSTALLMENT_LABEL"
            },
            headerName: "Installment",
            headerJsonPath:
              "children.cardContent.children.header.children.key.props.labelKey",
            sourceJsonPath: "Properties[0].propertyDetails.premiumAmount.installments",
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
  labelKey: "EST_PREMIUM_AMOUNT_HEADER"
}, {
  style: {
      marginBottom: 18,
      marginTop: 18
  }
})

export const premiumAmountDetails = getCommonCard({
  header: premiumAmountHeader,
  detailsContainer: getCommonContainer({
    demand: getDemandRadioButton,
    premiumAmount: getTextField(premiumAmountField)
  }),
  installmentContainer: installmentDetails
})

/****************** Ground Rent Details **********************/
const groundRentField = {
  label: {
      labelName: "Ground Rent",
      labelKey: "EST_GROUND_RENT_LABEL"
  },
  placeholder: {
      labelName: "Enter Ground Rent",
      labelKey: "EST_GROUND_RENT_PLACEHOLDER"
  },
  gridDefination: {
      xs: 12,
      sm: 6
  },
  maxLength: 100,
  jsonPath: ""
}

const groundRentGenerationTypeField = {
  label: {
      labelName: "Ground Rent Generation Type",
      labelKey: "EST_GROUND_RENT_GENERATION_TYPE_LABEL"
  },
  placeholder: {
      labelName: "Enter Ground Rent Generation Type",
      labelKey: "EST_GROUND_RENT_GENERATION_TYPE_PLACEHOLDER"
  },
  gridDefination: {
      xs: 12,
      sm: 6
  },
  maxLength: 100,
  jsonPath: "Properties[0].propertyDetails.groundRentGenerationType",
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
          true
        )
      )
    }
  }
}

const startingDateForGroundRentField = {
  label: {
      labelName: "Starting Date for Ground Rent",
      labelKey: "EST_STARTING_DATE_GROUND_RENT_LABEL"
  },
  placeholder: {
      labelName: "Enter Starting Date for Ground Rent",
      labelKey: "EST_STARTING_DATE_GROUND_RENT_PLACEHOLDER"
  },
  pattern: getPattern("Date"),
  jsonPath: "",
  props: {
      inputProps: {
          max: getTodaysDateInYMD()
      }
  }
}

const billingStartDateField = {
  label: {
      labelName: "Billing Start Date",
      labelKey: "EST_BILLING_START_DATE_LABEL"
  },
  placeholder: {
      labelName: "Enter Billing Start Date",
      labelKey: "EST_BILLING_START_DATE_PLACEHOLDER"
  },
  pattern: getPattern("Date"),
  jsonPath: "",
  props: {
      inputProps: {
          max: getTodaysDateInYMD()
      }
  }
}

const dateToGenerateDemandRentField = {
  label: {
    labelName: "Date to Generate the Demand/Rent",
    labelKey: "EST_DATE_TO_GENERATE_DEMAND_RENT_LABEL"
  },
  placeholder: {
    labelName: "Select Date to Generate the Demand/Rent",
    labelKey: "EST_DATE_TO_GENERATE_DEMAND_RENT_PLACEHOLDER"
  },
  jsonPath: "",
  gridDefination: {
    xs: 12,
    sm: 6
  },
  props: {
      data: [
        {code: "1"},
        {code: "2"},
        {code: "3"},
        {code: "4"},
        {code: "5"},
        {code: "6"},
        {code: "7"},
        {code: "8"},
        {code: "9"},
        {code: "10"},
        {code: "11"},
        {code: "12"},
        {code: "13"},
        {code: "14"},
        {code: "15"},
        {code: "16"},
        {code: "17"},
        {code: "18"},
        {code: "19"},
        {code: "20"},
        {code: "21"},
        {code: "22"},
        {code: "23"},
        {code: "24"},
        {code: "25"},
        {code: "26"},
        {code: "27"},
        {code: "28"}
      ]
  },
  visible: false
}

const rentAmountField = {
  label: {
      labelName: "Rent Amount",
      labelKey: "EST_RENT_AMOUNT_LABEL"
  },
  placeholder: {
      labelName: "Enter Rent Amount",
      labelKey: "EST_RENT_AMOUNT_PLACEHOLDER"
  },
  gridDefination: {
      xs: 12,
      sm: 4
  },
  maxLength: 100,
  jsonPath: ""
}

const startYearField = {
  label: {
      labelName: "Start Year",
      labelKey: "EST_START_YEAR_LABEL"
  },
  placeholder: {
      labelName: "Enter Start Year",
      labelKey: "EST_START_YEAR_PLACEHOLDER"
  },
  gridDefination: {
      xs: 12,
      sm: 4
  },
  maxLength: 100,
  jsonPath: "Properties[0].propertyDetails.groundRent.rent[0].startYear"
}

const endYearField = {
  label: {
      labelName: "End Year",
      labelKey: "EST_END_YEAR_LABEL"
  },
  placeholder: {
      labelName: "Enter End Year",
      labelKey: "EST_END_YEAR_PLACEHOLDER"
  },
  gridDefination: {
      xs: 12,
      sm: 4
  },
  maxLength: 100,
  jsonPath: "Properties[0].propertyDetails.groundRent.rent[0].endYear"
}

const commonRentInformation = () => {
  return getCommonGrayCard({
    header: getCommonTitle({
      labelName: "Rent",
      labelKey: "EST_RENT"
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
              labelKey: "EST_COMMON_ADD_RENT_LABEL"
            },
            headerName: "Rent",
            headerJsonPath:
              "children.cardContent.children.header.children.key.props.labelKey",
            sourceJsonPath: "Properties[0].propertyDetails.groundRent.rent",
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
  labelKey: "EST_GROUND_RENT_HEADER"
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
    groundRent: getTextField(groundRentField),
    startingDateForGroundRent: getDateField(startingDateForGroundRentField),
    billingStartDate: getDateField(billingStartDateField),
    dateToGenerateDemandRent: getSelectField(dateToGenerateDemandRentField),
    advanceRent: getTextField(advancedRentField),
    dateOfPaymentOfAdvanceRent: getDateField(dateOfPaymentOfAdvanceRentField)
  }),
  rentContainer: rentDetails
})


/*********************** License Fee Details ************************/
const licenseFeeField = {
  label: {
      labelName: "License Fee",
      labelKey: "EST_LICENSE_FEE_LABEL"
  },
  placeholder: {
      labelName: "Enter License Fee",
      labelKey: "EST_LICENSE_FEE_PLACEHOLDER"
  },
  gridDefination: {
      xs: 12,
      sm: 6
  },
  maxLength: 100,
  jsonPath: ""
}

const startingDateForLicenseFeeField = {
  label: {
      labelName: "Starting Date for License Fee",
      labelKey: "EST_STARTING_DATE_LICENSE_FEE_LABEL"
  },
  placeholder: {
      labelName: "Enter Starting Date for License Fee",
      labelKey: "EST_STARTING_DATE_LICENSE_FEE_PLACEHOLDER"
  },
  pattern: getPattern("Date"),
  jsonPath: "",
  props: {
      inputProps: {
          max: getTodaysDateInYMD()
      }
  }
}

const licenseFeeForYearField = {
  label: {
      labelName: "License Fee",
      labelKey: "EST_LICENSE_FEE_LABEL"
  },
  placeholder: {
      labelName: "Enter License Fee",
      labelKey: "EST_LICENSE_FEE_PLACEHOLDER"
  },
  gridDefination: {
      xs: 12,
      sm: 6
  },
  maxLength: 100,
  jsonPath: ""
}

const commonLicenseInformation = () => {
  return getCommonGrayCard({
    header: getCommonTitle({
      labelName: "License Fee for Year",
      labelKey: "EST_LICENSE_FEE_FOR_YEAR"
    }, {
      style: {
        marginBottom: 18
      }
    }),
    licenseCard: getCommonContainer({
      licenseFeeForYear: getTextField(licenseFeeForYearField)
    })
  });
};

export const licenseFeeForYearDetails = getCommonCard({
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
        multipleLicenseInfo: {
          uiFramework: "custom-containers",
          componentPath: "MultiItem",
          props: {
            scheama: commonLicenseInformation(),
            items: [],
            addItemLabel: {
              labelName: "Add License Fee",
              labelKey: "EST_COMMON_LICENSE_FEE_LABEL"
            },
            headerName: "License Fee for Year",
            headerJsonPath:
              "children.cardContent.children.header.children.key.props.labelKey",
            sourceJsonPath: "Properties[0].propertyDetails.LicenseDetails.licenseFees",
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
  labelKey: "EST_LICENSE_FEE_HEADER"
}, {
  style: {
      marginBottom: 18,
      marginTop: 18
  }
})

export const licenseFeeDetails = getCommonCard({
  header: licenseFeeHeader,
  detailsContainer: getCommonContainer({
      licenseFee: getTextField(licenseFeeField),
      startingDateForLicenseFee: getDateField(startingDateForLicenseFeeField),
      advanceRent: getTextField(advancedRentField),
      dateOfPaymentOfAdvanceRent: getDateField(dateOfPaymentOfAdvanceRentField)
  }),
  licenseFeeForYearContainer: licenseFeeForYearDetails
})


/******************** Security Fee Details ********************/ 
const securityFeeAmountField = {
  label: {
      labelName: "Security Fee Amount",
      labelKey: "EST_SECURITY_FEE_AMOUNT_LABEL"
  },
  placeholder: {
      labelName: "Enter Security Fee Amount",
      labelKey: "EST_SECURITY_FEE_AMOUNT_PLACEHOLDER"
  },
  gridDefination: {
      xs: 12,
      sm: 6
  },
  maxLength: 100,
  jsonPath: ""
}

const dateOfPaymentField = {
  label: {
      labelName: "Date of Payment",
      labelKey: "EST_DATE_OF_PAYMENT_LABEL"
  },
  placeholder: {
      labelName: "Enter Date of Payment",
      labelKey: "EST_DATE_OF_PAYMENT_PLACEHOLDER"
  },
  pattern: getPattern("Date"),
  jsonPath: "",
  props: {
      inputProps: {
          max: getTodaysDateInYMD()
      }
  }
}

const securityDetailsHeader = getCommonTitle({
  labelName: "Security Details",
  labelKey: "EST_SECURITY_DETAILS_HEADER"
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