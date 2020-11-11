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
   const createUrl = `/egov-nulm/create-susv?step=0`;
  dispatch(setRoute(createUrl));
};

export const getSUSVDetailsView = (isReview = true) => {
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
            labelName: "SUSV Details",
            labelKey: "NULM_SUSV_DETAILS"
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
      nameOfApplicant: getLabelWithValue(
        {
          labelName: "Name of Applicant",
          labelKey: "NULM_SMID_NAME_OF_APPLICANT"
        },
        { jsonPath: "NulmSusvRequest.nameOfApplicant" }
      ),
      fatherOrHusbandName: getLabelWithValue(
        {
          labelName: "Father/Spouse Name",
          labelKey: "NULM_SMID_FATHER/SPOUSE_NAME"
        },
        { jsonPath: "NulmSusvRequest.fatherOrHusbandName" }
      ),
      motherName: getLabelWithValue(
        {
          labelName: "Mother Name",
          labelKey: "NULM_SMID_MOTHER_NAME"
        },
        { jsonPath: "NulmSusvRequest.motherName" }
      ),
      age: getLabelWithValue(
        {
          labelName: "Age",
          labelKey: "NULM_SEP_AGE"
        },
        { jsonPath: "NulmSusvRequest.age",
        callBack: checkValueForNA  }
      ),
      dateofbirth: getLabelWithValue(
        {
          labelName: "Date Of Birth",
          labelKey: "NULM_SEP_DOB"
        },
        { jsonPath: "NulmSusvRequest.dob",
        callBack: checkValueForNA  }
      ), 
      gender: getLabelWithValue(
        {
          labelName: "Gender",
          labelKey: "NULM_SMID_GENDER"
        },
        { jsonPath: "NulmSusvRequest.gender" }
      ),
      category: getLabelWithValue(
        {
          labelName: "Caste of Applicant",
          labelKey: "NULM_SMID_CASTE_OF_APPLICANT",
        },
        { jsonPath: "NulmSusvRequest.category" }
      ),
     
      presentAddress: getLabelWithValue(
        {
          labelName: "Present Address of Street Vendor",
          labelKey: "NULM_SUSV_PRESENT_ADDRESS"
        },
        { jsonPath: "NulmSusvRequest.presentAddress" }
      ),
      
      permanentAddress: getLabelWithValue(
        {
          labelName: "Permanent Address of Street Vendor",
          labelKey: "NULM_SUSV_PERMANENT_ADDRESS"
        },
        { jsonPath: "NulmSusvRequest.permanentAddress" }
      ),
      mobileNo: getLabelWithValue(
        {
          labelName: "Mobile Number",
          labelKey: "NULM_SMID_MOBILE_NUMBER"
        },
        { jsonPath: "NulmSusvRequest.mobileNo" }
      ),
      qualification: getLabelWithValue(
        {
          labelName: "Qualification",
          labelKey: "NULM_SEP_QUALIFACATION"
        },
        { jsonPath: "NulmSusvRequest.qualification" }
      ),
      adharNo: getLabelWithValue(
        {
          labelName: "Adhar Number",
          labelKey: "NULM_SMID_ADHAR_NUMBER"
        },
        { jsonPath: "NulmSusvRequest.adharNo" }
      ),
      isDisability: getLabelWithValue(
        {
          labelName: "Disable",
          labelKey: "NULM_SUSV_DISABLE"
        },
        { jsonPath: "NulmSusvRequest.isDisability" }
      ),
      bloodGroup: getLabelWithValue(
        {
          labelName: "Blood Group",
          labelKey: "NULM_SUSV_BLOOD_GROUP"
        },
        { jsonPath: "NulmSusvRequest.bloodGroup" }
      ), 
      categoryOfVending: getLabelWithValue(
        {
          labelName: "Proposed Category of Vending",
          labelKey: "NULM_SUSV_CATEGORY_VENDING"
        },
        { jsonPath: "NulmSusvRequest.categoryOfVending" }
      ), 
      proposedLocationOfVending: getLabelWithValue(
        {
          labelName: "Proposed Zone/ward/Location",
          labelKey: "NULM_SUSV_PROPOSED_LOCATION"
        },
        { jsonPath: "NulmSusvRequest.proposedLocationOfVending" }
      ), 
      proposedTimeOfVending: getLabelWithValue(
        {
          labelName: "Proposed time of Vending",
          labelKey: "NULM_SUSV_PROPOSED_TIME"
        },
        { jsonPath: "NulmSusvRequest.proposedTimeOfVending" }
      ),
      govermentScheme: getLabelWithValue(
        {
          labelName: "Government Scheme(Applicable if Beneficiary/Poor)",
          labelKey: "NULM_SUSV_GOVT_SCHEME"
        },
        { jsonPath: "NulmSusvRequest.govermentScheme" }
      ),
      nameOfNominee: getLabelWithValue(
        {
          labelName: "Name of Nominee of street Vendor",
          labelKey: "NULM_SUSV_NAME_OF_NOMINEE"
        },
        { jsonPath: "NulmSusvRequest.nameOfNominee" }
      ),  
    }),
  });
};
