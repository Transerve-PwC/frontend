import { handleScreenConfigurationFieldChange as handleField, prepareFinalObject,toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getCommonHeader,getBreak, getCommonCard, getCommonContainer, getTextField, getSelectField,getPattern, getCommonGrayCard, getCommonTitle, getLabel, getDateField, convertEpochToDate  } from "egov-ui-framework/ui-config/screens/specs/utils";
import { httpRequest } from "../../../../ui-utils";
import { getSearchResults } from "../../../../ui-utils/commons";
import { getPropertyInfoManimajra } from "./applyResourceManimajra/reviewDetails";
import { getQueryArg, getTodaysDateInYMD } from "egov-ui-framework/ui-utils/commons";
import { convertDateToEpoch, validateFields, getRentSummaryCard, getTextToLocalMapping, _getPattern,displayCustomErr } from "../utils";
import {demandResults} from './searchResource/searchResults'
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import { getUserInfo } from "egov-ui-kit/utils/localStorageUtils";
import moment from 'moment'
import { payerField } from "./estate-payment";

  const header = getCommonHeader({
    labelName: "Rent Payment",
    labelKey: "ES_RENT_PAYMENT_HEADER"
  });
  
  const beforeInitFn = async(action, state, dispatch)=>{
    const userInfo = JSON.parse(getUserInfo());
    const {roles = []} = userInfo
    const manimajraPaymentPageAccess = roles.find(item => item.code === "ES_MM_FINANCIAL_OFFICER");
    if(manimajraPaymentPageAccess === undefined && userInfo.type != "CITIZEN"){
      dispatch(
        setRoute(
         `/estate/home`
        )
      )
    }

    dispatch(prepareFinalObject("Properties", []))
    let propertyId = getQueryArg(window.location.href, "propertyId")
    const fileNumber = getQueryArg(window.location.href, "fileNumber")
    const queryObject = [
      {key: "propertyIds", value: propertyId},
      {key: "fileNumber", value: fileNumber}
    ]
    const response = await getSearchResults(queryObject)
    if(!!response.Properties && !!response.Properties.length) {
       dispatch(prepareFinalObject("Properties", response.Properties))
       let Criteria = {
        fromdate:  "",
        todate:  ""
       }
         Criteria = {...Criteria, propertyid: propertyId}
         const _accountstatement = await httpRequest(
           "post",
           '/est-services/property-master/_accountstatement',
           "",
           [],
           {Criteria}
         )
        
        if(_accountstatement){
          let ManiMajraAccountStatement = _accountstatement.ManiMajraAccountStatement

          // to get demands which are unpaid
          ManiMajraAccountStatement = ManiMajraAccountStatement.filter((demand) => {
              if(demand.status == 'Unpaid' && demand.type == 'D'){
                return demand
              }
          })

          dispatch(
            prepareFinalObject(
              "ManiMajraAccountStatement",
              ManiMajraAccountStatement
            )
          );
          // let sortedData = _accountstatement.ManiMajraAccountStatement.sort((a, b) => (a.date > b.date) ? 1 : -1)
          let data = ManiMajraAccountStatement.map(item => ({
            [getTextToLocalMapping("Date")]: moment(new Date(item.date)).format("DD-MMM-YYYY") || "-",
            [getTextToLocalMapping("GST")]:  (item.gst.toFixed(2)) || "-",
            [getTextToLocalMapping("Demand Type")]:  !!item.typeOfDemand && item.typeOfDemand|| "-",
            [getTextToLocalMapping("Total Due")]: (item.dueAmount.toFixed(2)) || "-",
            [getTextToLocalMapping("Rent")]: item.rent || "-"
          }));

          dispatch(
            handleField(
              "manimajra-payment",
              "components.div.children.detailsContainer.children.demandResults",
              "props.data",
              data
            )
          );
        }
        
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
    jsonPath:"Properties[0].propertyDetails.demandType",
    data:[{name:"Monthly",code:"Monthly"},{name:"Annually",code:"Annually"}],
    gridDefination: {
        xs: 12,
        sm: 6
    },
    props:{
      disabled:true,
      value:"Monthly"
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
    errorMessage: "ES_ERR_AMOUNT_FIELD",
    placeholder: {
      labelName: "Enter amount",
      labelKey: "ES_ENTER_AMOUNT_PLACEHOLDER"
  },
    props:{
      disabled:true
    },
    required: true,
    jsonPath: "payment.amount"
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
  minLength:3,
  maxLength:250,
    required: true,
    jsonPath: "payment.bankName",
    visible: process.env.REACT_APP_NAME !== "Citizen",
    afterFieldChange: (action, state, dispatch) => {
      if (action.value.length > 250) {
          displayCustomErr(action.componentJsonpath, dispatch, "ES_ERR_MAXLENGTH_250", action.screenKey);
      }
      else if(action.value.length<3){
        displayCustomErr(action.componentJsonpath, dispatch, "ES_ERR_BANK_NAME_3", action.screenKey);
      }
      else {
          displayCustomErr(action.componentJsonpath, dispatch, "ES_ERR_BANK_NAME_FIELD",action.screenKey);
      }
  }
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
    minLength:3,
    maxLength:250,
    jsonPath: "payment.transactionNumber",
    visible: process.env.REACT_APP_NAME !== "Citizen",
    pattern:_getPattern("transactionid"),
    afterFieldChange: (action, state, dispatch) => {
      if (action.value.length > 250) {
          displayCustomErr(action.componentJsonpath, dispatch, "ES_ERR_MAXLENGTH_250", action.screenKey);
      }
      else if(action.value.length <3){
        displayCustomErr(action.componentJsonpath, dispatch, "ES_ERR_TRANSACTION_ID_3", action.screenKey);
      }
      else {
          displayCustomErr(action.componentJsonpath, dispatch, "ES_ERR_TRANSACTION_ID_FIELD",action.screenKey);
      }
  }
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
    visible: process.env.REACT_APP_NAME !== "Citizen",
    props: {
      inputProps: {
        max: getTodaysDateInYMD()
    }
    },
    errorMessage:"ES_ERR_DATE_OF_PAYMENT",
    afterFieldChange: (action, state, dispatch) => {
      dispatch(prepareFinalObject(
        "payment.dateOfPayment", convertDateToEpoch(action.value)
      ))
    }
  }

  const toDate = {
    label: {
      labelName: "to date",
      labelKey: "ES_TO_DATE_LABEL"
    },
    placeholder: {
        labelName: "Select Date",
        labelKey: "ES_SELECT_DATE_PLACEHOLDER"
    },
    required: true,
    pattern: getPattern("Date"),
    jsonPath: "offlinePaymentDetails.toDate",
    props: {
      inputProps: {
        max: getTodaysDateInYMD()
    }
    },
    afterFieldChange: (action, state, dispatch) => {
      dispatch(
        handleField(
"manimajra-payment",
"components.div.children.loader",
"visible",
true
      ))
      setTimeout(() => {
        

    let {toDate} = state.screenConfiguration.preparedFinalObject.offlinePaymentDetails
    let todaysdate=getTodaysDateInYMD()
    todaysdate=convertDateToEpoch(todaysdate)
    toDate = convertDateToEpoch(toDate)
    var fromDate = ""
    const {ManiMajraAccountStatement} = state.screenConfiguration.preparedFinalObject
    if(ManiMajraAccountStatement && ManiMajraAccountStatement!=null){
      fromDate = ManiMajraAccountStatement[0].date
      let fromDateStr = convertEpochToDate(fromDate)
      dispatch(prepareFinalObject(
        "payment.fromDate", fromDateStr.split("/").reverse().join("-")
      ))
      dispatch(prepareFinalObject(
        "payment.toDate", convertEpochToDate(toDate).split("/").reverse().join("-")
      ))
   }
   fromDate = convertDateToEpoch(fromDate)

   // to get demands between to and from date
    let demands = ManiMajraAccountStatement.filter(item => {
      if(((item.date - toDate === 0 || item.date -toDate <= 0) ? true :false) && ((item.date - fromDate === 0 || item.date -fromDate >= 0) ? true :false)){
        return item
      }
    })
  
    const gst = demands.reduce(function (acc, obj) { return acc + parseInt(obj.gst); }, 0);
    const rent = demands.reduce(function (acc, obj) { return acc + parseInt(obj.rent); }, 0);
    const amount = (gst + rent).toFixed(2)
      
    dispatch(
      handleField(
        "manimajra-payment",
        "components.div.children.detailsContainer.children.paymentDetails.children.cardContent.children.detailsContainer.children.Amount",
        "props.value",
        amount
      )
    );

    let data = demands.map(item => ({
      [getTextToLocalMapping("Date")]: moment(new Date(item.date)).format("DD-MMM-YYYY") || "-",
      [getTextToLocalMapping("GST")]:  (item.gst.toFixed(2)) || "-",
      [getTextToLocalMapping("Demand Type")]:  !!item.typeOfDemand && item.typeOfDemand|| "-",
      [getTextToLocalMapping("Total Due")]: (item.dueAmount.toFixed(2)) || "-",
      [getTextToLocalMapping("Rent")]: item.rent || "-"
    }));
 let lastrow=  data.pop()
if(todaysdate===toDate){
  data.push({
    "Date": `Balance as on ${moment(toDate).format("DD-MMM-YYYY")}`,
    "Demand Type": "-",
    "GST": "-",
    "Rent": lastrow["Total Due"],
    "Total Due": "-"
})
}
else{
    data.push({
        "Date": `Balance as on ${moment(toDate).format("DD-MMM-YYYY")}`,
        "Demand Type": "-",
        "GST": "-",
        "Rent": amount,
        "Total Due": "-"
    })
  }
    dispatch(
      handleField(
        "manimajra-payment",
        "components.div.children.detailsContainer.children.demandResults",
        "props.data",
        data
      )
    );
    if(todaysdate===toDate){
      dispatch(
        handleField(
          "manimajra-payment",
          "components.div.children.detailsContainer.children.paymentDetails.children.cardContent.children.detailsContainer.children.Amount",
          "props.value",
          lastrow["Total Due"]
        )
      );
    }
    else{
    dispatch(
      handleField(
        "manimajra-payment",
        "components.div.children.detailsContainer.children.paymentDetails.children.cardContent.children.detailsContainer.children.Amount",
        "props.value",
        amount
      )
    );
      }
      dispatch(
        handleField(
  "manimajra-payment",
  "components.div.children.loader",
  "visible",
  false
      ))
    }, 5000);
    }
  }

  //prefilled -First demand date
  const fromDate = {
    label: {
      labelName: "From Date",
      labelKey: "ES_FROM_DATE_LABEL"
    },
    placeholder: {
        labelName: "From Date Placeholder",
        labelKey: "ES_FROM_DATE_PLACEHOLDER"
    },
    pattern: getPattern("Date"),
    jsonPath: "ManiMajraAccountStatement[0].date",
    props: {
      disabled:true,
    //   inputProps: {
    //     max: getTodaysDateInYMD()
    // }
    }
   
  }
  
  export const paymentDetails = getCommonCard({
    // header: paymentDetailsHeader,
    detailsContainer: getCommonContainer({
      payer: getSelectField(payerField),
      Amount: getTextField(paymentAmount),
      bankName: getTextField(bankName),
      dateOfPayment: getDateField(paymentDate),
      transactionId: getTextField(transactionId),
      comments : getTextField(commentsField)
    })
  })

  export const DateSection = getCommonCard({
      header: paymentDetailsHeader,
      detailsContainer: getCommonContainer({
        from: getDateField(fromDate),
        to: getDateField(toDate),
      })
  })

  export const demandType = getCommonCard({
    header: demandTypeHeader,
    detailsContainer: getCommonContainer({
      paymentType: getSelectField(paymentType)
    })
})
  
  const propertyDetails = getCommonCard(getPropertyInfoManimajra(false))

  const detailsContainer = {
    uiFramework: "custom-atoms",
    componentPath: "Form",
    props: {
      id: "apply_form1"
    },
    children: {
      propertyDetails,
      DateSection,
      breakAfterSearch: getBreak(),
      demandResults,
      paymentDetails
    },
    visible: true
  }

  const goToPayment = async (state, dispatch, type) => {
    let isValid = true;
    isValid = validateFields("components.div.children.detailsContainer.children.paymentDetails.children.cardContent.children.detailsContainer.children", state, dispatch, "manimajra-payment")
    if(!isValid){
      let errorMessage = {
        labelName:
            "Please Enter Mandatory Fields",
        labelKey: "ES_ERR_MANDATORY_FIELDS"
    };
    dispatch(toggleSnackbar(true, errorMessage, "warning"));
    }

    if(!!isValid) {
      let {amount} = state.screenConfiguration.preparedFinalObject.payment
      if(parseInt(amount)===0){
        let errorMessage = {
          labelName:
              "Please enter amount greater then zero",
          labelKey: "ES_ERR_ZERO_AMOUNT"
      };
      dispatch(toggleSnackbar(true, errorMessage, "warning"));
      }
      else{
      const propertyId = getQueryArg(window.location.href, "propertyId")
      const {payment} = state.screenConfiguration.preparedFinalObject
      const {payer, ...rest} = payment
      if(!!propertyId ) {
        const payload = [
          { id: propertyId, 
            payer,
            propertyDetails: {
              offlinePaymentDetails: [rest]
            }
          }
        ]
        try {
          const url =  "/est-services/property-master/_payrent"
          const response = await httpRequest("post",
          url,
          "",
          [],
          { Properties : payload })
          if(!!response && ((!!response.Properties && !!response.Properties.length) || (!!response.OfflinePayments && !!response.OfflinePayments.length))) {
            let {rentPaymentConsumerCode,fileNumber, tenantId, consumerCode} = !!response.Properties ? response.Properties[0] : response.OfflinePayments[0]
            rentPaymentConsumerCode = rentPaymentConsumerCode || consumerCode;
            let billingBuisnessService=!!response.Properties ? response.Properties[0].propertyDetails.billingBusinessService : response.OfflinePayments[0].billingBusinessService
            type === "ONLINE" ? dispatch(
              setRoute(
               `/estate-citizen/pay?consumerCode=${rentPaymentConsumerCode}&tenantId=${tenantId}&businessService=${billingBuisnessService}`
              )
            ) : dispatch(
              setRoute(
              `acknowledgement?purpose=pay&applicationNumber=${rentPaymentConsumerCode}&status=success&tenantId=${tenantId}&type=${billingBuisnessService}&fileNumber=${fileNumber}`
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
            loader:{
              uiFramework: "custom-molecules",
              componentPath: "LoadingIndicator",
              visible:false
            },
            detailsContainer :  detailsContainer,
            footer: paymentFooter
          }
        }
      }
}

export default manimajraPayment;