import {
    getCommonCard,
    getSelectField,
    getTextField,
    getDateField,
    getCommonTitle,
    getPattern,
    getCommonContainer
} from "egov-ui-framework/ui-config/screens/specs/utils";
import {
    handleScreenConfigurationFieldChange as handleField
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import {
    getTodaysDateInYMD
} from "../../utils";
import get from "lodash/get";
import {
    companyDetails
} from "./entityDetails"

const typeOfAllocationField = {
    label: {
        labelName: "Type of Allocation",
        labelKey: "EST_ALLOCATION_TYPE_LABEL"
    },
    placeholder: {
        labelName: "Select Type of Allocation",
        labelKey: "EST_ALLOCATION_TYPE_PLACEHOLDER"
    },
    required: true,
    jsonPath: "Properties[0].propertyDetails.typeOfAllocation",
    sourceJsonPath: "applyScreenMdmsData.EstatePropertyService.allocationType",
    gridDefination: {
        xs: 12,
        sm: 6
    }
}

const modeOfAuctionField = {
    label: {
        labelName: "Mode of Auction",
        labelKey: "EST_MODE_OF_AUCTION_LABEL"
    },
    placeholder: {
        labelName: "Enter Mode of Auction",
        labelKey: "EST_MODE_OF_AUCTION_PLACEHOLDER"
    },
    gridDefination: {
        xs: 12,
        sm: 6
    },
    maxLength: 100,
    jsonPath: "Properties[0].propertyDetails.modeOfAuction"
}

const schemeNameField = {
    label: {
        labelName: "Scheme Name",
        labelKey: "EST_SCHEME_NAME_LABEL"
    },
    placeholder: {
        labelName: "Enter Scheme Name",
        labelKey: "EST_SCHEME_NAME_PLACEHOLDER"
    },
    gridDefination: {
        xs: 12,
        sm: 6
    },
    maxLength: 100,
    jsonPath: "Properties[0].propertyDetails.schemeName"
}

const dateOfAuctionField = {
    label: {
        labelName: "Date of Auction",
        labelKey: "EST_DATE_OF_AUCTION_LABEL"
    },
    placeholder: {
        labelName: "Enter Date of Auction",
        labelKey: "EST_DATE_OF_AUCTION_PLACEHOLDER"
    },
    pattern: getPattern("Date"),
    jsonPath: "Properties[0].propertyDetails.dateOfAuction",
    props: {
        inputProps: {
            max: getTodaysDateInYMD()
        }
    }
}

const areaOfPropertyField = {
    label: {
        labelName: "Area of the Property in sqft",
        labelKey: "EST_AREA_OF_PROPERTY_LABEL"
    },
    placeholder: {
        labelName: "Enter Area of the Property in sqft",
        labelKey: "EST_AREA_OF_PROPERTY_PLACEHOLDER"
    },
    gridDefination: {
        xs: 12,
        sm: 6
    },
    required: true,
    minLength: 2,
    maxLength: 15,
    jsonPath: "Properties[0].propertyDetails.areaSqft"
}

const rateField = {
    label: {
        labelName: "Rate per sqft",
        labelKey: "EST_RATE_LABEL"
    },
    placeholder: {
        labelName: "Enter Rate per sqft",
        labelKey: "EST_RATE_PLACEHOLDER"
    },
    gridDefination: {
        xs: 12,
        sm: 6
    },
    required: true,
    minLength: 2,
    maxLength: 5,
    jsonPath: "Properties[0].propertyDetails.ratePerSqft"
}

const categoryField = {
    label: {
        labelName: "Category",
        labelKey: "EST_CATEGORY_LABEL"
    },
    placeholder: {
        labelName: "Select Category",
        labelKey: "EST_CATEGORY_PLACEHOLDER"
    },
    required: true,
    jsonPath: "Properties[0].category",
    sourceJsonPath: "applyScreenMdmsData.EstatePropertyService.categories",
    gridDefination: {
        xs: 12,
        sm: 6
    },
    beforeFieldChange: (action, state, dispatch) => {
        let screenName = "apply";
        let step = "formwizardFirstStep";
        
        if ((window.location.href).includes("allotment")) {
            screenName = "allotment";
            step = "formwizardFirstStepAllotment";
        }

        dispatch(
            handleField(
                screenName,
                `components.div.children.${step}.children.propertyInfoDetails.children.cardContent.children.detailsContainer.children.subCategory`,
                "props.value",
                ""
            )
        )
        
        if (action.value == "CAT.RESIDENTIAL" || action.value == "CAT.COMMERCIAL") {
            dispatch(
                handleField(
                    screenName,
                    `components.div.children.${step}.children.propertyInfoDetails.children.cardContent.children.detailsContainer.children.subCategory`,
                    "visible",
                    true
                )
            );

            const categories = get(
                state.screenConfiguration.preparedFinalObject,
                "applyScreenMdmsData.EstatePropertyService.categories"
            )

            const filteredCategory = categories.filter(item => item.code === action.value)
            dispatch(
                handleField(
                    screenName,
                    `components.div.children.${step}.children.propertyInfoDetails.children.cardContent.children.detailsContainer.children.subCategory`,
                    "props.data",
                    filteredCategory[0].SubCategory
                )
            )
        } else {
            dispatch(
                handleField(
                    screenName,
                    `components.div.children.${step}.children.propertyInfoDetails.children.cardContent.children.detailsContainer.children.subCategory`,
                    "visible",
                    false
                )
            );
        }
    }
}

const subCategoryField = {
    label: {
        labelName: "Sub Category",
        labelKey: "EST_SUBCATEGORY_LABEL"
    },
    placeholder: {
        labelName: "Select Sub Category",
        labelKey: "EST_SUBCATEGORY_PLACEHOLDER"
    },
    required: true,
    jsonPath: "Properties[0].subCategory",
    visible: false,
    gridDefination: {
        xs: 12,
        sm: 6
    }
}

const siteNumberField = {
    label: {
        labelName: "Site Number",
        labelKey: "EST_SITE_NUMBER_LABEL"
    },
    placeholder: {
        labelName: "Enter Site Number",
        labelKey: "EST_SITE_NUMBER_PLACEHOLDER"
    },
    gridDefination: {
        xs: 12,
        sm: 6
    },
    required: true,
    maxLength: 50,
    jsonPath: "Properties[0].siteNumber"
}

const sectorNumberField = {
    label: {
        labelName: "Sector Number",
        labelKey: "EST_SECTOR_NUMBER_LABEL"
    },
    placeholder: {
        labelName: "Select Sector Number",
        labelKey: "EST_SECTOR_NUMBER_PLACEHOLDER"
    },
    // required: true,
    jsonPath: "Properties[0].sectorNumber",
    sourceJsonPath: "applyScreenMdmsData.EstatePropertyService.SectorNumber",
    gridDefination: {
        xs: 12,
        sm: 6
    }
}

const fileNumberField = {
    label: {
        labelName: "File Number",
        labelKey: "EST_FILE_NUMBER_LABEL"
    },
    placeholder: {
        labelName: "Enter File Number",
        labelKey: "EST_FILE_NUMBER_PLACEHOLDER"
    },
    gridDefination: {
        xs: 12,
        sm: 6
    },
    required: true,
    maxLength: 50,
    jsonPath: "Properties[0].fileNumber"
}

const lastNocDateField = {
    label: {
        labelName: "Last NOC Date",
        labelKey: "EST_LAST_NOC_DATE_LABEL"
    },
    placeholder: {
        labelName: "Enter Last NOC Date",
        labelKey: "EST_LAST_NOC_DATE_PLACEHOLDER"
    },
    pattern: getPattern("Date"),
    jsonPath: "Properties[0].propertyDetails.lastNocDate",
    props: {
        inputProps: {
            max: getTodaysDateInYMD()
        }
    }
}

const propertyTypeField = {
    label: {
        labelName: "Property Type",
        labelKey: "EST_PROPERTY_TYPE_LABEL"
    },
    placeholder: {
        labelName: "Select Property Type",
        labelKey: "EST_PROPERTY_TYPE_PLACEHOLDER"
    },
    required: true,
    jsonPath: "Properties[0].propertyDetails.propertyType",
    sourceJsonPath: "applyScreenMdmsData.EstatePropertyService.propertyType",
    gridDefination: {
        xs: 12,
        sm: 6
    },
    beforeFieldChange: (action, state, dispatch) => {
        if (action.value == "PROPERTY_TYPE.LEASEHOLD") {
            dispatch(
                handleField(
                    "allotment",
                    "components.div.children.formwizardEighthStepAllotment.children.demandSelect.children.cardContent.children.detailsContainer.children.demand",
                    "visible",
                    true
                )
            )
        } else {
            dispatch(
                handleField(
                    "allotment",
                    "components.div.children.formwizardEighthStepAllotment.children.demandSelect.children.cardContent.children.detailsContainer.children.demand",
                    "visible",
                    false
                )
            )
        }
    }
}

const serviceCategoryField = {
    label: {
        labelName: "Service Category",
        labelKey: "EST_SERVICE_CATEGORY_LABEL"
    },
    placeholder: {
        labelName: "Enter Service Category",
        labelKey: "EST_SERVICE_CATEGORY_PLACEHOLDER"
    },
    gridDefination: {
        xs: 12,
        sm: 6
    },
    maxLength: 100,
    jsonPath: "Properties[0].propertyDetails.serviceCategory"
}

const getPropertyRegisteredToRadioButton = {
    uiFramework: "custom-containers",
    componentPath: "RadioGroupContainer",
    gridDefination: {
        xs: 12,
        sm: 6,
    },
    jsonPath: "Properties[0].propertyDetails.propertyRegisteredTo",
    props: {
        label: {
            name: "Property Registered To",
            key: "EST_PROPERTY_REGISTERED_TO_LABEL"
        },
        buttons: [{
            labelName: "Entity",
            labelKey: "EST_COMMON_ENTITY",
            value: "ENTITY"
        },
        {
            label: "Individual",
            labelKey: "EST_COMMON_INDIVIDUAL",
            value: "INDIVIDUAL"
        }],
        jsonPath: "Properties[0].propertyDetails.propertyRegisteredTo",
        required: true,
    },
    required: true,
    type: "array",
    beforeFieldChange: (action, state, dispatch) => {
        let screenName = "apply";
        let stepName = "formwizardFirstStep";

        if ((window.location.href.includes("allotment"))) {
            screenName = "allotment";
            stepName = "formwizardFirstStepAllotment";
        }

        dispatch(
            handleField(
                screenName,
                `components.div.children.${stepName}.children.propertyInfoDetails.children.cardContent.children.detailsContainer.children.entityType`,
                `visible`,
                !!(action.value === "ENTITY")
            )
        )
    }
};

const entityTypeField = {
    label: {
        labelName: "Entity Type",
        labelKey: "EST_ENTITY_TYPE_LABEL"
    },
    placeholder: {
        labelName: "Select Entity Type",
        labelKey: "EST_ENTITY_TYPE_PLACEHOLDER"
    },
    required: true,
    jsonPath: "Properties[0].propertyDetails.entityType",
    // sourceJsonPath: "applyScreenMdmsData.EstatePropertyService.entityType",
    gridDefination: {
        xs: 12,
        sm: 6
    },
    props: {
        data: [
            { code: "ET.PUBLIC_LIMITED_COMPANY", name: "Public ltd company" },
            { code: "ET.PRIVATE_LIMITED_COMPANY", name: "Private ltd company"},
            { code: "ET.PARTNERSHIP_FIRM", name: "Partnership firm"},
            { code: "ET.PROPRIETORSHIP", name: "Proprietorship" }
        ]
    },
    visible: false,
    beforeFieldChange: (action, state, dispatch) => {
        let screenName = "apply";
        let stepName = "formwizardThirdStep";

        if ((window.location.href.includes("allotment"))) {
            screenName = "allotment";
            stepName = "formwizardThirdStepAllotment";
        }

        dispatch(
            handleField(
                screenName,
                "components.div.children.formwizardThirdStep.children.companyDetails",
                "visible",
                !!(action.value == "ET.PUBLIC_LIMITED_COMPANY" || action.value =="ET.PRIVATE_LIMITED_COMPANY")
            )
        )
        dispatch(
            handleField(
                screenName,
                "components.div.children.formwizardThirdStep.children.ownerDetails",
                "visible",
                !!(action.value == "ET.PUBLIC_LIMITED_COMPANY" || action.value =="ET.PRIVATE_LIMITED_COMPANY")
            )
        )
        dispatch(
            handleField(
                screenName,
                "components.div.children.formwizardThirdStep.children.firmDetails",
                "visible",
                !!(action.value == "ET.PARTNERSHIP_FIRM")
            )
        )
        dispatch(
            handleField(
                screenName,
                "components.div.children.formwizardThirdStep.children.partnerDetails",
                "visible",
                !!(action.value == "ET.PARTNERSHIP_FIRM")
            )
        )
        dispatch(
            handleField(
                screenName,
                "components.div.children.formwizardThirdStep.children.proprietorshipDetails",
                "visible",
                !!(action.value == "ET.PROPRIETORSHIP")
            )
        )
    }
}

const propertyInfoHeader = getCommonTitle({
    labelName: "Property Info",
    labelKey: "EST_PROPERTY_INFO_HEADER"
}, {
    style: {
        marginBottom: 18,
        marginTop: 18
    }
})
export const propertyInfoDetails = getCommonCard({
    header: propertyInfoHeader,
    detailsContainer: getCommonContainer({
        fileNumber: getTextField(fileNumberField),
        propertyType: getSelectField(propertyTypeField),
        category: getSelectField(categoryField),
        subCategory: getSelectField(subCategoryField),
        siteNumber: getTextField(siteNumberField),
        sectorNumber: getSelectField(sectorNumberField),
        areaOfProperty: getTextField(areaOfPropertyField),
        rate: getTextField(rateField),
        typeOfAllocation: getSelectField(typeOfAllocationField),
        propertyRegisteredTo: getPropertyRegisteredToRadioButton,
        entityType: getSelectField(entityTypeField)
    })
})

const auctionDetailsHeader = getCommonTitle({
    labelName: "Auction Details",
    labelKey: "EST_AUCTION_DETAILS_HEADER"
}, {
    style: {
        marginBottom: 18,
        marginTop: 18
    }
})
export const auctionDetails = getCommonCard({
    header: auctionDetailsHeader,
    detailsContainer: getCommonContainer({
        modeOfAuction: getTextField(modeOfAuctionField),
        schemeName: getTextField(schemeNameField),
        dateOfAuction: getDateField(dateOfAuctionField)
    })
})

const additionalDetailsHeader = getCommonTitle({
    labelName: "NOC Details",
    labelKey: "EST_NOC_DETAILS_HEADER"
}, {
    style: {
        marginBottom: 18,
        marginTop: 18
    }
})
export const additionalDetails = getCommonCard({
    header: additionalDetailsHeader,
    detailsContainer: getCommonContainer({
        lastNocDate: getDateField(lastNocDateField),
        serviceCategory: getTextField(serviceCategoryField)
    })
})