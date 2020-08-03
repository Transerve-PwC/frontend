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
  import{getMaterialBalanceRateResults,GetMdmsNameBycode} from '../../../../../ui-utils/storecommonsapi'


  const getMaterialData = async (action, state, dispatch,mrnNumber_) => {   
    const tenantId = getTenantId();
    let queryObject = [
      {
        key: "tenantId",
        value: getTenantId(),
      },
    ];
    let storecode = get(state,"screenConfiguration.preparedFinalObject.materialIssues[0].fromStore.code",'')
    queryObject.push({
      key: "issueingStore",
      value: storecode
    });
  
    //get Material based on mrnNumber
let mrnNumber = get(state,"screenConfiguration.preparedFinalObject.materialIssues[0].materialIssueDetails[0].mrnNumber",'')
    let material =[]
    let  receiptDetails =  get(
      state.screenConfiguration.preparedFinalObject,
      `mrnNumber`,
      []
    );
    receiptDetails = receiptDetails.filter(x=>x.mrnNumber === mrnNumber_)
    receiptDetails = receiptDetails[0].receiptDetails

    for (let index = 0; index < receiptDetails.length; index++) {
      const element = receiptDetails[index];
      material.push( element.material.code)      
    }
    let matcodes= material.map(itm => {
                  return `${itm}`;
                })
                .join() || "-"

    queryObject.push({
      key: "material",
      value: matcodes
    });
  console.log(matcodes)
      
    try {
      let response = await getMaterialBalanceRateResults(queryObject, dispatch);
      let MaterialBalanceRate = response.MaterialBalanceRate.filter(x=>x.mrnNumber === mrnNumber_)
      dispatch(prepareFinalObject("NonIndentsmaterial", MaterialBalanceRate));
    

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
    uiFramework: "custom-containers",
    componentPath: "MultiItem",
    props: {
      scheama: getCommonGrayCard({
        materialIssueCardContainer: getCommonContainer(
          {
            ReceiptNo: {
              ...getSelectField({
                label: {
                  labelName: "Receipt No.",
                  labelKey: "STORE_MATERIAL_INDENT_NOTE_RECEIPT_NO"
                },
                placeholder: {
                  labelName: "Select Receipt No.",
                  labelKey: "STORE_MATERIAL_INDENT_NOTE_RECEIPT_NO_SELECT"
                },
                required: true,               
                jsonPath: "materialIssues[0].materialIssueDetails[0].mrnNumber",
                sourceJsonPath: "mrnNumber",
               // sourceJsonPath: "indentsmaterial",
                props: {
                  // data: [
                  //   {
                  //     code: "MRN/00003/2017",
                  //     name: "MRN/00003/2017"
                  //   },
                   
                  // ],
                  optionValue: "mrnNumber",
                  optionLabel: "mrnNumber",
                  // optionValue: "id",
                  // optionLabel: "id",
                },
              }),
              beforeFieldChange: (action, state, dispatch) => {
                getMaterialData(action,state, dispatch,action.value)
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
                jsonPath: "materialIssues[0].materialIssueDetails[0].receiptId",
                //sourceJsonPath: "materials",
                sourceJsonPath: "NonIndentsmaterial",
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
                  `NonIndentsmaterial`,
                  []
                ); 
                Material = Material.filter(x=>x.receiptId === action.value)
                if(Material && Material[0])
                {
                dispatch(prepareFinalObject("materialIssues[0].materialIssueDetails[0].balanceQty",Material[0].balance));         
                dispatch(prepareFinalObject("materialIssues[0].materialIssueDetails[0].tenantId",Material[0].tenantId));                
               dispatch(prepareFinalObject("materialIssues[0].materialIssueDetails[0].uom.code",Material[0].uomCode)); 
              dispatch(prepareFinalObject("materialIssues[0].materialIssueDetails[0].unitRate",Material[0].unitRate));
              dispatch(prepareFinalObject("materialIssues[0].materialIssueDetails[0].indentDetail",null)); 
              //materialCode
              dispatch(prepareFinalObject("materialIssues[0].materialIssueDetails[0].material.code",Material[0].materialCode));
              //dispatch(prepareFinalObject("materialIssues[0].materialIssueDetails[0].material.name",GetMdmsNameBycode(action,state, dispatch,"createScreenMdmsData.store-asset.Material",Material[0].materialCode)));
              //GetMdmsNameBycodelet matname = ''
               
                
              }

              }

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
                jsonPath: "materialIssues[0].materialIssueDetails[0].balanceQty"
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
                  disabled:false
                },
                required: true,
                pattern: getPattern("Amount") || null,
                jsonPath: "materialIssues[0].materialIssueDetails[0].userQuantityIssued"
              }),
              beforeFieldChange: (action, state, dispatch) => { 
                let BalanceQty = get(state.screenConfiguration.preparedFinalObject,`materialIssues[0].materialIssueDetails[0].balanceQty`,0)
                let unitRate = get(state.screenConfiguration.preparedFinalObject,`materialIssues[0].materialIssueDetails[0].unitRate`,0)
                let balanceQtyAfterIssue =BalanceQty - Number(action.value) 
                let totalValue = unitRate *  Number(action.value)           
                dispatch(prepareFinalObject("materialIssues[0].materialIssueDetails[0].balanceQtyAfterIssue",balanceQtyAfterIssue));
                dispatch(prepareFinalObject("materialIssues[0].materialIssueDetails[0].totalValue",totalValue));
                //totalValue
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
                jsonPath: "materialIssues[0].materialIssueDetails[0].unitRate"
              })
            },
            balanceQtyAfterIssue: {
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
                jsonPath: "materialIssues[0].materialIssueDetails[0].balanceQtyAfterIssue"
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
                required: false,
                props:{
                  disabled:true
                },
                pattern: getPattern("Name") || null,
                jsonPath: "materialIssues[0].materialIssueDetails[0].totalValue"
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
      addItemLabel: {
        labelName: "Add ",
        labelKey: "STORE_MATERIAL_COMMON_CARD_ADD"
      },
      headerName: "Material Indent Note",
      headerJsonPath:
        "children.cardContent.children.header.children.head.children.Accessories.props.label",
      sourceJsonPath: "materialIssues[0].materialIssueDetails",
      prefixSourceJsonPath:
        "children.cardContent.children.materialIssueCardContainer.children"
    },
    type: "array"
  };
  
  export const materialIssue = getCommonCard({
    header: getCommonTitle(
      {
        labelName: "Non-Indent Material Issue Details",
        labelKey: "STORE_MATERIAL_INDENT_NOTE_NON_INDENT_MATERIAL_ISSUE_NOTE_DETAILS"
      },
      {
        style: {
          marginBottom: 18
        }
      }
    ),
    materialIssueCard
  });