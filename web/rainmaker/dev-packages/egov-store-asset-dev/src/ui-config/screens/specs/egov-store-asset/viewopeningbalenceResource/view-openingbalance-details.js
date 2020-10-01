import {
  getBreak,
  getCommonContainer,
  getCommonGrayCard,
  getCommonSubHeader,
  getLabel,
  getCommonCard,
  getCommonTitle,
  getLabelWithValue
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";



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
const openningbalenceCard = {
  uiFramework: "custom-containers",
  componentPath: "MultiItem",
  props: {
    className: "review-hr",
    scheama: getCommonGrayCard({
      openningbalenceCardContainer: getCommonContainer({
        materialcode: getLabelWithValue(
          {
            labelName: "Material Code",
              labelKey: "STORE_MATERIAL_NAME"
          },
          { jsonPath: "materialReceipt[0].receiptDetails[0].material.name",          
        }
        ),
        // LotNumber: getLabelWithValue(
        //   {
        //     labelName: "Lot No.",
        //       labelKey: "STORE_MATERIAL_OPENNING_BALANCE_LOT_NO"
        //   },
        //   { jsonPath: "materialReceipt[0].receiptDetails[0].receiptDetailsAddnInfo[0].lotNo",          
        // }
        // ),
        // ExpiryDate: getLabelWithValue(
        //   {
        //     labelName: "Expiry Date",
        //       labelKey: "STORE_MATERIAL_OPENNING_BALANCE_EXPIRY_DATE"
        //   },
        //   { jsonPath: "materialReceipt[0].receiptDetails[0].receiptDetailsAddnInfo[0].expiryDate",          
        // }
        // ),
        // OpeningQty: getLabelWithValue(
        //   {
        //     labelName: "Opening Qty",
        //     labelKey: "STORE_MATERIAL_OPENNING_BALANCE_OPENING_QTY"
        //   },
        //   { jsonPath: "materialReceipt[0].receiptDetails[0].receiptDetailsAddnInfo[0].userReceivedQty",          
        // }
        // ),
        // OpeningRate: getLabelWithValue(
        //   {
        //     labelName: "Opening Rate",
        //       labelKey: "STORE_MATERIAL_OPENNING_BALANCE_OPENING_RATE"
        //   },
        //   { jsonPath: "materialReceipt[0].receiptDetails[0].receiptDetailsAddnInfo[0].oldReceiptNumber",          
        // }
        // ),
        // receiptNumber: getLabelWithValue(
        //   {
        //     labelName: "Receipt No.",
        //       labelKey: "STORE_MATERIAL_OPENNING_BALANCE_RECEIPT_NO"
        //   },
        //   { jsonPath: "materialReceipt[0].receiptDetails[0].receiptDetailsAddnInfo[0].unitRate",          
        // }
        // ),
        // receiptDate: getLabelWithValue(
        //   {
        //     labelName: "Receipt Date",
        //     labelKey: "STORE_MATERIAL_OPENNING_BALANCE_RECEIPT_DATE"
        //   },
        //   { jsonPath: "materialReceipt[0].receiptDetails[0].receiptDetailsAddnInfo[0].receivedDate",          
        // }
        // ),
        
        remarks: getLabelWithValue(
          {
            labelName: "Remarks",
            labelKey: "STORE_MATERIAL_INDENT_NOTE_REMARK"
          },
          { jsonPath: "materialReceipt[0].receiptDetails[0].remarks",          
        }
        ),
      
      })
    }),

    items: [],
    hasAddItem: false,
    isReviewPage: true,
   // screenKey:"view-price-list",
    sourceJsonPath: "materialReceipt[0].receiptDetails",
    prefixSourceJsonPath:
      "children.cardContent.children.openningbalenceCardContainer.children",
    afterPrefixJsonPath: "children.value.children.key"
  },
  type: "array"
};
export const getOpeningBalanceDetailsView = (isReview = true) => {
  return getCommonGrayCard({
    
    // header: getCommonTitle(
    //   {
    //     labelName: "Material Opening Balance Details",
    //     labelKey: "STORE_MATERIAL_OPENNING_BALANCE_HEADER"
    //   },
    //   {
    //     style: {
    //       marginBottom: 18
    //     }
    //   }
    // ),
    

    View1: getCommonContainer({
      header1: getCommonTitle(
        {
          labelName: "Financial Year",
          labelKey: "STORE_MATERIAL_OPENNING_BALANCE_FINANCIAL_YEAR"
        },
        {
          style: {
            marginBottom: 18
          }
        }
      ),
      FinancialYearContainer: getCommonContainer({

  
        
        financialYear: getLabelWithValue(
          {
            labelName: "Supplier Name",
              labelKey: "STORE_MATERIAL_OPENNING_BALANCE_FINANCIAL_YEAR"
          },
          {  jsonPath: "materialReceipt[0].financialYear", }
        ),
        receivingStorecode: getLabelWithValue(
          { labelName: "Rate Type", labelKey: "STORE_DETAILS_STORE_NAME" },
          { jsonPath: "materialReceipt[0].receivingStore.name", }
        ),
        
      }),
    }),


    // View2: getCommonContainer({
    //   header2: getCommonTitle(
    //     {
    //       labelName: "Financial Year",
    //       labelKey: "STORE_MATERIAL_OPENNING_BALANCE_FINANCIAL_YEAR"
    //     },
    //     {
    //       style: {
    //         marginBottom: 18
    //       }
    //     }
    //   ),
    //  obmaterialContainer: openningbalenceCard,
    // }),
    // viewOne:getCommonContainer(
    //   {
    //     header2: getCommonTitle(
    //       {
    //         labelName: "Material Opening Balance",
    //         labelKey: "STORE_MATERIAL_OPENNING_BALANCE"
    //       },
    //       {
    //         style: {
    //           marginBottom: 18
    //         }
    //       }
    //     ),
    //     mate: getCommonContainer({
    //       openningbalenceCard

    //     }
    //     )
    //   }
    // )

 
    // View2: getCommonGrayCard({
    //   header2: getCommonTitle(
    //     {
    //       labelName: "Material Opening Balance",
    //       labelKey: "STORE_MATERIAL_OPENNING_BALANCE"
    //     },
    //     {
    //       style: {
    //         marginBottom: 18
    //       }
    //     }
    //   ),
    //   // OpeningBalanceContainer: getCommonContainer({
    //   //   financialYear: getLabelWithValue(
    //   //     {
    //   //       labelName: "Supplier Name",
    //   //         labelKey: "STORE_MATERIAL_OPENNING_BALANCE_FINANCIAL_YEAR"
    //   //     },
    //   //     {  jsonPath: "materialReceipt[0].financialYear", }
    //   //   ),
    //   //   financialYear: getLabelWithValue(
    //   //     {
    //   //       labelName: "Supplier Name",
    //   //         labelKey: "STORE_MATERIAL_OPENNING_BALANCE_FINANCIAL_YEAR"
    //   //     },
    //   //     {  jsonPath: "materialReceipt[0].financialYear", }
    //   //   ),
    //   //   MaterialName: {
    //   //     ...getSelectField({
    //   //       label: {
    //   //         labelName: "Material Nmae",
    //   //         labelKey: "STORE_MATERIAL_NAME"
    //   //       },
    //   //       placeholder: {
    //   //         labelName: "Select Material Name",
    //   //         labelKey: "STORE_MATERIAL_NAME_SELECT"
    //   //       },
    //   //       required: false,
           
    //   //       jsonPath: "materialReceipt[0].receiptDetails[0].material.code",
    //   //       sourceJsonPath: "material.materials",
    //   //       props: {
    //   //         optionValue: "code",
    //   //         optionLabel: "description",
    //   //       },
    //   //     })
    //   //   },

    //   //   LotNumber: {
    //   //     ...getTextField({
    //   //       label: {
    //   //         labelName: "Lot No.",
    //   //         labelKey: "STORE_MATERIAL_OPENNING_BALANCE_LOT_NO"
    //   //       },
    //   //       placeholder: {
    //   //         labelName: "Lot No.",
    //   //         labelKey: "STORE_MATERIAL_OPENNING_BALANCE_LOT_NO"
    //   //       },
    //   //       required: true,
    //   //       errorMessage:"STORE_VALIDATION_LOT_NUMBER",
    //   //       pattern: getPattern("Name") || null,
    //   //       jsonPath: "materialReceipt[0].receiptDetails[0].receiptDetailsAddnInfo[0].lotNo"
    //   //     })
    //   //   }, 
    //   //   ExpiryDate: {
    //   //     ...getDateField({
    //   //       label: {
    //   //         labelName: "Expiry Date",
    //   //         labelKey: "STORE_MATERIAL_OPENNING_BALANCE_EXPIRY_DATE"
    //   //       },
    //   //       placeholder: {
    //   //         labelName: "Expiry Date",
    //   //         labelKey: "STORE_MATERIAL_OPENNING_BALANCE_EXPIRY_DATE"
    //   //       },
    //   //       required: true,
    //   //       errorMessage:"STORE_VALIDATION_EXPIRY_DATE_SELECT",
    //   //       pattern: getPattern("Date") || null,
    //   //       jsonPath: "materialReceipt[0].receiptDetails[0].receiptDetailsAddnInfo[0].expiryDate",
    //   //       props: {
    //   //         inputProps: {
    //   //           min: new Date().toISOString().slice(0, 10),
    //   //         }
    //   //       }
    //   //     })
    //   //   }, 
    //   //   OpeningQty: {
    //   //     ...getTextField({
    //   //       label: {
    //   //         labelName: "Opening Qty",
    //   //         labelKey: "STORE_MATERIAL_OPENNING_BALANCE_OPENING_QTY"
    //   //       },
    //   //       placeholder: {
    //   //         labelName: "Opening Qty",
    //   //         labelKey: "STORE_MATERIAL_OPENNING_BALANCE_OPENING_QTY"
    //   //       },
    //   //       required: true,
    //   //       errorMessage:"STORE_VALIDATION_OPENING_QUANTITY",
    //   //       pattern: getPattern("Amount") || null,
    //   //       jsonPath: "materialReceipt[0].receiptDetails[0].userReceivedQty"
    //   //     })
    //   //   },
    //   //   OpeningRate: {
    //   //     ...getTextField({
    //   //       label: {
    //   //         labelName: "Opening Rate",
    //   //         labelKey: "STORE_MATERIAL_OPENNING_BALANCE_OPENING_RATE"
    //   //       },
    //   //       placeholder: {
    //   //         labelName: "Opening Rate",
    //   //         labelKey: "STORE_MATERIAL_OPENNING_BALANCE_OPENING_RATE"
    //   //       },
    //   //       required: true,
    //   //       errorMessage:"STORE_VALIDATION_OPENING_RATE",
    //   //       pattern: getPattern("Amount") || null,
    //   //       jsonPath: "materialReceipt[0].receiptDetails[0].unitRate"
    //   //     })
    //   //   },
    //   //   receiptNumber: {
    //   //     ...getTextField({
    //   //       label: {
    //   //         labelName: "Receipt No.",
    //   //         labelKey: "STORE_MATERIAL_OPENNING_BALANCE_RECEIPT_NO"
    //   //       },
    //   //       placeholder: {
    //   //         labelName: "Receipt No.",
    //   //         labelKey: "STORE_MATERIAL_OPENNING_BALANCE_RECEIPT_NO"
    //   //       },
    //   //       required: false,
    //   //       pattern: getPattern("Name") || null,
    //   //       jsonPath: "materialReceipt[0].receiptNumber"
    //   //     })
    //   //   }, 
    //   //   receiptDate: {
    //   //   ...getDateField({
    //   //     label: {
    //   //       labelName: "Receipt Date",
    //   //       labelKey: "STORE_MATERIAL_OPENNING_BALANCE_RECEIPT_DATE"
    //   //     },
    //   //     placeholder: {
    //   //       labelName: "Receipt Date",
    //   //       labelKey: "STORE_MATERIAL_OPENNING_BALANCE_RECEIPT_DATE"
    //   //     },
    //   //     required: true,
    //   //       errorMessage:"STORE_VALIDATION_RECEIPT_DATE_SELECT",
    //   //     pattern: getPattern("Date") || null,
    //   //     jsonPath: "materialReceipt[0].receiptDetails[0].receiptDetailsAddnInfo[0].receivedDate",
    //   //     props: {
    //   //       inputProps: {
    //   //         max: new Date().toISOString().slice(0, 10),
    //   //       }
    //   //     }
    //   //   })
    //   // },
    //   // remarks: {
    //   //   ...getTextField({
    //   //     label: {
    //   //       labelName: "Remarks",
    //   //       labelKey: "STORE_MATERIAL_INDENT_NOTE_REMARK"
    //   //     },
    //   //     placeholder: {
    //   //       labelName: "Remarks",
    //   //       labelKey: "STORE_MATERIAL_INDENT_NOTE_REMARK_PLACEHOLDER"
    //   //     },
    //   //     required: true,
    //   //       errorMessage:"STORE_VALIDATION_REMARK",
    //   //     props: {
    //   //       className: "applicant-details-error",
    //   //       multiline: "multiline",
    //   //       rowsMax: 2,
    //   //     },
    //   //     pattern: getSTOREPattern("Comment"),
    //   //     jsonPath: "materialReceipt[0].receiptDetails[0].remarks"
    //   //   })
    //   // }, 
       
    //   // })
    
    // }),
  
  });
};
