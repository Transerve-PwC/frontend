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
  import { getSearchResults, getCount } from "../../../../..//ui-utils/commons";
  import { handleScreenConfigurationFieldChange as handleField, prepareFinalObject,toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";
  import {
    searchApiCallAccountStatement
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
            xs: 14,
            sm: 6,
            align: "center"
          },
          required: true,
          jsonPath: "searchScreenFileNo.fileNumber",
          iconObj: {
            iconName: "search",
            position: "end",
            color: "#FE7A51",
            onClickDefination: {
              action: "condition",
              callBack: (state, dispatch) => {
                getAccountStatementProperty(state, dispatch);
              }
            }
          },
          title: {
            value:
              "If you have already assessed your property, then please search your property by your File Number",
            key: "If you have already assessed your property, then please search your property by your File Number"
          },
          infoIcon: "info_circle",
          afterFieldChange: (action, state, dispatch) => {
            dispatch(
                prepareFinalObject(
                  "searchScreen.sectorNumber",
                  ""
                )
              )
            dispatch(
                prepareFinalObject(
                  "searchScreen.category",
                  ""
                )
              )
              dispatch(
                prepareFinalObject(
                  "searchScreen.subCategory",
                  ""
                )
              )
              dispatch(
                prepareFinalObject(
                  "searchScreen.siteNumber",
                  ""
                )
              )
          }
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
            optionLabel: "name",
            sourceJsonPath: "searchScreenMdmsData.EstatePropertyService.categories",
            gridDefination: {
                xs: 12,
                sm: 6,
                align: "center"
            },
            errorMessage: "ES_ERR_CATEGORY_FIELD",
            beforeFieldChange: (action, state, dispatch) => {
              dispatch(
                prepareFinalObject(
                  "Properties[0].subcatvar",
                  []
                )
              )

              let categorySelected = action.value;
              let subcatvar = get(state.screenConfiguration.preparedFinalObject,"Properties[0].subcatvar");
              let mdmsCategory = get(state.screenConfiguration.preparedFinalObject,"searchScreenMdmsData.EstatePropertyService.categories")
            
              if(categorySelected === "CAT.RESIDENTIAL"){
                subcatvar = mdmsCategory.filter(item => !!item.SubCategory && item.code === "CAT.RESIDENTIAL")
                dispatch(
                  prepareFinalObject(
                    "Properties[0].subcatvar",
                    subcatvar
                  )
                )
                // set(state.screenConfiguration.preparedFinalObject,"Properties[0].subcatvar",subcatvar);
              }
              else if(categorySelected === "CAT.COMMERCIAL"){
                subcatvar = mdmsCategory.filter(item => !!item.SubCategory && item.code === "CAT.COMMERCIAL")
                dispatch(
                  prepareFinalObject(
                    "Properties[0].subcatvar",
                    subcatvar
                  )
                )
                // set(state.screenConfiguration.preparedFinalObject,"Properties[0].subcatvar",subcatvar);
                }
                else if(categorySelected === "CAT.INDUSTRIAL" || categorySelected === "CAT.INSTITUTIONAL" || categorySelected === "CAT.GOVPROPERTY" || categorySelected === "CAT.RELIGIOUS" || categorySelected === "CAT.HOSPITAL"){
                  dispatch(
                    prepareFinalObject(
                      "Properties[0].subcatvar",
                      ""
                    )
                  )
                  // let path = "components.div.children.estateApplicationAccountStatementGen.children.cardContent.children.searchBoxContainer.children.categoryContainer.children.subCategory"
                  // dispatch(
                  //   handleField(
                  //     "estate-search-account-statement",
                  //     path,
                  //     "visible",
                  //     true
                  //   )
                  // );
                  // set(state.screenConfiguration.preparedFinalObject,"Properties[0].subcatvar",subcatvar);
                }
                
            }
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
          optionLabel: "name",
          sourceJsonPath: "Properties[0].subcatvar[0].SubCategory",
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
            callBack: resetFields
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


  const getAccountStatementProperty = async (state, dispatch) => {
    try {
      const fileNumber = get(state.screenConfiguration.preparedFinalObject, "searchScreenFileNo.fileNumber")
      if(!!fileNumber) {
        const payload = await getPropertyDetails({
          state, dispatch, fileNumber, screenKey: "estate-search-account-statement",
          jsonPath: "searchScreenFileNo.fileNumber",
          componentJsonPath:"components.div.children.estateApplicationAccountStatementGen.children.cardContent.children.searchBoxContainer.children.fileNumber"
        })
        if(!!payload) {
          const {Properties} = payload;
          // const {owners = []} = Properties[0]
          // const findOwner = owners.find(item => !!item.activeState) || {}
          dispatch(
            prepareFinalObject(
              "searchScreen.sectorNumber",
              Properties[0].sectorNumber
            )
          )
          dispatch(
            prepareFinalObject(
              "searchScreen.category",
              Properties[0].category
            )
          )
          dispatch(
            prepareFinalObject(
              "searchScreen.subCategory",
              Properties[0].subCategory
            )
          )
          dispatch(
            prepareFinalObject(
              "searchScreen.siteNumber",
              Properties[0].siteNumber
            )
          )
          dispatch(
            prepareFinalObject(
              "searchScreen.propertyId",
              Properties[0].propertyDetails.propertyId
            )
          )
          // dispatch(
          //   prepareFinalObject(
          //     "searchScreen.ownername",
          //     findOwner.ownerDetails.name
          //   )
          // )
  
          dispatch(
            prepareFinalObject(
              "Properties",
              Properties
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
              labelKey: "ERR_PROPERTY_NOT_FOUND_WITH_PROPERTY_ID"
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

  function resetFields(state, dispatch) {
    dispatch(
      handleField(
        "estate-search-account-statement",
        "components.div.children.estateApplicationAccountStatementGen.children.cardContent.children.searchBoxContainer.children.dateContainer.children.from",
        "props.value",
        ""
      )
    )
    dispatch(
      handleField(
        "estate-search-account-statement",
        "components.div.children.estateApplicationAccountStatementGen.children.cardContent.children.searchBoxContainer.children.dateContainer.children.to",
        "props.value",
        ""
      )
    )
    dispatch(
      handleField(
        "estate-search-account-statement",
        "components.div.children.estateApplicationAccountStatementGen.children.cardContent.children.searchBoxContainer.children.fileNumberContainer.children.fileNumber",
        "props.value",
        ""
      )
    )
    dispatch(
      handleField(
        "estate-search-account-statement",
        "components.div.children.estateApplicationAccountStatementGen.children.cardContent.children.searchBoxContainer.children.categoryContainer.children.category",
        "props.value",
        ""
      )
    )
    dispatch(
      handleField(
        "estate-search-account-statement",
        "components.div.children.estateApplicationAccountStatementGen.children.cardContent.children.searchBoxContainer.children.categoryContainer.children.subCategory",
        "props.value",
        ""
      )
    )
    dispatch(
      handleField(
        "estate-search-account-statement",
        "components.div.children.estateApplicationAccountStatementGen.children.cardContent.children.searchBoxContainer.children.siteContainer.children.siteNumber",
        "props.value",
        ""
      )
    )
    dispatch(
      handleField(
        "estate-search-account-statement",
        "components.div.children.estateApplicationAccountStatementGen.children.cardContent.children.searchBoxContainer.children.fileNumberContainer.children.sectorNumber",
        "props.value",
        ""
      )
    )
  }