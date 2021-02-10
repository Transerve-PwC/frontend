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
import { toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import {
    furnishNocResponse,
    getSearchResults,
} from "../../../../../ui-utils/commons";

export const personalDetails = getCommonCard({
    // header: getCommonTitle(
    //   {
    //     labelName: "Applicant Details",
    //     labelKey: "BK_OSB_HEADER_STEP_1",
    //   },
    //   {
    //     style: {
    //       marginBottom: 18,
    //     },
    //   }
    // ),
    // break: getBreak(),
    personalDetailsContainer: getCommonContainer({
        bkApplicantName: {
            ...getTextField({
                label: {
                    labelName: "Applicant Name",
                    labelKey: "BK_OSB_NAME_LABEL",
                },
                placeholder: {
                    labelName: "Enter Applicant Name",
                    labelKey: "BK_OSB_NAME_PLACEHOLDER",
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
                    labelKey: "BK_OSB_EMAIL_LABEL",
                },
                placeholder: {
                    labelName: "Enter Email Address",
                    labelKey: "BK_OSB_EMAIL_PLACEHOLDER",
                },
                required: true,
                pattern: getPattern("Email"),
                errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
                requiredMessage: "required Message",
                jsonPath: "Booking.bkEmail",
                props: {
                    required: true,
                },
            }),
        },
        bkMobileNumber: {
            ...getTextField({
                label: {
                    labelName: "Contact Number",
                    labelKey: "BK_OSB_MOBILE_NO_LABEL",
                },
                placeholder: {
                    labelName: "Enter Contact Number",
                    labelKey: "BK_OSB_MOBILE_NO_PLACEHOLDER",
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
    //   {
    //     labelName: "Applicant Details",
    //     labelKey: "BK_OSB_HEADER_STEP_2",
    //   },
    //   {
    //     style: {
    //       marginBottom: 18,
    //     },
    //   }
    // ),

    applicationDetailsConatiner: getCommonContainer({
        bkHouseNo: {
            ...getTextField({
                label: {
                    labelName: "House/Site No.",
                    labelKey: "BK_OSB_HOUSE_NUMBER_LABEL",
                },
                placeholder: {
                    labelName: "Enter House No",
                    labelKey: "BK_OSB_HOUSE_NUMBER_PLACEHOLDER",
                },
                pattern: getPattern("DoorHouseNo"),
                errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
                required: true,
                jsonPath: "Booking.bkHouseNo",
                props: {
                    required: true,
                    helperText: "custom helper text",
                },
            }),
        },
        bkCompleteAddress: {
            ...getTextField({
                label: {
                    labelName: "Complete Address",
                    labelKey: "BK_OSB_COMPLETE_ADDRESS_LABEL",
                },
                placeholder: {
                    labelName: "Enter Complete Address",
                    labelKey: "BK_OSB_COMPLETE_ADDRESS_PLACEHOLDER",
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
                    labelKey: "BK_OSB_PROPERTY_SECTOR_LABEL",
                },
                optionLabel: "name",
                placeholder: {
                    labelName: "Select Sector",
                    labelKey: "BK_OSB_PROPERTY_SECTOR_PLACEHOLDER",
                },
                sourceJsonPath: "applyScreenMdmsData.Booking.Sector",
                jsonPath: "Booking.bkSector",
                required: true,
                requiredMessage: "required Message",
                props: {
                    className: "applicant-details-error",
                    required: true,
                    // disabled: true
                },
            }),
        },
        bkAreaRequired: {
            ...getSelectField({
                label: {
                    labelName: "Storage Area",
                    labelKey: "BK_OSB_STORAGE_AREA_LABEL",
                },
                optionLabel: "name",
                placeholder: {
                    labelName: "Select Storage Area",
                    labelKey: "BK_OSB_STORAGE_AREA_PLACEHOLDER",
                },
                sourceJsonPath: "applyScreenMdmsData.Booking.Area",
                jsonPath: "Booking.bkAreaRequired",
                required: true,
                props: {
                    className: "applicant-details-error",
                    required: true,
                    // disabled: true
                },
            }),
        },
        bkVillCity: {
            ...getSelectField({
                label: {
                    labelName: "Village/City",
                    labelKey: "BK_OSB_CITY_LABEL",
                },
                optionLabel: "name",
                placeholder: {
                    labelName: "Select Village/City",
                    labelKey: "BK_OSB_CITY_PLACEHOLDER",
                },
                sourceJsonPath: "applyScreenMdmsData.Booking.VillageCity",
                jsonPath: "Booking.bkVillCity",
                required: true,
                props: {
                    className: "applicant-details-error",
                    required: true,
                    // disabled: true
                },
            }),
        },
        bkConstructionType: {
            ...getSelectField({
                label: {
                    labelName: "Construction Type",
                    labelKey: "BK_OSB_CONSTRUCTION_TYPE_LABEL",
                },
                // localePrefix: {
                //   moduleName: "egpm",
                //   masterName: "sector"
                // },
                optionLabel: "name",
                placeholder: {
                    labelName: "Select Construction Type",
                    labelKey: "BK_OSB_CONSTRUCTION_TYPE_PLACEHOLDER",
                },
                //sourceJsonPath: "applyScreenMdmsData.egpm.sector",
                sourceJsonPath:
                    "applyScreenMdmsData.Booking.Type_of_Construction",
                jsonPath: "Booking.bkConstructionType",
                required: true,
                props: {
                    className: "applicant-details-error",
                    required: true,
                    // disabled: true
                },
            }),
            beforeFieldChange: (action, state, dispatch) => {
                const bkDuration = get(
                    state,
                    "screenConfiguration.preparedFinalObject.Booking.bkDuration"
                );
                dispatch(
                    handleField(
                        "applyopenspace",
                        "components.div.children.formwizardSecondStep.children.bookingDetails.children.cardContent.children.applicationDetailsConatiner.children.bkDuration",
                        "visible",
                        action.value !== "" || action.value !== null
                            ? true
                            : false
                    )
                );
                dispatch(
                    handleField(
                        "applyopenspace",
                        "components.div.children.formwizardSecondStep.children.bookingDetails.children.cardContent.children.applicationDetailsConatiner.children.bkDuration",
                        "props.value",
                        action.value === "New" ? "6" : (bkDuration === "" || bkDuration === undefined ||  bkDuration === "6") ? "1" : bkDuration
                    )
                );
                dispatch(
                    handleField(
                        "applyopenspace",
                        "components.div.children.formwizardSecondStep.children.bookingDetails.children.cardContent.children.applicationDetailsConatiner.children.bkDuration",
                        "props.disabled",
                        action.value === "New" ? true : false
                    )
                );
            },
        },
        bkType: {
            ...getSelectField({
                label: {
                    labelName: "Residential/Commercial",
                    labelKey: "BK_OSB_PROPERTY_TYPE_LABEL",
                },
                placeholder: {
                    labelName: "Select Residential/Commercial",
                    labelKey: "BK_OSB_PROPERTY_TYPE_PLACEHOLDER",
                },
                sourceJsonPath: "applyScreenMdmsData.Booking.CityType",
                jsonPath: "Booking.bkType",
                required: true,
                props: {
                    className: "applicant-details-error",
                    required: true,
                    // disabled: true
                },
            }),
            beforeFieldChange: (action, state, dispatch) => {

                const bkCategory = get(
                    state,
                    "screenConfiguration.preparedFinalObject.Booking.bkCategory"
                );

                dispatch(
                    handleField(
                        "applyopenspace",
                        "components.div.children.formwizardSecondStep.children.bookingDetails.children.cardContent.children.applicationDetailsConatiner.children.bkCategory",
                        "visible",
                        action.value !== "" || action.value !== null
                            ? true
                            : false
                    )
                );
                dispatch(
                    handleField(
                        "applyopenspace",
                        "components.div.children.formwizardSecondStep.children.bookingDetails.children.cardContent.children.applicationDetailsConatiner.children.bkCategory",
                        "props.value",
                        action.value === "Residential" ? "Cat-A" : (bkCategory === "" || bkCategory === undefined ||  bkCategory === "Cat-A") ? "Cat-B" : bkCategory
                    )
                );
                dispatch(
                    handleField(
                        "applyopenspace",
                        "components.div.children.formwizardSecondStep.children.bookingDetails.children.cardContent.children.applicationDetailsConatiner.children.bkCategory",
                        "props.buttons",
                        action.value === "Residential"
                            ? [
                                  {
                                      labelName: "Cat-A",
                                      labelKey: "Cat-A",
                                      value: "Cat-A",
                                  },
                              ]
                            : [
                                  {
                                      label: "Cat-B",
                                      labelKey: "Cat-B",
                                      value: "Cat-B",
                                  },
                                  {
                                      label: "Cat-C",
                                      labelKey: "Cat-C",
                                      value: "Cat-C",
                                  },
                              ]
                    )
                );
            },
        },
        bkDuration: {
            ...getSelectField({
                label: {
                    labelName: "Duration",
                    labelKey: "BK_OSB_DURATION_LABEL",
                },
                optionLabel: "name",
                placeholder: {
                    labelName: "Select Duration",
                    labelKey: "BK_OSB_DURATION_PLACEHOLDER",
                },
                sourceJsonPath: "applyScreenMdmsData.Booking.Duration",
                jsonPath: "Booking.bkDuration",
                required: true,
                props: {
                    className: "applicant-details-error",
                    required: true,
                    // disabled: true
                },
            }),
            visible: false,
        },
        bkCategory: {
            uiFramework: "custom-containers-local",
            componentPath: "RadioGroupWithIconContainer",
            moduleName: "egov-services",
            gridDefination: {
                xs: 12,
                sm: 12,
                md: 6,
            },
            jsonPath: "Booking.bkCategory",
            props: {
                label: {
                    name: "Category",
                    key: "BK_OSB_CATEGORY_LABEL",
                },
                buttons: [
                    {
                        labelName: "Cat-A",
                        labelKey: "Cat-A",
                        value: "Cat-A",
                    },
                    {
                        label: "Cat-B",
                        labelKey: "Cat-B",
                        value: "Cat-B",
                    },
                    {
                        label: "Cat-C",
                        labelKey: "Cat-C",
                        value: "Cat-C",
                    },
                ],
                jsonPath: "Booking.bkCategory",
                required: true,
            },
            required: true,
            type: "array",
            visible: false,
        },
    }),
});
