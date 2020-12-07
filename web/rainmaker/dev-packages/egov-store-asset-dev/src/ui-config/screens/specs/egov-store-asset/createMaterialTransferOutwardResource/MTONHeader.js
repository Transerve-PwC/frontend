import {
  getCommonCard,
  getCommonTitle,
  getTextField,
  getDateField,
  getSelectField,
  getCommonContainer,
  getPattern
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { getSTOREPattern} from "../../../../../ui-utils/commons";
import { getTenantId } from "egov-ui-kit/utils/localStorageUtils";
import { getSearchResults } from "../../../../../ui-utils/commons";
import { prepareFinalObject,handleScreenConfigurationFieldChange as handleField,  } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import{GetMdmsNameBycode,getMaterialBalanceRateResults} from '../../../../../ui-utils/storecommonsapi'
import get from "lodash/get";
import {
  getLocalizationCodeValue,
} from "../../utils";
import { toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";
export const MTONHeader = getCommonCard({
  header: getCommonTitle(
    {
      labelName: "Material Transfer Outward",
      labelKey: "STORE_MTON_HEADER"
    },
    {
      style: {
        marginBottom: 18
      }
    }
  ),
  MTONHeaderContainer: getCommonContainer({

    transferIndentNo: {
      ...getSelectField({
        label: { labelName: "Transfer Indent No.", labelKey: "STORE_MTON_INDENT_NUMBER" },
        placeholder: {
          labelName: "Select Transfer Indent No.",
          labelKey: "STORE_MTON_INDENT_NUMBER_SELECT"
        },
        jsonPath: "materialIssues[0].indent.id",
        required: true,
        errorMessage:"STORE_VALIDATION_TRANSFER_INDENT_NUMBER",
       sourceJsonPath: "TransferIndent.indents",
        props: {
          className: "hr-generic-selectfield",
          optionValue: "id",
          optionLabel: "indentNumber",
        }
      }),
      beforeFieldChange: (action, state, dispatch) => {
        let indents = get(state, "screenConfiguration.preparedFinalObject.TransferIndent.indents",[]) 
        indents = indents.filter(x=>x.id === action.value);
        let storecode = '';
        if(indents && indents[0])
        {
          
          dispatch(prepareFinalObject("materialIssues[0].indent.indentNumber", indents[0].indentNumber));
          dispatch(prepareFinalObject("materialIssues[0].indent.tenantId", getTenantId()));
          dispatch(prepareFinalObject("materialIssues[0].indent.indentDate", indents[0].indentDate));
          dispatch(prepareFinalObject("materialIssues[0].indent.issueStore.code", indents[0].issueStore.code));
          dispatch(prepareFinalObject("materialIssues[0].indent.issueStore.name", indents[0].issueStore.name));
          dispatch(prepareFinalObject("materialIssues[0].toStore.name", indents[0].indentStore.name));
          dispatch(prepareFinalObject("materialIssues[0].toStore.code", indents[0].indentStore.code)); 
          dispatch(prepareFinalObject("materialIssues[0].indent.indentStore.code", indents[0].indentStore.code));
          dispatch(prepareFinalObject("materialIssues[0].indent.indentStore.name", indents[0].indentStore.name));
          dispatch(prepareFinalObject("materialIssues[0].indent.indentStore.department.name", indents[0].indentStore.department.name));
          dispatch(prepareFinalObject("materialIssues[0].fromStore.name", indents[0].issueStore.name));
          dispatch(prepareFinalObject("materialIssues[0].fromStore.code", indents[0].issueStore.code));
          dispatch(prepareFinalObject("materialIssues[0].indent.indentType", indents[0].indentType));
          dispatch(prepareFinalObject("materialIssues[0].indent.indentPurpose", indents[0].indentPurpose));
          dispatch(prepareFinalObject("materialIssues[0].indent.indentCreatedBy", indents[0].indentCreatedBy));
          dispatch(prepareFinalObject("materialIssues[0].indent.designation", indents[0].designation));
         dispatch(prepareFinalObject("materialIssues[0].issuedToEmployee", indents[0].issueStore.storeInCharge.code));
         //dispatch(prepareFinalObject("materialIssues[0].issuedToEmployeename", indents[0].issueStore.storeInCharge.code));
          dispatch(
            handleField(
              "create-material-transfer-outward",
              "components.div.children.formwizardFirstStep.children.MTONHeader.children.cardContent.children.MTONHeaderContainer.children.issueDate",
              "props.inputProps",
              { min: new Date(indents[0].indentDate).toISOString().slice(0, 10),
                max: new Date().toISOString().slice(0, 10)}
            )
          ); 
          dispatch(prepareFinalObject("materialIssues[0].issueDate",new Date().toISOString().substr(0,10)));  
          let emp = get(state, "screenConfiguration.preparedFinalObject.createScreenMdmsData.employee",[]) 
          let designation=action.value ;
          emp = emp.filter(x=>x.code ===indents[0].issueStore.storeInCharge.code)
          if(emp&& emp[0])
          {
          dispatch(prepareFinalObject("materialIssues[0].issuedToEmployeename", emp[0].name));
          let issuedToDesignation =GetMdmsNameBycode(state, dispatch,"createScreenMdmsData.common-masters.Designation",emp[0].designation) 
         
          const {designationsById} = state.common;
          if(designationsById){
            const desgnName = Object.values(designationsById).filter(item =>  item.code === emp[0].designation )
            dispatch(prepareFinalObject("materialIssues[0].issuedToDesignation", issuedToDesignation));
            }
          }
          storecode =indents[0].issueStore.code;
          let indentDetails = get(
            indents[0],
            "indentDetails",
            []
          );
          let material=[];
          let matcode =[];
          let matname =[];
          for (let index = 0; index < indentDetails.length; index++) {
            const element = indentDetails[index];

            dispatch(prepareFinalObject(`materialIssues[0].indent.indentDetails[${index}].id`, element.id));
            dispatch(prepareFinalObject(`materialIssues[0].indent.indentDetails[${index}].uom.code`, element.uom.code));
            dispatch(prepareFinalObject(`materialIssues[0].indent.indentDetails[${index}].userQuantity`, element.userQuantity));
            dispatch(prepareFinalObject(`materialIssues[0].indent.indentDetails[${index}].material.code`, element.material.code));
            //create material list for card item
           let materialName =GetMdmsNameBycode(state, dispatch,"createScreenMdmsData.store-asset.Material",element.material.code)
            material.push(
              {
                materialcode:element.material.code,
                materialName:materialName,
                uomcode:element.uom.code,
                uomname:GetMdmsNameBycode(state, dispatch,"createScreenMdmsData.common-masters.UOM",element.uom.code),
                id:element.id,
                indentQuantity:element.indentQuantity,
                totalProcessedQuantity:element.totalProcessedQuantity,
                indentIssuedQuantity:element.indentIssuedQuantity,
                interstoreRequestQuantity:element.interstoreRequestQuantity,
                //unitRate://to be deside
              });
              matcode.push( element.material.code)
              matname.push( materialName)
          }  
          
          let matcodes_= matcode.map(itm => {
            return `${itm}`;
          })
          .join() || "-"
          let matname_= matname.map(itm => {
            return `${itm}`;
          })
          .join() || "-"
          const queryObject = [{ key: "tenantId", value: getTenantId()},{ key: "issueingStore", value: storecode},{ key: "material", value: matcodes_}];
          getMaterialBalanceRateResults(queryObject)
          .then(async response =>{
            if(response){
              
              dispatch(prepareFinalObject("indentsOutmaterial", response.MaterialBalanceRate));
              if(response.MaterialBalanceRate.length ===0)
              {

                let LocalizationCodeValue = getLocalizationCodeValue("STORE_MATERIAL_BALANCE_VALIDATION")
                const errorMessage = {
                      
                  labelName: "No Balance or all QTY is used for",
                  labelKey:   LocalizationCodeValue+' store  '+indents[0].issueStore.name +' and Material '+matname_
                };
                dispatch(toggleSnackbar(true, errorMessage, "warning"));
                
              }
              
            }
          }); 
        }
      }
    },
    issueDate: {
      ...getDateField({
        label: {
          labelName: "Issue Date",
          labelKey: "STORE_MATERIAL_INDENT_NOTE_ISSUE_DATE",
        },
        placeholder: {
          labelName: "Enter Issue Date",
          labelKey: "STORE_MATERIAL_INDENT_NOTE_ISSUE_DATE_PLACEHOLDER",
        },
        required: true,
        errorMessage:"STORE_VALIDATION_ISSUE_DATE_SELECT",
        pattern: getPattern("Date"),
        jsonPath: "materialIssues[0].issueDate",
        // props: {
        //   inputProps: {
        //     max: new Date().toISOString().slice(0, 10),
        //   }
        // }
      }),
    },  
    issuingStoreName: {
      ...getSelectField({
        label: { labelName: "Issuing Store Name", labelKey: "STORE_MATERIAL_INDENT_NOTE_ISSUING_STORE_NAME" },
        placeholder: {
          labelName: "Select Issuing Store Name",
          labelKey: "STORE_MATERIAL_INDENT_NOTE_ISSUING_STORE_NAME_SELECT"
        },
        jsonPath: "materialIssues[0].toStore.code",
        sourceJsonPath: "store.stores",
        props: {
          disabled:true,
          className: "hr-generic-selectfield",
          optionValue: "code",
          optionLabel: "name",
        }
      }),
    },
    indentDate: {
      ...getDateField({
        label: {
          labelName: "Indent Date",
          labelKey: "STORE_MATERIAL_INDENT_INDENT_DATE",
        },
        placeholder: {
          labelName: "Indent Date",
          labelKey: "STORE_MATERIAL_INDENT_INDENT_DATE",
        },
        pattern: getPattern("Date"),
        jsonPath: "materialIssues[0].indent.indentDate",
        props: {
          disabled:true,
          inputProps: {
            max: new Date().toISOString().slice(0, 10),
          }
        }
      }),
    },  
    indentingStore: {
      ...getSelectField({
        label: { labelName: "Indenting Store", labelKey: "STORE_MATERIAL_INDENT_NOTE_INDENTING_STORE" },
        placeholder: {
          labelName: "Select Store Name",
          labelKey: "STORE_DETAILS_STORE_NAME_SELECT"
        },
        jsonPath: "materialIssues[0].fromStore.code",
        sourceJsonPath: "store.stores",
        props: {
          disabled:true,
          className: "hr-generic-selectfield",
          optionValue: "code",
          optionLabel: "name",
        }
      }),
    },
    indentDeptName: {
      ...getTextField({
        label: {
          labelName: "Indenting Dept. Name",
          labelKey: "STORE_MTON_INDENT_DEPT_NAME"
        },
        placeholder: {
          labelName: "Enter Indenting Dept. Name",
          labelKey: "STORE_MTON_INDENT_DEPT_NAME_PLCEHLDER"
        },
        visible:true,
        props: {
          disabled: true
        },
       // pattern: getPattern("Email"),
        jsonPath: "materialIssues[0].indent.indentStore.department.name"
      })
    },
    indentPurpose: {
      ...getTextField({
        label: { labelName: "Indent Purpose", labelKey: "STORE_MATERIAL_INDENT_INDENT_PURPOSE" },
        placeholder: {
          labelName: "Indent Purpose",
          labelKey: "STORE_MATERIAL_INDENT_INDENT_PURPOSE"
        },
        required: false,
        jsonPath: "materialIssues[0].indent.indentPurpose",
        //sourceJsonPath: "createScreenMdmsData.store-asset.RateType",
        props: {
          disabled:true
        }
      }),
    },
    indentRaisedBy: {
      ...getTextField({
        label: {
          labelName: "Indent Raised By",
          labelKey: "STORE_PURCHASE_ORDER_INDENT_RAISED"
        },
        placeholder: {
          labelName: "Enter Indent Raised By",
          labelKey: "STORE_PURCHASE_ORDER_INDENT_RAISED_HLDER"
        },
        visible:false,
        props: {
          disabled: true
        },
       // pattern: getPattern("Email"),
        jsonPath: "materialIssues[0].createdBy"
      })
    },
    issuedToEmployee: {
      ...getSelectField({
        label: { labelName: "Issued to Employee", labelKey: "STORE_MTON_ISSUED_TO_EMP" },
        placeholder: {
          labelName: "Select Issued to Employee",
          labelKey: "STORE_MTON_ISSUED_TO_EMP_SELECT"
        },
        jsonPath: "materialIssues[0].issuedToEmployee",
        sourceJsonPath: "createScreenMdmsData.employee",
        props: {
          className: "applicant-details-error",
          optionLabel: "name",
          optionValue: "code",
          disabled:true
        },
      }),
      beforeFieldChange: (action, state, dispatch) => {
    
        let emp = get(state, "screenConfiguration.preparedFinalObject.createScreenMdmsData.employee",[]) 
        let designation=action.value ;
        emp = emp.filter(x=>x.code ===action.value)
        let issuedToDesignation =''
        if(emp && emp[0])
        {
         issuedToDesignation =GetMdmsNameBycode(state, dispatch,"createScreenMdmsData.common-masters.Designation",emp[0].designation) 
        const {designationsById} = state.common;
        if(designationsById){
          const desgnName = Object.values(designationsById).filter(item =>  item.code === emp[0].designation )
          dispatch(prepareFinalObject("materialIssues[0].issuedToDesignation", issuedToDesignation));
          }
        }
        
     

      }
    },
    issuedToDesignation: {
      ...getTextField({
        label: {
          labelName: "Issued to Employee Designation",
          labelKey: "STORE_PURCHASE_ORDER_DSGNTN_EMP"
        },
        placeholder: {
          labelName: "Enter Designation",
          labelKey: "STORE_PURCHASE_ORDER_DSGNTN_PLCEHLDER_EMP"
        },
        props: {
          disabled: true
        },
       // pattern: getPattern("Email"),
        jsonPath: "materialIssues[0].issuedToDesignation"
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
          labelKey: "STORE_PURCHASE_ORDER_CREATEBY_PLCEHLDER"
        },
        props: {
          disabled: true
        },
       // pattern: getPattern("Email"),
        jsonPath: "materialIssues[0].createdByName"
      })
    },
    degignation: {
      ...getTextField({
        label: { labelName: "degignation", labelKey: "STORE_PURCHASE_ORDER_DSGNTN" },
        placeholder: {
          labelName: "degignation",
          labelKey: "STORE_PURCHASE_ORDER_DSGNTN"
        },
        props: {
          disabled: true,       
        },
        required: false,
        visible:true,
        jsonPath: "materialIssues[0].designation",
       
        
      })
    },
    remarks: getTextField({
      label: {
        labelName: "Remarks",
        labelKey: "STORE_PURCHASE_ORDER_REMARK",
      },
      props: {
        className: "applicant-details-error",
        multiline: "multiline",
        rowsMax: 2,
      },
      placeholder: {
        labelName: "Enter Remarks",
        labelKey: "STORE_PURCHASE_ORDER_REMARK_PLCEHLDER",
      },
      pattern: getSTOREPattern("Comment"),
      errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
      jsonPath: "materialIssues[0].description",
    }),
    issuedBy: {
      ...getTextField({
        label: {
          labelName: "Issued by",
          labelKey: "STORE_PURCHASE_ORDER_ISSUEDBY"
        },
        placeholder: {
          labelName: "Enter Issued By",
          labelKey: "STORE_PURCHASE_ORDER_ISSUEDBY_PLCEHLDER"
        },
        visible:false,
        props: {
          disabled: true
        },
       // pattern: getPattern("Email"),
        jsonPath: "materialIssues[0].createdBy"
      })
    },
    designationIssuedEmp: {
      ...getTextField({
        label: {
          labelName: "Designation",
          labelKey: "STORE_PURCHASE_ORDER_DSGNTN"
        },
        placeholder: {
          labelName: "Enter Designation",
          labelKey: "STORE_PURCHASE_ORDER_DSGNTN_PLCEHLDER"
        },
        visible:false,
        props: {
          disabled: true
        },
       // pattern: getPattern("Email"),
        jsonPath: "materialIssues[0].designation"
      })
    },
  })
});

