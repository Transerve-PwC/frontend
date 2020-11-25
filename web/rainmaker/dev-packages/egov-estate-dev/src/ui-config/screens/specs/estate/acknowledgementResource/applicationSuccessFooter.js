import {
  getLabel
} from "egov-ui-framework/ui-config/screens/specs/utils";
import {
  ifUserRoleExists,downloadAcknowledgementForm,downloadSummary,downloadPaymentReceipt
} from "../../utils";
import set from "lodash/set";
import get from "lodash/get";
const { getQueryArg } = require("egov-ui-framework/ui-utils/commons");
import { getUserInfo } from "egov-ui-kit/utils/localStorageUtils";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import {getSearchApplicationsResults,getSearchResults} from '../../../../../ui-utils/commons'
const userInfo = JSON.parse(getUserInfo());
const getCommonApplyFooter = children => {
  return {
    uiFramework: "custom-atoms",
    componentPath: "Div",
    props: {
      className: "apply-wizard-footer"
    },
    children
  };
};

export const applicationSuccessFooter = (
  state,
  dispatch,
  applicationNumber,
  tenant
) => {
  const fileNumber = getQueryArg(window.location.href, "fileNumber");
  const purpose  = getQueryArg(window.location.href, "purpose");
  const type = getQueryArg(window.location.href, "type");
  const roleExists = ifUserRoleExists("CITIZEN");
  const redirectionURL = roleExists ? "/" : "/inbox";
  if(roleExists){
    return getCommonApplyFooter({
      gotoHome: {
        componentPath: "Button",
        props: {
          variant: "outlined",
          color: "primary",
          style: {
            minWidth: "180px",
            height: "48px",
            marginRight: "16px"
          }
        },
        children: {
          downloadReceiptButtonLabel: getLabel({
            labelName: "GO TO HOME",
            labelKey: "ES_COMMON_BUTTON_HOME"
          })
        },
        onClickDefination: {
          action: "page_change",
          path: redirectionURL
        },
       
      },
      downloadFormButton: {
        componentPath: "Button",
        props: {
          variant: "outlined",
          color: "primary",
          style: {
            minWidth: "180px",
            height: "48px",
            marginRight: "16px"
          }
        },
        children: {
          downloadFormButtonLabel: (purpose === "pay" && type === "ESTATE_SERVICE_ESTATE_BRANCH.PROPERTY_MASTER") ? getLabel({
            labelName: "DOWNLOAD RECEIPT",
            labelKey: "ES_APPLICATION_BUTTON_DOWN_RECEIPT"
          }) : getLabel({
            labelName: "DOWNLOAD CONFIRMATION FORM",
            labelKey: "ES_APPLICATION_BUTTON_DOWN_CONF"
          })
        },
        onClickDefination: {
          action: "condition",
          callBack: async() => {
            const purpose = getQueryArg(window.location.href, "purpose");
            let tenantId = getQueryArg(window.location.href, "tenantId");
            let consumerCodes = getQueryArg(window.location.href, "applicationNumber");
            if(purpose === 'pay'){
              if(consumerCodes.startsWith('SITE')){
                let consumerCodes = getQueryArg(window.location.href, "applicationNumber");
                var array = consumerCodes.split("-");
                array.splice(array.length - 6);
                array.splice(0, 1);
                let fileNumber = array.join("-");
                let queryObject = [
                  { key: "fileNumber", value: fileNumber }
                ];
                let response =  await getSearchResults(queryObject);
                let properties = response.Properties.map(item => ({...item, estateRentSummary: {balanceRent: Number(item.estateRentSummary.balanceRent.toFixed(2)),
                balanceGST: Number(item.estateRentSummary.balanceGST.toFixed(2)),
                balanceGSTPenalty: Number(item.estateRentSummary.balanceGSTPenalty.toFixed(2)),
                balanceRentPenalty: Number(item.estateRentSummary.balanceRentPenalty.toFixed(2)),
                balanceAmount: Number(item.estateRentSummary.balanceAmount.toFixed(2))
                }}))
                dispatch(prepareFinalObject("Properties", properties))
                let { Properties} = state.screenConfiguration.preparedFinalObject;
                let id = getQueryArg(window.location.href, "tenantId");
                const receiptQuery = [
                { key: "consumerCodes", value:consumerCodes},
                  { key: "tenantId", value: id }
                ]
                downloadPaymentReceipt(receiptQuery, Properties,[], userInfo.name,'rent-payment');
              }else{
                const queryObject = [
                  {
                    key: "tenantId",
                    value: tenantId
                  },
                  {
                    key: "applicationNumber",
                    value: consumerCodes
                  }
                ];
                const response = await getSearchApplicationsResults(queryObject);
                const Applications = get(response, "Applications");
                const { temp } = state.screenConfiguration.preparedFinalObject;
                  const feeEstimate = temp[0].estimateCardData;
                  const receiptQuery = [
                    { key: "consumerCodes", value:consumerCodes},
                    { key: "tenantId", value: tenantId }
                ]
                downloadPaymentReceipt(receiptQuery, Applications,feeEstimate, userInfo.name,'application-payment');
              }
                  
            }else{
              const { Applications,temp } = state.screenConfiguration.preparedFinalObject;
              let { applicationType} = Applications[0];
              const {branchType} = Applications[0];
              if(branchType === "BuildingBranch"){
                applicationType =  "BB-" + applicationType 
              }
              const documents = temp[0].reviewDocData;
              set(Applications[0],"additionalDetails.documents",documents)
              downloadAcknowledgementForm(Applications,applicationType,[],"");
            }
          }
        },
        visible: true
      },
      printFormButton: {
        componentPath: "Button",
        props: {
          variant: "outlined",
          color: "primary",
          style: {
            minWidth: "180px",
            height: "48px",
            marginRight: "16px"
          }
        },
        children: {
          printFormButtonLabel: (purpose === "pay" && type === "ESTATE_SERVICE_ESTATE_BRANCH.PROPERTY_MASTER") ? getLabel({
            labelName: "PRINT RECEIPT",
            labelKey: "ES_APPLICATION_BUTTON_PRINT_RECEIPT"
          }) : getLabel({
            labelName: "PRINT CONFIRMATION FORM",
            labelKey: "ES_APPLICATION_BUTTON_PRINT_CONF"
          })

        },
        onClickDefination: {
          action: "condition",
          callBack: async() => {
            const purpose = getQueryArg(window.location.href, "purpose");
            let tenantId = getQueryArg(window.location.href, "tenantId");
            let consumerCodes = getQueryArg(window.location.href, "applicationNumber");
            if(purpose === 'pay'){
              if(consumerCodes.startsWith('SITE')){
                let consumerCodes = getQueryArg(window.location.href, "applicationNumber");
                var array = consumerCodes.split("-");
                array.splice(array.length - 6);
                array.splice(0, 1);
                let fileNumber = array.join("-");
                // let fileNumber = consumerCodes.split('-')[1]
                let queryObject = [
                  { key: "fileNumber", value: fileNumber }
                ];
                let response =  await getSearchResults(queryObject);
                let properties = response.Properties.map(item => ({...item, estateRentSummary: {balanceRent: Number(item.estateRentSummary.balanceRent.toFixed(2)),
                balanceGST: Number(item.estateRentSummary.balanceGST.toFixed(2)),
                balanceGSTPenalty: Number(item.estateRentSummary.balanceGSTPenalty.toFixed(2)),
                balanceRentPenalty: Number(item.estateRentSummary.balanceRentPenalty.toFixed(2)),
                balanceAmount: Number(item.estateRentSummary.balanceAmount.toFixed(2))
                }}))
                dispatch(prepareFinalObject("Properties", properties))
                let { Properties} = state.screenConfiguration.preparedFinalObject;
                let id = getQueryArg(window.location.href, "tenantId");
                const receiptQuery = [
                { key: "consumerCodes", value:consumerCodes},
                  { key: "tenantId", value: id }
                ]
                downloadPaymentReceipt(receiptQuery, Properties,[], userInfo.name,'rent-payment','print');
              }else{
                const queryObject = [
                  {
                    key: "tenantId",
                    value: tenantId
                  },
                  {
                    key: "applicationNumber",
                    value: consumerCodes
                  }
                ];
                const response = await getSearchApplicationsResults(queryObject);
                const Applications = get(response, "Applications");
                const { temp } = state.screenConfiguration.preparedFinalObject;
                const feeEstimate = temp[0].estimateCardData;
                const receiptQuery = [
                    { key: "consumerCodes", value:consumerCodes},
                    { key: "tenantId", value: tenantId }
                ]
                downloadPaymentReceipt(receiptQuery, Applications,feeEstimate, userInfo.name,'application-payment','print');
              }
                  
            }else{
              const { Applications,temp } = state.screenConfiguration.preparedFinalObject;
              let { applicationType} = Applications[0];
              const documents = temp[0].reviewDocData;
              const {branchType} = Applications[0];
              if(branchType === "BuildingBranch"){
                applicationType =  "BB-" + applicationType 
              }
              set(Applications[0],"additionalDetails.documents",documents)
              downloadAcknowledgementForm(Applications,applicationType,[],"",'print');
            }
          }
        },
        visible: true
      }
    });
  }else{
    return getCommonApplyFooter({
      gotoHome: {
        componentPath: "Button",
        props: {
          variant: "outlined",
          color: "primary",
          style: {
            minWidth: "180px",
            height: "48px",
            marginRight: "16px"
          }
        },
        children: {
          downloadReceiptButtonLabel: getLabel({
            labelName: "GO TO HOME",
            labelKey: "ES_COMMON_BUTTON_HOME"
          })
        },
        onClickDefination: {
          action: "page_change",
          path: redirectionURL
        },
       
      },
      downloadFormButton: {
        componentPath: "Button",
        props: {
          variant: "outlined",
          color: "primary",
          style: {
            minWidth: "180px",
            height: "48px",
            marginRight: "16px"
          }
        },
        children: {
          downloadFormButtonLabel: (purpose === "pay" && type === "ESTATE_SERVICE_ESTATE_BRANCH.PROPERTY_MASTER") ? getLabel({
            labelName: "DOWNLOAD RECEIPT",
            labelKey: "ES_APPLICATION_BUTTON_DOWN_RECEIPT"
          }): getLabel({
            labelName: "DOWNLOAD CONFIRMATION FORM",
            labelKey: "ES_APPLICATION_BUTTON_DOWN_CONF"
          })

        },
        onClickDefination: {
          action: "condition",
          callBack: async() => {
            switch(purpose){
              case 'apply':
                if(type === 'EstateBranch_InternalServices_IssuanceOfNotice' || type === 'BuildingBranch_CitizenService_IssuanceOfNotice'){
                  const { Applications,temp } = state.screenConfiguration.preparedFinalObject;
                  let { applicationType} = Applications[0];
                  const documents = temp[0].reviewDocData;
                  const {branchType} = Applications[0];
                  if(branchType === "BuildingBranch"){
                    applicationType =  "BB-" + applicationType 
                  }
                  set(Applications[0],"additionalDetails.documents",documents)
                  downloadAcknowledgementForm(Applications,applicationType,[],"");
                }else{
                  const { Properties,PropertiesTemp } = state.screenConfiguration.preparedFinalObject; 
                  downloadSummary(Properties, PropertiesTemp);
                }
  
                break;
              case 'pay':

                if(type === 'ESTATE_SERVICE_ESTATE_BRANCH.PROPERTY_MASTER'){
                  let fileNumber = getQueryArg(window.location.href, "fileNumber");
                  const consumerCodes = getQueryArg(window.location.href, "applicationNumber");
                  if(consumerCodes.startsWith('SITE')){
                    let queryObject = [
                      { key: "fileNumber", value: fileNumber }
                    ];
                    let response =  await getSearchResults(queryObject);
                     let properties = response.Properties.map(item => ({...item, estateRentSummary: {balanceRent: Number(item.estateRentSummary.balanceRent.toFixed(2)),
                      balanceGST: Number(item.estateRentSummary.balanceGST.toFixed(2)),
                      balanceGSTPenalty: Number(item.estateRentSummary.balanceGSTPenalty.toFixed(2)),
                      balanceRentPenalty: Number(item.estateRentSummary.balanceRentPenalty.toFixed(2)),
                      balanceAmount: Number(item.estateRentSummary.balanceAmount.toFixed(2))
                      }}))
                    dispatch(prepareFinalObject("Properties", properties))
                    let { Properties} = state.screenConfiguration.preparedFinalObject;
                    let id = getQueryArg(window.location.href, "tenantId");
                      const receiptQuery = [
                        { key: "consumerCodes", value:consumerCodes},
                        { key: "tenantId", value: id }
                    ]
                    downloadPaymentReceipt(receiptQuery, Properties,[], userInfo.name,'rent-payment');
                  }
                }
                else{
                  let tenantId = getQueryArg(window.location.href, "tenantId");
                  let consumerCodes = getQueryArg(window.location.href, "applicationNumber");
                  const queryObject = [
                    {
                      key: "tenantId",
                      value: tenantId
                    },
                    {
                      key: "applicationNumber",
                      value: consumerCodes
                    }
                  ];
                  const response = await getSearchApplicationsResults(queryObject);
                  const Applications = get(response, "Applications");
                  const { temp } = state.screenConfiguration.preparedFinalObject;
                  const feeEstimate = temp[0].estimateCardData;
                    const receiptQuery = [
                      { key: "consumerCodes", value:consumerCodes},
                      { key: "tenantId", value: tenantId }
                  ]
                  downloadPaymentReceipt(receiptQuery, Applications,feeEstimate, userInfo.name,'application-payment');
                }
                
              break; 
            }   
          }
        },
        visible: purpose === 'apply' ? true : purpose === 'pay' ? true : false
      },
      printFormButton: {
        componentPath: "Button",
        props: {
          variant: "outlined",
          color: "primary",
          style: {
            minWidth: "180px",
            height: "48px",
            marginRight: "16px"
          }
        },
        children: {
          printFormButtonLabel: (purpose === "pay" && type === "ESTATE_SERVICE_ESTATE_BRANCH.PROPERTY_MASTER") ? getLabel({
            labelName: "PRINT RECEIPT",
            labelKey: "ES_APPLICATION_BUTTON_PRINT_RECEIPT"
          }) : getLabel({
            labelName: "PRINT CONFIRMATION FORM",
            labelKey: "ES_APPLICATION_BUTTON_PRINT_CONF"
          })
        },
        onClickDefination: {
          action: "condition",
          callBack: async() => {
            switch(purpose){
              case 'apply':
                  if(type === 'EstateBranch_InternalServices_IssuanceOfNotice' || type === 'BuildingBranch_CitizenService_IssuanceOfNotice'){
                    const { Applications,temp } = state.screenConfiguration.preparedFinalObject;
                    let { applicationType} = Applications[0];
                    const documents = temp[0].reviewDocData;
                    const {branchType} = Applications[0];
                    if(branchType === "BuildingBranch"){
                      applicationType =  "BB-" + applicationType 
                    }
                    set(Applications[0],"additionalDetails.documents",documents)
                    downloadAcknowledgementForm(Applications,applicationType,[],"",'print');
                  }else{
                    const { Properties,PropertiesTemp } = state.screenConfiguration.preparedFinalObject; 
                    downloadSummary(Properties, PropertiesTemp);
                  }
              case 'pay': 
              if(type === 'ESTATE_SERVICE_ESTATE_BRANCH.PROPERTY_MASTER'){
                let fileNumber = getQueryArg(window.location.href, "fileNumber");
                const consumerCodes = getQueryArg(window.location.href, "applicationNumber");
                if(consumerCodes.startsWith('SITE')){
                  let queryObject = [
                    { key: "fileNumber", value: fileNumber }
                  ];
                  let response =  await getSearchResults(queryObject);
                   let properties = response.Properties.map(item => ({...item, estateRentSummary: {balanceRent: Number(item.estateRentSummary.balanceRent.toFixed(2)),
                    balanceGST: Number(item.estateRentSummary.balanceGST.toFixed(2)),
                    balanceGSTPenalty: Number(item.estateRentSummary.balanceGSTPenalty.toFixed(2)),
                    balanceRentPenalty: Number(item.estateRentSummary.balanceRentPenalty.toFixed(2)),
                    balanceAmount: Number(item.estateRentSummary.balanceAmount.toFixed(2))
                    }}))
                  dispatch(prepareFinalObject("Properties", properties))
                  let { Properties} = state.screenConfiguration.preparedFinalObject;
                  let id = getQueryArg(window.location.href, "tenantId");
                    const receiptQuery = [
                      { key: "consumerCodes", value:consumerCodes},
                      { key: "tenantId", value: id }
                  ]
                  downloadPaymentReceipt(receiptQuery, Properties,[], userInfo.name,'rent-payment','print');
                }
              }
              else{
                let tenantId = getQueryArg(window.location.href, "tenantId");
                let consumerCodes = getQueryArg(window.location.href, "applicationNumber");
                const queryObject = [
                  {
                    key: "tenantId",
                    value: tenantId
                  },
                  {
                    key: "applicationNumber",
                    value: consumerCodes
                  }
                ];
                const response = await getSearchApplicationsResults(queryObject);
                const Applications = get(response, "Applications");
                const { temp } = state.screenConfiguration.preparedFinalObject;
                const feeEstimate = temp[0].estimateCardData;
                const receiptQuery = [
                    { key: "consumerCodes", value:consumerCodes},
                    { key: "tenantId", value: tenantId }
                ]
                downloadPaymentReceipt(receiptQuery, Applications,feeEstimate, userInfo.name,'application-payment',print);
              }
              
              break; 
            }
           
          }
        },
        visible: purpose === 'apply' ? true : purpose === 'pay' ? true : false
      }
    });
  }
 
};