import {
    getCommonCard,
    getCommonGrayCard,
    getCommonTitle,
    getSelectField,
    getDateField,
    getTextField,
    getPattern,
    getCommonContainer
  } from "egov-ui-framework/ui-config/screens/specs/utils";
  import get from "lodash/get";
  import filter from "lodash/filter";
  import {
    convertDateToEpoch,    
  } from "../../utils";
  import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
  import { getTenantId } from "egov-ui-kit/utils/localStorageUtils";
  import{GetMdmsNameBycode,GetTotalQtyValue} from '../../../../../ui-utils/storecommonsapi'

  const arrayCrawler = (arr, n) => {
    if (n == 1) {
      return arr.map(item => {
        return { code: item.code, name: item.name };
      });
    } else
      return arr.map(item => {
        return arrayCrawler(item.children, n - 1);
      });
  };
  
  const MaterialTransferInwordCard = {
    uiFramework: "custom-containers-local",
    moduleName: "egov-store-asset",
    componentPath: "MultiItem",
    props: {
      scheama: getCommonGrayCard({
        materialReceiptCardContainer: getCommonContainer(
          {

            MaterialName: {
              ...getSelectField({
                label: {
                  labelName: "Material Nmae",
                  labelKey: "STORE_MATERIAL_NAME"
                },
                placeholder: {
                  labelName: "Select Material Name",
                  labelKey: "STORE_MATERIAL_NAME_SELECT"
                },
                required: false,               
                jsonPath: "transferInwards[0].receiptDetails[0].material.code",
                sourceJsonPath: "indentsOutmaterial",
                props: {
                  optionValue: "code",
                  optionLabel: "name",
                  // optionValue: "id",
                  // optionLabel: "id",
                },
              }),
              beforeFieldChange: (action, state, dispatch) => {
                let cardIndex = action.componentJsonpath.split("items[")[1].split("]")[0];
                let materials = get(
                  state.screenConfiguration.preparedFinalObject,
                  `indentsOutmaterial`,
                  []
                ); 
                materials =  materials.filter(x=> x.code === action.value)   
                dispatch(prepareFinalObject(`transferInwards[0].receiptDetails[${cardIndex}].material.name`,materials[0].name));
                dispatch(prepareFinalObject(`transferInwards[0].receiptDetails[${cardIndex}].uom.code`,materials[0].uom.code));
                let uomname = GetMdmsNameBycode(state, dispatch,"createScreenMdmsData.common-masters.UOM",materials[0].uom.code) 
                dispatch(prepareFinalObject(`transferInwards[0].receiptDetails[${cardIndex}].uom.name`,uomname));
                dispatch(prepareFinalObject(`transferInwards[0].receiptDetails[${cardIndex}].unitRate`,materials[0].unitRate));
                dispatch(prepareFinalObject(`transferInwards[0].receiptDetails[${cardIndex}].quantityIssued`,materials[0].quantityIssued));             
                dispatch(prepareFinalObject(`transferInwards[0].receiptDetails[${cardIndex}].userReceivedQty`,materials[0].quantityIssued));             
                // set other value on material select

                let unitRate = get(state.screenConfiguration.preparedFinalObject,`transferInwards[0].receiptDetails[${cardIndex}].unitRate`,0)
             
                let totalValue = unitRate * materials[0].quantityIssued
               
                dispatch(prepareFinalObject(`transferInwards[0].receiptDetails[${cardIndex}].totalValue`, totalValue));
                dispatch(prepareFinalObject(`transferInwards[0].receiptDetails[${cardIndex}].acceptedQty`, materials[0].quantityIssued));
                dispatch(prepareFinalObject(`transferInwards[0].receiptDetails[${cardIndex}].userAcceptedQty`, materials[0].quantityIssued));
                dispatch(prepareFinalObject(`transferInwards[0].receiptDetails[${cardIndex}].isScrapItem`, false));
                // default value not exist in UI
                dispatch(prepareFinalObject(`transferInwards[0].receiptDetails[${cardIndex}].receiptDetailsAddnInfo[0].quantity`,materials[0].quantityIssued));
                dispatch(prepareFinalObject(`transferInwards[0].receiptDetails[${cardIndex}].receiptDetailsAddnInfo[0].lotNo`, ''));
                dispatch(prepareFinalObject(`transferInwards[0].receiptDetails[${cardIndex}].receiptDetailsAddnInfo[0].serialNo`, ''));
                dispatch(prepareFinalObject(`transferInwards[0].receiptDetails[${cardIndex}].receiptDetailsAddnInfo[0].expiryDate`, 0));
                dispatch(prepareFinalObject(`transferInwards[0].receiptDetails[${cardIndex}].receiptDetailsAddnInfo[0].batchNo`, ''));
                //set received date 
                let receiptDate =
               get(state, "screenConfiguration.preparedFinalObject.transferInwards[0].receiptDate",0) 
               receiptDate = convertDateToEpoch(receiptDate);
                dispatch(prepareFinalObject(`transferInwards[0].receiptDetails[${cardIndex}].receiptDetailsAddnInfo[0].receivedDate`, receiptDate));
                //set total value on Qty Change
                let cardJsonPath =
                "components.div.children.formwizardSecondStep.children.MaterialTransferInwordDetail.children.cardContent.children.MaterialTransferInwordCard.props.items";
                let pagename = `createMaterialTransferInword`;
                let jasonpath =  "transferInwards[0].receiptDetails";
                let InputQtyValue = "userReceivedQty";
                let TotalValue_ = "totalValue";
                let TotalQty ="userReceivedQty"
                let Qty = GetTotalQtyValue(state,cardJsonPath,pagename,jasonpath,InputQtyValue,TotalValue_,TotalQty)
                if(Qty && Qty[0])
                {                
                dispatch(prepareFinalObject(`transferInwards[0].totalvalue`, Qty[0].TotalValue));
                dispatch(prepareFinalObject(`transferInwards[0].totalQty`, Qty[0].TotalQty)); 
                }
              }
            },
            quantityIssued: {
              ...getTextField({
                label: {
                  labelName: "Available Qty",
                  labelKey: "STORE_MATERIAL_INDENT_NOTE_QTY_ISSUED"
                },
                placeholder: {
                  labelName: "Available Qty",
                  labelKey: "STORE_MATERIAL_INDENT_NOTE_QTY_ISSUED"
                },
                props:{
                  disabled:true
                },
                required: false,
                pattern: getPattern("Name") || null,
                jsonPath: "transferInwards[0].receiptDetails[0].quantityIssued"
              })
            },
            userReceivedQty: {
              ...getTextField({
                label: {
                  labelName: "Qty. Accepted",
                  labelKey: "STORE_MATERIAL_RECEIPT_QTY_ACCEPTED"
                },
                placeholder: {
                  labelName: "Enter Qty. Accepted",
                  labelKey: "STORE_MATERIAL_RECEIPT_QTY_ACCEPTED_PLACEHOLDER"
                },
                props:{
                  disabled:true
                },
                required: true,
                errorMessage:"STORE_VALIDATION_USER_RECEIVED_QUANTITY",
                pattern: getPattern("Amount") || null,
                jsonPath: "transferInwards[0].receiptDetails[0].userReceivedQty"
              }),
              beforeFieldChange: (action, state, dispatch) => {
                let cardIndex = action.componentJsonpath.split("items[")[1].split("]")[0];
              let unitRate = get(state.screenConfiguration.preparedFinalObject,`transferInwards[0].receiptDetails[${cardIndex}].unitRate`,0)
             
             let totalValue = unitRate * Number(action.value)
            
             dispatch(prepareFinalObject(`transferInwards[0].receiptDetails[${cardIndex}].totalValue`, totalValue));
             dispatch(prepareFinalObject(`transferInwards[0].receiptDetails[${cardIndex}].acceptedQty`, Number(action.value)));
             dispatch(prepareFinalObject(`transferInwards[0].receiptDetails[${cardIndex}].userAcceptedQty`, Number(action.value)));
             dispatch(prepareFinalObject(`transferInwards[0].receiptDetails[${cardIndex}].isScrapItem`, false));
             // default value not exist in UI
             dispatch(prepareFinalObject(`transferInwards[0].receiptDetails[${cardIndex}].receiptDetailsAddnInfo[0].quantity`, Number(action.value)));
             dispatch(prepareFinalObject(`transferInwards[0].receiptDetails[${cardIndex}].receiptDetailsAddnInfo[0].lotNo`, ''));
             dispatch(prepareFinalObject(`transferInwards[0].receiptDetails[${cardIndex}].receiptDetailsAddnInfo[0].serialNo`, ''));
             dispatch(prepareFinalObject(`transferInwards[0].receiptDetails[${cardIndex}].receiptDetailsAddnInfo[0].expiryDate`, 0));
             dispatch(prepareFinalObject(`transferInwards[0].receiptDetails[${cardIndex}].receiptDetailsAddnInfo[0].batchNo`, ''));
             //set received date 
             let receiptDate =
            get(state, "screenConfiguration.preparedFinalObject.transferInwards[0].receiptDate",0) 
            receiptDate = convertDateToEpoch(receiptDate);
             dispatch(prepareFinalObject(`transferInwards[0].receiptDetails[${cardIndex}].receiptDetailsAddnInfo[0].receivedDate`, receiptDate));


                     }
            },
            UOMName: {
              ...getTextField({
                label: {
                  labelName: "UOM",
                  labelKey: "STORE_MATERIAL_INDENT_NOTE_UOM_NAME"
                },
                placeholder: {
                  labelName: "UOM",
                  labelKey: "STORE_MATERIAL_INDENT_NOTE_UOM_NAME"
                },
                props:{
                  disabled:true
                },
                required: false,
                pattern: getPattern("Name") || null,
                jsonPath: "transferInwards[0].receiptDetails[0].uom.name"
              })
            },
            UnitRate: {
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
                  disabled:true
                },
                required: false,
                pattern: getPattern("Name") || null,
                jsonPath: "transferInwards[0].receiptDetails[0].unitRate"
              })
            },
            TotalValue: {
              ...getTextField({
                label: {
                  labelName: "Total Value",
                  labelKey: "STORE_MATERIAL_INDENT_NOTE_TOTAL_VALUE"
                },
                placeholder: {
                  labelName: "Total Value",
                  labelKey: "STORE_MATERIAL_INDENT_NOTE_TOTAL_VALUE"
                },
                required: false,
                props:{
                  disabled:true
                },
                pattern: getPattern("Name") || null,
                jsonPath: "transferInwards[0].receiptDetails[0].totalValue"
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
                required: true,
                errorMessage:"STORE_VALIDATION_REMARK",
                pattern: getPattern("Name") || null,
                jsonPath: "transferInwards[0].receiptDetails[0].rejectionRemark"
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
      items: [],
      onMultiItemDelete:(state, dispatch)=>{       

      },
      addItemLabel: {
        labelName: "Add ",
        labelKey: "STORE_MATERIAL_COMMON_CARD_ADD"
      },
      headerName: "Material Indent Note",
      headerJsonPath:
        "children.cardContent.children.header.children.head.children.Accessories.props.label",
      sourceJsonPath: "transferInwards[0].receiptDetails",
       //Update Total value when delete any card configuration settings     
     cardtotalpropes:{
      totalIndentQty:false,
      pagename:`createMaterialTransferInword`,
      cardJsonPath:"components.div.children.formwizardSecondStep.children.MaterialTransferInwordDetail.children.cardContent.children.MaterialTransferInwordCard.props.items",     
      jasonpath:"transferInwards[0].receiptDetails",
      InputQtyValue:"userReceivedQty",
      TotalValue:"totalValue",
      TotalQty:"userReceivedQty"  
     },
      prefixSourceJsonPath:
        "children.cardContent.children.materialReceiptCardContainer.children"
    },
    type: "array"
  };
  
  export const  MaterialTransferInwordDetail = getCommonCard({
    header: getCommonTitle(
      {
        labelName: "Material Transfer Inward Details",
        labelKey: "STORE_MATERIAL_TRANSFER_INWARD_DETAILS"
      },
      {
        style: {
          marginBottom: 18
        }
      }
    ),
    MaterialTransferInwordCard
  });