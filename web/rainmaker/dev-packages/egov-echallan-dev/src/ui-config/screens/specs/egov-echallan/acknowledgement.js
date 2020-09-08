import {
  getCommonHeader,
  getCommonContainer,
  getTodaysDateInYMD
} from "egov-ui-framework/ui-config/screens/specs/utils";
import {
  applicationSuccessFooter,
  //paymentSuccessFooter,
  gotoHomeFooter,
  approvalSuccessFooter,
  paymentFailureFooter
} from "./acknowledgementResource/footers";
import acknowledgementCard from "./acknowledgementResource/acknowledgementUtils";
import { getQueryArg, getDateInEpoch } from "egov-ui-framework/ui-utils/commons";
import { getSearchResults, fetchMdmsData, sendPaymentReceiptOverMail } from "../../../../ui-utils/commons";
import { getLabel } from "egov-ui-framework/ui-config/screens/specs/utils";
//import  generatePdf from "../utils/receiptPdf";
import set from "lodash/set";
import get from "lodash/get";
import { getCurrentFinancialYear, numWords, convertEpochToDate, convertDateToEpoch, generateReceiptNumber, sendReceiptBymail } from "../utils";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getSearchResultsForNocCretificate, getSearchResultsForNocCretificateDownload } from "../../../../ui-utils/commons";
import { setEChallanPaymentMailSent, getEChallanPaymentMailSent,getapplicationType, getTenantId } from "egov-ui-kit/utils/localStorageUtils";


const getMdmsData = async (state, dispatch) => {
  try {
    let tenantId = getTenantId().length > 2 ? getTenantId().split('.')[0] : getTenantId();
    let mdmsBody = {
      MdmsCriteria: {
        tenantId: tenantId,
        moduleDetails: [
          {
            moduleName: "egec",
            masterDetails: [
              {
                name: "NotificationTemplate"
              },
            ]
          }
        ]
      }
    };
    await fetchMdmsData(state, dispatch, mdmsBody, false);
  } catch (e) {
    console.log(e);
  }
};


const getHeader = (applicationNumber) => {
  const encroachmentType = getQueryArg(window.location.href, "encroachmentType") === null ? '' : getQueryArg(window.location.href, "encroachmentType");
  return getCommonContainer({
    header: getCommonHeader({
      labelName: `Challan receipt generation for ${encroachmentType}  - FY -  (${getCurrentFinancialYear()})`, //later use getFinancialYearDates
      labelKey: ""
    }),
    applicationNumber: {
      uiFramework: "custom-atoms-local",
      moduleName: "egov-echallan",
      componentPath: "ApplicationNoContainer",
      props: {
        number: applicationNumber
      },
      visible: true
    }
  })
}


const getAcknowledgementCard = (
  state,
  dispatch,
  purpose,
  status,
  applicationNumber,
  secondNumber,
  tenant
) => {
  if (purpose === "pay" && status === "success") {
    //loadPdfGenerationData(applicationNumber, tenant);
    return {
      header: getHeader(applicationNumber),
      applicationSuccessCard: {
        uiFramework: "custom-atoms",
        componentPath: "Div",
        children: {
          card: acknowledgementCard({
            icon: "done",
            backgroundColor: "#39CB74",
            header: {
              labelName: "Fine Amount has been collected successfully!",
              labelKey: "EC_ECHALLAN_PAYMENT_COLLECTION_SUCCESS_MESSAGE_MAIN"
            },
            body: {
              labelName:
                "A notification regarding Fine paid has been sent to concerned Officer. Please download the receipt and show this message to officer",
              labelKey: "EC_ECHALLAN_PAYMENT_SUCCESS_MESSAGE_SUB"
            },
            tailText: {
              labelName: "Payment Receipt No.",
              labelKey: "EC_ECHALLAN_PMT_RCPT_NO"
            },
            number: generateReceiptNumber(applicationNumber)
          })
        },
        iframeForPdf: {
          uiFramework: "custom-atoms",
          componentPath: "Div"
        },
      },
      iframeForPdf: {
        uiFramework: "custom-atoms",
        componentPath: "Div"
      },
      paymentSuccessFooter: paymentSuccessFooter(applicationNumber, tenant, secondNumber)
    };
  } else if (purpose === "pay" && status === "failure") {
    return {
      header,
      applicationSuccessCard: {
        uiFramework: "custom-atoms",
        componentPath: "Div",
        children: {
          card: acknowledgementCard({
            icon: "close",
            backgroundColor: "#E54D42",
            header: {
              labelName: "Payment has failed!",
              labelKey: "EC_ECHALLAN_PAYMENT_FAILURE_MESSAGE_MAIN"
            },
            body: {
              labelName:
                "A notification regarding payment failure has been sent to the applicant.",
              labelKey: "EC_ECHALLAN_PAYMENT_FAILURE_MESSAGE_SUB"
            }
          })
        }
      },
      paymentFailureFooter: paymentFailureFooter(applicationNumber, tenant)
    };
  }
};

const setApplicationData = async (state, dispatch, applicationNumber, tenant, secondNumber) => {
  let RequestBody = {
    searchtext: applicationNumber,
    tenantId: tenant,
    action: '',
  }

  await getMdmsData(state, dispatch);

  const response = await getSearchResults(RequestBody);

  dispatch(prepareFinalObject("eChallanDetail", get(response, "ResponseBody[0]", [])));
  setSearchResponseForNocCretificate(state, dispatch, applicationNumber, tenant, secondNumber, true, false);
};

const setSearchResponseForNocCretificate = async (state, dispatch, applicationNumber, tenantId, secondNumber, ismailsend, isDownload) => {
  let violatorDetails = get(state, 'screenConfiguration.preparedFinalObject.eChallanDetail', []);
  let numbertowords = numWords(get(state, 'screenConfiguration.preparedFinalObject.eChallanDetail.paymentDetails.paymentAmount', '0')) + ' ' + 'only'
  let paydetails = get(state, 'screenConfiguration.preparedFinalObject.ReceiptTemp[0].Bill[0].billDetails[0].billAccountDetails',[]);
   
  //const secondNumber = getQueryArg(window.location.href, "secondNumber");
  //NOC_Receipts
  let data = {
    "receiptNo": generateReceiptNumber(violatorDetails.challanId), //"MCC-EC-1",
    "dated": convertEpochToDate(getDateInEpoch()), //convertEpochToDate(violatorDetails.paymentDetails.lastModifiedTime),
    "violatorName": violatorDetails.violatorName, // get(state, 'screenConfiguration.preparedFinalObject.eChallanDetail.violatorName', ''),
    "amount": violatorDetails.paymentDetails.paymentAmount, //get(state, 'screenConfiguration.preparedFinalObject.eChallanDetail.challanAmount', '0'),
    "amountInWord": numbertowords,
    "paymentMode": violatorDetails.paymentDetails.paymentMode === 'NA' ? 'Online' : violatorDetails.paymentDetails.paymentMode,
    "memoNo": violatorDetails.challanId,
    "fineAmount": violatorDetails.challanAmount,
    "storageAmount": violatorDetails.penaltyAmount,
 
  }

  let getFileStoreIdFor_RECEIPT = { "paymentEchallan": [data] }
  //http://192.168.12.116:8080/pdf-service/v1/_create?key=challanReceipt-ec&tenantId=pb

  let pdfCreateKey = "challanReceipt-ec";
  if (violatorDetails.encroachmentType === "Seizure of Vehicles") {
    pdfCreateKey = "challanReceiptVehicle-ec"
  }

  const response1_RECEIPT = await getSearchResultsForNocCretificate([
    { key: "tenantId", value: tenantId },
    { key: "applicationNumber", value: applicationNumber },
    { key: "getCertificateDataFileStoreId", value: getFileStoreIdFor_RECEIPT },
    { key: "requestUrl", value: `/pdf-service/v1/_create?key=${pdfCreateKey}&tenantId=` + tenantId }
  ]);

  const response2_RECEIPT = await getSearchResultsForNocCretificateDownload([
    { key: "tenantId", value: tenantId },
    { key: "applicationNumber", value: applicationNumber },
    { key: "filestoreIds", value: get(response1_RECEIPT, "filestoreIds[0]", "") },
    { key: "requestUrl", value: "/filestore/v1/files/url?tenantId=" + tenantId + "&fileStoreIds=" }
  ]);

  let httpLink_RECEIPT = get(response2_RECEIPT, get(response1_RECEIPT, "filestoreIds[0]", ""), "")
  //window.open(httpLink_RECEIPT,  "_blank");
  
  if (ismailsend && violatorDetails.emailId !== "") {
    if(getEChallanPaymentMailSent() === null || getEChallanPaymentMailSent() === true ){
      sendReceiptBymail(state, dispatch, httpLink_RECEIPT, violatorDetails, true);
      setEChallanPaymentMailSent(true);
    }
  }

  if (httpLink_RECEIPT != "" && isDownload)
    window.location.href = httpLink_RECEIPT;
};


export const paymentSuccessFooter = (applicationNumber, tenant, secondNumber) => {
  return getCommonApplyFooter({
    //call gotoHome
    downloadReceiptButton: {
      componentPath: "Button",
      props: {
        variant: "outlined",
        color: "primary",
        style: {
          //   minWidth: "200px",
          height: "48px",
          marginRight: "16px"
        }
      },
      children: {
        downloadReceiptButtonLabel: getLabel({
          labelName: "DOWNLOAD RECEIPT",
          labelKey: "EC_ECHALLAN_CONFIRMATION_BUTTON_DOWNLOAD_RECEIPT"
        })
      },
      onClickDefination: {
        action: "condition",
        callBack: (state, dispatch) => {
          //// generatePdf(state, dispatch, "receipt_download");
          setSearchResponseForNocCretificate(state, dispatch, applicationNumber, tenant, secondNumber, false, true);

        }
      }
    },
    gotoHome: {
      componentPath: "Button",
      props: {
        variant: "contained",
        color: "primary",
        style: {
          //    minWidth: "200px",
          height: "48px",
          marginRight: "16px"
        }
      },
      children: {
        goToHomeButtonLabel: getLabel({
          labelName: "GO TO HOME",
          labelKey: "NOC_COMMON_BUTTON_HOME"
        })
      },
      onClickDefination: {
        action: "page_change",
        path:
          process.env.REACT_APP_SELF_RUNNING === "true"
            ? `/egov-ui-framework/egov-home/search`
            : `/`
      },
      visible: false
    }
  });
};

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

const screenConfig = {
  uiFramework: "material-ui",
  name: "acknowledgement",
  components: {
    div: {
      uiFramework: "custom-atoms",
      componentPath: "Div",
      props: {
        className: "common-div-css"
      }
    }
  },
  beforeInitScreen: (action, state, dispatch) => {
    const purpose = getQueryArg(window.location.href, "purpose");
    const status = getQueryArg(window.location.href, "status");
    const applicationNumber = getQueryArg(
      window.location.href,
      "applicationNumber"
    );
    const secondNumber = getQueryArg(window.location.href, "secondNumber");
    const tenant = getQueryArg(window.location.href, "tenantId");


    const data = getAcknowledgementCard(
      state,
      dispatch,
      purpose,
      status,
      applicationNumber,
      secondNumber,
      tenant
    )
      ;
    setApplicationData(state, dispatch, applicationNumber, tenant, secondNumber);
    set(action, "screenConfig.components.div.children", data);
    return action;
  }
};

export default screenConfig;
