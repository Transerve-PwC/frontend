import React from 'react';
import { httpRequest } from "./api";
import {
  toggleSnackbar,
  toggleSpinner,
  handleScreenConfigurationFieldChange as handleField
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import {
  getTranslatedLabel,
  getTextToLocalMapping
} from "../ui-config/screens/specs/utils";
import store from "redux/store";
import { uploadFile } from "egov-ui-framework/ui-utils/api";
import commonConfig from "config/common.js";
import get from "lodash/get";

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

export const getExcelData = async (excelUrl, fileStoreId, screenKey, componentJsonPath, preparedFinalObject) => {
  const fileNumber = get(
    preparedFinalObject,
    "Properties[0].fileNumber"
  )
  const propertyId = get(
    preparedFinalObject,
    "Properties[0].id"
  )
  const queryObject = [
    {key: "tenantId", value: "ch"},
    {key: "fileStoreId", value: fileStoreId}
  ]
  const reqBody = {
    Property: {
      tenantId: "ch",
      fileNumber: fileNumber,
      id: propertyId
    }
  };
  try {
    store.dispatch(toggleSpinner());
    const response = await httpRequest(
      "post",
      excelUrl,
      "",
      queryObject,
      reqBody
    )
    if(!!response) {
      store.dispatch(
        handleField(
          screenKey,
          componentJsonPath,
          "visible",
          true
        )
      );
      store.dispatch(toggleSnackbar(true, { labelName: "File Uploaded Successfully" }, "success"));
      console.log(response);

      let { Auctions } = response;

      populateBiddersTable(Auctions, screenKey, componentJsonPath, preparedFinalObject)
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


export const populateBiddersTable = (auctionData, screenKey, componentJsonPath, preparedFinalObject) => {
  console.log(auctionData);

  if (!!auctionData) {
    let data = auctionData.map(item => ({
      [getTextToLocalMapping("File Number")]: item.fileNumber || "-",
      [getTextToLocalMapping("Participated Bidders")]: item.participatedBidders || "-",
      [getTextToLocalMapping("Deposited EMD Amount")]: item.depositedEMDAmount || "-",
      [getTextToLocalMapping("Deposit Date")]: item.depositDate || "-",
      [getTextToLocalMapping("EMD Validity Date")]: item.emdValidityDate || "-",
      [getTextToLocalMapping("Mark as Refunded")]: React.createElement(
        "input",
        {
          type:"checkbox",
          defaultChecked: false, 
          onClick: () => { 
            console.log("checkbox clicked");
            if (confirm('Are you sure you want to mark/unmark as refunded?')) {
              console.log('Done');
              debugger;
              let auctionData = preparedFinalObject.Auctions;
              console.log("auctionData", auctionData);
              const reqBody = {
                Property: {
                  tenantId: "ch",
                  fileNumber: fileNumber,
                  id: propertyId
                }
              };
            } else {
              console.log('Cancelled');
            }
          }
        })
    }));

    store.dispatch(
      handleField(
        screenKey,
        componentJsonPath,
        "props.data",
        data
      )
    );
  }
}

export const getAuctionDetails = async requestBody => {
  try {
    const response = await httpRequest(
      "post",
      "/est-services/auctions/_search",
      "_search",
      [],
      requestBody
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
