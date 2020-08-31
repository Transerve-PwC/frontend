import {
  getBreak,
  getCommonCard,
  getCommonParagraph,
  getCommonTitle
} from "egov-ui-framework/ui-config/screens/specs/utils";
export const MultipleDocumentDetails = getCommonCard({
  header: getCommonParagraph(
    {
      labelName: "Email Attachment",
      labelKey: "PR_EMAIL_ATTACHMENT_HEADER"
    },
    {
      style: {
        marginBottom: 18
      }
    }
  ),
  subText: getCommonParagraph({
    labelName:
      "Only image and .pdf files can be uploaded.Max file size 2MB each and 8 files can be uploaded.",
    labelKey: "PR_EVENTDOCUMENT_DETAILS_SUBTEXT"
  
  }),
  break: getBreak(),
  upload: {
    uiFramework: "custom-atoms",
    componentPath: "Container",
    props: {
      style: {
        marginLeft: 8
      }
    },
    required: false,
    children: {
       uploadButton: {
        uiFramework: "custom-molecules",
        componentPath: "UploadMultipleFiles",
        props: {
          maxFiles: 8,
          jsonPath: "TenderDocuments",
          inputProps: {
            //accept: ".pdf,.png,.jpeg,.zip,.WAV,.AIFF,.AU,.PCM,.BWF,.mp3,.mpeg,.mp4"
       accept: ".pdf,.png,.jpeg"
          },
          buttonLabel: {
            labelName: "UPLOAD FILE",
      labelKey: "PR_DOCUMENT_DETAILS_BUTTON_UPLOAD_FILE"
          },
          maxFileSize: 2000,
          moduleName: "egov-pr",
          hasLocalization: false
        }
      }
    }
  }


});
export const documentDetails = getCommonCard({
  header: getCommonTitle(
    {
      labelName: "Email Attachment",
      labelKey: "PR_EMAIL_ATTACHMENT_HEADER"
    },
    {
      style: {
        marginBottom: 10
      }
    }
  ),
  subText: getCommonParagraph({
    labelName:
      "Only one file can be uploaded for one document. If multiple files need to be uploaded then please combine all files in a pdf and then upload",
    labelKey: "NOC_DOCUMENT_DETAILS_SUBTEXT"
  }),
  break: getBreak(),
  documentList: {
    uiFramework: "custom-containers-local",
    moduleName: "egov-pr",
    componentPath: "DocumentListContainer",
    //required:true,
    props: {      
      buttonLabel: {
        labelName: "UPLOAD FILE",
        labelKey: "NOC_DOCUMENT_DETAILS_BUTTON_UPLOAD_FILE"
      },
      description: "Only .jpg and .pdf files. 1MB max file size.",
      inputProps: {
        accept: ".pdf,.png,.jpeg,.zip,WAV, AIFF, AU, PCM or BWF, mp3"
      },
      maxFileSize: 1000
    },
    type: "array"
  } 

});
