import {
    getCommonCard,
    getCommonTitle,
    getTextField,
    getDateField,
    getSelectField,
    getCommonContainer,
    getPattern
  } from "egov-ui-framework/ui-config/screens/specs/utils";
 // import { getTodaysDateInYMD } from "../../utils";
 import set from "lodash/set";
 import get from "lodash/get";
 import { getSTOREPattern} from "../../../../../ui-utils/commons";
 import { getTenantId } from "egov-ui-kit/utils/localStorageUtils";
 import {
  convertDateToEpoch,
} from "../../utils";
import{GetMdmsNameBycode} from '../../../../../ui-utils/storecommonsapi'
import { toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";
 import {  handleScreenConfigurationFieldChange as handleField, prepareFinalObject  } from "egov-ui-framework/ui-redux/screen-configuration/actions";
 import { httpRequest } from "../../../../../ui-utils/api";
 import { getQueryArg } from "egov-ui-framework/ui-utils/commons";

 const id = getQueryArg(window.location.href, "id");
 let isEditMode = false
 if(id)
 {
  isEditMode = true;
 }
  export const MaterialTransferInwordNote = getCommonCard({
    header: getCommonTitle(
      {
        labelName: "Material Transfer Inward ",
        labelKey: "STORE_MATERIAL_TRANSFER_INWARD"
      },
      {
        style: {
          marginBottom: 18
        }
      }
    ),
    MaterialReceiptNoteContainer: getCommonContainer({

      TransferOutwordNo: {
        ...getSelectField({
          label: {
            labelName: "Transfer Outword No.",
            labelKey: "STORE_MATERIAL_OUTWORD_NO"
          },
          placeholder: {
            labelName: "Select  Transfer Outword No.",
            labelKey: "STORE_MATERIAL_OUTWORD_NO_SELECT"
          },
          required: false,
         
          jsonPath: "materialReceipt[0].TransferOutwordNo.code",
          sourceJsonPath: "materialOutword.materialIssues",
            props: {
              disabled:isEditMode,
              optionValue: "issueNumber",
              optionLabel: "issueNumber",
            },
        }),
        beforeFieldChange: (action, state, dispatch) => {
          let materialIssues = get(
            state.screenConfiguration.preparedFinalObject,
            `materialOutword.materialIssues`,
            []
          ); 
          materialIssues =  materialIssues.filter(x=> x.issueNumber === action.value)  
          if(materialIssues && materialIssues[0]) 
          {
            dispatch(prepareFinalObject("transferInwards[0].issueNumber",materialIssues[0].issueNumber));
            dispatch(prepareFinalObject("transferInwards[0].receivingStore.code",materialIssues[0].toStore.code));
            dispatch(prepareFinalObject("transferInwards[0].receivingStore.name",materialIssues[0].toStore.name));
            dispatch(prepareFinalObject("transferInwards[0].issueingStore.code",materialIssues[0].fromStore.code));
            dispatch(prepareFinalObject("transferInwards[0].issueingStore.name",materialIssues[0].fromStore.name));
            dispatch(prepareFinalObject("transferInwards[0].issueDate", convertDateToEpoch(materialIssues[0].issueDate, "dayStart")));
            dispatch(prepareFinalObject("transferInwards[0].indent.issueStore.code",materialIssues[0].indent.issueStore.code));
            dispatch(prepareFinalObject("transferInwards[0].indent.issueStore.name",materialIssues[0].indent.issueStore.name));
            dispatch(prepareFinalObject("transferInwards[0].indent.indentStore.code",materialIssues[0].indent.indentStore.code));
            dispatch(prepareFinalObject("transferInwards[0].indent.indentStore.name",materialIssues[0].indent.indentStore.name));
            const {transferInwards}  = state.screenConfiguration.preparedFinalObject;
            if(transferInwards && transferInwards[0])
            {
              if(transferInwards[0].receiptDate === undefined)
              {
              //   dispatch(
              //     handleField(`createMaterialTransferInword`,
              //  // state.screenConfiguration.screenConfig["create-purchase-order"],
              //       "components.div.children.formwizardFirstStep.children.MaterialTransferInwordNote.children.cardContent.children.MaterialReceiptNoteContainer.children.receiptDate",
              //       "props.value",
              //       convertDateToEpoch(materialIssues[0].issueDate),
              //     )
              //   );
              dispatch(prepareFinalObject("transferInwards[0].receiptDate",new Date().toISOString().substr(0,10))); 
              }
            }
            
           // alert(materialIssues[0].issueDate);
            console.log(materialIssues[0].issueDate)

            //const parts = materialIssues[0].issueDate.match(/(\d{4})-(\d{1,2})-(\d{1,2})/);
            //const DateObj = new Date(Date.UTC(parts[1], parts[2] - 1, parts[3]));
            const DateObj = new Date(materialIssues[0].issueDate);
            DateObj.setMinutes(DateObj.getMinutes() + DateObj.getTimezoneOffset());            
              DateObj.setHours(DateObj.getHours() + (24*2));
              DateObj.setSeconds(DateObj.getSeconds() - 1);
             // alert(DateObj.getTime());
              console.log(DateObj.getTime())
            dispatch(
              handleField(`createMaterialTransferInword`,
           // state.screenConfiguration.screenConfig["create-purchase-order"],
                "components.div.children.formwizardFirstStep.children.MaterialTransferInwordNote.children.cardContent.children.MaterialReceiptNoteContainer.children.receiptDate",
                "props.inputProps",
                { min: new Date(DateObj.getTime()).toISOString().slice(0, 10),
                  max: new Date().toISOString().slice(0, 10)}
              )
            );
            // dispatch(prepareFinalObject("transferInwards[0].indent.indentStore.department.name",materialIssues[0].indent.indentStore.department.name));
            // dispatch(prepareFinalObject("transferInwards[0].indent.indentStore.divisionName",materialIssues[0].indent.indentStore.divisionName));
            dispatch(prepareFinalObject("transferInwards[0].indent.indentPurpose",materialIssues[0].indent.indentPurpose));

            let materialIssueDetails = get(
              materialIssues[0],
              'materialIssueDetails',
              []
            )
            let material =[]
            for (let index = 0; index < materialIssueDetails.length; index++) {
              const element = materialIssueDetails[index];
              let matname = GetMdmsNameBycode(state, dispatch,`createScreenMdmsData.store-asset.Material`,element.material.code)
              material.push(
                {
                  code:element.material.code,
                  name:matname,
                  uom:element.uom,
                  unitRate:1,
                  quantityIssued:element.quantityIssued,
                }
              )
              
            }

            dispatch(prepareFinalObject("indentsOutmaterial", material));
          }
          
          
        }
      },
 
      receiptDate : {
        ...getDateField({
          label: {
            labelName: "Receipt Date",
            labelKey: "STORE_MATERIAL_RECEIPT_RECEIPT_DATE "
          },
          placeholder: {
            labelName: "Enter Receipt Date",
            labelKey: "STORE_MATERIAL_RECEIPT_RECEIPT_DATE_PLACEHOLDER"
          },
          required: true,
          errorMessage:"STORE_VALIDATION_RECEIPT_DATE_SELECT",
          pattern: getPattern("Date") || null,
          jsonPath: "transferInwards[0].receiptDate",
          // props: {            
          //   inputProps: {
          //     max: new Date().toISOString().slice(0, 10),
          //   }
          // }
        })
      },

      receiptType: {
        ...getTextField({
          label: { labelName: "Receipt Type", labelKey: "STORE_MATERIAL_RECEIPT_RECEIPT_TYPE" },
          placeholder: {
            labelName: "Receipt Type",
            labelKey: "STORE_MATERIAL_RECEIPT_RECEIPT_TYPE"
          },
          props: {
            disabled: true,       
          },
          required: false,
          jsonPath: "transferInwards[0].receiptType",
          
          
        })
      },
      outwordDate: {
        ...getDateField({
          label: { labelName: "Outword Date", labelKey: "STORE_MATERIAL_OUTWORD_DATE" },
          placeholder: {
            labelName: "Outword Date",
            labelKey: "STORE_MATERIAL_OUTWORD_DATE"
          },
          props: {
            disabled: true,       
          },
          required: false,
          jsonPath: "transferInwards[0].issueDate",
         
          
        })
      },
      intendingstore: {
        ...getTextField({
          label: { labelName: "Indenting Store", labelKey: "STORE_MATERIAL_TRANSFER_INDENTING_STORE" },
          placeholder: {
            labelName: "Indenting Store",
            labelKey: "STORE_MATERIAL_TRANSFER_INDENTING_STORE"
          },
          props: {
            disabled: true,       
          },
          required: false,
          jsonPath: "transferInwards[0].indent.indentStore.name",
         
          
        })
      },
      issuingtore: {
        ...getTextField({
          label: { labelName: "Issuing Store Name", labelKey: "STORE_MATERIAL_INDENT_NOTE_ISSUING_STORE_NAME" },
          placeholder: {
            labelName: "Issuing Store Name",
            labelKey: "STORE_MATERIAL_INDENT_NOTE_ISSUING_STORE_NAME"
          },
          props: {
            disabled: true,       
          },
          required: false,
          jsonPath: "transferInwards[0].indent.issueStore.name",
         
          
        })
      },
      purposeofIndent: {
        ...getTextField({
          label: { labelName: "Purpose of Indent", labelKey: "STORE_MATERIAL_TRANSFER_PURPOSE_OF_INDENT" },
          placeholder: {
            labelName: "Purpose of Indente",
            labelKey: "STORE_MATERIAL_TRANSFER_PURPOSE_OF_INDENT"
          },
          props: {
            disabled: true,       
          },
          required: false,
          jsonPath: "transferInwards[0].indent.indentPurpose",
         
          
        })
      },
      Remark: {
        ...getTextField({
          label: {
            labelName: "Remark",
            labelKey: "STORE_MATERIAL_INDENT_NOTE_REMARK"
          },
          placeholder: {
            labelName: "Enter Remark",
            labelKey: "STORE_MATERIAL_INDENT_NOTE_REMARK_PLACEHOLDER"
          },
          props: {
            className: "applicant-details-error",
            multiline: "multiline",
            rowsMax: 2,
          },
          required: false,
          pattern: getSTOREPattern("Comment"),
          jsonPath: "transferInwards[0].inspectionRemarks"
        })
      }, 
      receiveBy: {
        ...getTextField({
          label: { labelName: "Receive By", labelKey: "STORE_MATERIAL_RECEIPT_RECEIPT_TYPE" },
          placeholder: {
            labelName: "Receive By",
            labelKey: "STORE_MATERIAL_RECEIPT_RECEIPT_TYPE"
          },
          props: {
            disabled: true,       
          },
          required: false,
          visible:false,
          jsonPath: "transferInwards[0].receivedBy",
         
          
        })
      },
      createdBy: {
        ...getTextField({
          label: {
            labelName: "Created by",
            labelKey: "STORE_PURCHASE_ORDER_CREATEBY"
          },
          placeholder: {
            labelName: "Enter Created By",
            labelKey: "STORE_PURCHASE_ORDER_CREATEBY"
          },
          props: {
            disabled: true
          },
         // pattern: getPattern("Email"),
          jsonPath: "transferInwards[0].createdByName"
        })
      },
      degignation: {
        ...getTextField({
          label: { labelName: "Designation of Issue created by Employee", labelKey: "STORE_PURCHASE_ORDER_DSGNTN" },
          placeholder: {
            labelName: "degignation",
            labelKey: "STORE_PURCHASE_ORDER_DSGNTN"
          },
          props: {
            disabled: true,       
          },
          required: false,
          visible:true,
          jsonPath: "transferInwards[0].designation",
         
          
        })
      },
      status: {
        ...getTextField({
          label: { labelName: "status", labelKey: "STORE_MATERIAL_INDENT_NOTE_STATUS" },
          placeholder: {
            labelName: "status",
            labelKey: "STORE_MATERIAL_INDENT_NOTE_STATUS"
          },
          props: {
            disabled: true,       
          },
          required: false,
          visible:false,
          jsonPath: "transferInwards[0].status",
         
          
        })
      },


      
    })
  });