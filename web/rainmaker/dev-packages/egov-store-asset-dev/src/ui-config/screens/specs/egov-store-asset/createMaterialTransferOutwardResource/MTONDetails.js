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
import{getmaterialissuesSearchResults,GetMdmsNameBycode,GetTotalQtyValue} from '../../../../../ui-utils/storecommonsapi'
import { getTenantId } from "egov-ui-kit/utils/localStorageUtils";
const MTONDetailsCard = {
  uiFramework: "custom-containers-local",
    moduleName: "egov-store-asset",
    componentPath: "MultiItem",
  props: {
    scheama: getCommonGrayCard({
      MTONDetailsCardContainer: getCommonContainer(
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
              jsonPath: "materialIssues[0].materialIssueDetails[0].receiptId",
              sourceJsonPath: "indentsOutmaterial",
              props: {
                optionValue: "receiptId",
                optionLabel: "materialName",
                // optionValue: "id",
                // optionLabel: "id",
              },
            }),
            beforeFieldChange: (action, state, dispatch) => {
              let cardIndex = action.componentJsonpath.split("items[")[1].split("]")[0];
              // set indent qty based on matcode selected
              let indentDetails = get(state, "screenConfiguration.preparedFinalObject.TransferIndent.indents",[])
             let indentNumber = get(state, "screenConfiguration.preparedFinalObject.materialIssues[0].indent.indentNumber",'')
              indentDetails = indentDetails.filter(x=>x.indentNumber === indentNumber)
              indentDetails = get(
                indentDetails[0],
                `indentDetails`,
                []
              ); 
              
              let indentsOutmaterial = get(state, "screenConfiguration.preparedFinalObject.indentsOutmaterial",[])
              indentsOutmaterial = indentsOutmaterial.filter(x=>x.receiptId === action.value)
              indentDetails = indentDetails.filter(x=>x.material.code === indentsOutmaterial[0].materialCode)
              if(indentDetails && indentDetails[0])
              {
                dispatch(prepareFinalObject(`materialIssues[0].materialIssueDetails[${cardIndex}].indentQuantity`, indentDetails[0].indentQuantity));
                dispatch(prepareFinalObject(`materialIssues[0].materialIssueDetails[${cardIndex}].indentDetail.indentQuantity`, indentDetails[0].indentQuantity));
                dispatch(prepareFinalObject(`materialIssues[0].materialIssueDetails[${cardIndex}].indentDetail.indentIssuedQuantity`, indentDetails[0].indentQuantity-indentDetails[0].indentIssuedQuantity));
                let id = getQueryArg(window.location.href, "id");
                if(id)
                {
                  
                  let quantityIssued =  get(state, `screenConfiguration.preparedFinalObject.materialIssues[0].materialIssueDetails[${cardIndex}].quantityIssued`,0)
                  dispatch(prepareFinalObject(`materialIssues[0].materialIssueDetails[${cardIndex}].quantityIssuedE`, (indentDetails[0].indentQuantity-indentDetails[0].indentIssuedQuantity)+quantityIssued));
                  // let indentIssuedQuantity = get(state, `screenConfiguration.preparedFinalObject.materialIssues[0].materialIssueDetails[${cardIndex}].indentDetail.indentIssuedQuantity`,0)
                  // dispatch(prepareFinalObject(`materialIssues[0].materialIssueDetails[${cardIndex}].quantityIssuedE`, indentIssuedQuantity +quantityIssued));               

                }
               // dispatch(prepareFinalObject(`materialIssues[0].materialIssueDetails[${cardIndex}].indentQuantity`, indentDetails[0].indentQuantity-(indentDetails[0].indentIssuedQuantity+indentDetails[0].poOrderedQuantity)));
                // dispatch(prepareFinalObject(`materialIssues[0].materialIssueDetails[${cardIndex}].indentDetail.indentQuantity`, indentDetails[0].indentQuantity));
                // dispatch(prepareFinalObject(`materialIssues[0].materialIssueDetails[${cardIndex}].indentDetail.indentIssuedQuantity`, indentDetails[0].indentIssuedQuantity));
                dispatch(prepareFinalObject(`materialIssues[0].materialIssueDetails[${cardIndex}].mrnNumber`, indentsOutmaterial[0].mrnNumber));
                dispatch(prepareFinalObject(`materialIssues[0].materialIssueDetails[${cardIndex}].tenantId`, getTenantId()));
                
                dispatch(prepareFinalObject(`materialIssues[0].materialIssueDetails[${cardIndex}].receiptId`, indentsOutmaterial[0].receiptId));
                dispatch(prepareFinalObject(`materialIssues[0].materialIssueDetails[${cardIndex}].receiptDate`, Number(indentsOutmaterial[0].receiptDate)));
                dispatch(prepareFinalObject(`materialIssues[0].materialIssueDetails[${cardIndex}].balanceQuantity`, indentsOutmaterial[0].balance));
                dispatch(prepareFinalObject(`materialIssues[0].materialIssueDetails[${cardIndex}].unitRate`, indentsOutmaterial[0].unitRate));
                dispatch(prepareFinalObject(`materialIssues[0].materialIssueDetails[${cardIndex}].uom.code`, indentsOutmaterial[0].uomCode));
                let uomname = GetMdmsNameBycode(state, dispatch,`createScreenMdmsData.common-masters.UOM`,indentsOutmaterial[0].uomCode)
                dispatch(prepareFinalObject(`materialIssues[0].materialIssueDetails[${cardIndex}].uom.name`, uomname));
                dispatch(prepareFinalObject(`materialIssues[0].materialIssueDetails[${cardIndex}].indentDetail.id`, indentDetails[0].id));
                dispatch(prepareFinalObject(`materialIssues[0].materialIssueDetails[${cardIndex}].indentDetail.uom.code`, indentsOutmaterial[0].uomCode));
                dispatch(prepareFinalObject(`materialIssues[0].materialIssueDetails[${cardIndex}].indentDetail.uom.name`, uomname));
                dispatch(prepareFinalObject(`materialIssues[0].materialIssueDetails[${cardIndex}].indentDetail.material.code`, indentsOutmaterial[0].materialCode));
                let matcode = GetMdmsNameBycode(state, dispatch,`createScreenMdmsData.store-asset.Material`,indentsOutmaterial[0].materialCode)
                dispatch(prepareFinalObject(`materialIssues[0].materialIssueDetails[${cardIndex}].indentDetail.material.name`, matcode));
                dispatch(prepareFinalObject(`materialIssues[0].materialIssueDetails[${cardIndex}].material.name`, matcode));
                dispatch(prepareFinalObject(`materialIssues[0].materialIssueDetails[${cardIndex}].material.code`, indentsOutmaterial[0].materialCode));
              }

            }
          }, 
          receiptDate: {
            ...getDateField({
              label: {
                labelName: "Receipt Date",
                labelKey: "STORE_MATERIAL_OPENNING_BALANCE_RECEIPT_DATE",
              },
              placeholder: {
                labelName: "Receipt Date",
                labelKey: "STORE_MATERIAL_OPENNING_BALANCE_RECEIPT_DATE",
              },
              pattern: getPattern("Date"),
              jsonPath: "materialIssues[0].materialIssueDetails[0].receiptDate",
              props: {
                disabled:true,                 
              }
            }),
          }, 
          indentQuantity: {
            ...getTextField({
              label: {
                labelName: "Quantity Required",
                labelKey: "STORE_MATERIAL_INDENT_QUANTITY_REQUIRED"
              },
              placeholder: {
                labelName: "Enter Quantity Required",
                labelKey: "STORE_MATERIAL_INDENT_QUANTITY_REQUIRED_PLACEHOLDER"
              },
              required:true,
               //pattern: getPattern("Amount") || null,
               pattern: getSTOREPattern("Quantity"),
              jsonPath: "materialIssues[0].materialIssueDetails[0].indentQuantity",
              props:{
                disabled:true,
              }
            })
          },
          balanceQuantity: {
            ...getTextField({
              label: {
                labelName: "Balance Quantity",
                labelKey: "STORE_PURCHASE_ORDER_BLNC_QLTY"
              },
              placeholder: {
                labelName: "Enter Balance Quantity",
                labelKey: "STORE_PURCHASE_ORDER_BLNC_QLTY_PLACEHOLDER"
              },
               //pattern: getPattern("Amount") || null,
               pattern: getSTOREPattern("Quantity"),
              jsonPath: "materialIssues[0].materialIssueDetails[0].balanceQuantity",
              props: {
                disabled:true,
              }
            })
          },
          quantityIssued: {
            ...getTextField({
              label: {
                labelName: "Qty Issued",
                labelKey: "STORE_MATERIAL_INDENT_NOTE_QTY_ISSUED_EDIT"
              },
              placeholder: {
                labelName: "Enter Qty Issued",
                labelKey: "STORE_MATERIAL_INDENT_NOTE_QTY_ISSUED_PLACEHOLDER"
              },
              required: true,
              errorMessage:"STORE_VALIDATION_QUANTITY_ISSUED",
               //pattern: getPattern("Amount") || null,
               pattern: getSTOREPattern("Quantity"),
              jsonPath: "materialIssues[0].materialIssueDetails[0].quantityIssuedE",
              props:{
                inputProps: {
                  min: 1
                },
                disabled:true
              }
            }),
           
          },
          issedQuantity: {
            ...getTextField({
              label: {
                labelName: "Qty Issued",
                labelKey: "STORE_MATERIAL_INDENT_NOTE_QTY_ISSUED"
              },
              placeholder: {
                labelName: "Enter Qty Issued",
                labelKey: "STORE_MATERIAL_INDENT_NOTE_QTY_ISSUED_PLACEHOLDER"
              },
              required: true,
              errorMessage:"STORE_VALIDATION_QUANTITY_ISSUED",
               //pattern: getPattern("Amount") || null,
               pattern: getSTOREPattern("Quantity"),
              jsonPath: "materialIssues[0].materialIssueDetails[0].userQuantityIssued",
              props:{
                inputProps: {
                  min: 1
                }
              }
            }),
            beforeFieldChange: (action, state, dispatch) => {
              let cardIndex = action.componentJsonpath.split("items[")[1].split("]")[0];
              let unitRate = get(state.screenConfiguration.preparedFinalObject,`materialIssues[0].materialIssueDetails[${cardIndex}].unitRate`,0)
              let BalanceQty = get(state.screenConfiguration.preparedFinalObject,`materialIssues[0].materialIssueDetails[${cardIndex}].balanceQuantity`,0)
             let totalValue = unitRate * Number(action.value)
             let balAfterIssue = BalanceQty - Number(action.value)
             dispatch(prepareFinalObject(`materialIssues[0].materialIssueDetails[${cardIndex}].totalValue`, totalValue));
             dispatch(prepareFinalObject(`materialIssues[0].materialIssueDetails[${cardIndex}].indentDetail.tenantId`, getTenantId()));
             dispatch(prepareFinalObject(`materialIssues[0].materialIssueDetails[${cardIndex}].indentDetail.userQuantity`, Number(action.value)));
             dispatch(prepareFinalObject(`materialIssues[0].materialIssueDetails[${cardIndex}].indentDetail.userQuantityIssued`, Number(action.value)));
             dispatch(prepareFinalObject(`materialIssues[0].materialIssueDetails[${cardIndex}].indentDetail.balAfterIssue`, balAfterIssue));
            //set total value on Qty Change
            let cardJsonPath =
            "components.div.children.formwizardSecondStep.children.MTONDetails.children.cardContent.children.MTONDetailsCard.props.items";
            let pagename = `create-material-transfer-outward`;
            let jasonpath =  "materialIssues[0].materialIssueDetails";
            let InputQtyValue = "indentQuantity";
            let TotalValue_ = "totalValue";
            let TotalQty ="indentDetail.userQuantity"
            let Qty = GetTotalQtyValue(state,cardJsonPath,pagename,jasonpath,InputQtyValue,TotalValue_,TotalQty)
            if(Qty && Qty[0])
            {                
            dispatch(prepareFinalObject(`materialIssues[0].totalvalue`, Qty[0].TotalValue));
            dispatch(prepareFinalObject(`materialIssues[0].totalQty`, Qty[0].TotalQty)); 
            }
            }
          },
          uomName: {
            ...getTextField({
              label: { labelName: "UOM Name", labelKey: "STORE_PURCHASE_ORDER_UOM" },
              placeholder: {
                labelName: "Enter UOM Name",
                labelKey: "STORE_PURCHASE_ORDER_UOM"
              },
              required: true,
              errorMessage:"STORE_VALIDATION_UOM_NAME",
              jsonPath: "materialIssues[0].materialIssueDetails[0].uom.name",
              sourceJsonPath: "createScreenMdmsData.common-masters.UOM",
              props: {
                disabled:true,
              }
            }),
          },
          unitRate: {
            ...getTextField({
              label: {
                labelName: "Unit Rate",
                labelKey: "STORE_MATERIAL_RECEIPT_UNIT_RATE"
              },
              placeholder: {
                labelName: "Enter Unit Rate",
                labelKey: "STORE_MATERIAL_RECEIPT__UNIT_RATE_PLACEHOLDER"
              },
               //pattern: getPattern("Amount") || null,
               pattern: getSTOREPattern("Quantity"),
              jsonPath: "materialIssues[0].materialIssueDetails[0].unitRate",
              props: {
                disabled:true,
              }
            })
          },
          totalValue: {
            ...getTextField({
              label: {
                labelName: "Total Value",
                labelKey: "STORE_MATERIAL_INDENT_NOTE_TOTAL_VALUE"
              },
              placeholder: {
                labelName: "Total Value",
                labelKey: "STORE_MATERIAL_INDENT_NOTE_TOTAL_VALUE"
              },
              pattern: getPattern("numeric-only"),
              jsonPath: "materialIssues[0].materialIssueDetails[0].totalValue",
              props: {
                disabled:true,
              }
            })
          },  
          balAfterIssue: {
            ...getTextField({
              label: {
                labelName: "Balance Qty After Issue",
                labelKey: "STORE_MATERIAL_INDENT_NOTE_QTY_BALANCE_QTY_AFTER_ISSUE"
              },
              placeholder: {
                labelName: "Balance Qty After Issue",
                labelKey: "STORE_MATERIAL_INDENT_NOTE_QTY_BALANCE_QTY_AFTER_ISSUE"
              },
              pattern: getPattern("numeric-only"),
              jsonPath: "materialIssues[0].materialIssueDetails[0].indentDetail.balAfterIssue",
              props: {
                disabled:true,
              }
            })
          },  
          remark: {
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
              pattern: getSTOREPattern("Comment"),
              jsonPath: "materialIssues[0].materialIssueDetails[0].description"
            })
          },
      
        },
        {
          style: {
            overflow: "visible"
          }
        }
      )
    }),
    onMultiItemAdd: (state, muliItemContent) => {
      return muliItemContent;
    },
    items: [],
    onMultiItemDelete:(state, dispatch)=>{       

    },
    addItemLabel: {
      labelName: "ADD",
      labelKey: "STORE_COMMON_ADD_BUTTON"
    },
    headerName: "Material Transfer Indent Details",
    headerJsonPath:
      "children.cardContent.children.header.children.head.children.Accessories.props.label",
    sourceJsonPath: "materialIssues[0].materialIssueDetails",
     //Update Total value when delete any card configuration settings     
     cardtotalpropes:{
      totalIndentQty:false,
      pagename:`create-material-transfer-outward`,
      cardJsonPath:"components.div.children.formwizardSecondStep.children.MTONDetails.children.cardContent.children.MTONDetailsCard.props.items",
      jasonpath:"materialIssues[0].materialIssueDetails",
      InputQtyValue:"indentQuantity",
      TotalValue:"totalValue",
      TotalQty:"indentDetail.userQuantity"        
    },
    prefixSourceJsonPath:
      "children.cardContent.children.MTONDetailsCardContainer.children",
   // disableDeleteIfKeyExists: "id"
  },
  type: "array"
};

export const MTONDetails = getCommonCard({
  header: getCommonTitle(
    {
      labelName: "Material Transfer Outward Details",
      labelKey: "STORE_MTON_DETAILS_HEADER"
    },
    {
      style: {  
        marginBottom: 18
      }
    }
  ),
  MTONDetailsCard
});
