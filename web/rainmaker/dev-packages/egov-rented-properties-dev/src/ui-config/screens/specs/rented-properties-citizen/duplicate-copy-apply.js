import {
    getCommonHeader
  } from "egov-ui-framework/ui-config/screens/specs/utils";

import {stepper, formwizardDuplicateCopyFirstStep,formwizardDuplicateCopySecondStep,formwizardDuplicateCopyThirdStep } from '../rented-properties/applyResource/applyConfig';
import {duplicatefooter} from './footer';
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import { getOwnershipSearchResults, setDocsForEditFlow ,getDuplicateCopySearchResults, setDocumentData} from "../../../../ui-utils/commons";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { handleScreenConfigurationFieldChange as handleField } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { get } from "lodash";
import { getMdmsData } from "../rented-properties/apply";
import { WORKFLOW_BUSINESS_SERVICE_DC } from "../../../../ui-constants";
const header = getCommonHeader({
    labelName: "Apply Duplicate Copy Of Allotment",
    labelKey: "RP_COMMON_DUPLICATE_COPY_APPLY"
});

const getData = async(action, state, dispatch) => {
  dispatch(
    prepareFinalObject(
      "DuplicateCopyApplications",
      []
      )
      )
  dispatch(
    prepareFinalObject(
      "DuplicateTemp",
      []
    )
  )
  const applicationNumber = getQueryArg(window.location.href, "applicationNumber");
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
    }
    setDocsForEditFlow(state, dispatch, "DuplicateCopyApplications[0].applicationDocuments", "DuplicateTemp[0].uploadedDocsInRedux");
  }
  setDocumentData(action, state, dispatch, {documentCode: WORKFLOW_BUSINESS_SERVICE_DC, jsonPath: "DuplicateCopyApplications[0].applicationDocuments", screenKey: "duplicate-copy-apply", screenPath: "components.div.children.formwizardSecondStep.children.ownershipTransferDuplicateDocumentsDetails.children.cardContent.children.documentList", tempJsonPath:"DuplicateTemp[0].ownershipTransferDocuments"})
}


const applyLicense = {
    uiFramework: "material-ui",
    name: "duplicate-copy-apply",
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
                stepper,
                formwizardFirstStep: formwizardDuplicateCopyFirstStep,
                formwizardSecondStep: formwizardDuplicateCopySecondStep,
                formwizardThirdStep: formwizardDuplicateCopyThirdStep,
                footer: duplicatefooter
            }
        }
    }
}

export default applyLicense;