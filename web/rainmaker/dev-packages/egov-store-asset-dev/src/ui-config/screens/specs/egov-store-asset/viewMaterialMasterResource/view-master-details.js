import {
  getBreak,
  getCommonContainer,
  getCommonGrayCard,
  getCommonSubHeader,
  getLabel,
  getLabelWithValue
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";

const gotoCreatePage = (state, dispatch) => {
  const createUrl =
    process.env.REACT_APP_SELF_RUNNING === "true"
      ? `/egov-ui-framework/egov-store-asset/creatematerialmaster?step=0`
      : `/egov-store-asset/creatematerialmaster?step=0`;
  dispatch(setRoute(createUrl));
};

const getHeader = label => {
  return {
    uiFramework: "custom-molecules-local",
    moduleName: "egov-hrms",
    componentPath: "DividerWithLabel",
    props: {
      className: "hr-generic-divider-label",
      labelProps: {},
      dividerProps: {},
      label
    },
    type: "array"
  };
};

export const getMasterDetailsView = (isReview = true) => {
  return getCommonGrayCard({
    headerDiv: {
      uiFramework: "custom-atoms",
      componentPath: "Container",
      props: {
        style: { marginBottom: "10px" }
      },
      children: {
        header: {
          gridDefination: {
            xs: 12,
            sm: 10
          },
          ...getCommonSubHeader({
            labelName: "Material Details",
            labelKey: "STORE_MATERIAL_DETAILS"
          })
        },
        editSection: {
          componentPath: "Button",
          props: {
            color: "primary"
          },
          visible: isReview,
          gridDefination: {
            xs: 12,
            sm: 2,
            align: "right"
          },
          children: {
            editIcon: {
              uiFramework: "custom-atoms",
              componentPath: "Icon",
              props: {
                iconName: "edit"
              }
            },
            buttonLabel: getLabel({
              labelName: "Edit",
              labelKey: "STORE_SUMMARY_EDIT"
            })
          },
          onClickDefination: {
            action: "condition",
            callBack: gotoCreatePage
          }
        }
      }
    },
   
    break1: getBreak(),
    viewOne: getCommonContainer({
      reviewMaterialName: getLabelWithValue(
        {
          labelName: "Material Name",
          labelKey: "STORE_MATERIAL_NAME"
        },
        { jsonPath: "materials[0].name" }
      ),
      reviewMaterialCode: getLabelWithValue(
        {
          labelName: "Material Code",
          labelKey: "STORE_MATERIAL_CODE"
        },
        { jsonPath: "materials[0].code" }
      ),
      // reviewMaterialOldCode: getLabelWithValue(
      //   { labelName: "Material Old Code", labelKey: "STORE_MATERIAL_OLD_CODE" },
      //   { jsonPath: "materials[0].oldCode" }
      // ),
      
      reviewMaterialDescription: getLabelWithValue(
        { labelName: "Material Description", labelKey: "STORE_MATERIAL_DESCRIPTION" },
        {
          jsonPath: "materials[0].description",
          // localePrefix: {
          //   moduleName: "COMMON",
          //   masterName: "GENDER"
          // },
        }
      ),
      reviewBaseUOMName: getLabelWithValue(
        { labelName: "Base UOM Name", labelKey: "STORE_BASE_UOM_NAME" },
        {
          jsonPath: "materials[0].baseUom.name"
        }
      ),
      reviewInventryType: getLabelWithValue(
        { labelName: "Inventry Type", labelKey: "STORE_INVENTRY_TYPE" },
        {
          jsonPath: "materials[0].inventoryType"
        }
      ),
      // reviewMaterialStatus: getLabelWithValue(
      //   {
      //     labelName: "Material Status",
      //     labelKey: "STORE_MATERIAL_STATUS"
      //   },
      //   {
      //     jsonPath: "materials[0].status"
      //   }
      // )
    }),

  });
};
