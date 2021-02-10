import {
  getBreak, getCommonGrayCard, getDateField, getLabel, getTodaysDateInYMD,
  getCommonCard,
  getCommonContainer,
  getCommonTitle,
  getTextField,
  getSelectField,
  getPattern,
} from "egov-ui-framework/ui-config/screens/specs/utils";
import {
  getTextFieldReadOnly
} from "../../utils/index"
import { convertDateInDMY } from "../../utils/index";
import {
  handleScreenConfigurationFieldChange as handleField,
  prepareFinalObject,
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import get from "lodash/get";
import jp from "jsonpath";
import set from "lodash/set";
import { toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import {
  furnishNocResponse,
  getSearchResults,
} from "../../../../../ui-utils/commons";

export const personalDetails = getCommonCard({

  nocDetailsContainer: getCommonContainer({
    bkApplicantName: {
      ...getTextField({
        label: {
          labelName: "Applicant Name",
          labelKey: "BK_CGB_NAME_LABEL",
        },
        placeholder: {
          labelName: "Applicant Name",
          labelKey: "BK_CGB_NAME_PLACEHOLDER",
        },
        required: true,
        pattern: getPattern("Name"),
        errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
        jsonPath: "Booking.bkApplicantName",
      }),
    },
    bkFatherName: {
      ...getTextField({
        label: {
          labelName: "Father's Name",
          labelKey: "BK_CGB_FATHERNAME_LABEL",
        },
        placeholder: {
          labelName: "Father's Name",
          labelKey: "BK_CGB_FATHERNAME_PLACEHOLDER",
        },
        required: true,
        pattern: getPattern("Name"),
        errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
        jsonPath: "Booking.bkFatherName",
      }),
    },
    bkEmail: {
      ...getTextField({
        label: {
          labelName: "Email Address",
          labelKey: "BK_CGB_EMAIL_LABEL",
        },
        placeholder: {
          labelName: "Email Address",
          labelKey: "BK_CGB_EMAIL_PLACEHOLDER",
        },
        required: true,
        pattern: getPattern("Email"),
        errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
        jsonPath: "Booking.bkEmail",
      }),
    },
    bkMobileNumber: {
      ...getTextField({
        label: {
          labelName: "Contact Number",
          labelKey: "BK_CGB_MOBILE_NO_LABEL",
        },
        placeholder: {
          labelName: "Contact Number",
          labelKey: "BK_CGB_MOBILE_NO_PLACEHOLDER",
        },
        required: true,
        pattern: getPattern("MobileNo"),
        errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
        jsonPath: "Booking.bkMobileNumber",
      }),
    },
    bkCompleteAddress: {
      ...getTextField({
        label: {
          labelName: "Complete Address",
          labelKey: "BK_CGB_COMPLETE_ADDRESS_LABEL",
        },
        placeholder: {
          labelName: "Complete Address",
          labelKey: "BK_CGB_COMPLETE_ADDRESS_PLACEHOLDER",
        },
        errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
        required: true,
        jsonPath: "Booking.bkCompleteAddress",
        maxLength: 500,
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
  

  applicationDetailsConatiner: getCommonContainer({

    fromdate: {
      ...getTextFieldReadOnly({
        label: {
          labelName: "From Date",
          labelKey: "BK_CGB_FROM_DATE_LABEL"
        },
        placeholder: {
          labelName: "From Date",
          labelKey: "BK_CGB_FROM_DATE_PLACEHOLDER"
        },
        readOnlyValue: true,
        required: true,

        errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",

        jsonPath: "Display.bkFromDate",


      })
    },
    todate: {
      ...getTextFieldReadOnly({
        label: {
          labelName: "To Date",
          labelKey: "BK_CGB_TO_DATE_LABEL"
        },
        placeholder: {
          labelName: "To Date",
          labelKey: "BK_CGB_TO_DATE_PLACEHOLDER"
        },

        required: true,
        readOnlyValue: true,
     
        errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
        jsonPath: "Display.bkToDate",

      })
    },
    Venue: {
      ...getTextFieldReadOnly({
        label: {

          labelName: "Booking Venue",
          labelKey: "BK_CGB_BOOKING_VENUE_LABEL",
        },

        placeholder: {
          labelName: "Select Booking Venue",
          labelKey: "BK_CGB_BOOKING_VENUE_PLACEHOLDER",
        },
        readOnlyValue: true,
        required: true,
    
        errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
        jsonPath: "Booking.bkBookingVenue",
      })
    },

    Purpose: {
      ...getTextField({
        label: {
          labelName: "Purpose",
          labelKey: "BK_CGB_PURPOSE_LABEL",
        },
        placeholder: {
          labelName: "Purpose",
          labelKey: "BK_CGB_PURPOSE_PLACEHOLDER",
        },
        required: true,
        //pattern: getPattern("Name"),
        errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
        jsonPath: "Booking.bkBookingPurpose",
        maxLength: 500,
      }),
    },


    bkCategory: {
      ...getSelectField({
        label: {
          labelName: "Category",
          labelKey: "BK_CGB_CATEGORY_LABEL",
        },
        
        optionLabel: "name",
        placeholder: {
          labelName: "Select Category",
          labelKey: "BK_CGB_CATEGORY_PLACEHOLDER",
        },
      
        sourceJsonPath: "applyScreenMdmsData.Booking.Commerical_Ground_Cat",
        jsonPath: "Booking.bkCategory",
        required: true,
        props: {
          className: "applicant-details-error",
          required: true,
        },
      }),
    },
  }),
});
