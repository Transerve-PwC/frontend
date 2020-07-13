import {
    getCommonGrayCard,
    getCommonSubHeader,
    getCommonContainer,
    getLabelWithValue,
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { changeStep } from "./footer";
import { headerDiv, editSection, areaLabel, pincodeLabel } from "./review-property";

const freshLicenseEditSection = isEditable => ({
    ...editSection,
    visible: isEditable,
    onClickDefination: {
        action: "condition",
        callBack: (state, dispatch) => {
            changeStep(state, dispatch, "ownership-apply", "", 0);
        }
    }
})

export const getReviewApplicantDetails = (isEditable = true) => {
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
                editSection: freshLicenseEditSection(isEditable)
            }
        },
        viewFour: getCommonContainer({
            ownerName: getLabelWithValue(
                {
                    labelName: "Applicant Name",
                    labelKey: "RP_APPLICANT_NAME_LABEL"
                },
                { jsonPath: "Owners[0].ownerDetails.name" }
            ),
            relationship: getLabelWithValue(
                {
                    labelName: "Relationship",
                    labelKey: "TL_COMMON_RELATIONSHIP_LABEL"
                },
                { jsonPath: "Owners[0].ownerDetails.relationWithDeceasedAllottee" }
            ),
            phone: getLabelWithValue(
                {
                    labelName: "Mobile No.",
                    labelKey: "RP_MOBILE_NO_LABEL"
                },
                {
                    jsonPath: "Owners[0].ownerDetails.phone" 
                }
            ),
            email: getLabelWithValue(
                {
                    labelName: "Email",
                    labelKey: "RP_OWNER_DETAILS_EMAIL_LABEL"
                },
                {
                    jsonPath: "Owners[0].ownerDetails.eamil" 
                }
            ),
            aadhar: getLabelWithValue(
                {
                    labelName: "Aadhar Number",
                    labelKey: "RP_AADHAR_LABEL"
                },
                {
                    jsonPath: "Owners[0].ownerDetails.aadhaarNumber" 
                }
            )
        })
    })
}

export const getreviewPropertyAddressDetails = (isEditable = true) => {
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
                editSection: freshLicenseEditSection(isEditable)
            }
        },
        viewFour: getCommonContainer({
            propertyId: getLabelWithValue(
                {
                    labelName: "Property Id",
                    labelKey: "RP_PROPERTY_ID"
                },
                {jsonPath: "Owners[0].property.id"}
            ),
            allotmentNumber: getLabelWithValue(
                {
                    labelName: "Allotment Number",
                    labelKey: "RP_ALLOTMENT_NUMBER"
                },
                {jsonPath: "Owners[0].allotmenNumber"}
            ),
            transitNumber: getLabelWithValue(
                {
                    labelName: "Transit Site/Plot number",
                    labelKey: "RP_SITE_PLOT_LABEL"
                },
                { jsonPath: "Owners[0].property.transitNumber" }
            )
            // area: getLabelWithValue(
            //     areaLabel,
            //     { jsonPath: "Properties[0].propertyDetails.address.area" }
            // ),
            // pincode: getLabelWithValue(
            //     pincodeLabel,
            //     { jsonPath: "Properties[0].propertyDetails.address.pincode" }
            // ),
        })
    })
}