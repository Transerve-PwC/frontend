import {
  getCommonHeader,
  getTextField,
  getSelectField,
  getCommonContainer,
  getDateField,
  getCommonSubHeader,
  getLabel,
  getPattern,
  convertEpochToDate
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { showHideAdhocPopup, resetAllFields, convertDateTimeToEpoch } from "../../utils";
import {
  handleScreenConfigurationFieldChange as handleField,
  prepareFinalObject,
  toggleSnackbar,
  toggleSpinner
} from "egov-ui-framework/ui-redux/screen-configuration/actions";

import { createUpdateFineMaster } from "../../../../../ui-utils/commons";
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

const createUpdateFineMasterDetails = async (state, dispatch, applnid) => {

  let isDuplicateCheck = false;
  let isFormValid = true;
  isFormValid = validateFields(
    "components.adhocDialog.children.popup.children.addFineMasterCard.children.addFineMasterContainer.children",
    state,
    dispatch,
    "search"
  );
  if (isFormValid) {
    //isDuplicateCheck = checkDuplicteRecord(state, dispatch);


    if (!isDuplicateCheck) {
      let response = await createUpdateFineMaster(state, dispatch, "PENDING", true);
      setapplicationMode("PENDING");
      let responseStatus = get(response, "status", "");
      if (responseStatus == "SUCCESS" || responseStatus == "success") {
        dispatch(
          toggleSnackbar(
            true,
            {
              labelName: "Fine Inserted successfully!",
              labelKey: "EC_FINE_MASTER_SUCCESS_TOASTER"
            },
            "success"
          )
        );
        dispatch(prepareFinalObject("FineMaster", {}));
        showHideAdhocPopup(state, dispatch, "search");
        searchResultApiResponse("", state, dispatch);
        //window.location.reload();
        setTimeout(() => window.location.reload(), 5000);
      }
      else if (responseStatus === "InValidStartDate") {
        dispatch(
          toggleSnackbar(
            true,
            {
              labelName: "Start Date should be greater then the previous End Date for the selected Criteria",
              labelKey: "EC_FINE_MASTER_FAILED_START_DATE_TOASTER"
            },
            "warning"
          )
        );
      }
      else if (responseStatus === "InValidEndDate") {
        dispatch(
          toggleSnackbar(
            true,
            {
              labelName: "End Date should be greater then the Start Date for the selected Criteria",
              labelKey: "EC_FINE_MASTER_FAILED_END_DATE_TOASTER"
            },
            "warning"
          )
        );
      } else {

        dispatch(
          toggleSnackbar(
            true,
            {
              labelName: "Submission Falied, Try Again later!",
              labelKey: "EC_FINE_MASTER_FAILED_TOASTER"
            },
            "error"
          )
        );
        setTimeout(() => window.location.reload(), 5000);
      }
      //const objectJsonPath = `components.adhocDialog.children.popup.children.addFineMasterCard.children`;
      // const children = get(
      //   state.screenConfiguration.screenConfig["search"],
      //   objectJsonPath,
      //   {}
      // );
      // resetAllFields(children, dispatch, state, 'search');



    } else {
      // let errorMessage =
      //     getLabel({
      //         labelName: 'Fine Master already exist!',
      //         labelKey: "EC_SUCCESS_TOASTER"
      //     });
      dispatch(
        toggleSnackbar(
          true,
          {
            labelName: "Fine already exist!",
            labelKey: "EC_FINE_ALREADY_EXIST_TOASTER"
          },
          "warning"
        )
      );
    }
  }
};

const approveFineMasterDetails = async (state, dispatch, applnid) => {
  let response = await createUpdateFineMaster(state, dispatch, "APPROVE", true);
  setapplicationMode("APPROVE");
  let responseStatus = get(response, "status", "");

  if (responseStatus === "SUCCESS" || responseStatus === "success") {
    // let errorMessage =
    //     getLabel({
    //         labelName: 'Fine Master Inserted successfully!',
    //         labelKey: ""//"EC_FINE_MASTER_SUCCESS_TOASTER"
    //     });
    dispatch(
      toggleSnackbar(
        true,
        {
          labelName: "Fine Master Approved Successfully!",
          labelKey: "EC_FINE_MASTER_APPROVE_SUCCESS_TOASTER"
        },
        "success"
      )
    );

    dispatch(prepareFinalObject("FineMaster", {}));
    showHideAdhocPopup(state, dispatch, "search");
    searchResultApiResponse("", state, dispatch);
  } else {
    dispatch(
      toggleSnackbar(
        true,
        {
          labelName: "Submission Falied, Try Again later!",
          labelKey: "EC_FINE_MASTER_FAILED_TOASTER"
        },
        "error"
      )
    );
  }
};

const rejectFineMasterDetails = async (state, dispatch, applnid) => {
  let response = await createUpdateFineMaster(state, dispatch, "REJECT", true);
  setapplicationMode("REJECT");
  let responseStatus = get(response, "status", "");
  if (responseStatus == "SUCCESS" || responseStatus == "success") {

    dispatch(
      toggleSnackbar(
        true,
        {
          labelName: "Fine Master Rejected Successfully!",
          labelKey: "EC_FINE_MASTER_REJECTED_TOASTER"
        },
        "success"
      )
    );
    dispatch(prepareFinalObject("FineMaster", {}));
    showHideAdhocPopup(state, dispatch, "search");
    searchResultApiResponse("", state, dispatch);
  } else {

    dispatch(
      toggleSnackbar(
        true,
        {
          labelName: "Submission Falied, Try Again later!",
          labelKey: "EC_FINE_MASTER_FAILED_TOASTER"
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
        float: "right",

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
              labelName: "Add/Edit Fine Master",
              labelKey: "EC_POPUP_ADD_EDIT_FINE_MASTER_HEADER"
            },
            {
              style: {
                fontSize: "20px"
              }
            }
          ),
          div1: getCommonHeader(
            {
              labelName: "Approve/Reject Fine Master ",
              labelKey: "EC_POPUP_REJECT_APPROVED_FINE_MASTER_HEADER"
            },
            {
              style: {
                fontSize: "20px"
              }
            }
          )
        }
      },
    }
  },
  addFineMasterCard: getCommonContainer(
    {
      addFineMasterContainer: getCommonContainer({
        addFineMasterIdControl: getTextField({
          label: {
            labelName: "Fine Master ID",
            labelKey: "EC_POPUP_FINE_MASTER_LABEL"
          },
          placeholder: {
            labelName: "Fine Master ID",
            labelKey: "EC_POPUP_FINE_MASTER_ID_PLACEHOLDER"
          },
          gridDefination: {
            xs: 12,
            sm: 12
          },
          jsonPath: "FineMaster.fineUuid",
          props: {
            style: {
              width: "100%"
            }
          },
          visible: false
        }),

        addFineMasterTypeofEncroachmentEditControl: getTextField({
          label: {
            labelName: "Type of Encroachment",
            labelKey: "EC_POPUP_FINE_MASTER_TYPE_OF_ENCROACHMENT_LABEL"
          },
          placeholder: {
            labelName: "Type of Encroachment",
            labelKey: "EC_POPUP_FINE_MASTER_TYPE_OF_ENCROACHMENT_PLACEHOLDER"
          },
          gridDefination: {
            xs: 12,
            sm: 12
          },
          jsonPath: "FineMaster.encroachmentTypeName",
          visible: false,
          required: true,
          props: {
            style: {
              width: "100%"
            },
            disabled: true,
          }
        }),
        addFineMasterEditControl: getTextField({
          label: {
            labelName: "Violation Count / Vehicle Type",
            labelKey: "EC_POPUP_FINE_MASTER_NUMBER_OF_VIOLATION_LABEL"
          },
          placeholder: {
            labelName: "Violation Count / Vehicle Type",
            labelKey: "EC_POPUP_FINE_MASTER_NUMBER_OF_VIOLATION_PLACEHOLDER"
          },
          gridDefination: {
            xs: 12,
            sm: 12
          },
          jsonPath: "FineMaster.numberOfViolation",
          required: true,
          visible: false,
          props: {
            style: {
              width: "100%"
            },
            disabled: true,
          }
        }),

        addFineMasterTypeofEncroachment: getSelectField({
          label: {
            labelName: "Type of Encroachment",
            labelKey: "EC_POPUP_FINE_MASTER_TYPE_OF_ENCROACHMENT_LABEL"
          },
          placeholder: {
            labelName: "Type of Encroachment",
            labelKey: "EC_POPUP_FINE_MASTER_TYPE_OF_ENCROACHMENT_PLACEHOLDER"
          },
          gridDefination: {
            xs: 12,
            sm: 12
          },
          optionLabel: "name",
          optionValue: "code",
          sourceJsonPath: "applyScreenMdmsData.egec.EncroachmentType",
          jsonPath: "FineMaster.encroachmentType",
          required: true,
          errorMessage: "EC_ERR_DEFAULT_INPUT_FINE_ENCROACHMENT_FIELD_MSG",
          props: {
            style: {
              width: "100%"
            }
          },
          beforeFieldChange: (action, state, dispatch) => {
            try {

              if (action.value === "Seizure of Vehicles") {
                dispatch(
                  prepareFinalObject(
                    "applyScreenMdmsData.egec.Numberofvioalation-new",
                    get(
                      state,
                      "screenConfiguration.preparedFinalObject.applyScreenMdmsData.egec.VehicleType",
                      []
                    )
                  )
                );
                dispatch(
                  handleField(
                    "search",
                    "components.adhocDialog.children.popup.children.addFineMasterCard.children.addFineMasterContainer.children.addFineMasterStorageControl",
                    "props.required",
                    true
                  )
                );
                //disabled
                dispatch(
                  handleField(
                    "search",
                    "components.adhocDialog.children.popup.children.addFineMasterCard.children.addFineMasterContainer.children.addFineMasterStorageControl",
                    "props.disabled",
                    false
                  )
                );
              } else {
                dispatch(
                  prepareFinalObject(
                    "applyScreenMdmsData.egec.Numberofvioalation-new",
                    get(
                      state,
                      "screenConfiguration.preparedFinalObject.applyScreenMdmsData.egec.NumberOfViolation",
                      []
                    )
                  )
                );

                dispatch(
                  handleField(
                    "search",
                    "components.adhocDialog.children.popup.children.addFineMasterCard.children.addFineMasterContainer.children.addFineMasterStorageControl",
                    "props.required",
                    true
                  )
                );
                //disabled
                dispatch(
                  handleField(
                    "search",
                    "components.adhocDialog.children.popup.children.addFineMasterCard.children.addFineMasterContainer.children.addFineMasterStorageControl",
                    "props.disabled",
                    true
                  )
                );
              }
            } catch (e) {
              console.log(e);
            }
          }
        }),
        addFineMasterControl: getSelectField({
          label: {
            labelName: "Violation Count / Vehicle Type",
            labelKey: "EC_POPUP_FINE_MASTER_NUMBER_OF_VIOLATION_LABEL"
          },
          placeholder: {
            labelName: "Violation Count / Vehicle Type",
            labelKey: "EC_POPUP_FINE_MASTER_NUMBER_OF_VIOLATION_PLACEHOLDER"
          },
          gridDefination: {
            xs: 12,
            sm: 12
          },
          sourceJsonPath: "applyScreenMdmsData.egec.Numberofvioalation-new",
          jsonPath: "FineMaster.numberOfViolation",
          required: true,
          errorMessage: "EC_ERR_DEFAULT_INPUT_FINE_VIOLATION_COUNT_FIELD_MSG",
          optionLabel: "name",
          optionValue: "code",
          props: {
            style: {
              width: "100%"
            }
          }
        }),
        addFineMasterFineAmountControl: getTextField({
          label: {
            labelName: "Fine Amount",
            labelKey: "EC_POPUP_FINE_MASTER_AMOUNT_LABEL"
          },
          placeholder: {
            labelName: "Fine Amount",
            labelKey: "EC_POPUP_FINE_MASTER_AMOUNT_PLACEHOLDER"
          },
          gridDefination: {
            xs: 12,
            sm: 12
          },
          props: {
            style: {
              width: "100%",
              //className:"applicant-details-error"
            }
          },
          jsonPath: "FineMaster.penaltyAmount",
          required: true,
          pattern: getPattern("DecimalAmount"),///^[ A-Za-z0-9_@./#&+- ]{1,250}$/i,
          errorMessage: "EC_ERR_DEFAULT_INPUT_FINE_AMOUNT_FIELD_MSG",
        }),
        addFineMasterStorageControl: getTextField({
          label: {
            labelName: "Storage Amount(Per Day Basis)",
            labelKey: "EC_POPUP_FINE_MASTER_STORAGE_AMOUNT_PER_DAY_BASIS_LABEL"
          },
          placeholder: {
            labelName: "Storage Amount(Per Day Basis)",
            labelKey:
              "EC_POPUP_FINE_MASTER_STORAGE_AMOUNT_PER_DAY_BASIS_PLACEHOLDER"
          },
          gridDefination: {
            xs: 12,
            sm: 12
          },
          props: {
            style: {
              width: "100%"
            }
          },
          jsonPath: "FineMaster.storageCharges",
          required: true,
          pattern: getPattern("DecimalAmount"), ///^[ A-Za-z0-9_@./#&+- ]{1,250}$/i,
          errorMessage: "EC_ERR_DEFAULT_INPUT_FINE_STORAGE_BASIS_AMOUNT_FIELD_MSG",

        }),

        addFineMasterStartDate: getDateField({
          label: {
            labelName: "Start Date",
            labelKey: "EC_POPUP_FINE_MASTER_START_DATE"
          },
          placeholder: {
            labelName: "Start Date",
            labelKey:
              "EC_POPUP_FINE_MASTER_START_DATE_PLACEHOLDER"
          },
          gridDefination: {
            xs: 12,
            sm: 12
          },
          props: {
            style: {
              width: "100%"
            }
          },
          jsonPath: "FineMaster.effectiveStartDate",
          required: true,
          pattern: getPattern("Date"),///^[ A-Za-z0-9_@./#&+- ]{1,250}$/i,
          errorMessage: "EC_ERR_DEFAULT_INPUT_FINE_START_DATE_FIELD_MSG",
          beforeFieldChange: (action, state, dispatch) => {
            try {
              let gridCurrentRecord = get(state, 'screenConfiguration.preparedFinalObject.FineMaster', []);
              let fineGridRecord = get(state, 'screenConfiguration.preparedFinalObject.FineMasterGrid', []);
              let curlistRecord = [];
              fineGridRecord.forEach(element => {
                if (element[1] === gridCurrentRecord.encroachmentType && element[2] === gridCurrentRecord.numberOfViolation) {
                  curlistRecord.push(element);
                }
              });
              if (curlistRecord.length > 0) {
                let isactionDateLess = false
                let isactionDateEquall = false
                for (let index = 0; index < curlistRecord.length; index++) {
                  const element = curlistRecord[index];
                  let eleDate = convertEpochToDate(convertDateTimeToEpoch(element[6]));
                  let actionDate = convertEpochToDate(convertDateTimeToEpoch(action.value));
                  if (actionDate < eleDate) {
                    if (!isactionDateLess)
                      isactionDateLess = true;
                  } else if (actionDate === eleDate) {
                    if (!isactionDateEquall)
                      isactionDateEquall = true
                  }

                }
              }

            } catch (error) {

            }
          },
        }),
        addFineMasterEndDate: getDateField({
          label: {
            labelName: "End Date",
            labelKey: "EC_POPUP_FINE_MASTER_END_DATE_LABEL"
          },
          placeholder: {
            labelName: "End Date",
            labelKey:
              "EC_POPUP_FINE_MASTER_END_DATE_PLACEHOLDER"
          },
          gridDefination: {
            xs: 12,
            sm: 12
          },
          props: {
            style: {
              width: "100%"
            }
          },

          jsonPath: "FineMaster.effectiveEndDate",
          required: true,
          pattern: getPattern("Date"), ///^[ A-Za-z0-9_@./#&+- ]{1,250}$/i,
          errorMessage: "EC_ERR_DEFAULT_INPUT_FINE_END_DATE_FIELD_MSG",
        }),
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
          //     iconName: "close"
          //     // style: {
          //     //   fontSize: "24px"
          //     // }
          //   }
          // },

          buttonLabel: getLabel({
            labelName: "CANCEL",
            labelKey: "EC_POPUP_SEARCH_RESULTS_FINE_MASTER_CANCEL_APP_BUTTON"
          })
        },
        onClickDefination: {
          action: "condition",
          callBack: (state, dispatch) => {
            dispatch(prepareFinalObject("FineMaster", []));
            showHideAdhocPopup(state, dispatch, "search");
            setTimeout(() => window.location.reload(), 1000);
            // const objectJsonPath = `components.adhocDialog.children.popup.children.addFineMasterCard.children`;
            // const children = get(
            //   state.screenConfiguration.screenConfig["search"],
            //   objectJsonPath,
            //   {}
            // );
            // resetAllFields(children, dispatch, state, 'search');

          }
        },
        roleDefination: {
          rolePath: "user-info.roles",
          roles: ["challanEAO", "challanHOD"]
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
          //     iconName: "saveAlt"
          //     // style: {
          //     //   fontSize: "24px"
          //     // }
          //   }
          // },

          buttonLabel: getLabel({
            labelName: "SAVE",
            labelKey: "EC_POPUP_SEARCH_RESULTS_FINE_MASTER_SAVE_APP_BUTTON"
          })
        },
        onClickDefination: {
          action: "condition",
          callBack: createUpdateFineMasterDetails
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
          // rejectIconInsideButton: {
          //   uiFramework: "custom-atoms",
          //   componentPath: "Icon",
          //   props: {
          //     //iconName: "thumbDownAlt",
          //     // style: {
          //     //   fontSize: "24px"
          //     // }
          //   }
          // },

          buttonLabel: getLabel({
            labelName: "Reject",
            labelKey: "EC_POPUP_SEARCH_RESULTS_FINE_MASTER_REJECT_APP_BUTTON"
          })
        },
        onClickDefination: {
          action: "condition",
          callBack: rejectFineMasterDetails
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
          // approveIconInsideButton: {
          //   uiFramework: "custom-atoms",
          //   componentPath: "Icon",
          //   props: {
          //     //iconName: "ThumbUpAlt",
          //     // style: {
          //     //   fontSize: "24px"
          //     // }
          //   }
          // },

          buttonLabel: getLabel({
            labelName: "APPROVE",
            labelKey: "EC_POPUP_SEARCH_RESULTS_FINE_MASTER_APPROVE_APP_BUTTON"
          })
        },
        onClickDefination: {
          action: "condition",
          callBack: approveFineMasterDetails
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
