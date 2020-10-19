import {
    dispatchMultipleFieldChangeAction,
    getLabel,
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import get from "lodash/get";

import {
    getCommonApplyFooter,
    generateBill,
} from "../../utils";
import "./index.css";
import { createUpdateWtbApplication } from "../../../../../ui-utils/commons";
import {
    getTenantId,
    setapplicationNumber,
} from "egov-ui-kit/utils/localStorageUtils";
import { set } from "lodash";
const moveToReview = (state, dispatch) => {
    let validateDocumentField = true;

    const bkDate = get(
        state,
        "screenConfiguration.preparedFinalObject.Booking.bkDate"
    );
    const bkTime = get(
        state,
        "screenConfiguration.preparedFinalObject.Booking.bkTime"
    );

    const bkStatus = get(
        state,
        "screenConfiguration.preparedFinalObject.Booking.bkStatus"
    );
    if (bkStatus.includes("Paid")) {
        if (bkDate) {
            let currentTimestamp = new Date().getTime();
            const [year, month, day] = bkDate.split("-");
            const [hour, min] = bkTime.split(":");

            let bookingDateObj = new Date(year, parseInt(month, 10) - 1, day, hour, min);
            let bookingTimestamp = bookingDateObj.getTime();

            if (bookingTimestamp < currentTimestamp) {
                dispatch(
                    toggleSnackbar(
                        true,
                        { labelName: "You can not select Past Time!", labelKey: "" },
                        "warning"
                    )
                );
                validateDocumentField = false;
            } else {
                validateDocumentField = true;
            }
        } else {
            dispatch(
                toggleSnackbar(
                    true,
                    { labelName: "Please select Date!", labelKey: "" },
                    "warning"
                )
            );
            validateDocumentField = false;
        }
    } else {
        validateDocumentField = true;
    }

    return validateDocumentField;
}
const callBackForNext = async (state, dispatch) => {
    let errorMessage = "";
    let activeStep = get(
        state.screenConfiguration.screenConfig["applywatertanker"],
        "components.div.children.stepper.props.activeStep",
        0
    );
    let bookingData = get(
        state,
        "screenConfiguration.preparedFinalObject.Booking"
    );
    let isFormValid = false;
    let hasFieldToaster = true;

    let validatestepformflag = validatestepform(activeStep + 1);

    isFormValid = validatestepformflag[0];
    hasFieldToaster = validatestepformflag[1];
    //console.log(activeStep, "active Step Nero");
    //isFormValid = moveToReview(state, dispatch);
    if (activeStep === 1 && isFormValid != false) {
        isFormValid = moveToReview(state, dispatch);
    }
    if (activeStep === 1 && isFormValid != false) {
        let response = await createUpdateWtbApplication(
            state,
            dispatch,
            "INITIATE"
        );
        let responseStatus = get(response, "status", "");
        if (responseStatus == "SUCCESS" || responseStatus == "success") {
            isFormValid = true;

            // DISPLAY SUCCESS MESSAGE
            // let successMessage = {
            //     labelName: "APPLICATION INITIATED SUCCESSFULLY! ",
            //     labelKey: "", //UPLOAD_FILE_TOAST
            // };
            // dispatch(toggleSnackbar(true, successMessage, "success"));

            let tenantId = getTenantId().split(".")[0];
            let applicationNumber = get(
                response,
                "data.bkApplicationNumber",
                ""
            );
            let businessService = get(response, "data.businessService", "");
            const reviewUrl = `/egov-services/applywatertanker?applicationNumber=${applicationNumber}&tenantId=${tenantId}&businessService=${businessService}`;
            dispatch(setRoute(reviewUrl));

            set(
                state.screenConfiguration.screenConfig["applywatertanker"],
                "components.div.children.headerDiv.children.header.children.applicationNumber.visible",
                true
            );
            set(
                state.screenConfiguration.screenConfig["applywatertanker"],
                "components.div.children.formwizardThirdStep.children.summaryDetails.children.cardContent.children.div.children.estimateSummary.visible",
                false
            );

            // GET FEE DETAILS
            if (bookingData.bkStatus.includes("Paid")) {
                set(
                    state.screenConfiguration.screenConfig["applywatertanker"],
                    "components.div.children.formwizardThirdStep.children.summaryDetails.children.cardContent.children.div.children.estimateSummary.visible",
                    true
                );
                await generateBill(
                    state,
                    dispatch,
                    applicationNumber,
                    tenantId,
                    "BWT"
                );
            }
        } else {
            isFormValid = false;
            let errorMessage = {
                labelName: "Submission Falied, Try Again later!",
                labelKey: "", //UPLOAD_FILE_TOAST
            };
            dispatch(toggleSnackbar(true, errorMessage, "error"));
        }
    }
    if (activeStep === 2) {
        if (bookingData.bkStatus.includes("Paid")) {
            let applicationData = get(
                state.screenConfiguration.preparedFinalObject,
                "Booking"
            );
            setapplicationNumber(applicationData.bkApplicationNumber);
            // setTimeout(() => {
            const appendUrl =
                process.env.REACT_APP_SELF_RUNNING === "true"
                    ? "/egov-ui-framework"
                    : "";
            const reviewUrl = `/egov-services/pay?applicationNumber=${applicationData.bkApplicationNumber}&tenantId=${applicationData.tenantId}&businessService=${applicationData.businessService}`;
            dispatch(setRoute(reviewUrl));
            // }, 1000);
        } else {
            let response = await createUpdateWtbApplication(
                state,
                dispatch,
                "FAILUREAPPLY"
            );
            let responseStatus = get(response, "status", "");
            if (responseStatus == "SUCCESS" || responseStatus == "success") {
                // let successMessage = {
                //     labelName: "APPLICATION SUBMITTED SUCCESSFULLY! ",
                //     labelKey: "", //UPLOAD_FILE_TOAST
                // };
                // dispatch(toggleSnackbar(true, successMessage, "success"));
                let tenantId = getTenantId().split(".")[0];
                let applicationNumber = get(
                    response,
                    "data.bkApplicationNumber",
                    ""
                );
                let businessService = get(response, "data.businessService", "");
                const reviewUrl = `/egov-services/acknowledgement?purpose=${"apply"}&status=${"success"}&applicationNumber=${applicationNumber}&tenantId=${tenantId}&businessService=${businessService}`;
                dispatch(setRoute(reviewUrl));
            } else {
                let errorMessage = {
                    labelName: "Submission Falied, Try Again later!",
                    labelKey: "", //UPLOAD_FILE_TOAST
                };
                dispatch(toggleSnackbar(true, errorMessage, "error"));
            }
        }
    }
    if (activeStep !== 2) {
        if (isFormValid) {
            changeStep(state, dispatch);
        } else if (hasFieldToaster) {
            errorMessage = {
                labelName: "Please fill all mandatory fields!",
                labelKey: "BK_ERR_FILL_ALL_MANDATORY_FIELDS",
            };
            switch (activeStep) {
                case 0:
                    errorMessage = {
                        labelName:
                            "Please check the Missing/Invalid field, then proceed!",
                        labelKey: "BK_ERR_FILL_ALL_MANDATORY_FIELDS",
                    };
                    break;
                case 1:
                    errorMessage = {
                        labelName:
                            "Please fill all mandatory fields, then proceed!",
                        labelKey: "BK_ERR_FILL_ALL_MANDATORY_FIELDS",
                    };
                    break;
            }
            dispatch(toggleSnackbar(true, errorMessage, "warning"));
        }
    }
};

export const changeStep = (
    state,
    dispatch,
    mode = "next",
    defaultActiveStep = -1
) => {
    let activeStep = get(
        state.screenConfiguration.screenConfig["applywatertanker"],
        "components.div.children.stepper.props.activeStep",
        0
    );
    let bookingData = get(
        state,
        "screenConfiguration.preparedFinalObject.Booking"
    );
    if (defaultActiveStep === -1) {
        activeStep = mode === "next" ? activeStep + 1 : activeStep - 1;
    } else {
        activeStep = defaultActiveStep;
    }

    const isPreviousButtonVisible = activeStep > 0 ? true : false;
    const isNextButtonVisible = activeStep < 2 ? true : false;
    const isPayButtonVisible = activeStep === 2 ? true : false;
    const actionDefination = [
        {
            path: "components.div.children.stepper.props",
            property: "activeStep",
            value: activeStep,
        },
        {
            path: "components.div.children.footer.children.previousButton",
            property: "visible",
            value: isPreviousButtonVisible,
        },
        {
            path: "components.div.children.footer.children.nextButton",
            property: "visible",
            value: isNextButtonVisible,
        },
        {
            path: "components.div.children.footer.children.payButton",
            property: "visible",
            value: isPayButtonVisible,
        },
    ];
    dispatchMultipleFieldChangeAction(
        "applywatertanker",
        actionDefination,
        dispatch
    );
    renderSteps(activeStep, dispatch);
};

export const renderSteps = (activeStep, dispatch) => {
    switch (activeStep) {
        case 0:
            dispatchMultipleFieldChangeAction(
                "applywatertanker",
                getActionDefinationForStepper(
                    "components.div.children.formwizardFirstStep"
                ),
                dispatch
            );
            break;
        case 1:
            dispatchMultipleFieldChangeAction(
                "applywatertanker",
                getActionDefinationForStepper(
                    "components.div.children.formwizardSecondStep"
                ),
                dispatch
            );
            break;
        default:
            dispatchMultipleFieldChangeAction(
                "applywatertanker",
                getActionDefinationForStepper(
                    "components.div.children.formwizardThirdStep"
                ),
                dispatch
            );
    }
};

export const getActionDefinationForStepper = (path) => {
    const actionDefination = [
        {
            path: "components.div.children.formwizardFirstStep",
            property: "visible",
            value: true,
        },
        {
            path: "components.div.children.formwizardSecondStep",
            property: "visible",
            value: false,
        },
        {
            path: "components.div.children.formwizardThirdStep",
            property: "visible",
            value: false,
        },
    ];
    for (var i = 0; i < actionDefination.length; i++) {
        actionDefination[i] = {
            ...actionDefination[i],
            value: false,
        };
        if (path === actionDefination[i].path) {
            actionDefination[i] = {
                ...actionDefination[i],
                value: true,
            };
        }
    }
    return actionDefination;
};

export const callBackForPrevious = (state, dispatch) => {
    changeStep(state, dispatch, "previous");
};

export const footer = getCommonApplyFooter({
    previousButton: {
        componentPath: "Button",
        props: {
            variant: "outlined",
            color: "primary",
            style: {
                // minWidth: "200px",
                height: "48px",
                marginRight: "16px",
            },
        },
        children: {
            previousButtonIcon: {
                uiFramework: "custom-atoms",
                componentPath: "Icon",
                props: {
                    iconName: "keyboard_arrow_left",
                },
            },
            previousButtonLabel: getLabel({
                labelName: "Previous Step",
                labelKey: "BK_COMMON_BUTTON_PREV_STEP",
            }),
        },
        onClickDefination: {
            action: "condition",
            callBack: callBackForPrevious,
        },
        visible: false,
    },
    nextButton: {
        componentPath: "Button",
        props: {
            variant: "contained",
            color: "primary",
            style: {
                // minWidth: "200px",
                height: "48px",
                marginRight: "45px",
            },
        },
        children: {
            nextButtonLabel: getLabel({
                labelName: "Next Step",
                labelKey: "BK_COMMON_BUTTON_NXT_STEP",
            }),
            nextButtonIcon: {
                uiFramework: "custom-atoms",
                componentPath: "Icon",
                props: {
                    iconName: "keyboard_arrow_right",
                },
            },
        },
        onClickDefination: {
            action: "condition",
            callBack: callBackForNext,
        },
    },
    payButton: {
        componentPath: "Button",
        props: {
            variant: "contained",
            color: "primary",
            style: {
                //minWidth: "200px",
                height: "48px",
                marginRight: "45px",
            },
        },
        children: {
            submitButtonLabel: getLabel({
                labelName: "Submit",
                labelKey: "BK_COMMON_BUTTON_SUBMIT",
            }),
            submitButtonIcon: {
                uiFramework: "custom-atoms",
                componentPath: "Icon",
                props: {
                    iconName: "keyboard_arrow_right",
                },
            },
        },
        onClickDefination: {
            action: "condition",
            callBack: callBackForNext,
        },
        visible: false,
    },
});

export const validatestepform = (activeStep, isFormValid, hasFieldToaster) => {
    let allAreFilled = true;
    document
        .getElementById("apply_form" + activeStep)
        .querySelectorAll("[required]")
        .forEach(function (i) {
            i.parentNode.classList.remove("MuiInput-error-853");
            i.parentNode.parentNode.classList.remove("MuiFormLabel-error-844");
            if (!i.value) {
                i.focus();
                allAreFilled = false;
                i.parentNode.classList.add("MuiInput-error-853");
                i.parentNode.parentNode.classList.add("MuiFormLabel-error-844");
            }
            if (i.getAttribute("aria-invalid") === "true" && allAreFilled) {
                i.parentNode.classList.add("MuiInput-error-853");
                i.parentNode.parentNode.classList.add("MuiFormLabel-error-844");
                allAreFilled = false;
                isFormValid = false;
                hasFieldToaster = true;
            }
        });

    document
        .getElementById("apply_form" + activeStep)
        .querySelectorAll("input[type='hidden']")
        .forEach(function (i) {
            i.parentNode.classList.remove("MuiInput-error-853");
            i.parentNode.parentNode.parentNode.classList.remove(
                "MuiFormLabel-error-844"
            );
            if (i.value == i.placeholder) {
                i.focus();
                allAreFilled = false;
                i.parentNode.classList.add("MuiInput-error-853");
                i.parentNode.parentNode.parentNode.classList.add(
                    "MuiFormLabel-error-844"
                );
                allAreFilled = false;
                isFormValid = false;
                hasFieldToaster = true;
            }
        });
    if (!allAreFilled) {
        isFormValid = false;
        hasFieldToaster = true;
    } else {
        isFormValid = true;
        hasFieldToaster = false;
    }
    return [isFormValid, hasFieldToaster];
};
