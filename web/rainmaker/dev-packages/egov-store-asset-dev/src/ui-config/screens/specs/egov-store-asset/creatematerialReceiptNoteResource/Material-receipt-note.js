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
 import { getTenantId } from "egov-ui-kit/utils/localStorageUtils";
import{getMaterialMasterSearchResults} from '../../../../../ui-utils/storecommonsapi'
import { toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";
 import {  handleScreenConfigurationFieldChange as handleField, prepareFinalObject  } from "egov-ui-framework/ui-redux/screen-configuration/actions";
 import { httpRequest } from "../../../../../ui-utils/api";
 import { getSTOREPattern} from "../../../../../ui-utils/commons";
 const getMaterialData = async (action, state, dispatch) => {
  const tenantId = getTenantId();
  let queryObject = [
    {
      key: "tenantId",
      value: getTenantId(),
    },
  ];
  let storecode = get(state,"screenConfiguration.preparedFinalObject.materialReceipt[0].fromStore.code",'')
  queryObject.push({
    key: "store",
    value: storecode
  });

    
  try {
    let response = await getMaterialMasterSearchResults(queryObject, dispatch);
    dispatch(prepareFinalObject("materials", response.materials));
   //set materialReceipt[0].issuedToEmployee
   const queryParams = [{ key: "roles", value: "EMPLOYEE" },{ key: "tenantId", value:  getTenantId() }];
   const payload = await httpRequest(
     "post",
     "/egov-hrms/employees/_search",
     "_search",
     queryParams,
   );
  
   let stores = get(state,"screenConfiguration.preparedFinalObject.store.stores",[])
   stores = stores.filter(x=>x.code === storecode)
   //alert(stores[0].storeInCharge.code)
   if(payload){
     if (payload.Employees) {
       const {screenConfiguration} = state;
        // const {stores} = screenConfiguration.preparedFinalObject;
       const empDetails =
       payload.Employees.filter((item, index) =>  stores[0].storeInCharge.code === item.code);
     
       if(empDetails && empDetails[0] ){
         //alert(empDetails[0].user.name)        
         dispatch(prepareFinalObject("materialReceipt[0].issuedToEmployee",empDetails[0].user.name));  
       }
       else{
        dispatch(prepareFinalObject("materialReceipt[0].issuedToEmployee",""));  
       }
     }
   }
  } catch (e) {
    console.log(e);
  }
};


  export const MaterialReceiptNote = getCommonCard({
    header: getCommonTitle(
      {
        labelName: "Material Receipt Note",
        labelKey: "STORE_MATERIAL_RECEIPT_MATERIAL_RECEIPT_NOTE"
      },
      {
        style: {
          marginBottom: 18
        }
      }
    ),
    MaterialReceiptNoteContainer: getCommonContainer({
      StoreName: {
        ...getSelectField({
          label: {
            labelName: " Store Name",
            labelKey: "STORE_DETAILS_STORE_NAME"
          },
          placeholder: {
            labelName: "Select  Store Name",
            labelKey: "STORE_DETAILS_STORE_NAME_SELECT"
          },
          required: true,
          errorMessage:"STORE_VALIDATION_STORE_NAME_SELECT",
          jsonPath: "materialReceipt[0].receivingStore.code",
          sourceJsonPath: "store.stores",
            props: {
              optionValue: "code",
              optionLabel: "name",
            },
        }),
        beforeFieldChange: (action, state, dispatch) => {
          let store = get(
            state.screenConfiguration.preparedFinalObject,
            `store.stores`,
            []
          ); 
          store =  store.filter(x=> x.code === action.value)  
          if(store && store[0]) 
          {
          dispatch(prepareFinalObject("materialReceipt[0].receivingStore.name",store[0].name));       
          dispatch(prepareFinalObject("materialReceipt[0].receivingStore.department.name",store[0].department.name));
           //getpurchaseOrder(action,state, dispatch);
          }
        }
      },
      departmentname: {
        ...getTextField({
          label: {
            labelName: "Department Name",
            labelKey: "STORE_DETAILS_DEPARTMENT_NAME"
          },
          placeholder: {
            labelName: "Department Name",
            labelKey: "STORE_DETAILS_DEPARTMENT_NAME"
          },
          props: {
            disabled: true,       
          },
          required: false,
          pattern: getPattern("Name") || null,
          jsonPath: "materialReceipt[0].receivingStore.department.name"
        })
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
          jsonPath: "materialReceipt[0].receiptDate",
          props: {
            inputProps: {
              max: new Date().toISOString().slice(0, 10),
            }
          }
        })
      },
      receiptType: {
        ...getSelectField({
          label: { labelName: "Receipt Type", labelKey: "STORE_MATERIAL_RECEIPT_RECEIPT_TYPE" },
          placeholder: {
            labelName: "Select Receipt Type",
            labelKey: "STORE_MATERIAL_RECEIPT_RECEIPT_TYPE_SELECT"
          },
          // props: {
          //   disabled:true,      
          // },
          required: false,
          jsonPath: "materialReceipt[0].receiptType",
          // sourceJsonPath: "store.stores",
            props: {
              disabled:true, 
              data:[
                {
                  code: "PURCHASE RECEIPT",
                  name: "Purchase Receipt"
                },
                {
                  code: "MISCELLANEOUS RECEIPT",
                  name: "Miscellaneous Receipt"
                },
                {
                  code: "INWARD RECEIPT",
                  name: "Inword Receipt"
                },
                {
                  code: "OPENING BALANCE",
                  name: "Opening Balance"
                }
              ],
              optionValue: "code",
              optionLabel: "name",
            },
          
        })
      },
      supplier: {
        ...getSelectField({
          label: {
            labelName: "Supplier Name",
            labelKey: "STORE_COMMON_TABLE_COL_SUPPLIER_MASTER_NAME"
          },
          placeholder: {
            labelName: "Select  Supplier Name",
            labelKey: "STORE_COMMON_TABLE_COL_SUPPLIER_MASTER_NAME"
          },
          required: true,
          errorMessage:"STORE_VALIDATION_SUPPLIER_NAME_SELECT",
          jsonPath: "materialReceipt[0].supplier.code",
          sourceJsonPath: "supplier.suppliers",
            props: {
              optionValue: "code",
              optionLabel: "name",
            },
        }),
        beforeFieldChange: (action, state, dispatch) => {
          let supplier = get(
            state.screenConfiguration.preparedFinalObject,
            `supplier.suppliers`,
            []
          ); 
          supplier =  supplier.filter(x=> x.code === action.value)  
          if(supplier && supplier[0]) 
          dispatch(prepareFinalObject("materialReceipt[0].supplier.name",supplier[0].name));
          //getpurchaseOrder(action,state, dispatch,action.value);
         
        }
      },
      supplierBillNo: {
        ...getTextField({
          label: {
            labelName: "Supplier Bill NO.",
            labelKey: "STORE_MATERIAL_RECEIPT_SUPPLIER_BILL_NO"
          },
          placeholder: {
            labelName: "Enter Supplier Bill NO.",
            labelKey: "STORE_MATERIAL_RECEIPT_SUPPLIER_BILL_NO_PLACEHOLDER"
          },
          props: {
            disabled: false,       
          },
          required: false,
          pattern: getPattern("Name") || null,
          jsonPath: "materialReceipt[0].supplierBillNo"
        })
      },
      supplierBillDate : {
        ...getDateField({
          label: {
            labelName: "Supplier Bill Date",
            labelKey: "STORE_MATERIAL_RECEIPT_SUPPLIER_BILL_DATE"
          },
          placeholder: {
            labelName: "Enter Supplier Bill Date",
            labelKey: "STORE_MATERIAL_RECEIPT_SUPPLIER_BILL_DATE_PLACEHOLDER"
          },
          required: true,
          errorMessage:"STORE_VALIDATION_SUPPLIER_BILL_DATE_SELECT",
          props: {
            inputProps: {
              max: new Date().toISOString().slice(0, 10),
            }
          },
          pattern: getPattern("Date") || null,
          jsonPath: "materialReceipt[0].supplierBillDate"
        })
      },
      challanNo: {
        ...getTextField({
          label: {
            labelName: "Challan  NO.",
            labelKey: "STORE_MATERIAL_RECEIPT_CHALLAN_NO"
          },
          placeholder: {
            labelName: "Enter Challan  NO.",
            labelKey: "STORE_MATERIAL_RECEIPT_CHALLAN_NO_PLACEHOLDER"
          },
          props: {
            disabled: false,       
          },
          required: false,
          pattern: getPattern("Name") || null,
          jsonPath: "materialReceipt[0].challanNo"
        })
      },
      challanDate : {
        ...getDateField({
          label: {
            labelName: "Challan Date",
            labelKey: "STORE_MATERIAL_RECEIPT_CHALLAN_DATE"
          },
          placeholder: {
            labelName: "Enter Challan Date",
            labelKey: "STORE_MATERIAL_RECEIPT_CHALLAN_DATE_PLACEHOLDER"
          },
          required: true,
          errorMessage:"STORE_VALIDATION_CHALLAN_DATE_SELECT",
          props: {
            inputProps: {
              max: new Date().toISOString().slice(0, 10),
            }
          },
          pattern: getPattern("Date") || null,
          jsonPath: "materialReceipt[0].challanDate"
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
          required: true,
          errorMessage:"STORE_VALIDATION_REMARK",
          pattern: getSTOREPattern("Comment"),
          jsonPath: "materialReceipt[0].description"
        })
      },
      inspectedBy: {
        ...getSelectField({
          label: {
            labelName: "Inspected By",
            labelKey: "STORE_MATERIAL_RECEIPT_INSPECTED_BY"
          },
          placeholder: {
            labelName: "Select Inspected By",
            labelKey: "STORE_MATERIAL_RECEIPT_INSPECTED_BY_SELECT"
          },         
          required: false,
          jsonPath: "materialReceipt[0].inspectedBy",         
          sourceJsonPath: "createScreenMdmsData.employee",
          props: {
            className: "applicant-details-error",
            optionLabel: "name",
            optionValue: "code",
          },
        }),
        beforeFieldChange: (action, state, dispatch) => {
          // let emp = get(state, "screenConfiguration.preparedFinalObject.createScreenMdmsData.employee",[]) 
          // let designation=action.value ;
          // emp = emp.filter(x=>x.code ===action.value)
          // let issuedToDesignation =GetMdmsNameBycode(state, dispatch,"createScreenMdmsData.common-masters.Designation",designation)   
       
          // dispatch(prepareFinalObject("materialReceipt[0].issuedToDesignation", issuedToDesignation));

  
        }
      },
      inspectionDate: {
        ...getDateField({
          label: { labelName: "Inspection Date", labelKey: "STORE_MATERIAL_RECEIPT_INSPECTION_DATE" },
          placeholder: {
            labelName: "Enter Inspection Date",
            labelKey: "STORE_MATERIAL_RECEIPT_INSPECTION_DATE_PLACEHOLDER"
          },
          required: false,
          jsonPath: "materialReceipt[0].inspectionDate",
          
          props: {
            inputProps: {
              max: new Date().toISOString().slice(0, 10),
            }
          },
        })
      },
      
      inspectionRemarks: {
        ...getTextField({
          label: {
            labelName: "Inspection Remark",
            labelKey: "STORE_MATERIAL_RECEIPT_INSPECTION_REMARK"
          },
          placeholder: {
            labelName: "Enter Inspection Remark",
            labelKey: "STORE_MATERIAL_RECEIPT_INSPECTION_REMARK_PLACEHOLDER"
          },
          props: {
            className: "applicant-details-error",
            multiline: "multiline",
            rowsMax: 2,
          },
          required: false,
          pattern: getSTOREPattern("Comment"),
          jsonPath: "materialReceipt[0].inspectionRemarks"
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
          jsonPath: "materialReceipt[0].createdByName"
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
            labelKey: "STORE_PURCHASE_ORDER_DSGNTN_PLCEHLDER"
          },
          props: {
            disabled: true
          },
         // pattern: getPattern("Email"),
          jsonPath: "materialReceipt[0].designation"
        })
      },
    })
  });