import {
    getCommonCard,
    getCommonGrayCard,
    getCommonTitle,
    getSelectField,
    getTextField,
    getPattern,
    getCommonContainer
  } from "egov-ui-framework/ui-config/screens/specs/utils";
  import get from "lodash/get";
  import filter from "lodash/filter";
  import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
  import { getTenantId } from "egov-ui-kit/utils/localStorageUtils";
  import{getOpeningBalanceSearchResults} from '../../../../../ui-utils/storecommonsapi'
  import{getmaterialissuesSearchResults,GetMdmsNameBycode,GetTotalQtyValue} from '../../../../../ui-utils/storecommonsapi'
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
      // if (matcode === materialReceipt[0].receiptDetails[0].material.code)
      // {
       
        //BalanceQty
        dispatch(prepareFinalObject("materialIssues[0].materialIssueDetails[0].indentDetail.BalanceQty",materialReceipt[0].receiptDetails[0].userAcceptedQty));
        //materialIssues[0].materialIssueDetails[0].indentDetail.UnitPrice
        dispatch(prepareFinalObject("materialIssues[0].materialIssueDetails[0].indentDetail.UnitPrice",materialReceipt[0].receiptDetails[0].unitRate));
      // }
      // else
      // {
      //   dispatch(prepareFinalObject("materialIssues[0].materialIssueDetails[0].indentDetail.indentQuantity",0));
      // }
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
  
  const materialIssueCard = {
    uiFramework: "custom-containers-local",
    moduleName: "egov-store-asset",
    componentPath: "MultiItem",
    props: {
      scheama: getCommonGrayCard({
        materialIssueCardContainer: getCommonContainer(
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
                required: true,               
                jsonPath: "materialIssues[0].materialIssueDetails[0].receiptId",
                //sourceJsonPath: "materials",
                sourceJsonPath: "indentsmaterial",
                props: {
                  optionValue: "receiptId",
                  optionLabel: "materialName",
                  // optionValue: "id",
                  // optionLabel: "id",
                },
              }),
              beforeFieldChange: (action, state, dispatch) => {
                let Material = get(
                  state.screenConfiguration.preparedFinalObject,
                  `indentsmaterial`,
                  []
                );               
                Material =  Material.filter(x=> x.receiptId === action.value)               
                let indentDetails = get(
                  state.screenConfiguration.preparedFinalObject,
                  `materialIssues[0].indent.indentDetails`,
                  []
                ); 
               
                indentDetails = indentDetails.filter(x=> x.material.code === Material[0].materialCode)
                let cardIndex = action.componentJsonpath.split("items[")[1].split("]")[0];
                if(Material && Material[0])
                {
                // dispatch(prepareFinalObject("materialIssues[0].indent.indentDetails[0].materialIssueDetails[0].material.id",Material[0].id));
                // dispatch(prepareFinalObject("materialIssues[0].indent.indentDetails[0].materialIssueDetails[0].material.tenantId",getTenantId()));
                // dispatch(prepareFinalObject("materialIssues[0].indent.indentDetails[0].materialIssueDetails[0].material.name",Material[0].name));
                // dispatch(prepareFinalObject("materialIssues[0].indent.indentDetails[0].materialIssueDetails[0].material.description",Material[0].description));
                // dispatch(prepareFinalObject("materialIssues[0].indent.indentDetails[0].materialIssueDetails[0].material.reorderLevel",Material[0].reorderLevel));
                // dispatch(prepareFinalObject("materialIssues[0].indent.indentDetails[0].materialIssueDetails[0].material.materialType.id",Material[0].materialType.id));
                // dispatch(prepareFinalObject("materialIssues[0].indent.indentDetails[0].materialIssueDetails[0].material.materialType.name",Material[0].materialType.name));
                // dispatch(prepareFinalObject("materialIssues[0].indent.indentDetails[0].materialIssueDetails[0].material.baseUom",Material[0].baseUom));
                // dispatch(prepareFinalObject("materialIssues[0].indent.indentDetails[0].materialIssueDetails[0].material.minQuantity",Material[0].minQuantity));
                // dispatch(prepareFinalObject("materialIssues[0].indent.indentDetails[0].materialIssueDetails[0].material.stockingUom",Material[0].stockingUom));
                // dispatch(prepareFinalObject("materialIssues[0].indent.indentDetails[0].materialIssueDetails[0].material.purchaseUom",Material[0].purchaseUom));
                // dispatch(prepareFinalObject("materialIssues[0].indent.indentDetails[0].materialIssueDetails[0].material.inventoryType",Material[0].inventoryType));
                // dispatch(prepareFinalObject("materialIssues[0].indent.indentDetails[0].materialIssueDetails[0].material.materialClass",Material[0].materialClass));
                // dispatch(prepareFinalObject("materialIssues[0].indent.indentDetails[0].materialIssueDetails[0].material.maxQuantity",Material[0].maxQuantity));
                // dispatch(prepareFinalObject("materialIssues[0].indent.indentDetails[0].materialIssueDetails[0].material.reorderQuantity",Material[0].reorderQuantity));                
                dispatch(prepareFinalObject(`materialIssues[0].indent.indentDetails[0].materialIssueDetails[${cardIndex}].material`,Material[0]));
               // dispatch(prepareFinalObject(`materialIssues[0].materialIssueDetails[${cardIndex}].indentDetail.material.name`,Material[0].materialCode));
               // dispatch(prepareFinalObject(`materialIssues[0].materialIssueDetails[${cardIndex}].indentDetail.material.code`,Material[0].code));
                
               
                dispatch(prepareFinalObject(`materialIssues[0].indent.indentDetails[0].materialIssueDetails[${cardIndex}].uom`,indentDetails[0].uom));
                dispatch(prepareFinalObject(`materialIssues[0].indent.indentDetails[0].materialIssueDetails[${cardIndex}].indentDetail.uom`,indentDetails[0].uom));
                // get set  from openning balence
                //getBalanceQty(action,state,dispatch)


                let indentsmaterial = get(
                  state.screenConfiguration.preparedFinalObject,
                  `indentsmaterial`,
                  []
                ); 
                indentsmaterial = indentsmaterial.filter(x=>x.receiptId === action.value)
                dispatch(prepareFinalObject(`materialIssues[0].materialIssueDetails[${cardIndex}].tenantId`,getTenantId()));
                dispatch(prepareFinalObject(`materialIssues[0].materialIssueDetails[${cardIndex}].receiptDetailId`,indentsmaterial[0].receiptDetailId));
                dispatch(prepareFinalObject(`materialIssues[0].materialIssueDetails[${cardIndex}].receiptId`,indentsmaterial[0].receiptId));
                dispatch(prepareFinalObject(`materialIssues[0].materialIssueDetails[${cardIndex}].mrnNumber`,indentsmaterial[0].mrnNumber));
                //dispatch(prepareFinalObject(`materialIssues[0].materialIssueDetails[${cardIndex}].material`,Material[0])); 
                // pass only material code as per discussion 
                dispatch(prepareFinalObject(`materialIssues[0].materialIssueDetails[${cardIndex}].material.code`,Material[0].materialCode)); 
                dispatch(prepareFinalObject(`materialIssues[0].materialIssueDetails[${cardIndex}].uom.code`,indentDetails[0].uom.code));              
                let uomname = GetMdmsNameBycode(state, dispatch,"createScreenMdmsData.common-masters.UOM",indentDetails[0].uom.code) 
                dispatch(prepareFinalObject(`materialIssues[0].materialIssueDetails[${cardIndex}].uom.name`,uomname));              
                dispatch(prepareFinalObject(`materialIssues[0].materialIssueDetails[${cardIndex}].indentDetail.material.code`,indentsmaterial[0].materialCode));                
                let matname = GetMdmsNameBycode(state, dispatch,"createScreenMdmsData.store-asset.Material",indentsmaterial[0].materialCode) 
                dispatch(prepareFinalObject(`materialIssues[0].materialIssueDetails[${cardIndex}].material.name`,matname));                
                dispatch(prepareFinalObject(`materialIssues[0].materialIssueDetails[${cardIndex}].indentDetail.uom.code`,indentsmaterial[0].uomCode));                
                dispatch(prepareFinalObject(`materialIssues[0].materialIssueDetails[${cardIndex}].indentDetail.balanceQty`,indentsmaterial[0].balance));
                dispatch(prepareFinalObject(`materialIssues[0].materialIssueDetails[${cardIndex}].indentDetail.unitRate`,indentsmaterial[0].unitRate));
                //set indent qty indentDetails
                dispatch(prepareFinalObject(`materialIssues[0].materialIssueDetails[${cardIndex}].indentDetail.indentQuantity`,indentDetails[0].indentQuantity));
              //set total value on Qty Change
              let cardJsonPath =
              "components.div.children.formwizardSecondStep.children.materialIssue.children.cardContent.children.materialIssueCard.props.items";
              let pagename = `createMaterialIndentNote`;
              let jasonpath =  "materialIssues[0].materialIssueDetails";
              let InputQtyValue = "indentDetail.indentQuantity";
              let TotalValue_ = "indentDetail.TotalValue";
              let TotalQty ="indentDetail.userQuantity"
              let Qty = GetTotalQtyValue(state,cardJsonPath,pagename,jasonpath,InputQtyValue,TotalValue_,TotalQty)
              if(Qty && Qty[0])
              {
              dispatch(prepareFinalObject(`materialIssues[0].totalIndentQty`, Qty[0].InputQtyValue));
              dispatch(prepareFinalObject(`materialIssues[0].totalvalue`, Qty[0].TotalValue));
              dispatch(prepareFinalObject(`materialIssues[0].totalQty`, Qty[0].TotalQty));

              }
                
              }

              }

            },
            indentQuantity: {
              ...getTextField({
                label: {
                  labelName: "Total Indent Qty Required",
                  labelKey: "STORE_MATERIAL_INDENT_NOTE_TOTAL_INDENT_QTY_REQUIRED"
                },
                placeholder: {
                  labelName: "Total Indent Qty Required",
                  labelKey: "STORE_MATERIAL_INDENT_NOTE_TOTAL_INDENT_QTY_REQUIRED"
                },
                props:{
                  disabled:true
                },
                required: false,
                pattern: getPattern("Amount") || null,
                jsonPath: "materialIssues[0].materialIssueDetails[0].indentDetail.indentQuantity"
              })
            },
            balanceQty: {
              ...getTextField({
                label: {
                  labelName: "Balance Qty",
                  labelKey: "STORE_MATERIAL_INDENT_NOTE_BALANCE_QTY"
                },
                placeholder: {
                  labelName: "Balance Qty",
                  labelKey: "STORE_MATERIAL_INDENT_NOTE_BALANCE_QTY"
                },
                props:{
                  disabled:true
                },
                required: false,
                pattern: getPattern("Amount") || null,
                jsonPath: "materialIssues[0].materialIssueDetails[0].indentDetail.balanceQty"
              })
            },
            QtyIssued: {
              ...getTextField({
                label: {
                  labelName: "Qty Issued",
                  labelKey: "STORE_MATERIAL_INDENT_NOTE_QTY_ISSUED"
                },
                placeholder: {
                  labelName: "Enter Qty Issued",
                  labelKey: "STORE_MATERIAL_INDENT_NOTE_QTY_ISSUED_PLACEHOLDER"
                },
                props:{
                  disabled:false,
                  nin:1,
                },
                required: true,
                pattern: getPattern("Amount") || null,
                jsonPath: "materialIssues[0].materialIssueDetails[0].indentDetail.userQuantity"
              }),
              beforeFieldChange: (action, state, dispatch) => {
                //alert(action.value)
                // set total Qty and other Qty
                //materialIssues[0].materialIssueDetails[0].indentDetail.UnitPrice
                let cardIndex = action.componentJsonpath.split("items[")[1].split("]")[0];
                let UnitPrice = get(state.screenConfiguration.preparedFinalObject,`materialIssues[0].materialIssueDetails[${cardIndex}].indentDetail.unitRate`,0)
                let BalanceQty = get(state.screenConfiguration.preparedFinalObject,`materialIssues[0].materialIssueDetails[${cardIndex}].indentDetail.balanceQty`,0)
               
                let BalanceQtyAfterIssue = BalanceQty - Number(action.value)
                let TotalValue = Number(UnitPrice)* Number(action.value)
                let pendingIndentQuantity = 0
                let indentQty = get(state.screenConfiguration.preparedFinalObject,`materialIssues[0].materialIssueDetails[${cardIndex}].indentDetail.indentQuantity`,0)
                pendingIndentQuantity = indentQty- Number(action.value)
                dispatch(prepareFinalObject(`materialIssues[0].materialIssueDetails[${cardIndex}].userQuantityIssued`,Number(action.value)));
                dispatch(prepareFinalObject(`materialIssues[0].materialIssueDetails[${cardIndex}].indentDetail.userQuantity`,Number(action.value)));
                // calculation after input qty
                dispatch(prepareFinalObject(`materialIssues[0].materialIssueDetails[${cardIndex}].indentDetail.BalanceQtyAfterIssue`,BalanceQtyAfterIssue));
                dispatch(prepareFinalObject(`materialIssues[0].materialIssueDetails[${cardIndex}].indentDetail.TotalValue`,TotalValue)); 
                dispatch(prepareFinalObject(`materialIssues[0].materialIssueDetails[${cardIndex}].pendingIndentQuantity`,pendingIndentQuantity));
                dispatch(prepareFinalObject(`materialIssues[0].materialIssueDetails[${cardIndex}].indentDetail.indentIssuedQuantity`,Number(action.value)));
                //indentIssuedQuantity

                //set total value on Qty Change
                let cardJsonPath =
                "components.div.children.formwizardSecondStep.children.materialIssue.children.cardContent.children.materialIssueCard.props.items";
               let pagename = `createMaterialIndentNote`;
               let jasonpath =  "materialIssues[0].materialIssueDetails";
               let InputQtyValue = "indentDetail.indentQuantity";
               let TotalValue_ = "indentDetail.TotalValue";
               let TotalQty ="indentDetail.userQuantity"
               let Qty = GetTotalQtyValue(state,cardJsonPath,pagename,jasonpath,InputQtyValue,TotalValue_,TotalQty)
               if(Qty && Qty[0])
               {
                dispatch(prepareFinalObject(`materialIssues[0].totalIndentQty`, Qty[0].InputQtyValue));
                dispatch(prepareFinalObject(`materialIssues[0].totalvalue`, Qty[0].TotalValue));
                dispatch(prepareFinalObject(`materialIssues[0].totalQty`, Qty[0].TotalQty));

               }
              }
            },
            uomCode: {
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
                jsonPath: "materialIssues[0].materialIssueDetails[0].uom.code"
              })
            },
            unitRate: {
              ...getTextField({
                label: {
                  labelName: "Unit Price",
                  labelKey: "STORE_MATERIAL_INDENT_NOTE_UNIT_PRICE"
                },
                placeholder: {
                  labelName: "Unit Price",
                  labelKey: "STORE_MATERIAL_INDENT_NOTE_UNIT_PRICE"
                },
                props:{
                  disabled:true
                },
                required: false,
                pattern: getPattern("Name") || null,
                jsonPath: "materialIssues[0].materialIssueDetails[0].indentDetail.unitRate"
              })
            },
            BalanceQtyAfterIssue: {
              ...getTextField({
                label: {
                  labelName: "Balance Qty After Issue",
                  labelKey: "STORE_MATERIAL_INDENT_NOTE_QTY_BALANCE_QTY_AFTER_ISSUE"
                },
                placeholder: {
                  labelName: "Balance Qty After Issue",
                  labelKey: "STORE_MATERIAL_INDENT_NOTE_QTY_BALANCE_QTY_AFTER_ISSUE"
                },
                props:{
                  disabled:true
                },
                required: false,
                pattern: getPattern("Name") || null,
                jsonPath: "materialIssues[0].materialIssueDetails[0].indentDetail.BalanceQtyAfterIssue"
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
                jsonPath: "materialIssues[0].materialIssueDetails[0].indentDetail.TotalValue"
              })
            },
            AssestCode: {
              ...getTextField({
                label: {
                  labelName: "Assest Code",
                  labelKey: "STORE_MATERIAL_INDENT_NOTE_ASSEST_CODE"
                },
                placeholder: {
                  labelName: "Assest Code",
                  labelKey: "STORE_MATERIAL_INDENT_NOTE_ASSEST_CODE"
                },
                props:{
                  disabled:true
                },
                required: false,
                pattern: getPattern("Name") || null,
                jsonPath: "materialIssues[0].materialIssueDetails[0].assestCode"
              })
            },
            ProjectCode: {
              ...getTextField({
                label: {
                  labelName: "Project Code",
                  labelKey: "STORE_MATERIAL_INDENT_NOTE_PROJECT_CODE"
                },
                placeholder: {
                  labelName: "Project Code",
                  labelKey: "STORE_MATERIAL_INDENT_NOTE_PROJECT_CODE"
                },
                props:{
                  disabled:true
                },
                required: false,
                pattern: getPattern("Name") || null,
                jsonPath: "materialIssues[0].materialIssueDetails[0].projectCode"
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
                pattern: getPattern("Name") || null,
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
      sourceJsonPath: "materialIssues[0].materialIssueDetails",
       //Update Total value when delete any card configuration settings     
       cardtotalpropes:{
        totalIndentQty:false,
        pagename:`createMaterialIndentNote`,
        cardJsonPath:"components.div.children.formwizardSecondStep.children.materialIssue.children.cardContent.children.materialIssueCard.props.items",
        jasonpath:"materialIssues[0].materialIssueDetails",
        InputQtyValue:"indentDetail.indentQuantity",
        TotalValue:"indentDetail.TotalValue",
        TotalQty:"indentDetail.userQuantity"
      },
      prefixSourceJsonPath:
        "children.cardContent.children.materialIssueCardContainer.children"
    },
    type: "array"
  };
  
  export const materialIssue = getCommonCard({
    header: getCommonTitle(
      {
        labelName: "Indent Material Issue Details",
        labelKey: "STORE_MATERIAL_INDENT_NOTE_INDENT_MATERIAL_ISSUE_DETAILS"
      },
      {
        style: {
          marginBottom: 18
        }
      }
    ),
    materialIssueCard
  });