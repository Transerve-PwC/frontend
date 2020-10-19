import {
    getCommonContainer,
    getCommonHeader,
    getStepperObject,
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { getCurrentFinancialYear, clearlocalstorageAppDetails } from "../utils";
import { footer } from "./applyResourceWaterTanker/footer";
import {
    personalDetails,
    bookingDetails,
} from "./applyResourceWaterTanker/nocDetails";
import { summaryDetails } from "./applyResourceWaterTanker/summaryDetails";
import {
    getQueryArg,
} from "egov-ui-framework/ui-utils/commons";

import {
    prepareFinalObject,
    handleScreenConfigurationFieldChange as handleField,
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import {
    getTenantId,
    getUserInfo,
    setapplicationType,
    setapplicationNumber,
} from "egov-ui-kit/utils/localStorageUtils";
import { httpRequest } from "../../../../ui-utils";
import jp from "jsonpath";
import set from "lodash/set";
import get from "lodash/get";
import {
    prepareDocumentsUploadDataForSellMeat,
    prepareDocumentsUploadData,
    getSearchResultsView,
    furnishSellMeatNocResponse,
    setApplicationNumberBox,
} from "../../../../ui-utils/commons";

export const stepsData = [
    { labelName: "Applicant Details", labelKey: "BK_WTB_APPLICANT_DETAILS" },
    { labelName: "Booking Details", labelKey: "BK_WTB_BOOKING_DETAILS" },
    { labelName: "Summary", labelKey: "BK_WTB_SUMMARY" },
];
export const stepper = getStepperObject(
    { props: { activeStep: 0 } },
    stepsData
);

export const header = getCommonContainer({
    header: getCommonHeader({
        labelName: `Apply New Booking `, //later use getFinancialYearDates
        labelKey: "BK_WTB_APPLY",
    }),
    //applicationNumber: applicationNumberContainer()
    applicationNumber: {
        uiFramework: "custom-atoms-local",
        moduleName: "egov-services",
        componentPath: "ApplicationNoContainer",
        props: {
            number: "NA",
        },
        visible: false,
    },
});

export const formwizardFirstStep = {
    uiFramework: "custom-atoms",
    componentPath: "Form",
    props: {
        id: "apply_form1",
    },
    children: {
        personalDetails,
    },
};

export const formwizardSecondStep = {
    uiFramework: "custom-atoms",
    componentPath: "Form",
    props: {
        id: "apply_form2",
    },
    children: {
        bookingDetails,
    },
    visible: false,
};

export const formwizardThirdStep = {
    // This is for step 4
    uiFramework: "custom-atoms",
    componentPath: "Form",
    props: {
        id: "apply_form3",
    },
    children: {
        summaryDetails,
    },
    visible: false,
};

const getMdmsData = async (action, state, dispatch) => {
    let tenantId = getTenantId().split(".")[0];
    let mdmsBody = {
        MdmsCriteria: {
            tenantId: tenantId,
            moduleDetails: [
                {
                    moduleName: "tenant",
                    masterDetails: [
                        {
                            name: "tenants",
                        },
                    ],
                },
                {
                    moduleName: "Booking",
                    masterDetails: [
                        {
                            name: "Sector",
                        },
                        {
                            name: "CityType",
                        },
                        {
                            name: "PropertyType",
                        },
                        {
                            name: "Area",
                        },
                        {
                            name: "Duration",
                        },
                        {
                            name: "Category",
                        },
                        {
                            name: "TypesofRequest",
                        },
                    ],
                },
            ],
        },
    };
    try {
        let payload = null;
        payload = await httpRequest(
            "post",
            "/egov-mdms-service/v1/_search",
            "_search",
            [],
            mdmsBody
        );
        payload.MdmsRes.Booking.bookingType = [
            {
                id: 1,
                code: "Normal",
                tenantId: "ch.chandigarh",
                name: "Normal",
                active: true,
            },
            {
                id: 2,
                code: "Paid",
                tenantId: "ch.chandigarh",
                name: "Paid",
                active: true,
            },
        ];
        dispatch(prepareFinalObject("applyScreenMdmsData", payload.MdmsRes));
    } catch (e) {
        console.log(e);
    }
};

export const prepareEditFlow = async (
    action,
    state,
    dispatch,
    applicationNumber,
    tenantId
) => {
    if (applicationNumber) {
        let response = await getSearchResultsView([
            { key: "tenantId", value: tenantId },
            { key: "applicationNumber", value: applicationNumber },
        ]);
        setapplicationNumber(applicationNumber);
        setApplicationNumberBox(state, dispatch, applicationNumber);
        dispatch(prepareFinalObject("Booking", response.bookingsModelList[0]));
        // console.log("Nero G");
        // set(
        //     action.screenConfig,
        //     "components.div.children.formwizardThirdStep.children.summaryDetails.children.cardContent.children.div.children.waterTankerSummary.children.cardContent.children.cardOne.props.scheama.children.cardContent.children.applicantContainer.children.BookingDate.visible",
        //     response.bookingsModelList[0].bkStatus != "Request due to water supply failure" ? true : false
        // );
        // set(
        //     action.screenConfig,
        //     "components.div.children.formwizardThirdStep.children.summaryDetails.children.cardContent.children.div.children.waterTankerSummary.children.cardContent.children.cardOne.props.scheama.children.cardContent.children.applicantContainer.children.BookingTime.visible",
        //     response.bookingsModelList[0].bkStatus != "Request due to water supply failure" ? true : false
        // );


    }
};

const screenConfig = {
    uiFramework: "material-ui",
    name: "applywatertanker",
    beforeInitScreen: (action, state, dispatch) => {
        clearlocalstorageAppDetails(state);
        setapplicationType("BWT");
        const applicationNumber = getQueryArg(
            window.location.href,
            "applicationNumber"
        );
        const tenantId = getQueryArg(window.location.href, "tenantId");
        const step = getQueryArg(window.location.href, "step");
        //Set Module Name
        set(state, "screenConfiguration.moduleName", "services");

        // Set MDMS Data
        getMdmsData(action, state, dispatch);


        dispatch(
            prepareFinalObject(
                "Booking.bkApplicantName",
                JSON.parse(getUserInfo()).name
            )
        ),
            // dispatch(prepareFinalObject("Booking.bkEmail", "HELLO@GMAIL.COM"));
            dispatch(
                prepareFinalObject(
                    "Booking.bkMobileNumber",
                    JSON.parse(getUserInfo()).mobileNumber
                )
            );

        // dispatch(prepareFinalObject("Booking.bkHouseNo", "2"));
        // dispatch(prepareFinalObject("Booking.bkCompleteAddress", "hello address"));
        // dispatch(prepareFinalObject("Booking.bkSector", "SECTOR-1"));
        // dispatch(prepareFinalObject("Booking.bkType", "Residential"));
        // dispatch(prepareFinalObject("Booking.bkStatus", "Normal"));


        if (applicationNumber !== null) {
            set(
                action.screenConfig,
                "components.div.children.headerDiv.children.header.children.applicationNumber.visible",
                true
            );
            prepareEditFlow(action, state, dispatch, applicationNumber, tenantId);

        }

        // Code to goto a specific step through URL
        if (step && step.match(/^\d+$/)) {
            let intStep = parseInt(step);
            set(
                action.screenConfig,
                "components.div.children.stepper.props.activeStep",
                intStep
            );
            let formWizardNames = [
                "formwizardFirstStep",
                "formwizardSecondStep",

                "formwizardThirdStep",
            ];
            for (let i = 0; i < 2; i++) {
                set(
                    action.screenConfig,
                    `components.div.children.${formWizardNames[i]}.visible`,
                    i == step
                );
                set(
                    action.screenConfig,
                    `components.div.children.footer.children.previousButton.visible`,
                    step != 0
                );
            }
        }

        return action;
    },
    components: {
        div: {
            uiFramework: "custom-atoms",
            componentPath: "Div",
            props: {
                className: "common-div-css",
            },
            children: {
                headerDiv: {
                    uiFramework: "custom-atoms",
                    componentPath: "Container",
                    children: {
                        header: {
                            gridDefination: {
                                xs: 12,
                                sm: 10,
                            },
                            ...header,
                        },
                    },
                },
                stepper,
                formwizardFirstStep,
                formwizardSecondStep,
                formwizardThirdStep,
                footer,
            },
        },
    },
};

export default screenConfig;
