import {
    getCommonCard,
    getCommonTitle,
    getTextField,
    getDateField,
    getSelectField,
    getCommonContainer,
    getPattern
  } from "egov-ui-framework/ui-config/screens/specs/utils";
  import get from "lodash/get";
  import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
 import { convertDateToEpoch, convertDateToEpochIST } from "../../utils";
 import { getSTOREPattern,getSearchResults} from "../../../../../ui-utils/commons";
 import { getTenantId } from "egov-ui-kit/utils/localStorageUtils";
 import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
 //import { getSearchResults } from "../../../../ui-utils/commons";
//  let tenantId = getQueryArg(window.location.href, "tenantId");
 let disabled = false
//  if(tenantId)
//  disabled = true
//return
  export const MaterialIndentDetails =(disabled) => {

  return getCommonCard({
  
   // export const MaterialIndentDetails =getCommonCard({
    header: getCommonTitle(
      {
        labelName: "Material  Indent",
        labelKey: "STORE_MATERIAL_INDENT_MATERIAL_INDENT"
      },
      {
        style: {
          marginBottom: 18
        }
      }
    ),
    IndentDetailsContainer: getCommonContainer({
      StoreName: {
        ...getSelectField({
          label: {
            labelName: "Store Name",
            labelKey: "STORE_DETAILS_STORE_NAME"
          },
          placeholder: {
            labelName: "Select Store Name",
            labelKey: "STORE_DETAILS_STORE_NAME_SELECT"
          },
          required: true,
          errorMessage: "STORE_VALIDATION_STORE_NAME_SELECT",
          jsonPath: "indents[0].indentStore.code",         
          sourceJsonPath: "store.stores",
          props: {
            optionValue: "code",
            optionLabel: "name",
            //disabled: disabled,
            disabled : getQueryArg(window.location.href, "tenantId") === null?false:true,
          },
        }),
        beforeFieldChange: (action, state, dispatch) => {
          let store = get(
            state.screenConfiguration.preparedFinalObject,
            `store.stores`,
            []
          ); 
          store =  store.filter(x=> x.code === action.value) 
          if(store&& store[0])  
          {
          dispatch(prepareFinalObject("indents[0].indentStore.name",store[0].name));
          dispatch(prepareFinalObject("indents[0].indentStore.department.name",store[0].department.name));
          dispatch(prepareFinalObject("indents[0].indentStore.divisionName",store[0].divisionName));
          let Material = get(state, "screenConfiguration.preparedFinalObject.createScreenMdmsData.store-asset.Material",[]) 
          if(store[0].code){
            const queryObject = [{ key: "tenantId", value: getTenantId()},{ key: "store", value: store[0].code}];
            getSearchResults(queryObject, dispatch,"materials")
            .then(async response =>{
              if(response){
                let materials = []
                for (let index = 0; index < Material.length; index++) {
                  const element = Material[index];
                  for (let index = 0; index < response.materials.length; index++) {
                    const element_ = response.materials[index];
                    if(element.code ===element_.code)
                    {
                      materials.push(element)
                    }
                    
                  }
                  
                }
                dispatch(prepareFinalObject("materials.materials", materials));
                
                        
             }
              
            });   

            }
          }
         
          
      }
      },
      divisionName: getTextField({
        label: {
          labelName: "Division Name",
          labelKey: "STORE_DETAILS_DIVISION_NAME",
        },
        props: {
          className: "applicant-details-error",
          disabled: true
        },
        placeholder: {
          labelName: "Enter Division Name",
          labelKey: "STORE_DETAILS_DIVISION_NAME_PLACEHOLDER",
        },
        pattern: getPattern("non-empty-alpha-numeric"),
        errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
        jsonPath: "indents[0].indentStore.divisionName",
      }),
      departmentName: getTextField({
        label: {
          labelName: "Department Name",
          labelKey: "STORE_DETAILS_DEPARTMENT_NAME",
        },
        props: {
          className: "applicant-details-error",
          disabled: true
        },
        //pattern: getPattern("non-empty-alpha-numeric"),
        errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
        jsonPath: "indents[0].indentStore.department.name",
      }),
      IndentDate: {
        ...getDateField({
          label: {
            labelName: "Indent Date",
            labelKey: "STORE_MATERIAL_INDENT_INDENT_DATE"
          },
          placeholder: {
            labelName: "Enter Indent Date",
            labelKey: "STORE_MATERIAL_INDENT_INDENT_DATE_PLACEHOLDER"
          },
          required: true,
          errorMessage: "STORE_VALIDATION_INDENT_DATE",
          pattern: getPattern("Date") || null,
          jsonPath: "indents[0].indentDate",
          props: {
            inputProps: {
              max: new Date().toISOString().slice(0, 10),
            },
            disabled: disabled,
          }
        }),
       
      },
      IndentPurpose: {
        ...getSelectField({
          label: { labelName: "Indent Purpose", labelKey: "STORE_MATERIAL_INDENT_INDENT_PURPOSE" },
          placeholder: {
            labelName: "Select Indent Purpose",
            labelKey: "STORE_MATERIAL_INDENT_INDENT_PURPOSE_SELECT"
          },
          required: true,
          errorMessage: "STORE_VALIDATION_INDENT_PURPOSE",
          jsonPath: "indents[0].indentPurpose",
          sourceJsonPath: "createScreenMdmsData.store-asset.IndentPurpose",
        props: {
          
          optionValue: "code",
          optionLabel: "name",
          disabled: disabled,
        },
        }),
        beforeFieldChange: (action, state, dispatch) => {
          dispatch(prepareFinalObject("indents[0].indentDetails[0].indentPurpose",action.value));   
        }
      },
      InventryType: {
        ...getSelectField({
          label: { labelName: "Inventry Type", labelKey: "STORE_INVENTRY_TYPE" },
          placeholder: {
            labelName: "Select Inventry Type",
            labelKey: "STORE_MATERIAL_TYPE_NAME_SELECT"
          },
          required: true,
          errorMessage: "STORE_VALIDATION_INVENTRY_TYPE",
          jsonPath: "indents[0].inventoryType",
           sourceJsonPath: "createScreenMdmsData.store-asset.InventoryType",
          props: {
           
            optionValue: "code",
            optionLabel: "name",
            disabled: disabled,
          },
        })
      },
      ExpectedDeliveryDate: {
        ...getDateField({
          label: {
            labelName: "Expected Delivery Date",
            labelKey: "STORE_MATERIAL_INDENT_EXPECTED_DELIVERY_DATE"
          },
          placeholder: {
            labelName: "Enter Expected Delivery Date",
            labelKey: "STORE_MATERIAL_INDENT_EXPECTED_DELIVERY_DATE_PLACEHOLDER"
          },
          required: true,
          errorMessage: "STORE_VALIDATION_EXPECTED_DELIVERY_DATE",
          pattern: getPattern("Date") || null,
          jsonPath: "indents[0].expectedDeliveryDate",
          props: {
            inputProps: {
              min: new Date().toISOString().slice(0, 10),
            },
            disabled: disabled,
          }
        })
      },
      Naration: {
        ...getTextField({
          label: {
            labelName: "Naration",
            labelKey: "STORE_MATERIAL_INDENT_NARATION"
          },
          placeholder: {
            labelName: "Naration",
            labelKey: "STORE_MATERIAL_INDENT_NARATION_PLACEHOLDER"
          },
          required: true,
          errorMessage: "STORE_VALIDATION_NARATION",
          props: {
            className: "applicant-details-error",
            multiline: "multiline",
            rowsMax: 2,
            disabled: disabled,
          },
          pattern: getSTOREPattern("Comment"),
          jsonPath: "indents[0].narration"
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
            labelKey: "STORE_PURCHASE_ORDER_DSGNTN_PLCEHLDER"
          },
          props: {
            disabled: true
          },
         // pattern: getPattern("Email"),
          jsonPath: "indents[0].designation"
        })
      },
    })
  },
  // {
  //   style: { overflow: "visible" }
  // }
  );
};