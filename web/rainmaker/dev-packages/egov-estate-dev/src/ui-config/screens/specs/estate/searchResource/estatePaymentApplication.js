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
  import React from 'react';
  import store from "redux/store";
  import { httpRequest } from "../../../../../ui-utils/api";
  import { toggleSnackbar, prepareFinalObject, toggleSpinner } from "egov-ui-framework/ui-redux/screen-configuration/actions";
  import {
    handleScreenConfigurationFieldChange as handleField
  } from "egov-ui-framework/ui-redux/screen-configuration/actions";
  import { validateFields } from "../../utils/index";
  import { getTextToLocalMapping } from "../../utils/index";
  import get from "lodash/get";
  import {
    ESTATE_APPROVED_STATE
  } from "../../../../../ui-constants"
  
  const searchBy = {
    uiFramework: "custom-containers",
    componentPath: "RadioGroupContainer",
    gridDefination: {
      xs: 12,
      sm: 12,
    },
    props: {
      label: {
        name: "Search By",
        key: "ES_SEARCH_BY_LABEL"
      },
      buttons: [{
          labelName: "File No.",
          labelKey: "ES_FILE_NUMBER_LABEL",
          value: "File Number"
        },
        {
          label: "Site No.",
          labelKey: "ES_SITE_NUMBER_LABEL",
          value: "Site Number"
        }
      ],
      value: "File Number",
      jsonPath: "citizenSearchScreen.searchBy",
      required: true
    },
    required: true,
    jsonPath: "citizenSearchScreen.searchBy",
    beforeFieldChange: (action, state, dispatch) => {
      if (action.value) {
        if (action.value == "File Number") {
          let siteNumberContainerItems = ["category", "subCategory", "siteNumber", "sectorNumber"];
          dispatch(
            handleField(
              "estate-payment-search",
              "components.div.children.estateApplication.children.cardContent.children.searchBoxContainer.children.fileNumberContainer",
              "visible",
              true
            )
          )
  
          siteNumberContainerItems.map(item => {
            dispatch(
              handleField(
                "estate-payment-search",
                `components.div.children.estateApplication.children.cardContent.children.searchBoxContainer.children.siteNumberContainer.children.${item}`,
                "visible",
                false
              )
            )
          })
          
        }
        else {
          let siteNumberContainerItems = ["category", "siteNumber", "sectorNumber"];
          dispatch(
            handleField(
              "estate-payment-search",
              "components.div.children.estateApplication.children.cardContent.children.searchBoxContainer.children.fileNumberContainer",
              "visible",
              false
            )
          )
          siteNumberContainerItems.map(item => {
            dispatch(
              handleField(
                "estate-payment-search",
                `components.div.children.estateApplication.children.cardContent.children.searchBoxContainer.children.siteNumberContainer.children.${item}`,
                "visible",
                true
              )
            )
          })
        }
      }
    }
  };
  export const estateApplication = getCommonCard({
    subParagraph: getCommonParagraph({
      labelName: "Provide at least one parameter to search for a property",
      labelKey: "ES_HOME_SEARCH_RESULTS_DESC"
    }),
    searchBoxContainer: getCommonContainer({
      searchBy: searchBy,
      fileNumberContainer: getCommonContainer({
        fileNumber: getTextField({
          label: {
            labelName: "File No.",
            labelKey: "ES_FILE_NUMBER_LABEL"
          },
          placeholder: {
            labelName: "Enter File No.",
            labelKey: "ES_FILE_NUMBER_PLACEHOLDER"
          },
          gridDefination: {
            xs: 12,
            sm: 4
          },
          required: true,
          jsonPath: "searchScreenFileNo.fileNumber"
        })
      }),
      siteNumberContainer: getCommonContainer({
        category: getSelectField({
          label: {
              labelName: "Category",
              labelKey: "ES_CATEGORY_LABEL"
          },
          placeholder: {
              labelName: "Select Category",
              labelKey: "ES_CATEGORY_PLACEHOLDER"
          },
          visible: false,
          required: true,
          jsonPath: "searchScreenSiteNo.category",
          sourceJsonPath: "searchScreenMdmsData.EstateServices.categories",
          gridDefination: {
              xs: 12,
              sm: 6
          },
          beforeFieldChange: (action, state, dispatch) => {
              if (action.value == "CAT.RESIDENTIAL"  || action.value == "CAT.COMMERCIAL") {
                dispatch(
                    handleField(
                        "estate-payment-search",
                        "components.div.children.estateApplication.children.cardContent.children.searchBoxContainer.children.siteNumberContainer.children.subCategory",
                        "visible",
                        true
                    )
                );
    
                const categories = get(
                    state.screenConfiguration.preparedFinalObject,
                    "searchScreenMdmsData.EstateServices.categories"
                )
    
                const filteredCategory = categories.filter(item => item.code === action.value)
                dispatch(
                    handleField(
                        "estate-payment-search",
                        "components.div.children.estateApplication.children.cardContent.children.searchBoxContainer.children.siteNumberContainer.children.subCategory",
                        "props.data",
                        filteredCategory[0].SubCategory
                    )
                )
            }
            else {
              dispatch(
                handleField(
                    "estate-payment-search",
                    "components.div.children.estateApplication.children.cardContent.children.searchBoxContainer.children.siteNumberContainer.children.subCategory",
                    "visible",
                    false
                )
            );
            }
          }
        }),
        subCategory: getSelectField({
          label: {
            labelName: "Sub Category",
            labelKey: "ES_SUBCATEGORY_LABEL"
          },
          placeholder: {
              labelName: "Select Sub Category",
              labelKey: "ES_SUBCATEGORY_PLACEHOLDER"
          },
          required: true,
          jsonPath: "searchScreenSiteNo.subCategory",
          visible: false,
          gridDefination: {
              xs: 12,
              sm: 6
          }
        }),
        siteNumber: getTextField({
          label: {
            labelName: "Site Number",
            labelKey: "ES_SITE_NUMBER_LABEL"
          },
          placeholder: {
              labelName: "Enter Site Number",
              labelKey: "ES_SITE_NUMBER_PLACEHOLDER"
          },
          gridDefination: {
              xs: 12,
              sm: 6
          },
          required: true,
          visible: false,
          minLength: 1,
          maxLength: 50,
          jsonPath: "searchScreenSiteNo.siteNumber"
        }),
        sectorNumber: getSelectField({
          label: {
              labelName: "Sector Number",
              labelKey: "ES_SECTOR_NUMBER_LABEL"
          },
          placeholder: {
              labelName: "Select Sector Number",
              labelKey: "ES_SECTOR_NUMBER_PLACEHOLDER"
          },
          // required: true,
          visible: false,
          jsonPath: "searchScreenSiteNo.sectorNumber",
          sourceJsonPath: "searchScreenMdmsData.EstateServices.SectorNumber",
          gridDefination: {
              xs: 12,
              sm: 6
          }
        }),
      })
    }),
    button: getCommonContainer({
      buttonContainer: getCommonContainer({
        resetButton: {
          componentPath: "Button",
          gridDefination: {
            xs: 6,
            sm: 6
          },
          props: {
            variant: "outlined",
            style: {
              color: "rgba(0, 0, 0, 0.6000000238418579)",
              borderColor: "rgba(0, 0, 0, 0.6000000238418579)",
              width: "70%",
              height: "48px",
              margin: "8px",
              float: "right"
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
            sm: 6
          },
          props: {
            variant: "contained",
            style: {
              color: "white",
              margin: "8px",
              backgroundColor: "rgba(0, 0, 0, 0.6000000238418579)",
              borderRadius: "2px",
              width: "70%",
              height: "48px"
            }
          },
          children: {
            buttonLabel: getLabel({
              labelName: "Search",
              labelKey: "ES_HOME_SEARCH_RESULTS_BUTTON_SEARCH"
            })
          },
          onClickDefination: {
            action: "condition",
            callBack: (state, dispatch) => searchApiCall(state, dispatch, [{key: "state",value: ESTATE_APPROVED_STATE}])
          }
        }
      })
    })
  });
  
  function resetFields(state, dispatch) {
    dispatch(
      handleField(
        "estate-payment-search",
        "components.div.children.estateApplication.children.cardContent.children.searchBoxContainer.children.fileNumberContainer.children.fileNumber",
        "props.value",
        ""
      )
    )
    dispatch(
      handleField(
        "estate-payment-search",
        "components.div.children.estateApplication.children.cardContent.children.searchBoxContainer.children.siteNumberContainer.children.category",
        "props.value",
        ""
      )
    )
    dispatch(
      handleField(
        "estate-payment-search",
        "components.div.children.estateApplication.children.cardContent.children.searchBoxContainer.children.siteNumberContainer.children.subCategory",
        "props.value",
        ""
      )
    )
    dispatch(
      handleField(
        "estate-payment-search",
        "components.div.children.estateApplication.children.cardContent.children.searchBoxContainer.children.siteNumberContainer.children.siteNumber",
        "props.value",
        ""
      )
    )
    dispatch(
      handleField(
        "estate-payment-search",
        "components.div.children.estateApplication.children.cardContent.children.searchBoxContainer.children.siteNumberContainer.children.sectorNumber",
        "props.value",
        ""
      )
    )
  }

  export const searchApiCall = async (state, dispatch, queryObject = [], offset, limit = 100, hideTable = true) => {
    dispatch(toggleSpinner());
    !!hideTable && showHideTable(false, dispatch);
     queryObject = [...queryObject,
      {
        key: "offset",
        value: offset
      },
      {
        key: "limit",
        value: limit
      }
    ];
    queryObject = queryObject.filter(({
      value
    }) => !!value)
    
    const searchBy = get(
      state.screenConfiguration.screenConfig,
      "estate-payment-search.components.div.children.estateApplication.children.cardContent.children.searchBoxContainer.children.searchBy.props.value",
      ""
    )
    var searchScreenObject;
    if (searchBy == "File Number") {
      searchScreenObject = get(
        state.screenConfiguration.preparedFinalObject,
        "searchScreenFileNo", {}
      );
      var isSearchBoxValid = validateFields(
        "components.div.children.estateApplication.children.cardContent.children.searchBoxContainer.children.fileNumberContainer.children",
        state,
        dispatch,
        "estate-payment-search"
      );
    }
    else {
      searchScreenObject = get(
        state.screenConfiguration.preparedFinalObject,
        "searchScreenSiteNo", {}
      );
      var isSearchBoxValid = validateFields(
        "components.div.children.estateApplication.children.cardContent.children.searchBoxContainer.children.siteNumberContainer.children",
        state,
        dispatch,
        "estate-payment-search"
      );
    }
  
  
  
    if (!isSearchBoxValid) {
      dispatch(
        toggleSnackbar(
          true, {
            labelName: "Please fill valid fields to start search",
            labelKey: "ES_ERR_FILL_VALID_FIELDS"
          },
          "warning"
        )
      );
      dispatch(toggleSpinner());
    } else if ((Object.keys(searchScreenObject).length == 0 || Object.values(searchScreenObject).every(x => x === ""))) {
      dispatch(
        toggleSnackbar(
          true, {
            labelName: "Please fill at least one field to start search",
            labelKey: "ES_ERR_FILL_ONE_FIELDS"
          },
          "warning"
        )
      );
      dispatch(toggleSpinner());
    }
    else {
      for (var key in searchScreenObject) {
        if (
          searchScreenObject.hasOwnProperty(key) &&
          searchScreenObject[key].trim() !== ""
        ) {
            queryObject.push({
              key: key,
              value: searchScreenObject[key].trim()
            });
        }
      }
  
      const response = await getSearchResults(queryObject);
      try {
        const length = response.Properties.length
        dispatch(
          handleField(
            "estate-payment-search",
            "components.div.children.searchResults",
            "props.count",
            length
          )
        );
        dispatch(prepareFinalObject("Properties", response.Properties));
  
        dispatch(
          handleField(
            "estate-payment-search",
            "components.div.children.searchResults",
            "props.title",
            `${getTextToLocalMapping(
              "Search Results for Properties"
            )} (${length})`
          )
        );
        let applyButtonStyle = {
          "background-color": "#FE7A51",
          "color": "#fff",
          "height": "30px",
          "padding": "6px 16px",
          "width": "83px"
        }
  
        let data = response.Properties.map(item => ({
          [getTextToLocalMapping("Action")]: React.createElement('div', {style: applyButtonStyle}, "SELECT"),
          [getTextToLocalMapping("File No")]: item.fileNumber || "-",
          [getTextToLocalMapping("Site Number")]: item.siteNumber,
          [getTextToLocalMapping("Owner Name")]: !!item.propertyDetails.owners ? item.propertyDetails.owners.map(item => item.ownerDetails.ownerName).join(",") || "-" : "-",
          ["propertyId"]: item.propertyDetails.propertyId
        }));
  
        dispatch(
          handleField(
            "estate-payment-search",
            "components.div.children.searchResults",
            "props.data",
            data
          )
        );
        !!hideTable && showHideTable(true, dispatch);
        dispatch(toggleSpinner());
      } catch (error) {
        dispatch(toggleSnackbar(true, error.message, "error"));
        console.log(error);
        dispatch(toggleSpinner());
      }
    }
  };
  
  const showHideTable = (booleanHideOrShow, dispatch) => {
    dispatch(
      handleField(
        "estate-payment-search",
        "components.div.children.searchResults",
        "visible",
        booleanHideOrShow
      )
    );
  };

  export const getSearchResults = async queryObject => {
    try {
      const response = await httpRequest(
        "post",
        "/est-services/property-master/_search",
        "",
        queryObject
      );
      return response;
    } catch (error) {
      store.dispatch(
        toggleSnackbar(
          true,
          { labelName: error.message, labelKey: error.message },
          "error"
        )
      );
    }
  };