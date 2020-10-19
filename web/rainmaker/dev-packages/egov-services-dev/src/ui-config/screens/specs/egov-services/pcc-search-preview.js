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
    getFileUrlFromAPI,
    getQueryArg,
    setBusinessServiceDataToLocalStorage,
} from "egov-ui-framework/ui-utils/commons";
import { fetchLocalizationLabel } from "egov-ui-kit/redux/app/actions";
import jp from "jsonpath";
import get from "lodash/get";
import set from "lodash/set";
import { generageBillCollection, generateBill, clearlocalstorageAppDetails } from "../utils";
import { pccSummary } from "./summaryResource/pccSummary";
import { pccApplicantSummary } from "./summaryResource/pccApplicantSummary";
import { documentsSummary } from "./summaryResource/documentsSummary";
import { estimateSummary } from "./summaryResource/estimateSummary";
import { remarksSummary } from "./searchResource/remarksSummary";
import { footerForParkAndCC } from "./searchResource/citizenFooter";
import { footerReviewTop } from "./searchResource/footer";
import { getLocale, getUserInfo } from "egov-ui-kit/utils/localStorageUtils";
import { getSearchResultsView } from "../../../../ui-utils/commons";
import { httpRequest } from "../../../../ui-utils";

let role_name = JSON.parse(getUserInfo()).roles[0].code;
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

const prepareDocumentsView = async (state, dispatch) => {
    let documentsPreview = [];

    // Get all documents from response
    let bookingDocs = get(
        state,
        "screenConfiguration.preparedFinalObject.BookingDocument",
        {}
    );

    if (Object.keys(bookingDocs).length > 0) {
        let keys = Object.keys(bookingDocs);
        let values = Object.values(bookingDocs);
        let id = keys[0],
            fileName = values[0];

        documentsPreview.push({
            title: "BK_PCC_DOCUMENT",
            fileStoreId: id,
            linkText: "View",
        });
        let fileStoreIds = jp.query(documentsPreview, "$.*.fileStoreId");
        let fileUrls =
            fileStoreIds.length > 0
                ? await getFileUrlFromAPI(fileStoreIds)
                : {};
        documentsPreview = documentsPreview.map(function (doc, index) {
            doc["link"] =
                (fileUrls &&
                    fileUrls[doc.fileStoreId] &&
                    fileUrls[doc.fileStoreId].split(",")[0]) ||
                "";
            doc["name"] =
                (fileUrls[doc.fileStoreId] &&
                    decodeURIComponent(
                        fileUrls[doc.fileStoreId]
                            .split(",")[0]
                            .split("?")[0]
                            .split("/")
                            .pop()
                            .slice(13)
                    )) ||
                `Document - ${index + 1}`;
            return doc;
        });
        dispatch(prepareFinalObject("documentsPreview", documentsPreview));
    }
};

const HideshowFooter = (action, bookingStatus, fromDate) => {
    let bookingTimeStamp = new Date(fromDate).getTime();
    let currentTimeStamp = new Date().getTime();
    let showFooter = false;
    if (bookingStatus === "APPLIED") {
        showFooter = true;
    }
    set(
        action,
        "screenConfig.components.div.children.footer.children.cancelButton.visible",
        showFooter === true ? true : false
    );
    set(
        action,
        "screenConfig.components.div.children.footer.children.editButton.visible",
        showFooter === true ? true : false
    );
};

const setSearchResponse = async (
    state,
    action,
    dispatch,
    applicationNumber,
    tenantId,
    businessService
) => {
    const response = await getSearchResultsView([
        { key: "tenantId", value: tenantId },
        { key: "applicationNumber", value: applicationNumber },
    ]);
    let recData = get(response, "bookingsModelList", []);
    if (recData.length > 0) {
        if (recData[0].timeslots && recData[0].timeslots.length > 0) {
            var [fromTime, toTime] = recData[0].timeslots[0].slot.split("-");

            let DisplayPaccObject = {
                bkDisplayFromDateTime: recData[0].bkFromDate + "#" + fromTime,
                bkDisplayToDateTime: recData[0].bkToDate + "#" + toTime,
            };

            dispatch(
                prepareFinalObject("DisplayTimeSlotData", DisplayPaccObject)
            );
        }
        set(
            action.screenConfig,
            "components.div.children.body.children.cardContent.children.pccSummary.children.cardContent.children.cardOne.props.scheama.children.cardContent.children.applicationContainer.children.FromDate.visible",
            recData[0].bkDuration === "FULLDAY" ? true : false
        );

        set(
            action.screenConfig,
            "components.div.children.body.children.cardContent.children.pccSummary.children.cardContent.children.cardOne.props.scheama.children.cardContent.children.applicationContainer.children.ToDate.visible",
            recData[0].bkDuration === "FULLDAY" ? true : false
        );
        set(
            action.screenConfig,
            "components.div.children.body.children.cardContent.children.pccSummary.children.cardContent.children.cardOne.props.scheama.children.cardContent.children.applicationContainer.children.bkDisplayFromTime.visible",
            recData[0].bkDuration === "HOURLY" ? true : false
        );

        set(
            action.screenConfig,
            "components.div.children.body.children.cardContent.children.pccSummary.children.cardContent.children.cardOne.props.scheama.children.cardContent.children.applicationContainer.children.bkDisplayToTime.visible",
            recData[0].bkDuration === "HOURLY" ? true : false
        );
        dispatch(
            prepareFinalObject("Booking", recData.length > 0 ? recData[0] : {})
        );
        dispatch(
            prepareFinalObject(
                "BookingDocument",
                get(response, "documentMap", {})
            )
        );

        bookingStatus = recData[0].bkApplicationStatus;
        if (bookingStatus === "APPLIED") {
            await generageBillCollection(
                state,
                dispatch,
                applicationNumber,
                tenantId
            );
        } else {
            await generateBill(
                state,
                dispatch,
                applicationNumber,
                tenantId,
                businessService
            );
        }

        localStorageSet("bookingStatus", bookingStatus);
        // // recData[0].bkFromDate = "2020-06-06";
        // let bookingTimeStamp = new Date(recData[0].bkFromDate).getTime();
        // let currentTimeStamp = new Date().getTime();
        // if (currentTimeStamp < bookingTimeStamp) {
        HideshowFooter(action, bookingStatus, recData[0].bkFromDat);
        // }

        prepareDocumentsView(state, dispatch);

        const CitizenprintCont = footerReviewTop(
            action,
            state,
            dispatch,
            bookingStatus,
            applicationNumber,
            tenantId,
            ""
        );

        set(
            action,
            "screenConfig.components.div.children.headerDiv.children.helpSection.children",
            CitizenprintCont
        );
    }
};

// const getPaymentGatwayList = async (action, state, dispatch) => {
//     try {
//         let payload = null;
//         payload = await httpRequest(
//             "post",
//             "/pg-service/gateway/v1/_search",
//             "_search",
//             [],
//             {}
//         );
//         let payloadprocess = [];
//         for (let index = 0; index < payload.length; index++) {
//             const element = payload[index];
//             let pay = {
//                 element: element
//             }
//             payloadprocess.push(pay);
//         }

//         dispatch(prepareFinalObject("applyScreenMdmsData.payment", payloadprocess));
//     } catch (e) {
//         console.log(e);
//     }
// };

const screenConfig = {
    uiFramework: "material-ui",
    name: "pcc-search-preview",
    beforeInitScreen: (action, state, dispatch) => {
        clearlocalstorageAppDetails(state);
        const applicationNumber = getQueryArg(
            window.location.href,
            "applicationNumber"
        );
        const tenantId = getQueryArg(window.location.href, "tenantId");
        const businessService = getQueryArg(
            window.location.href,
            "businessService"
        );
        setapplicationNumber(applicationNumber);
        setSearchResponse(
            state,
            action,
            dispatch,
            applicationNumber,
            tenantId,
            businessService
        );
        // getPaymentGatwayList(action, state, dispatch).then(response => {
        // });
        const queryObject = [
            { key: "tenantId", value: tenantId },
            { key: "businessServices", value: "PACC" },
        ];
        setBusinessServiceDataToLocalStorage(queryObject, dispatch);
        //        state.screenConfiguration.screenConfig["pcc-search-preview"].components.div.children.footer.children.cancelButton

        // set(
        //     state.screenConfiguration.screenConfig,
        //     `pcc-search-preview.components.div.children.footer.children.cancelButton.visible`,
        //     false
        // );

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
                    pccApplicantSummary: pccApplicantSummary,
                    pccSummary: pccSummary,
                    documentsSummary: documentsSummary,
                    // remarksSummary: remarksSummary,
                }),
                // break: getBreak(),
                footer: footerForParkAndCC,
            },
        },
    },
};

export default screenConfig;
