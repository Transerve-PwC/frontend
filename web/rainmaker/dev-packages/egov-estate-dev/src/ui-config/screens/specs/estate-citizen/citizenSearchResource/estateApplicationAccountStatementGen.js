import {
    getCommonCard,
    getCommonTitle,
    getTextField,
    getSelectField,
    getCommonContainer,
    getCommonParagraph,
    getPattern,
    getDateField,
    getLabel
  } from "egov-ui-framework/ui-config/screens/specs/utils";
  
  import {
    handleScreenConfigurationFieldChange as handleField
  } from "egov-ui-framework/ui-redux/screen-configuration/actions";
  import {
    searchApiCallAccountStatement
  } from "./searchAccountStatementFunction";
  import get from "lodash/get";
  import { getTodaysDateInYMD } from "../../utils";


export const estateApplicationAccountStatementGen = getCommonCard({
    
    searchBoxContainer: getCommonContainer({
    //   searchBy: searchBy,
      fileNumberContainer: getCommonContainer({
        fileNumber: getTextField({
          label: {
            labelName: "File Number",
            labelKey: "ES_FILE_NUMBER_LABEL"
          },
          placeholder: {
            labelName: "Enter File Number",
            labelKey: "ES_FILE_NUMBER_PLACEHOLDER"
          },
          gridDefination: {
            xs: 12,
            sm: 6,
            align: "center"
          },
          required: true,
          jsonPath: "searchScreenFileNo.fileNumber"
        }),
        sectorNumber: getSelectField({
            label: {
              labelName: "sector number",
              labelKey: "ES_SECTOR NUMBER_LABEL"
            },
            placeholder: {
              labelName: "Enter sector number",
              labelKey: "ES_SECTOR NUMBER_PLACEHOLDER"
            },
            // required: false,
            jsonPath: "Properties[0].sectorNumber",
            optionValue: "code",
            optionLabel: "label",
            sourceJsonPath: "applyScreenMdmsData.propertyTypes",
            gridDefination: {
                xs: 12,
                sm: 6
            },
            errorMessage: "ES_ERR_SECTOR_NUMBER_FIELD",
          })
      }),
      categoryContainer: getCommonContainer({
        category: getSelectField({
          label: {
            labelName: "Category",
            labelKey: "ES_CATEGORY_LABEL"
          },
          // placeholder: {
          //   labelName: "Enter Category",
          //   labelKey: "ES_CATEGORY_PLACEHOLDER"
          // },
          // required: false,
          jsonPath: "Properties[0].category",
            optionValue: "code",
            optionLabel: "label",
            sourceJsonPath: "applyScreenMdmsData.propertyTypes",
            gridDefination: {
                xs: 12,
                sm: 6,
                align: "center"
            },
            errorMessage: "ES_ERR_CATEGORY_FIELD"
        }),
        subCategory: getSelectField({
          label: {
            labelName: "Sub Category",
            labelKey: "ES_SUB_CATEGORY_LABEL"
          },
          placeholder: {
            labelName: "Enter Sub Category",
            labelKey: "ES_SUB_CATEGORY_PLACEHOLDER"
          },
          // required: false,
          jsonPath: "Properties[0].subCategory",
          optionValue: "code",
          optionLabel: "label",
          sourceJsonPath: "applyScreenMdmsData.propertyTypes",
          gridDefination: {
              xs: 12,
              sm: 6
          },
          errorMessage: "ES_ERR_SUB_CATEGORY_FIELD",
        }),
      }),
      siteContainer:getCommonContainer({
        siteNumber:getTextField({
            label: {
                labelName: "Site Number",
                labelKey: "ES_SITE_NUMBER_LABEL"
            },
            placeholder: {
                labelName: "Enter Site Number",
                labelKey: "ES_SITE_NUMBER_PLACEHOLDER"
            },
            jsonPath: "Properties[0].siteNumber",
            optionValue: "code",
            optionLabel: "label",
            sourceJsonPath: "applyScreenMdmsData.propertyTypes",
            gridDefination: {
                xs: 12,
                sm: 6,
                align: "center"
            },
            errorMessage: "ES_ERR_SITE_NUMBER_FIELD"
        }),
        dummy:getTextField({
          label: {
              labelName: "",
              labelKey: ""
          },
          placeholder: {
              labelName: "",
              labelKey: ""
          },
          jsonPath: "Properties[0].none",
          optionValue: "code",
          optionLabel: "label",
          sourceJsonPath: "applyScreenMdmsData.none",
          gridDefination: {
              xs: 12,
              sm: 6
          },
          errorMessage: "ES_ERR_SITE_NUMBER_FIELD"
      })
    }),
    dateContainer: getCommonContainer({
      from:getDateField({
        label: {
          labelName: "From",
          labelKey: "ES_FROM_DATE_LABEL"
      },
      placeholder: {
          labelName: "Enter From Date",
          labelKey: "ES_FROM_DATE_PLACEHOLDER"
      },
        pattern: getPattern("Date"),
        gridDefination:{
          xs: 12,
          sm: 6,
          align: "center"
        },
        required: true,
        jsonPath: "searchScreen.fromDate",
        props: {
            inputProps: {
                max: getTodaysDateInYMD()
            }
        }
      }),
      to:getDateField({
        label: {
          labelName: "To",
          labelKey: "ES_TO_DATE_LABEL"
      },
      placeholder: {
          labelName: "Enter To Date",
          labelKey: "ES_TO_DATE_PLACEHOLDER"
      },
      pattern: getPattern("Date"),
      required: true,
      jsonPath: "searchScreen.toDate",
      props: {
          inputProps: {
              max: getTodaysDateInYMD()
          }
      }
      })
    }),
    
    button: getCommonContainer({
      buttonContainer: getCommonContainer({
        resetButton: {
          componentPath: "Button",
          gridDefination: {
            xs: 6,
            sm: 6,
            align: "center"
          },
          props: {
            variant: "outlined",
            style: {
            //   color: "rgba(0, 0, 0, 0.6000000238418579)",
            //   borderColor: "rgba(0, 0, 0, 0.6000000238418579)",
              color: "white",
              backgroundColor: "rgba(85,85,85,1)",
              width: "70%",
              height: "48px",
              margin: "8px", 
            //   float: "right"
            }
          },
          children: {
            buttonLabel: getLabel({
              labelName: "Reset",
              labelKey: "ES_HOME_SEARCH_RESULTS_BUTTON_RESET"
            })
          },
          onClickDefination: {
            action: "condition",
            // callBack: resetFields
          }
        },
        searchButton: {
          componentPath: "Button",
          gridDefination: {
            xs: 6,
            sm: 6,
            align: "left"
          },
          props: {
            variant: "contained",
            style: {
              color: "white",
              margin: "8px",
              backgroundColor: "rgba(255,153,51,1)",
              borderRadius: "2px",
              width: "70%",
              height: "48px",
            //   align: "center"
                }
          },
          children: {
            buttonLabel: getLabel({
              labelName: "Generate Account Statement",
              labelKey: "ES_GENERATE_ACCOUNT_STATEMENT"
            })
          },
          onClickDefination: {
            action: "condition",
            callBack: searchApiCallAccountStatement
          }
        }
      })
    })
}),
  });
