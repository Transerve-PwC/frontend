import {
  getBreak,
  getCommonCard,
  getCommonParagraph,
  getCommonTitle
} from "egov-ui-framework/ui-config/screens/specs/utils";


export const ViolatorImageIDUpload = getCommonCard({
  header: getCommonTitle(
    {
      labelName: "Required Documents",
      labelKey: "EC_DOCUMENT_DETAILS_HEADER_POPUP"
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
    labelKey: "EC_VIOLATION_UPLOAD_SUBHEAD"
  }),
  // subText_format: getCommonParagraph(
  //   {
  //     labelName: "Only .jpg and .pdf files. 1MB max file size.",
  //     labelKey: "EC_VIOLATION_SINGLE_UPLOAD_SUBHEAD"
  //   },
  //   {
  //     style: {
  //       fontSize: 12,
  //       marginBottom: 0,
  //       marginTop: 5,
  //       width: "100%",
  //       color: "rgba(0, 0, 0, 0.6000000238418579)"
  //     }
  //   }
  // ),
  break: getBreak(),
  imageUpload: {
    uiFramework: "custom-molecules-local",
    moduleName: "egov-echallan",
    componentPath: "ImageUploadViolatorImageMolecule",
    props: {
      formKey: `apply_Violator_Image`,
      fieldKey: 'echallanViolaterImage',
      module: "egov-echallan"
    },
    visible: true,

  },
  break: getBreak(),

});

export const ViolatorIDProofUpload = getCommonCard({
  header: getCommonTitle(
    {
      labelName: "Required Documents",
      labelKey: "EC_DOCUMENT_DETAILS_ID_PROOF_HEADER_POPUP"
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
    labelKey: "EC_VIOLATION_UPLOAD_SUBHEAD"
  }),
  // subText_format: getCommonParagraph(
  //   {
  //     labelName: "Only .jpg and .pdf files. 1MB max file size.",
  //     labelKey: "EC_VIOLATION_SINGLE_UPLOAD_SUBHEAD"
  //   },
  //   {
  //     style: {
  //       fontSize: 12,
  //       marginBottom: 0,
  //       marginTop: 5,
  //       width: "100%",
  //       color: "rgba(0, 0, 0, 0.6000000238418579)"
  //     }
  //   }
  // ),
  break: getBreak(),
  imageUpload: {
    uiFramework: "custom-molecules-local",
    moduleName: "egov-echallan",
    componentPath: "ImageUploadViolatorIdProofMolecule",
    props: {
      formKey: `apply_Violator_ID_PROOF`,
      fieldKey: 'echallanViolaterIDProofImage',
      module: "egov-echallan"
    },
    visible: true,

  },
  break: getBreak(),

});

export const ViolationDocumentDetailsUpload = getCommonCard({
  header: getCommonTitle(
    {
      labelName: "Required Documents",
      labelKey: "EC_VIOLATION_BULK_UPLOAD_HEAD"
    },
    {
      style: {
        marginBottom: 18
      }
    }
  ),
  // subText: getCommonParagraph({
  //   labelName:
  //     "Only one file can be uploaded for one document. If multiple files need to be uploaded then please combine all files in a pdf and then upload",
  //   labelKey: "EC_VIOLATION_UPLOAD_SUBHEAD"
  // }),
  subText_format: getCommonParagraph(
    {
      labelName: "Only .jpg and .pdf files. 1MB max file size.",
      labelKey: "EC_VIOLATION_BULK_UPLOAD_SUBHEAD"
    },
    {
      style: {
        fontSize: 12,
        marginBottom: 0,
        marginTop: 5,
        width: "100%",
        color: "rgba(0, 0, 0, 0.6000000238418579)"
      }
    }
  ),
  break: getBreak(),
  // imageUpload: {
  //   uiFramework: "custom-molecules-local",
  //   moduleName: "egov-echallan",
  //   componentPath: "ImageUploadViolationMolecule",
  //   props: {
  //     formKey: `apply_Violations_Image`,
  //     fieldKey: 'echallanViolationImage',
  //     module: "egov-echallan"
  //   },
  //   visible: true,

  // },
  imageUpload : {
    uiFramework: "custom-molecules-local",
    moduleName: "egov-rented-properties",
    componentPath: "ImageUploadMolecule",
    // componentPath: "ImageUploadMolecule",
    props: {
    formKey: `newapplication`,
    // imageLength: 6,
    hide: false,
    MAX_IMAGE_SIZE: 5000,
    labelKey: "COMMON_ERR_FILE_TOTAL"
    },
    visible: true,
     required: true
    },
  break: getBreak(),

});
