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
      labelKey: "WS_DOCUMENT_DETAILS_HEADER_POPUP"
    },
    {
      style: {
        marginBottom: 18
      }
    }
  ),
  subText: getCommonParagraph({
    labelName:
      "Only excel file can be uploaded",
    labelKey: "WS_DOCUMENT_DETAILS_SUBTEXT_POPUP"
  }),
  break: getBreak(),
  documentList: {
    uiFramework: "custom-containers-local",
    moduleName: "egov-wns",
    componentPath: "DocumentListContainer",
    required:true,
    props: {      
      buttonLabel: {
        labelName: "UPLOAD FILE",
        labelKey: "COMMON_DOCUMENT_DETAILS_BUTTON_UPLOAD_FILE",

      },
      description: "Only .jpg and .pdf files. 1MB max file size..",
      pageName: "egov-wns-upload",
      maxFiles:1,
      // description: "Only .jpg and .pdf files. 6MB max file size.",
      inputProps: {
        accept: ".xlsx, .xls"
      },
     
     
      maxFileSize: 100000
    },
    type: "array"
  } 
});
