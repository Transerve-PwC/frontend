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
import { getTenantId, getUserInfo } from "egov-ui-kit/utils/localStorageUtils";
import { handleScreenConfigurationFieldChange as handleField } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import get from "lodash/get";
import set from "lodash/set";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import { getSearchResults } from "../../../../../ui-utils/commons";
const ScrapMaterialDetailsCard = {
  uiFramework: "custom-containers",
  componentPath: "MultiItem",
  props: {
    scheama: getCommonGrayCard({
      ScrapMaterialDetailsCardContainer: getCommonContainer(
        {
          materialName: {
            ...getSelectField({
              label: { labelName: "Material Name", labelKey: "STORE_MATERIAL_NAME" },
              placeholder: {
                labelName: "Select Material Name",
                labelKey: "STORE_MATERIAL_NAME_SELECT"
              },
              required: true,
              jsonPath: "scraps[0].scrapDetails[0].material.code",
              sourceJsonPath: "materialNames",
              props: {
                className: "hr-generic-selectfield",
                optionValue: "code",
                optionLabel: "name"
              }
            }),
            beforeFieldChange: async (action, state, dispatch) => {
              if(action.value){
              const {scraps , materialNames} = state.screenConfiguration.preparedFinalObject;
              const {store} = scraps[0];
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
                          dispatch(prepareFinalObject(`scraps[0].scrapDetails[${itemIndex}].material.name`, matObj[0].name)); 
                          dispatch(prepareFinalObject(`scraps[0].scrapDetails[${itemIndex}].balanceQuantity`, element.balance)); 
                          dispatch(prepareFinalObject(`scraps[0].scrapDetails[${itemIndex}].unitRate`, element.unitRate)); 
                          dispatch(prepareFinalObject(`scraps[0].scrapDetails[${itemIndex}].uom`, matObj[0].scrapUom)); 
                          dispatch(prepareFinalObject(`scraps[0].scrapDetails[${itemIndex}].issueDetail.id`, matObj[0].scrapissueDetail)); 
                          dispatch(prepareFinalObject(`scraps[0].scrapDetails[${itemIndex}].lotNumber`, matObj[0].lotNumber)); 
                          let balanceValue = element.unitRate * element.balance;
                          if(balanceValue) {
                           dispatch(prepareFinalObject(`scraps[0].scrapDetails[${itemIndex}].balanceValue`, balanceValue)); 
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
          //     jsonPath: "scraps[0].scrapDetails[0].lotNumber",
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
            //  pattern: getPattern("numeric-only"),
              jsonPath: "scraps[0].scrapDetails[0].lotNumber",
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
              jsonPath: "scraps[0].scrapDetails[0].balanceQuantity",
              props: {
                disabled: true
              },
            })
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
              jsonPath: "scraps[0].scrapDetails[0].balanceValue",
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
              jsonPath: "scraps[0].scrapDetails[0].unitRate",
              props: {
                disabled: true
              },
            })
          },
          scrapReason: {
            ...getSelectField({
              label: { labelName: "Scrap Reason", labelKey: "STORE_SCRAP_REASON" },
              placeholder: {
                labelName: "Select Scrap Reason",
                labelKey: "STORE_SCRAP_REMARK_SELECT"
              },
              required: true,
              jsonPath: "scraps[0].scrapDetails[0].scrapReason",
             // sourceJsonPath: "createScreenMdmsData.common-masters.UOM",
              props: {
                className: "hr-generic-selectfield",
                optionValue: "code",
                optionLabel: "name",
                data: [
                  {
                    code: "Damaged",
                    name: "Damaged"
                  },
                  {
                    code: "NotInUse",
                    name: "NotInUse"
                  },
                  {
                    code: "NotFitforUse",
                    name: "NotFitforUse"
                  },
                  {
                    code: "Expired",
                    name: "Expired"
                  },
                  {
                    code: "StockCleared",
                    name: "StockCleared"
                  },
                  {
                    code: "DeadStock",
                    name: "DeadStock"
                  },
                ],
              }
            }),
          },
          scrapQty: {
            ...getTextField({
              label: {
                labelName: "Scrap Qty",
                labelKey: "STORE_SCRAP_QUANTITY"
              },
              placeholder: {
                labelName: "Enter Scrap Qty",
                labelKey: "STORE_SCRAP_QUANTITY_PLCHLDER"
              },
              pattern: getPattern("numeric-only"),
              jsonPath: "scraps[0].scrapDetails[0].scrapQuantity",
              required :true,
            }),
            beforeFieldChange: async (action, state, dispatch) => {
              if(action.value){
                const index= action.componentJsonpath.indexOf("items[");
                if(index !== -1){
                  const itemIndex = action.componentJsonpath.charAt(index + 6);
                  const {scrapDetails} = state.screenConfiguration.preparedFinalObject.scraps[0];
                  let unitRate = scrapDetails[itemIndex].unitRate;
                  let scrapQty = action.value;
                  let scrapValue = unitRate *scrapQty;
                  if(scrapValue) {
                   dispatch(prepareFinalObject(`scraps[0].scrapDetails[${itemIndex}].scrapValue`, scrapValue)); 
                   dispatch(prepareFinalObject(`scraps[0].scrapDetails[${itemIndex}].userQuantity`, scrapQty)); 
                  }        
                 }
              }
            }
          },  
      
          scrapValue: {
            ...getTextField({
              label: {
                labelName: "Scrap Value",
                labelKey: "STORE_SCRAP_VALUE"
              },
              placeholder: {
                labelName: "Enter Scrap Value",
                labelKey: "STORE_SCRAP_VALUE_PLACEHOLDER"
              },
              pattern: getPattern("numeric-only"),
              jsonPath: "scraps[0].scrapDetails[0].scrapValue",
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
    headerName: "Scrap Material Details",
    headerJsonPath:
      "children.cardContent.children.header.children.head.children.Accessories.props.label",
    sourceJsonPath: "scraps[0].scrapDetails",
    prefixSourceJsonPath:
      "children.cardContent.children.ScrapMaterialDetailsCardContainer.children",
   // disableDeleteIfKeyExists: "id"
  },
  type: "array"
};

export const ScrapMaterialDetails = getCommonCard({
  header: getCommonTitle(
    {
      labelName: "Scrap Material Details",
      labelKey: "STORE_SCRAP_DETAILS_HEADER"
    },
    {
      style: {  
        marginBottom: 18
      }
    }
  ),
  ScrapMaterialDetailsCard
});
