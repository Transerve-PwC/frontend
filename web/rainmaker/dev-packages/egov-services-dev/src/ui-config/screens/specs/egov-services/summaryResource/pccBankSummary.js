import {
    getBreak,
    getCommonContainer,
    getCommonGrayCard,
    getCommonSubHeader,
    getLabel,
    getLabelWithValue,
    convertEpochToDate,
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { gotoApplyWithStep } from "../../utils/index";
import { getTransformedLocale } from "egov-ui-framework/ui-utils/commons";




export const pccBankSummary = getCommonGrayCard({
    header: {
        uiFramework: "custom-atoms",
        componentPath: "Container",
        props: {
            style: { marginBottom: "10px" },
        },
        children: {
            header: {
                gridDefination: {
                    xs: 8,
                },
                ...getCommonSubHeader({
                    labelName: "Bank Details",
                    labelKey: "BK_PCC_BANK_DETAILS_HEADER",
                }),
            },
            
        },
    },
    cardOne: {
        uiFramework: "custom-containers",
        componentPath: "MultiItem",
        props: {
            className: "sellmeatapplicant-summary",
            scheama: getCommonGrayCard({
                applicantContainer: getCommonContainer({
                    bkBankName: getLabelWithValue(
                        {
                            labelName: "Bank Name",
                            labelKey: "BK_PCC_BANK_NAME_LABEL",
                        },
                        {
                            jsonPath: "Booking.bkBankName",
                        }
                    ),
                    bkBankAccountNumber: getLabelWithValue(
                        {
                            labelName: "Account Number",
                            labelKey: "BK_PCC_ACCOUNT_NUMBER_LABEL",
                        },
                        {
                            jsonPath: "Booking.bkBankAccountNumber",
                        }
                    ),
                    bkIfscCode: getLabelWithValue(
                        {
                            labelName: "IFSC Code",
                            labelKey: "BK_PCC_IFSC_CODE_LABEL",
                        },
                        {
                            jsonPath: "Booking.bkIfscCode",
                        }
                    ),
                    bkAccountHolderName: getLabelWithValue(
                      
                        {
                            labelName: "Account Holder Name",
                            labelKey: "BK_PCC_ACCOUNT_HOLDER_NAME_LABEL",
                        },
                        {
                            jsonPath: "Booking.bkBankAccountHolder",
                        }
                    ),
                    bankAccountTypeRadioGroup: getLabelWithValue(
                        {
                            labelName: "Bank Account Type",
                            labelKey: "BK_PCC_BANK_ACCOUNT_TYPE_LABEL",
                        },
                        {
                            jsonPath: "Booking.bkAccountType",
                        }
                    ),
                    
                   
                }),
            }),
            items: [],
            hasAddItem: false,
            isReviewPage: true,
            sourceJsonPath: "Booking",
        },
        type: "array",
    },
});
    