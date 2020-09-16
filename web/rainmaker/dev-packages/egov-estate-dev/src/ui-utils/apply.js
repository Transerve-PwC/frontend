import {
  httpRequest
} from "./api";
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
import {
  handleScreenConfigurationFieldChange as handleField
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import store from "redux/store";
import get from "lodash/get";
import set from "lodash/set";
import {
  getQueryArg,
  getFileUrl,
  getFileUrlFromAPI
} from "egov-ui-framework/ui-utils/commons";
import {
  getTenantId
} from "egov-ui-kit/utils/localStorageUtils";
import {
  setBusinessServiceDataToLocalStorage,
  getMultiUnits,
  acceptedFiles,
} from "egov-ui-framework/ui-utils/commons";
import commonConfig from "config/common.js";
import {
  localStorageGet
} from "egov-ui-kit/utils/localStorageUtils";
import {
  getSearchResults,
  getMortgageSearchResults
} from "./commons";
import {
  getUserInfo
} from "egov-ui-kit/utils/localStorageUtils";
import {
  setDocsForEditFlow
} from "./commons";
import {
  getLocaleLabels
} from "egov-ui-framework/ui-utils/commons";
let userInfo = JSON.parse(getUserInfo());

export const applyEstates = async (state, dispatch, activeIndex) => {
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
    set(queryObject[0], "propertyDetails.dateOfAuction", convertDateToEpoch(queryObject[0].propertyDetails.dateOfAuction))
    set(queryObject[0], "propertyDetails.lastNocDate", convertDateToEpoch(queryObject[0].propertyDetails.lastNocDate))

    var purchaseDetails = get(
      queryObject[0],
      "propertyDetails.purchaseDetails",
      []
    )
    
    if (purchaseDetails) {
      purchaseDetails.map((item, index) => {
        if (typeof item.isDeleted === "undefined") {
          set(queryObject[0], `propertyDetails.purchaseDetails[${index}].dateOfRegistration`, convertDateToEpoch(queryObject[0].propertyDetails.purchaseDetails[index].dateOfRegistration));
        }
      })
    }

    var ownerDetails = get(
      queryObject[0],
      "propertyDetails.owners",
      []
    )
    
    if (ownerDetails) {
      ownerDetails.map((item, index) => {
        if (typeof item.isDeleted === "undefined") {
          set(queryObject[0], `propertyDetails.owners[${index}].ownerDetails.possesionDate`, convertDateToEpoch(queryObject[0].propertyDetails.owners[index].ownerDetails.possesionDate));
          set(queryObject[0], `propertyDetails.owners[${index}].ownerDetails.dateOfAllotment`, convertDateToEpoch(queryObject[0].propertyDetails.owners[index].ownerDetails.dateOfAllotment));

          if (!!queryObject[0].propertyDetails.owners[index].ownerDetails.paymentDetails && queryObject[0].propertyDetails.owners[index].ownerDetails.paymentDetails.length) {
            set(queryObject[0], `propertyDetails.owners[${index}].ownerDetails.paymentDetails[0].grDueDateOfPayment`, convertDateToEpoch(queryObject[0].propertyDetails.owners[index].ownerDetails.paymentDetails[0].grDueDateOfPayment));
            set(queryObject[0], `propertyDetails.owners[${index}].ownerDetails.paymentDetails[0].grDateOfDeposit`, convertDateToEpoch(queryObject[0].propertyDetails.owners[index].ownerDetails.paymentDetails[0].grDateOfDeposit));
            set(queryObject[0], `propertyDetails.owners[${index}].ownerDetails.paymentDetails[0].grReceiptDate`, convertDateToEpoch(queryObject[0].propertyDetails.owners[index].ownerDetails.paymentDetails[0].grReceiptDate));
            set(queryObject[0], `propertyDetails.owners[${index}].ownerDetails.paymentDetails[0].stDateOfDeposit`, convertDateToEpoch(queryObject[0].propertyDetails.owners[index].ownerDetails.paymentDetails[0].stDateOfDeposit));
            set(queryObject[0], `propertyDetails.owners[${index}].ownerDetails.paymentDetails[0].stReceiptDate`, convertDateToEpoch(queryObject[0].propertyDetails.owners[index].ownerDetails.paymentDetails[0].stReceiptDate));
          }
        }
      })
    }

    var courtCaseDetails = get(
      queryObject[0],
      "propertyDetails.courtCases",
      []
    )
    if (courtCaseDetails == null) {
      set(
        queryObject[0],
        "propertyDetails.courtCases",
        []
      )
    }

    if (!id) {
      console.log(queryObject[0]);
      set(queryObject[0], "propertyDetails.owners", [])
      set(queryObject[0], "propertyDetails.purchaseDetails", [])
      set(queryObject[0], "action", "");
      response = await httpRequest(
        "post",
        "/est-services/property-master/_create",
        "",
        [], 
        {
          Properties: queryObject
        }
      );
    } else {
      if ([0,1,2,3,4,5,6,7].indexOf(activeIndex) !== -1) {
        set(queryObject[0], "action", "")
      } else {
        set(queryObject[0], "action", "SUBMIT")
      }

      let owners = get(
        queryObject[0],
        "propertyDetails.owners",
        []
      )
      owners.map((item, index) => {
        let ownerDocuments = get(queryObject[0], `propertyDetails.owners[${index}].ownerDetails.ownerDocuments`) || [];
        ownerDocuments = ownerDocuments.map(item => ({
          ...item,
          isActive: true
        }))

        const removedDocs = get(state.screenConfiguration.preparedFinalObject, `propertyDetails.owners[${index}].ownerDetails.removedDocs`) || [];
        ownerDocuments = [...ownerDocuments, ...removedDocs]
        set(queryObject[0], `propertyDetails.owners[${index}].ownerDetails.ownerDocuments`, ownerDocuments)
      })

      
      /* let ownerDocuments = get(queryObject[0], "ownerDetails.ownerDocuments") || [];
      ownerDocuments = ownerDocuments.map(item => ({
        ...item,
        active: true
      }))
      const removedDocs = get(state.screenConfiguration.preparedFinalObject, "PropertiesTemp[0].removedDocs") || [];
      ownerDocuments = [...ownerDocuments, ...removedDocs]
      set(queryObject[0], "ownerDetails.ownerDocuments", ownerDocuments) */

      response = await httpRequest(
        "post",
        "/est-services/property-master/_update",
        "",
        [], {
          Properties: queryObject
        }
      );
    }
    let {
      Properties
    } = response

    let owners = get(
      Properties[0],
      "propertyDetails.owners",
      []
    )

    if (owners) {
      owners.map((item, index) => {
        let ownerDocuments = Properties[0].propertyDetails.owners[index].ownerDocuments || [];
        const removedDocs = ownerDocuments.filter(item => !item.isActive)
        ownerDocuments = ownerDocuments.filter(item => item.isActive)
        Properties[0].propertyDetails.owners[index].ownerDetails.ownerDocuments = ownerDocuments;
        dispatch(
          prepareFinalObject(
            `Properties[0].propertyDetails.owners[${index}].removedDocs`,
            removedDocs
          )
        );
      })
    }
    // let ownerDocuments = Properties[0].propertyDetails.ownerDocuments || [];
    // const removedDocs = ownerDocuments.filter(item => !item.active)
    // ownerDocuments = ownerDocuments.filter(item => !!item.active)
    // Properties = [{
    //   ...Properties[0],
    //   propertyDetails: {
    //     ...Properties[0].propertyDetails,
    //     ownerDocuments
    //   }
    // }]
    dispatch(prepareFinalObject("Properties", Properties));
    // dispatch(
    //   prepareFinalObject(
    //     "Properties[0].removedDocs",
    //     removedDocs
    //   )
    // );
    return true;
  } catch (error) {
    dispatch(toggleSnackbar(true, {
      labelName: error.message
    }, "error"));
    console.log(error);
    return false;
  }
}