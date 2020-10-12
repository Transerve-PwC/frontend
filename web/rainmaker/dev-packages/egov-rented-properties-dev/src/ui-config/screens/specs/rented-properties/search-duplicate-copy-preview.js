import {
    getCommonHeader,
    getCommonContainer,
    getCommonCard,
    getCommonGrayCard
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { getQueryArg, setDocuments } from "egov-ui-framework/ui-utils/commons";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getDuplicateCopySearchResults} from "../../../../ui-utils/commons";
import { getDuplicateCopyReviewPropertyAddressDetails , getDuplicateCopyPreviewApplicantDetails,getduplicatereviewChargesDetails} from "./applyResource/review-applications";
import { getReviewDocuments } from "./applyResource/review-documents";
import { footerReview,footerReviewTop } from "./applyResource/reviewFooter";
import { getFeesEstimateCard, createEstimateData } from "../utils";
import { set } from "lodash";
import { handleScreenConfigurationFieldChange as handleField } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import {downloadPrintContainer} from "./applyResource/footer"
import { WORKFLOW_BUSINESS_SERVICE_DC, BILLING_BUSINESS_SERVICE_DC } from "../../../../ui-constants";
import { setApplicationNumberBox } from "../../../../ui-utils/apply";
import {applicationNumber} from './apply'

const headerrow = getCommonContainer({
    header: getCommonHeader({
      labelName: "Duplicate Copy Application",
      labelKey: "RP_DUPLICATE_COPY_APPLICATION_HEADER"
    }),
    applicationNumber
});

const reviewApplicantDetails = getDuplicateCopyPreviewApplicantDetails(false);
const reviewPropertyAddressDetails = getDuplicateCopyReviewPropertyAddressDetails(false)
const reviewDuplicateCopyDocuments = getReviewDocuments(false, "duplicate-copy-apply","DuplicateTemp[0].reviewDocData")
const duplicatereviewChargesDetails=getduplicatereviewChargesDetails(false)
const estimate = getCommonGrayCard({
  estimateSection: getFeesEstimateCard({
    sourceJsonPath: "DuplicateTemp[0].estimateCardData"
  })
});

const duplicateReviewDetails = getCommonCard({
    estimate,
    reviewPropertyAddressDetails,
    reviewApplicantDetails,
    duplicatereviewChargesDetails,
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
        setApplicationNumberBox(state, dispatch, applicationNumber, "search-duplicate-copy-preview")
        if (response && response.DuplicateCopyApplications) {
        let {DuplicateCopyApplications} = response
        let billingBuisinessService=DuplicateCopyApplications[0].billingBusinessService
        let applicationDocuments = DuplicateCopyApplications[0].applicationDocuments|| [];
        const removedDocs = applicationDocuments.filter(item => !item.active)
        applicationDocuments = applicationDocuments.filter(item => !!item.active)
        DuplicateCopyApplications = [{...DuplicateCopyApplications[0], applicationDocuments}]
        if(DuplicateCopyApplications[0].property.rentSummary){
          DuplicateCopyApplications = [{...DuplicateCopyApplications[0], property: {...DuplicateCopyApplications[0].property, rentSummary:{...DuplicateCopyApplications[0].property.rentSummary , totalDue : (DuplicateCopyApplications[0].property.rentSummary.balancePrincipal + 
            DuplicateCopyApplications[0].property.rentSummary.balanceInterest).toFixed(2)}}}]
        }      
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
          WORKFLOW_BUSINESS_SERVICE_DC
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
          billingBuisinessService
        );

        process.env.REACT_APP_NAME === "Citizen"
        ? set(action, "screenConfig.components.div.children.footer", footer)
        : set(action, "screenConfig.components.div.children.footer", {});

        const showEstimate = process.env.REACT_APP_NAME === "Citizen" ? status === "DC_PENDINGPAYMENT" || status === "DC_PENDINGCLAPPROVAL" || status === "DC_PENDINGSAREJECTION" || status === "DC_APPROVED" || status === "DC_REJECTEDPAID" : !!estimateResponse

        // const showEstimate = status !== "DC_DRAFTED" && status !== "DC_PENDINGCLVERIFICATION" && status !== "DC_PENDINGJAVERIFICATION" && status !== "DC_PENDINGSAVERIFICATION" && status!=="DC_PENDINGCLARIFICATION" && status!=="DC_PENDINGSIVERIFICATION" && status!=="DC_PENDINGCAAPPROVAL" && status!=="DC_PENDINGAPRO"
        dispatch(
          handleField(
              "search-duplicate-copy-preview",
              "components.div.children.duplicateReviewDetails.children.cardContent.children.estimate",
              "visible",
              showEstimate
          )
      );
      const showCharge =  status === "DC_PENDINGSIVERIFICATION" || status === "DC_PENDINGCAAPPROVAL" || status === "DC_PENDINGAPRO" 
      process.env.REACT_APP_NAME === "Citizen"
    ?  dispatch(
    handleField(
        "search-duplicate-copy-preview",
        "components.div.children.duplicateReviewDetails.children.cardContent.children.duplicatereviewChargesDetails",
        "visible",
        false
    )
)
:
dispatch(
  handleField(
      "search-duplicate-copy-preview",
      "components.div.children.duplicateReviewDetails.children.cardContent.children.duplicatereviewChargesDetails",
      "visible",
      showCharge
  )
)
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
                  header: {
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
                    moduleName: WORKFLOW_BUSINESS_SERVICE_DC,
                    updateUrl: "/rp-services/duplicatecopy/_update"
                  }
                },
              duplicateReviewDetails
            }
          }
    }
}

export default duplicateCopySearchPreview