import {
    getBreak,
    getCommonCard,
    getCommonContainer,
    getCommonHeader,
    getCommonTitle,
    getSelectField,
    getLabel,
} from "egov-ui-framework/ui-config/screens/specs/utils";
import "./checkAvailabilityCss/index.css";
import {
    getTenantId,
    setapplicationType,
    lSRemoveItem,
    lSRemoveItemlocal,
    setapplicationNumber,
    getUserInfo,
    localStorageSet,
} from "egov-ui-kit/utils/localStorageUtils";
import {
    prepareFinalObject,
    handleScreenConfigurationFieldChange as handleField,
    toggleSnackbar,
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getAvailabilityData, getBetweenDays } from "../utils";
import { dispatchMultipleFieldChangeAction } from "egov-ui-framework/ui-config/screens/specs/utils";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import get from "lodash/get";

const callBackForReset = (state, dispatch, action) => {
    const availabilityCheckData = get(
        state,
        "screenConfiguration.preparedFinalObject.availabilityCheckData"
    );

    if (availabilityCheckData !== undefined) {
        if (availabilityCheckData.bkSector) {
            dispatch(
                handleField(
                    "checkavailability",
                    "components.div.children.checkAvailabilitySearch.children.cardContent.children.availabilitySearchContainer.children.bkSector",
                    "props.value",
                    undefined
                )
            );
        }
        if (availabilityCheckData.bkFromDate) {
            dispatch(
                handleField(
                    "checkavailability",
                    "components.div.children.checkAvailabilitySearch.children.cardContent.children.availabilitySearchContainer.children.bkSector",
                    "props.value",
                    undefined
                )
            );
        }
        if (availabilityCheckData.reservedDays) {

            const actionDefination = [
                {
                    path:
                        "components.div.children.checkAvailabilityCalendar.children.cardContent.children.Calendar.children.bookingCalendar.props",
                    property: "reservedDays",
                    value: [],
                },
            ];
            dispatchMultipleFieldChangeAction(
                "checkavailability",
                actionDefination,
                dispatch
            );
            // dispatch(
            //     handleField(
            //         "checkavailability",
            //         "components.div.children.checkAvailabilityCalendar.children.cardContent.children.Calendar.children.bookingCalendar",

            //         "props.reservedDays",
            //         []
            //     )
            // );
            dispatch(prepareFinalObject("availabilityCheckData", undefined));
        }

    }
    if (availabilityCheckData.reservedDays) {
        dispatch(
            handleField(
                "checkavailability",
                "components.div.children.checkAvailabilityCalendar.children.cardContent.children.Calendar.children.bookingCalendar",
                "props.reservedDays",
                []
            )
        );
    }

    // const actionDefination = [
    //     {
    //         path:
    //             "components.div.children.checkAvailabilityCalendar.children.cardContent.children.Calendar.children.bookingCalendar.props",
    //         property: "reservedDays",
    //         value: [],
    //     },
    // ];
    // dispatchMultipleFieldChangeAction(
    //     "checkavailability",
    //     actionDefination,
    //     dispatch
    // );
    // dispatch(prepareFinalObject("bookingCalendar.allowClick", "false"));
};
const callBackForResetCalender = (state, dispatch, action) => {
    const availabilityCheckData = get(
        state,
        "screenConfiguration.preparedFinalObject.availabilityCheckData"
    );

    if (availabilityCheckData !== undefined) {
        dispatch(prepareFinalObject("availabilityCheckData.bkFromDate", null));
        dispatch(prepareFinalObject("availabilityCheckData.bkToDate", null));
    }
};

const callBackForBook = async (state, dispatch) => {
    let availabilityCheckData =
        state.screenConfiguration.preparedFinalObject.availabilityCheckData;
    console.log(availabilityCheckData, "availabilityCheckData");
    if (availabilityCheckData === undefined) {
        let warrningMsg = {
            labelName: "Please select date range",
            labelKey: "",
        };
        dispatch(toggleSnackbar(true, warrningMsg, "warning"));
    } else {
        if (availabilityCheckData.bkToDate === undefined || availabilityCheckData.bkToDate === "" || availabilityCheckData.bkToDate === null) {
            let warrningMsg = {
                labelName: "Please select date range",
                labelKey: "",
            };
            dispatch(toggleSnackbar(true, warrningMsg, "warning"));
        } else if ("bkApplicationNumber" in availabilityCheckData) {
            //&fromDate=${availabilityCheckData.bkFromDate}&toDate=${availabilityCheckData.bkToDate}&venue=${availabilityCheckData.bkSector}
            dispatch(setRoute(`/egov-services/applycommercialground?applicationNumber=${availabilityCheckData.bkApplicationNumber}&tenantId=${availabilityCheckData.tenantId}&businessService=${availabilityCheckData.businessService}`));
        } else {
            //?fromDate=${availabilityCheckData.bkFromDate}&toDate=${availabilityCheckData.bkToDate}&venue=${availabilityCheckData.bkSector}
            dispatch(setRoute(`/egov-services/applycommercialground`));
        }

    }

    // if (availabilityCheckData !== undefined) {


    //     if (
    //         (availabilityCheckData &&
    //             availabilityCheckData.bkApplicationNumber == null) ||
    //         availabilityCheckData.bkApplicationNumber == undefined
    //     ) {
    //         console.log(
    //             availabilityCheckData.bkToDate,
    //             "availabilityCheckData.bkToDate !=="
    //         );
    //         if (availabilityCheckData.bkToDate === undefined) {
    //             let warrningMsg = {
    //                 labelName: "Please select date range",
    //                 labelKey: "",
    //             };
    //             dispatch(toggleSnackbar(true, warrningMsg, "warning"));
    //         } else {
    //             let venueData =
    //                 state.screenConfiguration.preparedFinalObject
    //                     .availabilityCheckData.bkSector;
    //             let fromDateString =
    //                 state.screenConfiguration.preparedFinalObject
    //                     .availabilityCheckData.bkFromDate;
    //             let toDateString =
    //                 state.screenConfiguration.preparedFinalObject
    //                     .availabilityCheckData.bkToDate;
    //             localStorageSet("fromDateCG", fromDateString);
    //             localStorageSet("toDateCG", toDateString);
    //             localStorageSet("venueCG", venueData);
    //             let reviewUrl = `/egov-services/applycommercialground`;
    //             dispatch(setRoute(reviewUrl));
    //         }
    //     } else {
    //         let venueData =
    //             state.screenConfiguration.preparedFinalObject.availabilityCheckData
    //                 .bkSector;
    //         let fromDateString =
    //             state.screenConfiguration.preparedFinalObject.availabilityCheckData
    //                 .bkFromDate;
    //         let toDateString =
    //             state.screenConfiguration.preparedFinalObject.availabilityCheckData
    //                 .bkToDate;
    //         localStorageSet("fromDateCG", fromDateString);
    //         localStorageSet("toDateCG", toDateString);
    //         localStorageSet("venueCG", venueData);
    //         let reviewUrl = `/egov-services/applycommercialground?applicationNumber=${availabilityCheckData.bkApplicationNumber}&tenantId=${availabilityCheckData.tenantId}&businessService=${availabilityCheckData.businessService}`;
    //         dispatch(setRoute(reviewUrl));
    //     }
    // } else {
    //     let warrningMsg = {
    //         labelName: "Please select date range",
    //         labelKey: "",
    //     };
    //     dispatch(toggleSnackbar(true, warrningMsg, "warning"));
    // }
};

const callBackForSearch = async (state, dispatch) => {
    let availabilityCheckData = get(
        state,
        "screenConfiguration.preparedFinalObject.availabilityCheckData"
    );

    if (availabilityCheckData === undefined) {
        dispatch(
            toggleSnackbar(
                true,
                { labelName: "Please Select Booking Venue!", labelKey: "" },
                "warning"
            )
        );
    } else {
        if ("bkSector" in availabilityCheckData) {
            let bookingVenue = availabilityCheckData && availabilityCheckData.bkSector;
            console.log(bookingVenue, "bookingVenue");
            let response = await getAvailabilityData(bookingVenue);
            if (response !== undefined) {
                let data = response.data;
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
                dispatch(prepareFinalObject("availabilityCheckData.reservedDays", reservedDates));
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
                        { labelName: "Please try after sometime!", labelKey: "" },
                        "warning"
                    )
                );
            }
        } else {
            dispatch(
                toggleSnackbar(
                    true,
                    { labelName: "Please Select Booking Venue!", labelKey: "" },
                    "warning"
                )
            );

        }
    }
    // if (availabilityCheckData.bkSector === "" || availabilityCheckData.bkSector === undefined) {
    //     dispatch(
    //         toggleSnackbar(
    //             true,
    //             { labelName: "Please Select Booking Venue!", labelKey: "" },
    //             "warning"
    //         )
    //     );
    // } else {
    //     let response = await getAvailabilityData(availabilityCheckData.bkSector);
    //     if (response !== undefined) {
    //         let data = response.data;
    //         let reservedDates = [];
    //         var daylist = [];
    //         data.map((dataitem) => {
    //             let start = dataitem.fromDate;
    //             let end = dataitem.toDate;
    //             daylist = getBetweenDays(start, end);
    //             daylist.map((v) => {
    //                 reservedDates.push(v.toISOString().slice(0, 10));
    //             });
    //         });
    //         prepareFinalObject("reservedAvailabilityData", reservedDates);
    //         const actionDefination = [
    //             {
    //                 path:
    //                     "components.div.children.checkAvailabilityCalendar.children.cardContent.children.Calendar.children.bookingCalendar.props",
    //                 property: "reservedDays",
    //                 value: reservedDates,
    //             },
    //         ];
    //         dispatchMultipleFieldChangeAction(
    //             "checkavailability",
    //             actionDefination,
    //             dispatch
    //         );
    //     } else {
    //         dispatch(
    //             toggleSnackbar(
    //                 true,
    //                 { labelName: "Please try after sometime!", labelKey: "" },
    //                 "warning"
    //             )
    //         );
    //     }
    // }
};


export const checkAvailabilitySearch = getCommonCard({
    subHeader: getCommonTitle({
        labelName: "Check Commercial Ground Availability",
        labelKey: "BK_CGB_CHECK_AVAILABILITY_HEADING",
    }),

    break: getBreak(),
    availabilitySearchContainer: getCommonContainer({
        bkSector: {
            ...getSelectField({
                label: {
                    labelName: "Booking Venue",
                    labelKey: "BK_CGB_BOOKING_VENUE_LABEL",
                },

                placeholder: {
                    labelName: "Select Booking Venue",
                    labelKey: "BK_CGB_BOOKING_VENUE_PLACEHOLDER",
                },
                gridDefination: {
                    xs: 12,
                    sm: 6,
                    md: 6,
                },

                sourceJsonPath: "applyScreenMdmsData.Booking.Booking_Vanue",
                jsonPath: "availabilityCheckData.bkSector",
                required: true,
                props: {
                    className: "applicant-details-error",
                    required: true,
                    // disabled: true
                },
            }),
        },
        searchButton: {
            componentPath: "Button",
            props: {
                variant: "contained",
                color: "primary",
                style: {
                    minWidth: "200px",
                    height: "48px",
                    marginRight: "16px",
                },
            },
            gridDefination: {
                xs: 12,
                sm: 12,
                md: 3,
            },

            children: {
                // previousButtonIcon: {
                //     uiFramework: "custom-atoms",
                //     componentPath: "Icon",
                //     props: {
                //         iconName: "keyboard_arrow_left"
                //     }
                // },
                submitButtonLabel: getLabel({
                    labelName: "Search",
                    labelKey: "BK_CGB_SEARCH_LABEL",
                }),
            },
            onClickDefination: {
                action: "condition",
                callBack: callBackForSearch,
            },
            visible: true,
        },
        resetButton: {
            componentPath: "Button",
            props: {
                variant: "outlined",
                color: "primary",
                style: {
                    minWidth: "200px",
                    height: "48px",
                    marginRight: "16px",
                    //marginLeft: "100px"
                },
            },
            gridDefination: {
                xs: 12,
                sm: 12,
                md: 3,
            },

            children: {
                resetButtonLabel: getLabel({
                    labelName: "Reset",
                    labelKey: "BK_CGB_RESET_LABEL",
                }),
            },
            onClickDefination: {
                action: "condition",
                callBack: callBackForReset,
            },
            visible: true,
        },
    }),
});
export const checkAvailabilityCalendar = getCommonCard({
    Calendar: getCommonContainer({
        header: getCommonHeader({
            labelName: `Select From & To Date in below Calendar`,
            labelKey: "BK_PCC_SELECT_CALENDAR_DATE_HEAD",
        }),
        bookingCalendar: {
            uiFramework: "custom-containers-local",
            moduleName: "egov-services",
            componentPath: "BookingCalenderContainer",
            gridDefination: {
                xs: 12,
                sm: 12,
                md: 12,
            },
            props: {
                open: false,
                maxWidth: false,
                screenKey: "bookingCalendar",
                reservedDays: [],
                venueDataKey: "bkSector",
            },
            children: {
                popup: {},
            },
        },
        actionButtons : {
            uiFramework: "custom-atoms",
            componentPath: "Container",
            gridDefination: {
                xs: 12,
            },
            props: {
                className: "checkavailability-footer",
                style: {
                  //  justifyContent: window.matchMedia("(max-width: 400px)").matches? "flex-start":  "flex-end",
                  justifyContent:"flex-end"
                },
            },
            children : {
                resetButton: {
                    componentPath: "Button",
                    props: {
                        variant: "outlined",
                        color: "primary",
                        style: {
                            minWidth: "200px",
                            height: "48px",
                            marginTop: "10px",
                            marginRight: "16px"
                        },
                    },
        
                    children: {
                        submitButtonLabel: getLabel({
                            labelName: "RESET",
                            labelKey: "RESET",
                        }),
                    },
                    onClickDefination: {
                        action: "condition",
                        callBack: callBackForResetCalender,
                    },
                    visible: true,
                },
                bookButton: {
                    componentPath: "Button",
                    props: {
                        variant: "contained",
                        color: "primary",
                        style: {
                            minWidth: "200px",
                            height: "48px",
                            marginTop: "10px",
                        },
                    },
        
                    children: {
                        submitButtonLabel: getLabel({
                            labelName: "Book",
                            labelKey: "BK_CGB_BOOK_LABEL",
                        }),
                    },
                    onClickDefination: {
                        action: "condition",
                        callBack: callBackForBook,
                    },
                    visible: true,
                },
            }
        },
       
    }),
});
