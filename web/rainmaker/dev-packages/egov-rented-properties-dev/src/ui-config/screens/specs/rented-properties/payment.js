import { getRentSummaryCard, getCommonApplyFooter } from "../utils";
import { prepareFinalObject, handleScreenConfigurationFieldChange as handleField } from "egov-ui-framework/ui-redux/screen-configuration/actions";
const { getCommonHeader, getCommonCard, getCommonContainer, getTextField, getSelectField, getCommonGrayCard, getCommonTitle, getLabel } = require("egov-ui-framework/ui-config/screens/specs/utils");
const { transitSiteHeader, transitNumberLookUp, colonyFieldConfig, pincodeField } = require("./applyResource/propertyDetails");
const { getRentPaymentPropertyDetails } = require("../../../../ui-utils/apply");
const { ownerNameField } = require("./applyResource/rentHolderDetails");

const header = process.env.REACT_APP_NAME === "Citizen" ?
getCommonHeader({
    labelName: "Online Rent Payment",
    labelKey: "RP_ONLINE_RENT_PAYMENT_HEADER"
})
: getCommonHeader({
    labelName: "Offline Rent Payment",
    labelKey: "RP_OFFLINE_RENT_PAYMENT_HEADER"
  });

const transitNumberField = {
  ...transitNumberLookUp,
  jsonPath: "property.transitNumber",
  iconObj: {
    ...transitNumberLookUp.iconObj,
    onClickDefination: {
      action: "condition",
      callBack: (state, dispatch) => {
        getRentPaymentPropertyDetails(state, dispatch);
      }
    }
  },
  afterFieldChange: (action, state, dispatch)=> { 
    dispatch(prepareFinalObject("Properties", []))
    dispatch(handleField(
      "payment",
      "components.div.children.detailsContainer.children.rentSummaryDetails",
      "visible",
      false
    ))
  }
}

const propertyDetails = getCommonCard({
  header: transitSiteHeader,
  detailsContainer: getCommonContainer({
    transitNumber: getTextField(transitNumberField),
    colony: getSelectField({
      ...colonyFieldConfig,
      props: {
        ...colonyFieldConfig.props,
        disabled: true
      },
      jsonPath: "Properties[0].propertyDetails.address.colony"
    }),
    pincode: getTextField({
      ...pincodeField,
      props: {
        ...pincodeField.props,
        disabled: true
      },
      jsonPath: "Properties[0].propertyDetails.address.pincode"
    }),
    ownername: getTextField({...ownerNameField,
      props: {
        ...ownerNameField.props,
        disabled: true
      },
    })
  })
})

const rentSummaryHeader = getCommonTitle({
  labelName: "Rent Summary",
  labelKey: "RP_RENT_SUMMARY_HEADER"
}, {
  style: {
    marginBottom: 18,
    marginTop: 18
  }
})

const rentSummary = getCommonGrayCard({
  rentSection: getRentSummaryCard({
    sourceJsonPath: "Properties[0].rentSummary"
  })
});

const rentSummaryDetails = {
  uiFramework: "custom-atoms",
  componentPath: "Div",
  children: {
  rentCard: getCommonCard({
    header: rentSummaryHeader,
    detailsContainer: rentSummary
  })
  },
  visible: false
}

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
  jsonPath: "paymentInfo.amount",
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
  jsonPath: "paymentInfo.bankName",
  visible: process.env.REACT_APP_NAME !== "Citizen"
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
  jsonPath: "paymentInfo.transactionNumber",
  visible: process.env.REACT_APP_NAME !== "Citizen"
}

const paymentInfo = getCommonCard({
  header: paymentInfoHeader,
  detailsContainer: getCommonContainer({
    amount: getTextField(amountField),
    bankName: getTextField(bankNameField),
    transactionNumber: getTextField(transactionNumberField)
  })
})


const detailsContainer = {
    uiFramework: "custom-atoms",
    componentPath: "Form",
    props: {
      id: "apply_form1"
    },
    children: {
      propertyDetails,
      rentSummaryDetails,
      paymentInfo
    },
    visible: true
  }

const paymentFooter = getCommonApplyFooter({
  makePayment: {
    componentPath: "Button",
    props: {
      variant: "contained",
      color: "primary",
      style: {
        minWidth: "180px",
        height: "48px",
        marginRight: "45px",
        borderRadius: "inherit"
      }
    },
    children: {
      submitButtonLabel: getLabel({
        labelName: "MAKE PAYMENT",
        labelKey: "COMMON_MAKE_PAYMENT"
      })
    },
    onClickDefination: {
      action: "condition",
      callBack: (state, dispatch) => {
        console.log("=====state", state)
        // dispatch(
        //   setRoute(
        //    `/rented-properties-citizen/pay?consumerCode=${applicationNumber}&tenantId=${tenantId}&businessService=${businessService}`
        //   )
        // );
      },

    },
    visible: process.env.REACT_APP_NAME === "Citizen"
  }
})

const payment = {
    uiFramework: "material-ui",
    name: "payment",
    components: {
        div: {
          uiFramework: "custom-atoms",
          componentPath: "Div",
          props: {
            className: "common-div-css"
          },
          children: {
            headerDiv: {
              uiFramework: "custom-atoms",
              componentPath: "Container",
              children: {
                header: {
                  gridDefination: {
                    xs: 12,
                    sm: 10
                  },
                  ...header
                }
              }
            },
            detailsContainer,
            footer: paymentFooter
          }
        }
      }
}

export default payment;