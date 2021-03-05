import {
    getCommonContainer,
    getCommonHeader,
    getLabel,
} from "egov-ui-framework/ui-config/screens/specs/utils";
import {
    getCurrentFinancialYear,
    clearlocalstorageAppDetails,
    convertDateInYMD,
} from "../utils";
import {
    availabilityForm,
    availabilityCalendar,
} from "./checkAvailabilityForm_oswmcc";
import { ImageLocationSummary } from "./summaryResource/imagesOfNewLocationOswmcc";
import { perDayRateSummary } from "./summaryResource/perDayRateSummaryBookingOSWMCC";
import { showHideAdhocPopup } from "../utils";
import {
    setapplicationNumber,
    lSRemoveItemlocal,
    getTenantId,
} from "egov-ui-kit/utils/localStorageUtils";
import { dispatchMultipleFieldChangeAction } from "egov-ui-framework/ui-config/screens/specs/utils";
import {
    prepareFinalObject,
    handleScreenConfigurationFieldChange as handleField,
    toggleSnackbar,
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import {
    getFileUrlFromAPI,
    getQueryArg,
} from "egov-ui-framework/ui-utils/commons";
import {
    getSearchResultsView,
    setApplicationNumberBox,
} from "../../../../ui-utils/commons";
import { getAvailabilityDataOSWMCC, getBetweenDays } from "../utils";
import { httpRequest } from "../../../../ui-utils";
import get from "lodash/get";
import set from "lodash/set";

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
                    ],
                },
            ],
        },
    };
    try {
        let payload = await httpRequest(
            "post",
            "/egov-mdms-service/v1/_search",
            "_search",
            [],
            mdmsBody
        );
        dispatch(
            prepareFinalObject("applyScreenMdmsData", payload.MdmsRes)
        );
    } catch (e) {
        console.log(e);
    }
};

const getVenueData = async (action, state, dispatch) => {
    try {
        let payload = await httpRequest(
            "post",
            "/bookings/newLocation/citizen/osujm/_all"
        );
        return payload
    } catch (e) {
        console.log(e);
    }
};

const getData = async (action, state, dispatch) => {
    try {
        let response = await getVenueData(action, state, dispatch);
        dispatch(
            prepareFinalObject(
                "sectorWiselocationsObject",
                response.osujmNewlocationMap
            )
        );
        return response    
    } catch (error) {
        console.log(error, "my error")
    }
    
  };

const setDataAutofill = (action, state, dispatch) => {
    // console.log("in set data autofill")
    let sectorWiselocationsObject = get(
        state,
        "screenConfiguration.preparedFinalObject.sectorWiselocationsObject"
    );
    // let bkSector = get(
    //     state,
    //     "screenConfiguration.preparedFinalObject.applyScreenMdmsData.Booking.bkSector"
    // );
    // console.log(sectorWiselocationsObject, "sectorWiselocationsObject out");
    if (sectorWiselocationsObject !== undefined) {
        let bkSector = get(
            state,
            "screenConfiguration.preparedFinalObject.availabilityCheckData.bkSector"
        );
        let bkBookingVenue = get(
            state,
            "screenConfiguration.preparedFinalObject.availabilityCheckData.bkBookingVenue"
        );
        let venueList = get(sectorWiselocationsObject, bkSector);

        // console.log(sectorWiselocationsObject, "sectorWiselocationsObject");
        // console.log(bkSector, "bkSector");
        // console.log(venueList, "venueList");
        venueList !== undefined &&
            dispatch(
                prepareFinalObject(
                    "venueList",
                    venueList
                )
            );
        

        dispatch(
            handleField(
                "checkavailability_oswmcc",
                "components.div.children.availabilitySearch.children.availabilityForm.children.cardContent.children.availabilityFields.children.bkBookingVenue",
                "props.disabled",
                bkSector  !== undefined || bkSector !== "" ? true : false
            )
        );

        if (bkBookingVenue !== undefined) {
            dispatch(
                handleField(
                    "checkavailability_oswmcc",
                    "components.div.children.availabilitySearch.children.availabilityForm.children.cardContent.children.availabilityFields.children.bkBookingVenue",
                    "props.value",
                    bkBookingVenue
                )
            );
        }
    }
};

const prepareEditFlow = async (
    action,
    state,
    dispatch,
    applicationNumber,
    tenantId
) => {
    // console.log("in edit flow")
    if (applicationNumber) {
        // console.log("application number present")
        setapplicationNumber(applicationNumber);
        setApplicationNumberBox(state, dispatch, applicationNumber);

        let response = await getSearchResultsView([
            { key: "tenantId", value: tenantId },
            { key: "applicationNumber", value: applicationNumber },
        ]);
        let bookingsModelList = get(response, "bookingsModelList", []);

        if (bookingsModelList  !== null && bookingsModelList.length > 0) {
            dispatch(
                prepareFinalObject("Booking", bookingsModelList[0])
            );
            dispatch(
                prepareFinalObject(
                    "availabilityCheckData",
                    bookingsModelList[0]
                )
            );

            set(
                action.screenConfig,
                "components.div.children.headerDiv.children.header.children.applicationNumber.visible",
                true
            );

            setDataAutofill(action, state, dispatch);

            let availabilityData = await getAvailabilityDataOSWMCC(
                bookingsModelList[0].bkSector,
                bookingsModelList[0].bkBookingVenue
            );

            if (availabilityData !== undefined) {
                let data = availabilityData.data;
                let reservedDates = [];
                var daylist = [];
                data.map((dataitem) => {
                    let start = dataitem.fromDate;
                    let end = dataitem.toDate;
                    daylist = getBetweenDays(start, end);
                    daylist.map((v) => {
                        reservedDates.push(v.toISOString().slice(0, 10));
                    });
                });
                dispatch(
                    prepareFinalObject(
                        "availabilityCheckData.reservedDays",
                        reservedDates
                    )
                );
            } else {
                dispatch(
                    toggleSnackbar(
                        true,
                        {
                            labelName: "Please try after sometime!",
                            labelKey: "",
                        },
                        "warning"
                    )
                );
            }

            let fileStoreIds = Object.keys(response.documentMap);
            let fileStoreIdsValue = Object.values(response.documentMap);
            if (fileStoreIds.length > 0) {
                let fileUrls =
                    fileStoreIds.length > 0
                        ? await getFileUrlFromAPI(fileStoreIds)
                        : {};
                dispatch(
                    prepareFinalObject("documentsUploadReduxOld.documents", [
                        {
                            fileName: fileStoreIdsValue[0],
                            fileStoreId: fileStoreIds[0],
                            fileUrl: fileUrls[fileStoreIds[0]],
                        },
                    ])
                );
            }
        } else {
            dispatch(
                toggleSnackbar(
                    true,
                    {
                        labelName: "Something went Wrong!",
                        labelKey: "",
                    },
                    "error"
                )
            );
        }
    } else {
        // console.log("in edit flow not application number")
        setDataAutofill(action, state, dispatch);
    }
};
const header = getCommonContainer({
    header: getCommonHeader({
        labelName: `Apply for Open Space within MCC jurisdiction`,
        labelKey: "BK_OSWMCC_APPLY",
    }),
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

const availabilitySearch = {
    uiFramework: "custom-atoms",
    componentPath: "Form",
    props: {
        id: "apply_form1",
    },
    children: {
        availabilityForm,
    },
};

const screenConfig = {
    uiFramework: "material-ui",
    name: "checkavailability_oswmcc",
    beforeInitScreen: (action, state, dispatch) => {
        const applicationNumber = getQueryArg(
            window.location.href,
            "applicationNumber"
        );
        const tenantId = getQueryArg(window.location.href, "tenantId");
        getMdmsData(action, state, dispatch);
        getData(action, state, dispatch).then(response => {
            // console.log(response, "my new response")
            if(response){
                // console.log("if response true")
                // console.log("call prepare edit flow")
                prepareEditFlow(action, state, dispatch, applicationNumber, tenantId);
            }
        })
        // if (applicationNumber !== null) {

        

       
        // } else {
        //     setDataAutofill(action, state, dispatch);
        // }
        return action;
    },
    components: {
        div: {
            uiFramework: "custom-atoms",
            componentPath: "Div",
            props: {
                className: "common-div-css",
                id: "search",
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
                availabilitySearch,
                availabilityCalendar,
                adhocDialog: {
                    uiFramework: "custom-containers-local",
                    moduleName: "egov-services",
                    componentPath: "DialogContainer",
                    props: {
                        open: false,
                        maxWidth: "lg",
                        screenKey: "checkavailability_oswmcc",
                    },
                    children: {
                        popup: getCommonContainer({
                            children: {
                                perDayRateSummary,
                                ImageLocationSummary,
                            },
                        }),
                        popup: getCommonContainer({
                            venuebasedSummary: {
                                uiFramework: "custom-atoms",
                                componentPath: "Card",
                                props: {
                                    style: {
                                        width: "100%",
                                        margin: "0",
                                        boxShadow: "none",
                                    },
                                },
                                children: {
                                    header: {
                                        uiFramework: "custom-atoms",
                                        componentPath: "Container",
                                        props: {
                                            style: {
                                                // width: "100%",
                                                // float: "right"
                                            },
                                        },
                                        children: {
                                            div1: {
                                                uiFramework: "custom-atoms",
                                                componentPath: "Div",
                                                gridDefination: {
                                                    xs: 10,
                                                    sm: 10,
                                                },
                                                props: {
                                                    style: {
                                                        // width: "100%",
                                                        // float: "right"
                                                    },
                                                },
                                                children: {
                                                    div: getCommonHeader(
                                                        {
                                                            labelName:
                                                                "Venue Details",
                                                            labelKey:
                                                                "BK_OSWMCC_BOOKING_VENUE_DETAILS",
                                                        },
                                                        {
                                                            style: {
                                                                fontSize:
                                                                    "18px",
                                                                marginTop:
                                                                    "8px",
                                                            },
                                                        }
                                                    ),
                                                },
                                            },
                                            div2: {
                                                uiFramework: "custom-atoms",
                                                componentPath: "Div",
                                                gridDefination: {
                                                    xs: 2,
                                                    sm: 2,
                                                },
                                                props: {
                                                    style: {
                                                        width: "100%",
                                                        float: "right",
                                                        cursor: "pointer",
                                                    },
                                                },
                                                children: {
                                                    closeButton: {
                                                        componentPath: "Button",
                                                        props: {
                                                            style: {
                                                                float: "right",
                                                                color:
                                                                    "rgba(0, 0, 0, 0.60)",
                                                            },
                                                        },
                                                        children: {
                                                            previousButtonIcon: {
                                                                uiFramework:
                                                                    "custom-atoms",
                                                                componentPath:
                                                                    "Icon",
                                                                props: {
                                                                    iconName:
                                                                        "close",
                                                                },
                                                            },
                                                        },
                                                        onClickDefination: {
                                                            action: "condition",
                                                            callBack: (
                                                                state,
                                                                dispatch
                                                            ) =>
                                                                showHideAdhocPopup(
                                                                    state,
                                                                    dispatch,
                                                                    "checkavailability_oswmcc"
                                                                ),
                                                        },
                                                    },
                                                },
                                            },
                                        },
                                    },
                                    perDayRateSummary,
                                    ImageLocationSummary,
                                },
                                visible: true,
                            },
                        }),
                    },
                },
            },
        },
    },
};

export default screenConfig;
