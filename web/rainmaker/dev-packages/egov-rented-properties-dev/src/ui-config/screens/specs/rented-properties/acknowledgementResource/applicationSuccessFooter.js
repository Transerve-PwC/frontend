import {
  getLabel
} from "egov-ui-framework/ui-config/screens/specs/utils";
import {
  ifUserRoleExists,download,
  downloadAcknowledgementFormForCitizen,downloadNoticeForm
} from "../../utils";
import set from "lodash/set";
import get from "lodash/get"
import { getQueryArg, setDocuments } from "egov-ui-framework/ui-utils/commons";
import { getUserInfo } from "egov-ui-kit/utils/localStorageUtils";
import {getSearchResults} from '../../../../../ui-utils/commons'
import { prepareFinalObject} from "egov-ui-framework/ui-redux/screen-configuration/actions";
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
  tenant,
  type
) => {
  const roleExists = ifUserRoleExists("CITIZEN");
  // const redirectionURL = roleExists ? "/tradelicense-citizen/home" : "/inbox";
  const redirectionURL = roleExists ? "/" : "/inbox";
  if (roleExists) {
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
            labelKey: "RP_BUTTON_HOME"
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
          downloadFormButtonLabel: getLabel({
            labelName: "DOWNLOAD CONFIRMATION FORM",
            labelKey: (type == "OWNERSHIPTRANSFERRP" || type == "DUPLICATECOPYOFALLOTMENTLETTERRP" || type == "PERMISSIONTOMORTGAGE") ? "RP_APPLICATION_BUTTON_DOWN_CONF" : "RP_DOWNLOAD_PAYMENT_RECIEPT"
          })
        },
        onClickDefination: {
          action: "condition",
          callBack: async() => {
            switch (type) {
              case "OWNERSHIPTRANSFERRP":
                const {
                  Owners, OwnersTemp
                } = state.screenConfiguration.preparedFinalObject;
                const documentsOT = OwnersTemp[0].reviewDocData;
                set(Owners[0], "additionalDetails.documents", documentsOT)
                downloadAcknowledgementFormForCitizen(Owners, OwnersTemp[0].estimateCardData, type, "ownership-transfer");
                break;

              case "DUPLICATECOPYOFALLOTMENTLETTERRP":
                const {
                  DuplicateCopyApplications, DuplicateTemp
                } = state.screenConfiguration.preparedFinalObject;
                let documents = DuplicateTemp[0].reviewDocData;
                set(DuplicateCopyApplications[0], "additionalDetails.documents", documents)
                downloadAcknowledgementFormForCitizen(DuplicateCopyApplications, DuplicateTemp[0].estimateCardData, type, "duplicate-copy");
                break;

              case "PERMISSIONTOMORTGAGE":
                const {
                  MortgageApplications, MortgageApplicationsTemp
                } = state.screenConfiguration.preparedFinalObject;
                let documentsMG = MortgageApplicationsTemp[0].reviewDocData;
                set(MortgageApplications[0], "additionalDetails.documents", documentsMG)
                downloadAcknowledgementFormForCitizen(MortgageApplications, MortgageApplicationsTemp[0].estimateCardData, type, "mortgage");
                break;

              default:
                  let consumerCodes = getQueryArg(window.location.href, "applicationNumber");
                  if(consumerCodes.startsWith('SITE')){
                    let transitNumber = consumerCodes.split('-')[1]
                    let queryObject = [
                      { key: "transitNumber", value: transitNumber }
                    ];
                    let payload =  await getSearchResults(queryObject);
                     let properties = payload.Properties.map(item => ({...item, rentSummary: {balanceAmount: Number(item.rentSummary.balanceAmount.toFixed(2)),
                        balanceInterest: Number(item.rentSummary.balanceInterest.toFixed(2)),
                        balancePrincipal: Number(item.rentSummary.balancePrincipal.toFixed(2))
                      }}))
                      dispatch(prepareFinalObject("Properties", properties))
                    let { Properties} = state.screenConfiguration.preparedFinalObject;
                    let codes = getQueryArg(window.location.href, "applicationNumber");
                    let id = getQueryArg(window.location.href, "tenantId");
                      const receiptQuery = [
                        { key: "consumerCodes", value:codes},
                        { key: "tenantId", value: id }
                    ]
                      download(receiptQuery, Properties,[], userInfo.name,'rent-payment');
                  }
                  else{
                    let consumerCodes = getQueryArg(window.location.href, "applicationNumber");
                    let tenantId = getQueryArg(window.location.href, "tenantId");
                    const OwnersData = [];
                    const receiptQueryString = [
                      { key: "consumerCodes", value:consumerCodes},
                      { key: "tenantId", value: tenantId }
                    ]
                    download(receiptQueryString, OwnersData,[], userInfo.name,'payment');             
                  }
             
                
                break;
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
          printFormButtonLabel: getLabel({
            labelName: "PRINT CONFIRMATION FORM",
            labelKey: (type == "OWNERSHIPTRANSFERRP" || type == "DUPLICATECOPYOFALLOTMENTLETTERRP" || type == "PERMISSIONTOMORTGAGE") ? "RP_APPLICATION_BUTTON_PRINT_CONF" : "RP_PRINT_PAYMENT_RECIEPT"
          })
        },
        onClickDefination: {
          action: "condition",
          callBack: async() => {
            switch (type) {
              case "OWNERSHIPTRANSFERRP":
                const {
                  Owners, OwnersTemp
                } = state.screenConfiguration.preparedFinalObject;
                const documentsOT = OwnersTemp[0].reviewDocData;
                set(Owners[0], "additionalDetails.documents", documentsOT)
                downloadAcknowledgementFormForCitizen(Owners, OwnersTemp[0].estimateCardData, type, "ownership-transfer",'print');
                break;

              case "DUPLICATECOPYOFALLOTMENTLETTERRP":
                const {
                  DuplicateCopyApplications, DuplicateTemp
                } = state.screenConfiguration.preparedFinalObject;
                let documents = DuplicateTemp[0].reviewDocData;
                set(DuplicateCopyApplications[0], "additionalDetails.documents", documents)
                downloadAcknowledgementFormForCitizen(DuplicateCopyApplications, DuplicateTemp[0].estimateCardData, type, "duplicate-copy",'print');
                break;

              case "PERMISSIONTOMORTGAGE":
                const {
                  MortgageApplications, MortgageApplicationsTemp
                } = state.screenConfiguration.preparedFinalObject;
                let documentsMG = MortgageApplicationsTemp[0].reviewDocData;
                set(MortgageApplications[0], "additionalDetails.documents", documentsMG)
                downloadAcknowledgementFormForCitizen(MortgageApplications, MortgageApplicationsTemp[0].estimateCardData, type, "mortgage",'print');
                break;

              default:
                  let consumerCodes = getQueryArg(window.location.href, "applicationNumber");
                  if(consumerCodes.startsWith('SITE')){
                    let transitNumber = consumerCodes.split('-')[1]
                    let queryObject = [
                      { key: "transitNumber", value: transitNumber }
                    ];
                    let payload =  await getSearchResults(queryObject);
                      let properties = payload.Properties.map(item => ({...item, rentSummary: {balanceAmount: Number(item.rentSummary.balanceAmount.toFixed(2)),
                        balanceInterest: Number(item.rentSummary.balanceInterest.toFixed(2)),
                        balancePrincipal: Number(item.rentSummary.balancePrincipal.toFixed(2))
                      }}))
                      dispatch(prepareFinalObject("Properties", properties))
                    let { Properties} = state.screenConfiguration.preparedFinalObject;
                    let codes = getQueryArg(window.location.href, "applicationNumber");
                    let id = getQueryArg(window.location.href, "tenantId");
                      const receiptQuery = [
                        { key: "consumerCodes", value:codes},
                        { key: "tenantId", value: id }
                    ]
                      download(receiptQuery, Properties,[], userInfo.name,'rent-payment','print');
                  }
                  else{
                    let consumerCodes = getQueryArg(window.location.href, "applicationNumber");
                    let tenantId = getQueryArg(window.location.href, "tenantId");
                    const OwnersData = [];
                    const receiptQueryString = [
                      { key: "consumerCodes", value:consumerCodes},
                      { key: "tenantId", value: tenantId }
                    ]
                    download(receiptQueryString, OwnersData,[], userInfo.name,'payment','print');             
                  }
              
                
                break;
            }
          }
        },
        visible: true
      }

    });
  } else {
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
            labelKey: "RP_BUTTON_HOME"
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
          downloadFormButtonLabel: getLabel({
            labelName: "DOWNLOAD CONFIRMATION FORM",
            labelKey: (type == "OWNERSHIPTRANSFERRP" || type == "DUPLICATECOPYOFALLOTMENTLETTERRP" || type == "PERMISSIONTOMORTGAGE") ? "RP_APPLICATION_BUTTON_DOWN_CONF" :type=="NOTICE_GENERATION"? "RP_DOWNLOAD_NOTICE": (type=="RENTED_PROPERTIES_COLONY_MILK.RENT" || type=="RENTED_PROPERTIES_COLONY_SECTOR_52_53.RENT"||type=="RENTED_PROPERTIES_COLONY_KUMHAR.RENT"||type=="RENTED_PROPERTIES_COLONY_VIKAS_NAGAR.RENT")?"RP_DOWNLOAD_PAYMENT_RECIEPT" : "RP_DOWNLOAD_RECEIPT"
          })
        },
        onClickDefination: {
          action: "condition",
          callBack: async() => {
             switch(type){
              case 'RENTED_PROPERTIES_COLONY_MILK.RENT':
                case 'RENTED_PROPERTIES_COLONY_SECTOR_52_53.RENT':
                  case 'RENTED_PROPERTIES_COLONY_KUMHAR.RENT':
                    case 'RENTED_PROPERTIES_COLONY_VIKAS_NAGAR.RENT':
              let consumerCodes = getQueryArg(window.location.href, "applicationNumber");
              let transitNumber = consumerCodes.split('-')[1]
              let queryObject = [
                { key: "transitNumber", value: transitNumber },
                {key:"state",value:"PM_APPROVED"},
                {key: "relations", value: 'owner,offlinepayment'}   
              ];
              let payload =  await getSearchResults(queryObject);
                let properties = payload.Properties.map(item => ({...item, rentSummary: {balanceAmount: Number(item.rentSummary.balanceAmount.toFixed(2)),
                  balanceInterest: Number(item.rentSummary.balanceInterest.toFixed(2)),
                  balancePrincipal: Number(item.rentSummary.balancePrincipal.toFixed(2))
                }}))
                dispatch(prepareFinalObject("Properties", properties))
              let { Properties} = state.screenConfiguration.preparedFinalObject;
            let tenantId = getQueryArg(window.location.href, "tenantId");
              const receiptQueryString = [
                { key: "consumerCodes", value:consumerCodes},
                { key: "tenantId", value: tenantId }
            ]
              download(receiptQueryString, Properties,[], userInfo.name,'rent-payment');
            break
            case 'NOTICE_GENERATION':
                const { notices } = state.screenConfiguration.preparedFinalObject;
                downloadNoticeForm(notices);  
        default:
          break;     
             }   
          }
        },
      visible: (type == "NOTICE_GENERATION" || type=="RENTED_PROPERTIES_COLONY_MILK.RENT" || type=="RENTED_PROPERTIES_COLONY_SECTOR_52_53.RENT"||type=="RENTED_PROPERTIES_COLONY_KUMHAR.RENT"||type=="RENTED_PROPERTIES_COLONY_VIKAS_NAGAR.RENT") ? true : false
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
          printFormButtonLabel: getLabel({
            labelName: "PRINT CONFIRMATION FORM",
            labelKey: (type == "OWNERSHIPTRANSFERRP" || type == "DUPLICATECOPYOFALLOTMENTLETTERRP" || type == "PERMISSIONTOMORTGAGE") ? "RP_APPLICATION_BUTTON_PRINT_CONF" : type=="NOTICE_GENERATION"? "RP_PRINT_NOTICE":(type=="RENTED_PROPERTIES_COLONY_MILK.RENT" || type=="RENTED_PROPERTIES_COLONY_SECTOR_52_53.RENT"||type=="RENTED_PROPERTIES_COLONY_KUMHAR.RENT"||type=="RENTED_PROPERTIES_COLONY_VIKAS_NAGAR.RENT")?"RP_PRINT_PAYMENT_RECIEPT" :"RP_PRINT_RECEIPT"
          })
        },
        onClickDefination: {
          action: "condition",
          callBack: async() => {
             switch(type){
              case 'RENTED_PROPERTIES_COLONY_MILK.RENT':
                case 'RENTED_PROPERTIES_COLONY_SECTOR_52_53.RENT':
                  case 'RENTED_PROPERTIES_COLONY_KUMHAR.RENT':
                    case 'RENTED_PROPERTIES_COLONY_VIKAS_NAGAR.RENT':
              let consumerCodes = getQueryArg(window.location.href, "applicationNumber");
              let transitNumber = consumerCodes.split('-')[1]
              let queryObject = [
                { key: "transitNumber", value: transitNumber },
                {key:"state",value:"PM_APPROVED"},
                {key: "relations", value: 'owner,offlinepayment'}   
              ];
              let payload =  await getSearchResults(queryObject);
                let properties = payload.Properties.map(item => ({...item, rentSummary: {balanceAmount: Number(item.rentSummary.balanceAmount.toFixed(2)),
                  balanceInterest: Number(item.rentSummary.balanceInterest.toFixed(2)),
                  balancePrincipal: Number(item.rentSummary.balancePrincipal.toFixed(2))
                }}))
                dispatch(prepareFinalObject("Properties", properties))
              let { Properties} = state.screenConfiguration.preparedFinalObject;
            let tenantId = getQueryArg(window.location.href, "tenantId");
              const receiptQueryString = [
                { key: "consumerCodes", value:consumerCodes},
                { key: "tenantId", value: tenantId }
            ]
              download(receiptQueryString, Properties,[], userInfo.name,'rent-payment','print');
            break
        case 'NOTICE_GENERATION':
            const { notices } = state.screenConfiguration.preparedFinalObject;
            downloadNoticeForm(notices,'print');     
        default:
          break;     
             }   
          }
        },
        visible: (type == "NOTICE_GENERATION" || type=="RENTED_PROPERTIES_COLONY_MILK.RENT" || type=="RENTED_PROPERTIES_COLONY_SECTOR_52_53.RENT"||type=="RENTED_PROPERTIES_COLONY_KUMHAR.RENT"||type=="RENTED_PROPERTIES_COLONY_VIKAS_NAGAR.RENT") ? true : false
      }
    });
  }
};
