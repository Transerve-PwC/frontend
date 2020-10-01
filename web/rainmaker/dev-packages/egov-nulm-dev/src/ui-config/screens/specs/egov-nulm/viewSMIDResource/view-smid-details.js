import {
  getCommonContainer,
  getCommonGrayCard,
  getCommonSubHeader,
  getLabel,
  getLabelWithValue
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import {  checkValueForNA } from "../../utils";
const gotoCreatePage = (state, dispatch) => {
   const createUrl = `/egov-nulm/create-smid?step=0`;
  dispatch(setRoute(createUrl));
};

export const getSMIDDetailsView = (isReview = true) => {
  return getCommonGrayCard({
    headerDiv: {
      uiFramework: "custom-atoms",
      componentPath: "Container",
      props: {
        style: { marginBottom: "10px" }
      },
      children: {
        header: {
          gridDefination: {
            xs: 12,
            sm: 10
          },
          ...getCommonSubHeader({
            labelName: "View SMID",
            labelKey: "NULM_APPLICATION_FOR_SMID_DETAILS"
          })
        },
        editSection: {
          componentPath: "Button",
          props: {
            color: "primary"
          },
          visible: isReview,
          gridDefination: {
            xs: 12,
            sm: 2,
            align: "right"
          },
          children: {
            editIcon: {
              uiFramework: "custom-atoms",
              componentPath: "Icon",
              props: {
                iconName: "edit"
              }
            },
            buttonLabel: getLabel({
              labelName: "Edit",
              labelKey: "HR_SUMMARY_EDIT"
            })
          },
          onClickDefination: {
            action: "condition",
            callBack: gotoCreatePage
          }
        }
      }
    },
    viewOne: getCommonContainer({
      caste: getLabelWithValue(
        {
          labelName: "Caste of Applicant",
          labelKey: "NULM_SMID_CASTE_OF_APPLICANT",
        },
        { jsonPath: "NULMSMIDRequest.caste" }
      ),
      isUrbanPoor: getLabelWithValue(
        {
          labelName: "Urban Poor",
          labelKey: "NULM_SMID_URBAN_POOR"
        },
        { jsonPath: "NULMSMIDRequest.isUrbanPoor" }
      ),
      bplNo: getLabelWithValue(
        {
          labelName: "BPL NULM_SMID_BPL_NUMBER",
          labelKey: "NULM_SMID_BPL_NUMBER"
        },
        { jsonPath: "NULMSMIDRequest.bplNo" ,
        callBack: checkValueForNA }
      ),
      
      isPwd: getLabelWithValue(
        {
          labelName: "PWD",
          labelKey: "NULM_SMID_PWD"
        },
        { jsonPath: "NULMSMIDRequest.isPwd" }
      ),
      name: getLabelWithValue(
        {
          labelName: "Name of Applicant",
          labelKey: "NULM_SMID_NAME_OF_APPLICANT"
        },
        { jsonPath: "NULMSMIDRequest.name" }
      ),
      fatherOrHusbandName: getLabelWithValue(
        {
          labelName: "Father/Spouse Name",
          labelKey: "NULM_SMID_FATHER/SPOUSE_NAME"
        },
        { jsonPath: "NULMSMIDRequest.fatherOrHusbandName" }
      ),
      qualification: getLabelWithValue(
        {
          labelName: "Qualification",
          labelKey: "NULM_SEP_QUALIFACATION"
        },
        { jsonPath: "NULMSMIDRequest.qualification" }
      ),
      dob: getLabelWithValue(
        {
          labelName: "Date Of Birth",
          labelKey: "NULM_SMID_DOB"
        },
        { jsonPath: "NULMSMIDRequest.dob" }
      ),

      emailId: getLabelWithValue(
        {
          labelName: "Email Id",
          labelKey: "NULM_SMID_EMAIL_ID"
        },
        { jsonPath: "NULMSMIDRequest.emailId" ,
        callBack: checkValueForNA }
      ),

      mobileNo: getLabelWithValue(
        {
          labelName: "Mobile Number",
          labelKey: "NULM_SMID_MOBILE_NUMBER"
        },
        { jsonPath: "NULMSMIDRequest.mobileNo" }
      ),
      phoneNo: getLabelWithValue(
        {
          labelName: "Phone Number",
          labelKey: "NULM_SMID_PHONE_NUMBER"
        },
        { jsonPath: "NULMSMIDRequest.phoneNo" ,
        callBack: checkValueForNA }
      ),
      motherName: getLabelWithValue(
        {
          labelName: "Mother Name",
          labelKey: "NULM_SMID_MOTHER_NAME"
        },
        { jsonPath: "NULMSMIDRequest.motherName" }
      ),
      address: getLabelWithValue(
        {
          labelName: "Addrss",
          labelKey: "NULM_SMID_ADDRESS"
        },
        { jsonPath: "NULMSMIDRequest.address" }
      ),
      gender: getLabelWithValue(
        {
          labelName: "Gender",
          labelKey: "NULM_SMID_GENDER"
        },
        { jsonPath: "NULMSMIDRequest.gender" }
      ),
      isMinority: getLabelWithValue(
        {
          labelName: "Minority",
          labelKey: "NULM_SEP_MINORITY"
        },
        { jsonPath: "NULMSMIDRequest.isMinority" }
      ),
      minority: getLabelWithValue(
        {
          labelName: "Minority",
          labelKey: "NULM_SEP_MINORITY_RELIGION"
        },
        { jsonPath: "NULMSMIDRequest.minority" }
      ),
      wardNo: getLabelWithValue(
        {
          labelName: "Ward No",
          labelKey: "NULM_SMID_WARD_NO"
        },
        { jsonPath: "NULMSMIDRequest.wardNo" }
      ),
      nameAsPerAdhar: getLabelWithValue(
        {
          labelName: "Name as per Adhar",
          labelKey: "NULM_SMID_NAME_AS_PER_ADHAR"
        },
        { jsonPath: "NULMSMIDRequest.nameAsPerAdhar" } 
      ),
      adharNo: getLabelWithValue(
        {
          labelName: "Adhar Number",
          labelKey: "NULM_SMID_ADHAR_NUMBER"
        },
        { jsonPath: "NULMSMIDRequest.adharNo" }
      ),
      // adharAcknowledgementNo: getLabelWithValue(
      //   {
      //     labelName: "Adhar Acknowledgement Number",
      //     labelKey: "NULM_SMID_ADHAR_ACKNOWLEDGEMENT_NUMBER"
      //   },
      //   { jsonPath: "NULMSMIDRequest.adharAcknowledgementNo" }
      // ),

      isInsurance: getLabelWithValue(
        {
          labelName: "Insurance",
          labelKey: "NULM_SMID_INSURANCE"
        },
        { jsonPath: "NULMSMIDRequest.isInsurance" }
      ),
      insuranceThrough: getLabelWithValue(
        {
          labelName: "Insurance through",
          labelKey: "NULM_SMID_INSURANCE_THROUGH"
        },
        { jsonPath: "NULMSMIDRequest.insuranceThrough",
        callBack: checkValueForNA }
      ),
      isStreetVendor: getLabelWithValue(
        {
          labelName: "Street vendor",
          labelKey: "NULM_SMID_STREET_VENDOR"
        },
        { jsonPath: "NULMSMIDRequest.isStreetVendor" }
      ),
      isHomeless: getLabelWithValue(
        {
          labelName: "Homeless",
          labelKey: "NULM_SMID_HOMELESS"
        },
        { jsonPath: "NULMSMIDRequest.isHomeless" }
      ),
      RegistredCMC: getLabelWithValue(
        {
          labelName: "Registred",
          labelKey: "NULM_SMID_CMC_INPUT"
        },
        { jsonPath: "NULMSMIDRequest.isRegistered",
        callBack: checkValueForNA }
      ),
      cobNumber: getLabelWithValue(
        {
          labelName: "cob Number",
          labelKey: "NULM_SEP_COB_NUMBER_INPUT"
        },
        { jsonPath: "NULMSMIDRequest.cobNumber",
        callBack: checkValueForNA },
        
      ),
     
    }),
  });
};
