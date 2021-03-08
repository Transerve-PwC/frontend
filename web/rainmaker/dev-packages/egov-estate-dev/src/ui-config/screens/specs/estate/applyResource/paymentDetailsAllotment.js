import {
  getCommonCard,
  getSelectField,
  getTextField,
  getDateField,
  getCommonTitle,
  getPattern,
  getCommonContainer,
  getCommonGrayCard,
  getLabelWithValue as _getLabelWithValue
} from "egov-ui-framework/ui-config/screens/specs/utils";
import {
  prepareFinalObject,
  handleScreenConfigurationFieldChange as handleField
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import {
  getTodaysDateInYMD,
  _getPattern,
  displayCustomErr
} from "../../utils";
import get from "lodash/get";
import { set } from "lodash";
import store from "../../../../../ui-redux/store";

function getLabelWithValue(labelName, path) {
  const label = _getLabelWithValue(labelName, path);
  label.gridDefination.sm = 3;
  return label;
}

let screenName = "apply";
let paymentStep = "formwizardEighthStep";
let summaryStep = "formwizardTenthStep";
let reviewContainer = "reviewDetails";

if ((window.location.href).includes("allotment")) {
    screenName = "allotment";
    paymentStep = "formwizardSixthStepAllotment";
    summaryStep = "formwizardSeventhStepAllotment";
    reviewContainer = "reviewAllotmentDetails"
}
else if ((window.location.href).includes("edit-rent-info")) {
  screenName = "edit-rent-info";
}

var data = []
new Array(31).fill(undefined).map((val,idx) => {
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
  // visible:false,
  pattern: _getPattern("float"),
  errorMessage:"ES_ERR_ADVANCED_RENT",
  required: true,
  jsonPath: "Properties[0].propertyDetails.paymentConfig.groundRentAdvanceRent"
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
  errorMessage:"ES_ERR_PAYMENT_DATE",
  jsonPath: "Properties[0].propertyDetails.paymentConfig.groundRentAdvanceRentDate",
  required: true
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
  maxLength: 50,
  minLength: 2,
  required: true,
  pattern:_getPattern("numeric"),
  errorMessage:"ES_ERR_PREMIUM_AMOUNT",
  jsonPath: "Properties[0].propertyDetails.paymentConfig.totalAmount",
  afterFieldChange: (action, state, dispatch) => {
    if (action.value.length > 50) {
      displayCustomErr(action.componentJsonpath, dispatch, "ES_ERR_MAXLENGTH_50", action.screenKey);
    } else if(action.value.length < 2) {
      displayCustomErr(action.componentJsonpath, dispatch,"ES_ERR_MIN_PREMIUM_AMOUNT", action.screenKey);
    }
    else{
      displayCustomErr(action.componentJsonpath, dispatch,"ES_ERR_PREMIUM_AMOUNT", action.screenKey);
    }
  }
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
  minLength: 1,
  required: true,
  jsonPath: "Properties[0].propertyDetails.paymentConfig.premiumAmountConfigItems[0].premiumAmount"
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
  required: true,
  jsonPath: "Properties[0].propertyDetails.paymentConfig.premiumAmountConfigItems[0].premiumAmountDate",
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
          uiFramework: "custom-containers-local",
          moduleName: "egov-estate",
          componentPath: "MultiItem",
          props: {
            scheama: commonInstallmentInformation(),
            items: [],
            addItemLabel: {
              labelName: "Add Installment",
              labelKey: "ES_COMMON_ADD_INSTALLMENT_LABEL"
            },
            headerName: "Installment",
            // headerJsonPath: "children.cardContent.children.header.children.key.props.labelKey",
            headerJsonPath: "children.cardContent.children.header.children.Installment.props.label",
            sourceJsonPath: "Properties[0].propertyDetails.paymentConfig.premiumAmountConfigItems",
            prefixSourceJsonPath: "children.cardContent.children.installmentCard.children",
            onMultiItemAdd: (state, multiItemContent) => {
              // muliItemContent["dueDateForInstallment"]["visible"] = true;
              return multiItemContent;
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
  uiFramework: "custom-containers-local",
  moduleName: "egov-estate",
  componentPath: "RadioGroupContainer",
  gridDefination: {
    xs: 12,
    sm: 6,
  },
  jsonPath: "Properties[0].propertyDetails.paymentConfig.isGroundRent",
  props: {
    label: {
      name: "Demand",
      key: "ES_DEMAND_LABEL"
    },
    buttons: [{
        labelName: "Ground Rent",
        labelKey: "ES_GROUND_RENT_LABEL",
        value: true
      },
      {
        label: "License Fee",
        labelKey: "ES_LICENSE_FEE_LABEL",
        value: false
      }
    ],
    jsonPath: "Properties[0].propertyDetails.paymentConfig.isGroundRent",
    required: true
  },
  required: true,
  type: "array",
  beforeFieldChange: (action, state, dispatch) => {
    dispatch(
      handleField(
        action.screenKey,
        `components.div.children.${paymentStep}.children.groundRentDetails`,
        "visible",
        action.value === "true"
      )
    )
    dispatch(
      handleField(
        action.screenKey,
        `components.div.children.${paymentStep}.children.licenseFeeDetails`,
        "visible",
        action.value === "false"
      )
    )
    dispatch(
      handleField(
        action.screenKey,
        `components.div.children.${summaryStep}.children.${reviewContainer}.children.cardContent.children.reviewGroundRent`,
        "visible",
        action.value === "true"
      )
    )
    dispatch(
      handleField(
        action.screenKey,
        `components.div.children.${summaryStep}.children.${reviewContainer}.children.cardContent.children.reviewLicenseFee`,
        "visible",
        action.value === "false"
      )
    )
    dispatch(
      handleField(
        action.screenKey,
        `components.div.children.${summaryStep}.children.${reviewContainer}.children.cardContent.children.reviewAdvanceRent`,
        "visible",
        true
      )
    )
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
  required: true,
  errorMessage:"ES_ERR_GROUND_RENT",
  jsonPath: "Properties[0].propertyDetails.paymentConfig.groundRentGenerationType",
  props: {
    data: [
      {code: "Monthly"},
      {code: "Annually"}
    ]
  },
  beforeFieldChange: (action, state, dispatch) => {
    let jsonpath = action.componentJsonpath.split(".");
    jsonpath.pop();
    jsonpath = jsonpath.join(".")

    dispatch(
      handleField(
        action.screenKey,
        `${jsonpath}.dateToGenerateDemandRent`,
        "visible",
        !!(action.value == "Monthly")
      )
    )
  },
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
  errorMessage:"ES_ERR_START_DATE",
  jsonPath: "Properties[0].propertyDetails.paymentConfig.groundRentBillStartDate",
  required: true
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
  jsonPath: "Properties[0].propertyDetails.paymentConfig.groundRentGenerateDemand",
  gridDefination: {
    xs: 12,
    sm: 6
  },
  required: true,
  errorMessage:"ES_ERR_GENERATION_DATE",
  props: {
      data: data
  },
  visible: false
}

const rentAmountField = {
  label: {
      labelName: "Monthly/ Yearly Rent",
      labelKey: "ES_MONTHLY_YEARLY_RENT_LABEL"
  },
  placeholder: {
      labelName: "Enter Monthly/ Yearly Rent",
      labelKey: "ES_MONTHLY_YEARLY_RENT_PLACEHOLDER"
  },
  gridDefination: {
      xs: 12,
      sm: 3
  },
  maxLength: 100,
  minLength: 1,
  required: true,
  errorMessage:"ES_ERR_MONTHLY_YEARLY_RENT",
  pattern: _getPattern("float"),
  jsonPath: "Properties[0].propertyDetails.paymentConfig.paymentConfigItems[0].groundRentAmount"
}

const startYearField = {
  label: {
      labelName: "Start Month/ Year",
      labelKey: "ES_START_MONTH_YEAR_LABEL"
  },
  placeholder: {
      labelName: "Enter Start Month/ Year",
      labelKey: "ES_START_MONTH_YEAR_PLACEHOLDER"
  },
  gridDefination: {
      xs: 12,
      sm: 3
  },
  maxLength: 100,
  minLength: 1,
  props: {
    disabled: true,
  },
  jsonPath: "Properties[0].propertyDetails.paymentConfig.paymentConfigItems[0].groundRentStartMonth"
}

const endYearField = {
  label: {
      labelName: "End Month/ Year",
      labelKey: "ES_END_MONTH_YEAR_LABEL"
  },
  placeholder: {
      labelName: "Enter End Month/ Year",
      labelKey: "ES_END_MONTH_YEAR_PLACEHOLDER"
  },
  gridDefination: {
      xs: 12,
      sm: 3
  },
  maxLength: 100,
  minLength: 1,
  required: true,
  props: {
    type: "number"
  },
  jsonPath: "Properties[0].propertyDetails.paymentConfig.paymentConfigItems[0].groundRentEndMonth",
  afterFieldChange: (action, state, dispatch) => {
    const {componentJsonpath, value} = action
    const index = Number((componentJsonpath.split("]")[0]).split("[")[1])
    const items = get(state, "screenConfiguration.preparedFinalObject.Properties[0].propertyDetails.paymentConfig.paymentConfigItems");
    const findIndex = items.findIndex((item, ind) =>  ind > index && !item.isDeleted)
    if(findIndex !== -1) {
      const groundRentStartMonth = Number(value) + 1 + "";
      let componentJsonPath = `components.div.children.${paymentStep}.children.groundRentDetails.children.cardContent.children.rentContainer.children.cardContent.children.detailsContainer.children.multipleRentContainer.children.multipleRentInfo.props.items[${findIndex}].item${findIndex}.children.cardContent.children.rentCard.children.startYear`;

      if (screenName == "edit-rent-info") {
        componentJsonPath = `components.div.children.reviewRentInfo.children.cardContent.children.rentTable.children.cardContent.children.detailsContainer.children.multipleRentContainer.children.multipleRentInfo.props.items[${findIndex}].item${findIndex}.children.cardContent.children.rentCard.children.startYear`
      }
      dispatch(handleField(
        screenName,
        componentJsonPath,
        "props.value",
        groundRentStartMonth
      ))
    }
    const startValue = get(state.screenConfiguration.preparedFinalObject, `Properties[0].propertyDetails.paymentConfig.paymentConfigItems[${index}].groundRentStartMonth`)
    dispatch(prepareFinalObject(`Properties[0].propertyDetails.paymentConfig.paymentConfigItems[${index}].tillDate`, (value-startValue)+1))
  }
}

const commonRentInformation = () => {
  return getCommonGrayCard({
    rentCard: getCommonContainer({
      rentAmount: getTextField(rentAmountField),
      startYear: getTextField(startYearField),
      endYear: getTextField(endYearField),
      totalMonths: getLabelWithValue({
        labelName: "Till",
        labelKey: "ES_TILL_LABEL_IN_YEARS"
      },
      {
        jsonPath: "Properties[0].propertyDetails.paymentConfig.paymentConfigItems[0].tillDate",
        callBack: (value) =>  {
          const state = store.getState()
          const groundRentGenerationType = get(state.screenConfiguration.preparedFinalObject, "Properties[0].propertyDetails.paymentConfig.groundRentGenerationType")
          if(groundRentGenerationType === "Annually") {
            if(value) {
              return value + " Year(s)"
            }
            return "-"
          } else if(groundRentGenerationType === "Monthly") {
            if (value) {
              const years = (Number(value) / 12 | 0)
              const months = Number(value) % 12
              if(years > 0 && months > 0) {
                return years + " Year(s) " + months +" Month(s)"
              } else if(years < 1) {
                return months + " Month(s)"
              } else if(months < 1) {
                return years + " Year(s)"
              }
            }
            return "-"
          }
        }
      }
      )
    })
  });
};

export const rentDetails = getCommonGrayCard({
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
        header: getCommonTitle({
          labelName: "Rent",
          labelKey: "ES_RENT"
        }, {
          style: {
            marginBottom: 18
          }
        }),
        multipleRentInfo: {
          uiFramework: "custom-containers-local",
          moduleName: "egov-estate",
          componentPath: "MultiItem",
          props: {
            scheama: commonRentInformation(),
            items: [],
            addItemLabel: {
              labelName: "Add Rent",
              labelKey: "ES_COMMON_ADD_RENT_LABEL"
            },
            headerName: "Rent",
            headerJsonPath: "children.cardContent.children.header.children.Rent.props.label",
            sourceJsonPath: "Properties[0].propertyDetails.paymentConfig.paymentConfigItems",
            prefixSourceJsonPath: "children.cardContent.children.rentCard.children",
            afterPrefixJsonPath: "children.value.children.key",
            onMultiItemAdd: (state, multiItemContent, updatePreparedFormObject) => {
              let rent = get(
                state.screenConfiguration.preparedFinalObject,
                "Properties[0].propertyDetails.paymentConfig.paymentConfigItems",
                []
              );
              const rentItems = rent.filter(item => !item.isDeleted)
              if (rentItems.length) {
                let lastAddedEndYear = rentItems[rentItems.length - 1].groundRentEndMonth;
                multiItemContent.startYear.props.value = Number(lastAddedEndYear) + 1;
                updatePreparedFormObject(`Properties[0].propertyDetails.paymentConfig.paymentConfigItems[${rent.length}]`, {groundRentStartMonth: Number(lastAddedEndYear) + 1 + ""})
              } 
              return multiItemContent;
            },
            onMultiItemDelete: (state, deletedIndex, changeField) => {
              let rent = get(
                state.screenConfiguration.preparedFinalObject,
                "Properties[0].propertyDetails.paymentConfig.paymentConfigItems",
                []
              );
                const previewYearObj = rent.filter((item, index) => index < deletedIndex && !item.isDeleted).pop()
                const nextYearObj = rent.findIndex((item, index) => index > deletedIndex && !item.isDeleted)
                let changeFieldPath = `components.div.children.${paymentStep}.children.groundRentDetails.children.cardContent.children.rentContainer.children.cardContent.children.detailsContainer.children.multipleRentContainer.children.multipleRentInfo.props.items[${nextYearObj}].item${nextYearObj}.children.cardContent.children.rentCard.children.startYear`;
                if (screenName == "edit-rent-info") {
                  changeFieldPath = `components.div.children.reviewRentInfo.children.cardContent.children.rentTable.children.cardContent.children.detailsContainer.childre.multipleRentContainer.children.multipleRentInfo.props.items[${nextYearObj}].item${nextYearObj}.children.cardContent.children.rentCard.children.startYear`
                }
                nextYearObj !== -1 && changeField(
                  screenName,
                  changeFieldPath,
                  "props.value",
                  !!previewYearObj && !!previewYearObj.groundRentEndMonth ? Number(previewYearObj.groundRentEndMonth)+1 + "" : "0"
                )
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
  minLength: 1,
  required: true,
  errorMessage:"ES_ERR_LICENCE_FEE_TYPE",
  jsonPath: "Properties[0].propertyDetails.paymentConfig.groundRentGenerationType",
  props: {
    data: [
      {code: "Monthly"},
      {code: "Annually"}
    ]
  },
  beforeFieldChange: (action, state, dispatch) => {
    let jsonpath = action.componentJsonpath.split(".");
    jsonpath.pop();
    jsonpath = jsonpath.join(".")

    dispatch(
      handleField(
        action.screenKey,
        `${jsonpath}.dateToGenerateDemandLf`,
        "visible",
        !!(action.value == "Monthly")
      )
    )
  },
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
  jsonPath: "Properties[0].propertyDetails.paymentConfig.groundRentGenerateDemand",
  gridDefination: {
    xs: 12,
    sm: 6
  },
  required: true,
  errorMessage:"ES_ERR_DATE_LICENSE_FEE",
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
  errorMessage:"ES_ERR_START_DATE",
  jsonPath: "Properties[0].propertyDetails.paymentConfig.groundRentBillStartDate",
  gridDefination: {
    xs: 12,
    sm: 6
  },
  required: true
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
      sm: 3
  },
  maxLength: 100,
  minLength: 1,
  required: true,
  jsonPath: "Properties[0].propertyDetails.paymentConfig.paymentConfigItems[0].groundRentAmount"
}

const startYearLfField = {
  label: {
      labelName: "Start Month/ Year",
      labelKey: "ES_START_MONTH_YEAR_LABEL"
  },
  placeholder: {
      labelName: "Enter Start Month/ Year",
      labelKey: "ES_START_MONTH_YEAR_PLACEHOLDER"
  },
  gridDefination: {
      xs: 12,
      sm: 3
  },
  props: {
    disabled: true,
  },
  maxLength: 100,
  minLength: 1,
  jsonPath: "Properties[0].propertyDetails.paymentConfig.paymentConfigItems[0].groundRentStartMonth"
}

const endYearLfField = {
  label: {
      labelName: "End Month/ Year",
      labelKey: "ES_END_MONTH_YEAR_LABEL"
  },
  placeholder: {
      labelName: "Enter End Month/ Year",
      labelKey: "ES_END_MONTH_YEAR_PLACEHOLDER"
  },
  gridDefination: {
      xs: 12,
      sm: 3
  },
  maxLength: 100,
  minLength: 1,
  required: true,
  jsonPath: "Properties[0].propertyDetails.paymentConfig.paymentConfigItems[0].groundRentEndMonth",
  afterFieldChange: (action, state, dispatch) => {
    const {componentJsonpath, value} = action
    const index = Number((componentJsonpath.split("]")[0]).split("[")[1])
    const items = get(state, "screenConfiguration.preparedFinalObject.Properties[0].propertyDetails.paymentConfig.paymentConfigItems");
    const findIndex = items.findIndex((item, ind) =>  ind > index && !item.isDeleted)
    if(findIndex !== -1) {
      const groundRentStartMonth = Number(value) + 1 + ""
      dispatch(handleField(
        screenName,
        `components.div.children.${paymentStep}.children.licenseFeeDetails.children.cardContent.children.licenseFeeForYearContainer.children.cardContent.children.detailsContainer.children.multipleLicenseContainer.children.multipleLicenseInfo.props.items[${findIndex}].item${findIndex}.children.cardContent.children.licenseCard.children.startYear`,
        "props.value",
        groundRentStartMonth
      ))
    }
    const startValue = get(state.screenConfiguration.preparedFinalObject, `Properties[0].propertyDetails.paymentConfig.paymentConfigItems[${index}].groundRentStartMonth`)
    dispatch(prepareFinalObject(`Properties[0].propertyDetails.paymentConfig.paymentConfigItems[${index}].tillDate`, (value-startValue)+1))
  }
}

const commonLicenseInformation = () => {
  return getCommonGrayCard({
    licenseCard: getCommonContainer({
      licenseFee: getTextField(licenseFeeField),
      startYear: getTextField(startYearLfField),
      endYear: getTextField(endYearLfField),
      totalMonths: getLabelWithValue({
        labelName: "Till",
        labelKey: "ES_TILL_LABEL_IN_YEARS"
      },
      {
        jsonPath: "Properties[0].propertyDetails.paymentConfig.paymentConfigItems[0].tillDate",
        callBack: (value) =>  {
          const state = store.getState()
          const groundRentGenerationType = get(state.screenConfiguration.preparedFinalObject, "Properties[0].propertyDetails.paymentConfig.groundRentGenerationType")
          if(groundRentGenerationType === "Annually") {
            if(value) {
              return value + " Year(s)"
            }
            return "-"
          } else if(groundRentGenerationType === "Monthly") {
            if (value) {
              const years = (Number(value) / 12 | 0)
              const months = Number(value) % 12
              if(years > 0 && months > 0) {
                return years + " Year(s) " + months +" Month(s)"
              } else if(years < 1) {
                return months + " Month(s)"
              } else if(months < 1) {
                return years + " Year(s)"
              }
            }
            return "-"
          }
        }
      }
      )
    })
  });
};

export const licenseFeeForYearDetails = getCommonGrayCard({
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
        header: getCommonTitle({
          labelName: "License Fee for Year",
          labelKey: "ES_LICENSE_FEE_FOR_YEAR"
        }, {
          style: {
            marginBottom: 18
          }
        }),
        multipleLicenseInfo: {
          uiFramework: "custom-containers-local",
          moduleName: "egov-estate",
          componentPath: "MultiItem",
          props: {
            scheama: commonLicenseInformation(),
            items: [],
            addItemLabel: {
              labelName: "Add License Fee",
              labelKey: "ES_COMMON_LICENSE_FEE_LABEL"
            },
            headerName: "License Fee for Year",
            // headerJsonPath: "children.cardContent.children.header.children.key.props.labelKey",
            headerJsonPath: "children.cardContent.children.header.children.License Fee.props.label",
            sourceJsonPath: "Properties[0].propertyDetails.paymentConfig.paymentConfigItems",
            prefixSourceJsonPath: "children.cardContent.children.licenseCard.children",

            afterPrefixJsonPath: "children.value.children.key",

            onMultiItemAdd: (state, multiItemContent, updatePreparedFormObject) => {
              let rent = get(
                state.screenConfiguration.preparedFinalObject,
                "Properties[0].propertyDetails.paymentConfig.paymentConfigItems",
                []
              );
              const rentItems = rent.filter(item => !item.isDeleted)
              if (rentItems.length) {
                let lastAddedEndYear = rentItems[rentItems.length - 1].groundRentEndMonth;
                multiItemContent.startYear.props.value = Number(lastAddedEndYear) + 1;
                updatePreparedFormObject(`Properties[0].propertyDetails.paymentConfig.paymentConfigItems[${rent.length}]`, {groundRentStartMonth: Number(lastAddedEndYear) + 1 + ""})
              } 
              return multiItemContent;
            },
            onMultiItemDelete: (state, deletedIndex, changeField) => {
              let rent = get(
                state.screenConfiguration.preparedFinalObject,
                "Properties[0].propertyDetails.paymentConfig.paymentConfigItems",
                []
              );
                const previewYearObj = rent.filter((item, index) => index < deletedIndex && !item.isDeleted).pop()
                const nextYearObj = rent.findIndex((item, index) => index > deletedIndex && !item.isDeleted)
                nextYearObj !== -1 && changeField(
                  screenName,
                  `components.div.children.${paymentStep}.children.licenseFeeDetails.children.cardContent.children.licenseFeeForYearContainer.children.cardContent.children.detailsContainer.children.multipleLicenseContainer.children.multipleLicenseInfo.props.items[${nextYearObj}].item${nextYearObj}.children.cardContent.children.licenseCard.children.startYear`,
                  "props.value",
                  !!previewYearObj && !!previewYearObj.groundRentEndMonth ? Number(previewYearObj.groundRentEndMonth)+1 + "" : "0"
                )
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
      billingStartDateLf: getDateField(billingStartDateLicenseFeeField),
      dateToGenerateDemandLf: getSelectField(dateToGenerateDemandLicenseFeeField),
      advanceRent: getTextField(advancedRentField),
      dateOfPaymentOfAdvanceRent: getDateField(dateOfPaymentOfAdvanceRentField)
  }),
  licenseFeeForYearContainer: licenseFeeForYearDetails
})


/******************** Security Fee Details ********************/ 
/* const securityFeeAmountField = {
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
  jsonPath: "Properties[0].propertyDetails.paymentConfig.securityAmount"
} */

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
  errorMessage:"ES_ERR_DATE_OF_PAYMENT",
  jsonPath: "Properties[0].propertyDetails.paymentConfig.dueDateOfPayment",
  required: true
}

const getMonthsOfRentRadioButton = {
  uiFramework: "custom-containers-local",
  moduleName: "egov-estate",
  componentPath: "RadioGroupContainer",
  gridDefination: {
    xs: 12,
    sm: 6,
  },

  jsonPath: "Properties[0].propertyDetails.paymentConfig.noOfMonths",
  props: {
    label: {
      name: "Select",
      key: "ES_SELECT"
    },
    buttons: [{
        labelName: "2 months of rent",
        labelKey: "ES_TWO_MONTHS_RENT_LABEL",
        value: 2
      },
      {
        label: "3 months rent",
        labelKey: "ES_THREE_MONTHS_RENT_LABEL",
        value: 3
      },
      {
        label: "6 months rent",
        labelKey: "ES_SIX_MONTHS_RENT_LABEL",
        value: 6
      },
      {
        label: "12 months rent",
        labelKey: "ES_TWELVE_MONTHS_RENT_LABEL",
        value: 12
      }
    ],
    jsonPath: "Properties[0].propertyDetails.paymentConfig.noOfMonths",
    required: true
  },
  required: true,
  type: "array"
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
      // securityFeeAmount: getTextField(securityFeeAmountField),
      monthsOfRent: getMonthsOfRentRadioButton,
      securityFeeDateOfPayment: getDateField(dateOfPaymentField),
      
  })
})

/******************** Interest Details ********************/
const getInterestFixedRadioButton = {
  uiFramework: "custom-containers-local",
  moduleName: "egov-estate",
  componentPath: "RadioGroupContainer",
  gridDefination: {
    xs: 12,
    sm: 6,
  },
  jsonPath: "Properties[0].propertyDetails.paymentConfig.isIntrestApplicable",
  props: {
    label: {
      name: "Interest fixed?",
      key: "ES_INTEREST_FIXED_LABEL"
    },
    buttons: [{
        labelName: "Yes",
        labelKey: "ES_COMMON_YES",
        value: true
      },
      {
        label: "No",
        labelKey: "ES_COMMON_NO",
        value: false
      }
    ],
    jsonPath: "Properties[0].propertyDetails.paymentConfig.isIntrestApplicable",
    required: true
  },
  required: true,
  type: "array",
  afterFieldChange: (action, state, dispatch) => {
    let isInterestFixedLabel = (action.value == "true") ? "ES_FIXED_INTEREST_LABEL" : "ES_YEARLY_INTEREST_LABEL";
    let isInterestFixedPlaceholder = (action.value == "true") ? "ES_FIXED_INTEREST_PLACEHOLDER" : "ES_YEARLY_INTEREST_PLACEHOLDER";
      dispatch(
        handleField(
          action.screenKey,
          `components.div.children.${paymentStep}.children.interestDetails.children.cardContent.children.detailsContainer.children.percentageOfInterest`,
          "props.label.labelKey",
          isInterestFixedLabel
        )
      )
      dispatch(
        handleField(
          action.screenKey,
          `components.div.children.${paymentStep}.children.interestDetails.children.cardContent.children.detailsContainer.children.percentageOfInterest`,
          "props.placeholder.labelKey",
          isInterestFixedPlaceholder
        )
      )
  }
}

const percentageOfInterestField = {
  label: {
      labelName: "Yearly interest",
      labelKey: "ES_YEARLY_INTEREST_LABEL"
  },
  placeholder: {
      labelName: "Enter yearly interest",
      labelKey: "ES_YEARLY_INTEREST_PLACEHOLDER"
  },
  gridDefination: {
      xs: 12,
      sm: 6
  },
  required: true,
  errorMessage:"ES_ERR_YEARLY_INTEREST_FEILD",
  pattern: _getPattern("float"),
  jsonPath: "Properties[0].propertyDetails.paymentConfig.rateOfInterest"
}

const interestDetailsHeader = getCommonTitle({
  labelName: "Interest Details",
  labelKey: "ES_INTEREST_DETAILS_HEADER"
}, {
  style: {
      marginBottom: 18,
      marginTop: 18
  }
})

export const interestDetails = getCommonCard({
  header: interestDetailsHeader,
  detailsContainer: getCommonContainer({
    interestFixed: getInterestFixedRadioButton,
    percentageOfInterest: getTextField(percentageOfInterestField)
  })
})