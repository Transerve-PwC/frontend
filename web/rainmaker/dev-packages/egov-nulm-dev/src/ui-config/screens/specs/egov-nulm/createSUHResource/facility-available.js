import {
    getCommonCard,
    getCommonTitle,
    getTextField,
    getDateField,
    getSelectField,
    getCommonContainer,
    getPattern
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { getTodaysDateInYMD } from "../../utils";

export const facilityDetails = getCommonCard({
    header: getCommonTitle(
        {
            labelName: "Facilities Available",
            labelKey: "NULM_SUH_FACILITIES_AVAILABLE"
        },
        {
            style: {
                marginBottom: 18
            }
        }
    ),
    facilityDetailsContainer: getCommonContainer({
        isBedding: {
            uiFramework: "custom-containers",
            componentPath: "RadioGroupContainer",
            gridDefination: {
                xs: 6
            },
            jsonPath: "NulmSuhRequest.suhFacilitiesDetails[0].isBedding",
            type: "array",
            props: {
                jsonPath: "NulmSuhRequest.suhFacilitiesDetails[0].isBedding",
                label: { name: "Bedding", key: "NULM_SUH_BEDDING" },
                buttons: [
                    {
                        labelName: "Yes",
                        labelKey: "NULM_SEP_YES",
                        value: "Yes",
                    },
                    {
                        label: "No",
                        labelKey: "NULM_SEP_NO",
                        value: "No",
                    },
                ],
                defaultValue: "No"
            },
            type: "array",
        },
        beddingRemark: {
            ...getTextField({
                label: {
                    labelName: "Remarks",
                    labelKey: "NULM_SUH_REMARKS"
                },
                placeholder: {
                    labelName: "Enter Remarks",
                    labelKey: "NULM_SUH_REMARKS_PLACEHOLDER"
                },
                pattern: getPattern("Address") || null,
                jsonPath: "NulmSuhRequest.suhFacilitiesDetails[0].beddingRemark"
            })
        },
        isWashingOfLinen: {
            uiFramework: "custom-containers",
            componentPath: "RadioGroupContainer",
            gridDefination: {
                xs: 6
            },
            jsonPath: "NulmSuhRequest.suhFacilitiesDetails[0].isWashingOfLinen",
            type: "array",
            props: {
                jsonPath: "NulmSuhRequest.suhFacilitiesDetails[0].isWashingOfLinen",
                label: { name: "Washing of linen", key: "NULM_SUH_WASHING_OF_LINEN" },
                buttons: [
                    {
                        labelName: "Yes",
                        labelKey: "NULM_SEP_YES",
                        value: "Yes",
                    },
                    {
                        label: "No",
                        labelKey: "NULM_SEP_NO",
                        value: "No",
                    },
                ],
                defaultValue: "No"
            },
            type: "array",
        },
        washingOfLinenRemark: {
            ...getTextField({
                label: {
                    labelName: "Remarks",
                    labelKey: "NULM_SUH_REMARKS"
                },
                placeholder: {
                    labelName: "Enter Remarks",
                    labelKey: "NULM_SUH_REMARKS_PLACEHOLDER"
                },
                pattern: getPattern("Address") || null,
                jsonPath: "NulmSuhRequest.suhFacilitiesDetails[0].washingOfLinenRemark"
            })
        },
        isCleaningOfPremises: {
            uiFramework: "custom-containers",
            componentPath: "RadioGroupContainer",
            gridDefination: {
                xs: 6
            },
            jsonPath: "NulmSuhRequest.suhFacilitiesDetails[0].isCleaningOfPremises",
            type: "array",
            props: {
                jsonPath: "NulmSuhRequest.suhFacilitiesDetails[0].isCleaningOfPremises",
                label: { name: "Cleaning of premises on regular basis", key: "NULM_SUH_CLEANING_OF_PREMISES_ON_REGULAR_BASIS" },
                buttons: [
                    {
                        labelName: "Yes",
                        labelKey: "NULM_SEP_YES",
                        value: "Yes",
                    },
                    {
                        label: "No",
                        labelKey: "NULM_SEP_NO",
                        value: "No",
                    },
                ],
                defaultValue: "No"
            },
            type: "array",
        },
        cleaningOfPremiseRemark: {
            ...getTextField({
                label: {
                    labelName: "Remarks",
                    labelKey: "NULM_SUH_REMARKS"
                },
                placeholder: {
                    labelName: "Enter Remarks",
                    labelKey: "NULM_SUH_REMARKS_PLACEHOLDER"
                },
                pattern: getPattern("Address") || null,
                jsonPath: "NulmSuhRequest.suhFacilitiesDetails[0].cleaningOfPremiseRemark"
            })
        },
        isRecreationfacilities: {
            uiFramework: "custom-containers",
            componentPath: "RadioGroupContainer",
            gridDefination: {
                xs: 6
            },
            jsonPath: "NulmSuhRequest.suhFacilitiesDetails[0].isRecreationfacilities",
            type: "array",
            props: {
                jsonPath: "NulmSuhRequest.suhFacilitiesDetails[0].isRecreationfacilities",
                label: { name: "Recreation facilities (television, indoor sports, newspapers, books)", key: "NULM_SUH_RECREATION_FACILITIES" },
                buttons: [
                    {
                        labelName: "Yes",
                        labelKey: "NULM_SEP_YES",
                        value: "Yes",
                    },
                    {
                        label: "No",
                        labelKey: "NULM_SEP_NO",
                        value: "No",
                    },
                ],
                defaultValue: "No"
            },
            type: "array",
        },
        recreationfacilitiesRemark: {
            ...getTextField({
                label: {
                    labelName: "Remarks",
                    labelKey: "NULM_SUH_REMARKS"
                },
                placeholder: {
                    labelName: "Enter Remarks",
                    labelKey: "NULM_SUH_REMARKS_PLACEHOLDER"
                },
                pattern: getPattern("Address") || null,
                jsonPath: "NulmSuhRequest.suhFacilitiesDetails[0].recreationfacilitiesRemark"
            })
        },
        isDrinkingWater: {
            uiFramework: "custom-containers",
            componentPath: "RadioGroupContainer",
            gridDefination: {
                xs: 6
            },
            jsonPath: "NulmSuhRequest.suhFacilitiesDetails[0].isDrinkingWater",
            type: "array",
            props: {
                jsonPath: "NulmSuhRequest.suhFacilitiesDetails[0].isDrinkingWater",
                label: { name: "Drinking water fridge/camphor/dispenser", key: "NULM_SUH_DRINKING_WATER" },
                buttons: [
                    {
                        labelName: "Yes",
                        labelKey: "NULM_SEP_YES",
                        value: "Yes",
                    },
                    {
                        label: "No",
                        labelKey: "NULM_SEP_NO",
                        value: "No",
                    },
                ],
                defaultValue: "No"
            },
            type: "array",
        },
        drinkingWaterRemark: {
            ...getTextField({
                label: {
                    labelName: "Remarks",
                    labelKey: "NULM_SUH_REMARKS"
                },
                placeholder: {
                    labelName: "Enter Remarks",
                    labelKey: "NULM_SUH_REMARKS_PLACEHOLDER"
                },
                pattern: getPattern("Address") || null,
                jsonPath: "NulmSuhRequest.suhFacilitiesDetails[0].drinkingWaterRemark"
            })
        },
        isMeals: {
            uiFramework: "custom-containers",
            componentPath: "RadioGroupContainer",
            gridDefination: {
                xs: 6
            },
            jsonPath: "NulmSuhRequest.suhFacilitiesDetails[0].isMeals",
            type: "array",
            props: {
                jsonPath: "NulmSuhRequest.suhFacilitiesDetails[0].isMeals",
                label: { name: "Meals", key: "NULM_SUH_MEALS" },
                buttons: [
                    {
                        labelName: "Yes",
                        labelKey: "NULM_SEP_YES",
                        value: "Yes",
                    },
                    {
                        label: "No",
                        labelKey: "NULM_SEP_NO",
                        value: "No",
                    },
                ],
                defaultValue: "No"
            },
            type: "array",
        },
        mealsRemark: {
            ...getTextField({
                label: {
                    labelName: "Remarks",
                    labelKey: "NULM_SUH_REMARKS"
                },
                placeholder: {
                    labelName: "Enter Remarks",
                    labelKey: "NULM_SUH_REMARKS_PLACEHOLDER"
                },
                pattern: getPattern("Address") || null,
                jsonPath: "NulmSuhRequest.suhFacilitiesDetails[0].mealsRemark"
            })
        },
        isLockerForInmates: {
            uiFramework: "custom-containers",
            componentPath: "RadioGroupContainer",
            gridDefination: {
                xs: 6
            },
            jsonPath: "NulmSuhRequest.suhFacilitiesDetails[0].isLockerForInmates",
            type: "array",
            props: {
                jsonPath: "NulmSuhRequest.suhFacilitiesDetails[0].isLockerForInmates",
                label: { name: "Locker for inmates", key: "NULM_SUH_LOCKER_FOR_INMATES" },
                buttons: [
                    {
                        labelName: "Yes",
                        labelKey: "NULM_SEP_YES",
                        value: "Yes",
                    },
                    {
                        label: "No",
                        labelKey: "NULM_SEP_NO",
                        value: "No",
                    },
                ],
                defaultValue: "No"
            },
            type: "array",
        },
        lockerForInmatetRemark: {
            ...getTextField({
                label: {
                    labelName: "Remarks",
                    labelKey: "NULM_SUH_REMARKS"
                },
                placeholder: {
                    labelName: "Enter Remarks",
                    labelKey: "NULM_SUH_REMARKS_PLACEHOLDER"
                },
                pattern: getPattern("Address") || null,
                jsonPath: "NulmSuhRequest.suhFacilitiesDetails[0].lockerForInmatetRemark"
            })
        },
        isFireSafetyMeasure: {
            uiFramework: "custom-containers",
            componentPath: "RadioGroupContainer",
            gridDefination: {
                xs: 6
            },
            jsonPath: "NulmSuhRequest.suhFacilitiesDetails[0].isFireSafetyMeasure",
            type: "array",
            props: {
                jsonPath: "NulmSuhRequest.suhFacilitiesDetails[0].isFireSafetyMeasure",
                label: { name: "Fire safety measure", key: "NULM_SUH_FIRE_SAFETY_MEASURE" },
                buttons: [
                    {
                        labelName: "Yes",
                        labelKey: "NULM_SEP_YES",
                        value: "Yes",
                    },
                    {
                        label: "No",
                        labelKey: "NULM_SEP_NO",
                        value: "No",
                    },
                ],
                defaultValue: "No"
            },
            type: "array",
        },
        fireSafetyMeasureRemark: {
            ...getTextField({
                label: {
                    labelName: "Remarks",
                    labelKey: "NULM_SUH_REMARKS"
                },
                placeholder: {
                    labelName: "Enter Remarks",
                    labelKey: "NULM_SUH_REMARKS_PLACEHOLDER"
                },
                pattern: getPattern("Address") || null,
                jsonPath: "NulmSuhRequest.suhFacilitiesDetails[0].fireSafetyMeasureRemark"
            })
        },
        isOfficeSetUp: {
            uiFramework: "custom-containers",
            componentPath: "RadioGroupContainer",
            gridDefination: {
                xs: 6
            },
            jsonPath: "NulmSuhRequest.suhFacilitiesDetails[0].isOfficeSetUp",
            type: "array",
            props: {
                jsonPath: "NulmSuhRequest.suhFacilitiesDetails[0].isOfficeSetUp",
                label: { name: "Office set up", key: "NULM_SUH_OFFICE_SET_UP" },
                buttons: [
                    {
                        labelName: "Yes",
                        labelKey: "NULM_SEP_YES",
                        value: "Yes",
                    },
                    {
                        label: "No",
                        labelKey: "NULM_SEP_NO",
                        value: "No",
                    },
                ],
                defaultValue: "No"
            },
            type: "array",
        },
        officeSetUpRemark: {
            ...getTextField({
                label: {
                    labelName: "Remarks",
                    labelKey: "NULM_SUH_REMARKS"
                },
                placeholder: {
                    labelName: "Enter Remarks",
                    labelKey: "NULM_SUH_REMARKS_PLACEHOLDER"
                },
                pattern: getPattern("Address") || null,
                jsonPath: "NulmSuhRequest.suhFacilitiesDetails[0].officeSetUpRemark"
            })
        },
        isFirstAidKitAndTrainingToStaff: {
            uiFramework: "custom-containers",
            componentPath: "RadioGroupContainer",
            gridDefination: {
                xs: 6
            },
            jsonPath: "NulmSuhRequest.suhFacilitiesDetails[0].isFirstAidKitAndTrainingToStaff",
            type: "array",
            props: {
                jsonPath: "NulmSuhRequest.suhFacilitiesDetails[0].isFirstAidKitAndTrainingToStaff",
                label: { name: "First aid kit & training to staff", key: "NULM_SUH_FIRST_AID_KIT_TRAINING_TO_STAFF " },
                buttons: [
                    {
                        labelName: "Yes",
                        labelKey: "NULM_SEP_YES",
                        value: "Yes",
                    },
                    {
                        label: "No",
                        labelKey: "NULM_SEP_NO",
                        value: "No",
                    },
                ],
                defaultValue: "No"
            },
            type: "array",
        },
        firstAidKitAndTrainingToStaffRemark: {
            ...getTextField({
                label: {
                    labelName: "Remarks",
                    labelKey: "NULM_SUH_REMARKS"
                },
                placeholder: {
                    labelName: "Enter Remarks",
                    labelKey: "NULM_SUH_REMARKS_PLACEHOLDER"
                },
                pattern: getPattern("Address") || null,
                jsonPath: "NulmSuhRequest.suhFacilitiesDetails[0].firstAidKitAndTrainingToStaffRemark"
            })
        },
        isDisplayOfEmergencyNumbers: {
            uiFramework: "custom-containers",
            componentPath: "RadioGroupContainer",
            gridDefination: {
                xs: 6
            },
            jsonPath: "NulmSuhRequest.suhFacilitiesDetails[0].isDisplayOfEmergencyNumbers",
            type: "array",
            props: {
                jsonPath: "NulmSuhRequest.suhFacilitiesDetails[0].isDisplayOfEmergencyNumbers",
                label: { name: "Display of emergency numbers", key: "NULM_SUH_DISPLAY_OF_EMERGENCY_NUMBERS" },
                buttons: [
                    {
                        labelName: "Yes",
                        labelKey: "NULM_SEP_YES",
                        value: "Yes",
                    },
                    {
                        label: "No",
                        labelKey: "NULM_SEP_NO",
                        value: "No",
                    },
                ],
                defaultValue: "No"
            },
            type: "array",
        },
        displayOfEmergencyNumbersRemark: {
            ...getTextField({
                label: {
                    labelName: "Remarks",
                    labelKey: "NULM_SUH_REMARKS"
                },
                placeholder: {
                    labelName: "Enter Remarks",
                    labelKey: "NULM_SUH_REMARKS_PLACEHOLDER"
                },
                pattern: getPattern("Address") || null,
                jsonPath: "NulmSuhRequest.suhFacilitiesDetails[0].displayOfEmergencyNumbersRemark"
            })
        },
        isToilet: {
            uiFramework: "custom-containers",
            componentPath: "RadioGroupContainer",
            gridDefination: {
                xs: 6
            },
            jsonPath: "NulmSuhRequest.suhFacilitiesDetails[0].isToilet",
            type: "array",
            props: {
                jsonPath: "NulmSuhRequest.suhFacilitiesDetails[0].isToilet",
                label: { name: "Toilet", key: "NULM_SUH_TOILET" },
                buttons: [
                    {
                        labelName: "Yes",
                        labelKey: "NULM_SEP_YES",
                        value: "Yes",
                    },
                    {
                        label: "No",
                        labelKey: "NULM_SEP_NO",
                        value: "No",
                    },
                ],
                defaultValue: "No"
            },
            type: "array",
        },
        toiletRemark: {
            ...getTextField({
                label: {
                    labelName: "Remarks",
                    labelKey: "NULM_SUH_REMARKS"
                },
                placeholder: {
                    labelName: "Enter Remarks",
                    labelKey: "NULM_SUH_REMARKS_PLACEHOLDER"
                },
                pattern: getPattern("Address") || null,
                jsonPath: "NulmSuhRequest.suhFacilitiesDetails[0].toiletRemark"
            })
        },
    })
});