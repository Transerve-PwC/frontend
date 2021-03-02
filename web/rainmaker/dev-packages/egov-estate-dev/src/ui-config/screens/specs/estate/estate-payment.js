import { handleScreenConfigurationFieldChange as handleField, prepareFinalObject,toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getCommonHeader, getCommonCard, getCommonContainer, getTextField, getSelectField,getPattern, getCommonGrayCard, getCommonTitle, getLabel, getDateField  } from "egov-ui-framework/ui-config/screens/specs/utils";
import commonConfig from "config/common.js";
import { httpRequest } from "../../../../ui-utils";
import get from "lodash/get";
import { ESTATE_SERVICES_MDMS_MODULE } from "../../../../ui-constants";
import { getSearchResults } from "../../../../ui-utils/commons";
import { propertyInfo } from "./preview-resource/preview-properties";
import { getQueryArg, getTodaysDateInYMD } from "egov-ui-framework/ui-utils/commons";
import { convertDateToEpoch, validateFields, getRentSummaryCard,displayCustomErr,_getPattern } from "../utils";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import {penaltyStatmentResult,extensionStatmentResult,securityStatmentResult} from './searchResource/functions'
import { penaltySummary } from "./generatePenaltyStatement";

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
    dispatch(prepareFinalObject("Properties", []))
    getMdmsData(dispatch);
    let propertyId = getQueryArg(window.location.href, "propertyId")
    const fileNumber = getQueryArg(window.location.href, "fileNumber")
    const queryObject = [
      {key: "propertyIds", value: propertyId},
      {key: "fileNumber", value: fileNumber}
    ]
    const response = await getSearchResults(queryObject)
    if(!!response.Properties && !!response.Properties.length) {
      let owners = response.Properties[0].propertyDetails.owners;
      owners = owners.map(item => ({...item, name: item.ownerDetails.ownerName}))
      const properties = [{...response.Properties[0], propertyDetails: {...response.Properties[0].propertyDetails, owners}}]
       dispatch(prepareFinalObject("Properties", properties))
    }
    const data=[{
      "active": "true",
"code": "PAYMENTTYPE.PREMIUMAMOUNT",
"name": "Premium Amount"
    }]
    if(!!response && response.Properties[0].propertyMasterOrAllotmentOfSite==="ALLOTMENT_OF_SITE" && response.Properties[0].state !=="ES_APPROVED"){
      dispatch(
        handleField(
          action.screenKey,
          "components.div.children.detailsContainer.children.offlinePaymentType.children.cardContent.children.detailsContainer.children.paymentType",
          "props.data",
          data
        )
      )
      dispatch(prepareFinalObject("payment.paymentType","PAYMENTTYPE.PREMIUMAMOUNT"))
    }
    else{
    dispatch(prepareFinalObject("payment.paymentType","PAYMENTTYPE.RENT"))
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

  const offlinePaymentTypeHeader = getCommonTitle(
    {
        labelName: "Payment Type",
        labelKey: "ES_PAYMENT_TYPE_HEADER"
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
    jsonPath: "payment.comments",
    pattern:_getPattern("courtCase"),
    afterFieldChange: (action, state, dispatch) => {
      if (action.value.length > 250) {
          displayCustomErr(action.componentJsonpath, dispatch, "ES_ERR_MAXLENGTH_250", action.screenKey);
      }
  }
  }

  const paymentType = {
    label: {
        labelName: "Payment Type",
        labelKey: "ES_PAYMENT_TYPE_LABEL"
      },
    required: false,
    jsonPath: "payment.paymentType",
    beforeFieldChange: async (action, state, dispatch) => {
      if (action.value) {
        let Properties = get(state.screenConfiguration.preparedFinalObject, "Properties")
        const {id} = Properties[0];   
        let Criteria = {
          fromdate: Properties[0].propertyDetails.auditDetails.createdTime || "",
          todate:   ""
        }
        Criteria = {...Criteria, propertyid: id}

        const penaltyCard = getCommonCard({
          header: getCommonTitle({
            labelName: "Penalty Summary",
            labelKey: "ES_PENALTY_SUMMARY_HEADER"
          }, {
            style: {
              marginBottom: 18,
              marginTop: 18
            }
          }),
          detailsContainer: getCommonGrayCard({
            rentSection: getRentSummaryCard({
              sourceJsonPath: "PenaltyStatementSummary",
              dataArray: ["totalPenalty","totalPenaltyPaid","totalPenaltyDue"],
              type:"Penalty"
            })
          })
        })

        const exntensionCard = getCommonCard({
          header: getCommonTitle({
            labelName: "Extension Summary",
            labelKey: "ES_EXTENSION_SUMMARY_HEADER"
          }, {
            style: {
              marginBottom: 18,
              marginTop: 18
            }
          }),
          detailsContainer: getCommonGrayCard({
            rentSection: getRentSummaryCard({
              sourceJsonPath: "ExtensionFeeStatementSummary",
              dataArray: ["totalExtensionFee","totalExtensionFeePaid","totalExtensionFeeDue"],
              type:"Extension-Fee"
            })
          })
        })

        const securityCard = getCommonCard({
          header: getCommonTitle({
            labelName: "Security Deposit Summary",
            labelKey: "ES_SECURITY_DEPOSIT_SUMMARY_HEADER"
          }, {
            style: {
              marginBottom: 18,
              marginTop: 18
            }
          }),
          detailsContainer: getCommonGrayCard({
            rentSection: getRentSummaryCard({
              sourceJsonPath: "SecurityStatementSummary",
              dataArray: ["totalSecurityDeposit","totalSecurityDepositPaid","totalSecurityDepositDue"],
              type:"Security-Fee"
            })
          })
        })
 
        switch(action.value){
          case 'PAYMENTTYPE.PENALTY':
              let penaltyResponse = await penaltyStatmentResult (state,dispatch, Criteria)
              if(!!penaltyResponse){
                dispatch(prepareFinalObject("PenaltyStatementSummary", penaltyResponse.PenaltyStatementSummary))
                dispatch(handleField(
                  "estate-payment",
                  "components.div.children.detailsContainer.children.rentSummaryDetails.children",
                  "rentCard",
                  penaltyCard     
              ));
              }
            
            break;

          case "PAYMENTTYPE.EXTENSIONFEE":
              let extensionResponse = await extensionStatmentResult (state,dispatch, Criteria)
              if(!!extensionResponse){
                dispatch(prepareFinalObject("ExtensionFeeStatementSummary", extensionResponse.ExtensionFeeStatementSummary))
                dispatch(handleField(
                  "estate-payment",
                  "components.div.children.detailsContainer.children.rentSummaryDetails.children",
                  "rentCard",
                  exntensionCard     
              ));
              }
             
            break; 

          case "PAYMENTTYPE.SECURITYFEE":
              let payload  = {propertyid: id}
              let securityDeposit = await securityStatmentResult (state,dispatch, payload)
              if(!!securityDeposit){
                dispatch(handleField(
                  "estate-payment",
                  "components.div.children.detailsContainer.children.rentSummaryDetails.children",
                  "rentCard",
                  securityCard     
              ));
              }
            
            break; 

          default : 
          if(Properties[0].state!=="ES_APPROVED" && Properties[0].propertyMasterOrAllotmentOfSite==="ALLOTMENT_OF_SITE"){

            dispatch(handleField(
              "estate-payment",
              "components.div.children.detailsContainer.children.rentSummaryDetails.children",
              "rentCard",
              premiumAmountSummary     
            ));
          }else{
              const rentCard = getCommonCard({
                header: rentSummaryHeader,
                detailsContainer: rentSummary
              })

              dispatch(handleField(
                "estate-payment",
                "components.div.children.detailsContainer.children.rentSummaryDetails.children",
                "rentCard",
                rentCard     
              ));
          }
            break;  
        }
      }
    },
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

  export const payerField = {
    label: {
      labelName: "Payer",
      labelKey: "ES_PAYER"
    },
    placeholder: {
      labelName: "Select Payer",
      labelKey: "ES_SELECT_PAYER"
    },
    required: true,
    jsonPath: "payment.payer.uuid",
    visible: process.env.REACT_APP_NAME !== "Citizen",
    errorMessage:"ES_ERR_PAYER",
    optionValue: "id",
    optionLabel: "name",
    sourceJsonPath: "Properties[0].propertyDetails.owners",
    gridDefination: {
        xs: 12,
        sm: 6
    },
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

  const getPatternAmount = (type) => {
    switch (type) {
      case "Amount":
        return (/^[1-9][0-9]{1,7}$/i
        );
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
    minLength: 1,
    maxLength: 7,
    errorMessage: "ES_ERR_AMOUNT_FIELD",
    placeholder: {
      labelName: "Enter amount",
      labelKey: "ES_ENTER_AMOUNT_PLACEHOLDER"
  },
    required: true,
    pattern: getPatternAmount("Amount"),
    jsonPath: "payment.paymentAmount",
    minLength:2,
    maxLength:7,
    afterFieldChange: (action, state, dispatch) => {
      if (action.value.length > 7) {
        displayCustomErr(action.componentJsonpath, dispatch, "ES_ERR_MAXLENGTH_7", action.screenKey);
      } else if(action.value.length < 2){
        displayCustomErr(action.componentJsonpath, dispatch, "ES_ERR_AMOUNT_MIN", action.screenKey);
      }else{
        displayCustomErr(action.componentJsonpath, dispatch, "ES_ERR_AMOUNT_FIELD",action.screenKey);
      }
    }
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
    minLength:3,
    maxLength:250,
    pattern:_getPattern("BankName"),
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
        // paymentType: getSelectField(paymentType),
        payer: getSelectField(payerField),
        Amount: getTextField(paymentAmount),
        dateOfPayment: getDateField(paymentDate),
        bankName: getTextField(bankName),
        transactionId: getTextField(transactionId),
        comments : getTextField(commentsField)
      })
  })

  export const offlinePaymentType = getCommonCard({
    header: offlinePaymentTypeHeader,
    detailsContainer: getCommonContainer({
      paymentType: getSelectField(paymentType)
    })
})
  
  const propertyDetails = getCommonCard(propertyInfo(false))

  const rentSummaryHeader = getCommonTitle({
    labelName: "Rent Summary",
    labelKey: "ES_RENT_SUMMARY_HEADER"
  }, {
    style: {
      marginBottom: 18,
      marginTop: 18
    }
  })
  
  const rentSummary = getCommonGrayCard({
    rentSection: getRentSummaryCard({
      sourceJsonPath: "Properties[0].estateRentSummary",
      dataArray: ["balanceRent", "balanceGST", "balanceGSTPenalty", "balanceRentPenalty", "balanceAmount"],
      type:"rent"
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
    }
  }
  const premiumAmountSummary = getCommonCard({
      header: getCommonTitle({
        labelName: "Premium Amount",
        labelKey: "ES_PREMIUM_AMOUNT"
      }, {
        style: {
          marginBottom: 18,
          marginTop: 18
        }
      }),
      detailsContainer: getCommonGrayCard({
    rentSection: getRentSummaryCard({
      sourceJsonPath: "Properties[0].propertyDetails.paymentConfig.premiumAmountConfigItems",
      dataArray: ["premiumAmount"],
      type:"premiumAmount"
    })
  })
  });


  const detailsContainer = {
    uiFramework: "custom-atoms",
    componentPath: "Form",
    props: {
      id: "apply_form1"
    },
    children: {
      propertyDetails,
      offlinePaymentType,
      rentSummaryDetails,
      offlinePaymentDetails
    },
    visible: true
  }

  const detailsContainerCitizen = {
    uiFramework: "custom-atoms",
    componentPath: "Form",
    props: {
      id: "apply_form1"
    },
    children: {
      propertyDetails,
      rentSummaryDetails,
      offlinePaymentDetails
    },
    visible: true
  }
  


  const goToPayment = async (state, dispatch, type) => {
    let isValid = true;
    let isValidAmount = false;
    let {paymentAmount} = state.screenConfiguration.preparedFinalObject.payment
    let amountValue = paymentAmount
    // let amountValue = get(state.screenConfiguration.screenConfig["estate-payment"],"components.div.children.detailsContainer.children.offlinePaymentDetails.children.cardContent.children.detailsContainer.children.Amount.props.value")
    isValid = validateFields("components.div.children.detailsContainer.children.offlinePaymentDetails.children.cardContent.children.detailsContainer.children", state, dispatch, "estate-payment")
    if (!isValid && !(Number.isInteger(parseInt(amountValue)) && amountValue.length >= 1 && amountValue.length <= 7)) {
  
      let errorMessage = {
        labelName:
            "Please enter value between 1 and 7 digits",
        labelKey: "ES_ERR_VALUE_BETWEEN_1_AND_7_DIGITS"
    };
    
    dispatch(toggleSnackbar(true, errorMessage, "warning"));
    }
    
    if(isValid && ((Number.isInteger(parseInt(amountValue)) && amountValue.length >= 1 && amountValue.length <= 7))) {
      const propertyId = getQueryArg(window.location.href, "propertyId")
      const offlinePaymentDetails = get(state.screenConfiguration.preparedFinalObject, "payment")
      const {paymentAmount, paymentType, payer, ...rest} = offlinePaymentDetails
      switch(paymentType){
        case 'PAYMENTTYPE.PENALTY':
          const PenaltyStatementSummary = get(state.screenConfiguration.preparedFinalObject, "PenaltyStatementSummary")
          const {totalPenaltyDue} = PenaltyStatementSummary
          if(Number(amountValue) > Number(totalPenaltyDue)){
            let errorMessage = {
              labelName:
                  "Amount Cannot be greater than total penalty due",
              labelKey: "ES_PENALTY_AMOUNT_ERR"
          };
          dispatch(toggleSnackbar(true, errorMessage, "warning"));
          }else{
            isValidAmount = true
          }

          break;
        case 'PAYMENTTYPE.EXTENSIONFEE':
            const ExtensionFeeStatementSummary = get(state.screenConfiguration.preparedFinalObject, "ExtensionFeeStatementSummary")
            const {totalExtensionFeeDue} = ExtensionFeeStatementSummary
            if(Number(amountValue) > Number(totalExtensionFeeDue)){
              let errorMessage = {
                labelName:
                    "Amount Cannot be greater than total extension fee Due",
                labelKey: "ES_EXTENSION_AMOUNT_ERR"
            };
            dispatch(toggleSnackbar(true, errorMessage, "warning"));
            }else{
              isValidAmount = true
            }
          break;
        case 'PAYMENTTYPE.SECURITYFEE':
            const SecurityStatementSummary = get(state.screenConfiguration.preparedFinalObject, "SecurityStatementSummary")
            const {totalSecurityDepositDue} = SecurityStatementSummary
            if(Number(amountValue) > Number(totalSecurityDepositDue)){
              let errorMessage = {
                labelName:
                    "Amount Cannot be greater than total security fee due",
                labelKey: "ES_SECURITY_AMOUNT_ERR"
            };
            dispatch(toggleSnackbar(true, errorMessage, "warning"));
            }else{
              isValidAmount = true
            } 
          break;
        default :
        isValidAmount = true
      }
      if(!!propertyId && isValidAmount) {
        const payload = [
          { id: propertyId, 
            payer,
            propertyDetails: {
              offlinePaymentDetails: [{...rest, amount: paymentAmount, paymentType}]
            }
          }
        ]
        try {
          const url = paymentType === "PAYMENTTYPE.PENALTY" ? "/est-services/violation/_penalty_payment" : paymentType === "PAYMENTTYPE.EXTENSIONFEE" ? "/est-services/extension-fee/_payment" : paymentType === "PAYMENTTYPE.SECURITYFEE" ? "/est-services/security_deposit/_payment" : "/est-services/property-master/_payrent"
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
            detailsContainer :  process.env.REACT_APP_NAME !== "Citizen" ? detailsContainer : detailsContainerCitizen,
            footer: paymentFooter
          }
        }
      }
}

export default payment;