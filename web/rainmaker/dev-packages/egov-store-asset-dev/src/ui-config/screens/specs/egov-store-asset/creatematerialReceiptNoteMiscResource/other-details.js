import {
    getCommonCard,
    getCommonGrayCard,
    getCommonTitle,
    getCommonSubHeader,
    getTextField,
    getSelectField,
    getCommonContainer,
    getPattern,
    getDateField
  } from "egov-ui-framework/ui-config/screens/specs/utils";
  
 
  
  export const otherDetails = getCommonCard({
    header: getCommonTitle(
      {
        labelName: "Other Details",
        labelKey: "STORE_MATERIAL_OTHER_DETAILS"
      },
      {
        style: {
          marginBottom: 18
        }
      }
    ),
  
    View1: getCommonGrayCard({
      header1: getCommonTitle(
        {
          labelName: "Purchasing Information",
          labelKey: "STORE_MATERIAL_INDENT_NOTE_APPROVAL_INFORMTION"
        },
        {
          style: {
            marginBottom: 18
          }
        }
      ),
      ApprovalInformationContainer: getCommonContainer({
        ApprovalDate: {
          ...getDateField({
            label: {
              labelName: "Approval Date",
              labelKey: "STORE_MATERIAL_INDENT_NOTE_APPROVAL_DATE"
            },
            placeholder: {
              labelName: "Enter Approval Date",
              labelKey: "STORE_MATERIAL_INDENT_NOTE_APPROVAL_DATE_PLACEHOLDER"
            },
            required: false,
           props:{
          disabled:true,
           },
            jsonPath: "materialIssues[0].ApprovalDate",
            
          
          })
        },
        ApprovalName: {
          ...getTextField({
            label: {
              labelName: "Approval Name",
              labelKey: "STORE_MATERIAL_INDENT_NOTE_APPROVAL_NAME"
            },
            placeholder: {
              labelName: "Approval Name",
              labelKey: "STORE_MATERIAL_INDENT_NOTE_APPROVAL_NAME"
            },
            required: false,
            props:{
              disabled:true,
                         },
            pattern: getPattern("Name") || null,
            jsonPath: "materialIssues[0].ApprovalName"
          })
        },
        ApprovalDEgignation: {
          ...getTextField({
            label: {
              labelName: "Approval Designation",
              labelKey: "STORE_MATERIAL_INDENT_NOTE_APPROVAL_DESIGNATION"
            },
            placeholder: {
              labelName: "Approval Designation",
              labelKey: "STORE_MATERIAL_INDENT_NOTE_APPROVAL_DESIGNATION"
            },
            required: false,
            props:{
              disabled:true,
                         },
            pattern: getPattern("Name") || null,
            jsonPath: "materialIssues[0].ApprovalDEgignation"
          })
        },
        ApprovalStatus: {
          ...getTextField({
            label: {
              labelName: "Approval Status",
              labelKey: "STORE_MATERIAL_INDENT_NOTE_APPROVAL_STATUS"
            },
            placeholder: {
              labelName: "Approval Status",
              labelKey: "STORE_MATERIAL_INDENT_NOTE_APPROVAL_STATUS"
            },
            required: false,
            props:{
              disabled:true,
                         },
            pattern: getPattern("Name") || null,
            jsonPath: "materialIssues[0].ApprovalStatus"
          })
        }, 
        ApprovalRemark: {
          ...getTextField({
            label: {
              labelName: "Approval Remarks",
              labelKey: "STORE_MATERIAL_INDENT_NOTE_APPROVAL_REMARKS"
            },
            placeholder: {
              labelName: "Enter Approval Remarks",
              labelKey: "STORE_MATERIAL_INDENT_NOTE_APPROVAL_REMARKS_PLACEHOLDER"
            },
            required: false,
            props: {
              disabled:true,
              className: "applicant-details-error",
              multiline: "multiline",
              rowsMax: 2,
            },
            pattern: getPattern("Name") || null,
            jsonPath: "materialIssues[0].ApprovalRemark"
          })
        },  
       
      }), 
    }),

    
  });
  

  