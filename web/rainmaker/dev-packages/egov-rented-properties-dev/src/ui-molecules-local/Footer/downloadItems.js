import generateReceipt from "egov-ui-framework/ui-config/screens/specs/utils/receiptPdf";

export const getDownloadItems = (status, applicationNumber, state) => {
  let tlCertificateDownloadObject = {
    label: { labelName: "TL Certificate", labelKey: "TL_CERTIFICATE" },
    link: () => {
      generateReceipt("certificate_download", state);
    },
    leftIcon: "book"
  };
  let tlCertificatePrintObject = {
    label: { labelName: "TL Certificate", labelKey: "TL_CERTIFICATE" },
    link: () => {
      generateReceipt("certificate_print", state);
    },
    leftIcon: "book"
  };
  let receiptDownloadObject = {
    label: { labelName: "Receipt", labelKey: "TL_RECEIPT" },
    link: () => {
      generateReceipt("receipt_download", state);
    },
    leftIcon: "receipt"
  };
  let receiptPrintObject = {
    label: { labelName: "Receipt", labelKey: "TL_RECEIPT" },
    link: () => {
      generateReceipt("receipt_print", state);
    },
    leftIcon: "receipt"
  };
  let applicationDownloadObject = {
    label: { labelName: "Application", labelKey: "TL_APPLICATION" },
    link: () => {
      generatePdfFromDiv("download", applicationNumber);
    },
    leftIcon: "assignment"
  };
  let applicationPrintObject = {
    label: { labelName: "Application", labelKey: "TL_APPLICATION" },
    link: () => {
      generatePdfFromDiv("print", applicationNumber);
    },
    leftIcon: "assignment"
  };

  switch (status) {
    case "APPROVED":
      return {
        downloadMenu: [
          tlCertificateDownloadObject,
          receiptDownloadObject,
          applicationDownloadObject
        ],
        printMenu: [
          tlCertificatePrintObject,
          receiptPrintObject,
          applicationPrintObject
        ]
      };

    // case "pending_approval":
    //   return {
    //     downloadMenu: [receiptDownloadObject, applicationDownloadObject],
    //     printMenu: [receiptPrintObject, applicationPrintObject]
    //   };

    default:
      return {
        downloadMenu: [applicationDownloadObject],
        printMenu: [applicationPrintObject]
      };
      break;
  }
};
