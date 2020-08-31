import {
    getCommonCard,
    getCommonTitle,
    getTextField,
    getDateField,
    getSelectField,
    getCommonContainer,
    getPattern
  } from "egov-ui-framework/ui-config/screens/specs/utils";
 import { getTodaysDateInYMD } from "../../utils";
 import {  handleScreenConfigurationFieldChange as handleField, prepareFinalObject  } from "egov-ui-framework/ui-redux/screen-configuration/actions";
  export const SupplierDetails = getCommonCard({
    header: getCommonTitle(
      {
        labelName: "Supplier Details",
        labelKey: "STORE_PRICE_SUPPLIER_DETAILS"
      },
      {
        style: {
          marginBottom: 18
        }
      }
    ),
    SupplierDetailsContainer: getCommonContainer({
      suppliercode: {
        ...getSelectField({
          label: {
            labelName: "Supplier Name",
            labelKey: "STORE_SUPPLIER_MASTER_SUPPLIER_NAME"
          },
          placeholder: {
            labelName: "Select Supplier Name",
            labelKey: "STORE_SUPPLIER_MASTER_NAME_SELECT"
          },
          required: true,
          jsonPath: "priceLists[0].supplier.code",
           sourceJsonPath: "supplier.suppliers",
           props: {
            // data: [
            //   {
            //     value: "Asset",
            //     label: "Asset"
            //   },
            //   {
            //     value: "Consumable",
            //     label: "Consumable"
            //   },
             
            // ],
            optionValue: "code",
            optionLabel: "name"
          },
        })
      },
      rateType: {
        ...getSelectField({
          label: { labelName: "Rate Type", labelKey: "STORE_PRICE_RATE_TYPE" },
          placeholder: {
            labelName: "Select Rate Type",
            labelKey: "STORE_PRICE_RATE_TYPE_SELECT"
          },
          required: true,
          jsonPath: "priceLists[0].rateType",
          sourceJsonPath: "createScreenMdmsData.store-asset.RateType",
        props: {
          // data: [
          //   {
          //     value: "DOT/DGS$ND/Tender/Quatation",
          //     label: "DOT/DGS$ND/Tender/Quatation"
          //   },
           
          // ],
          optionValue: "code",
          optionLabel: "name",
        },
        })
      },
      rateContractNumber: {
        ...getTextField({
          label: {
            labelName: "Rate Contract/Tender/Quatation No.",
            labelKey: "STORE_PRICE_RATE_CONTRACT_TENDER_QUATATION_NO"
          },
          placeholder: {
            labelName: "Rate Contract/Tender/Quatation No.",
            labelKey: "STORE_PRICE_RATE_CONTRACT_TENDER_QUATATION_NO"
          },
          required: true,
          pattern: getPattern("Name") || null,
          jsonPath: "priceLists[0].rateContractNumber"
        })
      },
      rateContractDate: {
        ...getDateField({
          label: {
            labelName: "Rate Contract/Tender/Quatation Date",
            labelKey: "STORE_PRICE_RATE_CONTRACT_TENDER_QUATATION_DATE"
          },
          placeholder: {
            labelName: "Rate Contract/Tender/Quatation Date",
            labelKey: "STORE_PRICE_RATE_CONTRACT_TENDER_QUATATION_DATE"
          },
          required: true,
          pattern: getPattern("Date") || null,
          jsonPath: "priceLists[0].rateContractDate",
          props: {
            inputProps: {
              max: new Date().toISOString().slice(0, 10),
            }
          }
        })
      },
      agreementNumber: {
        ...getTextField({
          label: {
            labelName: "Agrement No",
            labelKey: "STORE_PRICE_AGREMENT_NO"
          },
          placeholder: {
            labelName: "Agrement No",
            labelKey: "STORE_PRICE_AGREMENT_NO"
          },
          required: true,
          pattern: getPattern("Name") || null,
          jsonPath: "priceLists[0].agreementNumber"
        })
      },
      agreementDate: {
        ...getDateField({
          label: {
            labelName: "Agrement Date",
            labelKey: "STORE_PRICE_AGREMENT_DATE"
          },
          placeholder: {
            labelName: "Agrement Date",
            labelKey: "STORE_PRICE_AGREMENT_DATE"
          },
          required: true,
          pattern: getPattern("Date") || null,
          jsonPath: "priceLists[0].agreementDate",
          props: {
            inputProps: {
              max: new Date().toISOString().slice(0, 10),
            }
          }
        })
      },
      agreementStartDate: {
        ...getDateField({
          label: {
            labelName: "Agrement Start Date",
            labelKey: "STORE_PRICE_AGREMENT_START_DATE"
          },
          placeholder: {
            labelName: "Agrement Start Date",
            labelKey: "STORE_PRICE_AGREMENT_START_DATE"
          },
          required: true,
          pattern: getPattern("Date") || null,
          jsonPath: "priceLists[0].agreementStartDate",
          props: {
            inputProps: {
              max: new Date().toISOString().slice(0, 10),
            }
          }
        }),
        beforeFieldChange: (action, state, dispatch) => {

          let date = action.value;

          dispatch(
            handleField(
              "createpricelist",
              "components.div.children.formwizardFirstStep.children.SupplierDetails.children.cardContent.children.SupplierDetailsContainer.children.agreementEndDate",
              "props.inputProps",
              { min: new Date(date).toISOString().slice(0, 10)}
            )
          );
        }
      },
      agreementEndDate: {
        ...getDateField({
          label: {
            labelName: "Agrement End Date",
            labelKey: "STORE_PRICE_AGREMENT_END_DATE"
          },
          placeholder: {
            labelName: "Agrement End Date",
            labelKey: "STORE_PRICE_AGREMENT_END_DATE"
          },
          required: true,
          pattern: getPattern("Date") || null,
          jsonPath: "priceLists[0].agreementEndDate",
          props: {
            inputProps: {
              max: getTodaysDateInYMD()
            }
          }
        })
      },
      active: {
        uiFramework: "custom-containers-local",
        moduleName: "egov-store-asset",
        componentPath: "CheckboxContainer",
        jsonPath: "priceLists[0].active",
        gridDefination: {
          xs: 4,
        },
        isFieldValid: true,
        required: false,
  
        props: {
          content: "STORE_PRICE_ACTIVE",
          jsonPath: "searchScreen.active",
          screenName: "createpricelist",
          checkBoxPath:
            "components.div.children.searchForm.children.cardContent.children.searchFormContainer.children.active",
        },
      },
     
    })
  });