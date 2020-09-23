import {
    getCommonCard,
    getCommonTitle,
    getTextField,
    getDateField,
    getSelectField,
    getCommonContainer,
    getPattern
  } from "egov-ui-framework/ui-config/screens/specs/utils";
  import get from "lodash/get";
  import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { filter } from "lodash";
import{GetMdmsNameBycode} from '../../../../../ui-utils/storecommonsapi'
 // import { getTodaysDateInYMD } from "../../utils";
 import { getSTOREPattern} from "../../../../../ui-utils/commons";
  export const MaterialMasterDetails = getCommonCard({
    header: getCommonTitle(
      {
        labelName: "Material Details",
        labelKey: "STORE_MATERIAL_DETAILS"
      },
      {
        style: {
          marginBottom: 18
        }
      }
    ),
    MaterialDetailsContainer: getCommonContainer({
      MaterialCode: {
        ...getSelectField({
          label: {
            labelName: "Material Name",
            labelKey: "STORE_MATERIAL_NAME"
          },
          placeholder: {
            labelName: "Select Material Name",
            labelKey: "STORE_MATERIAL_NAME_SELECT"
          },
          required: false,
          pattern: getPattern("Name") || null,
          jsonPath: "materials[0].code",
          sourceJsonPath: "createScreenMdmsData.store-asset.Material",
          props: {
            optionValue: "code",
            optionLabel: "name",
          },
        }),
        beforeFieldChange: (action, state, dispatch) => {
          let Material = get(state, "screenConfiguration.preparedFinalObject.createScreenMdmsData.store-asset.Material",[]) 
          let MaterialType = Material.filter(x=>x.code == action.value)//.materialType.code
          //alert(action.value);
           console.log(MaterialType[0])
          // alert(MaterialType[0].materialType.code);
          // alert(MaterialType[0].baseUom.code);
          // alert(MaterialType[0].purchaseUom.code);
          if(MaterialType[0])
          {
            dispatch(prepareFinalObject("materials[0].description",MaterialType[0].description));
          dispatch(prepareFinalObject("materials[0].name",MaterialType[0].name));
          dispatch(prepareFinalObject("materials[0].materialType.code",MaterialType[0].materialType.code));
          dispatch(prepareFinalObject("materials[0].baseUom.code",MaterialType[0].baseUom.code));
          dispatch(prepareFinalObject("materials[0].purchaseUom.code",MaterialType[0].baseUom.code));

          dispatch(prepareFinalObject("materials[0].baseUom.name",GetMdmsNameBycode(state, dispatch,"createScreenMdmsData.common-masters.UOM",MaterialType[0].baseUom.code)));

          dispatch(prepareFinalObject("materials[0].purchaseUom.name",GetMdmsNameBycode(state, dispatch,"createScreenMdmsData.common-masters.UOM",MaterialType[0].baseUom.code)));
        }
        }
      },
      MaterialoldCode: {
        ...getTextField({
          label: {
            labelName: "Material Old Code",
            labelKey: "STORE_MATERIAL_OLD_CODE"
          },
          placeholder: {
            labelName: "Material Old Code",
            labelKey: "STORE_MATERIAL_OLD_CODE"
          },
          required: false,
          visible:false,
          pattern: getPattern("Name") || null,
          jsonPath: "materials[0].oldCode"
        })
      },

      MaterialType: {
        ...getSelectField({
          label: { labelName: "Material Type", labelKey: "STORE_COMMON_MATERIAL_TYPE" },
          placeholder: {
            labelName: "Select Material Type",
            labelKey: "STORE_MATERIAL_TYPE_NAME_SELECT"
          },
          required: true,
          jsonPath: "materials[0].materialType.code",
          sourceJsonPath: "createScreenMdmsData.store-asset.MaterialType",
          // props:{
          //   disabled:true
          // },
        props: {
          disabled:true,
          optionValue: "code",
          optionLabel: "name",
        },
        })
      },

      MaterialName: {
        ...getTextField({
          label: {
            labelName: "Material Name",
            labelKey: "STORE_MATERIAL_NAME"
          },
          placeholder: {
            labelName: "Material Name",
            labelKey: "STORE_MATERIAL_NAME"
          },
          required: false,
          visible:false,
          pattern: getPattern("Name") || null,
          jsonPath: "materials[0].name"
        })
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
          props: {
            className: "applicant-details-error",
            multiline: "multiline",
            rowsMax: 4,
          },
          required: true,
          errorMessage: "STORE_VALIDATIO_MATERIAL_DESCRIPTION",
          pattern: getSTOREPattern("Comment"),
          jsonPath: "materials[0].description"
        })
      },

      BaseUOMName: {
        ...getSelectField({
          label: { labelName: "Base UOM Name", labelKey: "STORE_BASE_UOM_NAME" },
          placeholder: {
            labelName: "Select Base UOM Name",
            labelKey: "STORE_BASE_UOM_NAME_SELECT"
          },
          required: true,
          jsonPath: "materials[0].baseUom.code",
          sourceJsonPath: "createScreenMdmsData.common-masters.UOM",
          props: {
            disabled:true,
            optionLabel: "name",
            optionValue: "code"
          },
        })
      },
      InventryType: {
        ...getSelectField({
          label: { labelName: "Inventry Type", labelKey: "STORE_INVENTRY_TYPE" },
          placeholder: {
            labelName: "Select Inventry Type",
            labelKey: "STORE_INVENTRY_TYPE_SELECT"
          },
          required: false,
          errorMessage: "STORE_VALIDATION_INVENTRY_TYPE",
          jsonPath: "materials[0].inventoryType",
           sourceJsonPath: "createScreenMdmsData.store-asset.InventoryType",
          props: {
            // data: [
            //   {
            //     value: "Asset",
            //     label: "Asset"
            //   },
            //   {
            //     value: "Consumable",
            //     label: "Consumable"
            //   },
             
            // ],
            optionValue: "code",
            optionLabel: "name"
          },
        })
      },
      MaterialStatus: {
        ...getTextField({
          label: {
            labelName: "Material Status",
            labelKey: "STORE_MATERIAL_STATUS"
          },
          placeholder: {
            labelName: "Material Status",
            labelKey: "STORE_MATERIAL_STATUS"
          },
          required: false,
          visible:false,
          pattern: getPattern("Name") || null,
          jsonPath: "materials[0].status"
        })
      },
    })
  });