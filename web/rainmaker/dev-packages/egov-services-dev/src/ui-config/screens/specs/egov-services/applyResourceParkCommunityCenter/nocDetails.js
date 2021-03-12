import {
    getBreak,
    getCommonCard,
    getCommonContainer,
    getCommonTitle,
    getTextField,
    getSelectField,
    getPattern,
    getRadioButton,
} from "egov-ui-framework/ui-config/screens/specs/utils";

import {
    handleScreenConfigurationFieldChange as handleField,
    prepareFinalObject,
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import get from "lodash/get";
import { toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import {
    furnishNocResponse,
    getSearchResults,
} from "../../../../../ui-utils/commons";

export const personalDetails = getCommonCard({
    // header: getCommonTitle(
    //   {
    //     labelName: "Applicant Details",
    //     labelKey: "BK_PCC_HEADER_STEP_1",
    //   },
    //   {
    //     style: {
    //       marginBottom: 18,
    //     },
    //   }
    // ),
    // break: getBreak(),
    personalDetailsContainer: getCommonContainer({
        bkApplicantName: {
            ...getTextField({
                label: {
                    labelName: "Applicant Name",
                    labelKey: "BK_PCC_NAME_LABEL",
                },
                placeholder: {
                    labelName: "Enter Applicant Name",
                    labelKey: "BK_PCC_NAME_PLACEHOLDER",
                },
                required: true,
                pattern: getPattern("Name"),
                errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
                jsonPath: "Booking.bkApplicantName",
            }),
        },
        bkEmail: {
            ...getTextField({
                label: {
                    labelName: "Email Address",
                    labelKey: "BK_OSB_EMAIL_LABEL",
                },
                placeholder: {
                    labelName: "Enter Email Address",
                    labelKey: "BK_PCC_EMAIL_PLACEHOLDER",
                },
                required: true,
                pattern: getPattern("Email"),
                errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
                requiredMessage: "required Message",
                jsonPath: "Booking.bkEmail",
                props: {
                    required: true,
                },
            }),
        },
        bkMobileNumber: {
            ...getTextField({
                label: {
                    labelName: "Contact Number",
                    labelKey: "BK_PCC_MOBILE_NO_LABEL",
                },
                placeholder: {
                    labelName: "Enter Contact Number",
                    labelKey: "BK_PCC_MOBILE_NO_PLACEHOLDER",
                },
                required: true,
                pattern: getPattern("MobileNo"),
                errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
                jsonPath: "Booking.bkMobileNumber",
            }),
        },
        bkHouseNo: {
            ...getTextField({
                label: {
                    labelName: "House/Site No.",
                    labelKey: "BK_PCC_HOUSE_NUMBER_LABEL",
                },
                placeholder: {
                    labelName: "Enter House No",
                    labelKey: "BK_PCC_HOUSE_NUMBER_LABEL",
                },
                pattern: getPattern("DoorHouseNo"),
                errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
                // helperText : "new helper outside",
                required: true,
                jsonPath: "Booking.bkHouseNo",
                props: {
                    required: true,
                    helperText: "custom helper text",
                },
            }),
        },
        dummyDiv: {
            uiFramework: "custom-atoms",
            componentPath: "Div",
            gridDefination: {
                xs: 12,
                sm: 12,
                md: 6,
            },
            props: {
                disabled: true,
            },
        },
    }),
});
export const personalDetailsDisabled = getCommonCard({
    // header: getCommonTitle(
    //   {
    //     labelName: "Applicant Details",
    //     labelKey: "BK_PCC_HEADER_STEP_1",
    //   },
    //   {
    //     style: {
    //       marginBottom: 18,
    //     },
    //   }
    // ),
    // break: getBreak(),
    personalDetailsContainerDisabled: getCommonContainer({
        bkApplicantNameDisabled: {
            ...getTextField({
                label: {
                    labelName: "Applicant Name",
                    labelKey: "BK_PCC_NAME_LABEL",
                },
                placeholder: {
                    labelName: "Enter Applicant Name",
                    labelKey: "BK_PCC_NAME_PLACEHOLDER",
                },
                required: true,
                props: {
                    disabled: true,
                },
                pattern: getPattern("Name"),
                errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
                jsonPath: "Booking.bkApplicantName",
            }),
        },
        bkEmailDisabled: {
            ...getTextField({
                label: {
                    labelName: "Email Address",
                    labelKey: "BK_OSB_EMAIL_LABEL",
                },
                placeholder: {
                    labelName: "Enter Email Address",
                    labelKey: "BK_PCC_EMAIL_PLACEHOLDER",
                },
                required: true,
             
                pattern: getPattern("Email"),
                errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
                requiredMessage: "required Message",
                jsonPath: "Booking.bkEmail",
                props: {
                    required: true,
                    disabled: true,
                },
            }),
        },
        bkMobileNumberDisabled: {
            ...getTextField({
                label: {
                    labelName: "Contact Number",
                    labelKey: "BK_PCC_MOBILE_NO_LABEL",
                },
                placeholder: {
                    labelName: "Enter Contact Number",
                    labelKey: "BK_PCC_MOBILE_NO_PLACEHOLDER",
                },
                required: true,
                props: {
                    disabled: true,
                },
                pattern: getPattern("MobileNo"),
                errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
                jsonPath: "Booking.bkMobileNumber",
            }),
        },
        bkHouseNoDisabled: {
            ...getTextField({
                label: {
                    labelName: "House/Site No.",
                    labelKey: "BK_PCC_HOUSE_NUMBER_LABEL",
                },
                placeholder: {
                    labelName: "Enter House No",
                    labelKey: "BK_PCC_HOUSE_NUMBER_LABEL",
                },
                pattern: getPattern("DoorHouseNo"),
                errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
                // helperText : "new helper outside",
                required: true,
         
                jsonPath: "Booking.bkHouseNo",
                props: {
                    required: true,
                    helperText: "custom helper text",
                    disabled: true,
                },
            }),
        },
        dummyDiv: {
            uiFramework: "custom-atoms",
            componentPath: "Div",
            gridDefination: {
                xs: 12,
                sm: 12,
                md: 6,
            },
            props: {
                disabled: true,
            },
        },
    }),
});


export const bankAccountDetails = getCommonCard({
    // header: getCommonTitle(
    //   {
    //     labelName: "Applicant Details",
    //     labelKey: "BK_PCC_HEADER_STEP_1",
    //   },
    //   {
    //     style: {
    //       marginBottom: 18,
    //     },
    //   }
    // ),
    // break: getBreak(),

    personalDetailsContainer: getCommonContainer({
        bkAccountName: {
            ...getTextField({
                label: {
                    labelName: "Bank Name(For security refund)",
                    labelKey:  "Bank Name(For security refund)",
                    
                   },
                placeholder: {
                    labelName: "Bank Name",
                    labelKey:  "Bank Name",
                 
                },
                required: true,
                pattern: getPattern("Name"),
                errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
                jsonPath: "Booking.bkBankName",
            }),
        },

        bkAccountNumber: {
            ...getTextField({
                label: {
                    labelName: "Account Number",
                    labelKey: "Account Number",
                    //labelKey: "BK_PCC_ACCOUNT_NUMBER_LABEL",
                },
                placeholder: {
                    labelName: "Account Number",
                    labelKey: "Account Number",
                    //labelKey: "BK_PCC_ACCOUNT_NUMBER_LABEL",
                 },
                required: true,
                pattern: getPattern("bankAccountNo"),
                errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
                requiredMessage: "required Message",
                jsonPath: "Booking.bkBankAccountNumber",
                props: {
                    required: true,
                },
            }),
        },
        bkIFSCCode: {
            ...getTextField({
                label: {
                    labelName: "IFSC Code",
                    labelKey:  "IFSC Code",
                    //labelKey: "BK_PCC_IFSC_CODE_LABEL",
                },
                placeholder: {
                    labelName: "IFSC Code",
                    labelKey:  "IFSC Code",
                    //labelKey: "BK_PCC_IFSC_CODE_LABEL",
                },
                required: true,
                pattern: getPattern("Name"),
                errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
                jsonPath: "Booking.bkIfscCode",
            }),
        },
        bkAccountHolderName: {
            ...getTextField({
                label: {
                    labelName: "Account Holder Name",
                    labelKey: "Account Holder Name",
                    //labelKey: "BK_PCC_ACCOUNT_HOLDER_NAME_LABEL",
                },
                placeholder: {
                    labelName: "Account Holder Name",
                    labelKey: "Account Holder Name",
                    //labelKey: "BK_PCC_ACCOUNT_HOLDER_NAME_LABEL",
                },
                required: true,
                pattern: getPattern("Name"),
                errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
                jsonPath: "Booking.bkBankAccountHolder",
            }),
        },

          bankAccountTypeRadioGroup: {
            uiFramework: "custom-containers",
            componentPath: "RadioGroupContainer",
            moduleName: "egov-services",
            gridDefination: {
              xs: 12,
              sm: 12,
              md: 6,
            },
            jsonPath: "Booking.bkAccountType",
            props: {
              label: {
                name: "Bank Account Type",
                key: "Bank Account Type",
                },
              buttons: [
                {
                  labelName: "Saving",
                  labelKey: "Saving",
                  value: "Saving"
                },
                {
                  label: "Current",
                  labelKey: "Current",
                  value: "Current"
                }
              ],
              jsonPath: "Booking.bkAccountType",
              defaultValue: "Saving",
              required: true,
            },
            required: true,
            type: "array",
        },
        bkNomineeName: {
            ...getTextField({
                label: {
                    labelName: "Nominee Name",
                    labelKey: "Nominee Name",
                    //labelKey: "BK_PCC_ACCOUNT_HOLDER_NAME_LABEL",
                },
                placeholder: {
                    labelName: "Nominee Name",
                    labelKey: "Nominee Name",
                    //labelKey: "BK_PCC_ACCOUNT_HOLDER_NAME_LABEL",
                },
                required: true,
                pattern: getPattern("Name"),
                errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
                jsonPath: "Booking.bkNomineeName",
            }),
        },

        dummyDiv: {
            uiFramework: "custom-atoms",
            componentPath: "Div",
            gridDefination: {
                xs: 12,
                sm: 12,
                md: 6,
            },
            props: {
                disabled: true,
            },
        },
    }),
});


export const bankAccountDetailsDisabled = getCommonCard({
    // header: getCommonTitle(
    //   {
    //     labelName: "Applicant Details",
    //     labelKey: "BK_PCC_HEADER_STEP_1",
    //   },
    //   {
    //     style: {
    //       marginBottom: 18,
    //     },
    //   }
    // ),
    // break: getBreak(),

    personalDetailsContainerDisabled: getCommonContainer({
        bkAccountName: {
            ...getTextField({
                label: {
                    labelName: "Bank Name(For security refund)",
                    labelKey:  "Bank Name(For security refund)",
                    
                },
                placeholder: {
                    labelName: "Bank Name",
                    labelKey:  "Bank Name",
        
                },
                required: true,
                props: {
                    disabled: true,
                },
                pattern: getPattern("Name"),
                errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
                jsonPath: "Booking.bkBankName",
            }),
        },

        bkAccountNumberDisabled: {
            ...getTextField({
                label: {
                    labelName: "Account Number",
                    labelKey: "Account Number",
                    //labelKey: "BK_PCC_ACCOUNT_NUMBER_LABEL",
                },
                placeholder: {
                    labelName: "Account Number",
                    labelKey: "Account Number",
                    //labelKey: "BK_PCC_ACCOUNT_NUMBER_LABEL",
                 },
                required: true,
                pattern: getPattern("bankAccountNo"),
                errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
                requiredMessage: "required Message",
                jsonPath: "Booking.bkBankAccountNumber",
                props: {
                    required: true,
                    
                    disabled: true,
                    
                },
            }),
        },
        bkIFSCCodeDisabled: {
            ...getTextField({
                label: {
                    labelName: "IFSC Code",
                    labelKey:  "IFSC Code",
                    //labelKey: "BK_PCC_IFSC_CODE_LABEL",
                },
                placeholder: {
                    labelName: "IFSC Code",
                    labelKey:  "IFSC Code",
                    //labelKey: "BK_PCC_IFSC_CODE_LABEL",
                },
                props: {
                    disabled: true,
                },
                required: true,
                pattern: getPattern("Name"),
                errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
                jsonPath: "Booking.bkIfscCode",
            }),
        },
        bkAccountHolderNameDisabled: {
            ...getTextField({
                label: {
                    labelName: "Account Holder Name",
                    labelKey: "Account Holder Name",
                    //labelKey: "BK_PCC_ACCOUNT_HOLDER_NAME_LABEL",
                },
                placeholder: {
                    labelName: "Account Holder Name",
                    labelKey: "Account Holder Name",
                    //labelKey: "BK_PCC_ACCOUNT_HOLDER_NAME_LABEL",
                },
                props: {
                    disabled: true,
                },
                required: true,
                pattern: getPattern("Name"),
                errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
                jsonPath: "Booking.bkBankAccountHolder",
            }),
        },
        bankAccountTypeRadioGroupDisabled: {
            uiFramework: "custom-containers",
            componentPath: "RadioGroupContainer",
            moduleName: "egov-services",
            gridDefination: {
              xs: 12,
              sm: 12,
              md: 6,
            },
            jsonPath: "Booking.bkAccountType",
            props: {
                label: {
                    name: "Bank Account Type",
                    key: "Bank Account Type",
                  },
              buttons: [
                {
                  labelName: "Saving",
                  labelKey: "Saving",
                  value: "Saving",
                  disabled: true,
                },
                {
                  label: "Current",
                  labelKey: "Current",
                  value: "Current", 
                  disabled: true,
                }
              ],
              jsonPath: "Booking.bkAccountType",
              defaultValue: "Saving",
              required: true,
             
            
            },
             
           
            required: true,
            type: "array",
        },
        bkNomineeNameDisabled: {
            ...getTextField({
                label: {
                    labelName: "Nominee Name",
                    labelKey: "Nominee Name",
                    //labelKey: "BK_PCC_ACCOUNT_HOLDER_NAME_LABEL",
                },
                placeholder: {
                    labelName: "Nominee Name",
                    labelKey: "Nominee Name",
                    //labelKey: "BK_PCC_ACCOUNT_HOLDER_NAME_LABEL",
                },
                required: true,
                props: {
                    disabled: true,
                },
                pattern: getPattern("Name"),
                errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
                jsonPath: "Booking.bkNomineeName",
            }),
        },
     
        dummyDiv: {
            uiFramework: "custom-atoms",
            componentPath: "Div",
            gridDefination: {
                xs: 12,
                sm: 12,
                md: 6,
            },
            props: {
                disabled: true,
            },
        },
    }),
});


export const bookingDetails = getCommonCard({
    // header: getCommonTitle(
    //   {
    //     labelName: "Applicant Details",
    //     labelKey: "BK_PCC_HEADER_STEP_2",
    //   },
    //   {
    //     style: {
    //       marginBottom: 18,
    //     },
    //   }
    // ),

    applicationDetailsConatiner: getCommonContainer({
        bkBookingPurpose: {
            ...getTextField({
                label: {
                    labelName: "Booking Purpose",
                    labelKey: "BK_PCC_PURPOSE_LABEL",
                },
                placeholder: {
                    labelName: "Booking Purpose",
                    labelKey: "BK_PCC_PURPOSE_PLACEHOLDER",
                },
                required: true,
                //pattern: getPattern("Name"),
                errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
                jsonPath: "Booking.bkBookingPurpose",
            }),
        },
        bkLocationChangeAmount: {
            ...getTextField({
                label: {
                    labelName: "Locality",
                    labelKey: "BK_PCC_LOCATION_CHANGE_AMOUNT_LABEL",
                },
                placeholder: {
                    labelName: "Locality",
                    labelKey: "BK_PCC_LOCATION_CHANGE_AMOUNT_PLACEHOLDER",
                },
                required: true,
                props: {
                    disabled: true,
                },
                //pattern: getPattern("Name"),
                errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
                jsonPath: "Booking.bkLocationChangeAmount",
            }),
            visible : false,
        },
        bkSector: {
            ...getTextField({
                label: {
                    labelName: "Locality",
                    labelKey: "BK_PCC_PROPERTY_SECTOR_LABEL",
                },
                placeholder: {
                    labelName: "Locality",
                    labelKey: "BK_PCC_PROPERTY_SECTOR_PLACEHOLDER",
                },
                required: true,
                props: {
                    disabled: true,
                },
                //pattern: getPattern("Name"),
                errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
                jsonPath: "Booking.bkSector",
            }),
        },
        // bkSector: {
        //     ...getSelectField({
        //         label: {
        //             labelName: "Locality",
        //             labelKey: "BK_PCC_PROPERTY_SECTOR_LABEL",
        //         },
        //         // localePrefix: {
        //         //   moduleName: "egpm",
        //         //   masterName: "sector"
        //         // },
        //         placeholder: {
        //             labelName: "Locality",
        //             labelKey: "BK_PCC_PROPERTY_SECTOR_PLACEHOLDER",
        //         },
        //         //sourceJsonPath: "applyScreenMdmsData.egpm.sector",
        //         sourceJsonPath: "applyScreenMdmsData.Booking.Sector",
        //         jsonPath: "Booking.bkSector",
        //         required: true,
        //         requiredMessage: "required Message",
        //         props: {
        //             className: "applicant-details-error",
        //             required: true,
        //             // disabled: true
        //         },
        //     }),
        // },
        bkDimension: {
            ...getTextField({
                label: {
                    labelName: "Dimension",
                    labelKey: "BK_PCC_DIMENSION_LABEL",
                },
                placeholder: {
                    labelName: "Dimension",
                    labelKey: "BK_PCC_DIMENSION_PLACEHOLDER",
                },

                required: true,
                props: {
                    disabled: true,
                },
                //pattern: getPattern("NoOfEmp"),
                errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
                jsonPath: "Booking.bkDimension",
            }),
        },
        bkLocation: {
            ...getTextField({
                label: {
                    labelName: "Location",
                    labelKey: "BK_PCC_LOCATION_LABEL",
                },
                placeholder: {
                    labelName: "Location",
                    labelKey: "BK_PCC_LOCATION_PLACEHOLDER",
                },

                required: true,
                props: {
                    disabled: true,
                },
                errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
                jsonPath: "Booking.bkLocation",
            }),
        },
        bkFromDate: {
            ...getTextField({
                label: {
                    labelName: "From Date",
                    labelKey: "BK_PCC_FROM_DATE_LABEL",
                },
                placeholder: {
                    labelName: "From Date",
                    labelKey: "BK_PCC_FROM_DATE_PLACEHOLDER",
                },
                required: true,
                props: {
                    disabled: true,
                },
                errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",

                jsonPath: "Booking.bkFromDate",
            }),
            visible: false,
        },

        bkToDate: {
            ...getTextField({
                label: {
                    labelName: "To Date",
                    labelKey: "BK_PCC_TO_DATE_LABEL",
                },
                placeholder: {
                    labelName: "To Date",
                    labelKey: "BK_PCC_TO_DATE_PLACEHOLDER",
                },

                required: true,
                props: {
                    disabled: true,
                },
                errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
                jsonPath: "Booking.bkToDate",
            }),
            visible: false,
        },
        bkDisplayFromDateTime: {
            ...getTextField({
                label: {
                    labelName: "From Date/Time",
                    labelKey: "From Date/Time",
                },
                placeholder: {
                    labelName: "From Date/Time",
                    labelKey: "BK_PCC_FROM_DATE_TIME_PLACEHOLDER",
                },
                required: true,
                props: {
                    disabled: true,
                },
                errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",

                jsonPath: "DisplayPacc.bkDisplayFromDateTime",
            }),
            visible: false,
        },
        bkDisplayToDateTime: {
            ...getTextField({
                label: {
                    labelName: "To Date/Time",
                    labelKey: "To Date/Time",
                },
                placeholder: {
                    labelName: "To Date/Time",
                    labelKey: "To Date/Time",
                },

                required: true,
                props: {
                    disabled: true,
                },
                errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
                jsonPath: "DisplayPacc.bkDisplayToDateTime",
            }),
            visible: false,
        },
        // bkType: {
        //     uiFramework: "custom-containers",
        //     componentPath: "RadioGroupContainer",
        //     moduleName: "egov-services",
        //     gridDefination: {
        //         xs: 12,
        //         sm: 12,
        //         md: 6,
        //     },
        //     jsonPath: "Booking.bkType",
        //     props: {
        //         label: {
        //             name: "Type",
        //             key: "BK_PCC_TYPE_LABEL",
        //         },
        //         buttons: [
        //             {
        //                 labelName: "Community Center",
        //                 labelKey: "Community Center",
        //                 value: "Community Center",
        //             },
        //             {
        //                 label: "Parks",
        //                 labelKey: "Parks",
        //                 value: "Parks",
        //             }
        //         ],
        //         jsonPath: "Booking.bkType",
        //         required: true,
        //     },
        //     required: true,
        //     type: "array",
        // },
        bkCleansingCharges: {
            ...getTextField({
                label: {
                    labelName: "Cleaning Charges",
                    labelKey: "BK_PCC_CLEANING_CHARGES_LABEL",
                },
                placeholder: {
                    labelName: "Cleaning Charges",
                    labelKey: "BK_PCC_CLEANING_CHARGES_PLACEHOLDER",
                },

                required: true,
                props: {
                    disabled: true,
                },

                errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
                jsonPath: "Booking.bkCleansingCharges",
            }),
        },
        bkRent: {
            ...getTextField({
                label: {
                    labelName: "Rent",
                    labelKey: "BK_PCC_RENT_LABEL",
                },
                placeholder: {
                    labelName: "Rent",
                    labelKey: "BK_PCC_RENT_PLACEHOLDER",
                },

                required: true,
                props: {
                    disabled: true,
                },
                errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
                jsonPath: "Booking.bkRent",
            }),
        },
        // bkFacilitationCharges : {
        //     ...getTextField({
        //         label: {
        //             labelName: "Facilitation Charges",
        //             labelKey: "BK_PCC_FACILITATION_CHARGES_LABEL",
        //         },
        //         placeholder: {
        //             labelName: "Facilitation Charges",
        //             labelKey: "BK_PCC_FACILITATION_CHARGES_PLACEHOLDER",
        //         },

        //         required: true,
        //         // props: {
        //         //     disabled: true,
        //         // },
        //         //pattern: getPattern("NoOfEmp"),
        //         errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
        //         jsonPath: "Booking.bkFacilitationCharges",
        //     }),
        // },
        bkSurchargeRent: {
            ...getTextField({
                label: {
                    labelName: "Facilitation Charges",
                    labelKey: "BK_PCC_SURCHARGE_RENT_LABEL",
                },
                placeholder: {
                    labelName: "Facilitation Charges",
                    labelKey: "BK_PCC_SURCHARGE_RENT_PLACEHOLDER",
                },

                required: true,
                props: {
                    disabled: true,
                },
                errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
                jsonPath: "Booking.bkSurchargeRent",
            }),
        },
        bkUtgst: {
            ...getTextField({
                label: {
                    labelName: "UTGST",
                    labelKey: "BK_PCC_UTGST_LABEL",
                },
                placeholder: {
                    labelName: "UTGST",
                    labelKey: "BK_PCC_UTGST_PLACEHOLDER",
                },

                required: true,
                props: {
                    disabled: true,
                },
                errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
                jsonPath: "Booking.bkUtgst",
            }),
        },
        bkCgst: {
            ...getTextField({
                label: {
                    labelName: "CGST",
                    labelKey: "BK_PCC_CGST_LABEL",
                },
                placeholder: {
                    labelName: "CGST",
                    labelKey: "BK_PCC_CGST_PLACEHOLDER",
                },

                required: true,
                props: {
                    disabled: true,
                },
                errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
                jsonPath: "Booking.bkCgst",
            }),
        },
        bkRefundAmount: {
            ...getTextField({
                label: {
                    labelName: "Refundable Amount",
                    labelKey: "BK_PCC_RefundAmount_LABEL",
                },
                placeholder: {
                    labelName: "Refundable Amount",
                    labelKey: "BK_PCC_RefundAmount_PLACEHOLDER",
                },

                required: true,
                props: {
                    disabled: true,
                },
                errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
                jsonPath: "Booking.bkRefundAmount",
            }),
        },
        bkCustomerGstNo: {
            ...getTextField({
                label: {
                    labelName: "Customer GST",
                    labelKey: "BK_PCC_CUSTOMER_GST_LABEL",
                },
                placeholder: {
                    labelName: "Customer GST",
                    labelKey: "BK_PCC_CUSTOMER_GST_PLACEHOLDER",
                },
                errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
                jsonPath: "Booking.bkCustomerGstNo",
            }),
        },
    }),
});

export const bookingDetailsDisabled = getCommonCard({
    // header: getCommonTitle(
    //   {
    //     labelName: "Applicant Details",
    //     labelKey: "BK_PCC_HEADER_STEP_2",
    //   },
    //   {
    //     style: {
    //       marginBottom: 18,
    //     },
    //   }
    // ),

    applicationDetailsConatinerDisabled: getCommonContainer({
        bkBookingPurposeDisabled: {
            ...getTextField({
                label: {
                    labelName: "Booking Purpose",
                    labelKey: "BK_PCC_PURPOSE_LABEL",
                },
                placeholder: {
                    labelName: "Booking Purpose",
                    labelKey: "BK_PCC_PURPOSE_PLACEHOLDER",
                },
                required: true,
                props: {
                    disabled: true,
                },
                //pattern: getPattern("Name"),
                errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
                jsonPath: "Booking.bkBookingPurpose",
            }),
        },
        bkLocationChangeAmountDisabled: {
            ...getTextField({
                label: {
                    labelName: "Locality",
                    labelKey: "BK_PCC_LOCATION_CHANGE_AMOUNT_LABEL",
                },
                placeholder: {
                    labelName: "Locality",
                    labelKey: "BK_PCC_LOCATION_CHANGE_AMOUNT_PLACEHOLDER",
                },
                required: true,
                props: {
                    disabled: true,
                },
                //pattern: getPattern("Name"),
                errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
                jsonPath: "Booking.bkLocationChangeAmount",
            }),
            visible : false,
        },
        bkSectorDisabled: {
            ...getTextField({
                label: {
                    labelName: "Locality",
                    labelKey: "BK_PCC_PROPERTY_SECTOR_LABEL",
                },
                placeholder: {
                    labelName: "Locality",
                    labelKey: "BK_PCC_PROPERTY_SECTOR_PLACEHOLDER",
                },
                required: true,
                props: {
                    disabled: true,
                },
                //pattern: getPattern("Name"),
                errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
                jsonPath: "Booking.bkSector",
            }),
        },
        // bkSector: {
        //     ...getSelectField({
        //         label: {
        //             labelName: "Locality",
        //             labelKey: "BK_PCC_PROPERTY_SECTOR_LABEL",
        //         },
        //         // localePrefix: {
        //         //   moduleName: "egpm",
        //         //   masterName: "sector"
        //         // },
        //         placeholder: {
        //             labelName: "Locality",
        //             labelKey: "BK_PCC_PROPERTY_SECTOR_PLACEHOLDER",
        //         },
        //         //sourceJsonPath: "applyScreenMdmsData.egpm.sector",
        //         sourceJsonPath: "applyScreenMdmsData.Booking.Sector",
        //         jsonPath: "Booking.bkSector",
        //         required: true,
        //         requiredMessage: "required Message",
        //         props: {
        //             className: "applicant-details-error",
        //             required: true,
        //             // disabled: true
        //         },
        //     }),
        // },
        bkDimensionDisabled: {
            ...getTextField({
                label: {
                    labelName: "Dimension",
                    labelKey: "BK_PCC_DIMENSION_LABEL",
                },
                placeholder: {
                    labelName: "Dimension",
                    labelKey: "BK_PCC_DIMENSION_PLACEHOLDER",
                },

                required: true,
                props: {
                    disabled: true,
                },
                //pattern: getPattern("NoOfEmp"),
                errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
                jsonPath: "Booking.bkDimension",
            }),
        },
        bkLocationDisabled: {
            ...getTextField({
                label: {
                    labelName: "Location",
                    labelKey: "BK_PCC_LOCATION_LABEL",
                },
                placeholder: {
                    labelName: "Location",
                    labelKey: "BK_PCC_LOCATION_PLACEHOLDER",
                },

                required: true,
                props: {
                    disabled: true,
                },
                errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
                jsonPath: "Booking.bkLocation",
            }),
        },
        bkFromDateDisabled: {
            ...getTextField({
                label: {
                    labelName: "From Date",
                    labelKey: "BK_PCC_FROM_DATE_LABEL",
                },
                placeholder: {
                    labelName: "From Date",
                    labelKey: "BK_PCC_FROM_DATE_PLACEHOLDER",
                },
                required: true,
                props: {
                    disabled: true,
                },
                errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",

                jsonPath: "Booking.bkFromDate",
            }),
            visible: false,
        },

        bkToDateDisabled: {
            ...getTextField({
                label: {
                    labelName: "To Date",
                    labelKey: "BK_PCC_TO_DATE_LABEL",
                },
                placeholder: {
                    labelName: "To Date",
                    labelKey: "BK_PCC_TO_DATE_PLACEHOLDER",
                },

                required: true,
                props: {
                    disabled: true,
                },
                errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
                jsonPath: "Booking.bkToDate",
            }),
            visible: false,
        },
        bkDisplayFromDateTimeDisabled: {
            ...getTextField({
                label: {
                    labelName: "From Date/Time",
                    labelKey: "From Date/Time",
                },
                placeholder: {
                    labelName: "From Date/Time",
                    labelKey: "BK_PCC_FROM_DATE_TIME_PLACEHOLDER",
                },
                required: true,
                props: {
                    disabled: true,
                },
                errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",

                jsonPath: "DisplayPacc.bkDisplayFromDateTime",
            }),
            visible: false,
        },
        bkDisplayToDateTimeDisabled: {
            ...getTextField({
                label: {
                    labelName: "To Date/Time",
                    labelKey: "To Date/Time",
                },
                placeholder: {
                    labelName: "To Date/Time",
                    labelKey: "To Date/Time",
                },

                required: true,
                props: {
                    disabled: true,
                },
                errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
                jsonPath: "DisplayPacc.bkDisplayToDateTime",
            }),
            visible: false,
        },
        // bkType: {
        //     uiFramework: "custom-containers",
        //     componentPath: "RadioGroupContainer",
        //     moduleName: "egov-services",
        //     gridDefination: {
        //         xs: 12,
        //         sm: 12,
        //         md: 6,
        //     },
        //     jsonPath: "Booking.bkType",
        //     props: {
        //         label: {
        //             name: "Type",
        //             key: "BK_PCC_TYPE_LABEL",
        //         },
        //         buttons: [
        //             {
        //                 labelName: "Community Center",
        //                 labelKey: "Community Center",
        //                 value: "Community Center",
        //             },
        //             {
        //                 label: "Parks",
        //                 labelKey: "Parks",
        //                 value: "Parks",
        //             }
        //         ],
        //         jsonPath: "Booking.bkType",
        //         required: true,
        //     },
        //     required: true,
        //     type: "array",
        // },
        bkCleansingChargesDisabled: {
            ...getTextField({
                label: {
                    labelName: "Cleaning Charges",
                    labelKey: "BK_PCC_CLEANING_CHARGES_LABEL",
                },
                placeholder: {
                    labelName: "Cleaning Charges",
                    labelKey: "BK_PCC_CLEANING_CHARGES_PLACEHOLDER",
                },

                required: true,
                props: {
                    disabled: true,
                },

                errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
                jsonPath: "Booking.bkCleansingCharges",
            }),
        },
        bkRentDisabled: {
            ...getTextField({
                label: {
                    labelName: "Rent",
                    labelKey: "BK_PCC_RENT_LABEL",
                },
                placeholder: {
                    labelName: "Rent",
                    labelKey: "BK_PCC_RENT_PLACEHOLDER",
                },

                required: true,
                props: {
                    disabled: true,
                },
                errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
                jsonPath: "Booking.bkRent",
            }),
        },
        // bkFacilitationCharges : {
        //     ...getTextField({
        //         label: {
        //             labelName: "Facilitation Charges",
        //             labelKey: "BK_PCC_FACILITATION_CHARGES_LABEL",
        //         },
        //         placeholder: {
        //             labelName: "Facilitation Charges",
        //             labelKey: "BK_PCC_FACILITATION_CHARGES_PLACEHOLDER",
        //         },

        //         required: true,
        //         // props: {
        //         //     disabled: true,
        //         // },
        //         //pattern: getPattern("NoOfEmp"),
        //         errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
        //         jsonPath: "Booking.bkFacilitationCharges",
        //     }),
        // },
        bkSurchargeRentDisabled: {
            ...getTextField({
                label: {
                    labelName: "Facilitation Charges",
                    labelKey: "BK_PCC_SURCHARGE_RENT_LABEL",
                },
                placeholder: {
                    labelName: "Facilitation Charges",
                    labelKey: "BK_PCC_SURCHARGE_RENT_PLACEHOLDER",
                },

                required: true,
                props: {
                    disabled: true,
                },
                errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
                jsonPath: "Booking.bkSurchargeRent",
            }),
        },
        bkUtgstDisabled: {
            ...getTextField({
                label: {
                    labelName: "UTGST",
                    labelKey: "BK_PCC_UTGST_LABEL",
                },
                placeholder: {
                    labelName: "UTGST",
                    labelKey: "BK_PCC_UTGST_PLACEHOLDER",
                },

                required: true,
                props: {
                    disabled: true,
                },
                errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
                jsonPath: "Booking.bkUtgst",
            }),
        },
        bkCgstDisabled: {
            ...getTextField({
                label: {
                    labelName: "CGST",
                    labelKey: "BK_PCC_CGST_LABEL",
                },
                placeholder: {
                    labelName: "CGST",
                    labelKey: "BK_PCC_CGST_PLACEHOLDER",
                },

                required: true,
                props: {
                    disabled: true,
                },
                errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
                jsonPath: "Booking.bkCgst",
            }),
        },
        bkRefundAmountDisabled: {
            ...getTextField({
                label: {
                    labelName: "Refundable Amount",
                    labelKey: "BK_PCC_RefundAmount_LABEL",
                },
                placeholder: {
                    labelName: "Refundable Amount",
                    labelKey: "BK_PCC_RefundAmount_PLACEHOLDER",
                },

                required: true,
                props: {
                    disabled: true,
                },
                errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
                jsonPath: "Booking.bkRefundAmount",
            }),
        },
        bkCustomerGstNoDisabled: {
            ...getTextField({
                label: {
                    labelName: "Customer GST",
                    labelKey: "BK_PCC_CUSTOMER_GST_LABEL",
                },
                placeholder: {
                    labelName: "Customer GST",
                    labelKey: "BK_PCC_CUSTOMER_GST_PLACEHOLDER",
                },
                props: {
                    disabled: true,
                },
                errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
                jsonPath: "Booking.bkCustomerGstNo",
            }),
        },
    }),
});
