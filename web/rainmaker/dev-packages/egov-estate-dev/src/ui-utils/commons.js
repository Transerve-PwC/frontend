import { httpRequest } from "./api";
import {
  toggleSnackbar,
  toggleSpinner
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import {
  getTranslatedLabel
} from "../ui-config/screens/specs/utils";
import store from "redux/store";
import { uploadFile } from "egov-ui-framework/ui-utils/api";
import commonConfig from "config/common.js";

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
      "/est-services/property-master/_search",
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

export const getSearchApplicationsResults = async queryObject => {
  try {
    const response = await httpRequest(
      "post",
      "/est-services/application/_search",
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

export const getFileSize = file => {
  const size = parseFloat(file.size / 1024).toFixed(2);
  return size;
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
              commonConfig.tenantId
            );
            handleDocument(file, fileStoreId);
          } else {
            const fileStoreId = await uploadFile(
              S3_BUCKET.endPoint,
              moduleName,
              file,
              commonConfig.tenantId
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

export const getExcelData = async (excelUrl, fileStoreId) => {
  const queryObject = [
    {key: "tenantId", value: "ch"},
    {key: "fileStoreId", value: fileStoreId}
  ]
  try {
    store.dispatch(toggleSpinner());
    const response = await httpRequest(
      "post",
      excelUrl,
      "",
      queryObject
    )
    if(!!response) {
      console.log(response);
      let response = {
        "ResponseInfo": {
        "apiId": "Rainmaker",
        "ver": ".01",
        "ts": null,
        "resMsgId": "uief87324",
        "msgId": "20170310130900|en_IN",
        "status": "successful"
        },
        "Auctions": [
        {
        "id": "3e6aaff5-02d8-47c2-9d16-bcadd7b9cb8c",
        "propertyId": "1",
        "tenantId": "Hello",
        "fileNumber": "File-1237",
        "auctionDescription": "Can be ignored ",
        "participatedBidders": "a",
        "depositedEMDAmount": 10000.0,
        "depositDate": 1599264000000,
        "emdValidityDate": null,
        "refundStatus": "",
        "auditDetails": {
        "createdBy": "2743bf22-6499-4029-bd26-79e5d0ce6427",
        "lastModifiedBy": "2743bf22-6499-4029-bd26-79e5d0ce6427",
        "createdTime": 1601298961101,
        "lastModifiedTime": 1601298961101
        }
        },
        {
        "id": "752890a0-3cce-4f3a-84aa-cb6f6ce3c2e7",
        "propertyId": "1",
        "tenantId": "Hello",
        "fileNumber": "File-1237",
        "auctionDescription": "",
        "participatedBidders": "b",
        "depositedEMDAmount": 10000.0,
        "depositDate": 1599264000000,
        "emdValidityDate": null,
        "refundStatus": "",
        "auditDetails": {
        "createdBy": "2743bf22-6499-4029-bd26-79e5d0ce6427",
        "lastModifiedBy": "2743bf22-6499-4029-bd26-79e5d0ce6427",
        "createdTime": 1601298961101,
        "lastModifiedTime": 1601298961101
        }
        },
        {
        "id": "3795ba93-28de-400d-b347-9a55061c405a",
        "propertyId": "1",
        "tenantId": "Hello",
        "fileNumber": "File-1237",
        "auctionDescription": "",
        "participatedBidders": "c",
        "depositedEMDAmount": 10000.0,
        "depositDate": 1599264000000,
        "emdValidityDate": null,
        "refundStatus": "",
        "auditDetails": {
        "createdBy": "2743bf22-6499-4029-bd26-79e5d0ce6427",
        "lastModifiedBy": "2743bf22-6499-4029-bd26-79e5d0ce6427",
        "createdTime": 1601298961101,
        "lastModifiedTime": 1601298961101
        }
        },
        {
        "id": "ef512c07-b1b0-4b07-a6d2-bd5dd8622aa8",
        "propertyId": "1",
        "tenantId": "Hello",
        "fileNumber": "File-1237",
        "auctionDescription": "",
        "participatedBidders": "d",
        "depositedEMDAmount": 10000.0,
        "depositDate": 1599264000000,
        "emdValidityDate": null,
        "refundStatus": "",
        "auditDetails": {
        "createdBy": "2743bf22-6499-4029-bd26-79e5d0ce6427",
        "lastModifiedBy": "2743bf22-6499-4029-bd26-79e5d0ce6427",
        "createdTime": 1601298961101,
        "lastModifiedTime": 1601298961101
        }
        }
        ]
        }
        let { Auctions } = response;

        // populateBiddersTable({auctions: Auctions})
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
