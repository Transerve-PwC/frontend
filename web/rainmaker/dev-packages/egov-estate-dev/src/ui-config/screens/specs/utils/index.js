import {
  getLabel,
  getTextField,
  getCommonSubHeader, getCommonHeader, getCommonContainer
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
  getSearchApplicationsResults, getSearchResults
} from "../../../../ui-utils/commons";
import moment from "moment";
import { ESTATE_PROPERTY_MASTER_BILLING_BUSINESS_SERVICE } from "../../../../ui-constants";

export const getCommonApplyHeader = ({label, number}) => {
  return getCommonContainer({
    header: getCommonHeader({
      labelName: label,
    labelKey: label
    }),
    applicationNumber : {
      uiFramework: "custom-atoms-local",
      moduleName: "egov-estate",
      componentPath: "ApplicationNoContainer",
      props: {
        number
      },
      visible: !!number
    }
  })
}

export const getRentSummaryCard = props => {
  const {
    sourceJsonPath,
    ...rest
  } = props;
  return {
    uiFramework: "custom-containers-local",
    moduleName: "egov-estate",
    componentPath: "RentSummaryCardContainer",
    props: {
      sourceJsonPath,
      ...rest
    }
  };
};

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

export const getAsteric = () => {
  return {
    uiFramework: "custom-atoms-local",
    moduleName: "egov-tradelicence",
    componentPath: "Asteric"
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
    moduleName: "egov-estate",
    componentPath: "EstimateCardContainer",
    props: {
      sourceJsonPath,
      ...rest
    }
  };
};

export const getButtonVisibility = (status, button) => {
  if (status === "ES_PENDING_PAYMENT" && button === "PENDINGPAYMENT") return true;
  if (status === "ES_PENDING_JE_VERIFICATION" && button === "NOCVERIFICATION") return true;
  if (status === "ES_MM_PENDING_BI_VERIFICATION" && button === "SITEREPORT") return true;
  if ((status === "ES_PENDING_CITIZEN_TEMPLATE_SUBMISSION" || status === "ES_PENDING_CITIZEN_NOTICE_DOCUMENTS") && button === "UPLOAD_DOCUMENT") return true
  return false;
};

export const commonTransform = (object, path) => {
  let data = get(object, path);
  let transformedData = {};
  data.map(a => {
    const splitList = a.code.split(".");
    let ipath = "";
    for (let i = 0; i < splitList.length; i += 1) {
      if (i != splitList.length - 1) {
        if (
          !(
            splitList[i] in
            (ipath === "" ? transformedData : get(transformedData, ipath))
          )
        ) {
          set(
            transformedData,
            ipath === "" ? splitList[i] : ipath + "." + splitList[i],
            i < splitList.length - 2 ? {} : []
          );
        }
      } else {
        get(transformedData, ipath).push(a);
      }
      ipath = splitList.slice(0, i + 1).join(".");
    }
  });
  set(object, path, transformedData);
  return object;
};

export const objectToDropdown = object => {
  let dropDown = [];
  for (var variable in object) {
    if (object.hasOwnProperty(variable)) {
      dropDown.push({
        code: variable
      });
    }
  }
  return dropDown;
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
  if (dateEpoch) {
    const dateFromApi = new Date(dateEpoch);
    let month = dateFromApi.getMonth() + 1;
    let day = dateFromApi.getDate();
    let year = dateFromApi.getFullYear();
    month = (month > 9 ? "" : "0") + month;
    day = (day > 9 ? "" : "0") + day;
    return `${day}/${month}/${year}`;
  }
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

export const downloadSummary = (Properties, PropertiesTemp ,mode = "download") => {

  const isGroundRent = Properties[0].propertyDetails.paymentConfig.isGroundRent
  let queryStr = [{
    key: "key",
    value: `property-summary`
  },
  {
    key: "tenantId",
    value: `${getTenantId().split('.')[0]}`
  }
]

let PropertiesTempOwners = PropertiesTemp[0].propertyDetails.owners;
const modifiedOwner = PropertiesTempOwners.map((owner) => {
  let ownerDocuments = owner.ownerDetails.reviewDocData
  const plength = ownerDocuments.length % 4
  ownerDocuments = !!plength ? [...ownerDocuments, ...new Array(4 - plength).fill({
    title: "",
    name: ""
  })] : ownerDocuments
  const myODocuments = ownerDocuments.map((item) => ({
    ...item,
    title: getLocaleLabels(item.title, item.title)
  })).reduce((splits, i) => {
    const length = splits.length
    const rest = splits.slice(0, length - 1);
    const lastArray = splits[length - 1] || [];
    return lastArray.length < 4 ? [...rest, [...lastArray, i]] : [...splits, [i]]
  }, []);
  owner.ownerDetails.ownerDocuments = myODocuments;
  return owner;
})

  let Property = Properties[0];
  if(Property.propertyDetails.owners.length > 0){
    let propertyOwners = Property.propertyDetails.owners;
    const owners = propertyOwners.map((owner , index) => {
       owner.ownerDetails.ownerDocuments = modifiedOwner[index].ownerDetails.ownerDocuments
       owner.ownerDetails.guardianRelation = getLocaleLabels(owner.ownerDetails.guardianRelation, owner.ownerDetails.guardianRelation)
       return owner
    })

  }

let previousOwners = PropertiesTemp[0].propertyDetails.purchaser;
const modifedPurchaser = previousOwners.map((previousOwn) => {
  let previousOwnerDocuments = previousOwn.ownerDetails.reviewDocDataPrevOwner
  const plength = previousOwnerDocuments.length % 4
  previousOwnerDocuments = !!plength ? [...previousOwnerDocuments, ...new Array(4 - plength).fill({
    title: "",
    name: ""
  })] : previousOwnerDocuments
  const myPDocuments = previousOwnerDocuments.map((item) => ({
    ...item,
    title: getLocaleLabels(item.title, item.title)
  })).reduce((splits, i) => {
    const length = splits.length
    const rest = splits.slice(0, length - 1);
    const lastArray = splits[length - 1] || [];
    return lastArray.length < 4 ? [...rest, [...lastArray, i]] : [...splits, [i]]
  }, []);
  previousOwn.ownerDetails.ownerDocuments = myPDocuments;
  return previousOwn;
})

if(Property.propertyDetails.purchaser.length > 0){
  let purchasers = Property.propertyDetails.purchaser;
  const purchaser = purchasers.map((purchaser , index) => {
     purchaser.ownerDetails.ownerDocuments = modifedPurchaser[index].ownerDetails.ownerDocuments
     purchaser.ownerDetails.guardianRelation = getLocaleLabels(purchaser.ownerDetails.guardianRelation, purchaser.ownerDetails.guardianRelation)
     purchaser.ownerDetails.dob = moment(new Date(purchaser.ownerDetails.dob)).format("DD-MMM-YYYY")
     return purchaser
  })
}

if(isGroundRent){
  Property.propertyDetails["groundRentDetails"] = {
    "groundRentGenerationType" : Property.propertyDetails.paymentConfig.groundRentGenerationType,
    "groundRentGenerateDemand" : Property.propertyDetails.paymentConfig.groundRentGenerateDemand,
    "groundRentBillStartDate"  : Property.propertyDetails.paymentConfig.groundRentBillStartDate
  }
}else{
  Property.propertyDetails["licenceDetails"] = {
    "groundRentGenerationType" : Property.propertyDetails.paymentConfig.groundRentGenerationType,
    "groundRentGenerateDemand" : Property.propertyDetails.paymentConfig.groundRentGenerateDemand,
    "groundRentBillStartDate"  : Property.propertyDetails.paymentConfig.groundRentBillStartDate
  }
}

  const DOWNLOADRECEIPT = {
    GET: {
      URL: "/pdf-service/v1/_create",
      ACTION: "_get",
    },
  };
  try {
    httpRequest("post", DOWNLOADRECEIPT.GET.URL, DOWNLOADRECEIPT.GET.ACTION, queryStr, {
      Properties: [Property]
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

export const downloadBuildingBranchPMPdf = (Properties, PropertiesTemp ,mode = "download") => {
  let queryStr = [{
    key: "key",
    value: `bb-property-summary`
  },
  {
    key: "tenantId",
    value: `${getTenantId().split('.')[0]}`
  }
]

let PropertiesTempOwners = PropertiesTemp[0].propertyDetails.owners;
const modifiedOwner = PropertiesTempOwners.map((owner) => {
  let ownerDocuments = owner.ownerDetails.reviewDocData
  const plength = ownerDocuments.length % 4
  ownerDocuments = !!plength ? [...ownerDocuments, ...new Array(4 - plength).fill({
    title: "",
    name: ""
  })] : ownerDocuments
  const myODocuments = ownerDocuments.map((item) => ({
    ...item,
    title: getLocaleLabels(item.title, item.title)
  })).reduce((splits, i) => {
    const length = splits.length
    const rest = splits.slice(0, length - 1);
    const lastArray = splits[length - 1] || [];
    return lastArray.length < 4 ? [...rest, [...lastArray, i]] : [...splits, [i]]
  }, []);
  owner.ownerDetails.ownerDocuments = myODocuments;
  return owner;
})

  let Property = Properties[0];
  if(Property.propertyDetails.owners.length > 0){
    let propertyOwners = Property.propertyDetails.owners;
     propertyOwners.map((owner , index) => {
       owner.ownerDetails.ownerDocuments = modifiedOwner[index].ownerDetails.ownerDocuments
       owner.ownerDetails.guardianRelation = getLocaleLabels(owner.ownerDetails.guardianRelation, owner.ownerDetails.guardianRelation)
       owner.ownerDetails.possesionDate = moment(new Date(owner.ownerDetails.possesionDate)).format('DD-MMM-YYYY')
       return owner
    })

  }

  const DOWNLOADRECEIPT = {
    GET: {
      URL: "/pdf-service/v1/_create",
      ACTION: "_get",
    },
  };
  try {
    httpRequest("post", DOWNLOADRECEIPT.GET.URL, DOWNLOADRECEIPT.GET.ACTION, queryStr, {
      Properties: [Property]
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


export const downloadAcknowledgementForm = (Applications, applicationType,feeEstimate,state, mode = "download") => {
  let queryStr = []
  switch (applicationType) {
    case 'SaleDeed':
        queryStr = [{
          key: "key",
          value: (state == "ES_PENDING_PAYMENT" || state == "ES_PENDING_DA_PREPARE_LETTER" ||
          state == "ES_PENDING_SO_APPROVAL" || state == "ES_APPROVED")  ? `est-sale-deed-application-fresh-paid` : `est-sale-deed-application-fresh`
        }
      ]
      break;
    case 'LeaseDeed':
      queryStr = [{
        key: "key",
        value: (state == "ES_PENDING_PAYMENT" || state == "ES_PENDING_DA_PREPARE_LETTER" ||
        state == "ES_PENDING_SO_APPROVAL" || state == "ES_APPROVED")  ? `est-lease-deed-application-paid` : `est-lease-deed-application`
      }
    ]
      break;
    case 'ResidentailToCommercial':
    case 'ScfToSco':
        queryStr = [{
          key: "key",
          value: (state == "ES_PENDING_PAYMENT" || state == "ES_PENDING_DA_PREPARE_LETTER" ||
          state == "ES_PENDING_SO_APPROVAL" || state == "ES_APPROVED")  ? `est-scf-to-sco-application-paid` : `est-scf-to-sco-application`
        }
      ]
      break;
    case 'LeaseholdToFreehold':
        queryStr = [{
          key: "key",
          value: (state == "ES_PENDING_PAYMENT" || state == "ES_PENDING_DA_PREPARE_LETTER" ||
          state == "ES_PENDING_SO_APPROVAL" || state == "ES_PENDING_CITIZEN_NOTICE_DOCUMENTS" || state == "ES_PENDING_DS_NOTICE_VERIFICATION" || state == "ES_PENDING_NOTICE_CLARIFICATION" ||
          state == "ES_PENDING_DA_NOTICE_VERIFICATION" || state == "ES_PENDING_SRA_NOTICE_VERIFICATION" || state == "ES_PENDING_SO_NOTICE_VERIFICATION" || state == "ES_APPROVED")  ? `est-leaseholdToFreehold-Application-paid` : `est-leaseholdToFreehold-Application`
        }
      ]
      break;
    case 'ChangeInTrade':
        queryStr = [{
          key: "key",
          value: (state == "ES_PENDING_PAYMENT" || state == "ES_PENDING_DA_PREPARE_LETTER" ||
          state == "ES_PENDING_SO_APPROVAL" || state == "ES_APPROVED")  ? `est-change-trade-application-paid` : `est-change-trade-application`
        }
      ]
      break;
    case 'UnRegisteredWill':
        queryStr = [{
          key: "key",
          value: (state == "ES_PENDING_PAYMENT" || state == "ES_PENDING_DA_PREPARE_LETTER" ||
          state == "ES_PENDING_SO_APPROVAL" || state == "ES_APPROVED")  ? `est-unregisteredWill-application-fresh-paid` : `est-unregisteredWill-application-fresh`
        }
      ]
      break;
      case 'NOC':
          queryStr = [{
            key: "key",
            value: (state == "ES_PENDING_PAYMENT" || state == "ES_PENDING_DA_PREPARE_LETTER" ||
            state == "ES_PENDING_SO_APPROVAL" || state == "ES_APPROVED")  ? `est-noc-application-fresh-paid` : `est-noc-application-fresh`
          }
        ]
      break;
      case 'RegisteredWill':
      queryStr = [{
        key: "key",
        value: (state == "ES_PENDING_PAYMENT" || state == "ES_PENDING_DA_PREPARE_LETTER" ||
        state == "ES_PENDING_SO_APPROVAL" || state == "ES_APPROVED")  ? `est-registeredWill-application-fresh-paid` : `est-registeredWill-application-fresh`
      }
    ]
      break;
      case 'NDC':
      queryStr = [{
        key: "key",
        value: (state == "ES_PENDING_PAYMENT" || state == "ES_PENDING_DA_PREPARE_LETTER" ||
        state == "ES_PENDING_SO_APPROVAL" || state == "ES_APPROVED")  ? `est-ndc-application-fresh-paid` : `est-ndc-application-fresh`
      }
    ]
      break;
      case 'PatnershipDeed':
      queryStr = [{
            key: "key",
            value: (state == "ES_PENDING_PAYMENT" || state == "ES_PENDING_DA_PREPARE_LETTER" ||
            state == "ES_PENDING_SO_APPROVAL" || state == "ES_APPROVED")  ? `est-partnership-deed-application-fresh-paid` : `est-partnership-deed-application-fresh`
          }
        ]
      break;
      case 'DuplicateCopy':
          queryStr = [{
            key: "key",
            value: (state == "ES_PENDING_PAYMENT" || state == "ES_PENDING_DA_PREPARE_LETTER" ||
            state == "ES_PENDING_SO_APPROVAL" || state == "ES_APPROVED")  ? `est-duplicate-copy-application-fresh-paid` : `est-duplicate-copy-application-fresh`
          }
        ]
      break;
      case 'Mortgage':
          queryStr = [{
            key: "key",
            value: (state == "ES_PENDING_PAYMENT" || state == "ES_PENDING_DA_PREPARE_LETTER" ||
            state == "ES_PENDING_SO_APPROVAL" || state == "ES_APPROVED")  ? `est-mortgage-application-fresh-paid` : `est-mortgage-application-fresh`
          }
        ]
      break;
      case 'FamilySettlement':
          queryStr = [{
            key: "key",
            value: (state == "ES_PENDING_PAYMENT" || state == "ES_PENDING_DA_PREPARE_LETTER" ||
            state == "ES_PENDING_SO_APPROVAL" || state == "ES_APPROVED")  ? `est-court-decree-family-settlement-application-paid` : `est-court-decree-family-settlement-application`
          }
        ]  

      break;
      case 'IntestateDeath':
      queryStr = [{
        key: "key",
        value: (state == "ES_PENDING_PAYMENT" || state == "ES_PENDING_DA_PREPARE_LETTER" ||
        state == "ES_PENDING_SO_APPROVAL" || state == "ES_APPROVED")  ? `est-inestate-death-application-fresh-paid` : `est-inestate-death-application-fresh`
      }
    ]
      break;
      case 'IssuanceOfNotice':
        queryStr = [{
          key :"key",
          value:"issuance-of-notice-application"
        }]
        break;
      case 'BB-NOC':
          queryStr = [{
            key: "key",
            value: (state == "ES_PENDING_PAYMENT" || state == "ES_PENDING_DA_PREPARE_LETTER" ||
            state == "ES_PENDING_SDE_APPROVAL" || state == "ES_APPROVED")  ? `bb-noc-application-paid` : `bb-noc-application-fresh`
          }]
          break;
      case 'BB-IssuanceOfNotice':
          queryStr = [{
            key:"key",
            value:"bb-IssuanceOfNotice-application"
          }] 
          break; 
  }
  queryStr[1] = {
    key: "tenantId",
    value: `${getTenantId().split('.')[0]}`
  }
  
  let {
    documents
  } = Applications[0].additionalDetails;
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
  let Application = Applications[0];
  Application = {
    ...Application,
    applicationDocuments: myDocuments
   
  }
  const DOWNLOADRECEIPT = {
    GET: {
      URL: "/pdf-service/v1/_create",
      ACTION: "_get",
    },
  };
  try {
    httpRequest("post", DOWNLOADRECEIPT.GET.URL, DOWNLOADRECEIPT.GET.ACTION, queryStr, {
        Applications: [Application] ,feeEstimate
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

export const downloadCertificateForm = (Licenses, data, mode = 'download') => {
  const applicationType = Licenses && Licenses.length > 0 ? get(Licenses[0], "applicationType") : "NEW";
  const queryStr = [{
      key: "key",
      value: applicationType === "RENEWAL" ? "tlrenewalcertificate" : "tlcertificate"
    },
    {
      key: "tenantId",
      value: "ch"
    }
  ]
  let {
    documents
  } = Licenses[0].additionalDetails;
  const findIndex = documents && documents.findIndex(item => item.title === "TL_OWNERPHOTO");
  const ownerDocument = findIndex !== -1 ? documents[findIndex] : {
    link: `${process.env.REACT_APP_MEDIA_BASE_URL}/silhoutte-bust.png`
  };
  let licenses = Licenses[0];
  licenses = {
    ...licenses,
    ownerDocument
  }
  const DOWNLOADRECEIPT = {
    GET: {
      URL: "/pdf-service/v1/_create",
      ACTION: "_get",
    },
  };
  try {
    httpRequest("post", DOWNLOADRECEIPT.GET.URL, DOWNLOADRECEIPT.GET.ACTION, queryStr, {
        Licenses: [licenses],
        data
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

export const downloadPaymentReceipt = (receiptQueryString, payload, data , generatedBy,type, state,mode = "download") => {
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
      let queryStr = [
      ]
      
      if (payloadReceiptDetails && payloadReceiptDetails.Payments && payloadReceiptDetails.Payments.length == 0) {
        console.log("Could not find any receipts");
        return;
      }
      let {
        Payments
      } = payloadReceiptDetails;
      let time = Payments[0].paymentDetails[0].auditDetails.lastModifiedTime
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

      switch(type){
        case 'rent-payment':
           if(process.env.REACT_APP_NAME != "Citizen"){
            const {payment} = state.screenConfiguration.preparedFinalObject
            const {paymentType} = payment
             switch(paymentType){
              case 'PAYMENTTYPE.EXTENSIONFEE':
                 const {ExtensionStatementSummary} = state.screenConfiguration.preparedFinalObject
                 queryStr = [{
                   key: "key",
                   value: "extension-fee-payment-receipt"
                 },
                 {
                   key: "tenantId",
                   value: receiptQueryString[1].value.split('.')[0]
                 }
               ]
                payload[0]["ExtensionFeeStatementSummary"] = ExtensionStatementSummary
                
                break;
              case 'PAYMENTTYPE.PENALTY':
                 const {PenaltyStatementSummary} = state.screenConfiguration.preparedFinalObject
                 queryStr = [{
                   key: "key",
                   value: "penalty-payment-receipt"
                 },
                 {
                   key: "tenantId",
                   value: receiptQueryString[1].value.split('.')[0]
                 }
               ]
               payload[0]["PenaltyStatementSummary"] = PenaltyStatementSummary
                break; 
              case 'PAYMENTTYPE.SECURITYFEE':
                  const {SecurityStatementSummary} = state.screenConfiguration.preparedFinalObject
                  queryStr = [{
                    key: "key",
                    value: "security-payment-receipt"
                  },
                  {
                    key: "tenantId",
                    value: receiptQueryString[1].value.split('.')[0]
                  }
                ]
                payload[0]["SecurityDepositStatementSummary"] = SecurityStatementSummary
                break;   
              default:
                 queryStr = [{
                   key: "key",
                   value: "rent-payment-receipt"
                 },
                 {
                   key: "tenantId",
                   value: receiptQueryString[1].value.split('.')[0]
                 }
               ]
            }
           }else{
              queryStr = [{
                key: "key",
                value: "rent-payment-receipt"
                },
                {
                key: "tenantId",
                value: receiptQueryString[1].value.split('.')[0]
                }
              ]
           }
           
            if(process.env.REACT_APP_NAME === "Citizen"){
              payload[0].propertyDetails["offlinePaymentDetails"] = []
            
              let transactionNumber = {
                "transactionNumber" : Payments[0].transactionNumber
              }
              payload[0].propertyDetails.offlinePaymentDetails.push(transactionNumber)
             }
              if(process.env.REACT_APP_NAME === "Employee"){
                Payments = [
                  {
                    ...Payments[0],transactionDate : payload[0].propertyDetails.offlinePaymentDetails[0].dateOfPayment
                  }
                ]
                }
            
            httpRequest("post", DOWNLOADRECEIPT.GET.URL, DOWNLOADRECEIPT.GET.ACTION, queryStr, {
              Payments,
              Properties : payload,
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
          break
        case 'application-payment':
            let {
              billAccountDetails
            } = Payments[0].paymentDetails[0].bill.billDetails[0];
            billAccountDetails = billAccountDetails.map(({
              taxHeadCode,
              ...rest
            }) => ({
              ...rest,
              taxHeadCode: taxHeadCode.includes("_APPLICATION_FEE") ? "ES_FEE" : taxHeadCode.includes("_APPLICATION_TAX") ? "ES_TAX" : taxHeadCode
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
           queryStr = [{
              key: "key",
              value: "application-payment-receipt"
            },
            {
              key: "tenantId",
              value: receiptQueryString[1].value.split('.')[0]
            }
          ]
            httpRequest("post", DOWNLOADRECEIPT.GET.URL, DOWNLOADRECEIPT.GET.ACTION, queryStr, {
              Payments,
              Applications :payload,
              feeEstimate:data,
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
          break;  
      }
      
    })
  } catch (exception) {
    alert('Some Error Occured while downloading Receipt!');
  }
}

export const downloadAmountLetter = (Applications, applicationType, mode = 'download') => {

  let queryStr = []
    switch (applicationType) {
      case 'LeaseholdToFreehold':
        queryStr = [{
            key: "key",
            value: `est-amount-letter-after-conversion`
          }
        ]
        break;
     
    }
    queryStr[1] = {
      key: "tenantId",
      value: `${getTenantId().split('.')[0]}`
    }
  
    let {
      documents
    } = Applications[0].additionalDetails;
   
    let Application = Applications[0];
    Application = {
      ...Application,
      documents
    }
    const DOWNLOADRECEIPT = {
      GET: {
        URL: "/pdf-service/v1/_create",
        ACTION: "_get",
      },
    };
    try {
      httpRequest("post", DOWNLOADRECEIPT.GET.URL, DOWNLOADRECEIPT.GET.ACTION, queryStr, {
        Applications: [Application]
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

export const downloadHousingBoardLetter = (Applications, applicationType, mode = 'download') => {

  let queryStr = []
    switch (applicationType) {
      case 'LeaseholdToFreehold':
        queryStr = [{
            key: "key",
            value: `est-housing-board-letter`
          }
        ]
        break;
     
    }
    queryStr[1] = {
      key: "tenantId",
      value: `${getTenantId().split('.')[0]}`
    }
  
    let {
      documents
    } = Applications[0].additionalDetails;
   
    let Application = Applications[0];
    Application = {
      ...Application,
      documents
    }
    const DOWNLOADRECEIPT = {
      GET: {
        URL: "/pdf-service/v1/_create",
        ACTION: "_get",
      },
    };
    try {
      httpRequest("post", DOWNLOADRECEIPT.GET.URL, DOWNLOADRECEIPT.GET.ACTION, queryStr, {
        Applications: [Application]
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


export const downloadLetter = (Applications, applicationType, mode = 'download') => {

let queryStr = []
  switch (applicationType) {
    case 'SaleDeed':
      queryStr = [{
          key: "key",
          value: `est-ot-sale-gift-family-deed`
        }
      ]
      break;
    case 'LeaseDeed':
    case 'LeaseholdToFreehold':
      queryStr = [{
          key: "key",
          value: `est-ot-lease-deed-system-letter`
        }
      ]
      break;
    case 'ScfToSco':
      queryStr = [{
          key: "key",
          value: `est-scf-sco-letter`
        }
      ]
      break;
    
      case 'NOC':
      queryStr = [{
          key: "key",
          value: `est-noc-letter`
        }
      ]
      break;
      case 'UnRegisteredWill':
      case 'RegisteredWill':
      queryStr = [{
          key: "key",
          value: `est-ot-unregistered-will-final-letter`
        }
      ]
      break;
      case 'NDC':
      queryStr = [{
          key: "key",
          value: `est-ndc-general-reason-letter`
        }
        
      ]
      break;

      case 'PatnershipDeed':  
          queryStr = [{
            key: "key",
            value: `private-limited-company`
          }
          
        ]
    break;
    
      case 'Mortgage':
        let mortgageType = Applications[0].applicationDetails.mortgageType;
        if(mortgageType == 'PERMISSION_TO_MORTAGAGE.LEASEHOLD'){
          queryStr = [{
            key: "key",
            value: `est-mortgage-leasehold`
          }
        ]
        }else{
          queryStr = [{
            key: "key",
            value: `est-mortgage-freehold`
          }
        ]
        }
    
      break;
      case 'FamilySettlement':
      queryStr = [{
          key: "key",
          value: `est-ot-family-settlement`
        }
      ]
      break;
      case 'IntestateDeath':
      queryStr = [{
          key: "key",
          value: `est-ot-final-letter`
        }
      ]
      break;

      case 'BB-NOC':
          queryStr = [{
            key: "key",
            value: `building-branch-final-letter`
          }
        ]

      break;  

      case 'BB-NOC-Proposal-letter':
          queryStr = [{
            key: "key",
            value: `noc-proposal-letter`
          }
        ]
      break;
      
      case 'BB-NOC-Payment-letter':
      queryStr = [{
        key: "key",
        value: `payment-letter`
      }
      ]
      break;
         
      
  }
  queryStr[1] = {
    key: "tenantId",
    value: `${getTenantId().split('.')[0]}`
  }

  let {
    documents
  } = Applications[0].additionalDetails;
 
  let Application = Applications[0];
  Application = {
    ...Application,
    documents
  }
  const DOWNLOADRECEIPT = {
    GET: {
      URL: "/pdf-service/v1/_create",
      ACTION: "_get",
    },
  };
  try {
    httpRequest("post", DOWNLOADRECEIPT.GET.URL, DOWNLOADRECEIPT.GET.ACTION, queryStr, {
      Applications: [Application]
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
export const downloadEmailNotice = (Applications, applicationType, mode = 'download') => {

  let queryStr = []
    switch (applicationType) {
      case 'RegisteredWill':
      case 'IntestateDeath':
      case 'UnRegisteredWill':    
        queryStr = [{
            key: "key",
            value: `est-ot-email-body`
          }
        ]
      break;
  
    }
    queryStr[1] = {
      key: "tenantId",
      value: `${getTenantId().split('.')[0]}`
    }
  
    let {
      documents
    } = Applications[0].additionalDetails;
   
    let Application = Applications[0];
    Application = {
      ...Application,
      documents
    }
    const DOWNLOADRECEIPT = {
      GET: {
        URL: "/pdf-service/v1/_create",
        ACTION: "_get",
      },
    };
    try {
      httpRequest("post", DOWNLOADRECEIPT.GET.URL, DOWNLOADRECEIPT.GET.ACTION, queryStr, {
        Applications: [Application]
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


export const downloadNotice = (Applications, applicationType,noticeType, mode = 'download') => {
  let queryStr = []
  switch (applicationType) {
    
    case 'LeaseholdToFreehold':
      queryStr = [{
          key: "key",
          value: `est-leasehold-freehold-conversion-notice`
        }
      ]
      break;
    
    case 'UnRegisteredWill':
      queryStr = [{
          key: "key",
          value: `ot-unregistered-will-notice`
        }
      ]
      break;
      
      case 'RegisteredWill':
      queryStr = [{
          key: "key",
          value: `ot-registered-will-notice`
        }
      ]
      break;
      
      case 'IntestateDeath':
      queryStr = [{
          key: "key",
          value: `est-ot-inestate-death-notice`
        }
      ]
      break;

      case 'NDC':
        queryStr = [{
            key: "key",
            value: `est-ndc-who`
          }
        ]
        break;
      case 'IssuanceOfNotice':
        switch(noticeType){
          case 'order':
              queryStr = [
                {
                  key:"key",
                  value:"est-cause-violation-order"
                }
              ]
          break;    
          case 'cancellation order':
              queryStr = [
                {
                  key:"key",
                  value:"est-show-cause-cancellation-sealing-order"
                }
              ]
          break;    
          case 'non payment notice':
              queryStr = [
                {
                  key:"key",
                  value:"est-show-cause-non-payment-notice"
                }
              ]
          break;     
          case 'non payment order':
              queryStr = [
                {
                  key:"key",
                  value:"est-show-cause-non-payment-order"
                }
              ]
          break;    
          case 'occupation certificate':
              queryStr = [
                {
                  key:"key",
                  value:"est-show-cause-occupation-certificate-notice"
                }
              ]
          break; 
          
          default:
              queryStr = [
                {
                  key:"key",
                  value:"est-cause-violation-notice"
                }
              ]
        }
        break; 
     
     case "BB-IssuanceOfNotice":
          queryStr = [
            {
              key:"key",
              value:"bb-violation-notice"              
            }
          ]
        break;
     default:
        queryStr = [
          {
            key:"key",
            value:""
          }
        ]

  }
    queryStr[1] = {
      key: "tenantId",
      value: `${getTenantId().split('.')[0]}`
    }
  
    let {
      documents
    } = Applications[0].additionalDetails;
   
    let Application = Applications[0];
    Application = {
      ...Application,
      documents
    }
    const DOWNLOADRECEIPT = {
      GET: {
        URL: "/pdf-service/v1/_create",
        ACTION: "_get",
      },
    };
    try {
      httpRequest("post", DOWNLOADRECEIPT.GET.URL, DOWNLOADRECEIPT.GET.ACTION, queryStr, {
        Applications: [Application]
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







export const prepareDocumentTypeObj = (documents, ownerIndex) => {
  let documentsArr =
    documents.length > 0 ?
    documents.reduce((documentsArr, item, ind) => {
      documentsArr.push({
        name: item.code,
        required: item.required,
        jsonPath: `Properties[0].propertyDetails.owners[${ownerIndex}].ownerDetails.ownerDocuments[${ind}]`,
        statement: item.description
      });
      return documentsArr;
    }, []) :
    [];
  return documentsArr;
};

export const prepareDocumentTypeObjMaster = (documents, ownerIndex) => {
  let documentsArr =
    documents.length > 0 ?
    documents.reduce((documentsArr, item, ind) => {
      documentsArr.push({
        name: item.code,
        required: item.required,
        jsonPath: `Properties[0].propertyDetails.owners[${ownerIndex}].ownerDetails.ownerDocuments[${ind}]`,
        statement: item.description
      });
      return documentsArr;
    }, []) :
    [];
  return documentsArr;
};

export const preparePrevOwnerDocumentTypeObjMaster = (documents, prevOwnerIndex) => {
  let documentsArr =
    documents.length > 0 ?
    documents.reduce((documentsArr, item, ind) => {
      documentsArr.push({
        name: item.code,
        required: item.required,
        jsonPath: `Properties[0].propertyDetails.purchaser[${prevOwnerIndex}].ownerDetails.ownerDocuments[${ind}]`,
        statement: item.description
      });
      return documentsArr;
    }, []) :
    [];
  return documentsArr;
};

export const prepareBiddersDocumentTypeObjMaster = (documents) => {
  let documentsArr =
    documents.length > 0
      ? documents.reduce((documentsArr, item, ind) => {
        documentsArr.push({
          name: item.code,
          required: item.required,
          jsonPath: `bidders[0].documents[${ind}]`,
          statement: "BIDDERS_LIST_DESC"
        });
        return documentsArr;
      }, [])
      : [];
  return documentsArr;
};

export const prepareCompanyDocumentTypeObjMaster = (documents, partner) => {
  let documentsArr =
    documents.length > 0 ?
    documents.reduce((documentsArr, item, ind) => {
      documentsArr.push({
        name: item.code,
        required: item.required,
        jsonPath: `Properties[0].propertyDetails.partners[${partner}].partnerDetails.partnerDocuments[${ind}]`,
        statement: item.description
      });
      return documentsArr;
    }, []) :
    [];
  return documentsArr;
};

const getEstimateData = (ResponseData, isPaid) => {
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

const isApplicationPaid = (currentStatus, workflowCode) => {
  let isPAID = false;
  if (currentStatus === "ES_PENDING_PAYMENT") {
    return isPAID;
  }
  const businessServiceData = JSON.parse(localStorageGet("businessServiceData"));
  if (!isEmpty(businessServiceData)) {
    const tlBusinessService = JSON.parse(localStorageGet("businessServiceData")).filter(item => item.businessService === workflowCode)
    const states = tlBusinessService && tlBusinessService.length > 0 && tlBusinessService[0].states;
    for (var i = 0; i < states.length; i++) {
      if (states[i].applicationStatus === currentStatus) {
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
  applicationData,
  // jsonPath ,
  dispatch,
  href = {}
) => {
  const workflowCode = get(applicationData, "workFlowBusinessService")
  const applicationNo =
    get(applicationData, "applicationNumber") ||
    getQueryArg(href, "applicationNumber") || getQueryArg(href, "consumerCode");
  const tenantId =
    get(applicationData, "tenantId") || getQueryArg(href, "tenantId");
  const businessService = get(applicationData, "billingBusinessService", "") || getQueryArg(href, "businessService");
  const queryObj = [
    { key: "tenantId", value: tenantId },
    {
      key: "consumerCodes",
      value: applicationNo
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
  const currentStatus = applicationData.state;
  const isPAID = isApplicationPaid(currentStatus, workflowCode);
  const fetchBillResponse = await getBill(getBillQueryObj);
  const payload = isPAID ?
    await getReceipt(queryObj) :
    fetchBillResponse && fetchBillResponse.Bill && fetchBillResponse.Bill[0];
  let estimateData = payload ?
    isPAID ?
    payload &&
    payload.Payments &&
    payload.Payments.length > 0 &&
    getEstimateData(
      payload.Payments[0].paymentDetails[0].bill,
      isPAID
    ) :
    payload && getEstimateData(payload, false) :
    [];
  estimateData = estimateData || [];
  set(
    estimateData,
    "payStatus",
    isPAID
  );
  dispatch(prepareFinalObject("temp[0].estimateCardData", estimateData));
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
          !fields[variable].props.disabled) && !!fields[variable].jsonPath &&
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

export const fetchBill = async (action, state, dispatch) => {
  //For Adhoc
  // Search License
  const businessService = getQueryArg(window.location.href, "businessService");
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
  let payload;
  if(businessService === ESTATE_PROPERTY_MASTER_BILLING_BUSINESS_SERVICE) {
    const applicationNumber = getQueryArg(window.location.href, "consumerCode")
    let propertyPayload = get(state.screenConfiguration.preparedFinalObject, "Properties")
    if(applicationNumber.startsWith("SITE")) {
      const array = applicationNumber.split("-");
      array.splice(array.length-6)
      array.splice(0,1)
      const fileNumber = array.join("-");
      propertyPayload = await getSearchResults([{key: "fileNumber", value: fileNumber}])
    }
    payload =
      propertyPayload &&
      propertyPayload.Properties &&
      (await createEstimateData(
        propertyPayload.Properties[0],
        dispatch,
        window.location.href
      ));
  } else {
    const applicationPayload = await getSearchApplicationsResults(queryObject);
    //get bill and populate estimate card
    payload =
      applicationPayload &&
      applicationPayload.Applications &&
      (await createEstimateData(
        applicationPayload.Applications[0],
        dispatch,
        window.location.href
      ));
    //set in redux to be used for adhoc
    applicationPayload &&
      applicationPayload.Applications &&
      dispatch(prepareFinalObject("Applications[0]", applicationPayload.Applications[0]));
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

export const getUniqueItemsFromArray = (data, identifier) => {
  const uniqueArray = [];
  const map = new Map();
  for (const item of data) {
    if (!map.has(item[identifier])) {
      map.set(item[identifier], true); // set any value to Map
      uniqueArray.push(item);
    }
  }
  return uniqueArray;
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
        "ES_STATUS_LABEL",
        localisationLabels
      );
    case "Application Status": 
        return getLocaleLabels(
          "Application Status",
          "ES_APPLICATION_STATUS_LABEL",
          localisationLabels
        )
    case "File Number":
      return getLocaleLabels(
        "File Number",
        "ESTATE_COMMON_TABLE_COL_FILE_NO",
        localisationLabels
      );
    case "Sector Number":
      return getLocaleLabels(
        "Sector Number",
        "ESTATE_COMMON_TABLE_COL_SECTOR_NO",
        localisationLabels
      )
    case "Application Number":
      return getLocaleLabels(
        "Application Number",
        "ES_APPLICATION_NUMBER_LABEL",
        localisationLabels
      )
    case "Action":
      return getLocaleLabels(
        "Action",
        "ES_COMMON_TABLE_COL_ACTION",
        localisationLabels
      );
    case "File No":
      return getLocaleLabels(
        "File No",
        "ESTATE_COMMON_TABLE_COL_FILE_NO",
        localisationLabels
      );
    case "Property Id":
      return getLocaleLabels(
        "Property Id",
        "ES_COMMON_TABLE_COL_PROPERTY_ID",
        localisationLabels
      );
    case "House No":
      return getLocaleLabels(
        "House No",
        "ES_COMMON_TABLE_COL_HOUSE_NUMBER",
        localisationLabels
      );
    case "Site Number":
      return getLocaleLabels(
        "Site Number",
        "ES_SITE_NO_LABEL",
        localisationLabels
      );
    case "Owner Name":
      return getLocaleLabels(
        "Owner Name",
        "ES_COMMON_TABLE_COL_OWN_NAME",
        localisationLabels
      );
    case "Mobile No":
      return getLocaleLabels(
        "Mobile No",
        "ES_COMMON_TABLE_COL_MOBILE_NUMBER",
        localisationLabels
      );
    case "Search Results for Properties":
      return getLocaleLabels(
        "Search Results for Properties",
        "ES_SEARCH_RESULTS_TABLE_HEADING",
        localisationLabels
      );
      case "Date":
      return getLocaleLabels(
        "Date",
        "ES_COMMON_TABLE_COL_DATE",
        localisationLabels
      );
      case "Amount":
        return getLocaleLabels(
          "Amount",
          "ES_COMMON_TABLE_COL_AMOUNT",
          localisationLabels
        );
      case "Type(Payment)":
        return getLocaleLabels(
          "Type(Payment)",
          "ES_COMMON_TABLE_COL_PAYMENTTYPE",
          localisationLabels
        );
      case "Type(Rent)":
        return getLocaleLabels(
          "Type(Rent)",
          "ES_COMMON_TABLE_COL_RENTTYPE",
          localisationLabels
        );
      case "Principal Due":
        return getLocaleLabels(
          "Principal Due",
          "ES_COMMON_TABLE_COL_PRINCIPALDUE",
          localisationLabels
        );
      case "GST Due":
        return getLocaleLabels(
          "GST Due",
          "ES_COMMON_TABLE_COL_GSTDUE",
          localisationLabels
        );
      case "Interest Due":
        return getLocaleLabels(
          "Interest Due",
          "ES_COMMON_TABLE_COL_INTERESTDUE",
          localisationLabels
        );
      case "GST Penalty Due":
        return getLocaleLabels(
          "GST Penalty Due",
          "ES_COMMON_TABLE_COL_GSTPENALTYDUE",
          localisationLabels
        );
      case "Total Due":
        return getLocaleLabels(
          "Total Due",
          "ES_COMMON_TABLE_COL_TOTALDUE",
          localisationLabels
        );
      case "Account Balance":
        return getLocaleLabels(
          "Account Balance",
          "ES_COMMON_TABLE_COL_ACCOUNTBALANCE",
          localisationLabels
        );
      case "Receipt No.":
        return getLocaleLabels(
          "Receipt No.",
          "ES_COMMON_TABLE_RECEIPT_NO",
          localisationLabels
        );
        case "Consolidated Demand":
        return getLocaleLabels(
          "Consolidated Demand",
          "ES_COMMON_TABLE_CONSOLIDATED_DEMAND",
          localisationLabels
        );
    case "Last Modified On":
      return getLocaleLabels(
        "Last Modified On",
        "ES_LAST_MODIFIED_ON",
        localisationLabels
      );
    case "Auction Id":
      return getLocaleLabels(
        "Auction Id",
        "ES_AUCTION_ID",
        localisationLabels
      );
    case "Bidder Name":
      return getLocaleLabels(
        "Bidder Name",
        "ES_BIDDER_NAME",
        localisationLabels
      );
    case "Deposited EMD Amount":
      return getLocaleLabels(
        "Deposited EMD Amount",
        "ES_DEPOSITED_EMD_AMOUNT",
        localisationLabels
      );
    case "Deposit Date":
      return getLocaleLabels(
        "Deposit Date",
        "ES_DEPOSIT_DATE",
        localisationLabels
      );
    case "EMD Validity Date":
      return getLocaleLabels(
        "EMD Validity Date",
        "ES_EMD_VALIDITY_DATE",
        localisationLabels
      );
    case "Initiate Refund":
      return getLocaleLabels(
        "Initiate Refund",
        "ES_INITIATE_REFUND",
        localisationLabels
      );
    case "Refund Status":
      return getLocaleLabels(
        "Refund Status",
        "ES_REFUND_STATUS",
        localisationLabels
      );
    case "Rent amount":
      return getLocaleLabels(
        "Rent amount",
        "ES_RENT_AMOUNT_LABEL",
        localisationLabels
      );
    case "Start month":
      return getLocaleLabels(
        "Start month",
        "ES_START_MONTH_LABEL",
        localisationLabels
      );
    case "End month":
      return getLocaleLabels(
        "End month",
        "ES_END_MONTH_LABEL",
        localisationLabels
      );
    case "Till":
      return getLocaleLabels(
        "Till",
        "ES_TILL_LABEL_IN_YEARS",
        localisationLabels
      );
    case "Installment":
      return getLocaleLabels(
        "Installment",
        "ES_INSTALLMENT_LABEL",
        localisationLabels
      );
    case "Due date of installment":
      return getLocaleLabels(
        "Due Date for Installment",
        "ES_DUE_DATE_INSTALLMENT_LABEL",
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

export const _getPattern = (type) => {
  switch(type) {
    case "float": 
        return /^[+-]?\d+(\.\d+)?$/i;
    case "share":
      return /^[+-]?\d{1,5}(\.\d{1,2})?$/i;
    case "areaOfProperty":
      return /^[+-]?\d{1,15}(\.\d{1,2})?$/i;
    case "alphaNumeric":
      return /^[a-zA-Z0-9]{1,100}$/i;
    case "fileNumber":
      return /^[A-Za-z0-9_@./#&+-]{1,50}$/i;
    case "alphabet":
      return /^[a-zA-Z ]{1,150}$/i;
    case "address":
      return /^[^\$\"'<>?\\\\~`!@$%^()+={}\[\]*.:;“”‘’]{1,150}$/i
  }
}

export const displayDefaultErr = (componentJsonpath, dispatch, screenName) => {
  dispatch(
      handleField(
         screenName,
         componentJsonpath,
          "errorMessage",
          "ERR_DEFAULT_INPUT_FIELD_MSG"
      )
  )
  dispatch(
      handleField(
          screenName,
          componentJsonpath,
          "props.errorMessage",
          "ERR_DEFAULT_INPUT_FIELD_MSG"
      )
  )
}

export const displayCustomErr = (componentJsonpath, dispatch, errMsg, screenName) => {
  dispatch(
      handleField(
          screenName,
          componentJsonpath,
          "errorMessage",
          errMsg
      )
  )
  dispatch(
      handleField(
          screenName,
          componentJsonpath,
          "props.errorMessage",
          errMsg
      )
  )
}
