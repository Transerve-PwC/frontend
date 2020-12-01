import { getLabel } from "egov-ui-framework/ui-config/screens/specs/utils";
import { getCommonApplyFooter, showHideAdhocPopup } from "../../utils";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import {
    getapplicationType,
    getapplicationNumber,
    getTenantId
} from "egov-ui-kit/utils/localStorageUtils";
import "./index.css";
import get from "lodash/get";

export const callBackForCancel = (state, dispatch) => {
    dispatch(setRoute("/egov-services/my-applications"));
};
export const callBackForEdit = (state, dispatch) => {
    let applicationNumber = getapplicationNumber()
    let businessService = getapplicationType();
    let tenantId = getTenantId().split(".")[0]
    dispatch(setRoute(`/egov-services/checkavailability_pcc?applicationNumber=${applicationNumber}&tenantId=${tenantId}&businessService=${businessService}`));
};

export const callBackForNext = (state, dispatch, pathKey) => {
    const applicationNumber = getQueryArg(
        window.location.href,
        "applicationNumber"
    );
    const businessService = get(
        state,
        "screenConfiguration.preparedFinalObject.Booking.businessService",
        {}
    );
    dispatch(
        setRoute(
            `/egov-services/pay?applicationNumber=${applicationNumber}&tenantId=${
            getTenantId().split(".")[0]
            }&businessService=${businessService}`
        )
    );
};

export const callBackForCancelParkAndCC = (state, dispatch) => {
    const applicationNumber = getQueryArg(
        window.location.href,
        "applicationNumber"
    );
    const businessService = get(
        state,
        "screenConfiguration.preparedFinalObject.Booking.businessService",
        {}
    );
    dispatch(
        setRoute(
            `/egov-services/cancelparkccbooking?applicationNumber=${applicationNumber}&tenantId=${
            getTenantId().split(".")[0]
            }&businessService=${businessService}`
        )
    );
};


export const callBackForRefundSecurityFee = (state, dispatch) => {
    const applicationNumber = getQueryArg(
        window.location.href,
        "applicationNumber"
    );
    const businessService = get(
        state,
        "screenConfiguration.preparedFinalObject.Booking.businessService",
        {}
    );
    dispatch(
        setRoute(
            `/egov-services/refundsecfeeparkccbooking?applicationNumber=${applicationNumber}&tenantId=${
            getTenantId().split(".")[0]
            }&businessService=${businessService}`
        )
    );
};

export const footer = getCommonApplyFooter({

    cancelButton: {
        componentPath: "Button",
        props: {
            variant: "outlined",
            color: "primary",
            style: {
                minWidth: "180px",
                height: "48px",
                marginRight: "16px",
                borderRadius: "inherit",
            },
        },
        children: {

            previousButtonLabel: getLabel({
                labelName: "CANCEL",
                labelKey: "BK_MY_BK_BUTTON_CANCEL",
            }),
        },
        onClickDefination: {
            action: "condition",
            callBack: callBackForCancel,
        },
        visible: false,
    },



    submitButton: {
        componentPath: "Button",
        props: {
            variant: "contained",
            color: "primary",
            style: {
                minWidth: "180px",
                height: "48px",
                marginRight: "45px",
                borderRadius: "inherit",
            },
        },
        children: {
            nextButtonLabel: getLabel({
                labelName: "Make Payment",
                labelKey: "BK_MY_BK_BUTTON_PAYMENT",
            }),

        },
        onClickDefination: {
            action: "condition",
            // callBack: callBackForNext,
            callBack: (state, dispatch) =>
                callBackForNext(state, dispatch, "pay"),
        },
        visible: false,

    },
});


export const footerForParkAndCC = getCommonApplyFooter({
    refundSecurityFeeButton: {
        componentPath: "Button",
        props: {
            variant: "outlined",
            color: "primary",
            style: {
                minWidth: "180px",
                height: "48px",
                marginRight: "16px",
                borderRadius: "inherit",
            },
        },
        children: {

            previousButtonLabel: getLabel({
                labelName: "REFUND SECURITY",
                labelKey: "REFUND SECURITY",
            }),
        },
        onClickDefination: {
            action: "condition",
            callBack: callBackForRefundSecurityFee,
        },
        visible: false,
    },
    cancelButton: {
        componentPath: "Button",
        props: {
            variant: "outlined",
            color: "primary",
            style: {
                minWidth: "180px",
                height: "48px",
                marginRight: "16px",
                borderRadius: "inherit",
            },
        },
        children: {
            previousButtonLabel: getLabel({
                labelName: "CANCEL BOOKING",
                labelKey: "BK_PACC_BUTTON_CANCEL_BOOKING",
            }),
        },
        onClickDefination: {
            action: "condition",
            callBack: callBackForCancelParkAndCC,
        },
        visible: false,
    },
    editButton: {
        componentPath: "Button",
        props: {
            variant: "outlined",
            color: "primary",
            style: {
                minWidth: "180px",
                height: "48px",
                marginRight: "45px",
                borderRadius: "inherit",
            },
        },
        children: {
            nextButtonLabel: getLabel({
                labelName: "CHANGE DATE/VENUE",
                labelKey: "BK_PACC_CHANGE_DATE_VENUE_BUTTON_EDIT",
            }),

        },
        onClickDefination: {
            action: "condition",
            callBack: callBackForEdit,
        },
        visible: false,

    },
});