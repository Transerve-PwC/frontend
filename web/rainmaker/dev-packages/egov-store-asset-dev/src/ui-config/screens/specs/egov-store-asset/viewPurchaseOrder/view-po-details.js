import {
  getCommonContainer,
  getCommonGrayCard,
  getCommonSubHeader,
  getLabel,
  getLabelWithValue
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import {  checkValueForNA } from "../../utils";
import { getTenantId } from "egov-ui-kit/utils/localStorageUtils";
const indentNumber = getQueryArg(window.location.href, "indentNumber");
const gotoCreatePage = (state, dispatch) => {
  let createUrl="";
  if(indentNumber)
   createUrl = `/egov-store-asset/create-purchase-order?indentNumber=${indentNumber}&step=2`;
   else
   createUrl = `/egov-store-asset/create-purchase-order?step=2`;
   const {purchaseOrders}  = state.screenConfiguration.preparedFinalObject;             
    if(purchaseOrders &&purchaseOrders[0])
    {
      createUrl = `/egov-store-asset/create-purchase-order?poNumber=${purchaseOrders[0].purchaseOrderNumber}&tenantId=${getTenantId()}&step=2`;
    }
  dispatch(setRoute(createUrl));
};

const assignmentCard = {
  uiFramework: "custom-containers",
  componentPath: "MultiItem",
  props: {
    className: "review-hr",
    scheama: getCommonGrayCard({
      poDetailsCardContainer: getCommonContainer({
        materialName: getLabelWithValue(
          {
            labelName: "Material Name",
            labelKey: "STORE_MATERIAL_NAME"
          },
          { jsonPath: "purchaseOrders[0].purchaseOrderDetails[0].material.name" }
        ),
        indentNumber: getLabelWithValue(
          {
            labelName: "Indent No.",
            labelKey: "STORE_PURCHASE_ORDER_INDENT_NO"
          },
          { 
          jsonPath: "purchaseOrders[0].purchaseOrderDetails[0].indentNumber",
          callBack: checkValueForNA
        }
        ),
        materialDscptn: getLabelWithValue(
          {
            labelName: "Material Description",
            labelKey: "STORE_MATERIAL_DESCRIPTION"
          },
          { jsonPath: "purchaseOrders[0].purchaseOrderDetails[0].material.description" }
        ),
        indentQuantity: getLabelWithValue(
          { labelName: "Total Indent Quantity", labelKey: "STORE_PURCHASE_ORDER_INDENT_QUNTITY" },
          {
            jsonPath: "purchaseOrders[0].purchaseOrderDetails[0].indentQuantity",
            callBack: checkValueForNA
          }
        ),
        balenceQty: getLabelWithValue(
          { labelName: "Balance Quantity", labelKey: "STORE_PURCHASE_ORDER_BLNC_QLTY" },
          {
            jsonPath: "purchaseOrders[0].purchaseOrderDetails[0].balenceQty",
          }
        ),
        orderQuantity: getLabelWithValue(
          { labelName: "Order Quantity", labelKey: "STORE_PURCHASE_ORDER_ORDR_QLTY" },
          {
            jsonPath: "purchaseOrders[0].purchaseOrderDetails[0].orderQuantity"
          }
        ),
        uomName: getLabelWithValue(
          { labelName: "UOM Name", labelKey: "STORE_PURCHASE_ORDER_UOM" },
          {
            jsonPath: "purchaseOrders[0].purchaseOrderDetails[0].uom.name",    
          }
        ),
        unitPrice: getLabelWithValue(
          { labelName: "Unit Price", labelKey: "STORE_PURCHASE_ORDER_UNIT_PRC" },
          {
            jsonPath: "purchaseOrders[0].purchaseOrderDetails[0].unitPrice",
          }
        ),
        totalValue: getLabelWithValue(
          { labelName: "Total Value", labelKey: "STORE_PURCHASE_ORDER_TOTAL_VALUE" },
          {
            jsonPath: "purchaseOrders[0].purchaseOrderDetails[0].totalValue"
          }
        ),
        // tenderQuantity: getLabelWithValue(
        //   { labelName: "Tender Quantity", labelKey: "STORE_PURCHASE_ORDER_TENDER_QLTY" },
        //   {
        //     jsonPath: "purchaseOrders[0].purchaseOrderDetails[0].tenderQuantity",    
        //   }
        // ),
        // usedQuantity: getLabelWithValue(
        //   { labelName: "Used Quantity", labelKey: "STORE_PURCHASE_ORDER_USED_QLTY" },
        //   {
        //     jsonPath: "purchaseOrders[0].purchaseOrderDetails[0].usedQuantity",    
        //   }
        // )
      })
    }),

    items: [],
    hasAddItem: false,
    isReviewPage: true,
    sourceJsonPath: "purchaseOrders[0].purchaseOrderDetails",
    prefixSourceJsonPath:
      "children.cardContent.children.poDetailsCardContainer.children",
    afterPrefixJsonPath: "children.value.children.key"
  },
  type: "array"
};

// const Total = {
//   uiFramework: "custom-containers",
//   componentPath: "MultiItem",
// },

export const getPODetailsView = (isReview = true) => {
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
            labelName: "Purchase Order Details",
            labelKey: "STORE_PO_DETAILS_HEADER"
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
    viewOne: assignmentCard,
   
  });
};
