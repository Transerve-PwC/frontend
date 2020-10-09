import {
    getCommonCard,
    getSelectField,
    getTextField,
    getDateField,
    getCommonTitle,
    getPattern,
    getCommonContainer,
    dispatchMultipleFieldChangeAction
} from "egov-ui-framework/ui-config/screens/specs/utils";
import {
    handleScreenConfigurationFieldChange as handleField,
    prepareFinalObject
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import {
    getTodaysDateInYMD
} from "../../utils";
import get from "lodash/get";
import {
    companyDetails
} from "./entityDetails"

export const getActionDefinationForAuctionDetailsFields = (disabled = true, step) => {
    const actionDefination = [{
      path: `components.div.children.${step}.children.AllotmentAuctionDetails.children.cardContent.children.detailsContainer.children.cardContent.children.auctionCard.children.auctionId`,
      property: "props.disabled",
      value: disabled
    },
    {
      path: `components.div.children.${step}.children.AllotmentAuctionDetails.children.cardContent.children.detailsContainer.children.cardContent.children.auctionCard.children.dateOfAuction`,
      property: "props.disabled",
      value: disabled
    },
    {
      path: `components.div.children.${step}.children.AllotmentAuctionDetails.children.cardContent.children.detailsContainer.children.cardContent.children.auctionCard.children.emdAmount`,
      property: "props.disabled",
      value: disabled
    },
    {
      path: `components.div.children.${step}.children.AllotmentAuctionDetails.children.cardContent.children.detailsContainer.children.cardContent.children.auctionCard.children.emdAmountDate`,
      property: "props.disabled",
      value: disabled
    },
    {
      path: `components.div.children.${step}.children.AllotmentAuctionDetails.children.cardContent.children.detailsContainer.children.cardContent.children.auctionCard.children.modeOfAuction`,
      property: "props.disabled",
      value: disabled
    },
    {
      path: `components.div.children.${step}.children.AllotmentAuctionDetails.children.cardContent.children.detailsContainer.children.cardContent.children.auctionCard.children.schemeName`,
      property: "props.disabled",
      value: disabled
    }];
    return actionDefination;
  }

const typeOfAllocationField = {
    label: {
        labelName: "Type of Allocation",
        labelKey: "ES_ALLOCATION_TYPE_LABEL"
    },
    placeholder: {
        labelName: "Select Type of Allocation",
        labelKey: "ES_ALLOCATION_TYPE_PLACEHOLDER"
    },
    required: true,
    jsonPath: "Properties[0].propertyDetails.typeOfAllocation",
    sourceJsonPath: "applyScreenMdmsData.EstatePropertyService.allocationType",
    gridDefination: {
        xs: 12,
        sm: 6
    },
    beforeFieldChange: (action, state, dispatch) => {
        let screenName = "apply";
        let step = "formwizardSecondStep";
        
        if ((window.location.href).includes("allotment")) {
            screenName = "allotment";
            step = "formwizardSecondStepAllotment";
        }
        dispatchMultipleFieldChangeAction(
            screenName,
            getActionDefinationForAuctionDetailsFields(!!(action.value == "ALLOCATION_TYPE.ALLOTMENT"), step),
            dispatch
        );
        dispatch(
            handleField(
                screenName,
                `components.div.children.${step}.children.AllotmentAuctionDetails.children.cardContent.children.biddersListContainer`,
                `visible`,
                !!(action.value == "ALLOCATION_TYPE.AUCTION")
            )
        )
    }
}

const modeOfAuctionField = {
    label: {
        labelName: "Mode of Auction",
        labelKey: "ES_MODE_OF_AUCTION_LABEL"
    },
    placeholder: {
        labelName: "Enter Mode of Auction",
        labelKey: "ES_MODE_OF_AUCTION_PLACEHOLDER"
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
        labelKey: "ES_SCHEME_NAME_LABEL"
    },
    placeholder: {
        labelName: "Enter Scheme Name",
        labelKey: "ES_SCHEME_NAME_PLACEHOLDER"
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
        labelKey: "ES_DATE_OF_AUCTION_LABEL"
    },
    placeholder: {
        labelName: "Enter Date of Auction",
        labelKey: "ES_DATE_OF_AUCTION_PLACEHOLDER"
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
        labelKey: "ES_AREA_OF_PROPERTY_LABEL"
    },
    placeholder: {
        labelName: "Enter Area of the Property in sqft",
        labelKey: "ES_AREA_OF_PROPERTY_PLACEHOLDER"
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
        labelKey: "ES_RATE_LABEL"
    },
    placeholder: {
        labelName: "Enter Rate per sqft",
        labelKey: "ES_RATE_PLACEHOLDER"
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
        labelKey: "ES_CATEGORY_LABEL"
    },
    placeholder: {
        labelName: "Select Category",
        labelKey: "ES_CATEGORY_PLACEHOLDER"
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
        labelKey: "ES_SUBCATEGORY_LABEL"
    },
    placeholder: {
        labelName: "Select Sub Category",
        labelKey: "ES_SUBCATEGORY_PLACEHOLDER"
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
        labelName: "Site Number/SCO/Booth",
        labelKey: "ES_SITE_NUMBER_LABEL"
    },
    placeholder: {
        labelName: "Enter Site Number",
        labelKey: "ES_SITE_NUMBER_PLACEHOLDER"
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
        labelKey: "ES_SECTOR_NUMBER_LABEL"
    },
    placeholder: {
        labelName: "Select Sector Number",
        labelKey: "ES_SECTOR_NUMBER_PLACEHOLDER"
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
        labelKey: "ES_FILE_NUMBER_LABEL"
    },
    placeholder: {
        labelName: "Enter File Number",
        labelKey: "ES_FILE_NUMBER_PLACEHOLDER"
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
        labelKey: "ES_LAST_NOC_DATE_LABEL"
    },
    placeholder: {
        labelName: "Enter Last NOC Date",
        labelKey: "ES_LAST_NOC_DATE_PLACEHOLDER"
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
        labelKey: "ES_PROPERTY_TYPE_LABEL"
    },
    placeholder: {
        labelName: "Select Property Type",
        labelKey: "ES_PROPERTY_TYPE_PLACEHOLDER"
    },
    required: true,
    jsonPath: "Properties[0].propertyDetails.propertyType",
    sourceJsonPath: "applyScreenMdmsData.EstatePropertyService.propertyType",
    gridDefination: {
        xs: 12,
        sm: 6
    },
    beforeFieldChange: (action, state, dispatch) => {
        dispatch(
            handleField(
                "allotment",
                "components.div.children.formwizardSixthStepAllotment.children.demandSelect",
                "visible",
                !!(action.value == "PROPERTY_TYPE.LEASEHOLD")
            )
        )
    }
}

const serviceCategoryField = {
    label: {
        labelName: "Service Category",
        labelKey: "ES_SERVICE_CATEGORY_LABEL"
    },
    placeholder: {
        labelName: "Enter Service Category",
        labelKey: "ES_SERVICE_CATEGORY_PLACEHOLDER"
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
            key: "ES_PROPERTY_REGISTERED_TO_LABEL"
        },
        buttons: [{
            labelName: "Entity",
            labelKey: "ES_COMMON_ENTITY",
            value: "ENTITY"
        },
        {
            label: "Individual",
            labelKey: "ES_COMMON_INDIVIDUAL",
            value: "INDIVIDUAL"
        }],
        jsonPath: "Properties[0].propertyDetails.propertyRegisteredTo",
        required: true,
    },
    required: true,
    type: "array",
    beforeFieldChange: (action, state, dispatch) => {
        if (!!action.value) {
            toggleEntityOwnersDivsBasedOnPropertyRegisteredTo(action.value, dispatch);
        }
    }
};

const entityTypeField = {

    label: {
        labelName: "Entity Type",
        labelKey: "ES_ENTITY_TYPE_LABEL"
    },
    placeholder: {
        labelName: "Select Entity Type",
        labelKey: "ES_ENTITY_TYPE_PLACEHOLDER"
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
        if (!!action.value) {
            toggleEntityOwnersDivsBasedOnEntityType(action.value, dispatch);
        }
    }
}

const propertyInfoHeader = getCommonTitle({
    labelName: "Property Info",
    labelKey: "ES_PROPERTY_INFO_HEADER"
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
    labelKey: "ES_AUCTION_DETAILS_HEADER"
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
    labelKey: "ES_NOC_DETAILS_HEADER"
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

export const toggleEntityOwnersDivsBasedOnPropertyRegisteredTo = (value, dispatch) =>  {
    let screenName = "apply";
    let stepNameFirst = "formwizardFirstStep";
    let stepNameThird = "formwizardThirdStep";
    let stepNameReview = "formwizardNinthStep";
    let reviewContainer = "reviewDetails";

    if ((window.location.href.includes("allotment"))) {
        screenName = "allotment";
        stepNameFirst = "formwizardFirstStepAllotment";
        stepNameThird = "formwizardThirdStepAllotment";
        stepNameReview = "formwizardSeventhStepAllotment";
        reviewContainer = "reviewAllotmentDetails"
    }

    dispatch(
        handleField(
            screenName,
            `components.div.children.${stepNameFirst}.children.propertyInfoDetails.children.cardContent.children.detailsContainer.children.entityType`,
            `visible`,
            !!(value === "ENTITY")
        )
    )

    dispatch(
        handleField(
            screenName,
            `components.div.children.${stepNameThird}.children.companyDetails`,
            "visible",
            !!(value == "ENTITY")
        )
    )
    dispatch(
        handleField(
            screenName,
            `components.div.children.${stepNameReview}.children.${reviewContainer}.children.cardContent.children.companyDetails`,
            "visible",
            !!(value == "ENTITY")
        )
    )
    dispatch(
        handleField(
            screenName,
            `components.div.children.${stepNameThird}.children.ownerDetails`,
            "visible",
            !!(value == "INDIVIDUAL")
        )
    )
    dispatch(
        handleField(
            screenName,
            `components.div.children.${stepNameThird}.children.ownerDetails.children.cardContent.children.detailsContainer.children.multipleApplicantContainer.children.multipleApplicantInfo.props.scheama.children.cardContent.children.ownerCard.children.isDirector`,
            "visible",
            !!(value == "ENTITY")
        )
    )
    dispatch(
        handleField(
            screenName,
            `components.div.children.${stepNameThird}.children.firmDetails`,
            "visible",
            !!(value == "ENTITY")
        )
    )
    dispatch(
        handleField(
            screenName,
            `components.div.children.${stepNameReview}.children.${reviewContainer}.children.cardContent.children.firmDetails`,
            "visible",
            !!(value == "ENTITY")
        )
    )
    dispatch(
        handleField(
            screenName,
            `components.div.children.${stepNameThird}.children.partnerDetails`,
            "visible",
            !!(value == "ENTITY")
        )
    )
    dispatch(
        handleField(
            screenName,
            `components.div.children.${stepNameThird}.children.proprietorshipDetails`,
            "visible",
            !!(value == "ENTITY")
        )
    )
    dispatch(
        handleField(
            screenName,
            `components.div.children.${stepNameReview}.children.${reviewContainer}.children.cardContent.children.proprietorDetails`,
            "visible",
            !!(value == "ENTITY")
        )
    )
}
export const toggleEntityOwnersDivsBasedOnEntityType = (value, dispatch) => {
    let screenName = "apply";
    let stepName = "formwizardThirdStep";
    let stepNameReview = "formwizardNinthStep";
    let reviewContainer = "reviewDetails";

    if ((window.location.href.includes("allotment"))) {
        screenName = "allotment";
        stepName = "formwizardThirdStepAllotment";
        stepNameReview = "formwizardSeventhStepAllotment";
        reviewContainer = "reviewAllotmentDetails";
    }

    if (value == "ET.PUBLIC_LIMITED_COMPANY" || value == "ET.PRIVATE_LIMITED_COMPANY") {
        dispatch(
            prepareFinalObject(
                "Properties[0].propertyDetails.companyOrFirm",
                "COMPANY"
            )
        )
    }
    else {
        dispatch(
            prepareFinalObject(
                "Properties[0].propertyDetails.companyOrFirm",
                "FIRM"
            )
        )
    }

    dispatch(
        handleField(
            screenName,
            `components.div.children.${stepName}.children.companyDetails`,
            "visible",
            !!(value == "ET.PUBLIC_LIMITED_COMPANY" || value =="ET.PRIVATE_LIMITED_COMPANY")
        )
    )
    dispatch(
        handleField(
            screenName,
            `components.div.children.${stepNameReview}.children.${reviewContainer}.children.cardContent.children.companyDetails`,
            "visible",
            !!(value == "ET.PUBLIC_LIMITED_COMPANY" || value =="ET.PRIVATE_LIMITED_COMPANY")
        )
    )
    dispatch(
        handleField(
            screenName,
            `components.div.children.${stepName}.children.ownerDetails`,
            "visible",
            !!(value == "ET.PUBLIC_LIMITED_COMPANY" || value =="ET.PRIVATE_LIMITED_COMPANY")
        )
    )
    dispatch(
        handleField(
            screenName,
            `components.div.children.${stepName}.children.firmDetails`,
            "visible",
            !!(value == "ET.PARTNERSHIP_FIRM" || value == "ET.PROPRIETORSHIP")
        )
    )
    dispatch(
        handleField(
            screenName,
            `components.div.children.${stepNameReview}.children.${reviewContainer}.children.cardContent.children.firmDetails`,
            "visible",
            !!(value == "ET.PARTNERSHIP_FIRM" || value == "ET.PROPRIETORSHIP")
        )
    )
    dispatch(
        handleField(
            screenName,
            `components.div.children.${stepName}.children.partnerDetails`,
            "visible",
            !!(value == "ET.PARTNERSHIP_FIRM")
        )
    )
    dispatch(
        handleField(
            screenName,
            `components.div.children.${stepName}.children.proprietorshipDetails`,
            "visible",
            !!(value == "ET.PROPRIETORSHIP")
        )
    )
    dispatch(
        handleField(
            screenName,
            `components.div.children.${stepNameReview}.children.${reviewContainer}.children.cardContent.children.proprietorDetails`,
            "visible",
            !!(value == "ET.PROPRIETORSHIP")
        )
    )
}