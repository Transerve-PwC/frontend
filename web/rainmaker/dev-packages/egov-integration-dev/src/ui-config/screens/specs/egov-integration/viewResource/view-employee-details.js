import {
  getBreak,
  getCommonContainer,
  getCommonGrayCard,
  getCommonSubHeader,
  getLabel,
  getLabelWithValue
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { convertEpochToDate, checkValueForNA } from "../../utils";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";

const gotoCreatePage = (state, dispatch) => {
  const createUrl =
    process.env.REACT_APP_SELF_RUNNING === "true"
      ? `/egov-ui-framework/hrms/create?step=0`
      : `/hrms/create?step=0`;
  dispatch(setRoute(createUrl));
};

const getHeader = label => {
  return {
    uiFramework: "custom-molecules-local",
    moduleName: "egov-hrms",
    componentPath: "DividerWithLabel",
    props: {
      className: "hr-generic-divider-label",
      labelProps: {},
      dividerProps: {},
      label
    },
    type: "array"
  };
};

export const getEmployeeDetailsView = (isReview = true) => {
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
            labelName: "Employee Details",
            labelKey: "INTIGRATION_EMP_NEW_EMPLOYEE_FORM_HEADER"
          })
        },
        
      }
    },
    basicDetailsHeader: getHeader({
      labelName: "Employee Basic Details",
      labelKey: "INTIGRATION_EMP_SUMMARY_BASIC_DEATILS_SUBHEADER"
    }),
    break1: getBreak(),
    viewOne: getCommonContainer({
      EmpFullName: getLabelWithValue(
        {
          labelName: "EmpFullName",
          labelKey: "INTIGRATION_EMP_EMPFULLNAME"
        },
        { jsonPath: "Employeebasic.EmpFullName",callBack: checkValueForNA }
      ),
      EmpBirthDate: getLabelWithValue(
        {
          labelName: "Birth Date",
          labelKey: "INTIGRATION_EMP_DATA_OF_BIRTH"
        },
        { jsonPath: "Employeebasic.EmpBirthDate",callBack: checkValueForNA }
      ),
      CurrentDeptName: getLabelWithValue(
        { labelName: "CurrentDeptName", labelKey: "INTIGRATION_EMP_DEPT_NAME" },
        { jsonPath: "Employeebasic.CurrentDeptName",callBack: checkValueForNA }
      ),
      GurdianName: getLabelWithValue(
        {
          labelName: "GurdianName",
          labelKey: "INTIGRATION_EMP_GURDIAN_NAME_LABEL"
        },
        { jsonPath: "Employeebasic.GurdianName" ,callBack: checkValueForNA}
      ),
      MaritalStatus: getLabelWithValue(
        { labelName: "MaritalStatus", labelKey: "INTIGRATION_EMP_MARITAL_STATUS_LABEL" },
        {
          jsonPath: "Employeebasic.MaritalStatus",
          // localePrefix: {
          //   moduleName: "COMMON",
          //   masterName: "GENDER"
          // },
        }
      ),
      PersonalIdentificationMark: getLabelWithValue(
        { labelName: "PersonalIdentificationMark", labelKey: "INTIGRATION_EMP_IDENTIFICATION_MARK" },
        {
          jsonPath: "Employeebasic.PersonalIdentificationMark"
        }
      ),
      BloodGroup: getLabelWithValue(
        { labelName: "BloodGroup", labelKey: "INTIGRATION_EMP_BLOD_GROUP" ,callBack: checkValueForNA},
        {
          jsonPath: "Employeebasic.BloodGroup"
        }
      ),
      Category: getLabelWithValue(
        {
          labelName: "Category",
          labelKey: "INTIGRATION_EMP_CATEGORY"
        },
        {
          jsonPath: "Employeebasic.Category",callBack: checkValueForNA
        }
      ),
      Gender: getLabelWithValue(
        {
          labelName: "Gender",
          labelKey: "INTIGRATION_EMP_GENDER"
        },
        {
          jsonPath: "Employeebasic.Gender",callBack: checkValueForNA
        }
      ),
      CurrentPostingOffice: getLabelWithValue(
        {
          labelName: "CurrentPostingOffice",
          labelKey: "INTIGRATION_EMP_CURRENT_POSTING_OFFICE"
        },
        {
          jsonPath: "Employeebasic.CurrentPostingOffice",callBack: checkValueForNA
        }
      ),
      PayCommissionName: getLabelWithValue(
        {
          labelName: "PayCommissionName",
          labelKey: "INTIGRATION_EMP_PAY_COMMMISSION_NAME"
        },
        {
          jsonPath: "Employeebasic.PayCommissionName",callBack: checkValueForNA
        }
      ),
      PayScaleName: getLabelWithValue(
        {
          labelName: "PayScaleName",
          labelKey: "INTIGRATION_EMP_PAY_SCALE_NAME"
        },
        {
          jsonPath: "Employeebasic.PayScaleName",callBack: checkValueForNA
        }
      ),
      PayBandName: getLabelWithValue(
        {
          labelName: "PayBandName",
          labelKey: "INTIGRATION_EMP_PAY_BRAND_NAME"
        },
        {
          jsonPath: "Employeebasic.PayBandName",callBack: checkValueForNA
        }
      ),
      GradePay: getLabelWithValue(
        {
          labelName: "GradePay",
          labelKey: "INTIGRATION_EMP_GRADE_PAY"
        },
        {
          jsonPath: "Employeebasic.GradePay",callBack: checkValueForNA
        }
      ),
      BasicPay: getLabelWithValue(
        {
          labelName: "BasicPay",
          labelKey: "INTIGRATION_EMP_BASIC_PAY"
        },
        {
          jsonPath: "Employeebasic.BasicPay",callBack: checkValueForNA
        }
      )
    }),
    JoiningRelievingDetailsHeader: getHeader({
      labelName: "Joining Relieving Details Details",
      labelKey: "INTIGRATION_EMP_SUMMARY_JOINING_DEATILS_SUBHEADER"
    }),
    break2: getBreak(),
    viewTwo: getCommonContainer({
      JoiningDate: getLabelWithValue(
        {
          labelName: "JoiningDate",
          labelKey: "INTIGRATION_JOINING_DATE_LABEL"
        },
        { jsonPath: "EmpJoiningdata[0].JoiningDate",callBack: checkValueForNA }
      ),
      designame: getLabelWithValue(
        { labelName: "desig name ", labelKey: "INTIGRATION_EMP_DEGIGNATION_NAME_LABEL" },
        {
          jsonPath: "EmpJoiningdata[0].designame",callBack: checkValueForNA
        }
      ),
      JoiningOffice: getLabelWithValue(
        { labelName: "JoiningOffice", labelKey: "INTIGRATION_EMP_JOINING_OFFICE_LABEL" },
        {
          jsonPath: "EmpJoiningdata[0].JoiningOffice",callBack: checkValueForNA
        }
      ),
 
    }),
    LeaveDetailsHeader: getHeader({
      labelName: "Leave Details",
      labelKey: "INTIGRATION_EMP_SUMMARY_LEAVE_DEATILS_SUBHEADER"
    }),
    break3: getBreak(),
    // viewThree: getCommonContainer({
    //   reviewEmpID: getLabelWithValue(
    //     {
    //       labelName: "Employee ID",
    //       labelKey: "INTIGRATION_EMP_EMP_ID_LABEL"
    //     },
    //     { jsonPath: "Empleavedata[0].code",callBack: checkValueForNA }
    //   ),
    //   reviewDOA: getLabelWithValue(
    //     { labelName: "Date of Appointment", labelKey: "INTIGRATION_EMP_APPT_DATE_LABEL" },
    //     {
    //       jsonPath: "Empleavedata[0].dateOfAppointment" ,callBack: checkValueForNA
    //     }
    //   ),
    //   dateOfSuperannuation: getLabelWithValue(
    //     { labelName: "Date of Superannuation", labelKey: "INTIGRATION_EMP_SUPERANNUATION_DATE_LABEL" },
    //     {
    //       jsonPath: "Empleavedata[0].dateOfSuperannuation" ,callBack: checkValueForNA
    //     }
    //   ),
    //   reviewEmpType: getLabelWithValue(
    //     { labelName: "Employee Type", labelKey: "INTIGRATION_EMP_EMP_TYPE_LABEL" },
    //     {
    //       jsonPath: "Empleavedata[0].employeeType",callBack: checkValueForNA
          
    //     }
    //   ),
    //   reviewStatus: getLabelWithValue(
    //     { labelName: "Status", labelKey: "INTIGRATION_EMP_STATUS_LABEL" },
    //     {
    //       jsonPath: "Empleavedata[0].employeeStatus",callBack: checkValueForNA
          
    //     }
    //   ),
    //   reviewRole: getLabelWithValue(
    //     { labelName: "Role", labelKey: "INTIGRATION_EMP_ROLE_LABEL" },
    //     {
    //       jsonPath: "hrms.reviewScreen.furnishedRolesList",callBack: checkValueForNA
    //     }
    //   )
    // })
  });
};
