import {
    getCommonHeader
  } from "egov-ui-framework/ui-config/screens/specs/utils";
import {addPropertyStepper, formwizardFirstStep, formwizardSecondStep, formwizardThirdStep} from './applyResource/applyConfig'
import { httpRequest } from "../../../../ui-utils";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import commonConfig from "config/common.js";
import {footer} from './applyResource/footer';
import { searchResults } from "./search-preview";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import { prepareDocumentTypeObj } from "../utils";
import { handleScreenConfigurationFieldChange as handleField } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { get } from "lodash";
import { updatePFOforSearchResults } from "../../../../ui-utils/commons";

const propertyId = getQueryArg(window.location.href, "propertyId")

export const getMdmsData = async (dispatch, body) => {
    let mdmsBody = {
      MdmsCriteria: {
        tenantId: commonConfig.tenantId,
        moduleDetails: body
      }
    };
    try {
      let payload = await httpRequest(
        "post",
        "/egov-mdms-service/v1/_search",
        "_search",
        [],
        mdmsBody
      );
      return payload;
    } catch (e) {
      console.log(e);
    }
  };

  const setDocumentData = async (action, state, dispatch) => {
    const documentTypePayload = [{
      moduleName: "PropertyServices",
      masterDetails: [{name: "applications"}]
    }
  ]
    const documentRes = await getMdmsData(dispatch, documentTypePayload);
    const {PropertyServices} = !!documentRes && !!documentRes.MdmsRes ? documentRes.MdmsRes : {}
    const {applications = []} = PropertyServices || {}
    const findMasterItem = applications.find(item => item.code === "MasterRP")
    const masterDocuments = !!findMasterItem ? findMasterItem.documentList : [];
    const rentedMasterDocuments = masterDocuments.map(item => ({
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
          "apply",
          "components.div.children.formwizardSecondStep.children.rentedDocumentsDetails.children.cardContent.children.documentList",
          "props.inputProps",
          rentedMasterDocuments
      )
  );
    dispatch(prepareFinalObject("PropertiesTemp[0].applicationDocuments", documentTypes))
    dispatch(prepareFinalObject("applyScreenMdmsData.rentedApplications", applications))
  }
  
export const getColonyTypes = async(action, state, dispatch) => {
    const colonyTypePayload = [{
      moduleName: "PropertyServices",
      masterDetails: [{name: "colonies"}, {name: "applications"}]
    }
  ]
    const colonyRes = await getMdmsData(dispatch, colonyTypePayload);
    const {PropertyServices} = !!colonyRes && !!colonyRes.MdmsRes ? colonyRes.MdmsRes : {}
    const {colonies = []} = PropertyServices || {}
      dispatch(prepareFinalObject("applyScreenMdmsData.rentedPropertyColonies", colonies))
      const propertyTypes = colonies.map(item => ({
        code: item.code,
        label: item.code
      }))
      dispatch(prepareFinalObject("applyScreenMdmsData.propertyTypes", propertyTypes))
  }


const header = getCommonHeader({
    labelName: "Add Rented Properties",
    labelKey: "RP_COMMON_RENTED_PROPERTIES_ADD"
  });

const getData = async(action, state, dispatch) => {
  const transitNumber = getQueryArg(window.location.href, "transitNumber");
  getColonyTypes(action, state, dispatch);
  if(transitNumber) {
    await updatePFOforSearchResults(action, state, dispatch, transitNumber)
  } else {
    dispatch(
      prepareFinalObject(
        "Properties",
        []
        )
        )
  }
  setDocumentData(action, state, dispatch)
}

const applyRentedProperties = {
    uiFramework: "material-ui",
    name: "apply",
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
                addPropertyStepper,
                formwizardFirstStep,
                formwizardSecondStep,
                formwizardThirdStep,
                footer
            }
        }
    }
}

export default applyRentedProperties