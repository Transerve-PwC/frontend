import {
    getCommonCard,
    getCommonTitle,
    getTextField,
    getCommonContainer,
    getPattern
  } from "egov-ui-framework/ui-config/screens/specs/utils";
  
  export const totalDisposalValue = getCommonCard({
   
    totalValueContainer: getCommonContainer({  
      totalValue: {
        ...getTextField({
          label: {
            labelName: "Total Disposal Value",
            labelKey: "STORE_DISPOSAL_SCRAP_DISPOSAL_VALUE"
          },
          props: {
            disabled: true
          },
          jsonPath: "disposals[0].totalDisposalValue"
        })
      },
    })
  });
  
  