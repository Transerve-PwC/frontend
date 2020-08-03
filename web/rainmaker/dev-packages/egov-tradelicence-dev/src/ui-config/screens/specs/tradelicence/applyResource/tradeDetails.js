import {
  getCommonCard,
  getCommonGrayCard,
  getCommonTitle,
  getCommonSubHeader,
  getTextField,
  getDateField,
  getSelectField,
  getCommonContainer,
  getPattern
} from "egov-ui-framework/ui-config/screens/specs/utils";
import {
  getIconStyle,
  objectToDropdown,
  getTodaysDateInYMD,
  getFinancialYearDates,
  getNextMonthDateInYMD,
  setFilteredTradeTypes,
  getUniqueItemsFromArray,
  fillOldLicenseData,
  getTradeTypeDropdownData,
  getDetailsForOwner, 
  calculateAge
} from "../../utils";
import {
  prepareFinalObject as pFO,
  toggleSnackbar,
  prepareFinalObject
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { handleScreenConfigurationFieldChange as handleField } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import get from "lodash/get";
import filter from "lodash/filter";
import { getQueryArg, getLocaleLabels } from "egov-ui-framework/ui-utils/commons";
import { getUserInfo } from "egov-ui-kit/utils/localStorageUtils";
import set from "lodash/set";
import { RC_PEDAL_RICKSHAW_LOADING_REHRI, DL_PEDAL_RICKSHAW_LOADING_REHRI, LICENSE_DHOBI_GHAT, RENEWAL_RENT_DEED_SHOP } from "../../../../../ui-constants";
import { getRelationshipRadioButton } from "./tradeOwnerDetails";

const tradeLicenseType = getQueryArg(window.location.href, "tlType");
const applicationNumber = getQueryArg(window.location.href, "applicationNumber");

let userInfo = JSON.parse(getUserInfo());

const tradeUnitCard = {
  uiFramework: "custom-containers",
  componentPath: "MultiItem",
  props: {
      scheama: getCommonGrayCard({
          header: getCommonSubHeader(
              {
                  labelName: "Trade Unit  ",
                  labelKey: "TL_NEW_TRADE_DETAILS_TRADE_UNIT_HEADER"
              },
              {
                  style: {
                      marginBottom: 18
                  }
              }
          ),
          tradeUnitCardContainer: getCommonContainer(
              {
                  tradeCategory: {
                      ...getSelectField({
                          label: {
                              labelName: "Trade Category",
                              labelKey: "TL_NEW_TRADE_DETAILS_TRADE_CAT_LABEL"
                          },
                          placeholder: {
                              labelName: "Select Trade Category",
                              labelKey: "TL_NEW_TRADE_DETAILS_TRADE_CAT_PLACEHOLDER"
                          },
                          required: true,
                          jsonPath: "LicensesTemp.tradeUnits[0].tradeType",
                          localePrefix: {
                              moduleName: "TRADELICENSE",
                              masterName: "TRADETYPE"
                          },
                          props: {
                              jsonPathUpdatePrefix: "LicensesTemp.tradeUnits",
                              setDataInField: true
                          },
                          sourceJsonPath:
                              "applyScreenMdmsData.TradeLicense.TradeTypeTransformed",
                          gridDefination: {
                              xs: 12,
                              sm: 4
                          }
                      }),
                      beforeFieldChange: (action, state, dispatch) => {
                          try {
                              dispatch(
                                  pFO(
                                      "applyScreenMdmsData.TradeLicense.TradeCategoryTransformed",
                                      objectToDropdown(
                                          get(
                                              state.screenConfiguration.preparedFinalObject,
                                              `applyScreenMdmsData.TradeLicense.filteredTradeTypeTree.${
                                              action.value
                                              }`,
                                              []
                                          )
                                      )
                                  )
                              );
                              let componentPath = action.componentJsonpath.split(".");

                              let index = action.componentJsonpath
                                  .split("[")[1]
                                  .split("]")[0];
                              componentPath.pop();
                              componentPath.push("tradeType");
                              componentPath = componentPath.join(".");
                              dispatch(
                                  handleField(
                                      "apply",
                                      componentPath,
                                      "props.data",
                                      objectToDropdown(
                                          get(
                                              state.screenConfiguration.preparedFinalObject,
                                              `applyScreenMdmsData.TradeLicense.filteredTradeTypeTree.${
                                              action.value
                                              }`,
                                              []
                                          )
                                      )
                                  )
                              );
                              let tradeCat = get(
                                  state.screenConfiguration.preparedFinalObject,
                                  `LicensesTemp.tradeUnits[${parseInt(index)}].tradeType`
                              );
                              if (tradeCat != action.value) {
                                  dispatch(
                                      pFO(
                                          `LicensesTemp.tradeUnits[${parseInt(
                                              index
                                          )}].tradeSubType`,
                                          ""
                                      )
                                  );
                                  dispatch(
                                      pFO(
                                          `Licenses[0].tradeLicenseDetail.tradeUnits[${parseInt(
                                              index
                                          )}].tradeType`,
                                          ""
                                      )
                                  );
                              }
                          } catch (e) {
                              console.log(e);
                          }
                      }
                  },
                  tradeType: {
                      ...getSelectField({
                          label: {
                              labelName: "Trade Type",
                              labelKey: "TL_NEW_TRADE_DETAILS_TRADE_TYPE_LABEL"
                          },
                          placeholder: {
                              labelName: "Select Trade Type",
                              labelKey: "TL_NEW_TRADE_DETAILS_TRADE_TYPE_PLACEHOLDER"
                          },
                          required: true,
                          localePrefix: {
                              moduleName: "TRADELICENSE",
                              masterName: "TRADETYPE"
                          },
                          jsonPath: "LicensesTemp.tradeUnits[0].tradeSubType",
                          props: {
                              jsonPathUpdatePrefix: "LicensesTemp.tradeUnits"
                          },
                          sourceJsonPath:
                              "applyScreenMdmsData.TradeLicense.TradeCategoryTransformed",
                          gridDefination: {
                              xs: 12,
                              sm: 4
                          }
                      }),
                      beforeFieldChange: (action, state, dispatch) => {
                          try {
                              let cardIndex = action.componentJsonpath
                                  .split("items[")[1]
                                  .split("]")[0];
                              let tradeCategory = get(
                                  state.screenConfiguration.preparedFinalObject,
                                  `LicensesTemp.tradeUnits[${cardIndex}].tradeType`,
                                  ""
                              );
                              dispatch(
                                  pFO(
                                      "applyScreenMdmsData.TradeLicense.TradeSubCategoryTransformed",
                                      get(
                                          state.screenConfiguration.preparedFinalObject,
                                          `applyScreenMdmsData.TradeLicense.filteredTradeTypeTree.${tradeCategory}.${
                                          action.value
                                          }`,
                                          []
                                      )
                                  )
                              );
                              let componentPath = action.componentJsonpath.split(".");
                              componentPath.pop();
                              componentPath.push("tradeSubType");
                              componentPath = componentPath.join(".");
                              dispatch(
                                  handleField(
                                      "apply",
                                      componentPath,
                                      "props.data",
                                      get(
                                          state.screenConfiguration.preparedFinalObject,
                                          `applyScreenMdmsData.TradeLicense.filteredTradeTypeTree.${tradeCategory}.${
                                          action.value
                                          }`,
                                          []
                                      )
                                  )
                              );
                          } catch (e) {
                              console.log(e);
                          }
                      }
                  },
                  tradeSubType: {
                      uiFramework: "custom-containers-local",
                      moduleName: "egov-tradelicence",
                      componentPath: "AutosuggestContainer",
                      jsonPath: "Licenses[0].tradeLicenseDetail.tradeUnits[0].tradeType",
                      required: true,
                      gridDefination: {
                          xs: 12,
                          sm: 4
                      },
                      props: {
                          style: {
                              width: "100%",
                              cursor: "pointer"
                          },
                          label: {
                              labelName: "Trade Sub-Type",
                              labelKey: "TL_NEW_TRADE_DETAILS_TRADE_SUBTYPE_LABEL"
                          },
                          placeholder: {
                              labelName: "Select Trade Sub-Type",
                              labelKey: "TL_NEW_TRADE_DETAILS_TRADE_SUBTYPE_PLACEHOLDER"
                          },
                          jsonPath:
                              "Licenses[0].tradeLicenseDetail.tradeUnits[0].tradeType",
                          sourceJsonPath:
                              "applyScreenMdmsData.TradeLicense.TradeSubCategoryTransformed",
                          setDataInField: true,
                          labelsFromLocalisation: true,
                          localePrefix: {
                              moduleName: "TRADELICENSE",
                              masterName: "TRADETYPE"
                          },
                          fullwidth: true,
                          required: true,
                          inputLabelProps: {
                              shrink: true
                          }
                      },
                      beforeFieldChange: (action, state, dispatch) => {
                          try {
                              let cardIndex = action.componentJsonpath
                                  .split("items[")[1]
                                  .split("]")[0];
                              const tradeSubTypes = get(
                                  state.screenConfiguration,
                                  "preparedFinalObject.Licenses[0].tradeLicenseDetail.tradeUnits",
                                  []
                              );
                              const alreadySelected =
                                  tradeSubTypes &&
                                  tradeSubTypes.find((item, i) => {
                                      if (item.tradeType === action.value && cardIndex != i)
                                          return true;
                                  });
                              if (alreadySelected) {
                                  dispatch(
                                      toggleSnackbar(
                                          true,
                                          {
                                              labelName:
                                                  "This trade type is already selected, Please select another",
                                              labelKey: "TL_TRADE_TYPE_ALREADY_SELECTED"
                                          },
                                          "warning"
                                      )
                                  );

                                  action.value = null;
                              } else {
                                  let tradeType = get(
                                      state.screenConfiguration.preparedFinalObject,
                                      `LicensesTemp.tradeUnits[${cardIndex}].tradeType`,
                                      ""
                                  );
                                  let tradeCategory = get(
                                      state.screenConfiguration.preparedFinalObject,
                                      `LicensesTemp.tradeUnits[${cardIndex}].tradeSubType`,
                                      ""
                                  );
                                  let tradeSubCategories = get(
                                      state.screenConfiguration.preparedFinalObject,
                                      `applyScreenMdmsData.TradeLicense.filteredTradeTypeTree.${tradeType}.${tradeCategory}`,
                                      []
                                  );
                                  tradeSubCategories = getUniqueItemsFromArray(
                                      tradeSubCategories,
                                      "code"
                                  );
                                  let currentObject = filter(tradeSubCategories, {
                                      code: action.value
                                  });
                                  if (currentObject[0].uom !== null) {
                                      dispatch(
                                          handleField(
                                              "apply",
                                              action.componentJsonpath.replace(
                                                  "tradeSubType",
                                                  "tradeUOM"
                                              ),
                                              "props.value",
                                              currentObject[0].uom
                                          )
                                      );
                                      dispatch(
                                          handleField(
                                              "apply",
                                              action.componentJsonpath.replace(
                                                  "tradeSubType",
                                                  "tradeUOMValue"
                                              ),
                                              "props.required",
                                              true
                                          )
                                      );
                                      dispatch(
                                          handleField(
                                              "apply",
                                              action.componentJsonpath.replace(
                                                  "tradeSubType",
                                                  "tradeUOMValue"
                                              ),
                                              "props.disabled",
                                              false
                                          )
                                      );
                                  } else {
                                      dispatch(
                                          handleField(
                                              "apply",
                                              action.componentJsonpath.replace(
                                                  "tradeSubType",
                                                  "tradeUOMValue"
                                              ),
                                              "props.required",
                                              false
                                          )
                                      );

                                      dispatch(
                                          handleField(
                                              "apply",
                                              action.componentJsonpath.replace(
                                                  "tradeSubType",
                                                  "tradeUOMValue"
                                              ),
                                              "props.disabled",
                                              true
                                          )
                                      );

                                      dispatch(
                                          handleField(
                                              "apply",
                                              action.componentJsonpath.replace(
                                                  "tradeSubType",
                                                  "tradeUOM"
                                              ),
                                              "props.value",
                                              ""
                                          )
                                      );
                                      dispatch(
                                          handleField(
                                              "apply",
                                              action.componentJsonpath.replace(
                                                  "tradeSubType",
                                                  "tradeUOMValue"
                                              ),
                                              "props.value",
                                              ""
                                          )
                                      );

                                      dispatch(
                                          pFO(
                                              `Licenses[0].tradeLicenseDetail.tradeUnits[${cardIndex}].uom`,
                                              null
                                          )
                                      );
                                      dispatch(
                                          pFO(
                                              `Licenses[0].tradeLicenseDetail.tradeUnits[${cardIndex}].uomValue`,
                                              null
                                          )
                                      );
                                      dispatch(
                                          handleField(
                                              "apply",
                                              action.componentJsonpath.replace(
                                                  "tradeSubType",
                                                  "tradeUOMValue"
                                              ),
                                              "props.error",
                                              false
                                          )
                                      );
                                  }
                              }
                          } catch (e) {
                              console.log(e);
                          }
                      }
                  },
                  tradeUOM: getTextField({
                      label: {
                          labelName: "UOM (Unit of Measurement)",
                          labelKey: "TL_NEW_TRADE_DETAILS_UOM_LABEL"
                      },
                      placeholder: {
                          labelName: "UOM",
                          labelKey: "TL_NEW_TRADE_DETAILS_UOM_UOM_PLACEHOLDER"
                      },
                      // required: true,
                      props: {
                          disabled: true
                      },
                      jsonPath: "Licenses[0].tradeLicenseDetail.tradeUnits[0].uom",
                      gridDefination: {
                          xs: 12,
                          sm: 4
                      }
                  }),
                  tradeUOMValue: getTextField({
                      label: {
                          labelName: "UOM Value",
                          labelKey: "TL_NEW_TRADE_DETAILS_UOM_VALUE_LABEL"
                      },
                      placeholder: {
                          labelName: "Enter UOM Value",
                          labelKey: "TL_NEW_TRADE_DETAILS_UOM_VALUE_PLACEHOLDER"
                      },
                      required: true,
                      props: {
                          disabled: true,
                          setDataInField: true,
                          jsonPath: "Licenses[0].tradeLicenseDetail.tradeUnits[0].uomValue"
                      },
                      pattern: getPattern("UOMValue"),
                      jsonPath: "Licenses[0].tradeLicenseDetail.tradeUnits[0].uomValue",
                      gridDefination: {
                          xs: 12,
                          sm: 4
                      }
                  })
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
          labelName: "ADD TRADE UNITS",
          labelKey: "TL_ADD_TRADE_UNITS"
      },
      headerName: "TradeUnits",
      headerJsonPath:
          "children.cardContent.children.header.children.head.children.Accessories.props.label",
      sourceJsonPath: "Licenses[0].tradeLicenseDetail.tradeUnits",
      prefixSourceJsonPath:
          "children.cardContent.children.tradeUnitCardContainer.children",
      onMultiItemAdd: (state, muliItemContent) => {
          return setFieldsOnAddItem(state, muliItemContent);
      }
  },
  type: "array"
};

const accessoriesCard = {
  uiFramework: "custom-containers",
  componentPath: "MultiItem",
  props: {
      scheama: getCommonGrayCard({
          header: {
              uiFramework: "custom-atoms",
              componentPath: "Container",
              children: {
                  head: getCommonSubHeader(
                      {
                          labelName: "Accessories",
                          labelKey: "TL_NEW_TRADE_DETAILS_HEADER_ACC"
                      },
                      {
                          style: {
                              marginBottom: 18
                          }
                      }
                  ),
                  ico: {
                      uiFramework: "custom-molecules-local",
                      moduleName: "egov-tradelicence",
                      componentPath: "Tooltip",
                      props: {
                          val: {
                              value: "Accessories Information",
                              key: "TL_ACCESSORIES_TOOLTIP_MESSAGE"
                          },
                          style: getIconStyle("headerIcon")
                      }
                  }
              }
          },
          accessoriesCardContainer: getCommonContainer({
              accessoriesName: {
                  ...getSelectField({
                      label: {
                          labelName: "Accessories",
                          labelKey: "TL_NEW_TRADE_DETAILS_ACC_LABEL"
                      },
                      placeholder: {
                          labelName: "Select Accessories",
                          labelKey: "TL_NEW_TRADE_DETAILS_ACC_PLACEHOLDER"
                      },
                      localePrefix: {
                          moduleName: "TRADELICENSE",
                          masterName: "ACCESSORIESCATEGORY"
                      },
                      jsonPath:
                          "Licenses[0].tradeLicenseDetail.accessories[0].accessoryCategory",
                      sourceJsonPath:
                          "applyScreenMdmsData.TradeLicense.AccessoriesCategory",
                      gridDefination: {
                          xs: 12,
                          sm: 4
                      }
                  }),
                  beforeFieldChange: (action, state, dispatch) => {
                      try {
                          let accessories = get(
                              state.screenConfiguration.preparedFinalObject,
                              `applyScreenMdmsData.TradeLicense.AccessoriesCategory`,
                              []
                          );
                          let currentObject = filter(accessories, {
                              code: action.value
                          });
                          const currentUOMField = get(
                              state.screenConfiguration.screenConfig.apply,
                              action.componentJsonpath,
                              []
                          );
                          var jsonArr = currentUOMField.jsonPath.split(".");
                          jsonArr.pop();

                          let currentUOMValueFieldPath = action.componentJsonpath.split(
                              "."
                          );
                          currentUOMValueFieldPath.pop();
                          currentUOMValueFieldPath = currentUOMValueFieldPath.join(".");
                          if (currentObject[0].uom) {
                              dispatch(
                                  handleField(
                                      "apply",
                                      `${currentUOMValueFieldPath}.accessoriesUOM`,
                                      "props.value",
                                      currentObject[0].uom
                                  )
                              );
                              dispatch(
                                  handleField(
                                      "apply",
                                      `${currentUOMValueFieldPath}.accessoriesUOMValue`,
                                      "props.disabled",
                                      false
                                  )
                              );
                              dispatch(
                                  handleField(
                                      "apply",
                                      `${currentUOMValueFieldPath}.accessoriesUOMValue`,
                                      "required",
                                      true
                                  )
                              );
                          } else {
                              dispatch(
                                  handleField(
                                      "apply",
                                      `${currentUOMValueFieldPath}.accessoriesUOMValue`,
                                      "required",
                                      false
                                  )
                              );
                              dispatch(
                                  handleField(
                                      "apply",
                                      `${currentUOMValueFieldPath}.accessoriesUOM`,
                                      "props.value",
                                      ""
                                  )
                              );
                              dispatch(
                                  handleField(
                                      "apply",
                                      `${currentUOMValueFieldPath}.accessoriesUOMValue`,
                                      "props.value",
                                      ""
                                  )
                              );
                              dispatch(
                                  handleField(
                                      "apply",
                                      `${currentUOMValueFieldPath}.accessoriesUOMValue`,
                                      "props.disabled",
                                      true
                                  )
                              );
                              dispatch(pFO(`${jsonArr.join(".")}.uom`, null));
                              dispatch(pFO(`${jsonArr.join(".")}.uomValue`, null));
                          }
                          if (action.value) {
                              dispatch(
                                  handleField(
                                      "apply",
                                      `${currentUOMValueFieldPath}.accessoriesCount`,
                                      "props.disabled",
                                      false
                                  )
                              );
                          } else {
                              dispatch(
                                  handleField(
                                      "apply",
                                      `${currentUOMValueFieldPath}.accessoriesCount`,
                                      "props.disabled",
                                      true
                                  )
                              );
                          }
                      } catch (e) {
                          console.log(e);
                      }
                  }
              },
              accessoriesUOM: getTextField({
                  label: {
                      labelName: "UOM (Unit of Measurement)",
                      labelKey: "TL_NEW_TRADE_DETAILS_UOM_LABEL"
                  },
                  placeholder: {
                      labelName: "UOM",
                      labelKey: "TL_NEW_TRADE_DETAILS_UOM_UOM_PLACEHOLDER"
                  },
                  // required: true,
                  props: {
                      disabled: true
                  },
                  jsonPath: "Licenses[0].tradeLicenseDetail.accessories[0].uom",
                  gridDefination: {
                      xs: 12,
                      sm: 4
                  }
              }),
              accessoriesUOMValue: {
                  ...getTextField({
                      label: {
                          labelName: "UOM Value",
                          labelKey: "TL_NEW_TRADE_DETAILS_UOM_VALUE_LABEL"
                      },
                      placeholder: {
                          labelName: "Enter UOM Value",
                          labelKey: "TL_NEW_TRADE_DETAILS_UOM_VALUE_PLACEHOLDER"
                      },
                      pattern: getPattern("UOMValue"),
                      props: {
                          disabled: true,
                          setDataInField: true,
                          jsonPath: "Licenses[0].tradeLicenseDetail.accessories[0].uomValue"
                      },
                      required: true,
                      jsonPath: "Licenses[0].tradeLicenseDetail.accessories[0].uomValue",
                      gridDefination: {
                          xs: 12,
                          sm: 4
                      }
                  })
              },
              accessoriesCount: {
                  ...getTextField({
                      label: {
                          labelName: "Accessory Count",
                          labelKey: "TL_NEW_TRADE_ACCESSORY_COUNT"
                      },
                      placeholder: {
                          labelName: "Enter accessory count",
                          labelKey: "TL_NEW_TRADE_ACCESSORY_COUNT_PLACEHOLDER"
                      },
                      pattern: getPattern("NoOfEmp"),
                      props: {
                          setDataInField: true,
                          jsonPath: "Licenses[0].tradeLicenseDetail.accessories[0].count",
                          disabled: true
                      },
                      required: true,
                      defaultValue: 1,
                      jsonPath: "Licenses[0].tradeLicenseDetail.accessories[0].count",
                      gridDefination: {
                          xs: 12,
                          sm: 4
                      }
                  })
              }
          })
      }),
      onMultiItemAdd: (state, muliItemContent) => {
          return setFieldsOnAddItem(state, muliItemContent);
      },
      items: [],
      addItemLabel: {
          labelName: "ADD ACCESSORIES",
          labelKey: "TL_NEW_TRADE_DETAILS_BUTTON_NEW_ACC"
      },
      headerName: "Accessory",
      headerJsonPath:
          "children.cardContent.children.header.children.head.children.Accessories.props.label",
      sourceJsonPath: "Licenses[0].tradeLicenseDetail.accessories",
      prefixSourceJsonPath:
          "children.cardContent.children.accessoriesCardContainer.children"
  },
  type: "array"
};

const headerObj = getCommonTitle(
  {
      labelName: "Trade Details",
      labelKey: "TL_TRADE_DETAILS_HEADER"
  },
  {
      style: {
					marginBottom: 18,
					marginTop: 18
      }
  }
)

const ownerHeaderObj = getCommonTitle({
    labelName: "Owner Details",
    labelKey: "TL_OWNER_DETAILS_HEADER" 
},
{
    style: {
                  marginBottom: 18,
                  marginTop: 18
    }
})

const applicantNameField = {
  label: {
      labelName: "Applicant Name",
      labelKey: "TL_APPLICANT_NAME_LABEL"
  },
  placeholder: {
      labelName: "Enter Applicant Name",
      labelKey: "TL_APPLICANT_NAME_PLACEHOLDER"
  },
  gridDefination: {
      xs: 12,
      sm: 6
  },
  minLength: 1,
  maxLength: 100,
  required: true,
  errorMessage: "TL_ERR_APPLICANT_NAME",
  jsonPath: "Licenses[0].tradeLicenseDetail.owners[0].name"
}

const applicationTypeField = {
  label: {
      labelName: "Application Type",
      labelKey: "TL_APPLICATION_TYPE_LABEL"
  },
  placeholder: {
      labelName: "Select Application Type",
      labelKey: "TL_APPLICATION_TYPE_PLACEHOLDER"
  },
  required: true,
  errorMessage: "TL_ERR_APPLICATION_TYPE",
  visible: false,
  jsonPath: "Licenses[0].applicationType",
  sourceJsonPath: "applyScreenMdmsData.TradeLicense.ApplicationType",
  gridDefination: {
      xs: 12,
      sm: 6
  }
}

const tradeLicenseTypeField = {
    label: {
        labelName: "License Type",
        labelKey: "TL_TRADE_TYPE_LABEL"
    },
    placeholder: {
        labelName: "Select License Type",
        labelKey: "TL_TRADE_TYPE_PLACEHOLDER"
    },
    required: true,
    errorMessage: "TL_ERR_LICENSE_TYPE",
    jsonPath: "Licenses[0].myLicenseType",
    optionValue: "code",
    optionLabel: "label",
    sourceJsonPath: "applyScreenMdmsData.TradeLicense.tradeTypes",
    gridDefination: {
        xs: 12,
        sm: 6
    }
}

const serviceTypeField = {
    label: {
        labelName: "Service Type",
        labelKey: "TL_SERVICE_TYPE_LABEL"
    },
    placeholder: {
        labelName: "Select Service Type",
        labelKey: "TL_SERVICE_TYPE_PLACEHOLDER"
    },
    required: true,
    errorMessage: "TL_ERR_SERVICE_TYPE",
    jsonPath: "Licenses[0].businessService",
    optionValue: "code",
    optionLabel: "label",
    data: [],
    gridDefination: {
        xs: 12,
        sm: 6 
    }
}


const oldLicenseNumberField = {
  label: {
      labelName: "Old License Number",
      labelKey: "TL_OLD_LICENSE_NUMBER_LABEL"
  },
  placeholder: {
      labelName: "Enter License Number",
      labelKey: "TL_OLD_LICENSE_NUMBER_PLACEHOLDER"
  },
  gridDefination: {
      xs: 12,
      sm: 6
  },
  minLength: 1,
  maxLength: 100,
  required: true,
  errorMessage: "TL_ERR_OLD_LICENSE_NUMBER",
  visible: false,
  jsonPath: "Licenses[0].oldLicenseNumber"
}

const oldLicenseValidToField = {
  label: {
      labelName: "Old License Validity Date",
      labelKey: "TL_OLD_LICENSE_VALIDITY_DATE_LABEL"
  },
  placeholder: {
      labelName: "Enter Old License Validity Date",
      labelKey: "TL_OLD_LICENSE_VALIDITY_DATE_PLACEHOLDER"
  },
  pattern: getPattern("Date"),
  jsonPath: "Licenses[0].tradeLicenseDetail.additionalDetail.oldLicenseValidTo",
  required: true,
  errorMessage: "TL_ERR_OLD_LICENSE_VALIDTO",
  visible: false,
  props: {
      inputProps: {
          max: getTodaysDateInYMD()
      }
  }
}

const fatherOrHusbandsNameField = {
  label: {
      labelName: "Father/ Husband's Name",
      labelKey: "TL_FATHER_OR_HUSBANDS_NAME_LABEL"
  },
  placeholder: {
      labelName: "Enter Father/ Husband's Name",
      labelKey: "TL_FATHER_OR_HUSBANDS_NAME_NAME_PLACEHOLDER"
  },
  gridDefination: {
      xs: 12,
      sm: 6
  },
  minLength: 1,
  maxLength: 100,
  required: true,
  errorMessage: "TL_ERR_FATHER_OR_HUSBAND",
  jsonPath: "Licenses[0].tradeLicenseDetail.owners[0].fatherOrHusbandName"
}

const occupationField = {
  label: {
      labelName: "Occupation",
      labelKey: "TL_OCCUPATION_LABEL"
  },
  placeholder: {
      labelName: "Enter Occupation",
      labelKey: "TL_OCCUPATION_PLACEHOLDER"
  },
  gridDefination: {
      xs: 12,
      sm: 6
  },
  minLength: 1,
  maxLength: 100,
  visible: false,
  required: true,
  errorMessage: "TL_ERR_OCCUPATION",
  jsonPath: "Licenses[0].tradeLicenseDetail.additionalDetail.occupation"
}

const fullAddressField = {
  label: {
      labelName: "Full Address",
      labelKey: "TL_FULL_ADDRESS_LABEL"
  },
  placeholder: {
      labelName: "Enter Full Address",
      labelKey: "TL_FULL_ADDRESS_PLACEHOLDER"
  },
  minLength: 1,
  maxLength: 100,
  props:{
        multiline: true,
        rows: "2"
      },
  required: true,
  visible: false,
  errorMessage:"TL_ERR_FULL_ADDRESS",
  jsonPath: "Licenses[0].tradeLicenseDetail.owners[0].permanentAddress"
}

const dateOfBirthField = {
  label: {
      labelName: "Date of Birth",
      labelKey: "TL_DOB_LABEL"
  },
  placeholder: {
      labelName: "Enter Date of Birth",
      labelKey: "TL_DOB_PLACEHOLDER"
  },
  required: true,
  errorMessage: "TL_ERR_DATE_OF_BIRTH",
  pattern: getPattern("Date"),
  jsonPath: "Licenses[0].tradeLicenseDetail.owners[0].dob",
  props: {
      inputProps: {
          max: getTodaysDateInYMD()
      }
  },
  beforeFieldChange: (action, state, dispatch) => {
    if (action.value) {
        let age = calculateAge(action.value);

        dispatch(
            handleField(
                "apply",
                "components.div.children.formwizardFirstStep.children.ownerDetails.children.cardContent.children.detailsContainer.children.age",
                "props.value",
                age ? age : ""
            )
        )
    }
  }
}

const ageField = {
  label: {
      labelName: "Age",
      labelKey: "TL_AGE_LABEL"
  },
  placeholder: {
      labelName: "Enter Age",
      labelKey: "TL_AGE_PLACEHOLDER"
  },
  required: true,
  props: { disabled: true },
  jsonPath: "Licenses[0].tradeLicenseDetail.owners[0].age",
  beforeFieldChange: (action, state, dispatch) => {
    const licenseType = get(state.screenConfiguration.preparedFinalObject,
        "Licenses[0].businessService","")
		if (licenseType === DL_PEDAL_RICKSHAW_LOADING_REHRI) {
				dispatch(
					handleField(
							"apply",
							"components.div.children.formwizardFirstStep.children.tradeDetails.children.cardContent.children.detailsContainer.children._licensePeriod",
							"props.value",
							action.value > 50 ? "5" : "15"
					)
				); 			
        }
        if(licenseType === RC_PEDAL_RICKSHAW_LOADING_REHRI) {
            if(action.value > 50) {
                dispatch(
                    handleField(
                            "apply",
                            "components.div.children.formwizardFirstStep.children.tradeDetails.children.cardContent.children.detailsContainer.children.licensePeriod",
                            "props.value",
                            "5"
                    )
                );
                dispatch(
                    handleField(
                            "apply",
                            "components.div.children.formwizardFirstStep.children.tradeDetails.children.cardContent.children.detailsContainer.children.licensePeriod",
                            "props.disabled",
                            true
                    )
                );
            } else {
                dispatch(
                    handleField(
                            "apply",
                            "components.div.children.formwizardFirstStep.children.tradeDetails.children.cardContent.children.detailsContainer.children.licensePeriod",
                            "props.disabled",
                            false
                    )
                );
            }
        }
	}
}

const licensePeriodField = {
  label: {
      labelName: "License Period",
      labelKey: "TL_LICENSE_PERIOD_LABEL"
  },
  placeholder: {
      labelName: "Enter Period for which License is required",
      labelKey: "TL_LICENSE_PERIOD_PLACEHOLDER"
  },
  errorMessage: "TL_ERR_LICENCE_PERIOD",
  required: true,
  visible: false,
  optionValue: "code",
  optionLabel: "label",
  jsonPath: "Licenses[0].tradeLicenseDetail.additionalDetail.licensePeriod",
  props: {
      data: [{
        code: "5",
        label: `5 ${getLocaleLabels("TL_LOCALIZATION_YEARS", "TL_LOCALIZATION_YEARS")}`
      }, {
        code: "10",
        label: `10 ${getLocaleLabels("TL_LOCALIZATION_YEARS", "TL_LOCALIZATION_YEARS")}`
      }, {
        code: "15",
        label: `15 ${getLocaleLabels("TL_LOCALIZATION_YEARS", "TL_LOCALIZATION_YEARS")}`
      }]
  },
//   sourceJsonPath: "applyScreenMdmsData.TradeLicense.LicensePeriod",
  gridDefination: {
      xs: 12,
      sm: 6
  }
}

const mobileNumberField = {
  label: {
      labelName: "Mobile No.",
      labelKey: "TL_MOBILE_NO_LABEL"
  },
  placeholder: {
      labelName: "Enter Mobile No.",
      labelKey: "TL_MOBILE_NO_PLACEHOLDER"
  },
  required: true,
  pattern: getPattern("MobileNo"),
  props: {
    value: userInfo.userName,
    disabled: true
  },
  jsonPath: "Licenses[0].tradeLicenseDetail.owners[0].mobileNumber",
//   iconObj: {
//       iconName: "search",
//       position: "end",
//       color: "#FE7A51",
//       onClickDefination: {
//           action: "condition",
//           callBack: (state, dispatch, fieldInfo) => {
//               getDetailsForOwner(state, dispatch, fieldInfo);
//           }
//       }
//   },
//   title: {
//       value: "Please search owner profile linked to the mobile no.",
//       key: "TL_MOBILE_NO_TOOLTIP_MESSAGE"
//   },
//   infoIcon: "info_circle"
}

const emailAddressField = {
  label: {
      labelName: "Email",
      labelKey: "TL_EMAIL_LABEL"
  },
  placeholder: {
      labelName: "Enter Email",
      labelKey: "TL_EMAIL_PLACEHOLDER"
  },
  pattern: getPattern("Email"),
  props: {
      value: userInfo.emailId,
      disabled: true
  },
  jsonPath: "Licenses[0].tradeLicenseDetail.owners[0].emailId"
}

const particularsOfAreaField = {
  label: {
      labelName: "Particulars of the area required for washing clothes",
      labelKey: "TL_PARTICULARS_OF_AREA"
  },
  placeholder: {
      labelName: "Enter particulars of the area required for washing clothes",
      labelKey: "TL_PARTICULARS_OF_AREA_PLACEHOLDER"
  },
  errorMessage: "TL_ERR_PARTICULARS_OF_AREA",
  required: true,
  visible: false,
  minLength: 1,
  maxLength: 100,
  props:{
    multiline: true,
    rows: "2"
  },
  jsonPath: "Licenses[0].tradeLicenseDetail.additionalDetail.particularsOfArea"
}

const tradeField = {
    label: {
        labelName: "Trade",
        labelKey: "TL_TRADE_LABEL"
    },
    placeholder: {
        labelName: "Enter Trade",
        labelKey: "TL_TRADE_PLACEHOLDER"
    },
    maxLength: 100,
    visible: false,
    errorMessage: "TL_ERR_TRADE",
    required: true,
    jsonPath: "Licenses[0].tradeLicenseDetail.additionalDetail.tradeValue"
}

const completeResidentialAddressField = {
    label: {
        labelName: "Complete Residential Address",
        labelKey: "TL_COMPLETE_RESIDENTIAL_ADDRESS_LABEL"
    },
    placeholder: {
        labelName: "Enter Complete Residential Address",
        labelKey: "TL_COMPLETE_RESIDENTIAL_ADDRESS_PLACEHOLDER"
    },
    visible: false,
    minLength: 1,
    maxLength: 100,
    errorMessage: "TL_ERR_COMPLETE_ADDRESS",
    required: true,
    props:{
        multiline: true,
        rows: "2"
    },
    jsonPath: "Licenses[0].tradeLicenseDetail.address.addressLine1"
}

const permanentAddressField = {
    label: {
        labelName: "Permanent Address",
        labelKey: "TL_PERMANENT_ADDRESS_LABEL"
    },
    placeholder: {
        labelName: "Enter Permanent Address",
        labelKey: "TL_PERMANENT_ADDRESS_PLACEHOLDER"
    },
    visible: false,
    minLength: 1,
    maxLength: 100,
    required: true,
    errorMessage: "TL_ERR_PERMANENT_ADDRESS",
    props:{
        multiline: true,
        rows: "2"
    },
    jsonPath: "Licenses[0].tradeLicenseDetail.owners[0].permanentAddress"
}

const platformNumberField = {
    label: {
        labelName: "Platform/Shop Number",
        labelKey: "TL_PLATFORM_NUMBER_LABEL"
    },
    placeholder: {
        labelName: "Enter Platform/Shop Number",
        labelKey: "TL_PLATFORM_NUMBER_PLACEHOLDER"
    },
    pattern: getPattern("familyMonthlyIncome"),
    visible: false,
    minLength: 1,
    maxLength: 100,
    required: true,
    errorMessage: "TL_ERR_PLATFORM_NUMBER",
    jsonPath: "Licenses[0].tradeLicenseDetail.additionalDetail.platformNumber"
}

const placeOfWorkField = {
    label: {
        labelName: "Place of Work",
        labelKey: "TL_PLACE_OF_WORK_LABEL"
    },
    placeholder: {
        labelName: "Enter Place of Work",
        labelKey: "TL_PLACE_OF_WORK_PLACEHOLDER"
    },
    visible: false,
    minLength: 1,
    maxLength: 100,
    required: true,
    errorMessage: "TL_ERR_PLACE_OF_WORK",
    jsonPath: "Licenses[0].tradeLicenseDetail.additionalDetail.placeOfWork"
}

const businessStartDateField = {
    label: {
        labelName: "Date from when doing Business at Site",
        labelKey: "TL_BUSINESS_START_DATE_LABEL"
    },
    placeholder: {
        labelName: "Enter Date from when doing Business at Site",
        labelKey: "TL_BUSINESS_START_DATE_PLACEHOLDER"
    },
    pattern: getPattern("Date"),
    jsonPath: "Licenses[0].tradeLicenseDetail.additionalDetail.businessStartDate",
    required: true,
    errorMessage: "TL_ERR_BUSINESS_START_DATE",
    visible: false,
    props: {
        inputProps: {
            max: getTodaysDateInYMD()
        }
    }
}

const familyMonthlyIncomeField = {
    label: {
        labelName: "Family Monthly Income from all Sources",
        labelKey: "TL_FAMILY_MONTHLY_INCOME_LABEL"
    },
    placeholder: {
        labelName: "Enter Family Monthly Income from all Sources",
        labelKey: "TL_FAMILY_MONTHLY_INCOME_PLACEHOLDER"
    },
    visible: false,
    required: true,
    errorMessage: "TL_ERR_FAMILY_INCOME",
    pattern: getPattern("familyMonthlyIncome"),
    jsonPath: "Licenses[0].tradeLicenseDetail.additionalDetail.familyMonthlyIncome"
}


export const changeDocuments = (action, state, dispatch, licenseType) => {
    const types = get(state.screenConfiguration.preparedFinalObject.applyScreenMdmsData, "TradeLicense.MdmsTradeType") || [];
    const trade = get(state.screenConfiguration.preparedFinalObject, "Licenses[0].businessService");
    const applicationType = get(state.screenConfiguration.preparedFinalObject, "Licenses[0].applicationType");
    const type = licenseType || trade;
    const value = action.value === "New" || action.type === "Renew" ? action.value : applicationType || "New";
    const {applicationDocument: tradeType = []} = types.length ? types
                      .find(item => item.code === type) || types[0] : {}
    let documents = !!tradeType.length ? (!!value ? 
                        tradeType.find(item => item.applicationType === value) 
                        : tradeType[0]).documentList || [] : [];
    documents = documents.map((item) => ({
        type : item.code,
        description: {
          labelName: "Only .jpg and .pdf files. 6MB max file size.",
          labelKey: item.fileType || "TL_UPLOAD_RESTRICTIONS"
        },
        formatProps :{
          accept : item.accept || "image/*, .pdf, .png, .jpeg",
        }, 
        maxFileSize: 6000,
        downloadUrl: item.downloadUrl,
        moduleName: "tl-services",
        statement: {
            labelName: "Allowed documents are Aadhar Card / Voter ID Card / Driving License",
            labelKey: item.description
        }
      }))
      dispatch(
        handleField(
            "apply",
            "components.div.children.formwizardThirdStep.children.tradeDocumentDetails.children.cardContent.children.documentList",
            "props.inputProps",
            documents
        )
    );
    }

export const ownerDetails = getCommonCard(buildOwnerDetailsObj())

function buildOwnerDetailsObj() {
    return {
        header: ownerHeaderObj,
        detailsContainer: getCommonContainer({
            applicantName: getTextField(applicantNameField),
            dateOfBirth: getDateField(dateOfBirthField),
            fatherOrHusbandsName: getTextField(fatherOrHusbandsNameField),
            relationShip: getRelationshipRadioButton,
            occupation: getTextField(occupationField),
            fullAddress: getTextField(fullAddressField),
            age: getTextField(ageField),
            completeResidentialAddress: getTextField(completeResidentialAddressField),
            permanentAddress: getTextField(permanentAddressField),
            familyMonthlyIncome: getTextField(familyMonthlyIncomeField),
            mobileNumber: getTextField(mobileNumberField),
            emailAddress: getTextField(emailAddressField)
        })
    }
}

export const tradeDetails = getCommonCard(buildTradeDetailsObj())

export const showHideFields = (action, state, dispatch, data = {}) => {
    const {applicationType = false, licensePeriod = false , occupation = false, fullAddress = false, completeResidentialAddress = false, permanentAddress = false, familyMonthlyIncome = false, trade = false, particularsOfArea = false, platformNumber = false, placeOfWork = false, businessStartDate = false, _licensePeriod = false} = data

    dispatch(
        handleField(
            "apply",
            "components.div.children.formwizardFirstStep.children.tradeDetails.children.cardContent.children.detailsContainer.children.applicationType",
            "visible",
            applicationType
        )
    );
    dispatch(
        handleField(
            "apply",
            "components.div.children.formwizardFirstStep.children.tradeDetails.children.cardContent.children.detailsContainer.children.licensePeriod",
            "visible",
            licensePeriod
        )
    );
    dispatch(
        handleField(
            "apply",
            "components.div.children.formwizardFirstStep.children.tradeDetails.children.cardContent.children.detailsContainer.children._licensePeriod",
            "visible",
            _licensePeriod
        )
    );
    dispatch(
        handleField(
            "apply",
            "components.div.children.formwizardFirstStep.children.ownerDetails.children.cardContent.children.detailsContainer.children.occupation",
            "visible",
            occupation
        )
    );
    dispatch(
        handleField(
            "apply",
            "components.div.children.formwizardFirstStep.children.ownerDetails.children.cardContent.children.detailsContainer.children.fullAddress",
            "visible",
            fullAddress
        )
    );

    dispatch(
        handleField(
            "apply",
            "components.div.children.formwizardFirstStep.children.ownerDetails.children.cardContent.children.detailsContainer.children.completeResidentialAddress",
            "visible",
            completeResidentialAddress
        )
    );
    dispatch(
        handleField(
            "apply",
            "components.div.children.formwizardFirstStep.children.ownerDetails.children.cardContent.children.detailsContainer.children.permanentAddress",
            "visible",
            permanentAddress
        )
    );
    dispatch(
        handleField(
            "apply",
            "components.div.children.formwizardFirstStep.children.ownerDetails.children.cardContent.children.detailsContainer.children.familyMonthlyIncome",
            "visible",
            familyMonthlyIncome
        )
    );

    dispatch(
        handleField(
            "apply",
            "components.div.children.formwizardFirstStep.children.tradeDetails.children.cardContent.children.detailsContainer.children.trade",
            "visible",
            trade
        )
    );
    dispatch(
        handleField(
            "apply",
            "components.div.children.formwizardFirstStep.children.tradeDetails.children.cardContent.children.detailsContainer.children.particularsOfArea",
            "visible",
            particularsOfArea
        )
    );
    dispatch(
        handleField(
            "apply",
            "components.div.children.formwizardFirstStep.children.tradeDetails.children.cardContent.children.detailsContainer.children.platformNumber",
            "visible",
            platformNumber
        )
    );
    dispatch(
        handleField(
            "apply",
            "components.div.children.formwizardFirstStep.children.tradeDetails.children.cardContent.children.detailsContainer.children.placeOfWork",
            "visible",
            placeOfWork
        )
    );
    dispatch(
        handleField(
            "apply",
            "components.div.children.formwizardFirstStep.children.tradeDetails.children.cardContent.children.detailsContainer.children.businessStartDate",
            "visible",
            businessStartDate
        )
    );
}

export const setServiceType = (action, state, dispatch, value,screen, path, path2) => {
    let data = [];

    const MdmsTradeType = get(state.screenConfiguration.preparedFinalObject, "applyScreenMdmsData.TradeLicense.MdmsTradeType")

    let serviceTypes = MdmsTradeType.filter(item => item.category === value)

    serviceTypes = serviceTypes.map(item => ({
        code: item.code,
        label: getLocaleLabels(item.code + "_SHORT", item.code + "_SHORT")
    }))

    dispatch(
        handleField(
            screen,
            path,
            "data",
            serviceTypes
        ))
    if(!!path2 && !!serviceTypes.length) {
        dispatch(prepareFinalObject(path2, serviceTypes[0].code));
    }
}

export function buildTradeDetailsObj() {
    return {
        header: headerObj,
        detailsContainer: getCommonContainer({
            licenseType: {
                ...getSelectField(tradeLicenseTypeField),
                beforeFieldChange: (action, state, dispatch) => {
                    setServiceType(action, state, dispatch, action.value, "apply", "components.div.children.formwizardFirstStep.children.tradeDetails.children.cardContent.children.detailsContainer.children.serviceType.props")
                    const type = get(state.screenConfiguration.screenConfig.apply, "components.div.children.formwizardFirstStep.children.tradeDetails.children.cardContent.children.detailsContainer.children.licenseType.props.value")
                    if(type !== action.value) {
                        // dispatch(
                        //     handleField(
                        //         "apply",
                        //         "components.div.children.formwizardFirstStep.children.tradeDetails.children.cardContent.children.detailsContainer.children.serviceType.props",
                        //         "value",
                        //         ""
                        //     ))
                        showHideFields(action, state, dispatch)
                    }
                }
            },
            serviceType: {
                ...getSelectField(serviceTypeField),
                beforeFieldChange: (action, state, dispatch) => {
                    const licensePeriodValue = get(state.screenConfiguration.preparedFinalObject,
                        "Licenses[0].tradeLicenseDetail.additionalDetail.licensePeriod","")
                    const data = {
                        applicationType: action.value === RC_PEDAL_RICKSHAW_LOADING_REHRI || action.value === DL_PEDAL_RICKSHAW_LOADING_REHRI || action.value === LICENSE_DHOBI_GHAT,
                        licensePeriod: action.value === RC_PEDAL_RICKSHAW_LOADING_REHRI,
                        _licensePeriod: action.value === DL_PEDAL_RICKSHAW_LOADING_REHRI,
                        occupation: action.value === RC_PEDAL_RICKSHAW_LOADING_REHRI || action.value === DL_PEDAL_RICKSHAW_LOADING_REHRI,
                        fullAddress: action.value === RC_PEDAL_RICKSHAW_LOADING_REHRI || action.value === DL_PEDAL_RICKSHAW_LOADING_REHRI || action.value === LICENSE_DHOBI_GHAT,
                        completeResidentialAddress: action.value === RENEWAL_RENT_DEED_SHOP,
                        permanentAddress: action.value === RENEWAL_RENT_DEED_SHOP,
                        familyMonthlyIncome: action.value === RENEWAL_RENT_DEED_SHOP,
                        trade: action.value === LICENSE_DHOBI_GHAT || action.value === RENEWAL_RENT_DEED_SHOP,
                        particularsOfArea: action.value === LICENSE_DHOBI_GHAT,
                        platformNumber: action.value === RENEWAL_RENT_DEED_SHOP,
                        placeOfWork: action.value === RENEWAL_RENT_DEED_SHOP,
                        businessStartDate: action.value === RENEWAL_RENT_DEED_SHOP
                    }
                    showHideFields(action, state, dispatch, data)
                    if(action.value === RENEWAL_RENT_DEED_SHOP) {
                        changeDocuments(action, state, dispatch, RENEWAL_RENT_DEED_SHOP)
                    }
                        dispatch(
                            handleField(
                                    "apply",
                                    "components.div.children.formwizardFirstStep.children.tradeDetails.children.cardContent.children.detailsContainer.children._licensePeriod",
                                    "props.disabled",
                                    action.value ===  DL_PEDAL_RICKSHAW_LOADING_REHRI
                            )
                        )
                        if(action.value ===  DL_PEDAL_RICKSHAW_LOADING_REHRI) {
                            dispatch(
                                handleField(
                                        "apply",
                                        "components.div.children.formwizardFirstStep.children.tradeDetails.children.cardContent.children.detailsContainer.children._licensePeriod",
                                        "props.value",
                                        "15"
                                )
                            )
                        }
                }
            },
            applicationType: {
                ...getSelectField(applicationTypeField),
                beforeFieldChange: (action, state, dispatch) => {
                    const licenseType = get(state.screenConfiguration.preparedFinalObject,
                        "Licenses[0].businessService","")
                        changeDocuments(action, state, dispatch, licenseType)
                        dispatch(
                            handleField(
                                "apply",
                                "components.div.children.formwizardFirstStep.children.tradeDetails.children.cardContent.children.detailsContainer.children.oldLicenseNumber",
                                "visible",
                                action.value === "Renew" && (licenseType === RC_PEDAL_RICKSHAW_LOADING_REHRI || licenseType === DL_PEDAL_RICKSHAW_LOADING_REHRI || licenseType === LICENSE_DHOBI_GHAT)
                            )
                        );
    
                        dispatch(
                            handleField(
                                "apply",
                                "components.div.children.formwizardFirstStep.children.tradeDetails.children.cardContent.children.detailsContainer.children.oldLicenseValidTo",
                                "visible",
                                action.value === "Renew"&& (licenseType === RC_PEDAL_RICKSHAW_LOADING_REHRI || licenseType === DL_PEDAL_RICKSHAW_LOADING_REHRI)
                            )
                        );
    
                }
            },
            oldLicenseNumber: getTextField(oldLicenseNumberField),
            oldLicenseValidTo: getDateField(oldLicenseValidToField),
            licensePeriod: {
                  ...getSelectField(licensePeriodField)
              },
            _licensePeriod: getTextField(licensePeriodField),
            trade: getTextField(tradeField),
            particularsOfArea: getTextField(particularsOfAreaField),
            platformNumber: getTextField(platformNumberField),
            placeOfWork: getTextField(placeOfWorkField),
            businessStartDate: getDateField(businessStartDateField)
        })
    }
}

function _buildTradeDetailsObj() {
        var tradeLicenceObjNew = {}
  if (tradeLicenseType == RC_PEDAL_RICKSHAW_LOADING_REHRI) {
      return tradeLicenceObjNew = {
          header: headerObj,
          detailsContainer: getCommonContainer({
              applicationType: {
                  ...getSelectField(applicationTypeField),
                  beforeFieldChange: (action, state, dispatch) => {
                        changeDocuments(action, state, dispatch, tradeLicenseType)
                          dispatch(
                              handleField(
                                  "apply",
                                  "components.div.children.formwizardFirstStep.children.tradeDetails.children.cardContent.children.detailsContainer.children.oldLicenseNumber",
                                  "visible",
                                  action.value === "Renew"
                              )
                          );

                          dispatch(
                              handleField(
                                  "apply",
                                  "components.div.children.formwizardFirstStep.children.tradeDetails.children.cardContent.children.detailsContainer.children.oldLicenseValidTo",
                                  "visible",
                                  action.value === "Renew"
                              )
                          );

                  }
              },
              oldLicenseNumber: getTextField(oldLicenseNumberField),
              oldLicenseValidTo: getDateField(oldLicenseValidToField),
              applicantName: getTextField(applicantNameField),
              fatherOrHusbandsName: getTextField(fatherOrHusbandsNameField),
              occupation: getTextField(occupationField),
              fullAddress: getTextField(fullAddressField),
              dateOfBirth: getDateField(dateOfBirthField),
              age: getTextField(ageField),
              licensePeriod: {
                  ...getSelectField(licensePeriodField),
                  beforeFieldChange: (action, state, dispatch) => {
                      console.log("beforeFieldChange", action);
                  }
              },
              mobileNumber: getTextField(mobileNumberField),
              emailAddress: getTextField(emailAddressField)
          })
      }
  }
  if (tradeLicenseType == DL_PEDAL_RICKSHAW_LOADING_REHRI) {
      return tradeLicenceObjNew = {
          header: headerObj,
          detailsContainer: getCommonContainer({
              applicationType: {
                  ...getSelectField(applicationTypeField),
                  beforeFieldChange: (action, state, dispatch) => {
                    changeDocuments(action, state, dispatch, tradeLicenseType)
                          dispatch(
                              handleField(
                                  "apply",
                                  "components.div.children.formwizardFirstStep.children.tradeDetails.children.cardContent.children.detailsContainer.children.oldLicenseNumber",
                                  "visible",
                                  action.value === "Renew"
                              )
                          );

                          dispatch(
                              handleField(
                                  "apply",
                                  "components.div.children.formwizardFirstStep.children.tradeDetails.children.cardContent.children.detailsContainer.children.oldLicenseValidTo",
                                  "visible",
                                  action.value === "Renew"
                              )
                          );
                  }
              },
              oldLicenseNumber: getTextField(oldLicenseNumberField),
              oldLicenseValidTo: getDateField(oldLicenseValidToField),
              applicantName: getTextField(applicantNameField),
              fatherOrHusbandsName: getTextField(fatherOrHusbandsNameField),
              occupation: getTextField(occupationField),
              fullAddress: getTextField(fullAddressField),
              dateOfBirth: getDateField(dateOfBirthField),
              age: getTextField(ageField),
              mobileNumber: getTextField(mobileNumberField),
              emailAddress: getTextField(emailAddressField)
          })
      }
  }
  if (tradeLicenseType == LICENSE_DHOBI_GHAT) {
      return tradeLicenceObjNew = {
          header: headerObj,
          detailsContainer: getCommonContainer({
              applicationType: {
                  ...getSelectField(applicationTypeField),
                  beforeFieldChange: (action, state, dispatch) => {
                    changeDocuments(action, state, dispatch, tradeLicenseType)
                          dispatch(
                              handleField(
                                  "apply",
                                  "components.div.children.formwizardFirstStep.children.tradeDetails.children.cardContent.children.detailsContainer.children.oldLicenseNumber",
                                  "visible",
                                  action.value === "Renew"
                              )
                          );
                  }
              },
              oldLicenseNumber: getTextField(oldLicenseNumberField),
              applicantName: getTextField(applicantNameField),
              fatherOrHusbandsName: getTextField(fatherOrHusbandsNameField),
              //CE-161 removed due to
              //occupation: getTextField(occupationField),
              fullAddress: getTextField(fullAddressField),
              dateOfBirth: getDateField(dateOfBirthField),
              age: getTextField(ageField),
              trade: getTextField(tradeField),
              particularsOfArea: getTextField(particularsOfAreaField),
              mobileNumber: getTextField(mobileNumberField),
              emailAddress: getTextField(emailAddressField)
          })
      }
  }
  if (tradeLicenseType == RENEWAL_RENT_DEED_SHOP) {
      return tradeLicenceObjNew = {
				header: headerObj,
				detailsContainer: getCommonContainer({
					applicantName: getTextField(applicantNameField),
                    fatherOrHusbandsName: getTextField(fatherOrHusbandsNameField),
                    dateOfBirth: getDateField(dateOfBirthField),
					age: getTextField(ageField),
					completeResidentialAddress: getTextField(completeResidentialAddressField),
                    permanentAddress: getTextField(permanentAddressField),
                    mobileNumber: getTextField(mobileNumberField),
					platformNumber: getTextField(platformNumberField),
					placeOfWork: getTextField(placeOfWorkField),
					trade: getTextField(tradeField),
					businessStartDate: getDateField(businessStartDateField),
					familyMonthlyIncome: getTextField(familyMonthlyIncomeField)
				})
      }
  }
  return false;
}

/* export const tradeDetails = getCommonCard({
header: getCommonTitle(
  {
    labelName: "Trade Details",
    labelKey: "TL_NEW_TRADE_DETAILS_PROV_DET_HEADER"
  },
  {
    style: {
      marginBottom: 18
    }
  }
),
tradeDetailsConatiner: getCommonContainer({
  financialYear: {
    ...getSelectField({
      label: {
        labelName: "Financial Year",
        labelKey: "TL_FINANCIAL_YEAR_LABEL"
      },
      placeholder: {
        labelName: "Select Financial Year",
        labelKey: "TL_FINANCIAL_YEAR_PLACEHOLDER"
      },
      required: true,
      visible: process.env.REACT_APP_NAME === "Citizen" ? false : true,
      jsonPath: "Licenses[0].financialYear",
      sourceJsonPath: "applyScreenMdmsData.egf-master.FinancialYear",
      gridDefination: {
        xs: 12,
        sm: 6
      }
    })
  },
  dummyDiv: {
    uiFramework: "custom-atoms",
    componentPath: "Div",
    gridDefination: {
      xs: 12,
      sm: 6
    },
    visible: process.env.REACT_APP_NAME === "Citizen" ? false : true,
    props: {
      disabled: true
    }
  },
  applicationType: {
    ...getSelectField({
      label: {
        labelName: "Application Type",
        labelKey: "TL_APPLICATION_TYPE_LABEL"
      },
      placeholder: {
        labelName: "Select Application Type",
        labelKey: "TL_APPLICATION_TYPE_PLACEHOLDER"
      },
      required: true,
      localePrefix: {
        moduleName: "TradeLicense",
        masterName: "ApplicationType"
      },
      jsonPath:
        "Licenses[0].tradeLicenseDetail.additionalDetail.applicationType",
      sourceJsonPath: "applyScreenMdmsData.TradeLicense.ApplicationType",
      gridDefination: {
        xs: 12,
        sm: 6
      }
    }),
    beforeFieldChange: (action, state, dispatch) => {
      if (action.value === "APPLICATIONTYPE.RENEWAL") {
        dispatch(
          handleField(
            "apply",
            "components.div.children.formwizardFirstStep.children.tradeDetails.children.cardContent.children.tradeDetailsConatiner.children.oldLicenseNo",
            "props.required",
            true
          )
        );
      } else {
        dispatch(
          handleField(
            "apply",
            "components.div.children.formwizardFirstStep.children.tradeDetails.children.cardContent.children.tradeDetailsConatiner.children.oldLicenseNo",
            "props.required",
            false
          )
        );
      }
    }
  },
  oldLicenseNo: getTextField({
    label: {
      labelName: "Old License No",
      labelKey: "TL_OLD_LICENSE_NO"
    },
    placeholder: {
      labelName: "Enter Old License No",
      labelKey: ""
    },
    gridDefination: {
      xs: 12,
      sm: 6
    },
    iconObj: {
      iconName: "search",
      position: "end",
      color: "#FE7A51",
      onClickDefination: {
        action: "condition",
        callBack: (state, dispatch) => {
          fillOldLicenseData(state, dispatch);
        }
      }
    },
    title: {
      value: "Fill the form by searching your old approved trade license",
      key: "TL_OLD_TL_NO"
    },
    infoIcon: "info_circle",
    jsonPath: "Licenses[0].oldLicenseNumber"
  }),
  tradeLicenseType: {
    ...getSelectField({
      label: {
        labelName: "License Type",
        labelKey: "TL_NEW_TRADE_DETAILS_LIC_TYPE_LABEL"
      },
      placeholder: {
        labelName: "Select License Type",
        labelKey: "TL_NEW_TRADE_DETAILS_LIC_TYPE_PLACEHOLDER"
      },
      required: true,
      jsonPath: "Licenses[0].licenseType",
      localePrefix: {
        moduleName: "TRADELICENSE",
        masterName: "LICENSETYPE"
      },
      props: {
        disabled: true,
        value: "PERMANENT",
        className: "tl-trade-type"
      },
      sourceJsonPath: "applyScreenMdmsData.TradeLicense.licenseType"
    }),
    beforeFieldChange: (action, state, dispatch) => {
      if (action.value === "TEMPORARY") {
        dispatch(
          handleField(
            "apply",
            "components.div.children.formwizardFirstStep.children.tradeDetails.children.cardContent.children.tradeDetailsConatiner.children.tradeToDate",
            "visible",
            true
          )
        );
        dispatch(
          handleField(
            "apply",
            "components.div.children.formwizardFirstStep.children.tradeDetails.children.cardContent.children.tradeDetailsConatiner.children.tradeFromDate",
            "visible",
            true
          )
        );
      } else {
        dispatch(
          handleField(
            "apply",
            "components.div.children.formwizardFirstStep.children.tradeDetails.children.cardContent.children.tradeDetailsConatiner.children.tradeToDate",
            "visible",
            false
          )
        );
        dispatch(
          handleField(
            "apply",
            "components.div.children.formwizardFirstStep.children.tradeDetails.children.cardContent.children.tradeDetailsConatiner.children.tradeFromDate",
            "visible",
            false
          )
        );
        // dispatch(pFO("Licenses[0].validFrom", null));
        // dispatch(pFO("Licenses[0].validTo", null));
      }
    }
  },
  tradeName: getTextField({
    label: {
      labelName: "Name of Trade",
      labelKey: "TL_NEW_TRADE_DETAILS_TRADE_NAME_LABEL"
    },
    placeholder: {
      labelName: "Example Diljit Da Dhaba",
      labelKey: "TL_NEW_TRADE_DETAILS_TRADE_NAME_PLACEHOLDER"
    },
    required: true,
    pattern: getPattern("TradeName"),
    jsonPath: "Licenses[0].tradeName"
  }),
  tradeFromDate: {
    ...getDateField({
      label: {
        labelName: "From Date",
        labelKey: "TL_COMMON_FROM_DATE_LABEL"
      },
      placeholder: {
        labelName: "Trade License From Date",
        labelName: "TL_TRADE_LICENCE_FROM_DATE"
      },
      required: true,
      pattern: getPattern("Date"),
      jsonPath: "Licenses[0].validFrom",
      props: {
        inputProps: {
          min: getTodaysDateInYMD(),
          max: getFinancialYearDates("yyyy-mm-dd").endDate
        }
      }
    }),
    visible: false
  },
  tradeToDate: {
    ...getDateField({
      label: { labelName: "To Date", labelKey: "TL_COMMON_TO_DATE_LABEL" },
      placeholder: {
        labelName: "Trade License From Date",
        labelKey: "TL_TRADE_LICENCE_TO_DATE"
      },
      required: true,
      pattern: getPattern("Date"),
      jsonPath: "Licenses[0].validTo",
      props: {
        inputProps: {
          min: getNextMonthDateInYMD(),
          max: getFinancialYearDates("yyyy-mm-dd").endDate
        }
      }
    }),
    visible: false
  },
  tradeStructureType: {
    ...getSelectField({
      label: {
        labelName: "Structure Type",
        labelKey: "TL_NEW_TRADE_DETAILS_STRUCT_TYPE_LABEL"
      },
      placeholder: {
        labelName: "Select Structure Type",
        labelKey: "TL_NEW_TRADE_DETAILS_STRUCT_TYPE_PLACEHOLDER"
      },
      localePrefix: {
        moduleName: "common-masters",
        masterName: "STRUCTURETYPE"
      },
      required: true,
      jsonPath: "LicensesTemp[0].tradeLicenseDetail.structureType",
      sourceJsonPath:
        "applyScreenMdmsData.common-masters.StructureTypeTransformed"
    }),
    beforeFieldChange: (action, state, dispatch) => {
      try {
        dispatch(
          pFO(
            "applyScreenMdmsData.common-masters.StructureSubTypeTransformed",
            get(
              state.screenConfiguration.preparedFinalObject
                .applyScreenMdmsData["common-masters"],
              `StructureType.${action.value}`,
              []
            )
          )
        );
        // dispatch(pFO("Licenses[0].tradeLicenseDetail.structureType", null));
      } catch (e) {
        console.log(e);
      }
    }
  },
  tradeStructureSubType: {
    ...getSelectField({
      label: {
        labelName: "Structure Sub Type",
        labelKey: "TL_NEW_TRADE_DETAILS_STRUCT_SUB_TYPE_LABEL"
      },
      placeholder: {
        labelName: "Select Structure Sub Type",
        labelKey: "TL_NEW_TRADE_DETAILS_STRUCT_SUB_TYPE_PLACEHOLDER"
      },
      required: true,
      localePrefix: {
        moduleName: "common-masters",
        masterName: "STRUCTURETYPE"
      },
      jsonPath: "Licenses[0].tradeLicenseDetail.structureType",
      sourceJsonPath:
        "applyScreenMdmsData.common-masters.StructureSubTypeTransformed"
    }),
    beforeFieldChange: (action, state, dispatch) => {
      const tradeTypes = setFilteredTradeTypes(
        state,
        dispatch,
        get(
          state.screenConfiguration.preparedFinalObject,
          "Licenses[0].licenseType",
          "PERMANENT"
        ),
        action.value
      );
      const tradeTypeDropdownData = getTradeTypeDropdownData(tradeTypes);
      tradeTypeDropdownData &&
        dispatch(
          pFO(
            "applyScreenMdmsData.TradeLicense.TradeTypeTransformed",
            tradeTypeDropdownData
          )
        );
    }
  },
  tradeCommencementDate: getDateField({
    label: {
      labelName: "Trade Commencement Date",
      labelKey: "TL_NEW_TRADE_DETAILS_TRADE_COMM_DATE_LABEL"
    },
    placeholder: {
      labelName: "Enter Trade Commencement Date",
      labelKey: "TL_NEW_TRADE_DETAILS_TRADE_COMM_DATE_PLACEHOLDER"
    },
    required: true,
    pattern: getPattern("Date"),
    jsonPath: "Licenses[0].commencementDate"
  }),
  tradeGSTNo: getTextField({
    label: {
      labelName: "Trade GST No.",
      labelKey: "TL_NEW_TRADE_DETAILS_TRADE_GST_NO_LABEL"
    },
    placeholder: {
      labelName: "Enter Trade GST No.",
      labelKey: "TL_NEW_TRADE_DETAILS_TRADE_GST_NO_PLACEHOLDER"
    },
    pattern: getPattern("GSTNo"),
    jsonPath: "Licenses[0].tradeLicenseDetail.additionalDetail.gstNo"
  }),
  tradeOperationalArea: getTextField({
    label: {
      labelName: "Operatonal Area (Sq Ft)",
      labelKey: "TL_NEW_TRADE_DETAILS_OPR_AREA_LABEL"
    },
    placeholder: {
      labelName: "Enter Operatonal Area in Sq Ft",
      labelKey: "TL_NEW_TRADE_DETAILS_OPR_AREA_PLACEHOLDER"
    },
    pattern: getPattern("OperationalArea"),
    jsonPath: "Licenses[0].tradeLicenseDetail.operationalArea"
  }),
  tradeNoOfEmployee: getTextField({
    label: {
      labelName: "No. Of Employee",
      labelKey: "TL_NEW_TRADE_DETAILS_NO_EMPLOYEES_LABEL"
    },
    placeholder: {
      labelName: "Enter No. Of Employee",
      labelKey: "TL_NEW_TRADE_DETAILS_NO_EMPLOYEES_PLACEHOLDER"
    },
    pattern: getPattern("NoOfEmp"),
    jsonPath: "Licenses[0].tradeLicenseDetail.noOfEmployees"
  })
}),
tradeUnitCard,
accessoriesCard
}); */

const setFieldsOnAddItem = (state, multiItemContent) => {
  const preparedFinalObject = JSON.parse(
      JSON.stringify(state.screenConfiguration.preparedFinalObject)
  );
  for (var variable in multiItemContent) {
      const value = get(
          preparedFinalObject,
          multiItemContent[variable].props.jsonPath
      );
      if (multiItemContent[variable].props.setDataInField && value) {
          if (
              multiItemContent[variable].props.jsonPath.split(".")[0] ===
              "LicensesTemp" &&
              multiItemContent[variable].props.jsonPath.split(".").pop() ===
              "tradeType"
          ) {
              const tradeTypeData = get(
                  preparedFinalObject,
                  `applyScreenMdmsData.TradeLicense.TradeType`,
                  []
              );
              const tradeTypeDropdownData =
                  tradeTypeData &&
                  tradeTypeData.TradeType &&
                  Object.keys(tradeTypeData.TradeType).map(item => {
                      return { code: item, active: true };
                  });
              multiItemContent[variable].props.data = tradeTypeDropdownData;
              const data = tradeTypeData[value];
              if (data) {
                  multiItemContent["tradeType"].props.data = this.objectToDropdown(
                      data
                  );
              }
          } else if (
              multiItemContent[variable].props.jsonPath.split(".").pop() ===
              "tradeType"
          ) {
              const data = get(
                  preparedFinalObject,
                  `applyScreenMdmsData.TradeLicense.TradeType.${value.split(".")[0]}.${
                  value.split(".")[1]
                  }`
              );
              if (data) {
                  multiItemContent[variable].props.data = data;
              }
          } else if (
              multiItemContent[variable].props.jsonPath.split(".").pop() ===
              "uomValue" &&
              value > 0
          ) {
              multiItemContent[variable].props.disabled = false;
              multiItemContent[variable].props.required = true;
          }
      }
      if (
          multiItemContent[variable].props.setDataInField &&
          multiItemContent[variable].props.disabled
      ) {
          if (
              multiItemContent[variable].props.jsonPath.split(".").pop() ===
              "uomValue"
          ) {
              const disabledValue = get(
                  state.screenConfiguration.screenConfig["apply"],
                  `${multiItemContent[variable].componentJsonpath}.props.disabled`,
                  true
              );
              multiItemContent[variable].props.disabled = disabledValue;
          }
      }
  }
  return multiItemContent;
};