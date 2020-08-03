import {
    getCommonGrayCard,
    getCommonSubHeader,
    getCommonContainer,
    getLabelWithValue,
    getDivider,
    getLabel
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { convertEpochToDate, } from "../../utils";
import { changeStep } from "./footer";

export const areaLabel = {
    labelName: "Area",
    labelKey: "RP_AREA_LABEL"
}

export const pincodeLabel = {
    labelName: "Pincode",
    labelKey: "RP_PINCODE_LABEL"
}

const colonyLabel = {
    labelName: "Colony",
    labelKey: "RP_COLONY_LABEL"
}

export const editSection = {
    componentPath: "Button",
    props: {
        color: "primary"
    },
    gridDefination: {
        xs: 12,
        sm: 2,
        align: "right"
    },
    children: {
        editIcon: {
            uiFramework: "custom-atoms",
            componentPath: "Icon",
            props: {
                iconName: "edit"
            }
        },
        buttonLabel: getLabel({
            labelName: "Edit",
            labelKey: "TL_SUMMARY_EDIT"
        })
    }
}

const masterEntryEditSection = (isEditable) => ({
    ...editSection,
    visible: isEditable,
    onClickDefination: {
        action: "condition",
        callBack: (state, dispatch) => {
            changeStep(state, dispatch, "apply", "", 0);
        }
    }
})

export const headerDiv = {
    uiFramework: "custom-atoms",
    componentPath: "Container",
    props: {
        style: { marginBottom: "10px" }
    }
}

export const getReviewProperty = (isEditable = true) => {
    return getCommonGrayCard({
        headerDiv: {
            ...headerDiv,
            children: {
                header: {
                    gridDefination: {
                        xs: 12,
                        sm: 10
                    },
                    ...getCommonSubHeader({
                        labelName: "Property Details",
                        labelKey: "RP_PROPERTY_DETAILS_HEADER"
                    })
                },
                editSection: masterEntryEditSection(isEditable)
            }
        },
        viewFour: getCommonContainer({
            propertyColony: getLabelWithValue(
                colonyLabel,
                { jsonPath: "Properties[0].colony" }
            ),
            propertyTransitNumber: getLabelWithValue(
                {
                    labelName: "Transit Site/Plot number",
                    labelKey: "RP_SITE_PLOT_LABEL"
                },
                { jsonPath: "Properties[0].transitNumber" }
            ),
            propertyArea: getLabelWithValue(
                {
                    labelName: "Area of the property",
                    labelKey: "RP_AREA_PROPERTY_LABEL"
                },
                { jsonPath: "Properties[0].propertyDetails.area" }
            ),
        })
    })
}

export const getReviewOwner = (isEditable = true) => {
    return getCommonGrayCard({
        headerDiv: {
            ...headerDiv,
            children: {
                header: {
                    gridDefination: {
                        xs: 12,
                        sm: 10
                    },
                    ...getCommonSubHeader({
                        labelName: "Owner Details",
                        labelKey: "TL_OWNER_DETAILS_HEADER"
                    })
                },
                editSection: masterEntryEditSection(isEditable)
            }
        },
        viewFour: getCommonContainer({
                ownerName: getLabelWithValue(
                    {
                        labelName: "Owner Name",
                        labelKey: "RP_OWNER_NAME_LABEL"
                    },
                    { jsonPath: "Properties[0].owners[0].ownerDetails.name" }
                ),
                ownerMobile: getLabelWithValue(
                    {
                        labelName: "Mobile No",
                        labelKey: "RP_MOBILE_NO_LABEL"
                    },
                    { jsonPath: "Properties[0].owners[0].ownerDetails.phone" }
                ),
                ownerFatherOrHusband: getLabelWithValue(
                    {
                        labelName: "Father/ Husband's Name",
                        labelKey: "TL_FATHER_OR_HUSBANDS_NAME_LABEL"
                    },
                    {jsonPath: "Properties[0].owners[0].ownerDetails.fatherOrHusband"}
                ),
                ownerRelationShip: getLabelWithValue(
                    {
                        labelName: "Relationship",
                        labelKey: "TL_COMMON_RELATIONSHIP_LABEL"
                    },
                    {
                        jsonPath:"Properties[0].owners[0].ownerDetails.relation"
                    }
                ),
                ownerEmail: getLabelWithValue(
                    {
                        labelName: "Email",
                        labelKey: "RP_OWNER_DETAILS_EMAIL_LABEL"
                    },
                    { jsonPath: "Properties[0].owners[0].ownerDetails.email" }
                ),
                ownerAadhaarNo: getLabelWithValue(
                    {
                        labelName: "Aadhar Number",
                        labelKey: "RP_AADHAR_LABEL"
                    },
                    { jsonPath: "Properties[0].owners[0].ownerDetails.aadhaarNumber" }
                ),
                allotementNumber: getLabelWithValue(
                    {
                        labelName: "Allotment Number",
                        labelKey: "RP_ALLOTMENT_NUMBER_LABEL"
                    },
                    { jsonPath: "Properties[0].owners[0].allotmenNumber" }
                ),
                allotementDate: getLabelWithValue(
                    {
                        labelName: "Date of Allotment",
                        labelKey: "RP_ALLOTMENT_DATE_LABEL"
                    },
                    { jsonPath: "Properties[0].owners[0].ownerDetails.allotmentStartdate", 
                    callBack: convertEpochToDate
                }
                ),
                possessionDate: getLabelWithValue(
                    {
                        labelName: "Date of Possession",
                        labelKey: "RP_POSSESSION_DATE_LABEL"
                    },
                    { jsonPath: "Properties[0].owners[0].ownerDetails.posessionStartdate",
                    callBack: convertEpochToDate
                }
                )
        })
    })
}

export const getReviewAddress = (isEditable = true) => {
    return getCommonGrayCard({
        headerDiv: {
            ...headerDiv,
            children: {
                header: {
                    gridDefination: {
                        xs: 12,
                        sm: 10
                    },
                    ...getCommonSubHeader({
                        labelName: "Address Details",
                        labelKey: "RP_ADDRESS_DETAILS_HEADER"
                    })
                },
                editSection: masterEntryEditSection(isEditable)
            }
        },
        viewFour: getCommonContainer({
                area: getLabelWithValue(
                    areaLabel,
                    { jsonPath: "Properties[0].propertyDetails.address.area" }
                ),
                pincode: getLabelWithValue(
                    pincodeLabel,
                    { jsonPath: "Properties[0].propertyDetails.address.pincode" }
                ),
        })
    })
}

export const getReviewRentDetails = (isEditable = true) => {
    return getCommonGrayCard({
        headerDiv: {
            ...headerDiv,
            children: {
                header: {
                    gridDefination: {
                        xs: 12,
                        sm: 10
                    },
                    ...getCommonSubHeader({
                        labelName: "Rent Details",
                        labelKey: "RP_RENT_DETAILS_HEADER"
                    })
                },
                editSection: masterEntryEditSection(isEditable)
            }
        },
        viewFour: getCommonContainer({
                monthlyRentAmount: getLabelWithValue(
                    {
                        labelName: "Monthly Rent Amount",
                        labelKey: "RP_MONTHLY_RENT_LABEL"
                    },
                    { jsonPath: "Properties[0].owners[0].ownerDetails.monthlyRent" }
                ),
                revisionPeriod: getLabelWithValue(
                    {
                        labelName: "Rent Amount Revised Period",
                        labelKey: "RP_RENT_AMOUNT_REVISED_PERIOD_LABEL"
                    },
                    { jsonPath: "Properties[0].owners[0].ownerDetails.revisionPeriod" }
                ),
                revisionPercentage: getLabelWithValue(
                    {
                        labelName: "Rent Amount Revision Percentage",
                        labelKey: "RP_RENT_AMOUNT_REVISED_PERCENTAGE_LABEL"
                    },
                    { jsonPath: "Properties[0].owners[0].ownerDetails.revisionPercentage" }
                ),
        })
    })
}

export const getReviewPaymentDetails = (isEditable = true) => {
    return getCommonGrayCard({
        headerDiv: {
            ...headerDiv,
            children: {
                header: {
                    gridDefination: {
                        xs: 12,
                        sm: 10
                    },
                    ...getCommonSubHeader({
                        labelName: "Payment Details",
                        labelKey: "RP_PAYMENT_DETAILS_HEADER"
                    })
                },
                editSection: masterEntryEditSection(isEditable)
            }
        },
        viewFour: getCommonContainer({
                amountPaid: getLabelWithValue(
                    {
                        labelName: "Payment Amount",
                        labelKey: "RP_PAYMENT_AMOUNT_LABEL"
                    },
                    { jsonPath: "Properties[0].owners[0].ownerDetails.payment[0].amountPaid" }
                ),
                paymentDate: getLabelWithValue(
                    {
                        labelName: "Date of Payment",
                        labelKey: "RP_DATE_PAYMENT_LABEL"
                    },
                    { jsonPath: "Properties[0].owners[0].ownerDetails.payment[0].paymentDate", callBack: convertEpochToDate }
                ),
                paymentMode: getLabelWithValue(
                    {
                        labelName: "Payment Mode",
                        labelKey: "RP_PAYMENT_MODE_LABEL"
                    },
                    { jsonPath: "Properties[0].owners[0].ownerDetails.payment[0].paymentMode" }
                ),
        })
    })
}


export const getReviewGrantDetails = () => {
    return getCommonGrayCard({
        headerDiv: {
            ...headerDiv,
            children: {
                header: {
                    gridDefination: {
                        xs: 12,
                        sm: 10
                    },
                    ...getCommonSubHeader({
                        labelName: "Grant Details",
                        labelKey: "RP_GRANT_DETAILS_HEADER"
                    })
                },
                
            }
        },
        viewFour: getCommonContainer({
         
                nameOfTheBank: getLabelWithValue(
                    {
                        labelName: "Name of the bank (Text field)",
                        labelKey: "WF_BANK_NAME"
                    },
                    { jsonPath: "Properties[0].grantDetails[0].bankName" }
                ),
                mortageAmount: getLabelWithValue(
                    {
                        labelName: "Enter mortgage amount",
                        labelKey: "WF_MORTAGE_AMOUNT"
                    },
                    { jsonPath: "Properties[0].grantDetails[0].mortgageAmount" }
                ),
                sanctionLetterNo: getLabelWithValue(
                    {
                        labelName: "Sanction letter number",
                        labelKey: "WF_SANCTION_LETTER_LABEL"
                    },
                    { jsonPath: "Properties[0].grantDetails[0].sanctionLetterNumber" }
                ),
                mortageEndDate: getLabelWithValue(
                    {
                        labelName: "Mortgage end date ",
                        labelKey: "WF_MORTAGAGEEND_DATE_LABEL"
                    },
                    { jsonPath: "Properties[0].grantDetails[0].mortgageEndDate" , callBack: convertEpochToDate}
                ),
                sanctioningDate: getLabelWithValue(
                    {
                        labelName: "Date of sanctioning",
                        labelKey: "WF_SANCTIONING_DATE_LABEL"
                    },
                    { jsonPath: "Properties[0].grantDetails[0].sanctionDate" , callBack: convertEpochToDate}
                ),
              
        })
    })
}