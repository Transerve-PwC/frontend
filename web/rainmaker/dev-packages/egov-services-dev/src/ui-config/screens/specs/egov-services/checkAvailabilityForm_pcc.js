import {
  getBreak,
  getCommonCard,
  getCommonContainer,
  getCommonHeader,
  getCommonSubHeader,
  getCommonTitle,
  getSelectField,
  getDateField,
  getLabel,
  getPattern,
} from "egov-ui-framework/ui-config/screens/specs/utils";

import {
  prepareFinalObject,
  handleScreenConfigurationFieldChange as handleField,
  toggleSnackbar,
} from "egov-ui-framework/ui-redux/screen-configuration/actions";

import { getMasterDataPCC } from "../utils";
import { dispatchMultipleFieldChangeAction } from "egov-ui-framework/ui-config/screens/specs/utils";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import get from "lodash/get";
import set from "lodash/set";
import { convertDateInYMD, calculateBetweenDaysCount } from "../utils";


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

// const callBackForReset = (state, dispatch, action) => {
//     const availabilityCheckData = get(
//         state,
//         "screenConfiguration.preparedFinalObject.availabilityCheckData"
//     );

//     if (availabilityCheckData !== undefined) {
//         if (availabilityCheckData.bkSector) {
//             dispatch(
//                 handleField(
//                     "checkavailability_oswmcc",
//                     "components.div.children.availabilityForm.children.cardContent.children.availabilitySearchContainer.children.bkSector",
//                     "props.value",
//                     undefined
//                 )
//             );
//         }
//         if (availabilityCheckData.bkBookingVenue) {
//             dispatch(
//                 handleField(
//                     "checkavailability_oswmcc",
//                     "components.div.children.availabilityForm.children.cardContent.children.availabilitySearchContainer.children.bkBookingVenue",
//                     "props.value",
//                     undefined
//                 )
//             );
//         }
//         set(
//             state.screenConfiguration.screenConfig["checkavailability_oswmcc"],
//             "components.div.children.availabilityForm.children.cardContent.children.availabilitySearchContainer.children.viewDetailsButton.visible",
//             false
//         );
//         dispatch(prepareFinalObject("availabilityCheckData", undefined));
//     }
//     // if (availabilityCheckData.bkFromDate) {
//     //     dispatch(prepareFinalObject("availabilityCheckData.bkFromDate", ""))
//     // }
//     // if (availabilityCheckData.bkToDate) {
//     //     dispatch(prepareFinalObject("availabilityCheckData.bkToDate", ""))
//     // }
//     // if (availabilityCheckData.reservedDays) {
//     //     dispatch(prepareFinalObject("availabilityCheckData.reservedDays", []))
//     // }

//     // const actionDefination = [
//     //     {
//     //         path:
//     //             "components.div.children.availabilityCalendar.children.cardContent.children.Calendar.children.bookingCalendar.props",
//     //         property: "reservedDays",
//     //         value: [],
//     //     },
//     // ];
//     // dispatchMultipleFieldChangeAction(
//     //     "checkavailability",
//     //     actionDefination,
//     //     dispatch
//     // );
//     // dispatch(prepareFinalObject("bookingCalendar.allowClick", "false"));
// };

const callBackForBookTimeSlot = async (state, dispatch) => {
  // dispatch(setRoute(`/egov-services/applyparkcommunitycenter`));
  let availabilityCheckData =
    state.screenConfiguration.preparedFinalObject.availabilityCheckData;
  if (availabilityCheckData === undefined) {
    let warrningMsg = {
      labelName: "Please Select Time Slot you want to Book",
      labelKey: "",
    };
    dispatch(toggleSnackbar(true, warrningMsg, "warning"));
  } else {
    if (
      !availabilityCheckData.bkApplicationNumber &&
      (availabilityCheckData.bkToTime === undefined ||
        availabilityCheckData.bkToTime === "" ||
        availabilityCheckData.bkToTime === null)
    ) {
      let warrningMsg = {
        labelName: "Please Select Time Slot you want to Book",
        labelKey: "",
      };
      dispatch(toggleSnackbar(true, warrningMsg, "warning"));
    } else {
      if ("bkApplicationNumber" in availabilityCheckData) {
        dispatch(
          setRoute(
            `/egov-services/applyparkcommunitycenter?applicationNumber=${availabilityCheckData.bkApplicationNumber}&tenantId=${availabilityCheckData.tenantId}&businessService=${availabilityCheckData.businessService}`
          )
        );
      } else {
        dispatch(setRoute(`/egov-services/applyparkcommunitycenter`));
      }
    }
  }
};

const callBackForBook = async (state, dispatch) => {
  let availabilityCheckData = get(
    state,
    "screenConfiguration.preparedFinalObject.availabilityCheckData",
    {}
  );
  let oldAvailabilityCheckData = get(
    state,
    "screenConfiguration.preparedFinalObject.oldAvailabilityCheckData",
    {}
  );
  console.log(availabilityCheckData, "availabilityCheckData");
  console.log(oldAvailabilityCheckData, "oldAvailabilityCheckData");
  if (availabilityCheckData === undefined || !("bkToDate" in availabilityCheckData) || (availabilityCheckData.bkToDate == null)) {
    let warrningMsg = {
      labelName: "Please Select Date Range",
      labelKey: "",
    };
    dispatch(toggleSnackbar(true, warrningMsg, "warning"));
  } else {

    let daysCount = calculateBetweenDaysCount(
        availabilityCheckData.bkFromDate,
        availabilityCheckData.bkToDate
    );

    if(daysCount > 2){
      let warrningMsg = {
        labelName: "You can not book venue for more than 2 days",
        labelKey: "",
      };
      dispatch(toggleSnackbar(true, warrningMsg, "warning"));
      return false;
    }


    if (oldAvailabilityCheckData !== undefined) {
console.log(convertDateInYMD(availabilityCheckData.bkFromDate)+ "----"+oldAvailabilityCheckData.bkFromDate);
console.log(convertDateInYMD(availabilityCheckData.bkToDate)+ "----"+oldAvailabilityCheckData.bkToDate);
console.log(availabilityCheckData.bkBookingVenue+"-----------"+
oldAvailabilityCheckData.bkBookingVenue);
console.log(oldAvailabilityCheckData.bkApplicationStatus);
let alreadyBookedDaysCount = calculateBetweenDaysCount(
    oldAvailabilityCheckData.bkFromDate,
    oldAvailabilityCheckData.bkToDate
);

let selectedDaysCount = calculateBetweenDaysCount(
    convertDateInYMD(availabilityCheckData.bkFromDate),
    convertDateInYMD(availabilityCheckData.bkToDate)
);
console.log(alreadyBookedDaysCount, selectedDaysCount, "aNero from file");
      if (
        convertDateInYMD(availabilityCheckData.bkFromDate) ===
        oldAvailabilityCheckData.bkFromDate &&
        convertDateInYMD(availabilityCheckData.bkToDate) ===
        oldAvailabilityCheckData.bkToDate &&
        availabilityCheckData.bkBookingVenue ===
        oldAvailabilityCheckData.bkBookingVenue &&
        (availabilityCheckData.bkApplicationStatus == "APPLIED" || availabilityCheckData.bkApplicationStatus == "RE_INITIATED")
      ) {
        let warrningMsg = {
          labelName: "Please Change Date/Venue",
          labelKey: "",
        };
        dispatch(toggleSnackbar(true, warrningMsg, "warning"));
      } else if(Number.isInteger(alreadyBookedDaysCount) && alreadyBookedDaysCount != selectedDaysCount){
        let warrningMsg = {
          labelName: "You can only change the dates but total no of days must be equal as original booking",
          labelKey: "",
        };
        dispatch(toggleSnackbar(true, warrningMsg, "warning"));


      } else {
        if ("bkApplicationNumber" in availabilityCheckData) {
          dispatch(
            setRoute(
              `/egov-services/applyparkcommunitycenter?applicationNumber=${availabilityCheckData.bkApplicationNumber}&tenantId=${availabilityCheckData.tenantId}&businessService=${availabilityCheckData.businessService}`
            )
          );
        } else {
          dispatch(setRoute(`/egov-services/applyparkcommunitycenter`));
        }
      }
    } else {
      if (
        availabilityCheckData.bkToDate === undefined ||
        availabilityCheckData.bkToDate === "" ||
        availabilityCheckData.bkToDate === null
      ) {
        let warrningMsg = {
          labelName: "Please Select Date Range",
          labelKey: "",
        };
        dispatch(toggleSnackbar(true, warrningMsg, "warning"));
      } else {
        if ("bkApplicationNumber" in availabilityCheckData) {
          dispatch(
            setRoute(
              `/egov-services/applyparkcommunitycenter?applicationNumber=${availabilityCheckData.bkApplicationNumber}&tenantId=${availabilityCheckData.tenantId}&businessService=${availabilityCheckData.businessService}`
            )
          );
        } else {
          dispatch(setRoute(`/egov-services/applyparkcommunitycenter`));
        }
      }
    }
  }
};

const calculateBetweenDaysCount1 = (startDate, endDate) => {
    const oneDay = 24 * 60 * 60 * 1000;
    const firstDate = new Date(startDate);
    const secondDate = new Date(endDate);

    const daysCount =
        Math.round(Math.abs((firstDate - secondDate) / oneDay))+1;
    return daysCount;
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

export const availabilityForm = getCommonCard({
  header: {
    uiFramework: "custom-atoms",
    componentPath: "Container",
    props: {
      style: { marginBottom: "10px" },
    },
    children: {
      header: {
        gridDefination: {
          xs: 8,
        },
        ...getCommonHeader({
          labelName: "Check Open Space Availability",
          labelKey: "BK_PCC_CHECK_AVAILABILITY_HEADER",
        }),
      },
    },
  },
  availabilityFields: getCommonContainer({
    bkBookingType: {
      uiFramework: "custom-containers",
      componentPath: "RadioGroupContainer",
      moduleName: "egov-services",
      gridDefination: {
        xs: 12,
        sm: 12,
        md: 6,
      },
      jsonPath: "availabilityCheckData.bkBookingType",
      props: {
        label: {
          name: "Booking Type",
          key: "BK_PCC_BOOKING_TYPE_LABEL",
        },
        buttons: [
          {
            labelName: "Community Center",
            labelKey: "Community Center",
            value: "Community Center",
          },
          {
            label: "Parks",
            labelKey: "Parks",
            value: "Parks",
          },
        ],
        jsonPath: "availabilityCheckData.bkBookingType",
        defaultValue: "Parks",
        required: true,
      },
      required: true,
      type: "array",
      beforeFieldChange: (action, state, dispatch) => {
        set(
          state.screenConfiguration.screenConfig["checkavailability_pcc"],
          "components.div.children.availabilityMediaCardWrapper.visible",
          false
        );
        set(
          state.screenConfiguration.screenConfig["checkavailability_pcc"],
          "components.div.children.availabilityTimeSlotWrapper.visible",
          false
        );
        set(
          state.screenConfiguration.screenConfig["checkavailability_pcc"],
          "components.div.children.availabilityCalendarWrapper.visible",
          false
        );

        set(
          state,
          "screenConfiguration.screenConfig.checkavailability_pcc.components.div.children.availabilitySearch.children.availabilityForm.children.cardContent.children.availabilityFields.children.bkSector.props.value",
          ""
        );

        // dispatch(
        //     handleField(
        //         "checkavailability_pcc",
        //         "components.div.children.availabilitySearch.children.availabilityForm.children.cardContent.children.availabilityFields.children.bkSector",
        //         "props.value",
        //        ""
        //     )
        // );
      },
    },

    bkSector: {
      ...getSelectField({
        label: {
          labelName: "Locality",
          labelKey: "BK_PCC_BOOKING_LOCALITY_LABEL",
        },

        placeholder: {
          labelName: "Locality",
          labelKey: "BK_PCC_BOOKING_LOCALITY_PLACEHOLDER",
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
      beforeFieldChange: async (action, state, dispatch) => {
        if (action.value) {
          let availabilityCheckData = get(
            state,
            "screenConfiguration.preparedFinalObject.availabilityCheckData"
          );

          let bkBookingType =
            availabilityCheckData !== undefined
              ? availabilityCheckData.bkBookingType
              : "Parks";

          dispatch(
            prepareFinalObject(
              "availabilityCheckData.bkBookingType",
              bkBookingType
            )
          );
          dispatch(prepareFinalObject("Booking.bkBookingType", bkBookingType));


          // set(
          //     state.screenConfiguration.screenConfig[
          //     "checkavailability_pcc"
          //     ],
          //     "components.div.children.availabilityCalendarWrapper.visible",
          //     availabilityCheckData !== undefined && "bkBookingVenue" in availabilityCheckData ? true : false
          // );
          // set(
          //     state.screenConfiguration.screenConfig[
          //     "checkavailability_pcc"
          //     ],
          //     "components.div.children.availabilityTimeSlotWrapper.visible",
          //     bkBookingType === "Parks" ? false : true
          // );
          set(
            state.screenConfiguration.screenConfig["checkavailability_pcc"],
            "components.div.children.availabilityCalendarWrapper.visible",
            false
          );
          set(
            state.screenConfiguration.screenConfig["checkavailability_pcc"],
            "components.div.children.availabilityTimeSlotWrapper.visible",
            false
          );
          // set(
          //     state.screenConfiguration.screenConfig[
          //     "checkavailability_pcc"
          //     ],
          //     "components.div.children.availabilityCalendarWrapper.visible",
          //     bkBookingType === "Parks" ? true : false
          // );

          let requestBody = {
            venueType: bkBookingType,
            sector: action.value,
          };
          let response = await getMasterDataPCC(requestBody);

          let responseStatus = get(response, "status", "");

          if (responseStatus == "SUCCESS" || responseStatus == "success") {
            let newResponse = response.data.map((el) => {
              let bkDuration =
                el.bookingAllowedFor === "" ? "FULLDAY" : "HOURLY";
              let newObj = { ...el, bkDuration };
              return newObj;
            });
            if (response.data.length > 0) {
              set(
                state.screenConfiguration.screenConfig["checkavailability_pcc"],
                "components.div.children.availabilityMediaCardWrapper.visible",
                true
              );
              dispatch(prepareFinalObject("masterData", newResponse));
            } else {
              set(
                state.screenConfiguration.screenConfig["checkavailability_pcc"],
                "components.div.children.availabilityMediaCardWrapper.visible",
                false
              );
              let warrningMsg = {
                labelName: "No data found. Please select other sector/area",
                labelKey: "", //UPLOAD_FILE_TOAST
              };
              dispatch(toggleSnackbar(true, warrningMsg, "warning"));
            }
          } else {
            let errorMessage = {
              labelName: "Something went wrong, Try Again later!",
              labelKey: "", //UPLOAD_FILE_TOAST
            };
            dispatch(toggleSnackbar(true, errorMessage, "error"));
          }
        }
      },
    },
    // bkFromDate: {
    //     ...getDateField({
    //         label: {
    //             labelName: "Booking Date",
    //             labelKey: "BK_PCC_FROM_DATE_LABEL",
    //         },
    //         placeholder: {
    //             labelName: "Booking Data",
    //             labelName: "BK_PCC_FROM_DATE_PLACEHOLDER",
    //         },
    //         // required: true,
    //         pattern: getPattern("Date"),
    //         jsonPath: "Booking.bkFromDate",
    //         errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
    //         props: {
    //             className: "applicant-details-error",
    //             inputProps: {
    //                 min: getTodaysDateInYMD(),
    //                 max: getFinancialYearDates("yyyy-mm-dd").endDate,
    //             },
    //         },
    //         gridDefination: {
    //             xs: 12,
    //             sm: 6,
    //             md: 6,
    //         },
    //     }),
    // },
    // bkToDate: {
    //     ...getDateField({
    //         label: {
    //             labelName: "Booking Date",
    //             labelKey: "BK_PCC_TO_DATE_LABEL",
    //         },
    //         placeholder: {
    //             labelName: "Booking Data",
    //             labelName: "BK_PCC_TO_DATE_PLACEHOLDER",
    //         },
    //         // required: true,
    //         pattern: getPattern("Date"),
    //         jsonPath: "Booking.bkToDate",
    //         errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
    //         props: {
    //             className: "applicant-details-error",
    //             inputProps: {
    //                 min: getTodaysDateInYMD(),
    //                 max: getFinancialYearDates("yyyy-mm-dd").endDate,
    //             },
    //         },
    //         gridDefination: {
    //             xs: 12,
    //             sm: 6,
    //             md: 6,
    //         },
    //     }),
    // },
  }),
  // availabilityActions: getCommonContainer({
  //     searchButton: {
  //         componentPath: "Button",
  //         props: {
  //             variant: "contained",
  //             color: "primary",
  //             style: {
  //                 minWidth: "200px",
  //                 height: "48px",
  //                 // marginRight: "16px",
  //             },
  //         },

  //         children: {
  //             submitButtonLabel: getLabel({
  //                 labelName: "Check Availability",
  //                 labelKey: "BK_OSWMCC_CHECK_AVAILABILITY_LABEL",
  //             }),
  //         },
  //         onClickDefination: {
  //             action: "condition",
  //             callBack: callBackForSearch,
  //         },
  //         visible: true,
  //     },
  //     resetButton: {
  //         componentPath: "Button",
  //         props: {
  //             variant: "outlined",
  //             color: "primary",
  //             style: {
  //                 minWidth: "200px",
  //                 height: "48px",
  //                 // marginRight: "16px",
  //                 marginLeft: "16px",
  //             },
  //         },

  //         children: {
  //             resetButtonLabel: getLabel({
  //                 labelName: "Reset",
  //                 labelKey: "BK_OSWMCC_BOOKING_CHECK_RESET_LABEL",
  //             }),
  //         },
  //         onClickDefination: {
  //             action: "condition",
  //             callBack: callBackForReset,
  //         },
  //         visible: true,
  //     },
  //     viewDetailsButton: {
  //         componentPath: "Button",
  //         props: {
  //             // variant: "outlined",
  //             color: "primary",
  //             style: {
  //                 minWidth: "200px",
  //                 height: "48px",
  //                 // marginRight: "16px",
  //                 marginLeft: "16px",
  //             },
  //         },
  //         children: {
  //             viewIcon: {
  //                 uiFramework: "custom-atoms",
  //                 componentPath: "Icon",
  //                 props: {
  //                     iconName: "remove_red_eye",
  //                 },
  //             },
  //             buttonLabel: getLabel({
  //                 labelName: "View Details",
  //                 labelKey: "View Details",
  //             }),
  //         },
  //         onClickDefination: {
  //             action: "condition",
  //             callBack: callBackForVenue,
  //         },
  //         visible: false,
  //     },
  // }),
});

export const availabilityMediaCard = getCommonCard({
  availabilityMedia: getCommonContainer({
    bookingCalendar: {
      uiFramework: "custom-containers-local",
      moduleName: "egov-services",
      componentPath: "BookingMediaContainer",
      gridDefination: {
        xs: 12,
        sm: 12,
        md: 12,
      },
    },
  }),
});
export const availabilityTimeSlot = getCommonCard({
  header: {
    uiFramework: "custom-atoms",
    componentPath: "Container",
    props: {
      style: { marginBottom: "10px", color: "#FE7A51" },
    },
    children: {
      header: {
        gridDefination: {
          xs: 12,
          sm: 12,
          md: 12,
        },
        ...getCommonHeader({
          labelName: "Select your booking time in below Timeslot Calendar",
          labelKey: "PACC_TIMESLOT_CALENDAR_HEADER_MSG",

          // style: { color: "#FE7A51" },
        }),
      },
    },
  },
  availabilityMedia: getCommonContainer({
    bookingCalendar: {
      uiFramework: "custom-molecules-local",
      moduleName: "egov-services",
      componentPath: "BookingTimeSlot",
      gridDefination: {
        xs: 12,
        sm: 12,
        md: 12,
      },
    },
    selectedTimeSlotInfo: {
      uiFramework: "custom-molecules-local",
      moduleName: "egov-services",
      componentPath: "SelectedTimeSlotInfo",
      gridDefination: {
        xs: 12,
        sm: 12,
        md: 12,
      },
    },
    actionButtons: {
      uiFramework: "custom-atoms",
      componentPath: "Container",
      gridDefination: {
        xs: 12,
      },
      props: {
        style: {
          justifyContent: "flex-end",
        },
      },
      children: {
        resetButton: {
          componentPath: "Button",
          props: {
            variant: "outlined",
            color: "primary",
            style: {
              minWidth: "200px",
              height: "48px",
              marginTop: "10px",
              marginRight: "16px",
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
            callBack: callBackForBookTimeSlot,
          },
          visible: true,
        },
      },
    },
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
        venueDataKey: "bkLocation",
      },
      children: {
        popup: {},
      },
    },
    actionButtons: {
      uiFramework: "custom-atoms",
      componentPath: "Container",
      gridDefination: {
        xs: 12,
      },
      props: {
        style: {
          justifyContent: "flex-end",
        },
      },
      children: {
        resetButton: {
          componentPath: "Button",
          props: {
            variant: "outlined",
            color: "primary",
            style: {
              minWidth: "200px",
              height: "48px",
              marginTop: "10px",
              marginRight: "16px",
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
      },
    },
  }),
});
