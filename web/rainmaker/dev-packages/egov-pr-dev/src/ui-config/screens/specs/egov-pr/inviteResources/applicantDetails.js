import {
  getBreak,
  getCommonCard,
  getCommonContainer,
  getCommonGrayCard,
  getCommonSubHeader,
  getCommonTitle,
  getSelectField,
  getTextField,
  getDateField,
  getPattern,
  getLabel,
  getCommonParagraph
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { prepareFinalObject, handleScreenConfigurationFieldChange as handleField } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getDetailsForOwner, getTextToLocalMapping } from "../../utils";
import { GetEmployees, SearchEmployees, InvitePress } from "../searchResource/citizenSearchFunctions";
import get from "lodash/get";
import "./index.css";
import { getTenantId } from "egov-ui-kit/utils/localStorageUtils";
import { documentDetails } from "./emaildocumentDetails";
import { httpRequest } from "../../../../../ui-utils";
import AutoComplete from 'material-ui/AutoComplete';
import { localStorageGet, localStorageSet } from "egov-ui-kit/utils/localStorageUtils";


const showComponent = (dispatch, componentJsonPath, display) => {
  let displayProps = display ? {} : { display: "none" };
  dispatch(
    handleField("apply", componentJsonPath, "props.style", displayProps)
  );
};

export const applicantDetails = getCommonCard({
  header: getCommonTitle(
    {
      labelName: "Internal Guests",
      labelKey: "PR_INTERNAL_GUESTS_HEADER"
    },
    {
      style: {
        marginBottom: 18,

      }
    }
  ),

  applicantTypeContainer: getCommonContainer({
    applicantTypeSelection: getCommonContainer({
      header1: getCommonTitle(
        {
          labelName: "Select Department",
          labelKey: "PR_SELECT_DEPARTMENT_LABEL_HEADER"
        },
        {
          style: {
            fontSize: "12px",
            textAlign: "left",
            width: "100%",

          }
        }
      ),
      break: getBreak(),
      MultiSelect: {
        uiFramework: "custom-molecules-local",
        moduleName: "egov-pr",
        componentPath: "MultiSelect",
        props: {
          optionvalue: []
        },
        sourceJsonPath: "applyScreenMdmsData.departments.MdmsRes.common-masters.Department"
      },
      break: getBreak(),
      SearchEmployee: {
        ...getTextField({
          label: {
            labelName: "Search Employee",
            labelKey: "PR_SEARCH_EMPLOYEE_"
          },
          placeholder: {
            labelName: "Search Employee",
            labelKey: "PR_SEARCH_EMPLOYEE_"
          },
          gridDefination: {
            xs: 12,
            sm: 12,
            md: 12
          },
          props: {
            style: {
              marginTop: "30px"
            }
          },
          pattern: getPattern("Name"),
          errorMessage: "PR_EMPLOYEE_NAME_INVALID",
          jsonPath: "CreateInvite.employeename",
        })
      },
      GetEmployees: {
        componentPath: "Button",
        props: {
          variant: "contained",
          color: "primary",
          style: {
            height: "48px",
            marginRight: "45px",
            marginTop: "10px",
            minWidth:"140px"

          }
        },
        children: {
          nextButtonLabel: getLabel({
            labelName: "Search Employees",
            labelKey: "PR_SEARCH_EMPLOYEES_BUTTON"
          }),
          nextButtonIcon: {
            uiFramework: "custom-atoms",
            componentPath: "Icon",
            props: {
              iconName: "keyboard_arrow_right"
            }
          }
        },
        onClickDefination: {
          action: "condition",
          callBack: (state, dispatch) => { GetEmployees(state, dispatch) }
        }
      }

    }),

  })
});




export const pressDetails = getCommonCard({
  header: getCommonTitle(
    {
      labelName: "Press Guest",
      labelKey: "PR_PRESS_GUEST"
    },
 
    {
      style: {
        marginBottom: 18
      }
    }
  ),
  subText: getCommonParagraph({
    labelName: "Select Publication Name",
    
    labelKey: "PR_SELECT_PUBLICATION"
  }),
  break: getBreak(),
  pressContainer: getCommonContainer({
    break: getBreak(),
    selectmultipress: {
      uiFramework: "custom-molecules-local",
      moduleName: "egov-pr",
      componentPath: "MultiSelectPress",
      props: {
        optionvalue: []
      },
      //sourceJsonPath : "applyScreenMdmsData.departments.MdmsRes.common-masters.Department"
    },
    break: getBreak(),
    break: getBreak(),
    GetEmployees: {
      componentPath: "Button",
      props: {
        variant: "contained",
        color: "primary",
        style: {
          height: "48px",
          marginRight: "45px",
         // marginLeft: "16px",
          marginTop: "20px",
          minWidth: "140px"
        }
      },
      //  gridDefination: {
      //       xs: 12,
      //       sm: 12,
      //       md: 12
      //     },
      children: {
        nextButtonLabel: getLabel({
          labelName: "Invite Press",
          labelKey: "PR_INVITE_PRESS_BUTTON"
        }),
        nextButtonIcon: {
          uiFramework: "custom-atoms",
          componentPath: "Icon",
          props: {
            iconName: "keyboard_arrow_right"
          }
        }
      },
      onClickDefination: {
        action: "condition",
        callBack: (state, dispatch) => { InvitePress(state, dispatch) }
      }
    },
    cancel: {
      componentPath: "Button",
      props: {
        variant: "contained",
       // color: "primary",
        style: {
          backgroundColor: "unset",
          color: "rgb(254, 122, 81)",
          border: "1px solid rgb(254, 122, 81)",
          borderRadius: "2px",
          height: "48px",
          marginRight: "45px",
          marginTop: "20px",
          minWidth:"140px"

        }
      },
      children: {
        nextButtonLabel: getLabel({
          labelName: "Cancel",
          labelKey: "PR_BUTTON_CANCEL"
        }),
        nextButtonIcon: {
          uiFramework: "custom-atoms",
          componentPath: "Icon",
          props: {
            iconName: "keyboard_arrow_right"
          }
        }
      },
      onClickDefination: {


        action: "condition",
        callBack: (action, state, dispatch) => { window.location.reload(); }
      }
    }

  })
});


export const searchemployee = getCommonCard({
  searchempContainer: getCommonContainer({
    SearchEmployee: {
      ...getTextField({
        label: {
          labelName: "Search Employee",
          labelKey: "PR_SEARCH_EMPLOYEE_"
        },
        placeholder: {
          labelName: "Search Employee",
          labelKey: "PR_SEARCH_EMPLOYEE_"
        },
        gridDefination: {
          xs: 12,
          sm: 8,
          md: 8
        },
        required: true,
        pattern: getPattern("Name"),
        errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
        jsonPath: "CreateInvite.employeename",
      })
    },
    SearchEmployeebtn: {
      componentPath: "Button",
      props: {
        variant: "contained",
        color: "primary",
        style: {
          height: "48px",
          marginRight: "45px",
          width: "100%"
        }
      },
      gridDefination: {
        xs: 12,
        sm: 4,
        md: 4
      },
      children: {
        nextButtonLabel: getLabel({
          labelName: "Search Employee",
          labelKey: "PR_SEARCH_EMPLOYEE_BUTTON"
        }),
        nextButtonIcon: {
          uiFramework: "custom-atoms",
          componentPath: "Icon",
          props: {
            iconName: "keyboard_arrow_right"
          }
        }
      },
      onClickDefination: {
        action: "condition",
        callBack: (state, dispatch) => { SearchEmployees(state, dispatch) }
      }
    },
    gridDefination: {
      md: 12,
      sm: 12,
      xs: 12
    }
  })
});




export const EmailSmsContent = getCommonCard({


  
  subjectemail: {
    ...getTextField({
     
      label: {
        labelName: "Subject",
        labelKey: "PR_EMAIL_Subject"
      },
      placeholder: {
        labelName: "Subject",
        labelKey: "PR_EMAIL_Subject_PLACEHOLDER"
      },
      pattern: getPattern("subjectvalidation"),
      errorMessage: "PR_EMAIL_SUBJECT_INVALID",
      required: true,
      jsonPath: "CreateInvite.subjectemail",
      gridDefination: {
        xs: 12,
        sm: 12,
        md: 12
      }
    })
  },
  headeremail:  getCommonParagraph(
  // getCommonTitle(
    {
      labelName: "Email Template",
      labelKey: "PR_EMAIL_TEMPLATE"
    },
    {
      style: {
        marginBottom: 18,
        marginTop: 20
      }
    }
  ),
  break: getBreak(),
  break: getBreak(),
  EmailContent: {
    uiFramework: "custom-molecules-local",
    moduleName: "egov-pr",
    componentPath: "RichTextEditor",
    props: { label: "email" }
  },
  break: getBreak(),
  break: getBreak(),
  attachment: documentDetails,
  break: getBreak(),
  break: getBreak(),
  headersms: getCommonParagraph(
  // getCommonTitle(
    {
      labelName: "SMS Template",
      labelKey: "PR_SMS_TEMPLATE"
    },
    {
      style: {
        marginBottom: 20,
        marginTop: 20
      }
    }
  ),
  break: getBreak(),
  break: getBreak(),

  // SMSContent: {
  // uiFramework: "custom-molecules-local",
  // moduleName: "egov-pr",
  // componentPath: "RichTextEditor",
  // props: { label : "sms"}
  // },
  SMSContent: {
    ...getTextField({
      label: {
        labelName: "sms",
        labelKey: "PR_SMS_TEMPLATE"
      },
      placeholder: {
        labelName: "",
        labelKey: ""
      },
      pattern: getPattern("subjectvalidation"),
      errorMessage: "PR_SMS_INVALID",
      required: true,
      jsonPath: "CreateInvite.SMSContent",
      props: {
        className: "textfield-enterable-selection",
        multiline: true,
        rows: "4"
      },
      gridDefination: {
        xs: 12,
        sm: 12,
        md: 12
      }
    })
  },
  break: getBreak(),
  break: getBreak(),

});  