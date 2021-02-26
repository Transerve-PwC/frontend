import {
    getBreak,
    getCommonContainer,
    getCommonGrayCard,
    getCommonSubHeader,
    getCommonHeader,
    getLabel,
    getLabelWithValue,
    convertEpochToDate,
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { gotoApplyWithStep } from "../../utils/index";
import { getTransformedLocale } from "egov-ui-framework/ui-utils/commons";
import {
    convertDateInDMY
} from "../../utils";
import {

    getTenantId,
    localStorageSet,
    setapplicationNumber,
    getapplicationNumber,
} from "egov-ui-kit/utils/localStorageUtils";

export const pccApplicantSummary = getCommonGrayCard({
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
                    labelName: "Applicant Details",
                    labelKey: "BK_CGB_APPLICANT_DETAILS_HEADER",
                }),
            },
            // editSection: {
            //   componentPath: "Button",
            //   props: {
            //     color: "primary",
            //     style: {
            //       marginTop: "-10px",
            //       marginRight: "-18px",
            //     },
            //   },
            //   gridDefination: {
            //     xs: 4,
            //     align: "right",
            //   },
            //   children: {
            //     editIcon: {
            //       uiFramework: "custom-atoms",
            //       componentPath: "Icon",
            //       props: {
            //         iconName: "edit",
            //       },
            //     },
            //     buttonLabel: getLabel({
            //       labelName: "Edit",
            //       labelKey: "BK_SUMMARY_EDIT",
            //     }),
            //   },
            //   onClickDefination: {
            //     action: "condition",
            //     callBack: (state, dispatch) => {
            //       gotoApplyWithStep(state, dispatch, 0);
            //     },
            //   },
            // },
        },
    },
    cardOne: {
        uiFramework: "custom-containers",
        componentPath: "MultiItem",
        props: {
            className: "sellmeatapplicant-summary",
            scheama: getCommonGrayCard({
                applicantContainer: getCommonContainer({
                    applicantName: getLabelWithValue(
                        {
                            labelName: "Name",
                            labelKey: "BK_OSB_NAME_LABEL",
                        },
                        {
                            jsonPath: "Booking.bkApplicantName",
                        }
                    ),
                    applicantEmail: getLabelWithValue(
                        {
                            labelName: "Email Address",
                            labelKey: "BK_OSB_EMAIL_LABEL",
                        },
                        {
                            jsonPath: "Booking.bkEmail",
                        }
                    ),
                    applicantMobile: getLabelWithValue(
                        {
                            labelName: "Mobile Number",
                            labelKey: "BK_OSB_MOBILE_NO_LABEL",
                        },
                        {
                            jsonPath: "Booking.bkMobileNumber",
                        }
                    ),
                    HouseNo: getLabelWithValue(
                        {
                            labelName: "House No.",
                            labelKey: "BK_PCC_HOUSE_NUMBER_LABEL",
                        },
                        {
                            jsonPath: "Booking.bkHouseNo",
                            callBack: (value) => {
                                if (
                                    value === undefined ||
                                    value === "" ||
                                    value === null
                                ) {
                                    return "NA";
                                } else {
                                    return value;
                                }
                            },
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
                    labelKey:  "Bank Details"
                    //labelKey: "BK_PCC_BANK_DETAILS_HEADER",
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
                            labelKey:  "Bank Name",
                            //labelKey: "BK_PCC_BANK_NAME_LABEL",
                        },
                        {
                            jsonPath: "Booking.bkBankName",
                        }
                    ),
                    bkBankAccountNumber: getLabelWithValue(
                        {
                            labelName: "Account Number",
                            labelKey: "Account Number",
                            //labelKey: "BK_PCC_ACCOUNT_NUMBER_LABEL",
                        },
                        {
                            jsonPath: "Booking.bkBankAccountNumber",
                        }
                    ),
                    bkIfscCode: getLabelWithValue(
                        {
                            labelName: "IFSC Code",
                            labelKey:  "IFSC Code",
                            //labelKey: "BK_PCC_IFSC_CODE_LABEL",
                        },
                        {
                            jsonPath: "Booking.bkIfscCode",
                        }
                    ),
                    bkAccountHolderName: getLabelWithValue(
                      
                        {
                            labelName: "Account Holder Name",
                            labelKey: "Account Holder Name",
                            //labelKey: "BK_PCC_ACCOUNT_HOLDER_NAME_LABEL",
                        },
                        {
                            jsonPath: "Booking.bkBankAccountHolder",
                        }
                    ),
                    bankAccountTypeRadioGroup: getLabelWithValue(
                        {
                            labelName: "Bank Account Type",
                            labelName: "Bank Account Type",
                            //labelKey: "BK_PCC_BANK_ACCOUNT_TYPE_LABEL",
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

export const roomBookingSummary = getCommonGrayCard({
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
                    labelName: "Room Details",
                    labelKey: "Room Details",
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
                            labelName: "Type Of Booked Room",
                            labelKey: "Type Of Booked Room",
                        },
                        {
                            jsonPath: "Booking.roomsModel[0].typeOfRoom",
                        }
                    ),
                    bkBankAccountNumber: getLabelWithValue(
                        {
                            labelName: "Number of Booked Rooms",
                            labelKey: "Number of Booked Rooms",
                        },
                        {
                            jsonPath: "Booking.roomsModel[0].totalNoOfRooms",
                        }
                    ),
                    bkIfscCode: getLabelWithValue(
                        {
                            labelName: "From Date",
                            labelKey: "From Date",
                        },
                        {
                            jsonPath: "Booking.roomsModel[0].fromDate",
                            callBack: (value) => {
                                if (value === undefined || value === "" || value === null) {
                                    return "NA"
                                } else {
                                    return convertDateInDMY(value);
                                }
                            }
                        }
                        
                    ),
                    bkAccountHolderName: getLabelWithValue(
                      
                        {
                            labelName: "To Date",
                            labelKey: "To Date",
                        },
                        {
                            jsonPath: "Booking.roomsModel[0].toDate",
                            callBack: (value) => {
                                if (value === undefined || value === "" || value === null) {
                                    return "NA"
                                } else {
                                    return convertDateInDMY(value);
                                }
                            }
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

    

export const roomBookingSummaryDetailCard = getCommonGrayCard({
    header1:  getCommonContainer({
    header: getCommonHeader({
        labelName: "Task Details",
        labelKey: "BK_MY_BK_APPLICATION_DETAILS_HEADER",
    }),
    applicationNumber: {
        uiFramework: "custom-atoms-local",
        moduleName: "egov-services",
        componentPath: "ApplicationNoContainer",
        props: {
            number: getapplicationNumber(), //localStorage.getItem('applicationsellmeatNumber')
        },
    },
}), 
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
                labelName: "Room Details",
                labelKey: "Room Details",
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
                        labelName: "Type Of Booked Room",
                        labelKey: "Type Of Booked Room",
                    },
                    {
                        jsonPath: "roomDetail.typeOfRoom",
                    }
                ),
                bkBankAccountNumber: getLabelWithValue(
                    {
                        labelName: "Number of Booked Rooms",
                        labelKey: "Number of Booked Rooms",
                    },
                    {
                        jsonPath: "roomDetail.totalNoOfRooms",
                    }
                ),
                bkIfscCode: getLabelWithValue(
                    {
                        labelName: "From Date",
                        labelKey: "From Date",
                    },
                    {
                        jsonPath: "roomDetail.fromDate",
                        callBack: (value) => {
                            if (value === undefined || value === "" || value === null) {
                                return "NA"
                            } else {
                                return convertDateInDMY(value);
                            }
                        }
                    }
                    
                ),
                bkAccountHolderName: getLabelWithValue(
                  
                    {
                        labelName: "To Date",
                        labelKey: "To Date",
                    },
                    {
                        jsonPath: "roomDetail.toDate",
                        callBack: (value) => {
                            if (value === undefined || value === "" || value === null) {
                                return "NA"
                            } else {
                                return convertDateInDMY(value);
                            }
                        }
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


export const roomDetaiPage = getCommonGrayCard({
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
                labelName: "Room Details",
                labelKey: "Room Details",
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
                roomType: getLabelWithValue(
                    {
                        labelName: "Type Of Booked Room",
                        labelKey: "Type Of Booked Room",
                    },
                    {
                        jsonPath: "roomDetailPageData.typeOfRooms",
                    }
                ),
                numberOfAcRooms: getLabelWithValue(
                    {
                        labelName: "Number of Booked AC Rooms",
                        labelKey: "Number of Booked AC Rooms",
                    },
                    {
                        jsonPath: "roomDetailPageData.totalNoOfACRooms",
                        callBack: (value) => {
                            if (value === 0) {
                                return "0"
                            } else {
                                return value;
                            }
                        }
                    }
                ),
                numberOfNonAcRooms: getLabelWithValue(
                    {
                        labelName: "Number of Booked Non AC Rooms",
                        labelKey: "Number of Booked Non AC Rooms",
                    },
                    {
                        jsonPath: "roomDetailPageData.totalNoOfNonACRooms",
                        callBack: (value) => {
                            if (value === 0) {
                                return "0"
                            } else {
                                return value;
                            }
                        }
                    }
                ),
                fromDate: getLabelWithValue(
                    {
                        labelName: "From Date",
                        labelKey: "From Date",
                    },
                    {
                        jsonPath: "roomDetailPageData.fromDate",
                        callBack: (value) => {
                            if (value === undefined || value === "" || value === null) {
                                return "NA"
                            } else {
                                return convertDateInDMY(value);
                            }
                        }
                    }
                    
                ),
                toDate: getLabelWithValue(
                  
                    {
                        labelName: "To Date",
                        labelKey: "To Date",
                    },
                    {
                        jsonPath: "roomDetailPageData.toDate",
                        callBack: (value) => {
                            if (value === undefined || value === "" || value === null) {
                                return "NA"
                            } else {
                                return convertDateInDMY(value);
                            }
                        }
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
