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
import { getSearchResults } from "./commons";
import { getUserInfo } from "egov-ui-kit/utils/localStorageUtils";

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
          set(queryObject[0], "masterDataAction", "INITIATE");
          response = await httpRequest(
            "post",
            "/csp/property/_create",
            "",
            [],
            { Properties: queryObject }
          );
        } else {
          if(activeIndex === 0) {
            set(queryObject[0], "masterDataAction", "MODIFY")
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
            "/csp/property/_update",
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
        set(queryObject[0], "applicationStatus", "");
        set(queryObject[0], "ownerDetails.phone", userInfo.userName)
        set(queryObject[0], "ownerDetails.permanent", false)
        set(queryObject[0], "isPrimaryOwner", true);
        set(queryObject[0], "activeState", true);
        set(queryObject[0], "ownerDetails.applicationType", "CitizenApplication")
        set(queryObject[0], "ownerDetails.dateOfDeathAllottee", convertDateToEpoch(queryObject[0].ownerDetails.dateOfDeathAllottee))
        if(!id) {
          set(queryObject[0], "action", "INITIATE");
          response = await httpRequest(
            "post",
            "/csp/ownership-transfer/_create",
            "",
            [],
            { Owners: queryObject }
          );
        }
        let {Owners} = response
        dispatch(prepareFinalObject("Owners", Owners));
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
      "Properties[0].transitNumber",
      ""
    );
    if(!!transitNumber) {
      let queryObject = [
        { key: "transitNumber", value: transitNumber }
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
              "Properties[0].transitNumber",
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
          const findOwner = owners.find(item => !!item.activeState) || {}
          dispatch(
            prepareFinalObject(
              "Properties[0].area",
              Properties[0].propertyDetails.address.area
            )
          )
          dispatch(
            prepareFinalObject(
              "Properties[0].pincode",
              Properties[0].propertyDetails.address.pincode
            )
          )
          dispatch(
            prepareFinalObject(
              "Owners[0].propertyId",
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
              "Owners[0].ownerDetails.name",
              findOwner.ownerDetails.name
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


export const applyDuplicateCopy = async (state, dispatch, activeIndex) => {
  try {
      let queryObject = JSON.parse(
          JSON.stringify(
            get(state.screenConfiguration.preparedFinalObject, "Owners", [])
          )
        );

        let propertyQueryObject = JSON.parse(
          JSON.stringify(
            get(state.screenConfiguration.preparedFinalObject, "Properties", [])
          )
        );

        console.log(propertyQueryObject);
        console.log(queryObject);
        
        



      const userInfo = JSON.parse(getUserInfo())
      const tenantId = userInfo.permanentCity;
      // const tenantId = getQueryArg(window.location.href, "tenantId");
      const id = get(queryObject[0], "id");
      let response;
      let finalObject = {
        "propertyId": queryObject[0].propertyId,
        "transitNumber": propertyQueryObject[0].transitNumber,
        "tenantId": tenantId,
        "state": "",
        "propertyDetails": "",
        "applicant": [{
          "name": queryObject[0].ownerDetails.name,
          "email": queryObject[0].ownerDetails.email,
          "phone": "7588444040",
          "guardian": "EFG",
          "relationship": queryObject[0].ownerDetails.relationWithDeceasedAllottee,
          "adhaarNumber": queryObject[0].ownerDetails.aadhaarNumber,
        }]
      };








      


      // set(queryObject[0], "tenantId", tenantId);
      // set(queryObject[0], "applicationStatus", "");
      // set(queryObject[0], "activeState", true);
      // set(queryObject[0], "isPrimaryOwner", true);

      // set(queryObject[0], "ownerDetails.phone", userInfo.userName)
      // set(queryObject[0], "ownerDetails.permanent", false)
      // set(queryObject[0], "ownerDetails.applicationType", "CitizenApplication")
      // set(queryObject[0], "ownerDetails.dateOfDeathAllottee", convertDateToEpoch(queryObject[0].ownerDetails.dateOfDeathAllottee))

      console.log(queryObject);
      console.log(id);
      



      if(!id) {
        set(queryObject[0], "action", "INITIATE");

        finalObject.action = "INITIATE"
        response = await httpRequest(
          "post",
          "/csp/duplicatecopy/_create",
          "",
          [],
          { DuplicateCopyApplications: [finalObject] }
        );
      }
      let {Owners} = response
      dispatch(prepareFinalObject("Owners", Owners));
      return true;
  } catch (error) {
      dispatch(toggleSnackbar(true, { labelName: error.message }, "error"));
      console.log(error);
      return false;
  }
}
