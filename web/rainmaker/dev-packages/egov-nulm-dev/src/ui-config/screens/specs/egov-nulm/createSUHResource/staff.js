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

export const staffDetails = getCommonCard({
    header: getCommonTitle(
        {
            labelName: "Staff",
            labelKey: "NULM_SUH_STAFF"
        },
        {
            style: {
                marginBottom: 18
            }
        }
    ),
    staffDetailsContainer: getCommonContainer({
        isManager: {
            uiFramework: "custom-containers",
            componentPath: "RadioGroupContainer",
            gridDefination: {
                xs: 6
            },
            jsonPath: "NulmSuhRequest.suhStaffMaintenance[0].isManager",
            type: "array",
            props: {
                jsonPath: "NulmSuhRequest.suhStaffMaintenance[0].isManager",
                label: { name: "Manager", key: "NULM_SUH_MANAGER" },
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
        managerRemark: {
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
                jsonPath: "NulmSuhRequest.suhStaffMaintenance[0].managerRemark"
            })
        },
        isSecurityStaff: {
            uiFramework: "custom-containers",
            componentPath: "RadioGroupContainer",
            gridDefination: {
                xs: 6
            },
            jsonPath: "NulmSuhRequest.suhStaffMaintenance[0].isSecurityStaff",
            type: "array",
            props: {
                jsonPath: "NulmSuhRequest.suhStaffMaintenance[0].isSecurityStaff",
                label: { name: "Security staff", key: "NULM_SUH_SECURITY_STAFF" },
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
        securityStaffRemark: {
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
                jsonPath: "NulmSuhRequest.suhStaffMaintenance[0].securityStaffRemark"
            })
        },
        isCleaner: {
            uiFramework: "custom-containers",
            componentPath: "RadioGroupContainer",
            gridDefination: {
                xs: 6
            },
            jsonPath: "NulmSuhRequest.suhStaffMaintenance[0].isCleaner",
            type: "array",
            props: {
                jsonPath: "NulmSuhRequest.suhStaffMaintenance[0].isCleaner",
                label: { name: "Cleaner", key: "NULM_SUH_CLEANER" },
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
        cleanerRemark: {
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
                jsonPath: "NulmSuhRequest.suhStaffMaintenance[0].cleanerRemark"
            })
        },
    })
});