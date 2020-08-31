import {
    getCommonHeader
  } from "egov-ui-framework/ui-config/screens/specs/utils";

import {stepper, formwizardMortgageFirstStep,formwizardMortgageSecondStep, formwizardMortgageThirdStep } from '../rented-properties/applyResource/applyConfig';
import {mortgagefooter} from './footer-mortgage';
import { getMdmsData } from "../rented-properties/apply";
import { getOwnershipSearchResults, setDocsForEditFlow ,getMortgageSearchResults, setDocumentData} from "../../../../ui-utils/commons";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { handleScreenConfigurationFieldChange as handleField } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { get } from "lodash";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";

  const header = getCommonHeader({
      labelName: "Apply Mortage License",
      labelKey: "RP_COMMON_MORTAGE_LICENSE_APPLY"
  });
  
  const getData = async(action, state, dispatch) => {
    dispatch(
      prepareFinalObject(
        "MortgageApplications",
        []
        )
        )
    dispatch(
      prepareFinalObject(
        "MortgageApplicationsTemp",
        []
      )
    )
    const applicationNumber = getQueryArg(window.location.href, "applicationNumber");
    if(!!applicationNumber) {
      const queryObject = [
        {key: "applicationNumber", value: applicationNumber}
      ]
      const response = await getMortgageSearchResults(queryObject);
      if (response && response.MortgageApplications) {
      let applicationDocuments = response.MortgageApplications[0].applicationDocuments|| [];
      const removedDocs = applicationDocuments.filter(item => !item.active)
      applicationDocuments = applicationDocuments.filter(item => !!item.active)
      MortgageApplications = [{...MortgageApplications[0], applicationDocuments}]
      dispatch(prepareFinalObject("MortgageApplications", MortgageApplications))
      dispatch(
        prepareFinalObject(
          "MortgageApplicationsTemp[0].removedDocs",
          removedDocs
        )
      );
      }
      setDocsForEditFlow(state, dispatch, "MortgageApplications[0].applicationDocuments", "MortgageApplicationsTemp[0].uploadedDocsInRedux");
    }
    setDocumentData(action, state, dispatch, {documentCode: "MortgageRP", jsonPath: "MortgageApplications[0].applicationDocuments", screenKey: "mortage-apply", screenPath: "components.div.children.formwizardSecondStep.children.mortgageDocumentsDetails.children.cardContent.children.documentList", tempJsonPath:"MortgageApplicationsTemp[0].applicationDocuments"})
  }

const applyLicense = {
    uiFramework: "material-ui",
    name: "mortage-apply",
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
                formwizardFirstStep: formwizardMortgageFirstStep,
                formwizardSecondStep:formwizardMortgageSecondStep,
                formwizardThirdStep: formwizardMortgageThirdStep,
                footer: mortgagefooter
            }
        }
    }
}

export default applyLicense;