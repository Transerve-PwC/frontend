import {
  getCommonHeader, getTextField, getSelectField, getCommonContainer, getCommonSubHeader, getLabel, getPattern
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { showHideAdhocPopupopmsForward, showHideAdhocPopup, getBill, showHideAdhocPopupopmsReject, showHideAdhocPopupopmsReassign, showHideAdhocPopupopmsApprove } from "../../utils";
import get from "lodash/get";
import { toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import set from "lodash/set";
import { UpdateStatus, getWFStatus } from "../../../../../ui-utils/commons";
import { documentDetails } from "./documentDetails";
import { getAccessToken, getOPMSTenantId, getLocale, getUserInfo, getapplicationNumber } from "egov-ui-kit/utils/localStorageUtils";
import store from "redux/store";
import {
  localStorageGet, localStorageSet
} from "egov-ui-kit/utils/localStorageUtils";
import { toggleSpinner } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { prepareFinalObject, handleScreenConfigurationFieldChange as handleField } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import './index.css'
import { callPGService } from "./footer";
import { getOPMSPattern, checkForRole } from '../../utils/index';

//let role_name = JSON.parse(getUserInfo()).roles[0].code
import { validateFields } from "../../utils";

let roles = JSON.parse(getUserInfo()).roles

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
    //  //alert('Fill all fields1')
    isFormValid = false;
    hasFieldToaster = true;
  }
  else {
    // //alert('Submit1')

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
const updateAdhoc1 = (state, dispatch) => {

  let isFormValid = validateFields(
    "components.adhocDialog.children.popup.children.adhocRebateCard.children.rebateAmountAndReasonContainer.children",
    state,
    dispatch,
    "search-preview"
  );

  let file = get(
    state.screenConfiguration.preparedFinalObject,
    "documentsUploadRedux[0].documents[0].fileStoreId"
  )
  if (isFormValid) {
    dispatch(toggleSpinner());

    // let res=moveToReview(state, dispatch);

    const badgeNumber = get(
      state.screenConfiguration.preparedFinalObject,
      "PetNoc[0].PetNocDetails.additionalDetail.badgeNumber"
    );
    const remarks = get(
      state.screenConfiguration.preparedFinalObject,
      "PetNoc[0].PetNocDetails.additionalDetail.remarks"
    );
    const file = get(
      state.screenConfiguration.preparedFinalObject,
      "documentsUploadRedux[0].documents[0].fileStoreId"
    );

    let data = {}
    if (file) {
      data = {
        "uploadDocuments": [{
          "fileStoreId": get(
            state.screenConfiguration.preparedFinalObject,
            "documentsUploadRedux[0].documents[0].fileStoreId"
          )
        }],
        "remarks": remarks,
        "badgeNumber": badgeNumber
      }
    }
    else {
      data = {
        "uploadDocuments": [{
          "fileStoreId": ""
        }],
        "remarks": remarks,
        "badgeNumber": badgeNumber
      }
    }
    let wfstatuslist = get(state, "screenConfiguration.preparedFinalObject.WFStatus", [])
    let wfstatus = "";
    wfstatus = wfstatuslist.find(item => {
      return item.buttonName == "nextButton";
    });
    //alert(wfstatus.status)

    UpdateStatus(state, dispatch, '/egov-opms/search', [],
      {
        "applicationType": "PETNOC",
        "tenantId": getOPMSTenantId(),
        "applicationStatus": wfstatus.status,//"FORWARD",
        "applicationId": localStorage.getItem('ApplicationNumber'),
        "dataPayload": data
      }
    );
  }

  else {
    let errorMessage = {
      labelName:
        "Please fill all mandatory fields, then proceed!",
      labelKey: "ERR_FILL_ALL_MANDATORY_FIELDS_TOAST"
    };
    dispatch(toggleSnackbar(true, errorMessage, "warning"));
  }

};

const updateAdhocReaasign = (state, dispatch) => {

  let isFormValid = validateFields(
    "components.adhocDialog2.children.popup.children.adhocRebateCard.children.rebateReaassignContainer.children",
    state,
    dispatch,
    "search-preview"
  );
  let file = get(
    state.screenConfiguration.preparedFinalObject,
    "documentsUploadRedux[0].documents[0].fileStoreId"
  )
  if (isFormValid) {
    dispatch(toggleSpinner());
    const remarks = get(
      state.screenConfiguration.preparedFinalObject,
      "PetNoc[0].PetNocDetails.Reaasign.remarks"
    );

    let data = {}
    if (file) {
      data = {
        "uploadDocuments": [{
          "fileStoreId": get(
            state.screenConfiguration.preparedFinalObject,
            "documentsUploadRedux[0].documents[0].fileStoreId"
          )
        }],
        "remarks": remarks,
      }
    }
    else {
      data = {
        "uploadDocuments": [{
          "fileStoreId": ""
        }],
        "remarks": remarks,
      }
    }
    let wfstatuslist = get(state, "screenConfiguration.preparedFinalObject.WFStatus", [])
    let wfstatus = "";
    wfstatus = wfstatuslist.find(item => {
      return item.buttonName == "reassign";
    });
    //alert(wfstatus.status)



    UpdateStatus(state, dispatch, '/egov-opms/search', [],

      {

        "applicationType": "PETNOC",
        "tenantId": getOPMSTenantId(),
        "applicationStatus": wfstatus.status,//checkForRole(roles, 'SI') ? "REASSIGN" : checkForRole(roles, 'MOH') ? "REASSIGNTOSI" : '',
        "applicationId": localStorage.getItem('ApplicationNumber'),
        "dataPayload": data
      }
    );

  }
  else {
    let errorMessage = {
      labelName:
        "Please fill all mandatory fields, then proceed!",
      labelKey: "ERR_FILL_ALL_MANDATORY_FIELDS_TOAST"
    };
    dispatch(toggleSnackbar(true, errorMessage, "warning"));
  }
};
const updateAdhocReject = (state, dispatch) => {
  //screenConfiguration.screenConfig["search-preview"].
  let isFormValid = validateFields(
    "components.adhocDialog3.children.popup.children.adhocRebateCard.children.rebateRejectContainer.children",
    state,
    dispatch,
    "search-preview"
  );
  let file = get(
    state.screenConfiguration.preparedFinalObject,
    "documentsUploadRedux[0].documents[0].fileStoreId"
  )
  if (isFormValid) {
    dispatch(toggleSpinner());
    const remarks = get(
      state.screenConfiguration.preparedFinalObject,
      "PetNoc[0].PetNocDetails.Reject.remarks"
    );

    let data = {}
    if (file) {
      data = {
        "uploadDocuments": [{
          "fileStoreId": get(
            state.screenConfiguration.preparedFinalObject,
            "documentsUploadRedux[0].documents[0].fileStoreId"
          )
        }],
        "remarks": remarks,
      }
    }
    else {
      data = {
        "uploadDocuments": [{
          "fileStoreId": ""
        }],
        "remarks": remarks,
      }
    }
    let wfstatuslist = get(state, "screenConfiguration.preparedFinalObject.WFStatus", [])
    let wfstatus = "";
    wfstatus = wfstatuslist.find(item => {
      return item.buttonName == "reject";
    });
    //alert(wfstatus.status)


    UpdateStatus(state, dispatch, '/egov-opms/search', [],

      {
        "applicationType": "PETNOC",
        "tenantId": getOPMSTenantId(),
        "applicationStatus": wfstatus.status,//"REJECTED",
        "applicationId": localStorage.getItem('ApplicationNumber'),
        "dataPayload": data
      }
    );
  }
  else {
    let errorMessage = {
      labelName:
        "Please fill all mandatory fields, then proceed!",
      labelKey: "ERR_FILL_ALL_MANDATORY_FIELDS_TOAST"
    };
    dispatch(toggleSnackbar(true, errorMessage, "warning"));
  }

};
const updateAdhocApprove = (state, dispatch) => {
  // screenConfiguration.screenConfig["search-preview"].
  let isFormValid = validateFields(
    "components.adhocDialog1.children.popup.children.adhocRebateCard.children.rebateApproveContainer.children",
    state,
    dispatch,
    "search-preview"
  );
  if (isFormValid) {
    dispatch(toggleSpinner());
    const remarks = get(
      state.screenConfiguration.preparedFinalObject,
      "PetNoc[0].PetNocDetails.Approve.remarks"

    );
    let wfstatuslist = get(state, "screenConfiguration.preparedFinalObject.WFStatus", [])
    let wfstatus = "";
    wfstatus = wfstatuslist.find(item => {
      return item.buttonName == "approve";
    });
    //alert(wfstatus.status)

    UpdateStatus(state, dispatch, '/egov-opms/search', [],

      {

        "applicationType": "PETNOC",
        "tenantId": getOPMSTenantId(),
        "applicationStatus": wfstatus.status,//"APPROVED",
        "applicationId": localStorage.getItem('ApplicationNumber'),
        "dataPayload": {
          "remarks": remarks,
          "badgeNumber": get(
            state.screenConfiguration.preparedFinalObject,
            "PetNoc[0].PetNocDetails.Approve.badgeNumber"

          )

        }
      }
    );
  }
  else {
    let errorMessage = {
      labelName:
        "Please fill all mandatory fields, then proceed!",
      labelKey: "ERR_FILL_ALL_MANDATORY_FIELDS_TOAST"
    };
    dispatch(toggleSnackbar(true, errorMessage, "warning"));
  }
};



//Advertisement
const updateAdhocAdvForward = (state, dispatch) => {

  let isFormValid = validateFields(
    "components.adhocDialogForward.children.popup.children.adhocPopupAdvertisementForwardRemarkCard.children.advertisementForwardRemarkContainer.children",
    state,
    dispatch,
    "advertisementnoc-search-preview"
  );


  let file = get(
    state.screenConfiguration.preparedFinalObject,
    "documentsUploadRedux[0].documents[0].fileStoreId"
  )
  if (isFormValid) {
    dispatch(toggleSpinner());
    const remarks = get(
      state.screenConfiguration.preparedFinalObject,
      "advertisement[0].Forward.Remark");
    let data = {}
    if (file) {
      data = {
        "uploadDocuments": [{
          "fileStoreId": get(
            state.screenConfiguration.preparedFinalObject,
            "documentsUploadRedux[0].documents[0].fileStoreId"
          )
        }],
        "remarks": remarks
      }
    }
    else {
      data = {
        "uploadDocuments": [{
          "fileStoreId": ""
        }],
        "remarks": remarks

      }
    }
    let wfstatuslist = get(state, "screenConfiguration.preparedFinalObject.WFStatus", [])
    //    //alert(JSON.stringify(wfstatus))
    let wfstatus = {};
    if (get(state, "screenConfiguration.preparedFinalObject.OPMS.AdvertisementNOC.typeOfCommissioner")) {
      wfstatus.status = get(state, "screenConfiguration.preparedFinalObject.OPMS.AdvertisementNOC.typeOfCommissioner")
    } else {
      wfstatus = wfstatuslist.find(item => {
        return item.buttonName == "nextButton";
      });
    }

    //alert(wfstatus.status)
    UpdateStatus(state, dispatch, '/egov-opms/advertisement-search', [],
      {
        "applicationType": "ADVERTISEMENTNOC",
        "tenantId": getOPMSTenantId(),
        "applicationStatus": wfstatus.status,
        //checkForRole(roles, 'JEX') ? "REVIEWOFSUPERINTENDENT" : checkForRole(roles, 'SUPERINTENDENT') ? "REVIEWOFOSD" : checkForRole(roles, 'OSD') ? "PENDINGAPPROVAL" : '',

        "applicationId": localStorage.getItem('ApplicationNumber'),
        "dataPayload": data
      }
    );
  }
  else {
    let errorMessage = {
      labelName:
        "Please fill all mandatory fields, then proceed!",
      labelKey: "ERR_FILL_ALL_MANDATORY_FIELDS_TOAST"
    };
    dispatch(toggleSnackbar(true, errorMessage, "warning"));
  }
};

const updateAdhocAdvApprove = (state, dispatch) => {
  let isFormValid = validateFields(
    "components.adhocDialog1.children.popup.children.adhocPopupAdvertisementCommissionerApproveRemarkCard.children.advertisementCommissionerApproveRemarkContainer.children",
    state,
    dispatch,
    "advertisementnoc-search-preview"
  );

  if (isFormValid) {
    dispatch(toggleSpinner());
    let wfstatuslist = get(state, "screenConfiguration.preparedFinalObject.WFStatus", [])
    let wfstatus = "";
    wfstatus = wfstatuslist.find(item => {
      return item.buttonName == "approve";
    });
    //alert(wfstatus.status)

    const remarks = get(
      state.screenConfiguration.preparedFinalObject,
      "advertisement[0].Approve.Remark");
    UpdateStatus(state, dispatch, '/egov-opms/advertisement-search', [],

      {
        "applicationType": "ADVERTISEMENTNOC",
        "tenantId": getOPMSTenantId(),
        "applicationStatus": wfstatus.status,
        //localStorageGet('pms_iswithdrawn') === "yes" ? 'APPROVEFORWITHDRAW' : 'APPROVED',
        "applicationId": localStorage.getItem('ApplicationNumber'),
        "dataPayload": {
          "remarks": remarks,
        }
      }
    );
  }
  else {
    let errorMessage = {
      labelName:
        "Please fill all mandatory fields, then proceed!",
      labelKey: "ERR_FILL_ALL_MANDATORY_FIELDS_TOAST"
    };
    dispatch(toggleSnackbar(true, errorMessage, "warning"));
  }
};
const updateAdhocAdvReject = (state, dispatch) => {
  let isFormValid = validateFields(
    "components.adhocDialog3.children.popup.children.adhocPopupAdvertisementCommissionerRejectRemarkCard.children.advertisementCommissionerRejectRemarkContainer.children",
    state,
    dispatch,
    "advertisementnoc-search-preview"
  );

  let file = get(
    state.screenConfiguration.preparedFinalObject,
    "documentsUploadRedux[0].documents[0].fileStoreId"
  )
  if (isFormValid) {
    dispatch(toggleSpinner());
    const remarks = get(
      state.screenConfiguration.preparedFinalObject,
      "advertisement[0].Reject.Remark");
    let data = {}
    if (file) {
      data = {
        "uploadDocuments": [{
          "fileStoreId": get(
            state.screenConfiguration.preparedFinalObject,
            "documentsUploadRedux[0].documents[0].fileStoreId"
          )
        }],
        "remarks": remarks
      }
    }
    else {
      data = {
        "uploadDocuments": [{
          "fileStoreId": ""
        }],
        "remarks": remarks
      }
    }
    let wfstatuslist = get(state, "screenConfiguration.preparedFinalObject.WFStatus", [])
    let wfstatus = "";
    wfstatus = wfstatuslist.find(item => {
      return item.buttonName == "reject";
    });
    //alert(wfstatus.status)

    UpdateStatus(state, dispatch, '/egov-opms/advertisement-search', [],

      {
        "applicationType": "ADVERTISEMENTNOC",
        "tenantId": getOPMSTenantId(),
        "applicationStatus": wfstatus.status,
        //localStorageGet('pms_iswithdrawn') === "yes" ? 'REJECTEFORWITHDRAW' : 'REJECTED',
        "applicationId": localStorage.getItem('ApplicationNumber'),
        "dataPayload": data
      }
    );
  }
  else {
    let errorMessage = {
      labelName:
        "Please fill all mandatory fields, then proceed!",
      labelKey: "ERR_FILL_ALL_MANDATORY_FIELDS_TOAST"
    };
    dispatch(toggleSnackbar(true, errorMessage, "warning"));
  }

};
const updateAdhocAdvReassign = (state, dispatch) => {
  let isFormValid = validateFields(
    "components.adhocDialog2.children.popup.children.adhocPopupAdvertisementJEXReassignRemarkCard.children.advertisementJEXReassignRemarkContainer.children",
    state,
    dispatch,
    "advertisementnoc-search-preview"
  );

  const remarks = get(
    state.screenConfiguration.preparedFinalObject,
    "advertisement[0].Reassign.Remark");

  let file = get(
    state.screenConfiguration.preparedFinalObject,
    "documentsUploadRedux[0].documents[0].fileStoreId"
  )
  let data = {}

  if (file) {
    data = {
      "uploadDocuments": [{
        "fileStoreId": get(
          state.screenConfiguration.preparedFinalObject,
          "documentsUploadRedux[0].documents[0].fileStoreId"
        )
      }],
      "remarks": remarks
    }
  }
  else {
    data = {
      "uploadDocuments": [{
        "fileStoreId": ""
      }],

      "remarks": remarks

    }
  }
  if (isFormValid) {
    dispatch(toggleSpinner());
    let wfstatuslist = get(state, "screenConfiguration.preparedFinalObject.WFStatus", [])
    let wfstatus = "";
    wfstatus = wfstatuslist.find(item => {
      return item.buttonName == "reassign";
    });
    //alert(wfstatus.status)

    UpdateStatus(state, dispatch, '/egov-opms/advertisement-search', [],
      {
        "applicationType": "ADVERTISEMENTNOC",
        "tenantId": getOPMSTenantId(),
        "applicationStatus": wfstatus.status,
        //  checkForRole(roles, 'JEX') ? "REASSIGN" : checkForRole(roles, 'SUPERINTENDENT') ? "REASSIGNTOJEX" : checkForRole(roles, 'OSD') ? "REASSIGNTOSUPERINTENDENT" : checkForRole(roles, 'COMMISSIONER') ? "REASSIGNTOOSD" : '',
        "applicationId": localStorage.getItem('ApplicationNumber'),
        "dataPayload": data
      }
    );
  }
  else {
    let errorMessage = {
      labelName:
        "Please fill all mandatory fields, then proceed!",
      labelKey: "ERR_FILL_ALL_MANDATORY_FIELDS_TOAST"
    };
    dispatch(toggleSnackbar(true, errorMessage, "warning"));
  }
};




const updateAdhocAdvWithdrawApp = (state, dispatch) => {
  let isValidAmout = validateFields(
    "components.adhocDialog.children.popup.children.adhocPopupAdvertisementOSDWithdraApprovalAmountCard.children.advertisementOSDWithdraApprovalAmountContainer.children",
    state,
    dispatch,
    "advertisementnoc-search-preview"
  );

  let isValidRemarks = validateFields(
    "components.adhocDialog.children.popup.children.adhocPopupAdvertisementCommissionerWithdrawApproveRemarkCard.children.advertisementCommissionerWithdrawApproveRemarkContainer.children",
    state,
    dispatch,
    "advertisementnoc-search-preview"
  );
  let isFormValid = isValidAmout & isValidRemarks

  let file = get(
    state.screenConfiguration.preparedFinalObject,
    "documentsUploadRedux[0].documents[0].fileStoreId"
  )

  if (isFormValid) {
    dispatch(toggleSpinner());
    const nocApplicationDetail = get(
      state.screenConfiguration.preparedFinalObject,
      "nocApplicationDetail");

    
    const Amount = get(
      state.screenConfiguration.preparedFinalObject,
      "advertisement[0].WithdraApproval.Amount");

    const Tax = get(
        state.screenConfiguration.preparedFinalObject,
        "advertisement[0].WithdraApproval.Tax");
  
    const Remark = get(
      state.screenConfiguration.preparedFinalObject,
      "advertisement[0].WithdraApproval.Remark");

    const BillAmount = nocApplicationDetail[0].amount;
    const TaxAmount = nocApplicationDetail[0].gstamount;

    let data = {}
    if (file) {
      data = {
        "uploadDocuments": [{
          "fileStoreId": get(
            state.screenConfiguration.preparedFinalObject,
            "documentsUploadRedux[0].documents[0].fileStoreId"
          )
        }],
        "remarks": Remark,
        "withdrawapprovalamount": Amount,
        "withdrawapprovaltaxamount":Tax
      }
    }
    else {
      data = {
        "uploadDocuments": [{
          "fileStoreId": ""
        }],
        "remarks": Remark,
        "withdrawapprovalamount": Amount,
        "withdrawapprovaltaxamount":Tax
      }
    }


    if (BillAmount != undefined && BillAmount != null && Number(Amount) < Number(BillAmount)) {
      if (TaxAmount != undefined && TaxAmount != null && Number(Tax) < Number(TaxAmount)) {
        let wfstatuslist = get(state, "screenConfiguration.preparedFinalObject.WFStatus", [])
        //    //alert(JSON.stringify(wfstatus))
        let wfstatus = {};
        if (get(state, "screenConfiguration.preparedFinalObject.OPMS.AdvertisementNOC.typeOfCommissioner")) {
          wfstatus.status = get(state, "screenConfiguration.preparedFinalObject.OPMS.AdvertisementNOC.typeOfCommissioner")
        } else {
          wfstatus = wfstatuslist.find(item => {
            return item.buttonName == "withdrawapprove";
          });
        }

        //alert(wfstatus.status)
        UpdateStatus(state, dispatch, '/egov-opms/advertisement-search', [],
          {
            "applicationType": "ADVERTISEMENTNOC",
            "tenantId": getOPMSTenantId(),
            "applicationStatus": wfstatus.status,
            "applicationId": localStorage.getItem('ApplicationNumber'),
            "dataPayload": data
          }
        );
      }else {
        dispatch(toggleSpinner());
        store.dispatch(
          toggleSnackbar(
            true,
            { labelName: "Withdraw tax amount should be less than actual tax amount", labelCode: "ADV_WITHDRAWAPP_TAX_INVALID_AMOUNT" },
            "error"
          )
        );
      }
    } else {
      dispatch(toggleSpinner());
      store.dispatch(
        toggleSnackbar(
          true,
          { labelName: "Withdraw amount should be less than actual amount", labelCode: "ADV_WITHDRAWAPP_INVALID_AMOUNT" },
          "error"
        )
      );

    }
  }
  else {
    let errorMessage = {
      labelName:
        "Please fill all mandatory fields, then proceed!",
      labelKey: "ERR_FILL_ALL_MANDATORY_FIELDS_TOAST"
    };
    dispatch(toggleSnackbar(true, errorMessage, "warning"));
  }

};

//ADV

const updateAdhocAdvWithdraw = (state, dispatch) => {

  let isFormValid = validateFields(
    "components.adhocDialog.children.popup.children.adhocPopupAdvertisementWithdrawRemarkCard.children.advertisementWithdrawRemarkContainer.children",
    state,
    dispatch,
    "advertisementnoc-search-preview"
  );
  if (isFormValid) {
    dispatch(toggleSpinner());
    const Remark = get(
      state.screenConfiguration.preparedFinalObject,
      "advertisement[0].withdraw.Remark");


    UpdateStatus(state, dispatch, '/egov-opms/advertisementnoc-my-applications', [],

      {
        "applicationType": "ADVERTISEMENTNOC",
        "tenantId": getOPMSTenantId(),
        "applicationStatus": localStorage.getItem('footerApplicationStatus') == 'APPROVED' ? 'WITHDRAWAFTERAPRROVAL' : 'WITHDRAW',
        "applicationId": localStorage.getItem('ApplicationNumber'),
        "dataPayload": {
          "remarks": Remark
        }
      }
    );
    localStorage.setItem('footerApplicationStatus', '');
  }
  else {
    let errorMessage = {
      labelName:
        "Please fill all mandatory fields, then proceed!",
      labelKey: "ERR_FILL_ALL_MANDATORY_FIELDS_TOAST"
    };
    dispatch(toggleSnackbar(true, errorMessage, "warning"));
  }
}



//sellmeat
const updateAdhocSellMeatForward = (state, dispatch) => {
  let isFormValid = validateFields(
    "components.adhocDialogForward.children.popup.children.SellMeatForwardCard.children.SellMeatForwardContainer.children",
    state,
    dispatch,
    "sellmeatnoc-search-preview"
  );
  let file = get(
    state.screenConfiguration.preparedFinalObject,
    "documentsUploadRedux[0].documents[0].fileStoreId"
  )
  if (isFormValid) {
    dispatch(toggleSpinner());
    const remarks = get(
      state.screenConfiguration.preparedFinalObject,
      "SellMeat[0].SellMeatDetails.Forward.remarks"
    );

    let data = {}
    if (file) {
      data = {
        "uploadDocuments": [{
          "fileStoreId": get(
            state.screenConfiguration.preparedFinalObject,
            "documentsUploadRedux[0].documents[0].fileStoreId"
          )
        }],
        "remarks": remarks
      }
    }
    else {
      data = {
        "uploadDocuments": [{
          "fileStoreId": ""
        }],
        "remarks": remarks
      }
    }
    let wfstatuslist = get(state, "screenConfiguration.preparedFinalObject.WFStatus", [])
    //    //alert(JSON.stringify(wfstatus))
    let wfstatus = wfstatuslist.find(item => {
      return item.buttonName == "nextButton";
    });
    //alert(wfstatus.status)

    UpdateStatus(state, dispatch, '/egov-opms/sellmeat-search', [],

      {
        "applicationType": "SELLMEATNOC",
        "tenantId": getOPMSTenantId(),
        "applicationStatus": wfstatus.status,//checkForRole(roles, 'SI') ? "REVIEWOFSUPERINTENDENT" : checkForRole(roles, 'SUPERINTENDENT') ? "PENDINGAPPROVAL" : '',

        "applicationId": localStorage.getItem('ApplicationNumber'),
        "dataPayload": data
      }
    );

  }
  else {
    let errorMessage = {
      labelName:
        "Please fill all mandatory fields, then proceed!",
      labelKey: "ERR_FILL_ALL_MANDATORY_FIELDS_TOAST"
    };
    dispatch(toggleSnackbar(true, errorMessage, "warning"));
  }
};
const updateAdhocSellMeatApprove = (state, dispatch) => {
  let isFormValid = validateFields(
    "components.adhocDialog1.children.popup.children.SellMeatApproveCard.children.SellMeatApproveContainer.children",
    state,
    dispatch,
    "sellmeatnoc-search-preview"
  );


  if (isFormValid) {
    dispatch(toggleSpinner());
    const remarks = get(
      state.screenConfiguration.preparedFinalObject,
      "SellMeat[0].SellMeatDetails.Approve.remarks"
    );
    let wfstatuslist = get(state, "screenConfiguration.preparedFinalObject.WFStatus", [])
    //    //alert(JSON.stringify(wfstatus))
    let wfstatus = wfstatuslist.find(item => {
      return item.buttonName == "approve";
    });
    //alert(wfstatus.status)

    UpdateStatus(state, dispatch, '/egov-opms/sellmeat-search', [],

      {
        "applicationType": "SELLMEATNOC",
        "tenantId": getOPMSTenantId(),
        "applicationStatus": wfstatus.status,//'APPROVED',
        "applicationId": localStorage.getItem('ApplicationNumber'),
        "dataPayload": {
          "remarks": remarks,
        }
      }
    );
  }
  else {
    let errorMessage = {
      labelName:
        "Please fill all mandatory fields, then proceed!",
      labelKey: "ERR_FILL_ALL_MANDATORY_FIELDS_TOAST"
    };
    dispatch(toggleSnackbar(true, errorMessage, "warning"));
  }
};
const updateAdhocSellMeatReject = (state, dispatch) => {
  let isFormValid = validateFields(
    "components.adhocDialog3.children.popup.children.SellMeatRejectCard.children.SellMeatRejectContainer.children",
    state,
    dispatch,
    "sellmeatnoc-search-preview"
  );
  let file = get(
    state.screenConfiguration.preparedFinalObject,
    "documentsUploadRedux[0].documents[0].fileStoreId"
  )
  if (isFormValid) {
    dispatch(toggleSpinner());

    const remarks = get(
      state.screenConfiguration.preparedFinalObject,
      "SellMeat[0].SellMeatDetails.Reject.remarks"
    );
    let data = {}
    if (file) {
      data = {
        "uploadDocuments": [{
          "fileStoreId": get(
            state.screenConfiguration.preparedFinalObject,
            "documentsUploadRedux[0].documents[0].fileStoreId"
          )
        }],
        "remarks": remarks
      }
    }
    else {
      data = {
        "uploadDocuments": [{
          "fileStoreId": ""
        }],
        "remarks": remarks
      }
    }

    let wfstatuslist = get(state, "screenConfiguration.preparedFinalObject.WFStatus", [])
    //    //alert(JSON.stringify(wfstatus))
    let wfstatus = wfstatuslist.find(item => {
      return item.buttonName == "reject";
    });
    //alert(wfstatus.status)

    UpdateStatus(state, dispatch, '/egov-opms/sellmeat-search', [],

      {
        "applicationType": "SELLMEATNOC",
        "tenantId": getOPMSTenantId(),
        "applicationStatus": wfstatus.status,//'REJECTED',
        "applicationId": localStorage.getItem('ApplicationNumber'),
        "dataPayload": data
      }
    );

  }
  else {
    let errorMessage = {
      labelName:
        "Please fill all mandatory fields, then proceed!",
      labelKey: "ERR_FILL_ALL_MANDATORY_FIELDS_TOAST"
    };
    dispatch(toggleSnackbar(true, errorMessage, "warning"));
  }
};
const updateAdhocSellMeatReassign = (state, dispatch) => {
  let isFormValid = validateFields(
    "components.adhocDialog2.children.popup.children.SellMeatReassignCard.children.SellMeatReassignContainer.children",
    state,
    dispatch,
    "sellmeatnoc-search-preview"
  );
  let file = get(
    state.screenConfiguration.preparedFinalObject,
    "documentsUploadRedux[0].documents[0].fileStoreId"
  )
  if (isFormValid) {
    dispatch(toggleSpinner());
    const remarks = get(
      state.screenConfiguration.preparedFinalObject,
      "SellMeat[0].SellMeatDetails.Reassign.remarks"
    );

    let data = {}
    if (file) {
      data = {
        "uploadDocuments": [{
          "fileStoreId": get(
            state.screenConfiguration.preparedFinalObject,
            "documentsUploadRedux[0].documents[0].fileStoreId"
          )
        }],
        "remarks": remarks
      }
    }
    else {
      data = {
        "uploadDocuments": [{
          "fileStoreId": ""
        }],
        "remarks": remarks
      }
    }
    let wfstatuslist = get(state, "screenConfiguration.preparedFinalObject.WFStatus", [])
    //    //alert(JSON.stringify(wfstatus))
    let wfstatus = wfstatuslist.find(item => {
      return item.buttonName == "reassign";
    });
    //alert(wfstatus.status)
    UpdateStatus(state, dispatch, '/egov-opms/sellmeat-search', [],

      {

        "applicationType": "SELLMEATNOC",
        "tenantId": getOPMSTenantId(),
        "applicationStatus": wfstatus.status,//checkForRole(roles, 'SI') ? "REASSIGN" : checkForRole(roles, 'SUPERINTENDENT') ? "REASSIGNTOSI" : checkForRole(roles, 'MOH') ? "REASSIGNTOSUPERINTENDENT" : '',
        "applicationId": localStorage.getItem('ApplicationNumber'),
        "dataPayload": data
      }
    );

  }
  else {
    let errorMessage = {
      labelName:
        "Please fill all mandatory fields, then proceed!",
      labelKey: "ERR_FILL_ALL_MANDATORY_FIELDS_TOAST"
    };
    dispatch(toggleSnackbar(true, errorMessage, "warning"));
  }
};


//RoadCut
const updateAdhocRoadCutForward = (state, dispatch) => {
  let isFormValid = false;
  if (localStorageGet("applicationStatus") == "INITIATED" || localStorageGet("applicationStatus") == "REASSIGNTOJE" || localStorageGet("applicationStatus") == "RESENT") {
    isFormValid = validateFields(
      "components.adhocDialog.children.popup.children.adhocRebateCardRoadCutForward.children.ForwardContainerRoadCutForward.children",
      state,
      dispatch,
      "roadcutnoc-search-preview"
    );
  }
  else {
    isFormValid = validateFields(
      "components.adhocDialogForward.children.popup.children.adhocRebateCardSeRoadCutForward.children.ContainerSeRoadCutForward.children",
      state,
      dispatch,
      "roadcutnoc-search-preview"
    );
  }
  let file = get(
    state.screenConfiguration.preparedFinalObject,
    "documentsUploadRedux[0].documents[0].fileStoreId"
  )
  if (isFormValid) {
    dispatch(toggleSpinner());
    let nocStatus = get(state, "screenConfiguration.preparedFinalObject.nocApplicationDetail[0].applicationstatus", {});

    const remarks = get(
      state.screenConfiguration.preparedFinalObject,
      "OPMS[0].RoadCutUpdateStautsDetails.additionalDetail.FieldRoadCutForwardRemarks"
    );
    const RoadCutForwardAmount = get(
      state.screenConfiguration.preparedFinalObject,
      "OPMS[0].RoadCutUpdateStautsDetails.additionalDetail.RoadCutForwardAmount"
    );
    const RoadCutForwardGstAmount = get(
      state.screenConfiguration.preparedFinalObject,
      "OPMS[0].RoadCutUpdateStautsDetails.additionalDetail.RoadCutForwardGstAmount"
    );
    const RoadCutForwardPerformanceBankGuaranteeCharges = get(
      state.screenConfiguration.preparedFinalObject,
      "OPMS[0].RoadCutUpdateStautsDetails.additionalDetail.RoadCutForwardPerformanceBankGuaranteeCharges"
    );
    let data = {}
    if (RoadCutForwardAmount > 0) {
      if (nocStatus == "INITIATED" || nocStatus == "REASSIGNTOJE" || nocStatus == "RESENT") {
        if (file) {
          data = {
            "uploadDocuments": [{
              "fileStoreId": get(
                state.screenConfiguration.preparedFinalObject,
                "documentsUploadRedux[0].documents[0].fileStoreId"
              )
            }],
            "remarks": remarks,
            "gstAmount": RoadCutForwardGstAmount,
            "amount": RoadCutForwardAmount,
            "performanceBankGuaranteeCharges": RoadCutForwardPerformanceBankGuaranteeCharges
          }
        } else {
          data = {
            "uploadDocuments": [{
              "fileStoreId": ""
            }],
            "remarks": remarks,
            "gstAmount": RoadCutForwardGstAmount,
            "amount": RoadCutForwardAmount,
            "performanceBankGuaranteeCharges": RoadCutForwardPerformanceBankGuaranteeCharges
          }
        }
      }
      else {
        if (file) {
          data = {
            "uploadDocuments": [{
              "fileStoreId": get(
                state.screenConfiguration.preparedFinalObject,
                "documentsUploadRedux[0].documents[0].fileStoreId"
              )
            }],
            "remarks": get(
              state.screenConfiguration.preparedFinalObject,
              "OPMS[0].RoadCutUpdateStautsDetails.additionalDetail.remarks"
            ),
          }
        } else {
          data = {
            "uploadDocuments": [{
              "fileStoreId": ""
            }],
            "remarks": get(
              state.screenConfiguration.preparedFinalObject,
              "OPMS[0].RoadCutUpdateStautsDetails.additionalDetail.remarks"
            ),
          }
        }
      }
      let wfstatuslist = get(state, "screenConfiguration.preparedFinalObject.WFStatus", [])
      //    //alert(JSON.stringify(wfstatus))
      let wfstatus = wfstatuslist.find(item => {
        return item.buttonName == "nextButton";
      });
      //alert(wfstatus.status)

      UpdateStatus(state, dispatch, '/egov-opms/roadcut-search', [],
        {

          "applicationType": "ROADCUTNOC",
          "tenantId": getOPMSTenantId(),
          "applicationStatus": wfstatus.status,
          //checkForRole(roles, 'JE') ? "REVIEWSDO" : checkForRole(roles, 'SDO') ? "REVIEWOFEE" : checkForRole(roles, 'EE') ? "REVIEWOFSE" : checkForRole(roles, 'SE') ? "PENDINGAPRROVAL" : checkForRole(roles, 'CE') ? "PAYMENTPENDING" : '',

          "applicationId": localStorage.getItem('ApplicationNumber'),
          "dataPayload": data
        }
      );

    } else {
      dispatch(toggleSpinner());

      let errorMessage = {
        labelName:
          "Amount Should be Greater Than 0 ",
      };
      dispatch(toggleSnackbar(true, errorMessage, "warning"));
    }
  }
  else {
    let errorMessage = {
      labelName:
        "Please fill all mandatory fields, then proceed!",
      labelKey: "ERR_FILL_ALL_MANDATORY_FIELDS_TOAST"
    };
    dispatch(toggleSnackbar(true, errorMessage, "warning"));
  }
};
const updateAdhocRoadCutApprove = (state, dispatch) => {

  let isFormValid = validateFields(
    "components.adhocDialog1.children.popup.children.adhocRebateCardCeRoadCutApprove.children.ContainerCeRoadCutApprove.children",
    state,
    dispatch,
    "roadcutnoc-search-preview"
  );
  if (isFormValid) {
    dispatch(toggleSpinner());
    const remarks = get(
      state.screenConfiguration.preparedFinalObject,
      "OPMS[0].RoadCutUpdateStautsDetails.additionalDetail.remarks");
    UpdateStatus(state, dispatch, '/egov-opms/roadcut-search', [],

      {

        "applicationType": "ROADCUTNOC",
        "tenantId": getOPMSTenantId(),
        "applicationStatus": 'APPROVED',
        "applicationId": localStorage.getItem('ApplicationNumber'),
        "dataPayload": {
          "remarks": remarks,
        }
      }
    );
  }
  else {
    let errorMessage = {
      labelName:
        "Please fill all mandatory fields, then proceed!",
      labelKey: "ERR_FILL_ALL_MANDATORY_FIELDS_TOAST"
    };
    dispatch(toggleSnackbar(true, errorMessage, "warning"));
  }
};
const updateAdhocRoadCutReject = (state, dispatch) => {
  let isFormValid = validateFields(
    "components.adhocDialog3.children.popup.children.adhocRebateCardCeRoadCutReject.children",
    state,
    dispatch,
    "roadcutnoc-search-preview"
  );



  let file = get(
    state.screenConfiguration.preparedFinalObject,
    "documentsUploadRedux[0].documents[0].fileStoreId"
  )
  if (isFormValid) {
    dispatch(toggleSpinner());
    const remarks = get(
      state.screenConfiguration.preparedFinalObject,
      "OPMS[0].RoadCutUpdateStautsDetails.additionalDetail.remarks");

    let data = {}
    if (file) {
      data = {
        "uploadDocuments": [{
          "fileStoreId": get(
            state.screenConfiguration.preparedFinalObject,
            "documentsUploadRedux[0].documents[0].fileStoreId"
          )
        }],
        "remarks": remarks
      }
    }
    else {
      data = {
        "uploadDocuments": [{
          "fileStoreId": ""
        }],
        "remarks": remarks
      }
    }

    UpdateStatus(state, dispatch, '/egov-opms/roadcut-search', [],
      {
        "applicationType": "ROADCUTNOC",
        "tenantId": getOPMSTenantId(),
        "applicationStatus": 'REJECTED',
        "applicationId": localStorage.getItem('ApplicationNumber'),
        "dataPayload": data
      }
    );

  }
  else {
    let errorMessage = {
      labelName:
        "Please fill all mandatory fields, then proceed!",
      labelKey: "ERR_FILL_ALL_MANDATORY_FIELDS_TOAST"
    };
    dispatch(toggleSnackbar(true, errorMessage, "warning"));
  }
};
const updateAdhocRoadCutReassign = (state, dispatch) => {
  let isFormValid = validateFields(
    "components.adhocDialog2.children.popup.children.adhocRebateCardRoadCutReassign.children.ContainerRoadCutReassign.children",
    state,
    dispatch,
    "roadcutnoc-search-preview"
  );
  let file = get(
    state.screenConfiguration.preparedFinalObject,
    "documentsUploadRedux[0].documents[0].fileStoreId"
  )
  if (isFormValid) {
    dispatch(toggleSpinner());

    const remarks = get(
      state.screenConfiguration.preparedFinalObject,
      "OPMS[0].RoadCutUpdateStautsDetails.additionalDetail.remarks"
    );

    let data = {}
    if (file) {
      data = {
        "uploadDocuments": [{
          "fileStoreId": get(
            state.screenConfiguration.preparedFinalObject,
            "documentsUploadRedux[0].documents[0].fileStoreId"
          )
        }],
        "remarks": remarks
      }
    }
    else {
      data = {
        "uploadDocuments": [{
          "fileStoreId": ""
        }],
        "remarks": remarks
      }
    }
    let wfstatuslist = get(state, "screenConfiguration.preparedFinalObject.WFStatus", [])
    //    //alert(JSON.stringify(wfstatus))
    let wfstatus = "";
    if (get(state, "screenConfiguration.preparedFinalObject.ROADCUTNOCWF.REASSIGNDO")) {
      //alert("DO //alert")
      wfstatus = wfstatuslist.find(item => {
        return item.buttonName == "reassignToDO";
      });
    } else {
      //alert("NOrmal Reasiign")
      wfstatus = wfstatuslist.find(item => {
        return item.buttonName == "reassign";
      });

    }
    // getWFStatus("REASSIGNTOEE,REASSIGNTOSE,REASSIGNTOCE", state)
    // //alert(getWFStatus("REASSIGN,REASSIGNTOJE,REASSIGNTOSDO,REASSIGNTOSE,REASSIGNTOEE", state))
    UpdateStatus(state, dispatch, '/egov-opms/roadcut-search', [],
      {
        "applicationType": "ROADCUTNOC",
        "tenantId": getOPMSTenantId(),
        //        "applicationStatus": checkForRole(roles, 'JE') ? "REASSIGN" : checkForRole(roles, 'SDO') ? "REASSIGNTOJE" : checkForRole(roles, 'EE') ? "REASSIGNTOSDO" : checkForRole(roles, 'SE') ? "REASSIGNTOEE" : checkForRole(roles, 'CE') ? "REASSIGNTOSE" : '',
        "applicationStatus": wfstatus.status,
        "applicationId": localStorage.getItem('ApplicationNumber'),
        "dataPayload": data
      }
    );
  }
  else {
    let errorMessage = {
      labelName:
        "Please fill all mandatory fields, then proceed!",
      labelKey: "ERR_FILL_ALL_MANDATORY_FIELDS_TOAST"
    };
    dispatch(toggleSnackbar(true, errorMessage, "warning"));
  }

};

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
          xs: 10,
          sm: 10
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
              labelName: "Select Gateway"
              // labelKey: "NOC_SELECT_GATEWAY_BOX"
            },
            {
              style: {
                fontSize: "16px"
              }
            }
          )
        }
      },
      div2: {
        uiFramework: "custom-atoms",
        componentPath: "Div",
        gridDefination: {
          xs: 2,
          sm: 2
        },
        props: {
          style: {
            width: "100%",
            float: "right",
            cursor: "pointer"
          }
        },
        children: {
          closeButton: {
            componentPath: "Button",
            props: {
              style: {
                float: "right",
                marginRight: "-15px",
                paddingRight: "0px",
                color: "rgba(0, 0, 0, 0.60)"
              }
            },
            children: {
              previousButtonIcon: {
                uiFramework: "custom-atoms",
                componentPath: "Icon",
                props: {
                  iconName: "close"
                }
              }
            },
            onClickDefination: {
              action: "condition",
              callBack: (state, dispatch) => {
                showHideAdhocPopup(state, dispatch, "pay")
                dispatch(
                  handleField(
                    "pay",
                    "components.adhocDialog.children.popup.children.adhocPenaltyCard.children.penaltyAmountAndReasonContainer.children.penaltyReason",
                    "props.value", ""));
              }
            }
          }
        }
      }
    }
  },
  adhocPenaltyCard: getCommonContainer(
    {
      penaltyAmountAndReasonContainer: getCommonContainer({
        penaltyReason: getSelectField({
          label: {
            labelName: "Select Gateway"

          },
          placeholder: {
            labelName: "Select Gateway"

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
          optionLabel: "element",
          optionValue: "element",
          sourceJsonPath: "applyScreenMdmsData.payment",
          jsonPath:
            "OPMS.paymentGateway"
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
            width: "140px",
            height: "48px",
            marginRight: "16px",
            marginBottom: "8px"
          }
        },
        children: {
          previousButtonLabel: getLabel({
            labelName: "CANCEL",
            labelKey: "NOC_ADD_HOC_CHARGES_POPUP_BUTTON_CANCEL"
          })
        },
        onClickDefination: {
          action: "condition",
          callBack: (state, dispatch) => {
            showHideAdhocPopup(state, dispatch, "pay")
            dispatch(
              handleField(
                "pay",
                "components.adhocDialog.children.popup.children.adhocPenaltyCard.children.penaltyAmountAndReasonContainer.children.penaltyReason",
                "props.value", ""));
          }
        }
      },
      addButton: {
        componentPath: "Button",
        props: {
          variant: "contained",
          color: "primary",
          style: {
            width: "140px",
            height: "48px",
            marginBottom: "8px"
          }
        },
        children: {
          previousButtonLabel: getLabel({
            labelName: "Submit"
            //labelKey: "NOC_SUBMIT"
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


export const adhocPopup1 = getCommonContainer({
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
          xs: 10,
          sm: 10
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
              labelKey: "NOC_REMARKS_PET"
            },
            {
              style: {
                fontSize: "20px"
              }
            }
          )
        }
      },
      div2: {
        uiFramework: "custom-atoms",
        componentPath: "Div",
        gridDefination: {
          xs: 2,
          sm: 2
        },
        props: {
          style: {
            width: "100%",
            float: "right",
            cursor: "pointer"
          }
        },
        children: {
          closeButton: {
            componentPath: "Button",
            props: {
              style: {
                float: "right",
                marginRight: "-15px",
                paddingRight: "0px",
                color: "rgba(0, 0, 0, 0.60)"
              }
            },
            children: {
              previousButtonIcon: {
                uiFramework: "custom-atoms",
                componentPath: "Icon",
                props: {
                  iconName: "close"
                }
              }
            },
            onClickDefination: {
              action: "condition",
              callBack: (state, dispatch) => {
                showHideAdhocPopup(state, dispatch, "search-preview")
                set(state,
                  "screenConfiguration.preparedFinalObject.documentsUploadRedux[0]",
                  ""
                )
                window.location.reload();

              }
            }
          }
        }
      }
    }
  },

  adhocRebateCard: getCommonContainer(
    {
      documentDetails,
      rebateAmountAndReasonContainer: getCommonContainer({

        rebateReason: getTextField({
          label: {
            labelName: "Enter badge Number",
            labelKey: "NOC_ADD_PET_POPUP_BADGE_NUMBER_LABEL"
          },
          placeholder: {
            labelName: "Enter badge Number",
            labelKey: "NOC_ADD_PET_POPUP_BADGE_NUMBER_LABEL"
          },
          gridDefination: {
            xs: 12,
            sm: 12
          },
          required: true,
          pattern: getOPMSPattern("BadgeNumber"),
          props: {
            style: {
              width: "100%"
            }
          },
          jsonPath: "PetNoc[0].PetNocDetails.additionalDetail.badgeNumber"

        }),

        rebateCommentsField: getTextField({
          label: {
            labelName: "Enter Remarks",
            labelKey: "NOC_ADD_PET_POPUP_REMARKS_LABEL"
          },
          placeholder: {
            labelName: "Enter Remarks",
            labelKey: "NOC_ADD_PET_POPUP_REMARKS_LABEL"
          },
          gridDefination: {
            xs: 12,
            sm: 12
          },
          required: true,
          pattern: getOPMSPattern("Remarks"),
          props: {
            style: {
              width: "100%"
            }
          },
          props: {

            className: "textfield-enterable-selection",
            multiline: true,
            rows: "4"
          },
          jsonPath: "PetNoc[0].PetNocDetails.additionalDetail.remarks"

        })

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
            width: "180px",
            height: "48px",
            marginRight: "16px",
            marginBottom: "8px"
          }
        },
        children: {
          previousButtonLabel: getLabel({
            labelName: "CANCEL",
            labelKey: "NOC_CANCEL_PET"
          })
        },
        onClickDefination: {
          action: "condition",
          callBack: (state, dispatch) => {
            showHideAdhocPopup(state, dispatch, "search-preview")
            set(state,
              "screenConfiguration.preparedFinalObject.documentsUploadRedux[0]",
              ""
            )

            window.location.reload();
          }
        }
      },
      addButton: {
        componentPath: "Button",
        props: {
          variant: "contained",
          color: "primary",
          style: {
            width: "180px",
            height: "48px",
            marginBottom: "8px"
          }
        },
        children: {
          previousButtonLabel: getLabel({
            labelName: "Submit",
            labelKey: "NOC_SUBMIT_PET"
          })
        },
        onClickDefination: {
          action: "condition",
          callBack: updateAdhoc1
        }
      }
    }
  }
});


export const adhocPopup2 = getCommonContainer({
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
          xs: 10,
          sm: 10
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
              labelKey: "NOC_REMARKS_PET"
            },
            {
              style: {
                fontSize: "20px"
              }
            }
          )
        }
      },
      div2: {
        uiFramework: "custom-atoms",
        componentPath: "Div",
        gridDefination: {
          xs: 2,
          sm: 2
        },
        props: {
          style: {
            width: "100%",
            float: "right",
            cursor: "pointer"
          }
        },
        children: {
          closeButton: {
            componentPath: "Button",
            props: {
              style: {
                float: "right",
                marginRight: "-15px",
                paddingRight: "0px",
                color: "rgba(0, 0, 0, 0.60)"
              }
            },
            children: {
              previousButtonIcon: {
                uiFramework: "custom-atoms",
                componentPath: "Icon",
                props: {
                  iconName: "close"
                }
              }
            },
            onClickDefination: {
              action: "condition",
              callBack: (state, dispatch) => {
                showHideAdhocPopupopmsReassign(state, dispatch, "search-preview")
                set(state,
                  "screenConfiguration.preparedFinalObject.documentsUploadRedux[0]",
                  ""
                )
                window.location.reload();
              }
            }
          }
        }
      }
    }
  },

  adhocRebateCard: getCommonContainer(
    {
      documentDetails,
      rebateReaassignContainer: getCommonContainer({



        rebateReaasignField: getTextField({
          label: {
            labelName: "Enter Remarks",
            labelKey: "NOC_ADD_PET_POPUP_REMARKS_LABEL"
          },
          placeholder: {
            labelName: "Enter Remarks",
            labelKey: "NOC_ADD_PET_POPUP_REMARKS_LABEL"
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
          props: {

            className: "textfield-enterable-selection",
            multiline: true,
            rows: "4"
          },
          jsonPath: "PetNoc[0].PetNocDetails.Reaasign.remarks",
          required: true,
          pattern: getOPMSPattern("Remarks"),


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
            width: "180px",
            height: "48px",
            marginRight: "16px",
            marginBottom: "8px"
          }
        },
        children: {
          previousButtonLabel: getLabel({
            labelName: "CANCEL",
            labelKey: "NOC_CANCEL_PET"
          })
        },
        onClickDefination: {
          action: "condition",
          callBack: (state, dispatch) => {
            showHideAdhocPopupopmsReassign(state, dispatch, "search-preview")
            set(state,
              "screenConfiguration.preparedFinalObject.documentsUploadRedux[0]",
              ""
            )
            window.location.reload();
          }
        }
      },
      addButton: {
        componentPath: "Button",
        props: {
          variant: "contained",
          color: "primary",
          style: {
            width: "180px",
            height: "48px",
            marginBottom: "8px"
          }
        },
        children: {
          previousButtonLabel: getLabel({
            labelName: "ADD",
            labelKey: "NOC_SUBMIT_PET"
          })
        },
        onClickDefination: {
          action: "condition",
          callBack: updateAdhocReaasign
        }
      }
    }
  }
});


export const adhocPopup3 = getCommonContainer({
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
          xs: 10,
          sm: 10
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
              labelKey: "NOC_REMARKS_PET"
            },
            {
              style: {
                fontSize: "20px"
              }
            }
          )
        }
      },
      div2: {
        uiFramework: "custom-atoms",
        componentPath: "Div",
        gridDefination: {
          xs: 2,
          sm: 2
        },
        props: {
          style: {
            width: "100%",
            float: "right",
            cursor: "pointer"
          }
        },
        children: {
          closeButton: {
            componentPath: "Button",
            props: {
              style: {
                float: "right",
                marginRight: "-15px",
                paddingRight: "0px",
                color: "rgba(0, 0, 0, 0.60)"
              }
            },
            children: {
              previousButtonIcon: {
                uiFramework: "custom-atoms",
                componentPath: "Icon",
                props: {
                  iconName: "close"
                }
              }
            },
            onClickDefination: {
              action: "condition",
              callBack: (state, dispatch) => {
                showHideAdhocPopupopmsApprove(state, dispatch, "search-preview")
                window.location.reload();
              }

            }
          }
        }
      }
    }
  },

  adhocRebateCard: getCommonContainer(
    {
      rebateApproveContainer: getCommonContainer({
        rebateApproveBadgeReason: getTextField({
          label: {
            labelName: "Enter badge Number",
            labelKey: "NOC_ADD_PET_POPUP_BADGE_NUMBER_LABEL"
          },
          placeholder: {
            labelName: "Enter badge Number",
            labelKey: "NOC_ADD_PET_POPUP_BADGE_NUMBER_LABEL"
          },
          gridDefination: {
            xs: 12,
            sm: 12
          },
          jsonPath: "PetNoc[0].PetNocDetails.Approve.badgeNumber",
          required: true,
          props: {
            disabled: true
          },
          pattern: getOPMSPattern("BadgeNumber"),
          props: {
            style: {
              width: "100%"
            }
          },
        }),
        rebateApproveField: getTextField({
          label: {
            labelName: "Enter Remarks",
            labelKey: "NOC_ADD_PET_POPUP_REMARKS_LABEL"
          },
          placeholder: {
            labelName: "Enter Remarks",
            labelKey: "NOC_ADD_PET_POPUP_REMARKS_LABEL"
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
          props: {

            className: "textfield-enterable-selection",
            multiline: true,
            rows: "4"
          },
          jsonPath: "PetNoc[0].PetNocDetails.Approve.remarks",
          required: true,
          pattern: getOPMSPattern("Remarks"),

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
            width: "180px",
            height: "48px",
            marginRight: "16px",
            marginBottom: "8px"
          }
        },
        children: {
          previousButtonLabel: getLabel({
            labelName: "CANCEL",
            labelKey: "NOC_CANCEL_PET"
          })
        },
        onClickDefination: {
          action: "condition",
          callBack: (state, dispatch) => {
            showHideAdhocPopupopmsApprove(state, dispatch, "search-preview")
            window.location.reload();

          }
        }
      },
      addButton: {
        componentPath: "Button",
        props: {
          variant: "contained",
          color: "primary",
          style: {
            width: "180px",
            height: "48px",
            marginBottom: "8px"
          }
        },
        children: {
          previousButtonLabel: getLabel({
            labelName: "Submit",
            labelKey: "NOC_SUBMIT_PET"
          })
        },
        onClickDefination: {
          action: "condition",
          callBack: updateAdhocApprove
        }
      }
    }
  }
});


export const adhocPopup4 = getCommonContainer({
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
          xs: 10,
          sm: 10
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
              labelKey: "NOC_REMARKS_PET"
            },
            {
              style: {
                fontSize: "20px"
              }
            }
          )
        }
      },
      div2: {
        uiFramework: "custom-atoms",
        componentPath: "Div",
        gridDefination: {
          xs: 2,
          sm: 2
        },
        props: {
          style: {
            width: "100%",
            float: "right",
            cursor: "pointer"
          }
        },
        children: {
          closeButton: {
            componentPath: "Button",
            props: {
              style: {
                float: "right",
                marginRight: "-15px",
                paddingRight: "0px",
                color: "rgba(0, 0, 0, 0.60)"
              }
            },
            children: {
              previousButtonIcon: {
                uiFramework: "custom-atoms",
                componentPath: "Icon",
                props: {
                  iconName: "close"
                }
              }
            },
            onClickDefination: {
              action: "condition",
              callBack: (state, dispatch) => {
                showHideAdhocPopupopmsReject(state, dispatch, "search-preview")
                set(state,
                  "screenConfiguration.preparedFinalObject.documentsUploadRedux[0]",
                  ""
                )
                window.location.reload();

              }
            }
          }
        }
      }
    }
  },

  adhocRebateCard: getCommonContainer(


    {
      documentDetails,
      rebateRejectContainer: getCommonContainer({



        rebateRejectField: getTextField({
          label: {
            labelName: "Enter Remarks",
            labelKey: "NOC_ADD_PET_POPUP_REMARKS_LABEL"
          },
          placeholder: {
            labelName: "Enter Remarks",
            labelKey: "NOC_ADD_PET_POPUP_REMARKS_LABEL"
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
          props: {

            className: "textfield-enterable-selection",
            multiline: true,
            rows: "4"
          },
          jsonPath: "PetNoc[0].PetNocDetails.Reject.remarks",
          required: true,
          pattern: getOPMSPattern("Remarks"),

        }),


      })
    },
    {
      style: {
        marginTop: "24px"
      }
    },

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
            width: "180px",
            height: "48px",
            marginRight: "16px",
            marginBottom: "8px"
          }
        },
        children: {
          previousButtonLabel: getLabel({
            labelName: "CANCEL",
            labelKey: "NOC_CANCEL_PET"
          })
        },
        onClickDefination: {
          action: "condition",
          callBack: (state, dispatch) => {
            showHideAdhocPopupopmsReject(state, dispatch, "search-preview")
            set(state,
              "screenConfiguration.preparedFinalObject.documentsUploadRedux[0]",
              ""
            )
            window.location.reload();
          }

        }
      },
      addButton: {
        componentPath: "Button",
        props: {
          variant: "contained",
          color: "primary",
          style: {
            width: "180px",
            height: "48px",
            marginBottom: "8px"
          }
        },
        children: {
          previousButtonLabel: getLabel({
            labelName: "Submit",
            labelKey: "NOC_SUBMIT_PET"
          })
        },
        onClickDefination: {
          action: "condition",
          callBack: updateAdhocReject
        }
      }
    }
  }
});


// export const adhocPopupAdvertisementForward = getCommonContainer({
//   header: {
//     uiFramework: "custom-atoms",
//     componentPath: "Container",
//     props: {
//       style: {
//         width: "100%",
//         float: "right"
//       }
//     },
//     children: {
//       div1: {
//         uiFramework: "custom-atoms",
//         componentPath: "Div",
//         gridDefination: {
//           xs: 10,
//           sm: 10
//         },
//         props: {
//           style: {
//             width: "100%",
//             float: "right"
//           }
//         },
//         children: {
//           div: getCommonHeader(
//             {
//               labelName: "Remarks",
//               labelKey: "NOC_REMARKS_ADVERTISEMENT"
//             },
//             {
//               style: {
//                 fontSize: "20px"
//               }
//             }
//           )
//         }
//       },
//       div2: {
//         uiFramework: "custom-atoms",
//         componentPath: "Div",
//         gridDefination: {
//           xs: 2,
//           sm: 2
//         },
//         props: {
//           style: {
//             width: "100%",
//             float: "right",
//             cursor: "pointer"
//           }
//         },
//         children: {
//           closeButton: {
//             componentPath: "Button",
//             props: {
//               style: {
//                 float: "right",
//                 marginRight: "-15px",
//                 paddingRight: "0px",
//                 color: "rgba(0, 0, 0, 0.60)"
//               }
//             },
//             children: {
//               previousButtonIcon: {
//                 uiFramework: "custom-atoms",
//                 componentPath: "Icon",
//                 props: {
//                   iconName: "close"
//                 }
//               }
//             },
//             onClickDefination: {
//               action: "condition",
//               callBack: (state, dispatch) => {
//                 showHideAdhocPopupopmsForward(state, dispatch, "advertisementnoc-search-preview")
//                 set(state,
//                   "screenConfiguration.preparedFinalObject.documentsUploadRedux[0]",
//                   ""
//                 )
//                 window.location.reload();
//               }
//             }
//           }
//         }
//       }
//     }
//   },

//   adhocPopupAdvertisementJEXForwardRemarkCard: getCommonContainer(
//     {
//       advertisementJEXForwardRemarkContainer: getCommonContainer({
//         documentDetails,
//         advertisementJEXForwardRemarkField: getTextField({
//           label: {
//             labelName: "Enter Remarks",
//             labelKey: "NOC_ADVERTISEMENT_JEX_FORWARD_REMARK_LABEL"
//           },
//           placeholder: {
//             labelName: "Enter Remarks",
//             labelKey: "NOC_ADVERTISEMENT_JEX_FORWARD_REMARK_LABEL"
//           },
//           gridDefination: {
//             xs: 12,
//             sm: 12
//           },
//           props: {
//             style: {
//               width: "100%"
//             }
//           },
//           props: {

//             className: "textfield-enterable-selection",
//             multiline: true,
//             rows: "4"
//           },
//           jsonPath: "advertisement[0].Forward.Remark",
//           required: true,
//           pattern: getOPMSPattern("Remarks"),

//         }),

//         downloadcard: {
//           uiFramework: "custom-molecules-local",
//           moduleName: "egov-opms",
//           componentPath: "SampleDownload"
//         },
//       }),

//     },
//     {
//       style: {
//         marginTop: "24px"
//       }
//     }
//   ),
//   div: {
//     uiFramework: "custom-atoms",
//     componentPath: "Div",
//     props: {
//       style: {
//         width: "100%",
//         // textAlign: "right"
//       }
//     },
//     children: {
//       cancelButton: {
//         componentPath: "Button",
//         props: {
//           variant: "outlined",
//           color: "primary",
//           style: {
//             width: "180px",
//             height: "48px",
//             marginRight: "16px"
//           }
//         },
//         children: {
//           previousButtonLabel: getLabel({
//             labelName: "CANCEL",
//             labelKey: "NOC_CANCEL_ADVERTISEMENT"
//           })
//         },
//         onClickDefination: {
//           action: "condition",
//           callBack: (state, dispatch) => {
//             showHideAdhocPopupopmsForward(state, dispatch, "advertisementnoc-search-preview")
//             set(state,
//               "screenConfiguration.preparedFinalObject.documentsUploadRedux[0]",
//               ""
//             )
//             window.location.reload();
//           }
//         }
//       },
//       addButton: {
//         componentPath: "Button",
//         props: {
//           variant: "contained",
//           color: "primary",
//           style: {
//             width: "180px",
//             height: "48px"
//           }
//         },
//         children: {
//           previousButtonLabel: getLabel({
//             labelName: "Submit",
//             labelKey: "NOC_SUBMIT_ADVERTISEMENT"
//           })
//         },
//         onClickDefination: {
//           action: "condition",
//           callBack: updateAdhocAdvForward
//         }
//       }
//     }
//   }
// });


export const adhocPopupAdvertisementForward = getCommonContainer({
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
          xs: 10,
          sm: 10
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
              labelKey: "NOC_REMARKS_ADVERTISEMENT"
            },
            {
              style: {
                fontSize: "20px"
              }
            }
          )
        }
      },
      div2: {
        uiFramework: "custom-atoms",
        componentPath: "Div",
        gridDefination: {
          xs: 2,
          sm: 2
        },
        props: {
          style: {
            width: "100%",
            float: "right",
            cursor: "pointer"
          }
        },
        children: {
          closeButton: {
            componentPath: "Button",
            props: {
              style: {
                float: "right",
                marginRight: "-15px",
                paddingRight: "0px",
                color: "rgba(0, 0, 0, 0.60)"
              }
            },
            children: {
              previousButtonIcon: {
                uiFramework: "custom-atoms",
                componentPath: "Icon",
                props: {
                  iconName: "close"
                }
              }
            },
            onClickDefination: {
              action: "condition",
              callBack: (state, dispatch) => {
                showHideAdhocPopupopmsForward(state, dispatch, "advertisementnoc-search-preview")
                set(state,
                  "screenConfiguration.preparedFinalObject.documentsUploadRedux[0]",
                  ""
                )
                window.location.reload();
              }
            }
          }
        }
      }
    }
  },

  adhocPopupAdvertisementForwardRemarkCard: getCommonContainer(
    {
      documentDetails,

      advertisementForwardRemarkContainer: getCommonContainer({
        employeeList: getSelectField({
          label: {
            labelName: "Select Role",
            labelKey: "PM_SELECT_ADV_ROLE"
          },
          placeholder: {
            labelName: "Select Role",
            labelKey: "PM_SELECT_ADV_ROLE"
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
          optionLabel: "name",
          optionValue: "status",
          sourceJsonPath: "applyScreenMdmsData.egpm.AdvertisementEmployeeList",
          jsonPath:
            "OPMS.AdvertisementNOC.typeOfCommissioner",
          visible: false,
          required: false,
        }),

        advertisementForwardRemarkField: getTextField({
          label: {
            labelName: "Enter Remarks",
            labelKey: "NOC_ADVERTISEMENT_JEX_FORWARD_REMARK_LABEL"
          },
          placeholder: {
            labelName: "Enter Remarks",
            labelKey: "NOC_ADVERTISEMENT_JEX_FORWARD_REMARK_LABEL"
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
          props: {

            className: "textfield-enterable-selection",
            multiline: true,
            rows: "4"
          },
          jsonPath: "advertisement[0].Forward.Remark",
          required: true,
          pattern: getOPMSPattern("Remarks"),

        }),

        downloadcard: {
          uiFramework: "custom-molecules-local",
          moduleName: "egov-opms",
          componentPath: "SampleDownload"
        },
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
            width: "180px",
            height: "48px",
            marginRight: "16px",
            marginBottom: "8px"
          }
        },
        children: {
          previousButtonLabel: getLabel({
            labelName: "CANCEL",
            labelKey: "NOC_CANCEL_ADVERTISEMENT"
          })
        },
        onClickDefination: {
          action: "condition",
          callBack: (state, dispatch) => {
            showHideAdhocPopupopmsForward(state, dispatch, "advertisementnoc-search-preview")
            set(state,
              "screenConfiguration.preparedFinalObject.documentsUploadRedux[0]",
              ""
            )
            window.location.reload();
          }
        }
      },
      addButton: {
        componentPath: "Button",
        props: {
          variant: "contained",
          color: "primary",
          style: {
            width: "180px",
            height: "48px",
            marginBottom: "8px"
          }
        },
        children: {
          previousButtonLabel: getLabel({
            labelName: "Submit",
            labelKey: "NOC_SUBMIT_ADVERTISEMENT"
          })
        },
        onClickDefination: {
          action: "condition",
          callBack: updateAdhocAdvForward
        }
      }
    }
  }
});

export const adhocPopupAdvertisementReassign = getCommonContainer({
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
          xs: 10,
          sm: 10
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
              labelKey: "NOC_REMARKS_ADVERTISEMENT"
            },
            {
              style: {
                fontSize: "20px"
              }
            }
          )
        }
      },
      div2: {
        uiFramework: "custom-atoms",
        componentPath: "Div",
        gridDefination: {
          xs: 2,
          sm: 2
        },
        props: {
          style: {
            width: "100%",
            float: "right",
            cursor: "pointer"
          }
        },
        children: {
          closeButton: {
            componentPath: "Button",
            props: {
              style: {
                float: "right",
                marginRight: "-15px",
                paddingRight: "0px",
                color: "rgba(0, 0, 0, 0.60)"
              }
            },
            children: {
              previousButtonIcon: {
                uiFramework: "custom-atoms",
                componentPath: "Icon",
                props: {
                  iconName: "close"
                }
              }
            },
            onClickDefination: {
              action: "condition",
              callBack: (state, dispatch) => {
                showHideAdhocPopupopmsReassign(state, dispatch, "advertisementnoc-search-preview")
                set(state,
                  "screenConfiguration.preparedFinalObject.documentsUploadRedux[0]",
                  ""
                )
                window.location.reload();
              }
            }
          }
        }
      }
    }
  },

  adhocPopupAdvertisementJEXReassignRemarkCard: getCommonContainer(
    {
      documentDetails,
      advertisementJEXReassignRemarkContainer: getCommonContainer({

        advertisementJEXReassignRemarkField: getTextField({
          label: {
            labelName: "Enter Remarks",
            labelKey: "NOC_ADVERTISEMENT_JEX_REASSIGN_REMARK_LABEL"
          },
          placeholder: {
            labelName: "Enter Remarks",
            labelKey: "NOC_ADVERTISEMENT_JEX_REASSIGN_REMARK_LABEL"
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
          props: {

            className: "textfield-enterable-selection",
            multiline: true,
            rows: "4"
          },
          jsonPath: "advertisement[0].Reassign.Remark",
          required: true,
          pattern: getOPMSPattern("Remarks"),

        }),
        downloadcard: {
          uiFramework: "custom-molecules-local",
          moduleName: "egov-opms",
          componentPath: "SampleDownload"
        },
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
            width: "180px",
            height: "48px",
            marginRight: "16px",
            marginBottom: "8px"
          }
        },
        children: {
          previousButtonLabel: getLabel({
            labelName: "CANCEL",
            labelKey: "NOC_CANCEL_ADVERTISEMENT"
          })
        },
        onClickDefination: {
          action: "condition",
          callBack: (state, dispatch) => {
            showHideAdhocPopupopmsReassign(state, dispatch, "advertisementnoc-search-preview")
            set(state,
              "screenConfiguration.preparedFinalObject.documentsUploadRedux[0]",
              ""
            )
            window.location.reload();
          }
        }
      },
      addButton: {
        componentPath: "Button",
        props: {
          variant: "contained",
          color: "primary",
          style: {
            width: "180px",
            height: "48px",
            marginBottom: "8px"
          }
        },
        children: {
          previousButtonLabel: getLabel({
            labelName: "Submit",
            labelKey: "NOC_SUBMIT_ADVERTISEMENT"
          })
        },
        onClickDefination: {
          action: "condition",
          callBack: updateAdhocAdvReassign
        }
      }
    }
  }
});

export const adhocPopupAdvertisementReject = getCommonContainer({
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
          xs: 10,
          sm: 10
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
              labelKey: "NOC_REMARKS_ADVERTISEMENT"
            },
            {
              style: {
                fontSize: "20px"
              }
            }
          )
        }
      },
      div2: {
        uiFramework: "custom-atoms",
        componentPath: "Div",
        gridDefination: {
          xs: 2,
          sm: 2
        },
        props: {
          style: {
            width: "100%",
            float: "right",
            cursor: "pointer"
          }
        },
        children: {
          closeButton: {
            componentPath: "Button",
            props: {
              style: {
                float: "right",
                marginRight: "-15px",
                paddingRight: "0px",
                color: "rgba(0, 0, 0, 0.60)"
              }
            },
            children: {
              previousButtonIcon: {
                uiFramework: "custom-atoms",
                componentPath: "Icon",
                props: {
                  iconName: "close"
                }
              }
            },
            onClickDefination: {
              action: "condition",
              callBack: (state, dispatch) => {
                showHideAdhocPopupopmsReject(state, dispatch, "advertisementnoc-search-preview")
                set(state,
                  "screenConfiguration.preparedFinalObject.documentsUploadRedux[0]",
                  ""
                )
                window.location.reload();
              }
            }
          }
        }
      }
    }
  },

  adhocPopupAdvertisementCommissionerRejectRemarkCard: getCommonContainer(
    {
      documentDetails,
      advertisementCommissionerRejectRemarkContainer: getCommonContainer({

        advertisementCommissionerRejectRemarkField: getTextField({
          label: {
            labelName: "Enter Remarks",
            labelKey: "NOC_ADVERTISEMENT_COMMISSIONER_REJECT_REMARK_LABEL"
          },
          placeholder: {
            labelName: "Enter Remarks",
            labelKey: "NOC_ADVERTISEMENT_COMMISSIONER_REJECT_REMARK_LABEL"
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
          props: {

            className: "textfield-enterable-selection",
            multiline: true,
            rows: "4"
          },
          jsonPath: "advertisement[0].Reject.Remark",
          required: true,
          pattern: getOPMSPattern("Remarks"),

        }),
        downloadcard: {
          uiFramework: "custom-molecules-local",
          moduleName: "egov-opms",
          componentPath: "SampleDownload"
        },
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
            width: "180px",
            height: "48px",
            marginRight: "16px",
            marginBottom: "8px"
          }
        },
        children: {
          previousButtonLabel: getLabel({
            labelName: "CANCEL",
            labelKey: "NOC_CANCEL_ADVERTISEMENT"
          })
        },
        onClickDefination: {
          action: "condition",
          callBack: (state, dispatch) => {
            showHideAdhocPopupopmsReject(state, dispatch, "advertisementnoc-search-preview")
            set(state,
              "screenConfiguration.preparedFinalObject.documentsUploadRedux[0]",
              ""
            )
            window.location.reload();
          }
        }
      },
      addButton: {
        componentPath: "Button",
        props: {
          variant: "contained",
          color: "primary",
          style: {
            width: "180px",
            height: "48px",
            marginBottom: "8px"
          }
        },
        children: {
          previousButtonLabel: getLabel({
            labelName: "Submit",
            labelKey: "NOC_SUBMIT_ADVERTISEMENT"
          })
        },
        onClickDefination: {
          action: "condition",
          callBack: updateAdhocAdvReject
        }
      }
    }
  }
});

export const adhocPopupAdvertisementApprove = getCommonContainer({
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
          xs: 10,
          sm: 10
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
              labelKey: "NOC_REMARKS_ADVERTISEMENT"
            },
            {
              style: {
                fontSize: "20px"
              }
            }
          )
        }
      },
      div2: {
        uiFramework: "custom-atoms",
        componentPath: "Div",
        gridDefination: {
          xs: 2,
          sm: 2
        },
        props: {
          style: {
            width: "100%",
            float: "right",
            cursor: "pointer"
          }
        },
        children: {
          closeButton: {
            componentPath: "Button",
            props: {
              style: {
                float: "right",
                marginRight: "-15px",
                paddingRight: "0px",
                color: "rgba(0, 0, 0, 0.60)"
              }
            },
            children: {
              previousButtonIcon: {
                uiFramework: "custom-atoms",
                componentPath: "Icon",
                props: {
                  iconName: "close"
                }
              }
            },
            onClickDefination: {
              action: "condition",
              callBack: (state, dispatch) => {
                showHideAdhocPopupopmsApprove(state, dispatch, "advertisementnoc-search-preview")

                window.location.reload();
              }
            }
          }
        }
      }
    }
  },

  adhocPopupAdvertisementCommissionerApproveRemarkCard: getCommonContainer(
    {
      advertisementCommissionerApproveRemarkContainer: getCommonContainer({

        advertisementCommissionerApproveRemarkField: getTextField({
          label: {
            labelName: "Enter Remarks",
            labelKey: "NOC_ADVERTISEMENT_COMMISSIONER_APPROVE_REMARK_LABEL"
          },
          placeholder: {
            labelName: "Enter Remarks",
            labelKey: "NOC_ADVERTISEMENT_COMMISSIONER_APPROVE_REMARK_LABEL"
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
          props: {

            className: "textfield-enterable-selection",
            multiline: true,
            rows: "4"
          },
          jsonPath: "advertisement[0].Approve.Remark",
          required: true,
          pattern: getOPMSPattern("Remarks"),

        }),
        downloadcard: {
          uiFramework: "custom-molecules-local",
          moduleName: "egov-opms",
          componentPath: "SampleDownload"
        },
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
            width: "180px",
            height: "48px",
            marginRight: "16px",
            marginBottom: "8px"
          }
        },
        children: {
          previousButtonLabel: getLabel({
            labelName: "CANCEL",
            labelKey: "NOC_CANCEL_ADVERTISEMENT"
          })
        },
        onClickDefination: {
          action: "condition",
          callBack: (state, dispatch) => {
            showHideAdhocPopupopmsApprove(state, dispatch, "advertisementnoc-search-preview")
            window.location.reload();
          }
        }
      },
      addButton: {
        componentPath: "Button",
        props: {
          variant: "contained",
          color: "primary",
          style: {
            width: "180px",
            height: "48px",
            marginBottom: "8px"
          }
        },
        children: {
          previousButtonLabel: getLabel({
            labelName: "Submit",
            labelKey: "NOC_SUBMIT_ADVERTISEMENT"
          })
        },
        onClickDefination: {
          action: "condition",
          callBack: updateAdhocAdvApprove
        }
      }
    }
  }
});


//osd withdraw popup

export const adhocPopupAdvertisementwithdrawApproval = getCommonContainer({
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
          xs: 10,
          sm: 10
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
              labelKey: "NOC_REMARKS_ADVERTISEMENT"
            },
            {
              style: {
                fontSize: "20px"
              }
            }
          )
        }
      },
      div2: {
        uiFramework: "custom-atoms",
        componentPath: "Div",
        gridDefination: {
          xs: 2,
          sm: 2
        },
        props: {
          style: {
            width: "100%",
            float: "right",
            cursor: "pointer"
          }
        },
        children: {
          closeButton: {
            componentPath: "Button",
            props: {
              style: {
                float: "right",
                marginRight: "-15px",
                paddingRight: "0px",
                color: "rgba(0, 0, 0, 0.60)"
              }
            },
            children: {
              previousButtonIcon: {
                uiFramework: "custom-atoms",
                componentPath: "Icon",
                props: {
                  iconName: "close"
                }
              }
            },
            onClickDefination: {
              action: "condition",
              callBack: (state, dispatch) => {
                showHideAdhocPopup(state, dispatch, "advertisementnoc-search-preview")
                window.location.reload();
              }
            }
          }
        }
      }
    }
  },

  adhocPopupAdvertisementOSDWithdraApprovalAmountCard: getCommonContainer(
    {
      documentDetails,
      advertisementOSDWithdraApprovalAmountContainer: getCommonContainer({
        employeeList: getSelectField({
          label: {
            labelName: "Select Role",
            labelKey: "PM_SELECT_ADV_ROLE"
          },
          placeholder: {
            labelName: "Select Role",
            labelKey: "PM_SELECT_ADV_ROLE"
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
          optionLabel: "name",
          optionValue: "withdrawStatus",
          sourceJsonPath: "applyScreenMdmsData.egpm.AdvertisementEmployeeList",
          jsonPath:
            "OPMS.AdvertisementNOC.typeOfCommissioner",
          visible: false,
          required: false
        }),
        advertisementOSDWithdraApprovalAmountField: getTextField({
          label: {
            labelName: "Enter Amount",
            labelKey: "NOC_ADVERTISEMENT_OSD_WITHDRAW_APPROVAL_AMOUNT_LABEL"
          },
          placeholder: {
            labelName: "Enter Amount",
            labelKey: "NOC_ADVERTISEMENT_OSD_WITHDRAW_APPROVAL_AMOUNT_LABEL"
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
          jsonPath: "advertisement[0].WithdraApproval.Amount",
          required: true,
          pattern: getPattern("Amountopms"),

        }),
        advertisementOSDWithdraApprovalTaxAmountField: getTextField({

          label: {
            labelName: "Enter Withdraw Tax Amount",
            labelKey: "NOC_ADVERTISEMENT_WITHDRAW_APPROVAL_TAX_AMOUNT_LABEL"
          },
          placeholder: {
            labelName: "Enter Withdraw Tax Amount",
            labelKey: "NOC_ADVERTISEMENT_WITHDRAW_APPROVAL_TAX_AMOUNT_LABEL"
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
          jsonPath: "advertisement[0].WithdraApproval.Tax",
          required: true,
          pattern: getPattern("Amountopms"),

        })

      })
    },
    {
      style: {
        marginTop: "24px"
      }
    }
  ),
  adhocPopupAdvertisementCommissionerWithdrawApproveRemarkCard: getCommonContainer(
    {
      advertisementCommissionerWithdrawApproveRemarkContainer: getCommonContainer({

        advertisementCommissionerWithdrawApproveRemarkField: getTextField({
          label: {
            labelName: "Enter Remarks",
            labelKey: "NOC_ADVERTISEMENT_COMMISSIONER_APPROVE_REMARK_LABEL"
          },
          placeholder: {
            labelName: "Enter Remarks",
            labelKey: "NOC_ADVERTISEMENT_COMMISSIONER_APPROVE_REMARK_LABEL"
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
          props: {

            className: "textfield-enterable-selection",
            multiline: true,
            rows: "4"
          },
          jsonPath: "advertisement[0].WithdraApproval.Remark",

          required: true,
          pattern: getOPMSPattern("Remarks"),

        }),
        downloadcard: {
          uiFramework: "custom-molecules-local",
          moduleName: "egov-opms",
          componentPath: "SampleDownload"
        },
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
            width: "180px",
            height: "48px",
            marginRight: "16px",
            marginBottom: "8px"
          }
        },
        children: {
          previousButtonLabel: getLabel({
            labelName: "CANCEL",
            labelKey: "NOC_CANCEL_ADVERTISEMENT"
          })
        },
        onClickDefination: {
          action: "condition",
          callBack: (state, dispatch) => {
            showHideAdhocPopup(state, dispatch, "advertisementnoc-search-preview")
            window.location.reload();
          }
        }
      },
      addButton: {
        componentPath: "Button",
        props: {
          variant: "contained",
          color: "primary",
          style: {
            width: "180px",
            height: "48px",
            marginBottom: "8px"
          }
        },
        children: {
          previousButtonLabel: getLabel({
            labelName: "Submit",
            labelKey: "NOC_SUBMIT_ADVERTISEMENT"
          })
        },
        onClickDefination: {
          action: "condition",
          callBack: updateAdhocAdvWithdrawApp
        }
      }
    }
  }
});


//sellmeat
export const SellMeatForward = getCommonContainer({
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
          xs: 10,
          sm: 10
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
              labelKey: "NOC_REMARKS_SELLMEAT"
            },
            {
              style: {
                fontSize: "20px"
              }
            }
          )
        }
      },
      div2: {
        uiFramework: "custom-atoms",
        componentPath: "Div",
        gridDefination: {
          xs: 2,
          sm: 2
        },
        props: {
          style: {
            width: "100%",
            float: "right",
            cursor: "pointer"
          }
        },
        children: {
          closeButton: {
            componentPath: "Button",
            props: {
              style: {
                float: "right",
                marginRight: "-15px",
                paddingRight: "0px",
                color: "rgba(0, 0, 0, 0.60)"
              }
            },
            children: {
              previousButtonIcon: {
                uiFramework: "custom-atoms",
                componentPath: "Icon",
                props: {
                  iconName: "close"
                }
              }
            },
            onClickDefination: {
              action: "condition",
              callBack: (state, dispatch) => {
                showHideAdhocPopupopmsForward(state, dispatch, "sellmeatnoc-search-preview")
                set(state,
                  "screenConfiguration.preparedFinalObject.documentsUploadRedux[0]",
                  ""
                ),
                  window.location.reload();
              }
            }
          }
        }
      }
    }
  },

  SellMeatForwardCard: getCommonContainer(
    {
      documentDetails,
      SellMeatForwardContainer: getCommonContainer({

        SellMeatForwardField: getTextField({
          label: {
            labelName: "Enter Remarks",
            labelKey: "NOC_ADD_SELLMEAT_POPUP_REMARKS_LABEL"
          },
          placeholder: {
            labelName: "Enter Remarks",
            labelKey: "NOC_ADD_SELLMEAT_POPUP_REMARKS_LABEL"
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
          props: {

            className: "textfield-enterable-selection",
            multiline: true,
            rows: "4"
          },
          jsonPath: "SellMeat[0].SellMeatDetails.Forward.remarks",
          required: true,
          pattern: getOPMSPattern("Remarks"),

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
            width: "180px",
            height: "48px",
            marginRight: "16px",
            marginBottom: "8px"
          }
        },
        children: {
          previousButtonLabel: getLabel({
            labelName: "CANCEL",
            labelKey: "NOC_CANCEL_SELLMEAT"
          })
        },
        onClickDefination: {
          action: "condition",
          callBack: (state, dispatch) => {
            showHideAdhocPopupopmsForward(state, dispatch, "sellmeatnoc-search-preview")
            set(state,
              "screenConfiguration.preparedFinalObject.documentsUploadRedux[0]",
              ""
            ),
              window.location.reload();
          }
        }
      },
      addButton: {
        componentPath: "Button",
        props: {
          variant: "contained",
          color: "primary",
          style: {
            width: "180px",
            height: "48px",
            marginBottom: "8px"
          }
        },
        children: {
          previousButtonLabel: getLabel({
            labelName: "Submit",
            labelKey: "NOC_SUBMIT_PET"
          })
        },
        onClickDefination: {
          action: "condition",
          callBack: updateAdhocSellMeatForward
        }
      }
    }
  }
});


export const SellMeatReassign = getCommonContainer({
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
          xs: 10,
          sm: 10
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
              labelKey: "NOC_REMARKS_SELLMEAT"
            },
            {
              style: {
                fontSize: "20px"
              }
            }
          )
        }
      },
      div2: {
        uiFramework: "custom-atoms",
        componentPath: "Div",
        gridDefination: {
          xs: 2,
          sm: 2
        },
        props: {
          style: {
            width: "100%",
            float: "right",
            cursor: "pointer"
          }
        },
        children: {
          closeButton: {
            componentPath: "Button",
            props: {
              style: {
                float: "right",
                marginRight: "-15px",
                paddingRight: "0px",
                color: "rgba(0, 0, 0, 0.60)"
              }
            },
            children: {
              previousButtonIcon: {
                uiFramework: "custom-atoms",
                componentPath: "Icon",
                props: {
                  iconName: "close"
                }
              }
            },
            onClickDefination: {
              action: "condition",
              callBack: (state, dispatch) => {
                showHideAdhocPopupopmsReassign(state, dispatch, "sellmeatnoc-search-preview")
                set(state,
                  "screenConfiguration.preparedFinalObject.documentsUploadRedux[0]",
                  ""
                ),
                  window.location.reload();
              }
            }
          }
        }
      }
    }
  },

  SellMeatReassignCard: getCommonContainer(
    {
      documentDetails,

      SellMeatReassignContainer: getCommonContainer({


        SellMeatReassignField: getTextField({
          label: {
            labelName: "Enter Remarks",
            labelKey: "NOC_ADD_SELLMEAT_POPUP_REMARKS_LABEL"
          },
          placeholder: {
            labelName: "Enter Remarks",
            labelKey: "NOC_ADD_SELLMEAT_POPUP_REMARKS_LABEL"
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
          props: {

            className: "textfield-enterable-selection",
            multiline: true,
            rows: "4"
          },
          jsonPath: "SellMeat[0].SellMeatDetails.Reassign.remarks",
          required: true,
          pattern: getOPMSPattern("Remarks"),

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
            width: "180px",
            height: "48px",
            marginRight: "16px",
            marginBottom: "8px"
          }
        },
        children: {
          previousButtonLabel: getLabel({
            labelName: "CANCEL",
            labelKey: "NOC_CANCEL_SELLMEAT"
          })
        },
        onClickDefination: {
          action: "condition",
          callBack: (state, dispatch) => {
            showHideAdhocPopupopmsReassign(state, dispatch, "sellmeatnoc-search-preview")
            set(state,
              "screenConfiguration.preparedFinalObject.documentsUploadRedux[0]",
              ""
            )
            window.location.reload();
          }
        }
      },
      addButton: {
        componentPath: "Button",
        props: {
          variant: "contained",
          color: "primary",
          style: {
            width: "180px",
            height: "48px",
            marginBottom: "8px"
          }
        },
        children: {
          previousButtonLabel: getLabel({
            labelName: "Submit",
            labelKey: "NOC_SUBMIT_PET"
          })
        },
        onClickDefination: {
          action: "condition",
          callBack: updateAdhocSellMeatReassign
        }
      }
    }
  }
});


export const SellMeatApprove = getCommonContainer({
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
          xs: 10,
          sm: 10
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
              labelKey: "NOC_REMARKS_SELLMEAT"
            },
            {
              style: {
                fontSize: "20px"
              }
            }
          )
        }
      },
      div2: {
        uiFramework: "custom-atoms",
        componentPath: "Div",
        gridDefination: {
          xs: 2,
          sm: 2
        },
        props: {
          style: {
            width: "100%",
            float: "right",
            cursor: "pointer"
          }
        },
        children: {
          closeButton: {
            componentPath: "Button",
            props: {
              style: {
                float: "right",
                marginRight: "-15px",
                paddingRight: "0px",
                color: "rgba(0, 0, 0, 0.60)"
              }
            },
            children: {
              previousButtonIcon: {
                uiFramework: "custom-atoms",
                componentPath: "Icon",
                props: {
                  iconName: "close"
                }
              }
            },
            onClickDefination: {
              action: "condition",
              callBack: (state, dispatch) => {
                showHideAdhocPopupopmsApprove(state, dispatch, "sellmeatnoc-search-preview")
                window.location.reload();
              }
            }
          }
        }
      }
    }
  },

  SellMeatApproveCard: getCommonContainer(
    {

      SellMeatApproveContainer: getCommonContainer({


        SellMeatApproveField: getTextField({
          label: {
            labelName: "Enter Remarks",
            labelKey: "NOC_ADD_SELLMEAT_POPUP_REMARKS_LABEL"
          },
          placeholder: {
            labelName: "Enter Remarks",
            labelKey: "NOC_ADD_SELLMEAT_POPUP_REMARKS_LABEL"
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
          props: {

            className: "textfield-enterable-selection",
            multiline: true,
            rows: "4"
          },
          jsonPath: "SellMeat[0].SellMeatDetails.Approve.remarks",
          required: true,
          pattern: getOPMSPattern("Remarks"),

        }),
        // break: getBreak(),
        // break: getBreak(),

        // break: getBreak(),


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
            width: "180px",
            height: "48px",
            marginRight: "16px",
            marginBottom: "8px"
          }
        },
        children: {
          previousButtonLabel: getLabel({
            labelName: "CANCEL",
            labelKey: "NOC_CANCEL_SELLMEAT"
          })
        },
        onClickDefination: {
          action: "condition",
          callBack: (state, dispatch) => {
            showHideAdhocPopupopmsApprove(state, dispatch, "sellmeatnoc-search-preview")
            window.location.reload();
          }
        }
      },
      addButton: {
        componentPath: "Button",
        props: {
          variant: "contained",
          color: "primary",
          style: {
            width: "180px",
            height: "48px",
            marginBottom: "8px"
          }
        },
        children: {
          previousButtonLabel: getLabel({
            labelName: "Submit",
            labelKey: "NOC_SUBMIT_PET"
          })
        },
        onClickDefination: {
          action: "condition",
          callBack: updateAdhocSellMeatApprove
        }
      }
    }
  }
});


export const SellMeatReject = getCommonContainer({
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
          xs: 10,
          sm: 10
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
              labelKey: "NOC_REMARKS_SELLMEAT"
            },
            {
              style: {
                fontSize: "20px"
              }
            }
          )
        }
      },
      div2: {
        uiFramework: "custom-atoms",
        componentPath: "Div",
        gridDefination: {
          xs: 2,
          sm: 2
        },
        props: {
          style: {
            width: "100%",
            float: "right",
            cursor: "pointer"
          }
        },
        children: {
          closeButton: {
            componentPath: "Button",
            props: {
              style: {
                float: "right",
                marginRight: "-15px",
                paddingRight: "0px",
                color: "rgba(0, 0, 0, 0.60)"
              }
            },
            children: {
              previousButtonIcon: {
                uiFramework: "custom-atoms",
                componentPath: "Icon",
                props: {
                  iconName: "close"
                }
              }
            },
            onClickDefination: {
              action: "condition",
              callBack: (state, dispatch) => {
                showHideAdhocPopupopmsReject(state, dispatch, "sellmeatnoc-search-preview")
                set(state,
                  "screenConfiguration.preparedFinalObject.documentsUploadRedux[0]",
                  ""
                ),
                  window.location.reload();
              }
            }
          }
        }
      }
    }
  },

  SellMeatRejectCard: getCommonContainer(
    {
      documentDetails,

      SellMeatRejectContainer: getCommonContainer({

        SellMeatRejectField: getTextField({
          label: {
            labelName: "Enter Remarks",
            labelKey: "NOC_ADD_SELLMEAT_POPUP_REMARKS_LABEL"
          },
          placeholder: {
            labelName: "Enter Remarks",
            labelKey: "NOC_ADD_SELLMEAT_POPUP_REMARKS_LABEL"
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
          props: {

            className: "textfield-enterable-selection",
            multiline: true,
            rows: "4"
          },
          jsonPath: "SellMeat[0].SellMeatDetails.Reject.remarks",
          required: true,
          pattern: getOPMSPattern("Remarks"),



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
            width: "180px",
            height: "48px",
            marginRight: "16px",
            marginBottom: "8px"
          }
        },
        children: {
          previousButtonLabel: getLabel({
            labelName: "CANCEL",
            labelKey: "NOC_CANCEL_SELLMEAT"
          })
        },
        onClickDefination: {
          action: "condition",
          callBack: (state, dispatch) => {
            showHideAdhocPopupopmsReject(state, dispatch, "sellmeatnoc-search-preview")
            set(state,
              "screenConfiguration.preparedFinalObject.documentsUploadRedux[0]",
              ""
            ),
              window.location.reload();
          }
        }
      },
      addButton: {
        componentPath: "Button",
        props: {
          variant: "contained",
          color: "primary",
          style: {
            width: "180px",
            height: "48px",
            marginBottom: "8px"
          }
        },
        children: {
          previousButtonLabel: getLabel({
            labelName: "Submit",
            labelKey: "NOC_SUBMIT_PET"
          })
        },
        onClickDefination: {
          action: "condition",
          callBack: updateAdhocSellMeatReject
        }
      }
    }
  }
});


export const adhocPopupForJeRoadCutForward = getCommonContainer({
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
          xs: 10,
          sm: 10
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
              labelKey: "NOC_REMARKS_ROAD_CUT_FORWARD"
            },
            {
              style: {
                fontSize: "20px"
              }
            }
          )
        }
      },
      div2: {
        uiFramework: "custom-atoms",
        componentPath: "Div",
        gridDefination: {
          xs: 2,
          sm: 2
        },
        props: {
          style: {
            width: "100%",
            float: "right",
            cursor: "pointer"
          }
        },
        children: {
          closeButton: {
            componentPath: "Button",
            props: {
              style: {
                float: "right",
                marginRight: "-15px",
                paddingRight: "0px",
                color: "rgba(0, 0, 0, 0.60)"
              }
            },
            children: {
              previousButtonIcon: {
                uiFramework: "custom-atoms",
                componentPath: "Icon",
                props: {
                  iconName: "close"
                }
              }
            },
            onClickDefination: {
              action: "condition",
              callBack: (state, dispatch) => {
                showHideAdhocPopupopmsForward(state, dispatch, "roadcutnoc-search-preview")
                set(state,
                  "screenConfiguration.preparedFinalObject.documentsUploadRedux[0]",
                  ""
                ),
                  window.location.reload();
              }
            }
          }
        }
      }
    }
  },

  adhocRebateCardRoadCutForward: getCommonContainer(
    {
      documentDetails,
      ForwardContainerRoadCutForward: getCommonContainer({

        RoadCutForwardAmount: getTextField({
          label: {
            labelName: "Enter Amount",
            labelKey: "NOC_ROAD_CUT_FORWARD_POPUP_AMOUNT_LABEL"
          },
          placeholder: {
            labelName: "Enter Amount",
            labelKey: "NOC_ROAD_CUT_FORWARD_POPUP_AMOUNT_LABEL"
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
          jsonPath: "OPMS[0].RoadCutUpdateStautsDetails.additionalDetail.RoadCutForwardAmount",
          required: true,
          pattern: getOPMSPattern("ROADCUTFEE"),


        }),



        RoadCutForwardGstAmount: getTextField({
          label: {
            labelName: "Enter Gst Amount",
            labelKey: "NOC_ROAD_CUT_FORWARD_POPUP_GSTAMOUNT_LABEL"
          },
          placeholder: {
            labelName: "Enter Amount",
            labelKey: "NOC_ROAD_CUT_FORWARD_POPUP_GSTAMOUNT_LABEL"
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
          jsonPath: "OPMS[0].RoadCutUpdateStautsDetails.additionalDetail.RoadCutForwardGstAmount",
          required: true,
          pattern: getOPMSPattern("ROADCUTFEE"),

        }),


        RoadCutForwardPerformanceBankGuaranteeCharges: getTextField({
          label: {
            labelName: "Enter Performance Bank Guarantee Charges",
            labelKey: "NOC_ROAD_CUT_FORWARD_POPUP_PERFORMANCE_BANK_GUARANTEE_CHARGES_LABEL"
          },
          placeholder: {
            labelName: "Enter Performance Bank Guarantee Charges",
            labelKey: "NOC_ROAD_CUT_FORWARD_POPUP_PERFORMANCE_BANK_GUARANTEE_CHARGES_LABEL"
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
          jsonPath: "OPMS[0].RoadCutUpdateStautsDetails.additionalDetail.RoadCutForwardPerformanceBankGuaranteeCharges",
          required: true,
          pattern: getPattern("ROADCUTFEE"),


        }),




        FieldRoadCutForwardRemarks: getTextField({
          label: {
            labelName: "Enter Remarks",
            labelKey: "NOC_ROAD_CUT_FORWARD_POPUP_REMARKS_LABEL"
          },
          placeholder: {
            labelName: "Enter Remarks",
            labelKey: "NOC_ROAD_CUT_FORWARD_POPUP_REMARKS_LABEL"
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
          props: {

            className: "textfield-enterable-selection",
            multiline: true,
            rows: "4"
          },
          jsonPath: "OPMS[0].RoadCutUpdateStautsDetails.additionalDetail.FieldRoadCutForwardRemarks",
          required: true,
          pattern: getOPMSPattern("Remarks"),

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
            width: "180px",
            height: "48px",
            marginRight: "16px",
            marginBottom: "8px"
          }
        },
        children: {
          previousButtonLabel: getLabel({
            labelName: "CANCEL",
            labelKey: "NOC_CANCEL_ROAD_CUT_FORWARD"
          })
        },
        onClickDefination: {
          action: "condition",
          callBack: (state, dispatch) => {
            showHideAdhocPopupopmsForward(state, dispatch, "roadcutnoc-search-preview")
            set(state,
              "screenConfiguration.preparedFinalObject.documentsUploadRedux[0]",
              ""
            ),
              window.location.reload();
          }
        }
      },
      addButton: {
        componentPath: "Button",
        props: {
          variant: "contained",
          color: "primary",
          style: {
            width: "180px",
            height: "48px",
            marginBottom: "8px"
          }
        },
        children: {
          previousButtonLabel: getLabel({
            labelName: "Submit",
            labelKey: "NOC_SUBMIT_ROAD_CUT_FORWARD"
          })
        },
        onClickDefination: {
          action: "condition",
          callBack: updateAdhocRoadCutForward
        }
      }
    }
  }
});




export const adhocPopupForJeRoadCutReassign = getCommonContainer({
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
          xs: 10,
          sm: 10
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
              labelKey: "NOC_REMARKS_ROAD_CUT_REASSIGN"
            },
            {
              style: {
                fontSize: "20px"
              }
            }
          )
        }
      },
      div2: {
        uiFramework: "custom-atoms",
        componentPath: "Div",
        gridDefination: {
          xs: 2,
          sm: 2
        },
        props: {
          style: {
            width: "100%",
            float: "right",
            cursor: "pointer"
          }
        },
        children: {
          closeButton: {
            componentPath: "Button",
            props: {
              style: {
                float: "right",
                marginRight: "-15px",
                paddingRight: "0px",
                color: "rgba(0, 0, 0, 0.60)"
              }
            },
            children: {
              previousButtonIcon: {
                uiFramework: "custom-atoms",
                componentPath: "Icon",
                props: {
                  iconName: "close"
                }
              }
            },
            onClickDefination: {
              action: "condition",
              callBack: (state, dispatch) => {
                showHideAdhocPopupopmsReassign(state, dispatch, "roadcutnoc-search-preview")
                set(state,
                  "screenConfiguration.preparedFinalObject.documentsUploadRedux[0]",
                  ""
                ),
                  window.location.reload();
              }
            }
          }
        }
      }
    }
  },

  adhocRebateCardRoadCutReassign: getCommonContainer(
    {
      documentDetails,
      ContainerRoadCutReassign: getCommonContainer({



        FieldRoadCutReassignRemarks: getTextField({
          label: {
            labelName: "Enter Remarks",
            labelKey: "NOC_ROAD_CUT_REASSIGN_POPUP_REMARKS_LABEL"
          },
          placeholder: {
            labelName: "Enter Remarks",
            labelKey: "NOC_ROAD_CUT_REASSIGN_POPUP_REMARKS_LABEL"
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
          props: {

            className: "textfield-enterable-selection",
            multiline: true,
            rows: "4"
          },
          jsonPath: "OPMS[0].RoadCutUpdateStautsDetails.additionalDetail.remarks",
          required: true,
          pattern: getOPMSPattern("Remarks"),

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
            width: "180px",
            height: "48px",
            marginRight: "16px",
            marginBottom: "8px"
          }
        },
        children: {
          previousButtonLabel: getLabel({
            labelName: "CANCEL",
            labelKey: "NOC_CANCEL_ROAD_CUT_REASSIGN"
          })
        },
        onClickDefination: {
          action: "condition",
          callBack: (state, dispatch) => {

            showHideAdhocPopupopmsReassign(state, dispatch, "roadcutnoc-search-preview")
            set(state,
              "screenConfiguration.preparedFinalObject.documentsUploadRedux[0]",
              ""
            ),
              window.location.reload();
          }
        }
      },
      addButton: {
        componentPath: "Button",
        props: {
          variant: "contained",
          color: "primary",
          style: {
            width: "180px",
            height: "48px",
            marginBottom: "8px"
          }
        },
        children: {
          previousButtonLabel: getLabel({
            labelName: "Submit",
            labelKey: "NOC_SUBMIT_ROAD_CUT_REASSIGN"
          })
        },
        onClickDefination: {
          action: "condition",
          callBack: updateAdhocRoadCutReassign
        }
      }
    }
  }
});



export const adhocPopupForCeRoadCutApprove = getCommonContainer({
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
          xs: 10,
          sm: 10
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
              labelKey: "NOC_REMARKS_CE_ROAD_CUT_APPROVE"
            },
            {
              style: {
                fontSize: "20px"
              }
            }
          )
        }
      },
      div2: {
        uiFramework: "custom-atoms",
        componentPath: "Div",
        gridDefination: {
          xs: 2,
          sm: 2
        },
        props: {
          style: {
            width: "100%",
            float: "right",
            cursor: "pointer"
          }
        },
        children: {
          closeButton: {
            componentPath: "Button",
            props: {
              style: {
                float: "right",
                marginRight: "-15px",
                paddingRight: "0px",
                color: "rgba(0, 0, 0, 0.60)"
              }
            },
            children: {
              previousButtonIcon: {
                uiFramework: "custom-atoms",
                componentPath: "Icon",
                props: {
                  iconName: "close"
                }
              }
            },
            onClickDefination: {
              action: "condition",
              callBack: (state, dispatch) => {
                showHideAdhocPopupopmsApprove(state, dispatch, "roadcutnoc-search-preview")
                window.location.reload();
              }
            }
          }
        }
      }
    }
  },

  adhocRebateCardCeRoadCutApprove: getCommonContainer(
    {

      ContainerCeRoadCutApprove: getCommonContainer({




        FieldCeRoadCutApproveRemarks: getTextField({
          label: {
            labelName: "Enter Remarks",
            labelKey: "NOC_CE_ROAD_CUT_APPROVE_POPUP_REMARKS_LABEL"
          },
          placeholder: {
            labelName: "Enter Remarks",
            labelKey: "NOC_CE_ROAD_CUT_APPROVE_POPUP_REMARKS_LABEL"
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
          props: {

            className: "textfield-enterable-selection",
            multiline: true,
            rows: "4"
          },
          jsonPath: "OPMS[0].RoadCutUpdateStautsDetails.additionalDetail.remarks",
          required: true,
          pattern: getOPMSPattern("Remarks"),

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
            width: "180px",
            height: "48px",
            marginRight: "16px",
            marginBottom: "8px"
          }
        },
        children: {
          previousButtonLabel: getLabel({
            labelName: "CANCEL",
            labelKey: "NOC_CANCEL_CE_ROAD_CUT_APPROVE"
          })
        },
        onClickDefination: {
          action: "condition",
          callBack: (state, dispatch) => {
            showHideAdhocPopupopmsApprove(state, dispatch, "roadcutnoc-search-preview")
            window.location.reload();
          }
        }
      },
      addButton: {
        componentPath: "Button",
        props: {
          variant: "contained",
          color: "primary",
          style: {
            width: "180px",
            height: "48px",
            marginBottom: "8px"
          }
        },
        children: {
          previousButtonLabel: getLabel({
            labelName: "Submit",
            labelKey: "NOC_SUBMIT_CE_ROAD_CUT_APPROVE"
          })
        },
        onClickDefination: {
          action: "condition",
          callBack: updateAdhocRoadCutApprove
        }
      }
    }
  }
});




export const adhocPopupForCeRoadCutReject = getCommonContainer({
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
          xs: 10,
          sm: 10
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
              labelKey: "NOC_REMARKS_CE_ROAD_CUT_REJECT"
            },
            {
              style: {
                fontSize: "20px"
              }
            }
          )
        }
      },
      div2: {
        uiFramework: "custom-atoms",
        componentPath: "Div",
        gridDefination: {
          xs: 2,
          sm: 2
        },
        props: {
          style: {
            width: "100%",
            float: "right",
            cursor: "pointer"
          }
        },
        children: {
          closeButton: {
            componentPath: "Button",
            props: {
              style: {
                float: "right",
                marginRight: "-15px",
                paddingRight: "0px",
                color: "rgba(0, 0, 0, 0.60)"
              }
            },
            children: {
              previousButtonIcon: {
                uiFramework: "custom-atoms",
                componentPath: "Icon",
                props: {
                  iconName: "close"
                }
              }
            },
            onClickDefination: {
              action: "condition",
              callBack: (state, dispatch) => {
                showHideAdhocPopupopmsReject(state, dispatch, "roadcutnoc-search-preview")
                set(state,
                  "screenConfiguration.preparedFinalObject.documentsUploadRedux[0]",
                  ""
                )
                window.location.reload();
              }
            }
          }
        }
      }
    }
  },

  adhocRebateCardCeRoadCutReject: getCommonContainer(
    {
      documentDetails,
      ContainerCeRoadCutReject: getCommonContainer({

        FieldCeRoadCutRejectRemarks: getTextField({
          label: {
            labelName: "Enter Remarks",
            labelKey: "NOC_CE_ROAD_CUT_REJECT_POPUP_REMARKS_LABEL"
          },
          placeholder: {
            labelName: "Enter Remarks",
            labelKey: "NOC_CE_ROAD_CUT_REJECT_POPUP_REMARKS_LABEL"
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
          props: {

            className: "textfield-enterable-selection",
            multiline: true,
            rows: "4"
          },
          jsonPath: "OPMS[0].RoadCutUpdateStautsDetails.additionalDetail.remarks",
          required: true,
          pattern: getOPMSPattern("Remarks"),

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
            width: "180px",
            height: "48px",
            marginRight: "16px",
            marginBottom: "8px"
          }
        },
        children: {
          previousButtonLabel: getLabel({
            labelName: "CANCEL",
            labelKey: "NOC_CANCEL_CE_ROAD_CUT_REJECT"
          })
        },
        onClickDefination: {
          action: "condition",
          callBack: (state, dispatch) => {
            showHideAdhocPopupopmsReject(state, dispatch, "roadcutnoc-search-preview")
            set(state,
              "screenConfiguration.preparedFinalObject.documentsUploadRedux[0]",
              ""
            )
            window.location.reload();
          }
        }
      },
      addButton: {
        componentPath: "Button",
        props: {
          variant: "contained",
          color: "primary",
          style: {
            width: "180px",
            height: "48px",
            marginBottom: "8px"
          }
        },
        children: {
          previousButtonLabel: getLabel({
            labelName: "Submit",
            labelKey: "NOC_SUBMIT_CE_ROAD_CUT_REJECT"
          })
        },
        onClickDefination: {
          action: "condition",
          callBack: updateAdhocRoadCutReject
        }
      }
    }
  }
});


export const adhocPopupForSeRoadCutForward = getCommonContainer({
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
          xs: 10,
          sm: 10
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
              labelKey: "NOC_REMARKS_SE_ROAD_CUT_FORWORD"
            },
            {
              style: {
                fontSize: "20px"
              }
            }
          )
        }
      },
      div2: {
        uiFramework: "custom-atoms",
        componentPath: "Div",
        gridDefination: {
          xs: 2,
          sm: 2
        },
        props: {
          style: {
            width: "100%",
            float: "right",
            cursor: "pointer"
          }
        },
        children: {
          closeButton: {
            componentPath: "Button",
            props: {
              style: {
                float: "right",
                marginRight: "-15px",
                paddingRight: "0px",
                color: "rgba(0, 0, 0, 0.60)"
              }
            },
            children: {
              previousButtonIcon: {
                uiFramework: "custom-atoms",
                componentPath: "Icon",
                props: {
                  iconName: "close"
                }
              }
            },
            onClickDefination: {
              action: "condition",
              callBack: (state, dispatch) => {
                showHideAdhocPopupopmsForward(state, dispatch, "roadcutnoc-search-preview")
                set(state,
                  "screenConfiguration.preparedFinalObject.documentsUploadRedux[0]",
                  ""
                )
                window.location.reload();
              }
            }
          }
        }
      }
    }
  },

  adhocRebateCardSeRoadCutForward: getCommonContainer(
    {
      documentDetails,
      ContainerSeRoadCutForward: getCommonContainer({

        FieldSeRoadCutForwardRemarks: getTextField({
          label: {
            labelName: "Enter Remarks",
            labelKey: "NOC_SE_ROAD_CUT_FORWARD_POPUP_REMARKS_LABEL"
          },
          placeholder: {
            labelName: "Enter Remarks",
            labelKey: "NOC_SE_ROAD_CUT_FORWARD_POPUP_REMARKS_LABEL"
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
          props: {

            className: "textfield-enterable-selection",
            multiline: true,
            rows: "4"
          },
          jsonPath: "OPMS[0].RoadCutUpdateStautsDetails.additionalDetail.remarks",
          required: true,
          pattern: getOPMSPattern("Remarks"),

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
            width: "180px",
            height: "48px",
            marginRight: "16px",
            marginBottom: "8px"
          }
        },
        children: {
          previousButtonLabel: getLabel({
            labelName: "CANCEL",
            labelKey: "NOC_CANCEL_SE_ROAD_CUT_FORWARD"
          })
        },
        onClickDefination: {
          action: "condition",
          callBack: (state, dispatch) => {
            showHideAdhocPopupopmsForward(state, dispatch, "roadcutnoc-search-preview")
            set(state,
              "screenConfiguration.preparedFinalObject.documentsUploadRedux[0]",
              ""
            )
            window.location.reload();
          }
        }
      },
      addButton: {
        componentPath: "Button",
        props: {
          variant: "contained",
          color: "primary",
          style: {
            width: "180px",
            height: "48px",
            marginBottom: "8px"
          }
        },
        children: {
          previousButtonLabel: getLabel({
            labelName: "Submit",
            labelKey: "NOC_SUBMIT_SE_ROAD_CUT_FORWARD"
          })
        },
        onClickDefination: {
          action: "condition",
          callBack: updateAdhocRoadCutForward
        }
      }
    }
  }

});




export const adhocPopupAdvertisementWithdraw = getCommonContainer({
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
          xs: 10,
          sm: 10
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
              labelKey: "NOC_REMARKS_ADVERTISEMENT"
            },
            {
              style: {
                fontSize: "20px"
              }
            }
          )
        }
      },
      div2: {
        uiFramework: "custom-atoms",
        componentPath: "Div",
        gridDefination: {
          xs: 2,
          sm: 2
        },
        props: {
          style: {
            width: "100%",
            float: "right",
            cursor: "pointer"
          }
        },
        children: {
          closeButton: {
            componentPath: "Button",
            props: {
              style: {
                float: "right",
                marginRight: "-15px",
                paddingRight: "0px",
                color: "rgba(0, 0, 0, 0.60)"
              }
            },
            children: {
              previousButtonIcon: {
                uiFramework: "custom-atoms",
                componentPath: "Icon",
                props: {
                  iconName: "close"
                }
              }
            },
            onClickDefination: {
              action: "condition",
              callBack: (state, dispatch) => {
                showHideAdhocPopup(state, dispatch, "advertisementnoc-search-preview")
                window.location.reload();
              }
            }
          }
        }
      }
    }
  },

  adhocPopupAdvertisementWithdrawRemarkCard: getCommonContainer(
    {
      advertisementWithdrawRemarkContainer: getCommonContainer({

        advertisementWithdrawRemarkField: getTextField({
          label: {
            labelName: "Enter Remarks",
            labelKey: "NOC_ADVERTISEMENT_WITHDRAW_REMARK_LABEL"
          },
          placeholder: {
            labelName: "Enter Remarks",
            labelKey: "NOC_ADVERTISEMENT_WITHDRAW_REMARK_LABEL"
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
          props: {

            className: "textfield-enterable-selection",
            multiline: true,
            rows: "4"
          },
          jsonPath: "advertisement[0].withdraw.Remark",
          required: true,
          pattern: getOPMSPattern("Remarks"),
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
            width: "180px",
            height: "48px",
            marginRight: "16px",
            marginBottom: "8px"
          }
        },
        children: {
          previousButtonLabel: getLabel({
            labelName: "CANCEL",
            labelKey: "NOC_CANCEL_ADVERTISEMENT"
          })
        },
        onClickDefination: {
          action: "condition",
          callBack: (state, dispatch) => {
            showHideAdhocPopup(state, dispatch, "advertisementnoc-search-preview")
            window.location.reload();
          }
        }
      },
      addButton: {
        componentPath: "Button",
        props: {
          variant: "contained",
          color: "primary",
          style: {
            width: "180px",
            height: "48px",
            marginBottom: "8px"
          }
        },
        children: {
          previousButtonLabel: getLabel({
            labelName: "Submit",
            labelKey: "NOC_SUBMIT_ADVERTISEMENT"
          })
        },
        onClickDefination: {
          action: "condition",
          callBack: updateAdhocAdvWithdraw
        }
      }
    }
  }
});

