import React from "react";
import { connect } from "react-redux";
import {TaskStatusContainer} from "egov-workflow/ui-containers-local";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import { Footer } from "../../ui-molecules-local";
import {
  getQueryArg,
  addWflowFileUrl,
  orderWfProcessInstances,
  getMultiUnits
} from "egov-ui-framework/ui-utils/commons";
import { convertDateToEpoch } from "egov-ui-framework/ui-config/screens/specs/utils";

import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { httpRequest } from "egov-ui-framework/ui-utils/api";
import get from "lodash/get";
import set from "lodash/set";
import find from "lodash/find";
import {
  localStorageGet,
  getUserInfo
} from "egov-ui-kit/utils/localStorageUtils";
import orderBy from "lodash/orderBy";
import { WF_ALLOTMENT_OF_SITE, WF_BB_PROPERTY_MASTER } from "../../ui-constants";

class WorkFlowContainer extends React.Component {
  state = {
    open: false,
    action: ""
  };

  componentDidMount = async () => {
    const { prepareFinalObject, toggleSnackbar } = this.props;
    const fileNumber = getQueryArg(
      window.location.href,
      "fileNumber"
    );
    const applicationNumber = getQueryArg(
      window.location.href, "applicationNumber"
    )
    const tenantId = getQueryArg(window.location.href, "tenantId");
    let queryObject = [
      { key: "history", value: true },
      { key: "tenantId", value: tenantId }
    ];
    switch(this.props.moduleName) {
      case WF_ALLOTMENT_OF_SITE : 
        queryObject = [...queryObject,
          { key: "businessIds", value: fileNumber }
      ]
      break;
      case WF_BB_PROPERTY_MASTER : 
        queryObject = [...queryObject,
          { key: "businessIds", value: fileNumber }
      ]
      break;
      default: {
        queryObject = [
          ...queryObject,
          {key: "businessIds", value: applicationNumber}
        ]
      }
    }
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
      case "FORWARD_COMMERCIAL":
      case "FORWARD_RESIDENTIAL":
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
      case "SENTBACK":
      case "SENDBACK":
        return "purpose=sendback&status=success";
      case "REFER":
        return "purpose=refer&status=success";
      case "SENDBACKTOCITIZEN":
        return "purpose=sendbacktocitizen&status=success";
      case "SUBMIT_APPLICATION":
        return "purpose=apply&status=success";
    }
  };

  wfUpdate = async label => {
    let {
      toggleSnackbar,
      preparedFinalObject,
      dataPath,
      moduleName,
      updateUrl,
      documentsJsonPath
    } = this.props;
    const tenant = getQueryArg(window.location.href, "tenantId");
    let data = get(preparedFinalObject, dataPath, []);

    if(!!documentsJsonPath) {
      let documents = get(preparedFinalObject, documentsJsonPath)
      documents = documents.map(item => ({...item, isActive: true}))
      data = [{...data[0], applicationDocuments: [...data[0].applicationDocuments, ...documents]}]
    }

    if (moduleName === WF_ALLOTMENT_OF_SITE) {
      if (getQueryArg(window.location.href, "edited")) {
        // let owners = get(
        //   preparedFinalObject
        // )
        const removedDocs = get(
          preparedFinalObject,
          "PropertiesTemp[0].removedDocs",
          []
        );
        // if (data[0] && data[0].commencementDate) {
        //   data[0].commencementDate = convertDateToEpoch(
        //     data[0].commencementDate,
        //     "dayend"
        //   );
        // }
        let owners = get(data[0], "propertyDetails.owners");
        owners = (owners && this.convertOwnerDobToEpoch(owners)) || [];
        set(data[0], "propertyDetails.owners", owners);
        owners.map((item, index) => {
          set(data[0], `propertyDetails.owners[${index}].ownerDetails.ownerDocuments`, [
            ...get(data[0], `propertyDetails.owners[${index}].ownerDetails.ownerDocuments`, []),
            ...removedDocs
          ]);
        })
      }
    }
    try {
      const payload = await httpRequest("post", updateUrl, "", [], {
        [dataPath]: data
      });
      this.setState({
        open: false
      });
      if (payload) {
        let path = "";
        switch(this.props.moduleName) {
          case WF_ALLOTMENT_OF_SITE: 
            path = `&fileNumber=${data[0].fileNumber}&tenantId=${tenant}&type=${this.props.moduleName}`
            break;
          default: {
            const {branchType, moduleType, applicationType} = data[0];
            const type = `${branchType}_${moduleType}_${applicationType}`;
            path = `&applicationNumber=${data[0].applicationNumber}&tenantId=${tenant}&type=${type}`
          }
        }
        window.location.href = `acknowledgement?${this.getPurposeString(
          label
        )}${path}`;
      }
    } catch (e) {
          toggleSnackbar(
            true,
            {
              labelName: "Workflow update error!",
              labelKey: "ES_ERR_WF_UPDATE_ERROR"
            },
            "error"
          );
        }
    }

  createWorkFLow = async (label, isDocRequired) => {
    const { toggleSnackbar, dataPath, preparedFinalObject, documentsJsonPath } = this.props;
    let data = {};

    if (dataPath == "BPA" || dataPath == "Assessment" || dataPath == "Property") {

      data = get(preparedFinalObject, dataPath, {})
    } else {
      data = get(preparedFinalObject, dataPath, [])
      data = data[0];
    }
    //setting the action to send in RequestInfo
    let appendToPath = ""
    if (dataPath === "FireNOCs") {
      appendToPath = "fireNOCDetails."
    } else if (dataPath === "Assessment" || dataPath === "Property") {
      appendToPath = "workflow."
    } else {
      appendToPath = ""
    }


    set(data, `${appendToPath}action`, label);

    if (isDocRequired) {
      const documents = !!documentsJsonPath ? get(preparedFinalObject, documentsJsonPath) : get(data, "wfDocuments");
      if (documents && documents.length > 0) {
        this.wfUpdate(label);
      } else {
        toggleSnackbar(
          true,
          { labelName: "Please Upload file !", labelKey: "ES_ERR_UPLOAD_FILE" },
          "error"
        );
      }
    } else {
      this.wfUpdate(label);
    }
  };

  getRedirectUrl = (action, businessId, moduleName) => {
    const {preparedFinalObject, dataPath} = this.props
    let data = get(preparedFinalObject, dataPath, []) || []
    const {billingBusinessService} = !!data.length ? data[0] : ""
    console.log("modulenamewater", moduleName);
    const isAlreadyEdited = getQueryArg(window.location.href, "edited");
    const tenant = getQueryArg(window.location.href, "tenantId");
    const { ProcessInstances } = this.props;
    let applicationStatus;
    if (ProcessInstances && ProcessInstances.length > 0) {
      applicationStatus = get(ProcessInstances[ProcessInstances.length - 1], "state.applicationStatus");
    }
    let baseUrl = "";
    let bservice = "";
    baseUrl = "estate"
    const payUrl = `/estate/pay?consumerCode=${businessId}&tenantId=${tenant}`;
    switch (action) {
      case "PAY": return billingBusinessService ? `${payUrl}&businessService=${billingBusinessService}` : payUrl;
      case "EDIT": return isAlreadyEdited
        ? `/${baseUrl}/apply?applicationNumber=${businessId}&tenantId=${tenant}&action=edit&edited=true`
        : `/${baseUrl}/apply?applicationNumber=${businessId}&tenantId=${tenant}&action=edit`;
    }
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
      //Added condition as edit option is not needed for employee module
      let typeUser = userRoles.find((item) => {
        return item.code == "CITIZEN"
      });

      if (typeUser) {
            editAction = {
            buttonLabel: "EDIT",
            moduleName: moduleName,
            tenantId: state.tenantId,
            isLast: true,
            buttonUrl: this.getRedirectUrl("EDIT", businessId, moduleName)
          };
      }
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
    // let businessService = moduleName
    let businessService = moduleName === data[0].businessService ? moduleName : data[0].businessService;
    if(!moduleName) {
      const {dataPath, preparedFinalObject} = this.props
      let _data = get(preparedFinalObject, dataPath, []);
      businessService = _data[0].workFlowBusinessService
    }
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
        showEmployeeList: !checkIfTerminatedState(item.nextState, businessService) && item.action !== "SENDBACKTOCITIZEN",
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
      moduleName,
      documentProps,
      screenName,
      validateFn
    } = this.props;
    const workflowContract =
      ProcessInstances &&
      ProcessInstances.length > 0 &&
      this.prepareWorkflowContract(ProcessInstances, moduleName);
     let showFooter;
      if(moduleName==='NewWS1'||moduleName==='NewSW1'){
         showFooter=true;
      }else{
         showFooter=process.env.REACT_APP_NAME === "Citizen" ? false : true;
      }
    return (
      <div>
        {ProcessInstances && ProcessInstances.length > 0 && (
          <TaskStatusContainer ProcessInstances={ProcessInstances} />
        )}
        {showFooter &&
          <Footer
            handleFieldChange={prepareFinalObject}
            variant={"contained"}
            color={"primary"}
            onDialogButtonClick={this.createWorkFLow}
            contractData={workflowContract}
            dataPath={dataPath}
            moduleName={moduleName}
            documentProps={documentProps}
            screenName={screenName}
            validateFn={validateFn}
          />}
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
    setRoute: route => dispatch(setRoute(route))
  };
};

export default connect(
  mapStateToProps,
  mapDispacthToProps
)(WorkFlowContainer);
