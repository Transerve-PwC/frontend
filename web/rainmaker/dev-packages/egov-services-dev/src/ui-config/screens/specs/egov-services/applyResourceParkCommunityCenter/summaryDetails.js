import {
    getBreak,
    getCommonContainer,
    getCommonCard,
    getCommonHeader,
    getCommonTitle,
    getCommonSubHeader,
    getLabel,
    dispatchMultipleFieldChangeAction,
    getCommonGrayCard
} from "egov-ui-framework/ui-config/screens/specs/utils";
import get from "lodash/get";
import { pccSummary, changedVenueDatepccSummary } from "../summaryResource/pccSummary";
import { pccApplicantSummary } from "../summaryResource/pccApplicantSummary";
import { documentsSummary } from "../summaryResource/documentsSummary";
import { estimateSummary } from "../summaryResource/estimateSummary";

export const callBackForPrevious = (state, dispatch) => {
    changeStep(state, dispatch, "previous");
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
        activeStep = mode === "next" ? activeStep + 1 : 0;
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

export const confirmationStatement = getCommonGrayCard({

    header: getCommonHeader({
        labelName: "Recalculated fee is zero. No payment required. just submit your booking.",
        labelKey: "Recalculated fee is zero. No payment required. just submit your booking.",
        props: {
            visible: false
        }

    })


})
export const summaryDetails = getCommonCard({
    header: {
        uiFramework: "custom-atoms",
        componentPath: "Container",
        props: {
            // style: { marginBottom: "10px" },
        },
        children: {
            header: {
                gridDefination: {
                    xs: 8,
                },
                // ...getCommonSubHeader({
                //   labelName: "Summary",
                //   labelKey: "BK_OSB_HEADER_STEP_4"
                // })
            },
            editSection: {
                componentPath: "Button",
                props: {
                    color: "primary",
                    style: {
                        marginTop: "-10px",
                        marginRight: "-18px",
                    },
                },
                gridDefination: {
                    xs: 4,
                    align: "right",
                },
                children: {
                    editIcon: {
                        uiFramework: "custom-atoms",
                        componentPath: "Icon",
                        props: {
                            iconName: "edit",
                        },
                    },
                    buttonLabel: getLabel({
                        labelName: "Edit",
                        labelKey: "BK_SUMMARY_EDIT",
                    }),
                },
                onClickDefination: {
                    action: "condition",
                    callBack: callBackForPrevious,
                    // callBack: (state, dispatch) => {
                    //   gotoApplyWithStep(state, dispatch, 0);
                    // }
                },
            },
        },
    },
   // confirmationStatement: confirmationStatement,
    estimateSummary: estimateSummary,
    pccApplicantSummary: pccApplicantSummary,
    pccSummary: pccSummary,
  //  changedVenueDatepccSummary: changedVenueDatepccSummary,
    documentsSummary: documentsSummary
});
