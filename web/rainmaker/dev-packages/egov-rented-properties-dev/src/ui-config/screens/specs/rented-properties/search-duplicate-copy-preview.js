import {
    getCommonHeader,
    getCommonContainer,
    getCommonCard,
    getCommonGrayCard
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { getQueryArg, setDocuments } from "egov-ui-framework/ui-utils/commons";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getDuplicateCopySearchResults} from "../../../../ui-utils/commons";
import { getDuplicateCopyReviewPropertyAddressDetails , getDuplicateCopyPreviewApplicantDetails} from "./applyResource/review-applications";
import { getReviewDocuments } from "./applyResource/review-documents";
import { footerReview,footerReviewTop } from "./applyResource/reviewFooter";
import { getFeesEstimateCard, createEstimateData, getButtonVisibility } from "../utils";
import { set } from "lodash";
import { handleScreenConfigurationFieldChange as handleField } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import {downloadPrintContainer} from "./applyResource/footer"


let applicationNumber = getQueryArg(window.location.href, "applicationNumber");
const headerrow = getCommonContainer({
    header: getCommonHeader({
      labelName: "Duplicate Copy Application",
      labelKey: "DUPLICATE_COPY_APPLICATION_HEADER"
    }),
    applicationNumber: {
      uiFramework: "custom-atoms-local",
      moduleName: "egov-rented-properties",
      componentPath: "ApplicationNoContainer",
      props: {
        number: applicationNumber
      }
    }
});

const reviewApplicantDetails = getDuplicateCopyPreviewApplicantDetails(false);
const reviewPropertyAddressDetails = getDuplicateCopyReviewPropertyAddressDetails(false)
const reviewDuplicateCopyDocuments = getReviewDocuments(false, "duplicate-copy-apply","DuplicateTemp[0].reviewDocData")

const estimate = getCommonGrayCard({
  estimateSection: getFeesEstimateCard({
    sourceJsonPath: "DuplicateTemp[0].estimateCardData"
  })
});

const duplicateReviewDetails = getCommonCard({
    estimate,
    reviewPropertyAddressDetails,
    reviewApplicantDetails,
    reviewDuplicateCopyDocuments
})

  const beforeInitFn = async(action, state, dispatch) => {
    dispatch(prepareFinalObject("workflow.ProcessInstances", []))
    const applicationNumber = getQueryArg(window.location.href, "applicationNumber");
    const tenantId = getQueryArg(window.location.href, "tenantId")
      if(!!applicationNumber) {
        const queryObject = [
          {key: "applicationNumber", value: applicationNumber}
        ]
        const response = await getDuplicateCopySearchResults(queryObject);
        if (response && response.DuplicateCopyApplications) {
        let {DuplicateCopyApplications} = response
        let applicationDocuments = DuplicateCopyApplications[0].applicationDocuments|| [];
        const removedDocs = applicationDocuments.filter(item => !item.active)
        applicationDocuments = applicationDocuments.filter(item => !!item.active)
        DuplicateCopyApplications = [{...DuplicateCopyApplications[0], applicationDocuments}]
        const status = DuplicateCopyApplications[0].state
        dispatch(prepareFinalObject("DuplicateCopyApplications", DuplicateCopyApplications))
        dispatch(
          prepareFinalObject(
            "DuplicateTemp[0].removedDocs",
            removedDocs
          )
        );
        await setDocuments(
          response,
          "DuplicateCopyApplications[0].applicationDocuments",
          "DuplicateTemp[0].reviewDocData",
          dispatch,'RP'
        );

        const estimateResponse = await createEstimateData(
          response.DuplicateCopyApplications[0],
          "DuplicateTemp[0].estimateCardData",
          dispatch,
          window.location.href,
          "DuplicateCopyOfAllotmentLetterRP"
        );
     
        const printCont = downloadPrintContainer(
          action,
          state,
          dispatch,
          status,
          applicationNumber,
          tenantId, "duplicate-copy","DC" ,"DuplicateCopyApplications",
        );

    set(
      action,
      "screenConfig.components.div.children.headerDiv.children.helpSection.children",
      printCont
    );

        const footer = footerReview(
          action,
          state,
          dispatch,
          status,
          applicationNumber,
          tenantId,
          "DuplicateCopyOfAllotmentLetterRP"
        );

        process.env.REACT_APP_NAME === "Citizen"
        ? set(action, "screenConfig.components.div.children.footer", footer)
        : set(action, "screenConfig.components.div.children.footer", {});

        const showEstimate = process.env.REACT_APP_NAME === "Citizen" ? status === "DC_PENDINGPAYMENT" || status === "DC_PENDINGCLAPPROVAL" || status === "DC_PENDINGSAREJECTION" || status === "DC_APPROVED" || status === "OT_REJECTEDPAID" : !!estimateResponse

        // const showEstimate = status !== "DC_DRAFTED" && status !== "DC_PENDINGCLVERIFICATION" && status !== "DC_PENDINGJAVERIFICATION" && status !== "DC_PENDINGSAVERIFICATION" && status!=="DC_PENDINGCLARIFICATION" && status!=="DC_PENDINGSIVERIFICATION" && status!=="DC_PENDINGCAAPPROVAL" && status!=="DC_PENDINGAPRO"
        dispatch(
          handleField(
              "search-duplicate-copy-preview",
              "components.div.children.duplicateReviewDetails.children.cardContent.children.estimate",
              "visible",
              showEstimate
          )
      );
        }
      }
    }
  
const duplicateCopySearchPreview = {
    uiFramework: "material-ui",
    name: "search-duplicate-copy-preview",
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
                    dataPath: "DuplicateCopyApplications",
                    moduleName: "DuplicateCopyOfAllotmentLetterRP",
                    updateUrl: "/rp-services/duplicatecopy/_update"
                  }
                },
              duplicateReviewDetails
            }
          }
    }
}

export default duplicateCopySearchPreview