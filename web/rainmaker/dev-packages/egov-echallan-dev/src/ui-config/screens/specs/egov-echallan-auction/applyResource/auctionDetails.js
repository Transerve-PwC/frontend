import {
  getBreak,
  getCommonCard,
  getCommonContainer,
  getCommonGrayCard,
  getCommonTitle,
  getSelectField,
  getTextField,
  getPattern,
  getLabel,
  getDateField,
  convertEpochToDate
} from "egov-ui-framework/ui-config/screens/specs/utils";

import {
  sortByEpoch,
  getEpochForDate,
  getTextToLocalMappingAuctionGrid,
  setSeizedItemGridData,
  validateFields,
  convertDateTimeToEpoch,
  resetAllFields
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
    "components.div.children.AuctionDetails.children.cardContent.children.articleDetailsConatiner.children.articleContainer.children.auctionCard.children",
    state,
    dispatch
  );

  if (isvalidFormData) {
    let acutionjsonDetails = get(state, 'screenConfiguration.preparedFinalObject.auctionDetails', []);
    let dataarray = get(state, 'screenConfiguration.preparedFinalObject.auctionGridDetails', []);

    if (acutionjsonDetails.purchaseQuantity > 0) {
      let allreadyassigned = 0;
      let qtyavailable = 0;
      if (dataarray.length > 0) {
        for (let index = 0; index < dataarray.length; index++) {
          const element = dataarray[index];
          if (acutionjsonDetails.itemName.split('~')[0] === element[0]) {
            allreadyassigned += parseInt(element[5]);
            qtyavailable = (parseInt(acutionjsonDetails.seizedQty) - parseInt(allreadyassigned));
            if (parseInt(acutionjsonDetails.purchaseQuantity) > parseInt(qtyavailable)) {
              isrowvalidated = false;
              dispatch(
                toggleSnackbar(
                  true,
                  {
                    labelName: "Purchase quantity cannot be greater then total seized quantity!",
                    labelKey: ''//"EC_FINE_MASTER_SUCCESS_TOASTER"
                  },
                  "warning"
                )
              );
            } else if (parseInt(qtyavailable) === 0) {
              isrowvalidated = false;
              dispatch(
                toggleSnackbar(
                  true,
                  {
                    labelName: "Since seized quantity is equall to purchase quantity, you cannot assigned more quantity !",
                    labelKey: ''//"EC_FINE_MASTER_SUCCESS_TOASTER"
                  },
                  "warning"
                )
              );
              // dispatch(prepareFinalObject("auctionDetails.seizedQty", qtyavailable));
              // dispatch(prepareFinalObject("auctionDetails.purchaseQuantity", 0));

            }
          } else {
            if (parseInt(acutionjsonDetails.purchaseQuantity) > parseInt(acutionjsonDetails.seizedQty)) {
              isrowvalidated = false;
              dispatch(
                toggleSnackbar(
                  true,
                  {
                    labelName: "Purchase item cannot be greater then seized quantity!",
                    labelKey: ''//"EC_FINE_MASTER_SUCCESS_TOASTER"
                  },
                  "warning"
                )
              );
            } else {
              qtyavailable = acutionjsonDetails.seizedQty - acutionjsonDetails.purchaseQuantity
            }
          }
        }
      } else {
        if (parseInt(acutionjsonDetails.purchaseQuantity) > parseInt(acutionjsonDetails.seizedQty)) {
          isrowvalidated = false;
          dispatch(
            toggleSnackbar(
              true,
              {
                labelName: "Purchase item cannot be greater then seized quantity!",
                labelKey: ''//"EC_FINE_MASTER_SUCCESS_TOASTER"
              },
              "warning"
            )
          );
        } else {
          qtyavailable = acutionjsonDetails.seizedQty - acutionjsonDetails.purchaseQuantity
        }
      }
    } else {
      isrowvalidated = false;
      dispatch(
        toggleSnackbar(
          true,
          {
            labelName: "Purchase item cannot be zero!",
            labelKey: ''//"EC_FINE_MASTER_SUCCESS_TOASTER"
          },
          "warning"
        )
      );
    }
    if (isrowvalidated) {
      dispatch(toggleSpinner());
      await AddAuctiontoGrid(state, dispatch, apply);
      set(state, 'screenConfiguration.preparedFinalObject.auctionDetails', []);
      const objectJsonPath = `components.div.children.AuctionDetails.children.cardContent.children.articleDetailsConatiner.children.articleContainer.children`;
      const children = get(
        state.screenConfiguration.screenConfig["apply"],
        objectJsonPath,
        {}
      );
      resetAllFields(children, dispatch, state, 'apply');
      dispatch(toggleSpinner());
    }
  }

}


const AddAuctiontoGrid = async (state, dispatch, apply) => {
  let obj = []
  obj = get(state.screenConfiguration.preparedFinalObject, "auctionDetails");
  let echallanDeatils = get(state.screenConfiguration.preparedFinalObject, "eChallanDetail[0]", {});
  try {
    let dataarray = [];
    dataarray = get(state, 'screenConfiguration.preparedFinalObject.auctionGridDetails', []);
    let temp = [];

    if (convertDateTimeToEpoch(obj['auctionDate']) > convertDateTimeToEpoch(echallanDeatils.violationDate)) {
      temp[0] = obj['itemName'].split('~')[0];
      temp[1] = obj['seizedQty'];
      temp[2] = obj['auctionDate'] === undefined ? '' : convertDateTimeToEpoch(obj['auctionDate']);
      temp[3] = obj['contactNumber'] === undefined ? '' : obj['contactNumber'];
      temp[4] = obj['purchaseName'] === undefined ? '' : obj['purchaseName'];
      temp[5] = obj['purchaseQuantity'] === undefined ? '' : obj['purchaseQuantity'];
      temp[6] = obj['amount'] === undefined ? '' : obj['amount'];
      temp[7] = obj['itemStoreUuid'] === undefined ? '' : obj['itemStoreUuid'];
      dataarray.push(temp);
      dispatch(prepareFinalObject('auctionGridDetails', dataarray));
      console.log("dataarray", dataarray)

      let data = dataarray.map(item => ({
        // alert(item)
        [getTextToLocalMappingAuctionGrid("itemName")]: item[0] || "-",
        [getTextToLocalMappingAuctionGrid("seizedQty")]: item[1] || "-",
        [getTextToLocalMappingAuctionGrid("auctionDate")]: convertEpochToDate(item[2]) || "-",
        [getTextToLocalMappingAuctionGrid("contactNumber")]: item[3] || "-",
        [getTextToLocalMappingAuctionGrid("purchaseName")]: item[4] || "-",
        [getTextToLocalMappingAuctionGrid("purchaseQuantity")]: item[5] || "-",
        [getTextToLocalMappingAuctionGrid("amount")]: item[6] || "-",
      }));
      console.log("dataarray1", data)

      dispatch(
        handleField(
          "apply", "components.div.children.AuctionGridDetails",
          "props.data", data)
      );
    } else {
      dispatch(

        toggleSnackbar(true,
          {
            labelName: "Auction Date should be greater then the Violation Date",
            labelKey: "EC_AUCTION_DATE_GREATER_VIOLATIOM_DATE"
          },
          "warning")
      );
    }
    // }
  } catch (error) {
    console.log(error);
  }
}

const auctionDetailData = () => {
  return {
    ChallanNumber: {
      ...getTextField({
        label: {
          labelName: "Challan Number",
          labelKey: "EC_AUCTION_SEIZED_CHALLAN_NUMBER_LABEL"
        },
        placeholder: {
          labelName: "Challan Number",
          labelKey: "EC_AUCTION_SEIZED_CHALLAN_NUMBER_PLACEHOLDER"
        },
        jsonPath: "auctionDetails.challanNumber",
        //required: true,

        //pattern: getPattern("Amount"),
        errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
        gridDefination: {
          xs: 12,
          sm: 12,
          md: 6
        },
        props: {
          disabled: true,
          className: "applicant-details-error"
        }
      })
    },
    DummyDiv: {
      uiFramework: "custom-atoms",
      componentPath: "Div",
      gridDefination: {
        xs: 12,
        sm: 12,
        md: 6
      },
      props: {
        disabled: true
      }
    },
    AuctionDetails: {
      ...getSelectField({
        label: {
          labelName: "Item Name",
          labelKey: "EC_AUCTION_ITEM_NAME_LABEL"
        },
        optionLabel: "name",
        optionValue: "code",
        placeholder: {
          labelName: "Select Article / Item",
          labelKey: "EC_SELECT_AUCTION_ITEM_NAME_LIST_PLACEHOLDER"
        },
        sourceJsonPath: "applyScreenMdmsData.egec.seizedItemList",
        jsonPath: "auctionDetails.itemName",
        required: true,
        //  pattern: getPattern("VillageName"),
        errorMessage: "EC_ERR_DEFAULT_ITEM_NAME_INPUT_FIELD_MSG",
        gridDefination: {
          xs: 12,
          sm: 12,
          md: 6
        },
        props: {
          className: "applicant-details-error"
        },
        beforeFieldChange: (action, state, dispatch) => {
          try {
            let articlesSeizedDetails = get(state, 'screenConfiguration.preparedFinalObject.applyScreenMdmsData.egec.mergedList', []);
            let isobjselected = false;
            for (let index = 0; index < articlesSeizedDetails.length; index++) {
              const element = articlesSeizedDetails[index];

              if (element.violationItemUuid === action.value.split('~')[1]) {
                isobjselected = true;
                dispatch(prepareFinalObject("auctionDetails.seizedQty", element.actualQuantity));
                dispatch(prepareFinalObject("auctionDetails.itemStoreUuid", element.itemStoreUuid));

                dispatch(
                  handleField(
                    "apply",
                    "components.div.children.AuctionDetails.children.cardContent.children.articleDetailsConatiner.children.articleContainer.children.auctionCard.children.Quantity",
                    "props.disabled", true));
              } else {
                if (!isobjselected) {
                  dispatch(prepareFinalObject("auctionDetails.seizedQty", 0));
                }

              }


            }
          } catch (error) {

          }
        },
      })
    },
    Quantity: {
      ...getTextField({
        label: {
          labelName: "Seized Quantity",
          labelKey: "EC_AUCTION_SEIZED_QUANTITY_LABEL"
        },
        placeholder: {
          labelName: "Seized Quantity",
          labelKey: "EC_AUCTION_SEIZED_QUANTITY_PLACEHOLDER"
        },
        jsonPath: "auctionDetails.seizedQty",
        required: false,
        pattern: getPattern("Amount"),
        errorMessage: "EC_ERR_DEFAULT_INPUT_FIELD_MSG",
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
    auctionDate: {
      ...getDateField({
        label: {
          labelName: "Auction Date",
          labelKey: "EC_AUCTION_DATE_LABEL"
        },
        placeholder: {
          labelName: "Enter Auction Date",
          labelKey: "EC_AUCTION_DATE_PLACEHOLDER"
        },
        required: true,
        pattern: getPattern("Date"),
        sourceJsonPath: "auctionDetail[0].Date",
        errorMessage: "EC_ERR_DEFAULT_AUCTION_DATE_INPUT_FIELD_MSG",
        jsonPath: "auctionDetails.auctionDate",

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
    purchaserContact: {
      ...getTextField({
        label: {
          labelName: "Purchaser Contact",
          labelKey: "EC_AUCTION_PURCHASER_CONTACT_LABEL"
        },
        placeholder: {
          labelName: "Enter Purchaser Contact",
          labelKey: "EC_AUCTION_PURCHASER_CONTACT_PLACEHOLDER"
        },
        required: true,
        pattern: getPattern("MobileNo"),
        errorMessage: "EC_ERR_DEFAULT_PURCHASER_CONTACT_INPUT_FIELD_MSG",
        jsonPath: "auctionDetails.contactNumber",

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
    purchaserName: {
      ...getTextField({
        label: {
          labelName: "Purchaser Name",
          labelKey: "EC_AUCTION_PURCHASER_NAME_LABEL"
        },
        placeholder: {
          labelName: "Enter Purchaser Name",
          labelKey: "EC_AUCTION_PURCHASER_NAME_PLACEHOLDER"
        },
        required: true,
        pattern: getPattern("ECViolatorName"),
        errorMessage: "EC_ERR_DEFAULT_PURCHASER_NAME_INPUT_FIELD_MSG",
        jsonPath: "auctionDetails.purchaseName",

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
    purchaserQuantity: {
      ...getTextField({
        label: {
          labelName: "Purchaser Quantity",
          labelKey: "EC_AUCTION_PURCHASER_QUANTITY_LABEL"
        },
        placeholder: {
          labelName: "Enter Purchaser Quantity",
          labelKey: "EC_AUCTION_PURCHASER_QUANTITY_PLACEHOLDER"
        },
        required: true,
        pattern: getPattern("SeizedQuantity"),
        errorMessage: "EC_ERR_DEFAULT_PURCHASER_QUANTITY_INPUT_FIELD_MSG",
        jsonPath: "auctionDetails.purchaseQuantity",
        gridDefination: {
          xs: 12,
          sm: 12,
          md: 6
        },
        props: {
          className: "applicant-details-error"
        },

      })
    },
    amount: {
      ...getTextField({
        label: {
          labelName: "Amount",
          labelKey: "EC_AUCTION_AMOUNT_LABEL"
        },
        placeholder: {
          labelName: "Enter Amount",
          labelKey: "EC_AUCTION_AMOUNT_PLACEHOLDER"
        },
        required: true,
        pattern: getPattern("DecimalAmount"),
        errorMessage: "EC_ERR_DEFAULT_AUCTION_AMOUNT_INPUT_FIELD_MSG",
        jsonPath: "auctionDetails.amount",

        gridDefination: {
          xs: 12,
          sm: 12,
          md: 6
        },
        props: {
          className: "applicant-details-error"
        }
      })
    }
  };
};

export const AuctionDetails = getCommonCard({
  header: getCommonTitle(
    {
      labelName: "Auction Details",
      labelKey: "EC_AUCTION_DETAILS_HEADER"
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
        auctionCard: getCommonContainer(auctionDetailData())
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


