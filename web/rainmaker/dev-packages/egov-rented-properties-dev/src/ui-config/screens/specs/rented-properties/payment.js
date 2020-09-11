import { getRentSummaryCard, getCommonApplyFooter } from "../utils";
import { prepareFinalObject, handleScreenConfigurationFieldChange as handleField, toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { get } from "lodash";
const { getCommonHeader, getCommonCard, getCommonContainer, getTextField, getSelectField, getCommonGrayCard, getCommonTitle, getLabel } = require("egov-ui-framework/ui-config/screens/specs/utils");
const { transitSiteHeader, transitNumberLookUp, colonyFieldConfig, pincodeField } = require("./applyResource/propertyDetails");
const { getRentPaymentPropertyDetails } = require("../../../../ui-utils/apply");
const { ownerNameField } = require("./applyResource/rentHolderDetails");
import { httpRequest } from "../../../../ui-utils";
import { BILLING_BUSINESS_SERVICE_RENT, ONLINE, OFFLINE } from "../../../../ui-constants";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import { validateFields } from "egov-ui-framework/ui-utils/commons";
import {getColonyTypes} from "../rented-properties/apply"
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
      placeholder: {
        labelName: "",
        labelKey: ""
      },
      props: {
        ...colonyFieldConfig.props,
        disabled: true
      },
      required: false,
      jsonPath: "Properties[0].propertyDetails.address.colony"
    }),
    pincode: getTextField({
      ...pincodeField,
      placeholder: {
        labelName: "",
        labelKey: ""
      },
      props: {
        ...pincodeField.props,
        disabled: true
      },
      required: false,
      jsonPath: "Properties[0].propertyDetails.address.pincode"
    }),
    ownername: getTextField({...ownerNameField,
      placeholder: {
        labelName: "",
        labelKey: ""
      },
      props: {
        ...ownerNameField.props,
        disabled: true
      },
      required: false
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
  minLength: 3,
  maxLength: 7,
  jsonPath: "paymentInfo.amount",
  errorMessage: "RP_ERR_AMOUNT_FIELD",
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

const getConsumerCode = async (state, dispatch, payload) => {
  try {
    let response = await httpRequest(
      "post",
      "/rp-services/property/_payrent",
      "",
      [],
      payload
    );
    return response;
  } catch (e) {
    dispatch(toggleSnackbar(true, { labelName: e.message }, "error"));
    // console.log(e);
  }
} 

const goToPayment = async (state, dispatch, type) => {

  const isTransitValid = validateFields(
    "components.div.children.detailsContainer.children.propertyDetails.children.cardContent.children.detailsContainer.children",            
    state,
    dispatch,
    "payment"
  )
  const isPaymentInfoValid = validateFields(
    "components.div.children.detailsContainer.children.paymentInfo.children.cardContent.children.detailsContainer.children",            
    state,
    dispatch,
    "payment"
  )
  if(!!isTransitValid && !!isPaymentInfoValid) {
    const paymentInfo = get(state.screenConfiguration.preparedFinalObject, "paymentInfo")
    let propertyId = get(state.screenConfiguration.preparedFinalObject, "Properties[0].propertyDetails.propertyId")
    let id;
    if(!propertyId) {
       id = await getRentPaymentPropertyDetails(state, dispatch)
    }
    if(!!propertyId || !!id) {
      const payload = {Properties: [{
        id: propertyId || id,
        paymentAmount: paymentInfo.amount,
        transactionId: paymentInfo.transactionNumber,
        bankName: paymentInfo.bankName
      }]}
      const response = await getConsumerCode(state, dispatch, payload)
      if(!!response && !!response.Properties.length){
        const {rentPaymentConsumerCode, tenantId} = response.Properties[0]
        type === ONLINE ? dispatch(
            setRoute(
             `/rented-properties-citizen/pay?consumerCode=${rentPaymentConsumerCode}&tenantId=${tenantId}&businessService=${BILLING_BUSINESS_SERVICE_RENT}`
            )
          ) : dispatch(
            setRoute(
            `/rented-properties/acknowledgement?purpose=pay&applicationNumber=${rentPaymentConsumerCode}&status=success&tenantId=${tenantId}&type=${BILLING_BUSINESS_SERVICE_RENT}`
             
            )
          )
        dispatch(prepareFinalObject("Properties", response.Properties))
      }
    }
  } else {
    dispatch(toggleSnackbar(true, {labelName: "ERR_FILL_RENTED_MANDATORY_FIELDS", labelKey: "ERR_FILL_RENTED_MANDATORY_FIELDS"}, "warning"))
  }
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
        goToPayment(state, dispatch, ONLINE)
      },

    },
    visible: process.env.REACT_APP_NAME === "Citizen"
  },
  submit: {
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
        labelName: "Submit",
        labelKey: "TL_COMMON_BUTTON_SUBMIT"
      })
    },
    onClickDefination: {
      action: "condition",
      callBack: (state, dispatch) => {
        goToPayment(state, dispatch, OFFLINE)
      },
    },
    visible: process.env.REACT_APP_NAME !== "Citizen"
  }
})
const beforeInitFn =async(action, state, dispatch)=>{
  getColonyTypes(action, state, dispatch);
}
const payment = {
    uiFramework: "material-ui",
    name: "payment",
    beforeInitScreen: (action, state, dispatch) => {
      beforeInitFn(action, state, dispatch);
      dispatch(prepareFinalObject("Properties", []));
      dispatch(prepareFinalObject("property", {}))
      dispatch(prepareFinalObject("paymentInfo", {}))
      return action;
    },
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