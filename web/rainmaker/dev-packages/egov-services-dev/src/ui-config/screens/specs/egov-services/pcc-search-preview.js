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

    getTenantId,
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

const HideshowFooter = (action, bookingStatus, fromDate, bookingObj, state) => {
    const { screenConfiguration } = state;
    let bookingTimeStamp = new Date(fromDate).getTime();
    let currentTimeStamp = new Date().getTime();
    let showFooter = false;
    if (bookingObj.timeslots.length > 0) {
        let [fromTime] = bookingObj.timeslots[0].slot.split("-");
        if (fromTime == "10AM") {
            bookingTimeStamp = new Date(`${fromDate}T10:00:00`).getTime();
        } else if (fromTime == "2PM") {
            bookingTimeStamp = new Date(`${fromDate}T14:00:00`).getTime();
        } else if (fromTime == "6PM") {
            bookingTimeStamp = new Date(`${fromDate}T18:00:00`).getTime();
        }
    }
    if (bookingStatus === "APPLIED") {
        showFooter = true;
    }



    var billAccountDetails = get(
        screenConfiguration,
        "preparedFinalObject.ReceiptTemp[0].Bill[0].billDetails[0].billAccountDetails",
        []
    );


    let bookingAmount = 0;
    let refundSecAmount = 0;
    for (let i = 0; i < billAccountDetails.length; i++) {
        if (billAccountDetails[i].taxHeadCode == "REFUNDABLE_SECURITY") {
            bookingAmount += billAccountDetails[i].amount;
            refundSecAmount += billAccountDetails[i].amount;
        }
        if (billAccountDetails[i].taxHeadCode == "PACC") {
            bookingAmount += billAccountDetails[i].amount;
        }
    }

    var date1 = new Date(fromDate);
    var date2 = new Date();

    var Difference_In_Time = date1.getTime() - date2.getTime();

    const refundPercent = get(
        screenConfiguration,
        "preparedFinalObject.cancelParkCcScreenMdmsData.Booking.bookingCancellationRefundCalc[0].MORETHAN30DAYS.refundpercentage",
        []
    );

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
console.log(bookingTimeStamp +"========="+ currentTimeStamp+"====="+refundAmount);

    if ((bookingTimeStamp > currentTimeStamp) && (refundAmount > 0)) {
        set(
            action,
            "screenConfig.components.div.children.footer.children.cancelButton.visible",
            showFooter === true ? true : false
        );

    }

    if (bookingTimeStamp > currentTimeStamp) {

        set(
            action,
            "screenConfig.components.div.children.footer.children.editButton.visible",
            showFooter === true ? true : false
        );
    }

    if ((bookingTimeStamp < currentTimeStamp) && refundSecAmount > 0) {

        set(
            action,
            "screenConfig.components.div.children.footer.children.refundSecurityFeeButton.visible",
            showFooter === true ? true : false
        );
    }

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
        console.log(recData[0], "Booking");
        if (bookingStatus === "APPLIED" || bookingStatus === "MODIFIED") {
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
        HideshowFooter(action, bookingStatus, recData[0].bkFromDate, recData[0], state);
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

const getMdmsData = async (action, state, dispatch) => {
    let tenantId = getTenantId().split(".")[0];
    let mdmsBody = {
        MdmsCriteria: {
            tenantId: tenantId,
            moduleDetails: [

                {
                    moduleName: "Booking",
                    masterDetails: [
                        {
                            name: "bookingCancellationRefundCalc",
                        }
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

        // let bookingCancellationRefundCalc = {
        //     "MORETHAN30DAYS": {
        //         "refundpercentage": 50
        //     },
        //     "LETTHAN30MORETHAN15DAYS": {
        //         "refundpercentage": 25
        //     },
        //     "LESSTHAN15DAYS": {
        //         "refundpercentage": 0
        //     },
        // }
        // payload.MdmsRes.bookingCancellationRefundCalc = bookingCancellationRefundCalc;
        dispatch(prepareFinalObject("cancelParkCcScreenMdmsData", payload.MdmsRes));
    } catch (e) {
        console.log(e);
    }
};

const screenConfig = {
    uiFramework: "material-ui",
    name: "pcc-search-preview",
    beforeInitScreen: (action, state, dispatch) => {
        clearlocalstorageAppDetails(state);
        const applicationNumber = getQueryArg(
            window.location.href,
            "applicationNumber"
        );
        getMdmsData(action, state, dispatch).then((response) => {
            console.log("Calling MDMS");
        });
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
