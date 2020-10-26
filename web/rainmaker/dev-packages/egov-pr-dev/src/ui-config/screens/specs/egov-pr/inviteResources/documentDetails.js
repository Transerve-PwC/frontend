import {
  getBreak,
  getCommonCard,
  getCommonParagraph,
  getCommonTitle,
  getLabel
} from "egov-ui-framework/ui-config/screens/specs/utils";
import get from "lodash/get";
import { InviteExternalEmployees } from "../searchResource/citizenSearchFunctions"

export const documentDetails = getCommonCard({
  header: getCommonTitle(
    {
      labelName: "External Guests",
      labelKey: "PR_EXTERNAL_GUESTS_EXCEL"
    },
    {
      style: {
        marginBottom: 18
      }
    }
  ),
  subText: getCommonParagraph({
    labelName:
      "Only xls file can be uploaded. 2MB max file size.",
    labelKey: "PR_INVITE_DOCUMENT_DETAILS_SUBTEXT"
  }),
  break: getBreak(),
  documentList: {
    uiFramework: "custom-containers-local",
    moduleName: "egov-pr",
    componentPath: "DocumentListContainer",
    props: {
      documents: [
        // {
        // name: "Identity Proof ",
        // required: true,
        // jsonPath: "pr.documents.identityProof",
        // selector: {
        // inputLabel: "Select Document",
        // menuItems: [
        // { value: "AADHAAR", label: "Aadhaar Card" },
        // { value: "VOTERID", label: "Voter ID Card" },
        // { value: "DRIVING", label: "Driving License" }
        // ]
        // }
        // },
        {
          name: "Address Proof ",
          required: true,
          jsonPath: "ExternalUsers",

        },

      ],
      buttonLabel: {
        labelName: "UPLOAD FILE",
        labelKey: "PR_DOCUMENT_UPLOAD_FILE"
      },
      description: "Only xls files. 2MB max file size.",
      inputProps: {
        accept: "vnd.ms-excel,.ms-excel,application/vnd.ms-excel,application/ms-excel"
      },
      maxFileSize: 2000
    },
    type: "array"
  },
  break: getBreak(),
  break: getBreak(),
  downloadcard: {
    uiFramework: "custom-molecules-local",
    moduleName: "egov-pr",
    componentPath: "SampleDownload"
  },
  break: getBreak(),

  subText1: getCommonParagraph({
    labelName:
      "Only xls file can be uploaded. 2MB max file size.",
    labelKey: "PR_INVITE_SAMPLE_DOCUMENT_DETAILS_SUBTEXT"
  }),
  break: getBreak(),

  Submit: {
    componentPath: "Button",
    props: {
      variant: "contained",
      color: "primary",
      style: {
        height: "48px",
        marginRight: "45px",
        marginTop: "20px",
        minWidth:"140px"
      }
    },
    break: getBreak(),
    children: {
      nextButtonLabel: getLabel({
        labelName: "Submit",
        labelKey: "PR_SUBMIT_GUEST"
      }),
      nextButtonIcon: {
        uiFramework: "custom-atoms",
        componentPath: "Icon",
        props: {
          iconName: "keyboard_arrow_right"
        }
      }
    },
    onClickDefination: {
      action: "condition",
      callBack: (state, dispatch) => {
        let excelid = get(state,
          "screenConfiguration.preparedFinalObject.documentsUploadRedux[0].documents[0].fileStoreId"
        );
        InviteExternalEmployees(state, dispatch, excelid)

      }
    }
  },
  cancel: {
    componentPath: "Button",
    props: {
      variant: "contained",
     // color: "primary",
      style: {
        backgroundColor: "unset",
        color: "rgb(254, 122, 81)",
        border: "1px solid rgb(254, 122, 81)",
        borderRadius: "2px",
        height: "48px",
        marginRight: "45px",
        marginTop: "20px",
        minWidth:"140px"
      }
    },
    children: {
      nextButtonLabel: getLabel({
        labelName: "Cancel",
        labelKey: "PR_BUTTON_CANCEL"
      }),
      nextButtonIcon: {
        uiFramework: "custom-atoms",
        componentPath: "Icon",
        props: {
          iconName: "keyboard_arrow_right"
        }
      }
    },
    onClickDefination: {


      action: "condition",
      callBack: (action, state, dispatch) => { window.location.reload(); }
    }
  }
});
