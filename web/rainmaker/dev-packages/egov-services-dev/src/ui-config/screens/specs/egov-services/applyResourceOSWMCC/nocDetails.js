import {
    getBreak,
    getCommonCard,
    getCommonContainer,
    getCommonTitle,
    getTextField,
    getSelectField,
    getPattern,
    getRadioButton,
} from "egov-ui-framework/ui-config/screens/specs/utils";

import {
    handleScreenConfigurationFieldChange as handleField,
    prepareFinalObject,
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import get from "lodash/get";
import set from "lodash/set";
import { toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import {
    furnishNocResponse,
    getSearchResults,
} from "../../../../../ui-utils/commons";
import {
    getPerDayRateOSWMCC
} from "../../../../screens/specs/utils";
import { perDayRateSummary } from "../summaryResource/perDayRateSummaryLocationOSWMCC";
export const personalDetails = getCommonCard({

    personalDetailsContainer: getCommonContainer({
        applicantName: {
            ...getTextField({
                label: {
                    labelName: "Applicant Name",
                    labelKey: "BK_OSWMCC_NEW_LOC_NAME_LABEL",
                },
                placeholder: {
                    labelName: "Enter Applicant Name",
                    labelKey: "BK_OSWMCC_NEW_LOC_NAME_PLACEHOLDER",
                },
                required: true,
                pattern: getPattern("Name"),
                errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
                jsonPath: "Booking.applicantName",
            }),
        },
        mailAddress: {
            ...getTextField({
                label: {
                    labelName: "Email Address",
                    labelKey: "BK_OSWMCC_NEW_LOC_EMAIL_LABEL",
                },
                placeholder: {
                    labelName: "Enter Email Address",
                    labelKey: "BK_OSWMCC_NEW_LOC_EMAIL_PLACEHOLDER",
                },
                required: true,
                pattern: getPattern("Email"),
                errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
                requiredMessage: "required Message",
                jsonPath: "Booking.mailAddress",
                props: {
                    required: true,
                },
            }),
        },
        contact: {
            ...getTextField({
                label: {
                    labelName: "Contact Number",
                    labelKey: "BK_OSWMCC_NEW_LOC_MOBILE_NO_LABEL",
                },
                placeholder: {
                    labelName: "Enter Contact Number",
                    labelKey: "BK_OSWMCC_NEW_LOC_MOBILE_NO_PLACEHOLDER",
                },
                required: true,
                pattern: getPattern("MobileNo"),
                errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
                jsonPath: "Booking.contact",
            }),
        },

        applicantAddress: {
            ...getTextField({
                label: {
                    labelName: "Address",
                    labelKey: "BK_OSWMCC_NEW_LOC_ADDRESS_LABEL",
                },
                placeholder: {
                    labelName: "Enter Address",
                    labelKey: "BK_OSWMCC_NEW_LOC_ADDRESS_PLACEHOLDER",
                },
                pattern: getPattern("Address"),
                errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
                required: true,
                jsonPath: "Booking.applicantAddress",
                maxLength: 500,
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
    applicationDetailsConatiner: getCommonContainer({
        sector: {
            ...getSelectField({
                label: {
                    labelName: "Locality",
                    labelKey: "BK_OSWMCC_LOC_SECTOR_LABEL",
                },
                optionLabel: "name",
                placeholder: {
                    labelName: "Select Locality",
                    labelKey: "BK_OSWMCC_LOC_SECTOR_PLACEHOLDER",
                },

                sourceJsonPath: "applyScreenMdmsData.Booking.Sector",
                jsonPath: "Booking.sector",
                required: true,
                requiredMessage: "required Message",
                props: {
                    className: "applicant-details-error",
                    required: true,
                    // disabled: true
                },
            }),
        },
        localityAddress: {
            ...getTextField({
                label: {
                    labelName: "Location Address",
                    labelKey: "BK_OSWMCC_LOC_ADDRESS_LABEL",
                },
                placeholder: {
                    labelName: "Enter Location Address",
                    labelKey: "BK_OSWMCC_LOC_ADDRESS_PLACEHOLDER",
                },
                pattern: getPattern("Address"),
                errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
                required: true,
                jsonPath: "Booking.localityAddress",
                maxLength: 500,
            }),
        },

        landmark: {
            ...getTextField({
                label: {
                    labelName: "Location Landmark",
                    labelKey: "BK_OSWMCC_LOC_LANDMARK_LABEL",
                },
                placeholder: {
                    labelName: "Enter Landmark",
                    labelKey: "BK_OSWMCC_LOC_LANDMARK_PLACEHOLDER",
                },
                pattern: getPattern("Address"),
                errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
                // helperText : "new helper outside",
                required: true,
                jsonPath: "Booking.landmark",
                props: {
                    required: true,
                    helperText: "custom helper text",
                },
            }),
        },
        areaRequirement: {
            ...getTextField({
                label: {
                    labelName: "Area requirement (in Feet)",
                    labelKey: "BK_OSWMCC_LOC_AREA_REQUIRED_LABEL",
                },
                placeholder: {
                    labelName: "Area requirement",
                    labelKey: "BK_OSWMCC_LOC_AREA_REQUIRED_PLACEHOLDER",
                },
                pattern: getPattern("areaRequired"),
                errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
                // helperText : "new helper outside",
                required: true,
                maxLength: 3,
                
                jsonPath: "Booking.areaRequirement",
                props: {
                    required: true,
                    helperText: "custom helper text",

                },
            }),
            beforeFieldChange: async (action, state, dispatch) => {
                if (action.value) {

                    const sector = get(
                        state,
                        "screenConfiguration.preparedFinalObject.Booking.sector"
                    );

                    let response = await getPerDayRateOSWMCC(
                        sector,
                        action.value
                    );
                    let responseStatus = get(response, "status", "");
                    if (
                        responseStatus == "SUCCESS" ||
                        responseStatus == "success"
                    ) {
                        set(
                            state.screenConfiguration.screenConfig["applyNewLocationUnderMCC"],
                            "components.div.children.formwizardSecondStep.children.bookingDetails.children.cardContent.children.applicationDetailsConatiner.children.venuebasedSummary.visible",
                            true
                        );

                        response.data.displayArea = response.data.areaFrom + " - " + response.data.areaTo;
                        dispatch(
                            prepareFinalObject("perDayRate", response.data)
                        );
                    } else {
                        let errorMessage = {
                            labelName:
                                "Area cannot be more than 1000 square feet",
                            labelKey: "", //UPLOAD_FILE_TOAST
                        };
                        dispatch(
                            toggleSnackbar(
                                true,
                                errorMessage,
                                "warning"
                            )
                        );
                }
            }
            
            }
        },
        venuebasedSummary: {
            uiFramework: "custom-atoms",
            componentPath: "Card",
            props: {
                style: {
                    width: "100%",
                    margin: "24px 0 0",
                    backgroundColor: "#fff",
                    padding: "0 24px 24px",

                },
            },
            children: {
                perDayRateSummary,

            },
            visible: false,
        }



    }),
});
