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
  import { getSearchResults, getCount } from "../../../../../ui-utils/commons";
  import { handleScreenConfigurationFieldChange as handleField, prepareFinalObject,toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";
  import {
    searchApiCallAccountStatement,generateAccountStatementMM
  } from "./searchAccountStatementFunction";
  import get from "lodash/get";
  import { getTodaysDateInYMD } from "../../utils";
import { set } from "lodash";


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
            sm: 6
          },
          required: true,
          jsonPath: "Properties[0].fileNumber",
        }),
        sectorNumber: getTextField({
            label: {
              labelName: "sector number",
              labelKey: "ES_SECTOR NUMBER_LABEL"
            },
            placeholder: {
              labelName: "Enter sector number",
              labelKey: "ES_SECTOR NUMBER_PLACEHOLDER"
            },
            required: false,
            props: {
              disabled: true
            },
            jsonPath: "Properties[0].sectorNumber",
            // optionValue: "code",
            // optionLabel: "label",
            sourceJsonPath: "Properties[0].sectorNumber",
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
          placeholder: {
            labelName: "Enter Category",
            labelKey: "ES_CATEGORY_PLACEHOLDER"
          },
          required: false,
          props: {
            disabled: true
          },
          jsonPath: "Properties[0].category",
            optionValue: "code",
            optionLabel: "name",
            sourceJsonPath: "searchScreenMdmsData.EstateServices.categories",
            gridDefination: {
                xs: 12,
                sm: 6
            },
            errorMessage: "ES_ERR_CATEGORY_FIELD",
        }),
        subCategory: getTextField({
          label: {
            labelName: "Sub Category",
            labelKey: "ES_SUB_CATEGORY_LABEL"
          },
          placeholder: {
            labelName: "Enter Sub Category",
            labelKey: "ES_SUB_CATEGORY_PLACEHOLDER"
          },
          // required: false,
          // jsonPath: "Properties[0].subCategory",
          jsonPath: "singleSubCategory",
          props: {
            disabled: true
          },
          // optionValue: "code",
          // optionLabel: "label",
          // sourceJsonPath: "Properties[0].subCategory",
          sourceJsonPath: "singleSubCategory",
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
                sm: 6
            },
            props: {
              disabled: true
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
          sm: 6
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
        firstCont: {
          uiFramework: "custom-atoms",
          componentPath: "Div",
          gridDefination: {
            xs: 12,
            sm: 4
          }
        },
        filterButton: {
          componentPath: "Button",
          gridDefination: {
            xs: 12,
            sm: 4
          },
          props: {
            variant: "contained",
            style: {
              color: "white",
              backgroundColor: "#fe7a51",
              borderRadius: "2px",
              width: "80%",
              height: "48px",
              margin: "0px 0px 20px 0px"      
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
        }, lastCont: {
          uiFramework: "custom-atoms",
          componentPath: "Div",
          gridDefination: {
            xs: 12,
            sm: 4
          }
        }
      })
    })
}),
  });

export const MMAccountStamentApplication = getCommonCard({   
  searchBoxContainer: getCommonContainer({
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
            sm: 6
          },
          required: true,
          jsonPath: "Properties[0].fileNumber",
        }),
        sectorNumber: getTextField({
            label: {
              labelName: "sector number",
              labelKey: "ES_SECTOR NUMBER_LABEL"
            },
            placeholder: {
              labelName: "Enter sector number",
              labelKey: "ES_SECTOR NUMBER_PLACEHOLDER"
            },
            required: false,
            props: {
              disabled: true
            },
            jsonPath: "Properties[0].sectorNumber",
            sourceJsonPath: "Properties[0].sectorNumber",
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
          placeholder: {
            labelName: "Enter Category",
            labelKey: "ES_CATEGORY_PLACEHOLDER"
          },
          required: false,
          props: {
            disabled: true
          },
          jsonPath: "Properties[0].category",
            optionValue: "code",
            optionLabel: "name",
            sourceJsonPath: "searchScreenMdmsData.EstateServices.categories",
            gridDefination: {
                xs: 12,
                sm: 6
            },
            errorMessage: "ES_ERR_CATEGORY_FIELD",
        }),
        subCategory: getTextField({
          label: {
            labelName: "Sub Category",
            labelKey: "ES_SUB_CATEGORY_LABEL"
          },
          placeholder: {
            labelName: "Enter Sub Category",
            labelKey: "ES_SUB_CATEGORY_PLACEHOLDER"
          },
          jsonPath: "singleSubCategory",
          props: {
            disabled: true
          },
          sourceJsonPath: "singleSubCategory",
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
                sm: 6
            },
            props: {
              disabled: true
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
          sm: 6
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
        firstCont: {
          uiFramework: "custom-atoms",
          componentPath: "Div",
          gridDefination: {
            xs: 12,
            sm: 4
          }
        },
        filterButton: {
          componentPath: "Button",
          gridDefination: {
            xs: 12,
            sm: 4
          },
          props: {
            variant: "contained",
            style: {
              color: "white",
              backgroundColor: "#fe7a51",
              borderRadius: "2px",
              width: "80%",
              height: "48px",
              margin: "0px 0px 20px 0px"      
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
            callBack: generateAccountStatementMM
          }
        }, lastCont: {
          uiFramework: "custom-atoms",
          componentPath: "Div",
          gridDefination: {
            xs: 12,
            sm: 4
          }
        }
      })
    })
}),
  });

  export const getAccountStatementProperty = async (state, dispatch) => {
    try {
      const fileNumber = get(state.screenConfiguration.preparedFinalObject, "Properties[0].fileNumber")
      if(!!fileNumber) {
        const payload = await getPropertyDetails({
          state, dispatch, fileNumber, screenKey: "estate-search-account-statement",
          jsonPath: "Properties[0].fileNumber",
          componentJsonPath:"components.div.children.estateApplicationAccountStatementGen.children.cardContent.children.searchBoxContainer.children.fileNumber"
        })
        if(!!payload) {
          const {Properties} = payload;
          
          dispatch(
            prepareFinalObject(
              "searchScreen.propertyId",
              Properties[0].propertyDetails.propertyId
            )
          )
          
          return Properties[0].propertyDetails.propertyId
        }
      }
    } catch (error) {
      dispatch(toggleSnackbar(true, { labelName: error.message }, "error"));
      return false
    }
  }

  export const getPropertyDetails = async ({state, dispatch, fileNumber, screenKey, componentJsonPath, jsonPath}) => {
    let queryObject = [
      { key: "fileNumber", value: fileNumber }
    ];
    const payload = await getSearchResults(queryObject)
    if (
      payload &&
      payload.Properties
    ) {
      if (!payload.Properties.length) {
        dispatch(
          toggleSnackbar(
            true,
            {
              labelName: "Property is not found with this File Number",
              labelKey: "ES_ERR_PROPERTY_NOT_FOUND_WITH_PROPERTY_ID"
            },
            "info"
          )
        );
        dispatch(
          prepareFinalObject(
            jsonPath,
            ""
          )
        )
        dispatch(
          handleField(
            screenKey,
            componentJsonPath,
            "props.value",
            ""
          )
        );
      } else {
        return payload
      }
    }
  }