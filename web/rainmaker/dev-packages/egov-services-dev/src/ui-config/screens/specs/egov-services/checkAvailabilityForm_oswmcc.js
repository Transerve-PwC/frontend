import {
    getBreak,
    getCommonCard,
    getCommonContainer,
    getCommonHeader,
    getCommonSubHeader,
    getCommonTitle,
    getSelectField,
    getLabel,
} from "egov-ui-framework/ui-config/screens/specs/utils";
import "./checkAvailabilityCss/openSpaceMccCheckAvailability.css";
import { showHideAdhocPopup } from "../utils";
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
import {
    getFileUrlFromAPI,
    getQueryArg,
    getTransformedLocale,
} from "egov-ui-framework/ui-utils/commons";
import {
    getAvailabilityDataOSWMCC,
    getPerDayRateOSWMCC,
    getNewLocatonImages,
    getBetweenDays,
} from "../utils";
import { dispatchMultipleFieldChangeAction } from "egov-ui-framework/ui-config/screens/specs/utils";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import get from "lodash/get";
import set from "lodash/set";

export const validatestepform = (activeStep, isFormValid, hasFieldToaster) => {
    let allAreFilled = true;
    document
        .getElementById("apply_form" + activeStep)
        .querySelectorAll("[required]")
        .forEach(function (i) {
            i.parentNode.classList.remove("MuiInput-error-853");
            i.parentNode.parentNode.classList.remove("MuiFormLabel-error-844");
            if (!i.value) {
                i.focus();
                allAreFilled = false;
                i.parentNode.classList.add("MuiInput-error-853");
                i.parentNode.parentNode.classList.add("MuiFormLabel-error-844");
            }
            if (i.getAttribute("aria-invalid") === "true" && allAreFilled) {
                i.parentNode.classList.add("MuiInput-error-853");
                i.parentNode.parentNode.classList.add("MuiFormLabel-error-844");
                allAreFilled = false;
                isFormValid = false;
                hasFieldToaster = true;
            }
        });

    document
        .getElementById("apply_form" + activeStep)
        .querySelectorAll("input[type='hidden']")
        .forEach(function (i) {
            i.parentNode.classList.remove("MuiInput-error-853");
            i.parentNode.parentNode.parentNode.classList.remove(
                "MuiFormLabel-error-844"
            );
            if (i.value == i.placeholder) {
                i.focus();
                allAreFilled = false;
                i.parentNode.classList.add("MuiInput-error-853");
                i.parentNode.parentNode.parentNode.classList.add(
                    "MuiFormLabel-error-844"
                );
                allAreFilled = false;
                isFormValid = false;
                hasFieldToaster = true;
            }
        });
    if (!allAreFilled) {
        //alert('Fill all fields')
        isFormValid = false;
        hasFieldToaster = true;
    } else {
        //alert('Submit')
        isFormValid = true;
        hasFieldToaster = false;
    }
    return [isFormValid, hasFieldToaster];
};

const callBackForReset = (state, dispatch, action) => {
    const availabilityCheckData = get(
        state,
        "screenConfiguration.preparedFinalObject.availabilityCheckData"
    );

    if (availabilityCheckData !== undefined) {
        if (availabilityCheckData.bkSector) {
            dispatch(
                handleField(
                    "checkavailability_oswmcc",
                    
                    "components.div.children.availabilitySearch.children.availabilityForm.children.cardContent.children.availabilityFields.children.bkSector",
                    "props.value",
                    undefined
                )
            );
        }
        if (availabilityCheckData.bkBookingVenue) {
            dispatch(
                handleField(
                    "checkavailability_oswmcc",
                    "components.div.children.availabilitySearch.children.availabilityForm.children.cardContent.children.availabilityFields.children.bkBookingVenue",
                    "props.value",
                    undefined
                )
            );
        }
        set(
            state.screenConfiguration.screenConfig["checkavailability_oswmcc"],
            "components.div.children.availabilitySearch.children.availabilityForm.children.cardContent.children.availabilityActions.children.actionButtons.children.viewDetailsButton.visible",
            false
        );
        dispatch(prepareFinalObject("availabilityCheckData", undefined));
    }
    // if (availabilityCheckData.bkFromDate) {
    //     dispatch(prepareFinalObject("availabilityCheckData.bkFromDate", ""))
    // }
    // if (availabilityCheckData.bkToDate) {
    //     dispatch(prepareFinalObject("availabilityCheckData.bkToDate", ""))
    // }
    // if (availabilityCheckData.reservedDays) {
    //     dispatch(prepareFinalObject("availabilityCheckData.reservedDays", []))
    // }

    // const actionDefination = [
    //     {
    //         path:
    //             "components.div.children.availabilityCalendar.children.cardContent.children.Calendar.children.bookingCalendar.props",
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
    if (availabilityCheckData === undefined) {
        let warrningMsg = {
            labelName: "Please select date range",
            labelKey: "",
        };
        dispatch(toggleSnackbar(true, warrningMsg, "warning"));
    } else {
        if (
            availabilityCheckData.bkToDate === undefined ||
            availabilityCheckData.bkToDate === "" ||
            availabilityCheckData.bkToDate === null
        ) {
            let warrningMsg = {
                labelName: "Please select date range",
                labelKey: "",
            };
            dispatch(toggleSnackbar(true, warrningMsg, "warning"));
        } else {
            if ("bkApplicationNumber" in availabilityCheckData) {
                dispatch(
                    setRoute(
                        `/egov-services/applyopenspacewmcc?applicationNumber=${availabilityCheckData.bkApplicationNumber}&tenantId=${availabilityCheckData.tenantId}&businessService=${availabilityCheckData.businessService}`
                    )
                );
            } else {
                dispatch(setRoute(`/egov-services/applyopenspacewmcc`));
            }
        }

        // if (
        //     availabilityCheckData.bkToDate === undefined ||
        //     availabilityCheckData.bkToDate === ""
        // ) {
        //     let warrningMsg = {
        //         labelName: "Please select date range",
        //         labelKey: "",
        //     };
        //     dispatch(toggleSnackbar(true, warrningMsg, "warning"));
        // } else if ("bkApplicationNumber" in availabilityCheckData) {
        //     // dispatch(
        //     //     setRoute(
        //     //         `/egov-services/applyopenspacewmcc?applicationNumber=${availabilityCheckData.bkApplicationNumber}&tenantId=${availabilityCheckData.tenantId}&businessService=${availabilityCheckData.businessService}&fromDate=${availabilityCheckData.bkFromDate}&toDate=${availabilityCheckData.bkToDate}&sector=${availabilityCheckData.bkSector}&venue=${availabilityCheckData.bkBookingVenue}`
        //     //     )
        //     // );
        //     dispatch(
        //         setRoute(
        //             `/egov-services/applyopenspacewmcc?applicationNumber=${availabilityCheckData.bkApplicationNumber}&tenantId=${availabilityCheckData.tenantId}&businessService=${availabilityCheckData.businessService}`
        //         )
        //     );
        // } else {
        //     dispatch(
        //         // setRoute(
        //         //     `/egov-services/applyopenspacewmcc?fromDate=${availabilityCheckData.bkFromDate}&toDate=${availabilityCheckData.bkToDate}&sector=${availabilityCheckData.bkSector}&venue=${availabilityCheckData.bkBookingVenue}`
        //         // )
        //         setRoute(`/egov-services/applyopenspacewmcc`)
        //     );
        // }
    }
};

const callBackForAddNewLocation = async (state, dispatch) => {
    const addLocationURL = `/egov-services/applyNewLocationUnderMCC`;
    dispatch(setRoute(addLocationURL));
};

const callBackForSearch = async (state, dispatch) => {
    let isFormValid = false;
    let hasFieldToaster = true;

    let validatestepformflag = validatestepform(1);

    isFormValid = validatestepformflag[0];
    hasFieldToaster = validatestepformflag[1];

    if (isFormValid !== false) {
        let availabilityCheckData = get(
            state,
            "screenConfiguration.preparedFinalObject.availabilityCheckData"
        );
        // if (availabilityCheckData === undefined) {
        //     dispatch(
        //         toggleSnackbar(
        //             true,
        //             { labelName: "Please Select Booking Venue!", labelKey: "" },
        //             "warning"
        //         )
        //     );
        // } else {
        if (
            "bkSector" in availabilityCheckData &&
            "bkBookingVenue" in availabilityCheckData
        ) {
            let bookingSector = availabilityCheckData.bkSector;
            let bookingVenue = availabilityCheckData.bkBookingVenue;
            let response = await getAvailabilityDataOSWMCC(
                bookingSector,
                bookingVenue
            );

            let responseStatus = get(response, "status", "");
            if (responseStatus == "SUCCESS" || responseStatus == "success") {
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
                dispatch(
                    prepareFinalObject(
                        "availabilityCheckData.reservedDays",
                        reservedDates
                    )
                );
            } else {
                let errorMessage = {
                    labelName: "Something went wrong, Try Again later!",
                    labelKey: "", //UPLOAD_FILE_TOAST
                };
                dispatch(toggleSnackbar(true, errorMessage, "error"));
            }
        }
        // else {
        //     let errorMessage = {
        //         labelName: "Please fill all mandatory fields! new",
        //         labelKey: "Please fill all mandatory fields! new",
        //     };

        //     dispatch(toggleSnackbar(true, errorMessage, "warning"));
        // }
        // }
    } else {
        let errorMessage = {
            labelName: "Please fill all mandatory fields!",
            labelKey: "BK_ERR_FILL_ALL_MANDATORY_FIELDS",
        };

        dispatch(toggleSnackbar(true, errorMessage, "warning"));
    }
};

const callBackForVenue = async (state, dispatch) => {
    let bkSector = get(
        state,
        "screenConfiguration.preparedFinalObject.availabilityCheckData.bkSector"
    );
    let bkBookingVenue = get(
        state,
        "screenConfiguration.preparedFinalObject.availabilityCheckData.bkBookingVenue"
    );
    let bkAreaRequired = get(
        state,
        "screenConfiguration.preparedFinalObject.Booking.bkAreaRequired"
    );
    try {
        let responseImage = await getNewLocatonImages(bkSector, bkBookingVenue);
        let responseImageStatus = get(responseImage, "status", "");
        if (
            responseImageStatus == "SUCCESS" ||
            responseImageStatus == "success"
        ) {
            let documentsAndLocImages = responseImage.data;
            let onlyLocationImages =
                documentsAndLocImages &&
                documentsAndLocImages.filter(
                    (item) => item.documentType != "IDPROOF"
                );

            let fileStoreIds =
                onlyLocationImages &&
                onlyLocationImages.map((item) => item.fileStoreId).join(",");
            const fileUrlPayload =
                fileStoreIds && (await getFileUrlFromAPI(fileStoreIds));
            let newLocationImagesPreview = [];
            onlyLocationImages &&
                onlyLocationImages.forEach((item, index) => {
                    newLocationImagesPreview[index] = {
                        name:
                            (fileUrlPayload &&
                                fileUrlPayload[item.fileStoreId] &&
                                decodeURIComponent(
                                    fileUrlPayload[item.fileStoreId]
                                        .split(",")[0]
                                        .split("?")[0]
                                        .split("/")
                                        .pop()
                                        .slice(13)
                                )) ||
                            `Document - ${index + 1}`,
                        fileStoreId: item.fileStoreId,
                        link: Object.values(fileUrlPayload)[index],
                        title: item.documentType,
                    };
                });

            dispatch(
                prepareFinalObject(
                    "mccNewLocImagesPreview",
                    newLocationImagesPreview
                )
            );

            let response = await getPerDayRateOSWMCC(bkSector, bkAreaRequired);
            let responseStatus = get(response, "status", "");
            if (responseStatus == "SUCCESS" || responseStatus == "success") {
                response.data.displayArea = response.data.areaFrom + " - " + response.data.areaTo;
                dispatch(prepareFinalObject("perDayRate", response.data));
            } 
            // else {
            //     let errorMessage = {
            //         labelName: "Something went wrong, Try Again later!",
            //         labelKey: "", //UPLOAD_FILE_TOAST
            //     };
            //     dispatch(toggleSnackbar(true, errorMessage, "error"));
            // }
        } 
        // else {
        //     let errorMessage = {
        //         labelName: "Something went wrong, Try Again later!",
        //         labelKey: "", //UPLOAD_FILE_TOAST
        //     };
        //     dispatch(toggleSnackbar(true, errorMessage, "error"));
        // }
        showHideAdhocPopup(state, dispatch, "checkavailability_oswmcc");
    } catch (error) {
        console.log(error, "myerror");
    }
};

export const availabilityForm = getCommonCard({
    header: {
        uiFramework: "custom-atoms",
        componentPath: "Container",
        props: {
            
            className: "addLocation-header",
            style: { marginBottom: "10px"},
        },
        children: {
            header: {
                gridDefination: {
                    xs: 8,
                },
                ...getCommonHeader({
                    labelName: "Check Open Space Availability",
                    labelKey: "BK_OSWMCC_CHECK_AVAILABILITY_HEADING",
                }),
            },
            addNewLocButton: {
                componentPath: "Button",
                props: {
                    // variant: "contained",
                    color: "primary",
                    style: {
                        // marginTop: "-10px",
                        marginRight: "-18px",
                    },
                },
                gridDefination: {
                    xs: 4,
                    align: "right",
                },
                children: {
                    addIcon: {
                        uiFramework: "custom-atoms",
                        componentPath: "Icon",
                        props: {
                            iconName: "add_location_alt",
                        },
                    },
                    buttonLabel: getLabel({
                        labelName: "Add New Location",
                        labelKey: "BK_OSWMCC_NEW_LOCATION_LABEL",
                    }),
                },
                onClickDefination: {
                    action: "condition",
                    callBack: callBackForAddNewLocation,
                },
                visible: true,
            },
        },
    },
    availabilityFields: getCommonContainer({
        bkSector: {
            ...getSelectField({
                label: {
                    labelName: "Locality",
                    labelKey: "BK_OSWMCC_BOOKING_LOCALITY__LABEL",
                },

                placeholder: {
                    labelName: "Select Locality",
                    labelKey: "BK_OSWMCC_BOOKING_LOCALITY_PLACEHOLDER",
                },
                gridDefination: {
                    xs: 12,
                    sm: 6,
                    md: 6,
                },

                sourceJsonPath: "applyScreenMdmsData.Booking.Sector",
                jsonPath: "availabilityCheckData.bkSector",
                required: true,
                errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
                props: {
                    className: "applicant-details-error",
                    required: true,
                    // disabled: true
                },
            }),
            beforeFieldChange: (action, state, dispatch) => {
                if (action.value) {
                    // let bkBookingVenue = get(
                    //     state,
                    //     "screenConfiguration.preparedFinalObject.availabilityCheckData.bkBookingVenue"
                    // );
                    // console.log(action.value, "my new value sector");
                    let sectorWiselocationsObject = get(
                        state,
                        "screenConfiguration.preparedFinalObject.sectorWiselocationsObject"
                    );
                    
                    let venueList = get(
                        sectorWiselocationsObject,
                        action.value
                    );
                    console.log(sectorWiselocationsObject, "sectorWiselocationsObject in sector");
                    console.log(venueList, "venueList in sector");
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
                            false
                        )
                    );

                    // if (bkBookingVenue !== undefined) {
                    //     dispatch(
                    //         handleField(
                    //             "checkavailability_oswmcc",
                    //             "components.div.children.availabilitySearch.children.availabilityForm.children.cardContent.children.availabilityFields.children.bkBookingVenue",
                    //             "props.value",
                    //             bkBookingVenue
                    //         )
                    //     );
                    // }
                }
            },
            // afterFieldChange : (action, state, dispatch) => {
            //     alert("in after sector")
            // }
        },
        bkBookingVenue: {
            ...getSelectField({
                label: {
                    labelName: "Booking Venue",
                    labelKey: "BK_OSWMCC_BOOKING_VENUE_LABEL",
                },

                placeholder: {
                    labelName: "Select Booking Venue",
                    labelKey: "BK_OSWMCC_BOOKING_VENUE_PLACEHOLDER",
                },
                gridDefination: {
                    xs: 12,
                    sm: 6,
                    md: 6,
                },

                sourceJsonPath: "venueList",
                jsonPath: "availabilityCheckData.bkBookingVenue",
                required: true,
                errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
                props: {
                    className: "applicant-details-error",
                    required: true,
                    disabled: true,
                },
            }),
            beforeFieldChange: async (action, state, dispatch) => {
                if (action.value) {
                    set(
                        state.screenConfiguration.screenConfig[
                            "checkavailability_oswmcc"
                        ],
                        "components.div.children.availabilitySearch.children.availabilityForm.children.cardContent.children.availabilityActions.children.actionButtons.children.viewDetailsButton.visible",
                        true
                    );

                    let venueList = get(
                        state,
                        "screenConfiguration.preparedFinalObject.venueList"
                    );
                    let selectedVenue = venueList !== undefined && venueList.filter((el) => el.name == action.value);
                    let bkAreaRequired = selectedVenue.length > 0 ? selectedVenue[0].areRequirement : "";
                    dispatch(
                        prepareFinalObject(
                            "Booking.bkAreaRequired",
                            bkAreaRequired
                        )
                    );

                    //     let responseImage = await getNewLocatonImages(
                    //         bkSector,
                    //         action.value
                    //     );
                    //     let responseImageStatus = get(responseImage, "status", "");
                    //     if (
                    //         responseImageStatus == "SUCCESS" ||
                    //         responseImageStatus == "success"
                    //     ) {
                    //         let documentsAndLocImages = responseImage.data;
                    //         let onlyLocationImages =
                    //             documentsAndLocImages &&
                    //             documentsAndLocImages.filter(
                    //                 (item) => item.documentType != "IDPROOF"
                    //             );

                    //         let fileStoreIds =
                    //             onlyLocationImages &&
                    //             onlyLocationImages
                    //                 .map((item) => item.fileStoreId)
                    //                 .join(",");
                    //         const fileUrlPayload =
                    //             fileStoreIds &&
                    //             (await getFileUrlFromAPI(fileStoreIds));
                    //         let newLocationImagesPreview = [];
                    //         onlyLocationImages &&
                    //             onlyLocationImages.forEach((item, index) => {
                    //                 newLocationImagesPreview[index] = {
                    //                     name:
                    //                         (fileUrlPayload &&
                    //                             fileUrlPayload[item.fileStoreId] &&
                    //                             decodeURIComponent(
                    //                                 fileUrlPayload[item.fileStoreId]
                    //                                     .split(",")[0]
                    //                                     .split("?")[0]
                    //                                     .split("/")
                    //                                     .pop()
                    //                                     .slice(13)
                    //                             )) ||
                    //                         `Document - ${index + 1}`,
                    //                     fileStoreId: item.fileStoreId,
                    //                     link: Object.values(fileUrlPayload)[index],
                    //                     title: item.documentType,
                    //                     // tenantId: item.tenantId,
                    //                     // id: item.id,
                    //                 };
                    //             });

                    //         dispatch(
                    //             prepareFinalObject(
                    //                 "mccNewLocImagesPreview",
                    //                 newLocationImagesPreview
                    //             )
                    //         );

                    //         let response = await getPerDayRateOSWMCC(
                    //             bkSector,
                    //             bkAreaRequired
                    //         );
                    //         let responseStatus = get(response, "status", "");
                    //         if (
                    //             responseStatus == "SUCCESS" ||
                    //             responseStatus == "success"
                    //         ) {
                    //             set(
                    //                 state.screenConfiguration.screenConfig[
                    //                     "checkavailability_oswmcc"
                    //                 ],
                    //                 "components.div.children.availabilityForm.children.cardContent.children.availabilitySearchContainer.children.viewDetailsButton.visible",
                    //                 true
                    //             );
                    //             dispatch(
                    //                 prepareFinalObject("perDayRate", response.data)
                    //             );
                    //         } else {
                    //             let errorMessage = {
                    //                 labelName:
                    //                     "Something went wrong, Try Again later!",
                    //                 labelKey: "", //UPLOAD_FILE_TOAST
                    //             };
                    //             dispatch(
                    //                 toggleSnackbar(true, errorMessage, "error")
                    //             );
                    //         }
                    //     } else {
                    //         let errorMessage = {
                    //             labelName: "Something went wrong, Try Again later!",
                    //             labelKey: "", //UPLOAD_FILE_TOAST
                    //         };
                    //         dispatch(toggleSnackbar(true, errorMessage, "error"));
                    //     }
                }
            },
            // afterFieldChange : (action, state, dispatch) => {
            //     alert("in after venue")
            // }
        },
    }),
    availabilityActions: getCommonContainer({
        actionButtons : {
            uiFramework: "custom-atoms",
            componentPath: "Container",
            gridDefination: {
                xs: 12,
            },
            props: {
                className: "checkavailability-footer",
              
            },
            children : {
        searchButton: {
            componentPath: "Button",
            props: {
                variant: "contained",
                color: "primary",
                
                style: {
                    minWidth: "200px",
                    height: "48px",
                    // marginRight: "16px",
                },
            },

            children: {
                submitButtonLabel: getLabel({
                    labelName: "Check Availability",
                    labelKey: "BK_OSWMCC_CHECK_AVAILABILITY_LABEL",
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
                    // marginRight: "16px",
                    marginLeft: "16px",
                },
            },

            children: {
                resetButtonLabel: getLabel({
                    labelName: "Reset",
                    labelKey: "BK_OSWMCC_BOOKING_CHECK_RESET_LABEL",
                }),
            },
            onClickDefination: {
                action: "condition",
                callBack: callBackForReset,
            },
            visible: true,
        },

        viewDetailsButton: {
            componentPath: "Button",
            props: {
                // variant: "outlined",
                color: "primary",
                style: {
                    minWidth: "200px",
                    height: "48px",
                    // marginRight: "16px",
                    marginLeft: "16px",
                },
            },
            children: {
                viewIcon: {
                    uiFramework: "custom-atoms",
                    componentPath: "Icon",
                    props: {
                        iconName: "remove_red_eye",
                    },
                },
                buttonLabel: getLabel({
                    labelName: "View Details",
                    labelKey: "View Details",
                }),
            },
            onClickDefination: {
                action: "condition",
                callBack: callBackForVenue,
            },
            visible: false,
        },
    }},
    }),
});

export const availabilityCalendar = getCommonCard({
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
                venueDataKey: "bkBookingVenue"
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
                    justifyContent: "flex-end",
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
