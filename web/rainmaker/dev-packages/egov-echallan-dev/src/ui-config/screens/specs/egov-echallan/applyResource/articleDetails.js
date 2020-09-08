import {
  getBreak,
  getCommonCard,
  getCommonContainer,
  getCommonGrayCard,
  getCommonTitle,
  getSelectField,
  getTextField,
  getPattern,
  getLabel
} from "egov-ui-framework/ui-config/screens/specs/utils";
import {
  sortByEpoch,
  getEpochForDate,
  getTextToLocalMappingArticleGrid,
  validateFields,
  resetAllFields,
  setSeizedItemGridData
} from "../../utils"
import {
  prepareFinalObject,
  handleScreenConfigurationFieldChange as handleField,
  toggleSnackbar,
  toggleSpinner
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import get from "lodash/get";
import "./index.css";
import set from "lodash/set";


const ValidateFormData = async (state, dispatch, apply) => {

  let isrowvalidated = true;
  let isvalidFormData = validateFields(
    "components.div.children.formwizardSecondStep.children.ArticleDetails.children.cardContent.children.articleDetailsConatiner.children.articleContainer.children.articleCard.children",
    state,
    dispatch
  );
  //screenConfiguration.screenConfig.apply.components.div.children.formwizardSecondStep.children.ArticleDetails.children.cardContent.children.articleDetailsConatiner.children.articleContainer.children.articleCard.children
  if (isvalidFormData) {
    let acutionjsonDetails = get(state, 'screenConfiguration.preparedFinalObject.articleSeizedDetails', []);
    let dataarray = get(state, 'screenConfiguration.preparedFinalObject.articleSeizedGridDetails', []);
    let encroachmentType = get(state.screenConfiguration.preparedFinalObject, "eChallan.encroachmentType");
    let allreadyassigned = 0;
    let qtyavailable = 0;
    if (encroachmentType === 'Seizure of Vehicles' && dataarray.length > 0) {
      isrowvalidated = false;
      dispatch(
        toggleSnackbar(
          true,
          {
            labelName: "In case of Seizure of Vehicle only 1 Entry is allowed!",
            labelKey: "EC_ARTICLE_MASTER_VEHICLE_TOASTER"
          },
          "warning"
        )
      );

      set(state, 'screenConfiguration.preparedFinalObject.articleSeizedDetails', []);
      const objectJsonPath = `components.div.children.formwizardSecondStep.children.ArticleDetails.children.cardContent.children.articleDetailsConatiner.children.articleContainer.children`;
      const children = get(
        state.screenConfiguration.screenConfig["apply"],
        objectJsonPath,
        {}
      );
      resetAllFields(children, dispatch, state, 'apply');

    } else {
      if (dataarray.length > 0) {
        for (let index = 0; index < dataarray.length; index++) {
          const element = dataarray[index];
          let ItemName = acutionjsonDetails.ItemName === 'Other' ? acutionjsonDetails.other : acutionjsonDetails.ItemName;
          let DataItemName = element["Seized Article"] === 'Other' ? element["Other Item"] : element["Seized Article"];

          if ((ItemName === DataItemName) && isrowvalidated) {
            isrowvalidated = false;
            dispatch(
              toggleSnackbar(
                true,
                {
                  labelName: "Item is already picked and available in grid!",
                  labelKey: "EC_ARTICLE_MASTER_ITEM_ALREADY_TOASTER"
                },
                "warning"
              )
            );
          }
        }
        if (isrowvalidated) {
          if (encroachmentType === 'Seizure of Vehicles') {
            if (acutionjsonDetails.VehicleNumber === '' || acutionjsonDetails.VehicleNumber === undefined) {
              isrowvalidated = false;
              dispatch(
                toggleSnackbar(
                  true,
                  {
                    labelName: "Vehicle Number is required!",
                    labelKey: "EC_ARTICLE_MASTER_VEHICLE_NUMBER_TOASTER"
                  },
                  "warning"
                )
              );
            }
            if (acutionjsonDetails.Remark === '' || acutionjsonDetails.Remark === undefined) {
              isrowvalidated = false;
              dispatch(
                toggleSnackbar(
                  true,
                  {
                    labelName: "Remark is required!",
                    labelKey: "EC_ARTICLE_MASTER_REMARK_TOASTER"
                  },
                  "warning"
                )
              );
            }
            if (acutionjsonDetails.other === '' || acutionjsonDetails.other === undefined) {
              isrowvalidated = false;
              dispatch(
                toggleSnackbar(
                  true,
                  {
                    labelName: "Vehicle Make is required in Other Field!",
                    labelKey: "EC_ARTICLE_MASTER_VEHICLE_MAKE_TOASTER"
                  },
                  "warning"
                )
              );
            }

          } else {
            if (acutionjsonDetails.SeizedQty === '' || acutionjsonDetails.SeizedQty === undefined) {
              isrowvalidated = false;
              dispatch(
                toggleSnackbar(
                  true,
                  {
                    labelName: "Seized Quantity is required!",
                    labelKey: "EC_ARTICLE_MASTER_SEIZED_QUANTITY_TOASTER"
                  },
                  "warning"
                )
              );
            }
            if (acutionjsonDetails.Remark === '' || acutionjsonDetails.Remark === undefined) {
              isrowvalidated = false;
              dispatch(
                toggleSnackbar(
                  true,
                  {
                    labelName: "Remark is required!",
                    labelKey: "EC_ARTICLE_MASTER_REMARK_TOASTER"
                  },
                  "warning"
                )
              );
            }
            if (acutionjsonDetails.ItemName == 'Other' && (acutionjsonDetails.other === '' || acutionjsonDetails.other === undefined)) {
              isrowvalidated = false;
              dispatch(
                toggleSnackbar(
                  true,
                  {
                    labelName: "Other Field Value is required since ItemName selected is Other Field!",
                    labelKey: "EC_ARTICLE_MASTER_OTHER_FIELD_TOASTER"
                  },
                  "warning"
                )
              );
            }
          }
        }
      }
      else {
        if (isrowvalidated) {
          if (encroachmentType === 'Seizure of Vehicles') {
            if (acutionjsonDetails.VehicleNumber === '' || acutionjsonDetails.VehicleNumber === undefined) {
              isrowvalidated = false;
              dispatch(
                toggleSnackbar(
                  true,
                  {
                    labelName: "Vehicle Number is required!",
                    labelKey: "EC_ARTICLE_MASTER_VEHICLE_NUMBER_TOASTER"
                  },
                  "warning"
                )
              );
            }
            if (acutionjsonDetails.Remark === '' || acutionjsonDetails.Remark === undefined) {
              isrowvalidated = false;
              dispatch(
                toggleSnackbar(
                  true,
                  {
                    labelName: "Remark is required!",
                    labelKey: "EC_ARTICLE_MASTER_REMARK_TOASTER"
                  },
                  "warning"
                )
              );
            }
            if (acutionjsonDetails.other === '' || acutionjsonDetails.VehicleNumber === undefined) {
              isrowvalidated = false;
              dispatch(
                toggleSnackbar(
                  true,
                  {
                    labelName: "Vehicle Make is required in Other Field!",
                    labelKey: "EC_ARTICLE_MASTER_VEHICLE_MAKE_TOASTER"
                  },
                  "warning"
                )
              );
            }
          } else {
            if (acutionjsonDetails.SeizedQty === '' || acutionjsonDetails.SeizedQty === undefined) {
              isrowvalidated = false;
              dispatch(
                toggleSnackbar(
                  true,
                  {
                    labelName: "Seized Quantity is required!",
                    labelKey: "EC_ARTICLE_MASTER_SEIZED_QUANTITY_TOASTER"
                  },
                  "warning"
                )
              );
            }
            if (acutionjsonDetails.Remark === '' || acutionjsonDetails.Remark === undefined) {
              isrowvalidated = false;
              dispatch(
                toggleSnackbar(
                  true,
                  {
                    labelName: "Remark is required!",
                    labelKey: "EC_ARTICLE_MASTER_REMARK_TOASTER"
                  },
                  "warning"
                )
              );
            }
            if (acutionjsonDetails.ItemName == 'Other' && (acutionjsonDetails.other === '' || acutionjsonDetails.other === undefined)) {
              isrowvalidated = false;
              dispatch(
                toggleSnackbar(
                  true,
                  {
                    labelName: "Other Field Value is required since ItemName selected is Other Field!",
                    labelKey: "EC_ARTICLE_MASTER_OTHER_FIELD_TOASTER"
                  },
                  "warning"
                )
              );
            }
          }
        }
      }
    }

    if (isrowvalidated) {
      dispatch(toggleSpinner());
      await AddArticletoGrid(state, dispatch, apply);
      set(state, 'screenConfiguration.preparedFinalObject.articleSeizedDetails', []);
      const objectJsonPath = `components.div.children.formwizardSecondStep.children.ArticleDetails.children.cardContent.children.articleDetailsConatiner.children.articleContainer.children`;
      const children = get(
        state.screenConfiguration.screenConfig["apply"],
        objectJsonPath,
        {}
      );
      resetAllFields(children, dispatch, state, 'apply');
      otherFieldDisabled(dispatch, false, true);
      dispatch(toggleSpinner());
    } else {
      const objectJsonPath = `components.div.children.formwizardSecondStep.children.ArticleDetails.children.cardContent.children.articleDetailsConatiner.children.articleContainer.children`;
      const children = get(
        state.screenConfiguration.screenConfig["apply"],
        objectJsonPath,
        {}
      );
      resetAllFields(children, dispatch, state, 'apply');
      otherFieldDisabled(dispatch, false, true);
    }
  }

}

const otherFieldDisabled = (dispatch, isRequired, isdisabled) => {
  let screenKey = "apply";
  if (!isRequired) {
    dispatch(
      handleField(
        screenKey,
        "components.div.children.formwizardSecondStep.children.ArticleDetails.children.cardContent.children.articleDetailsConatiner.children.articleContainer.children.articleCard.children.Others",
        "props.value", ""));
    dispatch(
      handleField(
        screenKey,
        "components.div.children.formwizardSecondStep.children.ArticleDetails.children.cardContent.children.articleDetailsConatiner.children.articleContainer.children.articleCard.children.Others",
        "props.error",
        false
      )
    );
    dispatch(
      handleField(
        screenKey,
        "components.div.children.formwizardSecondStep.children.ArticleDetails.children.cardContent.children.articleDetailsConatiner.children.articleContainer.children.articleCard.children.Others",
        "isFieldValid",
        true
      )
    );
    dispatch(
      handleField(
        screenKey,
        "components.div.children.formwizardSecondStep.children.ArticleDetails.children.cardContent.children.articleDetailsConatiner.children.articleContainer.children.articleCard.children.Others",
        "props.helperText",
        ""
      )
    );
    //screenConfiguration.screenConfig.apply.components.div.children.formwizardSecondStep.children.ArticleDetails.children.cardContent.children.articleDetailsConatiner.children.articleContainer.children.articleCard.children.Others.
  }
  dispatch(
    handleField(
      screenKey,
      "components.div.children.formwizardSecondStep.children.ArticleDetails.children.cardContent.children.articleDetailsConatiner.children.articleContainer.children.articleCard.children.Others",
      "props.required", isRequired));
  //disabled
  dispatch(
    handleField(
      screenKey,
      "components.div.children.formwizardSecondStep.children.ArticleDetails.children.cardContent.children.articleDetailsConatiner.children.articleContainer.children.articleCard.children.Others",
      "props.disabled", isdisabled));
}

const clearFields = (dispatch) => {
  let screenKey = "apply";
  dispatch(
    handleField(
      screenKey,
      "components.div.children.formwizardSecondStep.children.ArticleDetails.children.cardContent.children.articleDetailsConatiner.children.articleContainer.children.articleCard.children.Quantity",
      "props.value", ""));
  dispatch(
    handleField(
      screenKey,
      "components.div.children.formwizardSecondStep.children.ArticleDetails.children.cardContent.children.articleDetailsConatiner.children.articleContainer.children.articleCard.children.Quantity",
      "props.error",
      false
    )
  );
  dispatch(
    handleField(
      screenKey,
      "components.div.children.formwizardSecondStep.children.ArticleDetails.children.cardContent.children.articleDetailsConatiner.children.articleContainer.children.articleCard.children.Quantity",
      "isFieldValid",
      true
    )
  );
  dispatch(
    handleField(
      screenKey,
      "components.div.children.formwizardSecondStep.children.ArticleDetails.children.cardContent.children.articleDetailsConatiner.children.articleContainer.children.articleCard.children.Quantity",
      "props.helperText",
      ""
    )
  );

  dispatch(
    handleField(
      screenKey,
      "components.div.children.formwizardSecondStep.children.ArticleDetails.children.cardContent.children.articleDetailsConatiner.children.articleContainer.children.articleCard.children.Remark",
      "props.value", ""));
  dispatch(
    handleField(
      screenKey,
      "components.div.children.formwizardSecondStep.children.ArticleDetails.children.cardContent.children.articleDetailsConatiner.children.articleContainer.children.articleCard.children.Remark",
      "props.error",
      false
    )
  );
  dispatch(
    handleField(
      screenKey,
      "components.div.children.formwizardSecondStep.children.ArticleDetails.children.cardContent.children.articleDetailsConatiner.children.articleContainer.children.articleCard.children.Remark",
      "isFieldValid",
      true
    )
  );
  dispatch(
    handleField(
      screenKey,
      "components.div.children.formwizardSecondStep.children.ArticleDetails.children.cardContent.children.articleDetailsConatiner.children.articleContainer.children.articleCard.children.Remark",
      "props.helperText",
      ""
    )
  );

  dispatch(
    handleField(
      screenKey,
      "components.div.children.formwizardSecondStep.children.ArticleDetails.children.cardContent.children.articleDetailsConatiner.children.articleContainer.children.articleCard.children.VehicleNumber",
      "props.value", ""));
  dispatch(
    handleField(
      screenKey,
      "components.div.children.formwizardSecondStep.children.ArticleDetails.children.cardContent.children.articleDetailsConatiner.children.articleContainer.children.articleCard.children.VehicleNumber",
      "props.error",
      false
    )
  );
  dispatch(
    handleField(
      screenKey,
      "components.div.children.formwizardSecondStep.children.ArticleDetails.children.cardContent.children.articleDetailsConatiner.children.articleContainer.children.articleCard.children.VehicleNumber",
      "isFieldValid",
      true
    )
  );
  dispatch(
    handleField(
      screenKey,
      "components.div.children.formwizardSecondStep.children.ArticleDetails.children.cardContent.children.articleDetailsConatiner.children.articleContainer.children.articleCard.children.VehicleNumber",
      "props.helperText",
      ""
    )
  );

  dispatch(
    handleField(
      screenKey,
      "components.div.children.formwizardSecondStep.children.ArticleDetails.children.cardContent.children.articleDetailsConatiner.children.articleContainer.children.articleCard.children.Others",
      "props.value", ""));
  dispatch(
    handleField(
      screenKey,
      "components.div.children.formwizardSecondStep.children.ArticleDetails.children.cardContent.children.articleDetailsConatiner.children.articleContainer.children.articleCard.children.Others",
      "props.error",
      false
    )
  );
  dispatch(
    handleField(
      screenKey,
      "components.div.children.formwizardSecondStep.children.ArticleDetails.children.cardContent.children.articleDetailsConatiner.children.articleContainer.children.articleCard.children.Others",
      "isFieldValid",
      true
    )
  );
  dispatch(
    handleField(
      screenKey,
      "components.div.children.formwizardSecondStep.children.ArticleDetails.children.cardContent.children.articleDetailsConatiner.children.articleContainer.children.articleCard.children.Others",
      "props.helperText",
      ""
    )
  );
};

const AddArticletoGrid = async (state, dispatch) => {
  let obj = []
  obj = get(state.screenConfiguration.preparedFinalObject, "articleSeizedDetails");
  let encroachmentType = get(state.screenConfiguration.preparedFinalObject, "eChallan.encroachmentType");
  // console.log("articledetails", obj[0].VehicleName)
  try {
    //temp if (reponseobj) {
    let dataarray = [];
    let objarray = [];
    dataarray = get(state, 'screenConfiguration.preparedFinalObject.articleSeizedGridDetails', []);


    let ispresent = false;
    if (dataarray.length > 0) {
      dataarray.forEach((item, index) => {

        if (!ispresent && item['Seized Article'] === obj['ItemName'] && item['Qunatity / Vehicle Type'] === (obj['SeizedQty'] === undefined ? '' : obj['SeizedQty'])) {
          dispatch(toggleSnackbar(true, { labelName: "Item has already been Inserted" }, "warning"));
          ispresent = true;
          return;
        }
      });
    }
    if (!ispresent) {
      let temp = [];
      temp[getTextToLocalMappingArticleGrid("ItemName")] = obj['ItemName'];
      temp[getTextToLocalMappingArticleGrid("Other")] = obj['other'] === undefined ? '' : obj['other'];
      temp[getTextToLocalMappingArticleGrid("SeizedQty")] = encroachmentType === 'Seizure of Vehicles' ? 1 : obj['SeizedQty'] === undefined ? '' : obj['SeizedQty'];
      temp[getTextToLocalMappingArticleGrid("VehicleNumber")] = obj['VehicleNumber'] === undefined ? '' : obj['VehicleNumber'];
      temp[getTextToLocalMappingArticleGrid("Remark")] = obj['Remark'] === undefined ? '' : obj['Remark'];
      dataarray.push(temp);

      dispatch(prepareFinalObject('articleSeizedGridDetails', dataarray));

      dispatch(
        handleField(
          "apply",
          "components.div.children.formwizardSecondStep.children.ArticleGridDetails",
          "props.data",
          get(state, 'screenConfiguration.preparedFinalObject.articleSeizedGridDetails', [])
        )
      );

    }
  } catch (error) {
    console.log(error);
  }
}

const articleDetailData = () => {
  return {
    ArticleDetils: {
      uiFramework: "custom-containers-local",
      moduleName: "egov-echallan",
      componentPath: "AutosuggestContainer",
      jsonPath: "articleSeizedDetails.ItemName",
      errorMessage: "EC_ERR_SEIZED_ITEM_NAME_VEHICLE_TYPE_LIST_DEFAULT_INPUT_FIELD_MSG",
      required: true,
      // visible: true,
      gridDefination: {
        xs: 12,
        sm: 12,
        md: 6
      },
      props: {
        style: {
          width: "100%",
          cursor: "pointer"
        },
        label: {
          labelName: "Item Name / Vehicle Type",
          labelKey: "EC_SEIZED_ITEM_NAME_VEHICLE_TYPE_LIST_LABEL"
        },
        placeholder: {
          labelName: "Select Article / Item",
          labelKey: "EC_SELECT_ITEM_NAME_LIST_PLACEHOLDER"
        },
        sourceJsonPath: "applyScreenMdmsData.egec.ViolationItemList",
        jsonPath: "articleSeizedDetails.ItemName",
        optionValue: "label",
        labelsFromLocalisation: true,
        // setDataInField: true,
        // suggestions: [],
        fullwidth: true,
        required: true,
        inputLabelProps: {
          shrink: true
        },
      },
      beforeFieldChange: (action, state, dispatch) => {
        try {
          dispatch(prepareFinalObject("articleSeizedDetails", {}));

          let encroachmentType = get(state, 'screenConfiguration.preparedFinalObject.eChallan.encroachmentType', '');
          if (action.value === 'Other' || encroachmentType === 'Seizure of Vehicles') {
            otherFieldDisabled(dispatch, true, false);
          } else {
            otherFieldDisabled(dispatch, false, true);
          }
          clearFields(dispatch);

        } catch (e) {
          console.log(e);
        }
      }
    },

    Others: {
      ...getTextField({
        label: {
          labelName: "Other Value",
          labelKey: "EC_OTHER_VEHICLE_NAME_LABEL"
        },
        placeholder: {
          labelName: "Other",
          labelKey: "EC_OTHER_VEHICLE_NAME_PLACEHOLDER"
        },
        jsonPath: "articleSeizedDetails.other",
        required: true,
        pattern: getPattern("ECViolatorName"),
        errorMessage: "EC_ERR_OTHER_VEHICLE_INPUT_FIELD_MSG",
        gridDefination: {
          xs: 12,
          sm: 12,
          md: 6
        },
        props: {
          className: "applicant-details-error"
        }
      })
    },

    Quantity: {
      ...getTextField({
        label: {
          labelName: "Seized Quantity",
          labelKey: "EC_SEIZED_QUANTITY_LABEL"
        },
        placeholder: {
          labelName: "Seized Quantity",
          labelKey: "EC_SEIZED_QUANTITY_PLACEHOLDER"
        },
        jsonPath: "articleSeizedDetails.SeizedQty",
        required: true,
        pattern: getPattern("SeizedQuantity"),
        errorMessage: "EC_ERR_SEIZED_QUANTITY_DEFAULT_INPUT_FIELD_MSG",
        gridDefination: {
          xs: 12,
          sm: 12,
          md: 6
        },
        props: {
          className: "applicant-details-error"
        }
      })
    },

    VehicleNumber: {
      ...getTextField({
        label: {
          labelName: "Vehicle Number",
          labelKey: "EC_SEIZED_VEHICLE_NUMBER_LABEL"
        },
        placeholder: {
          labelName: "Enter Vehicle Name",
          labelKey: "EC_SEIZED_VEHICLE_NUMBER_PLACEHOLDER"
        },
        jsonPath: "articleSeizedDetails.VehicleNumber",
        required: true,
        pattern: getPattern("ECVehicleRegistrationNo"),
        errorMessage: "EC_ERR_VEHICLE_REGISTRATION_NUMBER_INPUT_FIELD_MSG",
        gridDefination: {
          xs: 12,
          sm: 12,
          md: 6
        },
        props: {
          className: "applicant-details-error"
        },
        visible: false
      })
    },

    Remark: {
      ...getTextField({
        label: {
          labelName: "Remark",
          labelKey: "EC_SEZIURE_REMARK_LABEL"
        },
        placeholder: {
          labelName: "Enter Remark",
          labelKey: "EC_SEZIURE_REMARK_PLACEHOLDER"
        },
        jsonPath: "articleSeizedDetails.Remark",
        required: true,
        pattern: getPattern("ECItemDescription"),
        errorMessage: "EC_ERR_SEZIURE_REMARK_DEFAULT_INPUT_FIELD_MSG",
        gridDefination: {
          xs: 12,
          sm: 12,
          md: 6
        },
        props: {
          className: "textfield-enterable-selection",
          multiline: true,
          rows: "4"
        },
        // props: {
        //   className: "applicant-details-error"
        // }
      })
    }

  };
};

export const ArticleDetails = getCommonCard({
  header: getCommonTitle(
    {
      labelName: "Article Seized Details",
      labelKey: "EC_SEIZED_ITEM_DETAILS_HEADER"
    },
    {
      style: {
        marginBottom: 18
      }
    }
  ),
  break: getBreak(),
  articleDetailsConatiner: getCommonContainer({
    articleContainer: {
      uiFramework: "custom-atoms",
      componentPath: "Div",
      gridDefination: {
        xs: 12
      },
      children: {
        articleCard: getCommonContainer(articleDetailData())
      }
    },
    AddButton: {
      componentPath: "Button",
      props: {
        variant: "contained",
        color: "primary",
        style: {
          minWidth: "200px",
          height: "48px",
          marginRight: "45px"
        }
      },
      children: {
        addtButtonLabel: getLabel({
          labelName: "Add",
          labelKey: "EC_BUTTON_ADD"
        }),
        addtButtonIcon: {
          uiFramework: "custom-atoms",
          componentPath: "Icon",
          props: {
            iconName: "keyboard_arrow_right"
          }
        }
      },
      onClickDefination: {
        action: "condition",
        callBack: ValidateFormData
      },
      visible: true
    }

  })
});
