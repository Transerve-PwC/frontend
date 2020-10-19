import { getLabel } from "egov-ui-framework/ui-config/screens/specs/utils";
import { getCommonApplyFooter, showHideAdhocPopup } from "../../utils";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";

import { getTenantId } from "egov-ui-kit/utils/localStorageUtils";
import get from "lodash/get";

import {
    createUpdatePCCApplication
} from "../../../../../ui-utils/commons";

export const callBackForEdit = (state, dispatch) => {
    dispatch(setRoute("/egov-services/my-applications"));
};

export const callBackForCancelParkAndCC = async (state, dispatch) => {
    const applicationNumber = getQueryArg(
        window.location.href,
        "applicationNumber"
    );
    const businessService = get(
        state,
        "screenConfiguration.preparedFinalObject.Booking.businessService",
        {}
    );

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
            // previousButtonIcon: {
            //     uiFramework: "custom-atoms",
            //     componentPath: "Icon",
            //     props: {
            //         iconName: "keyboard_arrow_left",
            //     },
            // },
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