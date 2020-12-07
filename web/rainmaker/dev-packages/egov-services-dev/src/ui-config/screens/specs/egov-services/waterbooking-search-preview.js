import {
    getCommonCard,
    getCommonContainer,
    getCommonHeader,
    getBreak,
} from "egov-ui-framework/ui-config/screens/specs/utils";
import {
    handleScreenConfigurationFieldChange as handleField,
    prepareFinalObject,
    toggleSnackbar,
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import {
    localStorageGet,
    localStorageSet,
    setapplicationNumber,
    getapplicationNumber,
} from "egov-ui-kit/utils/localStorageUtils";
import {
    getQueryArg,
    setBusinessServiceDataToLocalStorage,
} from "egov-ui-framework/ui-utils/commons";
import { fetchLocalizationLabel } from "egov-ui-kit/redux/app/actions";
import get from "lodash/get";
import set from "lodash/set";
import { generageBillCollection, generateBill } from "../utils";
import { applicantSummary } from "./searchResource/applicantSummary";
import { waterTankerSummary } from "./searchResource/waterTankerSummary";
import { estimateSummary } from "./searchResource/estimateSummary";
import { driverSummary } from "./searchResource/driverSummary";
import { remarksSummary } from "./searchResource/remarksSummary";
import {
    footerReviewTop,
} from "./searchResource/footer";
import {
    getLocale,
} from "egov-ui-kit/utils/localStorageUtils";
import {
    getSearchResultsView,

} from "../../../../ui-utils/commons";

let bookingStatus = "";
const titlebar = getCommonContainer({
    header: getCommonHeader({
        labelName: "Task Details",
        labelKey: "BK_MY_BK_APPLICATION_DETAILS_HEADER",
    }),
    applicationNumber: {
        uiFramework: "custom-atoms-local",
        moduleName: "egov-services",
        componentPath: "ApplicationNoContainer",
        props: {
            number: getapplicationNumber(), //localStorage.getItem('applicationsellmeatNumber')
        },
    },
});

const setSearchResponse = async (
    state,
    action,
    dispatch,
    applicationNumber,
    tenantId
) => {
    const response = await getSearchResultsView([
        { key: "tenantId", value: tenantId },
        { key: "applicationNumber", value: applicationNumber },
    ]);
    let recData = get(response, "bookingsModelList", []);
    dispatch(
        prepareFinalObject("Booking", recData.length > 0 ? recData[0] : {})
    );

    let bookingCase = get(
        state,
        "screenConfiguration.preparedFinalObject.Booking.bkStatus",
        {}
    );

    bookingStatus = get(
        state,
        "screenConfiguration.preparedFinalObject.Booking.bkApplicationStatus",
        {}
    );
    localStorageSet("bookingStatus", bookingStatus);

    if (bookingCase.includes("Paid")) {
        if (
            bookingStatus === "PENDINGASSIGNMENTDRIVER" ||
            bookingStatus === "PENDINGUPDATE" ||
            bookingStatus === "DELIVERED" ||
            bookingStatus === "NOTDELIVERED"
        ) {
            await generageBillCollection(state, dispatch, applicationNumber, tenantId);
        } else {
            await generateBill(
                state,
                dispatch,
                applicationNumber,
                tenantId,
                recData[0].businessService
            );
        }
    } else {
        dispatch(prepareFinalObject("ReceiptTemp[0].Bill", []));
        set(
            action,
            "screenConfig.components.div.children.body.children.cardContent.children.estimateSummary.visible",
            false
        );
    }

    if (bookingStatus == "PENDINGUPDATE") {
        set(
            action,
            "screenConfig.components.div.children.body.children.cardContent.children.driverSummary.visible",
            bookingStatus == "PENDINGUPDATE" ? true : false
        );
        set(
            action,
            "screenConfig.components.div.children.body.children.cardContent.children.remarksSummary.visible",
            false
        );
    } else if (bookingStatus == "REJECTED") {
        set(
            action,
            "screenConfig.components.div.children.body.children.cardContent.children.driverSummary.visible",
            false
        );
        set(
            action,
            "screenConfig.components.div.children.body.children.cardContent.children.remarksSummary.visible",
            true
        );
    } else {
        set(
            action,
            "screenConfig.components.div.children.body.children.cardContent.children.driverSummary.visible",
            false
        );
        set(
            action,
            "screenConfig.components.div.children.body.children.cardContent.children.remarksSummary.visible",
            false
        );
    }


    const CitizenprintCont = footerReviewTop(
        action,
        state,
        dispatch,
        bookingStatus,
        applicationNumber,
        tenantId,
        bookingCase
    );

    set(
        action,
        "screenConfig.components.div.children.headerDiv.children.helpSection.children",
        CitizenprintCont
    );
};


const screenConfig = {
    uiFramework: "material-ui",
    name: "waterbooking-search-preview",
    beforeInitScreen: (action, state, dispatch) => {
        const applicationNumber = getQueryArg(
            window.location.href,
            "applicationNumber"
        );
        setapplicationNumber(applicationNumber);
        const tenantId = getQueryArg(window.location.href, "tenantId");
        setSearchResponse(state, action, dispatch, applicationNumber, tenantId);
        dispatch(fetchLocalizationLabel(getLocale(), tenantId, tenantId));

        const queryObject = [
            { key: "tenantId", value: tenantId },
            { key: "businessServices", value: "OSBM" },
        ];
        setBusinessServiceDataToLocalStorage(queryObject, dispatch);

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
                                sm: 8,
                            },
                            ...titlebar,
                        },
                        helpSection: {
                            uiFramework: "custom-atoms",
                            componentPath: "Container",
                            props: {
                                color: "primary",
                                style: { justifyContent: "flex-end" },
                            },
                            gridDefination: {
                                xs: 12,
                                sm: 4,
                                align: "right",
                            },
                        },
                    },
                },
                taskStatus: {
                  uiFramework: "custom-containers-local",
                  componentPath: "WorkFlowContainer",
                  moduleName: "egov-services",
                  visible: true,
                },

                body: getCommonCard({
                    estimateSummary: estimateSummary,
                //  applicantSummary: applicantSummary,
                    waterTankerSummary: waterTankerSummary,
                    driverSummary: driverSummary,
                    remarksSummary: remarksSummary,
                }),
                break: getBreak()
            },
        },
    },
};

export default screenConfig;
