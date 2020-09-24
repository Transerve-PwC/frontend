import { get } from "lodash";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getCommonCard, getCommonTitle, getCommonParagraph } from "egov-ui-framework/ui-config/screens/specs/utils";

const prepareDocuments = (documents, jsonPath) => {
    let documentsArr =
      documents.length > 0
        ? documents.reduce((documentsArr, item, ind) => {
          documentsArr.push({
            name: item.code,
            required: item.required,
            jsonPath: `${jsonPath}[${ind}]`,
            statement: item.description
          });
          return documentsArr;
        }, [])
        : [];
    return documentsArr;
  };

export const setDocumentData = async(state, dispatch, {format_config}) => {
    const {jsonPath, documentList = []} = format_config;
    const documents = documentList.map(item => ({
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
      moduleName: "Estate",
      statement: {
          labelName: "Allowed documents are Aadhar Card / Voter ID Card / Driving License",
          labelKey: item.description
      }
      }))
      const documentTypes = prepareDocuments(documentList, jsonPath);
      let applicationDocs = get(
        state.screenConfiguration.preparedFinalObject,
        jsonPath,
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
            jsonPath,
            applicationDocsReArranged
          )
        );
      dispatch(prepareFinalObject("temp[0].documents", documentTypes))
      return documents
  }

export const inputProps = []

const documentList = {
    uiFramework: "custom-containers-local",
    moduleName: "egov-estate",
    componentPath: "DocumentListContainer",
    props: {
      buttonLabel: {
        labelName: "UPLOAD FILE",
        labelKey: "TL_BUTTON_UPLOAD FILE"
      },
      downloadButtonLabel: {
        labelName: "DOWNLOAD FILE",
        labelKey: "TL_BUTTON_DOWNLOAD_FILE"
      },
      inputProps,
      documentTypePrefix: "ES_",
      documentsJsonPath: "temp[0].documents",
      uploadedDocumentsJsonPath: "temp[0].uploadedDocsInRedux",
      tenantIdJsonPath: "Applications[0].tenantId",
      removedJsonPath: "temp[0].removedDocs"
    }
  };

  export const documentDetails = getCommonCard({
    header: getCommonTitle(
      {
        labelName: "Required Documents",
        labelKey: "TL_NEW-UPLOAD-DOCS_HEADER"
      },
      {
        style: {
          marginBottom: 18
        }
      }
    ),
    paragraph: getCommonParagraph({
      labelName:
        "Only one file can be uploaded for one document. If multiple files need to be uploaded then please combine all files in a pdf and then upload",
      labelKey: "TL_NEW-UPLOAD-DOCS_SUBHEADER"
    }),
    documentList
  })