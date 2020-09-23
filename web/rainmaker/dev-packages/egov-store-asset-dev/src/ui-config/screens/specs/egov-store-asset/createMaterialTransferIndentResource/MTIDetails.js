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
import { handleScreenConfigurationFieldChange as handleField } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import get from "lodash/get";
import set from "lodash/set";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import{GetMdmsNameBycode} from '../../../../../ui-utils/storecommonsapi'
const MTIDetailsCard = {
  uiFramework: "custom-containers",
  componentPath: "MultiItem",
  props: {
    scheama: getCommonGrayCard({
      mtiDetailsCardContainer: getCommonContainer(
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
              jsonPath: "indents[0].indentDetails[0].material.code",
              sourceJsonPath: "createScreenMdmsData.store-asset.Material",
              props: {
                className: "hr-generic-selectfield",
                optionValue: "code",
                optionLabel: "name"
              }
            }),
            beforeFieldChange: (action, state, dispatch) => {
              let name = GetMdmsNameBycode(state, dispatch,"createScreenMdmsData.store-asset.Material",action.value) 
              let cardindex  = action.componentJsonpath.split("items[")[1].split("]")[0];
              
              dispatch(prepareFinalObject(`indents[0].indentDetails[${cardindex}].material.name`, name));
              dispatch(prepareFinalObject(`indents[0].indentDetails[${cardindex}].unitRate`, 1));
              let Material = get(state, "screenConfiguration.preparedFinalObject.createScreenMdmsData.store-asset.Material",[]) 
              let MaterialType = Material.filter(x=>x.code == action.value)//.materialType.code
              if(MaterialType && MaterialType[0]) 
              {             
              dispatch(prepareFinalObject(`indents[0].indentDetails[${cardindex}].uom.code`, MaterialType[0].baseUom.code));
             let baseUomname = GetMdmsNameBycode(state, dispatch,"createScreenMdmsData.common-masters.UOM",MaterialType[0].baseUom.code) 
              dispatch(prepareFinalObject(`indents[0].indentDetails[${cardindex}].uom.name`, baseUomname));
              }
              
              }
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
              jsonPath: "indents[0].indentDetails[0].uom.code",
              sourceJsonPath: "createScreenMdmsData.common-masters.UOM",
              props: {
                disabled:true,
                className: "hr-generic-selectfield",
                optionValue: "code",
                optionLabel: "name"
              }
            }),
            beforeFieldChange: (action, state, dispatch) => {
              let name = GetMdmsNameBycode(state, dispatch,"createScreenMdmsData.common-masters.UOM",action.value) 
              let cardindex  = action.componentJsonpath.split("items[")[1].split("]")[0];
              dispatch(prepareFinalObject("indents[0].indentDetails[0].uom.name", name));
              }
          },
        
          quantityRequired: {
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
              pattern: getPattern("numeric-only"),
              jsonPath: "indents[0].indentDetails[0].indentQuantity"
            }),
            beforeFieldChange: (action, state, dispatch) => {
              let cardindex  = action.componentJsonpath.split("items[")[1].split("]")[0];
              dispatch(prepareFinalObject(`indents[0].indentDetails[${cardindex}].userQuantity`,Number(action.value)));
              dispatch(prepareFinalObject(`indents[0].indentDetails[${cardindex}].asset.code`,""));
            //   let unitRate = get(state.screenConfiguration.preparedFinalObject,`indents[0].indentDetails[0].unitRate`,0)
            //   let totalValue = unitRate * Number(action.value)
            //  dispatch(prepareFinalObject("indents[0].indentDetails[0].totalValue",totalValue));
            }
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
              props:{
                disabled:true,
              },
              visible:false,
              pattern: getPattern("numeric-only"),
              jsonPath: "indents[0].indentDetails[0].unitRate"
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
              props:{
                disabled:true,
              },
              visible:false,
              pattern: getPattern("numeric-only"),
              jsonPath: "indents[0].indentDetails[0].totalValue"
            }),
            beforeFieldChange: (action, state, dispatch) => {
             
            }
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
              visible:false,
              pattern: getPattern("numeric-only"),
              jsonPath: "indents[0].indentDetails[0].usedQuantity"
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
    addItemLabel: {
      labelName: "ADD",
      labelKey: "STORE_COMMON_ADD_BUTTON"
    },
    headerName: "Material Transfer Indent Details",
    headerJsonPath:
      "children.cardContent.children.header.children.head.children.Accessories.props.label",
    sourceJsonPath: "indents[0].indentDetails",
    prefixSourceJsonPath:
      "children.cardContent.children.mtiDetailsCardContainer.children",
   // disableDeleteIfKeyExists: "id"
  },
  type: "array"
};

export const MTIDetails = getCommonCard({
  header: getCommonTitle(
    {
      labelName: "Material Transfer Indent Details",
      labelKey: "STORE_MTI_DETAILS_HEADER"
    },
    {
      style: {  
        marginBottom: 18
      }
    }
  ),
  MTIDetailsCard
});
