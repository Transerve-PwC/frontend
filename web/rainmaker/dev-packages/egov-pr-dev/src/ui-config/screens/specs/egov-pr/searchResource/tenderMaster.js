import {
  getCommonCard,
  getCommonContainer,
  getCommonTitle,
  getDateField,
  getPattern,
  getTextField,
  getBreak,
  getCommonParagraph
} from "egov-ui-framework/ui-config/screens/specs/utils";



export const tenderMasterCreate = getCommonCard({
  subHeader: getCommonTitle({
    labelName: "Tender Notice Details",
    labelKey: "PR_TENDER_NOTICE_DETAILS"
  }),

  appStatusAndToFromDateContainer: getCommonContainer({

    date: getDateField({
      label: {
        labelName: "Date",
        labelKey: "PR_TENDER_DETAILS_DATE"
      },
      placeholder: {
        labelName: "DD/MM/YYYY",
        labelKey: "PR_TENDER_DETAILS_DATE_PLACEHOLDER"
      },
      required: true,
      pattern: getPattern("Date"),
      errorMessage: "PR_TENDER_DATE_INVALID",
      jsonPath: "tenderNotice.tenderDate",
      gridDefination: {
        xs: 12,
        sm: 12,
        md: 6
      },
      props: {
        className: "applicant-details-error"
      }
    }),
    fileNumber: {
      ...getTextField({
        label: {
          labelName: "File Number",
          labelKey: "PR_TENDER_DETAILS_FILE_NUMBER"
        },
        placeholder: {
          labelName: "File Number",
          labelKey: "PR_TENDER_DETAILS_FILE_NUMBER_PLACEHOLDER"
        },
        pattern:getPattern("fileNumber"),
        errorMessage: "PR_TENDER_FILE_NUMBER_INVALID",
        required: true,
        jsonPath: "tenderNotice.fileNumber"
      })
    }
  })
});

export const tenderMSWordTemplate = getCommonCard({

  appStatusAndToFromDateContainer: getCommonContainer({
    subject: {
      ...getTextField({
        label: {
          labelName: "Subject",
          labelKey: "PR_TENDER_DETAILS_SUBJECT"
        },
        placeholder: {
          labelName: "Subject",
          labelKey: "PR_TENDER_DETAILS_SUBJECT_PLACEHOLDER"
        },
        pattern: getPattern("subjectvalidation"),
        errorMessage: "PR_TENDER_SUBJECT_INVALID",
        required: true,
        jsonPath: "tenderNotice.tenderSubject",
        gridDefination: {
          xs: 12,
          sm: 12,
          md: 12
        }
      })
    },


    TenderDetails: {
      
    },
    // subHeader: getCommonParagraph({
    //   labelName: "Note",
    //   labelKey: "PR_TENDER_NOTICE_NOTE"
    // }),

    
}),	


break: getBreak(),
subHeader: getCommonParagraph({
  labelName: "Note",
  labelKey: "PR_TENDER_DETAILS"
}),
	break: getBreak(),
    EmailContent: {
      uiFramework: "custom-molecules-local",
      moduleName: "egov-pr",
      componentPath: "RichTextEditor",
      props: {
		label : "tendernote",
	  }
    },
   
  
});


