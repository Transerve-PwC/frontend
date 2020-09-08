
import { handleScreenConfigurationFieldChange as handleField, prepareFinalObject, toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getFileUrlFromAPI, getMultiUnits, getQueryArg, getTransformedLocale, setBusinessServiceDataToLocalStorage } from "egov-ui-framework/ui-utils/commons";
import { getapplicationNumber, seteventid, seteventuuid, getapplicationType, getTenantId, getUserInfo, setapplicationNumber, lSRemoveItemlocal, lSRemoveItem, localStorageGet, setapplicationMode, localStorageSet } from "egov-ui-kit/utils/localStorageUtils";
import jp from "jsonpath";
import get from "lodash/get";
import set from "lodash/set";
import store from "redux/store";
import { convertDateToEpoch, getCheckBoxJsonpath, getCurrentFinancialYear, getHygeneLevelJson, getLocalityHarmedJson, getSafetyNormsJson, getTradeTypeDropdownData, getTranslatedLabel, ifUserRoleExists, setFilteredTradeTypes, updateDropDowns, searchBill, createDemandForAdvNOC } from "../ui-config/screens/specs/utils";
import { httpRequest } from "./api";

import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import { toggleSpinner } from "egov-ui-framework/ui-redux/screen-configuration/actions";
//import store from "ui-redux/store";

import { ResendTenderInviteGrid } from '../ui-config/screens/specs/egov-pr/tenderResources/tenderDetails';
import {  getCommonHeader } from "egov-ui-framework/ui-config/screens/specs/utils";


const role_name = JSON.parse(getUserInfo()).roles[0].code


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

  let data = {
    "tenantId": getTenantId(),
    "applicationType": getapplicationType(),
    "applicationStatus": "INITIATED",
    "dataPayload": {
      "createdBy": JSON.parse(getUserInfo()).uuid,
      "applicationType": getapplicationType()
    }
  };
  try {
    const response = await httpRequest(
      "post",
      "/egov-opmsService/noc/_get",
      "",
      [],
      data
    );
    //alert(JSON.stringify(response));
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

//view
export const getSearchResultsView = async queryObject => {
  try {
    const response = await httpRequest(
      "post", "/egov-opmsService/noc/_view", "",
      [],
      {
        "tenantId": queryObject[0]["value"],
        "applicationId": queryObject[1]["value"],
        "applicationType": getapplicationType(),
        "dataPayload": {
          "createdBy": "65a14e00-ba5e-4347-be81-08fc04bb0529",
          "applicationType": getapplicationType()
        }
      }
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



export const prepareDocumentsUploadData = (state, dispatch, type) => {
  let documents = '';

  if (type == "create_tender") {
    documents = get(
      state,
      "screenConfiguration.preparedFinalObject.applyScreenMdmsData[RAINMAKER-PR].tenderDocuments",
      []
    );
  }
  else if (type == "create_event") {
    // screenConfiguration.preparedFinalObject.applyScreenMdmsData[""RAINMAKER-PR""].eventDocuments
    documents = get(
      state,
      "screenConfiguration.preparedFinalObject.applyScreenMdmsData[RAINMAKER-PR].eventDocuments",
      []
    );
  }
  else if (type == "create_pressnote") {
    // screenConfiguration.preparedFinalObject.applyScreenMdmsData[""RAINMAKER-PR""].eventDocuments
    documents = get(
      state,
      "screenConfiguration.preparedFinalObject.applyScreenMdmsData[RAINMAKER-PR].pressnoteDocuments",
      []
    );
  }
  else {
    documents = get(
      state,
      "screenConfiguration.preparedFinalObject.applyScreenMdmsData.RAINMAKER-PR.eventDocuments",
      []
    );
  }

  documents = documents.filter(item => {
    return item.active;
  });
  let documentsContract = [];
  let tempDoc = {};
  documents.forEach(doc => {
    let card = {};
    card["code"] = doc.documentType;
    card["title"] = doc.documentType;
    card["cards"] = [];
    tempDoc[doc.documentType] = card;
  });

  documents.forEach(doc => {
    // Handle the case for multiple muildings

    if (doc.code === "EVENT.EVENT_FILE_DOCUMENT" && doc.hasMultipleRows && doc.options) {

      let buildingsData = get(state,
        "screenConfiguration.preparedFinalObject.applyScreenMdmsData.RAINMAKER-PR.eventDocuments",
        []
      );


      buildingsData.forEach(building => {
        let card = {};
        card["name"] = building.name;
        card["code"] = doc.code;
        card["hasSubCards"] = true;
        card["subCards"] = [];
        doc.options.forEach(subDoc => {
          let subCard = {};
          subCard["name"] = subDoc.code;
          subCard["required"] = subDoc.required ? true : false;
          card.subCards.push(subCard);
        });
        tempDoc[doc.documentType].cards.push(card);
      });
      // let reduxDocuments = {};
      // previewdocu = get(state, "screenConfiguration.preparedFinalObject.nocApplicationDetail", {});
      // if(!previewdocu) {
      //   reduxDocuments = previewdocu;
      // } else  {      
      //   reduxDocuments = get(state, "screenConfiguration.preparedFinalObject.documentsUploadRedux", {});
      // }

    }

    else {
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
    }
  });

  Object.keys(tempDoc).forEach(key => {
    documentsContract.push(tempDoc[key]);
  });

  dispatch(prepareFinalObject("documentsContract", documentsContract));
};


export const createUpdateEvent = async (state, dispatch, status) => {
  dispatch(toggleSpinner());
  let response = '';
  let response_updatestatus = '';
  let uuId = getQueryArg(window.location.href, "eventuuId") === 'null' ? '' : getQueryArg(window.location.href, "eventuuId") // get(state, "screenConfiguration.preparedFinalObject.PRSCP.applicationId");

  let method = "CREATE";
  try {
    let data = []
    let payload = get(state.screenConfiguration.preparedFinalObject, "PublicRelation[0].CreateEventDetails", []);

    let reduxDocuments = get(state, "screenConfiguration.preparedFinalObject.EventDocuments", {});

    console.log("reduxDocuments");
    console.log(reduxDocuments);

    // Set owners & other documents
    let event_documents = [];
    let ownerDocuments = [];
    let otherDocuments = [];
    let Remarks = "";
    let startdate1 = get(state, "screenConfiguration.preparedFinalObject.PublicRelation[0].CreateEventDetails.startDate1")
    let endDate1 = get(state, "screenConfiguration.preparedFinalObject.PublicRelation[0].CreateEventDetails.endDate1")

    startdate1 = startdate1.split('-')
    endDate1 = endDate1.split('-')

    let area = get(state, "screenConfiguration.preparedFinalObject.PublicRelation[0].CreateEventDetails.area")
    let sector = get(state, "screenConfiguration.preparedFinalObject.PublicRelation[0].CreateEventDetails.sector")
    let typeofevent = get(state, "screenConfiguration.preparedFinalObject.PublicRelation[0].CreateEventDetails.eventType")
    let organizerDepartmentName = get(
      state.screenConfiguration.preparedFinalObject,
      "PublicRelation[0].CreateEventDetails.organizerDepartmentName",

    );
    let organizerUsernName = get(
      state.screenConfiguration.preparedFinalObject,
      "PublicRelation[0].CreateEventDetails.organizerUsernName",

    );

    let committeeUuid = get(
      state.screenConfiguration.preparedFinalObject,
      "PublicRelation[0].CreateEventDetails.committeeUuid",

    );
    
    let moduleCode = localStorageGet("modulecode")
    set(payload, "eventStatus", "PUBLISHED");
    set(payload, "startDate", startdate1[2] + '/' + startdate1[1] + '/' + startdate1[0]);
    set(payload, "endDate", endDate1[2] + '/' + endDate1[1] + '/' + endDate1[0]);
    set(payload, "tenantId", getTenantId());
    set(payload, "moduleCode", moduleCode);
    set(payload, "area", area.label);
    payload.hasOwnProperty("sector") === false ? '' : set(payload, "sector", sector.label);


    set(payload, "eventType", typeofevent.label);
    set(payload, "organizerDepartmentName", organizerDepartmentName.value);
    set(payload, "organizerUsernName", organizerUsernName === undefined ? "" : organizerUsernName.label === "Select Organizer Employee" ? "" : organizerUsernName.label);
    payload.hasOwnProperty("committeeUuid") === false ? '' :set(payload, "committeeUuid", committeeUuid === undefined ? "" : committeeUuid.value === "Select Organizer Employee" ? "" : committeeUuid.value);

    jp.query(reduxDocuments, "$.*").forEach(doc => {
      if (doc.documents && doc.documents.length > 0) {
        if (doc.documentCode === "EVENT.EVENT_FILE_DOCUMENT") {
          ownerDocuments = [
            ...ownerDocuments,
            {

              fileStoreId: doc.documents[0].fileStoreId
            }
          ];
        } else if (!doc.documentSubCode) {

          otherDocuments = [
            ...otherDocuments,
            {

              fileStoreId: doc.documents[0].fileStoreId
            }
          ];
        }
      }
      else {
        let temp = { "fileStoreId": doc.fileStoreId, "fileName:": doc.fileName }
        event_documents.push(temp)
      }
    });


    set(payload, "eventImage", event_documents);

    console.log('payload : ', payload)
    setapplicationMode(status);

    if (uuId === '' || uuId === null) {
      response = await httpRequest("post", "/prscp-services/v1/event/_create", "", [], { requestBody: payload });
      console.log('event response : ', response)


      if (response.ResponseBody.eventDetailUuid !== 'null' || response.ResponseBody.eventDetailUuid !== '') {
        dispatch(prepareFinalObject("EVENT", response));
        dispatch(prepareFinalObject("PublicRelation[0].CreateEventDetails", {}));
        dispatch(prepareFinalObject("EventDocuments", []));

        setApplicationNumberBox(state, dispatch);
        if (response.ResponseInfo.status == "success" || response.ResponseInfo.status == "Success") {
          dispatch(toggleSpinner());
          return { status: "success", message: "Event created successfully" };
        }
      } else {
        dispatch(toggleSpinner());
        return { status: "fail", message: response };
      }
    } else {

      set(payload, "eventDetailUuid", uuId);
      response = await httpRequest("post", "/prscp-services/v1/event/_update", "", [], { requestBody: payload });
      dispatch(prepareFinalObject("EVENT", response));
      dispatch(prepareFinalObject("EventDocuments", []));
      dispatch(prepareFinalObject("PublicRelation[0].CreateEventDetails", {}));
      if (response.ResponseInfo.status == "success" || response.ResponseInfo.status == "Success") {
        dispatch(toggleSpinner());
        return { status: "success", message: "Event updated successfully" };
      }
      else {
        dispatch(toggleSpinner());
        return { status: "fail", message: response };
      }
      //   }
      //  return { status: "success", message: response };
    }

  } catch (error) {
    dispatch(toggleSpinner());
    dispatch(toggleSnackbar(true, { labelName: error.message }, "error"));

    // Revert the changed pfo in case of request failure
    let PublicRelationData = get(
      state,
      "screenConfiguration.preparedFinalObject.PRSCP",
      []
    );
    dispatch(prepareFinalObject("PRSCP", PublicRelationData));

    return { status: "failure", message: error };
  }
};


// export const setDocsForEditFlow = async (state, dispatch) => {

//   const applicationDocuments = get(
//     state.screenConfiguration.preparedFinalObject,
//     "SELLMEATNOC.uploadDocuments",
//     []
//   );
//   let uploadedDocuments = {};
//   let fileStoreIds =
//     applicationDocuments &&
//     applicationDocuments.map(item => item.fileStoreId).join(",");
//   const fileUrlPayload =
//     fileStoreIds && (await getFileUrlFromAPI(fileStoreIds));
//   applicationDocuments &&
//     applicationDocuments.forEach((item, index) => {
//       uploadedDocuments[index] = [
//         {
//           fileName:
//             (fileUrlPayload &&
//               fileUrlPayload[item.fileStoreId] &&
//               decodeURIComponent(
//                 fileUrlPayload[item.fileStoreId]
//                   .split(",")[0]
//                   .split("?")[0]
//                   .split("/")
//                   .pop()
//                   .slice(13)
//               )) ||
//             `Document - ${index + 1}`,
//           fileStoreId: item.fileStoreId,
//           fileUrl: Object.values(fileUrlPayload)[index],
//           documentType: item.documentType,
//           tenantId: item.tenantId,
//           id: item.id
//         }
//       ];
//     });
//   dispatch(
//     prepareFinalObject("SELLMEAT.uploadedDocsInRedux", uploadedDocuments)
//   );
// };



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

  console.log("Id file valid");

  console.log(acceptedFiles)
  const mimeType = file["type"];
  console.log("mimeType");
  console.log(mimeType)
  console.log(file);
  return (
    (mimeType &&
      acceptedFiles &&
      acceptedFiles.indexOf(mimeType.split("/")[1]) > -1) ||
    false
  );
};

export const furnishResponsePressNote = response => {
  let refurnishresponse = {};

  if (response.ResponseBody[0] !== null && response.ResponseBody[0] !== '') {

    set(refurnishresponse, "date", response.ResponseBody[0].pressNoteDate);
    set(refurnishresponse, "fileNumber", response.ResponseBody[0].fileNumber);

    set(refurnishresponse, "pressSubject", response.ResponseBody[0].pressNoteSubject);
    set(refurnishresponse, "pressnote", response.ResponseBody[0].pressNoteUuid);
    set(refurnishresponse, "emailsubject", response.ResponseBody[0].emailContent[0].emailSubject);
    set(refurnishresponse, "emailbody", response.ResponseBody[0].emailContent[0].emailBody);
    set(refurnishresponse, "smscontent", response.ResponseBody[0].smsContent);

    localStorageSet("pressnote", response.ResponseBody[0].noteContent);
    return refurnishresponse;
  }
};
export const furnishResponse = response => {
  // Handle applicant ownership dependent dropdowns
  let refurnishresponse = {};


  if (response.ResponseBody[0] !== null && response.ResponseBody[0] !== '') {
    let startdate = response.ResponseBody[0].startDate
    startdate = startdate.split(' ');
    let enddate = response.ResponseBody[0].endDate
    enddate = enddate.split(' ');
    let starttime = response.ResponseBody[0].startTime

    let endtime = response.ResponseBody[0].endTime




    set(refurnishresponse, "eventTitle", response.ResponseBody[0].eventTitle);
    set(refurnishresponse, "eventLocation", response.ResponseBody[0].eventLocation);

    set(refurnishresponse, "sector", { value: "", label: response.ResponseBody[0].sector });
    set(refurnishresponse, "organizerDepartmentName", { value: response.ResponseBody[0].organizerDepartmentName, label: response.ResponseBody[0].EmpName });

    set(refurnishresponse, "organizerUsernName", { value: "", label: response.ResponseBody[0].organizerUsernName });
    set(refurnishresponse, "eventType", { value: "", label: response.ResponseBody[0].eventType });
    set(refurnishresponse, "eventBudget", response.ResponseBody[0].eventBudget);
    set(refurnishresponse, "committeeUuid",     { value:response.ResponseBody[0].committeeUuid, label: response.ResponseBody[0].committeeName }    );
    set(refurnishresponse, "eventDescription", response.ResponseBody[0].eventDescription);
    set(refurnishresponse, "area", { value: "", label: response.ResponseBody[0].area });

    set(refurnishresponse, "startDate1", startdate[0]);


    set(refurnishresponse, "endDate1", enddate[0]);
    set(refurnishresponse, "startTime", starttime);
    set(refurnishresponse, "endTime", endtime);
    set(refurnishresponse, "facebookUrl", response.ResponseBody[0].facebookUrl);
    set(refurnishresponse, "twitterUrl", response.ResponseBody[0].twitterUrl);

    set(refurnishresponse, "instagramUrl", response.ResponseBody[0].instagramUrl);

    set(refurnishresponse, "eventId", response.ResponseBody[0].eventId);

    set(refurnishresponse, "status", response.ResponseBody[0].status);

    return refurnishresponse;
  }
};

export const furnishSellMeatNocResponse = response => {
  // Handle applicant ownership dependent dropdowns
  let refurnishresponse = {};

  let applicationdetail = response.nocApplicationDetail[0].applicationdetail.length > 0 ? JSON.parse(response.nocApplicationDetail[0].applicationdetail) : '';

  set(refurnishresponse, "applicantName", response.nocApplicationDetail[0].applicantname);
  set(refurnishresponse, "houseNo", response.nocApplicationDetail[0].housenumber);
  set(refurnishresponse, "sector", response.nocApplicationDetail[0].sector);

  set(refurnishresponse, "fatherHusbandName", applicationdetail.fatherHusbandName);
  set(refurnishresponse, "division", applicationdetail.division);
  set(refurnishresponse, "shopNumber", applicationdetail.shopNumber);
  set(refurnishresponse, "ward", applicationdetail.ward);
  set(refurnishresponse, "nocSought", applicationdetail.nocSought);

  set(refurnishresponse, "uploadDocuments", applicationdetail.uploadDocuments);
  set(refurnishresponse, "remarks", applicationdetail.remarks);

  return refurnishresponse;
};




export const setApplicationNumberBox = (state, dispatch) => {

  let applicationNumber = get(state, "state.screenConfiguration.preparedFinalObject.PRSCP.applicationId", null);

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



export const getEventGridData = async () => {

  let queryObject = [];
  var data = {
    "tenantId": `${getTenantId()}`,
    "RequestBody": {
      "tenantId": `${getTenantId()}`,
      "eventDetailUuid": "",
      "scheduledStatus": "",
      "eventStatus": "",
      "moduleCode": localStorageGet("modulecode"),
      "defaultGrid": true
    }

  }

  try {
    const payload = await httpRequest(
      "post",
      "/prscp-services/v1/event/_get",
      "",
      queryObject,
      data
    );
    return payload;
  } catch (error) {
  }

};

export const getLibraryGridData = async () => {

  let queryObject = [];
  var data = {
    "tenantId": `${getTenantId()}`,
    "RequestBody": {
      "tenantId": `${getTenantId()}`,
      "eventDetailUuid": "",
      "status": "EXPIRED",
      "eventStatus": "PUBLISHED",
      "defaultGrid": true,
      "moduleCode": localStorageGet("modulecode")
    }

  }

  try {
    const payload = await httpRequest(
      "post",
      "/prscp-services/v1/event/_get",
      "",
      queryObject,
      data
    );
    return payload;
  } catch (error) {
  }

};
export const getPressNoteGridData = async () => {

  let queryObject = [];
  var data = {
    "tenantId": `${getTenantId()}`,


    "RequestBody": {
      "tenantId": `${getTenantId()}`,
      "pressNoteUuid": getQueryArg(window.location.href, "pressnoteuuId"),

      "defaultGrid": true,
      "moduleCode": localStorageGet("modulecode")
    }

  }

  try {
    const payload = await httpRequest(
      "post",
      "/prscp-services/v1/pressnote/_get",
      "",
      queryObject,
      data
    );
    return payload;
  } catch (error) {
  }

};
export const getInviteGuestGridData = async () => {

  let queryObject = [];
  var requestBody = {
    "tenantId": `${getTenantId()}`,
    "applicationType": 'PRSCP',

    "dataPayload": {
      "applicationType": 'PRSCP',
      "applicationStatus": JSON.parse(getUserInfo()).roles[0].code == 'SI' ? 'INITIATED,REASSIGNTOSI,PAID,RESENT' : JSON.parse(getUserInfo()).roles[0].code == "MOH" ? 'FORWARD' : ''

    }

  }

  try {
    const payload = await httpRequest(
      "post",
      "/pm-services/noc/_get",
      "",
      queryObject,
      requestBody
    );
    return payload;
  } catch (error) {
  }




};

export const getTenderGridData = async () => {


  let queryObject = [];


  let requestBody = {
    "RequestBody": {
      "tenantId": getTenantId(),
      "moduleCode": localStorageGet("modulecode"),
      "tenderNoticeUuid": "",
      "tenderNoticeStatus": "CREATED",
    }
  }
  try {
    const payload = await httpRequest(
      "post",
      "/prscp-services/v1/tender/_get",
      "",
      queryObject,
      requestBody
    );
    return payload;
  } catch (error) {
  }
};

export const getBillingGrid = async () => {

  let queryObject = [];
  let requestBody = {
    "RequestBody": {
      "tenantId": getTenantId(),
      "tenderNoticeUuid": "",
      "tenderNoticeStatus": "FORWARD",
    }
  }

  try {
    const payload = await httpRequest(
      "post",
      "/prscp-services/v1/tender/_get",
      "",
      queryObject,
      requestBody
    );
    return payload;
  } catch (error) {
  }
};

export const getPublishTenderGrid = async (status) => {

  let queryObject = [];
  let requestBody = {
    "RequestBody": {
      "tenantId": getTenantId(),
      "moduleCode": localStorageGet("modulecode"),
      "tenderNoticeUuid": "",
      "tenderNoticeStatus":status
    }
  }

  try {
    const payload = await httpRequest(
      "post",
      "prscp-services/v1/tender/_get",
      "",
      queryObject,
      requestBody
    );
    return payload;
  } catch (error) {
  }
};


export const UpdateMasterTender = async (dispatch, data) => {

  try {
    const response = await httpRequest(
      "post",
      "/prscp-services/v1/tender/_update",
      "",
      [],
      data
    );

    dispatch(prepareFinalObject("tenderNotice", {}));
    dispatch(prepareFinalObject("documentsUploadRedux[0]", {}));

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
//craeteMaterDtat
export const createMasterTender = async (dispatch, data) => {
  dispatch(toggleSpinner());
  try {
    const response = await httpRequest(
      "post",
      "/prscp-services/v1/tender/_create",
      "",
      [],
      data
    );
    //alert(JSON.stringify(response));
    dispatch(prepareFinalObject("tenderNotice", {}));
    dispatch(prepareFinalObject("documentsUploadRedux[0]", {}));

    return response;

  } catch (error) {
    dispatch(toggleSpinner());
    store.dispatch(
      toggleSnackbar(
        true,
        { labelName: error.message, labelCode: error.message },
        "error"
      )
    );
  }

};

export const forwardMasterTender = async data => {

  try {
    const response = await httpRequest(
      "post",
      "/prscp-services/v1/tender/_forward",
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



//craeteMaterDtat
export const getCommittiee = async data => {


  try {
    const response = await httpRequest(
      "post",
      "/prscp-services/v1/committee/_get",
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
export const getSearchResultsViewEvent = async data => {


  try {
    const response = await httpRequest(
      "post",
      "/prscp-services/v1/event/_get",
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
export const getSearchResultsViewPressnotedata = async data => {


  try {
    const response = await httpRequest(
      "post",
      "/prscp-services/v1/pressnote/_get",
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
export const getSearchResultsViewLI = async data => {


  try {
    const response = await httpRequest(
      "post",
      "/prscp-services/v1/library/_get",
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

export const getSearchResultsForTenderSummary = async data => {
  try {

    const response = await httpRequest(
      "post",
      "/prscp-services/v1/tender/_get",
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


// Get InviteeeList of a event  grid data
export const getEventeelistGridData = async () => {

  let queryObject = [];
  var data = {
    "tenantId": `${getTenantId()}`,
    "RequestBody": {
      "tenantId": `${getTenantId()}`,
      "eventDetailUuid": localStorageGet("eventifforinvitatoin"),
      "moduleCode": localStorageGet("modulecode"),
      "createdBy": "",
      "sentFlag": "false",

    }

  }

  try {
    const payload = await httpRequest(
      "post",
      "/prscp-services/v1/invitation/guest/_get",
      "",
      queryObject,
      data
    );
    return payload;
  } catch (error) {

  }

};



// Get Sample Email Template

// Get InviteeeList of a event  grid data
export const getsampleemailtemplate = async (action, state, dispatch) => {

  let queryObject = [];
  var data = {
    "tenantId": `${getTenantId()}`,
    "RequestBody": {
      "tenantId": `${getTenantId()}`,
      "templateMappedUuid": localStorageGet("templateMappedUuid"),
      "moduleCode": localStorageGet("modulecode"),
      "templateType": localStorageGet("templateType"),
      "moduleName": localStorageGet("templateModuleName")
    }

  }
  try {
    const payload = await httpRequest(
      "post",
      "/prscp-services/v1/template/_gettemplate",
      "",
      queryObject,
      data
    );

    let resultdata = JSON.parse(payload.ResponseBody.emailContent);
// alert(  get(state.screenConfiguration.preparedFinalObject, "pressnote.SMSContent")
// )
//pressnote.SMSContent
    localStorageSet("EmailTemplate", resultdata[0].emailBody)
    // if(localStorageGet("EmailTemplate")===null)
    // {
    localStorageSet("EmailTemplatesubject", resultdata[0].emailSubject)
  //  }
    if(localStorageGet("sms")===null)
    {
      localStorageSet("smsTemplate", payload.ResponseBody.smsContent)
      
    }
    localStorageSet("email", resultdata[0].emailBody)
    if(localStorageGet("sms")===null)
    {
    localStorageSet("sms", payload.ResponseBody.smsContent)
    }
    localStorageSet("EmaildAttachment", payload.ResponseBody.setdoc)

    return payload;
  } catch (error) {
  }

};

//  Send Invitation to Selected guests   
export const invitationtoguests = async (state, dispatch) => {
  let subject1 = get(state.screenConfiguration.preparedFinalObject, "CreateInvite.subjectemail")
  // Get all documents from response
  if (subject1 !== undefined && subject1 !== "") {
    let attachmentid = '';
    attachmentid = get(state, "screenConfiguration.preparedFinalObject.documentsUploadRedux[0].documents[0].fileStoreId",
      ""
    );

    let queryObject = [];

    var data = {
      "tenantId": `${getTenantId()}`,
      "RequestBody": {
        "tenantId": `${getTenantId()}`,
        "eventDetailUuid": localStorageGet("eventifforinvitatoin"),
        "moduleCode": localStorageGet("modulecode"),
        "templateType": "CREATE_EVENT",
        "smsContent": get(state.screenConfiguration.preparedFinalObject, "CreateInvite.SMSContent"),
        "emailContent": [
          {
            "emailSubject": get(state.screenConfiguration.preparedFinalObject, "CreateInvite.subjectemail"),
            "emailBody": localStorage.getItem('email')
          }
        ],
        "documentAttachment": [
          {
            "fileStoreId": attachmentid
          }
        ]



      }

    }

    try {
      const payload = await httpRequest(
        "post",
        "/prscp-services/v1/invitation/_send",
        "",
        queryObject,
        data
      );

      console.log("Sampleeeeeeeeeeeeeeeeee");
      console.log(payload);

      if (payload.ResponseInfo.status === "Success") {
        dispatch(prepareFinalObject("documentsUploadRedux", {}));

        dispatch(toggleSnackbar(
          true,
          { labelName: 'Invitation sent successfully', labelCode: 'INVITATION_SUCCESS' },
          "success"
        ));

        setTimeout(function () {


          dispatch(setRoute("/egov-pr/eventList"));
          //window.location = "/egov-pr/eventList"; 
        }, 700);
      }

      return payload;
    } catch (error) {
      //  store.dispatch(toggleSnackbar(true, error.message, "error"));
    }
  } else {
    dispatch(
      toggleSnackbar(
        true,
        { labelName: "Please fill subject field!", labelKey: "PR_SUBJECT_FIELD_MANDATORY" },
        "warning"
      )
    );



  }
};

export const createPressmaster = async (state, dispatch, data) => {
  dispatch(toggleSpinner());

  try {

    const response = await httpRequest(
      "post",
      "/prscp-services/v1/press/_create",
      "",
      [],
      data
    );


    if (response.ResponseInfo.status == "success" || response.ResponseInfo.status == "Success") {
      dispatch(toggleSpinner());

      store.dispatch(
        toggleSnackbar(
          true,
          { labelName: 'Press created successfully.', labelCode: 'PR_CREATE_PRESS_MSG' },
          "success"
        ));

      dispatch(prepareFinalObject("PRESSDETAILS", {}));

      setTimeout(function () { dispatch(setRoute(`masterSubMenu`)); }, 700);


      return response
    }
    else {
      dispatch(toggleSpinner());

      dispatch(toggleSnackbar(true, response.ResponseInfo.msgId, "warning"));

    }

  } catch (error) {
    dispatch(toggleSpinner());
    store.dispatch(
      toggleSnackbar(
        true,
        { labelName: error.message, labelCode: error.message },
        "error"
      )
    );
  }

};

export const createPressNote = async (dispatch, data) => {
  dispatch(toggleSpinner());
  try {

    const response = await httpRequest(
      "post",
      "/prscp-services/v1/pressnote/_create",
      "",
      [],
      data
    );

    if (response.ResponseInfo.status == "success" || response.ResponseInfo.status == "Success") {
      dispatch(toggleSpinner());
      store.dispatch(
        toggleSnackbar(
          true,
          { labelName: 'Press note created successfully.', labelCode: 'PR_GEN_PRESS_MSG' },
          "success"
        ));

      dispatch(prepareFinalObject("pressnote", {}));
      dispatch(prepareFinalObject("documentsUploadRedux[0]", {}));

      dispatch(setRoute(`pressnotesHome`))
      return response
    }
    else {
      dispatch(toggleSpinner());
      dispatch(toggleSnackbar(true, response.ResponseInfo.msgId, "warning"));

    }

  } catch (error) {
    dispatch(toggleSpinner());
    store.dispatch(
      toggleSnackbar(
        true,
        { labelName: error.message, labelCode: error.message },
        "error"
      )
    );
  }

};
export const publishTenderNotice = async (dispatch, data) => {
  try {

    const response = await httpRequest(
      "post",
      "/prscp-services/v1/tender/_publish",
      "",
      [],
      data
    );

    if (response.ResponseInfo.status == "success" || response.ResponseInfo.status == "Success") {
      store.dispatch(
        toggleSnackbar(
          true,
          { labelName: 'Tender published successfully.', labelCode: 'PR_PUBLISH_TENDER_MSG' },
          "success"
        ));

      dispatch(setRoute(`TenderSearch`))
      return response
    }
    else {
      dispatch(toggleSnackbar(true, response.ResponseInfo.msgId, "warning"));

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


export const updatePressNote = async (dispatch, data) => {
  try {

    const response = await httpRequest(
      "post",
      "/prscp-services/v1/pressnote/_update",
      "",
      [],
      data
    );

    if (response.ResponseInfo.status == "success" || response.ResponseInfo.status == "Success") {
      store.dispatch(
        toggleSnackbar(
          true,
          { labelName: 'Press note updated successfully.', labelCode: 'PR_UPDATE_GEN_PRESS_MSG' },
          "success"
        ));
      dispatch(prepareFinalObject("pressnote", {}));
      dispatch(prepareFinalObject("documentsUploadRedux[0]", {}));

      dispatch(setRoute(`pressNoteList`))
      return response
    }
    else {
      dispatch(toggleSnackbar(true, response.ResponseInfo.msgId, "warning"));
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






export const updatePressmaster = async (dispatch, data) => {
  try {

    const response = await httpRequest(
      "post",
      "/prscp-services/v1/press/_update",
      "",
      [],
      data
    );

    if (response.ResponseInfo.status == "success" || response.ResponseInfo.status == "Success") {
      store.dispatch(
        toggleSnackbar(
          true,
          { labelName: 'Press updated successfully.', labelCode: 'PR_UPDATE_PRESS_MSG' },
          "success"
        ));
      dispatch(prepareFinalObject("PRESSDETAILS", {}));
      setTimeout(function () { dispatch(setRoute(`masterSubMenu`)); }, 700);

      return response
    }
    else {
      dispatch(toggleSnackbar(true, response.ResponseInfo.msgId, "warning"));

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

export const deletePressmaster = async (dispatch, data) => {
  try {
    //  
    const response = await httpRequest(
      "post",
      "/prscp-services/v1/press/_delete",
      "",
      [],
      data
    );

    if (response.ResponseInfo.status == "success" || response.ResponseInfo.status == "Success") {
      store.dispatch(
        toggleSnackbar(
          true,
          { labelName: 'Press deleted successfully.', labelCode: 'PR_DELETE_PRESS_MSG' },
          "success"
        ));
      dispatch(setRoute(`pressGrid`))
      return response
    }
    else {
      dispatch(toggleSnackbar(true, response.ResponseInfo.msgId, "warning"));

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





export const getPressMasterGridData1 = async data => {
  try {
    let data = {
      "requestBody": {
        "tenantId": getTenantId(),
        "pressMasterUuid": "",
        "moduleCode": localStorageGet("modulecode"),

      }
    }
    const response = await httpRequest(
      "post",
      "/prscp-services/v1/press/_get",
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


export const getPressMasterSearchResultsViewMain = async data => {


  try {
    const response = await httpRequest(
      "post",
      "/prscp-services/v1/press/_get",
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



export const furnishNocResponse_PressMaster = response => {
  // Handle applicant ownership dependent dropdowns
  let refurnishresponse = {};

  if (response.ResponseBody[0] !== null && response.ResponseBody[0] !== '') {

    set(refurnishresponse, "name", response.ResponseBody[0].personnelName);
    //set(refurnishresponse,"typeOfThePress", response.ResponseBody[0].pressType);
    set(refurnishresponse, "typeOfThePress", { value: "", label: response.ResponseBody[0].pressType });
    set(refurnishresponse, "publicationName", response.ResponseBody[0].publicationName);

    set(refurnishresponse, "emailId", response.ResponseBody[0].email);
    set(refurnishresponse, "mobileNo", response.ResponseBody[0].mobile);

    return refurnishresponse;
  }
};

export const getSearchResultsTender = async queryObject => {
  let tenantId = getTenantId();
  let data = {
    "RequestBody": {
      "tenantId": tenantId,
      "moduleCode": localStorageGet("modulecode"),
      "tenderNoticeStatus": "FORWARD",
      "tenderNoticeUuid": "390f31e1-6fca-469f-97a6-e2a3d0d4c724",
      "tenderNoticeId": "PMS-2020-04-20-044442"
    }
  };
  try {

    const response = await httpRequest(
      "post",
      "/prscp-services/v1/tender/_get",
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

export const furnishResponseTender = response => {
  // Handle applicant ownership dependent dropdowns
  let refurnishresponse = {};

  if (response.ResponseBody[0] !== null && response.ResponseBody[0] !== '') {
    let startdate = response.ResponseBody[0].tenderDate
    startdate = startdate.split(' ');

    set(refurnishresponse, "tenderDate", startdate);
    set(refurnishresponse, "fileNumber", response.ResponseBody[0].fileNumber);

    set(refurnishresponse, "tenderSubject", response.ResponseBody[0].tenderSubject);
    set(refurnishresponse, "noteContent", response.ResponseBody[0].noteContent);

    localStorageSet('tendernote', response.ResponseBody[0].noteContent)
    return refurnishresponse;
  }
};







export const createCommitteemaster = async (dispatch, data) => {
  try {

    const response = await httpRequest(
      "post",
      "/prscp-services/v1/committee/_create",
      "",
      [],
      data
    );

    if (response.ResponseInfo.status == "success" || response.ResponseInfo.status == "Success") {
      store.dispatch(
        toggleSnackbar(
          true,
          { labelName: 'Committee created successfully.', labelCode: 'PR_CREATE_COMMITTEE_MSG' },
          "success"
        ));


      dispatch(prepareFinalObject("PublicRelation[0].CreateCommitteeDetails", {}));
      dispatch(prepareFinalObject("PublicRelation[0].CreateMasterCommitee", {}));
      dispatch(prepareFinalObject("CreateInvite", {}));

      dispatch(setRoute(`committeeMaster`))
      return response
    }
    else {
      let errorMessage = "";
      if (response.ResponseInfo.msgId === "Committee already exists") {
        errorMessage = {
          labelName:
            "Committee already exists",
          labelKey: "PR_COMMITTEE_EXISTS"
        };
      }
      else {
        errorMessage = {
          labelName:
            "Internal Error, Try Again",
          labelKey: "PR_INTERNAL_ERROR"
        };
      }
      dispatch(toggleSnackbar(true, errorMessage, "warning"));
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



export const deleteCommiteemaster = async (dispatch, data) => {
  try {
    //  
    const response = await httpRequest(
      "post",
      "/pr-services/committee/_delete",
      "",
      [],
      data
    );

    if (response.ResponseInfo.status == "success" || response.ResponseInfo.status == "Success") {
      store.dispatch(
        toggleSnackbar(
          true,
          { labelName: 'Success', labelCode: 'Success' },
          "success"
        ));
      dispatch(setRoute(`pressGrid`))
      return response
    }
    else {
      dispatch(toggleSnackbar(true, response.ResponseInfo.msgId, "warning"));

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


export const updateCommitteemaster = async (dispatch, data) => {
  try {

    const response = await httpRequest(
      "post",
      "/prscp-services/v1/committee/_update",
      "",
      [],
      data
    );

    if (response.ResponseInfo.status == "success" || response.ResponseInfo.status == "Success") {
      store.dispatch(
        toggleSnackbar(
          true,
          { labelName: 'Committee updated successfully.', labelCode: 'PR_UPDATE_COMMITTEE_MSG' },
          "success"
        ));
      // getPressMasterGridData1

      dispatch(prepareFinalObject("PublicRelation[0].CreateCommitteeDetails", {}));
      dispatch(prepareFinalObject("PublicRelation[0].CreateMasterCommitee", {}));
      dispatch(prepareFinalObject("CreateInvite", {}));

      dispatch(setRoute(`committeeMaster`))
      return response
    }
    else {
      dispatch(toggleSnackbar(true, response.ResponseInfo.msgId, "warning"));

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


export const getEmployeeByUUidHRMS = async data => {
  try {

    const response = await httpRequest(
      "post",
      "/egov-hrms/employees/_search",
      "",
      data,
      []
    );
    return response


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


export const getEmployeeByUUid = async data => {
  try {

    const response = await httpRequest(
      "post",
      "/user/_search",
      "",
      [],
      data
    );
    return response


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

export const furnishResponse_Committee = response => {
  // Handle applicant ownership dependent dropdowns
  let refurnishresponse = {};

  if (response.ResponseBody[0] !== null && response.ResponseBody[0] !== '') {

    set(refurnishresponse, "committeename", response.ResponseBody[0].committeeName);
    set(refurnishresponse, "organizerDepartmentName", response.ResponseBody[0].committeeMember[0].departmentName);


    return refurnishresponse;
  }
};

export const cancelEventApplication = async (state, dispatch, data) => {
  try {

    const response = await httpRequest(
      "post",
      "/prscp-services/v1/event/_updateStatus",
      "",
      [],
      data
    );
    if (response.ResponseInfo.status == "success" || response.ResponseInfo.status == "Success") {
      store.dispatch(
        toggleSnackbar(
          true,
          { labelName: 'Event cancelled successfully.', labelCode: 'EVENT_CANCEL_MSG' },
          "success"
        ));
      dispatch(setRoute(`search`))
      return response
    }
    else {
      dispatch(toggleSnackbar(true, response.ResponseInfo.msgId, "warning"));

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





export const getEventFilterResults = async (data) => {
  try {

    const response = await httpRequest(
      "post",
      "/prscp-services/v1/event/_get",
      "",
      [],
      data
    );


    return response




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



export const getPressFilterResults = async (data) => {
  try {

    const response = await httpRequest(
      "post",
      "/prscp-services/v1/pressnote/_get"
      ,
      "",
      [],
      data
    );


    return response




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





export const getTenderFilterResults = async (data) => {
  try {

    const response = await httpRequest(
      "post",
      "/prscp-services/v1/tender/_get"
      ,
      "",
      [],
      data
    );


    return response




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





export const getPressMasterFilterResults = async (data) => {
  try {

    const response = await httpRequest(
      "post",
      "/prscp-services/v1/press/_get"
      ,
      "",
      [],
      data
    );


    return response




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



export const getLocaliyReportData = async (data) => {
  try {

    const response = await httpRequest(
      "post",
      "/report/prscp-services/_get"
      ,
      "",
      [],
      data
    );


    return response




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






export const getSearchResultsForTenderSummary1 = async (dispatch, data) => {
  try {

    const response = await httpRequest(
      "post",
      "/prscp-services/v1/tender/_get",
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



export const checkForRole = (roleList, roleToCheck) => {
  return roleList.map(role => {
    return role.code
  }).includes(roleToCheck)
}


export const toTitleCase=(str)=> {
  return str.replace(/\w\S*/g, function(txt){
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
} 
export const convertTime =(time)=> {
  // Check correct time format and split into components
  
  //time=time+":00"
  time = time.toString().match(/^([01]\d|2[0-3])(:)([0-5]\d)?$/) || [time];
  
  if (time.length > 1) { // If time format correct
  time = time.slice(1); // Remove full string match value
  time[5] = +time[0] < 12 ? ' AM' : ' PM'; // Set AM/PM
  time[0] = +time[0] % 12 || 12; // Adjust hours
  }
  return time.join(''); // return adjusted time or original string
  }

  export const truncData=(str, length, ending)=> {
    if (length == null) {
      length = 20;
    }
    if (ending == null) {
      ending = '...';
    }
    if (str.length > length) {
      return str.substring(0, length - ending.length) + ending;
    } else {
      return str;
    }
  };


  export const GetSortOrder=(prop) =>{    
    return function(a, b) {    
        if (a[prop] > b[prop]) {    
            return 1;    
        } else if (a[prop] < b[prop]) {    
            return -1;    
        }    
        return 0;    
    }    
}    
export const checkVisibility=(action, state, dispatch,response,status,eventStatus)=>{
  
  response["RAINMAKER-PR"].StatusCheck.map(res => {
    if( status === res.scheduleStatus   && eventStatus===res.eventStatus)
{
    res.btnName.map(btn=>{
      set(
        action,
        `screenConfig.components.div.children.EventSummaryFooter.children.${btn}.visible`,
        status === res.scheduleStatus   && eventStatus===res.eventStatus ?  true  : false 
      )
    })

    if(res.isEdit)
{

  set(
    action,
    "screenConfig.components.div.children.body.children.cardContent.children.eventdetailsSummary.children.cardContent.children.header.children.editSection.visible",
   true )

    
    set(
      action,
      "screenConfig.components.div.children.body.children.cardContent.children.documentsSummary.children.cardContent.children.header.children.editSection.visible",
     true)
}
}


  })
  
}
export const checkTenderVisibility=(action, state, dispatch,response,status,role)=>{
  //MdmsRes["RAINMAKER-PR"].TenderStatusCheck
  
  response["RAINMAKER-PR"].TenderStatusCheck.map(res => {
    role.map(roleName=>{
      if( roleName.code === res.isRole   && status===res.Status )
      {
        
          res.btnName && res.btnName.map(btn=>{
            set(
              action,
              `screenConfig.components.div.children.tenderSummaryfooter.children.${btn}.visible`,
             true
            )
          })
        
          //screenConfiguration.screenConfig["tender-Summary-Publish"].
          if(res.isEdit)
      {
      
        set(
          action,
          "screenConfig.components.div.children.body.children.cardContent.children.tenderPublishSummary.children.cardContent.children.header.children.editSection.visible",
          true
        );
      }
      if(res.isResendGrid)
      {
        let header= getCommonHeader({
					labelName: "Invited Press List",
					labelKey: "PR_INVITED_PRESS_LIST"
      },
      {
        style: {
          marginBottom: 18,
        }
      }
      )
      dispatch(
        handleField(
          "tender-Summary-Publish",
          "components.div.children.Resendbody.children.cardContent.children",
     "headerresend",
     header
        )
      );

        dispatch(
          handleField(
            "tender-Summary-Publish",
            "components.div.children.Resendbody.children.cardContent.children",
       "ResendTenderInviteGrid",
            ResendTenderInviteGrid
          )
        );


    
      //  screenConfiguration.screenConfig["tender-Summary-Publish"].
      }



      }
    })



  })
  
}

export const checkLibraryVisibility=(action, state, dispatch,response,role)=>{
  //MdmsRes["RAINMAKER-PR"].TenderStatusCheck
  
  response["RAINMAKER-PR"].LibraryRoleCheck.map(res => {
    role.map(roleName=>{
      if( roleName.code === res.isRole)
      {
        
          res.btnName && res.btnName.map(btn=>{
            set(
              action,
              `screenConfig.components.div.children.librarysummaryFooter.children.${btn}.visible`,
             true
            )
          })
        //  screenConfiguration.screenConfig["library-summary"].components.div.children.librarysummaryFooter.children.uploadButton.visible
    if(res.isDelete)
      {
        dispatch(prepareFinalObject("LibraryRole",res.isRole));

        localStorage.setItem('libraryFirstRole',res.isRole)
      }
      else{
        localStorage.setItem('librarySecondRole',res.isRole) 
      }
      


      }
    })



  })
  
}