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
import axios from "axios";
import {
  getQueryArg,
  getFileUrl,
  getFileUrlFromAPI
} from "egov-ui-framework/ui-utils/commons";
import { getTenantId, getUserInfo } from "egov-ui-kit/utils/localStorageUtils";
import {
  setBusinessServiceDataToLocalStorage,
  getMultiUnits,
  acceptedFiles,
} from "egov-ui-framework/ui-utils/commons";
// import { uploadFile } from "egov-ui-framework/ui-utils/api";
import { prepareForm } from "egov-ui-framework/ui-utils/api";

import commonConfig from "config/common.js";
import { localStorageGet } from "egov-ui-kit/utils/localStorageUtils";
import { downloadReceiptFromFilestoreID } from "egov-common/ui-utils/commons"
import {RP_DEMAND_GENERATION_DATE, RP_PAYMENT_DATE, RP_ASSESSMENT_AMOUNT, RP_REALIZATION_AMOUNT, RP_RECEIPT_NO} from '../ui-constants'
import moment from "moment";
import { setApplicationNumberBox } from "./apply";

export const uploadFile = async (endPoint, module, file, ulbLevel) => {
  // Bad idea to fetch from local storage, change as feasible
  store.dispatch(toggleSpinner());
  const tenantId = getTenantId()

  const uploadInstance = axios.create({
    baseURL: window.location.origin,
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });

  const requestParams = {
    tenantId,
    module,
    file
  };
  const requestBody = prepareForm(requestParams);

  try {
    const response = await uploadInstance.post(endPoint, requestBody);
    const responseStatus = parseInt(response.status, 10);
    let fileStoreIds = [];
    store.dispatch(toggleSpinner());
    if (responseStatus === 201) {
      const responseData = response.data;
      const files = responseData.files || [];
      fileStoreIds = files.map(f => f.fileStoreId);
      return fileStoreIds[0];
    }
  } catch (error) {
    store.dispatch(toggleSpinner());
      let FileExceedMessage = "File size exceeded the limit in service";
      store.dispatch(toggleSnackbar(true, { labelName: FileExceedMessage }, "warning"));
     // alert(FileExceedMessage); 
  }
};


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
    const masterDocuments = !!findFreshLicenceItem ? findFreshLicenceItem.documentList : [];
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
    // applicationType = applicationType
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