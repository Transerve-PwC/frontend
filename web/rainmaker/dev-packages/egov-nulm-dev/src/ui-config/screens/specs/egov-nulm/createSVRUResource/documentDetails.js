import {
  getBreak,
  getCommonCard,
  getCommonParagraph,
  getCommonTitle
} from "egov-ui-framework/ui-config/screens/specs/utils";

export const documentDetails = getCommonCard({
  header: getCommonTitle(
    {
      labelName: "Required Documents",
      labelKey: "NOC_DOCUMENT_DETAILS_HEADER_POPUP"
    },
    {
      style: {
        marginBottom: 18
      }
    }
  ),
  subText: getCommonParagraph({
    labelName:
      "Only one file can be uploaded for one document. If multiple files need to be uploaded then please combine all files in a pdf and then upload",
    labelKey: "NOC_DOCUMENT_DETAILS_SUBTEXT_POPUP"
  }),
  break: getBreak(),
  documentList: {
    uiFramework: "custom-containers-local",
    moduleName: "egov-nulm",
    componentPath: "DocumentListContainer",
    required:true,
    props: {      
      buttonLabel: {
        labelName: "UPLOAD FILE",
        labelKey: "NOC_DOCUMENT_DETAILS_BUTTON_UPLOAD_FILE"
      },
      description: "Only .jpg and .pdf files. 1MB max file size.",
      inputProps: {
         accept: ".pdf,.png,.jpeg"
       // accept: ".png,.jpeg,.jpg"
      },
      maxFileSize: 1000
    },
    type: "array"
  } 
});
