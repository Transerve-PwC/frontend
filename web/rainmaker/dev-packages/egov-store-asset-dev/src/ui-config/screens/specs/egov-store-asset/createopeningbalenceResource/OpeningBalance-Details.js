import {
    getCommonCard,
    getCommonTitle,
    getTextField,
    getDateField,
    getSelectField,
    getCommonContainer,
    getCommonGrayCard,
    getPattern
  } from "egov-ui-framework/ui-config/screens/specs/utils";
  import {
     toggleSnackbar
  } from "egov-ui-framework/ui-redux/screen-configuration/actions";
 import { getTodaysDateInYMD } from "../../utils";
 import { getSTOREPattern} from "../../../../../ui-utils/commons";
 import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
 import set from "lodash/set";
 import get from "lodash/get";
 import { getUserInfo } from "egov-ui-kit/utils/localStorageUtils";
 const OpeningbalenceDetailsCard = {
  uiFramework: "custom-containers",
  componentPath: "MultiItem",
  props: {
    scheama: getCommonGrayCard({
      rltnDetailsCardContainer: getCommonContainer(
        {
          MaterialName: {
            ...getSelectField({
              label: {
                labelName: "Material Nmae",
                labelKey: "STORE_MATERIAL_NAME"
              },
              placeholder: {
                labelName: "Select Material Name",
                labelKey: "STORE_MATERIAL_NAME_SELECT"
              },
              required: true,             
              jsonPath: "materialReceipt[0].receiptDetails[0].material.code",
              sourceJsonPath: "material.materials",
              props: {
                optionValue: "code",
                optionLabel: "description",
              },
            })
          },
          MaterialoldCode: {
            ...getTextField({
              label: {
                labelName: "Material Old Code",
                labelKey: "STORE_MATERIAL_OLD_CODE"
              },
              placeholder: {
                labelName: "Material Old Code",
                labelKey: "STORE_MATERIAL_OLD_CODE"
              },
              required: false,
              visible:false,
              props:{
                disabled:true,
              },
              pattern: getPattern("Name") || null,
              jsonPath: "materialReceipt[0].receiptDetails[0].material.code"
            })
          },
          LotNumber: {
            ...getTextField({
              label: {
                labelName: "Lot No.",
                labelKey: "STORE_MATERIAL_OPENNING_BALANCE_LOT_NO"
              },
              placeholder: {
                labelName: "Lot No.",
                labelKey: "STORE_MATERIAL_OPENNING_BALANCE_LOT_NO"
              },
              required: false,
              errorMessage:"STORE_VALIDATION_LOT_NUMBER",
              pattern: getPattern("Name") || null,
              jsonPath: "materialReceipt[0].receiptDetails[0].lotNo"
            })
          }, 
          ExpiryDate: {
            ...getDateField({
              label: {
                labelName: "Expiry Date",
                labelKey: "STORE_MATERIAL_OPENNING_BALANCE_EXPIRY_DATE"
              },
              placeholder: {
                labelName: "Expiry Date",
                labelKey: "STORE_MATERIAL_OPENNING_BALANCE_EXPIRY_DATE"
              },
              required: true,
              errorMessage:"STORE_VALIDATION_EXPIRY_DATE_SELECT",
              pattern: getPattern("Date") || null,
              jsonPath: "materialReceipt[0].receiptDetails[0].expiryDate",
              props: {
                inputProps: {
                  min: new Date().toISOString().slice(0, 10),
                }
              }
            })
          }, 
          OpeningQty: {
            ...getTextField({
              label: {
                labelName: "Opening Qty",
                labelKey: "STORE_MATERIAL_OPENNING_BALANCE_OPENING_QTY"
              },
              placeholder: {
                labelName: "Opening Qty",
                labelKey: "STORE_MATERIAL_OPENNING_BALANCE_OPENING_QTY"
              },
              required: true,
              errorMessage:"STORE_VALIDATION_OPENING_QUANTITY",
              pattern: getPattern("Amount") || null,
              jsonPath: "materialReceipt[0].receiptDetails[0].userReceivedQty"
            })
          },
          OpeningRate: {
            ...getTextField({
              label: {
                labelName: "Opening Rate",
                labelKey: "STORE_MATERIAL_OPENNING_BALANCE_OPENING_RATE"
              },
              placeholder: {
                labelName: "Opening Rate",
                labelKey: "STORE_MATERIAL_OPENNING_BALANCE_OPENING_RATE"
              },
              required: true,
              errorMessage:"STORE_VALIDATION_OPENING_RATE",
              pattern: getPattern("Amount") || null,
              jsonPath: "materialReceipt[0].receiptDetails[0].unitRate"
            })
          },
          receiptNumber: {
            ...getTextField({
              label: {
                labelName: "Receipt No.",
                labelKey: "STORE_MATERIAL_OPENNING_BALANCE_RECEIPT_NO"
              },
              placeholder: {
                labelName: "Receipt No.",
                labelKey: "STORE_MATERIAL_OPENNING_BALANCE_RECEIPT_NO"
              },
              required: false,
              pattern: getPattern("Name") || null,
              jsonPath: "materialReceipt[0].receiptDetails[0].oldReceiptNumber"
            })
          }, 
          receiptDate: {
          ...getDateField({
            label: {
              labelName: "Receipt Date",
              labelKey: "STORE_MATERIAL_OPENNING_BALANCE_RECEIPT_DATE"
            },
            placeholder: {
              labelName: "Receipt Date",
              labelKey: "STORE_MATERIAL_OPENNING_BALANCE_RECEIPT_DATE"
            },
            required: true,
              errorMessage:"STORE_VALIDATION_RECEIPT_DATE_SELECT",
            pattern: getPattern("Date") || null,
            jsonPath: "materialReceipt[0].receiptDetails[0].receivedDate",
            props: {
              inputProps: {
                max: new Date().toISOString().slice(0, 10),
              }
            }
          })
        },
        remarks: {
          ...getTextField({
            label: {
              labelName: "Remarks",
              labelKey: "STORE_MATERIAL_INDENT_NOTE_REMARK"
            },
            placeholder: {
              labelName: "Remarks",
              labelKey: "STORE_MATERIAL_INDENT_NOTE_REMARK_PLACEHOLDER"
            },
            required: true,
              errorMessage:"STORE_VALIDATION_REMARK",
            props: {
              className: "applicant-details-error",
              multiline: "multiline",
              rowsMax: 2,
            },
            pattern: getSTOREPattern("Comment"),
            jsonPath: "materialReceipt[0].receiptDetails[0].remarks"
          })
        }, 
         
        },
        {
          style: {
            overflow: "visible"
          }
        }
      )
    }),
 
    items: [],
    addItemLabel: {
      labelName: "ADD",
      labelKey: "STORE_COMMON_ADD_BUTTON"
    },
    headerName: "Map Material Type to Store",
    headerJsonPath:
      "children.cardContent.children.header.children.head.children.Accessories.props.label",
    sourceJsonPath: "materialReceipt[0].receiptDetails",
    prefixSourceJsonPath:
      "children.cardContent.children.rltnDetailsCardContainer.children"
  },
  type: "array"
};
  export const OpeningBalanceDetails = getCommonCard({
    header: getCommonTitle(
      {
        labelName: "Material Opening Balance Details",
        labelKey: "STORE_MATERIAL_OPENNING_BALANCE_HEADER"
      },
      {
        style: {
          marginBottom: 18
        }
      }
    ),
    

    View1: getCommonGrayCard({
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

  
        financialYear: {
          ...getSelectField({
            label: { labelName: "Financial Year", labelKey: "STORE_MATERIAL_OPENNING_BALANCE_FINANCIAL_YEAR" },
            placeholder: {
              labelName: "Select Financial Year",
              labelKey: "STORE_MATERIAL_OPENNING_BALANCE_FINANCIAL_YEAR_SELECT"
            },
            required: true,           
            errorMessage:"STORE_VALIDATION_FINANCIAL_YEAR",
            jsonPath: "materialReceipt[0].financialYear",
            sourceJsonPath: "searchScreenMdmsData.egf-master.FinancialYear",
            props: {
             
              optionValue: "code",
              optionLabel: "name"
            },
          })
        },
       
        receivingStorecode: {
          ...getSelectField({
            label: {
              labelName: "Store Name",
              labelKey: "STORE_DETAILS_STORE_NAME"
            },
            placeholder: {
              labelName: "Select Store Name",
              labelKey: "STORE_DETAILS_STORE_NAME_SELECT"
            },
            required: true,
            errorMessage:"STORE_VALIDATION_STORE_SELECT",
            jsonPath: "materialReceipt[0].receivingStore.code",
            gridDefination: {
              xs: 12,
              sm: 4,
            },
            sourceJsonPath: "store.stores",
            props: {
              optionValue: "code",
              optionLabel: "name",
            },
          }),
          beforeFieldChange: (action, state, dispatch) => {
            let stores = get(state, "screenConfiguration.preparedFinalObject.store.stores",[]) 
             stores = stores.filter(x=>x.code == action.value)//.materialType.code
             const userInfo = JSON.parse(getUserInfo());
             let businessServiceName =''
             let businessService  = get(state, `screenConfiguration.preparedFinalObject.searchScreenMdmsData.store-asset.businessService`,[]) 
             // filter store based on login user role and assign business service
             let roles = userInfo.roles
             businessService = businessService.filter(x=>x.role === roles[0].code)
             if(businessService.length==1)
             businessServiceName =businessService[0].name;
            if(stores &&stores[0])
                  {
                    if(stores[0].department.deptCategory !== businessServiceName )
                    {
                      const errorMessage = {
                        labelName: "Select valid store",
                        labelKey: "STORE_OPENING_BALANCE_STORE_SELECTION_VALIDATION"
                      };
                      dispatch(toggleSnackbar(true, errorMessage, "warning"));
                    }
                  }
          }
        },
        
       
        
      }),
    }),
    View2: getCommonGrayCard({
      header2: getCommonTitle(
        {
          labelName: "Material Opening Balance",
          labelKey: "STORE_MATERIAL_OPENNING_BALANCE"
        },
        {
          style: {
            marginBottom: 18
          }
        }
      ),
      OpeningbalenceDetailsCard,
      // OpeningBalanceContainer: getCommonContainer({

       
      // })
    }),
  
  });