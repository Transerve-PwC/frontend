import {
    getCommonCard,
    getCommonContainer,
    getCommonHeader,
    getBreak,
    getCommonGrayCard
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
import {
    generageBillCollection,
    generateBill,
    getRefundDetails
} from "../utils";
import { pccSummary } from "./refundResource/pccSummary";

import {
    getRefundEstimateSummary
} from "./refundResource/estimateSummary";
import { footerForSecFeeRefundParkAndCC } from "./refundResource/citizenFooter";
import {
    footerReviewTop,
} from "./searchResource/footer";
import {
    getLocale,
    getUserInfo,
} from "egov-ui-kit/utils/localStorageUtils";
import {
    getSearchResultsView
} from "../../../../ui-utils/commons";
import { httpRequest } from "../../../../ui-utils";

let role_name = JSON.parse(getUserInfo()).roles[0].code;
let bookingStatus = "";

const titlebar = getCommonContainer({
    header: getCommonHeader({
        labelName: "Application Details",
        labelKey: "BK_MY_BK_APPLICATION_DETAILS_HEADER",
    }),
    applicationNumber: {
        uiFramework: "custom-atoms-local",
        moduleName: "egov-services",
        componentPath: "ApplicationNoContainer",
        props: {
            number: getapplicationNumber(), //localStorage.getItem('applicationsellmeatNumber')
        },
    }
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

const HideshowFooter = (action, bookingStatus) => {
    // Hide edit Footer
    // console.log("actionnew", action);
    let showFooter = false;
    if (bookingStatus === "APPLIED") {
        showFooter = true;
    }
    set(
        action,
        "screenConfig.components.div.children.footer.children.securityFeeButton.visible",
        role_name === "CITIZEN" ? (showFooter === true ? true : false) : false
    );
    set(
        action,
        "screenConfig.components.div.children.footer.children.editButton.visible",
        role_name === "CITIZEN" ? (showFooter === true ? true : false) : false
    );
};

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
    dispatch(
        prepareFinalObject("BookingDocument", get(response, "documentMap", {}))
    );

    bookingStatus = get(
        state,
        "screenConfiguration.preparedFinalObject.Booking.bkApplicationStatus",
        {}
    );
    if (bookingStatus === "APPLIED") {
        await generageBillCollection(state, dispatch, applicationNumber, tenantId)
    } else {
        await generateBill(state, dispatch, applicationNumber, tenantId, recData[0].businessService);
    }

    const refundDetailsResp = await getRefundDetails(applicationNumber, tenantId);

    dispatch(
        prepareFinalObject("refundData", refundDetailsResp.data[0])
    );

    localStorageSet("bookingStatus", bookingStatus);
    HideshowFooter(action, bookingStatus);

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
    )
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

        dispatch(prepareFinalObject("cancelParkCcScreenMdmsData", payload.MdmsRes));
    } catch (e) {
        console.log(e);
    }
};

const screenConfig = {
    uiFramework: "material-ui",
    name: "refundsecfeeparkccbooking",
    beforeInitScreen: (action, state, dispatch) => {
        const applicationNumber = getQueryArg(
            window.location.href,
            "applicationNumber"
        );
        const tenantId = getQueryArg(
            window.location.href,
            "tenantId"
        );
        const businessService = getQueryArg(
            window.location.href,
            "businessService"
        );
        setapplicationNumber(applicationNumber);
        setSearchResponse(state, action, dispatch, applicationNumber, tenantId);
        // getPaymentGatwayList(action, state, dispatch).then(response => {
        // });
        // Set MDMS Data
        getMdmsData(action, state, dispatch).then((response) => {

        });
        const queryObject = [
            { key: "tenantId", value: tenantId },
            { key: "businessServices", value: "PACC" },
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

                    },
                },

                body: getCommonCard({
                    estimateSummary: getRefundEstimateSummary,
                    pccSummary: pccSummary

                }),
                footer: footerForSecFeeRefundParkAndCC


            }
        }
    }
};

export default screenConfig;
