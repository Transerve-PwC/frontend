import {
    getCommonContainer,
    getCommonHeader,
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { getLabel } from "egov-ui-framework/ui-config/screens/specs/utils";

import {
    getCurrentFinancialYear,
    clearlocalstorageAppDetails,
    convertDateInYMD,
    getCommonApplyFooter
} from "../utils";
import {
    checkAvailabilitySearch,
    checkAvailabilityCalendar,
} from "./checkavailabilityForm_room";
import {
    setapplicationNumber,
    lSRemoveItemlocal,
    getTenantId,
} from "egov-ui-kit/utils/localStorageUtils";
import { dispatchMultipleFieldChangeAction } from "egov-ui-framework/ui-config/screens/specs/utils";
import {
    prepareFinalObject,
    toggleSnackbar,
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import set from "lodash/set";
import get from "lodash/get";
import {
    getFileUrlFromAPI,
    getQueryArg,
} from "egov-ui-framework/ui-utils/commons";
import {
    getSearchResultsView,
    setApplicationNumberBox,
} from "../../../../ui-utils/commons";
import { httpRequest } from "../../../../ui-utils";
import { getAvailabilityData, getBetweenDays } from "../utils";
import { personalDetails } from "./applyResourceCommunityCenterRoom/nocDetails";

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
                            name: "Booking_Vanue",
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

        dispatch(prepareFinalObject("applyScreenMdmsData", payload.MdmsRes));
    } catch (e) {
        console.log(e);
    }
};

const prepareEditFlow = async (
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
        let bookingsModelList = get(response, "bookingsModelList", []);
        if (bookingsModelList !== null && bookingsModelList.length > 0) {
            dispatch(
                prepareFinalObject("Booking", response.bookingsModelList[0])
            );
            dispatch(
                prepareFinalObject(
                    "availabilityCheckData",
                    response.bookingsModelList[0]
                )
            );

            let availabilityData = await getAvailabilityData(
                response.bookingsModelList[0].bkSector
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

                let availabilityCheckData =
                    state.screenConfiguration.preparedFinalObject
                        .availabilityCheckData;
                reservedDates.map((date) => {
                    if (
                        date === availabilityCheckData.bkFromDate ||
                        date === availabilityCheckData.bkToDate
                    ) {
                        // availabilityCheckData.bkFromDate == null
                        // availabilityCheckData.bkToDate == null

                        dispatch(
                            toggleSnackbar(
                                true,
                                {
                                    labelName: `${availabilityCheckData.bkFromDate} and ${availabilityCheckData.bkToDate} Dates are already Booked`,
                                    labelKey: "",
                                },
                                "warning"
                            )
                        );
                        dispatch(
                            prepareFinalObject(
                                "availabilityCheckData.bkToDate",
                                null
                            )
                        );
                        dispatch(
                            prepareFinalObject(
                                "availabilityCheckData.bkFromDate",
                                null
                            )
                        );
                        dispatch(
                            prepareFinalObject("Booking.bkFromDate", null)
                        );
                        dispatch(prepareFinalObject("Booking.bkToDate", null));
                    }
                });
                // const actionDefination = [
                //     {
                //         path:
                //             "components.div.children.checkAvailabilityCalendar.children.cardContent.children.Calendar.children.bookingCalendar.props",
                //         property: "reservedDays",
                //         value: reservedDates,
                //     },
                // ];
                // dispatchMultipleFieldChangeAction(
                //     "checkavailability",
                //     actionDefination,
                //     dispatch
                // );
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
    }
};
const header = getCommonContainer({
    header: getCommonHeader({
        labelName: `Apply for Room Booking`,
        labelKey: "Apply for Room Booking",
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

const screenConfig = {
    uiFramework: "material-ui",
    name: "checkavailability_room",
    beforeInitScreen: (action, state, dispatch) => {
        clearlocalstorageAppDetails(state);
        set(
            action.screenConfig,
            "components.div.children.personalDetails.visible",
           false
        );

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
                checkAvailabilitySearch,
               personalDetails,
              
            },
        },
    },
};

export default screenConfig;
