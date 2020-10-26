import {
    getCommonCard,
    getCommonTitle,
    getTextField,
    getCommonContainer,
    getPattern
  } from "egov-ui-framework/ui-config/screens/specs/utils";
  
  export const totalIssueValue = getCommonCard({
   
    totalValueContainer: getCommonContainer({  

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
  
  