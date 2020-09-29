import React from 'react';
import { httpRequest } from "./api";
import {
  convertDateToEpoch,
  getCurrentFinancialYear,
  getCheckBoxJsonpath,
  getSafetyNormsJson,
  getHygeneLevelJson,
  getLocalityHarmedJson,
  setFilteredTradeTypes,
  getTradeTypeDropdownData,
  getTextToLocalMapping
} from "../ui-config/screens/specs/utils";
import {
  prepareFinalObject,
  toggleSnackbar,
  toggleSpinner
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import {
  getTranslatedLabel,
  updateDropDowns,
  ifUserRoleExists,
  convertEpochToDate,
  calculateAge
} from "../ui-config/screens/specs/utils";
import { handleScreenConfigurationFieldChange as handleField } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import store from "redux/store";
import get from "lodash/get";
import set from "lodash/set";
import {
  getQueryArg,
  getFileUrl,
  getFileUrlFromAPI
} from "egov-ui-framework/ui-utils/commons";
import { getTenantId } from "egov-ui-kit/utils/localStorageUtils";
import {
  setBusinessServiceDataToLocalStorage,
  getMultiUnits,
  acceptedFiles,
} from "egov-ui-framework/ui-utils/commons";
import { uploadFile } from "egov-ui-framework/ui-utils/api";
import commonConfig from "config/common.js";
import { localStorageGet } from "egov-ui-kit/utils/localStorageUtils";
import { downloadReceiptFromFilestoreID } from "egov-common/ui-utils/commons"

export const updateTradeDetails = async requestBody => {
  try {
    const payload = await httpRequest(
      "post",
      "/tl-services/v1/_update",
      "",
      [],
      requestBody
    );
    return payload;
  } catch (error) {
    store.dispatch(toggleSnackbar(true, {labelName: error.message, labelKey: error.message}, "error"));
  }
};


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

export const getCount = async queryObject => {
  try {
    const response = await httpRequest(
      "post",
      "/tl-services/v1/_count",
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
}

const setDocsForEditFlow = async (state, dispatch) => {
  let applicationDocuments = get(
    state.screenConfiguration.preparedFinalObject,
    "Licenses[0].tradeLicenseDetail.applicationDocuments",
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
    prepareFinalObject("LicensesTemp[0].uploadedDocsInRedux", uploadedDocuments)
  );
};

const generateNextFinancialYear = state => {
  const currentFY = get(
    state.screenConfiguration.preparedFinalObject,
    "Licenses[0].financialYear"
  );
  const financialYears = get(
    state.screenConfiguration.preparedFinalObject,
    "applyScreenMdmsData.egf-master.FinancialYear",
    []
  );
  const currrentFYending = financialYears.filter(item => item.code === currentFY)[0]
    .endingDate;

    const nectYearObject = financialYears.filter(item => item.startingDate === currrentFYending)[0];
  return nectYearObject ? nectYearObject.code : getCurrentFinancialYear();

};

export const updatePFOforSearchResults = async (
  action,
  state,
  dispatch,
  queryValue,
  queryValuePurpose,
  tenantId
) => {
  let queryObject = [
    {
      key: "tenantId",
      value: tenantId ? tenantId : getTenantId()
    },
    { key: "applicationNumber", value: queryValue }
  ];
  const isPreviouslyEdited = getQueryArg(window.location.href, "edited");
  const payload = !isPreviouslyEdited
    ? await getSearchResults(queryObject)
    : {
      Licenses: get(state.screenConfiguration.preparedFinalObject, "Licenses")
    };
  // const payload = await getSearchResults(queryObject)
  // getQueryArg(window.location.href, "action") === "edit" &&
  //   (await setDocsForEditFlow(state, dispatch));

  const dob = get(
    payload,
    "Licenses[0].tradeLicenseDetail.owners[0].dob", 
    null
    );
  
  if (dob) {
    const dobConverted = (convertEpochToDate(dob).replace(/\//g, "-")).split("-").reverse().join("-");

    set(
      payload,
      "Licenses[0].tradeLicenseDetail.owners[0].age",
      calculateAge(dobConverted)
    )

    const age = get(
      payload,
      "Licenses[0].tradeLicenseDetail.owners[0].age",
      ""
    )

    // disable license period dropdown if age exceeds 50
    dispatch(
      handleField(
        "apply",
        "components.div.children.formwizardFirstStep.children.tradeDetails.children.cardContent.children.detailsContainer.children.licensePeriod.props",
        "disabled",
        age > 50
      )
    );
  }

  if (payload && payload.Licenses) {
    const licenses = organizeLicenseData(payload.Licenses);
    dispatch(prepareFinalObject("Licenses[0]", licenses[0]));
  }

  const isEditRenewal = getQueryArg(window.location.href, "action") === "EDITRENEWAL";
  if (isEditRenewal) {
    const currentFY = get(
      state.screenConfiguration.preparedFinalObject,
      "Licenses[0].financialYear"
    );
    const nextYear = await getNextFinancialYearForRenewal(currentFY)
    // const nextYear = generateNextFinancialYear(state);
    dispatch(
      prepareFinalObject("Licenses[0].financialYear", nextYear));
  }

  const licenseType = payload && get(payload, "Licenses[0].licenseType");
  const structureSubtype =
    payload && get(payload, "Licenses[0].tradeLicenseDetail.structureType");
  const tradeTypes = setFilteredTradeTypes(
    state,
    dispatch,
    licenseType,
    structureSubtype
  );
  const tradeTypeDdData = getTradeTypeDropdownData(tradeTypes);
  tradeTypeDdData &&
    dispatch(
      prepareFinalObject(
        "applyScreenMdmsData.TradeLicense.TradeTypeTransformed",
        tradeTypeDdData
      )
    );
  setDocsForEditFlow(state, dispatch);
  updateDropDowns(payload, action, state, dispatch, queryValue);
  if (queryValuePurpose !== "cancel") {
    set(payload, getSafetyNormsJson(queryValuePurpose), "yes");
    set(payload, getHygeneLevelJson(queryValuePurpose), "yes");
    set(payload, getLocalityHarmedJson(queryValuePurpose), "No");
  }
  set(payload, getCheckBoxJsonpath(queryValuePurpose), true);

  setApplicationNumberBox(state, dispatch);

  createOwnersBackup(dispatch, payload);
};

export const getBoundaryData = async (
  action,
  state,
  dispatch,
  queryObject,
  code,
  componentPath
) => {
  try {
    let payload = await httpRequest(
      "post",
      "/egov-location/location/v11/boundarys/_search?hierarchyTypeCode=REVENUE&boundaryType=Locality",
      "_search",
      queryObject,
      {}
    );
    const tenantId =
      process.env.REACT_APP_NAME === "Employee"
        ? get(
          state.screenConfiguration.preparedFinalObject,
          "Licenses[0].tradeLicenseDetail.address.city"
        )
        : getQueryArg(window.location.href, "tenantId");

    const mohallaData =
      payload &&
      payload.TenantBoundary[0] &&
      payload.TenantBoundary[0].boundary &&
      payload.TenantBoundary[0].boundary.reduce((result, item) => {
        result.push({
          ...item,
          name: `${tenantId
            .toUpperCase()
            .replace(/[.]/g, "_")}_REVENUE_${item.code
              .toUpperCase()
              .replace(/[._:-\s\/]/g, "_")}`
        });
        return result;
      }, []);

    dispatch(
      prepareFinalObject(
        "applyScreenMdmsData.tenant.localities",
        // payload.TenantBoundary && payload.TenantBoundary[0].boundary,
        mohallaData
      )
    );

    dispatch(
      handleField(
        "apply",
        "components.div.children.formwizardFirstStep.children.tradeLocationDetails.children.cardContent.children.tradeDetailsConatiner.children.tradeLocMohalla",
        "props.suggestions",
        mohallaData
      )
    );
    if (code) {
      let data = payload.TenantBoundary[0].boundary;
      let messageObject =
        data &&
        data.find(item => {
          return item.code == code;
        });
      if (messageObject)
        dispatch(
          prepareFinalObject(
            "Licenses[0].tradeLicenseDetail.address.locality.name",
            messageObject.name
          )
        );
    }
  } catch (e) {
    console.log(e);
  }
};

const createOwnersBackup = (dispatch, payload) => {
  const owners = get(payload, "Licenses[0].tradeLicenseDetail.owners");
  owners &&
    owners.length > 0 &&
    dispatch(
      prepareFinalObject(
        "LicensesTemp[0].tradeLicenseDetail.owners",
        JSON.parse(JSON.stringify(owners))
      )
    );
};

const getMultipleOwners = owners => {
  let mergedOwners =
    owners &&
    owners.reduce((result, item) => {
      if (item && item !== null && item.hasOwnProperty("mobileNumber")) {
        if (item.hasOwnProperty("active") && item.active) {
          if (item.hasOwnProperty("isDeleted") && !item.isDeleted) {
            set(item, "active", false);
            result.push(item);
          } else {
            result.push(item);
          }
        } else {
          if (!item.hasOwnProperty("isDeleted")) {
            result.push(item);
          }
        }
      }
      return result;
    }, []);

  return mergedOwners;
};

export const applyTradeLicense = async (state, dispatch, activeIndex) => {
  let businessService;
  try {
    let queryObject = JSON.parse(
      JSON.stringify(
        get(state.screenConfiguration.preparedFinalObject, "Licenses", [])
      )
    );
    
    let applicationType = queryObject[0].applicationType || "New";
      dispatch(
        handleField(
          "apply",
          "components.div.children.formwizardFourthStep.children.tradeReviewDetails.children.cardContent.children.reviewTradeDetails.children.cardContent.children.viewOne.children.oldLicenseNumber",
          "visible",
          applicationType !== "New"
        )
      );
      dispatch(
        handleField(
          "apply",
          "components.div.children.formwizardFourthStep.children.tradeReviewDetails.children.cardContent.children.reviewTradeDetails.children.cardContent.children.viewOne.children.oldLicenseValidTo",
          "visible",
          applicationType !== "New"
        )
      );

    let documents = get(
      queryObject[0],
      "tradeLicenseDetail.applicationDocuments"
    );
    set(queryObject[0], "applicationType", applicationType)
    set(
      queryObject[0],
      "validFrom",
      convertDateToEpoch(queryObject[0].validFrom, "dayend")
    );
    // set(queryObject[0], "wfDocuments", documents);
    set(
      queryObject[0],
      "validTo",
      convertDateToEpoch(queryObject[0].validTo, "dayend")
    );
    if (queryObject[0] && queryObject[0].commencementDate) {
      queryObject[0].commencementDate = convertDateToEpoch(
        queryObject[0].commencementDate,
        "dayend"
      );
    }
    set(queryObject[0], "licenseType", "PERMANENT");
    let owners = get(queryObject[0], "tradeLicenseDetail.owners");
    owners = (owners && convertOwnerDobToEpoch(owners)) || [];

    if (queryObject[0].tradeLicenseDetail.additionalDetail.oldLicenseValidTo) {
      set(
        queryObject[0],
        "tradeLicenseDetail.additionalDetail.oldLicenseValidTo",
        convertDateToEpoch(queryObject[0].tradeLicenseDetail.additionalDetail.oldLicenseValidTo, "dayend")
      );
    }

    const cityId = get(
      queryObject[0],
      "tradeLicenseDetail.address.tenantId",
      ""
    );
    const tenantId = ifUserRoleExists("CITIZEN") ? cityId : getTenantId();
    const BSqueryObject = [
      { key: "tenantId", value: tenantId },
      { key: "businessServices", value: "NewTL" }
    ];
    if (process.env.REACT_APP_NAME === "Citizen") {
      let currentFinancialYr = getCurrentFinancialYear();
      //Changing the format of FY
      let fY1 = currentFinancialYr.split("-")[1];
      fY1 = fY1.substring(2, 4);
      currentFinancialYr = currentFinancialYr.split("-")[0] + "-" + fY1;
      set(queryObject[0], "financialYear", currentFinancialYr);
      await setBusinessServiceDataToLocalStorage(BSqueryObject, dispatch);

      const businessServiceData = JSON.parse(
        localStorageGet("businessServiceData")
      );
      businessService = businessServiceData[0].businessService;
    }


    set(queryObject[0], "tenantId", tenantId);
    set(queryObject[0], "workflowCode", businessService ? businessService : "NewTL");
    set(queryObject[0], "businessService", queryObject[0].businessService)
    if (queryObject[0].applicationNumber) {
      //call update
      const isEditRenewal = getQueryArg(window.location.href, "action") === "EDITRENEWAL";
      if(isEditRenewal ){
        // if(process.env.REACT_APP_NAME === "Citizen"){
        //   const nextFinancialyear = await getNextFinancialYearForRenewal(queryObject[0].financialYear);
        //   set(queryObject[0], "financialYear", nextFinancialyear);
        // } 
        set(queryObject[0], "workflowCode", getQueryArg(window.location.href, "action"));
      }

      let accessories = get(queryObject[0], "tradeLicenseDetail.accessories");
      let tradeUnits = get(queryObject[0], "tradeLicenseDetail.tradeUnits");
      set(
        queryObject[0],
        "tradeLicenseDetail.tradeUnits",
        getMultiUnits(tradeUnits)
      );
      set(
        queryObject[0],
        "tradeLicenseDetail.accessories",
        getMultiUnits(accessories)
      );
      set(
        queryObject[0],
        "tradeLicenseDetail.owners",
        getMultipleOwners(owners)
      );

      let action = "INITIATE";
      //Code for edit flow

      if (
        queryObject[0].tradeLicenseDetail &&
        queryObject[0].tradeLicenseDetail.applicationDocuments
      ) {
        if (getQueryArg(window.location.href, "action") === "edit" || isEditRenewal) {
        } else if (activeIndex === 1) {
          set(queryObject[0], "tradeLicenseDetail.applicationDocuments", null);
        } else action = "SUBMIT";
      }

      if (activeIndex === 3 && isEditRenewal) {
        action = "SUBMIT";
        let renewalSearchQueryObject = [
          { key: "tenantId", value: queryObject[0].tenantId },
          { key: "applicationNumber", value: queryObject[0].applicationNumber }
        ];
        const renewalResponse = await getSearchResults(renewalSearchQueryObject);
        const renewalDocuments = get(renewalResponse, "Licenses[0].tradeLicenseDetail.applicationDocuments");
        for (let i = 1; i <= documents.length; i++) {
          if (i > renewalDocuments.length) {
            renewalDocuments.push(documents[i-1])
          }
        }
        dispatch(prepareFinalObject("Licenses[0].tradeLicenseDetail.applicationDocuments", renewalDocuments));
        set(queryObject[0], "tradeLicenseDetail.applicationDocuments", renewalDocuments);

      }
      set(queryObject[0], "action", action);
      const isEditFlow = getQueryArg(window.location.href, "action") === "edit";
      let updateResponse;
      if (!isEditFlow) {
        if(activeIndex === 0) {
          set(queryObject[0], "action", "REINITIATE")
          // set(queryObject[0], "wfDocuments", null)
          // set(queryObject[0], "tradeLicenseDetail.applicationDocuments", null)
        }
        let applicationDocuments = get(queryObject[0], "tradeLicenseDetail.applicationDocuments") || [];
        applicationDocuments = applicationDocuments.map(item => ({...item, active: true}))
        const removedDocs = get(state.screenConfiguration.preparedFinalObject, "LicensesTemp[0].removedDocs") || [];
        applicationDocuments = [...applicationDocuments, ...removedDocs]
        set(queryObject[0], "tradeLicenseDetail.applicationDocuments", applicationDocuments)
        updateResponse = await httpRequest("post", "/tl-services/v1/_update", "", [], {
          Licenses: queryObject
        })
      }
      //Renewal flow

      let updatedApplicationNo = "";
      let updatedTenant = "";
      if (isEditRenewal && updateResponse && get(updateResponse, "Licenses[0]")) {
        updatedApplicationNo = get(updateResponse.Licenses[0], "applicationNumber");
        updatedTenant = get(updateResponse.Licenses[0], "tenantId");
        const workflowCode = get(updateResponse.Licenses[0], "workflowCode");
        const bsQueryObject = [
          { key: "tenantId", value: tenantId },
          { key: "businessServices", value: workflowCode ? workflowCode : "NewTL" }
        ];
        await setBusinessServiceDataToLocalStorage(bsQueryObject, dispatch);
      } else {
        updatedApplicationNo = queryObject[0].applicationNumber;
        updatedTenant = queryObject[0].tenantId;
      }
      let searchQueryObject = [
        { key: "tenantId", value: updatedTenant },
        { key: "applicationNumber", value: updatedApplicationNo }
      ];
      if(!!updateResponse && 
        !!updateResponse.Licenses && 
        !!updateResponse.Licenses.length) {
          let {Licenses: updatedLicenses = []} = updateResponse;
          /* if(activeIndex === 0) {
            let [license] = updatedLicenses;
            license = {...license, wfDocuments: documents, 
              tradeLicenseDetail: {...license.tradeLicenseDetail, 
                applicationDocuments: documents}}
            updatedLicenses = [license]
          } */
          updatedLicenses = organizeLicenseData(updatedLicenses);
          let applicationDocuments = updatedLicenses[0].tradeLicenseDetail.applicationDocuments;
          const removedDocs = applicationDocuments.filter(item => !item.active)
          applicationDocuments = applicationDocuments.filter(item => !!item.active)
          updatedLicenses = [{...updatedLicenses[0], tradeLicenseDetail: {...updatedLicenses[0].tradeLicenseDetail, applicationDocuments}}]
          dispatch(prepareFinalObject("Licenses", updatedLicenses));
          dispatch(
            prepareFinalObject(
              "LicensesTemp[0].removedDocs",
              removedDocs
            )
          );
          await setDocsForEditFlow(state, dispatch)
        }
      // const updatedtradeUnits = get(
      //   searchResponse,
      //   "Licenses[0].tradeLicenseDetail.tradeUnits"
      // );
      // const tradeTemp = updatedtradeUnits.map((item, index) => {
      //   return {
      //     tradeSubType: item.tradeType.split(".")[1],
      //     tradeType: item.tradeType.split(".")[0]
      //   };
      // });
      // dispatch(prepareFinalObject("LicensesTemp.tradeUnits", tradeTemp));
      // createOwnersBackup(dispatch, searchResponse);
    } else {
      let accessories = get(queryObject[0], "tradeLicenseDetail.accessories");
      let tradeUnits = get(queryObject[0], "tradeLicenseDetail.tradeUnits");
      // let owners = get(queryObject[0], "tradeLicenseDetail.owners");
      let mergedTradeUnits =
        tradeUnits &&
        tradeUnits.filter(item => !item.hasOwnProperty("isDeleted"));
      let mergedAccessories =
        accessories &&
        accessories.filter(item => !item.hasOwnProperty("isDeleted"));
      let mergedOwners =
        owners && owners.filter(item => !item.hasOwnProperty("isDeleted"));

      set(queryObject[0], "tradeLicenseDetail.tradeUnits", mergedTradeUnits);
      set(queryObject[0], "tradeLicenseDetail.accessories", mergedAccessories);
      set(queryObject[0], "tradeLicenseDetail.owners", mergedOwners);
      set(queryObject[0], "action", "INITIATE");
      //Emptying application docs to "INITIATE" form in case of search and fill from old TL Id.
      if (!queryObject[0].applicationNumber)
        set(queryObject[0], "tradeLicenseDetail.applicationDocuments", null);

      // const tradeLicenseType = getQueryArg(window.location.href, "tlType");

      if (queryObject[0].tradeLicenseDetail.owners[0].businessStartDate) {
        set(
          queryObject[0].tradeLicenseDetail.owners[0],
          "businessStartDate",
          convertDateToEpoch(queryObject[0].tradeLicenseDetail.owners[0].businessStartDate, "dayend")
        )
      }
      // queryObject[0].trade = tradeLicenseType;
      queryObject[0].tradeLicenseDetail.tradeUnits = [];
      queryObject[0].tradeLicenseDetail.subOwnershipCategory = "INDIVIDUAL.SINGLEOWNER";
      queryObject[0].tradeLicenseDetail.structureType = "IMMOVABLE.PUCCA";

      const response = await httpRequest(
        "post",
        "/tl-services/v1/_create",
        "",
        [],
        { Licenses: queryObject }
      );
      let {Licenses} = response
      Licenses = organizeLicenseData(Licenses)
      dispatch(prepareFinalObject("Licenses", Licenses));
      createOwnersBackup(dispatch, response);
    }
    /** Application no. box setting */
    setApplicationNumberBox(state, dispatch);
    return true;
  } catch (error) {
    dispatch(toggleSnackbar(true, { labelName: error.message }, "error"));
    console.log(error);
    return false;
  }
};

const convertOwnerDobToEpoch = owners => {
  let updatedOwners =
    owners && owners.length > 0 &&
    owners
      .map(owner => {
        return {
          ...owner,
          dob:
            owner && owner !== null && convertDateToEpoch(owner.dob, "dayend")
        };
      })
      .filter(item => item && item !== null);
  return updatedOwners;
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

const setApplicationNumberBox = (state, dispatch) => {
  let applicationNumber = get(
    state,
    "screenConfiguration.preparedFinalObject.Licenses[0].applicationNumber",
    null
  );
  if (applicationNumber) {
    dispatch(
      handleField(
        "apply",
        "components.div.children.headerDiv.children.header.children.applicationNumber",
        "visible",
        true
      )
    );
    dispatch(
      handleField(
        "apply",
        "components.div.children.headerDiv.children.header.children.applicationNumber",
        "props.number",
        applicationNumber
      )
    );
  }
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

export const getNextFinancialYearForRenewal = async (currentFinancialYear) => {
  let payload = null;
  let mdmsBody = {
    MdmsCriteria: {
      tenantId: getTenantId(),
      moduleDetails: [
        {
          moduleName: "egf-master",
          masterDetails: [{ name: "FinancialYear", filter: `[?(@.module == "TL")]` }]
        }
      ]
    }
  };

  try {
    payload = await httpRequest(
      "post",
      "/egov-mdms-service/v1/_search",
      "_search",
      [],
      mdmsBody
    );

    const financialYears = get(payload.MdmsRes, "egf-master.FinancialYear");
    const currrentFYending = financialYears.filter(item => item.code === currentFinancialYear)[0]
      .endingDate;
    const nectYearObject = financialYears.filter(item => item.startingDate === currrentFYending)[0];
    return nectYearObject ? nectYearObject.code : getCurrentFinancialYear();
  } catch (e) {
    console.log(e.message)
  }
}

export const organizeLicenseData = data => {
  return data.filter(license => !!license).map(item => {
    let {tradeLicenseDetail, applicationType, businessService} = item;
    let {owners} = tradeLicenseDetail;
    owners = owners.map(owner => ({
      ...owner,
      age: Number((new Date().getTime() - owner.dob)/31536000000).toFixed(0)
    }))
    tradeLicenseDetail = {...tradeLicenseDetail, additionalDetail: {...tradeLicenseDetail.additionalDetail, licensePeriod: tradeLicenseDetail.additionalDetail.licensePeriod + ""}, owners}
    applicationType = !applicationType && applicationType
    return {...item, tradeLicenseDetail, applicationType}
  })
}

export const download = (receiptQueryString, Licenses, data, mode = "download") => {
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
      const queryStr = [
        { key: "key", value: "tl-receipt" },
        { key: "tenantId", value: receiptQueryString[1].value.split('.')[0] }
      ]
      if(payloadReceiptDetails&&payloadReceiptDetails.Payments&&payloadReceiptDetails.Payments.length==0){
        console.log("Could not find any receipts");   
        return;
      }
      let {Payments} = payloadReceiptDetails;
      let {billAccountDetails} = Payments[0].paymentDetails[0].bill.billDetails[0];
      billAccountDetails = billAccountDetails.map(({taxHeadCode, ...rest}) => ({
        ...rest,
        taxHeadCode: taxHeadCode.includes("_FEE") ? "TL_FEE" : taxHeadCode.includes("_PENALTY") ? "TL_TIME_PENALTY" : taxHeadCode.includes("_TAX") ? "TL_TAX" : taxHeadCode.includes("_ROUNDOFF") ? "TL_ROUNDOFF" : taxHeadCode
      }))
      Payments = [{...Payments[0], paymentDetails: [{...Payments[0].paymentDetails[0], bill: {...Payments[0].paymentDetails[0].bill, billDetails: [{...Payments[0].paymentDetails[0].bill.billDetails[0],billAccountDetails }] } }]}]
      httpRequest("post", DOWNLOADRECEIPT.GET.URL, DOWNLOADRECEIPT.GET.ACTION, queryStr, { Payments, Licenses, data }, { 'Accept': 'application/json' }, { responseType: 'arraybuffer' })
        .then(res => {
          res.filestoreIds[0]
          if(res&&res.filestoreIds&&res.filestoreIds.length>0){
            res.filestoreIds.map(fileStoreId=>{
              downloadReceiptFromFilestoreID(fileStoreId,mode)
            })          
          }else{
            console.log("Error In Receipt Download");        
          }         
        });
    })
  } catch (exception) {
    alert('Some Error Occured while downloading Receipt!');
  }
}

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
      store.dispatch(
        handleField(
          "apply",
          "components.div.children.formwizardSecondStep.children.AllotmentAuctionDetails.children.cardContent.children.auctionTableContainer",
          "visible",
          true
        )
      );
      store.dispatch(toggleSnackbar(true, { labelName: "File Uploaded Successfully" }, "success"));
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

        populateBiddersTable(Auctions)
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


export const populateBiddersTable = (auctionData) => {
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
          }
        })
    }));

    store.dispatch(
      handleField(
        "apply",
        "components.div.children.formwizardSecondStep.children.AllotmentAuctionDetails.children.cardContent.children.auctionTableContainer",
        "props.data",
        data
      )
    );
  }
}
