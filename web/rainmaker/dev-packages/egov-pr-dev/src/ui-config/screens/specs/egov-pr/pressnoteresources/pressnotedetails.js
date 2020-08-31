import {
    getBreak,
    getCommonCard,
    getCommonContainer,
    getCommonGrayCard,
    getCommonTitle,
    getSelectField,
    getTextField,
    getPattern,
    getLabel,
    getCommonParagraph,
    getDateField
  } from "egov-ui-framework/ui-config/screens/specs/utils";
 import { documentDetails ,MultipleDocumentDetails} from "./emaildocumentDetails";
 import { getTenantId } from "egov-ui-kit/utils/localStorageUtils";
import { httpRequest } from "../../../../../ui-utils";
import AutoComplete from 'material-ui/AutoComplete';
import {localStorageGet, localStorageSet} from "egov-ui-kit/utils/localStorageUtils";
  import "./index.css";

  import { documentsPressNoteSummary } from "../summaryResource/documentsSummary";
  
  import {  masterGrid} from "../searchResource/searchResults";

  
  
  

  export const pressnotedetails = getCommonCard({
    subHeader: getCommonTitle({
        labelName: "Press note Details",
        labelKey: "PR_PRESS_NOTE_DETAILS"
    },
    {
      style: {
        marginBottom: 18,
      }
    }
    ),
    
    appStatusAndToFromDateContainer: getCommonContainer({
        
          date: getDateField({
            label: {
              labelName: "Date",
              labelKey: "PR_PRESS_NOTE_DATE"
            },
            placeholder: {
              labelName: "DD/MM/YYYY",
              labelKey: "PR_PRESS_NOTE_DATE_PLACEHOLDER"
            },
            required: true,
            pattern: getPattern("Date"),
            errorMessage: "PR_PRESS_NOTE_DATE_INVALID",
            jsonPath: "pressnote.date",
            gridDefination: {
              xs: 12,
              sm: 12,
              md: 6
            },
            props:{
              className:"applicant-details-error"
            }
          }),	  
          fileNumber: {
            ...getTextField({
              label: {
                labelName: "File Number",
                labelKey: "PR_PRESS_NOTE_FILE_NUMBER"
              },
              placeholder: {
               labelName: "File Number",
                labelKey: "PR_PRESS_NOTE_FILE_NUMBER_PLACEHOLDER"
              },
              pattern:getPattern("fileNumber"),
              errorMessage: "PR_PRESS_NOTE_FILE_NUMBER_INVALID",
              required: true,
              jsonPath: "pressnote.fileNumber"
            })
          } 
    })
  });
//fileNumber
//TextValidation
  export const pressnotedata = getCommonCard({

    appStatusAndToFromDateContainer: getCommonContainer({
      subject: {
        ...getTextField({
          label: {
            labelName: "Subject",
            labelKey: "PR_PRESS_NOTE_SUBJECT"
          },
          placeholder: {
            labelName: "Subject",
            labelKey: "PR_PRESS_NOTE_SUBJECT_PLACEHOLDER"
          },
          pattern:getPattern("subjectvalidation"),
          errorMessage: "PR_PRESS_NOTE_SUBJECT_INVALID",
          required: true,
          jsonPath: "pressnote.pressSubject",
          gridDefination: {
            xs: 12,
            sm: 12,
            md: 12
          }
        })
      },
      
    }),
    	
	 subHeader: getCommonParagraph({
        labelName: "Note",
        labelKey: "PR_PRESS_NOTE_NOTE"
    }, 
    {
      style: {
        marginBottom: 18,
      }
    }
    ),
  
	pressnotetest : {
		uiFramework: "custom-molecules-local",
          moduleName: "egov-pr",
          componentPath: "RichTextEditor",
          props: { 
				label : "pressnote",
		},
		  jsonPath: "pressnote.notecontent" 
	},
	
  });

  export const pressnoteemailsmsdata = getCommonCard({
    subHeader: getCommonTitle({
        labelName: "Press note Email SMS Details",
        labelKey: "PRESS_NOTE_EAMIL_sMS_DETAILS"
    }),
    
    appStatusAndToFromDateContainer: getCommonContainer({
        
         
          emailsubject: {
            ...getTextField({
              label: {
                labelName: "EMAIL SUBJECT",
                labelKey: "PRESS_NOTE_EMAIL_SUBJECT"
              },
              placeholder: {
               labelName: "EMAIL SUBJECT",
                labelKey: "PRESS_NOTE_EMAIL_SUBJECT_PLACEHOLDER"
              },
             // pattern: /^[a-zA-Z0-9]*$/i,
              errorMessage: "PR_PRESS_NOTE_EMAIL_SUBJECT_INVALID",
              required: true,
              jsonPath: "pressnote.emailsubject"
            })
          } ,
          emailbody: {
            ...getTextField({
              label: {
                labelName: "EMAIL BODY",
                labelKey: "PRESS_NOTE_EMAIL_BODY"
              },
              placeholder: {
               labelName: "EMAIL BODY",
                labelKey: "PRESS_NOTE_EMAIL_BODY_PLACEHOLDER"
              },
             // pattern: /^[a-zA-Z0-9]*$/i,
              errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
              required: true,
              jsonPath: "pressnote.emailbody"
            })
          } ,
          smscontent: {
            ...getTextField({
              label: {
                labelName: "SMS CONTENT",
                labelKey: "PRESS_NOTE_SMS_CONTENT"
              },
              placeholder: {
               labelName:  "SMS CONTENT",
                labelKey: "PRESS_NOTE_SMS_CONTENT_PLACEHOLDER"
              },
              pattern: getPattern("AlphaNumSubjectSMS"),
              errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
              required: true,
              jsonPath: "pressnote.smscontent"
            })
          } 
    })
  });
  
  
  
  
export const EmailSmsContent = getCommonCard({
	//  subjectemail: getCommonTitle(
  //   {
  //     labelName: "Subject",
  //     labelKey: "PR_EMAIL_Subject"
  //   },
  //   {
  //    style: {
  //       marginBottom: 20,
	// 	marginTop: 20
  //     }
  //   },
    
  // ),
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
     pattern:getPattern("subjectvalidation"),
      errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
      required: true,
      jsonPath: "pressnote.subjectemail",
	   gridDefination: {
          xs: 12,
          sm: 12,
          md: 12
        }
    })
  } ,
  //AlphaNumSubjectSMS
  // break: getBreak(),
  //  break: getBreak(),
  // Emailsubject: {
  //    uiFramework: "custom-molecules-local",
  //         moduleName: "egov-pr",
  //         componentPath: "RichTextEditor",
  //         props: { label : "subject"}
  // },
  break: getBreak(),	
	headeremail: getCommonParagraph(
    {
      labelName: "Email Template",
      labelKey: "PR_EMAIL_TEMPLATE"
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
  EmailContent: {
     uiFramework: "custom-molecules-local",
          moduleName: "egov-pr",
          componentPath: "RichTextEditor",
          props: { label : "email"}
  },
  break: getBreak(),
  
    break: getBreak(),

   break: getBreak(),
  
  documentsPressNoteSummary,
  break: getBreak(),
  MultipleDocumentDetails,
   break: getBreak(),
   headersms:  getCommonParagraph(
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
  break: getBreak(),
    
  // SMSContent: {
     // uiFramework: "custom-molecules-local",
          // moduleName: "egov-pr",
          // componentPath: "RichTextEditor",
          // props: { label : "sms"}
  // },
  // break: getBreak(),
   // break: getBreak(),
   SMSContent: {
    ...getTextField({
      label: {
        labelName: "SMS Template",
        labelKey: "PR_SMS_TEMPLATE"
      },
      pattern: getPattern("subjectvalidation"),
      errorMessage: "PR_SMS_INVALID",
      required: true,
      jsonPath: "pressnote.SMSContent",
      props:{
        className:"textfield-enterable-selection",
        multiline: true,
        rows: "4"
      },
	   gridDefination: {
          xs: 12,
          sm: 12,
          md: 12
        }
    })
  }
  
});  


export const textnotevalue =(action, state, dispatch) =>
{
	let textvalue = locaStorageGet("pressnote")  
	
		
}


