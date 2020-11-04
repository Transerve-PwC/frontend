import {
  getCommonHeader, getTextField, getSelectField, getCommonContainer, getCommonSubHeader, getLabel, getPattern, getDateField
} from "egov-ui-framework/ui-config/screens/specs/utils";

import {
  resetAllFields,
  showHideAdhocPopup, showHideAdhocPopupReceivePayment, showHideAdhocPopupForwardUploadDocs, 
  callbackforsearchPreviewAction, generateReceiptNumber, showHideDeleteConfirmation,
  showHideChallanConfirmation,
  showHideChallanReturnAndCloseConfirmation
} from "../../utils";
import get from "lodash/get";
import { httpRequest } from "../../../../../ui-utils/api";
import { prepareFinalObject, toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import set from "lodash/set";
import { UpdateStatus, addToStoreViolationData, UpdateChallanStatus } from "../../../../../ui-utils/commons";
import { documentDetails } from "./documentDetails";
import { getTenantId } from "egov-ui-kit/utils/localStorageUtils";
import { callPGService } from "./footer";

import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import { getDateInEpoch } from "egov-ui-framework/ui-utils/commons";
import {
  toggleSpinner,
  handleScreenConfigurationFieldChange as handleField
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { onItemMasterRowClick } from "../../egov-echallan-item-master/searchResource/serachResultGrid";
import { returnandClosePayment } from "../summaryResource/footer";


const ItemMasterDeleteRowClick = async(state,dispatch) => {
 let rowdata =   get(state, 'screenConfiguration.preparedFinalObject.tableMetarowData', {});
 onItemMasterRowClick(rowdata,true);
};

const callBackForwardAddToStore = async (state, dispatch) => {

  let seizeditemlist = get(state, 'screenConfiguration.preparedFinalObject.eChallanSMSeizedList', {});
  let isdamageqtyavailable = true;
  let isIntactqtyavailable = true;
  let isremarkavailable = true;

  if (isdamageqtyavailable && isIntactqtyavailable && isremarkavailable) {
    dispatch(toggleSpinner());
    let response = await addToStoreViolationData(state, dispatch, false);
    let responseStatus = get(response, "status", "");
    dispatch(toggleSpinner());
    if (responseStatus == "SUCCESS" || responseStatus == "success") {
      dispatch(toggleSnackbar(true, {
        labelName: 'Challan verified and updated to store successfully!',
        labelKey: "", //"EC_SUCCESS_TOASTER"
      }, "success"));
    }
    else {
      dispatch(toggleSnackbar(true, {
        labelName: 'Challan verification and updation failed!. Please try after some time',
        labelKey: "", //"EC_SUCCESS_TOASTER"
      }, "error"));
    }
    callbackforsearchPreviewAction(state, dispatch);
  }

}


const popupvalidate = () => {

  let allAreFilled = true;
  let isFormValid = true;
  let hasFieldToaster = false;
  document.getElementById("material-ui-popup").querySelectorAll("[required]").forEach(function (i) {
    i.parentNode.classList.remove("MuiInput-error-853");
    i.parentNode.parentNode.classList.remove("MuiFormLabel-error-844");
    if (!i.value) {
      i.focus();
      allAreFilled = false;
      i.parentNode.classList.add("MuiInput-error-853");
      i.parentNode.parentNode.classList.add("MuiFormLabel-error-844");
    }
    if (i.getAttribute("aria-invalid") === 'true' && allAreFilled) {
      i.parentNode.classList.add("MuiInput-error-853");
      i.parentNode.parentNode.classList.add("MuiFormLabel-error-844");
      allAreFilled = false;
      isFormValid = false;
      hasFieldToaster = true;
    }
  })
  if (!allAreFilled) {
    //  alert('Fill all fields1')
    isFormValid = false;
    hasFieldToaster = true;
  }
  else {
    // alert('Submit1')

    isFormValid = true;
    hasFieldToaster = false;
  }
  return [isFormValid, hasFieldToaster]
}
const moveToReview = (state, dispatch, applnid) => {
  const documentsFormat = Object.values(get(state.screenConfiguration.preparedFinalObject, "documentsUploadRedux")
  );

  let validateDocumentField = false;

  for (let i = 0; i < documentsFormat.length; i++) {
    let isDocumentRequired = get(documentsFormat[i], "isDocumentRequired");
    let isDocumentTypeRequired = get(
      documentsFormat[i], "isDocumentTypeRequired");

    let documents = get(documentsFormat[i], "documents");
    if (isDocumentRequired) {
      if (documents && documents.length > 0) {
        if (isDocumentTypeRequired) {
          if (get(documentsFormat[i], "dropdown.value")) {
            validateDocumentField = true;
          } else {
            dispatch(
              toggleSnackbar(
                true,
                { labelName: "Please select type of Document!", labelKey: "" },
                "warning"
              )
            );
            validateDocumentField = false;
            break;
          }
        } else {
          validateDocumentField = true;
        }
      } else {
        dispatch(
          toggleSnackbar(
            true,
            { labelName: "Please uplaod mandatory documents!", labelKey: "" },
            "warning"
          )
        );
        validateDocumentField = false;
        break;
      }
    } else {
      validateDocumentField = true;
    }
  }

  validateDocumentField = true;
  if (validateDocumentField) {
    return true
  }
};

const createOfflinePaymentObj = async (state, dispatch) => {

  let eChallanDetail = get(state, 'screenConfiguration.preparedFinalObject.eChallanDetail[0]', {});
  let paymentGateway = get(state, 'screenConfiguration.preparedFinalObject.eChallanReceivePayament[0].paymentMode', 'Cash');
  let billDetails = get(state, 'screenConfiguration.preparedFinalObject.ReceiptTemp[0].Bill[0]', {});
  let CollectionPaymentDetail = {
    id: null,
    tenantId: getTenantId(),
    totalDue: billDetails.totalAmount,
    totalAmountPaid: billDetails.totalAmount,
    manualReceiptNumber: null,
    manualReceiptDate: null,
    receiptNumber: generateReceiptNumber(eChallanDetail.challanId),
    receiptDate: null,
    receiptType: null,
    businessService: billDetails.businessService, //null
    billId: billDetails.billDetails[0].billId,
    bill: billDetails.billDetails[0], //null,
    additionalDetails: billDetails.additionalDetails, //null,
    auditDetails: billDetails.auditDetails //null
  };

  let payment = {
    id: null,
    tenantId: getTenantId(),
    totalDue: billDetails.totalAmount,
    totalAmountPaid: billDetails.totalAmount,
    transactionNumber: eChallanDetail.challanId,
    transactionDate: getDateInEpoch(),
    paymentMode: "CASH",
    paymentGateway: paymentGateway,
    instrumentDate: getDateInEpoch(),
    instrumentNumber: eChallanDetail.challanId,
    instrumentStatus: null,
    ifscCode: null,
    auditDetails: null,
    additionalDetails: null,
    paymentDetails: [CollectionPaymentDetail],
    paidBy: eChallanDetail.violatorName,
    mobileNumber: eChallanDetail.contactNumber,
    payerName: eChallanDetail.violatorName,
    payerAddress: null,
    payerEmail: eChallanDetail.emailId,
    payerId: null,
    paymentStatus: 'PAID'
  }
  let Payments = { payment };
  let responses = await httpRequest(
    "post",
    "collection-services/payments/_create", // "/ec-services/v1/_update",
    "", [], {
    payment
  });

  return responses;
}

const challanCloseOnGround = async (state,dispatch)=> {
  let response = await UpdateChallanStatus(state, dispatch, "CLOSED");
  if (response.status === 'success') {
    dispatch(
      toggleSnackbar(
        true,
        { labelName: "Challan has been closed", labelKey: "EC_TOASTER_ON_GROUND_PAYMENT_SUCCESS" },
        "success"
      )
    );
    callbackforsearchPreviewAction(state, dispatch);
  }
  else {
    dispatch(
      toggleSnackbar(
        true,
        { labelName: "Please try after sometime", labelKey: "EC_TOASTER_ON_GROUND_PAYMENT_ERROR" },
        "error"
      )
    );
  }
}

const receivePaymentUpdateStatus = async (state, dispatch) => {
  let isFormValid = get(state, 'screenConfiguration.preparedFinalObject.eChallanReceivePayament[0].paymentMode', '') === '' ? false : true;
  if (isFormValid) {

    let eChallanDetail = get(state, 'screenConfiguration.preparedFinalObject.eChallanDetail[0]', {});

    let RequestBody = {
      paymentMode: 'OFFLINE',
      paymentGateway: get(state, 'screenConfiguration.preparedFinalObject.eChallanReceivePayament[0].paymentMode', 'Cash'),
      transactionId: '',
      pgStatus: 'success',
      paymentStatus: 'PAID',
      challanId: eChallanDetail.challanId,
      challanUuid: eChallanDetail.challanUuid,
      tenantId: getTenantId(),
    }

    let responses = await httpRequest(
      "post",
      "ec-services/storeitemregister/_updateStorePayment", // "/ec-services/v1/_update",
      "", [], {
      RequestBody
    });
    if (responses.ResponseInfo.status === 'Success') {
      let Paymentsresponses = await createOfflinePaymentObj(state, dispatch);
      if (Paymentsresponses.ResponseInfo.status === '200') {

        dispatch(setRoute(
          `/egov-echallan/acknowledgement?purpose=${"pay"}&status=${"success"}&applicationNumber=${eChallanDetail.challanId}&tenantId=${eChallanDetail.tenantId}&secondNumber=${eChallanDetail.challanId}&encroachmentType=${eChallanDetail.encroachmentType}`
        ));
      }
    }
  }
  else {
    let errorMessage = {
      labelName:
        "Please fill all mandatory fields for Applicant Details, then proceed!",
      labelKey: "EC_ERR_FILL_ALL_MANDATORY_FIELDS_APPLICANT_TOAST"
    };
    dispatch(toggleSnackbar(true, errorMessage, "warning"));
  }
};

const resetField = async (state, dispatch) => {
  const objectJsonPath = `components.receivePayment.children.popup.children.receivePaymentCard.children`;
  const children = get(
    state.screenConfiguration.screenConfig["search-preview"],
    objectJsonPath,
    {}
  );
  resetAllFields(children, dispatch, state, 'search-preview');
}

const resetCitizenField = async (state, dispatch) => {
  const objectJsonPath = `components.adhocDialog.children.popup.children.adhocPenaltyCard.children`
  const children = get(
    state.screenConfiguration.screenConfig["pay"],
    objectJsonPath,
    {}
  );
  resetAllFields(children, dispatch, state, 'pay');
}

export const paymentGatewaySelectionPopup = getCommonContainer({
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
              labelName: "Select Gateway",
              labelKey: "EC_SELECT_GATEWAY_POPUP_HEADER"
            },
            {
              style: {
                fontSize: "16px"
              }
            }
          )
        }
      },
    }
  },
  adhocPenaltyCard: getCommonContainer(
    {
      CitizenPaymentGatewayContainer: getCommonContainer({
        CitizenPaymentGatewayCard: getSelectField({
          label: {
            labelName: "Select Gateway",
            labelKey: "EC_SELECT_GATEWAY_POPUP_HEADER"
          },
          placeholder: {
            labelName: "Select Gateway",
            labelKey: "EC_SELECT_GATEWAY_POPUP_HEADER"
          },
          gridDefination: {
            xs: 12,
            sm: 12
          },
          props: {
            style: {
              width: "90%"
            }
          },
          optionLabel: "element",
          optionValue: "element",
          sourceJsonPath: "applyScreenMdmsData.payment",
          jsonPath: "eChallanDetail.paymentGateway"
        })
      })
    },
    {
      style: {
        marginTop: "12px"
      }
    }
  ),
  div: {
    uiFramework: "custom-atoms",
    componentPath: "Div",
    props: {
      style: {
        width: "100%",
        // textAlign: "right"
      }
    },
    children: {
      cancelButton: {
        componentPath: "Button",
        props: {
          variant: "outlined",
          color: "primary",
          style: {
            minWidth: "180px",
            height: "48px",
            marginRight: "16px",
            marginBottom: "8px",
          }
        },
        children: {
          previousButtonLabel: getLabel({
            labelName: "CANCEL",
            labelKey: "EC_ECHALLAN_PAYMENT_GATEWAY_POPUP_BUTTON_CANCEL"
          })
        },
        onClickDefination: {
          action: "condition",
          callBack: (state, dispatch) => {
            //screenConfiguration.screenConfig.pay.components.adhocDialog.children.popup.componentJsonpath
            resetCitizenField(state, dispatch);
            showHideAdhocPopup(state, dispatch, "pay")
          }
        }
      },
      addButton: {
        componentPath: "Button",
        props: {
          variant: "contained",
          color: "primary",
          style: {
            minWidth: "180px",
            height: "48px",
            marginBottom: "8px"
          }
        },
        children: {
          previousButtonLabel: getLabel({
            labelName: "Submit",
            labelKey: "EC_ECHALLAN_PAYMENT_GATEWAY_POPUP_BUTTON_SUBMIT"
          })
        },
        onClickDefination: {
          action: "condition",
          callBack: callPGService
        }
      }
    }
  }
});


export const adhocPopupStockViolationForwardHOD = getCommonContainer({
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
              labelName: "Remarks",
              labelKey: "EC_REMARKS_STOCK_HOD"
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

  adhocViolationForwardCard: getCommonContainer(
    {
      adhocViolationForwardContainer: getCommonContainer({
        documentDetails,
      })
    },
    // {
    //   style: {
    //     marginTop: "-30px"
    //   }
    // }
  ),
  div: {
    uiFramework: "custom-atoms",
    componentPath: "Div",
    props: {
      style: {
        width: "100%",
        marginTop: "20px",
        // textAlign: "right"
      }
    },
    children: {
      cancelButton: {
        componentPath: "Button",
        props: {
          variant: "outlined",
          color: "primary",
          style: {
            minWidth: "180px",
            height: "48px",
            marginRight: "16px",
            marginBottom: "8px"
          }
        },
        children: {
          previousButtonLabel: getLabel({
            labelName: "CANCEL",
            labelKey: "EC_POPUP_SM_RECEIVE_CANCEL"
          })
        },
        onClickDefination: {
          action: "condition",
          callBack: (state, dispatch) => {
            showHideAdhocPopupForwardUploadDocs(state, dispatch, "search-preview")
            set(state, 'form', {});
            set(state,
              "screenConfiguration.preparedFinalObject.violationDocuments",
              ""
            )
          }
        }
      },
      addButton: {
        componentPath: "Button",
        props: {
          variant: "contained",
          color: "primary",
          style: {
            minWidth: "180px",
            height: "48px",
            marginBottom: "8px"
          }
        },
        children: {
          previousButtonLabel: getLabel({
            labelName: "Submit",
            labelKey: "EC_POPUP_SM_RECEIVE_SUBMIT"
          })
        },
        onClickDefination: {
          action: "condition",
          callBack: callBackForwardAddToStore
        }
      }
    }
  }
});


export const adhocPopupReceivePayment = getCommonContainer({
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
              labelName: "Receive Payment",
              labelKey: "EC_SM_RECEIVE_PAYMENT_POPUP_HEADER"
            },
            {
              style: {
                fontSize: "20px"
              }
            }
          )
        }
      },
      // div2: {
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
      //         callBack: (state, dispatch) => {
      //           showHideAdhocPopupReceivePayment(state, dispatch, "search-preview")
      //           // set(state,
      //           //   "screenConfiguration.preparedFinalObject.documentsUploadRedux[0]",
      //           //   ""
      //           // )
      //         }
      //       }
      //     }
      //   }
      // }
    }
  },

  receivePaymentCard: getCommonContainer(
    {

      receivePaymentContainer: getCommonContainer({
        receivePaymentDateField: getTextField({
          label: {
            labelName: "Enter Date",
            labelKey: "EC_POPUP_SM_RECEIVE_PAYMENT_DATE_LABEL"
          },
          placeholder: {
            labelName: "Enter Date",
            labelKey: "EC_POPUP_SM_RECEIVE_PAYMENT_DATE_PLACEHOLDER"
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
          jsonPath: "eChallanReceivePayament[0].date",
          required: true,
          //pattern: /^[ A-Za-z0-9_@./#&+-]{1,250}$/i,
        }),
        receivePaymentModeField: getSelectField({
          label: {
            labelName: "Payment Mode",
            labelKey: "EC_POPUP_SM_RECEIVE_PAYMENT_MODE_LABEL"
          },
          placeholder: {
            labelName: "Select Payment Mode",
            labelKey: "EC_POPUP_SM_RECEIVE_PAYMENT_MODE_PLACEHOLDER"
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
          sourceJsonPath: "applyScreenMdmsData.egec.paymentType",
          jsonPath: "eChallanReceivePayament[0].paymentMode",
          required: true,
          //pattern: /^[ A-Za-z0-9_@./#&+-]{1,250}$/i,
        }),
        receivePaymentAmountField: getTextField({
          label: {
            labelName: "Amount",
            labelKey: "EC_POPUP_SM_RECEIVE_AMOUNT_LABEL"
          },
          placeholder: {
            labelName: "Receive Amount",
            labelKey: "EC_POPUP_SM_RECEIVE_AMOUNT_PLACEHOLDER"
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
          jsonPath: "eChallanReceivePayament[0].receiveamount",
          required: true,
          pattern: getPattern('Amount')
          //pattern: /^[ A-Za-z0-9_@./#&+-]{1,250}$/i,
        }),
        receivePaymentRemarkField: getTextField({
          label: {
            labelName: "Enter Remarks",
            labelKey: "EC_POPUP_SM_RECEIVE_REMARK_LABEL"
          },
          placeholder: {
            labelName: "Enter Remarks",
            labelKey: "EC_POPUP_SM_RECEIVE_REMARK_PLACEHOLDER"
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
          jsonPath: "eChallanReceivePayament[0].Remark",
          required: false,
          pattern: /^[ A-Za-z0-9_@./#&+-]{1,250}$/i,
          visible: false
        }),
        //  documentDetails
      }),
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
        // textAlign: "right"
      }
    },
    children: {
      cancelButton: {
        componentPath: "Button",
        props: {
          variant: "outlined",
          color: "primary",
          style: {
            minWidth: "180px",
            height: "48px",
            marginRight: "16px",
            marginBottom: "8px"
          }
        },
        children: {
          previousButtonLabel: getLabel({
            labelName: "CANCEL",
            labelKey: "EC_POPUP_SM_RECEIVE_CANCEL"
          })
        },
        onClickDefination: {
          action: "condition",
          callBack: (state, dispatch) => {
            showHideAdhocPopupReceivePayment(state, dispatch, "search-preview");
            set(state, 'form', {});
            resetField(state, dispatch);
            //  const objectJsonPath = `components.receivePayment.children.popup`;


            // set(state,
            //   "screenConfiguration.preparedFinalObject.documentsUploadRedux[0]",
            //   ""
            // )
          }
        }
      },
      addButton: {
        componentPath: "Button",
        props: {
          variant: "contained",
          color: "primary",
          style: {
            minWidth: "180px",
            height: "48px",
            marginBottom: "8px"
          }
        },
        children: {
          previousButtonLabel: getLabel({
            labelName: "SUBMIT",
            labelKey: "EC_POPUP_SM_RECEIVE_SUBMIT"
          })
        },
        onClickDefination: {
          action: "condition",
          callBack: receivePaymentUpdateStatus
        }
      }
    }
  }
});

export const ItemMasterDeletionPopup = getCommonContainer({
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
              labelName: "Item Master",
              labelKey: "EC_ITEM_MASTER_HEADER"
            },
            {
              style: {
                fontSize: "16px"
              }
            }
          )
        }
      },      
    }
  },
  subheader: {
    uiFramework: "custom-atoms",
    componentPath: "Container",
    props: {
      style: {
        width: "100%",
        float: "right"
      }
    },
    children: {
      div2: {
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
          div: getCommonSubHeader(
            {
              labelName: "Are you sure you want to delete Record?",
              labelKey: "EC_DELETE_ITEM_MASTER_POPUP_CONFIRMATION_MESSAGE"
            },
            {
              style: {
                fontSize: "16px",
                marginTop:"20px",
                marginBottom:"20px",
                wordbreak:"break-word !important"
              }
            }
          )
        }
      },

    }
  },
  div: {
    uiFramework: "custom-atoms",
    componentPath: "Div",
    props: {
      style: {
        width: "100%",
        // textAlign: "right"
      }
    },
    children: {
      cancelButton: {
        componentPath: "Button",
        props: {
          variant: "outlined",
          color: "primary",
          style: {
            minWidth: "180px",
            height: "48px",
            marginRight: "16px",
            marginBottom: "8px",
          }
        },
        children: {
          previousButtonLabel: getLabel({
            labelName: "CANCEL",
            labelKey: "EC_DELETE_ITEM_MASTER_POPUP_BUTTON_CANCEL"
          })
        },
        onClickDefination: {
          action: "condition",
          callBack: (state, dispatch) => {
            showHideDeleteConfirmation(state, dispatch, "search")
          }
        }
      },
      addButton: {
        componentPath: "Button",
        props: {
          variant: "contained",
          color: "primary",
          style: {
            minWidth: "180px",
            height: "48px",
            marginBottom: "8px",
          }
        },
        children: {
          previousButtonLabel: getLabel({
            labelName: "Yes",
            labelKey: "EC_DELETE_ITEM_MASTER_POPUP_BUTTON_YES"
          })
        },
        onClickDefination: {
          action: "condition",
          callBack: ItemMasterDeleteRowClick
        }
      }
    }
  }
});

export const challanDeletionPopup = getCommonContainer({
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
              labelName: "Manage Challan",
              labelKey: "EC_MANAGE_CHALLAN"
            },
            {
              style: {
                fontSize: "16px"
              }
            }
          )
        }
      },      
    }
  },
  subheader: {
    uiFramework: "custom-atoms",
    componentPath: "Container",
    props: {
      style: {
        width: "100%",
        float: "right"
      }
    },
    children: {
      div2: {
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
          div: getCommonSubHeader(
            {
              labelName: "Are you sure you want to Return & Close the Challan?",
              labelKey: "EC_CHALLAN_RETURN_CLOSE_POPUP_CONFIRMATION_MESSAGE"
            },
            {
              style: {
                fontSize: "16px",
                marginTop:"20px",
                marginBottom:"20px",
              }
            }
          )
        }
      },

    }
  },
  div: {
    uiFramework: "custom-atoms",
    componentPath: "Div",
    props: {
      style: {
        width: "100%",
        // textAlign: "right"
      }
    },
    children: {
      cancelButton: {
        componentPath: "Button",
        props: {
          variant: "outlined",
          color: "primary",
          style: {
            minWidth: "180px",
            height: "48px",
            marginRight: "16px",
            marginBottom: "8px",
          }
        },
        children: {
          previousButtonLabel: getLabel({
            labelName: "CANCEL",
            labelKey: "EC_CHALLAN_POPUP_BUTTON_CANCEL"
          })
        },
        onClickDefination: {
          action: "condition",
          callBack: (state, dispatch) => {
            showHideChallanConfirmation(state, dispatch, "search-preview")
          }
        }
      },
      addButton: {
        componentPath: "Button",
        props: {
          variant: "contained",
          color: "primary",
          style: {
            minWidth: "180px",
            height: "48px",
            marginBottom: "8px",
          }
        },
        children: {
          previousButtonLabel: getLabel({
            labelName: "Yes",
            labelKey: "EC_CHALLAN_POPUP_BUTTON_YES"
          })
        },
        onClickDefination: {
          action: "condition",
          callBack: challanCloseOnGround
        }
      }
    }
  }
});

export const returnAndCloseConfirmationPopup = getCommonContainer({
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
              labelName: "Manage Challan",
              labelKey: "EC_MANAGE_CHALLAN"
            },
            {
              style: {
                fontSize: "16px"
              }
            }
          )
        }
      },      
    }
  },
  subheader: {
    uiFramework: "custom-atoms",
    componentPath: "Container",
    props: {
      style: {
        width: "100%",
        float: "right"
      }
    },
    children: {
      div2: {
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
          div: getCommonSubHeader(
            {
              labelName: "Are you sure you want to Return & Close the Challan?",
              labelKey: "EC_CHALLAN_RETURN_CLOSE_POPUP_CONFIRMATION_MESSAGE"
            },
            {
              style: {
                fontSize: "16px",
                marginTop:"20px",
                marginBottom:"20px",
              }
            }
          )
        }
      },

    }
  },
  div: {
    uiFramework: "custom-atoms",
    componentPath: "Div",
    props: {
      style: {
        width: "100%",
        // textAlign: "right"
      }
    },
    children: {
      cancelButton: {
        componentPath: "Button",
        props: {
          variant: "outlined",
          color: "primary",
          style: {
            minWidth: "180px",
            height: "48px",
            marginRight: "16px",
            marginBottom: "8px",
          }
        },
        children: {
          previousButtonLabel: getLabel({
            labelName: "CANCEL",
            labelKey: "EC_CHALLAN_POPUP_BUTTON_CANCEL"
          })
        },
        onClickDefination: {
          action: "condition",
          callBack: (state, dispatch) => {
            showHideChallanReturnAndCloseConfirmation(state, dispatch, "search-preview")
          }
        }
      },
      addButton: {
        componentPath: "Button",
        props: {
          variant: "contained",
          color: "primary",
          style: {
            minWidth: "180px",
            height: "48px",
            marginBottom: "8px",
          }
        },
        children: {
          previousButtonLabel: getLabel({
            labelName: "Yes",
            labelKey: "EC_CHALLAN_POPUP_BUTTON_YES"
          })
        },
        onClickDefination: {
          action: "condition",
          callBack: returnandClosePayment
        }
      }
    }
  }
});

