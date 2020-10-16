import { httpRequest } from "./api";
import {
  convertDateToEpoch,
  addYears,
} from "../ui-config/screens/specs/utils";
import {
    prepareFinalObject,
    toggleSnackbar,
    toggleSpinner
  } from "egov-ui-framework/ui-redux/screen-configuration/actions";
  import { handleScreenConfigurationFieldChange as handleField } from "egov-ui-framework/ui-redux/screen-configuration/actions";
  import get from "lodash/get";
  import set from "lodash/set";
  import {
    getQueryArg,
    getFileUrl,
    getFileUrlFromAPI
  } from "egov-ui-framework/ui-utils/commons";
  import { getTenantId } from "egov-ui-kit/utils/localStorageUtils";
import { getSearchResults } from "./commons";
import { getUserInfo } from "egov-ui-kit/utils/localStorageUtils";
import { setDocsForEditFlow } from "./commons";
import { getLocaleLabels } from "egov-ui-framework/ui-utils/commons";


export const setApplicationNumberBox = (state, dispatch, applicationNumber, screenKey) => {
  dispatch(
    handleField(
      screenKey,
      "components.div.children.headerDiv.children.header.children.applicationNumber",
      "visible",
      true
    )
  );
  dispatch(
    handleField(
      screenKey,
      "components.div.children.headerDiv.children.header.children.applicationNumber",
      "props.number",
      applicationNumber
    )
  );
};

  export const applyRentedProperties = async (state, dispatch, activeIndex) => {
    try {
        dispatch(toggleSpinner())
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
          if(activeIndex !== 3) {
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
        let {rentSummary} = Properties[0]
        rentSummary = {
          balancePrincipal: !!rentSummary ? rentSummary.balancePrincipal.toFixed(2) : 0,
          balanceInterest: !!rentSummary ? rentSummary.balanceInterest.toFixed(2) : 0,
          balanceAmount: !!rentSummary ? rentSummary.balanceAmount.toFixed(2) : 0
        }
        Properties = [{...Properties[0], rentSummary, propertyDetails: {...Properties[0].propertyDetails, applicationDocuments}}]
        Properties = Properties.reduce((prev, curr) => {
          let keys = Object.keys(curr);
          keys = keys.filter(key => !!curr[key]).reduce((acc, key) => {
            return {...acc, [key]: curr[key]}
          }, {})
          return [...prev, {
            ...keys
          }]
        }, [])
        let properties = Properties
        properties[0].formatrentSummary = rentSummary
        dispatch(prepareFinalObject("Properties", properties));
        dispatch(
          prepareFinalObject(
            "PropertiesTemp[0].removedDocs",
            removedDocs
          )
        );
        await setDocsForEditFlow(state, dispatch, "Properties[0].propertyDetails.applicationDocuments", "PropertiesTemp[0].uploadedDocsInRedux");
        const {transitNumber} = Properties[0]
        setApplicationNumberBox(state, dispatch, transitNumber, "apply")
        dispatch(toggleSpinner())
        dispatch(
          handleField(
            "apply",
            "components.div.children.formwizardFirstStep.children.propertyDetails.children.cardContent.children.detailsContainer.children.transitNumber",
            "props.disabled",
            true
          )
        )
        return true;
    } catch (error) {
        dispatch(toggleSnackbar(true, { labelName: error.message }, "error"));
        dispatch(toggleSpinner())
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
        set(queryObject[0], "ownerDetails.relation", queryObject[0].ownerDetails.relationWithDeceasedAllottee)
        set(queryObject[0], "ownerDetails.fatherOrHusband", queryObject[0].ownerDetails.fatherOrHusband)
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
          if(activeIndex !==2) {
            set(queryObject[0], "applicationAction", "REINITIATE")
          } else {
            set(queryObject[0], "applicationAction", "SUBMIT")
          }
          let ownershipTransferDocuments = get(queryObject[0], "ownerDetails.ownershipTransferDocuments") || [];
          ownershipTransferDocuments = ownershipTransferDocuments.filter(item => !!item && !!item.fileStoreId).filter((item, index, arr) => (arr.findIndex((arrItem) => arrItem.fileStoreId === item.fileStoreId)) === index).map(item => ({...item, active: true}))
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
        Owners = [{...Owners[0],property: {...Owners[0].property, rentSummary:{...Owners[0].property.rentSummary , totalDue : (Owners[0].property.rentSummary.balancePrincipal + 
          Owners[0].property.rentSummary.balanceInterest).toFixed(2)}}, ownerDetails: {...Owners[0].ownerDetails, ownershipTransferDocuments}}]
        dispatch(prepareFinalObject("Owners", Owners));
        dispatch(
          prepareFinalObject(
            "OwnersTemp[0].removedDocs",
            removedDocs
          )
        );
        const applicationNumber = Owners[0].ownerDetails.applicationNumber
        await setDocsForEditFlow(state, dispatch, "Owners[0].ownerDetails.ownershipTransferDocuments", "OwnersTemp[0].uploadedDocsInRedux");
        setApplicationNumberBox(state, dispatch, applicationNumber, "ownership-apply")
        dispatch(
          handleField(
            "ownership-apply",
            "components.div.children.formwizardFirstStep.children.ownershipAddressDetails.children.cardContent.children.detailsContainer.children.ownershipTransitNumber",
            "props.disabled",
            true
          )
        )
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

  export const applynoticegeneration = async (state, dispatch, str, propertyIdTransitNumber) => {
    try { 
      const transitNumber = get(state.screenConfiguration.preparedFinalObject, "Properties[0].transitNumber")
      const id = get(state.screenConfiguration.preparedFinalObject, "Properties[0].id")
      const pincode = get(state.screenConfiguration.preparedFinalObject, "Properties[0].pincode")
      const area = get(state.screenConfiguration.preparedFinalObject, "Properties[0].area")
      const filedataImages = !!propertyIdTransitNumber ? get(state.screenConfiguration.preparedFinalObject, "SingleImage[0].applicationDocuments") : get(state.form.newapplication, "files.media",[]);
      const filedata = get(state.screenConfiguration.preparedFinalObject, "SingleImage",[]);
      const memoDate = get(state.screenConfiguration.preparedFinalObject, "Properties[0].owners[0].ownerDetails.allotmentStartdate")
      const violations = get(state.screenConfiguration.screenConfig["notice-violation"],"components.div.children.formwizardFirstStep.children.ownerDetailsForViolationNotice.children.cardContent.children.detailsContainer.children.violations.props.value") || get(state.screenConfiguration.preparedFinalObject, "Images[0].description")
      const description = get(state.screenConfiguration.preparedFinalObject, "Properties[0].owners[0].ownerDetails.editor")
      const relationship = get(state.screenConfiguration.preparedFinalObject, "Properties[0].owners[0].ownerDetails.relation")
      const fatherOrHusbandname = get(state.screenConfiguration.preparedFinalObject, "Properties[0].owners[0].ownerDetails.fatherOrHusband")
      const demandNoticeFrom = get(state.screenConfiguration.preparedFinalObject, "Properties[0].owners[0].ownerDetails.demandStartdate")
      const demandNoticeTo = get(state.screenConfiguration.preparedFinalObject, "Properties[0].owners[0].ownerDetails.demandlastdate")
      const recoveryType = get(state.screenConfiguration.preparedFinalObject, "Properties[0].owners[0].ownerDetails.recoveryType")
      const amount = get(state.screenConfiguration.preparedFinalObject, "Properties[0].owners[0].ownerDetails.payment[0].amountPaid")
      const allotmentNumber = get(state.screenConfiguration.preparedFinalObject, "Properties[0].owners[0].allotmenNumber")
      const colony = get(state.screenConfiguration.preparedFinalObject, "Properties[0].colony")
      const ownername = get(state.screenConfiguration.preparedFinalObject, "Properties[0].owners[0].ownerDetails.name")
      const noticeType = str
      const propertyImageId = (noticeType === "Violation" && !!propertyIdTransitNumber) ? filedata[0].id : null
      console.log(propertyImageId)
      const tenantId = getTenantId()
      let response;
 
      let fileStoreId = filedataImages && filedataImages.map(item => item.fileStoreId).join(",");
      const fileUrlPayload =  fileStoreId && (await getFileUrlFromAPI(fileStoreId)); 
      const output = filedataImages.map((fileitem,index) => 
      
        ({
          "fileName" : fileitem.name,
          "fileStoreId" : fileitem.fileStoreId,
          "fileUrl" : Object.values(fileUrlPayload)[index],
          "documentType" : `PROPERTYIMAGE ${index + 1}`,
          "tenantId" : tenantId,
          "active": true
        })
      );
      
      const NoticeApplications = [{
        "OwnerName":ownername,
        "tenantId": tenantId,
        "allotmentNumber":allotmentNumber,
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
        "propertyImageId": propertyImageId,
        "property": {
          "id": id,
          "transitNumber": transitNumber,
          "pincode": pincode,
          "area": area,
          "colony":colony
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
      let pdfPayload = response.NoticeApplications
      pdfPayload[0].OwnerName = ownername
      dispatch(
        prepareFinalObject("notices", pdfPayload)
      );
      return response;
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
        set(queryObject[0], "applicant[0].phone",queryObject[0].applicant[0].phone);
        set(queryObject[0], "applicant[0].adhaarNumber", queryObject[0].applicant[0].adhaarNumber);
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
          if(activeIndex !==2) {
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
        const applicationNumber = MortgageApplications[0].applicationNumber
        await setDocsForEditFlow(state, dispatch, "MortgageApplications[0].applicationDocuments", "MortgageApplicationsTemp[0].uploadedDocsInRedux");
        setApplicationNumberBox(state, dispatch, applicationNumber, "mortage-apply")
        dispatch(
          handleField(
            "mortage-apply",
            "components.div.children.formwizardFirstStep.children.ownershipAddressDetailsMortgage.children.cardContent.children.detailsContainer.children.ownershipTransitNumber",
            "props.disabled",
            true
          )
        )
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
        set(queryObject[0], "applicant[0].phone", queryObject[0].applicant[0].phone);
        set(queryObject[0], "applicant[0].adhaarNumber", queryObject[0].applicant[0].adhaarNumber);
        
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
          if(activeIndex !==2) {
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
        DuplicateCopyApplications = [{...DuplicateCopyApplications[0],property: {...DuplicateCopyApplications[0].property, rentSummary:{...DuplicateCopyApplications[0].property.rentSummary , totalDue : (DuplicateCopyApplications[0].property.rentSummary.balancePrincipal + 
          DuplicateCopyApplications[0].property.rentSummary.balanceInterest).toFixed(2)}}, applicationDocuments}]
        dispatch(prepareFinalObject("DuplicateCopyApplications", DuplicateCopyApplications));
         dispatch(
          prepareFinalObject(
            "DuplicateTemp[0].removedDocs",
            removedDocs
          )
        );
        const applicationNumber = DuplicateCopyApplications[0].applicationNumber
        await setDocsForEditFlow(state, dispatch, "DuplicateCopyApplications[0].applicationDocuments", "DuplicateTemp[0].uploadedDocsInRedux");
        setApplicationNumberBox(state, dispatch, applicationNumber, "duplicate-copy-apply")
        dispatch(
          handleField(
            "duplicate-copy-apply",
            "components.div.children.formwizardFirstStep.children.transitSiteDetails.children.cardContent.children.detailsContainer.children.transitNumber",
            "props.disabled",
            true
          )
        )
        return true;
    } catch (error) {
        dispatch(toggleSnackbar(true, { labelName: error.message }, "error"));
        console.log(error);
        return false;
    }
  }
 
const getPropertyDetails = async ({state, dispatch, transitNumber, screenKey, componentJsonPath, jsonPath}) => {
  let queryObject = [
    { key: "transitNumber", value: transitNumber },
    { key: "state", value: "PM_APPROVED"},
    { key: "relations", value: "owner" }
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
            labelKey: "RP_ERR_PROPERTY_NOT_FOUND_WITH_PROPERTY_ID"
          },
          "info"
        )
      );
      dispatch(
        prepareFinalObject(
          jsonPath,
          ""
        )
      )
      dispatch(
        handleField(
          screenKey,
          componentJsonPath,
          "props.value",
          ""
        )
      );
    } else {
      return payload
    }
  }
}

export const getRentPaymentPropertyDetails = async (state, dispatch) => {
  try {
    const transitNumber = get(state.screenConfiguration.preparedFinalObject, "property.transitNumber")
    if(!!transitNumber) {
      dispatch(toggleSpinner())
      const payload = await getPropertyDetails({
        state, dispatch, transitNumber, screenKey: "payment",
        jsonPath: "Properties[0].transitNumber",
        componentJsonPath: "components.div.children.detailsContainer.children.propertyDetails.children.cardContent.children.detailsContainer.children.transitNumber"
      })
      if(!!payload) {
        let {Properties} = payload
        Properties = Properties.map(item => ({...item, rentSummary: {balanceAmount: Number(item.rentSummary.balanceAmount.toFixed(2)),
          balanceInterest: Number(item.rentSummary.balanceInterest.toFixed(2)),
          balancePrincipal: Number(item.rentSummary.balancePrincipal.toFixed(2))
        }}))
        dispatch(prepareFinalObject("Properties", Properties))
        dispatch(handleField(
          "payment",
          "components.div.children.detailsContainer.children.rentSummaryDetails",
          "visible",
          true
        ))
        dispatch(toggleSpinner())
        return payload.Properties[0].propertyDetails.propertyId
      }
      dispatch(toggleSpinner())
    }
  } catch (error) {
    dispatch(toggleSpinner())
    dispatch(toggleSnackbar(true, { labelName: error.message }, "error"));
  }
}

export const getAccountStatementProperty = async (state, dispatch) => {
  try {
    const transitNumber = get(state.screenConfiguration.preparedFinalObject, "searchScreen.transitNumber")
    if(!!transitNumber) {
      const payload = await getPropertyDetails({
        state, dispatch, transitNumber, screenKey: "search-account-statement",
        jsonPath: "searchScreen.transitNumber",
        componentJsonPath:"components.div.children.accountStatementFilterForm.children.cardContent.children.applicationNoContainer.children.transitNumber"
      })
      if(!!payload) {
        const {Properties} = payload;
        const {owners = []} = Properties[0]
        const findOwner = owners.find(item => !!item.activeState) || {}
        dispatch(
          prepareFinalObject(
            "searchScreen.colony",
            Properties[0].propertyDetails.address.colony
          )
        )
        dispatch(
          prepareFinalObject(
            "searchScreen.pincode",
            Properties[0].propertyDetails.address.pincode
          )
        )
        dispatch(
          prepareFinalObject(
            "searchScreen.area",
            Properties[0].propertyDetails.area
          )
        )
        dispatch(
          prepareFinalObject(
            "searchScreen.propertyId",
            Properties[0].propertyDetails.propertyId
          )
        )
        dispatch(
          prepareFinalObject(
            "searchScreen.ownername",
            findOwner.ownerDetails.name
          )
        )

        dispatch(
          prepareFinalObject(
            "Properties",
            Properties
          )
        )

        return Properties[0].propertyDetails.propertyId
      }
    }
  } catch (error) {
    dispatch(toggleSnackbar(true, { labelName: error.message }, "error"));
    return false
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
      const payload = await getPropertyDetails({state, dispatch, transitNumber, screenKey: "ownership-apply", jsonPath: "Owners[0].property.transitNumber",
    componentJsonPath: "components.div.children.formwizardFirstStep.children.ownershipAddressDetails.children.cardContent.children.detailsContainer.children.ownershipTransitNumber"
    })
    if(!!payload) {
      const {Properties} = payload;
          const {owners = []} = Properties[0]
          const findOwner = owners.find(item => !!item.activeState) || {}
          dispatch(
            prepareFinalObject(
              "Owners[0].property.colony",
              Properties[0].propertyDetails.address.colony
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
          dispatch(
            prepareFinalObject(
              "Owners[0].ownerDetails.fatherOrHusband",
              findOwner.ownerDetails.name
            )
          )
          return true
    }
  }     
 } catch (error) {
  dispatch(toggleSnackbar(true, { labelName: error.message }, "error"));
    return false
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

      const payload = await getPropertyDetails({state, dispatch, transitNumber, screenKey: "mortage-apply", jsonPath: "MortgageApplications[0].property.transitNumber", componentJsonPath: "components.div.children.formwizardFirstStep.children.ownershipAddressDetailsMortgage.children.cardContent.children.detailsContainer.children.ownershipTransitNumber"
    })
      if(!!payload) {
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
              "MortgageApplications[0].property.colony",
              Properties[0].propertyDetails.address.colony
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

          if(!!findOwner.ownerDetails.relationWithDeceasedAllottee && findOwner.ownerDetails.relationWithDeceasedAllottee === "LEGAL_HEIR"){
            dispatch(
              prepareFinalObject(
                "MortgageApplications[0].applicant[0].relationship",
                "FATHER"
              )
            )
          }
          else if(!!findOwner.ownerDetails.relationWithDeceasedAllottee && findOwner.ownerDetails.relationWithDeceasedAllottee === "SPOUSE"){
            dispatch(
              prepareFinalObject(
                "MortgageApplications[0].applicant[0].relationship",
                "HUSBAND"
              )
            )
          }
          else{
            dispatch(
              prepareFinalObject(
                "MortgageApplications[0].applicant[0].relationship",
                findOwner.ownerDetails.relation
              )
            )
          }
          dispatch(
            prepareFinalObject(
              "MortgageApplications[0].applicant[0].adhaarNumber",
              findOwner.ownerDetails.aadhaarNumber
            )
          )
          // dispatch(
          //   prepareFinalObject(
          //     "MortgageApplications[0].applicant[0].email",
          //     findOwner.ownerDetails.email
          //   )
          // )
          // dispatch(
          //   prepareFinalObject(
          //     "MortgageApplications[0].applicant[0].phone",
          //     findOwner.ownerDetails.phone
          //   )
          // )
          return true
        }
    }
 } catch (error) {
  dispatch(toggleSnackbar(true, { labelName: error.message }, "error"));
    return false
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
      const payload = await getPropertyDetails({state, dispatch, transitNumber, screenKey: "transit-site-images", jsonPath: "owners[0].property.transitNumber", componentJsonPath: "components.div.children.formwizardFirstStep.children.ownershipAddressDetails.children.cardContent.children.detailsContainer.children.ownershipTransitNumber"
    })
      if(!!payload) {
          const {Properties} = payload;          
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
              "PropertyImagesApplications[0].property.colony",
              Properties[0].propertyDetails.address.colony
            )
          )
          return true
        }
    }
 } catch (error) {
  dispatch(toggleSnackbar(true, { labelName: error.message }, "error"));
    return false
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
        const payload = await getPropertyDetails({state, dispatch, transitNumber, screenKey: "duplicate-copy-apply", jsonPath: "DuplicateCopyApplications[0].property.transitNumber", componentJsonPath: "components.div.children.formwizardFirstStep.children.transitSiteDetails.children.cardContent.children.detailsContainer.children.transitNumber"
        })
        if(!!payload) {
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
          if(!!findOwner.ownerDetails.relationWithDeceasedAllottee && findOwner.ownerDetails.relationWithDeceasedAllottee === "LEGAL_HEIR"){
            dispatch(
              prepareFinalObject(
                "DuplicateCopyApplications[0].applicant[0].relationship",
                "FATHER"
              )
            )
          }
          else if(!!findOwner.ownerDetails.relationWithDeceasedAllottee && findOwner.ownerDetails.relationWithDeceasedAllottee === "SPOUSE"){
            dispatch(
              prepareFinalObject(
                "DuplicateCopyApplications[0].applicant[0].relationship",
                "HUSBAND"
              )
            )
          }
          else{
            dispatch(
              prepareFinalObject(
                "DuplicateCopyApplications[0].applicant[0].relationship",
                findOwner.ownerDetails.relation
              )
            )
          }
         
          dispatch(
            prepareFinalObject(
              "DuplicateCopyApplications[0].applicant[0].adhaarNumber",
              findOwner.ownerDetails.aadhaarNumber
            )
          )
          // dispatch(
          //   prepareFinalObject(
          //     "DuplicateCopyApplications[0].applicant[0].email",
          //     findOwner.ownerDetails.email
          //   )
          // )
          // dispatch(
          //   prepareFinalObject(
          //     "DuplicateCopyApplications[0].applicant[0].phone",
          //     findOwner.ownerDetails.phone
          //   )
          // )
          return true
        }
    }
 } catch (error) {
  dispatch(toggleSnackbar(true, { labelName: error.message }, "error"));
    return false
  }
}


export const getRecoveryValueProperty = async (action,state, dispatch) => {
  try {
    const monthlyRent = get(
      state.screenConfiguration.preparedFinalObject,
      "Properties[0].rentSummary.balancePrincipal",
      ""
    );
    const onlyInterest = get(
      state.screenConfiguration.preparedFinalObject,
      "Properties[0].rentSummary.balanceInterest",
      ""
    );
    const balanceAmount=get(
      state.screenConfiguration.preparedFinalObject,
      "Properties[0].rentSummary.balanceAmount",
      ""
    );
    const totalDues = Math.max(0 , monthlyRent + onlyInterest - balanceAmount)

      if(action.value==="RECOVERY.MONTHLYRENT"){

        dispatch(
          handleField(
            "notice-recovry",
            "components.div.children.formwizardFirstStep.children.paymentDetailsNotice.children.cardContent.children.detailsContainer.children.paymentAmount",
            "props.value",
            monthlyRent.toFixed(2)
          )
        )
       
      }
      if(action.value==="RECOVERY.INTEREST"){

        dispatch(
          handleField(
            "notice-recovry",
            "components.div.children.formwizardFirstStep.children.paymentDetailsNotice.children.cardContent.children.detailsContainer.children.paymentAmount",
            "props.value",
            onlyInterest.toFixed(2)
          )
        )
      }
      if(action.value==="RECOVERY.DUES"){

        dispatch(
          handleField(
            "notice-recovry",
            "components.div.children.formwizardFirstStep.children.paymentDetailsNotice.children.cardContent.children.detailsContainer.children.paymentAmount",
            "props.value",
            totalDues.toFixed(2)
          )
        )
      }
      if(action.value==="RECOVERY.LEASE"){

        dispatch(
          handleField(
            "notice-recovry",
            "components.div.children.formwizardFirstStep.children.paymentDetailsNotice.children.cardContent.children.detailsContainer.children.paymentAmount",
            "props.value",
            ""
          )
        )
      }
          return true

  }
 catch (error) {
  console.log(error);
  }
}

export const getOfflineRentPaymentDetailsFromProperty = async (state, dispatch) => {
  try {
    
    const transitNumber = get(
      state.screenConfiguration.preparedFinalObject,
      "OfflineRentPayment[0].property.transitNumber",
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
                labelKey: "RP_ERR_PROPERTY_NOT_FOUND_WITH_PROPERTY_ID"
              },
              "info"
            )
          );
          dispatch(
            prepareFinalObject(
              "OfflineRentPayment[0].property.transitNumber",
              ""
            )
          )
          dispatch(
            handleField(
              "offline-rent-payment",
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
              "OfflineRentPayment[0].property.pincode",
              Properties[0].propertyDetails.address.pincode
            )
          )
          dispatch(
            prepareFinalObject(
              "OfflineRentPayment[0].property.id",
              Properties[0].propertyDetails.propertyId
            )
          )
           dispatch(
            prepareFinalObject(
              "OfflineRentPayment[0].property.colony",
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
              "OfflineRentPayment[0].applicant[0].name",
              findOwner.ownerDetails.name
            )
          )
          dispatch(
            prepareFinalObject(
              "OfflineRentPayment[0].rentSummary",
              Properties[0].rentSummary
            )
          )
          
          return true
        }
    }
  }
 } catch (error) {
  console.log(error);
  }
}
