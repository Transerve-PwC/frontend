import {
    getCommonHeader,
    getCommonContainer,
    getCommonCard,
    getCommonGrayCard
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { getQueryArg, setDocuments } from "egov-ui-framework/ui-utils/commons";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getOwnershipSearchResults } from "../../../../ui-utils/commons";
import { getReviewApplicantDetails, getreviewPropertyAddressDetails,getReviewPropertyDetailsWithoutAllotmentNumber,getreviewChargesDetails } from "./applyResource/review-applications";
import { getReviewDocuments } from "./applyResource/review-documents";
import {downloadPrintContainer} from "./applyResource/footer"
import { footerReview,footerReviewTop } from "./applyResource/reviewFooter";
import { set } from "lodash";
import { getFeesEstimateCard, createEstimateData, getButtonVisibility } from "../utils";
import { handleScreenConfigurationFieldChange as handleField } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { BILLING_BUSINESS_SERVICE_OT, WORKFLOW_BUSINESS_SERVICE_OT } from "../../../../ui-constants";
import {applicationNumber} from './apply'
import { setApplicationNumberBox } from "../../../../ui-utils/apply";
let NoticedetailsId
const headerrow = getCommonContainer({
    header: getCommonHeader({
      labelName: "Ownership Transfer Application",
      labelKey: "RP_OWNER_SHIP_TRANSFER_APPLICATION_HEADER"
    }),
    applicationNumber,
    allotmentNumber: {
      uiFramework: "custom-atoms-local",
      moduleName: "egov-rented-properties",
      componentPath: "ApplicationNoContainer",
      props: {
        number: NoticedetailsId,
        notice:"ALLOTMENT"
      },
      visible:false
    }
  });

const reviewApplicantDetails = getReviewApplicantDetails(false);
const reviewFreshLicenceDocuments = getReviewDocuments(false, "ownership-apply", "OwnersTemp[0].reviewDocData")
const getreviewCharges=getreviewChargesDetails(false)
const reviewPropertyDetailsWithoutAllotmentNumber = getReviewPropertyDetailsWithoutAllotmentNumber(false)

const estimate = getCommonGrayCard({
  estimateSection: getFeesEstimateCard({
    sourceJsonPath: "OwnersTemp[0].estimateCardData"
  })
});

const transferReviewDetails = getCommonCard({
    estimate,
    reviewPropertyDetailsWithoutAllotmentNumber,
    reviewApplicantDetails,
    getreviewCharges,
    reviewFreshLicenceDocuments
})

const beforeInitFn = async(action, state, dispatch) => {
dispatch(prepareFinalObject("workflow.ProcessInstances", []))
const applicationNumber = getQueryArg(window.location.href, "applicationNumber");
const tenantId = getQueryArg(window.location.href, "tenantId")
  if(!!applicationNumber) {
    const queryObject = [
      {key: "applicationNumber", value: applicationNumber}
    ]
    const response = await getOwnershipSearchResults(queryObject);
    setApplicationNumberBox(state, dispatch, applicationNumber, "ownership-search-preview")
    if (response && response.Owners) {
    let {Owners} = response
    let allotmentnumber=Owners[0].allotmenNumber
    let ownershipTransferDocuments = Owners[0].ownerDetails.ownershipTransferDocuments || [];
    const removedDocs = ownershipTransferDocuments.filter(item => !item.active)
    ownershipTransferDocuments = ownershipTransferDocuments.filter(item => !!item.active)
    Owners = [{...Owners[0], ownerDetails: {...Owners[0].ownerDetails, ownershipTransferDocuments}}]
    const status = Owners[0].applicationState
    if(Owners[0].property.rentSummary){
      Owners = [{...Owners[0], property: {...Owners[0].property, rentSummary:{...Owners[0].property.rentSummary , totalDue : (Owners[0].property.rentSummary.balancePrincipal + 
        Owners[0].property.rentSummary.balanceInterest).toFixed(2)}}}]
    }
  
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
    const estimateResponse = await createEstimateData(
      response.Owners[0],
      "OwnersTemp[0].estimateCardData",
      dispatch,
      window.location.href,
      BILLING_BUSINESS_SERVICE_OT,
      WORKFLOW_BUSINESS_SERVICE_OT
    );

    const printCont = downloadPrintContainer(
      action,
      state,
      dispatch,
      status,
      applicationNumber,
      tenantId,"ownership-transfer","OT"
    );
    if(status == 'OT_APPROVED'){
    //   dispatch(
    //     handleField(
    //       "ownership-search-preview",
    //       "components.div.children.transferReviewDetails.children.cardContent.children.reviewPropertyAddressDetails",
    //       "visible",
    //       true
    //   ),
    // );
    // dispatch(
    //   handleField(
    //     "ownership-search-preview",
    //     "components.div.children.transferReviewDetails.children.cardContent.children.reviewPropertyDetailsWithoutAllotmentNumber",
    //     "visible",
    //     false
    // ),)
    dispatch(
      handleField(
        "ownership-search-preview",
        "components.div.children.headerDiv.children.header.children.allotmentNumber",
        "props.number",
        allotmentnumber
      )
    );  
    dispatch(
      handleField(
        "ownership-search-preview",
        "components.div.children.headerDiv.children.header.children.allotmentNumber",
        "visible",
        true
      )
    );  
    }
    // else{
    //   dispatch(
    //     handleField(
    //       "ownership-search-preview",
    //       "components.div.children.headerDiv.children.header.children.allotmentNumber",
    //       "props.visible",
    //       false
    //     )
    //   );  
    // }
    
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
      BILLING_BUSINESS_SERVICE_OT
    );
    process.env.REACT_APP_NAME === "Citizen"
        ? set(action, "screenConfig.components.div.children.footer", footer)
        : set(action, "screenConfig.components.div.children.footer", {});

    const showEstimate = process.env.REACT_APP_NAME === "Citizen" ? status === "OT_PENDINGPAYMENT" || status === "OT_PENDINGCLAPPROVAL" || status === "OT_PENDINGSAREJECTION" || status === "OT_APPROVED" || status === "OT_REJECTEDPAID" : !!estimateResponse
    
    // const showEstimate = status !== "OT_DRAFTED" && status !== "OT_PENDINGCLVERIFICATION" && status !== "OT_PENDINGJAVERIFICATION" && status !== "OT_PENDINGSAVERIFICATION" && status!=="OT_PENDINGCLARIFICATION"&& status!=="OT_PENDINGSIVERIFICATION"&& status!=="OT_PENDINGCAAPPROVAL"&& status!="OT_PENDINGAPRO"

    dispatch(
      handleField(
          "ownership-search-preview",
          "components.div.children.transferReviewDetails.children.cardContent.children.estimate",
          "visible",
          showEstimate
      )
  );
  
  const showCharge =  status === "OT_PENDINGSIVERIFICATION" || status === "OT_PENDINGCAAPPROVAL" || status === "OT_PENDINGAPRO" 
  process.env.REACT_APP_NAME === "Citizen"
  ? dispatch(
    handleField(
        "ownership-search-preview",
        "components.div.children.transferReviewDetails.children.cardContent.children.getreviewCharges",
        "visible",
        false
    )
)
:
dispatch(
  handleField(
      "ownership-search-preview",
      "components.div.children.transferReviewDetails.children.cardContent.children.getreviewCharges",
      "visible",
      showCharge
  )
)
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
                    dataPath: "Owners",
                    moduleName: WORKFLOW_BUSINESS_SERVICE_OT,
                    updateUrl: "/rp-services/ownership-transfer/_update"
                  }
                },
              transferReviewDetails
            }
          }
    }
}

export default ownerShipDetailsPreview