import {
    getCommonGrayCard,
    getCommonSubHeader
} from "egov-ui-framework/ui-config/screens/specs/utils";

export const estimateSummary = getCommonGrayCard({
    header: {
        uiFramework: "custom-atoms",
        componentPath: "Container",
        props: {
            style: { marginBottom: "10px" },
        },
        children: {
            header: {
                gridDefination: {
                    xs: 8,
                },
                ...getCommonSubHeader({
                    labelName: "Refund Details",
                    labelKey: "BK_PACC_REFUND_DETAILS",
                }),
            },
        },
    },
    estimateCard: {
        uiFramework: "custom-containers-local",
        moduleName: "egov-services",
        componentPath: "RefundAmountContainer",
        props: {},
    },
});

export const getRefundEstimateSummary = getCommonGrayCard({
    header: {
        uiFramework: "custom-atoms",
        componentPath: "Container",
        props: {
            style: { marginBottom: "10px" },
        },
        children: {
            header: {
                gridDefination: {
                    xs: 8,
                },
                ...getCommonSubHeader({
                    labelName: "Refund Details",
                    labelKey: "BK_PACC_REFUND_DETAILS",
                }),
            },
        },
    },
    estimateCard: {
        uiFramework: "custom-containers-local",
        moduleName: "egov-services",
        componentPath: "RefundFeeAmountContainer",
        props: {},
    },
});

