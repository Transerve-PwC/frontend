import { convertDateToEpoch, convertEpochToDate } from "egov-ui-framework/ui-config/screens/specs/utils";
import moment from 'moment';
import {
  handleScreenConfigurationFieldChange as handleField,
  prepareFinalObject,
  toggleSnackbar,
  toggleSpinner
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { httpRequest } from "./index"; //import { httpRequest } from "egov-ui-framework/ui-utils/api";
import { getTransformedLocale } from "egov-ui-framework/ui-utils/commons";
import {
  getAccessToken,
  getTenantId, getUserInfo, getapplicationType, getapplicationMode, setapplicationMode, setapplicationNumber
} from "egov-ui-kit/utils/localStorageUtils";
import jp from "jsonpath";
import get from "lodash/get";
import set from "lodash/set";
import store from "ui-redux/store";
import { getTranslatedLabel, convertDateTimeToEpoch, getTextToLocalMapping, getDiffernceBetweenTodayDate, getDiffernceBetweenTwoDates, fetchRoleCode, getEpochForDate } from "../ui-config/screens/specs/utils";
import { getapplicationNumber } from "egov-ui-kit/utils/localStorageUtils";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";

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

export const findItemInArrayOfObject = (arr, conditionCheckerFn) => {
  for (let i = 0; i < arr.length; i++) {
    if (conditionCheckerFn(arr[i])) {
      return arr[i];
    }
  }
};

export const getSearchResults = async (RequestBody, dispatch) => {
  try {

    let data = {
      RequestBody
    }
    store.dispatch(toggleSpinner());
    const response = await httpRequest(
      "post",
      "/ec-services/violation/_get",
      "",
      [],
      data
    );


    store.dispatch(toggleSpinner());
    return response;
  } catch (error) {
    store.dispatch(
      toggleSnackbar(
        true,
        { labelName: error.message, labelKey: error.message },
        "error"
      )
    );
    throw error;
  }
};

export const prepareDocumentsUploadData = (state, dispatch) => {
  let documents = get(
    state,
    "screenConfiguration.preparedFinalObject.applyScreenMdmsData.egec.documents",
    []
  );
  documents = documents.filter(item => {
    return item.active;
  });
  let documentsContract = [];
  let tempDoc = {};
  documents.forEach(doc => {
    let card = {};
    card["code"] = doc.documentType;
    card["title"] = "",//getTextToLocalMapping(doc.documentType);
      card["cards"] = [];
    tempDoc[doc.documentType] = card;
  });

  documents.forEach(doc => {
    let card = {};
    card["name"] = doc.code;
    card["code"] = doc.code;
    card["required"] = doc.required ? true : false;
    if (doc.hasDropdown && doc.dropdownData) {
      let dropdown = {};
      dropdown.label = "NOC_SELECT_DOC_DD_LABEL";
      dropdown.required = true;
      dropdown.menu = doc.dropdownData.filter(item => {
        return item.active;
      });
      dropdown.menu = dropdown.menu.map(item => {
        return { code: item.code, label: getTransformedLocale(item.code) };
      });
      card["dropdown"] = dropdown;
    }
    tempDoc[doc.documentType].cards.push(card);
    //}
  });

  Object.keys(tempDoc).forEach(key => {
    documentsContract.push(tempDoc[key]);
  });

  dispatch(prepareFinalObject("documentsContract", documentsContract));
};

export const prepareDocumentsUploadRedux = (state, dispatch) => {
  const {
    documentsList,
    documentsUploadRedux = {},
    prepareFinalObject
  } = this.props;
  let index = 0;
  documentsList.forEach(docType => {
    docType.cards &&
      docType.cards.forEach(card => {
        if (card.subCards) {
          card.subCards.forEach(subCard => {
            let oldDocType = get(
              documentsUploadRedux,
              `[${index}].documentType`
            );
            let oldDocCode = get(
              documentsUploadRedux,
              `[${index}].documentCode`
            );
            let oldDocSubCode = get(
              documentsUploadRedux,
              `[${index}].documentSubCode`
            );
            if (
              oldDocType != docType.code ||
              oldDocCode != card.name ||
              oldDocSubCode != subCard.name
            ) {
              documentsUploadRedux[index] = {
                documentType: docType.code,
                documentCode: card.name,
                documentSubCode: subCard.name
              };
            }
            index++;
          });
        } else {
          let oldDocType = get(documentsUploadRedux, `[${index}].documentType`);
          let oldDocCode = get(documentsUploadRedux, `[${index}].documentCode`);
          if (oldDocType != docType.code || oldDocCode != card.name) {
            documentsUploadRedux[index] = {
              documentType: docType.code,
              documentCode: card.name,
              isDocumentRequired: card.required,
              isDocumentTypeRequired: card.dropdown
                ? card.dropdown.required
                : false
            };
          }
        }
        index++;
      });
  });
  prepareFinalObject("documentsUploadRedux", documentsUploadRedux);
};

export const setApplicationNumberBox = (state, dispatch, applicationNo) => {
  if (!applicationNo) {
    applicationNo = get(
      state,
      "screenConfiguration.preparedFinalObject.eChallan.challanId",
      null
    );
  }

  if (applicationNo) {
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
        applicationNo
      )
    );
  }
};

export const getFineMasterGridData = async () => {
  let data = {
    "RequestBody": {
      "tenantId": getTenantId(),
    }
  }
  try {
    const response = await httpRequest(
      "post",
      "/ec-services/fine/_get",
      "",
      [],
      data
    );

    return response;

  } catch (error) {
    store.dispatch(
      toggleSnackbar(
        true,
        { labelName: error.message, labelCode: error.message },
        "error"
      )
    );
  }

};

const checkEffectiveDate = (state, dispatch, effectiveStartDate) => {

  try {
    let isactionDateLess = false
    let isactionDateEquall = false
    let fineGridRecord = [];
    let gridCurrentRecord = get(state, 'screenConfiguration.preparedFinalObject.FineMaster', []);
    let existingfineGridData = get(state, 'screenConfiguration.preparedFinalObject.FineMasterGrid', []);
    let curlistRecord = [];

    let __FOUND = existingfineGridData.find(function (fineRecord, index) {

      if (fineRecord[7] !== "REJECTED") {
        fineGridRecord.push(fineRecord);
        //return true;
      }
    });
    fineGridRecord.forEach(element => {
      if (gridCurrentRecord.hasOwnProperty('fineUuid')) {
        if (element[8] === gridCurrentRecord.encroachmentType
          && element[2] === gridCurrentRecord.numberOfViolation
          && element[0] !== gridCurrentRecord.fineUuid) {
          curlistRecord.push(element);
        }
      } else {
        if (element[8] === gridCurrentRecord.encroachmentType
          && element[2] === gridCurrentRecord.numberOfViolation) {
          curlistRecord.push(element);
        }
      }
    });

    if (curlistRecord.length > 0) {
      for (let index = 0; index < curlistRecord.length; index++) {
        const element = curlistRecord[index];
        let eleDate = new Date(getEpochForDate(element[6]));
        let actionDate = new Date(effectiveStartDate);

        if (actionDate < eleDate) {
          if (!isactionDateLess) {
            isactionDateLess = true;
          }
        } else if (getDiffernceBetweenTwoDates(convertEpochToDate(convertDateToEpoch(effectiveStartDate)), element[6]) === 0) {
          if (!isactionDateEquall) {
            isactionDateEquall = true
          }
        } else if (eleDate < actionDate) {
          if (!isactionDateLess) {
            isactionDateLess = false;
          }
        }
      }
    }
    if (!isactionDateLess && !isactionDateEquall) {
      return false;
    } else if (isactionDateLess && isactionDateEquall) {
      return true;
    } else if (!isactionDateLess && isactionDateEquall) {
      return true;
    } else if (isactionDateLess && !isactionDateEquall) {
      return true;
    }

  } catch (error) {

    console.log(error);
  }
}
export const createUpdateFineMaster = async (state, dispatch, status, isActive) => {

  let FineID = get(state, "screenConfiguration.preparedFinalObject.FineMaster.fineUuid");

  let method = FineID ? "_update" : "_create";
  try {
    let payload = get(state.screenConfiguration.preparedFinalObject, "FineMaster", []);

    let processeffective = get(payload, 'effectiveStartDate', new Date());
    let processeffectiveEnd = get(payload, 'effectiveEndDate', new Date());
    let isStartDateValid = false;
    let isEndDateVaild = false;

    if (status !== 'APPROVE' && status !== 'REJECT') {

      isStartDateValid = checkEffectiveDate(state, dispatch, processeffective);
      //isEndDateVaild = new Date(processeffectiveEnd) < new Date(processeffective) ? true : false

      isEndDateVaild = getDiffernceBetweenTwoDates(convertEpochToDate(convertDateTimeToEpoch(processeffectiveEnd)), convertEpochToDate(convertDateTimeToEpoch(processeffective))) < 0 ? true : false;
    }

    set(payload, "effectiveStartDate", convertEpochToDate(convertDateTimeToEpoch(processeffective)));
    set(payload, "effectiveEndDate", convertEpochToDate(convertDateTimeToEpoch(processeffectiveEnd)));

    set(payload, "tenantId", getTenantId());
    set(payload, "approvalStatus", status);
    set(payload, "isActive", true);
    payload.hasOwnProperty('storageCharges') ? set(payload, "storageCharges", payload.storageCharges) : set(payload, "storageCharges", 0)
    let response;

    if (!isStartDateValid && !isEndDateVaild) {
      response = await httpRequest("post", "/ec-services/fine/" + method, "", [], { requestBody: payload });
      if (response.ResponseBody.fineUuid !== 'null' || response.ResponseBody.fineUuid !== '') {
        dispatch(prepareFinalObject("FineMasters", response.ResponseBody));
        return { status: "success", message: response };
      } else {
        return { status: "fail", message: response };
      }
    } else if (isStartDateValid) {

      var processeffectiveEndDate = moment(processeffectiveEnd).format('YYYY-MM-DD')
      var processeffectiveStartDate = moment(processeffective).format('YYYY-MM-DD')
      set(payload, "effectiveStartDate", processeffectiveStartDate);
      set(payload, "effectiveEndDate", processeffectiveEndDate);
      let labelName = "Start Date should be greater then the previous End Date for the selected Criteria";
      return { status: "InValidStartDate", message: labelName };

    } else if (isEndDateVaild) {

      var processeffectiveEndDate = moment(processeffectiveEnd).format('YYYY-MM-DD')
      var processeffectiveStartDate = moment(processeffective).format('YYYY-MM-DD')
      set(payload, "effectiveEndDate", processeffectiveEndDate);
      set(payload, "effectiveStartDate", processeffectiveStartDate);
      let labelName = "End Date should be greater then the Start Date for the selected Criteria";
      return { status: "InValidEndDate", message: labelName };

    }

  } catch (error) {
    dispatch(toggleSnackbar(true, { labelName: error.message }, "error"));
    return { status: "failure", message: error };
  }
};

export const fetchItemListMasterData = async (action, state, dispatch) => {
  //
  try {
    const response = await httpRequest("post", "/ec-services/item/_get", "", [], data);
    let data = response.ResponseBody.map(item => ({
      // alert(item)
      'id': item['itemUuid'] || "-",
      'code': item['itemName'] || "-",
      'name': item['itemName'] || "-"
    }));
    data.push({ 'id': 'Other', 'code': 'Other', 'name': 'Other' })

    store.dispatch(prepareFinalObject("applyScreenMdmsData.egec.ItemList", data));
    //this is kept purposely if the data does not get at the load then it would be assigned.
    store.dispatch(prepareFinalObject("applyScreenMdmsData.egec.ViolationItemList", data));
    return response;

  } catch (error) {
    store.dispatch(
      toggleSnackbar(
        true,
        { labelName: error.message, labelCode: error.message },
        "error"
      )
    );
  }

};

export const fetchItemMasterData = async (itemUuid) => {
  let itemUid = itemUuid ? 'itemUuid : ' + itemUuid : ''
  let data = {
    "RequestBody": {
      tenantId: getTenantId(),
      itemUid,
    }
  }
  try {
    const response = await httpRequest("post", "/ec-services/item/_get", "", [], data);
    return response;

  } catch (error) {
    store.dispatch(
      toggleSnackbar(
        true,
        { labelName: error.message, labelCode: error.message },
        "error"
      )
    );
  }

};

export const createUpdateItemMaster = async (state, dispatch, status, isActive) => {
  let ItemID = get(state, "screenConfiguration.preparedFinalObject.ItemMaster.itemUuid");
  setapplicationNumber(ItemID);
  let method = ItemID ? "UPDATE" : "CREATE";
  try {
    let payload = get(state.screenConfiguration.preparedFinalObject, "ItemMaster", []);
    let itemname = payload.itemName.replace(/(\r\n|\n|\r)/gm, "").trim();
    let itemDesc = payload.description.replace(/(\r\n|\n|\r)/gm, "").trim();
    set(payload, "itemName", itemname);
    set(payload, "description", itemDesc);
    set(payload, "tenantId", getTenantId());
    set(payload, "approvalStatus", status);
    set(payload, "isActive", isActive);
    let response;
    let methodName = '';

    methodName = method === "CREATE" ? '_create' : '_update';
    response = await httpRequest("post", "/ec-services/item/" + methodName, "", [], { requestBody: payload });

    if (response.ResponseBody.itemUuid !== 'null' || response.ResponseBody.itemUuid !== '') {
      dispatch(prepareFinalObject("ItemMasters", response.ResponseBody));
      return { status: "success", message: response };
    } else {
      return { status: "fail", message: response };
    }
  } catch (error) {
    dispatch(toggleSnackbar(true, { labelName: error.message }, "error"));
    return { status: "failure", message: error };
  }
};

export const fetchMasterChallanData = async (RequestBody) => {
  let data = {
    RequestBody
  }
  try {
    const response = await httpRequest(
      "post",
      "/ec-services/violation/_get",
      "",
      [],
      data
    );

    return response;

  } catch (error) {
    store.dispatch(
      toggleSnackbar(
        true,
        { labelName: error.message, labelCode: error.message },
        "error"
      )
    );
  }

};

export const fetchSearchMasterChallanData = async (RequestBody) => {
  let data = {
    RequestBody
  }
  try {
    const response = await httpRequest(
      "post",
      "/ec-services/violation/_search",
      "",
      [],
      data
    );

    return response;

  } catch (error) {
    store.dispatch(
      toggleSnackbar(
        true,
        { labelName: error.message, labelCode: error.message },
        "error"
      )
    );
  }

};

export const fetchMasterChallanHODAuction = async (RequestBody) => {
  let data = {
    RequestBody
  }
  try {
    const response = await httpRequest(
      "post",
      "/ec-services/auction/_getChallan",
      "",
      [],
      data
    );
    return response;

  } catch (error) {
    store.dispatch(
      toggleSnackbar(
        true,
        { labelName: error.message, labelCode: error.message },
        "error"
      )
    );
  }

};

export const fetchStoreItemHODMasterChallanData = async (RequestBody) => {
  let data = {
    RequestBody
  }
  try {
    const response = await httpRequest(
      "post",
      "/ec-services/storeitemregister/_get",
      "",
      [],
      data
    );

    return response.ResponseBody;

  } catch (error) {
    store.dispatch(
      toggleSnackbar(
        true,
        { labelName: error.message, labelCode: error.message },
        "error"
      )
    );
  }

};

export const fetchauctionHODMasterChallanData = async (RequestBody) => {
  let data = {
    RequestBody
  }
  try {
    const response = await httpRequest(
      "post",
      "/ec-services/auction/_get",
      "",
      [],
      data
    );

    return response.ResponseBody;

  } catch (error) {
    store.dispatch(
      toggleSnackbar(
        true,
        { labelName: error.message, labelCode: error.message },
        "error"
      )
    );
  }

};

export const fetchVendorDetails = async (state, dispatch) => {
  let data = {
    RequestBody: {
      tenantId: getTenantId(),
    }
  }

  try {
    const response = await httpRequest(
      "post",
      "/ec-services/vendor/_get",
      "",
      [],
      data
    );

    let vendordata = [];
    response.ResponseBody.forEach(vendor => {
      if (vendor.isActive) {
        let vendormodified = {
          code: vendor.covNo,
          name: vendor.name + "(" + vendor.covNo + ")",
          fullname: vendor.name,
          address: vendor.address,
          fatherSpouseName: vendor.fatherSpouseName,
          contactNumber: vendor.contactNumber,
          numberOfViolation: vendor.numberOfViolation,
          active: vendor.isActive,
        }
        vendordata.push(vendormodified);
      }
    });
    return vendordata;

  } catch (error) {
    store.dispatch(
      toggleSnackbar(
        true,
        { labelName: error.message, labelCode: error.message },
        "error"
      )
    );
  }
};

export const createVendorDetails = async (file) => {
  let isCreateSuccess = true;
  let isUpdateSuccess = true;
  let response = [];
  let data = {
    RequestBody: {
      vendorRegistrationList: file.insert,
      tenantId: getTenantId()
    }
  };

  let updatedata = {
    RequestBody: {
      vendorRegistrationList: file.update,
      tenantId: getTenantId()
    }
  };

  try {
    store.dispatch(toggleSpinner());

    if (file.insert.length > 0) {
      let response = await httpRequest(
        "post",
        "/ec-services/vendor/_create",
        "",
        [],
        data
      );
      if (response.ResponseInfo.status !== 'Success') {
        isCreateSuccess = false;
      }
    }


    if (file.update.length > 0) {
      let updateresponse = await httpRequest(
        "post",
        "/ec-services/vendor/_update",
        "",
        [],
        updatedata
      );

      if (updateresponse.ResponseInfo.status !== 'Success') {
        isUpdateSuccess = false
      } else {
        response = updateresponse;
      }
    }
    store.dispatch(toggleSpinner());
    if (isUpdateSuccess || isCreateSuccess) {
      return { status: "success", message: response.responseInfo };
    } else {
      return { status: "fail", message: 'Error' };
    }
  } catch (error) {
    console.log("error", error);
  }
}

export const createCitizenBasedonMobileNumber = async (state, dispatch) => {
  let response = '';
  try {
    let payload = get(state.screenConfiguration.preparedFinalObject, "eChallan", []);
    let tenantId = getTenantId().length > 2 ? getTenantId().split('.')[0] : getTenantId()
    let User = {
      name: payload.violatorName,
      userName: payload.contactNumber,
      password: payload.contactNumber,
      dob: null,
      fatherOrHusbandName: payload.fatherName,
      mobileNumber: payload.contactNumber,
      active: true,
      tenantId: tenantId,
      permanentCity: getTenantId(),
      type: 'CITIZEN',
      permanentAddress: payload.address,
      correspondenceAddress: payload.address,
      roles: [
        {
          code: 'CITIZEN',
          name: 'CITIZEN',
          tenantId: tenantId
        }
      ]
    }
    response = await httpRequest("post", "/user/users/_createnovalidate", "", [], { User });
    if (response.responseInfo.status !== '') {
      return { status: "success", message: response.responseInfo };
    } else {
      return { status: "fail", message: response };
    }
  } catch (error) {
    //dispatch(toggleSnackbar(true, { labelName: error.message }, "error"));
    return { status: "fail", message: response };
  }

}

export const getUserDetailsOnMobile = async (role, mobileNumber) => {

  try {
    let payload = "";
    let tenantId = getTenantId().length > 2 ? getTenantId().split('.')[0] : getTenantId()

    const queryStr = {
      "tenantId": tenantId,
      "mobileNumber": mobileNumber
    }
    //http://192.168.12.114:8096/egov-hrms/employees/_search?roles=challanSM&tenantId=ch.chandigarh

    payload = await httpRequest(
      "post",
      "/user/_search",
      "",
      [],
      queryStr,
    );
    return payload;
    //}
  } catch (e) {
    console.log(e);
  }

};

export const approverejectAuctionDetails = async (state, dispatch, status) => {
  let response = '';
  try {
    let payload = get(state, "screenConfiguration.preparedFinalObject.auctionapproverejectlist", []);
    let challanObj = get(state.screenConfiguration.preparedFinalObject, "eChallanDetail[0]", []);

    let tenantId = getTenantId(); //.length > 2 ? getTenantId().split('.')[0] : getTenantId()
    let RequestBody = {
      status: status,
      challanId: challanObj.challanId,
      challanUuid: challanObj.challanUuid,
      tenantId: tenantId,
      auctionUuid: payload[0].auctionUuid,
      auctionList: payload
    }

    response = await httpRequest("post", "/ec-services/auction/_update", "", [], { RequestBody });

    if (response.ResponseInfo.status !== '') {
      return { status: "success", message: response.ResponseInfo };
    } else {
      return { status: "fail", message: response };
    }
  } catch (error) {
    //dispatch(toggleSnackbar(true, { labelName: error.message }, "error"));
    return { status: "fail", message: response };
  }

}

export const createUpdateGenerateChallanApplication = async (state, dispatch, status) => {
  let response = '';
  let response_updatestatus = '';
  let nocId = getapplicationNumber() === 'null' ? '' : getapplicationNumber();
  let method = nocId ? "UPDATE" : "CREATE";
  //let method = "CREATE";
  try {

    let payload = get(state.screenConfiguration.preparedFinalObject, "eChallan", []);
    let notificationTemplate = get(state, "screenConfiguration.preparedFinalObject.applyScreenMdmsData.egec.NotificationTemplate[0]", {});
    // let reduxDocuments = get(state, "screenConfiguration.preparedFinalObject.documentsUploadRedux", {});
    // let violationDocuments = get(state, "screenConfiguration.preparedFinalObject.violationDocuments", {});
    let violationItemList = [];

    // Set owners & other documents
    let ownerDocuments = [];
    let violatorsmedia = [];
    let Remarks = "";

    let violatorImage = get(state, "form.apply_Violator_Image.files.echallanViolaterImage", []);
    let violatorIdProofImage = get(state, "form.apply_Violator_ID_PROOF.files.echallanViolaterIDProofImage", []);
    let violationsImage = get(state, "form.apply_Violations_Image.files.echallanViolationImage", []);
    violatorImage.map((item, index) => {
      violatorsmedia.push({
        fileStoreId: item.fileStoreId,
        documentName: item.file.name || "",
        documentType: "ViolatorImage",
        tenantId: getTenantId(),
        isActive: true,
      });
    });

    violatorIdProofImage.map((item, index) => {
      violatorsmedia.push({
        fileStoreId: item.fileStoreId,
        documentName: item.file.name || "",
        documentType: "ViolatorIdProof",
        tenantId: getTenantId(),
        isActive: true,

      });
    });

    violationsImage.map((item, index) => {
      violatorsmedia.push({
        fileStoreId: item.fileStoreId,
        documentName: item.file.name || "",
        documentType: `violationDocuments - Document - ${index + 1}`,
        tenantId: getTenantId(),
        isActive: true,
      });
    });

    // jp.query(reduxDocuments, "$.*").forEach(doc => {
    //   if (doc.documents && doc.documents.length > 0) {
    //     if (doc.documentCode === "EC_VIOLATORIMAGE" || doc.documentCode === "ViolatorImage" || doc.documentCode === "imageofViolator") {
    //       ownerDocuments = [
    //         ...ownerDocuments,
    //         {
    //           fileStoreId: doc.documents[0].fileStoreId,
    //           documentName: doc.documents[0].fileName,
    //           documentType: doc.documentType === undefined ? doc.documentCode : doc.documentType,
    //           tenantId: getTenantId(),
    //           isActive: true,
    //         }
    //       ];
    //     }
    //     else if (doc.documentCode === "EC_VIOLATORIDPROOF" || doc.documentCode === "ViolatorIdProof" || doc.documentCode === "idProofofViolator") {
    //       ownerDocuments = [
    //         ...ownerDocuments,
    //         {
    //           fileStoreId: doc.documents[0].fileStoreId,
    //           documentName: doc.documents[0].fileName,
    //           documentType: doc.documentType === undefined ? doc.documentCode : doc.documentType,
    //           tenantId: getTenantId(),
    //           isActive: true,
    //         }
    //       ];
    //     }
    //   }
    // });
    // if (violationDocuments !== "") {
    //   jp.query(violationDocuments, "$.*").forEach(doc => {
    //     if (doc.documentType !== null) {
    //       ownerDocuments = [
    //         ...ownerDocuments,
    //         {
    //           fileStoreId: doc.fileStoreId,
    //           documentName: doc.fileName,
    //           documentType: "violationDocuments - " + doc.documentType,
    //           tenantId: getTenantId(),
    //           isActive: true,
    //         }
    //       ];

    //     }
    //   });
    // }
    //Set Violation List 
    /** This logic is used for creating the obj
     *  temp[0] = obj['ItemName'];
      temp[1] = obj['Other'] === undefined ? '' : obj['Other'];
      temp[2] = obj['SeizedQty'] === undefined ? '' : obj['SeizedQty'];
      temp[3] = obj['VehicleNumber'] === undefined ? '' : obj['VehicleNumber'];
      temp[4] = obj['Remark']  === undefined ? '' : obj['Remark'];
     
     */
    let articleSeizedGridDetails = get(state.screenConfiguration.preparedFinalObject, "articleSeizedGridDetails", []);

    if (articleSeizedGridDetails.length > 0) {
      articleSeizedGridDetails.forEach(doc => {
        violationItemList = [
          ...violationItemList,
          {
            itemType: payload.encroachmentType === 'Seizure of Vehicles' ? doc["Seized Article"] : '',
            itemName: payload.encroachmentType === 'Seizure of Vehicles' ? doc["Other Item"] : doc["Seized Article"] === 'Other' ? doc["Other Item"] : doc["Seized Article"],
            quantity: payload.encroachmentType === 'Seizure of Vehicles' ? 1 : doc["Quantity / Vehicle Type"],
            vehicleNumber: payload.encroachmentType === 'Seizure of Vehicles' ? doc["Vehicle Registration Number"] : '',
            remark: doc["Remarks"],
            isActive: true
          }
        ];

      })
    }

    setapplicationMode(status);
    // let violatorDate = new Date();
    // var month = violatorDate.getMonth() + 1 < 10 ? "0" + (violatorDate.getMonth() + 1) : violatorDate.getMonth() + 1;
    // var day = violatorDate.getDate() < 10 ? "0" + violatorDate.getDate() : violatorDate.getDate();
    // // violatorDate = "";
    // // violatorDate = day + "/" + month + "/"+ violatorDate.getFullYear();

    // set(payload, "violationDate", day + "/" + month + "/" + violatorDate.getFullYear());
    set(payload, "location", payload.latitude + ',' + payload.longitude);
    set(payload, 'siName', JSON.parse(getUserInfo()).name)
    set(payload, "document", violatorsmedia); //ownerDocuments);
    set(payload, "violationItem", violationItemList);
    set(payload, "remarks", Remarks);
    set(payload, 'status', getapplicationMode())
    set(payload, 'isActive', true);
    set(payload, 'tenantId', getTenantId())
    set(payload, 'paymentDetails', {})


    let message = notificationTemplate.message.replace('<EnchroachmentType>', payload.encroachmentType).replace('<Date and Time>', payload.violationDate + " " + payload.violationTime);
    let body = notificationTemplate.body.replace('<EnchroachmentType>', payload.encroachmentType).replace('<Date and Time>', payload.violationDate + " " + payload.violationTime);
    let modifiedNotificationTemplate = {};
    modifiedNotificationTemplate.email = payload.emailId;
    modifiedNotificationTemplate.subject = notificationTemplate.subject;
    modifiedNotificationTemplate.body = body;
    modifiedNotificationTemplate.attachmentUrls = null;
    modifiedNotificationTemplate.mobileNumber = payload.contactNumber;
    modifiedNotificationTemplate.message = message;
    modifiedNotificationTemplate.isHtml = notificationTemplate.isHtml;

    set(payload, 'notificationTemplate', modifiedNotificationTemplate)



    let responsecreateDemand = '';
    if (method === "CREATE") {
      //specially for calculating service
      dispatch(prepareFinalObject("eChallanFinalObj", payload));

      response = await httpRequest("post", "/ec-services/violation/_create", "", [], { requestBody: payload });

      if (response.ResponseBody.challanId !== 'null' || response.ResponseBody.challanId !== '') {
        dispatch(prepareFinalObject("eChallan", response.ResponseBody));
        setapplicationNumber(response.ResponseBody.challanId);
        setApplicationNumberBox(state, dispatch);
        //calculate service called

        // responsecreateDemand = await createDemandForAdvNOC(state, dispatch);
        // //calculate search Bill called
        // responsecreateDemand.Calculations[0].taxHeadEstimates[0].estimateAmount > 0 ?
        //   await searchBill(dispatch, response.challanId, getTenantId()) : '';

        return { status: "success", message: response.ResponseInfo, createDemand: responsecreateDemand };
      } else {

        if (response.Errors[0].message.message === 'Fine Data does not exist') {
          return { status: "fail", message: response.Errors[0].message.message, createDemand: responsecreateDemand };
        } else {
          return { status: "fail", message: response + "Submission Falied, Try Again later!", createDemand: responsecreateDemand };
        }
      }
    }
  } catch (error) {

    dispatch(toggleSnackbar(true, { labelName: error.message }, "error"));

    // Revert the changed pfo in case of request failure
    //let fireNocData = get(state, "screenConfiguration.preparedFinalObject.ADVERTISEMENTNOC", []);
    //fireNocData = furnishAdvertisementNocResponse({ FireNOCs: fireNocData });
    //dispatch(prepareFinalObject("ADVERTISEMENTNOC", fireNocData));
    return { status: "failure", message: error };
  }
};

export const sendPaymentReceiptOverMail = async (RequestBody) => {
  try {
    const response = await httpRequest(
      "post", "/ec-services/violation/_notify", "",
      [],
      { RequestBody }
    );
    return response;

  } catch (error) {
    store.dispatch(
      toggleSnackbar(
        true, { labelName: error.message, labelCode: error.message }, "error"
      )
    );
  }

}

//view
export const getSearchResultsView = async requestBody => {
  try {
    //
    const response = await httpRequest(
      "post", "/ec-services/violation/_get", "",
      [],
      { requestBody }
    );
    return response;
  } catch (error) {
    store.dispatch(
      toggleSnackbar(
        true, { labelName: error.message, labelCode: error.message }, "error"
      )
    );
  }
  //alert(JSON.stringify(response));
};

export const getSearchResultsForNocCretificate = async queryObject => {
  try {
    const response = await httpRequest("post", get(queryObject[3], "value"), "", [], get(queryObject[2], "value"));
    return response;
  } catch (error) {
    store.dispatch(
      toggleSnackbar(
        true,
        { labelName: error.message, labelCode: error.message },
        "error"
      )
    );
  }
  //alert(JSON.stringify(response));
};

export const getSearchResultsForNocCretificateDownload = async queryObject => {
  try {

    let filestoreIds = get(queryObject[2], "value");

    const response = await httpRequest(
      "get",
      get(queryObject[3], "value") + filestoreIds,
      "", [], "");
    return response;

  } catch (error) {
    //alert("rrrrr")
    store.dispatch(
      toggleSnackbar(
        true,
        { labelName: error.message, labelCode: error.message },
        "error"
      )
    );
  }
  //alert(JSON.stringify(response));
};

export const fetchVendorData = async () => {
  let data = {
    "RequestBody": {
      tenant_id: getTenantId(),
    }
  }
  try {
    const response = await httpRequest(
      "post",
      "/ec-services/vendor/_get",
      "",
      [],
      data
    );

    return response;

  } catch (error) {
    store.dispatch(
      toggleSnackbar(
        true,
        { labelName: error.message, labelCode: error.message },
        "error"
      )
    );
  }

};

export const UpdateChallanStatus = async (state, dispatch, status) => {

  let challanDetails = get(state, 'screenConfiguration.preparedFinalObject.eChallanDetail[0]', {});

  let method = challanDetails.challanUuid ? "UPDATE" : "CREATE";

  try {
    let data = {
      challanId: challanDetails.challanId,
      challanUuid: challanDetails.challanUuid,
      status: status,
      tenantId: getTenantId(),
    }

    let response;
    response = await httpRequest("post", "/ec-services/violation/_update", "", [], { requestBody: data });

    if (response.ResponseInfo.status !== '') {
      return { status: "success", message: response };
    } else {
      return { status: "fail", message: response };
    }


  } catch (error) {
    dispatch(toggleSnackbar(true, { labelName: error.message }, "error"));
    return { status: "failure", message: error };
  }
};

export const addToStoreViolationData = async (state, dispatch, status) => {
  try {

    let addStoreItemList = get(state, 'screenConfiguration.preparedFinalObject.eChallanSMSeizedList', {});
    let challanDetails = get(state, 'screenConfiguration.preparedFinalObject.eChallanDetail[0]', {});
    let storeItemDate = new Date();
    var month = storeItemDate.getMonth() + 1 < 10 ? "0" + (storeItemDate.getMonth() + 1) : storeItemDate.getMonth() + 1;
    var day = storeItemDate.getDate() < 10 ? "0" + storeItemDate.getDate() : storeItemDate.getDate();
    let storeItemDateprocess = day + "/" + month + "/" + storeItemDate.getFullYear();
    let violationsImage = get(state, "form.apply_Violations_Discrepancy_Image.files.echallanViolationDiscrepancyImage", []);

    let storeItemRegister = [];
    let payload = {};
    let file = [];

    violationsImage.map((item, index) => {
      file.push({
        fileStoreId: item.fileStoreId,
        documentName: item.file.name || "",
        documentType: `StoreManagerUpload - Document - ${index + 1}`,
        tenantId: getTenantId(),
        isActive: true,
      });
    });

    addStoreItemList.forEach(element => {
      payload = {
        tenantId: getTenantId(),
        isActive: true,
        itemUuid: "",
        itemName: element[0],
        damagedQuantity: element[4],
        quantity: element[1],
        isVerified: status,
        isAuctioned: false,
        remark: element[5],
        itemStoreDepositDate: storeItemDateprocess,
        violationItemUuid: element[6],
        violationUuid: element[7]
      }
      storeItemRegister.push(payload);
    });

    let data = {
      RequestBody: {
        challanId: challanDetails.challanId,
        challanUuid: challanDetails.challanUuid,
        status: "ADDED TO STORE",
        tenantId: getTenantId(),
        violationUuid: challanDetails.violationUuid,
        document: file,
        storeItemRegister
      }
    }
    const response = await httpRequest(
      "post",
      "/ec-services/storeitemregister/_create",
      "",
      [],
      data
    );
    if (response.ResponseInfo.status === 'success' || response.ResponseBody.status !== '') {
      return { status: "success", message: response };
    } else {
      return { status: "fail", message: response };
    }
  } catch (error) {
    console.log(error);
  }



}

export const addToStoreReturnCloseData = async (state, dispatch, status) => {
  try {
    let challanDetails = get(state, 'screenConfiguration.preparedFinalObject.eChallanDetail[0]', {});

    let data = {
      RequestBody: {
        challanId: challanDetails.challanId,
        challanUuid: challanDetails.challanUuid,
        status: "CLOSED",
        tenantId: getTenantId(),
      }
    }
    store.dispatch(toggleSpinner());
    const response = await httpRequest(
      "post",
      "/ec-services/storeitemregister/_update",
      "",
      [],
      data
    );
    store.dispatch(toggleSpinner());


    if (response.ResponseInfo.status === 'success' || response.ResponseBody.status !== '') {
      return { status: "success", message: response };
    } else {
      return { status: "fail", message: response };
    }

  } catch (error) {
    console.log(error);
  }



}


export const fetchReportData = async (data) => {
  try {
    const response = await httpRequest(
      "post",
      "/ec-services/report/_get",
      "",
      [],
      data
    );

    return response;

  } catch (error) {
    store.dispatch(
      toggleSnackbar(
        true,
        { labelName: error.message, labelCode: error.message },
        "error"
      )
    );
  }

};


export const fetchMdmsData = async (state, dispatch, mdmsBody, onlySector = false) => {
  try {

    let payload = null;
    payload = await httpRequest(
      "post",
      "/egov-mdms-service/v1/_search",
      "_search",
      [],
      mdmsBody
    );
    if (!onlySector) {
      dispatch(prepareFinalObject("applyScreenMdmsData", payload.MdmsRes));
    } else {
      dispatch(prepareFinalObject("applyScreenMdmsData.egec.sector", payload.MdmsRes.egec.sector));
    }
    console.log("MDMS Payload Response :", payload.MdmsRes);
  }
  catch (error) {
    store.dispatch(
      toggleSnackbar(
        true,
        { labelName: error.message, labelCode: error.message },
        "error"
      )
    );
  }

};

export const fetchSIName = async (state, dispatch, queryStr) => {
  try {

    let payload = null;

    payload = await httpRequest(
      "post",
      "/egov-hrms/employees/_search",
      "",
      queryStr,
      {}
    );
    console.log("resss", payload.MdmsRes);
    if (payload.ResponseInfo.status === 'successful') {
      let SINameList = [];
      payload.Employees.forEach(element => {
        let temp = {
          code: element.user.name,
          name: element.user.name
        }
        SINameList.push(temp);
      });

      dispatch(prepareFinalObject("applyScreenMdmsData.egec.SINameList", SINameList));
    }
  } catch (error) {
    store.dispatch(
      toggleSnackbar(
        true,
        { labelName: error.message, labelCode: error.message },
        "error"
      )
    );
  }

};
export const auctionCreateMasterChallanData = async (state, dispatch, data) => {
  // let data = {
  //   RequestBody
  // }

  try {
    const response = await httpRequest(
      "post",
      "/ec-services/auction/_create",
      "",
      [],
      { requestBody: data }
    );
    if (response.ResponseInfo.status === 'success' || response.ResponseInfo.status === 'Success') {
      return { status: "success", message: response.ResponseInfo };
    } else {
      return { status: "fail", message: response.ResponseInfo };
    }

    return response;

  } catch (error) {
    store.dispatch(
      toggleSnackbar(
        true,
        { labelName: error.message, labelCode: error.message },
        "error"
      )
    );
  }

};

export const fetchViewHistorytData = async (data) => {
  try {
    const response = await httpRequest(
      "post",
      "/ec-services/auction/_get",
      "",
      [],
      { requestBody: data }
    );

    return response;

  } catch (error) {
    store.dispatch(
      toggleSnackbar(
        true,
        { labelName: error.message, labelCode: error.message },
        "error"
      )
    );
  }

};

export const getDashboardChallanCount = async () => {
  try {

    let tenantId = getTenantId();
    let rolecode = fetchRoleCode(false, '');

    let RequestBody = {
      tenantId: tenantId,
      roleCode: rolecode

    };
    const response = await httpRequest(
      "post",
      "/ec-services/report/_getDashboard",
      "",
      [],
      { RequestBody }
    );

    return response;

  } catch (error) {
    store.dispatch(
      toggleSnackbar(
        true,
        { labelName: error.message, labelCode: error.message },
        "error"
      )
    );
  }

}

export const setCurrentApplicationProcessInstance = async (state, isPaymentCalled) => {
  try {
    let challanUuidForPayment = get(state, "screenConfiguration.preparedFinalObject.eChallanDetail[0].challanUuid", "");
    let applicationNumber = isPaymentCalled ? challanUuidForPayment : getQueryArg(
      window.location.href,
      "applicationNumber"
    );

    const tenantId = getQueryArg(window.location.href, "tenantId");
    const queryObject = [
      { key: "businessIds", value: applicationNumber },
      { key: "history", value: true },
      { key: "tenantId", value: tenantId }
    ];

    const payload = await httpRequest(
      "post",
      "egov-workflow-v2/egov-wf/process/_search",
      "",
      queryObject
    );
    if (payload && payload.ProcessInstances.length > 0) {
      if (!isPaymentCalled) {
        set(state, 'screenConfiguration.preparedFinalObject.ECHALLAN.WF.ProcessInstanceData', payload);
      } else {
        set(state, 'screenConfiguration.preparedFinalObject.ECHALLAN.WF.ProcessInstanceData.PaymentProcess', payload);
      }

    } else {
      toggleSnackbar(
        true,
        {
          labelName: "Workflow returned empty object !",
          labelKey: "WRR_WORKFLOW_ERROR"
        },
        "error"
      );
    }
  } catch (e) {
    toggleSnackbar(
      true,
      {
        labelName: "Workflow returned empty object !",
        labelKey: "WRR_WORKFLOW_ERROR"
      },
      "error"
    );
  }

}

export const checkVisibility = async (state, actions, button, action, buttonPath, extraCondtion) => {
  let processInstanceData = get(state, "screenConfiguration.preparedFinalObject.ECHALLAN.WF.ProcessInstanceData", []);

  if (processInstanceData.length != 0) {
    let currentState = extraCondtion ? processInstanceData.PaymentProcess.ProcessInstances[0] : processInstanceData.ProcessInstances[0];
    let found = false;
    let roles = JSON.parse(getUserInfo()).roles
    let buttonPresent = false;
    currentState.nextActions.map(item => {
      if (actions.split(',').indexOf(item.action) != -1) {
        roles.some(r => {
          if (item.roles.includes(r.code)) {
            found = true
            let wfstatus = get(state, "screenConfiguration.preparedFinalObject.WFStatus", [])
            if (wfstatus.length > 0) {
              let __FOUND = wfstatus.find(function (wfstatusRecord, index) {
                if (wfstatusRecord.buttonName == button) {
                  buttonPresent = true;
                  return true;
                }
              });
            }
            if (!buttonPresent) {
              wfstatus.push({ "buttonName": button, "status": item.action })
              set(state, 'screenConfiguration.preparedFinalObject.WFStatus', wfstatus);
            }
          }
        })
      }
    });
    // if (extraCondtion != null) {
    //   set(
    //     action,
    //     buttonPath,
    //     extraCondtion && found
    //   );
    // } else {
    set(
      action,
      buttonPath,
      found
    );
    //}
  }
}

