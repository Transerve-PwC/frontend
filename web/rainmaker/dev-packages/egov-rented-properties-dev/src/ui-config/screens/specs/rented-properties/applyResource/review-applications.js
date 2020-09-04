import {
    getCommonGrayCard,
    getCommonSubHeader,
    getCommonContainer,
    getLabelWithValue,
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { changeStep } from "./footer";
import { headerDiv, editSection, areaLabel, pincodeLabel, colonyLabel } from "./review-property";

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
const DuplicateLicenseEditSection = isEditable => ({
    ...editSection,
    visible: isEditable,
    onClickDefination: {
        action: "condition",
        callBack: (state, dispatch) => {
            changeStep(state, dispatch, "duplicate-copy-apply", "", 0);
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
                    jsonPath: "Owners[0].ownerDetails.email" 
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
            // propertyId: getLabelWithValue(
            //     {
            //         labelName: "Property Id",
            //         labelKey: "RP_PROPERTY_ID"
            //     },
            //     {jsonPath: "Owners[0].property.id"}
            // ),
            transitNumber: getLabelWithValue(
                {
                    labelName: "Transit Site/Plot number",
                    labelKey: "RP_SITE_PLOT_LABEL"
                },
                { jsonPath: "Owners[0].property.transitNumber" }
            ),
            allotmentNumber: getLabelWithValue(
                {
                    labelName: "Allotment Number",
                    labelKey: "RP_ALLOTMENT_NUMBER"
                },
                {jsonPath: "Owners[0].allotmenNumber"}
            ),
            area: getLabelWithValue(
                colonyLabel,
                { jsonPath: "Owners[0].property.colony" }
            ),
            pincode: getLabelWithValue(
                pincodeLabel,
                { jsonPath: "Owners[0].property.pincode" }
            ),
        })
    })
}
export const getreviewChargesDetails = (isEditable = true) => {
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
                        labelName: "Payment Charges Details",
                        labelKey: "RP_PAYMENT_CHARGES_HEADER"
                    })
                },
                //editSection: freshLicenseEditSection(isEditable)
            }
        },
        viewFour: getCommonContainer({
           
            applicationCharges: getLabelWithValue(
                {
                    labelName: "Application Charges",
                    labelKey: "RP_APPLICATION_CHARGES"
                },
                { jsonPath: "Owners[0].ownerDetails.dueAmount" }
            ),
           
        })
    })
}
export const getduplicatereviewChargesDetails = (isEditable = true) => {
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
                        labelName: "Payment Charges Details",
                        labelKey: "RP_PAYMENT_CHARGES_HEADER"
                    })
                },
                //editSection: freshLicenseEditSection(isEditable)
            }
        },
        viewFour: getCommonContainer({
           
            applicationCharges: getLabelWithValue(
                {
                    labelName: "Application Charges",
                    labelKey: "RP_APPLICATION_CHARGES"
                },
                { jsonPath: "DuplicateCopyApplications[0].applicant[0].feeAmount" }
            ),
           
        })
    })
}

export const getReviewPropertyDetailsWithoutAllotmentNumber = (isEditable = true) => {
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
                transitNumber: getLabelWithValue(
                    {
                        labelName: "Transit Site/Plot number",
                        labelKey: "RP_SITE_PLOT_LABEL"
                    },
                    { jsonPath: "Owners[0].property.transitNumber" }
                ),
                area: getLabelWithValue(
                    colonyLabel,
                    { jsonPath: "Owners[0].property.colony" }
                ),
                pincode: getLabelWithValue(
                    pincodeLabel,
                    { jsonPath: "Owners[0].property.pincode" }
                ),
            })
        })
    }



export const getDuplicateCopyPreviewApplicantDetails = (isEditable = true) => {
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
                editSection: DuplicateLicenseEditSection(isEditable)
            }
        },
        viewFour: getCommonContainer({
            ownerName: getLabelWithValue(
                {
                    labelName: "Applicant Name",
                    labelKey: "RP_APPLICANT_NAME_LABEL"
                },
                { jsonPath: "DuplicateCopyApplications[0].applicant[0].name" }
            ),
            relationship: getLabelWithValue(
                {
                    labelName: "Relationship",
                    labelKey: "TL_COMMON_RELATIONSHIP_LABEL"
                },
                { jsonPath: "DuplicateCopyApplications[0].applicant[0].relationship" }
            ),
            fatherOrHusband: getLabelWithValue(
                {
                    labelName: "Father/ Husband's Name",
                    labelKey: "TL_FATHER_OR_HUSBANDS_NAME_LABEL"
                },
                { jsonPath: "DuplicateCopyApplications[0].applicant[0].guardian" }
            ),
            phone: getLabelWithValue(
                {
                    labelName: "Mobile No.",
                    labelKey: "RP_MOBILE_NO_LABEL"
                },
                {
                    jsonPath: "DuplicateCopyApplications[0].applicant[0].phone" 
                }
            ),
            email: getLabelWithValue(
                {
                    labelName: "Email",
                    labelKey: "RP_OWNER_DETAILS_EMAIL_LABEL"
                },
                {
                    jsonPath: "DuplicateCopyApplications[0].applicant[0].email" 
                }
            ),
            aadhar: getLabelWithValue(
                {
                    labelName: "Aadhar Number",
                    labelKey: "RP_AADHAR_LABEL"
                },
                {
                    jsonPath: "DuplicateCopyApplications[0].applicant[0].adhaarNumber" 
                }
            )
        })
    })
}

export const getDuplicateCopyReviewPropertyAddressDetails = (isEditable = true) => {
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
                editSection: DuplicateLicenseEditSection(isEditable)
            }
        },
        viewFour: getCommonContainer({
           
            transitNumber: getLabelWithValue(
                {
                    labelName: "Transit Site/Plot number",
                    labelKey: "RP_SITE_PLOT_LABEL"
                },
                { jsonPath: "DuplicateCopyApplications[0].property.transitNumber" }
            ),
            colony: getLabelWithValue(
                colonyLabel,
                { jsonPath: "DuplicateCopyApplications[0].property.colony" }
            ),
            pincode: getLabelWithValue(
                pincodeLabel,
                { jsonPath: "DuplicateCopyApplications[0].property.pincode" }
            ),
        })
    })
}


