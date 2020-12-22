import { handleScreenConfigurationFieldChange as handleField, prepareFinalObject,toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getCommonHeader,getBreak, getCommonCard, getCommonContainer, getTextField, getSelectField,getPattern, getCommonGrayCard, getCommonTitle, getLabel, getDateField  } from "egov-ui-framework/ui-config/screens/specs/utils";
import commonConfig from "config/common.js";
import { httpRequest } from "../../../../ui-utils";
import get from "lodash/get";
import { ESTATE_SERVICES_MDMS_MODULE } from "../../../../ui-constants";
import { getSearchResults } from "../../../../ui-utils/commons";
import { propertyInfo } from "./preview-resource/preview-properties";
import { getQueryArg, getTodaysDateInYMD } from "egov-ui-framework/ui-utils/commons";
import { convertDateToEpoch, validateFields, getRentSummaryCard } from "../utils";
import {demandResults} from './searchResource/searchResults'
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import {penaltyStatmentResult,extensionStatmentResult,securityStatmentResult} from './searchResource/functions'
import { penaltySummary } from "./generatePenaltyStatement";
import moment from 'moment'
  const header = getCommonHeader({
    labelName: "Rent Payment",
    labelKey: "ES_RENT_PAYMENT_HEADER"
  });
  
  const beforeInitFn = async(action, state, dispatch)=>{
    dispatch(prepareFinalObject("Properties", []))
    let propertyId = getQueryArg(window.location.href, "propertyId")
    const fileNumber = getQueryArg(window.location.href, "fileNumber")
    const queryObject = [
      {key: "propertyIds", value: propertyId},
      {key: "fileNumber", value: fileNumber}
    ]
    const response = await getSearchResults(queryObject)
    if(!!response.Properties && !!response.Properties.length) {
      var yearlyData = []
    const min = 1992
    const max = moment(new Date()).format('YYYY')
    for(var i = min; i <= max; i++){
      yearlyData.push({"code": i})
    }
    dispatch(
      handleField(
        "manimajra-payment",
        "components.div.children.detailsContainer.children.paymentDetails.children.cardContent.children.detailsContainer.children.annual",
        "props.data",
        yearlyData
      )
    )
       dispatch(prepareFinalObject("Properties", response.Properties))
    }
    // dispatch(prepareFinalObject("payment.paymentType","PAYMENTTYPE.RENT"))
  }

  const paymentDetailsHeader = getCommonTitle(
    {
        labelName: "Payment Details",
        labelKey: "ES_PAYMENT_DETAILS_HEADER"
    },
    {
        style: {
                marginBottom: 18,
                marginTop: 18
        }
    }
  )

  const demandTypeHeader = getCommonTitle(
    {
        labelName: "Demand Type",
        labelKey: "ES_DEMAND_TYPE_HEADER"
    },
    {
        style: {
                marginBottom: 18,
                marginTop: 18
        }
    }
  )
  

export const annualField = {
  label: {
      labelName: "Annual License fee Pending from",
      labelKey: "ES_ANNUAL_LICENSE_FEE_PENDING_LABEL"
  },
  placeholder: {
      labelName: "Select Year",
      labelKey: "ES_SELECT_YEAR_PLACEHOLDER"
  },
  required: true,
  jsonPath: "Properties[0].propertyDetails.mmDemandStartYear",
  gridDefination: {
      xs: 12,
      sm: 6
  }
 
}

export const monthField = {
  label: {
      labelName: "Monthly Charges pending from",
      labelKey: "ES_MONTHLY_CHARGES_PENDING_LABEL"
  },
  placeholder: {
      labelName: "Select Month",
      labelKey: "ES_SELECT_MONTH_PLACEHOLDER"
  },
  optionValue: "code",
  optionLabel: "label",
  data:[ {label:"JAN",code:"01"},{label:"FEB",code:"02"},{label:"MAR",code:"03"},{label:"APR",code:"04"},{label:"MAY",code:"05"},{label:"JUN",code:"06"},{label:"JUL",code:"07"},
  {label:"AUG",code:"08"},{label:"SEP",code:"09"},{label:"OCT",code:"10"},{label:"NOV",code:"11"},{label:"DEC",code:"12"}],
  required: true,
  // jsonPath: "Properties[0].propertyDetails.mmDemandStartMonth",
  gridDefination: {
      xs: 12,
      sm: 6
  }
 
}

  const commentsField = {
    label: {
        labelName: "Comments",
        labelKey: "ES_COMMENTS_LABEL"
    },
    placeholder: {
        labelName: "Enter Comments",
        labelKey: "ES_COMMENTS_PLACEHOLDER"
    },
    visible: process.env.REACT_APP_NAME === "Citizen" ? false : true,
    gridDefination: {
        xs: 12,
        sm: 6
    },
    jsonPath: "payment.comments"
  }

  const paymentType = {
    label: {
        labelName: "Demand Type",
        labelKey: "ES_DEMAND_TYPE_LABEL"
      },
    required: false,
    beforeFieldChange: async (action, state, dispatch) => {

    },
    // jsonPath:"Properties[0].demandType",
    data:[{name:"Monthly",code:"Monthly"},{name:"Annually",code:"Annually"}],
    gridDefination: {
        xs: 12,
        sm: 6
    },
    errorMessage: "ES_ERR_DEMAND_TYPE_FIELD",
    placeholder: {
      labelName: "Select Demand Type",
      labelKey: "ES_SELECTDEMAND_TYPE_LABEL"
  },
    required: true,
    visible: true
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
    minLength: 3,
    maxLength: 7,
    errorMessage: "ES_ERR_AMOUNT_FIELD",
    placeholder: {
      labelName: "Enter amount",
      labelKey: "ES_ENTER_AMOUNT_PLACEHOLDER"
  },
    props:{
      disabled:true
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
    jsonPath: "payment.transactionNumber",
    visible: process.env.REACT_APP_NAME !== "Citizen"
  }
  
  export const paymentDetails = getCommonCard({
      header: paymentDetailsHeader,
      detailsContainer: getCommonContainer({
        Amount: getTextField(paymentAmount),
        bankName: getTextField(bankName),
        month:getSelectField(monthField),
        annual:getSelectField(annualField),
        transactionId: getTextField(transactionId),
        comments : getTextField(commentsField)
      })
  })

  export const demandType = getCommonCard({
    header: demandTypeHeader,
    detailsContainer: getCommonContainer({
      paymentType: getSelectField(paymentType)
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
      demandType,
      breakAfterSearch: getBreak(),
      demandResults,
      paymentDetails
    },
    visible: true
  }

  const goToPayment = async (state, dispatch, type) => {
  
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

const manimajraPayment = {
    uiFramework: "material-ui",
    name: "manimajra-payment",
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
            detailsContainer :  detailsContainer,
            footer: paymentFooter
          }
        }
      }
}

export default manimajraPayment;