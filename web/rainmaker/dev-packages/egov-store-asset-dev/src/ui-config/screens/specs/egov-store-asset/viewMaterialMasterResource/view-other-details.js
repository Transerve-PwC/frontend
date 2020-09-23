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
    ? `/egov-ui-framework/egov-store-asset/creatematerialmaster?step=2`
    : `/egov-store-asset/creatematerialmaster?step=2`;
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

export const getOtherDetailsView = (isReview = true) => {
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
    // PurchasingInformationHeader: getHeader({
    //   labelName: "Purchasing Information",
    //   labelKey: "STORE_MATERIAL_PURCHASING_INFORMATION"
    // }),
    // break1: getBreak(),
    // viewOne: getCommonContainer({
    //   reviewPurchaseUOMName: getLabelWithValue(
    //     {
    //       labelName: "PurchaseUOMName",
    //       labelKey: "STORE_MATERIAL_PURCHASE_UOM_NAME"
    //     },
    //     { jsonPath: "materials[0].purchaseUom.code" }
    //   ),
    //   reviewExpenseAccountCode: getLabelWithValue(
    //     { labelName: "Expense Account Code", labelKey: "STORE_MATERIAL_EXPENSE_ACCOUNT_CODE" },
    //     { jsonPath: "materials[0].expenseAccount" }
    //   ), 
      
    // }),
    StockingInformationDetailsHeader: getHeader({
      labelName: "Stocking Information",
      labelKey: "STORE_MATERIAL_STOCKING_INFORMATION"
    }),
    break2: getBreak(),
    viewTwo: getCommonContainer({
      reviewUsageClass: getLabelWithValue(
        {
          labelName: "Usage Class",
          labelKey: "STORE_MATERIAL_USAGE_CLASS"
        },
        { jsonPath: "materials[0].materialClass" }
      ),
      reviewStockingUOMName: getLabelWithValue(
        { labelName: "Stocking UOM Name", labelKey: "STORE_MATERIAL_STOCKING_UOM_NAME" },
        {
          jsonPath: "materials[0].stockingUom.name"
        }
      ),
      reviewMaximunQty: getLabelWithValue(
        { labelName: "Maximun Qty", labelKey: "STORE_MATERIAL_MAXIMUN_QTY" },
        {
          jsonPath: "materials[0].maxQuantity",
         
        }
      ),
      reviewMinimumQty: getLabelWithValue(
        { labelName: "Minimum Qty", labelKey: "STORE_MATERIAL_MINIMUM_QTY" },
        {
          jsonPath: "materials[0].minQuantity",
         
        }
      ),
      reviewReOrderLavel: getLabelWithValue(
        { labelName: "Re-Order Lavel", labelKey: "STORE_MATERIAL_RE_ORDER_LAVEL" },
        {
          jsonPath: "materials[0].reorderLevel",
        }
      ),
      reviewReOrderQty: getLabelWithValue(
        { labelName: "Re-Order Qty", labelKey: "STORE_MATERIAL_RE_ORDER_QTY" },
        {
          jsonPath: "materials[0].reorderQuantity",
        }
      ),
      reviewLOTControl: getLabelWithValue(
        { labelName: "LOT Control", labelKey: "STORE_MATERIAL_LOT_CONTROL" },
        {
          jsonPath: "materials[0].lotControl",
        }
      ),
      reviewShelfLifeControll: getLabelWithValue(
        { labelName: "Shelf-Life Control", labelKey: "STORE_MATERIAL_SHELF_LIFE_CONTROL" },
        {
          jsonPath: "materials[0].shelfLifeControl",
        }
      )
    }),
    SpecificationDetailsHeader: getHeader({
      labelName: "Specification Details",
      labelKey: "STORE_MATERIAL_SPECIFICATION_DETAILS"
    }),
    break3: getBreak(),
    viewThree: getCommonContainer({
      reviewModel: getLabelWithValue(
        {
          labelName: "Model",
          labelKey: "STORE_MATERIAL_MODEL"
        },
        { jsonPath: "materials[0].model" }
      ),
      reviewManufracturerPartNo: getLabelWithValue(
        { labelName: "Manufracturer Part No", labelKey: "STORE_MATERIAL_MANUFRACTURER_PART_NO" },
        {
          jsonPath: "materials[0].manufacturePartNo"
        }
      ),
      reviewTechnicalSpecifications: getLabelWithValue(
        { labelName: "Technical Specifications", labelKey: "STORE_MATERIAL_TECHNICAL_SPECIFICATIONS" },
        {
          jsonPath: "materials[0].techincalSpecs",
          
        }
      ),
      reviewTermsOfDelivery: getLabelWithValue(
        { labelName: "Terms Of Delivery", labelKey: "STORE_MATERIAL_TERMS_OF_DELIVERY" },
        {
          jsonPath: "materials[0].termsOfDelivery",
          
        }
      ),
     
    })
  });
};
