import { getLabel } from "egov-ui-framework/ui-config/screens/specs/utils";
import { getCommonApplyFooter, showHideAdhocPopup, goForRefund } from "../../utils";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";

import { getTenantId } from "egov-ui-kit/utils/localStorageUtils";
import get from "lodash/get";

import {
    createUpdatePCCApplication
} from "../../../../../ui-utils/commons";

import {

    toggleSnackbar,
} from "egov-ui-framework/ui-redux/screen-configuration/actions";


export const callBackForEdit = (state, dispatch) => {
    dispatch(setRoute("/egov-services/my-applications"));
};

export const callBackForCancelParkAndCC = async (state, dispatch) => {


    const { screenConfiguration } = state;
    const bookingDate = get(
        screenConfiguration,
        "preparedFinalObject.Booking.bkFromDate",
        []
    )
    const applicationNumber = getQueryArg(
        window.location.href,
        "applicationNumber"
    );
    const businessService = get(
        state,
        "screenConfiguration.preparedFinalObject.Booking.businessService",
        {}
    );
/*
    var billAccountDetails = get(
        screenConfiguration,
        "preparedFinalObject.ReceiptTemp[0].Bill[0].billDetails[0].billAccountDetails",
        []
    );
    let bookingAmount = 0;
    for (let i = 0; i < billAccountDetails.length; i++) {
        if (billAccountDetails[i].taxHeadCode == "REFUNDABLE_SECURITY") {
            bookingAmount += billAccountDetails[i].amount;
        }
        if (billAccountDetails[i].taxHeadCode == "PACC") {
            bookingAmount += billAccountDetails[i].amount;
        }
    }

    var date1 = new Date(bookingDate);
    var date2 = new Date();

    var Difference_In_Time = date1.getTime() - date2.getTime();

    // To calculate the no. of days between two dates
    var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);

    let refundAmount = 0
    if (Difference_In_Days > 29) {
        const refundPercent = get(
            screenConfiguration,
            "preparedFinalObject.cancelParkCcScreenMdmsData.Booking.bookingCancellationRefundCalc[0].MORETHAN30DAYS.refundpercentage",
            []
        )

        refundAmount = (parseFloat(bookingAmount) * refundPercent) / 100
    } else if (Difference_In_Days > 15 && Difference_In_Days < 30) {
        const refundPercent = get(
            screenConfiguration,
            "preparedFinalObject.cancelParkCcScreenMdmsData.Booking.bookingCancellationRefundCalc[0].LETTHAN30MORETHAN15DAYS.refundpercentage",
            []
        )
        refundAmount = (parseFloat(bookingAmount) * refundPercent) / 100
    }
    var refundData = get(
        screenConfiguration,
        "preparedFinalObject.refundData",
        []
    );
    let refundObj = {};

    refundObj.txnAmount = refundData.txnAmount;
    refundObj.gatewayRefundStatusCode = refundData.txnStatus;
    refundObj.gatewayRefundStatusMsg = refundData.txnStatusMsg;
    refundObj.gateway = refundData.gateway;
    refundObj.gatewayTxnId = refundData.txnId;
    refundObj.txnId = refundData.txnId;
    refundObj.refundAmount = refundAmount;
    refundObj.tenantId = refundData.tenantId;

    let refResponse = await goForRefund(refundObj);

    if (refResponse.status == "success") {
        let response = await createUpdatePCCApplication(
            state,
            dispatch,
            "CANCEL"
        );

        let responseStatus = get(response, "status", "");
        if (responseStatus == "SUCCESS" || responseStatus == "success" || responseStatus == "200") {
            dispatch(
                setRoute(
                    `/egov-services/acknowledgementrefundparkcc?purpose=confirmed&applicationNumber=${applicationNumber}&tenantId=${getTenantId().split(".")[0]
                    }&businessService=${businessService}`
                )
            );
        } else {
            let errorMessage = {
                labelName: "Submission Falied, Try Again later!",
                labelKey: "", //UPLOAD_FILE_TOAST
            };
            dispatch(toggleSnackbar(true, errorMessage, "error"));
        }
    }*/

    let response = await createUpdatePCCApplication(
        state,
        dispatch,
        "CANCEL"
    );

    let responseStatus = get(response, "status", "");
    if (responseStatus == "SUCCESS" || responseStatus == "success" || responseStatus == "200") {
        dispatch(
            setRoute(
                `/egov-services/acknowledgementrefundparkcc?purpose=confirmed&applicationNumber=${applicationNumber}&tenantId=${getTenantId().split(".")[0]
                }&businessService=${businessService}`
            )
        );
    } else {
        let errorMessage = {
            labelName: "Submission Falied, Try Again later!",
            labelKey: "", //UPLOAD_FILE_TOAST
        };
        dispatch(toggleSnackbar(true, errorMessage, "error"));
    }

};


export const callBackForRefundSecFee = async (state, dispatch) => {

    const applicationNumber = getQueryArg(
        window.location.href,
        "applicationNumber"
    );

    const businessService = get(
        state,
        "screenConfiguration.preparedFinalObject.Booking.businessService",
        {}
    );
    /*
    const { screenConfiguration } = state;
    const bookingDate = get(
        screenConfiguration,
        "preparedFinalObject.Booking.bkFromDate",
        []
    )
    const applicationNumber = getQueryArg(
        window.location.href,
        "applicationNumber"
    );
    const businessService = get(
        state,
        "screenConfiguration.preparedFinalObject.Booking.businessService",
        {}
    );

    var billAccountDetails = get(
        screenConfiguration,
        "preparedFinalObject.ReceiptTemp[0].Bill[0].billDetails[0].billAccountDetails",
        []
    );
    let securityAmount = 0;
    for (let i = 0; i < billAccountDetails.length; i++) {
        if (billAccountDetails[i].taxHeadCode == "REFUNDABLE_SECURITY") {
            securityAmount += billAccountDetails[i].amount;
        }

    }*/
    // dispatch(
    //     setRoute(
    //         `/egov-services/acknowledgementsecurityfeerefundparkcc?purpose=confirmed&applicationNumber=${applicationNumber}&tenantId=${getTenantId().split(".")[0]
    //         }&businessService=${businessService}`
    //     )
    // );

            let response = await createUpdatePCCApplication(
                state,
                dispatch,
                "SECURITY_REFUND"
            );

            let responseStatus = get(response, "status", "");
            if (responseStatus == "SUCCESS" || responseStatus == "success" || responseStatus == "200") {
                dispatch(
                    setRoute(
                        `/egov-services/acknowledgementsecurityfeerefundparkcc?purpose=confirmed&applicationNumber=${applicationNumber}&tenantId=${getTenantId().split(".")[0]
                        }&businessService=${businessService}`
                    )
                );
            } else {
                let errorMessage = {
                    labelName: "Submission Falied, Try Again later!",
                    labelKey: "", //UPLOAD_FILE_TOAST
                };
                dispatch(toggleSnackbar(true, errorMessage, "error"));
            }




};

export const footerForParkAndCC = getCommonApplyFooter({
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
                labelName: "CONFIRM",
                labelKey: "BK_PACC_BUTTON_CANCEL_BOOKING_CONFIRM",
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
                labelName: "CANCEL",
                labelKey: "BK_MY_BK_BUTTON_CANCEL",
            }),

        },
        onClickDefination: {
            action: "condition",
            callBack: callBackForEdit,
        },
        visible: false,

    },
});

export const footerForSecFeeRefundParkAndCC = getCommonApplyFooter({
    securityFeeButton: {
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
                labelName: "SUBMIT",
                labelKey: "BK_COMMON_BUTTON_SUBMIT",
            }),
        },
        onClickDefination: {
            action: "condition",
            callBack: callBackForRefundSecFee,
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
                labelName: "CANCEL",
                labelKey: "BK_MY_BK_BUTTON_CANCEL",
            }),

        },
        onClickDefination: {
            action: "condition",
            callBack: callBackForEdit,
        },
        visible: false,

    },
});