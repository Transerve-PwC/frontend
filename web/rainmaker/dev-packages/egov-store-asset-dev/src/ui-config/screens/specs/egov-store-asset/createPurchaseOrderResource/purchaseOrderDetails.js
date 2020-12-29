import {
  getCommonCard,
  getCommonGrayCard,
  getCommonTitle,
  getTextField,
  getDateField,
  getSelectField,
  getCommonContainer,
  getPattern,
  getCommonSubHeader
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { getSTOREPattern} from "../../../../../ui-utils/commons";
import { handleScreenConfigurationFieldChange as handleField } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import get from "lodash/get";
import set from "lodash/set";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import { getTenantId } from "egov-ui-kit/utils/localStorageUtils";
import{GetMdmsNameBycode, GetTotalQtyValue} from '../../../../../ui-utils/storecommonsapi'
const purchaseOrderDetailsCard = {
  // uiFramework: "custom-containers",
  // componentPath: "MultiItem",
  uiFramework: "custom-containers-local",
  moduleName: "egov-store-asset",
  componentPath: "MultiItem",
  props: {
    scheama: getCommonGrayCard({
      poDetailsCardContainer: getCommonContainer(
        {
          materialName: {
            ...getSelectField({
              label: { labelName: "Material Name", labelKey: "STORE_MATERIAL_NAME" },
              placeholder: {
                labelName: "Select Material Name",
                labelKey: "STORE_MATERIAL_NAME_SELECT"
              },
              required: true,
            errorMessage:"STORE_VALIDATION_MATERIAL_NAME_SELECT",
              jsonPath: "purchaseOrders[0].purchaseOrderDetails[0].material.code",
              sourceJsonPath: "searchMaster.materialNames",
              props: {
                className: "hr-generic-selectfield",
                optionValue: "code",
                optionLabel: "name"
              }
            }),
            beforeFieldChange: async (action, state, dispatch) => {
              if(action.value){
                const {materialNames} = state.screenConfiguration.preparedFinalObject.searchMaster;
                const matObj =  materialNames.filter(ele => ele.code === action.value);
                if(matObj){
                 const index= action.componentJsonpath.indexOf("items[");
                 if(index !== -1){
                  const itemIndex = action.componentJsonpath.charAt(index + 6);
                  if(matObj[0])
                  {
                  dispatch(prepareFinalObject(`purchaseOrders[0].purchaseOrderDetails[${itemIndex}].material.name`, matObj[0].name)); 
                  dispatch(prepareFinalObject(`purchaseOrders[0].purchaseOrderDetails[${itemIndex}].material.description`, matObj[0].description)); 
                  
                  if(matObj[0].uom.code)  
                  {
                    dispatch(prepareFinalObject(`purchaseOrders[0].purchaseOrderDetails[${itemIndex}].uom.code`, matObj[0].uom.code));
                    let uomname = GetMdmsNameBycode(state, dispatch,"createScreenMdmsData.common-masters.UOM",matObj[0].uom.code) 
                    dispatch(prepareFinalObject(`purchaseOrders[0].purchaseOrderDetails[${itemIndex}].uom.name`, uomname));
                  }      
                  
                  dispatch(prepareFinalObject(`purchaseOrders[0].purchaseOrderDetails[${itemIndex}].indentQuantity`, matObj[0].indentQuantity));
                  dispatch(prepareFinalObject(`purchaseOrders[0].totalIndentQty`, matObj[0].indentQuantity));
                  dispatch(prepareFinalObject(`purchaseOrders[0].purchaseOrderDetails[${itemIndex}].issuedQuantity`, matObj[0].indentIssuedQuantity));
                  dispatch(prepareFinalObject(`purchaseOrders[0].purchaseOrderDetails[${itemIndex}].poOrderedQuantity`, matObj[0].poOrderedQuantity));
                  let balenceQty =matObj[0].indentQuantity -(matObj[0].indentIssuedQuantity + matObj[0].poOrderedQuantity)
                  dispatch(prepareFinalObject(`purchaseOrders[0].purchaseOrderDetails[${itemIndex}].balenceQty`, balenceQty));
                }
                 }
                }
              }
            }
          }, 
          indentNumber: {
            ...getTextField({
              label: {
                labelName: "Indent No.",
                labelKey: "STORE_PURCHASE_ORDER_INDENT_NO"
              },
              placeholder: {
                labelName: "Enter Indent No.",
                labelKey: "STORE_PURCHASE_ORDER_INDENT_NO_PLACEHOLDER"
              },
              //pattern: getPattern("alpha-numeric"),
              props: {
                disabled:true,                 
              },
              jsonPath: "purchaseOrders[0].purchaseOrderDetails[0].indentNumber"
            })
          },
          materialDscptn: {
            ...getTextField({
              label: {
                labelName: "Material Description",
                labelKey: "STORE_MATERIAL_DESCRIPTION"
              },
              placeholder: {
                labelName: "Enter Material Description",
                labelKey: "STORE_MATERIAL_DESCRIPTION_PLCHLDER"
              },
              //pattern: getPattern("alpha-numeric"),
              props: {
                disabled:true,                 
              },
              jsonPath: "purchaseOrders[0].purchaseOrderDetails[0].material.description"
            })
          },
          uomName: {
            ...getSelectField({
              label: { labelName: "UOM Name", labelKey: "STORE_PURCHASE_ORDER_UOM" },
              placeholder: {
                labelName: "Enter UOM Name",
                labelKey: "STORE_PURCHASE_ORDER_UOM"
              },
              required: true,
            errorMessage:"STORE_VALIDATION_UOM_NAME",
              jsonPath: "purchaseOrders[0].purchaseOrderDetails[0].uom.code",
              sourceJsonPath: "createScreenMdmsData.common-masters.UOM",
              props: {
                disabled:true, 
                className: "hr-generic-selectfield",
                optionValue: "code",
                optionLabel: "name"
              }
            }),
            beforeFieldChange: async (action, state, dispatch) => {
              if(action.value){
                const {UOM} = state.screenConfiguration.preparedFinalObject.createScreenMdmsData['common-masters'];
                const uomObj =  UOM.filter(ele => ele.code === action.value);
                if(uomObj){
                  const index= action.componentJsonpath.indexOf("items[");
                  if(index !== -1){
                   const itemIndex = action.componentJsonpath.charAt(index + 6);
                   dispatch(prepareFinalObject(`purchaseOrders[0].purchaseOrderDetails[${itemIndex}].uom.name`, uomObj[0].name));          
                  }        
                }
              }
            }
          },
          indentQuantity: {
            ...getTextField({
              label: {
                labelName: "Total Indent Quantity",
                labelKey: "STORE_PURCHASE_ORDER_INDENT_QUNTITY"
              },
              placeholder: {
                labelName: "Enter Indent Quantity",
                labelKey: "STORE_PURCHASE_ORDER_INDENTT_QUNTITY_PLACEHOLDER"
              },
              // pattern: getPattern("numeric-only"),
              pattern: getSTOREPattern("Quantity"),
              props: {
                disabled:true,     
              },
              jsonPath: "purchaseOrders[0].purchaseOrderDetails[0].indentQuantity"
            })
          },
          issuedQuantity: {
            ...getTextField({
              label: {
                labelName: "Qty.  Issued",
                labelKey: "STORE_MATERIAL_RECEIPT_QTY_ISSUED"
              },
              placeholder: {
                labelName: "Enter Qty.  Issued",
                labelKey: "STORE_MATERIAL_RECEIPT_QTY_ISSUED"
              },
              required: false,
              props: {
                disabled:true,     
              },
              // pattern: getPattern("numeric-only"),
              pattern: getSTOREPattern("Quantity"),
              jsonPath: "purchaseOrders[0].purchaseOrderDetails[0].issuedQuantity"
            })
          },
          poOrderedQuantity: {
            ...getTextField({
              label: {
                labelName: "PO Ordered Quantity(Issued)",
                labelKey: "STORE_MATERIAL_PO_ISSUED"
              },
              placeholder: {
                labelName: "PO Ordered Quantity(Issued)",
                labelKey: "STORE_MATERIAL_PO_ISSUED"
              },
              required: false,
              props: {
                disabled:true,     
              },
              // pattern: getPattern("numeric-only"),
              pattern: getSTOREPattern("Quantity"),
              jsonPath: "purchaseOrders[0].purchaseOrderDetails[0].poOrderedQuantity"
            })
          },
          balenceQty: {
            ...getTextField({
              label: {
                labelName: "Balance Quantity",
                labelKey: "STORE_PURCHASE_ORDER_BLNC_QLTY"
              },
              placeholder: {
                labelName: "Balance Quantity",
                labelKey: "STORE_PURCHASE_ORDER_BLNC_QLTY"
              },
              required: false,
              props: {
                disabled:true,     
              },
              // pattern: getPattern("numeric-only"),
              pattern: getSTOREPattern("Quantity"),
              jsonPath: "purchaseOrders[0].purchaseOrderDetails[0].balenceQty"
            })
          },
          orderQuantity: {
            ...getTextField({
              label: {
                labelName: "Order Quantity",
                labelKey: "STORE_PURCHASE_ORDER_ORDR_QLTY"
              },
              placeholder: {
                labelName: "Enter Order Quantity",
                labelKey: "STORE_PURCHASE_ORDER_BLNC_ORDR_PLACEHOLDER"
              },
             // pattern: getPattern("numeric-only"),
              pattern: getSTOREPattern("Quantity"),
              jsonPath: "purchaseOrders[0].purchaseOrderDetails[0].orderQuantity"
            }),
            beforeFieldChange: async (action, state, dispatch) => {
              const index= action.componentJsonpath.indexOf("items[");
                 if(index !== -1){
                  const itemIndex = action.componentJsonpath.charAt(index + 6);
                  // let unitPrice =   get(state.screenConfiguration.preparedFinalObject,`purchaseOrders[0].purchaseOrderDetails[${itemIndex}].unitPrice`,0)
                  // let totalAcceptedvalue = unitPrice * Number(action.value)
                  dispatch(prepareFinalObject(`purchaseOrders[0].purchaseOrderDetails[${itemIndex}].receivedQuantity`, 0));
                  dispatch(prepareFinalObject(`purchaseOrders[0].purchaseOrderDetails[${itemIndex}].userQuantity`, Number(action.value)));
                  //dispatch(prepareFinalObject(`purchaseOrders[0].purchaseOrderDetails[${itemIndex}].poOrderedQuantity`, Number(action.value)));
                  let unitPrice =   get(state.screenConfiguration.preparedFinalObject,`purchaseOrders[0].purchaseOrderDetails[${itemIndex}].unitPrice`,0)
                  let totalAcceptedvalue = unitPrice * Number(action.value)
                 dispatch(prepareFinalObject(`purchaseOrders[0].purchaseOrderDetails[${itemIndex}].totalValue`, totalAcceptedvalue));
                 //set total value on Qty Change
                 let cardJsonPath =
                  "components.div.children.formwizardThirdStep.children.purchaseOrderDetails.children.cardContent.children.purchaseOrderDetailsCard.props.items";
                 let pagename = `create-purchase-order`;
                 let jasonpath =  "purchaseOrders[0].purchaseOrderDetails";
                 let InputQtyValue = "indentQuantity";
                 let TotalValue = "totalValue";
                 let TotalQty ="userQuantity"
                 let Qty = GetTotalQtyValue(state,cardJsonPath,pagename,jasonpath,InputQtyValue,TotalValue,TotalQty)
                 if(Qty && Qty[0])
                 {
                 // dispatch(prepareFinalObject(`purchaseOrders[0].totalIndentQty`, Qty[0].InputQtyValue));
                  dispatch(prepareFinalObject(`purchaseOrders[0].totalvalue`, Qty[0].TotalValue));
                  dispatch(prepareFinalObject(`purchaseOrders[0].totalQty`, Qty[0].TotalQty));

                 }
                 }

            }
          }, 

          unitPrice: {
            ...getTextField({
              label: {
                labelName: "Unit Price",
                labelKey: "STORE_PURCHASE_ORDER_UNIT_PRC"
              },
              required: true,
            errorMessage:"STORE_VALIDATION_UNIT_RATE",
              placeholder: {
                labelName: "Enter Unit Price",
                labelKey: "STORE_PURCHASE_ORDER_UNIT_PRC_PLACEHOLDER"
              },
              // pattern: getPattern("numeric-only"),
              pattern: getSTOREPattern("Quantity"),
              jsonPath: "purchaseOrders[0].purchaseOrderDetails[0].unitPrice"
            }),
            beforeFieldChange: async (action, state, dispatch) => {
              const index= action.componentJsonpath.indexOf("items[");
                 if(index !== -1){
                  const itemIndex = action.componentJsonpath.charAt(index + 6);
                  let orderQuantity =   get(state.screenConfiguration.preparedFinalObject,`purchaseOrders[0].purchaseOrderDetails[${itemIndex}].orderQuantity`,0)
                  let totalAcceptedvalue = orderQuantity * Number(action.value)
                 dispatch(prepareFinalObject(`purchaseOrders[0].purchaseOrderDetails[${itemIndex}].totalValue`, totalAcceptedvalue));
                  //set total value on Qty Change
                  let cardJsonPath =
                  "components.div.children.formwizardThirdStep.children.purchaseOrderDetails.children.cardContent.children.purchaseOrderDetailsCard.props.items";
                  let pagename = `create-purchase-order`;
                  let jasonpath =  "purchaseOrders[0].purchaseOrderDetails";
                  let InputQtyValue = "indentQuantity";
                  let TotalValue = "totalValue";
                  let TotalQty ="orderQuantity"
                  let Qty = GetTotalQtyValue(state,cardJsonPath,pagename,jasonpath,InputQtyValue,TotalValue,TotalQty)
                  if(Qty && Qty[0])
                  {
                   //dispatch(prepareFinalObject(`purchaseOrders[0].totalIndentQty`, Qty[0].InputQtyValue));
                   dispatch(prepareFinalObject(`purchaseOrders[0].totalvalue`, Qty[0].TotalValue));
                   dispatch(prepareFinalObject(`purchaseOrders[0].totalQty`, Qty[0].TotalQty));
 
                  }
                }

            }

          },
          totalValue: {
            ...getTextField({
              label: {
                labelName: "Total Value",
                labelKey: "STORE_PURCHASE_ORDER_TOTAL_VALUE"
              },
              placeholder: {
                labelName: "Enter value",
                labelKey: "STORE_PURCHASE_ORDER_TOTAL_VALUE_PLACEHOLDER"
              },
              required: true,
              props: {
                disabled: true,       
              },
              // pattern: getPattern("numeric-only"),
              pattern: getSTOREPattern("Quantity"),
              jsonPath: "purchaseOrders[0].purchaseOrderDetails[0].totalValue"
            })
          },
          // tenderQuantity: {
          //   ...getTextField({
          //     label: {
          //       labelName: "Tender Quantity",
          //       labelKey: "STORE_PURCHASE_ORDER_TENDER_QLTY"
          //     },
          //     placeholder: {
          //       labelName: "Enter Tender Quantity",
          //       labelKey: "STORE_PURCHASE_ORDER_TENDER_QLTY_PLACEHOLDER"
          //     },
          //     pattern: getPattern("numeric-only"),
          //     jsonPath: "purchaseOrders[0].purchaseOrderDetails[0].tenderQuantity"
          //   })
          // },
          // usedQuantity: {
          //   ...getTextField({
          //     label: {
          //       labelName: "Used Quantity",
          //       labelKey: "STORE_PURCHASE_ORDER_USED_QLTY"
          //     },
          //     placeholder: {
          //       labelName: "Enter Used Quantity",
          //       labelKey: "STORE_PURCHASE_ORDER_USED_QLTY_PLACEHOLDER"
          //     },
          //     pattern: getPattern("numeric-only"),
          //     jsonPath: "purchaseOrders[0].purchaseOrderDetails[0].usedQuantity"
          //   })
          // },
      
        },
        {
          style: {
            overflow: "visible"
          }
        }
      )
    }),
     onMultiItemDelete:(state, dispatch)=>{       

      },
    onMultiItemAdd: (state, muliItemContent) => {
      let indentNumber="";
       indentNumber = getQueryArg(window.location.href, "indentNumber");
      if(indentNumber){
        
        let preparedFinalObject = get(
          state,
          "screenConfiguration.preparedFinalObject",
          {}
        );
        let cardIndex = get(muliItemContent, "materialName.index");
        if(preparedFinalObject){
          set(preparedFinalObject.purchaseOrders[0],`purchaseOrderDetails[${cardIndex}].indentNumber` , indentNumber);
        }
     

        Object.keys(muliItemContent).forEach(key => {
          if ( key === "indentNumber") {
            set(muliItemContent[key], "props.disabled", true);
            set(muliItemContent[key], "props.value", indentNumber);
          } 
          else {
            if(!indentNumber)
            set(muliItemContent[key], "props.disabled", false);
            
          }
        });


      }
        //console.log("click on add");
      return muliItemContent;
    },
    items: [],
    addItemLabel: {
      labelName: "ADD",
      labelKey: "STORE_COMMON_ADD_BUTTON"
    },
    headerName: "Purchase Order Details",
    headerJsonPath:
      "children.cardContent.children.header.children.head.children.Accessories.props.label",
    sourceJsonPath: "purchaseOrders[0].purchaseOrderDetails",
    prefixSourceJsonPath:
      "children.cardContent.children.poDetailsCardContainer.children",
      //Update Total value when delete any card configuration settings
      //  cardJsonPath =
      // "components.div.children.formwizardThirdStep.children.purchaseOrderDetails.children.cardContent.children.purchaseOrderDetailsCard.props.items";
      //  pagename = `create-purchase-order`;
      // jasonpath =  "purchaseOrders[0].purchaseOrderDetails";
      // InputQtyValue = "indentQuantity";
      // TotalValue = "totalValue";
      cardtotalpropes:{
        totalIndentQty:true,
        pagename:`create-purchase-order`,
        cardJsonPath:"components.div.children.formwizardThirdStep.children.purchaseOrderDetails.children.cardContent.children.purchaseOrderDetailsCard.props.items",
        jasonpath:"purchaseOrders[0].purchaseOrderDetails",
        InputQtyValue:"indentQuantity",
        TotalValue:"totalValue",
        TotalQty:"totalValue"
      }
   // disableDeleteIfKeyExists: "id"
  },
  type: "array"
};

export const purchaseOrderDetails = getCommonCard({
  header: getCommonTitle(
    {
      labelName: "Purchase Order Details",
      labelKey: "STORE_PO_DETAILS_HEADER"
    },
    {
      style: {  
        marginBottom: 18
      }
    }
  ),
  // subheader: getCommonSubHeader({
  //   labelName:
  //     "Verify entered details before submission. Assignment details cannot be edited once submitted.",
  //   labelKey: "HR_ASSIGN_DET_SUB_HEADER"
  // }),
  purchaseOrderDetailsCard
});
