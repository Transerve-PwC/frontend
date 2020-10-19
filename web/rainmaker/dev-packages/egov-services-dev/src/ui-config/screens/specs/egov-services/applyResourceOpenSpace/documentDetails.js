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
      labelKey: "BK_OSB_HEADER_STEP_3",
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
    labelKey: "BK_OSB_DOCUMENT_SUBTEXT"
  }),
  break: getBreak(),
  documentList: {
    uiFramework: "custom-containers-local",
    moduleName: "egov-services",
    componentPath: "DocumentListContainer",
    // required:false,
    props: {
      buttonLabel: {
        labelName: "UPLOAD FILE",
        labelKey: "BK_OSB_DOCUMENT_UPLOAD_BUTTON"
      },
      description: "Only .jpg, .jpeg, .png and .pdf files. 1MB max file size.",
      inputProps: {
        accept: ".pdf,.png,.jpg,.jpeg"
      },
      maxFileSize: 1025,
      moduleName : "OSBM"
    },
    type: "array"
  }
});
