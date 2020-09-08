import {
  getBreak,
  getCommonCard,
  getCommonParagraph,
  getCommonSubHeader,
  getCommonTitle
} from "egov-ui-framework/ui-config/screens/specs/utils";

export const documentDetails = getCommonCard({
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
  subText: getCommonParagraph({
    labelName:
      "Only one file can be uploaded for one document. If multiple files need to be uploaded then please combine all files in a pdf and then upload",
    labelKey: "EC_VIOLATION_BULK_UPLOAD_SUBHEAD"
  }),
  // subText_format: getCommonParagraph(
  //   {
  //     labelName: "Only .jpg and .pdf files. 1MB max file size.",
  //     labelKey: "EC_VIOLATION_BULK_UPLOAD_SUBHEAD"
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
    componentPath: "ImageUploadViolationMolecule",
    props: {
      formKey: `apply_Violations_Discrepancy_Image`,
      fieldKey: 'echallanViolationDiscrepancyImage',
      moduleName: "egov-echallan"
    },
    visible: true,

  },
  break: getBreak(),

});


// export const documentDetails = getCommonCard({
//   upload: {
//     uiFramework: "custom-atoms",
//     componentPath: "Container",
//     props: {
//       style: {
//         marginLeft: 8
//       }
//     },
//     required: false,
//     children: {
//       uploadFileHeader: getCommonSubHeader(
//         {
//           labelName: "Supporting Documents",
//           labelKey: "EC_VIOLATION_UPLOAD_HEAD"
//         },
//         {
//           style: { marginTop: 15, width: "100%" }
//         }
//       ),
//       uploadFileInfo: getCommonParagraph(
//         {
//           labelName: "Only .jpg and .pdf files. 5MB max file size.",
//           labelKey: "EC_VIOLATION_BULK_UPLOAD_SUBHEAD"
//         },
//         {
//           style: {
//             fontSize: 12,
//             marginBottom: 0,
//             marginTop: 5,
//             width: "100%",
//             color: "rgba(0, 0, 0, 0.6000000238418579)"
//           }
//         }
//       ),
//       uploadButton: {
//         uiFramework: "custom-molecules",
//         componentPath: "UploadMultipleFiles",
//         props: {
//           maxFiles: 5,
//           jsonPath: "violationDocuments",
//           inputProps: {
//             accept: "image/*, .png, .jpeg"
//           },
//           buttonLabel: {
//             labelName: "UPLOAD FILES",
//             labelKey: "EC_VIOLATION_UPLOAD_FILES_BUTTON_LABEL"
//           },
//           maxFileSize: 5000,
//           moduleName: "egov-echallan",
//           hasLocalization: false
//         }
//       }
//     }
//   }

// });