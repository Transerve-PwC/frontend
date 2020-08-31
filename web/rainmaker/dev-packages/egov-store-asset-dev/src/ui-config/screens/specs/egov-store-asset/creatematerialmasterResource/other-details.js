import {
    getCommonCard,
    getCommonGrayCard,
    getCommonTitle,
    getCommonSubHeader,
    getTextField,
    getSelectField,
    getCommonContainer,
    getPattern
  } from "egov-ui-framework/ui-config/screens/specs/utils";
  import{GetMdmsNameBycode} from '../../../../../ui-utils/storecommonsapi'
 
  import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
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
  
    // View1: getCommonGrayCard({
    //   header1: getCommonTitle(
    //     {
    //       labelName: "Purchasing Information",
    //       labelKey: "STORE_MATERIAL_PURCHASING_INFORMATION"
    //     },
    //     {
    //       style: {
    //         marginBottom: 18
    //       }
    //     }
    //   ),
    //   PuchasingInformationContainer: getCommonContainer({
    //     PurchaseUOMName: {
    //       ...getSelectField({
    //         label: {
    //           labelName: "Purchase UOM  Name",
    //           labelKey: "STORE_MATERIAL_PURCHASE_UOM_NAME"
    //         },
    //         placeholder: {
    //           labelName: "Select Purchase UOM  Name",
    //           labelKey: "STORE_MATERIAL_PURCHASE_UOM_NAME_SELECT"
    //         },
    //         required: true,
           
    //         jsonPath: "materials[0].purchaseUom.code",
    //         sourceJsonPath: "createScreenMdmsData.common-masters.UOM",
    //       props: {
    //         disabled:true,
    //         optionLabel: "name",
    //         optionValue: "code"
    //       },
    //       })
    //     },
    //     ExpenseAccountCode: {
    //       ...getSelectField({
    //         label: {
    //           labelName: "Expense Account Code",
    //           labelKey: "STORE_MATERIAL_EXPENSE_ACCOUNT_CODE"
    //         },
    //         placeholder: {
    //           labelName: "Selet Expense Account Code",
    //           labelKey: "STORE_MATERIAL_EXPENSE_ACCOUNT_CODE_SELECT"
    //         },
    //         required: false,
    //         pattern: getPattern("Name") || null,
    //         jsonPath: "materials[0].expenseAccount.glCode"
    //       })
    //     },  
       
    //   }), 
    // }),
    View2: getCommonGrayCard({
      header2: getCommonTitle(
        {
          labelName: "Stocking Information",
          labelKey: "STORE_MATERIAL_STOCKING_INFORMATION"
        },
        {
          style: {
            marginBottom: 18
          }
        }
      ),
      StockingInformationContainer: getCommonContainer({

  
        UsageClass: {
          ...getSelectField({
            label: { labelName: "Usage Class", labelKey: "STORE_MATERIAL_USAGE_CLASS" },
            placeholder: {
              labelName: "Select Usage Class",
              labelKey: "STORE_MATERIAL_USAGE_CLASS_SELECT"
            },
            
            jsonPath: "materials[0].materialClass",
           // sourceJsonPath: "searchScreenMdmsData.store-asset.MaterialType",
            props: {
              data: [
                {
                  value: "HighUsage",
                  label: "High Usage"
                },
               
              ],
              optionValue: "value",
              optionLabel: "label"
            },
          })
        },
        StockingUOMName: {
          ...getSelectField({
            label: { labelName: "Stocking UOM Name", labelKey: "STORE_MATERIAL_STOCKING_UOM_NAME" },
            placeholder: {
              labelName: "Select Stocking UOM Name",
              labelKey: "STORE_MATERIAL_STOCKING_UOM_NAME_SELECT"
            },
           
            jsonPath: "materials[0].stockingUom.code",
            sourceJsonPath: "createScreenMdmsData.common-masters.UOM",
            props: {
              optionLabel: "name",
            optionValue: "code"
            },
          }),
          beforeFieldChange: (action, state, dispatch) => {
            let name =  GetMdmsNameBycode(state, dispatch,"createScreenMdmsData.common-masters.UOM",action.value) 
            dispatch(prepareFinalObject("materials[0].stockingUom.name",name));
          }
        },
        MininumQty: {
          ...getTextField({
            label: {
              labelName: "Mininum Qty",
              labelKey: "STORE_MATERIAL_MINIMUM_QTY"
            },
            placeholder: {
              labelName: "Maximun Qty",
              labelKey: "STORE_MATERIAL_MINIMUM_QTY"
            },
            
            pattern: getPattern("Amount") || null,
            jsonPath: "materials[0].minQuantity"
          })
        },
        MaximunQty: {
          ...getTextField({
            label: {
              labelName: "Maximun Qty",
              labelKey: "STORE_MATERIAL_MAXIMUN_QTY"
            },
            placeholder: {
              labelName: "Maximun Qty",
              labelKey: "STORE_MATERIAL_MAXIMUN_QTY"
            },
           
            pattern: getPattern("Amount") || null,
            jsonPath: "materials[0].maxQuantity"
          })
        },
       
        ReOrderLavel: {
          ...getTextField({
            label: {
              labelName: "Re-Order Lavel",
              labelKey: "STORE_MATERIAL_RE_ORDER_LAVEL"
            },
            placeholder: {
              labelName: "Re-Order Lavel",
              labelKey: "STORE_MATERIAL_RE_ORDER_LAVEL"
            },
            
            pattern: getPattern("Amount") || null,
            jsonPath: "materials[0].reorderLevel"
          })
        },
        ReOrderQty: {
          ...getTextField({
            label: {
              labelName: "Re-Order Qty",
              labelKey: "STORE_MATERIAL_RE_ORDER_QTY"
            },
            placeholder: {
              labelName: "Re-Order Qty",
              labelKey: "STORE_MATERIAL_RE_ORDER_QTY"
            },
           
            pattern: getPattern("Amount") || null,
            jsonPath: "materials[0].reorderQuantity"
          })
        },
        LotControl: {
          uiFramework: "custom-containers-local",
          moduleName: "egov-store-asset",
          componentPath: "CheckboxContainer",
          jsonPath: "materials[0].lotControl",
          gridDefination: {
            xs:12,
            sm: 6
          },
          isFieldValid: true,
          required: false,
    
          props: {
            content: "STORE_MATERIAL_LOT_CONTROL",
            jsonPath: "materials[0].lotControl",
            screenName: "creatematerialmaster",
            checkBoxPath:
              "components.div.children.searchForm.children.cardContent.children.searchFormContainer.children.storeMappingInfo",
          },
        },
        ShelfLifeControl: {
          uiFramework: "custom-containers-local",
          moduleName: "egov-store-asset",
          componentPath: "CheckboxContainer",
          jsonPath: "materials[0].shelfLifeControl",
          gridDefination: {
            xs:12,
            sm: 6
          },
          isFieldValid: true,
          required: false,
    
          props: {
            content: "STORE_MATERIAL_SHELF_LIFE_CONTROL",
            jsonPath: "materials[0].shelfLifeControl",
            screenName: "creatematerialmaster",
            checkBoxPath:
              "components.div.children.searchForm.children.cardContent.children.searchFormContainer.children.active",
          },
        },
        
      }),
    }),
    View3: getCommonGrayCard({
      header3: getCommonTitle(
        {
          labelName: "Specifications",
          labelKey: "STORE_MATERIAL_SPECIFICATION_DETAILS"
        },
        {
          style: {
            marginBottom: 18
          }
        }
      ),
      SpecificationContainer: getCommonContainer({
        Model: {
          ...getTextField({
            label: {
              labelName: "Model",
              labelKey: "STORE_MATERIAL_MODEL"
            },
            placeholder: {
              labelName: "Model",
              labelKey: "STORE_MATERIAL_MODEL"
            },
            required: true,
            pattern: getPattern("Name") || null,
            jsonPath: "materials[0].model"
          })
        },
        ManufracturerPartNo: {
          ...getTextField({
            label: {
              labelName: "Manufracturer Part No",
              labelKey: "STORE_MATERIAL_MANUFRACTURER_PART_NO"
            },
            placeholder: {
              labelName: "Manufracturer Part No",
              labelKey: "STORE_MATERIAL_MANUFRACTURER_PART_NO"
            },
            required: true,
            pattern: getPattern("Name") || null,
            jsonPath: "materials[0].manufracturerPartNo"
          })
        },
  
        TechnicalSpecifications: {
          ...getTextField({
            label: {
              labelName: "Technical Specifications",
              labelKey: "STORE_MATERIAL_TECHNICAL_SPECIFICATIONS"
            },
            placeholder: {
              labelName: "Technical Specifications",
              labelKey: "STORE_MATERIAL_TECHNICAL_SPECIFICATIONS"
            },
            required: true,
            props: {
              className: "applicant-details-error",
              multiline: "multiline",
              rowsMax: 2,
            },
            pattern: getPattern("eventDescription") || null,
            jsonPath: "materials[0].technicalSpecifications"
          })
        },
        TermsOfDelivery: {
          ...getTextField({
            label: {
              labelName: "Terms Of Delivery",
              labelKey: "STORE_MATERIAL_TERMS_OF_DELIVERY"
            },
            placeholder: {
              labelName: "Terms Of Delivery",
              labelKey: "STORE_MATERIAL_TERMS_OF_DELIVERY"
            },
            required: true,
            props: {
              className: "applicant-details-error",
              multiline: "multiline",
              rowsMax: 2,
            },
            pattern: getPattern("eventDescription") || null,
            jsonPath: "materials[0].termsOfDelivery"
          })
        },
  
       
      })
    }),
    
  });
  

  