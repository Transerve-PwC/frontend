import {
    getCommonHeader,getCommonCard
  } from "egov-ui-framework/ui-config/screens/specs/utils";
import {stepper, formwizardFirstStep, noticeViolationForm, formwizardThirdStep} from './applyResource/applyConfig'
import { httpRequest } from "../../../../ui-utils";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import commonConfig from "config/common.js";
import {footer,Violationnoticegenfooter} from './applyResource/footer';
import { searchResults } from "./search-preview";
import { getQueryArg,setDocuments } from "egov-ui-framework/ui-utils/commons";
import { prepareDocumentTypeObj } from "../utils";
import { handleScreenConfigurationFieldChange as handleField } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { get } from "lodash";
import { updatePFOforSearchResults } from "../../../../ui-utils/commons";
import { getReviewDocuments } from "./applyResource/review-documents";

const reviewDocumentDetails = getReviewDocuments(false, "apply")

export const noticeDocumentDetails = getCommonCard({
  reviewDocumentDetails
});

const header = getCommonHeader({
    labelName: "Create Violation Notice",
    labelKey: "RP_VIOLATION_NOTICE_APPLY"
  });

const getData = async(action, state, dispatch) => {
  const { screenConfiguration } = state;
  let payload = get(
    screenConfiguration.preparedFinalObject,
    "SingleImage",
    [])
    
  dispatch(prepareFinalObject("workflow.ProcessInstances", []))
    await setDocuments(
      payload[0],
      "applicationDocuments",
      "PropertiesTemp[0].reviewDocData",
      dispatch,'RP'
    );
}

const applyNoticeViolation = {
    uiFramework: "material-ui",
    name: "notice-violation",
    beforeInitScreen: (action, state, dispatch) => {
        getData(action, state, dispatch)
        return action;
      },
    components: {
        div: {
            uiFramework: "custom-atoms",
            componentPath: "Div",
            props: {
                className: "common-div-css"
            },
            children: {
                headerDiv: {
                    uiFramework: "custom-atoms",
                    componentPath: "Container",
                    children: {
                        header: {
                            gridDefination: {
                              xs: 12,
                              sm: 10
                            },
                            ...header
                          }
                    }
                },
                // stepper,
                formwizardFirstStep: noticeViolationForm,
                noticeDocumentDetails,
                // formwizardThirdStep,
                footer: Violationnoticegenfooter
            }
        }
    }
}

export default applyNoticeViolation