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
  import set from "lodash/set";
  import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
  import{getmaterialissuesSearchResults,GetMdmsNameBycode} from '../../../../../ui-utils/storecommonsapi'
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
  
  const MaterialDetailsCard = {
    uiFramework: "custom-containers",
    componentPath: "MultiItem",
    props: {
      scheama: getCommonGrayCard({
        storeDetailsCardContainer: getCommonContainer(
          {
            materialcode:{            
            ...getSelectField({
              label: {  labelName: " Material Name",
              labelKey: "STORE_MATERIAL_NAME" },
              placeholder: {
                labelName: "Select Material Name",
                labelKey: "STORE_MATERIAL_NAME_SELECT"
              },
              required: true,
            errorMessage:"STORE_VALIDATION_MATERIAL_NAME",
              jsonPath: "priceLists[0].priceListDetails[0].material.code",            
              sourceJsonPath: "createScreenMdmsData.store-asset.Material",
              props: {
                optionValue: "code",
                optionLabel: "name",
              },
            }),
            beforeFieldChange: (action, state, dispatch) => {
              let cardIndex = action.componentJsonpath.split("items[")[1].split("]")[0];
              let Material = get(state, "screenConfiguration.preparedFinalObject.createScreenMdmsData.store-asset.Material",[]) 
              let MaterialType = Material.filter(x=>x.code == action.value)//.materialType.code
              let matname = GetMdmsNameBycode(state, dispatch,"createScreenMdmsData.store-asset.Material",action.value) 
              let UomName = GetMdmsNameBycode(state, dispatch,"createScreenMdmsData.common-masters.UOM",MaterialType[0].baseUom.code) 
              dispatch(prepareFinalObject(`priceLists[0].priceListDetails[${cardIndex}].material.name`,matname));
              dispatch(prepareFinalObject(`priceLists[0].priceListDetails[${cardIndex}].uom.code`,MaterialType[0].baseUom.code));
              dispatch(prepareFinalObject(`priceLists[0].priceListDetails[${cardIndex}].uom.name`,UomName));
            }
          },
            fromDate: {
              ...getDateField({
                label: {
                  labelName: "From Date",
                  labelKey: "STORE_PRICE_FROM_DATE"
                },
                placeholder: {
                  labelName: "Enter From Date",
                  labelKey: "STORE_PRICE_FROM_DATE_PLACEHOLDER"
                },
                required: false,
                visible:false,
                pattern: getPattern("Date") || null,
                jsonPath: "priceLists[0].priceListDetails[0].fromDate",
                props: {
                  inputProps: {
                    max: getTodaysDateInYMD()
                  }
                }
              })
            },
            toDate: {
              ...getDateField({
                label: {
                  labelName: "To Date",
                  labelKey: "STORE_PRICE_TO_DATE"
                },
                placeholder: {
                  labelName: "Enter To Date",
                  labelKey: "STORE_PRICE_TO_DATE_PLACEHOLDER"
                },
                required: false,
                visible:false,
                pattern: getPattern("Date") || null,
                jsonPath: "priceLists[0].priceListDetails[0].toDate",
                props: {
                  inputProps: {
                    max: getTodaysDateInYMD()
                  }
                }
              })
            },
            ratePerUnit: {
              ...getTextField({
                label: {
                  labelName: "Rate Per Unit",
                  labelKey: "STORE_PRICE_RATE_PER_UNIT"
                },
                placeholder: {
                  labelName: "Enter Rate Per Unit",
                  labelKey: "STORE_PRICE_RATE_PER_UNIT_PLACEHOLDER"
                },
                required: true,
            errorMessage:"STORE_VALIDATION_RATER_PER_UNIT",
                pattern: getPattern("Amount") || null,
                jsonPath: "priceLists[0].priceListDetails[0].ratePerUnit"
              })
            },
            quantity: {
              ...getTextField({
                label: {
                  labelName: "quantity",
                  labelKey: "STORE_PRICE_QUANTITY"
                },
                placeholder: {
                  labelName: "Enter quantity",
                  labelKey: "STORE_PRICE_QUANTITY_PLACEHOLDER"
                },
                required: true,
            errorMessage:"STORE_VALIDATION_QUANTITY",
                pattern: getPattern("Amount") || null,
                jsonPath: "priceLists[0].priceListDetails[0].quantity"
              })
            },          

            uomcode: getSelectField({
              label: { labelName: "UOM ", labelKey: "STORE_MATERIAL_INDENT_NOTE_UOM_NAME" },
              placeholder: {
                labelName: "Select UOM",
                labelKey: "STORE_MATERIAL_INDENT_NOTE_UOM_NAME",
              },
              required: true,
              errorMessage:"STORE_VALIDATION_UOM_NAME",
              jsonPath: "priceLists[0].priceListDetails[0].uom.code",
              gridDefination: {
                xs: 12,
                sm: 4,
              },
              sourceJsonPath: "createScreenMdmsData.common-masters.UOM",
            props: {
              disabled:true,
              optionLabel: "name",
              optionValue: "code"
            },
              
            }),
            active: {
              uiFramework: "custom-containers-local",
              moduleName: "egov-store-asset",
              componentPath: "CheckboxContainer",
              jsonPath: "priceLists[0].priceListDetails[0].active",
              gridDefination: {
                xs: 4,
              },
              isFieldValid: true,
              required: false,
        
              props: {
                content: "STORE_PRICE_ACTIVE",
                screenName: "createpricelist",
                jsonPath: "priceLists[0].priceListDetails[0].active",
                checkBoxPath:
                  "components.div.children.searchForm.children.cardContent.children.searchFormContainer.children.active",
              },
            },
          },
          {
            style: {
              overflow: "visible"
            }
          }
        )
      }),
      // set active true
      onMultiItemAdd: (state, muliItemContent) => {          
          let preparedFinalObject = get(
            state,
            "screenConfiguration.preparedFinalObject",
            {}
          );
          let cardIndex = get(muliItemContent, "materialcode.index");
        if(preparedFinalObject){
          set(preparedFinalObject.priceLists[0],`priceListDetails[${cardIndex}].active` , true);
        } 
          //console.log("click on add");
        return muliItemContent;
      },
      items: [],
      addItemLabel: {
        labelName: "ADD STORE",
        labelKey: "STORE_COMMON_ADD_BUTTON"
      },
      headerName: "Store",
      headerJsonPath:
        "children.cardContent.children.header.children.head.children.Accessories.props.label",
      sourceJsonPath: "priceLists[0].priceListDetails",
      prefixSourceJsonPath:
        "children.cardContent.children.storeDetailsCardContainer.children"
    },
    type: "array"
  };
  
  export const MaterialPriceDetails = getCommonCard({
    header: getCommonTitle(
      {
        labelName: "Price List for Material Name Details",
        labelKey: "STORE_PRICE_PRICE_LIST_FOR_MATERIAL_NAME_DETAILS"
      },
      {
        style: {
          marginBottom: 18
        }
      }
    ),
    MaterialDetailsCard
  });