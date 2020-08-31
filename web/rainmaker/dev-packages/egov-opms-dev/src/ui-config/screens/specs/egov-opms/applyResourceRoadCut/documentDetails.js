import { getBreak, getCommonCard, getCommonParagraph, getCommonTitle } from "egov-ui-framework/ui-config/screens/specs/utils";

export const documentDetails = getCommonCard({
  header: getCommonTitle(
    {
      labelName: "Documents",
      labelKey: "ROADCUT_DOCUMENTS_NOC"
    },
    {
      style: {
        marginBottom: 18
      }
    }
  ),
  subText: getCommonParagraph({
    labelName:
      "Only image and .pdf files can be uploaded.Max file size 2MB each and 4 files can be uploaded.",
    labelKey: "ROADCUT_DOCUMENT_DETAILS_SUBTEXT_NOC"
  
  }),
  
  break: getBreak(),
  
  upload: {
    uiFramework: "custom-atoms",
    componentPath: "Container",
    props: {
      style: {
        marginLeft: 8
      },
    
    },
    required: true,
    children: {
      uploadButton: {
        uiFramework: "custom-molecules",
        componentPath: "UploadMultipleFiles",
        props: {
          maxFiles: 4,
          jsonPath: "RoadCutDocuments",
          inputProps: {
            //accept: ".pdf,.png,.jpeg,.zip,.WAV,.AIFF,.AU,.PCM,.BWF,.mp3,.mpeg,.mp4"
            accept: ".pdf,.png,.jpeg"
          },
          buttonLabel: {
            labelName: "UPLOAD FILE",
            labelKey: "PM_DOCUMENT_DETAILS_BUTTON_UPLOAD_FILE"
          },
          maxFileSize: 2000,
          moduleName: "egov-opms",
          hasLocalization: false
        }
      }
    }
  },
  subText1: getCommonParagraph({
    labelName:
      "1. Stamped Notarized 4 set drawing"
  }),
  subText2: getCommonParagraph({
    labelName:
      "2. Authorized GPS survey"
  }),
  subText3: getCommonParagraph({
    labelName:
      "3. Authorization letter of co.(to nominate the authorized person)",
  }),
  subText4: getCommonParagraph({
    labelName:
      "4. Authorized person' ID Card"
  }),
});
