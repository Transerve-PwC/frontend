import {
    getCommonCard,
    getTextField,
    getCommonContainer,
    getPattern
  } from "egov-ui-framework/ui-config/screens/specs/utils";
  
  export const totalValue = getCommonCard({
   
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
          jsonPath: "materialIssues[0].totalIndentQty"
        })
      },
      totalValue: {
        ...getTextField({
          label: {
            labelName: "Total Issued Quantity",
            labelKey: "STORE_ISSUED_QUANTITY"
          },
          props: {
            disabled: true
          },
          visible:false,
          gridDefination: {
            xs: 12,
            sm: 4,
          },
          jsonPath: "materialIssues[0].totalQty"
        })
      },
      totalqtyValue: {
        ...getTextField({
          label: {
            labelName: "Total Qty Value",
            labelKey: "STORE_QTY_VALUE"
          },
          props: {
            disabled: true
          },
          visible:true,
          gridDefination: {
            xs: 12,
            sm: 4,
          },
          jsonPath: "materialIssues[0].totalvalue"
        })
      },
    })
  });
  
  