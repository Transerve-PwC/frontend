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
  applicationDocuments = applicationDocuments.filter(item => !!item.isActive)
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


export const applyforApplication = async (state, dispatch, activeIndex) => {
  try {
    let queryObject = JSON.parse(JSON.stringify(get(state.screenConfiguration.preparedFinalObject, "Applications", {})))
    const tenantId = userInfo.permanentCity;
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

    let response;
    set(queryObject[0], "tenantId", tenantId);
    set(queryObject[0], "propertyDetails.dateOfAuction", convertDateToEpoch(queryObject[0].propertyDetails.dateOfAuction))
    set(queryObject[0], "propertyDetails.lastNocDate", convertDateToEpoch(queryObject[0].propertyDetails.lastNocDate))
    set(queryObject[0], "propertyDetails.companyRegistrationDate", convertDateToEpoch(queryObject[0].propertyDetails.companyRegistrationDate))
    set(queryObject[0], "propertyDetails.emdDate", convertDateToEpoch(queryObject[0].propertyDetails.emdDate))

    var prevOwners = get(
      queryObject[0],
      "propertyDetails.purchaser",
      []
    )
    
    if (prevOwners.length) {
      prevOwners = prevOwners.filter(item => item.ownerDetails.previousOwnerRequired == "true");prevOwners.map((item, index) => {
        if (typeof item.isDeleted === "undefined") {
          set(queryObject[0], `propertyDetails.purchaser[${index}].ownerDetails.dob`, convertDateToEpoch(queryObject[0].propertyDetails.purchaser[index].ownerDetails.dob))
        }
      })
    }

    var owners = get(
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
      let tabsArr = [0,1,2,3,4,5,6,7];
      // let owners = get(
      //   queryObject[0],
      //   "propertyDetails.owners",
      //   []
      // )
      // let prevOwners = get(
      //   queryObject[0],
      //   "propertyDetails.purchaser",
      //   []
      // )
      if (screenName == "allotment") {
        tabsArr.pop();
      }
      else if (screenName == "apply-building-branch") {
        tabsArr = tabsArr.splice(0, tabsArr.length - 5);
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
          ownerDocuments = ownerDocuments.map(item => ({
            ...item,
            isActive: true
          }))

          const removedDocs = get(state.screenConfiguration.preparedFinalObject, `propertyDetails.owners[${index}].ownerDetails.removedDocs`) || [];
          ownerDocuments = [...ownerDocuments, ...removedDocs]
          set(queryObject[0], `propertyDetails.owners[${index}].ownerDetails.ownerDocuments`, ownerDocuments)
        })
      }

      
      /* let ownerDocuments = get(queryObject[0], "ownerDetails.ownerDocuments") || [];
      ownerDocuments = ownerDocuments.map(item => ({
        ...item,
        active: true
      }))
      const removedDocs = get(state.screenConfiguration.preparedFinalObject, "PropertiesTemp[0].removedDocs") || [];
      ownerDocuments = [...ownerDocuments, ...removedDocs]
      set(queryObject[0], "ownerDetails.ownerDocuments", ownerDocuments) */

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

    owners = get(
      Properties[0],
      "propertyDetails.owners",
      []
    )

    if (owners) {
      owners.map((item, index) => {
        item.share = (item.share).toString();
        let ownerDocuments = Properties[0].propertyDetails.owners[index].ownerDetails.ownerDocuments || [];
        const removedDocs = ownerDocuments.filter(item => !item.isActive)
        ownerDocuments = ownerDocuments.filter(item => item.isActive)
        Properties[0].propertyDetails.owners[index].ownerDetails.ownerDocuments = ownerDocuments;
        Properties[0].propertyDetails.owners[index].ownerDetails.removedDocs = removedDocs;
      })
      
      if (screenName != "apply-building-branch") {
        let currOwners = owners.filter(item => item.ownerDetails.isCurrentOwner == true);
        let prevOwners = owners.filter(item => item.ownerDetails.isCurrentOwner == false);

        
        currOwners.map((item, index) => {
          setDocsForEditFlow(state, dispatch, `Properties[0].propertyDetails.owners[${index}].ownerDetails.ownerDocuments`, `PropertiesTemp[0].propertyDetails.owners[${index}].ownerDetails.uploadedDocsInRedux`);
        })

        prevOwners.map((item, index) => {
          setDocsForEditFlow(state, dispatch, `Properties[0].propertyDetails.purchaser[${index}].ownerDetails.ownerDocuments`, `PropertiesTemp[0].propertyDetails.purchaser[${index}].ownerDetails.uploadedDocsInRedux`);
        })

        Properties = [{...Properties[0], propertyDetails: {...Properties[0].propertyDetails, owners: currOwners, purchaser: prevOwners, ratePerSqft: ratePerSqft, areaSqft: areaSqft}}]
      }
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