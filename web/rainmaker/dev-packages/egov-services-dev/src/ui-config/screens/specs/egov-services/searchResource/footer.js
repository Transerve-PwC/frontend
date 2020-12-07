import {
    downloadReceipt,
    downloadCertificate,
    downloadApplication,
} from "../../utils";
import "./index.css";

export const footerReviewTop = (
    action,
    state,
    dispatch,
    status,
    applicationNumber,
    tenantId,
    bookingCase = ""
) => {
    console.log(bookingCase, "bookingCase");
    let downloadMenu = [];
    let printMenu = [];
    let certificateDownloadObject = {
        label: {
            labelName: "Booking Certificate",
            labelKey: "BK_MY_BK_CERTIFICATE_DOWNLOAD",
        },
        link: () => {
            downloadCertificate(state, applicationNumber, tenantId);
        },
        leftIcon: "book",
    };
    let certificatePrintObject = {
        label: {
            labelName: "Booking Certificate",
            labelKey: "BK_MY_BK_CERTIFICATE_PRINT",
        },
        link: () => {
            downloadCertificate(state, applicationNumber, tenantId, "print");
        },
        leftIcon: "book",
    };

    let receiptDownloadObject = {
        label: { labelName: "Receipt", labelKey: "BK_MY_BK_RECEIPT_DOWNLOAD" },
        link: () => {
            downloadReceipt(state, applicationNumber, tenantId);
        },
        leftIcon: "receipt",
    };
    let receiptPrintObject = {
        label: { labelName: "Receipt", labelKey: "BK_MY_BK_RECEIPT_PRINT" },
        link: () => {
            downloadReceipt(state, applicationNumber, tenantId, "print");
        },
        leftIcon: "receipt",
    };
    let applicationDownloadObject = {
        label: {
            labelName: "Application",
            labelKey: "BK_MY_BK_APPLICATION_DOWNLOAD",
        },
        link: () => {
            downloadApplication(state, applicationNumber, tenantId);
        },
        leftIcon: "assignment",
    };
    let applicationPrintObject = {
        label: {
            labelName: "Application",
            labelKey: "BK_MY_BK_APPLICATION_PRINT",
        },
        link: () => {
            downloadApplication(state, applicationNumber, tenantId, "print");
        },
        leftIcon: "assignment",
    };

    if (
        (status === "APPLIED" || status === "APPROVED"  || status === "MODIFIED" || status === "RE_INITIATED")
    ) {
        downloadMenu = [
            applicationDownloadObject,
            receiptDownloadObject,
            certificateDownloadObject,
        ];
        printMenu = [
            applicationPrintObject,
            receiptPrintObject,
            certificatePrintObject,
        ];
    } else if (
        (status === "PENDINGAPPROVAL" ||
            status === "PENDINGPAYMENT" ||
            status === "REJECTED")
    ) {
        downloadMenu = [applicationDownloadObject];
        printMenu = [applicationPrintObject];
    } else if (
        (status === "PENDINGASSIGNMENTDRIVER" ||
            status === "PENDINGUPDATE" ||
            status === "DELIVERED") &&
        bookingCase.includes("Paid")
    ) {
        downloadMenu = [applicationDownloadObject, receiptDownloadObject];
        printMenu = [applicationPrintObject, receiptPrintObject];
    } else if (
        (status === "PENDINGASSIGNMENTDRIVER" ||
            status === "PENDINGUPDATE" ||
            status === "DELIVERED" ||
            status === "REJECTED") &&
        !bookingCase.includes("Paid")
    ) {
        downloadMenu = [applicationDownloadObject];
        printMenu = [applicationPrintObject];
    }

    return {
        rightdiv: {
            uiFramework: "custom-atoms",
            componentPath: "Div",
            props: {
                style: { textAlign: "right", display: "flex" },
            },
            children: {
                downloadMenu: {
                    uiFramework: "custom-atoms-local",
                    moduleName: "egov-services",
                    componentPath: "MenuButton",
                    props: {
                        data: {
                            label: {
                                labelName: "DOWNLOAD",
                                labelKey: "BK_MY_BK_DOWNLOAD",
                            },
                            leftIcon: "cloud_download",
                            rightIcon: "arrow_drop_down",
                            props: {
                                variant: "outlined",
                                style: {
                                    height: "60px",
                                    color: "#FE7A51",
                                    marginRight: "10px",
                                },
                                className: "",
                            },
                            menu: downloadMenu,
                        },
                    },
                },
                printMenu: {
                    uiFramework: "custom-atoms-local",
                    moduleName: "egov-services",
                    componentPath: "MenuButton",
                    props: {
                        data: {
                            label: {
                                labelName: "PRINT",
                                labelKey: "BK_MY_BK_PRINT",
                            },
                            leftIcon: "print",
                            rightIcon: "arrow_drop_down",
                            props: {
                                variant: "outlined",
                                style: { height: "60px", color: "#FE7A51" },
                                className: "",
                            },
                            menu: printMenu,
                        },
                    },
                },
            },
            // gridDefination: {
            //   xs: 12,
            //   sm: 6
            // }
        },
    };
};
