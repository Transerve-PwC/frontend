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
  import { getTodaysDateInYMD } from "../../utils";
  import get from "lodash/get";
  import{GetMdmsNameBycode,GetTotalQtyValue} from '../../../../../ui-utils/storecommonsapi'
  import set from "lodash/set";
  import { handleScreenConfigurationFieldChange as handleField , prepareFinalObject} from "egov-ui-framework/ui-redux/screen-configuration/actions";
  
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
  
  const MaterialIndentDetailsCard = {
    uiFramework: "custom-containers-local",
    moduleName: "egov-store-asset",
    componentPath: "MultiItem",
    props: {
      scheama: getCommonGrayCard({
        storeDetailsCardContainer: getCommonContainer(
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
                jsonPath: "indents[0].indentDetails[0].material.code",
                sourceJsonPath: "materials.materials",
                props: {
                  optionValue: "code",
                  optionLabel: "name",
                },
              }),
              beforeFieldChange: (action, state, dispatch) => {
                let Material = get(state, "screenConfiguration.preparedFinalObject.createScreenMdmsData.store-asset.Material",[]) 
                let MaterialType = Material.filter(x=>x.code == action.value)//.materialType.code
                let cardIndex = action.componentJsonpath.split("items[")[1].split("]")[0];
                if(MaterialType[0])
                {
                  dispatch(prepareFinalObject(`indents[0].indentDetails[${cardIndex}].material.name`,MaterialType[0].name));
                dispatch(prepareFinalObject(`indents[0].indentDetails[${cardIndex}].uom.code`,MaterialType[0].baseUom.code));
                let uomname = GetMdmsNameBycode(state, dispatch,"createScreenMdmsData.common-masters.UOM",MaterialType[0].baseUom.code) 
                dispatch(prepareFinalObject(`indents[0].indentDetails[${cardIndex}].uom.name`,uomname));
              }
              }
            },
            MaterialDescription: {
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
                jsonPath: "indents[0].storeMapping[0].MaterialDescription"
              })
            },
            UOMName: {
              ...getSelectField({
                label: {
                  labelName: "UOM Name",
                  labelKey: "STORE_MATERIAL_INDENT_NOTE_UOM_NAME"
                },
                placeholder: {
                  labelName: "Indent Purpose",
                  labelKey: "STORE_MATERIAL_INDENT_UOM_NAME_SELECT"
                },
               
                required: false,
                pattern: getPattern("Name") || null,
                jsonPath: "indents[0].indentDetails[0].uom.code",
                sourceJsonPath: "createScreenMdmsData.common-masters.UOM",
                props: {
                  disabled:true,
                  optionLabel: "name",
                  optionValue: "code"
                },
              })
            },
            indentPurpose: {
              ...getTextField({
                label: {
                  labelName: "Indent Purpose",
                  labelKey: "STORE_MATERIAL_INDENT_INDENT_PURPOSE"
                },
                placeholder: {
                  labelName: "Select UOM Name",
                  labelKey: "STORE_MATERIAL_INDENT_INDENT_PURPOSE"
                },
               
                required: false,
                pattern: getPattern("Name") || null,
                jsonPath: "indents[0].indentDetails[0].indentPurpose",
                //sourceJsonPath: "createScreenMdmsData.common-masters.UOM",
                props: {
                  disabled:true,
                  
                },
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
                jsonPath: "indents[0].indentDetails[0].asset.code",
               // sourceJsonPath: "createScreenMdmsData.common-masters.UOM",
                props: {
                  data: [
                    {
                      value: "Code1",
                      label: "Code1"
                    },
                    
                  ],
                  optionValue: "value",
                  optionLabel: "label"
                },
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
                visible:true,
                pattern: getPattern("Name") || null,
                jsonPath: "indents[0].indentDetails[0].project.code",
                //sourceJsonPath: "createScreenMdmsData.common-masters.UOM",
                props: {
                  data: [
                    {
                      value: "PR1",
                      label: "PR1"
                    },
                    
                  ],
                  optionValue: "value",
                  optionLabel: "label"
                },
              })
            },
            indentQuantity: {
              ...getTextField({
                label: {
                  labelName: "indentQuantity",
                  labelKey: "STORE_MATERIAL_INDENT_QUANTITY"
                },
                placeholder: {
                  labelName: " indent Quantity",
                  labelKey: "STORE_MATERIAL_INDENT_QUANTITY_PLACEHOLDER"
                },
                props:{
                  disabled:false
                },
                required: true,
                visible:false,
                pattern: getPattern("Amount") || null,
                jsonPath: "indents[0].indentDetails[0].indentQuantity"
              })
            },
            QuantityRequired: {
              ...getTextField({
                label: {
                  labelName: "QuantityRequired",
                  labelKey: "STORE_MATERIAL_INDENT_QUANTITY_REQUIRED"
                },
                placeholder: {
                  labelName: "QuantityRequired",
                  labelKey: "STORE_MATERIAL_INDENT_QUANTITY_REQUIRED_PLACEHOLDER"
                },
                props:{
                  disabled:false
                },
                required: true,
                pattern: getPattern("Amount") || null,
                jsonPath: "indents[0].indentDetails[0].userQuantity"
              }),
              beforeFieldChange: (action, state, dispatch) => {
                let cardIndex = action.componentJsonpath.split("items[")[1].split("]")[0];
                dispatch(prepareFinalObject(`indents[0].indentDetails[${cardIndex}].userQuantity`,Number(action.value)));
                 //set total value on Qty Change
                 let cardJsonPath =
                 "components.div.children.formwizardSecondStep.children.MaterialIndentMapDetails.children.cardContent.children.MaterialIndentDetailsCard.props.items";
                 let pagename = `creatindent`;
                 let jasonpath =  "indents[0].indentDetails";
                 let InputQtyValue = "indentQuantity";
                 let TotalValue = "totalValue";
                 let TotalQty ="userQuantity"
                 let Qty = GetTotalQtyValue(state,cardJsonPath,pagename,jasonpath,InputQtyValue,TotalValue,TotalQty)
                 if(Qty && Qty[0])
                 {
                  
                  dispatch(prepareFinalObject(`indents[0].totalQty`, Qty[0].TotalQty));

                 }
              }
            },
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
        let indentPurpose = get(
          state.screenConfiguration.preparedFinalObject,
          "indents[0].indentPurpose",
          null
        );
        if(indentPurpose){
          
          let preparedFinalObject = get(
            state,
            "screenConfiguration.preparedFinalObject",
            {}
          );
          let cardIndex = get(muliItemContent, "MaterialName.index");
        if(preparedFinalObject){
          set(preparedFinalObject.indents[0],`indentDetails[${cardIndex}].indentPurpose` , indentPurpose);
        }      
  
          Object.keys(muliItemContent).forEach(key => {
            if(indentPurpose ==='Revenue')
            {
              if ( key === "AssestCode") {
                //set(muliItemContent[key], "props.visible", true);
                muliItemContent[key].props.style = {display:"inline-block"};
                muliItemContent["AssestCode"].props.disabled = false;
                //set(muliItemContent[key], "props.value", indentNumber);
              }
              if ( key === "ProjectCode") {
                //set(muliItemContent[key], "props.visible", false);
                muliItemContent[key].props.style = {display:"inline-block"};
                muliItemContent["ProjectCode"].props.disabled = true;
                
              }
            }

            else if(indentPurpose ==='Capital')
            {
              if ( key === "AssestCode") {
                //set(muliItemContent[key], "props.visible", false);
                muliItemContent[key].props.style = {display:"inline-block"};
                muliItemContent["AssestCode"].props.disabled = true;
                //set(muliItemContent[key], "props.value", indentNumber);
              }
              if ( key === "ProjectCode") {
                //set(muliItemContent[key], "props.visible", true);
                muliItemContent[key].props.style = {display:"inline-block"};
                muliItemContent["ProjectCode"].props.disabled = false;
                
              }

            }
             
          });  
  
        }
          //console.log("click on add");
        return muliItemContent;
      },
      items: [],
      addItemLabel: {
        labelName: "ADD",
        labelKey: "STORE_MATERIAL_COMMON_CARD_ADD"
      },
      headerName: "Store",
      totalIndentQty:false,
      headerJsonPath:
        "children.cardContent.children.header.children.head.children.Accessories.props.label",
      sourceJsonPath: "indents[0].indentDetails",
       //Update Total value when delete any card configuration settings     
      cardtotalpropes:{
        totalIndentQty:false,
        pagename:`creatindent`,
        cardJsonPath:"components.div.children.formwizardSecondStep.children.MaterialIndentMapDetails.children.cardContent.children.MaterialIndentDetailsCard.props.items",
        jasonpath:"indents[0].indentDetails",
        InputQtyValue:"indentQuantity",
        TotalValue:"totalValue",
        TotalQty:"userQuantity"
      },
      prefixSourceJsonPath:
        "children.cardContent.children.storeDetailsCardContainer.children"
    },
    type: "array"
  };
  
  export const MaterialIndentMapDetails = getCommonCard({
    header: getCommonTitle(
      {
        labelName: "Material Indent Details",
        labelKey: "STORE_MATERIAL_INDENT_MATERIAL_INDENT_DETAILS"
      },
      {
        style: {
          marginBottom: 18
        }
      }
    ),
    MaterialIndentDetailsCard
  });