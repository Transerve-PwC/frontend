import {
  getLabel,
  getTextField,
  getCommonSubHeader
} from "egov-ui-framework/ui-config/screens/specs/utils";

import {
  downloadReceiptFromFilestoreID
} from "egov-common/ui-utils/commons"
import {
  toggleSnackbar
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import "./index.css";
import {
  validate
} from "egov-ui-framework/ui-redux/screen-configuration/utils";
import {
  handleScreenConfigurationFieldChange as handleField
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import get from "lodash/get";
import set from "lodash/set";
import filter from "lodash/filter";
import {
  httpRequest
} from "../../../../ui-utils/api";
import {
  prepareFinalObject,
  initScreen
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import {
  getQueryArg
} from "egov-ui-framework/ui-utils/commons";
import isUndefined from "lodash/isUndefined";
import isEmpty from "lodash/isEmpty";
import {
  getTenantId,
  getUserInfo,
  localStorageGet
} from "egov-ui-kit/utils/localStorageUtils";
import commonConfig from "config/common.js";
import {
  getLocaleLabels,
  getTransformedLocalStorgaeLabels,
  getFileUrlFromAPI
} from "egov-ui-framework/ui-utils/commons";
import axios from 'axios';
import {
  getSearchResults,
  getOwnershipSearchResults,
  getDuplicateCopySearchResults
} from "../../../../ui-utils/commons";
import moment from "moment";
import { BILLING_BUSINESS_SERVICE_DC, BILLING_BUSINESS_SERVICE_OT, WORKFLOW_BUSINESS_SERVICE_OT, WORKFLOW_BUSINESS_SERVICE_DC, BILLING_BUSINESS_SERVICE_RENT } from "../../../../ui-constants";

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

export const transformById = (payload, id) => {
  return (
    payload &&
    payload.reduce((result, item) => {
      result[item[id]] = {
        ...item
      };

      return result;
    }, {})
  );
};

export const getTranslatedLabel = (labelKey, localizationLabels) => {
  let translatedLabel = null;
  if (localizationLabels && localizationLabels.hasOwnProperty(labelKey)) {
    translatedLabel = localizationLabels[labelKey];
    if (
      translatedLabel &&
      typeof translatedLabel === "object" &&
      translatedLabel.hasOwnProperty("message")
    )
      translatedLabel = translatedLabel.message;
  }
  return translatedLabel || labelKey;
};

export const getFeesEstimateCard = props => {
  const {
    sourceJsonPath,
    ...rest
  } = props;
  return {
    uiFramework: "custom-containers-local",
    moduleName: "egov-rented-properties",
    componentPath: "EstimateCardContainer",
    props: {
      sourceJsonPath,
      ...rest
    }
  };
};

export const getRentSummaryCard = props => {
  const {
    sourceJsonPath,
    ...rest
  } = props;
  return {
    uiFramework: "custom-containers-local",
    moduleName: "egov-rented-properties",
    componentPath: "RentSummaryCardContainer",
    props: {
      sourceJsonPath,
      ...rest
    }
  };
};

const style = {
  textfieldIcon: {
    position: "relative",
    top: "25px",
    left: "-249%"
  },
  headerIcon: {
    position: "relative",
    bottom: "2px"
  }
};

export const getIconStyle = key => {
  return style[key];
};

export const getButtonVisibility = (status, button) => {
  if (status === "INITIATED" && button === "SUBMISSION") {
    return true;
  }
  if (status === "CITIZENACTIONREQUIRED" && button === "RESUBMIT")
    return true;
  if (status === "PENDINGPAYMENT" && button === "PROCEED TO PAYMENT")
    return true;
  if (status === "PENDINGAPPROVAL" && button === "APPROVE") return true;
  if (status === "PENDINGAPPROVAL" && button === "REJECT") return true;
  if (status === "APPROVED" && button === "CANCEL TRADE LICENSE") return true;
  if (status === "APPROVED" && button === "APPROVED") return true;
  if (status === "EXPIRED" && button === "EXPIRED") return true;
  if ((status === "OT_PENDINGPAYMENT" || status === "DC_PENDINGPAYMENT") && button === "PENDINGPAYMENT") return true;
  if ((status === "PM_APPROVED") && button === "APPROVED") return true;
  if ((status === "OT_PENDINGCLARIFICATION" || status === "DC_PENDINGCLARIFICATION" || status === "MG_PENDINGCLARIFICATION" || status === "PM_PENDINGCLARIFICATION" || status === "PM_REJECTED") && button === "EDIT") return true;

  return false;
};

export const getBill = async queryObject => {
  try {
    const response = await httpRequest(
      "post",
      "/billing-service/bill/v2/_fetchbill",
      "",
      queryObject
    );
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const getReceipt = async queryObject => {
  try {
    const response = await httpRequest(
      "post",
      "/collection-services/payments/_search",
      "",
      queryObject
    );
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const convertEpochToDate = dateEpoch => {
  const dateFromApi = new Date(dateEpoch);
  let month = dateFromApi.getMonth() + 1;
  let day = dateFromApi.getDate();
  let year = dateFromApi.getFullYear();
  month = (month > 9 ? "" : "0") + month;
  day = (day > 9 ? "" : "0") + day;
  return !!dateEpoch ? `${day}/${month}/${year}` : "";
};

export const convertDateToEpoch = (dateString, dayStartOrEnd = "dayend") => {
  //example input format : "2018-10-02"
  try {
    const parts = dateString.match(/(\d{4})-(\d{1,2})-(\d{1,2})/);
    const DateObj = new Date(Date.UTC(parts[1], parts[2] - 1, parts[3]));
    DateObj.setMinutes(DateObj.getMinutes() + DateObj.getTimezoneOffset());
    if (dayStartOrEnd === "dayend") {
      DateObj.setHours(DateObj.getHours() + 24);
      DateObj.setSeconds(DateObj.getSeconds() - 1);
    }
    return DateObj.getTime();
  } catch (e) {
    return dateString;
  }
};

export const addYears = (dateString, years) => {
  try {
    const date = new Date(Number(dateString))
    const fullYear = date.getFullYear();
    const addYearsDate = date.setFullYear(fullYear + years);
    return addYearsDate
  } catch (error) {
    return dateString
  }
}

export const convertDateTimeToEpoch = dateTimeString => {
  //example input format : "26-07-2018 17:43:21"
  try {
    // const parts = dateTimeString.match(
    //   /(\d{2})\-(\d{2})\-(\d{4}) (\d{2}):(\d{2}):(\d{2})/
    // );
    const parts = dateTimeString.match(
      /(\d{2})-(\d{2})-(\d{4}) (\d{2}):(\d{2}):(\d{2})/
    );
    return Date.UTC(+parts[3], parts[2] - 1, +parts[1], +parts[4], +parts[5]);
  } catch (e) {
    return dateTimeString;
  }
};

export const getMdmsData = async queryObject => {
  try {
    const response = await httpRequest(
      "post",
      "egov-mdms-service/v1/_search",
      "",
      [],
      queryObject
    );
    return response;
  } catch (error) {
    console.log(error);
    return {};
  }
};

export const downloadAcknowledgementForm = (Owners, feeEstimate, status, pdfkey, applicationType, mode = "download") => {
  let queryStr = []
  switch (applicationType) {
    case 'MG':
      queryStr = [{
          key: "key",
          value: status == `${applicationType}_APPROVED` ? `rp-${pdfkey}-approved-alternate` : `rp-${pdfkey}-fresh`
        },
        {
          key: "tenantId",
          value: "ch"
        }
      ]
      break;
    case 'DC':
    case 'OT':
      if(process.env.REACT_APP_NAME === "Citizen"){
        queryStr = [{
          key: "key",
          value: status == `${applicationType}_PENDINGPAYMENT` || status == `${applicationType}_APPROVED` || status == `${applicationType}_REJECTEDPAID` ||
            status == `${applicationType}_PENDINGCLAPPROVAL` || status == `${applicationType}_PENDINGSAREJECTION` ? `rp-${pdfkey}-paid` : `rp-${pdfkey}-fresh`
        },
        {
          key: "tenantId",
          value: "ch"
        }
      ]
      }else{
        queryStr = [{
          key: "key",
          value: status == `${applicationType}_PENDINGPAYMENT` || status == `${applicationType}_APPROVED` || status == `${applicationType}_REJECTEDPAID` || status == `${applicationType}_PENDINGSAAPPROVAL` || status == `${applicationType}_PENDINGSAREJECTION` ||
            status == `${applicationType}_PENDINGCLAPPROVAL` ? `rp-${pdfkey}-paid` : (status == `${applicationType}_PENDINGSIVERIFICATION` || status == `${applicationType}_PENDINGCAAPPROVAL` || status == `${applicationType}_PENDINGAPRO`) ? `rp-${pdfkey}-charges` : `rp-${pdfkey}-fresh`
        },
        {
          key: "tenantId",
          value: "ch"
        }
      ]
      }
      break;
  }

  let {
    documents
  } = Owners[0].additionalDetails;
  const length = documents.length % 4
  documents = !!length ? [...documents, ...new Array(4 - length).fill({
    title: "",
    name: ""
  })] : documents
  const myDocuments = documents.map((item) => ({
    ...item,
    title: getLocaleLabels(item.title, item.title)
  })).reduce((splits, i) => {
    const length = splits.length
    const rest = splits.slice(0, length - 1);
    const lastArray = splits[length - 1] || [];
    return lastArray.length < 4 ? [...rest, [...lastArray, i]] : [...splits, [i]]
  }, []);
  let ownerInfo = Owners[0];

  switch (applicationType) {
    case 'OT':
      ownerInfo = {
        ...ownerInfo,
        ownerDetails: {
          ...Owners[0].ownerDetails,
          ownershipTransferDocuments: myDocuments
        }
      }
      break;
    case 'DC':
    case 'MG':
      ownerInfo = {
        ...ownerInfo,
        applicationDocuments: myDocuments
      }
      break;
    default:
      break;

  }

  const DOWNLOADRECEIPT = {
    GET: {
      URL: "/pdf-service/v1/_create",
      ACTION: "_get",
    },
  };
  try {
    switch (applicationType) {
      case 'DC':
        httpRequest("post", DOWNLOADRECEIPT.GET.URL, DOWNLOADRECEIPT.GET.ACTION, queryStr, {
            DuplicateCopyApplications: [ownerInfo]
          }, {
            'Accept': 'application/json'
          }, {
            responseType: 'arraybuffer'
          })
          .then(res => {
            res.filestoreIds[0]
            if (res && res.filestoreIds && res.filestoreIds.length > 0) {
              res.filestoreIds.map(fileStoreId => {
                downloadReceiptFromFilestoreID(fileStoreId, mode)
              })
            } else {
              console.log("Error In Acknowledgement form Download");
            }
          });
        break;
      case 'MG':
        httpRequest("post", DOWNLOADRECEIPT.GET.URL, DOWNLOADRECEIPT.GET.ACTION, queryStr, {
            MortgageApplications: [ownerInfo]
          }, {
            'Accept': 'application/json'
          }, {
            responseType: 'arraybuffer'
          })
          .then(res => {
            res.filestoreIds[0]
            if (res && res.filestoreIds && res.filestoreIds.length > 0) {
              res.filestoreIds.map(fileStoreId => {
                downloadReceiptFromFilestoreID(fileStoreId, mode)
              })
            } else {
              console.log("Error In Acknowledgement form Download");
            }
          });
        break;
      case 'OT':
        httpRequest("post", DOWNLOADRECEIPT.GET.URL, DOWNLOADRECEIPT.GET.ACTION, queryStr, {
            Owners: [ownerInfo]
          }, {
            'Accept': 'application/json'
          }, {
            responseType: 'arraybuffer'
          })
          .then(res => {
            res.filestoreIds[0]
            if (res && res.filestoreIds && res.filestoreIds.length > 0) {
              res.filestoreIds.map(fileStoreId => {
                downloadReceiptFromFilestoreID(fileStoreId, mode)
              })
            } else {
              console.log("Error In Acknowledgement form Download");
            }
          });
        break;
      default:
        break;
    }
  } catch (exception) {
    alert('Some Error Occured while downloading Acknowledgement form!');
  }
}

export const downloadAcknowledgementFormForCitizen = (Owners, feeEstimate, type, pdfkey, mode = "download") => {
  let queryStr = []
  switch (type) {
    case 'PERMISSIONTOMORTGAGE':
      queryStr = [{
          key: "key",
          value: `rp-${pdfkey}-fresh`
        },
        {
          key: "tenantId",
          value: "ch"
        }
      ]
      break;
    case 'DUPLICATECOPYOFALLOTMENTLETTERRP':
    case 'OWNERSHIPTRANSFERRP':
      queryStr = [{
          key: "key",
          value: `rp-${pdfkey}-fresh`
        },
        {
          key: "tenantId",
          value: "ch"
        }
      ]
      break;
  }

  let {
    documents
  } = Owners[0].additionalDetails;
  const length = documents.length % 4
  documents = !!length ? [...documents, ...new Array(4 - length).fill({
    title: "",
    name: ""
  })] : documents
  const myDocuments = documents.map((item) => ({
    ...item,
    title: getLocaleLabels(item.title, item.title)
  })).reduce((splits, i) => {
    const length = splits.length
    const rest = splits.slice(0, length - 1);
    const lastArray = splits[length - 1] || [];
    return lastArray.length < 4 ? [...rest, [...lastArray, i]] : [...splits, [i]]
  }, []);
  let ownerInfo = Owners[0];

  switch (type) {
    case 'OWNERSHIPTRANSFERRP':
      ownerInfo = {
        ...ownerInfo,
        ownerDetails: {
          ...Owners[0].ownerDetails,
          ownershipTransferDocuments: myDocuments
        }
      }
      break;
    case 'DUPLICATECOPYOFALLOTMENTLETTERRP':
    case 'PERMISSIONTOMORTGAGE':
      ownerInfo = {
        ...ownerInfo,
        applicationDocuments: myDocuments
      }
      break;
    default:
      break;

  }

  const DOWNLOADRECEIPT = {
    GET: {
      URL: "/pdf-service/v1/_create",
      ACTION: "_get",
    },
  };
  try {
    switch (type) {
      case 'DUPLICATECOPYOFALLOTMENTLETTERRP':
        httpRequest("post", DOWNLOADRECEIPT.GET.URL, DOWNLOADRECEIPT.GET.ACTION, queryStr, {
            DuplicateCopyApplications: [ownerInfo]
          }, {
            'Accept': 'application/json'
          }, {
            responseType: 'arraybuffer'
          })
          .then(res => {
            res.filestoreIds[0]
            if (res && res.filestoreIds && res.filestoreIds.length > 0) {
              res.filestoreIds.map(fileStoreId => {
                downloadReceiptFromFilestoreID(fileStoreId, mode)
              })
            } else {
              console.log("Error In Acknowledgement form Download");
            }
          });
        break;
      case 'PERMISSIONTOMORTGAGE':
        httpRequest("post", DOWNLOADRECEIPT.GET.URL, DOWNLOADRECEIPT.GET.ACTION, queryStr, {
            MortgageApplications: [ownerInfo]
          }, {
            'Accept': 'application/json'
          }, {
            responseType: 'arraybuffer'
          })
          .then(res => {
            res.filestoreIds[0]
            if (res && res.filestoreIds && res.filestoreIds.length > 0) {
              res.filestoreIds.map(fileStoreId => {
                downloadReceiptFromFilestoreID(fileStoreId, mode)
              })
            } else {
              console.log("Error In Acknowledgement form Download");
            }
          });
        break;
      case 'OWNERSHIPTRANSFERRP':
        httpRequest("post", DOWNLOADRECEIPT.GET.URL, DOWNLOADRECEIPT.GET.ACTION, queryStr, {
            Owners: [ownerInfo]
          }, {
            'Accept': 'application/json'
          }, {
            responseType: 'arraybuffer'
          })
          .then(res => {
            res.filestoreIds[0]
            if (res && res.filestoreIds && res.filestoreIds.length > 0) {
              res.filestoreIds.map(fileStoreId => {
                downloadReceiptFromFilestoreID(fileStoreId, mode)
              })
            } else {
              console.log("Error In Acknowledgement form Download");
            }
          });
        break;
      default:
        break;
    }
  } catch (exception) {
    alert('Some Error Occured while downloading Acknowledgement form!');
  }
}

export const downloadCertificateForm = (Owners, data, applicationType,tenantId, mode = 'download') => {
  let queryStr = []
  switch(applicationType){
    case 'mg':
        queryStr = [{
          key: "key",
          value: `rp-mortgage-letter`
        },
        {
          key: "tenantId",
          value: "ch"
        }
      ]
      break;
    case 'dc':
    case 'ot':
    case 'original':  
        queryStr = [{
          key: "key",
          value: `rp-${applicationType}-allotment-letter`
        },
        {
          key: "tenantId",
          value: "ch"
        }
      ]
      break; 
    default:      
  }
  let ownersData = Owners[0];
  const DOWNLOADRECEIPT = {
    GET: {
      URL: "/pdf-service/v1/_create",
      ACTION: "_get",
    },
  };
  try {
    switch (applicationType) {
      case 'dc':
        httpRequest("post", DOWNLOADRECEIPT.GET.URL, DOWNLOADRECEIPT.GET.ACTION, queryStr, {
            DuplicateCopyApplications: [ownersData]
          }, {
            'Accept': 'application/json'
          }, {
            responseType: 'arraybuffer'
          })
          .then(res => {
            res.filestoreIds[0]
            if (res && res.filestoreIds && res.filestoreIds.length > 0) {
              res.filestoreIds.map(fileStoreId => {
                downloadReceiptFromFilestoreID(fileStoreId, mode)
              })
            } else {
              console.log("Error In Acknowledgement form Download");
            }
          });
        break;

      case 'ot':
        httpRequest("post", DOWNLOADRECEIPT.GET.URL, DOWNLOADRECEIPT.GET.ACTION, queryStr, {
            Owners: [ownersData]
          }, {
            'Accept': 'application/json'
          }, {
            responseType: 'arraybuffer'
          })
          .then(res => {
            res.filestoreIds[0]
            if (res && res.filestoreIds && res.filestoreIds.length > 0) {
              res.filestoreIds.map(fileStoreId => {
                downloadReceiptFromFilestoreID(fileStoreId, mode)
              })
            } else {
              console.log("Error In Acknowledgement form Download");
            }
          });
        break;
        
      case 'original':
        httpRequest("post", DOWNLOADRECEIPT.GET.URL, DOWNLOADRECEIPT.GET.ACTION, queryStr, {
            Properties: [ownersData]
          }, {
            'Accept': 'application/json'
          }, {
            responseType: 'arraybuffer'
          })
          .then(res => {
            res.filestoreIds[0]
            if (res && res.filestoreIds && res.filestoreIds.length > 0) {
              res.filestoreIds.map(fileStoreId => {
                downloadReceiptFromFilestoreID(fileStoreId, mode)
              })
            } else {
              console.log("Error In Acknowledgement form Download");
            }
          });
        break;
      case 'mg':
          httpRequest("post", DOWNLOADRECEIPT.GET.URL, DOWNLOADRECEIPT.GET.ACTION, queryStr, {
            MortgageApplications: [ownersData]
          }, {
            'Accept': 'application/json'
          }, {
            responseType: 'arraybuffer'
          })
          .then(res => {
            res.filestoreIds[0]
            if (res && res.filestoreIds && res.filestoreIds.length > 0) {
              res.filestoreIds.map(fileStoreId => {
                downloadReceiptFromFilestoreID(fileStoreId, mode)
              })
            } else {
              console.log("Error In Acknowledgement form Download");
            }
          });
        break;
    }
  } catch (exception) {
    alert('Some Error Occured while downloading Acknowledgement form!');
  }
}


export const downloadNoticeForm = (notice , mode="download") => {
  let queryStr = []
  const noticeType = notice[0].noticeType;
  switch (noticeType) {
    case 'Recovery':
      queryStr = [{
        key: "key",
        value: `rp-recovery-notice`
      },
      {
        key: "tenantId",
        value: "ch"
      }]
      break;
    case 'Violation':  
    queryStr = [{
      key: "key",
      value: `rp-violation-notice`
    },
    {
      key: "tenantId",
      value: "ch"
    }]
    break;
    default:
      break;
  }
const DOWNLOADRECEIPT = {
  GET: {
    URL: "/pdf-service/v1/_create",
    ACTION: "_get",
  },
};
try {
      httpRequest("post", DOWNLOADRECEIPT.GET.URL, DOWNLOADRECEIPT.GET.ACTION, queryStr, {
          notices:notice
        }, {
          'Accept': 'application/json'
        }, {
          responseType: 'arraybuffer'
        })
        .then(res => {
          res.filestoreIds[0]
          if (res && res.filestoreIds && res.filestoreIds.length > 0) {
            res.filestoreIds.map(fileStoreId => {
              downloadReceiptFromFilestoreID(fileStoreId, mode)
            })
          } else {
            console.log("Error In Acknowledgement form Download");
          }
        });



} catch (exception) {
  alert('Some Error Occured while downloading Acknowledgement form!');
}
}

export const download = (receiptQueryString, Properties, data, generatedBy,type, mode = "download") => {
  const FETCHRECEIPT = {
    GET: {
      URL: "/collection-services/payments/_search",
      ACTION: "_get",
    },
  };
  const DOWNLOADRECEIPT = {
    GET: {
      URL: "/pdf-service/v1/_create",
      ACTION: "_get",
    },
  };
  try {
    httpRequest("post", FETCHRECEIPT.GET.URL, FETCHRECEIPT.GET.ACTION, receiptQueryString).then((payloadReceiptDetails) => {
      // const queryStr = [{
      //     key: "key",
      //     value: "rp-payment-receipt"
      //   },
      //   {
      //     key: "tenantId",
      //     value: receiptQueryString[1].value.split('.')[0]
      //   }
      // ]

      const queryStr = [{
        key: "key",
        value: `rp-${type}-receipt`
      },
      {
        key: "tenantId",
        value: receiptQueryString[1].value.split('.')[0]
      }
    ]
      if (payloadReceiptDetails && payloadReceiptDetails.Payments && payloadReceiptDetails.Payments.length == 0) {
        console.log("Could not find any receipts");
        return;
      }
      let {
        Payments
      } = payloadReceiptDetails;
      let time = Payments[0].paymentDetails[0].auditDetails.lastModifiedTime

      let {
        billAccountDetails
      } = Payments[0].paymentDetails[0].bill.billDetails[0];
      billAccountDetails = billAccountDetails.map(({
        taxHeadCode,
        ...rest
      }) => ({
        ...rest,
        taxHeadCode: taxHeadCode.includes("_APPLICATION_FEE") ? "RP_DUE" : taxHeadCode.includes("_PENALTY") ? "RP_PENALTY" : taxHeadCode.includes("_TAX") ? "RP_TAX" : taxHeadCode.includes("_ROUNDOFF") ? "RP_ROUNDOFF" : taxHeadCode.includes("_PUBLICATION_FEE") ? "RP_CHARGES" : taxHeadCode
      }))
      Payments = [{
        ...Payments[0],
        paymentDetails: [{
          ...Payments[0].paymentDetails[0],
          bill: {
            ...Payments[0].paymentDetails[0].bill,
            billDetails: [{
              ...Payments[0].paymentDetails[0].bill.billDetails[0],
              billAccountDetails
            }]
          }
        }]
      }]

      if(time){
        time = moment(new Date(time)).format("h:mm:ss a")
      }
      Payments = [{
        ...Payments[0],paymentDetails:[{
          ...Payments[0].paymentDetails[0],auditDetails:{
            ...Payments[0].paymentDetails[0].auditDetails,lastModifiedTime:time
          }
        }]
      }]
      
      const roleExists = ifUserRoleExists("CITIZEN");
       if(roleExists && type==="rent-payment"){
      
          Properties[0]["offlinePaymentDetails"] = []
        
          let transactionNumber = {
            "transactionNumber" : Payments[0].transactionNumber
          }
          Properties[0].offlinePaymentDetails.push(transactionNumber)
      }
      
      httpRequest("post", DOWNLOADRECEIPT.GET.URL, DOWNLOADRECEIPT.GET.ACTION, queryStr, {
          Payments,
          Properties,
          generatedBy
        }, {
          'Accept': 'application/json'
        }, {
          responseType: 'arraybuffer'
        })
        .then(res => {
          res.filestoreIds[0]
          if (res && res.filestoreIds && res.filestoreIds.length > 0) {
            res.filestoreIds.map(fileStoreId => {
              downloadReceiptFromFilestoreID(fileStoreId, mode)
            })
          } else {
            console.log("Error In Receipt Download");
          }
        });
    })
  } catch (exception) {
    alert('Some Error Occured while downloading Receipt!');
  }
}


export const prepareDocumentTypeObj = documents => {
  let documentsArr =
    documents.length > 0 ?
    documents.reduce((documentsArr, item, ind) => {
      documentsArr.push({
        name: item.code,
        required: item.required,
        jsonPath: `Properties[0].propertyDetails.applicationDocuments[${ind}]`,
        statement: item.description
      });
      return documentsArr;
    }, []) :
    [];
  return documentsArr;
};

const getEstimateData = (ResponseData, isPaid, data) => {
  if (ResponseData) {
    const {
      billAccountDetails
    } = ResponseData.billDetails[0];
    let transformedData = billAccountDetails.reduce((result, item) => {
      if (isPaid) {
        item.accountDescription &&
          result.push({
            name: {
              labelName: item.accountDescription.split("-")[0],
              labelKey: item.accountDescription.split("-")[0]
            },
            // value: getTaxValue(item)  
            order: item.order,
            value: item.amount
          });
        item.taxHeadCode &&
          result.push({
            name: {
              labelName: item.taxHeadCode,
              labelKey: item.taxHeadCode
            },
            order: item.order,
            // value: getTaxValue(item),
            value: item.amount
          });
      } else {
        item.taxHeadCode &&
          result.push({
            name: {
              labelName: item.taxHeadCode,
              labelKey: item.taxHeadCode
            },
            order: item.order,
            value: item.amount
          });
      }
      return result;
    }, []);
    transformedData = transformedData.sort((a, b) => {
      return a.order < b.order ? -1 : a.order > b.order ? 1 : a.value > b.value ? -1 : 0
    }).map(item => ({
      ...item,
      value: item.value.toFixed(2)
    }))
    return transformedData
  }
};

const isApplicationPaid = (currentStatus,workflowCode) => {
let isPAID = false;
if(currentStatus==="CITIZENACTIONREQUIRED" || currentStatus === "OT_PENDINGPAYMENT" || currentStatus === "DC_PENDINGPAYMENT"){
  return isPAID;
}
const businessServiceData = JSON.parse(localStorageGet("businessServiceData"));
  if (!isEmpty(businessServiceData)) {
    const tlBusinessService = JSON.parse(localStorageGet("businessServiceData")).filter(item => item.businessService === workflowCode)
    const states = tlBusinessService && tlBusinessService.length > 0 && tlBusinessService[0].states;
    for (var i = 0; i < states.length; i++) {
      if (states[i].state === currentStatus) {
        break;
      }
      if (
        states[i].actions &&
        states[i].actions.filter(item => item.action === "PAY").length > 0
      ) {
        isPAID = true;
        break;
      }
    }
  } else {
    isPAID = false;
  }

  return isPAID;
};

export const createEstimateData = async (
  data,
  jsonPath,
  dispatch,
  href = {},
  _workflow
) => {
  const workflowCode = get(data, "workflowCode") ? get(data, "workflowCode") : _workflow
  const applicationNo = getQueryArg(href, "applicationNumber") || getQueryArg(href, "consumerCode");
  const tenantId =
    get(data, "tenantId") || getQueryArg(href, "tenantId");
  const businessService = get(data, "billingBusinessService", "") || getQueryArg(href, "businessService")
  const queryObj = [{
      key: "tenantId",
      value: tenantId
    },
    {
      key: "consumerCodes",
      value: applicationNo
    },
    {
      key: "businessService",
      value: businessService
    }
  ];
  const getBillQueryObj = [{
      key: "tenantId",
      value: tenantId
    },
    {
      key: "consumerCode",
      value: applicationNo
    },
    {
      key: "businessService",
      value: businessService
    }
  ];
  const currentStatus = !!data && (data.applicationState || data.state);
  const isPAID = isApplicationPaid(currentStatus, workflowCode);
  const fetchBillResponse = await getBill(getBillQueryObj);
  const payload = isPAID ?
    await getReceipt(queryObj.filter(item => item.key !== "businessService")) :
    fetchBillResponse && fetchBillResponse.Bill && fetchBillResponse.Bill[0];

  let estimateData = payload ?
    isPAID ?
    payload &&
    payload.Payments &&
    payload.Payments.length > 0 &&
    getEstimateData(
      payload.Payments[0].paymentDetails[0].bill,
      isPAID,
      data
    ) :
    payload && getEstimateData(payload, false, data) :
    [];
  estimateData = estimateData || [];
  set(
    estimateData,
    "payStatus",
    isPAID
  );
  dispatch(prepareFinalObject(jsonPath, estimateData));

  /** Waiting for estimate to load while downloading confirmation form */
  var event = new CustomEvent("estimateLoaded", {
    detail: true
  });
  window.parent.document.dispatchEvent(event);
  /** END */

  return payload;
};

export const validateFields = (
  objectJsonPath,
  state,
  dispatch,
  screen = "apply"
) => {
  const fields = get(
    state.screenConfiguration.screenConfig[screen],
    objectJsonPath, {}
  );
  let isFormValid = true;
  for (var variable in fields) {
    if (fields.hasOwnProperty(variable)) {
      if (
        fields[variable] &&
        fields[variable].props &&
        (fields[variable].props.disabled === undefined ||
          !fields[variable].props.disabled) &&
        !validate(
          screen, {
            ...fields[variable],
            value: get(
              state.screenConfiguration.preparedFinalObject,
              fields[variable].jsonPath
            )
          },
          dispatch,
          true
        )
      ) {
        isFormValid = false;
      }
    }
  }
  return isFormValid;
};

export const epochToYmdDate = et => {
  if (!et) return null;
  if (typeof et === "string") return et;
  var date = new Date(Math.round(Number(et)));
  var formattedDate =
    date.getUTCFullYear() +
    "-" +
    (date.getUTCMonth() + 1) +
    "-" +
    date.getUTCDate();
  return formattedDate;
};

export const getTodaysDateInYMD = () => {
  let date = new Date();
  //date = date.valueOf();
  let month = date.getMonth() + 1;
  let day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
  date = `${date.getFullYear()}-${month}-${day}`;
  // date = epochToYmdDate(date);
  return date;
};

export const getNextMonthDateInYMD = () => {
  //For getting date of same day but of next month
  let date = getTodaysDateInYMD();
  date =
    date.substring(0, 5) +
    (parseInt(date.substring(5, 7)) + 1) +
    date.substring(7, 10);
  return date;
};

export const fetchBill = async (action, state, dispatch, businessService) => {
  //For Adhoc
  // Search License
  let queryObject = [{
      key: "tenantId",
      value: getQueryArg(window.location.href, "tenantId")
    },
    {
      key: "applicationNumber",
      value: getQueryArg(window.location.href, "consumerCode")
    },
    {
      key: "consumerCode",
      value: getQueryArg(window.location.href, "consumerCode")
    }
  ];
  // const response = await getSearchResults(queryObject);
  //get bill and populate estimate card
  let payload;
  let consumerCode = getQueryArg(window.location.href, "consumerCode");
  let consumerNumber=consumerCode.split("-")[2]
  switch (consumerNumber) {
    case "OT": {
      const response = await getOwnershipSearchResults(queryObject)
      payload = response &&
        response.Owners &&
        (await createEstimateData(
          response.Owners[0],
          "OwnersTemp[0].estimateCardData",
          dispatch,
          window.location.href,
          WORKFLOW_BUSINESS_SERVICE_OT
        ));
      //set in redux to be used for adhoc
      response &&
        response.Owners &&
        dispatch(prepareFinalObject("Owners[0]", response.Owners[0]));
      break
    }
    case "DC": {
      const response = await getDuplicateCopySearchResults(queryObject)
      payload = response && response.DuplicateCopyApplications && (
        await createEstimateData(
          response.DuplicateCopyApplications[0],
          "DuplicateTemp[0].estimateCardData",
          dispatch,
          window.location.href,
          WORKFLOW_BUSINESS_SERVICE_DC
        )
      )
      response &&
        response.DuplicateCopyApplications &&
        dispatch(prepareFinalObject("DuplicateCopyApplications[0]", response.DuplicateCopyApplications[0]));
      break
    }
    default:  
    {
      const response = get(state.screenConfiguration.preparedFinalObject, "Properties[0]")
      payload = await createEstimateData(
        response,
        "PropertiesTemp[0].estimateCardData",
        dispatch,
        window.location.href,
      )
      break
    }
  }

  //initiate receipt object
  payload &&
    payload.billResponse &&
    dispatch(
      prepareFinalObject("ReceiptTemp[0].Bill[0]", payload.billResponse.Bill[0])
    );

  //set amount paid as total amount from bill - destination changed in CS v1.1
  payload &&
    payload.billResponse &&
    dispatch(
      prepareFinalObject(
        "ReceiptTemp[0].Bill[0].taxAndPayments[0].amountPaid",
        payload.billResponse.Bill[0].billDetails[0].totalAmount
      )
    );

  //Collection Type Added in CS v1.1
  payload &&
    payload.billResponse &&
    dispatch(
      prepareFinalObject(
        "ReceiptTemp[0].Bill[0].billDetails[0].collectionType",
        "COUNTER"
      )
    );

  //set total amount in instrument
  payload &&
    payload.billResponse &&
    dispatch(
      prepareFinalObject(
        "ReceiptTemp[0].instrument.amount",
        payload.billResponse.Bill[0].billDetails[0].totalAmount
      )
    );

  //Initially select instrument type as Cash
  dispatch(
    prepareFinalObject("ReceiptTemp[0].instrument.instrumentType.name", "Cash")
  );

  //set tenantId
  dispatch(
    prepareFinalObject(
      "ReceiptTemp[0].tenantId",
      getQueryArg(window.location.href, "tenantId")
    )
  );

  //set tenantId in instrument
  dispatch(
    prepareFinalObject(
      "ReceiptTemp[0].instrument.tenantId",
      getQueryArg(window.location.href, "tenantId")
    )
  );
};

export const ifUserRoleExists = role => {
  let userInfo = JSON.parse(getUserInfo());
  const roles = get(userInfo, "roles");
  const roleCodes = roles ? roles.map(role => role.code) : [];
  if (roleCodes.indexOf(role) > -1) {
    return true;
  } else return false;
};

export const showCityPicker = (state, dispatch) => {
  let toggle = get(
    state.screenConfiguration.screenConfig["home"],
    "components.cityPickerDialog.props.open",
    false
  );
  dispatch(
    handleField("home", "components.cityPickerDialog", "props.open", !toggle)
  );
};

export const applyForm = (state, dispatch, url) => {
  const tenantId = get(
    state.screenConfiguration.preparedFinalObject,
    "citiesByModule.citizenTenantId"
  );

  const isTradeDetailsValid = validateFields(
    "components.cityPickerDialog.children.dialogContent.children.popup.children.cityPicker.children",
    state,
    dispatch,
    "home"
  );

  if (isTradeDetailsValid) {
    window.location.href =
      process.env.NODE_ENV === "production" ?
      `/citizen${url}?tenantId=${tenantId}` :
      `${url}?tenantId=${tenantId}`;
  }
};

export const sortByEpoch = (data, order) => {
  if (order) {
    return data.sort((a, b) => {
      return a[a.length - 1] - b[b.length - 1];
    });
  } else {
    return data.sort((a, b) => {
      return b[b.length - 1] - a[a.length - 1];
    });
  }
};

export const getEpochForDate = date => {
  const dateSplit = date.split("/");
  return new Date(dateSplit[2], dateSplit[1] - 1, dateSplit[0]).getTime();
};

export const getTextToLocalMapping = label => {
  const localisationLabels = getTransformedLocalStorgaeLabels();
  switch (label) {
    case "Status":
      return getLocaleLabels(
        "Status",
        "RP_COMMON_TABLE_COL_STATUS",
        localisationLabels
      );
    case "Transit No":
      return getLocaleLabels(
        "Transit No",
        "RP_COMMON_TABLE_COL_TRANSIT_NO",
        localisationLabels
      );
    case "Property Id":
      return getLocaleLabels(
        "Property Id",
        "RP_COMMON_TABLE_COL_PROPERTY_ID",
        localisationLabels
      )

    case "Colony":
      return getLocaleLabels(
        "Colony",
        "RP_COMMON_TABLE_COL_COLONY",
        localisationLabels
      );

    case "Status":
      return getLocaleLabels(
        "Status",
        "RP_COMMON_TABLE_COL_STATUS",
        localisationLabels
      );

    case "Owner":
      return getLocaleLabels(
        "Owner",
        "RP_COMMON_TABLE_COL_OWNER",
        localisationLabels
      );
    default: return getLocaleLabels(label, label, localisationLabels)
  }
};

export const checkValueForNA = value => {
  return value ? value : "NA";
};

export const calculateAge = dob => {
  var regEx = /^[12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/i
  if (regEx.test(dob)) {
    dob = new Date(dob);
    return new Number((new Date().getTime() - dob.getTime()) / 31536000000).toFixed(0);
  } else {
    const newTimestamp = new Date(dob).getTime();
    if (!isNaN(parseFloat(newTimestamp)) && isFinite(newTimestamp)) {
      dob = new Date(dob);
      return new Number((new Date().getTime() - dob.getTime()) / 31536000000).toFixed(0);
    }
    return false;
  }
}