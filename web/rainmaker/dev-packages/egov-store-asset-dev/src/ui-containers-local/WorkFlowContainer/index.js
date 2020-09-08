import React from "react";
import { connect } from "react-redux";
import TaskStatusContainer from "egov-workflow/ui-containers-local/TaskStatusContainer";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import Footer from "egov-workflow/ui-molecules-local/Footer";
import {
  getQueryArg,
  addWflowFileUrl,
  orderWfProcessInstances,
  getMultiUnits
} from "egov-ui-framework/ui-utils/commons";
import { convertDateToEpoch } from "egov-ui-framework/ui-config/screens/specs/utils";

import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { toggleSnackbar, toggleSpinner } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { httpRequest } from "egov-ui-framework/ui-utils/api";
import get from "lodash/get";
import set from "lodash/set";
import find from "lodash/find";
import {
  localStorageGet,
  getUserInfo
} from "egov-ui-kit/utils/localStorageUtils";
import orderBy from "lodash/orderBy";
import { data } from "jquery";

const tenant = getQueryArg(window.location.href, "tenantId");

class WorkFlowContainer extends React.Component {
  state = {
    open: false,
    action: ""
  };

  componentDidMount = async () => {
    const { prepareFinalObject, toggleSnackbar } = this.props;
    const applicationNumber = getQueryArg(
      window.location.href,
      "applicationNumber"
    );
    const tenantId = getQueryArg(window.location.href, "tenantId");
    const queryObject = [
      { key: "businessIds", value: applicationNumber },
      { key: "history", value: true },
      { key: "tenantId", value: tenantId }
    ];
    try {
      const payload = await httpRequest(
        "post",
        "egov-workflow-v2/egov-wf/process/_search",
        "",
        queryObject
      );
      if (payload && payload.ProcessInstances.length > 0) {
        const processInstances = orderWfProcessInstances(
          payload.ProcessInstances
        );
        addWflowFileUrl(processInstances, prepareFinalObject);
      } else {
        toggleSnackbar(
          true,
          {
            labelName: "Workflow returned empty object !",
            labelKey: "WRR_WORKFLOW_ERROR"
          },
          "error"
        );
      }
    } catch (e) {
      toggleSnackbar(
        true,
        {
          labelName: "Workflow returned empty object !",
          labelKey: "WRR_WORKFLOW_ERROR"
        },
        "error"
      );
    }
  };

  onClose = () => {
    this.setState({
      open: false
    });
  };

  getPurposeString = action => {
    switch (action) {
      case "APPLY":
        return "purpose=apply&status=success";
      case "FORWARD":
      case "RESUBMIT":
        return "purpose=forward&status=success";
      case "MARK":
        return "purpose=mark&status=success";
      case "VERIFY":
        return "purpose=verify&status=success";
      case "REJECT":
        return "purpose=application&status=rejected";
      case "CANCEL":
        return "purpose=application&status=cancelled";
      case "APPROVE":
        return "purpose=approve&status=success";
      case "SENDBACK":
        return "purpose=sendback&status=success";
      case "REFER":
        return "purpose=refer&status=success";
      case "SENDBACKTOCITIZEN":
        return "purpose=sendbacktocitizen&status=success";
      case "SUBMIT_APPLICATION":
        return "purpose=apply&status=success";
      case "RESUBMIT_APPLICATION":
        return "purpose=forward&status=success";
      case "SEND_BACK_TO_CITIZEN":
        return "purpose=sendback&status=success";
      case "VERIFY_AND_FORWARD":
        return "purpose=forward&status=success";
      case "SEND_BACK_FOR_DOCUMENT_VERIFICATION":
      case "SEND_BACK_FOR_FIELD_INSPECTION":
        return "purpose=sendback&status=success";
      case "APPROVE_FOR_CONNECTION":
        return "purpose=approve&status=success";
      case "ACTIVATE_CONNECTION":
        return "purpose=activate&status=success";
      case "REVOCATE":
        return "purpose=application&status=revocated"
    }
  };

  wfUpdate = async label => {
    let {
      toggleSnackbar,
      preparedFinalObject,
      dataPath,
      moduleName,
      updateUrl,
      setRoute,
      toggleSpinner
    } = this.props;
    const tenant = getQueryArg(window.location.href, "tenantId");
    let data = get(preparedFinalObject, dataPath, []);
    const applicationNumber = getQueryArg(
      window.location.href,
      "applicationNumber"
    );
    try {
      let queryObject = [
        {
          key: "tenantId",
          value: data[0].tenantId
        }
      ];
      data[0].workFlowDetails.tenantId = data[0].tenantId
      let wfUpdatePayload = {}
      wfUpdatePayload[`${dataPath}`] = [];
      wfUpdatePayload[`workFlowDetails`] = data[0].workFlowDetails;
      toggleSpinner();
      const payload = await httpRequest("post", updateUrl, "", queryObject, wfUpdatePayload);
      this.setState({
        open: false
      });
      if (payload) {
        let path = "";
        toggleSpinner();
        if (moduleName === "StoreManagement") {
          setRoute('/inbox')
        }
      }
    } catch (e) {
      toggleSpinner();
      toggleSnackbar(
        true,
        {
          labelName: "Workflow update error!",
          labelKey: "ERR_WF_UPDATE_ERROR"
        },
        "error"
      );
    }
  };

  createWorkFLow = async (label, isDocRequired) => {
    const { toggleSnackbar, dataPath, preparedFinalObject } = this.props;
    let data = {};

    if (dataPath == "BPA" || dataPath == "Assessment" || dataPath == "Property") {

      data = get(preparedFinalObject, dataPath, {})
    } else {
      data = get(preparedFinalObject, dataPath, [])
      data = data[0];
    }
    //setting the action to send in RequestInfo
    let appendToPath = ""

    if (dataPath === "indents" || dataPath === "materialIssues" || dataPath === "purchaseOrders" || dataPath === "materialReceipt" || dataPath === "transferInwards") {

      var validated = true;

      if (data.workFlowDetails.comments.length === 0) {
        validated = false;
        toggleSnackbar(
          true,
          { labelName: "Please provide comments", labelKey: "ERR_PLEASE_PROVIDE_COMMENTS" },
          "error"
        );
      }

      if (data.workFlowDetails.comments.length > 128) {
        validated = false;
        toggleSnackbar(
          true,
          { labelName: "Invalid comment length", labelKey: "ERR_INVALID_COMMENT_LENGTH" },
          "error"
        );
      }


      if (validated) {
        data.workFlowDetails = data.workFlowDetails
        this.wfUpdate(label);

      }
      return;

    }



    set(data, `${appendToPath}action`, label);

    if (isDocRequired) {
      const documents = get(data, "wfDocuments");
      if (documents && documents.length > 0) {
        this.wfUpdate(label);
      } else {
        toggleSnackbar(
          true,
          { labelName: "Please Upload file !", labelKey: "ERR_UPLOAD_FILE" },
          "error"
        );
      }
    } else {
      this.wfUpdate(label);
    }
  };

  getRedirectUrl = (action, businessId, moduleName) => {
    console.log("modulenamewater", moduleName);
    const isAlreadyEdited = getQueryArg(window.location.href, "edited");
    const tenant = getQueryArg(window.location.href, "tenantId");
    const { ProcessInstances, preparedFinalObject, dataPath } = this.props;
    let applicationStatus;
    if (ProcessInstances && ProcessInstances.length > 0) {
      applicationStatus = get(ProcessInstances[ProcessInstances.length - 1], "state.applicationStatus");
    }
    let editUrl = "";
    if (dataPath === "indents") {
      if (businessId.includes("TRIN")) {
        let indentdata = get(preparedFinalObject, dataPath, [])
        indentdata = indentdata[0];
        let indentId = indentdata.id
        editUrl = `/egov-store-asset/create-material-transfer-indent?id=${indentId}&tenantId=${tenant}`;
      } else {
        editUrl = `/egov-store-asset/creatindent?tenantId=${tenant}`;
      }
    } else if (dataPath === "materialIssues") {
      if (businessId.includes("MRNIN")) {
        editUrl = `/egov-store-asset/createMaterialNonIndentNote?tenantId=${tenant}&issueNoteNumber=${businessId}`;
      } else if (businessId.includes("MROW")) {
        let indentissuedata = get(preparedFinalObject, dataPath, [])
        indentissuedata = indentissuedata[0];
        let id = indentissuedata.id;
        editUrl = `/egov-store-asset/create-material-transfer-outward?id=${id}&tenantId=${tenant}`;
      } else if (businessId.includes("MRIN")) {
        let indentissuedata = get(preparedFinalObject, dataPath, [])
        indentissuedata = indentissuedata[0];
        let issueIndentNumber = indentissuedata.indent.id
        editUrl = `/egov-store-asset/createMaterialIndentNote?step=0&IndentId=${issueIndentNumber}`;
      }
    }
    else if (dataPath === "purchaseOrders") {
      // localhost:3006/egov-store-asset/create-purchase-order?poNumber=PO/00039/2020&tenantId=ch.chandigarh
      editUrl = `/egov-store-asset/create-purchase-order?poNumber=${businessId}&tenantId=${tenant}`;

    } else if (dataPath === "materialReceipt") {
      if (businessId.includes("MMRN")) {
        editUrl = `/egov-store-asset/createMaterialReceiptNoteMisc?tenantId=${tenant}`;
      } else {
        editUrl = `/egov-store-asset/createMaterialReceiptNote?mrnNumber=${businessId}&tenantId=${tenant}`;
      }
    } else if (dataPath === "transferInwards") {
      let transferInwardsdata = get(preparedFinalObject, dataPath, [])
      transferInwardsdata = transferInwardsdata[0];
      let id = transferInwardsdata.id;

      editUrl = `/egov-store-asset/createMaterialTransferInword?id=${id}&tenantId=${tenant}`;
    }
    return editUrl;
  };


  getHeaderName = action => {
    return {
      labelName: `${action} Application`,
      labelKey: `WF_${action}_APPLICATION`
    };
  };

  getEmployeeRoles = (nextAction, currentAction, moduleName) => {
    const businessServiceData = JSON.parse(
      localStorageGet("businessServiceData")
    );
    const data = find(businessServiceData, { businessService: moduleName });
    let roles = [];
    if (nextAction === currentAction) {
      data.states &&
        data.states.forEach(state => {
          state.actions &&
            state.actions.forEach(action => {
              roles = [...roles, ...action.roles];
            });
        });
    } else {
      const states = find(data.states, { uuid: nextAction });
      states &&
        states.actions &&
        states.actions.forEach(action => {
          roles = [...roles, ...action.roles];
        });
    }
    roles = [...new Set(roles)];
    roles.indexOf("*") > -1 && roles.splice(roles.indexOf("*"), 1);
    return roles.toString();
  };

  checkIfTerminatedState = (nextStateUUID, moduleName) => {
    const businessServiceData = JSON.parse(
      localStorageGet("businessServiceData")
    );
    const data = businessServiceData && businessServiceData.length > 0 ? find(businessServiceData, { businessService: moduleName }) : [];
    // const nextState = data && data.length > 0 find(data.states, { uuid: nextStateUUID });

    const isLastState = data ? find(data.states, { uuid: nextStateUUID }).isTerminateState : false;
    return isLastState;
  };

  checkIfDocumentRequired = (nextStateUUID, moduleName) => {
    const businessServiceData = JSON.parse(
      localStorageGet("businessServiceData")
    );
    const data = find(businessServiceData, { businessService: moduleName });
    const nextState = find(data.states, { uuid: nextStateUUID });
    return nextState.docUploadRequired;
  };

  getActionIfEditable = (status, businessId, moduleName) => {
    const businessServiceData = JSON.parse(
      localStorageGet("businessServiceData")
    );
    const data = find(businessServiceData, { businessService: moduleName });
    const state = find(data.states, { applicationStatus: status });
    let actions = [];
    state.actions &&
      state.actions.forEach(item => {
        actions = [...actions, ...item.roles];
      });
    const userRoles = JSON.parse(getUserInfo()).roles;
    const roleIndex = userRoles.findIndex(item => {
      if (actions.indexOf(item.code) > -1) return true;
    });

    let editAction = {};
    if (state.isStateUpdatable && actions.length > 0 && roleIndex > -1) {
      editAction = {
        buttonLabel: "EDIT",
        moduleName: moduleName,
        tenantId: state.tenantId,
        isLast: true,
        buttonUrl: this.getRedirectUrl("EDIT", businessId, moduleName)
      };
    }
    return editAction;
  };

  prepareWorkflowContract = (data, moduleName) => {
    const {
      getRedirectUrl,
      getHeaderName,
      checkIfTerminatedState,
      getActionIfEditable,
      checkIfDocumentRequired,
      getEmployeeRoles
    } = this;
    let businessService = moduleName === data[0].businessService ? moduleName : data[0].businessService;
    let businessId = get(data[data.length - 1], "businessId");
    let filteredActions = [];

    filteredActions = get(data[data.length - 1], "nextActions", []).filter(
      item => item.action != "ADHOC"
    );
    let applicationStatus = get(
      data[data.length - 1],
      "state.applicationStatus"
    );
    let actions = orderBy(filteredActions, ["action"], ["desc"]);

    actions = actions.map(item => {
      return {
        buttonLabel: item.action,
        moduleName: data[data.length - 1].businessService,
        isLast: item.action === "PAY" ? true : false,
        buttonUrl: getRedirectUrl(item.action, businessId, businessService),
        dialogHeader: getHeaderName(item.action),
        showEmployeeList: (businessService === "NewWS1" || businessService === "NewSW1") ? !checkIfTerminatedState(item.nextState, businessService) && item.action !== "SEND_BACK_TO_CITIZEN" && item.action !== "RESUBMIT_APPLICATION" : !checkIfTerminatedState(item.nextState, businessService) && item.action !== "SENDBACKTOCITIZEN",
        roles: getEmployeeRoles(item.nextState, item.currentState, businessService),
        isDocRequired: checkIfDocumentRequired(item.nextState, businessService)
      };
    });
    actions = actions.filter(item => item.buttonLabel !== 'INITIATE');
    let editAction = getActionIfEditable(
      applicationStatus,
      businessId,
      businessService
    );
    editAction.buttonLabel && actions.push(editAction);
    return actions;
  };

  convertOwnerDobToEpoch = owners => {
    let updatedOwners =
      owners &&
      owners
        .map(owner => {
          return {
            ...owner,
            dob:
              owner && owner !== null && convertDateToEpoch(owner.dob, "dayend")
          };
        })
        .filter(item => item && item !== null);
    return updatedOwners;
  };

  render() {
    const {
      ProcessInstances,
      prepareFinalObject,
      dataPath,
      moduleName
    } = this.props;
    const workflowContract =
      ProcessInstances &&
      ProcessInstances.length > 0 &&
      this.prepareWorkflowContract(ProcessInstances, moduleName);
    let assignee = ProcessInstances &&
      ProcessInstances.length > 0 && get(
        ProcessInstances[ProcessInstances.length - 1],
        "assignee"
      );
    let showFooter = false;
    let assigneeflag = false;
    if (assignee) {
      assigneeflag = true;
      const uuid = JSON.parse(getUserInfo()).uuid;
      if (uuid === assignee.uuid) {
        showFooter = true;
      }
    }
    return (
      <div>
        {ProcessInstances && ProcessInstances.length > 0 && (
          <TaskStatusContainer ProcessInstances={ProcessInstances} moduleName={moduleName} />
        )}
        {assigneeflag && showFooter && (
          <Footer
            handleFieldChange={prepareFinalObject}
            variant={"contained"}
            color={"primary"}
            onDialogButtonClick={this.createWorkFLow}
            contractData={workflowContract}
            dataPath={dataPath}
            moduleName={moduleName}
          />
        )}
        {!assigneeflag && (
          <Footer
            handleFieldChange={prepareFinalObject}
            variant={"contained"}
            color={"primary"}
            onDialogButtonClick={this.createWorkFLow}
            contractData={workflowContract}
            dataPath={dataPath}
            moduleName={moduleName}
          />
        )}

      </div>
    );
  }
}

const mapStateToProps = state => {
  const { screenConfiguration } = state;
  const { preparedFinalObject } = screenConfiguration;
  const { workflow } = preparedFinalObject;
  const { ProcessInstances } = workflow || [];
  return { ProcessInstances, preparedFinalObject };
};

const mapDispacthToProps = dispatch => {
  return {
    prepareFinalObject: (path, value) =>
      dispatch(prepareFinalObject(path, value)),
    toggleSnackbar: (open, message, variant) =>
      dispatch(toggleSnackbar(open, message, variant)),
    toggleSpinner: () =>
      dispatch(toggleSpinner()),
    setRoute: route => dispatch(setRoute(route))
  };
};

export default connect(
  mapStateToProps,
  mapDispacthToProps
)(WorkFlowContainer);
