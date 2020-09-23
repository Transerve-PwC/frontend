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
  getQueryArg,
} from "egov-ui-framework/ui-utils/commons";
import {
  getUserInfo
} from "egov-ui-kit/utils/localStorageUtils";
let userInfo = JSON.parse(getUserInfo());

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
        if(activeIndex === 0) {
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
        // const applicationNumber = Owners[0].ownerDetails.applicationNumber
        await setDocsForEditFlow(state, dispatch, "Applications[0].applicationDocuments", "temp[0].uploadedDocsInRedux");
        // setApplicationNumberBox(state, dispatch, applicationNumber, "apply")
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
      let tabsArr = [0,1,2,3,4,5,6,7];
      if (screenName == "allotment") {
        tabsArr.pop();
      }
      if (tabsArr.indexOf(activeIndex) !== -1) {
        set(queryObject[0], "action", "")
      } else {
        set(queryObject[0], "action", "SUBMIT")
      }

      let owners = get(
        queryObject[0],
        "propertyDetails.owners",
        []
      )

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