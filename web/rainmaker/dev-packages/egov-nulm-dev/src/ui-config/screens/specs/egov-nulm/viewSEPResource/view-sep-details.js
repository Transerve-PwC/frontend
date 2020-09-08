import {
  getCommonContainer,
  getCommonGrayCard,
  getCommonSubHeader,
  getLabel,
  getLabelWithValue
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";

const gotoCreatePage = (state, dispatch) => {
   const createUrl = `/egov-nulm/create-sep?step=0`;
  dispatch(setRoute(createUrl));
};

export const getSEPDetailsView = (isReview = true) => {
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
            labelName: "SEP Details",
            labelKey: "NULM_APPLICATION_FOR_SEP_PROGRAM"
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
      applicantname: getLabelWithValue(
        {
          labelName: "Name of Applicant",
          labelKey: "NULM_SEP_NAME_OF_APPLICANT"
        },
        { jsonPath: "NULMSEPRequest.name" }
      ),
      gender: getLabelWithValue(
        {
          labelName: "Gender",
          labelKey: "NULM_SEP_GENDER"
        },
        { jsonPath: "NULMSEPRequest.gender" }
      ),
      age: getLabelWithValue(
        {
          labelName: "age",
          labelKey: "NULM_SEP_AGE"
        },
        { jsonPath: "NULMSEPRequest.age" }
      ),
      
      dateofbirth: getLabelWithValue(
        {
          labelName: "Date Of Birth",
          labelKey: "NULM_SEP_DOB"
        },
        { jsonPath: "NULMSEPRequest.dob" }
      ),

      adharNo: getLabelWithValue(
        {
          labelName: "Adhar Number",
          labelKey: "NULM_SEP_ADHAR_NUMBER"
        },
        { jsonPath: "NULMSEPRequest.adharNo" }
      ),

      mothername: getLabelWithValue(
        {
          labelName: "Mother Number",
          labelKey: "NULM_SEP_MOTHER_NAME"
        },
        { jsonPath: "NULMSEPRequest.motherName" }
      ),


      fatherhusbandname: getLabelWithValue(
        {
          labelName: "Father/Husband Name",
          labelKey: "NULM_SEP_FATHER/HUSBAND_NAME"
        },
        { jsonPath: "NULMSEPRequest.fatherOrHusbandName" }
      ),


      occupation: getLabelWithValue(
        {
          labelName: "Occupation",
          labelKey: "NULM_SEP_OCCUPATION"
        },
        { jsonPath: "NULMSEPRequest.occupation" }
      ),

      address: getLabelWithValue(
        {
          labelName: "Addrss",
          labelKey: "NULM_SMID_ADDRESS"
        },
        { jsonPath: "NULMSEPRequest.address" }
      ),

      contactnumber: getLabelWithValue(
        {
          labelName: "Contact Number",
          labelKey: "NULM_SEP_CONTACT_NUMBER"
        },
        { jsonPath: "NULMSEPRequest.contact" }
      ),

      sincehowlonginchandigarh: getLabelWithValue(
        {
          labelName: "Since how long in Chandigarh",
          labelKey: "NULM_SEP_SINCE_HOW_LONG_IN_CHANDIGARH"
        },
        { jsonPath: "NULMSEPRequest.sinceHowLongInChandigarh" }
      ),

      qualification: getLabelWithValue(
        {
          labelName: "Qualification",
          labelKey: "NULM_SEP_QUALIFACATION"
        },
        { jsonPath: "NULMSEPRequest.qualification" }
      ),

      category: getLabelWithValue(
        {
          labelName: "Category",
          labelKey: "NULM_SEP_CATEGORY"
        },
        { jsonPath: "NULMSEPRequest.category" }
      ),
      isUrbanPoor: getLabelWithValue(
        {
          labelName: "Urban Poor",
          labelKey: "NULM_SEP_URBAN_ROOR"
        },
        { jsonPath: "NULMSEPRequest.isUrbanPoor" }
      ),
      bplNo: getLabelWithValue(
        {
          labelName: "BPL NULM_SEP_BPL_NUMBER",
          labelKey: "NULM_SMID_BPL_NUMBER"
        },
        { jsonPath: "NULMSEPRequest.bplNo" }
      ),
      isMinority: getLabelWithValue(
        {
          labelName: "Minority",
          labelKey: "NULM_SEP_MINORITY"
        },
        { jsonPath: "NULMSEPRequest.isMinority" }
      ),
      minority: getLabelWithValue(
        {
          labelName: "Minority Religion",
          labelKey: "NULM_SEP_MINORITY_RELIGION"
        },
        { jsonPath: "NULMSEPRequest.minority" }
      ),
      isHandicapped: getLabelWithValue(
        {
          labelName: "Urban Poor",
          labelKey: "NULM_SEP_HANDICAPPED"
        },
        { jsonPath: "NULMSEPRequest.isHandicapped" }
      ),
      typeofbusiness: getLabelWithValue(
        {
          labelName: "Type of Business/Industry/Service/activity proposed to be started",
          labelKey: "NULM_SEP_TYPE_OF_BUSINESS/INDUSTRY/SERVICE/ACTIVITY_PROPOSED_TO_BE_STARTED "
        },
        { jsonPath: "NULMSEPRequest.typeOfBusinessToBeStarted" }
      ),
      previousExperience: getLabelWithValue(
        {
          labelName: "Previous experience in the line if any",
          labelKey: "NULM_SEP_PREVIOUS_EXPERIENCE_IN_THE_LINE_IF_ANY_PLACEHOLDER"
        },
        { jsonPath: "NULMSEPRequest.previousExperience" }
      ),
      placeOfWork: getLabelWithValue(
        {
          labelName: "Place of work whether the activity is proposed to be started",
          labelKey: "NULM_SEP_PLACE_OF_WORK_WHETHER_THE_ACTIVITY_IS_PROPOSED_TO_BE_STARTED"
        },
        { jsonPath: "NULMSEPRequest.placeOfWork" }
      ),

      bankDetails: getLabelWithValue(
        {
          labelName: "Details of account of beneficiary-bank Name/Branch/A/C name (Only in Chandigarh)",
          labelKey: "NULM_SEP_OF_ACCOUNT_OF_BENEFICIARY_BANK_A_C_NAME_ONLY_IN_CHANDIGARH)"
        },
        { jsonPath: "NULMSEPRequest.bankDetails" }
      ),
      noOfFamilyMembers: getLabelWithValue(
        {
          labelName: "No. of family members",
          labelKey: "NULM_SEP_NO_OF_FAMILY_MEMBERS"
        },
        { jsonPath: "NULMSEPRequest.noOfFamilyMembers" }
      ),
      projectCost: getLabelWithValue(
        {
          labelName: "Project Cost",
          labelKey: "NULM_SEP_PROJECT_COST"
        },
        { jsonPath: "NULMSEPRequest.projectCost" }
      ),
      loanAmount: getLabelWithValue(
        {
          labelName: "Amount of Loan required",
          labelKey: "NULM_SEP_AMOUNT_OF_LOAN_REQUIRED"
        },
        { jsonPath: "NULMSEPRequest.loanAmount" }
      ),
      recommendedAmount: getLabelWithValue(
        {
          labelName: "Amount Recommended by Task Force Committee",
          labelKey: "NULM_SEP_AMOUNT_RECOMMENDED_BY_TASK_FORCE_COMMITTEE"
        },
        { jsonPath: "NULMSEPRequest.recommendedAmount" }
      ),

      isLoanFromBankinginstitute: getLabelWithValue(
        {
          labelName: "Whether taken loan from any banking/financial institute",
          labelKey: "NULM_SEP_WHETHER_TAKEN_LOAN_FROM_ANY_BANKING/FINANCIAL_INSTITUTE"
        },
        { jsonPath: "NULMSEPRequest.isLoanFromBankinginstitute" }
      ),
      isRepaymentMade: getLabelWithValue(
        {
          labelName: "If Yes , whether all repayment made ?",
          labelKey: "NULM_SEP_IF_YES_WHEATHER_ALL_REPAYMENT_MADE?"
        },
        { jsonPath: "NULMSEPRequest.isRepaymentMade" }
      ),

      recommendedBy: getLabelWithValue(
        {
          labelName: "Recommended by",
          labelKey: "NULM_SEP_RECOMMENDED_BY"
        },
        { jsonPath: "NULMSEPRequest.recommendedBy" }
      ),
      representativeName: getLabelWithValue(
        {
          labelName: "Particulars of representative Name",
          labelKey: "NULM_SEP_PARTICULARS_OF_REPRESENTATIVE_NAME"
        },
        { jsonPath: "NULMSEPRequest.representativeName" }
      ),
      representativeAddress: getLabelWithValue(
        {
          labelName: "Particulars of representative Address",
          labelKey: "NULM_SEP_PARTICULARS_OF_REPRESENTATIVE_ADDRESS"
        },
        { jsonPath: "NULMSEPRequest.representativeAddress" }
      ),
    }),
  });
};
