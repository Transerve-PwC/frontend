import {
    dispatchMultipleFieldChangeAction,
    getLabel,
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import get from "lodash/get";
import {
    getCommonApplyFooter,
    validateFields,
    generateBill,
    updateBillDemand
} from "../../utils";
import "./index.css";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import { httpRequest } from "../../../../../ui-utils";
import {
    createUpdatePCCApplication,
    prepareDocumentsUploadData,
} from "../../../../../ui-utils/commons";
import {
    localStorageGet,
    localStorageSet,
    getTenantId,
    setapplicationNumber,
    getapplicationNumber,
} from "egov-ui-kit/utils/localStorageUtils";

import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { set } from "lodash";

const moveToReview = (state, dispatch, applnid) => {
    const documentsFormat = Object.values(get(state.screenConfiguration.preparedFinalObject, "documentsUploadRedux")
    );

    let validateDocumentField = false;

    for (let i = 0; i < documentsFormat.length; i++) {
        let isDocumentRequired = get(documentsFormat[i], "isDocumentRequired");
        let isDocumentTypeRequired = get(
            documentsFormat[i], "isDocumentTypeRequired");

        let documents = get(documentsFormat[i], "documents");
        if (isDocumentRequired) {
            if (documents && documents.length > 0) {
                let fileExtArray = ['jpeg', 'png', 'jpg', 'JPEG', 'pdf'];
                let fileExt = documents[0].fileName.split('.').pop();
                if (!fileExtArray.includes(fileExt)) {
                    dispatch(
                        toggleSnackbar(
                            true,
                            { labelName: "Please upload correct document!", labelKey: "" },
                            "warning"
                        )
                    );
                    validateDocumentField = false;
                    break;
                } else {
                    validateDocumentField = true;
                }
                // if (isDocumentTypeRequired) {
                //     if (get(documentsFormat[i], "dropdown.value")) {
                //         validateDocumentField = true;
                //     } else {
                //         dispatch(
                //             toggleSnackbar(
                //                 true,
                //                 { labelName: "Please select type of Document!", labelKey: "" },
                //                 "warning"
                //             )
                //         );
                //         validateDocumentField = false;
                //         break;
                //     }
                // } else {
                //     validateDocumentField = true;
                // }
            } else {
                dispatch(
                    toggleSnackbar(
                        true,


                        { labelName: "Please upload mandatory documents!", labelKey: "" },
                        "warning"
                    )
                );
                validateDocumentField = false;
                break;
            }
        } else {
            validateDocumentField = true;
        }

    }

    //validateDocumentField = true;

    return validateDocumentField;
};
const callBackForNext = async (state, dispatch) => {
    let errorMessage = "";
    let activeStep = get(
        state.screenConfiguration.screenConfig["applyparkcommunitycenter"],
        "components.div.children.stepper.props.activeStep",
        0
    );
    let isFormValid = false;
    let hasFieldToaster = true;

    let validatestepformflag = validatestepform(activeStep + 1);

    isFormValid = validatestepformflag[0];
    hasFieldToaster = validatestepformflag[1];
    if (activeStep === 2 && isFormValid != false) {
        isFormValid = moveToReview(state, dispatch);
    }
    if (activeStep === 2 && isFormValid != false) {
        // prepareDocumentsUploadData(state, dispatch);
        let tenantId = getTenantId().split(".")[0];
        let paymentStatus = get(state, "screenConfiguration.preparedFinalObject.Booking.bkPaymentStatus", "");
       /* let appStatus = get(state, "screenConfiguration.preparedFinalObject.Booking.bkApplicationStatus", "");
        if ((paymentStatus === "SUCCESS" || paymentStatus === "succes") && appStatus == "APPLIED") {
            let businessService = get(state, "screenConfiguration.preparedFinalObject.Booking.businessService", "");
            let applicationNumber = get(state, "screenConfiguration.preparedFinalObject.Booking.bkApplicationNumber", "");
            const reviewUrl = `/egov-services/applyparkcommunitycenter?applicationNumber=${applicationNumber}&tenantId=${tenantId}&businessService=${businessService}`;
                dispatch(setRoute(reviewUrl));

                set(
                    state.screenConfiguration.screenConfig["applyparkcommunitycenter"],
                    "components.div.children.headerDiv.children.header.children.applicationNumber.visible",
                    true
                );


                await updateBillDemand(
                    state,
                    dispatch,
                    applicationNumber,
                    tenantId,
                    businessService
                );

                await generateBill(
                    state,
                    dispatch,
                    applicationNumber,
                    tenantId,
                    businessService
                );

                // GET DOCUMENT DATA FOR DOWNLOAD
                const uploadedDocData = get(
                    state.screenConfiguration.preparedFinalObject,
                    "documentsUploadRedux[0].documents",
                    []
                );
                const documentsPreview =
                    uploadedDocData &&
                    uploadedDocData.map((item) => {
                        return {
                            title: "BK_PCC_DOCUMENT",
                            link: item.fileUrl && item.fileUrl.split(",")[0],
                            linkText: "View",
                            name: item.fileName,
                            fileStoreId: item.fileStoreId,
                        };
                    });

                dispatch(prepareFinalObject("documentsPreview", documentsPreview));

        }else { */

            let action = "INITIATE";
            let appStatus = get(state, "screenConfiguration.preparedFinalObject.Booking.bkApplicationStatus", "");
            if(appStatus == "APPLIED" || appStatus == "RE_INITIATED"){
                action = "RE_INITIATE";
            }
            console.log(appStatus, "Nero appStatus");
            let response = await createUpdatePCCApplication(
                state,
                dispatch,
                action
               // paymentStatus === "SUCCESS" || paymentStatus === "succes" ? "RE_INITIATE" : "INITIATE"

            );
            let responseStatus = get(response, "status", "");
            if (responseStatus == "SUCCESS" || responseStatus == "success") {
                let applicationNumber = get(
                    response,
                    "data.bkApplicationNumber",
                    ""
                );
                let businessService = get(response, "data.businessService", "");
                const reviewUrl = `/egov-services/applyparkcommunitycenter?applicationNumber=${applicationNumber}&tenantId=${tenantId}&businessService=${businessService}`;
                dispatch(setRoute(reviewUrl));

                set(
                    state.screenConfiguration.screenConfig["applyparkcommunitycenter"],
                    "components.div.children.headerDiv.children.header.children.applicationNumber.visible",
                    true
                );

                await generateBill(
                    state,
                    dispatch,
                    applicationNumber,
                    tenantId,
                    businessService
                );

                // GET DOCUMENT DATA FOR DOWNLOAD
                const uploadedDocData = get(
                    state.screenConfiguration.preparedFinalObject,
                    "documentsUploadRedux[0].documents",
                    []
                );
                const documentsPreview =
                    uploadedDocData &&
                    uploadedDocData.map((item) => {
                        return {
                            title: "BK_PCC_DOCUMENT",
                            link: item.fileUrl && item.fileUrl.split(",")[0],
                            linkText: "View",
                            name: item.fileName,
                            fileStoreId: item.fileStoreId,
                        };
                    });

                dispatch(prepareFinalObject("documentsPreview", documentsPreview));

            } else {
                let errorMessage = {
                    labelName: "Submission Falied, Try Again later!",
                    labelKey: "", //UPLOAD_FILE_TOAST
                };
                dispatch(toggleSnackbar(true, errorMessage, "error"));
            }
       // }
    }
    if (activeStep === 3) {
        // prepareDocumentsUploadData(state, dispatch);
        // let response = await createUpdatePCCApplication(
        //     state,
        //     dispatch,
        //     "APPLY"
        // );
        // console.log(response, "step3Response");
        // let responseStatus = get(response, "status", "");
        // if (responseStatus == "SUCCESS" || responseStatus == "success") {
        // let successMessage = {
        //     labelName: "APPLICATION SUBMITTED SUCCESSFULLY! ",
        //     labelKey: "", //UPLOAD_FILE_TOAST
        // };
        // dispatch(toggleSnackbar(true, successMessage, "success"));
        let applicationData = get(
            state.screenConfiguration.preparedFinalObject,
            "Booking"
        );
        const reviewUrl = `/egov-services/pay?applicationNumber=${applicationData.bkApplicationNumber}&tenantId=${applicationData.tenantId}&businessService=${applicationData.businessService}`;
        dispatch(setRoute(reviewUrl));
        // }
        //  else {
        //     let errorMessage = {
        //         labelName: "Submission Falied, Try Again later!",
        //         labelKey: "", //UPLOAD_FILE_TOAST
        //     };
        //     dispatch(toggleSnackbar(true, errorMessage, "error"));
        // }
    }
    if (activeStep !== 3) {
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
        state.screenConfiguration.screenConfig["applyparkcommunitycenter"],
        "components.div.children.stepper.props.activeStep",
        0
    );
    if (defaultActiveStep === -1) {
        activeStep = mode === "next" ? activeStep + 1 : activeStep - 1;
    } else {
        activeStep = defaultActiveStep;
    }

    const isPreviousButtonVisible = activeStep > 0 ? true : false;
    const isNextButtonVisible = activeStep < 3 ? true : false;
    const isPayButtonVisible = activeStep === 3 ? true : false;
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
        "applyparkcommunitycenter",
        actionDefination,
        dispatch
    );
    renderSteps(activeStep, dispatch);
};

export const renderSteps = (activeStep, dispatch) => {
    switch (activeStep) {
        case 0:
            dispatchMultipleFieldChangeAction(
                "applyparkcommunitycenter",
                getActionDefinationForStepper(
                    "components.div.children.formwizardFirstStep"
                ),
                dispatch
            );
            break;
        case 1:
            dispatchMultipleFieldChangeAction(
                "applyparkcommunitycenter",
                getActionDefinationForStepper(
                    "components.div.children.formwizardSecondStep"
                ),
                dispatch
            );
            break;
        case 2:
            dispatchMultipleFieldChangeAction(
                "applyparkcommunitycenter",
                getActionDefinationForStepper(
                    "components.div.children.formwizardThirdStep"
                ),
                dispatch
            );
            break;
        default:
            dispatchMultipleFieldChangeAction(
                "applyparkcommunitycenter",
                getActionDefinationForStepper(
                    "components.div.children.formwizardFourthStep"
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
        {
            path: "components.div.children.formwizardFourthStep",
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
        //alert('Fill all fields')
        isFormValid = false;
        hasFieldToaster = true;
    } else {
        //alert('Submit')
        isFormValid = true;
        hasFieldToaster = false;
    }
    return [isFormValid, hasFieldToaster];
};

// export const validatestepform = (activeStep, isFormValid, hasFieldToaster) => {
//     let allAreFilled = true;

//     document
//         .getElementById("apply_form" + activeStep)
//         .querySelectorAll("[required]")
//         .forEach(function (i) {
//             // console.log(i, "fields");

//             if (!i.value) {
//                 i.focus();
//                 allAreFilled = false;
//                 i.parentNode.classList.add("MuiInput-error-853");
//                 i.parentNode.parentNode.classList.add("MuiFormLabel-error-844");
//             }
//             if (i.getAttribute("aria-invalid") === "true" && allAreFilled) {
//                 i.parentNode.classList.add("MuiInput-error-853");
//                 i.parentNode.parentNode.classList.add("MuiFormLabel-error-844");
//                 allAreFilled = false;
//                 isFormValid = false;
//                 hasFieldToaster = true;
//             }
//         });

//     document
//         .getElementById("apply_form" + activeStep)
//         .querySelectorAll("input[type='hidden']")
//         .forEach(function (i) {
//             if (i.value == i.placeholder) {
//                 i.focus();
//                 allAreFilled = false;
//                 i.parentNode.classList.add("MuiInput-error-853");
//                 i.parentNode.parentNode.parentNode.classList.add(
//                     "MuiFormLabel-error-844"
//                 );
//                 allAreFilled = false;
//                 isFormValid = false;
//                 hasFieldToaster = true;
//             }
//         });
//     //
//     if (allAreFilled == false) {
//         isFormValid = false;
//         hasFieldToaster = true;
//     } else {
//         isFormValid = true;
//         hasFieldToaster = false;
//     }
//     return [isFormValid, hasFieldToaster];
// };
