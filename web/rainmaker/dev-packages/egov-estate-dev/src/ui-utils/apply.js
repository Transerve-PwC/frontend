import {
  httpRequest
} from "./api";
import {
  convertDateToEpoch
} from "../ui-config/screens/specs/utils";
import {
  prepareFinalObject,
  toggleSnackbar
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import get from "lodash/get";
import set from "lodash/set";
import {
  getFileUrl,
  getFileUrlFromAPI,
  getQueryArg,
} from "egov-ui-framework/ui-utils/commons";
import {
  getUserInfo
} from "egov-ui-kit/utils/localStorageUtils";
import { handleScreenConfigurationFieldChange as handleField } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getTenantId } from "egov-ui-kit/utils/localStorageUtils";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";

let userInfo = JSON.parse(getUserInfo());

export const setApplicationNumberBox = ({dispatch, applicationNumber, screenKey}) => {
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

export const setDocsForEditFlow = async (state, dispatch, sourceJsonPath, destinationJsonPath) => {
  let applicationDocuments = get(
    state.screenConfiguration.preparedFinalObject,
    sourceJsonPath,
    []
  ) || []
  applicationDocuments = applicationDocuments.filter(item => !!item && !!item.isActive && !!item.fileStoreId)
  let uploadedDocuments = {};
  let fileStoreIds = applicationDocuments && applicationDocuments.map(item => item && item.fileStoreId).filter(item => !!item).join(",");
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
          fileUrl: fileUrlPayload[item.fileStoreId],
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


export const applyforApplication = async (state, dispatch, activeIndex) => {
  try {
    let queryObject = JSON.parse(JSON.stringify(get(state.screenConfiguration.preparedFinalObject, "Applications", {})))
    const tenantId = userInfo.permanentCity || getTenantId();
    set(queryObject[0], "tenantId", tenantId);

    const id = get(queryObject[0], "id");
    let response;
    if(!id) {
      set(queryObject[0], "state", "");
      set(queryObject[0], "action", "");
      response = await httpRequest(
        "post",
        "/est-services/application/_create",
        "",
        [],
        { Applications : queryObject }
      );
    } else {
        if(activeIndex === 0 || activeIndex === 1) {
          set(queryObject[0], "action", "")
        } else {
          set(queryObject[0], "action", "SUBMIT")
          }
        let applicationDocuments = get(queryObject[0], "applicationDocuments") || [];
        applicationDocuments = applicationDocuments.filter(item => !!item && !!item.fileStoreId).filter((item, index, arr) => (arr.findIndex((arrItem) => arrItem.fileStoreId === item.fileStoreId)) === index).map(item => ({...item, isActive: true}))
          const removedDocs = get(state.screenConfiguration.preparedFinalObject, "temp[0].removedDocs") || [];
          applicationDocuments = [...applicationDocuments, ...removedDocs]
          set(queryObject[0], "applicationDocuments", applicationDocuments)
          response = await httpRequest(
            "post",
            "/est-services/application/_update",
            "",
            [],
            { Applications: queryObject }
          );
      }
        let {Applications} = response
        let applicationDocuments = Applications[0].applicationDocuments || [];
        const removedDocs = applicationDocuments.filter(item => !item.isActive)
        applicationDocuments = applicationDocuments.filter(item => !!item.isActive)
        Applications = [{...Applications[0], applicationDocuments }]
        dispatch(prepareFinalObject("Applications", Applications));
        dispatch(
          prepareFinalObject(
            "temp[0].removedDocs",
            removedDocs
          )
        );
        const applicationNumber = Applications[0].applicationNumber
        await setDocsForEditFlow(state, dispatch, "Applications[0].applicationDocuments", "temp[0].uploadedDocsInRedux");
        setApplicationNumberBox({dispatch, applicationNumber, screenKey: "_apply"})
        return true;
  } catch (error) {
    dispatch(toggleSnackbar(true, { labelName: error.message }, "error"));
    console.log(error);
    return false;
  }
}

export const applyEstates = async (state, dispatch, activeIndex, screenName = "apply") => {
  try {
    let queryObject = JSON.parse(
      JSON.stringify(
        get(state.screenConfiguration.preparedFinalObject, "Properties", [])
      )
    );
    const tenantId = getQueryArg(window.location.href, "tenantId");
    const id = get(queryObject[0], "id");
    var currOwners = [];
    var prevOwners = [];
    var owners = [];

    let response;
    set(queryObject[0], "tenantId", tenantId);
    set(queryObject[0], "propertyDetails.dateOfAuction", convertDateToEpoch(queryObject[0].propertyDetails.dateOfAuction))
    set(queryObject[0], "propertyDetails.lastNocDate", convertDateToEpoch(queryObject[0].propertyDetails.lastNocDate))
    set(queryObject[0], "propertyDetails.companyRegistrationDate", convertDateToEpoch(queryObject[0].propertyDetails.companyRegistrationDate))
    set(queryObject[0], "propertyDetails.emdDate", convertDateToEpoch(queryObject[0].propertyDetails.emdDate));

    if (queryObject[0].propertyDetails.paymentConfig) {
      set(queryObject[0], "propertyDetails.paymentConfig.dueDateOfPayment", convertDateToEpoch(queryObject[0].propertyDetails.paymentConfig.dueDateOfPayment));
      set(queryObject[0], "propertyDetails.paymentConfig.groundRentAdvanceRentDate", convertDateToEpoch(queryObject[0].propertyDetails.paymentConfig.groundRentAdvanceRentDate));
      set(queryObject[0], "propertyDetails.paymentConfig.groundRentBillStartDate", convertDateToEpoch(queryObject[0].propertyDetails.paymentConfig.groundRentBillStartDate));

      if (queryObject[0].propertyDetails.paymentConfig.premiumAmountConfigItems && queryObject[0].propertyDetails.paymentConfig.premiumAmountConfigItems.length) {
        for (var i=0; i<queryObject[0].propertyDetails.paymentConfig.premiumAmountConfigItems.length; i++) {
          set(queryObject[0], `propertyDetails.paymentConfig.premiumAmountConfigItems[${i}].premiumAmountDate`, convertDateToEpoch(queryObject[0].propertyDetails.paymentConfig.premiumAmountConfigItems[i].premiumAmountDate));
        }
      }
    }

    if (queryObject[0].propertyDetails.estateDemands && queryObject[0].propertyDetails.estateDemands.length) {
      set(queryObject[0], "propertyDetails.estateDemands[0].generationDate", convertDateToEpoch(queryObject[0].propertyDetails.estateDemands[0].generationDate))
    }

    if (queryObject[0].propertyDetails.estateDemands && queryObject[0].propertyDetails.estateDemands.length) {
      set(queryObject[0], "propertyDetails.estateDemands[0].isPrevious", true);
    }

    prevOwners = get(
      queryObject[0],
      "propertyDetails.purchaser",
      []
    )
    
    if (prevOwners.length) {
      prevOwners = prevOwners.filter(item => item.ownerDetails.isPreviousOwnerRequired == "true");
      prevOwners.map((item, index) => {
        if (typeof item.isDeleted === "undefined") {
          set(queryObject[0], `propertyDetails.purchaser[${index}].ownerDetails.dob`, convertDateToEpoch(queryObject[0].propertyDetails.purchaser[index].ownerDetails.dob))
        }
      })
    }

    owners = get(
      queryObject[0],
      "propertyDetails.owners",
      []
    )
    
    if (owners.length) {
      owners.map((item, index) => {
        if (typeof item.isDeleted === "undefined") {
          set(queryObject[0], `propertyDetails.owners[${index}].ownerDetails.possesionDate`, convertDateToEpoch(queryObject[0].propertyDetails.owners[index].ownerDetails.possesionDate));
          set(queryObject[0], `propertyDetails.owners[${index}].ownerDetails.dateOfAllotment`, convertDateToEpoch(queryObject[0].propertyDetails.owners[index].ownerDetails.dateOfAllotment));
          set(queryObject[0], `propertyDetails.owners[${index}].ownerDetails.dob`, convertDateToEpoch(queryObject[0].propertyDetails.owners[index].ownerDetails.dob));
          ;
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
      set(queryObject[0], "propertyDetails.purchaser", [])
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
      if (response) {
        /* code to set file number in the file number container and disable file number field */
        let fileNumber = response.Properties[0].fileNumber;
        dispatch(
          handleField(
            screenName,
            `components.div.children.headerDiv.children.header.children.fileNumber`,
            `props.number`,
            fileNumber
          )
        )
        dispatch(
          handleField(
            screenName,
            `components.div.children.headerDiv.children.header.children.fileNumber`,
            `visible`,
            true
          )
        )
        dispatch(
          handleField(
            screenName,
            `components.div.children.formwizardFirstStep.children.propertyInfoDetails.children.cardContent.children.detailsContainer.children.fileNumber`,
            `props.disabled`,
            true
          )
        )
        /*****************************************************************************************/
      }
    } else {
      let tabsArr = [0,1,2,3,4,5,6,7,8];
      if (screenName == "allotment" || screenName == "apply-manimajra") {
        tabsArr.splice(-2, 2);
      }
      else if (screenName == "apply-building-branch") {
        tabsArr = tabsArr.splice(0, tabsArr.length - 6);
      }
      if (tabsArr.indexOf(activeIndex) !== -1) {
        set(queryObject[0], "action", "")
      } else {
        set(queryObject[0], "action", "SUBMIT")
      }

      if (screenName != "apply-building-branch") {
        owners = owners.map(item => ({...item, ownerDetails: {...item.ownerDetails, isCurrentOwner: true}}))
        prevOwners = prevOwners.map(item => ({...item, ownerDetails: {...item.ownerDetails, isCurrentOwner: false}}))
        owners = [...owners, ...prevOwners];
      
        set(
          queryObject[0],
          "propertyDetails.owners",
          owners
        )
      }

      if (owners) {
        owners.map((item, index) => {
          let ownerDocuments = get(queryObject[0], `propertyDetails.owners[${index}].ownerDetails.ownerDocuments`) || [];
          ownerDocuments = ownerDocuments.filter(item => !!item && !!item.fileStoreId);
          ownerDocuments = ownerDocuments.map(item => ({
            ...item,
            isActive: true
          }))

          const removedDocs = get(state.screenConfiguration.preparedFinalObject, `propertyDetails.owners[${index}].ownerDetails.removedDocs`) || [];
          ownerDocuments = [...ownerDocuments, ...removedDocs]
          set(queryObject[0], `propertyDetails.owners[${index}].ownerDetails.ownerDocuments`, ownerDocuments)
        })
      }

      console.log(JSON.stringify(queryObject));

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

    let ratePerSqft = Properties[0].propertyDetails.ratePerSqft;
    let areaSqft = Properties[0].propertyDetails.areaSqft;
    
    ratePerSqft = !!ratePerSqft ? ratePerSqft.toString() : ratePerSqft;
    areaSqft = !!areaSqft ? areaSqft.toString() : areaSqft;

    if (Properties[0].propertyDetails.paymentConfig) {
      var isGroundRent = Properties[0].propertyDetails.paymentConfig.isGroundRent;
      var isIntrestApplicable = Properties[0].propertyDetails.paymentConfig.isIntrestApplicable;
      var noOfMonths = Properties[0].propertyDetails.paymentConfig.noOfMonths;
      var premiumAmountConfigItems = Properties[0].propertyDetails.paymentConfig.premiumAmountConfigItems ? Properties[0].propertyDetails.paymentConfig.premiumAmountConfigItems : []

      isGroundRent = isGroundRent != null ? isGroundRent.toString() : isGroundRent;
      isIntrestApplicable = isIntrestApplicable != null ? isIntrestApplicable.toString() : isIntrestApplicable;
      noOfMonths = noOfMonths != null ? noOfMonths.toString() : noOfMonths;
    }

    owners = get(
      Properties[0],
      "propertyDetails.owners",
      []
    )

    if (owners) {
      owners.map((item, index) => {
        item.share = (item.share).toString();
        let ownerDocuments = Properties[0].propertyDetails.owners[index].ownerDetails.ownerDocuments || [];
        let isPreviousOwnerRequired = Properties[0].propertyDetails.owners[index].ownerDetails.isPreviousOwnerRequired;
        if (typeof isPreviousOwnerRequired != "undefined" && isPreviousOwnerRequired != null) {
          isPreviousOwnerRequired = isPreviousOwnerRequired.toString();
          Properties[0].propertyDetails.owners[index].ownerDetails.isPreviousOwnerRequired = isPreviousOwnerRequired;
        }
        const removedDocs = ownerDocuments.filter(item => !item.isActive)
        ownerDocuments = ownerDocuments.filter(item => item.isActive)
        Properties[0].propertyDetails.owners[index].ownerDetails.ownerDocuments = ownerDocuments;
        Properties[0].propertyDetails.owners[index].ownerDetails.removedDocs = removedDocs;
      })
      
      if (screenName != "apply-building-branch") {
        currOwners = owners.filter(item => item.ownerDetails.isCurrentOwner == true);
        prevOwners = owners.filter(item => item.ownerDetails.isCurrentOwner == false);

        Properties = [{...Properties[0], propertyDetails: {...Properties[0].propertyDetails, owners: currOwners, purchaser: prevOwners, ratePerSqft: ratePerSqft, areaSqft: areaSqft, paymentConfig: {...Properties[0].propertyDetails.paymentConfig, isGroundRent: isGroundRent, isIntrestApplicable: isIntrestApplicable, noOfMonths: noOfMonths, premiumAmountConfigItems: premiumAmountConfigItems}}}]
      }
    }

    let {estateRentSummary} = Properties[0]
    if(!!estateRentSummary){
      estateRentSummary.outstanding =  (Number(estateRentSummary.balanceRent) + 
      Number(estateRentSummary.balanceGST) + Number(estateRentSummary.balanceGSTPenalty) +
      Number(estateRentSummary.balanceRentPenalty)).toFixed(2)
      estateRentSummary.balanceGST =  Number(estateRentSummary.balanceGST).toFixed(2)
      estateRentSummary.balanceRent = Number(estateRentSummary.balanceRent).toFixed(2)
      estateRentSummary.collectedRent = Number(estateRentSummary.collectedRent).toFixed(2)
      estateRentSummary.balanceGSTPenalty = Number(estateRentSummary.balanceGSTPenalty).toFixed(2)
      estateRentSummary.balanceRentPenalty = Number(estateRentSummary.balanceRentPenalty).toFixed(2)
  }
    Properties = [{...Properties[0], estateRentSummary: estateRentSummary}]

    dispatch(prepareFinalObject("Properties", Properties));

    let activeIndexArr = screenName == "apply-manimajra" ? [3,4] : [4,5];

    if (screenName == "apply" || screenName == "apply-manimajra") {
      if (activeIndex == activeIndexArr[0] || activeIndex == activeIndexArr[1]) {
        prevOwners.map((item, index) => {
          setDocsForEditFlow(state, dispatch, `Properties[0].propertyDetails.purchaser[${index}].ownerDetails.ownerDocuments`, `PropertiesTemp[0].propertyDetails.purchaser[${index}].ownerDetails.uploadedDocsInRedux`);
        })
      }
      else {
        currOwners.map((item, index) => {
          setDocsForEditFlow(state, dispatch, `Properties[0].propertyDetails.owners[${index}].ownerDetails.ownerDocuments`, `PropertiesTemp[0].propertyDetails.owners[${index}].ownerDetails.uploadedDocsInRedux`);
        })
      }
    }
    else {
      currOwners.map((item, index) => {
        setDocsForEditFlow(state, dispatch, `Properties[0].propertyDetails.owners[${index}].ownerDetails.ownerDocuments`, `PropertiesTemp[0].propertyDetails.owners[${index}].ownerDetails.uploadedDocsInRedux`);
      })
    }

    return true;
  } catch (error) {
    dispatch(toggleSnackbar(true, {
      labelName: error.message
    }, "error"));
    console.log(error);
    return false;
  }
}

export const addPenalty = async (state, dispatch, activeIndex) => {
  try {
    let queryObject = JSON.parse(JSON.stringify(get(state.screenConfiguration.preparedFinalObject, "propertyPenalties", [])))
    const tenantId = userInfo.permanentCity || getTenantId();
    let properties = JSON.parse(JSON.stringify(get(state.screenConfiguration.preparedFinalObject, "Properties", [])))
    const propertyId = properties[0].id;
    const fileNumber = properties[0].fileNumber
    set(queryObject[0], "property", {
      "id":propertyId
    });
    let response;
    if(queryObject) {  
      response = await httpRequest(
        "post",
        "/est-services/violation/_penalty",
        "",
        [],
        { propertyPenalties : queryObject }
      );
    } 
      let {PropertyPenalties} = response
      if(response){
        dispatch(
          setRoute(
          `acknowledgement?purpose=penalty&fileNumber=${fileNumber}&status=success&tenantId=${tenantId}`
          )
        )
      }
      dispatch(prepareFinalObject("PropertyPenalties", PropertyPenalties));
      return true;
  } catch (error) {
    dispatch(toggleSnackbar(true, { labelName: error.message }, "error"));
    console.log(error);
    return false;
  }
}

export const createExtensionFee = async (state, dispatch, activeIndex) => {
  try {
    let queryObject = JSON.parse(JSON.stringify(get(state.screenConfiguration.preparedFinalObject, "ExtensionFees", [])))
    const tenantId = userInfo.permanentCity || getTenantId();
    let properties = JSON.parse(JSON.stringify(get(state.screenConfiguration.preparedFinalObject, "Properties", [])))
    const propertyId = properties[0].id;
    const fileNumber = properties[0].fileNumber
    set(queryObject[0], "property", {
      "id":propertyId
    });
    let response;
    if(queryObject) {  
      response = await httpRequest(
        "post",
        "/est-services/extension-fee/_create",
        "",
        [],
        { ExtensionFees : queryObject }
      );
    } 
      let {ExtensionFees} = response
      if(response){
        dispatch(
          setRoute(
          `acknowledgement?purpose=extensionFee&fileNumber=${fileNumber}&status=success&tenantId=${tenantId}`
          )
        )
      }
      dispatch(prepareFinalObject("ExtensionFees", ExtensionFees));
      return true;
  } catch (error) {
    dispatch(toggleSnackbar(true, { labelName: error.message }, "error"));
    console.log(error);
    return false;
  }
}


