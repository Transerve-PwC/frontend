import {
  getBreak,
  getCommonContainer,
  getCommonGrayCard,
  getCommonSubHeader,
  getLabel,
  getLabelWithValue
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import {  checkValueForNA } from "../../utils";
const indentNumber = getQueryArg(window.location.href, "indentNumber");
const gotoCreatePage = (state, dispatch) => {
  let createUrl="";
  if(indentNumber)
   createUrl = `/egov-store-asset/create-purchase-order?indentNumber=${indentNumber}&step=0`;
   else
   createUrl = `/egov-store-asset/create-purchase-order?step=0`;
  dispatch(setRoute(createUrl));
};

export const getPurchaseOrderHeaderView = (isReview = true) => {
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
            labelName: "Purchase Order",
            labelKey: "STORE_PO_HEADER"
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
    viewOne: getCommonContainer({
      poType: getLabelWithValue(
        {
          labelName: "Purchase Type",
          labelKey: "STORE_PURCHASE_ORDER_TYPE"
        },
        { jsonPath: "purchaseOrders[0].purchaseType" }
      ),
      storeName: getLabelWithValue(
        {
          labelName: "Store Name",
          labelKey: "STORE_DETAILS_STORE_NAME"
        },
        { jsonPath: "purchaseOrders[0].store.name" }
      ),
      divisionName: getLabelWithValue(
        { labelName: "Division Name", labelKey: "STORE_DETAILS_DIVISION_NAME" },
        { jsonPath: "purchaseOrders[0].store.divisionName" }
      ),
      departmentName: getLabelWithValue(
        { labelName: "Department Name", labelKey: "STORE_DETAILS_DEPARTMENT_NAME" },
        { jsonPath: "purchaseOrders[0].store.department.name" }
      ),
      poDate: getLabelWithValue(
        { labelName: "PO Date", labelKey: "STORE_PURCHASE_ORDER_DATE" },
        { jsonPath: "purchaseOrders[0].purchaseOrderDate" }
      ),
      rateType: getLabelWithValue(
        {
          labelName: "PO Rate Type",
          labelKey: "STORE_PURCHASE_ORDER_RATETYPE"
        },
        { jsonPath: "purchaseOrders[0].rateType" }
      ),
      supplier: getLabelWithValue(
        { labelName: "Supplier", labelKey: "STORE_SUPPLIER_MASTER_SUPPLIER_NAME" },
        {
          jsonPath: "purchaseOrders[0].supplier.name",
        }
      ),
      externalPoNumber: getLabelWithValue(
        { labelName: "External PO Number", labelKey: "STORE_EXTERNAL_PO_NUMBER" },
        {
          jsonPath: "purchaseOrders[0].externalPoNumber",
          callBack: checkValueForNA
        }
      ),
      // advancePercentage: getLabelWithValue(
      //   { labelName: "Advance Percentage", labelKey: "STORE_PURCHASE_ORDER_ADVNC_PRCNT" },
      //   {
      //     jsonPath: "purchaseOrders[0].advancePercentage"
      //   }
      // ),
      // advanceAmount: getLabelWithValue(
      //   { labelName: "Advance Amount", labelKey: "STORE_PURCHASE_ORDER_ADVNC_AMT" },
      //   {
      //     jsonPath: "purchaseOrders[0].advanceAmount"
      //   }
      // ),
      expectedDeliveryDate: getLabelWithValue(
        {
          labelName: "Expected Delivery Date",
          labelKey: "STORE_PURCHASE_ORDER_EXPCT_DLVRY_DT"
        },
        {
          jsonPath: "purchaseOrders[0].expectedDeliveryDate"
        }
      ),
      deliveryTerms: getLabelWithValue(
        {
          labelName: "Delivery Terms",
          labelKey: "STORE_PURCHASE_ORDER_DLVRY_TERM"
        },
        { jsonPath: "purchaseOrders[0].deliveryTerms" }
      ),
      paymentTerms: getLabelWithValue(
        { labelName: "Payment Terms", labelKey: "STORE_PURCHASE_ORDER_PYMNT_TERM" },
        {
          jsonPath: "purchaseOrders[0].paymentTerms"
        }
      ),
      remarks: getLabelWithValue(
        { labelName: "Remarks", labelKey: "STORE_PURCHASE_ORDER_REMARK" },
        {
          jsonPath: "purchaseOrders[0].remarks",
        }
      ),
      createdBy: getLabelWithValue(
        { labelName: "Created by", labelKey: "STORE_PURCHASE_ORDER_CREATEBY" },
        {
          jsonPath: "purchaseOrders[0].poCreatedBy",
        }
      ),
      designation: getLabelWithValue(
        { labelName: "Designation", labelKey: "STORE_PURCHASE_ORDER_DSGNTN" },
        {
          jsonPath: "purchaseOrders[0].designation",
        }
      ),
    }),
  });
};
