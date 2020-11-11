import {
    getCommonHeader,
    getCommonContainer,
} from "egov-ui-framework/ui-config/screens/specs/utils";
import acknowledgementCard from "./acknowledgementResource/acknowledgementUtils";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import { getSearchResultsView, getSearchResultsViewForNewLocOswmcc } from "../../../../ui-utils/commons";
import {
    downloadReceipt,
    downloadCertificate,
    downloadCancelledBookingReceipt,
} from "../utils";
import { getLabel } from "egov-ui-framework/ui-config/screens/specs/utils";
import set from "lodash/set";
import get from "lodash/get";
import { getCurrentFinancialYear } from "../utils";

import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getapplicationType, setapplicationType, setapplicationNumber } from "egov-ui-kit/utils/localStorageUtils";

export const header = getCommonContainer({
    header: getCommonHeader({
        labelName: `Booking Cancellation`, //later use getFinancialYearDates
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
                    labelName: "DOWNLOAD RECEIPT",
                    labelKey: "BK_PACC_BUTTON_DOWNLOAD_CANCEL_RCPT",
                }),
            },
            onClickDefination: {
                action: "condition",
                callBack: (state, dispatch) => {
                    //// generatePdf(state, dispatch, "receipt_download");
                    downloadCancelledBookingReceipt(state, applicationNumber, tenantId);
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
    if (purpose === "confirmed") {
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
                            labelName: "Booking cancellation successfully",
                            labelKey: "BK_PACC_APPLICATION_CANCELLATION_MESSAGE",
                        },
                        body: {
                            labelName:
                                "Your booking has been cancelled and refund process initiated successfully",
                            labelKey: "BK_PACC_APPLICATION_CANCELLATION_MESSAGE_SUB",
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
    name: "acknowledgementrefundparkcc",
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
        } else {
            setApplicationData(dispatch, applicationNumber, tenantId);
        }
        set(action, "screenConfig.components.div.children", data);
        return action;
    },
};

export default screenConfig;
