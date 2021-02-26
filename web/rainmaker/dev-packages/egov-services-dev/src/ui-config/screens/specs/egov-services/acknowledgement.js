import {
    getCommonHeader,
    getCommonContainer,
} from "egov-ui-framework/ui-config/screens/specs/utils";
import acknowledgementCard from "./acknowledgementResource/acknowledgementUtils";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import { getSearchResultsView, getSearchResultsViewForNewLocOswmcc ,getSearchResultsViewForRoomBooking} from "../../../../ui-utils/commons";
import {
    downloadReceipt,
    downloadCertificate,
    downloadApplication,
} from "../utils";
import { getLabel } from "egov-ui-framework/ui-config/screens/specs/utils";
import set from "lodash/set";
import get from "lodash/get";
import { getCurrentFinancialYear } from "../utils";

import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getapplicationType, setapplicationType, setapplicationNumber } from "egov-ui-kit/utils/localStorageUtils";

export const header = getCommonContainer({
    header: getCommonHeader({
        labelName: `Application for ${
            getapplicationType() === "OSBM"
                ? "Open Space to Store Building Material"
                : getapplicationType() === "NLUJM" ? "New Location" :
                    getapplicationType() === "GFCP" ? "Commercial Ground" : getapplicationType() === "OSUJM" ? "Open Space within MCC jurisdiction" : getapplicationType() === "PACC" ? "Parks & Community Center/Banquet Halls" : getapplicationType() === "BKROOM"?"Community Center Room":"Water Tanker"
            } (${getCurrentFinancialYear()})`, //later use getFinancialYearDates
        labelKey: "",
    }),
    applicationNumber: {
        uiFramework: "custom-atoms-local",
        moduleName: "egov-services",
        componentPath: "ApplicationNoContainer",
        props: {
            number: getQueryArg(window.location.href, "applicationNumber"),
        },
        visible: true,
    },
});

export const paymentSuccessFooter = (
    state,
    applicationNumber,
    tenantId,
    businessService
) => {
    return getCommonApplyFooter({
        //call gotoHome
        downloadReceiptButton: {
            componentPath: "Button",
            props: {
                variant: "outlined",
                color: "primary",
                style: {
                    //   minWidth: "200px",
                    height: "48px",
                    marginRight: "16px",
                },
            },
            children: {
                downloadReceiptButtonLabel: getLabel({
                    labelName: "DOWNLOAD RECEIPT",
                    labelKey: "BK_BUTTON_DOWNLOAD_RECEIPT",
                }),
            },
            onClickDefination: {
                action: "condition",
                callBack: (state, dispatch) => {
                    //// generatePdf(state, dispatch, "receipt_download");
                    downloadReceipt(state, applicationNumber, tenantId);
                },
            },
        },
        downloadPermissionLetterButton: {
            componentPath: "Button",
            props: {
                variant: "outlined",
                color: "primary",
                style: {
                    //   minWidth: "200px",
                    height: "48px",
                    marginRight: "16px",
                },
            },
            children: {
                downloadReceiptButtonLabel: getLabel({
                    labelName: "DOWNLOAD PERMISSION LETTER",
                    labelKey: "BK_BUTTON_DOWNLOAD_PERMISSION_LETTER",
                }),
            },
            onClickDefination: {
                action: "condition",
                callBack: (state, dispatch) => {
                    //// generatePdf(state, dispatch, "receipt_download");
                    downloadCertificate(
                        state,
                        applicationNumber,
                        tenantId
                    );
                },
            },
            visible: (businessService === "OSBM" || businessService === "GFCP" || businessService === "OSUJM" || businessService === "PACC" || businessService === "BKROOM") ? true : false
        },
        gotoHome: {
            componentPath: "Button",
            props: {
                variant: "contained",
                color: "primary",
                style: {
                    //    minWidth: "200px",
                    height: "48px",
                    marginRight: "16px",
                },
            },
            children: {
                goToHomeButtonLabel: getLabel({
                    labelName: "GO TO HOME",
                    labelKey: "BK_BUTTON_HOME",
                }),
            },
            onClickDefination: {
                action: "page_change",
                path:
                    process.env.REACT_APP_SELF_RUNNING === "true"
                        ? `/egov-ui-framework/egov-services/search`
                        : `/`,
            },
            visible: true,
        },
    });
};
export const applicationSuccessFooter = (
    state,
    applicationNumber,
    tenantId,
    businessService
) => {
    return getCommonApplyFooter({
        //call gotoHome
        downloadApplicationButton: {
            componentPath: "Button",
            props: {
                variant: "outlined",
                color: "primary",
                style: {
                    //   minWidth: "200px",
                    height: "48px",
                    marginRight: "16px",
                },
            },
            children: {
                downloadReceiptButtonLabel: getLabel({
                    labelName: "DOWNLOAD Application",
                    labelKey: "BK_BUTTON_DOWNLOAD_APPLICATION",
                }),
            },
            onClickDefination: {
                action: "condition",
                callBack: (state, dispatch) => {
                    //// generatePdf(state, dispatch, "receipt_download");
                    downloadApplication(state, applicationNumber, tenantId);
                },
            },
        },
        gotoHome: {
            componentPath: "Button",
            props: {
                variant: "contained",
                color: "primary",
                style: {
                    //    minWidth: "200px",
                    height: "48px",
                    marginRight: "16px",
                },
            },
            children: {
                goToHomeButtonLabel: getLabel({
                    labelName: "GO TO HOME",
                    labelKey: "BK_BUTTON_HOME",
                }),
            },
            onClickDefination: {
                action: "page_change",
                path:
                    process.env.REACT_APP_SELF_RUNNING === "true"
                        ? `/egov-ui-framework/egov-services/search`
                        : `/`,
            },
            visible: true,
        },
    });
};

const getCommonApplyFooter = (children) => {
    return {
        uiFramework: "custom-atoms",
        componentPath: "Div",
        props: {
            className: "apply-wizard-footer",
        },
        children,
    };
};
const getAcknowledgementCard = (
    state,
    dispatch,
    purpose,
    status,
    applicationNumber,
    secondNumber,
    tenantId,
    businessService
) => {
    if (purpose === "apply" && status === "success") {
        return {
            header,
            applicationSuccessCard: {
                uiFramework: "custom-atoms",
                componentPath: "Div",
                children: {
                    card: acknowledgementCard({
                        icon: "done",
                        backgroundColor: "#39CB74",
                        header: {
                            labelName: "Application Submitted Successfully",
                            labelKey: "BK_APPLICATION_SUCCESS_MESSAGE_MAIN",
                        },
                        body: {
                            labelName:
                                "A notification regarding Application Submission has been sent to the applicant registered Mobile No.",
                            labelKey: "BK_APPLICATION_SUCCESS_MESSAGE_SUB",
                        },

                        tailText: {
                            labelName: "Application No.",
                            labelKey: "BK_APP_NO_LABEL",
                        },
                        number: applicationNumber,
                    }),
                },
            },

            applicationSuccessFooter: applicationSuccessFooter(
                state,
                applicationNumber,
                tenantId,
                businessService
            ),
        };
    } else if (purpose === "pay" && status === "success") {
        return {
            header,
            applicationSuccessCard: {
                uiFramework: "custom-atoms",
                componentPath: "Div",
                children: {
                    card: acknowledgementCard({
                        icon: "done",
                        backgroundColor: "#39CB74",
                        header: {
                            labelName:
                                "Payment has been collected successfully!",
                            labelKey:
                                "BK_PAYMENT_COLLECTION_SUCCESS_MESSAGE_MAIN",
                        },
                        body: {
                            labelName:
                                "A notification regarding Payment Collection has been sent to the applicant at registered Mobile No.",
                            labelKey: "BK_PAYMENT_SUCCESS_MESSAGE_SUB",
                        },
                        tailText: {
                            labelName: "Transaction No.",
                            labelKey: "BK_PMT_TXN_ID",
                        },
                        number: secondNumber,
                    }),
                },
            },
            paymentSuccessFooter: paymentSuccessFooter(
                state,
                applicationNumber,
                tenantId,
                businessService
            ),
        };
    } else if (purpose === "pay" && status === "failure") {
        return {
            header,
            applicationSuccessCard: {
                uiFramework: "custom-atoms",
                componentPath: "Div",
                children: {
                    card: acknowledgementCard({
                        icon: "close",
                        backgroundColor: "#E54D42",
                        header: {
                            labelName: "Payment has failed!",
                            labelKey: "BK_PAYMENT_FAILURE_MESSAGE_MAIN",
                        },
                        body: {
                            labelName:
                                "A notification regarding payment failure has been sent to the applicant.",
                            labelKey: "BK_PAYMENT_FAILURE_MESSAGE_SUB",
                        },
                    }),
                },
            },
            paymentFailureFooter: paymentFailureFooter(
                state,
                applicationNumber,
                tenantId,
                businessService
            ),
        };
    }
};

const setApplicationData = async (dispatch, applicationNumber, tenantId) => {
    const queryObject = [
        {
            key: "tenantId",
            value: tenantId,
        },
        {
            key: "applicationNumber",
            value: applicationNumber,
        },
    ];


    const response = await getSearchResultsView(queryObject);

    dispatch(
        prepareFinalObject("Booking", get(response, "bookingsModelList[0]", []))
    );
};

const setApplicationDataForRoom = async (dispatch, applicationNumber, tenantId) => {


    let response = await getSearchResultsViewForRoomBooking([
        { key: "applicationNumber", value: applicationNumber },
      ]);
  
    response = get(response, "communityCenterRoomBookingMap", []);
    let payload = response[Object.keys(response)[0]];
    dispatch(
        prepareFinalObject("Booking", payload, [])
    );
};

const setApplicationDataForNewLocOSWMCC = async (dispatch, applicationNumber, tenantId) => {
    const queryObject = [
        {
            key: "tenantId",
            value: tenantId,
        },
        {
            key: "applicationNumber",
            value: applicationNumber,
        },
    ];


    const response = await getSearchResultsViewForNewLocOswmcc(queryObject);
    
    dispatch(
        prepareFinalObject("Booking", get(response, "osujmNewLocationModelList[0]", []))
    );
};

const screenConfig = {
    uiFramework: "material-ui",
    name: "acknowledgement",
    components: {
        div: {
            uiFramework: "custom-atoms",
            componentPath: "Div",
            props: {
                className: "common-div-css",
            },
        },
    },
    beforeInitScreen: (action, state, dispatch) => {
        const purpose = getQueryArg(window.location.href, "purpose");
        const status = getQueryArg(window.location.href, "status");
        const applicationNumber = getQueryArg(
            window.location.href,
            "applicationNumber"
        );
        const secondNumber = getQueryArg(window.location.href, "secondNumber");
        const tenantId = getQueryArg(window.location.href, "tenantId");
        const businessService = getQueryArg(
            window.location.href,
            "businessService"
        );
        setapplicationNumber(applicationNumber);
        setapplicationType(businessService);
        const data = getAcknowledgementCard(
            state,
            dispatch,
            purpose,
            status,
            applicationNumber,
            secondNumber,
            tenantId,
            businessService
        );

        const bookingTypeIdentifier = get(
            state,
            "screenConfiguration.screenConfig.applyNewLocationUnderMCC.name"
        );
        if (bookingTypeIdentifier === "applyNewLocationUnderMCC") {
            setApplicationDataForNewLocOSWMCC(dispatch, applicationNumber, tenantId);
        }else if(businessService==='BKROOM'){
            setApplicationDataForRoom(dispatch, applicationNumber, tenantId);
        }else{
            setApplicationData(dispatch, applicationNumber, tenantId);
        }
        set(action, "screenConfig.components.div.children", data);
        return action;
    },
};

export default screenConfig;
