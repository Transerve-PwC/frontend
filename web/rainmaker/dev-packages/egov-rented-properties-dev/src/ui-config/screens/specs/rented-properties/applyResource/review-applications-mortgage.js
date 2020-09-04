import {
    getCommonGrayCard,
    getCommonSubHeader,
    getCommonContainer,
    getLabelWithValue,
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { changeStep } from "./footer";
import { headerDiv, editSection, areaLabel,colonyLabel, pincodeLabel } from "./review-property";
import { convertEpochToDate, } from "../../utils";

const mortgageEditSection = isEditable => ({
    ...editSection,
    visible: isEditable,
    onClickDefination: {
        action: "condition",
        callBack: (state, dispatch) => {
            changeStep(state, dispatch, "mortage-apply", "", 0);
        }
    }
})

export const getReviewApplicantDetailsMortgage = (isEditable = true) => {
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
                        labelName: "Applicant Details",
                        labelKey: "RP_APPLICANT_DETAILS_HEADER"
                    })
                },
                editSection: mortgageEditSection(isEditable)
            }
        },
        viewFour: getCommonContainer({
            ownerName: getLabelWithValue(
                {
                    labelName: "Applicant Name",
                    labelKey: "RP_APPLICANT_NAME_LABEL"
                },
                { jsonPath: "MortgageApplications[0].applicant[0].name" }
            ),
            relationship: getLabelWithValue(
                {
                    labelName: "Relationship",
                    labelKey: "TL_COMMON_RELATIONSHIP_LABEL"
                },
                { jsonPath: "MortgageApplications[0].applicant[0].relationship" }
            ),
            phone: getLabelWithValue(
                {
                    labelName: "Mobile No.",
                    labelKey: "RP_MOBILE_NO_LABEL"
                },
                {
                    jsonPath: "MortgageApplications[0].applicant[0].phone" 
                }
            ),
            guardian: getLabelWithValue(
                {
                    labelName: "Father/ Husband's Name",
                    labelKey: "TL_FATHER_OR_HUSBANDS_NAME_LABEL"
                },
                {
                    jsonPath: "MortgageApplications[0].applicant[0].guardian" 
                }
            ),
            
            email: getLabelWithValue(
                {
                    labelName: "Email",
                    labelKey: "RP_OWNER_DETAILS_EMAIL_LABEL"
                },
                {
                    jsonPath: "MortgageApplications[0].applicant[0].email" 
                }
            ),
            aadhar: getLabelWithValue(
                {
                    labelName: "Aadhar Number",
                    labelKey: "RP_AADHAR_LABEL"
                },
                {
                    jsonPath: "MortgageApplications[0].applicant[0].adhaarNumber" 
                }
            )
        })
    })
}

export const getreviewPropertyAddressDetailsMortgage = (isEditable = true) => {
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
                editSection: mortgageEditSection(isEditable)
            }
        },
        viewFour: getCommonContainer({
            transitNumber: getLabelWithValue(
                {
                    labelName: "Transit Site/Plot number",
                    labelKey: "RP_SITE_PLOT_LABEL"
                },
                { jsonPath: "MortgageApplications[0].property.transitNumber" }
            ),
            // allotmentNumber: getLabelWithValue(
            //     {
            //         labelName: "Allotment Number",
            //         labelKey: "RP_ALLOTMENT_NUMBER"
            //     },
            //     {jsonPath: "MortgageApplications[0].allotmentNumber"}
            // ),
            area: getLabelWithValue(
                colonyLabel,
                { jsonPath: "MortgageApplications[0].property.colony" }
            ),
            pincode: getLabelWithValue(
                pincodeLabel,
                { jsonPath: "MortgageApplications[0].property.pincode" }
            ),
        })
    })
}


export const getreviewGrantDetailsMortgage = () => {
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
            bankname: getLabelWithValue(
                {
                    labelName: "Name of the bank (Text field)",
                    labelKey: "WF_BANK_NAME"
                },
                { jsonPath: "MortgageApplications[0].mortgageApprovedGrantDetails[0].bankName" }
            ),
            mortagageAmount: getLabelWithValue(
                {
                    labelName: "Enter mortgage amount",
                    labelKey: "WF_MORTAGE_AMOUNT"
                },
                {jsonPath: "MortgageApplications[0].mortgageApprovedGrantDetails[0].mortgageAmount"}
            ),
            mortagageEndDate: getLabelWithValue(
                {
                    labelName: "Mortgage end date ",
                        labelKey: "WF_MORTAGAGEEND_DATE_LABEL"
                },
                { jsonPath: "MortgageApplications[0].mortgageApprovedGrantDetails[0].mortgageEndDate" , callBack: convertEpochToDate}
            ),
            sanctionDate: getLabelWithValue(
                {
                    labelName: "Date of sanctioning",
                        labelKey: "WF_SANCTIONING_DATE_LABEL"
                },
                { jsonPath: "MortgageApplications[0].mortgageApprovedGrantDetails[0].sanctionDate", callBack: convertEpochToDate }
            ),
            sanctionLetterNumber: getLabelWithValue(
                {
                    labelName: "Sanction letter number",
                    labelKey: "WF_SANCTION_LETTER_LABEL"
                },
                {jsonPath: "MortgageApplications[0].mortgageApprovedGrantDetails[0].sanctionLetterNumber"}
            ),
        })
    })
}