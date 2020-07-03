import {
    getCommonHeader
  } from "egov-ui-framework/ui-config/screens/specs/utils";
import {stepper, formwizardOwnershipFirstStep, formwizardOwnershipSecondStep, formwizardOwnershipThirdStep } from '../rented-properties/applyResource/applyConfig';
import {footer} from './footer';
import { getMdmsData } from "../rented-properties/apply";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { prepareDocumentTypeObj } from "../utils";
import { handleScreenConfigurationFieldChange as handleField } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { get } from "lodash";

const header = getCommonHeader({
    labelName: "Apply for Ownership Transfer",
    labelKey: "RP_APPLY_OWNERSHIP_TRANFER"
});

const setDocumentData = async(action, state, dispatch) => {
    const documentTypePayload = [{
        moduleName: "PropertyServices",
        masterDetails: [{name: "applications"}]
      }
    ]
    const documentRes = await getMdmsData(dispatch, documentTypePayload);
    const {PropertyServices} = !!documentRes && !!documentRes.MdmsRes ? documentRes.MdmsRes : {}
    const {applications = []} = PropertyServices || {}
    const findFreshLicenceItem = applications.find(item => item.code === "FRESHLICENSE")
    const masterDocuments = !!findFreshLicenceItem ? findFreshLicenceItem.documentList : [];
    const freshLicenceDocuments = masterDocuments.map(item => ({
    type: item.code,
    description: {
      labelName: "Only .jpg and .pdf files. 6MB max file size.",
      labelKey: item.fileType
    },
    formatProps :{
      accept : item.accept || "image/*, .pdf, .png, .jpeg",
    }, 
    maxFileSize: 6000,
    downloadUrl: item.downloadUrl,
    moduleName: "RentedProperties",
    statement: {
        labelName: "Allowed documents are Aadhar Card / Voter ID Card / Driving License",
        labelKey: item.description
    }
    }))
    const documentTypes = prepareDocumentTypeObj(masterDocuments);
    let applicationDocs = get(
      state.screenConfiguration.preparedFinalObject,
      "Properties[0].propertyDetails.applicationDocuments",
      []
    ) || [];
    applicationDocs = applicationDocs.filter(item => !!item)
    let applicationDocsReArranged =
      applicationDocs &&
      applicationDocs.length &&
      documentTypes.map(item => {
        const index = applicationDocs.findIndex(
          i => i.documentType === item.name
        );
        return applicationDocs[index];
      }).filter(item => !!item)
    applicationDocsReArranged &&
      dispatch(
        prepareFinalObject(
          "Properties[0].propertyDetails.applicationDocuments",
          applicationDocsReArranged
        )
      );
    dispatch(
      handleField(
          "ownership-apply",
          "components.div.children.formwizardSecondStep.children.ownershipTransferDocumentsDetails.children.cardContent.children.documentList",
          "props.inputProps",
          freshLicenceDocuments
      )
  );
    dispatch(prepareFinalObject("PropertiesTemp[0].applicationDocuments", documentTypes))
}

const applyLicense = {
    uiFramework: "material-ui",
    name: "ownership-apply",
    beforeInitScreen: (action, state, dispatch) => {
        setDocumentData(action, state, dispatch)
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