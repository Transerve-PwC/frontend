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
  import { toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";
  import get from "lodash/get";
  import filter from "lodash/filter";
  import {   
    getLocalizationCodeValue,
  
  } from "../../utils";
  import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
  import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
  import { getTenantId } from "egov-ui-kit/utils/localStorageUtils";
  import{getOpeningBalanceSearchResults,GetTotalQtyValue} from '../../../../../ui-utils/storecommonsapi'
  const getBalanceQty = async (action, state, dispatch) => {
    const tenantId = getTenantId();
    const storecode = get(state.screenConfiguration.preparedFinalObject,"materialIssues[0].fromStore.code", '' )
    let queryObject = [
      {
        key: "tenantId",
        value: tenantId,
      },
    ];
    queryObject.push({
      key: "storeName",
      value: storecode
    });
  
      
    try {
      let response = await getOpeningBalanceSearchResults(queryObject, dispatch);
      //let c = response.materialReceipt[0].receiptDetails[0].

      let  materialReceipt = response.materialReceipt
      console.log(materialReceipt[0].receiptDetails[0].userAcceptedQty)
      let matcode = get(state.screenConfiguration.preparedFinalObject,"materialIssues[0].indent.indentDetails[0].materialIssueDetails[0].material.code", '' )
      //alert(materialReceipt[0].receiptDetails[0].material.code +'_'+matcode)
      if (matcode === materialReceipt[0].receiptDetails[0].material.code)
      {
       
        //BalanceQty
        dispatch(prepareFinalObject("materialReceipt[0].receiptDetails[0].indentDetail.BalanceQty",materialReceipt[0].receiptDetails[0].userAcceptedQty));
        //materialReceipt[0].receiptDetails[0].indentDetail.UnitPrice
        dispatch(prepareFinalObject("materialReceipt[0].receiptDetails[0].indentDetail.UnitPrice",materialReceipt[0].receiptDetails[0].unitRate));
      }
      else
      {
        dispatch(prepareFinalObject("materialReceipt[0].receiptDetails[0].indentDetail.indentQuantity",0));
      }
      // materialReceipt = materialReceipt.filter(x=>x.receivingStore.code === storecode)
      // console.log(materialReceipt[0])
      
     
      
    } catch (e) {
      console.log(e);
    }
  };
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
  
  const materialReceiptCard = {
    uiFramework: "custom-containers-local",
    moduleName: "egov-store-asset",
    componentPath: "MultiItem",
    props: {
      scheama: getCommonGrayCard({
        materialReceiptCardContainer: getCommonContainer(
          {
            PONo: {
              ...getSelectField({
                label: {
                  labelName: "PO No",
                  labelKey: "STORE_MATERIAL_RECEIPT_PO_NUMBER"
                },
                placeholder: {
                  labelName: "Select PO No",
                  labelKey: "STORE_MATERIAL_RECEIPT_PO_NUMBER_SELECT"
                },
                required: true,               
                jsonPath: "materialReceipt[0].receiptDetails[0].purchaseOrderDetail.purchaseOrderNumber",
                sourceJsonPath: "purchaseOrder.purchaseOrders",
                props: {
                  optionValue: "purchaseOrderNumber",
                  optionLabel: "purchaseOrderNumber",
                  // optionValue: "id",
                  // optionLabel: "id",
                },
              }),
              beforeFieldChange: (action, state, dispatch) => {
                let cardIndex = action.componentJsonpath.split("items[")[1].split("]")[0];
                let purchaseOrder = get(
                  state.screenConfiguration.preparedFinalObject,
                  `purchaseOrder.purchaseOrders`,
                  []
                ); 
                purchaseOrder =  purchaseOrder.filter(x=> x.purchaseOrderNumber === action.value) 
                //if(purchaseOrder && purchaseOrder[0])  
                //dispatch(prepareFinalObject("materialReceipt[0].receiptDetails[0].purchaseOrderDetail.name",purchaseOrder[0].purchaseOrderNumber));
                //set material dropdown based on po selection
                let material=[];
                let purchaseOrderDetails =get(
                  purchaseOrder[0],
                  `purchaseOrderDetails`,
                  []
                );
                for (let index = 0; index < purchaseOrderDetails.length; index++) {
                  const element = purchaseOrderDetails[index];
                  const mrnNumber = getQueryArg(window.location.href, "mrnNumber");
                  if(mrnNumber)
                  {
                    material.push( element.material)

                  }
                  else{
                    if((element.orderQuantity-element.receivedQuantity)>0)
                    {
                      material.push( element.material)
                    }

                  }
                 
                
                  //material.push( purchaseOrderDetails:element.id)
                  
                }
                // set
               // alert(purchaseOrderDetails[0].id);
               if(purchaseOrderDetails && purchaseOrderDetails[0])
               {
                dispatch(prepareFinalObject(`materialReceipt[0].receiptDetails[${cardIndex}].purchaseOrderDetail.id`,purchaseOrderDetails[0].id));
                if(material.length>0)
                dispatch(prepareFinalObject("ReceiptMaterial",material));
                else
                {
                  let LocalizationCodeValue = getLocalizationCodeValue("STORE_MATERIAL_NOT_EXIST_PO")
                  const errorMessage = {
                    labelName: "Material Receipt completed for selected PO Number",
                    labelKey:   LocalizationCodeValue+' '+action.value
                  };
                  dispatch(toggleSnackbar(true, errorMessage, "warning"));
                }
                dispatch(prepareFinalObject(`materialReceipt[0].receiptDetails[${cardIndex}].uom.code`,purchaseOrderDetails[0].uom.code));
                dispatch(prepareFinalObject(`materialReceipt[0].receiptDetails[${cardIndex}].uom.name`,purchaseOrderDetails[0].uom.name));
                //set AvailableQty from  po purchaseOrderDetails 0 index receivedQuantity,orderQuantity,unitPrice(unitRate)
                //
                dispatch(prepareFinalObject(`materialReceipt[0].receiptDetails[${cardIndex}].AvailableQty`,purchaseOrderDetails[0].receivedQuantity));
                dispatch(prepareFinalObject(`materialReceipt[0].receiptDetails[${cardIndex}].orderQuantity`,purchaseOrderDetails[0].orderQuantity));
                dispatch(prepareFinalObject(`materialReceipt[0].receiptDetails[${cardIndex}].unitRate`,purchaseOrderDetails[0].unitPrice));
                dispatch(prepareFinalObject(`materialReceipt[0].receiptDetails[${cardIndex}].receivedQty`,purchaseOrderDetails[0].orderQuantity));
                dispatch(prepareFinalObject(`materialReceipt[0].receiptDetails[${cardIndex}].acceptedQty`,purchaseOrderDetails[0].orderQuantity));
                dispatch(prepareFinalObject(`materialReceipt[0].receiptDetails[${cardIndex}].totalAcceptedvalue`,purchaseOrderDetails[0].orderQuantity * purchaseOrderDetails[0].unitPrice));

                 //set total value on Qty Change
                 let cardJsonPath =
                 "components.div.children.formwizardSecondStep.children.materialReceiptDetail.children.cardContent.children.materialReceiptCard.props.items";
                let pagename = `createMaterialReceiptNote`;
                let jasonpath =  "materialReceipt[0].receiptDetails";
                let InputQtyValue = "indentQuantity";
                let TotalValue_ = "totalAcceptedvalue";
                let TotalQty ="acceptedQty"
                let Qty = GetTotalQtyValue(state,cardJsonPath,pagename,jasonpath,InputQtyValue,TotalValue_,TotalQty)
                if(Qty && Qty[0])
                {                
                 dispatch(prepareFinalObject(`materialReceipt[0].totalvalue`, Qty[0].TotalValue));
                 dispatch(prepareFinalObject(`materialReceipt[0].totalQty`, Qty[0].TotalQty)); 
                }

              }
            }

            },
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
                required: true,               
                jsonPath: "materialReceipt[0].receiptDetails[0].material.code",
                //sourceJsonPath: "createScreenMdmsData.store-asset.Material",
                sourceJsonPath:"ReceiptMaterial",
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
                  `ReceiptMaterial`,
                  []
                ); 
                materials =  materials.filter(x=> x.code === action.value)   
                if(materials && materials[0])
                {
                dispatch(prepareFinalObject(`materialReceipt[0].receiptDetails[${cardIndex}].material.name`,materials[0].name));
                dispatch(prepareFinalObject(`materialReceipt[0].receiptDetails[${cardIndex}].MaterialNameDesc`,materials[0].description));
                //dispatch(prepareFinalObject("materialReceipt[0].receiptDetails[0].uom.code",materials[0].baseUom.code));
               // dispatch(prepareFinalObject("materialReceipt[0].receiptDetails[0].uom.name",materials[0].name));
                }

              }

            },
            MaterialNameDesc: {
              ...getTextField({
                label: {
                  labelName: "Material Description",
                  labelKey: "STORE_MATERIAL_DESCRIPTION"
                },
                placeholder: {
                  labelName: "Material Description",
                  labelKey: "STORE_MATERIAL_DESCRIPTION"
                },
                props:{
                  disabled:true
                },
                required: false,
                pattern: getPattern("Name") || null,
                jsonPath: "materialReceipt[0].receiptDetails[0].MaterialNameDesc"
              })
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
                jsonPath: "materialReceipt[0].receiptDetails[0].uom.code"
              })
            },
            AvailableQty: {
              ...getTextField({
                label: {
                  labelName: "Available Qty",
                  labelKey: "STORE_MATERIAL_RECEIPT_AVAILABLE_QTY"
                },
                placeholder: {
                  labelName: "Available Qty",
                  labelKey: "STORE_MATERIAL_RECEIPT_AVAILABLE_QTY_PLACEHOLDER"
                },
                props:{
                  disabled:true
                },
                required: false,
                visible:false,
                pattern: getPattern("Name") || null,
                jsonPath: "materialReceipt[0].receiptDetails[0].AvailableQty"
              })
            },
            orderQuantity: {
              ...getTextField({
                label: {
                  labelName: "Ordered Qty",
                  labelKey: "STORE_MATERIAL_RECEIPT_ORDERED_QTY"
                },
                placeholder: {
                  labelName: "Ordered Qty",
                  labelKey: "STORE_MATERIAL_RECEIPT_ORDERED_QTY_PLACEHOLDER"
                },
                props:{
                  disabled:true
                },
                required: false,
                pattern: getPattern("Name") || null,
                jsonPath: "materialReceipt[0].receiptDetails[0].orderQuantity"
              })
            },
            qtyasperChallan: {
              ...getTextField({
                label: {
                  labelName: "Qty. as per Challan",
                  labelKey: "STORE_MATERIAL_RECEIPT_QTY_AS_PER_CHALLAN"
                },
                placeholder: {
                  labelName: "Qty. as per Challan",
                  labelKey: "STORE_MATERIAL_RECEIPT_QTY_AS_PER_CHALLAN_PLACEHOLDER"
                },
                props:{
                  disabled:false
                },
                required: false,
                visible:false,
                pattern: getPattern("Amount") || null,
                jsonPath: "materialReceipt[0].receiptDetails[0].qtyasperChallan"
              }),
              beforeFieldChange: (action, state, dispatch) => {
                  }
            },
            rateperunit: {
              ...getTextField({
                label: {
                  labelName: "Qty Rate per unit",
                  labelKey: "STORE_MATERIAL_RECEIPT_RATE_PER_UNIT"
                },
                placeholder: {
                  labelName: "Enter Rate per unit",
                  labelKey: "STORE_MATERIAL_RECEIPT_RATE_PER_UNIT_PLACEHOLDER"
                },
                props:{
                  disabled:false
                },
                required: false,
                visible:false,
                pattern: getPattern("Amount") || null,
                jsonPath: "materialReceipt[0].receiptDetails[0].rateperunit"
              }),
              beforeFieldChange: (action, state, dispatch) => {
                 }
            },
            QtyReceived: {
              ...getTextField({
                label: {
                  labelName: "Qty. Received",
                  labelKey: "STORE_MATERIAL_RECEIPT_QTY_RECEIVED"
                },
                placeholder: {
                  labelName: "Enter Qty. Received",
                  labelKey: "STORE_MATERIAL_RECEIPT_QTY_RECEIVED_PLACEHOLDER"
                },
                props:{
                  disabled:false
                },
                required: true,
                pattern: getPattern("Amount") || null,
                jsonPath: "materialReceipt[0].receiptDetails[0].receivedQty"
              }),
              beforeFieldChange: (action, state, dispatch) => {
                     }
            },
            QtyAccepted: {
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
                  disabled:false
                },
                required: true,
                pattern: getPattern("Amount") || null,
                jsonPath: "materialReceipt[0].receiptDetails[0].acceptedQty"
              }),
              beforeFieldChange: (action, state, dispatch) => {
                let cardIndex = action.componentJsonpath.split("items[")[1].split("]")[0];
                let receivedQty =   get(state.screenConfiguration.preparedFinalObject,`materialReceipt[0].receiptDetails[${cardIndex}].receivedQty`,0)
                let unitRate =   get(state.screenConfiguration.preparedFinalObject,`materialReceipt[0].receiptDetails[${cardIndex}].unitRate`,0)
                let QtyRejected = Number(receivedQty) - Number(action.value)
                let totalAcceptedvalue = unitRate * Number(action.value)
                dispatch(prepareFinalObject(`materialReceipt[0].receiptDetails[${cardIndex}].qtyRejected`,QtyRejected));
                dispatch(prepareFinalObject(`materialReceipt[0].receiptDetails[${cardIndex}].acceptedQty`,Number(action.value)));
                dispatch(prepareFinalObject(`materialReceipt[0].receiptDetails[${cardIndex}].receiptDetailsAddnInfo[0].quantity`,Number(action.value)));
                dispatch(prepareFinalObject(`materialReceipt[0].receiptDetails[${cardIndex}].userReceivedQty`,receivedQty));
                dispatch(prepareFinalObject(`materialReceipt[0].receiptDetails[${cardIndex}].isScrapItem`,false));
                dispatch(prepareFinalObject(`materialReceipt[0].receiptDetails[${cardIndex}].totalAcceptedvalue`,totalAcceptedvalue));
                 //set total value on Qty Change
                 let cardJsonPath =
                 "components.div.children.formwizardSecondStep.children.materialReceiptDetail.children.cardContent.children.materialReceiptCard.props.items";
                let pagename = `createMaterialReceiptNote`;
                let jasonpath =  "materialReceipt[0].receiptDetails";
                let InputQtyValue = "indentQuantity";
                let TotalValue_ = "totalAcceptedvalue";
                let TotalQty ="acceptedQty"
                let Qty = GetTotalQtyValue(state,cardJsonPath,pagename,jasonpath,InputQtyValue,TotalValue_,TotalQty)
                if(Qty && Qty[0])
                {                
                 dispatch(prepareFinalObject(`materialReceipt[0].totalvalue`, Qty[0].TotalValue));
                 dispatch(prepareFinalObject(`materialReceipt[0].totalQty`, Qty[0].TotalQty)); 
                }
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
                  disabled:true
                },
                required: false,
                pattern: getPattern("Name") || null,
                jsonPath: "materialReceipt[0].receiptDetails[0].unitRate"
              })
            },
            TotalPrice: {
              ...getTextField({
                label: {
                  labelName: "Total Price",
                  labelKey: "STORE_MATERIAL_RECEIPT_TOTAL_PRICE"
                },
                placeholder: {
                  labelName: "Enter Total Price",
                  labelKey: "STORE_MATERIAL_RECEIPT_TOTAL_PRICE_PLACEHOLDER"
                },
                props:{
                  disabled:true
                },
                required: true,
                pattern: getPattern("Amount") || null,
                jsonPath: "materialReceipt[0].receiptDetails[0].totalAcceptedvalue"
              }),
              beforeFieldChange: (action, state, dispatch) => {
                  }
            }, 
            qtyRejected: {
              ...getTextField({
                label: {
                  labelName: "Qty. Rejected",
                  labelKey: "STORE_MATERIAL_RECEIPT_QTY_REJECTED"
                },
                placeholder: {
                  labelName: "Qty. Rejected",
                  labelKey: "STORE_MATERIAL_RECEIPT_QTY_REJECTED_PLACEHOLDER"
                },
                props:{
                  disabled:true
                },
                required: false,
                visible:false,
                pattern: getPattern("Name") || null,
                jsonPath: "materialReceipt[0].receiptDetails[0].qtyRejected"
              })
            },
            Rejectionremarks: {
              ...getTextField({
                label: {
                  labelName: "Rejection remarks",
                  labelKey: "STORE_MATERIAL_RECEIPT_REJECTION_REMARKS"
                },
                placeholder: {
                  labelName: "Enter Rejection remarks",
                  labelKey: "STORE_MATERIAL_RECEIPT_REJECTION_REMARKS_PLACEHOLDER"
                },
                props: {
                  className: "applicant-details-error",
                  multiline: "multiline",
                  rowsMax: 2,
                },
                required: false,
                pattern: getPattern("eventDescription") || null,
                jsonPath: "materialReceipt[0].receiptDetails[0].rejectionRemark"
              })
            },
            ValueofQtyaccepted: {  
              ...getTextField({
                label: {
                  labelName: "Value of Qty. accepted",
                  labelKey: "STORE_MATERIAL_RECEIPT_VALUE_OF_QTY_ACCEPTED"
                },
                placeholder: {
                  labelName: "Enter Value of Qty. accepted",
                  labelKey: "STORE_MATERIAL_RECEIPT_VALUE_OF_QTY_ACCEPTED_PLACEHOLDER"
                },
                props:{
                  disabled:true
                },
                required: true,
                visible:false,
                pattern: getPattern("Amount") || null,
                jsonPath: "materialReceipt[0].receiptDetails[0].ValueofQtyaccepted"
              }),
              beforeFieldChange: (action, state, dispatch) => {
                let cardIndex = action.componentJsonpath.split("items[")[1].split("]")[0];
                let acceptedQty =   get(state.screenConfiguration.preparedFinalObject,`materialReceipt[0].receiptDetails[${cardIndex}].acceptedQty`,0)
                let unitRate = get(state.screenConfiguration.preparedFinalObject,`materialReceipt[0].receiptDetails[${cardIndex}].unitRate`,0)
                let ValueofQtyaccepted = Number(acceptedQty) * Number(unitRate)
                dispatch(prepareFinalObject(`materialIssues[0].materialIssueDetails[${cardIndex}].ValueofQtyaccepted`,Number(ValueofQtyaccepted)));

                     }
            },
            lotNo: {
              ...getTextField({
                label: {
                  labelName: "LOT No",
                  labelKey: "STORE_MATERIAL_RECEIPT_LOT_NO"
                },
                placeholder: {
                  labelName: "Enter LOT No",
                  labelKey: "STORE_MATERIAL_RECEIPT_LOT_NO_PLACEHOLDER"
                },
                props:{
                  disabled:false
                },
                required: true,
                pattern: getPattern("Name") || null,
                //jsonPath: "materialReceipt[0].receiptDetails[0].receiptDetailsAddnInfo[0].lotNo"
                jsonPath: "materialReceipt[0].receiptDetails[0].lotNo"
              }),
              beforeFieldChange: (action, state, dispatch) => {
                     }
            },
            serialNo: {
              ...getTextField({
                label: {
                  labelName: "Serial No.",
                  labelKey: "STORE_MATERIAL_RECEIPT_SERIAL_NO"
                },
                placeholder: {
                  labelName: "Enter Serial No.",
                  labelKey: "STORE_MATERIAL_RECEIPT_SERIAL_NO_PLACEHOLDER"
                },
                props:{
                  disabled:false
                },
                required: true,
                pattern: getPattern("Name") || null,
                //jsonPath: "materialReceipt[0].receiptDetails[0].receiptDetailsAddnInfo[0].serialNo"
                jsonPath: "materialReceipt[0].receiptDetails[0].serialNo"
              }),
              beforeFieldChange: (action, state, dispatch) => {
                     }
            },
            batchNo: {
              ...getTextField({
                label: {
                  labelName: "Batch No.",
                  labelKey: "STORE_MATERIAL_RECEIPT_BATCH_NO"
                },
                placeholder: {
                  labelName: "Enter Batch No.",
                  labelKey: "STORE_MATERIAL_RECEIPT_BATCH_NO_PLACEHOLDER"
                },
                props:{
                  disabled:false
                },
                required: true,
                pattern: getPattern("Name") || null,
                //jsonPath: "materialReceipt[0].receiptDetails[0].receiptDetailsAddnInfo[0].batchNo"
                jsonPath: "materialReceipt[0].receiptDetails[0].batchNo"
              }),
              beforeFieldChange: (action, state, dispatch) => {
                     }
            },
            ManufacturerDate : {
              ...getDateField({
                label: {
                  labelName: "Manufacturer Date",
                  labelKey: "STORE_MATERIAL_RECEIPT_MANUFACTURER_DATE"
                },
                placeholder: {
                  labelName: "Enter Manufacturer Date",
                  labelKey: "STORE_MATERIAL_RECEIPT_MANUFACTURER_DATE_PLACEHOLDER"
                },
                required: true,
                props: {
                  inputProps: {
                    max: new Date().toISOString().slice(0, 10),
                  }
                },
                pattern: getPattern("Date") || null,
               // jsonPath: "materialReceipt[0].receiptDetails[0].receiptDetailsAddnInfo[0].manufactureDate"
                jsonPath: "materialReceipt[0].receiptDetails[0].manufactureDate"
              })
            },
            expiryDate : {
              ...getDateField({
                label: {
                  labelName: "Expiry Date",
                  labelKey: "STORE_MATERIAL_RECEIPT_EXPIRY_DATE"
                },
                placeholder: {
                  labelName: "Enter Expiry Date",
                  labelKey: "STORE_MATERIAL_RECEIPT_EXPIRY_DATE_PLACEHOLDER"
                },
                required: true,
                props: {
                  inputProps: {
                    min: new Date().toISOString().slice(0, 10),
                  }
                },
                pattern: getPattern("Date") || null,
               // jsonPath: "materialReceipt[0].receiptDetails[0].receiptDetailsAddnInfo[0].expiryDate"
                jsonPath: "materialReceipt[0].receiptDetails[0].expiryDate"
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
      sourceJsonPath: "materialReceipt[0].receiptDetails",
      //Update Total value when delete any card configuration settings     
      cardtotalpropes:{
        totalIndentQty:false,
        pagename:`createMaterialReceiptNote`,
        cardJsonPath:"components.div.children.formwizardSecondStep.children.materialReceiptDetail.children.cardContent.children.materialReceiptCard.props.items",
        jasonpath:"materialReceipt[0].receiptDetails",
        InputQtyValue:"indentQuantity",
        TotalValue:"totalAcceptedvalue",
        TotalQty:"acceptedQty"
      },
      prefixSourceJsonPath:
        "children.cardContent.children.materialReceiptCardContainer.children"
    },
    type: "array"
  };
  
  export const materialReceiptDetail = getCommonCard({
    header: getCommonTitle(
      {
        labelName: "Material Receipt Details",
        labelKey: "STORE_MATERIAL_RECEIPT_MATERIAL_RECEIPT_DETAILS"
      },
      {
        style: {
          marginBottom: 18
        }
      }
    ),
    materialReceiptCard
  });