import {
    getCommonCard,
    getTextField,
    getCommonContainer,
    getPattern
  } from "egov-ui-framework/ui-config/screens/specs/utils";
  
  export const totalValue = getCommonCard({
   
    totalValueContainer: getCommonContainer({  
     
      totalValue: {
        ...getTextField({
          label: {
            labelName: "Total Order Quantity",
            labelKey: "STORE_ORDER_QUANTITY"
          },
          props: {
            disabled: true
          },
          jsonPath: "indents[0].totalQty"
        })
      },
    })
  });
  
  