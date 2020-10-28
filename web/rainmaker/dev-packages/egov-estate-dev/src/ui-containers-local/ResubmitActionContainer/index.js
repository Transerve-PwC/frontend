import React from "react";
import { connect } from "react-redux";
import { ActionDialog } from "../../ui-molecules-local";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import "./index.css";
import {
  getQueryArg,
} from "egov-ui-framework/ui-utils/commons";
import { toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { httpRequest } from "egov-ui-framework/ui-utils/api";
import get from "lodash/get";
import set from "lodash/set";

const tenant = getQueryArg(window.location.href, "tenantId");
class ResubmitActionContainer extends React.Component {
  state = {
    open: false,
    data: {},
  };

  wfUpdate = async label => {
    let {
      toggleSnackbar,
      preparedFinalObject,
      dataPath,
      updateUrl,
      documentsJsonPath
    } = this.props;
    let data = get(preparedFinalObject, dataPath, []);

    if(!!documentsJsonPath) {
      let documents = get(preparedFinalObject, documentsJsonPath) || [];
      documents = documents.map(item => ({...item, isActive: true}))
      data = [{...data[0], applicationDocuments: [...data[0].applicationDocuments, ...documents]}] 
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
        const {branchType, moduleType, applicationType} = data[0];
        const type = `${branchType}_${moduleType}_${applicationType}`;
        path = `&applicationNumber=${data[0].applicationNumber}&tenantId=${tenant}&type=${type}`;
        window.location.href = `acknowledgement?purpose=submit&status=success${path}`;
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
  };

  createWorkFLow = async (label, isDocRequired) => {
    const { toggleSnackbar, dataPath, preparedFinalObject, documentsJsonPath } = this.props;
    let data = get(preparedFinalObject, dataPath, []);

    if (dataPath !== "BPA") {
      data = data[0];
    }
  
    //setting the action to send in RequestInfo
    let appendToPath = dataPath === "FireNOCs" ? "fireNOCDetails." : "";
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

  openActionDialog = item => {
    const { prepareFinalObject, dataPath } = this.props;
    prepareFinalObject(`${dataPath}[0].comment`, "");
    prepareFinalObject(`${dataPath}[0].assignee`, []);
    this.setState({ open: true, data: item });
  };

  onClose = () => {
    const { prepareFinalObject } = this.props;
    prepareFinalObject("ResubmitAction", false)

  };

  render() {
    const {
      prepareFinalObject,
      dataPath,
    } = this.props;
    const { open, data } = this.props;
    console.log("===this.props", this.props)
    return (
      <div className="apply-wizard-footer" id="custom-atoms-footer">
        <ActionDialog
          open={open}
          onClose={this.onClose}
          dialogData={data}
          handleFieldChange={prepareFinalObject}
          onButtonClick={this.createWorkFLow}
          dataPath={dataPath}
          state={this.props.state}
        />
      </div>
    );
  }
}

const mapStateToProps = state => {
  const { screenConfiguration } = state;
  const { preparedFinalObject } = screenConfiguration;
  const { workflow } = preparedFinalObject;
  const { ProcessInstances } = workflow || [];
  const { ResubmitAction: open } = preparedFinalObject;
  return { ProcessInstances, preparedFinalObject, open, state };

};

const mapDispatchToProps = dispatch => {
  return {
    prepareFinalObject: (path, value) =>
      dispatch(prepareFinalObject(path, value)),
    toggleSnackbar: (open, message, variant) =>
      dispatch(toggleSnackbar(open, message, variant))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ResubmitActionContainer);
