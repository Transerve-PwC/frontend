import {
    getBreak,
    getCommonCard,
    getCommonContainer,
    getCommonHeader,
    getCommonTitle,
    getTextField,
    getSelectField,
    getPattern,
    getRadioButton,
    getLabel
} from "egov-ui-framework/ui-config/screens/specs/utils";
import {
    localStorageGet,
    localStorageSet,
    setapplicationNumber,
    getapplicationNumber,
} from "egov-ui-kit/utils/localStorageUtils";

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
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import set from "lodash/set";

export const personalDetails = getCommonCard({
    header: getCommonTitle(
      {
        labelName: "Hall Details For Entered Application Number",
        labelKey: "Hall Details For Entered Application Number",
      },
      {
        style: {
          marginBottom: 18,
        },
      }
    ),
    break: getBreak(),



    personalDetailsContainer: getCommonContainer({


        
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
                props: {
                    disabled: true,
                },
                required: true,
                pattern: getPattern("Name"),
                errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
                jsonPath: "Booking.bkApplicantName",
            }),
        },
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
                props: {
                    disabled: true,
                },
                errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
                jsonPath: "Booking.bkBookingPurpose",
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
            visible: true,
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
            visible: true,
        },
        // bkDisplayFromDateTime: {
        //     ...getTextField({
        //         label: {
        //             labelName: "From Date/Time",
        //             labelKey: "BK_PCC_FROM_DATE_TIME_LABEL",
        //         },
        //         placeholder: {
        //             labelName: "From Date/Time",
        //             labelKey: "BK_PCC_FROM_DATE_TIME_PLACEHOLDER",
        //         },
        //         required: true,
        //         props: {
        //             disabled: true,
        //         },
        //         errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",

        //         jsonPath: "DisplayPacc.bkDisplayFromDateTime",
        //     }),
        //     visible: true,
        // },
        // bkDisplayToDateTime: {
        //     ...getTextField({
        //         label: {
        //             labelName: "To Date/Time",
        //             labelKey: "BK_PCC_TO_DATE_TIME_LABEL",
        //         },
        //         placeholder: {
        //             labelName: "To Date/Time",
        //             labelKey: "BK_PCC_TO_DATE_TIME_PLACEHOLDER",
        //         },

        //         required: true,
        //         props: {
        //             disabled: true,
        //         },
        //         errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
        //         jsonPath: "DisplayPacc.bkDisplayToDateTime",
        //     }),
        //     visible: true,
        // },
        dummyDiv: {
            uiFramework: "custom-atoms",
            componentPath: "Div",
            gridDefination: {
              xs: 12,
              sm: 6
            },
            visible: true,
            props: {
              disabled: true
            }
          },
        buttonContainer: getCommonContainer({
            firstCont: {
              uiFramework: "custom-atoms",
              componentPath: "Div",
              gridDefination: {
                xs: 12,
                sm: 9,
                md: 9
              }
            },
            resetButton: {
              componentPath: "Button",
              gridDefination: {
                xs: 12,
                md: 3, 
                //align: "right"
              },
              props: {
                variant: "contained",
                color: "primary",
                style: {
                    minWidth: "200px",
                    height: "48px",
                    marginTop: "10px",
                    marginRight: "16px"
                },
            },
              children: {
                buttonLabel: getLabel({
                  labelName: "BOOK ROOM",
                  labelKey: "BOOK ROOM"
                })
              },
              onClickDefination: {
                action: "condition",
                callBack:( state, dispatch)=>{
                    dispatch(setRoute(`/egov-services/applyCommunityCenterRoom`));
               
                }
              }
            }
        })
       
    }),
});

export const communityHallDetails = getCommonCard({
    
    
    communityHallDetailsContainer: getCommonContainer({


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
                    props: {
                        disabled: true,
                    },
                    required: true,
                    pattern: getPattern("Name"),
                    errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
                    jsonPath: "Booking.bkApplicantName",
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
                    props: {
                        disabled: true,
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
                        disabled: true,
                        required: true,
                        helperText: "custom helper text",
                    },
                }),
            },
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
                    props: {
                        disabled: true,
                    },
                    errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
                    jsonPath: "Booking.bkBookingPurpose",
                }),
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
                visible: true,
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
                visible: true,
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
                    props: {
                        disabled: true,
                    },
                    errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
                    jsonPath: "Booking.bkCustomerGstNo",
                }),
            },
    
        })
})

export const venueDetails = getCommonCard({
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


    venueDetailsConatiner: getCommonContainer({


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
        
    }),
});

export const roomBookingDetails = getCommonCard({
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


    roomBookingDetailsConatiner: getCommonContainer({

        bkTotalAcRooms: {
            ...getTextField({
                label: {
                    labelName: "Total Ac Rooms",
                    labelKey: "Total Ac Rooms",
                },
                placeholder: {
                    labelName: "Total Ac Rooms",
                    labelKey: "Total Ac Rooms",
                },

                required: true,
                props: {
                    disabled: true,
                },
                errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
                jsonPath: "roomAvailabilityData.totalAcRooms",
            }),
        },
        bkTotolNonAcRooms: {
            ...getTextField({
                label: {
                    labelName: "Total Non Ac Rooms",
                    labelKey: "Total Non Ac Rooms",
                },
                placeholder: {
                    labelName: "Total Non Ac Rooms",
                    labelKey: "Total Non Ac Rooms",
                },

                required: true,
                props: {
                    disabled: true,
                },
                errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
                jsonPath: "roomAvailabilityData.totalNonAcRooms",
            }),
        },
        bkAvailableAcRooms: {
            ...getTextField({
                label: {
                    labelName: "Available Ac Rooms",
                    labelKey: "Available Ac Rooms",
                },
                placeholder: {
                    labelName: "Available Ac Rooms",
                    labelKey: "Available Ac Rooms",
                },

                required: true,
                props: {
                    disabled: true,
                },
                errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
                jsonPath: "roomAvailabilityData.availableAcRooms",
            }),
        },
        bkAvailableNonAcRooms: {
            ...getTextField({
                label: {
                    labelName: "Available Non Ac Rooms",
                    labelKey: "Available Non Ac Rooms",
                },
                placeholder: {
                    labelName: "Available Non Ac Rooms",
                    labelKey: "Available Non Ac Rooms",
                },

                required: true,
                props: {
                    disabled: true,
                },
                errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
                jsonPath: "roomAvailabilityData.availableNonAcRooms",
            }),
        },
            // bkDurationCheckData: {
            //   uiFramework: "custom-containers",
            //   componentPath: "RadioGroupContainer",
            //   moduleName: "egov-services",
            //   gridDefination: {
            //     xs: 12,
            //     sm: 6,
            //     md: 6,
            //   },
            //   jsonPath: "roomBookingData.bkRoomType",
            //   props: {
            //     label: {
            //       name: "Select Room Type",
            //       key: "Select Room Type",
            //     },
            //     buttons: [
            //       {
            //         labelName: "Ac Room",
            //         labelKey: "Ac Room",
            //         value: "Ac Room",
            //       },
            //       {
            //         label: "Non Ac Room",
            //         labelKey: "Non Ac Room",
            //         value: "Non Ac Room",
            //       },
            //       {
            //         label: "Both",
            //         labelKey: "Both",
            //         value: "Both",
            //       },
                
            //     ],
            //     jsonPath: "roomBookingData.bkRoomType",
            //     defaultValue: "Ac Room",
            //     required: true,
            //   },
            //   required: true,
            //   type: "array",
            
            bkDurationCheckData: {
                    ...getSelectField({
                        label: {
                            labelName: "Select Room Type",
                            labelKey: "Select Room Type",
                        },
        
                        placeholder: {
                            labelName: "Select Room Type",
                            labelKey: "Select Room Type",
                        },
                        gridDefination: {
                            xs: 12,
                            sm: 6,
                            md: 6,
                        },
        
                        sourceJsonPath: "roomAvailabilityData.roomTypeArray",
                        jsonPath: "roomData.typeOfRoom",
                        required: true,
                        errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
                        props: {
                            className: "applicant-details-error",
                            required: true,
                            
                       
                        },
                        visible: true,

              beforeFieldChange: (action, state, dispatch) => {
                
              },
              afterFieldChange : (action , state, dispatch)=>{
                let roomType = get(
                    state,
                    "screenConfiguration.preparedFinalObject.roomData.typeOfRoom"
                );
                set(
                    state.screenConfiguration.screenConfig["applyCommunityCenterRoom"],
                    "components.div.children.formwizardThirdStep.children.roomBookingDetails.children.cardContent.children.roomBookingDetailsConatiner.children.bkDaySelect.visible",
                    false
                );
                dispatch(
                    handleField(
                        "applyCommunityCenterRoom",
                        "components.div.children.formwizardThirdStep.children.roomBookingDetails.children.cardContent.children.roomBookingDetailsConatiner.children.bkAcRoomToBeBooked",
                        "props.disabled",
                        true
                    )
                );
                dispatch(
                    handleField(
                        "applyCommunityCenterRoom",
                        "components.div.children.formwizardThirdStep.children.roomBookingDetails.children.cardContent.children.roomBookingDetailsConatiner.children.bkNonAcRoomToBeBooked",
                        "props.disabled",
                        true
                    )
                );
                
                set(
                    state.screenConfiguration.screenConfig["applyCommunityCenterRoom"],
                    "components.div.children.formwizardThirdStep.children.roomBookingDetails.children.cardContent.children.roomBookingDetailsConatiner.children.bkNonAcRoomToBeBooked.visible",
                     false
                );
                set(
                    state.screenConfiguration.screenConfig["applyCommunityCenterRoom"],
                    "components.div.children.formwizardThirdStep.children.roomBookingDetails.children.cardContent.children.roomBookingDetailsConatiner.children.bkAcRoomToBeBooked.visible",
                    false
                );
                if(roomType=='AC'){
            
                    if(localStorageGet('availableAcRoomStatus') === 'Not Available'){
                        dispatch(
                            toggleSnackbar(
                                true,
                                { labelName: "No AC Room Available", labelKey: "No AC Room Available" },
                                "warning"
                            )
                        );
                    }else {
                        dispatch(
                            handleField(
                                "applyCommunityCenterRoom",
                                "components.div.children.formwizardThirdStep.children.roomBookingDetails.children.cardContent.children.roomBookingDetailsConatiner.children.bkAcRoomToBeBooked",
                                "props.disabled",
                                false
                            )
                        );
                        set(
                            state.screenConfiguration.screenConfig["applyCommunityCenterRoom"],
                            "components.div.children.formwizardThirdStep.children.roomBookingDetails.children.cardContent.children.roomBookingDetailsConatiner.children.bkAcRoomToBeBooked.visible",
                            true
                        );
                    }
                }else if(roomType=='NON-AC'){

                    if(localStorageGet('availableNonAcRoomStatus') === 'Not Available'){
                        dispatch(
                            toggleSnackbar(
                                true,
                                { labelName: "No Non AC Room Available", labelKey: "No Non AC Room Available" },
                                "warning"
                            )
                        );
                    }else {
                        dispatch(
                            handleField(
                                "applyCommunityCenterRoom",
                                "components.div.children.formwizardThirdStep.children.roomBookingDetails.children.cardContent.children.roomBookingDetailsConatiner.children.bkNonAcRoomToBeBooked",
                                "props.disabled",
                                false
                            )
                        );
                        set(
                            state.screenConfiguration.screenConfig["applyCommunityCenterRoom"],
                            "components.div.children.formwizardThirdStep.children.roomBookingDetails.children.cardContent.children.roomBookingDetailsConatiner.children.bkNonAcRoomToBeBooked.visible",
                             true
                        );
                    }



                }else{

                    
                         dispatch(
                            handleField(
                                "applyCommunityCenterRoom",
                                "components.div.children.formwizardThirdStep.children.roomBookingDetails.children.cardContent.children.roomBookingDetailsConatiner.children.bkNonAcRoomToBeBooked",
                                "props.disabled",
                                false
                            )
                        );
                        set(
                            state.screenConfiguration.screenConfig["applyCommunityCenterRoom"],
                            "components.div.children.formwizardThirdStep.children.roomBookingDetails.children.cardContent.children.roomBookingDetailsConatiner.children.bkNonAcRoomToBeBooked.visible",
                             true
                        );
                        dispatch(
                            handleField(
                                "applyCommunityCenterRoom",
                                "components.div.children.formwizardThirdStep.children.roomBookingDetails.children.cardContent.children.roomBookingDetailsConatiner.children.bkAcRoomToBeBooked",
                                "props.disabled",
                                false
                            )
                        );
                        set(
                            state.screenConfiguration.screenConfig["applyCommunityCenterRoom"],
                            "components.div.children.formwizardThirdStep.children.roomBookingDetails.children.cardContent.children.roomBookingDetailsConatiner.children.bkAcRoomToBeBooked.visible",
                            true
                        );

                }
                
                
              }
            })
            },
          
        bkAcRoomToBeBooked: {
            ...getSelectField({
                label: {
                    labelName: "Select Ac Rooms To Be Booked",
                    labelKey: "Select Ac Rooms To Be Booked",
                },

                placeholder: {
                    labelName: "Select Ac Rooms To Be Booked",
                    labelKey: "Select Ac Rooms To Be Booked",
                },
                gridDefination: {
                    xs: 12,
                    sm: 6,
                    md: 6,
                },

                sourceJsonPath: "roomAvailabilityData.availableAcRoomsArray",
                jsonPath: "roomData.bkAcRoomToBeBooked",
                required: true,
                errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
                props: {
                    className: "applicant-details-error",
                    required: true,
                    disabled: true
               
                },
                visible: false,
                afterFieldChange:  async (action, state, dispatch) =>{
                
                    set(
                        state.screenConfiguration.screenConfig["applyCommunityCenterRoom"],
                        "components.div.children.formwizardThirdStep.children.roomBookingDetails.children.cardContent.children.roomBookingDetailsConatiner.children.bkDaySelect.visible",
                        true
                    );
                    let totalRooms = get(
                        state,
                        "screenConfiguration.preparedFinalObject.roomData.bkAcRoomToBeBooked"
                    );
                    dispatch(prepareFinalObject("roomData.totalNoOfRooms",totalRooms ))

                },
               
            }),
        } ,
        bkNonAcRoomToBeBooked: {
            ...getSelectField({
                label: {
                    labelName: "Select Non Ac Rooms To Be Booked",
                    labelKey: "Select Non Ac Rooms To Be Booked",
                },

                placeholder: {
                    labelName: "Select Non Ac Rooms To Be Booked",
                    labelKey: "Select Non Ac Rooms To Be Booked",
                },
                gridDefination: {
                    xs: 12,
                    sm: 6,
                    md: 6,
                },

                sourceJsonPath: "roomAvailabilityData.availableNonAcRoomsArray",
                jsonPath: "roomData.bkNonAcRoomToBeBooked",
                required: true,
                errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
                props: {
                    className: "applicant-details-error",
                    required: true,
                    disabled: true
                    },
                visible:  false,
               
                
                beforeFieldChange: async (action, state, dispatch) => {
                    
                }, 
                afterFieldChange:  async (action, state, dispatch) =>{
                
                    set(
                        state.screenConfiguration.screenConfig["applyCommunityCenterRoom"],
                        "components.div.children.formwizardThirdStep.children.roomBookingDetails.children.cardContent.children.roomBookingDetailsConatiner.children.bkDaySelect.visible",
                        true
                    );
                    
                    let totalRooms = get(
                        state,
                        "screenConfiguration.preparedFinalObject.roomData.bkNonAcRoomToBeBooked"
                    );
                    dispatch(prepareFinalObject("roomData.totalNoOfRooms",totalRooms ))

                },
              
        
              
            
            
            }),   
        },
        bkDaySelect:{
            ...getSelectField({
                optionLabel: "name",
                label: {
                    labelName: "Select Booking Dates",
                    labelKey: "Select Booking Dates",
                },

                placeholder: {
                    labelName: "Select Booking Dates",
                    labelKey: "Select Booking Dates",
                },
                gridDefination: {
                    xs: 12,
                    sm: 6,
                    md: 6,
                },

                sourceJsonPath: "roomAvailabilityData.selectDateArray",
                jsonPath: "roomData.bkDaySelect",
                required: true,
                errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
                props: {
                    className: "applicant-details-error",
                    required: true,
                   
                    },
                visible: false, 
                
                beforeFieldChange: async (action, state, dispatch) => {
                    
                }, 
                afterFieldChange:  async (action, state, dispatch) =>{
                    let numberOfDays = get(
                        state,
                        "screenConfiguration.preparedFinalObject.roomData.bkDaySelect"
                    );
                    let firstDay = get(
                        state,
                        "screenConfiguration.preparedFinalObject.Booking.bkFromDate"
                    );
                    let secondDay = get(
                        state,
                        "screenConfiguration.preparedFinalObject.Booking.bkToDate"
                    );
                    
                if(numberOfDays===1){
                    
                    dispatch(prepareFinalObject("roomData.fromDate", firstDay))
                    dispatch(prepareFinalObject("roomData.toDate", firstDay))
                }else if(numberOfDays===2){
                   
                    dispatch(prepareFinalObject("roomData.fromDate", secondDay))
                    dispatch(prepareFinalObject("roomData.toDate", secondDay))
                }else{
                    
                    dispatch(prepareFinalObject("roomData.fromDate", firstDay))
                    dispatch(prepareFinalObject("roomData.toDate", secondDay))
                }

                 },
                 
              
            
            
            }),   
        },
            
 
    }),
});
