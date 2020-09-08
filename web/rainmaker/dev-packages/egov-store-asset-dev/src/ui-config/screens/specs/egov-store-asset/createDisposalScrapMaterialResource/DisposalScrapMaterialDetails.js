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
import { getSearchResults } from "../../../../../ui-utils/commons";
import { getTenantId } from "egov-ui-kit/utils/localStorageUtils";
import { handleScreenConfigurationFieldChange as handleField } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import get from "lodash/get";
import set from "lodash/set";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
const DisposeScrapMaterialDetailsCard = {
  uiFramework: "custom-containers",
  componentPath: "MultiItem",
  props: {
    scheama: getCommonGrayCard({
      DisposeScrapMaterialDetailsCardContainer: getCommonContainer(
        {
          materialName: {
            ...getSelectField({
              label: { labelName: "Material Name", labelKey: "STORE_MATERIAL_NAME" },
              placeholder: {
                labelName: "Select Material Name",
                labelKey: "STORE_MATERIAL_NAME_SELECT"
              },
              required: true,
              jsonPath: "disposals[0].disposalDetails[0].material.code",
              sourceJsonPath: "materialNames",
              props: {
                className: "hr-generic-selectfield",
                optionValue: "code",
                optionLabel: "name"
              }
            }),
            beforeFieldChange: async (action, state, dispatch) => {
              if(action.value){
              const {disposals , materialNames} = state.screenConfiguration.preparedFinalObject;
              const {store} = disposals[0];
              //material object 
             if(materialNames) {
             const matObj = materialNames.filter(mat => mat.code === action.value);
              const queryObject = [{ key: "tenantId", value: getTenantId()},{ key: "issueingStore", value: store.code},{ key: "material", value: action.value}];
              getSearchResults(queryObject, dispatch,"materialBalanceAndName")
              .then( response =>{
                if(response){    
                     response.MaterialBalanceRate.forEach(element => {      
                       if(element.receiptId === matObj[0].receiptIdForScrap){
                        const index= action.componentJsonpath.indexOf("items[");
                        if(index !== -1){
                          const itemIndex = action.componentJsonpath.charAt(index + 6);
                          dispatch(prepareFinalObject(`disposals[0].disposalDetails[${itemIndex}].material.name`, matObj[0].name)); 
                          dispatch(prepareFinalObject(`disposals[0].disposalDetails[${itemIndex}].balanceQuantity`, element.balance)); 
                          dispatch(prepareFinalObject(`disposals[0].disposalDetails[${itemIndex}].unitRate`, element.unitRate)); 
                          dispatch(prepareFinalObject(`disposals[0].disposalDetails[${itemIndex}].uom`, matObj[0].disposalUom));
                          dispatch(prepareFinalObject(`disposals[0].disposalDetails[${itemIndex}].scrapDetails`, matObj[0].scrapDetails)); 
                          dispatch(prepareFinalObject(`disposals[0].disposalDetails[${itemIndex}].lotNumber`, matObj[0].lotNumber)); 
                          let balanceValue = element.unitRate * element.balance;
                          if(balanceValue) {
                           dispatch(prepareFinalObject(`disposals[0].disposalDetails[${itemIndex}].balanceValue`, balanceValue)); 
                          }        
                         }
                       
                       }
                                                                
                  });
                           
               }           
              });   
            }
              }
            }
          }, 
          // lotNo: {
          //   ...getSelectField({
          //     label: { labelName: "LOT No.", labelKey: "STORE_SCRAP_LOT_NO" },
          //     placeholder: {
          //       labelName: "Select Lot No.",
          //       labelKey: "STORE_SCRAP_LOT_NO_PLCHLDR"
          //     },
          //     required: true,
          //     jsonPath: "disposals[0].disposalDetails[0].uom.code",
          //     sourceJsonPath: "createScreenMdmsData.common-masters.UOM",
          //     props: {
          //       className: "hr-generic-selectfield",
          //       optionValue: "code",
          //       optionLabel: "name"
          //     }
          //   }),
          // },
          lotNo: {
            ...getTextField({
              label: {
                labelName: "LOT No.",
                labelKey: "STORE_SCRAP_LOT_NO"
              },
              placeholder: {
                labelName: "Select Lot No.",
                labelKey: "STORE_SCRAP_LOT_NO_PLCHLDR"
              },
              jsonPath: "disposals[0].disposalDetails[0].lotNumber",
              props: {
                disabled: true
              },
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
              pattern: getPattern("numeric-only"),
              jsonPath: "disposals[0].disposalDetails[0].balanceQuantity",
              props: {
                disabled: true
              },
            }),
            
          },
          balanceValue: {
            ...getTextField({
              label: {
                labelName: "Balance Value",
                labelKey: "STORE_SCRAP_BAL_VALUE"
              },
              placeholder: {
                labelName: "Enter Balance Value",
                labelKey: "STORE_SCRAP_BAL_VALUE_PLACEHOLDER"
              },
              pattern: getPattern("numeric-only"),
              jsonPath: "disposals[0].disposalDetails[0].balanceValue",
              props: {
                disabled: true
              },
            })
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
              pattern: getPattern("numeric-only"),
              jsonPath: "disposals[0].disposalDetails[0].unitRate",
              props: {
                disabled: true
              },
            })
          },
          disposalQty: {
            ...getTextField({
              label: {
                labelName: "Dispsal Qty",
                labelKey: "STORE_DISPOSAL_SCRAP_QUANTITY"
              },
              placeholder: {
                labelName: "Enter Disposal Qty",
                labelKey: "STORE_DISPOSAL_SCRAP_QUANTITY_PLCHLDER"
              },
              required:true,
              pattern: getPattern("numeric-only"),
              jsonPath: "disposals[0].disposalDetails[0].disposalQuantity"
            }),
            beforeFieldChange: async (action, state, dispatch) => {
              if(action.value){
                const index= action.componentJsonpath.indexOf("items[");
                if(index !== -1){
                  const itemIndex = action.componentJsonpath.charAt(index + 6);
                  const {disposalDetails} = state.screenConfiguration.preparedFinalObject.disposals[0];
                  let unitRate = disposalDetails[itemIndex].unitRate;
                  let balanceQuantity = disposalDetails[itemIndex].balanceQuantity;
                  let disposalQty = action.value;
                  let disposalValue = unitRate * disposalQty;  
                  let pendingScrapQuantity = parseInt(balanceQuantity,10) - parseInt(disposalQty,10)
                  if(disposalValue) {
                   dispatch(prepareFinalObject(`disposals[0].disposalDetails[${itemIndex}].disposalValue`, disposalValue)); 
                   dispatch(prepareFinalObject(`disposals[0].disposalDetails[${itemIndex}].userDisposalQuantity`, disposalQty)); 
                   dispatch(prepareFinalObject(`disposals[0].disposalDetails[${itemIndex}].pendingScrapQuantity`, pendingScrapQuantity)); 
                  }    
                  let dispValue = 0;
                  disposalDetails && disposalDetails.map(disp => {
                    if(disp.disposalValue)
                         dispValue += disp.disposalValue;
                  })
                  dispValue &&  dispatch(prepareFinalObject(`disposals[0].totalDisposalValue`, dispValue));    
                 }
              }
            }
          },  
      
          disposalValue: {
            ...getTextField({
              label: {
                labelName: "Disposal Value",
                labelKey: "STORE_DISPOSAL_SCRAP_VALUE"
              },
              placeholder: {
                labelName: "Enter Disposal Value",
                labelKey: "STORE_DISPOSAL_SCRAP_VALUE_PLACEHOLDER"
              },
              pattern: getPattern("numeric-only"),
              jsonPath: "disposals[0].disposalDetails[0].disposalValue",
              props: {
                disabled: true
              },
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
    headerName: "Disposal Material Details",
    headerJsonPath:
      "children.cardContent.children.header.children.head.children.Accessories.props.label",
    sourceJsonPath: "disposals[0].disposalDetails",
    prefixSourceJsonPath:
      "children.cardContent.children.DisposeScrapMaterialDetailsCardContainer.children",
   // disableDeleteIfKeyExists: "id"
  },
  type: "array"
};

export const DisposalScrapMaterialDetails = getCommonCard({
  header: getCommonTitle(
    {
      labelName: "Disposal Material Details",
      labelKey: "STORE_DISPOSAL_SCRAP_DETAILS_HEADER"
    },
    {
      style: {  
        marginBottom: 18
      }
    }
  ),
  DisposeScrapMaterialDetailsCard
});
