import { httpRequest } from "./api";
import {
  getTextToLocalMapping
} from "../ui-config/screens/specs/utils";
import {
  prepareFinalObject,
  toggleSnackbar,
  toggleSpinner
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import {
  getTranslatedLabel,
} from "../ui-config/screens/specs/utils";
import { handleScreenConfigurationFieldChange as handleField } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import store from "redux/store";
import get from "lodash/get";
import {
  getFileUrl,
  getFileUrlFromAPI
} from "egov-ui-framework/ui-utils/commons";
import { getTenantId, getUserInfo } from "egov-ui-kit/utils/localStorageUtils";
import { uploadFile } from "egov-ui-framework/ui-utils/api";
import commonConfig from "config/common.js";
import {RP_DEMAND_GENERATION_DATE, RP_PAYMENT_DATE, RP_ASSESSMENT_AMOUNT, RP_REALIZATION_AMOUNT, RP_RECEIPT_NO} from '../ui-constants'
import moment from "moment";
import { setApplicationNumberBox } from "./apply";

export const getPaymentGateways = async () => {
  try {
    const payload = await httpRequest(
      "post",
      "/pg-service/gateway/v1/_search",
      ""
    );
    return payload
  } catch (error) {
    store.dispatch(toggleSnackbar(true, {labelName: error.message, labelKey: error.message}, "error"))
  }
}

export const getLocaleLabelsforTL = (label, labelKey, localizationLabels) => {
  if (labelKey) {
    let translatedLabel = getTranslatedLabel(labelKey, localizationLabels);
    if (!translatedLabel || labelKey === translatedLabel) {
      return label;
    } else {
      return translatedLabel;
    }
  } else {
    return label;
  }
};

export const getSearchResults = async queryObject => {
  try {
    const response = await httpRequest(
      "post",
      "/rp-services/property/_search",
      "",
      queryObject
    );
    return response;
  } catch (error) {
    store.dispatch(
      toggleSnackbar(
        true,
        { labelName: error.message, labelKey: error.message },
        "error"
      )
    );
  }
};

export const getOwnershipSearchResults = async (queryObject = []) => {
  try {
    const userInfo = JSON.parse(getUserInfo())
    const tenantId = userInfo.permanentCity;
    queryObject = [...queryObject, 
      { key: "tenantId", value: tenantId || getTenantId() }
    ]
    const response = await httpRequest(
      "post",
      "/rp-services/ownership-transfer/_search",
      "",
      queryObject
    )
    return response
  } catch (error) {
    store.dispatch(
      toggleSnackbar(
        true,
        { labelName: error.message, labelKey: error.message },
        "error"
      )
    );
  }
}

export const getMortgageSearchResults = async (queryObject = []) => {
  try {
    const userInfo = JSON.parse(getUserInfo())
    const tenantId = userInfo.permanentCity;
    queryObject = [...queryObject, 
      { key: "tenantId", value: tenantId || getTenantId() }
    ]
    const response = await httpRequest(
      "post",
      "/rp-services/mortgage/_search",
      "",
      queryObject
    )
    return response
  } catch (error) {
    store.dispatch(
      toggleSnackbar(
        true,
        { labelName: error.message, labelKey: error.message },
        "error"
      )
    );
  }
}

export const getDuplicateCopySearchResults = async (queryObject = []) => {
  try {
    const userInfo = JSON.parse(getUserInfo())
    const tenantId = userInfo.permanentCity;
    queryObject = [...queryObject, 
      { key: "tenantId", value: tenantId || getTenantId() }
    ]
    const response = await httpRequest(
      "post",
      "/rp-services/duplicatecopy/_search",
      "",
      queryObject
    )
    return response
  } catch (error) {
    store.dispatch(
      toggleSnackbar(
        true,
        { labelName: error.message, labelKey: error.message },
        "error"
      )
    );
  }
}

export const getMdmsData = async (dispatch, body) => {
  let mdmsBody = {
    MdmsCriteria: {
      tenantId: commonConfig.tenantId,
      moduleDetails: body
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
    return payload;
  } catch (e) {
    console.log(e);
  }
};

export const prepareDocuments = (documents, jsonPath) => {
  let documentsArr =
    documents.length > 0
      ? documents.reduce((documentsArr, item, ind) => {
        documentsArr.push({
          name: item.code,
          required: item.required,
          jsonPath: `${jsonPath}[${ind}]`,
          statement: item.description
        });
        return documentsArr;
      }, [])
      : [];
  return documentsArr;
};

export const setDocumentData = async(action, state, dispatch, {documentCode, jsonPath, screenKey, screenPath, tempJsonPath}) => {
    const documentTypePayload = [{
        moduleName: "RentedProperties",
        masterDetails: [{name: "applications"}]
      }
    ]
    const documentRes = await getMdmsData(dispatch, documentTypePayload);
    const {RentedProperties} = !!documentRes && !!documentRes.MdmsRes ? documentRes.MdmsRes : {}
    const {applications = []} = RentedProperties || {}
    const findFreshLicenceItem = applications.find(item => item.code === documentCode)
    let masterDocuments = !!findFreshLicenceItem ? findFreshLicenceItem.documentList : [];
    const requiredDocs = masterDocuments.filter(item => !!item.required);
    const nonRequiredDocs = masterDocuments.filter(item => !item.required);
    masterDocuments = [...requiredDocs, ...nonRequiredDocs]
    const freshLicenceDocuments = masterDocuments.map(item => ({
    type: item.code,
    description: {
      labelName: "Only .jpg and .pdf files. 6MB max file size.",
      labelKey: item.fileType
    },
    formatProps :{
      accept : item.accept || "image/*, .pdf, .png, .jpeg",
    }, 
    maxFileSize: 6000,
    downloadUrl: item.downloadUrl,
    moduleName: "RentedProperties",
    statement: {
        labelName: "Allowed documents are Aadhar Card / Voter ID Card / Driving License",
        labelKey: item.description
    }
    }))
    const documentTypes = prepareDocuments(masterDocuments, jsonPath);
    let applicationDocs = get(
      state.screenConfiguration.preparedFinalObject,
      jsonPath,
      []
    ) || [];
    applicationDocs = applicationDocs.filter(item => !!item)
    let applicationDocsReArranged =
      applicationDocs &&
      applicationDocs.length &&
      documentTypes.map(item => {
        const index = applicationDocs.findIndex(
          i => i.documentType === item.name
        );
        return applicationDocs[index];
      }).filter(item => !!item)
    applicationDocsReArranged &&
      dispatch(
        prepareFinalObject(
          jsonPath,
          applicationDocsReArranged
        )
      );
    dispatch(
      handleField(
          screenKey,
          screenPath,
          "props.inputProps",
          freshLicenceDocuments
      )
  );
    dispatch(prepareFinalObject(tempJsonPath, documentTypes))
}

export const setDocsForEditFlow = async (state, dispatch, sourceJsonPath, destinationJsonPath) => {
  let applicationDocuments = get(
    state.screenConfiguration.preparedFinalObject,
    sourceJsonPath,
    []
  ) || []
  applicationDocuments = applicationDocuments.filter(item => !!item.active)
  let uploadedDocuments = {};
  let fileStoreIds =
    applicationDocuments &&
    applicationDocuments.map(item => item.fileStoreId).join(",");
  const fileUrlPayload =
    fileStoreIds && (await getFileUrlFromAPI(fileStoreIds));
  applicationDocuments &&
    applicationDocuments.forEach((item, index) => {
      uploadedDocuments[index] = [
        {
          fileName:
            (fileUrlPayload &&
              fileUrlPayload[item.fileStoreId] &&
              decodeURIComponent(
                getFileUrl(fileUrlPayload[item.fileStoreId])
                  .split("?")[0]
                  .split("/")
                  .pop()
                  .slice(13)
              )) ||
            `Document - ${index + 1}`,
          fileStoreId: item.fileStoreId,
          fileUrl: Object.values(fileUrlPayload)[index],
          documentType: item.documentType,
          tenantId: item.tenantId,
          id: item.id
        }
      ];
    });
  dispatch(
    prepareFinalObject(destinationJsonPath, uploadedDocuments)
  );
};

export const updatePFOforSearchResults = async (
  action,
  state,
  dispatch,
  transitNumber,
  relations
) => {

  let queryObject = [
    { key: "transitNumber", value: transitNumber },
    { key: "relations", value: relations}
  ];

  const payload = await getSearchResults(queryObject)

  if (payload && payload.Properties) {
    const properies = payload.Properties.reduce((prev, curr) => {
      let keys = Object.keys(curr);
      keys = keys.filter(key => !!curr[key]).reduce((acc, key) => {
        return {...acc, [key]: curr[key]}
      }, {})
      return [...prev, {
        ...keys
      }]
    }, [])
    dispatch(prepareFinalObject("Properties", properies));
  }
  setApplicationNumberBox(state, dispatch, transitNumber, "apply")
  setDocsForEditFlow(state, dispatch, "Properties[0].propertyDetails.applicationDocuments", "PropertiesTemp[0].uploadedDocsInRedux");
};

export const getImageUrlByFile = file => {
  return new Promise(resolve => {
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = e => {
      const fileurl = e.target.result;
      resolve(fileurl);
    };
  });
};

export const getFileSize = file => {
  const size = parseFloat(file.size / 1024).toFixed(2);
  return size;
};

export const isFileValid = (file, acceptedFiles) => {
  const mimeType = file["type"];
  return (
    (mimeType &&
      acceptedFiles &&
      acceptedFiles.indexOf(mimeType.split("/")[1]) > -1) ||
    false
  );
};


export const findItemInArrayOfObject = (arr, conditionCheckerFn) => {
  for (let i = 0; i < arr.length; i++) {
    if (conditionCheckerFn(arr[i])) {
      return arr[i];
    }
  }
};


const isValid = (file, acceptedFiles) => {
  const mimeType = file["type"];
  const mimes = mimeType.split("/");
  let acceptedTypes = acceptedFiles.split(",");
  acceptedTypes = acceptedTypes.reduce((prev, curr) => {
    const accepted = curr.split("/");
    prev = [...prev, {first: accepted[0], second: accepted[1]}]
    return prev
  }, [])
  if(acceptedFiles.includes(mimeType)) {
    return {valid: true}
  } else  {
   const findItem = acceptedTypes.find(item => item.first === mimes[0])
   if(!!findItem && findItem.second === "*") {
    return {valid: true}
   } else {
    return {  valid: false, 
              errorMessage: `Please upload the allowed type files only.`
            }
  }
}
}

export const handleFileUpload = (event, handleDocument, props, stopLoading) => {
  const S3_BUCKET = {
    endPoint: "filestore/v1/files"
  };
  let uploadDocument = true;
  const { maxFileSize, formatProps, moduleName } = props;
  const input = event.target;
  if (input.files && input.files.length > 0) {
    const files = input.files;
    Object.keys(files).forEach(async (key, index) => {
      const file = files[key];
      const {valid, errorMessage} = isValid(file, formatProps.accept)
      const isSizeValid = getFileSize(file) <= maxFileSize;
      if (!valid) {
        stopLoading()
        alert(errorMessage);
        uploadDocument = false;
      }
      if (!isSizeValid) {
        stopLoading()
        alert(`Maximum file size can be ${Math.round(maxFileSize / 1000)} MB`);
        uploadDocument = false;
      }
      if (uploadDocument) {
        try {
          if (file.type.match(/^image\//)) {
            const fileStoreId = await uploadFile(
              S3_BUCKET.endPoint,
              moduleName,
              file,
              getTenantId()
            );
            handleDocument(file, fileStoreId);
          } else {
            const fileStoreId = await uploadFile(
              S3_BUCKET.endPoint,
              moduleName,
              file,
              getTenantId()
            );
            handleDocument(file, fileStoreId);
          }
        } catch (error) {
          store.dispatch(
            toggleSnackbar(
              true,
              { labelName: error.message, labelKey: error.message },
              "error"
            )
          );
          stopLoading()
        }
      }
    });
  }
};

export const setXLSTableData = async({demands, payments, componentJsonPath, screenKey}) => {
  let data = demands.map(item => {
    const findItem = payments.find(payData => moment(new Date(payData.dateOfPayment)).format("MMM YYYY") === moment(new Date(item.generationDate)).format("MMM YYYY"));
    return !!findItem ? {...item, ...findItem} : {...item}
  })
  data = data.map(item => ({
    [RP_DEMAND_GENERATION_DATE]: !!item.generationDate && moment(new Date(item.generationDate)).format("DD MMM YYYY"),
    [RP_PAYMENT_DATE]: !!item.dateOfPayment && moment(new Date(item.dateOfPayment)).format("DD MMM YYYY"),
    [RP_ASSESSMENT_AMOUNT]: !!item.collectionPrincipal && item.collectionPrincipal.toFixed(2),
    [RP_REALIZATION_AMOUNT]: !!item.amountPaid && item.amountPaid.toFixed(2),
    [RP_RECEIPT_NO]: item.receiptNo
  }))

  const {totalAssessment, totalRealization} = data.reduce((prev, curr) => {
    prev = {
      totalAssessment: prev.totalAssessment + Number(curr[RP_ASSESSMENT_AMOUNT]),
      totalRealization: prev.totalRealization + Number(curr[RP_REALIZATION_AMOUNT])
    } 
    return prev
  }, {totalAssessment: 0, totalRealization: 0})

  data = [...data, {
    [RP_DEMAND_GENERATION_DATE]: getTextToLocalMapping("RP_TOTAL_AMOUNT"),
    [RP_PAYMENT_DATE]: "",
    [RP_ASSESSMENT_AMOUNT]: totalAssessment.toFixed(2),
    [RP_REALIZATION_AMOUNT]: totalRealization.toFixed(2),
    [RP_RECEIPT_NO]: ""
  }]
  if(data.length > 1) {
    store.dispatch(
      handleField(
          screenKey,
          componentJsonPath,
          "props.data",
          data
      )
    );
    store.dispatch(
      handleField(
          screenKey,
          componentJsonPath,
          "visible",
          true
      )
    );
  }
  store.dispatch(
    prepareFinalObject("Properties[0].demands", demands)
  )
  store.dispatch(
    prepareFinalObject("Properties[0].payments", payments)
  )
}

export const getXLSData = async (getUrl, componentJsonPath, screenKey, fileStoreId) => {
  const queryObject = [
    {key: "tenantId", value: getTenantId()},
    {key: "fileStoreId", value: fileStoreId}
  ]
  try {
    store.dispatch(toggleSpinner());
    const response = await httpRequest(
      "post",
      getUrl,
      "",
      queryObject
    )
    if(!!response) {
      let {demand, payment} = response;
      if(!!demand.length && !!payment.length) {
        setXLSTableData({demands: demand, payments: payment, componentJsonPath, screenKey})
      }
    }
    store.dispatch(toggleSpinner());
  } catch (error) {
    store.dispatch(
      toggleSnackbar(
        true,
        { labelName: error.message, labelKey: error.message },
        "error"
      )
    );
    store.dispatch(toggleSpinner());
  }
}
