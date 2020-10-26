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
            labelName: "Total Qty. Accepted",
            labelKey: "STORE_ACCEPTED_QUANTITY"
          },
          props: {
            disabled: true
          },
          visible:false,
          gridDefination: {
            xs: 12,
            sm: 4,
          },
          jsonPath: "materialReceipt[0].totalQty"
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
          gridDefination: {
            xs: 12,
            sm: 4,
          },
          jsonPath: "materialReceipt[0].totalvalue"
        })
      },
    })
  });
  
  