import {
    getCommonGrayCard,
    getCommonSubHeader,
    getCommonContainer,
    getLabelWithValue,
    getDivider,
    getLabel
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { convertEpochToDate, } from "../../utils";
import { changeStep, changePropertyStep } from "./footer";

export const areaLabel = {
    labelName: "Locality",
    labelKey: "RP_LOCALITY_LABEL"
}

export const pincodeLabel = {
    labelName: "Pincode",
    labelKey: "RP_PINCODE_LABEL"
}

export const colonyLabel = {
    labelName: "Colony",
    labelKey: "RP_COLONY_LABEL"
}

export const editSection = {
    componentPath: "Button",
    props: {
        color: "primary",
        style: {
          padding: "0px 16px",
          minHeight: "initial"
        }
    },
    gridDefination: {
        xs: 4,
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
            labelKey: "RP_SUMMARY_EDIT"
        })
    }
}

const masterEntryEditSection = (isEditable, index = 0) => ({
    ...editSection,
    visible: isEditable,
    onClickDefination: {
        action: "condition",
        callBack: (state, dispatch) => {
            changeStep(state, dispatch, "apply", "", index);
        }
    }
})

const propertyMasterEditSection = (isEditable, index = 0) => ({
    ...editSection,
    visible: isEditable,
    onClickDefination: {
        action: "condition",
        callBack: (state, dispatch) => {
            changePropertyStep(state, dispatch, "apply", "", index);
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
                        xs: 8,
                        sm: 10
                    },
                    ...getCommonSubHeader({
                        labelName: "Property Details",
                        labelKey: "RP_PROPERTY_DETAILS_HEADER"
                    })
                },
                editSection: propertyMasterEditSection(isEditable)
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
                    labelKey: "RP_AREA_PROPERTY_LABEL_IN_UNITS"
                },
                { jsonPath: "Properties[0].propertyDetails.area" }
            ),
        })
    })
}

export const getNoticeReviewProperty = (isEditable = true) => {
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
            propertyTransitNumber: getLabelWithValue(
                {
                    labelName: "Transit Site/Plot number",
                    labelKey: "RP_SITE_PLOT_LABEL"
                },
                { jsonPath: "Properties[0].transitNumber" }
            ),
            allotmentNumber: getLabelWithValue(
                {
                    labelName: "Allotment Number",
                    labelKey: "RP_ALLOTMENT_NUMBER_LABEL"
                },
                { jsonPath: "SingleProperties[0].allotmenNumber" }
            ),
            memoDate: getLabelWithValue(
                {
                    labelName: "Allotment Date",
                    labelKey: "RP_ALLOTMENT_DATE_LABEL"
                },
                { jsonPath: "SingleProperties[0].allotmentStartdate", callBack: convertEpochToDate }
            )
        })
    })
}

export const getNoticePreviewReviewProperty = (isEditable = true) => {
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
            propertyTransitNumber: getLabelWithValue(
                {
                    labelName: "Transit Site/Plot number",
                    labelKey: "RP_SITE_PLOT_LABEL"
                },
                { jsonPath: "Properties[0].transitNumber" }
            ),
            allotmentNumber: getLabelWithValue(
                {
                    labelName: "Allotment Number",
                    labelKey: "RP_ALLOTMENT_NUMBER_LABEL"
                },
                { jsonPath: "Properties[0].owners[1].allotmenNumber" }
            ),
            memoDate: getLabelWithValue(
                {
                    labelName: "Memo Date",
                    labelKey: "RP_MEMO_DATE_LABEL"
                },
                { jsonPath: "SingleProperties[0].memoDate" ,callBack: convertEpochToDate}
            )
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
                        xs: 8,
                        sm: 10
                    },
                    ...getCommonSubHeader({
                        labelName: "Owner Details",
                        labelKey: "RP_OWNER_DETAILS_HEADER"
                    })
                },
                editSection: propertyMasterEditSection(isEditable)
            }
        },
        viewFour: {
            uiFramework: "custom-containers-local",
            componentPath: "MultipleOwnerContainer",
            moduleName: "egov-rented-properties",
            props: {
                contents: [
                    {label: "RP_OWNER_NAME_LABEL",
                    jsonPath: "ownerDetails.name"},
                    {label: "RP_MOBILE_NO_LABEL",
                    jsonPath: "ownerDetails.phone"},
                    {label: "RP_FATHER_OR_HUSBANDS_NAME_LABEL",
                    jsonPath: "ownerDetails.fatherOrHusband"},
                    {label: "RP_COMMON_RELATIONSHIP_LABEL",
                    jsonPath: "ownerDetails.relation"},
                    {label: "RP_OWNER_DETAILS_EMAIL_LABEL",
                    jsonPath: "ownerDetails.email"},
                    {label: "RP_AADHAR_LABEL",
                    jsonPath: "ownerDetails.aadhaarNumber"},
                    {label: "RP_ALLOTMENT_NUMBER_LABEL",
                    jsonPath: "allotmenNumber"},
                    {label: "RP_ALLOTMENT_DATE_LABEL",
                    jsonPath: "ownerDetails.allotmentStartdate",
                    callBack: convertEpochToDate},
                    {label: "RP_POSSESSION_DATE_LABEL",
                    jsonPath: "ownerDetails.posessionStartdate",
                    callBack: convertEpochToDate}
                ],
                jsonPath: "Properties[0].owners"
            }
        }
    })
}


export const getReviewAddress = (isEditable = true) => {
    return getCommonGrayCard({
        headerDiv: {
            ...headerDiv,
            children: {
                header: {
                    gridDefination: {
                        xs: 8,
                        sm: 10
                    },
                    ...getCommonSubHeader({
                        labelName: "Address Details",
                        labelKey: "RP_ADDRESS_DETAILS_HEADER"
                    })
                },
                editSection: propertyMasterEditSection(isEditable)
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
                        xs: 8,
                        sm: 10
                    },
                    ...getCommonSubHeader({
                        labelName: "Rent Details",
                        labelKey: "RP_RENT_DETAILS_HEADER"
                    })
                },
                editSection: propertyMasterEditSection(isEditable)
            }
        },
        viewFour: getCommonContainer({
                // monthlyRentAmount: getLabelWithValue(
                //     {
                //         labelName: "Monthly Rent Amount",
                //         labelKey: "RP_MONTHLY_RENT_LABEL"
                //     },
                //     { jsonPath: "Properties[0].owners[0].ownerDetails.monthlyRent" }
                // ),
                interestRatePerYear: getLabelWithValue(
                    {
                        labelName: "Interest Rate/Year",
                        labelKey: "RP_INTEREST_RATE_PER_YEAR_LABEL"
                    },
                    { jsonPath: "Properties[0].propertyDetails.interestRate" }
                ),
                rentIncrementPeriod: getLabelWithValue(
                    {
                        labelName: "Rent Increment Period",
                        labelKey: "RP_RENT_INCREMENT_PERIOD_LABEL"
                    },
                    { jsonPath: "Properties[0].propertyDetails.rentIncrementPeriod" }
                ),
                rentIncrementPercentage: getLabelWithValue(
                    {
                        labelName: "Rent Increment Percentage",
                        labelKey: "RP_RENT_INCREMENT_PERCENTAGE_LABEL"
                    },
                    { jsonPath: "Properties[0].propertyDetails.rentIncrementPercentage" }
                )
        })
    })
}


export const getNoticeReviewRentDetails = (isEditable = true) => {
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
                        labelName: "Rent holder Particulars",
                        labelKey: "RP_RENT_HOLDER_PARTICULAR_HEADER"
                    })
                },
                editSection: masterEntryEditSection(isEditable)
            }
        },
        viewFour: getCommonContainer({
                violations: getLabelWithValue(
                    {
                        labelName: "Violations",
                        labelKey: "RP_VIOLATIONS_LABEL"
                    },
                    { jsonPath: "Properties[0].owners[0].ownerDetails.violations" }
                ),
                editor: getLabelWithValue(
                    {
                        labelName: "Editor",
                        labelKey: "RP_EDITOR_LABEL"
                    },
                    { jsonPath: "Properties[0].owners[0].ownerDetails.editor" }
                ),
        })
    })
}

export const getNoticeViolationPreviewReviewRentDetails = (isEditable = true) => {
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
                        labelName: "Rent holder Particulars",
                        labelKey: "RP_RENT_HOLDER_PARTICULAR_HEADER"
                    })
                },
                editSection: masterEntryEditSection(isEditable)
            }
        },
        viewFour: getCommonContainer({
            fatherOrHusbandsName: getLabelWithValue(
                    {
                        labelName: "Father/ Husband's Name",
                        labelKey: "RP_FATHER_OR_HUSBANDS_NAME_LABEL"
                    },
                    { jsonPath: "Properties[0].owners[0].ownerDetails.fatherOrHusband" }
                ),
                originalAllotte: getLabelWithValue(
                    {
                        labelName: "Owner Name",
                        labelKey: "RP_OWNER_NAME_LABEL"
                    },
                    { jsonPath: "SingleProperties[0].OwnerName" }
                ),
                violations: getLabelWithValue(
                    {
                        labelName: "Violations",
                        labelKey: "RP_VIOLATIONS_LABEL"
                    },
                    { jsonPath: "SingleProperties[0].violations" }
                ),
                editor: getLabelWithValue(
                    {
                        labelName: "Editor",
                        labelKey: "RP_EDITOR_LABEL"
                    },
                    { jsonPath: "SingleProperties[0].description" }
                ),
                // demandNoticeFromDate: getLabelWithValue(
                //     {
                //         labelName: "Demand Notice First Date",
                //         labelKey: "RP_DEMAND_NOTICE_FIRST_DATE"
                //     },
                //     { jsonPath: "SingleProperties[0].demandNoticeFrom", callBack: convertEpochToDate}
                // ),
                // demandNoticeLastDate: getLabelWithValue(
                //     {
                //         labelName: "Demand Notice Last Date",
                //         labelKey: "RP_DEMAND_NOTICE_LAST_DATE"
                //     },
                //     { jsonPath: "SingleProperties[0].demandNoticeTo", callBack: convertEpochToDate}
                // ),
                // recoveryType: getLabelWithValue(
                //     {
                //         labelName: "Recovery Type",
                //         labelKey: "RP_RECOVERY_TYPE"
                //     },
                //     { jsonPath: "SingleProperties[0].recoveryType" }
                // ),
                // paymentAmount: getLabelWithValue(
                //     {
                //         labelName: "Due Amount",
                //         labelKey: "RP_DUE_AMOUNT_LABEL"
                //     },
                //     { jsonPath: "SingleProperties[0].amount" }
                // ),
        })
    })
}

export const getNoticeRecoveryPreviewReviewRentDetails = (isEditable = true) => {
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
                        labelName: "Rent holder Particulars",
                        labelKey: "RP_RENT_HOLDER_PARTICULAR_HEADER"
                    })
                },
                editSection: masterEntryEditSection(isEditable)
            }
        },
        viewFour: getCommonContainer({
            fatherOrHusbandsName: getLabelWithValue(
                    {
                        labelName: "Father/ Husband's Name",
                        labelKey: "RP_FATHER_OR_HUSBANDS_NAME_LABEL"
                    },
                    { jsonPath: "Properties[0].owners[0].ownerDetails.fatherOrHusband" },
                    {visible: false}
                ),
                originalAllotte: getLabelWithValue(
                    {
                        labelName: "Owner Name",
                        labelKey: "RP_OWNER_NAME_LABEL"
                    },
                    { jsonPath: "SingleProperties[0].OwnerName" }
                ),
                // violations: getLabelWithValue(
                //     {
                //         labelName: "Violations",
                //         labelKey: "RP_VIOLATIONS_LABEL"
                //     },
                //     { jsonPath: "SingleProperties[0].violations" }
                // ),
                editor: getLabelWithValue(
                    {
                        labelName: "Editor",
                        labelKey: "RP_EDITOR_LABEL"
                    },
                    { jsonPath: "SingleProperties[0].description" }
                ),
                recoveryType: getLabelWithValue(
                    {
                        labelName: "Recovery Type",
                        labelKey: "RP_RECOVERY_TYPE"
                    },
                    { jsonPath: "SingleProperties[0].recoveryType" }
                ),
                paymentAmount: getLabelWithValue(
                    {
                        labelName: "Due Amount",
                        labelKey: "RP_DUE_AMOUNT_LABEL"
                    },
                    { jsonPath: "SingleProperties[0].amount" }
                ),
                // noticeId: getLabelWithValue(
                //     {
                //         labelName: "Notice Id",
                //         labelKey: "RP_NOTICE_ID"
                //     },
                //     { jsonPath: "SingleProperties[0].memoNumber" }
                // ),
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
                        xs: 8,
                        sm: 10
                    },
                    ...getCommonSubHeader({
                        labelName: "Rent Summary",
                        labelKey: "RP_RENT_SUMMARY_HEADER"
                    })
                },
                editSection: propertyMasterEditSection(isEditable, 2)
            }
        },
        viewFour: getCommonContainer({
                amountPaid: getLabelWithValue(
                    {
                        labelName: "Balance Principal",
                        labelKey: "RP_BALANCE_PRINCIPAL_LABEL"
                    },
                    { jsonPath: "Properties[0].formatrentSummary.balancePrincipal" }
                ),
                paymentDate: getLabelWithValue(
                    {
                        labelName: "Date of Payment",
                        labelKey: "RP_BALANCE_INTEREST_LABEL"
                    },
                    { jsonPath: "Properties[0].formatrentSummary.balanceInterest" }
                ),
                paymentMode: getLabelWithValue(
                    {
                        labelName: "Payment Mode",
                        labelKey: "RP_BALANCE_AMOUNT_LABEL"
                    },
                    { jsonPath: "Properties[0].formatrentSummary.balanceAmount" }
                ),
        })
    })
}

export const getGrantDetails = () => {
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
                        labelName: "Is Grant Availed : No",
                        labelKey: "RP_GRANT_DETAILS_AVAILED_NO"
                    })
                },
                
            }
        },
       
    })
}
export const getGrantDetailsAvailed = () => {
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
                        labelName: "Is Grant Availed : Yes",
                        labelKey: "RP_GRANT_DETAILS_AVAILED_YES"
                    })
                },
                
            }
        },
       
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