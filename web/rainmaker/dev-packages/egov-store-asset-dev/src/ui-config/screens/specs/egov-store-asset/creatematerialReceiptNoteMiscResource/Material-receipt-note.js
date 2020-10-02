import {
    getCommonCard,
    getCommonTitle,
    getBreak,
    getLabel,
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
 import { getSearchResults } from "../../../../../ui-utils/commons";
 import {handleSearchMaterial} from './footer'
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
const getmrnNumber = async (  action, state,dispatch,storecode)=>{
  const tenantId = getTenantId();
  //let storecode = get(state,"screenConfiguration.preparedFinalObject.materialReceipt[0].receivingStore.code",'')
  let suppliercode = get(state,"screenConfiguration.preparedFinalObject.materialReceipt[0].supplier.code",'')
  let queryObject = [
    {
      key: "tenantId",
      value: tenantId
    }];
    queryObject.push({
      key: "receivingStore",
      value: storecode
    });
    // queryObject.push({
    //   key: "supplierCode",
    //   value: suppliercode
    // });
  try {
    let response = await getSearchResults(queryObject, dispatch,"mrnNumber");
    dispatch(prepareFinalObject("mrnNumber", response.MaterialReceipt));
  } catch (e) {
    console.log(e);
  }
}
  export const MaterialReceiptMiscNote = getCommonCard({
    header: getCommonTitle(
      {
        labelName: "Miscellaneous Material Receipt",
        labelKey: "STORE_MATERIAL_RECEIPT_MATERIAL_MISC"
      },
      {
        style: {
          marginBottom: 18
        }
      }
    ),
    MaterialReceiptNoteContainer: getCommonContainer({
      StoreName: {
        ...getTextField({
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
          jsonPath: "materialReceipt[0].receivingStore.name",
         // sourceJsonPath: "store.stores",
            props: {
              disabled: true, 
              // optionValue: "code",
              // optionLabel: "name",
            },
        }),
        beforeFieldChange: (action, state, dispatch) => {
          // let store = get(
          //   state.screenConfiguration.preparedFinalObject,
          //   `store.stores`,
          //   []
          // ); 
          // // call api to get mrnNumber List
          // getmrnNumber(action,state, dispatch,action.value)
          // store =  store.filter(x=> x.code === action.value) 
          // if(store && store[0])  
          // {
          //   dispatch(prepareFinalObject("materialReceipt[0].receivingStore.name",store[0].name));           
           
          // }
          // else{


          // }
         
          
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
          required: false,
          jsonPath: "materialReceipt[0].receiptType",
           // sourceJsonPath: "store.stores",
           props: {
            disabled: true,  
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
      receiptPurpose: {
        ...getSelectField({
          label: { labelName: "Receipt Purpose", labelKey: "STORE_MISC_RECEIPT_PURPOSE" },
          placeholder: {
            labelName: "Select Receipt Purpose",
            labelKey: "STORE_MISC_RECEIPT_PURPOSE_SELECT"
          },
          
          required: false,
          jsonPath: "materialReceipt[0].receiptPurpose",
           // sourceJsonPath: "store.stores",
           props: {
            disabled: false, 
            data:[
              {
                code: "RETURN OF MATERIALS",
                name: "Return of Material"
              },
              {
                code: "SCRAP",
                name: "Scrap"
              },
             
            ],
            optionValue: "code",
            optionLabel: "name",
          },
          
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
    })
  });
  export const MaterialSearch = getCommonCard({
    
    MaterialSearchContainer: getCommonContainer({
 
      issueNumber: {
        ...getTextField({
          label: {
            labelName: "Material Issue Number",
            labelKey: "STORE_COMMON_MRN_ISSUE_NUMBER"
          },
          placeholder: {
            labelName: "Enter Material Issue Number",
            labelKey: "STORE_COMMON_MRN_ISSUE_NUMBER_PLACEHOLDER"
          },
          props: {
            className: "applicant-details-error",
           
          },
          required: false,
          pattern: getPattern("eventDescription") || null,
          jsonPath: "materialReceipt[0].issueNumber"
        })
      }, 
      Break:getBreak(),
      ViewButton: {
        componentPath: "Button",       
        props: {
          variant: "contained",
          color: "primary",
          style: {
            //minWidth: "200px",
            height: "48px",
            marginRight: "10px",
    
          }
        },
        children: {
         
          submitButtonLabel: getLabel({
            labelName: "Submit",
            labelKey: "STORE_SUBMIT_LABEL"
          }),
         
         
        },
        onClickDefination: {
          action: "condition",
          callBack: handleSearchMaterial
        },
        visible: true
      },


    })
  });