import React from "react";
import { connect } from "react-redux";
import { ActionDialog } from "../";
import { httpRequest } from "egov-ui-framework/ui-utils/api";
import { getTenantId } from "egov-ui-kit/utils/localStorageUtils";
import { Container, Item } from "egov-ui-framework/ui-atoms";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import MenuButton from "egov-ui-framework/ui-molecules/MenuButton";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import "./index.css";
import { WF_ALLOTMENT_OF_SITE } from "../../ui-constants";
import store from "../../ui-redux/store";
import {
  toggleSnackbar
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
class Footer extends React.Component {
  state = {
    open: false,
    data: {},
    employeeList: [],
    //responseLength: 0
  };

  findAssigner = (item, processInstances) => {
    const findIndex = processInstances.map(processInstance => processInstance.action === item).lastIndexOf(true)
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
      case "SENTBACK":
      case "SENDBACK": {
        action = "FORWARD"
        break
      }
      default : action = ""
    }
    let assignee = [];
    switch(moduleName) {
      case WF_ALLOTMENT_OF_SITE: {
        if(!!action && data[0].masterDataState !== "PM_PENDING_DA_VERIFICATION") {
          const {assigner = {}} = this.findAssigner(action, ProcessInstances) || {}
          assignee = !!assigner.uuid ? [assigner.uuid] : []
        }
        break
      }
      default: {
        if(!!action && data[0].state !== "ES_PENDING_DS_VERIFICATION"){
          const {assigner = {}} = this.findAssigner(action, ProcessInstances) || {}
          assignee = !!assigner.uuid ? [assigner.uuid] : []
        }
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
    if (item.showEmployeeList && !item.roles.includes("ES_EB_FINANCIAL_OFFICER")) {

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
      documentProps,
      screenName,
      validateFn,
      toggleSnackbar,
      setRoute
    } = this.props;
    const { open, data, employeeList } = this.state;
    const {preparedFinalObject} = this.props.state.screenConfiguration;
    const _data = get(
      preparedFinalObject,
      dataPath
    );
    const dialogData = {...data, documentProps}
    const fileNumber = getQueryArg(window.location.href, "fileNumber")
    const tenant = getQueryArg(window.location.href, "tenantId");
    const downloadMenu =
      contractData &&
      contractData.map(item => {
        const { buttonLabel, moduleName } = item;
        let redirectLink;
        switch(moduleName) {
          case "ES-EB-AllotmentOfSite":
            if (_data[0].propertyMasterOrAllotmentOfSite === "PROPERTY_MASTER") {
              redirectLink = `apply?fileNumber=${fileNumber}&tenantId=${tenant}&stepNumber=9`;
            }
            else {
              redirectLink = `allotment?fileNumber=${fileNumber}&tenantId=${tenant}&stepNumber=6`;
            }
            break;
          case "ES-BB-PropertyMaster":
            redirectLink = `apply-building-branch?fileNumber=${fileNumber}&tenantId=${tenant}&stepNumber=3`;
            break;
          case "ES-MM-PropertyMaster":
            redirectLink = `apply-manimajra?fileNumber=${fileNumber}&tenantId=${tenant}&stepNumber=7`;
            break;
          default:
            break;
        }
        return {
          labelName: { buttonLabel },
          labelKey: `WF_${moduleName.toUpperCase()}_${buttonLabel}`,
          link: redirectLink ? () => window.location.href = redirectLink : () => {
            if (screenName == "noc-verification") {
              let isNocFormValid = validateFn(this.props.state);
              if (isNocFormValid) {
                this.openActionDialog(item);
              }
              else {
                let errorMessage = {
                  labelName: "Please fill all mandatory fields !",
                  labelKey: "ES_ERR_FILL_MANDATORY_FIELDS_NOC"
                };
                toggleSnackbar(true, errorMessage, "warning");
              }
            } 
            else {
              this.openActionDialog(item);
            }
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
          dialogData={dialogData}
          dropDownData={employeeList}
          handleFieldChange={handleFieldChange}
          onButtonClick={onDialogButtonClick}
          dataPath={dataPath}
          state={this.props.state}
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
    toggleSnackbar: (open, message, variant) =>
      dispatch(toggleSnackbar(open, message, variant))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Footer);
