import {
  getCommonHeader,
  getTextField,
  getSelectField,
  getCommonContainer,
  getCommonSubHeader,
  getLabel,
  getPattern
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { showHideAdhocPopup } from "../../utils";
import {
  handleScreenConfigurationFieldChange as handleField,
  prepareFinalObject,
  toggleSnackbar,
  toggleSpinner
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { resetAllFields } from "../../utils";

import { createUpdateItemMaster } from "../../../../../ui-utils/commons";
import jp from "jsonpath";
import get from "lodash/get";
import set from "lodash/set";
import {
  getUserInfo,
  setapplicationMode
} from "egov-ui-kit/utils/localStorageUtils";
import { searchResultApiResponse } from "../searchResource/searchResultApiResponse";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import { getCommonApplyFooter, validateFields } from "../../utils";
import "./index.css";

const hasButton = getQueryArg(window.location.href, "hasButton");
let enableButton = true;
enableButton = hasButton && hasButton === "false" ? false : true;

const checkDuplicteRecord = (state, dispatch) => {
  try {
    let isduplicate = false;

    let obj = get(state.screenConfiguration.preparedFinalObject, "ItemMaster");
    let obj2 = get(
      state.screenConfiguration.preparedFinalObject,
      "ItemMasterGrid"
    );

    obj2.forEach(element => {
      if (obj.hasOwnProperty("itemUuid")) {
        if (obj.itemUuid.toString() !== element[0].split('~')[0].toString()) {
          if (
            !isduplicate &&
            element[1].trim().toLowerCase() == obj.itemName.trim().toLowerCase()
          ) {
            isduplicate = true;
            return true;
          }
        }
      }
      else {
        if (!isduplicate && element[1].trim().toLowerCase() == obj.itemName.trim().toLowerCase()) {
          isduplicate = true;
          return true;
        }
      }
    });
    return isduplicate;
  } catch (ex) {
    console.log(ex);
  }
};
const createUpdateItemMasterDetails = async (state, dispatch, applnid) => {
  let isDuplicateCheck = false;
  let isFormValid = true;
  isFormValid = validateFields(
    "components.adhocDialog.children.popup.children.addItemMasterCard.children.addItemMasterContainer.children",
    state,
    dispatch,
    "search"
  );
  if (isFormValid) {
    isDuplicateCheck = checkDuplicteRecord(state, dispatch);

    if (!isDuplicateCheck) {
      let response = await createUpdateItemMaster(state, dispatch, "APPROVED", true);
      setapplicationMode("APPROVED");
      let responseStatus = get(response, "status", "");
      if (responseStatus == "SUCCESS" || responseStatus == "success") {

        dispatch(
          toggleSnackbar(
            true,
            {
              labelName: "Item Master Inserted successfully!",
              labelKey: "EC_SUCCESS_TOASTER"
            },
            "success"
          )
        );
        dispatch(prepareFinalObject("ItemMaster", []));
        showHideAdhocPopup(state, dispatch, "search");
        searchResultApiResponse("", state, dispatch);

        setTimeout(() => window.location.reload(), 5000);
      } else {

        dispatch(
          toggleSnackbar(
            true,
            {
              labelName: "Submission Falied, Try Again later!",
              labelKey: "EC_FAILED_TOASTER"
            },
            "error"
          )
        );
      }
      //const objectJsonPath = `components.adhocDialog.children.popup.children.addItemMasterCard.children`;
      // const children = get(
      //   state.screenConfiguration.screenConfig["search"],
      //   objectJsonPath,
      //   {}
      // );
      // resetAllFields(children, dispatch, state, 'search');
    } else {

      dispatch(
        toggleSnackbar(
          true,
          {
            labelName: "Item already exist!",
            labelKey: "EC_ITEM_ALREADY_EXIST_TOASTER"
          },
          "warning"
        )
      );
      setTimeout(() => window.location.reload(), 5000);
    }
  }
};

const approveItemMasterDetails = async (state, dispatch, applnid) => {
  let response = await createUpdateItemMaster(state, dispatch, "APPROVED");
  setapplicationMode("APPROVED");
  let responseStatus = get(response, "status", "");
  if (responseStatus == "SUCCESS" || responseStatus == "success") {

    dispatch(
      toggleSnackbar(
        true,
        {
          labelName: "Item Master Updated successfully!",
          labelKey: "EC_UPDATE_SUCCESS_TOASTER"
        },
        "success"
      )
    );
    dispatch(prepareFinalObject("ItemMaster", {}));
    showHideAdhocPopup(state, dispatch, "search");
    searchResultApiResponse("", state, dispatch);
  } else {

    dispatch(
      toggleSnackbar(
        true,
        {
          labelName: "Submission Falied, Try Again later!",
          labelKey: "EC_FAILED_TOASTER"
        },
        "error"
      )
    );
  }
};

const rejectItemMasterDetails = async (state, dispatch, applnid) => {
  let response = await createUpdateItemMaster(state, dispatch, "REJECTED");
  setapplicationMode("REJECTED");
  let responseStatus = get(response, "status", "");
  if (responseStatus == "SUCCESS" || responseStatus == "success") {

    dispatch(
      toggleSnackbar(
        true,
        {
          labelName: "Item Master Updated successfully!",
          labelKey: "EC_UPDATE_SUCCESS_TOASTER"
        },
        "success"
      )
    );
    dispatch(prepareFinalObject("ItemMaster", {}));
    showHideAdhocPopup(state, dispatch, "search");
    searchResultApiResponse("", state, dispatch);
  } else {

    dispatch(
      toggleSnackbar(
        true,
        {
          labelName: "Submission Falied, Try Again later!",
          labelKey: "EC_FAILED_TOASTER"
        },
        "error"
      )
    );
  }
};

export const adhocPopup = getCommonContainer({

  header: {
    uiFramework: "custom-atoms",
    componentPath: "Container",
    props: {
      style: {
        width: "100%",
        float: "right"
      }
    },
    children: {
      div1: {
        uiFramework: "custom-atoms",
        componentPath: "Div",
        gridDefination: {
          xs: 12,
          sm: 12
        },
        props: {
          style: {
            width: "100%",
            float: "right"
          }
        },
        children: {
          div: getCommonHeader(
            {
              labelName: "Add Item",
              labelKey: "EC_POPUP_ITEM_MASTER_HEADER"
            },
            {
              style: {
                fontSize: "20px"
              }
            }
          )
        }
      },
      // submitbtns: {
      //   uiFramework: "custom-atoms",
      //   componentPath: "Div",
      //   gridDefination: {
      //     xs: 2,
      //     sm: 2
      //   },
      //   props: {
      //     style: {
      //       width: "100%",
      //       float: "right",
      //       cursor: "pointer"
      //     }
      //   },
      //   children: {
      //     closeButton: {
      //       componentPath: "Button",
      //       props: {
      //         style: {
      //           float: "right",
      //           color: "rgba(0, 0, 0, 0.60)"
      //         }
      //       },
      //       children: {
      //         // previousButtonIcon: {
      //         //   uiFramework: "custom-atoms",
      //         //   componentPath: "Icon",
      //         //   props: {
      //         //     iconName: "close"
      //         //   }
      //         // }
      //       },
      //       onClickDefination: {
      //         action: "condition",
      //         callBack: (state, dispatch) =>{
      //           showHideAdhocPopup(state, dispatch, "create");
      //           setTimeout(() => window.location.reload(), 1000);
      //         }   
      //       }
      //     }
      //   }
      // }
    }
  },

  addItemMasterCard: getCommonContainer(
    {
      addItemMasterContainer: getCommonContainer({
        addItemMasterIdControl: getTextField({
          label: {
            labelName: "Item/Article ID",
            labelKey: "EC_POPUP_ITEM_ARTICLE_ID_LABEL"
          },
          placeholder: {
            labelName: "Item/Article ID",
            labelKey: "EC_POPUP_ITEM_ARTICLE_ID_PLACEHOLDER"
          },
          gridDefination: {
            xs: 12,
            sm: 12
          },
          jsonPath: "ItemMaster.itemUuid",
          props: {
            style: {
              width: "100%"
            }
          },
          visible: false
        }),
        addItemMasterControl: getTextField({
          label: {
            labelName: "Name Of Item/Article",
            labelKey: "EC_POPUP_ITEM_ARTICLE_NAME_LABEL"
          },
          placeholder: {
            labelName: "Name Of Item/Article",
            labelKey: "EC_POPUP_ITEM_ARTICLE_NAME_PLACEHOLDER"
          },
          gridDefination: {
            xs: 12,
            sm: 12
          },
          jsonPath: "ItemMaster.itemName",
          required: true,
          pattern: getPattern("ECItemName"), ///^[a-zA-Z0-9 ]*$/i, // /^[a-zA-Z0-9]*$/i,
          // errorMessage: "EC_ERR_DEFAULT_INPUT_ADDRESS_FIELD_MSG",
          errorMessage: "EC_ERR_DEFAULT_INPUT_ITEM_NAME_FIELD_MSG",
          // props: {
          //     value: 'challanHOD',
          // },
          props: {
            style: {
              width: "100%"
            },
            className: "textfield-enterable-selection",
            multiline: true,
            rows: "4"
          },
        }),
        addItemMasterDescriptionControl: getTextField({
          label: {
            labelName: "Description",
            labelKey: "EC_POPUP_ITEM_ARTICLE_DESCRIPTION_LABEL"
          },
          placeholder: {
            labelName: "Description",
            labelKey: "EC_POPUP_ITEM_ARTICLE_DESCRIPTION_PLACEHOLDER"
          },
          gridDefination: {
            xs: 12,
            sm: 12
          },
          props: {
            style: {
              width: "100%"
            },
            className: "textfield-enterable-selection",
            multiline: true,
            rows: "4"
          },
          jsonPath: "ItemMaster.description",
          required: true,
          pattern: getPattern("ECItemDescription"), ///^[ A-Za-z0-9_@./#&+- ]{1,250}$/i,
          errorMessage: "EC_ERR_DEFAULT_INPUT_ITEM_DESCRIPTION_FIELD_MSG",
          //errorMessage: "Invalid input field",
        })
      })
    },
    {
      style: {
        marginTop: "24px"
      }
    }
  ),

  div: {
    uiFramework: "custom-atoms",
    componentPath: "Div",
    props: {
      style: {
        width: "100%",
        //textAlign: "right",
        display: "flex"
      }
    },
    children: {
      cancelApplicationButton: {
        componentPath: "Button",
        // gridDefination: {
        //   xs: 12,
        //   sm: 6,
        //   // align: "right"
        // },
        visible: enableButton,
        props: {
          variant: "outlined",
          color: "primary",
          style: {
            // color: "white",
            borderRadius: "2px",
            minWidth: "180px",
            height: "48px",
            marginRight: "16px",
            marginBottom: "8px"
          }
        },

        children: {
          // cancelIconInsideButton: {
          //   uiFramework: "custom-atoms",
          //   componentPath: "Icon",
          //   props: {
          //    // iconName: "close"
          //     // style: {
          //     //   fontSize: "24px"
          //     // }
          //   }
          // },

          buttonLabel: getLabel({
            labelName: "CANCEL",
            labelKey: "EC_POPUP_SEARCH_RESULTS_CANCEL_APP_BUTTON"
          })
        },
        onClickDefination: {
          action: "condition",
          callBack: (state, dispatch) => {
            dispatch(prepareFinalObject("ItemMaster", []));
            showHideAdhocPopup(state, dispatch, "search");
            // const objectJsonPath = `components.adhocDialog.children.popup.children.addItemMasterCard.children`;
            // const children = get(
            //   state.screenConfiguration.screenConfig["search"],
            //   objectJsonPath,
            //   {}
            // );
            // resetAllFields(children, dispatch, state, 'search');

            setTimeout(() => window.location.reload(), 1000);
          }
        },
        roleDefination: {
          rolePath: "user-info.roles",
          roles: ["challanEAO"]
          //path : "tradelicence/apply"
        }
      },
      saveApplicationButton: {
        componentPath: "Button",
        // gridDefination: {
        //   xs: 12,
        //   sm: 6,
        //   // align: "left"
        // },
        visible: enableButton,
        props: {
          variant: "contained",
          color: "primary",
          style: {
            color: "white",
            borderRadius: "2px",
            minWidth: "180px",
            height: "48px",
            marginRight: "16px",
            marginBottom: "8px"
          }
        },

        children: {
          // saveIconInsideButton: {
          //   uiFramework: "custom-atoms",
          //   componentPath: "Icon",
          //   props: {
          //    // iconName: "saveAlt"
          //     // style: {
          //     //   fontSize: "24px"
          //     // }
          //   }
          // },

          buttonLabel: getLabel({
            labelName: "SAVE",
            labelKey: "EC_POPUP_SEARCH_RESULTS_SAVE_APP_BUTTON"
          })
        },
        onClickDefination: {
          action: "condition",
          callBack: createUpdateItemMasterDetails
        },
        roleDefination: {
          rolePath: "user-info.roles",
          roles: ["challanEAO"]
          //path : "tradelicence/apply"
        }
      },
      RejectApplicationButton: {
        componentPath: "Button",
        // gridDefination: {
        //   xs: 12,
        //   sm: 6,
        //   // align: "right"
        // },
        visible: enableButton,
        props: {
          variant: "contained",
          color: "primary",
          style: {
            color: "white",
            borderRadius: "2px",
            minWidth: "180px",
            height: "48px",
            marginRight: "16px",
            marginBottom: "8px"
          }
        },

        children: {
          rejectIconInsideButton: {
            uiFramework: "custom-atoms",
            componentPath: "Icon"
            // props: {
            //     iconName: "thumbDownAlt",
            //     style: {
            //       fontSize: "24px"
            //     }
            // }
          },

          buttonLabel: getLabel({
            labelName: "Reject",
            labelKey: "EC_POPUP_SEARCH_RESULTS_REJECT_APP_BUTTON"
          })
        },
        onClickDefination: {
          action: "condition",
          callBack: rejectItemMasterDetails
        },
        roleDefination: {
          rolePath: "user-info.roles",
          roles: ["challanHOD"]
          //path : "tradelicence/apply"
        }
      },
      approveApplicationButton: {
        componentPath: "Button",
        // gridDefination: {
        //   xs: 12,
        //   sm: 6,
        //   // align: "left"
        // },
        visible: enableButton,
        props: {
          variant: "contained",
          color: "primary",
          style: {
            color: "white",
            borderRadius: "2px",
            minWidth: "180px",
            height: "48px",
            marginRight: "16px",
            marginBottom: "8px"
          }
        },

        children: {
          approveIconInsideButton: {
            uiFramework: "custom-atoms",
            componentPath: "Icon"
            // props: {
            //     iconName: "ThumbUpAlt",
            //     style: {
            //       fontSize: "24px"
            //     }
            // }
          },

          buttonLabel: getLabel({
            labelName: "APPROVE",
            labelKey: "EC_POPUP_SEARCH_RESULTS_APPROVE_APP_BUTTON"
          })
        },
        onClickDefination: {
          action: "condition",
          callBack: approveItemMasterDetails
        },
        roleDefination: {
          rolePath: "user-info.roles",
          roles: ["challanHOD"]
          //path : "tradelicence/apply"
        }
      }
    },
    gridDefination: {
      xs: 12,
      sm: 12
    }
  }
});
