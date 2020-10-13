import {
  getCommonCard,
  getCommonTitle,
  getTextField,
  getDateField,
  getSelectField,
  getCommonContainer,
  getPattern
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { getTenantId } from "egov-ui-kit/utils/localStorageUtils";
import { getSearchResults } from "../../../../../ui-utils/commons";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import{GetMdmsNameBycode} from '../../../../../ui-utils/storecommonsapi'
import { getSTOREPattern} from "../../../../../ui-utils/commons";
import get from "lodash/get";
export const MTIHeader = getCommonCard({
  header: getCommonTitle(
    {
      labelName: "Material Transfer Indent",
      labelKey: "STORE_MTI_HEADER"
    },
    {
      style: {
        marginBottom: 18
      }
    }
  ),
  MTIHeaderContainer: getCommonContainer({
    indentingstoreName: {
      ...getSelectField({
        label: { labelName: "Indenting Store", labelKey: "STORE_MATERIAL_INDENT_NOTE_INDENTING_STORE" },
        placeholder: {
          labelName: "Select Store Name",
          labelKey: "STORE_DETAILS_STORE_NAME_SELECT"
        },
       
        required: true,
        errorMessage:"STORE_VALIDATION_INDENTING_STORE_SELECT",
        jsonPath: "indents[0].indentStore.code",
        sourceJsonPath: "store.stores",
        props: {
          className: "hr-generic-selectfield",
          optionValue: "code",
          optionLabel: "name",
        }
      }),
      beforeFieldChange: (action, state, dispatch) => {
      let name = GetMdmsNameBycode(state, dispatch,"store.stores",action.value) 
     
      dispatch(prepareFinalObject("indents[0].indentStore.name", name));
      let store = get(
        state.screenConfiguration.preparedFinalObject,
        `store.stores`,
        []
      ); 
      store =  store.filter(x=> x.code === action.value) 
      if(store&& store[0])  
      {
      dispatch(prepareFinalObject("indents[0].indentStore.department.name",store[0].department.name));
      dispatch(prepareFinalObject("indents[0].indentStore.divisionName",store[0].divisionName));
      }
      }
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
        required: true,
        errorMessage:"STORE_VALIDATION_INDENT_DATE",
        pattern: getPattern("Date"),
        jsonPath: "indents[0].indentDate",
        props: {
          inputProps: {
            max: new Date().toISOString().slice(0, 10),
          }
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
        jsonPath: "indents[0].indentStore.department.name"
      })
    },
    divisionName: {
      ...getTextField({
        label: {
          labelName: "Indenting division Name",
          labelKey: "STORE_INDENTING_DIVISION_NAME"
        },
        placeholder: {
          labelName: "Enter Indenting Dept. Name",
          labelKey: "STORE_INDENTING_DIVISION_NAME"
        },
        visible:true,
        props: {
          disabled: true
        },
       // pattern: getPattern("Email"),
        jsonPath: "indents[0].indentStore.divisionName"
      })
    }, 
    indentPurpose: {
      ...getSelectField({
        label: { labelName: "Indent Purpose", labelKey: "STORE_MATERIAL_INDENT_INDENT_PURPOSE" },
        placeholder: {
          labelName: "Select Indent Purpose",
          labelKey: "STORE_MATERIAL_INDENT_INDENT_PURPOSE_SELECT"
        },
        required: true,
        errorMessage:"STORE_VALIDATION_INDENT_PURPOSE",
        jsonPath: "indents[0].indentPurpose",
        sourceJsonPath: "createScreenMdmsData.store-asset.IndentPurpose",
        props: {
          
          optionValue: "code",
          optionLabel: "name",
        },
      }),
    },
    issuingStoreName: {
      ...getSelectField({
        label: { labelName: "Issuing Store Name", labelKey: "STORE_MATERIAL_INDENT_NOTE_ISSUING_STORE_NAME" },
        placeholder: {
          labelName: "Select Issuing Store Name",
          labelKey: "STORE_MATERIAL_INDENT_NOTE_ISSUING_STORE_NAME_SELECT"
        },
        jsonPath: "indents[0].issueStore.code",
        sourceJsonPath: "store.stores",
        props: {
          className: "hr-generic-selectfield",
          optionValue: "code",
            optionLabel: "name",
        }
      }),
      beforeFieldChange: (action, state, dispatch) => {
        let name = GetMdmsNameBycode(state, dispatch,"store.stores",action.value)       
        dispatch(prepareFinalObject("indents[0].issueStore.name", name));
        }
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
      jsonPath: "indents[0].narration",
    }),
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
        jsonPath: "indents[0].indentCreatedBy"
      })
    },
    designation: {
      ...getTextField({
        label: {
          labelName: "Designation",
          labelKey: "STORE_PURCHASE_ORDER_DSGNTN"
        },
        placeholder: {
          labelName: "Enter Designation",
          labelKey: "STORE_PURCHASE_ORDER_DSGNTN"
        },
        props: {
          disabled: true
        },
       // pattern: getPattern("Email"),
        jsonPath: "indents[0].designation"
      })
    },
  })
});

