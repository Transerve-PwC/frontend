import {
    getCommonHeader,
  } from "egov-ui-framework/ui-config/screens/specs/utils";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import {
handleScreenConfigurationFieldChange as handleField
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import acknowledgementCard from "./acknowledgementResource/acknowledgementUtils";
import { applicationSuccessFooter } from "./acknowledgementResource/applicationSuccessFooter";
import { paymentFailureFooter } from "./acknowledgementResource/paymentFailureFooter";
import { RP_MASTER_ENTRY, TRANSITSITEIMAGES, NOTICE_GENERATION, PERMISSIONTOMORTGAGE, DUPLICATECOPYOFALLOTMENTLETTERRP, OWNERSHIPTRANSFERRP } from "../../../../ui-constants";

const getAcknowledgementCard = (
    state,
    dispatch,
    purpose,
    status,
    tenant,
    transitNumber,
    applicationNumber,
    type,
    businessService
  ) => {
    if (status === "success") {
      const header = type === OWNERSHIPTRANSFERRP ? purpose === "apply" ? {
        labelName: "Ownership transfer application submitted successfully",
        labelKey: "RP_OWNER_SHIP_TRANSFER_SUCCESS_MESSAGE_MAIN"
      } : purpose === "forward" ? {
        labelName: "Ownership transfer application Forwarded Successfully",
        labelKey: "RP_OWNER_SHIP_FORWARD_SUCCESS_MESSAGE_MAIN"
      } : purpose === "sendback" ? {
        labelName: "Ownership transfer application is sent back Successfully",
        labelKey: "RP_OWNER_SHIP_SENDBACK_CHECKLIST_MESSAGE_HEAD"
      } : purpose ==="reject" ? {
        labelName: "Ownership transfer application is Rejected",
        labelKey: "RP_OWNER_SHIP_APPROVAL_REJ_MESSAGE_HEAD"
      } : purpose === "approve" ? {
        labelName: "Ownership transfer application is Approved Successfully",
        labelKey: "RP_OWNER_SHIP_APPROVAL_SUCCESS_MESSAGE_HEAD"
      } : purpose === "submit" ? {
        labelName: "Ownership transfer application is Submitted Successfully",
        labelKey: "RP_OWNER_SHIP_SUBMISSION_SUCCESS_MESSAGE_HEAD"
      } : {
        labelName: "Payment is collected successfully",
        labelKey: "RP_PAYMENT_SUCCESS_MESSAGE_HEAD"
      } :

      type === DUPLICATECOPYOFALLOTMENTLETTERRP ? purpose === "apply" ? {
        labelName: "Duplicate Copy Allotment application submitted successfully",
        labelKey: "RP_DUPLICATE_COPY_SUCCESS_MESSAGE_MAIN"
      } : purpose === "forward" ? {
        labelName: "Duplicate Copy Allotment application Forwarded Successfully",
        labelKey: "RP_DUPLICATE_COPY_FORWARD_SUCCESS_MESSAGE_MAIN"
      } : purpose === "sendback" ? {
        labelName: "Duplicate Copy Allotment application is sent back Successfully",
        labelKey: "RP_DUPLICATE_COPY_SENDBACK_CHECKLIST_MESSAGE_HEAD"
      } : purpose ==="reject" ? {
        labelName: "Duplicate Copy Allotment application is Rejected",
        labelKey: "RP_DUPLICATE_COPY_APPROVAL_REJ_MESSAGE_HEAD"
      } : purpose === "approve" ? {
        labelName: "Duplicate Copy Allotment application is Approved Successfully",
        labelKey: "RP_DUPLICATE_COPY_APPROVAL_SUCCESS_MESSAGE_HEAD"
      } : purpose === "submit" ? {
        labelName: "Duplicate Copy Allotment application is Submitted Successfully",
        labelKey: "RP_DUPLICATE_COPY_SUBMISSION_SUCCESS_MESSAGE_HEAD"
      } : {
        labelName: "Payment is collected successfully",
        labelKey: "RP_PAYMENT_SUCCESS_MESSAGE_HEAD"
      } 

      :type === PERMISSIONTOMORTGAGE ? purpose === "apply" ? {
        labelName: "Mortgage Application Submitted Successfully",
        labelKey: "RP_MORTGAGE_SUCCESS_MESSAGE_MAIN"
      } : purpose === "forward" ? {
        labelName: "Mortgage Application Forwarded Successfully",
        labelKey: "RP_MORTGAGE_FORWARD_SUCCESS_MESSAGE_MAIN"
      } : purpose === "sendback" ? {
        labelName: "Mortgage Application is sent back Successfully",
        labelKey: "RP_MORTGAGE_SENDBACK_CHECKLIST_MESSAGE_HEAD"
      } : purpose ==="reject" ? {
        labelName: "Mortgage Application is Rejected",
        labelKey: "RP_MORTGAGE_APPROVAL_REJ_MESSAGE_HEAD"
      } : purpose === "approve" ? {
        labelName: "Mortgage Application is Approved Successfully",
        labelKey: "RP_MORTGAGE_APPROVAL_SUCCESS_MESSAGE_HEAD"
      } : purpose === "submit" ? {
        labelName: "Mortgage Application is Submitted Successfully",
        labelKey: "RP_MORTGAGE_SUBMISSION_SUCCESS_MESSAGE_HEAD"
      } : {
        labelName: "Payment is collected successfully",
        labelKey: "RP_PAYMENT_SUCCESS_MESSAGE_HEAD"
      } 
      : type === RP_MASTER_ENTRY ?
       purpose === "apply" ? {
        labelName: "Rented Property Master Entry Submitted Successfully",
        labelKey: "RP_MASTER_ENTRY_SUCCESS_MESSAGE_MAIN"
      }: purpose === "forward" ? {
        labelName: "Rented Property Master Entry Forwarded Successfully",
        labelKey: "RP_FORWARD_SUCCESS_MESSAGE_MAIN"
      } : purpose === "sendback" ? {
        labelName: "Rented Property Master Entry is sent back Successfully",
        labelKey: "RP_SENDBACK_CHECKLIST_MESSAGE_HEAD"
      } : purpose ==="reject" ? {
        labelName: "Rented Property Master Entry is Rejected",
        labelKey: "RP_APPROVAL_REJ_MESSAGE_HEAD"
      } : purpose === "approve" ? {
        labelName: "Rented Property Master Entry is Approved Successfully",
        labelKey: "RP_APPROVAL_SUCCESS_MESSAGE_HEAD"
      } : purpose === "submit" ? {
        labelName: "Rented Property Master Entry is Submitted Successfully",
        labelKey: "RP_SUBMISSION_SUCCESS_MESSAGE_HEAD"
      } : {
        labelName: "Payment is collected successfully",
        labelKey: "RP_PAYMENT_SUCCESS_MESSAGE_HEAD"
      }
      : type === TRANSITSITEIMAGES ?  {
        labelName: "Transit Site Image Capture Submitted Successfully",
        labelKey: "RP_TRANSIT_SITE_IMAGE_MESSAGE_MAIN"
      }
      : type === NOTICE_GENERATION ? {
        labelName: "Notice Generated Successfully",
        labelKey: "RP_NOTICE_GENERATED_SUCCESS_MESSAGE_MAIN"
      } : {
        labelName: "",
        labelKey: ""
      }

      const tailText = type === OWNERSHIPTRANSFERRP || type === DUPLICATECOPYOFALLOTMENTLETTERRP 
      || type === PERMISSIONTOMORTGAGE ? {
        labelName: "Application Number",
        labelKey: "RP_APPLICATION_NUMBER_LABEL"
      } : !!transitNumber ? {
        labelName: "Transit Number",
        labelKey: "RP_SITE_PLOT_LABEL"
      } : {
        labelName: "Application Number",
        labelKey: "RP_APPLICATION_NUMBER_LABEL"
      }

      return {
        header: getCommonHeader({
          labelName: `Rented Properties`,
          labelKey: "RP_COMMON_RENTED_PROPERTIES",
        }),
        applicationSuccessCard: {
          uiFramework: "custom-atoms",
          componentPath: "Div",
          children: {
            card: acknowledgementCard({
              icon: purpose ==="reject" ? "close" : "done",
              backgroundColor: purpose ==="reject" ? "#E54D42" : "#39CB74",
              header,
              body: {
                labelName:
                  "A notification regarding Application Submission has been sent to trade owner at registered Mobile No.",
                labelKey: "TL_APPLICATION_SUCCESS_MESSAGE_SUB"
              },
              tailText: tailText,
              number: transitNumber || applicationNumber
            })
          }
        },
        applicationSuccessFooter: applicationSuccessFooter(
          state,
          dispatch,
          transitNumber,
          tenant
        )
      };
    } else if(status === "failure" && purpose === "pay") {
      return {
        header: getCommonHeader({
          labelName: `Rented Properties`,
          labelKey: "RP_COMMON_RENTED_PROPERTIES",
        }),
        applicationSuccessCard: {
          uiFramework: "custom-atoms",
          componentPath: "Div",
          children: {
            card: acknowledgementCard({
              icon: "close",
              backgroundColor: "#E54D42",
              header: {
                labelName: "Payment is Failed!",
                labelKey: "RP_PAYMENT_FAILED_MESSAGE_HEAD"
              },
              body: {
                labelName:
                  "A notification regarding Application Submission has been sent to trade owner at registered Mobile No.",
                labelKey: "TL_APPLICATION_SUCCESS_MESSAGE_SUB"
              },
              tailText: {
                labelName: "Application Number",
                labelKey: "RP_APPLICATION_NUMBER_LABEL"
              },
              number: applicationNumber
            })
          }
        },
        paymentFailureFooter: paymentFailureFooter(applicationNumber, tenant, businessService)
      }
    }
}

const getData = async (action, state, dispatch, purpose, status, tenant, transitNumber,applicationNumber, type, businessService) => {
    const data = await getAcknowledgementCard(
      state,
      dispatch,
      purpose,
      status,
      tenant,
      transitNumber,
      applicationNumber,
      type,
      businessService
    );
    dispatch(
      handleField(
        "acknowledgement",
        "components.div",
        "children",
        data
      )
    );
  }


const screenConfig = {
    uiFramework: "material-ui",
    name: "acknowledgement",
    beforeInitScreen: (action, state, dispatch) => {
      const purpose = getQueryArg(window.location.href, "purpose");
      const status = getQueryArg(window.location.href, "status");
      const transitNumber = getQueryArg(
        window.location.href,
        "transitNumber"
      );
      const applicationNumber = getQueryArg(
        window.location.href,
        "applicationNumber"
      );
      const tenant = getQueryArg(window.location.href, "tenantId");
      const type = getQueryArg(window.location.href , "type")
      const businessService = getQueryArg(window.location.href, "businessService")
      getData(action, state, dispatch, purpose, status, tenant, transitNumber, applicationNumber, type, businessService)
      return action;
    },
    components: {
      div: {
        uiFramework: "custom-atoms",
        componentPath: "Div",
        props: {
          className: "common-div-css"
        }
      }
    }
};

  export default screenConfig;