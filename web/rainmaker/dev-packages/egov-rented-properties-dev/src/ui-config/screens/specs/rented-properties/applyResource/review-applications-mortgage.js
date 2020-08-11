import {
    getCommonGrayCard,
    getCommonSubHeader,
    getCommonContainer,
    getLabelWithValue,
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { changeStep } from "./footer";
import { headerDiv, editSection, areaLabel, pincodeLabel } from "./review-property";

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
            allotmentNumber: getLabelWithValue(
                {
                    labelName: "Allotment Number",
                    labelKey: "RP_ALLOTMENT_NUMBER"
                },
                {jsonPath: "MortgageApplications[0].allotmentNumber"}
            ),
            area: getLabelWithValue(
                areaLabel,
                { jsonPath: "MortgageApplications[0].property.area" }
            ),
            pincode: getLabelWithValue(
                pincodeLabel,
                { jsonPath: "MortgageApplications[0].property.pincode" }
            ),
        })
    })
}