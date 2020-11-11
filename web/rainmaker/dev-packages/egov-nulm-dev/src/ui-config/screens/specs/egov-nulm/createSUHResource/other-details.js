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

export const otherDetails = getCommonCard({
    header: getCommonTitle(
        {
            labelName: "Other Details",
            labelKey: "NULM_SUH_OTHER_DETAILS"
        },
        {
            style: {
                marginBottom: 18
            }
        }
    ),
    otherDetailsContainer: getCommonContainer({
        isConstitutionOfShelterManagementCommittee: {
            uiFramework: "custom-containers",
            componentPath: "RadioGroupContainer",
            gridDefination: {
                xs: 6
            },
            jsonPath: "NulmSuhRequest.isConstitutionOfShelterManagementCommittee",
            type: "array",
            props: {
                jsonPath: "NulmSuhRequest.isConstitutionOfShelterManagementCommittee",
                label: { name: "Constitution of shelter management committee", key: "NULM_SUH_CONSTITUTION_OF_SHELTER_MANAGEMENT_COMMITTEE" },
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
        constitutionOfShelterManagementCommitteeRemark: {
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
                jsonPath: "NulmSuhRequest.constitutionOfShelterManagementCommitteeRemark"
            })
        },
        isSocialAudit: {
            uiFramework: "custom-containers",
            componentPath: "RadioGroupContainer",
            gridDefination: {
                xs: 6
            },
            jsonPath: "NulmSuhRequest.isSocialAudit",
            type: "array",
            props: {
                jsonPath: "NulmSuhRequest.isSocialAudit",
                label: { name: "Social audit of shelter", key: "NULM_SUH_SOCIAL_AUDIT_OF_SHELTER" },
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
        socialAuditRemark: {
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
                jsonPath: "NulmSuhRequest.socialAuditRemark"
            })
        },
        isLinkageToCentralGovtWelfareSchemes: {
            uiFramework: "custom-containers",
            componentPath: "RadioGroupContainer",
            gridDefination: {
                xs: 6
            },
            jsonPath: "NulmSuhRequest.isLinkageToCentralGovtWelfareSchemes",
            type: "array",
            props: {
                jsonPath: "NulmSuhRequest.isLinkageToCentralGovtWelfareSchemes",
                label: { name: "Linkage to central govt. Welfare schemes eg. Day nulm", key: "NULM_SUH_LINKAGE_TO_CENTRAL_GOVT_WELFARE_SCHEMES_EG_DAY_NULM" },
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
        linkageToCentralGovtWelfareSchemesRemark: {
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
                jsonPath: "NulmSuhRequest.linkageToCentralGovtWelfareSchemesRemark"
            })
        },
        isLinkageToPublicHealthInitiatives: {
            uiFramework: "custom-containers",
            componentPath: "RadioGroupContainer",
            gridDefination: {
                xs: 6
            },
            jsonPath: "NulmSuhRequest.isLinkageToPublicHealthInitiatives",
            type: "array",
            props: {
                jsonPath: "NulmSuhRequest.isLinkageToPublicHealthInitiatives",
                label: { name: "Linkage to public health initiatives", key: "NULM_SUH_LINKAGE_TO_PUBLIC_HEALTH_INITIATIVES" },
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
        linkageToPublicHealthInitiativesRemark: {
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
                jsonPath: "NulmSuhRequest.linkageToPublicHealthInitiativesRemark"
            })
        },
        isLinkageToOtherGovtSchemes: {
            uiFramework: "custom-containers",
            componentPath: "RadioGroupContainer",
            gridDefination: {
                xs: 6
            },
            jsonPath: "NulmSuhRequest.isLinkageToOtherGovtSchemes",
            type: "array",
            props: {
                jsonPath: "NulmSuhRequest.isLinkageToOtherGovtSchemes",
                label: { name: "Linkage to other govt. Schemes on education, swachhata abhiyan etc.", key: "NULM_SUH_LINKAGE_TO_OTHER_GOVT_SCHEMES" },
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
        linkageToOtherGovtSchemesRemark: {
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
                jsonPath: "NulmSuhRequest.linkageToOtherGovtSchemesRemark"
            })
        },
        isLinkageToLocalCommunity: {
            uiFramework: "custom-containers",
            componentPath: "RadioGroupContainer",
            gridDefination: {
                xs: 6
            },
            jsonPath: "NulmSuhRequest.isLinkageToLocalCommunity",
            type: "array",
            props: {
                jsonPath: "NulmSuhRequest.isLinkageToLocalCommunity",
                label: { name: "Linkage to local community ", key: "NULM_SUH_LINKAGE_TO_LOCAL_COMMUNITY " },
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
        linkageToLocalCommunityRemark: {
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
                jsonPath: "NulmSuhRequest.linkageToLocalCommunityRemark"
            })
        },
        isLinkageToSocialWorkersAndPhilanthropists: {
            uiFramework: "custom-containers",
            componentPath: "RadioGroupContainer",
            gridDefination: {
                xs: 6
            },
            jsonPath: "NulmSuhRequest.isLinkageToSocialWorkersAndPhilanthropists",
            type: "array",
            props: {
                jsonPath: "NulmSuhRequest.isLinkageToSocialWorkersAndPhilanthropists",
                label: { name: "Linkage to social workers and philanthropists", key: "NULM_SUH_LINKAGE_TO_SOCIAL_WORKERS_AND_PHILANTHROPISTS " },
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
        linkageToSocialWorkersAndPhilanthropistsRemark: {
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
                jsonPath: "NulmSuhRequest.linkageToSocialWorkersAndPhilanthropistsRemark"
            })
        },
        isUserCharges: {
            uiFramework: "custom-containers",
            componentPath: "RadioGroupContainer",
            gridDefination: {
                xs: 6
            },
            jsonPath: "NulmSuhRequest.isUserCharges",
            type: "array",
            props: {
                jsonPath: "NulmSuhRequest.isUserCharges",
                label: { name: "User charges", key: "NULM_SUH_USER_CHARGES" },
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
        userChargesRemark: {
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
                jsonPath: "NulmSuhRequest.userChargesRemark"
            })
        },
        isIECAndPromotionalInitiatives: {
            uiFramework: "custom-containers",
            componentPath: "RadioGroupContainer",
            gridDefination: {
                xs: 6
            },
            jsonPath: "NulmSuhRequest.isIECAndPromotionalInitiatives",
            type: "array",
            props: {
                jsonPath: "NulmSuhRequest.isIECAndPromotionalInitiatives",
                label: { name: "IEC and promotional initiatives", key: "NULM_SUH_IEC_AND_PROMOTIONAL_INITIATIVES" },
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
        iecAndPromotionalInitiativesRemark: {
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
                jsonPath: "NulmSuhRequest.iecAndPromotionalInitiativesRemark"
            })
        },
        isQuarterlyReporting: {
            uiFramework: "custom-containers",
            componentPath: "RadioGroupContainer",
            gridDefination: {
                xs: 6
            },
            jsonPath: "NulmSuhRequest.isQuarterlyReporting",
            type: "array",
            props: {
                jsonPath: "NulmSuhRequest.isQuarterlyReporting",
                label: { name: "Quarterly reporting", key: "NULM_SUH_QUARTERLY_REPORTING" },
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
        quarterlyReportingRemark: {
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
                jsonPath: "NulmSuhRequest.quarterlyReportingRemark"
            })
        },
        isVisits: {
            uiFramework: "custom-containers",
            componentPath: "RadioGroupContainer",
            gridDefination: {
                xs: 6
            },
            jsonPath: "NulmSuhRequest.isVisits",
            type: "array",
            props: {
                jsonPath: "NulmSuhRequest.isVisits",
                label: { name: "Visits by local ward legislative members/administrative officers", key: "NULM_SUH_VISITS_BY_LOCAL_WARD_LEGISLATIVE_MEMBERS_ADMINISTRATIVE_OFFICERS" },
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
        visitsRemark: {
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
                jsonPath: "NulmSuhRequest.visitsRemark"
            })
        },
    })
});