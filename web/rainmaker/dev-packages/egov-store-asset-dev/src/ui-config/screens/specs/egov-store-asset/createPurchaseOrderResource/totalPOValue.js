import {
    getCommonCard,
    getTextField,
    getCommonContainer,
    getPattern
  } from "egov-ui-framework/ui-config/screens/specs/utils";
  
  export const totalPOValue = getCommonCard({
   
    totalValueContainer: getCommonContainer({  
      totalindentQuantity: {
        ...getTextField({
          label: {
            labelName: "Total Indent Quantity",
            labelKey: "STORE_PURCHASE_ORDER_INDENT_QUNTITY"
          },
          props: {
            disabled: true
          },
          visible:false,
          gridDefination: {
            xs: 12,
            sm: 4,
          },
          jsonPath: "purchaseOrders[0].totalIndentQty"
        })
      },
      totalPOQty: {
        ...getTextField({
          label: {
            labelName: "Total Order Quantity",
            labelKey: "STORE_ORDER_QUANTITY"
          },
          props: {
            disabled: true
          },
          visible:false,
          gridDefination: {
            xs: 12,
            sm: 4,
          },
          jsonPath: "purchaseOrders[0].totalQty"
        })
      },
      totalPOValue: {
        ...getTextField({
          label: {
            labelName: "Total PO Value",
            labelKey: "STORE_PURCHASE_ORDER_TOTAL_PO_VALUE"
          },
          props: {
            disabled: true
          },
          gridDefination: {
            xs: 12,
            sm: 4,
          },
          jsonPath: "purchaseOrders[0].totalvalue"
        })
      },
    })
  });
  
  