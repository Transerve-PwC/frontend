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
import jp from "jsonpath";
import get from "lodash/get";
import set from "lodash/set";
import {
    generageBillCollection,
    generateBill,
} from "../utils";
import { applicantSummary } from "./searchResource/applicantSummary";
import { openSpaceSummary } from "./searchResource/openSpaceSummary";
import { estimateSummary } from "./searchResource/estimateSummary";
import { documentsSummary, documentsSummary1 } from "./searchResource/documentsSummary";
import { remarksSummary } from "./searchResource/remarksSummary";
import { footer } from "./searchResource/citizenFooter";
import {
    footerReviewTop,
} from "./searchResource/footer";
import {
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
    }
});

const prepareDocumentsView = async (state, dispatch) => {
    let documentsPreview = [];
    let documentsPreview1 = [];

    // Get all documents from response
    let bookingDocs = get(
        state,
        "screenConfiguration.preparedFinalObject.BookingDocument",
        {}
    );

    console.log(bookingDocs, "Nero Booking Docs");

    if (Object.keys(bookingDocs).length > 0) {
        let keys = Object.keys(bookingDocs);
        let values = Object.values(bookingDocs);
        let id = keys[0],
            fileName = values[0];

        documentsPreview.push({
            title: "BK_DOC_DOC_PICTURE",
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

        let id1 = keys[1],
            fileName1 = values[1];

        documentsPreview1.push({
            title: "BK_BUILDING_PLAN_APPROVAL",
            fileStoreId: id1,
            linkText: "View",
        });
        let fileStoreIds1 = jp.query(documentsPreview1, "$.*.fileStoreId");
        let fileUrls1 =
            fileStoreIds1.length > 0
                ? await getFileUrlFromAPI(fileStoreIds1)
                : {};
        
        documentsPreview1 = documentsPreview1.map(function (doc, index) {

            doc["link"] =
                (fileUrls1 &&
                    fileUrls1[doc.fileStoreId] &&
                    fileUrls1[doc.fileStoreId].split(",")[0]) ||
                "";
            doc["name"] =
                (fileUrls1[doc.fileStoreId] &&
                    decodeURIComponent(
                        fileUrls1[doc.fileStoreId]
                            .split(",")[0]
                            .split("?")[0]
                            .split("/")
                            .pop()
                            .slice(13)
                    )) ||
                //`Document - ${index + 1}`;
                `Document - ${2}`;
            return doc;
        });
        dispatch(prepareFinalObject("approvalDocument", documentsPreview1));

    }
};

const HideshowFooter = (action, bookingStatus) => {
    let showFooter = false;
    if (bookingStatus === "PENDINGPAYMENT") {
        showFooter = true;
    }
    set(
        action,
        "screenConfig.components.div.children.footer.children.submitButton.visible",
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
    if(bookingStatus === "APPROVED"){
        await generageBillCollection(state, dispatch, applicationNumber, tenantId)
    } else {
        await generateBill(state, dispatch, applicationNumber, tenantId, recData[0].businessService);
    }

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
    );

    set(
        action,
        "screenConfig.components.div.children.headerDiv.children.helpSection.children",
        CitizenprintCont
    )
};

const getPaymentGatwayList = async (action, state, dispatch) => {
    try {
      let payload = null;
      payload = await httpRequest(
        "post",
        "/pg-service/gateway/v1/_search",
        "_search",
        [],
        {}
      );
        let payloadprocess = [];
        for (let index = 0; index < payload.length; index++) {
          const element = payload[index];
          let pay = {
            element : element
          }
          payloadprocess.push(pay);
        }

      dispatch(prepareFinalObject("applyScreenMdmsData.payment", payloadprocess));
    } catch (e) {
      console.log(e);
    }
};


const screenConfig = {
    uiFramework: "material-ui",
    name: "booking-search-preview",
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
        getPaymentGatwayList(action, state, dispatch).then(response => {
        });
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
                    applicantSummary : applicantSummary,
                    openSpaceSummary: openSpaceSummary,
                    documentsSummary: documentsSummary,
                    documentsSummary1: documentsSummary1,
                    remarksSummary: remarksSummary,
                }),
                break: getBreak(),
                footer: footer,
            }
        }
    }
};

export default screenConfig;
