import {
    getCommonCard,
    getCommonTitle,
    getTextField,
    getCommonContainer,
    getPattern
  } from "egov-ui-framework/ui-config/screens/specs/utils";
  
  export const totalIndentValue = getCommonCard({
   
    totalValueContainer: getCommonContainer({  
      totalValue: {
        ...getTextField({
          label: {
            labelName: "Total Indent Value",
            labelKey: "STORE_MTI_TOTAL_INDENT_VALUE"
          },
          props: {
            disabled: true
          },
          jsonPath: "purchaseOrders[0].totalValue"
        })
      },
    })
  });
  
  