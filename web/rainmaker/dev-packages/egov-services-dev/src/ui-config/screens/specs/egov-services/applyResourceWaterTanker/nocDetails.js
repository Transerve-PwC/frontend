import {
    getCommonCard,
    getCommonContainer,
    getTextField,
    getDateField,
    getTimeField,
    getSelectField,
    getPattern,
} from "egov-ui-framework/ui-config/screens/specs/utils";
import {
    handleScreenConfigurationFieldChange as handleField,
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import get from "lodash/get";
import { getTodaysDateInYMD, getFinancialYearDates } from "../../utils";
import set from "lodash/set";
export const personalDetails = getCommonCard({
    // header: getCommonTitle(
    //   {
    //     labelName: "Applicant Details",
    //     labelKey: "BK_WTB_DETAILS_HEADER",
    //   },
    //   {
    //     style: {
    //       marginBottom: 10,
    //     },
    //   }
    // ),
    // break: getBreak(),
    personalDetailsContainer: getCommonContainer({
        bkApplicantName: {
            ...getTextField({
                label: {
                    labelName: "Applicant Name",
                    labelKey: "BK_WTB_NAME_LABEL",
                },
                placeholder: {
                    labelName: "Enter Applicant Name",
                    labelKey: "BK_WTB_NAME_PLACEHOLDER",
                },
                required: true,
                pattern: getPattern("Name"),
                errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
                jsonPath: "Booking.bkApplicantName",
            }),
        },
        bkEmail: {
            ...getTextField({
                label: {
                    labelName: "Email Address",
                    labelKey: "BK_WTB_EMAIL_LABEL",
                },
                placeholder: {
                    labelName: "Enter Email Address",
                    labelKey: "BK_WTB_EMAIL_PLACEHOLDER",
                },
                required: false,
                pattern: getPattern("Email"),
                errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
                jsonPath: "Booking.bkEmail",
            }),
        },
        bkMobileNumber: {
            ...getTextField({
                label: {
                    labelName: "Contact Number",
                    labelKey: "BK_WTB_MOBILE_NO_LABEL",
                },
                placeholder: {
                    labelName: "Enter Contact Number",
                    labelKey: "BK_WTB_MOBILE_NO_PLACEHOLDER",
                },
                required: true,
                pattern: getPattern("MobileNo"),
                errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
                jsonPath: "Booking.bkMobileNumber",
            }),
        },
        dummyDiv: {
            uiFramework: "custom-atoms",
            componentPath: "Div",
            gridDefination: {
                xs: 12,
                sm: 12,
                md: 6,
            },
            props: {
                disabled: true,
            },
        },
    }),
});
export const bookingDetails = getCommonCard({
    // header: getCommonTitle(
    //     {
    //         labelName: "Booking Details",
    //         labelKey: "BK_WTB_DETAILS_HEADER",
    //     },
    //     {
    //         style: {
    //             marginBottom: 10,
    //         },
    //     }
    // ),
    // break: getBreak(),
    bookingDetailsContainer: getCommonContainer({
        bkHouseNo: {
            ...getTextField({
                label: {
                    labelName: "House/Site No.",
                    labelKey: "BK_WTB_HOUSE_NUMBER_LABEL",
                },
                placeholder: {
                    labelName: "Enter House No",
                    labelKey: "BK_WTB_HOUSE_NUMBER_PLACEHOLDER",
                },
                pattern: getPattern("DoorHouseNo"),
                errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
                required: true,
                jsonPath: "Booking.bkHouseNo",
            }),
        },
        bkCompleteAddress: {
            ...getTextField({
                label: {
                    labelName: "Complete Address",
                    labelKey: "BK_WTB_COMPLETE_ADDRESS_LABEL",
                },
                placeholder: {
                    labelName: "Enter Complete Address",
                    labelKey: "BK_WTB_COMPLETE_ADDRESS_PLACEHOLDER",
                },
                errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
                required: true,
                jsonPath: "Booking.bkCompleteAddress",
                maxLength: 500,
            }),
        },
        bkSector: {
            ...getSelectField({
                label: {
                    labelName: "Sector",
                    labelKey: "BK_WTB_PROPERTY_SECTOR_LABEL",
                },
                optionLabel: "name",
                placeholder: {
                    labelName: "Select Sector",
                    labelKey: "BK_WTB_PROPERTY_SECTOR_PLACEHOLDER",
                },
                sourceJsonPath: "applyScreenMdmsData.Booking.Sector",
                jsonPath: "Booking.bkSector",
                errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
                required: true,
                props: {
                    // className: "applicant-details-error",
                    required: true,
                    // disabled: true
                },
            }),
        },
        bkType: {
            ...getSelectField({
                label: {
                    labelName: "Residential/Commercial",
                    labelKey: "BK_WTB_PROPERTY_TYPE_LABEL",
                },
                placeholder: {
                    labelName: "Select Residential/Commercial",
                    labelKey: "BK_WTB_PROPERTY_TYPE_PLACEHOLDER",
                },

                sourceJsonPath: "applyScreenMdmsData.Booking.CityType",
                jsonPath: "Booking.bkType",
                errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
                required: true,
                props: {
                    // className: "applicant-details-error",
                    required: true,
                    // disabled: true
                },
            }),
        },
        bkStatus: {
            ...getSelectField({
                label: {
                    labelName: "Type of Request",
                    labelKey: "BK_WTB_CASE_LABEL",
                },
                placeholder: {
                    labelName: "Type of Request",
                    labelKey: "BK_WTB_CASE_PLACEHOLDER",
                },
                // required: true,
                pattern: getPattern("typeOfRequest"),
                jsonPath: "Booking.bkStatus",
                sourceJsonPath: "applyScreenMdmsData.Booking.TypesofRequest",
                errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
                required: true,
                props: {
                    required: true,
                    // className: "applicant-details-error",
                },
                gridDefination: {
                    xs: 12,
                    sm: 6,
                    md: 6,
                },
            }),
            // visible: true,
            beforeFieldChange: (action, state, dispatch) => {
                const bkDate = get(
                    state,
                    "screenConfiguration.preparedFinalObject.Booking.bkDate"
                );
                const bkTime = get(
                    state,
                    "screenConfiguration.preparedFinalObject.Booking.bkTime"
                );
                dispatch(
                    handleField(
                        "applywatertanker",
                        "components.div.children.formwizardSecondStep.children.bookingDetails.children.cardContent.children.bookingDetailsContainer.children.bkDate",
                        "visible",
                        action.value.includes("Paid") ? true : false
                    )
                );
                dispatch(
                    handleField(
                        "applywatertanker",
                        "components.div.children.formwizardSecondStep.children.bookingDetails.children.cardContent.children.bookingDetailsContainer.children.bkTime",
                        "visible",
                        action.value.includes("Paid") ? true : false
                    )
                );
                dispatch(
                    handleField(
                        "applywatertanker",
                        "components.div.children.formwizardSecondStep.children.bookingDetails.children.cardContent.children.bookingDetailsContainer.children.bkDate",
                        "props.value",
                        action.value.includes("Paid") ? ((bkDate === undefined || bkDate === "") ? "" : bkDate) : ""
                    )
                );
                dispatch(
                    handleField(
                        "applywatertanker",
                        "components.div.children.formwizardSecondStep.children.bookingDetails.children.cardContent.children.bookingDetailsContainer.children.bkTime",
                        "props.value",
                        action.value.includes("Paid") ? ((bkTime === undefined || bkTime === "") ? "00:00" : bkTime) : ""
                    )
                );
                // dispatch(
                //     handleField(
                //         "applywatertanker",
                //         "components.div.children.formwizardThirdStep.children.summaryDetails.children.cardContent.children.div.children.waterTankerSummary.children.cardContent.children.cardOne.props.scheama.children.cardContent.children.applicantContainer.children.BookingDate",
                //         "visible",
                //         action.value.includes("Paid") ? true : false
                //     ));
                // dispatch(
                //     handleField(
                //         "applywatertanker",
                //         "components.div.children.formwizardThirdStep.children.summaryDetails.children.cardContent.children.div.children.waterTankerSummary.children.cardContent.children.cardOne.props.scheama.children.cardContent.children.applicantContainer.children.BookingTime",
                //         "visible",
                //         action.value.includes("Paid") ? true : false
                //     ));

            },
        },
        bkDate: {
            ...getDateField({
                label: {
                    labelName: "Booking Date",
                    labelKey: "BK_WTB_DATE_LABEL",
                },
                placeholder: {
                    labelName: "Booking Data",
                    labelName: "BK_WTB_DATE_PLACEHOLDER",
                },
                // required: true,
                pattern: getPattern("Date"),
                jsonPath: "Booking.bkDate",
                errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
                props: {
                    className: "applicant-details-error",
                    inputProps: {
                        min: getTodaysDateInYMD(),
                        max: getFinancialYearDates("yyyy-mm-dd").endDate,
                    },
                },
                gridDefination: {
                    xs: 12,
                    sm: 6,
                    md: 6,
                },
            }),
            visible: false,
        },
        bkTime: {
            ...getTimeField({
                label: {
                    labelName: "Booking Time",
                    labelKey: "BK_WTB_TIME_LABEL",
                },
                placeholder: { labelName: "hh:mm", labelKey: "hh:mm" },
                // required: true,
                pattern: getPattern("Time"),
                errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
                jsonPath: "Booking.bkTime",
                gridDefination: {
                    xs: 12,
                    sm: 6,
                    md: 6,
                },
                props: {
                    defaultValue: "00:00",
                },
            }),
            visible: false,
        },

        dummyDiv: {
            uiFramework: "custom-atoms",
            componentPath: "Div",
            gridDefination: {
                xs: 12,
                sm: 12,
                md: 6,
            },
            props: {
                disabled: true,
            },
        },
    }),
});
