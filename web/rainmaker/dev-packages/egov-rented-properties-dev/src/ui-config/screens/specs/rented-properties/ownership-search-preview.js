import {
    getCommonHeader,
    getCommonContainer,
    getCommonCard,
    getCommonGrayCard
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { getQueryArg, setDocuments } from "egov-ui-framework/ui-utils/commons";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getOwnershipSearchResults } from "../../../../ui-utils/commons";
import { getReviewApplicantDetails, getreviewPropertyAddressDetails } from "./applyResource/review-applications";
import { getReviewDocuments } from "./applyResource/review-documents";
import { footerReview } from "./applyResource/reviewFooter";
import { set } from "lodash";
import { getFeesEstimateCard, createEstimateData, getButtonVisibility } from "../utils";
import { handleScreenConfigurationFieldChange as handleField } from "egov-ui-framework/ui-redux/screen-configuration/actions";

const headerrow = getCommonContainer({
    header: getCommonHeader({
      labelName: "Ownership Transfer Application",
      labelKey: "OWNER_SHIP_TRANSFER_APPLICATION_HEADER"
    })
  });

const reviewApplicantDetails = getReviewApplicantDetails(false);
const reviewPropertyAddressDetails = getreviewPropertyAddressDetails(false)
const reviewFreshLicenceDocuments = getReviewDocuments(false, "ownership-apply", "OwnersTemp[0].reviewDocData")

const estimate = getCommonGrayCard({
  estimateSection: getFeesEstimateCard({
    sourceJsonPath: "OwnersTemp[0].estimateCardData"
  })
});

const transferReviewDetails = getCommonCard({
    estimate,
    reviewPropertyAddressDetails,
    reviewApplicantDetails,
    reviewFreshLicenceDocuments
})

const beforeInitFn = async(action, state, dispatch) => {
const applicationNumber = getQueryArg(window.location.href, "applicationNumber");
const tenantId = getQueryArg(window.location.href, "tenantId")
  if(!!applicationNumber) {
    const queryObject = [
      {key: "applicationNumber", value: applicationNumber}
    ]
    const response = await getOwnershipSearchResults(queryObject);
    if (response && response.Owners) {
    let {Owners} = response
    let ownershipTransferDocuments = Owners[0].ownerDetails.ownershipTransferDocuments || [];
    const removedDocs = ownershipTransferDocuments.filter(item => !item.active)
    ownershipTransferDocuments = ownershipTransferDocuments.filter(item => !!item.active)
    Owners = [{...Owners[0], ownerDetails: {...Owners[0].ownerDetails, ownershipTransferDocuments}}]
    const status = Owners[0].applicationState
    dispatch(prepareFinalObject("Owners", Owners))
    dispatch(
      prepareFinalObject(
        "OwnersTemp[0].removedDocs",
        removedDocs
      )
    );
    await setDocuments(
      response,
      "Owners[0].ownerDetails.ownershipTransferDocuments",
      "OwnersTemp[0].reviewDocData",
      dispatch,'RP'
    );
    createEstimateData(
      response.Owners[0],
      "OwnersTemp[0].estimateCardData",
      dispatch,
      {}
    );
    const footer = footerReview(
      action,
      state,
      dispatch,
      status,
      applicationNumber,
      tenantId,
    );
    process.env.REACT_APP_NAME === "Citizen"
        ? set(action, "screenConfig.components.div.children.footer", footer)
        : set(action, "screenConfig.components.div.children.footer", {});
    const showEstimate = getButtonVisibility(status, "PENDINGPAYMENT");

    dispatch(
      handleField(
          "ownership-search-preview",
          "components.div.children.transferReviewDetails.children.cardContent.children.estimate",
          "visible",
          showEstimate
      )
  );
    }
  }
}

const ownerShipDetailsPreview = {
    uiFramework: "material-ui",
    name: "ownership-search-preview",
    beforeInitScreen: (action, state, dispatch) => {
        beforeInitFn(action, state, dispatch)
        return action
    },
    components: {
        div: {
            uiFramework: "custom-atoms",
            componentPath: "Div",
            props: {
              className: "common-div-css search-preview"
            },
            children: {
              headerDiv: {
                uiFramework: "custom-atoms",
                componentPath: "Container",
                children: {
                  header1: {
                    gridDefination: {
                      xs: 12,
                      sm: 8
                    },
                   ...headerrow
                  },
                  helpSection: {
                    uiFramework: "custom-atoms",
                    componentPath: "Container",
                    props: {
                      color: "primary",
                      style: { justifyContent: "flex-end" }
                    },
                    gridDefination: {
                      xs: 12,
                      sm: 4,
                      align: "right"
                    }
                  }
                  }
                },
                taskStatus: {
                  uiFramework: "custom-containers-local",
                  moduleName: "egov-rented-properties",
                  componentPath: "WorkFlowContainer",
                  props: {
                    dataPath: "Owners",
                    moduleName: "OwnershipTransferRP",
                    updateUrl: "/csp/ownership-transfer/_update"
                  }
                },
              transferReviewDetails
            }
          }
    }
}

export default ownerShipDetailsPreview