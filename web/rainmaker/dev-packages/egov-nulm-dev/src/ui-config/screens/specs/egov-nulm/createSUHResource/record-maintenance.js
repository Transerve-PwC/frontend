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

export const recordMaintenance = getCommonCard({
    header: getCommonTitle(
        {
            labelName: "Record Maintenance",
            labelKey: "NULM_SUH_RECORD_MAINTENANCE"
        },
        {
            style: {
                marginBottom: 18
            }
        }
    ),
    recordMaintenanceContainer: getCommonContainer({
        isAssetInventoryRegister: {
            uiFramework: "custom-containers",
            componentPath: "RadioGroupContainer",
            gridDefination: {
                xs: 6
            },
            jsonPath: "NulmSuhRequest.suhRecordMaintenance[0].isAssetInventoryRegister",
            type: "array",
            props: {
                jsonPath: "NulmSuhRequest.suhRecordMaintenance[0].isAssetInventoryRegister",
                label: { name: "Asset inventory register", key: "NULM_SUH_ASSET_INVENTORY_REGISTER" },
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
        assetInventoryRegisterRemark: {
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
                jsonPath: "NulmSuhRequest.suhRecordMaintenance[0].assetInventoryRegisterRemark"
            })
        },
        isAccountRegister: {
            uiFramework: "custom-containers",
            componentPath: "RadioGroupContainer",
            gridDefination: {
                xs: 6
            },
            jsonPath: "NulmSuhRequest.suhRecordMaintenance[0].isAccountRegister",
            type: "array",
            props: {
                jsonPath: "NulmSuhRequest.suhRecordMaintenance[0].isAccountRegister",
                label: { name: "Account register/cash book of receipts", key: "NULM_SUH_ACCOUNT_REGISTER_CASH_BOOK_OF_RECEIPTS" },
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
        accountRegisterRemark: {
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
                jsonPath: "NulmSuhRequest.suhRecordMaintenance[0].accountRegisterRemark"
            })
        },
        isAttendanceRegisterOfStaff: {
            uiFramework: "custom-containers",
            componentPath: "RadioGroupContainer",
            gridDefination: {
                xs: 6
            },
            jsonPath: "NulmSuhRequest.suhRecordMaintenance[0].isAttendanceRegisterOfStaff",
            type: "array",
            props: {
                jsonPath: "NulmSuhRequest.suhRecordMaintenance[0].isAttendanceRegisterOfStaff",
                label: { name: "Attendance register of staff", key: "NULM_SUH_ATTENDANCE_REGISTER_OF_STAFF" },
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
        attendanceRegisterOfStaffRemark: {
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
                jsonPath: "NulmSuhRequest.suhRecordMaintenance[0].attendanceRegisterOfStaffRemark"
            })
        },
        isShelterManagementCommitteeRegister: {
            uiFramework: "custom-containers",
            componentPath: "RadioGroupContainer",
            gridDefination: {
                xs: 6
            },
            jsonPath: "NulmSuhRequest.suhRecordMaintenance[0].isShelterManagementCommitteeRegister",
            type: "array",
            props: {
                jsonPath: "NulmSuhRequest.suhRecordMaintenance[0].isShelterManagementCommitteeRegister",
                label: { name: "Shelter management committee register", key: "NULM_SUH_SHELTER_MANAGEMENT_COMMITTEE_REGISTER" },
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
        shelterManagementCommitteeRegisteRemark: {
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
                jsonPath: "NulmSuhRequest.suhRecordMaintenance[0].shelterManagementCommitteeRegisteRemark"
            })
        },
        isPersonnelAndSalaryRegister: {
            uiFramework: "custom-containers",
            componentPath: "RadioGroupContainer",
            gridDefination: {
                xs: 6
            },
            jsonPath: "NulmSuhRequest.suhRecordMaintenance[0].isPersonnelAndSalaryRegister",
            type: "array",
            props: {
                jsonPath: "NulmSuhRequest.suhRecordMaintenance[0].isPersonnelAndSalaryRegister",
                label: { name: "Personnel register and salary register", key: "NULM_SUH_PERSONNEL_REGISTER_AND_SALARY_REGISTER" },
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
        personnelAndSalaryRegisterRemark: {
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
                jsonPath: "NulmSuhRequest.suhRecordMaintenance[0].personnelAndSalaryRegisterRemark"
            })
        },
        isHousekeepingAndMaintenanceRegister: {
            uiFramework: "custom-containers",
            componentPath: "RadioGroupContainer",
            gridDefination: {
                xs: 6
            },
            jsonPath: "NulmSuhRequest.suhRecordMaintenance[0].isHousekeepingAndMaintenanceRegister",
            type: "array",
            props: {
                jsonPath: "NulmSuhRequest.suhRecordMaintenance[0].isHousekeepingAndMaintenanceRegister",
                label: { name: "Housekeeping and maintenance register", key: "NULM_SUH_HOUSEKEEPING_AND_MAINTENANCE_REGISTER" },
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
        housekeepingAndMaintenanceRegisterRemark: {
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
                jsonPath: "NulmSuhRequest.suhRecordMaintenance[0].housekeepingAndMaintenanceRegisterRemark"
            })
        },
        isComplaintAndSuggestionRegister: {
            uiFramework: "custom-containers",
            componentPath: "RadioGroupContainer",
            gridDefination: {
                xs: 6
            },
            jsonPath: "NulmSuhRequest.suhRecordMaintenance[0].isComplaintAndSuggestionRegister",
            type: "array",
            props: {
                jsonPath: "NulmSuhRequest.suhRecordMaintenance[0].isComplaintAndSuggestionRegister",
                label: { name: "Complaint and suggestion register", key: "NULM_SUH_COMPLAINT_AND_SUGGESTION_REGISTER" },
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
        complaintAndSuggestionRegisterRemark: {
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
                jsonPath: "NulmSuhRequest.suhRecordMaintenance[0].complaintAndSuggestionRegisterRemark"
            })
        },
        isVisitorRegister: {
            uiFramework: "custom-containers",
            componentPath: "RadioGroupContainer",
            gridDefination: {
                xs: 6
            },
            jsonPath: "NulmSuhRequest.suhRecordMaintenance[0].isVisitorRegister",
            type: "array",
            props: {
                jsonPath: "NulmSuhRequest.suhRecordMaintenance[0].isVisitorRegister",
                label: { name: "Visitor register", key: "NULM_SUH_VISITOR_REGISTER" },
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
        visitorRegisterRemark: {
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
                jsonPath: "NulmSuhRequest.suhRecordMaintenance[0].visitorRegisterRemark"
            })
        },
        isProfileRegister: {
            uiFramework: "custom-containers",
            componentPath: "RadioGroupContainer",
            gridDefination: {
                xs: 6
            },
            jsonPath: "NulmSuhRequest.suhRecordMaintenance[0].isProfileRegister",
            type: "array",
            props: {
                jsonPath: "NulmSuhRequest.suhRecordMaintenance[0].isProfileRegister",
                label: { name: "Profile register", key: "NULM_SUH_PROFILE_REGISTER" },
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
        profileRegisterRemark: {
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
                jsonPath: "NulmSuhRequest.suhRecordMaintenance[0].profileRegisterRemark"
            })
        },
    })
});