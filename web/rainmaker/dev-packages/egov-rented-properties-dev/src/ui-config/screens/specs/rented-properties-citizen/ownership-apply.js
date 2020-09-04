import {
    getCommonHeader, getCommonContainer
  } from "egov-ui-framework/ui-config/screens/specs/utils";
import {stepper, formwizardOwnershipFirstStep, formwizardOwnershipSecondStep, formwizardOwnershipThirdStep } from '../rented-properties/applyResource/applyConfig';
import {footer} from './footer';
import { getMdmsData } from "../rented-properties/apply";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { handleScreenConfigurationFieldChange as handleField } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { get } from "lodash";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import { getOwnershipSearchResults, setDocsForEditFlow, setDocumentData } from "../../../../ui-utils/commons";
import {applicationNumber} from '../rented-properties/apply'
import { setApplicationNumberBox } from "../../../../ui-utils/apply";

const header = getCommonContainer({
  header: getCommonHeader({
    labelName: "Apply for Ownership Transfer",
    labelKey: "RP_APPLY_OWNERSHIP_TRANFER"
}),
applicationNumber
})


const getData = async(action, state, dispatch) => {
  dispatch(
    prepareFinalObject(
      "Owners",
      []
      )
      )
  dispatch(
    prepareFinalObject(
      "OwnersTemp",
      []
    )
  )
  const applicationNumber = getQueryArg(window.location.href, "applicationNumber");
  if(!!applicationNumber) {
    const queryObject = [
      {key: "applicationNumber", value: applicationNumber}
    ]
    const response = await getOwnershipSearchResults(queryObject);
    setApplicationNumberBox(state, dispatch, applicationNumber, "ownership-apply")
    if (response && response.Owners) {
      let {Owners} = response
    let ownershipTransferDocuments = Owners[0].ownerDetails.ownershipTransferDocuments || [];
    const removedDocs = ownershipTransferDocuments.filter(item => !item.active)
    ownershipTransferDocuments = ownershipTransferDocuments.filter(item => !!item.active)
    Owners = [{...Owners[0], ownerDetails: {...Owners[0].ownerDetails, ownershipTransferDocuments}}]
    dispatch(prepareFinalObject("Owners", Owners))
    dispatch(
      prepareFinalObject(
        "OwnersTemp[0].removedDocs",
        removedDocs
      )
    );
    }
    setDocsForEditFlow(state, dispatch, "Owners[0].ownerDetails.ownershipTransferDocuments", "OwnersTemp[0].uploadedDocsInRedux");
  }
  setDocumentData(action, state, dispatch, {documentCode: "FRESHLICENSE", jsonPath: "Owners[0].ownerDetails.ownershipTransferDocuments", screenKey: "ownership-apply", screenPath: "components.div.children.formwizardSecondStep.children.ownershipTransferDocumentsDetails.children.cardContent.children.documentList", tempJsonPath:"OwnersTemp[0].ownershipTransferDocuments"})
}


const applyLicense = {
    uiFramework: "material-ui",
    name: "ownership-apply",
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
                formwizardFirstStep: formwizardOwnershipFirstStep,
                formwizardSecondStep: formwizardOwnershipSecondStep,
                formwizardThirdStep: formwizardOwnershipThirdStep,
                footer
            }
        }
    }
}

export default applyLicense;