import { handleScreenConfigurationFieldChange as handleField, prepareFinalObject,toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getCommonHeader, getCommonCard, getCommonContainer, getTextField, getSelectField,getPattern, getCommonGrayCard, getCommonTitle, getLabel, getDateField  } from "egov-ui-framework/ui-config/screens/specs/utils";
import commonConfig from "config/common.js";
import { httpRequest } from "../../../../ui-utils";
import get from "lodash/get";
import { ESTATE_SERVICES_MDMS_MODULE } from "../../../../ui-constants";
import { getSearchResults } from "../../../../ui-utils/commons";
import { propertyInfo } from "./preview-resource/preview-properties";
import { getQueryArg, getTodaysDateInYMD } from "egov-ui-framework/ui-utils/commons";
import { convertDateToEpoch, validateFields } from "../utils";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";

  const header = getCommonHeader({
    labelName: "Rent Payment",
    labelKey: "ES_RENT_PAYMENT_HEADER"
  });

 export const getMdmsData = async (dispatch) => {
    let mdmsBody = {
      MdmsCriteria: {
        tenantId: commonConfig.tenantId,
        moduleDetails: [{
          moduleName: ESTATE_SERVICES_MDMS_MODULE,
          masterDetails: [{
           name: "paymentType"
          }]
        }]
      }
    };
    try {
      let payload = await httpRequest(
        "post",
        "/egov-mdms-service/v1/_search",
        "_search",
        [],
        mdmsBody
      );
      dispatch(prepareFinalObject("searchScreenMdmsData", payload.MdmsRes));
    } catch (e) {
      console.log(e);
    }
  }
  
  const beforeInitFn = async(action, state, dispatch)=>{
    getMdmsData(dispatch);
    let propertyId = getQueryArg(window.location.href, "propertyId")
    const queryObject = [
      {key: "propertyId", value: propertyId}
    ]
    const response = await getSearchResults(queryObject)
    if(!!response.Properties && !!response.Properties.length) {
       dispatch(prepareFinalObject("Properties", response.Properties))
    }
  }

  const propertyDetailsHeader = getCommonTitle(
    {
        labelName: "Property Details",
        labelKey: "ES_PROPERTY_DETAILS_HEADER"
    },
    {
        style: {
                marginBottom: 18,
                marginTop: 18
        }
    }
  )

  const offlinePaymentDetailsHeader = getCommonTitle(
    {
        labelName: "Offline Payment Details",
        labelKey: "ES_OFFLINE_PAYMENT_DETAILS_HEADER"
    },
    {
        style: {
                marginBottom: 18,
                marginTop: 18
        }
    }
  )

  const fileNumberField = {
    label: {
        labelName: "File Number",
        labelKey: "ES_FILE_NUMBER_LABEL"
      },
      placeholder: {
        labelName: "Enter File Number",
        labelKey: "ES_FILE_NUMBER_PLACEHOLDER"
      },
    gridDefination: {
        xs: 12,
        sm: 6
    },
    required: true,
    jsonPath: "searchScreenFileNo.fileNumber",
    disabled: true
  }

  const paymentType = {
    label: {
        labelName: "Payment Type",
        labelKey: "ES_PAYMENT_TYPE_LABEL"
      },
    required: false,
    jsonPath: "payment.paymentType",
    optionValue: "code",
    optionLabel: "name",
    sourceJsonPath: "searchScreenMdmsData.EstateServices.paymentType",
    gridDefination: {
        xs: 12,
        sm: 6
    },
    errorMessage: "ES_ERR_PAYMENT_TYPE_FIELD",
    placeholder: {
      labelName: "Select Payment Type",
      labelKey: "ES_SELECT_PAYMENT_TYPE_PLACEHOLDER"
  },
    required: true,
    jsonPath: "payment.paymentType",
    visible: process.env.REACT_APP_NAME !== "Citizen"
  }

  const paymentDate = {
    label: {
      labelName: "Date of Payment",
      labelKey: "ES_DATE_OF_PAYMENT"
    },
    placeholder: {
        labelName: "Enter Date of paymet",
        labelKey: "ES_DATE_OF_PAYMENT_PLACEHOLDER"
    },
    required: true,
    pattern: getPattern("Date"),
    jsonPath: "payment.dateOfPayment",
    props: {
      inputProps: {
        max: getTodaysDateInYMD()
    }
    },
    afterFieldChange: (action, state, dispatch) => {
      dispatch(prepareFinalObject(
        "payment.dateOfPayment", convertDateToEpoch(action.value)
      ))
    }
  }

  const paymentAmount = {
    label: {
        labelName: "Amount",
        labelKey: "ES_AMOUNT_LABEL"
    },
    gridDefination: {
        xs: 12,
        sm: 6
    },
    errorMessage: "ES_ERR_AMOUNT_FIELD",
    placeholder: {
      labelName: "Enter amount",
      labelKey: "ES_ENTER_AMOUNT_PLACEHOLDER"
  },
    required: true,
    jsonPath: "payment.paymentAmount"
  }

  const bankName = {
    label: {
        labelName: "Bank Name",
        labelKey: "ES_BANK_NAME_LABEL"
    },
    gridDefination: {
        xs: 12,
        sm: 6
    },
    errorMessage: "ES_ERR_BANK_NAME_FIELD",
    placeholder: {
      labelName: "Enter Bank Name",
      labelKey: "ES_ENTER_BANK_NAME_PLACEHOLDER"
  },
    required: true,
    jsonPath: "payment.bankName",
    visible: process.env.REACT_APP_NAME !== "Citizen"
  }

  const transactionId = {
    label: {
        labelName: "Transaction ID",
        labelKey: "ES_TRANSACTION_ID_LABEL"
    },
    gridDefination: {
        xs: 12,
        sm: 6
    },
    errorMessage: "ES_ERR_TRANSACTION_ID_FIELD",
    placeholder: {
      labelName: "Enter Transaction ID",
      labelKey: "ES_ENTER_TRANSACTION_ID_PLACEHOLDER"
    },
    required: true,
    jsonPath: "payment.transactionId",
    visible: process.env.REACT_APP_NAME !== "Citizen"
  }

  export const applicationOfflinePaymentDetails = getCommonCard({
    header: offlinePaymentDetailsHeader,
    detailsContainer: getCommonContainer({
        dateOfPayment: getDateField(paymentDate),
        bankName: getTextField(bankName),
        transactionId: getTextField(transactionId)
    })
  })
  
  export const offlinePaymentDetails = getCommonCard({
      header: offlinePaymentDetailsHeader,
      detailsContainer: getCommonContainer({
        paymentType: getSelectField(paymentType),
        Amount: getTextField(paymentAmount),
        dateOfPayment: getDateField(paymentDate),
        bankName: getTextField(bankName),
        transactionId: getTextField(transactionId),
      })
  })
  
  const propertyDetails = getCommonCard(propertyInfo(false))

  const detailsContainer = {
    uiFramework: "custom-atoms",
    componentPath: "Form",
    props: {
      id: "apply_form1"
    },
    children: {
      propertyDetails,
      offlinePaymentDetails
    },
    visible: true
  }

  const goToPayment = async (state, dispatch, type) => {
    let isValid = true;
    isValid = validateFields("components.div.children.detailsContainer.children.offlinePaymentDetails.children.cardContent.children.detailsContainer.children", state, dispatch, "estate-payment")
    if(!!isValid) {
      const propertyId = getQueryArg(window.location.href, "propertyId")
      const offlinePaymentDetails = get(state.screenConfiguration.preparedFinalObject, "payment")
      const {paymentAmount, ...rest} = offlinePaymentDetails
      if(!!propertyId) {
        const payload = [
          { id: propertyId, 
            propertyDetails: {
              offlinePaymentDetails: [{...rest, amount: paymentAmount}]
            }
          }
        ]
        try {
          const response = await httpRequest("post",
          "/est-services/property-master/_payrent",
          "",
          [],
          { Properties : payload })
          if(!!response && !!response.Properties.length) {
            console.log("=====response", response)
            const {rentPaymentConsumerCode, tenantId} = response.Properties[0]
            let billingBuisnessService=response.Properties[0].billingBusinessService
            type === "ONLINE" ? dispatch(
              setRoute(
               `/esate-citizen/pay?consumerCode=${rentPaymentConsumerCode}&tenantId=${tenantId}&businessService=${billingBuisnessService}`
              )
            ) : dispatch(
              setRoute(
              `/esate/acknowledgement?purpose=pay&applicationNumber=${rentPaymentConsumerCode}&status=success&tenantId=${tenantId}&type=${billingBuisnessService}`
              )
            )
          dispatch(prepareFinalObject("Properties", response.Properties))
          }
        } catch (error) {
          console.log("error", error)
        }
      }
    }
  }
  
  export const getCommonApplyFooter = children => {
    return {
      uiFramework: "custom-atoms",
      componentPath: "Div",
      props: {
        className: "apply-wizard-footer"
      },
      children
    };
  };

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
          const paymentType = process.env.REACT_APP_NAME === "Citizen" ? "ONLINE" : "OFFLINE"
          goToPayment(state, dispatch, paymentType)
        },
      },
      visible: true
    }
  })

const payment = {
    uiFramework: "material-ui",
    name: "estate-payment",
    beforeInitScreen: (action, state, dispatch) => {
      beforeInitFn(action, state, dispatch);
      return action
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