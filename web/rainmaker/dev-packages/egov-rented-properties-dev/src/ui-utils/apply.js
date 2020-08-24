import { httpRequest } from "./api";
import {
  convertDateToEpoch,
  getCurrentFinancialYear,
  addYears,
} from "../ui-config/screens/specs/utils";
import {
    prepareFinalObject,
    toggleSnackbar
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
  import commonConfig from "config/common.js";
  import { localStorageGet } from "egov-ui-kit/utils/localStorageUtils";
import { getSearchResults,getMortgageSearchResults } from "./commons";
import { getUserInfo } from "egov-ui-kit/utils/localStorageUtils";
import { setDocsForEditFlow } from "./commons";
import { getLocaleLabels } from "egov-ui-framework/ui-utils/commons";
let userInfo = JSON.parse(getUserInfo());

  export const applyRentedProperties = async (state, dispatch, activeIndex) => {
    try {
        let queryObject = JSON.parse(
            JSON.stringify(
              get(state.screenConfiguration.preparedFinalObject, "Properties", [])
            )
          );
        const tenantId = getQueryArg(window.location.href, "tenantId");
        const id = get(queryObject[0], "id");
        let response;
        set(queryObject[0], "tenantId", tenantId);
        set(queryObject[0], "owners[0].ownerDetails.allotmentStartdate", convertDateToEpoch(queryObject[0].owners[0].ownerDetails.allotmentStartdate))
        set(queryObject[0], "owners[0].ownerDetails.posessionStartdate", convertDateToEpoch(queryObject[0].owners[0].ownerDetails.posessionStartdate))
        set(queryObject[0], "owners[0].ownerDetails.dateOfBirth", convertDateToEpoch(queryObject[0].owners[0].ownerDetails.dateOfBirth))
        !!queryObject[0].owners[0].ownerDetails.payment && set(queryObject[0], "owners[0].ownerDetails.payment[0].paymentDate", convertDateToEpoch(queryObject[0].owners[0].ownerDetails.payment[0].paymentDate))
        set(queryObject[0], "owners[0].ownerDetails.allotmentEnddate", addYears(queryObject[0].owners[0].ownerDetails.allotmentStartdate, 5))
        set(queryObject[0], "owners[0].ownerDetails.posessionEnddate", addYears(queryObject[0].owners[0].ownerDetails.posessionStartdate, 5))
        set(queryObject[0], "propertyDetails.floors", "")
        set(queryObject[0], "propertyDetails.additionalDetails", "")
        set(queryObject[0], "owners[0].applicationStatus", "")
        set(queryObject[0], "owners[0].activeState", true)
        set(queryObject[0], "owners[0].isPrimaryOwner", true)
        set(queryObject[0], "owners[0].ownerDetails.payment[0].amountDue", "")
        set(queryObject[0], "owners[0].ownerDetails.payment[0].receiptNumber", "")
        if(!id) {
          set(queryObject[0], "masterDataAction", "");
          response = await httpRequest(
            "post",
            "/rp-services/property/_create",
            "",
            [],
            { Properties: queryObject }
          );
        } else {
          if(activeIndex === 0) {
            set(queryObject[0], "masterDataAction", "")
          } else {
            set(queryObject[0], "masterDataAction", "SUBMIT")
          }
          let applicationDocuments = get(queryObject[0], "propertyDetails.applicationDocuments") || [];
          applicationDocuments = applicationDocuments.map(item => ({...item, active: true}))
          const removedDocs = get(state.screenConfiguration.preparedFinalObject, "PropertiesTemp[0].removedDocs") || [];
          applicationDocuments = [...applicationDocuments, ...removedDocs]
          set(queryObject[0], "propertyDetails.applicationDocuments", applicationDocuments)
          response = await httpRequest(
            "post",
            "/rp-services/property/_update",
            "",
            [],
            { Properties: queryObject }
          );
        }
        let {Properties} = response
        let applicationDocuments = Properties[0].propertyDetails.applicationDocuments || [];
        const removedDocs = applicationDocuments.filter(item => !item.active)
        applicationDocuments = applicationDocuments.filter(item => !!item.active)
        Properties = [{...Properties[0], propertyDetails: {...Properties[0].propertyDetails, applicationDocuments}}]
        dispatch(prepareFinalObject("Properties", Properties));
        dispatch(
          prepareFinalObject(
            "PropertiesTemp[0].removedDocs",
            removedDocs
          )
        );
        return true;
    } catch (error) {
        dispatch(toggleSnackbar(true, { labelName: error.message }, "error"));
        console.log(error);
        return false;
    }
  }

  export const applyOwnershipTransfer = async (state, dispatch, activeIndex) => {
    try {
        let queryObject = JSON.parse(
            JSON.stringify(
              get(state.screenConfiguration.preparedFinalObject, "Owners", [])
            )
          );
        
        const userInfo = JSON.parse(getUserInfo())
        const tenantId = userInfo.permanentCity;
        // const tenantId = getQueryArg(window.location.href, "tenantId");
        const id = get(queryObject[0], "id");
        let response;
        set(queryObject[0], "tenantId", tenantId);
        set(queryObject[0], "ownerDetails.phone", userInfo.userName)
        set(queryObject[0], "ownerDetails.permanent", false)
        set(queryObject[0], "isPrimaryOwner", true);
        set(queryObject[0], "activeState", true);
        set(queryObject[0], "ownerDetails.applicationType", "CitizenApplication")
        set(queryObject[0], "ownerDetails.dateOfDeathAllottee", convertDateToEpoch(queryObject[0].ownerDetails.dateOfDeathAllottee))
        if(!id) {
          set(queryObject[0], "applicationState", "");
          set(queryObject[0], "applicationAction", "DRAFT");
          response = await httpRequest(
            "post",
            "/rp-services/ownership-transfer/_create",
            "",
            [],
            { Owners: queryObject }
          );
        } else {
          if(activeIndex === 0) {
            set(queryObject[0], "applicationAction", "REINITIATE")
          } else {
            set(queryObject[0], "applicationAction", "SUBMIT")
          }
          let ownershipTransferDocuments = get(queryObject[0], "ownerDetails.ownershipTransferDocuments") || [];
          ownershipTransferDocuments = ownershipTransferDocuments.filter(item => !!item).map(item => ({...item, active: true}))
          const removedDocs = get(state.screenConfiguration.preparedFinalObject, "OwnersTemp[0].removedDocs") || [];
          ownershipTransferDocuments = [...ownershipTransferDocuments, ...removedDocs]
          set(queryObject[0], "ownerDetails.ownershipTransferDocuments", ownershipTransferDocuments)
          response = await httpRequest(
            "post",
            "/rp-services/ownership-transfer/_update",
            "",
            [],
            { Owners: queryObject }
          );
        }
        let {Owners} = response
        let ownershipTransferDocuments = Owners[0].ownerDetails.ownershipTransferDocuments || [];
        const removedDocs = ownershipTransferDocuments.filter(item => !item.active)
        ownershipTransferDocuments = ownershipTransferDocuments.filter(item => !!item.active)
        Owners = [{...Owners[0], ownerDetails: {...Owners[0].ownerDetails, ownershipTransferDocuments}}]
        dispatch(prepareFinalObject("Owners", Owners));
        dispatch(
          prepareFinalObject(
            "OwnersTemp[0].removedDocs",
            removedDocs
          )
        );
        return true;
    } catch (error) {
        dispatch(toggleSnackbar(true, { labelName: error.message }, "error"));
        console.log(error);
        return false;
    }
  }


  export const submittransitsiteimages = async (state, dispatch) => {
    try {
      let queryObject = JSON.parse(
          JSON.stringify(
            get(state.screenConfiguration.preparedFinalObject, "PropertyImagesApplications",[])
          )
        );
      const filedata = get(state.form.newapplication, "files.media",[]);
      const tenantId = getTenantId()
      let response;
      set(queryObject[0], "tenantId", tenantId);
      set(queryObject[0], "description", queryObject[0].description);
      let fileStoreId = filedata && filedata.map(item => item.fileStoreId).join(",");
      const fileUrlPayload =  fileStoreId && (await getFileUrlFromAPI(fileStoreId)); 
      const output = filedata.map((fileitem,index) => 
      
        ({
          "fileName" : (fileUrlPayload &&
            fileUrlPayload[fileitem.fileStoreId] &&
            decodeURIComponent(
              getFileUrl(fileUrlPayload[fileitem.fileStoreId])
                .split("?")[0]
                .split("/")
                .pop()
                .slice(13)
            )) ||
          `Document - ${index + 1}`,
          "fileStoreId" : fileitem.fileStoreId,
          "fileUrl" : Object.values(fileUrlPayload)[index],
          "documentType" :  `PROPERTYIMAGE ${index + 1}`,
          "tenantId" : tenantId,
          "active": true
        })
      );
      set(queryObject[0], "applicationDocuments", output)
      dispatch(
        prepareFinalObject("PropertyImagesApplications[0].applicationDocuments", output)
      );
      console.log(`PAYLOAD REQ : ${queryObject}`);
      response = await httpRequest(
        "post",
        "/rp-services/property-images/_create",
        "",
        [],
        { PropertyImagesApplications: queryObject }
      );
      return true;
  } catch (error) {
      dispatch(toggleSnackbar(true, { labelName: error.message }, "error"));
      console.log(error);
      return false;
  }
  }

  export const applynoticegeneration = async (state, dispatch, str) => {
    try {

      
      const transitNumber = get(state.screenConfiguration.preparedFinalObject, "Properties[0].transitNumber")
      const id = get(state.screenConfiguration.preparedFinalObject, "Properties[0].id")
      const pincode = get(state.screenConfiguration.preparedFinalObject, "Properties[0].pincode")
      const area = get(state.screenConfiguration.preparedFinalObject, "Properties[0].area")
      const filedata = get(state.form.newapplication, "files.media",[]);
      const memoDate = get(state.screenConfiguration.preparedFinalObject, "Properties[0].owners[0].ownerDetails.allotmentStartdate")
      const violations = get(state.screenConfiguration.preparedFinalObject, "Properties[0].owners[0].ownerDetails.violations")
      const description = get(state.screenConfiguration.preparedFinalObject, "Properties[0].owners[0].ownerDetails.editor")
      const relationship = get(state.screenConfiguration.preparedFinalObject, "Properties[0].owners[0].ownerDetails.relation")
      const fatherOrHusbandname = get(state.screenConfiguration.preparedFinalObject, "Properties[0].owners[0].ownerDetails.fatherOrHusband")
      const demandNoticeFrom = get(state.screenConfiguration.preparedFinalObject, "Properties[0].owners[0].ownerDetails.demandStartdate")
      const demandNoticeTo = get(state.screenConfiguration.preparedFinalObject, "Properties[0].owners[0].ownerDetails.demandlastdate")
      const recoveryType = get(state.screenConfiguration.preparedFinalObject, "Properties[0].owners[0].ownerDetails.recoveryType")
      const amount = get(state.screenConfiguration.preparedFinalObject, "Properties[0].owners[0].ownerDetails.payment[0].amountPaid")
      const noticeType = str
      const properyImageId = filedata.id;
      const tenantId = getTenantId()
      let response;
 
      let fileStoreId = filedata && filedata.map(item => item.fileStoreId).join(",");
      const fileUrlPayload =  fileStoreId && (await getFileUrlFromAPI(fileStoreId)); 
      const output = filedata.map((fileitem,index) => 
      
        ({
          "fileName" : fileitem.file.name,
          "fileStoreId" : fileitem.fileStoreId,
          "fileUrl" : Object.values(fileUrlPayload)[index],
          "documentType" : `PROPERTYIMAGE ${index + 1}`,
          "tenantId" : tenantId,
          "active": true
        })
      );
      
      const NoticeApplications = [{
        "tenantId": tenantId,
        "memoDate" : convertDateToEpoch(memoDate),
        "violations": violations,
        "noticeType" : noticeType,
        "description": description,
        "relationship": relationship,
        "guardian": fatherOrHusbandname,
        "recoveryType": recoveryType,
        "demandNoticeFrom": convertDateToEpoch(demandNoticeFrom),
        "demandNoticeTo" : convertDateToEpoch(demandNoticeTo),
        "amount" : amount,
        "propertyImageId": properyImageId,
        "property": {
          "id": id,
          "transitNumber": transitNumber,
          "pincode": pincode,
          "area": area
        },

        "applicationDocuments": output
    }]
    
   
      response = await httpRequest(
        "post",
        "/rp-services/notice-generation/_create",
        "",
        [],
        { NoticeApplications }
      );
      return true;
  } catch (error) {
      dispatch(toggleSnackbar(true, { labelName: error.message }, "error"));
      console.log(error);
      return false;
  }
  }
 
  export const applyMortgage = async (state, dispatch, activeIndex) => {
    try {
        let queryObject = JSON.parse(
            JSON.stringify(
              get(state.screenConfiguration.preparedFinalObject, "MortgageApplications", [])
            )
          );
        
        const userInfo = JSON.parse(getUserInfo())
        const tenantId = userInfo.permanentCity;
        // const tenantId = getQueryArg(window.location.href, "tenantId");
        const id = get(queryObject[0], "id");
        let response;
        set(queryObject[0], "tenantId", tenantId);
        set(queryObject[0], "propertyDetails", "null");
        set(queryObject[0], "applicant[0].phone", userInfo.userName);

        if(!id) {
          set(queryObject[0], "state", "");
          set(queryObject[0], "action", "DRAFT");
          response = await httpRequest(
            "post",
            "/rp-services/mortgage/_create",
            "",
            [],
            { MortgageApplications: queryObject }
          );
        } else {
          if(activeIndex === 0) {
            set(queryObject[0], "action", "REINITIATE")
          } 
          else {
            set(queryObject[0], "action", "SUBMIT")
          }
          let applicationDocuments = get(queryObject[0], "applicationDocuments") || [];
          applicationDocuments = applicationDocuments.map(item => ({...item, active: true}))
          const removedDocs = get(state.screenConfiguration.preparedFinalObject, "MortgageApplicationsTemp[0].removedDocs") || [];
          applicationDocuments = [...applicationDocuments, ...removedDocs]
          set(queryObject[0], "applicationDocuments", applicationDocuments)
          response = await httpRequest(
            "post",
            "/rp-services/mortgage/_update",
            "",
            [],
            { MortgageApplications: queryObject }
          );
        }
        let {MortgageApplications} = response
        let applicationDocuments = MortgageApplications[0].applicationDocuments || [];
        const removedDocs = applicationDocuments.filter(item => !item.active)
        applicationDocuments = applicationDocuments.filter(item => !!item.active)
        MortgageApplications = [{...MortgageApplications[0], applicationDocuments}]
        dispatch(prepareFinalObject("MortgageApplications", MortgageApplications));
        dispatch(
          prepareFinalObject(
            "MortgageApplicationsTemp[0].removedDocs",
            removedDocs
          )
        );
        return true;
    } catch (error) {
        dispatch(toggleSnackbar(true, { labelName: error.message }, "error"));
        console.log(error);
        return false;
    }
  }
  

export const applyDuplicateCopy = async (state, dispatch, activeIndex) => {
 
    try {
        let queryObject = JSON.parse(
            JSON.stringify(
              get(state.screenConfiguration.preparedFinalObject, "DuplicateCopyApplications", [])
            )
          );
          
        const userInfo = JSON.parse(getUserInfo())
        const tenantId = userInfo.permanentCity;
        // const tenantId = getQueryArg(window.location.href, "tenantId");
        const id = get(queryObject[0], "id");
        let response;
        set(queryObject[0], "tenantId", tenantId);
        set(queryObject[0], "propertyDetails", "null");
        set(queryObject[0], "applicant[0].phone", userInfo.userName);
        
        if(!id) {
          set(queryObject[0], "state", "");
          set(queryObject[0], "action", "DRAFT");
          response = await httpRequest(
            "post",
            "/rp-services/duplicatecopy/_create",
            "",
            [],
            { DuplicateCopyApplications: queryObject }
          );
        } else {
          if(activeIndex === 0) {
            set(queryObject[0], "action", "REINITIATE")
          } else {
            set(queryObject[0], "action", "SUBMIT")
          }
          let applicationDocuments = get(queryObject[0], "applicationDocuments") || [];
          applicationDocuments = applicationDocuments.map(item => ({...item, active: true}))
          const removedDocs = get(state.screenConfiguration.preparedFinalObject, "DuplicateTemp[0].removedDocs") || [];
          applicationDocuments = [...applicationDocuments, ...removedDocs]
          set(queryObject[0], "applicationDocuments", applicationDocuments)
          response = await httpRequest(
            "post",
            "/rp-services/duplicatecopy/_update",
            "",
            [],
            { DuplicateCopyApplications: queryObject }
          );
        }
        let {DuplicateCopyApplications} = response
        let applicationDocuments = DuplicateCopyApplications[0].applicationDocuments || [];
        const removedDocs = applicationDocuments.filter(item => !item.active)
        applicationDocuments = applicationDocuments.filter(item => !!item.active)
        DuplicateCopyApplications = [{...DuplicateCopyApplications[0], applicationDocuments}]
        dispatch(prepareFinalObject("DuplicateCopyApplications", DuplicateCopyApplications));
         dispatch(
          prepareFinalObject(
            "DuplicateTemp[0].removedDocs",
            removedDocs
          )
        );
        return true;
    } catch (error) {
        dispatch(toggleSnackbar(true, { labelName: error.message }, "error"));
        console.log(error);
        return false;
    }
  }
  



export const getDetailsFromProperty = async (state, dispatch) => {
  try {
    
    const transitNumber = get(
      state.screenConfiguration.preparedFinalObject,
      "Owners[0].property.transitNumber",
      ""
    );
    if(!!transitNumber) {
      let queryObject = [
        { key: "transitNumber", value: transitNumber },
        { key: "state", value: "PM_APPROVED"}
      ];
      const payload = await getSearchResults(queryObject)
      if (
        payload &&
        payload.Properties
      ) {
        if (!payload.Properties.length) {
          dispatch(
            toggleSnackbar(
              true,
              {
                labelName: "Property is not found with this Transit Number",
                labelKey: "ERR_PROPERTY_NOT_FOUND_WITH_PROPERTY_ID"
              },
              "info"
            )
          );
          dispatch(
            prepareFinalObject(
              "Owners[0].property.transitNumber",
              ""
            )
          )
          dispatch(
            handleField(
              "ownership-apply",
              "components.div.children.formwizardFirstStep.children.ownershipAddressDetails.children.cardContent.children.detailsContainer.children.ownershipTransitNumber",
              "props.value",
              ""
            )
          );
        } else {
          const {Properties} = payload;
          const {owners = []} = Properties[0]
          const findOwner = owners.find(item => !!item.activeState) || {}
          dispatch(
            prepareFinalObject(
              "Owners[0].property.area",
              Properties[0].propertyDetails.address.area
            )
          )
          dispatch(
            prepareFinalObject(
              "Owners[0].property.pincode",
              Properties[0].propertyDetails.address.pincode
            )
          )
          dispatch(
            prepareFinalObject(
              "Owners[0].property.id",
              Properties[0].propertyDetails.propertyId
            )
          )
          dispatch(
            prepareFinalObject(
              "Owners[0].allotmenNumber",
              findOwner.allotmenNumber
            )
          )
          dispatch(
            prepareFinalObject(
              "Owners[0].ownerDetails.monthlyRent",
              findOwner.ownerDetails.monthlyRent
            )
          )
          dispatch(
            prepareFinalObject(
              "Owners[0].ownerDetails.revisionPeriod",
              findOwner.ownerDetails.revisionPeriod
            )
          )
          dispatch(
            prepareFinalObject(
              "Owners[0].ownerDetails.revisionPercentage",
              findOwner.ownerDetails.revisionPercentage
            )
          )
          return true
        }
    }
  }
 } catch (error) {
  console.log(e);
  }
}


export const getDetailsFromPropertyMortgage = async (state, dispatch) => {
  try {
    
    const transitNumber = get(
      state.screenConfiguration.preparedFinalObject,
      "MortgageApplications[0].property.transitNumber",
      ""
    );
    if(!!transitNumber) {
      let queryObject = [
        { key: "transitNumber", value: transitNumber },
        { key: "state", value: "PM_APPROVED" }
      ];
      const payload = await getSearchResults(queryObject)
      if (
        payload &&
        payload.Properties
      ) {
        if (!payload.Properties.length) {
          dispatch(
            toggleSnackbar(
              true,
              {
                labelName: "Property is not found with this Transit Number",
                labelKey: "ERR_PROPERTY_NOT_FOUND_WITH_PROPERTY_ID"
              },
              "info"
            )
          );
          dispatch(
            prepareFinalObject(
              "MortgageApplications[0].property.transitNumber",
              ""
            )
          )
          dispatch(
            handleField(
              "apply",
              "components.div.children.formwizardFirstStep.children.ownershipAddressDetailsMortgage.children.cardContent.children.detailsContainer.children.ownershipTransitNumber",
              "props.value",
              ""
            )
          );
        } else {
          const {Properties} = payload;
          const {owners = []} = Properties[0]
          const findOwner = owners.find(item => !!item.activeState) || {}
         
          dispatch(
            prepareFinalObject(
              "MortgageApplications[0].property.pincode",
              Properties[0].propertyDetails.address.pincode
            )
          )
          dispatch(
            prepareFinalObject(
              "MortgageApplications[0].property.id",
              Properties[0].propertyDetails.propertyId
            )
          )
           dispatch(
            prepareFinalObject(
              "MortgageApplications[0].property.area",
              Properties[0].propertyDetails.address.area
            )
          )
          dispatch(
            prepareFinalObject(
              "MortgageApplications[0].applicant[0].name",
              findOwner.ownerDetails.name
            )
          )
          dispatch(
            prepareFinalObject(
              "MortgageApplications[0].applicant[0].guardian",
              findOwner.ownerDetails.fatherOrHusband
            )
          )
          dispatch(
            prepareFinalObject(
              "MortgageApplications[0].applicant[0].relationship",
              findOwner.ownerDetails.relation
            )
          )
          dispatch(
            prepareFinalObject(
              "MortgageApplications[0].applicant[0].aadhaarNumber",
              findOwner.ownerDetails.aadhaarNumber
            )
          )
          dispatch(
            prepareFinalObject(
              "MortgageApplications[0].applicant[0].email",
              findOwner.ownerDetails.email
            )
          )
          dispatch(
            prepareFinalObject(
              "MortgageApplications[0].applicant[0].phone",
              findOwner.ownerDetails.phone
            )
          )
          
          return true
        }
    }
  }
 } catch (error) {
  console.log(e);
  }
}


export const getDetailsFromPropertyTransit = async (state, dispatch) => {
  try {
    
    const transitNumber = get(
      state.screenConfiguration.preparedFinalObject,
      "PropertyImagesApplications[0].property.transitNumber",
      ""
    );
    if(!!transitNumber) {
      let queryObject = [
        { key: "transitNumber", value: transitNumber },
        { key: "state", value: "PM_APPROVED" }
      ];
      
      const payload = await getSearchResults(queryObject)
      
      if (
        payload &&
        payload.Properties
      ) {
        if (!payload.Properties.length) {
          dispatch(
            toggleSnackbar(
              true,
              {
                labelName: "Property is not found with this Transit Number",
                labelKey: "ERR_PROPERTY_NOT_FOUND_WITH_PROPERTY_ID"
              },
              "info"
            )
          );
          dispatch(
            prepareFinalObject(
              "owners[0].property.transitNumber",
              ""
            )
          )
          dispatch(
            handleField(
              "apply",
              "components.div.children.formwizardFirstStep.children.ownershipAddressDetails.children.cardContent.children.detailsContainer.children.ownershipTransitNumber",
              "props.value",
              ""
            )
          );
        } else {
          
          const {Properties} = payload;
          const {owners = []} = Properties[0]
          
          dispatch(
            prepareFinalObject(
              "PropertyImagesApplications[0].property.pincode",
              Properties[0].propertyDetails.address.pincode
            )
          )
          dispatch(
            prepareFinalObject(
              "PropertyImagesApplications[0].property.id",
              Properties[0].propertyDetails.propertyId
            )
          )
           dispatch(
            prepareFinalObject(
              "PropertyImagesApplications[0].property.area",
              Properties[0].propertyDetails.address.area
            )
          )
          
          return true
        }
    }
  }
 } catch (error) {
  console.log(e);
  }
}


export const getDuplicateDetailsFromProperty = async (state, dispatch) => {
  try {
    
    const transitNumber = get(
      state.screenConfiguration.preparedFinalObject,
      "DuplicateCopyApplications[0].property.transitNumber",
      ""
    );
    if(!!transitNumber) {
      let queryObject = [
        { key: "transitNumber", value: transitNumber },
        { key: "state", value: "PM_APPROVED" }
      ];
      const payload = await getSearchResults(queryObject)
      if (
        payload &&
        payload.Properties
      ) {
        if (!payload.Properties.length) {
          dispatch(
            toggleSnackbar(
              true,
              {
                labelName: "Property is not found with this Transit Number",
                labelKey: "ERR_PROPERTY_NOT_FOUND_WITH_PROPERTY_ID"
              },
              "info"
            )
          );
          dispatch(
            prepareFinalObject(
              "DuplicateCopyApplications[0].property.transitNumber",
              ""
            )
          )
          dispatch(
            handleField(
              "duplicate-copy-apply",
              "components.div.children.formwizardFirstStep.children.transitSiteDetails.children.cardContent.children.detailsContainer.children.transitNumber",
              "props.value",
              ""
            )
          );
        } else {
          const {Properties} = payload;
          const {owners = []} = Properties[0]
          const findOwner = owners.find(item => !!item.activeState) || {}
        
          dispatch(
            prepareFinalObject(
              "DuplicateCopyApplications[0].property.pincode",
              Properties[0].propertyDetails.address.pincode
            )
          )
          dispatch(
            prepareFinalObject(
              "DuplicateCopyApplications[0].property.id",
              Properties[0].propertyDetails.propertyId
            )
          )
           dispatch(
            prepareFinalObject(
              "DuplicateCopyApplications[0].property.colony",
              Properties[0].propertyDetails.address.colony
            )
          )
          dispatch(
            prepareFinalObject(
              "Properties[0].colony",
              getLocaleLabels("colony",Properties[0].propertyDetails.address.colony)
            )
          )
          dispatch(
            prepareFinalObject(
              "DuplicateCopyApplications[0].applicant[0].name",
              findOwner.ownerDetails.name
            )
          )
          dispatch(
            prepareFinalObject(
              "DuplicateCopyApplications[0].applicant[0].guardian",
              findOwner.ownerDetails.fatherOrHusband
            )
          )
          dispatch(
            prepareFinalObject(
              "DuplicateCopyApplications[0].applicant[0].relationship",
              findOwner.ownerDetails.relation
            )
          )
          dispatch(
            prepareFinalObject(
              "DuplicateCopyApplications[0].applicant[0].aadhaarNumber",
              findOwner.ownerDetails.aadhaarNumber
            )
          )
          dispatch(
            prepareFinalObject(
              "DuplicateCopyApplications[0].applicant[0].email",
              findOwner.ownerDetails.email
            )
          )
          return true
        }
    }
  }
 } catch (error) {
  console.log(e);
  }
}
