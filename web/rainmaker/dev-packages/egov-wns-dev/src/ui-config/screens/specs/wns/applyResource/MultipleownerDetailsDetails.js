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
 // import { getTodaysDateInYMD } from "../../utils";
  import get from "lodash/get";
  //import{GetMdmsNameBycode,GetTotalQtyValue} from '../../../../../ui-utils/storecommonsapi'
  import set from "lodash/set";
  //import { getSTOREPattern} from "../../../../../ui-utils/commons";
  import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
  import { handleScreenConfigurationFieldChange as handleField , prepareFinalObject} from "egov-ui-framework/ui-redux/screen-configuration/actions";
   let tenantId = getQueryArg(window.location.href, "tenantId");
   let disabled = false
  if(tenantId)
  disabled = true
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
  
  const MultiownerDetailsCard = {
    uiFramework: "custom-containers-local",
    moduleName: "egov-wns",
    componentPath: "MultiItem",
    props: {
      scheama: getCommonGrayCard({
        storeDetailsCardContainer: getCommonContainer(
          {

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
                jsonPath: "indents[0].indentDetails[0].material.description"
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

          },
          {
            style: {
              overflow: "visible"
            }
          }
        )
      }),
     
      onMultiItemAdd: (state, muliItemContent) => {
        let indentPurpose = get(
          state.screenConfiguration.preparedFinalObject,
          "indents[0].indentPurpose",
          null
        );
       
          //console.log("click on add");
        return muliItemContent;
      },
      items: [],
      hasAddItem:!false,
      isReviewPage:false,
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
      // cardtotalpropes:{
      //   totalIndentQty:false,
      //   pagename:`creatindent`,
      //   cardJsonPath:"components.div.children.formwizardSecondStep.children.MaterialIndentMapDetails.children.cardContent.children.MaterialIndentDetailsCard.props.items",
      //   jasonpath:"indents[0].indentDetails",
      //   InputQtyValue:"indentQuantity",
      //   TotalValue:"totalValue",
      //   TotalQty:"userQuantity"
      // },
      prefixSourceJsonPath:
        "children.cardContent.children.storeDetailsCardContainer.children"
    },
    type: "array"
  };
  
  //export const MaterialIndentMapDetails =(disabled) => {
   //return
    export const MultiownerDetailsDetails =  getCommonCard({
    header: getCommonTitle(
      {
        
        labelKey: "WS_OWN_DETAIL_HEADER_INFO"
      },
      {
        style: {
          marginBottom: 18
        }
      }
    ),
    MultiownerDetailsCard 
  });
//}