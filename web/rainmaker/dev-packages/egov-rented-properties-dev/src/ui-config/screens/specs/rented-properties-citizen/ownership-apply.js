import {
    getCommonHeader
  } from "egov-ui-framework/ui-config/screens/specs/utils";
import {stepper, formwizardOwnershipFirstStep, formwizardOwnershipSecondStep, formwizardOwnershipThirdStep } from '../rented-properties/applyResource/applyConfig';
import {footer} from './footer';
import { getMdmsData } from "../rented-properties/apply";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { handleScreenConfigurationFieldChange as handleField } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { get } from "lodash";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import { getOwnershipSearchResults, setDocsForEditFlow } from "../../../../ui-utils/commons";

const header = getCommonHeader({
    labelName: "Apply for Ownership Transfer",
    labelKey: "RP_APPLY_OWNERSHIP_TRANFER"
});

export const prepareOwnerShipDocuments = documents => {
  let documentsArr =
    documents.length > 0
      ? documents.reduce((documentsArr, item, ind) => {
        documentsArr.push({
          name: item.code,
          required: item.required,
          jsonPath: `Owners[0].ownerDetails.ownershipTransferDocuments[${ind}]`,
          statement: item.description
        });
        return documentsArr;
      }, [])
      : [];
  return documentsArr;
};

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
    const documentTypes = prepareOwnerShipDocuments(masterDocuments);
    let applicationDocs = get(
      state.screenConfiguration.preparedFinalObject,
      "Owners[0].ownerDetails.ownershipTransferDocuments",
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
          "Owners[0].ownerDetails.ownershipTransferDocuments",
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
    dispatch(prepareFinalObject("OwnersTemp[0].ownershipTransferDocuments", documentTypes))
}

const getData = async(action, state, dispatch) => {
  const applicationNumber = getQueryArg(window.location.href, "applicationNumber");
  if(!!applicationNumber) {
    const queryObject = [
      {key: "applicationNumber", value: applicationNumber}
    ]
    const response = await getOwnershipSearchResults(queryObject);
    if (response && response.Owners) {
    dispatch(prepareFinalObject("Owners", response.Owners))
    }
    setDocsForEditFlow(state, dispatch, "Owners[0].ownerDetails.ownershipTransferDocuments", "OwnersTemp[0].uploadedDocsInRedux");
  } else {
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
  }
  setDocumentData(action, state, dispatch)
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