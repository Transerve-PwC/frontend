import React from "react";
import { connect } from "react-redux";
import { ActionDialog } from "../";
import { httpRequest } from "egov-ui-framework/ui-utils/api";
import { getTenantId } from "egov-ui-kit/utils/localStorageUtils";
import { getUserInfo } from "egov-ui-kit/utils/localStorageUtils";
import { Container, Item } from "egov-ui-framework/ui-atoms";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import MenuButton from "egov-ui-framework/ui-molecules/MenuButton";
import get from "lodash/get";
import set from "lodash/set";
import isEmpty from "lodash/isEmpty";
import "./index.css";
import { toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import { WORKFLOW_BUSINESS_SERVICE_OT, WORKFLOW_BUSINESS_SERVICE_DC } from "../../ui-constants";

class Footer extends React.Component {
  state = {
    open: false,
    data: {},
    employeeList: [],
    //responseLength: 0
  };

  findAssigner = (item, processInstances,state) => {
    const findIndex = processInstances.map(processInstance => processInstance.action === item && processInstance.state.applicationStatus === state).lastIndexOf(true)
    return processInstances[findIndex]
  }

  openActionDialog = async item => {
    const { handleFieldChange, setRoute, dataPath, moduleName } = this.props;
    const {preparedFinalObject} = this.props.state.screenConfiguration;
    const {workflow: {ProcessInstances = []}} = preparedFinalObject || {}
    const data = get(
      preparedFinalObject,
      dataPath
    );
    let employeeList = [];
      let action = ""
      switch(item.buttonLabel) {
        case "SENDBACK": {
          action = "FORWARD"
          break
        }
        default : action = ""
      }
      let assignee = [];
      switch(moduleName) {
        case "MasterRP": {
          if(!!action && data[0].masterDataState !== "PM_PENDINGJAVERIFICATION") {
            const {assigner = {}} = this.findAssigner(action, ProcessInstances,data[0].masterDataState) || {}
            assignee = !!assigner.uuid ? [assigner.uuid] : []
          }
          break
        }
        case WORKFLOW_BUSINESS_SERVICE_OT: {
          if(!!action && data[0].applicationState !== "OT_PENDINGCLVERIFICATION") {
            const {assigner = {}} = this.findAssigner(action, ProcessInstances,data[0].applicationState) || {}
            assignee = !!assigner.uuid ? [assigner.uuid] : []
          }
          break
        }
        case "PermissionToMortgage":
        case WORKFLOW_BUSINESS_SERVICE_DC: {
          if(!!action && data[0].state !== "DC_PENDINGCLVERIFICATION" && data[0].state !== "MG_PENDINGCLVERIFICATION") {
            const {assigner = {}} = this.findAssigner(action, ProcessInstances,data[0].state) || {}
            assignee = !!assigner.uuid ? [assigner.uuid] : []
          }
          break
        }
      }
      handleFieldChange(`${dataPath}[0].comment`, "");
      handleFieldChange(`${dataPath}[0].assignee`, assignee);
    if (item.isLast) {
      const url =
        process.env.NODE_ENV === "development"
          ? item.buttonUrl
          : item.buttonUrl;
      setRoute(url);
      return;
    }
    if (item.showEmployeeList) {

     // commented to test the application status change flow as below API is failing.
      const tenantId = getTenantId();
      const queryObj = [
        {
          key: "roles",
          value: item.roles
        },
        {
          key: "tenantId",
          value: tenantId
        }
      ];
      const payload = await httpRequest(
        "post",
        "/egov-hrms/employees/_search",
        "",
        queryObj
      );
      employeeList =
        payload &&
        payload.Employees.map((item, index) => {
          const name = get(item, "user.name");
          return {
            value: item.uuid,
            label: name
          };
        });
    }

    this.setState({ open: true, data: item, employeeList });
  };

  onClose = () => {
    this.setState({
      open: false
    });
  };

  render() {
    const {
      contractData,
      handleFieldChange,
      onDialogButtonClick,
      dataPath,
      moduleName,
      state,
      dispatch,
      setRoute
    } = this.props;
    const { open, data, employeeList } = this.state;
    const transitNumber = getQueryArg(
      window.location.href,
      "transitNumber"
    );
    const tenant = getQueryArg(window.location.href, "tenantId");
    const downloadMenu =
      contractData &&
      contractData.map(item => {
        const { buttonLabel, moduleName } = item;
        return {
          labelName: { buttonLabel },
          labelKey: `WF_${moduleName.toUpperCase()}_${buttonLabel}`,
          link: moduleName === "MasterRP" && buttonLabel === "MODIFY" ? 
            () => setRoute(`/rented-properties/apply?transitNumber=${transitNumber}&tenantId=${tenant}`)
            : () => {
            this.openActionDialog(item);
          }
        };
      });    
    const buttonItems = {
      label: { labelName: "Take Action", labelKey: "WF_TAKE_ACTION" },
      rightIcon: "arrow_drop_down",
      props: {
        variant: "outlined",
        style: {
          marginRight: 15,
          backgroundColor: "#FE7A51",
          color: "#fff",
          border: "none",
          height: "60px",
          width: "200px"
        }
      },
      menu: downloadMenu
    };
    return (
      <div className="apply-wizard-footer" id="custom-atoms-footer">
        {!isEmpty(downloadMenu) && (
          <Container>
            <Item xs={12} sm={12} className="wf-footer-container">
              <MenuButton data={buttonItems} />
            </Item>
          </Container>
        )}
        <ActionDialog
          open={open}
          onClose={this.onClose}
          dialogData={data}
          dropDownData={employeeList}
          handleFieldChange={handleFieldChange}
          onButtonClick={onDialogButtonClick}
          dataPath={dataPath}
          moduleName={moduleName}
          state={state}
          toggleSnackbar={this.props.toggleSnackbar}
        />
      </div>
    );
  }
}

const mapStateToProps = state => {
  return { state };
};

const mapDispatchToProps = dispatch => {
  return {
    setRoute: url => dispatch(setRoute(url)),
    toggleSnackbar: (show, message, type) => dispatch(toggleSnackbar(show, message, type))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Footer);
